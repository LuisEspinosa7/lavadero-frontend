import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import {PersonalLavadero} from '../../models/PersonalLavadero';
import {PersonalLavaderoService} from '../../services/personalLavadero/personalLavadero.service';
import {Lavadero} from '../../models/lavadero';
import {Usuario} from '../../models/usuario';
import {DialogBusquedaLavaderoComponent} from './dialog-busqueda-lavaderos/dialog-busqueda-lavaderos.component';
import {DialogBusquedaUsuariosComponent} from '../../dialogs-app/busqueda/usuarios/dialog-busqueda-usuarios.component';
import {DialogBusquedaLavaderosComponent} from '../../dialogs-app/busqueda/lavaderos/dialog-busqueda-lavaderos.component';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-administrador-personal-lavadero',
  templateUrl: './personal-lavadero.component.html',
  styleUrls: ['./personal-lavadero.component.css']
})

export class PersonalLavaderoComponent implements OnInit {

  dtOptions: any = {};
  personalLavaderoList: PersonalLavadero[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public personalLavaderoSelected: PersonalLavadero;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;

  isLinear: boolean;
  accion: string;

  lavaderoSeleccionadoActual: Lavadero;
  usuarioSeleccionadoActual: Usuario;

  seleccionoLavaderoActual: boolean;
  seleccionoUsuarioActual: boolean;


  objectImageToShow1: any;
  isImageLoading1: boolean;
  imageLoadedComplete1: boolean;

  objectImageToShow2: any;
  isImageLoading2: boolean;
  imageLoadedComplete2: boolean;


  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _personalLavaderoService: PersonalLavaderoService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.seleccionoLavaderoActual = false;
    this.seleccionoUsuarioActual = false;
    this.createDataTable();

    this.objectImageToShow1 = null;
    this.isImageLoading1 = true;
    this.imageLoadedComplete1 = false;

    this.objectImageToShow2 = null;
    this.isImageLoading2 = true;
    this.imageLoadedComplete2 = false;
  }

  mostrarSeccionAdicionar(){
    console.log('Mostrando seccion adicionar');
    this.accion = 'ADICIONAR';
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

      this._imageService.getImage(this.usuarioSeleccionadoActual.imagen, 'usuario').subscribe(data => {
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
      this.usuarioSeleccionadoActual.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
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
        { data: 'usuario.nombre1' },
        { data: 'usuario.apellido1' },
        { data: 'usuario.identificacion' },
        { data: 'estado' }
      ],
      responsive: true,
    };

  }


  renderDataTable(dataTablesParameters: any, callback){
    console.log('Renderizando la tabla manualmente...');

    this._personalLavaderoService.getLavaderoDatatable(dataTablesParameters).subscribe(resp => {
    this.personalLavaderoList = resp.data;

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
    this._personalLavaderoService.cambiarEstado(codigo, estado).subscribe(
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



  buscarUsuariosDialog(){

    console.log('Buscando el usuario ...');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    dialogConfig.data = {
      title: 'Seleccion del Usuario',
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
            this.loadImageFromService(2);
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










  adicionar() {

    console.log('Adicionando una vinculacion de personal a un lavadero');

    let objetoProcesado: PersonalLavadero = new PersonalLavadero(
      null,
      this.lavaderoSeleccionadoActual,
      this.usuarioSeleccionadoActual,
      null
    );

    console.log('Personal Lavadero Procesado:: ');
    console.log(objetoProcesado);

    this._personalLavaderoService.agregar(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.accion = 'NINGUNA';
            this.limpiarValoresVinculacion();
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


  limpiarValoresVinculacion(){
    console.log('Limpiar los valores de la vinculacion anterior');
    this.lavaderoSeleccionadoActual = null;
    this.seleccionoLavaderoActual = false;
    this.usuarioSeleccionadoActual = null;
    this.seleccionoUsuarioActual = false;
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

    console.log('CODIGO: ' + this.personalLavaderoSelected.codigo);

    this._personalLavaderoService.delete(this.personalLavaderoSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
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
      this.personalLavaderoSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }

    } else {
      // El usuario ha deseleccionado la fila
      this.personalLavaderoSelected = null;
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
      this.someClickHandler(this.personalLavaderoList[rowCodigo]);
    }

  }



}
