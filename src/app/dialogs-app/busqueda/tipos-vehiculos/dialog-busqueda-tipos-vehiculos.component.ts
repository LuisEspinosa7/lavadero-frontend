import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {TipoVehiculo} from '../../../models/TipoVehiculo';
import {TipoVehiculoService} from '../../../services/tipoVehiculo/tipoVehiculo.service';

@Component({
  selector: 'app-admin-dialog-busqueda-tipos-vehiculos',
  templateUrl: './dialog-busqueda-tipos-vehiculos.component.html',
  styleUrls: ['./dialog-busqueda-tipos-vehiculos.component.css']
})
export class DialogBusquedaTiposVehiculosComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  tipoVehiculoSeleccionado: TipoVehiculo;
  tiposVehiculosJSON: TipoVehiculo[] = [];
  filteredOptions: Observable<TipoVehiculo[]>;
  seleccionoTipoVehiculo: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _tiposVehiculosService: TipoVehiculoService,
    private dialogRef: MatDialogRef<DialogBusquedaTiposVehiculosComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoTipoVehiculo = false;
    this.getDisponibles();

    this.form = this.formBuilder.group({
      tipoVehiculo: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['tipoVehiculo'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): TipoVehiculo[] {
    const filterValue = value.toLowerCase();
    return this.tiposVehiculosJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  getDisponibles() {
    console.log('En metodo buscando');
    this._tiposVehiculosService.cargarDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.tiposVehiculosJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioTipoVehiculo(tipoVehiculo: TipoVehiculo){
    console.log(tipoVehiculo);
    this.tipoVehiculoSeleccionado = tipoVehiculo;
    this.seleccionoTipoVehiculo = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.tipoVehiculoSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
