import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';




@Injectable()
export class ReportesService {

  private urlApi = '/reportes';

  constructor(private http: HttpClient) { }

  /**
   *
   * REPORTES DE ADMINISTRADOR
   *
   */

  /**
   * Carga los lavaderos disponibles
   */
  cargarEmpresasVinculadas(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/admin/reporte1/informacion', {headers});
  }


  /**
   * reporte 2 : La facturación de cada lavadero  y La Facturación de las comisiones. y un Gran Total
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReporte2Informacion(fechaHoraInicio: string, fechaHoraFin: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/admin/reporte2/informacion', body, {headers});
  }


  /**
   * Genera reporte 2 : La facturación de cada lavadero  y La Facturación de las comisiones. y un Gran Total
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReporte2(fechaHoraInicio: string, fechaHoraFin: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/admin/reporte2/generar', body, { headers: headers, responseType: 'blob' });

  }


  /**
   * reporte 4 : Numero de servicios por lavadero al día, y al final un Total
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReporte4Informacion(fechaHoraInicio: string, fechaHoraFin: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/admin/reporte4/informacion', body, {headers});
  }


  /**
   * Genera reporte 4 : Numero de servicios por lavadero al día, y al final un Total
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReporte4(fechaHoraInicio: string, fechaHoraFin: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/admin/reporte4/generar', body, { headers: headers, responseType: 'blob' });

  }




  /**
   *
   * REPORTES DE PROPIETARIO
   *
   */

  /**
   * reporte 1 : Reporte por clientes, para determinar quién fue el cliente que más servicios realizó en el establecimiento, y luego de mayor a menor
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReportePropietario1Informacion(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte1/informacion', body, {headers});
  }


  /**
   * Genera reporte 1 : Reporte por clientes, para determinar quién fue el cliente que más servicios realizó en el establecimiento, y luego de mayor a menor
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReportePropietario1(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte1/generar', body, { headers: headers, responseType: 'blob' });

  }






  /**
   * reporte 2 : El trabajador más eficiente: cantidad de servicios que realizó tal trabajador, de mayor a menor
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReportePropietario2Informacion(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte2/informacion', body, {headers});
  }


  /**
   * Genera reporte 2 : El trabajador más eficiente: cantidad de servicios que realizó tal trabajador, de mayor a menor
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReportePropietario2(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte2/generar', body, { headers: headers, responseType: 'blob' });

  }








  /**
   * reporte 3 : El servicio más solicitado de mayor a menor.
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReportePropietario3Informacion(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte3/informacion', body, {headers});
  }


  /**
   * Genera reporte 3 : El servicio más solicitado de mayor a menor.
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReportePropietario3(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte3/generar', body, { headers: headers, responseType: 'blob' });

  }





  /**
   * reporte 4 : Reporte de lavadero: Reporte de liquidación de técnicos diaria o por fechas
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  getReportePropietario4Informacion(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any>{
    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte4/informacion', body, {headers});
  }


  /**
   * Genera reporte 4 : Reporte de lavadero: Reporte de liquidación de técnicos diaria o por fechas
   * @param fechaHoraInicio
   * @param fechaHoraFin
   */
  generarReportePropietario4(fechaHoraInicio: string, fechaHoraFin: string, lavaderoCodigo: string): Observable<any> {

    const body = `fechaHoraInicio=${encodeURIComponent(fechaHoraInicio)}&fechaHoraFin=${encodeURIComponent(fechaHoraFin)}&lavaderoCodigo=${encodeURIComponent(lavaderoCodigo)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/propietario/reporte4/generar', body, { headers: headers, responseType: 'blob' });

  }





}
