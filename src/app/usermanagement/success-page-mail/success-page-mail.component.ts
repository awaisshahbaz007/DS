import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page-mail',
  templateUrl: './success-page-mail.component.html',
  styleUrls: ['./success-page-mail.component.scss']
})
export class SuccessPageMailComponent implements OnInit {
  constructor(private router:Router){

  }

ngOnInit(): void {
    
}
onSubmit(){
  this.router.navigateByUrl('/usermanagement/signin')
}
}
