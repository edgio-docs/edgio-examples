import CryptoJS from 'crypto-js';
import getRandomValues from 'polyfill-crypto.getrandomvalues';

global.crypto = {
  ...CryptoJS,
  getRandomValues,
};
