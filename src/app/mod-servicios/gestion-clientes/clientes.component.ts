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


@Component({
  selector: 'app-administrador-gestion-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit {

  firstFormGroup: FormGroup;
  busquedaFormGroup: FormGroup;
  isLinear: boolean;
  tiposIdentificacionJSON: TipoIdentificacion[];
  accion: string;
  message: string;
  loadingCliente: boolean;
  usuarioClienteEncontradoObj: Usuario;
  usuarioClienteEncontrado: boolean;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _userService: UserService,
              private formBuilder: FormBuilder,
              private _tiposIdentificacionService: TipoIdentificacionService) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.message = 'Por favor digite el documento';
    this.usuarioClienteEncontrado = false;
    this.isLinear = true;
    this.loadingCliente = false;
    this.getTiposIdentificacion();
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
      identi: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])]
    })

    this.accion = 'BUSCAR';
  }


  iniciarFormulariosParaCreacion(){
    console.log('Iniciando Formularios para creacion');

    this.firstFormGroup = this.formBuilder.group({
      nombre1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      nombre2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      apellido1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      apellido2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
      tipoIdentificacion: [null, Validators.compose([Validators.required])],
      identificacion: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      direccion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      telefono: [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      email: [null, Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(70), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])]
    })



    this.accion = 'ADICIONAR';
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


  /**
   * Buscar un cliente
   */
  buscarCliente(){
    console.log('Buscando un cliente');

    this.loadingCliente = true;

    let identifi: string = this.busquedaFormGroup.controls['identi'].value;


    this._userService.buscarCliente(identifi)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se encontro');
            this.loadingCliente = false;
            this.usuarioClienteEncontradoObj = response.data;
            console.log(this.usuarioClienteEncontradoObj);
            this.usuarioClienteEncontrado = true;
            this.accion = 'BUSCAR';
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingCliente = false;
            this.usuarioClienteEncontrado = false;
            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          this.loadingCliente = false;
          this.usuarioClienteEncontrado = false;
          console.log('Ocurrio un error');

          if(error.status === 404){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }


        }
      );


  }




  /**
   * Adiciona un nuevo cliente
   */
  adicionar() {

    console.log('Adicionando un cliente');
    console.log(this.firstFormGroup);

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
      null,
      null);

    console.log('Usuario');
    console.log(usuarioProcesado);

    //ENVIAR
    this._userService.crearCliente(usuarioProcesado)
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
    this.usuarioClienteEncontradoObj = null;
    this.usuarioClienteEncontrado = false;
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
