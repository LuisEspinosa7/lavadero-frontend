import {LavaderoServicio} from './LavaderoServicio';


export class LiquidacionComsion {

  codigo: number;
  lavaderoServicio: LavaderoServicio;
  fechaCreacion: string;
  fechaInicio: string;
  fechaFin: string;
  valorLiquidacion: string;
  estado: number;
  numeroServicios: number;

  constructor(
    codigo: number,
    lavaderoServicio: LavaderoServicio,
    fechaCreacion: string,
    fechaInicio: string,
    fechaFin: string,
    valorLiquidacion: string,
    estado: number,
    numeroServicios: number
  )
  {
    this.codigo = codigo;
    this.lavaderoServicio = lavaderoServicio;
    this.fechaCreacion = fechaCreacion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.valorLiquidacion = valorLiquidacion;
    this.estado = estado;
    this.numeroServicios = numeroServicios;
  }
}
