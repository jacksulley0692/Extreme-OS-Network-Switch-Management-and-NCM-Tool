import React, { useState } from "react";
import { Play, Save, Sparkles, Check, AlertCircle, FileCode, CheckCircle2, RefreshCw, Download, Copy } from "lucide-react";

interface ScriptSafetyAuditorProps {
  files: string[];
  code: string;
  fileName: string;
  onSelectFile: (name: string) => void;
  onCodeChange: (newCode: string) => void;
  onSaveScript: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function ScriptSafetyAuditor({
  files,
  code,
  fileName,
  onSelectFile,
  onCodeChange,
  onSaveScript,
  isSaving,
  saveSuccess,
}: ScriptSafetyAuditorProps) {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze code");
      setAnalysisResult(data);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to run safety analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div id="script-safety-auditor-root" className="space-y-6">
      {/* File Selector & Action Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              <span>Python Automation Script & Safety Auditor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect, modify, and audit the Python backup engines and report generators before deploying to Ubuntu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={fileName}
              onChange={(e) => onSelectFile(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 font-bold focus:outline-none focus:border-indigo-500"
            >
              {files.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>

            <button
              id="btn-download-active-script"
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
              title={`Download ${fileName} to your computer`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {fileName}</span>
            </button>

            <button
              id="btn-copy-active-script"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>

            <button
              onClick={onSaveScript}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}</span>
            </button>

            <button
              id="btn-run-ai-safety-audit"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all"
            >
              {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{analyzing ? "Auditing..." : "AI Audit"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Safety Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{fileName}</span>
            <span>{code.split("\n").length} lines</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none min-h-[500px]"
            spellCheck={false}
          />
        </div>

        {/* Audit & Structure Panel */}
        <div className="lg:col-span-5 space-y-4">
          {analysisResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-sm">Audit Findings & Quality Score</h3>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  Score: {analysisResult.codeQualityScore || 9}/10
                </span>
              </div>

              {analysisResult.purpose && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Script Purpose
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    {analysisResult.purpose}
                  </p>
                </div>
              )}

              {analysisResult.keyStrengths && (
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                    Key Strengths & Safety Measures
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80 list-disc list-inside">
                    {analysisResult.keyStrengths.map((s: string, idx: number) => (
                      <li key={idx} className="text-slate-300">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.recommendedNextSteps && (
                <div>
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                    Recommended Production Hardening
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80 list-disc list-inside">
                    {analysisResult.recommendedNextSteps.map((s: string, idx: number) => (
                      <li key={idx} className="text-slate-300">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400/60 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-200">AI Code Auditor Ready</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Run AI Safety Audit" above to analyze this script for unhandled exceptions, Extreme CLI syntax safety, and Linux migration readiness.
              </p>
            </div>
          )}

          {analysisError && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Audit Error</span>
                <span>{analysisError}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
