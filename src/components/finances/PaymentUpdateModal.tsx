import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IncomeTransaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';

interface PaymentUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: IncomeTransaction | null;
}

export const PaymentUpdateModal: React.FC<PaymentUpdateModalProps> = ({
  isOpen,
  onClose,
  income,
}) => {
  const { updateIncomePayment } = useApp();
  const { toast } = useToast();

  const [receivedAmount, setReceivedAmount] = useState('');

  React.useEffect(() => {
    if (income) {
      setReceivedAmount(income.receivedAmount.toString());
    }
  }, [income, isOpen]);

  if (!income) return null;

  const invoiceAmount = income.invoiceAmount;
  const currentReceived = parseFloat(receivedAmount) || 0;
  const remaining = Math.max(0, invoiceAmount - currentReceived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentReceived < 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal tidak boleh negatif.', type: 'danger' });
      return;
    }

    updateIncomePayment(income.id, currentReceived);

    toast({
      title: 'Pembayaran Diperbarui',
      message: `Status kas masuk diperbarui menjadi ${formatCurrency(currentReceived)}.`,
      type: 'success',
    });

    onClose();
  };

  const handleSetFull = () => {
    setReceivedAmount(invoiceAmount.toString());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perbarui Pembayaran (Payment Tracking)"
      description="Update kas yang sudah benar-benar diterima dari klien untuk tagihan ini."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border space-y-1">
          <p className="text-xs font-semibold text-content-primary">{income.description}</p>
          <p className="text-[11px] text-content-muted">
            {income.activityName || 'General'} &bull; Sumber: {income.paymentSource}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-content-muted">Total Tagihan (Invoice):</span>
            <span className="font-mono font-bold text-content-primary">
              {formatCurrency(invoiceAmount)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-content-primary">
              Kas Diterima (Received Amount) *
            </label>
            <button
              type="button"
              onClick={handleSetFull}
              className="text-xs text-brand-blue hover:underline font-medium"
            >
              Set Lunas (100%)
            </button>
          </div>
          <Input
            type="number"
            required
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Calculation summary */}
        <div className="p-3 rounded-xl border border-border bg-brand-mist/30 dark:bg-surface-elevated/40 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-content-secondary">Sisa Tagihan (Remaining):</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(remaining)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content-secondary">Status Otomatis:</span>
            <span className="font-bold text-content-primary">
              {currentReceived >= invoiceAmount
                ? 'Paid (Lunas)'
                : currentReceived > 0
                ? 'Partially Paid (Sebagian)'
                : 'Pending (Belum Dibayar)'}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Simpan Pembayaran
          </Button>
        </div>
      </form>
    </Modal>
  );
};

