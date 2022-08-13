import { Component, OnInit } from '@angular/core';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';

@Component({
  selector: 'app-hinweise',
  templateUrl: './hinweise.component.html',
  styleUrls: ['./hinweise.component.scss']
})
export class HinweiseComponent implements OnInit {

  constructor(public epochenplaeneServ:EpochenPlaeneService) { }

  ngOnInit(): void {
  }

}
