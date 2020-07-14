!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).MeetJS=e()}}((function(){return function e(t,s,n){function o(r,a){if(!s[r]){if(!t[r]){var E="function"==typeof require&&require;if(!a&&E)return E(r,!0);if(i)return i(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var c=s[r]={exports:{}};t[r][0].call(c.exports,(function(e){return o(t[r][1][e]||e)}),c,c.exports,e,t,s,n)}return s[r].exports}for(var i="function"==typeof require&&require,r=0;r<n.length;r++)o(n[r]);return o}({1:[function(e,t,s){t.exports={SOCKET_EVENTS:{CALL:"CALL",ACCEPT:"ACCEPT",OFFER:"OFFER",ANSWER:"ANSWER",CANDIDATE:"CANDIDATE",PING:"PING",PONG:"PONG",REJECT:"REJECT",CANCEL:"CANCEL",CANCELLED:"CANCELLED",REJECTED:"REJECTED",INVITE:"INVITE",BYE:"BYE",MESSAGE:"MESSAGE",CONFERENCE:"CONFERENCE",READY:"READY",CONNECTED:"CONNECTED",DISCONNECTED:"DISCONNECTED"},LOCAL_EVENTS:{CONNECT_LOCAL_VIDEO:"CONNECT_LOCAL_VIDEO",DEVICE_CONNECTED:"DEVICE_CONNECTED",REMOVE_USER:"REMOVE_USER",RECEIVED_MESSAGE:"RECEIVED_MESSAGE",CONFERENCE:"CONFERENCE",CONNECT_CONFERENCE:"CONNECT_CONFERENCE",SEND_MESSAGE:"SEND_MESSAGE",CONNECT:"CONNECT",RECONNECT:"RECONNECT"}}},{}],2:[function(e,t,s){const n=e("./Constants");t.exports=function(e){return e.events={},e.SOCKET_EVENTS=n.SOCKET_EVENTS,e.LOCAL_EVENTS=n.LOCAL_EVENTS,e.on=function(t,s){return"object"!=typeof e.events[t]&&(e.events[t]=[]),e.events[t].push(s),this},e.off=function(t,s){let n;"object"==typeof e.events[t]&&(n=e.events[t].indexOf(s),n>-1&&e.events[t].splice(n,1))},e.emit=function(t){var s,n,o,i=[].slice.call(arguments,1);if("object"==typeof e.events[t])for(o=(n=e.events[t].slice()).length,s=0;s<o;s++)n[s].apply(e,i)},e.once=function(t,s){e.on(t,(function n(){e.off(t,n),s.apply(e,arguments)}))},this}},{"./Constants":1}],3:[function(e,t,s){const n={iceServers:[{urls:["stun:stun.l.google.com:19302"]},{urls:["turn:numb.viagenie.ca","turn:numb.viagenie.ca?transport=tcp"],credential:"muazkh",username:"webrtc@live.com"},{urls:["turn:numb.viagenie.ca","turn:numb.viagenie.ca?transport=tcp"],username:"normanarguet@gmail.com",credential:"1ceCre4m007"}]},o={optional:[{RtpDataChannels:!0}]},i={offerToReceiveAudio:!0,offerToReceiveVideo:!0};class r extends RTCPeerConnection{constructor(e,t=null){super(n,o),this.remotePeer=e,this.rStream=null,this.lStream=null,this.gotStream=null,this.intimateOffer=null,this.awaitOffer=null,this.handleCallEvents=null,this.configureDataChannel(),super.onicecandidate=this.onicecandidate,super.onnegotiationneeded=this.onnegotiationneeded,super.ontrack=this.ontrack,console.log(e+" peer started")}configureDataChannel=()=>{this.dataChannel=this.createDataChannel("dataChannel",{reliable:!0}),this.dataChannel.onerror=function(e){console.log("Error occured on datachannel:",e)},this.dataChannel.onmessage=function(e){console.log("message:",e)},this.dataChannel.onclose=function(){console.log("data channel is closed")},this.callState=!1};configureStream=e=>{e&&(this.lStream=e,e.getTracks().forEach(t=>this.addTrack(t,e)),console.log("stream added : "+e.id))};ontrack=e=>{this.lStream.id!==e.streams[0].id&&(console.log("stream received"),console.log(e.streams[0]),this.rStream=e.streams[0],this.gotStream(this))};sendMessage=e=>{console.log("Messaging via data channel"),this.dataChannel.send(JSON.stringify(e))};sendOffer=e=>{this.remotePeer=e,this.createOffer(i).then(this.prepareOffer).catch(e=>this.onError(e))};prepareOffer=e=>{this.localOffer=e,this.setLocalDescription(e),console.log("sending offer"),MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.OFFER,data:e})};onnegotiationneeded=()=>{this.callState&&(this.sendOffer(this.remotePeer),console.log("re negotiation is happening"))};onicecandidate=e=>{e.candidate&&(MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.CANDIDATE,data:e.candidate}),console.log("sending iceCandidate to "+this.remotePeer))};acceptOffer=e=>this.sendOffer(e);sendInvite=e=>{MeetJS.send({remotePeer:e,event:MeetJS.SOCKET_EVENTS.INVITE})};rejectOffer=e=>{console.log(this.remotePeer,e),this.remotePeer===e?MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.REJECT,data:"i can't take calls right now"}):console.log("Peer Invalid")};cancelOffer=e=>{this.remotePeer===e&&MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.CANCEL})};endCall=()=>{MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.BYE,data:"I am gonna end the call!"})};handleOffer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.createAnswer().then(e=>{this.setLocalDescription(e),MeetJS.send({remotePeer:this.remotePeer,event:MeetJS.SOCKET_EVENTS.ANSWER,data:e}),this.callState=!0,console.log("connection established successfully!!")}).catch(e=>this.onError(e))};handleCandidate=e=>{this.addIceCandidate(new RTCIceCandidate(e)),console.log("Candidate received")};handleAnswer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.callState=!0,console.log("connection established successfully!!")};onError=e=>{console.error(e)}}t.exports=r},{}],4:[function(e,t,s){const n=e("./SignalingChannel"),o=e("./MeetPeer"),i=e("./MessageHandler"),r=e("./EventEmitter"),a=function(e){r(this),this.users=[],this.activeUsers=[],this.isActiveStatus=!1;var t=3;this.getRemainingAttempts=()=>t,this.localVideo=async()=>{let t=await navigator.mediaDevices.getUserMedia(e.mediaConstrains||this.DEFAULT_PROPS.mediaConstrains);this.localStream=t,this.emit(this.LOCAL_EVENTS.DEVICE_CONNECTED)},this.on(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO,this.localVideo);var s=t=>{t||console.log("No userName provided, Fallback to random"),this.userName=t||this.DEFAULT_PROPS.defaultUserName,this.transport=new n(this.userName,(e.contextPath?e.contextPath:"meet")+(e.token?"?jwt="+e.token:""),e.url||this.DEFAULT_PROPS.transportUrl.local),this.transport.onready=e=>{this.emit(this.SOCKET_EVENTS.READY,e)},this.transport.onMessage=e=>{i(e)}};this.on(this.LOCAL_EVENTS.RECONNECT,()=>{t-=1,console.log("remaining attempts",t),s(this.userName)}),this.on(this.LOCAL_EVENTS.CONNECT,s),this.send=e=>this.transport.send(e),this.on(this.LOCAL_EVENTS.SEND_MESSAGE,({remotePeer:e,data:t})=>{this.transport.send({peerName:this.userName,remotePeer:e,event:this.SOCKET_EVENTS.MESSAGE,data:t})});var a=e=>{var t;return this.users[e]?("failed"===(t=this.users[e]).connectionState&&(delete this.users[e],t=l(e)),t):t=l(e)};this.getUser=a,this.on(this.SOCKET_EVENTS.CONFERENCE,({remotePeer:e,users:t})=>{this.transport.send({peerName:this.userName,remotePeer:e,event:this.SOCKET_EVENTS.CONFERENCE,data:{users:t}})}),this.on(this.LOCAL_EVENTS.CONNECT_CONFERENCE,e=>{e.users&&(console.log("confere",e),window.conference=e.users,e.users.forEach(e=>{a(e).sendOffer(e)}))}),this.on("createOrGetUser",e=>a(e)),this.on(this.SOCKET_EVENTS.CALL,e=>{console.log("calling "+e),this.emit(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO),this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED,()=>{a(e).sendInvite(e)})}),this.on(this.SOCKET_EVENTS.ACCEPT,e=>{console.log("accepting invite from "+e),this.emit(this.LOCAL_EVENTS.CONNECT_LOCAL_VIDEO),this.once(this.LOCAL_EVENTS.DEVICE_CONNECTED,()=>{a(e).acceptOffer(e)})}),this.on(this.SOCKET_EVENTS.CANCEL,e=>{console.log("cancelling the invite from "+e),a(e).cancelOffer(e)}),this.on(this.SOCKET_EVENTS.REJECT,e=>{console.log("rejecting the invite from "+e),a(e).rejectOffer(e)}),this.on(this.SOCKET_EVENTS.BYE,e=>{console.log("Hanging up call with "+e),a(e).endCall(),this.emit(this.LOCAL_EVENTS.REMOVE_USER,e)}),this.on(this.LOCAL_EVENTS.REMOVE_USER,e=>{a(e).close(),delete this.users[e],this.emit(this.SOCKET_EVENTS.DISCONNECTED,e)});var E=e=>{var t=e.currentTarget;"disconnected"===t.connectionState&&this.emit(this.SOCKET_EVENTS.DISCONNECTED,t.remotePeer),console.log(t.remotePeer,t.connectionState)},l=e=>{var t=new o(e);return t.gotStream=e=>{this.emit(this.SOCKET_EVENTS.CONNECTED,e)},t.onconnectionstatechange=E,t.configureStream(this.localStream),this.users[e]=t,t};window.MeetJS=this};a.prototype.DEFAULT_PROPS={defaultUserName:"user"+Math.floor(100*Math.random())+1,transportUrl:{origin:window.location.origin.replace("http","ws"),local:"ws://localhost:8080",remote:"wss://meet-v1.herokuapp.com"},mediaConstrains:{video:!0,audio:!0}},t.exports=a},{"./EventEmitter":2,"./MeetPeer":3,"./MessageHandler":5,"./SignalingChannel":6}],5:[function(e,t,s){const n=e=>{console.log("received offer"),MeetJS.getUser(e.peerName).handleOffer(e.data)},o=e=>{console.log("received iceCandidate from "+e.peerName),MeetJS.getUser(e.peerName).handleCandidate(e.data)},i=e=>{console.log("received answer"),MeetJS.getUser(e.peerName).handleAnswer(e.data)};t.exports=e=>{switch(console.log("MessageHandler",e),e.event){case MeetJS.SOCKET_EVENTS.OFFER:n(e);break;case MeetJS.SOCKET_EVENTS.ANSWER:i(e);break;case MeetJS.SOCKET_EVENTS.CANDIDATE:o(e);break;case MeetJS.SOCKET_EVENTS.REJECT:console.log("received call event"),MeetJS.emit(MeetJS.SOCKET_EVENTS.REJECTED,e.peerName);break;case MeetJS.SOCKET_EVENTS.CANCEL:console.log("received call event"),MeetJS.emit(MeetJS.SOCKET_EVENTS.CANCELLED,e.peerName);break;case MeetJS.SOCKET_EVENTS.INVITE:console.log("received invite"),MeetJS.emit(MeetJS.SOCKET_EVENTS.INVITE,e.peerName);break;case MeetJS.SOCKET_EVENTS.BYE:MeetJS.emit(MeetJS.LOCAL_EVENTS.REMOVE_USER,e.peerName);break;case MeetJS.SOCKET_EVENTS.MESSAGE:MeetJS.emit(MeetJS.LOCAL_EVENTS.RECEIVED_MESSAGE,{userName:e.peerName,data:e.data});case MeetJS.SOCKET_EVENTS.CONFERENCE:MeetJS.emit(MeetJS.LOCAL_EVENTS.CONNECT_CONFERENCE,e.data)}}},{}],6:[function(e,t,s){class n extends WebSocket{constructor(e=null,t="",s=null){super(((e,t)=>{const s=(e?"":"https:"===window.location.protocol?"wss://":"ws://")+(null!==e?e:window.location.host)+"/"+t;return console.log("connecting... to "+s," with userName :"+MeetJS.userName),s})(s,t)),this.getUser=null,super.onmessage=this.onmessage,super.onopen=this.onopen,super.onclose=this.onclose,super.onerror=this.onerror,this.PING_INTERVAL=29,this.SECOND=1e3,this.id=Math.floor(2*Math.random())+1}keepAlive=()=>{var e=this.PING_INTERVAL*this.SECOND;this.readyState===this.OPEN&&(console.log("Pinging server ... idle timeout: "+e/this.SECOND+"s"),this.send({event:MeetJS.SOCKET_EVENTS.PING,data:{message:"hello"}})),this.timerId=setTimeout(this.keepAlive,e)};updateActiveUsers=e=>{if(MeetJS.activeUsers[e]){console.log(e," is Online!");var t=MeetJS.activeUsers[e];t.isOnline=!0,t.lastPing=new Date(Date.now()),clearTimeout(t.timeout),t.timeout=setTimeout(()=>{console.log(e," is Offline!"),MeetJS.activeUsers[e].isOnline=!1,setTimeout(()=>{MeetJS.activeUsers[e].isOnline||(delete MeetJS.activeUsers[e],console.log(e," is not longer active!"))},1e4)},28e3)}else console.log(e," is Online!"),MeetJS.activeUsers[e]={userName:e,lastPing:new Date(Date.now()),isOnline:!0,timeout:setTimeout(()=>{console.log(e," is Offline!"),MeetJS.activeUsers[e].isOnline=!1,setTimeout(()=>{MeetJS.activeUsers[e].isOnline||(delete MeetJS.activeUsers[e],console.log(e," is not longer active!"))},1e4)},28e3)}};cancelKeepAlive=()=>{this.timerId&&clearTimeout(this.timerId)};onopen=()=>{this.onready(this.url),this.keepAlive()};onmessage=e=>{const t=JSON.parse(e.data);if(t.event!==MeetJS.SOCKET_EVENTS.PONG){if(t.peerName===MeetJS.userName);else if(t.event===MeetJS.SOCKET_EVENTS.PING)this.updateActiveUsers(t.peerName);else if(t.remotePeer===MeetJS.userName)return void this.onMessage(t)}else console.log("server pong")};send=e=>{e.peerName=MeetJS.userName,e.peerId=this.id,this.readyState!==this.OPEN?setTimeout(()=>{this.send(e)},1e3):super.send(JSON.stringify(e))};onerror=e=>{this.close()};onclose=e=>{if(this.cancelKeepAlive(),MeetJS.getRemainingAttempts()>0){var t=3===MeetJS.getRemainingAttempts()?10:2===MeetJS.getRemainingAttempts()?20:30;console.log("Socket is closed. Reconnect will be attempted in "+t+" second.",e.reason),setTimeout((function(){console.log("reconneting ....."),MeetJS.emit(MeetJS.LOCAL_EVENTS.RECONNECT)}),t*this.SECOND)}else console.log("Socket is closed. Reconnection is Disabled/Exceded Maximum limit.",e.reason)}}t.exports=n},{}]},{},[4])(4)}));