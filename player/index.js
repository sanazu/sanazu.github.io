const { useEffect, useState, Fragment } = React;

// {
//     "isdir": true,
//     "Cosmos Laundromat.en.srt": {
//         "torrentId": "https://webtorrent.io/torrents/cosmos-laundromat.torrent",
//         "name": "Cosmos Laundromat.en.srt",
//         "length": 3945,
//         "path": "Cosmos Laundromat/Cosmos Laundromat.en.srt"
//     },

// }

const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

const File = ({ name, length, ...props }) => (
  <div
    className="d-flex w-100 border px-3 py-2"
    // onClick={() => downloadTorrent(props)}
  >
    <span className="material-icons p-2">description</span>
    <span className="d-flex flex-column justify-content-center">
      <span>{name}</span>
      <span>{niceBytes(length)}</span>
    </span>
  </div>
);
const Folder = ({ name, onClick, ...files }) => (
  <div className="d-flex w-100 border px-3 py-2" onClick={onClick}>
    <span className="material-icons p-2">folder</span>
    <span className="d-flex flex-column justify-content-center">
      <span>{name}</span>
      <span>
        {niceBytes(
          Object.values(files || {}).reduce(
            (acc, { length }) => acc + length,
            0
          )
        )}
      </span>
    </span>
  </div>
);

const App = () => {
  const [datas, setDatas] = useState([]);
  const [name, setPath] = useState();

  const pushData = ({ isDir, name, ...data }) => {
    setPath(name);
    setDatas((dat) => [...dat, data]);
  };
  const popData = () => {
    setDatas((dat) => {
      const temp = [...dat];
      temp.pop();
      return temp;
    });
  };
  useEffect(() => {
    getMetadatas([
      "https://webtorrent.io/torrents/cosmos-laundromat.torrent",
      "https://webtorrent.io/torrents/tears-of-steel.torrent",
      "https://webtorrent.io/torrents/sintel.torrent",
    ]).then(pushData);
  }, []);

  useEffect(() => console.log(datas[datas.length - 1]), [datas]);
  return (
    <div className="d-flex flex-column">
      <div className="d-flex p-3">
        <span className="material-icons" onClick={popData}>
          keyboard_return
        </span>
        <span className=" d-flex flex-grow-1 justify-content-center">
          {name}
        </span>
      </div>
      <div
        className={`d-flex flex-column flex-grow-1 ${
          datas.length ? "justify-content-center align-items-center" : ""
        }`}
      >
        {datas.length
          ? Object.values(datas[datas.length - 1]).map(
              ({ isDir, ...data }, i) => {
                return !isDir ? (
                  <File {...data} key={i} />
                ) : (
                  <Folder {...data} key={i} onClick={() => pushData(data)} />
                );
              }
            )
          : "Empty"}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
