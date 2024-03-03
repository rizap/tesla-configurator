import {Component, OnInit} from '@angular/core';
import {SignalsStoreService} from "../../shared/services/signals-store.service";
import {SelectedConfig, SelectedModel} from "../../shared/models/tesla";
import {ImageViewerComponent} from "../../shared/image/image-viewer.component";
import {CurrencyFormatPipe} from "../../shared/pipes/currency-format.pipe";
import {Router} from "@angular/router";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    ImageViewerComponent,
    CurrencyFormatPipe,
    CurrencyPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  selectedModel: SelectedModel | undefined;
  selectedConfig: SelectedConfig | undefined;
  readonly ADDITIONAL_CONFIG_PRICE: number = 1000;
  totalPrice: number = 0;
  constructor(private storeService: SignalsStoreService, private router: Router) {
  }

  ngOnInit(): void {
    this.selectedModel = this.storeService.getModelData();
    this.selectedConfig = this.storeService.getConfigData();

    if (!this.selectedModel.code) {
      // back to step 1
      this.router.navigateByUrl('/model');
    } else if (!this.selectedConfig.config) {// back to step 1
      this.router.navigateByUrl('/config');
    }
    this.totalPrice = this.calculateTotal();
  }

  private calculateTotal() {
    // selected config and color
    const configPrice: number = this.selectedConfig?.config?.price || 0;
    const colorPrice: number = this.selectedModel?.color?.price || 0;

    // selected addtional options
    const yokePrice: number = this.selectedConfig?.yoke ? this.ADDITIONAL_CONFIG_PRICE : 0;
    const towHitchPrice: number = this.selectedConfig?.towHitch ? this.ADDITIONAL_CONFIG_PRICE : 0;

    return configPrice + colorPrice + yokePrice + towHitchPrice;
  }
}
