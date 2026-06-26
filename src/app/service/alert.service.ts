// src/app/services/alert.service.ts
import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  id: number;
  type: AlertType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // ใช้ Signal เก็บ Array ของการแจ้งเตือน
  alerts = signal<AlertMessage[]>([]);
  private idCounter = 0;

  // ฟังก์ชันหลักสำหรับเรียกใช้
  show(message: string, type: AlertType = 'info', duration: number = 3000) {
    const id = this.idCounter++;
    const newAlert: AlertMessage = { id, type, message };

    // เพิ่ม Alert ใหม่เข้าไปใน Signal
    this.alerts.update(currentAlerts => [...currentAlerts, newAlert]);

    // ตั้งเวลาให้หายไปเอง
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  // ตัวช่วยให้เรียกใช้ง่ายขึ้น
  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error', 4000); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string) { this.show(message, 'info'); }

  // ฟังก์ชันลบ Alert ออก
  remove(id: number) {
    this.alerts.update(currentAlerts => currentAlerts.filter(a => a.id !== id));
  }
}