import { Routes } from '@angular/router';

import { TiposLiquidacionComponent } from './gestion-tipos-liquidacion/tipos-liquidacion.component';
import { AuthGuard } from '../authentication/_guards/auth.guard';
import {TiposVehiculosComponent} from './gestion-tipos-vehiculos/tipos-vehiculos.component';
import {MarcasComponent} from './gestion-marcas/marcas.component';
import {TiposServiciosComponent} from './gestion-tipos-servicios/tipos-servicios.component';


export const ParametrosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tipos-liquidacion',
        component: TiposLiquidacionComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'tipos-vehiculos',
        component: TiposVehiculosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'marcas',
        component: MarcasComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'tipos-servicios',
        component: TiposServiciosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      }

    ]
  }
];
