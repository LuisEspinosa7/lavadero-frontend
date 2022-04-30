import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {LavaderoService} from '../../../services/lavadero/lavadero.service';
import {Lavadero} from '../../../models/lavadero';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-admin-dialog-busqueda-lavadero',
  templateUrl: './dialog-busqueda-lavaderos.component.html',
  styleUrls: ['./dialog-busqueda-lavaderos.component.css']
})
export class DialogBusquedaLavaderoComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  lavaderoSeleccionado: Lavadero;
  lavaderosJSON: Lavadero[] = [];
  filteredOptions: Observable<Lavadero[]>;
  seleccionoLavadero: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _lavaderoService: LavaderoService,
    private dialogRef: MatDialogRef<DialogBusquedaLavaderoComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoLavadero = false;
    this.getLavaderosDisponibles();

    this.form = this.formBuilder.group({
      lavadero: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['lavadero'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): Lavadero[] {
    const filterValue = value.toLowerCase();
    return this.lavaderosJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  getLavaderosDisponibles() {
    console.log('En metodo buscando los lavaderos');
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


  cambioLavadero(lavadero: Lavadero){
    console.log(lavadero);
    this.lavaderoSeleccionado = lavadero;
    this.seleccionoLavadero = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.lavaderoSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
