import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import {MatCardModule} from '@angular/material/card';
import { NgxMaskModule } from "ngx-mask";
import { MatTooltipModule} from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import {MatGridListModule} from '@angular/material/grid-list';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import {MatProgressBarModule} from '@angular/material/progress-bar';
const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatTableModule,
  MatGridListModule,
  MatIconModule,
  MatSortModule,
  MatTooltipModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatRadioModule,
  MatCheckboxModule,
  NgxMaskModule.forRoot(),
  MatButtonToggleModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatCardModule,
  MatProgressBarModule,
];

@NgModule({
  declarations: [],
  imports: [materialModules],
  exports: [materialModules],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
   ],
})
export class MaterialModule {}
