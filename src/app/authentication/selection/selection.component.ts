import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { GLOBAL } from '../../models/global';
import { Usuario } from '../../models/usuario';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Rol} from '../../models/rol';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  public form: FormGroup;
  submitted = false;
  public usuario: Usuario;
  rolesUser: Rol[] = [];
  rolesUserFixed: any[] = [];
  rolesCount: number;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private userService: UserService) {}

  ngOnInit() {
    console.log('Iniciando Seleccionar Perfil');
    this.cargarUsuario();
    this.cargarPerfilesUsuario();

    this.form = this.fb.group({
      perfil: [null, Validators.compose([Validators.required])]
    });

  }


  cargarUsuario(){
      this.usuario = JSON.parse(localStorage.getItem('user'));
      console.log(this.usuario);
  }


  cargarPerfilesUsuario(){
    // LIMPIANDO ROL CLIENTE
    console.log('Limpiando ROL cliente .....');
    console.log(this.usuario.roles);
    this.rolesUser = this.usuario.roles;

    for (let entry of this.rolesUser) {
      let nombreCorregido: string = entry.nombre.replace('ROLE_', '');

      let rolCorregido: Rol = new Rol(entry.codigo, nombreCorregido);

      if(entry.codigo != GLOBAL.rolCliente){
        this.rolesUserFixed.push(rolCorregido);
      }
    }

    console.log(this.rolesUserFixed);
    this.rolesCount = this.rolesUser.length;
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    console.log('El formulario esta bien diligenciado');
    console.log(this.form.value);

    let nombrePerfil: string;

    Object.keys(this.rolesUser).forEach(key => {
        if (this.rolesUser[key].codigo === this.form.value.perfil) {
            nombrePerfil = this.rolesUser[key].nombre;
            console.log("Nombre del Perfil: " + nombrePerfil);
        }
    });
    //console.log('Asignando perfil');
    //this.userService.asginarPerfil(nombrePerfil);

    //REDIRIGIR A DASHBOARD
    this.redirigirAdashboard(nombrePerfil);
  }


  /**
   * Redirige a la dashboard segun el perfil
   * @param nombrePerfil
   */
  redirigirAdashboard(nombrePerfil:string){
      console.log('Redirigiendo al dashboard');
      console.log('Nombre perfil: ' + nombrePerfil);

      if(nombrePerfil === GLOBAL.roleAdministrador){
          console.log('ES ADMINISTRADOR');
          this.userService.asginarPerfil(GLOBAL.roleAdministrador);
          this.router.navigate(['/dashboards/dashboard1']);
      }


      if(nombrePerfil === GLOBAL.rolePropietario){
          console.log('ES PROPIETARIO');
          this.userService.asginarPerfil(GLOBAL.rolePropietario);
          this.router.navigate(['/dashboards/dashboard2']);
      }

      if(nombrePerfil === GLOBAL.roleOperario){
        console.log('ES OPERARIO');
        this.userService.asginarPerfil(GLOBAL.roleOperario);
        this.router.navigate(['/dashboards/dashboard2']);
      }

  }



}
