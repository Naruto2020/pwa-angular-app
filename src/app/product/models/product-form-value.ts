export class ProductFormValue {
    primaryProductInfo!: {
        name: string;
        serialNumber?: string;
        companieName: string
        city: string,
        companieId: string,
    };
    isFashion!: string;
    isAlreadyUse!: string;
    oui?: string;
    non?: string;
    secondaryProductInfo!: {
        owner: string,
        expiryDate: string,
        productPhoto: string,
        usedBy: string,
    };

    quantity!: number;
}