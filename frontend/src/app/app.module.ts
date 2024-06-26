import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CacheService } from './cache-service.service';
// import { CacheViewComponent } from './cache-view.component';

@NgModule({
  declarations: [
    AppComponent,
    // CacheViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CacheService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
