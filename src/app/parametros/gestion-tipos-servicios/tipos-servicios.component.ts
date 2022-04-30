import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';

import { TipoVehiculo } from '../../models/TipoVehiculo';
import {TipoServicioService} from '../../services/tipoServicio/tipoServicio.service';
import {DialogTipoServicioComponent} from './dialog-tipo-servicio/dialog-tipo-servicio.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TipoServicio} from '../../models/TipoServicio';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}



@Component({
  selector: 'app-administrador-tipos-servicios',
  templateUrl: './tipos-servicios.component.html',
  styleUrls: ['./tipos-servicios.component.css']
})

export class TiposServiciosComponent implements OnInit {

  dtOptions: any = {};
  tiposServicios: TipoVehiculo[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public tipoServicioSelected: TipoVehiculo;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear: boolean;

  selectedFile: File;
  seleccionoFile: boolean;
  accion: string;

  objectImageToShow: any;

  isImageLoading: boolean;
  imageLoadedComplete: boolean;

  message: string;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _tipoServicioService: TipoServicioService,
              private formBuilder: FormBuilder,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.message = 'Por favor seleccione una imagen de los siguientes tipos (PNG, JPG, JPEG)';
    this.createDataTable();
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

    this.accion = 'ADICIONAR';

    this.firstFormGroup = this.formBuilder.group({
      nombre: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      descripcion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])]
    })

    this.secondFormGroup = this.formBuilder.group({
      fileSelected: [null, Validators.compose([Validators.required])]
    })

    this.seleccionoFile = false;
    this.objectImageToShow = null;
    this.isImageLoading = true;
    this.imageLoadedComplete = false;
  }


  iniciarFormulariosParaModificar() {
    console.log('Iniciando Formularios para modificar');


    this.firstFormGroup = this.formBuilder.group({
      nombre: [this.tipoServicioSelected.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      descripcion: [this.tipoServicioSelected.descripcion, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])]
    })

    this.secondFormGroup = this.formBuilder.group({
      fileSelected: [null, Validators.compose([Validators.required])]
    })

    this.loadImageFromService();
    this.accion = 'MODIFICAR';
  }


  loadImageFromService() {

    this.isImageLoading = true;
    this._imageService.getImage(this.tipoServicioSelected.imagen, 'tipo-servicio').subscribe(data => {
      console.log('Data: ');
      console.log(data);
      let extension = this.tipoServicioSelected.imagen.split('.')[1];
      let fileTransformed = this.blobToFile(data, this.tipoServicioSelected.imagen, extension);
      console.log(fileTransformed);
      this.selectedFile = fileTransformed;
      console.log(this.selectedFile);

      this.createImageFromBlob(data);
      this.isImageLoading = false;
      this.imageLoadedComplete = true;
      this.seleccionoFile = true;
    }, error => {
      this.isImageLoading = false;
      this.imageLoadedComplete = false;
      console.log(error);
    });

  }


  public blobToFile = (theBlob: Blob, fileName:string, extension: string): File => {
    console.log('Name: ' + fileName);
    console.log('Extension: ' + extension);
    console.log('Name: ' + fileName);

    let extensionEscogida: string = null;

    if(extension == 'jpg'){
      extensionEscogida = 'jpeg';
    }else if(extension == 'png'){
      extensionEscogida = 'png';
    }

    let extensionCompuesta: string = 'image/' + extensionEscogida;
    let file = new File([theBlob], fileName, {type: extensionCompuesta, lastModified: Date.now()});
    return file;
  }


  createImageFromBlob(image: Blob) {
    let urlCreator = window.URL;
    this.tipoServicioSelected.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    this.objectImageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
  }


  onFileChanged(event) {
    console.log('Dentro del file changed');

    if(event.target.files[0]) {

      // Validacion del tipo
      let mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Solo imagenes (PNG, JPG, JPEG) soportadas.';
        return;
      }else {
        this.message = 'Por favor seleccione una imagen de los siguientes tipos (PNG, JPG, JPEG)';

        this.seleccionoFile = true;
        this.selectedFile = event.target.files[0];

        let reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        console.log('Antes del evneto');

        reader.onload = (_event) => {
          console.log('Dentro del evneto');
          this.objectImageToShow = reader.result;
          this.isImageLoading = false;
          this.imageLoadedComplete = true;
        }

      }


    } else {
      this.seleccionoFile = false;
      this.objectImageToShow = null;
      this.isImageLoading = true;
      this.imageLoadedComplete = false;
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
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'estado' }
      ],
      responsive: true,

    };

  }


  renderDataTable(dataTablesParameters: any, callback){
    console.log('Renderizando la tabla manualmente...');

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    this.http
      .post<DataTablesResponse>(
        GLOBAL.urlBackend + '/tipoServicio/datatable',
        dataTablesParameters, {headers}
      ).subscribe(resp => {

      console.log('Imprimir datos');
      console.log(resp);
      this.tiposServicios = resp.data;

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
    this._tipoServicioService.cambiarEstado(codigo, estado).subscribe(
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



  editar(){
    console.log('Modificando un tipo de servicio');

    console.log(this.firstFormGroup);
    console.log(this.selectedFile);

    let tipoServicioProcesado: TipoServicio = new TipoServicio(
      this.tipoServicioSelected.codigo,
      this.firstFormGroup.controls['nombre'].value,
      this.firstFormGroup.controls['descripcion'].value,
      null,
      null,
      null);

    console.log('TipoVehiculo');
    console.log(tipoServicioProcesado);

    this._tipoServicioService.editar(tipoServicioProcesado, this.selectedFile)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se edito correctamente');
            this.accion = 'NINGUNA';
            this.tipoServicioSelected = null;
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





  adicionar() {

    console.log('Adicionando un tipo de servicio');

    console.log(this.firstFormGroup);
    console.log(this.selectedFile);


    let tipoServicioProcesado: TipoServicio = new TipoServicio(
      null,
      this.firstFormGroup.controls['nombre'].value,
      this.firstFormGroup.controls['descripcion'].value,
      null,
      null,
      null);

    console.log('TipoServicio');
    console.log(tipoServicioProcesado);

    this._tipoServicioService.agregar(tipoServicioProcesado, this.selectedFile)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.accion = 'NINGUNA';
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




  eliminarObjeto(){
    console.log('Preguntar si va a eliminar');

    this.accion = 'ELIMINAR';

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

    console.log('CODIGO: ' + this.tipoServicioSelected.codigo);

    this._tipoServicioService.delete(this.tipoServicioSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.tipoServicioSelected = null;
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
      this.tipoServicioSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }

    } else {
      // El usuario ha deseleccionado la fila
      this.tipoServicioSelected = null;
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
      this.someClickHandler(this.tiposServicios[rowCodigo]);
    }

  }



}
