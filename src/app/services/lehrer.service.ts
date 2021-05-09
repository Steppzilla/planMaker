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
      listeLehrerNachFach.push({fach: element, lehrer: []});
      
    });

     this.lehrer.forEach(person => {
      if (person.faecher == null) {} else {
        person.faecher.forEach(fach => {
           listeLehrerNachFach.forEach((item, i) => {
              if (item.fach == fach.toString()) {                
                listeLehrerNachFach[i].lehrer.push(person);
              } else {
              }
            });
          });
      }
    });
   // console.log(listeLehrerNachFach);
    return listeLehrerNachFach;
  }





  lehrer: Lehrer[] = [

    {
      id: 0,
      name: null,
      kuerzel: null,
      anrede: null,
      faecher: null
    },
    // faecherKlassen: Array<[Fach,Lehrjahr[]]>; //Kompentenzn, können mehr sein als zugewiesen
    {
      id: 1,
      name: 'Bayas',
      kuerzel: 'By',
      anrede: "Herr",
      faecher: [Fach.mathematik, Fach.physik],
    },
    {
      id: 2,
      name: 'Clement',
      kuerzel: 'Cle',
      anrede: "Frau",
      faecher: [Fach.handarbeit,Fach.biologie],
      aufgaben: ["Handarbeitsraum"],
    },
    {
      id: 3,
      name: 'Crone',
      kuerzel: 'Cr',
      anrede: "Frau",
      faecher: [Fach.chemie],
    },
    {
      id: 4,
      name: 'Claußen',
      kuerzel: 'Cla',
      anrede: "Frau",
      faecher: [Fach.mathematik, Fach.kunst],
    },
    {
      id: 5,
      name: 'Corsten',
      kuerzel: 'Co',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.musik, Fach.uebstunde]
    },
    // { id: 3, name: 'Dittmann', kuerzel: 'Dit', anrede: "Frau", facher:  },
    {
      id: 6,
      name: 'Ehrhardt',
      kuerzel: 'Eh',
      anrede: "Frau",
      faecher: [Fach.englisch],
      aufgaben: ["Schulführung"],
    },
    {
      id: 7,
      name: 'Frank',
      kuerzel: 'Fr',
      anrede: "Frau",
      faecher: [Fach.franzoesisch, Fach.klassenbetreuer],
      aufgaben: ["Schulführung"],
    },
    // { id: 6, name: 'Fucke', kuerzel: 'Fu'  , anrede: "Frau" , faecher: [Fach.]},
    {
      id: 8,
      name: 'Funke',
      kuerzel: 'Fun',
      anrede: "Frau",
      faecher: [Fach.gartenbau],
    },
    {
      id: 9,
      name: 'Gretsch',
      kuerzel: 'Gre',
      anrede: "Frau",
      faecher: [Fach.geographie, Fach.kunst],

    },
    {
      id: 10,
      name: 'Güldenpenning',
      kuerzel: 'Gü',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.handarbeit, Fach.religion, Fach.uebstunde],
    },
    {
      id: 11,
      name: 'Haarmeier',
      kuerzel: 'Hm',
      anrede: "Herr",
      faecher: [Fach.schmieden],
    },
    {
      id: 12,
      name: 'Häggmark',
      kuerzel: 'Hä',
      anrede: "Herr",
      faecher: [Fach.eurythmie],
    },
    {
      id: 13,
      name: 'Hertinger',
      kuerzel: 'He',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.religion, Fach.ethik, Fach.uebstunde],
    },
    {
      id: 14,
      name: 'Kießig',
      kuerzel: 'Ki',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.englisch, Fach.uebstunde, Fach.handarbeit],
      aufgaben: ["Schulführung"],
    },
    {
      id: 15,
      name: 'Keyifci',
      kuerzel: 'Ke',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.englisch, Fach.uebstunde, Fach.eurythmie],

    },
    {
      id: 16,
      name: 'Loth',
      kuerzel: 'Lo',
      anrede: "Frau",
      faecher: [Fach.deutsch, Fach.plastizieren, Fach.klassenbetreuer, Fach.geschichte, Fach.kunstgeschichte],
    },
    // { id: 15, name: 'Luley', kuerzel: 'Lu', anrede: "Frau"  , faecher: [Fac]},
    {
      id: 17,
      name: 'Neher',
      kuerzel: 'Ne',
      anrede: "Herr",
      faecher: [Fach.eurythmie],

    },
    {
      id: 18,
      name: 'Nüßgen-Langbehn',
      kuerzel: 'Lb',
      anrede: "Frau",
      faecher: [Fach.biologie, Fach.weben, Fach.handarbeit],
    },

    {
      id: 19,
      name: 'Pagallies-Meincke',
      kuerzel: 'PM',
      anrede: "Frau",
      faecher: [Fach.sport],
      aufgaben: ["Schulführung"],

    },
    {
      id: 20,
      name: 'Pahnke',
      kuerzel: 'Pa',
      anrede: "Herr",
      faecher: [Fach.musik,Fach.chor, Fach.orchester, Fach.mittelstufenorchester],

    },
    //{ id: 18, name: 'Piaskowski', kuerzel: 'FPi', anrede: "Frau", faecher: [Fach]  },
    {
      id: 21,
      name: 'Reichl',
      kuerzel: 'Rei',
      anrede: "Herr",
      faecher: [Fach.franzoesisch],
      aufgaben: ["Schulführung", "Pädagogische Leitung"],
    },

    {
      id: 22,
      name: 'Rosemann-Poch',
      kuerzel: 'RoP',
      anrede: "Herr",
      faecher: [Fach.werken, Fach.klassenbetreuer],
    },
    {
      id: 23,
      name: 'Santa',
      kuerzel: 'San',
      anrede: "Frau",
      faecher: [Fach.musik, Fach.franzoesisch,Fach.chor, Fach.orchester, Fach.mittelstufenorchester],

    },
    {
      id: 24,
      name: 'Scheunemann',
      kuerzel: 'Sc',
      anrede: "Herr",
      faecher: [Fach.musik, Fach.wirtschaftspolitik, Fach.chor, Fach.orchester, Fach.mittelstufenorchester],
      aufgaben: ["Stundenplan"],

    },
    {
      id: 25,
      name: 'Schmidt',
      kuerzel: 'Sm',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.uebstunde, Fach.geographie],
      aufgaben: ["Schulfuehrung", "Stundenplan-Vertretung"],

    },
    {
      id: 26,
      name: 'Sodemann',
      kuerzel: 'Sod',
      anrede: "Frau",
      faecher: [Fach.deutsch, Fach.poetik, Fach.geschichte, Fach.kunstgeschichte,Fach.klassenbetreuer],
      aufgaben: ["Schulplattform-Admin", "Prüfungen ESA/MSA/Abitur", "Projektwoche"]
    },
    {
      id: 27,
      name: 'Sommer',
      kuerzel: 'So',
      anrede: "Frau",
      faecher: [Fach.englisch],
      aufgaben: ["Prüfungen ESA/MSA"],
    },
    {
      id: 28,
      name: 'Sternberg',
      kuerzel: 'Ste',
      anrede: "Herr",
      faecher: [Fach.deutsch, Fach.klassenbetreuer, Fach.geschichte],
      aufgaben: ["Prüfungen Abitur"],

    },
    {
      id: 29,
      name: 'Stuchlik',
      kuerzel: 'Stk',
      anrede: "Herr",
      faecher: [Fach.hauptunterricht, Fach.musik, Fach.uebstunde, Fach.mittelstufenorchester,Fach.computer],
      aufgaben: ["Stundenplan-Vertretung", "Schulplattform-Admin"],

    },
    {
      id: 30,
      name: 'Waligorski-Sell',
      kuerzel: 'Wa',
      anrede: "Frau",
      faecher: [Fach.hauptunterricht, Fach.religion, Fach.uebstunde, Fach.spielturnen, Fach.griechisch, Fach.latein],
    },

    {
      id: 31,
      name: 'Wohlers',
      kuerzel: 'Wo',
      anrede: "Frau",
      faecher: [Fach.musik, Fach.mathematik, Fach.programmieren],
      aufgaben: ["Schüler-Computerraum", "Schulplattform-Admin", "Digitalpakt-Ansprechpartner"]
    },
    {
      id: 32,
      name: 'Zenker',
      kuerzel: 'Ze',
      anrede: "Frau",
      faecher: [Fach.franzoesisch, Fach.kunst],

    },
    {
      id: 33,
      name: 'Zwierlein',
      kuerzel: 'Zw',
      anrede: "Frau",
      faecher: [Fach.religion],

    },
    {
      id: 34,
      name: 'Jöhnk',
      kuerzel: 'Jö',
      anrede: "Frau",
      faecher: [Fach.handarbeit],

    },
    {
      id: 35,
      name: 'Schilling (Prakt.)',
      kuerzel: 'Si',
      anrede: "Frau",
      faecher: [Fach.handarbeit, Fach.hauptunterricht],
    },
    {
      id: 36,
      name: 'Piaskowski',
      kuerzel: 'Pi',
      anrede: "Herr",
      faecher: [Fach.sport],

    },
  ];



  constructor() {
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
