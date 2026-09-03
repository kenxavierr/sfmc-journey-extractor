// ver2-sms - Extract SMS/MMS Analytics card and table, copy TSV to clipboard
// Usage: run in Chrome DevTools (Snippets or Console) on the page with the SMS/MMS card
(async function ver2_sms() {
  function text(el) { return el ? el.innerText.trim().replace(/\u00A0/g, ' ') : ''; }
  let card = document.querySelector('.analytics-ui-card[data-flow-id*="SmsPerformanceDock"]')
          || Array.from(document.querySelectorAll('.analytics-ui-card')).find(c => /sms|sms\/mms|smsmms/i.test(text(c.querySelector('h2'))))
          || document.querySelector('.analytics-ui-card');
  if (!card) { alert('No analytics card found in this document/frame.'); return null; }
  const section = text(card.querySelector('h2')) || text(card.querySelector('.slds-text-heading_medium')) || 'SMS Analytics';
  const kpiNodes = Array.from(card.querySelectorAll('.kpi'));
  const seen = new Set();
  const metrics = [];
  kpiNodes.forEach(k => {
    const titleEl = k.querySelector('.kpi-title') || k.querySelector('span');
    const valueEl = k.querySelector('.metric') || k.querySelector('.slds-truncate');
    const name = text(titleEl);
    const value = text(valueEl);
    if (!name && !value) return;
    const key = (name || '') + '||' + (value || '');
    if (seen.has(key)) return;
    seen.add(key);
    metrics.push({ name: name || '', value: value || '' });
  });
  const headerCells = [section];
  metrics.forEach(m => headerCells.push(m.name || ''));
  const valueCells = [''];
  metrics.forEach(m => valueCells.push(m.value || ''));
  const table = card.querySelector('table');
  let tableLines = [];
  if (table) {
    const ths = Array.from(table.querySelectorAll('thead th'));
    const tableHeaders = ths.length ? ths.map(th => {
      const h = th.querySelector('.slds-truncate') || th.querySelector('.slds-p-horizontal_x-small') || th;
      return text(h);
    }) : [];
    if (tableHeaders.length) tableLines.push(tableHeaders.join('\t'));
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => text(td));
      if (cells.join('').trim() === '') return;
      tableLines.push(cells.join('\t'));
    });
  }
  const parts = [];
  parts.push(headerCells.join('\t'));
  parts.push(valueCells.join('\t'));
  if (tableLines.length) { parts.push(''); parts.push(...tableLines); }
  const tsv = parts.join('\n');
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch (err) {
      try { const ta = document.createElement('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.left = '-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return true; } catch (e) { return false; }
    }
  }
  const ok = await copyText(tsv);
  if (ok) alert('SMS analytics TSV copied to clipboard. Paste into Google Sheets (A1).');
  else alert('Copy failed — TSV printed to console.');
  console.log('ver2-sms TSV:\n' + tsv);
  return { section, metrics, table: tableLines, tsv };
})();
