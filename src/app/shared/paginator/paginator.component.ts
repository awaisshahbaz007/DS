import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  @Input() length: number;
  @Input() pageSize: number;
  @Input() pageIndex: number;
  @Output() pageChange = new EventEmitter();

  constructor(public matPaginatorIntl: MatPaginatorIntl) {
    this.matPaginatorIntl.itemsPerPageLabel = 'Page Size:';
    this.matPaginatorIntl.nextPageLabel = '';
    this.matPaginatorIntl.previousPageLabel = '';
  }
}
