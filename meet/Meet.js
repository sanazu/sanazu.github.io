(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MeetJS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const SOCKET_EVENTS = {
  CALL: "CALL",
  ACCEPT: "ACCEPT",
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  CANDIDATE: "CANDIDATE",
  PING: "PING",
  PONG: "PONG",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
  INVITE: "INVITE",
  BYE: "BYE",
  MESSAGE: "MESSAGE",
  CONFERENCE: "CONFERENCE",
  READY: "READY",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
};

const LOCAL_EVENTS = {
  CONNECT_LOCAL_VIDEO: "CONNECT_LOCAL_VIDEO",
  DEVICE_CONNECTED: "DEVICE_CONNECTED",
  REMOVE_USER: "REMOVE_USER",
  RECEIVED_MESSAGE: "RECEIVED_MESSAGE",
  CONFERENCE: "CONFERENCE",
  CONNECT_CONFERENCE: "CONNECT_CONFERENCE",
  SEND_MESSAGE: "SEND_MESSAGE",
  CONNECT: "CONNECT",
  RECONNECT: "RECONNECT",
};

module.exports = {
  SOCKET_EVENTS,
  LOCAL_EVENTS,
};

},{}],2:[function(require,module,exports){
const constants = require("./Constants");

const EventEmitter = function (self) {
  self.events = {};

  self.SOCKET_EVENTS = constants.SOCKET_EVENTS;

  self.LOCAL_EVENTS = constants.LOCAL_EVENTS;

  self.on = function (event, listener) {
    if (typeof self.events[event] !== "object") {
      self.events[event] = [];
    }

    self.events[event].push(listener);
    return this;
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
  return this;
};

module.exports = EventEmitter;

},{"./Constants":1}],3:[function(require,module,exports){
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    {
      urls: ["turn:numb.viagenie.ca", "turn:numb.viagenie.ca?transport=tcp"],
      credential: "muazkh",
      username: "webrtc@live.com",
    },
    {
      urls: ["turn:numb.viagenie.ca", "turn:numb.viagenie.ca?transport=tcp"],
      username: "normanarguet@gmail.com",
      credential: "1ceCre4m007",
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
  constructor(remotePeer, id = null) {
    super(configuration, rtpConfig);
    this.remotePeer = remotePeer;
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
    console.log(remotePeer + " peer started");
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
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.OFFER,
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
      MeetJS.send({
        remotePeer: this.remotePeer,
        event: MeetJS.SOCKET_EVENTS.CANDIDATE,
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
    MeetJS.send({
      remotePeer: peerName,
      event: MeetJS.SOCKET_EVENTS.INVITE,
    });
  };

  rejectOffer = (peerName) => {
    console.log(this.remotePeer, peerName);
    if (this.remotePeer === peerName) {
      MeetJS.send({
        remotePeer: this.remotePeer,
        event: MeetJS.SOCKET_EVENTS.REJECT,
        data: "i can't take calls right now",
      });
    } else {
      console.log("Peer Invalid");
    }
  };

  cancelOffer = (peerName) => {
    if (this.remotePeer === peerName) {
      MeetJS.send({
        remotePeer: this.remotePeer,
        event: MeetJS.SOCKET_EVENTS.CANCEL,
      });
    }
  };

  endCall = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.BYE,
      data: "I am gonna end the call!",
    });
  };

  handleOffer = (offer) => {
    this.setRemoteDescription(new RTCSessionDescription(offer));
    this.createAnswer()
      .then((answer) => {
        this.setLocalDescription(answer);
        MeetJS.send({
          remotePeer: this.remotePeer,
          event: MeetJS.SOCKET_EVENTS.ANSWER,
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

},{}],4:[function(require,module,exports){
const SignalingChannel = require("./SignalingChannel");
const MeetPeer = require("./MeetPeer");
const MessageHandler = require("./MessageHandler");
const EventEmitter = require("./EventEmitter");

const MeetJS = function (props) {
  EventEmitter(this);

  this.users = [];
  this.activeUsers = [];
  this.isActiveStatus = false;

  var reconnectAttempts = 3;

  this.getRemainingAttempts = () => {
    return reconnectAttempts;
  };

  this.localVideo = async () => {
    let localStream = await navigator.mediaDevices.getUserMedia(
      props.mediaConstrains || this.DEFAULT_PROPS.mediaConstrains
    );
    this.localStream = localStream;
    // this.emit("localVideo", video);
    this.emit(this.LOCAL_EVENTS.DEVICE_CONNECTED);
    // return local;
  };

  this.on(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO, this.localVideo);

  var socketConnect = (userName) => {
    if (!userName) {
      console.log("No userName provided, Fallback to random");
    }
    this.userName = userName || this.DEFAULT_PROPS.defaultUserName;
    this.transport = new SignalingChannel(
      this.userName,
      (props.contextPath ? props.contextPath : "meet") +
        (props.token ? "?jwt=" + props.token : ""),
      props.url || this.DEFAULT_PROPS.transportUrl.local
    );
    this.transport.onready = (e) => {
      this.emit(this.SOCKET_EVENTS.READY, e);
    };
    this.transport.onMessage = (content) => {
      MessageHandler(content);
    };
  };

  this.on(this.LOCAL_EVENTS.RECONNECT, () => {
    reconnectAttempts = reconnectAttempts - 1;
    console.log("remaining attempts", reconnectAttempts);
    socketConnect(this.userName);
  });

  this.on(this.LOCAL_EVENTS.CONNECT, socketConnect);

  this.send = (msg) => this.transport.send(msg);

  this.on(this.LOCAL_EVENTS.SEND_MESSAGE, ({ remotePeer, data }) => {
    this.transport.send({
      peerName: this.userName,
      remotePeer: remotePeer,
      event: this.SOCKET_EVENTS.MESSAGE,
      data: data,
    });
  });

  var createOrGetUser = (userName) => {
    var user;
    if (this.users[userName]) {
      user = this.users[userName];
      var state = user.connectionState;
      if (state === "failed") {
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

  this.on(this.SOCKET_EVENTS.CONFERENCE, ({ remotePeer, users }) => {
    this.transport.send({
      peerName: this.userName,
      remotePeer: remotePeer,
      event: this.SOCKET_EVENTS.CONFERENCE,
      data: {
        users,
      },
    });
  });

  this.on(this.LOCAL_EVENTS.CONNECT_CONFERENCE, (data) => {
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

  this.on(this.SOCKET_EVENTS.CALL, (remotePeer) => {
    console.log("calling " + remotePeer);
    this.emit(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO);
    this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED, () => {
      var user = createOrGetUser(remotePeer);
      user.sendInvite(remotePeer);
    });
  });

  this.on(this.SOCKET_EVENTS.ACCEPT, (remotePeer) => {
    console.log("accepting invite from " + remotePeer);
    this.emit(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO);
    this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED, () => {
      var peer = createOrGetUser(remotePeer);
      peer.acceptOffer(remotePeer);
    });
  });

  this.on(this.SOCKET_EVENTS.CANCEL, (remotePeer) => {
    console.log("cancelling the invite from " + remotePeer);
    var peer = createOrGetUser(remotePeer);
    peer.cancelOffer(remotePeer);
  });

  this.on(this.SOCKET_EVENTS.REJECT, (remotePeer) => {
    console.log("rejecting the invite from " + remotePeer);
    var peer = createOrGetUser(remotePeer);
    peer.rejectOffer(remotePeer);
  });

  this.on(this.SOCKET_EVENTS.BYE, (remotePeer) => {
    console.log("Hanging up call with " + remotePeer);
    var user = createOrGetUser(remotePeer);
    user.endCall();
  });

  this.on(this.LOCAL_EVENTS.REMOVE_USER, (remotePeer) => {
    var user = createOrGetUser(remotePeer);
    user.close();
    delete this.users[remotePeer];
  });

  var failed = (e) => {
    var peer = e.currentTarget;
    if (peer.connectionState === "disconnected") {
      this.emit(this.SOCKET_EVENTS.DISCONNECTED, peer.remotePeer);
    }
    console.log(peer.remotePeer, peer.connectionState);
  };

  var initializeUser = (userName) => {
    var user = new MeetPeer(userName);
    // user.remotePeer = userName;
    user.gotStream = (peer) => {
      this.emit(this.SOCKET_EVENTS.CONNECTED, peer);
    };
    user.onconnectionstatechange = failed;
    user.configureStream(this.localStream);
    this.users[userName] = user;
    return user;
  };

  window.MeetJS = this;
};

MeetJS.prototype.DEFAULT_PROPS = {
  defaultUserName: "user" + Math.floor(Math.random() * 100) + 1,
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

module.exports = MeetJS;

},{"./EventEmitter":2,"./MeetPeer":3,"./MessageHandler":5,"./SignalingChannel":6}],5:[function(require,module,exports){
const MessageHandler = (content) => {
  console.log("MessageHandler", content);

  switch (content.event) {
    // when somebody wants to call us
    case MeetJS.SOCKET_EVENTS.OFFER:
      handleOffer(content);
      break;
    case MeetJS.SOCKET_EVENTS.ANSWER:
      handleAnswer(content);
      break;
    // when a remote peer sends an ice candidate to us
    case MeetJS.SOCKET_EVENTS.CANDIDATE:
      handleCandidate(content);
      break;
    case MeetJS.SOCKET_EVENTS.REJECT:
      console.log("received call event");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.REJECT, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.CANCEL:
      console.log("received call event");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.CANCEL, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.INVITE:
      console.log("received invite");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.INVITE, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.BYE:
      MeetJS.emit(MeetJS.SOCKET_EVENTS.BYE);
      MeetJS.emit(MeetJS.LOCAL_EVENTS.REMOVE_USER, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.MESSAGE:
      MeetJS.emit(MeetJS.LOCAL_EVENTS.RECEIVED_MESSAGE, {
        userName: content.peerName,
        data: content.data,
      });
    case MeetJS.SOCKET_EVENTS.CONFERENCE:
      MeetJS.emit(MeetJS.LOCAL_EVENTS.CONNECT_CONFERENCE, content.data);
      break;
    default:
      break;
  }
};

const handleOffer = (content) => {
  console.log("received offer");
  var user = MeetJS.getUser(content.peerName);
  user.handleOffer(content.data);
};

const handleCandidate = (content) => {
  console.log("received iceCandidate from " + content.peerName);
  var user = MeetJS.getUser(content.peerName);
  user.handleCandidate(content.data);
};

const handleAnswer = (content) => {
  console.log("received answer");
  var user = MeetJS.getUser(content.peerName);
  user.handleAnswer(content.data);
};

module.exports = MessageHandler;

},{}],6:[function(require,module,exports){
const getAbsoluteUrl = (address, contextPath) => {
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

  console.log(
    "connecting... to " + location,
    " with userName :" + MeetJS.userName
  );

  return location;
};

class SignalingChannel extends WebSocket {
  constructor(peerName = null, contextPath = "", address = null) {
    super(getAbsoluteUrl(address, contextPath));
    this.getUser = null;
    super.onmessage = this.onmessage;
    super.onopen = this.onopen;
    super.onclose = this.onclose;
    super.onerror = this.onerror;
    this.PING_INTERVAL = 29; // seconds
    this.SECOND = 1000;
    this.id = Math.floor(Math.random() * 2) + 1;
  }

  keepAlive = () => {
    var timeout = this.PING_INTERVAL * this.SECOND;
    if (this.readyState === this.OPEN) {
      console.log(
        "Pinging server ... idle timeout: " + timeout / this.SECOND + "s"
      );
      this.send({
        event: MeetJS.SOCKET_EVENTS.PING,
        data: {
          message: "hello",
        },
      });
    }
    this.timerId = setTimeout(this.keepAlive, timeout);
  };

  updateActiveUsers = (peerName) => {
    if (MeetJS.activeUsers[peerName]) {
      console.log(peerName, " is Online!");
      var temp = MeetJS.activeUsers[peerName];
      temp.isOnline = true;
      temp.lastPing = new Date(Date.now());
      clearTimeout(temp.timeout);
      temp.timeout = setTimeout(() => {
        console.log(peerName, " is Offline!");
        MeetJS.activeUsers[peerName].isOnline = false;
        setTimeout(() => {
          if (MeetJS.activeUsers[peerName].isOnline) return;
          delete MeetJS.activeUsers[peerName];
          console.log(peerName, " is not longer active!");
        }, 10 * 1000);
      }, 28 * 1000);
    } else {
      console.log(peerName, " is Online!");
      MeetJS.activeUsers[peerName] = {
        userName: peerName,
        lastPing: new Date(Date.now()),
        isOnline: true,
        timeout: setTimeout(() => {
          console.log(peerName, " is Offline!");
          MeetJS.activeUsers[peerName].isOnline = false;
          setTimeout(() => {
            if (MeetJS.activeUsers[peerName].isOnline) return;
            delete MeetJS.activeUsers[peerName];
            console.log(peerName, " is not longer active!");
          }, 10 * 1000);
        }, 28 * 1000),
      };
    }
  };

  cancelKeepAlive = () => {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  };

  onopen = () => {
    // console.log("Connected to the signaling server at " + this.url);
    this.onready(this.url);
    this.keepAlive();
  };

  onmessage = (msg) => {
    const content = JSON.parse(msg.data);
    if (content.event === MeetJS.SOCKET_EVENTS.PONG) {
      console.log("server pong");
      return;
    }

    if (content.peerName !== MeetJS.userName) {
      if (content.event === MeetJS.SOCKET_EVENTS.PING) {
        this.updateActiveUsers(content.peerName);
      } else if (content.remotePeer === MeetJS.userName) {
        this.onMessage(content);
        return;
      }
      // console.log("rejecting message", content);
      return;
    }
  };

  send = (message) => {
    message.peerName = MeetJS.userName;
    message.peerId = this.id;
    if (this.readyState === this.OPEN) {
      super.send(JSON.stringify(message));
      return;
    }

    // try for every 1 sec
    setTimeout(() => {
      this.send(message);
    }, 1 * 1000);
  };

  onerror = (err) => {
    // console.error("Socket encountered error: ", err, "Closing socket");
    this.close();
  };

  onclose = (e) => {
    this.cancelKeepAlive();
    if (MeetJS.getRemainingAttempts() > 0) {
      var reconnectTimeout =
        MeetJS.getRemainingAttempts() === 3
          ? 10
          : MeetJS.getRemainingAttempts() === 2
          ? 20
          : 30;
      console.log(
        "Socket is closed. Reconnect will be attempted in " +
          reconnectTimeout +
          " second.",
        e.reason
      );
      setTimeout(function () {
        console.log("reconneting .....");
        MeetJS.emit(MeetJS.LOCAL_EVENTS.RECONNECT);
      }, reconnectTimeout * this.SECOND);
    } else {
      console.log(
        "Socket is closed. Reconnection is Disabled/Exceded Maximum limit.",
        e.reason
      );
      return;
    }
  };
}

module.exports = SignalingChannel;

},{}]},{},[4])(4)
});
