import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from '../demo-material-module';

import { AuthenticationRoutes } from './authentication.routing';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SelectionComponent } from './selection/selection.component';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    DemoMaterialModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressButtonsModule
  ],
  declarations: [
    ErrorComponent,
    ForgotComponent,
    LockscreenComponent,
    LoginComponent,
    RegisterComponent,
    SelectionComponent
  ]
})
export class AuthenticationModule {}
