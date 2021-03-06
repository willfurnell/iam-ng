import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, NavigationEnd, NavigationStart, RouterEvent, NavigationCancel, NavigationError } from '@angular/router';
import { of, Observable } from 'rxjs';
import { LoadingService } from './utils/loading/loading.service';
import { RouterTestingModule } from '@angular/router/testing';

interface RouterEventTemplate {
  events: Observable<RouterEvent>;
}

describe('AppComponent', () => {
  let ls;
  const mockRouter: RouterEventTemplate = {
    events: of(new NavigationEnd(0, '', ''))
  };

  beforeEach(async(() => {
    ls = jasmine.createSpyObj(['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        RouterTestingModule.withRoutes([{}])
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AppComponent,
        { provide: Router, useValue: mockRouter },
        { provide: LoadingService, useValue: ls}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show loading bar when navigating', () => {
    mockRouter.events = of(new NavigationStart(0, ''));
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(ls.show).toHaveBeenCalled();
  });

  it('should hide loading bar when navigating', () => {
    mockRouter.events = of(new NavigationEnd(0, '', ''));
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(ls.hide).toHaveBeenCalled();

    mockRouter.events = of(new NavigationCancel(0, '', ''));
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(ls.hide).toHaveBeenCalled();

    mockRouter.events = of(new NavigationError(0, '', ''));
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(ls.hide).toHaveBeenCalled();
  });

});
