import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FilterPipe } from './pipes/filter.pipe';
import { UsuariosPipe } from './pipes/usuarios.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgFallimgModule } from 'ng-fallimg';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegistroComponent } from './registro/registro.component';
import { RegistrouserComponent } from './registrouser/registrouser.component';
import { Interceptor } from './interface/interceptor';



@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    UsuariosPipe,
    LoginComponent,
    RegistroComponent,
    RegistrouserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgFallimgModule.forRoot({
      default:'/assets/picture1.png',
      profile: '/assets/default-profile-image.png',
      post: '/assets/default-post-image.png'
    })


  ],
  providers: [
    Interceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
       
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
