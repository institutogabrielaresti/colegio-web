import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent }
];