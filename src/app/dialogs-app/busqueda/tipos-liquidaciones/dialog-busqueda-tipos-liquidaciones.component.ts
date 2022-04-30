import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Lavadero} from '../../../models/lavadero';
import {LavaderoService} from '../../../services/lavadero/lavadero.service';
import {TipoServicio} from '../../../models/TipoServicio';
import {TipoServicioService} from '../../../services/tipoServicio/tipoServicio.service';
import {TipoLiquidacion} from '../../../models/TipoLiquidacion';
import {TipoLiquidacionService} from '../../../services/tipoLiquidacion/tipoLiquidacion.service';

@Component({
  selector: 'app-admin-dialog-busqueda-tipos-liquidaciones',
  templateUrl: './dialog-busqueda-tipos-liquidaciones.component.html',
  styleUrls: ['./dialog-busqueda-tipos-liquidaciones.component.css']
})
export class DialogBusquedaTiposLiquidacionesComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  tipoLiquidacionSeleccionado: TipoLiquidacion;
  tiposLiquidacionesJSON: TipoLiquidacion[] = [];
  filteredOptions: Observable<TipoLiquidacion[]>;
  seleccionoTipoLiquidacion: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _tipoLiquidacionService: TipoLiquidacionService,
    private dialogRef: MatDialogRef<DialogBusquedaTiposLiquidacionesComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoTipoLiquidacion = false;
    this.getDisponibles();

    this.form = this.formBuilder.group({
      tipoLiquidacion: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['tipoLiquidacion'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): TipoLiquidacion[] {
    const filterValue = value.toLowerCase();
    return this.tiposLiquidacionesJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  getDisponibles() {
    console.log('En metodo buscando');
    this._tipoLiquidacionService.cargarTiposLiquidacionDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.tiposLiquidacionesJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioTipoLiquidacion(tipoLiquidacion: TipoLiquidacion){
    console.log(tipoLiquidacion);
    this.tipoLiquidacionSeleccionado = tipoLiquidacion;
    this.seleccionoTipoLiquidacion = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.tipoLiquidacionSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
