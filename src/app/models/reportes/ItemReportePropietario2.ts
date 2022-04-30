import {Usuario} from '../usuario';

export class ItemReportePropietario2 {

  usuario: Usuario;
  numeroServiciosRealizados: number;

  constructor(
    usuario: Usuario,
    numeroServiciosRealizados: number
  )
  {
    this.usuario = usuario;
    this.numeroServiciosRealizados = numeroServiciosRealizados;
  }
}
