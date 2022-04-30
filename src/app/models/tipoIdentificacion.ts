export class TipoIdentificacion {

  codigo: number;
  nombre: string;
  acronimo: string;
  estado: number;

  constructor(
    codigo: number,
    nombre: string,
    acronimo: string,
    estado: number
  )
  {
    this.codigo = codigo;
    this.nombre = nombre;
    this.acronimo = acronimo;
    this.estado = estado;
  }
}
