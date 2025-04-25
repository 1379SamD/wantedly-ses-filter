import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import { Carditem, CompanyType, CardData } from "../types/card";
import {dataFormat} from "../utils/dataFormat.js";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { HiOutlineExclamation } from 'react-icons/hi'; // Heroiconsの警告アイコン

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Carditem>();
  const [viewCompanies, setViewCompanies] = useState<Carditem>();
  const [view, setView] = useState("card");
  const [companyTypeView, setCompanyTypeView] = useState("全て");
  const companyType = ["全て", "自社/受託", "自社", "受託", "該当なし"];
  const [open, setOpen] = useState(false);
  
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
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-center pt-3 sm:pt-6 text-xl md:text-3xl font-sans">Filterly</h1>
            <p className="text-[10px] leading-normal mb-1 md:text-sm">Wantedlyから自社・受託企業をスマートに探せるWebツール</p>
          </div>
          {/* 更新日を表示 */}
          <div className="absolute top-1 left-1 p-1 leading-none sm:top-4 sm:left-4 sm:block sm:border sm:border-gray-300 sm:shadow-md sm:rounded-l-full sm:rounded-r-full sm:p-3 shadow-none border-none text-[9px] sm:text-xs md:text-base lg:text-base">
            更新日:{dataFormat(viewCompanies?.lastUpdated || "")}
          </div>
          <div className="items-center space-x-2 absolute top-2 right-2 sm:top-4 sm:right-4">
            <button onClick={() => setOpen(true)}>
              <InformationCircleIcon className="h-6 w-6 sm:w-8 sm:h-8 text-blue-500"/>
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-lg font-bold mb-1">このアプリについて</h2>
              <p className="text-sm text-gray-600 mb-2">
                Wantedlyから自社・受託企業を効率的に探せるフィルターツールです。
              </p>
              <h3 className="text-sm font-bold mb-1">フィルター機能について</h3>
              <p className="text-sm text-gray-600 mb-2">
                除外キーワード：<br/>
              「客先」「常駐」「派遣」「開発支援」「エンジニア支援」「SES」「ses」「配属先」「準委任契約」「クライアント先」「プロジェクト参画」「現場で活躍中！」「プロジェクト先」
              </p>
              <h3 className="text-sm font-bold mb-1">タグ機能について</h3>
              <p className="text-sm text-gray-600 mb-5">
                「全て」「自社/受託」「自社」「受託」「該当なし」でフィルター可能。<br />
                ※該当なしについては上記のワードがヒットなし。
              </p>
              <div className="flex items-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                <HiOutlineExclamation className="w-8 h-8 mr-2" />
                <span className="text-sm">キーワードで除外していますが、正しいかどうかは自分で最終確認してください。</span>
              </div>
              
              <button
                onClick={() => setOpen(false)}
                className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-center items-end gap-2 mb-2 sm:mb-4 sm:mt-3 w-full text-[8px] leading-none sm:text-sm md:text-base lg:text-base">
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
      <div className="grid grid-cols-1 gap-y-2 sm:gap-y-4 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 sm:p-4 pt-[117px] sm:pt-[169px] md:pt-[186px]">
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
          <div className="gap-4 p-2 sm:p-4 pt-[117px] sm:pt-[169px] md:pt-[186px]">
            {viewCompanies?.data.map((company, idx) => (
              <a href={company.wantedlyUrl!} target="_blank" rel="noopener noreferrer" className="">
                <div key={idx} className="flex items-center border rounded-xl shadow-md px-2 sm:py-2 sm:mb-4 mb-2 block hover:bg-gray-200 transition">
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

