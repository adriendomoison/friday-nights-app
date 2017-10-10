import {Injectable} from '@angular/core';

export enum RideType {
  GO_TO_RUTH = 0,
  GO_HOME
}

export enum UserType {
  DRIVER = 0,
  RIDER
}

@Injectable()
export class Utils {
<<<<<<< HEAD
  public rideTypeToString(rideType: RideType) {
=======
  public static rideTypeToString(rideType: RideType) {
>>>>>>> 024b317c6be982b0e3771be509c21b0f9e8e00d4
    return RideType[rideType];
  }
}
