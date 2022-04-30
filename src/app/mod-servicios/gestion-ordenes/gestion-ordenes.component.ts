import {Component, AfterViewInit, OnInit, Inject, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';
import swal from'sweetalert2';
import { Subject } from 'rxjs';
import {ImageService} from '../../services/images/image.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Orden} from '../../models/Orden';
import {OrdenService} from '../../services/orden/orden.service';
import {Usuario} from '../../models/usuario';
import {Lavadero} from '../../models/lavadero';
import {UserService} from '../../services/user/user.service';
import {LavaderoService} from '../../services/lavadero/lavadero.service';
import {DialogBusquedaLavaderosComponent} from '../../dialogs-app/busqueda/lavaderos/dialog-busqueda-lavaderos.component';
import {DialogDetalleOrdenComponent} from '../../dialogs-app/detalle/orden/dialog-detalle-orden.component';
import {ClienteVehiculo} from '../../models/ClienteVehiculo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClienteVehiculoService} from '../../services/clienteVehiculo/clienteVehiculo.service';
import {OrdenItem} from '../../models/OrdenItem';
import {DialogAdicionOrdenItemComponent} from '../../dialogs-app/adicion/ordenItem/dialog-adicion-ordenItem.component';
import {FuncionarioServicio} from '../../models/FuncionarioServicio';
import {TipoPago} from '../../models/TipoPago';


@Component({
  selector: 'app-gestion-ordenes',
  templateUrl: './gestion-ordenes.component.html',
  styleUrls: ['./gestion-ordenes.component.css']
})

export class GestionOrdenesComponent implements OnInit, OnDestroy {

  dataUser: Usuario;
  lavaderosUsuario: Lavadero[] = [];
  lavaderoUsuario: Lavadero;

  dtOptions: DataTables.Settings = {};
  ordenes: Orden[] = [];
  ordenSelected: Orden;
  dtTrigger: Subject<any> = new Subject();

  rowSelected: string = '';
  private row;

  accion: string;
  isLinear: boolean;

  vehiculoSeleccionadoActual: ClienteVehiculo;
  seleccionoVehiculoActual: boolean;

  busquedaFormGroup: FormGroup;
  loadingVehiculo: boolean;
  vehiculoEncontrado: boolean;
  vehiculoEncontradoObj: ClienteVehiculo;

  itemsTemporales: OrdenItem[] = [];

  displayedColumns = ['index', 'servicio', 'precio', 'tecnicos', 'eliminar'];
  dataSource = new MatTableDataSource<OrdenItem>();

  loadingOrdenes: boolean;

  imprimiendoFactura: boolean;



  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _ordenService: OrdenService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private _lavaderoService: LavaderoService,
              private _clienteVehiculoService: ClienteVehiculoService) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');

    this.loadingOrdenes = true;
    this.seleccionoVehiculoActual = false;
    this.isLinear = true;
    this.loadingVehiculo = false;
    this.vehiculoEncontrado = false;
    this.imprimiendoFactura = false;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: "assets/data/datatables/spanish.json"
      }
    };

    this.cargarUsuario();
    this.cargarLavadero();
  }

  mostrarSeccionAdicionar(){
    console.log('Mostrando seccion adicionar');
    this.iniciarFormulariosParaCreacion();
  }

  iniciarFormulariosParaCreacion(){
    console.log('Iniciando Formularios para creacion');

    this.busquedaFormGroup = this.formBuilder.group({
      plac: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])]
    })

    this.accion = 'ADICIONAR';
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
            this.seleccionoVehiculoActual = true;
            this.vehiculoSeleccionadoActual = this.vehiculoEncontradoObj;
            this.mostrarRespuesta('success', 'Respuesta', response.mensaje, 'Ok');

          } else {
            console.log('Algo paso pero no hubo error');
            this.loadingVehiculo = false;
            this.vehiculoEncontrado = false;
            this.seleccionoVehiculoActual = false;
            this.vehiculoSeleccionadoActual = null;
            console.log(response);
            this.mostrarRespuesta('warning', 'Advertencia', response.mensaje, 'Ok');
          }

        },
        error =>  {
          console.log(<any>error);
          this.loadingVehiculo = false;
          this.vehiculoEncontrado = false;
          this.seleccionoVehiculoActual = false;
          this.vehiculoSeleccionadoActual = null;
          console.log('Ocurrio un error');

          if(error.status === 404){
            this.mostrarRespuesta('warning', 'Advertencia', error.error.message, 'Ok');
          } else {
            this.mostrarRespuesta('error', 'Error', GLOBAL.mensajeError, 'Ok');
          }


        }
      );


  }


  agregarServicioDialog(){
    console.log('Agregar un servicio');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';

    dialogConfig.data = {
      title: 'Agrega un servicio segun las preguntas',
      accion: 'ACEPTAR',
      lavaderoUsuario: this.lavaderoUsuario,
      clienteVehiculo: this.vehiculoSeleccionadoActual
    };

    const dialogRef = this.dialog.open(DialogAdicionOrdenItemComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        if(data !== ''){
          console.log('Si agrego item');
          let itemTemporal: OrdenItem = data;
          this.itemsTemporales.push(itemTemporal);

          this.dataSource.data = this.itemsTemporales;

        } else {
          console.log('Digito cancelar');
        }

      },
      error =>  {
        console.log(<any>error);
      }
    );


  }


  quitarServicioTabla(index){
    console.log('Quitando servicio de tabla');

    //const index = this.itemsTemporales.indexOf(codi, 0);
    console.log(index);

    if (index > -1) {
      this.itemsTemporales.splice(index, 1);
      this.dataSource.data = this.itemsTemporales;
    }


  }




  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

          this.cargarOrdenes();

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }



  visualizar(){
    console.log('Visualizando el detalle de la orden');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '900px';

    dialogConfig.data = {
      title: 'Detalle de la orden',
      ordenSeleccionada: this.ordenSelected
    };

    const dialogRef = this.dialog.open(DialogDetalleOrdenComponent, dialogConfig);

  }



  cargarOrdenes() {
    console.log('Cargando las ordenes');

    this._ordenService.buscarOrdenesXLavadero(this.lavaderoUsuario.codigo).subscribe(
      resp => {

        console.log(resp.data);
        this.ordenes = resp.data;
        this.dtTrigger.next();

        /**
        if(this.ordenes.length == 0){
          let table = $('#tabla1').DataTable();
          table.destroy();
        }
         **/

        this.loadingOrdenes = false;

      },
      error =>  {
        console.log(<any>error);
        this.loadingOrdenes = false;
      });

  }



  confirmarAdicionar(){
    console.log('Confirmar adicion....');

    swal({
      title: 'Esta seguro?',
      text: 'Una vez agregado, no se podra modificar!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: GLOBAL.primaryColor,
      cancelButtonColor: GLOBAL.accentColor,
      confirmButtonText: 'Si'
    }).then((result) => {

      console.log(result);
      if (result.value) {
        console.log('Eliminar si');
        this.adicionar();
      }
    })

  }



  adicionar() {

    console.log('Adicionando una Orden');

    let objetoProcesado: Orden = new Orden(
      null,
      this.vehiculoSeleccionadoActual,
      null,
      null,
      this.lavaderoUsuario,
      this.itemsTemporales
    );

    console.log('Funcionario Servoicio Procesado:: ');
    console.log(objetoProcesado);

    this._ordenService.agregar(objetoProcesado)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.accion = 'NINGUNA';
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


// PARA SACAR LA INFORMACION DE CADA FILA
  someClickHandler(rowInfo: any): void {

    //valida que sea una fila seleccionada (Que este actualmente seleccionada)
    if(rowInfo != null){
      // El usuario de la fila es valido
      this.ordenSelected = rowInfo;

      if(this.accion == 'ADICIONAR'){
        this.accion = 'NINGUNA';
      }

    } else {
      // El usuario ha deseleccionado la fila
      this.ordenSelected = null;
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
      this.someClickHandler(this.ordenes[rowCodigo]);
    }

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




  imprimirFactura() {
    console.log('Imprimir Factura....');

    this.imprimiendoFactura = true;

    console.log(this.ordenSelected);

    this._ordenService.generarFactura(this.ordenSelected)
      .subscribe(
        response => {
          console.log(response);

          let file = new Blob([response], { type: "application/pdf" });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');

          this.imprimiendoFactura = false;

        },
        error =>  {
          console.log(<any>error);
          console.log('Ocurrio un error');
          this.imprimiendoFactura = false;

          this.mostrarRespuesta('error', 'Error', GLOBAL.ticketError, 'Ok');

        }
      );


  }



}
