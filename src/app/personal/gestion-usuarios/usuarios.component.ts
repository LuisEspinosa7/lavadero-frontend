import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import { TipoVehiculo } from '../../models/TipoVehiculo';
import {Usuario} from '../../models/usuario';
import {UserService} from '../../services/user/user.service';
import {DialogUsuarioComponent} from './dialog-usuario/dialog-usuario.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoIdentificacion} from '../../models/tipoIdentificacion';
import {TipoIdentificacionService} from '../../services/tipoIdentificacion/tipoIdentificacion.service';
import {RolService} from '../../services/rol/rol.service';
import {Rol} from '../../models/rol';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Marca} from '../../models/Marca';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}



@Component({
  selector: 'app-administrador-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {

  dtOptions: any = {};
  usuarios: Usuario[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public usuarioSelected: Usuario;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear: boolean;

  tiposIdentificacionJSON: TipoIdentificacion[];
  selectedTipoIdentificacion: number;

  rolesJSON: Rol[] = [];

  selectedFile: File;
  seleccionoFile: boolean;
  accion: string;

  objectImageToShow: any;

  isImageLoading: boolean;
  imageLoadedComplete: boolean;

  message: string;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _userService: UserService,
              private formBuilder: FormBuilder,
              private _tiposIdentificacionService: TipoIdentificacionService,
              private _rolesService: RolService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.message = 'Por favor seleccione una imagen de los siguientes tipos (PNG, JPG, JPEG)';
    this.isLinear = true;
    this.seleccionoFile = false;
    this.createDataTable();

    this.getTiposIdentificacion();
    this.getRoles();
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
      nombre1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      nombre2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      apellido1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      apellido2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      tipoIdentificacion: [null, Validators.compose([Validators.required])],
      identificacion: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      direccion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      telefono: [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      email: [null, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      roles: [null, Validators.compose([Validators.required])]
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

    let codigosRoles: number[] = [];

    for (let entry of this.usuarioSelected.roles) {
      codigosRoles.push(entry.codigo);
    }

    this.firstFormGroup = this.formBuilder.group({
      nombre1: [this.usuarioSelected.nombre1, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      nombre2: [this.usuarioSelected.nombre2, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      apellido1: [this.usuarioSelected.apellido1, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      apellido2: [this.usuarioSelected.apellido2, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      tipoIdentificacion: [this.usuarioSelected.tipoIdentificacion.codigo, Validators.compose([Validators.required])],
      identificacion: [this.usuarioSelected.identificacion, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      direccion: [this.usuarioSelected.direccion, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      telefono: [this.usuarioSelected.telefono, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      email: [this.usuarioSelected.email, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      roles: [codigosRoles, Validators.compose([Validators.required])]
    })

    this.secondFormGroup = this.formBuilder.group({
      fileSelected: [null, Validators.compose([Validators.required])]
    })


    this.loadImageFromService();
    this.accion = 'MODIFICAR';
  }


  loadImageFromService() {
    this.isImageLoading = true;
    this._imageService.getImage(this.usuarioSelected.imagen, 'usuario').subscribe(data => {
      console.log('Data: ');
      console.log(data);
      let extension = this.usuarioSelected.imagen.split('.')[1];
      let fileTransformed = this.blobToFile(data, this.usuarioSelected.imagen, extension);
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


  createImageFromBlob(image: Blob) {
    let urlCreator = window.URL;
    this.usuarioSelected.imageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
    this.objectImageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
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
        console.log('FILE CORRECTO:');
        console.log(this.selectedFile);

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




  getTiposIdentificacion() {
    this._tiposIdentificacionService.cargarTiposIdentificacion()
      .subscribe(
        response => {
          console.log(response);
          this.tiposIdentificacionJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  getRoles() {
    this._rolesService.getRolesForAdmin()
      .subscribe(
        response => {
          console.log(response);

          let rolesTemporales: Rol[] = response;

          for (let entry of rolesTemporales) {
            if(entry.codigo != GLOBAL.rolCliente){
              this.rolesJSON.push(entry);
            }
          }

        },
        error =>  {
          console.log(<any>error);
        }
      );
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
        { data: 'nombre1' },
        { data: 'apellido1' },
        { data: 'identificacion' },
        { data: 'email' },
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
        GLOBAL.urlBackend + '/usuario/datatable',
        dataTablesParameters, {headers}
      ).subscribe(resp => {

      console.log('Imprimir datos');
      console.log(resp);
      this.usuarios = resp.data;

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
    this._userService.cambiarEstado(codigo, estado).subscribe(
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


  /**
   * Adiciona un nuevo usuario
   */
  adicionar() {

    console.log('Adicionando un usuario');
    console.log(this.firstFormGroup);
    console.log(this.selectedFile);


    let numerosRolesTemporales: number[] = this.firstFormGroup.controls['roles'].value;
    let rolesList: Rol[] = [];

    for (let entry of numerosRolesTemporales) {
      let rol: Rol = new Rol(entry, null);
      //rol.codigo = entry;
      rolesList.push(rol);
    }

    let usuarioProcesado: Usuario = new Usuario(
      null,
      this.firstFormGroup.controls['nombre1'].value,
      this.firstFormGroup.controls['nombre2'].value,
      this.firstFormGroup.controls['apellido1'].value,
      this.firstFormGroup.controls['apellido2'].value,
      new TipoIdentificacion(this.firstFormGroup.controls['tipoIdentificacion'].value, null, null, null),
      this.firstFormGroup.controls['identificacion'].value,
      this.firstFormGroup.controls['telefono'].value,
      this.firstFormGroup.controls['direccion'].value,
      this.firstFormGroup.controls['email'].value,
      null,
      null,
      rolesList,
      null);

    console.log('Usuario');
    console.log(usuarioProcesado);

    //ENVIAR
    this._userService.agregar(usuarioProcesado, this.selectedFile)
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
          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
        }
      );

  }


  editar(){
    console.log('Modificando un usuario');

    console.log(this.firstFormGroup);
    console.log(this.selectedFile);

    let numerosRolesTemporales: number[] = this.firstFormGroup.controls['roles'].value;
    let rolesList: Rol[] = [];

    for (let entry of numerosRolesTemporales) {
      let rol: Rol = new Rol(entry, null);
      rolesList.push(rol);
    }

    let usuarioProcesado: Usuario = new Usuario(
      this.usuarioSelected.codigo,
      this.firstFormGroup.controls['nombre1'].value,
      this.firstFormGroup.controls['nombre2'].value,
      this.firstFormGroup.controls['apellido1'].value,
      this.firstFormGroup.controls['apellido2'].value,
      new TipoIdentificacion(this.firstFormGroup.controls['tipoIdentificacion'].value, null, null, null),
      this.firstFormGroup.controls['identificacion'].value,
      this.firstFormGroup.controls['telefono'].value,
      this.firstFormGroup.controls['direccion'].value,
      this.firstFormGroup.controls['email'].value,
      null,
      null,
      rolesList,
      null);

    console.log('Usuario');
    console.log(usuarioProcesado);

    this._userService.editar(usuarioProcesado, this.selectedFile)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se edito correctamente');
            this.accion = 'NINGUNA';
            this.usuarioSelected = null;
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

    console.log('CODIGO: ' + this.usuarioSelected.codigo);

    this._userService.delete(this.usuarioSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se elimino correctamente');
            this.usuarioSelected = null;
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
      this.usuarioSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }

    } else {
      // El usuario ha deseleccionado la fila
      this.usuarioSelected = null;
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
      this.someClickHandler(this.usuarios[rowCodigo]);
    }

  }



}
