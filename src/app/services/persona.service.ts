
import { Injectable } from '@angular/core';
import { RespuestaAut } from '../models/respuesta';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { environment } from 'environments/environment';
import { BaseService } from './base.service';
import { Persona, Ciudad, Departamento } from 'app/models/persona';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends BaseService{
  protected personaUrl = environment.urlWebAPIPersona+'/personas/'; 

  constructor(
    private http: HttpClient) { super(); }

  listar(): Observable<Persona[]> {
    let url = this.personaUrl;
    return this.http.get<Persona[]>(url)
                    .pipe(catchError(this.handleError));
  }

  registrar(persona:Persona): Observable<Persona>{
    let url = this.personaUrl;
    return this.http.post<Persona>(url, persona, httpOptions)
                    .pipe(catchError(this.handleError));
  } 

}

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService extends BaseService{
  protected localizacionUrl = environment.urlWebAPIPersona+'/localizaciones/'; 

  constructor(
    private http: HttpClient) { super(); }

  departamentos(): Observable<Departamento[]> {
    let url = this.localizacionUrl+"departamento";
    return this.http.get<Departamento[]>(url)
                    .pipe(catchError(this.handleError));
  }

  ciudades(idDepartamento:number): Observable<Ciudad[]>{
    let url = this.localizacionUrl+"ciudad/"+idDepartamento;
    return this.http.get<Ciudad[]>(url)
                    .pipe(catchError(this.handleError));
  } 

  todasCiudades(): Observable<Ciudad[]>{
    let url = this.localizacionUrl+"ciudad";
    return this.http.get<Ciudad[]>(url)
                    .pipe(catchError(this.handleError));
  } 

}
