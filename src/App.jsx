import React, { useState, useMemo, useEffect } from 'react';
import catalog from './data/catalog.json';

// ─── IMAGE PATHS ───────────────────────────────────────────────
const PROC_IMAGES = {
  rt4: './images/processors/rt4-rack.png',
  rtv: './images/processors/rt4-rack.png',
  rt3: './images/processors/rt3-compact.png',
  'tc2-1': './images/processors/tc2.png',
  'tc2-2': './images/processors/tc2.png',
  tb3: './images/processors/tb3.png',
  viper: './images/processors/viper.png',
};

const CAM_IMAGES = {
  helios: './images/cameras/helios.png',
  galileo: './images/cameras/galileo-6k.png',
  'phoenix-gold': './images/cameras/phoenix-gold.png',
  phoenix: './images/cameras/phoenix-hd-uhd.png',
  'phoenix-cr': './images/cameras/phoenix-cr.png',
  xs2: './images/cameras/xs-ii.png',
  'os2-gold': './images/cameras/os-ii.png',
  os2: './images/cameras/os-ii.png',
  xsm: './images/cameras/xsm.png',
  xstream: './images/cameras/xss.png',
  sugarcube: './images/cameras/sugarcube.png',
  ccm: './images/cameras/ccm.png',
  ccs: './images/cameras/ccs.png',
};

const A = './images/cameras/angles/';
const CAM_ANGLES = {
  helios:         [`${A}helios-3qtr.png`,`${A}helios-front.png`,`${A}helios-back.png`,`${A}helios-left.png`,`${A}helios-side.png`,`${A}helios-top.png`],
  galileo:        [`${A}galileo-3qtr.png`,`${A}galileo-front.png`,`${A}galileo-rear.png`,`${A}galileo-side.png`,`${A}galileo-top.png`],
  'phoenix-gold': [`${A}phoenix-gold-3qtr.png`,`${A}phoenix-gold-front.png`,`${A}phoenix-gold-back.png`,`${A}phoenix-gold-left.png`,`${A}phoenix-gold-side.png`,`${A}phoenix-gold-top.png`],
  phoenix:        [`${A}phoenix-3qtr.png`,`${A}phoenix-front.png`,`${A}phoenix-back.png`,`${A}phoenix-left.png`,`${A}phoenix-side.png`,`${A}phoenix-top.png`],
  'phoenix-cr':   [`${A}phoenix-cr-3qtr.png`,`${A}phoenix-cr-front.png`,`${A}phoenix-cr-back.png`,`${A}phoenix-cr-left.png`,`${A}phoenix-cr-side.png`],
  xs2:            [`${A}xs2-3qtr.png`,`${A}xs2-front.png`,`${A}xs2-back.png`,`${A}xs2-left.png`,`${A}xs2-side.png`,`${A}xs2-top.png`],
  'os2-gold':     [`${A}os2-gold-3qtr.png`,`${A}os2-gold-front.png`,`${A}os2-gold-back.png`,`${A}os2-gold-left.png`,`${A}os2-gold-top.png`],
  os2:            [`${A}os2-3qtr.png`,`${A}os2-front.png`,`${A}os2-back.png`,`${A}os2-left.png`,`${A}os2-side.png`,`${A}os2-top.png`],
  xsm:            [`${A}xsm-3qtr.png`,`${A}xsm-front.png`,`${A}xsm-back.png`,`${A}xsm-left.png`,`${A}xsm-side.png`,`${A}xsm-top.png`],
  xstream:        [`${A}xstream-3qtr.png`,`${A}xstream-front.png`,`${A}xstream-back.png`,`${A}xstream-left.png`,`${A}xstream-side.png`,`${A}xstream-top.png`],
  sugarcube:      [`${A}sugarcube-3qtr.png`,`${A}sugarcube-alt.png`],
  ccm:            [`${A}ccm-3qtr.png`,`${A}ccm-front.png`,`${A}ccm-back.png`,`${A}ccm-left.png`,`${A}ccm-side.png`,`${A}ccm-top.png`],
  ccs:            [`${A}ccs-3qtr.png`,`${A}ccs-front.png`,`${A}ccs-back.png`,`${A}ccs-left.png`,`${A}ccs-side.png`,`${A}ccs-top.png`],
};

// ─── CONNECTION ICONS (inline SVG) ─────────────────────────────
function FiberIcon({ active }) {
  const c = active ? GROUP_COLORS.fiber : '#666';
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <rect x="1" y="2" width="18" height="10" rx="2" stroke={c} strokeWidth="1.2" />
      <rect x="4" y="5" width="4" height="4" rx="0.5" fill={c} opacity="0.5" />
      <rect x="12" y="5" width="4" height="4" rx="0.5" fill={c} opacity="0.5" />
    </svg>
  );
}
function UsbcIcon({ active }) {
  const c = active ? GROUP_COLORS.compact : '#666';
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <rect x="3" y="3" width="14" height="8" rx="4" stroke={c} strokeWidth="1.2" />
      <path d="M11 5L9 7.5H11L9 10" stroke={c} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EthernetIcon({ active }) {
  const c = active ? GROUP_COLORS.ccm : '#666';
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <circle cx="10" cy="7" r="5" stroke={c} strokeWidth="1.2" />
      <circle cx="10" cy="7" r="2" fill={c} opacity="0.4" />
    </svg>
  );
}

const CONN_ICONS = {
  'xstream-fiber': FiberIcon,
  'xstream-usbc': UsbcIcon,
  ethernet: EthernetIcon,
};

// ─── GROUP COLORS (top→bottom: red / green / blue) ───────────
// Luiz v1.0: BGR — Fiber=Blue, Compact/TB=Green, CCM/Ethernet=Red
const GROUP_COLORS = {
  fiber:    '#4080D0',   // blue (was red)
  compact:  '#40B060',   // green
  ccm:      '#D94040',   // red (was blue)
};

// ─── MAIN APP ──────────────────────────────────────────────────
const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';

export default function App() {
  const [selectedProc, setSelectedProc] = useState(null);
  const [selectedConn, setSelectedConn] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [connType, setConnType] = useState('single'); // 'single' (1CH) or 'dual' (2CH)
  const [heroView, setHeroView] = useState('detail'); // 'detail' or 'compare'
  const [procConfig, setProcConfig] = useState({}); // { ddr: 256, storage: 4 }
  // Refs for cable drawing
  const mainRef = React.useRef(null);
  const camRefs = React.useRef({});
  const procRefs = React.useRef({});
  const canvasRef = React.useRef(null);
  const camStripRef = React.useRef(null);
  const procStripRef = React.useRef(null);
  // Master Engine: unified configurator — all cameras, all processors, all connections

  // ─── MOBILE DETECTION ──────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileStep, setMobileStep] = useState(0); // 0=proc, 1=conn, 2=cam, 3=detail
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ─── HELPERS ───────────────────────────────────────────────
  const connsForProc = (pid) => catalog.compatibility[pid] || [];
  const connsForFamily = (fid) => {
    const fam = catalog.camera_families.find(f => f.id === fid);
    return fam ? catalog.connections.filter(c => c.group === fam.group).map(c => c.id) : [];
  };
  const procsForConn = (cid) =>
    catalog.processors.filter(p => (catalog.compatibility[p.id] || []).includes(cid)).map(p => p.id);

  // ─── LUIZ v1.0: RESTRICTIONS & WARNINGS ────────────────────
  const isProcessorBlocked = (procId, familyId) => {
    if (!familyId) return false;
    const rule = catalog.restrictions?.[familyId];
    return rule ? rule.blockedProcessors.includes(procId) : false;
  };

  const getBlockReason = (procId, familyId) => {
    if (!familyId) return null;
    const rule = catalog.restrictions?.[familyId];
    return rule?.blockedProcessors.includes(procId) ? rule.reason : null;
  };

  const fpsDropWarning = useMemo(() => {
    if (!selectedFamily || !selectedProc) return null;
    const rules = catalog.fpsDropRules;
    if (!rules) return null;
    const familyAffected = rules.affectedFamilies.includes(selectedFamily);
    const procSingleCh = rules.singleChannelProcessors.includes(selectedProc);
    if (familyAffected && procSingleCh) return rules.note;
    return null;
  }, [selectedFamily, selectedProc]);

  // Luiz v1.0: Connection mode logic
  // STATE 1: DUAL CABLE (stethoscope) — 1 cable splits to 2 ports, FULL FPS
  // STATE 2: SINGLE CABLE(S) — number of connections depends on processor ports
  const connectionModes = useMemo(() => {
    if (!selectedFamily || !selectedProc) return [];
    const fam = catalog.camera_families.find(f => f.id === selectedFamily);
    const proc = catalog.processors.find(p => p.id === selectedProc);
    if (!fam || !proc) return [];
    const modes = [];
    const ports = proc.channels;
    const isDualCam = fam.dualConnection === true;

    // DUAL ×1 — 1 camera, 2 ports, FULL FPS
    if (isDualCam && ports >= 2) {
      const freeAfter = ports - 2;
      modes.push({
        id: 'dual',
        label: ports >= 4 ? 'DUAL ×1' : 'DUAL CABLE',
        desc: `1 camera · 2 ports · FULL FPS${freeAfter > 0 ? ` · ${freeAfter} port${freeAfter > 1 ? 's' : ''} free` : ''}`,
        cables: 1,
        color: '#4080D0',
      });
    }

    // DUAL ×2 — 2 cameras, 4 ports, both FULL FPS (RT V only: 4 ports)
    if (isDualCam && ports >= 4) {
      modes.push({
        id: 'dual2',
        label: 'DUAL ×2',
        desc: `2 cameras · 4 ports · both FULL FPS · all ports used`,
        cables: 2,
        color: '#4080D0',
      });
    }

    // SINGLE ×1 — always available for 1-port processors; also for non-dual cameras on multi-port
    if (ports === 1 || !isDualCam) {
      const freeAfter = ports - 1;
      modes.push({
        id: 'single',
        label: ports >= 2 ? 'SINGLE ×1' : 'SINGLE CABLE',
        desc: `1 cable · 1 camera${isDualCam ? ' · ⚠ HALF FPS' : ' · full FPS'}${freeAfter > 0 ? ` · ${freeAfter} port${freeAfter > 1 ? 's' : ''} free` : ''}`,
        cables: 1,
        color: GROUP_COLORS.fiber,
      });
    }

    // SINGLE ×N — multi-port processors
    if (ports >= 2) {
      modes.push({
        id: 'multi',
        label: `SINGLE ×${ports}`,
        desc: `${ports} cables · ${ports} cameras · 1 port each${isDualCam ? ' · ⚠ HALF FPS' : ''} · all ports used`,
        cables: ports,
        color: GROUP_COLORS.fiber,
      });
    }

    return modes;
  }, [selectedFamily, selectedProc]);

  // Auto-select best connection mode: prefer dual (full FPS) when available
  useEffect(() => {
    if (connectionModes.length === 0) return;
    const hasDual = connectionModes.find(m => m.id === 'dual');
    const currentValid = connectionModes.find(m => m.id === connType);
    if (!currentValid || (hasDual && connType !== 'dual')) {
      setConnType(hasDual ? 'dual' : 'single');
    }
  }, [connectionModes]);

  // Canvas cable drawing — redraws on scroll, selection change, connType change
  const drawCable = React.useCallback(() => {
    const canvas = canvasRef.current;
    const main = mainRef.current;
    if (!canvas || !main) return;
    const ctx = canvas.getContext('2d');
    const mr = main.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = mr.width * dpr;
    canvas.height = mr.height * dpr;
    canvas.style.width = mr.width + 'px';
    canvas.style.height = mr.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, mr.width, mr.height);

    if (!selectedFamily || !selectedProc) return;
    const camEl = camRefs.current[selectedFamily];
    const procEl = procRefs.current[selectedProc];
    if (!camEl || !procEl) return;

    const cr = camEl.getBoundingClientRect();
    const pr = procEl.getBoundingClientRect();
    const x1 = cr.right - mr.left;
    const y1 = cr.top + cr.height / 2 - mr.top;
    const x2 = pr.left - mr.left;
    const y2 = pr.top + pr.height / 2 - mr.top;
    const isDual = connType === 'dual';
    const isDual2 = connType === 'dual2';
    const isMulti = connType === 'multi';
    const proc = catalog.processors.find(p => p.id === selectedProc);
    const fam = catalog.camera_families.find(f => f.id === selectedFamily);
    const color = fam ? (GROUP_COLORS[fam.group] || '#4080D0') : '#4080D0';
    const spread = 35;

    const drawHangingCable = (xa, ya, xb, yb, sag, clr, w) => {
      ctx.beginPath();
      const mx = (xa + xb) / 2;
      const my = Math.max(ya, yb) + sag;
      ctx.moveTo(xa, ya);
      ctx.quadraticCurveTo(mx, my, xb, yb);
      // Shadow
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = w + 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Main cable
      ctx.beginPath();
      ctx.moveTo(xa, ya);
      ctx.quadraticCurveTo(mx, my, xb, yb);
      ctx.strokeStyle = clr;
      ctx.lineWidth = w;
      ctx.stroke();
      // Highlight
      ctx.beginPath();
      ctx.moveTo(xa, ya - 2);
      ctx.quadraticCurveTo(mx, my - 2, xb, yb - 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawPlug = (x, y, clr) => {
      ctx.fillStyle = clr;
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - 6, y - 8, 12, 16, 3);
      ctx.fill();
      ctx.stroke();
    };

    const drawSplitNode = (x, y, clr) => {
      // Outer circle
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#0A0A0A';
      ctx.fill();
      ctx.strokeStyle = clr;
      ctx.lineWidth = 3;
      ctx.stroke();
      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = clr;
      ctx.fill();
    };

    const drawLabel = (x, y, text, clr, size = 10) => {
      ctx.font = `bold ${size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = clr;
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y);
    };

    if (isDual) {
      // Y-FORK: 1 cable from camera → splits → 2 connections to PORT 1 + PORT 2
      // Keep ports tight around processor center (±18px)
      const portSpread = 18;
      const port1Y = y2 - portSpread;
      const port2Y = y2 + portSpread;
      // Split point — 70% toward processor, vertically centered on processor
      const splitX = x1 + (x2 - x1) * 0.65;
      const splitY = y2;
      // Trunk — camera to split point
      drawHangingCable(x1, y1, splitX, splitY, 30, color, 6);
      // Split node
      drawSplitNode(splitX, splitY, color);
      // Branch 1 → PORT 1 (short straight-ish line up)
      ctx.beginPath(); ctx.moveTo(splitX, splitY);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, port1Y - 5, x2, port1Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, splitY);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, port1Y - 5, x2, port1Y);
      ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
      // Branch 2 → PORT 2 (short straight-ish line down)
      ctx.beginPath(); ctx.moveTo(splitX, splitY);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, port2Y + 5, x2, port2Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, splitY);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, port2Y + 5, x2, port2Y);
      ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
      // Plugs
      drawPlug(x1, y1, color);
      drawPlug(x2, port1Y, color);
      drawPlug(x2, port2Y, color);
      // Port labels
      drawLabel(x2 + 20, port1Y + 4, 'P1', color, 9);
      drawLabel(x2 + 20, port2Y + 4, 'P2', color, 9);
    } else if (isDual2) {
      // TWO Y-FORKS: 2 cameras, each splits to 2 ports (4 ports total)
      const portSpread = 16;
      const forkSpread = 50;
      // Fork 1: camera side upper → P1/P2 (upper pair on processor)
      const cam1Y = y1 - 20;
      const fork1Y = y2 - forkSpread;
      const p1Y = fork1Y - portSpread;
      const p2Y = fork1Y + portSpread;
      const splitX = x1 + (x2 - x1) * 0.65;
      // Trunk 1
      drawHangingCable(x1, cam1Y, splitX, fork1Y, 20, color, 5);
      drawSplitNode(splitX, fork1Y, color);
      // Branch P1
      ctx.beginPath(); ctx.moveTo(splitX, fork1Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p1Y - 4, x2, p1Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, fork1Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p1Y - 4, x2, p1Y);
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke();
      // Branch P2
      ctx.beginPath(); ctx.moveTo(splitX, fork1Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p2Y + 4, x2, p2Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, fork1Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p2Y + 4, x2, p2Y);
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke();
      drawPlug(x1, cam1Y, color); drawPlug(x2, p1Y, color); drawPlug(x2, p2Y, color);
      drawLabel(x2 + 20, p1Y + 4, 'P1', color, 8);
      drawLabel(x2 + 20, p2Y + 4, 'P2', color, 8);

      // Fork 2: camera side lower → P3/P4 (lower pair on processor)
      const cam2Y = y1 + 20;
      const fork2Y = y2 + forkSpread;
      const p3Y = fork2Y - portSpread;
      const p4Y = fork2Y + portSpread;
      drawHangingCable(x1, cam2Y, splitX, fork2Y, 25, color, 5);
      drawSplitNode(splitX, fork2Y, color);
      ctx.beginPath(); ctx.moveTo(splitX, fork2Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p3Y - 4, x2, p3Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, fork2Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p3Y - 4, x2, p3Y);
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, fork2Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p4Y + 4, x2, p4Y);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(splitX, fork2Y);
      ctx.quadraticCurveTo(splitX + (x2 - splitX) * 0.5, p4Y + 4, x2, p4Y);
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke();
      drawPlug(x1, cam2Y, color); drawPlug(x2, p3Y, color); drawPlug(x2, p4Y, color);
      drawLabel(x2 + 20, p3Y + 4, 'P3', color, 8);
      drawLabel(x2 + 20, p4Y + 4, 'P4', color, 8);
      // Labels
      drawLabel(x1 - 20, cam1Y + 4, 'CAM 1', 'rgba(255,255,255,0.4)', 8);
      drawLabel(x1 - 20, cam2Y + 4, 'CAM 2', 'rgba(255,255,255,0.4)', 8);
    } else if (isMulti) {
      const n = proc?.channels || 2;
      const totalSpread = (n - 1) * 36;
      for (let i = 0; i < n; i++) {
        const cy1 = y1 - totalSpread / 2 + i * 36;
        const cy2 = y2 - totalSpread / 2 + i * 36;
        drawHangingCable(x1, cy1, x2, cy2, 25 + i * 6, color, 4);
        drawPlug(x1, cy1, color);
        drawPlug(x2, cy2, color);
        drawLabel((x1 + x2) / 2, Math.max(cy1, cy2) + 30 + i * 6 + 14, `CAM ${i + 1}`, 'rgba(255,255,255,0.35)', 9);
      }
    } else {
      // Single cable
      drawHangingCable(x1, y1, x2, y2, 40, color, 5);
      drawPlug(x1, y1, color);
      drawPlug(x2, y2, color);
    }
  }, [selectedFamily, selectedProc, connType]);

  // Redraw on scroll events from either strip
  useEffect(() => {
    drawCable();
    const camStrip = camStripRef.current;
    const procStrip = procStripRef.current;
    if (camStrip) camStrip.addEventListener('scroll', drawCable);
    if (procStrip) procStrip.addEventListener('scroll', drawCable);
    window.addEventListener('resize', drawCable);
    return () => {
      if (camStrip) camStrip.removeEventListener('scroll', drawCable);
      if (procStrip) procStrip.removeEventListener('scroll', drawCable);
      window.removeEventListener('resize', drawCable);
    };
  }, [drawCable]);

  // Master Engine: ALL processors, families, connections from catalog
  const modeProcessors = useMemo(() => catalog.processors, []);
  const modeFamilies = useMemo(() => catalog.camera_families, []);
  const modeConnections = useMemo(() => catalog.connections, []);

  // ─── DERIVED: what's available in each strip (bidirectional) ──
  const availableConns = useMemo(() => {
    let conns = catalog.connections.map(c => c.id);
    if (selectedProc) conns = conns.filter(cid => connsForProc(selectedProc).includes(cid));
    if (selectedFamily) conns = conns.filter(cid => connsForFamily(selectedFamily).includes(cid));
    return conns;
  }, [selectedProc, selectedFamily]);

  const availableProcs = useMemo(() => {
    let procs = catalog.processors.map(p => p.id);
    if (selectedConn) procs = procs.filter(pid => procsForConn(selectedConn).includes(pid));
    if (selectedFamily) {
      const famConns = connsForFamily(selectedFamily);
      procs = procs.filter(pid => connsForProc(pid).some(cid => famConns.includes(cid)));
    }
    return procs;
  }, [selectedConn, selectedFamily]);

  const availableFamilies = useMemo(() => {
    let fams = catalog.camera_families;
    if (selectedConn) {
      const conn = catalog.connections.find(c => c.id === selectedConn);
      if (conn) fams = fams.filter(f => f.group === conn.group);
    }
    if (selectedProc) {
      const procConns = connsForProc(selectedProc);
      const procGroups = new Set(procConns.map(cid => catalog.connections.find(c => c.id === cid)?.group).filter(Boolean));
      fams = fams.filter(f => procGroups.has(f.group));
    }
    return fams;
  }, [selectedConn, selectedProc]);

  const models = useMemo(() => {
    if (!selectedFamily) return [];
    return catalog.models[selectedFamily] || [];
  }, [selectedFamily]);

  const activeModel = useMemo(() => {
    if (!selectedModel || !selectedFamily) return null;
    return (catalog.models[selectedFamily] || []).find(m => m.id === selectedModel);
  }, [selectedFamily, selectedModel]);

  const activeProc = useMemo(() => {
    return catalog.processors.find(p => p.id === selectedProc);
  }, [selectedProc]);

  const activeConn = useMemo(() => {
    return catalog.connections.find(c => c.id === selectedConn);
  }, [selectedConn]);

  const activeFamily = useMemo(() => {
    return catalog.camera_families.find(f => f.id === selectedFamily);
  }, [selectedFamily]);

  // ─── HANDLERS (bidirectional) ──────────────────────────────
  function selectProcessor(id) {
    setSelectedProc(id);
    // Default to single connection when selecting processor
    setConnType('single');
    const procConns = connsForProc(id);

    if (selectedFamily) {
      // Camera already picked — try to bridge
      const famConns = connsForFamily(selectedFamily);
      const bridge = procConns.filter(cid => famConns.includes(cid));
      if (bridge.length === 1) {
        setSelectedConn(bridge[0]); // auto-bridge
      } else if (bridge.length === 0) {
        // Incompatible — clear camera, start forward
        setSelectedFamily(null); setSelectedModel(null); setSelectedConn(null);
        if (procConns.length === 1) setSelectedConn(procConns[0]);
      } else {
        setSelectedConn(null); // multiple bridges, user picks
      }
    } else {
      // Standard forward flow
      setSelectedConn(null); setSelectedFamily(null); setSelectedModel(null);
      if (procConns.length === 1) setSelectedConn(procConns[0]);
    }
  }

  function selectFamily(id) {
    const familyModels = catalog.models[id] || [];
    setSelectedFamily(id);
    setSelectedModel(familyModels.length > 0 ? familyModels[0].id : null);
    setConnType('single');
    const famConns = connsForFamily(id);

    if (selectedProc) {
      // Proc already picked — try to bridge
      const procConns = connsForProc(selectedProc);
      const bridge = procConns.filter(cid => famConns.includes(cid));
      if (bridge.length === 1) {
        setSelectedConn(bridge[0]); // auto-bridge
      } else if (bridge.length === 0) {
        // Incompatible — clear proc, start reverse
        setSelectedProc(null); setSelectedConn(null);
        if (famConns.length === 1) setSelectedConn(famConns[0]);
      } else {
        setSelectedConn(null); // multiple bridges, user picks
      }
    } else {
      // Reverse flow — camera first
      setSelectedConn(null); setSelectedProc(null);
      if (famConns.length === 1) setSelectedConn(famConns[0]);
    }
  }

  function selectConnection(id) {
    setSelectedConn(id);
    const conn = catalog.connections.find(c => c.id === id);
    if (!conn) return;

    let procStays = selectedProc;
    let famStays = selectedFamily;

    // Clear processor if incompatible with new connection
    if (procStays && !connsForProc(procStays).includes(id)) {
      setSelectedProc(null);
      procStays = null;
    }
    // Clear family if incompatible with new connection
    if (famStays && !connsForFamily(famStays).includes(id)) {
      setSelectedFamily(null); setSelectedModel(null);
      famStays = null;
    }

    // Auto-resolve remaining side
    if (procStays && !famStays) {
      const families = catalog.camera_families.filter(f => f.group === conn.group);
      if (families.length === 1) {
        const fm = catalog.models[families[0].id] || [];
        setSelectedFamily(families[0].id);
        setSelectedModel(fm.length > 0 ? fm[0].id : null);
      }
    } else if (famStays && !procStays) {
      const procs = procsForConn(id);
      if (procs.length === 1) setSelectedProc(procs[0]);
    } else if (!procStays && !famStays) {
      const procs = procsForConn(id);
      if (procs.length === 1) setSelectedProc(procs[0]);
    }
  }

  function selectModel(id) {
    setSelectedModel(id);
  }

  function handleReset() {
    setSelectedProc(null);
    setSelectedConn(null);
    setSelectedFamily(null);
    setSelectedModel(null);
    setConnType('single');
    if (isMobile) setMobileStep(0);
  }

  // ─── MOBILE RENDER ─────────────────────────────────────────
  if (isMobile) {
    const MOBILE_STEPS = [
      { label: 'PROCESSOR', short: 'PROC' },
      { label: 'CONNECTION', short: 'CONN' },
      { label: 'CAMERA', short: 'CAM' },
      { label: 'DETAIL', short: 'SPEC' },
    ];
    const PROC_GROUPS = [
      { label: 'FLEXIBLE', ids: ['rtv', 'rt4', 'rt3'], color: GROUP_COLORS.fiber },
      { label: 'PORTABLE', ids: ['tc2-2', 'tc2-1', 'tb3'], color: GROUP_COLORS.compact },
      { label: null, ids: ['viper'], color: GROUP_COLORS.ccm },
    ];
    const CAM_GROUPS = [
      { label: 'XSTREAM FIBER', groupId: 'fiber', ids: ['helios', 'galileo', 'phoenix-gold', 'phoenix', 'phoenix-cr', 'xs2'] },
      { label: 'XSTREAM USB-C', groupId: 'compact', ids: ['os2-gold', 'os2', 'xsm', 'xstream', 'sugarcube'] },
      { label: 'ETHERNET', groupId: 'ccm', ids: ['ccs', 'ccm'] },
    ];

    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', 'Helvetica Neue', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
        {/* Mobile Header */}
        <header style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.85)', flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#E8B600', letterSpacing: '0.08em' }}>IDT</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>CONFIGURATOR</span>
          </div>
          <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }} onClick={handleReset}>RESET</button>
        </header>

        {/* Signal Chain Summary — compact */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 12px', background: '#1A1A1A', borderBottom: '1px solid #222', flexShrink: 0 }}>
          {[
            { label: 'PROC', value: activeProc?.name },
            { label: 'CONN', value: activeConn?.label },
            { label: 'CAM', value: activeModel?.fullName || activeFamily?.name },
          ].map((seg, i) => (
            <React.Fragment key={seg.label}>
              {i > 0 && <span style={{ color: '#E8B600', fontSize: 12, opacity: 0.4 }}>→</span>}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{seg.label}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: seg.value ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg.value || '—'}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step Tabs */}
        <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {MOBILE_STEPS.map((step, i) => {
            const isAct = mobileStep === i;
            const hasSel = i === 0 ? !!selectedProc : i === 1 ? !!selectedConn : i === 2 ? !!selectedFamily : !!activeModel;
            return (
              <button key={i} onClick={() => setMobileStep(i)} style={{
                flex: 1, padding: '10px 4px', background: isAct ? 'rgba(232,182,0,0.06)' : 'transparent',
                border: 'none', borderBottom: isAct ? '2px solid #E8B600' : '2px solid transparent',
                cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: isAct ? '#E8B600' : hasSel ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }}>{step.short}</div>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          {/* STEP 0: Processors */}
          {mobileStep === 0 && (
            <div style={{ padding: '16px 12px' }}>
              {PROC_GROUPS.map((group, gi) => {
                const gc = group.color;
                return (
                  <div key={gi} style={{ marginBottom: 12, border: `1px solid ${gc}33`, borderRadius: 8, overflow: 'hidden' }}>
                    {group.label && (
                      <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 900, letterSpacing: '0.18em', color: gc, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${gc}30`, background: `linear-gradient(180deg, ${gc}0A 0%, transparent 100%)` }}>{group.label}</div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${group.ids.length > 2 ? 3 : group.ids.length}, 1fr)`, gap: 0 }}>
                      {group.ids.map(pid => {
                        const p = catalog.processors.find(pr => pr.id === pid);
                        if (!p) return null;
                        const isActive = selectedProc === p.id;
                        const isProcAvail = availableProcs.includes(p.id);
                        const hasNarrow = selectedFamily || selectedConn;
                        const isIncompat = hasNarrow && !isProcAvail;
                        return (
                          <button key={p.id} onClick={() => { selectProcessor(p.id); const pConns = connsForProc(p.id); setMobileStep(pConns.length === 1 ? 2 : 1); }} style={{
                            background: isActive ? `${gc}10` : 'transparent',
                            border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            padding: '16px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                            opacity: isIncompat ? 0.4 : 1, filter: isIncompat ? 'grayscale(1)' : 'none',
                          }}>
                            <img src={PROC_IMAGES[p.id]} alt={p.name} style={{ width: '100%', height: 56, objectFit: 'contain', opacity: isActive ? 1 : 0.6 }} />
                            <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? gc : 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.2 }}>{p.name}</div>
                            <div style={{ fontSize: 9, color: isActive ? `${gc}90` : 'rgba(255,255,255,0.35)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{p.channels}CH</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 1: Connections */}
          {mobileStep === 1 && (
            <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {catalog.connections.map(c => {
                const isActive = selectedConn === c.id;
                const isAvail = availableConns.includes(c.id);
                const hasSelection = selectedProc || selectedFamily;
                const isDisabled = hasSelection && !isAvail;
                const connColor = GROUP_COLORS[c.group] || '#E8B600';
                const IconComp = CONN_ICONS[c.id];
                return (
                  <button key={c.id} onClick={() => { if (!isDisabled) { selectConnection(c.id); const cn = catalog.connections.find(x => x.id === c.id); const fams = cn ? catalog.camera_families.filter(f => f.group === cn.group) : []; setMobileStep(fams.length === 1 ? 3 : 2); } }} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px 20px',
                    background: isActive ? `${connColor}10` : 'rgba(255,255,255,0.02)',
                    border: isActive ? `2px solid ${connColor}40` : '2px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.4 : 1, filter: isDisabled ? 'grayscale(1)' : 'none',
                    fontFamily: 'inherit',
                  }}>
                    {IconComp && <IconComp active={isActive} />}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: isActive ? connColor : 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: isActive ? `${connColor}80` : 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{c.sublabel}</div>
                    </div>
                    {isActive && <div style={{ marginLeft: 'auto', fontSize: 18, color: connColor }}>✓</div>}
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2: Cameras */}
          {mobileStep === 2 && (
            <div style={{ padding: '16px 12px' }}>
              {CAM_GROUPS.map((group, gi) => {
                const gc = GROUP_COLORS[group.groupId];
                return (
                  <div key={gi} style={{ marginBottom: 12, border: `1px solid ${gc}33`, borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 0', textAlign: 'center', fontSize: 14, fontWeight: 900, letterSpacing: '0.18em', color: gc, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${gc}30`, background: `linear-gradient(180deg, ${gc}0A 0%, transparent 100%)` }}>{group.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
                      {group.ids.map(fid => {
                        const f = catalog.camera_families.find(fam => fam.id === fid);
                        if (!f) return null;
                        const isActive = selectedFamily === f.id;
                        const isAvail = availableFamilies.some(af => af.id === f.id);
                        const hasNarrow = selectedConn || selectedProc;
                        const isIncompat = hasNarrow && !isAvail;
                        return (
                          <button key={f.id} onClick={() => { if (!isIncompat) { selectFamily(f.id); setMobileStep(3); } }} style={{
                            background: isActive ? `${gc}10` : 'transparent',
                            border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            padding: '16px 8px', cursor: isIncompat ? 'not-allowed' : 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                            opacity: isIncompat ? 0.35 : 1, filter: isIncompat ? 'grayscale(1)' : 'none',
                          }}>
                            <img src={CAM_IMAGES[f.id]} alt={f.name} style={{ width: '100%', height: 64, objectFit: 'contain', opacity: isActive ? 1 : 0.6 }} />
                            <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? gc : 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.2 }}>{f.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 3: Detail */}
          {mobileStep === 3 && activeModel && activeFamily && (
            <MobileCameraDetail
              family={activeFamily}
              model={activeModel}
              models={models}
              selectedModel={selectedModel}
              onSelectModel={selectModel}
              conn={activeConn}
              proc={activeProc}
              connType={connType}
              onConnType={setConnType}
            />
          )}
          {mobileStep === 3 && !activeModel && !activeFamily && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
                <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 8 }}>No Camera Selected</div>
                <div style={{ fontSize: 13 }}>Tap the CAM tab to choose a camera</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── DESKTOP RENDER ───────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Hover styles — CSS needed for :hover pseudo-class */}
      <style>{`
        .proc-cell {
          transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94),
                      background 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }
        .proc-cell:hover {
          transform: scale(1.08);
          z-index: 10;
        }
        .cam-cell {
          transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94),
                      background 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }
        .cam-cell:hover {
          transform: scale(1.08);
          z-index: 10;
        }
        .stat-box {
          cursor: default;
        }
        .spec-cell {
          cursor: default;
        }
      `}</style>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>IDT</span>
          <span style={styles.logoSub}>CONFIGURATOR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#E8B600', fontFamily: "'JetBrains Mono', monospace", padding: '5px 12px', border: '1px solid rgba(232,182,0,0.3)', borderRadius: 4, background: 'rgba(232,182,0,0.06)' }}>MASTER ENGINE</span>
        </div>
        <button style={styles.resetBtn} onClick={handleReset}>RESET</button>
      </header>

      {/* MAIN LAYOUT — Luiz v1.0: Camera → Connection → Processor */}
      <div style={{ ...styles.main, position: 'relative' }} ref={mainRef}>
        {/* Canvas for cable drawing */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} />
        {/* PROCESSOR STRIP (order: 4 — rightmost before hero) */}
        <div ref={procStripRef} style={{ ...styles.strip, order: 4 }} data-strip="proc">
          {(() => {
            // Master Engine: ALL processors
            const PROC_GROUPS = [
              { label: 'FLEXIBLE', ids: ['rtv', 'rt4', 'rt3'], color: GROUP_COLORS.fiber },
              { label: 'PORTABLE', ids: ['tc2-2', 'tc2-1'], color: GROUP_COLORS.compact },
              { label: 'MINIATURE', ids: ['tb3'], color: GROUP_COLORS.compact },
              { label: 'CCM', ids: ['viper'], color: GROUP_COLORS.ccm },
            ];
            return PROC_GROUPS.map((group, gi) => {
              const gc = group.color;
              return (
              <div key={gi} style={{
                margin: '6px 6px 0',
                border: `2px solid ${gc}33`,
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                {group.label && (
                  <div style={{
                    width: '100%', padding: '16px 0 14px', textAlign: 'center',
                    fontSize: 28, fontWeight: 900, letterSpacing: '0.2em',
                    color: gc, fontFamily: "'JetBrains Mono', monospace",
                    borderBottom: `2px solid ${gc}30`,
                    background: `linear-gradient(180deg, ${gc}0A 0%, transparent 100%)`,
                  }}>{group.label}</div>
                )}
                {group.ids.map(pid => {
                  const p = catalog.processors.find(pr => pr.id === pid);
                  if (!p) return null;
                  const isActive = selectedProc === p.id;
                  const isProcAvail = availableProcs.includes(p.id);
                  const hasNarrow = selectedFamily || selectedConn;
                  const isBlocked = isProcessorBlocked(p.id, selectedFamily);
                  const isIncompat = isBlocked || (hasNarrow && !isProcAvail);
                  const blockReason = getBlockReason(p.id, selectedFamily);
                  return (
                    <button
                      key={p.id}
                      ref={el => { if (el) procRefs.current[p.id] = el; }}
                      className="proc-cell"
                      title={blockReason || ''}
                      style={{
                        ...styles.procCell,
                        borderLeft: isActive ? `3px solid ${gc}` : '3px solid transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                        background: isBlocked ? 'rgba(255,0,0,0.04)' : 'transparent',
                        opacity: isIncompat ? 0.35 : 1,
                        filter: isIncompat ? 'grayscale(1)' : 'none',
                        cursor: isBlocked ? 'not-allowed' : 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => !isBlocked && selectProcessor(p.id)}
                    >
                      {/* Channel badge */}
                      <div style={{
                        position: 'absolute', top: 6, right: 6,
                        background: isActive ? gc : 'rgba(255,255,255,0.08)',
                        color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>{p.maxCameras || p.channels}× CAM</div>
                      {/* Connection mode badge — on selected processor */}
                      {isActive && selectedFamily && (connType === 'dual' || connType === 'dual2' || connType === 'multi') && (
                        <div style={{
                          position: 'absolute', bottom: 6, right: 6,
                          background: '#4080D020', border: '1px solid #4080D050',
                          color: '#4080D0', fontSize: 9, fontWeight: 700, padding: '2px 6px',
                          borderRadius: 3, fontFamily: "'JetBrains Mono', monospace",
                        }}>{connType === 'dual' ? 'DUAL · P1 P2' : connType === 'dual2' ? 'DUAL ×2 · P1-P4' : `${p.channels}× SINGLE`}</div>
                      )}
                      {isBlocked && (
                        <div style={{
                          position: 'absolute', top: 6, left: 6,
                          background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)',
                          color: '#D94040', fontSize: 8, fontWeight: 700, padding: '2px 5px',
                          borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
                        }}>NOT ALLOWED</div>
                      )}
                      <img
                        src={PROC_IMAGES[p.id]}
                        alt={p.name}
                        style={{
                          width: '100%', height: '100%', objectFit: 'contain',
                          opacity: isActive ? 1 : isProcAvail && !isBlocked ? 0.65 : 0.3,
                          filter: isActive ? `drop-shadow(0 0 12px ${gc}20)` : 'none',
                          transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease, filter 0.3s ease',
                        }}
                      />
                      <div style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
                        color: isActive ? gc : isProcAvail ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1.3,
                      }}>
                        {p.name}
                      </div>
                      <div style={{
                        fontSize: 12, letterSpacing: '0.04em',
                        color: isActive ? `${gc}90` : 'rgba(255,255,255,0.45)',
                        textAlign: 'center',
                      }}>
                        {p.tagline}
                      </div>
                      <div style={{
                        fontSize: 11, letterSpacing: '0.06em', marginTop: 2,
                        color: isActive ? `${gc}70` : 'rgba(255,255,255,0.3)',
                        textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {p.channels}CH · {p.interface ? (p.interface.includes('Ethernet') ? 'Ethernet' : p.interface.includes('Fiber') && p.interface.includes('USB-C') ? 'Fiber + USB-C' : p.interface.includes('USB-C') ? 'USB-C' : 'Fiber') : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
              );
            })
          })()}
        </div>

        {/* CABLE GAP — canvas draws over this, small label only */}
        <div style={{ flex: '0 0 120px', background: 'transparent', order: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: selectedFamily && selectedProc ? 'pointer' : 'default', zIndex: 6 }} data-strip="cable-zone"
          onClick={() => {
            if (!selectedFamily || !selectedProc) return;
            const modes = connectionModes.map(m => m.id);
            if (modes.length < 2) return;
            const idx = modes.indexOf(connType);
            setConnType(modes[(idx + 1) % modes.length]);
          }}>
          {selectedFamily && selectedProc && (
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4080D0', letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', opacity: 0.7 }}>
              {connectionModes.find(m => m.id === connType)?.label || connType.toUpperCase()}
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>click cable to toggle</div>
            </div>
          )}
        </div>
        {/* CONNECTION STRIP — visible in Master Engine */}
        <div style={{ ...styles.strip, flex: '0 0 100px', order: 2 }} data-strip="conn">
          {modeConnections.map(c => {
            const isActive = selectedConn === c.id;
            const isAvail = availableConns.includes(c.id);
            const hasSelection = selectedProc || selectedFamily;
            const isDisabled = hasSelection && !isAvail;
            const IconComp = CONN_ICONS[c.id];
            const connColor = GROUP_COLORS[c.group] || '#E8B600';
            return (
              <div
                key={c.id}
                style={{
                  ...styles.connCell,
                  borderTop: 'none', borderLeft: 'none',
                  borderRight: isActive ? `2px solid ${connColor}` : '2px solid transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  background: isActive ? `${connColor}0A` : 'transparent',
                  opacity: isDisabled ? 0.5 : !hasSelection ? 0.7 : 1,
                  filter: isDisabled ? 'grayscale(1)' : 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease, filter 0.3s ease',
                }}
                onClick={() => selectConnection(c.id)}
              >
                {IconComp && <IconComp active={isActive} />}
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isActive ? connColor : isDisabled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
                  marginTop: 2,
                  letterSpacing: '0.04em',
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  color: isActive ? `${connColor}99` : isDisabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.45)',
                }}>
                  {c.sublabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* CAMERA STRIP (order: 1 — leftmost, Luiz flow: Camera first) */}
        <div ref={camStripRef} style={{ ...styles.strip, order: 1 }} data-strip="cam">
          {(() => {
            // Master Engine: ALL camera groups
            const CAM_GROUPS = [
              { label: 'XSTREAM FIBER', groupId: 'fiber', ids: ['helios', 'galileo', 'phoenix-gold', 'phoenix', 'phoenix-cr', 'xs2'] },
              { label: 'XSTREAM USB-C', groupId: 'compact', ids: ['os2-gold', 'os2', 'xsm', 'xstream', 'sugarcube'] },
              { label: 'ETHERNET', groupId: 'ccm', ids: ['ccs', 'ccm'] },
            ];
            return CAM_GROUPS.map((group, gi) => {
              const gc = GROUP_COLORS[group.groupId];
              return (
              <div key={gi} style={{
                margin: '6px 6px 0',
                border: `2px solid ${gc}33`,
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '100%', padding: '16px 0 14px', textAlign: 'center',
                  fontSize: 28, fontWeight: 900, letterSpacing: '0.2em',
                  color: gc, fontFamily: "'JetBrains Mono', monospace",
                  borderBottom: `2px solid ${gc}30`,
                  background: `linear-gradient(180deg, ${gc}0A 0%, transparent 100%)`,
                }}>{group.label}</div>
                {group.ids.map(fid => {
                  const f = catalog.camera_families.find(fam => fam.id === fid);
                  if (!f) return null;
                  const isActive = selectedFamily === f.id;
                  const isAvail = availableFamilies.some(af => af.id === f.id);
                  const hasNarrow = selectedConn || selectedProc;
                  const isIncompat = hasNarrow && !isAvail;
                  return (
                    <button
                      key={f.id}
                      ref={el => { if (el) camRefs.current[f.id] = el; }}
                      className="cam-cell"
                      style={{
                        ...styles.camCell,
                        borderRight: isActive ? `3px solid ${gc}` : '3px solid transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                        background: 'transparent',
                        opacity: isIncompat ? 0.45 : 1,
                        filter: isIncompat ? 'grayscale(1)' : 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => selectFamily(f.id)}
                    >
                      <img
                        src={CAM_IMAGES[f.id]}
                        alt={f.name}
                        style={{
                          width: '100%', height: '100%', objectFit: 'contain',
                          opacity: isActive ? 1 : isAvail ? 0.65 : 0.5,
                          filter: isActive ? `drop-shadow(0 0 12px ${gc}20)` : 'none',
                          transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease, filter 0.3s ease',
                        }}
                      />
                      <div style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
                        color: isActive ? gc : isAvail ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1.3,
                      }}>
                        {f.name}
                      </div>
                      {/* Connection mode badge on selected camera */}
                      {isActive && selectedProc && (connType === 'dual' || connType === 'dual2') && f.dualConnection && (
                        <div style={{
                          fontSize: 9, fontWeight: 700, color: '#4080D0', letterSpacing: '0.06em',
                          fontFamily: "'JetBrains Mono', monospace", marginTop: 4,
                          padding: '2px 8px', borderRadius: 3,
                          background: '#4080D020', border: '1px solid #4080D050',
                        }}>{connType === 'dual2' ? 'CAM 1 · FULL FPS' : 'DUAL · FULL FPS'}</div>
                      )}
                      {isActive && selectedProc && connType === 'multi' && (
                        <div style={{
                          fontSize: 9, fontWeight: 700, color: '#4080D0', letterSpacing: '0.06em',
                          fontFamily: "'JetBrains Mono', monospace", marginTop: 4,
                          padding: '2px 8px', borderRadius: 3,
                          background: '#4080D020', border: '1px solid #4080D050',
                        }}>CAM 1 of {catalog.processors.find(p => p.id === selectedProc)?.channels || 2}</div>
                      )}
                      {/* Model names below family name */}
                      {(() => {
                        const familyModels = catalog.models[f.id] || [];
                        return familyModels.length > 1 ? (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                            {familyModels.map(m => (
                              <span key={m.id} style={{
                                fontSize: 9, fontWeight: 500, letterSpacing: '0.02em',
                                color: isActive ? `${gc}` : 'rgba(255,255,255,0.45)',
                                fontFamily: "'JetBrains Mono', monospace",
                                border: `1px solid ${isActive ? `${gc}66` : 'rgba(255,255,255,0.12)'}`,
                                borderRadius: 16,
                                padding: '2px 8px',
                                background: 'transparent',
                              }}>
                                {m.name}
                              </span>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </button>
                  );
                })}
              </div>
              );
            })
          })()}
        </div>

        {/* HERO / COMBINED PANEL (order: 5 — rightmost) */}
        <div style={{ ...styles.hero, order: 5 }}>
          {/* Signal Chain Bar + View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1A1A1A', borderBottom: '1px solid #222', flexShrink: 0, padding: '0 24px' }}>
            <SignalChainBar proc={activeProc} conn={activeConn} family={activeFamily} model={activeModel} />
            <div style={{ display: 'flex', gap: 0 }}>
              {['detail', 'compare'].map(v => (
                <button key={v} onClick={() => setHeroView(v)} style={{
                  padding: '8px 18px', border: `1px solid ${heroView === v ? 'rgba(232,182,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 4, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                  background: heroView === v ? 'rgba(232,182,0,0.08)' : 'transparent',
                  color: heroView === v ? '#E8B600' : 'rgba(255,255,255,0.4)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginLeft: -1,
                  textTransform: 'uppercase',
                }}>
                  {v === 'detail' ? 'DETAIL' : 'COMPARE'}
                </button>
              ))}
            </div>
          </div>

          {/* Luiz v1.0: Connection Mode Selector */}
          {connectionModes.length > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
              background: '#111', borderBottom: '1px solid #222',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginRight: 8 }}>CONNECTION</span>
              {connectionModes.map(m => {
                const isActive = connType === m.id;
                return (
                  <button key={m.id} onClick={() => setConnType(m.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                    background: isActive ? `${m.color}12` : 'transparent',
                    border: isActive ? `1px solid ${m.color}50` : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6, cursor: 'pointer',
                  }}>
                    {/* Cable icon */}
                    <svg width="24" height="14" viewBox="0 0 24 14">
                      {m.cables >= 1 && <line x1="2" y1={m.cables === 1 ? "7" : "4"} x2="22" y2={m.cables === 1 ? "7" : "4"} stroke={isActive ? m.color : '#666'} strokeWidth="3" strokeLinecap="round" />}
                      {m.cables >= 2 && <line x1="2" y1="10" x2="22" y2="10" stroke={isActive ? m.color : '#666'} strokeWidth="3" strokeLinecap="round" />}
                    </svg>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? m.color : 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>{m.label}</div>
                      <div style={{ fontSize: 9, color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }}>{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Luiz v1.0: FPS Drop Warning */}
          {fpsDropWarning && connType === 'single' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px',
              background: 'rgba(220,160,0,0.08)', borderBottom: '1px solid rgba(220,160,0,0.2)',
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#E8B600', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
                {fpsDropWarning}
              </span>
            </div>
          )}

          {/* Content */}
          {heroView === 'compare' ? (
            <ComparisonTable catalog={catalog} selectedFamily={selectedFamily} />
          ) : (
            <>
              {!selectedProc && !selectedFamily && <EmptyState />}
              {selectedProc && !selectedFamily && (
                <ProcessorHero proc={activeProc} conns={availableConns} allConns={catalog.connections} selectedConn={selectedConn} procConfig={procConfig} setProcConfig={setProcConfig} />
              )}
              {selectedFamily && activeModel && (
                <CameraHero
                  key={activeFamily.id}
                  family={activeFamily}
                  model={activeModel}
                  models={models}
                  selectedModel={selectedModel}
                  onSelectModel={selectModel}
                  conn={activeConn}
                  proc={activeProc}
                  connType={connType}
                  onConnType={setConnType}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIGNAL CHAIN BAR ────────────────────────────────────────
function SignalChainBar({ proc, conn, family, model }) {
  // Luiz v1.0: Camera → Connection → Processor flow
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0' }}>
      <div style={styles.chainSegment}>
        <span style={styles.chainLabel}>CAMERA</span>
        <span style={styles.chainValue}>
          {model ? model.fullName : family ? family.name : '—'}
        </span>
      </div>
      <span style={styles.chainArrow}>→</span>
      <div style={styles.chainSegment}>
        <span style={styles.chainLabel}>CONNECTION</span>
        <span style={styles.chainValue}>
          {conn ? `${conn.sublabel} ${conn.label}` : '—'}
        </span>
      </div>
      <span style={styles.chainArrow}>→</span>
      <div style={styles.chainSegment}>
        <span style={styles.chainLabel}>PROCESSOR</span>
        <span style={styles.chainValue}>
          {proc ? proc.name : '—'}
        </span>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyTitle}>Build Your Signal Chain</div>
      <div style={styles.emptySubtitle}>Select a processor or camera to begin configuring your IDT camera system</div>
      <div style={styles.emptySteps}>
        {['Processor', 'Connection', 'Camera Family', 'Model'].map((step, i) => (
          <React.Fragment key={step}>
            {i > 0 && <span style={styles.emptyArrow}>→</span>}
            <div style={styles.emptyStep}>
              <div style={styles.emptyStepNum}>0{i + 1}</div>
              <div style={styles.emptyStepLabel}>{step}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── PROCESSOR CONFIG PANEL (Luiz v1.0) ─────────────────────
function ProcessorConfigPanel({ proc, procConfig, setProcConfig }) {
  if (!proc || !proc.configOptions) return null;
  const opts = proc.configOptions;
  const cfg = procConfig || {};

  const SelectRow = ({ label, options, unit, field, fixed, fixedValue }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {fixed ? (
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
          {fixedValue} {unit} <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>FIXED</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          {options.map(v => {
            const isActive = (cfg[field] || options[0]) === v;
            return (
              <button key={v} onClick={() => setProcConfig({ ...cfg, [field]: v })} style={{
                background: isActive ? 'rgba(232,182,0,0.12)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid rgba(232,182,0,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: isActive ? '#E8B600' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, padding: '6px 14px', borderRadius: 4,
                cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              }}>{v} {unit}</button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ margin: '16px 32px', padding: '20px 24px', background: 'rgba(232,182,0,0.03)', border: '1px solid rgba(232,182,0,0.12)', borderRadius: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#E8B600', letterSpacing: '0.12em', marginBottom: 16 }}>CONFIGURE PROCESSOR</div>
      {opts.ramFixed && <SelectRow label="DDR / RAM" fixed fixedValue={opts.ram} unit={opts.ramUnit} />}
      {opts.ddr && <SelectRow label="DDR / RAM" options={opts.ddr} unit={opts.ddrUnit} field="ddr" />}
      {opts.osDisk && <SelectRow label="OS DISK" fixed fixedValue="Included" unit="" />}
      {opts.storage && <SelectRow label="STORAGE" options={opts.storage} unit={opts.storageUnit} field="storage" />}
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', marginTop: 8 }}>
        Configuration options affect pricing only — camera performance unchanged
      </div>
    </div>
  );
}

// ─── PROCESSOR HERO ──────────────────────────────────────────
function ProcessorHero({ proc, conns, allConns, selectedConn, procConfig, setProcConfig }) {
  if (!proc) return null;
  return (
    <div style={styles.heroContent}>
      <div style={styles.heroImageWrap}>
        <div style={styles.heroGlow} />
        <img src={PROC_IMAGES[proc.id]} alt={proc.name} style={styles.heroImage} />
      </div>
      <div style={styles.heroIdentity}>
        <div style={styles.heroTagline}>{proc.tagline}</div>
        <div style={styles.heroName}>{proc.name}</div>
        <div style={styles.heroBadgeRow}>
          {conns.map(cId => {
            const c = allConns.find(x => x.id === cId);
            if (!c) return null;
            const isActive = selectedConn === cId;
            return (
              <span key={cId} style={{
                ...styles.heroBadge,
                borderColor: isActive ? '#E8B600' : '#333',
                color: isActive ? '#E8B600' : '#888',
                background: isActive ? 'rgba(232,182,0,0.06)' : 'transparent',
              }}>
                {c.label} {c.sublabel}
                {c.mult !== 1 && <span style={{ opacity: 0.5, marginLeft: 4 }}>({c.mult}×)</span>}
              </span>
            );
          })}
        </div>
        <div style={styles.heroHint}>
          Select a connection type{selectedConn ? ', then choose a camera' : ''}
        </div>
      </div>
      {/* Processor specs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginTop: 24, padding: '24px 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 200, color: 'rgba(255,255,255,0.9)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, letterSpacing: '-0.04em' }}>{proc.channels || '—'}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8 }}>{proc.channels === 1 ? 'CHANNEL' : 'CHANNELS'}</div>
        </div>
        <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>FORM FACTOR</div>
            <div style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', sans-serif" }}>{proc.formFactor || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>INTERFACE</div>
            <div style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', sans-serif" }}>{proc.interface || '—'}</div>
          </div>
        </div>
      </div>
      {proc.desc && (
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.5, marginTop: 8, padding: '0 32px', fontStyle: 'italic' }}>
          {proc.desc}
        </div>
      )}
      {/* Luiz v1.0: Processor Configuration */}
      <ProcessorConfigPanel proc={proc} procConfig={procConfig} setProcConfig={setProcConfig} />
    </div>
  );
}

// ─── STANDARD RESOLUTION TIERS (for windowed FPS) ────────────
const RESOLUTION_TIERS = [
  { label: '8K',  width: 8192, height: 8192 },
  { label: '6K',  width: 6400, height: 5120 },
  { label: 'UHD', width: 3840, height: 2160 },
  { label: 'HD',  width: 1920, height: 1080 },
];

// ─── CAMERA HERO ─────────────────────────────────────────────
function CameraHero({ family, model, models, selectedModel, onSelectModel, conn, proc, connType, onConnType }) {
  if (!model) return null;
  // FPS logic:
  // Dual-capable families (galileo, phoenix-gold, phoenix): spec FPS = dual (2CH) speed, single = half
  // Single-only families (helios, phoenix-cr, xs2): spec FPS is the actual FPS, no halving
  // USB-C / Ethernet: always spec FPS
  const rawFps = parseInt(model.fps.replace(/,/g, ''), 10);
  const isDualCapable = family.dualConnection === true;
  // In dual mode: 2 channels per camera. In multi/single: 1 channel per camera.
  const isDualMode = connType === 'dual' || connType === 'dual2';
  const chPerConn = isDualMode ? 2 : 1;
  let fpsMult = 1;
  if (proc && family.group === 'fiber' && isDualCapable) {
    // Dual-capable cameras: spec FPS = dual speed. Single/multi = half (each cam gets 1CH).
    fpsMult = isDualMode ? 1 : 0.5;
  }
  const adjustedFps = Math.round(rawFps * fpsMult).toLocaleString();
  const connOptions = (proc && isDualCapable) ? (proc.connectionOptions || ['single']) : ['single'];
  // Camera count based on mode
  let cameraCount = 1;
  if (proc) {
    if (connType === 'multi') {
      cameraCount = proc.channels; // all channels, 1 camera each
    } else if (connType === 'dual2') {
      cameraCount = 2; // dual ×2 = 2 cameras at full FPS
    } else if (connType === 'dual') {
      cameraCount = 1; // dual always = 1 camera
    } else {
      cameraCount = 1; // single = 1 camera (channels free for more)
    }
  }

  // Build resolution → FPS table: native row + all standard tiers below native
  const [nativeW, nativeH] = model.res.split('×').map(s => parseInt(s.trim(), 10));
  // Check if native res matches a standard tier label
  const nativeTier = RESOLUTION_TIERS.find(t => t.width === nativeW && t.height === nativeH);
  const nativeLabel = nativeTier ? nativeTier.label : 'FULL SENSOR';
  const adjustedFpsNum = Math.round(rawFps * fpsMult);
  // All tiers: native first, then windowed tiers below
  const allTiers = [
    { label: nativeLabel, res: model.res, fps: adjustedFpsNum, isNative: true },
    ...RESOLUTION_TIERS
      .filter(tier => nativeW >= tier.width && nativeH > tier.height)
      .map(tier => ({
        label: tier.label,
        res: `${tier.width} × ${tier.height}`,
        fps: Math.round(rawFps * fpsMult * (nativeH / tier.height)),
        isNative: false,
      })),
  ];

  const [activeAngle, setActiveAngle] = useState(0);

  const angles = CAM_ANGLES[family.id] || [CAM_IMAGES[family.id]];

  // Find the highest-FPS tier for the hero number
  const maxTier = allTiers.reduce((best, t) => t.fps > best.fps ? t : best, allTiers[0]);

  return (
    <div style={styles.heroContent}>
      {/* ── 1. NAME — top ── */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 24, marginBottom: 0, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(232,182,0,0.5)', letterSpacing: '0.14em' }}>
          {family.group === 'fiber' ? 'XSTREAM FIBER' : family.group === 'compact' ? 'XSTREAM USB-C' : 'ETHERNET'}
        </div>
        <div style={{ fontSize: 47, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>
          {model.fullName}
        </div>
      </div>

      {/* ── 2. HERO IMAGE — centered, tight crop ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flexShrink: 0 }}>
        <div style={{ width: 744, height: 384, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={angles[activeAngle]} alt={family.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.5))', transform: 'scale(1.1)' }} />
        </div>
      </div>

      {/* ── 3. THUMBNAILS — below hero ── */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%', flexShrink: 0, marginTop: 8, marginBottom: 4 }}>
        {angles.map((src, i) => (
          <button key={i} onClick={() => setActiveAngle(i)} style={{
            ...styles.thumbBtn, width: 100, height: 100,
            ...(activeAngle === i ? styles.thumbBtnActive : {}),
          }}>
            <img src={src} alt={`View ${i + 1}`} style={styles.thumbImg} />
          </button>
        ))}
      </div>

      {/* ── 4. MODEL PILLS ── */}
      {models.length > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', width: '100%', maxWidth: 640, margin: '12px auto 0', flexShrink: 0 }}>
          {models.map(m => (
            <button
              key={m.id}
              style={{
                ...styles.modelPill,
                padding: '6px 16px', fontSize: 12,
                ...(selectedModel === m.id ? styles.modelPillActive : {}),
              }}
              onClick={() => onSelectModel(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      {/* ── 4. CONNECTION MODE STATUS ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', maxWidth: 640, margin: '12px auto 0', padding: '0', gap: 10, flexShrink: 0,
      }}>
        {/* Cable icon */}
        <svg width="32" height="16" viewBox="0 0 32 16">
          {isDualMode ? (
            <>
              <line x1="2" y1="4" x2="30" y2="4" stroke="#4080D0" strokeWidth="3" strokeLinecap="round" />
              <line x1="2" y1="12" x2="30" y2="12" stroke="#4080D0" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <line x1="2" y1="8" x2="30" y2="8" stroke={GROUP_COLORS.fiber} strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>
        <span style={{
          fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
          color: isDualMode ? '#4080D0' : 'rgba(255,255,255,0.4)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {isDualMode ? `DUAL${connType === 'dual2' ? ' ×2' : ''} · ${cameraCount === 1 ? '1 camera' : `${cameraCount} cameras`} · FULL FPS` : connType === 'multi' ? `${cameraCount}× SINGLE · ${cameraCount} cameras${isDualCapable ? ' · ⚠ HALF FPS' : ''}` : `SINGLE · ${cameraCount} camera${isDualCapable ? ' · ⚠ HALF FPS' : ''}`}
        </span>
      </div>

      {/* ── 5. FPS — center stage ── */}
      <div style={{
        width: '100%', maxWidth: 640,
        flexShrink: 0,
        margin: '12px auto 0',
        border: '1px solid rgba(232,182,0,0.25)',
        borderRadius: 10,
        background: 'linear-gradient(180deg, rgba(232,182,0,0.04) 0%, rgba(0,0,0,0.3) 100%)',
        padding: '24px 36px 20px',
      }}>
        {allTiers.map((tier, idx) => {
          const isLast = idx === allTiers.length - 1;
          const tierCount = allTiers.length;
          const fpsSize = tier.isNative
            ? (tierCount === 1 ? 88 : 32)
            : isLast ? 88 : 32 + Math.round((idx / Math.max(tierCount - 1, 1)) * 48);
          const fpsColor = tier.isNative
            ? (tierCount === 1 ? '#E8B600' : 'rgba(255,255,255,0.45)')
            : isLast ? '#E8B600' : `rgba(255,255,255,${0.35 + (idx / Math.max(tierCount - 1, 1)) * 0.5})`;
          const fpsWeight = (isLast || tierCount === 1) ? 600 : 400;
          return (
            <div key={tier.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: (isLast && tierCount > 1) ? '20px 8px 10px' : '8px',
              background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              borderRadius: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 4,
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
                  background: tier.isNative ? 'rgba(232,182,0,0.18)' : 'rgba(255,255,255,0.05)',
                  color: tier.isNative ? '#E8B600' : 'rgba(255,255,255,0.4)',
                  minWidth: 42, textAlign: 'center',
                }}>
                  {tier.label}
                </span>
                <span style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.2)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {tier.res}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{
                  fontSize: fpsSize, fontWeight: fpsWeight, letterSpacing: '-0.04em',
                  color: fpsColor, fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1,
                }}>
                  {tier.fps.toLocaleString()}
                </span>
                <span style={{
                  fontSize: (isLast && tierCount > 1) ? 20 : 14,
                  color: (isLast || tierCount === 1) ? 'rgba(232,182,0,0.5)' : 'rgba(255,255,255,0.2)',
                  fontWeight: 400,
                }}>fps</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 6. Specs — 3×2 grid in boxes, aligned with FPS box ── */}
      <div style={{ width: '100%', maxWidth: 640, margin: '12px auto 0', flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, boxSizing: 'border-box' }}>
        {[
          { label: 'SENSOR', value: model.sensor ? `${model.sensor} mm` : '—' },
          { label: 'PIXEL', value: model.pixel ? `${model.pixel} µm` : '—' },
          { label: 'DEPTH', value: model.depth || '—' },
          { label: 'ISO', value: `${model.isoMono || '—'} / ${model.isoColor || '—'}` },
          { label: 'MOUNT', value: model.mount || '—' },
          { label: 'WEIGHT', value: model.weight || '—' },
        ].map(s => (
          <div key={s.label} style={{
            textAlign: 'center',
            padding: '14px 12px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MOBILE CAMERA DETAIL ────────────────────────────────────
function MobileCameraDetail({ family, model, models, selectedModel, onSelectModel, conn, proc, connType, onConnType }) {
  if (!model) return null;
  const rawFps = parseInt(model.fps.replace(/,/g, ''), 10);
  const isDualCapable = family.dualConnection === true;
  const fpsMult = (proc && family.group === 'fiber' && isDualCapable) ? ((connType === 'dual' || connType === 'dual2') ? 1 : 0.5) : 1;
  const adjustedFps = Math.round(rawFps * fpsMult);
  const connOptions = (proc && isDualCapable) ? (proc.connectionOptions || ['single']) : ['single'];

  const [nativeW, nativeH] = model.res.split('×').map(s => parseInt(s.trim(), 10));
  const nativeTier = RESOLUTION_TIERS.find(t => t.width === nativeW && t.height === nativeH);
  const nativeLabel = nativeTier ? nativeTier.label : 'FULL SENSOR';
  const allTiers = [
    { label: nativeLabel, res: model.res, fps: adjustedFps, isNative: true },
    ...RESOLUTION_TIERS
      .filter(tier => nativeW >= tier.width && nativeH > tier.height)
      .map(tier => ({
        label: tier.label,
        res: `${tier.width} × ${tier.height}`,
        fps: Math.round(rawFps * fpsMult * (nativeH / tier.height)),
        isNative: false,
      })),
  ];
  const maxTier = allTiers.reduce((best, t) => t.fps > best.fps ? t : best, allTiers[0]);

  const [activeAngle, setActiveAngle] = useState(0);
  const angles = CAM_ANGLES[family.id] || [CAM_IMAGES[family.id]];

  return (
    <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Name */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(232,182,0,0.5)', letterSpacing: '0.14em' }}>
          {family.group === 'fiber' ? 'XSTREAM FIBER' : family.group === 'compact' ? 'XSTREAM USB-C' : 'ETHERNET'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 2 }}>
          {model.fullName}
        </div>
      </div>

      {/* Hero Image */}
      <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={angles[activeAngle]} alt={family.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }} />
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {angles.map((src, i) => (
          <button key={i} onClick={() => setActiveAngle(i)} style={{
            width: 48, height: 48, borderRadius: 6, padding: 2,
            border: activeAngle === i ? '1px solid rgba(232,182,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
            background: activeAngle === i ? 'rgba(232,182,0,0.03)' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={src} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
        ))}
      </div>

      {/* Model Pills */}
      {models.length > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {models.map(m => (
            <button key={m.id} onClick={() => onSelectModel(m.id)} style={{
              background: selectedModel === m.id ? 'rgba(232,182,0,0.08)' : 'transparent',
              border: selectedModel === m.id ? '1px solid #E8B600' : '1px solid rgba(255,255,255,0.12)',
              color: selectedModel === m.id ? '#E8B600' : 'rgba(255,255,255,0.45)',
              fontSize: 11, fontWeight: 500, padding: '5px 14px', borderRadius: 20,
              cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em',
            }}>
              {m.name}
            </button>
          ))}
        </div>
      )}

      {/* Single / Dual toggle */}
      {proc && connOptions.length > 1 && family.group === 'fiber' && (
        <div style={{ display: 'flex', gap: 0 }}>
          {connOptions.map(ct => {
            const isAct = connType === ct;
            return (
              <button key={ct} onClick={() => onConnType(ct)} style={{
                padding: '5px 14px', border: `1px solid ${isAct ? 'rgba(232,182,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 4, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                background: isAct ? 'rgba(232,182,0,0.08)' : 'transparent', marginRight: -1,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: isAct ? '#E8B600' : 'rgba(255,255,255,0.4)' }}>
                  {ct === 'dual' ? 'DUAL' : 'SINGLE'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* FPS Hero Number */}
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <div style={{ fontSize: 56, fontWeight: 600, color: '#E8B600', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.04em', lineHeight: 1 }}>
          {maxTier.fps.toLocaleString()}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(232,182,0,0.5)', fontWeight: 400 }}>fps @ {maxTier.label}</div>
      </div>

      {/* FPS Tiers */}
      <div style={{ width: '100%', border: '1px solid rgba(232,182,0,0.2)', borderRadius: 8, overflow: 'hidden' }}>
        {allTiers.map((tier, idx) => (
          <div key={tier.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
            borderBottom: idx < allTiers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: 3,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                background: tier.isNative ? 'rgba(232,182,0,0.18)' : 'rgba(255,255,255,0.05)',
                color: tier.isNative ? '#E8B600' : 'rgba(255,255,255,0.4)', minWidth: 36, textAlign: 'center',
              }}>{tier.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>{tier.res}</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>
              {tier.fps.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>fps</span>
            </span>
          </div>
        ))}
      </div>

      {/* Specs Grid — 2×3 */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, marginTop: 4 }}>
        {[
          { label: 'SENSOR', value: model.sensor ? `${model.sensor} mm` : '—' },
          { label: 'PIXEL', value: model.pixel ? `${model.pixel} µm` : '—' },
          { label: 'DEPTH', value: model.depth || '—' },
          { label: 'ISO', value: `${model.isoMono || '—'} / ${model.isoColor || '—'}` },
          { label: 'MOUNT', value: model.mount || '—' },
          { label: 'WEIGHT', value: model.weight || '—' },
        ].map(s => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '12px 8px',
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEATURE COLORS ─────────────────────────────────────────
const FEATURE_COLORS = {
  resolution: '#E8B600',   // gold
  dual:      '#00BCD4',    // cyan
  depth:     '#AB47BC',    // purple
  mount:     '#FF7043',    // orange
};

// ─── COMPARISON TABLE ───────────────────────────────────────
function ComparisonTable({ catalog, selectedFamily }) {
  const GROUPS = [
    { label: 'XSTREAM FIBER', groupId: 'fiber', ids: ['helios', 'galileo', 'phoenix-gold', 'phoenix', 'phoenix-cr', 'xs2'] },
    { label: 'XSTREAM USB-C', groupId: 'compact', ids: ['os2-gold', 'os2', 'xsm', 'xstream', 'sugarcube'] },
    { label: 'ETHERNET', groupId: 'ccm', ids: ['ccs', 'ccm'] },
  ];

  const [activeGroup, setActiveGroup] = useState(() => {
    if (selectedFamily) {
      const fam = catalog.camera_families.find(f => f.id === selectedFamily);
      if (fam) return fam.group;
    }
    return 'fiber';
  });

  const [pinned, setPinned] = useState([]); // pinned model IDs for side-by-side
  const [sortKey, setSortKey] = useState(null); // null = default (family order), or spec key
  const [sortDir, setSortDir] = useState('desc'); // 'asc' or 'desc'

  const group = GROUPS.find(g => g.groupId === activeGroup);
  const gc = GROUP_COLORS[activeGroup];

  // All models in active group
  const allRowsUnsorted = group.ids.flatMap(fid => {
    const fam = catalog.camera_families.find(f => f.id === fid);
    const models = catalog.models[fid] || [];
    return models.map(m => ({ family: fam, model: m }));
  }).filter(r => r.family && r.model);

  const SPEC_COLS = [
    { key: 'res', label: 'RES', format: (m) => m.res, sortVal: (m) => { const p = m.res.split('×').map(s => parseInt(s.trim(),10)); return p[0] * p[1]; } },
    { key: 'fps', label: 'MAX FPS', format: (m) => m.fps, color: FEATURE_COLORS.resolution, sortVal: (m) => parseInt((m.fps||'0').replace(/,/g,''),10) },
    { key: 'sensor', label: 'SENSOR', format: (m) => m.sensor ? `${m.sensor} mm` : '—', sortVal: (m) => parseFloat(m.sensor) || 0 },
    { key: 'pixel', label: 'PIXEL', format: (m) => m.pixel ? `${m.pixel} µm` : '—', sortVal: (m) => parseFloat(m.pixel) || 0 },
    { key: 'depth', label: 'DEPTH', format: (m) => m.depth || '—', color: FEATURE_COLORS.depth, sortVal: (m) => parseInt(m.depth) || 0 },
    { key: 'iso', label: 'ISO (M/C)', format: (m) => `${m.isoMono || '—'} / ${m.isoColor || '—'}`, sortVal: (m) => parseInt((m.isoMono||'0').replace(/,/g,''),10) },
    { key: 'mount', label: 'MOUNT', format: (m) => m.mount || '—', color: FEATURE_COLORS.mount, sortVal: (m) => m.mount || '' },
    { key: 'weight', label: 'WEIGHT', format: (m) => m.weight || '—', sortVal: (m) => parseInt(m.weight) || 0 },
  ];

  // Sort rows
  const allRows = useMemo(() => {
    if (!sortKey) return allRowsUnsorted;
    const spec = SPEC_COLS.find(s => s.key === sortKey);
    if (!spec) return allRowsUnsorted;
    const sorted = [...allRowsUnsorted].sort((a, b) => {
      const va = spec.sortVal(a.model);
      const vb = spec.sortVal(b.model);
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return sorted;
  }, [allRowsUnsorted, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'desc') setSortDir('asc');
      else { setSortKey(null); setSortDir('desc'); } // third click resets
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const togglePin = (modelId) => {
    setPinned(prev => prev.includes(modelId) ? prev.filter(id => id !== modelId) : prev.length < 4 ? [...prev, modelId] : prev);
  };

  // Pinned side-by-side view
  const pinnedRows = pinned.length > 0 ? allRows.filter(r => pinned.includes(r.model.id)) : [];

  // Track which family we last saw so we can insert group headers (only when not sorting)
  let lastFamilyId = null;

  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 8px' }}>
      {/* Group filter tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
        {GROUPS.map(g => {
          const gColor = GROUP_COLORS[g.groupId];
          const isAct = activeGroup === g.groupId;
          return (
            <button key={g.groupId} onClick={() => { setActiveGroup(g.groupId); setPinned([]); setSortKey(null); setSortDir('desc'); }} style={{
              padding: '10px 24px', border: `1px solid ${isAct ? gColor + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 4, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              background: isAct ? gColor + '15' : 'transparent',
              color: isAct ? gColor : 'rgba(255,255,255,0.35)',
              fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', marginRight: -1,
            }}>
              {g.label}
            </button>
          );
        })}
        {pinned.length > 0 && (
          <button onClick={() => setPinned([])} style={{
            marginLeft: 'auto', padding: '10px 18px', border: '1px solid rgba(232,182,0,0.3)',
            borderRadius: 4, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            background: 'rgba(232,182,0,0.08)', color: '#E8B600',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          }}>
            CLEAR PINS ({pinned.length})
          </button>
        )}
      </div>

      {/* Pinned side-by-side comparison */}
      {pinnedRows.length >= 2 && (
        <div style={{ marginBottom: 24, borderRadius: 8, border: `1px solid #E8B60040`, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(232,182,0,0.06)', borderBottom: '1px solid rgba(232,182,0,0.15)' }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: '#E8B600', fontFamily: "'JetBrains Mono', monospace" }}>SIDE-BY-SIDE</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(232,182,0,0.03)' }}>
                <th style={{ width: 140, padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }} />
                {pinnedRows.map(r => (
                  <th key={r.model.id} style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={CAM_IMAGES[r.family.id]} alt={r.model.fullName} style={{ width: 56, height: 56, objectFit: 'contain', opacity: 0.85, marginBottom: 4 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E8B600', whiteSpace: 'nowrap' }}>{r.model.fullName}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_COLS.map((spec, si) => (
                <tr key={spec.key} style={{ background: si % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                  <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: spec.color || 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{spec.label}</td>
                  {pinnedRows.map(r => {
                    const val = spec.format(r.model, r.family);
                    const isDot = spec.isDot && val === '●';
                    return (
                      <td key={r.model.id} style={{ padding: '10px 16px', textAlign: 'center', fontSize: isDot ? 20 : 14, fontWeight: 500, color: isDot ? (spec.color || gc) : val === '—' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.75)', fontFamily: "'JetBrains Mono', monospace", borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{val}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full spec sheet — models as rows */}
      <div style={{ borderRadius: 8, border: `1px solid ${gc}30`, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: `${gc}08` }}>
              <th style={{ width: 30, padding: '10px 4px', borderBottom: `2px solid ${gc}30`, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>PIN</span>
              </th>
              <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: `2px solid ${gc}30`, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: gc, fontFamily: "'JetBrains Mono', monospace" }}>MODEL</span>
              </th>
              {SPEC_COLS.map(spec => {
                const isSorted = sortKey === spec.key;
                return (
                  <th key={spec.key} onClick={() => handleSort(spec.key)} style={{
                    padding: '10px 6px', textAlign: 'center', borderBottom: `2px solid ${gc}30`, borderRight: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: isSorted ? '#E8B600' : spec.color || 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', userSelect: 'none', background: isSorted ? 'rgba(232,182,0,0.06)' : 'transparent',
                  }}>
                    {spec.label} {isSorted ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, ri) => {
              const showFamilyHeader = row.family.id !== lastFamilyId;
              lastFamilyId = row.family.id;
              const isPinned = pinned.includes(row.model.id);
              const isSel = selectedFamily === row.family.id;
              return (
                <React.Fragment key={row.model.id}>
                  {showFamilyHeader && !sortKey && (
                    <tr>
                      <td colSpan={SPEC_COLS.length + 2} style={{
                        padding: '10px 16px', background: `${gc}08`,
                        borderBottom: `1px solid ${gc}20`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={CAM_IMAGES[row.family.id]} alt={row.family.name} style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.7 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: gc, letterSpacing: '0.06em' }}>{row.family.name}</span>
                          {row.family.dualConnection && <span style={{ fontSize: 10, color: FEATURE_COLORS.dual, border: `1px solid ${FEATURE_COLORS.dual}40`, borderRadius: 3, padding: '1px 6px', fontWeight: 600 }}>DUAL</span>}
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr style={{
                    background: isPinned ? 'rgba(232,182,0,0.06)' : isSel ? `${gc}06` : ri % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                    cursor: 'pointer',
                  }} onClick={() => togglePin(row.model.id)}>
                    <td style={{ padding: '8px 4px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                        border: isPinned ? '2px solid #E8B600' : '1px solid rgba(255,255,255,0.15)',
                        background: isPinned ? 'rgba(232,182,0,0.15)' : 'transparent',
                        fontSize: 11, color: '#E8B600',
                      }}>
                        {isPinned ? '✓' : ''}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isPinned ? '#E8B600' : 'rgba(255,255,255,0.8)' }}>{row.model.fullName}</span>
                    </td>
                    {SPEC_COLS.map(spec => {
                      const val = spec.format(row.model, row.family);
                      const isDot = spec.isDot && val === '●';
                      return (
                        <td key={spec.key} style={{
                          padding: '10px 6px', textAlign: 'center',
                          fontSize: isDot ? 18 : 12, fontWeight: sortKey === spec.key ? 600 : (isDot ? 400 : 500),
                          color: isDot ? (spec.color || gc) : val === '—' ? 'rgba(255,255,255,0.15)' : sortKey === spec.key ? '#E8B600' : 'rgba(255,255,255,0.7)',
                          fontFamily: "'JetBrains Mono', monospace",
                          borderRight: '1px solid rgba(255,255,255,0.06)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: sortKey === spec.key ? 'rgba(232,182,0,0.04)' : 'transparent',
                          whiteSpace: 'nowrap',
                        }}>{val}</td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = {
  root: {
    position: isEmbed ? 'relative' : 'fixed',
    inset: isEmbed ? undefined : 0,
    width: '100%',
    height: isEmbed ? '100vh' : undefined,
    background: '#0A0A0A',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  },
  // Header
  header: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  },
  logo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: '#E8B600',
    letterSpacing: '0.08em',
  },
  logoSub: {
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.12em',
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },

  // Main layout
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },

  // Strips
  strip: {
    flex: '0 0 280px',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    background: '#0D0D0D',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  stripLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.35)',
    padding: '14px 0 8px',
    textAlign: 'center',
  },

  // Group box + label styles applied inline with per-group colors
  procCell: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '36px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    transformOrigin: 'center center',
    fontFamily: 'inherit',
  },
  camCell: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    transformOrigin: 'center center',
    fontFamily: 'inherit',
  },
  // Radial gold glow overlay for active cells
  cellGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 60% 40%, rgba(232,182,0,0.06), transparent 70%)',
    pointerEvents: 'none',
  },

  // Connection cells
  connCell: {
    width: '100%',
    background: 'transparent',
    padding: '16px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  connCellActive: {},

  // Hero Panel
  hero: {
    flex: 1,
    background: '#111',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Signal Chain Bar
  chainBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: '14px 24px',
    background: '#1A1A1A',
    borderBottom: '1px solid #222',
    flexShrink: 0,
  },
  chainSegment: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  chainLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.4)',
  },
  chainValue: {
    fontSize: 15,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  chainArrow: {
    color: '#E8B600',
    fontSize: 16,
    opacity: 0.5,
  },

  // Empty State
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 38,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: '-0.02em',
  },
  emptySubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.2)',
    marginBottom: 32,
  },
  emptySteps: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  emptyArrow: {
    color: 'rgba(232,182,0,0.2)',
    fontSize: 14,
  },
  emptyStep: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: '16px 24px',
    textAlign: 'center',
  },
  emptyStepNum: {
    fontSize: 13,
    color: 'rgba(232,182,0,0.4)',
    letterSpacing: '0.1em',
    marginBottom: 4,
  },
  emptyStepLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.35)',
  },

  // Hero Content — Swiss grid
  heroContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    padding: '8px 48px 32px',
    overflowY: 'auto',
  },
  heroIdentity: {
    textAlign: 'center',
    width: '100%',
    marginBottom: 12,
  },
  heroTagline: {
    fontSize: 16,
    fontWeight: 600,
    color: 'rgba(232,182,0,0.55)',
    letterSpacing: '0.16em',
    marginBottom: 4,
  },
  heroName: {
    fontSize: 40,
    fontWeight: 300,
    color: '#fff',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  heroNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heroImageWrap: {
    position: 'relative',
    width: '100%',
    height: 360,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.4))',
  },

  // Angle thumbnails
  thumbRow: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  thumbBtn: {
    width: 44,
    height: 44,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  thumbBtnActive: {
    borderColor: 'rgba(232,182,0,0.4)',
    background: 'rgba(232,182,0,0.03)',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  // Processor hero badges
  heroBadgeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  heroBadge: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.04em',
    padding: '7px 16px',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  heroHint: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 6,
  },

  // FPS + Resolution stat boxes
  heroStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    marginTop: 16,
  },
  heroStatBox: {
    padding: '22px 18px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 0,
    background: 'rgba(255,255,255,0.02)',
    position: 'relative',
  },
  heroStatLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroStatValueBig: {
    fontSize: 72,
    fontWeight: 200,
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  heroStatValue: {
    fontSize: 30,
    fontWeight: 200,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  heroStatUnit: {
    fontSize: 18,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.02em',
  },

  // Secondary Specs — flush 4+3 grid
  secondarySpecs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 0,
    width: '100%',
    marginTop: 0,
  },
  secondarySpecsRow2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    width: '100%',
  },
  secondarySpec: {
    padding: '10px 12px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 0,
    background: 'rgba(255,255,255,0.02)',
    position: 'relative',
  },
  secondaryLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  secondaryValue: {
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.3,
  },

  // Model Row
  modelRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  modelPill: {
    background: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
    fontWeight: 500,
    padding: '8px 24px',
    borderRadius: 24,
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  },
  modelPillActive: {
    borderColor: '#E8B600',
    color: '#E8B600',
    background: 'rgba(232,182,0,0.08)',
  },
};
