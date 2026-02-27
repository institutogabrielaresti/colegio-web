import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements OnInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  imagenSeleccionada: string | null = null;
  currentIndex = 0;
  private intervaloId: any;

  galeria: string[] = [
    '/galeria/imagen1.jpg',
    '/galeria/imagen2.jpg',
    '/galeria/imagen3.jpg',
    '/galeria/imagen4.jpg',
    '/galeria/imagen5.jpg'
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarCarrusel();
    }
  }

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  iniciarCarrusel(): void {
    this.intervaloId = setInterval(() => {
      this.currentIndex =
        (this.currentIndex + 1) % this.galeria.length;

      // 👇 Forzar actualización de vista
      this.cd.detectChanges();

    }, 4000);
  }

  siguiente(): void {
    this.currentIndex =
      (this.currentIndex + 1) % this.galeria.length;
  }

  anterior(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.galeria.length) % this.galeria.length;
  }

  irA(index: number): void {
    this.currentIndex = index;
  }

  abrirImagen(img: string): void {
    this.imagenSeleccionada = img;
  }

  cerrarImagen(): void {
    this.imagenSeleccionada = null;
  }
}