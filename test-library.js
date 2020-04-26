function waitFor(unit) {
  return new Promise((resolve) => {
    const unsubscribe = unit.watch((payload) => {
      resolve(payload);
      unsubscribe();
    });
  });
}

function argumentHistory(ƒ) {
  return ƒ.mock.calls.map((value) =>
    value.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '),
  );
}

module.exports = { argumentHistory, waitFor };
