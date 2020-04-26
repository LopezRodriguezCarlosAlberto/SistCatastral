import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NguiMapModule} from '@ngui/map';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
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
import { MapService } from './map/map.service';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
@NgModule({
  declarations: [
    AppComponent,SidenavComponent,MapComponent, DialogComponent
  ],exports:[MatSidenavModule],
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
     NguiMapModule.forRoot({apiUrl: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_9BCFea7nrIi2jGyjnC5EP6hx9udoMlU'})
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
