import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Sliders, Type, Image as ImageIcon, Shapes, Layers,
  LayoutGrid, QrCode, Plus, Minus, Settings,
  Undo2, Redo2, Eye, Cloud, ChevronRight, Search, X,
  Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates as templatesApi, uploads as uploadsApi } from "@/api";
import { getTemplatesSocket } from "@/api/socket";

// ─── Constants ─────────────────────────────────────────────────────────────

const TOOLS = [
  { id: "product", label: "Product options", icon: Sliders },
  { id: "text", label: "Text", icon: Type },
  { id: "uploads", label: "Uploads", icon: ImageIcon },
  { id: "graphics", label: "Graphics", icon: Shapes },
  { id: "background", label: "Background", icon: Layers },
  { id: "template", label: "Template", icon: LayoutGrid },
  { id: "qr", label: "QR-codes", icon: QrCode },
  { id: "more", label: "More", icon: Plus },
];

const CARD_RATIO = { w: 9.19, h: 5.38 }; // cm — Vistaprint standard visiting card
const PX_PER_CM = 56; // base scale at 100% zoom

// Predefined background colors — derived from the #1a56db brand
const BG_COLORS = [
  "#ffffff", "#0e1426", "#1a56db", "#11317f", "#eaf0fb", "#c9d8f4",
  "#db1a3f", "#1adb98", "#f5b800", "#5f6b85", "#f3f5fa", "#fff4d6",
];

// Predefined shapes
const SHAPES = [
  { id: "rect", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "triangle", label: "Triangle" },
  { id: "line", label: "Line" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
];

// Built-in fallback templates — used when the API is unreachable so the studio
// is never empty during dev or in offline mode. Live data from the server
// supersedes these once the fetch completes.
const FALLBACK_TEMPLATES = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    category: "Professional",
    bg: "#ffffff",
    layers: [
      { type: "shape", shape: "rect", x: 0, y: 0, w: 515, h: 8, fill: "#1a56db" },
      { type: "shape", shape: "rect", x: 0, y: 293, w: 515, h: 8, fill: "#1a56db" },
      { type: "text", x: 32, y: 70, w: 360, h: 36, text: "YOUR NAME", fontSize: 26, color: "#1a56db", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 32, y: 108, w: 360, h: 22, text: "JOB TITLE · COMPANY", fontSize: 11, color: "#6b6b6b", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 200, w: 220, h: 18, text: "+91 98765 43210", fontSize: 11, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 220, w: 240, h: 18, text: "name@company.com", fontSize: 11, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 240, w: 240, h: 18, text: "www.company.com", fontSize: 11, color: "#333333", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "bold-dark",
    name: "Bold Black",
    category: "Modern",
    bg: "#0a0a0a",
    layers: [
      { type: "text", x: 32, y: 60, w: 360, h: 32, text: "YOUR NAME", fontSize: 24, color: "#ffd000", align: "left", bold: true, italic: false, underline: false },
      { type: "shape", shape: "line", x: 32, y: 100, w: 60, h: 4, fill: "#ffd000" },
      { type: "text", x: 32, y: 116, w: 360, h: 20, text: "Job Title", fontSize: 12, color: "#ffffff", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 210, w: 360, h: 16, text: "+91 98765 43210", fontSize: 10, color: "#bbbbbb", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 228, w: 360, h: 16, text: "hello@company.com", fontSize: 10, color: "#bbbbbb", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 246, w: 360, h: 16, text: "yourwebsite.com", fontSize: 10, color: "#bbbbbb", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "left-stripe",
    name: "Left Stripe",
    category: "Professional",
    bg: "#ffffff",
    layers: [
      { type: "shape", shape: "rect", x: 0, y: 0, w: 110, h: 301, fill: "#cc0000" },
      { type: "text", x: 28, y: 130, w: 70, h: 30, text: "LOGO", fontSize: 16, color: "#ffffff", align: "center", bold: true, italic: false, underline: false },
      { type: "text", x: 140, y: 70, w: 340, h: 32, text: "Your Name", fontSize: 22, color: "#0a0a0a", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 140, y: 104, w: 340, h: 18, text: "Job Title · Company", fontSize: 11, color: "#cc0000", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 140, y: 200, w: 340, h: 16, text: "Phone +91 98765 43210", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 140, y: 218, w: 340, h: 16, text: "Email name@company.com", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 140, y: 236, w: 340, h: 16, text: "Web www.company.com", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "minimal-center",
    name: "Minimal Centered",
    category: "Minimal",
    bg: "#fafafa",
    layers: [
      { type: "text", x: 32, y: 100, w: 450, h: 40, text: "Your Name", fontSize: 30, color: "#111111", align: "center", bold: true, italic: false, underline: false },
      { type: "shape", shape: "line", x: 215, y: 152, w: 80, h: 2, fill: "#111111" },
      { type: "text", x: 32, y: 164, w: 450, h: 20, text: "JOB TITLE", fontSize: 11, color: "#6b6b6b", align: "center", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 230, w: 450, h: 18, text: "+91 98765 43210  ·  name@company.com", fontSize: 11, color: "#333333", align: "center", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "diagonal",
    name: "Diagonal Accent",
    category: "Modern",
    bg: "#ffffff",
    layers: [
      { type: "shape", shape: "triangle", x: 0, y: 0, w: 220, h: 301, fill: "#008060" },
      { type: "text", x: 240, y: 70, w: 250, h: 32, text: "Your Name", fontSize: 22, color: "#111111", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 240, y: 104, w: 250, h: 18, text: "Job Title", fontSize: 11, color: "#008060", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 240, y: 200, w: 250, h: 16, text: "+91 98765 43210", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 240, y: 218, w: 250, h: 16, text: "name@company.com", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 240, y: 236, w: 250, h: 16, text: "company.com", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "elegant-gold",
    name: "Elegant Gold",
    category: "Premium",
    bg: "#0e1a2b",
    layers: [
      { type: "shape", shape: "rect", x: 32, y: 32, w: 451, h: 1, fill: "#d4af37" },
      { type: "shape", shape: "rect", x: 32, y: 268, w: 451, h: 1, fill: "#d4af37" },
      { type: "text", x: 32, y: 92, w: 451, h: 40, text: "YOUR NAME", fontSize: 26, color: "#d4af37", align: "center", bold: true, italic: false, underline: false },
      { type: "text", x: 32, y: 138, w: 451, h: 20, text: "FOUNDER & CEO", fontSize: 10, color: "#ffffff", align: "center", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 210, w: 451, h: 16, text: "+91 98765 43210", fontSize: 10, color: "#cccccc", align: "center", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 228, w: 451, h: 16, text: "name@company.com", fontSize: 10, color: "#cccccc", align: "center", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "creative-coral",
    name: "Creative Coral",
    category: "Creative",
    bg: "#fef3ec",
    layers: [
      { type: "shape", shape: "circle", x: 360, y: -80, w: 240, h: 240, fill: "#ff7a59" },
      { type: "shape", shape: "circle", x: -60, y: 200, w: 180, h: 180, fill: "#ffd6c4" },
      { type: "text", x: 32, y: 70, w: 320, h: 32, text: "Your Name", fontSize: 24, color: "#0a0a0a", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 32, y: 104, w: 320, h: 18, text: "Creative Designer", fontSize: 12, color: "#ff7a59", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 32, y: 210, w: 320, h: 16, text: "+91 98765 43210", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 228, w: 320, h: 16, text: "hello@brand.com", fontSize: 10, color: "#333333", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "footer-bar",
    name: "Footer Bar",
    category: "Professional",
    bg: "#ffffff",
    layers: [
      { type: "text", x: 32, y: 60, w: 451, h: 36, text: "Your Name", fontSize: 26, color: "#1a56db", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 32, y: 100, w: 451, h: 20, text: "Job Title  |  Company Name", fontSize: 11, color: "#6b6b6b", align: "left", bold: false, italic: false, underline: false },
      { type: "shape", shape: "rect", x: 0, y: 240, w: 515, h: 61, fill: "#1a56db" },
      { type: "text", x: 32, y: 254, w: 451, h: 16, text: "+91 98765 43210   ·   name@company.com", fontSize: 10, color: "#ffffff", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 32, y: 274, w: 451, h: 16, text: "www.company.com", fontSize: 10, color: "#ffd000", align: "left", bold: false, italic: false, underline: false },
    ],
  },
  {
    id: "split-half",
    name: "Split Half",
    category: "Modern",
    bg: "#ffffff",
    layers: [
      { type: "shape", shape: "rect", x: 0, y: 0, w: 257, h: 301, fill: "#1a56db" },
      { type: "text", x: 24, y: 90, w: 220, h: 36, text: "Your Name", fontSize: 22, color: "#ffffff", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 24, y: 128, w: 220, h: 18, text: "Job Title", fontSize: 11, color: "#ffffff", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 277, y: 110, w: 220, h: 18, text: "PHONE", fontSize: 9, color: "#999999", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 277, y: 128, w: 220, h: 16, text: "+91 98765 43210", fontSize: 10, color: "#111111", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 277, y: 158, w: 220, h: 18, text: "EMAIL", fontSize: 9, color: "#999999", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 277, y: 176, w: 220, h: 16, text: "hello@brand.com", fontSize: 10, color: "#111111", align: "left", bold: false, italic: false, underline: false },
      { type: "text", x: 277, y: 206, w: 220, h: 18, text: "WEB", fontSize: 9, color: "#999999", align: "left", bold: true, italic: false, underline: false },
      { type: "text", x: 277, y: 224, w: 220, h: 16, text: "brand.com", fontSize: 10, color: "#111111", align: "left", bold: false, italic: false, underline: false },
    ],
  },
];

const TEMPLATE_CATEGORIES = ["All", "Professional", "Modern", "Minimal", "Creative", "Premium"];

// ─── Utilities ─────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Designer Page ─────────────────────────────────────────────────────────

export default function Designer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productName = searchParams.get("product") || "Standard Visiting Cards";

  // Editor state — start on the Template panel so users get a head start
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") || "template");
  const [activeFace, setActiveFace] = useState("front"); // 'front' | 'back'
  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(false);

  // Live template list — fetched on mount, kept in sync via Socket.IO.
  // Until the fetch resolves, fall back to the built-in seed list so the
  // template picker is never momentarily empty on first paint.
  const [liveTemplates, setLiveTemplates] = useState(FALLBACK_TEMPLATES);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await templatesApi.list({ limit: 100 });
        if (cancelled) return;
        if (Array.isArray(list) && list.length > 0) setLiveTemplates(list);
        setTemplatesLoaded(true);
      } catch {
        // API unreachable — keep the fallback list.
        setTemplatesLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Live updates: prepend new templates, replace updated ones, drop deletes.
  useEffect(() => {
    const sock = getTemplatesSocket();
    if (!sock) return;
    const onCreated = (tpl) => setLiveTemplates((prev) => [tpl, ...prev.filter((t) => t.id !== tpl.id)]);
    const onUpdated = (tpl) => setLiveTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)));
    const onDeleted = ({ id }) => setLiveTemplates((prev) => prev.filter((t) => t.id !== id));
    sock.on("template:created", onCreated);
    sock.on("template:updated", onUpdated);
    sock.on("template:deleted", onDeleted);
    return () => {
      sock.off("template:created", onCreated);
      sock.off("template:updated", onUpdated);
      sock.off("template:deleted", onDeleted);
    };
  }, []);

  // Faces hold layers independently
  const [faces, setFaces] = useState({
    front: { background: "#ffffff", layers: [] },
    back: { background: "#ffffff", layers: [] },
  });

  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // History (undo/redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((next) => {
    setHistory((h) => {
      const trimmed = h.slice(0, historyIndex + 1);
      return [...trimmed, next];
    });
    setHistoryIndex((i) => i + 1);
  }, [historyIndex]);

  const updateFaces = (updater) => {
    setFaces((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      pushHistory(next);
      return next;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setFaces(history[historyIndex - 1]);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setFaces(history[historyIndex + 1]);
    }
  };

  const activeData = faces[activeFace];
  const selectedLayer = activeData.layers.find((l) => l.id === selectedLayerId);

  // Layer ops
  const addLayer = (layer) => {
    updateFaces((f) => ({
      ...f,
      [activeFace]: { ...f[activeFace], layers: [...f[activeFace].layers, layer] },
    }));
    setSelectedLayerId(layer.id);
  };

  const updateLayer = (id, patch) => {
    updateFaces((f) => ({
      ...f,
      [activeFace]: {
        ...f[activeFace],
        layers: f[activeFace].layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      },
    }));
  };

  const removeLayer = (id) => {
    updateFaces((f) => ({
      ...f,
      [activeFace]: { ...f[activeFace], layers: f[activeFace].layers.filter((l) => l.id !== id) },
    }));
    setSelectedLayerId(null);
  };

  const duplicateLayer = (id) => {
    const layer = activeData.layers.find((l) => l.id === id);
    if (!layer) return;
    const copy = { ...layer, id: uid(), x: layer.x + 20, y: layer.y + 20 };
    addLayer(copy);
  };

  const setBackground = (color) => {
    updateFaces((f) => ({
      ...f,
      [activeFace]: { ...f[activeFace], background: color },
    }));
  };

  // Canvas drag + viewport (for wheel-zoom)
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const dragState = useRef(null);

  // Wheel zoom (Ctrl/Cmd + scroll for fine control; plain scroll over canvas also zooms)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      // Only zoom when modifier is held OR cursor is directly over the card
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setZoom((z) => Math.max(25, Math.min(400, z + delta)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onLayerMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedLayerId(id);
    const layer = activeData.layers.find((l) => l.id === id);
    if (!layer) return;
    const rect = canvasRef.current.getBoundingClientRect();
    dragState.current = {
      id,
      offsetX: e.clientX - rect.left - layer.x,
      offsetY: e.clientY - rect.top - layer.y,
    };
    const onMove = (ev) => {
      if (!dragState.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      const nx = ev.clientX - r.left - dragState.current.offsetX;
      const ny = ev.clientY - r.top - dragState.current.offsetY;
      updateLayer(dragState.current.id, { x: nx, y: ny });
    };
    const onUp = () => {
      dragState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedLayerId) { e.preventDefault(); removeLayer(selectedLayerId); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayerId, historyIndex, history]);

  // Add helpers
  const addText = () => {
    addLayer({
      id: uid(),
      type: "text",
      x: 120, y: 80,
      w: 240, h: 40,
      text: "Your text here",
      fontSize: 20,
      color: "#111111",
      align: "left",
      bold: false,
      italic: false,
      underline: false,
    });
    setActiveTool("text");
  };

  const addShape = (shape) => {
    addLayer({
      id: uid(),
      type: "shape",
      shape,
      x: 140, y: 100,
      w: 100, h: 100,
      fill: "#1a56db",
    });
  };

  const addImage = (src) => {
    addLayer({
      id: uid(),
      type: "image",
      x: 120, y: 80,
      w: 200, h: 140,
      src,
    });
  };

  const applyTemplate = (tpl) => {
    updateFaces((f) => ({
      ...f,
      [activeFace]: {
        background: tpl.bg,
        layers: tpl.layers.map((l) => ({ ...l, id: uid() })),
      },
    }));
    setSelectedLayerId(null);
  };

  // ── Upload helper passed to UploadsPanel + QRPanel ─────────────────────
  // Sends to /api/v1/uploads which proxies to ImgBB. Returns the public URL.
  const uploadImageAndPlace = async (file) => {
    try {
      const result = await uploadsApi.uploadImage({ file });
      addImage(result.url);
      return result;
    } catch (err) {
      // Local fallback so the studio is still usable offline.
      const localUrl = URL.createObjectURL(file);
      addImage(localUrl);
      return { url: localUrl, _local: true, error: err?.message };
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const canvasW = CARD_RATIO.w * PX_PER_CM * (zoom / 100);
  const canvasH = CARD_RATIO.h * PX_PER_CM * (zoom / 100);

  return (
    <div className="h-screen bg-surface flex flex-col overflow-hidden font-body text-text-dark">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-border-light flex items-center px-3 gap-3 shrink-0">
        <Link to="/" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-vp-blue text-white flex items-center justify-center font-bold text-base rounded-sm">P</div>
          <span className="font-bold text-[16px] text-vp-blue hidden sm:inline">Pune Prints</span>
        </Link>
        <div className="h-6 w-px bg-border-light hidden sm:block" />
        <span className="text-[14px] font-semibold text-text-dark truncate">{productName}</span>

        <div className="ml-3 hidden md:flex items-center gap-1 text-[12px] text-text-light">
          <Cloud size={14} />
          <span>Saved</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="w-9 h-9 flex items-center justify-center text-text-dark hover:bg-surface rounded-sm disabled:opacity-30"
            aria-label="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="w-9 h-9 flex items-center justify-center text-text-dark hover:bg-surface rounded-sm disabled:opacity-30"
            aria-label="Redo"
          >
            <Redo2 size={18} />
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="ml-2 flex items-center gap-1.5 px-3 h-9 text-[13px] font-medium text-text-dark hover:bg-surface rounded-sm"
          >
            <Eye size={16} /> Preview
          </button>

          <Button
            size="sm"
            className="ml-1"
            onClick={() => navigate("/cart")}
          >
            Next
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left tool rail */}
        <nav className="w-[72px] bg-white border-r border-border-light flex flex-col items-stretch py-2 shrink-0">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`flex flex-col items-center justify-center py-3 mx-1 rounded-sm transition-colors ${
                  active ? "bg-vp-blue-light text-vp-blue" : "text-text-dark hover:bg-surface"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span className="text-[10px] font-medium mt-1 leading-tight text-center px-1">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Properties panel */}
        <aside className="w-[280px] bg-white border-r border-border-light overflow-y-auto shrink-0">
          <ToolPanel
            tool={activeTool}
            onAddText={addText}
            onAddShape={addShape}
            onAddImage={addImage}
            uploadImage={uploadImageAndPlace}
            setBackground={setBackground}
            currentBg={activeData.background}
            applyTemplate={applyTemplate}
            templates={liveTemplates}
            templatesLoaded={templatesLoaded}
            selectedLayer={selectedLayer}
            updateLayer={updateLayer}
          />
        </aside>

        {/* Canvas area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-surface">
          {/* Layer toolbar (when something selected) */}
          {selectedLayer && (
            <div className="bg-white border-b border-border-light px-4 py-2 flex items-center gap-2">
              {selectedLayer.type === "text" && (
                <>
                  <select
                    value={selectedLayer.fontSize}
                    onChange={(e) => updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                    className="h-8 border border-border rounded-sm px-2 text-[13px]"
                  >
                    {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60].map((s) => (
                      <option key={s} value={s}>{s}px</option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={selectedLayer.color}
                    onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                    className="w-8 h-8 border border-border rounded-sm cursor-pointer"
                  />
                  <div className="h-6 w-px bg-border-light" />
                  <button onClick={() => updateLayer(selectedLayer.id, { bold: !selectedLayer.bold })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.bold ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><Bold size={14} /></button>
                  <button onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.italic ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><Italic size={14} /></button>
                  <button onClick={() => updateLayer(selectedLayer.id, { underline: !selectedLayer.underline })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.underline ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><Underline size={14} /></button>
                  <div className="h-6 w-px bg-border-light" />
                  <button onClick={() => updateLayer(selectedLayer.id, { align: "left" })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.align === "left" ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><AlignLeft size={14} /></button>
                  <button onClick={() => updateLayer(selectedLayer.id, { align: "center" })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.align === "center" ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><AlignCenter size={14} /></button>
                  <button onClick={() => updateLayer(selectedLayer.id, { align: "right" })} className={`w-8 h-8 rounded-sm flex items-center justify-center ${selectedLayer.align === "right" ? "bg-vp-blue-light text-vp-blue" : "hover:bg-surface"}`}><AlignRight size={14} /></button>
                </>
              )}
              {selectedLayer.type === "shape" && (
                <>
                  <span className="text-[12px] text-text-light">Fill</span>
                  <input
                    type="color"
                    value={selectedLayer.fill}
                    onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                    className="w-8 h-8 border border-border rounded-sm cursor-pointer"
                  />
                </>
              )}
              <div className="ml-auto flex items-center gap-1">
                <button onClick={() => duplicateLayer(selectedLayer.id)} className="w-8 h-8 rounded-sm flex items-center justify-center hover:bg-surface" aria-label="Duplicate">
                  <Copy size={14} />
                </button>
                <button onClick={() => removeLayer(selectedLayer.id)} className="w-8 h-8 rounded-sm flex items-center justify-center hover:bg-vp-red-light text-text-dark hover:text-vp-red" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Canvas viewport */}
          <div
            ref={viewportRef}
            className="flex-1 overflow-auto flex items-center justify-center p-8 relative"
          >
            {/* Safety/bleed labels */}
            <div className="absolute top-4 right-4 lg:right-24 flex items-center gap-1.5 z-10">
              <span className="px-2 py-0.5 text-[11px] font-medium bg-green-50 text-vp-green border border-vp-green/30 rounded-sm">Safety Area</span>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-vp-blue-light text-vp-blue border border-vp-blue/30 rounded-sm">Bleed</span>
            </div>

            <div className="relative" style={{ width: canvasW + 80, height: canvasH + 80 }}>
              {/* Dimension labels */}
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full text-[10px] text-text-light pr-2 whitespace-nowrap">{CARD_RATIO.h}cm</span>
              <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 translate-y-full text-[10px] text-text-light pt-2 whitespace-nowrap">{CARD_RATIO.w}cm</span>

              {/* Card */}
              <div
                ref={canvasRef}
                onMouseDown={() => setSelectedLayerId(null)}
                className="absolute top-10 left-10 shadow-card-hover overflow-hidden cursor-default"
                style={{
                  width: canvasW,
                  height: canvasH,
                  background: activeData.background,
                  border: "1px solid #d6d6d6",
                }}
              >
                {/* Bleed boundary (outer) */}
                <div className="absolute inset-0 pointer-events-none border-2 border-vp-blue/40 border-dashed" />
                {/* Safety area (inner) */}
                <div className="absolute pointer-events-none border-2 border-vp-green/50 border-dashed" style={{ top: 12, left: 12, right: 12, bottom: 12 }} />

                {/* Layers */}
                {activeData.layers.map((layer) => (
                  <LayerView
                    key={layer.id}
                    layer={layer}
                    selected={selectedLayerId === layer.id}
                    onMouseDown={(e) => onLayerMouseDown(e, layer.id)}
                    onTextChange={(text) => updateLayer(layer.id, { text })}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right face switcher */}
          <FaceSwitcher
            activeFace={activeFace}
            setActiveFace={(f) => { setActiveFace(f); setSelectedLayerId(null); }}
            frontBg={faces.front.background}
            backBg={faces.back.background}
          />

          {/* Bottom zoom bar */}
          <div className="h-12 bg-white border-t border-border-light flex items-center justify-center gap-2 shrink-0 px-4">
            <span className="text-[11px] text-text-light hidden md:inline mr-3">
              Hold <kbd className="px-1.5 py-0.5 bg-surface border border-border-light rounded text-[10px] font-mono">⌘</kbd> + scroll to zoom
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded-sm"
              aria-label="Zoom out"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="text-[13px] font-medium w-14 text-center hover:bg-surface rounded-sm h-8"
              aria-label="Reset zoom"
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(400, z + 25))}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded-sm"
              aria-label="Zoom in"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="ml-2 px-3 h-8 text-[12px] font-medium hover:bg-surface rounded-sm"
            >
              Fit
            </button>
            <button className="ml-2 w-8 h-8 flex items-center justify-center hover:bg-surface rounded-sm" aria-label="Settings">
              <Settings size={16} />
            </button>
          </div>
        </main>
      </div>

      {/* Need help (floating) */}
      <button className="fixed bottom-16 right-4 bg-vp-yellow text-vp-blue px-4 py-2.5 rounded-full text-[13px] font-semibold shadow-card-hover hover:bg-yellow-400 flex items-center gap-2 z-30">
        <span className="text-lg leading-none">?</span> Need design help?
      </button>

      {/* Preview modal */}
      {showPreview && (
        <PreviewModal faces={faces} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// ─── Face switcher (right-side mini thumbnails) ────────────────────────────

function FaceSwitcher({ activeFace, setActiveFace, frontBg, backBg }) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
      {[
        { id: "front", label: "Front", bg: frontBg },
        { id: "back", label: "Back", bg: backBg },
      ].map((f) => (
        <button
          key={f.id}
          onClick={() => setActiveFace(f.id)}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-12 h-8 border rounded-sm transition-all ${
              activeFace === f.id ? "border-vp-blue ring-2 ring-vp-blue/20" : "border-border"
            }`}
            style={{ background: f.bg }}
          />
          <span className="text-[10px] font-medium text-text-dark">{f.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Layer rendering ───────────────────────────────────────────────────────

function LayerView({ layer, selected, onMouseDown, onTextChange }) {
  const baseClass = `absolute select-none ${selected ? "outline outline-2 outline-vp-blue" : "hover:outline hover:outline-1 hover:outline-vp-blue/40"}`;
  const style = {
    left: layer.x,
    top: layer.y,
    width: layer.w,
    height: layer.h,
  };

  if (layer.type === "text") {
    return (
      <div
        className={baseClass}
        style={style}
        onMouseDown={onMouseDown}
        onDoubleClick={(e) => e.currentTarget.querySelector("textarea")?.focus()}
      >
        <textarea
          value={layer.text}
          onChange={(e) => onTextChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full bg-transparent border-0 outline-none resize-none overflow-hidden p-0 m-0"
          style={{
            fontSize: layer.fontSize,
            color: layer.color,
            textAlign: layer.align,
            fontWeight: layer.bold ? 700 : 400,
            fontStyle: layer.italic ? "italic" : "normal",
            textDecoration: layer.underline ? "underline" : "none",
            cursor: "move",
            lineHeight: 1.2,
          }}
        />
      </div>
    );
  }

  if (layer.type === "shape") {
    return (
      <div className={baseClass} style={{ ...style, cursor: "move" }} onMouseDown={onMouseDown}>
        {layer.shape === "rect" && <div className="w-full h-full" style={{ background: layer.fill }} />}
        {layer.shape === "circle" && <div className="w-full h-full rounded-full" style={{ background: layer.fill }} />}
        {layer.shape === "triangle" && (
          <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,0 100,100 0,100" fill={layer.fill} /></svg>
        )}
        {layer.shape === "line" && <div className="w-full h-1" style={{ background: layer.fill, marginTop: layer.h / 2 - 2 }} />}
        {layer.shape === "star" && (
          <svg viewBox="0 0 24 24" className="w-full h-full"><polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill={layer.fill} /></svg>
        )}
        {layer.shape === "heart" && (
          <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M12 21s-7-4.5-9.5-9C0 8 3 4 7 4c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4 0 7 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" fill={layer.fill} /></svg>
        )}
      </div>
    );
  }

  if (layer.type === "image") {
    return (
      <div className={baseClass} style={{ ...style, cursor: "move" }} onMouseDown={onMouseDown}>
        <img src={layer.src} alt="" className="w-full h-full object-cover" draggable={false} />
      </div>
    );
  }

  return null;
}

// ─── Tool panels ───────────────────────────────────────────────────────────

function ToolPanel(props) {
  switch (props.tool) {
    case "product": return <ProductPanel />;
    case "text": return <TextPanel {...props} />;
    case "uploads": return <UploadsPanel {...props} />;
    case "graphics": return <GraphicsPanel {...props} />;
    case "background": return <BackgroundPanel {...props} />;
    case "template": return <TemplatePanel {...props} />;
    case "qr": return <QRPanel {...props} />;
    case "more":
    default: return <MorePanel />;
  }
}

function PanelHeader({ title }) {
  return (
    <div className="px-4 pt-4 pb-3 border-b border-border-light flex items-center justify-between">
      <h3 className="text-[15px] font-bold text-text-dark">{title}</h3>
      <button className="text-text-light hover:text-text-dark" aria-label="Collapse">
        <X size={14} />
      </button>
    </div>
  );
}

function ProductPanel() {
  return (
    <div>
      <PanelHeader title="Product options" />
      <div className="p-4 space-y-4 text-[13px]">
        <div>
          <label className="block text-[12px] font-semibold text-text-dark mb-1.5">Size</label>
          <select className="w-full h-9 border border-border rounded-sm px-2 bg-white">
            <option>Standard 3.5" × 2"</option>
            <option>Square 2.5" × 2.5"</option>
            <option>Slim 3.5" × 1.75"</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-text-dark mb-1.5">Paper</label>
          <select className="w-full h-9 border border-border rounded-sm px-2 bg-white">
            <option>Premium Matte 350gsm</option>
            <option>Glossy 350gsm</option>
            <option>Soft-touch (+₹80)</option>
            <option>Recycled (+₹40)</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-text-dark mb-1.5">Quantity</label>
          <select className="w-full h-9 border border-border rounded-sm px-2 bg-white">
            <option>100 cards · ₹149</option>
            <option>250 cards · ₹299</option>
            <option>500 cards · ₹499</option>
            <option>1000 cards · ₹899</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-text-dark mb-1.5">Orientation</label>
          <div className="flex gap-2">
            <button className="flex-1 h-9 border border-vp-blue bg-vp-blue-light text-vp-blue text-[12px] font-medium rounded-sm">Horizontal</button>
            <button className="flex-1 h-9 border border-border text-text-dark text-[12px] font-medium rounded-sm hover:border-text-light">Vertical</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextPanel({ onAddText }) {
  return (
    <div>
      <PanelHeader title="Text" />
      <div className="p-4 space-y-3">
        <p className="text-[12px] text-text-light leading-relaxed">
          Edit your text below, or click on the field you'd like to edit directly on your design.
        </p>
        <Button onClick={onAddText} className="w-full">+ New text field</Button>

        <div className="pt-3 border-t border-border-light mt-3">
          <h4 className="text-[11px] font-bold text-text-dark uppercase tracking-wide mb-2">Quick add</h4>
          <div className="space-y-1.5">
            {[
              { label: "Heading", size: 28, bold: true },
              { label: "Subheading", size: 18, bold: true },
              { label: "Body text", size: 14, bold: false },
              { label: "Caption", size: 11, bold: false },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={onAddText}
                className="w-full text-left px-3 py-2 border border-border-light hover:border-vp-blue rounded-sm text-text-dark"
                style={{ fontSize: Math.min(preset.size, 16), fontWeight: preset.bold ? 700 : 400 }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadsPanel({ uploadImage, onAddImage }) {
  const fileRef = useRef(null);
  const [recent, setRecent] = useState([]);
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWarning("");
    setBusy(true);
    try {
      const result = uploadImage
        ? await uploadImage(file)                              // → ImgBB via server
        : (() => { const u = URL.createObjectURL(file); onAddImage(u); return { url: u, _local: true }; })();
      setRecent((r) => [{ url: result.thumbUrl || result.url, full: result.url }, ...r].slice(0, 8));
      if (result._local) setWarning("Sign in to upload to the cloud — using a local preview.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <PanelHeader title="Uploads" />
      <div className="p-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="w-full border-2 border-dashed border-border rounded-sm py-8 text-center hover:border-vp-blue hover:bg-vp-blue-light/30 transition-colors disabled:opacity-50"
        >
          <div className="text-vp-blue mb-2">
            <Plus size={24} className="mx-auto" />
          </div>
          <div className="text-[13px] font-semibold text-text-dark">
            {busy ? "Uploading..." : "Upload from this device"}
          </div>
          <div className="text-[11px] text-text-light mt-1">PNG, JPG, SVG · up to 32MB</div>
        </button>
        {warning && (
          <p className="text-[11px] text-vp-red mt-2">{warning}</p>
        )}
        <button className="w-full mt-2 h-9 border border-border rounded-sm text-[13px] font-medium text-text-dark hover:bg-surface">
          Upload from phone
        </button>
        <p className="text-[11px] text-text-light text-center mt-3">or drag and drop here</p>

        {recent.length > 0 && (
          <div className="mt-5">
            <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wide mb-2">Recent uploads</h4>
            <div className="grid grid-cols-3 gap-2">
              {recent.map((r, i) => (
                <button
                  key={i}
                  onClick={() => onAddImage(r.full)}
                  className="aspect-square border border-border-light rounded-sm overflow-hidden hover:border-vp-blue"
                  title="Click to add to canvas"
                >
                  <img src={r.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GraphicsPanel({ onAddShape, onAddImage }) {
  return (
    <div>
      <PanelHeader title="Graphics" />
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-light" />
          <input type="text" placeholder="Search for content" className="w-full h-9 border border-border rounded-sm pl-8 pr-3 text-[13px] focus:border-vp-blue focus:outline-none" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[12px] font-bold text-text-dark">Shapes</h4>
            <ChevronRight size={14} className="text-text-light" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                onClick={() => onAddShape(s.id)}
                className="aspect-square border border-border-light rounded-sm hover:border-vp-blue flex items-center justify-center bg-surface-alt"
                title={s.label}
              >
                {s.id === "rect" && <div className="w-12 h-12 bg-text-dark" />}
                {s.id === "circle" && <div className="w-12 h-12 rounded-full bg-text-dark" />}
                {s.id === "triangle" && <svg viewBox="0 0 100 100" className="w-12 h-12"><polygon points="50,10 90,90 10,90" fill="#111" /></svg>}
                {s.id === "line" && <div className="w-12 h-1 bg-text-dark" />}
                {s.id === "star" && <svg viewBox="0 0 24 24" className="w-12 h-12"><polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill="#111" /></svg>}
                {s.id === "heart" && <svg viewBox="0 0 24 24" className="w-12 h-12"><path d="M12 21s-7-4.5-9.5-9C0 8 3 4 7 4c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 4 0 7 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" fill="#111" /></svg>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[12px] font-bold text-text-dark">Icons</h4>
            <ChevronRight size={14} className="text-text-light" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["★", "♥", "✓", "✉", "☎", "⌂", "✈", "♪", "♛"].map((sym) => (
              <button
                key={sym}
                onClick={() => onAddShape("rect")}
                className="aspect-square border border-border-light rounded-sm hover:border-vp-blue flex items-center justify-center bg-surface-alt text-2xl"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundPanel({ setBackground, currentBg }) {
  return (
    <div>
      <PanelHeader title="Background" />
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-[12px] font-bold text-text-dark mb-2">Solid colors</h4>
          <div className="grid grid-cols-6 gap-1.5">
            {BG_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setBackground(c)}
                className={`aspect-square rounded-sm border ${currentBg === c ? "border-vp-blue ring-2 ring-vp-blue/30" : "border-border-light hover:border-text-light"}`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[12px] font-bold text-text-dark mb-2">Custom color</h4>
          <input
            type="color"
            value={currentBg}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full h-10 border border-border rounded-sm cursor-pointer"
          />
        </div>
        <button onClick={() => setBackground("#ffffff")} className="w-full text-[12px] text-vp-blue hover:underline">
          Reset to white
        </button>
      </div>
    </div>
  );
}

// Renders an actual mini visiting card preview from a template's layer data.
// Scales 515×301 → fits inside `width` while preserving aspect ratio.
function TemplatePreview({ tpl, width = 200 }) {
  const baseW = 515;
  const baseH = 301;
  const scale = width / baseW;
  return (
    <div
      className="relative overflow-hidden border border-border-light"
      style={{ width, height: width / (baseW / baseH), background: tpl.bg }}
    >
      <div style={{ width: baseW, height: baseH, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
        {tpl.layers.map((layer, i) => {
          const style = { position: "absolute", left: layer.x, top: layer.y, width: layer.w, height: layer.h };
          if (layer.type === "text") {
            return (
              <div
                key={i}
                style={{
                  ...style,
                  fontSize: layer.fontSize,
                  color: layer.color,
                  textAlign: layer.align,
                  fontWeight: layer.bold ? 700 : 400,
                  fontStyle: layer.italic ? "italic" : "normal",
                  textDecoration: layer.underline ? "underline" : "none",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                }}
              >
                {layer.text}
              </div>
            );
          }
          if (layer.type === "shape") {
            if (layer.shape === "rect") return <div key={i} style={{ ...style, background: layer.fill }} />;
            if (layer.shape === "circle") return <div key={i} style={{ ...style, background: layer.fill, borderRadius: "9999px" }} />;
            if (layer.shape === "line") return <div key={i} style={{ ...style, background: layer.fill }} />;
            if (layer.shape === "triangle") return (
              <svg key={i} viewBox="0 0 100 100" preserveAspectRatio="none" style={style}>
                <polygon points="0,0 100,50 0,100" fill={layer.fill} />
              </svg>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function TemplatePanel({ applyTemplate, templates = FALLBACK_TEMPLATES, templatesLoaded = true }) {
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? templates : templates.filter((t) => t.category === activeCat);

  return (
    <div>
      <PanelHeader title="Template" />
      <div className="p-4 space-y-3">
        <p className="text-[12px] text-text-light">
          Pick a template to start, then customise text and colors.{" "}
          {!templatesLoaded && <span className="text-text-muted">Loading…</span>}
        </p>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                activeCat === cat
                  ? "bg-vp-blue text-white"
                  : "bg-surface text-text-medium hover:bg-vp-blue-light hover:text-vp-blue"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid — real previews */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          {filtered.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className="group border border-border-light hover:border-vp-blue rounded-sm overflow-hidden bg-white text-left transition-colors"
            >
              <div className="bg-surface-alt p-3 flex items-center justify-center">
                <TemplatePreview tpl={tpl} width={216} />
              </div>
              <div className="px-3 py-2 border-t border-border-light flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-semibold text-text-dark leading-tight">{tpl.name}</div>
                  <div className="text-[10px] text-text-light">{tpl.category}</div>
                </div>
                <span className="text-[11px] font-semibold text-vp-blue opacity-0 group-hover:opacity-100 transition-opacity">Use →</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-[12px] text-text-light text-center py-6">No templates in this category yet.</p>
        )}
      </div>
    </div>
  );
}

function QRPanel({ onAddImage }) {
  const [url, setUrl] = useState("");
  const generate = () => {
    if (!url) return;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    onAddImage(qr);
  };
  return (
    <div>
      <PanelHeader title="QR codes" />
      <div className="p-4 space-y-3">
        <p className="text-[12px] text-text-light">Generate a QR code from a URL and drop it on your card.</p>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          className="w-full h-9 border border-border rounded-sm px-3 text-[13px] focus:border-vp-blue focus:outline-none"
        />
        <Button onClick={generate} className="w-full" disabled={!url}>Add QR code</Button>
      </div>
    </div>
  );
}

function MorePanel() {
  return (
    <div>
      <PanelHeader title="More" />
      <div className="p-4 text-[12px] text-text-light">
        Layers, alignment, rulers, grid — coming soon.
      </div>
    </div>
  );
}

// ─── Preview modal ─────────────────────────────────────────────────────────

function PreviewModal({ faces, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-sm max-w-4xl w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-text-dark">Preview</h3>
          <button onClick={onClose} className="w-8 h-8 hover:bg-surface rounded-sm flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["front", "back"].map((face) => (
            <div key={face}>
              <p className="text-[12px] font-semibold text-text-light uppercase tracking-wide mb-2 text-center">{face}</p>
              <div className="relative mx-auto shadow-card-hover" style={{ width: CARD_RATIO.w * PX_PER_CM, height: CARD_RATIO.h * PX_PER_CM, background: faces[face].background, border: "1px solid #d6d6d6" }}>
                {faces[face].layers.map((layer) => (
                  <LayerView key={layer.id} layer={layer} selected={false} onMouseDown={() => {}} onTextChange={() => {}} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Continue editing</Button>
          <Button onClick={onClose}>Looks good</Button>
        </div>
      </div>
    </div>
  );
}
