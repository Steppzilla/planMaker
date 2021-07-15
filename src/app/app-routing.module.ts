import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GesamtuebersichtComponent } from './components/gesamtuebersicht/gesamtuebersicht.component';
import { KlassenZuweisungComponent } from './components/klassen-zuweisung/klassen-zuweisung.component';
import { LehrerListeComponent } from './components/lehrer-liste/lehrer-liste.component';
import { EsrPlanComponent } from './components/esr-plan/esr-plan.component';
import { VertretungComponent } from './components/vertretung/vertretung.component';
import { EinzelplaeneComponent } from './components/einzelplaene/einzelplaene.component';

const routes: Routes =[

{path: 'gesamtplan', component: GesamtuebersichtComponent},
{path: 'klasseFach', component: KlassenZuweisungComponent},
{path: 'lehrerListe', component: LehrerListeComponent},
{path: 'ESR', component: EsrPlanComponent},
{path: "vertretung", component:VertretungComponent},
{path: "einzelplaene", component: EinzelplaeneComponent},
{path: '', redirectTo: "gesamtplan", pathMatch:'full'},
{path: '**', redirectTo: "start", pathMatch:'full'},

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
