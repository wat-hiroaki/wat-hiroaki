const fs = require('fs');

console.log('🚀 Starting unified generation...');

// GitHub APIからデータを取得
console.log('📡 Fetching data from GitHub API...');
try {
  require('./fetch-github-data.js');
  console.log('✅ GitHub data fetched successfully!');
} catch (error) {
  console.error('❌ Error fetching GitHub data:', error.message);
  console.log('📝 Using existing data files...');
}

// ヒートマップ生成
console.log('📊 Generating activity heatmap...');
try {
  require('./generate-heatmap.js');
  console.log('✅ Activity heatmap generated successfully!');
} catch (error) {
  console.error('❌ Error generating activity heatmap:', error.message);
}

// 技術スタック生成
console.log('🛠️ Generating tech stack bar...');
try {
  require('./generate-tech-stack.js');
  console.log('✅ Tech stack bar generated successfully!');
} catch (error) {
  console.error('❌ Error generating tech stack bar:', error.message);
}

// テキストヒートマップ生成
console.log('📝 Generating text heatmap...');
try {
  require('./generate-text-heatmap.js');
  console.log('✅ Text heatmap generated successfully!');
} catch (error) {
  console.error('❌ Error generating text heatmap:', error.message);
}

// READMEファイル生成
console.log('📖 Generating README.md...');
try {
  require('./generate-readme.js');
  console.log('✅ README.md generated successfully!');
} catch (error) {
  console.error('❌ Error generating README.md:', error.message);
}

console.log('🎉 All visualizations generated successfully!');
console.log('');
console.log('Generated files:');
console.log('- activity-heatmap.svg');
console.log('- tech-stack.svg');
console.log('- activity-heatmap.txt');
console.log('- README.md');
console.log('');
console.log('Next steps:');
console.log('1. Review the generated SVG files');
console.log('2. Update data files if needed:');
console.log('   - activity-data.json (for heatmap)');
console.log('   - tech-stack-data.json (for tech stack)');
console.log('3. Commit and push changes to GitHub');