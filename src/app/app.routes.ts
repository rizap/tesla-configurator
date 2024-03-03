import { Routes } from '@angular/router';
import {ModelComponent} from "./steps/model/model.component";
import {ConfigComponent} from "./steps/config/config.component";
import {SummaryComponent} from "./steps/summary/summary.component";

export const routes: Routes = [
  {path: 'model', component: ModelComponent},
  {path: 'config', component: ConfigComponent},
  {path: 'summary', component: SummaryComponent},
  { path: '**', component: ModelComponent }];
