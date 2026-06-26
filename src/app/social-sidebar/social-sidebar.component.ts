import { Component, inject, OnInit, effect } from '@angular/core'; // 1. Import effect
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../service/alert.service';
import { NotificationService } from '../service/notification.service';
import { SocialService } from '../service/social.service';
import { AuthService } from '../service/auth.service'; // 2. Import AuthService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-social-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social-sidebar.component.html',
  styleUrls: ['./social-sidebar.component.css']
})
export class SocialSidebarComponent implements OnInit {
  private socialService = inject(SocialService);
  public notificationService = inject(NotificationService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService); // 3. Inject AuthService

  searchQuery = '';
  
  // เก็บข้อมูลจริงจาก API
  friendsList: any[] = [];
  pendingRequests: any[] = [];
  searchResults: any[] = [];

  private requestSub!: Subscription;
  private friendSub!: Subscription;
  
  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadFriends();
        this.loadPendingRequests();
      } else {
        this.friendsList = [];
        this.pendingRequests = [];
        this.searchResults = [];
        this.searchQuery = '';
      }
    });
  }

  ngOnInit() {
    // ดักฟัง! เมื่อมี Socket แจ้งเตือนคนแอดมา ให้โหลดรายการคำขอใหม่แบบเงียบๆ (ไม่ต้อง F5)
    this.requestSub = this.notificationService.onNewRequest.subscribe(() => {
      this.loadPendingRequests();
    });

    // ดักฟัง! เมื่อมี Socket แจ้งเตือนว่ารับแอด ให้โหลดรายชื่อเพื่อนใหม่
    this.friendSub = this.notificationService.onFriendAccepted.subscribe(() => {
      this.loadFriends();
    });
  }

  ngOnDestroy() {
    // คืนค่าหน่วยความจำตอนปิดหน้าต่าง (Good Practice)
    if (this.requestSub) this.requestSub.unsubscribe();
    if (this.friendSub) this.friendSub.unsubscribe();
  }

  loadFriends() {
    this.socialService.getFriends().subscribe({
      next: (data) => this.friendsList = data,
      error: (err) => console.error('Load friends error:', err)
    });
  }

  loadPendingRequests() {
    this.socialService.getPendingRequests().subscribe({
      next: (data) => {
        this.pendingRequests = data;
        this.notificationService.unreadRequestsCount.set(0); 
      },
      error: (err) => console.error('Load requests error:', err)
    });
  }

  searchFriend() {
    if (!this.searchQuery) return;
    this.socialService.searchUsers(this.searchQuery).subscribe({
      next: (data) => {
        this.searchResults = data;
        if (data.length === 0) this.alertService.info('ไม่พบผู้ใช้งานนี้');
      },
      error: (err) => console.error(err)
    });
  }

  addFriend(targetId: string) {
    this.socialService.sendFriendRequest(targetId).subscribe({
      next: () => {
        this.alertService.success('ส่งคำขอเป็นเพื่อนแล้ว!');
        this.searchResults = this.searchResults.filter(u => u.userId !== targetId); 
      },
      error: (err) => this.alertService.error('ส่งคำขอไม่สำเร็จ หรือคุณเคยส่งไปแล้ว')
    });
  }

  acceptRequest(targetId: string) {
    this.socialService.acceptFriendRequest(targetId).subscribe({
      next: () => {
        this.alertService.success('รับแอดเพื่อนสำเร็จ!');
        this.loadPendingRequests(); 
        this.loadFriends(); 
      },
      error: (err) => this.alertService.error('เกิดข้อผิดพลาด')
    });
  }

  rejectRequest(targetId: string) {
    this.pendingRequests = this.pendingRequests.filter(req => req.senderId !== targetId);
    this.alertService.info('ปฏิเสธคำขอเพื่อนแล้ว');
  }
}