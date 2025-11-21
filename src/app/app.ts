import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly whatsappNumber = '5581992999282';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-stagger', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
    });

    gsap.utils.toArray<HTMLElement>('.section-fade').forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      });
    });
  }

  openWhatsAppQuick(): void {
    this.openWhatsAppWithMessage(
      'Olá, tenho interesse no Infinity Recife em Boa Viagem e gostaria de falar com um corretor.'
    );
  }

  openWhatsAppHero(): void {
    this.openWhatsAppQuick();
  }

  onLeadSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) {
      this.openWhatsAppQuick();
      return;
    }

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const unitType = (data.get('unitType') || '').toString().trim();
    const customMessage = (data.get('message') || '').toString().trim();

    const pieces: string[] = [];
    pieces.push(
      'Olá, tenho interesse no Infinity Recife em Boa Viagem e gostaria de falar com um corretor.'
    );
    if (name) {
      pieces.push(`Nome: ${name}`);
    }
    if (phone) {
      pieces.push(`Telefone: ${phone}`);
    }
    if (unitType) {
      pieces.push(`Tipologia de interesse: ${unitType}`);
    }
    if (customMessage) {
      pieces.push(`O que procuro: ${customMessage}`);
    }
    pieces.push('Encontrei o empreendimento na landing page Infinity Recife.');

    const message = pieces.join('\n');
    this.openWhatsAppWithMessage(message);
  }

  private openWhatsAppWithMessage(message: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${this.whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
  }
}
