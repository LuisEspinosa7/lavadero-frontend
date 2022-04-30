import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModServiciosRoutes } from './mod-servicios.routing';
import { DataTablesModule } from 'angular-datatables';
import {ReactiveFormsModule} from '@angular/forms';
import {ClientesComponent} from './gestion-clientes/clientes.component';
import {VehiculosComponent} from './gestion-vehiculos/vehiculos.component';
import {GestionOrdenesComponent} from './gestion-ordenes/gestion-ordenes.component';


@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(ModServiciosRoutes)
  ],
  declarations: [
    ClientesComponent,
    VehiculosComponent,
    GestionOrdenesComponent
  ],
  providers: [
  ]
})
export class ModServiciosModule {}
