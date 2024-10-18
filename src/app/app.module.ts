import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { JwtInterceptor } from '../app/interceptor/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ExcludeCurrentUserPipe } from './pipes/exclude-current-user.pipe';
import { ArticlesComponent } from './pages/articles/articles.component';
import { AddArticleComponent } from './pages/add-article/add-article.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditArticleComponent } from './pages/edit-article/edit-article.component'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ExcludeCurrentUserPipe,
    ArticlesComponent,
    AddArticleComponent,
    EditArticleComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule ,
    ToastModule,
    ButtonModule,
    RippleModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    DialogModule
    
  ],
  providers: [MessageService,ConfirmationService,  {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
