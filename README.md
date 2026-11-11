# MANAJERKAMU
> **One Person. Multiple Activities. One Integrated System.**

Platform digital terintegrasi untuk pengelolaan pekerjaan dan portofolio multi-sumber pendapatan bagi pekerja independen, freelancer, pelaku ekonomi gig, dan pemilik usaha mikro berbasis **PRD v3.1**.

---

## 🚀 Fitur Utama

1. **Overview Dashboard**: Ringkasan performa finansial real-time, tren kas masuk & keluar, metrik laba bersih, serta status invoice tertunda.
2. **My Activities Portfolio**: Pengelolaan portofolio terpadu untuk kategori *Project-based*, *Platform-based*, *Session-based*, dan *Business-based*.
3. **Income & Expense Management**: Pencatatan mutasi kas, rekonsiliasi status pembayaran bertahap (*Paid*, *Partially Paid*, *Pending*), dan pemisahan pengeluaran operasional.
4. **Workload & Schedule Management**: Kalender pekerjaan lintas aktivitas, pencatatan durasi jam kerja produktif, serta sistem deteksi benturan waktu (*conflict detection*).
5. **Financial Planning & Forecasting**: Penetapan target pendapatan bulanan & tahunan serta kalkulator simulasi skenario bisnis (*Konservatif*, *Saat Ini*, *Optimistis*).
6. **AI Personal Assistant (Rule-Based)**: Asisten analisis data internal untuk perbandingan profitabilitas aktivitas, margin per jam, serta rekomendasi alokasi waktu.
7. **Analytics & Reports**: Visualisasi grafik tren bulanan, diagram distribusi pengeluaran, tabel performa aktivitas, dan fitur **Export CSV**.
8. **My Documents**: Repositori penyimpanan lokal untuk dokumen kontrak, tagihan invoice, laporan proyek, dan bukti transfer.
9. **Settings & Preferences**: Dukungan **Light Mode** & **Dark Mode** (*Royal Navy, Soft Lavender, Cloud White*), preferensi mata uang, dan fitur reset data demo lokal.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS + Design Tokens PRD v3.1
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Architecture**: Frontend-Only Interactive Prototype
- **Data Storage**: Client-side State Management + Browser `localStorage`
- **Hosting**: Netlify

---

## 💻 Cara Menjalankan Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/<username>/MANAJERKAMU.git
cd MANAJERKAMU

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Build untuk produksi
npm run build

# 5. Preview hasil build
npm run preview
```

---

## 📄 Keterbukaan Teknis (PRD Section 17)

MANAJERKAMU adalah prototipe web interaktif. Seluruh data bersifat ilustratif untuk mendemonstrasikan kapabilitas pengelolaan pekerjaan terintegrasi secara aman di dalam peramban lokal tanpa server database eksternal. Respon AI Assistant merupakan simulasi analisis berbasis aturan frontend.

