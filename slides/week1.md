---
marp: true
---

# 資訊系統基礎開發流程實作 - Todo App

## 第 1 週課程簡報

---

## 課程目標與結構

### 課程目標

- 從資訊系統開發的基礎開始，透過實作一個 **Todo App**，熟悉開發流程。
- 掌握 **Git 版本控制**、**Docker 容器化**、**自動化測試** 與 **CI/CD** 的基礎。
- 初步理解 **DevOps** 核心概念，提升開發效率與程式碼品質。

### 為何選擇 Todo App？

- **簡單易懂**：適合初學者快速上手。
- **全面性**：包含前端與後端，涵蓋完整開發流程。
- **可擴展**：易於修改與進階實作。

---

### 本週大綱

1. **環境準備**
2. **Git 版本控制與 SSH 設定**
3. **Docker 基礎與應用**
4. **軟體測試：Playwright 入門**
5. **CI/CD 基礎：GitHub Actions**

---

## 環境準備

### 必要工具

1. **電腦**：Windows、Mac 或 Linux
2. **開發工具**：Visual Studio Code、終端機 (Terminal)
3. **瀏覽器**：Chrome、Firefox 或 Edge
4. **GitHub 帳號**
5. **Windows 用戶建議**：安裝 WSL 2（Windows Subsystem for Linux 2）
6. **Node.js**：下載並安裝 [Node.js](https://nodejs.org/)

### 安裝 pnpm

**pnpm** 是一款高效的 Node.js 套件管理工具，本課程將使用它管理依賴。

---

#### 安裝指令

```bash
npm install -g pnpm
```

#### 驗證安裝

```bash
pnpm -v
```

#### 為什麼選 pnpm？

- **高效**：安裝速度快，節省磁碟空間。
- **兼容性**：支援 npm 指令，易於上手。
- **現代化**：適合 monorepo 等架構。

---

## Git 版本控制與 SSH 設定

### 為什麼需要 Git？

Git 是現代開發的核心工具，幫助我們：

- **版本管理**：追蹤程式碼變更，隨時回溯。
- **團隊協作**：多人同時開發不衝突。
- **分支開發**：獨立開發新功能或修復 Bug。

---

### Git 基本概念

- **Repository（儲存庫）**：程式碼與歷史記錄的存放處。
- **Commit（提交）**：記錄程式碼變更的快照。
- **Branch（分支）**：獨立開發路徑。
- **Merge（合併）**：整合不同分支的變更。

---

### Git 運作原理

Git 採用 **快照 (snapshot)** 機制管理版本，而非傳統的差異儲存。

#### 核心機制

1. **快照記錄**：
   - 每次 Commit，Git 記錄所有檔案的完整狀態。
   - 未變更的檔案只存指標，節省空間。
2. **物件模型**：
   - **Blob**：檔案內容。
   - **Tree**：目錄結構。
   - **Commit**：版本記錄（包含作者、時間等）。
3. **SHA-1 雜湊值**：
   - 每個物件有唯一識別碼，確保資料完整性。

---

#### 比喻

想像 Git 是一台「智慧型時光相機」：

- 按下快門（Commit）記錄整個場景。
- 未變動部分重用舊照片，節省空間。
- 相簿（`.git` 目錄）用指紋（SHA-1）管理照片。

---

### Git Flow：分支管理實踐

**Git Flow** 是一種結構化的分支策略，提升團隊協作效率。

#### 分支模型

- **Main**：正式發布版本。
- **Develop**：開發中的程式碼。
- **Feature**：新功能開發分支。
- **Release**：準備發布的版本。
- **Hotfix**：緊急修復分支。

---

#### 運作流程

1. 從 Develop 開 Feature 分支開發功能。
2. 功能完成後合併回 Develop。
3. 準備發布時開 Release 分支測試。
4. 發布後合併至 Main 與 Develop。
5. 緊急修復從 Main 開 Hotfix 分支。

#### 優點

- **清晰結構**：分工明確。
- **並行開發**：功能互不干擾。
- **易於審查**：支援程式碼審核。

---

### 安裝與設定 Git

#### 安裝

- **Windows**：下載 [Git](https://git-scm.com/download/win)，包含 Git Bash。
- **Mac**：`brew install git`
- **Linux**：`sudo apt install git`
- 驗證：`git --version`

#### 基本設定

```bash
git config --global user.name "你的名稱"
git config --global user.email "你的Email"
```

檢查：`git config --list`

---

#### SSH 設定

1. 生成金鑰：
   ```bash
   ssh-keygen -t rsa -b 4096 -C "你的Email"
   ```
2. 添加公鑰至 GitHub：
   - 查看公鑰：`cat ~/.ssh/id_rsa.pub`
   - 在 [GitHub SSH 設定](https://github.com/settings/keys) 添加。
3. 測試連線：
   ```bash
   ssh -T git@github.com
   ```

---

## Docker 基礎與應用

### 為什麼用 Docker？

解決開發痛點：

- **環境不一致**：「我的電腦可以跑，別的不行。」
- **部署複雜**：依賴管理繁瑣。
- **資源浪費**：虛擬機過於笨重。

### Docker 簡介

Docker 是 **容器化技術**，將應用與依賴打包成 **映像檔 (Image)**，在任何環境以 **容器 (Container)** 執行。

---

#### 優勢

- **一致性**：開發到部署環境相同。
- **輕量**：比虛擬機高效。
- **隔離性**：應用互不影響。

#### Docker vs. 虛擬機

- VM：包含完整 OS，資源消耗大。
- Docker：共享主機 Kernel，輕量快速。

---

### Docker 運作原理

基於 **Linux Namespace** 與 **Cgroups**：

1. **Namespaces**：
   - 隔離網路、檔案系統、進程等。
   - 類型：PID、NET、MNT 等。
2. **Cgroups**：
   - 限制 CPU、記憶體等資源。
   - 確保容器不影響主機。

#### Image 與 Container

- **Image**：應用模板（只讀）。
- **Container**：Image 的執行實例。

---

#### 比喻

- Namespaces 是「隔離牢房」，Cgroups 是「資源管理員」。
- Docker 是「監獄」，確保每個應用安全運行。
- Image 是「囚犯制服」，Container 是「囚犯」。

---

### 安裝與實作 Docker

#### 安裝

- **Windows/Mac**：下載 [Docker Desktop](https://www.docker.com/products/docker-desktop)。
- **Linux**：
  ```bash
  sudo apt install docker.io
  sudo systemctl enable docker
  ```
- 測試：`docker run hello-world`

---

#### 實作 Todo App

1. **Dockerfile（前端）**：
   ```dockerfile
   （參考文件）
   ```
2. 建構與運行：
   ```bash
   docker build -t todo-app-frontend .
   docker run -d -p 3000:3000 todo-app-frontend
   ```
3. 測試：瀏覽器訪問 `http://localhost:3000`。

---

## 軟體測試：Playwright 入門

### 為什麼需要測試？

- **品質保證**：確保功能正常。
- **成本效益**：早期發現 Bug。
- **穩定性**：提升使用者體驗。

### Playwright 簡介

- **特點**：支援多瀏覽器、E2E 測試、直觀 API。
- **優勢**：開發社群、無頭模式（不用真的開瀏覽器）、直觀設計。

---

#### 安裝（詳細內容參考文件）

```bash
pnpm install -D @playwright/test
pnpm dlx playwright install
```

#### 測試範例

`tests/todo.spec.js`：

```javascript
import { test, expect } from "@playwright/test";
test("新增待辦事項", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.fill('input[name="title"]', "學習");
  await page.click('button[type="submit"]');
  expect(await page.innerText(".todo-item")).toContain("學習");
});
```

執行：`pnpm test`

---

## CI/CD 基礎：GitHub Actions

### CI/CD 簡介

- **CI（持續整合）**：自動測試新程式碼。
- **CD（持續部署）**：測試通過後自動部署。
- **DevOps 角色**：提升交付速度與品質。

---

### GitHub Actions

自動化 CI/CD 流程：

1. **Workflow 檔案**（`.github/workflows/ci.yml`）：
   ```yaml
   name: CI
   on: [push]
   jobs: （詳細請參考文件）
   ```
2. 推送後自動執行，檢查結果於 GitHub Actions 頁面。

---

## 總結與下一步

### 本週回顧

- **Git**：版本控制與 Git Flow。
- **Docker**：容器化基礎與實作。
- **Playwright**：自動化測試。
- **CI/CD**：GitHub Actions 入門。

### 下一週

- **Docker Compose**：多容器管理。
- **雲端原生架構**：進階部署實作。
