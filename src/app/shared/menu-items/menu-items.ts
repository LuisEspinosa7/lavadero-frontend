import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
  roles?: string[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
  roles?: string[];
}

const MENUITEMS = [
    {
      state: '',
      name: 'Inicio',
      type: 'saperator',
      icon: 'av_timer'
    },
    {
      state: 'dashboards',
      name: 'Paneles Admin',
      type: 'sub',
      icon: 'av_timer',
      roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'],
      children: [
        { state: 'dashboard1', name: 'Panel 1', type: 'link', roles: ['ROLE_ADMINISTRADOR'] },
        { state: 'dashboard2', name: 'Panel 2', type: 'link', roles: ['ROLE_MESERO'] }
      ]
    },
    {
      state: '',
      name: 'Gestion',
      type: 'saperator',
      icon: 'av_timer'
    },
    {
      state: 'usuarios',
      name: 'Usuarios',
      type: 'sub',
      icon: 'av_timer',
      roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'],
      children: [
        { state: 'gestion-usuarios', name: 'Gestionar', type: 'link', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'] },
        { state: 'dashboard2', name: 'Dashboard 2', type: 'link', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'] }
      ]
  },
  {
    state: '',
    name: 'Visualizaciones',
    type: 'saperator',
    icon: 'av_timer'
  },
  {
    state: 'graficas',
    name: 'Graficas',
    type: 'sub',
    icon: 'av_timer',
    roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'],
    children: [
      { state: 'gestion-usuarios', name: 'Gestionar', type: 'link', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'] },
      { state: 'dashboard2', name: 'Dashboard 2', type: 'link', roles: ['ROLE_ADMINISTRADOR', 'ROLE_MESERO'] }
    ]
}


];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
