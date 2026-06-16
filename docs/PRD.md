**✅ PRD Baru – Simple Expense Tracker Web App (Versi Revisi)**

**Nama App**: Cauang - Catetan Keuangan  
**Versi Dokumen**: 1.3 (Arsitektur OOP + MVC)  
**Tanggal**: 16 Juni 2026  
**Tujuan**: Membuat MVP yang bisa dikembangkan dengan cepat menggunakan stack sederhana

---

### **1. Overview / Ringkasan Produk**

**Cauang** adalah **web application expense tracker super simpel** yang dirancang khusus untuk **mahasiswa dan anak kos**. 

Fokus utama: Membantu user mencatat pengeluaran harian dengan **input sangat cepat** (2–5 detik) sehingga mereka bisa tahu kemana uang bulanan mereka pergi dan mencegah uang “jebol” di tengah bulan.

**Tagline**: “Catetan keuangan anak kos”

**Model Bisnis**: 100% Gratis + Donasi (Saweria / Trakteer / PayMe)

---

### **2. Objectives**

- Membantu user sadar pola pengeluaran harian
- Mengurangi kebocoran pengeluaran kecil-kecilan
- Membangun kebiasaan tracking keuangan yang mudah dan sustainable
- Memberikan pengalaman seperti aplikasi native meski hanya web (PWA)

---

### **3. Target User & Persona**

**Target Utama**: Mahasiswa S1 dan Anak Kos (usia 18–24 tahun)  
**Persona Utama**:  
- **Andi** (21 tahun) – Mahasiswa Teknik, kos di Bandung, uang bulanan Rp1.200.000, sering jebol di minggu ke-3 karena jajan dan ojol.

---

### **4. Tech Stack**

| Bagian              | Teknologi                              | Keterangan |
|---------------------|----------------------------------------|----------|
| **Frontend**        | HTML + CSS + Vanilla JavaScript        | Vanilla JS, struktur MVC |
| **Architecture**    | OOP + MVC Pattern                      | Model-View-Controller |
| **Styling**         | Tailwind CSS (via CDN)                 | Mudah & cepat |
| **Database**        | LocalStorage (Web API)                 | Data tersimpan di browser |
| **Hosting**         | Vercel                                 | Gratis |
| **Chart**           | Chart.js                               | Visualisasi sederhana |
| **PWA**             | Manifest.json + Service Worker         | Bisa di-install di HP |

---

### **5. Struktur Proyek**

```
/
├── index.html              # Entry point SPA
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── src/
│   ├── models/             # Data & business logic
│   │   ├── Transaction.js
│   │   ├── Budget.js
│   │   └── Storage.js      # LocalStorage wrapper
│   ├── views/              # Render UI
│   │   ├── DashboardView.js
│   │   ├── AddExpenseView.js
│   │   ├── HistoryView.js
│   │   ├── InsightView.js
│   │   └── SettingsView.js
│   ├── controllers/        # Hubungin model & view
│   │   ├── ExpenseController.js
│   │   └── AppController.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   └── app.js              # Router / init
└── docs/
    └── PRD.md
```

---

### **6. Core Features (MVP)**

#### **Fitur Inti (Harus Ada di Versi Pertama)**

1. **Dashboard (Home)**
   - Saldo saat ini
   - Pengeluaran hari ini + persentase dari budget harian
   - Ringkasan minggu ini & bulan ini
   - Top 3 kategori pengeluaran (dengan ikon)

2. **Quick Add Expense** (Fitur Paling Penting)
   - Input jumlah (bisa ketik langsung)
   - Pilih kategori cepat (grid ikon):
     - Makanan, Minuman/Kopi, Transport/Ojol, Kos, Pulsa/Data, Belanja, Jajan, Lainnya
   - Deskripsi singkat (opsional)
   - Tanggal otomatis (bisa diubah)
   - Tombol “Simpan” besar & jelas

3. **Riwayat Transaksi**
   - Daftar pengeluaran (filter: hari ini, minggu ini, bulan ini, semua)
   - Search transaksi
   - Bisa edit & hapus

4. **Ringkasan & Insight**
   - Pie Chart pengeluaran per kategori (Chart.js)
   - Total pengeluaran per periode
   - Pesan sederhana (“Kamu paling banyak keluar di Transport”)

5. **Settings**
   - Input saldo awal / reset data
   - Link Donasi (“Dukung Developer”)
   - Dark / Light mode
   - Export data (CSV) – nice to have

---

### **7. User Flow Utama**

1. Buka app → Dashboard
2. Klik tombol **+** besar → Quick Add Expense
3. Isi → Simpan → otomatis kembali ke Dashboard (update langsung)
4. Navigasi ke Riwayat atau Insight untuk review

**Onboarding**:
- Halaman pertama: “Selamat datang di Cauang”
- Input saldo awal (opsional)
- Langsung bisa pakai

---

### **8. Non-Functional Requirements**

- **Mobile-First** dan responsive
- **PWA** (bisa di-add to homescreen)
- Offline support (sepenuhnya LocalStorage, tidak perlu koneksi internet)
- Loading cepat
- Bahasa Indonesia yang santai dan mudah dipahami
- UI sangat bersih, minimalis, dan tidak ramai
- Data tersimpan di LocalStorage browser masing-masing
- Kode terstruktur dengan OOP + MVC (Model-View-Controller)

---

### **9. Success Metrics (MVP)**

- Minimal 300–500 Active Users dalam 1 bulan pertama
- User rata-rata mencatat pengeluaran minimal 4x per minggu
- Feedback positif soal kemudahan input (“sangat simpel”)
- Beberapa donasi masuk di bulan pertama

