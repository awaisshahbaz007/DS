import { Component } from "@angular/core";
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { environment } from "src/environments/environment";

declare var PMW: any;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})

export class AppComponent {
    currentUrl: string;
    isNotSearchbar: boolean;
    toastRef;

    constructor(public _router: Router, location: PlatformLocation) {
        // console.log('gymName', localStorage.getItem("lang"))
        localStorage.setItem('choose_logoheader', 'logo-white')
        localStorage.setItem('menuOption', 'menu_light')
        localStorage.setItem('choose_skin', 'theme-white')
        localStorage.setItem('theme', 'light')

        if (localStorage.getItem("lang") === null) {
            localStorage.setItem("lang", 'en');
        }

        this._router.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationStart) {
                this.isNotSearchbar = routerEvent.url.toString().includes('playlist/create') || routerEvent.url.toString().includes('playlist/edit');
                this.currentUrl = routerEvent.url.substring(
                    routerEvent.url.lastIndexOf("/") + 1
                );
            }

            if (routerEvent instanceof NavigationEnd) {
            }
            window.scrollTo(0, 0);
        });
    }

    openEditor() {
        PMW.plugin.editor.open();
    }
    checkUserActive() {
        if (localStorage.getItem("currentUser")) {
            return true
        } else {
            return false
        }
    }

}
