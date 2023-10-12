import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
declare const $: any; // Import jQuery

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit,AfterViewInit  {
  @Output() formValueChanged = new EventEmitter();
  @Input() group: FormGroup;
  @Input() controls: any[];

  constructor() { }

  ngOnInit(): void {
  }

  onFormValueChanges() {
    this.formValueChanged.emit(this.group);
  }

  onInputFocus(){
    this.formValueChanged.emit(this.group);
  }
  ngAfterViewInit(): void {    
    const component = this; // Store reference to the component
    $('select').each(function() {
      var $this = $(this),
        selectOptions = $(this).children('option').length;
  
      $this.addClass('hide-select');
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="custom-select"></div>');
  
      var $customSelect = $this.next('div.custom-select');
      $customSelect.text($this.children('option').eq(0).text());
  
      var $optionlist = $('<ul />', {
        'class': 'select-options'
      }).insertAfter($customSelect);
  
      for (var i = 0; i < selectOptions; i++) {
        $('<li />', {
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
        }).appendTo($optionlist);
      }
  
      var $optionlistItems = $optionlist.children('li');
  
      $customSelect.click(function(e) {
        e.stopPropagation();
        $('div.custom-select.active').not(this).each(function() {
          $(this).removeClass('active').next('ul.select-options').hide();
        });
        $(this).toggleClass('active').next('ul.select-options').slideToggle();
      });
  
      $optionlistItems.click(function(e) {
        e.stopPropagation();
        $customSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $optionlist.hide();
        // var controlName = $this.attr('formControlName');
        var controlName = 'role'
        var newValue = $(this).attr('rel');
        // Assuming you are using Angular's Reactive Forms, update the value
        // of the form control using its name
        console.log('controlName',controlName)
        console.log('newValue',newValue)
        component.getvalue(newValue); // Pass the newValue to the component function
        console.log('group',component.group)
        component.onInputFocus();

        if (controlName) {
          var formControl = $this.closest('form').get(0)[controlName];
          if (formControl) {
            formControl.setValue(newValue);
            console.log('group',component.group)
            component.onInputFocus();
          }
          
        }
      });
  
      $(document).click(function() {
        $customSelect.removeClass('active');
        $optionlist.hide();
      });
    });
  }

  getvalue(Data){
    console.log('data',Data)
    this.group.get("role").setValue(Data);
    }
  
}
