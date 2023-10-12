import { Component, OnInit } from "@angular/core";


@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  public cardChart1: any;
  public cardChart1Data: any;
  public cardChart1Label: any;
  users = [
    { Name: 'John Doe', Age: 30, City: 'New York' },
    { Name: 'Jane Doe', Age: 25, City: 'San Francisco' },
    { Name: 'Bob Smith', Age: 40, City: 'Los Angeles' },
    { Name: 'Alice Johnson', Age: 35, City: 'Chicago' }
  ];
  public cardChart2: any;
  public cardChart2Data: any;
  public cardChart2Label: any;

  public cardChart3: any;
  public cardChart3Data: any;
  public cardChart3Label: any;

  public cardChart4: any;
  public cardChart4Data: any;
  public cardChart4Label: any;

  constructor() {}
  ngOnInit() {
  }

}
