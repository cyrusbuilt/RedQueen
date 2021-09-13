// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const config = {
  apiUri: "https://localhost:5001",
  mqttProtocol: "ws",
  mqttBrokerId: 2
};

const { apiUri, mqttProtocol, mqttBrokerId } = config as {
  apiUri: string,
  mqttProtocol: string,
  mqttBrokerId: number
};

export const environment = {
  production: false,
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
  rootUrl: `${apiUri}/api`,
  mqtt: {
    protocol: mqttProtocol,
    brokerId: mqttBrokerId
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
