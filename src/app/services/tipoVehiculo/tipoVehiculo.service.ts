import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global'
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {TipoVehiculo} from '../../models/TipoVehiculo';
import {Usuario} from '../../models/usuario';



@Injectable()
export class TipoVehiculoService {

  private urlApi = '/tipoVehiculo';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo tipo vehiculo
   * @param tipoVehiculo
   */
  agregar(tipoVehiculo: TipoVehiculo, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('tipoVehiculo', new Blob([JSON.stringify(tipoVehiculo)], {type: 'application/json'}));

    return this.http.post(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Edita un tipo vehiculo
   * @param tipo vehiculo
   */
  editar(tipoVehiculo: TipoVehiculo, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('tipoVehiculo', new Blob([JSON.stringify(tipoVehiculo)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Elimina un tipo vehiculo (Cambia estado a eliminado)
   * @param codigo
   */
  deleteTipoVehiculo(codigo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado del tipo vehiculo (Activo inactivo)
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
   * Carga los tipos vehiculos disponibles
   */
  cargarDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }



}
