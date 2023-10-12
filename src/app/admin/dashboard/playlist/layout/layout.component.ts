import { Component } from '@angular/core';
import { HelperService } from "src/app/core/service/helper.service";
import { SharedService } from "src/app/core/service/shared.service";
import { ApiLayoutService } from "src/app/core/service/api-layout.service";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
    all_layouts: any = [];
    selected_layout: string = '1';

    constructor(
        private apiLayoutService: ApiLayoutService,
        private helperService: HelperService,
        private sharedService: SharedService,
    ) {
        this.getAllLayoutsWithZones();
    }

    getAllLayoutsWithZones() {
        this.apiLayoutService.getAllLayoutsWithZones().subscribe((response: any) => {
            this.all_layouts = response;
            this.selected_layout = this.helperService.getUserSelectedLayoutId();
        })
    }

    selectlayout(selected_layout: string): void {
        this.selected_layout = selected_layout;
        this.sharedService.setTempLayoutID(this.selected_layout)
    }
}