import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../models/global';
import { ImageService } from '../../../services/images/image.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {Usuario} from '../../../models/usuario';
import {UserService} from '../../../services/user/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  public usuario: Usuario;
  public perfil: string;
  public urlBackend: string;
  public userImageToShow: any;
  public isImageLoading: boolean;
  public defaultImageActive: boolean;
  public imageLoadedComplete: boolean;


  public config: PerfectScrollbarConfigInterface = {};


  constructor(
    private router: Router,
    private _auth: AuthService,
    private _imageService: ImageService,
    private _domSanitizer: DomSanitizer,
    private userService: UserService) {}


  ngOnInit() {
    console.log('En el inicio Toolbar');
    this.defaultImageActive = false;
    this.imageLoadedComplete = false;
    this.usuario = this.userService.getUser();
    this.perfil = this.userService.obtenerPerfil();
    this.urlBackend = GLOBAL.urlBackend;
    this.loadUserImageFromService();
    console.log(this.usuario);
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





  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Launch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
}
