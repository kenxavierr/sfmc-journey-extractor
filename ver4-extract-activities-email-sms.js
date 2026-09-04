// ver4 - Extract Email & SMS Activity Names (robust ancestor search for data-node starting with known email/sms prefixes)
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

  // Adjust these selectors if your DOM uses different classes for the activity names
  const selectors = ['.canvas-name.slds-line-clamp', '.canvas-name', '.activity-name', '.slds-truncate'];
  const nodes = Array.from(document.querySelectorAll(selectors.join(','))).filter(Boolean);

  if (!nodes.length) {
    alert('No activity name elements found with the expected selectors.');
    return [];
  }

  // Walk up ancestors to find a data-node value that indicates SMS or Email
  function findNodeTypeFromAncestor(el) {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      if (cur.nodeType === 1) {
        const dnRaw = cur.getAttribute('data-node') || '';
        const dn = dnRaw.trim();
        if (dn) {
          const up = dn.toUpperCase();
          // SMS prefixes
          if (up.startsWith('SMS')) return 'SMS';
          // Email prefixes: EDM or EMAIL (covers EMAILV2, EMAILV1, etc.)
          if (up.startsWith('EDM') || up.startsWith('EMAIL')) return 'EDM';
          // fallback: if it contains 'EMAIL' anywhere at start-ish
          // (not necessary in most cases but kept for safety)
        }
      }
      cur = cur.parentElement;
    }
    return null;
  }

  const found = [];
  const seen = new Set();

  for (const el of nodes) {
    const name = text(el);
    if (!name) continue;

    const type = findNodeTypeFromAncestor(el);
    if (!type) {
      // no matching data-node on ancestors; skip
      console.debug('ver4: skipped (no email/sms ancestor)', { name, element: el });
      continue;
    }

    const key = `${name}||${type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push({ name, type });
  }

  if (!found.length) {
    alert('No EDM or SMS activities found on the page.');
    console.log('ver4: no EDM/SMS activities found.');
    return [];
  }

  // Group by type preserving order of appearance
  const groups = {};
  for (const item of found) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item.name);
  }

  // Build plain text output in requested order: EDMs then SMS
  const lines = [];
  if (groups['EDM'] && groups['EDM'].length) {
    lines.push('EDMs / Emails');
    lines.push(...groups['EDM']);
    if (groups['SMS'] && groups['SMS'].length) lines.push(''); // blank line if SMS follows
  }
  if (groups['SMS'] && groups['SMS'].length) {
    lines.push('SMS');
    lines.push(...groups['SMS']);
  }

  const out = lines.join('\n');

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
  console.table(found);
  return { count: found.length, groups, text: out };
})();
