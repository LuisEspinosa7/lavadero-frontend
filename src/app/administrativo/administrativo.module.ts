import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdministrativoRoutes } from './administrativo.routing';
import { DataTablesModule } from 'angular-datatables';
import {GestionLavaderosComponent} from './gestion-lavaderos/gestion-lavaderos.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LavaderoServicioComponent} from './lavadero-servicios/lavadero-servicio.component';
import {LiquidacionTecnicosComponent} from './liquidacion-tecnicos/liquidacion-tecnicos.component';
import {LiquidacionComisionComponent} from './liquidacion-comision/liquidacion-comision.component';




@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdministrativoRoutes)
  ],
  declarations: [
    GestionLavaderosComponent,
    LavaderoServicioComponent,
    LiquidacionTecnicosComponent,
    LiquidacionComisionComponent
  ],
  providers: [
  ]
})
export class AdministrativoModule {}
