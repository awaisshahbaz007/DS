import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { SharedService } from "src/app/core/service/shared.service";

@Injectable({
    providedIn: 'root'
})

export class HelperService {

    constructor(
		private toastr: ToastrService,
        public dialog: MatDialog,
		private sharedService: SharedService,
    ) { }

    nameFromData (combine_string: string): string {
        return combine_string.toString().includes(' | ') ? combine_string.toString().split(' | ')[0] : combine_string;
    }

    formatDate(dateString: string): string {
        const dateObj = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = dateObj.getFullYear().toString().substr(-2);
        const month = months[dateObj.getMonth()];
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        return `${day} ${month}, ${year} - ${hours}:${minutes}`;
    }

    ReplaceTextSpacesWithUnderScore(text: string): string {
        return text.replace(/\s+/g, '_');
    }

    convertSize(sizeInBytes: number): string {
        let size_in_mb = this.convertSizeToMB(sizeInBytes);
        if (size_in_mb > 950)
            return this.convertSizeToGB(sizeInBytes).toFixed(2) + " GB";

        return size_in_mb.toFixed(2) + " MB";
    }

    convertSizeToMB(sizeInBytes: number): number {
        const bytesInMB = 1024 * 1024;
        let size_in_mbs = (sizeInBytes / bytesInMB);
        return size_in_mbs;
    }

    convertSizeToGB(sizeInBytes: number): number {
        const bytesInGB = 1024 * 1024 * 1024;
        let size_in_gbs = (sizeInBytes / bytesInGB);
        return size_in_gbs;
    }

    showToasterNotifications(notifiation_type: string, notifiation_message: string) {
        if (notifiation_type == "Warning") {
            this.toastr.warning(notifiation_type, notifiation_message, {
                disableTimeOut: false,
                tapToDismiss: true,
                positionClass: 'toast-top-right',
                toastClass: "toast-icon custom-toast-success"
            })
        } else if (notifiation_type == "Error") {
            this.toastr.error(notifiation_type, notifiation_message, {
                disableTimeOut: false,
                tapToDismiss: true,
                positionClass: 'toast-top-right',
                toastClass: "toast-icon custom-toast-success"
            })
        } else {
            this.toastr.success(notifiation_type, notifiation_message, {
                disableTimeOut: false,
                tapToDismiss: true,
                positionClass: 'toast-top-right',
                toastClass: "toast-icon custom-toast-success"
            })
        }
    }

    textTransform(text: string, length: number = 20): string {
        return text.length > length ? `${text.substring(0, length)} ...` : text
    }

    isNumber(value?: string | number): boolean {
        return ((value != null) && (value !== '') && !isNaN(Number(value.toString())));
    }

    getUserSelectedLayoutId() {
        const user_selected_layout = localStorage.getItem('user_selected_layout');

        if (user_selected_layout) {
            return user_selected_layout
        }

        this.setUserSelectedLayoutId();
        return '1';
    }

    setUserSelectedLayoutId(selected_layout = '1'): void {
        localStorage.setItem('user_selected_layout', selected_layout);
    }

    saveObjectInLocatStorage(key_name, object): void {
        localStorage.setItem(key_name, JSON.stringify(object));
    }

    getObjectFromLocatStorage(key_name): any {
        return JSON.parse(localStorage.getItem(key_name))
    }

    removeObjectFromLocatStorage(key_name): void {
        localStorage.removeItem(key_name)
    }

    getDurationForPlaylistContent(content_data) {
        let duration = 5;
        if (content_data.contentType == "VIDEO") {
            duration = 10;
        }

        return duration;
    }

    loadSelectScreenPopup(selected_screens: any = []) {
        console.log("loadSelectScreenPopup: ", selected_screens)
        const popupContainer = document.querySelector('.new_schedule_body');
        if (popupContainer) {
            popupContainer.classList.add('increased_width');
        }

        const dialogRef = this.dialog.open(PopupComponent, {
            data: {
                module: 'screens',
                title: 'Screen Selection',
                SelectedScreens: selected_screens,
                showSearchbar: true,
                action: "Add Screens",
                value: '',
                type: '8',

            },
            direction: 'ltr',
        });


        dialogRef.afterClosed().subscribe((result) => {
            popupContainer.classList.remove('increased_width');
        });
    }
}
