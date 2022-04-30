import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {TipoServicio} from '../../../models/TipoServicio';


@Component({
  selector: 'app-admin-dialog-tipo-servicio',
  templateUrl: './dialog-tipo-servicio.component.html',
  styleUrls: ['./dialog-tipo-servicio.component.css']
})
export class DialogTipoServicioComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;
  tipoServicio: TipoServicio;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogTipoServicioComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.tipoServicio = data.tipoServicio;

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
