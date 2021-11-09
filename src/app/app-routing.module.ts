import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GesamtuebersichtComponent } from './components/gesamtuebersicht/gesamtuebersicht.component';
import { KlassenZuweisungComponent } from './components/klassen-zuweisung/klassen-zuweisung.component';
import { LehrerListeComponent } from './components/lehrer-liste/lehrer-liste.component';
import { EsrPlanComponent } from './components/esr-plan/esr-plan.component';
import { VertretungComponent } from './components/vertretung/vertretung.component';
import { EinzelplaeneComponent } from './components/einzelplaene/einzelplaene.component';
import { StartComponent } from './components/start/start.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes =[

  {path: 'start', component: StartComponent,
children:[
  {path: 'gesamtplan', component: GesamtuebersichtComponent},
  {path: 'klasseFach', component: KlassenZuweisungComponent},
  {path: 'lehrerListe', component: LehrerListeComponent},
  {path: 'ESR', component: EsrPlanComponent},
  {path: "vertretung", component:VertretungComponent},
  {path: "einzelPlaene", component: EinzelplaeneComponent},
  {path: "home", component: HomeComponent},
]},
{path: 'gesamtplan', component: GesamtuebersichtComponent},

  
  //{path: "gesamtplaene-ansicht", component: GesamtplaeneAnsichtComponent},
  {path: '', redirectTo: "start/home", pathMatch:'full'},
  {path: '**', redirectTo: "start/home", pathMatch:'full'},




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
