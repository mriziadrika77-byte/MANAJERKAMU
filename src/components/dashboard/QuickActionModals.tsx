import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ActivityCategory, ExpenseCategory } from '@/types';

export type QuickModalType = 'activity' | 'income' | 'expense' | 'schedule' | null;

interface QuickActionModalsProps {
  modalType: QuickModalType;
  onClose: () => void;
}

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({ modalType, onClose }) => {
  const { activities, addActivity, addIncome, addExpense, addSchedule } = useApp();
  const { toast } = useToast();

  // 1. Activity Form State
  const [actName, setActName] = useState('');
  const [actCategory, setActCategory] = useState<ActivityCategory>('Project-based');
  const [actClient, setActClient] = useState('');
  const [actTarget, setActTarget] = useState('');
  const [actCost, setActCost] = useState('');
  const [actDesc, setActDesc] = useState('');

  // 2. Income State
  const [incActivityId, setIncActivityId] = useState(activities[0]?.id || '');
  const [incAmount, setIncAmount] = useState('');
  const [incReceived, setIncReceived] = useState('');
  const [incSource, setIncSource] = useState('');
  const [incDesc, setIncDesc] = useState('');

  // 3. Expense State
  const [expActivityId, setExpActivityId] = useState(activities[0]?.id || '');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Operational');
  const [expDesc, setExpDesc] = useState('');

  // 4. Schedule State
  const [schActivityId, setSchActivityId] = useState(activities[0]?.id || '');
  const [schTitle, setSchTitle] = useState('');
  const [schDate, setSchDate] = useState(new Date().toISOString().split('T')[0]);
  const [schStart, setSchStart] = useState('10:00');
  const [schEnd, setSchEnd] = useState('12:00');

  // Handle Activity Submit
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName.trim() || !actClient.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Nama aktivitas dan klien/platform wajib diisi.', type: 'danger' });
      return;
    }

    addActivity({
      name: actName,
      category: actCategory,
      clientOrPlatform: actClient,
      paymentModel: 'Fixed / Milestone',
      description: actDesc || 'Aktivitas pekerjaan baru terintegrasi.',
      expectedIncome: parseFloat(actTarget) || 0,
      operationalCost: parseFloat(actCost) || 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      hoursWorked: 0,
    });

    toast({
      title: 'Aktivitas Ditambahkan',
      message: `Aktivitas "${actName}" berhasil didaftarkan.`,
      type: 'success',
    });

    onClose();
    resetForms();
  };

  // Handle Income Submit
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invNum = parseFloat(incAmount);
    if (!invNum || invNum <= 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal tagihan harus lebih dari 0.', type: 'danger' });
      return;
    }

    const recNum = parseFloat(incReceived) || invNum;
    const selectedAct = activities.find((a) => a.id === incActivityId);

    addIncome({
      activityId: incActivityId,
      activityName: selectedAct ? selectedAct.name : 'Unassigned Activity',
      description: incDesc || 'Pemasukan aktivitas',
      invoiceAmount: invNum,
      receivedAmount: recNum,
      date: new Date().toISOString().split('T')[0],
      paymentSource: incSource || 'Klien / Platform',
    });

    toast({
      title: 'Pemasukan Tersimpan',
      message: `Kas masuk Rp ${recNum.toLocaleString('id-ID')} memperbarui dashboard.`,
      type: 'success',
    });

    onClose();
    resetForms();
  };

  // Handle Expense Submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expNum = parseFloat(expAmount);
    if (!expNum || expNum <= 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal pengeluaran harus lebih dari 0.', type: 'danger' });
      return;
    }

    const selectedAct = activities.find((a) => a.id === expActivityId);

    addExpense({
      activityId: expActivityId || undefined,
      activityName: selectedAct ? selectedAct.name : 'General Expense',
      description: expDesc || 'Pengeluaran operasional',
      category: expCategory,
      amount: expNum,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Transfer Bank / Kas',
    });

    toast({
      title: 'Pengeluaran Tersimpan',
      message: `Biaya Rp ${expNum.toLocaleString('id-ID')} dicatat ke kas.`,
      type: 'success',
    });

    onClose();
    resetForms();
  };

  // Handle Schedule Submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schTitle.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Judul agenda pekerjaan wajib diisi.', type: 'danger' });
      return;
    }

    const [startH, startM] = schStart.split(':').map(Number);
    const [endH, endM] = schEnd.split(':').map(Number);
    const duration = Math.round(((endH * 60 + endM - (startH * 60 + startM)) / 60) * 10) / 10;

    const selectedAct = activities.find((a) => a.id === schActivityId);

    const { hasConflict } = addSchedule({
      activityId: schActivityId,
      activityName: selectedAct ? selectedAct.name : 'General Schedule',
      title: schTitle,
      date: schDate,
      startTime: schStart,
      endTime: schEnd,
      durationHours: duration > 0 ? duration : 2,
      status: 'Scheduled',
    });

    if (hasConflict) {
      toast({
        title: 'Jadwal Ada Benturan Waktu!',
        message: `Agenda "${schTitle}" tumpang tindih dengan jadwal lain.`,
        type: 'warning',
      });
    } else {
      toast({
        title: 'Jadwal Agenda Disimpan',
        message: `Agenda "${schTitle}" berhasil ditambahkan ke kalender kerja.`,
        type: 'success',
      });
    }

    onClose();
    resetForms();
  };

  const resetForms = () => {
    setActName('');
    setActClient('');
    setActTarget('');
    setActCost('');
    setActDesc('');
    setIncAmount('');
    setIncReceived('');
    setIncSource('');
    setIncDesc('');
    setExpAmount('');
    setExpDesc('');
    setSchTitle('');
  };

  return (
    <>
      {/* 1. MODAL ADD ACTIVITY */}
      <Modal
        isOpen={modalType === 'activity'}
        onClose={onClose}
        title="Tambah Aktivitas Pekerjaan Baru"
        description="Daftarkan pekerjaan atau sumber pendapatan baru ke dalam portofolio terpadu."
        size="lg"
      >
        <form onSubmit={handleActivitySubmit} className="space-y-4">
          <Input
            label="Nama Aktivitas *"
            required
            placeholder="Contoh: Mobile App Flutter, Toko Baju Online"
            value={actName}
            onChange={(e) => setActName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Aktivitas *"
              value={actCategory}
              onChange={(e) => setActCategory(e.target.value as ActivityCategory)}
              options={[
                { value: 'Project-based', label: 'Project-based (Freelance / Agency)' },
                { value: 'Platform-based', label: 'Platform-based (Driver / Gig Economy)' },
                { value: 'Session-based', label: 'Session-based (Tutor / Konsultan)' },
                { value: 'Business-based', label: 'Business-based (Toko / Bisnis Mandiri)' },
              ]}
            />
            <Input
              label="Klien atau Platform *"
              required
              placeholder="Contoh: PT Ventura, Tokopedia, Grab"
              value={actClient}
              onChange={(e) => setActClient(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Pendapatan (IDR)"
              type="number"
              placeholder="10000000"
              value={actTarget}
              onChange={(e) => setActTarget(e.target.value)}
            />
            <Input
              label="Estimasi Biaya Operasional (IDR)"
              type="number"
              placeholder="1500000"
              value={actCost}
              onChange={(e) => setActCost(e.target.value)}
            />
          </div>

          <Textarea
            label="Deskripsi / Catatan Pekerjaan"
            rows={2}
            placeholder="Tuliskan lingkup kerja, kesepakatan termin, atau catatan penting..."
            value={actDesc}
            onChange={(e) => setActDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Aktivitas
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. MODAL ADD INCOME */}
      <Modal
        isOpen={modalType === 'income'}
        onClose={onClose}
        title="Catat Pemasukan (Income)"
        description="Tambahkan catatan pembayaran yang diterima atau invoice tagihan ke klien."
      >
        <form onSubmit={handleIncomeSubmit} className="space-y-4">
          <Input
            label="Keterangan Pemasukan *"
            required
            placeholder="Contoh: Termin 1 UI Design, Pembayaran Sesi Mentoring"
            value={incDesc}
            onChange={(e) => setIncDesc(e.target.value)}
          />

          <Select
            label="Pilih Aktivitas Terkait *"
            value={incActivityId}
            onChange={(e) => setIncActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.clientOrPlatform})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Tagihan / Invoice (IDR) *"
              type="number"
              required
              placeholder="Contoh: 5000000"
              value={incAmount}
              onChange={(e) => setIncAmount(e.target.value)}
            />
            <Input
              label="Kas Diterima (Received Amount)"
              type="number"
              placeholder="Kosongkan jika sama dengan tagihan"
              value={incReceived}
              onChange={(e) => setIncReceived(e.target.value)}
            />
          </div>

          <Input
            label="Sumber Pembayar / Klien"
            placeholder="Contoh: PT Ventura Asia"
            value={incSource}
            onChange={(e) => setIncSource(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Pemasukan
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. MODAL ADD EXPENSE */}
      <Modal
        isOpen={modalType === 'expense'}
        onClose={onClose}
        title="Catat Pengeluaran (Expense)"
        description="Dokumentasikan biaya operasional yang dikeluarkan untuk mendukung aktivitas pekerjaan."
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          <Input
            label="Keterangan Pengeluaran *"
            required
            placeholder="Contoh: Bensin, Langganan Figma, Pouch Kopi"
            value={expDesc}
            onChange={(e) => setExpDesc(e.target.value)}
          />

          <Select
            label="Pilih Aktivitas Terkait"
            value={expActivityId}
            onChange={(e) => setExpActivityId(e.target.value)}
            options={[
              { value: '', label: '-- Pengeluaran Umum (General) --' },
              ...activities.map((a) => ({
                value: a.id,
                label: `${a.name} (${a.clientOrPlatform})`,
              })),
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nominal Pengeluaran (IDR) *"
              type="number"
              required
              placeholder="Contoh: 350000"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
            />

            <Select
              label="Kategori Pengeluaran *"
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
              options={[
                { value: 'Transportation', label: 'Transportation' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Subscription', label: 'Subscription' },
                { value: 'Communication', label: 'Communication' },
                { value: 'Operational', label: 'Operational' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Other Expenses', label: 'Other Expenses' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Simpan Pengeluaran
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. MODAL CREATE SCHEDULE */}
      <Modal
        isOpen={modalType === 'schedule'}
        onClose={onClose}
        title="Buat Jadwal Pekerjaan Baru"
        description="Atur agenda, deadline tugas, atau sesi pertemuan kerja agar tidak bertabrakan."
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Input
            label="Judul Agenda / Task *"
            required
            placeholder="Contoh: Client Presentation, Sesi Mentoring IELTS"
            value={schTitle}
            onChange={(e) => setSchTitle(e.target.value)}
          />

          <Select
            label="Hubungkan ke Aktivitas *"
            value={schActivityId}
            onChange={(e) => setSchActivityId(e.target.value)}
            options={activities.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.clientOrPlatform})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Tanggal *"
              type="date"
              required
              value={schDate}
              onChange={(e) => setSchDate(e.target.value)}
            />
            <Input
              label="Mulai *"
              type="time"
              required
              value={schStart}
              onChange={(e) => setSchStart(e.target.value)}
            />
            <Input
              label="Selesai *"
              type="time"
              required
              value={schEnd}
              onChange={(e) => setSchEnd(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Jadwalkan Agenda
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
