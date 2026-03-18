import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  heroImage = 'assets/Edificio_IGA.png';
  bannerImage = 'assets/fondo-inscripciones.png';

  noticias:any[] = [];

  constructor(private http: HttpClient){}

  alumnos = 0;
  docentes = 0;
  experiencia = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animarContadores();
    }
    this.http.get<any>('assets/noticias.json?nocache=' + Date.now())
      .subscribe(data => {
        this.noticias = data.noticias
        .sort((a:any,b:any)=>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
        )
      .slice(0,3);
    });
  }

  animarContadores() {

    const intervalo = setInterval(() => {

      if (this.alumnos < 500) this.alumnos += 10;
      if (this.docentes < 35) this.docentes += 1;
      if (this.experiencia < 15) this.experiencia += 1;

      this.cd.detectChanges();

      if (this.alumnos >= 500 &&
          this.docentes >= 35 &&
          this.experiencia >= 15) {
        clearInterval(intervalo);
      }

    }, 40);
  }
}