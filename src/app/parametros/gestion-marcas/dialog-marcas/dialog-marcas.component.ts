import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {TipoVehiculo} from '../../../models/TipoVehiculo';
import {Marca} from '../../../models/Marca';


@Component({
  selector: 'app-admin-dialog-marcas',
  templateUrl: './dialog-marcas.component.html',
  styleUrls: ['./dialog-marcas.component.css']
})
export class DialogMarcasComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  marca: Marca;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogMarcasComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.marca = data.marca;

    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');

    // DEPENDE DE LA ACCION, EL DIALOG SE CONFIGURA
    if(this.accion === 'Adicionar'){
      console.log('En dialog, creando nuevo');

      this.form = this.formBuilder.group({
        nombre: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])]
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
