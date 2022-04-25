import checkStatus from './requests/checkStatus.js';
import getLocalDevices from './requests/getLocalDevices.js';
import authHue from './requests/authHue.js';
import user from './requests/user.js';
import lights from './requests/lights.js';
import turnOnLight from './requests/turnOnLight.js';
import turnOffLight from './requests/turnOffLight.js';
import turnOffAllLights from './requests/turnOffAllLights.js';
import turnOnAllLights from './requests/turnOnAllLights.js';
import lightsChange from './requests/lightsChange.js';

export default function(app) {
  const path = '/hueApi/';

  //get requests
  app.get(path + 'checkStatus', checkStatus);
  app.get(path + 'lights', lights);
  app.get(path + 'turnOnLight', turnOnLight);
  app.get(path + 'turnOffLight', turnOffLight);
  app.get(path + 'turnOffAllLights', turnOffAllLights);
  app.get(path + 'turnOnAllLights', turnOnAllLights);

  //post requests
  app.post(path + 'getLocalDevices', getLocalDevices);
  app.post(path + 'authHue', authHue);
  app.post(path + 'user', user);
  app.post(path + 'lightsChange', lightsChange);
}