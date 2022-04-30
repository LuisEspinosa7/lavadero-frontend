import { Routes } from '@angular/router';
import {AuthGuard} from '../authentication/_guards/auth.guard';
import {ClientesComponent} from './gestion-clientes/clientes.component';
import {VehiculosComponent} from './gestion-vehiculos/vehiculos.component';
import {GestionOrdenesComponent} from './gestion-ordenes/gestion-ordenes.component';


export const ModServiciosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gestion-clientes',
        component: ClientesComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR', 'ROLE_OPERARIO'] }
      },
      {
        path: 'gestion-vehiculos',
        component: VehiculosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR', 'ROLE_OPERARIO'] }
      },
      {
        path: 'gestion-ordenes',
        component: GestionOrdenesComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_OPERARIO'] }
      }
    ]
  }
];
