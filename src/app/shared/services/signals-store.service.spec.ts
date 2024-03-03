import { TestBed } from '@angular/core/testing';

import { SignalsStoreService } from './signals-store.service';
import {ConfiguratorState} from "../../core/configurator.state";

describe('SignalsSimpleStoreService', () => {
  let service: SignalsStoreService<ConfiguratorState>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
