// ver2 - Extract Email Analytics block info (title, contexts, iframe src)
// Usage: run in Chrome DevTools (Snippets or Console) on the page with the Email Analytics block
(async function ver2_ExtractEmailAnalytics() {
  function text(el) { return el ? el.innerText.trim().replace(/\u00A0/g,' ') : ''; }
  const root = document.querySelector('.scm-common') || document.querySelector('.scm-common-header') || document;
  const titleEl = root.querySelector('.scm-common-header-text.slds-text-heading_medium') || root.querySelector('.scm-common-header-text') || root.querySelector('.scm-common-header-text .slds-text-heading_medium');
  const title = text(titleEl) || '';
  const contextEls = Array.from(root.querySelectorAll('.listbox-container .listitem-text, .listbox-container .slds-listbox__item .listitem-text'));
  const contexts = contextEls.map(el => text(el)).filter(Boolean);
  const iframe = document.getElementById('analytics-service-iframe') || root.querySelector('iframe#analytics-service-iframe') || root.querySelector('iframe[src*="analytics-app"]');
  const iframeSrc = iframe ? (iframe.src || iframe.getAttribute('src') || '') : '';
  const lines = [
    ['Section', 'Email Analytics Block'],
    ['Title', title || ''],
    ['Available Contexts', contexts.length ? contexts.join(' | ') : ''],
  ];
  if (iframeSrc) lines.push(['Iframe src', iframeSrc]);
  const tsv = lines.map(r => r.join('\t')).join('\n');
  try { await navigator.clipboard.writeText(tsv); alert('Email Analytics info copied to clipboard.'); }
  catch (err) { const ta = document.createElement('textarea'); ta.value = tsv; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Copied (fallback) to clipboard.'); }
  console.log('ver2 Email Analytics TSV:\n' + tsv);
  return { title, contexts, iframeSrc, tsv };
})();
