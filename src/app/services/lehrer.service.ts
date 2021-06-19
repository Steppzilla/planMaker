import {
  Injectable
} from '@angular/core';
import {
  Fach
} from '../enums/fach.enum';
import {
  Lehrer
} from '../interfaces/lehrer';


@Injectable({
  providedIn: 'root'
})
export class LehrerService {

  lehrernachFach() {
    let listeLehrerNachFach = [];
    Object.values(Fach).forEach(element => {
      listeLehrerNachFach.push({
        fach: element,
        lehrer: []
      });
    });
    this.lehrer.forEach(person => {
      if (person.faecher == null) {} else {
        person.faecher.forEach(fach => {
          listeLehrerNachFach.forEach((item, i) => {
            if (item.fach == fach.toString()) {
              listeLehrerNachFach[i].lehrer.push(person);
            }else{}
          });
        });
      }
    });
    return listeLehrerNachFach;
  }


  lehrer: Lehrer[] = [{
      name: null,
      kuerzel: null,
      anrede: null,
      faecher: [Fach.hgw,Fach.klassenbetreuer,Fach.kunst,Fach.kunstgeschichte,Fach.latein,Fach.mathematik,Fach.mittag,Fach.mittelstufenorchester,Fach.musik,Fach.musikgeschichte,Fach.null,
      Fach.physik,Fach.orchester,Fach.eurythmie,Fach.franzoesisch,Fach.englisch,Fach.gartenbau,Fach.geographie,Fach.religion]
    },
    // faecherKlassen: Array<[Fach,Lehrjahr[]]>; //Kompentenzn, können mehr sein als zugewiesen
    {
      name: 'Bayas',
      kuerzel: 'By',
      anrede: "Herr",
      faecher: [Fach.mathematik, Fach.physik],
    },
    {
      name: 'Clement',
      kuerzel: 'Cle',
      anrede: "Frau",
      faecher: [Fach.handarbeit, Fach.hgw, Fach.biologie],
      aufgaben: ["Handarbeitsraum"],
    },
    {
      name: 'Crone',
      kuerzel: 'Cr',
      anrede: "Frau",
      faecher: [Fach.chemie],
    },
    {
      name: 'Claußen',
      kuerzel: 'Cla',
      anrede: "Frau",
      faecher: [Fach.mathematik, Fach.kunst,Fach.wahlpflicht],
    },
    {
      name: 'Corsten',
      kuerzel: 'Co',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.musik, Fach.uebstunde, Fach.wochenabschluss,Fach.chor,Fach.mittelstufenorchester]
    },
    // { id: 3, name: 'Dittmann', kuerzel: 'Dit', anrede: "Frau", facher:  },
    {
      name: 'Ehrhardt',
      kuerzel: 'Eh',
      anrede: "Frau",
      faecher: [Fach.englisch],
      aufgaben: ["Schulführung"],
    },
    {
      name: 'Frank',
      kuerzel: 'Fr',
      anrede: "Frau",
      faecher: [Fach.franzoesisch, Fach.klassenbetreuer],
      aufgaben: ["Schulführung"],
    },
    // { id: 6, name: 'Fucke', kuerzel: 'Fu'  , anrede: "Frau" , faecher: [Fach.]},
  
    {
      name: 'Gretsch',
      kuerzel: 'Gre',
      anrede: "Frau",
      faecher: [Fach.geographie, Fach.kunst],

    },
    {
      name: 'Güldenpenning',
      kuerzel: 'Gü',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.handarbeit, Fach.religion, Fach.uebstunde],
    },
    {
      name: 'Haarmeier',
      kuerzel: 'Hm',
      anrede: "Herr",
      faecher: [Fach.schmieden],
    },
    {
      name: 'Häggmark',
      kuerzel: 'Hä',
      anrede: "Herr",
      faecher: [Fach.eurythmie],
    },
    {
      name: 'Hertinger',
      kuerzel: 'He',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.religion, Fach.ethik, Fach.uebstunde],
    },
    {
      name: 'Kießig',
      kuerzel: 'Ki',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.englisch, Fach.uebstunde, Fach.handarbeit],
      aufgaben: ["Schulführung"],
    },
    {
      name: 'Keyifci',
      kuerzel: 'Ke',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.englisch, Fach.uebstunde, Fach.wochenabschluss,Fach.eurythmie],

    },
    {
      name: 'Loth',
      kuerzel: 'Lo',
      anrede: "Frau",
      faecher: [Fach.deutsch, Fach.wahlpflicht, Fach.plastizieren, Fach.klassenbetreuer, Fach.geschichte, Fach.kunstgeschichte],
    },
    // { id: 15, name: 'Luley', kuerzel: 'Lu', anrede: "Frau"  , faecher: [Fac]},
    {
      name: 'Neher',
      kuerzel: 'Ne',
      anrede: "Herr",
      faecher: [Fach.eurythmie],

    },
    {
      name: 'Nüßgen-Langbehn',
      kuerzel: 'Lb',
      anrede: "Frau",
      faecher: [Fach.biologie, Fach.weben, Fach.handarbeit, Fach.wahlpflicht,Fach.klassenbetreuer],
    },

    {
      name: 'Pagallies-Meincke',
      kuerzel: 'PM',
      anrede: "Frau",
      faecher: [Fach.sport,Fach.klassenbetreuer],
      aufgaben: ["Schulführung"],

    },
    {
      name: 'Pahnke',
      kuerzel: 'Pa',
      anrede: "Herr",
      faecher: [Fach.musik, Fach.chor, Fach.orchester, Fach.mittelstufenorchester,Fach.musikgeschichte],

    },
    //{ id: 18, name: 'Piaskowski', kuerzel: 'FPi', anrede: "Frau", faecher: [Fach]  },
    {
      name: 'Reichl',
      kuerzel: 'Rei',
      anrede: "Herr",
      faecher: [Fach.franzoesisch],
      aufgaben: ["Schulführung", "Pädagogische Leitung"],
    },

    {
      name: 'Rosemann-Poch',
      kuerzel: 'RoP',
      anrede: "Herr",
      faecher: [Fach.werken, Fach.hgw,Fach.klassenbetreuer],
    },
    {
      name: 'Santa',
      kuerzel: 'San',
      anrede: "Frau",
      faecher: [Fach.musik, Fach.franzoesisch, Fach.chor, Fach.orchester, Fach.mittelstufenorchester,Fach.musikgeschichte],

    },
    {
      name: 'Scheunemann',
      kuerzel: 'Sc',
      anrede: "Herr",
      faecher: [Fach.musik, Fach.wirtschaftspolitik, Fach.chor, Fach.orchester, Fach.mittelstufenorchester,Fach.musikgeschichte],
      aufgaben: ["Stundenplan"],

    },
    {
      name: 'Schmidt',
      kuerzel: 'Sm',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.uebstunde, Fach.geographie],
      aufgaben: ["Schulfuehrung", "Stundenplan-Vertretung"],

    },
    {
      name: 'Sodemann',
      kuerzel: 'Sod',
      anrede: "Frau",
      faecher: [Fach.deutsch, Fach.poetik, Fach.geschichte, Fach.kunstgeschichte, Fach.klassenbetreuer],
      aufgaben: ["Schulplattform-Admin", "Prüfungen ESA/MSA/Abitur", "Projektwoche"]
    },
    {
      name: 'Sommer',
      kuerzel: 'So',
      anrede: "Frau",
      faecher: [Fach.englisch,Fach.klassenbetreuer],
      aufgaben: ["Prüfungen ESA/MSA"],
    },
    {
      name: 'Sternberg',
      kuerzel: 'Ste',
      anrede: "Herr",
      faecher: [Fach.deutsch, Fach.klassenbetreuer, Fach.geschichte],
      aufgaben: ["Prüfungen Abitur"],

    },
    {
      name: 'Stuchlik',
      kuerzel: 'Stk',
      anrede: "Herr",
      faecher: [Fach.hauptunterricht, Fach.musik, Fach.uebstunde, Fach.mittelstufenorchester, Fach.computer,Fach.wochenabschluss],
      aufgaben: ["Stundenplan-Vertretung", "Schulplattform-Admin"],

    },
    {
      name: 'Waligorski-Sell',
      kuerzel: 'Wa',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht,Fach.wochenabschluss, Fach.religion, Fach.uebstunde, Fach.spielturnen, Fach.griechisch, Fach.latein],
    },

    {
      name: 'Wohlers',
      kuerzel: 'Wo',
      anrede: "Frau",
      faecher: [Fach.musik, Fach.mathematik, Fach.programmieren,Fach.musikgeschichte],
      aufgaben: ["Schüler-Computerraum", "Schulplattform-Admin", "Digitalpakt-Ansprechpartner"]
    },
    {
      name: 'Zenker',
      kuerzel: 'Ze',
      anrede: "Frau",
      faecher: [Fach.franzoesisch, Fach.kunst,Fach.klassenbetreuer],

    },
    {
      name: 'Zwierlein',
      kuerzel: 'Zw',
      anrede: "Frau",
      faecher: [Fach.religion],

    },
    {
      name: 'Jöhnk',
      kuerzel: 'Jö',
      anrede: "Frau",
      faecher: [Fach.handarbeit],

    },
    {
      name: 'Schilling (Prakt.)',
      kuerzel: 'Si',
      anrede: "Frau",
      faecher: [Fach.handarbeit, Fach.hauptunterricht],
    },
   
    {
      name: 'Piaskowski',
      kuerzel: 'Pi',
      anrede: "Herr",
      faecher: [Fach.sport],
    },

    {
      name: 'Duhm',
      kuerzel: 'Du',
      anrede: "Herr",
      faecher: [Fach.gartenbau,Fach.biologie,Fach.hgw],

    },

    {
      name: 'Rathsack',
      kuerzel: 'Ra',
      anrede: "Herr",
      faecher: [Fach.biologie,Fach.chemie],

    },
    {
      name: 'Hinrich-Bünze',
      kuerzel: 'HB',
      anrede: "Frau",
      faecher: [Fach.englisch],

    },

 
  ];



  constructor() {
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
