import {FuncionarioServicio} from './FuncionarioServicio';
import {OrdenItem} from './OrdenItem';


export class ItemFuncionario {

  codigo: number;
  ordenItem: OrdenItem;
  funcionarioServicio: FuncionarioServicio;
  pagoFuncionario: string;
  estado: number;

  constructor(
    codigo: number,
    ordenItem: OrdenItem,
    funcionarioServicio: FuncionarioServicio,
    pagoFuncionario: string,
    estado: number
  )
  {
    this.codigo = codigo;
    this.ordenItem = ordenItem;
    this.funcionarioServicio = funcionarioServicio;
    this.pagoFuncionario = pagoFuncionario;
    this.estado = estado;
  }
}
