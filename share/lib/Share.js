var ShareJS = function (props) {
  if (!(this instanceof ShareJS)) return new ShareJS(props);

  if (!props) throw new Error("Atleast 1 argument is required");

  window.shareJS = this;

  this.encoded = props.encoded || false;
  this.maxChannels = props.channels || 1;
  this.fileQueuing = props.fileQueuing || false;
  this.autoCreatePeerId = props.autoCreatePeerId || false;
  this.customFileId = props.customFileId || false;

  this.MAX_PARTS = props.maxParts || this.MAX_PARTS;
  this.CHUNK_MTU = props.chunkSize || this.CHUNK_MTU;

  if (this.autoCreatePeerId) {
    this.localId = ShareJS.prototype.generateId();
    console.log("auto generated LocalId : " + this.localId);
  } else if (!props.localId) {
    throw new Error("LocalId is null");
  } else {
    this.localId = props.localId;
  }

  console.log("ShareJS initialized with LocalId : " + this.localId);
};

ShareJS.prototype.peers = [];

ShareJS.prototype.addPeer = function (peer, peerId) {
  if (!(this instanceof ShareJS)) return;
  if (
    !peer ||
    (peer &&
      (!(peer instanceof RTCPeerConnection) ||
        peer.connectionState !== "connected"))
  ) {
    throw new Error("Argument is inValid / connection isn't established yet!");
  }
  if (!peerId) {
    if (this.autoCreatePeerId) {
      peerId = ShareJS.prototype.generateId();
      console.log("auto generated peerId : " + peerId);
    } else {
      throw new Error("PeerId is null");
    }
  }

  try {
    var negotiator = peer.createDataChannel(
      "ShareJS-negotiator",
      this.dataChannelOptions
    );

    negotiator.onopen = (e) => {
      //   console.log("ShareJS-negotiator opened", e);
    };
    negotiator.onmessage = negotiationHandler;

    ShareJS.prototype.peers[peerId] = {
      conn: peer,
      incoming: {},
      outgoing: {},
      channels: [],
      pendingFiles: [],
      negotiator,
    };
    console.log("ShareJS added peerId : " + peerId);

    return this;
  } catch (e) {
    console.error(e);
    throw new Error("problem while adding peer", e);
  }
};

ShareJS.prototype.removePeer = function (peerId) {
  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }
  console.log("ShareJS removed peerId : " + peerId);

  return delete this.peers[peerId];
};

ShareJS.prototype.generateId = (len) => {
  var length = len || 5;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

ShareJS.prototype.addDataChannel = function (peerId) {
  var { conn, channels } = ShareJS.prototype.peers[peerId];
  if (
    !conn ||
    (conn &&
      !(conn instanceof RTCPeerConnection) &&
      conn.connectionState !== "Connected")
  ) {
    throw new Error(
      "Argument is not valid / peer connection isn't established yet!"
    );
  }

  for (var i = 0; i < shareJS.maxChannels; i++) {
    ShareJS.prototype.dataChannelOptions.id =
      ShareJS.prototype.dataChannelOptions.id + 1;
    var temp = conn.createDataChannel(
      "ShareJS-Channel-" + (i + 1),
      ShareJS.prototype.dataChannelOptions
    );
    temp.onopen = function (e) {
      console.log(this.label + " opened");
    };
    temp.onerror = shareJS.onError;
    temp.onmessage = shareJS.onMessage;

    var onClose = function (e) {
      try {
        var { conn, channels } = shareJS.peers[peerId];
        channels.forEach((c, index) => {
          if (c.id === this.id) {
            channels.splice(index, 1);
          }
        });
        var temp1 = conn.createDataChannel(this.label, {
          negotiated: true,
          id: this.id,
        });
        temp1.onopen = () => {
          console.log(this.label, this.id, " re opened");
        };
        temp1.onerror = shareJS.onError;
        temp1.onmessage = shareJS.onMessage;
        temp1.onclose = onClose;
        channels.push(temp1);
      } catch (e) {
        console.log("peerConnection closed, can't reconnect " + this.label);
      }
    };
    temp.onclose = onClose;

    channels.push(temp);
  }
  if (channels.length === 0) {
    throw new Error("can't able to create DataChannels!");
  }
  return channels;
};

const negotiationHandler = function (e) {
  try {
    var msg = shareJS.decode(e.data, true);
    console.log("Got negotiation Msg", msg);
    if (msg.type && msg.type === "handshake-ping") {
      if (msg.peerId && !!ShareJS.prototype.peers[msg.peerId].conn) {
        ShareJS.prototype.addDataChannel(msg.peerId);
        var self = this;
        shareJS.onConnect({
          peerId: msg.peerId,
          accept: () => {
            self.send(
              shareJS.encode({
                type: "handshake-pong",
                peerId: shareJS.localId,
              })
            );
          },
        });
      } else {
        this.send(
          shareJS.encode({
            type: "handshake-error",
            peerId: shareJS.localId,
          })
        );
      }
    } else if (msg.type && msg.type === "handshake-pong") {
      if (msg.peerId && !!ShareJS.prototype.peers[msg.peerId].conn) {
        ShareJS.prototype.addDataChannel(msg.peerId);
        shareJS.onReady(msg.peerId);
      }
    } else if (msg.type && msg.type === "handshake-error") {
      throw new Error("Problem while doing handshake! : " + msg.peerId);
    }
  } catch (e) {}
};

ShareJS.prototype.startShare = function (peerId, files) {
  if (!(this instanceof ShareJS)) return;
  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }
  console.log("starting share  : " + peerId);

  var peer = this.peers[peerId];

  if (!!shareJS.fileQueuing) {
    console.log("file Queuing enabled");
  } else {
    console.log("file Queuing (not)enabled");
  }

  files.forEach((file, i) => {
    var info = ShareJS.prototype.getFileInfo(file);
    // if (info.blocks > shareJS.MAX_PARTS) {
    //   console.error(
    //     `File size is exceded the maximum supported amount : ${info.parts}`,
    //     `ignoring file : ${file.name}`
    //   );
    //   return;
    // }
    if (peer.outgoing.length > 0) {
      peer.outgoing = [];
    }
    var fileId;
    if (!!this.customFileId) {
      fileId = i;
    } else {
      fileId = `ShareJS-${Date.now()}-File-${
        i + Object.keys(peer.outgoing).length
      }`;
    }
    peer.outgoing[fileId] = {
      fileId: fileId,
      info,
      file: file,
      progress: 0,
      partsSent: 0,
    };
  });

  // Object.keys(peer.outgoing).forEach((fileId) => {
  //   shareJS.sendFile(peerId, peer, fileId);
  // });

  let fileInfo = [];
  Object.keys(peer.outgoing).forEach((fileId) => {
    // shareJS.sendFile(peerId, peer, fileId);
    fileInfo.push({
      fileId,
      info: peer.outgoing[fileId].info,
    });
  });

  shareJS.dataChannelSend(
    peerId,
    JSON.stringify({
      fileInfo,
      peerId: shareJS.localId,
      type: "files-info",
    })
  );
};

ShareJS.prototype.getBlockRange = function (blockId, options = {}) {
  // ---------------------------------
  // |    block 1   |     block 2    |
  // ---------------------------------
  // 0              1                2
  // (blocks - 2 , block - 1)
  //

  const chunkSize = options.partSize || this.CHUNK_MTU;
  const chunksPerAck = options.partsPerBlock || this.CHUNKS_PER_ACK;

  const begin = blockId * chunksPerAck - chunksPerAck;
  const end = blockId * chunksPerAck;

  return {
    id: blockId,
    chunks: chunksPerAck,
    block: {
      begin,
      end,
    },
    buffer: {
      begin: begin * chunkSize,
      end: end * chunkSize,
    },
  };
};

ShareJS.prototype.getChunksByBlockId = function (file, blockId) {
  if (!(this instanceof ShareJS)) return;
  return new Promise((resolve, reject) => {
    try {
      const { buffer } = this.getBlockRange(blockId);
      const reader = new FileReader();

      // Read the whole block from file
      const blockBlob = file.slice(
        buffer.begin,
        Math.min(buffer.end, file.size)
      );

      reader.onload = function (event) {
        if (reader.readyState === FileReader.DONE) {
          const blockBuffer = event.target.result;
          let start = 0,
            end = 0,
            parts = [];
          for (let i = 0; i < shareJS.CHUNKS_PER_ACK; i++) {
            end = Math.min(start + shareJS.CHUNK_MTU, blockBuffer.byteLength);
            let swap = blockBuffer.slice(start, end);
            if (swap.byteLength === 0) {
              continue;
            }
            parts[i] = swap;
            swap = null;
            start = end;
          }
          if (parts.length === 0) {
            throw new Error("no chunks");
          }
          resolve(parts);
        }
      };

      reader.readAsArrayBuffer(blockBlob);
    } catch (e) {
      reject(e);
    }
  });
};

ShareJS.prototype.sendFileBlock = function (peerId, fileId, blockId) {
  if (!(this instanceof ShareJS)) return;

  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }

  return new Promise(async (resolve, reject) => {
    try {
      console.groupCollapsed(`fileTransferLogs => block-${blockId}`);
      const peer = this.peers[peerId];
      const { outgoing } = peer;
      const { info, file } = outgoing[fileId];
      const chunks = await this.getChunksByBlockId(file, blockId);
      var interval = 0,
        queueLayer = 2;

      function sendChunkWithIndex(chunk, index) {
        var part = index + 1;
        // outgoing[fileId].partsSent = outgoing[fileId].partsSent + 1;
        // outgoing[fileId].progress = Math.floor(
        //   (outgoing[fileId].partsSent / info.parts) * 100
        // );
        outgoing[fileId].progress = Math.floor(
          (part / this.CHUNKS_PER_ACK) * 100
        );
        shareJS.dataChannelSend(
          peerId,
          JSON.stringify({
            fileId,
            peerId: shareJS.localId,
            type: "block-payload",
            blockId,
            part,
            payload: shareJS.arrayBufferToBase64(chunk),
          })
        );
        console.log(
          `part no. sent -- ${part} -- ${outgoing[fileId].progress} %`
        );
        shareJS.onProgress({
          peerId,
          fileId,
          info,
          progress: outgoing[fileId].progress,
          outgoing: true,
        });
      }

      // start
      shareJS.dataChannelSend(
        peerId,
        shareJS.encode({
          type: "block-begin",
          blockId,
          peerId: shareJS.localId,
          fileId,
          info,
        })
      );

      // process
      chunks.forEach((chunk, index) => {
        // Throttle the sending to avoid flooding
        setTimeout(function () {
          if (interval === shareJS.maxChannels * queueLayer) {
            console.log("sleep start - " + new Date(Date.now()));
            ShareJS.prototype.sleep(1 * 1000);
            console.log("sleep stop - " + new Date(Date.now()));
            interval = 0;
          } else {
            interval++;
          }

          sendChunkWithIndex(chunk, index);

          if ((index + 1) % 100 === 0) {
            console.log(`---------break at ${index + 1}---------`);
            ShareJS.prototype.sleep(5 * 1000);
          }
        }, 1 * 100); // this slows the file transfer significantly
      });

      // end
      setTimeout(() => {
        shareJS.dataChannelSend(
          peerId,
          shareJS.encode({
            type: "block-end",
            blockId,
            peerId: shareJS.localId,
            fileId,
            info,
          })
        );
      }, 5 * 1000);
      console.groupEnd();

      resolve(true);
    } catch (e) {
      shareJS.dataChannelSend(
        peerId,
        shareJS.encode({
          type: "block-failed",
          blockId,
          peerId: shareJS.localId,
          fileId,
        })
      );
      reject(e);
    }
  });
};

ShareJS.prototype.requestFileBlock = function (peerId, fileId, blockId) {
  if (!(this instanceof ShareJS)) return;

  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }

  shareJS.dataChannelSend(
    peerId,
    shareJS.encode({
      type: "block-request",
      blockId,
      peerId: shareJS.localId,
      fileId,
    })
  );
};

ShareJS.prototype.sleep = function (sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {}
};

ShareJS.prototype.dataChannelSend = function (peerId, msg) {
  if (!(this instanceof ShareJS)) return;

  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }
  var { channels } = this.peers[peerId];
  var id;
  if (channels.length > 1) {
    id = shareJS.getDataChannelId(channels.length);
  } else {
    id = channels.length - 1;
  }
  var send = (channel, payload) => {
    try {
      if (
        channel.readyState === "open" &&
        channel.bufferedAmount <= shareJS.CHUNK_MTU * shareJS.CHUNKS_PER_ACK
      ) {
        channel.send(msg);
      } else {
        console.log("waiting for 5ms to send.....");
        setTimeout(() => {
          send(channel, payload);
        }, 1 * 100);
      }
    } catch (e) {
      console.log("catched error" + e);
      throw new Error("problem while sending data " + e);
    }
  };
  try {
    send(channels[id], msg);
  } catch (e) {
    throw new Error(e);
  }
};

ShareJS.prototype.getDataChannelId = function (channelLength) {
  var canLog = false;
  if (canLog) console.groupCollapsed("getDataChannelId");
  if (!shareJS.lastConnectedChannels) {
    shareJS.lastConnectedChannels = [];
  } else {
    if (
      shareJS.lastConnectedChannels &&
      shareJS.lastConnectedChannels.length >= channelLength
    ) {
      if (canLog) console.log("shifting lastConnectedChannels");
      shareJS.lastConnectedChannels.shift();
    }
  }
  var bLen, aLen;
  bLen = shareJS.lastConnectedChannels.length;
  if (canLog)
    console.log(
      " before lastConnectedChannels ",
      shareJS.lastConnectedChannels
    );
  var result;
  for (var i = 0; i < channelLength; i++) {
    var id = i; //ShareJS.prototype.randomNumber(0, channelLength - 1);
    if (canLog) console.log(id + " --- id gen ");
    if (!shareJS.lastConnectedChannels.includes(id)) {
      if (canLog) console.log("filtered id : " + id);
      result = id;
      shareJS.lastConnectedChannels.push(id);
      break;
    }
    continue;
  }
  aLen = shareJS.lastConnectedChannels.length;
  if (canLog)
    console.log(" after lastConnectedChannels ", shareJS.lastConnectedChannels);
  if (canLog) console.log("datachannelId return ", result, channelLength);
  if (canLog) console.groupEnd();
  if (bLen + 1 !== aLen) {
    throw new Error("getDataChannelId error");
  }
  return result;
};

ShareJS.prototype.randomNumber = function (min, max) {
  //   if (!max && !min) {
  //     throw new Error("Either min / Max required!");
  //   }
  if (!min) min = 0;
  if (!max) max = 0;
  return Math.floor(min + Math.random() * (max + 1 - min));
};

ShareJS.prototype.onProgress = function ({
  peerId,
  fileId,
  info,
  progress,
  outgoing,
}) {
  console.log(
    info.fileId + " is in progress of " + info.size + "   " + progress
  );
};
ShareJS.prototype.connect = function (peerId, { initiator }) {
  var self = this;
  if (!(this instanceof ShareJS)) return;
  if (!initiator) return;
  if (!peerId) {
    throw new Error("PeerId is required!");
  }
  if (!this.peers[peerId]) {
    throw new Error("this peerId is not added!");
  }
  console.log("started handshaking with :" + peerId);

  var send = () => {
    if (self.peers[peerId].negotiator.readyState === "open") {
      self.peers[peerId].negotiator.send(
        shareJS.encode({
          type: "handshake-ping",
          peerId: self.localId,
        })
      );
      return;
    } else {
      setTimeout(send, 1 * 1000);
    }
  };
  send();
};

ShareJS.prototype.getFileInfo = function (file) {
  return {
    lastModifiedDate: file.lastModifiedDate,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    parts: Math.ceil(file.size / shareJS.CHUNK_MTU),
    blocks: Math.ceil(file.size / (shareJS.CHUNK_MTU * shareJS.CHUNKS_PER_ACK)),
  };
};

ShareJS.prototype.onReady = function (e) {
  console.log("ready " + e);
};

ShareJS.prototype.onClose = function (e) {};
ShareJS.prototype.onFileComplete = function (e) {
  e.save();
  window.file = e;
  console.log(e);
};
ShareJS.prototype.onFileBegin = function (e) {
  console.log(e);
};

ShareJS.prototype.onFileFailed = function (e) {
  console.log(e);
};
ShareJS.prototype.onError = function (e) {};
ShareJS.prototype.onClose = function (e) {};
ShareJS.prototype.onMessage = function (e) {
  var msg,
    data = e.data;
  try {
    msg = JSON.parse(data);
    if (msg.payload) {
      msg.payload = atob(msg.payload);
    }
  } catch (e) {
    msg = shareJS.decode(data);
  }

  // console.log("multi channel : " + this.id, msg.type, msg.fileId, msg.part);
  switch (msg.type) {
    case "files-info":
      handleFileInfo(msg);
      break;
    case "block-request":
      handleBlockRequest(msg);
      break;
    case "block-begin":
      handleBeginfile(msg);
      break;
    case "block-payload":
      handlePayload(msg);
      break;
    case "block-end":
      handleEndFile(msg);
      break;
    case "block-failed":
      handleFailedFile(msg);
      break;
    case "complete":
      handleComplete(msg);
      break;
    default:
      console.error("malformed Message", msg);
      break;
  }
};

const handleFileInfo = function (msg) {
  const { fileInfo, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }

  console.log(`file transfer initiated from ${peerId}`);

  var peer = shareJS.peers[peerId];

  fileInfo.forEach((file) => {
    peer.incoming[file.fileId] = {
      peerId,
      info: file.info,
      file: null,
      progress: 0,

      currentTransfer: {
        block: 1,
        chunks: [],
        receivedParts: 0,
      },
      blocks: [],
    };
  });
  var { incoming } = peer;
  // const ongoingFileId = Object.keys(incoming);

  Object.keys(incoming).forEach((id) => {
    shareJS.dataChannelSend(
      peerId,
      shareJS.encode({
        type: "block-request",
        blockId: 1,
        peerId: shareJS.localId,
        fileId: id,
      })
    );
  });

  shareJS.onFileBegin({
    peerId,
    fileInfo,
    incoming: true,
  });
};

const handleBlockRequest = async function (msg) {
  const { blockId, fileId, peerId } = msg;
  console.log("block request", msg);
  await shareJS.sendFileBlock(peerId, fileId, blockId);
};

const handleComplete = async function (msg) {
  var { fileId, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }
  console.log(`${fileId} transfered to ${peerId}`);
  var { outgoing } = shareJS.peers[peerId];
  shareJS.onFileComplete({
    peerId,
    fileId,
    info: outgoing[fileId].info,
    outgoing: true,
  });
  delete outgoing[fileId];
};

const handlePayload = async function (msg) {
  var { fileId, part, blockId, payload, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }

  var { incoming } = shareJS.peers[peerId];

  if (!incoming[fileId]) {
    return;
  }

  var current = incoming[fileId].currentTransfer;

  if (
    current.block !== blockId &&
    !(blockId <= incoming[fileId].info.blocks) &&
    !(part <= incoming[fileId].info.parts)
  ) {
    return;
  }
  console.log(`${fileId} payload from ${peerId}`);

  const { begin, end } = shareJS.getBlockRange(blockId).buffer;

  const finalPartSize = Math.ceil(
    (Math.min(incoming[fileId].info.size, end) - begin) / shareJS.CHUNK_MTU
  );

  console.log(
    `block ${blockId}/${incoming[fileId].info.blocks} - part ${part}/${finalPartSize}`
  );

  current.chunks[part - 1] = payload;
  current.receivedParts = current.chunks.length;

  incoming[fileId].progress = Math.floor(
    ((incoming[fileId].blocks.length * 64 + current.receivedParts) /
      incoming[fileId].info.parts) *
      100
  );

  if (finalPartSize === part) {
    console.log(incoming[fileId]);
    console.log(`block - ${blockId} is received succefully`);
    incoming[fileId].blocks[current.block - 1] = current.chunks;
    current.chunks = [];
    current.receivedParts = 0;
    if (incoming[fileId].info.blocks === blockId) {
      // completed response
      current.block = 0;
      console.log(`${fileId} is received sucessfully`);
    } else {
      console.log(`requesting for block - ${blockId + 1}`);
      current.block = current.block + 1;
      shareJS.dataChannelSend(
        peerId,
        shareJS.encode({
          type: "block-request",
          blockId: current.block,
          peerId: shareJS.localId,
          fileId,
        })
      );
    }
  }

  shareJS.onProgress({
    peerId,
    fileId,
    info: incoming[fileId].info,
    progress: incoming[fileId].progress,
    incoming: true,
  });
};

const handleEndFile = async function (msg) {
  var { fileId, info, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }

  console.log(`${fileId} transfer started from ${peerId}`);

  var { incoming } = shareJS.peers[peerId];

  var makeFile = function (fileData) {
    try {
      if (fileData.receivedParts === fileData.info.parts) {
        fileData.file = ShareJS.prototype.base64ToBlob(
          fileData.chunks,
          fileData.info.type
        );
        console.log("file generated sucessfully");
        shareJS.dataChannelSend(
          peerId,
          shareJS.encode({
            peerId: shareJS.localId,
            type: "complete",
            fileId: fileId,
          })
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      setTimeout(() => {
        makeFile(fileData);
      }, 5 * 1000);
    }
  };

  // makeFile(incoming[fileId]);
  // shareJS.onFileComplete({
  //   peerId,
  //   fileId,
  //   info,
  //   incoming: true,
  //   save: () => {
  //     saveAs(incoming[fileId].file, incoming[fileId].info.name);
  //     delete incoming[fileId];
  //   },
  // });
};

const handleFailedFile = async function (msg) {
  var { fileId, info, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }

  console.log(`${fileId} transfer started from ${peerId}`);

  var { incoming } = shareJS.peers[peerId];
};

const handleBeginfile = function (msg) {
  var { fileId, info, peerId } = msg;

  if (!peerId) {
    return;
    throw new Error("PeerId is required!");
  }
  if (!shareJS.peers[peerId]) {
    return;
    throw new Error("this peerId is not added!");
  }

  console.log(`${fileId} transfer started from ${peerId}`);

  var { incoming } = shareJS.peers[peerId];
  // new File({
  //   name: info.name,
  //   size: info.size,
  //   type: info.type,
  // }).then((file) => {
  //   incoming[fileId] = {
  //     peerId,
  //     info,
  //     file,
  //     progress: 0,
  //     chunks: [],
  //   };
  // });

  // incoming[fileId] = {
  //   peerId,
  //   info,
  //   file: null,
  //   progress: 0,
  //   receivedParts: 0,
  //   chunks: [],
  // };

  // shareJS.onFileBegin({
  //   peerId,
  //   fileId,
  //   info,
  //   incoming: true,
  // });
};

ShareJS.prototype.onConnect = function (props) {
  if (!(this instanceof ShareJS)) return;
  console.log("incoming connection auto-accept " + props.peerId);
  props.accept();
};

ShareJS.prototype.arrayBufferToBase64 = function (buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

ShareJS.prototype.base64ToBlob = function (b64Data, contentType) {
  contentType = contentType || "";

  var byteArrays = [],
    byteNumbers,
    slice;

  for (var i = 0; i < b64Data.length; i++) {
    slice = b64Data[i];

    byteNumbers = new Array(slice.length);
    for (var n = 0; n < slice.length; n++) {
      byteNumbers[n] = slice.charCodeAt(n);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

ShareJS.prototype.encode = function (data, stringify = true) {
  if (!data) throw new Error("data is empty");
  if (!!stringify) data = JSON.stringify(data);
  if (shareJS.encoded) {
    console.log("encoding enabled");
    console.log(data);
    data = btoa(data);
  }
  return data;
};

ShareJS.prototype.decode = function (data, parse = true) {
  if (!data) throw new Error("data is empty");
  if (shareJS.encoded) {
    console.log("decoding enabled");
    data = atob(data);
    console.log(data);
  }
  if (!!parse) data = JSON.parse(data);
  return data;
};
ShareJS.prototype.dataChannelOptions = {
  negotiated: true,
  id: 1000,
};

ShareJS.prototype.isMeetJS = true;
// ShareJS.prototype.MAX_PARTS = 50;
ShareJS.prototype.CHUNK_MTU = 16000;
ShareJS.prototype.CHUNKS_PER_ACK = 64;

// ShareJS.prototype.sendFile = async function (peerId, peer, fileId) {
//   var { outgoing } = peer;

//   console.log("no outgoing file -- initiating ..");
//   var { info, file, chunks } = outgoing[fileId];
//   var reader = new FileReader();

//   var interval = 0,
//     queueLayer = 2;
//   // var breaks = [50,100];

//   shareJS.dataChannelSend(
//     peerId,
//     shareJS.encode({
//       type: "begin",
//       peerId: shareJS.localId,
//       fileId,
//       info,
//     })
//   );

//   for (let k = 1; k <= info.blocks; k++) {
//     ShareJS.prototype.sleep(1 * 1000);
//     await shareJS.sendFileBlock(peerId, fileId, k);
//   }

//   console.log("sending file completed", file, fileId);

//   setTimeout(() => {
//     shareJS.dataChannelSend(
//       peerId,
//       shareJS.encode({
//         type: "end",
//         peerId: shareJS.localId,
//         fileId,
//         info,
//       })
//     );
//   }, 5 * 1000);

//   reader.onloadend = function (evt) {
//     if (evt.target.readyState == FileReader.DONE) {
//       var buffer = reader.result,
//         start = 0,
//         end = 0,
//         last = false;
//       let chunks = [];

//       for (var i = 0; i < info.parts; i++) {
//         end = start + shareJS.CHUNK_MTU;
//         chunks[i] = buffer.slice(start, end);
//         start = end;
//       }

//       start = 0;
//       end = 0;

//       try {
//         function sendChunkWithIndex(chunk, index) {
//           var part = index + 1;
//           outgoing[fileId].progress = Math.floor((part / info.parts) * 100);
//           shareJS.dataChannelSend(
//             peerId,
//             JSON.stringify({
//               fileId,
//               peerId: shareJS.localId,
//               type: "payload",
//               part,
//               payload: shareJS.arrayBufferToBase64(chunk),
//             })
//           );
//           console.log(
//             `part no. sent -- ${part} -- ${outgoing[fileId].progress} %`
//           );
//           shareJS.onProgress({
//             peerId,
//             fileId,
//             info,
//             progress: outgoing[fileId].progress,
//             outgoing: true,
//           });
//         }

//         chunks.forEach((chunk, i) => {
//           // Throttle the sending to avoid flooding
//           setTimeout(function () {
//             if (interval === shareJS.maxChannels * queueLayer) {
//               console.log("sleep start - " + new Date(Date.now()));
//               ShareJS.prototype.sleep(1 * 1000);
//               console.log("sleep stop - " + new Date(Date.now()));
//               interval = 0;
//             } else {
//               interval++;
//             }
//             sendChunkWithIndex(chunk, i);

//             // If this is the last chunk send our end message, otherwise keep sending
//             if (i === info.parts - 1) {
//               console.log("sending file completed", file, fileId);

//               setTimeout(() => {
//                 shareJS.dataChannelSend(
//                   peerId,
//                   shareJS.encode({
//                     type: "end",
//                     peerId: shareJS.localId,
//                     fileId,
//                     info,
//                   })
//                 );
//               }, 5 * 1000);

//               peer.channels.forEach((ch, j) => {
//                 console.log(ch.id, ch.label, ch.bufferedAmount, ch.readyState);
//               });
//             }
//             if ((i + 1) % 100 === 0) {
//               console.log(`---------break at ${i + 1}---------`);
//               ShareJS.prototype.sleep(5 * 1000);
//             }
//           }, 1 * 100); // this slows the file transfer significantly
//         });
//       } catch (e) {
//         shareJS.dataChannelSend(
//           peerId,
//           shareJS.encode({
//             type: "failed",
//             peerId: shareJS.localId,
//             fileId,
//             info,
//           })
//         );

//         console.log(e);
//         throw new Error(
//           JSON.stringify({
//             reason: "failed",
//             fileId: fileId,
//             info,
//             peerId,
//           })
//         );
//       }
//     }
//   };

//   setTimeout(() => {
//     shareJS.dataChannelSend(
//       peerId,
//       shareJS.encode({
//         type: "end",
//         peerId: shareJS.localId,
//         fileId,
//         info,
//       })
//     );
//   }, 5 * 1000);

//   // // this loads the whole file into memory
//   // // not good for large files
//   // reader.readAsArrayBuffer(file);

//   // return true;
// };

// const handleComplete = async function (msg) {
//   var { fileId, peerId } = msg;

//   if (!peerId) {
//     return;
//     throw new Error("PeerId is required!");
//   }
//   if (!shareJS.peers[peerId]) {
//     return;
//     throw new Error("this peerId is not added!");
//   }
//   console.log(`${fileId} transfered to ${peerId}`);
//   var { outgoing } = shareJS.peers[peerId];
//   shareJS.onFileComplete({
//     peerId,
//     fileId,
//     info: outgoing[fileId].info,
//     outgoing: true,
//   });
//   delete outgoing[fileId];
// };

// const handlePayload = async function (msg) {
//   var { fileId, part, payload, peerId } = msg;

//   if (!peerId) {
//     return;
//     throw new Error("PeerId is required!");
//   }
//   if (!shareJS.peers[peerId]) {
//     return;
//     throw new Error("this peerId is not added!");
//   }

//   console.log(`${fileId} payload from ${peerId} part ${part}`);

//   var { incoming } = shareJS.peers[peerId];

//   incoming[fileId].chunks[part - 1] = payload;
//   incoming[fileId].receivedParts = incoming[fileId].chunks.length;

//   incoming[fileId].progress = Math.floor(
//     (incoming[fileId].chunks.length / incoming[fileId].info.parts) * 100
//   );

//   shareJS.onProgress({
//     peerId,
//     fileId,
//     info: incoming[fileId].info,
//     progress: incoming[fileId].progress,
//     incoming: true,
//   });
// };

// const handleEndFile = async function (msg) {
//   var { fileId, info, peerId } = msg;

//   if (!peerId) {
//     return;
//     throw new Error("PeerId is required!");
//   }
//   if (!shareJS.peers[peerId]) {
//     return;
//     throw new Error("this peerId is not added!");
//   }

//   console.log(`${fileId} transfer started from ${peerId}`);

//   var { incoming } = shareJS.peers[peerId];

//   var makeFile = function (fileData) {
//     try {
//       if (fileData.receivedParts === fileData.info.parts) {
//         fileData.file = ShareJS.prototype.base64ToBlob(
//           fileData.chunks,
//           fileData.info.type
//         );
//         console.log("file generated sucessfully");
//         shareJS.dataChannelSend(
//           peerId,
//           shareJS.encode({
//             peerId: shareJS.localId,
//             type: "complete",
//             fileId: fileId,
//           })
//         );
//       } else {
//         throw new Error();
//       }
//     } catch (e) {
//       setTimeout(() => {
//         makeFile(fileData);
//       }, 5 * 1000);
//     }
//   };

//   makeFile(incoming[fileId]);
//   shareJS.onFileComplete({
//     peerId,
//     fileId,
//     info,
//     incoming: true,
//     save: () => {
//       saveAs(incoming[fileId].file, incoming[fileId].info.name);
//       delete incoming[fileId];
//     },
//   });
// };

// const handleFailedFile = async function (msg) {
//   var { fileId, info, peerId } = msg;

//   if (!peerId) {
//     return;
//     throw new Error("PeerId is required!");
//   }
//   if (!shareJS.peers[peerId]) {
//     return;
//     throw new Error("this peerId is not added!");
//   }

//   console.log(`${fileId} transfer started from ${peerId}`);

//   var { incoming } = shareJS.peers[peerId];
// };

// const handleBeginfile = function (msg) {
//   var { fileId, info, peerId } = msg;

//   if (!peerId) {
//     return;
//     throw new Error("PeerId is required!");
//   }
//   if (!shareJS.peers[peerId]) {
//     return;
//     throw new Error("this peerId is not added!");
//   }

//   console.log(`${fileId} transfer started from ${peerId}`);

//   var { incoming } = shareJS.peers[peerId];
//   // new File({
//   //   name: info.name,
//   //   size: info.size,
//   //   type: info.type,
//   // }).then((file) => {
//   //   incoming[fileId] = {
//   //     peerId,
//   //     info,
//   //     file,
//   //     progress: 0,
//   //     chunks: [],
//   //   };
//   // });

//   incoming[fileId] = {
//     peerId,
//     info,
//     file: null,
//     progress: 0,
//     receivedParts: 0,
//     chunks: [],
//   };

//   shareJS.onFileBegin({
//     peerId,
//     fileId,
//     info,
//     incoming: true,
//   });
// };
