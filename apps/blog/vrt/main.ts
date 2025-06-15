import { chromium, Page } from "playwright";
import { spawn } from "node:child_process";
import { discoverRoutes } from "./route-discovery";
import { dirname, join, resolve } from "node:path";
import { browserController } from "./browserController";
import { mkdir } from "node:fs/promises";

const SERVER_PORT = 3333;
const SERVER_BASE_URL = `http://localhost:${SERVER_PORT}`;
const OUTPUT_DIR = join(__dirname, "../out");

const captureScreenShot = (page: Page) => async (target: { href: string }) => {
  await page.goto(new URL(target.href, SERVER_BASE_URL).href);
  await page.waitForLoadState("networkidle");
  
  // フォント読み込み完了を待つ
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000); // フォント読み込み用に少し長めに待機

  const outputPath = join(
    process.cwd(),
    "vrt",
    "screenshots",
    target.href.endsWith("/")
      ? `${target.href}/index.png`
      : `${target.href}.png`
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await page.screenshot({
    path: outputPath,
    fullPage: true,
  });
};

const main = async () => {
  console.log("[VRT] Chromiumブラウザを起動します...");
  const browser = await chromium.launch({
    headless: (process.env["VRT_HEADLESS"] ?? "true") === "true",
    args: [
      // フォント関連の設定を追加
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning', 
      '--disable-gpu-sandbox',
      '--force-color-profile=srgb',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      // 日本語文字化け対策
      '--lang=ja-JP',
      '--accept-lang=ja-JP',
    ],
  });
  console.log("[VRT] ブラウザ起動完了");
  console.log(`[VRT] サーバを起動します (ポート: ${SERVER_PORT}) ...`);
  const server = spawn("npx", [
    "http-server",
    "-p",
    SERVER_PORT.toString(),
    "out",
  ]);

  try {
    const context = await browser.newContext({
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      // フォント読み込み完了を待つ
      waitUntil: 'networkidle',
    });
    const controller = browserController(context);

    // server 起動を待つ
    console.log("[VRT] サーバ起動待機中...");
    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(SERVER_BASE_URL);
          if (response.status === 200) {
            clearInterval(interval);
            console.log("[VRT] サーバ起動完了");
            resolve(true);
          }
        } catch (error) {
          // サーバ未起動時は何もしない
        }
      }, 1000);
    });

    console.log("[VRT] ルート情報を取得します...");
    const routes = await discoverRoutes(OUTPUT_DIR);
    console.log(`[VRT] ルート発見: ${routes.length}件`);
    await Promise.all([
      ...routes.map((route, idx) =>
        controller.runWithPage(async (page) => {
          console.log(
            `[VRT] (${idx + 1}/${routes.length}) スクリーンショット取得開始: ${route.url}`
          );
          await captureScreenShot(page)({
            href: route.url,
          });
          console.log(
            `[VRT] (${idx + 1}/${routes.length}) スクリーンショット取得完了: ${route.url}`
          );
        })
      ),
      controller.taskLoop(),
    ]);
    console.log("[VRT] 全ルートのスクリーンショット取得が完了しました。");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // close server
    server.kill();

    // close all pages
    await Promise.all([
      ...browser
        .contexts()
        .flatMap((context) => context.pages().map((page) => page.close())),
    ]);

    // close all contexts
    await Promise.all([
      ...browser.contexts().map((context) => context.close()),
    ]);

    // close browser
    await browser.close();
  }
};

void main()
  .then(() => {
    console.log("[VRT] 正常終了しました。");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
