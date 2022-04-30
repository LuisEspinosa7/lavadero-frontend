import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ParametrosRoutes } from './parametros.routing';
import { DataTablesModule } from 'angular-datatables';
import { TiposLiquidacionComponent } from './gestion-tipos-liquidacion/tipos-liquidacion.component';
import { RolService } from '../services/rol/rol.service';
import {TiposVehiculosComponent} from './gestion-tipos-vehiculos/tipos-vehiculos.component';
import {MarcasComponent} from './gestion-marcas/marcas.component';
import {TiposServiciosComponent} from './gestion-tipos-servicios/tipos-servicios.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forChild(ParametrosRoutes)
  ],
  declarations: [
    TiposLiquidacionComponent,
    TiposVehiculosComponent,
    MarcasComponent,
    TiposServiciosComponent
  ],
  providers: [
    RolService,
  ]
})
export class ParametrosModule {}
