import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, OnDestroy } from "@angular/core";
import { ROUTES, Setting_ROUTES } from "./sidebar-items";
import { Role } from "src/app/core/models/role";
import { MatDialog } from "@angular/material/dialog";
import { PopupComponent } from "../popup/popup.component";
import { ApiService } from "src/app/core/service/api.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
	public sidebarItems: any[];
	settting_sidebarItems = [];
	role = localStorage.getItem('role')
	level1Menu = "";
	level2Menu = "";
	level3Menu = "";
	is_setting = false;
	public innerHeight: any;
	public bodyTag: any;
	listMaxHeight: string;
	listMaxWidth: string;
	userFullName: string;
	userImg: string;
	userType: string;
	headerHeight = 60;
	currentRoute: string;
	routerObj = null;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		public elementRef: ElementRef,
		private toastr: ToastrService,
		public dialog: MatDialog,
		private apiService: ApiService,
		private router: Router
	) {
		const body = this.elementRef.nativeElement.closest("body");
		this.routerObj = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				// logic for select active menu in dropdown
				const role = ["admin", "trainer", "user"];
				const currenturl = event.url.split("?")[0];
				const firstString = currenturl.split("/").slice(1)[0];

				if (role.indexOf(firstString) !== -1) {
					this.level1Menu = event.url.split("/")[2];
					this.level2Menu = event.url.split("/")[3];
				} else {
					this.level1Menu = event.url.split("/")[1];
					this.level2Menu = event.url.split("/")[2];
				}

				// close sidebar on mobile screen after menu select
				this.renderer.removeClass(this.document.body, "overlay-open");
			}
		});
	}
	@HostListener("window:resize", ["$event"])
	windowResizecall(event) {
		this.setMenuHeight();
		this.checkStatuForResize(false);
	}
	@HostListener("document:mousedown", ["$event"])
	onGlobalClick(event): void {
		if (!this.elementRef.nativeElement.contains(event.target)) {
			this.renderer.removeClass(this.document.body, "overlay-open");
		}
	}
	callLevel1Toggle(event: any, element: any) {
		if (element === this.level1Menu) {
			this.level1Menu = "0";
		} else {
			this.level1Menu = element;
		}
		const hasClass = event.target.classList.contains("toggled");
		if (hasClass) {
			this.renderer.removeClass(event.target, "toggled");
		} else {
			this.renderer.addClass(event.target, "toggled");
		}
	}
	callLevel2Toggle(event: any, element: any) {
		if (element === this.level2Menu) {
			this.level2Menu = "0";
		} else {
			this.level2Menu = element;
		}
	}
	callLevel3Toggle(event: any, element: any) {
		if (element === this.level3Menu) {
			this.level3Menu = "0";
		} else {
			this.level3Menu = element;
		}
	}
	ngOnInit() {
		if (this.apiService.currentUserValue) {
			const userRole = 'Admin';
			this.sidebarItems = ROUTES.filter(
				(x) => x.role.indexOf(userRole) !== -1 || x.role.indexOf("All") !== -1
			);
			this.settting_sidebarItems = Setting_ROUTES.filter(
				(x) => x.role.indexOf(userRole) !== -1 || x.role.indexOf("All") !== -1
			);
			if (userRole === Role.Admin) {
				this.userType = Role.Admin;
			} else if (userRole === Role.User) {
				this.userType = Role.User;
			} else if (userRole === Role.Trainer) {
				this.userType = Role.Trainer;
			} else {
				this.userType = Role.Admin;
			}
		}

		// this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
		this.initLeftSidebar();
		this.bodyTag = this.document.body;
	}
	ngOnDestroy() {
		this.routerObj.unsubscribe();
	}
	initLeftSidebar() {
		const _this = this;
		// Set menu height
		_this.setMenuHeight();
		_this.checkStatuForResize(true);
	}
	setMenuHeight() {
		this.innerHeight = window.innerHeight;
		const height = this.innerHeight - this.headerHeight;
		this.listMaxHeight = height + "";
		this.listMaxWidth = "500px";
	}
	isOpen() {
		return this.bodyTag.classList.contains("overlay-open");
	}
	checkStatuForResize(firstTime) {
		// if (window.innerWidth < 1170) {
		//   this.renderer.addClass(this.document.body, "ls-closed");
		// } else {
		//   this.renderer.removeClass(this.document.body, "ls-closed");
		// }
	}
	mouseHover(e) {
		const body = this.elementRef.nativeElement.closest("body");
		if (body.classList.contains("submenu-closed")) {
			this.renderer.addClass(this.document.body, "side-closed-hover");
			this.renderer.removeClass(this.document.body, "submenu-closed");
		}
	}
	mouseOut(e) {
		const body = this.elementRef.nativeElement.closest("body");
		if (body.classList.contains("side-closed-hover")) {
			this.renderer.removeClass(this.document.body, "side-closed-hover");
			this.renderer.addClass(this.document.body, "submenu-closed");
		}
	}
	logout() {
		this.addDeleteUser()
	}

	addDeleteUser() {
		let tempDirection;
		if (localStorage.getItem("isRtl") === "true") {
			tempDirection = "rtl";
		} else {
			tempDirection = "ltr";
		}
		const dialogRef = this.dialog.open(PopupComponent, {
			data: {
				controls: [],
				title: 'Logout',
				action: "Logout",
				content: 'Are you sure,you want to Logout?',
				image_url: "assets/images/image-gallery/logout.jpg",
				type: '2'
			},
			direction: tempDirection,
		});
		dialogRef.afterClosed().subscribe((result) => {
			console.log('rese', result)
			if (result) {
				this.apiService.logOut().subscribe((res) => {
					this.apiService.currentUserSubject.next(null);
					localStorage.removeItem("token")
					this.toastr.success('Success', 'Logged Out', {
						disableTimeOut: false,
						tapToDismiss: true,
						positionClass: 'toast-top-right',
						toastClass: "toast-icon custom-toast-success"
					})
					this.router.navigate(["/usermanagement/signin"]);

				});
			}
		});
	}

	isActive(sidebarItem: any): boolean {
		return this.router.isActive(sidebarItem.path, true);
	}
	hoveredItem = ''
	isHovered(sidebarItem: any): boolean {
		return this.hoveredItem === sidebarItem;
	}

	getIconSrc(sidebarItem: any): string {
		if (this.isActive(sidebarItem)) {
			return sidebarItem.icon_active;
		} else if (this.isHovered(sidebarItem)) {
			return sidebarItem.icon_active;
		} else {
			return sidebarItem.icon;
		}
	}
}
