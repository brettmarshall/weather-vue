var pubsub = {
  pubsub: {},
  subscribe: function (eventName, fn) {
    this.pubsub[eventName] = this.pubsub[eventName] || [];
    this.pubsub[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.pubsub[eventName]) {
      for (var i = 0; i < this.pubsub[eventName].length; i++) {
        if (this.pubsub[eventName][i] === fn) {
          this.pubsub[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  publish: function (eventName, data) {
    if (this.pubsub[eventName]) {
      this.pubsub[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};