import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Notification } from '../notifications/components/model/notification-model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) {}

  displayAllNotifications(){
    console.log('getNotifications =======>AAAAA: ');
    return this.http.get<Notification[]>('http://127.0.0.1:8002/teko/gateway-notifications/notifications').pipe(
      map((notifications: Notification[]) => notifications),
      catchError(() => of(null))
    );
  }
}
