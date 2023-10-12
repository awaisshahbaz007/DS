import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
	selector: 'app-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.sass']
})

export class PaginatorComponent {
	@Input() totalItems: number;
	@Input() pageSize: number;
	@Input() pageSizeOptions: number[];

	@Output() pageChange = new EventEmitter<PageEvent>();
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(public matPaginatorIntl: MatPaginatorIntl) {
		this.matPaginatorIntl.itemsPerPageLabel = 'Items per page:';
		this.matPaginatorIntl.nextPageLabel = '';
		this.matPaginatorIntl.previousPageLabel = '';
	}

	onPageChange(event: PageEvent) {
		this.pageChange.emit(event);
	}
}
