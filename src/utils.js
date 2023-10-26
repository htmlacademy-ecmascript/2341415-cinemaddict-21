import { camelCase, snakeCase, isObject } from 'lodash';
import { formatDuration } from 'date-fns';
import { DURATION } from './const.js';

function createKeysFixer(mapKey) {
  function fixKeys(obj) {
    const fixedEntries = Object.entries(obj).map(([key, value]) => {
      const fixedKey = mapKey(key);

      let fixedValue;

      if (Array.isArray(value)) {
        fixedValue = isObject(value[0]) ? value.map(fixKeys) : value;
      } else {
        fixedValue = isObject(value) ? fixKeys(value) : value;
      }

      return [fixedKey, fixedValue];
    });

    return Object.fromEntries(fixedEntries);
  }

  return fixKeys;
}

const keysToCamelCase = createKeysFixer(camelCase);
const keysToSnakeCase = createKeysFixer(snakeCase);

function getDurationString(minutes) {

  const formated = formatDuration(
    {
      hours: Math.floor(minutes / DURATION.minInHour),
      minutes: minutes % DURATION.minInHour,
    },
    {
      format: ['hours', 'minutes'],
      delimiter: ' '
    }
  );

  return formated
    .replace(' hours', 'H')
    .replace(' hour', 'H')
    .replace(' minutes', 'M')
    .replace(' minute', 'M');
}


export {
  keysToCamelCase,
  keysToSnakeCase,
  getDurationString,
};
