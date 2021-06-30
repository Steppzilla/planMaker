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
  projektWocheStart: Date = new Date(2022, 1, 28); //Klasse 9,10,11,12
  projektWocheEnde: Date = new Date(2022, 2, 4);

  fahrtenUndProjekteObj = {
    neun: [{
        titel: "Landbau",
        start: new Date(2022, 3, 18),
        ende: new Date(2022, 4, 13)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 28),
        ende: new Date(2022, 2, 4)
      }
    ],

    zehn: [{
        titel: "Feldmessen",
        start: new Date(2021, 7, 16),
        ende: new Date(2021, 7, 20)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 28),
        ende: new Date(2022, 2, 4)
      }
    ],

    elf: [{
        titel: "Sozialpraktikum",
        start: new Date(2021, 9, 18),
        ende: new Date(2021, 10, 5)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 28),
        ende: new Date(2022, 2, 4)
      }
    ],
    zwoelf: [{
        titel: "Kunstfahrt",
        start: new Date(2022, 4, 9),
        ende: new Date(2022, 4, 20)
      },
      {
        titel: "Klassenspiel",
        start: new Date(2021, 7, 30),
        ende: new Date(2021, 9, 1)
      },
      {
        titel: "Eurythmieabschluss",
        start: new Date(2022, 5, 6),
        ende: new Date(2022, 5, 17)
      },
      {
        titel: "ProjektWoche",
        start: new Date(2022, 1, 28),
        ende: new Date(2022, 2, 4)
      }
    ],
  }

  feierTage_Pruefungen_Ferien_Obj={
    pruefungen:[
      {
      titel: "Esa/Msa Englisch/Deutsch",
      start: new Date(2022, 3, 28),
      ende: new Date(2022, 3, 28)
    },
    {
      titel: "Esa/Msa Deutsch/Mathematik",
      start: new Date(2022, 4, 2),
      ende: new Date(2022, 4, 2)
    },
    {
      titel: "Esa/Msa Mathematik/Englisch",
      start: new Date(2022, 4, 6),
      ende: new Date(2022, 4, 6)
    },
    {
      titel: "Esa/Msa mündliche Prüfungen",
      start: new Date(2022, 5, 13),
      ende: new Date(2022, 5, 13)
    },
    {
      titel: "Abitur schriftlich Deutsch",
      start: new Date(2022, 3, 27),
      ende: new Date(2022, 3, 27)
    },
    {
      titel: "Abitur schriftlich Mathematik",
      start: new Date(2022, 4, 3),
      ende: new Date(2022, 4, 3)
    },
    {
      titel: "Abitur schriftlich Englisch",
      start: new Date(2022, 3, 29),
      ende: new Date(2022, 3, 29)
    },
    {
      titel: "Abitur schriftlich Geographie",
      start: new Date(2022, 2, 30),
      ende: new Date(2022, 2, 30)
    },
    {
      titel: "Abitur Sprechprüfung Englisch",
      start: new Date(2022, 2, 23),
      ende: new Date(2022, 2, 23)
    },
    {
      titel: "Abitur mündliche Prüfungen",
      start: new Date(2022, 5, 20),
      ende: new Date(2022, 5, 20)
    },
  ],
    feiertage:[
      {
        titel: "Pfingstferien",
        start: new Date(2022, 4, 27),
        ende: new Date(2022, 4, 28)
      },
      {
        titel: "Tag der deutschen Einheit",
        start: new Date(2021, 9, 3),
        ende: new Date(2021, 9, 3)
      },
      {
        titel: "Reformationstag",
        start: new Date(2021, 9, 31),
        ende: new Date(2021, 9, 31)
      },
      {
        titel: "Weihnachtstage",
        start: new Date(2021, 11, 25),
        ende: new Date(2021, 11, 26)
      },
      {
        titel: "Neujahr",
        start: new Date(2022, 0, 1),
        ende: new Date(2022, 0, 1)
      },
      {
        titel: "Karfreitag",
        start: new Date(2022, 3, 15),
        ende: new Date(2022, 3, 15)
      },
      {
        titel: "Ostermontag",
        start: new Date(2022, 3, 18),
        ende: new Date(2022, 3, 18)
      },
      {
        titel: "Tag der Arbeit",
        start: new Date(2022, 4, 1),
        ende: new Date(2022, 4, 1)
      },
      {
        titel: "Christi Himmelfahrt",
        start: new Date(2022, 4, 26),
        ende: new Date(2022, 4, 26)
      },
      {
        titel: "Pfingstmontag",
        start: new Date(2022, 5, 6),
        ende: new Date(2022, 5, 6)
      },
    //gf noch zwei eigene brückentage? Ausgleich is glaub ich, dass wir samstags oft feiern organisieren...?

    ],
    ferien:[
      {
        titel: "Sommerferien",  //Ende: letzter Ferientag vorm Schuljahresbeginn, Start: Erster Ferientag am Ende des Schuljahres
        start: new Date(2022, 6, 4), //ende des schuljahres quasi
        ende: new Date(2021, 6, 30)
      },
      {
        titel: "Herbstferien",  
        start: new Date(2021, 9, 4), 
        ende: new Date(2021, 9, 16)
      },
      {
        titel: "Weihnachtsferien",  
        start: new Date(2021, 11, 23), 
        ende: new Date(2022, 0, 8)
      },
      {
        titel: "Osterferien",  
        start: new Date(2022, 3, 4), 
        ende: new Date(2022, 3, 16)
      },
    ]
  }


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
        ganztagsProjekt.push(["Landbau", Lehrjahr.neun]); //9. Klasse
        ganztag.neun = "Landbau";
      }
      if ((day.getTime() >= this.kunstFahrtStart.getTime()) && (day.getTime() <= this.kunstFahrtEnde.getTime())) {
        ganztagsProjekt.push(["Kunstfahrt", Lehrjahr.zwoelf]); //12. kLasse
        ganztag.zwoelf = "Kunstfahrt";

      }
      if ((day.getTime() >= this.feldMessenStart.getTime()) && (day.getTime() <= this.feldMessenEnde.getTime())) {
        ganztagsProjekt.push(["Feldmessen", Lehrjahr.zehn]); //10. Klasse
        ganztag.zehn = "Feldmessen";
      }
      if ((day.getTime() >= this.sozialPraktikumStart.getTime()) && (day.getTime() <= this.sozialPraktikumEnde.getTime())) {
        ganztagsProjekt.push(["Sozialpraktikum", Lehrjahr.elf]); // 11. Klasse
        ganztag.elf = "Sozialpraktikum";
      }
      if ((day.getTime() >= this.klassenSpielStart.getTime()) && (day.getTime() <= this.klassenSpielEnde.getTime())) {
        ganztagsProjekt.push(["Klassenspiel", Lehrjahr.zwoelf]); // 12. Klasse
        ganztag.zwoelf = "Klassenspiel";
      }
      if ((day.getTime() >= this.eurhythmieAbschlussStart.getTime()) && (day.getTime() <= this.eurhythmieAbschlussEnde.getTime())) {
        ganztagsProjekt.push(["Eurythmieabschluss", Lehrjahr.zwoelf]); // 12. Klasse
        ganztag.zwoelf = "Eurythmieabschluss";
      }
      if ((day.getTime() >= this.projektWocheStart.getTime()) && (day.getTime() <= this.projektWocheEnde.getTime())) {
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
