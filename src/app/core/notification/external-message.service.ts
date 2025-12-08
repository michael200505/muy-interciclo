import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExternalMessageService {
  /** Simula envío por email (solo consola + alert opcional). */
  simulateEmail(to: string, subject: string, body: string) {
    console.log('📧 [SIMULACIÓN EMAIL]');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
  }

  /** Abre WhatsApp Web con el texto precargado. phone en formato internacional: 5939xxxxxxx */
  openWhatsApp(phoneInternational: string, message: string) {
    const phone = (phoneInternational || '').replace(/[^\d]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  /** Copia texto al portapapeles */
  async copy(text: string) {
    await navigator.clipboard.writeText(text);
  }
}
