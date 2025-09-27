const fs = require('fs');

// 活動データを読み込み
const activityData = JSON.parse(fs.readFileSync('activity-data.json', 'utf8'));

// 曜日の順序（月曜日始まり）
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 時間帯の定義
const timeZones = [
  { name: '0-5', hours: [0, 1, 2, 3, 4, 5] },
  { name: '6-11', hours: [6, 7, 8, 9, 10, 11] },
  { name: '12-15', hours: [12, 13, 14, 15] },
  { name: '16-19', hours: [16, 17, 18, 19] },
  { name: '20-24', hours: [20, 21, 22, 23] }
];

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

// 時間帯の平均活動レベルを計算
const getTimeZoneActivityLevel = (dayData, hours) => {
  let totalLevel = 0;
  let count = 0;
  
  hours.forEach(hour => {
    const level = dayData[hour.toString()] || 0;
    totalLevel += level;
    count++;
  });
  
  return count > 0 ? Math.round(totalLevel / count) : 0;
};

// テキストヒートマップ生成
let textHeatmap = '';

// ヘッダー行（曜日ラベル）
textHeatmap += '     ';
dayLabels.forEach(day => {
  textHeatmap += day.padEnd(3);
});
textHeatmap += '\n';

// 時間帯行を生成
timeZones.forEach(timeZone => {
  textHeatmap += timeZone.name.padStart(2) + ': ';
  
  days.forEach(day => {
    const dayData = activityData[day] || {};
    const activityLevel = getTimeZoneActivityLevel(dayData, timeZone.hours);
    textHeatmap += getActivityChar(activityLevel) + '  ';
  });
  
  textHeatmap += '\n';
});

// テキストファイルを保存
fs.writeFileSync('activity-heatmap.txt', textHeatmap);
console.log('Timezone heatmap generated successfully!');
console.log('\n' + textHeatmap);