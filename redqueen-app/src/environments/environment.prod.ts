const config = {
  apiUri: "http://192.168.0.104:3000",
  mqttProtocol: "ws",
  mqttBrokerId: 1
};

const { apiUri, mqttProtocol, mqttBrokerId } = config as {
  apiUri: string,
  mqttProtocol: string,
  mqttBrokerId: number
};

export const environment = {
  appVersion: require('package.json').version,
  production: true,
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
  rootUrl: `${apiUri}/api`,
  mqtt: {
    protocol: mqttProtocol,
    brokerId: mqttBrokerId
  }
};
