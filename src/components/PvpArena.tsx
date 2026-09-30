import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Swords, Eye, Shield, Sparkles, Heart, Trophy, Skull, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface PvpArenaProps {
  onClose?: () => void;
  onBossPosUpdate?: (x: number, y: number) => void;
}

export const PvpArena: React.FC<PvpArenaProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [eyeHp, setEyeHp] = useState(314);
  const maxEyeHp = 314;
  const [shieldPlates, setShieldPlates] = useState(14);
  const maxShieldPlates = 14;
  const [playerHp, setPlayerHp] = useState(14);
  const maxPlayerHp = 14;
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'VICTORY' | 'DEFEAT'>('START');
  const [bossMsg, setBossMsg] = useState('');
  const msgTimeoutRef = useRef<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const stateRef = useRef({
    eyeHp: 314,
    shieldPlates: 14,
    playerHp: 14,
    isInvulnerable: false,
    invulnerableTime: 0,
    bossX: 400,
    bossY: 160,
    bossTargetX: 400,
    bossTargetY: 160,
    bossState: 'FLYING' as 'FLYING' | 'SUN_DANCE' | 'CHARGING',
    bossTimer: 0,
    sunDanceAngle: 0,
    eyelidsClosed: false,
    mouseX: 400,
    mouseY: 340,
    isMouseDown: false,
    lastShotTime: 0,
    playerBolts: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number }>,
    bossBullets: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
    lances: [] as Array<{ y: number; state: 'TELEGRAPH' | 'CHARGING'; timer: number }>,
    laserBeam: null as { startX: number; startY: number; targetX: number; targetY: number; progress: number; duration: number } | null,
    floatingTexts: [] as Array<{ x: number; y: number; text: string; color: string; opacity: number; vy: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }>,
    shakeAmount: 0,
    lastFrameTime: performance.now(),
    lastUiSyncTime: 0,
  });

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playSfx = useCallback((type: 'shoot' | 'hit' | 'laser' | 'shield' | 'player_hit' | 'victory' | 'defeat') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'shoot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'shield') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'player_hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.12);
        osc.frequency.setValueAtTime(880, now + 0.24);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'defeat') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {}
  }, [soundEnabled, getAudioContext]);

  const showBossMessage = (msg: string) => {
    setBossMsg(msg);
    if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
    msgTimeoutRef.current = setTimeout(() => {
      setBossMsg('');
    }, 2200);
  };

  const startBattle = () => {
    stateRef.current = {
      eyeHp: 314,
      shieldPlates: 14,
      playerHp: 14,
      isInvulnerable: false,
      invulnerableTime: 0,
      bossX: 400,
      bossY: 150,
      bossTargetX: 400,
      bossTargetY: 150,
      bossState: 'FLYING',
      bossTimer: 0,
      sunDanceAngle: 0,
      eyelidsClosed: false,
      mouseX: 400,
      mouseY: 340,
      isMouseDown: false,
      lastShotTime: 0,
      playerBolts: [],
      bossBullets: [],
      lances: [],
      laserBeam: null,
      floatingTexts: [],
      particles: [],
      shakeAmount: 0,
      lastFrameTime: performance.now(),
      lastUiSyncTime: 0,
    };

    setEyeHp(314);
    setShieldPlates(14);
    setPlayerHp(14);
    setGameState('PLAYING');
    showBossMessage('Око дивиться у твою душу! Захищай Дібрівські Ліси!');
  };

  // Window-level mouseup / touchend so player never gets stuck in continuous shooting
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      stateRef.current.isMouseDown = false;
    };
    window.addEventListener('mouseup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const spawnParticles = (x: number, y: number, color: string, count = 6) => {
      const s = stateRef.current;
      if (s.particles.length > 60) return; // Keep high FPS
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 2.5 + 1;
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color,
          size: Math.random() * 2.5 + 1,
          life: 18,
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
      const s = stateRef.current;
      if (s.floatingTexts.length > 6) return;
      s.floatingTexts.push({
        x,
        y,
        text,
        color,
        opacity: 1,
        vy: -1.2,
      });
    };

    const damagePlayer = (dmg = 1) => {
      const s = stateRef.current;
      if (s.playerHp <= 0 || s.eyeHp <= 0) return;
      const now = performance.now();
      if (s.isInvulnerable && now - s.invulnerableTime < 500) return;

      s.playerHp = Math.max(0, s.playerHp - dmg);
      s.isInvulnerable = true;
      s.invulnerableTime = now;
      s.shakeAmount = 8;
      playSfx('player_hit');

      if (s.playerHp <= 0) {
        setPlayerHp(0);
        setGameState('DEFEAT');
        playSfx('defeat');
      }
    };

    const hitBoss = (dmg = 6) => {
      const s = stateRef.current;
      if (s.eyeHp <= 0 || s.playerHp <= 0) return;

      if (s.shieldPlates > 0 && Math.random() < 0.5) {
        s.shieldPlates--;
        playSfx('shield');
        addFloatingText(s.bossX, s.bossY - 40, 'ЩИТ БЛОК!', '#66fcf1');
        spawnParticles(s.bossX, s.bossY, '#66fcf1', 5);

        // Counter attack laser
        s.laserBeam = {
          startX: s.bossX,
          startY: s.bossY,
          targetX: s.mouseX,
          targetY: s.mouseY,
          progress: 0,
          duration: 18,
        };
        playSfx('laser');
        return;
      }

      s.eyeHp = Math.max(0, s.eyeHp - dmg);
      playSfx('hit');
      s.shakeAmount = 5;
      addFloatingText(s.bossX, s.bossY - 45, `-${dmg}`, '#ff0055');
      spawnParticles(s.bossX, s.bossY, '#ff0055', 7);

      if (s.eyeHp <= 0) {
        setEyeHp(0);
        setGameState('VICTORY');
        playSfx('victory');
      }
    };

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Delta time clamp to prevent any animation spikes
      const dt = Math.min(32, timestamp - s.lastFrameTime) / 16.666;
      s.lastFrameTime = timestamp;

      // Update invulnerability state
      if (s.isInvulnerable && timestamp - s.invulnerableTime >= 500) {
        s.isInvulnerable = false;
      }

      // Throttle React state sync so React does NOT re-render 60 times a second
      if (timestamp - s.lastUiSyncTime > 90) {
        s.lastUiSyncTime = timestamp;
        setEyeHp(s.eyeHp);
        setShieldPlates(s.shieldPlates);
        setPlayerHp(s.playerHp);
      }

      // Screen Shake
      ctx.save();
      if (s.shakeAmount > 0) {
        const rx = (Math.random() - 0.5) * s.shakeAmount;
        const ry = (Math.random() - 0.5) * s.shakeAmount;
        ctx.translate(rx, ry);
        s.shakeAmount *= 0.85;
      }

      // Background clear
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 50) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 50) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Proximity check to cursor
      const distToBoss = Math.hypot(s.mouseX - s.bossX, s.mouseY - s.bossY);
      if (distToBoss < 65) {
        if (!s.eyelidsClosed) {
          s.eyelidsClosed = true;
          const phrases = [
            'Гей! Не тицяй у мене пальцем, це лоскотно! 👁️❌',
            'Оку неприємно, коли в нього вилуплюються!',
            'Закриваюся від твого зухвалого курсора!',
          ];
          showBossMessage(phrases[Math.floor(Math.random() * phrases.length)]);
        }
      } else {
        s.eyelidsClosed = false;
      }

      // Player auto-shoot
      if (s.isMouseDown && timestamp - s.lastShotTime > 120) {
        s.lastShotTime = timestamp;
        const angle = Math.atan2(s.bossY - s.mouseY, s.bossX - s.mouseX);
        const speed = 14;
        s.playerBolts.push({
          x: s.mouseX,
          y: s.mouseY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 55,
        });
        playSfx('shoot');
      }

      // Update & Draw Player Bolts
      ctx.fillStyle = '#9effa1';
      for (let i = s.playerBolts.length - 1; i >= 0; i--) {
        const b = s.playerBolts[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;

        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with eye
        if (Math.hypot(b.x - s.bossX, b.y - s.bossY) < 48) {
          hitBoss(6);
          s.playerBolts.splice(i, 1);
          continue;
        }

        if (b.life <= 0 || b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
          s.playerBolts.splice(i, 1);
        }
      }

      // Boss Movement & State Machine
      if (s.bossState === 'FLYING') {
        const dx = s.bossTargetX - s.bossX;
        const dy = s.bossTargetY - s.bossY;
        const dist = Math.hypot(dx, dy);

        if (dist < 25) {
          s.bossTargetX = Math.random() * (width - 180) + 90;
          s.bossTargetY = Math.random() * (height - 240) + 70;

          const attackRoll = Math.random();
          if (attackRoll < 0.45) {
            // Ring attack
            for (let i = 0; i < 8; i++) {
              const a = ((Math.PI * 2) / 8) * i;
              s.bossBullets.push({
                x: s.bossX,
                y: s.bossY,
                vx: Math.cos(a) * 3.5,
                vy: Math.sin(a) * 3.5,
                color: '#66fcf1',
                life: 140,
              });
            }
          } else if (attackRoll < 0.75) {
            // Lance Attack
            s.lances.push({
              y: Math.max(60, Math.min(height - 40, s.mouseY)),
              state: 'TELEGRAPH',
              timer: 28,
            });
          } else {
            // Sun Dance mode
            s.bossState = 'SUN_DANCE';
            s.bossTimer = 70;
            s.sunDanceAngle = 0;
          }
        } else {
          s.bossX += (dx / dist) * 3.2 * dt;
          s.bossY += (dy / dist) * 3.2 * dt;
        }
      } else if (s.bossState === 'SUN_DANCE') {
        s.bossTimer -= dt;
        s.sunDanceAngle += 0.035 * dt;

        ctx.strokeStyle = 'rgba(102, 252, 241, 0.5)';
        ctx.lineWidth = 3.5;
        const numBeams = 5;
        for (let i = 0; i < numBeams; i++) {
          const a = s.sunDanceAngle + ((Math.PI * 2) / numBeams) * i;
          const ex = s.bossX + Math.cos(a) * 700;
          const ey = s.bossY + Math.sin(a) * 700;
          ctx.beginPath();
          ctx.moveTo(s.bossX, s.bossY);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Distance check
          const lineDx = ex - s.bossX;
          const lineDy = ey - s.bossY;
          const lineLen = Math.hypot(lineDx, lineDy);
          const u = ((s.mouseX - s.bossX) * lineDx + (s.mouseY - s.bossY) * lineDy) / (lineLen * lineLen);
          const px = s.bossX + Math.max(0, Math.min(1, u)) * lineDx;
          const py = s.bossY + Math.max(0, Math.min(1, u)) * lineDy;
          if (Math.hypot(s.mouseX - px, s.mouseY - py) < 14) {
            damagePlayer(1);
          }
        }

        if (s.bossTimer <= 0) {
          s.bossState = 'FLYING';
        }
      }

      // Lances logic
      for (let i = s.lances.length - 1; i >= 0; i--) {
        const l = s.lances[i];
        l.timer -= dt;
        if (l.state === 'TELEGRAPH') {
          ctx.strokeStyle = 'rgba(255, 0, 85, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(0, l.y);
          ctx.lineTo(width, l.y);
          ctx.stroke();
          ctx.setLineDash([]);

          if (l.timer <= 0) {
            l.state = 'CHARGING';
            l.timer = 12;
            playSfx('laser');
          }
        } else if (l.state === 'CHARGING') {
          ctx.strokeStyle = '#ff0055';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(0, l.y);
          ctx.lineTo(width, l.y);
          ctx.stroke();

          if (Math.abs(s.mouseY - l.y) < 16) {
            damagePlayer(1);
          }

          if (l.timer <= 0) {
            s.lances.splice(i, 1);
          }
        }
      }

      // Boss Bullets
      for (let i = s.bossBullets.length - 1; i >= 0; i--) {
        const b = s.bossBullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;

        // Subtle homing
        const hx = s.mouseX - b.x;
        const hy = s.mouseY - b.y;
        const hd = Math.hypot(hx, hy) || 1;
        b.vx += (hx / hd) * 0.06 * dt;
        b.vy += (hy / hd) * 0.06 * dt;

        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();

        if (hd < 14) {
          damagePlayer(1);
          s.bossBullets.splice(i, 1);
          continue;
        }

        if (b.life <= 0) {
          s.bossBullets.splice(i, 1);
        }
      }

      // Counter Laser Beam
      if (s.laserBeam) {
        s.laserBeam.progress += dt;
        ctx.strokeStyle = '#66fcf1';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(s.laserBeam.startX, s.laserBeam.startY);
        ctx.lineTo(s.laserBeam.targetX, s.laserBeam.targetY);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(s.laserBeam.startX, s.laserBeam.startY);
        ctx.lineTo(s.laserBeam.targetX, s.laserBeam.targetY);
        ctx.stroke();

        if (Math.hypot(s.mouseX - s.laserBeam.targetX, s.mouseY - s.laserBeam.targetY) < 16) {
          damagePlayer(1);
        }

        if (s.laserBeam.progress >= s.laserBeam.duration) {
          s.laserBeam = null;
        }
      }

      // Draw Boss Eye
      ctx.save();
      ctx.translate(s.bossX, s.bossY);

      // Rotating Aura
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Sclera
      ctx.fillStyle = '#0b101d';
      ctx.strokeStyle = '#66fcf1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 44, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupil tracking cursor
      const lookAngle = Math.atan2(s.mouseY - s.bossY, s.mouseX - s.bossX);
      const lookDist = Math.min(12, Math.hypot(s.mouseX - s.bossX, s.mouseY - s.bossY) * 0.08);
      const px = Math.cos(lookAngle) * lookDist;
      const py = Math.sin(lookAngle) * lookDist;

      if (s.eyelidsClosed) {
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-38, 0);
        ctx.lineTo(38, 0);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#66fcf1';
        ctx.beginPath();
        ctx.arc(px, py, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(px, py, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Shield Plates
      if (s.shieldPlates > 0) {
        for (let i = 0; i < s.shieldPlates; i++) {
          const a = ((Math.PI * 2) / s.shieldPlates) * i + timestamp * 0.0015;
          const sx = Math.cos(a) * 62;
          const sy = Math.sin(a) * 62;
          ctx.fillStyle = '#66fcf1';
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // Floating Texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const t = s.floatingTexts[i];
        t.y += t.vy * dt;
        t.opacity -= 0.035 * dt;
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.opacity);
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x - 16, t.y);
        ctx.restore();
        if (t.opacity <= 0) s.floatingTexts.splice(i, 1);
      }

      // Cursor Crosshair
      ctx.save();
      ctx.translate(s.mouseX, s.mouseY);
      ctx.strokeStyle = s.isInvulnerable ? '#ff0055' : '#9effa1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-7, 0);
      ctx.moveTo(7, 0);
      ctx.lineTo(16, 0);
      ctx.moveTo(0, -16);
      ctx.lineTo(0, -7);
      ctx.moveTo(0, 7);
      ctx.lineTo(0, 16);
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, playSfx]);

  const handlePointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    stateRef.current.mouseX = Math.max(10, Math.min(canvas.width - 10, (clientX - rect.left) * scaleX));
    stateRef.current.mouseY = Math.max(10, Math.min(canvas.height - 10, (clientY - rect.top) * scaleY));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 bg-black/90 border-2 border-neon-cyan/50 rounded-2xl p-4 sm:p-6 shadow-[0_0_35px_rgba(102,252,241,0.25)] relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neon-teal/30 pb-3">
        <div className="flex items-center gap-3">
          <Swords className="text-neon-cyan animate-pulse" size={24} />
          <div>
            <h2 className="font-orbitron text-lg sm:text-2xl text-neon-cyan font-bold tracking-wider m-0">
              ПвП Арена: Битва з Кібер-Оком
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              60 FPS стабільно! Затисніть ЛКМ для стрільби, ухиляйтеся від лазерів.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-black/60 border border-neon-teal/30 hover:border-neon-cyan rounded-xl text-neon-cyan transition-all cursor-pointer"
            title={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-red-400" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white rounded-xl text-xs font-cinzel transition-all cursor-pointer"
            >
              Закрити
            </button>
          )}
        </div>
      </div>

      {/* Health Bars & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/60 p-3 rounded-xl border border-neon-teal/20 font-mono text-xs">
        {/* Boss HP */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neon-cyan font-bold flex items-center gap-1">
              <Eye size={14} /> Кібер-Око Психо-Андрія
            </span>
            <span className="text-neon-cyan font-bold">
              {eyeHp} / {maxEyeHp} HP
            </span>
          </div>
          <div className="w-full h-3 bg-black/80 rounded-full border border-neon-cyan/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-teal to-neon-cyan transition-all duration-150 shadow-[0_0_10px_#66fcf1]"
              style={{ width: `${(eyeHp / maxEyeHp) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Shield size={12} className="text-amber-400" />
            <span className="text-amber-400 font-bold">
              Захисні пластини: {shieldPlates} / {maxShieldPlates}
            </span>
          </div>
        </div>

        {/* Player HP */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neon-green font-bold flex items-center gap-1">
              <Sparkles size={14} /> Твій Курсор-Адепт
            </span>
            <span className="text-neon-green font-bold">
              {playerHp} / {maxPlayerHp} HP
            </span>
          </div>
          <div className="w-full h-3 bg-black/80 rounded-full border border-neon-green/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-neon-green transition-all duration-150 shadow-[0_0_10px_#9effa1]"
              style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap text-neon-green font-mono">
            {Array.from({ length: maxPlayerHp }).map((_, i) => (
              <Heart
                key={i}
                size={11}
                className={
                  i < playerHp
                    ? 'text-neon-green fill-neon-green drop-shadow-[0_0_6px_#9effa1] animate-pulse'
                    : 'text-gray-800/80'
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Boss Quote Dialogue Bubble */}
      {bossMsg && (
        <div className="bg-black/90 border-2 border-neon-cyan text-neon-cyan px-4 py-2 rounded-xl text-xs sm:text-sm font-mono shadow-[0_0_20px_rgba(102,252,241,0.4)] text-center animate-bounce">
          👁️ {bossMsg}
        </div>
      )}

      {/* Canvas Area with Overlays */}
      <div className="relative w-full rounded-xl overflow-hidden border border-neon-cyan/30 bg-black cursor-crosshair touch-none">
        {gameState === 'START' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6 text-center space-y-4">
            <Eye size={56} className="text-neon-cyan animate-pulse" />
            <h3 className="font-orbitron text-2xl font-bold text-neon-cyan">БИТВА З КІБЕР-ОКОМ</h3>
            <p className="text-sm text-gray-300 max-w-md font-sans leading-relaxed">
              Око прагне спопелити твій курсор! Затисніть ліву кнопку миші або торкайтеся екрана для пострілів. Ухиляйтеся від променів та снарядів!
            </p>
            <button
              onClick={startBattle}
              className="px-8 py-3 bg-neon-cyan text-black font-orbitron font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_#66fcf1] cursor-pointer text-base"
            >
              РОЗПОЧАТИ ПВП БИТВУ ⚔️
            </button>
          </div>
        )}

        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6 text-center space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <Trophy size={64} className="text-neon-green animate-bounce" />
            <h3 className="font-orbitron text-3xl font-extrabold text-neon-green shadow-[0_0_15px_#9effa1]">
              ПЕРЕМОГА!
            </h3>
            <p className="text-sm text-gray-200 max-w-md font-sans">
              Вітаємо! Ви пробили броню Кібер-Ока та відстояли честь Дібрівських лісів!
            </p>
            <button
              onClick={startBattle}
              className="px-8 py-3 bg-neon-green text-black font-orbitron font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_#9effa1] cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={18} /> ЗІГРАТИ ЗНОВУ
            </button>
          </div>
        )}

        {gameState === 'DEFEAT' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6 text-center space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <Skull size={64} className="text-red-500 animate-pulse" />
            <h3 className="font-orbitron text-3xl font-extrabold text-red-500 shadow-[0_0_15px_#ff0055]">
              ПОРАЗКА!
            </h3>
            <p className="text-sm text-gray-300 max-w-md font-sans">
              Ваш курсор спопелено променем Ока! Відновіть сили чаєм і спробуйте знову.
            </p>
            <button
              onClick={startBattle}
              className="px-8 py-3 bg-red-500 text-white font-orbitron font-bold rounded-xl hover:bg-red-400 transition-all shadow-[0_0_20px_#ff0055] cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={18} /> СПРОБУВАТИ ЩЕ РАЗ
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          onMouseMove={(e) => handlePointer(e.clientX, e.clientY)}
          onMouseDown={(e) => {
            stateRef.current.isMouseDown = true;
            handlePointer(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            stateRef.current.isMouseDown = true;
            if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className="w-full aspect-[16/9] block"
        />
      </div>

      {/* Footer controls hint */}
      <div className="flex flex-wrap justify-between items-center text-xs text-gray-400 font-mono pt-1">
        <span>🖱️ <b>Курсор / Дотик</b> — плавне керування</span>
        <span>💥 <b>Затиснути кнопку</b> — стрільба без затримок</span>
        <span>🛡️ <b>Ухиляйтеся</b> від червоних променів</span>
      </div>
    </div>
  );
};
