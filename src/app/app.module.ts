import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {AppComponent } from './app.component';
import {GesamtuebersichtComponent } from './components/gesamtuebersicht/gesamtuebersicht.component';
import {AppRoutingModule } from './app-routing.module';
import {KlassenplanComponent } from './components/klassenplan/klassenplan.component';
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {KlassenZuweisungComponent} from './components/klassen-zuweisung/klassen-zuweisung.component';
import {KursZeitfensterComponent } from './components/kurs-zeitfenster/kurs-zeitfenster.component'
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { ErstesElementPipe } from './pipe/erstes-element.pipe';
import { StartComponent } from './components/start/start.component';
import { LehrerListeComponent } from './components/lehrer-liste/lehrer-liste.component';
import { EsrPlanComponent } from './components/esr-plan/esr-plan.component';
import { VertretungComponent } from './components/vertretung/vertretung.component';
import { VertretungsplanComponent } from './components/vertretung/vertretungsplan/vertretungsplan.component';
import { HinweiseComponent } from './components/hinweise/hinweise.component';
import { EinzelplaeneComponent } from './components/einzelplaene/einzelplaene.component';
import { FormsModule } from '@angular/forms';
import { UnterstrichEntfernenPipe } from './unterstrich-entfernen.pipe';
import { StartAuswahlComponent } from './components/start-auswahl/start-auswahl.component';
import { PageEinzelplaeneComponent } from './pages/page-einzelplaene/page-einzelplaene.component';
import { PagelehrerListeComponent } from './pages/pagelehrer-liste/pagelehrer-liste.component';
import { PageKlasseFachComponent } from './pages/page-klasse-fach/page-klasse-fach.component';
import { PageGesamtplanComponent } from './pages/page-gesamtplan/page-gesamtplan.component';
import { PageESRComponent } from './pages/page-esr/page-esr.component';
import { PageVertretungComponent } from './pages/page-vertretung/page-vertretung.component';
import { PageRaumplanerComponent } from './pages/page-raumplaner/page-raumplaner.component';

const config = {
  //apiKey: '<your-key>',
  projectId: 'planmaker-a6efa',
  authDomain: 'planmaker-a6efa.firebaseapp.com', //ggf localhost?schule-wohlers.de oder github-web-adresse? ggf in firebase auth einfügen
  messagingSenderId: "672316150835",
  apiKey: "AIzaSyBIsLbwYGsMkj8WOmnqtI2uUV82GHD0T20",
  databaseURL: "planmaker-a6efa.web.app"
};

@NgModule({
  declarations: [
    AppComponent,
    GesamtuebersichtComponent,
    KlassenplanComponent,
    KlassenZuweisungComponent,
    KursZeitfensterComponent,
    ErstesElementPipe,
    StartComponent,
    LehrerListeComponent,
    EsrPlanComponent,
    VertretungComponent,
    VertretungsplanComponent,
    HinweiseComponent,
    EinzelplaeneComponent,
    UnterstrichEntfernenPipe,
    StartAuswahlComponent,
    PageEinzelplaeneComponent,
    PagelehrerListeComponent,
    PageKlasseFachComponent,
    PageGesamtplanComponent,
    PageESRComponent,
    PageVertretungComponent,
    PageRaumplanerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule, //auth
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }