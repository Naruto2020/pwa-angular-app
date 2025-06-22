export interface Notif {
  _id?: string;
  type?: string;
  userId?: string;
  message?: string;
  data?: Record<string, any>;
  isRead: 'oui' | 'non';
  createdAt?: Date;
}
