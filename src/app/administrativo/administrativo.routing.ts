import { Routes } from '@angular/router';
import {GestionLavaderosComponent} from './gestion-lavaderos/gestion-lavaderos.component';
import {AuthGuard} from '../authentication/_guards/auth.guard';
import {LavaderoServicioComponent} from './lavadero-servicios/lavadero-servicio.component';
import {LiquidacionTecnicosComponent} from './liquidacion-tecnicos/liquidacion-tecnicos.component';
import {LiquidacionComisionComponent} from './liquidacion-comision/liquidacion-comision.component';



export const AdministrativoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gestion-lavaderos',
        component: GestionLavaderosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'configurar-servicios',
        component: LavaderoServicioComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'liquidar-tecnicos',
        component: LiquidacionTecnicosComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_OPERARIO'] }
      },
      {
        path: 'liquidar-comision',
        component: LiquidacionComisionComponent,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      }
    ]
  }
];
