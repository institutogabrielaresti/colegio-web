import { Component, HostListener  } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  menuAbierto = false;
  scrolled = false;

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
  mostrarCalendario = false;

  dias: number[] = [];
  mesActual = '';
  eventos: any[] = [];

  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  ngOnInit() {
    this.generarCalendario();
    this.cargarEventos();
  }

  generarCalendario() {

    const hoy = new Date();

    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    this.mesActual = hoy.toLocaleString('es', { month: 'long' });

    this.dias = Array.from({ length: ultimoDia }, (_, i) => i + 1);

  }

  async cargarEventos() {

    const res = await fetch('assets/eventos.json');
    const data = await res.json();

    this.eventos = data.eventos;

  }

  tieneEvento(dia:number){

    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    const fecha = `${año}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

    return this.eventos.some(e => e.fecha === fecha);

  }
}