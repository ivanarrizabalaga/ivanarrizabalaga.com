#!/usr/bin/env node
/**
 * Downloads book covers from Open Library and adds cover paths to resume.json.
 * - For Amazon URLs: uses ASIN as ISBN (covers.openlibrary.org/b/isbn/{asin}-M.jpg)
 * - For O'Reilly URLs: extracts ISBN from path if present
 * - Otherwise: searches Open Library by title and uses cover_i
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RESUME_PATH = join(ROOT, "data", "resume.json");
const COVERS_DIR = join(ROOT, "public", "covers");

function slugFromTitle(title) {
  const t = typeof title === "string" ? title : title?.en ?? title?.es ?? "";
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function extractIsbnFromUrl(url) {
  if (!url) return null;
  const amazon = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (amazon) return amazon[1];
  const oreilly = url.match(/\/(\d{13})\//);
  if (oreilly) return oreilly[1];
  return null;
}

async function getCoverUrlByIsbn(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
  const res = await fetch(url, { method: "HEAD" });
  return res.ok ? url : null;
}

async function getCoverUrlBySearch(title) {
  const q = encodeURIComponent(typeof title === "string" ? title : title?.en ?? title?.es ?? "");
  const res = await fetch(
    `https://openlibrary.org/search.json?title=${q}&limit=1&fields=cover_i,title`
  );
  if (!res.ok) return null;
  const data = await res.json();
  const doc = data.docs?.[0];
  if (!doc?.cover_i) return null;
  return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
}

async function downloadCover(imageUrl, filePath) {
  const res = await fetch(imageUrl);
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) return false; // placeholder image is small
  writeFileSync(filePath, buf);
  return true;
}

async function main() {
  if (!existsSync(COVERS_DIR)) mkdirSync(COVERS_DIR, { recursive: true });

  const resume = JSON.parse(readFileSync(RESUME_PATH, "utf-8"));
  const recommendations = resume.aboutMe.recommendations;

  for (let i = 0; i < recommendations.length; i++) {
    const r = recommendations[i];
    const title = r.title;
    const slug = slugFromTitle(title);
    const coverPath = `/covers/${slug}.jpg`;
    const localPath = join(ROOT, "public", "covers", `${slug}.jpg`);

    let imageUrl = null;
    const isbn = extractIsbnFromUrl(r.URL);
    if (isbn) {
      imageUrl = await getCoverUrlByIsbn(isbn);
    }
    if (!imageUrl) {
      imageUrl = await getCoverUrlBySearch(title);
    }

    if (imageUrl) {
      const ok = await downloadCover(imageUrl, localPath);
      if (ok) {
        r.cover = coverPath;
        console.log(`✓ ${title?.slice?.(0, 40)}... -> ${coverPath}`);
      } else {
        console.log(`✗ ${title?.slice?.(0, 40)}... (download failed or placeholder)`);
      }
    } else {
      console.log(`✗ ${title?.slice?.(0, 40)}... (no cover found)`);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  writeFileSync(RESUME_PATH, JSON.stringify(resume, null, 2) + "\n");
  console.log("\nUpdated resume.json with cover paths.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
