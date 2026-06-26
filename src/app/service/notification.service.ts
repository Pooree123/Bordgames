import { Injectable, signal, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AlertService } from './alert.service';
import { Subject } from 'rxjs'; // 1. Import Subject

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection | undefined;
  private alertService = inject(AlertService);

  public unreadRequestsCount = signal<number>(0);

  // 2. สร้างตัวกระจายสัญญาณ (Event Emitters)
  public onNewRequest = new Subject<void>();
  public onFriendAccepted = new Subject<void>();

  public startConnection() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7244/hubs/social', { 
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ Real-time connection started'))
      .catch(err => console.log('❌ Error while starting connection: ' + err));

    // ดักฟัง: เมื่อมีคนแอดมา
    this.hubConnection.on('ReceiveFriendRequest', (senderName: string) => {
      this.alertService.info(`🔔 ${senderName} ส่งคำขอเป็นเพื่อนถึงคุณ!`);
      this.unreadRequestsCount.update(count => count + 1);
      
      this.onNewRequest.next(); // สั่งให้ UI รีเฟรชรายชื่อคำขอเพื่อน
    });

    // ดักฟัง: เมื่อเพื่อนรับแอดเราแล้ว
    this.hubConnection.on('FriendRequestAccepted', (accepterName: string) => {
      this.alertService.success(`🎉 ${accepterName} รับแอดคุณแล้ว!`);
      
      this.onFriendAccepted.next(); // สั่งให้ UI รีเฟรชรายชื่อเพื่อน
    });
  }

  public stopConnection() {
    this.hubConnection?.stop();
  }
}