import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

import { AuthGuard } from '../authentication/_guards/auth.guard';
import {Dashboard3Component} from './dashboard3/dashboard3.component';





export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: Dashboard1Component,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'dashboard2',
        component: Dashboard2Component,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_PROPIETARIO'] }
      },
      {
        path: 'dashboard3',
        component: Dashboard3Component,
        canActivate: [AuthGuard],
        data: { 'roles': ['ROLE_OPERARIO'] }
      }
    ]
  }
];
