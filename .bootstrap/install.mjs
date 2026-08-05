import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const bootstrapDir = resolve(root, ".bootstrap");
const parts = readdirSync(bootstrapDir)
  .filter((name) => name.startsWith("source.part-"))
  .sort();

if (parts.length === 0) {
  throw new Error("No source archive chunks were found.");
}

const encoded = parts.map((name) => readFileSync(join(bootstrapDir, name), "utf8")).join("");
const archive = "/tmp/yaqoob-enterprises-source.tar.xz";
writeFileSync(archive, Buffer.from(encoded, "base64"));
execFileSync("tar", ["-xJf", archive, "-C", root], { stdio: "inherit" });

const imageSource = join(bootstrapDir, "storefront-concept.webp");
const imageDirectory = join(root, "public", "images");
const imageTarget = join(imageDirectory, "storefront-concept.webp");
if (existsSync(imageSource)) {
  mkdirSync(imageDirectory, { recursive: true });
  copyFileSync(imageSource, imageTarget);
}

console.log(`Installed ${parts.length} source chunks into the working tree.`);
