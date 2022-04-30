export class TipoPromocion {

  codigo: number;
  nombre: string;
  descripcion: string;
  estado: number;

  constructor(
    codigo: number,
    nombre: string,
    descripcion: string,
    estado: number
  )
  {
    this.codigo = codigo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
  }
}
