const fs = require('fs');
const https = require('https');

// GitHub API設定
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PAT;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'wat-hiroaki';

// GitHub API呼び出し関数
function githubApiRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GitHub-Profile-Generator',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ data: JSON.parse(data), headers: res.headers });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// ページネーション対応でリポジトリ一覧を取得（プライベート含む）
async function getAllRepositories() {
  const repos = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/user/repos?visibility=all&affiliation=owner&per_page=100&sort=updated&page=${page}`;
    const { data } = await githubApiRequest(url);

    if (!Array.isArray(data) || data.length === 0) break;

    repos.push(...data.filter(repo => !repo.fork));
    if (data.length < 100) break;
    page++;
  }

  return repos;
}

// リポジトリの言語統計を取得
async function getRepositoryLanguages(owner, repoName) {
  try {
    const { data } = await githubApiRequest(
      `https://api.github.com/repos/${owner}/${repoName}/languages`
    );
    return data;
  } catch (error) {
    console.error(`  ⚠️ Skipped ${repoName}: ${error.message}`);
    return {};
  }
}

// 技術スタックデータを生成
async function generateTechStackData() {
  console.log('🛠️  Fetching tech stack data (including private repos)...');

  const repos = await getAllRepositories();
  console.log(`📦 Found ${repos.length} repositories (public + private)`);

  const languageStats = {};

  for (const repo of repos) {
    process.stdout.write(`  📂 ${repo.name}...`);
    const languages = await getRepositoryLanguages(repo.owner.login, repo.name);

    Object.entries(languages).forEach(([lang, bytes]) => {
      languageStats[lang] = (languageStats[lang] || 0) + bytes;
    });
    console.log(' ✓');
  }

  // 上位技術を選択し、パーセンテージに変換
  const totalBytes = Object.values(languageStats).reduce((sum, b) => sum + b, 0);
  const sorted = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const techStack = {};
  sorted.forEach(([lang, bytes]) => {
    techStack[lang] = Math.round((bytes / totalBytes) * 1000) / 10; // 小数点1桁
  });

  return { techStack, repoCount: repos.length };
}

// メイン実行関数
async function main() {
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN or GH_PAT environment variable is required');
    process.exit(1);
  }

  try {
    const data = await generateTechStackData();
    fs.writeFileSync('tech-stack-data.json', JSON.stringify(data, null, 2));
    console.log('\n✅ Tech stack data generated successfully!');
    console.log(`   Languages: ${Object.keys(data.techStack).join(', ')}`);
    console.log(`   Repos analyzed: ${data.repoCount}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateTechStackData };