const $ = s => document.querySelector(s);
if (LETRA_ARRIBA) $('#m').classList.add('arriba');

/* ---------- Canción y reloj ---------- */
const audio = new Audio(CANCION);
let t0 = null;
// Usa el tiempo del audio; si el mp3 no carga, usa un reloj interno para poder probar.
const reloj = () => (audio.readyState > 0 && !audio.error && !audio.paused)
    ? audio.currentTime
    : (performance.now() - t0) / 1000;

$('#ov').onclick = () => {
    t0 = performance.now();
    audio.play().catch(() => {});
    $('#ov').style.opacity = 0;
    setTimeout(() => $('#ov').remove(), 1300);
    setTimeout(escribir, TEXTO_INICIA * 1000);
};

/* ---------- Texto que se escribe solo ---------- */
async function escribir() {
    const el = $('#poem');
    for (const ch of TEXTO) {
        el.textContent += ch;
        await new Promise(r => setTimeout(r, ch === '\n' ? 650 : /[,.]/.test(ch) ? 280 : VELOCIDAD));
    }
}

/* ---------- Letra dentro del contenedor (un verso a la vez) ---------- */
const linea = document.createElement('p');
$('#letras').appendChild(linea);
let actual = -2, espera;
function letra() {
    const ahora = reloj() + ADELANTO;
    let idx = -1;
    LETRA.forEach((l, i) => { if (l.t <= ahora) idx = i; });
    if (idx === actual) return;
    actual = idx;
    linea.classList.remove('visible');
    clearTimeout(espera);
    espera = setTimeout(() => {
        linea.textContent = idx >= 0 ? LETRA[idx].text : '';
        linea.classList.add('visible');
    }, 250);
}

/* ---------- Reloj de ayuda (tecla T o #tiempo) ---------- */
const dbg = $('#dbg');
if (location.hash === '#tiempo') dbg.style.display = 'block';
addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 't') dbg.style.display = dbg.style.display === 'block' ? 'none' : 'block';
});

/* ---------- Canvas: flor y pétalos ---------- */
const cv = $('#cv'), c = cv.getContext('2d');
let W, H, D, fx, fy, s;
function resize() {
    D = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * D; cv.height = H * D;
    if (W > H && H <= 520) { fx = W * .25; fy = H * .5; s = H / 440; }
    else { fx = W / 2; fy = H * .25; s = Math.min(W / 330, H * .46 / 420); }
}
addEventListener('resize', resize);
resize();

function bez(p, u) {
    const m = 1 - u;
    return [
        m*m*m*p[0][0] + 3*m*m*u*p[1][0] + 3*m*u*u*p[2][0] + u*u*u*p[3][0],
        m*m*m*p[0][1] + 3*m*m*u*p[1][1] + 3*m*u*u*p[2][1] + u*u*u*p[3][1]
    ];
}
// Cinta curva con ancho variable: wf(u) devuelve el ancho en cada punto (u de 0 a 1)
function cinta(p, wf, n = 24) {
    const A = [], B = [];
    for (let i = 0; i <= n; i++) {
        const u = i / n, q = bez(p, u), a = bez(p, Math.max(0, u - .01)), b = bez(p, Math.min(1, u + .01));
        const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = wf(u) / 2;
        A.push([q[0] - dy / d * w, q[1] + dx / d * w]);
        B.push([q[0] + dy / d * w, q[1] - dx / d * w]);
    }
    c.beginPath(); c.moveTo(...A[0]);
    A.forEach(q => c.lineTo(...q));
    B.reverse().forEach(q => c.lineTo(...q));
    c.closePath();
}
// Pétalo largo y fino que se enrolla en la punta (como gancho)
function petalo(L, an, i, t, ph) {
    an += Math.sin(t / 1400 + ph + i * 1.3) * .05;
    const N = 28, ds = L / N, P = [];
    let dir = Math.cos(an) >= 0 ? 1 : -1;
    if (Math.abs(Math.cos(an)) < .2) dir = i % 2 ? 1 : -1;
    const curl = 3.2 + 2.2 * ((i * 53 % 10) / 10);          // cuánto se enrolla la punta
    let x = 0, y = 0;
    for (let k = 0; k <= N; k++) {
        const u = k / N;
        P.push([x, y, u]);
        const th = an - .3 * Math.abs(Math.cos(an)) * (1 - u) + dir * curl * Math.pow(u, 3) + .3 * Math.sin(u * 7 + ph + i);
        x += Math.cos(th) * ds; y += Math.sin(th) * ds;
    }
    const A = [], B = [];
    P.forEach((q, k) => {
        const a0 = P[Math.max(0, k - 1)], b0 = P[Math.min(N, k + 1)];
        const dx = b0[0] - a0[0], dy = b0[1] - a0[1], d = Math.hypot(dx, dy) || 1, u = q[2];
        const w = L * .17 * Math.sin(Math.PI * Math.pow(u, .6)) * (1 - u * .3) * (1 + .2 * Math.sin(u * 13 + ph + i)) / 2;
        A.push([q[0] - dy / d * w, q[1] + dx / d * w]);
        B.push([q[0] + dy / d * w, q[1] - dx / d * w]);
    });
    c.beginPath(); c.moveTo(...A[0]);
    A.forEach(q => c.lineTo(...q));
    B.reverse().forEach(q => c.lineTo(...q));
    c.closePath();
    const g = c.createRadialGradient(0, 0, 0, 0, 0, L * 1.2);
    g.addColorStop(0, '#6a0716'); g.addColorStop(.5, '#c8102a'); g.addColorStop(1, '#ff3a4e');
    c.fillStyle = g; c.fill();
    c.strokeStyle = 'rgb(117, 0, 12)'; c.lineWidth = .8; c.stroke();
}
// Estambre: hilo muy largo que arquea y termina con la punta hacia arriba
function estambre(len, an, t, ph, i) {
    const N = 26, ds = len / N;
    let dir = Math.cos(an) >= 0 ? 1 : -1;
    if (Math.abs(Math.cos(an)) < .2) dir = i % 2 ? 1 : -1;
    an += Math.sin(t / 1100 + ph + i) * .025;
    let x = 0, y = 0;
    c.beginPath(); c.moveTo(0, 0);
    for (let k = 0; k <= N; k++) {
        const u = k / N, th = an + dir * (1.1 * u - 2.6 * u * u * u);
        x += Math.cos(th) * ds; y += Math.sin(th) * ds; c.lineTo(x, y);
    }
    c.strokeStyle = 'rgba(255,70,90,.9)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#ff8a5c'; c.beginPath(); c.arc(x, y, 2.1, 0, 7); c.fill();
}
function lirio(x, y, L, rot, t, ph, b) {
    c.save();
    c.translate(x, y); c.rotate(rot + Math.sin(t / 2400 + ph) * .03); c.scale(b, b);
    c.shadowColor = 'rgba(255,26,60,.5)'; c.shadowBlur = 10;
    for (let i = 0; i < 7; i++) petalo(L * (1.3 + (i % 3) * .15), -Math.PI / 2 + (i - 3) * .55, i, t, ph);
    c.shadowBlur = 0;
    for (let i = 0; i < 12; i++) estambre(L * (1.6 + .6 * ((i * 37 % 10) / 10)), -Math.PI / 2 + (i - 5.5) * .33, t, ph, i);
    c.fillStyle = '#ff2a44'; c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fill();
    c.restore();
}
// Tallos largos y delgados que se juntan abajo, con una hoja fina
function tallos(t) {
    const sw = Math.sin(t / 2200) * 5;
    const S = [
        [[140, 122], [142, 205], [178 + sw, 300], [208, 410], 3.4],
        [[215, 238], [213, 295], [222 + sw, 350], [208, 410], 3],
        [[208, 410], [214, 430], [232, 440], [236, 470], 2.6],
        [[222, 392], [236, 350 - sw], [250, 320], [256, 270], 2]
    ];
    S.forEach(p => {
        cinta(p, u => p[4] * (1 - u * .8) + .4, 30);
        c.fillStyle = '#b3122a'; c.shadowColor = 'rgba(255,26,60,.45)'; c.shadowBlur = 8; c.fill(); c.shadowBlur = 0;
    });
}

/* ---------- Pétalos que caen (forma de gota) ---------- */
const COLORES = ['#80000f', '#680010', '#99000f', '#500009', '#960000', '#6b000e'], PET = [];
const nuevo = arriba => ({
    x: Math.random() * W, y: arriba ? -30 : Math.random() * H,
    r: Math.random() < .12 ? 14 + Math.random() * 8 : 4 + Math.random() * 8,
    vy: 22 + Math.random() * 38, ph: Math.random() * 6.3,
    rot: Math.random() * 6.3, vr: (Math.random() - .5) * 1.6,
    col: COLORES[Math.random() * COLORES.length | 0], al: .7 + Math.random() * .3
});
for (let i = 0; i < (W < 600 ? 30 : 55); i++) PET.push(nuevo(false));
function gota(p, now) {
    const r = p.r;
    c.save();
    c.translate(p.x, p.y); c.rotate(p.rot);
    c.scale(1, .55 + .45 * Math.abs(Math.cos(now / 900 + p.ph)));
    c.globalAlpha = p.al; c.fillStyle = p.col;
    c.beginPath(); c.moveTo(0, -r * 1.3);
    c.bezierCurveTo(r * 1.1, -r * .4, r * .9, r * .9, -r * .1, r);
    c.bezierCurveTo(-r * .7, r * .9, -r * .5, -r * .2, 0, -r * 1.3);
    c.fill();
    c.restore();
}

/* ---------- Animación ---------- */
let ultimo = performance.now();
function frame(now) {
    const dt = Math.min((now - ultimo) / 1000, .05); ultimo = now;
    c.setTransform(D, 0, 0, D, 0, 0); c.clearRect(0, 0, W, H);
    let b = .35;
    if (t0 !== null) { const p = Math.min(1, (now - t0) / 3500); b = .35 + .65 * (1 - Math.pow(1 - p, 3)); }
    c.save(); c.translate(fx - 150 * s, fy - 150 * s); c.scale(s, s);
    tallos(now); lirio(140, 120, 56, -.1, now, 0, b); lirio(215, 236, 36, .15, now, 2, b);
    c.restore();
    for (const p of PET) {
        p.y += p.vy * dt; p.x += Math.sin(now / 1300 + p.ph) * 20 * dt; p.rot += p.vr * dt;
        if (p.y > H + 30) Object.assign(p, nuevo(true));
        gota(p, now);
    }
    if (t0 !== null) { letra(); dbg.textContent = reloj().toFixed(1) + ' s'; }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);