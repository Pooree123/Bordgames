import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7244/api/Social'; // เปลี่ยนพอร์ตให้ตรงกับ Backend ของคุณ

  // 1. GET /api/Social/search?query=...
  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${query}`);
  }

  // 2. POST /api/Social/request/{targetUserId}
  sendFriendRequest(targetUserId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request/${targetUserId}`, {});
  }

  // 3. GET /api/Social/requests/pending
  getPendingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requests/pending`);
  }

  // 4. PUT /api/Social/accept/{targetUserId}
  acceptFriendRequest(targetUserId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${targetUserId}`, {});
  }

  // 5. GET /api/Social/friends
  getFriends(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/friends`);
  }
}