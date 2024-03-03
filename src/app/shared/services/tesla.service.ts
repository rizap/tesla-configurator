import { Injectable } from '@angular/core';
import {ConfigInformation, ModelCodeAvailable, ModelInformation} from "../models/tesla";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TeslaService {

  constructor(private httpClient: HttpClient) { }

  getModels(): Observable<ModelInformation[]> {
    return this.httpHandler<ModelInformation[]>('/models');
  }

  getOptionsByModel(model: ModelCodeAvailable): Observable<ConfigInformation> {
    return this.httpHandler<ConfigInformation>(`/options/${model}`);
  }

  private httpHandler<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(endpoint)
      .pipe(
        map((response: T) => response),
      )
  }

}
