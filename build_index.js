const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'default_products.json'), 'utf8'));

const template = `<!DOCTYPE html>
<html lang="id" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="page-type" content="software">
  <meta name="site-kind" content="software">
  <meta name="theme-color" content="#ffffff">
  <title>TELERING — Katalog Spesifikasi & Cheat Sheet Host Live</title>
  
  <!-- Typography: Plus Jakarta Sans (Editorial & UI) & JetBrains Mono (Prices) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            telering: {
              50: '#fff1f0',
              100: '#ffe1de',
              500: '#ff3823',
              600: '#e62b17',
              700: '#cc2110',
            }
          },
          boxShadow: {
            'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
            'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          }
        }
      }
    }
  </script>

  <!-- SheetJS for Excel Parsing & Generation -->
  <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

  <!-- QRCode.js for generating share QR codes -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

  <!-- MQTT.js for Instant Realtime Cloud Sync -->
  <script src="https://unpkg.com/mqtt@5.3.5/dist/mqtt.min.js"></script>

  <!-- Vue 3 CDN (Production) -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

  <style>
    /* Clean Bright Light System */
    :root {
      --bg-ground: #f8fafc;
      --surface-card: #ffffff;
      --border-hairline: #e2e8f0;
      --border-highlight: #cbd5e1;
      --ink-primary: #0f172a;
      --ink-secondary: #475569;
      --ink-muted: #94a3b8;
    }

    body {
      background-color: var(--bg-ground);
      color: var(--ink-primary);
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Restrained Scrollbar */
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    [v-cloak] {
      display: none !important;
    }

    /* Accessibility Focus Ring */
    *:focus-visible {
      outline: 2px solid #ff3823;
      outline-offset: 2px;
    }

    /* Micro-interactions: Smooth 2px lift on white card */
    .card-lift {
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease, box-shadow 0.18s ease;
      will-change: transform;
    }
    .card-lift:hover {
      transform: translateY(-2px);
      border-color: #cbd5e1;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }

    /* Image zoom within optical frame */
    .img-frame img {
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-lift:hover .img-frame img {
      transform: scale(1.03);
    }

    /* Hide scrollbars for pill rails */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Touch targets */
    .touch-target {
      min-height: 44px;
      min-width: 44px;
    }
  </style>
</head>

<body class="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-telering-500 selection:text-white">
  
  <div id="app" v-cloak class="min-h-screen flex flex-col">

    <!-- ======================================================== -->
    <!-- 1. TOP APP BAR (CRISP BRIGHT WHITE NAVBAR)               -->
    <!-- ======================================================== -->
    <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div class="flex items-center justify-between gap-3">
          
          <!-- Brand Mark & Live Badge -->
          <div class="flex items-center gap-3">
            <a href="#" @click.prevent="resetAllFilters" class="flex items-center gap-2 group" title="TELERING — Kembali ke Semua Katalog">
              <img 
                src="logo_telering.png" 
                alt="TELERING Logo"
                class="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
                onerror="this.style.display='none'; document.getElementById('text-logo-fallback').style.display='flex';"
              >
              <div id="text-logo-fallback" style="display:none" class="items-center gap-1 font-extrabold tracking-tight text-slate-900 text-base">
                <span class="bg-telering-500 text-white px-2 py-0.5 rounded">TELE</span><span>RING</span>
              </div>
            </a>

            <!-- Realtime Cloud Sync Status Pill -->
            <div class="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs">
              <span class="relative flex h-2 w-2">
                <span v-if="cloudConnected" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2" :class="cloudConnected ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              </span>
              <span class="text-xs text-slate-600 font-medium">
                {{ cloudConnected ? 'Cloud Sync Aktif' : 'Menghubungkan...' }}
              </span>
              <span class="text-slate-300">·</span>
              <span class="text-xs font-mono font-bold text-slate-800">{{ filteredProducts.length }} Model</span>
            </div>
          </div>

          <!-- Quick Actions: View Toggle, Compare Counter, Share, Admin -->
          <div class="flex items-center gap-2">
            
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200" role="group" aria-label="Mode Tampilan">
              <button 
                @click="viewMode = 'grid'"
                class="px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                :class="viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                title="Tampilan Kartu Katalog"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span class="hidden sm:inline">Katalog</span>
              </button>
              <button 
                @click="viewMode = 'table'"
                class="px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                title="Tampilan Tabel Host Live"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="hidden sm:inline">Tabel Host</span>
              </button>
            </div>

            <!-- Compare Trigger -->
            <button 
              v-if="compareList.length > 0"
              @click="openCompareModal = true"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-all"
              title="Buka Perbandingan Spesifikasi"
            >
              <span class="w-2 h-2 rounded-full bg-telering-500"></span>
              <span>Bandingkan</span>
              <span class="px-1.5 py-0.2 rounded bg-telering-500 text-white font-mono text-[10px]">{{ compareList.length }}</span>
            </button>

            <!-- Bagikan Link / QR -->
            <button 
              @click="openShareModal"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
              title="Bagikan Katalog & QR Code"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span class="hidden sm:inline">Bagikan</span>
            </button>

            <!-- Admin Access Button -->
            <button 
              v-if="!isAdmin"
              @click="openAdminLoginModal"
              class="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors"
              title="Akses Admin"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>

            <!-- Admin Actions when Logged In -->
            <div v-else class="flex items-center gap-1.5">
              <button 
                @click="openAddProductModal"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-telering-500 hover:bg-telering-600 text-white shadow-xs transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span class="hidden sm:inline">Tambah HP</span>
              </button>

              <button 
                @click="openExcelModal = true"
                class="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
                title="Kelola Excel"
              >
                <span class="hidden sm:inline">Excel</span>
                <span class="sm:hidden font-mono text-xs">XL</span>
              </button>

              <button 
                @click="logoutAdmin"
                class="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                title="Keluar Admin"
              >
                Keluar
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>

    <!-- ======================================================== -->
    <!-- 2. STICKY FILTER & SEARCH RAIL (CLEAN BRIGHT BAR)        -->
    <!-- ======================================================== -->
    <div class="sticky top-[53px] sm:top-[57px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 space-y-2.5">
        
        <!-- Search & Quick Sort Row -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Precision Search Field -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              ref="searchInput"
              type="text" 
              v-model="searchQuery"
              placeholder="Cari tipe HP, brand, chipset, kamera, atau varian..."
              class="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
            >
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
              title="Bersihkan Pencarian"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Sort Select -->
          <div class="shrink-0 relative">
            <select 
              v-model="sortBy"
              class="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
            >
              <option value="featured">Paling Populer</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="name-asc">Nama Model (A-Z)</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>

        <!-- Filter Chips: Brand, Budget, and Features -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          
          <!-- All Brands Chip -->
          <button 
            @click="selectedBrand = 'all'"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1.5"
            :class="selectedBrand === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'"
          >
            <span>Semua Brand</span>
            <span class="px-1.5 py-0.2 rounded text-[10px]" :class="selectedBrand === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'">{{ products.length }}</span>
          </button>
          
          <!-- Brand List Chips -->
          <button 
            v-for="b in availableBrands" :key="b.name"
            @click="selectedBrand = b.name"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1.5"
            :class="selectedBrand === b.name ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'"
          >
            <span>{{ b.name }}</span>
            <span class="px-1.5 py-0.2 rounded text-[10px]" :class="selectedBrand === b.name ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'">{{ b.count }}</span>
          </button>

          <div class="h-3.5 w-[1px] bg-slate-200 mx-1 shrink-0"></div>

          <!-- Price Range Chips -->
          <button 
            @click="togglePriceFilter('under-2m')"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === 'under-2m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            &lt; 2 Juta
          </button>
          <button 
            @click="togglePriceFilter('2m-4m')"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === '2m-4m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            2 - 4 Juta
          </button>
          <button 
            @click="togglePriceFilter('4m-7m')"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === '4m-7m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            4 - 7 Juta
          </button>
          <button 
            @click="togglePriceFilter('above-7m')"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === 'above-7m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            &gt; 7 Juta
          </button>

          <div class="h-3.5 w-[1px] bg-slate-200 mx-1 shrink-0"></div>

          <!-- Feature Filters -->
          <button 
            @click="filter5gOnly = !filter5gOnly"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1"
            :class="filter5gOnly ? 'bg-telering-50 text-telering-600 border-telering-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            <span>5G</span>
          </button>

          <button 
            @click="filterNfcOnly = !filterNfcOnly"
            class="px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1"
            :class="filterNfcOnly ? 'bg-sky-50 text-sky-600 border-sky-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            <span>NFC</span>
          </button>

          <!-- Reset Filter if any active -->
          <button 
            v-if="isFiltered" 
            @click="resetAllFilters"
            class="px-2 py-1 rounded-md font-bold shrink-0 text-telering-600 hover:text-telering-700 text-[11px] underline underline-offset-2 ml-1"
          >
            Reset
          </button>

        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 3. TOAST NOTIFICATION                                    -->
    <!-- ======================================================== -->
    <transition enter-active-class="transform ease-out duration-200 transition" enter-from-class="translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="toastMessage" class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 text-xs font-bold flex items-center gap-2.5 max-w-sm">
        <span class="w-2 h-2 rounded-full bg-telering-500 shrink-0"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- ======================================================== -->
    <!-- 4. MAIN CONTENT AREA (BRIGHT EDITORIAL CATALOG)          -->
    <!-- ======================================================== -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

      <!-- Hero Header Statement -->
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Katalog Spesifikasi & Harga HP
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
            Data spesifikasi resmi & cheat sheet poin jualan live streaming TELERING.
          </p>
        </div>

        <div class="text-xs text-slate-500 font-mono font-medium">
          Menampilkan <span class="text-slate-900 font-bold">{{ filteredProducts.length }}</span> dari {{ products.length }} produk
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div class="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-slate-900">Tidak Ada Smartphone yang Sesuai</h3>
        <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.</p>
        <button 
          @click="resetAllFilters"
          class="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-colors"
        >
          Bersihkan Semua Filter
        </button>
      </div>

      <!-- ==================================================== -->
      <!-- 4A. GRID VIEW: BRIGHT HIGH-TASTE PRODUCT CARDS       -->
      <!-- ==================================================== -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        <article 
          v-for="item in filteredProducts" 
          :key="item.id"
          class="card-lift bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between group relative overflow-hidden shadow-card"
          :class="{'ring-2 ring-telering-500 border-telering-500': isCompared(item.id)}"
        >

          <!-- Top Section: Visual Frame + Badge + Compare Checkbox -->
          <div>
            
            <!-- Header bar inside card: Brand label & Compare Check -->
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                {{ item.Brand }}
              </span>

              <!-- Compare Checkbox -->
              <button 
                @click.stop="toggleCompare(item)"
                class="px-2 py-0.5 rounded text-[11px] font-bold transition-colors border flex items-center gap-1"
                :class="isCompared(item.id) ? 'bg-telering-500 text-white border-telering-500' : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100'"
                title="Bandingkan dengan HP lain"
              >
                <svg v-if="isCompared(item.id)" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>Bandingkan</span>
              </button>
            </div>

            <!-- Optical Image Frame (Clean Light Frame) -->
            <div 
              @click="openDetail(item)"
              class="img-frame cursor-pointer h-44 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-3 relative overflow-hidden group/img"
            >
              <img 
                :src="item.Gambar_URL" 
                :alt="item.Nama_Produk"
                class="max-h-full max-w-full object-contain filter drop-shadow-sm"
                loading="lazy"
                onerror="this.src='https://placehold.co/300x400/f8fafc/94a3b8?text=Spek+HP';"
              >

              <!-- Quick View Pill Overlay on Hover -->
              <div class="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span class="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 text-xs font-bold border border-slate-200 shadow-sm">
                  Lihat Spek
                </span>
              </div>
            </div>

            <!-- Product Title & Memory Variant -->
            <div class="mt-3.5 space-y-1">
              <h2 
                @click="openDetail(item)"
                class="text-sm sm:text-base font-black text-slate-900 hover:text-telering-600 cursor-pointer line-clamp-1 leading-snug"
                :title="item.Nama_Produk"
              >
                {{ item.Nama_Produk }}
              </h2>

              <!-- Variant Selector / RAM Display -->
              <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span 
                  v-if="!item.variants || item.variants.length === 0"
                  class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/80"
                >
                  {{ item.RAM_ROM }}
                </span>
                <template v-else>
                  <button 
                    @click.stop="item._selectedVariantIndex = -1"
                    class="px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors"
                    :class="item._selectedVariantIndex === -1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ item.RAM_ROM }}
                  </button>
                  <button 
                    v-for="(v, vIdx) in item.variants" :key="vIdx"
                    @click.stop="item._selectedVariantIndex = vIdx"
                    class="px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors"
                    :class="item._selectedVariantIndex === vIdx ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ v.ram_rom }}
                  </button>
                </template>
              </div>
            </div>

            <!-- Price Block -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <div class="text-base sm:text-lg font-mono font-black text-slate-900">
                  {{ formatRupiah(getCurrentPrice(item)) }}
                </div>
                <div v-if="item.Harga_Normal && item.Harga_Normal > getCurrentPrice(item)" class="text-[11px] text-slate-400 line-through font-mono">
                  {{ formatRupiah(item.Harga_Normal) }}
                </div>
              </div>

              <span v-if="is5G(item)" class="px-1.5 py-0.5 rounded text-[10px] font-black bg-telering-50 text-telering-600 border border-telering-200">
                5G
              </span>
            </div>

            <!-- Spec Matrix (Clean Light Strip) -->
            <div class="mt-3 bg-slate-50 rounded-xl border border-slate-200/70 p-2.5 space-y-1.5 text-xs">
              
              <!-- Chipset -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-slate-500 text-[11px] shrink-0 font-medium">Chipset</span>
                <span class="text-slate-800 font-semibold text-[11px] truncate text-right" :title="item.Chipset || '-'">
                  {{ item.Chipset || '-' }}
                </span>
              </div>

              <!-- Baterai -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-slate-500 text-[11px] shrink-0 font-medium">Baterai</span>
                <span class="text-slate-800 font-semibold text-[11px] truncate text-right" :title="item.Baterai || '-'">
                  {{ item.Baterai || '-' }}
                </span>
              </div>

              <!-- Layar -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-slate-500 text-[11px] shrink-0 font-medium">Layar</span>
                <span class="text-slate-800 font-semibold text-[11px] truncate text-right" :title="item.Layar || '-'">
                  {{ item.Layar || '-' }}
                </span>
              </div>

              <!-- Kamera -->
              <div class="flex items-center justify-between gap-2">
                <span class="text-slate-500 text-[11px] shrink-0 font-medium">Kamera</span>
                <span class="text-slate-800 font-semibold text-[11px] truncate text-right" :title="item.Kamera || '-'">
                  {{ item.Kamera || '-' }}
                </span>
              </div>

            </div>

          </div>

          <!-- Bottom Actions: Copy Live Caption & Detail -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
            
            <button 
              @click="copyLiveCaption(item)"
              class="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              title="Salin caption ringkas untuk live streaming"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Salin Spek</span>
            </button>

            <button 
              @click="openDetail(item)"
              class="py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-colors"
              title="Buka spesifikasi lengkap & poin jualan"
            >
              Detail
            </button>

            <!-- Admin Edit Button -->
            <button 
              v-if="isAdmin"
              @click="openEditProductModal(item)"
              class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
              title="Edit Data Produk"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

          </div>

        </article>

      </div>

      <!-- ==================================================== -->
      <!-- 4B. TABLE VIEW: LIVE HOST SPEED MATRIX               -->
      <!-- ==================================================== -->
      <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold text-[11px]">
                <th class="py-3 px-4 shrink-0">Model Smartphone</th>
                <th class="py-3 px-4">Varian & Harga</th>
                <th class="py-3 px-4">Chipset</th>
                <th class="py-3 px-4">Layar</th>
                <th class="py-3 px-4">Baterai</th>
                <th class="py-3 px-4">Kamera</th>
                <th class="py-3 px-4 text-right">Aksi Host Live</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="item in filteredProducts" 
                :key="item.id"
                class="hover:bg-slate-50 transition-colors group"
                :class="{'bg-telering-50/40': isCompared(item.id)}"
              >
                <!-- Model & Brand -->
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <img 
                      :src="item.Gambar_URL" 
                      :alt="item.Nama_Produk"
                      class="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                      loading="lazy"
                      onerror="this.src='https://placehold.co/100x100/f8fafc/94a3b8?text=HP';"
                    >
                    <div>
                      <div class="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-telering-600 cursor-pointer" @click="openDetail(item)">
                        {{ item.Nama_Produk }}
                      </div>
                      <div class="text-[11px] text-slate-500 font-semibold">
                        {{ item.Brand }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Price & Variant -->
                <td class="py-3 px-4 font-mono">
                  <div class="font-bold text-slate-900 text-xs sm:text-sm">
                    {{ formatRupiah(getCurrentPrice(item)) }}
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">
                    {{ getCurrentRam(item) }}
                  </div>
                </td>

                <!-- Chipset -->
                <td class="py-3 px-4 text-slate-700 font-medium">
                  <span class="line-clamp-1" :title="item.Chipset">{{ item.Chipset || '-' }}</span>
                </td>

                <!-- Layar -->
                <td class="py-3 px-4 text-slate-700 font-medium">
                  <span class="line-clamp-1" :title="item.Layar">{{ item.Layar || '-' }}</span>
                </td>

                <!-- Baterai -->
                <td class="py-3 px-4 text-slate-700 font-medium">
                  <span class="line-clamp-1" :title="item.Baterai">{{ item.Baterai || '-' }}</span>
                </td>

                <!-- Kamera -->
                <td class="py-3 px-4 text-slate-700 font-medium">
                  <span class="line-clamp-1" :title="item.Kamera">{{ item.Kamera || '-' }}</span>
                </td>

                <!-- Actions -->
                <td class="py-3 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="copyLiveCaption(item)"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-bold transition-colors"
                      title="Salin caption spek live"
                    >
                      Salin
                    </button>
                    <button 
                      @click="openDetail(item)"
                      class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold shadow-xs transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- ======================================================== -->
    <!-- 5. FLOATING COMPARISON DOCK                              -->
    <!-- ======================================================== -->
    <transition enter-active-class="transform ease-out duration-200" enter-from-class="translate-y-10 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transform ease-in duration-150" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
      <div v-if="compareList.length > 0" class="fixed bottom-5 inset-x-0 mx-auto max-w-lg z-40 px-4">
        <div class="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
          
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div 
              v-for="cId in compareList" :key="cId" 
              class="relative w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group"
            >
              <img 
                :src="getProductById(cId)?.Gambar_URL" 
                :alt="getProductById(cId)?.Nama_Produk"
                class="w-7 h-7 object-contain"
              >
              <button 
                @click="removeCompare(cId)"
                class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus dari perbandingan"
              >
                ×
              </button>
            </div>
            <span class="text-xs text-slate-700 font-bold pl-1">
              {{ compareList.length }} HP Dipilih
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="compareList = []"
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button 
              @click="openCompareModal = true"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Bandingkan</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- ======================================================== -->
    <!-- 6. MODAL: SIDE-BY-SIDE COMPARISON                        -->
    <!-- ======================================================== -->
    <div v-if="openCompareModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Perbandingan Spesifikasi Smartphone</h3>
            <p class="text-xs text-slate-500 mt-0.5">Membandingkan {{ compareList.length }} model smartphone secara langsung.</p>
          </div>
          <button @click="openCompareModal = false" class="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Comparison Grid Table -->
        <div class="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div class="grid" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }" style="gap: 16px;">
            
            <div v-for="cId in compareList" :key="cId" class="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center">
              <img 
                :src="getProductById(cId)?.Gambar_URL" 
                :alt="getProductById(cId)?.Nama_Produk"
                class="h-32 object-contain mb-3"
              >
              <div class="text-[11px] font-black text-slate-500 uppercase">{{ getProductById(cId)?.Brand }}</div>
              <h4 class="font-bold text-slate-900 text-sm mt-0.5">{{ getProductById(cId)?.Nama_Produk }}</h4>
              <div class="text-sm font-mono font-black text-telering-600 mt-1">
                {{ formatRupiah(getCurrentPrice(getProductById(cId))) }}
              </div>
              <button 
                @click="removeCompare(cId)"
                class="mt-2 text-[11px] text-rose-500 hover:text-rose-600 font-semibold underline"
              >
                Hapus
              </button>
            </div>

          </div>

          <!-- Spec Comparison Rows -->
          <div class="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs">
            
            <!-- Row: Chipset -->
            <div class="p-3 bg-slate-100 font-bold text-slate-700">Chipset & Processor</div>
            <div class="grid bg-white divide-x divide-slate-200" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }">
              <div v-for="cId in compareList" :key="cId" class="p-3 text-slate-800 font-medium">
                {{ getProductById(cId)?.Chipset || '-' }}
              </div>
            </div>

            <!-- Row: RAM & Storage -->
            <div class="p-3 bg-slate-100 font-bold text-slate-700">RAM & Memori Internal</div>
            <div class="grid bg-white divide-x divide-slate-200" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }">
              <div v-for="cId in compareList" :key="cId" class="p-3 text-slate-800 font-mono font-bold">
                {{ getProductById(cId)?.RAM_ROM || '-' }}
              </div>
            </div>

            <!-- Row: Baterai -->
            <div class="p-3 bg-slate-100 font-bold text-slate-700">Baterai & Pengisian Daya</div>
            <div class="grid bg-white divide-x divide-slate-200" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }">
              <div v-for="cId in compareList" :key="cId" class="p-3 text-slate-800 font-medium">
                {{ getProductById(cId)?.Baterai || '-' }}
              </div>
            </div>

            <!-- Row: Layar -->
            <div class="p-3 bg-slate-100 font-bold text-slate-700">Layar & Panel</div>
            <div class="grid bg-white divide-x divide-slate-200" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }">
              <div v-for="cId in compareList" :key="cId" class="p-3 text-slate-800 font-medium">
                {{ getProductById(cId)?.Layar || '-' }}
              </div>
            </div>

            <!-- Row: Kamera -->
            <div class="p-3 bg-slate-100 font-bold text-slate-700">Kamera Utama & Selfie</div>
            <div class="grid bg-white divide-x divide-slate-200" :style="{ gridTemplateColumns: 'repeat(' + (compareList.length) + ', minmax(220px, 1fr))' }">
              <div v-for="cId in compareList" :key="cId" class="p-3 text-slate-800 font-medium">
                {{ getProductById(cId)?.Kamera || '-' }}
              </div>
            </div>

          </div>
        </div>

        <div class="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button @click="openCompareModal = false" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors">
            Tutup Perbandingan
          </button>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 7. MODAL: DETAIL PRODUK & CHEAT SHEET LIVE HOST          -->
    <!-- ======================================================== -->
    <div v-if="activeProduct" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-slate-500 uppercase tracking-wider">{{ activeProduct.Brand }}</span>
            <span class="text-slate-300">·</span>
            <h3 class="text-base sm:text-lg font-black text-slate-900">{{ activeProduct.Nama_Produk }}</h3>
          </div>
          <button @click="activeProduct = null" class="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content Body -->
        <div class="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          <!-- Top Hero Row: Image, Price & Variant Switcher -->
          <div class="flex flex-col sm:flex-row gap-5 items-start">
            <div class="w-full sm:w-48 h-48 rounded-2xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-center shrink-0">
              <img 
                :src="activeProduct.Gambar_URL" 
                :alt="activeProduct.Nama_Produk"
                class="max-h-full max-w-full object-contain filter drop-shadow-md"
              >
            </div>

            <div class="flex-1 space-y-3">
              <div>
                <div class="text-xs text-slate-500 font-semibold">Harga Katalog Resmi:</div>
                <div class="text-2xl font-mono font-black text-slate-900 mt-0.5">
                  {{ formatRupiah(getCurrentPrice(activeProduct)) }}
                </div>
                <div v-if="activeProduct.Harga_Normal && activeProduct.Harga_Normal > getCurrentPrice(activeProduct)" class="text-xs text-slate-400 line-through font-mono">
                  Harga Normal: {{ formatRupiah(activeProduct.Harga_Normal) }}
                </div>
              </div>

              <!-- Variant Selector inside Modal -->
              <div v-if="activeProduct.variants && activeProduct.variants.length > 0">
                <div class="text-xs text-slate-600 mb-1.5 font-bold">Pilih Varian RAM / Storage:</div>
                <div class="flex flex-wrap gap-1.5">
                  <button 
                    @click="activeProduct._selectedVariantIndex = -1"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors"
                    :class="activeProduct._selectedVariantIndex === -1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ activeProduct.RAM_ROM }}
                  </button>
                  <button 
                    v-for="(v, vIdx) in activeProduct.variants" :key="vIdx"
                    @click="activeProduct._selectedVariantIndex = vIdx"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors"
                    :class="activeProduct._selectedVariantIndex === vIdx ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ v.ram_rom }}
                  </button>
                </div>
              </div>

              <!-- Quick Action Pills -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button 
                  @click="copyLiveCaption(activeProduct)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Salin Caption Live</span>
                </button>

                <button 
                  @click="toggleCompare(activeProduct)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors"
                  :class="isCompared(activeProduct.id) ? 'bg-telering-500 text-white border-telering-500' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'"
                >
                  {{ isCompared(activeProduct.id) ? '✓ Masuk Komparasi' : '+ Bandingkan' }}
                </button>
              </div>

            </div>
          </div>

          <!-- Section: Live Stream Talking Points -->
          <div class="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-telering-500 animate-pulse"></span>
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900">Cheat Sheet Poin Jualan Host Live</h4>
            </div>
            <ul class="space-y-1.5 text-xs text-slate-700">
              <li class="flex items-start gap-2">
                <span class="text-telering-500 font-bold shrink-0">✦</span>
                <span><strong>Target Pembeli:</strong> Cocok untuk pengguna yang butuh performa <strong>{{ activeProduct.Chipset }}</strong> dengan baterai hemat <strong>{{ activeProduct.Baterai }}</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-telering-500 font-bold shrink-0">✦</span>
                <span><strong>Kamera & Visual:</strong> Sensor <strong>{{ activeProduct.Kamera }}</strong> di layar jernih <strong>{{ activeProduct.Layar }}</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-telering-500 font-bold shrink-0">✦</span>
                <span><strong>Pemberitahuan Host:</strong> "Langsung tap keranjang kuning sekarang, varian {{ getCurrentRam(activeProduct) }} harga promo {{ formatRupiah(getCurrentPrice(activeProduct)) }}!"</span>
              </li>
            </ul>
          </div>

          <!-- Section: Full Technical Specs Table -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Spesifikasi Lengkap</h4>
            <div class="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div class="flex p-3 bg-white">
                <div class="w-32 shrink-0 text-slate-500 font-medium">Chipset</div>
                <div class="text-slate-900 font-semibold">{{ activeProduct.Chipset || '-' }}</div>
              </div>
              <div class="flex p-3 bg-white">
                <div class="w-32 shrink-0 text-slate-500 font-medium">RAM / Memori</div>
                <div class="text-slate-900 font-mono font-bold">{{ activeProduct.RAM_ROM || '-' }}</div>
              </div>
              <div class="flex p-3 bg-white">
                <div class="w-32 shrink-0 text-slate-500 font-medium">Baterai & Charger</div>
                <div class="text-slate-900 font-semibold">{{ activeProduct.Baterai || '-' }}</div>
              </div>
              <div class="flex p-3 bg-white">
                <div class="w-32 shrink-0 text-slate-500 font-medium">Layar & Refresh</div>
                <div class="text-slate-900 font-semibold">{{ activeProduct.Layar || '-' }}</div>
              </div>
              <div class="flex p-3 bg-white">
                <div class="w-32 shrink-0 text-slate-500 font-medium">Konfigurasi Kamera</div>
                <div class="text-slate-900 font-semibold">{{ activeProduct.Kamera || '-' }}</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button @click="activeProduct = null" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors">
            Tutup
          </button>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 8. MODAL: SHARE & QR CODE                                -->
    <!-- ======================================================== -->
    <div v-if="shareModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
        <h3 class="text-base font-black text-slate-900">Bagikan Katalog Live</h3>
        <p class="text-xs text-slate-500">Scan QR Code atau salin link untuk membuka katalog ini di smartphone host atau penonton.</p>

        <!-- QR Code Container -->
        <div id="qrcode-container" class="flex justify-center my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl mx-auto w-fit"></div>

        <div class="flex items-center gap-2">
          <input 
            type="text" 
            :value="shareUrl" 
            readonly 
            class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono focus:outline-none"
          >
          <button 
            @click="copyShareLink"
            class="px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black shrink-0"
          >
            {{ copiedShareLink ? 'Tersalin!' : 'Salin' }}
          </button>
        </div>

        <button 
          @click="shareModalOpen = false"
          class="w-full py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          Tutup
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 9. MODAL: ADMIN LOGIN (PIN)                              -->
    <!-- ======================================================== -->
    <div v-if="adminLoginModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-xs p-6 space-y-4 shadow-2xl">
        <div class="text-center">
          <div class="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-600 mb-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-sm font-black text-slate-900">Akses Admin TELERING</h3>
          <p class="text-xs text-slate-500 mt-0.5">Masukkan PIN Admin (Bawaan: 8888)</p>
        </div>

        <form @submit.prevent="verifyAdminLogin" class="space-y-3">
          <input 
            type="password" 
            v-model="enteredAdminPin" 
            placeholder="PIN Admin..." 
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-lg text-center text-sm font-mono text-slate-900 tracking-widest focus:outline-none"
            autofocus
          >
          <div v-if="adminPinError" class="text-[11px] text-rose-500 text-center font-bold">PIN yang Anda masukkan salah!</div>
          
          <div class="flex gap-2">
            <button 
              type="button" 
              @click="adminLoginModalOpen = false"
              class="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 10. MODAL: EXCEL SYNC & DATA MANAGEMENT                  -->
    <!-- ======================================================== -->
    <div v-if="openExcelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 class="text-base font-black text-slate-900">Sinkronisasi Data Excel (.xlsx)</h3>
          <button @click="openExcelModal = false" class="text-slate-400 hover:text-slate-900 font-bold">✕</button>
        </div>

        <p class="text-xs text-slate-600">
          Anda dapat mengekspor seluruh katalog saat ini ke Excel atau mengunggah file Excel baru untuk memperbarui data live secara realtime.
        </p>

        <!-- Dropzone -->
        <div 
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="handleFileDrop"
          class="border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer"
          :class="dragOver ? 'border-telering-500 bg-telering-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'"
          @click="$refs.excelFileInput.click()"
        >
          <input type="file" ref="excelFileInput" @change="handleFileSelect" accept=".xlsx, .xls" class="hidden">
          <div class="text-xs text-slate-800 font-bold">Tarik & Lepas File Excel di Sini</div>
          <div class="text-[11px] text-slate-500 mt-1">atau klik untuk memilih file dari komputer Anda</div>
        </div>

        <div v-if="parsedData.length > 0" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center justify-between">
          <span>Terbaca: <strong>{{ parsedData.length }} HP</strong> dari Excel</span>
          <button @click="applyParsedData" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
            Terapkan ke Live
          </button>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <button 
            @click="resetToDefault"
            class="text-xs text-rose-500 hover:text-rose-600 font-bold underline"
          >
            Reset ke Data Bawaan
          </button>

          <button 
            @click="downloadTemplate"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs"
          >
            Unduh Data Excel
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 11. MODAL: TAMBAH / EDIT PRODUK                          -->
    <!-- ======================================================== -->
    <div v-if="editProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 class="text-sm sm:text-base font-black text-slate-900">
            {{ isEditingExisting ? 'Edit Data Smartphone' : 'Tambah Smartphone Baru' }}
          </h3>
          <button @click="editProductModalOpen = false" class="text-slate-400 hover:text-slate-900 font-bold">✕</button>
        </div>

        <form @submit.prevent="saveProductForm" class="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs">
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Brand</label>
              <input type="text" v-model="productForm.Brand" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Nama Produk</label>
              <input type="text" v-model="productForm.Nama_Produk" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Harga Promo (Rp)</label>
              <input type="number" v-model.number="productForm.Harga" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Harga Normal (Rp)</label>
              <input type="number" v-model.number="productForm.Harga_Normal" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-slate-700 mb-1 font-bold">URL Gambar</label>
            <input type="url" v-model="productForm.Gambar_URL" placeholder="https://..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 mb-1 font-bold">RAM / ROM Bawaan</label>
              <input type="text" v-model="productForm.RAM_ROM" placeholder="8/256GB" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Chipset</label>
              <input type="text" v-model="productForm.Chipset" placeholder="Snapdragon 7s Gen 2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Baterai</label>
              <input type="text" v-model="productForm.Baterai" placeholder="5000 mAh" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Layar</label>
              <input type="text" v-model="productForm.Layar" placeholder="6.67 AMOLED" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">Kamera</label>
              <input type="text" v-model="productForm.Kamera" placeholder="50 MP OIS" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none">
            </div>
          </div>

          <!-- Variants List -->
          <div class="pt-2 border-t border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-700 font-bold">Varian Tambahan (Opsional)</span>
              <button type="button" @click="addVariant" class="text-telering-600 hover:text-telering-700 text-xs font-bold">+ Tambah Varian</button>
            </div>
            <div v-for="(v, vI) in productForm.variants" :key="vI" class="flex gap-2 items-center mb-2">
              <input type="text" v-model="v.ram_rom" placeholder="RAM/ROM (cth: 12/512GB)" class="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
              <input type="number" v-model.number="v.price" placeholder="Harga (Rp)" class="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono">
              <button type="button" @click="removeVariant(vI)" class="text-rose-500 p-1 font-bold">✕</button>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button 
              v-if="isEditingExisting" 
              type="button" 
              @click="deleteProduct(productForm.id)"
              class="text-rose-500 hover:text-rose-600 font-bold"
            >
              Hapus HP
            </button>
            <div class="flex gap-2 ml-auto">
              <button type="button" @click="editProductModalOpen = false" class="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">Batal</button>
              <button type="submit" class="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-black shadow-xs">Simpan</button>
            </div>
          </div>

        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 12. FOOTER (CLEAN BRIGHT FOOTER)                         -->
    <!-- ======================================================== -->
    <footer class="border-t border-slate-200 bg-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-900">TELERING</span>
          <span>—</span>
          <span>Katalog & Cheat Sheet Host Live Spesifikasi Smartphone</span>
        </div>
        <div class="flex items-center gap-4 text-[11px] font-medium">
          <span>Realtime Cloud Sync</span>
          <span>·</span>
          <span>120 Model Database</span>
          <span>·</span>
          <span>Host Live Assistant</span>
        </div>
      </div>
    </footer>

  </div>

  <!-- ======================================================== -->
  <!-- VUE 3 APPLICATION SCRIPT WITH PRESERVED LOGIC            -->
  <!-- ======================================================== -->
  <script>
    const { createApp, ref, computed, onMounted, nextTick } = Vue;

    // DEFAULT DATASET (120 Smartphone Resmi TELERING termasuk Z Fold8 Ultra)
    const DEFAULT_PRODUCTS = ${JSON.stringify(products, null, 2)};

    createApp({
      setup() {
        const products = ref([]);
        const searchQuery = ref('');
        const searchInput = ref(null);
        const selectedBrand = ref('all');
        const selectedPriceRange = ref('all');
        const sortBy = ref('featured');
        const viewMode = ref('grid'); // 'grid' | 'table'
        const filter5gOnly = ref(false);
        const filterNfcOnly = ref(false);

        // Comparison Dock
        const compareList = ref([]);
        const openCompareModal = ref(false);

        // Detail Popup
        const activeProduct = ref(null);

        // Excel Modal
        const openExcelModal = ref(false);
        const dragOver = ref(false);
        const parsedData = ref([]);
        const toastMessage = ref('');

        // ADMIN PANEL STATE
        const isAdmin = ref(false);
        const adminLoginModalOpen = ref(false);
        const enteredAdminPin = ref('');
        const adminPinError = ref(false);
        const adminPin = ref(localStorage.getItem('telering_admin_pin') || '8888');

        // PRODUCT EDIT/ADD FORM
        const editProductModalOpen = ref(false);
        const isEditingExisting = ref(false);
        const productForm = ref({
          id: '',
          Brand: '',
          Nama_Produk: '',
          Gambar_URL: '',
          Harga: 0,
          Harga_Normal: 0,
          RAM_ROM: '',
          variants: [],
          Chipset: '',
          Baterai: '',
          Kamera: '',
          Layar: ''
        });

        // REALTIME CLOUD SYNC (HiveMQ MQTT)
        const cloudConnected = ref(false);
        const cloudRoomId = ref(localStorage.getItem('telering_cloud_room') || 'telering-katalog-main');
        const shareModalOpen = ref(false);
        const copiedShareLink = ref(false);
        let mqttClient = null;

        const showToast = (msg) => {
          toastMessage.value = msg;
          setTimeout(() => {
            if (toastMessage.value === msg) toastMessage.value = '';
          }, 3000);
        };

        const formatRupiah = (val) => {
          if (!val || isNaN(val)) return 'Rp 0';
          return 'Rp ' + Number(val).toLocaleString('id-ID');
        };

        const getCurrentPrice = (item) => {
          if (!item) return 0;
          if (item._selectedVariantIndex !== undefined && item._selectedVariantIndex >= 0 && item.variants && item.variants[item._selectedVariantIndex]) {
            return item.variants[item._selectedVariantIndex].price;
          }
          return item.Harga || item.Harga_Promo || item.Harga_Normal || 0;
        };

        const getCurrentRam = (item) => {
          if (!item) return '';
          if (item._selectedVariantIndex !== undefined && item._selectedVariantIndex >= 0 && item.variants && item.variants[item._selectedVariantIndex]) {
            return item.variants[item._selectedVariantIndex].ram_rom;
          }
          return item.RAM_ROM || '';
        };

        const is5G = (item) => {
          if (!item) return false;
          const text = (item.Nama_Produk + ' ' + (item.Chipset || '')).toLowerCase();
          return text.includes('5g');
        };

        // Brand aggregation
        const availableBrands = computed(() => {
          const map = {};
          products.value.forEach(p => {
            const b = p.Brand || 'Lainnya';
            map[b] = (map[b] || 0) + 1;
          });
          return Object.keys(map).sort().map(name => ({
            name,
            count: map[name]
          }));
        });

        // Filter status check
        const isFiltered = computed(() => {
          return selectedBrand.value !== 'all' || 
                 selectedPriceRange.value !== 'all' || 
                 searchQuery.value.trim() !== '' ||
                 filter5gOnly.value ||
                 filterNfcOnly.value;
        });

        // Filtered products list
        const filteredProducts = computed(() => {
          let list = [...products.value];

          // Brand filter
          if (selectedBrand.value !== 'all') {
            list = list.filter(p => p.Brand === selectedBrand.value);
          }

          // Price filter
          if (selectedPriceRange.value === 'under-2m') {
            list = list.filter(p => getCurrentPrice(p) < 2000000);
          } else if (selectedPriceRange.value === '2m-4m') {
            list = list.filter(p => getCurrentPrice(p) >= 2000000 && getCurrentPrice(p) <= 4000000);
          } else if (selectedPriceRange.value === '4m-7m') {
            list = list.filter(p => getCurrentPrice(p) > 4000000 && getCurrentPrice(p) <= 7000000);
          } else if (selectedPriceRange.value === 'above-7m') {
            list = list.filter(p => getCurrentPrice(p) > 7000000);
          }

          // Feature filter: 5G
          if (filter5gOnly.value) {
            list = list.filter(p => is5G(p));
          }

          // Feature filter: NFC
          if (filterNfcOnly.value) {
            list = list.filter(p => {
              const str = (p.Nama_Produk + ' ' + (p.Chipset || '') + ' ' + (p.Layar || '')).toLowerCase();
              return str.includes('nfc');
            });
          }

          // Search Query
          if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim();
            list = list.filter(p => {
              const fullText = (
                (p.Nama_Produk || '') + ' ' + 
                (p.Brand || '') + ' ' + 
                (p.Chipset || '') + ' ' + 
                (p.RAM_ROM || '') + ' ' + 
                (p.Kamera || '') + ' ' + 
                (p.Baterai || '') + ' ' + 
                (p.Layar || '')
              ).toLowerCase();
              return fullText.includes(q);
            });
          }

          // Sorting
          if (sortBy.value === 'price-asc') {
            list.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b));
          } else if (sortBy.value === 'price-desc') {
            list.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a));
          } else if (sortBy.value === 'name-asc') {
            list.sort((a, b) => (a.Nama_Produk || '').localeCompare(b.Nama_Produk || ''));
          }

          return list;
        });

        const togglePriceFilter = (range) => {
          if (selectedPriceRange.value === range) {
            selectedPriceRange.value = 'all';
          } else {
            selectedPriceRange.value = range;
          }
        };

        const resetAllFilters = () => {
          selectedBrand.value = 'all';
          selectedPriceRange.value = 'all';
          searchQuery.value = '';
          filter5gOnly.value = false;
          filterNfcOnly.value = false;
          sortBy.value = 'featured';
        };

        const openDetail = (item) => {
          if (!item) return;
          if (item._selectedVariantIndex === undefined) item._selectedVariantIndex = -1;
          activeProduct.value = item;
        };

        // Comparison feature
        const isCompared = (id) => compareList.value.includes(id);

        const toggleCompare = (item) => {
          if (!item || !item.id) return;
          const idx = compareList.value.indexOf(item.id);
          if (idx >= 0) {
            compareList.value.splice(idx, 1);
          } else {
            if (compareList.value.length >= 3) {
              showToast('Maksimal membandingkan 3 smartphone sekaligus!');
              return;
            }
            compareList.value.push(item.id);
            showToast('Ditambahkan ke perbandingan!');
          }
        };

        const removeCompare = (id) => {
          const idx = compareList.value.indexOf(id);
          if (idx >= 0) compareList.value.splice(idx, 1);
        };

        const getProductById = (id) => products.value.find(p => p.id === id);

        // Copy Live Caption for TikTok/Shopee Broadcast
        const copyLiveCaption = (item) => {
          if (!item) return;
          const price = formatRupiah(getCurrentPrice(item));
          const ram = getCurrentRam(item);
          const caption = \`🔥 \${item.Nama_Produk} (\${ram}) - \${price}
⚡ Chipset: \${item.Chipset || '-'}
🔋 Baterai: \${item.Baterai || '-'}
📸 Kamera: \${item.Kamera || '-'}
📱 Layar: \${item.Layar || '-'}
🛒 Order sekarang di Live Streaming TELERING!\`;

          navigator.clipboard.writeText(caption).then(() => {
            showToast('Caption spesifikasi live disalin ke clipboard!');
          }).catch(() => {
            showToast('Gagal menyalin caption.');
          });
        };

        // Share Feature & QR Code
        const shareUrl = computed(() => window.location.href);

        const openShareModal = () => {
          shareModalOpen.value = true;
          nextTick(() => {
            const container = document.getElementById('qrcode-container');
            if (container) {
              container.innerHTML = '';
              new QRCode(container, {
                text: shareUrl.value,
                width: 160,
                height: 160,
                colorDark: '#0f172a',
                colorLight: '#f8fafc',
                correctLevel: QRCode.CorrectLevel.M
              });
            }
          });
        };

        const copyShareLink = () => {
          navigator.clipboard.writeText(shareUrl.value).then(() => {
            copiedShareLink.value = true;
            showToast('Link katalog berhasil disalin!');
            setTimeout(() => { copiedShareLink.value = false; }, 2000);
          });
        };

        // Admin Management
        const openAdminLoginModal = () => {
          enteredAdminPin.value = '';
          adminPinError.value = false;
          adminLoginModalOpen.value = true;
        };

        const verifyAdminLogin = () => {
          if (enteredAdminPin.value === adminPin.value) {
            isAdmin.value = true;
            adminLoginModalOpen.value = false;
            showToast('Mode Admin Aktif');
          } else {
            adminPinError.value = true;
          }
        };

        const logoutAdmin = () => {
          isAdmin.value = false;
          showToast('Keluar dari Mode Admin');
        };

        // Product Form (Add & Edit)
        const openAddProductModal = () => {
          isEditingExisting.value = false;
          productForm.value = {
            id: 'p-new-' + Date.now(),
            Brand: selectedBrand.value !== 'all' ? selectedBrand.value : 'Samsung',
            Nama_Produk: '',
            Gambar_URL: '',
            Harga: 1999000,
            Harga_Normal: 1999000,
            RAM_ROM: '8/128GB',
            variants: [],
            Chipset: '',
            Baterai: '5000 mAh',
            Kamera: '50 MP',
            Layar: '6.67" 90Hz'
          };
          editProductModalOpen.value = true;
        };

        const openEditProductModal = (item) => {
          isEditingExisting.value = true;
          productForm.value = JSON.parse(JSON.stringify(item));
          editProductModalOpen.value = true;
        };

        const addVariant = () => {
          if (!productForm.value.variants) productForm.value.variants = [];
          productForm.value.variants.push({
            ram_rom: '8/256GB',
            price: productForm.value.Harga || 2499000
          });
        };

        const removeVariant = (index) => {
          productForm.value.variants.splice(index, 1);
        };

        const saveProductForm = () => {
          if (isEditingExisting.value) {
            const idx = products.value.findIndex(p => p.id === productForm.value.id);
            if (idx >= 0) {
              products.value[idx] = { ...productForm.value };
            }
          } else {
            products.value.unshift({ ...productForm.value });
          }

          localStorage.setItem('telering_live_products', JSON.stringify(products.value));
          editProductModalOpen.value = false;
          showToast('Data smartphone berhasil disimpan!');
          broadcastToCloud();
        };

        const deleteProduct = (id) => {
          if (confirm('Hapus smartphone ini dari katalog?')) {
            products.value = products.value.filter(p => p.id !== id);
            localStorage.setItem('telering_live_products', JSON.stringify(products.value));
            editProductModalOpen.value = false;
            showToast('Produk telah dihapus.');
            broadcastToCloud();
          }
        };

        // Excel Handling via SheetJS
        const parseFile = (file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

              parsedData.value = json.map((row, i) => {
                const brand = row['Brand'] || row['Merk'] || 'Lainnya';
                const nama = row['Nama_Produk'] || row['Nama Produk'] || row['Tipe'] || 'HP ' + i;
                const h = Number(row['Harga'] || row['Harga Promo (Rp)'] || row['Harga Promo'] || 1999000);
                return {
                  id: 'p-xl-' + Date.now() + '-' + i,
                  Brand: String(brand).trim(),
                  Nama_Produk: String(nama).trim(),
                  Gambar_URL: String(row['Gambar_URL'] || row['URL Gambar'] || '').trim(),
                  Harga: h,
                  Harga_Normal: Number(row['Harga Normal (Rp)'] || row['Harga Normal'] || h),
                  RAM_ROM: String(row['RAM_ROM'] || row['RAM / Storage Bawaan'] || row['RAM'] || '8/128GB').trim(),
                  variants: [],
                  Chipset: String(row['Chipset'] || row['Chipset / Processor'] || '-').trim(),
                  Baterai: String(row['Baterai'] || row['Baterai & Charging'] || '-').trim(),
                  Kamera: String(row['Kamera'] || '-').trim(),
                  Layar: String(row['Layar'] || '-').trim(),
                  _selectedVariantIndex: -1
                };
              });
              showToast(\`Berhasil membaca \${parsedData.value.length} produk dari Excel!\`);
            } catch (err) {
              showToast('Gagal memproses file Excel.');
            }
          };
          reader.readAsArrayBuffer(file);
        };

        const handleFileSelect = (e) => {
          if (e.target.files[0]) parseFile(e.target.files[0]);
        };

        const handleFileDrop = (e) => {
          dragOver.value = false;
          if (e.dataTransfer.files[0]) parseFile(e.dataTransfer.files[0]);
        };

        const applyParsedData = () => {
          if (parsedData.value.length === 0) return;
          products.value = [...parsedData.value];
          localStorage.setItem('telering_live_products', JSON.stringify(products.value));
          showToast(\`Katalog berhasil diperbarui (\${products.value.length} HP)!\`);
          parsedData.value = [];
          openExcelModal.value = false;
          broadcastToCloud();
        };

        const downloadTemplate = () => {
          const exportData = products.value.map((p, idx) => ({
            'No': idx + 1,
            'Brand': p.Brand,
            'Nama Produk': p.Nama_Produk,
            'Harga Promo (Rp)': p.Harga || p.Harga_Normal,
            'Harga Normal (Rp)': p.Harga_Normal || p.Harga,
            'RAM / Storage Bawaan': p.RAM_ROM,
            'Chipset / Processor': p.Chipset,
            'Baterai & Charging': p.Baterai,
            'Kamera': p.Kamera,
            'Layar': p.Layar,
            'URL Gambar': p.Gambar_URL || ''
          }));
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Katalog_Live");
          XLSX.writeFile(wb, "Katalog_HP_TELERING.xlsx");
          showToast('File Excel terunduh!');
        };

        const resetToDefault = () => {
          if (confirm('Kembalikan ke data bawaan 120 HP katalog resmi?')) {
            products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            localStorage.setItem('telering_live_products', JSON.stringify(DEFAULT_PRODUCTS));
            showToast('Katalog di-reset ke 120 HP bawaan.');
            openExcelModal.value = false;
            broadcastToCloud();
          }
        };

        // Realtime MQTT Sync
        const initMqtt = () => {
          try {
            const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
            const clientId = 'telering_' + Math.random().toString(16).substr(2, 8);
            mqttClient = mqtt.connect(brokerUrl, {
              clientId,
              clean: true,
              connectTimeout: 4000,
              reconnectPeriod: 5000,
            });

            const topic = 'telering/catalog/' + cloudRoomId.value;

            mqttClient.on('connect', () => {
              cloudConnected.value = true;
              mqttClient.subscribe(topic);
            });

            mqttClient.on('message', (t, msg) => {
              try {
                const payload = JSON.parse(msg.toString());
                if (payload.action === 'sync_catalog' && Array.isArray(payload.data)) {
                  products.value = payload.data;
                  localStorage.setItem('telering_live_products', JSON.stringify(payload.data));
                  showToast('Sinkronisasi realtime diterima dari cloud!');
                }
              } catch (e) {}
            });

            mqttClient.on('error', () => { cloudConnected.value = false; });
            mqttClient.on('close', () => { cloudConnected.value = false; });
          } catch (e) {
            console.warn('MQTT init skipped', e);
          }
        };

        const broadcastToCloud = () => {
          if (mqttClient && cloudConnected.value) {
            const topic = 'telering/catalog/' + cloudRoomId.value;
            const payload = JSON.stringify({
              action: 'sync_catalog',
              timestamp: Date.now(),
              data: products.value
            });
            mqttClient.publish(topic, payload);
          }
        };

        onMounted(() => {
          const cached = localStorage.getItem('telering_live_products');
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                products.value = parsed.map(p => ({ ...p, _selectedVariantIndex: -1 }));
              } else {
                products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
              }
            } catch (e) {
              products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            }
          } else {
            products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
          }

          initMqtt();

          // Keyboard shortcut '/' to search
          window.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput.value) {
              e.preventDefault();
              searchInput.value?.focus();
            } else if (e.key === 'Escape') {
              if (activeProduct.value) activeProduct.value = null;
              if (openCompareModal.value) openCompareModal.value = false;
              if (shareModalOpen.value) shareModalOpen.value = false;
              if (adminLoginModalOpen.value) adminLoginModalOpen.value = false;
              if (openExcelModal.value) openExcelModal.value = false;
              if (editProductModalOpen.value) editProductModalOpen.value = false;
            }
          });
        });

        return {
          products,
          searchQuery,
          searchInput,
          selectedBrand,
          selectedPriceRange,
          sortBy,
          viewMode,
          filter5gOnly,
          filterNfcOnly,
          availableBrands,
          isFiltered,
          filteredProducts,
          togglePriceFilter,
          resetAllFilters,
          formatRupiah,
          getCurrentPrice,
          getCurrentRam,
          is5G,
          activeProduct,
          openDetail,
          compareList,
          openCompareModal,
          isCompared,
          toggleCompare,
          removeCompare,
          getProductById,
          copyLiveCaption,
          toastMessage,
          shareModalOpen,
          shareUrl,
          copiedShareLink,
          openShareModal,
          copyShareLink,
          isAdmin,
          adminLoginModalOpen,
          enteredAdminPin,
          adminPinError,
          openAdminLoginModal,
          verifyAdminLogin,
          logoutAdmin,
          editProductModalOpen,
          isEditingExisting,
          productForm,
          openAddProductModal,
          openEditProductModal,
          addVariant,
          removeVariant,
          saveProductForm,
          deleteProduct,
          openExcelModal,
          dragOver,
          parsedData,
          handleFileSelect,
          handleFileDrop,
          applyParsedData,
          downloadTemplate,
          resetToDefault,
          cloudConnected
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), template, 'utf8');
console.log('Successfully generated Bright/Cerah Light-Mode index.html!');
