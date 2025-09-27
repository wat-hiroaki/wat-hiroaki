const fs = require('fs');

// 活動データを読み込み
const activityData = JSON.parse(fs.readFileSync('activity-data.json', 'utf8'));
const techStackData = JSON.parse(fs.readFileSync('tech-stack-data.json', 'utf8'));

// 曜日の順序（月曜日始まり）
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 活動レベルに応じた文字の定義
const getActivityChar = (level) => {
  switch(level) {
    case 5: return '█'; // 高活動 - 完全ブロック
    case 4: return '▓'; // 中高活動 - 濃いブロック
    case 3: return '▒'; // 中活動 - 中ブロック
    case 2: return '░'; // 低活動 - 薄いブロック
    case 1: return '·'; // 非活動 - ドット
    default: return ' '; // デフォルト - 空白
  }
};

// テキストビジュアライゼーション生成
let textVisualization = '';

// ヒートマップ部分
textVisualization += '📊 ACTIVITY HEATMAP\n';
textVisualization += '='.repeat(50) + '\n\n';

// ヘッダー行（曜日ラベル）
textVisualization += '     ';
dayLabels.forEach(day => {
  textVisualization += day.padEnd(3);
});
textVisualization += '\n';

// 時間行を生成
for (let hour = 0; hour < 24; hour++) {
  textVisualization += hour.toString().padStart(2) + ': ';
  
  days.forEach(day => {
    const dayData = activityData[day] || {};
    const activityLevel = dayData[hour.toString()] || 0;
    textVisualization += getActivityChar(activityLevel) + '  ';
  });
  
  textVisualization += '\n';
}

// ヒートマップ凡例
textVisualization += '\nLegend:\n';
textVisualization += '█ High Activity (Level 5)\n';
textVisualization += '▓ High-Medium Activity (Level 4)\n';
textVisualization += '▒ Medium Activity (Level 3)\n';
textVisualization += '░ Low Activity (Level 2)\n';
textVisualization += '· Inactive (Level 1)\n';
textVisualization += '  No Data (Level 0)\n';

// 技術スタック部分
textVisualization += '\n\n🛠️  TECH STACK\n';
textVisualization += '='.repeat(50) + '\n\n';

// 各技術のバーグラフを生成
Object.entries(techStackData.techStack).forEach(([tech, percentage]) => {
  const barLength = Math.round(percentage / 2); // 50% = 25文字のバー
  let bar = '';
  
  // バーを生成
  for (let i = 0; i < barLength; i++) {
    bar += '█';
  }
  
  // 技術名とパーセンテージを追加
  textVisualization += tech.padEnd(12) + '│' + bar.padEnd(25) + '│ ' + percentage + '%\n';
});

// テキストファイルを保存
fs.writeFileSync('visualization.txt', textVisualization);
console.log('Text visualization generated successfully!');
console.log('\n' + textVisualization);