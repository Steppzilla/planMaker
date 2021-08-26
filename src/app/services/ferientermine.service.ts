import {
  Injectable
} from '@angular/core';
import {
  isSameDay,
  eachDayOfInterval
} from 'date-fns';
import {
  Lehrjahr
} from '../enums/lehrjahr.enum';

@Injectable({
  providedIn: 'root'
})
export class FerientermineService {
  datumHeute: Date = new Date(); //achtung hat aktuelle Zeit

  fahrtenUndProjekteObj = {
    neun: [{
        titel: "Landbau",
        start: new Date(2022, 3, 18),
        ende: new Date(2022, 4, 6)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 21),
        ende: new Date(2022, 1, 25)
      }
    ],

    zehn: [{
        titel: "Feldmessen",
        start: new Date(2021, 8, 20),
        ende: new Date(2021, 8, 24)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 21),
        ende: new Date(2022, 1, 25)
      }
    ],

    elf: [{
        titel: "Sozialpraktikum",
        start: new Date(2021, 9, 18),
        ende: new Date(2021, 10, 5)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 21),
        ende: new Date(2022, 1, 25)
      }
    ],
    zwoelf: [{
        titel: "Kunstfahrt",
        start: new Date(2022, 4, 16),
        ende: new Date(2022, 4, 28)
      },
      {
        titel: "Klassenspiel",
        start: new Date(2021, 8, 13),
        ende: new Date(2021, 8, 31)
      },
      {
        titel: "Eurythmieabschluss",
        start: new Date(2022, 5, 6),
        ende: new Date(2022, 5, 24)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 21),
        ende: new Date(2022, 1, 25)
      }
    ],
  }

  feierTage_Pruefungen_Ferien_Array=[
    {
      titel: "Esa/Msa Englisch/Deutsch",
      start: new Date(2022, 3, 28),
      ende: new Date(2022, 3, 28),
      notiz: "Prüfung",
    },
    {
      titel: "Esa/Msa Deutsch/Mathematik",
      start: new Date(2022, 4, 2),
      ende: new Date(2022, 4, 2),
      notiz: "Prüfung",
    },
    {
      titel: "Esa/Msa Mathematik/Englisch",
      start: new Date(2022, 4, 6),
      ende: new Date(2022, 4, 6),
      notiz: "Prüfung",

    },
    {
      titel: "Esa/Msa mündliche Prüfungen",
      start: new Date(2022, 5, 13),
      ende: new Date(2022, 5, 13),
      notiz: "Prüfung",
    },
    {
      titel: "Abitur schriftlich Deutsch",
      start: new Date(2022, 3, 27),
      ende: new Date(2022, 3, 27),
      notiz: "Prüfung",
    },
    {
      titel: "Abitur schriftlich Mathematik",
      start: new Date(2022, 4, 3),
      ende: new Date(2022, 4, 3),
      notiz: "Prüfung",
    },
    {
      titel: "Abitur schriftlich Englisch",
      start: new Date(2022, 3, 29),
      ende: new Date(2022, 3, 29),  notiz: "Prüfung",
    },
    {
      titel: "Abitur schriftlich Geographie",
      start: new Date(2022, 2, 30),
      ende: new Date(2022, 2, 30),  notiz: "Prüfung",
    },
    {
      titel: "Abitur Sprechprüfung Englisch",
      start: new Date(2022, 2, 23),
      ende: new Date(2022, 2, 23),  notiz: "Prüfung",
    },
    {
      titel: "Abitur mündliche Prüfungen",
      start: new Date(2022, 5, 20),
      ende: new Date(2022, 5, 20),  notiz: "Prüfung",
    },
  
    
      {
        titel: "Pfingstferien",
        start: new Date(2022, 4, 27),
        ende: new Date(2022, 4, 28), notiz:"Feiertag"
      },
      {
        titel: "Tag der deutschen Einheit",
        start: new Date(2021, 9, 3),
        ende: new Date(2021, 9, 3),notiz:"Feiertag"
      },
      {
        titel: "Reformationstag",
        start: new Date(2021, 9, 31),
        ende: new Date(2021, 9, 31),notiz:"Feiertag"
      },
      {
        titel: "Weihnachtstage",
        start: new Date(2021, 11, 25),
        ende: new Date(2021, 11, 26),notiz:"Feiertag"
      },
      {
        titel: "Neujahr",
        start: new Date(2022, 0, 1),
        ende: new Date(2022, 0, 1),notiz:"Feiertag"
      },
      {
        titel: "Karfreitag",
        start: new Date(2022, 3, 15),
        ende: new Date(2022, 3, 15),notiz:"Feiertag"
      },
      {
        titel: "Ostermontag",
        start: new Date(2022, 3, 18),
        ende: new Date(2022, 3, 18),notiz:"Feiertag"
      },
      {
        titel: "Tag der Arbeit",
        start: new Date(2022, 4, 1),
        ende: new Date(2022, 4, 1),notiz:"Feiertag"
      },
      {
        titel: "Christi Himmelfahrt",
        start: new Date(2022, 4, 26),
        ende: new Date(2022, 4, 26),notiz:"Feiertag"
      },
      {
        titel: "Pfingstmontag",
        start: new Date(2022, 5, 6),
        ende: new Date(2022, 5, 6),notiz:"Feiertag"
      },
    //gf noch zwei eigene brückentage? Ausgleich is glaub ich, dass wir samstags oft feiern organisieren...?

  
    
      {
        titel: "Sommerferien",  //Ende: letzter Ferientag vorm Schuljahresbeginn, Start: Erster Ferientag am Ende des Schuljahres
        start: new Date(2022, 6, 4), //ende des schuljahres quasi
        ende: new Date(2021, 6, 30),notiz:"Ferien",
      },
      {
        titel: "Herbstferien",  
        start: new Date(2021, 9, 4), 
        ende: new Date(2021, 9, 16),notiz:"Ferien",
      },
      {
        titel: "Weihnachtsferien",  
        start: new Date(2021, 11, 23), 
        ende: new Date(2022, 0, 8),notiz:"Ferien",
      },
      {
        titel: "Osterferien",  
        start: new Date(2022, 3, 4), 
        ende: new Date(2022, 3, 16),notiz:"Ferien",
      },
    
    ]


 

  // WochenArrays von Sommer bis Herbst /Herbst-Weihnachten/Weihnachten-Ostern/ostern-sommer:

  daysBetweenArray = eachDayOfInterval({
    start: this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Sommerferien").ende,
    end: this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Sommerferien").start
  }, {});

  daysBetween() {
    let ferien = false;
    let notiz = "no";
    let arr = [];
    let wochenTag = "";
    let ganztagsProjekt = [];
    //neu:
    let ganztag = {
      neun: null,
      zehn: null,
      elf: null,
      zwoelf: null
    };

    this.daysBetweenArray.forEach(day => {
      ganztagsProjekt = [];
      ferien = false;
      notiz = "";
      //nu:
      ganztag = {
        neun: null,
        zehn: null,
        elf: null,
        zwoelf: null
      };
      if (
        (day.getTime() >= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Herbstferien").start.getTime()) && 
      (day.getTime() <= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Herbstferien").ende.getTime())
      ) {
        
        ferien = true;
        notiz = "Herbstferien";
      } else if ((day.getTime() >= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Weihnachtsferien").start.getTime()) && (day.getTime() 
      <= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel="Weihnachtsferien").ende.getTime())) {
        ferien = true;
        notiz = "Weihnachtsferien";
      } else if ((day.getTime() >= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Osterferien").start.getTime()) && (day.getTime() 
      <= this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel="Osterferien").ende.getTime())) {
        ferien = true;
        notiz = "Osterferien";
      } else if (day.getTime() == this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Sommerferien").ende.getTime()) {
        ferien = true;
        notiz = "Sommerferien";
      } else if (day.getTime() == this.feierTage_Pruefungen_Ferien_Array.find(element=>element.titel==="Sommerferien").start.getTime()) {
        ferien = true;
        notiz = "Sommerferien";
      } else if ((day.getDay() == 0) || (day.getDay() == 6)) { //SAMSTAG, SONNTAG
        ferien = true;
        notiz = "WE";
      } else //jeden schultag (übriggebliebener "day") auf feiertage überprüfen
      {
        ferien = false;
        notiz = "schule";
        this.feierTage_Pruefungen_Ferien_Array.forEach(obj => { //das hier in else-klammer, wenn man in ferien die feiertage nicht reinschreiben/überschreiben will
          if (isSameDay(obj.start, day)) {
            ferien = true;
            notiz = obj.titel +obj.notiz;  //Feiertag oder ähnliches
          } else { //
          }
        });
      }
      //Fahrten
      if ((day.getTime() >=  this.fahrtenUndProjekteObj.neun.find(element=>element.titel==="Landbau").start.getTime())&&
      
       (day.getTime() <=  this.fahrtenUndProjekteObj.neun.find(element=>element.titel==="Landbau").ende.getTime())) {
        ganztagsProjekt.push(["Landbau", Lehrjahr.neun]); //9. Klasse
        ganztag.neun = "Landbau";
      }
      if ((day.getTime() >=  this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Kunstfahrt").start.getTime()) && (day.getTime() 
      <=  this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Kunstfahrt").ende.getTime())) {
        ganztagsProjekt.push(["Kunstfahrt", Lehrjahr.zwoelf]); //12. kLasse
        ganztag.zwoelf = "Kunstfahrt";

      }
      if ((day.getTime() >=  this.fahrtenUndProjekteObj.zehn.find(element=>element.titel==="Feldmessen").start.getTime()) && (day.getTime() 
      <=  this.fahrtenUndProjekteObj.zehn.find(element=>element.titel==="Feldmessen").ende.getTime())) {
        ganztagsProjekt.push(["Feldmessen", Lehrjahr.zehn]); //10. Klasse
        ganztag.zehn = "Feldmessen";
      }
      if ((day.getTime() >= 
      this.fahrtenUndProjekteObj.elf.find(element=>element.titel==="Sozialpraktikum").start.getTime()) && (day.getTime() <= 
      this.fahrtenUndProjekteObj.elf.find(element=>element.titel==="Sozialpraktikum").ende.getTime())) {
        ganztagsProjekt.push(["Sozialpraktikum", Lehrjahr.elf]); // 11. Klasse
        ganztag.elf = "Sozialpraktikum";
      }
      if ((day.getTime() >= 
      this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Klassenspiel").start.getTime()) && (day.getTime() 
      <= this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Klassenspiel").ende.getTime())) {
        ganztagsProjekt.push(["Klassenspiel", Lehrjahr.zwoelf]); // 12. Klasse
        ganztag.zwoelf = "Klassenspiel";
      }
      if ((day.getTime() >= 
      this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Eurythmieabschluss").start.getTime()) && (day.getTime() <= 
      this.fahrtenUndProjekteObj.zwoelf.find(element=>element.titel==="Eurythmieabschluss").ende.getTime())) {
        ganztagsProjekt.push(["Eurythmieabschluss", Lehrjahr.zwoelf]); // 12. Klasse
        ganztag.zwoelf = "Eurythmieabschluss";
      }
      if ((day.getTime() >=  this.fahrtenUndProjekteObj.neun.find(element=>element.titel==="ProjektWoche").start.getTime()) && (day.getTime() <= 
      this.fahrtenUndProjekteObj.neun.find(element=>element.titel==="ProjektWoche").ende.getTime())) {
        ganztagsProjekt.push(["Projektwoche", Lehrjahr.zwoelf]); // 12. Klasse
        ganztagsProjekt.push(["Projektwoche", Lehrjahr.elf]); // 11. Klasse
        ganztagsProjekt.push(["Projektwoche", Lehrjahr.zehn]); // 10. Klasse
        ganztagsProjekt.push(["Projektwoche", Lehrjahr.neun]); // 9. Klasse
        ganztag.neun = "Projektwoche";
        ganztag.zehn = "Projektwoche";
        ganztag.elf = "Projektwoche";
        ganztag.zwoelf = "Projektwoche";
      }

      wochenTag = this.tagZuString(day);
      arr.push({
        tag: day,
        frei: ferien,
        notiz: notiz,
        wochenTag: wochenTag,
        unterricht: [],
        ganztags: ganztagsProjekt,
        //neu:
        ganztaegig: {
          neun: ganztag.neun,
          zehn: ganztag.zehn,
          elf: ganztag.elf,
          zwoelf: ganztag.zwoelf
        },

      }); //FORMAT der TAGE
    });
    return arr;
  }

  freieTageArray = this.freieTageDerWoche();

  freieTageDerWoche() {
    let freieTage: Array < [Date, Array < Date > ] >= [];
    return freieTage;
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

  zahlZuString(zahl) {
    switch (zahl) {
      case 0:
        return "Mo";
      case 1:
        return "Di";
      case 2:
        return "Mi";
      case 3:
        return "Do";
      case 4:
        return "Fr";
      case 5:
        return "Sa";
      case 6:
        return "So";
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

  constructor() {}
}
