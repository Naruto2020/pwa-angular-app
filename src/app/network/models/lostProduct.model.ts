export enum LostProductStatus {
  PENDING = 'pending',   // Produit signalé perdu ou volé
  RESOLVED = 'resolved', // Produit retrouvé et validé
  CLOSED = 'closed',     // Dossier archivé/clôturé
}

export class 
LostProduct {
  _id?: string;
  brand?: string;
  ownerName?: string;
  serialNumber?: string;
  serialNumberShort?:string;
  productImageUrl?: string;
  productModel?: string;
  authenticator?: string;
  lossDate?: boolean;
  lossCity?: string;
  lossCountry?: string;
  insured?: string;
  complaintFiled?: string;
  status?: LostProductStatus;
  foundByUser?: string;
  foundDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}