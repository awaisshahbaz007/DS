import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreensRoutingModule } from './screens-routing.module';
import { PaircodeComponent } from './paircode/paircode.component';

@NgModule({
    declarations: [
        PaircodeComponent,
    ],
    imports: [
        CommonModule,
        ScreensRoutingModule
    ]
})
export class ScreensModule { }
