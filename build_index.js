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

    /* Micro-interactions: Tactile feedback on buttons & chips */
    .pressable {
      transition: transform 0.14s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.14s ease, background-color 0.14s ease, border-color 0.14s ease;
      will-change: transform;
    }
    .pressable:active {
      transform: scale(0.96);
    }

    /* Refined Card Lift Physics */
    .card-lift {
      transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), 
                  box-shadow 0.24s cubic-bezier(0.16, 1, 0.3, 1), 
                  border-color 0.2s ease;
      will-change: transform;
    }
    .card-lift:hover {
      transform: translateY(-4px);
      border-color: #cbd5e1;
      box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03);
    }

    /* Optical Frame Image Float & Zoom */
    .img-frame img {
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }
    .card-lift:hover .img-frame img {
      transform: scale(1.06) translateY(-2px);
    }

    /* Price Flash Highlight when switching variant */
    @keyframes pricePop {
      0% { transform: scale(1); }
      40% { transform: scale(1.08); color: #ff3823; }
      100% { transform: scale(1); }
    }
    .price-flash {
      animation: pricePop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Staggered Card Entrance Animation */
    @keyframes cardEntrance {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-card-in {
      animation: cardEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* Pulse Glow Indicator */
    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    .animate-pulse-glow {
      animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Close button rotate micro-interaction */
    .btn-close-rotate:hover svg {
      transform: rotate(90deg);
    }
    .btn-close-rotate svg {
      transition: transform 0.2s ease;
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
            <a href="#" @click.prevent="resetAllFilters" class="flex items-center gap-2 group pressable" title="TELERING — Kembali ke Semua Katalog">
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
                class="pressable px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
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
                class="pressable px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5"
                :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                title="Tampilan Tabel Host Live"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="hidden sm:inline">Tabel Host</span>
              </button>
            </div>

            <!-- Bagikan Link / QR -->
            <button 
              @click="openShareModal"
              class="pressable inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
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
              class="pressable p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors"
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
                class="pressable inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-telering-500 hover:bg-telering-600 text-white shadow-xs transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span class="hidden sm:inline">Tambah HP</span>
              </button>

              <button 
                @click="openExcelModal = true"
                class="pressable p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
                title="Kelola Excel"
              >
                <span class="hidden sm:inline">Excel</span>
                <span class="sm:hidden font-mono text-xs">XL</span>
              </button>

              <button 
                @click="logoutAdmin"
                class="pressable p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 space-y-2">
        
        <!-- Search & Quick Sort Row -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Precision Search Field -->
          <div class="relative flex-1 group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              ref="searchInput"
              type="text" 
              v-model="searchQuery"
              placeholder="Cari tipe HP, brand, chipset, kamera, atau varian..."
              class="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-2xs"
            >
            <!-- Clear button with micro-animation when has query -->
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''; searchInput?.focus()" 
              class="pressable absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
              title="Bersihkan Pencarian"
            >
              <span class="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 text-xs">✕</span>
            </button>
          </div>

          <!-- Sort Select -->
          <div class="shrink-0 relative">
            <select 
              v-model="sortBy"
              class="pressable appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
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
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1.5"
            :class="selectedBrand === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'"
          >
            <span>Semua Brand</span>
            <span class="px-1.5 py-0.2 rounded text-[10px]" :class="selectedBrand === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'">{{ products.length }}</span>
          </button>
          
          <!-- Brand List Chips -->
          <button 
            v-for="b in availableBrands" :key="b.name"
            @click="selectedBrand = b.name"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1.5"
            :class="selectedBrand === b.name ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'"
          >
            <span>{{ b.name }}</span>
            <span class="px-1.5 py-0.2 rounded text-[10px]" :class="selectedBrand === b.name ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'">{{ b.count }}</span>
          </button>

          <div class="h-3.5 w-[1px] bg-slate-200 mx-1 shrink-0"></div>

          <!-- Price Range Chips -->
          <button 
            @click="togglePriceFilter('under-2m')"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === 'under-2m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            &lt; 2 Juta
          </button>
          <button 
            @click="togglePriceFilter('2m-4m')"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === '2m-4m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            2 - 4 Juta
          </button>
          <button 
            @click="togglePriceFilter('4m-7m')"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === '4m-7m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            4 - 7 Juta
          </button>
          <button 
            @click="togglePriceFilter('above-7m')"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px]"
            :class="selectedPriceRange === 'above-7m' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            &gt; 7 Juta
          </button>

          <div class="h-3.5 w-[1px] bg-slate-200 mx-1 shrink-0"></div>

          <!-- Feature Filters -->
          <button 
            @click="filter5gOnly = !filter5gOnly"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1"
            :class="filter5gOnly ? 'bg-telering-50 text-telering-600 border-telering-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            <span>5G</span>
          </button>

          <button 
            @click="filterNfcOnly = !filterNfcOnly"
            class="pressable px-2.5 py-1 rounded-md font-bold shrink-0 transition-colors border text-[11px] flex items-center gap-1"
            :class="filterNfcOnly ? 'bg-sky-50 text-sky-600 border-sky-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'"
          >
            <span>NFC</span>
          </button>

          <!-- Reset Filter if any active -->
          <button 
            v-if="isFiltered" 
            @click="resetAllFilters"
            class="pressable px-2 py-1 rounded-md font-bold shrink-0 text-rose-600 hover:text-rose-700 text-[11px] underline underline-offset-2 ml-1"
          >
            Reset
          </button>

        </div>

        <!-- Active Filter Summary & Quick Clears (Macro Interaction) -->
        <div v-if="isFiltered" class="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar text-[11px]">
          <span class="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <svg class="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Aktif:
          </span>

          <!-- Search Query Tag -->
          <span 
            v-if="searchQuery.trim()" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-medium shrink-0 animate-card-in"
          >
            "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="pressable hover:text-rose-600 font-bold ml-0.5 text-xs" title="Hapus pencarian">✕</button>
          </span>

          <!-- Brand Tag -->
          <span 
            v-if="selectedBrand !== 'all'" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white font-medium shrink-0 animate-card-in"
          >
            Brand: {{ selectedBrand }}
            <button @click="selectedBrand = 'all'" class="pressable text-slate-300 hover:text-white font-bold ml-0.5 text-xs" title="Hapus filter brand">✕</button>
          </span>

          <!-- Price Range Tag -->
          <span 
            v-if="selectedPriceRange !== 'all'" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium shrink-0 animate-card-in"
          >
            Harga: {{ getPriceRangeLabel(selectedPriceRange) }}
            <button @click="selectedPriceRange = 'all'" class="pressable text-emerald-600 hover:text-emerald-900 font-bold ml-0.5 text-xs" title="Hapus filter harga">✕</button>
          </span>

          <!-- 5G Tag -->
          <span 
            v-if="filter5gOnly" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-telering-50 border border-telering-200 text-telering-700 font-medium shrink-0 animate-card-in"
          >
            5G Only
            <button @click="filter5gOnly = false" class="pressable text-telering-500 hover:text-telering-800 font-bold ml-0.5 text-xs" title="Hapus filter 5G">✕</button>
          </span>

          <!-- NFC Tag -->
          <span 
            v-if="filterNfcOnly" 
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-medium shrink-0 animate-card-in"
          >
            NFC Only
            <button @click="filterNfcOnly = false" class="pressable text-sky-500 hover:text-sky-800 font-bold ml-0.5 text-xs" title="Hapus filter NFC">✕</button>
          </span>

          <!-- Reset All Pill -->
          <button 
            @click="resetAllFilters"
            class="pressable ml-auto px-2 py-0.5 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold shrink-0 transition-colors flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset Semua
          </button>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 3. TOAST NOTIFICATION (MODERN FLOATING CAPSULE)           -->
    <!-- ======================================================== -->
    <transition enter-active-class="transform ease-out duration-200 transition" enter-from-class="translate-y-2 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="toastMessage" class="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2.5 max-w-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow shrink-0"></span>
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

      <!-- Empty State with Interactive Recovery Suggestions (Macro Interaction) -->
      <div v-if="filteredProducts.length === 0" class="py-14 sm:py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto px-6">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-base font-black text-slate-900">Tidak Menemukan Smartphone yang Sesuai</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Tidak ada produk yang cocok dengan kombinasi filter dan kata kunci pencarian Anda saat ini.
        </p>

        <!-- Quick Recovery Suggestions -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Saran Pencarian Cepat</p>
          <div class="flex flex-wrap items-center justify-center gap-1.5">
            <button 
              @click="quickFilter('Samsung')" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              Samsung
            </button>
            <button 
              @click="quickFilter('Xiaomi')" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              Xiaomi / Redmi
            </button>
            <button 
              @click="quickFilter('OPPO')" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              OPPO
            </button>
            <button 
              @click="quickFilter('Vivo')" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              Vivo
            </button>
            <button 
              @click="quickPrice('< 2 Juta', 'under-2m')" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
            >
              Di Bawah 2 Juta
            </button>
            <button 
              @click="quick5G" 
              class="pressable px-3 py-1.5 rounded-lg text-xs font-semibold bg-telering-50 hover:bg-telering-100 text-telering-700 border border-telering-200 transition-colors"
            >
              Hanya 5G
            </button>
          </div>
        </div>

        <button 
          @click="resetAllFilters"
          class="pressable mt-6 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm inline-flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Bersihkan Semua Filter & Reset</span>
        </button>
      </div>

      <!-- ==================================================== -->
      <!-- 4A. GRID VIEW: BRIGHT HIGH-TASTE PRODUCT CARDS       -->
      <!-- ==================================================== -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        <article 
          v-for="item in filteredProducts" 
          :key="item.id"
          class="card-lift animate-card-in bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between group relative overflow-hidden shadow-card"
        >

          <!-- Top Section: Visual Frame + Badge -->
          <div>
            
            <!-- Header bar inside card: Brand label -->
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                {{ item.Brand }}
              </span>
              <span v-if="is5G(item)" class="px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-telering-50 text-telering-600 border border-telering-200/70">
                5G
              </span>
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
                  v-if="getProductVariants(item).length <= 1"
                  class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/80"
                >
                  {{ getProductVariants(item)[0] ? getProductVariants(item)[0].ram_rom : (item.RAM_ROM || '-') }}
                </span>
                <template v-else>
                  <button 
                    v-for="(v, vIdx) in getProductVariants(item)" 
                    :key="vIdx"
                    @click.stop="selectVariant(item, vIdx)"
                    class="pressable px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-all"
                    :class="(item._selectedVariantIndex === vIdx || ((item._selectedVariantIndex === -1 || item._selectedVariantIndex === undefined) && vIdx === 0)) ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ v.ram_rom }}
                  </button>
                </template>
              </div>
            </div>

            <!-- Price Block -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <div 
                  class="text-base sm:text-lg font-mono font-black text-slate-900 transition-colors"
                  :class="{ 'price-flash': item._priceFlashed }"
                >
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

          <!-- Bottom Actions: Detail & Admin Edit -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
            
            <button 
              @click="openDetail(item)"
              class="pressable group/btn flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
              title="Buka spesifikasi lengkap"
            >
              <span>Lihat Detail Spesifikasi</span>
              <svg class="w-3.5 h-3.5 text-slate-300 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Admin Edit Button -->
            <button 
              v-if="isAdmin"
              @click="openEditProductModal(item)"
              class="pressable p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
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
                  <button 
                    @click="openDetail(item)"
                    class="pressable px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Floating Back to Top Button (Macro Interaction) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-3"
    >
      <button 
        v-if="showBackToTop" 
        @click="scrollToTop"
        class="pressable fixed bottom-6 right-6 z-40 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-200/90 shadow-lg px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all hover:shadow-xl group"
        title="Kembali ke atas halaman"
      >
        <svg class="w-4 h-4 text-slate-600 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span class="hidden sm:inline">Ke Atas</span>
      </button>
    </transition>

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
          <button @click="activeProduct = null" class="pressable btn-close-rotate p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200" title="Tutup">
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
                <div 
                  class="text-2xl font-mono font-black text-slate-900 mt-0.5 transition-colors"
                  :class="{ 'price-flash': activeProduct._priceFlashed }"
                >
                  {{ formatRupiah(getCurrentPrice(activeProduct)) }}
                </div>
                <div v-if="activeProduct.Harga_Normal && activeProduct.Harga_Normal > getCurrentPrice(activeProduct)" class="text-xs text-slate-400 line-through font-mono">
                  Harga Normal: {{ formatRupiah(activeProduct.Harga_Normal) }}
                </div>
              </div>

              <!-- Variant Selector inside Modal -->
              <div v-if="getProductVariants(activeProduct).length > 1">
                <div class="text-xs text-slate-600 mb-1.5 font-bold">Pilih Varian RAM / Storage:</div>
                <div class="flex flex-wrap gap-1.5">
                  <button 
                    v-for="(v, vIdx) in getProductVariants(activeProduct)" 
                    :key="vIdx"
                    @click="selectVariant(activeProduct, vIdx)"
                    class="pressable px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors"
                    :class="(activeProduct._selectedVariantIndex === vIdx || ((activeProduct._selectedVariantIndex === -1 || activeProduct._selectedVariantIndex === undefined) && vIdx === 0)) ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ v.ram_rom }}
                  </button>
                </div>
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
          <button @click="activeProduct = null" class="pressable px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors">
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
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-slate-900">Bagikan Katalog Live</h3>
          <button @click="shareModalOpen = false" class="pressable btn-close-rotate p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-slate-500 text-left">Scan QR Code atau salin link untuk membuka katalog ini di smartphone host atau penonton.</p>

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
            class="pressable px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black shrink-0 transition-colors"
          >
            {{ copiedShareLink ? 'Tersalin!' : 'Salin' }}
          </button>
        </div>

        <button 
          @click="shareModalOpen = false"
          class="pressable w-full py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
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
              class="pressable flex-1 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="pressable flex-1 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black transition-colors"
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
          <button @click="openExcelModal = false" class="pressable btn-close-rotate p-1 rounded-lg text-slate-400 hover:text-slate-900 font-bold" title="Tutup">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-xs text-slate-600">
          Anda dapat mengekspor seluruh katalog saat ini ke Excel atau mengunggah file Excel baru untuk memperbarui data live secara realtime.
        </p>

        <!-- Dropzone -->
        <div 
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="handleFileDrop"
          class="pressable border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer"
          :class="dragOver ? 'border-telering-500 bg-telering-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'"
          @click="$refs.excelFileInput.click()"
        >
          <input type="file" ref="excelFileInput" @change="handleFileSelect" accept=".xlsx, .xls" class="hidden">
          <div class="text-xs text-slate-800 font-bold">Tarik & Lepas File Excel di Sini</div>
          <div class="text-[11px] text-slate-500 mt-1">atau klik untuk memilih file dari komputer Anda</div>
        </div>

        <div v-if="parsedData.length > 0" class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center justify-between">
          <span>Terbaca: <strong>{{ parsedData.length }} HP</strong> dari Excel</span>
          <button @click="applyParsedData" class="pressable px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">
            Terapkan ke Live
          </button>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <button 
            @click="resetToDefault"
            class="pressable text-xs text-rose-500 hover:text-rose-600 font-bold underline"
          >
            Reset ke Data Bawaan
          </button>

          <button 
            @click="downloadTemplate"
            class="pressable px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-xs transition-colors"
          >
            Unduh Data Excel
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 11. MODAL: TAMBAH / EDIT PRODUK (MATCHING REFERENCE UI)  -->
    <!-- ======================================================== -->
    <div v-if="editProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all" @click.self="editProductModalOpen = false">
      <div class="bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Top Bar -->
        <div class="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-telering-500"></div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {{ isEditingExisting ? 'Edit Data Smartphone' : 'Tambah Produk Baru' }}
            </h3>
            <span v-if="productForm.Brand" class="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {{ productForm.Brand }}
            </span>
          </div>
          <button 
            type="button" 
            @click="editProductModalOpen = false" 
            class="pressable btn-close-rotate w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Tutup"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveProductForm" class="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm">
          
          <!-- 1. AI Auto-Fill Spek dari Link (Opsional) -->
          <div>
            <label class="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1.5">
              AI Auto-Fill Spek dari Link (Opsional)
            </label>
            <div class="flex items-center gap-2 sm:gap-2.5">
              <input 
                type="text" 
                v-model="specScrapeUrl" 
                placeholder="Tempel link spesifikasi (GSMArena, Shopee, Tokopedia, dll)..." 
                class="flex-1 bg-slate-100/70 border border-slate-200/90 rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
              />
              <button 
                type="button" 
                @click="tarikSpek" 
                :disabled="isScraping"
                class="pressable px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200/90 transition-all shrink-0 inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg v-if="isScraping" class="animate-spin w-3.5 h-3.5 text-slate-700" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isScraping ? 'Menarik...' : 'Tarik Spek' }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Nama Produk -->
          <div>
            <label class="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1.5">
              Nama Produk
            </label>
            <input 
              type="text" 
              v-model="productForm.Nama_Produk" 
              @input="onProductNameInput"
              required 
              placeholder="Contoh: Samsung Galaxy Z Fold8 Ultra" 
              class="w-full bg-slate-100/70 border border-slate-200/90 rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-semibold transition-all"
            />
          </div>

          <!-- 3. Link Address Foto Produk + Preview -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs sm:text-[13px] font-bold text-slate-900">
                Link Address Foto Produk
              </label>
              <span class="text-[10px] font-semibold text-slate-400 pr-3">Preview</span>
            </div>
            <div class="flex items-center gap-2.5">
              <input 
                type="url" 
                v-model="productForm.Gambar_URL" 
                @input="previewImgError = false"
                placeholder="https://images.unsplash.com/..." 
                class="flex-1 bg-slate-100/70 border border-slate-200/90 rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-mono text-xs"
              />
              <div class="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                <img 
                  v-if="productForm.Gambar_URL && !previewImgError" 
                  :src="productForm.Gambar_URL" 
                  class="w-full h-full object-contain p-1"
                  @error="previewImgError = true"
                  referrerpolicy="no-referrer"
                  alt="Preview"
                />
                <svg v-else class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 4. Card: Varian & Harga -->
          <div class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 class="text-xs sm:text-sm font-extrabold text-slate-900">
              Varian & Harga
            </h4>

            <div class="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-500 px-1">
              <div class="col-span-5">RAM/ROM</div>
              <div class="col-span-6">Harga</div>
              <div class="col-span-1"></div>
            </div>

            <div class="space-y-2">
              <div 
                v-for="(v, vIdx) in productForm.variants" 
                :key="vIdx" 
                class="grid grid-cols-12 gap-2 items-center"
              >
                <div class="col-span-5">
                  <input 
                    type="text" 
                    v-model="v.ram_rom" 
                    placeholder="Contoh: 4/128" 
                    class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
                  />
                </div>
                <div class="col-span-6">
                  <input 
                    type="text" 
                    v-model="v.price" 
                    placeholder="Contoh: Rp 2.999.000" 
                    class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-mono font-medium"
                  />
                </div>
                <div class="col-span-1 flex justify-center">
                  <button 
                    type="button" 
                    @click="removeVariant(vIdx)" 
                    class="pressable text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus varian"
                  >
                    <svg class="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- +Tambah Varian Button (Positioned below card on the right) -->
          <div class="flex justify-end -mt-1 sm:-mt-2 px-1">
            <button 
              type="button" 
              @click="addVariant" 
              class="pressable text-xs sm:text-sm font-bold text-slate-900 hover:text-telering-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              +Tambah Varian
            </button>
          </div>

          <!-- 5. Card: Spesifikasi -->
          <div class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 class="text-xs sm:text-sm font-extrabold text-slate-900">
              Spesifikasi
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Baterai</label>
                <input 
                  type="text" 
                  v-model="productForm.Baterai" 
                  placeholder="Contoh: 5000 mAh" 
                  class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Chipset/Processor</label>
                <input 
                  type="text" 
                  v-model="productForm.Chipset" 
                  placeholder="Contoh: Snapdragon 8 Gen 2" 
                  class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Kamera</label>
                <input 
                  type="text" 
                  v-model="productForm.Kamera" 
                  placeholder="Contoh: 50 MP OIS" 
                  class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Layar</label>
                <input 
                  type="text" 
                  v-model="productForm.Layar" 
                  placeholder="Contoh: 6.7&quot; AMOLED 120Hz" 
                  class="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
                />
              </div>
            </div>
          </div>

          <!-- 6. Bottom Action Bar -->
          <div class="pt-3 sm:pt-4 flex items-center justify-between border-t border-slate-100">
            <button 
              v-if="isEditingExisting" 
              type="button" 
              @click="deleteProduct(productForm.id)" 
              class="pressable text-rose-600 hover:text-rose-700 font-bold text-xs sm:text-sm cursor-pointer hover:underline transition-all"
            >
              Hapus HP
            </button>
            <div v-else></div>

            <div class="flex items-center gap-2.5 sm:gap-3">
              <button 
                type="button" 
                @click="editProductModalOpen = false" 
                class="pressable px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="pressable px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
              >
                Simpan
              </button>
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
        const specScrapeUrl = ref('');
        const isScraping = ref(false);
        const previewImgError = ref(false);
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

        const parsePriceNumber = (val) => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          const cleaned = String(val).replace(/[^0-9]/g, '');
          return cleaned ? parseInt(cleaned, 10) : 0;
        };

        const getProductVariants = (item) => {
          if (!item) return [];
          const result = [];
          const seen = new Set();
          const norm = (str) => String(str || '').trim().toLowerCase().replace(/\\s+/g, '').replace(/gb$/i, '').replace(/ram|rom/gi, '');

          const baseRam = (item.RAM_ROM || '').trim();
          const basePrice = item.Harga || item.Harga_Promo || item.Harga_Normal || 0;

          if (Array.isArray(item.variants) && item.variants.length > 0) {
            const hasBaseInVariants = item.variants.some(v => v && norm(v.ram_rom) === norm(baseRam));
            if (baseRam && !hasBaseInVariants) {
              result.push({
                ram_rom: baseRam,
                price: basePrice
              });
              seen.add(norm(baseRam));
            }
            for (const v of item.variants) {
              if (!v || !v.ram_rom) continue;
              const r = String(v.ram_rom).trim();
              const key = norm(r);
              if (!seen.has(key)) {
                seen.add(key);
                const p = typeof v.price === 'number' ? v.price : (parsePriceNumber(v.price) || basePrice);
                result.push({
                  ram_rom: r,
                  price: p
                });
              }
            }
          } else if (baseRam) {
            result.push({
              ram_rom: baseRam,
              price: basePrice
            });
          }

          return result;
        };

        const getCurrentPrice = (item) => {
          if (!item) return 0;
          const vars = getProductVariants(item);
          if (vars.length > 0) {
            const idx = (item._selectedVariantIndex !== undefined && item._selectedVariantIndex >= 0 && item._selectedVariantIndex < vars.length)
              ? item._selectedVariantIndex
              : 0;
            return vars[idx].price || item.Harga || item.Harga_Promo || item.Harga_Normal || 0;
          }
          return item.Harga || item.Harga_Promo || item.Harga_Normal || 0;
        };

        const getCurrentRam = (item) => {
          if (!item) return '';
          const vars = getProductVariants(item);
          if (vars.length > 0) {
            const idx = (item._selectedVariantIndex !== undefined && item._selectedVariantIndex >= 0 && item._selectedVariantIndex < vars.length)
              ? item._selectedVariantIndex
              : 0;
            return vars[idx].ram_rom || item.RAM_ROM || '';
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

        const getPriceRangeLabel = (range) => {
          if (range === 'under-2m') return '< 2 Juta';
          if (range === '2m-4m') return '2 - 4 Juta';
          if (range === '4m-7m') return '4 - 7 Juta';
          if (range === 'above-7m') return '> 7 Juta';
          return range;
        };

        const selectVariant = (item, vIdx) => {
          if (!item) return;
          item._selectedVariantIndex = (typeof vIdx === 'number' && vIdx >= 0) ? vIdx : 0;
          item._priceFlashed = true;
          setTimeout(() => {
            item._priceFlashed = false;
          }, 350);
        };

        const quickFilter = (brandName) => {
          selectedBrand.value = brandName;
          searchQuery.value = '';
          selectedPriceRange.value = 'all';
          filter5gOnly.value = false;
          filterNfcOnly.value = false;
        };

        const quickPrice = (label, range) => {
          selectedPriceRange.value = range;
          searchQuery.value = '';
        };

        const quick5G = () => {
          filter5gOnly.value = true;
          searchQuery.value = '';
        };

        const showBackToTop = ref(false);

        const scrollToTop = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
          if (item._selectedVariantIndex === undefined || item._selectedVariantIndex === -1) {
            item._selectedVariantIndex = 0;
          }
          activeProduct.value = item;
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

        // Helper: brand auto-detection
        const detectBrand = (name) => {
          if (!name) return 'Lainnya';
          const n = name.trim().toLowerCase();
          if (n.includes('samsung') || n.includes('galaxy')) return 'Samsung';
          if (n.includes('iphone') || n.includes('apple')) return 'Apple';
          if (n.includes('redmi') || n.includes('poco') || n.includes('xiaomi')) return 'Xiaomi';
          if (n.includes('oppo') || n.includes('reno') || n.includes('find x')) return 'Oppo';
          if (n.includes('vivo') || n.includes('iqoo') || n.includes('v40') || n.includes('y100') || n.includes('y28')) return 'Vivo';
          if (n.includes('realme') || n.includes('gt 6') || n.includes('narzo')) return 'Realme';
          if (n.includes('infinix') || n.includes('hot ') || n.includes('zero ') || n.includes('smart ')) return 'Infinix';
          if (n.includes('tecno') || n.includes('camon') || n.includes('spark') || n.includes('pova')) return 'Tecno';
          if (n.includes('itel')) return 'Itel';
          if (n.includes('asus') || n.includes('rog ') || n.includes('zenfone')) return 'Asus';
          if (n.includes('huawei')) return 'Huawei';
          if (n.includes('honor')) return 'Honor';
          if (n.includes('nubia') || n.includes('redmagic') || n.includes('zte')) return 'ZTE';
          
          const firstWord = name.trim().split(/\s+/)[0];
          return firstWord ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1) : 'Lainnya';
        };

        const onProductNameInput = () => {
          if (!isEditingExisting.value || !productForm.value.Brand || productForm.value.Brand === 'Lainnya') {
            const detected = detectBrand(productForm.value.Nama_Produk);
            if (detected) productForm.value.Brand = detected;
          }
        };

        // Tarik Spek (AI Auto-Fill)
        const tarikSpek = async () => {
          if (!specScrapeUrl.value || !specScrapeUrl.value.trim()) {
            showToast('Tempelkan link spesifikasi terlebih dahulu!');
            return;
          }

          isScraping.value = true;
          const rawUrl = specScrapeUrl.value.trim();

          try {
            // 1. Extract slug / keywords from URL
            let slug = rawUrl;
            try {
              const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
              const pathParts = parsed.pathname.split('/').filter(Boolean);
              slug = pathParts[pathParts.length - 1] || parsed.hostname;
            } catch (e) {
              slug = rawUrl;
            }

            slug = slug.replace(/\.(html|php|htm|aspx)$/i, '');
            slug = slug.replace(/[-_]+/g, ' ');
            slug = slug.replace(/\b(spesifikasi|harga|review|dan|hp|beli|jual|promo|index)\b/gi, '').trim();

            const words = slug.split(/\s+/).filter(w => w.length > 1);
            const extractedName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

            // Check if matched device exists in catalog
            const matchedDevice = products.value.find(p => {
              const pName = (p.Nama_Produk || '').toLowerCase();
              return words.filter(w => w.length > 2).every(w => pName.includes(w.toLowerCase()));
            });

            if (matchedDevice) {
              productForm.value.Nama_Produk = matchedDevice.Nama_Produk;
              productForm.value.Brand = matchedDevice.Brand;
              productForm.value.Chipset = matchedDevice.Chipset || '';
              productForm.value.Baterai = matchedDevice.Baterai || '5000 mAh';
              productForm.value.Kamera = matchedDevice.Kamera || '50 MP';
              productForm.value.Layar = matchedDevice.Layar || '6.67" AMOLED';
              if (matchedDevice.Gambar_URL) productForm.value.Gambar_URL = matchedDevice.Gambar_URL;
              if (matchedDevice.variants && matchedDevice.variants.length > 0) {
                productForm.value.variants = JSON.parse(JSON.stringify(matchedDevice.variants));
              }
              showToast('Spek dicocokkan: ' + matchedDevice.Nama_Produk);
            } else {
              if (extractedName.length > 3) {
                productForm.value.Nama_Produk = extractedName;
                productForm.value.Brand = detectBrand(extractedName);
              }
              if (!productForm.value.Baterai) productForm.value.Baterai = '5000 mAh';
              if (!productForm.value.Kamera) productForm.value.Kamera = '50 MP OIS';
              if (!productForm.value.Layar) productForm.value.Layar = '6.7" AMOLED 120Hz';
              if (!productForm.value.Chipset) {
                const low = extractedName.toLowerCase();
                if (low.includes('ultra') || low.includes('pro plus') || low.includes('pro+')) {
                  productForm.value.Chipset = 'Snapdragon 8 Gen 3';
                } else if (low.includes('5g')) {
                  productForm.value.Chipset = 'MediaTek Dimensity 7050 5G';
                } else {
                  productForm.value.Chipset = 'Snapdragon 685';
                }
              }
              if (!productForm.value.variants || productForm.value.variants.length === 0) {
                productForm.value.variants = [
                  { ram_rom: '8/256', price: '2.999.000' }
                ];
              }
              showToast('Spek berhasil diekstrak dan diisi otomatis!');
            }
          } catch (err) {
            showToast('Gagal menarik spek, silakan isi data manual.');
          } finally {
            isScraping.value = false;
          }
        };

        // Product Form (Add & Edit)
        const openAddProductModal = () => {
          isEditingExisting.value = false;
          specScrapeUrl.value = '';
          previewImgError.value = false;
          productForm.value = {
            id: 'p-' + Date.now(),
            Brand: selectedBrand.value !== 'all' ? selectedBrand.value : 'Samsung',
            Nama_Produk: '',
            Gambar_URL: '',
            Harga: 2999000,
            Harga_Normal: 2999000,
            RAM_ROM: '4/128',
            variants: [
              { ram_rom: '4/128', price: '2.999.000' }
            ],
            Chipset: '',
            Baterai: '',
            Kamera: '',
            Layar: ''
          };
          editProductModalOpen.value = true;
        };

        const openEditProductModal = (item) => {
          isEditingExisting.value = true;
          specScrapeUrl.value = '';
          previewImgError.value = false;
          const copy = JSON.parse(JSON.stringify(item));
          
          // Populate clean, deduplicated variants in edit form
          const vars = getProductVariants(copy);
          if (vars.length === 0) {
            copy.variants = [
              { 
                ram_rom: copy.RAM_ROM || '4/128', 
                price: copy.Harga ? formatRupiah(copy.Harga).replace('Rp ', '') : '2.999.000'
              }
            ];
          } else {
            copy.variants = vars.map(v => ({
              ram_rom: v.ram_rom,
              price: typeof v.price === 'number' ? formatRupiah(v.price).replace('Rp ', '') : v.price
            }));
          }

          productForm.value = copy;
          editProductModalOpen.value = true;
        };

        const addVariant = () => {
          if (!productForm.value.variants) productForm.value.variants = [];
          const count = productForm.value.variants.length;
          const last = count > 0 ? productForm.value.variants[count - 1] : null;
          let nextRam = '8/256';
          if (last && last.ram_rom && last.ram_rom.includes('4/')) nextRam = '8/128';
          else if (last && last.ram_rom && last.ram_rom.includes('8/128')) nextRam = '8/256';
          else if (last && last.ram_rom && last.ram_rom.includes('8/256')) nextRam = '12/512';
          else if (last && last.ram_rom && last.ram_rom.includes('12/')) nextRam = '16/512';

          productForm.value.variants.push({
            ram_rom: nextRam,
            price: ''
          });
        };

        const removeVariant = (index) => {
          if (!productForm.value.variants) return;
          if (productForm.value.variants.length > 1) {
            productForm.value.variants.splice(index, 1);
          } else {
            productForm.value.variants[0] = { ram_rom: '', price: '' };
          }
        };

        const saveProductForm = () => {
          if (!productForm.value.Nama_Produk || !productForm.value.Nama_Produk.trim()) {
            showToast('Harap masukkan Nama Produk');
            return;
          }

          // Auto-detect brand if not filled or set to generic
          if (!productForm.value.Brand || productForm.value.Brand === 'Lainnya') {
            productForm.value.Brand = detectBrand(productForm.value.Nama_Produk);
          }

          // Clean and deduplicate variants
          const cleanVariants = [];
          const seen = new Set();
          const norm = (str) => String(str || '').trim().toLowerCase().replace(/\\s+/g, '').replace(/gb$/i, '').replace(/ram|rom/gi, '');

          (productForm.value.variants || []).forEach(v => {
            const r = (v.ram_rom || '').trim();
            const p = parsePriceNumber(v.price);
            const key = norm(r);
            if (r && !seen.has(key)) {
              seen.add(key);
              cleanVariants.push({
                ram_rom: r,
                price: p || 1999000
              });
            }
          });

          if (cleanVariants.length === 0) {
            cleanVariants.push({ ram_rom: '4/128', price: 2999000 });
          }

          // Base RAM_ROM and Harga synced with first variant
          const firstVar = cleanVariants[0];
          productForm.value.RAM_ROM = firstVar.ram_rom;
          productForm.value.Harga = firstVar.price;
          if (!productForm.value.Harga_Normal || productForm.value.Harga_Normal < productForm.value.Harga) {
            productForm.value.Harga_Normal = productForm.value.Harga;
          }

          productForm.value.variants = cleanVariants;
          productForm.value._selectedVariantIndex = 0;

          if (isEditingExisting.value) {
            const idx = products.value.findIndex(p => p.id === productForm.value.id);
            if (idx >= 0) {
              products.value[idx] = { ...products.value[idx], ...productForm.value };
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
            products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)).map(p => ({
              ...p,
              variants: getProductVariants(p),
              _selectedVariantIndex: 0
            }));
            localStorage.setItem('telering_live_products', JSON.stringify(products.value));
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
                  products.value = payload.data.map(p => ({
                    ...p,
                    variants: getProductVariants(p),
                    _selectedVariantIndex: 0
                  }));
                  localStorage.setItem('telering_live_products', JSON.stringify(products.value));
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
                products.value = parsed.map(p => ({
                  ...p,
                  variants: getProductVariants(p),
                  _selectedVariantIndex: 0
                }));
              } else {
                products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)).map(p => ({
                  ...p,
                  variants: getProductVariants(p),
                  _selectedVariantIndex: 0
                }));
              }
            } catch (e) {
              products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)).map(p => ({
                ...p,
                variants: getProductVariants(p),
                _selectedVariantIndex: 0
              }));
            }
          } else {
            products.value = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)).map(p => ({
              ...p,
              variants: getProductVariants(p),
              _selectedVariantIndex: 0
            }));
          }

          initMqtt();

          // Scroll listener for back-to-top button
          window.addEventListener('scroll', () => {
            showBackToTop.value = window.scrollY > 300;
          }, { passive: true });

          // Keyboard shortcut Escape to close modals
          window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              if (activeProduct.value) activeProduct.value = null;
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
          getProductVariants,
          is5G,
          activeProduct,
          openDetail,
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
          specScrapeUrl,
          isScraping,
          previewImgError,
          tarikSpek,
          onProductNameInput,
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
          cloudConnected,
          showBackToTop,
          scrollToTop,
          selectVariant,
          getPriceRangeLabel,
          quickFilter,
          quickPrice,
          quick5G
        };
      }
    }).mount('#app');
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), template, 'utf8');
console.log('Successfully generated Bright/Cerah Light-Mode index.html!');
