import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";
import {ThemePalette} from "@angular/material/core";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatTabLink, MatTabNav, MatTabNavPanel, HeaderComponent
  ],
  templateUrl: 'app.component.html'
})
export class AppComponent {

}
