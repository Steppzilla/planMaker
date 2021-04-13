import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {RhythmusComponent} from './components/rhythmus/rhythmus.component';
import { GesamtuebersichtComponent } from './components/gesamtuebersicht/gesamtuebersicht.component';
import { EpocheComponent } from './components/epoche/epoche.component';
import { SchieneComponent } from './components/schiene/schiene.component';
import { KlassenZuweisungComponent } from './components/klassen-zuweisung/klassen-zuweisung.component';
import { LehrerListeComponent } from './components/lehrer-liste/lehrer-liste.component';

const routes: Routes =[
  {path: '', redirectTo: "gesamtplan", pathMatch:'full'},
{path: 'gesamtplan', component: GesamtuebersichtComponent},
{path: 'epoche', component: EpocheComponent},
{path: 'schiene', component: SchieneComponent},
{path: 'rhythmus', component: RhythmusComponent},
{path: 'klasseFach', component: KlassenZuweisungComponent},
{path: 'lehrerListe', component: LehrerListeComponent},
{path: '**', redirectTo: '',pathMatch: 'full'},

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
