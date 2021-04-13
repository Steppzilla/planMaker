import { Component, OnInit } from '@angular/core';
import { Lehrjahr } from 'src/app/enums/lehrjahr.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';

@Component({
  selector: 'app-schiene',
  templateUrl: './schiene.component.html',
  styleUrls: ['./schiene.component.scss']
})
export class SchieneComponent implements OnInit {
  datumObj;
freieTagederWoche;


vorigesElement;

klassen = Object.values(Lehrjahr);
grundPlanfaecher:Array<Elementt>;
 // klassenplanServ: any;


 
schiene9;
schiene10;
schiene11;
schiene12;


erstesElementSuchen(monatNummer:number){
 

 
  this.vorigesElement=monatNummer;
}

tabellensortierung(kl) {
  let lehrerVonKlasse:Array<Elementt> = [];
  let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();

  //this.klassen.forEach((klas, f) => {
    newArray.forEach(element=>{
      if ((element!=null)&&(element.klasse == kl)&&(element.schiene>0)) {
        lehrerVonKlasse.push(element);
      }
     });
    
  return lehrerVonKlasse;
}


cellKlick(e,b,klasse){
  if (e.shiftKey) { 
    let neuArray=this.epochenServ["schiene" + klasse].getValue();
    neuArray[b].unterricht=[];
    this.epochenServ["schiene" + klasse].next(neuArray);
  }
}


togglezellenClick(e, b, clickedElementt: Elementt) { //wochentag/ganze Zelle/stunden zeile als Zahl, KLasse ist in Zelle.klasse
  let neuArray=this.epochenServ["schiene" + clickedElementt.klasse].getValue();
  console.log(neuArray[b]);
   neuArray[b].unterricht.push(clickedElementt);
   this.epochenServ["schiene" + clickedElementt.klasse].next(neuArray);
 }
 



  constructor(public ferienTerminService:FerientermineService,  public klassenplanServ: KlassenplaeneService, public epochenServ: EpochenPlaeneService) { 
  this.datumObj=ferienTerminService.daysBetween();
  //console.log(this.datumObj);
  //this.freieTagederWoche=this.ferienTerminService.freieTageArray;
  this.klassenplanServ.grundPlanfaecher$.subscribe((data)=>this.grundPlanfaecher=data);


  
  this.epochenServ.schiene9$.subscribe(data=>{
    this.schiene9=data;
 // console.log(data);
});
  this.epochenServ.schiene10$.subscribe(data=>{
      this.schiene10=data;
   //   console.log(data);
  });
  this.epochenServ.schiene11$.subscribe(data=>this.schiene11=data);
  this.epochenServ.schiene12$.subscribe(data=>this.schiene12=data);
  }

  ngOnInit(): void {
  }

}
