import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import { Carditem, CompanyType, CardData } from "../types/card";
import {dataFormat} from "../utils/dataFormat.js";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Carditem>();
  const [viewCompanies, setViewCompanies] = useState<Carditem>();
  const [view, setView] = useState("card");
  const [companyTypeView, setCompanyTypeView] = useState("all");
  const companyType = [["inHouse&contracted", "自社/受託"], ["inHouse", "自社"], ["contracted", "受託"], ["unknown", "該当なし"]];
  


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/scrapeData.json");
      const data = await res.json();
      setCompanies(data);
    };
    fetchData();
  }, []);
  
    useEffect(() => {
      if (companies) {
        setViewCompanies(companies);
      }
    }, [companies]);
  
  const companyTypeFilter = (companyType: string) => {
    if (!companies) return [];
    // if (companyType === "all") return companies;
    
    const filteredData = companies.data.filter(item => item.companyType === companyType);
    return setViewCompanies({
      ...companies, // lastUpdated など他の情報も残す
      data: filteredData,
    });
  };
  
  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow z-50">
        <h1 className="text-3xl font-bold text-center py-6">自社開発企業 一覧</h1>
        <div className="flex items-end mb-4">
          {/* 更新日を表示 */}
          <div className="block p-4 mx-4 rounded border bg-yellow-100">更新日:{dataFormat(viewCompanies?.lastUpdated || "")}</div>
          {/* 表示切り替えボタン */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("card")}
              className={`px-4 py-2 rounded ${
                view === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              カード表示
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded ${
                view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              リスト表示
            </button>
          </div>
          {/* 会社タイプ切り替えボタン */}
          <div className="flex gap-2 ml-4  px-4 py-2 bg-gray-200 rounded">
            {companyType.map((type) => (
              <button className={`block rounded ${companyTypeView == "inHouse"} ? "bg-blue-500 text-white" : bg-gray-200`}
                onClick={() => {
                  companyTypeFilter(type[0]);
                  setCompanyTypeView(type[1]);
                }
              }
              >{type[1]}</button>
            ))}
            </div>
        </div>
      </header>

      {/* カード形式に表示 */}
      {view === "card" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4" style={{ paddingTop: "174px" }}>
        {viewCompanies?.data.map((company, idx) => (
          <div key={idx} className="border rounded-xl shadow-md p-4 hover:bg-gray-200 transition">
            <img src={company.topImagePic} alt={company.title} className="rounded-md w-full h-48 object-cover mb-2" />
            <h2 className="text-xl font-bold">{company.title}</h2>
            <p className="text-gray-600">{company.companyName}</p>
            <p className={`mt-1 font-semibold ${company.sesFlag ? 'text-red-500' : 'text-green-600'}`}>
              {company.sesFlag ? "SESっぽい" : "自社開発っぽい"}
            </p>
            <p className="">{company.companyType}</p>
            <a
              href={company.wantedlyUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-500 hover:underline"
            >
              詳細を見る
            </a>
          </div>
        ))}
      </div>
      ) : (
        // リスト形式に表示
        <>
          <div className="gap-4 p-4" style={{ paddingTop: "174px" }}>
            {viewCompanies?.data.map((company, idx) => (
              <a href={company.wantedlyUrl!} target="_blank" rel="noopener noreferrer" className="">
                <div key={idx} className="flex items-start border rounded-xl shadow-md p-4 mb-2 block hover:bg-gray-200 transition">
                  <img src={company.topImagePic} alt={company.title} className="rounded-md w-16 h-16 object-cover"/>
                  <div className="p-2 pt-0">
                    <p className="text-gray-600">{company.companyName}</p>
                    <p className="ext-gray-600">{company.title}</p>
                    <p className="">{company.companyType}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>

      )}
    </>
  );
};

