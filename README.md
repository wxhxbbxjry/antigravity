# TELERING - Sheet Spek & Harga HP

Aplikasi web modern, responsif, dan realtime yang dirancang khusus untuk **Host Live Streaming (TikTok Live, Shopee Live, IG Live)** toko **TELERING** untuk mengecek harga & spesifikasi smartphone secara instan, serta dilengkapi **Panel Admin**, **Auto-Fill Spek dari Link Web**, dan **Sinkronisasi Cloud Realtime Antar-Perangkat**.

---

## 🎨 Tampilan Header Baru & Logo Resmi TELERING
- **Logo Resmi**: Menampilkan logo resmi TELERING (oval merah beraksen kuning dan teks putih) yang kontras dan elegan di header gelap (`bg-slate-900`).
- **Header Bersih & Minimalis**:
  - Tulisan *Host Live mode*, *Realtime Aktif*, *#telering-live*, serta subjudul *Cek cepat harga & spek - 146 Tipe HP siap live* telah dihapus agar tampilan fokus dan tidak berantakan.
- **Akses Admin Icon Setting**: Tombol Panel Admin cukup menggunakan icon Setting / Gear (⚙️) tanpa teks dan **tanpa menampilkan PIN standar** di modal maupun di error message demi menjaga kerahasiaan.

---

## 📱 Data Bawaan Katalog (146 Smartphone Resmi dari Canva)
- **146 Produk Lengkap**: Seluruh data smartphone dari katalog portofolio Canva (`https://portofolio-kaisya.my.canva.site/spesifikasi-harga-new`) telah diimpor secara penuh sebagai dataset default.
- **Format RAM/ROM Ringkas**: Keterangan memori disederhanakan menjadi format ringkas (contoh: `4/128GB`, `6/128GB`, `8/256GB`, `12/512GB`) baik pada kartu produk, tombol varian, maupun modal edit.
- **Brand Lengkap**: Samsung (33 HP), Xiaomi / Redmi / POCO (25 HP), Realme (21 HP), Oppo (15 HP), Infinix (12 HP), Vivo (10 HP), Tecno (9 HP), Advan (9 HP), Apple iPhone (8 HP), Motorola (2 HP), dan Itel (2 HP).
- **Semua Dilengkapi Foto Resmi**: Setiap produk memiliki tautan gambar produk webp/jpg beresolusi tinggi.
- **72 Produk dengan Multi-Varian**: Dilengkapi konfigurasi memori lengkap beserta masing-masing harga resminya.

---

## ⚡ Fitur Utama Host Live
- **Langsung Terbuka Tanpa PIN**: Host Live tidak terganggu layar kunci PIN saat siaran langsung.
- **Nama & Tipe Produk Terpadu**: Brand dan nama tipe telah disatukan secara rapi (contoh: `OPPO A5X`, `Samsung Galaxy A55 5G`, `Apple IPHONE 16 PRO`) tanpa badge merk ganda yang menumpuk.
- **Icon Visual Spesifikasi Ringkas**: Kartu produk menggunakan icon SVG modern:
  - 💾 **Icon Memory**: Varian RAM / ROM (contoh: `4/128GB`)
  - 🔋 **Icon Baterai**: Kapasitas Baterai (contoh: `5000 mAh`)
  - ⚡ **Icon Microchip**: Chipset / CPU (contoh: `Exynos 1480`)
  - 📷 **Icon Kamera**: Konfigurasi Kamera (contoh: `50MP OIS + 12MP`)
- **Pencarian Bersih**: Input pencarian responsif tanpa shortcut keyboard yang mengganggu.
- **Harga Menonjol & Jelas**: Menampilkan harga dengan font angka tebal dan kontras tinggi.
- **Dukungan Multi-Varian RAM/ROM**: Cukup ketuk varian untuk melihat harganya secara instan dalam 1 detik!
- **Filter Cepat**: Filter Brand & Filter Rentang Harga (`< 2 Juta`, `2-4 Juta`, `4-7 Juta`, `> 7 Juta`).

---

## 🔐 Panel Admin & Form Edit / Tambah Produk

1. **Masuk ke Mode Admin**:
   - Klik icon **Setting (⚙️)** di header atas (PIN tersimpan aman secara privat).
2. **Form Edit & Tambah yang Diperbarui**:
   - **Nama & Tipe Produk Jadi 1**: Satu input terpadu, Brand otomatis terdeteksi untuk kebutuhan filter kategori.
   - **RAM dan ROM Dipisah Bersebelahan di Kiri Harga**:
     - `[ RAM (GB) ]` | `[ ROM (GB) ]` | `[ Harga (Rp) ]`
     - **Format Otomatis Realtime**:
       - RAM & ROM otomatis diformat menjadi: `4/128GB`
       - Harga otomatis diformat Rupiah: `Rp 7.999.000`
   - **Varian Tambahan Dinamis**:
     - Tombol `+ Tambah Varian RAM / ROM & Harga` menambahkan baris varian dengan format yang sama: `[ RAM ]` | `[ ROM ]` | `[ Harga ]` | `[ 🗑️ Hapus ]`.
   - **Link Address Foto Produk**: Dilengkapi live image preview dan tombol hapus URL.
3. **Penyimpanan Ganda**:
   - Tersimpan secara lokal di browser (`localStorage`).
   - Otomatis di-broadcast ke seluruh perangkat melalui Cloud Realtime Sync.

---

## 🔗 Bagikan Link & Realtime Cloud Sync
- **Salin Link 1-Klik**: Tautan otomatis berisi ID Room/Channel.
- **Scan QR Code**: Host Live cukup mengarahkan kamera HP ke QR Code di layar Admin untuk langsung membuka katalog di HP mereka tanpa repot mengetik link!
- **Terupdate Secara Realtime Tanpa Refresh**: Ketika Admin mengubah harga/spek, layar HP Host Live langsung terupdate seketika dengan animasi kedip hijau (*glow animation*).

---

## 📊 File Excel Template
- File `Template_Katalog_HP_TELERING.xlsx` memuat seluruh **146 produk** lengkap dari katalog Canva dengan format RAM/ROM ringkas `4/128GB`.
