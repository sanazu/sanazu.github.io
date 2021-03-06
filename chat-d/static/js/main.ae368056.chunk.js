(this.webpackJsonpchat = this.webpackJsonpchat || []).push([
  [0],
  {
    104: function (e, a, t) {},
    110: function (e, a, t) {},
    111: function (e, a, t) {},
    112: function (e, a, t) {},
    114: function (e, a, t) {},
    115: function (e, a, t) {},
    117: function (e, a, t) {},
    118: function (e, a, t) {},
    119: function (e, a, t) {},
    120: function (e, a, t) {},
    121: function (e, a, t) {},
    122: function (e, a, t) {},
    123: function (e, a, t) {
      "use strict";
      t.r(a);
      var n = t(0),
        r = t.n(n),
        c = t(13),
        s = t.n(c),
        l = (t(104), t(9)),
        o = t(66),
        i = t(20),
        u = t(56),
        m = t(67),
        d = t.n(m),
        p = t(68),
        f = t(38),
        E = t(69),
        g = t.n(E)()({
          LOGIN_REQUEST: null,
          LOGIN_REQUEST_SUCCESS: null,
          LOGIN_REQUEST_ERROR: null,
          UPDATE_AUTH_MODE: null,
          ADD_MESSAGE: null,
          SET_USER_DETAILS: null,
          UPDATE_SETTINGS: null,
          LOGOUT: null,
          ADD_CONTACT: null,
          REMOVE_CONTACT: null,
          UPDATE_CONTACT: null,
          SET_CHATTE: null,
        }),
        h = { id: 0, name: "", number: "+91 91231 40293", pic: "" },
        b = t(37),
        N = t(166),
        v = [],
        O = [],
        _ = Object(i.b)({
          user: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : h,
              a = arguments.length > 1 ? arguments[1] : void 0;
            switch (a.type) {
              case g.SET_USER_DETAILS:
                return Object(f.a)(Object(f.a)({}, e), {}, { name: a.name });
              case g.SET_CHATTE:
                return Object(f.a)(Object(f.a)({}, e), {}, { chatee: a.name });
              default:
                return e;
            }
          },
          messages: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : O,
              a = arguments.length > 1 ? arguments[1] : void 0;
            switch (a.type) {
              case g.ADD_MESSAGE:
                return [].concat(Object(b.a)(e), [
                  {
                    isSent: a.payload.isSent,
                    message: a.payload.message,
                    status: a.payload.status ? a.payload.status : void 0,
                    timestamp: a.payload.timestamp
                      ? a.payload.timestamp
                      : new Date(),
                    mid: a.payload.isSent ? Object(N.a)() : a.payload.mid,
                    userId: a.payload.userId,
                  },
                ]);
              default:
                return e;
            }
          },
          contacts: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : v,
              a = arguments.length > 1 ? arguments[1] : void 0;
            switch (a.type) {
              case g.ADD_CONTACT:
                return 0 !==
                  e.filter(function (e) {
                    return e.userName === a.peerName;
                  }).length
                  ? e
                  : [].concat(Object(b.a)(e), [
                      {
                        userName: a.peerName,
                        userDp: "",
                        userStatus: "Available",
                        unread: 0,
                        userId: Object(N.a)(),
                      },
                    ]);
              case g.UPDATE_CONTACT:
                if (!a.userName) return e;
                var t = e.filter(function (e) {
                  return e.userName === a.userName;
                })[0];
                if (a.payload && t) {
                  var n = e.filter(function (e) {
                      return e.userName !== a.userName;
                    }),
                    r = a.payload;
                  return (
                    r.userDp && (t.userDp = r.userDp),
                    r.unread && (t.unread = r.unread),
                    r.userStatus && (t.userStatus = r.userStatus),
                    [].concat(Object(b.a)(n), [t])
                  );
                }
                return e;
              case g.REMOVE_CONTACT:
                return 0 ===
                  e.filter(function (e) {
                    return e.userName === a.peerName;
                  }).length
                  ? e
                  : e.filter(function (e) {
                      return e.userName !== a.peerName;
                    });
              default:
                return e;
            }
          },
        }),
        y = {
          key: "sanazu_chat_root_storage",
          storage: d.a,
          whitelist: ["messages", "contacts"],
        },
        S = Object(u.a)(y, _),
        j = Object(i.c)(S, Object(i.a)(p.a)),
        C = Object(u.b)(j),
        w = function (e) {
          var a = e.isSent,
            t = e.message,
            n = e.mid,
            r = e.timestamp,
            c = e.userId;
          return {
            type: g.ADD_MESSAGE,
            payload: { isSent: a, message: t, mid: n, timestamp: r, userId: c },
          };
        },
        T = function (e) {
          return { type: g.ADD_CONTACT, peerName: e };
        },
        k = t(87),
        A = t(162),
        D = t(161),
        R = t(160),
        I = t(7),
        x =
          (t(110),
          function (e) {
            return { type: g.SET_USER_DETAILS, name: e };
          }),
        G = function (e) {
          return { type: g.SET_CHATTE, name: e };
        },
        U = (t(111), t(148)),
        L = t(74),
        M = t(150),
        B = t(151),
        H = t(124),
        P = t(152),
        J = t(165),
        F = t(153),
        Q = t(79),
        z = t.n(Q),
        V = t(78),
        q = t.n(V),
        W = t(75),
        Y = t.n(W),
        K = t(76),
        X = t.n(K),
        Z = t(77),
        $ = t.n(Z),
        ee =
          (t(112),
          Object(U.a)(function (e) {
            return {
              root: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              toolbar: { width: "100%", display: "flex", marginBottom: "5px" },
              inputHolder: {
                borderRadius: "25px",
                flexGrow: 1,
                height: "80%",
                display: "flex",
                alignItems: "center",
                marginLeft: e.spacing(1),
                marginRight: e.spacing(1),
                backgroundColor: "white",
              },
              send: {
                borderRadius: "100%",
                height: "80%",
                marginRight: e.spacing(1),
                minWidth: "inherit",
              },
              input: {
                height: "100%",
                background: "transparent",
                flexGrow: 1,
                "&::placeholder": { color: "black" },
              },
              grow: { flexGrow: 1 },
            };
          })),
        ae = function (e) {
          var a = Object(n.useRef)(null),
            t = Object(n.useRef)(),
            c = ee(),
            s = Object(n.useState)(!1),
            l = Object(I.a)(s, 2),
            o = l[0],
            i = l[1];
          Object(L.a)();
          return r.a.createElement(
            M.a,
            {
              position: "static",
              color: "transparent",
              className: c.root,
              elevation: 0,
            },
            r.a.createElement(
              B.a,
              { disableGutters: !0, className: c.toolbar },
              r.a.createElement(
                H.a,
                { variant: "div", className: c.inputHolder },
                r.a.createElement(
                  P.a,
                  { color: "secondary" },
                  r.a.createElement(Y.a, null)
                ),
                r.a.createElement(J.a, {
                  className: c.input,
                  inputRef: t,
                  onKeyUp: function (a) {
                    a.preventDefault();
                    var n = null === t || void 0 === t ? void 0 : t.current;
                    if (null === n || void 0 === n ? void 0 : n.value)
                      return 13 === a.keyCode
                        ? (e.onSubmit(n.value), (n.value = ""), void i(!1))
                        : void i(!0);
                    i(!1);
                  },
                  autoFocus: !0,
                  placeholder: "Type a message",
                  inputProps: {
                    "aria-label": "Type a message",
                    className: c.input,
                  },
                }),
                r.a.createElement(
                  P.a,
                  { color: "secondary" },
                  r.a.createElement(X.a, null)
                ),
                r.a.createElement(
                  P.a,
                  { color: "secondary" },
                  r.a.createElement($.a, null)
                )
              ),
              r.a.createElement(
                F.a,
                {
                  ref: a,
                  variant: "contained",
                  color: "secondary",
                  className: c.send,
                },
                o
                  ? r.a.createElement(z.a, {
                      onClick: function () {
                        var a = t.current;
                        a.value && (e.onSubmit(a.value), (a.value = ""), i(!1));
                      },
                    })
                  : r.a.createElement(q.a, null)
              )
            )
          );
        },
        te = (t(114), t(26)),
        ne = t.n(te),
        re = t(51),
        ce = t(167),
        se = t(80),
        le = t.n(se),
        oe = t(49),
        ie = t.n(oe),
        ue = t(163),
        me = t(164),
        de = t(82),
        pe = t.n(de),
        fe = t(81),
        Ee = t.n(fe),
        ge = Object(U.a)(function (e) {
          return {
            avatar: { marginRight: e.spacing(0.5), marginLeft: e.spacing(0.5) },
            menuOptions: {},
            grow: { flexGrow: 1 },
          };
        });
      function he(e) {
        return r.a.createElement(
          me.a,
          Object.assign({ elevation: 6, variant: "filled" }, e)
        );
      }
      var be = function (e) {
        Object(n.useRef)(null);
        var a = ne.a.generate(e.userName),
          t = Object(n.useState)(!1),
          c = Object(I.a)(t, 2),
          s = c[0],
          l = c[1],
          o = ge(),
          i = function (e, a) {
            "clickaway" !== a && l(!1);
          };
        return r.a.createElement(
          M.a,
          { position: "static", color: "primary" },
          r.a.createElement(
            B.a,
            { disableGutters: !0 },
            r.a.createElement(
              P.a,
              {
                edge: "start",
                color: "inherit",
                "aria-label": "open drawer",
                className: o.avatar,
                onClick: e.chatBack,
              },
              r.a.createElement(le.a, { color: "inherit" }),
              r.a.createElement(ce.a, { alt: a.name, src: "" })
            ),
            r.a.createElement(
              re.a,
              { variant: "h6", className: o.title },
              e.userName
            ),
            r.a.createElement("span", { className: o.grow }),
            r.a.createElement(
              P.a,
              {
                color: "inherit",
                "aria-label": "open drawer",
                onClick: e.call,
              },
              r.a.createElement(Ee.a, null)
            ),
            r.a.createElement(
              P.a,
              {
                color: "inherit",
                "aria-label": "open drawer",
                onClick: e.call,
              },
              r.a.createElement(pe.a, null)
            ),
            r.a.createElement(
              P.a,
              {
                color: "inherit",
                onClick: function () {
                  return l(!s);
                },
              },
              r.a.createElement(ie.a, null)
            ),
            r.a.createElement(
              ue.a,
              { open: s, autoHideDuration: 2e3, onClose: i },
              r.a.createElement(
                he,
                { onClose: i, severity: "warning" },
                "Not Implemented!"
              )
            )
          )
        );
      };
      t(115);
      function Ne(e) {
        return (e || "").replace(
          /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
          function (e, a, t) {
            var n = t;
            return (
              n.match("^https?://") || (n = "http://" + n),
              a + '<a href="' + n + '" target="_blank">' + t + "</a>"
            );
          }
        );
      }
      function ve(e) {
        return e.replace(/(     ^\w|[A-Z]|\b\w|\s+)/g, function (e, a) {
          return 0 === +e ? "" : 0 === a ? e.toLowerCase() : e.toUpperCase();
        });
      }
      var Oe = function (e) {
          if (e.message || e.timestamp) {
            return r.a.createElement(
              r.a.Fragment,
              null,
              e.isSent
                ? r.a.createElement(
                    "div",
                    { className: "chat_message flex-end", id: e.mid },
                    r.a.createElement(
                      "span",
                      { className: "chat_message_data msg_sent" },
                      r.a.createElement("div", {
                        className: "chat_text",
                        dangerouslySetInnerHTML: { __html: Ne(e.message) },
                      }),
                      r.a.createElement(
                        "div",
                        { className: "chat_status" },
                        r.a.createElement(
                          "span",
                          { className: "chat_msg_timestamp" },
                          e.timestamp,
                          " "
                        ),
                        r.a.createElement(
                          "span",
                          { className: "chat_msg_status" },
                          2 === e.status &&
                            r.a.createElement(
                              "i",
                              { className: "material-icons" },
                              "done_all"
                            ),
                          0 === e.status &&
                            r.a.createElement(
                              "i",
                              {
                                className: "material-icons",
                                style: { color: "rgb(124, 180, 133)" },
                              },
                              "done"
                            ),
                          1 === e.status &&
                            r.a.createElement(
                              "i",
                              {
                                className: "material-icons",
                                style: { color: "rgb(124, 180, 133)" },
                              },
                              "done_all"
                            )
                        )
                      )
                    ),
                    r.a.createElement("span", {
                      className: "chat_message_right",
                    })
                  )
                : r.a.createElement(
                    "div",
                    { className: "chat_message flex-start", id: e.mid },
                    r.a.createElement("span", {
                      className: "chat_message_left",
                    }),
                    r.a.createElement(
                      "span",
                      { className: "chat_message_data msg_received" },
                      r.a.createElement("div", {
                        className: "chat_text",
                        dangerouslySetInnerHTML: { __html: Ne(e.message) },
                      }),
                      r.a.createElement(
                        "div",
                        { className: "chat_status" },
                        r.a.createElement(
                          "span",
                          { className: "chat_msg_timestamp" },
                          e.timestamp,
                          " "
                        )
                      )
                    )
                  )
            );
          }
        },
        _e = t(22),
        ye = t.n(_e);
      t(117);
      var Se = function (e) {
          return r.a.createElement(
            "div",
            { id: "chat_body", className: "chat_body" },
            e.messages &&
              e.messages.map(function (e, a) {
                return r.a.createElement(Oe, {
                  key: e.mid,
                  mid: e.mid,
                  isSent: e.isSent,
                  message: e.message,
                  status: e.status,
                  timestamp: ye()(e.timestamp).format("h:mm"),
                });
              })
          );
        },
        je = function () {
          var e = document.getElementById("chat_body");
          e && e.scrollHeight && (e.scrollTop = e.scrollHeight);
        },
        Ce = function (e) {
          var a = Object(l.c)(),
            t = Object(n.useState)([]),
            c = Object(I.a)(t, 2),
            s = c[0],
            o = c[1],
            i =
              (Object(l.d)(function (e) {
                return e.contacts;
              }, l.b),
              Object(l.d)(function (e) {
                return e.messages;
              }, l.b)),
            u = window.MeetJS;
          Object(n.useEffect)(
            function () {
              o(
                i.filter(function (a) {
                  var t;
                  return (
                    (null === a || void 0 === a ? void 0 : a.userId) ===
                    (null === e ||
                    void 0 === e ||
                    null === (t = e.user) ||
                    void 0 === t
                      ? void 0
                      : t.userName)
                  );
                })
              ),
                setTimeout(je, 50);
            },
            [e.user.userName, i]
          );
          var m = function (t) {
            var n,
              r = Object(N.a)();
            console.log("send msg to : " + e.user.userName, t),
              u.emit("SEND_MESSAGE", {
                remotePeer: e.user.userName,
                data: { createdAt: new Date(), message: t, mid: r },
              }),
              (n = { data: t, createdAt: new Date(), mid: r }),
              a(
                w({
                  timestamp: n.createdAt,
                  isSent: !0,
                  message: n.data,
                  status: 0,
                  mid: n.mid,
                  userId: e.user.userName,
                })
              );
          };
          return r.a.createElement(
            r.a.Fragment,
            null,
            e.user.userName &&
              r.a.createElement(
                r.a.Fragment,
                null,
                r.a.createElement(
                  "div",
                  { className: "chat_screen" },
                  r.a.createElement(be, {
                    chatBack: e.chatBack,
                    call: e.call,
                    userName: e.user.userName,
                    lastSeen: "online",
                  }),
                  r.a.createElement(Se, { messages: s }),
                  r.a.createElement(ae, {
                    onSubmit: function (e) {
                      "" !== e && m(e);
                    },
                  })
                )
              )
          );
        };
      t(118), t(119);
      t(120);
      var we = t(55),
        Te = t.n(we),
        ke = t(85),
        Ae = t.n(ke),
        De = t(83),
        Re = t.n(De),
        Ie = t(84),
        xe = t.n(Ie),
        Ge = Object(U.a)(function (e) {
          return {
            list: { marginBottom: e.spacing(2) },
            avatar: { marginRight: e.spacing(0.5) },
            appBar: { top: 0, bottom: "auto" },
            menuOptions: {},
            grow: { flexGrow: 1 },
          };
        });
      function Ue(e) {
        return r.a.createElement(
          me.a,
          Object.assign({ elevation: 6, variant: "filled" }, e)
        );
      }
      var Le = function (e) {
          var a = Object(n.useState)(!1),
            t = Object(I.a)(a, 2),
            c = t[0],
            s = t[1],
            l = Object(n.useState)(!1),
            o = Object(I.a)(l, 2),
            i = o[0],
            u = o[1],
            m = Object(n.useState)(!0),
            d = Object(I.a)(m, 2),
            p = d[0],
            f = d[1],
            E = Ge(),
            g = function (e, a) {
              "clickaway" !== a && u(!1);
            };
          return r.a.createElement(
            M.a,
            { position: "static", color: "primary" },
            c
              ? r.a.createElement(
                  B.a,
                  {
                    className: "home_screen_header_search ",
                    disableGutters: !0,
                  },
                  r.a.createElement(
                    "span",
                    {
                      className: "header_search_span",
                      onClick: function () {
                        e.onQuery(""), s(!c);
                      },
                    },
                    r.a.createElement(
                      P.a,
                      { color: "primary" },
                      r.a.createElement(Ae.a, null)
                    )
                  ),
                  r.a.createElement("input", {
                    type: "text",
                    className: "chat_msg_input",
                    placeholder: "Type a message",
                    onChange: function (a) {
                      return e.onQuery(a.currentTarget.value);
                    },
                    autoFocus: !0,
                    name: "",
                    id: "msgInput",
                  })
                )
              : r.a.createElement(
                  B.a,
                  null,
                  r.a.createElement(
                    P.a,
                    {
                      edge: "start",
                      color: "inherit",
                      "aria-label": "open drawer",
                      className: E.avatar,
                    },
                    r.a.createElement(ce.a, {
                      className: "rotate_image",
                      alt: "Profile Picture",
                      src: "https://lh3.googleusercontent.com/a-/AOh14GiHblzps07YfmIALB7zR3R6UmkcmTvdNC-lEaXm8g=s96-c",
                    })
                  ),
                  r.a.createElement(
                    re.a,
                    {
                      variant: "h6",
                      onClick: function () {
                        return f(!p);
                      },
                      className: E.title,
                    },
                    p ? "WasApp".toUpperCase() : e.userName.toUpperCase()
                  ),
                  r.a.createElement("div", { className: E.grow }),
                  r.a.createElement(
                    P.a,
                    {
                      color: "inherit",
                      onClick: function () {
                        return e.setTab(!e.useTab);
                      },
                    },
                    e.useTab
                      ? r.a.createElement(Re.a, null)
                      : r.a.createElement(xe.a, null)
                  ),
                  r.a.createElement(
                    P.a,
                    {
                      color: "inherit",
                      onClick: function () {
                        return s(!c);
                      },
                    },
                    r.a.createElement(Te.a, null)
                  ),
                  r.a.createElement(
                    P.a,
                    {
                      edge: "end",
                      color: "inherit",
                      onClick: function () {
                        return u(!i);
                      },
                    },
                    r.a.createElement(ie.a, null)
                  ),
                  r.a.createElement(
                    ue.a,
                    { open: i, autoHideDuration: 2e3, onClose: g },
                    r.a.createElement(
                      Ue,
                      { onClose: g, severity: "warning" },
                      "Not Implemented!"
                    )
                  )
                )
          );
        },
        Me = (t(121), t(154)),
        Be = t(155),
        He = t(156),
        Pe = t(158),
        Je = t(157),
        Fe = t(159),
        Qe = Object(U.a)(function (e) {
          return {
            text: { padding: e.spacing(2, 2, 0) },
            details: {
              display: "flex",
              marginLeft: e.spacing(2),
              justifyContent: "space-between",
              flexGrow: 1,
            },
            appBar: { top: "auto", bottom: 0 },
            grow: { flexGrow: 1 },
            hr: { marginRight: e.spacing(2) },
            large: { width: e.spacing(7), height: e.spacing(7) },
          };
        }),
        ze = function (e) {
          var a = e.query,
            t = e.users,
            c = e.startChat,
            s = Qe(),
            l = Object(n.useCallback)(
              function () {
                return a
                  ? null === t || void 0 === t
                    ? void 0
                    : t.filter(function (e) {
                        return (
                          e.userName.toUpperCase().indexOf(a.toUpperCase()) >= 0
                        );
                      })
                  : t;
              },
              [t, a]
            );
          return r.a.createElement(
            Me.a,
            null,
            l().map(function (e, a) {
              var n = e.userId,
                l = e.userDp,
                o = e.userName,
                i = e.userStatus,
                u = e.unread;
              e.lastseen;
              return r.a.createElement(
                r.a.Fragment,
                { key: n },
                r.a.createElement(
                  Be.a,
                  { button: !0 },
                  r.a.createElement(
                    He.a,
                    { className: s.avatar },
                    r.a.createElement(
                      Je.a,
                      { color: "secondary", badgeContent: u },
                      r.a.createElement(ce.a, {
                        alt: ne.a.generate(o),
                        src: l,
                        className: s.large,
                      })
                    )
                  ),
                  r.a.createElement(
                    re.a,
                    {
                      className: s.details,
                      onClick: function () {
                        c(o, n);
                      },
                    },
                    r.a.createElement(Pe.a, { primary: ve(o), secondary: i })
                  )
                ),
                a !== t.length - 1 &&
                  r.a.createElement(Fe.a, { variant: "inset", className: s.hr })
              );
            })
          );
        },
        Ve = function (e) {
          var a = Object(l.d)(function (e) {
              return e.user;
            }, l.b),
            t = Object(l.d)(function (e) {
              return e.contacts;
            }, l.b),
            c = window.MeetJS,
            s = Object(l.c)(),
            o = Object(n.useState)(""),
            i = Object(I.a)(o, 2),
            u = i[0],
            m = i[1],
            d = Object(n.useState)(!1),
            p = Object(I.a)(d, 2),
            f = (p[0], p[1], Object(n.useState)(!1)),
            E = Object(I.a)(f, 2),
            h = E[0],
            b = E[1];
          Object(n.useRef)(null);
          Object(n.useEffect)(
            function () {
              c &&
                (c.events.JOINED ||
                  c.on("JOINED", function (e) {
                    s(T(e)),
                      console.log(
                        ""
                          .concat(e, " is joined at ")
                          .concat(ye()(new Date()).format("h:mm"))
                      );
                  }),
                c.events.LEFT ||
                  c.on("LEFT", function (e) {
                    s(
                      (function (e) {
                        return { type: g.REMOVE_CONTACT, peerName: e };
                      })(e)
                    ),
                      console.log(
                        ""
                          .concat(e, " is Left at ")
                          .concat(ye()(new Date()).format("h:mm"))
                      );
                  }));
            },
            [c, s]
          );
          return r.a.createElement(
            "div",
            { id: "home_screen", className: "home_screen" },
            r.a.createElement(Le, {
              className: "home_header",
              userName: ve(a.name),
              onQuery: function (e) {
                return m(e);
              },
              useTab: h,
              setTab: b,
            }),
            r.a.createElement(
              "div",
              { className: "home_chats" },
              r.a.createElement(ze, {
                users: t,
                startChat: function (a, t) {
                  console.log(a + " " + t), e.handleClick(t);
                },
                query: u,
              })
            )
          );
        },
        qe = (t(122), t(86)),
        We = t.n(qe);
      var Ye = function (e) {
        var a = Object(n.useRef)(null),
          t = Object(n.useState)(!1),
          c = Object(I.a)(t, 2),
          s = c[0],
          l = c[1],
          o = Object(n.useState)(!1),
          i = Object(I.a)(o, 2),
          u = i[0],
          m = i[1],
          d = Object(n.useState)(!1),
          p = Object(I.a)(d, 2),
          f = p[0],
          E = p[1];
        return (
          Object(n.useEffect)(function () {}, []),
          r.a.createElement(
            "div",
            { id: "call_screen", className: "call_screen" },
            r.a.createElement(
              "div",
              { className: "call_header" },
              r.a.createElement(
                "div",
                { className: "call_header_info" },
                r.a.createElement("i", {
                  style: { paddingRight: "10px" },
                  className: "fas fa-lock lock",
                }),
                r.a.createElement(
                  "span",
                  { className: "lock" },
                  " End-to-End Encrypted"
                )
              ),
              r.a.createElement(
                "div",
                { className: "call_user_info" },
                r.a.createElement(
                  "span",
                  { style: { color: "white" } },
                  r.a.createElement("b", null, e.user.userName)
                ),
                r.a.createElement(
                  "span",
                  { style: { color: "white", fontSize: "15px" } },
                  "Calling"
                )
              )
            ),
            r.a.createElement(
              "div",
              { className: "call_body", ref: a },
              r.a.createElement(
                "div",
                { className: "call_user_pic" },
                r.a.createElement("img", { src: We.a, alt: "" })
              ),
              r.a.createElement(
                "div",
                { className: "call_hangup", onClick: e.endCall },
                r.a.createElement(
                  "i",
                  { className: "material-icons" },
                  "call_end"
                )
              )
            ),
            r.a.createElement(
              "div",
              { className: "call_footer" },
              r.a.createElement(
                "div",
                {
                  id: "call_speaker",
                  className: "call_speaker",
                  onClick: function () {
                    E(!f);
                  },
                },
                f
                  ? r.a.createElement("i", { className: "fas fa-volume-up" })
                  : r.a.createElement("i", {
                      className: "fas fa-headphones-alt",
                    })
              ),
              r.a.createElement(
                "div",
                {
                  id: "call_video",
                  className: "call_video",
                  onClick: function () {
                    l(!s);
                  },
                },
                s
                  ? r.a.createElement("i", { className: "fas fa-video-slash" })
                  : r.a.createElement("i", { className: "fas fa-video" })
              ),
              r.a.createElement(
                "div",
                {
                  id: "call_mute",
                  className: "call_mute",
                  onClick: function () {
                    m(!u);
                  },
                },
                u
                  ? r.a.createElement("i", {
                      className: "fas fa-microphone-slash",
                    })
                  : r.a.createElement("i", { className: "fas fa-microphone" })
              )
            )
          )
        );
      };
      var Ke = function () {
          var e = window.MeetJS,
            a = Object(l.c)(),
            t = Object(l.d)(function (e) {
              return e.contacts;
            }, l.b),
            c = Object(l.d)(function (e) {
              return e.user;
            }, l.b),
            s = Object(n.useState)(null),
            o = Object(I.a)(s, 2),
            i = o[0],
            u = o[1];
          return (
            Object(n.useEffect)(
              function () {
                e.isConnected() ||
                  (e.on("READY", function (t) {
                    console.log("connected.....", t),
                      window.addEventListener("unload", function () {
                        a(x(""));
                      }),
                      a(x(e.userName));
                  }),
                  a(x("")),
                  e.emit("CONNECT", prompt("enter the userName")));
              },
              [a, e, c.userName, t]
            ),
            r.a.createElement(
              "div",
              { className: "App" },
              c.chatee
                ? i
                  ? r.a.createElement(Ye, {
                      user: c.chatee,
                      endCall: function () {
                        return u(!1);
                      },
                    })
                  : r.a.createElement(Ce, {
                      chatBack: function () {
                        console.log(
                          " chatee back - ".concat(JSON.stringify(c.chatee))
                        ),
                          a(G(void 0));
                      },
                      call: function () {
                        return u(!0);
                      },
                      user: c.chatee,
                      contacts: t,
                    })
                : r.a.createElement(Ve, {
                    handleClick: function (e) {
                      console.log(
                        " chatee start - ".concat(JSON.stringify(c.chatee))
                      ),
                        a(
                          G(
                            t.filter(function (a) {
                              return a.userId === e;
                            })[0]
                          )
                        );
                    },
                  })
            )
          );
        },
        Xe = function (e) {
          var a = Object(R.a)("(prefers-color-scheme: dark)");
          console.log(a && "dark mode is enabled by default");
          var t = Object(n.useMemo)(
            function () {
              return Object(k.a)({
                palette: {
                  type: a ? "dark" : "light",
                  primary: D.a,
                  secondary: D.a,
                  main: D.a,
                },
              });
            },
            [a]
          );
          return r.a.createElement(
            r.a.StrictMode,
            null,
            r.a.createElement(
              l.a,
              { store: j },
              r.a.createElement(
                o.a,
                { loading: null, persistor: C },
                r.a.createElement(A.a, { theme: t }, e.children)
              )
            )
          );
        };
      s.a.render(
        r.a.createElement(Xe, null, r.a.createElement(Ke, null)),
        document.getElementById("root")
      ),
        (window.store = j),
        new window.MeetJS({
          contextPath: "socket",
          url: "https://chat-demo-v1.herokuapp.com".replace("http", "ws"),
          userStatusNeeded: !0,
          debug: !0,
        }).on("RECEIVED_MESSAGE", function (e) {
          var a = e.userName,
            t = e.data;
          if (a) {
            var n = j.getState(),
              r = n.contacts,
              c =
                (n.user,
                r.filter(function (e) {
                  return e.userName === a;
                })[0]);
            c ||
              (j.dispatch(T(a)),
              (c = j.getState().contacts.filter(function (e) {
                return e.userName === a;
              })[0])),
              j.dispatch(
                w({
                  timestamp: t.createdAt,
                  isSent: !1,
                  message: t.message,
                  mid: t.mid,
                  userId: a,
                })
              );
          }
        });
    },
    26: function (e, a) {
      var t = function () {};
      (t.prototype.generate = function () {
        if (arguments.length > 1) throw new Error("one argument is accepted");
        return {
          code: "#".concat(this.intToRGB(this.hashCode(arguments[0]))),
          name: this.getPicName(arguments[0]).toUpperCase(),
        };
      }),
        (t.prototype.getPicName = function (e) {
          var a = "";
          return (
            e.split(" ").forEach(function (e) {
              a += e.charAt(0);
            }),
            a
          );
        }),
        (t.prototype.hashCode = function (e) {
          for (var a = 0, t = 0; t < e.length; t++)
            a = e.charCodeAt(t) + ((a << 5) - a);
          return a;
        }),
        (t.prototype.intToRGB = function (e) {
          var a = (16777215 & e).toString(16).toUpperCase();
          return "00000".substring(0, 6 - a.length) + a;
        }),
        (t.prototype.organisation = "sanazu"),
        (e.exports = new t());
    },
    86: function (e, a, t) {
      e.exports = window.location.href + "/static/media/dp.430bcc9a.jpg";
    },
    99: function (e, a, t) {
      e.exports = t(123);
    },
  },
  [[99, 1, 2]],
]);
