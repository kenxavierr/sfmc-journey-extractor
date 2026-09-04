// ver4 - Extract Email & SMS Activity Names (filters by parent data-node starting with "EDM" or "SMS")
// Output: grouped plain text for easy paste:
// EDMs / Emails
// Email 1
// Email 2
//
// SMS
// SMS 1
// SMS 2
//
// Usage: Run in Chrome DevTools (Snippets or Console) on the Journey Canvas page
(async function ver4_ExtractEmailSmsActivities() {
  function text(el) { return el ? el.innerText.trim().replace(/\u00A0/g,' ') : ''; }
  // Candidate selectors for activity name nodes - adjust if your DOM differs
  const selectors = ['.canvas-name.slds-line-clamp', '.canvas-name', '.activity-name', '.slds-truncate'];
  const nodes = Array.from(document.querySelectorAll(selectors.join(','))).filter(Boolean);
  if (!nodes.length) {
    alert('No activity name elements found with the expected selectors.');
    return [];
  }

  const found = [];
  const seen = new Set();
  for (const el of nodes) {
    const name = text(el);
    if (!name) continue;
    // find nearest ancestor with a data-node attribute
    const parent = el.closest('[data-node]');
    if (!parent) continue;
    const dataNode = (parent.getAttribute('data-node') || '').trim();
    // match EDM or SMS at the start of the data-node value (case-insensitive)
    const m = dataNode.match(/^(EDM|SMS)/i);
    if (!m) continue;
    const type = m[1].toUpperCase();
    const key = `${name}||${type}`;
    if (seen.has(key)) continue; // dedupe exact name+type
    seen.add(key);
    found.push({ name, type, dataNode });
  }

  if (!found.length) {
    alert('No EDM or SMS activities found on the page.');
    console.log('ver4: no EDM/SMS activities found.');
    return [];
  }

  // Group by type while preserving original order
  const groups = found.reduce((acc, f) => {
    if (!acc[f.type]) acc[f.type] = [];
    acc[f.type].push(f.name);
    return acc;
  }, {});

  // Build plain text output with the exact format requested
  const lines = [];
  if (groups['EDM'] && groups['EDM'].length) {
    lines.push('EDMs / Emails');
    groups['EDM'].forEach(n => lines.push(n));
    lines.push(''); // blank line between groups
  }
  if (groups['SMS'] && groups['SMS'].length) {
    lines.push('SMS');
    groups['SMS'].forEach(n => lines.push(n));
  }

  const out = lines.join('\n');

  // Copy to clipboard with async clipboard API and fallback
  async function copyToClipboard(s) {
    try { await navigator.clipboard.writeText(s); return true; }
    catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = s; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return true; }
      catch (err) { return false; }
    }
  }

  const ok = await copyToClipboard(out);
  if (ok) alert(`Copied EDM/SMS activity list to clipboard (${found.length} items). Paste where needed.`);
  else alert('Copy failed — output printed to console.');

  console.log('ver4 grouped output:\n' + out);
  return { count: found.length, groups, text: out };
})();
