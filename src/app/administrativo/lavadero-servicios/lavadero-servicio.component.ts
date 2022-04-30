import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';

import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LavaderoServicio} from '../../models/LavaderoServicio';
import {LavaderoServicioService} from '../../services/lavaderoServicio/lavaderoServicio.service';
import {Lavadero} from '../../models/lavadero';
import {TipoServicio} from '../../models/TipoServicio';
import {DialogBusquedaLavaderosComponent} from '../../dialogs-app/busqueda/lavaderos/dialog-busqueda-lavaderos.component';
import {DialogBusquedaTiposServiciosComponent} from '../../dialogs-app/busqueda/tipos-servicios/dialog-busqueda-tipos-servicios.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoPromocionService} from '../../services/tipoPromocion/tipoPromocion.service';
import {TipoPromocion} from '../../models/TipoPromocion';


@Component({
  selector: 'app-administrador-lavadero-servicio',
  templateUrl: './lavadero-servicio.component.html',
  styleUrls: ['./lavadero-servicio.component.css']
})

export class LavaderoServicioComponent implements OnInit {

  dtOptions: any = {};
  lavaderoServiciosList: LavaderoServicio[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public lavaderoServicioSelected: LavaderoServicio;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;


  firstFormGroup: FormGroup;

  isLinear: boolean;
  accion: string;


  lavaderoSeleccionadoActual: Lavadero;
  tipoServicioSeleccionadoActual: TipoServicio;

  seleccionoLavaderoActual: boolean;
  seleccionoTipoServicioActual: boolean;

  objectImageToShow1: any;
  isImageLoading1: boolean;
  imageLoadedComplete1: boolean;

  objectImageToShow2: any;
  isImageLoading2: boolean;
  imageLoadedComplete2: boolean;


  aplicaComision: boolean;
  aplicaPromocion: boolean;

  tiposPromocionJSON: TipoPromocion[] = [];

  escogioTipoPromocion: boolean;
  fraseSegunPromocion: string = '';

  valorComisionActual: number;
  valorPromocionActual: number;
  valorReferenciaActual: number;
  valorPrecioEstandarActual: number;

  datosMonetariosCompletos: boolean;

  correctoComision: boolean;
  correctoPromocion: boolean;


  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _lavaderoServicioService: LavaderoServicioService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private _tipoPromocionService: TipoPromocionService
              ) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.seleccionoLavaderoActual = false;
    this.seleccionoTipoServicioActual = false;
    this.createDataTable();

    this.getTiposPromocion();

    this.objectImageToShow1 = null;
    this.isImageLoading1 = true;
    this.imageLoadedComplete1 = false;

    this.objectImageToShow2 = null;
    this.isImageLoading2 = true;
    this.imageLoadedComplete2 = false;

    this.aplicaComision = false;
    this.escogioTipoPromocion = false;
    this.valorPrecioEstandarActual = 0;
    this.valorComisionActual = 0;
    this.valorReferenciaActual = 0;
    this.datosMonetariosCompletos = false;

    this.correctoComision = false;
    this.correctoPromocion = false;
  }

  mostrarSeccionAdicionar(){
    console.log('Mostrando seccion adicionar');
    this.iniciarFormulariosParaCreacion();
  }

  mostrarSeccionModificar(){
    console.log('Mostrando seccion modificar');
    this.iniciarFormulariosParaModificar();
  }


  iniciarFormulariosParaCreacion(){
    console.log('Iniciando Formularios para creacion');

    this.limpiarValores();

    this.accion = 'ADICIONAR';

    this.firstFormGroup = this.formBuilder.group({
      comision: [null, Validators.compose([])],
      valorComision: [null, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      promocion: [null, Validators.compose([])],
      tipoPromocion: [null, Validators.compose([])],
      valorReferencia: [null, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      valorPromocion: [null, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      precioEstandar: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })


    this.objectImageToShow1 = null;
    this.isImageLoading1 = true;
    this.imageLoadedComplete1 = false;

    this.objectImageToShow2 = null;
    this.isImageLoading2 = true;
    this.imageLoadedComplete2 = false;
  }


  iniciarFormulariosParaModificar() {
    console.log('Iniciando Formularios para modificar');

    this.limpiarValores();

    this.firstFormGroup = this.formBuilder.group({
      comision: [this.lavaderoServicioSelected.aplicaComision === 1, Validators.compose([])],
      valorComision: [this.lavaderoServicioSelected.aplicaComision ? this.lavaderoServicioSelected.valorComision : 0, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      promocion: [this.lavaderoServicioSelected.aplicaPromocion === 1, Validators.compose([])],
      tipoPromocion: [this.lavaderoServicioSelected.tipoPromocion.codigo, Validators.compose([])],
      valorReferencia: [this.lavaderoServicioSelected.aplicaPromocion ? this.lavaderoServicioSelected.promocionNumeroRef : 0, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      valorPromocion: [this.lavaderoServicioSelected.aplicaPromocion ? this.lavaderoServicioSelected.valorPromocion : 0, Validators.compose([Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      precioEstandar: [this.lavaderoServicioSelected.precioEstandar, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })


    if(this.lavaderoServicioSelected.aplicaComision){
      this.aplicaComision = true;
      this.valorComisionActual = this.lavaderoServicioSelected.aplicaComision ? Number(this.lavaderoServicioSelected.valorComision) : 0;
      this.correctoComision = true;
    }else {
      this.aplicaComision = false;
    }

    if(this.lavaderoServicioSelected.aplicaPromocion){
      this.aplicaPromocion = true;
      this.correctoPromocion = true;

      this.valorPromocionActual = this.lavaderoServicioSelected.aplicaPromocion ? Number(this.lavaderoServicioSelected.valorPromocion) : 0;
      this.valorReferenciaActual = this.lavaderoServicioSelected.aplicaPromocion ? Number(this.lavaderoServicioSelected.promocionNumeroRef) : 0;

      if(this.lavaderoServicioSelected.tipoPromocion.codigo === 1){
        console.log('Escogio obsequio');
        this.firstFormGroup.controls['valorPromocion'].disable();
        this.firstFormGroup.controls['valorPromocion'].setValue(1);
        this.fraseSegunPromocion = 'servicio de obsequio. ';
        this.escogioTipoPromocion = true;
      } else if(this.lavaderoServicioSelected.tipoPromocion.codigo === 2) {
        console.log('Escogio porcentaje');
        this.fraseSegunPromocion = '% de descuento en el proximo servicio. ';
        this.escogioTipoPromocion = true;
      }

    }else {
      this.aplicaPromocion = false;
    }

    this.valorPrecioEstandarActual = Number(this.lavaderoServicioSelected.precioEstandar);
    this.datosMonetariosCompletos = true;

    this.lavaderoSeleccionadoActual = this.lavaderoServicioSelected.lavadero;
    this.tipoServicioSeleccionadoActual = this.lavaderoServicioSelected.tipoServicio;
    this.seleccionoLavaderoActual = true;
    this.seleccionoTipoServicioActual = true;

    this.loadImageFromService(1);
    this.loadImageFromService(2);
    this.accion = 'MODIFICAR';
  }




  cambioPrecioEstandar(valor){
    console.log('Dentro de cambio precio estandar ...');
    this.valorPrecioEstandarActual = valor;
    this.validarDatosMentarios();
  }



  cambioAplicaComision(event){

    console.log('Dentro de cambio aplica comision...');

    console.log(event.checked);

    if(event.checked){
      console.log('Esta checkeado ...');
      this.aplicaComision = true;
    }else{
      this.aplicaComision = false;
    }

    this.validarDatosMentarios();
  }


  cambioAplicaPromocion(event){

    console.log('Dentro de cambio aplica promocion...');
    console.log(event.checked);

    if(event.checked){
      console.log('Esta checkeado ...');
      this.aplicaPromocion = true;
    }else{
      this.aplicaPromocion = false;
    }

    this.validarDatosMentarios();
  }


  cambioTipoPromocion(valor){
    console.log('Dentro de cambio tipo promocion ...');

    console.log(valor);

    if(valor === 1){
      console.log('Escogio obsequio');
      this.firstFormGroup.controls['valorPromocion'].disable();
      this.firstFormGroup.controls['valorPromocion'].setValue(1);
      this.valorPromocionActual = 1;
      this.fraseSegunPromocion = 'servicio de obsequio. ';
      this.escogioTipoPromocion = true;
    } else if(valor === 2) {
      console.log('Escogio porcentaje');
      this.firstFormGroup.controls['valorPromocion'].enable();
      this.fraseSegunPromocion = '% de descuento en el proximo servicio. ';
      this.escogioTipoPromocion = true;
    } else {
      console.log('Escogio ninguna');
      this.escogioTipoPromocion = false;
    }

    this.validarDatosMentarios();
  }


  cambioValorComision(valor){
    console.log('Dentro de cambio valor comision ...');
    this.valorComisionActual = valor;
    this.validarDatosMentarios();
  }



  cambioValorPromocion(valor){
    console.log('Dentro de cambio valor promocion ...');
    this.valorPromocionActual = valor;
    this.validarDatosMentarios();
  }


  cambioValorReferencia(valor){
    console.log('Dentro de cambio valor referencia ...');
    this.valorReferenciaActual = valor;
    this.validarDatosMentarios();
  }



  validarDatosMentarios(){
    console.log('Dentro de validar datos monetarios ...');

    if(this.aplicaComision){
      if(this.valorComisionActual && this.valorComisionActual >= 0){
        this.correctoComision = true;
      } else {
        this.correctoComision = false;
      }
    } else {
      this.correctoComision = true;
    }


    if(this.aplicaPromocion){
      if(this.valorPromocionActual && this.valorPromocionActual >= 0 && this.valorReferenciaActual && this.valorReferenciaActual >= 0){
        this.correctoPromocion = true;
      } else {
        this.correctoPromocion = false;
      }
    } else {
      this.correctoPromocion = true;
    }

    //Se valida
    if(this.correctoComision && this.correctoPromocion){
      this.datosMonetariosCompletos = true;
    } else {
      this.datosMonetariosCompletos = false;
    }


  }




  getTiposPromocion() {
    this._tipoPromocionService.cargarDisponibles()
      .subscribe(
        response => {
          console.log(response);

          let listaTemporal: TipoPromocion[] = response;

          for (let entry of listaTemporal) {
            if(entry.codigo != 3){
              this.tiposPromocionJSON.push(entry);
            }
          }

        },
        error =>  {
          console.log(<any>error);
        }
      );
  }



  loadImageFromService(numeroImagen: number) {

    //Lavadero
    if(numeroImagen == 1){
      this.isImageLoading1 = true;

      this._imageService.getImage(this.lavaderoSeleccionadoActual.imagen, 'lavadero').subscribe(data => {
        console.log('Data: ');
        console.log(data);
        this.createImageFromBlob(data, 1);
        this.isImageLoading1 = false;
        this.imageLoadedComplete1 = true;
      }, error => {
        this.isImageLoading1 = false;
        this.imageLoadedComplete1 = false;
        console.log(error);
      });
    }

    //Usuario
    if(numeroImagen == 2){
      this.isImageLoading2 = true;

      this._imageService.getImage(this.tipoServicioSeleccionadoActual.imagen, 'tipo-servicio').subscribe(data => {
        console.log('Data: ');
        console.log(data);
        this.createImageFromBlob(data, 2);
        this.isImageLoading2 = false;
        this.imageLoadedComplete2 = true;
      }, error => {
        this.isImageLoading2 = false;
        this.imageLoadedComplete2 = false;
        console.log(error);
      });
    }

  }

  createImageFromBlob(image: Blob, numeroImagen: number) {

    let urlCreator = window.URL;

    //Lavadero
    if(numeroImagen == 1){
      this.lavaderoSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow1 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }

    //Usuario
    if(numeroImagen == 2){
      this.tipoServicioSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow2 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }


  }




  createDataTable(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        url: "assets/data/datatables/spanish.json"
      },
      ajax: (dataTablesParameters: any, callback) => {

        this.dataTablesParameters = dataTablesParameters;
        this.callback = callback;

        this.renderDataTable(dataTablesParameters, callback);

      },
      columns: [
        { data: 'codigo' },
        { data: 'lavadero.nombre' },
        { data: 'tipoServicio.nombre' },
        { data: 'precioEstandar' },
        { data: 'valorComision' },
        { data: 'tipoPromocion.nombre' },
        { data: 'estado' }
      ],
      responsive: true,
    };

  }


  renderDataTable(dataTablesParameters: any, callback){
    console.log('Renderizando la tabla manualmente...');

    this._lavaderoServicioService.getDatatable(dataTablesParameters).subscribe(resp => {
      this.lavaderoServiciosList = resp.data;

      callback({
        recordsTotal: resp.recordsTotal,
        recordsFiltered: resp.recordsFiltered,
        data: []
      });
    });

  }


  changeState(codigo, estado, event: MatSlideToggleChange){
    console.log('Preguntar si esta seguro....');

    swal({
      title: 'Advertencia',
      text: GLOBAL.confirmacionCambiarEstado,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      if (result.value) {
        if(event.checked){
          this.cambiarEstado(codigo, 1, event);
        } else {
          this.cambiarEstado(codigo, 0, event);
        }
      }else {
        console.log('Volviendo a cambiar el control :::::');
        event.source.checked = !event.checked;
        event.checked = !event.checked;
      }
    })

  }


  /**
   * Cambia el estado del objeto
   * @param codigo
   * @param estado
   * @param event
   */
  cambiarEstado(codigo, estado, event: MatSlideToggleChange) {
    this._lavaderoServicioService.cambiarEstado(codigo, estado).subscribe(
      response => {
        if(response.exito === true && response.code === 200){
          this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');
        }else{

          swal({
            title: 'Algo a salido mal',
            text: GLOBAL.mensajeError,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: GLOBAL.primaryColor,
            confirmButtonText: 'Ok'
          }).then((value) => {
            console.log('Volviendo a cambiar el control :::::');
            event.source.checked = !event.checked;
            event.checked = !event.checked;
          });
        }
      },
      error => {
        swal({
          title: 'Algo a salido mal',
          text: GLOBAL.mensajeError,
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: GLOBAL.primaryColor,
          confirmButtonText: 'Ok'
        })
          .then((value) => {
            console.log('Volviendo a cambiar el control :::::');
            event.source.checked = !event.checked;
            event.checked = !event.checked;
          });
        console.log(<any>error);
      }
    );
  }




  buscarLavaderosDialog(){

    console.log('Buscando el lavadero ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion de Empresa',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaLavaderosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el lavadero');

          let lavaderoTemporal: Lavadero = data;

          if(lavaderoTemporal.codigo){
            console.log('Si es valido el lavadero');
            this.lavaderoSeleccionadoActual = lavaderoTemporal;
            this.seleccionoLavaderoActual = true;
            this.loadImageFromService(1);
            console.log(this.lavaderoSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.lavaderoSeleccionadoActual = null;
          this.seleccionoLavaderoActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }



  buscarTiposServiciosDialog(){

    console.log('Buscando los tipos de servicios ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Tipo de Servicio',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaTiposServiciosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el tipo de servicio');

          let tipoServicioTemporal: TipoServicio = data;

          if(tipoServicioTemporal.codigo){
            console.log('Si es valido el tipo servicio');
            this.tipoServicioSeleccionadoActual = tipoServicioTemporal;
            this.seleccionoTipoServicioActual = true;
            this.loadImageFromService(2);
            console.log(this.tipoServicioSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.tipoServicioSeleccionadoActual = null;
          this.seleccionoTipoServicioActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }



  adicionar() {

    console.log('Adicionando un servicio al lavadero un lavadero');

    let aplicaComi = this.firstFormGroup.controls['comision'].value === true ? 1 : 0;
    let valorComi: string;

    if(aplicaComi === 1){
      valorComi = this.firstFormGroup.controls['valorComision'].value;
    } else {
      valorComi = '0';
    }


    let aplicaProm = this.firstFormGroup.controls['promocion'].value === true ? 1 : 0;
    let valorProm: string;
    let valorRef: string;
    let tipoProm: number;

    if(aplicaProm === 1){
      valorProm = this.firstFormGroup.controls['valorPromocion'].value;
      valorRef = this.firstFormGroup.controls['valorReferencia'].value;
      tipoProm = this.firstFormGroup.controls['tipoPromocion'].value;
    } else {
      valorProm = '0';
      valorRef = '0';
      tipoProm = GLOBAL.tipoPromocionNoAplica;
    }

    let objetoProcesado: LavaderoServicio = new LavaderoServicio(
      null,
      this.lavaderoSeleccionadoActual,
      this.tipoServicioSeleccionadoActual,
      aplicaComi,
      valorComi,
      aplicaProm,
      new TipoPromocion(tipoProm, null, null, null),
      valorRef,
      valorProm,
      this.firstFormGroup.controls['precioEstandar'].value,
      null,
      null
    );

    console.log('Personal Lavadero Procesado:: ');
    console.log(objetoProcesado);


    this._lavaderoServicioService.agregar(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.accion = 'NINGUNA';
            this.limpiarValores();
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');
          this.renderDataTable(this.dataTablesParameters, this.callback);

          if(error.status === 400){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }

        }
      );

  }



  editar(){
    console.log('Modificando un lavadero servicio');

    console.log(this.firstFormGroup);

    let aplicaComi = this.firstFormGroup.controls['comision'].value === true ? 1 : 0;
    let valorComi: string;

    if(aplicaComi === 1){
      valorComi = this.firstFormGroup.controls['valorComision'].value;
    } else {
      valorComi = '0';
    }


    let aplicaProm = this.firstFormGroup.controls['promocion'].value === true ? 1 : 0;
    let valorProm: string;
    let valorRef: string;
    let tipoProm: number;

    if(aplicaProm === 1){
      valorProm = this.firstFormGroup.controls['valorPromocion'].value;
      valorRef = this.firstFormGroup.controls['valorReferencia'].value;
      tipoProm = this.firstFormGroup.controls['tipoPromocion'].value;
    } else {
      valorProm = '0';
      valorRef = '0';
      tipoProm = GLOBAL.tipoPromocionNoAplica;
    }

    let objetoProcesado: LavaderoServicio = new LavaderoServicio(
      this.lavaderoServicioSelected.codigo,
      this.lavaderoSeleccionadoActual,
      this.tipoServicioSeleccionadoActual,
      aplicaComi,
      valorComi,
      aplicaProm,
      new TipoPromocion(tipoProm, null, null, null),
      valorRef,
      valorProm,
      this.firstFormGroup.controls['precioEstandar'].value,
      null,
      null
    );



    console.log('Objeto');
    console.log(objetoProcesado);

    this._lavaderoServicioService.editar(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se edito correctamente');
            this.accion = 'NINGUNA';
            this.lavaderoServicioSelected = null;
            this.limpiarValores();
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');
          this.renderDataTable(this.dataTablesParameters, this.callback);
          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
        }
      );

  }




  limpiarValores(){
    console.log('Limpiar los valores del servicio del lavadero anterior');
    this.lavaderoSeleccionadoActual = null;
    this.seleccionoLavaderoActual = false;
    this.tipoServicioSeleccionadoActual = null;
    this.seleccionoTipoServicioActual = false;

    this.valorPrecioEstandarActual = 0;

    this.aplicaComision = false;
    this.valorComisionActual = 0;

    this.aplicaPromocion = false;
    this.escogioTipoPromocion = false;
    this.valorReferenciaActual = 0;
    this.valorPromocionActual = 0;

    this.datosMonetariosCompletos = false;

    this.correctoComision = false;
    this.correctoPromocion = false;
  }



  eliminarObject(){
    console.log('Preguntar si va a eliminar');

    swal({
      title: 'Esta seguro?',
      text: "Una vez eliminado, no se podra recuperar!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      console.log(result);
      if (result.value) {
        console.log('Eliminar si');
        this.eliminar();
      }
    })

  }



  eliminar(){
    console.log('Eliminando usuario');

    console.log('CODIGO: ' + this.lavaderoServicioSelected.codigo);

    this._lavaderoServicioService.delete(this.lavaderoServicioSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se elimino correctamente');
            this.lavaderoServicioSelected = null;
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
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



// DESELECCIONAR FILA
  quitarSeleccionFila(){
    this.rowSelected = '0';
    this.someClickHandler(null);
  }



// PARA SACAR LA INFORMACION DE CADA FILA
  someClickHandler(rowInfo: any): void {

    //valida que sea una fila seleccionada (Que este actualmente seleccionada)
    if(rowInfo != null){
      // El usuario de la fila es valido
      this.lavaderoServicioSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }

    } else {
      // El usuario ha deseleccionado la fila
      this.lavaderoServicioSelected = null;
      this.accion = 'NINGUNA';
    }

  }


// EVENTO PARA EL CLIC EN CADA FILA
  ClickRow(rowCodigo, element: any) {
    this.row = rowCodigo;

    // valida si es la misma fila (la deselecciono)
    if (element === this.rowSelected) {
      this.rowSelected = '0';
      this.someClickHandler(null);
    } else {
      this.rowSelected = element;
      this.someClickHandler(this.lavaderoServiciosList[rowCodigo]);
    }

  }



}
