import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';
import { LehrerService } from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  redirect(x: string) {
    this.router.navigate(["start/"+x]);
    this.lehrerS.gewaehlterPlan = x;
    console.log(x);
   // console.log(this.lehrerS.gewaehlterPlan);
  }

  constructor(public lehrerS: LehrerService,public router: Router,public epochenplaeneServ:EpochenPlaeneService) { 



  }

  ngOnInit(): void {
  }

}
