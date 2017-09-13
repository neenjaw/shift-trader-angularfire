import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'welcome',
  //   component: DashboardComponent
  // },
  // {
  //   path: 'heroes',
  //   component: HeroesComponent
  // },
  // {
  //   path: 'detail/:id',
  //   component: HeroDetailComponent
  // }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
    ],
  exports: [ RouterModule ],
  declarations: []
})
export class RoutingModule { }
