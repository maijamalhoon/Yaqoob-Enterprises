#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DEFAULT_PROJECT_ID = '10215507842447835032';
const DEFAULT_SCREEN_ID = '887935adb4fa49d59cb2ab8189add7f6';

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };

  const projectId = getArg('--project') || process.env.STITCH_PROJECT_ID || DEFAULT_PROJECT_ID;
  const screenId = getArg('--screen') || process.env.STITCH_SCREEN_ID || DEFAULT_SCREEN_ID;
  const apiKey = getArg('--api-key') || process.env.STITCH_API_KEY;
  const directHtmlUrl = getArg('--html-url');
  const directImageUrl = getArg('--image-url');

  const outputDir = path.resolve(process.cwd(), 'public/stitch');
  await fs.mkdir(outputDir, { recursive: true });

  console.log(`[Stitch Downloader] Project: ${projectId}`);
  console.log(`[Stitch Downloader] Screen: ${screenId}`);
  console.log(`[Stitch Downloader] Output Directory: ${outputDir}`);

  let htmlDownloadUrl = directHtmlUrl;
  let imageDownloadUrl = directImageUrl;

  if (!htmlDownloadUrl || !imageDownloadUrl) {
    if (!apiKey) {
      console.error('\n[Error] STITCH_API_KEY is not configured in the environment.');
      console.error('To fetch the screen download URLs directly from Google Stitch:');
      console.error('1. Generate a Stitch API key from: https://stitch.withgoogle.com/settings (API keys -> Create key)');
      console.error('2. Add STITCH_API_KEY in AI Studio Settings (or run with --api-key <YOUR_KEY>)');
      console.error('Or if you already have the hosted download URLs, run:');
      console.error('  node scripts/download-stitch-assets.mjs --html-url "<HTML_URL>" --image-url "<IMAGE_URL>"\n');
      process.exit(1);
    }

    console.log('[Stitch Downloader] Querying Stitch MCP API for screen metadata...');
    const mcpPayload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'get_screen',
        arguments: {
          projectId,
          screenId,
          name: `projects/${projectId}/screens/${screenId}`,
        },
      },
    };

    const res = await fetch('https://stitch.googleapis.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'X-Goog-Api-Key': apiKey,
      },
      body: JSON.stringify(mcpPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Stitch Downloader] API request failed (${res.status}):`, errText);
      process.exit(1);
    }

    const data = await res.json();
    const content = data?.result?.structuredContent || data?.result;
    htmlDownloadUrl = content?.htmlCode?.downloadUrl || content?.htmlUrl;
    imageDownloadUrl = content?.screenshot?.downloadUrl || content?.imageUrl;

    await fs.writeFile(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify(content || data, null, 2),
      'utf-8'
    );
  }

  if (htmlDownloadUrl) {
    console.log(`[Stitch Downloader] Downloading code HTML via curl -L...`);
    const targetHtml = path.join(outputDir, 'code.html');
    execSync(`curl -L "${htmlDownloadUrl}" -o "${targetHtml}"`, { stdio: 'inherit' });
    console.log(`[Stitch Downloader] Saved: ${targetHtml}`);
  }

  if (imageDownloadUrl) {
    console.log(`[Stitch Downloader] Downloading screen image via curl -L...`);
    const targetImg = path.join(outputDir, 'yaqoob-enterprises-homepage.png');
    execSync(`curl -L "${imageDownloadUrl}" -o "${targetImg}"`, { stdio: 'inherit' });
    console.log(`[Stitch Downloader] Saved: ${targetImg}`);
  }

  console.log('[Stitch Downloader] Done! All assets downloaded successfully.');
}

main().catch((err) => {
  console.error('[Stitch Downloader] Unexpected error:', err);
  process.exit(1);
});
