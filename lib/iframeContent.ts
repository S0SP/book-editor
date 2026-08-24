// Pipeline CSS embedded as a string for iframe injection
// This is the global.css from the IGCSE pipeline

export const PIPELINE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg-base:      #FFFFFF;
  --bg-panel:     #F9FAFB;
  --text-primary: #0F1729;
  --text-muted:   #65758B;
  --brand-blue:   #2F80F9;
  --brand-green:  #08BD7E;
  --font-inter:   'Inter', sans-serif;
  font-size: 15px;
}

@page { size: A4; margin: 16mm 14mm; }

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: var(--font-inter);
  background: var(--bg-base);
  color: var(--text-muted);
}

.page {
  width: 182mm;
  min-height: 265mm;
  font-size: var(--font-size, 0.86rem);
  line-height: var(--line-height, 1.45);
  padding: 0;
  background: var(--bg-base);
  position: relative;
  --block-spacing: 0.7rem;
  --fig-height: 46mm;
}

.running-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-muted);
  border-bottom: 1px solid #E5E9F0;
  padding-bottom: 4px;
  margin-bottom: 8px;
}
.folio { color: var(--text-primary); font-weight: 700; }

.columns {
  display: flex;
  flex-direction: row;
  gap: 8mm;
  align-items: flex-start;
}
.col {
  flex: 0 0 calc(50% - 4mm);
  width: calc(50% - 4mm);
  overflow: hidden;
}

.full-width-content { width: 100%; }

.chapter-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #2F80F9, #1C63D6);
  color: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 10px;
}
.chapter-title { font-size: 2.0rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
.chapter-number { font-size: 4rem; font-weight: 700; line-height: 1; }

.topic-banner {
  display: flex;
  gap: 10px;
  align-items: baseline;
  border-left: 4px solid var(--brand-blue);
  padding: 6px 10px;
  background: var(--bg-panel);
  border-radius: 8px;
  margin: 8px 0 10px;
}
.topic-kicker { font-size: 1.35rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
.topic-name { font-size: 1.05rem; font-weight: 600; color: var(--brand-blue); }

.section-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid var(--brand-blue);
  padding-bottom: 4px;
  margin: 10px 0 8px;
}
.section-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
  background: var(--brand-blue);
  color: #fff;
  font-size: 0.75rem; font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
}
.section-title { font-size: 1.05rem; font-weight: 700; color: var(--brand-blue); }
.section-marks { margin-left: auto; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

.q { break-inside: avoid-column; margin-bottom: var(--block-spacing, 0.7rem); }
.q > p > strong:first-child, .q > strong:first-child { color: var(--brand-blue); }
.q ul { list-style: none; padding-left: 1.1rem; margin: 3px 0; }
.q li { text-indent: -1.1rem; margin: 1px 0; color: var(--text-primary); font-size: 0.86rem; }
.q strong { color: var(--text-primary); }

.ans {
  background: var(--bg-panel);
  border-left: 3px solid var(--brand-green);
  border-radius: 6px;
  padding: 6px 8px;
  margin: 5px 0;
  color: var(--text-primary);
  font-size: 0.86rem;
}
.ans strong { color: var(--brand-green); }
.ans ul { list-style: none; padding-left: 0; margin: 2px 0; }
.ans li { text-indent: 0; margin: 1px 0; }

.src {
  display: block;
  text-align: right;
  font-size: 0.75rem; font-weight: 500;
  color: var(--text-muted);
  margin-top: 2px;
}

.marks {
  float: right;
  font-size: 0.75rem; font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-panel);
  padding: 1px 4px;
  border-radius: 4px;
  margin-left: 4px;
}

.expl {
  font-size: 0.86rem;
  color: var(--text-muted);
  text-align: justify;
  margin-top: 4px;
  line-height: var(--line-height, 1.45);
}
.expl strong { color: var(--text-primary); }

table.data { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 5px 0; }
table.data th { background: var(--bg-panel); color: var(--text-primary); font-weight: 600; border: 1px solid #E5E9F0; padding: 3px 5px; text-align: center; }
table.data td { border: 1px solid #E5E9F0; padding: 3px 5px; text-align: center; color: var(--text-primary); }
table.data td:first-child { font-weight: 700; width: 26px; }
.tick { color: var(--brand-green); font-weight: 700; }
.cross { color: #EF4444; font-weight: 700; }

.fig { margin: 6px 0; text-align: center; background: var(--bg-panel); border-radius: 6px; padding: 6px; }
.fig img { max-height: var(--fig-height, 46mm); max-width: 100%; display: block; margin: 0 auto; }
figcaption { font-size: 0.75rem; color: var(--text-muted); margin-top: 3px; text-align: center; font-style: italic; }

.fig-placeholder {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 32mm; max-height: var(--fig-height, 46mm);
  width: 100%;
  border: 1.5px dashed var(--brand-blue);
  border-radius: 6px;
  background: #EEF5FF;
  padding: 8px; box-sizing: border-box; gap: 4px;
}
.fig-placeholder .ph-icon { font-size: 1.6rem; color: var(--brand-blue); opacity: 0.55; line-height: 1; }
.fig-placeholder .ph-label { font-size: 0.72rem; font-weight: 600; color: var(--brand-blue); text-transform: uppercase; letter-spacing: 0.04em; }
.fig-placeholder .ph-desc { font-size: 0.68rem; color: var(--text-muted); text-align: center; line-height: 1.35; max-width: 95%; font-style: italic; }
.fig-placeholder.graph { min-height: 38mm; background: #F0FBF7; border-color: var(--brand-green); }
.fig-placeholder.graph .ph-icon, .fig-placeholder.graph .ph-label { color: var(--brand-green); }
.fig.graph img { max-height: 52mm; }

.side-card { width: 52mm; float: right; background: var(--bg-panel); border-radius: 8px; padding: 8px; margin: 0 0 8px 8px; font-size: 0.75rem; }
.side-card table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
.side-card td { padding: 2px 0; color: var(--text-muted); }
.qr { margin-top: 8px; font-size: 0.72rem; color: var(--text-muted); text-align: center; border: 1px dashed #E5E9F0; padding: 4px; border-radius: 4px; }

h3 { font-size: 1.05rem; font-weight: 700; color: var(--brand-blue); margin: 8px 0 4px; }
ul { padding-left: 1rem; margin: 2px 0; }
li { font-size: 0.86rem; margin: 2px 0; line-height: var(--line-height, 1.45); }
li > ul { margin-top: 2px; }
strong { color: var(--text-primary); }

.page.step-1 { --line-height: 1.38; }
.page.step-2 { --line-height: 1.38; --font-size: 0.82rem; }
.page.step-3 { --line-height: 1.38; --font-size: 0.82rem; --block-spacing: 0.55rem; }
.page.step-4 { --line-height: 1.38; --font-size: 0.82rem; --block-spacing: 0.55rem; --fig-height: 38mm; }
`

// Editor interaction styles injected into the iframe
export const IFRAME_EDITOR_CSS = `
body {
  margin: 0;
  padding: 0;
  background: transparent;
  display: block;
}

#editor-root {
  outline: none;
}

.page {
  width: 100% !important;
  min-height: 297mm !important;
  margin: 0 0 20px 0 !important; /* Gap between pages */
  padding: 16mm 14mm !important;
  box-sizing: border-box !important;
  background: white !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04) !important;
  border-radius: 4px !important;
  position: relative;
}

.q, .topic-banner, .chapter-banner, .section-bar, .fig,
.running-head, .side-card {
  cursor: pointer;
  border-radius: 4px;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.12s ease, box-shadow 0.12s ease;
}

.q:hover               { outline-color: rgba(47,128,249,.25); }
.topic-banner:hover    { outline-color: rgba(47,128,249,.3); }
.chapter-banner:hover  { outline-color: rgba(47,128,249,.3); }
.section-bar:hover     { outline-color: rgba(47,128,249,.25); }
.fig:hover             { outline-color: rgba(47,128,249,.35); box-shadow: 0 0 0 4px rgba(47,128,249,.08); }
.running-head:hover    { outline-color: rgba(47,128,249,.2); }
.side-card:hover       { outline-color: rgba(47,128,249,.2); }

.block-selected {
  outline: 2px solid #2F80F9 !important;
  box-shadow: 0 0 0 5px rgba(47,128,249,.12) !important;
}

/* Placeholder upload hover */
.fig-placeholder:hover {
  border-style: solid;
  background: #E5EFFF;
}
`

// Script injected into iframe — handles click detection and postMessage
export const IFRAME_SCRIPT = `
(function () {
  var SELECTORS = '.q, .topic-banner, .chapter-banner, .section-bar, .fig, .running-head, .side-card';

  function getType(el) {
    if (el.classList.contains('q'))              return 'question';
    if (el.classList.contains('topic-banner'))   return 'topic-banner';
    if (el.classList.contains('chapter-banner')) return 'chapter-banner';
    if (el.classList.contains('section-bar'))    return 'section-bar';
    if (el.classList.contains('fig'))            return 'figure';
    if (el.classList.contains('running-head'))   return 'running-head';
    if (el.classList.contains('side-card'))      return 'side-card';
    return 'generic';
  }

  function findBlock(target) {
    var el = target;
    while (el && el !== document.body) {
      if (el.matches && el.matches(SELECTORS)) return el;
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    var block = findBlock(e.target);
    if (!block) {
      // Clicked outside a block — deselect
      document.querySelectorAll('.block-selected').forEach(function (b) {
        b.classList.remove('block-selected');
      });
      window.parent.postMessage({ type: 'DESELECT' }, '*');
      return;
    }

    e.stopPropagation();

    document.querySelectorAll('.block-selected').forEach(function (b) {
      b.classList.remove('block-selected');
    });
    block.classList.add('block-selected');

    window.parent.postMessage({
      type: 'BLOCK_CLICK',
      blockId: block.getAttribute('data-block-id') || '',
      blockType: getType(block),
      outerHTML: block.outerHTML
    }, '*');
  });

  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data || !data.type) return;

    if (data.type === 'REPLACE_BLOCK') {
      var block = document.querySelector('[data-block-id="' + data.blockId + '"]');
      if (!block) return;

      var tmp = document.createElement('div');
      tmp.innerHTML = data.newOuterHTML;
      var nb = tmp.firstElementChild;
      if (nb) {
        block.parentNode.replaceChild(nb, block);
        nb.classList.add('block-selected');
      }

      var updated = document.querySelector('[data-block-id="' + data.blockId + '"]');
      window.parent.postMessage({
        type: 'BLOCK_UPDATED',
        blockId: data.blockId,
        outerHTML: updated ? updated.outerHTML : ''
      }, '*');
    }

    if (data.type === 'REMOVE_BLOCK') {
      var block = document.querySelector('[data-block-id="' + data.blockId + '"]');
      if (block && block.parentNode) {
        block.parentNode.removeChild(block);
        window.parent.postMessage({
          type: 'PAGE_CONTENT_UPDATED',
          html: document.getElementById('editor-root').innerHTML
        }, '*');
        window.parent.postMessage({ type: 'DESELECT' }, '*');
      }
    }

    if (data.type === 'DOWNLOAD_PDF') {
      var opt = {
        margin: 0,
        filename: data.filename || 'page.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // We temporarily remove the editor specific styles to get a clean print
      document.querySelectorAll('.block-selected').forEach(function (b) {
        b.classList.remove('block-selected');
      });
      
      // If html2pdf is loaded, use it
      if (window.html2pdf) {
        var el = document.getElementById('editor-root');
        window.html2pdf().set(opt).from(el).save().then(function() {
          window.parent.postMessage({ type: 'PDF_DOWNLOADED' }, '*');
        });
      } else {
        // Fallback to print if library failed to load
        window.print();
        window.parent.postMessage({ type: 'PDF_DOWNLOADED' }, '*');
      }
    }

    if (data.type === 'DESELECT_ALL') {
      document.querySelectorAll('.block-selected').forEach(function (b) {
        b.classList.remove('block-selected');
      });
    }

    if (data.type === 'GET_HTML') {
      window.parent.postMessage({
        type: 'FULL_HTML',
        html: document.getElementById('editor-root').innerHTML
      }, '*');
    }
  });

  // Handle in-page editing
  var updateTimer;
  var editorRoot = document.getElementById('editor-root');
  if (editorRoot) {
    editorRoot.addEventListener('input', function(e) {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(function() {
        // Send the full updated HTML
        window.parent.postMessage({
          type: 'PAGE_CONTENT_UPDATED',
          html: editorRoot.innerHTML
        }, '*');

        // If a specific block is selected, also sync its state
        var selected = document.querySelector('.block-selected');
        if (selected) {
          window.parent.postMessage({
            type: 'BLOCK_UPDATED',
            blockId: selected.getAttribute('data-block-id') || '',
            outerHTML: selected.outerHTML
          }, '*');
        }
      }, 300);
    });
  }
})();
`

/** Build the full srcdoc for the iframe */
export function buildSrcdoc(pageContent: string): string {
  // If the content doesn't have a .page wrapper, wrap it so it gets the correct A4 margins
  const hasPage = pageContent.includes('class="page"') || pageContent.includes("class='page'");

  // Basic markdown bold conversion just in case raw ** is passed
  let processedContent = pageContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const finalContent = hasPage ? processedContent : `<div class="page">\n${processedContent}\n</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width"/>
<style>
${PIPELINE_CSS}
</style>
<style>
${IFRAME_EDITOR_CSS}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
<div id="editor-root" contenteditable="true">
${finalContent}
</div>
<script>
${IFRAME_SCRIPT}
</script>
</body>
</html>`
}
