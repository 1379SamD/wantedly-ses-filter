import React from "react";
import { CompanyList } from "./components/CompanyList";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center py-6">自社開発企業 一覧</h1>
        <CompanyList />
      </div>
    </>
  );
}

export default App;
