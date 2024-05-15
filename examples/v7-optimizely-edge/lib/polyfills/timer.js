let timers = new Map();
let nextTimerId = 1;

(function (global) {
  var timerQueue = [];
  var nextTimerId = 0;

  function runTimers() {
    var now = Date.now();
    var nextCheck = null;

    // Run due timers
    for (var i = 0; i < timerQueue.length; i++) {
      var timer = timerQueue[i];
      if (timer.time <= now) {
        timer.callback.apply(null, timer.args);
        if (timer.repeating) {
          timer.time = now + timer.delay; // schedule next run
          nextCheck =
            nextCheck !== null ? Math.min(nextCheck, timer.time) : timer.time;
        } else {
          timerQueue.splice(i--, 1); // remove non-repeating timer
        }
      } else {
        nextCheck =
          nextCheck !== null ? Math.min(nextCheck, timer.time) : timer.time;
      }
    }

    // Schedule next check
    if (nextCheck !== null) {
      var delay = Math.max(nextCheck - Date.now(), 0);
      setTimeout(runTimers, delay);
    }
  }

  global.setTimeout = function (callback, delay, ...args) {
    var timerId = ++nextTimerId;
    var timer = {
      id: timerId,
      callback: callback,
      time: Date.now() + delay,
      args: args,
      repeating: false,
      delay: delay,
    };
    timerQueue.push(timer);
    return timerId;
  };

  global.clearTimeout = function (timerId) {
    for (var i = 0; i < timerQueue.length; i++) {
      if (timerQueue[i].id === timerId) {
        timerQueue.splice(i, 1);
        break;
      }
    }
  };

  global.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch((err) =>
        setTimeout(() => {
          throw err;
        })
      );
  };

  setTimeout(runTimers, 0);
})(global);
