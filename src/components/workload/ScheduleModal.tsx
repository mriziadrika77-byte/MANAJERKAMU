import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { WorkSchedule } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleToEdit?: WorkSchedule | null;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleToEdit,
}) => {
  const { activities, addSchedule, updateSchedule } = useApp();
  const { toast } = useToast();

  const isEditing = !!scheduleToEdit;

  const [title, setTitle] = useState(scheduleToEdit?.title || '');
  const [activityId, setActivityId] = useState(
    scheduleToEdit?.activityId || activities[0]?.id || ''
  );
  const [date, setDate] = useState(
    scheduleToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(scheduleToEdit?.startTime || '09:00');
  const [endTime, setEndTime] = useState(scheduleToEdit?.endTime || '11:00');
  const [description, setDescription] = useState(scheduleToEdit?.description || '');
  const [status, setStatus] = useState<'Scheduled' | 'In Progress' | 'Completed'>(
    scheduleToEdit?.status || 'Scheduled'
  );

  React.useEffect(() => {
    if (scheduleToEdit) {
      setTitle(scheduleToEdit.title);
      setActivityId(scheduleToEdit.activityId || '');
      setDate(scheduleToEdit.date);
      setStartTime(scheduleToEdit.startTime);
      setEndTime(scheduleToEdit.endTime);
      setDescription(scheduleToEdit.description || '');
      setStatus(scheduleToEdit.status);
    } else {
      setTitle('');
      setActivityId(activities[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('11:00');
      setDescription('');
      setStatus('Scheduled');
    }
  }, [scheduleToEdit, isOpen, activities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Judul agenda jadwal wajib diisi.', type: 'danger' });
      return;
    }

    if (startTime >= endTime) {
      toast({ title: 'Validasi Gagal', message: 'Waktu selesai harus lebih lambat dari waktu mulai.', type: 'danger' });
      return;
    }

    // Calculate duration in hours
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const durationHours = Math.round(((endH * 60 + endM - (startH * 60 + startM)) / 60) * 10) / 10;

    const matchedAct = activities.find((a) => a.id === activityId);

    if (isEditing && scheduleToEdit) {
      const { hasConflict } = updateSchedule(scheduleToEdit.id, {
        title,
        activityId,
        activityName: matchedAct ? matchedAct.name : 'General Schedule',
        date,
        startTime,
        endTime,
        durationHours,
        description,
        status,
      });

      if (hasConflict) {
        toast({
          title: 'Perhatian: Benturan Jadwal!',
          message: 'Jadwal bertabrakan dengan agenda lain pada tanggal dan jam yang sama.',
          type: 'warning',
        });
      } else {
        toast({
          title: 'Jadwal Diperbarui',
          message: 'Perubahan agenda berhasil disimpan.',
          type: 'success',
        });
      }
    } else {
      const { hasConflict } = addSchedule({
        title,
        activityId,
        activityName: matchedAct ? matchedAct.name : 'General Schedule',
        date,
        startTime,
        endTime,
        durationHours,
        description,
        status,
      });

      if (hasConflict) {
        toast({
          title: 'Jadwal Disimpan (Ada Benturan)',
          message: 'Peringatan: Jadwal baru tumpang tindih dengan agenda yang sudah ada.',
          type: 'warning',
        });
      } else {
        toast({
          title: 'Jadwal Berhasil Ditambahkan',
          message: 'Agenda kerja tersimpan di kalender.',
          type: 'success',
        });
      }
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Jadwal Kerja' : 'Tambah Jadwal Kerja Baru'}
      description="Atur alokasi jam kerja untuk aktivitas Anda. Sistem otomatis mendeteksi benturan waktu."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Agenda / Sesi Pekerjaan *"
          required
          placeholder="Contoh: Sprint Review, Packing Kopi, Sesi IELTS"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label="Hubungkan ke Aktivitas Pekerjaan"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          options={[
            { value: '', label: '-- Jadwal Umum (General) --' },
            ...activities.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.clientOrPlatform})`,
            })),
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Tanggal *"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            label="Mulai *"
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <Input
            label="Selesai *"
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <Select
          label="Status Pelaksanaan"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={[
            { value: 'Scheduled', label: 'Scheduled (Terjadwal)' },
            { value: 'In Progress', label: 'In Progress (Sedang Berlangsung)' },
            { value: 'Completed', label: 'Completed (Selesai)' },
          ]}
        />

        <Textarea
          label="Catatan / Link Pertemuan"
          rows={2}
          placeholder="Google Meet link, alamat lokasi, atau agenda..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Jadwalkan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
