import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  redirect(x:string){
    this.router.navigate([x]);
  }

  save() {
    this.login.login();
    this.login.saveAll();
    this.login.logout();
  }

  load() {
    this.login.login();
    this.login.gesamtPlanLaden(); //login.stundenplandaten wird neu belegt mit Daten, also observed durch this.stundenRaster ändert sich das dann auch
    this.login.logout();

  }

  constructor(public login: LoginService, public router:Router,public termine:FerientermineService) {
    this.load();
   }

  ngOnInit(): void {
  }

}
