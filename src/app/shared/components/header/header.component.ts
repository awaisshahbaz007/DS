import { DOCUMENT, Location } from "@angular/common";
import { Component, Inject, ElementRef, OnInit, Renderer2, AfterViewInit, HostListener } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from "@angular/router";
import { ConfigService } from "src/app/config/config.service";
import { RightSidebarService } from "src/app/core/service/rightsidebar.service";
import { LanguageService } from "src/app/core/service/language.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/core/service/api.service";
import { ApiScreenService } from "src/app/core/service/api-screen.service";
import { ApiPlaylistService } from "src/app/core/service/api-playlist.service";
import { DataTableServiceService } from "src/app/core/service/data-table-service.service";
import { PopupComponent } from "../popup/popup.component";
import { SharedService } from 'src/app/core/service/shared.service';
import { HelperService } from 'src/app/core/service/helper.service';
import Swal from 'sweetalert2'

const document: any = window.document;

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
})

export class HeaderComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit, AfterViewInit {
  isButtonDisabled: boolean = true;

	selectedBgColor = "white";
	isDarTheme = false;
	isDarkSidebar = false;
	isContentModuel: boolean;
	isplaylistModuel: boolean;
	isNewplaylist: boolean;
	islayoutComponent: boolean;
	isMobileScreenSize: boolean;
	isSchedules: boolean;
	isNewSchedules: boolean;
	isEditSchedules: boolean;
	isScreenModule: boolean;
  isPaircodeModule: boolean;
	isOrientationScreen: boolean;
	public config: any = {};
	userImg: string;
	userName: string;
	homePage: string;
	isNavbarCollapsed = true;
	flagvalue;
	countryName;
	langStoreValue: string;
	defaultFlag: string;
	isOpenSidebar: boolean;
	notifications: any[] = []
	mobile_screen = false;
  disbaledscreenbtn = false;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		public elementRef: ElementRef,
		private rightSidebarService: RightSidebarService,
		private configService: ConfigService,
		private apiScreenService: ApiScreenService,
		private apiService: ApiService,
		private router: Router,
		public languageService: LanguageService,
		private dataTableService: DataTableServiceService,
		public dialog: MatDialog,
		private sharedService: SharedService,
		private helperService: HelperService,
		private apiPlaylistService: ApiPlaylistService,
		private location: Location,
	) {
		super();
    this.sharedService.isButtonDisabled$.subscribe(isDisabled => {
    this.isButtonDisabled = isDisabled; // Assign this property to your button's disabled property
  });
	}

	listLang = [
		{ text: "English", flag: "assets/images/flags/us.svg", lang: "en" },
		{ text: "Spanish", flag: "assets/images/flags/spain.svg", lang: "es" },
		{ text: "German", flag: "assets/images/flags/germany.svg", lang: "de" },
	];


	ngOnInit() {
		this.mobile_screen = true;
		this.config = this.configService.configData;
		this.isMobileScreenSize = window.innerWidth <= 992;
		if (this.apiService.currentUserValue) {
			this.userName = this.apiService.currentUserValue.firstName;
		}
		this.userImg = 'assets/images/user/admin.jpg';

		this.langStoreValue = localStorage.getItem("lang");
		const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
		this.countryName = val.map((element) => element.text);
		if (val.length === 0) {
			if (this.flagvalue === undefined) {
				this.defaultFlag = "assets/images/flags/us.svg";
			}
		} else {
			this.flagvalue = val.map((element) => element.flag);
		}


		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.isContentModuel = event.url.toString().includes('content-module');
				this.isplaylistModuel = event.url.toString().includes('playlist');
				this.isNewplaylist = event.url.toString().includes('create') || event.url.toString().includes('edit');
				this.islayoutComponent = event.url.toString().includes('layout');
				this.isSchedules = event.url.toString().includes('schedules');
				this.isNewSchedules = event.url.toString().includes('create');
				this.isEditSchedules = event.url.toString().includes('edit');
				this.isScreenModule = event.url.toString().includes('screens');
        this.isPaircodeModule = event.url.toString().includes('pair_code');
				this.isOrientationScreen = event.url.toString().includes('screen_orientation');
				if (this.isNewSchedules) {
					this.renderer.addClass(this.document.body, "new_schedule_body");
				} else {
					// this.renderer.addClass(this.document.body, "");
				}
			}
		});

     this.sharedService.keyup_location_screens.subscribe(
          (value) => {
            if(value){
              this.disbaledscreenbtn = true;
            } else{
              this.disbaledscreenbtn = false;
            }
          }
        )
	}

	ngAfterViewInit() {
		// set theme on startup
		if (localStorage.getItem("theme")) {
			this.renderer.removeClass(this.document.body, this.config.layout.variant);
			this.renderer.addClass(this.document.body, localStorage.getItem("theme"));
		} else {
			this.renderer.addClass(this.document.body, this.config.layout.variant);
		}

		if (localStorage.getItem("menuOption")) {
			this.renderer.addClass(
				this.document.body,
				localStorage.getItem("menuOption")
			);
		} else {
			this.renderer.addClass(
				this.document.body,
				"menu_" + this.config.layout.sidebar.backgroundColor
			);
		}

		if (localStorage.getItem("choose_logoheader")) {
			this.renderer.addClass(
				this.document.body,
				localStorage.getItem("choose_logoheader")
			);
		} else {
			this.renderer.addClass(
				this.document.body,
				"logo-" + this.config.layout.logo_bg_color
			);
		}

		if (localStorage.getItem("sidebar_status")) {
			if (localStorage.getItem("sidebar_status") === "close") {
				this.renderer.addClass(this.document.body, "side-closed");
				this.renderer.addClass(this.document.body, "submenu-closed");
			} else {
				this.renderer.removeClass(this.document.body, "side-closed");
				this.renderer.removeClass(this.document.body, "submenu-closed");
			}
		} else {
			if (this.config.layout.sidebar.collapsed === true) {
				this.renderer.addClass(this.document.body, "side-closed");
				this.renderer.addClass(this.document.body, "submenu-closed");
			}
		}
		if (localStorage.getItem("theme")) {
			if (localStorage.getItem("theme") === "dark") {
				this.isDarTheme = true;
			} else if (localStorage.getItem("theme") === "light") {
				this.isDarTheme = false;
			} else {
				this.isDarTheme = this.config.layout.variant === "dark" ? true : false;
			}
		} else {
			this.isDarTheme = this.config.layout.variant === "dark" ? true : false;
		}


	}

	callFullscreen() {
		if (
			!document.fullscreenElement &&
			!document.mozFullScreenElement &&
			!document.webkitFullscreenElement &&
			!document.msFullscreenElement
		) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}

	setLanguage(text: string, lang: string, flag: string) {
		this.countryName = text;
		this.flagvalue = flag;
		this.langStoreValue = lang;
		this.languageService.setLanguage(lang);
	}

	onCheck() {
		console.log('check mobile_screen', this.mobile_screen)
		return this.mobile_screen != this.mobile_screen
	}

	mobileMenuSidebarOpen(event: any, className: string) {
		const hasClass = event.target.classList.contains(className);
		if (hasClass) {
			this.renderer.removeClass(this.document.body, className);
		} else {
			this.renderer.addClass(this.document.body, className);
		}
	}

	callSidemenuCollapse() {
		const hasClass = this.document.body.classList.contains("side-closed");
		if (hasClass) {
			this.mobile_screen = true;
			this.renderer.removeClass(this.document.body, "side-closed");
			this.renderer.removeClass(this.document.body, "submenu-closed");
		} else {
			this.mobile_screen = false;
			this.renderer.addClass(this.document.body, "side-closed");
			this.renderer.addClass(this.document.body, "submenu-closed");
		}
	}

	logout() {
		this.subs.sink = this.apiService.logOut().subscribe((res) => {
			if (!res.success) {
				this.router.navigate(["/usermanagement/signin"]);
			}
		});
	}

	CreatePlaylist() {
		this.router.navigate(["/admin/dashboard/playlist/create"]);
	}

	addScreen() {
		this.router.navigate(["/admin/dashboard/screens/pair_code"]);
	}

	addSaveScreen() {
		let screen_object = this.sharedService.getScreenRecordToSave();

		if (!screen_object.id) {
			this.helperService.showToasterNotifications('warning', 'Please provide screen id')
			return
		}
		if (!screen_object.name) {
			this.helperService.showToasterNotifications('warning', 'Please provide screen name')
			return
		}
		if (!screen_object.orientation) {
			this.helperService.showToasterNotifications('warning', 'Please select screen orientation')
			return
		}
		if (!screen_object.placedAt) {
      this.helperService.showToasterNotifications('warning', 'Please provide Location Name')
			return
		}

		this.apiScreenService.putScreenSave(screen_object).subscribe((response: any) => {
			console.log("putScreenSave response: ", response)
			if (response && response.id) {
				this.router.navigate(["/admin/dashboard/screens"]);
			}
		});
	}

	PreviewPlaylist() {
		this.sharedService.TriggerPlaylistOfSelectedScreen(true);
	}

	createNewSchedule() {
		console.log("createNewSchedule this.mobile_screen: ", this.mobile_screen)
		if (this.mobile_screen) {
			this.helperService.loadSelectScreenPopup()
			setTimeout(() => {
				this.sharedService.setTriggerOfPopupSearchPlaceHolderText("Search for screens")
				this.sharedService.setModuleSearchType('screens')
			}, 500);
		} else {
			this.sharedService.setModuleSearchType('schedule')
			const popupContainer = document.querySelector('.menu_light');
			if (popupContainer) {
				popupContainer.classList.add('increased_width');
			}
			const dialogRef = this.dialog.open(PopupComponent, {
				data: {
					module: 'screens',
					title: 'Screen Selection',
					showSearchbar: false,
					action: "Save",
					value: '',
					type: '10'
				},
				direction: 'ltr',
			});
			dialogRef.afterClosed().subscribe((result) => {
				popupContainer.classList.remove('increased_width');
			});
		}
	}

	lightThemeBtnClick() {
		this.renderer.removeClass(this.document.body, "dark");
		this.renderer.removeClass(this.document.body, "submenu-closed");
		this.renderer.removeClass(this.document.body, "menu_dark");
		this.renderer.removeClass(this.document.body, "logo-black");
		if (localStorage.getItem("choose_skin")) {
			this.renderer.removeClass(
				this.document.body,
				localStorage.getItem("choose_skin")
			);
		} else {
			this.renderer.removeClass(
				this.document.body,
				"theme-" + this.config.layout.theme_color
			);
		}

		this.renderer.addClass(this.document.body, "light");
		this.renderer.addClass(this.document.body, "submenu-closed");
		this.renderer.addClass(this.document.body, "menu_light");
		this.renderer.addClass(this.document.body, "logo-white");
		this.renderer.addClass(this.document.body, "theme-white");
		const theme = "light";
		const menuOption = "menu_light";
		this.selectedBgColor = "white";
		this.isDarkSidebar = false;
		localStorage.setItem("choose_logoheader", "logo-white");
		localStorage.setItem("choose_skin", "theme-white");
		localStorage.setItem("theme", theme);
		localStorage.setItem("menuOption", menuOption);
	}

	darkThemeBtnClick() {
		this.renderer.removeClass(this.document.body, "light");
		this.renderer.removeClass(this.document.body, "submenu-closed");
		this.renderer.removeClass(this.document.body, "menu_light");
		this.renderer.removeClass(this.document.body, "logo-white");
		if (localStorage.getItem("choose_skin")) {
			this.renderer.removeClass(
				this.document.body,
				localStorage.getItem("choose_skin")
			);
		} else {
			this.renderer.removeClass(
				this.document.body,
				"theme-" + this.config.layout.theme_color
			);
		}
		this.renderer.addClass(this.document.body, "dark");
		this.renderer.addClass(this.document.body, "submenu-closed");
		this.renderer.addClass(this.document.body, "menu_dark");
		this.renderer.addClass(this.document.body, "logo-black");
		this.renderer.addClass(this.document.body, "theme-black");
		const theme = "dark";
		const menuOption = "menu_dark";
		this.selectedBgColor = "black";
		this.isDarkSidebar = true;
		localStorage.setItem("choose_logoheader", "logo-black");
		localStorage.setItem("choose_skin", "theme-black");
		localStorage.setItem("theme", theme);
		localStorage.setItem("menuOption", menuOption);
	}

	@HostListener('window:resize', ['$event'])
	@HostListener('window:load', ['$event'])
	onResize(event: any) {
		this.isMobileScreenSize = window.innerWidth <= 1200;
		if (this.isMobileScreenSize) {
			this.mobile_screen = false;
			this.renderer.addClass(this.document.body, "side-closed");
			this.renderer.addClass(this.document.body, "submenu-closed");
		} else {
			this.mobile_screen = true;
			this.renderer.removeClass(this.document.body, "side-closed");
			this.renderer.removeClass(this.document.body, "submenu-closed");
		}
	}

	receiveUploadFileStatus(status: boolean) {
		console.log("Header receiveUploadFileStatus: ", status)
		const urlSegments = this.router.url.split('/');
		const lastSegment = urlSegments[urlSegments.length - 1];

		// refresh table on content page
		if (lastSegment == "content-module" || lastSegment == "Content" || lastSegment == "Folder") {
			this.sharedService.setTriggerOfFileUpload("File Uploaded");
			return;
		}

		const SecondLastSegment = urlSegments[urlSegments.length - 2];
		// refresh table on folder details page
		if (SecondLastSegment == "folder" && this.helperService.isNumber(lastSegment)) {
			this.sharedService.setTriggerOfFileUpload("Refresh Folder Details Page");
		}

	}

	SavePlaylist(event: Event) {
		const playlist_data = this.helperService.getObjectFromLocatStorage('playlist_object')
		console.log("playlist_data: ", playlist_data)

		if (playlist_data == undefined) {
			this.helperService.showToasterNotifications('warning', 'Provide the details to create PlayList');
			return;
		}

		if (playlist_data.id != undefined) {
			this.apiPlaylistService.putPlaylistUpdate(playlist_data).subscribe((response: any) => {
				console.log("postPlaylistUpdate response: ", response)
				this.helperService.removeObjectFromLocatStorage('playlist_object')

				this.helperService.showToasterNotifications('success', 'PlayList updated Successfully');
				this.router.navigate(["/admin/dashboard/playlist"]);
			});

		} else {
			this.apiPlaylistService.postPlaylistCreate(playlist_data).subscribe((response: any) => {
				console.log("postPlaylistCreate response: ", response)
				this.helperService.removeObjectFromLocatStorage('playlist_object')

				this.helperService.showToasterNotifications('success', 'PlayList created Successfully');
				this.router.navigate(["/admin/dashboard/playlist"]);
			});
		}
	}

	onClickSaveLayoutBtn() {
		console.log("onClickSaveLayoutBtn: ")
		let temp_layout_id = this.sharedService.getTempLayoutID();
		let user_selected_layout_id = this.helperService.getUserSelectedLayoutId();
		console.log("user_selected_layout_id: ", user_selected_layout_id)
		console.log("temp_layout_id: ", temp_layout_id)

		if (temp_layout_id != user_selected_layout_id) {
            console.log("layout is not same")
            let playlist_data = this.helperService.getObjectFromLocatStorage('playlist_object');
            if (playlist_data) {

                Swal.fire({
                    title: 'Are you sure?',
                    text: "If you continue to change the layout, you will lost the save playlist!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Changed it!'
                }).then((result) => {
                    if (result.isConfirmed) {

						this.helperService.removeObjectFromLocatStorage('playlist_object')
						this.helperService.setUserSelectedLayoutId(temp_layout_id);

						Swal.fire(
                            'Layout changed!',
                            'Layout changed and playlist reset.',
                            'success'
                        )
						this.location.back();
                    }
                })
            } else {
				this.helperService.setUserSelectedLayoutId(temp_layout_id);
				this.location.back();
			}
        }

	}
}
