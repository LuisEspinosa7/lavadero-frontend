import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Lavadero} from '../../../models/lavadero';
import {LavaderoService} from '../../../services/lavadero/lavadero.service';
import {TipoServicio} from '../../../models/TipoServicio';
import {TipoServicioService} from '../../../services/tipoServicio/tipoServicio.service';

@Component({
  selector: 'app-admin-dialog-busqueda-tipos-servicios',
  templateUrl: './dialog-busqueda-tipos-servicios.component.html',
  styleUrls: ['./dialog-busqueda-tipos-servicios.component.css']
})
export class DialogBusquedaTiposServiciosComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  tipoServicioSeleccionado: TipoServicio;
  tiposServiciosJSON: TipoServicio[] = [];
  filteredOptions: Observable<TipoServicio[]>;
  seleccionoTipoServicio: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _tiposServiciosService: TipoServicioService,
    private dialogRef: MatDialogRef<DialogBusquedaTiposServiciosComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoTipoServicio = false;
    this.getDisponibles();

    this.form = this.formBuilder.group({
      tipoServicio: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['tipoServicio'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): TipoServicio[] {
    const filterValue = value.toLowerCase();
    return this.tiposServiciosJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  getDisponibles() {
    console.log('En metodo buscando');
    this._tiposServiciosService.cargarTiposServiciosDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.tiposServiciosJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioTipoServicio(tipoServicio: TipoServicio){
    console.log(tipoServicio);
    this.tipoServicioSeleccionado = tipoServicio;
    this.seleccionoTipoServicio = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.tipoServicioSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
