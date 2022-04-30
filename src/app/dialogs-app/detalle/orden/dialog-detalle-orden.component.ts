import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {Orden} from '../../../models/Orden';
import {OrdenItemService} from '../../../services/ordenItem/ordenItem.service';
import {OrdenItem} from '../../../models/OrdenItem';
import { MatTableDataSource } from '@angular/material';
import {GLOBAL} from '../../../models/global';


@Component({
  selector: 'app-dialog-detalle-orden',
  templateUrl: './dialog-detalle-orden.component.html',
  styleUrls: ['./dialog-detalle-orden.component.css']
})
export class DialogDetalleOrdenComponent implements OnInit {

  title: string;
  ordenSeleccionada: Orden;
  itemsOrdenJSON: OrdenItem[] = [];

  displayedColumns = ['index', 'servicio', 'precio', 'costo', 'trabajadorPago', 'pago'];
  dataSource = new MatTableDataSource<OrdenItem>();

  itemsCargados: boolean;

  totalCostoServicio: number;
  totalPagoTrabajadores: number;



  constructor(
    private dialogRef: MatDialogRef<DialogDetalleOrdenComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private _ordenItemService: OrdenItemService) {

    this.title = data.title;
    this.ordenSeleccionada = data.ordenSeleccionada;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.totalCostoServicio = 0;
    this.totalPagoTrabajadores = 0;
    this.itemsCargados = false;
    this.getOrdenDetalle();

  }


  getOrdenDetalle() {
    console.log('Buscando detalle de la orden');

    this.calcularTotales();

    this.itemsOrdenJSON = this.ordenSeleccionada.items;
    this.dataSource.data = this.itemsOrdenJSON;
    this.itemsCargados = true;
  }


  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }



  calcularTotales(){
    console.log('Calculando totales');

    for (let entry1 of this.ordenSeleccionada.items) {
      this.sumarPrecio(Number(entry1.precio));

      for (let entry2 of entry1.itemFuncionarios) {

        if(entry2.funcionarioServicio.tipoPago.codigo == 1){
          this.sumarPagos(Number(entry2.funcionarioServicio.valorPago) );
        } else {
          this.sumarPagos(Number(entry1.precio) * Number(entry2.funcionarioServicio.valorPago) / 100 );
        }


      }

    }



  }


  sumarPrecio(precioItem: number) {
    console.log('Sumando precio...');

    console.log(precioItem);
    this.totalCostoServicio = this.totalCostoServicio + precioItem;
  }

  sumarPagos(pago: number) {
    console.log('Sumando pago...');

    console.log(pago);
    this.totalPagoTrabajadores = this.totalPagoTrabajadores + pago;
  }


}
