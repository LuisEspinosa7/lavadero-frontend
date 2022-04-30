export class Lavadero {

  codigo: number;
  nombre: string;
  descripcion: string;
  estado: number;
  imagen: string;
  imageToShow: any;
  nit: string;

  constructor(
    codigo: number,
    nombre: string,
    descripcion: string,
    estado: number,
    imagen: string,
    imageToShow: any,
    nit: string
  )
  {
    this.codigo = codigo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.imagen = imagen;
    this.imageToShow = imageToShow;
    this.nit = nit;
  }
}
