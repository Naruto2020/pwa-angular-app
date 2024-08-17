export class ProductFormValue {
    primaryProductInfo!: {
        name: string;
        companieName: string
        companieId: string,
    };
    isFashion!: string;
    isAlreadyUse!: string;
    oui?: string;
    non?: string;
    secondaryProductInfo!: {
        owner: string,
        expiryDate: string
        productPhoto: string
    };

    quantity!: number;
}