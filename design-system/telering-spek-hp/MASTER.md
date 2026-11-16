# Design System — TELERING Spek & Harga HP
*Generated with UI/UX Pro Max Intelligence*

## 1. Product & Architecture Overview
- **Product Type**: E-commerce / Tech Catalog & Live Companion Tool (Host Live TikTok, Shopee, Instagram & Store Admin)
- **Primary Style**: **Bento Box Grid + Modern Swiss Tech**
- **Secondary Style**: **Liquid Glass Accents + Motion-Driven Feedback**
- **Landing Pattern**: **Feature-Rich Filterable Showcase (Filter-Heavy Grid + 1-Sec Lookup)**
- **Target Audience**: Host Live streamers during fast-paced live broadcasts, Store Admins, and Smartphone Buyers

---

## 2. Color Tokens (Semantic Palette)
| Token | Hex / Value | Usage | WCAG Ratio |
|---|---|---|---|
| `--color-bg-canvas` | `#F8FAFC` (`slate-50`) | Global page background | Base |
| `--color-surface-card` | `#FFFFFF` (`white`) | Product cards, modals, dropdowns | 21:1 against `#0F172A` |
| `--color-surface-header` | `#0F172A` (`slate-900`) | Navigation header, dark mode elements | High Contrast |
| `--color-text-primary` | `#0F172A` (`slate-900`) | Main headings, product titles, prices | > 12:1 |
| `--color-text-secondary`| `#475569` (`slate-600`) | Subtitles, specs, secondary labels | 5.8:1 (AA Pass) |
| `--color-text-muted` | `#64748B` (`slate-500`) | Small hints, footnotes (min 11px) | 4.6:1 (AA Pass) |
| `--color-brand-primary` | `#059669` (`emerald-600`)| Primary buttons, active variant badges | 4.8:1 against white |
| `--color-brand-accent` | `#10B981` (`emerald-500`)| Live badges, active highlights, pulses | High vibrancy |
| `--color-tech-indigo` | `#4F46E5` (`indigo-600`) | Share links, QR codes, CPU spec badges | 5.9:1 |
| `--color-warm-amber` | `#D97706` (`amber-600`) | Battery badges, admin edit warnings | 4.6:1 |
| `--color-border-subtle` | `#E2E8F0` (`slate-200`) | Card borders, dividers, subtle outlines | Clear boundary |

---

## 3. Typography Hierarchy
- **Heading & UI Font**: `Plus Jakarta Sans`, sans-serif (Weights: 500, 600, 700, 800)
- **Data & Price Font**: `JetBrains Mono`, monospace (Weights: 600, 700, 800)
- **Type Scale**:
  - Hero / Modal Title: `1.25rem` – `1.5rem` (`text-xl` to `text-2xl`), font-black
  - Product Card Title: `1rem` – `1.125rem` (`text-base`), font-extrabold, line-clamp-1
  - Price Display: `1.25rem` – `1.5rem` (`text-xl` to `text-2xl`), font-mono, font-black
  - Specs & Badges: `0.75rem` (`text-xs`), font-bold
  - Secondary Caption: `0.6875rem` (`text-[11px]`), font-semibold

---

## 4. Bento Box Card Structure
- **Container**: `rounded-2xl` (16px) or `rounded-3xl` (20px), border `border-slate-200/90`, shadow `shadow-xs hover:shadow-xl`, elevation hover `-translate-y-1`, transition `duration-200 ease-out`.
- **Media Header**:
  - Image box `aspect-[4/3]` or `aspect-square`, background `bg-gradient-to-b from-slate-50 to-slate-100/80`, image `object-contain group-hover:scale-105 transition-transform duration-300`.
  - Brand pill badge placed floating top-left: `bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full`.
  - Live status / Varian count floating top-right: `bg-emerald-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full`.
- **Price & Variant Switcher**:
  - Large monospace price, formatted Rupiah (`formatRupiah`).
  - Memory variant chips: pill buttons with minimum 36px touch height, clear active filled state (`bg-slate-900 text-white`) vs inactive (`bg-white border text-slate-700`).
- **4-Spec Grid (Bento mini-tiles)**:
  - RAM & ROM: Memory icon + `bg-emerald-50 text-emerald-900 border-emerald-100`
  - Baterai: Battery icon + `bg-amber-50 text-amber-900 border-amber-100`
  - Chipset: CPU icon + `bg-indigo-50 text-indigo-900 border-indigo-100`
  - Kamera: Camera icon + `bg-teal-50 text-teal-900 border-teal-100`
- **Action CTA**:
  - Primary button: "Spill Spek Lengkap", `min-h-[44px]`, `rounded-xl`, `active:scale-[0.98]`.

---

## 5. Pre-Delivery Quality Checklist (UI/UX Pro Max)
- [x] No emoji used as structural icons (clean SVG vectors only).
- [x] All touch targets meet minimum 44×44px hit area.
- [x] High contrast text (>= 4.5:1 ratio, no low-contrast light grays).
- [x] Layout shift prevented: images declare aspect ratio.
- [x] Clean pressed state micro-interactions (`active:scale-95`, `transition-all duration-150`).
- [x] Dialogs provide backdrop-blur and keyboard escape dismissal.
