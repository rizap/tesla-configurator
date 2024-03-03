import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SignalsStoreService} from "../../shared/services/signals-store.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TeslaService} from "../../shared/services/tesla.service";
import {Config, ConfigInformation, ModelCodeAvailable, SelectedConfig} from "../../shared/models/tesla";
import {distinctUntilChanged, Subscription, takeUntil, throttleTime} from "rxjs";
import {CarFinderService} from "../../shared/utilities/car-finder.service";
import {ImageViewerComponent} from "../../shared/image/image-viewer.component";
import {Router} from "@angular/router";
import {CurrencyFormatPipe} from "../../shared/pipes/currency-format.pipe";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImageViewerComponent,
    CurrencyFormatPipe
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit, OnDestroy {
  configForm: FormGroup = this.formBuilder.group({
    currentConfig: new FormControl<number>(this.storeService?.getConfigData()?.config?.id)
  })

  selectedModel: ModelCodeAvailable | undefined;
  configInfo: ConfigInformation | undefined;
  selectedConfig: Config | undefined;
  subscription = new Subscription();
  imagePath: string | undefined;
  constructor(private storeService: SignalsStoreService, private formBuilder: FormBuilder,
              private teslaService: TeslaService, private router: Router,
              private carFinderService: CarFinderService, private changeDetectRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    if (this.storeService.getModelData().code) {
      this.selectedModel = this.storeService.getModelData().code;
      this.imagePath = this.storeService.getModelData().imagePath;
    } else {
      // if empty // route back to step 1.
      this.router.navigateByUrl('/model');
    }

    this.loadConfig();
  }

  private loadConfig() {
    this.teslaService.getOptionsByModel(this.selectedModel!).subscribe(info =>  {
      this.configInfo = info;
      this.setFormValues();
      if (this.storeService.getConfigData().config?.id) {
        this.setSelectedConfig('' + this.storeService.getConfigData().config.id);
        this.updateStore();
      }
    });
  }

  // set form values and dynamically add tow and yoke form control depends on the model selected
  // current selected config will be pre-selected when user navigates back to this page.
  private setFormValues() {
    if (this.configInfo?.towHitch) {
      this.configForm.addControl('includeTow', new FormControl(this.storeService.getConfigData().towHitch));

      this.subscription.add(this.configForm.get('includeTow')?.valueChanges.pipe(distinctUntilChanged(),
        throttleTime(500)).subscribe((value: boolean) => {
        console.log('includeTow sub');
        this.updateStore();
      }));
    } else {
      this.configForm.removeControl('includeTow');
    }

    if (this.configInfo?.towHitch) {
      this.configForm.addControl('includeYoke', new FormControl(this.storeService.getConfigData().yoke));

      this.subscription.add(this.configForm.get('includeYoke')?.valueChanges.pipe(distinctUntilChanged(),
        throttleTime(500)).subscribe((value: boolean) => {
        console.log('includeYoke sub');
        this.updateStore();
      }));
    } else {
      this.configForm.removeControl('includeYoke');
    }

    this.subscription.add(this.configForm.get('currentConfig')?.valueChanges.pipe(distinctUntilChanged(),
      throttleTime(500)).subscribe((config: string) => {
      if (config) {
        this.setSelectedConfig(config);
      } else {
        this.selectedConfig = undefined;
        this.configForm.reset();
      }
      console.log('current config sub');
      this.updateStore();
    }));
    this.changeDetectRef.markForCheck();
  }
  private setSelectedConfig(config: string) {
    this.selectedConfig = this.carFinderService.findOptionsByConfig(parseInt(config), this.configInfo?.configs);
  }

  updateStore() {
    console.log(this.selectedConfig);
    const model: SelectedConfig = {
      config: this.selectedConfig!,
      towHitch: this.configForm.get('includeTow')?.value,
      yoke: this.configForm.get('includeYoke')?.value
    }
    console.log(model);
    this.storeService.setConfigData(model);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
