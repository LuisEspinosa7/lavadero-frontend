import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global'
import { Usuario } from '../../models/usuario';
import {TipoVehiculo} from '../../models/TipoVehiculo';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';
import {ClienteVehiculo} from '../../models/ClienteVehiculo';



@Injectable()
export class ClienteVehiculoService {

  private urlApi = '/clienteVehiculo';

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo vehiculo
   * @param cliente
   */
  crearVehiculo(clienteVehiculo: ClienteVehiculo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/vehiculo', clienteVehiculo, {headers});
  }

  /**
   * Buscar un vehiculo por placa
   * @param placa
   */
  buscarVehiculo(placa: string): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/vehiculo/' + placa, {headers});
  }


  /**
   * Actualizar el vehiculo
   * @param clienteVehiculo
   */
  actualizarVehiculo(clienteVehiculo: ClienteVehiculo): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.put(GLOBAL.urlBackend + this.urlApi + '/vehiculo', clienteVehiculo, {headers});
  }


}
