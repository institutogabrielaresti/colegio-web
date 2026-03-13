import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';
import { CalendarioComponent } from './pages/calendario/calendario';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'admin', component: AdminComponent }
];