import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { Rol } from '../../../models/rol';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GLOBAL } from '../../../models/global';
import {TipoLiquidacion} from '../../../models/TipoLiquidacion';


@Component({
  selector: 'app-admin-dialog-tipo-liquidacion',
  templateUrl: './dialog-tipo-liquidacion.component.html',
  styleUrls: ['./dialog-tipo-liquidacion.component.css']
})
export class DialogTipoLiquidacionComponent implements OnInit {

  //OCULTAR CONTRASEÑA
  hide = true;

  form: FormGroup;
  title:string;
  accion: string;
  tipoLiquidacion: TipoLiquidacion;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogTipoLiquidacionComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    this.tipoLiquidacion = data.tipoLiquidacion;

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
