import { Injectable } from "@angular/core";
import { InConfiguration } from "../core/models/config.interface";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  public configData: InConfiguration;

  constructor() {
    this.setConfigData();
  }

  setConfigData() {
    this.configData = {
      layout: {
        rtl: false, // options:  true & false
        variant: "dark", // options:  light & dark
        theme_color: "dark", // options:  white, black, purple, blue, cyan, green, orange
        logo_bg_color: "dark", // options:  white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: "light", // options:  light & dark
        },
      },
    };
  }
}
