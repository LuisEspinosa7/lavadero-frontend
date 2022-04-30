import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Usuario} from '../../../models/usuario';
import {RolService} from '../../../services/rol/rol.service';
import {Rol} from '../../../models/rol';
import {TipoIdentificacionService} from '../../../services/tipoIdentificacion/tipoIdentificacion.service';
import {TipoIdentificacion} from '../../../models/tipoIdentificacion';


@Component({
  selector: 'app-admin-dialog-usuario',
  templateUrl: './dialog-usuario.component.html',
  styleUrls: ['./dialog-usuario.component.css']
})
export class DialogUsuarioComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  usuario: Usuario;
  rolesJSON: Rol[];
  selectedRol: number;
  selectedTipoIdentificacion: number;
  tiposIdentificacionJSON: TipoIdentificacion[];

  constructor(
    private formBuilder: FormBuilder,
    private _rolesService: RolService,
    private _tiposIdentificacionService: TipoIdentificacionService,
    private dialogRef: MatDialogRef<DialogUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.usuario = data.usuario;

    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');

    this.getRoles();
    this.getTiposIdentificacion();

    // DEPENDE DE LA ACCION, EL DIALOG SE CONFIGURA
    if(this.accion === 'Adicionar'){
      console.log('En dialog, creando nuevo');

      this.form = this.formBuilder.group({
        nombre1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        nombre2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
        apellido1: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        apellido2: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(40)])],
        tipoIdentificacion: [null, Validators.compose([Validators.required])],
        identificacion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        direccion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        telefono: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        roles: [null, Validators.compose([Validators.required])]
      })

    }

  }


  getTiposIdentificacion() {
    this._tiposIdentificacionService.cargarTiposIdentificacion()
      .subscribe(
        response => {
          console.log(response);
          this.tiposIdentificacionJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  getRoles() {
    this._rolesService.getRolesForAdmin()
      .subscribe(
        response => {
          console.log(response);
          this.rolesJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }



  save() {
    console.log('Save');
    this.dialogRef.close(this.form.value);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
