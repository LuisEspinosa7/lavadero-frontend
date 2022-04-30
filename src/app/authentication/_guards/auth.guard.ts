import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user/user.service';
import decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  rolesUser: any[] = [];
  rolesPermitidos: any[] = [];
  public dataUser:any

  constructor(private router: Router, private auth: AuthService, private userService: UserService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.auth.isAuthenticated()) {

        if(this.userService.tienePerfil()){

            //ROLES PERMITIDOS PARA EL API
            this.rolesPermitidos = next.data.roles;

            let permitido = this.userService.roleMatch(this.rolesPermitidos);

            if(permitido){
                return true;
            }else{
                //NO TIENE NINGUNO DE LOS ROLES PERMITIDOS
                console.log('NO TIENE NINGUNO DE LOS ROLES PERMITIDOS');
                this.router.navigate(['authentication/login']);
                return false;
            }

            /**
            let perfil = this.userService.obtenerPerfil();

            for (let j = 0; j < this.rolesPermitidos.length; j++) {
                if (perfil === this.rolesPermitidos[j]) {
                    // EL PERFIL ESTA AUTORIZADO PARA INGRESAR
                    console.log('EL PERFIL ESTA AUTORIZADO PARA INGRESAR');
                    return true;
                }
            }
            **/



        } else {
            console.log('No tiene perfil escogido, se va para login');
            this.router.navigate(['authentication/login']);
            return false;
        }


    } else {
        //NO TIENE UN TOKEN
        this.router.navigate(['authentication/login']);
        return false;
    }

  }
}
