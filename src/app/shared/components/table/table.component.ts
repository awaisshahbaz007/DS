import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, AfterViewInit, Input, OnInit, Output, ViewChild, ElementRef, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableServiceService } from 'src/app/core/service/data-table-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from "@angular/router";
import { MatCheckbox } from '@angular/material/checkbox';
import { HelperService } from "src/app/core/service/helper.service";
import { ApiContentService } from "src/app/core/service/api-content.service";
import { SharedService } from "src/app/core/service/shared.service";
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit, OnChanges {
  @Output() checkoutButtonSelected = new EventEmitter<boolean>();
  @Input() datatableRecord: any[] = [];
   isButtonEnabled: boolean = true;
  isAnyRowChecked: boolean = false;
  isButtonDisabled: boolean = true;
  areCheckboxesChecked: boolean = false;
	selectAllRecordID = [];
	selected_type: string;
	bulk_action_type: string;
	filterValue: string = '';
	showActionbtn: boolean = false;
	showDropDownAction: boolean = false;
	isProgrammaticClick: boolean = false;
	isContentModuel: boolean = false;
	isFolderModuel: boolean = false;
	dataRows: any[] = [];
	sortedColumn: string;
	@Input() checkAllDropDownAction: any[] = [];
	@ViewChildren(MatCheckbox) checkboxes: QueryList<MatCheckbox>;
	@Input() showmainAction: boolean = false;
	@Input() showTableHeading: boolean = true;
	@Input() data: any[] = [];
	@Input() AllRowsChecked: boolean = false;
	@Input() columns: any[] = [];
	@Input() actions: any[] = [];
	@Input() showCheckboxes: boolean = true;
	@Input() showTableActions: boolean = true;

	@Output() datatable_operation = new EventEmitter;
	@Output() send_list_type = new EventEmitter<string>();
	@Output() send_selected_row = new EventEmitter<string>();
	@Output() send_action_type = new EventEmitter<string>();

	displayedColumns: string[] = [];
	dataSource = new MatTableDataSource<any>([]);
	selection02 = new SelectionModel<any>(true, []);
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		public dialogRef: MatDialogRef<TableComponent>,
		private dataTableService: DataTableServiceService,
		private route: ActivatedRoute,
		private el: ElementRef,
		private router: Router,
		private helperService: HelperService,
		private apiContentService: ApiContentService,
		private sharedService: SharedService,
		private location: Location
	) {


	}

	ngOnInit(): void {

		this.sharedService.selected_datatable_records_trigger.subscribe(
			(selected_records) => {
				console.log("selected_datatable_records_trigger : ", selected_records)
				if (selected_records == "screen_ids") {
					this.setSelectedRecordIDs();

					this.helperService.saveObjectInLocatStorage('selected_screens', this.selectAllRecordID);
					let selected_screen_ids = this.helperService.getObjectFromLocatStorage('selected_screens');

					console.log("selected_screen_ids.length: ", selected_screen_ids.length)
					if (selected_screen_ids.length < 1) {
						this.helperService.showToasterNotifications('warning', 'Please select at least One Screen to Continue')
					} else {
						this.redirectToScheduleListPage()
					}
				} else if (selected_records == "playlist_ids") {
					console.log("selected_datatable_records_trigger playlist_ids: ", selected_records)
				}
			}
		);


		this.route.paramMap.subscribe(params => {
			this.selected_type = params.get('list_type');
			if (!this.selected_type) {
				this.selected_type = 'Content';
			}
		});

		this.send_list_type.emit(this.selected_type);

		if (this.showCheckboxes && this.showmainAction) {
			this.displayedColumns = ['checkbox', ...this.columns.map(column => column.field), 'actions'];
			console.log('displayedColumns', this.displayedColumns);
		} else if (this.showmainAction) {
			this.displayedColumns = [...this.columns.map(column => column.field), 'actions'];
		} else if (this.showCheckboxes) {
			this.displayedColumns = ['checkbox', ...this.columns.map(column => column.field)];
		} else {
			this.displayedColumns = [...this.columns.map(column => column.field)];
		}

		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.dataSource = new MatTableDataSource<any>(this.data);
		this.dataTableService.filterChanged.subscribe(filterValue => {
			this.filterValue = filterValue;
			this.applyFilter();
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		this.dataRows = this.data;
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;

		this.sharedService.content_delete.subscribe((response) => {
			console.log("content_delete: ", response)
			this.showActionbtn = false;
			this.showDropDownAction = false;

			const maincheckboxes = this.el.nativeElement.querySelectorAll('mat-checkbox.mat-Allcheckbox');

			if (this.checkboxes) {
				console.log('this.checkboxes', this.checkboxes);
				this.checkboxes.first.checked = true;
				// this.masterToggle(false);
				maincheckboxes[0].children[0].children[0].querySelector("input").click();
			}
		});
	}

	redirectToScheduleListPage() {
		const currentUrl = this.location.path();
		const segments = currentUrl.split('/');
		const lastSegment = segments[segments.length - 1];
		console.log('Last Segment:', lastSegment);
		if (lastSegment != 'create') {
			this.dialogRef.close(false);
			this.router.navigate(["/admin/dashboard/schedules/create"]);
		} {
			this.dialogRef.close(false);
			this.sharedService.TriggerScheduleOfSetSelectedScreen()
		}
	}

	onRowClick(row_element: any) {
		console.log('on clicked row:', row_element);
		if (row_element.contentType !== undefined) {
			this.send_selected_row.emit(row_element);
		}
	}

	masterToggle(checked: boolean) {
		console.log("masterToggle")
		this.dataRows.forEach((row) => (row.isChecked = checked));
		const allChecked = this.dataRows.every((row) => row.isChecked);

		if (allChecked) {
			this.showActionbtn = true;
			this.showDropDownAction = true;
		} else {
			this.showActionbtn = false;
			this.showDropDownAction = false;
		}
	}

	toggleRow(row: any) {
    this.selection02.toggle(row);
    this.isButtonDisabled = this.selection02.selected.length === 0;
    console.log('isButtonDisabled:', this.isButtonDisabled);
		row.isChecked = !row.isChecked;
    this.areCheckboxesChecked = this.datatableRecord.some(item => item.isChecked);
     this.updateIsAnyRowChecked();
		const trueCount = this.dataRows.filter(value => value.isChecked === true).length;
		if (trueCount > 1) {
			this.showActionbtn = true;
			this.showDropDownAction = true;
		} else {
			this.showActionbtn = false;
			this.showDropDownAction = false;
		}
		console.log('this.showDropDownAction', this.showDropDownAction);
		this.updateMasterCheckbox();
    this.checkoutButtonSelected.emit(true);

	}
 updateIsAnyRowChecked() {
    this.isAnyRowChecked = this.data.some(row => row.isChecked);
  }
	updateMasterCheckbox() {
		const selectedCheckboxes = this.checkboxes.filter((checkbox) => checkbox.checked);
		const allCheckboxes = this.checkboxes.toArray();
		const isMasterChecked = selectedCheckboxes.length === allCheckboxes.length;
		const masterCheckbox = this.checkboxes.first;
		if (masterCheckbox) {
			masterCheckbox.checked = isMasterChecked;
			masterCheckbox.indeterminate = !isMasterChecked && selectedCheckboxes.length > 0;
		}
	}

	isAllSelected() {
		const numSelected = this.selection02.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	onCopyRow(row: any) {
		console.log(`Copying row with ID ${row.id}`);
	}

	sortData(sort: MatSort) {
		console.log('sort table', sort);
		this.datatable_operation.emit(sort)
	}

	onSortClick(columnName: string) {
		this.sortedColumn = columnName;
	}

	applyFilter() {
		console.log('this.dataSource.filter', this.dataSource);
		this.dataSource.filter = this.filterValue.trim().toLowerCase();
	}

	listType(list_type: any) {
		console.log("listType: ", list_type)
		this.selected_type = list_type
		this.send_list_type.emit(this.selected_type);
		this.sharedService.setTriggerOfContentDeletion(list_type)
	}

	setSelectedRecordIDs() {
		console.log("data: ", this.data)
		this.selectAllRecordID = [];
		this.data.forEach((data) => {
			if (data.isChecked) {
				this.selectAllRecordID.push(data.id)
			}
		});
		console.log("this.selectAllRecordID: ", this.selectAllRecordID)
	}

	bulkAction(action_type: any) {
		console.log("bulkAction: ", action_type)
		this.setSelectedRecordIDs();

		let data_to_send = {
			"list_type": this.selected_type,
			"bulk_action_type": action_type,
			"selected_record_ids": this.selectAllRecordID
		}

		this.send_action_type.emit(JSON.stringify(data_to_send));
	}

  transformStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
   onCheckoutButtonSelected(event: boolean) {
    this.isButtonEnabled = false; // Enable the button when a radio button is selected
  }
}
