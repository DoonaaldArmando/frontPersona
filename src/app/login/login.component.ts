import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'app/services/autenticacion.service';
import { AuthService } from 'app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'app/models/usuario';
import { Estado } from 'app/models/respuesta';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public usuario : Usuario;
  public cargando: boolean = false;
  baseHREF:string = environment.baseHREF;
  
  constructor(private toastr: ToastrService,
              private autenticacion: AutenticacionService,
              private auth: AuthService,
              private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.auth.removeToken();
    this.usuario = new Usuario();
  }

  login(){
    this.cargando = true;
    this.autenticacion.login(this.usuario).subscribe(respuesta =>{
      if(respuesta.estado == Estado.OK)
      {
        this.auth.setToken(respuesta.respuesta);
        this.auth.redireccionar("personas");
      }
      else{
        this.toastr.error("Usuario o contraseña incorrectos.","TEST PERSONA",{ positionClass: 'toast-bottom-center'});
        this.cargando = false;
      }
    },
    error =>{
      this.toastr.error("Error al iniciar sesión","TEST PERSONA",{ positionClass: 'toast-bottom-center'});
      this.cargando = false;
    },
    () => { this.cargando = false; });
  }

  imagenFondo(){
    return this.sanitization.bypassSecurityTrustStyle("url(.."+this.baseHREF+"assets/img/bg7.jpg)");
  }


}
