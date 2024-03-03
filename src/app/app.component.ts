import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatTabLink, MatTabNav, MatTabNavPanel, HeaderComponent],
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
