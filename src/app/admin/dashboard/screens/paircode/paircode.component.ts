import { Component, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { SharedService } from 'src/app/core/service/shared.service';

@Component({
	selector: 'app-paircode',
	templateUrl: './paircode.component.html',
	styleUrls: ['./paircode.component.scss']
})

export class PaircodeComponent {
	constructor(
		private el: ElementRef, private router: Router,
        private apiScreenService: ApiScreenService,
		private sharedService: SharedService,
	) { }

	checkPairingCode() {
		var screen_pair_value = this.el.nativeElement.querySelector('#pairing_code').value;
		if (screen_pair_value.length >= 6) {
			this.checkScreenPair(screen_pair_value)
		}
	}

	checkScreenPair(screen_pair_value) {
		let screen_pair_object = {
			code: screen_pair_value
		}

        this.apiScreenService.putPairScreen(screen_pair_object).subscribe((response: any) => {
			console.log("response: ", response);
			if (response.id && response.status == "READY_TO_USE") {
				this.sharedService.setScreenObjectName(response.name)
				this.router.navigate(["/admin/dashboard/screens/screen_orientation/" + response.id]);
			}
		})
    }

}
