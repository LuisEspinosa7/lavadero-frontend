import { Rol } from '../models/rol';
import { TipoIdentificacion } from './tipoIdentificacion';


export class Usuario {

  codigo: number;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  tipoIdentificacion: TipoIdentificacion;
  identificacion: string;
  telefono: string;
  direccion: string;
  email: string;
  estado: number;
  imagen: string;
  roles: Rol[];
  imageToShow: any;

  constructor(
    codigo: number,
    nombre1: string,
    nombre2: string,
    apellido1: string,
    apellido2: string,
    tipoIdentificacion: TipoIdentificacion,
    identificacion: string,
    telefono: string,
    direccion: string,
    email: string,
    estado: number,
    imagen: string,
    roles: Rol[],
    imageToShow: any)
  {
    this.codigo = codigo;
    this.nombre1 = nombre1;
    this.nombre2 = nombre2;
    this.apellido1 = apellido1;
    this.apellido2 = apellido2;
    this.tipoIdentificacion = tipoIdentificacion;
    this.identificacion = identificacion;
    this.telefono = telefono;
    this.direccion = direccion;
    this.email = email;
    this.estado = estado;
    this.imagen = imagen;
    this.roles = roles;
    this.imageToShow = imageToShow;
  }
}
