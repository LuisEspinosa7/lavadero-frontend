import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {TipoVehiculo} from '../../../models/TipoVehiculo';


@Component({
  selector: 'app-admin-dialog-tipo-vehiculo',
  templateUrl: './dialog-tipo-vehiculo.component.html',
  styleUrls: ['./dialog-tipo-vehiculo.component.css']
})
export class DialogTipoVehiculoComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  tipoVehiculo: TipoVehiculo;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogTipoVehiculoComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.tipoVehiculo = data.tipoVehiculo;

    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');

    // DEPENDE DE LA ACCION, EL DIALOG SE CONFIGURA
    if(this.accion === 'Adicionar'){
      console.log('En dialog, creando nuevo');

      this.form = this.formBuilder.group({
        nombre: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
        descripcion: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])]
      })

    }

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
