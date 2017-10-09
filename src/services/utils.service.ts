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
  public static rideTypeToString(rideType: RideType) {
    return RideType[rideType];
  }
}
