import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global'
import {TipoLiquidacion} from '../../models/TipoLiquidacion';



@Injectable()
export class TipoLiquidacionService {

  private urlApi = '/tipoLiquidacion';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo tipo liquidacion
   * @param tipoLiquidacion
   */
  crearTipoLiquidacion(tipoLiquidacion: TipoLiquidacion): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, tipoLiquidacion, {headers});
  }


  /**
   * Elimina un tipo liquidacion (Cambia estado a eliminado)
   * @param codigo
   */
  deleteTipoLiquidacion(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado del tipo liquidacion (Activo inactivo)
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
   * Edita un tipo liquidacion
   * @param tipo liquidacion
   */
  editarUsuario(tipoLiquidacion: TipoLiquidacion): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.put(this.urlApi + "/" + tipoLiquidacion.codigo, tipoLiquidacion, {headers});
  }


  /**
   * Carga los tipos liquidaciones disponibles
   */
  cargarTiposLiquidacionDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }

}
