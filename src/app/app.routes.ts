import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent, title: 'Mil Oficios | Tu hogar en buenas manos', data: { description: 'Gasfitería, electricidad, línea blanca y pintura en Lima. Consulta y cotiza tu servicio por WhatsApp.' } },
      { path: 'especialistas', loadComponent: () => import('./features/specialists/specialists.component').then(m => m.SpecialistsComponent), title: 'Únete como especialista | Mil Oficios', data: { description: 'Conoce la red de especialistas de Mil Oficios y registra tu experiencia y cobertura en Lima.' } },
      { path: 'especialistas/registro', loadComponent: () => import('./features/registration/registration.component').then(m => m.RegistrationComponent), canDeactivate: [(component: import('./features/registration/registration.component').RegistrationComponent) => component.canLeave()], title: 'Registro de especialistas | Mil Oficios', data: { description: 'Completa tu solicitud para formar parte de Mil Oficios.', noindex: true } },
      { path: 'politicas-privacidad', component: PrivacyComponent, title: 'Políticas de privacidad | Mil Oficios', data: { description: 'Consulta la política de privacidad y tratamiento de datos de Mil Oficios.' } },
      { path: 'privacy', pathMatch: 'full', redirectTo: 'politicas-privacidad' },
      { path: '**', loadComponent: () => import('./features/not-found.component').then(m => m.NotFoundComponent), title: 'Página no encontrada | Mil Oficios', data: { noindex: true } }
    ]
  }
];
