export type CardData = {
  title: string;
  companyName: string;
  topImagePic: string;
  wantedlyUrl: string | null;
  companyType: "自社/受託" | "自社" | "受託" | "該当なし";
  sesFlag?:boolean;
};

export type Carditem = {
  lastUpdated: string;
  data: CardData[];
};

export type CompanyType = ["inHouse&contracted" | "inHouse" | "contracted" | "unknown"];