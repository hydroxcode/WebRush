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
  AlertCircle
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Adaption Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Adaptive Data Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Engineered in full accordance with Adaption specifications (docs.adaptionlabs.ai): Column Mapping, Quality Evaluation, Adaptive Recipes & Blueprint Steering.
          </p>
        </div>

        {/* Launch Pipeline CTA */}
        <button
          onClick={handleRunPipeline}
          disabled={isRunningPipeline}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50"
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
        {/* Step 2: Column Role Mapping */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-semibold text-white">Column Role Mapping</h3>
            </div>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mapped
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Assign each source column its functional training role as per Adaption Step 2.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Prompt Role:</span>
                <p className="text-slate-200 font-mono mt-0.5">review</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px]">
                Input Text
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Context Role:</span>
                <p className="text-slate-200 font-mono mt-0.5">category, timestamp</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                Domain Bounds
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Completion Role:</span>
                <p className="text-slate-200 font-mono mt-0.5">reasoning_trace, resolution</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">
                Synthetic Target
              </span>
            </div>
          </div>
        </div>

        {/* Step 4: Recipe Selection */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-semibold text-white">Adaptive Data Recipes</h3>
            </div>
            <span className="text-[11px] text-purple-400 font-mono">4 Selected</span>
          </div>
          <p className="text-xs text-slate-400">
            Select transformation recipes to calibrate high-density training data.
          </p>

          <div className="space-y-2 text-xs">
            {/* Deduplication */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="font-semibold text-white">Prompt Deduplication</span>
                <p className="text-[11px] text-slate-400">Collapses 6,680 duplicates to 320 unique clusters</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.deduplication}
                onChange={() => toggleRecipe('deduplication')}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            {/* Prompt Rephrasing */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="font-semibold text-white">Prompt Rephrasing</span>
                <p className="text-[11px] text-slate-400">Standardizes casing & structural clarity</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.rephrasing}
                onChange={() => toggleRecipe('rephrasing')}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            {/* Reasoning Traces */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="font-semibold text-white">Reasoning Traces</span>
                <p className="text-[11px] text-slate-400">Generates root cause & impact chain-of-thought</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.reasoning_traces}
                onChange={() => toggleRecipe('reasoning_traces')}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            {/* Hallucination Mitigation */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div>
                <span className="font-semibold text-white">Hallucination Mitigation</span>
                <p className="text-[11px] text-slate-400">Grounds completions directly on verbatim evidence</p>
              </div>
              <input
                type="checkbox"
                checked={recipes.hallucination_mitigation}
                onChange={() => toggleRecipe('hallucination_mitigation')}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Step 5: Blueprint Configuration */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-semibold text-white">Blueprint Controls</h3>
            </div>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-400">
            System constraints applied globally across all adapted dataset completions.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Brand Voice</label>
              <select
                value={blueprint.brand_voice}
                onChange={(e) => setBlueprint({ ...blueprint, brand_voice: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Professional & Empathetic">Professional & Empathetic</option>
                <option value="Direct & Tactical">Direct & Tactical</option>
                <option value="Executive Concierge">Executive Concierge</option>
                <option value="Technical Precision">Technical Precision</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Length Control</label>
              <select
                value={blueprint.length_control}
                onChange={(e) => setBlueprint({ ...blueprint, length_control: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
              >
                <option value="Concise">Concise (Under 250 chars)</option>
                <option value="Detailed">Detailed (Step-by-step)</option>
                <option value="Extensive">Extensive (Root cause + SOP)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Safety Classification</label>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px]">
                  Fraud Interception
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                  Phishing / Scam Alert
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px]">
                  Harassment Shield
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Adaption SDK Cloud Connector Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Official Adaption SDK Connector</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                  python library: adaption v0.14.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your personal Adaption Labs API Key to synchronize datasets and runs directly with the cloud platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter ADAPTION_API_KEY..."
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 w-full md:w-64 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleTestSdk}
              disabled={isTestingSdk}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap transition-all disabled:opacity-50"
            >
              {isTestingSdk ? 'Verifying...' : 'Verify SDK'}
            </button>
          </div>
        </div>

        {sdkStatus && (
          <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between ${
            sdkStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}>
            <span>{sdkStatus.message}</span>
            <span className="text-[11px] font-mono text-slate-400">{sdkStatus.fallback_mode || 'Cloud Connected'}</span>
          </div>
        )}
      </div>

      {/* Adaptation Results Banner & Quality Lift Comparison */}
      {runResult && (
        <div className="space-y-6">
          <div className="glass-panel-glow rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Adaptive Data Execution Results
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Dataset Lift & Quality Grade Transformation
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated before and after applying Prompt Deduplication, Rephrasing, and Reasoning Traces.
                </p>
              </div>

              {/* Side-by-Side Grade Lift */}
              <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pre-Adaption</span>
                  <div className="text-2xl font-black text-slate-400 font-mono mt-0.5">
                    {runResult.letter_grade_before}
                  </div>
                  <span className="text-xs font-mono text-slate-500">{runResult.quality_score_before} / 10</span>
                </div>

                <ArrowRight className="w-5 h-5 text-purple-400" />

                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Post-Adaption</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    {runResult.letter_grade_after}
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{runResult.quality_score_after} / 10</span>
                </div>

                <div className="border-l border-slate-800 pl-4 text-xs space-y-1 text-slate-300">
                  <div>
                    <span className="text-slate-500">Domain Rank: </span>
                    <span className="font-semibold text-purple-300 font-mono">{runResult.domain_percentile}th percentile</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Deduplication: </span>
                    <span className="font-semibold text-sky-400 font-mono">-{runResult.deduplication_reduction_pct}% Redundancy</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Signal Ratio: </span>
                    <span className="font-semibold text-white font-mono">{runResult.after_count} Distinct Clusters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Adapted Dataset Inspection Table & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of adapted clusters */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Adapted Feedback Clusters</h3>
              <p className="text-xs text-slate-400 mb-3">
                Select a cluster to inspect its synthesized reasoning trace and completion.
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {runResult.sample_adapted_rows?.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => setSelectedRow(row)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedRow?.id === row.id
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
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
            <div className="lg:col-span-7 glass-panel rounded-2xl p-5">
              {selectedRow ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                        Cluster #{selectedRow.id} Inspection
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {selectedRow.category} • {selectedRow.frequency} Customer Instances
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedRow.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      selectedRow.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}>
                      {selectedRow.severity}
                    </span>
                  </div>

                  {/* Original Raw Prompt */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Source Prompt (Customer Raw Feedback)
                    </span>
                    <p className="text-xs text-slate-200 font-medium italic">
                      "{selectedRow.source_prompt}"
                    </p>
                  </div>

                  {/* Rephrased Adapted Prompt */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                      Adapted Instruction Prompt (Recipe: Rephrased)
                    </span>
                    <p className="text-xs text-slate-200 font-mono">
                      {selectedRow.adapted_prompt}
                    </p>
                  </div>

                  {/* Reasoning Trace */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Adaption Reasoning Trace (Chain of Thought Diagnosis)
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {selectedRow.reasoning_trace}
                    </p>
                  </div>

                  {/* Blueprint Completion */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Target Completion (Blueprint: {blueprint.brand_voice})
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedRow.suggested_completion}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400 text-xs">
                  Select a cluster on the left to inspect its adaptation breakdown.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
