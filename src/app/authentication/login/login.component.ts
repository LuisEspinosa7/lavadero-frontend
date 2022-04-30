import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { GLOBAL } from '../../models/global';
import { MatProgressButtonOptions } from 'mat-progress-buttons'

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Rol} from '../../models/rol';
import {LavaderoService} from '../../services/lavadero/lavadero.service';
import {Lavadero} from '../../models/lavadero';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  submitted = false;
  public error: string;
  public dataUser:any;
  rolesUser: Rol[] = [];
  rolesCount: number;

  rolesUserFixed: any[] = [];

  lavaderosUsuario: Lavadero[] = [];

  logging: boolean;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private userService: UserService, private _lavaderoService: LavaderoService) {}

  ngOnInit() {

    this.logging = false;

    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }




  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    console.log('El formulario esta bien diligenciado');
    console.log(this.form.value);

    this.logging = true;
    this.disableButtonLogin();

    this.auth.login(this.form.value.email, this.form.value.password)
      .pipe(first())
      .subscribe(
        result => {
            console.log('Dentro del componente');
            console.log(result);

            //SI EXISTE UN TOKEN EN EL HEADER AUTORIZATION
            if(result == true){

                //ESTA AUTENTICADO, SE VERIFICA EL ROL
                // SE OBTIENE EL EMAIL
                const email = localStorage.getItem('email');

                //SE CARGA LA INFORMACION DEL USUARIO
                this.userService.getUserData(email)
                .subscribe(
                  result => {

                      //ENCONTRO EL USUARIO
                      if(result){

                          // VERIFICA CUANTOS ROLES TIENE, SI TIENE 1 ROL, ENTONCES LO REDIRIGE AL  DASHBOARD.
                          // PERO SI TIENE MAS DE 1 perfil, ENTONCES LE DA A ESCOGER

                          //SE OBTIENE EL USUARIO
                          this.dataUser = JSON.parse(localStorage.getItem('user'));
                          console.log(this.dataUser.roles);
                          this.rolesUser = this.dataUser.roles;

                          console.log(this.dataUser);


                          for (let entry of this.rolesUser) {
                            if(entry.codigo != GLOBAL.rolCliente && entry.codigo != GLOBAL.rolTecnico){
                              console.log('Dentro del ciclo ...');
                              let rolCorregido: Rol = new Rol(entry.codigo, entry.nombre);
                              this.rolesUserFixed.push(rolCorregido);
                            }
                          }

                          //CONTAMOS CUANTO ROLES TIENE
                          this.rolesCount = this.rolesUserFixed.length;

                          if(this.rolesCount === 0){
                              //ES UN USUARIO MAL FORMADO, SE EXPULSA DEL APLICATIVO
                            this.logging = false;
                            this.enableButtonLogin();
                            console.log('USUARIO INVALIDO SIN PERFILES');
                            this.error = 'El usuario no tiene perfiles administrativos';
                            return false;
                          }

                          //TIENE UN SOLO PERFIL
                          if(this.rolesCount === 1){
                              console.log('Tiene 1 perfil');
                              this.redirigirAdashboard1PerfilAdministrativo();
                          } else {
                              console.log('Tiene mas de 1 perfil, el usuario debe escoger el perfil');
                              this.redirigirAdashboard2PerfilesAdministrativos();
                          }


                      } else {
                        this.logging = false;
                        this.enableButtonLogin();
                        this.router.navigate(['authentication/login']);
                        return false;
                      }

                  },
                  err => {
                    this.logging = false;
                    this.enableButtonLogin();
                    console.log(err);
                    this.router.navigate(['authentication/login']);
                    return false;
                  }
                );

            }
            //EN CASO CONTRARIO
            else{
              this.logging = false;
              this.enableButtonLogin();
              this.error = 'Credenciales Incorrectas';
            }

        },
        err => {
            console.log(err);
            this.logging = false;
            this.enableButtonLogin();

            //MENSAJE DE CREDENCIALES INVALIDAS
            if(err.status == 403){
                console.log('Credenciales Incorrectas');
                this.error = 'Credenciales Incorrectas';
            }
            //CUALQUIER OTRO ERROR
            else{
                this.error = 'Credenciales Incorrectas';
            }

        }

      );
  }


  /**
   * Decide a que dashboard enviar
   */
  redirigirAdashboard1PerfilAdministrativo(){
      console.log('Redirigiendo al dashboard segun perfil');

    if (this.rolesUserFixed[0].nombre === GLOBAL.roleAdministrador) {
      console.log('ES ADMINISTRADOR');
      this.userService.asginarPerfil(GLOBAL.roleAdministrador);
      this.router.navigate(['/dashboards/dashboard1']);
      this.logging = false;
      this.enableButtonLogin();
      return true;
    } else

    if (this.rolesUserFixed[0].nombre === GLOBAL.rolePropietario) {
      console.log('ES PROPIETARIO');
      this.consultarVinculacionLavadero(GLOBAL.rolePropietario);
    } else

    if (this.rolesUserFixed[0].nombre === GLOBAL.roleOperario) {
      console.log('ES OPERARIO');
      this.consultarVinculacionLavadero(GLOBAL.roleOperario);
    }

    else {
      //EL ROL NO ES PERMITIDO
      console.log('EL ROL NO ES PERMITIDO');
      this.error = 'No esta autorizado para ingresar';
      this.logging = false;
      this.enableButtonLogin();
      return false;
    }


  }


  /**
   * Envia a la pantalla de seleccion de perfil
   */
  redirigirAdashboard2PerfilesAdministrativos(){
      this.router.navigate(['authentication/selection']);
  }


  /**
   * Consulta si esta vinculado a un lavadero activo
   */
  consultarVinculacionLavadero(perfilUsuario: string){
    console.log('En metodo buscando los lavaderos');

    this._lavaderoService.cargarLavaderosUsuario(this.dataUser.codigo)
      .subscribe(
        response => {
          console.log(response);

          this.lavaderosUsuario = response;

          if(this.lavaderosUsuario.length > 0){

            if (perfilUsuario === GLOBAL.rolePropietario) {
              console.log('ES PROPIETARIO');
              this.userService.asginarPerfil(GLOBAL.rolePropietario);
              this.router.navigate(['/dashboards/dashboard2']);
              this.logging = false;
              this.enableButtonLogin();
              return true;
            }

            if (perfilUsuario === GLOBAL.roleOperario) {
              console.log('ES OPERARIO');
              this.userService.asginarPerfil(GLOBAL.roleOperario);
              this.router.navigate(['/dashboards/dashboard3']);
              this.logging = false;
              this.enableButtonLogin();
              return true;
            }


          } else {
            this.error = 'El usuario no esta vinculado a un lavadero';
            this.userService.asginarPerfil(null);
            localStorage.setItem('user', null);
            this.logging = false;
            this.enableButtonLogin();
            return false;
          }


        },
        error =>  {
          console.log(<any>error);
          this.error = 'El usuario no esta vinculado a un lavadero';
          this.userService.asginarPerfil(null);
          localStorage.setItem('user', null);
          this.logging = false;
          this.enableButtonLogin();
          return false;
        }
      );



  }


  disableButtonLogin(){
    console.log('Desactivando los botones de login');

    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
  }

  enableButtonLogin(){
    console.log('Activando los botones de login');

    this.form.controls['email'].enable();
    this.form.controls['password'].enable();
  }


}
