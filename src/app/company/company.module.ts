import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { FootrComponent } from './footr/footr.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SubcontractorListComponent } from './subcontractor/subcontractor-list/subcontractor-list.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ScheduleComponent } from './schedule/schedule.component';


@NgModule({
  declarations: [
    FootrComponent,
    HomeComponent,
    NavbarComponent,
    SubcontractorListComponent,
    ClientListComponent,
    ProjectListComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule { }
