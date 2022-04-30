import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {TipoVehiculo} from '../../../models/TipoVehiculo';
import {Marca} from '../../../models/Marca';
import {MarcasService} from '../../../services/marcas/marcas.service';

@Component({
  selector: 'app-admin-dialog-busqueda-marcas',
  templateUrl: './dialog-busqueda-marcas.component.html',
  styleUrls: ['./dialog-busqueda-marcas.component.css']
})
export class DialogBusquedaMarcasComponent implements OnInit {

  form: FormGroup;
  title: string;
  accion: string;

  marcaSeleccionado: Marca;
  marcasJSON: Marca[] = [];
  filteredOptions: Observable<Marca[]>;
  seleccionoMarca: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _marcasService: MarcasService,
    private dialogRef: MatDialogRef<DialogBusquedaMarcasComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.accion = data.accion;
    console.log(data);
  }

  ngOnInit() {
    console.log('Inicio el dialog');
    this.seleccionoMarca = false;
    this.getDisponibles();

    this.form = this.formBuilder.group({
      marca: [null, Validators.compose([Validators.required])]
    })

    this.filteredOptions = this.form.controls['marca'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  private _filter(value: string): Marca[] {
    const filterValue = value.toLowerCase();
    return this.marcasJSON.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  getDisponibles() {
    console.log('En metodo buscando');
    this._marcasService.cargarDisponibles()
      .subscribe(
        response => {
          console.log(response);
          this.marcasJSON = response;
        },
        error =>  {
          console.log(<any>error);
        }
      );
  }


  cambioMarca(marca: Marca){
    console.log(marca);
    this.marcaSeleccionado = marca;
    this.seleccionoMarca = true;
  }


  save() {
    console.log('Save');
    this.dialogRef.close(this.marcaSeleccionado);
  }

  close() {
    console.log('Close');
    this.dialogRef.close(0);
  }
}
