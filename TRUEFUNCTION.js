    /* ============================================================
    HARVEST LOGIC — script.js
    Truth Table Calculator + Seasonal Animations
    ============================================================ */

    /* ────────────────────────────────────────────────────────────
    1.  SEASON SYSTEM
    ──────────────────────────────────────────────────────────── */

    const bgMusic = new Audio('sounds/Spring.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;


    const SEASONS = {
    spring: {
        bodyClass: 'season-spring',
        icon1: '🌻', icon2: '🌱',
        buddy: '🐔',
        particles: ['🌸', '🌸', '🌷', '✿', '🌿'],
        msg: "Howdy! Enter a logical expression and I'll help you harvest the truth! Try: <code>A ^ (B v C)</code>"
    },
    summer: {
        bodyClass: 'season-summer',
        icon1: '🌞', icon2: '🌻',
        buddy: '🐄',
        particles: ['☀️', '🌻', '✨', '🌟', '💛'],
        msg: "It's a sunny day on the farm! Let's grow some logic! Try: <code>A -> (B <-> C)</code>"
    },
    fall: {
        bodyClass: 'season-fall',
        icon1: '🍂', icon2: '🎃',
        buddy: '🐑',
        particles: ['🍂', '🍁', '🍂', '🍃', '🌾'],
        msg: "The harvest is in! Time to sort some truth values. Try: <code>(A v B) ^ -(A ^ B)</code>"
    },
    winter: {
        bodyClass: 'season-winter',
        icon1: '❄️', icon2: '⛄',
        buddy: '🐧',
        particles: ['❄️', '❄️', '❄️', '✦', '⭐'],
        msg: "Cozy logic time! Snuggle up and evaluate some propositions. Try: <code>A NOR B</code>"
    }
    
    };

    let currentSeason = 'spring';
    let soundOn = false;
    let floatyInterval = null;

    function applySeason(name) {
    const s = SEASONS[name];
    if (!s) return;
    currentSeason = name;

    // Body class
    const body = document.getElementById('app');
    Object.values(SEASONS).forEach(sx => body.classList.remove(sx.bodyClass));
    body.classList.add(s.bodyClass);

    // Icons & buddy
    document.getElementById('headerIcon').textContent  = s.icon1;
    document.getElementById('headerIcon2').textContent = s.icon2;
    document.getElementById('buddyAvatar').textContent  = s.buddy;
    document.getElementById('buddyBubble').innerHTML    = s.msg;

    // Active button
    document.querySelectorAll('.season-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.season === name);
    });

    // Restart floaties
    startFloaties(s.particles);
    startParticleCanvas(name);
    let newSrc = '';

if (name === 'spring') newSrc = 'sounds/Spring.mp3';
if (name === 'summer') newSrc = 'sounds/Summer.mp3';
if (name === 'fall')   newSrc = 'sounds/Falls.mp3';
if (name === 'winter') newSrc = 'sounds/Winter.mp3';

if (bgMusic.src !== newSrc) {
    bgMusic.src = newSrc;
    bgMusic.load();
}

if (soundOn) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
}
    
    }

    /* ────────────────────────────────────────────────────────────
    2.  FLOATING EMOJI ELEMENTS
    ──────────────────────────────────────────────────────────── */
    function startFloaties(particles) {
    const container = document.getElementById('floaties');
    container.innerHTML = '';
    if (floatyInterval) clearInterval(floatyInterval);

    function spawnFloaty() {
        const el = document.createElement('span');
        el.className = 'floaty';
        el.textContent = particles[Math.floor(Math.random() * particles.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (16 + Math.random() * 18) + 'px';
        const dur = 8 + Math.random() * 10;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = (Math.random() * -dur) + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), (dur + 2) * 1000);
    }

    // Seed a few immediately
    for (let i = 0; i < 14; i++) spawnFloaty();
    floatyInterval = setInterval(spawnFloaty, 1800);
    }

    /* ────────────────────────────────────────────────────────────
    3.  CANVAS PARTICLE BACKGROUND
    ──────────────────────────────────────────────────────────── */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let canvasParticles = [];
    let animFrame;

    function startParticleCanvas(season) {
    cancelAnimationFrame(animFrame);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasParticles = [];

    const colorMap = {
        spring: ['#f9c1e0','#b8f0a0','#ffe4f0','#c8f0d8'],
        summer: ['#ffe850','#fff0a0','#ffe000','#ffd080'],
        fall:   ['#e05010','#e08020','#c84000','#f0c040'],
        winter: ['#d8eeff','#ffffff','#a8d8ff','#e8f4ff']
    };
    const colors = colorMap[season] || colorMap.spring;

    for (let i = 0; i < 60; i++) {
        canvasParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: 0.3 + Math.random() * 0.4
        });
    }
    drawCanvas();
    }

    function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(drawCanvas);
    }

    window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    });

    /* ────────────────────────────────────────────────────────────
    4.  SOUND (Web Audio API — soft click)
    ──────────────────────────────────────────────────────────── */
    let audioCtx = null;

    function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playClick() {
    if (!soundOn || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.18);
    }

    function playSuccess() {
    if (!soundOn || !audioCtx) return;
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
    });
    

    }
        document.getElementById('soundToggle').addEventListener('click', () => {
        if (!audioCtx) initAudio();
        soundOn = !soundOn;
        document.getElementById('soundToggle').textContent = soundOn ? '🔇' : '🔊';
        playClick();
    });
        document.getElementById('soundToggle').addEventListener('click', () => {
        if (!audioCtx) initAudio();

        soundOn = !soundOn;

        const btn = document.getElementById('soundToggle');
        btn.textContent = soundOn ? '🔇' : '🔊';

        if (soundOn) {
            bgMusic.play().catch(() => {});
        } else {
            bgMusic.pause();
        }

        playClick();
    });
    
    



    /* ────────────────────────────────────────────────────────────
    5.  TOKENIZER
    ──────────────────────────────────────────────────────────── */
    /*
    Supported operators & their token types:
        -      → NOT (unary prefix)
        ^      → AND
        v      → OR  (lowercase v not a variable)
        NOR    → NOR
        ->     → IMP  (implication)
        <->    → IFF  (biconditional)
        ( )    → LPAREN / RPAREN
        A-Z    → VAR
    */

    function tokenize(expr) {
    const tokens = [];
    let i = 0;
    const s = expr.trim();

    while (i < s.length) {
        // Skip whitespace
        if (s[i] === ' ' || s[i] === '\t') { i++; continue; }

        // Biconditional <->
        if (s.slice(i, i+3) === '<->') { tokens.push({ type: 'IFF',    val: '<->' }); i += 3; continue; }

        // Implication ->
        if (s.slice(i, i+2) === '->') { tokens.push({ type: 'IMP',    val: '->'  }); i += 2; continue; }

        // NOR (case-insensitive)
        if (s.slice(i, i+3).toUpperCase() === 'NOR') { tokens.push({ type: 'NOR', val: 'NOR' }); i += 3; continue; }

        // NOT -
        if (s[i] === '-') { tokens.push({ type: 'NOT', val: '-' }); i++; continue; }

        // AND ^
        if (s[i] === '^') { tokens.push({ type: 'AND', val: '^' }); i++; continue; }

        // OR v  (only lowercase or uppercase V when standalone)
        if (s[i] === 'v' && (i+1 >= s.length || !/[A-Za-z0-9]/.test(s[i+1])) ) {
        tokens.push({ type: 'OR', val: 'v' }); i++; continue;
        }

        // Parens
        if (s[i] === '(') { tokens.push({ type: 'LPAREN', val: '(' }); i++; continue; }
        if (s[i] === ')') { tokens.push({ type: 'RPAREN', val: ')' }); i++; continue; }

        // Variable A-Z (single uppercase letter)
        if (/[A-Z]/.test(s[i])) { tokens.push({ type: 'VAR', val: s[i] }); i++; continue; }

        // Also allow lowercase single letters that aren't 'v' as vars (for convenience)
        if (/[a-uw-z]/.test(s[i])) {
        tokens.push({ type: 'VAR', val: s[i].toUpperCase() }); i++; continue;
        }

        throw new Error(`Unexpected character: "${s[i]}" at position ${i}`);
    }
    return tokens;
    }

    /* ────────────────────────────────────────────────────────────
    6.  RECURSIVE DESCENT PARSER
    ──────────────────────────────────────────────────────────── */
    /*
    Grammar (lowest to highest precedence):
        expr      ::= iff
        iff       ::= imp ( '<->' imp )*
        imp       ::= or  ( '->'  or  )*
        or_nor    ::= and ( ('v'|'NOR') and )*
        and       ::= not ( '^' not )*
        not       ::= '-' not | atom
        atom      ::= VAR | '(' expr ')'
    */

    function parse(tokens) {
    let pos = 0;

    function peek()    { return tokens[pos]; }
    function consume() { return tokens[pos++]; }
    function expect(type) {
        const t = consume();
        if (!t || t.type !== type) throw new Error(`Expected ${type}, got ${t ? t.type : 'end'}`);
        return t;
    }

    function parseExpr()  { return parseIff(); }

    function parseIff() {
        let left = parseImp();
        while (peek() && peek().type === 'IFF') {
        consume();
        const right = parseImp();
        left = { op: 'IFF', left, right };
        }
        return left;
    }

    function parseImp() {
        let left = parseOrNor();
        while (peek() && peek().type === 'IMP') {
        consume();
        const right = parseOrNor();
        left = { op: 'IMP', left, right };
        }
        return left;
    }

    function parseOrNor() {
        let left = parseAnd();
        while (peek() && (peek().type === 'OR' || peek().type === 'NOR')) {
        const op = consume().type;
        const right = parseAnd();
        left = { op, left, right };
        }
        return left;
    }

    function parseAnd() {
        let left = parseNot();
        while (peek() && peek().type === 'AND') {
        consume();
        const right = parseNot();
        left = { op: 'AND', left, right };
        }
        return left;
    }

    function parseNot() {
        if (peek() && peek().type === 'NOT') {
        consume();
        const operand = parseNot();
        return { op: 'NOT', operand };
        }
        return parseAtom();
    }

    function parseAtom() {
        const t = peek();
        if (!t) throw new Error('Unexpected end of expression');
        if (t.type === 'VAR') {
        consume();
        return { op: 'VAR', name: t.val };
        }
        if (t.type === 'LPAREN') {
        consume();
        const inner = parseExpr();
        expect('RPAREN');
        return inner;
        }
        throw new Error(`Unexpected token: "${t.val}" (type ${t.type})`);
    }

    const tree = parseExpr();
    if (pos < tokens.length) {
        throw new Error(`Unexpected token after expression: "${tokens[pos].val}"`);
    }
    return tree;
    }

    /* ────────────────────────────────────────────────────────────
    7.  EVALUATOR
    ──────────────────────────────────────────────────────────── */
    function evaluate(node, env) {
    switch (node.op) {
        case 'VAR': return env[node.name];
        case 'NOT': return !evaluate(node.operand, env);
        case 'AND': return  evaluate(node.left, env) && evaluate(node.right, env);
        case 'OR':  return  evaluate(node.left, env) || evaluate(node.right, env);
        case 'NOR': return !(evaluate(node.left, env) || evaluate(node.right, env));
        case 'IMP': return !evaluate(node.left, env) || evaluate(node.right, env);
        case 'IFF': return  evaluate(node.left, env) === evaluate(node.right, env);
        default: throw new Error(`Unknown operator: ${node.op}`);
    }
    }

    /* ────────────────────────────────────────────────────────────
    8.  VARIABLE EXTRACTION (in appearance order, unique)
    ──────────────────────────────────────────────────────────── */
    function extractVars(tokens) {
    const seen = new Set();
    const vars = [];
    for (const t of tokens) {
        if (t.type === 'VAR' && !seen.has(t.val)) {
        seen.add(t.val);
        vars.push(t.val);
        }
    }
    return vars.sort(); // alphabetical
    }

    /* ────────────────────────────────────────────────────────────
    9.  TRUTH TABLE GENERATOR
    ──────────────────────────────────────────────────────────── */
    function generateTable(expr) {
    const tokens = tokenize(expr);
    const tree   = parse(tokens);
    const vars   = extractVars(tokens);
    const n      = vars.length;
    const rows   = [];

    const total = Math.pow(2, n);
    for (let i = 0; i < total; i++) {
        const env = {};
        vars.forEach((v, idx) => {
        env[v] = Boolean((i >> (n - 1 - idx)) & 1);
        });
        rows.push({ env, result: evaluate(tree, env) });
    }
    return { vars, rows, expr };
    }

    /* ────────────────────────────────────────────────────────────
    10.  DOM / RENDER
    ──────────────────────────────────────────────────────────── */
    function renderTable(vars, rows, expr) {
    const wrap  = document.getElementById('tableWrap');
    const label = document.getElementById('tableLabel');
    const table = document.getElementById('truthTable');

    label.textContent = `🌾 Truth Table for: ${expr}`;
    table.innerHTML = '';

    // thead
    const thead = table.createTHead();
    const hr    = thead.insertRow();
    [...vars, expr].forEach((col, idx) => {
        const th = document.createElement('th');
        th.textContent = col;
        if (idx === vars.length) {
        th.style.background = 'rgba(0,0,0,0.12)';
        th.style.borderLeft = '2px solid rgba(255,255,255,0.4)';
        }
        hr.appendChild(th);
    });

    // tbody
    const tbody = table.createTBody();
    rows.forEach((row, ri) => {
        const tr = tbody.insertRow();
        tr.style.animationDelay = (ri * 0.04) + 's';

        vars.forEach(v => {
        const td = tr.insertCell();
        const span = document.createElement('span');
        span.className = row.env[v] ? 'val-true' : 'val-false';
        span.textContent = row.env[v] ? 'T' : 'F';
        td.appendChild(span);
        });

        // Result column
        const tdRes = tr.insertCell();
        tdRes.style.borderLeft = '2px solid rgba(180,140,80,0.25)';
        const spanRes = document.createElement('span');
        spanRes.className = row.result ? 'val-true' : 'val-false';
        spanRes.textContent = row.result ? 'T' : 'F';
        tdRes.appendChild(spanRes);
    });

    wrap.hidden = false;
    }

    function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.textContent = msg;
    el.hidden = false;
    }

    function clearError() {
    const el = document.getElementById('errorMsg');
    el.hidden = true;
    el.textContent = '';
    }

    function setBuddyMsg(html) {
    document.getElementById('buddyBubble').innerHTML = html;
    }

    /* ────────────────────────────────────────────────────────────
    11.  EVENT WIRING
    ──────────────────────────────────────────────────────────── */
    document.getElementById('generateBtn').addEventListener('click', () => {
    playClick();
    clearError();
    const expr = document.getElementById('exprInput').value.trim();

    if (!expr) {
        showError('Please enter a logical expression first.');
        setBuddyMsg('🤔 Hmm, I need something to evaluate! Try: <code>A ^ (B v -C)</code>');
        return;
    }

    try {
        const { vars, rows } = generateTable(expr);

        if (vars.length === 0) {
        showError('No variables found. Use capital letters like A, B, C.');
        return;
        }

        renderTable(vars, rows, expr);
        playSuccess();
        setBuddyMsg(`✅ Harvested ${rows.length} rows for <code>${expr}</code>! Look at all that truth!`);
    } catch (e) {
        document.getElementById('tableWrap').hidden = true;
        showError('Parse error: ' + e.message);
        setBuddyMsg(`😰 Uh oh! Something went wrong: <em>${e.message}</em>. Check your expression!`);
    }
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
    playClick();
    document.getElementById('exprInput').value = '';
    document.getElementById('tableWrap').hidden = true;
    clearError();
    setBuddyMsg(SEASONS[currentSeason].msg);
    });

    document.querySelectorAll('.season-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playClick();
        applySeason(btn.dataset.season);
    });
    });

    document.getElementById('soundToggle').addEventListener('click', () => {
    if (!audioCtx) initAudio();
    soundOn = !soundOn;
    document.getElementById('soundToggle').textContent = soundOn ? '🔊' : '🔇';
    playClick();
    });

    // Also allow Enter key in input
    document.getElementById('exprInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('generateBtn').click();
    });

    /* ────────────────────────────────────────────────────────────
    12.  INIT
    ──────────────────────────────────────────────────────────── */
    applySeason('spring');