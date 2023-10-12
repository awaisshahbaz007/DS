import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit  {
  group: FormGroup;
  controls: any[];
  data = {
    "name": "",
      "address": "",
      "contactPerson": "",
      "contactEmail": "",
      "contactNumber": "",
      "organization": ""
  }
  check = false;
  constructor(
    private apiService:ApiService
  ){

  }
  ngOnInit() {
    console.log('this.data this.data',this.data)
      this.getLocations();

  }
  onApply(): void {
    console.log('appi')
  }
  formValueChanged(data){
    if(data.invalid){
      this.check = true;
    } else {
      this.check = false;
    }
    // this.formData = data.value;
  }
  AddNewUserValue(){
    this.controls = [ {
      name: 'name',
      label: 'Company Name',
      type: 'input',
      disable:false,
      value:this.data.name,
      placeholder: 'Enter your Company name',
      click: 'focus',
      input_type:'text',
      validators: [Validators.required, Validators.minLength(3)]
    },
    {
      name: 'address',
      label: 'Address',
      type: 'input',
      disable:false,
      value:this.data.address,
      placeholder: 'Enter your address',
      click: 'focus',
      input_type:'text',
      validators: [Validators.required, Validators.minLength(3)]
    },
    {
      name: 'primaryname',
      label: 'Primary Contact Name',
      disable:false,
      value:this.data.contactPerson,
      type: 'input',
      input_type:'text',
      placeholder: 'Enter your Primary Contact Name',
      click: 'focus',
      validators: [Validators.required]
    },
    {
      name: 'primaryemail',
      label: 'Primary Contact Email',
      disable:false,
      value:this.data.contactEmail,
      type: 'input',
      input_type:'mail',
      placeholder: 'Enter your Primary Contact Email',
      click: 'focus',
      validators: [Validators.required, Validators.email]
    },
    {
      name: 'primaryphone',
      label: 'Primary Contact Phone',
      disable:false,
      value:this.data.contactNumber,
      type: 'input',
      input_type:'number',
      placeholder: 'Enter your Primary Contact Phone',
      click: 'focus',
      validators: [Validators.required]
    },
    ]
    console.log('contr',this.controls)
    this.group = new FormGroup({});
    this.controls.forEach(control => {
      const formControl = new FormControl(control.value, control.validators);
      if (control.disable) {
        formControl.disable();
      }
      this.group.addControl(control.name, formControl);    });
  }
  loader = false;
  getLocations(){
    this.loader = true;
    this.apiService.getLocation().subscribe((response: any) => {
      console.log('res',response)
      const data = response.locations[0]
      this.data.name = data.name || ''
      this.data.contactEmail = data.contactEmail || ''
      this.data.contactPerson = data.contactPerson || ''
      this.data.contactNumber = data.contactNumber || ''
      this.data.organization = data.organization || ''
      this.data.address = data.address || ''
      console.log('res',this.data)
      this.AddNewUserValue();
      this.loader = false;
    })
  }
}
