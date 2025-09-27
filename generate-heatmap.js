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
const svgWidth = hourLabelsWidth + gridWidth + padding * 2;
const svgHeight = dayLabelsHeight + gridHeight + padding * 2;

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
  
  <!-- 曜日ラベル -->
`;

// 曜日ラベルを追加
days.forEach((day, dayIndex) => {
  const y = dayLabelsHeight + padding + dayIndex * (cellSize + cellSpacing) + cellSize / 2;
  svg += `  <text x="${hourLabelsWidth - 5}" y="${y}" class="day-label">${dayLabels[dayIndex]}</text>\n`;
});

// 時間ラベルを追加
for (let hour = 0; hour < 24; hour++) {
  const x = hourLabelsWidth + padding + hour * (cellSize + cellSpacing) + cellSize / 2;
  svg += `  <text x="${x}" y="${dayLabelsHeight - 5}" class="hour-label">${hour}</text>\n`;
}

// ヒートマップセルを追加
days.forEach((day, dayIndex) => {
  const dayData = activityData[day] || {};
  
  for (let hour = 0; hour < 24; hour++) {
    const activityLevel = dayData[hour.toString()] || 0;
    const x = hourLabelsWidth + padding + hour * (cellSize + cellSpacing);
    const y = dayLabelsHeight + padding + dayIndex * (cellSize + cellSpacing);
    
    svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" 
           fill="${getActivityColor(activityLevel)}" class="cell"/>\n`;
  }
});

// 凡例を追加
svg += `
  <!-- 凡例 -->
  <g transform="translate(${svgWidth - 120}, ${svgHeight - 60})">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="10" fill="#333">Activity Level</text>
    <rect x="0" y="5" width="12" height="12" fill="#f5f5f5" stroke="#fff" stroke-width="0.5"/>
    <text x="15" y="15" font-family="Arial, sans-serif" font-size="8" fill="#666">0</text>
    <rect x="25" y="5" width="12" height="12" fill="#e0e0e0" stroke="#fff" stroke-width="0.5"/>
    <text x="40" y="15" font-family="Arial, sans-serif" font-size="8" fill="#666">1</text>
    <rect x="50" y="5" width="12" height="12" fill="#66bb6a" stroke="#fff" stroke-width="0.5"/>
    <text x="65" y="15" font-family="Arial, sans-serif" font-size="8" fill="#666">2</text>
    <rect x="75" y="5" width="12" height="12" fill="#ffeb3b" stroke="#fff" stroke-width="0.5"/>
    <text x="90" y="15" font-family="Arial, sans-serif" font-size="8" fill="#666">3</text>
    <rect x="0" y="20" width="12" height="12" fill="#ffa726" stroke="#fff" stroke-width="0.5"/>
    <text x="15" y="30" font-family="Arial, sans-serif" font-size="8" fill="#666">4</text>
    <rect x="25" y="20" width="12" height="12" fill="#ff6b6b" stroke="#fff" stroke-width="0.5"/>
    <text x="40" y="30" font-family="Arial, sans-serif" font-size="8" fill="#666">5</text>
  </g>
</svg>`;

// SVGファイルを保存
fs.writeFileSync('activity-heatmap.svg', svg);
console.log('Activity heatmap generated successfully!');