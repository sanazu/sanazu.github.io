(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MeetJS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var EventEmitter = function (self) {
  self.events = {};

  self.on = function (event, listener) {
    if (typeof self.events[event] !== "object") {
      self.events[event] = [];
    }

    self.events[event].push(listener);
  };

  self.off = function (event, listener) {
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
      self.off(event, g);
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
    {
      url: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
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

const offerOptions = {
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
    this.configureDataChannel();
    super.onicecandidate = this.onicecandidate;
    super.onnegotiationneeded = this.onnegotiationneeded;
    super.ontrack = this.ontrack;
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
    if (!localStream) return;
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
    this.createOffer(offerOptions)
      .then(this.prepareOffer)
      .catch((e) => this.onError(e));
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

  onnegotiationneeded = () => {
    if (!this.callState) return;
    this.sendOffer(this.remotePeer);
    console.log("re negotiation is happening");
  };

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
    // this.configureStream(this.lStream);
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
var MeetPeer = require("./MeetPeer");
var MessageHandler = require("./MessageHandler");
var EventEmitter = require("./EventEmitter");

var defaultProps = {
  userName: "user" + Math.floor(Math.random() * 100) + 1,
  transportUrl: {
    origin: window.location.origin.replace("http", "ws"),
    local: "ws://localhost:8080",
    remote: "wss://meet-v1.herokuapp.com",
  },
  mediaConstrains: {
    video: true,
    audio: true,
  },
};

function MeetJS(props) {
  EventEmitter(this);

  this.users = [];

  this.localVideo = async () => {
    let localStream = await navigator.mediaDevices.getUserMedia(
      props.mediaConstrains || defaultProps.mediaConstrains
    );
    window.localStream = localStream;
    // this.emit("localVideo", video);
    this.emit("devices-connected");
    // return local;
  };

  this.on("localVideoConnect", this.localVideo);

  var transport;

  this.on("connect", (userName) => {
    if (!userName) {
      console.log("No userName provided, Fallback to random");
    }
    this.userName = userName || defaultProps.userName;
    transport = window.transport = new SignalingChannel(
      this.userName,
      (props.contextPath ? props.contextPath : "meet") +
        (props.token ? "?jwt=" + props.token : ""),
      props.url || defaultProps.transportUrl.local
    );
    transport.onready = (e) => {
      this.emit("ready", e);
    };
    transport.onmessage = (msg) => {
      MessageHandler(msg, this);
    };
  });

  this.on("sendMessage", ({ remotePeer, data }) => {
    transport.send({
      peerName: this.userName,
      remotePeer: remotePeer,
      event: "message",
      data: data,
    });
  });

  var createOrGetUser = (userName) => {
    var user;
    if (this.users[userName]) {
      user = this.users[userName];
      var state = user.connectionState;
      // console.log("user already exists : " + userName + " with state " + state);
      if (state === "failed") {
        // console.log("user re initialize : " + userName);
        delete this.users[userName];
        user = initializeUser(userName);
      }
      return user;
    } else {
      user = initializeUser(userName);
    }
    return user;
  };

  this.getUser = createOrGetUser;

  this.on("conference", ({ remotePeer, users }) => {
    transport.send({
      peerName: this.userName,
      remotePeer: remotePeer,
      event: "conference",
      data: {
        users,
      },
    });
  });

  this.on("conference-connect", (data) => {
    if (data.users) {
      console.log("confere", data);
      window.conference = data.users;
      data.users.forEach((remotePeer) => {
        var user = createOrGetUser(remotePeer);
        user.sendOffer(remotePeer);
      });
    }
  });

  this.on("createOrGetUser", (userName) => createOrGetUser(userName));

  this.on("call", (remotePeer) => {
    console.log("calling " + remotePeer);
    this.emit("localVideoConnect");
    this.once("devices-connected", () => {
      var user = createOrGetUser(remotePeer);
      user.sendInvite(remotePeer);
    });
  });

  this.on("accept", (remotePeer) => {
    console.log("accepting invite from " + remotePeer);
    this.emit("localVideoConnect");
    this.once("devices-connected", () => {
      var peer = createOrGetUser(remotePeer);
      peer.acceptOffer(remotePeer);
    });
  });

  this.on("cancel", (remotePeer) => {
    console.log("cancelling the invite from " + remotePeer);
    var peer = createOrGetUser(remotePeer);
    peer.cancelOffer(remotePeer);
  });

  this.on("reject", (remotePeer) => {
    console.log("rejecting the invite from " + remotePeer);
    var peer = createOrGetUser(remotePeer);
    peer.rejectOffer(remotePeer);
  });

  this.on("bye", (remotePeer) => {
    console.log("Hanging up call with " + remotePeer);
    var user = createOrGetUser(remotePeer);
    user.endCall();
  });

  this.on("removeUser", (remotePeer) => {
    var user = createOrGetUser(remotePeer);
    user.close();
    delete this.users[remotePeer];
  });

  var failed = (e) => {
    var peer = e.currentTarget;
    if (peer.connectionState === "disconnected") {
      this.emit("disconnected", peer.remotePeer);
    }
    console.log(peer.remotePeer, peer.connectionState);
  };

  var initializeUser = (userName) => {
    var user = new MeetPeer(window.transport);
    user.remotePeer = userName;
    user.gotStream = (peer) => {
      this.emit("gotStream", peer);
    };
    user.onconnectionstatechange = failed;
    user.configureStream(window.localStream);
    this.users[userName] = user;
    return user;
  };

  window.MeetJS = this;
}

module.exports = MeetJS;

},{"./EventEmitter":1,"./MeetPeer":2,"./MessageHandler":4,"./SignalingChannel":5}],4:[function(require,module,exports){
const MessageHandler = (msg, ms) => {
  const content = JSON.parse(msg.data);
  if (content.event === "pong" || content.event === "ping") return;
  if (ms.userName !== content.remotePeer) {
    console.log("rejecting message", content);
    return;
  }
  console.log("MessageHandler", content);

  switch (content.event) {
    // when somebody wants to call us
    case "offer":
      handleOffer(content, ms);
      break;
    case "answer":
      handleAnswer(content, ms);
      break;
    // when a remote peer sends an ice candidate to us
    case "candidate":
      handleCandidate(content, ms);
      break;
    case "ping":
      handlePing(content, ms);
      break;
    case "reject":
    case "cancel":
      handleCallEvents(content, ms);
      break;
    case "invite":
      handleInvite(content, ms);
      break;
    case "bye":
      ms.emit("bye");
      ms.emit("removeUser", content.peerName);
      break;
    case "message":
      ms.emit("receivedMessage", {
        userName: content.peerName,
        data: content.data,
      });
    case "conference":
      ms.emit("conference-connect", content.data);
      break;
    default:
      break;
  }
};

const handleCallEvents = (content, ms) => {
  console.log("received call event");
  if (content.event) {
    if (content.event === "cancel") ms.emit("cancel", content.peerName);
    if (content.event === "reject") ms.emit("reject", content.peerName);
  }
};

const handleInvite = (content, ms) => {
  console.log("received invite");
  // ms.emit("localVideoConnect");
  // ms.once("devices-connected", () => {
  //   ms.emit("invite", content.peerName);
  // });
  ms.emit("invite", content.peerName);
};
const handlePing = (content, ms) => {
  console.log(
    "received a ping from " +
      content.peerName +
      " with the message " +
      content.data.message
  );
};

const handleOffer = (content, ms) => {
  console.log("received offer");
  // ms.emit("localVideoConnect");
  // ms.once("devices-connected", () => {
  //   var user = ms.getUser(content.peerName);
  //   user.handleOffer(content.data);
  // });
  var user = ms.getUser(content.peerName);
  user.handleOffer(content.data);
};

const handleCandidate = (content, ms) => {
  console.log("received iceCandidate from " + content.peerName);
  var user = ms.getUser(content.peerName);
  user.handleCandidate(content.data);
};

const handleAnswer = (content, ms) => {
  console.log("received answer");
  var user = ms.getUser(content.peerName);
  user.handleAnswer(content.data);
};

module.exports = MessageHandler;

},{}],5:[function(require,module,exports){
class SignalingChannel extends WebSocket {
  constructor(peerName = null, contextPath = "", address = null) {
    const getProtocol = () => {
      if (!address) {
        return window.location.protocol === "https:" ? "wss://" : "ws://";
      } else {
        return "";
      }
    };
    const getContextPath = (path) => {
      return path + "/" + contextPath;
    };
    const location = getContextPath(
      getProtocol() + (address !== null ? address : window.location.host)
    );
    console.log("connecting... " + location);
    super(location);
    this.userName = peerName;
    console.log("connected as " + this.userName);
    this.getUser = null;
    this.timerID = 0;
    super.onopen = this.onopen;
    this.interval = 29;
    this.id = Math.floor(Math.random() * 2) + 1;
  }

  addMp = (mp) => {
    this.mp = mp;
  };

  keepAlive = () => {
    var timeout = this.interval * 1000;
    if (this.readyState === this.OPEN) {
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
    // console.log("Connected to the signaling server at " + this.url);
    this.onready(this.url);
    this.send({
      peerName: this.userName,
      peerId: this.id,
      event: "ping",
      data: {
        message: "hello",
      },
    });
    this.keepAlive();
  };

  // onmessage = (msg) => {
  //   MessageHandler(msg, this);
  // };

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
