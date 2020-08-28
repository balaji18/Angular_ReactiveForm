import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy } from '@angular/router';
import { HomeComponent } from './home.component';
import { PagenotfoundComponent } from './pagenotfound.component';
import { CustompreloadingService } from './custompreloading.service';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'employees', data: {preload: false}, loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
  {path: '**', component: PagenotfoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes
  // {PreloadingStrategy: CustompreloadingService}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
