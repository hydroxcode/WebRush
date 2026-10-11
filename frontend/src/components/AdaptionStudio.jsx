import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Play, 
  RotateCw, 
  Key, 
  ExternalLink,
  ChevronDown,
  Info,
  Check,
  TrendingUp,
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';
import { runAdaptionPipeline, testAdaptionSdk } from '../services/api';

export default function AdaptionStudio() {
  const [recipes, setRecipes] = useState({
    deduplication: true,
    rephrasing: true,
    reasoning_traces: true,
    hallucination_mitigation: true,
  });

  const [blueprint, setBlueprint] = useState({
    brand_voice: 'Professional & Empathetic',
    length_control: 'Concise',
    safety_classification: ['Fraud Detection', 'Harassment Prevention']
  });

  const [apiKey, setApiKey] = useState('');
  const [sdkStatus, setSdkStatus] = useState(null);
  const [isTestingSdk, setIsTestingSdk] = useState(false);

  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const toggleRecipe = (key) => {
    setRecipes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const activeRecipes = Object.entries(recipes)
        .filter(([_, active]) => active)
        .map(([k]) => k);

      const result = await runAdaptionPipeline({
        recipes: activeRecipes,
        blueprint: {
          brand_voice: blueprint.brand_voice,
          length_control: blueprint.length_control,
          safety_checks: blueprint.safety_classification
        },
        api_key: apiKey || undefined
      });

      setRunResult(result);
      if (result.sample_adapted_rows?.length > 0) {
        setSelectedRow(result.sample_adapted_rows[0]);
      }
    } catch (err) {
      alert('Pipeline execution failed: ' + err.message);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleTestSdk = async () => {
    if (!apiKey) {
      alert('Please enter your Adaption API key.');
      return;
    }
    setIsTestingSdk(true);
    setSdkStatus(null);
    try {
      const res = await testAdaptionSdk(apiKey);
      setSdkStatus(res);
    } catch (err) {
      setSdkStatus({ success: false, message: err.message });
    } finally {
      setIsTestingSdk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500/80 to-indigo-600/80 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 border border-white/20 specular-rim">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Adaption Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Adaptive Data Engine
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Engineered in full accordance with Adaption specifications (<span className="text-purple-300 font-mono">docs.adaptionlabs.ai</span>): Column Mapping, Quality Evaluation, Adaptive Recipes & Blueprint Steering.
          </p>
        </div>

        {/* Launch Pipeline CTA */}
        <button
          onClick={handleRunPipeline}
          disabled={isRunningPipeline}
          className="liquid-glass-btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isRunningPipeline ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Executing Adaptation Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Adaptation Run</span>
            </>
          )}
        </button>
      </div>

      {/* 4-Step Adaption Workflow Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Column Role Mapping */}
        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center font-mono">
                1
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Column Role Mapping</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 liquid-glass-subtle px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mapped
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Assign each source column its functional training role as per Adaption Step 2.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl liquid-glass-subtle border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Prompt Role:</span>
                <p className="text-slate-200 font-mono text-xs font-semibold mt-0.5">review</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-semibold">
                Input Text
              </span>
            </div>

            <div className="p-3 rounded-xl liquid-glass-subtle border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Context Role:</span>
                <p className="text-slate-200 font-mono text-xs font-semibold mt-0.5">category, timestamp</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-semibold">
                Domain Bounds
              </span>
            </div>

            <div className="p-3 rounded-xl liquid-glass-subtle border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Completion Role:</span>
                <p className="text-slate-200 font-mono text-xs font-semibold mt-0.5">reasoning_trace, resolution</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-semibold">
                Synthetic Target
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Recipe Selection */}
        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Adaptive Data Recipes</h3>
            </div>
            <span className="text-[11px] text-purple-300 font-mono liquid-glass-subtle px-2.5 py-0.5 rounded-full border border-purple-500/30 font-semibold">
              4 Selected
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select transformation recipes to calibrate high-density training data.
          </p>

          <div className="space-y-2 text-xs">
            {/* Deduplication */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
              recipes.deduplication 
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 shadow-sm' 
                : 'liquid-glass-subtle border-white/5 text-slate-400 hover:border-white/15'
            }`}>
              <div>
                <span className="font-semibold text-white block">Prompt Deduplication</span>
                <p className="text-[11px] text-slate-400">Collapses 6,680 duplicates to 320 unique clusters</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.deduplication}
                onChange={() => toggleRecipe('deduplication')}
                className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-white/20 focus:ring-purple-400 cursor-pointer"
              />
            </label>

            {/* Prompt Rephrasing */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
              recipes.rephrasing 
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 shadow-sm' 
                : 'liquid-glass-subtle border-white/5 text-slate-400 hover:border-white/15'
            }`}>
              <div>
                <span className="font-semibold text-white block">Prompt Rephrasing</span>
                <p className="text-[11px] text-slate-400">Standardizes casing & structural clarity</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.rephrasing}
                onChange={() => toggleRecipe('rephrasing')}
                className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-white/20 focus:ring-purple-400 cursor-pointer"
              />
            </label>

            {/* Reasoning Traces */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
              recipes.reasoning_traces 
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 shadow-sm' 
                : 'liquid-glass-subtle border-white/5 text-slate-400 hover:border-white/15'
            }`}>
              <div>
                <span className="font-semibold text-white block">Reasoning Traces</span>
                <p className="text-[11px] text-slate-400">Generates root cause & impact chain-of-thought</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.reasoning_traces}
                onChange={() => toggleRecipe('reasoning_traces')}
                className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-white/20 focus:ring-purple-400 cursor-pointer"
              />
            </label>

            {/* Hallucination Mitigation */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
              recipes.hallucination_mitigation 
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 shadow-sm' 
                : 'liquid-glass-subtle border-white/5 text-slate-400 hover:border-white/15'
            }`}>
              <div>
                <span className="font-semibold text-white block">Hallucination Mitigation</span>
                <p className="text-[11px] text-slate-400">Grounds completions directly on verbatim evidence</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.hallucination_mitigation}
                onChange={() => toggleRecipe('hallucination_mitigation')}
                className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-white/20 focus:ring-purple-400 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Step 3: Blueprint Configuration */}
        <div className="liquid-glass-elevated specular-rim rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Blueprint Controls</h3>
            </div>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            System constraints applied globally across all adapted dataset completions.
          </p>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Brand Voice</label>
              <select
                value={blueprint.brand_voice}
                onChange={(e) => setBlueprint({ ...blueprint, brand_voice: e.target.value })}
                className="liquid-glass-input w-full rounded-xl px-3 py-2 text-slate-200 cursor-pointer focus:border-purple-400"
              >
                <option value="Professional & Empathetic" className="bg-slate-900">Professional & Empathetic</option>
                <option value="Direct & Tactical" className="bg-slate-900">Direct & Tactical</option>
                <option value="Executive Concierge" className="bg-slate-900">Executive Concierge</option>
                <option value="Technical Precision" className="bg-slate-900">Technical Precision</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Length Control</label>
              <select
                value={blueprint.length_control}
                onChange={(e) => setBlueprint({ ...blueprint, length_control: e.target.value })}
                className="liquid-glass-input w-full rounded-xl px-3 py-2 text-slate-200 cursor-pointer focus:border-purple-400"
              >
                <option value="Concise" className="bg-slate-900">Concise (Under 250 chars)</option>
                <option value="Detailed" className="bg-slate-900">Detailed (Step-by-step)</option>
                <option value="Extensive" className="bg-slate-900">Extensive (Root cause + SOP)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Safety Classification</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-medium">
                  Fraud Interception
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-medium">
                  Phishing / Scam Alert
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-medium">
                  Harassment Shield
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Adaption SDK Cloud Connector Bar */}
      <div className="liquid-glass-glow specular-rim rounded-2xl p-4 sm:p-5 border border-indigo-400/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Official Adaption SDK Connector</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  python library: adaption v0.14.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your personal Adaption Labs API Key to synchronize datasets and runs directly with the cloud platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter ADAPTION_API_KEY..."
              className="liquid-glass-input rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 w-full md:w-64 focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleTestSdk}
              disabled={isTestingSdk}
              className="liquid-glass-btn specular-rim px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500/90 text-white text-xs font-semibold whitespace-nowrap active:scale-95 transition-all disabled:opacity-50 border border-indigo-400/30"
            >
              {isTestingSdk ? 'Verifying...' : 'Verify SDK'}
            </button>
          </div>
        </div>

        {sdkStatus && (
          <div className={`mt-3.5 p-3 rounded-xl border text-xs flex items-center justify-between backdrop-blur-md ${
            sdkStatus.success
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            <span className="font-medium">{sdkStatus.message}</span>
            <span className="text-[11px] font-mono text-slate-400">{sdkStatus.fallback_mode || 'Cloud Connected'}</span>
          </div>
        )}
      </div>

      {/* Adaptation Results Banner & Quality Lift Comparison */}
      {runResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="liquid-glass-glow specular-rim rounded-2xl p-6 sm:p-7 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block font-mono">
                  Adaptive Data Execution Results
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                  Dataset Lift & Quality Grade Transformation
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Evaluated before and after applying Prompt Deduplication, Rephrasing, and Reasoning Traces.
                </p>
              </div>

              {/* Side-by-Side Grade Lift */}
              <div className="flex items-center gap-4 sm:gap-6 liquid-glass-elevated border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl">
                <div className="text-center px-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Pre-Adaption</span>
                  <div className="text-3xl font-black text-slate-400 font-mono mt-0.5">
                    {runResult.letter_grade_before}
                  </div>
                  <span className="text-xs font-mono text-slate-400">{runResult.quality_score_before} / 10</span>
                </div>

                <div className="p-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="text-center px-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">Post-Adaption</span>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                    {runResult.letter_grade_after}
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{runResult.quality_score_after} / 10</span>
                </div>

                <div className="border-l border-white/10 pl-4 sm:pl-5 text-xs space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Domain Rank: </span>
                    <span className="font-bold text-purple-300 font-mono">{runResult.domain_percentile}th percentile</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Deduplication: </span>
                    <span className="font-bold text-sky-400 font-mono">-{runResult.deduplication_reduction_pct}% Redundancy</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Signal Ratio: </span>
                    <span className="font-bold text-white font-mono">{runResult.after_count} Distinct Clusters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adapted Dataset Inspection Table & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of adapted clusters */}
            <div className="lg:col-span-5 liquid-glass-elevated specular-rim rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-1 tracking-tight">Adapted Feedback Clusters</h3>
              <p className="text-xs text-slate-400 mb-3">
                Select a cluster to inspect its synthesized reasoning trace and completion.
              </p>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {runResult.sample_adapted_rows?.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedRow(row)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                      selectedRow?.id === row.id
                        ? 'bg-purple-950/60 border-purple-400/50 text-purple-200 shadow-md shadow-purple-900/30'
                        : 'liquid-glass-subtle border-white/5 hover:border-white/15 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold px-2 py-0.5 rounded-full liquid-glass-subtle text-[10px] text-slate-300 border border-white/10">
                        {row.category}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-sky-400">
                        {row.frequency}x Occurrences
                      </span>
                    </div>
                    <p className="line-clamp-2 text-slate-200 font-medium">
                      {row.source_prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Deep Inspection */}
            <div className="lg:col-span-7 liquid-glass-elevated specular-rim rounded-2xl p-5 sm:p-6 border border-white/10">
              {selectedRow ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <div>
                      <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                        Cluster #{selectedRow.id} Inspection
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {selectedRow.category} • {selectedRow.frequency} Customer Instances
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      selectedRow.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      selectedRow.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      {selectedRow.severity}
                    </span>
                  </div>

                  {/* Original Raw Prompt */}
                  <div className="p-3.5 rounded-xl liquid-glass-subtle border border-white/5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                      Source Prompt (Customer Raw Feedback)
                    </span>
                    <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
                      "{selectedRow.source_prompt}"
                    </p>
                  </div>

                  {/* Rephrased Adapted Prompt */}
                  <div className="p-3.5 rounded-xl liquid-glass-subtle border border-sky-500/20">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      Adapted Instruction Prompt (Recipe: Rephrased)
                    </span>
                    <p className="text-xs text-slate-200 font-mono leading-relaxed">
                      {selectedRow.adapted_prompt}
                    </p>
                  </div>

                  {/* Reasoning Trace */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Adaption Reasoning Trace (Chain of Thought Diagnosis)
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {selectedRow.reasoning_trace}
                    </p>
                  </div>

                  {/* Blueprint Completion */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      Target Completion (Blueprint: {blueprint.brand_voice})
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedRow.suggested_completion}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-xs">
                  <Cpu className="w-8 h-8 text-slate-600 mb-2" />
                  <span>Select a cluster on the left to inspect its adaptation breakdown.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
