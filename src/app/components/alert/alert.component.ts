// src/app/components/alert/alert.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.css']
})
export class AlertComponent {
  public alertService = inject(AlertService);

  // กำหนดสี/ไอคอน ตามประเภทของ Alert
  getAlertClass(type: string): string {
    switch (type) {
      case 'success': return 'border-success text-success';
      case 'error': return 'border-danger text-danger';
      case 'warning': return 'border-warning text-warning';
      default: return 'border-info text-info';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}