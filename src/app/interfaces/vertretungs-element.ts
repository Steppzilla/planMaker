import { Fach } from "../enums/fach.enum";
import { LehrerService } from "../services/lehrer.service";
import { Elementt } from "./elementt";
import { Lehrer } from "./lehrer";

export interface VertretungsElement {
    wochentag: string,
    datum?: Date,
    klasse: number,
    stunde: number,
    lehrerKuerz: string,
    fach: Fach,
    vertretung?: Elementt,
    sonderfach?:Fach,
    notiz?: string,
    vertretungsLehrer?:Lehrer

}
