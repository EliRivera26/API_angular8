import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RegistrouserComponent } from './registrouser/registrouser.component';


const routes: Routes = [
    {path: 'app', component: AppComponent },
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'registrouser', component: RegistrouserComponent },
    {path: '', redirectTo: '/registrouser', pathMatch: 'full'}
    
]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}