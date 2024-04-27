import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { isAuthGuard } from './is-auth.guard';

describe('isAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
