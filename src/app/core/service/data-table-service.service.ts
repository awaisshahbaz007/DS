import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTableServiceService {
  filterValue: string = '';
  filterChanged = new EventEmitter<string>();

  constructor() { }
}
