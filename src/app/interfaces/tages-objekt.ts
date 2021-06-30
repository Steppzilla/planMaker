export interface TagesObjekt {

    tag: Date,
    frei:boolean, //ob schulfrei, nur bei Ferien + Feiertagen? siehe ferientermine push am ende
    notiz: string, //z.B. Herbstferien, Heiligabend
    wochenTag: string,
    unterricht: [],
    ganztaegig: {neun: [], zehn: [], elf: [] ,zwoelf: []},
    rhytmus?: {neun: [], zehn: [], elf:[], zwoelf:[]},
    epoche?: {neun: [], zehn: [], elf:[], zwoelf:[]},
    schiene?: {neun: [], zehn: [], elf:[], zwoelf:[]}

    

}
