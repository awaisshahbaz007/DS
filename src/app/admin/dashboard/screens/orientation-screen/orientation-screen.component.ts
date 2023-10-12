import { Component, ElementRef,Renderer2, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { SharedService } from 'src/app/core/service/shared.service';
import { ApiScreenService } from 'src/app/core/service/api-screen.service';

@Component({
    selector: 'app-orientation-screen',
    templateUrl: './orientation-screen.component.html',
    styleUrls: ['./orientation-screen.component.scss']
})

export class OrientationScreenComponent {
    // isSaveButtonDisabled: boolean = true;
      public isPageLoaded: boolean = false;
      public screenData: any;
      public showLoader: boolean = true;
    screen_id: any = ""
    screen_name: string = "Screen 1"
    screen_orientation: string = 'horizontal';
    screen_location_name: string = '';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private route: ActivatedRoute,
		private apiScreenService: ApiScreenService,
		private sharedService: SharedService,
    ) {
        this.screen_name = this.sharedService.getScreenObjectName()
        this.sharedService.setScreenObjectOrientation(this.screen_orientation)

        setTimeout(() => {
            this.route.params.subscribe(params => {
                this.screen_id = params['id'];
                this.sharedService.setScreenObjectId(this.screen_id)

                if (this.screen_id) {
                    this.apiScreenService.getScreenDetails(this.screen_id).subscribe((response: any) => {
                        console.log('getScreenDetails', response)
                        if (response.name) {
                            this.screen_name = response.name
                        }
                        if (response.orientation) {
                            this.screen_orientation = response.orientation
                        }
                        if (response.placedAt) {
                            this.screen_location_name = response.placedAt
                        }
                        this.sharedService.setScreenObjectName(this.screen_name)
                        this.sharedService.setScreenObjectOrientation(this.screen_orientation)
                        this.sharedService.setScreenObjectLocation(this.screen_location_name)

                        this.onOrientChanged();
                    })
                }
            });
        }, 500);
    }

    ngAfterViewInit() {
        const locationInput = this.el.nativeElement.querySelector('input[name="location"]');
        const horizontalElement = this.el.nativeElement.querySelector('.right.horizontal');

        if (locationInput) {
            // Focus on the location input field
            locationInput.focus();

            // Add a blinking effect to the cursor
            const cursorBlinkInterval = setInterval(() => {
                const cursorVisible = getComputedStyle(locationInput).getPropertyValue('caret-color') === 'auto';
                if (cursorVisible) {
                    this.renderer.setStyle(locationInput, 'caret-color', 'transparent');
                } else {
                    this.renderer.setStyle(locationInput, 'caret-color', 'initial');
                }
            }, 500); // Change the interval value (in milliseconds) to adjust the blinking speed

            // Stop the blinking effect after a certain time (e.g., 5000 milliseconds)
            setTimeout(() => {
                clearInterval(cursorBlinkInterval);
                this.renderer.setStyle(locationInput, 'caret-color', 'initial'); // Set caret color back to default
            }, 5000); // Change this value to adjust the duration of the blinking effect
        }
         if (horizontalElement) {
      // Use a MutationObserver to check for changes in the target element
      const observer = new MutationObserver(() => {
        const rect = horizontalElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          this.isPageLoaded = true;
          observer.disconnect();
           setTimeout(() => {
            this.screenData = "";
            this.showLoader = false;
          }, 2000);
        }
      });

      // Configure the observer to watch for changes in attributes and children
      observer.observe(horizontalElement, { attributes: true, childList: true, subtree: true });
    } else{
      this.isPageLoaded = true;
      this.showLoader = false;
    }
        //  this.isSaveButtonDisabled = false;

    }


    onOrientChanged() {
        if (this.screen_orientation === 'horizontal') {
            this.el.nativeElement.querySelector('.orientation_screen .right').classList.add('horizontal');
        } else {
            this.el.nativeElement.querySelector('.orientation_screen .right').classList.remove('horizontal');
        }
        this.sharedService.setScreenObjectOrientation(this.screen_orientation);
        // this.isSaveButtonDisabled = false;
        // this.sharedService.setButtonState(false);
    }

    onEditscreen() {
        const element = this.el.nativeElement.querySelector('#edit_screen_name');
        const getplayListName = this.el.nativeElement.querySelector('.screenName').innerText;
        if (element) {
            element.style.display = 'block';
            element.focus();
            element.value = getplayListName;
            this.el.nativeElement.querySelector('.screenName').style.display = 'none';
            this.el.nativeElement.querySelector('.edit_screen_btn').style.display = 'none';
            this.el.nativeElement.querySelector('.update_screen_name').style.display = 'block';
        }
    }

    onUpdatescreenName() {
        const element = this.el.nativeElement.querySelector('#edit_screen_name');
        if (element.value.length > 0) {
            this.el.nativeElement.querySelector('.edit_screen_btn').style.display = 'block';
            this.el.nativeElement.querySelector('.update_screen_name').style.display = 'none';
            element.style.display = "none";
            this.el.nativeElement.querySelector('.screenName').style.display = 'block';
            this.el.nativeElement.querySelector('.screenName').innerText = element.value;
            this.screen_name = element.value
            this.sharedService.setScreenObjectName(this.screen_name)
        }
    }

    onInputChange(newValue: string) {
        this.screen_location_name = newValue;
        this.sharedService.setScreenObjectLocation(this.screen_location_name)
        if(this.screen_location_name.length >= 1){
          this.sharedService.TriggersetScreenObjectLocation(true);
        } else{
          this.sharedService.TriggersetScreenObjectLocation(false);
        }
    }
    isHorizontalClassPresent() {
      const rightDiv = this.el.nativeElement.querySelector('.right');
      return rightDiv && rightDiv.classList.contains('horizontal');
  }

}
