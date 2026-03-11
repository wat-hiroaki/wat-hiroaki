const { generateTechStackData } = require('./fetch-github-data');
const fs = require('fs');

async function main() {
  console.log('🚀 Starting profile update...\n');

  // Step 1: GitHub APIからデータ取得
  const data = await generateTechStackData();
  fs.writeFileSync('tech-stack-data.json', JSON.stringify(data, null, 2));
  console.log('\n✅ Data fetched\n');

  // Step 2: README生成
  require('./generate-readme.js');

  console.log('\n🎉 Done! README.md is ready.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});