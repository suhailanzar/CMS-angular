import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthenticateUserGuard } from './guards/authenticate-user.guard'
import { ArticlesComponent } from './pages/articles/articles.component';
import { AddArticleComponent } from './pages/add-article/add-article.component';
import { EditArticleComponent } from './pages/edit-article/edit-article.component';



const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SignupComponent, canActivate: [AuthenticateUserGuard]},
  {path:"articles",component:ArticlesComponent, canActivate: [AuthenticateUserGuard]},
  {path:"add-article",component:AddArticleComponent, canActivate: [AuthenticateUserGuard]},
  {path: "edit-article/:id", component: EditArticleComponent, canActivate: [AuthenticateUserGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
