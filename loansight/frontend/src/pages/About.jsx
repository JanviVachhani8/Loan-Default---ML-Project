import React, { useEffect, useState } from 'react';
import { getModelInfo } from '../lib/api';
import { Cpu, BarChart3, Database, ShieldCheck, RefreshCw, FileText, Info, HelpCircle } from 'lucide-react';

const FEATURE_TABLE_DATA = [
  { name: "Age", type: "Integer", range: "18 – 69", desc: "Borrower age in years" },
  { name: "Income", type: "Integer", range: "₹15,000 – ₹149,999", desc: "Self-reported annual gross income" },
  { name: "LoanAmount", type: "Integer", range: "₹5,000 – ₹249,999", desc: "Principal loan amount requested" },
  { name: "CreditScore", type: "Integer", range: "300 – 849", desc: "FICO credit rating" },
  { name: "MonthsEmployed", type: "Integer", range: "0 – 119", desc: "Employment tenure at current employer" },
  { name: "NumCreditLines", type: "Integer", range: "1 – 4", desc: "Active open credit accounts" },
  { name: "InterestRate", type: "Float", range: "2.0% – 25.0%", desc: "Annualized interest rate percentage" },
  { name: "LoanTerm", type: "Categorical", range: "12, 24, 36, 48, 60", desc: "Repayment duration in months" },
  { name: "DTIRatio", type: "Float", range: "0.10 – 0.90", desc: "Total monthly debt payments / gross income" },
  { name: "Education", type: "Categorical", range: "High School, Bachelor's, Master's, PhD", desc: "Highest academic qualification" },
  { name: "EmploymentType", type: "Categorical", range: "Full-time, Part-time, Self-employed, Unemployed", desc: "Current employment status" },
  { name: "MaritalStatus", type: "Categorical", range: "Single, Married, Divorced", desc: "Legal marital status" },
  { name: "HasMortgage", type: "Categorical", range: "Yes, No", desc: "Indicates existing home loan" },
  { name: "HasDependents", type: "Categorical", range: "Yes, No", desc: "Indicates financial dependents" },
  { name: "LoanPurpose", type: "Categorical", range: "Auto, Business, Education, Home, Other", desc: "Intended application of funds" },
  { name: "HasCoSigner", type: "Categorical", range: "Yes, No", desc: "Secondary credit guarantee backing" }
];

export default function About() {
  const [modelInfo, setModelInfo] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      try {
        const data = await getModelInfo();
        if (isMounted) {
          setModelInfo(data);
          setMetricsError(false);
        }
      } catch (err) {
        console.warn('Backend metrics fetch warning:', err);
        if (isMounted) {
          setMetricsError(true);
        }
      } finally {
        if (isMounted) {
          setMetricsLoading(false);
        }
      }
    };
    fetchInfo();
    return () => { isMounted = false; };
  }, []);

  const metrics = modelInfo?.metrics || null;
  const featureImportances = modelInfo?.feature_importances || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header (Renders Immediately) */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-cobalt bg-highlight-lemon px-3.5 py-1 rounded-full border border-ink sticker-badge uppercase">
          MODEL ARCHITECTURE & DATASET SPEC
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-ink tracking-tight">
          About LoanSight ML Engine
        </h1>
        <p className="text-ink-muted text-base font-medium">
          Full technical architecture, dataset specifications, 16-feature data dictionary, and live benchmark evaluation metrics.
        </p>
      </div>

      {/* Static Section 1: Editorial Spec Overview Blocks (Renders Immediately) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-ink shadow-hard space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-highlight-peach text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
            <Cpu className="w-6 h-6 text-cobalt" />
          </div>
          <h3 className="font-display font-extrabold text-ink text-xl">Model Algorithm</h3>
          <p className="text-xs text-ink-muted leading-relaxed font-medium">
            <strong>GradientBoostingClassifier</strong> (150 decision trees, max depth 4, learning rate 0.1, random state 42). Champion model selected from 5-fold cross-validation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-ink shadow-hard space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-highlight-sky text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
            <Database className="w-6 h-6 text-cobalt" />
          </div>
          <h3 className="font-display font-extrabold text-ink text-xl">Dataset Facts</h3>
          <p className="text-xs text-ink-muted leading-relaxed font-medium">
            Trained on <strong>255,347 anonymized loan application records</strong>. Baseline default class rate is <strong>~11.6%</strong> (stratified 80/20 train/test split).
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-ink shadow-hard space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-highlight-mint text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
            <ShieldCheck className="w-6 h-6 text-cobalt" />
          </div>
          <h3 className="font-display font-extrabold text-ink text-xl">16 Risk Signals</h3>
          <p className="text-xs text-ink-muted leading-relaxed font-medium">
            Evaluates 9 numerical features (IQR clipped) and 7 categorical features (encoded with training LabelEncoders) to calculate borrower risk.
          </p>
        </div>
      </div>

      {/* Dynamic Live Metrics Section (Loads from /api/model-info with Spinner/Skeleton) */}
      <div className="bg-white p-8 rounded-3xl border-2 border-ink shadow-hard space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-canvas-border pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cobalt text-white flex items-center justify-center border-2 border-ink shadow-hard-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-ink text-xl">Held-Out Test Set Benchmark</h3>
              <p className="text-xs font-mono text-ink-muted">Evaluated on 51,070 test records (20% split)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-highlight-lemon rounded-full border border-ink text-ink">
            {metricsLoading ? 'FETCHING...' : (metrics ? 'LIVE CONNECTED' : 'OFFLINE MODE')}
          </span>
        </div>

        {metricsLoading ? (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cobalt animate-spin mx-auto" />
            <span className="text-xs font-mono text-ink-muted block">Loading test set metrics from server...</span>
          </div>
        ) : metricsError || !metrics ? (
          <div className="p-4 bg-canvas-subtle border-2 border-ink rounded-2xl text-center text-xs text-ink space-y-1">
            <Info className="w-5 h-5 text-cobalt mx-auto mb-1" />
            <p className="font-bold text-ink">Live Test Metrics Offline</p>
            <p className="text-ink-muted font-medium">Showing static specifications below. Connect backend port 8001 to view live JSON metrics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-highlight-peach/40 rounded-2xl border-2 border-ink shadow-hard-sm">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase">Accuracy</span>
              <span className="text-3xl font-extrabold font-display text-ink">
                {((metrics.accuracy || 0.8864) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-4 bg-highlight-sky/40 rounded-2xl border-2 border-ink shadow-hard-sm">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase">ROC-AUC</span>
              <span className="text-3xl font-extrabold font-display text-cobalt font-mono">
                {(metrics.roc_auc || 0.7583).toFixed(4)}
              </span>
            </div>
            <div className="p-4 bg-highlight-mint/40 rounded-2xl border-2 border-ink shadow-hard-sm">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase">Precision</span>
              <span className="text-3xl font-extrabold font-display text-ink">
                {((metrics.precision || 0.5882) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-4 bg-highlight-lemon/40 rounded-2xl border-2 border-ink shadow-hard-sm">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase">Recall</span>
              <span className="text-3xl font-extrabold font-display text-ink">
                {((metrics.recall || 0.0737) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-4 bg-canvas-subtle rounded-2xl border-2 border-ink shadow-hard-sm col-span-2 lg:col-span-1">
              <span className="text-[11px] font-mono font-bold text-ink-muted block uppercase">F1-Score</span>
              <span className="text-3xl font-extrabold font-display text-ink font-mono">
                {(metrics.f1_score || 0.1310).toFixed(4)}
              </span>
            </div>
          </div>
        )}

        {/* Feature Importances Chart if available */}
        {featureImportances && (
          <div className="pt-4 border-t-2 border-canvas-border space-y-4">
            <h4 className="font-display font-extrabold text-ink text-lg">Gini Feature Importances (Top Drivers)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(featureImportances).map(([feat, imp]) => {
                const pct = (imp * 100).toFixed(1);
                return (
                  <div key={feat} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold text-ink">
                      <span>{feat}</span>
                      <span className="text-cobalt">{pct}%</span>
                    </div>
                    <div className="w-full bg-canvas-subtle h-3 rounded-full overflow-hidden border border-ink">
                      <div className="bg-cobalt h-3 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Static Section 2: Complete 16 Input Features Dictionary Table (Spec Sheet Style) */}
      <div className="bg-white p-8 rounded-3xl border-2 border-ink shadow-hard space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-canvas-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-highlight-lemon text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
            <FileText className="w-5 h-5 text-cobalt" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-ink text-xl">Input Features Specification Dictionary</h3>
            <p className="text-xs font-mono text-ink-muted">Allowed bounds, data types, and field descriptions for all 16 signals</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-ink bg-canvas-subtle text-ink font-bold font-mono uppercase tracking-wider">
                <th className="p-3">Field Name</th>
                <th className="p-3">Data Type</th>
                <th className="p-3">Allowed Range / Options</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border text-ink font-medium">
              {FEATURE_TABLE_DATA.map((row) => (
                <tr key={row.name} className="hover:bg-highlight-lemon/20 transition-colors">
                  <td className="p-3 font-bold text-ink font-mono">{row.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-canvas-subtle text-ink text-[11px] font-mono border border-ink">
                      {row.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-cobalt">{row.range}</td>
                  <td className="p-3 text-ink-muted font-sans text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Static Section 3: Visual Risk Scale Bar & How Predictions Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Calibration Matrix & Visual Scale Bar */}
        <div className="bg-white p-8 rounded-3xl border-2 border-ink shadow-hard space-y-5">
          <h3 className="font-display font-extrabold text-ink text-xl flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cobalt" />
            Risk Threshold Calibration Matrix
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed font-medium">
            Probability thresholds are calibrated against test set percentiles (P75 = 0.147, P95 = 0.35) to categorize credit risk:
          </p>

          {/* Visual Risk Scale Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px] font-mono font-bold text-ink">
              <span>0%</span>
              <span>15% (P75)</span>
              <span>35% (P95)</span>
              <span>100%</span>
            </div>
            <div className="w-full h-6 rounded-full overflow-hidden flex border-2 border-ink font-mono text-[10px] font-bold text-ink text-center">
              <div className="w-[15%] bg-risk-lowBg flex items-center justify-center border-r border-ink text-risk-low">LOW</div>
              <div className="w-[20%] bg-risk-mediumBg flex items-center justify-center border-r border-ink text-risk-medium">MEDIUM</div>
              <div className="w-[65%] bg-risk-highBg flex items-center justify-center text-risk-high">HIGH RISK</div>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2 font-mono">
            <div className="p-3 bg-risk-lowBg rounded-2xl border border-risk-low flex justify-between items-center text-risk-low">
              <div>
                <strong className="block font-sans text-ink font-bold">Low Risk Profile</strong>
                <span>Probability &lt; 0.15 (Bottom 75% of applicants)</span>
              </div>
              <span className="px-2.5 py-1 bg-white font-bold rounded-lg border border-risk-low shadow-hard-sm">
                LOW
              </span>
            </div>

            <div className="p-3 bg-risk-mediumBg rounded-2xl border border-risk-medium flex justify-between items-center text-risk-medium">
              <div>
                <strong className="block font-sans text-ink font-bold">Medium Risk Profile</strong>
                <span>Probability 0.15 – 0.35 (75th to 95th percentile)</span>
              </div>
              <span className="px-2.5 py-1 bg-white font-bold rounded-lg border border-risk-medium shadow-hard-sm">
                MEDIUM
              </span>
            </div>

            <div className="p-3 bg-risk-highBg rounded-2xl border border-risk-high flex justify-between items-center text-risk-high">
              <div>
                <strong className="block font-sans text-ink font-bold">High Risk Profile</strong>
                <span>Probability &gt; 0.35 (Top 5% highest risk)</span>
              </div>
              <span className="px-2.5 py-1 bg-white font-bold rounded-lg border border-risk-high shadow-hard-sm">
                HIGH
              </span>
            </div>
          </div>
        </div>

        {/* How Predictions Work */}
        <div className="bg-white p-8 rounded-3xl border-2 border-ink shadow-hard space-y-4">
          <h3 className="font-display font-extrabold text-ink text-xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cobalt" />
            How Predictions Work
          </h3>
          <div className="space-y-4 text-xs text-ink-muted leading-relaxed font-medium">
            <div className="p-3.5 bg-canvas-subtle rounded-2xl border border-canvas-border space-y-1">
              <span className="font-bold text-ink block font-display text-sm">1. Input Standardization</span>
              <p>Numeric inputs are clipped using saved training IQR bounds (Q1 - 1.5*IQR, Q3 + 1.5*IQR) to prevent outlier distortion before scaling.</p>
            </div>
            <div className="p-3.5 bg-canvas-subtle rounded-2xl border border-canvas-border space-y-1">
              <span className="font-bold text-ink block font-display text-sm">2. Ensemble Decision Scoring</span>
              <p>Standardized features pass through 150 decision trees. The default probability represents tree votes weighted by step learning rate.</p>
            </div>
            <div className="p-3.5 bg-canvas-subtle rounded-2xl border border-canvas-border space-y-1">
              <span className="font-bold text-ink block font-display text-sm">3. Sensitivity What-If Analysis</span>
              <p>Each feature is temporarily replaced with its baseline training median/mode to compute probability delta \(\Delta p\), isolating key risk drivers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

