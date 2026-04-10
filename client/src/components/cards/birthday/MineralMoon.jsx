import { useEffect, useRef } from 'react';

const W = 300, H = 400, MCX = 150, MCY = 400, MR = 170;

export default function MineralMoon({ toName = '', fromName = '', message = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const mc = canvasRef.current;
    if (!mc) return;
    const dpr = window.devicePixelRatio || 1;
    mc.width = W * dpr; mc.height = H * dpr;
    const ctx = mc.getContext('2d');
    ctx.scale(dpr, dpr);
    let t = 0;
    let raf;

    const off = document.createElement('canvas');
    off.width = W * dpr; off.height = H * dpr;
    const oc = off.getContext('2d');
    oc.scale(dpr, dpr);

    function buildMoon(img) {
      oc.clearRect(0, 0, W, H);
      oc.save();
      oc.beginPath(); oc.arc(MCX, MCY, MR, 0, Math.PI * 2); oc.clip();
      oc.drawImage(img, MCX - MR, MCY - MR, MR * 2, MR * 2);
      const tint = oc.createRadialGradient(MCX, MCY, 0, MCX, MCY, MR);
      tint.addColorStop(0, 'rgba(80,110,210,0.08)');
      tint.addColorStop(0.6, 'rgba(55,85,190,0.14)');
      tint.addColorStop(1, 'rgba(30,55,160,0.22)');
      oc.fillStyle = tint; oc.fillRect(0, 0, W, H);
      const hl = oc.createRadialGradient(MCX - 50, MCY - 80, 0, MCX - 30, MCY - 50, 120);
      hl.addColorStop(0, 'rgba(255,248,230,0.18)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      oc.fillStyle = hl; oc.fillRect(0, 0, W, H);
      const edge = oc.createRadialGradient(MCX, MCY, MR * 0.72, MCX, MCY, MR);
      edge.addColorStop(0, 'rgba(0,0,0,0)');
      edge.addColorStop(0.85, 'rgba(0,0,0,0.22)');
      edge.addColorStop(1, 'rgba(0,0,0,0.60)');
      oc.fillStyle = edge; oc.fillRect(0, 0, W, H);
      oc.restore();
    }

    function drawBg() {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#030310');
      bg.addColorStop(0.4, '#06061a');
      bg.addColorStop(1, '#090920');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      [[55, 65, 130, 'rgba(35,25,75,0.22)'], [242, 52, 112, 'rgba(15,38,88,0.20)'], [148, 148, 160, 'rgba(10,15,55,0.14)']].forEach(([cx, cy, r, c]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
    }

    function drawStars(time) {
      const pts = [
        [32,43,1.0,0.84],[32,96,0.7,0.68],[68,110,0.6,0.62],[90,100,0.8,0.74],
        [142,86,0.7,0.70],[178,100,0.6,0.62],[216,84,0.8,0.74],[254,96,0.7,0.68],
        [284,86,0.7,0.70],[18,140,0.7,0.60],[88,134,0.6,0.58],[128,124,0.7,0.60],
        [166,140,0.7,0.60],[204,127,0.6,0.54],[242,140,0.7,0.60],[276,130,0.6,0.58],
        [20,160,0.6,0.50],[58,166,0.6,0.46],[100,158,0.6,0.44],[140,166,0.7,0.50],
        [182,158,0.5,0.42],[222,166,0.6,0.48],[262,158,0.5,0.44],[288,166,0.6,0.48],
        [26,184,0.5,0.40],[68,190,0.5,0.36],[110,182,0.5,0.34],[152,190,0.5,0.38],
        [194,182,0.5,0.32],[236,190,0.5,0.36],[278,182,0.5,0.34],
        [34,214,0.5,0.28],[78,220,0.5,0.24],[122,212,0.5,0.22],[166,220,0.5,0.26],
        [210,212,0.5,0.22],[254,220,0.5,0.24],[42,236,0.5,0.18],[86,242,0.5,0.16],
        [130,234,0.5,0.14],[174,242,0.5,0.18],[218,234,0.5,0.14],[262,242,0.5,0.16],
      ];
      pts.forEach(([x, y, r, a]) => {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,228,255,${a})`; ctx.fill();
      });
      const pulse = [
        [86,23,1.4,0.38,0.98,0.80,0.00],[198,16,1.2,0.32,0.97,1.10,1.70],
        [140,31,0.9,0.24,0.92,0.60,3.20],[18,18,0.9,0.24,0.94,1.30,0.90],
        [54,12,0.7,0.16,0.90,0.95,2.40],[130,10,0.9,0.24,0.92,1.10,2.10],
        [162,18,0.7,0.16,0.88,1.40,1.10],[204,14,0.9,0.24,0.94,0.70,3.70],
        [244,22,0.8,0.20,0.90,0.75,4.10],[274,11,0.7,0.16,0.87,1.20,2.80],
        [44,68,0.9,0.24,0.94,1.00,3.50],[104,78,0.7,0.16,0.88,0.85,1.30],
        [118,40,0.7,0.16,0.87,1.50,0.60],[186,34,0.7,0.16,0.86,0.90,4.80],
        [230,44,0.9,0.24,0.90,0.65,1.50],[266,39,1.0,0.28,0.92,1.25,1.40],
        [262,60,0.7,0.16,0.86,0.80,5.20],[286,50,0.9,0.24,0.90,1.00,0.40],
        [14,54,0.7,0.16,0.86,1.60,2.90],[52,150,0.9,0.24,0.84,0.55,1.80],
      ];
      pulse.forEach(([x, y, r, mn, mx, sp, ph]) => {
        const a = mn + (mx - mn) * (0.5 + 0.5 * Math.sin(time * sp + ph));
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,228,255,${a.toFixed(3)})`; ctx.fill();
      });
      [[86,23,0.00],[198,16,1.70],[140,31,3.20]].forEach(([x, y, ph]) => {
        const ga = (0.18 + 0.38 * (0.5 + 0.5 * Math.sin(time * 0.8 + ph))).toFixed(3);
        ctx.strokeStyle = `rgba(215,228,255,${ga})`; ctx.lineWidth = 0.5; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(165,192,235,0.15)'; ctx.lineWidth = 0.4; ctx.setLineDash([1, 4]);
      [[250,66,260,74],[260,74,254,84],[260,74,270,82],[270,82,276,72]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    function drawDots(time) {
      const sp = 5.6, br = 1.1;
      ctx.save();
      ctx.beginPath(); ctx.arc(MCX, MCY, MR, 0, Math.PI * 2); ctx.clip();
      for (let y = MCY - MR; y <= MCY + MR; y += sp) {
        for (let x = MCX - MR; x <= MCX + MR; x += sp) {
          const dx = x - MCX, dy = y - MCY, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MR) continue;
          const wave = Math.sin(time * 0.7 - dist * 0.052) * 0.5 + 0.5;
          const r = br * (0.30 + wave * 0.70);
          const ef = Math.max(0, 1 - (dist / MR) * 1.15);
          ctx.fillStyle = `rgba(255,255,255,${(0.30 * ef * wave).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawAsciiPearls(time) {
      const mono = '"Share Tech Mono","Courier New",monospace';
      const glyphs = ['·', '°', '○'];
      // 32 positions inside the moon circle (MCX=150, MCY=400, MR=170), visible on canvas
      const pearls = [
        // y~248-252: narrow visible band near top of moon
        [90,248,0,0.0,0.45],[150,250,1,1.2,0.52],[210,249,2,2.4,0.38],
        // y~262-270
        [70,262,1,0.8,0.60],[120,268,0,3.1,0.44],[180,264,2,1.7,0.55],[230,270,1,4.2,0.48],
        // y~282-290
        [45,282,0,0.5,0.42],[100,286,2,2.0,0.50],[155,284,1,3.6,0.57],[210,288,0,1.1,0.43],[260,283,2,4.8,0.39],
        // y~302-310
        [25,302,2,2.3,0.61],[80,308,0,0.9,0.46],[135,304,1,3.8,0.53],[190,306,2,1.5,0.47],[245,302,0,4.0,0.41],[280,308,1,2.7,0.58],
        // y~322-328
        [40,324,0,1.8,0.44],[95,328,2,3.3,0.51],[150,322,1,0.4,0.49],[205,326,0,2.9,0.56],[260,324,2,1.3,0.40],
        // y~344-350
        [55,344,1,0.6,0.45],[112,350,0,2.1,0.54],[168,346,2,3.7,0.42],[224,348,1,1.0,0.59],[270,344,0,4.3,0.48],
        // y~368-375
        [75,368,2,1.4,0.53],[140,374,0,3.2,0.46],[200,370,1,2.6,0.37],[255,375,2,0.7,0.50],
      ];
      ctx.save();
      ctx.beginPath(); ctx.arc(MCX, MCY, MR, 0, Math.PI * 2); ctx.clip();
      ctx.font = `7px ${mono}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      pearls.forEach(([x, y, gi, ph, sp]) => {
        const a = (0.10 + 0.22 * (0.5 + 0.5 * Math.sin(time * sp + ph))).toFixed(3);
        ctx.fillStyle = `rgba(200,220,255,${a})`;
        ctx.fillText(glyphs[gi], x, y);
      });
      ctx.restore();
    }

    function drawUI() {
      const mono = '"Share Tech Mono","Courier New",monospace';
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(95,135,238,0.20)'; ctx.lineWidth = 0.6; ctx.strokeRect(9, 9, 282, 382);
      ctx.textBaseline = 'top';
      // Animated zone labels — slow drift, staggered phase per label
      const la0 = (0.08 + 0.28 * (0.5 + 0.5 * Math.sin(t * 0.35 + 0.0))).toFixed(3);
      const la1 = (0.08 + 0.28 * (0.5 + 0.5 * Math.sin(t * 0.35 + 1.4))).toFixed(3);
      const la2 = (0.08 + 0.28 * (0.5 + 0.5 * Math.sin(t * 0.35 + 2.8))).toFixed(3);
      ctx.font = `5px ${mono}`; ctx.textAlign = 'right';
      ctx.fillStyle = `rgba(135,168,228,${la0})`; ctx.fillText('[Ti] mare', 288, 204);
      ctx.fillStyle = `rgba(135,168,228,${la1})`; ctx.fillText('[Fe] terra', 288, 211);
      ctx.fillStyle = `rgba(135,168,228,${la2})`; ctx.fillText('[Mg] basin', 288, 218);

      // Animated ASCII corner brackets — opposite phase, breathe in/out
      const ca = (0.10 + 0.32 * (0.5 + 0.5 * Math.sin(t * 0.55 + 0.0))).toFixed(3);
      const cb = (0.10 + 0.32 * (0.5 + 0.5 * Math.sin(t * 0.55 + 3.14))).toFixed(3);
      ctx.font = `6px ${mono}`; ctx.textAlign = 'left';
      ctx.fillStyle = `rgba(135,165,228,${ca})`; ctx.fillText('/ \\', 14, 184);
      ctx.fillStyle = `rgba(135,165,228,${cb})`; ctx.fillText('\\ /', 14, 191);
      ctx.textAlign = 'right';
      ctx.fillStyle = `rgba(135,165,228,${cb})`; ctx.fillText('/ \\', 284, 184);
      ctx.fillStyle = `rgba(135,165,228,${ca})`; ctx.fillText('\\ /', 284, 191);

      // To / From labels
      ctx.font = 'italic 13px "Cormorant Garamond",Georgia,serif';
      ctx.fillStyle = 'rgba(190,210,252,0.76)'; ctx.textAlign = 'left';
      ctx.fillText('To,', 20, 34);
      if (toName) {
        ctx.font = 'italic 12px "Cormorant Garamond",Georgia,serif';
        ctx.fillStyle = 'rgba(190,210,252,0.90)';
        ctx.fillText(toName, 44, 34);
      }

      ctx.strokeStyle = 'rgba(125,158,228,0.24)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 4]);
      const msgLines = message ? message.match(/.{1,24}(\s|$)/g)?.map(s => s.trim()).filter(Boolean).slice(0, 5) ?? [] : [];
      if (msgLines.length) {
        ctx.font = 'italic 11px "Cormorant Garamond",Georgia,serif';
        ctx.fillStyle = 'rgba(190,210,252,0.80)';
        ctx.setLineDash([]);
        msgLines.forEach((line, i) => ctx.fillText(line, 20, 54 + i * 18));
      } else {
        [52, 70, 88, 106, 124, 142].forEach(ly => {
          ctx.beginPath(); ctx.moveTo(20, ly); ctx.lineTo(192, ly); ctx.stroke();
        });
      }

      ctx.setLineDash([]);
      ctx.font = 'italic 13px "Cormorant Garamond",Georgia,serif';
      ctx.fillStyle = 'rgba(190,210,252,0.76)'; ctx.fillText('From,', 20, 254);
      if (fromName) {
        ctx.font = 'italic 12px "Cormorant Garamond",Georgia,serif';
        ctx.fillStyle = 'rgba(190,210,252,0.90)';
        ctx.fillText(fromName, 58, 254);
      }
      ctx.strokeStyle = 'rgba(125,158,228,0.24)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(20, 240); ctx.lineTo(114, 240); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'italic 8.5px "Cormorant Garamond",Georgia,serif';
      ctx.fillStyle = 'rgba(148,178,238,0.50)'; ctx.textAlign = 'center';
      ctx.fillText('a wish sent to the stars', 150, 390);
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawBg();
      drawStars(t);
      const hg = ctx.createRadialGradient(MCX, MCY - MR, 0, MCX, MCY - MR, 160);
      hg.addColorStop(0, 'rgba(72,95,195,0.10)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg; ctx.fillRect(0, 0, W, MCY - MR + 80);
      ctx.drawImage(off, 0, 0, W, H);
      drawDots(t);
      drawAsciiPearls(t);
      drawUI();
      t += 0.014;
      raf = requestAnimationFrame(loop);
    }

    const img = new Image();
    img.onload = () => { buildMoon(img); loop(); };
    img.onerror = () => {
      // Fallback: draw moon without photo
      oc.save();
      oc.beginPath(); oc.arc(MCX, MCY, MR, 0, Math.PI * 2); oc.clip();
      const moonFill = oc.createRadialGradient(MCX - 40, MCY - 60, 0, MCX, MCY, MR);
      moonFill.addColorStop(0, 'rgba(220,225,245,1)');
      moonFill.addColorStop(0.5, 'rgba(185,195,230,1)');
      moonFill.addColorStop(1, 'rgba(140,155,210,1)');
      oc.fillStyle = moonFill; oc.fillRect(0, 0, W, H);
      oc.restore();
      loop();
    };
    img.src = '/moon.jpg';

    return () => { cancelAnimationFrame(raf); };
  }, [toName, fromName, message]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
