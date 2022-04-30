import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {ReportesService} from '../../services/reportes/reportes.service';
import {ReporteAdmin4} from '../../models/reportes/ReporteAdmin4';
import {ItemReporteAdmin4} from '../../models/reportes/ItemReporteAdmin4';

import * as moment from 'moment';
import {ReporteAdmin2} from '../../models/reportes/ReporteAdmin2';
import {ItemReporteAdmin2} from '../../models/reportes/ItemReporteAdmin2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit, AfterViewInit {

  // Contador
  numeroEmpresasVinculadas: number;


  /**
   * Reporte Numero 2
   */
  reporte2Informacion: ReporteAdmin2;
  reporte2Items: ItemReporteAdmin2[] = [];
  displayedColumns2 = ['index', 'empresa', 'facturado', 'comision'];
  dataSource2 = new MatTableDataSource<ItemReporteAdmin2>();
  fechaInicioReporte2 = null;
  fechaFinReporte2 = null;
  reporte2FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator2: MatPaginator;


  /**
   * Reporte Numero 4
   */
  reporte4Informacion: ReporteAdmin4;
  reporte4Items: ItemReporteAdmin4[] = [];
  displayedColumns = ['index', 'empresa', 'nServicios'];
  dataSource = new MatTableDataSource<ItemReporteAdmin4>();
  fechaInicioReporte4 = null;
  fechaFinReporte4 = null;
  reporte4FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator4: MatPaginator;


  //Control botones mientras descarga algo
  descargando: boolean;


  constructor(private http: HttpClient,
              private _reportesService: ReportesService,
              private formBuilder: FormBuilder) {}




  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.descargando = false;
    this.iniciarFormulariosReportes();
    this.cargarEmpresasVinculadas();
    this.cargarReporte4Informacion(1);
    this.cargarReporte2Informacion(1);
  }

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator2;
    this.dataSource.paginator = this.paginator4;
  }

  iniciarFormulariosReportes(){
    console.log('Iniciando Formularios para reportes');

    this.reporte2FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })

    this.reporte4FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })


  }


  /**
   * Numero de empresas vinculadas
   */
  cargarEmpresasVinculadas() {
    console.log('Cargando empresas vinculadas');

    this._reportesService.cargarEmpresasVinculadas()
      .subscribe(
        response => {
          console.log(response);

          this.numeroEmpresasVinculadas = response.data;
          console.log(this.numeroEmpresasVinculadas);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  /**
   * Reporte 2 : La facturación de cada lavadero  y La Facturación de las comisiones. y un Gran Total
   */

  cargarReporte2Informacion(modo: number) {
    console.log('Cargando reporte 2 informacion');

    this.limpiarInformacionReporte2();

    let fechaInicio = null;
    let fechaFin = null;

    if(modo == 1){
      console.log('Modo 1');

      let a = moment();
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte2 = fechaInicio;

      let d = moment();
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte2 = fechaFin;

    }

    if(modo == 2){
      console.log('Modo 2');

      let fechaInicioTemp = this.reporte2FormGroup.controls['fechaInicio'].value;
      let fechaFinTemp = this.reporte2FormGroup.controls['fechaFin'].value;

      console.log(fechaInicioTemp);
      console.log(fechaFinTemp);

      let a = moment(fechaInicioTemp, "MM-DD-YYYY");
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte2 = fechaInicio;

      let d = moment(fechaFinTemp, "MM-DD-YYYY");
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte2 = fechaFin;
    }

    this._reportesService.getReporte2Informacion(fechaInicio.toString(), fechaFin.toString())
      .subscribe(
        response => {
          console.log(response);

          this.reporte2Informacion = response.data;
          this.reporte2Items = this.reporte2Informacion.items;
          this.dataSource2.data = this.reporte2Items;
          console.log(this.reporte2Informacion);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  exportarAExcelReporte2() {
    console.log('Exportando reporte 2 a excel');
    this.descargando = true;

    this._reportesService.generarReporte2(this.fechaInicioReporte2.toString(), this.fechaFinReporte2.toString())
      .subscribe(
        response => {
          console.log(response);

          let file = new Blob([response], { type: "application/vnd.ms-excel" });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');

          this.descargando = false;

        },
        error =>  {
          console.log(<any>error);
          this.descargando = false;
        }
      );


  }



  limpiarInformacionReporte2(){
    console.log('Limpiando informacion reporte 2');
    this.reporte2Informacion = null;
    this.reporte2Items = [];
    this.fechaInicioReporte2 = null;
    this.fechaFinReporte2 = null;
  }






  /**
   * Reporte 4 : Nro de servicios por lavadero al día, y al final un Total
   */
  cargarReporte4Informacion(modo: number) {
    console.log('Cargando reporte 4 informacion');

    this.limpiarInformacionReporte4();

    let fechaInicio = null;
    let fechaFin = null;

    if(modo == 1){
      console.log('Modo 1');

      let a = moment();
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte4 = fechaInicio;

      let d = moment();
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte4 = fechaFin;

    }

    if(modo == 2){
      console.log('Modo 2');

      let fechaInicioTemp = this.reporte4FormGroup.controls['fechaInicio'].value;
      let fechaFinTemp = this.reporte4FormGroup.controls['fechaFin'].value;

      console.log(fechaInicioTemp);
      console.log(fechaFinTemp);

      let a = moment(fechaInicioTemp, "MM-DD-YYYY");
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte4 = fechaInicio;

      let d = moment(fechaFinTemp, "MM-DD-YYYY");
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte4 = fechaFin;
    }

    this._reportesService.getReporte4Informacion(fechaInicio.toString(), fechaFin.toString())
      .subscribe(
        response => {
          console.log(response);

          this.reporte4Informacion = response.data;
          this.reporte4Items = this.reporte4Informacion.items;
          this.dataSource.data = this.reporte4Items;
          console.log(this.reporte4Informacion);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  exportarAExcelReporte4() {
    console.log('Exportando a excel');
    this.descargando = true;

    this._reportesService.generarReporte4(this.fechaInicioReporte4.toString(), this.fechaFinReporte4.toString())
      .subscribe(
        response => {
          console.log(response);

          let file = new Blob([response], { type: "application/vnd.ms-excel" });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');

          this.descargando = false;


        },
        error =>  {
          console.log(<any>error);
          this.descargando = false;
        }
      );


  }



  limpiarInformacionReporte4(){
    console.log('Limpiando informacion reporte 4');
    this.reporte4Informacion = null;
    this.reporte4Items = [];
    this.fechaInicioReporte4 = null;
    this.fechaFinReporte4 = null;
  }



}
