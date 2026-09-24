import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Check, ChevronRight, ChevronLeft, RefreshCw, AlertTriangle,
  GraduationCap, Award, BookOpen, Sparkles, Briefcase, Clock, UserCheck, AlertCircle,
  User, Heart, Users, Car, Building, Home as HomeIcon, HelpCircle, Download, RotateCcw,
  Sparkle, ShieldCheck, Edit3, Info, FileSpreadsheet
} from 'lucide-react';

import { predictLoanDefault } from '../lib/api';
import { FORM_STEPS, DEFAULT_FORM_VALUES, FIELD_METADATA } from '../constants/fields';
import LoanSnapshot from '../components/LoanSnapshot';
import ResultGauge from '../components/ResultGauge';

export default function Predict() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [predictedInputs, setPredictedInputs] = useState(null);
  const [apiError, setApiError] = useState(null);

  const abortControllerRef = useRef(null);

  // Clear result state when leaving page or mounting
  useEffect(() => {
    setResult(null);
    setPredictedInputs(null);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Helper for input change: immediately clears any existing prediction result!
  const handleChange = (field, value) => {
    if (result) {
      setResult(null);
      setPredictedInputs(null);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Helper for currency formatting input
  const handleCurrencyChange = (field, rawString) => {
    const numericStr = rawString.replace(/[^0-9]/g, '');
    const numVal = numericStr ? parseInt(numericStr, 10) : 0;
    handleChange(field, numVal);
  };

  // Step Validation
  const validateStep = (stepIdx) => {
    const newErrors = {};
    const stepObj = FORM_STEPS[stepIdx];

    if (!stepObj || stepObj.id === 'review') return true;

    stepObj.fields.forEach((field) => {
      const val = formData[field];
      const meta = FIELD_METADATA[field];

      if (val === undefined || val === null || val === '') {
        newErrors[field] = 'This field is required';
      } else if (meta && meta.min !== undefined && val < meta.min) {
        newErrors[field] = `Must be at least ${meta.min}`;
      } else if (meta && meta.max !== undefined && val > meta.max) {
        newErrors[field] = `Must be at most ${meta.max}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      setPredictedInputs(null);
    }
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Prediction with AbortController to prevent out-of-order race conditions
  const handleSubmit = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setResult(null);
    setPredictedInputs(null);
    setLoading(true);
    setApiError(null);

    const snapshotInputs = { ...formData };

    try {
      await new Promise((res) => setTimeout(res, 600));
      const response = await predictLoanDefault(snapshotInputs, abortControllerRef.current.signal);
      
      setResult(response);
      setPredictedInputs(snapshotInputs);

      if (response.prediction === 0) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        console.log('Request cancelled by user or newer prediction.');
        return;
      }
      console.error('Prediction API error:', err);
      setApiError(
        err.response?.data?.detail || 
        'Failed to connect to backend server on port 8001. Ensure run_backend.bat is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Render Category Icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Clock': return <Clock className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5" />;
      case 'User': return <User className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Building': return <Building className="w-5 h-5" />;
      case 'Home': return <HomeIcon className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold text-cobalt bg-highlight-lemon px-3 py-1 rounded-full border border-ink sticker-badge uppercase">
          EVALUATION WIZARD
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-ink tracking-tight">
          Credit Risk Assessment
        </h1>
        <p className="text-ink-muted text-base font-medium">
          Complete the guided borrower profile steps below to evaluate default risk against our trained ML pipeline.
        </p>
      </div>

      {/* Main Container */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Wizard Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Progress Stepper Bar Header */}
            <div className="bg-white p-6 rounded-3xl border-2 border-ink shadow-hard">
              {/* Step Navigation Strip */}
              <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 scrollbar-none">
                {FORM_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div
                      key={step.id}
                      onClick={() => isCompleted && setCurrentStep(idx)}
                      className={`flex items-center gap-2 flex-shrink-0 ${
                        isCompleted ? 'cursor-pointer text-cobalt font-bold' : (isCurrent ? 'text-ink font-extrabold' : 'text-ink-light')
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 border-ink transition-all ${
                          isCompleted
                            ? 'bg-highlight-mint text-ink shadow-hard-sm'
                            : (isCurrent ? 'bg-cobalt text-white shadow-hard-sm scale-110' : 'bg-canvas-subtle text-ink-muted')
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className="text-xs font-display font-bold hidden sm:inline">{step.shortTitle}</span>
                      {idx < FORM_STEPS.length - 1 && (
                        <div className="w-4 sm:w-8 h-0.5 bg-canvas-border mx-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="w-full bg-canvas-subtle h-2.5 rounded-full overflow-hidden border border-ink">
                <div
                  className="bg-cobalt h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Step Body Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-hard">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b-2 border-canvas-border pb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cobalt">STEP {currentStep + 1} OF {FORM_STEPS.length}</span>
                    <h2 className="text-2xl font-extrabold font-display text-ink mt-0.5">
                      {FORM_STEPS[currentStep].title}
                    </h2>
                    <p className="text-xs text-ink-muted mt-1 font-medium">
                      {FORM_STEPS[currentStep].description}
                    </p>
                  </div>

                  {/* Step 1: Personal */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-ink">
                          <label htmlFor="input-age">Borrower Age (Years)</label>
                          <span className="font-mono text-ink font-bold text-base px-3 py-1 bg-highlight-lemon rounded-lg border border-ink shadow-hard-sm">
                            {formData.Age} yrs
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="18"
                            max="69"
                            step="1"
                            value={formData.Age}
                            onChange={(e) => handleChange('Age', parseInt(e.target.value, 10))}
                            className="w-full h-3 bg-canvas-subtle border border-ink rounded-lg appearance-none cursor-pointer accent-cobalt"
                          />
                          <input
                            id="input-age"
                            type="number"
                            min="18"
                            max="69"
                            value={formData.Age}
                            onChange={(e) => handleChange('Age', parseInt(e.target.value, 10) || 18)}
                            className="w-20 px-3 py-1.5 border-2 border-ink rounded-xl text-sm font-mono font-bold text-center focus:ring-2 focus:ring-cobalt outline-none shadow-hard-sm"
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-ink-muted">
                          <span>Min: 18 yrs</span>
                          <span>Max: 69 yrs</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Academic Qualification</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {FIELD_METADATA.Education.map((item) => {
                            const selected = formData.Education === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => handleChange('Education', item.value)}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-xs font-extrabold transition-all gap-2 ${
                                  selected
                                    ? 'border-ink bg-highlight-sky text-ink shadow-hard'
                                    : 'border-canvas-border bg-white text-ink-muted hover:border-ink hover:text-ink'
                                }`}
                              >
                                {selected && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cobalt text-white rounded-full flex items-center justify-center border border-ink shadow-hard-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </span>
                                )}
                                {renderIcon(item.icon)}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Marital Status</label>
                        <div className="grid grid-cols-3 gap-3">
                          {FIELD_METADATA.MaritalStatus.map((item) => {
                            const selected = formData.MaritalStatus === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => handleChange('MaritalStatus', item.value)}
                                className={`relative flex items-center justify-center p-3.5 rounded-2xl border-2 text-xs font-extrabold transition-all gap-2 ${
                                  selected
                                    ? 'border-ink bg-highlight-peach text-ink shadow-hard'
                                    : 'border-canvas-border bg-white text-ink-muted hover:border-ink hover:text-ink'
                                }`}
                              >
                                {selected && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cobalt text-white rounded-full flex items-center justify-center border border-ink shadow-hard-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </span>
                                )}
                                {renderIcon(item.icon)}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-canvas-subtle rounded-2xl border-2 border-ink">
                        <div>
                          <span className="text-sm font-bold text-ink block">Has Dependents</span>
                          <span className="text-xs text-ink-muted">Children or dependent family members</span>
                        </div>
                        <div className="flex items-center bg-white p-1 rounded-xl border border-ink shadow-hard-sm">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('HasDependents', opt)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                formData.HasDependents === opt
                                  ? 'bg-cobalt text-white shadow-sm'
                                  : 'text-ink-muted hover:text-ink'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Employment & Income */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Employment Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {FIELD_METADATA.EmploymentType.map((item) => {
                            const selected = formData.EmploymentType === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => handleChange('EmploymentType', item.value)}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-xs font-extrabold transition-all gap-2 ${
                                  selected
                                    ? 'border-ink bg-highlight-mint text-ink shadow-hard'
                                    : 'border-canvas-border bg-white text-ink-muted hover:border-ink hover:text-ink'
                                }`}
                              >
                                {selected && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cobalt text-white rounded-full flex items-center justify-center border border-ink shadow-hard-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </span>
                                )}
                                {renderIcon(item.icon)}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-ink">
                          <label htmlFor="input-months-employed">Months Employed</label>
                          <span className="font-mono text-ink font-bold text-base px-3 py-1 bg-highlight-lemon rounded-lg border border-ink shadow-hard-sm">
                            {formData.MonthsEmployed} mos
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="119"
                            step="1"
                            value={formData.MonthsEmployed}
                            onChange={(e) => handleChange('MonthsEmployed', parseInt(e.target.value, 10))}
                            className="w-full h-3 bg-canvas-subtle border border-ink rounded-lg appearance-none cursor-pointer accent-cobalt"
                          />
                          <input
                            id="input-months-employed"
                            type="number"
                            min="0"
                            max="119"
                            value={formData.MonthsEmployed}
                            onChange={(e) => handleChange('MonthsEmployed', parseInt(e.target.value, 10) || 0)}
                            className="w-20 px-3 py-1.5 border-2 border-ink rounded-xl text-sm font-mono font-bold text-center focus:ring-2 focus:ring-cobalt outline-none shadow-hard-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="input-income" className="text-sm font-bold text-ink block">
                          Annual Gross Income (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-ink font-extrabold font-mono text-base">
                            ₹
                          </span>
                          <input
                            id="input-income"
                            type="text"
                            value={formData.Income ? formData.Income.toLocaleString() : ''}
                            onChange={(e) => handleCurrencyChange('Income', e.target.value)}
                            placeholder="75,000"
                            className="w-full pl-9 pr-4 py-3.5 border-2 border-ink rounded-2xl text-base font-mono font-extrabold focus:ring-2 focus:ring-cobalt outline-none shadow-hard-sm"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted block">Allowed range: ₹15,000 – ₹149,999</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Credit Profile */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-ink">
                          <label htmlFor="input-credit-score">Credit Score (FICO)</label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-canvas-subtle border border-ink text-ink">
                              {formData.CreditScore >= 740 ? 'Excellent' : formData.CreditScore >= 670 ? 'Good' : formData.CreditScore >= 580 ? 'Fair' : 'Poor'}
                            </span>
                            <span className="font-mono text-ink font-bold text-base px-3 py-1 bg-highlight-lemon rounded-lg border border-ink shadow-hard-sm">
                              {formData.CreditScore} pts
                            </span>
                          </div>
                        </div>

                        <input
                          id="input-credit-score"
                          type="range"
                          min="300"
                          max="849"
                          step="1"
                          value={formData.CreditScore}
                          onChange={(e) => handleChange('CreditScore', parseInt(e.target.value, 10))}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer credit-slider"
                        />
                        <div className="flex justify-between text-[11px] font-mono font-bold">
                          <span className="text-risk-high">Poor (300)</span>
                          <span className="text-risk-medium">Fair (580)</span>
                          <span className="text-risk-low">Good (670)</span>
                          <span className="text-cobalt">Excellent (849)</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Open Credit Lines</label>
                        <div className="grid grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleChange('NumCreditLines', num)}
                              className={`py-3 rounded-2xl border-2 font-mono text-sm font-bold transition-all ${
                                formData.NumCreditLines === num
                                  ? 'border-ink bg-highlight-sky text-ink shadow-hard'
                                  : 'border-canvas-border bg-white text-ink-muted hover:border-ink hover:text-ink'
                              }`}
                            >
                              {num} {num === 1 ? 'line' : 'lines'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-ink">
                          <label htmlFor="input-dti">Debt-to-Income (DTI) Ratio</label>
                          <span className="font-mono text-ink font-bold text-base px-3 py-1 bg-highlight-lemon rounded-lg border border-ink shadow-hard-sm">
                            {(formData.DTIRatio * 100).toFixed(0)}% ({formData.DTIRatio})
                          </span>
                        </div>
                        <input
                          id="input-dti"
                          type="range"
                          min="0.10"
                          max="0.90"
                          step="0.01"
                          value={formData.DTIRatio}
                          onChange={(e) => handleChange('DTIRatio', parseFloat(e.target.value))}
                          className="w-full h-3 bg-canvas-subtle border border-ink rounded-lg appearance-none cursor-pointer accent-cobalt"
                        />
                        <div className="flex justify-between text-[11px] font-mono text-ink-muted">
                          <span>Low Debt (0.10)</span>
                          <span>Moderate (0.40)</span>
                          <span>High Burden (0.90)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-canvas-subtle rounded-2xl border-2 border-ink">
                        <div>
                          <span className="text-sm font-bold text-ink block">Has Active Mortgage</span>
                          <span className="text-xs text-ink-muted">Existing home mortgage loan</span>
                        </div>
                        <div className="flex items-center bg-white p-1 rounded-xl border border-ink shadow-hard-sm">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('HasMortgage', opt)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                formData.HasMortgage === opt
                                  ? 'bg-cobalt text-white shadow-sm'
                                  : 'text-ink-muted hover:text-ink'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Loan Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label htmlFor="input-loan-amount" className="text-sm font-bold text-ink block">
                          Requested Loan Principal (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-ink font-extrabold font-mono text-base">
                            ₹
                          </span>
                          <input
                            id="input-loan-amount"
                            type="text"
                            value={formData.LoanAmount ? formData.LoanAmount.toLocaleString() : ''}
                            onChange={(e) => handleCurrencyChange('LoanAmount', e.target.value)}
                            placeholder="25,000"
                            className="w-full pl-9 pr-4 py-3.5 border-2 border-ink rounded-2xl text-base font-mono font-extrabold focus:ring-2 focus:ring-cobalt outline-none shadow-hard-sm"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted block">Allowed range: ₹5,000 – ₹249,999</span>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Loan Duration (Months)</label>
                        <div className="grid grid-cols-5 gap-2 bg-canvas-subtle p-2 rounded-2xl border-2 border-ink">
                          {[12, 24, 36, 48, 60].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => handleChange('LoanTerm', term)}
                              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                                formData.LoanTerm === term
                                  ? 'bg-cobalt text-white border border-ink shadow-hard-sm'
                                  : 'text-ink-muted hover:text-ink'
                              }`}
                            >
                              {term}m
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-ink">
                          <label htmlFor="input-interest-rate">Interest Rate (%)</label>
                          <span className="font-mono text-ink font-bold text-base px-3 py-1 bg-highlight-lemon rounded-lg border border-ink shadow-hard-sm">
                            {formData.InterestRate}% APR
                          </span>
                        </div>
                        <input
                          id="input-interest-rate"
                          type="range"
                          min="2.0"
                          max="25.0"
                          step="0.1"
                          value={formData.InterestRate}
                          onChange={(e) => handleChange('InterestRate', parseFloat(e.target.value))}
                          className="w-full h-3 bg-canvas-subtle border border-ink rounded-lg appearance-none cursor-pointer accent-cobalt"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-ink block">Loan Purpose</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {FIELD_METADATA.LoanPurpose.map((item) => {
                            const selected = formData.LoanPurpose === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => handleChange('LoanPurpose', item.value)}
                                className={`relative flex items-center p-3.5 rounded-2xl border-2 text-xs font-extrabold transition-all gap-2 ${
                                  selected
                                    ? 'border-ink bg-highlight-lemon text-ink shadow-hard'
                                    : 'border-canvas-border bg-white text-ink-muted hover:border-ink hover:text-ink'
                                }`}
                              >
                                {selected && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-cobalt text-white rounded-full flex items-center justify-center border border-ink shadow-hard-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </span>
                                )}
                                {renderIcon(item.icon)}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-canvas-subtle rounded-2xl border-2 border-ink">
                        <div>
                          <span className="text-sm font-bold text-ink block">Has Co-Signer</span>
                          <span className="text-xs text-ink-muted">Additional credit guarantor</span>
                        </div>
                        <div className="flex items-center bg-white p-1 rounded-xl border border-ink shadow-hard-sm">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('HasCoSigner', opt)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                formData.HasCoSigner === opt
                                  ? 'bg-cobalt text-white shadow-sm'
                                  : 'text-ink-muted hover:text-ink'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Predict */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-highlight-lemon/40 p-4 rounded-2xl border-2 border-ink text-xs font-medium text-ink flex items-center gap-2">
                        <Info className="w-4 h-4 text-cobalt shrink-0" />
                        <span>Please review all 16 applicant parameters below before running machine learning evaluation.</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setCurrentStep(0)}
                          className="bg-white p-4 rounded-2xl border-2 border-ink hover:bg-canvas-subtle transition-all cursor-pointer space-y-2 shadow-hard-sm group"
                        >
                          <div className="flex justify-between items-center border-b border-canvas-border pb-2">
                            <span className="font-extrabold font-display text-ink text-xs uppercase">1. Personal Profile</span>
                            <Edit3 className="w-4 h-4 text-cobalt group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-xs font-mono space-y-1 text-ink-muted">
                            <div>Age: <strong className="text-ink">{formData.Age} yrs</strong></div>
                            <div>Education: <strong className="text-ink">{formData.Education}</strong></div>
                            <div>Marital: <strong className="text-ink">{formData.MaritalStatus}</strong></div>
                            <div>Dependents: <strong className="text-ink">{formData.HasDependents}</strong></div>
                          </div>
                        </div>

                        <div
                          onClick={() => setCurrentStep(1)}
                          className="bg-white p-4 rounded-2xl border-2 border-ink hover:bg-canvas-subtle transition-all cursor-pointer space-y-2 shadow-hard-sm group"
                        >
                          <div className="flex justify-between items-center border-b border-canvas-border pb-2">
                            <span className="font-extrabold font-display text-ink text-xs uppercase">2. Employment & Income</span>
                            <Edit3 className="w-4 h-4 text-cobalt group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-xs font-mono space-y-1 text-ink-muted">
                            <div>Employment: <strong className="text-ink">{formData.EmploymentType}</strong></div>
                            <div>Duration: <strong className="text-ink">{formData.MonthsEmployed} mos</strong></div>
                            <div>Income: <strong className="text-ink">₹{formData.Income.toLocaleString()}</strong></div>
                          </div>
                        </div>

                        <div
                          onClick={() => setCurrentStep(2)}
                          className="bg-white p-4 rounded-2xl border-2 border-ink hover:bg-canvas-subtle transition-all cursor-pointer space-y-2 shadow-hard-sm group"
                        >
                          <div className="flex justify-between items-center border-b border-canvas-border pb-2">
                            <span className="font-extrabold font-display text-ink text-xs uppercase">3. Credit Profile</span>
                            <Edit3 className="w-4 h-4 text-cobalt group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-xs font-mono space-y-1 text-ink-muted">
                            <div>Score: <strong className="text-ink">{formData.CreditScore} pts</strong></div>
                            <div>Credit Lines: <strong className="text-ink">{formData.NumCreditLines}</strong></div>
                            <div>DTI Ratio: <strong className="text-ink">{(formData.DTIRatio * 100).toFixed(0)}%</strong></div>
                            <div>Mortgage: <strong className="text-ink">{formData.HasMortgage}</strong></div>
                          </div>
                        </div>

                        <div
                          onClick={() => setCurrentStep(3)}
                          className="bg-white p-4 rounded-2xl border-2 border-ink hover:bg-canvas-subtle transition-all cursor-pointer space-y-2 shadow-hard-sm group"
                        >
                          <div className="flex justify-between items-center border-b border-canvas-border pb-2">
                            <span className="font-extrabold font-display text-ink text-xs uppercase">4. Loan Terms</span>
                            <Edit3 className="w-4 h-4 text-cobalt group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-xs font-mono space-y-1 text-ink-muted">
                            <div>Amount: <strong className="text-ink">₹{formData.LoanAmount.toLocaleString()}</strong></div>
                            <div>Term: <strong className="text-ink">{formData.LoanTerm} months</strong></div>
                            <div>Rate: <strong className="text-ink">{formData.InterestRate}% APR</strong></div>
                            <div>Co-Signer: <strong className="text-ink">{formData.HasCoSigner}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Button Bar */}
                  <div className="pt-6 border-t-2 border-canvas-border flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 0 || loading}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold border-2 border-ink transition-all ${
                        currentStep === 0
                          ? 'opacity-0 cursor-default'
                          : 'bg-white text-ink hover:bg-canvas-subtle shadow-hard-sm'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    {currentStep < FORM_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 px-7 py-3 bg-cobalt hover:bg-cobalt-hover text-white text-sm font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard transition-all"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-cobalt hover:bg-cobalt-hover text-white text-sm font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard transition-all"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Evaluating 16 Risk Signals...
                          </>
                        ) : (
                          <>
                            <Sparkle className="w-4 h-4 text-highlight-lemon" />
                            Run Default Prediction
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Live Loan Snapshot Side Panel (Desktop) */}
          <div className="lg:col-span-4">
            <LoanSnapshot formData={formData} />
          </div>
        </div>
      ) : (
        /* Result View (Clean Editorial Statement displaying Evaluated Inputs and Gauge) */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Demo Mode Banner if active */}
          {result.demo_mode && (
            <div className="p-4 bg-highlight-lemon/40 border-2 border-ink rounded-2xl flex items-center gap-3 text-ink text-sm shadow-hard-sm font-medium">
              <Info className="w-5 h-5 text-cobalt shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> Running on mock heuristics because model files were not loaded in backend/model/.
              </span>
            </div>
          )}

          {/* Main Verdict Header Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-ink shadow-hard text-center space-y-6 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-cobalt bg-highlight-lemon px-3.5 py-1 rounded-full border border-ink sticker-badge uppercase">
              EVALUATION STATEMENT VERDICT
            </span>

            {/* Semicircle Gauge */}
            <ResultGauge
              probability={result.default_probability}
              riskLevel={result.risk_level}
            />

            {/* Verdict Badge */}
            <div className="pt-2">
              <div
                className={`inline-flex items-center gap-3 px-8 py-3 rounded-full text-xl font-extrabold font-display border-2 shadow-hard sticker-badge transform -rotate-1 ${
                  result.prediction === 0
                    ? 'bg-risk-lowBg text-risk-low border-ink'
                    : 'bg-risk-highBg text-risk-high border-ink'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
                {result.label}
              </div>
            </div>

            <p className="text-ink-muted text-base max-w-lg mx-auto leading-relaxed font-medium">
              Based on the evaluated applicant parameters, the trained Gradient Boosting model predicts a 
              <strong className="text-ink font-mono font-bold"> {(result.default_probability * 100).toFixed(1)}% default probability</strong>.
            </p>
          </div>

          {/* Exact Evaluated Inputs Recap Statement Card */}
          {predictedInputs && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-hard space-y-4">
              <div className="flex items-center justify-between border-b-2 border-canvas-border pb-3">
                <h3 className="font-display font-extrabold text-ink text-lg flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cobalt" />
                  Evaluated Profile Statement
                </h3>
                <span className="text-[11px] font-mono font-bold text-ink bg-canvas-subtle px-2.5 py-1 rounded-md border border-ink">
                  Exact Evaluated Parameters
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Age</span>
                  <span className="font-bold text-ink text-sm">{predictedInputs.Age} yrs</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Annual Income</span>
                  <span className="font-bold text-ink text-sm">₹{predictedInputs.Income?.toLocaleString()}</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Loan Amount</span>
                  <span className="font-bold text-ink text-sm">₹{predictedInputs.LoanAmount?.toLocaleString()}</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Credit Score</span>
                  <span className="font-bold text-ink text-sm">{predictedInputs.CreditScore} pts</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Employment</span>
                  <span className="font-bold text-ink">{predictedInputs.EmploymentType} ({predictedInputs.MonthsEmployed}m)</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">DTI Ratio</span>
                  <span className="font-bold text-ink">{(predictedInputs.DTIRatio * 100).toFixed(0)}%</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Interest Rate</span>
                  <span className="font-bold text-ink">{predictedInputs.InterestRate}% APR</span>
                </div>
                <div className="bg-canvas-subtle p-3 rounded-2xl border border-canvas-border">
                  <span className="text-ink-muted block text-[10px]">Term & Co-Signer</span>
                  <span className="font-bold text-ink">{predictedInputs.LoanTerm}m / Co-Signer: {predictedInputs.HasCoSigner}</span>
                </div>
              </div>
            </div>
          )}

          {/* What-If Key Factors Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-hard space-y-4">
            <h3 className="font-display font-extrabold text-ink text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cobalt" />
              Key What-If Sensitivity Risk Drivers
            </h3>
            <p className="text-xs text-ink-muted font-medium">
              Per-prediction sensitivity analysis comparing applicant parameters against baseline training medians:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {result.top_factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-canvas-subtle rounded-2xl border-2 border-ink flex items-start gap-3 text-xs text-ink font-semibold leading-relaxed shadow-hard-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-cobalt text-white flex items-center justify-center shrink-0 mt-0.5 border border-ink">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: strictly ONLY Edit Inputs & Download Report */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={() => {
                setResult(null);
                setPredictedInputs(null);
              }}
              className="px-6 py-3.5 bg-white hover:bg-canvas-subtle text-ink text-sm font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-cobalt" />
              Edit Inputs
            </button>

            <button
              onClick={() => window.print()}
              className="px-6 py-3.5 bg-cobalt hover:bg-cobalt-hover text-white text-sm font-extrabold font-display rounded-2xl border-2 border-ink shadow-hard transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>

          {/* Educational Disclaimer */}
          <div className="text-center text-xs text-ink-muted pt-2 border-t border-canvas-border">
            Educational project. Not financial advice.
          </div>
        </motion.div>
      )}

      {/* Graceful API Error State */}
      {apiError && (
        <div className="max-w-md mx-auto p-6 bg-risk-highBg rounded-3xl border-2 border-ink text-center space-y-4 shadow-hard">
          <AlertTriangle className="w-8 h-8 text-risk-high mx-auto" />
          <h3 className="font-extrabold font-display text-ink text-base">Backend Connection Error</h3>
          <p className="text-xs text-ink font-medium leading-relaxed">{apiError}</p>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-risk-high text-white text-xs font-bold font-mono rounded-xl border border-ink shadow-hard-sm hover:bg-rose-600"
          >
            Retry Prediction
          </button>
        </div>
      )}
    </div>
  );
}

