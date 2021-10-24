import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GesamtuebersichtComponent } from './components/gesamtuebersicht/gesamtuebersicht.component';
import { KlassenZuweisungComponent } from './components/klassen-zuweisung/klassen-zuweisung.component';
import { LehrerListeComponent } from './components/lehrer-liste/lehrer-liste.component';
import { EsrPlanComponent } from './components/esr-plan/esr-plan.component';
import { VertretungComponent } from './components/vertretung/vertretung.component';
import { EinzelplaeneComponent } from './components/einzelplaene/einzelplaene.component';
import { StartAuswahlComponent } from './components/start-auswahl/start-auswahl.component';
import { StartComponent } from './components/start/start.component';
import { PageGesamtplanComponent } from './pages/page-gesamtplan/page-gesamtplan.component';
import { PageKlasseFachComponent } from './pages/page-klasse-fach/page-klasse-fach.component';
import { PagelehrerListeComponent } from './pages/pagelehrer-liste/pagelehrer-liste.component';
import { PageESRComponent } from './pages/page-esr/page-esr.component';
import { PageVertretungComponent } from './pages/page-vertretung/page-vertretung.component';
import { PageEinzelplaeneComponent } from './pages/page-einzelplaene/page-einzelplaene.component';
import { KlassenFaecherService } from './services/klassen-faecher.service';
import { GesamtplaeneAnsichtComponent } from './components/gesamtplaene-ansicht/gesamtplaene-ansicht.component';
import { ERSGesamtAnsichtComponent } from './components/ers-gesamt-ansicht/ers-gesamt-ansicht.component';

const routes: Routes =[
  {path: 'startAuswahl', component: StartAuswahlComponent},
{path: 'gesamtplan-Planer', component: PageGesamtplanComponent},
{path: 'klasseFach-Planer', component: PageKlasseFachComponent},
{path: 'lehrerListe-Planer', component: PagelehrerListeComponent},
{path: 'ESR-Planer', component: PageESRComponent},
{path: "vertretung-Planer", component:PageVertretungComponent},
{path: "einzelPlaene-Planer", component: PageEinzelplaeneComponent,
  children: [
    {
      path: 'start', component: StartComponent
    },
    {
      path: 'einzelPlaene', component: EinzelplaeneComponent
    },
    {
      path: 'vertretung', component: VertretungComponent
    },
    
    {
      path: 'gesamtplaene-ansicht', component: GesamtplaeneAnsichtComponent
    },
    {
      path: 'ESR-gesamtAnsicht-Component', component: ERSGesamtAnsichtComponent
    },

    

  ]},
{path: 'start', component: StartComponent},
{path: 'gesamtplan', component: GesamtuebersichtComponent},
{path: 'klasseFach', component: KlassenFaecherService},
{path: 'lehrerListe', component: LehrerListeComponent},
{path: 'ESR', component: EsrPlanComponent},
{path: "vertretung", component:VertretungComponent},
{path: "einzelPlaene", component: EinzelplaeneComponent},
//{path: "gesamtplaene-ansicht", component: GesamtplaeneAnsichtComponent},
{path: '', redirectTo: "startAuswahl", pathMatch:'full'},
{path: '**', redirectTo: "startAuswahl", pathMatch:'full'},

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
