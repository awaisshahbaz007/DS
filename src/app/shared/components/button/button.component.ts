import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Output() onSubmitValue = new EventEmitter();

  @Input() data ={
    ButtonLabel:'',
    buttonDisabled:false,
    type:'primary'
  }
  constructor(){

  }

  ngOnInit(): void {
    // console.log('buttonr itput',this.data)
  }

  onSubmit(){
    this.onSubmitValue.emit();
  }
}
