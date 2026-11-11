import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ExpenseTransaction, ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: ExpenseTransaction | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
}) => {
  const { activities, addExpense, updateExpense } = useApp();
  const { toast } = useToast();

  const isEditing = !!expenseToEdit;

  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [activityId, setActivityId] = useState(
    expenseToEdit?.activityId || activities[0]?.id || ''
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    expenseToEdit?.category || 'Operational'
  );
  const [amount, setAmount] = useState(expenseToEdit?.amount?.toString() || '');
  const [date, setDate] = useState(
    expenseToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState(
    expenseToEdit?.paymentMethod || 'Transfer Bank'
  );
  const [notes, setNotes] = useState(expenseToEdit?.notes || '');

  React.useEffect(() => {
    if (expenseToEdit) {
      setDescription(expenseToEdit.description);
      setActivityId(expenseToEdit.activityId || '');
      setCategory(expenseToEdit.category);
      setAmount(expenseToEdit.amount.toString());
      setDate(expenseToEdit.date);
      setPaymentMethod(expenseToEdit.paymentMethod);
      setNotes(expenseToEdit.notes || '');
    } else {
      setDescription('');
      setActivityId(activities[0]?.id || '');
      setCategory('Operational');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Transfer Bank');
      setNotes('');
    }
  }, [expenseToEdit, isOpen, activities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Deskripsi pengeluaran wajib diisi.', type: 'danger' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal pengeluaran harus lebih dari 0.', type: 'danger' });
      return;
    }

    const matchedAct = activities.find((a) => a.id === activityId);

    if (isEditing && expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        description,
        activityId: activityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Expense',
        category,
        amount: amountNum,
        date,
        paymentMethod,
        notes,
      });

      toast({
        title: 'Pengeluaran Diperbarui',
        message: 'Data pengeluaran berhasil disimpan.',
        type: 'success',
      });
    } else {
      addExpense({
        description,
        activityId: activityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Expense',
        category,
        amount: amountNum,
        date,
        paymentMethod,
        notes,
      });

      toast({
        title: 'Pengeluaran Dicatat',
        message: 'Pengeluaran berhasil ditambahkan.',
        type: 'success',
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Pengeluaran (Expense)' : 'Catat Pengeluaran Baru'}
      description="Catat biaya operasional atau modal kerja untuk menghitung margin laba bersih yang presisi."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Deskripsi Pengeluaran *"
          required
          placeholder="Contoh: Bensin Operasional, Lisensi Figma, Pouch Kopi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Kategori Pengeluaran *"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            options={[
              { value: 'Transportation', label: '1. Transportation (BBM / Tol / Kendaraan)' },
              { value: 'Equipment', label: '2. Equipment (Peralatan / Hardware)' },
              { value: 'Subscription', label: '3. Subscription (Software / Cloud)' },
              { value: 'Communication', label: '4. Communication (Kuota / Pulsa / WiFi)' },
              { value: 'Operational', label: '5. Operational (Bahan Baku / Packing)' },
              { value: 'Marketing', label: '6. Marketing (Iklan / Ads / Promosi)' },
              { value: 'Other Expenses', label: '7. Other Expenses (Lain-lain)' },
            ]}
          />

          <Select
            label="Hubungkan ke Aktivitas"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            options={[
              { value: '', label: '-- Pengeluaran Umum (General) --' },
              ...activities.map((a) => ({
                value: a.id,
                label: `${a.name} (${a.clientOrPlatform})`,
              })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nominal Pengeluaran (IDR) *"
            type="number"
            required
            placeholder="Contoh: 450000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Input
            label="Tanggal Transaksi *"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Metode Pembayaran"
            placeholder="Contoh: Kartu Debit, QRIS, Tunai"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Input
            label="Catatan Pengeluaran"
            placeholder="Toko, nomor resi, atau rincian..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" size="sm" type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

