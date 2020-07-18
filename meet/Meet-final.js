!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).MeetJS=e()}}((function(){return function e(t,o,n){function s(r,a){if(!o[r]){if(!t[r]){var E="function"==typeof require&&require;if(!a&&E)return E(r,!0);if(i)return i(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var c=o[r]={exports:{}};t[r][0].call(c.exports,(function(e){return s(t[r][1][e]||e)}),c,c.exports,e,t,o,n)}return o[r].exports}for(var i="function"==typeof require&&require,r=0;r<n.length;r++)s(n[r]);return s}({1:[function(e,t,o){t.exports={SOCKET_EVENTS:{CALL:"CALL",ACCEPT:"ACCEPT",OFFER:"OFFER",ANSWER:"ANSWER",CANDIDATE:"CANDIDATE",PING:"PING",PONG:"PONG",REJECT:"REJECT",CANCEL:"CANCEL",CANCELLED:"CANCELLED",REJECTED:"REJECTED",INVITE:"INVITE",BYE:"BYE",BABYE:"BABYE",MESSAGE:"MESSAGE",CONFERENCE:"CONFERENCE",READY:"READY",CONNECTED:"CONNECTED",DISCONNECTED:"DISCONNECTED"},LOCAL_EVENTS:{CONNECT_MEDIA:"CONNECT_MEDIA",DEVICE_CONNECTED:"DEVICE_CONNECTED",REMOVE_USER:"REMOVE_USER",RECEIVED_MESSAGE:"RECEIVED_MESSAGE",CONFERENCE:"CONFERENCE",CONNECT_CONFERENCE:"CONNECT_CONFERENCE",SEND_MESSAGE:"SEND_MESSAGE",CONNECT:"CONNECT",RECONNECT:"RECONNECT",MUTE_AUDIO:"MUTE_AUDIO",MUTE_VIDEO:"MUTE_VIDEO",STOP_MEDIA:"STOP_MEDIA"}}},{}],2:[function(e,t,o){const n=e("./Constants");t.exports=function(e){return e.events={},e.SOCKET_EVENTS=n.SOCKET_EVENTS,e.LOCAL_EVENTS=n.LOCAL_EVENTS,e.on=function(t,o){return"object"!=typeof e.events[t]&&(e.events[t]=[]),e.events[t].push(o),this},e.off=function(t,o){let n;"object"==typeof e.events[t]&&(n=e.events[t].indexOf(o),n>-1&&e.events[t].splice(n,1))},e.emit=function(t){var o,n,s,i=[].slice.call(arguments,1);if("object"==typeof e.events[t])for(s=(n=e.events[t].slice()).length,o=0;o<s;o++)n[o].apply(e,i)},e.once=function(t,o){e.on(t,(function n(){e.off(t,n),o.apply(e,arguments)}))},this}},{"./Constants":1}],3:[function(e,t,o){const n=function(){};window.Logger=new n,window.Logger.logs=[];n.prototype.isMeetJS=!0,n.prototype.logMessage=function(e,t){let o=`${t} - ${e} - ${(new Date).toLocaleString()}`;n.logs||(n.logs=[]),n.logs.push(o)},n.prototype.print=function(){if(!n.logs||0===n.logs.length)return;let e="";n.logs.forEach((function(t,o){e+=""+t,o!==n.logs.length&&(e+="\n")}));let t="data:application/octet-stream,"+encodeURIComponent(e);var o=document.createElement("a");return o.href=t,o.download=`MeetJS-log-${(new Date).toLocaleString()}.txt`,o.click(),"log file is downloading....."},["log","info","warn","error"].forEach((function(e){n.prototype[e]=function(){if(!MeetJS.debug)return;if(1===arguments.length)return console[e](arguments[0]),void n.prototype.logMessage(e,arguments[0]);if("object"==typeof arguments[0])throw new Error("log group name cannot be object");const t=arguments[0];console.group(t),[...arguments].forEach((function(o,s){0!==s&&(console[e](o),n.prototype.logMessage(e,`${t} - ${o}`))})),console.groupEnd()}})),t.exports=n},{}],4:[function(e,t,o){const n={iceServers:[{urls:["turn:207.148.124.163:3478","turn:207.148.124.163:3478?transport=tcp"],username:"1595116987",credential:"BJFqBUW7gC3OROEG7Xhthn6x54U="}]},s={optional:[{RtpDataChannels:!0}]};class i extends RTCPeerConnection{constructor(e,t=null){super(n,s),this.remotePeer=e,this.rStream=null,this.lStream=null,this.gotStream=null,this.intimateOffer=null,this.awaitOffer=null,this.handleCallEvents=null,this.configureDataChannel(),super.onicecandidate=this.onicecandidate,super.onnegotiationneeded=this.onnegotiationneeded,super.ontrack=this.ontrack,console.log(e+" peer started")}configureDataChannel=()=>{this.dataChannel=this.createDataChannel("dataChannel",{reliable:!0}),this.dataChannel.onerror=function(e){console.log("Error occured on datachannel:",e)},this.dataChannel.onmessage=function(e){console.log("message:",e)},this.dataChannel.onclose=function(){console.log("data channel is closed")},this.callState=!1};initConfiguration=e=>MeetJS.customConfig?(console.log("configuration Applied successfully"),void this.setConfiguration(e)):void console.log("failed to set Custom ConFig");getOfferOptions=()=>({offerToReceiveAudio:!0,offerToReceiveVideo:!0});configureStream=e=>{e&&(this.lStream=e,e.getTracks().forEach(t=>this.addTrack(t,e)),console.log("stream added : "+e.id))};ontrack=e=>{this.lStream.id!==e.streams[0].id&&(console.log("stream received"),console.log(e.streams[0]),this.rStream=e.streams[0],this.gotStream(this))};sendMessage=e=>{console.log("Messaging via data channel"),this.dataChannel.send(JSON.stringify(e))};sendOffer=()=>{this.createOffer(this.getOfferOptions()).then(this.prepareOffer).catch(e=>this.onError(e))};prepareOffer=e=>{this.setLocalDescription(e),console.log("sending offer"),MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.OFFER,data:e})};onnegotiationneeded=()=>{this.callState&&(this.sendOffer(this.remotePeer),console.log("re negotiation is happening"))};onicecandidate=e=>{e.candidate&&(MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.CANDIDATE,data:e.candidate}),console.log("sending iceCandidate to "+this.remotePeer))};acceptOffer=()=>this.sendOffer();sendInvite=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.INVITE})};rejectOffer=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.REJECT,data:"i can't take calls right now"})};cancelOffer=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.CANCEL})};endCall=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.BYE,data:"I am gonna end the call!"})};endCallBye=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.BABYE,data:"I am gonna end the call!"})};handleOffer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.createAnswer().then(e=>{this.setLocalDescription(e),MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.ANSWER,data:e}),this.callState=!0,console.log("connection established successfully!!")}).catch(e=>this.onError(e))};handleCandidate=e=>{this.addIceCandidate(new RTCIceCandidate(e)),console.log("Candidate received")};handleAnswer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.callState=!0,console.log("connection established successfully!!")};onError=e=>{console.error(e)}}t.exports=i},{}],5:[function(e,t,o){const n=e("./SignalingChannel"),s=e("./MeetPeer"),i=e("./Stream"),r=e("./MessageHandler"),a=e("./EventEmitter"),E=(e("./Logger"),e("./Utils")),l=function(e){window.MeetJS=this,a(this);var t=new i;this.users=[],this.activeUsers=[],this.debug=e.debug,this.customConfig=e.customConfig||!1;var o=e.autoRevokeMedia||!1,l=3;this.getActiveCallUsers=()=>E.getKeysFromObject(this.users),this.getRemainingAttempts=()=>l;this.getLocalStream=()=>{if(t.localStream)return t.localStream;throw new Error("Connect to camera first!")},this.on(this.LOCAL_EVENTS.CONNECT_MEDIA,()=>{t.connectMedia(e.mediaConstrains||this.DEFAULT_PROPS.mediaConstrains).then(e=>{e&&this.emit(this.LOCAL_EVENTS.DEVICE_CONNECTED)}).catch(e=>{console.log(e)})});var c=t=>{t||console.log("No userName provided, Fallback to random"),this.userName=t||this.DEFAULT_PROPS.defaultUserName(),this.transport=new n(this.userName,(e.contextPath?e.contextPath:"meet")+(e.token?"?jwt="+e.token:""),e.url||this.DEFAULT_PROPS.transportUrl.local),this.transport.onready=e=>{this.emit(this.SOCKET_EVENTS.READY,e)},this.transport.onMessage=e=>{r(e)}};this.on(this.LOCAL_EVENTS.RECONNECT,()=>{l<=0||(l-=1,console.log("remaining attempts",l),c(this.userName))}),this.on(this.LOCAL_EVENTS.CONNECT,c),this.send=e=>this.transport.send(e),this.on(this.LOCAL_EVENTS.SEND_MESSAGE,({remotePeer:e,data:t})=>{this.transport.send({remotePeer:e,event:this.SOCKET_EVENTS.MESSAGE,data:t})});var S=e=>{var t;return this.users[e]?("failed"===(t=this.users[e]).connectionState&&(delete this.users[e],t=C(e)),t):t=C(e)};this.getUser=S,this.on(this.LOCAL_EVENTS.MUTE_AUDIO,()=>t.toogleMute({audio:!0})),this.on(this.LOCAL_EVENTS.MUTE_VIDEO,()=>t.toogleMute({video:!0})),this.on(this.LOCAL_EVENTS.STOP_MEDIA,()=>t.stopMedia({audio:!0,video:!0})),this.on(this.SOCKET_EVENTS.CONFERENCE,({remotePeer:e,users:t})=>{this.transport.send({remotePeer:e,event:this.SOCKET_EVENTS.CONFERENCE,data:{users:t}})}),this.on(this.LOCAL_EVENTS.CONNECT_CONFERENCE,e=>{e.users&&(console.log("confere",e),window.conference=e.users,e.users.forEach(e=>{h("sendOffer",e)}))}),this.on("createOrGetUser",e=>S(e)),this.on(this.SOCKET_EVENTS.CALL,e=>{console.log("calling "+e),this.emit(this.LOCAL_EVENTS.CONNECT_MEDIA),this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED,()=>{h("sendInvite",e)})}),this.on(this.SOCKET_EVENTS.ACCEPT,e=>{console.log("accepting invite from "+e),this.emit(this.LOCAL_EVENTS.CONNECT_MEDIA),this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED,()=>{h("acceptOffer",e)})}),this.on(this.SOCKET_EVENTS.CANCEL,e=>{console.log("cancelling the invite from "+e),h("cancelOffer",e)}),this.on(this.SOCKET_EVENTS.REJECT,e=>{console.log("rejecting the invite from "+e),h("rejectOffer",e)}),this.on(this.SOCKET_EVENTS.BYE,e=>{console.log("Hanging up call with "+e),h("endCall",e)}),this.on(this.LOCAL_EVENTS.REMOVE_USER,e=>{h("close",e),delete this.users[e],this.emit(this.SOCKET_EVENTS.DISCONNECTED,e)});var h=(e,t)=>{S(t)[e]()},d=e=>{var t=e.currentTarget;"failed"===t.connectionState&&this.emit(this.SOCKET_EVENTS.DISCONNECTED,t.remotePeer),console.log(t.remotePeer,t.connectionState)};this.on(this.SOCKET_EVENTS.CONNECTED,()=>{this.on(this.SOCKET_EVENTS.DISCONNECTED,()=>{o?(console.log("autoRevokeMedia is enabled"),this.emit(this.LOCAL_EVENTS.STOP_MEDIA)):console.log("autoRevokeMedia is disabled","revoke userMedia by emiting STOP_MEDIA")})});var C=e=>{var o=new s(e);return o.gotStream=e=>{this.emit(this.SOCKET_EVENTS.CONNECTED,e)},o.onconnectionstatechange=d,o.configureStream(t.localStream),this.users[e]=o,o}};l.prototype.DEFAULT_PROPS={defaultUserName:function(){return"user"+Math.floor(100*Math.random())+1},transportUrl:{origin:window.location.origin.replace("http","ws"),local:"ws://localhost:8080",remote:"wss://meet-v1.herokuapp.com"},mediaConstrains:{video:!0,audio:!0}},t.exports=l},{"./EventEmitter":2,"./Logger":3,"./MeetPeer":4,"./MessageHandler":6,"./SignalingChannel":7,"./Stream":8,"./Utils":9}],6:[function(e,t,o){const n=e=>{console.log("received Bye"),MeetJS.emit(MeetJS.LOCAL_EVENTS.REMOVE_USER,e.peerName),MeetJS.getUser(e.peerName).endCallBye()},s=e=>{(console.log("received invite"),e.configuration)&&MeetJS.getUser(e.peerName).initConfiguration(e.configuration);MeetJS.emit(MeetJS.SOCKET_EVENTS.INVITE,e.peerName)},i=e=>{console.log("received offer");var t=MeetJS.getUser(e.peerName);e.configuration&&t.initConfiguration(e.configuration),t.handleOffer(e.data)},r=e=>{console.log("received iceCandidate from "+e.peerName),MeetJS.getUser(e.peerName).handleCandidate(e.data)},a=e=>{console.log("received answer"),MeetJS.getUser(e.peerName).handleAnswer(e.data)};t.exports=e=>{switch(console.log("MessageHandler",e),e.event){case MeetJS.SOCKET_EVENTS.OFFER:i(e);break;case MeetJS.SOCKET_EVENTS.ANSWER:a(e);break;case MeetJS.SOCKET_EVENTS.CANDIDATE:r(e);break;case MeetJS.SOCKET_EVENTS.REJECT:console.log("received call event"),MeetJS.emit(MeetJS.SOCKET_EVENTS.REJECTED,e.peerName);break;case MeetJS.SOCKET_EVENTS.CANCEL:console.log("received call event"),MeetJS.emit(MeetJS.SOCKET_EVENTS.CANCELLED,e.peerName);break;case MeetJS.SOCKET_EVENTS.INVITE:s(e);break;case MeetJS.SOCKET_EVENTS.BYE:n(e);break;case MeetJS.SOCKET_EVENTS.BABYE:console.log("received BaBye"),MeetJS.emit(MeetJS.LOCAL_EVENTS.REMOVE_USER,e.peerName);break;case MeetJS.SOCKET_EVENTS.MESSAGE:MeetJS.emit(MeetJS.LOCAL_EVENTS.RECEIVED_MESSAGE,{userName:e.peerName,data:e.data});case MeetJS.SOCKET_EVENTS.CONFERENCE:MeetJS.emit(MeetJS.LOCAL_EVENTS.CONNECT_CONFERENCE,e.data)}}},{}],7:[function(e,t,o){class n extends WebSocket{constructor(e=null,t="",o=null){super(((e,t)=>{const o=(e?"":"https:"===window.location.protocol?"wss://":"ws://")+(null!==e?e:window.location.host)+"/"+t;return console.log("connecting... to "+o," with userName :"+MeetJS.userName),o})(o,t)),this.getUser=null,super.onmessage=this.onmessage,super.onopen=this.onopen,super.onclose=this.onclose,super.onerror=this.onerror,this.superSend=super.send,this.PING_INTERVAL=29,this.SECOND=1e3,this.id=Math.floor(2*Math.random())+1}keepAlive=()=>{var e=this.PING_INTERVAL*this.SECOND;this.readyState===this.OPEN&&(console.log("Pinging server ... idle timeout: "+e/this.SECOND+"s"),this.send({event:MeetJS.SOCKET_EVENTS.PING,data:{message:"hello"}})),this.timerId=setTimeout(this.keepAlive,e)};updateActiveUsers=e=>{if(MeetJS.activeUsers[e]){console.log(e," is Online!");var t=MeetJS.activeUsers[e];t.isOnline=!0,t.lastPing=new Date(Date.now()),clearTimeout(t.timeout),t.timeout=setTimeout(()=>{console.log(e," is Offline!"),MeetJS.activeUsers[e].isOnline=!1,setTimeout(()=>{MeetJS.activeUsers[e].isOnline||(delete MeetJS.activeUsers[e],console.log(e," is not longer active!"))},1e4)},28e3)}else console.log(e," is Online!"),MeetJS.activeUsers[e]={userName:e,lastPing:new Date(Date.now()),isOnline:!0,timeout:setTimeout(()=>{console.log(e," is Offline!"),MeetJS.activeUsers[e].isOnline=!1,setTimeout(()=>{MeetJS.activeUsers[e].isOnline||(delete MeetJS.activeUsers[e],console.log(e," is not longer active!"))},1e4)},28e3)}};cancelKeepAlive=()=>{this.timerId&&clearTimeout(this.timerId)};onopen=()=>{this.onready(this.url),this.keepAlive()};onmessage=e=>{const t=JSON.parse(e.data);if(t.event!==MeetJS.SOCKET_EVENTS.PONG){if(t.peerName===MeetJS.userName);else if(t.event===MeetJS.SOCKET_EVENTS.PING)this.updateActiveUsers(t.peerName);else if(t.remotePeer===MeetJS.userName)return void this.onMessage(t)}else console.log("server pong")};send=e=>{e.peerName=MeetJS.userName,e.peerId=this.id,this.readyState!==this.OPEN?setTimeout(()=>{this.send(e)},1e3):this.superSend(JSON.stringify(e))};onerror=e=>{this.close()};onclose=e=>{if(this.cancelKeepAlive(),MeetJS.getRemainingAttempts()>0){var t=3===MeetJS.getRemainingAttempts()?10:2===MeetJS.getRemainingAttempts()?20:30;console.log("Socket is closed. Reconnect will be attempted in "+t+" second.",e.reason),setTimeout((function(){console.log("reconneting ....."),MeetJS.emit(MeetJS.LOCAL_EVENTS.RECONNECT)}),t*this.SECOND)}else console.log("Socket is closed. Reconnection is Disabled/Exceded Maximum limit.",e.reason)}}t.exports=n},{}],8:[function(e,t,o){const n=function(){this.connectMedia=e=>new Promise((t,o)=>{navigator.mediaDevices.getUserMedia(e).then(e=>{this.localStream=e,t(!0)}).catch(e=>{o("can't able to connect to Media "+e)})}),this.toogleMute=({audio:e,video:t})=>{this.localStream?this.localStream.getTracks().forEach(o=>{"video"===o.kind&&t&&(o.enabled=!o.enabled),"audio"===o.kind&&e&&(o.enabled=!o.enabled)}):console.log("Connect to MediaDevices first!")},this.stopMedia=({audio:e,video:t})=>{this.localStream?this.localStream.getTracks().forEach(o=>{"video"===o.kind&&t&&o.stop(),"audio"===o.kind&&e&&o.stop()}):console.log("Connect to MediaDevices first!")}};n.prototype.isMeetJS=!0,t.exports=n},{}],9:[function(e,t,o){const n=function(){};n.prototype.isMeetJS=!0,n.prototype.arrayToKeyValue=e=>{let t={};e.forEach((function(e){t[e]=e}))},n.prototype.keyValueToArray=e=>Object.entries(e),n.prototype.getKeysFromObject=e=>Object.keys(e),t.exports=new n},{}]},{},[5])(5)}));