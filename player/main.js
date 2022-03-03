const announceList = [
  ["udp://tracker.openbittorrent.com:80"],
  ["udp://tracker.internetwarriors.net:1337"],
  ["udp://tracker.leechers-paradise.org:6969"],
  ["udp://tracker.coppersurfer.tk:6969"],
  ["udp://exodus.desync.com:6969"],
  ["wss://tracker.webtorrent.io"],
  ["wss://tracker.btorrent.xyz"],
  ["wss://tracker.openwebtorrent.com"],
  ["wss://tracker.fastcast.nz"],
];

WEBTORRENT_ANNOUNCE = announceList
  .map(function (arr) {
    return arr[0];
  })
  .filter(function (url) {
    return url.indexOf("wss://") === 0 || url.indexOf("ws://") === 0;
  });

const client = new WebTorrent();

client.on("error", function (err) {
  console.error("ERROR: " + err.message);
});

function downloadTorrent({ torrentId, path }) {
  console.log("Downloading torrent from " + torrentId, path);
  client.add(torrentId, { path }, function onTorrent(torrent) {
    //   torrent.on("warning", console.log);
    //   torrent.on("error", console.log);
    window.current = torrent;
    torrent.on("done", () => {
      window.current = null;
      console.log("done", path);
    });

    console.log("Got torrent metadata!", torrent);
  });
}

function getMetadata(torrentId) {
  return new Promise((resolve) => {
    function addObjects(obj = {}, paths = [], options = {}) {
      const path = paths.shift();
      if (!paths.length) {
        obj[path] = {
          torrentId,
          ...options,
        };
        return;
      }
      if (!obj[path]) obj[path] = {};
      obj[path].isDir = true;
      obj[path].name = path;
      addObjects(obj[path], paths, options);
    }
    client.add(torrentId, function (torrent) {
      resolve(
        torrent.files.reduce((acc, { path, name, length }) => {
          addObjects(acc, path.split("/"), { name, length, path });
          return acc;
        }, {})
      );

      torrent.destroy();
    });
  });
}

function getMetadatas(torrentIds = []) {
  return Promise.all(torrentIds.map(getMetadata)).then((data) =>
    data.reduce((acc, curr) => ({ ...curr, ...acc }), { isDir: true })
  );
}
