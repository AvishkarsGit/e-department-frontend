import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { verifyEmailGuardGuard } from './verify-email.guard';


describe('verifyEmailGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => verifyEmailGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
