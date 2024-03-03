import {Injectable, signal} from '@angular/core';
import {SelectedConfig, SelectedModel} from "../models/tesla";


@Injectable({
  providedIn: 'root'
})
export class SignalsStoreService {
  readonly selectedModel = signal({} as SelectedModel)
  readonly selectedConfig = signal({} as SelectedConfig)
  constructor() { }

  setModelData(val: SelectedModel) {
    this.selectedModel.set(val);
  }

  getModelData(): SelectedModel {
    return this.selectedModel();
  }

  setConfigData(val: SelectedConfig) {
    this.selectedConfig.set(val);
  }

  getConfigData(): SelectedConfig {
    return this.selectedConfig();
  }
}
