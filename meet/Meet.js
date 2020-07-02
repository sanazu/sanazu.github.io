(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MeetJS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var EventEmitter = function (self) {
  self.events = {};

  self.on = function (event, listener) {
    if (typeof self.events[event] !== "object") {
      self.events[event] = [];
    }

    self.events[event].push(listener);
  };

  self.removeListener = function (event, listener) {
    let idx;

    if (typeof self.events[event] === "object") {
      idx = self.events[event].indexOf(listener);

      if (idx > -1) {
        self.events[event].splice(idx, 1);
      }
    }
  };

  self.emit = function (event) {
    var i,
      listeners,
      length,
      args = [].slice.call(arguments, 1);

    if (typeof self.events[event] === "object") {
      listeners = self.events[event].slice();
      length = listeners.length;

      for (i = 0; i < length; i++) {
        listeners[i].apply(self, args);
      }
    }
  };

  self.once = function (event, listener) {
    self.on(event, function g() {
      self.removeListener(event, g);
      listener.apply(self, arguments);
    });
  };
};

// function(self) {
//     self._events = {};

//   self.on = (event, listener) => {
//     if (typeof listener === "function") {
//       this._events[event] = [];
//       this._events[event].push(listener);
//     } else {
//       throw new Error(
//         " The listener argument must be of type Function. Received type undefined"
//       );
//     }
//     return this.eventEmitter;
//   };

//   // Adds a one time listener to the event. This listener is invoked only the next time the event is fired, after which it is removed.
//   self.once = (event, listener) => {
//     this._events[event].push({ listener: listener });
//     // Returns emitter, so calls can be chained.
//     return this.eventEmitter;
//   };

//   // Execute each of the listeners in order with the supplied arguments. Returns true if the event had listeners, false otherwise.
//   // emit

//   self.emit = (event, ...args) => {
//     if(!this._events[event]){
//       return false;
//     }
//     for (let i = 0; i < this._events[event].length; i++) {
//       if (typeof this._events[event][i] === "function") {
//         this._events[event][i](args);
//       } else if (this._events[event][i] && this._events[event][i].listener) {
//         this._events[event][i].listener(...args);
//         delete this._events[event][i];
//       }
//     }
//     if (this._events[event].length) {
//       return true;
//     }
//     return false;
//   };

//   //Removes a listener from the listener array for the specified event. Caution − It changes the array indices in the listener array behind the listener. removeListener will remove, at most, one instance of a listener from the listener array. If any single listener has been added multiple times to the listener array for the specified event, then removeListener must be called multiple times to remove each instance. Returns emitter, so calls can be chained

//   self.off = (event, responseToEvent) => {
//     const eventArray = this._events[event];
//     let i = 0;
//     let deleteCount = 0;
//     if (typeof eventArray !== "undefined") {
//       while (deleteCount < 1) {
//         // console.log(eventArray[i] && typeof eventArray[i] === 'function');
//         if (typeof eventArray[i] === "function") {
//           eventArray.splice(i, 1);
//           deleteCount++;
//         }
//         i++;
//       }
//     }
//     return this.eventEmitter;
//   };
// }

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};

const rtpConfig = {
  optional: [
    {
      RtpDataChannels: true,
    },
  ],
};

var mediaConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

class MeetPeer extends RTCPeerConnection {
  constructor(ms, id = null) {
    super(configuration, rtpConfig);
    this.ms = ms;
    this.peerName = ms.userName;
    this.remotePeer = null;
    this.rStream = null;
    this.lStream = null;
    this.gotStream = null;
    this.intimateOffer = null;
    this.awaitOffer = null;
    this.handleCallEvents = null;
    // this.configureDataChannel();
    console.log(ms.userName + " peer started");
  }

  configureDataChannel = () => {
    this.dataChannel = this.createDataChannel("dataChannel", {
      reliable: true,
    });

    this.dataChannel.onerror = function (error) {
      console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    this.dataChannel.onmessage = function (event) {
      console.log("message:", event);
      // handleMessage(event.data);
    };

    this.dataChannel.onclose = function () {
      console.log("data channel is closed");
    };

    this.callState = false;
  };

  configureStream = (localStream) => {
    this.lStream = localStream;
    localStream
      .getTracks()
      .forEach((track) => this.addTrack(track, localStream));
    console.log("stream added : " + localStream.id);
  };

  ontrack = (e) => {
    if (this.lStream.id !== e.streams[0].id) {
      console.log("stream received");
      console.log(e.streams[0]);
      this.rStream = e.streams[0];
      this.gotStream(this);
    }
  };

  setUserName = (name) => {
    this.peerName = name;
  };

  sendMessage = (msg) => {
    console.log("Messaging via data channel");
    this.dataChannel.send(JSON.stringify(msg));
  };

  sendOffer = (remotePeer) => {
    this.remotePeer = remotePeer;
    // if(this.localOffer){
    //   this.prepareOffer(this.localOffer);
    // }else{
    this.createOffer(mediaConstraints)
      .then(this.prepareOffer)
      .catch((e) => this.onError(e));
    // }
  };

  prepareOffer = (offer) => {
    this.localOffer = offer;
    this.setLocalDescription(offer);
    console.log("sending offer");
    this.ms.send({
      peerName: this.peerName,
      remotePeer: this.remotePeer,
      event: "offer",
      data: offer,
    });
  };

  // onnegotiationneeded = () => {
  //   this.sendOffer(this.remotePeer);
  //   console.log("re negotiation is happening")
  // }

  onicecandidate = (e) => {
    // if (this.callState) {
    if (e.candidate) {
      this.ms.send({
        peerName: this.peerName,
        remotePeer: this.remotePeer,
        event: "candidate",
        data: e.candidate,
      });
      console.log("sending iceCandidate to " + this.remotePeer);
    }
    // }
  };

  acceptOffer = (peerName) => {
    // if(this.remotePeer === peerName){
    this.sendOffer(peerName);
    // this.handleOffer(this.awaitOffer);
    // this.remotePeer = null;
    // this.awaitOffer = null;
    // }else{
    //   console.log("Peer Invalid");
    // }
  };

  sendInvite = (peerName) => {
    this.ms.send({
      peerName: this.peerName,
      remotePeer: peerName,
      event: "invite",
    });
  };

  rejectOffer = (peerName) => {
    console.log(this.remotePeer, peerName);
    if (this.remotePeer === peerName) {
      this.ms.send({
        peerName: this.peerName,
        remotePeer: this.remotePeer,
        event: "reject",
        data: "i can't take calls right now",
      });

      // this.remotePeer = null;
      // this.awaitOffer = null;
    } else {
      console.log("Peer Invalid");
    }
  };

  cancelOffer = (peerName) => {
    if (this.remotePeer === peerName) {
      this.ms.send({
        peerName: this.peerName,
        remotePeer: this.remotePeer,
        event: "cancel",
      });
    }
  };

  endCall = () => {
    this.ms.send({
      peerName: this.peerName,
      remotePeer: this.remotePeer,
      event: "bye",
      data: "I am gonna end the call!",
    });
  };

  handleOffer = (offer) => {
    this.setRemoteDescription(new RTCSessionDescription(offer));
    this.createAnswer()
      .then((answer) => {
        this.setLocalDescription(answer);
        this.ms.send({
          peerName: this.peerName,
          remotePeer: this.remotePeer,
          event: "answer",
          data: answer,
        });
        this.callState = true;
        console.log("connection established successfully!!");
      })
      .catch((e) => this.onError(e));
  };

  handleCandidate = (candidate) => {
    this.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("Candidate received");
  };

  handleAnswer = (answer) => {
    this.setRemoteDescription(new RTCSessionDescription(answer));
    this.callState = true;
    console.log("connection established successfully!!");
  };

  onError = (error) => {
    console.error(error);
  };
}

module.exports = MeetPeer;

},{}],3:[function(require,module,exports){
var SignalingChannel = require("./SignalingChannel");
var EventEmitter = require("./EventEmitter");
var MeetPeer = require("./MeetPeer");

function MeetJS(configs) {
  EventEmitter(this);
  this.configs = configs;
  this.peers = [];
  this.channel = new SignalingChannel(this.configs.url);
  this.channel.userName =
    this.configs.userName || prompt("Please enter your name");
  window.MeetJS = this;

  this.channel.onmessage = (params) => {
    // console.log(params);
    var data = JSON.parse(params.data);
    if (data.event === "ping") {
      return;
    }
    console.log(data);
    if (!data.remotePeer === this.configs.userName) {
      return;
    }
    switch (data.event) {
      case "offer":
        if (!this.peers[data.peerName]) {
          var peer = new MeetPeer(this.channel);
          peer.gotStream = this.gotStream;
          peer.remotePeer = data.peerName;
          peer.handleOffer(data.data);
          peer.configureStream(this.configs.local.srcObject);
          this.peers[data.peerName] = peer;
        }
        break;
      case "answer":
        if (this.peers[data.peerName]) {
          var peer = this.peers[data.peerName];
          peer.handleAnswer(data.data);
          peer.configureStream(this.configs.local.srcObject);
        }
        break;
      case "candidate":
        if (this.peers[data.peerName]) {
          var peer = this.peers[data.peerName];
          peer.handleCandidate(data.data);
        }
        break;
      default:
        this.emit("message", data);
        break;
    }
  };

  this.on("call", (peerName) => {
    if (!this.peers[peerName]) {
      var peer = new MeetPeer(this.channel);
      peer.gotStream = this.gotStream;
      peer.sendOffer(peerName);
      this.peers[peerName] = peer;
    } else {
      delete this.peers[peerName];
      var peer = new MeetPeer(this.channel);
      peer.gotStream = this.gotStream;
      peer.sendOffer(peerName);
    }
  });

  this.gotStream = (peer) => {
    this.configs.remote.srcObject = peer.rStream;
  };

  setTimeout(() => {
    console.log("emit");
    this.emit("ready", "connection is ready");
  }, 3 * 1000);
}

module.exports = MeetJS;

},{"./EventEmitter":1,"./MeetPeer":2,"./SignalingChannel":4}],4:[function(require,module,exports){
class SignalingChannel extends WebSocket {
  constructor(address) {
    super(address);
    super.onopen = this.onopen;
    this.interval = 29;
    this.id = Math.floor(Math.random() * 2) + 1;
  }

  addMp = (mp) => {
    this.mp = mp;
  };
  keepAlive = () => {
    var timeout = this.interval * 1000;
    if (this.readyState === this.OPEN && this.timerId) {
      console.log("Pinging server ... idle timeout: " + timeout / 1000 + "s");
      this.send({
        peerName: this.userName,
        event: "ping",
        data: {
          message: "hello",
        },
      });
    }
    this.timerId = setTimeout(this.keepAlive, timeout);
  };

  cancelKeepAlive = () => {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  };

  onopen = () => {
    console.log(
      this.userName + " Connected to the signaling server at " + this.url
    );
    this.keepAlive();
  };

  send = (message) => {
    if (this.readyState === this.OPEN) {
      super.send(JSON.stringify(message));
      return;
    }

    // try for every 1 sec
    setTimeout(() => {
      this.send(message);
    }, 1000);
  };

  onclose = () => {
    console.log("closing");
    this.cancelKeepAlive();
  };
}

module.exports = SignalingChannel;

},{}]},{},[3])(3)
});
