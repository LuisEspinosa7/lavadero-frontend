import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { UserService } from '../../../services/user/user.service';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../models/global';
import { ImageService } from '../../../services/images/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  public usuario: Usuario;
  public perfil: string;
  public urlBackend: string;
  public userImageToShow: any;
  public isImageLoading: boolean;
  public defaultImageActive: boolean;
  public imageLoadedComplete: boolean;

  private _mobileQueryListener: () => void;
  status: boolean = false;

  clickEvent() {
    this.status = !this.status;
  }

  subclickEvent() {
    this.status = true;
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private userService: UserService,
    private router: Router,
    private _auth: AuthService,
    private _imageService: ImageService,
    private _domSanitizer: DomSanitizer
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  roleMatch(rolesPermitidos){
      return this.userService.roleMatch(rolesPermitidos);
  }


  ngOnInit() {
    console.log('En el inicio App Side Bar');
    console.log('Obteniendo usuario del ALMACENANIENTO');
    this.defaultImageActive = false;
    this.imageLoadedComplete = false;
    this.usuario = this.userService.getUser();
    this.perfil = this.userService.obtenerPerfil();
    this.urlBackend = GLOBAL.urlBackend;
    this.loadUserImageFromService();
    console.log(this.usuario);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logOut() {
     console.log('Saliendo de la app');
     this._auth.logout();
     this.router.navigate(['authentication/login']);
  }

  goProfile(){
    console.log('A perfil');
    this.router.navigate(['perfil/update-profile']);
  }


  loadUserImageFromService() {
    this.isImageLoading = true;
    this._imageService.getImage(this.usuario.imagen, 'usuario').subscribe(data => {
      console.log('Data: ');
      console.log(data);
      this.createImageFromBlob(data);
      this.isImageLoading = false;
      this.imageLoadedComplete = true;
    }, error => {
      this.isImageLoading = false;
      this.defaultImageActive = true;
      console.log(error);
    });
  }


  createImageFromBlob(image: Blob) {
    let urlCreator = window.URL;
    this.userImageToShow = this._domSanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(image));
  }

}
