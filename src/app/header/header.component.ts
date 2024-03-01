import { Component } from '@angular/core';
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";
import {ThemePalette} from "@angular/material/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  name = 'Angular';
  readonly routes = [{label: 'Step 1', link: '/model'}, {label: 'Step 2', link: '/config'}, {label: 'Step 3', link: '/summary'}];
  activeLink = this.routes[0].link;
  background: ThemePalette = undefined;
}
