import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import {Usuario} from '../../models/usuario';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClienteVehiculo} from '../../models/ClienteVehiculo';
import {ClienteVehiculoService} from '../../services/clienteVehiculo/clienteVehiculo.service';
import {TipoServicio} from '../../models/TipoServicio';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {TipoVehiculo} from '../../models/TipoVehiculo';
import {Marca} from '../../models/Marca';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogBusquedaTecnicosComponent} from '../../dialogs-app/busqueda/tecnicos/dialog-busqueda-tecnicos.component';
import {DialogBusquedaUsuariosComponent} from '../../dialogs-app/busqueda/usuarios/dialog-busqueda-usuarios.component';
import {DialogBusquedaTiposServiciosComponent} from '../../dialogs-app/busqueda/tipos-servicios/dialog-busqueda-tipos-servicios.component';
import {DialogBusquedaTiposVehiculosComponent} from '../../dialogs-app/busqueda/tipos-vehiculos/dialog-busqueda-tipos-vehiculos.component';
import {DialogBusquedaMarcasComponent} from '../../dialogs-app/busqueda/marcas/dialog-busqueda-marcas.component';


@Component({
  selector: 'app-administrador-gestion-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})

export class VehiculosComponent implements OnInit {

  firstFormGroup: FormGroup;
  busquedaFormGroup: FormGroup;
  isLinear: boolean;
  accion: string;
  message: string;
  loadingVehiculo: boolean;
  vehiculoEncontradoObj: ClienteVehiculo;
  vehiculoEncontrado: boolean;


  usuarioSeleccionadoActual: Usuario;
  tipoVehiculoSeleccionadoActual: TipoVehiculo;
  marcaSeleccionadoActual: Marca;


  seleccionoUsuarioActual: boolean;
  seleccionoTipoVehiculoActual: boolean;
  seleccionoMarcaActual: boolean;

  objectImageToShow1: any;
  isImageLoading1: boolean;
  imageLoadedComplete1: boolean;

  objectImageToShow2: any;
  isImageLoading2: boolean;
  imageLoadedComplete2: boolean;

  objectImageToShow3: any;
  isImageLoading3: boolean;
  imageLoadedComplete3: boolean;



  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _userService: UserService,
              private formBuilder: FormBuilder,
              private _clienteVehiculoService: ClienteVehiculoService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.message = 'Por favor digite el documento';
    this.vehiculoEncontrado = false;

    this.seleccionoUsuarioActual = false;
    this.seleccionoTipoVehiculoActual = false;
    this.seleccionoMarcaActual = false;

    this.objectImageToShow1 = null;
    this.isImageLoading1 = true;
    this.imageLoadedComplete1 = false;

    this.objectImageToShow2 = null;
    this.isImageLoading2 = true;
    this.imageLoadedComplete2 = false;

    this.objectImageToShow3 = null;
    this.isImageLoading3 = true;
    this.imageLoadedComplete3 = false;

    this.isLinear = true;
    this.loadingVehiculo = false;
  }


  mostrarSeccionAdicionar(){
    console.log('Mostrando seccion adicionar');

    this.limpiarValores();

    this.iniciarFormulariosParaCreacion();
  }

  mostrarSeccionBuscar(){
    console.log('Mostrando seccion buscar');

    this.limpiarValores();

    this.busquedaFormGroup = this.formBuilder.group({
      plac: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])]
    })

    this.accion = 'BUSCAR';
  }


  iniciarFormulariosParaCreacion(){
    console.log('Iniciando Formularios para creacion');

    this.firstFormGroup = this.formBuilder.group({
      placa: [null, Validators.compose([Validators.required])],
      kilometraje: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })

    this.accion = 'ADICIONAR';
  }


  iniciarFormulariosParaModificar(){
    console.log('Iniciando Formularios para modificar');

    this.firstFormGroup = this.formBuilder.group({
      placa: [this.vehiculoEncontradoObj.placa, Validators.compose([Validators.required])],
      kilometraje: [this.vehiculoEncontradoObj.kilometraje, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    })

    this.firstFormGroup.controls['placa'].disable();

    this.usuarioSeleccionadoActual = this.vehiculoEncontradoObj.usuario;
    this.seleccionoUsuarioActual = true;

    this.tipoVehiculoSeleccionadoActual = this.vehiculoEncontradoObj.tipoVehiculo;
    this.seleccionoTipoVehiculoActual = true;

    this.marcaSeleccionadoActual = this.vehiculoEncontradoObj.marca;
    this.seleccionoMarcaActual = true;

    this.loadImageFromService(1);
    this.loadImageFromService(2);
    this.loadImageFromService(3);
    this.accion = 'MODIFICAR';
  }


  loadImageFromService(numeroImagen: number) {

    //Cliente
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


    //Tipo Vehiculo
    if(numeroImagen == 2){
      this.isImageLoading2 = true;

      this._imageService.getImage(this.tipoVehiculoSeleccionadoActual.imagen, 'tipo-vehiculo').subscribe(data => {
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


    //Marca
    if(numeroImagen == 3){
      this.isImageLoading3 = true;

      this._imageService.getImage(this.marcaSeleccionadoActual.imagen, 'marca').subscribe(data => {
        console.log('Data: ');
        console.log(data);
        this.createImageFromBlob(data, 3);
        this.isImageLoading3 = false;
        this.imageLoadedComplete3 = true;
      }, error => {
        this.isImageLoading3 = false;
        this.imageLoadedComplete3 = false;
        console.log(error);
      });
    }


  }

  createImageFromBlob(image: Blob, numeroImagen: number) {

    let urlCreator = window.URL;

    //Cliente
    if(numeroImagen == 1){
      this.usuarioSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow1 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }


    //Tipo Vehiculo
    if(numeroImagen == 2){
      this.tipoVehiculoSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow2 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }

    //Marca
    if(numeroImagen == 3){
      this.marcaSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
      this.objectImageToShow3 = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    }

  }



  /**
   * Buscar un vehiculo
   */
  buscarVehiculo(){
    console.log('Buscando un vehiculo');

    this.loadingVehiculo = true;

    let placaT: string = this.busquedaFormGroup.controls['plac'].value;

    let placa = placaT.toUpperCase();


    this._clienteVehiculoService.buscarVehiculo(placa)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingVehiculo = false;
            this.vehiculoEncontradoObj = response.data;
            console.log(this.vehiculoEncontradoObj);
            this.vehiculoEncontrado = true;
            this.accion = 'BUSCAR';
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingVehiculo = false;
            this.vehiculoEncontrado = false;
            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          this.loadingVehiculo = false;
          this.vehiculoEncontrado = false;
          console.log('Ocurrio un error');

          if(error.status === 404){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }


        }
      );


  }


  cargarVehiculoUpdate() {
    console.log('Cargando el Vehiculo Para actualizacion ...');
    this.iniciarFormulariosParaModificar();
  }


  updateVehiculo(){
    console.log('Actualizar el Vehiculo ...');

    console.log(this.firstFormGroup);

    let placaT: string = this.firstFormGroup.controls['placa'].value;

    let placa = placaT.toUpperCase();

    let objetoProcesado: ClienteVehiculo = new ClienteVehiculo(
      this.vehiculoEncontradoObj.codigo,
      this.usuarioSeleccionadoActual,
      this.tipoVehiculoSeleccionadoActual,
      this.marcaSeleccionadoActual,
      placa,
      this.firstFormGroup.controls['kilometraje'].value,
      null,
      null
    );

    console.log('Vehiculo');
    console.log(objetoProcesado);

    this._clienteVehiculoService.actualizarVehiculo(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.mostrarSeccionBuscar();
            this.limpiarValores();
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          if(error.status === 400){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }

        }
      );

  }





  buscarClientesDialog(){

    console.log('Buscando el cliente ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Cliente',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaUsuariosComponent, dialogConfig);

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



  buscarTipoVehiculosDialog(){

    console.log('Buscando el tipo vehiculo ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Tipo de Vehiculo',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaTiposVehiculosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el tipo vehiculo');

          let tipoVehiculoTemporal: TipoVehiculo = data;

          if(tipoVehiculoTemporal.codigo){
            console.log('Si es valido el tipo vehiculo');
            this.tipoVehiculoSeleccionadoActual = tipoVehiculoTemporal;
            this.seleccionoTipoVehiculoActual = true;
            this.loadImageFromService(2);
            console.log(this.tipoVehiculoSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.tipoVehiculoSeleccionadoActual = null;
          this.seleccionoTipoVehiculoActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }



  buscarMarcasDialog(){

    console.log('Buscando la marca ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion de la Marca',
      accion: 'Confirmar'
    };

    const dialogRef = this.dialog.open(DialogBusquedaMarcasComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si escogio el tipo vehiculo');

          let marcaTemporal: Marca = data;

          if(marcaTemporal.codigo){
            console.log('Si es valido el tipo vehiculo');
            this.marcaSeleccionadoActual = marcaTemporal;
            this.seleccionoMarcaActual = true;
            this.loadImageFromService(3);
            console.log(this.marcaSeleccionadoActual);
          }

        } else{
          console.log('Digito cancelar');
          this.marcaSeleccionadoActual = null;
          this.seleccionoMarcaActual = false;
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );

  }


  /**
   * Adiciona un nuevo cliente
   */

  adicionar() {

    console.log('Adicionando un vehiculo');
    console.log(this.firstFormGroup);

    let placaT: string = this.firstFormGroup.controls['placa'].value;

    let placa = placaT.toUpperCase();

    let objetoProcesado: ClienteVehiculo = new ClienteVehiculo(
      null,
      this.usuarioSeleccionadoActual,
      this.tipoVehiculoSeleccionadoActual,
      this.marcaSeleccionadoActual,
      placa,
      this.firstFormGroup.controls['kilometraje'].value,
      null,
      null
      );

    console.log('Vehiculo');
    console.log(objetoProcesado);

    this._clienteVehiculoService.crearVehiculo(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.mostrarSeccionBuscar();
            this.limpiarValores();
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');

          if(error.status === 400){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }

        }
      );

  }


  limpiarValores(){
    console.log('Limpiar los valores ');
    this.usuarioSeleccionadoActual = null;
    this.tipoVehiculoSeleccionadoActual = null;
    this.marcaSeleccionadoActual = null;

    this.seleccionoUsuarioActual = false;
    this.seleccionoTipoVehiculoActual = false;
    this.seleccionoMarcaActual = false;

    this.vehiculoEncontradoObj = null;
    this.vehiculoEncontrado = false;
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
