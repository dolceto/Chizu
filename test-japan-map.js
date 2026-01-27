const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // 일본 선택
  const countrySelect = page.locator('select');
  await countrySelect.selectOption('japan');
  await page.waitForTimeout(2000);

  // 일본 전국 지도 확인
  console.log('=== 일본 전국 지도 (도도부현) ===');
  const japanSvgInfo = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (!svg) return { found: false };
    const paths = Array.from(svg.querySelectorAll('path'));
    return {
      found: true,
      pathCount: paths.length,
      svgRect: svg.getBoundingClientRect(),
    };
  });
  console.log('일본 전국 SVG:', JSON.stringify(japanSvgInfo, null, 2));

  await page.screenshot({ path: '/tmp/japan-country.png' });
  console.log('Screenshot: /tmp/japan-country.png');

  // 시가현 클릭 (25번)
  // 먼저 시가현 path 찾기
  const shigaInfo = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    const paths = Array.from(svg?.querySelectorAll('path') || []);
    // 시가현 위치 추정 (중부 지역)
    return paths.map((p, i) => {
      const rect = p.getBoundingClientRect();
      return { i, x: rect.x, y: rect.y, w: rect.width, h: rect.height };
    }).filter(p => p.w > 0 && p.h > 0).slice(0, 10);
  });
  console.log('Paths info (first 10):', JSON.stringify(shigaInfo, null, 2));

  // path 클릭 시도 (시가현 - 대략 25번째)
  const targetPath = shigaInfo[24] || shigaInfo[10]; // 25번 또는 10번
  if (targetPath) {
    console.log('Clicking path:', targetPath);
    await page.mouse.click(targetPath.x + targetPath.w / 2, targetPath.y + targetPath.h / 2);
    await page.waitForTimeout(2000);
  }

  // 지역 지도 확인
  console.log('=== 시구정촌 지도 ===');
  const regionSvgInfo = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (!svg) return { found: false };

    const paths = Array.from(svg.querySelectorAll('path'));
    const g = svg.querySelector('g');
    const transform = g?.getAttribute('transform');

    return {
      found: true,
      pathCount: paths.length,
      viewBox: svg.getAttribute('viewBox'),
      preserveAspectRatio: svg.getAttribute('preserveAspectRatio'),
      svgWidth: svg.getAttribute('width'),
      svgHeight: svg.getAttribute('height'),
      gTransform: transform,
      svgClientRect: svg.getBoundingClientRect(),
      pathsWithBBox: paths.slice(0, 5).map((p, i) => {
        const b = p.getBBox();
        const cr = p.getBoundingClientRect();
        return {
          i,
          bbox: { x: b.x.toFixed(0), y: b.y.toFixed(0), w: b.width.toFixed(0), h: b.height.toFixed(0) },
          clientRect: { x: cr.x.toFixed(0), y: cr.y.toFixed(0), w: cr.width.toFixed(0), h: cr.height.toFixed(0) }
        };
      })
    };
  });
  console.log('Region SVG info:', JSON.stringify(regionSvgInfo, null, 2));

  await page.screenshot({ path: '/tmp/japan-region.png' });
  console.log('Screenshot: /tmp/japan-region.png');

  await browser.close();
})();
