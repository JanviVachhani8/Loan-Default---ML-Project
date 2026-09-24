import React from 'react';
import { TrendingUp, CheckCircle2, Ticket } from 'lucide-react';

export default function LoanSnapshot({ formData }) {
  const amount = Number(formData.LoanAmount) || 25000;
  const rate = Number(formData.InterestRate) || 10.5;
  const term = Number(formData.LoanTerm) || 36;
  const income = Number(formData.Income) || 75000;
  const dti = Number(formData.DTIRatio) || 0.35;
  const creditScore = Number(formData.CreditScore) || 680;

  // Monthly payment calculation
  const r = rate / 100 / 12;
  const n = term;
  let monthlyPayment = 0;
  if (r > 0 && n > 0) {
    monthlyPayment = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    monthlyPayment = amount / n;
  }

  // Loan to income ratio
  const lti = income > 0 ? amount / income : 0;

  // DTI Status
  let dtiStatus = { label: 'Healthy', color: 'text-risk-low bg-risk-lowBg border-risk-low' };
  if (dti > 0.50) {
    dtiStatus = { label: 'High Burden', color: 'text-risk-high bg-risk-highBg border-risk-high' };
  } else if (dti > 0.35) {
    dtiStatus = { label: 'Moderate', color: 'text-risk-medium bg-risk-mediumBg border-risk-medium' };
  }

  // Credit tier
  let creditTier = 'Fair';
  if (creditScore >= 740) creditTier = 'Excellent';
  else if (creditScore >= 670) creditTier = 'Good';
  else if (creditScore < 580) creditTier = 'Poor';

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-ink shadow-hard sticky top-24 space-y-5 relative overflow-hidden">
      {/* Top Receipt Notch / Barcode Aesthetic */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-canvas-border pb-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-cobalt" />
          <h3 className="font-display font-extrabold text-ink text-sm uppercase tracking-wider">
            Loan Receipt Snapshot
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-highlight-lemon text-ink px-2.5 py-0.5 rounded-full border border-ink">
          LIVE
        </span>
      </div>

      {/* Estimated Monthly Payment Block (Receipt Ticket Highlight) */}
      <div className="bg-cobalt text-white rounded-2xl p-5 border-2 border-ink shadow-hard-sm relative">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-highlight-lemon mb-1">
          <span>Est. Monthly Obligation</span>
          <span>APR {rate}%</span>
        </div>
        <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline gap-1">
          ₹{Math.round(monthlyPayment).toLocaleString()}
          <span className="text-xs font-sans font-medium text-highlight-lemon">/ mo</span>
        </div>
        <div className="mt-3 pt-2 border-t border-white/20 text-[11px] font-mono flex items-center justify-between text-white/80">
          <span>{term} months term</span>
          <span>Principal ₹{amount.toLocaleString()}</span>
        </div>
      </div>

      {/* Metric Details Table (Monospace Receipt Style) */}
      <div className="space-y-2.5 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between">
          <span className="text-ink-muted text-[11px]">Loan-to-Income (LTI)</span>
          <span className="font-bold text-ink text-sm">
            {(lti * 100).toFixed(1)}%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between">
          <span className="text-ink-muted text-[11px]">DTI Ratio Level</span>
          <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${dtiStatus.color}`}>
            {dtiStatus.label} ({(dti * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between">
          <div>
            <span className="text-ink-muted text-[11px] block">Credit Score</span>
            <span className="font-bold text-ink text-sm">{creditScore} pts</span>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 bg-white rounded-lg border border-ink text-ink shadow-hard-sm">
            {creditTier}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t-2 border-dashed border-canvas-border text-[11px] text-ink-muted flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-risk-low shrink-0" />
        <span>Updates automatically as inputs change.</span>
      </div>
    </div>
  );
}

