const fs = require('fs');

// 活動データを読み込み
const activityData = JSON.parse(fs.readFileSync('activity-data.json', 'utf8'));

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

// テキストヒートマップ生成
let textHeatmap = '';

// ヘッダー行（曜日ラベル）
textHeatmap += '     ';
dayLabels.forEach(day => {
  textHeatmap += day.padEnd(3);
});
textHeatmap += '\n';

// 時間行を生成
for (let hour = 0; hour < 24; hour++) {
  textHeatmap += hour.toString().padStart(2) + ': ';
  
  days.forEach(day => {
    const dayData = activityData[day] || {};
    const activityLevel = dayData[hour.toString()] || 0;
    textHeatmap += getActivityChar(activityLevel) + '  ';
  });
  
  textHeatmap += '\n';
}

// 凡例
textHeatmap += '\n';
textHeatmap += 'Legend:\n';
textHeatmap += '█ High Activity (Level 5)\n';
textHeatmap += '▓ High-Medium Activity (Level 4)\n';
textHeatmap += '▒ Medium Activity (Level 3)\n';
textHeatmap += '░ Low Activity (Level 2)\n';
textHeatmap += '· Inactive (Level 1)\n';
textHeatmap += '  No Data (Level 0)\n';

// テキストファイルを保存
fs.writeFileSync('activity-heatmap.txt', textHeatmap);
console.log('Text heatmap generated successfully!');
console.log('\n' + textHeatmap);