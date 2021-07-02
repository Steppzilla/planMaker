import {
  Component,
  OnInit
} from '@angular/core';
import {
  endOfDecade
} from 'date-fns';
import {
  concatMap,
  filter,
  map,
  take
} from 'rxjs/operators';
import {
  Fach
} from 'src/app/enums/fach.enum';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
import {
  TagesObjekt
} from 'src/app/interfaces/tages-objekt';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-esr-plan',
  templateUrl: './esr-plan.component.html',
  styleUrls: ['./esr-plan.component.scss']
})
export class EsrPlanComponent implements OnInit {

  iix = Lehrjahr.acht;
  ix = Lehrjahr.neun;
  x = Lehrjahr.zehn;
  xi = Lehrjahr.elf;
  xii = Lehrjahr.zwoelf;

  esrPlan;
  grundPlanfaecher: Array < Elementt > ;

  gewaehlterPlan = "rhythmus";
  gewaehltesElement: Elementt;
  clickCount = 0;

  selectLehrer;

  rechts(){
    if(this.gewaehlterPlan==="rhythmus"){
      this.gewaehlterPlan="epoche"
    }else if(this.gewaehlterPlan==="epoche"){
      this.gewaehlterPlan="schiene";
    }else if(this.gewaehlterPlan==="schiene"){
      this.gewaehlterPlan="rhythmus";
    }
  }
  links(){
    if(this.gewaehlterPlan==="rhythmus"){
      this.gewaehlterPlan="schiene"
    }else if(this.gewaehlterPlan==="schiene"){
      this.gewaehlterPlan="epoche";
    }else if(this.gewaehlterPlan==="epoche"){
      this.gewaehlterPlan="rhythmus";
    }

  }

  rhythmusElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.rhythmus.neun,
        zehn: z.rhythmus.zehn,
        elf: z.rhythmus.elf,
        zwoelf: z.rhythmus.zwoelf
      }
      return obj;
    })
  );

  epochenElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.epoche.neun,
        zehn: z.epoche.zehn,
        elf: z.epoche.elf,
        zwoelf: z.epoche.zwoelf
      }
      return obj;
    })
  );

  schieneElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.schiene.neun,
        zehn: z.schiene.zehn,
        elf: z.schiene.elf,
        zwoelf: z.schiene.zwoelf
      }
      return obj;
    })
  );

  rhythmusPlan$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let fahrtenUndProjekte = this.ferienServ.fahrtenUndProjekteObj;

      // let obj:{}|{fach:Fach,lehrer:Lehrer}|{ueberschrift:string}
      let neu: Array < Array < Array < Array < {
        fach ? : Fach,
        lehrer ? : string,
        spanNr ? : number,
        ueberschrift ? : Date,
        ganztaegig ? : string,
        start ? : Date,
        ende ? : Date,
      } >>> >= [new Array(5), new Array(5), new Array(5), new Array(5)];
      //let ar=this.epochenPlanS.esr_plan;
      let abschnitt1 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.sommerFerienEnde && ele.tag < this.ferienServ.herbstferienStart); //erster Abschnitt
      let abschnitt2 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.herbstferienEnde && ele.tag < this.ferienServ.weihnachtsferienStart); //zweiter
      let abschnitt3 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.weihnachtsferienEnde && ele.tag < this.ferienServ.osterferienStart); //dritter
      let abschnitt4 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.osterferienEnde && ele.tag < this.ferienServ.sommerferienStart); //viere
      [abschnitt1, abschnitt2, abschnitt3, abschnitt4].forEach((abSCHN, aI) => {
        let zaehler = 0; //Für cellen-index
        abSCHN.forEach((tag: TagesObjekt) => {
          if (tag.tag.getDay() == 1) { //auf Montage reduzieren

            //Datumfächer erstellen und befüllen:
            if (neu[aI][0] == undefined) {
              neu[aI][0] = [];
            }
            if (neu[aI][0][zaehler] == undefined) {
              neu[aI][0][zaehler] = [];
            }

            neu[aI][0][zaehler].push({
              ueberschrift: tag.tag
            }); //tag unter 0 reinpushen//UBERSCHRIFT

            ['neun', 'zehn', 'elf', 'zwoelf'].forEach((kla, k) => {
              //IN TAbelle z.b Abschnitt 1, jede Klasse nun durchgehen (im Prinzip pro Zeile also neu)
              let span = 0;
              let fahrten = fahrtenUndProjekte[kla]; //aus dem Lehrerservice die Fahrten der Klasse
              let ersterTag = new Date(); //das ist heute
              let bool = false;
              let zahl = k + 1;
              let fahrt = false;
              let end=new Date();

              //leere felder erstellen
              if (neu[aI][zahl] == undefined) {
                neu[aI][zahl] = [];
              }
              if (neu[aI][zahl][zaehler] == undefined) {
                neu[aI][zahl][zaehler] = [];
              }

              //
              let titel = "";
              //ERst schauen, ob Projekt stattfindet //FAHRTEN ggf reinschreiben




              fahrten.forEach(fahrtObj => {
                if (fahrtObj.start <= tag.tag && fahrtObj.ende >= tag.tag) {
                  fahrt = true;
                  ersterTag.setTime(fahrtObj.start.getTime());
                  titel = fahrtObj.titel;


                  let start = new Date(fahrtObj.start.getTime());
                  let ende = new Date(fahrtObj.ende.getTime());
                  //Span-wochen ermitteln: 

                  //Wenn projekt über zeilt geht:
                  if (start < abSCHN[0].tag) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                    //    console.log(start);
                    start.setTime(abSCHN[0].tag.getTime());

                    //auf Montag ändern:
                    while (start.getDay() !== 1) { //solange nicht mo ist
                      start.setDate(start.getDate() + 1);
                    }
                  }
                  if (ende >= abSCHN[abSCHN.length - 1].tag) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                    ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                    //auf Montag ändern:
                    while (ende.getDay() !== 5) { //solange nicht fr ist
                      ende.setDate(ende.getDate() - 1);
                    }
                  }
                  end.setTime(ende.getTime());
                  span = this.daysBetween(start, ende);
                }
              });

              if (titel.length > 0) {
                neu[aI][zahl][zaehler].push({
                  fach: null, // später: element.fach,
                  lehrer: null, // später element.lehrer[0].kuerzel,
                  spanNr: span, //später span
                  ganztaegig: titel,
                  start: ersterTag, //später ersterTag, //bei neuem Abschnitt ist es erster Tag des abschnitts
                  ende: end,
                });
              }

              //Einzelne epochen-ELemente der KLasse durchgucken, nur wenn bool noch nicht true, also fahrt noch nicht drin:
              if (fahrt === false) {
                z.rhythmus[kla].forEach((element) => {
                  bool = false;
                  span = 0;
                  ersterTag = new Date();

                  element.zuweisung.rhythmus.forEach(epoche => {

                    if (epoche.start <= tag.tag && epoche.ende >= tag.tag) {

                      bool = true; //dann reinschreiben das obj später

                      //span berechnung mit Beachtung wenn Datenüber Zeile hinweg geht:

                      let start = new Date(epoche.start.getTime());
                      let ende = new Date(epoche.ende.getTime());
                      if (start.getTime() < abSCHN[0].tag.getTime()) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                        start.setTime(abSCHN[0].tag.getTime());
                        //auf montag setzen:
                        while (start.getDay() !== 1) { //solange nicht mo ist
                          start.setDate(start.getDate() + 1);
                        }
                      }

                      if (ende.getTime() >= abSCHN[abSCHN.length - 1].tag.getTime()) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                        ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                        //auf Montag ändern:
                        while (ende.getDay() !== 5) { //solange nicht fr ist
                          ende.setDate(ende.getDate() + 1);
                        }
                      }
                      //WEENN FAHRT in Zeile LIEGT!!!!!!

                      let zeilenFahrt=fahrten.filter(element=>element.start>=abSCHN[0].tag&&element.ende<=abSCHN[abSCHN.length-1].tag);
                     // console.log(zeilenFahrt[0]?.titel + element.klasse);
              

                      zeilenFahrt.forEach((fahrtOBj, f) => {
                        //nur fahrt in der zeile beachten:
                        if(abSCHN[0].tag&&fahrtOBj.start&&
                          abSCHN[0].tag.getTime()<=fahrtOBj.start.getTime()&&abSCHN[abSCHN.length-1].tag.getTime()>=fahrtOBj.ende){
                        if (fahrtOBj.start && fahrtOBj.ende && epoche.start && epoche.ende && //Nur wenn EIN projekt mitten in einer epoche liegt
                          //triggert aber auch wenn zwei drin liegen..
                          fahrtOBj.start.getTime() > epoche.start.getTime() &&
                            fahrtOBj.ende.getTime() < epoche.ende.getTime()) {
                          //wenn aktueller tag vorm Start der fahrt liegt: Ende anpassen
                          if (tag.tag.getTime() >= epoche.start.getTime() && tag.tag.getTime() <= fahrtOBj.start.getTime()) {
                            //Start bleibt wie definiert
                            ende.setTime(fahrtOBj.start.getTime()); //Achtung hier nimmt er auch Datum vom anderen Praktikum der Klasse...
                           
                            while (ende.getDay() !== 5) { //solange nicht Freitag ist
                              ende.setDate(ende.getDate() - 1);
                            }
                            //Wenn andere Fahrt-Start dazwischen liegt, das datum als Ende nehmen:
                            if(zeilenFahrt.length==2){
                            //e1 soll voriges Element sein:
                              let el1 =zeilenFahrt[0];
                              let el2=zeilenFahrt[1];

                              if(el1.start>el2.start){
                                el1 =zeilenFahrt[1];
                                el2=zeilenFahrt[0];
                              }

                              if(tag.tag.getTime()<=el1.start.getTime()&&tag.tag.getTime()<=el2.start.getTime()){
                                ende.setTime(el1.start.getTime());
                              }
                            }
                            //wenn aktueller Tag im zweiten Abschnitt liegt nach Ende der Fahrt
                          } else if (tag.tag.getTime() <= epoche.ende.getTime() && tag.tag.getTime() >= fahrtOBj.ende.getTime()) {
                            start.setTime(fahrtOBj.ende.getTime());
                            while (start.getDay() !== 1) { //solange nicht montag ist
                              start.setDate(start.getDate() + 1);
                            }
                            // start=datu; //ggf. einen tag später?
                          }
                        }
                        else { //WEnn projekt nicht mittig liegt von einer epoche
                        }
                      }
                      });
                      end.setTime(ende.getTime());
                      span = this.daysBetween(start, ende);
                      ersterTag.setTime(start.getTime());
                    }
                  });

                  //@ts-ignore
                  if (bool === true && (element.klasse === Lehrjahr[kla]||element.klasse===this.wortInZahl(kla))) {
             
                    neu[aI][zahl][zaehler].push({
                      fach: element.fach,
                      lehrer: element.lehrer[0].kuerzel,
                      spanNr: span,
                      ganztaegig: titel,
                      start: ersterTag,
                      ende: end
                    });
                  }
                });
              }
            });
            zaehler++;
          }
        });
      });
     // console.log(neu);
      return neu;
    })
  );

  daysBetween(startDate, endDate) { //in weeeks geändert mit *7
    var millisecondsPerDay = 24 * 60 * 60 * 1000 * 7;
    return Math.round(((endDate) - (startDate)) / millisecondsPerDay);
  }





  epochenPlan$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let fahrtenUndProjekte = this.ferienServ.fahrtenUndProjekteObj;

      // let obj:{}|{fach:Fach,lehrer:Lehrer}|{ueberschrift:string}
      let neu: Array < Array < Array < Array < {
        fach ? : Fach,
        lehrer ? : string,
        spanNr ? : number,
        ueberschrift ? : Date,
        ganztaegig ? : string,
        start ? : Date,
        ende ? : Date,
      } >>> >= [new Array(5), new Array(5), new Array(5), new Array(5)];
      //let ar=this.epochenPlanS.esr_plan;
      let abschnitt1 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.sommerFerienEnde && ele.tag < this.ferienServ.herbstferienStart); //erster Abschnitt
      let abschnitt2 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.herbstferienEnde && ele.tag < this.ferienServ.weihnachtsferienStart); //zweiter
      let abschnitt3 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.weihnachtsferienEnde && ele.tag < this.ferienServ.osterferienStart); //dritter
      let abschnitt4 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.osterferienEnde && ele.tag < this.ferienServ.sommerferienStart); //viere
      [abschnitt1, abschnitt2, abschnitt3, abschnitt4].forEach((abSCHN, aI) => {
        let zaehler = 0; //Für cellen-index
        abSCHN.forEach((tag: TagesObjekt) => {
          if (tag.tag.getDay() == 1) { //auf Montage reduzieren

            //Datumfächer erstellen und befüllen:
            if (neu[aI][0] == undefined) {
              neu[aI][0] = [];
            }
            if (neu[aI][0][zaehler] == undefined) {
              neu[aI][0][zaehler] = [];
            }
            neu[aI][0][zaehler].push({
              ueberschrift: tag.tag
            }); //tag unter 0 reinpushen//UBERSCHRIFT
            ['neun', 'zehn', 'elf', 'zwoelf'].forEach((kla, k) => {
              //IN TAbelle z.b Abschnitt 1, jede Klasse nun durchgehen (im Prinzip pro Zeile also neu)
              let span = 0;
              let fahrten = fahrtenUndProjekte[kla]; //aus dem Lehrerservice die Fahrten der Klasse
              let ersterTag = new Date(); //das ist heute
              let bool = false;
              let zahl = k + 1;
              let fahrt = false;
              let end=new Date();
              //leere felder erstellen
              if (neu[aI][zahl] == undefined) {
                neu[aI][zahl] = [];
              }
              if (neu[aI][zahl][zaehler] == undefined) {
                neu[aI][zahl][zaehler] = [];
              }
              let titel = "";
              fahrten.forEach(fahrtObj => {
                if (fahrtObj.start <= tag.tag && fahrtObj.ende >= tag.tag) {
                  fahrt = true;
                  ersterTag.setTime(fahrtObj.start.getTime());
                  titel = fahrtObj.titel;
                  let start = new Date(fahrtObj.start.getTime());
                  let ende = new Date(fahrtObj.ende.getTime());
                  //Span-wochen ermitteln: 
                  //Wenn projekt über zeilt geht:
                  if (start < abSCHN[0].tag) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                    //    console.log(start);
                    start.setTime(abSCHN[0].tag.getTime());

                    //auf Montag ändern:
                    while (start.getDay() !== 1) { //solange nicht mo ist
                      start.setDate(start.getDate() + 1);
                    }
                  }
                  if (ende >= abSCHN[abSCHN.length - 1].tag) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                    ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                    //auf Montag ändern:
                    while (ende.getDay() !== 5) { //solange nicht fr ist
                      ende.setDate(ende.getDate() - 1);
                    }
                  }
                  end.setTime(ende.getTime());
                  span = this.daysBetween(start, ende);
                }
              });

              if (titel.length > 0) {
                neu[aI][zahl][zaehler].push({
                  fach: null, // später: element.fach,
                  lehrer: null, // später element.lehrer[0].kuerzel,
                  spanNr: span, //später span
                  ganztaegig: titel,
                  start: ersterTag, //später ersterTag, //bei neuem Abschnitt ist es erster Tag des abschnitts
                  ende: end,
                });
              }

              //Einzelne epochen-ELemente der KLasse durchgucken, nur wenn bool noch nicht true, also fahrt noch nicht drin:
              if (fahrt === false) {
                z.epoche[kla].forEach((element) => {
                  bool = false;
                  span = 0;
                  ersterTag = new Date();

                  element.zuweisung.epoche.forEach(epoche => {

                    if (epoche.start <= tag.tag && epoche.ende >= tag.tag) {

                      bool = true; //dann reinschreiben das obj später

                      //span berechnung mit Beachtung wenn Datenüber Zeile hinweg geht:

                      let start = new Date(epoche.start.getTime());
                      let ende = new Date(epoche.ende.getTime());
                      let test = new Date(2021, 9, 18);

                      if (start.getTime() < abSCHN[0].tag.getTime()) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                        start.setTime(abSCHN[0].tag.getTime());
                        //auf montag setzen:

                        while (start.getDay() !== 1) { //solange nicht mo ist
                          start.setDate(start.getDate() + 1);
                        }
                      }

                      if (ende.getTime() >= abSCHN[abSCHN.length - 1].tag.getTime()) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                        ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                        //auf Montag ändern:
                        while (ende.getDay() !== 5) { //solange nicht fr ist
                          ende.setDate(ende.getDate() + 1);
                        }
                      }
                      //WEENN FAHRT in Zeile LIEGT!!!!!!

                      let zeilenFahrt=fahrten.filter(element=>element.start>=abSCHN[0].tag&&element.ende<=abSCHN[abSCHN.length-1].tag);
                     // console.log(zeilenFahrt[0]?.titel + element.klasse);
              

                      zeilenFahrt.forEach((fahrtOBj, f) => {
                        //nur fahrt in der zeile beachten:
                        if(abSCHN[0].tag&&fahrtOBj.start&&
                          abSCHN[0].tag.getTime()<=fahrtOBj.start.getTime()&&abSCHN[abSCHN.length-1].tag.getTime()>=fahrtOBj.ende){
                        if (fahrtOBj.start && fahrtOBj.ende && epoche.start && epoche.ende && //Nur wenn EIN projekt mitten in einer epoche liegt
                          //triggert aber auch wenn zwei drin liegen..
                          fahrtOBj.start.getTime() > epoche.start.getTime() &&
                            fahrtOBj.ende.getTime() < epoche.ende.getTime()) {
                          //wenn aktueller tag vorm Start der fahrt liegt: Ende anpassen
                          if (tag.tag.getTime() >= epoche.start.getTime() && tag.tag.getTime() <= fahrtOBj.start.getTime()) {
                            //Start bleibt wie definiert
                            ende.setTime(fahrtOBj.start.getTime()); //Achtung hier nimmt er auch Datum vom anderen Praktikum der Klasse...
                           
                            while (ende.getDay() !== 5) { //solange nicht Freitag ist
                              ende.setDate(ende.getDate() - 1);
                            }
                            //Wenn andere Fahrt-Start dazwischen liegt, das datum als Ende nehmen:
                            if(zeilenFahrt.length==2){
                            //e1 soll voriges Element sein:
                              let el1 =zeilenFahrt[0];
                              let el2=zeilenFahrt[1];

                              if(el1.start>el2.start){
                                el1 =zeilenFahrt[1];
                                el2=zeilenFahrt[0];
                              }

                              if(tag.tag.getTime()<=el1.start.getTime()&&tag.tag.getTime()<=el2.start.getTime()){
                                ende.setTime(el1.start.getTime());
                              }
                            }
                            //wenn aktueller Tag im zweiten Abschnitt liegt nach Ende der Fahrt
                          } else if (tag.tag.getTime() <= epoche.ende.getTime() && tag.tag.getTime() >= fahrtOBj.ende.getTime()) {
                            start.setTime(fahrtOBj.ende.getTime());
                            while (start.getDay() !== 1) { //solange nicht montag ist
                              start.setDate(start.getDate() + 1);
                            }
                            // start=datu; //ggf. einen tag später?
                          }
                        }
                        else { //WEnn projekt nicht mittig liegt von einer epoche
                        }
                      }
                      });
                      end.setTime(ende.getTime());
                      span = this.daysBetween(start, ende);
                      ersterTag.setTime(start.getTime());
                    }
                  });

                  //@ts-ignore
                  if (bool === true && (element.klasse === Lehrjahr[kla]||element.klasse===this.wortInZahl(kla))) {
                    neu[aI][zahl][zaehler].push({
                      fach: element.fach,
                      lehrer: element.lehrer[0].kuerzel,
                      spanNr: span,
                      ganztaegig: titel,
                      start: ersterTag,
                      ende: end
                    });
                  }
                });
              }
            });
            zaehler++;
          }
        });
      });
     // console.log(neu);
      return neu;
    })
  );

  

  schienenPlan$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let fahrtenUndProjekte = this.ferienServ.fahrtenUndProjekteObj;
   
      // let obj:{}|{fach:Fach,lehrer:Lehrer}|{ueberschrift:string}
      let neu: Array < Array < Array < Array < {
        fach ? : Fach,
        lehrer ? : string,
        spanNr ? : number,
        ueberschrift ? : Date,
        ganztaegig ? : string,
        start ? : Date,
        ende ? : Date,
      } >>> >= [new Array(5), new Array(5), new Array(5), new Array(5)];
      //let ar=this.epochenPlanS.esr_plan;
      let abschnitt1 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.sommerFerienEnde && ele.tag < this.ferienServ.herbstferienStart); //erster Abschnitt
      let abschnitt2 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.herbstferienEnde && ele.tag < this.ferienServ.weihnachtsferienStart); //zweiter
      let abschnitt3 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.weihnachtsferienEnde && ele.tag < this.ferienServ.osterferienStart); //dritter
      let abschnitt4 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.osterferienEnde && ele.tag < this.ferienServ.sommerferienStart); //viere
      [abschnitt1, abschnitt2, abschnitt3, abschnitt4].forEach((abSCHN, aI) => {
        let zaehler = 0; //Für cellen-index
        abSCHN.forEach((tag: TagesObjekt) => {
          if (tag.tag.getDay() == 1) { //auf Montage reduzieren

            //Datumfächer erstellen und befüllen:
            if (neu[aI][0] == undefined) {
              neu[aI][0] = [];
            }
            if (neu[aI][0][zaehler] == undefined) {
              neu[aI][0][zaehler] = [];
            }
            neu[aI][0][zaehler].push({
              ueberschrift: tag.tag
            }); //tag unter 0 reinpushen//UBERSCHRIFT
            ['neun', 'zehn', 'elf', 'zwoelf'].forEach((kla, k) => {
              //IN TAbelle z.b Abschnitt 1, jede Klasse nun durchgehen (im Prinzip pro Zeile also neu)
              let span = 0;
              let fahrten = fahrtenUndProjekte[kla]; //aus dem Lehrerservice die Fahrten der Klasse
              let ersterTag = new Date(); //das ist heute
              let bool = false;
              let zahl = k + 1;
              let fahrt = false;
              let end=new Date();
              //leere felder erstellen
              if (neu[aI][zahl] == undefined) {
                neu[aI][zahl] = [];
              }
              if (neu[aI][zahl][zaehler] == undefined) {
                neu[aI][zahl][zaehler] = [];
              }
              let titel = "";
             
             
              fahrten.forEach(fahrtObj => {
                if (fahrtObj.start <= tag.tag && fahrtObj.ende >= tag.tag) {
                  fahrt = true;
                  ersterTag.setTime(fahrtObj.start.getTime());
                  titel = fahrtObj.titel;
                  let start = new Date(fahrtObj.start.getTime());
                  let ende = new Date(fahrtObj.ende.getTime());
                  //Span-wochen ermitteln: 
                  //Wenn projekt über zeilt geht:
                  if(fahrtObj.titel=="Landbau"){
                  console.log(fahrtObj.titel);
                  console.log(fahrtObj.start.getDate()+". " + fahrtObj.start.getMonth());
                  }

                  if (start < abSCHN[0].tag) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                    //    console.log(start);
                    start.setTime(abSCHN[0].tag.getTime());

                    //auf Montag ändern:
                    while (start.getDay() !== 1) { //solange nicht mo ist
                      start.setDate(start.getDate() + 1);
                    }
                  }
                  if (ende >= abSCHN[abSCHN.length - 1].tag) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                    ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                    //auf Montag ändern:
                    while (ende.getDay() !== 5) { //solange nicht fr ist
                      ende.setDate(ende.getDate() - 1);
                    }
                  }
                  end.setTime(ende.getTime());
                  span = this.daysBetween(start, ende);
                }
              });

              if (titel.length > 0) {
                neu[aI][zahl][zaehler].push({
                  fach: null, // später: element.fach,
                  lehrer: null, // später element.lehrer[0].kuerzel,
                  spanNr: span, //später span
                  ganztaegig: titel,
                  start: ersterTag, //später ersterTag, //bei neuem Abschnitt ist es erster Tag des abschnitts
                  ende: end,
                });
              }

              //Einzelne epochen-ELemente der KLasse durchgucken, nur wenn bool noch nicht true, also fahrt noch nicht drin:
              if (fahrt === false) {
                z.schiene[kla].forEach((element) => {//NUR HIER ANDERS NUR DIESE BEIDEN STELLEN steht schiene od rhythmus
                  bool = false;
                  span = 0;
                  ersterTag = new Date();

                  element.zuweisung.schiene.forEach(epoche => {//NUR HIER ANDERS UND

                 

                    if (epoche.start <= tag.tag && epoche.ende >= tag.tag) {

                      bool = true; //dann reinschreiben das obj später

                      let start = new Date(epoche.start.getTime());
                      let ende = new Date(epoche.ende.getTime());

                      if (start.getTime() < abSCHN[0].tag.getTime()) { //Wenn epoche vor Zeilenstart beginnt , dnan start auf zeilenstart ändern
                        start.setTime(abSCHN[0].tag.getTime());
                        //auf montag setzen:

                        while (start.getDay() !== 1) { //solange nicht mo ist
                          start.setDate(start.getDate() + 1);
                        }
                      }

                      if (ende.getTime() >= abSCHN[abSCHN.length - 1].tag.getTime()) { //Wenn epoche nach Zeilenende aufhört , dnan ende auf zeilenende ändern
                        ende.setTime(abSCHN[abSCHN.length - 1].tag.getTime());
                        //auf Montag ändern:
                        while (ende.getDay() !== 5) { //solange nicht fr ist
                          ende.setDate(ende.getDate() + 1);
                        }
                      }
                      //WEENN FAHRT in Zeile LIEGT!!!!!!

                      let zeilenFahrt=fahrten.filter(element=>element.start>=abSCHN[0].tag&&element.ende<=abSCHN[abSCHN.length-1].tag);
                     // console.log(zeilenFahrt[0]?.titel + element.klasse);
              
                    

                      zeilenFahrt.forEach((fahrtOBj) => {
                       
                        //nur fahrt in der zeile beachten:
                        if(abSCHN[0].tag&&fahrtOBj.start&&
                          abSCHN[0].tag.getTime()<=fahrtOBj.start.getTime()&&abSCHN[abSCHN.length-1].tag.getTime()>=fahrtOBj.ende){
                        if (fahrtOBj.start && fahrtOBj.ende && epoche.start && epoche.ende && //Nur wenn EIN projekt mitten in einer epoche liegt
                          //triggert aber auch wenn zwei drin liegen..
                          fahrtOBj.start.getTime() > epoche.start.getTime() &&
                            fahrtOBj.ende.getTime() < epoche.ende.getTime()) {
                          //wenn aktueller tag vorm Start der fahrt liegt: Ende anpassen
                          if (tag.tag.getTime() >= epoche.start.getTime() && tag.tag.getTime() <= fahrtOBj.start.getTime()) {
                            //Start bleibt wie definiert
                            ende.setTime(fahrtOBj.start.getTime()); //Achtung hier nimmt er auch Datum vom anderen Praktikum der Klasse...
                           
                            while (ende.getDay() !== 5) { //solange nicht Freitag ist
                              ende.setDate(ende.getDate() - 1);
                            }
                            //Wenn andere Fahrt-Start dazwischen liegt, das datum als Ende nehmen:
                            if(zeilenFahrt.length==2){
                            //e1 soll voriges Element sein:
                              let el1 =zeilenFahrt[0];
                              let el2=zeilenFahrt[1];

                              if(el1.start>el2.start){
                                el1 =zeilenFahrt[1];
                                el2=zeilenFahrt[0];
                              }

                              if(tag.tag.getTime()<=el1.start.getTime()&&tag.tag.getTime()<=el2.start.getTime()){
                                ende.setTime(el1.start.getTime());
                              }
                            }
                            //wenn aktueller Tag im zweiten Abschnitt liegt nach Ende der Fahrt
                          } else if (tag.tag.getTime() <= epoche.ende.getTime() && tag.tag.getTime() >= fahrtOBj.ende.getTime()) {
                            start.setTime(fahrtOBj.ende.getTime());
                            while (start.getDay() !== 1) { //solange nicht montag ist
                              start.setDate(start.getDate() + 1);
                            }
                            // start=datu; //ggf. einen tag später?
                          }
                        }
                        else { //WEnn projekt nicht mittig liegt von einer epoche
                        }
                      }
                      });
                      end.setTime(ende.getTime());
                      span = this.daysBetween(start, ende);
                      ersterTag.setTime(start.getTime());

                    }
                  });

                  //@ts-ignore

                  //@ts-ignore
                  if (bool === true && (element.klasse === Lehrjahr[kla]||element.klasse===this.wortInZahl(kla))) {
                   
              
                
                  
                    neu[aI][zahl][zaehler].push({
                      fach: element.fach,
                      lehrer: element.lehrer[0].kuerzel,
                      spanNr: span,
                      ganztaegig: titel,
                      start: ersterTag,
                      ende: end
                    });
                  }
                });
              }
            });
            zaehler++;
          }
        });
      });
      console.log(neu);
      return neu;
    })
  );

wortInZahl(neun){
  switch(neun){
    case 'neun': return 9; 
    case 'zehn': return 10; 
    case 'elf': return 11; 
    case 'zwoelf': return 12 
  }
}


  //dooppelt


  schienePlan$ = this.klassenplanServ.esrPlaan$.pipe(

    map(z => {
      let neu = [new Array(5), new Array(5), new Array(5), new Array(5)];
      //let ar=this.epochenPlanS.esr_plan;
      let abschnitt1 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.sommerFerienEnde && ele.tag < this.ferienServ.herbstferienStart); //erster Abschnitt
      let abschnitt2 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.herbstferienEnde && ele.tag < this.ferienServ.weihnachtsferienStart); //zweiter
      let abschnitt3 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.weihnachtsferienEnde && ele.tag < this.ferienServ.osterferienStart); //dritter
      let abschnitt4 = this.epochenPlanS.esr_plan.getValue().filter(ele => ele.tag >= this.ferienServ.osterferienEnde && ele.tag < this.ferienServ.sommerferienStart); //vierer
      [abschnitt1, abschnitt2, abschnitt3, abschnitt4].forEach((abSCHN, aI) => {
        let zaehler = 0;
        abSCHN.forEach((tag) => {

          if (tag.tag.getDay() == 1) { //auf Montage reduzieren
            if (neu[aI][0] == undefined) {
              neu[aI][0] = [];
            }
            if (neu[aI][0][zaehler] == undefined) {
              neu[aI][0][zaehler] = [];
            }
            neu[aI][0][zaehler].push(tag.tag); //tag unter 0 reinpushen
            ['neun', 'zehn', 'elf', 'zwoelf'].forEach((kla, k) => {
              let ganztag = tag.ganztaegig[kla];
              z.schiene[kla].forEach((element) => {
                let bool = false;
                //neunte klasse unter 1 reinpushen
                element.zuweisung.schiene.forEach(startEnde => {
                  if (startEnde.start.getTime() <= tag.tag.getTime() && startEnde.ende.getTime() >= tag.tag.getTime()) {
                    bool = true;
                  }
                });
                //leere felder erstellen
                let zahl = k + 1;
                if (neu[aI][zahl] == undefined) {
                  neu[aI][zahl] = [];
                }
                if (neu[aI][zahl][zaehler] == undefined) {
                  neu[aI][zahl][zaehler] = [];
                }
                //@ts-ignore
                if (bool === true && (element.klasse === Lehrjahr[kla]||element.klasse===this.wortInZahl(kla))) {
                  neu[aI][zahl][zaehler].push([element.fach, element.lehrer[0].kuerzel]);
                } //zehnte bei 2
              });
            });
            zaehler++;
          }
        });
      });

      //  console.log(neu);
      return neu;
    })
  );



  clickN(e, klasse, datum) { //tagIndex, wochentagZahl) { //wochenTagZahl So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6

    let wochentagZahl = datum.getDay();
    let tagIndex = this.ferienServ.daysBetween().findIndex(tag => tag.tag.getTime() == datum.getTime());
    let monta = this.esrPlan[tagIndex - wochentagZahl + 1].tag; //Montag der Woche auswhäln für Start
    let freit = this.esrPlan[tagIndex - wochentagZahl + 5].tag; //Ende der Schulwoche/epoche
    //Gerade oder Ungerade Clickanzahl


    let ar = this.grundPlanfaecher;
    ar.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          if (e.shiftKey) {
            ele.zuweisung[this.gewaehlterPlan].forEach((startEnde, s) => {
              if (startEnde.start.getTime() == monta.getTime() && klasse == ele.klasse) {
                ele.zuweisung[this.gewaehlterPlan].splice(s, 1);
                // console.log(ele.zuweisung[this.gewaehlterPlan]);
              }
            });
            this.klassenplanServ.grundPlanfaecher.next(ar);
          } else if (this.clickCount > 0) {
            //Ende:
            ele.zuweisung[this.gewaehlterPlan].forEach(obj => {
              if (obj.ende == null) {
                obj.ende = freit; //Freitag für das ende der epoche
              }
            });
          }
        });
      }
    });
    if (this.clickCount > 0) {
      this.klassenplanServ.grundPlanfaecher.next(this.grundPlanfaecher);
    }
    this.clickCount = 0;
  }


  toggleClick(ele, datum) {

    this.gewaehltesElement = ele;
    this.clickCount = 0;
    //markieren schon angelegte epochen:
    this.lehrerServ.lehrerSelected.next(ele.lehrer[0]); //bis hier alles, was vorher Auswahl gemacht hat
    //jetzt den ersten click triggern:

    //variablen:
    let wochentagZahl = datum.getDay();
    let tagIndex = this.ferienServ.daysBetween().findIndex(tag => tag.tag.getTime() == datum.getTime());
    let monta = this.esrPlan[tagIndex - wochentagZahl + 1].tag; //Montag der Woche auswhäln für Start

    let ar = this.grundPlanfaecher;
    ar.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          //
          if (ele.klasse == this.gewaehltesElement.klasse && le == this.gewaehltesElement.lehrer[eh] && ele.fach == this.gewaehltesElement.fach) {

            ele.zuweisung[this.gewaehlterPlan].push({
              start: monta,
              ende: null
            });

          }
          this.clickCount++;
        });
      }
    });
  }




  reihenAufteilung(row, cIndex) {
    var span = 1;
    var cellIndex = cIndex;

    while (row.length > cellIndex + 1) {
      if (this.equals(row[cellIndex], row[cellIndex + 1])) {
        span++;
      } else {
        break;
      }

      ++cellIndex;
    }
    // console.log(span);

    return span;

  }
  /*
      let aufteilung = new Array(row.length);
      let dupli=0;

      row.forEach((cell, c) => {
        dupli=0;

        if (aufteilung[c] === undefined) {
          aufteilung[c] = 0;
        }

        if (c === 0) {
          aufteilung[0] = 1;
        }
        if (c === 1) {
          if (this.equals(row[c - 1], cell)) {
            aufteilung[c - 1]++;
            aufteilung[c]=aufteilung[c-1];
          }
        }
        if (c === 2) {
          if (this.equals(row[c - 2], cell)) {
            aufteilung[c - 2]++;
            aufteilung[c - 1]++;
            aufteilung[c]++;
          } else if (this.equals(row[c - 1], cell)) {
            aufteilung[c - 1]++;
            aufteilung[c]++;
          }
        }

      });
      console.log(aufteilung);
      return aufteilung;
    }*/

  equals(cell1, cell2) {
    //console.log(cell1);
    //console.log
    let counter = 0;
    if (cell1.length != 0 && cell1.length == cell2.length) {
      cell1.forEach(unterricht => {
        cell2.forEach(u => {
          if (unterricht.lehrer == u.lehrer && unterricht.fach == u.fach) {
            counter++;
          }
        });
      });
    }

    return counter >= cell2.length ? true : false;
  }

  markedd(kuerz) {
    if (kuerz && this.selectLehrer && kuerz == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }



  getGanztagsEvent(tagg, klasse) {
    let string: string = "";
    this.epochenPlanS.esr_plan.getValue().forEach(tag => {

      if (tag.tag.getTime() === tagg.getTime() && tag.ganztaegig[this.zahlInWort(klasse)] !== null) {
        //   console.log(tag.ganztaegig[this.zahlInWort(klasse)]);
        string = tag.ganztaegig[this.zahlInWort(klasse)];
      } else {}
    });

    return string;
  }


  marked(lehr) {
    if (lehr && this.selectLehrer && lehr.kuerzel == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }




  wahl(z) {
    this.gewaehlterPlan = z;
    this.clickCount = 0;
  }
  tabellensortierung(kl: Lehrjahr) {
    let lehrerVonKlasse: Array < Elementt > = [];
    //let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();
    //this.klassen.forEach((klas, f) => {
    this.grundPlanfaecher.forEach(element => {
      if ((element != null) && (element.klasse == kl) && (element[this.gewaehlterPlan] > 0)) {
        lehrerVonKlasse.push(element);
      }
    });
    return lehrerVonKlasse;
  }


  click(e, klasse, tagIndex, wochentagZahl) { //wochenTagZahl So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6

    let monta = this.esrPlan[tagIndex - wochentagZahl + 1].tag; //Montag der Woche auswhäln für Start
    let freit = this.esrPlan[tagIndex - wochentagZahl + 5].tag; //Ende der Schulwoche/epoche
    let clickStart = true;
    //Gerade oder Ungerade Clickanzahl
    if (this.clickCount % 2 == 0) {
      clickStart = true;
    } else {
      clickStart = false;
    }

    this.grundPlanfaecher.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          if (e.shiftKey) {
            ele.zuweisung[this.gewaehlterPlan].forEach((startEnde, s) => {
              if (startEnde.start.getTime() == monta.getTime() && klasse == ele.klasse) {
                ele.zuweisung[this.gewaehlterPlan].splice(s, 1);
            //    console.log(ele.zuweisung[this.gewaehlterPlan]);
              }
            });

          } else {

            if (ele.klasse == this.gewaehltesElement.klasse && le == this.gewaehltesElement.lehrer[eh] && ele.fach == this.gewaehltesElement.fach) {
              if (clickStart == true) {
                ele.zuweisung[this.gewaehlterPlan].push({
                  start: monta,
                  ende: null
                });
              } else { //Ende:
                ele.zuweisung[this.gewaehlterPlan].forEach(obj => {

                  if (obj.ende == null) {
                    obj.ende = freit; //Freitag für das ende der epoche
                //    console.log(ele.fach + ele.klasse);
                //    console.log(ele.zuweisung[this.gewaehlterPlan]);
                  }
                });

              }
          //    console.log(ele.zuweisung[this.gewaehlterPlan]);
           //   console.log(ele);
            }
            this.clickCount++;
          }
        });
      }
    });



  }




  //console.log(this.esrPlan);





  epochenWahl(ele: Elementt) {
    this.gewaehltesElement = ele;
    this.clickCount = 0;
    //markieren schon angelegte epochen:
    this.lehrerServ.lehrerSelected.next(ele.lehrer[0]);
  }


  duplicates(lehrer, tag) {
    let duplica = 0;

    this.grundPlanfaecher.forEach(elem => {
      if (elem) {
        elem.zuweisung[this.gewaehlterPlan].forEach(startEnde => { //nur angewählter plan rhythmus o. shiene oder epoche die jeweiligen start-endes angucken je element
          if (startEnde.start != null && startEnde.ende != null) {
            if (startEnde.start.getTime() <= tag.getTime() && startEnde.ende.getTime() >= tag.getTime()) {
              elem.lehrer.forEach(lehr => {
                if (lehr.kuerzel == lehrer.kuerzel) {
                  duplica++;
                }
              });
            }
          }
        });
      }
    });
    return duplica > 1 ? "error" : "ok";
  }


  zahlInWort(zahl) {
    switch (zahl) {
      case 9:
        return "neun";
      case 10:
        return "zehn";
      case 11:
        return "elf";
      case 12:
        return "zwoelf";
    }
  }

  constructor(public epochenPlanS: EpochenPlaeneService, public ferienServ: FerientermineService, public klassenplanServ: KlassenplaeneService, public lehrerServ: LehrerService) {
    this.epochenPlanS.esr_plan$.subscribe((data) => {
      this.esrPlan = data;
      //  console.log(data);
    });
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);

    lehrerServ.lehrerSelected$.subscribe(data => {
      this.selectLehrer = data;
    });
  }

  ngOnInit(): void {}

}
