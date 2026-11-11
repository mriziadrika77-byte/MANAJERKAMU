import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Activity, ActivityCategory, ActivityStatus, PaymentModel } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: Activity | null;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  activityToEdit,
}) => {
  const { addActivity, updateActivity } = useApp();
  const { toast } = useToast();

  const isEditing = !!activityToEdit;

  const [name, setName] = useState(activityToEdit?.name || '');
  const [category, setCategory] = useState<ActivityCategory>(
    activityToEdit?.category || 'Project-based'
  );
  const [description, setDescription] = useState(activityToEdit?.description || '');
  const [clientOrPlatform, setClientOrPlatform] = useState(
    activityToEdit?.clientOrPlatform || ''
  );
  const [paymentModel, setPaymentModel] = useState<PaymentModel>(
    activityToEdit?.paymentModel || 'Fixed / Milestone'
  );
  const [expectedIncome, setExpectedIncome] = useState(
    activityToEdit?.expectedIncome?.toString() || ''
  );
  const [operationalCost, setOperationalCost] = useState(
    activityToEdit?.operationalCost?.toString() || ''
  );
  const [startDate, setStartDate] = useState(
    activityToEdit?.startDate || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<ActivityStatus>(activityToEdit?.status || 'Active');
  const [notes, setNotes] = useState(activityToEdit?.notes || '');

  // Reset when opened
  React.useEffect(() => {
    if (activityToEdit) {
      setName(activityToEdit.name);
      setCategory(activityToEdit.category);
      setDescription(activityToEdit.description);
      setClientOrPlatform(activityToEdit.clientOrPlatform);
      setPaymentModel(activityToEdit.paymentModel);
      setExpectedIncome(activityToEdit.expectedIncome.toString());
      setOperationalCost(activityToEdit.operationalCost.toString());
      setStartDate(activityToEdit.startDate);
      setStatus(activityToEdit.status);
      setNotes(activityToEdit.notes || '');
    } else {
      setName('');
      setCategory('Project-based');
      setDescription('');
      setClientOrPlatform('');
      setPaymentModel('Fixed / Milestone');
      setExpectedIncome('');
      setOperationalCost('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
      setNotes('');
    }
  }, [activityToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Nama aktivitas wajib diisi.', type: 'danger' });
      return;
    }
    if (!clientOrPlatform.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Klien atau platform wajib diisi.', type: 'danger' });
      return;
    }

    const expIncomeNum = parseFloat(expectedIncome) || 0;
    const opCostNum = parseFloat(operationalCost) || 0;

    if (isEditing && activityToEdit) {
      updateActivity(activityToEdit.id, {
        name,
        category,
        description,
        clientOrPlatform,
        paymentModel,
        expectedIncome: expIncomeNum,
        operationalCost: opCostNum,
        startDate,
        status,
        notes,
      });

      toast({
        title: 'Aktivitas Diperbarui',
        message: `Perubahan pada "${name}" berhasil disimpan.`,
        type: 'success',
      });
    } else {
      addActivity({
        name,
        category,
        description,
        clientOrPlatform,
        paymentModel,
        expectedIncome: expIncomeNum,
        operationalCost: opCostNum,
        startDate,
        status,
        hoursWorked: 0,
        notes,
      });

      toast({
        title: 'Aktivitas Ditambahkan',
        message: `Aktivitas "${name}" berhasil didaftarkan.`,
        type: 'success',
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Aktivitas Pekerjaan' : 'Tambah Aktivitas Pekerjaan Baru'}
      description="Lengkapi detail aktivitas untuk mencatat target pendapatan, biaya operasional, dan model kompensasi."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Aktivitas Pekerjaan *"
          required
          placeholder="Contoh: Mobile App Flutter, Sesi Kursus IELTS"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Kategori Aktivitas *"
            value={category}
            onChange={(e) => setCategory(e.target.value as ActivityCategory)}
            options={[
              { value: 'Project-based', label: 'Project-based (Freelance / Desain / Dev)' },
              { value: 'Platform-based', label: 'Platform-based (Driver / Gig Economy)' },
              { value: 'Session-based', label: 'Session-based (Tutor / Konsultan)' },
              { value: 'Business-based', label: 'Business-based (Toko Online / Bisnis)' },
            ]}
          />

          <Input
            label="Klien atau Platform *"
            required
            placeholder="Contoh: PT Ventura, Tokopedia, Grab"
            value={clientOrPlatform}
            onChange={(e) => setClientOrPlatform(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Model Pembayaran *"
            value={paymentModel}
            onChange={(e) => setPaymentModel(e.target.value as PaymentModel)}
            options={[
              { value: 'Fixed / Milestone', label: 'Fixed / Milestone' },
              { value: 'Hourly', label: 'Per Jam (Hourly)' },
              { value: 'Commission / Revenue Share', label: 'Komisi / Bagi Hasil' },
              { value: 'Per Session', label: 'Per Sesi' },
              { value: 'Retail Margin', label: 'Margin Retail' },
            ]}
          />

          <Input
            label="Target Pendapatan (IDR) *"
            type="number"
            required
            placeholder="Contoh: 15000000"
            value={expectedIncome}
            onChange={(e) => setExpectedIncome(e.target.value)}
          />

          <Input
            label="Estimasi Biaya Operasional (IDR)"
            type="number"
            placeholder="Contoh: 850000"
            value={operationalCost}
            onChange={(e) => setOperationalCost(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal Mulai *"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Select
            label="Status Aktivitas *"
            value={status}
            onChange={(e) => setStatus(e.target.value as ActivityStatus)}
            options={[
              { value: 'Active', label: 'Active (Sedang Berjalan)' },
              { value: 'Paused', label: 'Paused (Ditunda Sementara)' },
              { value: 'Completed', label: 'Completed (Selesai)' },
              { value: 'Archived', label: 'Archived (Diarsipkan)' },
            ]}
          />
        </div>

        <Textarea
          label="Deskripsi / Catatan Pekerjaan"
          rows={2}
          placeholder="Tuliskan lingkup kerja, deliverable, atau catatan kesepakatan klien..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Perbarui Aktivitas' : 'Simpan Aktivitas'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

