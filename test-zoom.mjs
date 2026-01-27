import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto('http://localhost:3000');
await page.waitForTimeout(3000);

// 페이지 상태 확인
const htmlContent = await page.content();
console.log('Page has select?', htmlContent.includes('<select'));
console.log('Page has svg?', htmlContent.includes('<svg'));

// 스크린샷으로 현재 페이지 상태 확인
await page.screenshot({ path: '/tmp/japan-page-initial.png' });
console.log('Initial page screenshot saved');

// 드롭다운 찾기 시도
const dropdowns = await page.locator('select').all();
console.log('Found dropdowns:', dropdowns.length);

// 버튼이나 다른 요소 확인
const buttons = await page.locator('button').all();
console.log('Found buttons:', buttons.length);

// 지도 SVG 찾기
const svgs = await page.locator('svg').all();
console.log('Found SVGs:', svgs.length);

for (let i = 0; i < svgs.length; i++) {
  const pathCount = await svgs[i].locator('path').count();
  console.log(`SVG ${i}: ${pathCount} paths`);
}

// 첫 번째 도도부현 클릭
const mapPaths = await page.locator('svg path').all();
console.log(`Total paths: ${mapPaths.length}`);

if (mapPaths.length > 10) {
  // 도쿄 근처 클릭
  await mapPaths[20].click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: '/tmp/japan-after-prefecture-click.png' });
  console.log('After prefecture click screenshot saved');

  // 다시 SVG 확인
  const svgsAfter = await page.locator('svg').all();
  console.log('SVGs after click:', svgsAfter.length);
  for (let i = 0; i < svgsAfter.length; i++) {
    const pathCount = await svgsAfter[i].locator('path').count();
    console.log(`SVG ${i} after: ${pathCount} paths`);
  }

  // 줌 테스트
  const lastSvg = svgsAfter[svgsAfter.length - 1];
  const box = await lastSvg.boundingBox();
  console.log('Last SVG bounding box:', box);

  if (box) {
    // 줌 인
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/japan-after-zoom-in.png' });
    console.log('After zoom in screenshot saved');

    // 드래그
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2 + 100, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/tmp/japan-after-drag.png' });
    console.log('After drag screenshot saved');
  }
}

await browser.close();
console.log('Test completed!');
