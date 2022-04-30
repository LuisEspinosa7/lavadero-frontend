import { Routes } from '@angular/router';

import { UsuariosComponent} from './gestion-usuarios/usuarios.component';
import { AuthGuard } from '../authentication/_guards/auth.guard';
import {PersonalLavaderoComponent} from './personal-lavaderos/personal-lavadero.component';
import {FuncionarioServicioComponent} from './funcionario-servicio/funcionario-servicio.component';


export const PersonalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gestion-usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'personal-lavadero',
        component: PersonalLavaderoComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'funcionario-servicio',
        component: FuncionarioServicioComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      }

    ]
  }
];
