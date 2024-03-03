import { Injectable } from '@angular/core';
import {Color, Config, ModelInformation} from "../models/tesla";

@Injectable({
  providedIn: 'root'
})
export class CarFinderService {

  constructor() { }

  findByModel<T extends ModelInformation>(currentValue: string, array?: T[] | null): T | undefined {
    return array?.find((model: T) => model.code === currentValue);
  }

  findOptionsByConfig<T extends Config>(currentValue: number, array?: T[] | null): T | undefined {
    return array?.find((model: T) => model.id === currentValue);
  }

  findCurrentColor<T extends Color>(currentCode: string, array?: T[] | null): T | undefined {
    return array?.find((color: Color) => color.code === currentCode);
  }
}
