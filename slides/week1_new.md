---
marp: true
paginate: true
backgroundColor: #fff
---

# 資訊系統基礎開發流程實作 – Todo App
## 第 1 週課程簡報（進階版）

> **目標**：以實戰導向的 Todo App 專案，從 0 ➜ 1 建構開發與部署生命週期。

## 2 Git 版本控制

---
### Git 快照物件模型
```text
Working Directory → Staging Area (index) → Commit (SHA‑1)
```
- **Blob**：檔案內容（不可變）
- **Tree**：目錄結構
- **Commit**：指向 Tree 的封裝，附作者／父節點

> Git 不是存「差異」，而是存**每次快照**並以內容雜湊去重。

---

### Git Flow 實務
```
main ← release ← develop ← feature
         ↑           ↖ hotfix
```
- 適合 **版本化產品**；若做 SaaS 可改採 trunk‑based + feature flags
- PR 流程：功能完成 → 開 Merge Request → Review + CI → Merge

---

## 3 Docker 基礎

### Container 運作原理
- **Namespaces**：PID、NET、UTS、MNT、IPC、USER – 隔離視圖
- **cgroups v2**：配額與限制 CPU / Mem / IO
- **Union FS**：OverlayFS 以分層可寫層實現輕量

### Docker ≠ VM
| 項目 | 容器 (Docker) | 虛擬機 (VM) |
| --- | --- | --- |
| 啟動時間 | 秒級 | 分鐘級 |
| 資源耗用 | 低、共用 Kernel | 高、完整 OS |
| 打包 | 映像層 (layer) | 映像檔 (QCOW2/VDI) |

> **實戰**：使用 <https://hadolint.github.io> 檢查 Dockerfile 最佳實踐。

---

### Dockerfile 多階段建構（示例）
```dockerfile
# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate \
 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# --- Runtime Stage ---
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
> **優點**：產出映像 < 50 MB，降低攻擊面並加速部署。

---

## 4 自動化測試 – Playwright

### 為何選 Playwright？
- **任何瀏覽器 & 平台**：Chromium、Firefox、WebKit，同 API
- **可靠性**：自動等待、定位器引擎，減少 flake
- **Headless or headed**：可錄製與 Debug 模式
- **Parallel & Trace Viewer**：測試矩陣、影片重播

### 範例測試片段
```ts
import { test, expect } from "@playwright/test";

test("新增 Todo", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByPlaceholder("新增待辦").fill("學習 Git");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("學習 Git")).toBeVisible();
});
```
> **TIP**：可於 CI 階段收集 `--trace on` 提高 Debug 效率。

---

## 5 CI/CD with GitHub Actions

### Workflow 核心元素
```yaml
name: CI
on:
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```
- **Matrix 策略**：一次測多版本 Node.js / OS
- **快取**：`actions/cache` 可將 `~/.pnpm-store` 快取 依賴
- **Artifact**：保存測試報告、Docker 映像或 Helm Chart

### 部署流水線（預告）
- Stage → Staging (Preview) → Production
- 自動標記版本 (`git tag v1.0.0 && gh release`)

---

## 6 DevOps 視角

### CAMS 四大支柱
1. **Culture**：跨職能合作
2. **Automation**：持續整合 & 部署
3. **Measurement**：指標與回饋
4. **Sharing**：知識共用

> 我們將透過專案實作，體驗 **理論 → 工具 → 流程** 的轉換。

---

## Q & A

- 下週請預先安裝 **Docker Compose**，並閱讀官方範例
- 上傳 GitHub 帳號 SSH 指紋至作業系統

> **挑戰**：嘗試為 Todo App 撰寫第一份 Playwright 測試並提交 PR。

---

# Thank You 🙌

> 課程素材、範例程式碼與錄影將於課後上傳

