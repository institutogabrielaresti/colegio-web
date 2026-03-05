import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  /* ============================= */
  /* NAVBAR */
  /* ============================= */

  menuAbierto = false;
  scrolled = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  /* ============================= */
  /* CALENDARIO */
  /* ============================= */

  mesActual = '';
  anioActual = 0;
  mesIndex = 0;

  mostrarCalendario = false;

  dias: number[] = [];
  eventos: any[] = [];

  eventoHover: any = null;

  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  ngOnInit() {

    const hoy = new Date();

    this.anioActual = hoy.getFullYear();
    this.mesIndex = hoy.getMonth();

    this.generarCalendario();

    if (isPlatformBrowser(this.platformId)) {
      this.cargarEventos();
    }

  }

  /* ============================= */
  /* GENERAR CALENDARIO */
  /* ============================= */

  generarCalendario(){

    const ultimoDia = new Date(
      this.anioActual,
      this.mesIndex + 1,
      0
    ).getDate();

    this.mesActual = new Date(
      this.anioActual,
      this.mesIndex
    ).toLocaleString('es', { month: 'long' });

    this.dias = Array.from({ length: ultimoDia }, (_, i) => i + 1);

  }

  mesAnterior(){

    this.mesIndex--;

    if(this.mesIndex < 0){
      this.mesIndex = 11;
      this.anioActual--;
    }

    this.generarCalendario();

  }

  mesSiguiente(){

    this.mesIndex++;

    if(this.mesIndex > 11){
      this.mesIndex = 0;
      this.anioActual++;
    }

    this.generarCalendario();

  }

  /* ============================= */
  /* DIA ACTUAL */
  /* ============================= */

  esHoy(dia:number){

    const hoy = new Date();

    return (
      dia === hoy.getDate() &&
      this.mesIndex === hoy.getMonth() &&
      this.anioActual === hoy.getFullYear()
    );

  }

  /* ============================= */
  /* EVENTOS */
  /* ============================= */

  cargarEventos() {

    this.http.get<any>('assets/eventos.json')
      .subscribe(data => {

        this.eventos = data.eventos || [];

        /* ordenar eventos por fecha */
        this.eventos.sort((a:any,b:any) =>
          new Date(a.fecha).getTime() -
          new Date(b.fecha).getTime()
        );

      });

  }

  /* ============================= */
  /* VERIFICAR EVENTO EN DIA */
  /* ============================= */

  tieneEvento(dia:number){

    const mes = this.mesIndex + 1;
    const año = this.anioActual;

    const fecha =
      `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    return this.eventos.some(e => e.fecha === fecha);

  }

  /* ============================= */
  /* TOOLTIP EVENTO */
  /* ============================= */

  mostrarEvento(dia:number){

    const mes = this.mesIndex + 1;
    const año = this.anioActual;

    const fecha =
      `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    const evento = this.eventos.find(e => e.fecha === fecha);

    if(evento){

      this.eventoHover = {
        dia: dia,
        titulo: evento.titulo
      };

    } else {

      this.eventoHover = null;

    }

  }

  /* ============================= */
  /* CERRAR CALENDARIO CLICK FUERA */
  /* ============================= */

  @HostListener('document:click', ['$event'])
  cerrarCalendario(event:Event){

    const elemento = event.target as HTMLElement;

    if(!elemento.closest('.calendario-item')){
      this.mostrarCalendario = false;
    }

  }

  /* ============================= */
  /* Obtener nombre del evento     */
  /* ============================= */

  obtenerTituloEvento(dia:number){

  const mes = this.mesIndex + 1;
  const año = this.anioActual;

  const fecha =
    `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

  const evento = this.eventos.find(e => e.fecha === fecha);

  return evento ? evento.titulo : '';

}

}