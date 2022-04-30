import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {TipoVehiculo} from '../../models/TipoVehiculo';
import {Marca} from '../../models/Marca';



@Injectable()
export class MarcasService {

  private urlApi = '/marca';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo marca
   * @param marca
   */
  agregar(marca: Marca, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('marca', new Blob([JSON.stringify(marca)], {type: 'application/json'}));

    return this.http.post(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Edita una marca
   * @param marca
   */
  editar(marca: Marca, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('marca', new Blob([JSON.stringify(marca)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Elimina una marca (Cambia estado a eliminado)
   * @param codigo
   */
  delete(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado de la marca (Activo inactivo)
   * @param codigo
   * @param estado
   */
  cambiarEstado(codigo: number, estado: string): Observable<any>{
    const body = `estado=${encodeURIComponent(estado)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/estado/' + codigo, body, {headers});
  }


  /**
   * Carga las marcas disponibles
   */
  cargarDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }



}
