import {ChangeDetectorRef, Component, Inject, Pipe, View, WrappedValue, bind, bootstrap} from '@angular/core';

@Pipe({
  name: 'firebaseevent',
  pure: false
})

export class FirebaseEventPipe {
  
  constructor() {
    //this._cdRef = cdRef;
    this._cdRef;
    this._fbRef;
    this._latestValue;
    this._latestReturnedValue;
  }

  


}
