import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Zap, Eye, Lock, BarChart3, Cpu, Sparkles, FileText, ShieldAlert
} from 'lucide-react';

const MARQUEE_ITEMS = [
  '255,347 Trained Loan Records',
  '16 Calibrated Risk Signals',
  'Real Gradient Boosting Model',
  'Sub-50ms Inference Latency',
  '88.6% Held-Out Test Accuracy',
  'Explainable What-If Sensitivity',
  'Stateless In-Memory Evaluation',
  'ROC-AUC 0.758 Benchmark',
];

export default function Home() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-16 pb-16" onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-highlight-lemon text-ink text-xs font-mono font-bold border-2 border-ink shadow-hard-sm sticker-badge">
                <Sparkles className="w-3.5 h-3.5 fill-ink" />
                <span>EDITORIAL CREDIT RISK ANALYTICS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-ink tracking-tight leading-[1.05]">
                Instant Loan Default <br className="hidden sm:inline" />
                <span className="relative inline-block mt-2">
                  <span className="marker-highlight-lemon px-3 py-1 text-ink">
                    Risk Intelligence
                  </span>
                  {/* Hand-drawn SVG squiggle underline */}
                  <svg className="absolute -bottom-3 left-0 w-full h-4 text-cobalt overflow-visible" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
                    <path d="M 5 15 Q 75 2, 150 15 T 295 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 pt-2 font-medium">
                LoanSight delivers enterprise credit risk predictions using a trained 
                Gradient Boosting model evaluated on 255,000+ anonymized borrower records across 16 critical risk signals.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => navigate('/predict')}
                  className="w-full sm:w-auto px-8 py-4 bg-cobalt hover:bg-cobalt-hover text-white text-base font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
                >
                  Start Loan Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto px-6 py-4 bg-white text-ink text-base font-bold rounded-2xl border-2 border-ink shadow-hard-sm hover:bg-canvas-subtle transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-cobalt" />
                  View Model Spec Sheet
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-mono font-bold text-ink border-t border-canvas-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-risk-low" />
                  <span>255K Dataset Trained</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-risk-low" />
                  <span>88.6% Test Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-risk-low" />
                  <span>Sub-50ms Inference</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual (Composition of Floating Rotated UI Cards with Parallax) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div
                className="relative mx-auto max-w-md lg:max-w-none py-8 transition-transform duration-200 ease-out"
                style={{
                  transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0px)`
                }}
              >
                {/* Background Shadow Card */}
                <div className="absolute inset-0 bg-highlight-peach rounded-3xl border-2 border-ink transform rotate-3 scale-95 z-0"></div>

                {/* Main Floating Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-ink shadow-hard space-y-6 relative z-10 transform -rotate-1">
                  <div className="flex items-center justify-between border-b-2 border-canvas-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cobalt text-white flex items-center justify-center font-bold border-2 border-ink">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-ink text-sm">GradientBoosting v1.0</h4>
                        <p className="text-xs font-mono text-ink-muted">Inference Latency: 14ms</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-highlight-mint text-ink font-mono font-bold text-xs rounded-full border border-ink shadow-hard-sm">
                      Model Active
                    </span>
                  </div>

                  {/* Sample Mini Semicircle Gauge Visual */}
                  <div className="bg-canvas rounded-2xl p-5 border-2 border-ink space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-ink">
                      <span>Applicant Default Risk</span>
                      <span className="px-2 py-0.5 bg-risk-lowBg text-risk-low border border-risk-low rounded">LOW RISK</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-extrabold font-display text-ink block">4.8%</span>
                        <span className="text-[10px] font-mono text-ink-muted">Default Probability</span>
                      </div>
                      
                      {/* Mini Arc Illustration */}
                      <svg className="w-24 h-14 overflow-visible" viewBox="0 0 100 60">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EFECE3" strokeWidth="10" strokeLinecap="round" />
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#16A34A" strokeWidth="10" strokeLinecap="round" strokeDasharray="125" strokeDashoffset="115" />
                        <circle cx="50" cy="50" r="4" fill="#101828" />
                        <line x1="50" y1="50" x2="25" y2="28" stroke="#101828" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Key Features Mini List */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                      <span className="text-ink-muted">DTI Ratio Signal</span>
                      <span className="font-bold text-ink">0.24 (Healthy)</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-canvas-subtle border border-canvas-border flex items-center justify-between">
                      <span className="text-ink-muted">Credit Rating</span>
                      <span className="font-bold text-ink">760 pts (Good)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Sticker Badges */}
                <div className="absolute -top-2 -right-4 bg-highlight-lemon px-4 py-2 rounded-2xl border-2 border-ink shadow-hard z-20 hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-ink transform rotate-6">
                  <BarChart3 className="w-4 h-4 text-cobalt" />
                  <span>ROC-AUC 0.758</span>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-highlight-sky px-4 py-2 rounded-2xl border-2 border-ink shadow-hard z-20 hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-ink transform -rotate-4">
                  <Eye className="w-4 h-4 text-cobalt" />
                  <span>What-If Explainable</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Infinite Marquee Ticker */}
      <section className="bg-ink text-white py-4 border-y-2 border-ink overflow-hidden shadow-hard">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-wider">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-highlight-lemon text-base">★</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold text-cobalt bg-highlight-sky px-3 py-1 rounded-full border border-ink sticker-badge uppercase">
            ENGINEERING EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-ink tracking-tight">
            Designed for Editorial Precision
          </h2>
          <p className="text-ink-muted text-base font-medium">
            Strict machine learning standards, real-time what-if explainability, and zero data retention.
          </p>
        </div>

        {/* Bento Grid Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Sub-50ms (Peach - 7 cols) */}
          <div className="md:col-span-7 bg-highlight-peach/50 rounded-3xl p-8 border-2 border-ink shadow-hard space-y-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
              <Zap className="w-6 h-6 text-cobalt" />
            </div>
            <span className="inline-block text-xs font-mono font-bold bg-white text-ink px-2.5 py-0.5 rounded-md border border-ink">LIGHTNING SPEED</span>
            <h3 className="text-2xl font-extrabold font-display text-ink">Sub-50ms Inference Latency</h3>
            <p className="text-ink text-sm leading-relaxed font-medium">
              Optimized scikit-learn Gradient Boosting pipeline loaded directly into FastAPI memory for instant, zero-wait risk scoring on every evaluation.
            </p>
          </div>

          {/* Bento Card 2: What-If Sensitivity (Mint - 5 cols) */}
          <div className="md:col-span-5 bg-highlight-mint/50 rounded-3xl p-8 border-2 border-ink shadow-hard space-y-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
              <Eye className="w-6 h-6 text-cobalt" />
            </div>
            <span className="inline-block text-xs font-mono font-bold bg-white text-ink px-2.5 py-0.5 rounded-md border border-ink">EXPLAINABLE ML</span>
            <h3 className="text-2xl font-extrabold font-display text-ink">What-If Sensitivity</h3>
            <p className="text-ink text-sm leading-relaxed font-medium">
              Per-prediction sensitivity analysis compares inputs against baseline training medians to pinpoint exact risk drivers.
            </p>
          </div>

          {/* Bento Card 3: 16 Signals (Sky - 5 cols) */}
          <div className="md:col-span-5 bg-highlight-sky/50 rounded-3xl p-8 border-2 border-ink shadow-hard space-y-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
              <BarChart3 className="w-6 h-6 text-cobalt" />
            </div>
            <span className="inline-block text-xs font-mono font-bold bg-white text-ink px-2.5 py-0.5 rounded-md border border-ink">16 SIGNALS</span>
            <h3 className="text-2xl font-extrabold font-display text-ink">Comprehensive Profile</h3>
            <p className="text-ink text-sm leading-relaxed font-medium">
              Evaluates demographics, employment tenure, DTI ratios, and credit lines for a 360-degree underwriting view.
            </p>
          </div>

          {/* Bento Card 4: Stateless Security (Lemon - 7 cols) */}
          <div className="md:col-span-7 bg-highlight-lemon/50 rounded-3xl p-8 border-2 border-ink shadow-hard space-y-4 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white text-ink flex items-center justify-center border-2 border-ink shadow-hard-sm">
              <Lock className="w-6 h-6 text-cobalt" />
            </div>
            <span className="inline-block text-xs font-mono font-bold bg-white text-ink px-2.5 py-0.5 rounded-md border border-ink">STATELESS PRIVACY</span>
            <h3 className="text-2xl font-extrabold font-display text-ink">0% Data Retention</h3>
            <p className="text-ink text-sm leading-relaxed font-medium">
              Applicant data is processed strictly in-memory during evaluation and never saved to databases or third-party tracking services.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Horizontal Timeline */}
      <section className="bg-white border-y-2 border-ink py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-cobalt uppercase tracking-widest">STEP-BY-STEP WORKFLOW</span>
            <h2 className="text-3xl font-extrabold font-display text-ink tracking-tight">How LoanSight Evaluates Risk</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-ink z-0"></div>

            {/* Step 1 */}
            <div className="bg-canvas rounded-3xl p-6 border-2 border-ink shadow-hard space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cobalt text-white font-extrabold font-mono text-xl flex items-center justify-center border-2 border-ink shadow-hard-sm">
                01
              </div>
              <h4 className="font-display font-extrabold text-ink text-xl">Applicant Profile</h4>
              <p className="text-ink-muted text-xs leading-relaxed font-medium">
                Enter 16 borrower parameters spanning employment history, annual earnings, credit rating, and requested loan terms into our guided wizard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-canvas rounded-3xl p-6 border-2 border-ink shadow-hard space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-highlight-lemon text-ink font-extrabold font-mono text-xl flex items-center justify-center border-2 border-ink shadow-hard-sm">
                02
              </div>
              <h4 className="font-display font-extrabold text-ink text-xl">Gradient Boosting ML</h4>
              <p className="text-ink-muted text-xs leading-relaxed font-medium">
                The payload is normalized with saved IQR bounds, standardized with StandardScaler, and scored across 150 decision trees.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-canvas rounded-3xl p-6 border-2 border-ink shadow-hard space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-highlight-mint text-ink font-extrabold font-mono text-xl flex items-center justify-center border-2 border-ink shadow-hard-sm">
                03
              </div>
              <h4 className="font-display font-extrabold text-ink text-xl">Actionable Verdict</h4>
              <p className="text-ink-muted text-xs leading-relaxed font-medium">
                Receive an instant default probability score, calibrated risk level badge (Low/Medium/High), top explanatory factors, and printable report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bold Closing CTA Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cobalt text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 border-2 border-ink shadow-hard-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-block text-xs font-mono font-bold bg-highlight-lemon text-ink px-3 py-1 rounded-full border border-ink uppercase">
              READY FOR ASSESSMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Evaluate a Borrower Profile Now
            </h2>
            <p className="text-white/80 text-base font-medium">
              Run custom scenarios or pre-fill sample borrower data with a single click.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={() => navigate('/predict')}
              className="px-8 py-4 bg-highlight-lemon text-ink font-extrabold font-display text-base rounded-2xl border-2 border-ink shadow-hard hover:translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Start Free Assessment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

