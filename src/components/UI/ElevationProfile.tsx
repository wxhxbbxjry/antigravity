'use client';

import React from 'react';
import { ElevationPoint } from '@/lib/types';
import { Mountain, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ElevationProfileProps {
  profile: ElevationPoint[];
  gainM: number;
  lossM: number;
  distanceKm: number;
}

export default function ElevationProfile({
  profile,
  gainM,
  lossM,
  distanceKm,
}: ElevationProfileProps) {
  if (!profile || profile.length < 2) {
    return (
      <div className="p-3 text-center text-xs text-slate-400 glass-panel rounded-xl">
        Tambahkan waypoint untuk melihat profil elevasi rute.
      </div>
    );
  }

  // Find min and max elevation for SVG scaling
  const elevations = profile.map((p) => p.elevationM);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleSpan = Math.max(10, maxEle - minEle);

  // SVG dimensions
  const width = 360;
  const height = 90;
  const paddingX = 10;
  const paddingY = 10;

  // Build SVG path
  const points = profile.map((pt) => {
    const x = paddingX + (pt.distanceKm / (distanceKm || 1)) * (width - 2 * paddingX);
    const y =
      height - paddingY - ((pt.elevationM - minEle) / eleSpan) * (height - 2 * paddingY);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - paddingX},${height} L ${paddingX},${height} Z`;

  return (
    <div className="glass-panel p-3.5 rounded-2xl border border-slate-700/60 shadow-xl space-y-2.5">
      {/* Header with stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span>Profil Elevasi</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-0.5 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> +{gainM}m
          </span>
          <span className="flex items-center gap-0.5 text-rose-400 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" /> -{lossM}m
          </span>
          <span className="text-slate-400">
            {minEle}m &ndash; {maxEle}m
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-hidden rounded-xl bg-slate-950/60 p-1 border border-slate-800/80">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-20 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#elevationGrad)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Distance tick marks */}
          <line
            x1={paddingX}
            y1={height - 2}
            x2={width - paddingX}
            y2={height - 2}
            stroke="#334155"
            strokeWidth="1"
          />
        </svg>

        <div className="flex justify-between text-[10px] text-slate-500 px-2 mt-1">
          <span>0 km (Start)</span>
          <span>{(distanceKm / 2).toFixed(1)} km</span>
          <span>{distanceKm.toFixed(1)} km (Finish)</span>
        </div>
      </div>
    </div>
  );
}
