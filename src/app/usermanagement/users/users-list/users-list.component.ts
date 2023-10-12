
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PageEvent } from '@angular/material/paginator';
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { PopupComponent } from "src/app/shared/components/popup/popup.component";
import { Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "src/app/core/service/api.service";
import { HelperService } from "src/app/core/service/helper.service";
import { SharedService } from "src/app/core/service/shared.service";

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.sass']
})

export class UsersListComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit {
	controls = [
		{
			name: 'fullName',
			label: 'First Name',
			type: 'input',
			disable: false,
			value: '',
			placeholder: 'Enter your first name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'input',
			disable: false,
			value: '',
			placeholder: 'Enter your Last name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'email',
			label: 'Email',
			disable: false,
			value: '',
			type: 'input',
			input_type: 'mail',
			placeholder: 'Enter your email address',
			click: 'focus',
			validators: [Validators.required, Validators.email]
		},
		{
			name: 'role',
			label: 'Role',
			disable: false,
			value: '',
			type: 'select',
			placeholder: 'Select your Role',
			options: [],
			validators: [Validators.required]
		},
	];

	roles: any[] = [];
	datatableRecord: any[] = [];
	search_placeholder_text = "Search User Name"

	datatableColumns = [
		{ name: 'Full Name', field: 'name', sortable: true },
		{ name: 'Email', field: 'userName', sortable: true },
		{ name: 'Role', field: 'loginProviderType', sortable: true },
		{ name: 'Joined', field: 'date', sortable: true },
	];

	datatableActions = [
		{ label: 'Edit', action: this.onEditRow.bind(this) },
		{ label: 'Delete', action: this.onDeleteRow.bind(this) },
	];

	pagination = {
		pageSize: 5,
		pageNumber: 0,
		pageSizeOptions: [5, 10, 20],
		totalPage: 0,
		sortBy: '',
		sortOrder: ''
	}

	onEditRow(row: any) {
		console.log('Edit row:', row);
		this.EditNewUser(row)
	}

	onDeleteRow(row: any) {
		this.addDeleteUser(row)
	}

	onCopyRow(row: any) {
		console.log('Copy row:', row);
	}

	constructor(
		public httpClient: HttpClient,
		public dialog: MatDialog,
		private toastr: ToastrService,
		private apiService: ApiService,
		private helperService: HelperService,
		private sharedService: SharedService,
		private snackBar: MatSnackBar
	) {
		super();
		this.sharedService.setTriggerOfSearchPlaceHolderText(this.search_placeholder_text)
	}

	ngOnInit() {
		this.getRoleList();
		// this.getUserList();
	}

	getRoleList() {
		this.apiService.getRoles().subscribe((response: any) => {
			console.log('res', response)
			this.getUserList();
			response.forEach((el: any) => {
				let data = { value: el.id, label: el.name }
				this.roles.push(data)
			})
		})
	}

	getUserList() {
		console.log("this.pagination: ", this.pagination)
		this.apiService.users('get', this.pagination).subscribe((response: any) => {
			console.log('res', response)
			this.datatableRecord = response.content
			this.datatableRecord.forEach((el: any) => {
				let datas = JSON.parse(localStorage.getItem('currentUser'));
				if (datas.id === el.id) {
					el.disable = true;
				} else {
					el.disable = false;
				}
				el.name = el.firstName + ' ' + el.lastName;
				if (el.joinedDate)
					el.date = this.helperService.formatDate(el.joinedDate)
				else
					el.date = '--'
				if (el.roles.length > 0)
					el.loginProviderType = el.roles[0].name
				else
					el.loginProviderType = ''
			})
		})
	}

	updateUserValue(user) {
		let role = ''
		if (user.roles.length > 0) {
			role = user.roles[0].id
		}
		this.controls = [{
			name: 'fullName',
			label: 'First Name',
			type: 'input',
			disable: false,
			value: user.firstName,
			placeholder: 'Enter your first name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'input',
			disable: false,
			value: user.lastName,
			placeholder: 'Enter your Last name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'email',
			label: 'Email',
			disable: true,
			value: user.userName,
			type: 'input',
			input_type: 'mail',
			placeholder: 'Enter your email address',
			click: 'focus',
			validators: [Validators.required, Validators.email]
		},
		{
			name: 'role',
			label: 'Role',
			disable: false,
			value: role,
			type: 'select',
			placeholder: 'Select your Role',
			options: this.roles,
			validators: [Validators.required]
		},
		]
	}

	AddNewUserValue() {
		this.controls = [{
			name: 'fullName',
			label: 'First Name',
			type: 'input',
			disable: false,
			value: '',
			placeholder: 'Enter your first name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'input',
			disable: false,
			value: '',
			placeholder: 'Enter your Last name',
			click: 'focus',
			input_type: 'text',
			validators: [Validators.required, Validators.minLength(3)]
		},
		{
			name: 'email',
			label: 'Email',
			disable: false,
			value: '',
			type: 'input',
			input_type: 'mail',
			placeholder: 'Enter your email address',
			click: 'focus',
			validators: [Validators.required, Validators.email]
		},
		{
			name: 'role',
			label: 'Role',
			disable: false,
			value: '4',
			type: 'select',
			placeholder: 'Select your Role',
			options: this.roles,
			validators: [Validators.required]
		},
		]
		console.log('wee', this.roles)
	}

	EditNewUser(row) {
		this.updateUserValue(row)
		let tempDirection;
		if (localStorage.getItem("isRtl") === "true") {
			tempDirection = "rtl";
		} else {
			tempDirection = "ltr";
		}
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				controls: this.controls,
				title: 'Edit User',
				value: row,
				action: "Update",
				image_url: "assets/images/image-gallery/user.png",
				type: '1'
			},
			direction: tempDirection,
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const data = {
					"id": row.id,
					"firstName": result.fullName,
					"lastName": result.lastName,
					"roleId": result.role,
					"email": result.email,
				}
				this.apiService.user('put', data).subscribe((response: any) => {
					console.log('res', response)
					this.toastr.success('Success', 'User Updated Successfully', {
						disableTimeOut: false,
						tapToDismiss: true,
						positionClass: 'toast-top-right',
						toastClass: "toast-icon custom-toast-success"
					});
					this.getUserList();
				})
			}
		});
	}

	addNewUser() {
		this.AddNewUserValue();
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				controls: this.controls,
				title: 'Add User',
				action: "Add",
				value: '',
				image_url: "assets/images/image-gallery/user.png",
				type: '1'
			},
			direction: 'ltr',
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				console.log('res', result)
				const data = {
					"firstName": result.fullName,
					"lastName": result.lastName,
					"roleId": result.role,
					"email": result.email,
				}
				this.apiService.user('post', data).subscribe((response: any) => {
					console.log('res', response)
					this.toastr.success('Success', 'Email  successfully send to the user', {
						disableTimeOut: false,
						tapToDismiss: true,
						positionClass: 'toast-top-right',
						toastClass: "toast-icon custom-toast-success"
					});
					this.getUserList();
				})
			}
		});
	}

	addDeleteUser(row) {
		let tempDirection;
		if (localStorage.getItem("isRtl") === "true") {
			tempDirection = "rtl";
		} else {
			tempDirection = "ltr";
		}
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				controls: this.controls,
				title: 'Delete Users',
				action: "Delete",
				value: '',
				content: 'Are you sure,you want to delete this User?',
				image_url: "assets/images/image-gallery/user.png",
				type: '2'
			},
			direction: tempDirection,
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.apiService.deletUser(row.id).subscribe((response: any) => {
					console.log('res', response)
					this.toastr.success('Success', 'User Deleted Successfully', {
						disableTimeOut: false,
						tapToDismiss: true,
						positionClass: 'toast-top-right',
						toastClass: "toast-icon custom-toast-success"
					});
					this.getUserList();
				})
			}
		});
	}

	onPageChange(event: PageEvent) {
		console.log('event', event)
		this.pagination = {
			pageSize: event.pageSize,
			pageNumber: event.pageIndex,
			pageSizeOptions: [5, 10, 20],
			totalPage: event.pageSize,
			sortBy: '',
			sortOrder: ''
		}
		this.getUserList();
	}
}
