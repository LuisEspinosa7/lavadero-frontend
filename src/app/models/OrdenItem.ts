import {Orden} from './Orden';
import {ItemFuncionario} from './ItemFuncionario';
import {TipoServicio} from './TipoServicio';


export class OrdenItem {

  codigo: number;
  orden: Orden;
  tipoServicio: TipoServicio;
  precio: string;
  precioServicio: string;
  aplicaPromocion: number;
  estado: number;
  itemFuncionarios: ItemFuncionario[];

  constructor(
  codigo: number,
  orden: Orden,
  tipoServicio: TipoServicio,
  precio: string,
  precioServicio: string,
  aplicaPromocion: number,
  estado: number,
  itemFuncionarios: ItemFuncionario[]
  )
  {
    this.codigo = codigo;
    this.orden = orden;
    this.tipoServicio = tipoServicio;
    this.precio = precio;
    this.precioServicio = precioServicio;
    this.aplicaPromocion = aplicaPromocion;
    this.estado = estado;
    this.itemFuncionarios = itemFuncionarios;
  }
}
