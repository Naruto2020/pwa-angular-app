import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { SharedModule } from './shared/shared.module';
//import { DefaultComponent } from './layout/default/default.component';
import { DefaultModule } from './layout/default/default.module';

@NgModule({
  declarations: [
    AppComponent,
    //DefaultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    DefaultModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
