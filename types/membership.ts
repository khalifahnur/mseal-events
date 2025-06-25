export interface Membership {
  id: string;
  name: string;
  email: string;
  joinDate: string | null;
  type: string;
  needsPhysicalCard: boolean;
  cardStatus: string;
  lockRequested: boolean;
  expDate:string | null;
  balance:number;
  qrcode:string;
  ecryptWalletId:string;
  membershipTier: string| null,
  cardNumber:string | null;

}