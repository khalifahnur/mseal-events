export interface Merchandise {
    _id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
  }
  
  export interface MerchResponse {
    message: string;
    merchandise?: Merchandise;
  }
  
  export interface ErrorResponse {
    message: string;
    statusCode?: number;
    details?: any;
  }

  export interface DeleteMerchandise {
    itemId: string;
  }

  export interface EditMutationVariables {
    updatedItem: Merchandise;
    itemId:string;
  }