"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, AlertTriangle, Check, X, Loader2, FileSpreadsheet } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES } from "@/lib/data";
import { useVendorData } from "./VendorDataContext";

const STATUS_VALUES = ["available", "reserved", "rented", "maintenance", "hidden"];

/* Small CSV parser — handles quoted fields, escaped quotes and CRLF/LF. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

const HEADER_MAP = {
  name: "name",
  category: "category",
  subcategory: "subCategory",
  keywords: "keywords",
  tags: "tags",
  description: "description",
  material: "material",
  style: "style",
  era: "era",
  finish: "finish",
  color: "color",
  colour: "color",
  condition: "condition",
  h: "h", height: "h",
  w: "w", width: "w",
  d: "d", depth: "d",
  seat: "seat", seatheight: "seat",
  weight: "weight",
  price: "price", priceperday: "price", rentalprice: "price",
  deposit: "deposit", securitydeposit: "deposit",
  replacementvalue: "replacementValue",
  mindays: "minDays", minimumrentaldays: "minDays",
  maxdays: "maxDays", maximumrentaldays: "maxDays",
  qty: "qty", quantity: "qty",
  status: "status", availability: "status",
};

function normaliseHeader(h) {
  return h.trim().toLowerCase().replace(/[^a-z]/g, "");
}

function rowsToProps(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map(normaliseHeader).map((h) => HEADER_MAP[h] || null);
  return rows.slice(1).map((cells, i) => {
    const raw = {};
    headers.forEach((key, idx) => {
      if (key) raw[key] = (cells[idx] || "").trim();
    });

    const warnings = [];
    const name = raw.name || "";
    if (!name) warnings.push("Missing name — this row will be skipped.");

    let category = raw.category || "";
    const matched = CATEGORIES.find((c) => c.toLowerCase() === category.toLowerCase());
    if (category && !matched) warnings.push(`Unknown category "${category}" — defaulted to Miscellaneous.`);
    category = matched || (category ? "Miscellaneous" : CATEGORIES[0]);

    let status = (raw.status || "available").toLowerCase();
    if (!STATUS_VALUES.includes(status)) {
      warnings.push(`Unknown status "${raw.status}" — defaulted to available.`);
      status = "available";
    }

    return {
      rowNumber: i + 2,
      valid: Boolean(name),
      warnings,
      fields: {
        name, category,
        subCategory: raw.subCategory || "",
        keywords: raw.keywords || "",
        tags: raw.tags || "",
        description: raw.description || "",
        material: raw.material || "",
        finish: raw.finish || "",
        style: raw.style || "",
        era: raw.era || "",
        color: raw.color || "",
        condition: raw.condition || "Excellent",
        h: raw.h || "", w: raw.w || "", d: raw.d || "", seat: raw.seat || "",
        weight: raw.weight || "",
        price: raw.price || 0,
        deposit: raw.deposit || 0,
        replacementValue: raw.replacementValue || "",
        minDays: raw.minDays || 1,
        maxDays: raw.maxDays || 30,
        qty: raw.qty || 1,
        status,
      },
    };
  });
}

const TEMPLATE_CSV = `name,category,subCategory,material,style,era,finish,color,h,w,d,seat,weight,price,deposit,qty,status,description,keywords,tags
Mid-century Lounge Chair,Furniture,Chair,Walnut & Wool,Mid-century Modern,1960s,Oiled Walnut,Mustard Yellow,2'10",2'4",2'6",1'4",9 kg,350,1500,4,available,A classic low-back lounge chair.,walnut mid-century,period-drama boardroom
Brass Wall Sconce,Decor,Lighting,Brass & Glass,Art Deco,1930s,Antique Brass,Gold,1'0",0'6",0'4",,2 kg,150,600,10,available,Wall-mounted brass sconce.,brass sconce,wedding period
`;

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "propconnect-bulk-upload-template.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BulkUploadView() {
  const router = useRouter();
  const { addProp } = useVendorData();
  const fileRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState(null); // array of { rowNumber, valid, warnings, fields }
  const [parseError, setParseError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // { ok, failed: [{name, error}] }

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setParseError("");
    setResult(null);
    setParsed(null);
    if (!/\.csv$/i.test(file.name)) {
      setParseError("Please upload a .csv file — export your spreadsheet as CSV first.");
      return;
    }
    setFileName(file.name);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length < 2) {
        setParseError("That file doesn't have any data rows below the header.");
        return;
      }
      const items = rowsToProps(rows);
      if (items.length === 0) {
        setParseError("Couldn't find any usable rows in that file.");
        return;
      }
      setParsed(items);
    } catch (err) {
      setParseError(err?.message || "Couldn't read that file.");
    }
  };

  const removeRow = (rowNumber) => {
    setParsed((rows) => rows.filter((r) => r.rowNumber !== rowNumber));
  };

  const validRows = (parsed || []).filter((r) => r.valid);

  const upload = async () => {
    setUploading(true);
    setProgress(0);
    const failed = [];
    let ok = 0;
    for (const row of validRows) {
      try {
        await addProp(row.fields);
        ok++;
      } catch (err) {
        failed.push({ name: row.fields.name, error: err?.message || "Upload failed" });
      }
      setProgress((p) => p + 1);
    }
    setUploading(false);
    setResult({ ok, failed });
    setParsed(null);
  };

  const reset = () => {
    setFileName("");
    setParsed(null);
    setParseError("");
    setResult(null);
    setProgress(0);
  };

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Bulk upload</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>
        Import many props at once from a CSV file — preview and fix issues before anything goes live.
      </p>

      {result ? (
        <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <div className="flex items-start gap-3 rounded-xl p-4 mb-4" style={{ backgroundColor: "#DCEEE4" }}>
            <Check size={18} color="#1F7A52" className="mt-0.5 shrink-0" />
            <div className="text-sm" style={{ color: "#1F7A52" }}>
              <div style={{ fontWeight: 600 }}>{result.ok} of {result.ok + result.failed.length} props published to PropConnect.</div>
              {result.failed.length > 0 && (
                <div className="text-xs mt-1">{result.failed.length} row(s) failed — see below.</div>
              )}
            </div>
          </div>
          {result.failed.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {result.failed.map((f, i) => (
                <div key={i} className="text-xs flex items-start gap-2" style={{ color: C.highlight }}>
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" /> <strong>{f.name || "Unnamed row"}</strong> — {f.error}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/vendor/inventory")} className="rounded-full px-5 py-2.5 text-xs" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
              View inventory
            </button>
            <button onClick={reset} className="rounded-full px-5 py-2.5 text-xs" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
              Upload another file
            </button>
          </div>
        </div>
      ) : !parsed ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: C.white, border: `1.5px dashed ${C.line}` }}>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={pickFile} />
          <Upload size={26} color={C.secondary} className="mx-auto mb-3" />
          <h3 className="text-sm mb-1" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Upload a CSV of your props</h3>
          <p className="text-xs max-w-[360px] mx-auto mb-5" style={{ color: "#8AA2A6" }}>
            One row per prop. Only <strong>name</strong> is required — everything else can be filled in later from Inventory.
          </p>
          {parseError && (
            <div className="rounded-xl p-3 mb-4 text-xs max-w-[420px] mx-auto text-left" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{parseError}</div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => fileRef.current?.click()} className="rounded-full px-5 py-2.5 text-xs flex items-center gap-1.5" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
              <Upload size={14} /> Choose CSV file
            </button>
            <button onClick={downloadTemplate} className="rounded-full px-5 py-2.5 text-xs flex items-center gap-1.5" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
              <Download size={14} /> Download template
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>
              <FileSpreadsheet size={16} color={C.primary} /> {fileName}
              <span style={{ color: "#8AA2A6" }}>· {validRows.length} of {parsed.length} rows ready</span>
            </div>
            <button onClick={reset} className="text-xs" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>Start over</button>
          </div>

          <div className="rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${C.line}` }}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ fontFamily: "Jost, sans-serif" }}>
                <thead>
                  <tr style={{ backgroundColor: C.bg }}>
                    {["Row", "Name", "Category", "Price", "Qty", "Status", "Notes", ""].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 font-medium" style={{ color: "#6B8489" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r) => (
                    <tr key={r.rowNumber} style={{ borderTop: `1px solid ${C.line}`, opacity: r.valid ? 1 : 0.5 }}>
                      <td className="px-3 py-2.5" style={{ color: "#9AAEB1" }}>{r.rowNumber}</td>
                      <td className="px-3 py-2.5" style={{ color: C.ink }}>{r.fields.name || <em style={{ color: C.highlight }}>missing</em>}</td>
                      <td className="px-3 py-2.5" style={{ color: C.ink }}>{r.fields.category}</td>
                      <td className="px-3 py-2.5" style={{ color: C.ink }}>₹{r.fields.price || 0}</td>
                      <td className="px-3 py-2.5" style={{ color: C.ink }}>{r.fields.qty}</td>
                      <td className="px-3 py-2.5" style={{ color: C.ink }}>{r.fields.status}</td>
                      <td className="px-3 py-2.5">
                        {r.warnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-1" style={{ color: r.valid ? "#8a5f1c" : C.highlight }}>
                            <AlertTriangle size={11} className="mt-0.5 shrink-0" /> {w}
                          </div>
                        ))}
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => removeRow(r.rowNumber)} title="Remove row" style={{ color: "#9AAEB1" }}>
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {uploading ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>
              <Loader2 size={16} className="animate-spin" /> Uploading {progress} of {validRows.length}…
            </div>
          ) : (
            <button
              onClick={upload}
              disabled={validRows.length === 0}
              className="rounded-full px-5 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-40"
              style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
            >
              <Check size={14} /> Upload {validRows.length} prop{validRows.length === 1 ? "" : "s"} to PropConnect
            </button>
          )}
        </div>
      )}
    </div>
  );
}
