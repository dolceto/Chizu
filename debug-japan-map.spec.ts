import { test } from '@playwright/test';

test('Compare Korea and Japan region maps', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  // 한국 지도 테스트 (기본 상태)
  // 서울 클릭
  await page.mouse.click(580, 350);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/korea-region-test.png', fullPage: true });

  const koreaInfo = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const match = text.match(/대한민국\s*\/\s*([^\s+-]+)/);
    return {
      region: match?.[1] || 'unknown',
      pathCount: document.querySelectorAll('svg path').length
    };
  });
  console.log('Korea region:', JSON.stringify(koreaInfo));

  // 뒤로
  await page.click('button:has-text("뒤로")', { force: true }).catch(() => {});
  await page.waitForTimeout(1000);

  // 일본 선택
  await page.click('[aria-label="메뉴 열기"]');
  await page.waitForTimeout(500);
  await page.click('button:has-text("일본")');
  await page.waitForTimeout(2000);

  // 일본 지도 스크린샷
  await page.screenshot({ path: '/tmp/japan-country-test.png', fullPage: true });

  // 오사카 근처 클릭 (관서 지역)
  await page.mouse.click(580, 500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/japan-region-test.png', fullPage: true });

  const japanInfo = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const match = text.match(/日本\s*\/\s*([^\s+-]+)/);
    return {
      region: match?.[1] || 'unknown',
      pathCount: document.querySelectorAll('svg path').length
    };
  });
  console.log('Japan region:', JSON.stringify(japanInfo));
});
