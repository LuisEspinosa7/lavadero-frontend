export class TipoVehiculo {

  codigo: number;
  nombre: string;
  descripcion: string;
  estado: number;
  imagen: string;
  imageToShow: any;


  constructor(
    codigo: number,
    nombre: string,
    descripcion: string,
    estado: number,
    imagen: string,
    imageToShow: any
  )
  {
    this.codigo = codigo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.imagen = imagen;
    this.imageToShow = imageToShow;
  }
}
