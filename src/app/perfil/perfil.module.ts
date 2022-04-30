import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataTablesModule } from 'angular-datatables';
import { RolService } from '../services/rol/rol.service';
import {ReactiveFormsModule} from '@angular/forms';
import {PerfilRoutes} from './perfil.routing';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(PerfilRoutes)
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    RolService,
  ]
})
export class PerfilModule {}
