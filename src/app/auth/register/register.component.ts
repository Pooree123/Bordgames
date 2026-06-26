import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service'; // 1. อย่าลืม Import AlertService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService); // 2. แก้ไขเป็นการ Inject เข้ามาใช้งานแทน

  // ตัวแปรเก็บค่าจากฟอร์ม
  registerData = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit() {
    if (!this.registerData.username || !this.registerData.password) {
      this.alertService.warning('กรุณากรอกข้อมูลให้ครบถ้วน'); // แจ้งเตือนสีเหลือง
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.alertService.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'); // แจ้งเตือนสีแดง
      return;
    }

    const payload = {
      username: this.registerData.username,
      password: this.registerData.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.alertService.success('สร้างบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ'); // แจ้งเตือนสีเขียว
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.alertService.error('เกิดข้อผิดพลาด หรือมีชื่อผู้ใช้งานนี้อยู่ในระบบแล้ว');
      }
    });
  }
}