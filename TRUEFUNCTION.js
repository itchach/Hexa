    /* ============================================
    LOGICALC — TRUTH TABLE CALCULATOR
    script.js
    ============================================ */

    "use strict";

    /* ============================================
    EXPRESSION PARSER & EVALUATOR
    ============================================ */
    
    /**
     * Normalize expression: replace alias operators with canonical symbols
     */
    function normalizeExpr(expr) {
    return expr
        .replace(/<->/g, '↔')
        .replace(/<->|<→/g, '↔')
        .replace(/->/g, '→')
        .replace(/&&/g, '∧')
        .replace(/\|\|/g, '∨')
        .replace(/!/g, '¬')
        .replace(/\bAND\b/gi, '∧')
        .replace(/\bOR\b/gi, '∨')
        .replace(/\bNOT\b/gi, '¬')
        .replace(/\bIMP\b/gi, '→')
        .replace(/\bIFF\b/gi, '↔')
        .replace(/\s+/g, ' ')
        .trim();
    }

    /**
     * Extract unique variables (A–Z) from expression, preserving order of appearance
     */
    function extractVariables(expr) {
    const seen = new Set();
    const vars = [];
    for (const ch of expr) {
        if (/[A-Z]/.test(ch) && !seen.has(ch)) {
        seen.add(ch);
        vars.push(ch);
        }
    }
    return vars;
    }

    /**
     * Tokenizer: breaks expression into tokens
     */
    function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const ch = expr[i];
        if (ch === ' ') { i++; continue; }
        if (/[A-Z]/.test(ch)) { tokens.push({ type: 'VAR', val: ch }); i++; continue; }
        if (ch === '¬') { tokens.push({ type: 'NOT' }); i++; continue; }
        if (ch === '∧') { tokens.push({ type: 'AND' }); i++; continue; }
        if (ch === '∨') { tokens.push({ type: 'OR' }); i++; continue; }
        if (ch === '→') { tokens.push({ type: 'IMP' }); i++; continue; }
        if (ch === '↔') { tokens.push({ type: 'BICON' }); i++; continue; }
        if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
        if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }
        throw new Error(`Unknown character: "${ch}"`);
    }
    return tokens;
    }

    /**
     * Recursive descent parser
     * Grammar (descending precedence):
     *   expr     → bicon
     *   bicon    → imp ('↔' imp)*
     *   imp      → disj ('→' disj)*   [right-assoc]
     *   disj     → conj ('∨' conj)*
     *   conj     → unary ('∧' unary)*
     *   unary    → '¬' unary | primary
     *   primary  → VAR | '(' expr ')'
     */
    function parse(tokens) {
    let pos = 0;

    function peek() { return tokens[pos]; }
    function consume(type) {
        const tok = tokens[pos];
        if (type && (!tok || tok.type !== type)) {
        throw new Error(`Expected ${type} at position ${pos}, got ${tok ? tok.type : 'EOF'}`);
        }
        pos++;
        return tok;
    }

    function parseBicon() {
        let left = parseImp();
        while (peek() && peek().type === 'BICON') {
        consume('BICON');
        const right = parseImp();
        const l = left, r = right;
        left = (env) => parseBicon_eval(l(env), r(env));
        }
        return left;
    }

    function parseBicon_eval(a, b) { return a === b; }

    function parseImp() {
        const left = parseDisj();
        if (peek() && peek().type === 'IMP') {
        consume('IMP');
        const right = parseImp(); // right-associative
        return (env) => (!left(env) || right(env));
        }
        return left;
    }

    function parseDisj() {
        let left = parseConj();
        while (peek() && peek().type === 'OR') {
        consume('OR');
        const right = parseConj();
        const l = left, r = right;
        left = (env) => l(env) || r(env);
        }
        return left;
    }

    function parseConj() {
        let left = parseUnary();
        while (peek() && peek().type === 'AND') {
        consume('AND');
        const right = parseUnary();
        const l = left, r = right;
        left = (env) => l(env) && r(env);
        }
        return left;
    }

    function parseUnary() {
        if (peek() && peek().type === 'NOT') {
        consume('NOT');
        const inner = parseUnary();
        return (env) => !inner(env);
        }
        return parsePrimary();
    }

    function parsePrimary() {
        const tok = peek();
        if (!tok) throw new Error('Unexpected end of expression');
        if (tok.type === 'VAR') {
        consume('VAR');
        const name = tok.val;
        return (env) => env[name];
        }
        if (tok.type === 'LPAREN') {
        consume('LPAREN');
        const inner = parseBicon();
        consume('RPAREN');
        return inner;
        }
        throw new Error(`Unexpected token: ${tok.type}`);
    }

    const fn = parseBicon();
    if (pos !== tokens.length) {
        throw new Error(`Unexpected token at position ${pos}`);
    }
    return fn;
    }

    /**
     * Evaluate expression with variable bindings
     */
    function evaluate(expr, env) {
    const normalized = normalizeExpr(expr);
    const tokens = tokenize(normalized);
    const fn = parse(tokens);
    return fn(env);
    }

    /**
     * Generate all truth combinations for n variables
     */
function generateCombinations(vars) {
    const n = vars.length;
    const rows = [];
    const total = Math.pow(2, n);

    for (let i = 0; i < total; i++) {
        const env = {};

        for (let j = 0; j < n; j++) {
            const blockSize = Math.pow(2, n - j - 1);
            env[vars[j]] = Math.floor(i / blockSize) % 2 === 0;
        }

        rows.push(env);
    }

    return rows;
}

    /**
     * Build complete truth table data
     */
    function buildTruthTable(exprRaw) {
    const expr = normalizeExpr(exprRaw);
    if (!expr) throw new Error('Empty expression');
    const vars = extractVariables(expr);
    if (vars.length === 0) throw new Error('No variables found');
    if (vars.length > 5) throw new Error('Maximum 5 variables supported');
    const rows = generateCombinations(vars);
    const results = rows.map(env => {
        try { return evaluate(expr, env); }
        catch (e) { throw new Error('Evaluation error: ' + e.message); }
    });
    return { vars, rows, results, expr };
    }

    /* ============================================
    DOM HELPERS
    ============================================ */
    const $ = id => document.getElementById(id);
    const boolStr = v => v ? 'T' : 'F';
    const boolClass = v => v ? 'cell-t' : 'cell-f';

    function showToast(msg, duration = 2200) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
    }

    /* ============================================
    TRUTH TABLE RENDERER
    ============================================ */
    function renderTruthTable(data) {
    const { vars, rows, results, expr } = data;
    const section = $('table-section');
    const table = $('truth-table');
    const title = $('table-title');
    const rowCount = $('row-count');

    title.textContent = expr;
    rowCount.textContent = `${rows.length} rows`;

    // Build header
    let html = '<thead><tr>';
    vars.forEach(v => { html += `<th>${v}</th>`; });
    html += `<th class="result-col">Result</th></tr></thead>`;

    // Build body
    html += '<tbody>';
    rows.forEach((env, i) => {
        html += '<tr>';
        vars.forEach(v => {
        html += `<td class="${boolClass(env[v])}">${boolStr(env[v])}</td>`;
        });
        html += `<td class="result-col ${boolClass(results[i])}">${boolStr(results[i])}</td>`;
        html += '</tr>';
    });
    html += '</tbody>';

    table.innerHTML = html;
    section.style.display = 'block';
    $('btn-copy-table').style.display = '';
    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ============================================
    CALCULATOR INPUT LOGIC
    ============================================ */
    const input = $('expr-input');

    function insertAtCursor(text) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.slice(0, start) + text + val.slice(end);
    input.selectionStart = input.selectionEnd = start + text.length;
    input.focus();
    input.classList.remove('error');
    }

    // Calc buttons
    document.querySelectorAll('.calc-btn[data-insert]').forEach(btn => {
    btn.addEventListener('click', () => {
        insertAtCursor(btn.dataset.insert);
        ripple(btn);
    });
    });

    // Clear
    $('btn-clear').addEventListener('click', () => {
    input.value = '';
    input.classList.remove('error');
    input.focus();
    ripple($('btn-clear'));
    });

    // Backspace
    $('btn-back').addEventListener('click', () => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start !== end) {
        const val = input.value;
        input.value = val.slice(0, start) + val.slice(end);
        input.selectionStart = input.selectionEnd = start;
    } else if (start > 0) {
        // Handle multi-char operators
        const val = input.value;
        let del = 1;
        const multi = [' ∧ ', ' ∨ ', ' → ', ' ↔ '];
        for (const op of multi) {
        if (val.slice(start - op.length, start) === op) { del = op.length; break; }
        }
        input.value = val.slice(0, start - del) + val.slice(start);
        input.selectionStart = input.selectionEnd = start - del;
    }
    input.focus();
    });

    // Evaluate
    $('btn-eval').addEventListener('click', evaluateExpr);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') evaluateExpr(); });

    function evaluateExpr() {
    const raw = input.value.trim();
    if (!raw) { showToast('Please enter an expression'); return; }
    try {
        const data = buildTruthTable(raw);
        renderTruthTable(data);
        input.classList.remove('error');
    } catch (err) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 700);
        showToast('Error: ' + err.message, 3000);
    }
    }

    // Copy expression
    $('btn-copy-expr').addEventListener('click', () => {
    if (!input.value.trim()) return;
    navigator.clipboard.writeText(input.value).then(() => showToast('Expression copied!'));
    });

    // Copy table
    $('btn-copy-table').addEventListener('click', () => {
    const table = $('truth-table');
    if (!table.innerHTML) return;
    let text = '';
    table.querySelectorAll('tr').forEach(row => {
        const cells = [...row.querySelectorAll('th, td')].map(c => c.textContent.padEnd(6));
        text += cells.join(' ') + '\n';
    });
    navigator.clipboard.writeText(text).then(() => showToast('Table copied to clipboard!'));
    });

    /* ============================================
    BUTTON RIPPLE EFFECT
    ============================================ */
    function ripple(btn) {
    btn.style.transform = 'scale(0.93) translateY(1px)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
    }

    /* ============================================
    RANDOM EXPRESSION GENERATOR
    ============================================ */
    const RANDOM_TEMPLATES = [
    (a, b) => `${a} ∧ ${b}`,
    (a, b) => `${a} ∨ ${b}`,
    (a, b) => `¬${a} ∧ ${b}`,
    (a, b) => `${a} → ${b}`,
    (a, b) => `${a} ↔ ${b}`,
    (a, b) => `¬(${a} ∧ ${b})`,
    (a, b) => `¬${a} ∨ ¬${b}`,
    (a, b) => `(${a} ∨ ${b}) → ${a}`,
    (a, b, c) => `(${a} ∧ ${b}) ∨ ${c}`,
    (a, b, c) => `${a} → (${b} ∨ ${c})`,
    (a, b, c) => `¬${a} ∧ (${b} ↔ ${c})`,
    (a, b, c) => `(${a} ∨ ${b}) ∧ ¬${c}`,
    (a, b, c) => `(${a} → ${b}) ∧ (${b} → ${c})`,
    (a, b, c) => `¬(${a} ∨ ${b}) ↔ (¬${a} ∧ ¬${b})`,
    (a, b, c) => `${a} ↔ (${b} ∧ ${c})`,
    ];

    function getRandomExpression(forQuiz = false) {
    const allVars = ['P', 'Q', 'R', 'A', 'B'];
    const numVars = forQuiz ? (Math.random() < 0.5 ? 2 : 3) : (Math.floor(Math.random() * 3) + 2);
    const shuffled = [...allVars].sort(() => Math.random() - 0.5).slice(0, numVars);
    const templates = RANDOM_TEMPLATES.filter(t => t.length <= numVars);
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    return tpl(...shuffled);
    }

    $('btn-random').addEventListener('click', () => {
    const expr = getRandomExpression(false);
    input.value = expr;
    input.classList.remove('error');
    ripple($('btn-random'));
    evaluateExpr();
    });

    /* ============================================
    QUIZ MODE
    ============================================ */
    let quizData = null;

    $('btn-quiz').addEventListener('click', startQuiz);
    $('quiz-close').addEventListener('click', () => { $('quiz-panel').style.display = 'none'; });
    $('btn-new-quiz').addEventListener('click', startQuiz);
    $('btn-check').addEventListener('click', checkQuiz);

    function startQuiz() {
    const expr = getRandomExpression(true);
    try {
        quizData = buildTruthTable(expr);
    } catch (e) {
        showToast('Error generating quiz'); return;
    }
    $('quiz-expr-display').textContent = quizData.expr;
    $('quiz-score').style.display = 'none';
    renderQuizTable();
    $('quiz-panel').style.display = 'block';
    $('quiz-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderQuizTable() {
    const { vars, rows } = quizData;
    const table = $('quiz-table');

    let html = '<thead><tr>';
    vars.forEach(v => { html += `<th>${v}</th>`; });
    html += `<th class="result-col">Result</th></tr></thead>`;

    html += '<tbody>';
    rows.forEach((env, i) => {
        html += '<tr>';
        vars.forEach(v => {
        html += `<td class="${boolClass(env[v])}">${boolStr(env[v])}</td>`;
        });
        html += `<td class="result-col"><input class="quiz-input" data-row="${i}" maxlength="1" placeholder="?" autocomplete="off"/></td>`;
        html += '</tr>';
    });
    html += '</tbody>';

    table.innerHTML = html;

    // Auto-advance on T/F/t/f/1/0 input
    table.querySelectorAll('.quiz-input').forEach(inp => {
        inp.addEventListener('input', function() {
        const v = this.value.toUpperCase();
        if (v === 'T' || v === 'F') {
            this.value = v;
            this.classList.remove('correct', 'wrong');
            // Move to next
            const all = [...table.querySelectorAll('.quiz-input')];
            const idx = all.indexOf(this);
            if (idx < all.length - 1) all[idx + 1].focus();
        } else if (v === '1') { this.value = 'T'; }
        else if (v === '0') { this.value = 'F'; }
        else { this.value = ''; }
        });
        inp.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value) {
            const all = [...table.querySelectorAll('.quiz-input')];
            const idx = all.indexOf(this);
            if (idx > 0) { all[idx - 1].focus(); all[idx - 1].value = ''; }
        }
        });
    });
    }

    function checkQuiz() {
    if (!quizData) return;
    const inputs = document.querySelectorAll('#quiz-table .quiz-input');
    let correct = 0;
    let answered = 0;
    inputs.forEach((inp, i) => {
        const userVal = inp.value.toUpperCase();
        if (!userVal) { inp.classList.add('wrong'); return; }
        answered++;
        const expected = boolStr(quizData.results[i]);
        if (userVal === expected) {
        inp.classList.remove('wrong'); inp.classList.add('correct');
        correct++;
        } else {
        inp.classList.remove('correct'); inp.classList.add('wrong');
        }
    });

    const total = quizData.results.length;
    const pct = Math.round((correct / total) * 100);
    const msg = correct === total
        ? `🎉 Perfect! ${correct}/${total} — All correct!`
        : correct === 0
        ? `😬 ${correct}/${total} — Keep practicing!`
        : `✅ ${correct}/${total} (${pct}%) — ${correct >= total * 0.7 ? 'Good effort!' : 'Keep at it!'}`;

    const scoreEl = $('quiz-score');
    scoreEl.textContent = msg;
    scoreEl.style.display = 'block';
    }

    /* ============================================
    CHEAT SHEET
    ============================================ */
    $('btn-sheet').addEventListener('click', () => {
    $('sheet-overlay').style.display = 'flex';
    });

    $('sheet-close').addEventListener('click', () => {
    $('sheet-overlay').style.display = 'none';
    });

    $('sheet-overlay').addEventListener('click', (e) => {
    if (e.target === $('sheet-overlay')) $('sheet-overlay').style.display = 'none';
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $('sheet-overlay').style.display = 'none';
    });

    /* ============================================
    THEME SWITCHER
    ============================================ */
    
const themes = ['spring', 'summer', 'fall', 'winter'];

const music = document.getElementById("bg-music");

const config = {
    spring: { bg: "sprin.gif", music: "sounds/Spring.mp3" },
    summer: { bg: "Summer.gif", music: "sounds/Summer.mp3" },
    fall:   { bg: "Fall.gif",   music: "sounds/Falls.mp3" },
    winter: { bg: "Winter.gif", music: "sounds/Winter.mp3" }
};

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;

        // ✅ YOUR ORIGINAL SYSTEM (KEEP THIS)
        themes.forEach(t => document.body.classList.remove('theme-' + t));
        document.body.classList.add('theme-' + theme);

        // 🎨 BACKGROUND IMAGE (FIX MISSING PART)
        document.body.style.backgroundImage = `url(${config[theme].bg})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // 🎵 MUSIC
        music.src = config[theme].music;
        music.volume = 0.4;
        music.play().catch(() => {
            console.log("Click required for audio");
        });

        // 🔘 ACTIVE BUTTON UI
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 🌸 TOAST
        const emojis = { spring: '🌸', summer: '☀️', fall: '🍂', winter: '❄️' };
        showToast(`Switched to ${emojis[theme]} ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`);
    });
});

    /* ============================================
    INIT
    ============================================ */
    input.focus();