```
     MonTueWedThuFriSatSun
0-5:                      
6-11: ░  ░  ░  ▒  ░  ·  ·  
12-15: ·  ·  ░  ·  ░  ░  ·  
16-19:    ░  ·  ·  ·        
20-24: ░  ·  ·  ·     ·  ·  
```

```
JavaScript  │███████████████████████████████████████████│ 85%
Python      │███████████████████████████████████│ 70%
TypeScript  │██████████████████████████████│ 60%
React       │█████████████████████████│ 50%
Node.js     │████████████████████     │ 40%
Docker      │███████████████          │ 30%
Git         │█████████████            │ 25%
AWS         │██████████               │ 20%
MongoDB     │████████                 │ 15%
Redis       │█████                    │ 10%
```

### Data Update Methods

#### Manual Update
1. Edit `activity-data.json` or `tech-stack-data.json` files
2. Run `node generate-all.js` to regenerate SVGs
3. Commit and push changes

#### Automatic Update (GitHub API Integration)
GitHub Actions runs daily at 6:00 AM (JST) to automatically generate visualizations from actual GitHub activity data.

### Setup Instructions

#### 1. Create GitHub Personal Access Token
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Select the following scopes:
   - `repo` (repository access)
   - `read:user` (user information read)
4. Copy and save the token

#### 2. Set GitHub Repository Secrets
1. Repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GITHUB_TOKEN`
4. Secret: Personal Access Token created above
5. Click "Add secret"

#### 3. Enable GitHub Actions
1. Navigate to the repository's Actions tab
2. Click "I understand my workflows, go ahead and enable them"
3. For first run, manually click "Run workflow"

### Verification
- Confirm GitHub Actions "Update Visualizations" workflow runs successfully
- Confirm generated SVG files are committed
- Confirm visualizations in README are updated