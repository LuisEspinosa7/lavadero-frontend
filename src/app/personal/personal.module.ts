import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';


import { PersonalRoutes } from './personal.routing';
import { DataTablesModule } from 'angular-datatables';
import { RolService } from '../services/rol/rol.service';
import {UsuariosComponent} from './gestion-usuarios/usuarios.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PersonalLavaderoComponent} from './personal-lavaderos/personal-lavadero.component';
import {FuncionarioServicioComponent} from './funcionario-servicio/funcionario-servicio.component';



@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(PersonalRoutes)
  ],
  declarations: [
    UsuariosComponent,
    PersonalLavaderoComponent,
    FuncionarioServicioComponent
  ],
  providers: [
    RolService,
  ]
})
export class PersonalModule {}
