import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FuncionarioServicio} from '../../models/FuncionarioServicio';
import {FuncionarioServicioService} from '../../services/funcionarioServicio/funcionarioServicio.service';
import {Usuario} from '../../models/usuario';
import {TipoServicio} from '../../models/TipoServicio';
import {DialogBusquedaTecnicosComponent} from '../../dialogs-app/busqueda/tecnicos/dialog-busqueda-tecnicos.component';
import {DialogBusquedaTiposServiciosComponent} from '../../dialogs-app/busqueda/tipos-servicios/dialog-busqueda-tipos-servicios.component';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {DialogBusquedaTiposLiquidacionesComponent} from '../../dialogs-app/busqueda/tipos-liquidaciones/dialog-busqueda-tipos-liquidaciones.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoPagoService} from '../../services/tipoPago/tipoPago.service';
import {TipoPromocion} from '../../models/TipoPromocion';
import {TipoPago} from '../../models/TipoPago';



@Component({
  selector: 'app-administrador-funcionario-servicio',
  templateUrl: './funcionario-servicio.component.html',
  styleUrls: ['./funcionario-servicio.component.css']
})

export class FuncionarioServicioComponent implements OnInit {

  dtOptions: any = {};
  funcionarioServiciosList: FuncionarioServicio[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public funcionarioServicioSelected: FuncionarioServicio;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;


  isLinear: boolean;
  accion: string;

  usuarioSeleccionadoActual: Usuario;
  tipoServicioSeleccionadoActual: TipoServicio;
  tipoLiquidacionSeleccionadoActual: TipoLiquidacion;


  seleccionoUsuarioActual: boolean;
  seleccionoTipoServicioActual: boolean;
  seleccionoTipoLiquidacionActual: boolean;


  objectImageToShow1: any;
  isImageLoading1: boolean;
  imageLoadedComplete1: boolean;

  objectImageToShow2: any;
  isImageLoading2: boolean;
  imageLoadedComplete2: boolean;

  firstFormGroup: FormGroup;
  tiposPagoJSON: TipoPago[] = [];


  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _funcionarioServicioService: FuncionarioServicioService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private _tipoPagoService: TipoPagoService) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.seleccionoUsuarioActual = false;
    this.seleccionoTipoServicioActual = false;
    this.seleccionoTipoLiquidacionActual = false;

    this.createDataTable();

    this.getTiposPago();

    this.objectImageToShow1 = null;
    this.isImageLoading1 = true;
    this.imageLoadedComplete1 = false;

    this.objectImageToShow2 = null;
    this.isImageLoading2 = true;
    this.imageLoadedComplete2 = false;

  }

  mostrarSeccionAdicionar(){
    console.log('Mostrando seccion adicionar');

    this.firstFormGroup = this.formBuilder.group({
      tipoPago: [null, Validators.compose([Validators.required])],
      valorPago: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })

    this.accion = 'ADICIONAR';
  }


  mostrarSeccionModificar(){
    console.log('Mostrando seccion modificar');

    this.firstFormGroup = this.formBuilder.group({
      tipoPago: [this.funcionarioServicioSelected.tipoPago.codigo, Validators.compose([Validators.required])],
      valorPago: [this.funcionarioServicioSelected.valorPago, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })

    this.usuarioSeleccionadoActual = this.funcionarioServicioSelected.usuario;
    this.tipoServicioSeleccionadoActual = this.funcionarioServicioSelected.tipoServicio;
    this.tipoLiquidacionSeleccionadoActual = this.funcionarioServicioSelected.tipoLiquidacion;
    this.seleccionoUsuarioActual = true;
    this.seleccionoTipoServicioActual = true;
    this.seleccionoTipoLiquidacionActual = true;

    this.loadImageFromService(1);
    this.loadImageFromService(2);
    this.accion = 'MODIFICAR';
  }



  getTiposPago() {
    this._tipoPagoService.cargarDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.tiposPagoJSON = response;
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

      this._imageService.getImage(this.usuarioSeleccionadoActual.imagen, 'usuario').subscribe(data => {
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

    //Usuario
    if(numeroImagen == 1){
      this.usuarioSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow1 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }


    //Lavadero
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
        { data: 'usuario.nombre1' },
        { data: 'usuario.apellido1' },
        { data: 'usuario.identificacion' },
        { data: 'tipoServicio.nombre' },
        { data: 'tipoLiquidacion.nombre' },
        { data: 'estado' }
      ],
      responsive: true,
    };

  }


  renderDataTable(dataTablesParameters: any, callback){
    console.log('Renderizando la tabla manualmente...');

    this._funcionarioServicioService.getDatatable(dataTablesParameters).subscribe(resp => {
      this.funcionarioServiciosList = resp.data;

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
    this._funcionarioServicioService.cambiarEstado(codigo, estado).subscribe(
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




  buscarUsuariosTecnicosDialog(){

    console.log('Buscando el usuario ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Tecnico',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaTecnicosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el usuario');

          let usuarioTemporal: Usuario = data;

          if(usuarioTemporal.codigo){
            console.log('Si es valido el usuario');
            this.usuarioSeleccionadoActual = usuarioTemporal;
            this.seleccionoUsuarioActual = true;
            this.loadImageFromService(1);
            console.log(this.usuarioSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.usuarioSeleccionadoActual = null;
          this.seleccionoUsuarioActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }



  buscarTipoServicioDialog(){

    console.log('Buscando el tipo servicio ...');
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
          console.log('Si escogio el lavadero');

          let tipoServicioTemporal: TipoServicio = data;

          if(tipoServicioTemporal.codigo){
            console.log('Si es valido el lavadero');
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



  buscarTipoLiquidacionDialog(){

    console.log('Buscando el tipo de liquidacion ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Tipo de Liquidacion',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaTiposLiquidacionesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el tipo liquidacion');

          let tipoLiquidacionTemporal: TipoLiquidacion = data;

          if(tipoLiquidacionTemporal.codigo){
            console.log('Si es valido el tipo liqudiacoin');
            this.tipoLiquidacionSeleccionadoActual = tipoLiquidacionTemporal;
            this.seleccionoTipoLiquidacionActual = true;
            console.log(this.tipoLiquidacionSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.tipoLiquidacionSeleccionadoActual = null;
          this.seleccionoTipoLiquidacionActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }





  adicionar() {

    console.log('Adicionando una vinculacion de personal a un lavadero');

    let objetoProcesado: FuncionarioServicio = new FuncionarioServicio(
      null,
      this.usuarioSeleccionadoActual,
      this.tipoServicioSeleccionadoActual,
      this.tipoLiquidacionSeleccionadoActual,
      null,
      null,
      new TipoPago(this.firstFormGroup.controls['tipoPago'].value, null, null, null),
      this.firstFormGroup.controls['valorPago'].value
    );

    console.log('Funcionario Servoicio Procesado:: ');
    console.log(objetoProcesado);

    this._funcionarioServicioService.agregar(objetoProcesado)
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
    console.log('Modificando un FUNCIONARIO servicio');

    let objetoProcesado: FuncionarioServicio = new FuncionarioServicio(
      this.funcionarioServicioSelected.codigo,
      this.usuarioSeleccionadoActual,
      this.tipoServicioSeleccionadoActual,
      this.tipoLiquidacionSeleccionadoActual,
      null,
      null,
      new TipoPago(this.firstFormGroup.controls['tipoPago'].value, null, null, null),
      this.firstFormGroup.controls['valorPago'].value
    );

    console.log('Funcionario Servoicio Procesado:: ');
    console.log(objetoProcesado);

    this._funcionarioServicioService.editar(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se edito correctamente');
            this.accion = 'NINGUNA';
            this.funcionarioServicioSelected = null;
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
    console.log('Limpiar los valores ');
    this.usuarioSeleccionadoActual = null;
    this.tipoServicioSeleccionadoActual = null;
    this.tipoLiquidacionSeleccionadoActual = null;

    this.seleccionoUsuarioActual = false;
    this.seleccionoTipoServicioActual = false;
    this.seleccionoTipoLiquidacionActual = false;
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

    console.log('CODIGO: ' + this.funcionarioServicioSelected.codigo);

    this._funcionarioServicioService.delete(this.funcionarioServicioSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.funcionarioServicioSelected = null;
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
      this.funcionarioServicioSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }


    } else {
      // El usuario ha deseleccionado la fila
      this.funcionarioServicioSelected = null;
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
      this.someClickHandler(this.funcionarioServiciosList[rowCodigo]);
    }

  }



}
