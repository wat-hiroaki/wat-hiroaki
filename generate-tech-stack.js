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
const rowHeight = 30;
const padding = 20;
const labelWidth = 120;
const percentageWidth = 40;

// 技術を習熟度順でソート
const sortedTechs = Object.entries(techStack)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 8); // 上位8技術のみ表示

// SVGのサイズ計算
const svgWidth = labelWidth + barWidth + percentageWidth + padding * 2;
const svgHeight = sortedTechs.length * rowHeight + padding * 2;

// SVG生成
let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tech-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: start; }
    .percentage-label { font-family: Arial, sans-serif; font-size: 12px; fill: #666; text-anchor: end; }
    .bar-bg { fill: #e0e0e0; stroke: #ccc; stroke-width: 0.5; }
    .bar-fill { stroke: #fff; stroke-width: 0.5; }
  </style>
  
  <!-- 背景 -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#f8f9fa"/>
  
  <!-- タイトル -->
  <text x="${padding}" y="${padding + 15}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">技術スタック</text>
`;

// 各技術のバーを生成
sortedTechs.forEach(([techName, percentage], index) => {
  const y = padding + 30 + index * rowHeight;
  const barX = padding + labelWidth;
  const fillWidth = (barWidth * percentage) / 100;
  const color = techColors[techName] || '#666';
  
  // 背景バー
  svg += `  <rect x="${barX}" y="${y}" width="${barWidth}" height="${barHeight}" class="bar-bg"/>\n`;
  
  // 技術バー
  svg += `  <rect x="${barX}" y="${y}" width="${fillWidth}" height="${barHeight}" fill="${color}" class="bar-fill"/>\n`;
  
  // 技術名ラベル
  svg += `  <text x="${padding}" y="${y + 15}" class="tech-label">${techName}</text>\n`;
  
  // パーセンテージラベル
  svg += `  <text x="${barX + barWidth + 10}" y="${y + 15}" class="percentage-label">${percentage}%</text>\n`;
});

svg += `</svg>`;

// SVGファイルを保存
fs.writeFileSync('tech-stack.svg', svg);
console.log('Tech stack bar generated successfully!');