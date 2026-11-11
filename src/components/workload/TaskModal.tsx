import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TaskItem, TaskPriority, TaskStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { activities, addTask, updateTask } = useApp();
  const { toast } = useToast();

  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [activityId, setActivityId] = useState(
    taskToEdit?.activityId || activities[0]?.id || ''
  );
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'Medium');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || 'To Do');
  const [deadline, setDeadline] = useState(
    taskToEdit?.deadline || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(taskToEdit?.description || '');

  React.useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setActivityId(taskToEdit.activityId || '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDeadline(taskToEdit.deadline);
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setActivityId(activities[0]?.id || '');
      setPriority('Medium');
      setStatus('To Do');
      setDeadline(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [taskToEdit, isOpen, activities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Judul tugas wajib diisi.', type: 'danger' });
      return;
    }

    const matchedAct = activities.find((a) => a.id === activityId);

    if (isEditing && taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        activityId: activityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Task',
        priority,
        status,
        deadline,
        description,
      });

      toast({
        title: 'Tugas Diperbarui',
        message: 'Perubahan tugas berhasil disimpan.',
        type: 'success',
      });
    } else {
      addTask({
        title,
        activityId: activityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Task',
        priority,
        status,
        deadline,
        description,
      });

      toast({
        title: 'Tugas Ditambahkan',
        message: 'Tugas baru berhasil didaftarkan.',
        type: 'success',
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Tugas (Task)' : 'Tambah Tugas Baru'}
      description="Kelola to-do item dan deadline pekerjaan lintas aktivitas."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Tugas *"
          required
          placeholder="Contoh: Ekspor SVG Figma, Servis Motor, Review Essay"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label="Hubungkan ke Aktivitas Pekerjaan"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          options={[
            { value: '', label: '-- Tugas Umum (General) --' },
            ...activities.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.clientOrPlatform})`,
            })),
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Prioritas *"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: 'Low', label: 'Low (Rendah)' },
              { value: 'Medium', label: 'Medium (Normal)' },
              { value: 'High', label: 'High (Tinggi)' },
              { value: 'Urgent', label: 'Urgent (Mendesak)' },
            ]}
          />

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={[
              { value: 'To Do', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />

          <Input
            label="Tenggat (Deadline) *"
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <Textarea
          label="Keterangan / Checklist Detail"
          rows={2}
          placeholder="Detail langkah kerja atau deliverable..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Simpan Perubahan' : 'Tambah Tugas'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

