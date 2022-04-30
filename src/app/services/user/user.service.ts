import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global'
import { Usuario } from '../../models/usuario';
import {TipoVehiculo} from '../../models/TipoVehiculo';
import {TipoLiquidacion} from '../../models/TipoLiquidacion';



@Injectable()
export class UserService {

    private urlApi = '/usuario';
    public usuario: Usuario;

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Verifica que el usuario tenga los perfiles autorizados
   * @param rolesPermitidos
   */
  roleMatch(rolesPermitidos): boolean {
      let perfil = this.obtenerPerfil();

      for (let j = 0; j < rolesPermitidos.length; j++) {
          if (perfil === rolesPermitidos[j]) {
              // EL PERFIL ESTA AUTORIZADO PARA INGRESAR
              return true;
          }
      }

      return false;
  }

  /**
   * Asigna el perfil
   * @param perfil
   */
  asginarPerfil(perfil: string): void {
    localStorage.setItem('perfil', perfil);
  }

  /**
   * Obtiene el perfil actual del usuario
   */
  obtenerPerfil(): string {
    let perfil = localStorage.getItem('perfil');
    return perfil;
  }

  /**
   * Verifica que halla escogido un perfil
   */
  tienePerfil(): boolean {
    let perfil = localStorage.getItem('perfil');

    if(perfil == null){
        return false;
    }

    return true;
  }

  /**
   * Obtiene el usuario en sesion
   */
  getUser(): Usuario {
    this.usuario = JSON.parse(localStorage.getItem('user'));
    return this.usuario;
  }

  /**
   * Solicita la informacion del usuario
   * @param email
   */
  getUserData(email: string): Observable<any> {
      const body = `email=${encodeURIComponent(email)}`;
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      headers = headers.set('Authorization', localStorage.getItem('access_token'));

      return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/findByEmail', body, { headers,
        observe: 'response'}).pipe(
          map(result => {
              if(result.body){
                  if(result.body.code == 200){
                      localStorage.setItem('user', JSON.stringify(result.body.data));
                      return true;
                  }else {
                      return false;
                  }

              } else {
                  return false;
              }
          })
      );
    }


  /**
   * Crea un nuevo usuario
   * @param usuario
   */
  agregar(usuario: Usuario, selectedFile: File): Observable<any> {

      let headers =  new HttpHeaders();
      headers = headers.set('Authorization', localStorage.getItem('access_token'));

      const uploadData: FormData = new FormData();
      uploadData.append('file', selectedFile, selectedFile.name);
      uploadData.append('usuario', new Blob([JSON.stringify(usuario)], {type: 'application/json'}));

      return this.http.post(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Edita un usuario
   * @param usuario
   */
  editar(usuario: Usuario, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('usuario', new Blob([JSON.stringify(usuario)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi, uploadData, {headers});
  }


  /**
   * Elimina un usuario (Cambia estado a eliminado)
   * @param codigo
   */
  delete(codigo): Observable<any> {
      let headers =  new HttpHeaders();
      headers = headers.set('Authorization', localStorage.getItem('access_token'));
      return this.http.delete(GLOBAL.urlBackend + this.urlApi + '/' + codigo, {headers});
  }


  /**
   * Cambia el estado del usuario (Activo inactivo)
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
   * Carga los usuarios disponibles
   */
  cargarUsuariosDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }


  /**
   * Carga los usuarios tecnicos disponibles
   */
  cargarUsuariosTecnicosDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/tecnicos/disponibles', {headers});
  }


  /**
   * Crea un nuevo cliente
   * @param cliente
   */
  crearCliente(cliente: Usuario): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/cliente', cliente, {headers});
  }

  /**
   * Buscar un cliente por identificacion
   * @param identificacion
   */
  buscarCliente(identificacion: string): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/cliente/' + identificacion, {headers});
  }


  /**
   * Actualiza el perfil de un usuario
   * @param usuario
   * @param selectedFile
   */
  updatePerfil(usuario: Usuario, selectedFile: File): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    const uploadData: FormData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('usuario', new Blob([JSON.stringify(usuario)], {type: 'application/json'}));

    return this.http.put(GLOBAL.urlBackend + this.urlApi + '/updatePerfil', uploadData, {headers});
  }


  /**
   * Cambia el password del usuario
   * @param codigo
   * @param estado
   */
  changePassword(codigo: number, password: string): Observable<any>{
    const body = `password=${encodeURIComponent(password)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post<any>(GLOBAL.urlBackend + this.urlApi + '/perfil/password/' + codigo, body, {headers});
  }


}
