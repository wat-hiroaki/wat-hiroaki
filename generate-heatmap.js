const fs = require('fs');

// 活動データを読み込み
const activityData = JSON.parse(fs.readFileSync('activity-data.json', 'utf8'));

// 曜日の順序（月曜日始まり）
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// SVGの設定
const cellSize = 12;
const cellSpacing = 2;
const padding = 20;
const hourLabelsWidth = 30;
const dayLabelsHeight = 20;

// グリッドのサイズ計算
const gridWidth = 24 * (cellSize + cellSpacing) - cellSpacing;
const gridHeight = 7 * (cellSize + cellSpacing) - cellSpacing;
const svgWidth = gridWidth + padding * 2;
const svgHeight = gridHeight + padding * 2;

// 活動レベルに応じた色の定義
const getActivityColor = (level) => {
  switch(level) {
    case 5: return '#ff6b6b'; // 高活動 - 赤
    case 4: return '#ffa726'; // 中高活動 - オレンジ
    case 3: return '#ffeb3b'; // 中活動 - 黄色
    case 2: return '#66bb6a'; // 低活動 - 緑
    case 1: return '#e0e0e0'; // 非活動 - グレー
    default: return '#f5f5f5'; // デフォルト - 薄いグレー
  }
};

// SVG生成
let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .day-label { font-family: Arial, sans-serif; font-size: 10px; fill: #666; text-anchor: end; }
    .hour-label { font-family: Arial, sans-serif; font-size: 8px; fill: #666; text-anchor: middle; }
    .cell { stroke: #fff; stroke-width: 0.5; }
  </style>
  
  <!-- 背景 -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#f8f9fa"/>
`;


// ヒートマップセルを追加
days.forEach((day, dayIndex) => {
  const dayData = activityData[day] || {};
  
  for (let hour = 0; hour < 24; hour++) {
    const activityLevel = dayData[hour.toString()] || 0;
    const x = padding + hour * (cellSize + cellSpacing);
    const y = padding + dayIndex * (cellSize + cellSpacing);
    
    svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" 
           fill="${getActivityColor(activityLevel)}" class="cell"/>\n`;
  }
});

svg += `</svg>`;

// SVGファイルを保存
fs.writeFileSync('activity-heatmap.svg', svg);
console.log('Activity heatmap generated successfully!');