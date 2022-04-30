import {Component, AfterViewInit, OnInit, Inject, OnDestroy, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import swal from'sweetalert2';
import {OrdenService} from '../../services/orden/orden.service';
import {Usuario} from '../../models/usuario';
import {Lavadero} from '../../models/lavadero';
import {UserService} from '../../services/user/user.service';
import {LavaderoService} from '../../services/lavadero/lavadero.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrdenItem} from '../../models/OrdenItem';
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {TipoLiquidacionService} from '../../services/tipoLiquidacion/tipoLiquidacion.service';
import {TipoServicioService} from '../../services/tipoServicio/tipoServicio.service';
import {TipoServicio} from '../../models/TipoServicio';

import * as moment from 'moment';
import * as $ from 'jquery';
import {FuncionarioServicio} from '../../models/FuncionarioServicio';
import {LiquidacionFuncionarioService} from '../../services/liquidacionFuncionario/liquidacionFuncionario.service';
import {ItemFuncionario} from '../../models/ItemFuncionario';

@Component({
  selector: 'app-liquidacion-tecnicos',
  templateUrl: './liquidacion-tecnicos.component.html',
  styleUrls: ['./liquidacion-tecnicos.component.css']
})

export class LiquidacionTecnicosComponent implements OnInit, AfterViewInit {

  dataUser: Usuario;
  lavaderosUsuario: Lavadero[] = [];
  lavaderoUsuario: Lavadero;

  liquidacionesFuncionarios: LiquidacionFuncionario[] = [];
  loadingLiquidacionesFuncionarios: boolean;
  buscadoPreviamente: boolean;
  displayedColumns = ['index', 'trabajador', 'identificacion', 'valorservicio', 'nprestados', 'tipopago', 'pago', 'opciones'];
  dataSource = new MatTableDataSource<LiquidacionFuncionario>();

  busquedaFormGroup: FormGroup;
  tiposLiquidacionJSON: TipoLiquidacion[] = [];
  tiposServicioJSON: TipoServicio[] = [];


  tipoLiquidacionActual: TipoLiquidacion;
  tipoServicioActual: TipoServicio;
  fechaInicioActual: any;
  fechaFinActual: any;
  loadingFiltros: boolean;

  liquidacionEnProceso: LiquidacionFuncionario;


  displayedColumns2 = ['index', 'trabajador', 'identificacion', 'valorservicio', 'nprestados', 'tipopago', 'pago', 'opciones'];
  dataSource2 = new MatTableDataSource<LiquidacionFuncionario>();
  liquidacionesFuncionariosHistorial: LiquidacionFuncionario[] = [];
  loadingLiquidacionesFuncionariosHistorial: boolean;
  @ViewChild(MatPaginator) paginator2: MatPaginator;


  imprimiendoTicket: boolean;


  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private _ordenService: OrdenService,
              private userService: UserService,
              private _lavaderoService: LavaderoService,
              private _tipoServicioService: TipoServicioService,
              private _tipoLiquidacionService: TipoLiquidacionService,
              private _liquidacionFuncionarioService: LiquidacionFuncionarioService) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.iniciarFormularioBusqueda();
    this.loadingFiltros = true;
    this.buscadoPreviamente = false;
    this.loadingLiquidacionesFuncionarios = false;
    this.loadingLiquidacionesFuncionariosHistorial = false;
    this.imprimiendoTicket = false;

    this.cargarUsuario();
    this.cargarLavadero();
  }


  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator2;
  }


  iniciarFormularioBusqueda(){
    console.log('Iniciando Formularios para busqueda');

    this.busquedaFormGroup = this.formBuilder.group({
      tipoLiquidacion: [null, Validators.compose([Validators.required])],
      tipoServicio: [null, Validators.compose([Validators.required])],
      fechaInicio: [null, Validators.compose([Validators.required])],
      fechaFin: [null, Validators.compose([Validators.required])]
    })

  }

  cargarUsuario(){
    console.log('Cargando el usuario');
    this.dataUser = JSON.parse(localStorage.getItem('user'));
  }

  cargarLavadero() {
    console.log('Cargando el lavadero');

    this._lavaderoService.cargarLavaderosUsuario(this.dataUser.codigo)
      .subscribe(
        response => {
          console.log(response);

          this.lavaderosUsuario = response;
          console.log(this.lavaderosUsuario);
          this.lavaderoUsuario = this.lavaderosUsuario[0];

          this.cargarTiposLiquidaciones();
          this.cargarTiposServicios();

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  cargarTiposLiquidaciones() {
    console.log('Cargando los tipos de liquidacion');

    this._tipoLiquidacionService.cargarTiposLiquidacionDisponibles()
      .subscribe(
        response => {
          console.log(response);

          this.tiposLiquidacionJSON = response;

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  cambioTipoLiquidacion(valor) {
    console.log('Cambio tipo liquidacion');

    for (let entry of this.tiposLiquidacionJSON) {
      console.log('Iterando ...');
      if (entry.codigo == valor) {
        console.log('Encontrado ...');
        this.tipoLiquidacionActual = entry;
      }
    }


  }



  cargarTiposServicios() {
    console.log('Cargando los tipos de servicios');

    this._tipoServicioService.cargarTiposServiciosXLavaderoDisponibles(this.lavaderoUsuario.codigo)
      .subscribe(
        response => {
          console.log(response);

          this.tiposServicioJSON = response.data;
          this.loadingFiltros = false;

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  cambioTipoServicio(valor) {
    console.log('Cambio tipo servicio');

    for (let entry of this.tiposServicioJSON) {
      console.log('Iterando ...');
      if (entry.codigo == valor) {
        console.log('Encontrado ...');
        this.tipoServicioActual = entry;
      }
    }


  }


  cambioFechaInicio(valor) {
    console.log('Cambio fecha inicio');

    console.log(valor);

    let a = moment(valor, "MM-DD-YYYY");
    console.log(a);

    let b = a.set('h', 0);
    let c = b.set('m', 0);

    console.log(c);
    console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
    this.fechaInicioActual = c;
  }


  cambioFechaFin(valor) {
    console.log('Cambio fecha fin');

    console.log(valor);


    let a = moment(valor, "MM-DD-YYYY");
    console.log(a);

    let b = a.set('h', 23);
    let c = b.set('m', 59);

    console.log(c);
    console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
    this.fechaFinActual = c;
  }





  /**
   * Buscar un liquidaciones
   */

  buscarLiquidaciones(){
    console.log('Buscando liquidaciones para liquidar');

    this.loadingLiquidacionesFuncionarios = true;

    this.busquedaFormGroup.controls['tipoLiquidacion'].disable();
    this.busquedaFormGroup.controls['tipoServicio'].disable();
    this.busquedaFormGroup.controls['fechaInicio'].disable();
    this.busquedaFormGroup.controls['fechaFin'].disable();

    let funcionarioServicio: FuncionarioServicio = new FuncionarioServicio(
      null,
      null,
      this.tipoServicioActual,
      this.tipoLiquidacionActual,
      null,
      null,
      null,
      null
    );

    let objectProcesado: LiquidacionFuncionario = new LiquidacionFuncionario(
      null,
      funcionarioServicio,
      this.lavaderoUsuario,
      null,
      this.fechaInicioActual,
      this.fechaFinActual,
      null,
      null,
      null,
      null
    );

    console.log(objectProcesado);


    this._liquidacionFuncionarioService.cargarRegistrosLiquidablesTecnicos(objectProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingLiquidacionesFuncionarios = false;

            this.busquedaFormGroup.controls['tipoLiquidacion'].enable();
            this.busquedaFormGroup.controls['tipoServicio'].enable();
            this.busquedaFormGroup.controls['fechaInicio'].enable();
            this.busquedaFormGroup.controls['fechaFin'].enable();

            console.log(response);
            this.liquidacionesFuncionarios = response.data;
            this.dataSource.data = this.liquidacionesFuncionarios;
            this.buscadoPreviamente = true;
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');


          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingLiquidacionesFuncionarios = false;

            this.busquedaFormGroup.controls['tipoLiquidacion'].enable();
            this.busquedaFormGroup.controls['tipoServicio'].enable();
            this.busquedaFormGroup.controls['fechaInicio'].enable();
            this.busquedaFormGroup.controls['fechaFin'].enable();
            this.buscadoPreviamente = true;
            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          this.loadingLiquidacionesFuncionarios = false;

          this.busquedaFormGroup.controls['tipoLiquidacion'].enable();
          this.busquedaFormGroup.controls['tipoServicio'].enable();
          this.busquedaFormGroup.controls['fechaInicio'].enable();
          this.busquedaFormGroup.controls['fechaFin'].enable();

          if(error.status === 404){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }


        }
      );

    this.buscarHistorial(objectProcesado);

  }




  /**
   * Buscar un historial
   */

  buscarHistorial(liquidacionFuncionario: LiquidacionFuncionario){
    console.log('Buscando historial de liquidaciones');

    this.loadingLiquidacionesFuncionariosHistorial = true;
    console.log(liquidacionFuncionario);

    this._liquidacionFuncionarioService.cargarHistorialLiquidacionesTecnicos(liquidacionFuncionario)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingLiquidacionesFuncionariosHistorial = false;

            console.log(response);
            this.liquidacionesFuncionariosHistorial = response.data;
            this.dataSource2.data = this.liquidacionesFuncionariosHistorial;
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');


          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingLiquidacionesFuncionariosHistorial = false;

            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          this.loadingLiquidacionesFuncionariosHistorial = false;
          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');

        }
      );

  }


  confirmarImprimirTicket(index){
    console.log('Confirmar impresion ticket');

    swal({
      title: 'Advertencia',
      text: GLOBAL.confirmacionImpresionTicket,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      if (result.value) {

        console.log('Preparando impresion');

        this.liquidacionEnProceso = this.liquidacionesFuncionarios[index];
        this.imprimirTicket();
      }

    })

  }


  confirmarImprimirTicketDeHistorial(index){
    console.log('Confirmar impresion ticket de historial');

    swal({
      title: 'Advertencia',
      text: GLOBAL.confirmacionImpresionTicket,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      if (result.value) {

        console.log('Preparando impresion');

        this.liquidacionEnProceso = this.liquidacionesFuncionariosHistorial[index];
        this.imprimirTicket();
      }

    })

  }



  imprimirTicket(){
    console.log('Imprimir el ticket');

    this.imprimiendoTicket = true;

    console.log(this.liquidacionEnProceso);

    this._liquidacionFuncionarioService.generarTicketLiquidacionFuncionario(this.liquidacionEnProceso)
      .subscribe(
        response => {
          console.log(response);

          /**
           * Se convierte de tipo Blob a el PDF original
           */

          let file = new Blob([response], { type: "application/pdf" });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');

          this.imprimiendoTicket = false;

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');
          this.imprimiendoTicket = false;

          this.mostrarRespuesta('error', 'Error', GLOBAL.ticketError, 'Ok');

        }
      );


  }



  confirmarLiquidarFuncionario(index){
    console.log('Confirmar la liquidacion');

    swal({
      title: 'Advertencia',
      text: GLOBAL.confirmacionLiquidacion,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      if (result.value) {

        console.log('Preparando liquidacion para liquidacion');

        this.liquidacionEnProceso = this.liquidacionesFuncionarios[index];
        this.liquidarFuncionario();
      }

    })

  }


  liquidarFuncionario(){
    console.log('Liquidar el funcionario');

    console.log(this.liquidacionEnProceso);

    this._liquidacionFuncionarioService.liquidarFuncionarioTecnico(this.liquidacionEnProceso)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');

            console.log(response);
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');
            this.buscarLiquidaciones();
            this.refrescarHistorial();

          } else {
            console.log('Algo paso pero no hubo error');

            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');

        }
      );


  }

  refrescarHistorial(){
    console.log('Refrescando el historial');

    let funcionarioServicio: FuncionarioServicio = new FuncionarioServicio(
      null,
      null,
      this.tipoServicioActual,
      this.tipoLiquidacionActual,
      null,
      null,
      null,
      null
    );

    let objectProcesado: LiquidacionFuncionario = new LiquidacionFuncionario(
      null,
      funcionarioServicio,
      this.lavaderoUsuario,
      null,
      this.fechaInicioActual,
      this.fechaFinActual,
      null,
      null,
      null,
      null
    );

    this.buscarHistorial(objectProcesado);
  }


  mostrarRespuesta(type, title, message, accion){
    console.log('Mostrando Respuesta....');
    swal({
      title: title,
      text: message,
      type: type,
      showCancelButton: false,
      confirmButtonColor: GLOBAL.primaryColor,
      confirmButtonText: 'Ok'});
  }



}
