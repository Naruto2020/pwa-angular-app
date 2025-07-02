export class Notification {
    _id!: string
    userId!: string;
    type!: string;
    message!: string;
    data!: {
        productId: string;
        productOwnerId: string;
    };
    status!: string;
    isRead!: string;
    createdAt?: string
}