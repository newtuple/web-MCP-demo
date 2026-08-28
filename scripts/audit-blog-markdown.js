const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const root = process.cwd();
const blogDir = path.join(root, "content", "blog");
const allowedTags = new Set(["AI Agents", "LLM Engineering", "Applied AI", "Document AI", "Data Engineering", "Tutorials"]);
const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md") && file !== "README.md");
const errors = [];

for (const file of files) {
  const fullPath = path.join(blogDir, file);
  const source = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(source);
  const lines = parsed.content.split("\n");
  const tags = parsed.data.tags || [];

  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 2) {
    errors.push(`${file}: expected one or two tags`);
  }
  for (const tag of tags) {
    if (!allowedTags.has(tag)) errors.push(`${file}: unknown tag "${tag}"`);
  }

  lines.forEach((line, index) => {
    const location = `${file}:${index + 1}`;
    if (/^#{1,6}\s*$/.test(line)) errors.push(`${location}: empty heading`);
    if (/^\s*\[\s*$/.test(line) || /^\s*\]\([^)]+\)\s*$/.test(line)) {
      errors.push(`${location}: split Markdown link`);
    }
    if (/WIX_(?:IMAGE|VIDEO|GALLERY)_\d+/.test(line)) errors.push(`${location}: unresolved Wix placeholder`);
  });

  for (const match of parsed.content.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
    const asset = path.join(root, "public", match[1]);
    if (!fs.existsSync(asset)) errors.push(`${file}: missing image ${match[1]}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Audited ${files.length} blog posts: no malformed links, empty headings, Wix placeholders, missing local images, or invalid tags.`);
