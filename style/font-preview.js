// Temporary typography controls: open any page with ?fonts=1 to use them.
(() => {
  if (new URLSearchParams(location.search).get('fonts') !== '1') return;

  const fonts = {
    Georgia: 'Georgia, serif',
    Arial: 'Arial, Helvetica, sans-serif',
    Verdana: 'Verdana, Geneva, sans-serif',
    'Trebuchet MS': '"Trebuchet MS", sans-serif',
    'Palatino Linotype': '"Palatino Linotype", Palatino, serif',
    'Times New Roman': '"Times New Roman", Times, serif',
    'Courier New': '"Courier New", monospace'
  };
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('font-preview') || '{}') || {}; } catch {}
  const panel = document.createElement('aside');
  panel.setAttribute('aria-label', 'Font preview controls');
  panel.style.cssText = 'margin:24px auto;padding:16px;max-width:904px;border:1px solid #aaa;background:white;color:#222;font:16px/1.5 Arial,sans-serif;display:flex;flex-wrap:wrap;align-items:center;gap:16px';
  const title = document.createElement('strong');
  title.textContent = 'Font preview';
  panel.append(title);
  const selected = {};
  function apply() {
    for (const role of ['heading', 'body']) {
      document.documentElement.style.setProperty(`--${role}-font`, fonts[selected[role].value]);
    }
    try { sessionStorage.setItem('font-preview', JSON.stringify({ heading: selected.heading.value, body: selected.body.value })); } catch {}
  }
  for (const role of ['heading', 'body']) {
    const label = document.createElement('label');
    label.textContent = role === 'heading' ? 'Heading: ' : 'Body: ';
    const select = document.createElement('select');
    select.style.cssText = 'font:inherit;min-height:44px;max-width:100%';
    for (const name of Object.keys(fonts)) select.add(new Option(name, name));
    select.value = Object.hasOwn(fonts, saved[role]) ? saved[role] : role === 'heading' ? 'Georgia' : 'Arial';
    select.addEventListener('change', apply);
    selected[role] = select;
    label.append(select);
    panel.append(label);
  }
  const reset = document.createElement('button');
  reset.textContent = 'Reset';
  reset.style.cssText = 'font:inherit;min-height:44px';
  reset.addEventListener('click', () => {
    selected.heading.value = 'Georgia';
    selected.body.value = 'Arial';
    apply();
  });
  panel.append(reset);
  const note = document.createElement('small');
  note.textContent = 'Uses fonts installed on your device; unavailable fonts fall back. Choices are temporary.';
  panel.append(note);
  document.body.append(panel);
  for (const link of document.querySelectorAll('nav a')) {
    const url = new URL(link.getAttribute('href'), location.href);
    url.searchParams.set('fonts', '1');
    link.href = url.href;
  }
  apply();
})();
