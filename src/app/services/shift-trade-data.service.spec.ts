import { TestBed, inject } from '@angular/core/testing';

import { ShiftTradeDataService } from './shift-trade-data.service';

describe('ShiftTradeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShiftTradeDataService]
    });
  });

  it('should be created', inject([ShiftTradeDataService], (service: ShiftTradeDataService) => {
    expect(service).toBeTruthy();
  }));
});
