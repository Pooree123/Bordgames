import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router'; // เพิ่มตรงนี้
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule, RouterModule], // ต้องเพิ่ม RouterLink ใน imports
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // สร้างตัวแปรมารับ Service เพื่อนำไปใช้ใน HTML
  public authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}