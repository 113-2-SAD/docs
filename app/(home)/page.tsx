import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto py-20">
      <h1 className="mb-4 text-4xl font-bold">系統設計與分析 SAD 113-2</h1>
      <h2 className="mb-8 text-2xl text-fd-muted-foreground">
        三週助教資訊系統開發課程
      </h2>

      <p className="text-lg mb-8 max-w-2xl">
        歡迎加入這三週的實戰開發課程！接下來的幾堂課中，我們會一步步帶你從基礎到進階，體驗團隊協作、版本控制、自動化測試、Docker
        容器化、雲端部署、資料庫選型。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-2xl">
        <div className="border rounded-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">課程大綱</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>資訊系統基礎開發流程實作</li>
            <li>雲端原生部署</li>
            <li>資料庫選型與實作</li>
            <li>API 設計與 OpenAPI</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">你將帶走什麼？</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>從安裝環境到最終部署都親手操作經驗 </li>
            <li>DevOps 與 CI/CD 思維</li>
            <li>自動化測試、Docker 容器化、版控與雲端部署</li>
            <li>在真實專案中撰寫 OpenAPI 文件</li>
          </ul>
        </div>
      </div>

      <Link
        href="/docs"
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        查看課程文件
      </Link>
    </main>
  );
}
