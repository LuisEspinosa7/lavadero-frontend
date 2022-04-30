import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import {PersonalLavadero} from '../../models/PersonalLavadero';


@Injectable()
export class PersonalLavaderoService {

  private urlApi = '/personalLavadero';

  constructor(private http: HttpClient) { }

  /**
   * Busca los datos de la tabla
   * @param dataTablesParameters
   */
  getLavaderoDatatable(dataTablesParameters: any) {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<DataTablesResponse>(GLOBAL.urlBackend + this.urlApi + '/datatable', dataTablesParameters, { headers });
  }



  /**
   * Crea un nuevo tipo liquidacion
   * @param tipoLiquidacion
   */
  agregar(personalLavadero: PersonalLavadero): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, personalLavadero, {headers});
  }



  /**
   * Elimina un personal lavadero (Cambia estado a eliminado)
   * @param codigo
   */

  delete(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }



  /**
   * Cambia el estado de un personal lavadero (Activo inactivo)
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





}
