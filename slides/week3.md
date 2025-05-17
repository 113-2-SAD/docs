---
marp: true
paginate: true
footer: "系統設計與分析 SAD 113-2"
lang: zh-TW
---

# 系統設計與分析 SAD 113-2

## 第 14 週課程：資料庫選型 & OpenAPI

### 助教：葉又銘、顧寬証，教授：盧信銘

---

<!-- Agenda -->
# 本週議程 (Week 14)

- 上週 (Week 13) 回顧
- **資料庫選型**
  - 為什麼重要？
  - SQL vs NoSQL (ACID vs BASE)
  - 常見資料庫簡介 (PostgreSQL, MySQL, MongoDB, Redis)
  - 技術選型考量
- **OpenAPI (Swagger)**
  - 什麼是 OpenAPI？為何使用？
  - 核心結構概覽
  - 工具生態系
  - Design-First API 開發流程
- **實作時間**
  - 撰寫基本 OpenAPI 文件
  - 使用工具測試 API
- 總結與下週預告

---

<!-- Review of Week 13 -->
# 上週回顧 (Week 13)

- **Docker 進階**: Registry (Docker Hub, GitHub CR), 為何需要 Registry。
- **Docker Compose**: 多容器應用管理, `docker-compose.yml` 結構與常用配置, 服務依賴。
- **Docker Swarm & Stack**: 集群管理、零停機更新、負載平衡、擴展概念 (初步)。
- **SSH 與遠端部署**: SSH 金鑰, `scp` 檔案傳輸, 遠端指令執行。
- **雲端原生 (Cloud Native)**: 核心概念 (容器, 微服務, CI/CD, DevOps), 實際部署考量。

> **實作回顧**: 使用 Docker Compose 運行 Todo App, 將 Todo App 透過 SSH 部署到遠端工作站伺服器。

---

<!-- Section: Database Selection -->
# 資料庫選型 (Database Selection)

<img src="db-meme.png" alt="Database Meme" height="400" />

---

## 為什麼資料庫選型重要？

- **應用程式的基石**：儲存核心數據。
- **效能影響巨大**：影響查詢速度、擴展性。
- **開發效率**：影響開發模式與複雜度。
- **維運成本**：學習曲線、社群、託管選項。
- **長期影響**：更換成本高昂。

> "沒有最好的資料庫，只有最適合的資料庫。"

---

## SQL vs NoSQL：兩大陣營

<img src="sql-vs-nosql.png" alt="SQL vs NoSQL" height="450" />

---

### SQL (關聯式資料庫)

- **核心**: 表格 (Table), 關聯 (Relation), SQL 語言。
- **特性**: Schema-on-Write (預定義結構)。
- **優勢 (ACID)**:
    - **A**tomicity (原子性): 交易全有或全無。
    - **C**onsistency (一致性): 維護資料庫規則。
    - **I**solation (隔離性): 交易互不干擾。
    - **D**urability (持久性): 資料提交後永久保存。
- **強項**: 資料一致性高，適合金融等準確性要求高的系統。
- **代表**: MySQL, PostgreSQL, Oracle, SQL Server.

---

### NoSQL (非關聯式資料庫)

- **核心**: "Not Only SQL"，多樣儲存方式。
- **特性**: Flexible Schema / Schema-on-Read (資料結構彈性)。
- **優勢 (BASE)**:
    - **B**asically **A**vailable (基本可用): 系統保證可用性。
    - **S**oft state (軟狀態): 狀態可隨時間改變。
    - **E**ventually consistent (最終一致性): 資料最終會達到一致。
- **強項**: 高擴展性、彈性結構、高效能讀寫 (特定場景)。
- **代表類型**: Key-Value, Document, Column-Family, Graph.

---

## NoSQL 代表類型概覽

NoSQL 資料庫根據其資料模型可主要分為四大類型：

1.  **Key-Value Stores (鍵值儲存)**
2.  **Document Stores (文件儲存)**
3.  **Column-Family Stores (列式家族儲存)**
4.  **Graph Databases (圖形資料庫)**

> 接下來我們將逐一介紹這些類型。
> 參考資料：[Dive Deep Into The Types of NoSQL Databases - Blazeclan](https://blazeclan.com/blog/dive-deep-types-nosql-databases/)

---

### NoSQL 類型 1: Key-Value Stores (鍵值儲存)

- **核心概念**: 資料以簡單的鍵值對 (Key-Value Pair) 形式儲存。Value 可以是簡單資料類型、複雜物件 (如 JSON、XML)。
- **特性**:
    - Schema-less 或極度彈性。
    - 結構簡單，因此操作速度快。
    - 通常透過 Key 直接存取資料，查詢方式受限。
- **優勢**: 高效能讀寫、易於擴展、結構簡單。
- **劣勢**: 複雜查詢能力弱、不適合高度關聯資料、資料間關係需自行管理。
- **適用場景**: 快取 (Caching)、Session 管理、使用者偏好設定、購物車。
- **代表**: Redis, Amazon DynamoDB (也是 Key-Value), Memcached, BerkeleyDB.

---

### NoSQL 類型 2: Document Stores (文件儲存)

- **核心概念**: 以文件 (Document) 為單位儲存資料，文件通常是 JSON、BSON 或 XML 格式。每個文件都是一個獨立的資料單元，可以有不同的結構。
- **特性**:
    - Schema-Flexible (彈性結構)，易於對應應用程式中的物件。
    - 可對文件內的欄位進行索引與查詢。
- **優勢**: 開發者友善 (資料格式接近程式物件)、彈性結構適合快速迭代、查詢能力比 Key-Value 強。
- **劣勢**: 跨文件交易 (Transaction) 支援通常較弱或無、不適合高度關聯且需強一致性的資料。
- **適用場景**: 內容管理系統 (CMS)、產品目錄、使用者設定檔、日誌記錄。
- **代表**: MongoDB, CouchDB, Elasticsearch (也用於搜尋).

---

### NoSQL 類型 3: Column-Family Stores (列式家族儲存)

- **核心概念**: 資料儲存在列式家族 (Column Families) 中。可以想像成一個二維的 Key-Value Store，其中 Row Key 對應多個 Column Family，每個 Column Family 包含多個 Columns。
- **特性**:
    - 高度可擴展，能處理巨量資料 (Petabytes)。
    - 資料讀寫針對 Column Family，適合稀疏資料 (Sparse Data)。
    - 查詢通常基於 Row Key 或 Column 的特定範圍。
- **優勢**: 極佳的水平擴展性、高吞吐量寫入、適合寬表 (Wide Tables) 和大量非結構化/半結構化資料。
- **劣勢**: 資料模型較複雜、不適合需要複雜關聯或多 Row 交易的場景。
- **適用場景**: 大數據分析、日誌資料、時間序列資料、推薦系統。
- **代表**: Apache Cassandra, HBase, Google Cloud Bigtable.

---

### NoSQL 類型 4: Graph Databases (圖形資料庫)

- **核心概念**: 專為儲存和導航關聯性資料而設計。資料以節點 (Nodes/Vertices) 和邊 (Edges/Relationships) 的形式表示。
- **特性**:
    - 強調資料之間的關聯性。
    - 查詢專注於遍歷 (Traversing) 節點間的關係，例如尋找最短路徑、朋友的朋友等。
    - Index-free adjacency (索引自由鄰接): 節點直接指向其相鄰節點，遍歷速度快。
- **優勢**: 高效處理複雜關聯查詢、資料模型直觀反映真實世界關係、某些實作可提供 ACID 特性。
- **劣勢**: 擴展性 (尤其是分片 Sharding) 可能比其他 NoSQL 類型更具挑戰性。
- **適用場景**: 社交網路、推薦引擎、知識圖譜、詐欺偵測、路網規劃。
- **代表**: Neo4j, Amazon Neptune, OrientDB.

---

## 常見資料庫巡禮

<!-- Consider adding a slide with logos of the databases for visual appeal -->
<!-- e.g., <img src="db-logos.png" alt="Database Logos" height="300" /> -->

---

### PostgreSQL ("Postgres")

- **類型**: 物件關聯式 (ORDBMS), 開源。
- **亮點**:
    - SQL 相容, 強 ACID 保證。
    - 高度可擴展 (自訂類型、函數)。
    - 進階功能豐富 (JSONB, PostGIS 地理空間處理, MVCC)。
- **適合**: 複雜查詢、需高度資料完整性、地理空間資料。
- **情境**: 金融總帳系統 (ACID 對交易準確至關重要)。

---

### MySQL

- **類型**: 關聯式 (RDBMS), 開源。
- **亮點**:
    - 非常流行，易於使用，社群龐大。
    - 效能良好，尤其適合讀取密集型應用。
    - InnoDB 引擎提供 ACID 可靠性。
    - 成熟的複製 (Replication) 功能，易於擴展。
- **適合**: 網站後端 (LAMP/LEMP), 電子商務。
- **情境**: 高流量電商 (InnoDB 處理訂單, 複製功能分攤讀取壓力)。

---

### MongoDB

- **類型**: 文件導向 NoSQL 資料庫。
- **亮點**:
    - 彈性結構 (JSON/BSON 文件)，開發者友善。
    - 水平擴展能力強 (Sharding)。
    - 高可用性 (Replica Sets)。
- **適合**: 需求快速迭代的應用、內容管理、產品目錄、IoT。
- **情境**: 大型零售商產品目錄 (彈性 Schema 適應多變商品屬性)。

---

### Redis (Remote Dictionary Server)

- **類型**: 記憶體內鍵值儲存 (In-Memory Key-Value Store)。
- **亮點**:
    - 極致速度 (資料存於 RAM)。
    - 多樣化的資料結構 (Lists, Sets, Hashes, Sorted Sets)。
    - 原子操作，輕量高效。
- **適合**: 快取、會話管理 (Session Management)、即時排行榜、訊息佇列。
- **情境**: 即時遊戲排行榜 (Sorted Set 高效處理排名更新)。

---

## 如何選擇你的資料庫？ (技術選型考量)

- **資料模型與結構**: 資料是高度結構化還是需要彈性？是否需要複雜關聯？
- **效能需求**: 讀寫頻率 (Read/Write Ratio)？延遲 (Latency) 要求？
- **擴展性策略**: 預期資料量與負載？垂直擴展 vs 水平擴展？
- **一致性模型**: 需要強一致性 (ACID) 還是可接受最終一致性 (BASE)？
- **團隊技能與生態系**: 團隊對該資料庫的熟悉程度？社群支援、文件是否完善？
- **預算與成本**: 開源 vs 商業授權？基礎設施與維運成本？
- **安全性需求**: 資料加密、存取控制、稽核、合規性要求？
- **特定功能需求**: 是否需要全文檢索、地理空間索引、圖形遍歷或時間序列優化？

> **混合持久化 (Polyglot Persistence)**：現代系統常依賴多種資料庫，為特定任務選擇最佳工具！

---

<!-- Optional: Condense the Discord story or a similar scaling example if desired -->
<!-- ## 大型公司如何擴展？ (簡例)

- **挑戰**: 高流量、巨量資料。
- **策略**:
    - **讀寫分離 (Read Replicas)**
    - **分片 (Sharding)**
    - **快取層 (Caching e.g., Redis)**
    - **專用資料庫 (Polyglot Persistence)**
    - **非同步處理 (Async Processing)**
- **Discord 案例啟示**: 從 MongoDB 到 Cassandra 到 ScyllaDB，不斷演進以應對 PB 級訊息儲存，並透過 Rust 中介層、智慧分區等策略優化。
> 擴展是個持續的旅程，結合架構調整與技術選型。
-->
---

# OpenAPI (Swagger)

<img src="openapi-meme.png" alt="OpenAPI Meme" height="450" />

---

## OpenAPI 是什麼 & 為何重要？

- **OpenAPI 規範 (OAS)**:
    - 一個**標準化、與語言無關**的說明書，用來描述、設計、記錄和測試 RESTful API。
    - 讓開發者和電腦都能輕易理解 API 的功能，即使沒有原始碼。
    - *Swagger* 是指圍繞 OpenAPI 規範的一系列常用工具。

- **核心價值**:
    - **標準化與清晰**: 就像一份 API 的「合約」，讓所有人對 API 功能有共同的理解，減少溝通誤會。
    - **自動化**: 可以自動產生客戶端程式碼 (SDKs)、伺服器端基本框架 (Stubs) 和互動式說明文件 (如 Swagger UI)。
    - **改善協作**: 前後端團隊可以依據這份「合約」同步開發，不用互相等待。
    - **設計優先 (Design-First)**: 鼓勵先設計好 API 再開始寫程式，有助於做出更好的設計。

---

## OpenAPI 文件核心一覽 (簡例)

這是一個 OpenAPI 文件的簡單範例，用來說明 API 的基本資訊和結構：

```yaml
openapi: 3.0.0 # OpenAPI 版本
info: # API 基本資訊 (名稱、版本、描述)
  title: 簡易待辦事項 API
  version: v1.0.0
  description: 一個管理待辦事項的簡單 API
servers: # API 在哪個網址上運作
  - url: http://localhost:5000/api
paths: # API 有哪些「路徑」(Endpoints)
  /todos: # 例如：`/todos` 這個路徑
    get: # 在這個路徑下，可以用 GET 方法
      summary: 列出所有待辦事項 # 這個操作的簡短說明
      responses: # 操作後可能收到的回應
        '200': # 例如：成功時 (狀態碼 200)
          description: 一份待辦事項列表
          content: # 回應的內容格式
            application/json: # 例如：JSON 格式
              schema: # 資料長什麼樣子
                type: array # 是一個列表 (Array)
                items:
                  $ref: '#/components/schemas/Todo' # 列表中的每個項目參考下面的 Todo 定義
components: # 可重複使用的定義區
  schemas: # 資料模型 (Data Models) - 定義資料的結構
    Todo: # 例如：定義一個叫做 Todo 的資料模型
      type: object # 它是一個物件
      properties: # 物件有哪些屬性
        id: { type: string, description: '待辦事項 ID (唯讀)' }
        title: { type: string, description: '待辦事項標題' }
        isCompleted: { type: boolean, default: false, description: '是否完成' }
```
> **主要部分**: `openapi` (版本), `info` (基本資訊), `servers` (伺服器位置), `paths` (API 的路徑與操作方法), `components` (可共用的定義，如資料模型 `schemas`)。

---

## OpenAPI 工具生態

有很多工具可以幫助我們使用 OpenAPI：

- **Swagger Editor / OpenAPI Editor**:
    - 像個文字編輯器，專門用來寫 OpenAPI 文件。
    - 可以裝在 IDE (開發工具) 裡，或直接用網頁版。
    - 會即時檢查語法錯誤，並能預覽文件看起來的樣子。
    - 知名線上版: [editor.swagger.io](https://editor.swagger.io/)
- **Swagger UI / Redoc**:
    - 能把 OpenAPI 文件變成漂亮的互動式網頁文件。
    - 讓開發者或使用者可以直接在網頁上瀏覽 API 有哪些功能，甚至直接試用。
- **Swagger Codegen / OpenAPI Generator**:
    - 能依據 OpenAPI 文件，自動產生程式碼！
    - 例如：自動產生連接 API 的客戶端程式碼 (SDKs)，或伺服器端的基本框架 (Stubs)。
    - 支援很多種程式語言，可以省下很多開發時間。
- **Postman / Insomnia**:
    - 常用的 API 測試工具。
    - 可以匯入 OpenAPI 文件，快速建立測試請求，方便測試和偵錯 API。

---

## Design-First API 開發流程

「設計優先」是指先規劃好 API 的樣子，再開始寫程式。這樣做可以讓開發更順利：

1.  **討論需求 (Define)**:
    - 先和團隊成員 (例如產品經理、設計師) 討論這個 API 要做什麼，解決什麼問題。
2.  **設計 API (Design)**:
    - 用 OpenAPI 格式寫下 API 的「設計圖」(合約)。
    - 決定 API 的路徑、操作方法、需要傳入的參數、以及會回傳的資料格式。
    - 可以用 Swagger Editor 這類工具來幫忙。
3.  **審查與回饋 (Review & Feedback)**:
    - 把設計好的 API 給團隊成員 (前後端、測試人員等) 看，收集大家的意見。
    - 可以用 Swagger UI 或 Redoc 把設計圖變成互動文件，方便討論和修改。
4.  **開始實作 (Implement)**:
    - 設計確定後，前後端工程師就可以依照這份「設計圖」開始寫程式了。
    - 有些工具甚至可以幫忙產生部分的程式碼 (Stubs 或 SDKs)。
5.  **測試驗證 (Test)**:
    - 寫好程式後，要測試 API 是否如預期運作。
    - 確認 API 的實際行為跟 OpenAPI 文件上寫的一致 (合約測試)。
    - 可以用 Postman/Insomnia 或其他自動化工具來測試。
6.  **部署與監控 (Deploy & Monitor)**:
    - API 完成後，部署到伺服器上線。
    - 持續觀察 API 的運作狀況，確保穩定和效能。

---

# 實作時間：API 設計與測試初體驗

### 本週實作目標
1.  **撰寫 OpenAPI 文件**:
    - 為一個簡易的 Todo App (或部分功能) 設計並撰寫 OpenAPI 描述檔 (`.yaml` 或 `.json`)。
    - 使用 Swagger Editor 或 VS Code 搭配 OpenAPI (Swagger) Editor 擴充套件。
2.  **產生互動式 API 文件**:
    - 使用 Swagger UI (可透過 Docker 運行或線上服務) 來呈現你撰寫的 OpenAPI 文件，體驗互動式查閱。
3.  **API 端點測試**:
    - (若有可運行的後端服務) 使用 Postman 或 Insomnia 等工具，可以手動或匯入 OpenAPI 文件來測試 API 端點。

> 詳細步驟與範例請參考課程提供的教學文件，並跟隨助教的引導操作。

---

## 總結 (Week 14)

- **資料庫選型**:
    - 理解了 SQL (ACID 特性) 與 NoSQL (BASE 特性) 的核心差異與設計哲學。
    - 認識了 PostgreSQL, MySQL, MongoDB, Redis 等常用資料庫的關鍵特性、優勢及其典型適用場景。
    - 掌握了進行資料庫技術選型時需要考量的多方面因素。
- **OpenAPI (Swagger)**:
    - 了解 OpenAPI 規範在現代 API 開發中的重要性與核心價值。
    - 概覽了 OpenAPI 文件的基本結構及圍繞其形成的強大工具生態系。
    - 熟悉了 Design-First 的 API 開發流程，及其對提升協作效率和 API 品質的益處。
- **實作概念**: 對如何著手設計 API 規格並利用工具進行驗證與測試有了初步認識。

---

## 下週預告 (Week 15)

- 主題：[進階 API 設計與實踐 / 系統監控與可觀測性 / 或其他進階系統設計主題]
- 我們將可能探討：
    - 更複雜的 API 設計模式與最佳實踐。
    - API 安全性考量 (認證、授權)。
    - 如何監控你的系統與服務。
    - ... 敬請期待！

---

# Q&A / 感謝聆聽！

- 有任何問題或建議，歡迎隨時提出。
- 請務必完成本週的實作練習，加深理解！

---

# 進階資料庫設計概念

除了選擇合適的資料庫類型，系統設計時還需考慮以下重要概念來確保系統的效能、擴展性與可靠性。

---

## 進階概念 1: Database Sharding (資料庫分片)

- **定義**: 將大型資料庫水平分割 (Horizontally Partitioning) 成多個較小、更易於管理的片段 (Shards)，每個 Shard 儲存資料的一個子集。這些 Shards 可以分佈在不同的伺服器上。
- **目的**:
    - **擴展性 (Scalability)**: 透過分散負載到多台伺服器來提高讀寫吞吐量和儲存容量。
    - **效能 (Performance)**: 查詢可以針對特定 Shard，減少掃描範圍。
    - **可用性 (Availability)**: 單一 Shard 故障不會影響整個系統 (若設計得當)。
- **挑戰**:
    - **實作複雜度**: Sharding Key 選擇、資料重新平衡 (Rebalancing)、跨 Shard 查詢與交易。
    - **應用程式影響**: 應用程式需要知道如何路由查詢到正確的 Shard。
- **常見策略**: Range-based, Hash-based, Directory-based sharding.

---

## 進階概念 2: Database Replication (資料庫複製)

- **定義**: 在多個資料庫伺服器上建立和維護相同資料的副本。通常有一個主伺服器 (Primary/Master) 處理寫入，並將變更複製到一個或多個副本伺服器 (Replicas/Slaves)。
- **目的**:
    - **高可用性 (High Availability)**: 若主伺服器故障，可切換到副本伺服器。
    - **讀寫分離 (Read Scaling)**: 讀取請求可以導向副本伺服器，減輕主伺服器壓力。
    - **災難恢復 (Disaster Recovery)**: 副本可位於不同地理位置。
    - **資料分析**: 在副本上執行分析查詢，不影響主伺服器效能。
- **模式**:
    - **同步複製 (Synchronous)**: 主伺服器等待所有副本確認後才完成寫入 (高一致性，低效能)。
    - **非同步複製 (Asynchronous)**: 主伺服器寫入後即返回，不等待副本 (高效能，可能資料延遲)。

---

## 進階概念 3: Database Caching Strategies (資料庫快取策略)

- **定義**: 將經常存取或計算成本高的資料暫時儲存在快速存取層 (如記憶體，例如 Redis, Memcached)，以減少對主資料庫的請求，提升應用程式回應速度。
- **目的**:
    - **降低延遲 (Reduce Latency)**: 從記憶體讀取遠快於從磁碟。
    - **減輕資料庫負載 (Reduce Database Load)**: 保護資料庫免於過多重複請求。
    - **提升吞吐量 (Improve Throughput)**: 應用程式能更快處理請求。
- **常見策略**:
    - **Cache-Aside (Lazy Loading)**: 應用程式先查快取，若未命中則查資料庫並寫回快取。
    - **Read-Through**: 應用程式只查快取，快取服務負責從資料庫載入 (若未命中)。
    - **Write-Through**: 寫入時同時更新快取和資料庫 (確保一致性，但增加寫入延遲)。
    - **Write-Back (Write-Behind)**: 寫入只更新快取，稍後非同步寫回資料庫 (高效能寫入，但有資料遺失風險)。
- **考量**: 快取失效策略 (Cache Invalidation), 快取大小, 資料一致性。

---

## 進階概念 4: CAP Theorem (CAP 定理)

- **定義**: 由 Eric Brewer 提出的理論，指出在一個分散式資料儲存系統中，不可能同時完美滿足以下三個特性，最多只能選擇其中兩個：
    - **C**onsistency (一致性): 所有節點在同一時間看到相同的資料。
    - **A**vailability (可用性): 每個請求都能收到一個 (非錯誤) 回應，但不保證是最新資料。
    - **P**artition Tolerance (分區容錯性): 即使節點間的網路通訊發生故障 (網路分區)，系統仍能繼續運作。
- **選擇**:
    - **CP (Consistency & Partition Tolerance)**: 犧牲可用性。當網路分區發生時，系統可能拒絕部分請求以保證資料一致性 (例如某些 RDBMS 的設定)。
    - **AP (Availability & Partition Tolerance)**: 犧牲強一致性。當網路分區發生時，系統仍可回應，但可能返回舊資料 (例如許多 NoSQL 資料庫，強調最終一致性)。
    - **CA (Consistency & Availability)**: 犧牲分區容錯性。這在單點系統中可行，但在分散式系統中，網路分區是必須考慮的。
- **影響**: 理解 CAP 定理有助於在設計分散式系統時，根據業務需求權衡取捨。

---

## 進階概念 5: Database Indexing (資料庫索引)

- **定義**: 一種資料結構，用於改善資料庫表格中資料的檢索速度。索引會針對一個或多個欄位建立，讓資料庫引擎能快速定位到符合查詢條件的資料列，而無需掃描整個表格 (Full Table Scan)。
- **目的**:
    - **加速查詢 (Speed up Queries)**: 大幅減少 `SELECT` 查詢的執行時間。
    - **確保唯一性 (Ensure Uniqueness)**: 如主鍵 (Primary Key) 索引。
- **運作方式**: 類似書本的目錄，索引儲存欄位值和指向實際資料列的指標。
- **常見類型**: B-Tree (最常用), Hash Index, Full-Text Index, Geospatial Index.
- **考量**:
    - **寫入成本 (Write Overhead)**: 建立和維護索引會增加寫入 (INSERT, UPDATE, DELETE) 操作的開銷。
    - **儲存空間 (Storage Space)**: 索引本身也需要儲存空間。
    - **選擇性 (Selectivity)**: 索引的欄位值越分散 (高選擇性)，索引效果越好。
> **"索引不是越多越好，而是要恰到好處。"**

---

# 案例研究：大型系統的資料庫擴展之路

## Discord 如何應對 PB 級資料挑戰

許多成功的線上服務都會面臨資料量爆炸性增長的問題。以知名社群平台 Discord 為例，他們需要儲存與快速存取海量的使用者訊息與狀態資料。

<img src="https://blog.discord.com/content/images/2017/05/00-HeaderNelly.png" alt="Discord Infrastructure" height="250" />

> 圖片來源: Discord Engineering Blog (示意圖，非即時架構)

---

## Discord 的資料庫演進與策略

- **初期挑戰**: 隨著用戶快速增長，原有的 MongoDB 叢集面臨巨大的讀寫壓力和擴展瓶頸。
- **技術選型演進**:
    - **MongoDB**: 初期選擇，但隨資料量增長，維護和擴展性挑戰變大。
    - **Apache Cassandra**: 轉向 Cassandra 以獲得更好的水平擴展性和寫入吞吐量，但也帶來了新的一致性和延遲問題。
    - **ScyllaDB**: 最終遷移到 ScyllaDB (Cassandra 的 C++ 重寫版本)，以追求更低的延遲和更高的效能。
- **核心策略**:
    - **多樣化儲存 (Polyglot Persistence)**: 針對不同服務和資料特性使用不同資料庫 (e.g., Redis for caching/presence, Elasticsearch for search)。
    - **自研中介層 (Rust Services)**: 開發 Rust 服務來處理資料庫的路由、分片邏輯和API抽象，簡化應用層。
    - **智慧分區/分片 (Smart Sharding/Partitioning)**: 基於 Guild ID 或 User ID 等進行資料分片，確保負載均衡。
    - **大量快取 (Aggressive Caching)**: 使用 Redis 等快取常用資料，減少資料庫直接存取。
    - **非同步處理 (Asynchronous Processing)**: 對於非即時性要求高的操作採用非同步處理。

---

## Discord 擴展啟示

- **擴展是持續的旅程**: 沒有一勞永逸的方案，需隨業務發展不斷迭代。
- **了解資料特性**: 不同資料類型和存取模式適合不同資料庫。
- **監控與分析**: 持續監控系統效能，找出瓶頸並進行優化。
- **基礎設施即程式碼 (IaC)**: 自動化部署和管理資料庫基礎設施。
- **客製化解決方案**: 有時通用方案無法滿足極端需求，可能需要自研元件。

> Discord 的經驗顯示，成功的擴展依賴於不斷的技術評估、架構調整和對資料特性的深刻理解。

---

# OpenAPI (Swagger)