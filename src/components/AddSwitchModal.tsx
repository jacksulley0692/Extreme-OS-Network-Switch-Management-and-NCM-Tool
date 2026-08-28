// src/components/AddSwitchModal.tsx
import React, { useState, useMemo } from "react";
import { 
  Plus, 
  X, 
  Server, 
  Building2, 
  Network, 
  ShieldCheck, 
  Cpu, 
  Check, 
  AlertCircle,
  Radio,
  FileCode2,
  HardDrive
} from "lucide-react";
import { SwitchItem, SwitchOS, AuthUser } from "../types";

interface AddSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSite?: string;
  allSites?: string[];
  onSwitchAdded: (newSwitch: SwitchItem) => void;
  currentUser?: AuthUser | null;
}

export const AddSwitchModal: React.FC<AddSwitchModalProps> = ({
  isOpen,
  onClose,
  defaultSite = "",
  allSites = [],
  onSwitchAdded,
  currentUser
}) => {
  const [site, setSite] = useState<string>(defaultSite || "Amsterdam");
  const [customSite, setCustomSite] = useState<string>("");
  const [isCustomSite, setIsCustomSite] = useState<boolean>(false);
  const [hostname, setHostname] = useState<string>("");
  const [ip, setIp] = useState<string>("");
  const [os, setOs] = useState<SwitchOS>("EXOS");
  const [model, setModel] = useState<string>("Summit X440-G2-24p-10G");
  const [primaryVlan, setPrimaryVlan] = useState<number>(10);
  const [gateway, setGateway] = useState<string>("");
  const [uplinkPorts, setUplinkPorts] = useState<string>("1:49, 1:50");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Sync default site if changed
  React.useEffect(() => {
    if (defaultSite) {
      setSite(defaultSite);
      setIsCustomSite(false);
    }
  }, [defaultSite]);

  // Auto infer gateway when IP changes
  const handleIpChange = (newIp: string) => {
    setIp(newIp);
    const trimmed = newIp.trim();
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(trimmed)) {
      const octets = trimmed.split(".");
      const subnet = octets.slice(0, 3).join(".");
      if (!gateway || gateway.startsWith(subnet)) {
        setGateway(`${subnet}.1`);
      }
      if (!primaryVlan || primaryVlan === 10) {
        setPrimaryVlan(Number(octets[2]) || 10);
      }
    }
  };

  const effectiveSite = isCustomSite ? customSite.trim() : site;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!effectiveSite) {
      setErrorMsg("Please select or enter a valid Site name.");
      return;
    }
    if (!hostname.trim()) {
      setErrorMsg("Hostname is required (e.g. DLC-Amsterdam-Spa-2).");
      return;
    }
    const cleanIp = ip.trim();
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleanIp)) {
      setErrorMsg("Please enter a valid IPv4 address (e.g. 10.2.7.248).");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedUplinks = uplinkPorts.split(",").map((p) => p.trim()).filter(Boolean);
      const res = await fetch("/api/switches/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: effectiveSite,
          hostname: hostname.trim(),
          ip: cleanIp,
          os,
          model,
          primaryVlan: Number(primaryVlan) || 10,
          gateway: gateway.trim() || undefined,
          uplinkPorts: parsedUplinks.length > 0 ? parsedUplinks : ["1:49", "1:50"]
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Switch ${hostname} (${cleanIp}) saved successfully!`);
        if (data.switch) {
          onSwitchAdded(data.switch);
        }
        setTimeout(() => {
          onClose();
          setHostname("");
          setIp("");
          setSuccessMsg("");
        }, 1200);
      } else {
        setErrorMsg(data.error || "Failed to add switch.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while saving switch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        id="modal-add-switch"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Add Network Switch</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fleet Inventory
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Enroll a new EXOS/VOSS hardware switch with automatic site linking &amp; config generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Site Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Site Assignment</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomSite(!isCustomSite)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                {isCustomSite ? "Select from list" : "+ Create new site"}
              </button>
            </div>

            {isCustomSite ? (
              <input
                type="text"
                placeholder="Enter Site Name (e.g. Amsterdam, York, Aberdeen)"
                value={customSite}
                onChange={(e) => setCustomSite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            ) : (
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {allSites.length > 0 ? (
                  allSites.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Amsterdam">Amsterdam</option>
                    <option value="Aberdeen">Aberdeen</option>
                    <option value="Acton Park">Acton Park</option>
                    <option value="Antwerp">Antwerp</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Beckenham">Beckenham</option>
                    <option value="Belfast">Belfast</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Bolton">Bolton</option>
                    <option value="Brighton">Brighton</option>
                    <option value="Briston Long Ashton">Briston Long Ashton</option>
                    <option value="Bristol Westbury">Bristol Westbury</option>
                    <option value="Leeds">Leeds</option>
                    <option value="York">York</option>
                  </>
                )}
              </select>
            )}
          </div>

          {/* Hostname & IP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch Hostname</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DLC-Amsterdam-Spa-2"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>IPv4 Management Address</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10.2.7.248"
                value={ip}
                onChange={(e) => handleIpChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* OS & Hardware Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Operating System</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOs("EXOS")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    os === "EXOS"
                      ? "bg-purple-600/30 border-purple-500 text-purple-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>EXOS (Summit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOs("VOSS")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    os === "VOSS"
                      ? "bg-purple-600/30 border-purple-500 text-purple-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>VOSS (VSP)</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Hardware Model</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {os === "EXOS" ? (
                  <>
                    <option value="Summit X440-G2-24p-10G">Summit X440-G2-24p-10G</option>
                    <option value="Summit X440-G2-48p-10G">Summit X440-G2-48p-10G</option>
                    <option value="Summit X460-G2-24p-10GE4">Summit X460-G2-24p-10GE4 (Core)</option>
                    <option value="Summit X460-G2-48p-10GE4">Summit X460-G2-48p-10GE4 (Core)</option>
                    <option value="Summit X440-24t">Summit X440-24t Legacy</option>
                    <option value="Summit X450-G2">Summit X450-G2</option>
                  </>
                ) : (
                  <>
                    <option value="VSP 4850GTS-PWR+">VSP 4850GTS-PWR+ (Fabric Core)</option>
                    <option value="VSP 7200 Series">VSP 7200 High-Capacity Core</option>
                    <option value="VSP 4450GSX-PWR+">VSP 4450GSX-PWR+ Fiber</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Gateway & Primary VLAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Gateway</label>
              <input
                type="text"
                placeholder="e.g. 10.2.7.1"
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary VLAN ID</label>
              <input
                type="number"
                placeholder="10"
                value={primaryVlan}
                onChange={(e) => setPrimaryVlan(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {/* Uplink Ports */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Uplink Fiber Ports (Comma separated)</label>
            <input
              type="text"
              placeholder="1:49, 1:50"
              value={uplinkPorts}
              onChange={(e) => setUplinkPorts(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Enrolling Switch..." : "Enroll Switch"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
