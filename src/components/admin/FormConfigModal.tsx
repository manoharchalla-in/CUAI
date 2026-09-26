"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Loader2, GripVertical, CheckCircle2 } from "lucide-react";
import type { FormConfig } from "@/lib/db/schema";

interface FormConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderSlug: string;
  folderName: string;
}

export default function FormConfigModal({
  isOpen,
  onClose,
  folderSlug,
  folderName,
}: FormConfigModalProps) {
  const [configs, setConfigs] = useState<FormConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadConfigs() {
      if (!folderSlug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/folders/${folderSlug}/form-config`);
        const data = await res.json();
        if (data.configs) {
          setConfigs(data.configs);
        }
      } catch (err: any) {
        setError("Failed to load form fields");
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadConfigs();
      setSuccess(false);
      setError("");
    }
  }, [folderSlug, isOpen]);

  if (!isOpen) return null;

  const handleAddField = () => {
    const newField: FormConfig = {
      id: `fc_custom_${Date.now()}`,
      folder_id: "",
      field_name: `custom_field_${configs.length + 1}`,
      field_label: `New Field ${configs.length + 1}`,
      field_type: "text",
      is_required: 0,
      options_json: "[]",
      display_order: configs.length + 1,
    };
    setConfigs([...configs, newField]);
  };

  const handleFieldChange = (index: number, key: keyof FormConfig, value: any) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], [key]: value };
    setConfigs(updated);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    const updated = configs.map((field) => ({
      ...field,
      is_required: checked ? 1 : 0,
    }));
    setConfigs(updated);
  };

  const allSelected = configs.length > 0 && configs.every((f) => f.is_required === 1);
  const someSelected = configs.some((f) => f.is_required === 1) && !allSelected;
  const requiredCount = configs.filter((f) => f.is_required === 1).length;

  const handleRemoveField = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/folders/${folderSlug}/form-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#e3e4e8] rounded-2xl w-full max-w-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e4e8] flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
              Dynamic Form Builder &bull; {folderName}
            </h3>
            <p className="text-xs text-[#8a8a8e]">
              Customize the registration fields students will see on <code className="text-[#0a0a0a] font-mono bg-[#f5f5f7] border border-[#e3e4e8] px-1.5 py-0.5 rounded-md">/forms/{folderSlug}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-[#0a0a0a] hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] text-xs flex items-center gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a66ff]" />
              Form configuration updated and active immediately!
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#8a8a8e]">
              <Loader2 className="w-6 h-6 animate-spin text-[#0a66ff] mb-2" />
              <p className="text-xs">Loading fields...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All / Bulk Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[#f5f5f7] border border-[#e3e4e8] rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0a0a0a]">Form Fields ({configs.length})</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#e3e4e8] text-[#0a0a0a] font-medium shadow-2xs">
                    {requiredCount} of {configs.length} Required
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#fafafc] cursor-pointer text-[#0a0a0a] font-semibold select-none shadow-2xs transition-all">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someSelected;
                        }
                      }}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                    />
                    <span>Select All (Required)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#fafafc] text-[#0a66ff] hover:text-[#0051cc] font-semibold text-xs transition-all shadow-2xs"
                  >
                    Check All
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSelectAll(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e3e4e8] hover:bg-[#fafafc] text-[#8a8a8e] hover:text-rose-600 font-medium text-xs transition-all shadow-2xs"
                  >
                    Uncheck All
                  </button>
                </div>
              </div>
              {configs.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e3e4e8] flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <span className="w-5 text-center text-[#8a8a8e] font-mono font-semibold">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={field.field_label}
                      onChange={(e) => handleFieldChange(idx, "field_label", e.target.value)}
                      placeholder="Field Label"
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] placeholder-[#8a8a8e] focus:outline-none focus:border-[#0a66ff] focus:ring-2 focus:ring-[#0a66ff]/10 font-medium transition-all"
                    />

                    <input
                      type="text"
                      value={field.field_name}
                      onChange={(e) => handleFieldChange(idx, "field_name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                      placeholder="field_key"
                      className="w-32 px-3 py-2 rounded-xl bg-[#f5f5f7] border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-mono text-xs transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <select
                      value={field.field_type}
                      onChange={(e) => handleFieldChange(idx, "field_type", e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#e3e4e8] text-[#0a0a0a] focus:outline-none focus:border-[#0a66ff] font-medium"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-[#0a0a0a] cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={field.is_required === 1}
                        onChange={(e) => handleFieldChange(idx, "is_required", e.target.checked ? 1 : 0)}
                        className="w-4 h-4 rounded border-[#e3e4e8] accent-[#0a0a0a]"
                      />
                      <span>Required</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      className="p-1.5 rounded-lg text-[#8a8a8e] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddField}
                className="w-full py-3 rounded-xl border border-dashed border-[#e3e4e8] hover:border-[#0a0a0a] text-[#8a8a8e] hover:text-[#0a0a0a] text-xs font-semibold flex items-center justify-center gap-2 transition-colors bg-white hover:bg-[#fafafc]"
              >
                <Plus className="w-4 h-4" />
                Add Custom Field
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e3e4e8] flex items-center justify-between flex-shrink-0 bg-[#fafafc]">
          <span className="text-[11px] text-[#8a8a8e] font-medium">
            {configs.length} configured fields
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl bg-white hover:bg-[#fafafc] border border-[#e3e4e8] text-[#0a0a0a] text-xs font-semibold shadow-2xs active:scale-[0.98] transition-all"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 rounded-xl bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] hover:from-[#2c2c2e] hover:to-[#1c1c1e] text-white text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.12)] active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Form Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
