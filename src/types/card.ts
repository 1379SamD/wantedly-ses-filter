export type CardData = {
  title: string;
  companyName: string;
  topImagePic: string;
  wantedlyUrl: string | null;
  sesFlag?:boolean;
};

export type Carditem = {
  lastUpdated: string;
  data: CardData[];
};