import { TipoServicio } from './TipoServicio';
import { Lavadero } from './lavadero';
import { TipoPromocion } from './TipoPromocion';

export class LavaderoServicio {

  codigo: number;
  lavadero: Lavadero;
  tipoServicio: TipoServicio;
  aplicaComision: number;
  valorComision: string;
  aplicaPromocion: number;
  tipoPromocion: TipoPromocion;
  promocionNumeroRef: string;
  valorPromocion: string;
  precioEstandar: string;
  fechaCreacion: string;
  estado: number;

  constructor(
    codigo: number,
    lavadero: Lavadero,
    tipoServicio: TipoServicio,
    aplicaComision: number,
    valorComision: string,
    aplicaPromocion: number,
    tipoPromocion: TipoPromocion,
    promocionNumeroRef: string,
    valorPromocion: string,
    precioEstandar: string,
    fechaCreacion: string,
    estado: number
  )
  {
    this.codigo = codigo;
    this.lavadero = lavadero;
    this.tipoServicio = tipoServicio;
    this.aplicaComision = aplicaComision;
    this.valorComision = valorComision;
    this.aplicaPromocion = aplicaPromocion;
    this.tipoPromocion = tipoPromocion;
    this.promocionNumeroRef = promocionNumeroRef;
    this.valorPromocion = valorPromocion;
    this.precioEstandar = precioEstandar;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
  }
}
