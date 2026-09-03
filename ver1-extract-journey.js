// ver1 - Extract Journey Analytics (copies 2-row TSV to clipboard)
// Usage: run in Chrome DevTools (Snippets or Console) on the page with the Journey/Email card
(async function ver1_ExtractJourneyAnalytics() {
  function text(el) { return el ? el.innerText.trim().replace(/\u00A0/g,' ') : ''; }
  const dashboard = document.querySelector('.journey-analytics-dashboard') || document;
  const card = dashboard.querySelector('.analytics-ui-card') || dashboard.querySelector('.slds-card') || null;
  if (!card) { alert('No analytics card found in this document/frame.'); return null; }
  const section = text(card.querySelector('h2')) || text(dashboard.querySelector('.slds-text-heading_medium')) || 'Section';
  const metrics = [];
  Array.from(card.querySelectorAll('.performance-header .header-kpis .kpi')).forEach(k => {
    metrics.push({ name: text(k.querySelector('.kpi-title') || k.querySelector('span')), value: text(k.querySelector('.metric')), extra: '' });
  });
  Array.from(card.querySelectorAll('.performance-body .performance-list-item')).forEach(r => {
    const nameEl = r.querySelector('.kpi-title .slds-truncate') || r.querySelector('.kpi-title') || r.querySelector('.kpi');
    const name = text(nameEl);
    const value = text(r.querySelector('.metric'));
    const rate = text(r.querySelector('.base-measure .rate'));
    const label = text(r.querySelector('.base-measure .label'));
    const extra = (rate && label) ? `${rate} ${label}` : (rate || label || '');
    metrics.push({ name, value, extra });
  });
  if (!metrics.length) { alert('No metrics found in the card.'); return null; }
  const header = [section];
  metrics.forEach(m => { header.push(m.name || ''); if (m.extra && m.extra.trim() !== '') header.push(''); });
  const values = [''];
  metrics.forEach(m => { values.push(m.value || ''); if (m.extra && m.extra.trim() !== '') values.push(m.extra); });
  const tsv = header.join('\t') + '\n' + values.join('\t');
  try { await navigator.clipboard.writeText(tsv); alert('Two-row TSV copied to clipboard. Paste into Google Sheets (A1).'); }
  catch (err) { const ta = document.createElement('textarea'); ta.value = tsv; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Copied (fallback) to clipboard — paste into Google Sheets.'); }
  console.log('ver1 TSV:\n' + tsv);
  return tsv;
})();
