const fs = require('fs');

// 技術スタックデータを読み込み
const techStackData = JSON.parse(fs.readFileSync('tech-stack-data.json', 'utf8'));

// テキストグラフ生成
let textGraph = '';

// 各技術のバーグラフを生成
Object.entries(techStackData.techStack).forEach(([tech, percentage]) => {
  const barLength = Math.round(percentage / 2); // 50% = 25文字のバー
  let bar = '';
  
  // バーを生成
  for (let i = 0; i < barLength; i++) {
    bar += '█';
  }
  
  // 技術名とパーセンテージを追加
  textGraph += tech.padEnd(12) + '│' + bar.padEnd(25) + '│ ' + percentage + '%\n';
});

// テキストファイルを保存
fs.writeFileSync('tech-stack.txt', textGraph);
console.log('Text tech stack generated successfully!');
console.log('\n' + textGraph);