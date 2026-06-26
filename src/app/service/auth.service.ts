// src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { NotificationService } from './notification.service'; // 1. เพิ่ม Import NotificationService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService); // 2. Inject เข้ามาใช้งาน
  
  private apiUrl = 'https://influenced-wales-lexington-compaq.trycloudflare.com/api/Auth';

  // ดึงชื่อจาก LocalStorage ตรงๆ แทนการแกะ Token
  currentUser = signal<string | null>(localStorage.getItem('username'));

  // 3. เพิ่ม Constructor เพื่อต่อ Socket ใหม่อัตโนมัติเวลาผู้ใช้กด F5 (รีเฟรชหน้าเว็บ)
  constructor() {
    if (localStorage.getItem('token')) {
      this.notificationService.startConnection();
    }
  }

  login(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          // เก็บทั้ง Token และ Username ตรงๆ
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', credentials.username); 
          
          this.currentUser.set(credentials.username); // อัปเดต Signal ให้ Navbar เปลี่ยน

          // 4. สั่งเชื่อมต่อ Socket ทันทีที่ Login สำเร็จ
          this.notificationService.startConnection();
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // เคลียร์ชื่อทิ้งด้วย
    this.currentUser.set(null);
    
    // 5. สั่งตัดการเชื่อมต่อ Socket ทันทีที่ Logout เพื่อไม่ให้แจ้งเตือนเด้งผิดเครื่อง
    this.notificationService.stopConnection();
    
    this.router.navigate(['/']);
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ฟังก์ชันช่วยแกะ Token เพื่อเอาชื่อ Username ออกมา (เก็บไว้เผื่อใช้ในอนาคตได้)
  private getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedJson = atob(payload);
      const decoded = JSON.parse(decodedJson);
      
      // .NET มักจะเก็บชื่อไว้ใน claim ที่ชื่อยาวๆ แบบนี้ หรือ 'unique_name' / 'name'
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] 
          || decoded.unique_name 
          || decoded.name 
          || 'Player';
    } catch (e) {
      return null;
    }
  }
}