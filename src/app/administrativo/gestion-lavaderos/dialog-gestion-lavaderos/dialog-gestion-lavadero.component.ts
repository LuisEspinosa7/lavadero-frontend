import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Lavadero} from '../../../models/lavadero';


@Component({
  selector: 'app-admin-dialog-gestion-lavadero',
  templateUrl: './dialog-gestion-lavadero.component.html',
  styleUrls: ['./dialog-gestion-lavadero.component.css']
})
export class DialogGestionLavaderoComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  lavadero: Lavadero;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogGestionLavaderoComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.lavadero = data.lavadero;

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
