const Pusher = require("pusher");

let pusher = null;

function initializePusher() {
  console.log("initalize pusher in initializePusher function");
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
  });
}

function getPusher() {
  if (pusher != null) {
    return pusher;
  } else {
    console.log("initalize pusher in getPusher function");
    return new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
    });
  }
}

module.exports = {
  initializePusher,
  getPusher,
};
