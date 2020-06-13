/* eslint-disable no-param-reassign */

function defaultReader(part, target) {
  if (part.sid) target.sid = part.sid;
  if (part.name) target.name = part.name;
}

const readConfig = (part, reader = defaultReader, target = {}) => {
  if (typeof part !== 'object' || part === null) return target;

  if (part.config) readConfig(part.config, reader, target);

  reader(part, target);

  if (part.ɔ) readConfig(part.ɔ, reader, target);

  return target;
};

module.exports = { readConfig };
