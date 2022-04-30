import {ClienteVehiculo} from './ClienteVehiculo';
import {Lavadero} from './lavadero';
import {OrdenItem} from './OrdenItem';


export class Orden {

  codigo: number;
  clienteVehiculo: ClienteVehiculo;
  fechaCreacion: string;
  estado: number;
  lavadero: Lavadero;
  items: OrdenItem[];

  constructor(
    codigo: number,
    clienteVehiculo: ClienteVehiculo,
    fechaCreacion: string,
    estado: number,
    lavadero: Lavadero,
    items: OrdenItem[]
  )
  {
    this.codigo = codigo;
    this.clienteVehiculo = clienteVehiculo;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.lavadero = lavadero;
    this.items = items;
  }
}
