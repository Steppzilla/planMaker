import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import { LehrerService } from 'src/app/services/lehrer.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

speicherPlatzNr;
lehrerListe;

wahl(zahl){
  this.speicherPlatzNr=zahl;
}


toggleColor(){
  
}

  redirect(x:string){
    this.router.navigate([x]);
  }

  save() {
    this.login.saveAll(this.speicherPlatzNr)
    console.log("save?");
  }

  load() {
    this.login.gesamtPlanLaden(this.speicherPlatzNr); //login.stundenplandaten wird neu belegt mit Daten, also observed durch this.stundenRaster ändert sich das dann auch
     }

     lehrerwahl(lehrerNR) { //Blaumarkierung der gewählten lehrer
      //  this.selectLehrer = this.lehrerService.lehrer[lehrerNR]; //locale Variable
        this.lehrer.lehrerSelected.next(this.lehrer.lehrer[lehrerNR]);
      }

      
  constructor(public lehrer: LehrerService, public login: LoginService, public router:Router,public termine:FerientermineService) {
    this.login.login();
    this.login.gesamtPlanLaden(5);
    this.speicherPlatzNr=5;
    this.lehrerListe=lehrer.lehrer.sort((a,b)=> a.kuerzel.localeCompare(b.kuerzel));
    console.log(this.lehrerListe);
   }

  ngOnInit(): void {
  }

}
