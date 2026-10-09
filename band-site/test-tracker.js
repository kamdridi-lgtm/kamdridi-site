async function test() {
  const { logVisit } = require('./lib/tracker');
  await logVisit('12.34.56.78', 'FR', 'Paris', '/home');
  console.log('Done');
}
test().catch(console.error);
