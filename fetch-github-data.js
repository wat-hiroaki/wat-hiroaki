const fs = require('fs');
const https = require('https');

// GitHub API設定
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'your-username';

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
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// ユーザーのリポジトリ一覧を取得
async function getUserRepositories() {
  try {
    const repos = await githubApiRequest(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    return repos.filter(repo => !repo.fork); // フォークを除外
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    return [];
  }
}

// リポジトリの言語統計を取得
async function getRepositoryLanguages(repoName) {
  try {
    return await githubApiRequest(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`);
  } catch (error) {
    console.error(`Error fetching languages for ${repoName}:`, error.message);
    return {};
  }
}

// リポジトリのコミット履歴を取得（過去30日）
async function getRepositoryCommits(repoName) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();
    
    const commits = await githubApiRequest(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?author=${GITHUB_USERNAME}&since=${since}&per_page=100`
    );
    return commits;
  } catch (error) {
    console.error(`Error fetching commits for ${repoName}:`, error.message);
    return [];
  }
}

// 活動データを生成
async function generateActivityData() {
  console.log('📊 Generating activity data from GitHub...');
  
  const repos = await getUserRepositories();
  console.log(`Found ${repos.length} repositories`);
  
  const activityData = {
    monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {}, saturday: {}, sunday: {}
  };
  
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (const repo of repos.slice(0, 10)) { // 最新10リポジトリのみ
    console.log(`Processing ${repo.name}...`);
    const commits = await getRepositoryCommits(repo.name);
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const dayOfWeek = dayNames[date.getDay()];
      const hour = date.getHours();
      
      if (!activityData[dayOfWeek][hour]) {
        activityData[dayOfWeek][hour] = 0;
      }
      activityData[dayOfWeek][hour]++;
    });
  }
  
  // 活動レベルを1-5に正規化
  const allValues = Object.values(activityData).flatMap(day => Object.values(day));
  const maxValue = Math.max(...allValues);
  
  Object.keys(activityData).forEach(day => {
    Object.keys(activityData[day]).forEach(hour => {
      const value = activityData[day][hour];
      activityData[day][hour] = Math.min(5, Math.max(1, Math.ceil((value / maxValue) * 5)));
    });
  });
  
  return activityData;
}

// 技術スタックデータを生成
async function generateTechStackData() {
  console.log('🛠️ Generating tech stack data from GitHub...');
  
  const repos = await getUserRepositories();
  console.log(`Found ${repos.length} repositories`);
  
  const languageStats = {};
  
  for (const repo of repos.slice(0, 10)) { // 最新10リポジトリ（30日間で活動があるもの）
    console.log(`Processing languages for ${repo.name}...`);
    const languages = await getRepositoryLanguages(repo.name);
    
    Object.entries(languages).forEach(([lang, bytes]) => {
      if (!languageStats[lang]) {
        languageStats[lang] = 0;
      }
      languageStats[lang] += bytes;
    });
  }
  
  // 上位技術を選択し、パーセンテージに変換
  const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0);
  const sortedLanguages = Object.entries(languageStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  const techStack = {};
  sortedLanguages.forEach(([lang, bytes]) => {
    techStack[lang] = Math.round((bytes / totalBytes) * 100);
  });
  
  return { techStack };
}

// メイン実行関数
async function main() {
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }
  
  try {
    // 活動データを生成
    const activityData = await generateActivityData();
    fs.writeFileSync('activity-data.json', JSON.stringify(activityData, null, 2));
    console.log('✅ Activity data generated');
    
    // 技術スタックデータを生成
    const techData = await generateTechStackData();
    fs.writeFileSync('tech-stack-data.json', JSON.stringify(techData, null, 2));
    console.log('✅ Tech stack data generated');
    
    console.log('🎉 All data generated successfully!');
  } catch (error) {
    console.error('❌ Error generating data:', error.message);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmainを呼び出し
if (require.main === module) {
  main();
}

module.exports = { generateActivityData, generateTechStackData };