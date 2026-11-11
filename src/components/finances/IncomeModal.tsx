import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IncomeTransaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomeToEdit?: IncomeTransaction | null;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  incomeToEdit,
}) => {
  const { activities, addIncome, updateIncome } = useApp();
  const { toast } = useToast();

  const isEditing = !!incomeToEdit;

  const [description, setDescription] = useState(incomeToEdit?.description || '');
  const [activityId, setActivityId] = useState(
    incomeToEdit?.activityId || activities[0]?.id || ''
  );
  const [invoiceAmount, setInvoiceAmount] = useState(
    incomeToEdit?.invoiceAmount?.toString() || ''
  );
  const [receivedAmount, setReceivedAmount] = useState(
    incomeToEdit?.receivedAmount?.toString() || '0'
  );
  const [date, setDate] = useState(
    incomeToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [paymentSource, setPaymentSource] = useState(
    incomeToEdit?.paymentSource || ''
  );
  const [notes, setNotes] = useState(incomeToEdit?.notes || '');

  React.useEffect(() => {
    if (incomeToEdit) {
      setDescription(incomeToEdit.description);
      setActivityId(incomeToEdit.activityId || '');
      setInvoiceAmount(incomeToEdit.invoiceAmount.toString());
      setReceivedAmount(incomeToEdit.receivedAmount.toString());
      setDate(incomeToEdit.date);
      setPaymentSource(incomeToEdit.paymentSource);
      setNotes(incomeToEdit.notes || '');
    } else {
      setDescription('');
      setActivityId(activities[0]?.id || '');
      setInvoiceAmount('');
      setReceivedAmount('0');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentSource('');
      setNotes('');
    }
  }, [incomeToEdit, isOpen, activities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Deskripsi transaksi wajib diisi.', type: 'danger' });
      return;
    }

    const invNum = parseFloat(invoiceAmount);
    if (!invNum || invNum <= 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal tagihan harus lebih dari 0.', type: 'danger' });
      return;
    }

    const recNum = parseFloat(receivedAmount) || 0;
    if (recNum < 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal diterima tidak boleh negatif.', type: 'danger' });
      return;
    }

    const matchedAct = activities.find((a) => a.id === activityId);

    if (isEditing && incomeToEdit) {
      updateIncome(incomeToEdit.id, {
        description,
        activityId,
        activityName: matchedAct ? matchedAct.name : 'Unassigned Activity',
        invoiceAmount: invNum,
        receivedAmount: recNum,
        date,
        paymentSource: paymentSource || 'Klien / Platform',
        notes,
      });

      toast({
        title: 'Pemasukan Diperbarui',
        message: 'Data transaksi berhasil disimpan.',
        type: 'success',
      });
    } else {
      addIncome({
        description,
        activityId,
        activityName: matchedAct ? matchedAct.name : 'Unassigned Activity',
        invoiceAmount: invNum,
        receivedAmount: recNum,
        date,
        paymentSource: paymentSource || 'Klien / Platform',
        notes,
      });

      toast({
        title: 'Pemasukan Dicatat',
        message: 'Transaksi pemasukan berhasil ditambahkan.',
        type: 'success',
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Pemasukan (Income)' : 'Catat Pemasukan Baru'}
      description="Lengkapi nilai tagihan (invoice) dan jumlah yang sudah benar-benar diterima (kas masuk)."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Deskripsi Transaksi *"
          required
          placeholder="Contoh: Termin 1 UI Design, Pembayaran Sesi Mentoring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Hubungkan ke Aktivitas Pekerjaan"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          options={[
            { value: '', label: '-- Tanpa Aktivitas (Pemasukan Umum) --' },
            ...activities.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.clientOrPlatform})`,
            })),
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Tagihan / Invoice (IDR) *"
            type="number"
            required
            placeholder="Contoh: 5000000"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
          />

          <Input
            label="Kas Diterima (Received Amount) *"
            type="number"
            required
            placeholder="0 jika belum dibayar"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            helperText="Status otomatis dihitung: Paid / Partially Paid / Pending"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal Transaksi *"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            label="Sumber Pembayar / Klien"
            placeholder="Contoh: PT Ventura Digital Asia"
            value={paymentSource}
            onChange={(e) => setPaymentSource(e.target.value)}
          />
        </div>

        <Input
          label="Catatan Pembayaran (Opsional)"
          placeholder="Nomor rekening, termin, atau catatan transfer..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Catat Pemasukan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

