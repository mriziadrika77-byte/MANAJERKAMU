import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DocumentItem, DocumentCategory } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  FileText,
  UploadCloud,
  Search,
  Trash2,
  Edit,
  Eye,
  Download,
  HardDrive,
} from 'lucide-react';

export const DocumentsModule: React.FC = () => {
  const { documents, addDocument, updateDocument, deleteDocument, activities } = useApp();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<DocumentItem | null>(null);

  // Form fields
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Contract');
  const [docActivityId, setDocActivityId] = useState(activities[0]?.id || '');
  const [docFileName, setDocFileName] = useState('');
  const [docFileSize, setDocFileSize] = useState('500 KB');
  const [docDesc, setDocDesc] = useState('');

  // 6.A Overview Counts
  const totalCount = documents.length;
  const contractCount = documents.filter((d) => d.category === 'Contract').length;
  const invoiceCount = documents.filter((d) => d.category === 'Invoice').length;
  const reportCount = documents.filter((d) => d.category === 'Project Report').length;
  const proofCount = documents.filter((d) => d.category === 'Payment Proof').length;

  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(search.toLowerCase()));

    const matchCat = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchAct = activityFilter === 'all' || doc.activityId === activityFilter;

    return matchSearch && matchCat && matchAct;
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setDocName('');
    setDocCategory('Contract');
    setDocActivityId(activities[0]?.id || '');
    setDocFileName('Dokumen_Baru.pdf');
    setDocFileSize('650 KB');
    setDocDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setDocName(doc.name);
    setDocCategory(doc.category);
    setDocActivityId(doc.activityId || '');
    setDocFileName(doc.fileName);
    setDocFileSize(doc.fileSize);
    setDocDesc(doc.description || '');
    setIsModalOpen(true);
  };

  const handleOpenPreview = (doc: DocumentItem) => {
    setPreviewingDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus dokumen "${name}" dari repositori lokal?`)) {
      deleteDocument(id);
      toast({ title: 'Dokumen Dihapus', message: 'Metadata dokumen telah dihapus.', type: 'info' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setDocFileSize(file.size > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      toast({ title: 'Validasi Gagal', message: 'Nama dokumen wajib diisi.', type: 'danger' });
      return;
    }

    const matchedAct = activities.find((a) => a.id === docActivityId);

    if (editingDoc) {
      updateDocument(editingDoc.id, {
        name: docName,
        category: docCategory,
        activityId: docActivityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Document',
        fileName: docFileName || 'Dokumen.pdf',
        fileSize: docFileSize,
        description: docDesc,
      });
      toast({ title: 'Dokumen Diperbarui', message: 'Metadata dokumen berhasil disimpan.', type: 'success' });
    } else {
      addDocument({
        name: docName,
        category: docCategory,
        activityId: docActivityId || undefined,
        activityName: matchedAct ? matchedAct.name : 'General Document',
        fileName: docFileName || 'Dokumen.pdf',
        fileType: docFileName.endsWith('.png') || docFileName.endsWith('.jpg') ? 'image/png' : 'application/pdf',
        fileSize: docFileSize,
        description: docDesc,
      });
      toast({ title: 'Dokumen Tersimpan', message: 'Dokumen berhasil ditambahkan ke repositori lokal.', type: 'success' });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="My Documents Repository"
        description="Penyimpanan dan pengarsipan lokal dokumen kontrak kerja, invoice tagihan, laporan proyek, serta bukti bayar klien."
        breadcrumb={<span>Intelligence / My Documents</span>}
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={<UploadCloud className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            Unggah Dokumen Baru
          </Button>
        }
      />

      {/* 6.E Local Storage Limitation Notice */}
      <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border flex items-start gap-3 text-xs">
        <HardDrive className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <p className="text-content-secondary leading-relaxed">
          <span className="font-bold text-content-primary">Penyimpanan Dokumen Lokal:</span> Metadata dan file dokumen ini dikelola melalui browser File API &amp; LocalStorage. Dokumen tidak diunggah ke cloud publik pihak ketiga demi menjaga kerahasiaan kontrak pekerjaan Anda.
        </p>
      </div>

      {/* 6.A DOCUMENT OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Total Documents</span>
          <span className="font-heading text-2xl font-bold text-content-primary mt-1 block">
            {totalCount}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-brand-blue block font-medium">Contracts</span>
          <span className="font-heading text-2xl font-bold text-brand-blue mt-1 block">
            {contractCount}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Invoices</span>
          <span className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {invoiceCount}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">Project Reports</span>
          <span className="font-heading text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">
            {reportCount}
          </span>
        </Card>

        <Card className="p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Payment Proofs</span>
          <span className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {proofCount}
          </span>
        </Card>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-subtle">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Cari nama dokumen, nama file, atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="Contract">Contract (Kontrak)</option>
            <option value="Invoice">Invoice (Tagihan)</option>
            <option value="Project Report">Project Report (Laporan)</option>
            <option value="Payment Proof">Payment Proof (Bukti Bayar)</option>
            <option value="Other Documents">Other Documents (Lainnya)</option>
          </select>

          {/* Activity Filter */}
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
          >
            <option value="all">Semua Aktivitas</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DOCUMENT LIST (Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-content-muted">
            Tidak ada dokumen yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              hoverable
              className="p-5 flex flex-col justify-between group transition-all duration-200 border-border hover:border-brand-soft"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="default" size="sm">
                    {doc.category}
                  </Badge>
                  <span className="text-[11px] text-content-muted">{doc.uploadDate}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-mist dark:bg-brand-tint text-brand-navy dark:text-brand-blue flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-bold text-sm text-content-primary truncate group-hover:text-brand-blue transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-brand-blue font-medium mt-0.5 truncate">
                      {doc.activityName || 'General Document'}
                    </p>
                    <p className="text-[11px] text-content-muted mt-1 font-mono">
                      {doc.fileName} ({doc.fileSize})
                    </p>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-xs text-content-secondary mt-3 line-clamp-2 bg-surface-elevated/40 p-2 rounded-lg border border-border/50">
                    {doc.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenPreview(doc)}
                >
                  Preview
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="p-1.5 rounded text-content-muted hover:text-content-primary"
                    title="Edit Metadata"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="p-1.5 rounded text-content-muted hover:text-rose-500"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload & Edit Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoc ? 'Edit Metadata Dokumen' : 'Unggah Dokumen Baru'}
        description="Dokumentasikan kontrak, invoice, atau laporan pendukung aktivitas pekerjaan Anda."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama / Judul Dokumen *"
            required
            placeholder="Contoh: Kontrak Kemitraan Desain UI/UX 2026"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Dokumen *"
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
              options={[
                { value: 'Contract', label: 'Contract (Perjanjian Kontrak)' },
                { value: 'Invoice', label: 'Invoice (Tagihan Klien)' },
                { value: 'Project Report', label: 'Project Report (Laporan Proyek)' },
                { value: 'Payment Proof', label: 'Payment Proof (Bukti Bayar)' },
                { value: 'Other Documents', label: 'Other Documents (Lainnya)' },
              ]}
            />

            <Select
              label="Hubungkan ke Aktivitas"
              value={docActivityId}
              onChange={(e) => setDocActivityId(e.target.value)}
              options={[
                { value: '', label: '-- Dokumen Umum (General) --' },
                ...activities.map((a) => ({
                  value: a.id,
                  label: `${a.name} (${a.clientOrPlatform})`,
                })),
              ]}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-content-primary block mb-1">
              Pilih Berkas Lokal (PDF / PNG / JPG / DOCX)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="text-xs text-content-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-mist file:text-brand-navy hover:file:opacity-80"
            />
            {docFileName && (
              <span className="text-[11px] text-content-muted mt-1 block">
                Berkas terpilih: {docFileName} ({docFileSize})
              </span>
            )}
          </div>

          <Textarea
            label="Keterangan Ringkas Dokumen"
            rows={2}
            placeholder="Klausul penting, nomor invoice, atau ringkasan isi dokumen..."
            value={docDesc}
            onChange={(e) => setDocDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingDoc ? 'Perbarui Metadata' : 'Simpan Dokumen'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Simulated Document Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewingDoc?.name || 'Pratinjau Dokumen'}
        description={`Kategori: ${previewingDoc?.category} • Berkas: ${previewingDoc?.fileName} (${previewingDoc?.fileSize})`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="h-64 rounded-xl border border-dashed border-border bg-surface-elevated/40 flex flex-col items-center justify-center p-6 text-center">
            <FileText className="w-12 h-12 text-brand-blue mb-3 opacity-80" />
            <h4 className="font-heading font-bold text-sm text-content-primary">
              Pratinjau Dokumen Lokal
            </h4>
            <p className="text-xs text-content-muted max-w-sm mt-1">
              Dokumen tersimpan aman pada browser storage. Untuk membuka di aplikasi PDF reader eksternal, Anda dapat mengunduh berkas.
            </p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="mt-4"
              onClick={() => {
                toast({ title: 'Simulasi Unduh', message: `Berkas "${previewingDoc?.fileName}" disiapkan.`, type: 'info' });
              }}
            >
              Unduh Salinan Berkas
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-surface-elevated/60 text-xs space-y-1">
            <p className="font-semibold text-content-primary">Deskripsi:</p>
            <p className="text-content-secondary">{previewingDoc?.description || 'Tidak ada deskripsi tambahan.'}</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setIsPreviewOpen(false)}>
              Tutup Pratinjau
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

