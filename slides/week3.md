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


# 上週回顧

--- 

## Week 12 (SADo Part 1) 重點回顧

- **Git 版本控制**: 基本概念、運作原理、Git Flow 分支模型。
- **GitHub 協作**: SSH 設定、Pull Requests、Code Review。
- **Docker 容器化**: 基礎、Dockerfile、Image vs Container。
- **自動化測試**: 
    - **單元測試 (Jest)**: 概念、Jest 基本使用、模擬。
    - **E2E 測試 (Playwright)**: 概念、Playwright 基本使用。
- **CI/CD**: DevOps 概念、GitHub Actions 基礎。

> 實作：在本機 Clone Todo App, Git 操作, Docker 建置運行前後端, 撰寫與執行 Jest 及 Playwright 測試, 設定 GitHub Actions CI。

---

## Week 13 (SADo Part 2) 重點回顧

- **Docker 進階**: Registry (Docker Hub, GitHub CR), 為何需要 Registry。
- **Docker Compose**: 多容器應用管理, `docker-compose.yml` 結構與常用配置, 服務依賴。
- **Docker Swarm & Stack**: 集群管理、零停機更新、負載平衡、擴展概念 (初步)。
- **SSH 與遠端部署**: SSH 金鑰, `scp` 檔案傳輸, 遠端指令執行。
- **雲端原生 (Cloud Native)**: 核心概念 (容器, 微服務, CI/CD, DevOps), 實際部署考量 (安全性、網域名稱、資料庫、監控等)。

> 實作：使用 Docker Compose 運行 Todo App, 將 Todo App 透過 SSH 部署到遠端工作站伺服器。

---
## 本週議程 (Week 14)

- **上週 (Week 13) 回顧**
- **資料庫選型**
  - SQL vs NoSQL
  - 常用資料庫介紹 (PostgreSQL, MySQL, MongoDB, Redis)
  - 技術選型考量
- **OpenAPI (Swagger)**
  - API 文件標準
  - 現代化 API 開發流程
  - Best Practices


---

# 資料庫選型 (Database Selection)

<img src="db-meme.png" alt="Database Meme" height="400" />

--- 

## 為什麼資料庫選型重要？

- **應用程式的基石**：資料庫是大多數應用程式的核心，儲存所有重要數據。
- **效能影響巨大**：不適合的資料庫會導致查詢緩慢、擴展困難、甚至系統崩潰。
- **開發效率**：資料庫的特性會影響開發模式、查詢語言的複雜度。
- **維運成本**：不同資料庫的學習曲線、社群支援、託管選項 (自建 vs 雲端) 都不同。
- **長期影響**：一旦選定並大規模使用，更換資料庫的成本非常高昂。

> "沒有最好的資料庫，只有最適合的資料庫。" - 匿名工程師

--- 

## 資料庫的兩大主要類型：SQL vs NoSQL

<img src="sql-vs-nosql.png" alt="SQL vs NoSQL" height="450" />

--- 

### SQL (關聯式資料庫)

- **核心概念**: 資料存於結構化表格 (Table)，表格間可建立關聯 (Relation)。使用 SQL 語言操作。
- **寫入特性 (Schema-on-Write)**: 需預先定義表格結構 (Schema)。
- **主要優勢 (ACID)**:
    - **A**tomicity (原子性): 交易全有或全無。
    - **C**onsistency (一致性): 維護資料庫規則。
    - **I**solation (隔離性): 交易互不干擾。
    - **D**urability (持久性): 資料提交後永久保存。
- **強項**: 資料一致性高，適合金融等需高度準確性的系統。
- **代表產品**: MySQL, PostgreSQL, Oracle, SQL Server, SQLite。

---

### NoSQL (非關聯式資料庫)

- **核心概念**: "Not Only SQL"，泛指非關聯式資料庫，資料儲存方式多樣。
- **寫入特性 (Flexible Schema / Schema-on-Read)**: 資料結構可不固定，或讀取時才定義。
- **主要優勢 (BASE)**:
    - **B**asically **A**vailable (基本可用): 系統保證可用性。
    - **S**oft state (軟狀態): 狀態可隨時間改變。
    - **E**ventually consistent (最終一致性): 資料最終會達到一致。
- **強項**: 高擴展性、彈性結構、高效能讀寫 (特定場景)。
- **代表產品類型**: Key-Value, Document, Column-Family, Graph (詳見後續)。

---

### NoSQL (非關聯式資料庫) (續)

- **特性**：
    - **高擴展性 (Scalability)**：通常設計為易於水平擴展 (Horizontal Scaling)。
    - **彈性 Schema (Flexible Schema)**：Schema-on-Read，資料結構可以不固定，適合快速迭代和非結構化資料。
    - **高效能讀寫**：針對特定場景 (e.g., 大量讀寫) 進行優化。
    - **BASE 特性**：基本可用 (Basically Available)、軟狀態 (Soft state)、最終一致性 (Eventually consistent)。
- **代表產品**：MongoDB (Document), Redis (Key-Value), Cassandra (Column-family), Neo4j (Graph).

--- 

## 探索 NoSQL 資料庫類型

NoSQL 資料庫並非萬能解決方案。它們包含多種資料模型，每種模型都針對不同類型的資料和存取模式進行了優化。我們將探討四種主要類型：

1.  **鍵值儲存 (Key-Value Stores)**
2.  **文件資料庫 (Document Databases)**
3.  **列式家族儲存 (Column-Family Stores / Wide-Column Stores)**
4.  **圖形資料庫 (Graph Databases)**

理解這些類型有助於為您的特定需求選擇合適的 NoSQL 資料庫。

---

### 1. 鍵值儲存 (Key-Value Stores)

- **資料模型**: 最簡單的 NoSQL 類型。資料以「鍵-值」(Key-Value) 配對集合的形式儲存。「值」可以是任何東西：字串、數字、JSON、圖片、影片等。資料庫不檢查或關心「值」的內容。
- **運作方式**: 可想像成一個巨大的字典或雜湊表 (Hash Map)。您使用唯一的「鍵」來儲存資料，並使用相同的「鍵」來檢索資料。操作通常是 `GET(key)`、`PUT(key, value)`、`DELETE(key)`。
- **為何使用 (優勢)**:
    - **極致簡單與高速**: 由於直接透過「鍵」存取，簡單的查詢、讀取和寫入速度非常快。
    - **可擴展性**: 易於根據「鍵」進行分片 (Sharding) 以實現水平擴展。
    - **靈活性**: 「值」可以是任何類型的資料。
- **常見應用場景**: 快取 (Caching)、會話管理 (Session Management)、使用者設定檔、即時競價資料、偏好設定儲存。
- **代表產品**: Redis, Memcached, Amazon DynamoDB (亦可作為文件資料庫使用)。

---

### 2. 文件資料庫 (Document Databases)

- **資料模型**: 將資料儲存在「文件」(Document) 中，這些文件是獨立的資料結構，通常採用 JSON、BSON 或 XML 格式。文件類似於物件導向程式設計中的「物件」。
- **運作方式**: 每個文件都有一個唯一的 ID。文件可以是巢狀的、複雜的，包含各種欄位和陣列。資料庫允許根據文件內的欄位進行查詢。
- **為何使用 (優勢)**:
    - **彈性結構 (Flexible Schema)**: 輕鬆儲存結構各異、欄位不同的文件，非常適合需求快速變化的應用程式。
    - **開發者友善**: 資料模型通常與應用程式的物件模型非常接近，簡化了開發過程。
    - **豐富的查詢功能**: 支援對文件內任何欄位進行查詢，並可建立索引以提升效能。
- **常見應用場景**: 內容管理系統 (CMS)、產品目錄、具有複雜屬性的使用者設定檔、行動應用程式後端。
- **代表產品**: MongoDB, Couchbase, Amazon DocumentDB.

---

### 3. 列式家族儲存 (Column-Family Stores / Wide-Column Stores)

- **資料模型**: 資料儲存在資料表 (Table)、資料列 (Row) 和資料行 (Column) 中，但與關聯式資料庫不同，同一資料表中的資料列可以有不同的資料行名稱和格式。一個資料列的資料是按「列式家族」(Column Family，一組相關的資料行) 儲存的。
- **運作方式**: 概念上像一個二維映射，其中鍵值為 `(row_key, column_key, timestamp) -> value`。資料在磁碟上按「列式家族」實體儲存，優化了對多個資料列中少量資料行的查詢。
- **為何使用 (優勢)**:
    - **極佳的可擴展性**: 設計用於處理分佈在多台伺服器上的 PB (Petabytes) 等級資料。
    - **高寫入吞吐量**: 為寫入密集型工作負載進行了優化。
    - **彈性的資料行**: 適合稀疏資料集，即資料列可能有很多潛在資料行，但特定資料列只填充了其中一部分。
- **常見應用場景**: 大數據分析、時間序列資料 (日誌、指標、IoT 感測器資料)、推薦引擎、事件記錄。
- **代表產品**: Apache Cassandra, HBase, Google Cloud Bigtable.

---

### 4. 圖形資料庫 (Graph Databases)

- **資料模型**: 將資料儲存為「節點」(Node，代表實體) 和「邊」(Edge，代表節點之間的關係)。節點和邊都可以擁有「屬性」(Property)。
- **運作方式**: 設計用於表示和查詢複雜的關聯。遍歷關聯是主要操作，對於高度連接的資料，這通常比 SQL 中的 JOIN 操作更有效率。
- **為何使用 (優勢)**:
    - **專注於關聯**: 非常擅長管理和查詢具有多對多關係的資料。
    - **直觀模型**: 對於本質上類似圖形的資料 (例如社交網絡、知識圖譜) 非常自然。
    - **複雜 JOIN 的效能**: 快速遍歷關聯，避免了昂貴的 JOIN 操作。
- **常見應用場景**: 社交網絡、推薦引擎 (例如「購買 X 的顧客也購買了 Y」)、詐欺偵測、知識圖譜、網絡/IT 維運。
- **代表產品**: Neo4j, Amazon Neptune, ArangoDB (多模型資料庫).

---

## 常見資料庫介紹

--- 

### PostgreSQL ("Postgres")

- **類型**: 物件關聯式資料庫管理系統 (ORDBMS)，開源。
- **主要優勢**:
    - 強大的 SQL 相容性與 ACID 可靠性。
    - 高度可擴展性 (自訂類型、函數)。
    - 進階功能 (JSONB, PostGIS, MVCC)。
    - 資料完整性和穩定性。
- **適用於**: 複雜查詢、需要高度資料完整性的場景、地理空間資料、當您需要一個功能強大且穩健的 SQL 資料庫時。

---

### PostgreSQL - 運作方式與情境

- **核心機制簡化**:
    - **MVCC (Multi-Version Concurrency Control)**: 每個交易都能看到資料的一個快照。更新操作會建立新的資料列版本，允許多個使用者在最小化鎖定的情況下同時操作。
    - **WAL (Write-Ahead Logging)**: 變更在寫入資料頁之前會先記錄到日誌中，確保資料的持久性並能從崩潰中恢復 (ACID 的重要組成部分)。
- **真實世界情境：金融總帳系統**
    - *為何選擇 Postgres?* 其強大的 ACID 相容性 (透過 MVCC 和 WAL 實現) 對於準確的金融交易至關重要。強大的資料完整性功能強制執行金融規則，其強大的 SQL 引擎能有效處理複雜的審計需求。

---

### MySQL

- **類型**: 關聯式資料庫管理系統 (RDBMS)，開源。
- **主要優勢**:
    - 非常流行，易於使用，擁有龐大的社群支援。
    - 效能良好，尤其適合讀取密集型的負載。
    - 使用 InnoDB 引擎時可靠 (ACID)。
    - 彈性的儲存引擎 (例如 InnoDB, MyISAM)。
    - 成熟的複製 (Replication) 功能，易於擴展。
- **適用於**: 網站後端 (LAMP/LEMP 堆疊)、電子商務、讀取密集型應用、當你需要一個廣泛支援的 SQL 資料庫時。

---

### MySQL - 運作方式與情境

- **核心機制簡化**:
    - **InnoDB 引擎**: 預設引擎，提供 ACID 交易、資料列層級鎖定 (Row-level Locking) 和崩潰恢復功能，是交易型工作負載的理想選擇。
    - **複製 (Source-Replica)**: 來源伺服器的變更會被記錄並應用到複製伺服器，從而實現讀取擴展和高可用性。
- **真實世界情境：高流量電子商務網站**
    - *為何選擇 MySQL?* InnoDB 引擎可靠地處理訂單 (ACID)。複製功能有效處理大量產品瀏覽的讀取請求，擴展網站能力。其易用性和強大的生態系統支援快速的網站開發。
    - *補充考量*: 相較於 PostgreSQL，對 SQL 標準的支援和進階功能較少。過去曾因 Oracle 收購引發社群對其開源前景的擔憂 (但 MariaDB 作為分支持續發展)。

---

### MongoDB

- **類型**: 文件導向 NoSQL 資料庫。
- **主要優勢**:
    - 彈性結構 (JSON/BSON 文件)。
    - 對開發者友善 (與物件模型對應良好)。
    - 水平擴展性 (Sharding)。
    - 高可用性 (Replica Sets)。
- **適用於**: 需求不斷演進的應用程式、內容管理、產品目錄、物聯網 (IoT)、需要彈性資料和可擴展性的情境。

---

### MongoDB - 運作方式與情境

- **核心機制簡化**:
    - **文件模型 (BSON)**: 資料儲存在彈性的、類似 JSON 的 BSON 文件中；非常適合多樣或不斷演進的資料結構。
    - **Sharding**: 將資料集合分散到多個伺服器上，為大型資料集和高吞吐量實現大規模水平擴展。
    - **Replica Sets**: 在多個伺服器上維護資料副本，為高可用性和資料備援提供自動故障轉移。
- **真實世界情境：大型零售商的產品目錄**
    - *為何選擇 MongoDB?* 其彈性的文件模型能輕鬆處理多樣且不斷演進的產品屬性。Sharding 允許目錄擴展到數百萬個品項，而 Replica Sets 確保了關鍵電子商務組件的高可用性。

---

### Redis (Remote Dictionary Server)

- **類型**: 記憶體內鍵值儲存 (具有豐富資料結構)。
- **主要優勢**:
    - 極快 (資料儲存在 RAM 中)。
    - 多樣化的資料結構 (Lists, Sets, Hashes, Sorted Sets)。
    - 原子操作。
    - 輕量且高效。
- **適用於**: 快取、會話管理、即時排行榜、訊息佇列、速率限制。

---

### Redis - 運作方式與情境

- **核心機制簡化**:
    - **記憶體內儲存 (In-Memory Storage)**: 所有資料主要保存在 RAM 中，實現極低的延遲存取 (亞毫秒級)。
    - **豐富資料結構**: 提供優化的內建結構，如 Lists (佇列)、Sets (唯一性)、Sorted Sets (排行榜)、Hashes (物件)，簡化複雜任務。
- **真實世界情境：即時遊戲排行榜**
    - *為何選擇 Redis?* 其記憶體內速度和專用的 Sorted Set 資料結構非常適合即時更新和檢索玩家排名分數。像 `ZINCRBY` 這樣的原子操作確保了分數更新的資料完整性，無需複雜的應用程式邏輯。

---

## 技術選型考量因素

---

### 資料庫選型關鍵因素 (1/2)

- **資料模型與結構**: 您的資料結構化程度如何？需要複雜的關聯 (SQL) 還是彈性的結構 (NoSQL)？
- **效能需求**: 讀寫頻率 (例如，寫入密集的 IoT vs. 讀取密集的部落格)？延遲要求 (例如，即時競價 vs. 批次報告)？
- **擴展性策略**: 預期的資料量和請求負載？需要透過增加更大伺服器 (垂直擴展) 還是更多伺服器 (水平擴展) 來擴展？
- **一致性模型**: 寫入後立即的強一致性 (SQL 的 ACID)，還是資料需要時間傳播的最終一致性 (許多 NoSQL 的 BASE)？

---

### 資料庫選型關鍵因素 (2/2)

- **團隊技能與生態系統**: 您的團隊是否精通該資料庫？社群支援、文件和可用工具是否強大？
- **預算與成本**: 考量授權 (開源 vs. 商業)、基礎設施、營運開銷以及潛在的供應商鎖定。
- **安全性需求**: 對於資料加密 (靜態、傳輸中)、存取控制、稽核和合規性有哪些需求？
- **特定功能需求**: 是否需要全文檢索、地理空間索引 (PostGIS)、圖形遍歷或時間序列優化？

> **混合持久化 (Polyglot Persistence)**：別忘了！現代系統通常會使用*多種*資料庫類型，為每個特定工作選擇最佳工具 (例如，Postgres 用於核心交易，Redis 用於快取，Elasticsearch 用於搜尋)。

---

# 大型科技公司的資料庫擴展

<img src="db-scale-meme.png" alt="資料庫擴展迷因" height="400" />

--- 

## 大型科技公司擴展資料庫的挑戰

- **海量資料**: Petabytes (PB) 到 Exabytes (EB) 的資訊量。
- **極高請求率**: 每秒數百萬次查詢 (QPS)。
- **全球分佈**: 為全球使用者提供低延遲存取。
- **高可用性**: 目標 99.999% 正常運行時間 (接近零停機)。
- **多樣化工作負載**: 交易型、分析型、快取、搜尋、即時資訊流。

> 沒有單一資料庫解決方案能夠同時有效處理所有這些需求！

--- 

## 常見擴展策略 (1/2)

- **讀取複本 (Read Replicas)**:
    - *作法*: 建立主要資料庫的多個唯讀複本。
    - *原因*: 分散讀取查詢，減少寫入主庫的負載。提高讀取吞吐量和可用性。
    - *範例*: MySQL/PostgreSQL 讀取複本。
- **分片 (Sharding / Horizontal Partitioning)**:
    - *作法*: 將大型資料庫分割成較小、獨立的資料庫 (分片)，通常基於分片鍵 (例如，使用者 ID、地理區域)。
    - *原因*: 允許跨多台伺服器分散資料和負載 (讀取/寫入)，實現大規模水平擴展。
    - *範例*: 分片的 MongoDB, Cassandra, Vitess (用於 MySQL)。

--- 

## 常見擴展策略 (2/2)

- **快取層 (例如 Redis, Memcached)**:
    - *作法*: 將頻繁存取的資料儲存在快速的記憶體內快取中，置於較慢的持久性資料庫之前。
    - *原因*: 大幅減少常見查詢的讀取延遲，並顯著減輕後端資料庫的負載。
- **專用資料庫 (混合持久化 Polyglot Persistence)**:
    - *作法*: 針對特定任務/資料模型使用不同優化的資料庫類型。
    - *原因*: 利用每種類型的優勢 (例如，Elasticsearch 用於搜尋，圖形資料庫用於關聯，時間序列資料庫用於指標)。
- **資料反正規化與 CQRS (Command Query Responsibility Segregation)**:
    - *作法*: 預先計算並以優化的讀取格式儲存資料 (反正規化)。分離讀取和寫入路徑 (CQRS)。
    - *原因*: 針對特定查詢模式優化讀取效能，即使犧牲寫入複雜性或一些資料冗餘。

--- 

## 大型科技公司技術堆疊簡化範例：社交媒體平台

- **使用者設定檔與驗證**: 分片的 SQL (例如，Postgres/MySQL 搭配 Vitess) 或文件資料庫 (MongoDB) 以求彈性。
- **貼文/推文 (高流量寫入)**: 列式家族儲存 (例如 Cassandra, HBase) 或專用的時間序列資料庫。
- **社交圖譜 (追蹤、好友)**: 圖形資料庫 (例如 Neo4j, Amazon Neptune)。
- **動態消息/時間軸**: 通常是組合——Redis 用於最近/熱門項目，並從其他來源進行批次聚合。
- **快取層 (極其重要！)**: 廣泛使用 Redis 或 Memcached 於使用者會話、設定檔、動態消息項目等。
- **搜尋**: Elasticsearch 或 Apache Solr。
- **分析與資料倉儲**: 如 Apache Spark, Presto, Snowflake, 或 BigQuery 等系統，處理來自事件流 (例如 Kafka) 和主要資料庫的資料。

> **重點整理**: 大型科技公司依賴*多種*擴展策略和多樣化的專用資料庫組合，以滿足特定的服務需求。

---

# OpenAPI (Swagger)

<img src="openapi-meme.png" alt="OpenAPI 迷因" height="450" />

--- 

## OpenAPI 是什麼 & 為何使用它？

- **OpenAPI 規範 (OAS) 是什麼？**
    - 一種描述、設計、記錄和測試 RESTful APIs 的標準化、與語言無關的方式。
    - 使人類和機器都能在沒有原始碼存取權限的情況下理解 API 的功能。
    - *Swagger* 是指圍繞 OAS 建構的一套流行工具。

- **使用 OpenAPI 的主要好處**:
    - **標準化與清晰度**: 提供一致的 API「契約」，減少溝通不良。
    - **自動化**: 驅動客戶端 SDKs、伺服器端 Stubs 和互動式文件 (例如 Swagger UI) 的自動產生。
    - **改善協作**: 前後端團隊可以基於共享的 API 設計並行工作。
    - **設計優先方法 (Design-First Approach)**: 鼓勵在編寫程式碼之前定義和審查 API，從而產生更好的設計。

---

## OpenAPI 文件 - 核心結構 (1/2)

- **`openapi: 3.x.x`**: 指定 OpenAPI 規範版本 (例如 `3.0.3`)。
- **`info`**: 提供有關 API 的元數據。
    - 包含 `title` (標題)、`version` (版本)、`description` (描述)。
- **`servers`**: 伺服器物件陣列，定義 API 主機。
    - 每個伺服器都有一個 `url` (例如 `https://api.example.com/v1`)。
- **`paths`**: 定義可用的 API 端點 (例如 `/users`、`/products/{id}`)。
    - 每個路徑包含 HTTP 方法物件 (例如 `get`、`post`、`put`、`delete`)。
    - 一個操作通常定義：`summary` (摘要)、`operationId` (操作ID)、`tags` (標籤)、`parameters` (參數：路徑、查詢、標頭、cookie)、`requestBody` (請求主體結構) 和 `responses` (預期 HTTP 回應)。

---

## OpenAPI 文件核心組成 (續)

- **`components`**: 可重用的物件定義。
    - **`schemas`**: 資料模型定義 (請求和回應的資料結構)。
    - **`parameters`**: 可重用的參數定義。
    - **`responses`**: 可重用的回應定義。
    - **`securitySchemes`**: 安全性機制定義 (例如 API Key, OAuth2)。
- **`security`**: 全局或特定操作的安全要求。
- **`tags`**: API 操作的分組標籤。

--- 

### OpenAPI 範例 (簡化的 Todo API)

```yaml
# openapi.yaml (簡化範例)
openapi: 3.0.0
info:
  title: Simple Todo API
  version: v1.0.0
  description: A simple API to manage todo items

servers:
  - url: http://localhost:5000/api

components:
  schemas:
    Todo:
      type: object
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        title:
          type: string
        isCompleted:
          type: boolean
          default: false
    NewTodo:
      type: object
      required:
        - title
      properties:
        title:
          type: string

paths:
  /todos:
    get:
      summary: List all todos
      operationId: listTodos
      responses:
        '200':
          description: A list of todos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Todo'
    post:
      summary: Create a new todo
      operationId: createTodo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewTodo'
      responses:
        '201':
          description: Todo created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'

  /todos/{todoId}:
    get:
      summary: Get a todo by ID
      operationId: getTodoById
      parameters:
        - name: todoId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: A single todo item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'
        '404':
          description: Todo not found
```

--- 

## OpenAPI / Swagger 工具

- **Swagger Editor**: 
    - 基於瀏覽器的編輯器，可撰寫 OpenAPI 文件。
    - 即時驗證和預覽。
    - [editor.swagger.io](https://editor.swagger.io/)
- **Swagger UI**: 
    - 將 OpenAPI 文件轉換為互動式的 API 文件頁面。
    - 允許使用者直接在瀏覽器中測試 API。
    - 可整合到現有應用程式中。
- **Swagger Codegen / OpenAPI Generator**: 
    - 根據 OpenAPI 文件自動產生伺服器端程式碼 (Stubs) 和客戶端 SDK。
    - 支援多種程式語言和框架。
- **Postman / Insomnia**: 
    - API 測試工具，可以匯入 OpenAPI 文件來產生請求集合。

---

## 現代化 API 開發流程 (Design-First)

1.  **定義需求 (Define)**: 與產品、設計團隊討論 API 需求。
2.  **設計 API (Design)**: 使用 OpenAPI 撰寫 API 契約 (Contract)。
    - 專注於資源、路徑、方法、參數、請求/回應模型。
    - 使用 Swagger Editor 或類似工具。
3.  **審查與回饋 (Review & Feedback)**: 
    - 團隊成員 (前後端、QA) 審查 API 設計。
    - 使用 Swagger UI 進行初步視覺化和討論。
4.  **實作 (Implement)**: 
    - 前後端並行開發，基於已確定的 API 契約。
    - 可使用 Codegen 產生初始程式碼。
5.  **測試 (Test)**: 
    - 撰寫單元測試、整合測試、合約測試 (Contract Testing)。
    - 使用 Postman/Insomnia 或基於 OpenAPI 的自動化測試工具。
6.  **部署與監控 (Deploy & Monitor)**: 
    - 部署 API，並持續監控其效能和使用情況。

---

# 感謝大家聆聽！

- 有任何問題或建議，歡迎隨時提出。

---