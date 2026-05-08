const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#080c14";
  ctx.fillRect(0, 0, size, size);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#00e5ff");
  gradient.addColorStop(1, "#c084fc");
  ctx.fillStyle = gradient;
  ctx.font = `bold ${size * 0.45}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("JQ", size / 2, size / 2);

  const buffer = canvas.toBuffer("image/png");
  const outputPath = path.join(__dirname, "..", "public", `icon-${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated icon-${size}.png`);
}

generateIcon(192);
generateIcon(512);
