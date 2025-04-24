import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import { Carditem, CompanyType, CardData } from "../types/card";
import {dataFormat} from "../utils/dataFormat.js";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Carditem>();
  const [viewCompanies, setViewCompanies] = useState<Carditem>();
  const [view, setView] = useState("card");
  const [companyTypeView, setCompanyTypeView] = useState("全て");
  const companyType = ["全て", "自社/受託", "自社", "受託", "該当なし"];
  
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
    if (companyType == "全て") {
      return setViewCompanies(companies)
    };
    
    const filteredData = companies.data.filter(item => item.companyType === companyType);
    return setViewCompanies({
      ...companies, // lastUpdated など他の情報も残す
      data: filteredData,
    });
  };
  
  return (
    <div className="text-base sm:text-base md:text-base lg:text-base">
      <header className="fixed top-0 w-full bg-white shadow z-50">
        <div className="relative">
          <h1 className="font-bold text-center py-3 sm:py-6 sm:text-xl md:text-3xl font-sans">Filterly</h1>
          {/* 更新日を表示 */}
          <div className="absolute top-1 left-1 p-1 leading-none sm:top-4 sm:left-4 sm:block sm:border sm:border-gray-300 sm:shadow-md sm:rounded-l-full sm:rounded-r-full sm:p-3 shadow-none border-none text-[9px] sm:text-xs md:text-base lg:text-base">
            更新日:{dataFormat(viewCompanies?.lastUpdated || "")}
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-end gap-2 mb-4 w-full text-[8px] leading-none sm:text-sm md:text-base lg:text-base">
          {/* 表示切り替えボタン */}
          <div className="flex gap-2 p-2 rounded border">
          <button
            onClick={() => setView("card")}
            className={`inline-block whitespace-nowrap px-2 py-2 rounded box-border ${
              view === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
            } sm:px-4 sm:py-2`}
          >
            カード
          </button>
          <button
            onClick={() => setView("list")}
            className={`inline-block whitespace-nowrap px-2 py-2 rounded box-border ${
              view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
            } sm:px-4 sm:py-2`}
          >
            リスト
          </button>
          </div>
          {/* 会社タイプ切り替えボタン */}
          <div className="flex flex-wrap gap-2 p-2 rounded border ml-0 sm:ml-4">
            {companyType.map((type) => (
              <button
                key={type}
                className={`inline-block whitespace-nowrap px-2 py-2 rounded box-border ${
                  companyTypeView === type ? "bg-blue-500 text-white" : "bg-gray-200"
                } sm:px-4 sm:py-2`}
                onClick={() => {
                  companyTypeFilter(type);
                  setCompanyTypeView(type);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* カード形式に表示 */}
      {view === "card" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pt-[122px] sm:pt-[166px] md:pt-[174px]">
        {viewCompanies?.data.map((company, idx) => (
          <div key={idx} className="border rounded-xl shadow-md p-4 hover:bg-gray-200 transition">
            <img src={company.topImagePic} alt={company.title} className="rounded-md w-full h-48 object-cover mb-2" />
            <h2 className="font-bold">{company.title}</h2>
            <p className="text-gray-600">{company.companyName}</p>
            {/* <p className={`mt-1 font-semibold ${company.sesFlag ? 'text-red-500' : 'text-green-600'}`}>
              {company.sesFlag ? "SESっぽい" : "自社開発っぽい"}
            </p> */}
            <p className={`block w-fit px-2 py-1 text-xs rounded mt-1
              ${company.companyType === "自社" ? 'bg-sky-500 text-white' :
                company.companyType === "受託" ? 'bg-yellow-500 text-white' :
                company.companyType === "自社/受託" ? 'bg-green-500 text-white' :
                company.companyType === "該当なし" ? 'bg-gray-500 text-white' :
                'bg-gray-200 text-gray-800'
              }
            `}>{company.companyType}</p>
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
          <div className="gap-4 p-4 pt-[122px] sm:pt-[166px] md:pt-[174px]">
            {viewCompanies?.data.map((company, idx) => (
              <a href={company.wantedlyUrl!} target="_blank" rel="noopener noreferrer" className="">
                <div key={idx} className="flex items-center border rounded-xl shadow-md px-2 mb-2 block hover:bg-gray-200 transition">
                  <img src={company.topImagePic} alt={company.title} className="rounded-md w-14 h-14 object-cover sm:w-16 sm:h-16"/>
                  <div className="p-1 pl-3 justify-center">
                    <p className="text-xs sm:text-gray-600">{company.companyName}</p>
                    <p className="text-xs sm:text-gray-600">{company.title}</p>
                    <p className={`block w-fit px-2 py-1 text-xs rounded mt-1
                      ${company.companyType === "自社" ? 'bg-sky-500 text-white' :
                        company.companyType === "受託" ? 'bg-yellow-500 text-white' :
                        company.companyType === "自社/受託" ? 'bg-green-500 text-white' :
                        company.companyType === "該当なし" ? 'bg-gray-500 text-white' :
                        'bg-gray-200 text-gray-800'
                      }
            `}>{company.companyType}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>

      )}
    </div>
  );
};

