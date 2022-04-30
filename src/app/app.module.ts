import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user/user.service';
import { AuthGuard } from './authentication/_guards/auth.guard';

import { DataTablesModule } from 'angular-datatables';


import { GLOBAL } from './models/global';
import {TipoLiquidacionService} from './services/tipoLiquidacion/tipoLiquidacion.service';
import { DialogTipoLiquidacionComponent } from './parametros/gestion-tipos-liquidacion/dialog-tipo-liquidacion/dialog-tipo-liquidacion.component';
import {DialogTipoVehiculoComponent} from './parametros/gestion-tipos-vehiculos/dialog-tipo-vehiculo/dialog-tipo-vehiculo.component';
import {TipoVehiculoService} from './services/tipoVehiculo/tipoVehiculo.service';
import {DialogMarcasComponent} from './parametros/gestion-marcas/dialog-marcas/dialog-marcas.component';
import {MarcasService} from './services/marcas/marcas.service';
import {TipoServicioService} from './services/tipoServicio/tipoServicio.service';
import {DialogTipoServicioComponent} from './parametros/gestion-tipos-servicios/dialog-tipo-servicio/dialog-tipo-servicio.component';
import {DialogGestionLavaderoComponent} from './administrativo/gestion-lavaderos/dialog-gestion-lavaderos/dialog-gestion-lavadero.component';
import {LavaderoService} from './services/lavadero/lavadero.service';
import {ImageService} from './services/images/image.service';
import {DialogUsuarioComponent} from './personal/gestion-usuarios/dialog-usuario/dialog-usuario.component';
import {TipoIdentificacionService} from './services/tipoIdentificacion/tipoIdentificacion.service';
import {DialogPersonalLavaderoComponent} from './personal/personal-lavaderos/dialog-personal-lavadero/dialog-personal-lavadero.component';
import {PersonalLavaderoService} from './services/personalLavadero/personalLavadero.service';
import {DialogBusquedaLavaderoComponent} from './personal/personal-lavaderos/dialog-busqueda-lavaderos/dialog-busqueda-lavaderos.component';
import {DialogBusquedaUsuariosComponent} from './dialogs-app/busqueda/usuarios/dialog-busqueda-usuarios.component';
import {DialogBusquedaLavaderosComponent} from './dialogs-app/busqueda/lavaderos/dialog-busqueda-lavaderos.component';
import {LavaderoServicioService} from './services/lavaderoServicio/lavaderoServicio.service';
import {DialogBusquedaTiposServiciosComponent} from './dialogs-app/busqueda/tipos-servicios/dialog-busqueda-tipos-servicios.component';
import {TipoPromocionService} from './services/tipoPromocion/tipoPromocion.service';
import {DialogBusquedaTecnicosComponent} from './dialogs-app/busqueda/tecnicos/dialog-busqueda-tecnicos.component';
import {DialogBusquedaTiposLiquidacionesComponent} from './dialogs-app/busqueda/tipos-liquidaciones/dialog-busqueda-tipos-liquidaciones.component';
import {FuncionarioServicioService} from './services/funcionarioServicio/funcionarioServicio.service';
import {TipoPagoService} from './services/tipoPago/tipoPago.service';
import {DialogBusquedaTiposVehiculosComponent} from './dialogs-app/busqueda/tipos-vehiculos/dialog-busqueda-tipos-vehiculos.component';
import {DialogBusquedaMarcasComponent} from './dialogs-app/busqueda/marcas/dialog-busqueda-marcas.component';
import {ClienteVehiculoService} from './services/clienteVehiculo/clienteVehiculo.service';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './interceptors/CustomHttpInterceptor';
import {OrdenService} from './services/orden/orden.service';
import {DialogDetalleOrdenComponent} from './dialogs-app/detalle/orden/dialog-detalle-orden.component';
import {OrdenItemService} from './services/ordenItem/ordenItem.service';
import {DialogAdicionOrdenItemComponent} from './dialogs-app/adicion/ordenItem/dialog-adicion-ordenItem.component';
import {LiquidacionFuncionarioService} from './services/liquidacionFuncionario/liquidacionFuncionario.service';
import {LiquidacionComisionService} from './services/liquidacionComision/liquidacionComision.service';
import {ReportesService} from './services/reportes/reportes.service';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppBlankComponent,
    AppSidebarComponent,
    DialogTipoLiquidacionComponent,
    DialogTipoVehiculoComponent,
    DialogMarcasComponent,
    DialogTipoServicioComponent,
    DialogGestionLavaderoComponent,
    DialogUsuarioComponent,
    DialogPersonalLavaderoComponent,
    DialogBusquedaLavaderoComponent,
    DialogBusquedaUsuariosComponent,
    DialogBusquedaLavaderosComponent,
    DialogBusquedaTiposServiciosComponent,
    DialogBusquedaTecnicosComponent,
    DialogBusquedaTiposLiquidacionesComponent,
    DialogBusquedaTiposVehiculosComponent,
    DialogBusquedaMarcasComponent,
    DialogDetalleOrdenComponent,
    DialogAdicionOrdenItemComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    PerfectScrollbarModule,
    MatProgressButtonsModule,
    SharedModule,
    // Add this import here
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [GLOBAL.urlBaseBackend],
        //blacklistedRoutes: ['localhost:8080/lavadero/api/login']
      }
    }),
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
  AuthService,
  AuthGuard,
  UserService,
  TipoLiquidacionService,
  TipoVehiculoService,
  MarcasService,
  TipoServicioService,
  LavaderoService,
  ImageService,
  TipoIdentificacionService,
  PersonalLavaderoService,
  LavaderoServicioService,
    TipoPromocionService,
    FuncionarioServicioService,
    TipoPagoService,
    ClienteVehiculoService,
    OrdenService,
    OrdenItemService,
    LiquidacionFuncionarioService,
    LiquidacionComisionService,
    ReportesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogTipoLiquidacionComponent,
    DialogTipoVehiculoComponent,
    DialogMarcasComponent,
    DialogTipoServicioComponent,
    DialogGestionLavaderoComponent,
    DialogUsuarioComponent,
    DialogPersonalLavaderoComponent,
    DialogBusquedaLavaderoComponent,
    DialogBusquedaUsuariosComponent,
    DialogBusquedaLavaderosComponent,
    DialogBusquedaTiposServiciosComponent,
    DialogBusquedaTecnicosComponent,
    DialogBusquedaTiposLiquidacionesComponent,
    DialogBusquedaTiposVehiculosComponent,
    DialogBusquedaMarcasComponent,
    DialogDetalleOrdenComponent,
    DialogAdicionOrdenItemComponent
  ]
})
export class AppModule {}
