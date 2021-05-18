const { combine } = require('effector');

function format(string, ...stores) {
  return combine(stores, (stores) =>
    stores.map((store, index) => `${string[index]}${store}`).join(''),
  );
}

module.exports = { format };
