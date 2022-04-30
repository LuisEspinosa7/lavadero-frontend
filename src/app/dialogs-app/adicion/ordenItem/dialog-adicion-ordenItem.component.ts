import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Lavadero} from '../../../models/lavadero';
import {OrdenItem} from '../../../models/OrdenItem';
import {TipoServicioService} from '../../../services/tipoServicio/tipoServicio.service';
import {TipoServicio} from '../../../models/TipoServicio';
import {LavaderoServicioService} from '../../../services/lavaderoServicio/lavaderoServicio.service';
import {PersonalLavadero} from '../../../models/PersonalLavadero';
import {LavaderoServicio} from '../../../models/LavaderoServicio';
import {FuncionarioServicio} from '../../../models/FuncionarioServicio';
import {FuncionarioServicioService} from '../../../services/funcionarioServicio/funcionarioServicio.service';
import {GLOBAL} from '../../../models/global';
import {ItemFuncionario} from '../../../models/ItemFuncionario';
import {ClienteVehiculo} from '../../../models/ClienteVehiculo';
import {OrdenService} from '../../../services/orden/orden.service';

@Component({
  selector: 'app-dialog-adicion-ordenItem',
  templateUrl: './dialog-adicion-ordenItem.component.html',
  styleUrls: ['./dialog-adicion-ordenItem.component.css']
})
export class DialogAdicionOrdenItemComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  lavaderoUsuario: Lavadero;

  clienteVehiculo: ClienteVehiculo;

  clienteAplicaParaPromocion: boolean;
  numeroServiciosConsumidosXCliente: number;
  precioFinalServicio: number;


  tiposServiciosJSON: TipoServicio[] = [];

  codigoTipoServicioActual: number;
  tipoServicioActual: TipoServicio;

  configuracionLavaderoServicio: LavaderoServicio;

  personalDisponibleJSON: FuncionarioServicio[] = [];

  tecnicosSelected: FuncionarioServicio[] = [];


  dtOptions: DataTables.Settings = {};
  displayedColumns = ['index', 'nombre1', 'apellido1', 'tipoPago', 'pago'];
  dataSource = new MatTableDataSource<FuncionarioServicio>();

  constructor(
    private formBuilder: FormBuilder,
    private _tipoServicioService: TipoServicioService,
    private _lavaderoServicioService: LavaderoServicioService,
    private _funcionarioServicioService: FuncionarioServicioService,
    private _ordenService: OrdenService,
    private dialogRef: MatDialogRef<DialogAdicionOrdenItemComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.lavaderoUsuario = data.lavaderoUsuario;
    this.clienteVehiculo = data.clienteVehiculo;

    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.getTiposServiciosDisponiblesXLavadero();
    this.clienteAplicaParaPromocion = false;

    this.form = this.formBuilder.group({
      tipoServicio: [null, Validators.compose([Validators.required])],
      tecnico: [null, Validators.compose([Validators.required])]
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 4
    };

  }


  getTiposServiciosDisponiblesXLavadero() {
    console.log('En metodo buscando los tipos de servicio');
    this._tipoServicioService.cargarTiposServiciosXLavaderoDisponibles(this.lavaderoUsuario.codigo)
      .subscribe(
        response => {
          console.log(response);
          this.tiposServiciosJSON = response.data;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioTipoServicio(valor){
    console.log('Dentro de cambio tipo servicio ...');

    this.personalDisponibleJSON = [];
    this.tecnicosSelected = [];

    this.codigoTipoServicioActual = valor;

    this._lavaderoServicioService.cargarConfiguracionServicioLavadero(this.lavaderoUsuario.codigo, valor)
      .subscribe(
        response => {
          console.log(response);
          this.configuracionLavaderoServicio = response.data;

          // Se debe revisar si el cliente aplica para la promocion
          if(this.configuracionLavaderoServicio.aplicaPromocion){
            console.log('El servicio SI tiene promocion disponible');

            this._ordenService.consultarNumeroServiciosConsumidosCliente(this.lavaderoUsuario.codigo.toString(), this.clienteVehiculo.usuario.codigo.toString(), this.codigoTipoServicioActual.toString())
              .subscribe(
                response => {
                  console.log(response);
                  let numeroServiciosConsumidos = response.data;

                  if(numeroServiciosConsumidos == this.configuracionLavaderoServicio.promocionNumeroRef){

                    console.log('El CLIENTE SI APLICA PARA LA PROMOCION');

                    // Si aplica para la promocion
                    this.numeroServiciosConsumidosXCliente = numeroServiciosConsumidos;

                    if(this.configuracionLavaderoServicio.tipoPromocion.codigo == 1){
                      console.log('SE LE REGALA ESTE SERVICIO');
                      //Obsequio
                      this.precioFinalServicio = 0;

                    } else if(this.configuracionLavaderoServicio.tipoPromocion.codigo == 2){
                      console.log('SE LE REDUCE UN PORCENTAJE');
                      //Porcentaje
                      this.precioFinalServicio =  (Number(this.configuracionLavaderoServicio.valorPromocion) * Number(this.configuracionLavaderoServicio.precioEstandar) ) / 100;
                    }

                    this.clienteAplicaParaPromocion = true;
                  } else {

                    console.log('El CLIENTE NO APLICA PARA LA PROMOCION');

                    //Queda el mismo precio
                    this.precioFinalServicio = Number(this.configuracionLavaderoServicio.precioEstandar);
                    this.numeroServiciosConsumidosXCliente = 0;
                    this.clienteAplicaParaPromocion = false;
                  }

                },
                error =>  {
                  console.log(<any>error);
                }
              );

          } else {
            console.log('El servicio NO tiene promocion disponible');
            //Queda el mismo precio
            this.precioFinalServicio = Number(this.configuracionLavaderoServicio.precioEstandar);
          }

        },
        error =>  {
          console.log(<any>error);
        }
    );


    for (let entry of this.tiposServiciosJSON) {
      console.log('iterando ...');

      if(entry.codigo === valor){
        console.log('Encontrado');
        this.tipoServicioActual = entry;
        console.log(this.tipoServicioActual);
      }
    }


  }


  listarPersonalDisponible(){
    console.log('Listando personal disponible ...');


    this._funcionarioServicioService.cargarPersonalDisponibleXServicioLavadero(this.lavaderoUsuario.codigo, this.codigoTipoServicioActual.toString())
      .subscribe(
        response => {
          console.log(response);
          this.personalDisponibleJSON = response.data;
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  cambioTecnico(event){
    console.log('Cambio de tecnico ...');

    if(event.source.selected){
      console.log('Adicionar');

      let valor = event.source.value;

      for (let entry of this.personalDisponibleJSON) {
        console.log('iterando ...');

        if(entry.codigo === valor){
          console.log('Encontrado');
          this.tecnicosSelected.push(entry);
        }
      }


      this.dataSource.data = this.tecnicosSelected;


    } else {
      console.log('Eliminar');
      let valor = event.source.value;
      let index = this.personalDisponibleJSON.findIndex(x => x.codigo === valor);
      console.log('Index: ' + index);
      this.tecnicosSelected.splice(index, 1);

      this.dataSource.data = this.tecnicosSelected;
    }

  }


  save() {
    console.log('Save');

    console.log('Preparando items funcionarios');

    let itemFuncionarios: ItemFuncionario[] = [];

    for (let entry of this.tecnicosSelected) {
      console.log('iterando ...');

      let itemFuncionario: ItemFuncionario = new ItemFuncionario(
        null,
        null,
        entry,
        null,
        null
      );

      itemFuncionarios.push(itemFuncionario);
    }


    let ordenItemActual: OrdenItem = new OrdenItem(
      null,
      null,
      this.tipoServicioActual,
      this.configuracionLavaderoServicio.precioEstandar,
      this.precioFinalServicio.toString(),
      this.clienteAplicaParaPromocion ? 1 : 0,
      null,
      itemFuncionarios
    );

    this.dialogRef.close(ordenItemActual);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
