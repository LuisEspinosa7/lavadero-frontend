import { Lavadero } from './lavadero';
import {FuncionarioServicio} from './FuncionarioServicio';

export class LiquidacionFuncionario {

  codigo: number;
  funcionarioServicio: FuncionarioServicio;
  lavadero: Lavadero;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  valorPago: string;
  estado: number;
  valorServicio: string;
  numeroServicios: number;

  constructor(
    codigo: number,
    funcionarioServicio: FuncionarioServicio,
    lavadero: Lavadero,
    fechaCreacion: string,
    fechaInicio: string,
    fechaFin: string,
    valorPago: string,
    estado: number,
    valorServicio: string,
    numeroServicios: number
  )
  {
    this.codigo = codigo;
    this.funcionarioServicio = funcionarioServicio;
    this.lavadero = lavadero;
    this.fechaCreacion = fechaCreacion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.valorPago = valorPago;
    this.estado = estado;
    this.valorServicio = valorServicio;
    this.numeroServicios = numeroServicios;
  }
}
