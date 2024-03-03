import {ChangeDetectorRef, Component, effect, OnDestroy, OnInit} from '@angular/core';
import {SignalsStoreService} from "../../shared/services/signals-store.service";
import {MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {TeslaService} from "../../shared/services/tesla.service";
import {Color, ModelInformation, SelectedModel} from "../../shared/models/tesla";
import {distinctUntilChanged, Subscription, throttleTime} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {ImageViewerComponent} from "../../shared/image/image-viewer.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CarFinderService} from "../../shared/utilities/car-finder.service";

@Component({
  selector: 'app-car-models',
  standalone: true,
  imports: [
    MatSelect,
    MatLabel,
    MatOption,
    AsyncPipe,
    ImageViewerComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss'
})
export class ModelComponent implements OnInit, OnDestroy {

  readonly IMAGE_URL = 'https://interstate21.com/tesla-app/images/';
  models: ModelInformation[] | undefined;
  modelColors: Color[] | undefined;
  modelForm: FormGroup = this.formBuilder.group({
    currentModel: new FormControl<string>(''),
    currentColor: new FormControl(''),
    imagePath: new FormControl<string>('')
  })

  modelInfo: ModelInformation | undefined;
  colorInfo: Color | undefined;
  subscription = new Subscription();
  constructor(private store: SignalsStoreService, private teslaService: TeslaService,
              private formBuilder: FormBuilder, private carFinderService: CarFinderService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    if (this.store.getModelData().color && this.store.getModelData().code) {
      // load current selected data if user goes back to step 1
      this.loadModels(false);
      this.modelForm.get('currentModel')?.setValue(this.store.getModelData().code);
      this.modelForm.get('currentColor')?.setValue(this.store.getModelData().color?.code);
      this.modelForm.get('imagePath')?.setValue(this.store.getModelData().imagePath);
      this.changeDetectorRef.markForCheck();
    } else {
      this.loadModels(true);
    }

    this.subscription.add(this.modelForm.controls['currentModel']?.valueChanges.pipe(distinctUntilChanged(),
      throttleTime(500)).subscribe((modelValue: string) => {
        console.log('current model');
      this.modelForm.controls['currentColor'].reset();
      if (modelValue) {
        this.setSelectedModel(modelValue);
      } else {
        this.modelInfo = undefined;
        this.modelForm.reset();
        this.modelColors = [];
        this.modelForm.controls['currentColor'].disable();
        this.updateStore();
      }
    }));

    this.subscription.add(this.modelForm.get('currentColor')?.valueChanges.pipe(distinctUntilChanged(),
      throttleTime(500)).subscribe(selectedColor => {
      console.log('selected color: ', selectedColor);
        if (selectedColor) {
          this.colorInfo = this.carFinderService.findCurrentColor(selectedColor, this.modelColors);
          this.setImagePath();
        } else {
          this.modelForm.controls['imagePath'].reset();
        }
      }));
    }

    setSelectedModel(selectedModel: string) {
      this.modelInfo = this.carFinderService.findByModel(selectedModel, this.models)

      if (this.modelInfo) {
        this.modelColors = this.modelInfo.colors;
        this.modelForm.controls['currentColor'].enable();
      }
    }
  setImagePath(){
    console.log('setting image');
    console.log('this.modelForm.get(\'currentColor\')?.value:', this.modelForm.get('currentColor')?.value);
    this.modelForm.controls['imagePath'].setValue(this.IMAGE_URL + this.modelForm.get('currentModel')?.value
      + '/' + this.modelForm.get('currentColor')?.value + '.jpg');
    this.updateStore();
  }
  updateStore() {
    const model: SelectedModel = {
      code: this.modelInfo?.code!,
      description: this.modelInfo?.description!,
      color: this.colorInfo!,
      imagePath: this.modelForm.get('imagePath')?.value
    }
    this.store.setModelData(model);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private loadModels(isColorDisabled: boolean) {
    this.teslaService.getModels().subscribe(list =>  {
      this.models = list;
      if (isColorDisabled) {
        this.modelForm.controls['currentColor'].disable();
      } else {
        // load existing colors
        this.setSelectedModel(this.modelForm.get('currentModel')?.value);
      }
      this.changeDetectorRef.markForCheck();
    });
  }
}
