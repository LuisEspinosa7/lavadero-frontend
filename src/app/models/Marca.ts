export class Marca {

  codigo: number;
  nombre: string;
  estado: number;
  imagen: string;
  imageToShow: any;


  constructor(
    codigo: number,
    nombre: string,
    estado: number,
    imagen: string,
    imageToShow: any
  )
  {
    this.codigo = codigo;
    this.nombre = nombre;
    this.estado = estado;
    this.imagen = imagen;
    this.imageToShow = imageToShow;
  }
}
