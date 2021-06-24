import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Elementt } from '../interfaces/elementt';
import { VertretungsElement } from '../interfaces/vertretungs-element';

@Injectable({
  providedIn: 'root'
})
export class VertretungServService {


  datum;

  vertretung=new BehaviorSubject([]);
  vertretung$=this.vertretung.asObservable();

  aktuelleESRElemente:Array <[Elementt,number,string]>=[];
  
  constructor() { 

    this.datum=new Date(2021, 7, 24);
  }
}
