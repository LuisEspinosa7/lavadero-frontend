import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Usuario} from '../../../models/usuario';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-admin-dialog-busqueda-tecnicos',
  templateUrl: './dialog-busqueda-tecnicos.component.html',
  styleUrls: ['./dialog-busqueda-tecnicos.component.css']
})
export class DialogBusquedaTecnicosComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  usuarioSeleccionado: Usuario;
  usuariosJSON: Usuario[] = [];
  filteredOptions: Observable<Usuario[]>;
  seleccionoUsuario: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private dialogRef: MatDialogRef<DialogBusquedaTecnicosComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoUsuario = false;
    this.getUsuariosTecnicosDisponibles();

    this.form = this.formBuilder.group({
      usuario: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['usuario'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();
    return this.usuariosJSON.filter(option => option.identificacion.toLowerCase().includes(filterValue));
  }


  getUsuariosTecnicosDisponibles() {
    console.log('En metodo buscando los usuarios');
    this._userService.cargarUsuariosTecnicosDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.usuariosJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioUsuario(usuario: Usuario){
    console.log(usuario);
    this.usuarioSeleccionado = usuario;
    this.seleccionoUsuario = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.usuarioSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
