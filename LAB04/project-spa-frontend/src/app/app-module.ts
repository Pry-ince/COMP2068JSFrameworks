import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { Project } from './project/project';
//import http module client to make http requestis
import { HttpClientModule } from '@angular/common/http';

//imporot project service so we can inject it into the argument
import { ProjectService } from './services/project.service';

@NgModule({
  declarations: [App, Project],
  imports: [
    //list of modules required by app
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    //list of services required by app
    ProjectService,
  ],
  bootstrap: [Project],
})
export class AppModule {}
