import { test } from '@playwright/test';

test('Test Tokyo region map', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  // 일본 선택
  await page.click('[aria-label="메뉴 열기"]');
  await page.waitForTimeout(500);
  await page.click('button:has-text("일본")');
  await page.waitForTimeout(2000);

  // 도쿄 근처 클릭 (관동 지역)
  await page.mouse.click(700, 480);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/tokyo-region-test.png', fullPage: true });

  // 시구정촌 호버 테스트
  await page.mouse.move(640, 400);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/tokyo-hover-test.png', fullPage: true });
});
