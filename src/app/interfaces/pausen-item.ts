import { PausenZeit } from "../enums/pausen-zeit.enum";
import { PausenaufsichtsOrte } from "../enums/pausenaufsichts-orte.enum";
import { Wochentag } from "../enums/wochentag.enum";
import { Lehrer } from "./lehrer";

export interface PausenItem {

    lehrer:Lehrer,
    ort:PausenaufsichtsOrte,
    pausenZeit: PausenZeit,
    wochentag: Wochentag

}
