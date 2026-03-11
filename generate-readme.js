const fs = require('fs');

// 技術スタックデータを読み込み
const techStackData = JSON.parse(fs.readFileSync('tech-stack-data.json', 'utf8'));

// バーグラフの最大幅
const BAR_MAX = 25;

// README 生成
let readme = '';

// ヘッダー
readme += `### Hi there 👋\n\n`;
readme += `株式会社IMPMeのCEOをしています。\n\n`;

// 技術スタック
readme += `#### 🛠️ Tech Stack\n\n`;
readme += '```\n';

const entries = Object.entries(techStackData.techStack);
const maxPct = Math.max(...entries.map(([, p]) => p));

entries.forEach(([tech, pct]) => {
  const barLen = Math.round((pct / maxPct) * BAR_MAX);
  const bar = '█'.repeat(barLen);
  const pctStr = pct.toFixed(1).padStart(5) + '%';
  readme += `${tech.padEnd(14)} ${bar.padEnd(BAR_MAX)} ${pctStr}\n`;
});

readme += '```\n\n';

// フッター
readme += `<sub>🤖 Updated automatically by GitHub Actions `;
readme += `| ${techStackData.repoCount} repos analyzed</sub>\n`;

// ファイル出力
fs.writeFileSync('README.md', readme);
console.log('✅ README.md generated');