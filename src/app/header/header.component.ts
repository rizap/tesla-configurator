import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input} from '@angular/core';
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";
import {ThemePalette} from "@angular/material/core";
import {RouterLink} from "@angular/router";
import {SignalsStoreService} from "../shared/services/signals-store.service";
import {NavRouteModel} from "./nav-route.model";

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
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() tabPanel: MatTabNavPanel | undefined;
  name = 'Angular';
  routes: NavRouteModel []= [{id: 'step1', label: 'Step 1', link: '/model', disabled: false},
    {id: 'step2', label: 'Step 2', link: '/config', disabled: true},
    {id: 'step3', label: 'Step 3', link: '/summary', disabled: true}];
  activeLink = this.routes[0].link;
  background: ThemePalette = undefined;

  constructor(private store: SignalsStoreService, private changeDetectRef: ChangeDetectorRef) {
    effect(() => {
      if (this.store.getModelData().color && this.store.getModelData().code) {
        this.updateRouting(this.routes[1].id, false);
      } else {
        this.updateRouting(this.routes[1].id, true);
      }

      if (this.store.getModelData().code && this.store.getConfigData().config) {
        this.updateRouting(this.routes[2].id, false);
      } else {
        this.updateRouting(this.routes[2].id, true);
      }
    });
  }

  private updateRouting(current: string, disabled: boolean) {
    const index = this.routes.findIndex(r => r.id === current);
    this.routes[index].disabled = disabled;
    this.changeDetectRef.markForCheck();
  }
}
