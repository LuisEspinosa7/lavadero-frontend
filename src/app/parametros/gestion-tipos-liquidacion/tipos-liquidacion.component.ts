import { Component, AfterViewInit, OnInit, Inject  } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { GLOBAL } from '../../models/global';
import {MatSlideToggleChange, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import swal from'sweetalert2';
import { TipoLiquidacionService } from '../../services/tipoLiquidacion/tipoLiquidacion.service';
import { TipoLiquidacion } from '../../models/TipoLiquidacion';
import {DialogTipoLiquidacionComponent} from './dialog-tipo-liquidacion/dialog-tipo-liquidacion.component';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}



@Component({
  selector: 'app-administrador-tipos-liquidacion',
  templateUrl: './tipos-liquidacion.component.html',
  styleUrls: ['./tipos-liquidacion.component.scss']
})

export class TiposLiquidacionComponent implements OnInit {

  dtOptions: any = {};
  tiposLiquidacion: TipoLiquidacion[];

  //varialbles de control de las filas
  rowSelected: string = '';
  public tipoIdentificacionSelected: TipoLiquidacion;
  private row;

  //parametros de la tabla con AJAX
  dataTablesParameters: any;
  callback: any;


  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private _tipoLiquidacionService: TipoLiquidacionService) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.createDataTable();
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
        GLOBAL.urlBackend + '/tipoLiquidacion/datatable',
        dataTablesParameters, {headers}
      ).subscribe(resp => {

      console.log('Imprimir datos');
      console.log(resp);
      this.tiposLiquidacion = resp.data;

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
    this._tipoLiquidacionService.cambiarEstado(codigo, estado).subscribe(
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





  adicionar() {

    console.log('Adicionando un tipo de liquidacion');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    dialogConfig.data = {
      title: 'Agregar Tipo Liquidacion',
      accion: 'Adicionar',
      tipoLiquidacion: null
    };

    const dialogRef = this.dialog.open(DialogTipoLiquidacionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Resultado:: ", data);
        console.log(data);

        //VALIDAR SI DIGITO EL USUARIO
        if(data != 0){
          console.log('Digito el usuario');

          let objetoProcesado: TipoLiquidacion;
          objetoProcesado = data;

          console.log('Usuario Procesado:: ');
          console.log(objetoProcesado);

          //ENVIAR
          this._tipoLiquidacionService.crearTipoLiquidacion(objetoProcesado)
            .subscribe(
              response => {
                console.log(response);

                if(response.code === 200){
                  console.log('Se creo correctamente');
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

        } else{
          console.log('Digito cancelar');
          this.renderDataTable(this.dataTablesParameters, this.callback);
        }

      },
      error =>  {
        console.log(<any>error);
        this.renderDataTable(this.dataTablesParameters, this.callback);

      }
    );

  }




  eliminarTipoLiquidacion(){
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

    console.log('CODIGO: ' + this.tipoIdentificacionSelected.codigo);

    this._tipoLiquidacionService.deleteTipoLiquidacion(this.tipoIdentificacionSelected.codigo)
      .subscribe(
        response => {
          console.log(response);

          if(response.code === 200){
            console.log('Se creo correctamente');
            this.renderDataTable(this.dataTablesParameters, this.callback);
            this.tipoIdentificacionSelected = null;
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
      this.tipoIdentificacionSelected = rowInfo;
    } else {
      // El usuario ha deseleccionado la fila
      this.tipoIdentificacionSelected = null;
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
      this.someClickHandler(this.tiposLiquidacion[rowCodigo]);
    }

  }



}
