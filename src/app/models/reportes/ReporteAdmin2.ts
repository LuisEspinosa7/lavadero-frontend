import {ItemReporteAdmin2} from './ItemReporteAdmin2';

export class ReporteAdmin2 {

  fechaHora: string;
  items: ItemReporteAdmin2[];
  granTotalFacturacion: string;
  granTotalComisiones: string;

  constructor(
    fechaHora: string,
    items: ItemReporteAdmin2[],
    granTotalFacturacion: string,
    granTotalComisiones: string
  )
  {
    this.fechaHora = fechaHora;
    this.items = items;
    this.granTotalFacturacion = granTotalFacturacion;
    this.granTotalComisiones = granTotalComisiones;
  }
}
