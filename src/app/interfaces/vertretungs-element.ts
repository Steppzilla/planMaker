import { Fach } from "../enums/fach.enum";
import { Elementt } from "./elementt";
import { Lehrer } from "./lehrer";

export interface VertretungsElement {
    wochentag: string,
    datum?: Date,
    klasse: number,
    stunde: number,
    lehrer: Lehrer,
    fach: Fach,
    vertretung?: Elementt,

}
