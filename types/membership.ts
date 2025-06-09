export interface Membership {
  id: string;
  name: string;
  email: string;
  joinDate: Date | string;
  type: string;
  needsPhysicalCard: boolean;
  cardStatus: string;
  lockRequested: boolean;
  expDate:Date
  balance:number;
  qrcode:string;
}