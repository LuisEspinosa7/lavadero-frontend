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
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {TipoLiquidacionService} from '../../services/tipoLiquidacion/tipoLiquidacion.service';
import {TipoServicioService} from '../../services/tipoServicio/tipoServicio.service';
import {TipoServicio} from '../../models/TipoServicio';

import * as moment from 'moment';
import * as $ from 'jquery';
import {FuncionarioServicio} from '../../models/FuncionarioServicio';
import {LiquidacionFuncionarioService} from '../../services/liquidacionFuncionario/liquidacionFuncionario.service';
import {Observable} from 'rxjs';

import {map, startWith} from 'rxjs/operators';
import {LavaderoServicio} from '../../models/LavaderoServicio';
import {LavaderoServicioService} from '../../services/lavaderoServicio/lavaderoServicio.service';
import {LiquidacionComsion} from '../../models/LiquidacionComsion';
import {LiquidacionComisionService} from '../../services/liquidacionComision/liquidacionComision.service';

@Component({
  selector: 'app-liquidacion-comision',
  templateUrl: './liquidacion-comision.component.html',
  styleUrls: ['./liquidacion-comision.component.css']
})

export class LiquidacionComisionComponent implements OnInit, AfterViewInit {

  lavaderosJSON: Lavadero[] = [];
  lavaderoSeleccionado: Lavadero;
  filteredOptions: Observable<Lavadero[]>;
  seleccionoLavadero: boolean;

  tipoServicioActual: TipoServicio;
  fechaInicioActual: any;
  fechaFinActual: any;

  lavaderoServicioConfiguracionActual: LavaderoServicio;

  liquidacionComisionActual: LiquidacionComsion;

  loadingFiltros: boolean;

  loadingCalculoComision: boolean;


  busquedaFormGroup: FormGroup;
  tiposServicioJSON: TipoServicio[] = [];


  displayedColumns = ['index', 'empresa', 'servicio', 'precioservicio', 'fechainicio', 'fechafin', 'nprestados', 'porcentaje', 'comision'];
  dataSource = new MatTableDataSource<LiquidacionComsion>();
  liquidacionesComisionesHistorial: LiquidacionComsion[] = [];
  loadingLiquidacionesComisionesHistorial: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  buscadoPreviamente: boolean;


  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private _lavaderoService: LavaderoService,
              private _tipoServicioService: TipoServicioService,
              private _lavaderoServicioService: LavaderoServicioService,
              private _liquidacionComisionService: LiquidacionComisionService) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.loadingFiltros = true;
    this.seleccionoLavadero = false;
    this.loadingCalculoComision = false;
    this.loadingLiquidacionesComisionesHistorial = false;
    this.buscadoPreviamente = false;

    this.iniciarFormularioBusqueda();

    this.cargarLavaderos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  iniciarFormularioBusqueda(){
    console.log('Iniciando Formularios para busqueda');

    this.busquedaFormGroup = this.formBuilder.group({
      lavadero: [null, Validators.compose([Validators.required])],
      tipoServicio: [null, Validators.compose([Validators.required])],
      fechaInicio: [null, Validators.compose([Validators.required])],
      fechaFin: [null, Validators.compose([Validators.required])]
    })

    this.busquedaFormGroup.controls['tipoServicio'].disable();

    this.filteredOptions = this.busquedaFormGroup.controls['lavadero'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): Lavadero[] {
    const filterValue = value.toLowerCase();
    return this.lavaderosJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  cargarLavaderos() {
    console.log('Cargando lavaderos');

    this._lavaderoService.cargarLavaderosDisponibles()
      .subscribe(
        response => {
          console.log(response);

          this.lavaderosJSON = response;
          this.loadingFiltros = false;

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }

  cambioLavadero(lavadero: Lavadero){
    console.log(lavadero);
    this.lavaderoSeleccionado = lavadero;
    this.seleccionoLavadero = true;

    this.busquedaFormGroup.controls['tipoServicio'].enable();

    this.cargarTiposServicios();
  }



  cargarTiposServicios() {
    console.log('Cargando los tipos de servicios');

    this._tipoServicioService.cargarTiposServiciosAplicanComisionXLavaderoDisponibles(this.lavaderoSeleccionado.codigo)
      .subscribe(
        response => {
          console.log(response);

          this.tiposServicioJSON = response.data;

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

        this.cargarConfiguracion();

      }
    }


  }



  cargarConfiguracion() {
    console.log('Cargando la configuracion');

    this._lavaderoServicioService.cargarConfiguracionServicioLavadero(this.lavaderoSeleccionado.codigo, this.tipoServicioActual.codigo.toString())
      .subscribe(
        response => {
          console.log(response);

          this.lavaderoServicioConfiguracionActual = response.data;

        },
        error =>  {
          console.log(<any>error);
        }
      );

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

  calcularComision(){
    console.log('Calculando Comision');

    this.loadingCalculoComision = true;

    this.busquedaFormGroup.controls['lavadero'].disable();
    this.busquedaFormGroup.controls['tipoServicio'].disable();
    this.busquedaFormGroup.controls['fechaInicio'].disable();
    this.busquedaFormGroup.controls['fechaFin'].disable();

    let objectProcesado: LiquidacionComsion = new LiquidacionComsion(
      null,
      this.lavaderoServicioConfiguracionActual,
      null,
      this.fechaInicioActual,
      this.fechaFinActual,
        null,
        null,
      null
    );

    console.log(objectProcesado);


    this._liquidacionComisionService.calcularComision(objectProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingCalculoComision = false;

            this.busquedaFormGroup.controls['lavadero'].enable();
            this.busquedaFormGroup.controls['tipoServicio'].enable();
            this.busquedaFormGroup.controls['fechaInicio'].enable();
            this.busquedaFormGroup.controls['fechaFin'].enable();

            console.log(response);
            this.liquidacionComisionActual = response.data;
            this.buscadoPreviamente = true;
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');


          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingCalculoComision = false;

            this.busquedaFormGroup.controls['lavadero'].enable();
            this.busquedaFormGroup.controls['tipoServicio'].enable();
            this.busquedaFormGroup.controls['fechaInicio'].enable();
            this.busquedaFormGroup.controls['fechaFin'].enable();
            console.log(response);
            this.buscadoPreviamente = true;
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          this.loadingCalculoComision = false;

          this.busquedaFormGroup.controls['lavadero'].enable();
          this.busquedaFormGroup.controls['tipoServicio'].enable();
          this.busquedaFormGroup.controls['fechaInicio'].enable();
          this.busquedaFormGroup.controls['fechaFin'].enable();

          this.buscadoPreviamente = true;

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

  buscarHistorial(liquidacionComsion: LiquidacionComsion){
    console.log('Buscando historial de liquidaciones');

    this.loadingLiquidacionesComisionesHistorial = true;
    console.log(liquidacionComsion);

    this._liquidacionComisionService.cargarHistorialLiquidacionesComisiones(liquidacionComsion)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingLiquidacionesComisionesHistorial = false;

            console.log(response);
            this.liquidacionesComisionesHistorial = response.data;
            this.dataSource.data = this.liquidacionesComisionesHistorial;
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');


          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingLiquidacionesComisionesHistorial = false;

            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          this.loadingLiquidacionesComisionesHistorial = false;
          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');

        }
      );

  }





  confirmarLiquidarComision(){
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
        this.liquidarComision();
      }

    })

  }


  liquidarComision(){
    console.log('Liquidar la comision');

    console.log(this.liquidacionComisionActual);

    this._liquidacionComisionService.liquidarComision(this.liquidacionComisionActual)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');

            console.log(response);
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');
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

    let objectProcesado: LiquidacionComsion = new LiquidacionComsion(
      null,
      this.lavaderoServicioConfiguracionActual,
      null,
      this.fechaInicioActual,
      this.fechaFinActual,
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
