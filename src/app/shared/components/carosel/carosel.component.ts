import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carosel',
  templateUrl: './carosel.component.html',
  styleUrls: ['./carosel.component.scss']
})
export class CaroselComponent implements  OnInit {
  @Input() imageArray = []
  constructor(){

  }
  ngOnInit(): void {

  }
  slickInit(e) {
  }
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "arrows": false,
    "dots": true,
    autoplay: true,
    "speed": 100,
    "centerMode": false,
    "variableWidth": false,
  };

  breakpoint(e) {
  }

  afterChange(e) {
  }

  beforeChange(e) {
  }
}
