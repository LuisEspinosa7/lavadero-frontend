import { Usuario } from './usuario';
import { TipoServicio } from './TipoServicio';
import { TipoLiquidacion } from './TipoLiquidacion';
import {TipoPago} from './TipoPago';

export class FuncionarioServicio {

  codigo: number;
  usuario: Usuario;
  tipoServicio: TipoServicio;
  tipoLiquidacion: TipoLiquidacion;
  fechaCreacion: string;
  estado: number;
  tipoPago: TipoPago;
  valorPago: string;

  constructor(
    codigo: number,
    usuario: Usuario,
    tipoServicio: TipoServicio,
    tipoLiquidacion: TipoLiquidacion,
    fechaCreacion: string,
    estado: number,
    tipoPago: TipoPago,
    valorPago: string
  )
  {
    this.codigo = codigo;
    this.usuario = usuario;
    this.tipoServicio = tipoServicio;
    this.tipoLiquidacion = tipoLiquidacion;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.tipoPago = tipoPago;
    this.valorPago = valorPago;
  }
}
