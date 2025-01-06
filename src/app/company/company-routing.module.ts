import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SubcontractorListComponent } from './subcontractor/subcontractor-list/subcontractor-list.component';
import { SubcontractorFormComponent } from './subcontractor/subcontractor-form/subcontractor-form.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', component: ScheduleComponent }, 
      { path: 'sous-traitant', component: SubcontractorListComponent },
      { path: 'sous-traitant/create', component: SubcontractorFormComponent },
      { path: 'sous-traitant/edit/:id', component: SubcontractorFormComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'projets', component: ProjectListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
