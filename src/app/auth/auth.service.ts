import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class AuthService {

  constructor(public jwtHelper: JwtHelperService,
              private router: Router) {
              }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token:string){
    localStorage.setItem("token",token);
  }

  public removeToken(){
    localStorage.removeItem("token");
  }

  public redireccionar(ruta:string){
    this.router.navigate([ruta]);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}