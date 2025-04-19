import React from "react";
import { CompanyList } from "./components/CompanyList";

function App() {
  return (
    <>
      <div className="bg-red-100 p-4">
        <h1 className="text-2xl font-bold text-blue-600">Hello Tailwind!</h1>
      </div>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center py-6">自社開発企業 一覧</h1>
        <CompanyList />
      </div>
    </>
  );
}

export default App;
