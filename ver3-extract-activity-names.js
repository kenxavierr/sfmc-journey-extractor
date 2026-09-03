// ver3 - Extract Activity Names (copies newline list to clipboard)
// Usage: run in Chrome DevTools (Snippets or Console) on the journey canvas page
(async function ver3_ExtractActivityNames() {
  function text(el) { return el ? el.innerText.trim().replace(/\u00A0/g,' ') : ''; }
  const nodes = Array.from(document.querySelectorAll('.canvas-name.slds-line-clamp'));
  if (!nodes.length) { alert('No activity elements found with selector .canvas-name.slds-line-clamp'); return []; }
  const names = nodes.map(n => text(n)).filter(Boolean);
  const newlineList = names.join('\n');
  try { await navigator.clipboard.writeText(newlineList); alert('Activity names copied to clipboard (' + names.length + ').'); }
  catch (err) { const ta = document.createElement('textarea'); ta.value = newlineList; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Copied (fallback) to clipboard.'); }
  console.log('ver3 Activity names:', names);
  return names;
})();
