/**
 * script.js — Vim Console  |  Chinmay Sharma
 *
 * Fetches node.c (plain C text), runs a syntax highlighter,
 * and renders the result inside the vim-style terminal.
 *
 * To change the displayed file, edit SOURCE_FILE below.
 * URLs inside comments become clickable <a> links automatically.
 */
"use strict";

const SOURCE_FILE = "node.c";   // ← point at any .c file you like

/* ── C language tables ───────────────────────────────────────────── */
const KW = new Set([
  "auto","break","case","const","continue","default","do","else","enum",
  "extern","for","goto","if","inline","register","restrict","return",
  "sizeof","static","struct","switch","typedef","union","unsigned",
  "volatile","while","signed"
]);
const TY = new Set([
  "int","float","double","char","long","short","void","bool",
  "size_t","ssize_t","ptrdiff_t","FILE","va_list",
  "uint8_t","uint16_t","uint32_t","uint64_t",
  "int8_t","int16_t","int32_t","int64_t"
]);

/* ── HTML helpers ────────────────────────────────────────────────── */
function esc(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/** Wrap bare URLs inside already-escaped comment HTML */
function linkify(html) {
  return html.replace(
    /(https?:\/\/[^\s&<>"']+)/g,
    `<a class="tok-link" href="$1" target="_blank" rel="noopener noreferrer">$1</a>`
  );
}

function span(cls, text) {
  const e = esc(text);
  return `<span class="${cls}">${cls === "tok-comment" ? linkify(e) : e}</span>`;
}

/* ── Tokenise one line ───────────────────────────────────────────── */
/**
 * @param {string}  line
 * @param {boolean} inBC  — true if we're inside a block comment
 * @returns {{ html: string, inBC: boolean }}
 */
function tokenizeLine(line, inBC) {
  let out = "";
  let i   = 0;
  const n = line.length;
  const at  = (d = 0) => (i + d < n ? line[i + d] : "");
  const eat = (k = 1) => { const s = line.slice(i, i + k); i += k; return s; };

  /* Keep track of previous significant token to detect struct names */
  let prevKw = "";

  /* ── Continue block comment from previous line ── */
  if (inBC) {
    let buf = "";
    while (i < n) {
      if (at() === "*" && at(1) === "/") { buf += eat(2); inBC = false; break; }
      buf += eat();
    }
    out += span("tok-comment", buf);
    if (inBC) return { html: out, inBC: true };
  }

  while (i < n) {
    /* Whitespace */
    if (/[ \t]/.test(at())) {
      let ws = "";
      while (i < n && /[ \t]/.test(at())) ws += eat();
      out += esc(ws);
      continue;
    }

    /* Block comment */
    if (at() === "/" && at(1) === "*") {
      let buf = eat(2); let closed = false;
      while (i < n) {
        if (at() === "*" && at(1) === "/") { buf += eat(2); closed = true; break; }
        buf += eat();
      }
      if (!closed) inBC = true;
      out += span("tok-comment", buf);
      prevKw = ""; continue;
    }

    /* Line comment */
    if (at() === "/" && at(1) === "/") {
      out += span("tok-comment", line.slice(i)); i = n; continue;
    }

    /* String literal */
    if (at() === '"') {
      let buf = eat();
      while (i < n && at() !== '"') {
        if (at() === "\\") buf += eat();
        if (i < n) buf += eat();
      }
      if (i < n) buf += eat();
      out += span("tok-string", buf); prevKw = ""; continue;
    }

    /* Char literal */
    if (at() === "'") {
      let buf = eat();
      while (i < n && at() !== "'") {
        if (at() === "\\") buf += eat();
        if (i < n) buf += eat();
      }
      if (i < n) buf += eat();
      out += span("tok-string", buf); prevKw = ""; continue;
    }

    /* Preprocessor directive */
    if (at() === "#") {
      let dir = eat();
      while (i < n && /[a-z_]/.test(at())) dir += eat();
      out += span("tok-macro", dir);
      let ws = "";
      while (i < n && at() === " ") ws += eat();
      out += esc(ws);
      /* include header: <stdio.h> or "file.h" */
      if (at() === "<") {
        let hdr = eat();
        while (i < n && at() !== ">") hdr += eat();
        if (i < n) hdr += eat();
        out += span("tok-string", hdr);
      } else if (at() === '"') {
        let hdr = eat();
        while (i < n && at() !== '"') hdr += eat();
        if (i < n) hdr += eat();
        out += span("tok-string", hdr);
      } else {
        /* #define NAME … — rest as plain */
        out += esc(line.slice(i)); i = n;
      }
      prevKw = ""; continue;
    }

    /* Number */
    if (/[0-9]/.test(at()) || (at() === "." && /[0-9]/.test(at(1)))) {
      let num = "";
      if (at() === "0" && /[xX]/.test(at(1))) {
        num += eat(2);
        while (i < n && /[0-9a-fA-F]/.test(at())) num += eat();
      } else {
        while (i < n && /[0-9]/.test(at())) num += eat();
        if (i < n && at() === ".") {
          num += eat();
          while (i < n && /[0-9]/.test(at())) num += eat();
        }
        if (i < n && /[eE]/.test(at())) {
          num += eat();
          if (i < n && /[+-]/.test(at())) num += eat();
          while (i < n && /[0-9]/.test(at())) num += eat();
        }
      }
      while (i < n && /[fFuUlL]/.test(at())) num += eat();
      out += span("tok-number", num); prevKw = ""; continue;
    }

    /* Identifier / keyword */
    if (/[a-zA-Z_]/.test(at())) {
      let id = "";
      while (i < n && /[a-zA-Z0-9_]/.test(at())) id += eat();

      /* look-ahead: skip spaces, check for '(' */
      let j = i;
      while (j < n && line[j] === " ") j++;
      const followedByParen = line[j] === "(";

      let cls;
      if (id === "NULL") {
        cls = "tok-null";
      } else if (KW.has(id)) {
        cls = id === "struct" || id === "typedef" || id === "union" || id === "enum"
              ? "tok-struct-kw" : "tok-keyword";
        prevKw = id;
      } else if (TY.has(id)) {
        cls = "tok-field-type";
        prevKw = "";
      } else if (prevKw === "struct" || prevKw === "union" || prevKw === "enum") {
        cls = "tok-name";   /* struct/union/enum tag */
        prevKw = "";
      } else if (followedByParen) {
        cls = "tok-func";
        prevKw = "";
      } else {
        cls = "tok-var";
        prevKw = "";
      }
      out += span(cls, id); continue;
    }

    /* Arrow operator -> */
    if (at() === "-" && at(1) === ">") {
      out += span("tok-arrow", eat(2)); prevKw = ""; continue;
    }

    /* Two-char operators */
    if ("=!<>&|+-*/".includes(at()) && "=&|+-><".includes(at(1))) {
      const op = eat(2);
      /* Don't eat */ out += span("tok-op", op); prevKw = ""; continue;
    }

    /* Single-char operators */
    if ("=+-*/%<>!&|^~?:".includes(at())) {
      out += span("tok-op", eat()); prevKw = ""; continue;
    }

    /* Punctuation */
    if ("{}()[],;.".includes(at())) {
      out += span("tok-punct", eat()); continue;
    }

    /* Fallback */
    out += esc(eat());
  }

  return { html: out, inBC };
}

/* ── Highlight an entire C source string ─────────────────────────── */
function highlightC(source) {
  const rawLines = source.split("\n");
  const htmlLines = [];
  let inBC = false;
  for (const line of rawLines) {
    const res = tokenizeLine(line, inBC);
    htmlLines.push(res.html);
    inBC = res.inBC;
  }
  return htmlLines;
}

/* ── DOM references ──────────────────────────────────────────────── */
const pre           = document.getElementById("vim-pre");
const gutter        = document.getElementById("vim-gutter");
const codePane      = document.getElementById("vim-code");
const lineIndicator = document.getElementById("line-indicator");
const modeTag       = document.getElementById("mode-tag");

/* ── Render HTML lines into the editor ───────────────────────────── */
let totalLines = 0;

function renderSource(htmlLines) {
  totalLines = htmlLines.length;
  pre.innerHTML = htmlLines
    .map((html, i) => `<span class="vim-line" id="L${i+1}">${html}\n</span>`)
    .join("");
}

function renderGutter(count) {
  gutter.innerHTML = Array.from({ length: count }, (_, i) =>
    `<div class="gutter-num" id="GN${i+1}">${i+1}</div>`
  ).join("");
}

/* ── Current-line tracking ───────────────────────────────────────── */
let currentLine = 1;

function setCurrentLine(ln) {
  ln = Math.max(1, Math.min(ln, totalLines));
  const prevL = document.getElementById(`L${currentLine}`);
  const prevG = document.getElementById(`GN${currentLine}`);
  if (prevL) prevL.classList.remove("active");
  if (prevG) { prevG.style.color = ""; prevG.style.fontWeight = ""; }

  currentLine = ln;
  const curL = document.getElementById(`L${currentLine}`);
  const curG = document.getElementById(`GN${currentLine}`);
  if (curL) curL.classList.add("active");
  if (curG) { curG.style.color = "var(--gutter-cur)"; curG.style.fontWeight = "700"; }
  lineIndicator.textContent = `${currentLine},1`;
}

/* ── Gutter scroll sync ──────────────────────────────────────────── */
codePane.addEventListener("scroll", () => {
  gutter.scrollTop = codePane.scrollTop;
  /* Update current line to whichever line is nearest the top */
  const paneTop = codePane.getBoundingClientRect().top;
  let best = 1, bestDist = Infinity;
  pre.querySelectorAll(".vim-line").forEach((el, idx) => {
    const d = Math.abs(el.getBoundingClientRect().top - paneTop);
    if (d < bestDist) { bestDist = d; best = idx + 1; }
  });
  setCurrentLine(best);
});

/* ── Mouse click ─────────────────────────────────────────────────── */
codePane.addEventListener("click", (e) => {
  const s = e.target.closest(".vim-line");
  if (s) setCurrentLine(parseInt(s.id.slice(1), 10));
  codePane.focus();
});

/* ── Keyboard navigation (vim-style) ─────────────────────────────── */
let pendingG = false;
codePane.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "j": case "ArrowDown":
      e.preventDefault(); codePane.scrollBy(0, 22); setCurrentLine(currentLine+1); break;
    case "k": case "ArrowUp":
      e.preventDefault(); codePane.scrollBy(0,-22); setCurrentLine(currentLine-1); break;
    case "d":
      if (e.ctrlKey) { e.preventDefault(); codePane.scrollBy(0, codePane.clientHeight/2); } break;
    case "u":
      if (e.ctrlKey) { e.preventDefault(); codePane.scrollBy(0,-codePane.clientHeight/2); } break;
    case "g":
      if (pendingG) { e.preventDefault(); codePane.scrollTop=0; setCurrentLine(1); pendingG=false; }
      else { pendingG=true; setTimeout(()=>{ pendingG=false; }, 500); }
      break;
    case "G":
      e.preventDefault(); codePane.scrollTop=codePane.scrollHeight; setCurrentLine(totalLines); break;
  }
});

/* ── Mode indicator ──────────────────────────────────────────────── */
codePane.addEventListener("focus", () => { modeTag.textContent="NORMAL"; modeTag.style.background="var(--aqua)"; });
codePane.addEventListener("blur",  () => { modeTag.textContent="-- VISUAL --"; modeTag.style.background="var(--purple)"; });

/* ── Cycling vim command-line ─────────────────────────────────────── */
const VIM_CMDS = [
  ":set number | syntax on",
  ":set cursorline",
  ":colorscheme gruvbox",
  ":set scrolloff=5",
  ":set tabstop=4 shiftwidth=4",
  ":% retab",
];
let cmdIdx = 0;
const cmdEl = document.getElementById("vim-cmd");
setInterval(() => { cmdIdx=(cmdIdx+1)%VIM_CMDS.length; cmdEl.textContent=VIM_CMDS[cmdIdx]; }, 4000);

/* ── Error display ────────────────────────────────────────────────── */
function showError(msg) {
  pre.innerHTML = `<span class="tok-comment">/* ${esc(msg)} */</span>`;
  renderGutter(1); setCurrentLine(1);
}

/* ── Bootstrap: fetch → highlight → render ───────────────────────── */
async function init() {
  try {
    const res = await fetch(SOURCE_FILE);
    if (!res.ok) throw new Error(`HTTP ${res.status} — could not load ${SOURCE_FILE}`);
    const source = await res.text();
    const htmlLines = highlightC(source);
    renderSource(htmlLines);
    renderGutter(htmlLines.length);
    setCurrentLine(1);
    codePane.focus();
  } catch (err) {
    showError(`${err.message}. Serve this folder over HTTP (e.g. python -m http.server 8000).`);
  }
}

init();

/* ── Birthday output animation ───────────────────────────────────── */

const runBtn     = document.getElementById("run-btn");
const outputPane = document.getElementById("vim-output");
const outputPre  = document.getElementById("output-pre");
const closeBtn   = document.getElementById("output-close");

// Utility: append raw HTML to the pre and scroll to bottom
function appendHTML(html) {
  outputPre.innerHTML += html;
  outputPre.scrollTop = outputPre.scrollHeight;
}

// Utility: sleep
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Build the tqdm bar HTML one # at a time
async function animateBar() {
  const total = 22;   // her age — 22 hashes
  appendHTML(`<span class="o-dim">\nLoading birthday...</span>\n`);
  appendHTML(`<span class="o-label">100%</span><span class="o-dim">|</span><span class="o-bar" id="bar-fill"></span>`);
  const barEl = outputPre.querySelector("#bar-fill");
  for (let i = 0; i <= total; i++) {
    barEl.textContent = "#".repeat(i) + " ".repeat(total - i);
    await sleep(40);
  }
  appendHTML(`<span class="o-dim">| ${total}/${total} [00:22&lt;00:00, 1.0 year/s]</span>\n\n`);
}

// Lines to print after the bar
const CAKE = [
  `<span class="o-cake">      )  )  )  )  )  )  )    </span>`,
  `<span class="o-cake">     ( )( )( )( )( )( )( )   </span>`,
  `<span class="o-cake">      |  |  |  |  |  |  |    </span>`,
  `<span class="o-cake">  ____|__|__|__|__|__|__|____  </span>`,
  `<span class="o-label"> /  *  * H A P P Y  * *  *  \\</span>`,
  `<span class="o-label">/  *  *  B I R T H D A Y  *  *\\</span>`,
  `<span class="o-cake">|____________________________|  </span>`,
  `<span class="o-cake">|  ~~~~~~~~~~~~~~~~~~~~~~~~~~|  </span>`,
  `<span class="o-cake">| ~~~~ * ~~~~ * ~~~~ * ~~~~~ |  </span>`,
  `<span class="o-cake">|  ~~~~~~~~~~~~~~~~~~~~~~~~~~|  </span>`,
  `<span class="o-dim">|============================|  </span>`,
  `<span class="o-hbd">|   * *  VAISHNAVI  * *      |  </span>`,
  `<span class="o-sub">|                            |  </span>`,
  `<span class="o-dim">|============================|  </span>`,
  `<span class="o-cake"> \\__________________________/   </span>`,
  `<span class="o-cake">  \\________________________/    </span>`,
];

const HEART = [
  ``,
  `<span class="o-heart">     ##   ##     </span>`,
  `<span class="o-heart">   ###########   </span>`,
  `<span class="o-heart">  #############  </span>`,
  `<span class="o-heart">  #############  </span>`,
  `<span class="o-heart">   ###########   </span>`,
  `<span class="o-heart">    #########    </span>`,
  `<span class="o-heart">     #######     </span>`,
  `<span class="o-heart">      #####      </span>`,
  `<span class="o-heart">       ###       </span>`,
  `<span class="o-heart">        #        </span>`,
];

const FOOTER = [
  ``,
  `<span class="o-hbd">  *** HAPPY BIRTHDAY VAISHNAVI ***  </span>`,
  `<span class="o-sub">  you are so loved. have the best year. &lt;3</span>`,
  ``,
  `<span class="o-dim">adding neighbor &lt;3</span>`,
  `<span class="o-dim">keep making friends and making them happy :)</span>`,
  `<span class="o-label">happy birthday vaishnavi &lt;3</span>`,
  `<span class="o-dim">from ur goat friend chinmay</span>`,
  `<span class="o-dim">you are 22 years old now. id: 2022102070</span>`,
  `<span class="o-sub">degree (friends): ${33*34290} — proud of you</span>`,
  `<span class="o-dim">MEMENTO MORI and shi</span>`,
];

async function printLines(lines, delay = 55) {
  for (const line of lines) {
    appendHTML(line + "\n");
    await sleep(delay);
  }
}

async function runBirthday() {
  outputPre.innerHTML = "";
  outputPane.classList.add("visible");
  runBtn.disabled = true;
  runBtn.textContent = "⏳";

  await animateBar();
  await printLines(CAKE, 60);
  await printLines(HEART, 45);
  await printLines(FOOTER, 70);

  runBtn.disabled = false;
  runBtn.textContent = "▶ Run";
}

runBtn.addEventListener("click", runBirthday);
closeBtn.addEventListener("click", () => {
  outputPane.classList.remove("visible");
});
