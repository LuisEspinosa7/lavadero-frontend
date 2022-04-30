import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {Lavadero} from '../../models/lavadero';
import {TipoVehiculo} from '../../models/TipoVehiculo';


@Injectable()
export class LavaderoService {

  private urlApi = '/lavadero';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo lavadero
   * @param marca
   */
  agregar(lavadero: Lavadero, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('lavadero', new Blob([JSON.stringify(lavadero)], {type: 'application/json'}));

    return this.http.post(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }

  /**
   * Edita una lavadero
   * @param marca
   */
  editar(lavadero: Lavadero, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('lavadero', new Blob([JSON.stringify(lavadero)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Elimina una lavadero (Cambia estado a eliminado)
   * @param codigo
   */
  delete(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado de la lavadero (Activo inactivo)
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
   * Carga los lavaderos disponibles
   */
  cargarLavaderosDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }


  /**
   * Consulta si esta vinculado a un lavadero activo
   */
  cargarLavaderosUsuario(codigo: number): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/XUsuario/' + codigo, {headers});
  }


}
