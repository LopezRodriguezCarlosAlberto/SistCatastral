import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NguiMapModule} from '@ngui/map';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle' ;
import {MatIconModule} from '@angular/material/icon' ;
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs'; 
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsComponent } from './google-maps/components/boxsearch/google-maps.component';
import MarkerFactory from './ol/factories/marker.factory';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,SidenavComponent, MapComponent, DialogComponent, GoogleMapsComponent,
  ], exports:[MatSidenavModule],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatInputModule,
     NguiMapModule.forRoot({apiUrl: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_9BCFea7nrIi2jGyjnC5EP6hx9udoMlU'}),
     AgmCoreModule.forRoot({apiKey: 'AIzaSyChg0ncJgZdqvTgkWiLTpaoT4WDx6w2b_Q',libraries: ['places']})
  ],
  providers: [MarkerFactory,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
