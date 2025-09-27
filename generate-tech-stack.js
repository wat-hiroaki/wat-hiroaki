const fs = require('fs');

// 技術スタックデータを読み込み
const techData = JSON.parse(fs.readFileSync('tech-stack-data.json', 'utf8'));
const techStack = techData.techStack;

// 技術の色定義
const techColors = {
  'JavaScript': '#F7DF1E',
  'Python': '#3776AB',
  'TypeScript': '#3178C6',
  'React': '#61DAFB',
  'Node.js': '#339933',
  'Docker': '#2496ED',
  'Git': '#F05032',
  'AWS': '#FF9900',
  'MongoDB': '#47A248',
  'Redis': '#DC382D'
};

// SVGの設定
const barWidth = 400;
const barHeight = 20;
const rowHeight = 25;
const padding = 20;

// 技術を習熟度順でソート
const sortedTechs = Object.entries(techStack)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 8); // 上位8技術のみ表示

// SVGのサイズ計算
const svgWidth = barWidth + padding * 2;
const svgHeight = sortedTechs.length * rowHeight + padding * 2;

// SVG生成
let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tech-label { font-family: Arial, sans-serif; font-size: 12px; fill: #ffffff; text-anchor: start; }
    .percentage-label { font-family: Arial, sans-serif; font-size: 12px; fill: #cccccc; text-anchor: end; }
    .bar-bg { fill: #333333; stroke: #555; stroke-width: 0.5; }
    .bar-fill { stroke: #666; stroke-width: 0.5; }
    .card-bg { fill: #2a2a2a; stroke: #444; stroke-width: 1; }
  </style>
  
  <!-- ダークテーマ背景 -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#1a1a1a"/>
  
  <!-- カード背景 -->
  <rect x="10" y="10" width="${svgWidth - 20}" height="${svgHeight - 20}" rx="8" class="card-bg"/>
  
`;

// 各技術のバーを生成
sortedTechs.forEach(([techName, percentage], index) => {
  const y = padding + index * rowHeight;
  const barX = padding;
  const fillWidth = (barWidth * percentage) / 100;
  const color = techColors[techName] || '#666';
  
  // 背景バー
  svg += `  <rect x="${barX}" y="${y}" width="${barWidth}" height="${barHeight}" class="bar-bg"/>\n`;
  
  // 技術バー
  svg += `  <rect x="${barX}" y="${y}" width="${fillWidth}" height="${barHeight}" fill="${color}" class="bar-fill"/>\n`;
  
  // 技術名ラベル
  svg += `  <text x="${barX + 5}" y="${y + barHeight/2 + 4}" class="tech-label">${techName}</text>\n`;
  
  // パーセンテージラベル
  svg += `  <text x="${barX + barWidth - 5}" y="${y + barHeight/2 + 4}" class="percentage-label">${percentage}%</text>\n`;
  
});

svg += `</svg>`;

// SVGファイルを保存
fs.writeFileSync('tech-stack.svg', svg);
console.log('Tech stack bar generated successfully!');