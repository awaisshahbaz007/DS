import { NgModule } from "@angular/core";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { fakeBackendProvider } from "./core/interceptor/fake-backend";
import { ErrorInterceptor } from "./core/interceptor/error.interceptor";
import { JwtInterceptor } from "./core/interceptor/jwt.interceptor";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ClickOutsideModule } from "ng-click-outside";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';

import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { PageLoaderComponent } from "./shared/components/page-loader/page-loader.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { OpenDiagDirective } from "./shared/directive/open-diag.directive";
import { ComponentsModule } from "./shared/components/components.module";
import { CustomToastComponent } from "./shared/components/custom-toast/custom-toast.component";
import { ContentModuleModule } from "./admin/dashboard/content-module/content-module.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PageLoaderComponent,
        SidebarComponent,
        OpenDiagDirective,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ComponentsModule,

        PerfectScrollbarModule,
        ClickOutsideModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        ToastrModule.forRoot({
          toastComponent: CustomToastComponent,
          closeButton: true,
          positionClass: 'toast-top-right',
          newestOnTop: false,
          timeOut: 3000, // Duration in milliseconds (3 seconds)

        }),
        LoadingBarRouterModule,
        // core & shared
        CoreModule,
        SharedModule,
        ContentModuleModule
    ],
    entryComponents: [CustomToastComponent],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
