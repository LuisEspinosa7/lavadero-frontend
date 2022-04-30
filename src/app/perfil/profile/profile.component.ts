import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import {Usuario} from '../../models/usuario';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoIdentificacion} from '../../models/tipoIdentificacion';
import {TipoIdentificacionService} from '../../services/tipoIdentificacion/tipoIdentificacion.service';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  usuarioSelected: Usuario;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLinear: boolean;

  tiposIdentificacionJSON: TipoIdentificacion[];
  selectedTipoIdentificacion: number;

  selectedFile: File;
  seleccionoFile: boolean;
  accion: string;

  objectImageToShow: any;
  isImageLoading: boolean;
  imageLoadedComplete: boolean;
  message: string;

  informacionUsuarioCargada: boolean;

  passwordFormGroup: FormGroup;


  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _userService: UserService,
              private formBuilder: FormBuilder,
              private _tiposIdentificacionService: TipoIdentificacionService,
              private _imageService: ImageService,
              private _domSanitizer: DomSanitizer) {

    this.passwordFormGroup = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(15)])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    }, {
      validator: this.validate.bind(this)
    })

  }




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.message = 'Por favor seleccione una imagen de los siguientes tipos (PNG, JPG, JPEG)';
    this.isLinear = true;
    this.seleccionoFile = false;
    this.informacionUsuarioCargada = false;
    this.getTiposIdentificacion();
    this.cargarUsuario();
    this.mostrarSeccionModificar();
  }

  cargarUsuario(){
    console.log('Cargando el usuario...');
    this.usuarioSelected = JSON.parse(localStorage.getItem('user'));
    console.log(this.usuarioSelected);
  }


  mostrarSeccionModificar(){
    console.log('Cargando informacion de usuario');
    this.iniciarFormulariosParaModificar();
  }


  iniciarFormulariosParaModificar() {
    console.log('Iniciando Formularios para modificar');

    this.firstFormGroup = this.formBuilder.group({
      nombre1: [this.usuarioSelected.nombre1, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      nombre2: [this.usuarioSelected.nombre2, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      apellido1: [this.usuarioSelected.apellido1, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      apellido2: [this.usuarioSelected.apellido2, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      tipoIdentificacion: [this.usuarioSelected.tipoIdentificacion.codigo, Validators.compose([Validators.required])],
      identificacion: [this.usuarioSelected.identificacion, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      direccion: [this.usuarioSelected.direccion, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      telefono: [this.usuarioSelected.telefono, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      email: [this.usuarioSelected.email, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])]
    })

    this.firstFormGroup.controls['tipoIdentificacion'].disable();
    this.firstFormGroup.controls['identificacion'].disable();
    this.firstFormGroup.controls['email'].disable();

    this.secondFormGroup = this.formBuilder.group({
      fileSelected: [null, Validators.compose([Validators.required])]
    })

    this.loadImageFromService();

    this.informacionUsuarioCargada = true;
  }


  validate(passwordFormGroup: FormGroup) {

    console.log(passwordFormGroup);

    let password = passwordFormGroup.controls.newPassword.value;
    let repeatPassword = passwordFormGroup.controls.confirmPassword.value;

    console.log(password);
    console.log(repeatPassword);

    if (repeatPassword.length <= 0) {
      console.log('repeatPassword VACIA');
      return null;
    }

    if (repeatPassword !== password) {
      console.log('SON DIFERENTES');
      return {
        doesMatchPassword: true
      };
    }

    return null;

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



  editar(){
    console.log('Modificando el perfil');

    console.log(this.firstFormGroup);
    console.log(this.selectedFile);

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
      null,
      null);

    console.log('Usuario');
    console.log(usuarioProcesado);

    this._userService.updatePerfil(usuarioProcesado, this.selectedFile)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se edito correctamente');
            this.usuarioSelected = null;
            this.mostrarRespuestaAndReload('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');
          this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
        }
      );

  }

  confirmChangeOfPassword(){
    swal({
      title: 'Esta seguro?',
      text: 'Desea realizar el cambio de contraseña para ingreso al aplicativo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      console.log(result);
      if (result.value) {
        console.log('Cambiar si');
        this.changePassword();
      }
    })
  }


  changePassword(){
    console.log('Cambiando Password....');

    let codigo = this.usuarioSelected.codigo;
    let password = this.passwordFormGroup.controls['newPassword'].value;

    this._userService.changePassword(codigo, password).subscribe(
      response => {

        if(response.code === 200){
          console.log('Se edito correctamente');
          this.mostrarRespuestaAndReload('success', 'Respuesta', response.mensaje, 'Ok');

        } else {
          console.log('Algo paso pero no hubo error');
          this.mostrarRespuesta('warn', 'Advertencia', response.mensaje, 'Ok');
        }

      },
      error => {
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


  mostrarRespuestaAndReload(type, title, message, accion){
    console.log('Mostrando Respuesta y recargar....');

    swal({
      title: title,
      text: message,
      type: type,
      showCancelButton: false,
      confirmButtonColor: GLOBAL.primaryColor,
      confirmButtonText: 'Ok'})
      .then((result) => {

      console.log(result);
      if (result.value) {
        location.reload();
      }
    });

  }



}
