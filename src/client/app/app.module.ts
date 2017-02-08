import { ApplicationRef, NgModule } from '@angular/core';
import { AuthConnectionBackend } from './auth-connection.backend';
import { BrowserModule } from '@angular/platform-browser';
import { createInputTransfer,
         createNewHosts,
         removeNgStyles } from '@angularclass/hmr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "@angular/material";

/*
 * Platform and Environment providers/directives/pipes
 */
import { AboutComponent } from './about';
import { AdminModule } from './admin';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { ChatModule } from './chat';
import { ENV_PROVIDERS } from './environment';
import { HomeComponent } from './home';
import { LoginModule } from './login';
import { NoContentComponent } from './no-content';
import { RegisterModule } from './register';
import { ROUTES } from './app.routes';
import { XLarge } from './home/x-large';

import { SHARED_APP_DIRECTIVES } from './shared/directives';
import { SHARED_APP_SERVICES } from './shared/services';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  ...SHARED_APP_SERVICES,
  { provide: XHRBackend, useClass: AuthConnectionBackend },
  AppState
];

type StoreType = {
  disposeOldHosts: () => void,
  restoreInputValues: () => void,
  state: InternalStateType
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    ...SHARED_APP_DIRECTIVES,
    AboutComponent,
    AppComponent,
    HomeComponent,
    NoContentComponent,
    XLarge
  ],
  imports: [ // import Angular's modules
    AdminModule,
    BrowserModule,
    ChatModule,
    FormsModule,
    HttpModule,
    LoginModule,
    ReactiveFormsModule,
    RegisterModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    MaterialModule.forRoot()
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    ENV_PROVIDERS,
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
