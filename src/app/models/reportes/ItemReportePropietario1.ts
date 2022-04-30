import {Usuario} from '../usuario';

export class ItemReportePropietario1 {

  usuario: Usuario;
  numeroServiciosSolicitados: number;

  constructor(
    usuario: Usuario,
    numeroServiciosSolicitados: number
  )
  {
    this.usuario = usuario;
    this.numeroServiciosSolicitados = numeroServiciosSolicitados;
  }
}
