export type CardData = {
  title: string;
  companyName: string;
  topImagePic: string;
  wantedlyUrl: string | null;
  companyType: "inHouse&contracted" | "inHouse" | "contracted" | "unknown";
  sesFlag?:boolean;
};

export type Carditem = {
  lastUpdated: string;
  data: CardData[];
};

export type CompanyType = ["inHouse&contracted" | "inHouse" | "contracted" | "unknown"];