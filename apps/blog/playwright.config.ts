import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './vrt',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // フォント関連の設定を追加
        launchOptions: {
          args: [
            // フォント関連の引数を追加
            '--font-render-hinting=none',
            '--disable-font-subpixel-positioning',
            '--disable-gpu-sandbox',
            // 日本語フォント関連
            '--force-color-profile=srgb',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
        },
      },
    },
  ],
});