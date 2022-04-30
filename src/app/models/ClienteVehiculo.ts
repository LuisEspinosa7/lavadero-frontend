import { Usuario } from './usuario';
import { TipoServicio } from './TipoServicio';
import { TipoLiquidacion } from './TipoLiquidacion';
import {TipoPago} from './TipoPago';
import {TipoVehiculo} from './TipoVehiculo';
import {Marca} from './Marca';

export class ClienteVehiculo {

  codigo: number;
  usuario: Usuario;
  tipoVehiculo: TipoVehiculo;
  marca: Marca;
  placa: string;
  kilometraje: string;
  fechaCreacion: string;
  estado: number;

  constructor(
    codigo: number,
    usuario: Usuario,
    tipoVehiculo: TipoVehiculo,
    marca: Marca,
    placa: string,
    kilometraje: string,
    fechaCreacion: string,
    estado: number
  )
  {
    this.codigo = codigo;
    this.usuario = usuario;
    this.tipoVehiculo = tipoVehiculo;
    this.marca = marca;
    this.placa = placa;
    this.kilometraje = kilometraje;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
  }
}
