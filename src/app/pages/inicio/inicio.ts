import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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

  noticias: any[] = [];

  constructor(private http: HttpClient) {}

  alumnos = 0;
  docentes = 0;
  experiencia = 0;

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.animarContadores();
    }

    this.cargarNoticias(); // ✅ ahora sí se usa Google Sheets
  }

  /* ========================= */
  /* CONTADORES */
  /* ========================= */

  animarContadores() {

    const intervalo = setInterval(() => {

      if (this.alumnos < 500) this.alumnos += 10;
      if (this.docentes < 35) this.docentes += 1;
      if (this.experiencia < 15) this.experiencia += 1;

      this.cd.detectChanges();

      if (
        this.alumnos >= 500 &&
        this.docentes >= 35 &&
        this.experiencia >= 15
      ) {
        clearInterval(intervalo);
      }

    }, 40);
  }

  /* ========================= */
  /* NOTICIAS DESDE GOOGLE SHEETS */
  /* ========================= */

 cargarNoticias() {

  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfVCF1FS_NG3zOHxsJUNu7X0g17O0GMzzDoVwTzLeZy6hK8OKQ54QMV5fRHK9D4YrTf2vgmlq-QJSs/pub?output=csv';

  const url = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(sheetURL);

  this.http.get(url, { responseType: 'text' })
    .subscribe({
      next: (data) => {

        const filas = data.split('\n').slice(1);

        const noticiasParseadas = filas
          .map(fila => {

            // 🔥 Manejo más seguro de CSV
            const columnas = fila.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            return {
              titulo: columnas[0]?.replace(/"/g, '').trim(),
              descripcion: columnas[1]?.replace(/"/g, '').trim(),
              fecha: columnas[2]?.replace(/"/g, '').trim()
            };

          })
          .filter(n => n.titulo && n.descripcion && n.fecha);

        this.noticias = noticiasParseadas
          .sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          )
          .slice(0, 3);

      },

      error: (err) => {
        console.error('Error cargando noticias:', err);

        // fallback para que no se rompa la UI
        this.noticias = [
          {
            titulo: 'Información no disponible',
            descripcion: 'No se pudieron cargar las noticias en este momento.',
            fecha: ''
          }
        ];
      }
    });

}

}