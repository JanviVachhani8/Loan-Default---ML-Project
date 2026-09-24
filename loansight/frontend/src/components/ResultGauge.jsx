import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ResultGauge({ probability = 0.12, riskLevel = 'Low' }) {
  const percentage = Math.min(Math.max(probability * 100, 0), 100);
  const [displayValue, setDisplayValue] = useState(0);

  // Count up animation
  useEffect(() => {
    let start = 0;
    const end = percentage;
    const duration = 1200; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [percentage]);

  // Color by risk level
  let strokeColor = '#16A34A'; // Green (Low)
  let badgeStyle = 'bg-emerald-100 text-emerald-900 border-2 border-ink shadow-hard-sm';
  if (riskLevel === 'High') {
    strokeColor = '#E5484D'; // Red (High)
    badgeStyle = 'bg-rose-100 text-rose-900 border-2 border-ink shadow-hard-sm';
  } else if (riskLevel === 'Medium') {
    strokeColor = '#F59E0B'; // Amber (Medium)
    badgeStyle = 'bg-amber-100 text-amber-900 border-2 border-ink shadow-hard-sm';
  }

  // Semicircle gauge parameters
  // Center: (120, 110), Radius: 85
  // Total arc length = PI * R ≈ 267.03
  const arcLength = 267.03;
  const strokeDashoffset = arcLength - (arcLength * (displayValue / 100));

  // Calculate needle angle (-90 deg at 0%, +90 deg at 100%)
  const needleAngle = -90 + (displayValue / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center relative py-4">
      <div className="relative w-72 h-44 flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 240 145">
          {/* Outer Border Arc */}
          <path
            d="M 30 115 A 85 85 0 0 1 210 115"
            fill="none"
            stroke="#101828"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Background Track Arc */}
          <path
            d="M 30 115 A 85 85 0 0 1 210 115"
            fill="none"
            stroke="#EFECE3"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.path
            d="M 30 115 A 85 85 0 0 1 210 115"
            fill="none"
            stroke={strokeColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />

          {/* Radial Tick Marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angleDeg = -180 + (tick / 100) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const rInner = 68;
            const rOuter = 74;
            const x1 = 120 + rInner * Math.cos(angleRad);
            const y1 = 115 + rInner * Math.sin(angleRad);
            const x2 = 120 + rOuter * Math.cos(angleRad);
            const y2 = 115 + rOuter * Math.sin(angleRad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#101828"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Needle Indicator */}
          <g transform={`translate(120, 115) rotate(${needleAngle})`}>
            <polygon points="-4,0 0,-70 4,0" fill="#101828" />
            <circle cx="0" cy="0" r="7" fill="#F4E04D" stroke="#101828" strokeWidth="2.5" />
          </g>

          {/* Outer scale labels */}
          <text x="22" y="135" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" fill="#5B6472">0%</text>
          <text x="110" y="20" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" fill="#5B6472">50%</text>
          <text x="202" y="135" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" fill="#5B6472">100%</text>
        </svg>

        {/* Inner Counter Text Overlay */}
        <div className="absolute bottom-0 flex flex-col items-center text-center">
          <span className="text-4xl font-extrabold font-display tracking-tight text-ink">
            {displayValue.toFixed(1)}%
          </span>
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest -mt-0.5">
            Default Probability
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mt-4">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase ${badgeStyle}`}>
          <span className="w-2.5 h-2.5 rounded-full border border-ink mr-2" style={{ backgroundColor: strokeColor }}></span>
          {riskLevel} Risk Profile
        </span>
      </div>
    </div>
  );
}

