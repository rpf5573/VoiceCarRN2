import './@types/index.d';

global.team = 0;
global.group = 'a';
global.rcUsageState = false;
global.rapiURL = () => {
  if ( global.team >= 10 ) {
    return `http://voice-car-${global.group}-${global.team}.jp.ngrok.io`;
  }
  return `http://voice-car-${global.group}-0${global.team}.jp.ngrok.io`;
}
global.serverURL = () => {
  const isDev = false;
  if ( isDev ) {
    return 'http://localhost:8080';
  }
  return `http://${global.group}.voice-car.club`;
}