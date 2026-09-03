# How to convert the animated demo to a GIF

This repository includes an animated SVG demo (`demo-anim.svg`) and an interactive HTML demo (`demo.html`). If you want a standalone GIF file to embed in documentation or email, use one of these simple methods.

## Option A — Quick manual (recommended, easiest)
1. Open `demo.html` in Chrome (or open `demo-anim.svg` directly in the browser).
2. Use a screen-recorder that can produce GIFs (recommended tools):
   - Windows: ShareX (free) — `Capture → Screen recording (GIF)`.
   - macOS: LICEcap (free) or use QuickTime to record MP4 then convert to GIF with `ffmpeg`.
3. Start recording, play the demo animation (it loops automatically), stop recording and save GIF.

## Option B — Produce MP4 with Puppeteer, then convert to GIF
This is more reproducible and works on CI or a server. It requires Node.js and `ffmpeg` installed.

1. Install puppeteer (and ffmpeg):

```bash
npm install puppeteer
# install ffmpeg via your package manager e.g. on macOS: brew install ffmpeg
```

2. Save this Node script as `render-demo.js` in a folder with `demo.html` (or point to the live demo URL):

```javascript
// render-demo.js
const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // adjust size to suit GIF resolution
  await page.setViewport({ width: 960, height: 200 });
  await page.goto('file://' + process.cwd() + '/demo.html');

  // wait a moment for animation
  await page.waitForTimeout(500);

  // record frames by capturing screenshots in sequence
  const framesDir = 'frames_tmp';
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);
  const fps = 15;
  const seconds = 4; // length of capture
  for (let i = 0; i < fps * seconds; i++) {
    const filename = `${framesDir}/frame_${String(i).padStart(3,'0')}.png`;
    await page.screenshot({ path: filename });
    await page.waitForTimeout(1000 / fps);
  }

  await browser.close();
  console.log('Captured frames to', framesDir);
  console.log('Now run ffmpeg to make a GIF:');
  console.log(`ffmpeg -y -f image2 -framerate ${fps} -i ${framesDir}/frame_%03d.png -filter_complex "[0:v] palettegen" palette.png`);
  console.log(`ffmpeg -y -f image2 -framerate ${fps} -i ${framesDir}/frame_%03d.png -i palette.png -filter_complex "paletteuse" demo.gif`);
})();
```

3. Run the renderer and then ffmpeg commands shown by the script:

```bash
node render-demo.js
# then run the two ffmpeg commands printed by the script
# example (on macOS/linux):
ffmpeg -y -f image2 -framerate 15 -i frames_tmp/frame_%03d.png -filter_complex "[0:v] palettegen" palette.png
ffmpeg -y -f image2 -framerate 15 -i frames_tmp/frame_%03d.png -i palette.png -filter_complex "paletteuse" demo.gif
```

This produces `demo.gif` which you can add to documentation.

## Notes
- Option A (manual recorder) is fastest for non-technical users.
- Option B gives reproducible results and higher control over framerate and resolution.
- If you want, I can produce the GIF on my side and commit it to the repository — say so and I will (note: uploading a GIF will add a binary file to the repo which increases repo size slightly).
