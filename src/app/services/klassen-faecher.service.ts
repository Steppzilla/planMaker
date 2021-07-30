import {
  Injectable
} from '@angular/core';
import {
  Fach
} from '../enums/fach.enum';
import {
  Lehrjahr
} from '../enums/lehrjahr.enum';

@Injectable({
  providedIn: 'root'
})
export class KlassenFaecherService {
  zuweisungen: Array < [Fach, Lehrjahr[], number] > = [
    [Fach.franzoesisch, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 3],
    [Fach.englisch, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 3],

    [Fach.uebstunde, [Lehrjahr.eins,
      Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht    ], 1],
    [Fach.eurythmie, [Lehrjahr.eins,
      Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 1],
    [Fach.musik, [Lehrjahr.eins,
      Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 2],

    [Fach.handarbeit, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf, Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht], 2],
    [Fach.wochenabschluss, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei], 1],
    [Fach.spielturnen, [Lehrjahr.eins, Lehrjahr.zwei], 1],
    [Fach.sport, [Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf, Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 2],

    [Fach.religion, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht    ], 1],
    [Fach.ethik, [Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn    ], 1],

    [Fach.griechisch, [Lehrjahr.fuenf], 1],

    [Fach.latein, [Lehrjahr.sechs], 1],

    [Fach.hauptunterricht, [Lehrjahr.eins, Lehrjahr.zwei, Lehrjahr.drei, Lehrjahr.vier, Lehrjahr.fuenf,
      Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun,
      Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf   ], 10],

    [Fach.schiene, [Lehrjahr.neun, Lehrjahr.zehn], 8],
    [Fach.schiene, [Lehrjahr.elf, Lehrjahr.zwoelf], 6],

    [Fach.rhythmisch, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 5],

    [Fach.gartenbau, [Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun], 2],
    [Fach.werken, [Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht, Lehrjahr.neun], 2],
    [Fach.mittelstufenorchester, [Lehrjahr.sechs, Lehrjahr.sieben], 1],
    [Fach.orchester, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 2],

    [Fach.deutsch, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 4],
    [Fach.mathematik, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 4],
    [Fach.physik, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.chemie, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.kunstgeschichte, [Lehrjahr.neun, Lehrjahr.zwoelf], 1],
    [Fach.geschichte, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 2],
    [Fach.biologie, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 1],
    [Fach.klassenbetreuer, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 1],

    [Fach.schmieden, [Lehrjahr.neun, Lehrjahr.zehn], 1],
    [Fach.weben, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.plastizieren, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.kunst, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],

    [Fach.chor, [Lehrjahr.neun, Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.poetik, [Lehrjahr.zehn, Lehrjahr.elf], 1],
    [Fach.geographie, [Lehrjahr.zehn, Lehrjahr.elf, Lehrjahr.zwoelf, Lehrjahr.dreizehn], 1],
    [Fach.programmieren, [Lehrjahr.zehn], 1],
    [Fach.computer, [Lehrjahr.zehn], 1],
    [Fach.wirtschaftspolitik, [Lehrjahr.elf, Lehrjahr.zwoelf], 1],
    [Fach.wahlpflicht, [Lehrjahr.elf, Lehrjahr.zwoelf], 2],
    [Fach.hgw, [Lehrjahr.sechs, Lehrjahr.sieben, Lehrjahr.acht], 2],


    [Fach.landbauNachbereitung, [Lehrjahr.neun],1],
  ];




  constructor() {}
}
