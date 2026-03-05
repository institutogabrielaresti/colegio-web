import { Component, HostListener, OnInit  } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  menuAbierto = false;
  scrolled = false;

  mesActual = '';
  anioActual = 0;
  mesIndex = 0;
  mostrarCalendario = false;
  dias: number[] = [];
  eventos: any[] = [];
  eventoHover:any = null;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  /*Calendario*/
  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  ngOnInit() {
    this.generarCalendario();
    if (isPlatformBrowser(this.platformId)) {
      this.cargarEventos();
    }
  }

  generarCalendario(){

  const hoy = new Date();

  const año = this.anioActual || hoy.getFullYear();
  const mes = this.mesIndex || hoy.getMonth();

  const ultimoDia = new Date(año, mes + 1, 0).getDate();

  this.anioActual = año;

  this.mesActual = new Date(año, mes)
    .toLocaleString('es', { month: 'long' });

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

esHoy(dia:number){

  const hoy = new Date();

  return (
    dia === hoy.getDate() &&
    this.mesIndex === hoy.getMonth() &&
    this.anioActual === hoy.getFullYear()
  );

}

  cargarEventos() {

  this.http.get<any>('assets/eventos.json')
    .subscribe(data => {
      this.eventos = data.eventos;
    });
  }

  tieneEvento(dia:number){

    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    const fecha = `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    return this.eventos.some(e => e.fecha === fecha);

  }

mostrarEvento(dia:number){

  const hoy = new Date();

  const mes = this.mesIndex + 1;
  const año = this.anioActual;

  const fecha = `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

  const evento = this.eventos.find(e => e.fecha === fecha);

  if(evento){
    this.eventoHover = {
      dia,
      titulo:evento.titulo
    };
  }

}

/*Salir del calendario con click*/
@HostListener('document:click', ['$event'])
cerrarCalendario(event:Event){

  const elemento = event.target as HTMLElement;

  if(!elemento.closest('.calendario-item')){
    this.mostrarCalendario = false;
  }

}
}