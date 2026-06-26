import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule, FormsModule, RouterModule], // ต้องเพิ่ม RouterLink ใน imports
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService); // 2. Inject เข้ามา

  loginData = { username: '', password: '' };

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        // 3. ใช้ alertService.success แทน alert()
        this.alertService.success(`ยินดีต้อนรับกลับมาครับ ${this.loginData.username}! 🎲`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        // 3. ใช้ alertService.error แทน alert()
        this.alertService.error('รหัสผ่านไม่ถูกต้อง หรือไม่มีชื่อผู้ใช้นี้');
      }
    });
  }
}
