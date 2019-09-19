import { Injectable } from '@angular/core';
import { RespuestaAut } from '../models/respuesta';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { environment } from 'environments/environment';
import { BaseService } from './base.service';
import { Usuario } from 'app/models/usuario';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService extends BaseService{
  public autenticacionUrl = environment.urlWebAPIAuth+"/user"; 

  constructor(
    private http: HttpClient) {  super(); }

  /** Iniciar sesion */
  login(usuario: Usuario ): Observable<RespuestaAut> {
    let url = this.autenticacionUrl;
    httpOptions.headers = httpOptions.headers.append('XUsuario', usuario.xNombre);	
    httpOptions.headers = httpOptions.headers.append('XPassword', usuario.xPass);	
    return this.http.get<RespuestaAut>(url,httpOptions)
                    .pipe(catchError(this.handleError));
  }

}
