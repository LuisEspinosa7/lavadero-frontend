import { Usuario } from './usuario';
import { Lavadero } from './lavadero';

export class PersonalLavadero {

  codigo: number;
  lavadero: Lavadero;
  usuario: Usuario;
  estado: number;

  constructor(
    codigo: number,
    lavadero: Lavadero,
    usuario: Usuario,
    estado: number
  )
  {
    this.codigo = codigo;
    this.lavadero = lavadero;
    this.usuario = usuario;
    this.estado = estado;
  }
}
