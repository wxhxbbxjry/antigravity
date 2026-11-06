# 🏃 RunRoute Art | Modern Running Route Generator & GPS Art Planner

Web application interaktif modern untuk perencanaan rute lari kreatif, generator rute melingkar (*random loop*) presisi tinggi, dan pembuat karya seni GPS (*GPS Art Planner*) berbasis **Next.js 14 (App Router)**, **Tailwind CSS**, dan **Lucide React**.

Didesain dengan antarmuka bertema *Cyber Running Gear* (Dark Mode beraksen Neon Lime & Electric Orange), 100% responsif di desktop maupun smartphone, serta dioptimalkan langsung untuk deploy di **Vercel** tanpa konfigurasi rumit.

> 🌟 **100% GRATIS SEUMUR HIDUP**: Tanpa Google Maps API Key, tanpa Mapbox Token berbayar, dan tanpa tagihan kartu kredit.

---

## ✨ Fitur Unggulan

### 1. Mode 1: Manual Tap-to-Route
- **Interaksi Langsung di Peta**: Klik atau tap di mana saja untuk meletakkan titik awal dan waypoint lari.
- **Real-Time Distance Meter**: Jarak otomatis dikalkulasikan secara instan dalam satuan kilometer (KM).
- **Toggle "Snap to Roads" vs "Straight Line"**:
  - *Snap to Roads*: Mengikuti jalan setapak, trotoar, dan jalur pedestrian melalui OSRM Foot Profile.
  - *Straight Line*: Mode gambar bebas langsung antar titik tanpa batasan jaringan jalan.
- **Fasilitas Kontrol**: Undo titik terakhir, Tutup Loop (*Close Circuit* ke titik asal), Balik Arah (*Reverse Direction*), dan Reset Semua.

### 2. Mode 2: Random Loop Route Generator (5K, 10K, 21K, 42K)
- **Titik Awal Fleksibel**: Pilih lokasi dengan sekali klik di peta atau gunakan tombol **"Gunakan GPS Saya"** (*Browser Geolocation*).
- **Preset Cepat**: Tombol cepat untuk target jarak populer: **5K** (Fun Run), **10K** (Standard), **21K** (Half Marathon), **42K** (Full Marathon), atau slider custom dari **1 KM hingga 50 KM**.
- **Algoritma Sirkuit Cerdas**:
  - Menghitung radius lingkaran ideal berdasarkan formula $R \approx \frac{D}{2\pi \times \tau}$ dengan faktor kelokan jalan (*road tortuosity factor* $\tau \approx 1.28$).
  - Membentuk poligon dinamis yang dihubungkan lewat OSRM Foot router sehingga rute dimulai dan berakhir tepat di lokasi Anda dengan deviasi jarak target minimal (±5-10%).
- **Tombol Re-roll / Acak Ulang**: Jika ingin rute alternatif, klik re-roll untuk memutar orientasi dan menghasilkan variasi jalur lari baru.

### 3. Mode 3: GPS Art / Shape Route (Anjing, Kucing, Kubus, Hati, Bintang, Mahkota)
- **Pustaka Vektor Terstandarisasi**:
  - ❤️ **Hati / Love**: Kurva parametrik kardioid romantis.
  - ⭐ **5-Point Star**: Bintang tegas dan simetris.
  - 🧊 **3D Isometric Cube**: Kubus 3 dimensi bervolume nyata di atas tata ruang kota.
  - 🐱 **Cute Cat**: Siluet kucing lucu dengan telinga dan ekor meliuk.
  - 🐶 **Playful Dog**: Anjing pelari setia dengan moncong dan ekor bergoyang.
  - 👑 **Champion Crown**: Mahkota juara untuk merayakan rekor Personal Best (PB).
- **Transformasi Geometris Peta**:
  - Transformasi koordinat normalisasi $[-0.5, 0.5]$ ke koordinat bumi asli dengan koreksi kelengkungan lintang ($\cos(\text{lat})$).
  - **Skala Ukuran (KM)**: Geser ukuran karya seni dari 0.8 KM (kelurahan) hingga 12 KM (skala kota).
  - **Rotasi $0^\circ - 360^\circ$**: Sesuaikan orientasi gambar agar selaras dengan pola jalanan di lingkungan Anda.
  - **Blueprint Overlay Toggle**: Tampilkan garis neon cyan bentuk asli vs jalur yang disnap ke jalan terdekat.
  - **Selebrasi Confetti**: Efek animasi visual saat rute GPS art berhasil terbentuk.

### 4. Export & Utility Tools
- **Ekspor Format `.GPX`**: File GPX standar versi 1.1 yang valid dan langsung siap diimpor ke **Strava**, **Garmin Connect**, **Coros**, **Suunto**, dan **Wahoo**.
  - Dilengkapi sinkronisasi *timestamp* otomatis berdasarkan target *pace* lari Anda sehingga Strava langsung mendeteksi waktu tempuh dan pace yang akurat!
- **Ekspor Format `.GeoJSON`**: Format data geospasial standar untuk GIS, Mapbox, QGIS, atau analisis spasial.
- **Live Stats HUD & Pace Calculator**:
  - Jarak total (KM), estimasi waktu tempuh ($HH:MM:SS$), perkiraan pembakaran kalori ($kcal$), dan *elevation gain* ($+m$).
  - Slider pace interaktif (3:30/km hingga 11:00/km) dengan preset: *Jalan Santai*, *Jogging Santai*, *Pace Sedang*, *Tempo Run*, *Speed PB*.
- **Profil Elevasi Interaktif**: Grafik kurva ketinggian rute (naik/turun per kilometer) dengan tampilan SVG area chart.
- **Pilihan Base Map**:
  - *Cyber Dark* (CartoDB Dark Matter)
  - *OpenStreetMap Standar*
  - *Clean Light* (CartoDB Positron)
  - *Satellite Esri Imagery*

---

## 🛠️ Arsitektur Teknologi

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Peta Interaktif**: [Leaflet.js](https://leafletjs.com/) dengan Dynamic Client-Side Import (`ssr: false`) — **100% bebas error build SSR** `window is not defined`.
- **Routing Engine**: Public OSRM Demo Server (`https://router.project-osrm.org/route/v1/foot/...`) dengan fallback otomatis ke direct geometric line jika limit/offline.
- **Base Tiles**: OpenStreetMap & CartoDB (Free for Open Web).

---

## 🚀 Panduan Menjalankan Secara Lokal

Pastikan Anda telah menginstal **Node.js 18+**:

```bash
# 1. Pindah ke direktori proyek
cd run-route-art

# 2. Instal dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 📦 Build Produksi & Deploy ke Vercel

Proyek ini telah diverifikasi dan lolos kompilasi penuh:

```bash
npm run build
```

### Langkah Deploy ke Vercel:
1. Hubungkan repository GitHub Anda ke [Vercel](https://vercel.com).
2. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.
3. Klik **Deploy** tanpa perlu mengisi Environment Variable apapun (karena semua peta dan data rute 100% gratis tanpa API key)!
