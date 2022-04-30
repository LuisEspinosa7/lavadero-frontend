import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import {PersonalLavadero} from '../../models/PersonalLavadero';
import {FuncionarioServicio} from '../../models/FuncionarioServicio';
import {LavaderoServicio} from '../../models/LavaderoServicio';


@Injectable()
export class FuncionarioServicioService {

  private urlApi = '/funcionarioServicio';

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
   * Crea un nuevo Funcionario Servicio
   * @param tipoLiquidacion
   */
  agregar(funcionarioServicio: FuncionarioServicio): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, funcionarioServicio, {headers});
  }


  /**
   * Edita un funcionario servicio
   * @param funcionarioServicio
   */
  editar(funcionarioServicio: FuncionarioServicio): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.put(GLOBAL.urlBackend + this.urlApi, funcionarioServicio, {headers});
  }



  /**
   * Elimina un Funcionario Servicio (Cambia estado a eliminado)
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


  /**
   * Carga la configuracion del funcionario servicio para el lavadero disponible
   */
  cargarPersonalDisponibleXServicioLavadero(codigoLavadero: number, codigoServicio: string): Observable<any> {

    const body = `codigoTipoServicio=${encodeURIComponent(codigoServicio)}`;

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/configuracion/lavadero/' + codigoLavadero, body, {headers});
  }


}
