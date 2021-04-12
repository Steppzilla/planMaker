import { Component, OnInit } from '@angular/core';
import { Lehrjahr } from 'src/app/enums/lehrjahr.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';

@Component({
  selector: 'app-rhythmus',
  templateUrl: './rhythmus.component.html',
  styleUrls: ['./rhythmus.component.scss']
})
export class RhythmusComponent implements OnInit {
  datumObj;
freieTagederWoche;


vorigesElement;

klassen = Object.values(Lehrjahr);
grundPlanfaecher:Array<Elementt>;




rhythmus9;
rhythmus10;
rhythmus11;
rhythmus12;
erstesElementSuchen(monatNummer:number){
 

 
  this.vorigesElement=monatNummer;
}

tabellensortierung(kl) {
  let lehrerVonKlasse:Array<Elementt> = [];
  let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();

  //this.klassen.forEach((klas, f) => {
    newArray.forEach(element=>{
      if ((element!=null)&&(element.klasse == kl)&&(element.rhythmus>0)) {
        lehrerVonKlasse.push(element);
      }
     });

  return lehrerVonKlasse;
}

cellKlick(e,b,klasse){
  if (e.shiftKey) { 
    let neuArray=this.epochenServ["rhythmus" + klasse].getValue();
    neuArray[b].unterricht=[];
    this.epochenServ["rhythmus" + klasse].next(neuArray);
  }
}

togglezellenClick(e, b, clickedElementt: Elementt) { //wochentag/ganze Zelle/stunden zeile als Zahl, KLasse ist in Zelle.klasse
  let neuArray=this.epochenServ["rhythmus" + clickedElementt.klasse].getValue();
   neuArray[b].unterricht.push(clickedElementt); 
   this.epochenServ["rhythmus" + clickedElementt.klasse].next(neuArray);
  // console.log(neuArray[b]);
   //console.log(this.rhythmus9[b]);
 }




  constructor(public ferienTerminService:FerientermineService, public klassenplanServ: KlassenplaeneService, public epochenServ: EpochenPlaeneService) { 
  this.datumObj=ferienTerminService.daysBetween();
 // console.log(this.datumObj);
  //this.freieTagederWoche=this.ferienTerminService.freieTageArray;
  this.klassenplanServ.grundPlanfaecher$.subscribe((data)=>this.grundPlanfaecher=data);

  

  this.epochenServ.rhythmus9$.subscribe((data)=>{this.rhythmus9=data;  });
  this.epochenServ.rhythmus10$.subscribe((data)=>{this.rhythmus10=data});
  this.epochenServ.rhythmus11$.subscribe((data)=>this.rhythmus11=data);
  this.epochenServ.rhythmus12$.subscribe((data)=>this.rhythmus12=data);

  }
  ngOnInit(): void {
  }

}
