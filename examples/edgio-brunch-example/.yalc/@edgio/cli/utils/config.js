"use strict";

const Conf = require('conf');

const authConfig = new Conf({
  configName: 'auth',
  projectName: 'edgio'
});

const authTokenKey = apiUrl => `auth.${apiUrl}`;

exports.getApiKey = apiUrl => {
  const apiKey = authConfig.get(authTokenKey(apiUrl));

  if (apiKey) {
    return apiKey;
  } // apiUrl used to default to app.edgio.co and is now set to api.edgio.co
  // So users wouldn't have to log in again when upgrading CLI we check if
  // there's an existing key for app.edgio.co and write the value
  // to api.edgio.co for future use, deleting the old one.


  const legacyAppTokenKey = authTokenKey(apiUrl).replace('api', 'app');
  const legacyAppKey = authConfig.get(legacyAppTokenKey);

  if (legacyAppKey) {
    authConfig.set(authTokenKey(apiUrl), legacyAppKey);
    authConfig.delete(legacyAppTokenKey);
    return legacyAppKey;
  }
};

exports.saveApiKey = (apiUrl, apiKey) => {
  return authConfig.set(authTokenKey(apiUrl), apiKey);
};

exports.getLastVersionCheck = () => {
  return authConfig.get('meta.lastVersionCheck');
};

exports.setLastVersionCheck = time => {
  return authConfig.set('meta.lastVersionCheck', time);
};