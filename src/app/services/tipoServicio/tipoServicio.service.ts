import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {TipoServicio} from '../../models/TipoServicio';
import {TipoVehiculo} from '../../models/TipoVehiculo';


@Injectable()
export class TipoServicioService {

  private urlApi = '/tipoServicio';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo tipo servicio
   * @param tipoServicio
   */
  agregar(tipoServicio: TipoServicio, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('tipoServicio', new Blob([JSON.stringify(tipoServicio)], {type: 'application/json'}));

    return this.http.post(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Edita una tipo servicio
   * @param tipoServicio
   */
  editar(tipoServicio: TipoServicio, selectedFile: File): Observable<any> {


    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('tipoServicio', new Blob([JSON.stringify(tipoServicio)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Elimina una tipo servicio (Cambia estado a eliminado)
   * @param codigo
   */
  delete(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado de la tipo servicio (Activo inactivo)
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
   * Carga los tipos servicios disponibles
   */
  cargarTiposServiciosDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }


  /**
   * Carga los tipos servicios disponibles
   */
  cargarTiposServiciosXLavaderoDisponibles(codigoLavadero: number): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles/lavadero/' + codigoLavadero, {headers});
  }


  /**
   * Carga los tipos servicios que aplican comision x lavadero disponibles
   */
  cargarTiposServiciosAplicanComisionXLavaderoDisponibles(codigoLavadero: number): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/aplicanComision/lavadero/' + codigoLavadero, {headers});
  }


}
