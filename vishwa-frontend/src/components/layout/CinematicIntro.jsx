import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiTerminal } from 'react-icons/fi';

export default function CinematicIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [hudPhase, setHudPhase] = useState(1); // 1: boot, 2: scan, 3: loading, 4: active
  const [hudMessage, setHudMessage] = useState('Atmospheric Calibration...');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showCompanyText, setShowCompanyText] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  // Animation values manipulated by GSAP
  const animState = useRef({
    progress: 0,        // 0 = float, 1 = assembled
    zoom: 0.85,         // Camera zoom scale
    scanX: -100,        // Scan line x coordinate
    scanOpacity: 0,     // Scan line opacity
    shineProgress: -1.5, // -1.5 to 1.5 sweep
    radarRadius: 0,     // Radar circle radius
    radarOpacity: 0,    // Radar wave opacity
    lightRayOpacity: 0, // Volumetric light opacity
    lightRayAngle: 0,   // Volumetric light rotation
    backgroundGrid: 0.12, // Grid opacity
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Generate VT Monogram target coordinates offscreen
    const sampleLogoPoints = () => {
      const offscreen = document.createElement('canvas');
      const octx = offscreen.getContext('2d');
      offscreen.width = 400;
      offscreen.height = 400;

      // Draw futuristic hexagonal shield contour
      octx.strokeStyle = '#ffffff';
      octx.lineWidth = 14;
      octx.lineJoin = 'round';
      octx.beginPath();
      octx.moveTo(200, 20);  // Top Center
      octx.lineTo(350, 95);  // Top Right
      octx.lineTo(350, 285); // Bottom Right
      octx.lineTo(200, 380); // Bottom Center
      octx.lineTo(50, 285);  // Bottom Left
      octx.lineTo(50, 95);   // Top Left
      octx.closePath();
      octx.stroke();

      // Draw VT letter forms inside
      octx.fillStyle = '#ffffff';
      octx.font = '900 170px "Outfit", "Inter", sans-serif';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('VT', 200, 200);

      // Extract pixel positions
      const imgData = octx.getImageData(0, 0, 400, 400);
      const data = imgData.data;
      const sampled = [];

      for (let y = 0; y < 400; y += 3) {
        for (let x = 0; x < 400; x += 3) {
          const index = (y * 400 + x) * 4;
          if (data[index + 3] > 120) {
            sampled.push({
              nx: (x - 200) / 200,
              ny: (y - 200) / 200,
            });
          }
        }
      }
      return sampled;
    };

    const sampledPoints = sampleLogoPoints();
    const particleCount = Math.min(sampledPoints.length, 3500);

    // 2. Initialize Particles
    particles = Array.from({ length: particleCount }, (_, idx) => {
      const targetPoint = sampledPoints[idx % sampledPoints.length];
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 400;
      
      return {
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        ox: width / 2 + Math.cos(angle) * distance,
        oy: height / 2 + Math.sin(angle) * distance,
        driftSpeedX: (Math.random() - 0.5) * 0.4,
        driftSpeedY: (Math.random() - 0.5) * 0.4,
        tx: targetPoint.nx,
        ty: targetPoint.ny,
        size: 1.2 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? '#0fa596' : (Math.random() > 0.5 ? '#ffffff' : '#10b981'),
        alpha: 0.15 + Math.random() * 0.85,
        speedFactor: 0.05 + Math.random() * 0.08,
        swirlOffset: Math.random() * Math.PI * 2,
        swirlSpeed: (Math.random() - 0.5) * 2,
      };
    });

    // 3. Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stateParams = animState.current;

    // 4. GSAP Master Timeline (Autoplays silently immediately on mount)
    const mainTimeline = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.96,
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: () => {
            onComplete();
          }
        });
      }
    });

    // --- PHASE 1: DARKNESS (0 - 1.2s) ---
    mainTimeline.to(stateParams, {
      backgroundGrid: 0.12,
      duration: 1.2,
      ease: 'power2.out',
      onStart: () => {
        setHudMessage('Calibrating Quantum Core...');
      }
    });

    // --- PHASE 2: SECURITY SCAN (1.2 - 2.2s) ---
    mainTimeline.to(stateParams, {
      scanOpacity: 1,
      scanX: width + 200,
      duration: 1.0,
      ease: 'power1.inOut',
      onStart: () => {
        setHudPhase(2);
        setHudMessage('Scanning Client Security Protocol...');
      }
    });

    // --- PHASE 3: LOGO ASSEMBLY (2.2 - 4.4s) ---
    mainTimeline.to(stateParams, {
      progress: 1.0,
      zoom: 1.05,
      lightRayOpacity: 0.35,
      duration: 2.2,
      ease: 'power3.inOut',
      onStart: () => {
        setHudPhase(3);
        setHudMessage('Assembling Quantum Matrix Grid...');
        
        gsap.to({ val: 0 }, {
          val: 100,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: function () {
            setProgressPercent(Math.floor(this.targets()[0].val));
          }
        });
      },
      onComplete: () => {
        setHudPhase(4);
        setHudMessage('Core Integrity SECURE');
      }
    });

    // --- PHASE 4: COMPANY REVEAL & METALLIC SHINE (4.4 - 5.6s) ---
    mainTimeline.to(stateParams, {
      shineProgress: 1.5,
      lightRayOpacity: 0.5,
      zoom: 1.0,
      duration: 1.2,
      ease: 'power2.inOut',
      onStart: () => {
        setShowCompanyText(true);
        setShowHUD(false); // Hide diagnostic HUD
      }
    });

    // --- PHASE 5: SECURITY RADAR ACTIVATION (5.6 - 6.6s) ---
    mainTimeline.to(stateParams, {
      radarRadius: Math.max(width, height) * 0.75,
      radarOpacity: 1,
      duration: 1.0,
      ease: 'power2.out',
      onStart: () => {
        setShowSubtitle(true);
      }
    });

    // Soft fade of radar circle after expanding
    mainTimeline.to(stateParams, {
      radarOpacity: 0,
      duration: 0.5,
      ease: 'power1.in'
    }, '-=0.3');

    // Volumetric rays rotation loop
    gsap.to(stateParams, {
      lightRayAngle: Math.PI * 2,
      repeat: -1,
      duration: 20,
      ease: 'none'
    });

    // 5. Main Canvas Render Loop
    const render = () => {
      ctx.fillStyle = '#020a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Background
      if (stateParams.backgroundGrid > 0) {
        ctx.strokeStyle = `rgba(15, 165, 150, ${stateParams.backgroundGrid})`;
        ctx.lineWidth = 1;
        const gridSize = 64;
        
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.8
        );
        gradient.addColorStop(0, 'rgba(2, 10, 10, 0)');
        gradient.addColorStop(1, '#020a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Volumetric Light Rays
      if (stateParams.lightRayOpacity > 0) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(stateParams.lightRayAngle);
        
        const numRays = 8;
        const rayAngle = (Math.PI * 2) / numRays;
        const radius = Math.max(width, height) * 0.65;

        for (let i = 0; i < numRays; i++) {
          const startAngle = i * rayAngle - 0.15;
          const endAngle = i * rayAngle + 0.15;

          const rayGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          rayGrad.addColorStop(0, `rgba(20, 184, 166, ${stateParams.lightRayOpacity})`);
          rayGrad.addColorStop(0.3, `rgba(15, 165, 150, ${stateParams.lightRayOpacity * 0.4})`);
          rayGrad.addColorStop(1, 'rgba(2, 10, 10, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Radar Sonic Ripple
      if (stateParams.radarOpacity > 0 && stateParams.radarRadius > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, stateParams.radarRadius, 0, Math.PI * 2);
        
        const sonarGradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          stateParams.radarRadius - 30,
          width / 2,
          height / 2,
          stateParams.radarRadius
        );
        sonarGradient.addColorStop(0, 'rgba(15, 165, 150, 0)');
        sonarGradient.addColorStop(0.8, `rgba(15, 165, 150, ${stateParams.radarOpacity * 0.55})`);
        sonarGradient.addColorStop(1, 'rgba(15, 165, 150, 0)');
        
        ctx.strokeStyle = sonarGradient;
        ctx.lineWidth = 12;
        ctx.stroke();

        if (stateParams.radarRadius > 150) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, stateParams.radarRadius - 120, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${stateParams.radarOpacity * 0.25})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update and Draw Particles
      const scale = Math.min(width, height) * 0.48;
      const cx = width / 2;
      const cy = height / 2;
      const pxSweepCenter = cx + stateParams.shineProgress * 220;

      particles.forEach((p) => {
        p.ox += p.driftSpeedX;
        p.oy += p.driftSpeedY;
        if (p.ox < 0 || p.ox > width) p.driftSpeedX *= -1;
        if (p.oy < 0 || p.oy > height) p.driftSpeedY *= -1;

        const swirlAngle = stateParams.lightRayAngle * p.swirlSpeed + p.swirlOffset;
        const swirlRadius = (1 - stateParams.progress) * 80;
        const swirlX = Math.cos(swirlAngle) * swirlRadius;
        const swirlY = Math.sin(swirlAngle) * swirlRadius;

        const targetX = cx + p.tx * scale * stateParams.zoom + swirlX;
        const targetY = cy + p.ty * scale * stateParams.zoom + swirlY;

        const currentTargetX = stateParams.progress * targetX + (1 - stateParams.progress) * p.ox;
        const currentTargetY = stateParams.progress * targetY + (1 - stateParams.progress) * p.oy;

        p.x += (currentTargetX - p.x) * p.speedFactor;
        p.y += (currentTargetY - p.y) * p.speedFactor;

        let pColor = p.color;
        let pSize = p.size;
        
        if (stateParams.progress > 0.9) {
          const distToShine = Math.abs(p.x - pxSweepCenter);
          if (distToShine < 60) {
            const ratio = 1 - distToShine / 60;
            pColor = `rgba(255, 255, 255, ${p.alpha})`;
            pSize = p.size * (1 + ratio * 1.5);
          }
        }

        ctx.fillStyle = pColor;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x - pSize / 2, p.y - pSize / 2, pSize, pSize);
      });

      ctx.globalAlpha = 1.0;

      // Draw Boot Scan Line
      if (stateParams.scanOpacity > 0 && stateParams.scanX < width + 100) {
        const xPos = stateParams.scanX;
        const scanGrad = ctx.createLinearGradient(xPos - 80, 0, xPos, 0);
        scanGrad.addColorStop(0, 'rgba(15, 165, 150, 0)');
        scanGrad.addColorStop(0.7, 'rgba(15, 165, 150, 0.45)');
        scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(xPos - 80, 0, 80, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mainTimeline.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none font-body overflow-hidden"
    >
      {/* Full screen canvas drawing grid, lights and particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Cybernetic HUD Diagnostics Overlay */}
      <AnimatePresence>
        {showHUD && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none text-[10px] md:text-xs font-mono text-slate-500 font-semibold z-10"
          >
            {/* Top HUD Row */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-electric">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>[REC]</span>
                </div>
                <span>CAM_01_SECURE_PORTAL</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <FiCpu className="text-electric" />
                <span>SYS_INIT_VER_80.12</span>
              </div>
            </div>

            {/* Middle Left Diagnostic Panels */}
            <div className="flex justify-between items-center w-full px-4 h-0 pointer-events-none">
              <div className="flex flex-col gap-4 -translate-y-24">
                <div className="border-l border-t border-slate-700 w-8 h-8 rounded-tl-lg" />
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <span className="text-electric">NET STATUS:</span>
                    <span className="text-white">ENCRYPTED SHIELD</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-electric">HOST ALIGN:</span>
                    <span className="text-white">SECURE ROUTE</span>
                  </div>
                </div>
              </div>

              {/* Middle Right Diagnostic Panels */}
              <div className="flex flex-col items-end gap-4 -translate-y-24">
                <div className="border-r border-t border-slate-700 w-8 h-8 rounded-tr-lg" />
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-2">
                    <span className="text-electric">SAT FPS:</span>
                    <span className="text-emerald-400">60.0 // LOCK</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-electric">PING TIMEOUT:</span>
                    <span className="text-white">0.02ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom HUD Loader */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <FiTerminal className="text-electric animate-pulse text-lg" />
                <div className="flex flex-col">
                  <span className="text-white font-semibold">{hudMessage}</span>
                  <span className="text-slate-600 uppercase text-[9px] tracking-widest">Diagnostics Check</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {hudPhase === 3 && (
                  <div className="flex items-center gap-3 w-full md:w-56">
                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-electric to-accent transition-all duration-100 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-electric font-bold w-8 text-right">{progressPercent}%</span>
                  </div>
                )}
                {hudPhase !== 3 && (
                  <div className="flex gap-1.5 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-emerald-400 uppercase tracking-widest text-[9px]">ONLINE SYSTEM</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Reveal Text */}
      <div className="absolute inset-x-0 bottom-[18%] z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <AnimatePresence>
          {showCompanyText && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.18em] font-display text-white filter drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                VISHWA <span className="text-electric">TECHNOLOGIES</span>
              </h1>
              
              <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-electric/60 to-transparent my-4" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSubtitle && (
            <motion.p
              initial={{ opacity: 0, tracking: '0.1em' }}
              animate={{ opacity: 1, tracking: '0.3em' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-slate-400 font-body"
            >
              Securing What Matters Most
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient background shadow layer for glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />
    </div>
  );
}
