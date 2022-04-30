import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {UserService} from '../../../services/user/user.service';
import {LavaderoService} from '../../../services/lavadero/lavadero.service';
import {PersonalLavadero} from '../../../models/PersonalLavadero';
import {Lavadero} from '../../../models/lavadero';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../models/usuario';

@Component({
  selector: 'app-admin-dialog-personal-lavadero',
  templateUrl: './dialog-personal-lavadero.component.html',
  styleUrls: ['./dialog-personal-lavadero.component.css']
})
export class DialogPersonalLavaderoComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;


  //personalLavadero: PersonalLavadero;

  /**
  rolesJSON: Rol[];
  selectedRol: number;
  selectedTipoIdentificacion: number;
   **/

  lavaderosJSON: Lavadero[] = [];
  filteredOptions1: Observable<Lavadero[]>;
  seleccionoLavadero: boolean;

  //usuariosJSON: Usuario[] = [];
  //filteredOptions2: Observable<Usuario[]>;
  //seleccionoUsuario: boolean;



  constructor(
    private formBuilder: FormBuilder,
    private _lavaderoService: LavaderoService,
    private _userService: UserService,
    private dialogRef: MatDialogRef<DialogPersonalLavaderoComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    //this.personalLavadero = data.personalLavadero;

    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoLavadero = false;
    //this.seleccionoUsuario = false;
    this.getLavaderosDisponibles();
    //this.getUsuariosDisponibles();

    // DEPENDE DE LA ACCION, EL DIALOG SE CONFIGURA
    if(this.accion === 'Adicionar'){
      console.log('En dialog, creando nuevo');

      this.form = this.formBuilder.group({
        lavadero: [null, Validators.compose([Validators.required])],
        //usuario: [null, Validators.compose([Validators.required])]
      })

      this.filteredOptions1 = this.form.controls['lavadero'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      /**
      this.filteredOptions2 = this.form.controls['usuario'].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter2(value))
        );
       **/


    }

  }


  private _filter(value: string): Lavadero[] {
    const filterValue = value.toLowerCase();

    return this.lavaderosJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  /**
  private _filter2(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.usuariosJSON.filter(option => option.email.toLowerCase().includes(filterValue));
  }
   **/



  getLavaderosDisponibles() {
    this._lavaderoService.cargarLavaderosDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.lavaderosJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }

  /**
  getUsuariosDisponibles() {
    this._userService.cargarUsuariosDisponibles()
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
**/

  cambioLavadero(lavadero: Lavadero){

    console.log(lavadero);
    this.seleccionoLavadero = true;

  }

  /**
  cambioUsuario(usuario: Usuario){

    console.log(usuario);
    this.seleccionoUsuario = true;

  }
   **/


  /**
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
   **/



  save() {
    console.log('Save');
    this.dialogRef.close(this.form.value);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
