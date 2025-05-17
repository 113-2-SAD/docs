---
marp: true
paginate: true
footer: "系統設計與分析 SAD 113-2"
lang: zh-TW
---

# 系統設計與分析 SAD 113-2

## 第 14 週課程：資料庫選型 & OpenAPI

### 助教：葉又銘、顧寬証　|　教授：盧信銘

---
<!-- Agenda -->
# 本週議程 (Week 14)

1. 上週 Week 13 回顧
2. **資料庫選型**：理論、實務與案例
3. **進階資料庫設計概念**
4. **OpenAPI (Swagger)**：Design‑First API 開發
5. **實作時間**：撰寫並測試 OpenAPI 文件
6. **總結與期末提醒**

---
<!-- Review of Week 13 -->
# 上週回顧 (Week 13)

- **Docker 進階**：Registry、映像管理
- **Docker Compose**：多容器協調、服務依賴
- **Docker Swarm & Stack**：集群部署、零停機更新
- **SSH 遠端部署**：SSH 金鑰、`scp` 傳輸、指令自動化
- **Cloud Native** 概念：容器、微服務、CI/CD、DevOps

> ▶︎ **實作回顧**：使用 Docker Compose 部署 Todo App，並透過 SSH 上線至遠端伺服器。

---
# 資料庫選型 (Database Selection)

<img src="db-meme.png" alt="Database Meme" height="380" />

---
## 為什麼資料庫選型重要？

選對資料庫就像為你的應用程式挑選一個合適的「大腦」和「倉庫」，它會決定：

* **資料怎麼存**：核心資料存放位置
* **跑得快不快**：回應速度與可擴展性
* **好不好開發**：開發體驗與複雜度
* **花錢多不多**：學習、維運與雲端成本
* **未來好不好改**：遷移代價通常極高

> **重點**：沒有「最好」，只有「最適合」你需求的資料庫。

---
## SQL vs NoSQL：兩大陣營

<img src="sql-vs-nosql.png" alt="SQL vs NoSQL" height="420" />

| **特性** | **SQL (關聯式)** | **NoSQL (非關聯式)** |
| --- | --- | --- |
| 資料結構 | Schema‑on‑Write | Schema‑on‑Read / Flexible |
| 一致性模型 | ACID 強一致 | BASE 最終一致 |
| 優勢 | 複雜查詢、交易可靠 | 高擴展、彈性、效能 |
| 常見應用 | 銀行、訂單系統 | CMS、快取、大數據 |

---
### SQL (關聯式資料庫)

* **核心概念**：表格 (Table) + 關聯 (Relation)
* **ACID 保證**
  * **A**tomicity　*原子性*
  * **C**onsistency　*一致性*
  * **I**solation　*隔離性*
  * **D**urability　*持久性*
* **強項**：需要強一致 & 複雜關聯 (銀行、ERP)
* **代表**：PostgreSQL、MySQL、Oracle、SQL Server

---
### NoSQL (非關聯式資料庫)

* **核心**：Not Only SQL，多樣資料模型
* **BASE 模型** (最終一致)
  * Basically Available
  * Soft state
  * Eventually consistent
* **優勢**：高擴展、彈性、特定場景高效能
* **代表類型**：Key‑Value、Document、Column‑Family、Graph

---
## NoSQL 四大類型概覽

1. **Key‑Value Stores**
2. **Document Stores**
3. **Column‑Family Stores**
4. **Graph Databases**

> 以下逐一介紹。

---
### 1️⃣ Key‑Value Stores

* `Key → Value` 直接映射，操作極速
* 典型場景：快取、Session、排行榜
* 代表：Redis、DynamoDB、Memcached

---
### 2️⃣ Document Stores

* JSON/BSON 文件，Schema‑Flexible
* 典型場景：CMS、產品目錄、日誌
* 代表：MongoDB、CouchDB

---
### 3️⃣ Column‑Family Stores

* Row Key + Column Families，寫入吞吐高
* 典型場景：大數據分析、時間序列
* 代表：Cassandra、HBase、Bigtable

---
### 4️⃣ Graph Databases

* Nodes + Edges 表示關係，遍歷高效
* 典型場景：社交網路、推薦引擎、詐欺偵測
* 代表：Neo4j、Amazon Neptune

---
## 常見資料庫巡禮

| 資料庫 | 亮點 | 典型情境 |
| --- | --- | --- |
| **PostgreSQL** | JSONB、GIS、MVCC | 金融帳務、複雜查詢 |
| **MySQL** | 社群大、複製成熟 | Web/E‑commerce |
| **MongoDB** | 彈性文件、分片 | 快速迭代產品資料 |
| **Redis** | In‑Memory、多資料結構 | 高速快取、即時排行 |

---
## 選型考量 Checklist

1. 資料模型 & 關聯複雜度
2. 讀寫比例 & 延遲 SLA
3. 一致性 vs 可用性
4. 擴展策略 (Vertical / Horizontal)
5. 團隊熟悉度 & 生態
6. 成本、合規、安全需求
7. 專用功能：全文、GIS、圖遍歷、時間序列

> **Polyglot Persistence**：為每項工作挑最適工具。

---
# 進階資料庫設計概念

> 提升效能、擴展與可靠性。

---
### 概念 1｜Sharding

水平分割資料 → 吞吐 & 容量提升

---
### 概念 2｜Replication

同步 / 非同步；高可用 & 讀寫分離

---
### 概念 3｜Caching

Cache‑Aside、Read‑Through、Write‑Through、Write‑Back

---
### 概念 4｜CAP Theorem

Consistency / Availability / Partition Tolerance 擇二

---
### 概念 5｜Indexing

B‑Tree、Hash、Full‑Text、Geo；索引≠越多越好

---
# Discord 資料庫演進 — 一段擴展故事

---
## 背景與挑戰

* 2015‑2016：用戶激增，訊息量高速成長
* 原 MongoDB 叢集：寫入與分片瓶頸，延遲↑
* 必須保證 **全球即時聊天體驗**

---
## 階段一：MongoDB → Cassandra

* **原因**：需要更好水平擴展 & 高寫入吞吐
* **做法**：Guild ID 取模分片，寫入壓力大幅分散
* **新挑戰**：讀延遲 & 一致性調參 (QUORUM)

---
## 階段二：Cassandra → ScyllaDB

* **原因**：Cassandra JVM GC 造成尾端延遲 (P99)
* **ScyllaDB**：C++ 重寫，同協定兼容，節點數降 >50%
* **效益**：延遲降低 5‑10×，硬體成本省 30%+

---
## 輔助策略 & 系統思維

* **Redis Presence + Cache**：線上狀態 & 熱資料快取
* **Rust 中介層**：統一資料路由／智慧分片
* **Aggressive Caching**：減少 DB 直接命中率
* **非同步批次寫**：降低高峰即時壓力

---
## 成果與啟示

1. **多樣資料庫並用**：依資料特性選擇 (Polyglot)
2. **持續監控 & 漸進遷移**：迭代升級風險可控
3. **自研工具彌補通用 DB 限制**：中介層、Sharder
4. **擴展沒有終點**：容量、成本、可靠性永續優化

---
# OpenAPI (Swagger)

<img src="openapi-meme.png" alt="OpenAPI Meme" height="420" />

---
## OpenAPI 是什麼？

* **OpenAPI Spec (OAS)**：以 YAML/JSON 描述 REST API 的標準格式。
* **核心理念**：API = 合約 → 人機皆可讀。
* **Swagger**：OAS
  的工具家族 (Editor、UI、Codegen …)。

---
## 為何使用 OpenAPI？

1. **標準化 & 共識**：同一份合約，減少溝通誤差。
2. **自動化**：生成 SDK / Server Stub / 測試腳本，節省重複工。
3. **互動式文件**：Swagger UI / Redoc 可即時 Try‑It。
4. **Design‑First**：先設計、再開發，降低返工。

---
## 文件結構總覽

| Section | 作用 |
| --- | --- |
| `openapi` | 版本號 (ex. 3.0.0) |
| `info` | 標題、版本、描述、聯絡人 |
| `servers` | API Base URLs |
| `paths` | 各端點 (Endpoint) 及 HTTP 方法 |
| `components` | 共用資料模型 (schemas)、參數、回應、Security |
| `security` | 全域安全設定 (OAuth2、API Key…) |

---
## YAML 範例片段

```yaml
openapi: 3.0.0
info:
  title: Todo API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /todos:
    get:
      summary: List all todos
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TodoList'
components:
  schemas:
    Todo:
      type: object
      properties:
        id: { type: string, readOnly: true }
        title: { type: string }
        isCompleted: { type: boolean, default: false }
    TodoList:
      type: array
      items:
        $ref: '#/components/schemas/Todo'
```

---
## 工具生態系 Snapshot

| 類別        | 常用工具                         | 功用                          |
|-------------|----------------------------------|-------------------------------|
| Authoring   | Swagger Editor / VS Code OAS 插件 | 撰寫、即時驗證 OAS 檔案       |
| Documentation | Swagger UI / Redoc             | 產生互動式 API 文件，提供 Try-It 功能 |
| Code Generation | OpenAPI Generator / Swagger Codegen | 自動產生各語言 SDK 與 Server Stub |
| Testing     | Postman / Insomnia               | 匯入 OAS 進行自動化測試與偵錯 |

---
## Design-First API 開發流程

1. **Define 需求**：與產品、設計、開發團隊協作，收集 API 功能與使用場景。
2. **Design OAS**：利用 YAML/JSON 描述所有端點、參數、資料模型與安全設定。
3. **Review & Feedback**：透過 Swagger UI / Redoc 與團隊共同檢視，調整合約細節。
4. **Implement Stub/SDK**：使用 OpenAPI Generator 快速生成骨架程式碼或客戶端函式庫。
5. **Contract Testing**：以 Postman/Newman 或自動化 CI 驗證實作與合約一致。
6. **Deploy & Monitor**：部署 API 並監控效能與錯誤，持續優化合約與實作。

---
# 實作時間：API 文件與測試

1. 撰寫 **Todo App** OpenAPI 描述檔（`todo.yaml`）。
2. 啟動 **Swagger UI** 本地服務，確認文件與效能。
3. 使用 **Postman** 匯入 `todo.yaml`，執行 GET/POST/PUT/DELETE 測試。
4. 根據測試結果，回到 OAS 修正合約再迭代。

---
# 總結 (Week 14)

- **資料庫選型**：理解 SQL vs NoSQL 差異、常見資料庫與選型要點。
- **進階概念**：Sharding、Replication、Caching、CAP、Indexing。
- **案例**：Discord 擴展之路。
- **OpenAPI**：設計優先、工具生態與實作流程。

---
# Q & A

> 感謝聆聽 — 有任何問題歡迎提出！
