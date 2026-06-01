# 🗂️ Archievty

**Archievty** adalah aplikasi web berbasis klien (client-side) yang dirancang untuk membantu Anda mengekstrak tautan unduhan langsung (direct download link), informasi metadata, hash keamanan (MD5, SHA1, CRC32), serta melakukan ekspor tautan massal dari item di **Archive.org** secara instan dan tanpa perlu login.

Aplikasi ini dibangun menggunakan teknologi web standar dengan sistem desain modern yang terinspirasi oleh **Shadcn UI**, lengkap dengan animasi mikro dan transisi tema yang dinamis.

---

## ✨ Fitur Utama

- **🚀 Ekstraksi Tautan Instan**: Dapatkan direct link download file dari URL Archive.org (mendukung format `/details/`, `/download/`, `/embed/`, `/stream/`, atau hanya ID item saja).
- **📥 Ekspor Massal (.txt)**: Ekspor semua link file yang ditemukan ke dalam format daftar file teks (`.txt`) yang siap diimpor ke download manager seperti **IDM (Internet Download Manager)** atau **JDownloader**.
- **📜 Riwayat Ekstraksi Lokal**: Menyimpan riwayat pencarian terakhir Anda di `localStorage` (lokal di browser) agar dapat diakses kembali dengan satu klik.
- **⚡ Skeleton Loader (Shimmer)**: Tampilan pemuatan konten yang halus dan premium selama proses ekstraksi.
- **🎨 Shadcn-Inspired UI**: Desain minimalis yang bersih dengan mode Gelap/Terang otomatis serta sistem notifikasi Toast yang elegan.
- **🛡️ 100% Client-Side & Aman**: Seluruh logika berjalan langsung di browser pengguna tanpa mengirim data ke server perantara. Sangat aman dan ringan.

---

## 🛠️ Stack Teknologi

- **Struktur**: HTML5 (Semantic Markup)
- **Gaya (Styling)**: Vanilla CSS (Custom Variables & HSL Colors, terinspirasi oleh Tailwind/Shadcn)
- **Logika (Script)**: Vanilla Javascript (ES6+, Fetch API, AbortController, LocalStorage)
- **Font**: Inter Font (via BunnyCDN)

---

## 🚀 Cara Menjalankan

Karena aplikasi ini sepenuhnya berjalan di sisi klien (*static web application*), Anda dapat menjalankannya dengan cara:

1. **Jalankan Lokal**:
   - Cukup klik ganda berkas `index.html` untuk membukanya langsung di browser favorit Anda.
   - Atau gunakan ekstensi VS Code seperti **Live Server** untuk pengalaman pengembangan lokal yang lebih baik.

2. **Deploy ke Cloud**:
   - Hubungkan repositori ke **Cloudflare Pages** atau **GitHub Pages**.
   - Proyek akan otomatis ter-deploy dalam hitungan detik (karena hanya berisi berkas HTML/CSS/JS statis).

---

## 📄 Lisensi

Proyek ini bersifat open-source di bawah lisensi MIT. Silakan gunakan dan kembangkan lebih lanjut!

*Dibuat dengan ♥ oleh Bisma.*
