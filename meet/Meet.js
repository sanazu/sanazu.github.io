(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MeetJS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const SOCKET_EVENTS = {
  CALL: "CALL",
  ACCEPT: "ACCEPT",
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  CANDIDATE: "CANDIDATE",
  PING: "PING",
  PONG: "PONG",
  NOTFOUND: "NOTFOUND",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  INVITE: "INVITE",
  BYE: "BYE",
  BABYE: "BABYE",
  MESSAGE: "MESSAGE",
  CONFERENCE: "CONFERENCE",
  READY: "READY",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
};

const LOCAL_EVENTS = {
  CONNECT_MEDIA: "CONNECT_MEDIA",
  DEVICE_CONNECTED: "DEVICE_CONNECTED",
  REMOVE_USER: "REMOVE_USER",
  RECEIVED_MESSAGE: "RECEIVED_MESSAGE",
  CONFERENCE: "CONFERENCE",
  CONNECT_CONFERENCE: "CONNECT_CONFERENCE",
  SEND_MESSAGE: "SEND_MESSAGE",
  CONNECT: "CONNECT",
  RECONNECT: "RECONNECT",
  MUTE_AUDIO: "MUTE_AUDIO",
  MUTE_VIDEO: "MUTE_VIDEO",
  STOP_MEDIA: "STOP_MEDIA",
  SHARE_SCREEN: "SHARE_SCREEN",
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
const Logger = function () {};

const logTypes = ["log", "info", "warn", "error"];

Logger.prototype.isMeetJS = true;

Logger.prototype.logs = [];

Logger.prototype.logMessage = function (type, message) {
  let logMsg = ` ${new Date().toLocaleString()} - ${type} : ${message}`;

  Logger.prototype.logs.push(logMsg);
};

Logger.prototype.print = function () {
  if (!Logger.prototype.logs || Logger.prototype.logs.length === 0) {
    return;
  }

  let content = "";

  Logger.prototype.logs.forEach(function (log, index) {
    content += `${log}`;

    if (index !== Logger.prototype.logs.length) {
      content += "\n";
    }
  });

  // console.log(content);

  let uri = `data:application/octet-stream,${encodeURIComponent(content)}`;

  var a = document.createElement("a");
  a.href = uri;
  a.download = `MeetJS-log-${new Date().toLocaleString()}.txt`;
  a.click();
  return "log file is downloading.....";
};

const log = function (type, arguments) {
  let canlog = true;
  if (!MeetJS.debug && type === "log") {
    canlog = false;
  }

  if (arguments.length === 1) {
    if (canlog) console[type](arguments[0]);
    Logger.prototype.logMessage(`[ ${type} ]`, JSON.stringify(arguments[0]));
    return;
  }

  if (arguments.length === 2) {
    if (canlog) console[type](arguments[0], arguments[1]);
    Logger.prototype.logMessage(
      `[ ${type} ]`,
      `${JSON.stringify(arguments[0])} , ${JSON.stringify(arguments[1])}`
    );
    return;
  }

  // if more than one arguments are present, do grouped logs
  if (typeof arguments[0] === "object") {
    throw new Error("log group name cannot be object");
  }

  const groupName = arguments[0];

  if (canlog) console.group(groupName);

  [...arguments].forEach(function (msg, index) {
    if (index === 0) return;

    if (canlog) console[type](msg);

    Logger.prototype.logMessage(
      `[ ${type} - ${groupName} ]`,
      JSON.stringify(msg)
    );
  });

  if (canlog) console.groupEnd();
};

logTypes.forEach(function (type) {
  Logger.prototype[type] = function () {
    log(type, arguments);
  };
});

module.exports = new Logger();

},{}],4:[function(require,module,exports){
const defautConfig = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    {
      urls: [
        "turn:207.148.124.163:3478",
        "turn:207.148.124.163:3478?transport=tcp",
      ],
      username: "1596262710",
      credential: "5DX48ynOZOy5J0EL7Ae3CS6JshI=",
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

class MeetPeer extends RTCPeerConnection {
  constructor(remotePeer) {
    super(defautConfig);
    this.remotePeer = remotePeer;
    this.rStream = null;
    this.lStream = null;
    this.gotStream = null;
    this.intimateOffer = null;
    this.awaitOffer = null;
    this.handleCallEvents = null;
    // this.configureDataChannel();
    super.onicecandidate = this.onicecandidate;
    super.onnegotiationneeded = this.onnegotiationneeded;
    super.ontrack = this.ontrack;
    Logger.log(remotePeer + " peer started");
  }

  configureDataChannel = () => {
    this.dataChannel = this.createDataChannel("dataChannel", {
      reliable: true,
    });

    this.dataChannel.onerror = function (error) {
      Logger.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    this.dataChannel.onmessage = function (event) {
      Logger.log("message:", event);
      // handleMessage(event.data);
    };

    this.dataChannel.onclose = function () {
      Logger.log("data channel is closed");
    };

    this.callState = false;
  };

  initConfiguration = (configuration) => {
    if (MeetJS.customConfig) {
      if (configuration.iceServers.length === 0) {
        console.error(
          "configuration received is invalid!",
          "Fallback to the default"
        );
        return;
      }
      Logger.log("configuration Applied successfully");
      let existingConfig = this.getConfiguration();
      existingConfig.iceTransportPolicy = "relay";
      existingConfig.iceServers = configuration.iceServers;
      this.setConfiguration(existingConfig);
      return;
    } else {
      Logger.log("Custom ConFig is disabled");
      return;
    }
  };

  getOfferOptions = () => {
    return {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
  };

  configureStream = (localStream) => {
    if (!localStream) return;
    this.lStream = localStream;
    localStream.getTracks().forEach((track) => {
      this.addTrack(track, localStream);
    });
    Logger.log("stream added : " + localStream.id);
  };

  changeStream = (newStream, type) => {
    this.getSenders()
      .find((sender) => sender.track.kind === type)
      .replaceTrack(newStream.getVideoTracks()[0]);
    newStream.addTrack(MeetJS.getLocalStream().getAudioTracks()[0]);
    this.lStream = newStream;
    this.gotStream(this);
  };

  ontrack = (e) => {
    if (!this.lStream) this.configureStream(MeetJS.getLocalStream());
    if (this.lStream.id !== e.streams[0].id) {
      Logger.log(e.streams[0].id);
      Logger.log("stream received");
      Logger.log(e.streams[0]);
      this.rStream = e.streams[0];
      this.gotStream(this);
    }
  };

  sendMessage = (msg) => {
    Logger.log("Messaging via data channel");
    this.dataChannel.send(JSON.stringify(msg));
  };

  sendOffer = () => {
    this.createOffer(this.getOfferOptions())
      .then(this.prepareOffer)
      .catch((e) => this.onError(e));
  };

  prepareOffer = (offer) => {
    this.setLocalDescription(offer);
    Logger.log("sending offer");
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.OFFER,
      data: offer,
    });
  };

  onnegotiationneeded = () => {
    if (!this.callState) return;
    this.sendOffer(this.remotePeer);
    Logger.log("re negotiation is happening");
  };

  onicecandidate = (e) => {
    if (e.candidate) {
      MeetJS.send({
        remotePeer: this.remotePeer,
        event: MeetJS.SOCKET_EVENTS.CANDIDATE,
        data: e.candidate,
      });
      Logger.log("sending iceCandidate to " + this.remotePeer);
    }
  };

  acceptOffer = () => this.sendOffer();

  sendInvite = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.INVITE,
    });
  };

  rejectOffer = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.REJECT,
      data: "i can't take calls right now",
    });
  };

  cancelOffer = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.CANCEL,
    });
  };

  endCall = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.BYE,
      data: "I am gonna end the call!",
    });
  };

  endCallBye = () => {
    MeetJS.send({
      remotePeer: this.remotePeer,
      event: MeetJS.SOCKET_EVENTS.BABYE,
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
        Logger.log("connection established successfully!!");
      })
      .catch((e) => this.onError(e));
  };

  handleCandidate = (candidate) => {
    this.addIceCandidate(new RTCIceCandidate(candidate));
    Logger.log("Candidate received");
  };

  handleAnswer = (answer) => {
    this.setRemoteDescription(new RTCSessionDescription(answer));
    this.callState = true;
    Logger.log("connection established successfully!!");
  };

  onError = (error) => {
    console.error(error);
  };
}

module.exports = MeetPeer;

},{}],5:[function(require,module,exports){
const SignalingChannel = require("./SignalingChannel");
const MeetPeer = require("./MeetPeer");
const Stream = require("./Stream");
const MessageHandler = require("./MessageHandler");
const EventEmitter = require("./EventEmitter");
window.Logger = require("./Logger");
const Utils = require("./Utils");

const MeetJS = function (props) {
  window.MeetJS = this;
  EventEmitter(this);

  var stream = new Stream();

  this.users = []; // collection of peers
  this.sharingScreen = false;
  this.activeUsers = [];
  this.debug = props.debug;
  this.customConfig = props.customConfig || false;
  var privateCall = props.autoRevokeMedia || false;
  // this.isActiveStatus = false;

  var reconnectAttempts = 3;

  this.getActiveCallUsers = () => Utils.getKeysFromObject(this.users);

  this.getRemainingAttempts = () => {
    return reconnectAttempts;
  };

  var localVideo = () => {
    stream
      .connectMedia(props.mediaConstrains || this.DEFAULT_PROPS.mediaConstrains)
      .then((sucess) => {
        if (sucess) {
          this.emit(this.LOCAL_EVENTS.DEVICE_CONNECTED);
        }
      })
      .catch((err) => {
        Logger.log(err);
      });
  };

  this.getLocalStream = () => {
    if (stream.localStream) {
      return stream.localStream;
    } else {
      throw new Error("Connect to camera first!");
    }
  };

  this.toggleScreenShare = async () => {
    if (!this.isScreenShare) {
      if (!stream.displayStream) await stream.connectShareMedia();
      Logger.log("ScreenSharing enabled");
      this.getActiveCallUsers().forEach((u) => {
        this.users[u].changeStream(stream.displayStream, "video");
      });
      this.isScreenShare = true;
    } else {
      if (stream.displayStream) stream.disconnectDisplayShare();
      Logger.log("ScreenSharing disabled");
      this.getActiveCallUsers().forEach((u) => {
        this.users[u].changeStream(stream.localStream, "video");
      });
      this.isScreenShare = false;
    }
  };

  this.on(this.LOCAL_EVENTS.CONNECT_MEDIA, localVideo);

  var socketConnect = (userName) => {
    if (!userName) {
      Logger.log("No userName provided, Fallback to random");
    }
    this.userName = userName || this.DEFAULT_PROPS.defaultUserName();
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
    if (reconnectAttempts <= 0) return;
    reconnectAttempts = reconnectAttempts - 1;
    Logger.log("remaining attempts", reconnectAttempts);
    socketConnect(this.userName);
  });

  this.on(this.LOCAL_EVENTS.CONNECT, socketConnect);

  this.send = (msg) => this.transport.send(msg);

  this.on(this.LOCAL_EVENTS.SEND_MESSAGE, ({ remotePeer, data }) => {
    this.transport.send({
      remotePeer: remotePeer,
      event: this.SOCKET_EVENTS.MESSAGE,
      data: data,
    });
  });

  this.getUser = (userName) => {
    if (!userName) {
      console.errors("userName is empty");
      return;
    }
    if (this.users[userName]) {
      return this.users[userName];
    } else {
      return initializeUser(userName);
    }
  };

  this.on(this.LOCAL_EVENTS.MUTE_AUDIO, () =>
    stream.toogleMute({ audio: true })
  );

  this.on(this.LOCAL_EVENTS.MUTE_VIDEO, () =>
    stream.toogleMute({ video: true })
  );

  this.on(this.LOCAL_EVENTS.STOP_MEDIA, () =>
    stream.stopMedia({ audio: true, video: true })
  );

  this.on(this.SOCKET_EVENTS.CONFERENCE, ({ remotePeer, users }) => {
    this.transport.send({
      remotePeer: remotePeer,
      event: this.SOCKET_EVENTS.CONFERENCE,
      data: {
        users,
      },
    });
  });

  this.on(this.LOCAL_EVENTS.CONNECT_CONFERENCE, (data) => {
    if (data.users) {
      Logger.log("confere", data);
      window.conference = data.users;
      data.users.forEach((remotePeer) => {
        peerEvent("sendOffer", remotePeer);
      });
    }
  });

  this.on(this.SOCKET_EVENTS.CALL, (remotePeer) => {
    Logger.log("calling " + remotePeer);
    this.emit(this.LOCAL_EVENTS.CONNECT_MEDIA);
    this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED, () => {
      peerEvent("sendInvite", remotePeer);
    });
  });

  this.on(this.SOCKET_EVENTS.ACCEPT, (remotePeer) => {
    Logger.log("accepting invite from " + remotePeer);
    this.emit(this.LOCAL_EVENTS.CONNECT_MEDIA);
    this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED, () => {
      peerEvent("acceptOffer", remotePeer);
    });
  });

  this.on(this.SOCKET_EVENTS.CANCEL, (remotePeer) => {
    Logger.log("cancelling the invite from " + remotePeer);
    peerEvent("cancelOffer", remotePeer);
  });

  this.on(this.SOCKET_EVENTS.REJECT, (remotePeer) => {
    Logger.log("rejecting the invite from " + remotePeer);
    peerEvent("rejectOffer", remotePeer);
  });

  this.on(this.SOCKET_EVENTS.BYE, (remotePeer) => {
    Logger.log("Hanging up call with " + remotePeer);
    peerEvent("endCall", remotePeer);
  });

  this.on(this.LOCAL_EVENTS.REMOVE_USER, (remotePeer) => {
    peerEvent("close", remotePeer);
    delete this.users[remotePeer];
    this.emit(this.SOCKET_EVENTS.DISCONNECTED, remotePeer);
  });

  var peerEvent = (eventName, remotePeer) => {
    var user = this.getUser(remotePeer);
    user[eventName]();
  };
  var failed = (e) => {
    var peer = e.currentTarget;
    if (peer.connectionState === "failed") {
      this.emit(this.SOCKET_EVENTS.DISCONNECTED, peer.remotePeer);
      this.emit(this.LOCAL_EVENTS.REMOVE_USER, peer.remotePeer);
    }
    Logger.log(peer.remotePeer, peer.connectionState);
  };

  // this function below is suitable for 1-1 & not recommended for 1-n || n-n
  this.on(this.SOCKET_EVENTS.CONNECTED, () => {
    this.on(this.SOCKET_EVENTS.DISCONNECTED, () => {
      if (!privateCall) {
        Logger.log(
          "autoRevokeMedia is disabled",
          "revoke userMedia by emiting STOP_MEDIA"
        );
        return;
      }
      Logger.log("autoRevokeMedia is enabled");
      this.emit(this.LOCAL_EVENTS.STOP_MEDIA);
    });
  });

  var initializeUser = (userName) => {
    var user = new MeetPeer(userName);
    user.gotStream = (peer) => {
      this.emit(this.SOCKET_EVENTS.CONNECTED, peer);
    };
    user.onconnectionstatechange = failed;
    user.configureStream(stream.localStream);
    this.users[userName] = user;
    return user;
  };
};

MeetJS.prototype.DEFAULT_PROPS = {
  defaultUserName: function () {
    return "user" + Math.floor(Math.random() * 100) + 1;
  },
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

},{"./EventEmitter":2,"./Logger":3,"./MeetPeer":4,"./MessageHandler":6,"./SignalingChannel":7,"./Stream":8,"./Utils":9}],6:[function(require,module,exports){
const MessageHandler = (content) => {
  Logger.log("MessageHandler", content);

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
      Logger.log("received call event");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.REJECTED, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.CANCEL:
      Logger.log("received call event");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.CANCELLED, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.NOTFOUND:
      Logger.log("received not found");
      MeetJS.emit(MeetJS.SOCKET_EVENTS.NOTFOUND, content.peerName);
      break;
    case MeetJS.SOCKET_EVENTS.INVITE:
      handleInvite(content);
      break;
    case MeetJS.SOCKET_EVENTS.BYE:
      handleBye(content);
      break;
    case MeetJS.SOCKET_EVENTS.BABYE:
      Logger.log("received BaBye");
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

const handleBye = (content) => {
  Logger.log("received Bye");
  MeetJS.emit(MeetJS.LOCAL_EVENTS.REMOVE_USER, content.peerName);
  var user = MeetJS.getUser(content.peerName);
  user.endCallBye();
};

const handleInvite = (content) => {
  Logger.log("received invite");
  if (content.configuration) {
    var user = MeetJS.getUser(content.peerName);
    user.initConfiguration(content.configuration);
  }

  MeetJS.emit(MeetJS.SOCKET_EVENTS.INVITE, content.peerName);
};
const handleOffer = (content) => {
  Logger.log("received offer");
  var user = MeetJS.getUser(content.peerName);
  if (content.configuration) {
    user.initConfiguration(content.configuration);
  }
  user.handleOffer(content.data);
};

const handleCandidate = (content) => {
  Logger.log("received iceCandidate from " + content.peerName);
  var user = MeetJS.getUser(content.peerName);
  user.handleCandidate(content.data);
};

const handleAnswer = (content) => {
  Logger.log("received answer");
  var user = MeetJS.getUser(content.peerName);
  user.handleAnswer(content.data);
};

module.exports = MessageHandler;

},{}],7:[function(require,module,exports){
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

  Logger.log(
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
    this.superSend = super.send;
    this.PING_INTERVAL = 29; // seconds
    this.SECOND = 1000;
    this.id = Math.floor(Math.random() * 2) + 1;
  }

  keepAlive = () => {
    var timeout = this.PING_INTERVAL * this.SECOND;
    if (this.readyState === this.OPEN) {
      Logger.log(
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
      Logger.log(peerName, " is Online!");
      var temp = MeetJS.activeUsers[peerName];
      temp.isOnline = true;
      temp.lastPing = new Date(Date.now());
      clearTimeout(temp.timeout);
      temp.timeout = setTimeout(() => {
        Logger.log(peerName, " is Offline!");
        MeetJS.activeUsers[peerName].isOnline = false;
        setTimeout(() => {
          if (MeetJS.activeUsers[peerName].isOnline) return;
          delete MeetJS.activeUsers[peerName];
          Logger.log(peerName, " is not longer active!");
        }, 10 * 1000);
      }, 28 * 1000);
    } else {
      Logger.log(peerName, " is Online!");
      MeetJS.activeUsers[peerName] = {
        userName: peerName,
        lastPing: new Date(Date.now()),
        isOnline: true,
        timeout: setTimeout(() => {
          Logger.log(peerName, " is Offline!");
          MeetJS.activeUsers[peerName].isOnline = false;
          setTimeout(() => {
            if (MeetJS.activeUsers[peerName].isOnline) return;
            delete MeetJS.activeUsers[peerName];
            Logger.log(peerName, " is not longer active!");
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
    // Logger.log("Connected to the signaling server at " + this.url);
    this.onready(this.url);
    this.keepAlive();
  };

  onmessage = (msg) => {
    const content = JSON.parse(msg.data);
    if (content.event === MeetJS.SOCKET_EVENTS.PONG) {
      Logger.log("server pong");
      return;
    }

    if (content.peerName !== MeetJS.userName) {
      if (content.event === MeetJS.SOCKET_EVENTS.PING) {
        this.updateActiveUsers(content.peerName);
      } else if (content.remotePeer === MeetJS.userName) {
        this.onMessage(content);
        return;
      }
      // Logger.log("rejecting message", content);
      return;
    }
  };

  send = (message) => {
    message.peerName = MeetJS.userName;
    message.peerId = this.id;
    if (this.readyState === this.OPEN) {
      this.superSend(JSON.stringify(message));
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
      Logger.log(
        "Socket is closed. Reconnect will be attempted in " +
          reconnectTimeout +
          " second.",
        e.reason
      );
      setTimeout(function () {
        Logger.log("reconneting .....");
        MeetJS.emit(MeetJS.LOCAL_EVENTS.RECONNECT);
      }, reconnectTimeout * this.SECOND);
    } else {
      Logger.log(
        "Socket is closed. Reconnection is Disabled/Exceded Maximum limit.",
        e.reason
      );
      return;
    }
  };
}

module.exports = SignalingChannel;

},{}],8:[function(require,module,exports){
// this module will have Stream events logic in it

const Stream = function () {
  this.connectMedia = (constrains) => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia(constrains)
        .then((stream) => {
          this.localStream = stream;
          resolve(true);
        })
        .catch((err) => {
          reject("can't able to connect to Media " + err);
        });
    });
  };

  this.toogleMute = ({ audio, video }) => {
    if (!this.localStream) {
      Logger.log("Connect to MediaDevices first!");
      return;
    }
    this.localStream.getTracks().forEach((track) => {
      if (track.kind === "video" && video) {
        track.enabled = !track.enabled;
      }
      if (track.kind === "audio" && audio) {
        track.enabled = !track.enabled;
      }
    });
  };

  this.stopMedia = ({ audio, video }) => {
    if (!this.localStream) {
      Logger.log("Connect to MediaDevices first!");
      return;
    }
    this.localStream.getTracks().forEach((track) => {
      if (track.kind === "video" && video) {
        track.stop();
      }
      if (track.kind === "audio" && audio) {
        track.stop();
      }
    });

    this.localStream = null;
  };

  this.disconnectDisplayShare = () => {
    if (!this.displayStream) {
      Logger.log("Connect to screenShare first!");
      return;
    }
    this.displayStream.getTracks().forEach((track) => {
      if (track.kind === "video") {
        track.stop();
      }
    });

    this.displayStream = null;
  };

  this.connectShareMedia = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((screen) => {
          this.displayStream = screen;
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

Stream.prototype.isMeetJS = true;

module.exports = Stream;

},{}],9:[function(require,module,exports){
const Utils = function () {};

Utils.prototype.isMeetJS = true;

Utils.prototype.arrayToKeyValue = (arr) => {
  let obj = {};

  arr.forEach(function (v) {
    obj[v] = v;
  });
};

Utils.prototype.keyValueToArray = (obj) => {
  let arr = Object.entries(obj);
  return arr;
};

Utils.prototype.getKeysFromObject = (obj) => {
  return Object.keys(obj);
};
module.exports = new Utils();

},{}]},{},[5])(5)
});
