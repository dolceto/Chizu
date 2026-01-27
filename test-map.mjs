import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto('http://localhost:3000');
await page.waitForTimeout(3000);

// 일본 선택
const countrySelect = page.locator('select');
await countrySelect.selectOption('japan');
await page.waitForTimeout(3000);

// 지도 SVG에서 도도부현 클릭
const pathsInfo = await page.evaluate(() => {
  const svgs = Array.from(document.querySelectorAll('svg'));
  const mapSvg = svgs.find(s => s.querySelectorAll('path').length > 10);
  if (!mapSvg) return { error: 'no map svg' };

  const paths = Array.from(mapSvg.querySelectorAll('path'));
  return paths.slice(0, 20).map((p, i) => {
    const rect = p.getBoundingClientRect();
    return { i, x: rect.x.toFixed(0), y: rect.y.toFixed(0), w: rect.width.toFixed(0), h: rect.height.toFixed(0) };
  });
});

// 15번째 도도부현 클릭
if (Array.isArray(pathsInfo) && pathsInfo.length > 15) {
  const p = pathsInfo[15];
  console.log('Clicking prefecture:', p);
  await page.mouse.click(Number(p.x) + Number(p.w) / 2, Number(p.y) + Number(p.h) / 2);
  await page.waitForTimeout(4000);

  // 모든 SVG 정보 확인
  const allSvgInfo = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    return svgs.map((svg, i) => {
      const paths = Array.from(svg.querySelectorAll('path'));
      return {
        index: i,
        viewBox: svg.getAttribute('viewBox'),
        pathCount: paths.length,
        svgRect: svg.getBoundingClientRect(),
        paths: paths.slice(0, 3).map((p, j) => ({
          j,
          d: p.getAttribute('d')?.substring(0, 100),
          fill: p.getAttribute('fill'),
          stroke: p.getAttribute('stroke'),
          computedFill: getComputedStyle(p).fill,
          bbox: (() => {
            try {
              const b = p.getBBox();
              return { x: b.x.toFixed(0), y: b.y.toFixed(0), w: b.width.toFixed(0), h: b.height.toFixed(0) };
            } catch {
              return null;
            }
          })()
        }))
      };
    });
  });

  console.log('All SVGs after click:', JSON.stringify(allSvgInfo, null, 2));

  // 특히 pathCount가 36인 SVG 찾기
  const regionSvg = allSvgInfo.find(s => s.pathCount === 36);
  if (regionSvg) {
    console.log('Region SVG found:', regionSvg);
  }

  await page.screenshot({ path: '/tmp/japan-region-all.png' });
}

await browser.close();
