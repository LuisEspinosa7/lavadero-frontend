import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../../models/global'


@Injectable()
export class OrdenItemService {

  private urlApi = '/ordenItem';

  constructor(private http: HttpClient) { }

  /**
   * Buscar las items de la orden de un lavadero
   * @param codigoOrden
   */
  buscarItemsXOrden(codigoOrden: number): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/orden/' + codigoOrden, {headers});
  }


}
