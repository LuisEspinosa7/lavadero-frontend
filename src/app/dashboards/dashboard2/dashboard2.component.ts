import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {ReportesService} from '../../services/reportes/reportes.service';
import * as moment from 'moment';
import {ReportePropietario1} from '../../models/reportes/ReportePropietario1';
import {ItemReportePropietario1} from '../../models/reportes/ItemReportePropietario1';
import {Usuario} from '../../models/usuario';
import {Lavadero} from '../../models/lavadero';
import {LavaderoService} from '../../services/lavadero/lavadero.service';
import {UserService} from '../../services/user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportePropietario2} from '../../models/reportes/ReportePropietario2';
import {ItemReportePropietario2} from '../../models/reportes/ItemReportePropietario2';
import {ReportePropietario3} from '../../models/reportes/ReportePropietario3';
import {ItemReportePropietario3} from '../../models/reportes/ItemReportePropietario3';
import {ReportePropietario4} from '../../models/reportes/ReportePropietario4';
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit, AfterViewInit {


  /**
   * Reporte Numero 1
   */
  reporte1Informacion: ReportePropietario1;
  reporte1Items: ItemReportePropietario1[] = [];
  displayedColumns1 = ['index', 'identificacion', 'nombre', 'apellido', 'nServicios'];
  dataSource1 = new MatTableDataSource<ItemReportePropietario1>();
  fechaInicioReporte1 = null;
  fechaFinReporte1 = null;
  reporte1FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator1: MatPaginator;

  /**
   * Reporte Numero 2
   */
  reporte2Informacion: ReportePropietario2;
  reporte2Items: ItemReportePropietario2[] = [];
  displayedColumns2 = ['index', 'identificacion', 'nombre', 'apellido', 'nServicios'];
  dataSource2 = new MatTableDataSource<ItemReportePropietario2>();
  fechaInicioReporte2 = null;
  fechaFinReporte2 = null;
  reporte2FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  /**
   * Reporte Numero 3
   */
  reporte3Informacion: ReportePropietario3;
  reporte3Items: ItemReportePropietario3[] = [];
  displayedColumns3 = ['index', 'servicio', 'nServicios'];
  dataSource3 = new MatTableDataSource<ItemReportePropietario3>();
  fechaInicioReporte3 = null;
  fechaFinReporte3 = null;
  reporte3FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator3: MatPaginator;


  /**
   * Reporte Numero 4
   */
  reporte4Informacion: ReportePropietario4;
  reporte4Items: LiquidacionFuncionario[] = [];
  displayedColumns4 = ['index', 'nombre', 'apellido', 'identificacion', 'fecha', 'inicio', 'fin', 'pago'];
  dataSource4 = new MatTableDataSource<LiquidacionFuncionario>();
  fechaInicioReporte4 = null;
  fechaFinReporte4 = null;
  reporte4FormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator4: MatPaginator;



  dataUser: Usuario;
  lavaderosUsuario: Lavadero[] = [];
  lavaderoUsuario: Lavadero;


  //Control botones mientras descarga algo
  descargando: boolean;


  constructor(private http: HttpClient,
              private _reportesService: ReportesService,
              private _lavaderoService: LavaderoService,
              private userService: UserService,
              private formBuilder: FormBuilder) {}


  ngOnInit(): void {
    console.log('Inicializo el Componente');
    this.descargando = false;
    this.iniciarFormulariosReportes();
    this.cargarUsuario();
    this.cargarLavadero();
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource3.paginator = this.paginator3;
    this.dataSource4.paginator = this.paginator4;
  }


  iniciarFormulariosReportes(){
    console.log('Iniciando Formularios para reportes');

    this.reporte1FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })

    this.reporte2FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })

    this.reporte3FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })

    this.reporte4FormGroup = this.formBuilder.group({
      fechaInicio: [new Date(), Validators.compose([Validators.required])],
      fechaFin: [new Date(), Validators.compose([Validators.required])]
    })

  }


  cargarUsuario(){
    console.log('Cargando el usuario');
    this.dataUser = JSON.parse(localStorage.getItem('user'));
  }

  cargarLavadero() {
    console.log('Cargando el lavadero');

    this._lavaderoService.cargarLavaderosUsuario(this.dataUser.codigo)
      .subscribe(
        response => {
          console.log(response);

          this.lavaderosUsuario = response;
          console.log(this.lavaderosUsuario);
          this.lavaderoUsuario = this.lavaderosUsuario[0];

          this.cargarReporte1Informacion(1);
          this.cargarReporte2Informacion(1);
          this.cargarReporte3Informacion(1);
          this.cargarReporte4Informacion(1);

        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  /**
   * Reporte 1
   */

  cargarReporte1Informacion(modo: number) {
    console.log('Cargando reporte 1 informacion');

    this.limpiarInformacionReporte1();

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

      this.fechaInicioReporte1 = fechaInicio;

      let d = moment();
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte1 = fechaFin;

    }

    if(modo == 2){
      console.log('Modo 2');

      let fechaInicioTemp = this.reporte1FormGroup.controls['fechaInicio'].value;
      let fechaFinTemp = this.reporte1FormGroup.controls['fechaFin'].value;

      console.log(fechaInicioTemp);
      console.log(fechaFinTemp);

      let a = moment(fechaInicioTemp, "MM-DD-YYYY");
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte1 = fechaInicio;

      let d = moment(fechaFinTemp, "MM-DD-YYYY");
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte1 = fechaFin;
    }



    this._reportesService.getReportePropietario1Informacion(fechaInicio.toString(), fechaFin.toString(), this.lavaderoUsuario.codigo.toString())
      .subscribe(
        response => {
          console.log(response);

          this.reporte1Informacion = response.data;
          this.reporte1Items = this.reporte1Informacion.items;
          this.dataSource1.data = this.reporte1Items;
          console.log(this.reporte1Informacion);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  exportarAExcelReporte1() {
    console.log('Exportando reporte 1 a excel');
    this.descargando = true;


    this._reportesService.generarReportePropietario1(this.fechaInicioReporte1.toString(), this.fechaFinReporte1.toString(), this.lavaderoUsuario.codigo.toString())
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


  limpiarInformacionReporte1(){
    console.log('Limpiando informacion reporte 2');
    this.reporte1Informacion = null;
    this.reporte1Items = [];
    this.fechaInicioReporte1 = null;
    this.fechaFinReporte1 = null;
  }





  /**
   * Reporte 2
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



    this._reportesService.getReportePropietario2Informacion(fechaInicio.toString(), fechaFin.toString(), this.lavaderoUsuario.codigo.toString())
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


    this._reportesService.generarReportePropietario2(this.fechaInicioReporte2.toString(), this.fechaFinReporte2.toString(), this.lavaderoUsuario.codigo.toString())
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
   * Reporte 3
   */

  cargarReporte3Informacion(modo: number) {
    console.log('Cargando reporte 3 informacion');

    this.limpiarInformacionReporte3();

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

      this.fechaInicioReporte3 = fechaInicio;

      let d = moment();
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte3 = fechaFin;

    }

    if(modo == 2){
      console.log('Modo 2');

      let fechaInicioTemp = this.reporte3FormGroup.controls['fechaInicio'].value;
      let fechaFinTemp = this.reporte3FormGroup.controls['fechaFin'].value;

      console.log(fechaInicioTemp);
      console.log(fechaFinTemp);

      let a = moment(fechaInicioTemp, "MM-DD-YYYY");
      console.log(a);
      let b = a.set('h', 0);
      let c = b.set('m', 0);
      console.log(c);
      console.log(c.format('YYYY-MM-DD hh:mm:ss a'));
      fechaInicio = c.format('YYYY-MM-DD hh:mm:ss');

      this.fechaInicioReporte3 = fechaInicio;

      let d = moment(fechaFinTemp, "MM-DD-YYYY");
      console.log(d);
      let e = d.set('h', 23);
      let f = e.set('m', 59);
      console.log(f);
      console.log(f.format('YYYY-MM-DD hh:mm:ss a'));
      fechaFin = f.format('YYYY-MM-DD hh:mm:ss');

      this.fechaFinReporte3 = fechaFin;
    }



    this._reportesService.getReportePropietario3Informacion(fechaInicio.toString(), fechaFin.toString(), this.lavaderoUsuario.codigo.toString())
      .subscribe(
        response => {
          console.log(response);

          this.reporte3Informacion = response.data;
          this.reporte3Items = this.reporte3Informacion.items;
          this.dataSource3.data = this.reporte3Items;
          console.log(this.reporte3Informacion);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  exportarAExcelReporte3() {
    console.log('Exportando reporte 3 a excel');
    this.descargando = true;


    this._reportesService.generarReportePropietario3(this.fechaInicioReporte3.toString(), this.fechaFinReporte3.toString(), this.lavaderoUsuario.codigo.toString())
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


  limpiarInformacionReporte3(){
    console.log('Limpiando informacion reporte 3');
    this.reporte3Informacion = null;
    this.reporte3Items = [];
    this.fechaInicioReporte3 = null;
    this.fechaFinReporte3 = null;
  }






  /**
   * Reporte 4
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



    this._reportesService.getReportePropietario4Informacion(fechaInicio.toString(), fechaFin.toString(), this.lavaderoUsuario.codigo.toString())
      .subscribe(
        response => {
          console.log(response);

          this.reporte4Informacion = response.data;
          this.reporte4Items = this.reporte4Informacion.items;
          this.dataSource4.data = this.reporte4Items;
          console.log(this.reporte4Informacion);
        },
        error =>  {
          console.log(<any>error);
        }
      );

  }


  exportarAExcelReporte4() {
    console.log('Exportando reporte 4 a excel');
    this.descargando = true;


    this._reportesService.generarReportePropietario4(this.fechaInicioReporte4.toString(), this.fechaFinReporte4.toString(), this.lavaderoUsuario.codigo.toString())
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
