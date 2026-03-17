//Start.js
(function () {
  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function initThemeAndNavigation() {
    const root = document.documentElement;
    const toggle = document.querySelector(".theme-toggle");
    const menuButton = document.querySelector(".site-header__menu-button");
    const nav = document.querySelector(".site-header__nav");

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);

      if (toggle) {
        toggle.setAttribute("aria-pressed", String(theme === "dark"));
      }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      applyTheme(savedTheme);
    } else {
      applyTheme(root.getAttribute("data-theme") || "dark");
    }

    toggle?.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    menuButton?.addEventListener("click", () => {
      const isOpen = nav?.classList.toggle("is-open") ?? false;
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initTypingEffect() {
    const target = document.querySelector("[data-typing]");
    if (!target) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let words = [];

    try {
      words = JSON.parse(target.getAttribute("data-words") || "[]");
    } catch {
      words = [];
    }

    if (!Array.isArray(words) || words.length === 0) return;

    if (prefersReduced) {
      target.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const currentWord = words[wordIndex];
      const visibleText = currentWord.slice(0, charIndex);

      target.textContent = visibleText;

      let timeout = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex += 1;
      } else if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        timeout = 1200;
      } else if (isDeleting && charIndex > 0) {
        charIndex -= 1;
        timeout = 35;
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 350;
      }

      window.setTimeout(tick, timeout);
    }

    tick();
  }

  function initStarsCanvas() {
    const canvas = document.getElementById("stars");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;

let starsFar = [];
let starsMid = [];
let starsNear = [];
let meteors = [];
let nebula = [];
let cloudsFar = [];
let cloudsMid = [];
let cloudsNear = [];
let lightParticles = [];

    let mouse = { x: 0.5, y: 0.5, vx: 0, vy: 0 };

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function isDarkTheme() {
      return (
        (document.documentElement.getAttribute("data-theme") || "dark") ===
        "dark"
      );
    }

  function themeMul() {
  return isDarkTheme() ? 1 : 0;
}

function lightMul() {
  return isDarkTheme() ? 0 : 1;
}

    function rand(a, b) {
      return a + Math.random() * (b - a);
    }

    function makeStars(count, rMin, rMax, aMin, aMax, twMin, twMax) {
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(rMin, rMax) * dpr,
        a: rand(aMin, aMax),
        tw: rand(twMin, twMax),
        phase: Math.random() * Math.PI * 2,
        hue:
          Math.random() < 0.08
            ? rand(35, 55)
            : Math.random() < 0.04
              ? rand(210, 235)
              : null,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

     const area = window.innerWidth * window.innerHeight;

/* dark theme: estrelas + nebulosa */
const starFarCount = clamp(Math.floor(area / 5000), 140, 480);
const starMidCount = clamp(Math.floor(area / 9000), 70, 220);
const starNearCount = clamp(Math.floor(area / 15000), 40, 140);

starsFar = makeStars(starFarCount, 0.45, 1.0, 0.14, 0.45, 0.0015, 0.005);
starsMid = makeStars(starMidCount, 0.85, 1.45, 0.18, 0.65, 0.002, 0.008);
starsNear = makeStars(starNearCount, 1.2, 2.0, 0.24, 0.8, 0.003, 0.01);

const nebCount = clamp(Math.floor(area / 180000), 4, 10);
nebula = Array.from({ length: nebCount }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: rand(180, 440) * dpr,
  a: rand(0.025, 0.06),
  driftX: rand(-0.03, 0.03) * dpr,
  driftY: rand(-0.03, 0.03) * dpr,
}));

/* light theme: nuvens + partículas */
function makeCloudLayer(count, config) {
  return Array.from({ length: count }, () => {
    const scale = rand(config.scaleMin, config.scaleMax);
    return {
      x: rand(-260, w * 0.82),
      y: rand(config.yMin * h, config.yMax * h),
      width: rand(config.widthMin, config.widthMax) * scale * dpr,
      height: rand(config.heightMin, config.heightMax) * scale * dpr,
      speed: rand(config.speedMin, config.speedMax) * dpr,
      alpha: rand(config.alphaMin, config.alphaMax),
      blur: rand(config.blurMin, config.blurMax) * dpr,
    };
  });
}

const farCount = clamp(Math.floor(area / 240000), 3, 5);
const midCount = clamp(Math.floor(area / 180000), 4, 7);
const nearCount = clamp(Math.floor(area / 135000), 5, 9);

cloudsFar = makeCloudLayer(farCount, {
  scaleMin: 1.25,
  scaleMax: 1.9,
  yMin: 0.06,
  yMax: 0.22,
  widthMin: 220,
  widthMax: 360,
  heightMin: 48,
  heightMax: 88,
  speedMin: 0.015,
  speedMax: 0.04,
  alphaMin: 0.12,
  alphaMax: 0.18,
  blurMin: 22,
  blurMax: 34,
});

cloudsMid = makeCloudLayer(midCount, {
  scaleMin: 1.0,
  scaleMax: 1.55,
  yMin: 0.12,
  yMax: 0.30,
  widthMin: 180,
  widthMax: 300,
  heightMin: 48,
  heightMax: 86,
  speedMin: 0.03,
  speedMax: 0.08,
  alphaMin: 0.16,
  alphaMax: 0.24,
  blurMin: 16,
  blurMax: 28,
});

cloudsNear = makeCloudLayer(nearCount, {
  scaleMin: 0.95,
  scaleMax: 1.4,
  yMin: 0.18,
  yMax: 0.40,
  widthMin: 160,
  widthMax: 270,
  heightMin: 52,
  heightMax: 92,
  speedMin: 0.05,
  speedMax: 0.11,
  alphaMin: 0.22,
  alphaMax: 0.34,
  blurMin: 10,
  blurMax: 20,
});

const particleCount = clamp(Math.floor(area / 22000), 28, 72);
lightParticles = Array.from({ length: particleCount }, () => ({
  x: Math.random() * w,
  y: rand(h * 0.02, h * 0.62),
  r: rand(1.2, 3.2) * dpr,
  a: rand(0.1, 0.26),
  driftX: rand(0.02, 0.08) * dpr,
  driftY: rand(-0.01, 0.015) * dpr,
  phase: Math.random() * Math.PI * 2,
  tw: rand(0.002, 0.008),
}));

meteors = [];
    }
function drawCloudLayer(layer, alphaMul, parallaxX, parallaxY) {
  if (!layer.length || alphaMul <= 0) return;

  const px = (mouse.x - 0.5) * parallaxX * dpr;
  const py = (mouse.y - 0.5) * parallaxY * dpr;

  ctx.save();

  for (const c of layer) {
    c.x += c.speed;

    if (c.x - c.width > w + 140 * dpr) {
      c.x = -c.width - rand(40, 220) * dpr;
      c.y = rand(h * 0.06, h * 0.44);
    }

    const x = c.x + px;
    const y = c.y + py;

    ctx.save();
    ctx.globalAlpha = c.alpha * alphaMul;
    ctx.filter = `blur(${c.blur}px)`;

 const g = ctx.createRadialGradient(
  x,
  y,
  c.width * 0.06,
  x,
  y,
  c.width * 0.62
);

g.addColorStop(0, "rgba(255,255,255,1)");
g.addColorStop(0.35, "rgba(255,255,255,0.88)");
g.addColorStop(0.72, "rgba(255,255,255,0.42)");
g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.ellipse(x, y, c.width * 0.46, c.height * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
      x - c.width * 0.18,
      y + c.height * 0.02,
      c.width * 0.28,
      c.height * 0.3,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
      x + c.width * 0.2,
      y - c.height * 0.03,
      c.width * 0.26,
      c.height * 0.28,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function drawLightParticles(alphaMul) {
  if (!lightParticles.length || alphaMul <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const p of lightParticles) {
    p.phase += p.tw;
    p.x += p.driftX;
    p.y += p.driftY;

    if (p.x > w + 24 * dpr) p.x = -16 * dpr;
    if (p.y < -20 * dpr) p.y = h * 0.45;
    if (p.y > h * 0.68) p.y = h * 0.12;

   const a = clamp(p.a + Math.sin(p.phase) * 0.06, 0.06, 0.34) * alphaMul;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 249, 220, ${a})`;
    ctx.fill();

    if (p.r > 1.8 * dpr) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 244, 196, ${a * 0.18})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawSunGlow(alphaMul) {
  if (alphaMul <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const x = w * 0.52;
  const y = -30 * dpr;
  const r = Math.max(w * 0.24, h * 0.2);

  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255, 245, 196, ${0.36 * alphaMul})`);
  g.addColorStop(0.24, `rgba(255, 232, 170, ${0.2 * alphaMul})`);
  g.addColorStop(0.58, `rgba(255, 255, 255, ${0.08 * alphaMul})`);
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
    function drawNebula(alphaMul) {
      if (!nebula.length || alphaMul <= 0) return;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (const n of nebula) {
        n.x += n.driftX;
        n.y += n.driftY;

        if (n.x < -n.r) n.x = w + n.r;
        if (n.x > w + n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = h + n.r;
        if (n.y > h + n.r) n.y = -n.r;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `rgba(155,61,255,${n.a * alphaMul})`);
        g.addColorStop(0.5, `rgba(91,33,182,${n.a * 0.55 * alphaMul})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawStars(stars, alphaMul, parallaxStrength) {
      if (alphaMul <= 0) return;

      const px = (mouse.x - 0.5) * parallaxStrength * dpr;
      const py = (mouse.y - 0.5) * parallaxStrength * dpr;

      for (const s of stars) {
        s.phase += s.tw;

        const tw = prefersReduced ? 0 : Math.sin(s.phase) * 0.12;
        const a = clamp(s.a + tw, 0.06, 0.95) * alphaMul;

        const x = s.x + px;
        const y = s.y + py;

        if (s.hue != null) {
          ctx.fillStyle = `hsla(${s.hue}, 90%, 88%, ${a})`;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${a})`;
        }

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.6 * dpr) {
          ctx.save();
          ctx.globalAlpha = a * 0.2;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 2.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a * 0.15})`;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    function maybeSpawnMeteor(alphaMul) {
      if (prefersReduced || alphaMul <= 0) return;

      const chance = 0.0032;
      if (Math.random() > chance) return;

      const startX = Math.random() * w;
      const startY = rand(-80, h * 0.38);
      const len = rand(180, 380) * dpr;
      const speed = rand(14, 21) * dpr;
      const ang = rand(Math.PI * 0.78, Math.PI * 0.9);

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        len,
        life: 0,
        max: rand(16, 28),
      });

      if (meteors.length > 3) {
        meteors.shift();
      }
    }

    function drawMeteors(alphaMul) {
      if (!meteors.length || alphaMul <= 0) return;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      meteors = meteors.filter((m) => m.life < m.max);

      for (const m of meteors) {
        m.life += 1;
        m.x += m.vx;
        m.y += m.vy;

        const fade = 1 - m.life / m.max;
        const a = 0.36 * fade * alphaMul;

        const norm = Math.hypot(m.vx, m.vy);
        const x2 = m.x - m.vx * (m.len / norm);
        const y2 = m.y - m.vy * (m.len / norm);

        const grad = ctx.createLinearGradient(m.x, m.y, x2, y2);
        grad.addColorStop(0, `rgba(255,255,255,${a})`);
        grad.addColorStop(0.3, `rgba(242,201,255,${a * 0.65})`);
        grad.addColorStop(0.6, `rgba(155,61,255,${a * 0.28})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * dpr;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, w, h);
    }
function tick() {
  const darkAlpha = themeMul();
  const lightAlpha = lightMul();

  clearCanvas();

  if (darkAlpha > 0) {
    drawNebula(darkAlpha * 0.9);
    drawStars(starsFar, darkAlpha * 0.72, 8);
    drawStars(starsMid, darkAlpha * 0.88, 18);
    drawStars(starsNear, darkAlpha, 32);

    maybeSpawnMeteor(darkAlpha);
    drawMeteors(darkAlpha);
  }

if (lightAlpha > 0) {
  drawSunGlow(lightAlpha);
  drawCloudLayer(cloudsFar, lightAlpha * 0.85, 4, 2);
  drawCloudLayer(cloudsMid, lightAlpha * 0.95, 8, 4);
  drawCloudLayer(cloudsNear, lightAlpha, 14, 7);
  drawLightParticles(lightAlpha);
}

  raf = requestAnimationFrame(tick);
}

    function onMove(e) {
      if (prefersReduced) return;

      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;

      mouse.vx = (nx - mouse.x) * 0.08;
      mouse.vy = (ny - mouse.y) * 0.08;

      mouse.x += mouse.vx;
      mouse.y += mouse.vy;
    }

    function onTouch(e) {
      if (!e.touches || !e.touches[0]) return;
      onMove(e.touches[0]);
    }

    resize();
    tick();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const observer = new MutationObserver(() => {
      if (!isDarkTheme()) {
        clearCanvas();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("beforeunload", () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initThemeAndNavigation();
    initTypingEffect();
    initStarsCanvas();
  });
})();