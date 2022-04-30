import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import {LavaderoServicio} from '../../models/LavaderoServicio';
import {Usuario} from '../../models/usuario';


@Injectable()
export class LavaderoServicioService {

  private urlApi = '/lavaderoServicio';

  constructor(private http: HttpClient) { }

  /**
   * Busca los datos de la tabla
   * @param dataTablesParameters
   */
  getDatatable(dataTablesParameters: any) {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<DataTablesResponse>(GLOBAL.urlBackend + this.urlApi + '/datatable', dataTablesParameters, { headers });
  }



  /**
   * Crea un nuevo servicio para el lavadero
   * @param lavaderoServicio
   */
  agregar(lavaderoServicio: LavaderoServicio): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, lavaderoServicio, {headers});
  }

  /**
   * Edita un lavadero servicio
   * @param lavaderoServicio
   */
  editar(lavaderoServicio: LavaderoServicio): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.put(GLOBAL.urlBackend + this.urlApi, lavaderoServicio, {headers});
  }



  /**
   * Elimina un lavadero servicio (Cambia estado a eliminado)
   * @param codigo
   */

  delete(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }



  /**
   * Cambia el estado de un lavadero service (Activo inactivo)
   * @param codigo
   * @param estado
   */

  cambiarEstado(codigo: number, estado: string): Observable<any> {
    const body = `estado=${encodeURIComponent(estado)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/estado/' + codigo, body, {headers});
  }


  /**
   * Carga la configuracion del servicio para el lavadero disponible
   */
  cargarConfiguracionServicioLavadero(codigoLavadero: number, codigoServicio: string): Observable<any> {

    const body = `codigoTipoServicio=${encodeURIComponent(codigoServicio)}`;

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/configuracion/lavadero/' + codigoLavadero, body, {headers});
  }




}
