import { Routes } from '@angular/router';

import { AuthGuard } from '../authentication/_guards/auth.guard';
import {ProfileComponent} from './profile/profile.component';


export const PerfilRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'update-profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR', 'ROLE_PROPIETARIO', 'ROLE_OPERARIO'] }
      }
    ]
  }
];
