import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';




@Injectable()
export class ImageService {

  private urlApi = '/imagen';

  constructor(private http: HttpClient) { }

  getImage(imageName: string, entity: string): Observable<Blob>{

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/' + entity + '/' + imageName, {headers, responseType: 'blob'});
  }

}
