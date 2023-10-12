




import { Directive, ElementRef, OnInit } from '@angular/core';
declare var PMW: any;

@Directive({
  selector: '[appOpenDiag]'
})
export class OpenDiagDirective implements  OnInit {

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    console.log('cwecwec')
    PMW.plugin.editor.open();
  }

}




 

