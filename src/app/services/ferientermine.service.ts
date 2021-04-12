import {
  Injectable
} from '@angular/core';
import {
  isWeekend,
  isSameDay,
  eachDayOfInterval
} from 'date-fns';
import { Lehrjahr } from '../enums/lehrjahr.enum';

//import{nextMonday} from "date-fns";


@Injectable({
  providedIn: 'root'
})
export class FerientermineService {
  datumHeute: Date = new Date(); //achtung hat aktuelle Zeit


  //Manuell gesetzt. 
  sommerFerienEnde: Date = new Date(2021, 6, 30); //Jahr/Monat- 1/tag des Monats

  herbstferienStart: Date = new Date(2021, 9, 4); //-1 für letzten Schultag davor. Wenn sa, so,feiertag weiter -1
  herbstferienEnde: Date = new Date(2021, 9, 16); // + 1 für ersten Schultag danach, wenn sa oder so oder feiertag weiter +1

  weihnachtsferienStart: Date = new Date(2021, 11, 23);
  weihnachtsferienEnde: Date = new Date(2022, 0, 8);

  osterferienStart: Date = new Date(2022, 3, 4);
  osterferienEnde: Date = new Date(2022, 3, 16);

  sommerferienStart: Date = new Date(2022, 6, 4); //ab 4.7. 2022 sind Ferien

  //Pfingstferien gehören zu den Feiertagen bei mir:!
  pfingstferienStart: Date = new Date(2022, 4, 27);
  pfingstferienEnde: Date = new Date(2022, 4, 28);

  feiertag_TagDerDeutschenEinheit: Date = new Date(2021, 9, 3);
  feiertag_Reformationstag: Date = new Date(2021, 9, 31);
  feiertag_weihnachtsTag1: Date = new Date(2021, 11, 25);
  feiertag_weihnachtsTag2: Date = new Date(2021, 11, 26);
  //2022:
  feiertag_Neujahr: Date = new Date(2022, 0, 1);
  feiertag_karFreitag: Date = new Date(2022, 3, 15);
  feiertag_ostermontag: Date = new Date(2022, 3, 18);
  feiertag_tagDerArbeit: Date = new Date(2022, 4, 1);
  feiertag_christiHimmelfahrt: Date = new Date(2022, 4, 26);
  feiertag_pfingstMontag: Date = new Date(2022, 5, 6);

  //Prüfungstermine Abitur (rot?)
  abiSchriftl_Deutsch: Date = new Date(2022, 3, 27);
  abiSchriftl_Mathematik: Date = new Date(2022, 4, 3);
  abiSchriftl_Englisch: Date = new Date(2022, 3, 29);
  abiSchriftl_Geo: Date = new Date(2022, 2, 30);

  abiEnglischSprechpruefung: Date = new Date(2022, 2, 23);

  abiMuendlichWoche: Date = new Date(2022, 5, 20); //ganzwoechig
  //Prüfungen ESA /MSA: 
  EM_EnglischDeutsch: Date = new Date(2022, 3, 28);
  EM_DeutschMathematik: Date = new Date(2022, 4, 2);
  EM_MathematikEnglisch: Date = new Date(2022, 4, 6);
  EM_muendlich: Date = new Date(2022, 5, 13);

  //Klassenfahrten, ganztagsProjekte (gelb)?:
  landbauStart: Date = new Date(2022, 3, 19); //Kl 9
  landbauEnde: Date = new Date(2022, 4, 13);
  kunstFahrtStart: Date = new Date(2022, 4, 9); //Kl 12
  kunstFahrtEnde: Date = new Date(2022, 4, 20);
  feldMessenStart: Date = new Date(2021, 7, 16); //Kl 10
  feldMessenEnde: Date = new Date(2021, 7, 20);
  sozialPraktikumStart: Date = new Date(2021, 9, 18); //kl 11
  sozialPraktikumEnde: Date = new Date(2021, 10, 5);
  klassenSpielStart: Date = new Date(2021, 7, 30); //Kl 12
  klassenSpielEnde: Date = new Date(2021, 9, 1);
  eurhythmieAbschlussStart: Date = new Date(2022, 5, 7); //Kl 12
  eurhythmieAbschlussEnde: Date = new Date(2022, 5, 17);
  //gf noch zwei eigene brückentage? Ausgleich is glaub ich, dass wir samstags oft feiern organisieren...?




  get pruefungsTage() {
    return [
      //Abi
      {
        tag: this.abiSchriftl_Deutsch,
        notiz: "Abi schr. Deu"
      },
      {
        tag: this.abiSchriftl_Mathematik,
        notiz: "Abi schr. Ma"
      },
      {
        tag: this.abiSchriftl_Englisch,
        notiz: "Abi schr. Eng"
      },
      {
        tag: this.abiSchriftl_Geo,
        notiz: "Abi schr. Geo"
      },

      {
        tag: this.abiEnglischSprechpruefung,
        notiz: "Abi Sprechpr. Eng"
      },
      {
        tag: this.abiMuendlichWoche,
        notiz: "Abi mündlich"
      },

      //ESA MSA
      {
        tag: this.EM_EnglischDeutsch,
        notiz: "EM Eng/Deu"
      },
      {
        tag: this.EM_DeutschMathematik,
        notiz: "EM Deu/Ma"
      },
      {
        tag: this.EM_MathematikEnglisch,
        notiz: "EM Ma/Eng"
      },

      //pfingstferien
      {
        tag: this.EM_muendlich,
        notiz: "EM mündlich"
      },
      //Sommerferien
    ]
  };




  get feiertage() {
    return [{
        tag: this.feiertag_TagDerDeutschenEinheit,
        notiz: "Tag der deutschen Einheit"
      },
      //herbstferien
      {
        tag: this.feiertag_Reformationstag,
        notiz: "Reformationstag"
      },
      {
        tag: this.feiertag_weihnachtsTag1,
        notiz: "1. Weihnachtstag"
      },
      {
        tag: this.feiertag_weihnachtsTag2,
        notiz: "2. Weihnachtstag"
      },

      //weihnachten
      //2022:
      {
        tag: this.feiertag_Neujahr,
        notiz: "Neujahr"
      },
      {
        tag: this.feiertag_karFreitag,
        notiz: "Karfreitag"
      },

      //osterferien
      {
        tag: this.feiertag_ostermontag,
        notiz: "Ostermontag"
      },
      {
        tag: this.feiertag_tagDerArbeit,
        notiz: "Tag der Arbeit"
      },
      {
        tag: this.feiertag_christiHimmelfahrt,
        notiz: "Himmelfahrt"
      },

      //pfingstferien
      {
        tag: this.pfingstferienStart,
        notiz: "Pfingstferien"
      },
      {
        tag: this.pfingstferienEnde,
        notiz: "Pfingstferien"
      },
      {
        tag: this.feiertag_pfingstMontag,
        notiz: "Pfingstmontag"
      },
      //Sommerferien
    ]
  };

  // WochenArrays von Sommer bis Herbst /Herbst-Weihnachten/Weihnachten-Ostern/ostern-sommer:


  daysBetweenArray = eachDayOfInterval({
    start: this.sommerFerienEnde,
    end: this.sommerferienStart
  }, {});



  daysBetween() {
    let ferien = false;
    let notiz = "no";
    let arr = [];
    let wochenTag = "";
    let ganztagsProjekt=[];

    this.daysBetweenArray.forEach(day => {
      ganztagsProjekt=[];
      ferien = false;
      notiz = "";

      if ((day.getTime() >= this.herbstferienStart.getTime()) && (day.getTime() <= this.herbstferienEnde.getTime())) {
        ferien = true;
        notiz = "Herbstferien";
      } else if ((day.getTime() >= this.weihnachtsferienStart.getTime()) && (day.getTime() <= this.weihnachtsferienEnde.getTime())) {
        ferien = true;
        notiz = "Weihnachtsferien";
      } else if ((day.getTime() >= this.osterferienStart.getTime()) && (day.getTime() <= this.osterferienEnde.getTime())) {
        ferien = true;
        notiz = "Osterferien";
      } else if (day.getTime() == this.sommerFerienEnde.getTime()) {
        ferien = true;
        notiz = "Sommerferien";
      } else if (day.getTime() == this.sommerferienStart.getTime()) {
        ferien = true;
        notiz = "Sommerferien";
      } else if ((day.getDay() == 0) || (day.getDay() == 6)) { //SAMSTAG, SONNTAG
        ferien = true;
        notiz = "WE";
      } else //jeden schultag (übriggebliebener "day") auf feiertage überprüfen
      {
        ferien = false;
        notiz = "schule";

        this.feiertage.forEach(tag => { //das hier in else-klammer, wenn man in ferien die feiertage nicht reinschreiben/überschreiben will

          if (isSameDay(tag.tag, day)) {
            ferien = true;
            notiz = tag.notiz;
          } else { //
          }
        });
        this.pruefungsTage.forEach(tag => { //prüfungstage

          if (isSameDay(tag.tag, day)) {
            ferien = false;
            notiz = tag.notiz;
          } else { //
          }
        });

      }
      //Fahrten
       if ((day.getTime() >= this.landbauStart.getTime()) && (day.getTime() <= this.landbauEnde.getTime())) {
         ganztagsProjekt.push(["Landbaupraktikum",Lehrjahr.neun]); //9. Klasse
       }
       if ((day.getTime() >= this.kunstFahrtStart.getTime()) && (day.getTime() <= this.kunstFahrtEnde.getTime())) {
        ganztagsProjekt.push(["Kunstfahrt",Lehrjahr.zwoelf]); //12. kLasse
       
      }
      if ((day.getTime() >= this.feldMessenStart.getTime()) && (day.getTime() <= this.feldMessenEnde.getTime())) {
        ganztagsProjekt.push(["Feldmessen",Lehrjahr.zehn]); //10. Klasse
      }
      if ((day.getTime() >= this.sozialPraktikumStart.getTime()) && (day.getTime() <= this.sozialPraktikumEnde.getTime())) {
        ganztagsProjekt.push(["Sozialpraktikum",Lehrjahr.elf]);// 11. Klasse
      }
      if ((day.getTime() >= this.klassenSpielStart.getTime()) && (day.getTime() <= this.klassenSpielEnde.getTime())) {
        ganztagsProjekt.push(["Klassenspiel",Lehrjahr.zwoelf]); // 12. Klasse
      }
      if ((day.getTime() >= this.eurhythmieAbschlussStart.getTime()) && (day.getTime() <= this.eurhythmieAbschlussEnde.getTime())) {
        ganztagsProjekt.push(["Eurythmieabschluss",Lehrjahr.zwoelf]);// 12. Klasse
      }

      wochenTag = this.tagZuString(day);
      arr.push({
        tag: day,
        frei: ferien,
        notiz: notiz,
        wochenTag: wochenTag,
        unterricht: [],
        ganztags: ganztagsProjekt
      }); //FORMAT der TAGE

    });
    console.log(arr);
    return arr;
  }





  //blocks=this.weeksBetween ;

  freieTageArray = this.freieTageDerWoche();

  freieTageDerWoche() {
    let freieTage: Array < [Date, Array < Date > ] >= [];
    return freieTage;
  }



  istFeiertag(day: Date) {
    let bo: boolean = false;
    this.feiertage.forEach(tag => {
      if (isSameDay(tag.tag, day)) { //selbe Tage: true;
        bo = true;
      } else {}
    });
    return bo;
  }

  tagZuString(tag: Date) {
    switch (tag.getDay()) {
      case 0:
        return "So";
      case 1:
        return "Mo";
      case 2:
        return "Di";
      case 3:
        return "Mi";
      case 4:
        return "Do";
      case 5:
        return "Fr";
      case 6:
        return "Sa";
    }

  }

  monatZuString(tag: Date) {
    switch (tag.getMonth()) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "März";
      case 3:
        return "April";
      case 4:
        return "Mai";
      case 5:
        return "Juni";
      case 6:
        return "Juli";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "Oktober";
      case 10:
        return "November";
      case 11:
        return "Dezember";
    }
  }



  constructor() {
    // console.log(this.daysBetween());

  }
}
