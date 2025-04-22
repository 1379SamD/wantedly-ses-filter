import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";

type Company = {
  title: string;
  companyName: string;
  topImagePic: string;
  wantedlyUrl: string;
  sesFlag: boolean;
};

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/scrapeData.json");
      const data = await res.json();
      setCompanies(data);
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {companies.map((company, idx) => (
        <div key={idx} className="border rounded-xl shadow-md p-4">
          <img src={company.topImagePic} alt={company.title} className="rounded-md w-full h-48 object-cover mb-2" />
          <h2 className="text-xl font-bold">{company.title}</h2>
          <p className="text-gray-600">{company.companyName}</p>
          <p className={`mt-1 font-semibold ${company.sesFlag ? 'text-red-500' : 'text-green-600'}`}>
            {company.sesFlag ? "SESっぽい" : "自社開発っぽい"}
          </p>
          <a
            href={company.wantedlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-500 hover:underline"
          >
            詳細を見る
          </a>
        </div>
      ))}
    </div>
  );
};

