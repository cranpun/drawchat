(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // resources/ts/data/Draw.ts
  var Draw, StrokeOption, _Stroke, Stroke, Point;
  var init_Draw = __esm({
    "resources/ts/data/Draw.ts"() {
      Draw = class {
        constructor() {
          this.clear();
        }
        push(p) {
          this.s.push(p);
        }
        pop() {
          const ret = this.s.pop();
          return ret;
        }
        peek() {
          const ret = this.s.length > 0 ? this.s[this.s.length - 1] : null;
          return ret;
        }
        clear() {
          this.s = [];
        }
        getStrokes() {
          return this.s;
        }
        lastStrokes() {
          if (this.s.length === 0) {
            return null;
          } else {
            return this.s[this.s.length - 1];
          }
        }
        json() {
          const ret = [];
          for (const p of this.s) {
            ret.push(p.json());
          }
          return `[${ret.join(",")}]`;
        }
        parse(strokes) {
          this.s = [];
          for (const s of strokes) {
            const opt = new StrokeOption(s[0][0], s[0][1]);
            const tmp = new Stroke(opt);
            tmp.parse(s[1]);
            this.s.push(tmp);
          }
        }
        length() {
          return this.s.length;
        }
        setCreatedAt(created_at) {
          this.created_at = created_at;
        }
        setId(id) {
          this.id = id;
        }
        isOlder(draw) {
          if (this.id > draw.id) {
            return -1;
          } else if (this.id < draw.id) {
            return 1;
          } else {
            return 0;
          }
        }
        isNewer(draw) {
          if (this.id > draw.id) {
            return 1;
          } else if (this.id < draw.id) {
            return -1;
          } else {
            return 0;
          }
        }
      };
      StrokeOption = class {
        constructor(color, thick) {
          this.color = color;
          this.thick = thick;
        }
        update(opt) {
          this.color = opt.color;
          this.thick = opt.thick;
        }
      };
      _Stroke = class {
        constructor(opt) {
          this.p = [];
          this.opt = new StrokeOption("", 0);
          this.opt.update(opt);
        }
        push(p) {
          this.p.push(p);
        }
        getPoints() {
          return this.p;
        }
        lastPoint() {
          if (this.p.length === 0) {
            return null;
          } else {
            return this.p[this.p.length - 1];
          }
        }
        clear() {
          this.p = [];
        }
        length() {
          return this.p.length;
        }
        json() {
          const ret = [];
          for (const p of this.p) {
            ret.push(p.json());
          }
          return `[["${this.opt.color}","${this.opt.thick}"],[${ret.join(",")}]]`;
        }
        parse(arr) {
          this.p = [];
          for (const a of arr) {
            const tmp = new Point(parseInt(a[0]), parseInt(a[1]));
            this.p.push(tmp);
          }
        }
        isEraser() {
          const ret = this.opt.color === _Stroke.TK_ERASER;
          return ret;
        }
        isPen() {
          return !this.isEraser();
        }
      };
      Stroke = _Stroke;
      Stroke.TK_ERASER = "e";
      Point = class {
        constructor(x, y) {
          this.x = x;
          this.y = y;
        }
        json() {
          const ret = `[${this.x},${this.y}]`;
          return ret;
        }
        isSame(x, y) {
          const cond1 = x === this.x;
          const cond2 = y === this.y;
          return cond1 && cond2;
        }
      };
    }
  });

  // resources/ts/element/PaperElement.ts
  var PaperElement;
  var init_PaperElement = __esm({
    "resources/ts/element/PaperElement.ts"() {
      PaperElement = class {
        static makeMine() {
          return new PaperElement("#mycanvas");
        }
        static makeOther() {
          return new PaperElement("#othercanvas");
        }
        constructor(selector) {
          this.cnv = document.querySelector(selector);
          this.ctx = this.cnv.getContext("2d");
        }
        getCtx() {
          return this.ctx;
        }
        getCnv() {
          return this.cnv;
        }
        clear() {
          const w = this.cnv.width;
          const h = this.cnv.height;
          this.ctx.clearRect(0, 0, w, h);
        }
      };
    }
  });

  // resources/ts/data/DrawMine.ts
  var DrawMine;
  var init_DrawMine = __esm({
    "resources/ts/data/DrawMine.ts"() {
      init_Draw();
      DrawMine = class {
        constructor() {
          this.draw = new Draw();
          this.user_id = null;
          const urls = window.location.pathname.split("/");
          const paper_id = parseInt(urls[urls.length - 1]);
          this.paper_id = paper_id;
          this.savedStroke = null;
        }
        init(pen) {
          this.pen = pen;
          this.nowstroke = new Stroke(new StrokeOption(this.pen.opt.color, this.pen.opt.thick));
        }
        pushPoint(x, y) {
          const p = new Point(x, y);
          this.nowstroke.push(p);
        }
        lastPoint() {
          return this.nowstroke.lastPoint();
        }
        startStroke() {
          this.nowstroke = new Stroke(this.pen.opt);
        }
        endStroke() {
          if (this.nowstroke.length() > 0) {
            this.draw.push(this.nowstroke);
          }
        }
        save() {
          return __async(this, null, function* () {
            const urls = window.location.pathname.split("/");
            const paper_id = parseInt(urls[urls.length - 1]);
            const url = `/api/draw/${paper_id}`;
            const postdata = new FormData();
            postdata.append("json_draw", this.draw.json());
            postdata.append("user_id", this.user_id);
            const option = {
              method: "POST",
              body: postdata
            };
            const response = yield fetch(url, option);
            const res_save = JSON.parse(yield response.text());
            if (this.user_id === null) {
              this.user_id = res_save.user_id.toString();
            }
            this.savedStroke = this.draw.peek();
          });
        }
        getDraw() {
          return this.draw;
        }
        clear() {
          this.draw.clear();
        }
        undo() {
          this.draw.getStrokes().pop();
          const ret = this.draw.getStrokes();
          return ret;
        }
        getNowStroke() {
          return this.nowstroke;
        }
        isSaved() {
          const ret = this.savedStroke === this.draw.peek();
          return ret;
        }
      };
    }
  });

  // resources/ts/data/DrawOther.ts
  var DrawOther;
  var init_DrawOther = __esm({
    "resources/ts/data/DrawOther.ts"() {
      init_Draw();
      DrawOther = class {
        constructor() {
          this.draws = [];
          this.user_id = null;
          this.after_paper_id = 0;
          const urls = window.location.pathname.split("/");
          const paper_id = parseInt(urls[urls.length - 1]);
          this.paper_id = paper_id;
        }
        load() {
          return __async(this, null, function* () {
            let url = "";
            if (this.user_id) {
              url = `/api/draw/${this.paper_id}/others/${this.user_id}`;
            } else {
              url = `/api/draw/${this.paper_id}/after/{${this.after_paper_id}`;
            }
            const response = yield fetch(url);
            const text = yield response.text();
            this.draws.splice(0, this.draws.length);
            for (const d of JSON.parse(text)) {
              const obj = JSON.parse(d.json_draw);
              const draw = new Draw();
              draw.parse(obj);
              draw.setCreatedAt(d.created_at);
              draw.setId(d.id);
              this.draws.push(draw);
            }
            this.draws = this.draws.sort((a, b) => {
              return a.isNewer(b);
            });
            if (this.draws.length > 0) {
              this.after_paper_id = this.draws[this.draws.length - 1].id;
            }
          });
        }
        getDraws() {
          return this.draws;
        }
      };
    }
  });

  // resources/ts/sensor/MouseSensor.ts
  var MouseSensor;
  var init_MouseSensor = __esm({
    "resources/ts/sensor/MouseSensor.ts"() {
      init_Draw();
      MouseSensor = class {
        constructor() {
          this.canvashandlers = [];
        }
        init(sense, paper) {
          this.sense = sense;
          this.paper = paper;
          this.canvashandlers["mouseup"] = (e) => this.sense.up("mouse", e, this.p(e));
          this.canvashandlers["mousedown"] = (e) => this.sense.down("mouse", e, this.p(e));
          this.canvashandlers["mousemove"] = (e) => this.sense.move("mouse", e, this.p(e));
          this.canvashandlers["mouseleave"] = (e) => this.sense.up("mouse", e, this.p(e));
          this.addDefaultListener();
        }
        addDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().addEventListener(event, handler, { passive: false });
          }
        }
        removeDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().removeEventListener(event, handler);
          }
        }
        p(e) {
          const x = e.offsetX;
          const y = e.offsetY;
          return new Point(x, y);
        }
      };
    }
  });

  // resources/ts/sensor/PointerSensor.ts
  var PointerSensor;
  var init_PointerSensor = __esm({
    "resources/ts/sensor/PointerSensor.ts"() {
      init_Draw();
      PointerSensor = class {
        constructor() {
          this.canvashandlers = [];
        }
        init(sense, paper) {
          this.sense = sense;
          this.paper = paper;
          this.canvashandlers["pointerup"] = (e) => this.sense.up("pointer", e, this.p(e));
          this.canvashandlers["pointerdown"] = (e) => this.sense.down("pointer", e, this.p(e));
          this.canvashandlers["pointermove"] = (e) => this.sense.move("pointer", e, this.p(e));
          this.canvashandlers["pointerleave"] = (e) => this.sense.up("pointer", e, this.p(e));
          this.addDefaultListener();
        }
        addDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().addEventListener(event, handler, { passive: false });
          }
        }
        removeDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().removeEventListener(event, handler);
          }
        }
        p(e) {
          const x = e.offsetX;
          const y = e.offsetY;
          return new Point(x, y);
        }
      };
    }
  });

  // resources/ts/sensor/TouchSensor.ts
  var TouchSensor;
  var init_TouchSensor = __esm({
    "resources/ts/sensor/TouchSensor.ts"() {
      init_Draw();
      TouchSensor = class {
        constructor() {
          this.canvashandlers = [];
        }
        init(sense, paper, zoomscroll) {
          this.sense = sense;
          this.paper = paper;
          this.zoomscroll = zoomscroll;
          this.canvashandlers["touchend"] = (e) => this.sense.up("touch", e, this.p(e));
          this.canvashandlers["touchstart"] = (e) => this.sense.down("touch", e, this.p(e));
          this.canvashandlers["touchmove"] = (e) => this.sense.move("touch", e, this.p(e));
          this.canvashandlers["touchleave"] = (e) => this.sense.up("touch", e, this.p(e));
          this.addDefaultListener();
        }
        addDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().addEventListener(event, handler, { passive: false });
          }
        }
        removeDefaultListener() {
          for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().removeEventListener(event, handler);
          }
        }
        p(e) {
          const ct = e.changedTouches[0];
          const bc = e.target.getBoundingClientRect();
          const x = ct.clientX - bc.left;
          const y = ct.clientY - bc.top;
          return new Point(x / this.zoomscroll.getZoom(), y / this.zoomscroll.getZoom());
        }
      };
    }
  });

  // node_modules/sweetalert2/dist/sweetalert2.all.js
  var require_sweetalert2_all = __commonJS({
    "node_modules/sweetalert2/dist/sweetalert2.all.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.Sweetalert2 = factory());
      })(exports, function() {
        "use strict";
        const consolePrefix = "SweetAlert2:";
        const uniqueArray = (arr) => {
          const result = [];
          for (let i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) === -1) {
              result.push(arr[i]);
            }
          }
          return result;
        };
        const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const warn = (message) => {
          console.warn("".concat(consolePrefix, " ").concat(typeof message === "object" ? message.join(" ") : message));
        };
        const error = (message) => {
          console.error("".concat(consolePrefix, " ").concat(message));
        };
        const previousWarnOnceMessages = [];
        const warnOnce = (message) => {
          if (!previousWarnOnceMessages.includes(message)) {
            previousWarnOnceMessages.push(message);
            warn(message);
          }
        };
        const warnAboutDeprecation = (deprecatedParam, useInstead) => {
          warnOnce('"'.concat(deprecatedParam, '" is deprecated and will be removed in the next major release. Please use "').concat(useInstead, '" instead.'));
        };
        const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
        const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
        const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
        const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const defaultParams = {
          title: "",
          titleText: "",
          text: "",
          html: "",
          footer: "",
          icon: void 0,
          iconColor: void 0,
          iconHtml: void 0,
          template: void 0,
          toast: false,
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show"
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide"
          },
          customClass: {},
          target: "body",
          color: void 0,
          backdrop: true,
          heightAuto: true,
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          stopKeydownPropagation: true,
          keydownListenerCapture: false,
          showConfirmButton: true,
          showDenyButton: false,
          showCancelButton: false,
          preConfirm: void 0,
          preDeny: void 0,
          confirmButtonText: "OK",
          confirmButtonAriaLabel: "",
          confirmButtonColor: void 0,
          denyButtonText: "No",
          denyButtonAriaLabel: "",
          denyButtonColor: void 0,
          cancelButtonText: "Cancel",
          cancelButtonAriaLabel: "",
          cancelButtonColor: void 0,
          buttonsStyling: true,
          reverseButtons: false,
          focusConfirm: true,
          focusDeny: false,
          focusCancel: false,
          returnFocus: true,
          showCloseButton: false,
          closeButtonHtml: "&times;",
          closeButtonAriaLabel: "Close this dialog",
          loaderHtml: "",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          imageUrl: void 0,
          imageWidth: void 0,
          imageHeight: void 0,
          imageAlt: "",
          timer: void 0,
          timerProgressBar: false,
          width: void 0,
          padding: void 0,
          background: void 0,
          input: void 0,
          inputPlaceholder: "",
          inputLabel: "",
          inputValue: "",
          inputOptions: {},
          inputAutoTrim: true,
          inputAttributes: {},
          inputValidator: void 0,
          returnInputValueOnDeny: false,
          validationMessage: void 0,
          grow: false,
          position: "center",
          progressSteps: [],
          currentProgressStep: void 0,
          progressStepsDistance: void 0,
          willOpen: void 0,
          didOpen: void 0,
          didRender: void 0,
          willClose: void 0,
          didClose: void 0,
          didDestroy: void 0,
          scrollbarPadding: true
        };
        const updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "willClose"];
        const deprecatedParams = {};
        const toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
        const isValidParameter = (paramName) => {
          return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
        };
        const isUpdatableParameter = (paramName) => {
          return updatableParams.indexOf(paramName) !== -1;
        };
        const isDeprecatedParameter = (paramName) => {
          return deprecatedParams[paramName];
        };
        const checkIfParamIsValid = (param) => {
          if (!isValidParameter(param)) {
            warn('Unknown parameter "'.concat(param, '"'));
          }
        };
        const checkIfToastParamIsValid = (param) => {
          if (toastIncompatibleParams.includes(param)) {
            warn('The parameter "'.concat(param, '" is incompatible with toasts'));
          }
        };
        const checkIfParamIsDeprecated = (param) => {
          if (isDeprecatedParameter(param)) {
            warnAboutDeprecation(param, isDeprecatedParameter(param));
          }
        };
        const showWarningsForParams = (params) => {
          if (!params.backdrop && params.allowOutsideClick) {
            warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
          }
          for (const param in params) {
            checkIfParamIsValid(param);
            if (params.toast) {
              checkIfToastParamIsValid(param);
            }
            checkIfParamIsDeprecated(param);
          }
        };
        const swalPrefix = "swal2-";
        const prefix = (items) => {
          const result = {};
          for (const i in items) {
            result[items[i]] = swalPrefix + items[i];
          }
          return result;
        };
        const swalClasses = prefix(["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "default-outline", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error", "no-war"]);
        const iconTypes = prefix(["success", "warning", "info", "question", "error"]);
        const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));
        const elementBySelector = (selectorString) => {
          const container = getContainer();
          return container ? container.querySelector(selectorString) : null;
        };
        const elementByClass = (className) => {
          return elementBySelector(".".concat(className));
        };
        const getPopup = () => elementByClass(swalClasses.popup);
        const getIcon = () => elementByClass(swalClasses.icon);
        const getTitle = () => elementByClass(swalClasses.title);
        const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
        const getImage = () => elementByClass(swalClasses.image);
        const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
        const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
        const getConfirmButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
        const getDenyButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
        const getInputLabel = () => elementByClass(swalClasses["input-label"]);
        const getLoader = () => elementBySelector(".".concat(swalClasses.loader));
        const getCancelButton = () => elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
        const getActions = () => elementByClass(swalClasses.actions);
        const getFooter = () => elementByClass(swalClasses.footer);
        const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
        const getCloseButton = () => elementByClass(swalClasses.close);
        const focusable = '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n';
        const getFocusableElements = () => {
          const focusableElementsWithTabindex = Array.from(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort((a, b) => {
            const tabindexA = parseInt(a.getAttribute("tabindex"));
            const tabindexB = parseInt(b.getAttribute("tabindex"));
            if (tabindexA > tabindexB) {
              return 1;
            } else if (tabindexA < tabindexB) {
              return -1;
            }
            return 0;
          });
          const otherFocusableElements = Array.from(getPopup().querySelectorAll(focusable)).filter((el) => el.getAttribute("tabindex") !== "-1");
          return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter((el) => isVisible(el));
        };
        const isModal = () => {
          return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
        };
        const isToast = () => {
          return getPopup() && hasClass(getPopup(), swalClasses.toast);
        };
        const isLoading = () => {
          return getPopup().hasAttribute("data-loading");
        };
        const states = {
          previousBodyPadding: null
        };
        const setInnerHtml = (elem, html) => {
          elem.textContent = "";
          if (html) {
            const parser = new DOMParser();
            const parsed = parser.parseFromString(html, "text/html");
            Array.from(parsed.querySelector("head").childNodes).forEach((child) => {
              elem.appendChild(child);
            });
            Array.from(parsed.querySelector("body").childNodes).forEach((child) => {
              elem.appendChild(child);
            });
          }
        };
        const hasClass = (elem, className) => {
          if (!className) {
            return false;
          }
          const classList = className.split(/\s+/);
          for (let i = 0; i < classList.length; i++) {
            if (!elem.classList.contains(classList[i])) {
              return false;
            }
          }
          return true;
        };
        const removeCustomClasses = (elem, params) => {
          Array.from(elem.classList).forEach((className) => {
            if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
              elem.classList.remove(className);
            }
          });
        };
        const applyCustomClass = (elem, params, className) => {
          removeCustomClasses(elem, params);
          if (params.customClass && params.customClass[className]) {
            if (typeof params.customClass[className] !== "string" && !params.customClass[className].forEach) {
              return warn("Invalid type of customClass.".concat(className, '! Expected string or iterable object, got "').concat(typeof params.customClass[className], '"'));
            }
            addClass(elem, params.customClass[className]);
          }
        };
        const getInput = (popup, inputClass) => {
          if (!inputClass) {
            return null;
          }
          switch (inputClass) {
            case "select":
            case "textarea":
            case "file":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
            case "checkbox":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
            case "radio":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
            case "range":
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
            default:
              return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
          }
        };
        const focusInput = (input) => {
          input.focus();
          if (input.type !== "file") {
            const val = input.value;
            input.value = "";
            input.value = val;
          }
        };
        const toggleClass = (target, classList, condition) => {
          if (!target || !classList) {
            return;
          }
          if (typeof classList === "string") {
            classList = classList.split(/\s+/).filter(Boolean);
          }
          classList.forEach((className) => {
            if (Array.isArray(target)) {
              target.forEach((elem) => {
                condition ? elem.classList.add(className) : elem.classList.remove(className);
              });
            } else {
              condition ? target.classList.add(className) : target.classList.remove(className);
            }
          });
        };
        const addClass = (target, classList) => {
          toggleClass(target, classList, true);
        };
        const removeClass = (target, classList) => {
          toggleClass(target, classList, false);
        };
        const getDirectChildByClass = (elem, className) => {
          const children = Array.from(elem.children);
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child instanceof HTMLElement && hasClass(child, className)) {
              return child;
            }
          }
        };
        const applyNumericalStyle = (elem, property, value) => {
          if (value === "".concat(parseInt(value))) {
            value = parseInt(value);
          }
          if (value || parseInt(value) === 0) {
            elem.style[property] = typeof value === "number" ? "".concat(value, "px") : value;
          } else {
            elem.style.removeProperty(property);
          }
        };
        const show = function(elem) {
          let display = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "flex";
          elem.style.display = display;
        };
        const hide = (elem) => {
          elem.style.display = "none";
        };
        const setStyle = (parent, selector, property, value) => {
          const el = parent.querySelector(selector);
          if (el) {
            el.style[property] = value;
          }
        };
        const toggle = function(elem, condition) {
          let display = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "flex";
          condition ? show(elem, display) : hide(elem);
        };
        const isVisible = (elem) => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
        const allButtonsAreHidden = () => !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
        const isScrollable = (elem) => !!(elem.scrollHeight > elem.clientHeight);
        const hasCssAnimation = (elem) => {
          const style = window.getComputedStyle(elem);
          const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
          const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
          return animDuration > 0 || transDuration > 0;
        };
        const animateTimerProgressBar = function(timer) {
          let reset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          const timerProgressBar = getTimerProgressBar();
          if (isVisible(timerProgressBar)) {
            if (reset) {
              timerProgressBar.style.transition = "none";
              timerProgressBar.style.width = "100%";
            }
            setTimeout(() => {
              timerProgressBar.style.transition = "width ".concat(timer / 1e3, "s linear");
              timerProgressBar.style.width = "0%";
            }, 10);
          }
        };
        const stopTimerProgressBar = () => {
          const timerProgressBar = getTimerProgressBar();
          const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          timerProgressBar.style.removeProperty("transition");
          timerProgressBar.style.width = "100%";
          const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
          timerProgressBar.style.removeProperty("transition");
          timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
        };
        const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
        const RESTORE_FOCUS_TIMEOUT = 100;
        const globalState = {};
        const focusPreviousActiveElement = () => {
          if (globalState.previousActiveElement instanceof HTMLElement) {
            globalState.previousActiveElement.focus();
            globalState.previousActiveElement = null;
          } else if (document.body) {
            document.body.focus();
          }
        };
        const restoreActiveElement = (returnFocus) => {
          return new Promise((resolve) => {
            if (!returnFocus) {
              return resolve();
            }
            const x = window.scrollX;
            const y = window.scrollY;
            globalState.restoreFocusTimeout = setTimeout(() => {
              focusPreviousActiveElement();
              resolve();
            }, RESTORE_FOCUS_TIMEOUT);
            window.scrollTo(x, y);
          });
        };
        const sweetHTML = '\n <div aria-labelledby="'.concat(swalClasses.title, '" aria-describedby="').concat(swalClasses["html-container"], '" class="').concat(swalClasses.popup, '" tabindex="-1">\n   <button type="button" class="').concat(swalClasses.close, '"></button>\n   <ul class="').concat(swalClasses["progress-steps"], '"></ul>\n   <div class="').concat(swalClasses.icon, '"></div>\n   <img class="').concat(swalClasses.image, '" />\n   <h2 class="').concat(swalClasses.title, '" id="').concat(swalClasses.title, '"></h2>\n   <div class="').concat(swalClasses["html-container"], '" id="').concat(swalClasses["html-container"], '"></div>\n   <input class="').concat(swalClasses.input, '" />\n   <input type="file" class="').concat(swalClasses.file, '" />\n   <div class="').concat(swalClasses.range, '">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="').concat(swalClasses.select, '"></select>\n   <div class="').concat(swalClasses.radio, '"></div>\n   <label for="').concat(swalClasses.checkbox, '" class="').concat(swalClasses.checkbox, '">\n     <input type="checkbox" />\n     <span class="').concat(swalClasses.label, '"></span>\n   </label>\n   <textarea class="').concat(swalClasses.textarea, '"></textarea>\n   <div class="').concat(swalClasses["validation-message"], '" id="').concat(swalClasses["validation-message"], '"></div>\n   <div class="').concat(swalClasses.actions, '">\n     <div class="').concat(swalClasses.loader, '"></div>\n     <button type="button" class="').concat(swalClasses.confirm, '"></button>\n     <button type="button" class="').concat(swalClasses.deny, '"></button>\n     <button type="button" class="').concat(swalClasses.cancel, '"></button>\n   </div>\n   <div class="').concat(swalClasses.footer, '"></div>\n   <div class="').concat(swalClasses["timer-progress-bar-container"], '">\n     <div class="').concat(swalClasses["timer-progress-bar"], '"></div>\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, "");
        const resetOldContainer = () => {
          const oldContainer = getContainer();
          if (!oldContainer) {
            return false;
          }
          oldContainer.remove();
          removeClass([document.documentElement, document.body], [swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"]]);
          return true;
        };
        const resetValidationMessage = () => {
          globalState.currentInstance.resetValidationMessage();
        };
        const addInputChangeListeners = () => {
          const popup = getPopup();
          const input = getDirectChildByClass(popup, swalClasses.input);
          const file = getDirectChildByClass(popup, swalClasses.file);
          const range = popup.querySelector(".".concat(swalClasses.range, " input"));
          const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
          const select = getDirectChildByClass(popup, swalClasses.select);
          const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
          const textarea = getDirectChildByClass(popup, swalClasses.textarea);
          input.oninput = resetValidationMessage;
          file.onchange = resetValidationMessage;
          select.onchange = resetValidationMessage;
          checkbox.onchange = resetValidationMessage;
          textarea.oninput = resetValidationMessage;
          range.oninput = () => {
            resetValidationMessage();
            rangeOutput.value = range.value;
          };
          range.onchange = () => {
            resetValidationMessage();
            rangeOutput.value = range.value;
          };
        };
        const getTarget = (target) => typeof target === "string" ? document.querySelector(target) : target;
        const setupAccessibility = (params) => {
          const popup = getPopup();
          popup.setAttribute("role", params.toast ? "alert" : "dialog");
          popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
          if (!params.toast) {
            popup.setAttribute("aria-modal", "true");
          }
        };
        const setupRTL = (targetElement) => {
          if (window.getComputedStyle(targetElement).direction === "rtl") {
            addClass(getContainer(), swalClasses.rtl);
          }
        };
        const init = (params) => {
          const oldContainerExisted = resetOldContainer();
          if (isNodeEnv()) {
            error("SweetAlert2 requires document to initialize");
            return;
          }
          const container = document.createElement("div");
          container.className = swalClasses.container;
          if (oldContainerExisted) {
            addClass(container, swalClasses["no-transition"]);
          }
          setInnerHtml(container, sweetHTML);
          const targetElement = getTarget(params.target);
          targetElement.appendChild(container);
          setupAccessibility(params);
          setupRTL(targetElement);
          addInputChangeListeners();
        };
        const parseHtmlToContainer = (param, target) => {
          if (param instanceof HTMLElement) {
            target.appendChild(param);
          } else if (typeof param === "object") {
            handleObject(param, target);
          } else if (param) {
            setInnerHtml(target, param);
          }
        };
        const handleObject = (param, target) => {
          if (param.jquery) {
            handleJqueryElem(target, param);
          } else {
            setInnerHtml(target, param.toString());
          }
        };
        const handleJqueryElem = (target, elem) => {
          target.textContent = "";
          if (0 in elem) {
            for (let i = 0; i in elem; i++) {
              target.appendChild(elem[i].cloneNode(true));
            }
          } else {
            target.appendChild(elem.cloneNode(true));
          }
        };
        const animationEndEvent = (() => {
          if (isNodeEnv()) {
            return false;
          }
          const testEl = document.createElement("div");
          const transEndEventNames = {
            WebkitAnimation: "webkitAnimationEnd",
            animation: "animationend"
          };
          for (const i in transEndEventNames) {
            if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== "undefined") {
              return transEndEventNames[i];
            }
          }
          return false;
        })();
        const measureScrollbar = () => {
          const scrollDiv = document.createElement("div");
          scrollDiv.className = swalClasses["scrollbar-measure"];
          document.body.appendChild(scrollDiv);
          const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        };
        const renderActions = (instance, params) => {
          const actions = getActions();
          const loader = getLoader();
          if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
            hide(actions);
          } else {
            show(actions);
          }
          applyCustomClass(actions, params, "actions");
          renderButtons(actions, loader, params);
          setInnerHtml(loader, params.loaderHtml);
          applyCustomClass(loader, params, "loader");
        };
        function renderButtons(actions, loader, params) {
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          renderButton(confirmButton, "confirm", params);
          renderButton(denyButton, "deny", params);
          renderButton(cancelButton, "cancel", params);
          handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
          if (params.reverseButtons) {
            if (params.toast) {
              actions.insertBefore(cancelButton, confirmButton);
              actions.insertBefore(denyButton, confirmButton);
            } else {
              actions.insertBefore(cancelButton, loader);
              actions.insertBefore(denyButton, loader);
              actions.insertBefore(confirmButton, loader);
            }
          }
        }
        function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
          if (!params.buttonsStyling) {
            return removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          }
          addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          if (params.confirmButtonColor) {
            confirmButton.style.backgroundColor = params.confirmButtonColor;
            addClass(confirmButton, swalClasses["default-outline"]);
          }
          if (params.denyButtonColor) {
            denyButton.style.backgroundColor = params.denyButtonColor;
            addClass(denyButton, swalClasses["default-outline"]);
          }
          if (params.cancelButtonColor) {
            cancelButton.style.backgroundColor = params.cancelButtonColor;
            addClass(cancelButton, swalClasses["default-outline"]);
          }
        }
        function renderButton(button, buttonType, params) {
          toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], "inline-block");
          setInnerHtml(button, params["".concat(buttonType, "ButtonText")]);
          button.setAttribute("aria-label", params["".concat(buttonType, "ButtonAriaLabel")]);
          button.className = swalClasses[buttonType];
          applyCustomClass(button, params, "".concat(buttonType, "Button"));
          addClass(button, params["".concat(buttonType, "ButtonClass")]);
        }
        const renderContainer = (instance, params) => {
          const container = getContainer();
          if (!container) {
            return;
          }
          handleBackdropParam(container, params.backdrop);
          handlePositionParam(container, params.position);
          handleGrowParam(container, params.grow);
          applyCustomClass(container, params, "container");
        };
        function handleBackdropParam(container, backdrop) {
          if (typeof backdrop === "string") {
            container.style.background = backdrop;
          } else if (!backdrop) {
            addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
          }
        }
        function handlePositionParam(container, position) {
          if (position in swalClasses) {
            addClass(container, swalClasses[position]);
          } else {
            warn('The "position" parameter is not valid, defaulting to "center"');
            addClass(container, swalClasses.center);
          }
        }
        function handleGrowParam(container, grow) {
          if (grow && typeof grow === "string") {
            const growClass = "grow-".concat(grow);
            if (growClass in swalClasses) {
              addClass(container, swalClasses[growClass]);
            }
          }
        }
        var privateProps = {
          awaitingPromise: /* @__PURE__ */ new WeakMap(),
          promise: /* @__PURE__ */ new WeakMap(),
          innerParams: /* @__PURE__ */ new WeakMap(),
          domCache: /* @__PURE__ */ new WeakMap()
        };
        const inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
        const renderInput = (instance, params) => {
          const popup = getPopup();
          const innerParams = privateProps.innerParams.get(instance);
          const rerender = !innerParams || params.input !== innerParams.input;
          inputClasses.forEach((inputClass) => {
            const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
            setAttributes(inputClass, params.inputAttributes);
            inputContainer.className = swalClasses[inputClass];
            if (rerender) {
              hide(inputContainer);
            }
          });
          if (params.input) {
            if (rerender) {
              showInput(params);
            }
            setCustomClass(params);
          }
        };
        const showInput = (params) => {
          if (!renderInputType[params.input]) {
            return error('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(params.input, '"'));
          }
          const inputContainer = getInputContainer(params.input);
          const input = renderInputType[params.input](inputContainer, params);
          show(inputContainer);
          setTimeout(() => {
            focusInput(input);
          });
        };
        const removeAttributes = (input) => {
          for (let i = 0; i < input.attributes.length; i++) {
            const attrName = input.attributes[i].name;
            if (!["type", "value", "style"].includes(attrName)) {
              input.removeAttribute(attrName);
            }
          }
        };
        const setAttributes = (inputClass, inputAttributes) => {
          const input = getInput(getPopup(), inputClass);
          if (!input) {
            return;
          }
          removeAttributes(input);
          for (const attr in inputAttributes) {
            input.setAttribute(attr, inputAttributes[attr]);
          }
        };
        const setCustomClass = (params) => {
          const inputContainer = getInputContainer(params.input);
          if (typeof params.customClass === "object") {
            addClass(inputContainer, params.customClass.input);
          }
        };
        const setInputPlaceholder = (input, params) => {
          if (!input.placeholder || params.inputPlaceholder) {
            input.placeholder = params.inputPlaceholder;
          }
        };
        const setInputLabel = (input, prependTo, params) => {
          if (params.inputLabel) {
            input.id = swalClasses.input;
            const label = document.createElement("label");
            const labelClass = swalClasses["input-label"];
            label.setAttribute("for", input.id);
            label.className = labelClass;
            if (typeof params.customClass === "object") {
              addClass(label, params.customClass.inputLabel);
            }
            label.innerText = params.inputLabel;
            prependTo.insertAdjacentElement("beforebegin", label);
          }
        };
        const getInputContainer = (inputType) => {
          return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
        };
        const checkAndSetInputValue = (input, inputValue) => {
          if (["string", "number"].includes(typeof inputValue)) {
            input.value = "".concat(inputValue);
          } else if (!isPromise(inputValue)) {
            warn('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(typeof inputValue, '"'));
          }
        };
        const renderInputType = {};
        renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
          checkAndSetInputValue(input, params.inputValue);
          setInputLabel(input, input, params);
          setInputPlaceholder(input, params);
          input.type = params.input;
          return input;
        };
        renderInputType.file = (input, params) => {
          setInputLabel(input, input, params);
          setInputPlaceholder(input, params);
          return input;
        };
        renderInputType.range = (range, params) => {
          const rangeInput = range.querySelector("input");
          const rangeOutput = range.querySelector("output");
          checkAndSetInputValue(rangeInput, params.inputValue);
          rangeInput.type = params.input;
          checkAndSetInputValue(rangeOutput, params.inputValue);
          setInputLabel(rangeInput, range, params);
          return range;
        };
        renderInputType.select = (select, params) => {
          select.textContent = "";
          if (params.inputPlaceholder) {
            const placeholder = document.createElement("option");
            setInnerHtml(placeholder, params.inputPlaceholder);
            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;
            select.appendChild(placeholder);
          }
          setInputLabel(select, select, params);
          return select;
        };
        renderInputType.radio = (radio) => {
          radio.textContent = "";
          return radio;
        };
        renderInputType.checkbox = (checkboxContainer, params) => {
          const checkbox = getInput(getPopup(), "checkbox");
          checkbox.value = "1";
          checkbox.id = swalClasses.checkbox;
          checkbox.checked = Boolean(params.inputValue);
          const label = checkboxContainer.querySelector("span");
          setInnerHtml(label, params.inputPlaceholder);
          return checkbox;
        };
        renderInputType.textarea = (textarea, params) => {
          checkAndSetInputValue(textarea, params.inputValue);
          setInputPlaceholder(textarea, params);
          setInputLabel(textarea, textarea, params);
          const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
          setTimeout(() => {
            if ("MutationObserver" in window) {
              const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
              const textareaResizeHandler = () => {
                const textareaWidth = textarea.offsetWidth + getMargin(textarea);
                if (textareaWidth > initialPopupWidth) {
                  getPopup().style.width = "".concat(textareaWidth, "px");
                } else {
                  getPopup().style.width = null;
                }
              };
              new MutationObserver(textareaResizeHandler).observe(textarea, {
                attributes: true,
                attributeFilter: ["style"]
              });
            }
          });
          return textarea;
        };
        const renderContent = (instance, params) => {
          const htmlContainer = getHtmlContainer();
          applyCustomClass(htmlContainer, params, "htmlContainer");
          if (params.html) {
            parseHtmlToContainer(params.html, htmlContainer);
            show(htmlContainer, "block");
          } else if (params.text) {
            htmlContainer.textContent = params.text;
            show(htmlContainer, "block");
          } else {
            hide(htmlContainer);
          }
          renderInput(instance, params);
        };
        const renderFooter = (instance, params) => {
          const footer = getFooter();
          toggle(footer, params.footer);
          if (params.footer) {
            parseHtmlToContainer(params.footer, footer);
          }
          applyCustomClass(footer, params, "footer");
        };
        const renderCloseButton = (instance, params) => {
          const closeButton = getCloseButton();
          setInnerHtml(closeButton, params.closeButtonHtml);
          applyCustomClass(closeButton, params, "closeButton");
          toggle(closeButton, params.showCloseButton);
          closeButton.setAttribute("aria-label", params.closeButtonAriaLabel);
        };
        const renderIcon = (instance, params) => {
          const innerParams = privateProps.innerParams.get(instance);
          const icon = getIcon();
          if (innerParams && params.icon === innerParams.icon) {
            setContent(icon, params);
            applyStyles(icon, params);
            return;
          }
          if (!params.icon && !params.iconHtml) {
            hide(icon);
            return;
          }
          if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
            error('Unknown icon! Expected "success", "error", "warning", "info" or "question", got "'.concat(params.icon, '"'));
            hide(icon);
            return;
          }
          show(icon);
          setContent(icon, params);
          applyStyles(icon, params);
          addClass(icon, params.showClass.icon);
        };
        const applyStyles = (icon, params) => {
          for (const iconType in iconTypes) {
            if (params.icon !== iconType) {
              removeClass(icon, iconTypes[iconType]);
            }
          }
          addClass(icon, iconTypes[params.icon]);
          setColor(icon, params);
          adjustSuccessIconBackgroundColor();
          applyCustomClass(icon, params, "icon");
        };
        const adjustSuccessIconBackgroundColor = () => {
          const popup = getPopup();
          const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
          const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
          for (let i = 0; i < successIconParts.length; i++) {
            successIconParts[i].style.backgroundColor = popupBackgroundColor;
          }
        };
        const successIconHtml = '\n  <div class="swal2-success-circular-line-left"></div>\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n  <div class="swal2-success-circular-line-right"></div>\n';
        const errorIconHtml = '\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n';
        const setContent = (icon, params) => {
          let oldContent = icon.innerHTML;
          let newContent;
          if (params.iconHtml) {
            newContent = iconContent(params.iconHtml);
          } else if (params.icon === "success") {
            newContent = successIconHtml;
            oldContent = oldContent.replace(/ style=".*?"/g, "");
          } else if (params.icon === "error") {
            newContent = errorIconHtml;
          } else {
            const defaultIconHtml = {
              question: "?",
              warning: "!",
              info: "i"
            };
            newContent = iconContent(defaultIconHtml[params.icon]);
          }
          if (oldContent.trim() !== newContent.trim()) {
            setInnerHtml(icon, newContent);
          }
        };
        const setColor = (icon, params) => {
          if (!params.iconColor) {
            return;
          }
          icon.style.color = params.iconColor;
          icon.style.borderColor = params.iconColor;
          for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
            setStyle(icon, sel, "backgroundColor", params.iconColor);
          }
          setStyle(icon, ".swal2-success-ring", "borderColor", params.iconColor);
        };
        const iconContent = (content) => '<div class="'.concat(swalClasses["icon-content"], '">').concat(content, "</div>");
        const renderImage = (instance, params) => {
          const image = getImage();
          if (!params.imageUrl) {
            return hide(image);
          }
          show(image, "");
          image.setAttribute("src", params.imageUrl);
          image.setAttribute("alt", params.imageAlt);
          applyNumericalStyle(image, "width", params.imageWidth);
          applyNumericalStyle(image, "height", params.imageHeight);
          image.className = swalClasses.image;
          applyCustomClass(image, params, "image");
        };
        const renderProgressSteps = (instance, params) => {
          const progressStepsContainer = getProgressSteps();
          if (!params.progressSteps || params.progressSteps.length === 0) {
            return hide(progressStepsContainer);
          }
          show(progressStepsContainer);
          progressStepsContainer.textContent = "";
          if (params.currentProgressStep >= params.progressSteps.length) {
            warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
          }
          params.progressSteps.forEach((step, index) => {
            const stepEl = createStepElement(step);
            progressStepsContainer.appendChild(stepEl);
            if (index === params.currentProgressStep) {
              addClass(stepEl, swalClasses["active-progress-step"]);
            }
            if (index !== params.progressSteps.length - 1) {
              const lineEl = createLineElement(params);
              progressStepsContainer.appendChild(lineEl);
            }
          });
        };
        const createStepElement = (step) => {
          const stepEl = document.createElement("li");
          addClass(stepEl, swalClasses["progress-step"]);
          setInnerHtml(stepEl, step);
          return stepEl;
        };
        const createLineElement = (params) => {
          const lineEl = document.createElement("li");
          addClass(lineEl, swalClasses["progress-step-line"]);
          if (params.progressStepsDistance) {
            applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
          }
          return lineEl;
        };
        const renderTitle = (instance, params) => {
          const title = getTitle();
          toggle(title, params.title || params.titleText, "block");
          if (params.title) {
            parseHtmlToContainer(params.title, title);
          }
          if (params.titleText) {
            title.innerText = params.titleText;
          }
          applyCustomClass(title, params, "title");
        };
        const renderPopup = (instance, params) => {
          const container = getContainer();
          const popup = getPopup();
          if (params.toast) {
            applyNumericalStyle(container, "width", params.width);
            popup.style.width = "100%";
            popup.insertBefore(getLoader(), getIcon());
          } else {
            applyNumericalStyle(popup, "width", params.width);
          }
          applyNumericalStyle(popup, "padding", params.padding);
          if (params.color) {
            popup.style.color = params.color;
          }
          if (params.background) {
            popup.style.background = params.background;
          }
          hide(getValidationMessage());
          addClasses(popup, params);
        };
        const addClasses = (popup, params) => {
          popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : "");
          if (params.toast) {
            addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
            addClass(popup, swalClasses.toast);
          } else {
            addClass(popup, swalClasses.modal);
          }
          applyCustomClass(popup, params, "popup");
          if (typeof params.customClass === "string") {
            addClass(popup, params.customClass);
          }
          if (params.icon) {
            addClass(popup, swalClasses["icon-".concat(params.icon)]);
          }
        };
        const render = (instance, params) => {
          renderPopup(instance, params);
          renderContainer(instance, params);
          renderProgressSteps(instance, params);
          renderIcon(instance, params);
          renderImage(instance, params);
          renderTitle(instance, params);
          renderCloseButton(instance, params);
          renderContent(instance, params);
          renderActions(instance, params);
          renderFooter(instance, params);
          if (typeof params.didRender === "function") {
            params.didRender(getPopup());
          }
        };
        const DismissReason = Object.freeze({
          cancel: "cancel",
          backdrop: "backdrop",
          close: "close",
          esc: "esc",
          timer: "timer"
        });
        const setAriaHidden = () => {
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el === getContainer() || el.contains(getContainer())) {
              return;
            }
            if (el.hasAttribute("aria-hidden")) {
              el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden"));
            }
            el.setAttribute("aria-hidden", "true");
          });
        };
        const unsetAriaHidden = () => {
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el.hasAttribute("data-previous-aria-hidden")) {
              el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden"));
              el.removeAttribute("data-previous-aria-hidden");
            } else {
              el.removeAttribute("aria-hidden");
            }
          });
        };
        const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
        const getTemplateParams = (params) => {
          const template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
          if (!template) {
            return {};
          }
          const templateContent = template.content;
          showWarningsForElements(templateContent);
          const result = Object.assign(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
          return result;
        };
        const getSwalParams = (templateContent) => {
          const result = {};
          const swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
          swalParams.forEach((param) => {
            showWarningsForAttributes(param, ["name", "value"]);
            const paramName = param.getAttribute("name");
            const value = param.getAttribute("value");
            if (typeof defaultParams[paramName] === "boolean" && value === "false") {
              result[paramName] = false;
            }
            if (typeof defaultParams[paramName] === "object") {
              result[paramName] = JSON.parse(value);
            }
          });
          return result;
        };
        const getSwalButtons = (templateContent) => {
          const result = {};
          const swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
          swalButtons.forEach((button) => {
            showWarningsForAttributes(button, ["type", "color", "aria-label"]);
            const type = button.getAttribute("type");
            result["".concat(type, "ButtonText")] = button.innerHTML;
            result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
            if (button.hasAttribute("color")) {
              result["".concat(type, "ButtonColor")] = button.getAttribute("color");
            }
            if (button.hasAttribute("aria-label")) {
              result["".concat(type, "ButtonAriaLabel")] = button.getAttribute("aria-label");
            }
          });
          return result;
        };
        const getSwalImage = (templateContent) => {
          const result = {};
          const image = templateContent.querySelector("swal-image");
          if (image) {
            showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
            if (image.hasAttribute("src")) {
              result.imageUrl = image.getAttribute("src");
            }
            if (image.hasAttribute("width")) {
              result.imageWidth = image.getAttribute("width");
            }
            if (image.hasAttribute("height")) {
              result.imageHeight = image.getAttribute("height");
            }
            if (image.hasAttribute("alt")) {
              result.imageAlt = image.getAttribute("alt");
            }
          }
          return result;
        };
        const getSwalIcon = (templateContent) => {
          const result = {};
          const icon = templateContent.querySelector("swal-icon");
          if (icon) {
            showWarningsForAttributes(icon, ["type", "color"]);
            if (icon.hasAttribute("type")) {
              result.icon = icon.getAttribute("type");
            }
            if (icon.hasAttribute("color")) {
              result.iconColor = icon.getAttribute("color");
            }
            result.iconHtml = icon.innerHTML;
          }
          return result;
        };
        const getSwalInput = (templateContent) => {
          const result = {};
          const input = templateContent.querySelector("swal-input");
          if (input) {
            showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
            result.input = input.getAttribute("type") || "text";
            if (input.hasAttribute("label")) {
              result.inputLabel = input.getAttribute("label");
            }
            if (input.hasAttribute("placeholder")) {
              result.inputPlaceholder = input.getAttribute("placeholder");
            }
            if (input.hasAttribute("value")) {
              result.inputValue = input.getAttribute("value");
            }
          }
          const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
          if (inputOptions.length) {
            result.inputOptions = {};
            inputOptions.forEach((option) => {
              showWarningsForAttributes(option, ["value"]);
              const optionValue = option.getAttribute("value");
              const optionName = option.innerHTML;
              result.inputOptions[optionValue] = optionName;
            });
          }
          return result;
        };
        const getSwalStringParams = (templateContent, paramNames) => {
          const result = {};
          for (const i in paramNames) {
            const paramName = paramNames[i];
            const tag = templateContent.querySelector(paramName);
            if (tag) {
              showWarningsForAttributes(tag, []);
              result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
            }
          }
          return result;
        };
        const showWarningsForElements = (templateContent) => {
          const allowedElements = swalStringParams.concat(["swal-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
          Array.from(templateContent.children).forEach((el) => {
            const tagName = el.tagName.toLowerCase();
            if (allowedElements.indexOf(tagName) === -1) {
              warn("Unrecognized element <".concat(tagName, ">"));
            }
          });
        };
        const showWarningsForAttributes = (el, allowedAttributes) => {
          Array.from(el.attributes).forEach((attribute) => {
            if (allowedAttributes.indexOf(attribute.name) === -1) {
              warn(['Unrecognized attribute "'.concat(attribute.name, '" on <').concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(", ")) : "To set the value, use HTML within the element.")]);
            }
          });
        };
        var defaultInputValidators = {
          email: (string, validationMessage) => {
            return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
          },
          url: (string, validationMessage) => {
            return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
          }
        };
        function setDefaultInputValidators(params) {
          if (!params.inputValidator) {
            Object.keys(defaultInputValidators).forEach((key) => {
              if (params.input === key) {
                params.inputValidator = defaultInputValidators[key];
              }
            });
          }
        }
        function validateCustomTargetElement(params) {
          if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
            warn('Target parameter is not valid, defaulting to "body"');
            params.target = "body";
          }
        }
        function setParameters(params) {
          setDefaultInputValidators(params);
          if (params.showLoaderOnConfirm && !params.preConfirm) {
            warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
          }
          validateCustomTargetElement(params);
          if (typeof params.title === "string") {
            params.title = params.title.split("\n").join("<br />");
          }
          init(params);
        }
        class Timer {
          constructor(callback, delay) {
            this.callback = callback;
            this.remaining = delay;
            this.running = false;
            this.start();
          }
          start() {
            if (!this.running) {
              this.running = true;
              this.started = new Date();
              this.id = setTimeout(this.callback, this.remaining);
            }
            return this.remaining;
          }
          stop() {
            if (this.running) {
              this.running = false;
              clearTimeout(this.id);
              this.remaining -= new Date().getTime() - this.started.getTime();
            }
            return this.remaining;
          }
          increase(n) {
            const running = this.running;
            if (running) {
              this.stop();
            }
            this.remaining += n;
            if (running) {
              this.start();
            }
            return this.remaining;
          }
          getTimerLeft() {
            if (this.running) {
              this.stop();
              this.start();
            }
            return this.remaining;
          }
          isRunning() {
            return this.running;
          }
        }
        const fixScrollbar = () => {
          if (states.previousBodyPadding !== null) {
            return;
          }
          if (document.body.scrollHeight > window.innerHeight) {
            states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
            document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
          }
        };
        const undoScrollbar = () => {
          if (states.previousBodyPadding !== null) {
            document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
            states.previousBodyPadding = null;
          }
        };
        const iOSfix = () => {
          const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
          if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
            const offset = document.body.scrollTop;
            document.body.style.top = "".concat(offset * -1, "px");
            addClass(document.body, swalClasses.iosfix);
            lockBodyScroll();
            addBottomPaddingForTallPopups();
          }
        };
        const addBottomPaddingForTallPopups = () => {
          const ua = navigator.userAgent;
          const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
          const webkit = !!ua.match(/WebKit/i);
          const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
          if (iOSSafari) {
            const bottomPanelHeight = 44;
            if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
              getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
            }
          }
        };
        const lockBodyScroll = () => {
          const container = getContainer();
          let preventTouchMove;
          container.ontouchstart = (e) => {
            preventTouchMove = shouldPreventTouchMove(e);
          };
          container.ontouchmove = (e) => {
            if (preventTouchMove) {
              e.preventDefault();
              e.stopPropagation();
            }
          };
        };
        const shouldPreventTouchMove = (event) => {
          const target = event.target;
          const container = getContainer();
          if (isStylus(event) || isZoom(event)) {
            return false;
          }
          if (target === container) {
            return true;
          }
          if (!isScrollable(container) && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !(isScrollable(getHtmlContainer()) && getHtmlContainer().contains(target))) {
            return true;
          }
          return false;
        };
        const isStylus = (event) => {
          return event.touches && event.touches.length && event.touches[0].touchType === "stylus";
        };
        const isZoom = (event) => {
          return event.touches && event.touches.length > 1;
        };
        const undoIOSfix = () => {
          if (hasClass(document.body, swalClasses.iosfix)) {
            const offset = parseInt(document.body.style.top, 10);
            removeClass(document.body, swalClasses.iosfix);
            document.body.style.top = "";
            document.body.scrollTop = offset * -1;
          }
        };
        const SHOW_CLASS_TIMEOUT = 10;
        const openPopup = (params) => {
          const container = getContainer();
          const popup = getPopup();
          if (typeof params.willOpen === "function") {
            params.willOpen(popup);
          }
          const bodyStyles = window.getComputedStyle(document.body);
          const initialBodyOverflow = bodyStyles.overflowY;
          addClasses$1(container, popup, params);
          setTimeout(() => {
            setScrollingVisibility(container, popup);
          }, SHOW_CLASS_TIMEOUT);
          if (isModal()) {
            fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
            setAriaHidden();
          }
          if (!isToast() && !globalState.previousActiveElement) {
            globalState.previousActiveElement = document.activeElement;
          }
          if (typeof params.didOpen === "function") {
            setTimeout(() => params.didOpen(popup));
          }
          removeClass(container, swalClasses["no-transition"]);
        };
        const swalOpenAnimationFinished = (event) => {
          const popup = getPopup();
          if (event.target !== popup) {
            return;
          }
          const container = getContainer();
          popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
          container.style.overflowY = "auto";
        };
        const setScrollingVisibility = (container, popup) => {
          if (animationEndEvent && hasCssAnimation(popup)) {
            container.style.overflowY = "hidden";
            popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
          } else {
            container.style.overflowY = "auto";
          }
        };
        const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
          iOSfix();
          if (scrollbarPadding && initialBodyOverflow !== "hidden") {
            fixScrollbar();
          }
          setTimeout(() => {
            container.scrollTop = 0;
          });
        };
        const addClasses$1 = (container, popup, params) => {
          addClass(container, params.showClass.backdrop);
          popup.style.setProperty("opacity", "0", "important");
          show(popup, "grid");
          setTimeout(() => {
            addClass(popup, params.showClass.popup);
            popup.style.removeProperty("opacity");
          }, SHOW_CLASS_TIMEOUT);
          addClass([document.documentElement, document.body], swalClasses.shown);
          if (params.heightAuto && params.backdrop && !params.toast) {
            addClass([document.documentElement, document.body], swalClasses["height-auto"]);
          }
        };
        const showLoading = (buttonToReplace) => {
          let popup = getPopup();
          if (!popup) {
            new Swal2();
          }
          popup = getPopup();
          const loader = getLoader();
          if (isToast()) {
            hide(getIcon());
          } else {
            replaceButton(popup, buttonToReplace);
          }
          show(loader);
          popup.setAttribute("data-loading", "true");
          popup.setAttribute("aria-busy", "true");
          popup.focus();
        };
        const replaceButton = (popup, buttonToReplace) => {
          const actions = getActions();
          const loader = getLoader();
          if (!buttonToReplace && isVisible(getConfirmButton())) {
            buttonToReplace = getConfirmButton();
          }
          show(actions);
          if (buttonToReplace) {
            hide(buttonToReplace);
            loader.setAttribute("data-button-to-replace", buttonToReplace.className);
          }
          loader.parentNode.insertBefore(loader, buttonToReplace);
          addClass([popup, actions], swalClasses.loading);
        };
        const handleInputOptionsAndValue = (instance, params) => {
          if (params.input === "select" || params.input === "radio") {
            handleInputOptions(instance, params);
          } else if (["text", "email", "number", "tel", "textarea"].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
            showLoading(getConfirmButton());
            handleInputValue(instance, params);
          }
        };
        const getInputValue = (instance, innerParams) => {
          const input = instance.getInput();
          if (!input) {
            return null;
          }
          switch (innerParams.input) {
            case "checkbox":
              return getCheckboxValue(input);
            case "radio":
              return getRadioValue(input);
            case "file":
              return getFileValue(input);
            default:
              return innerParams.inputAutoTrim ? input.value.trim() : input.value;
          }
        };
        const getCheckboxValue = (input) => input.checked ? 1 : 0;
        const getRadioValue = (input) => input.checked ? input.value : null;
        const getFileValue = (input) => input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
        const handleInputOptions = (instance, params) => {
          const popup = getPopup();
          const processInputOptions = (inputOptions) => populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);
          if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
            showLoading(getConfirmButton());
            asPromise(params.inputOptions).then((inputOptions) => {
              instance.hideLoading();
              processInputOptions(inputOptions);
            });
          } else if (typeof params.inputOptions === "object") {
            processInputOptions(params.inputOptions);
          } else {
            error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
          }
        };
        const handleInputValue = (instance, params) => {
          const input = instance.getInput();
          hide(input);
          asPromise(params.inputValue).then((inputValue) => {
            input.value = params.input === "number" ? parseFloat(inputValue) || 0 : "".concat(inputValue);
            show(input);
            input.focus();
            instance.hideLoading();
          }).catch((err) => {
            error("Error in inputValue promise: ".concat(err));
            input.value = "";
            show(input);
            input.focus();
            instance.hideLoading();
          });
        };
        const populateInputOptions = {
          select: (popup, inputOptions, params) => {
            const select = getDirectChildByClass(popup, swalClasses.select);
            const renderOption = (parent, optionLabel, optionValue) => {
              const option = document.createElement("option");
              option.value = optionValue;
              setInnerHtml(option, optionLabel);
              option.selected = isSelected(optionValue, params.inputValue);
              parent.appendChild(option);
            };
            inputOptions.forEach((inputOption) => {
              const optionValue = inputOption[0];
              const optionLabel = inputOption[1];
              if (Array.isArray(optionLabel)) {
                const optgroup = document.createElement("optgroup");
                optgroup.label = optionValue;
                optgroup.disabled = false;
                select.appendChild(optgroup);
                optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
              } else {
                renderOption(select, optionLabel, optionValue);
              }
            });
            select.focus();
          },
          radio: (popup, inputOptions, params) => {
            const radio = getDirectChildByClass(popup, swalClasses.radio);
            inputOptions.forEach((inputOption) => {
              const radioValue = inputOption[0];
              const radioLabel = inputOption[1];
              const radioInput = document.createElement("input");
              const radioLabelElement = document.createElement("label");
              radioInput.type = "radio";
              radioInput.name = swalClasses.radio;
              radioInput.value = radioValue;
              if (isSelected(radioValue, params.inputValue)) {
                radioInput.checked = true;
              }
              const label = document.createElement("span");
              setInnerHtml(label, radioLabel);
              label.className = swalClasses.label;
              radioLabelElement.appendChild(radioInput);
              radioLabelElement.appendChild(label);
              radio.appendChild(radioLabelElement);
            });
            const radios = radio.querySelectorAll("input");
            if (radios.length) {
              radios[0].focus();
            }
          }
        };
        const formatInputOptions = (inputOptions) => {
          const result = [];
          if (typeof Map !== "undefined" && inputOptions instanceof Map) {
            inputOptions.forEach((value, key) => {
              let valueFormatted = value;
              if (typeof valueFormatted === "object") {
                valueFormatted = formatInputOptions(valueFormatted);
              }
              result.push([key, valueFormatted]);
            });
          } else {
            Object.keys(inputOptions).forEach((key) => {
              let valueFormatted = inputOptions[key];
              if (typeof valueFormatted === "object") {
                valueFormatted = formatInputOptions(valueFormatted);
              }
              result.push([key, valueFormatted]);
            });
          }
          return result;
        };
        const isSelected = (optionValue, inputValue) => {
          return inputValue && inputValue.toString() === optionValue.toString();
        };
        function hideLoading() {
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            return;
          }
          const domCache = privateProps.domCache.get(this);
          hide(domCache.loader);
          if (isToast()) {
            if (innerParams.icon) {
              show(getIcon());
            }
          } else {
            showRelatedButton(domCache);
          }
          removeClass([domCache.popup, domCache.actions], swalClasses.loading);
          domCache.popup.removeAttribute("aria-busy");
          domCache.popup.removeAttribute("data-loading");
          domCache.confirmButton.disabled = false;
          domCache.denyButton.disabled = false;
          domCache.cancelButton.disabled = false;
        }
        const showRelatedButton = (domCache) => {
          const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
          if (buttonToReplace.length) {
            show(buttonToReplace[0], "inline-block");
          } else if (allButtonsAreHidden()) {
            hide(domCache.actions);
          }
        };
        function getInput$1(instance) {
          const innerParams = privateProps.innerParams.get(instance || this);
          const domCache = privateProps.domCache.get(instance || this);
          if (!domCache) {
            return null;
          }
          return getInput(domCache.popup, innerParams.input);
        }
        var privateMethods = {
          swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
          swalPromiseReject: /* @__PURE__ */ new WeakMap()
        };
        const isVisible$1 = () => {
          return isVisible(getPopup());
        };
        const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
        const clickDeny = () => getDenyButton() && getDenyButton().click();
        const clickCancel = () => getCancelButton() && getCancelButton().click();
        const removeKeydownHandler = (globalState2) => {
          if (globalState2.keydownTarget && globalState2.keydownHandlerAdded) {
            globalState2.keydownTarget.removeEventListener("keydown", globalState2.keydownHandler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = false;
          }
        };
        const addKeydownHandler = (instance, globalState2, innerParams, dismissWith) => {
          removeKeydownHandler(globalState2);
          if (!innerParams.toast) {
            globalState2.keydownHandler = (e) => keydownHandler(instance, e, dismissWith);
            globalState2.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
            globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
            globalState2.keydownTarget.addEventListener("keydown", globalState2.keydownHandler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = true;
          }
        };
        const setFocus = (innerParams, index, increment) => {
          const focusableElements = getFocusableElements();
          if (focusableElements.length) {
            index = index + increment;
            if (index === focusableElements.length) {
              index = 0;
            } else if (index === -1) {
              index = focusableElements.length - 1;
            }
            return focusableElements[index].focus();
          }
          getPopup().focus();
        };
        const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
        const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
        const keydownHandler = (instance, e, dismissWith) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams) {
            return;
          }
          if (e.isComposing || e.keyCode === 229) {
            return;
          }
          if (innerParams.stopKeydownPropagation) {
            e.stopPropagation();
          }
          if (e.key === "Enter") {
            handleEnter(instance, e, innerParams);
          } else if (e.key === "Tab") {
            handleTab(e, innerParams);
          } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(e.key)) {
            handleArrows(e.key);
          } else if (e.key === "Escape") {
            handleEsc(e, innerParams, dismissWith);
          }
        };
        const handleEnter = (instance, e, innerParams) => {
          if (!callIfFunction(innerParams.allowEnterKey)) {
            return;
          }
          if (e.target && instance.getInput() && e.target instanceof HTMLElement && e.target.outerHTML === instance.getInput().outerHTML) {
            if (["textarea", "file"].includes(innerParams.input)) {
              return;
            }
            clickConfirm();
            e.preventDefault();
          }
        };
        const handleTab = (e, innerParams) => {
          const targetElement = e.target;
          const focusableElements = getFocusableElements();
          let btnIndex = -1;
          for (let i = 0; i < focusableElements.length; i++) {
            if (targetElement === focusableElements[i]) {
              btnIndex = i;
              break;
            }
          }
          if (!e.shiftKey) {
            setFocus(innerParams, btnIndex, 1);
          } else {
            setFocus(innerParams, btnIndex, -1);
          }
          e.stopPropagation();
          e.preventDefault();
        };
        const handleArrows = (key) => {
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          if (document.activeElement instanceof HTMLElement && ![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
            return;
          }
          const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
          let buttonToFocus = document.activeElement;
          for (let i = 0; i < getActions().children.length; i++) {
            buttonToFocus = buttonToFocus[sibling];
            if (!buttonToFocus) {
              return;
            }
            if (buttonToFocus instanceof HTMLButtonElement && isVisible(buttonToFocus)) {
              break;
            }
          }
          if (buttonToFocus instanceof HTMLButtonElement) {
            buttonToFocus.focus();
          }
        };
        const handleEsc = (e, innerParams, dismissWith) => {
          if (callIfFunction(innerParams.allowEscapeKey)) {
            e.preventDefault();
            dismissWith(DismissReason.esc);
          }
        };
        function removePopupAndResetState(instance, container, returnFocus, didClose) {
          if (isToast()) {
            triggerDidCloseAndDispose(instance, didClose);
          } else {
            restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
            removeKeydownHandler(globalState);
          }
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          if (isSafari) {
            container.setAttribute("style", "display:none !important");
            container.removeAttribute("class");
            container.innerHTML = "";
          } else {
            container.remove();
          }
          if (isModal()) {
            undoScrollbar();
            undoIOSfix();
            unsetAriaHidden();
          }
          removeBodyClasses();
        }
        function removeBodyClasses() {
          removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
        }
        function close(resolveValue) {
          resolveValue = prepareResolveValue(resolveValue);
          const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
          const didClose = triggerClosePopup(this);
          if (this.isAwaitingPromise()) {
            if (!resolveValue.isDismissed) {
              handleAwaitingPromise(this);
              swalPromiseResolve(resolveValue);
            }
          } else if (didClose) {
            swalPromiseResolve(resolveValue);
          }
        }
        function isAwaitingPromise() {
          return !!privateProps.awaitingPromise.get(this);
        }
        const triggerClosePopup = (instance) => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
            return false;
          }
          removeClass(popup, innerParams.showClass.popup);
          addClass(popup, innerParams.hideClass.popup);
          const backdrop = getContainer();
          removeClass(backdrop, innerParams.showClass.backdrop);
          addClass(backdrop, innerParams.hideClass.backdrop);
          handlePopupAnimation(instance, popup, innerParams);
          return true;
        };
        function rejectPromise(error2) {
          const rejectPromise2 = privateMethods.swalPromiseReject.get(this);
          handleAwaitingPromise(this);
          if (rejectPromise2) {
            rejectPromise2(error2);
          }
        }
        const handleAwaitingPromise = (instance) => {
          if (instance.isAwaitingPromise()) {
            privateProps.awaitingPromise.delete(instance);
            if (!privateProps.innerParams.get(instance)) {
              instance._destroy();
            }
          }
        };
        const prepareResolveValue = (resolveValue) => {
          if (typeof resolveValue === "undefined") {
            return {
              isConfirmed: false,
              isDenied: false,
              isDismissed: true
            };
          }
          return Object.assign({
            isConfirmed: false,
            isDenied: false,
            isDismissed: false
          }, resolveValue);
        };
        const handlePopupAnimation = (instance, popup, innerParams) => {
          const container = getContainer();
          const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
          if (typeof innerParams.willClose === "function") {
            innerParams.willClose(popup);
          }
          if (animationIsSupported) {
            animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
          } else {
            removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
          }
        };
        const animatePopup = (instance, popup, container, returnFocus, didClose) => {
          globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
          popup.addEventListener(animationEndEvent, function(e) {
            if (e.target === popup) {
              globalState.swalCloseEventFinishedCallback();
              delete globalState.swalCloseEventFinishedCallback;
            }
          });
        };
        const triggerDidCloseAndDispose = (instance, didClose) => {
          setTimeout(() => {
            if (typeof didClose === "function") {
              didClose.bind(instance.params)();
            }
            instance._destroy();
          });
        };
        function setButtonsDisabled(instance, buttons, disabled) {
          const domCache = privateProps.domCache.get(instance);
          buttons.forEach((button) => {
            domCache[button].disabled = disabled;
          });
        }
        function setInputDisabled(input, disabled) {
          if (!input) {
            return false;
          }
          if (input.type === "radio") {
            const radiosContainer = input.parentNode.parentNode;
            const radios = radiosContainer.querySelectorAll("input");
            for (let i = 0; i < radios.length; i++) {
              radios[i].disabled = disabled;
            }
          } else {
            input.disabled = disabled;
          }
        }
        function enableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
        }
        function disableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
        }
        function enableInput() {
          return setInputDisabled(this.getInput(), false);
        }
        function disableInput() {
          return setInputDisabled(this.getInput(), true);
        }
        function showValidationMessage(error2) {
          const domCache = privateProps.domCache.get(this);
          const params = privateProps.innerParams.get(this);
          setInnerHtml(domCache.validationMessage, error2);
          domCache.validationMessage.className = swalClasses["validation-message"];
          if (params.customClass && params.customClass.validationMessage) {
            addClass(domCache.validationMessage, params.customClass.validationMessage);
          }
          show(domCache.validationMessage);
          const input = this.getInput();
          if (input) {
            input.setAttribute("aria-invalid", true);
            input.setAttribute("aria-describedby", swalClasses["validation-message"]);
            focusInput(input);
            addClass(input, swalClasses.inputerror);
          }
        }
        function resetValidationMessage$1() {
          const domCache = privateProps.domCache.get(this);
          if (domCache.validationMessage) {
            hide(domCache.validationMessage);
          }
          const input = this.getInput();
          if (input) {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
            removeClass(input, swalClasses.inputerror);
          }
        }
        function getProgressSteps$1() {
          const domCache = privateProps.domCache.get(this);
          return domCache.progressSteps;
        }
        function update(params) {
          const popup = getPopup();
          const innerParams = privateProps.innerParams.get(this);
          if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
            return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
          }
          const validUpdatableParams = filterValidParams(params);
          const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
          render(this, updatedParams);
          privateProps.innerParams.set(this, updatedParams);
          Object.defineProperties(this, {
            params: {
              value: Object.assign({}, this.params, params),
              writable: false,
              enumerable: true
            }
          });
        }
        const filterValidParams = (params) => {
          const validUpdatableParams = {};
          Object.keys(params).forEach((param) => {
            if (isUpdatableParameter(param)) {
              validUpdatableParams[param] = params[param];
            } else {
              warn("Invalid parameter to update: ".concat(param));
            }
          });
          return validUpdatableParams;
        };
        function _destroy() {
          const domCache = privateProps.domCache.get(this);
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            disposeWeakMaps(this);
            return;
          }
          if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
          if (typeof innerParams.didDestroy === "function") {
            innerParams.didDestroy();
          }
          disposeSwal(this);
        }
        const disposeSwal = (instance) => {
          disposeWeakMaps(instance);
          delete instance.params;
          delete globalState.keydownHandler;
          delete globalState.keydownTarget;
          delete globalState.currentInstance;
        };
        const disposeWeakMaps = (instance) => {
          if (instance.isAwaitingPromise()) {
            unsetWeakMaps(privateProps, instance);
            privateProps.awaitingPromise.set(instance, true);
          } else {
            unsetWeakMaps(privateMethods, instance);
            unsetWeakMaps(privateProps, instance);
          }
        };
        const unsetWeakMaps = (obj, instance) => {
          for (const i in obj) {
            obj[i].delete(instance);
          }
        };
        var instanceMethods = /* @__PURE__ */ Object.freeze({
          hideLoading,
          disableLoading: hideLoading,
          getInput: getInput$1,
          close,
          isAwaitingPromise,
          rejectPromise,
          handleAwaitingPromise,
          closePopup: close,
          closeModal: close,
          closeToast: close,
          enableButtons,
          disableButtons,
          enableInput,
          disableInput,
          showValidationMessage,
          resetValidationMessage: resetValidationMessage$1,
          getProgressSteps: getProgressSteps$1,
          update,
          _destroy
        });
        const handleConfirmButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.input) {
            handleConfirmOrDenyWithInput(instance, "confirm");
          } else {
            confirm2(instance, true);
          }
        };
        const handleDenyButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.returnInputValueOnDeny) {
            handleConfirmOrDenyWithInput(instance, "deny");
          } else {
            deny(instance, false);
          }
        };
        const handleCancelButtonClick = (instance, dismissWith) => {
          instance.disableButtons();
          dismissWith(DismissReason.cancel);
        };
        const handleConfirmOrDenyWithInput = (instance, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams.input) {
            error('The "input" parameter is needed to be set when using returnInputValueOn'.concat(capitalizeFirstLetter(type)));
            return;
          }
          const inputValue = getInputValue(instance, innerParams);
          if (innerParams.inputValidator) {
            handleInputValidator(instance, inputValue, type);
          } else if (!instance.getInput().checkValidity()) {
            instance.enableButtons();
            instance.showValidationMessage(innerParams.validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm2(instance, inputValue);
          }
        };
        const handleInputValidator = (instance, inputValue, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableInput();
          const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
          validationPromise.then((validationMessage) => {
            instance.enableButtons();
            instance.enableInput();
            if (validationMessage) {
              instance.showValidationMessage(validationMessage);
            } else if (type === "deny") {
              deny(instance, inputValue);
            } else {
              confirm2(instance, inputValue);
            }
          });
        };
        const deny = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance || void 0);
          if (innerParams.showLoaderOnDeny) {
            showLoading(getDenyButton());
          }
          if (innerParams.preDeny) {
            privateProps.awaitingPromise.set(instance || void 0, true);
            const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
            preDenyPromise.then((preDenyValue) => {
              if (preDenyValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                instance.close({
                  isDenied: true,
                  value: typeof preDenyValue === "undefined" ? value : preDenyValue
                });
              }
            }).catch((error$$1) => rejectWith(instance || void 0, error$$1));
          } else {
            instance.close({
              isDenied: true,
              value
            });
          }
        };
        const succeedWith = (instance, value) => {
          instance.close({
            isConfirmed: true,
            value
          });
        };
        const rejectWith = (instance, error$$1) => {
          instance.rejectPromise(error$$1);
        };
        const confirm2 = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance || void 0);
          if (innerParams.showLoaderOnConfirm) {
            showLoading();
          }
          if (innerParams.preConfirm) {
            instance.resetValidationMessage();
            privateProps.awaitingPromise.set(instance || void 0, true);
            const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
            preConfirmPromise.then((preConfirmValue) => {
              if (isVisible(getValidationMessage()) || preConfirmValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
              }
            }).catch((error$$1) => rejectWith(instance || void 0, error$$1));
          } else {
            succeedWith(instance, value);
          }
        };
        const handlePopupClick = (instance, domCache, dismissWith) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams.toast) {
            handleToastClick(instance, domCache, dismissWith);
          } else {
            handleModalMousedown(domCache);
            handleContainerMousedown(domCache);
            handleModalClick(instance, domCache, dismissWith);
          }
        };
        const handleToastClick = (instance, domCache, dismissWith) => {
          domCache.popup.onclick = () => {
            const innerParams = privateProps.innerParams.get(instance);
            if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
              return;
            }
            dismissWith(DismissReason.close);
          };
        };
        const isAnyButtonShown = (innerParams) => {
          return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
        };
        let ignoreOutsideClick = false;
        const handleModalMousedown = (domCache) => {
          domCache.popup.onmousedown = () => {
            domCache.container.onmouseup = function(e) {
              domCache.container.onmouseup = void 0;
              if (e.target === domCache.container) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleContainerMousedown = (domCache) => {
          domCache.container.onmousedown = () => {
            domCache.popup.onmouseup = function(e) {
              domCache.popup.onmouseup = void 0;
              if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleModalClick = (instance, domCache, dismissWith) => {
          domCache.container.onclick = (e) => {
            const innerParams = privateProps.innerParams.get(instance);
            if (ignoreOutsideClick) {
              ignoreOutsideClick = false;
              return;
            }
            if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
              dismissWith(DismissReason.backdrop);
            }
          };
        };
        const isJqueryElement = (elem) => typeof elem === "object" && elem.jquery;
        const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
        const argsToParams = (args) => {
          const params = {};
          if (typeof args[0] === "object" && !isElement(args[0])) {
            Object.assign(params, args[0]);
          } else {
            ["title", "html", "icon"].forEach((name, index) => {
              const arg = args[index];
              if (typeof arg === "string" || isElement(arg)) {
                params[name] = arg;
              } else if (arg !== void 0) {
                error("Unexpected type of ".concat(name, '! Expected "string" or "Element", got ').concat(typeof arg));
              }
            });
          }
          return params;
        };
        function fire() {
          const Swal3 = this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return new Swal3(...args);
        }
        function mixin(mixinParams) {
          class MixinSwal extends this {
            _main(params, priorityMixinParams) {
              return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
            }
          }
          return MixinSwal;
        }
        const getTimerLeft = () => {
          return globalState.timeout && globalState.timeout.getTimerLeft();
        };
        const stopTimer = () => {
          if (globalState.timeout) {
            stopTimerProgressBar();
            return globalState.timeout.stop();
          }
        };
        const resumeTimer = () => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.start();
            animateTimerProgressBar(remaining);
            return remaining;
          }
        };
        const toggleTimer = () => {
          const timer = globalState.timeout;
          return timer && (timer.running ? stopTimer() : resumeTimer());
        };
        const increaseTimer = (n) => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.increase(n);
            animateTimerProgressBar(remaining, true);
            return remaining;
          }
        };
        const isTimerRunning = () => {
          return globalState.timeout && globalState.timeout.isRunning();
        };
        let bodyClickListenerAdded = false;
        const clickHandlers = {};
        function bindClickHandler() {
          let attr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "data-swal-template";
          clickHandlers[attr] = this;
          if (!bodyClickListenerAdded) {
            document.body.addEventListener("click", bodyClickListener);
            bodyClickListenerAdded = true;
          }
        }
        const bodyClickListener = (event) => {
          for (let el = event.target; el && el !== document; el = el.parentNode) {
            for (const attr in clickHandlers) {
              const template = el.getAttribute(attr);
              if (template) {
                clickHandlers[attr].fire({
                  template
                });
                return;
              }
            }
          }
        };
        var staticMethods = /* @__PURE__ */ Object.freeze({
          isValidParameter,
          isUpdatableParameter,
          isDeprecatedParameter,
          argsToParams,
          isVisible: isVisible$1,
          clickConfirm,
          clickDeny,
          clickCancel,
          getContainer,
          getPopup,
          getTitle,
          getHtmlContainer,
          getImage,
          getIcon,
          getInputLabel,
          getCloseButton,
          getActions,
          getConfirmButton,
          getDenyButton,
          getCancelButton,
          getLoader,
          getFooter,
          getTimerProgressBar,
          getFocusableElements,
          getValidationMessage,
          isLoading,
          fire,
          mixin,
          showLoading,
          enableLoading: showLoading,
          getTimerLeft,
          stopTimer,
          resumeTimer,
          toggleTimer,
          increaseTimer,
          isTimerRunning,
          bindClickHandler
        });
        let currentInstance;
        class SweetAlert {
          constructor() {
            if (typeof window === "undefined") {
              return;
            }
            currentInstance = this;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            const outerParams = Object.freeze(this.constructor.argsToParams(args));
            Object.defineProperties(this, {
              params: {
                value: outerParams,
                writable: false,
                enumerable: true,
                configurable: true
              }
            });
            const promise = currentInstance._main(currentInstance.params);
            privateProps.promise.set(this, promise);
          }
          _main(userParams) {
            let mixinParams = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            showWarningsForParams(Object.assign({}, mixinParams, userParams));
            if (globalState.currentInstance) {
              globalState.currentInstance._destroy();
              if (isModal()) {
                unsetAriaHidden();
              }
            }
            globalState.currentInstance = currentInstance;
            const innerParams = prepareParams(userParams, mixinParams);
            setParameters(innerParams);
            Object.freeze(innerParams);
            if (globalState.timeout) {
              globalState.timeout.stop();
              delete globalState.timeout;
            }
            clearTimeout(globalState.restoreFocusTimeout);
            const domCache = populateDomCache(currentInstance);
            render(currentInstance, innerParams);
            privateProps.innerParams.set(currentInstance, innerParams);
            return swalPromise(currentInstance, domCache, innerParams);
          }
          then(onFulfilled) {
            const promise = privateProps.promise.get(this);
            return promise.then(onFulfilled);
          }
          finally(onFinally) {
            const promise = privateProps.promise.get(this);
            return promise.finally(onFinally);
          }
        }
        const swalPromise = (instance, domCache, innerParams) => {
          return new Promise((resolve, reject) => {
            const dismissWith = (dismiss) => {
              instance.closePopup({
                isDismissed: true,
                dismiss
              });
            };
            privateMethods.swalPromiseResolve.set(instance, resolve);
            privateMethods.swalPromiseReject.set(instance, reject);
            domCache.confirmButton.onclick = () => handleConfirmButtonClick(instance);
            domCache.denyButton.onclick = () => handleDenyButtonClick(instance);
            domCache.cancelButton.onclick = () => handleCancelButtonClick(instance, dismissWith);
            domCache.closeButton.onclick = () => dismissWith(DismissReason.close);
            handlePopupClick(instance, domCache, dismissWith);
            addKeydownHandler(instance, globalState, innerParams, dismissWith);
            handleInputOptionsAndValue(instance, innerParams);
            openPopup(innerParams);
            setupTimer(globalState, innerParams, dismissWith);
            initFocus(domCache, innerParams);
            setTimeout(() => {
              domCache.container.scrollTop = 0;
            });
          });
        };
        const prepareParams = (userParams, mixinParams) => {
          const templateParams = getTemplateParams(userParams);
          const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
          params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
          params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
          return params;
        };
        const populateDomCache = (instance) => {
          const domCache = {
            popup: getPopup(),
            container: getContainer(),
            actions: getActions(),
            confirmButton: getConfirmButton(),
            denyButton: getDenyButton(),
            cancelButton: getCancelButton(),
            loader: getLoader(),
            closeButton: getCloseButton(),
            validationMessage: getValidationMessage(),
            progressSteps: getProgressSteps()
          };
          privateProps.domCache.set(instance, domCache);
          return domCache;
        };
        const setupTimer = (globalState$$1, innerParams, dismissWith) => {
          const timerProgressBar = getTimerProgressBar();
          hide(timerProgressBar);
          if (innerParams.timer) {
            globalState$$1.timeout = new Timer(() => {
              dismissWith("timer");
              delete globalState$$1.timeout;
            }, innerParams.timer);
            if (innerParams.timerProgressBar) {
              show(timerProgressBar);
              applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
              setTimeout(() => {
                if (globalState$$1.timeout && globalState$$1.timeout.running) {
                  animateTimerProgressBar(innerParams.timer);
                }
              });
            }
          }
        };
        const initFocus = (domCache, innerParams) => {
          if (innerParams.toast) {
            return;
          }
          if (!callIfFunction(innerParams.allowEnterKey)) {
            return blurActiveElement();
          }
          if (!focusButton(domCache, innerParams)) {
            setFocus(innerParams, -1, 1);
          }
        };
        const focusButton = (domCache, innerParams) => {
          if (innerParams.focusDeny && isVisible(domCache.denyButton)) {
            domCache.denyButton.focus();
            return true;
          }
          if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
            domCache.cancelButton.focus();
            return true;
          }
          if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
            domCache.confirmButton.focus();
            return true;
          }
          return false;
        };
        const blurActiveElement = () => {
          if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === "function") {
            document.activeElement.blur();
          }
        };
        if (typeof window !== "undefined" && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
          if (Math.random() < 0.1) {
            const noWar = document.createElement("div");
            noWar.className = "leave-russia-now-and-apply-your-skills-to-the-world";
            const video = getRandomElement([{
              text: "\u0412 \u043D\u0438\u0436\u0435\u043F\u0440\u0438\u0432\u0435\u0434\u0451\u043D\u043D\u043E\u043C \u0432\u0438\u0434\u0435\u043E \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u043A\u0430\u0436\u0434\u044B\u0439 \u0438\u0437 \u043D\u0430\u0441 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u043C\u043E\u0447\u044C \u0432 \u0442\u043E\u043C,\n        <strong>\u0447\u0442\u043E\u0431\u044B \u044D\u0442\u0430 \u0431\u0435\u0441\u0441\u043C\u044B\u0441\u043B\u0435\u043D\u043D\u0430\u044F \u0438 \u0431\u0435\u0441\u0447\u0435\u043B\u043E\u0432\u0435\u0447\u043D\u0430\u044F \u0432\u043E\u0439\u043D\u0430 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B\u0430\u0441\u044C</strong>:",
              id: "4CfDhaRkw7I"
            }, {
              text: "\u042D\u043C\u043F\u0430\u0442\u0438\u044F - \u0433\u043B\u0430\u0432\u043D\u043E\u0435 <strong>\u0447\u0435\u043B\u043E\u0432\u0435\u0447\u0435\u0441\u043A\u043E\u0435</strong> \u0447\u0443\u0432\u0441\u0442\u0432\u043E. \u0421\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u044C \u0441\u043E\u043F\u0435\u0440\u0435\u0436\u0438\u0432\u0430\u0442\u044C. <strong>\u0421\u043F\u043E\u0441\u043E\u0431\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0435\u0431\u044F \u043D\u0430 \u043C\u0435\u0441\u0442\u043E \u0434\u0440\u0443\u0433\u043E\u0433\u043E.</strong>",
              id: "s-GLAIY4DXA"
            }]);
            setInnerHtml(noWar, "\n      <div>\n        \u0415\u0441\u043B\u0438 \u043C\u044B \u043D\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043C \u0432\u043E\u0439\u043D\u0443, \u043E\u043D\u0430 \u043F\u0440\u0438\u0434\u0435\u0442 \u0432 \u0434\u043E\u043C <strong>\u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0438\u0437 \u043D\u0430\u0441</strong> \u0438 \u0435\u0451 \u043F\u043E\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0438\u044F \u0431\u0443\u0434\u0443\u0442 <strong>\u0443\u0436\u0430\u0441\u0430\u044E\u0449\u0438\u043C\u0438</strong>.\n      </div>\n      <div>\n        \u041F\u0443\u0442\u0438\u043D\u0441\u043A\u0438\u0439 \u0440\u0435\u0436\u0438\u043C \u0437\u0430 20 \u0441 \u043B\u0438\u0448\u043D\u0438\u043C \u043B\u0435\u0442 \u0441\u0432\u043E\u0435\u0433\u043E \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u044F \u0432\u0434\u043E\u043B\u0431\u0438\u043B \u043D\u0430\u043C, \u0447\u0442\u043E \u043C\u044B \u0431\u0435\u0441\u0441\u0438\u043B\u044C\u043D\u044B \u0438 \u043E\u0434\u0438\u043D \u0447\u0435\u043B\u043E\u0432\u0435\u043A \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043D\u0438\u0447\u0435\u0433\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C. <strong>\u042D\u0442\u043E \u043D\u0435 \u0442\u0430\u043A!</strong>\n      </div>\n      <div>\n        ".concat(video.text, '\n      </div>\n      <iframe width="560" height="315" src="https://www.youtube.com/embed/').concat(video.id, '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n      <div>\n        \u041D\u0435\u0442 \u0432\u043E\u0439\u043D\u0435!\n      </div>\n      '));
            const closeButton = document.createElement("button");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => noWar.remove();
            noWar.appendChild(closeButton);
            window.addEventListener("load", () => {
              setTimeout(() => {
                document.body.appendChild(noWar);
              }, 1e3);
            });
          }
        }
        Object.assign(SweetAlert.prototype, instanceMethods);
        Object.assign(SweetAlert, staticMethods);
        Object.keys(instanceMethods).forEach((key) => {
          SweetAlert[key] = function() {
            if (currentInstance) {
              return currentInstance[key](...arguments);
            }
          };
        });
        SweetAlert.DismissReason = DismissReason;
        SweetAlert.version = "11.4.26";
        const Swal2 = SweetAlert;
        Swal2.default = Swal2;
        return Swal2;
      });
      if (typeof exports !== "undefined" && exports.Sweetalert2) {
        exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
      }
      "undefined" != typeof document && function(e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet)
          n.styleSheet.disabled || (n.styleSheet.cssText = t);
        else
          try {
            n.innerHTML = t;
          } catch (e2) {
            n.innerText = t;
          }
      }(document, '.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px hsla(0deg,0%,0%,.075),0 1px 2px hsla(0deg,0%,0%,.075),1px 2px 4px hsla(0deg,0%,0%,.075),1px 3px 8px hsla(0deg,0%,0%,.075),2px 4px 16px hsla(0deg,0%,0%,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 3px}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:0 0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:0 0;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:0 0;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .5s;animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .8s;animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-question-mark .8s;animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:0 0;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.leave-russia-now-and-apply-your-skills-to-the-world{display:flex;position:fixed;z-index:1939;top:0;right:0;bottom:0;left:0;flex-direction:column;align-items:center;justify-content:center;padding:25px 0 20px;background:#20232a;color:#fff;text-align:center}.leave-russia-now-and-apply-your-skills-to-the-world div{max-width:560px;margin:10px;line-height:146%}.leave-russia-now-and-apply-your-skills-to-the-world iframe{max-width:100%;max-height:55.5555555556vmin;margin:16px auto}.leave-russia-now-and-apply-your-skills-to-the-world strong{border-bottom:2px dashed #fff}.leave-russia-now-and-apply-your-skills-to-the-world button{display:flex;position:fixed;z-index:1940;top:0;right:0;align-items:center;justify-content:center;width:48px;height:48px;margin-right:10px;margin-bottom:-10px;border:none;background:0 0;color:#aaa;font-size:48px;font-weight:700;cursor:pointer}.leave-russia-now-and-apply-your-skills-to-the-world button:hover{color:#fff}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@-webkit-keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}');
    }
  });

  // resources/ts/u/u.ts
  function pd(...mes) {
    console.log(mes);
  }
  function normal(mes) {
    Swal.fire({
      text: mes,
      toast: true,
      position: "top-end",
      timer: 3 * 1e3,
      showConfirmButton: false
    });
  }
  function confirm(mes, ok, cancel) {
    return __async(this, null, function* () {
      const res = yield Swal.fire({
        text: mes,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: ok,
        showCancelButton: true,
        cancelButtonText: cancel
      });
      const ret = res.value;
      return ret;
    });
  }
  var Swal, toast;
  var init_u = __esm({
    "resources/ts/u/u.ts"() {
      Swal = require_sweetalert2_all();
      toast = {
        normal,
        confirm
      };
    }
  });

  // node_modules/date-fns/esm/_lib/toInteger/index.js
  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
      return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }
  var init_toInteger = __esm({
    "node_modules/date-fns/esm/_lib/toInteger/index.js"() {
    }
  });

  // node_modules/date-fns/esm/_lib/requiredArgs/index.js
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
    }
  }
  var init_requiredArgs = __esm({
    "node_modules/date-fns/esm/_lib/requiredArgs/index.js"() {
    }
  });

  // node_modules/date-fns/esm/toDate/index.js
  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === "[object Number]") {
      return new Date(argument);
    } else {
      if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }
  var init_toDate = __esm({
    "node_modules/date-fns/esm/toDate/index.js"() {
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/addMilliseconds/index.js
  function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
  }
  var init_addMilliseconds = __esm({
    "node_modules/date-fns/esm/addMilliseconds/index.js"() {
      init_toInteger();
      init_toDate();
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/_lib/defaultOptions/index.js
  function getDefaultOptions() {
    return defaultOptions;
  }
  var defaultOptions;
  var init_defaultOptions = __esm({
    "node_modules/date-fns/esm/_lib/defaultOptions/index.js"() {
      defaultOptions = {};
    }
  });

  // node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js
  function getTimezoneOffsetInMilliseconds(date) {
    var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    utcDate.setUTCFullYear(date.getFullYear());
    return date.getTime() - utcDate.getTime();
  }
  var init_getTimezoneOffsetInMilliseconds = __esm({
    "node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js"() {
    }
  });

  // node_modules/date-fns/esm/constants/index.js
  var daysInYear, maxTime, minTime, secondsInHour, secondsInDay, secondsInWeek, secondsInYear, secondsInMonth, secondsInQuarter;
  var init_constants = __esm({
    "node_modules/date-fns/esm/constants/index.js"() {
      daysInYear = 365.2425;
      maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
      minTime = -maxTime;
      secondsInHour = 3600;
      secondsInDay = secondsInHour * 24;
      secondsInWeek = secondsInDay * 7;
      secondsInYear = secondsInDay * daysInYear;
      secondsInMonth = secondsInYear / 12;
      secondsInQuarter = secondsInMonth * 3;
    }
  });

  // node_modules/date-fns/esm/isDate/index.js
  function isDate(value) {
    requiredArgs(1, arguments);
    return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
  }
  var init_isDate = __esm({
    "node_modules/date-fns/esm/isDate/index.js"() {
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/isValid/index.js
  function isValid(dirtyDate) {
    requiredArgs(1, arguments);
    if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
      return false;
    }
    var date = toDate(dirtyDate);
    return !isNaN(Number(date));
  }
  var init_isValid = __esm({
    "node_modules/date-fns/esm/isValid/index.js"() {
      init_isDate();
      init_toDate();
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/subMilliseconds/index.js
  function subMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, -amount);
  }
  var init_subMilliseconds = __esm({
    "node_modules/date-fns/esm/subMilliseconds/index.js"() {
      init_addMilliseconds();
      init_requiredArgs();
      init_toInteger();
    }
  });

  // node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js
  function getUTCDayOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
  }
  var MILLISECONDS_IN_DAY;
  var init_getUTCDayOfYear = __esm({
    "node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js"() {
      init_toDate();
      init_requiredArgs();
      MILLISECONDS_IN_DAY = 864e5;
    }
  });

  // node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js
  function startOfUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }
  var init_startOfUTCISOWeek = __esm({
    "node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js"() {
      init_toDate();
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js
  function getUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  var init_getUTCISOWeekYear = __esm({
    "node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js"() {
      init_toDate();
      init_requiredArgs();
      init_startOfUTCISOWeek();
    }
  });

  // node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js
  function startOfUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var year = getUTCISOWeekYear(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary);
    return date;
  }
  var init_startOfUTCISOWeekYear = __esm({
    "node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js"() {
      init_getUTCISOWeekYear();
      init_startOfUTCISOWeek();
      init_requiredArgs();
    }
  });

  // node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js
  function getUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
  }
  var MILLISECONDS_IN_WEEK;
  var init_getUTCISOWeek = __esm({
    "node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js"() {
      init_toDate();
      init_startOfUTCISOWeek();
      init_startOfUTCISOWeekYear();
      init_requiredArgs();
      MILLISECONDS_IN_WEEK = 6048e5;
    }
  });

  // node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js
  function startOfUTCWeek(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var defaultOptions2 = getDefaultOptions();
    var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }
  var init_startOfUTCWeek = __esm({
    "node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js"() {
      init_toDate();
      init_requiredArgs();
      init_toInteger();
      init_defaultOptions();
    }
  });

  // node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js
  function getUTCWeekYear(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var defaultOptions2 = getDefaultOptions();
    var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
    }
    var firstWeekOfNextYear = new Date(0);
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
    var firstWeekOfThisYear = new Date(0);
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  var init_getUTCWeekYear = __esm({
    "node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js"() {
      init_toDate();
      init_requiredArgs();
      init_startOfUTCWeek();
      init_toInteger();
      init_defaultOptions();
    }
  });

  // node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js
  function startOfUTCWeekYear(dirtyDate, options) {
    var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
    requiredArgs(1, arguments);
    var defaultOptions2 = getDefaultOptions();
    var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
    var year = getUTCWeekYear(dirtyDate, options);
    var firstWeek = new Date(0);
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCWeek(firstWeek, options);
    return date;
  }
  var init_startOfUTCWeekYear = __esm({
    "node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js"() {
      init_getUTCWeekYear();
      init_requiredArgs();
      init_startOfUTCWeek();
      init_toInteger();
      init_defaultOptions();
    }
  });

  // node_modules/date-fns/esm/_lib/getUTCWeek/index.js
  function getUTCWeek(dirtyDate, options) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK2) + 1;
  }
  var MILLISECONDS_IN_WEEK2;
  var init_getUTCWeek = __esm({
    "node_modules/date-fns/esm/_lib/getUTCWeek/index.js"() {
      init_toDate();
      init_startOfUTCWeek();
      init_startOfUTCWeekYear();
      init_requiredArgs();
      MILLISECONDS_IN_WEEK2 = 6048e5;
    }
  });

  // node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
  function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? "-" : "";
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = "0" + output;
    }
    return sign + output;
  }
  var init_addLeadingZeros = __esm({
    "node_modules/date-fns/esm/_lib/addLeadingZeros/index.js"() {
    }
  });

  // node_modules/date-fns/esm/_lib/format/lightFormatters/index.js
  var formatters, lightFormatters_default;
  var init_lightFormatters = __esm({
    "node_modules/date-fns/esm/_lib/format/lightFormatters/index.js"() {
      init_addLeadingZeros();
      formatters = {
        y: function(date, token) {
          var signedYear = date.getUTCFullYear();
          var year = signedYear > 0 ? signedYear : 1 - signedYear;
          return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
        },
        M: function(date, token) {
          var month = date.getUTCMonth();
          return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
        },
        d: function(date, token) {
          return addLeadingZeros(date.getUTCDate(), token.length);
        },
        a: function(date, token) {
          var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
          switch (token) {
            case "a":
            case "aa":
              return dayPeriodEnumValue.toUpperCase();
            case "aaa":
              return dayPeriodEnumValue;
            case "aaaaa":
              return dayPeriodEnumValue[0];
            case "aaaa":
            default:
              return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
          }
        },
        h: function(date, token) {
          return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
        },
        H: function(date, token) {
          return addLeadingZeros(date.getUTCHours(), token.length);
        },
        m: function(date, token) {
          return addLeadingZeros(date.getUTCMinutes(), token.length);
        },
        s: function(date, token) {
          return addLeadingZeros(date.getUTCSeconds(), token.length);
        },
        S: function(date, token) {
          var numberOfDigits = token.length;
          var milliseconds = date.getUTCMilliseconds();
          var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
          return addLeadingZeros(fractionalSeconds, token.length);
        }
      };
      lightFormatters_default = formatters;
    }
  });

  // node_modules/date-fns/esm/_lib/format/formatters/index.js
  function formatTimezoneShort(offset, dirtyDelimiter) {
    var sign = offset > 0 ? "-" : "+";
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours);
    }
    var delimiter = dirtyDelimiter || "";
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
      var sign = offset > 0 ? "-" : "+";
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, dirtyDelimiter);
  }
  function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || "";
    var sign = offset > 0 ? "-" : "+";
    var absOffset = Math.abs(offset);
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
    var minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
  }
  var dayPeriodEnum, formatters2, formatters_default;
  var init_formatters = __esm({
    "node_modules/date-fns/esm/_lib/format/formatters/index.js"() {
      init_getUTCDayOfYear();
      init_getUTCISOWeek();
      init_getUTCISOWeekYear();
      init_getUTCWeek();
      init_getUTCWeekYear();
      init_addLeadingZeros();
      init_lightFormatters();
      dayPeriodEnum = {
        am: "am",
        pm: "pm",
        midnight: "midnight",
        noon: "noon",
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
      };
      formatters2 = {
        G: function(date, token, localize2) {
          var era = date.getUTCFullYear() > 0 ? 1 : 0;
          switch (token) {
            case "G":
            case "GG":
            case "GGG":
              return localize2.era(era, {
                width: "abbreviated"
              });
            case "GGGGG":
              return localize2.era(era, {
                width: "narrow"
              });
            case "GGGG":
            default:
              return localize2.era(era, {
                width: "wide"
              });
          }
        },
        y: function(date, token, localize2) {
          if (token === "yo") {
            var signedYear = date.getUTCFullYear();
            var year = signedYear > 0 ? signedYear : 1 - signedYear;
            return localize2.ordinalNumber(year, {
              unit: "year"
            });
          }
          return lightFormatters_default.y(date, token);
        },
        Y: function(date, token, localize2, options) {
          var signedWeekYear = getUTCWeekYear(date, options);
          var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
          if (token === "YY") {
            var twoDigitYear = weekYear % 100;
            return addLeadingZeros(twoDigitYear, 2);
          }
          if (token === "Yo") {
            return localize2.ordinalNumber(weekYear, {
              unit: "year"
            });
          }
          return addLeadingZeros(weekYear, token.length);
        },
        R: function(date, token) {
          var isoWeekYear = getUTCISOWeekYear(date);
          return addLeadingZeros(isoWeekYear, token.length);
        },
        u: function(date, token) {
          var year = date.getUTCFullYear();
          return addLeadingZeros(year, token.length);
        },
        Q: function(date, token, localize2) {
          var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
          switch (token) {
            case "Q":
              return String(quarter);
            case "QQ":
              return addLeadingZeros(quarter, 2);
            case "Qo":
              return localize2.ordinalNumber(quarter, {
                unit: "quarter"
              });
            case "QQQ":
              return localize2.quarter(quarter, {
                width: "abbreviated",
                context: "formatting"
              });
            case "QQQQQ":
              return localize2.quarter(quarter, {
                width: "narrow",
                context: "formatting"
              });
            case "QQQQ":
            default:
              return localize2.quarter(quarter, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        q: function(date, token, localize2) {
          var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
          switch (token) {
            case "q":
              return String(quarter);
            case "qq":
              return addLeadingZeros(quarter, 2);
            case "qo":
              return localize2.ordinalNumber(quarter, {
                unit: "quarter"
              });
            case "qqq":
              return localize2.quarter(quarter, {
                width: "abbreviated",
                context: "standalone"
              });
            case "qqqqq":
              return localize2.quarter(quarter, {
                width: "narrow",
                context: "standalone"
              });
            case "qqqq":
            default:
              return localize2.quarter(quarter, {
                width: "wide",
                context: "standalone"
              });
          }
        },
        M: function(date, token, localize2) {
          var month = date.getUTCMonth();
          switch (token) {
            case "M":
            case "MM":
              return lightFormatters_default.M(date, token);
            case "Mo":
              return localize2.ordinalNumber(month + 1, {
                unit: "month"
              });
            case "MMM":
              return localize2.month(month, {
                width: "abbreviated",
                context: "formatting"
              });
            case "MMMMM":
              return localize2.month(month, {
                width: "narrow",
                context: "formatting"
              });
            case "MMMM":
            default:
              return localize2.month(month, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        L: function(date, token, localize2) {
          var month = date.getUTCMonth();
          switch (token) {
            case "L":
              return String(month + 1);
            case "LL":
              return addLeadingZeros(month + 1, 2);
            case "Lo":
              return localize2.ordinalNumber(month + 1, {
                unit: "month"
              });
            case "LLL":
              return localize2.month(month, {
                width: "abbreviated",
                context: "standalone"
              });
            case "LLLLL":
              return localize2.month(month, {
                width: "narrow",
                context: "standalone"
              });
            case "LLLL":
            default:
              return localize2.month(month, {
                width: "wide",
                context: "standalone"
              });
          }
        },
        w: function(date, token, localize2, options) {
          var week = getUTCWeek(date, options);
          if (token === "wo") {
            return localize2.ordinalNumber(week, {
              unit: "week"
            });
          }
          return addLeadingZeros(week, token.length);
        },
        I: function(date, token, localize2) {
          var isoWeek = getUTCISOWeek(date);
          if (token === "Io") {
            return localize2.ordinalNumber(isoWeek, {
              unit: "week"
            });
          }
          return addLeadingZeros(isoWeek, token.length);
        },
        d: function(date, token, localize2) {
          if (token === "do") {
            return localize2.ordinalNumber(date.getUTCDate(), {
              unit: "date"
            });
          }
          return lightFormatters_default.d(date, token);
        },
        D: function(date, token, localize2) {
          var dayOfYear = getUTCDayOfYear(date);
          if (token === "Do") {
            return localize2.ordinalNumber(dayOfYear, {
              unit: "dayOfYear"
            });
          }
          return addLeadingZeros(dayOfYear, token.length);
        },
        E: function(date, token, localize2) {
          var dayOfWeek = date.getUTCDay();
          switch (token) {
            case "E":
            case "EE":
            case "EEE":
              return localize2.day(dayOfWeek, {
                width: "abbreviated",
                context: "formatting"
              });
            case "EEEEE":
              return localize2.day(dayOfWeek, {
                width: "narrow",
                context: "formatting"
              });
            case "EEEEEE":
              return localize2.day(dayOfWeek, {
                width: "short",
                context: "formatting"
              });
            case "EEEE":
            default:
              return localize2.day(dayOfWeek, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        e: function(date, token, localize2, options) {
          var dayOfWeek = date.getUTCDay();
          var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
          switch (token) {
            case "e":
              return String(localDayOfWeek);
            case "ee":
              return addLeadingZeros(localDayOfWeek, 2);
            case "eo":
              return localize2.ordinalNumber(localDayOfWeek, {
                unit: "day"
              });
            case "eee":
              return localize2.day(dayOfWeek, {
                width: "abbreviated",
                context: "formatting"
              });
            case "eeeee":
              return localize2.day(dayOfWeek, {
                width: "narrow",
                context: "formatting"
              });
            case "eeeeee":
              return localize2.day(dayOfWeek, {
                width: "short",
                context: "formatting"
              });
            case "eeee":
            default:
              return localize2.day(dayOfWeek, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        c: function(date, token, localize2, options) {
          var dayOfWeek = date.getUTCDay();
          var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
          switch (token) {
            case "c":
              return String(localDayOfWeek);
            case "cc":
              return addLeadingZeros(localDayOfWeek, token.length);
            case "co":
              return localize2.ordinalNumber(localDayOfWeek, {
                unit: "day"
              });
            case "ccc":
              return localize2.day(dayOfWeek, {
                width: "abbreviated",
                context: "standalone"
              });
            case "ccccc":
              return localize2.day(dayOfWeek, {
                width: "narrow",
                context: "standalone"
              });
            case "cccccc":
              return localize2.day(dayOfWeek, {
                width: "short",
                context: "standalone"
              });
            case "cccc":
            default:
              return localize2.day(dayOfWeek, {
                width: "wide",
                context: "standalone"
              });
          }
        },
        i: function(date, token, localize2) {
          var dayOfWeek = date.getUTCDay();
          var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
          switch (token) {
            case "i":
              return String(isoDayOfWeek);
            case "ii":
              return addLeadingZeros(isoDayOfWeek, token.length);
            case "io":
              return localize2.ordinalNumber(isoDayOfWeek, {
                unit: "day"
              });
            case "iii":
              return localize2.day(dayOfWeek, {
                width: "abbreviated",
                context: "formatting"
              });
            case "iiiii":
              return localize2.day(dayOfWeek, {
                width: "narrow",
                context: "formatting"
              });
            case "iiiiii":
              return localize2.day(dayOfWeek, {
                width: "short",
                context: "formatting"
              });
            case "iiii":
            default:
              return localize2.day(dayOfWeek, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        a: function(date, token, localize2) {
          var hours = date.getUTCHours();
          var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
          switch (token) {
            case "a":
            case "aa":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "abbreviated",
                context: "formatting"
              });
            case "aaa":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "abbreviated",
                context: "formatting"
              }).toLowerCase();
            case "aaaaa":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "narrow",
                context: "formatting"
              });
            case "aaaa":
            default:
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        b: function(date, token, localize2) {
          var hours = date.getUTCHours();
          var dayPeriodEnumValue;
          if (hours === 12) {
            dayPeriodEnumValue = dayPeriodEnum.noon;
          } else if (hours === 0) {
            dayPeriodEnumValue = dayPeriodEnum.midnight;
          } else {
            dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
          }
          switch (token) {
            case "b":
            case "bb":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "abbreviated",
                context: "formatting"
              });
            case "bbb":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "abbreviated",
                context: "formatting"
              }).toLowerCase();
            case "bbbbb":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "narrow",
                context: "formatting"
              });
            case "bbbb":
            default:
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        B: function(date, token, localize2) {
          var hours = date.getUTCHours();
          var dayPeriodEnumValue;
          if (hours >= 17) {
            dayPeriodEnumValue = dayPeriodEnum.evening;
          } else if (hours >= 12) {
            dayPeriodEnumValue = dayPeriodEnum.afternoon;
          } else if (hours >= 4) {
            dayPeriodEnumValue = dayPeriodEnum.morning;
          } else {
            dayPeriodEnumValue = dayPeriodEnum.night;
          }
          switch (token) {
            case "B":
            case "BB":
            case "BBB":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "abbreviated",
                context: "formatting"
              });
            case "BBBBB":
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "narrow",
                context: "formatting"
              });
            case "BBBB":
            default:
              return localize2.dayPeriod(dayPeriodEnumValue, {
                width: "wide",
                context: "formatting"
              });
          }
        },
        h: function(date, token, localize2) {
          if (token === "ho") {
            var hours = date.getUTCHours() % 12;
            if (hours === 0)
              hours = 12;
            return localize2.ordinalNumber(hours, {
              unit: "hour"
            });
          }
          return lightFormatters_default.h(date, token);
        },
        H: function(date, token, localize2) {
          if (token === "Ho") {
            return localize2.ordinalNumber(date.getUTCHours(), {
              unit: "hour"
            });
          }
          return lightFormatters_default.H(date, token);
        },
        K: function(date, token, localize2) {
          var hours = date.getUTCHours() % 12;
          if (token === "Ko") {
            return localize2.ordinalNumber(hours, {
              unit: "hour"
            });
          }
          return addLeadingZeros(hours, token.length);
        },
        k: function(date, token, localize2) {
          var hours = date.getUTCHours();
          if (hours === 0)
            hours = 24;
          if (token === "ko") {
            return localize2.ordinalNumber(hours, {
              unit: "hour"
            });
          }
          return addLeadingZeros(hours, token.length);
        },
        m: function(date, token, localize2) {
          if (token === "mo") {
            return localize2.ordinalNumber(date.getUTCMinutes(), {
              unit: "minute"
            });
          }
          return lightFormatters_default.m(date, token);
        },
        s: function(date, token, localize2) {
          if (token === "so") {
            return localize2.ordinalNumber(date.getUTCSeconds(), {
              unit: "second"
            });
          }
          return lightFormatters_default.s(date, token);
        },
        S: function(date, token) {
          return lightFormatters_default.S(date, token);
        },
        X: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timezoneOffset = originalDate.getTimezoneOffset();
          if (timezoneOffset === 0) {
            return "Z";
          }
          switch (token) {
            case "X":
              return formatTimezoneWithOptionalMinutes(timezoneOffset);
            case "XXXX":
            case "XX":
              return formatTimezone(timezoneOffset);
            case "XXXXX":
            case "XXX":
            default:
              return formatTimezone(timezoneOffset, ":");
          }
        },
        x: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timezoneOffset = originalDate.getTimezoneOffset();
          switch (token) {
            case "x":
              return formatTimezoneWithOptionalMinutes(timezoneOffset);
            case "xxxx":
            case "xx":
              return formatTimezone(timezoneOffset);
            case "xxxxx":
            case "xxx":
            default:
              return formatTimezone(timezoneOffset, ":");
          }
        },
        O: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timezoneOffset = originalDate.getTimezoneOffset();
          switch (token) {
            case "O":
            case "OO":
            case "OOO":
              return "GMT" + formatTimezoneShort(timezoneOffset, ":");
            case "OOOO":
            default:
              return "GMT" + formatTimezone(timezoneOffset, ":");
          }
        },
        z: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timezoneOffset = originalDate.getTimezoneOffset();
          switch (token) {
            case "z":
            case "zz":
            case "zzz":
              return "GMT" + formatTimezoneShort(timezoneOffset, ":");
            case "zzzz":
            default:
              return "GMT" + formatTimezone(timezoneOffset, ":");
          }
        },
        t: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timestamp = Math.floor(originalDate.getTime() / 1e3);
          return addLeadingZeros(timestamp, token.length);
        },
        T: function(date, token, _localize, options) {
          var originalDate = options._originalDate || date;
          var timestamp = originalDate.getTime();
          return addLeadingZeros(timestamp, token.length);
        }
      };
      formatters_default = formatters2;
    }
  });

  // node_modules/date-fns/esm/_lib/format/longFormatters/index.js
  var dateLongFormatter, timeLongFormatter, dateTimeLongFormatter, longFormatters, longFormatters_default;
  var init_longFormatters = __esm({
    "node_modules/date-fns/esm/_lib/format/longFormatters/index.js"() {
      dateLongFormatter = function(pattern, formatLong2) {
        switch (pattern) {
          case "P":
            return formatLong2.date({
              width: "short"
            });
          case "PP":
            return formatLong2.date({
              width: "medium"
            });
          case "PPP":
            return formatLong2.date({
              width: "long"
            });
          case "PPPP":
          default:
            return formatLong2.date({
              width: "full"
            });
        }
      };
      timeLongFormatter = function(pattern, formatLong2) {
        switch (pattern) {
          case "p":
            return formatLong2.time({
              width: "short"
            });
          case "pp":
            return formatLong2.time({
              width: "medium"
            });
          case "ppp":
            return formatLong2.time({
              width: "long"
            });
          case "pppp":
          default:
            return formatLong2.time({
              width: "full"
            });
        }
      };
      dateTimeLongFormatter = function(pattern, formatLong2) {
        var matchResult = pattern.match(/(P+)(p+)?/) || [];
        var datePattern = matchResult[1];
        var timePattern = matchResult[2];
        if (!timePattern) {
          return dateLongFormatter(pattern, formatLong2);
        }
        var dateTimeFormat;
        switch (datePattern) {
          case "P":
            dateTimeFormat = formatLong2.dateTime({
              width: "short"
            });
            break;
          case "PP":
            dateTimeFormat = formatLong2.dateTime({
              width: "medium"
            });
            break;
          case "PPP":
            dateTimeFormat = formatLong2.dateTime({
              width: "long"
            });
            break;
          case "PPPP":
          default:
            dateTimeFormat = formatLong2.dateTime({
              width: "full"
            });
            break;
        }
        return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
      };
      longFormatters = {
        p: timeLongFormatter,
        P: dateTimeLongFormatter
      };
      longFormatters_default = longFormatters;
    }
  });

  // node_modules/date-fns/esm/_lib/protectedTokens/index.js
  function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1;
  }
  function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1;
  }
  function throwProtectedError(token, format2, input) {
    if (token === "YYYY") {
      throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === "YY") {
      throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === "D") {
      throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    } else if (token === "DD") {
      throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
    }
  }
  var protectedDayOfYearTokens, protectedWeekYearTokens;
  var init_protectedTokens = __esm({
    "node_modules/date-fns/esm/_lib/protectedTokens/index.js"() {
      protectedDayOfYearTokens = ["D", "DD"];
      protectedWeekYearTokens = ["YY", "YYYY"];
    }
  });

  // node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js
  var formatDistanceLocale, formatDistance, formatDistance_default;
  var init_formatDistance = __esm({
    "node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js"() {
      formatDistanceLocale = {
        lessThanXSeconds: {
          one: "less than a second",
          other: "less than {{count}} seconds"
        },
        xSeconds: {
          one: "1 second",
          other: "{{count}} seconds"
        },
        halfAMinute: "half a minute",
        lessThanXMinutes: {
          one: "less than a minute",
          other: "less than {{count}} minutes"
        },
        xMinutes: {
          one: "1 minute",
          other: "{{count}} minutes"
        },
        aboutXHours: {
          one: "about 1 hour",
          other: "about {{count}} hours"
        },
        xHours: {
          one: "1 hour",
          other: "{{count}} hours"
        },
        xDays: {
          one: "1 day",
          other: "{{count}} days"
        },
        aboutXWeeks: {
          one: "about 1 week",
          other: "about {{count}} weeks"
        },
        xWeeks: {
          one: "1 week",
          other: "{{count}} weeks"
        },
        aboutXMonths: {
          one: "about 1 month",
          other: "about {{count}} months"
        },
        xMonths: {
          one: "1 month",
          other: "{{count}} months"
        },
        aboutXYears: {
          one: "about 1 year",
          other: "about {{count}} years"
        },
        xYears: {
          one: "1 year",
          other: "{{count}} years"
        },
        overXYears: {
          one: "over 1 year",
          other: "over {{count}} years"
        },
        almostXYears: {
          one: "almost 1 year",
          other: "almost {{count}} years"
        }
      };
      formatDistance = function(token, count, options) {
        var result;
        var tokenValue = formatDistanceLocale[token];
        if (typeof tokenValue === "string") {
          result = tokenValue;
        } else if (count === 1) {
          result = tokenValue.one;
        } else {
          result = tokenValue.other.replace("{{count}}", count.toString());
        }
        if (options !== null && options !== void 0 && options.addSuffix) {
          if (options.comparison && options.comparison > 0) {
            return "in " + result;
          } else {
            return result + " ago";
          }
        }
        return result;
      };
      formatDistance_default = formatDistance;
    }
  });

  // node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js
  function buildFormatLongFn(args) {
    return function() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format2 = args.formats[width] || args.formats[args.defaultWidth];
      return format2;
    };
  }
  var init_buildFormatLongFn = __esm({
    "node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js"() {
    }
  });

  // node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js
  var dateFormats, timeFormats, dateTimeFormats, formatLong, formatLong_default;
  var init_formatLong = __esm({
    "node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js"() {
      init_buildFormatLongFn();
      dateFormats = {
        full: "EEEE, MMMM do, y",
        long: "MMMM do, y",
        medium: "MMM d, y",
        short: "MM/dd/yyyy"
      };
      timeFormats = {
        full: "h:mm:ss a zzzz",
        long: "h:mm:ss a z",
        medium: "h:mm:ss a",
        short: "h:mm a"
      };
      dateTimeFormats = {
        full: "{{date}} 'at' {{time}}",
        long: "{{date}} 'at' {{time}}",
        medium: "{{date}}, {{time}}",
        short: "{{date}}, {{time}}"
      };
      formatLong = {
        date: buildFormatLongFn({
          formats: dateFormats,
          defaultWidth: "full"
        }),
        time: buildFormatLongFn({
          formats: timeFormats,
          defaultWidth: "full"
        }),
        dateTime: buildFormatLongFn({
          formats: dateTimeFormats,
          defaultWidth: "full"
        })
      };
      formatLong_default = formatLong;
    }
  });

  // node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js
  var formatRelativeLocale, formatRelative, formatRelative_default;
  var init_formatRelative = __esm({
    "node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js"() {
      formatRelativeLocale = {
        lastWeek: "'last' eeee 'at' p",
        yesterday: "'yesterday at' p",
        today: "'today at' p",
        tomorrow: "'tomorrow at' p",
        nextWeek: "eeee 'at' p",
        other: "P"
      };
      formatRelative = function(token, _date, _baseDate, _options) {
        return formatRelativeLocale[token];
      };
      formatRelative_default = formatRelative;
    }
  });

  // node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js
  function buildLocalizeFn(args) {
    return function(dirtyIndex, options) {
      var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
      var valuesArray;
      if (context === "formatting" && args.formattingValues) {
        var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        var _defaultWidth = args.defaultWidth;
        var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[_width] || args.values[_defaultWidth];
      }
      var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
      return valuesArray[index];
    };
  }
  var init_buildLocalizeFn = __esm({
    "node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js"() {
    }
  });

  // node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js
  var eraValues, quarterValues, monthValues, dayValues, dayPeriodValues, formattingDayPeriodValues, ordinalNumber, localize, localize_default;
  var init_localize = __esm({
    "node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js"() {
      init_buildLocalizeFn();
      eraValues = {
        narrow: ["B", "A"],
        abbreviated: ["BC", "AD"],
        wide: ["Before Christ", "Anno Domini"]
      };
      quarterValues = {
        narrow: ["1", "2", "3", "4"],
        abbreviated: ["Q1", "Q2", "Q3", "Q4"],
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
      };
      monthValues = {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      };
      dayValues = {
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      };
      dayPeriodValues = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        }
      };
      formattingDayPeriodValues = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        }
      };
      ordinalNumber = function(dirtyNumber, _options) {
        var number = Number(dirtyNumber);
        var rem100 = number % 100;
        if (rem100 > 20 || rem100 < 10) {
          switch (rem100 % 10) {
            case 1:
              return number + "st";
            case 2:
              return number + "nd";
            case 3:
              return number + "rd";
          }
        }
        return number + "th";
      };
      localize = {
        ordinalNumber,
        era: buildLocalizeFn({
          values: eraValues,
          defaultWidth: "wide"
        }),
        quarter: buildLocalizeFn({
          values: quarterValues,
          defaultWidth: "wide",
          argumentCallback: function(quarter) {
            return quarter - 1;
          }
        }),
        month: buildLocalizeFn({
          values: monthValues,
          defaultWidth: "wide"
        }),
        day: buildLocalizeFn({
          values: dayValues,
          defaultWidth: "wide"
        }),
        dayPeriod: buildLocalizeFn({
          values: dayPeriodValues,
          defaultWidth: "wide",
          formattingValues: formattingDayPeriodValues,
          defaultFormattingWidth: "wide"
        })
      };
      localize_default = localize;
    }
  });

  // node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js
  function buildMatchFn(args) {
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var width = options.width;
      var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      var matchedString = matchResult[0];
      var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
        return pattern.test(matchedString);
      }) : findKey(parsePatterns, function(pattern) {
        return pattern.test(matchedString);
      });
      var value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value,
        rest
      };
    };
  }
  function findKey(object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key;
      }
    }
    return void 0;
  }
  function findIndex(array, predicate) {
    for (var key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return void 0;
  }
  var init_buildMatchFn = __esm({
    "node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js"() {
    }
  });

  // node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js
  function buildMatchPatternFn(args) {
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var matchResult = string.match(args.matchPattern);
      if (!matchResult)
        return null;
      var matchedString = matchResult[0];
      var parseResult = string.match(args.parsePattern);
      if (!parseResult)
        return null;
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
      return {
        value,
        rest
      };
    };
  }
  var init_buildMatchPatternFn = __esm({
    "node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js"() {
    }
  });

  // node_modules/date-fns/esm/locale/en-US/_lib/match/index.js
  var matchOrdinalNumberPattern, parseOrdinalNumberPattern, matchEraPatterns, parseEraPatterns, matchQuarterPatterns, parseQuarterPatterns, matchMonthPatterns, parseMonthPatterns, matchDayPatterns, parseDayPatterns, matchDayPeriodPatterns, parseDayPeriodPatterns, match, match_default;
  var init_match = __esm({
    "node_modules/date-fns/esm/locale/en-US/_lib/match/index.js"() {
      init_buildMatchFn();
      init_buildMatchPatternFn();
      matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
      parseOrdinalNumberPattern = /\d+/i;
      matchEraPatterns = {
        narrow: /^(b|a)/i,
        abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
        wide: /^(before christ|before common era|anno domini|common era)/i
      };
      parseEraPatterns = {
        any: [/^b/i, /^(a|c)/i]
      };
      matchQuarterPatterns = {
        narrow: /^[1234]/i,
        abbreviated: /^q[1234]/i,
        wide: /^[1234](th|st|nd|rd)? quarter/i
      };
      parseQuarterPatterns = {
        any: [/1/i, /2/i, /3/i, /4/i]
      };
      matchMonthPatterns = {
        narrow: /^[jfmasond]/i,
        abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
        wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
      };
      parseMonthPatterns = {
        narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
        any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
      };
      matchDayPatterns = {
        narrow: /^[smtwf]/i,
        short: /^(su|mo|tu|we|th|fr|sa)/i,
        abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
        wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
      };
      parseDayPatterns = {
        narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
        any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
      };
      matchDayPeriodPatterns = {
        narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
        any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
      };
      parseDayPeriodPatterns = {
        any: {
          am: /^a/i,
          pm: /^p/i,
          midnight: /^mi/i,
          noon: /^no/i,
          morning: /morning/i,
          afternoon: /afternoon/i,
          evening: /evening/i,
          night: /night/i
        }
      };
      match = {
        ordinalNumber: buildMatchPatternFn({
          matchPattern: matchOrdinalNumberPattern,
          parsePattern: parseOrdinalNumberPattern,
          valueCallback: function(value) {
            return parseInt(value, 10);
          }
        }),
        era: buildMatchFn({
          matchPatterns: matchEraPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseEraPatterns,
          defaultParseWidth: "any"
        }),
        quarter: buildMatchFn({
          matchPatterns: matchQuarterPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseQuarterPatterns,
          defaultParseWidth: "any",
          valueCallback: function(index) {
            return index + 1;
          }
        }),
        month: buildMatchFn({
          matchPatterns: matchMonthPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseMonthPatterns,
          defaultParseWidth: "any"
        }),
        day: buildMatchFn({
          matchPatterns: matchDayPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseDayPatterns,
          defaultParseWidth: "any"
        }),
        dayPeriod: buildMatchFn({
          matchPatterns: matchDayPeriodPatterns,
          defaultMatchWidth: "any",
          parsePatterns: parseDayPeriodPatterns,
          defaultParseWidth: "any"
        })
      };
      match_default = match;
    }
  });

  // node_modules/date-fns/esm/locale/en-US/index.js
  var locale, en_US_default;
  var init_en_US = __esm({
    "node_modules/date-fns/esm/locale/en-US/index.js"() {
      init_formatDistance();
      init_formatLong();
      init_formatRelative();
      init_localize();
      init_match();
      locale = {
        code: "en-US",
        formatDistance: formatDistance_default,
        formatLong: formatLong_default,
        formatRelative: formatRelative_default,
        localize: localize_default,
        match: match_default,
        options: {
          weekStartsOn: 0,
          firstWeekContainsDate: 1
        }
      };
      en_US_default = locale;
    }
  });

  // node_modules/date-fns/esm/_lib/defaultLocale/index.js
  var defaultLocale_default;
  var init_defaultLocale = __esm({
    "node_modules/date-fns/esm/_lib/defaultLocale/index.js"() {
      init_en_US();
      defaultLocale_default = en_US_default;
    }
  });

  // node_modules/date-fns/esm/format/index.js
  function format(dirtyDate, dirtyFormatStr, options) {
    var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
    requiredArgs(2, arguments);
    var formatStr = String(dirtyFormatStr);
    var defaultOptions2 = getDefaultOptions();
    var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale_default;
    var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
    }
    var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
    }
    if (!locale2.localize) {
      throw new RangeError("locale must contain localize property");
    }
    if (!locale2.formatLong) {
      throw new RangeError("locale must contain formatLong property");
    }
    var originalDate = toDate(dirtyDate);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
    var utcDate = subMilliseconds(originalDate, timezoneOffset);
    var formatterOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale: locale2,
      _originalDate: originalDate
    };
    var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
      var firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        var longFormatter = longFormatters_default[firstCharacter];
        return longFormatter(substring, locale2.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp).map(function(substring) {
      if (substring === "''") {
        return "'";
      }
      var firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return cleanEscapedString(substring);
      }
      var formatter = formatters_default[firstCharacter];
      if (formatter) {
        if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
        }
        if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(substring)) {
          throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
        }
        return formatter(utcDate, substring, locale2.localize, formatterOptions);
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
      }
      return substring;
    }).join("");
    return result;
  }
  function cleanEscapedString(input) {
    var matched = input.match(escapedStringRegExp);
    if (!matched) {
      return input;
    }
    return matched[1].replace(doubleQuoteRegExp, "'");
  }
  var formattingTokensRegExp, longFormattingTokensRegExp, escapedStringRegExp, doubleQuoteRegExp, unescapedLatinCharacterRegExp;
  var init_format = __esm({
    "node_modules/date-fns/esm/format/index.js"() {
      init_isValid();
      init_subMilliseconds();
      init_toDate();
      init_formatters();
      init_longFormatters();
      init_getTimezoneOffsetInMilliseconds();
      init_protectedTokens();
      init_toInteger();
      init_requiredArgs();
      init_defaultOptions();
      init_defaultLocale();
      formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
      longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
      escapedStringRegExp = /^'([^]*?)'?$/;
      doubleQuoteRegExp = /''/g;
      unescapedLatinCharacterRegExp = /[a-zA-Z]/;
    }
  });

  // node_modules/date-fns/esm/index.js
  var init_esm = __esm({
    "node_modules/date-fns/esm/index.js"() {
      init_format();
      init_constants();
    }
  });

  // resources/ts/element/SaveElement.ts
  var SaveElement;
  var init_SaveElement = __esm({
    "resources/ts/element/SaveElement.ts"() {
      init_u();
      init_esm();
      SaveElement = class {
        init(datastore, paper) {
          this.datastore = datastore;
          this.paper = paper;
          this.ele = document.querySelector("#act-save");
          this.ele.addEventListener("click", (e) => this.proc());
          this.ele.addEventListener("touchend", (e) => this.proc());
        }
        proc() {
          return __async(this, null, function* () {
            if (this.datastore.getDraw().length() > 0) {
              yield this.datastore.save();
              this.datastore.clear();
              this.paper.clear();
              toast.normal("saved");
            } else {
              toast.normal("not saved (no draw)");
            }
          });
        }
        static updateLabel() {
          const ele = document.querySelector("#label-save");
          ele.innerText = format(new Date(), "kk:mm:ss");
        }
      };
    }
  });

  // resources/ts/action/LoadAction.ts
  var LoadAction;
  var init_LoadAction = __esm({
    "resources/ts/action/LoadAction.ts"() {
      init_SaveElement();
      LoadAction = class {
        constructor() {
          this.first = true;
        }
        init(papermine, paperother, drawmine, drawother, pen, drawstatus) {
          this.papers = {
            mine: papermine,
            other: paperother
          };
          this.datastores = {
            mine: drawmine,
            other: drawother
          };
          this.pen = pen;
          this.drawstatus = drawstatus;
          this.proc(true);
        }
        proc(periodic) {
          return __async(this, null, function* () {
            if (!this.drawstatus.isDrawing()) {
              if (this.datastores.mine.getDraw().length() > 0) {
                yield this.datastores.mine.save();
                yield this.datastores.mine.clear();
                SaveElement.updateLabel();
              }
              yield this.datastores.other.load();
              yield this.redraw(this.papers.other, this.datastores.other.getDraws(), this.pen);
              if (!this.drawstatus.isDrawing()) {
                yield this.papers.mine.clear();
              }
            }
            if (periodic) {
              const sec = 3;
              setTimeout(() => this.proc(true), sec * 1e3);
            }
          });
        }
        redraw(paper, draws, pen) {
          return __async(this, null, function* () {
            pen.saveOpt();
            let prepoint = null;
            if (this.first) {
              paper.getCnv().style.visibility = "hidden";
            }
            for (const draw of draws) {
              const strokes = draw.getStrokes();
              for (const s of strokes) {
                pen.opt.update(s.opt);
                pen.eraser = s.isEraser();
                for (const p of s.getPoints()) {
                  pen.proc(p.x, p.y, prepoint, paper);
                  prepoint = p;
                }
                prepoint = null;
              }
            }
            if (this.first) {
              paper.getCnv().style.visibility = "visible";
              this.first = false;
            }
            pen.restoreOpt();
          });
        }
        toImage(cnv) {
          return __async(this, null, function* () {
            return new Promise((resolve, reject) => {
              const image = new Image();
              const ctx = cnv.getContext("2d");
              image.onload = () => resolve(image);
              image.onerror = (e) => reject(e);
              image.src = ctx.canvas.toDataURL();
            });
          });
        }
      };
    }
  });

  // resources/ts/element/LoadElement.ts
  var LoadElement;
  var init_LoadElement = __esm({
    "resources/ts/element/LoadElement.ts"() {
      init_u();
      LoadElement = class {
        init(load) {
          this.load = load;
          this.ele = document.querySelector("#act-load-other-force");
          this.ele.addEventListener("click", (e) => this.proc());
          this.ele.addEventListener("touchend", (e) => this.proc());
        }
        proc() {
          return __async(this, null, function* () {
            toast.normal("now loading");
            yield this.load.proc(false);
            toast.normal("loaded");
          });
        }
      };
    }
  });

  // resources/ts/element/DrawcanvasesElement.ts
  var DrawcanvasesElement;
  var init_DrawcanvasesElement = __esm({
    "resources/ts/element/DrawcanvasesElement.ts"() {
      DrawcanvasesElement = class {
        constructor() {
          this.wrapdiv = document.querySelector("#drawcanvases");
        }
        element() {
          return this.wrapdiv;
        }
        setNormal() {
          this.wrapdiv.style.backgroundColor = "#FFFFFF00";
        }
        setScroll() {
          this.wrapdiv.style.backgroundColor = "#00FF0077";
        }
        setExpand() {
          this.wrapdiv.style.backgroundColor = "#FF000077";
        }
      };
    }
  });

  // resources/ts/data/DrawStatus.ts
  var DrawStatus;
  var init_DrawStatus = __esm({
    "resources/ts/data/DrawStatus.ts"() {
      DrawStatus = class {
        constructor() {
          this.endStroke();
        }
        endStroke() {
          this.event = "up";
          this.tool = null;
        }
        startStroke() {
          this.event = "down";
          this.tool = null;
        }
        setTool(tool) {
          this.tool = tool;
        }
        getTool() {
          return this.tool;
        }
        isEndStroke(now) {
          return now === "up" && this.event !== "up";
        }
        isStartStroke(now) {
          return now === "down";
        }
        isDrawing() {
          return ["down", "move"].includes(this.event);
        }
      };
    }
  });

  // node_modules/rfdc/index.js
  var require_rfdc = __commonJS({
    "node_modules/rfdc/index.js"(exports, module) {
      "use strict";
      module.exports = rfdc2;
      function copyBuffer(cur) {
        if (cur instanceof Buffer) {
          return Buffer.from(cur);
        }
        return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
      }
      function rfdc2(opts) {
        opts = opts || {};
        if (opts.circles)
          return rfdcCircles(opts);
        return opts.proto ? cloneProto : clone;
        function cloneArray(a, fn) {
          var keys = Object.keys(a);
          var a2 = new Array(keys.length);
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var cur = a[k];
            if (typeof cur !== "object" || cur === null) {
              a2[k] = cur;
            } else if (cur instanceof Date) {
              a2[k] = new Date(cur);
            } else if (ArrayBuffer.isView(cur)) {
              a2[k] = copyBuffer(cur);
            } else {
              a2[k] = fn(cur);
            }
          }
          return a2;
        }
        function clone(o) {
          if (typeof o !== "object" || o === null)
            return o;
          if (o instanceof Date)
            return new Date(o);
          if (Array.isArray(o))
            return cloneArray(o, clone);
          if (o instanceof Map)
            return new Map(cloneArray(Array.from(o), clone));
          if (o instanceof Set)
            return new Set(cloneArray(Array.from(o), clone));
          var o2 = {};
          for (var k in o) {
            if (Object.hasOwnProperty.call(o, k) === false)
              continue;
            var cur = o[k];
            if (typeof cur !== "object" || cur === null) {
              o2[k] = cur;
            } else if (cur instanceof Date) {
              o2[k] = new Date(cur);
            } else if (cur instanceof Map) {
              o2[k] = new Map(cloneArray(Array.from(cur), clone));
            } else if (cur instanceof Set) {
              o2[k] = new Set(cloneArray(Array.from(cur), clone));
            } else if (ArrayBuffer.isView(cur)) {
              o2[k] = copyBuffer(cur);
            } else {
              o2[k] = clone(cur);
            }
          }
          return o2;
        }
        function cloneProto(o) {
          if (typeof o !== "object" || o === null)
            return o;
          if (o instanceof Date)
            return new Date(o);
          if (Array.isArray(o))
            return cloneArray(o, cloneProto);
          if (o instanceof Map)
            return new Map(cloneArray(Array.from(o), cloneProto));
          if (o instanceof Set)
            return new Set(cloneArray(Array.from(o), cloneProto));
          var o2 = {};
          for (var k in o) {
            var cur = o[k];
            if (typeof cur !== "object" || cur === null) {
              o2[k] = cur;
            } else if (cur instanceof Date) {
              o2[k] = new Date(cur);
            } else if (cur instanceof Map) {
              o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
            } else if (cur instanceof Set) {
              o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
            } else if (ArrayBuffer.isView(cur)) {
              o2[k] = copyBuffer(cur);
            } else {
              o2[k] = cloneProto(cur);
            }
          }
          return o2;
        }
      }
      function rfdcCircles(opts) {
        var refs = [];
        var refsNew = [];
        return opts.proto ? cloneProto : clone;
        function cloneArray(a, fn) {
          var keys = Object.keys(a);
          var a2 = new Array(keys.length);
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var cur = a[k];
            if (typeof cur !== "object" || cur === null) {
              a2[k] = cur;
            } else if (cur instanceof Date) {
              a2[k] = new Date(cur);
            } else if (ArrayBuffer.isView(cur)) {
              a2[k] = copyBuffer(cur);
            } else {
              var index = refs.indexOf(cur);
              if (index !== -1) {
                a2[k] = refsNew[index];
              } else {
                a2[k] = fn(cur);
              }
            }
          }
          return a2;
        }
        function clone(o) {
          if (typeof o !== "object" || o === null)
            return o;
          if (o instanceof Date)
            return new Date(o);
          if (Array.isArray(o))
            return cloneArray(o, clone);
          if (o instanceof Map)
            return new Map(cloneArray(Array.from(o), clone));
          if (o instanceof Set)
            return new Set(cloneArray(Array.from(o), clone));
          var o2 = {};
          refs.push(o);
          refsNew.push(o2);
          for (var k in o) {
            if (Object.hasOwnProperty.call(o, k) === false)
              continue;
            var cur = o[k];
            if (typeof cur !== "object" || cur === null) {
              o2[k] = cur;
            } else if (cur instanceof Date) {
              o2[k] = new Date(cur);
            } else if (cur instanceof Map) {
              o2[k] = new Map(cloneArray(Array.from(cur), clone));
            } else if (cur instanceof Set) {
              o2[k] = new Set(cloneArray(Array.from(cur), clone));
            } else if (ArrayBuffer.isView(cur)) {
              o2[k] = copyBuffer(cur);
            } else {
              var i = refs.indexOf(cur);
              if (i !== -1) {
                o2[k] = refsNew[i];
              } else {
                o2[k] = clone(cur);
              }
            }
          }
          refs.pop();
          refsNew.pop();
          return o2;
        }
        function cloneProto(o) {
          if (typeof o !== "object" || o === null)
            return o;
          if (o instanceof Date)
            return new Date(o);
          if (Array.isArray(o))
            return cloneArray(o, cloneProto);
          if (o instanceof Map)
            return new Map(cloneArray(Array.from(o), cloneProto));
          if (o instanceof Set)
            return new Set(cloneArray(Array.from(o), cloneProto));
          var o2 = {};
          refs.push(o);
          refsNew.push(o2);
          for (var k in o) {
            var cur = o[k];
            if (typeof cur !== "object" || cur === null) {
              o2[k] = cur;
            } else if (cur instanceof Date) {
              o2[k] = new Date(cur);
            } else if (cur instanceof Map) {
              o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
            } else if (cur instanceof Set) {
              o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
            } else if (ArrayBuffer.isView(cur)) {
              o2[k] = copyBuffer(cur);
            } else {
              var i = refs.indexOf(cur);
              if (i !== -1) {
                o2[k] = refsNew[i];
              } else {
                o2[k] = cloneProto(cur);
              }
            }
          }
          refs.pop();
          refsNew.pop();
          return o2;
        }
      }
    }
  });

  // resources/ts/action/PenAction.ts
  var import_rfdc, PenAction;
  var init_PenAction = __esm({
    "resources/ts/action/PenAction.ts"() {
      init_Draw();
      import_rfdc = __toESM(require_rfdc());
      PenAction = class {
        constructor() {
          this.opt = new StrokeOption("", 0);
          this.clone = (0, import_rfdc.default)();
        }
        init(opt) {
          this.eraser = false;
          this.opt.update(opt);
          this.optbk = null;
        }
        proc(x, y, prep, paper) {
          let pre = prep;
          if (pre == null) {
            pre = new Point(x, y);
          }
          const ctx = paper.getCtx();
          if (this.eraser) {
            this.erase(x, y, pre, ctx);
          } else {
            this.pen(x, y, pre, ctx);
          }
        }
        pen(x, y, pre, ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.lineCap = "round";
          ctx.lineWidth = this.opt.thick;
          ctx.strokeStyle = this.opt.color;
          ctx.moveTo(pre.x, pre.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.restore();
        }
        erase(x, y, pre, ctx) {
          ctx.save();
          const d = Math.abs(x - pre.x) + Math.abs(y - pre.y);
          ctx.clearRect(x - d, y - d, d * 2, d * 2);
          ctx.restore();
        }
        saveOpt() {
          this.optbk = this.clone(this.opt);
        }
        restoreOpt() {
          for (const [idx, val] of Object.entries(this.optbk)) {
            this.opt[idx] = val;
          }
        }
      };
    }
  });

  // resources/ts/element/UndoElement.ts
  var UndoElement;
  var init_UndoElement = __esm({
    "resources/ts/element/UndoElement.ts"() {
      UndoElement = class {
        init(paper, draw, pen) {
          this.paper = paper;
          this.draw = draw;
          this.pen = pen;
          this.ele = document.querySelector("#act-undo");
          this.ele.addEventListener("click", () => this.proc());
          this.ele.addEventListener("touchend", () => this.proc());
        }
        proc() {
          const strokes = this.draw.undo();
          this.paper.clear();
          this.pen.saveOpt();
          let prepoint = null;
          for (const s of strokes) {
            if (s.isEraser()) {
              this.pen.opt.color = s.color;
              this.pen.opt.eraser = true;
            } else {
              this.pen.opt.color = s.color;
              this.pen.opt.eraser = false;
            }
            for (const p of s.getPoints()) {
              this.pen.proc(p.x, p.y, prepoint, this.paper);
              prepoint = p;
            }
            prepoint = null;
          }
          this.pen.restoreOpt();
        }
      };
    }
  });

  // resources/ts/action/ZoomScrollAction.ts
  var ZoomScrollAction;
  var init_ZoomScrollAction = __esm({
    "resources/ts/action/ZoomScrollAction.ts"() {
      init_Draw();
      init_u();
      ZoomScrollAction = class {
        constructor() {
          this.prep = null;
          this.nowzoom = 1;
          this.orgw = 0;
          this.orgh = 0;
          this.ZOOM_MAX = 2;
          this.ZOOM_MIN = 0.5;
          this.pretime = 0;
        }
        init(wrapdiv, zoomscroll) {
          this.wrapdiv = wrapdiv;
          this.zoomscroll = zoomscroll;
          this.nowzoom = 1;
          this.zoomscroll.show(this.nowzoom);
          const ele = document.querySelector("main");
          this.orgw = parseInt(ele.style.width.replace("px", ""));
          this.orgh = parseInt(ele.style.height.replace("px", ""));
        }
        setPoint(x, y) {
          this.prep = new Point(x, y);
        }
        scroll(x, y) {
          if (this.ignore() || !this.prep) {
            return;
          }
          const dx = (this.prep.x - x) * this.nowzoom * 7;
          const dy = (this.prep.y - y) * this.nowzoom * 7;
          const nx = window.pageXOffset;
          const ny = window.pageYOffset;
          window.scroll({
            left: nx + dx,
            top: ny + dy,
            behavior: "smooth"
          });
          pd(`scroll : ${this.prep.x}-${x}=${dx}, ${this.prep.y}-${y}=${dy}`);
          this.prep.x = x;
          this.prep.y = y;
        }
        zoomdrag(x, y) {
          if (!this.prep) {
            return;
          }
          const dy = this.prep.y - y;
          const diff = dy * 5e-4 * this.nowzoom;
          this.zoomproc(diff);
          this.prep.x = x;
          this.prep.y = y;
        }
        zoomproc(diff) {
          this.nowzoom += diff;
          this.nowzoom = Math.min(Math.max(this.nowzoom, this.ZOOM_MIN), this.ZOOM_MAX);
          const ele = document.querySelector("main");
          ele.style.transform = `scale(${this.nowzoom})`;
          this.zoomscroll.show(this.nowzoom);
          ele.style.width = `${this.orgw * this.nowzoom}px`;
          ele.style.height = `${this.orgh * this.nowzoom}px`;
        }
        getZoom() {
          return this.nowzoom;
        }
        ignore() {
          const n = Date.now();
          let ret = true;
          if (n - this.pretime > 0.01 * 1e3) {
            ret = false;
            this.pretime = n;
          }
          return ret;
        }
      };
    }
  });

  // resources/ts/element/ZoomElement.ts
  var ZoomElement;
  var init_ZoomElement = __esm({
    "resources/ts/element/ZoomElement.ts"() {
      ZoomElement = class {
        init(zoomscroll) {
          this.zoomscroll = zoomscroll;
          this.lbl = document.querySelector("#zoom-label");
          this.btp = document.querySelector("#zoom-plus");
          this.btm = document.querySelector("#zoom-minus");
          this.btp.addEventListener("click", () => this.zoomscroll.zoomproc(0.1));
          this.btp.addEventListener("touchstart", () => this.zoomscroll.zoomproc(0.1));
          this.btm.addEventListener("click", () => this.zoomscroll.zoomproc(-0.1));
          this.btm.addEventListener("touchstart", () => this.zoomscroll.zoomproc(-0.1));
        }
        label() {
          return this.lbl;
        }
        show(nowzoom) {
          this.lbl.innerHTML = `${Math.round(nowzoom * 100).toString()}%`;
        }
      };
    }
  });

  // resources/ts/element/EraserElement.ts
  var EraserElement;
  var init_EraserElement = __esm({
    "resources/ts/element/EraserElement.ts"() {
      EraserElement = class {
        constructor() {
          this.ele = document.querySelector("#act-eraser");
          this.ele.addEventListener("click", (e) => this.proc());
          this.ele.addEventListener("touchend", (e) => this.proc());
        }
        init(pen) {
          this.pen = pen;
        }
        proc() {
          this.pen.eraser = !this.pen.eraser;
          const enable = "has-background-primary";
          const disable = "has-background-light";
          if (this.pen.eraser) {
            this.ele.classList.replace(disable, enable);
          } else {
            this.ele.classList.replace(enable, disable);
          }
        }
      };
    }
  });

  // resources/ts/element/ColorElement.ts
  var ColorElement;
  var init_ColorElement = __esm({
    "resources/ts/element/ColorElement.ts"() {
      init_u();
      ColorElement = class {
        init(pen) {
          this.pen = pen;
          const handler = (ev) => {
            var _a;
            const item = ev.target;
            const color = item.style.backgroundColor;
            this.pen.opt.color = color;
            toast.normal(`change to ${color}`);
            const pen2 = document.querySelector("#color-label");
            pen2.style.color = color;
            (_a = document.querySelector("#color-dropdown.is-active")) == null ? void 0 : _a.classList.remove("is-active");
          };
          document.querySelectorAll(".pen-color").forEach((ele) => {
            ele.addEventListener("click", handler);
            ele.addEventListener("touchend", handler);
          });
        }
      };
    }
  });

  // resources/ts/element/ThickElement.ts
  var ThickElement;
  var init_ThickElement = __esm({
    "resources/ts/element/ThickElement.ts"() {
      init_u();
      ThickElement = class {
        init(pen) {
          this.pen = pen;
          const handler = (ev) => {
            var _a;
            const item = ev.target;
            const px = item.getAttribute("data-width");
            const thick = parseInt(px);
            this.pen.opt.thick = thick;
            toast.normal(`change to ${thick}`);
            const pen2 = document.querySelector("#thick-label");
            pen2.style.width = `${thick}px`;
            pen2.style.height = `${thick}px`;
            pen2.style.borderRadius = `${thick / 2}px`;
            (_a = document.querySelector("#thick-dropdown.is-active")) == null ? void 0 : _a.classList.remove("is-active");
          };
          document.querySelectorAll(".pen-thick").forEach((ele) => {
            ele.addEventListener("click", handler);
            ele.addEventListener("touchend", handler);
          });
        }
      };
    }
  });

  // resources/ts/element/BackElement.ts
  var BackElement;
  var init_BackElement = __esm({
    "resources/ts/element/BackElement.ts"() {
      init_u();
      BackElement = class {
        constructor() {
          this.ele = document.querySelector("#act-back");
          this.ele.addEventListener("click", () => this.proc());
          this.ele.addEventListener("touchend", () => this.proc());
        }
        init(draw) {
          this.draw = draw;
        }
        proc() {
          return __async(this, null, function* () {
            if (!this.draw.isSaved()) {
              toast.normal("\u4FDD\u5B58\u3057\u3066\u623B\u308A\u307E\u3059");
              yield this.draw.save();
            }
            window.location.href = "/";
          });
        }
      };
    }
  });

  // resources/ts/DrawEventHandler.ts
  var DrawEventHandler;
  var init_DrawEventHandler = __esm({
    "resources/ts/DrawEventHandler.ts"() {
      init_Draw();
      init_PaperElement();
      init_DrawMine();
      init_DrawOther();
      init_MouseSensor();
      init_PointerSensor();
      init_TouchSensor();
      init_SaveElement();
      init_LoadAction();
      init_LoadElement();
      init_DrawcanvasesElement();
      init_DrawStatus();
      init_PenAction();
      init_UndoElement();
      init_ZoomScrollAction();
      init_ZoomElement();
      init_EraserElement();
      init_ColorElement();
      init_ThickElement();
      init_BackElement();
      DrawEventHandler = class {
        constructor() {
          this.status = {
            draw: new DrawStatus()
          };
          this.element = {
            wrapdiv: new DrawcanvasesElement(),
            zoomscroll: new ZoomElement(),
            save: new SaveElement(),
            eraser: new EraserElement(),
            color: new ColorElement(),
            undo: new UndoElement(),
            back: new BackElement(),
            load: new LoadElement(),
            thick: new ThickElement()
          };
          this.action = {
            load: new LoadAction(),
            zoomscroll: new ZoomScrollAction()
          };
          this.mine = {
            paper: PaperElement.makeMine(),
            draw: new DrawMine(),
            pen: new PenAction()
          };
          this.other = {
            paper: PaperElement.makeOther(),
            draw: new DrawOther(),
            pen: new PenAction()
          };
          this.device = {
            mouse: new MouseSensor(),
            pointer: new PointerSensor(),
            touch: new TouchSensor()
          };
        }
        init() {
          this.nowsensor = null;
          const sd = this.loadServerData();
          const color = sd["#sd-color"];
          const thick = sd["#sd-thick"];
          this.element.zoomscroll.init(this.action.zoomscroll);
          this.element.save.init(this.mine.draw, this.mine.paper);
          this.element.color.init(this.mine.pen);
          this.element.thick.init(this.mine.pen);
          this.element.eraser.init(this.mine.pen);
          this.element.undo.init(this.mine.paper, this.mine.draw, this.mine.pen);
          this.element.back.init(this.mine.draw);
          this.element.load.init(this.action.load);
          this.device.mouse.init(this, this.mine.paper);
          this.device.pointer.init(this, this.mine.paper);
          this.device.touch.init(this, this.mine.paper, this.action.zoomscroll);
          this.action.load.init(this.mine.paper, this.other.paper, this.mine.draw, this.other.draw, this.other.pen, this.status.draw);
          this.action.zoomscroll.init(this.element.wrapdiv, this.element.zoomscroll);
          const strokeopt = new StrokeOption(color, thick);
          this.mine.pen.init(strokeopt);
          this.mine.draw.init(this.mine.pen);
          this.other.pen.init(strokeopt);
        }
        loadServerData() {
          var _a;
          const ids = [
            "#sd-color",
            "#sd-thick"
          ];
          const ret = [];
          for (const id of ids) {
            ret[id] = (_a = document.querySelector(id)) == null ? void 0 : _a.innerHTML;
          }
          return ret;
        }
        down(dev, e, p) {
          e.preventDefault();
          e.stopPropagation();
          const x = p.x;
          const y = p.y;
          this.nowsensor = dev;
          this.status.draw.startStroke();
          this.mine.draw.startStroke();
        }
        move(dev, e, p) {
          e.preventDefault();
          const x = p.x;
          const y = p.y;
          if (this.nowsensor === null || this.nowsensor !== dev) {
            return;
          }
          this.status.draw.setTool("pen");
          switch (this.status.draw.getTool()) {
            case "pen":
              const p2 = this.mine.draw.lastPoint();
              this.mine.pen.proc(x, y, p2, this.mine.paper);
              this.mine.draw.pushPoint(x, y);
              break;
          }
        }
        up(dev, e, p) {
          e.preventDefault();
          if (this.status.draw.isDrawing()) {
            const x = p.x;
            const y = p.y;
            this.status.draw.endStroke();
            this.mine.draw.endStroke();
            this.element.wrapdiv.setNormal();
            this.nowsensor = null;
          }
        }
      };
    }
  });

  // resources/ts/app.ts
  var require_app = __commonJS({
    "resources/ts/app.ts"(exports) {
      init_DrawEventHandler();
      var bulmaNavDrop = (e) => {
        var _a;
        const target = e.target;
        const menuitem = (_a = target.parentElement) == null ? void 0 : _a.parentElement;
        document.querySelectorAll(".is-active").forEach((ele) => {
          if (ele !== menuitem) {
            ele.classList.remove("is-active");
          }
        });
        menuitem.classList.toggle("is-active");
      };
      var initBulmaNavDrop = () => {
        document.querySelectorAll(".dropdown .dropdown-trigger a").forEach((nav) => {
          nav.addEventListener("click", bulmaNavDrop);
          nav.addEventListener("touchend", bulmaNavDrop);
        });
      };
      window.addEventListener("load", () => __async(exports, null, function* () {
        if (document.querySelector("#drawcanvases")) {
          const sense = new DrawEventHandler();
          sense.init();
        }
        const body = document.querySelector("body");
        body.addEventListener("touchstart", (e) => {
          e.preventDefault();
        }, { passive: false });
        initBulmaNavDrop();
      }));
    }
  });
  require_app();
})();
/*!
* sweetalert2 v11.4.26
* Released under the MIT License.
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhdy50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9QYXBlckVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd01pbmUudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd090aGVyLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvTW91c2VTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL3NlbnNvci9Qb2ludGVyU2Vuc29yLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvVG91Y2hTZW5zb3IudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy91L3UudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3RvSW50ZWdlci9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vdG9EYXRlL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vYWRkTWlsbGlzZWNvbmRzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9kZWZhdWx0T3B0aW9ucy9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZ2V0VGltZXpvbmVPZmZzZXRJbk1pbGxpc2Vjb25kcy9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2NvbnN0YW50cy9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2lzRGF0ZS9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2lzVmFsaWQvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9zdWJNaWxsaXNlY29uZHMvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0RheU9mWWVhci9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ0lTT1dlZWsvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9zdGFydE9mVVRDSVNPV2Vla1llYXIvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0lTT1dlZWsvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3N0YXJ0T2ZVVENXZWVrL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENXZWVrWWVhci9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvc3RhcnRPZlVUQ1dlZWtZZWFyL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENXZWVrL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9hZGRMZWFkaW5nWmVyb3MvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2Zvcm1hdC9saWdodEZvcm1hdHRlcnMvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2Zvcm1hdC9mb3JtYXR0ZXJzL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9mb3JtYXQvbG9uZ0Zvcm1hdHRlcnMvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3Byb3RlY3RlZFRva2Vucy9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2Zvcm1hdERpc3RhbmNlL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vbG9jYWxlL19saWIvYnVpbGRGb3JtYXRMb25nRm4vaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9mb3JtYXRMb25nL2luZGV4LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vbG9jYWxlL2VuLVVTL19saWIvZm9ybWF0UmVsYXRpdmUvaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvX2xpYi9idWlsZExvY2FsaXplRm4vaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9sb2NhbGl6ZS9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTWF0Y2hGbi9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTWF0Y2hQYXR0ZXJuRm4vaW5kZXguanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9tYXRjaC9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZGVmYXVsdExvY2FsZS9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2Zvcm1hdC9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2luZGV4LmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L1NhdmVFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9hY3Rpb24vTG9hZEFjdGlvbi50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9Mb2FkRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9EcmF3Y2FudmFzZXNFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9kYXRhL0RyYXdTdGF0dXMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JmZGMvaW5kZXguanMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9QZW5BY3Rpb24udHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvVW5kb0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L1pvb21FbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0VyYXNlckVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvQ29sb3JFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L1RoaWNrRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9CYWNrRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvRHJhd0V2ZW50SGFuZGxlci50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgRHJhdyB7XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzOiBTdHJva2VbXTtcbiAgICBwcml2YXRlIGNyZWF0ZWRfYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBwdXNoKHA6IFN0cm9rZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnMucHVzaChwKTtcbiAgICB9XG4gICAgcHVibGljIHBvcCgpOiBTdHJva2UgfCBudWxsIHtcbiAgICAgICAgY29uc3QgcmV0OiBTdHJva2UgfCBudWxsID0gdGhpcy5zLnBvcCgpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgcGVlaygpOiBTdHJva2UgfCBudWxsIHtcbiAgICAgICAgY29uc3QgcmV0OiBTdHJva2UgfCBudWxsID0gdGhpcy5zLmxlbmd0aCA+IDAgPyB0aGlzLnNbdGhpcy5zLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnMgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIGdldFN0cm9rZXMoKTogU3Ryb2tlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zO1xuICAgIH1cbiAgICBwdWJsaWMgbGFzdFN0cm9rZXMoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc1t0aGlzLnMubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5zKSB7XG4gICAgICAgICAgICByZXQucHVzaChwLmpzb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBbJHtyZXQuam9pbihcIixcIil9XWA7XG4gICAgfVxuICAgIHB1YmxpYyBwYXJzZShzdHJva2VzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdDpTdHJva2VPcHRpb24gPSBuZXcgU3Ryb2tlT3B0aW9uKHNbMF1bMF0sIHNbMF1bMV0pO1xuICAgICAgICAgICAgY29uc3QgdG1wID0gbmV3IFN0cm9rZShvcHQpO1xuICAgICAgICAgICAgdG1wLnBhcnNlKHNbMV0pO1xuICAgICAgICAgICAgdGhpcy5zLnB1c2godG1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnMubGVuZ3RoO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0Q3JlYXRlZEF0KGNyZWF0ZWRfYXQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0ZWRfYXQgPSBjcmVhdGVkX2F0O1xuICAgIH1cbiAgICBwdWJsaWMgc2V0SWQoaWQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxuICAgIHB1YmxpYyBpc09sZGVyKGRyYXc6IERyYXcpOiBudW1iZXIge1xuICAgICAgICBpZih0aGlzLmlkID4gZHJhdy5pZCl7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZih0aGlzLmlkIDwgZHJhdy5pZCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpc05ld2VyKGRyYXc6IERyYXcpOiBudW1iZXIge1xuICAgICAgICBpZih0aGlzLmlkID4gZHJhdy5pZCl7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuaWQgPCBkcmF3LmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cm9rZU9wdGlvbiB7XG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmc7IC8vIFx1NkQ4OFx1MzA1N1x1MzBCNFx1MzBFMFx1MzA2RVx1NTgzNFx1NTQwOFx1MzA2RmVcdTMwNkVcdTMwN0ZcbiAgICBwdWJsaWMgdGhpY2s6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcsIHRoaWNrOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnRoaWNrID0gdGhpY2s7XG4gICAgfVxuICAgIHVwZGF0ZShvcHQ6IFN0cm9rZU9wdGlvbikge1xuICAgICAgICB0aGlzLmNvbG9yID0gb3B0LmNvbG9yO1xuICAgICAgICB0aGlzLnRoaWNrID0gb3B0LnRoaWNrO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cm9rZSB7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUS19FUkFTRVIgPSBcImVcIjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3B0OiBTdHJva2VPcHRpb247XG4gICAgcHJpdmF0ZSBwOiBQb2ludFtdO1xuICAgIGNvbnN0cnVjdG9yKG9wdDogU3Ryb2tlT3B0aW9uKSB7XG4gICAgICAgIHRoaXMucCA9IFtdO1xuICAgICAgICB0aGlzLm9wdCA9IG5ldyBTdHJva2VPcHRpb24oXCJcIiwgMCk7XG4gICAgICAgIHRoaXMub3B0LnVwZGF0ZShvcHQpO1xuICAgIH1cbiAgICBwdWJsaWMgcHVzaChwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICB0aGlzLnAucHVzaChwKTtcbiAgICB9XG4gICAgcHVibGljIGdldFBvaW50cygpOiBQb2ludFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucDtcbiAgICB9XG4gICAgcHVibGljIGxhc3RQb2ludCgpOiBQb2ludCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5wLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wW3RoaXMucC5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucCA9IFtdO1xuICAgIH1cbiAgICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnAubGVuZ3RoO1xuICAgIH1cbiAgICBwdWJsaWMganNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnApIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHAuanNvbigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYFtbXCIke3RoaXMub3B0LmNvbG9yfVwiLFwiJHt0aGlzLm9wdC50aGlja31cIl0sWyR7cmV0LmpvaW4oXCIsXCIpfV1dYDtcbiAgICB9XG4gICAgcHVibGljIHBhcnNlKGFycjogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcnIpIHtcblxuICAgICAgICAgICAgY29uc3QgdG1wID0gbmV3IFBvaW50KHBhcnNlSW50KGFbMF0pLCBwYXJzZUludChhWzFdKSk7XG4gICAgICAgICAgICB0aGlzLnAucHVzaCh0bXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBpc0VyYXNlcigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5vcHQuY29sb3IgPT09IFN0cm9rZS5US19FUkFTRVI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBpc1BlbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRXJhc2VyKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHB1YmxpYyB4OiBudW1iZXI7XG4gICAgcHVibGljIHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBwdWJsaWMganNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXQgPSBgWyR7dGhpcy54fSwke3RoaXMueX1dYDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIGlzU2FtZSh4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBjb25kMTogYm9vbGVhbiA9IHggPT09IHRoaXMueDtcbiAgICAgICAgY29uc3QgY29uZDI6IGJvb2xlYW4gPSB5ID09PSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBjb25kMSAmJiBjb25kMjtcbiAgICB9XG59XG4iLCAiXG5leHBvcnQgY2xhc3MgUGFwZXJFbGVtZW50IHtcbiAgICBwcml2YXRlIGNudjogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU1pbmUoKTogUGFwZXJFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXBlckVsZW1lbnQoXCIjbXljYW52YXNcIik7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU90aGVyKCk6IFBhcGVyRWxlbWVudCB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXJFbGVtZW50KFwiI290aGVyY2FudmFzXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNudi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEN0eCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRDbnYoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jbnY7XG4gICAgfVxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdzogbnVtYmVyID0gdGhpcy5jbnYud2lkdGg7XG4gICAgICAgIGNvbnN0IGg6IG51bWJlciA9IHRoaXMuY252LmhlaWdodDtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3LCBTdHJva2UsIFBvaW50LCBTdHJva2VPcHRpb24gfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1BlbkFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd01pbmUge1xuICAgIHByaXZhdGUgZHJhdzogRHJhdztcbiAgICBwcml2YXRlIG5vd3N0cm9rZTogU3Ryb2tlO1xuICAgIHByaXZhdGUgdXNlcl9pZDogc3RyaW5nIHwgbnVsbDtcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwcml2YXRlIHNhdmVkU3Ryb2tlOiBTdHJva2UgfCBudWxsOyAvLyBcdTRGRERcdTVCNThcdTMwNTdcdTMwNUZcdTMwNjhcdTMwNERcdTMwNkVzdHJva2VcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xuICAgICAgICB0aGlzLnVzZXJfaWQgPSBudWxsO1xuICAgICAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGNvbnN0IHBhcGVyX2lkOiBudW1iZXIgPSBwYXJzZUludCh1cmxzW3VybHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnBhcGVyX2lkID0gcGFwZXJfaWQ7XG4gICAgICAgIHRoaXMuc2F2ZWRTdHJva2UgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgICAgICB0aGlzLm5vd3N0cm9rZSA9IG5ldyBTdHJva2UobmV3IFN0cm9rZU9wdGlvbih0aGlzLnBlbi5vcHQuY29sb3IsIHRoaXMucGVuLm9wdC50aGljaykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXNoUG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcCA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgdGhpcy5ub3dzdHJva2UucHVzaChwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdFBvaW50KCk6IFBvaW50IHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3N0cm9rZS5sYXN0UG9pbnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRTdHJva2UoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NkIyMVx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2NnN0cm9rZVx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlxuICAgICAgICB0aGlzLm5vd3N0cm9rZSA9IG5ldyBTdHJva2UodGhpcy5wZW4ub3B0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kU3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICAvLyBTdHJva2VcdTMwNENcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdkcmF3XHUzMDZCXHUzMEQ3XHUzMEMzXHUzMEI3XHUzMEU1XG4gICAgICAgIGlmICh0aGlzLm5vd3N0cm9rZS5sZW5ndGgoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhdy5wdXNoKHRoaXMubm93c3Ryb2tlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgc2F2ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgY29uc3QgdXJsID0gYC9hcGkvZHJhdy8ke3BhcGVyX2lkfWA7XG4gICAgICAgIGNvbnN0IHBvc3RkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIHBvc3RkYXRhLmFwcGVuZChcImpzb25fZHJhd1wiLCB0aGlzLmRyYXcuanNvbigpKTtcbiAgICAgICAgcG9zdGRhdGEuYXBwZW5kKFwidXNlcl9pZFwiLCA8c3RyaW5nPnRoaXMudXNlcl9pZCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbjogUmVxdWVzdEluaXQgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogcG9zdGRhdGEsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdGlvbik7XG4gICAgICAgIGNvbnN0IHJlc19zYXZlID0gSlNPTi5wYXJzZShhd2FpdCByZXNwb25zZS50ZXh0KCkpO1xuICAgICAgICBpZiAodGhpcy51c2VyX2lkID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJfaWQgPSByZXNfc2F2ZS51c2VyX2lkLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zYXZlZFN0cm9rZSA9IHRoaXMuZHJhdy5wZWVrKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERyYXcoKTogRHJhdyB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyYXc7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmRyYXcuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5kbygpOiBTdHJva2VbXSB7XG4gICAgICAgIHRoaXMuZHJhdy5nZXRTdHJva2VzKCkucG9wKCk7XG4gICAgICAgIGNvbnN0IHJldCA9IHRoaXMuZHJhdy5nZXRTdHJva2VzKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE5vd1N0cm9rZSgpOiBTdHJva2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3dzdHJva2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXHU0RkREXHU1QjU4XHUzMDU3XHUzMDVGXHUzMEI5XHUzMEM4XHUzMEVEXHUzMEZDXHUzMEFGXHU2NTcwXHUzMDRDXHU2QjYzXHUzMDU3XHUzMDUxXHUzMDhDXHUzMDcwXHU0RkREXHU1QjU4XHU2RTA4XHUzMDdGXHUzMDAyXHU1ODk3XHUzMDQ4XHUzMDhCXHUzMDcwXHUzMDRCXHUzMDhBXHUzMDY3XHUzMDZGXHUzMDZBXHUzMDRGXHUzMDAxdW5kb1x1MzA2N1x1NkUxQlx1MzA4Qlx1NTgzNFx1NTQwOFx1MzA4Mlx1MzA0Mlx1MzA4QVx1MzAwMlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1NhdmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByZXQ6IGJvb2xlYW4gPSB0aGlzLnNhdmVkU3Ryb2tlID09PSB0aGlzLmRyYXcucGVlaygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3LCBTdHJva2UsIFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIERyYXdPdGhlciB7XG4gICAgcHJpdmF0ZSBkcmF3czogRHJhd1tdOyAvLyBcdTgxRUFcdTUyMDZcdTRFRTVcdTU5MTZcdUZGMURcdTg5MDdcdTY1NzBcdTRFQkFcdTMwNkVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwNENcdTMwNDJcdTMwOEJcdTMwNUZcdTMwODFcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXIgfCBudWxsO1xuICAgIHByaXZhdGUgYWZ0ZXJfcGFwZXJfaWQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRyYXdzID0gW107XG4gICAgICAgIHRoaXMudXNlcl9pZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYWZ0ZXJfcGFwZXJfaWQgPSAwO1xuICAgICAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGNvbnN0IHBhcGVyX2lkOiBudW1iZXIgPSBwYXJzZUludCh1cmxzW3VybHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnBhcGVyX2lkID0gcGFwZXJfaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGxldCB1cmwgPSBcIlwiO1xuICAgICAgICBpZih0aGlzLnVzZXJfaWQpIHtcbiAgICAgICAgICAgIC8vIHVzZXJfaWRcdTMwNkVcdTYzMDdcdTVCOUFcdTMwNENcdTMwNDJcdTMwOENcdTMwNzBcdTgxRUFcdTUyMDZcdTRFRTVcdTU5MTZcdTMwMDJcbiAgICAgICAgICAgIHVybCA9IGAvYXBpL2RyYXcvJHt0aGlzLnBhcGVyX2lkfS9vdGhlcnMvJHt0aGlzLnVzZXJfaWR9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZXJfaWRcbiAgICAgICAgICAgIHVybCA9IGAvYXBpL2RyYXcvJHt0aGlzLnBhcGVyX2lkfS9hZnRlci97JHt0aGlzLmFmdGVyX3BhcGVyX2lkfWA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgICAgIC8vIFx1NEUwMFx1NjVFNlx1N0E3QVx1MzA2Qlx1MzA1N1x1MzA2Nlx1NjgzQ1x1N0QwRFx1MzA1N1x1NzZGNFx1MzA1N1xuICAgICAgICB0aGlzLmRyYXdzLnNwbGljZSgwLCB0aGlzLmRyYXdzLmxlbmd0aCk7XG4gICAgICAgIGZvcihjb25zdCBkIG9mIEpTT04ucGFyc2UodGV4dCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZC5qc29uX2RyYXcpO1xuICAgICAgICAgICAgY29uc3QgZHJhdyA9IG5ldyBEcmF3KCk7XG4gICAgICAgICAgICBkcmF3LnBhcnNlKG9iaik7XG4gICAgICAgICAgICBkcmF3LnNldENyZWF0ZWRBdChkLmNyZWF0ZWRfYXQpO1xuICAgICAgICAgICAgZHJhdy5zZXRJZChkLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd3MucHVzaChkcmF3KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFx1NjVFNVx1NEVEOFx1OTgwNlx1MzA2N1x1MzBCRFx1MzBGQ1x1MzBDOFx1MzAwMmpzb25cdTMwNkZcdTk4MDZcdTc1NkFcdTMwNENcdTRGRERcdThBM0NcdTMwNTVcdTMwOENcdTMwNkFcdTMwNDRcdTMwMDJcbiAgICAgICAgdGhpcy5kcmF3cyA9IHRoaXMuZHJhd3Muc29ydCgoYTogRHJhdywgYjogRHJhdykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuaXNOZXdlcihiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGFmdGVyXHU3NTI4XHUzMDZCaWRcdTMwOTJcdTRGRERcdTVCNThcbiAgICAgICAgaWYodGhpcy5kcmF3cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmFmdGVyX3BhcGVyX2lkID0gdGhpcy5kcmF3c1t0aGlzLmRyYXdzLmxlbmd0aCAtIDFdLmlkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldERyYXdzKCk6IERyYXdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdzO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4uL0RyYXdFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5cbmV4cG9ydCBjbGFzcyBNb3VzZVNlbnNvciB7XG4gICAgcHJpdmF0ZSBzZW5zZTogRHJhd0V2ZW50SGFuZGxlcjtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNldXBcIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZWRvd25cIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS5kb3duKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNlbW92ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLm1vdmUoXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2VsZWF2ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVEZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHAoZTogTW91c2VFdmVudCk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFBvaW50ZXJTZW5zb3Ige1xuICAgIHByaXZhdGUgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXI7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzaGFuZGxlcnM6ICgoZTogVG91Y2hFdmVudCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gICAgcHVibGljIGluaXQoc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5zZSA9IHNlbnNlO1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVydXBcIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcmRvd25cIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVybW92ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJsZWF2ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuYWRkRGVmYXVsdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHAoZSk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuZXhwb3J0IGNsYXNzIFRvdWNoU2Vuc29yIHtcbiAgICBwcml2YXRlIHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCwgem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsID0gem9vbXNjcm9sbDtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNoZW5kXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2hzdGFydFwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2htb3ZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaGxlYXZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGREZWZhdWx0TGlzdGVuZXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZURlZmF1bHRMaXN0ZW5lcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwKGU6IFRvdWNoRXZlbnQpOiBQb2ludCB7XG4gICAgICAgIGNvbnN0IGN0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXVxuICAgICAgICBjb25zdCBiYyA9ICg8SFRNTENhbnZhc0VsZW1lbnQ+ZS50YXJnZXQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB4ID0gY3QuY2xpZW50WCAtIGJjLmxlZnQ7XG4gICAgICAgIGNvbnN0IHkgPSBjdC5jbGllbnRZIC0gYmMudG9wO1xuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkV6b29tXHU0RjREXHU3RjZFXHUzMDZFXHU4OERDXHU2QjYzXHUzMDRDXHUzMDRCXHUzMDRCXHUzMDg5XHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU4QUJGXHU2NTc0XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCAvIHRoaXMuem9vbXNjcm9sbC5nZXRab29tKCksIHkgLyB0aGlzLnpvb21zY3JvbGwuZ2V0Wm9vbSgpKTtcbiAgICB9XG59XG4iLCAiLyohXG4qIHN3ZWV0YWxlcnQyIHYxMS40LjI2XG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLlN3ZWV0YWxlcnQyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgY29uc3QgY29uc29sZVByZWZpeCA9ICdTd2VldEFsZXJ0MjonO1xuICAvKipcbiAgICogRmlsdGVyIHRoZSB1bmlxdWUgdmFsdWVzIGludG8gYSBuZXcgYXJyYXlcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG5cbiAgY29uc3QgdW5pcXVlQXJyYXkgPSBhcnIgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihhcnJbaV0pID09PSAtMSkge1xuICAgICAgICByZXN1bHQucHVzaChhcnJbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuICBjb25zdCBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBzdHIgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAvKipcbiAgICogU3RhbmRhcmRpemUgY29uc29sZSB3YXJuaW5nc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEFycmF5fSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IHdhcm4gPSBtZXNzYWdlID0+IHtcbiAgICBjb25zb2xlLndhcm4oXCJcIi5jb25jYXQoY29uc29sZVByZWZpeCwgXCIgXCIpLmNvbmNhdCh0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCcgPyBtZXNzYWdlLmpvaW4oJyAnKSA6IG1lc3NhZ2UpKTtcbiAgfTtcbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgZXJyb3JzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IGVycm9yID0gbWVzc2FnZSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihcIlwiLmNvbmNhdChjb25zb2xlUHJlZml4LCBcIiBcIikuY29uY2F0KG1lc3NhZ2UpKTtcbiAgfTtcbiAgLyoqXG4gICAqIFByaXZhdGUgZ2xvYmFsIHN0YXRlIGZvciBgd2Fybk9uY2VgXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgY29uc3QgcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzID0gW107XG4gIC8qKlxuICAgKiBTaG93IGEgY29uc29sZSB3YXJuaW5nLCBidXQgb25seSBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNob3duXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IHdhcm5PbmNlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKCFwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMuaW5jbHVkZXMobWVzc2FnZSkpIHtcbiAgICAgIHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgd2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBTaG93IGEgb25lLXRpbWUgY29uc29sZSB3YXJuaW5nIGFib3V0IGRlcHJlY2F0ZWQgcGFyYW1zL21ldGhvZHNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlcHJlY2F0ZWRQYXJhbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlSW5zdGVhZFxuICAgKi9cblxuICBjb25zdCB3YXJuQWJvdXREZXByZWNhdGlvbiA9IChkZXByZWNhdGVkUGFyYW0sIHVzZUluc3RlYWQpID0+IHtcbiAgICB3YXJuT25jZShcIlxcXCJcIi5jb25jYXQoZGVwcmVjYXRlZFBhcmFtLCBcIlxcXCIgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuIFBsZWFzZSB1c2UgXFxcIlwiKS5jb25jYXQodXNlSW5zdGVhZCwgXCJcXFwiIGluc3RlYWQuXCIpKTtcbiAgfTtcbiAgLyoqXG4gICAqIElmIGBhcmdgIGlzIGEgZnVuY3Rpb24sIGNhbGwgaXQgKHdpdGggbm8gYXJndW1lbnRzIG9yIGNvbnRleHQpIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAgICogT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbiB8IGFueX0gYXJnXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuXG4gIGNvbnN0IGNhbGxJZkZ1bmN0aW9uID0gYXJnID0+IHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbicgPyBhcmcoKSA6IGFyZztcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc1RvUHJvbWlzZUZuID0gYXJnID0+IGFyZyAmJiB0eXBlb2YgYXJnLnRvUHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJztcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuXG4gIGNvbnN0IGFzUHJvbWlzZSA9IGFyZyA9PiBoYXNUb1Byb21pc2VGbihhcmcpID8gYXJnLnRvUHJvbWlzZSgpIDogUHJvbWlzZS5yZXNvbHZlKGFyZyk7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1Byb21pc2UgPSBhcmcgPT4gYXJnICYmIFByb21pc2UucmVzb2x2ZShhcmcpID09PSBhcmc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG5cbiAgY29uc3QgZ2V0UmFuZG9tRWxlbWVudCA9IGFyciA9PiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuXG4gIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgdGl0bGU6ICcnLFxuICAgIHRpdGxlVGV4dDogJycsXG4gICAgdGV4dDogJycsXG4gICAgaHRtbDogJycsXG4gICAgZm9vdGVyOiAnJyxcbiAgICBpY29uOiB1bmRlZmluZWQsXG4gICAgaWNvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgaWNvbkh0bWw6IHVuZGVmaW5lZCxcbiAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLFxuICAgIHRvYXN0OiBmYWxzZSxcbiAgICBzaG93Q2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItc2hvdycsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLXNob3cnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24tc2hvdydcbiAgICB9LFxuICAgIGhpZGVDbGFzczoge1xuICAgICAgcG9wdXA6ICdzd2FsMi1oaWRlJyxcbiAgICAgIGJhY2tkcm9wOiAnc3dhbDItYmFja2Ryb3AtaGlkZScsXG4gICAgICBpY29uOiAnc3dhbDItaWNvbi1oaWRlJ1xuICAgIH0sXG4gICAgY3VzdG9tQ2xhc3M6IHt9LFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGNvbG9yOiB1bmRlZmluZWQsXG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAgaGVpZ2h0QXV0bzogdHJ1ZSxcbiAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICBhbGxvd0VzY2FwZUtleTogdHJ1ZSxcbiAgICBhbGxvd0VudGVyS2V5OiB0cnVlLFxuICAgIHN0b3BLZXlkb3duUHJvcGFnYXRpb246IHRydWUsXG4gICAga2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTogZmFsc2UsXG4gICAgc2hvd0NvbmZpcm1CdXR0b246IHRydWUsXG4gICAgc2hvd0RlbnlCdXR0b246IGZhbHNlLFxuICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgIHByZUNvbmZpcm06IHVuZGVmaW5lZCxcbiAgICBwcmVEZW55OiB1bmRlZmluZWQsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgY29uZmlybUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY29uZmlybUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgZGVueUJ1dHRvblRleHQ6ICdObycsXG4gICAgZGVueUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgZGVueUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCcsXG4gICAgY2FuY2VsQnV0dG9uQXJpYUxhYmVsOiAnJyxcbiAgICBjYW5jZWxCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGJ1dHRvbnNTdHlsaW5nOiB0cnVlLFxuICAgIHJldmVyc2VCdXR0b25zOiBmYWxzZSxcbiAgICBmb2N1c0NvbmZpcm06IHRydWUsXG4gICAgZm9jdXNEZW55OiBmYWxzZSxcbiAgICBmb2N1c0NhbmNlbDogZmFsc2UsXG4gICAgcmV0dXJuRm9jdXM6IHRydWUsXG4gICAgc2hvd0Nsb3NlQnV0dG9uOiBmYWxzZSxcbiAgICBjbG9zZUJ1dHRvbkh0bWw6ICcmdGltZXM7JyxcbiAgICBjbG9zZUJ1dHRvbkFyaWFMYWJlbDogJ0Nsb3NlIHRoaXMgZGlhbG9nJyxcbiAgICBsb2FkZXJIdG1sOiAnJyxcbiAgICBzaG93TG9hZGVyT25Db25maXJtOiBmYWxzZSxcbiAgICBzaG93TG9hZGVyT25EZW55OiBmYWxzZSxcbiAgICBpbWFnZVVybDogdW5kZWZpbmVkLFxuICAgIGltYWdlV2lkdGg6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUhlaWdodDogdW5kZWZpbmVkLFxuICAgIGltYWdlQWx0OiAnJyxcbiAgICB0aW1lcjogdW5kZWZpbmVkLFxuICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IGZhbHNlLFxuICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgcGFkZGluZzogdW5kZWZpbmVkLFxuICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgIGlucHV0UGxhY2Vob2xkZXI6ICcnLFxuICAgIGlucHV0TGFiZWw6ICcnLFxuICAgIGlucHV0VmFsdWU6ICcnLFxuICAgIGlucHV0T3B0aW9uczoge30sXG4gICAgaW5wdXRBdXRvVHJpbTogdHJ1ZSxcbiAgICBpbnB1dEF0dHJpYnV0ZXM6IHt9LFxuICAgIGlucHV0VmFsaWRhdG9yOiB1bmRlZmluZWQsXG4gICAgcmV0dXJuSW5wdXRWYWx1ZU9uRGVueTogZmFsc2UsXG4gICAgdmFsaWRhdGlvbk1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBncm93OiBmYWxzZSxcbiAgICBwb3NpdGlvbjogJ2NlbnRlcicsXG4gICAgcHJvZ3Jlc3NTdGVwczogW10sXG4gICAgY3VycmVudFByb2dyZXNzU3RlcDogdW5kZWZpbmVkLFxuICAgIHByb2dyZXNzU3RlcHNEaXN0YW5jZTogdW5kZWZpbmVkLFxuICAgIHdpbGxPcGVuOiB1bmRlZmluZWQsXG4gICAgZGlkT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZFJlbmRlcjogdW5kZWZpbmVkLFxuICAgIHdpbGxDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZENsb3NlOiB1bmRlZmluZWQsXG4gICAgZGlkRGVzdHJveTogdW5kZWZpbmVkLFxuICAgIHNjcm9sbGJhclBhZGRpbmc6IHRydWVcbiAgfTtcbiAgY29uc3QgdXBkYXRhYmxlUGFyYW1zID0gWydhbGxvd0VzY2FwZUtleScsICdhbGxvd091dHNpZGVDbGljaycsICdiYWNrZ3JvdW5kJywgJ2J1dHRvbnNTdHlsaW5nJywgJ2NhbmNlbEJ1dHRvbkFyaWFMYWJlbCcsICdjYW5jZWxCdXR0b25Db2xvcicsICdjYW5jZWxCdXR0b25UZXh0JywgJ2Nsb3NlQnV0dG9uQXJpYUxhYmVsJywgJ2Nsb3NlQnV0dG9uSHRtbCcsICdjb2xvcicsICdjb25maXJtQnV0dG9uQXJpYUxhYmVsJywgJ2NvbmZpcm1CdXR0b25Db2xvcicsICdjb25maXJtQnV0dG9uVGV4dCcsICdjdXJyZW50UHJvZ3Jlc3NTdGVwJywgJ2N1c3RvbUNsYXNzJywgJ2RlbnlCdXR0b25BcmlhTGFiZWwnLCAnZGVueUJ1dHRvbkNvbG9yJywgJ2RlbnlCdXR0b25UZXh0JywgJ2RpZENsb3NlJywgJ2RpZERlc3Ryb3knLCAnZm9vdGVyJywgJ2hpZGVDbGFzcycsICdodG1sJywgJ2ljb24nLCAnaWNvbkNvbG9yJywgJ2ljb25IdG1sJywgJ2ltYWdlQWx0JywgJ2ltYWdlSGVpZ2h0JywgJ2ltYWdlVXJsJywgJ2ltYWdlV2lkdGgnLCAncHJlQ29uZmlybScsICdwcmVEZW55JywgJ3Byb2dyZXNzU3RlcHMnLCAncmV0dXJuRm9jdXMnLCAncmV2ZXJzZUJ1dHRvbnMnLCAnc2hvd0NhbmNlbEJ1dHRvbicsICdzaG93Q2xvc2VCdXR0b24nLCAnc2hvd0NvbmZpcm1CdXR0b24nLCAnc2hvd0RlbnlCdXR0b24nLCAndGV4dCcsICd0aXRsZScsICd0aXRsZVRleHQnLCAnd2lsbENsb3NlJ107XG4gIGNvbnN0IGRlcHJlY2F0ZWRQYXJhbXMgPSB7fTtcbiAgY29uc3QgdG9hc3RJbmNvbXBhdGlibGVQYXJhbXMgPSBbJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2FsbG93RW50ZXJLZXknLCAnYmFja2Ryb3AnLCAnZm9jdXNDb25maXJtJywgJ2ZvY3VzRGVueScsICdmb2N1c0NhbmNlbCcsICdyZXR1cm5Gb2N1cycsICdoZWlnaHRBdXRvJywgJ2tleWRvd25MaXN0ZW5lckNhcHR1cmUnXTtcbiAgLyoqXG4gICAqIElzIHZhbGlkIHBhcmFtZXRlclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1ZhbGlkUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlZmF1bHRQYXJhbXMsIHBhcmFtTmFtZSk7XG4gIH07XG4gIC8qKlxuICAgKiBJcyB2YWxpZCBwYXJhbWV0ZXIgZm9yIFN3YWwudXBkYXRlKCkgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVXBkYXRhYmxlUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gdXBkYXRhYmxlUGFyYW1zLmluZGV4T2YocGFyYW1OYW1lKSAhPT0gLTE7XG4gIH07XG4gIC8qKlxuICAgKiBJcyBkZXByZWNhdGVkIHBhcmFtZXRlclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9XG4gICAqL1xuXG4gIGNvbnN0IGlzRGVwcmVjYXRlZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIGRlcHJlY2F0ZWRQYXJhbXNbcGFyYW1OYW1lXTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbVxuICAgKi9cblxuICBjb25zdCBjaGVja0lmUGFyYW1Jc1ZhbGlkID0gcGFyYW0gPT4ge1xuICAgIGlmICghaXNWYWxpZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm4oXCJVbmtub3duIHBhcmFtZXRlciBcXFwiXCIuY29uY2F0KHBhcmFtLCBcIlxcXCJcIikpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbVxuICAgKi9cblxuXG4gIGNvbnN0IGNoZWNrSWZUb2FzdFBhcmFtSXNWYWxpZCA9IHBhcmFtID0+IHtcbiAgICBpZiAodG9hc3RJbmNvbXBhdGlibGVQYXJhbXMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB3YXJuKFwiVGhlIHBhcmFtZXRlciBcXFwiXCIuY29uY2F0KHBhcmFtLCBcIlxcXCIgaXMgaW5jb21wYXRpYmxlIHdpdGggdG9hc3RzXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cblxuICBjb25zdCBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKGlzRGVwcmVjYXRlZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm5BYm91dERlcHJlY2F0aW9uKHBhcmFtLCBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBTaG93IHJlbGV2YW50IHdhcm5pbmdzIGZvciBnaXZlbiBwYXJhbXNcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYWNrZHJvcCAmJiBwYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spIHtcbiAgICAgIHdhcm4oJ1wiYWxsb3dPdXRzaWRlQ2xpY2tcIiBwYXJhbWV0ZXIgcmVxdWlyZXMgYGJhY2tkcm9wYCBwYXJhbWV0ZXIgdG8gYmUgc2V0IHRvIGB0cnVlYCcpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICBjaGVja0lmUGFyYW1Jc1ZhbGlkKHBhcmFtKTtcblxuICAgICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgICBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQocGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzd2FsUHJlZml4ID0gJ3N3YWwyLSc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBpdGVtc1xuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cblxuICBjb25zdCBwcmVmaXggPSBpdGVtcyA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gaXRlbXMpIHtcbiAgICAgIHJlc3VsdFtpdGVtc1tpXV0gPSBzd2FsUHJlZml4ICsgaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgY29uc3Qgc3dhbENsYXNzZXMgPSBwcmVmaXgoWydjb250YWluZXInLCAnc2hvd24nLCAnaGVpZ2h0LWF1dG8nLCAnaW9zZml4JywgJ3BvcHVwJywgJ21vZGFsJywgJ25vLWJhY2tkcm9wJywgJ25vLXRyYW5zaXRpb24nLCAndG9hc3QnLCAndG9hc3Qtc2hvd24nLCAnc2hvdycsICdoaWRlJywgJ2Nsb3NlJywgJ3RpdGxlJywgJ2h0bWwtY29udGFpbmVyJywgJ2FjdGlvbnMnLCAnY29uZmlybScsICdkZW55JywgJ2NhbmNlbCcsICdkZWZhdWx0LW91dGxpbmUnLCAnZm9vdGVyJywgJ2ljb24nLCAnaWNvbi1jb250ZW50JywgJ2ltYWdlJywgJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ2xhYmVsJywgJ3RleHRhcmVhJywgJ2lucHV0ZXJyb3InLCAnaW5wdXQtbGFiZWwnLCAndmFsaWRhdGlvbi1tZXNzYWdlJywgJ3Byb2dyZXNzLXN0ZXBzJywgJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAnLCAncHJvZ3Jlc3Mtc3RlcC1saW5lJywgJ2xvYWRlcicsICdsb2FkaW5nJywgJ3N0eWxlZCcsICd0b3AnLCAndG9wLXN0YXJ0JywgJ3RvcC1lbmQnLCAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2NlbnRlcicsICdjZW50ZXItc3RhcnQnLCAnY2VudGVyLWVuZCcsICdjZW50ZXItbGVmdCcsICdjZW50ZXItcmlnaHQnLCAnYm90dG9tJywgJ2JvdHRvbS1zdGFydCcsICdib3R0b20tZW5kJywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICdncm93LXJvdycsICdncm93LWNvbHVtbicsICdncm93LWZ1bGxzY3JlZW4nLCAncnRsJywgJ3RpbWVyLXByb2dyZXNzLWJhcicsICd0aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVyJywgJ3Njcm9sbGJhci1tZWFzdXJlJywgJ2ljb24tc3VjY2VzcycsICdpY29uLXdhcm5pbmcnLCAnaWNvbi1pbmZvJywgJ2ljb24tcXVlc3Rpb24nLCAnaWNvbi1lcnJvcicsICduby13YXInXSk7XG4gIGNvbnN0IGljb25UeXBlcyA9IHByZWZpeChbJ3N1Y2Nlc3MnLCAnd2FybmluZycsICdpbmZvJywgJ3F1ZXN0aW9uJywgJ2Vycm9yJ10pO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwb3B1cCBjb250YWluZXIgd2hpY2ggY29udGFpbnMgdGhlIGJhY2tkcm9wIGFuZCB0aGUgcG9wdXAgaXRzZWxmLlxuICAgKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDb250YWluZXIgPSAoKSA9PiBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmNvbnRhaW5lcikpO1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yU3RyaW5nXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGVsZW1lbnRCeVNlbGVjdG9yID0gc2VsZWN0b3JTdHJpbmcgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIHJldHVybiBjb250YWluZXIgPyBjb250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvclN0cmluZykgOiBudWxsO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBlbGVtZW50QnlDbGFzcyA9IGNsYXNzTmFtZSA9PiB7XG4gICAgcmV0dXJuIGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChjbGFzc05hbWUpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0UG9wdXAgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5wb3B1cCk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJY29uID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuaWNvbik7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRUaXRsZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLnRpdGxlKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEh0bWxDb250YWluZXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJbWFnZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmltYWdlKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldFByb2dyZXNzU3RlcHMgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcHMnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRWYWxpZGF0aW9uTWVzc2FnZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDb25maXJtQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbmZpcm0pKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldERlbnlCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZGVueSkpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW5wdXRMYWJlbCA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydpbnB1dC1sYWJlbCddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldExvYWRlciA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5sb2FkZXIpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENhbmNlbEJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jYW5jZWwpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEFjdGlvbnMgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5hY3Rpb25zKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEZvb3RlciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmZvb3Rlcik7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRUaW1lclByb2dyZXNzQmFyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhciddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENsb3NlQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuY2xvc2UpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vamt1cC9mb2N1c2FibGUvYmxvYi9tYXN0ZXIvaW5kZXguanNcblxuICBjb25zdCBmb2N1c2FibGUgPSBcIlxcbiAgYVtocmVmXSxcXG4gIGFyZWFbaHJlZl0sXFxuICBpbnB1dDpub3QoW2Rpc2FibGVkXSksXFxuICBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLFxcbiAgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLFxcbiAgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSxcXG4gIGlmcmFtZSxcXG4gIG9iamVjdCxcXG4gIGVtYmVkLFxcbiAgW3RhYmluZGV4PVxcXCIwXFxcIl0sXFxuICBbY29udGVudGVkaXRhYmxlXSxcXG4gIGF1ZGlvW2NvbnRyb2xzXSxcXG4gIHZpZGVvW2NvbnRyb2xzXSxcXG4gIHN1bW1hcnlcXG5cIjtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgKi9cblxuICBjb25zdCBnZXRGb2N1c2FibGVFbGVtZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleCA9IEFycmF5LmZyb20oZ2V0UG9wdXAoKS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFt0YWJpbmRleD1cIjBcIl0pJykpIC8vIHNvcnQgYWNjb3JkaW5nIHRvIHRhYmluZGV4XG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IHRhYmluZGV4QSA9IHBhcnNlSW50KGEuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgIGNvbnN0IHRhYmluZGV4QiA9IHBhcnNlSW50KGIuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKTtcblxuICAgICAgaWYgKHRhYmluZGV4QSA+IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSBpZiAodGFiaW5kZXhBIDwgdGFiaW5kZXhCKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgY29uc3Qgb3RoZXJGb2N1c2FibGVFbGVtZW50cyA9IEFycmF5LmZyb20oZ2V0UG9wdXAoKS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZSkpLmZpbHRlcihlbCA9PiBlbC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgIT09ICctMScpO1xuICAgIHJldHVybiB1bmlxdWVBcnJheShmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleC5jb25jYXQob3RoZXJGb2N1c2FibGVFbGVtZW50cykpLmZpbHRlcihlbCA9PiBpc1Zpc2libGUoZWwpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc01vZGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5zaG93bikgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKSAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10pO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVG9hc3QgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdldFBvcHVwKCkgJiYgaGFzQ2xhc3MoZ2V0UG9wdXAoKSwgc3dhbENsYXNzZXMudG9hc3QpO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzTG9hZGluZyA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2V0UG9wdXAoKS5oYXNBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycpO1xuICB9O1xuXG4gIGNvbnN0IHN0YXRlcyA9IHtcbiAgICBwcmV2aW91c0JvZHlQYWRkaW5nOiBudWxsXG4gIH07XG4gIC8qKlxuICAgKiBTZWN1cmVseSBzZXQgaW5uZXJIVE1MIG9mIGFuIGVsZW1lbnRcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xOTI2XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICovXG5cbiAgY29uc3Qgc2V0SW5uZXJIdG1sID0gKGVsZW0sIGh0bWwpID0+IHtcbiAgICBlbGVtLnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAoaHRtbCkge1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKTtcbiAgICAgIEFycmF5LmZyb20ocGFyc2VkLnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9KTtcbiAgICAgIEFycmF5LmZyb20ocGFyc2VkLnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc0NsYXNzID0gKGVsZW0sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NMaXN0ID0gY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc0xpc3RbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUN1c3RvbUNsYXNzZXMgPSAoZWxlbSwgcGFyYW1zKSA9PiB7XG4gICAgQXJyYXkuZnJvbShlbGVtLmNsYXNzTGlzdCkuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKCFPYmplY3QudmFsdWVzKHN3YWxDbGFzc2VzKS5pbmNsdWRlcyhjbGFzc05hbWUpICYmICFPYmplY3QudmFsdWVzKGljb25UeXBlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhwYXJhbXMuc2hvd0NsYXNzKS5pbmNsdWRlcyhjbGFzc05hbWUpKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKi9cblxuXG4gIGNvbnN0IGFwcGx5Q3VzdG9tQ2xhc3MgPSAoZWxlbSwgcGFyYW1zLCBjbGFzc05hbWUpID0+IHtcbiAgICByZW1vdmVDdXN0b21DbGFzc2VzKGVsZW0sIHBhcmFtcyk7XG5cbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdKSB7XG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdICE9PSAnc3RyaW5nJyAmJiAhcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0uZm9yRWFjaCkge1xuICAgICAgICByZXR1cm4gd2FybihcIkludmFsaWQgdHlwZSBvZiBjdXN0b21DbGFzcy5cIi5jb25jYXQoY2xhc3NOYW1lLCBcIiEgRXhwZWN0ZWQgc3RyaW5nIG9yIGl0ZXJhYmxlIG9iamVjdCwgZ290IFxcXCJcIikuY29uY2F0KHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSwgXCJcXFwiXCIpKTtcbiAgICAgIH1cblxuICAgICAgYWRkQ2xhc3MoZWxlbSwgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL3JlbmRlcmVycy9yZW5kZXJJbnB1dCcpLklucHV0Q2xhc3N9IGlucHV0Q2xhc3NcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJbnB1dCA9IChwb3B1cCwgaW5wdXRDbGFzcykgPT4ge1xuICAgIGlmICghaW5wdXRDbGFzcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3dpdGNoIChpbnB1dENsYXNzKSB7XG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXSkpO1xuXG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCIgaW5wdXRcIikpO1xuXG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCIgaW5wdXQ6Y2hlY2tlZFwiKSkgfHwgcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiIGlucHV0OmZpcnN0LWNoaWxkXCIpKTtcblxuICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmlucHV0KSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50fSBpbnB1dFxuICAgKi9cblxuICBjb25zdCBmb2N1c0lucHV0ID0gaW5wdXQgPT4ge1xuICAgIGlucHV0LmZvY3VzKCk7IC8vIHBsYWNlIGN1cnNvciBhdCBlbmQgb2YgdGV4dCBpbiB0ZXh0IGlucHV0XG5cbiAgICBpZiAoaW5wdXQudHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMzQ1OTE1XG4gICAgICBjb25zdCB2YWwgPSBpbnB1dC52YWx1ZTtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICBpbnB1dC52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvblxuICAgKi9cblxuICBjb25zdCB0b2dnbGVDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCwgY29uZGl0aW9uKSA9PiB7XG4gICAgaWYgKCF0YXJnZXQgfHwgIWNsYXNzTGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2xhc3NMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgY2xhc3NMaXN0ID0gY2xhc3NMaXN0LnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cblxuICAgIGNsYXNzTGlzdC5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldC5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgIGNvbmRpdGlvbiA/IGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZGl0aW9uID8gdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKi9cblxuICBjb25zdCBhZGRDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCkgPT4ge1xuICAgIHRvZ2dsZUNsYXNzKHRhcmdldCwgY2xhc3NMaXN0LCB0cnVlKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgbnVsbH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCByZWFkb25seSBzdHJpbmdbXX0gY2xhc3NMaXN0XG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUNsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0KSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIGZhbHNlKTtcbiAgfTtcbiAgLyoqXG4gICAqIEdldCBkaXJlY3QgY2hpbGQgb2YgYW4gZWxlbWVudCBieSBjbGFzcyBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MgPSAoZWxlbSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsZW0uY2hpbGRyZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaGFzQ2xhc3MoY2hpbGQsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG5cbiAgY29uc3QgYXBwbHlOdW1lcmljYWxTdHlsZSA9IChlbGVtLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IFwiXCIuY29uY2F0KHBhcnNlSW50KHZhbHVlKSkpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSB8fCBwYXJzZUludCh2YWx1ZSkgPT09IDApIHtcbiAgICAgIGVsZW0uc3R5bGVbcHJvcGVydHldID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KHZhbHVlLCBcInB4XCIpIDogdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcGVydHkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpc3BsYXlcbiAgICovXG5cbiAgY29uc3Qgc2hvdyA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdmbGV4JztcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKi9cblxuICBjb25zdCBoaWRlID0gZWxlbSA9PiB7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAqL1xuXG4gIGNvbnN0IHNldFN0eWxlID0gKHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZSkgPT4ge1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgY29uc3QgZWwgPSBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHthbnl9IGNvbmRpdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlzcGxheVxuICAgKi9cblxuICBjb25zdCB0b2dnbGUgPSBmdW5jdGlvbiAoZWxlbSwgY29uZGl0aW9uKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdmbGV4JztcbiAgICBjb25kaXRpb24gPyBzaG93KGVsZW0sIGRpc3BsYXkpIDogaGlkZShlbGVtKTtcbiAgfTtcbiAgLyoqXG4gICAqIGJvcnJvd2VkIGZyb20ganF1ZXJ5ICQoZWxlbSkuaXMoJzp2aXNpYmxlJykgaW1wbGVtZW50YXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNWaXNpYmxlID0gZWxlbSA9PiAhIShlbGVtICYmIChlbGVtLm9mZnNldFdpZHRoIHx8IGVsZW0ub2Zmc2V0SGVpZ2h0IHx8IGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBhbGxCdXR0b25zQXJlSGlkZGVuID0gKCkgPT4gIWlzVmlzaWJsZShnZXRDb25maXJtQnV0dG9uKCkpICYmICFpc1Zpc2libGUoZ2V0RGVueUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlKGdldENhbmNlbEJ1dHRvbigpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1Njcm9sbGFibGUgPSBlbGVtID0+ICEhKGVsZW0uc2Nyb2xsSGVpZ2h0ID4gZWxlbS5jbGllbnRIZWlnaHQpO1xuICAvKipcbiAgICogYm9ycm93ZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDYzNTIxMTlcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaGFzQ3NzQW5pbWF0aW9uID0gZWxlbSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICBjb25zdCBhbmltRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1kdXJhdGlvbicpIHx8ICcwJyk7XG4gICAgY29uc3QgdHJhbnNEdXJhdGlvbiA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNpdGlvbi1kdXJhdGlvbicpIHx8ICcwJyk7XG4gICAgcmV0dXJuIGFuaW1EdXJhdGlvbiA+IDAgfHwgdHJhbnNEdXJhdGlvbiA+IDA7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXNldFxuICAgKi9cblxuICBjb25zdCBhbmltYXRlVGltZXJQcm9ncmVzc0JhciA9IGZ1bmN0aW9uICh0aW1lcikge1xuICAgIGxldCByZXNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcblxuICAgIGlmIChpc1Zpc2libGUodGltZXJQcm9ncmVzc0JhcikpIHtcbiAgICAgIGlmIChyZXNldCkge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSBcIndpZHRoIFwiLmNvbmNhdCh0aW1lciAvIDEwMDAsIFwicyBsaW5lYXJcIik7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMCUnO1xuICAgICAgfSwgMTApO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc3RvcFRpbWVyUHJvZ3Jlc3NCYXIgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbicpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhckZ1bGxXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRpbWVyUHJvZ3Jlc3NCYXIpLndpZHRoKTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyUGVyY2VudCA9IHRpbWVyUHJvZ3Jlc3NCYXJXaWR0aCAvIHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggKiAxMDA7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbicpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIlwiLmNvbmNhdCh0aW1lclByb2dyZXNzQmFyUGVyY2VudCwgXCIlXCIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgTm9kZSBlbnZcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc05vZGVFbnYgPSAoKSA9PiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnO1xuXG4gIGNvbnN0IFJFU1RPUkVfRk9DVVNfVElNRU9VVCA9IDEwMDtcblxuICAvKiogQHR5cGUge0dsb2JhbFN0YXRlfSAqL1xuXG4gIGNvbnN0IGdsb2JhbFN0YXRlID0ge307XG5cbiAgY29uc3QgZm9jdXNQcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmZvY3VzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUmVzdG9yZSBwcmV2aW91cyBhY3RpdmUgKGZvY3VzZWQpIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSByZXR1cm5Gb2N1c1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG5cblxuICBjb25zdCByZXN0b3JlQWN0aXZlRWxlbWVudCA9IHJldHVybkZvY3VzID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoIXJldHVybkZvY3VzKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHggPSB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgIGNvbnN0IHkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm9jdXNQcmV2aW91c0FjdGl2ZUVsZW1lbnQoKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwgUkVTVE9SRV9GT0NVU19USU1FT1VUKTsgLy8gaXNzdWVzLzkwMFxuXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeCwgeSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc3dlZXRIVE1MID0gXCJcXG4gPGRpdiBhcmlhLWxhYmVsbGVkYnk9XFxcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiIGFyaWEtZGVzY3JpYmVkYnk9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCJcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+XFxuICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNsb3NlLCBcIlxcXCI+PC9idXR0b24+XFxuICAgPHVsIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwcyddLCBcIlxcXCI+PC91bD5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiXFxcIj48L2Rpdj5cXG4gICA8aW1nIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmltYWdlLCBcIlxcXCIgLz5cXG4gICA8aDIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiPjwvaDI+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCI+PC9kaXY+XFxuICAgPGlucHV0IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmlucHV0LCBcIlxcXCIgLz5cXG4gICA8aW5wdXQgdHlwZT1cXFwiZmlsZVxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZmlsZSwgXCJcXFwiIC8+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCJcXFwiPlxcbiAgICAgPGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiAvPlxcbiAgICAgPG91dHB1dD48L291dHB1dD5cXG4gICA8L2Rpdj5cXG4gICA8c2VsZWN0IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnNlbGVjdCwgXCJcXFwiPjwvc2VsZWN0PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiXFxcIj48L2Rpdj5cXG4gICA8bGFiZWwgZm9yPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIlxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiXFxcIj5cXG4gICAgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgLz5cXG4gICAgIDxzcGFuIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmxhYmVsLCBcIlxcXCI+PC9zcGFuPlxcbiAgIDwvbGFiZWw+XFxuICAgPHRleHRhcmVhIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRleHRhcmVhLCBcIlxcXCI+PC90ZXh0YXJlYT5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCJcXFwiPlxcbiAgICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5sb2FkZXIsIFwiXFxcIj48L2Rpdj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb25maXJtLCBcIlxcXCI+PC9idXR0b24+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZGVueSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNhbmNlbCwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgIDwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZm9vdGVyLCBcIlxcXCI+PC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciddLCBcIlxcXCI+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXInXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDwvZGl2PlxcbiA8L2Rpdj5cXG5cIikucmVwbGFjZSgvKF58XFxuKVxccyovZywgJycpO1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IHJlc2V0T2xkQ29udGFpbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG9sZENvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuXG4gICAgaWYgKCFvbGRDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbGRDb250YWluZXIucmVtb3ZlKCk7XG4gICAgcmVtb3ZlQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIFtzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10sIHN3YWxDbGFzc2VzWydoYXMtY29sdW1uJ11dKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZXNldFZhbGlkYXRpb25NZXNzYWdlID0gKCkgPT4ge1xuICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gIH07XG5cbiAgY29uc3QgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgZmlsZSA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuZmlsZSk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgcmFuZ2UgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgaW5wdXRcIikpO1xuICAgIC8qKiBAdHlwZSB7SFRNTE91dHB1dEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCByYW5nZU91dHB1dCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBvdXRwdXRcIikpO1xuICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgICAvKiogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBjaGVja2JveCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIiBpbnB1dFwiKSk7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRleHRhcmVhKTtcbiAgICBpbnB1dC5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBmaWxlLm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBzZWxlY3Qub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIGNoZWNrYm94Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICB0ZXh0YXJlYS5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcblxuICAgIHJhbmdlLm9uaW5wdXQgPSAoKSA9PiB7XG4gICAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICAgIH07XG5cbiAgICByYW5nZS5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIHJhbmdlT3V0cHV0LnZhbHVlID0gcmFuZ2UudmFsdWU7XG4gICAgfTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgSFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0VGFyZ2V0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpIDogdGFyZ2V0O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0dXBBY2Nlc3NpYmlsaXR5ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdyb2xlJywgcGFyYW1zLnRvYXN0ID8gJ2FsZXJ0JyA6ICdkaWFsb2cnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsIHBhcmFtcy50b2FzdCA/ICdwb2xpdGUnIDogJ2Fzc2VydGl2ZScpO1xuXG4gICAgaWYgKCFwYXJhbXMudG9hc3QpIHtcbiAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwUlRMID0gdGFyZ2V0RWxlbWVudCA9PiB7XG4gICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsZW1lbnQpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgIGFkZENsYXNzKGdldENvbnRhaW5lcigpLCBzd2FsQ2xhc3Nlcy5ydGwpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEFkZCBtb2RhbCArIGJhY2tkcm9wICsgbm8td2FyIG1lc3NhZ2UgZm9yIFJ1c3NpYW5zIHRvIERPTVxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBpbml0ID0gcGFyYW1zID0+IHtcbiAgICAvLyBDbGVhbiB1cCB0aGUgb2xkIHBvcHVwIGNvbnRhaW5lciBpZiBpdCBleGlzdHNcbiAgICBjb25zdCBvbGRDb250YWluZXJFeGlzdGVkID0gcmVzZXRPbGRDb250YWluZXIoKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblxuICAgIGlmIChpc05vZGVFbnYoKSkge1xuICAgICAgZXJyb3IoJ1N3ZWV0QWxlcnQyIHJlcXVpcmVzIGRvY3VtZW50IHRvIGluaXRpYWxpemUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuY29udGFpbmVyO1xuXG4gICAgaWYgKG9sZENvbnRhaW5lckV4aXN0ZWQpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gICAgfVxuXG4gICAgc2V0SW5uZXJIdG1sKGNvbnRhaW5lciwgc3dlZXRIVE1MKTtcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZ2V0VGFyZ2V0KHBhcmFtcy50YXJnZXQpO1xuICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBzZXR1cEFjY2Vzc2liaWxpdHkocGFyYW1zKTtcbiAgICBzZXR1cFJUTCh0YXJnZXRFbGVtZW50KTtcbiAgICBhZGRJbnB1dENoYW5nZUxpc3RlbmVycygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgb2JqZWN0IHwgc3RyaW5nfSBwYXJhbVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICovXG5cbiAgY29uc3QgcGFyc2VIdG1sVG9Db250YWluZXIgPSAocGFyYW0sIHRhcmdldCkgPT4ge1xuICAgIC8vIERPTSBlbGVtZW50XG4gICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChwYXJhbSk7XG4gICAgfSAvLyBPYmplY3RcbiAgICBlbHNlIGlmICh0eXBlb2YgcGFyYW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBoYW5kbGVPYmplY3QocGFyYW0sIHRhcmdldCk7XG4gICAgfSAvLyBQbGFpbiBzdHJpbmdcbiAgICBlbHNlIGlmIChwYXJhbSkge1xuICAgICAgc2V0SW5uZXJIdG1sKHRhcmdldCwgcGFyYW0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlT2JqZWN0ID0gKHBhcmFtLCB0YXJnZXQpID0+IHtcbiAgICAvLyBKUXVlcnkgZWxlbWVudChzKVxuICAgIGlmIChwYXJhbS5qcXVlcnkpIHtcbiAgICAgIGhhbmRsZUpxdWVyeUVsZW0odGFyZ2V0LCBwYXJhbSk7XG4gICAgfSAvLyBGb3Igb3RoZXIgb2JqZWN0cyB1c2UgdGhlaXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAgZWxzZSB7XG4gICAgICBzZXRJbm5lckh0bWwodGFyZ2V0LCBwYXJhbS50b1N0cmluZygpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUpxdWVyeUVsZW0gPSAodGFyZ2V0LCBlbGVtKSA9PiB7XG4gICAgdGFyZ2V0LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAoMCBpbiBlbGVtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgKGkgaW4gZWxlbSk7IGkrKykge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbVtpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMgeyd3ZWJraXRBbmltYXRpb25FbmQnIHwgJ2FuaW1hdGlvbmVuZCcgfCBmYWxzZX1cbiAgICovXG5cbiAgY29uc3QgYW5pbWF0aW9uRW5kRXZlbnQgPSAoKCkgPT4ge1xuICAgIC8vIFByZXZlbnQgcnVuIGluIE5vZGUgZW52XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgLy8gQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhXG4gICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnIC8vIFN0YW5kYXJkIHN5bnRheFxuXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgaSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodHJhbnNFbmRFdmVudE5hbWVzLCBpKSAmJiB0eXBlb2YgdGVzdEVsLnN0eWxlW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gdHJhbnNFbmRFdmVudE5hbWVzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcblxuICAvKipcbiAgICogTWVhc3VyZSBzY3JvbGxiYXIgd2lkdGggZm9yIHBhZGRpbmcgYm9keSBkdXJpbmcgbW9kYWwgc2hvdy9oaWRlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9qcy9zcmMvbW9kYWwuanNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG5cbiAgY29uc3QgbWVhc3VyZVNjcm9sbGJhciA9ICgpID0+IHtcbiAgICBjb25zdCBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbJ3Njcm9sbGJhci1tZWFzdXJlJ107XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJBY3Rpb25zID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpOyAvLyBBY3Rpb25zIChidXR0b25zKSB3cmFwcGVyXG5cbiAgICBpZiAoIXBhcmFtcy5zaG93Q29uZmlybUJ1dHRvbiAmJiAhcGFyYW1zLnNob3dEZW55QnV0dG9uICYmICFwYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbikge1xuICAgICAgaGlkZShhY3Rpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvdyhhY3Rpb25zKTtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGFjdGlvbnMsIHBhcmFtcywgJ2FjdGlvbnMnKTsgLy8gUmVuZGVyIGFsbCB0aGUgYnV0dG9uc1xuXG4gICAgcmVuZGVyQnV0dG9ucyhhY3Rpb25zLCBsb2FkZXIsIHBhcmFtcyk7IC8vIExvYWRlclxuXG4gICAgc2V0SW5uZXJIdG1sKGxvYWRlciwgcGFyYW1zLmxvYWRlckh0bWwpO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MobG9hZGVyLCBwYXJhbXMsICdsb2FkZXInKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjdGlvbnNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbG9hZGVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBmdW5jdGlvbiByZW5kZXJCdXR0b25zKGFjdGlvbnMsIGxvYWRlciwgcGFyYW1zKSB7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICBjb25zdCBkZW55QnV0dG9uID0gZ2V0RGVueUJ1dHRvbigpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpOyAvLyBSZW5kZXIgYnV0dG9uc1xuXG4gICAgcmVuZGVyQnV0dG9uKGNvbmZpcm1CdXR0b24sICdjb25maXJtJywgcGFyYW1zKTtcbiAgICByZW5kZXJCdXR0b24oZGVueUJ1dHRvbiwgJ2RlbnknLCBwYXJhbXMpO1xuICAgIHJlbmRlckJ1dHRvbihjYW5jZWxCdXR0b24sICdjYW5jZWwnLCBwYXJhbXMpO1xuICAgIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKTtcblxuICAgIGlmIChwYXJhbXMucmV2ZXJzZUJ1dHRvbnMpIHtcbiAgICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY2FuY2VsQnV0dG9uLCBjb25maXJtQnV0dG9uKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoZGVueUJ1dHRvbiwgY29uZmlybUJ1dHRvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjYW5jZWxCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGRlbnlCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNvbmZpcm1CdXR0b24sIGxvYWRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb25maXJtQnV0dG9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRlbnlCdXR0b25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FuY2VsQnV0dG9uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuYnV0dG9uc1N0eWxpbmcpIHtcbiAgICAgIHJldHVybiByZW1vdmVDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTtcbiAgICB9XG5cbiAgICBhZGRDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTsgLy8gQnV0dG9ucyBiYWNrZ3JvdW5kIGNvbG9yc1xuXG4gICAgaWYgKHBhcmFtcy5jb25maXJtQnV0dG9uQ29sb3IpIHtcbiAgICAgIGNvbmZpcm1CdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGNvbmZpcm1CdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5kZW55QnV0dG9uQ29sb3IpIHtcbiAgICAgIGRlbnlCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmRlbnlCdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGRlbnlCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcikge1xuICAgICAgY2FuY2VsQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGNhbmNlbEJ1dHRvbiwgc3dhbENsYXNzZXNbJ2RlZmF1bHQtb3V0bGluZSddKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55JyB8ICdjYW5jZWwnfSBidXR0b25UeXBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbihidXR0b24sIGJ1dHRvblR5cGUsIHBhcmFtcykge1xuICAgIHRvZ2dsZShidXR0b24sIHBhcmFtc1tcInNob3dcIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGJ1dHRvblR5cGUpLCBcIkJ1dHRvblwiKV0sICdpbmxpbmUtYmxvY2snKTtcbiAgICBzZXRJbm5lckh0bWwoYnV0dG9uLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25UZXh0XCIpXSk7IC8vIFNldCBjYXB0aW9uIHRleHRcblxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25BcmlhTGFiZWxcIildKTsgLy8gQVJJQSBsYWJlbFxuICAgIC8vIEFkZCBidXR0b25zIGN1c3RvbSBjbGFzc2VzXG5cbiAgICBidXR0b24uY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbYnV0dG9uVHlwZV07XG4gICAgYXBwbHlDdXN0b21DbGFzcyhidXR0b24sIHBhcmFtcywgXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25cIikpO1xuICAgIGFkZENsYXNzKGJ1dHRvbiwgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uQ2xhc3NcIildKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ29udGFpbmVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcblxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIHBhcmFtcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBhcmFtcy5wb3NpdGlvbik7XG4gICAgaGFuZGxlR3Jvd1BhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmdyb3cpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY29udGFpbmVyLCBwYXJhbXMsICdjb250YWluZXInKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydiYWNrZHJvcCddfSBiYWNrZHJvcFxuICAgKi9cblxuICBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgYmFja2Ryb3ApIHtcbiAgICBpZiAodHlwZW9mIGJhY2tkcm9wID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSBiYWNrZHJvcDtcbiAgICB9IGVsc2UgaWYgKCFiYWNrZHJvcCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydwb3NpdGlvbiddfSBwb3NpdGlvblxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwb3NpdGlvbikge1xuICAgIGlmIChwb3NpdGlvbiBpbiBzd2FsQ2xhc3Nlcykge1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1twb3NpdGlvbl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3YXJuKCdUaGUgXCJwb3NpdGlvblwiIHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJjZW50ZXJcIicpO1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlcy5jZW50ZXIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2dyb3cnXX0gZ3Jvd1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUdyb3dQYXJhbShjb250YWluZXIsIGdyb3cpIHtcbiAgICBpZiAoZ3JvdyAmJiB0eXBlb2YgZ3JvdyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGdyb3dDbGFzcyA9IFwiZ3Jvdy1cIi5jb25jYXQoZ3Jvdyk7XG5cbiAgICAgIGlmIChncm93Q2xhc3MgaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1tncm93Q2xhc3NdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgY29udGFpbnMgYFdlYWtNYXBgcyBmb3IgZWFjaCBlZmZlY3RpdmVseS1cInByaXZhdGUgIHByb3BlcnR5XCIgdGhhdCBhIGBTd2FsYCBoYXMuXG4gICAqIEZvciBleGFtcGxlLCB0byBzZXQgdGhlIHByaXZhdGUgcHJvcGVydHkgXCJmb29cIiBvZiBgdGhpc2AgdG8gXCJiYXJcIiwgeW91IGNhbiBgcHJpdmF0ZVByb3BzLmZvby5zZXQodGhpcywgJ2JhcicpYFxuICAgKiBUaGlzIGlzIHRoZSBhcHByb2FjaCB0aGF0IEJhYmVsIHdpbGwgcHJvYmFibHkgdGFrZSB0byBpbXBsZW1lbnQgcHJpdmF0ZSBtZXRob2RzL2ZpZWxkc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByaXZhdGUtbWV0aG9kc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9wdWxsLzc1NTVcbiAgICogT25jZSB3ZSBoYXZlIHRoZSBjaGFuZ2VzIGZyb20gdGhhdCBQUiBpbiBCYWJlbCwgYW5kIG91ciBjb3JlIGNsYXNzIGZpdHMgcmVhc29uYWJsZSBpbiAqb25lIG1vZHVsZSpcbiAgICogICB0aGVuIHdlIGNhbiB1c2UgdGhhdCBsYW5ndWFnZSBmZWF0dXJlLlxuICAgKi9cbiAgdmFyIHByaXZhdGVQcm9wcyA9IHtcbiAgICBhd2FpdGluZ1Byb21pc2U6IG5ldyBXZWFrTWFwKCksXG4gICAgcHJvbWlzZTogbmV3IFdlYWtNYXAoKSxcbiAgICBpbm5lclBhcmFtczogbmV3IFdlYWtNYXAoKSxcbiAgICBkb21DYWNoZTogbmV3IFdlYWtNYXAoKVxuICB9O1xuXG4gIC8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9zd2VldGFsZXJ0Mi5kLnRzXCIvPlxuICAvKiogQHR5cGUge0lucHV0Q2xhc3NbXX0gKi9cblxuICBjb25zdCBpbnB1dENsYXNzZXMgPSBbJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ3RleHRhcmVhJ107XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySW5wdXQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGNvbnN0IHJlcmVuZGVyID0gIWlubmVyUGFyYW1zIHx8IHBhcmFtcy5pbnB1dCAhPT0gaW5uZXJQYXJhbXMuaW5wdXQ7XG4gICAgaW5wdXRDbGFzc2VzLmZvckVhY2goaW5wdXRDbGFzcyA9PiB7XG4gICAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXNbaW5wdXRDbGFzc10pOyAvLyBzZXQgYXR0cmlidXRlc1xuXG4gICAgICBzZXRBdHRyaWJ1dGVzKGlucHV0Q2xhc3MsIHBhcmFtcy5pbnB1dEF0dHJpYnV0ZXMpOyAvLyBzZXQgY2xhc3NcblxuICAgICAgaW5wdXRDb250YWluZXIuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbaW5wdXRDbGFzc107XG5cbiAgICAgIGlmIChyZXJlbmRlcikge1xuICAgICAgICBoaWRlKGlucHV0Q29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwYXJhbXMuaW5wdXQpIHtcbiAgICAgIGlmIChyZXJlbmRlcikge1xuICAgICAgICBzaG93SW5wdXQocGFyYW1zKTtcbiAgICAgIH0gLy8gc2V0IGN1c3RvbSBjbGFzc1xuXG5cbiAgICAgIHNldEN1c3RvbUNsYXNzKHBhcmFtcyk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHNob3dJbnB1dCA9IHBhcmFtcyA9PiB7XG4gICAgaWYgKCFyZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XSkge1xuICAgICAgcmV0dXJuIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0ISBFeHBlY3RlZCBcXFwidGV4dFxcXCIsIFxcXCJlbWFpbFxcXCIsIFxcXCJwYXNzd29yZFxcXCIsIFxcXCJudW1iZXJcXFwiLCBcXFwidGVsXFxcIiwgXFxcInNlbGVjdFxcXCIsIFxcXCJyYWRpb1xcXCIsIFxcXCJjaGVja2JveFxcXCIsIFxcXCJ0ZXh0YXJlYVxcXCIsIFxcXCJmaWxlXFxcIiBvciBcXFwidXJsXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLmlucHV0LCBcIlxcXCJcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0SW5wdXRDb250YWluZXIocGFyYW1zLmlucHV0KTtcbiAgICBjb25zdCBpbnB1dCA9IHJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKGlucHV0Q29udGFpbmVyLCBwYXJhbXMpO1xuICAgIHNob3coaW5wdXRDb250YWluZXIpOyAvLyBpbnB1dCBhdXRvZm9jdXNcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqL1xuXG5cbiAgY29uc3QgcmVtb3ZlQXR0cmlidXRlcyA9IGlucHV0ID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gaW5wdXQuYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICBpZiAoIVsndHlwZScsICd2YWx1ZScsICdzdHlsZSddLmluY2x1ZGVzKGF0dHJOYW1lKSkge1xuICAgICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SW5wdXRDbGFzc30gaW5wdXRDbGFzc1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dEF0dHJpYnV0ZXMnXX0gaW5wdXRBdHRyaWJ1dGVzXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0QXR0cmlidXRlcyA9IChpbnB1dENsYXNzLCBpbnB1dEF0dHJpYnV0ZXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGdldElucHV0KGdldFBvcHVwKCksIGlucHV0Q2xhc3MpO1xuXG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZXMoaW5wdXQpO1xuXG4gICAgZm9yIChjb25zdCBhdHRyIGluIGlucHV0QXR0cmlidXRlcykge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKGF0dHIsIGlucHV0QXR0cmlidXRlc1thdHRyXSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0Q3VzdG9tQ2xhc3MgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0SW5wdXRDb250YWluZXIocGFyYW1zLmlucHV0KTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnb2JqZWN0Jykge1xuICAgICAgYWRkQ2xhc3MoaW5wdXRDb250YWluZXIsIHBhcmFtcy5jdXN0b21DbGFzcy5pbnB1dCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0SW5wdXRQbGFjZWhvbGRlciA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFpbnB1dC5wbGFjZWhvbGRlciB8fCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcjtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0lucHV0fSBpbnB1dFxuICAgKiBAcGFyYW0ge0lucHV0fSBwcmVwZW5kVG9cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0SW5wdXRMYWJlbCA9IChpbnB1dCwgcHJlcGVuZFRvLCBwYXJhbXMpID0+IHtcbiAgICBpZiAocGFyYW1zLmlucHV0TGFiZWwpIHtcbiAgICAgIGlucHV0LmlkID0gc3dhbENsYXNzZXMuaW5wdXQ7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBsYWJlbENsYXNzID0gc3dhbENsYXNzZXNbJ2lucHV0LWxhYmVsJ107XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGlucHV0LmlkKTtcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsQ2xhc3M7XG5cbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBhZGRDbGFzcyhsYWJlbCwgcGFyYW1zLmN1c3RvbUNsYXNzLmlucHV0TGFiZWwpO1xuICAgICAgfVxuXG4gICAgICBsYWJlbC5pbm5lclRleHQgPSBwYXJhbXMuaW5wdXRMYWJlbDtcbiAgICAgIHByZXBlbmRUby5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgbGFiZWwpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0J119IGlucHV0VHlwZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0SW5wdXRDb250YWluZXIgPSBpbnB1dFR5cGUgPT4ge1xuICAgIHJldHVybiBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MoZ2V0UG9wdXAoKSwgc3dhbENsYXNzZXNbaW5wdXRUeXBlXSB8fCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MT3V0cHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0VmFsdWUnXX0gaW5wdXRWYWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IGNoZWNrQW5kU2V0SW5wdXRWYWx1ZSA9IChpbnB1dCwgaW5wdXRWYWx1ZSkgPT4ge1xuICAgIGlmIChbJ3N0cmluZycsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2YgaW5wdXRWYWx1ZSkpIHtcbiAgICAgIGlucHV0LnZhbHVlID0gXCJcIi5jb25jYXQoaW5wdXRWYWx1ZSk7XG4gICAgfSBlbHNlIGlmICghaXNQcm9taXNlKGlucHV0VmFsdWUpKSB7XG4gICAgICB3YXJuKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0VmFsdWUhIEV4cGVjdGVkIFxcXCJzdHJpbmdcXFwiLCBcXFwibnVtYmVyXFxcIiBvciBcXFwiUHJvbWlzZVxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHR5cGVvZiBpbnB1dFZhbHVlLCBcIlxcXCJcIikpO1xuICAgIH1cbiAgfTtcbiAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsIChpbnB1dDogSW5wdXQgfCBIVE1MRWxlbWVudCwgcGFyYW1zOiBTd2VldEFsZXJ0T3B0aW9ucykgPT4gSW5wdXQ+ICovXG5cblxuICBjb25zdCByZW5kZXJJbnB1dFR5cGUgPSB7fTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXJJbnB1dFR5cGUudGV4dCA9IHJlbmRlcklucHV0VHlwZS5lbWFpbCA9IHJlbmRlcklucHV0VHlwZS5wYXNzd29yZCA9IHJlbmRlcklucHV0VHlwZS5udW1iZXIgPSByZW5kZXJJbnB1dFR5cGUudGVsID0gcmVuZGVySW5wdXRUeXBlLnVybCA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKGlucHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICBpbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5maWxlID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBzZXRJbnB1dExhYmVsKGlucHV0LCBpbnB1dCwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKGlucHV0LCBwYXJhbXMpO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFuZ2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5yYW5nZSA9IChyYW5nZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcmFuZ2VJbnB1dCA9IHJhbmdlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgY29uc3QgcmFuZ2VPdXRwdXQgPSByYW5nZS5xdWVyeVNlbGVjdG9yKCdvdXRwdXQnKTtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUocmFuZ2VJbnB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHJhbmdlSW5wdXQudHlwZSA9IHBhcmFtcy5pbnB1dDtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUocmFuZ2VPdXRwdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dExhYmVsKHJhbmdlSW5wdXQsIHJhbmdlLCBwYXJhbXMpO1xuICAgIHJldHVybiByYW5nZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFNlbGVjdEVsZW1lbnR9IHNlbGVjdFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxTZWxlY3RFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5zZWxlY3QgPSAoc2VsZWN0LCBwYXJhbXMpID0+IHtcbiAgICBzZWxlY3QudGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmIChwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHNldElubmVySHRtbChwbGFjZWhvbGRlciwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpO1xuICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgIHBsYWNlaG9sZGVyLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBsYWNlaG9sZGVyLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgc2V0SW5wdXRMYWJlbChzZWxlY3QsIHNlbGVjdCwgcGFyYW1zKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUucmFkaW8gPSByYWRpbyA9PiB7XG4gICAgcmFkaW8udGV4dENvbnRlbnQgPSAnJztcbiAgICByZXR1cm4gcmFkaW87XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxMYWJlbEVsZW1lbnR9IGNoZWNrYm94Q29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuY2hlY2tib3ggPSAoY2hlY2tib3hDb250YWluZXIsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0SW5wdXQoZ2V0UG9wdXAoKSwgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3gudmFsdWUgPSAnMSc7XG4gICAgY2hlY2tib3guaWQgPSBzd2FsQ2xhc3Nlcy5jaGVja2JveDtcbiAgICBjaGVja2JveC5jaGVja2VkID0gQm9vbGVhbihwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgY29uc3QgbGFiZWwgPSBjaGVja2JveENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG4gICAgc2V0SW5uZXJIdG1sKGxhYmVsLCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcik7XG4gICAgcmV0dXJuIGNoZWNrYm94O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MVGV4dEFyZWFFbGVtZW50fSB0ZXh0YXJlYVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxUZXh0QXJlYUVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnRleHRhcmVhID0gKHRleHRhcmVhLCBwYXJhbXMpID0+IHtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUodGV4dGFyZWEsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKHRleHRhcmVhLCBwYXJhbXMpO1xuICAgIHNldElucHV0TGFiZWwodGV4dGFyZWEsIHRleHRhcmVhLCBwYXJhbXMpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cblxuICAgIGNvbnN0IGdldE1hcmdpbiA9IGVsID0+IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5tYXJnaW5MZWZ0KSArIHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5tYXJnaW5SaWdodCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjI5MVxuXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTY5OVxuICAgICAgaWYgKCdNdXRhdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbFBvcHVwV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnZXRQb3B1cCgpKS53aWR0aCk7XG5cbiAgICAgICAgY29uc3QgdGV4dGFyZWFSZXNpemVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHRhcmVhV2lkdGggPSB0ZXh0YXJlYS5vZmZzZXRXaWR0aCArIGdldE1hcmdpbih0ZXh0YXJlYSk7XG5cbiAgICAgICAgICBpZiAodGV4dGFyZWFXaWR0aCA+IGluaXRpYWxQb3B1cFdpZHRoKSB7XG4gICAgICAgICAgICBnZXRQb3B1cCgpLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGV4dGFyZWFXaWR0aCwgXCJweFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UG9wdXAoKS5zdHlsZS53aWR0aCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRleHRhcmVhUmVzaXplSGFuZGxlcikub2JzZXJ2ZSh0ZXh0YXJlYSwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ11cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRleHRhcmVhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ29udGVudCA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaHRtbENvbnRhaW5lciA9IGdldEh0bWxDb250YWluZXIoKTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGh0bWxDb250YWluZXIsIHBhcmFtcywgJ2h0bWxDb250YWluZXInKTsgLy8gQ29udGVudCBhcyBIVE1MXG5cbiAgICBpZiAocGFyYW1zLmh0bWwpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5odG1sLCBodG1sQ29udGFpbmVyKTtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfSAvLyBDb250ZW50IGFzIHBsYWluIHRleHRcbiAgICBlbHNlIGlmIChwYXJhbXMudGV4dCkge1xuICAgICAgaHRtbENvbnRhaW5lci50ZXh0Q29udGVudCA9IHBhcmFtcy50ZXh0O1xuICAgICAgc2hvdyhodG1sQ29udGFpbmVyLCAnYmxvY2snKTtcbiAgICB9IC8vIE5vIGNvbnRlbnRcbiAgICBlbHNlIHtcbiAgICAgIGhpZGUoaHRtbENvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgcmVuZGVySW5wdXQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJGb290ZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGZvb3RlciA9IGdldEZvb3RlcigpO1xuICAgIHRvZ2dsZShmb290ZXIsIHBhcmFtcy5mb290ZXIpO1xuXG4gICAgaWYgKHBhcmFtcy5mb290ZXIpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5mb290ZXIsIGZvb3Rlcik7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhmb290ZXIsIHBhcmFtcywgJ2Zvb3RlcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ2xvc2VCdXR0b24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZ2V0Q2xvc2VCdXR0b24oKTtcbiAgICBzZXRJbm5lckh0bWwoY2xvc2VCdXR0b24sIHBhcmFtcy5jbG9zZUJ1dHRvbkh0bWwpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY2xvc2VCdXR0b24sIHBhcmFtcywgJ2Nsb3NlQnV0dG9uJyk7XG4gICAgdG9nZ2xlKGNsb3NlQnV0dG9uLCBwYXJhbXMuc2hvd0Nsb3NlQnV0dG9uKTtcbiAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXMuY2xvc2VCdXR0b25BcmlhTGFiZWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySWNvbiA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBjb25zdCBpY29uID0gZ2V0SWNvbigpOyAvLyBpZiB0aGUgZ2l2ZW4gaWNvbiBhbHJlYWR5IHJlbmRlcmVkLCBhcHBseSB0aGUgc3R5bGluZyB3aXRob3V0IHJlLXJlbmRlcmluZyB0aGUgaWNvblxuXG4gICAgaWYgKGlubmVyUGFyYW1zICYmIHBhcmFtcy5pY29uID09PSBpbm5lclBhcmFtcy5pY29uKSB7XG4gICAgICAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG4gICAgICBzZXRDb250ZW50KGljb24sIHBhcmFtcyk7XG4gICAgICBhcHBseVN0eWxlcyhpY29uLCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcGFyYW1zLmljb24gJiYgIXBhcmFtcy5pY29uSHRtbCkge1xuICAgICAgaGlkZShpY29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLmljb24gJiYgT2JqZWN0LmtleXMoaWNvblR5cGVzKS5pbmRleE9mKHBhcmFtcy5pY29uKSA9PT0gLTEpIHtcbiAgICAgIGVycm9yKFwiVW5rbm93biBpY29uISBFeHBlY3RlZCBcXFwic3VjY2Vzc1xcXCIsIFxcXCJlcnJvclxcXCIsIFxcXCJ3YXJuaW5nXFxcIiwgXFxcImluZm9cXFwiIG9yIFxcXCJxdWVzdGlvblxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHBhcmFtcy5pY29uLCBcIlxcXCJcIikpO1xuICAgICAgaGlkZShpY29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzaG93KGljb24pOyAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG5cbiAgICBzZXRDb250ZW50KGljb24sIHBhcmFtcyk7XG4gICAgYXBwbHlTdHlsZXMoaWNvbiwgcGFyYW1zKTsgLy8gQW5pbWF0ZSBpY29uXG5cbiAgICBhZGRDbGFzcyhpY29uLCBwYXJhbXMuc2hvd0NsYXNzLmljb24pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgYXBwbHlTdHlsZXMgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgZm9yIChjb25zdCBpY29uVHlwZSBpbiBpY29uVHlwZXMpIHtcbiAgICAgIGlmIChwYXJhbXMuaWNvbiAhPT0gaWNvblR5cGUpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaWNvbiwgaWNvblR5cGVzW2ljb25UeXBlXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoaWNvbiwgaWNvblR5cGVzW3BhcmFtcy5pY29uXSk7IC8vIEljb24gY29sb3JcblxuICAgIHNldENvbG9yKGljb24sIHBhcmFtcyk7IC8vIFN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yXG5cbiAgICBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoaWNvbiwgcGFyYW1zLCAnaWNvbicpO1xuICB9OyAvLyBBZGp1c3Qgc3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3IgdG8gbWF0Y2ggdGhlIHBvcHVwIGJhY2tncm91bmQgY29sb3JcblxuXG4gIGNvbnN0IGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBwb3B1cEJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBvcHVwKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgLyoqIEB0eXBlIHtOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pn0gKi9cblxuICAgIGNvbnN0IHN1Y2Nlc3NJY29uUGFydHMgPSBwb3B1cC5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV0sIC5zd2FsMi1zdWNjZXNzLWZpeCcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWNjZXNzSWNvblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWNjZXNzSWNvblBhcnRzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBvcHVwQmFja2dyb3VuZENvbG9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzdWNjZXNzSWNvbkh0bWwgPSBcIlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLWxlZnRcXFwiPjwvZGl2PlxcbiAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS10aXBcXFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nXFxcIj48L3NwYW4+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLXJpbmdcXFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWZpeFxcXCI+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHRcXFwiPjwvZGl2PlxcblwiO1xuICBjb25zdCBlcnJvckljb25IdG1sID0gXCJcXG4gIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmtcXFwiPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtbGVmdFxcXCI+PC9zcGFuPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtcmlnaHRcXFwiPjwvc3Bhbj5cXG4gIDwvc3Bhbj5cXG5cIjtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHNldENvbnRlbnQgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgbGV0IG9sZENvbnRlbnQgPSBpY29uLmlubmVySFRNTDtcbiAgICBsZXQgbmV3Q29udGVudDtcblxuICAgIGlmIChwYXJhbXMuaWNvbkh0bWwpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBpY29uQ29udGVudChwYXJhbXMuaWNvbkh0bWwpO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zLmljb24gPT09ICdzdWNjZXNzJykge1xuICAgICAgbmV3Q29udGVudCA9IHN1Y2Nlc3NJY29uSHRtbDtcbiAgICAgIG9sZENvbnRlbnQgPSBvbGRDb250ZW50LnJlcGxhY2UoLyBzdHlsZT1cIi4qP1wiL2csICcnKTsgLy8gdW5kbyBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpXG4gICAgfSBlbHNlIGlmIChwYXJhbXMuaWNvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgbmV3Q29udGVudCA9IGVycm9ySWNvbkh0bWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRJY29uSHRtbCA9IHtcbiAgICAgICAgcXVlc3Rpb246ICc/JyxcbiAgICAgICAgd2FybmluZzogJyEnLFxuICAgICAgICBpbmZvOiAnaSdcbiAgICAgIH07XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQoZGVmYXVsdEljb25IdG1sW3BhcmFtcy5pY29uXSk7XG4gICAgfVxuXG4gICAgaWYgKG9sZENvbnRlbnQudHJpbSgpICE9PSBuZXdDb250ZW50LnRyaW0oKSkge1xuICAgICAgc2V0SW5uZXJIdG1sKGljb24sIG5ld0NvbnRlbnQpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0Q29sb3IgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaWNvbkNvbG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWNvbi5zdHlsZS5jb2xvciA9IHBhcmFtcy5pY29uQ29sb3I7XG4gICAgaWNvbi5zdHlsZS5ib3JkZXJDb2xvciA9IHBhcmFtcy5pY29uQ29sb3I7XG5cbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBbJy5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwJywgJy5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZycsICcuc3dhbDIteC1tYXJrLWxpbmUtbGVmdCcsICcuc3dhbDIteC1tYXJrLWxpbmUtcmlnaHQnXSkge1xuICAgICAgc2V0U3R5bGUoaWNvbiwgc2VsLCAnYmFja2dyb3VuZENvbG9yJywgcGFyYW1zLmljb25Db2xvcik7XG4gICAgfVxuXG4gICAgc2V0U3R5bGUoaWNvbiwgJy5zd2FsMi1zdWNjZXNzLXJpbmcnLCAnYm9yZGVyQ29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgY29uc3QgaWNvbkNvbnRlbnQgPSBjb250ZW50ID0+IFwiPGRpdiBjbGFzcz1cXFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzWydpY29uLWNvbnRlbnQnXSwgXCJcXFwiPlwiKS5jb25jYXQoY29udGVudCwgXCI8L2Rpdj5cIik7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJJbWFnZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBnZXRJbWFnZSgpO1xuXG4gICAgaWYgKCFwYXJhbXMuaW1hZ2VVcmwpIHtcbiAgICAgIHJldHVybiBoaWRlKGltYWdlKTtcbiAgICB9XG5cbiAgICBzaG93KGltYWdlLCAnJyk7IC8vIFNyYywgYWx0XG5cbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhcmFtcy5pbWFnZVVybCk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdhbHQnLCBwYXJhbXMuaW1hZ2VBbHQpOyAvLyBXaWR0aCwgaGVpZ2h0XG5cbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKGltYWdlLCAnd2lkdGgnLCBwYXJhbXMuaW1hZ2VXaWR0aCk7XG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ2hlaWdodCcsIHBhcmFtcy5pbWFnZUhlaWdodCk7IC8vIENsYXNzXG5cbiAgICBpbWFnZS5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5pbWFnZTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGltYWdlLCBwYXJhbXMsICdpbWFnZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyUHJvZ3Jlc3NTdGVwcyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lciA9IGdldFByb2dyZXNzU3RlcHMoKTtcblxuICAgIGlmICghcGFyYW1zLnByb2dyZXNzU3RlcHMgfHwgcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaGlkZShwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBzaG93KHByb2dyZXNzU3RlcHNDb250YWluZXIpO1xuICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIudGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmIChwYXJhbXMuY3VycmVudFByb2dyZXNzU3RlcCA+PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGgpIHtcbiAgICAgIHdhcm4oJ0ludmFsaWQgY3VycmVudFByb2dyZXNzU3RlcCBwYXJhbWV0ZXIsIGl0IHNob3VsZCBiZSBsZXNzIHRoYW4gcHJvZ3Jlc3NTdGVwcy5sZW5ndGggJyArICcoY3VycmVudFByb2dyZXNzU3RlcCBsaWtlIEpTIGFycmF5cyBzdGFydHMgZnJvbSAwKScpO1xuICAgIH1cblxuICAgIHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmZvckVhY2goKHN0ZXAsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzdGVwRWwgPSBjcmVhdGVTdGVwRWxlbWVudChzdGVwKTtcbiAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RlcEVsKTtcblxuICAgICAgaWYgKGluZGV4ID09PSBwYXJhbXMuY3VycmVudFByb2dyZXNzU3RlcCkge1xuICAgICAgICBhZGRDbGFzcyhzdGVwRWwsIHN3YWxDbGFzc2VzWydhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4ICE9PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IGxpbmVFbCA9IGNyZWF0ZUxpbmVFbGVtZW50KHBhcmFtcyk7XG4gICAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQobGluZUVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGVwXG4gICAqIEByZXR1cm5zIHtIVE1MTElFbGVtZW50fVxuICAgKi9cblxuICBjb25zdCBjcmVhdGVTdGVwRWxlbWVudCA9IHN0ZXAgPT4ge1xuICAgIGNvbnN0IHN0ZXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICBzZXRJbm5lckh0bWwoc3RlcEVsLCBzdGVwKTtcbiAgICByZXR1cm4gc3RlcEVsO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MTElFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGNyZWF0ZUxpbmVFbGVtZW50ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBsaW5lRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGFkZENsYXNzKGxpbmVFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAtbGluZSddKTtcblxuICAgIGlmIChwYXJhbXMucHJvZ3Jlc3NTdGVwc0Rpc3RhbmNlKSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKGxpbmVFbCwgJ3dpZHRoJywgcGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmVFbDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclRpdGxlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGdldFRpdGxlKCk7XG4gICAgdG9nZ2xlKHRpdGxlLCBwYXJhbXMudGl0bGUgfHwgcGFyYW1zLnRpdGxlVGV4dCwgJ2Jsb2NrJyk7XG5cbiAgICBpZiAocGFyYW1zLnRpdGxlKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMudGl0bGUsIHRpdGxlKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLnRpdGxlVGV4dCkge1xuICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gcGFyYW1zLnRpdGxlVGV4dDtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKHRpdGxlLCBwYXJhbXMsICd0aXRsZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyUG9wdXAgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTsgLy8gV2lkdGhcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIxNzBcblxuICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgICAgcG9wdXAuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBwb3B1cC5pbnNlcnRCZWZvcmUoZ2V0TG9hZGVyKCksIGdldEljb24oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICd3aWR0aCcsIHBhcmFtcy53aWR0aCk7XG4gICAgfSAvLyBQYWRkaW5nXG5cblxuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICdwYWRkaW5nJywgcGFyYW1zLnBhZGRpbmcpOyAvLyBDb2xvclxuXG4gICAgaWYgKHBhcmFtcy5jb2xvcikge1xuICAgICAgcG9wdXAuc3R5bGUuY29sb3IgPSBwYXJhbXMuY29sb3I7XG4gICAgfSAvLyBCYWNrZ3JvdW5kXG5cblxuICAgIGlmIChwYXJhbXMuYmFja2dyb3VuZCkge1xuICAgICAgcG9wdXAuc3R5bGUuYmFja2dyb3VuZCA9IHBhcmFtcy5iYWNrZ3JvdW5kO1xuICAgIH1cblxuICAgIGhpZGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSk7IC8vIENsYXNzZXNcblxuICAgIGFkZENsYXNzZXMocG9wdXAsIHBhcmFtcyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgYWRkQ2xhc3NlcyA9IChwb3B1cCwgcGFyYW1zKSA9PiB7XG4gICAgLy8gRGVmYXVsdCBDbGFzcyArIHNob3dDbGFzcyB3aGVuIHVwZGF0aW5nIFN3YWwudXBkYXRlKHt9KVxuICAgIHBvcHVwLmNsYXNzTmFtZSA9IFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiBcIikuY29uY2F0KGlzVmlzaWJsZShwb3B1cCkgPyBwYXJhbXMuc2hvd0NsYXNzLnBvcHVwIDogJycpO1xuXG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKTtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50b2FzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5tb2RhbCk7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhwb3B1cCwgcGFyYW1zLCAncG9wdXAnKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnc3RyaW5nJykge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHBhcmFtcy5jdXN0b21DbGFzcyk7XG4gICAgfSAvLyBJY29uIGNsYXNzICgjMTg0MilcblxuXG4gICAgaWYgKHBhcmFtcy5pY29uKSB7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXNbXCJpY29uLVwiLmNvbmNhdChwYXJhbXMuaWNvbildKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIHJlbmRlclBvcHVwKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNvbnRhaW5lcihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJQcm9ncmVzc1N0ZXBzKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckljb24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVySW1hZ2UoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyVGl0bGUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ2xvc2VCdXR0b24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ29udGVudChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJBY3Rpb25zKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckZvb3RlcihpbnN0YW5jZSwgcGFyYW1zKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmRpZFJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGFyYW1zLmRpZFJlbmRlcihnZXRQb3B1cCgpKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgRGlzbWlzc1JlYXNvbiA9IE9iamVjdC5mcmVlemUoe1xuICAgIGNhbmNlbDogJ2NhbmNlbCcsXG4gICAgYmFja2Ryb3A6ICdiYWNrZHJvcCcsXG4gICAgY2xvc2U6ICdjbG9zZScsXG4gICAgZXNjOiAnZXNjJyxcbiAgICB0aW1lcjogJ3RpbWVyJ1xuICB9KTtcblxuICAvLyBBZGRpbmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdG8gZWxlbWVudHMgb3V0c2lkZSBvZiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyBlbnN1cmVzIHRoYXRcbiAgLy8gZWxlbWVudHMgbm90IHdpdGhpbiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyB3aWxsIG5vdCBiZSBzdXJmYWNlZCBpZiBhIHVzZXIgb3BlbnMgYSBzY3JlZW5cbiAgLy8gcmVhZGVyXHUyMDE5cyBsaXN0IG9mIGVsZW1lbnRzIChoZWFkaW5ncywgZm9ybSBjb250cm9scywgbGFuZG1hcmtzLCBldGMuKSBpbiB0aGUgZG9jdW1lbnQuXG5cbiAgY29uc3Qgc2V0QXJpYUhpZGRlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5Q2hpbGRyZW4gPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgIGJvZHlDaGlsZHJlbi5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbCA9PT0gZ2V0Q29udGFpbmVyKCkgfHwgZWwuY29udGFpbnMoZ2V0Q29udGFpbmVyKCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgfVxuXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdW5zZXRBcmlhSGlkZGVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHlDaGlsZHJlbiA9IEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gICAgYm9keUNoaWxkcmVuLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKSk7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN3YWxTdHJpbmdQYXJhbXMgPSBbJ3N3YWwtdGl0bGUnLCAnc3dhbC1odG1sJywgJ3N3YWwtZm9vdGVyJ107XG4gIGNvbnN0IGdldFRlbXBsYXRlUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHR5cGVvZiBwYXJhbXMudGVtcGxhdGUgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGVtcGxhdGUpIDogcGFyYW1zLnRlbXBsYXRlO1xuXG4gICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICAvKiogQHR5cGUge0RvY3VtZW50RnJhZ21lbnR9ICovXG5cblxuICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudCA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgc2hvd1dhcm5pbmdzRm9yRWxlbWVudHModGVtcGxhdGVDb250ZW50KTtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKGdldFN3YWxQYXJhbXModGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEJ1dHRvbnModGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEltYWdlKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJY29uKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJbnB1dCh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsU3RyaW5nUGFyYW1zKHRlbXBsYXRlQ29udGVudCwgc3dhbFN0cmluZ1BhcmFtcykpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuICBjb25zdCBnZXRTd2FsUGFyYW1zID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG5cbiAgICBjb25zdCBzd2FsUGFyYW1zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1wYXJhbScpKTtcbiAgICBzd2FsUGFyYW1zLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhwYXJhbSwgWyduYW1lJywgJ3ZhbHVlJ10pO1xuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblxuICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdib29sZWFuJyAmJiB2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGRlZmF1bHRQYXJhbXNbcGFyYW1OYW1lXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsQnV0dG9ucyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG4gICAgY29uc3Qgc3dhbEJ1dHRvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWJ1dHRvbicpKTtcbiAgICBzd2FsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGJ1dHRvbiwgWyd0eXBlJywgJ2NvbG9yJywgJ2FyaWEtbGFiZWwnXSk7XG4gICAgICBjb25zdCB0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uVGV4dFwiKV0gPSBidXR0b24uaW5uZXJIVE1MO1xuICAgICAgcmVzdWx0W1wic2hvd1wiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIodHlwZSksIFwiQnV0dG9uXCIpXSA9IHRydWU7XG5cbiAgICAgIGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdjb2xvcicpKSB7XG4gICAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvbkNvbG9yXCIpXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdhcmlhLWxhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uQXJpYUxhYmVsXCIpXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsSW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpbWFnZSA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWltYWdlJyk7XG5cbiAgICBpZiAoaW1hZ2UpIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaW1hZ2UsIFsnc3JjJywgJ3dpZHRoJywgJ2hlaWdodCcsICdhbHQnXSk7XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVVybCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlV2lkdGggPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUhlaWdodCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2FsdCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUFsdCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEljb24gPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpY29uID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaWNvbicpO1xuXG4gICAgaWYgKGljb24pIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaWNvbiwgWyd0eXBlJywgJ2NvbG9yJ10pO1xuXG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSkge1xuICAgICAgICByZXN1bHQuaWNvbiA9IGljb24uZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpY29uLmhhc0F0dHJpYnV0ZSgnY29sb3InKSkge1xuICAgICAgICByZXN1bHQuaWNvbkNvbG9yID0gaWNvbi5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5pY29uSHRtbCA9IGljb24uaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxJbnB1dCA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cblxuICAgIGNvbnN0IGlucHV0ID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaW5wdXQnKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpbnB1dCwgWyd0eXBlJywgJ2xhYmVsJywgJ3BsYWNlaG9sZGVyJywgJ3ZhbHVlJ10pO1xuICAgICAgcmVzdWx0LmlucHV0ID0gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3RleHQnO1xuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdsYWJlbCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dExhYmVsID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFZhbHVlID0gaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG5cblxuICAgIGNvbnN0IGlucHV0T3B0aW9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtaW5wdXQtb3B0aW9uJykpO1xuXG4gICAgaWYgKGlucHV0T3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5pbnB1dE9wdGlvbnMgPSB7fTtcbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMob3B0aW9uLCBbJ3ZhbHVlJ10pO1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBvcHRpb24uaW5uZXJIVE1MO1xuICAgICAgICByZXN1bHQuaW5wdXRPcHRpb25zW29wdGlvblZhbHVlXSA9IG9wdGlvbk5hbWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1OYW1lc1xuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxTdHJpbmdQYXJhbXMgPSAodGVtcGxhdGVDb250ZW50LCBwYXJhbU5hbWVzKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1OYW1lcykge1xuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW1OYW1lc1tpXTtcbiAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICAgIGNvbnN0IHRhZyA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKHBhcmFtTmFtZSk7XG5cbiAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyh0YWcsIFtdKTtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZS5yZXBsYWNlKC9ec3dhbC0vLCAnJyldID0gdGFnLmlubmVySFRNTC50cmltKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yRWxlbWVudHMgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IGFsbG93ZWRFbGVtZW50cyA9IHN3YWxTdHJpbmdQYXJhbXMuY29uY2F0KFsnc3dhbC1wYXJhbScsICdzd2FsLWJ1dHRvbicsICdzd2FsLWltYWdlJywgJ3N3YWwtaWNvbicsICdzd2FsLWlucHV0JywgJ3N3YWwtaW5wdXQtb3B0aW9uJ10pO1xuICAgIEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LmNoaWxkcmVuKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChhbGxvd2VkRWxlbWVudHMuaW5kZXhPZih0YWdOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgd2FybihcIlVucmVjb2duaXplZCBlbGVtZW50IDxcIi5jb25jYXQodGFnTmFtZSwgXCI+XCIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbG93ZWRBdHRyaWJ1dGVzXG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyA9IChlbCwgYWxsb3dlZEF0dHJpYnV0ZXMpID0+IHtcbiAgICBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgIGlmIChhbGxvd2VkQXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZS5uYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgd2FybihbXCJVbnJlY29nbml6ZWQgYXR0cmlidXRlIFxcXCJcIi5jb25jYXQoYXR0cmlidXRlLm5hbWUsIFwiXFxcIiBvbiA8XCIpLmNvbmNhdChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIFwiPi5cIiksIFwiXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmxlbmd0aCA/IFwiQWxsb3dlZCBhdHRyaWJ1dGVzIGFyZTogXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmpvaW4oJywgJykpIDogJ1RvIHNldCB0aGUgdmFsdWUsIHVzZSBIVE1MIHdpdGhpbiB0aGUgZWxlbWVudC4nKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHZhciBkZWZhdWx0SW5wdXRWYWxpZGF0b3JzID0ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkIHwgc3RyaW5nPn1cbiAgICAgKi9cbiAgICBlbWFpbDogKHN0cmluZywgdmFsaWRhdGlvbk1lc3NhZ2UpID0+IHtcbiAgICAgIHJldHVybiAvXlthLXpBLVowLTkuK18tXStAW2EtekEtWjAtOS4tXStcXC5bYS16QS1aMC05LV17MiwyNH0kLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBlbWFpbCBhZGRyZXNzJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkIHwgc3RyaW5nPn1cbiAgICAgKi9cbiAgICB1cmw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODA5NDM1IHdpdGggYSBzbWFsbCBjaGFuZ2UgZnJvbSAjMTMwNiBhbmQgIzIwMTNcbiAgICAgIHJldHVybiAvXmh0dHBzPzpcXC9cXC8od3d3XFwuKT9bLWEtekEtWjAtOUA6JS5fK34jPV17MSwyNTZ9XFwuW2Etel17Miw2M31cXGIoWy1hLXpBLVowLTlAOiVfKy5+Iz8mLz1dKikkLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBVUkwnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBmdW5jdGlvbiBzZXREZWZhdWx0SW5wdXRWYWxpZGF0b3JzKHBhcmFtcykge1xuICAgIC8vIFVzZSBkZWZhdWx0IGBpbnB1dFZhbGlkYXRvcmAgZm9yIHN1cHBvcnRlZCBpbnB1dCB0eXBlcyBpZiBub3QgcHJvdmlkZWRcbiAgICBpZiAoIXBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdElucHV0VmFsaWRhdG9ycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAocGFyYW1zLmlucHV0ID09PSBrZXkpIHtcbiAgICAgICAgICBwYXJhbXMuaW5wdXRWYWxpZGF0b3IgPSBkZWZhdWx0SW5wdXRWYWxpZGF0b3JzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcykge1xuICAgIC8vIERldGVybWluZSBpZiB0aGUgY3VzdG9tIHRhcmdldCBlbGVtZW50IGlzIHZhbGlkXG4gICAgaWYgKCFwYXJhbXMudGFyZ2V0IHx8IHR5cGVvZiBwYXJhbXMudGFyZ2V0ID09PSAnc3RyaW5nJyAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGFyZ2V0KSB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCAhPT0gJ3N0cmluZycgJiYgIXBhcmFtcy50YXJnZXQuYXBwZW5kQ2hpbGQpIHtcbiAgICAgIHdhcm4oJ1RhcmdldCBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiYm9keVwiJyk7XG4gICAgICBwYXJhbXMudGFyZ2V0ID0gJ2JvZHknO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2V0IHR5cGUsIHRleHQgYW5kIGFjdGlvbnMgb24gcG9wdXBcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gc2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcbiAgICBzZXREZWZhdWx0SW5wdXRWYWxpZGF0b3JzKHBhcmFtcyk7IC8vIHNob3dMb2FkZXJPbkNvbmZpcm0gJiYgcHJlQ29uZmlybVxuXG4gICAgaWYgKHBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtICYmICFwYXJhbXMucHJlQ29uZmlybSkge1xuICAgICAgd2Fybignc2hvd0xvYWRlck9uQ29uZmlybSBpcyBzZXQgdG8gdHJ1ZSwgYnV0IHByZUNvbmZpcm0gaXMgbm90IGRlZmluZWQuXFxuJyArICdzaG93TG9hZGVyT25Db25maXJtIHNob3VsZCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggcHJlQ29uZmlybSwgc2VlIHVzYWdlIGV4YW1wbGU6XFxuJyArICdodHRwczovL3N3ZWV0YWxlcnQyLmdpdGh1Yi5pby8jYWpheC1yZXF1ZXN0Jyk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcyk7IC8vIFJlcGxhY2UgbmV3bGluZXMgd2l0aCA8YnI+IGluIHRpdGxlXG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy50aXRsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhcmFtcy50aXRsZSA9IHBhcmFtcy50aXRsZS5zcGxpdCgnXFxuJykuam9pbignPGJyIC8+Jyk7XG4gICAgfVxuXG4gICAgaW5pdChwYXJhbXMpO1xuICB9XG5cbiAgY2xhc3MgVGltZXIge1xuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBkZWxheSkge1xuICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgdGhpcy5yZW1haW5pbmcgPSBkZWxheTtcbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5pZCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5yZW1haW5pbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgLT0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0ZWQuZ2V0VGltZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgaW5jcmVhc2Uobikge1xuICAgICAgY29uc3QgcnVubmluZyA9IHRoaXMucnVubmluZztcblxuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtYWluaW5nICs9IG47XG5cbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGdldFRpbWVyTGVmdCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bm5pbmc7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBmaXhTY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgLy8gZm9yIHF1ZXVlcywgZG8gbm90IGRvIHRoaXMgbW9yZSB0aGFuIG9uY2VcbiAgICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIGlmIHRoZSBib2R5IGhhcyBvdmVyZmxvd1xuXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIHNvIHRoZSBjb250ZW50IGRvZXNuJ3Qgc2hpZnQgYWZ0ZXIgcmVtb3ZhbCBvZiBzY3JvbGxiYXJcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgKyBtZWFzdXJlU2Nyb2xsYmFyKCksIFwicHhcIik7XG4gICAgfVxuICB9O1xuICBjb25zdCB1bmRvU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIGlmIChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIlwiLmNvbmNhdChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZywgXCJweFwiKTtcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuICBjb25zdCBpT1NmaXggPSAoKSA9PiB7XG4gICAgY29uc3QgaU9TID0gLy8gQHRzLWlnbm9yZVxuICAgIC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICF3aW5kb3cuTVNTdHJlYW0gfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09PSAnTWFjSW50ZWwnICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDE7XG5cbiAgICBpZiAoaU9TICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gXCJcIi5jb25jYXQob2Zmc2V0ICogLTEsIFwicHhcIik7XG4gICAgICBhZGRDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpO1xuICAgICAgbG9ja0JvZHlTY3JvbGwoKTtcbiAgICAgIGFkZEJvdHRvbVBhZGRpbmdGb3JUYWxsUG9wdXBzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xOTQ4XG4gICAqL1xuXG4gIGNvbnN0IGFkZEJvdHRvbVBhZGRpbmdGb3JUYWxsUG9wdXBzID0gKCkgPT4ge1xuICAgIGNvbnN0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICBjb25zdCBpT1MgPSAhIXVhLm1hdGNoKC9pUGFkL2kpIHx8ICEhdWEubWF0Y2goL2lQaG9uZS9pKTtcbiAgICBjb25zdCB3ZWJraXQgPSAhIXVhLm1hdGNoKC9XZWJLaXQvaSk7XG4gICAgY29uc3QgaU9TU2FmYXJpID0gaU9TICYmIHdlYmtpdCAmJiAhdWEubWF0Y2goL0NyaU9TL2kpO1xuXG4gICAgaWYgKGlPU1NhZmFyaSkge1xuICAgICAgY29uc3QgYm90dG9tUGFuZWxIZWlnaHQgPSA0NDtcblxuICAgICAgaWYgKGdldFBvcHVwKCkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0IC0gYm90dG9tUGFuZWxIZWlnaHQpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKCkuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiXCIuY29uY2F0KGJvdHRvbVBhbmVsSGVpZ2h0LCBcInB4XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0NlxuICAgKi9cblxuXG4gIGNvbnN0IGxvY2tCb2R5U2Nyb2xsID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGxldCBwcmV2ZW50VG91Y2hNb3ZlO1xuXG4gICAgY29udGFpbmVyLm9udG91Y2hzdGFydCA9IGUgPT4ge1xuICAgICAgcHJldmVudFRvdWNoTW92ZSA9IHNob3VsZFByZXZlbnRUb3VjaE1vdmUoZSk7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbnRvdWNobW92ZSA9IGUgPT4ge1xuICAgICAgaWYgKHByZXZlbnRUb3VjaE1vdmUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgY29uc3Qgc2hvdWxkUHJldmVudFRvdWNoTW92ZSA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgICBpZiAoaXNTdHlsdXMoZXZlbnQpIHx8IGlzWm9vbShldmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0ID09PSBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNTY3JvbGxhYmxlKGNvbnRhaW5lcikgJiYgdGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcgJiYgLy8gIzE2MDNcbiAgICB0YXJnZXQudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJyAmJiAvLyAjMjI2NlxuICAgICEoaXNTY3JvbGxhYmxlKGdldEh0bWxDb250YWluZXIoKSkgJiYgLy8gIzE5NDRcbiAgICBnZXRIdG1sQ29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTc4NlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGlzU3R5bHVzID0gZXZlbnQgPT4ge1xuICAgIHJldHVybiBldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoICYmIGV2ZW50LnRvdWNoZXNbMF0udG91Y2hUeXBlID09PSAnc3R5bHVzJztcbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTg5MVxuICAgKlxuICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGlzWm9vbSA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA+IDE7XG4gIH07XG5cbiAgY29uc3QgdW5kb0lPU2ZpeCA9ICgpID0+IHtcbiAgICBpZiAoaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5zdHlsZS50b3AsIDEwKTtcbiAgICAgIHJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBvZmZzZXQgKiAtMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgU0hPV19DTEFTU19USU1FT1VUID0gMTA7XG4gIC8qKlxuICAgKiBPcGVuIHBvcHVwLCBhZGQgbmVjZXNzYXJ5IGNsYXNzZXMgYW5kIHN0eWxlcywgZml4IHNjcm9sbGJhclxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IG9wZW5Qb3B1cCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMud2lsbE9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBhcmFtcy53aWxsT3Blbihwb3B1cCk7XG4gICAgfVxuXG4gICAgY29uc3QgYm9keVN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICAgIGNvbnN0IGluaXRpYWxCb2R5T3ZlcmZsb3cgPSBib2R5U3R5bGVzLm92ZXJmbG93WTtcbiAgICBhZGRDbGFzc2VzJDEoY29udGFpbmVyLCBwb3B1cCwgcGFyYW1zKTsgLy8gc2Nyb2xsaW5nIGlzICdoaWRkZW4nIHVudGlsIGFuaW1hdGlvbiBpcyBkb25lLCBhZnRlciB0aGF0ICdhdXRvJ1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5KGNvbnRhaW5lciwgcG9wdXApO1xuICAgIH0sIFNIT1dfQ0xBU1NfVElNRU9VVCk7XG5cbiAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICBmaXhTY3JvbGxDb250YWluZXIoY29udGFpbmVyLCBwYXJhbXMuc2Nyb2xsYmFyUGFkZGluZywgaW5pdGlhbEJvZHlPdmVyZmxvdyk7XG4gICAgICBzZXRBcmlhSGlkZGVuKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1RvYXN0KCkgJiYgIWdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCkge1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5kaWRPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHBhcmFtcy5kaWRPcGVuKHBvcHVwKSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1snbm8tdHJhbnNpdGlvbiddKTtcbiAgfTtcblxuICBjb25zdCBzd2FsT3BlbkFuaW1hdGlvbkZpbmlzaGVkID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmIChldmVudC50YXJnZXQgIT09IHBvcHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdhdXRvJztcbiAgfTtcblxuICBjb25zdCBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5ID0gKGNvbnRhaW5lciwgcG9wdXApID0+IHtcbiAgICBpZiAoYW5pbWF0aW9uRW5kRXZlbnQgJiYgaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKSkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xuICAgICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpeFNjcm9sbENvbnRhaW5lciA9IChjb250YWluZXIsIHNjcm9sbGJhclBhZGRpbmcsIGluaXRpYWxCb2R5T3ZlcmZsb3cpID0+IHtcbiAgICBpT1NmaXgoKTtcblxuICAgIGlmIChzY3JvbGxiYXJQYWRkaW5nICYmIGluaXRpYWxCb2R5T3ZlcmZsb3cgIT09ICdoaWRkZW4nKSB7XG4gICAgICBmaXhTY3JvbGxiYXIoKTtcbiAgICB9IC8vIHN3ZWV0YWxlcnQyL2lzc3Vlcy8xMjQ3XG5cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IDA7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xhc3NlcyQxID0gKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIGFkZENsYXNzKGNvbnRhaW5lciwgcGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7IC8vIHRoaXMgd29ya2Fyb3VuZCB3aXRoIG9wYWNpdHkgaXMgbmVlZGVkIGZvciBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIwNTlcblxuICAgIHBvcHVwLnN0eWxlLnNldFByb3BlcnR5KCdvcGFjaXR5JywgJzAnLCAnaW1wb3J0YW50Jyk7XG4gICAgc2hvdyhwb3B1cCwgJ2dyaWQnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEFuaW1hdGUgcG9wdXAgcmlnaHQgYWZ0ZXIgc2hvd2luZyBpdFxuICAgICAgYWRkQ2xhc3MocG9wdXAsIHBhcmFtcy5zaG93Q2xhc3MucG9wdXApOyAvLyBhbmQgcmVtb3ZlIHRoZSBvcGFjaXR5IHdvcmthcm91bmRcblxuICAgICAgcG9wdXAuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ29wYWNpdHknKTtcbiAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpOyAvLyAxMG1zIGluIG9yZGVyIHRvIGZpeCAjMjA2MlxuXG4gICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzLnNob3duKTtcblxuICAgIGlmIChwYXJhbXMuaGVpZ2h0QXV0byAmJiBwYXJhbXMuYmFja2Ryb3AgJiYgIXBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3dzIGxvYWRlciAoc3Bpbm5lciksIHRoaXMgaXMgdXNlZnVsIHdpdGggQUpBWCByZXF1ZXN0cy5cbiAgICogQnkgZGVmYXVsdCB0aGUgbG9hZGVyIGJlIHNob3duIGluc3RlYWQgb2YgdGhlIFwiQ29uZmlybVwiIGJ1dHRvbi5cbiAgICovXG5cbiAgY29uc3Qgc2hvd0xvYWRpbmcgPSBidXR0b25Ub1JlcGxhY2UgPT4ge1xuICAgIGxldCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICBuZXcgU3dhbCgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH1cblxuICAgIHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTtcblxuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIGhpZGUoZ2V0SWNvbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZUJ1dHRvbihwb3B1cCwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICB9XG5cbiAgICBzaG93KGxvYWRlcik7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnLCAndHJ1ZScpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgJ3RydWUnKTtcbiAgICBwb3B1cC5mb2N1cygpO1xuICB9O1xuXG4gIGNvbnN0IHJlcGxhY2VCdXR0b24gPSAocG9wdXAsIGJ1dHRvblRvUmVwbGFjZSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBnZXRBY3Rpb25zKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG5cbiAgICBpZiAoIWJ1dHRvblRvUmVwbGFjZSAmJiBpc1Zpc2libGUoZ2V0Q29uZmlybUJ1dHRvbigpKSkge1xuICAgICAgYnV0dG9uVG9SZXBsYWNlID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHNob3coYWN0aW9ucyk7XG5cbiAgICBpZiAoYnV0dG9uVG9SZXBsYWNlKSB7XG4gICAgICBoaWRlKGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgICBsb2FkZXIuc2V0QXR0cmlidXRlKCdkYXRhLWJ1dHRvbi10by1yZXBsYWNlJywgYnV0dG9uVG9SZXBsYWNlLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgbG9hZGVyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGxvYWRlciwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICBhZGRDbGFzcyhbcG9wdXAsIGFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0gJ3NlbGVjdCcgfHwgcGFyYW1zLmlucHV0ID09PSAncmFkaW8nKSB7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfSBlbHNlIGlmIChbJ3RleHQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ3RlbCcsICd0ZXh0YXJlYSddLmluY2x1ZGVzKHBhcmFtcy5pbnB1dCkgJiYgKGhhc1RvUHJvbWlzZUZuKHBhcmFtcy5pbnB1dFZhbHVlKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpKSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0Q29uZmlybUJ1dHRvbigpKTtcbiAgICAgIGhhbmRsZUlucHV0VmFsdWUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfVxuICB9O1xuICBjb25zdCBnZXRJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgcmV0dXJuIGdldENoZWNrYm94VmFsdWUoaW5wdXQpO1xuXG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBnZXRSYWRpb1ZhbHVlKGlucHV0KTtcblxuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBnZXRGaWxlVmFsdWUoaW5wdXQpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaW5uZXJQYXJhbXMuaW5wdXRBdXRvVHJpbSA/IGlucHV0LnZhbHVlLnRyaW0oKSA6IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBnZXRDaGVja2JveFZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IDEgOiAwO1xuXG4gIGNvbnN0IGdldFJhZGlvVmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5jaGVja2VkID8gaW5wdXQudmFsdWUgOiBudWxsO1xuXG4gIGNvbnN0IGdldEZpbGVWYWx1ZSA9IGlucHV0ID0+IGlucHV0LmZpbGVzLmxlbmd0aCA/IGlucHV0LmdldEF0dHJpYnV0ZSgnbXVsdGlwbGUnKSAhPT0gbnVsbCA/IGlucHV0LmZpbGVzIDogaW5wdXQuZmlsZXNbMF0gOiBudWxsO1xuXG4gIGNvbnN0IGhhbmRsZUlucHV0T3B0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgY29uc3QgcHJvY2Vzc0lucHV0T3B0aW9ucyA9IGlucHV0T3B0aW9ucyA9PiBwb3B1bGF0ZUlucHV0T3B0aW9uc1twYXJhbXMuaW5wdXRdKHBvcHVwLCBmb3JtYXRJbnB1dE9wdGlvbnMoaW5wdXRPcHRpb25zKSwgcGFyYW1zKTtcblxuICAgIGlmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRPcHRpb25zKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykudGhlbihpbnB1dE9wdGlvbnMgPT4ge1xuICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICBwcm9jZXNzSW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhwYXJhbXMuaW5wdXRPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRPcHRpb25zISBFeHBlY3RlZCBvYmplY3QsIE1hcCBvciBQcm9taXNlLCBnb3QgXCIuY29uY2F0KHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsdWUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcbiAgICBoaWRlKGlucHV0KTtcbiAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpLnRoZW4oaW5wdXRWYWx1ZSA9PiB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dCA9PT0gJ251bWJlcicgPyBwYXJzZUZsb2F0KGlucHV0VmFsdWUpIHx8IDAgOiBcIlwiLmNvbmNhdChpbnB1dFZhbHVlKTtcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGVycm9yKFwiRXJyb3IgaW4gaW5wdXRWYWx1ZSBwcm9taXNlOiBcIi5jb25jYXQoZXJyKSk7XG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgc2hvdyhpbnB1dCk7XG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBwb3B1bGF0ZUlucHV0T3B0aW9ucyA9IHtcbiAgICBzZWxlY3Q6IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcblxuICAgICAgY29uc3QgcmVuZGVyT3B0aW9uID0gKHBhcmVudCwgb3B0aW9uTGFiZWwsIG9wdGlvblZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgc2V0SW5uZXJIdG1sKG9wdGlvbiwgb3B0aW9uTGFiZWwpO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBpc1NlbGVjdGVkKG9wdGlvblZhbHVlLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgfTtcblxuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goaW5wdXRPcHRpb24gPT4ge1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IGlucHV0T3B0aW9uWzBdO1xuICAgICAgICBjb25zdCBvcHRpb25MYWJlbCA9IGlucHV0T3B0aW9uWzFdOyAvLyA8b3B0Z3JvdXA+IHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNDAxL2ludGVyYWN0L2Zvcm1zLmh0bWwjaC0xNy42XG4gICAgICAgIC8vIFwiLi4uYWxsIE9QVEdST1VQIGVsZW1lbnRzIG11c3QgYmUgc3BlY2lmaWVkIGRpcmVjdGx5IHdpdGhpbiBhIFNFTEVDVCBlbGVtZW50IChpLmUuLCBncm91cHMgbWF5IG5vdCBiZSBuZXN0ZWQpLi4uXCJcbiAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIGlzIGEgPG9wdGdyb3VwPlxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbkxhYmVsKSkge1xuICAgICAgICAgIC8vIGlmIGl0IGlzIGFuIGFycmF5LCB0aGVuIGl0IGlzIGFuIDxvcHRncm91cD5cbiAgICAgICAgICBjb25zdCBvcHRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJyk7XG4gICAgICAgICAgb3B0Z3JvdXAubGFiZWwgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgICBvcHRncm91cC5kaXNhYmxlZCA9IGZhbHNlOyAvLyBub3QgY29uZmlndXJhYmxlIGZvciBub3dcblxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRncm91cCk7XG4gICAgICAgICAgb3B0aW9uTGFiZWwuZm9yRWFjaChvID0+IHJlbmRlck9wdGlvbihvcHRncm91cCwgb1sxXSwgb1swXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhc2Ugb2YgPG9wdGlvbj5cbiAgICAgICAgICByZW5kZXJPcHRpb24oc2VsZWN0LCBvcHRpb25MYWJlbCwgb3B0aW9uVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdC5mb2N1cygpO1xuICAgIH0sXG4gICAgcmFkaW86IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHJhZGlvID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5yYWRpbyk7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChpbnB1dE9wdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IHJhZGlvVmFsdWUgPSBpbnB1dE9wdGlvblswXTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICByYWRpb0lucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgICByYWRpb0lucHV0Lm5hbWUgPSBzd2FsQ2xhc3Nlcy5yYWRpbztcbiAgICAgICAgcmFkaW9JbnB1dC52YWx1ZSA9IHJhZGlvVmFsdWU7XG5cbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQocmFkaW9WYWx1ZSwgcGFyYW1zLmlucHV0VmFsdWUpKSB7XG4gICAgICAgICAgcmFkaW9JbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzZXRJbm5lckh0bWwobGFiZWwsIHJhZGlvTGFiZWwpO1xuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5sYWJlbDtcbiAgICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQocmFkaW9JbnB1dCk7XG4gICAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgICAgcmFkaW8uYXBwZW5kQ2hpbGQocmFkaW9MYWJlbEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCByYWRpb3MgPSByYWRpby5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgICBpZiAocmFkaW9zLmxlbmd0aCkge1xuICAgICAgICByYWRpb3NbMF0uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgaW5wdXRPcHRpb25zYCBpbnRvIGFuIGFycmF5IG9mIGBbdmFsdWUsIGxhYmVsXWBzXG4gICAqIEBwYXJhbSBpbnB1dE9wdGlvbnNcbiAgICovXG5cbiAgY29uc3QgZm9ybWF0SW5wdXRPcHRpb25zID0gaW5wdXRPcHRpb25zID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGlmICh0eXBlb2YgTWFwICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dE9wdGlvbnMgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZUZvcm1hdHRlZCA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhpbnB1dE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlRm9ybWF0dGVkID0gaW5wdXRPcHRpb25zW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUZvcm1hdHRlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRncm91cD5cbiAgICAgICAgICB2YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdElucHV0T3B0aW9ucyh2YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaChba2V5LCB2YWx1ZUZvcm1hdHRlZF0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCBpc1NlbGVjdGVkID0gKG9wdGlvblZhbHVlLCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIGlucHV0VmFsdWUgJiYgaW5wdXRWYWx1ZS50b1N0cmluZygpID09PSBvcHRpb25WYWx1ZS50b1N0cmluZygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyBsb2FkZXIgYW5kIHNob3dzIGJhY2sgdGhlIGJ1dHRvbiB3aGljaCB3YXMgaGlkZGVuIGJ5IC5zaG93TG9hZGluZygpXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGhpZGVMb2FkaW5nKCkge1xuICAgIC8vIGRvIG5vdGhpbmcgaWYgcG9wdXAgaXMgY2xvc2VkXG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBoaWRlKGRvbUNhY2hlLmxvYWRlcik7XG5cbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICBpZiAoaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgICBzaG93KGdldEljb24oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dSZWxhdGVkQnV0dG9uKGRvbUNhY2hlKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzcyhbZG9tQ2FjaGUucG9wdXAsIGRvbUNhY2hlLmFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgICBkb21DYWNoZS5wb3B1cC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYnVzeScpO1xuICAgIGRvbUNhY2hlLnBvcHVwLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJyk7XG4gICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGRvbUNhY2hlLmRlbnlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHNob3dSZWxhdGVkQnV0dG9uID0gZG9tQ2FjaGUgPT4ge1xuICAgIGNvbnN0IGJ1dHRvblRvUmVwbGFjZSA9IGRvbUNhY2hlLnBvcHVwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZG9tQ2FjaGUubG9hZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1idXR0b24tdG8tcmVwbGFjZScpKTtcblxuICAgIGlmIChidXR0b25Ub1JlcGxhY2UubGVuZ3RoKSB7XG4gICAgICBzaG93KGJ1dHRvblRvUmVwbGFjZVswXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIH0gZWxzZSBpZiAoYWxsQnV0dG9uc0FyZUhpZGRlbigpKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLmFjdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5wdXQgRE9NIG5vZGUsIHRoaXMgbWV0aG9kIHdvcmtzIHdpdGggaW5wdXQgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRJbnB1dCQxKGluc3RhbmNlKSB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHRoaXMpO1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSB8fCB0aGlzKTtcblxuICAgIGlmICghZG9tQ2FjaGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRJbnB1dChkb21DYWNoZS5wb3B1cCwgaW5uZXJQYXJhbXMuaW5wdXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG4gIHZhciBwcml2YXRlTWV0aG9kcyA9IHtcbiAgICBzd2FsUHJvbWlzZVJlc29sdmU6IG5ldyBXZWFrTWFwKCksXG4gICAgc3dhbFByb21pc2VSZWplY3Q6IG5ldyBXZWFrTWFwKClcbiAgfTtcblxuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIFN3ZWV0QWxlcnQyIHBvcHVwIGlzIHNob3duXG4gICAqL1xuXG4gIGNvbnN0IGlzVmlzaWJsZSQxID0gKCkgPT4ge1xuICAgIHJldHVybiBpc1Zpc2libGUoZ2V0UG9wdXAoKSk7XG4gIH07XG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnQ29uZmlybScgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrQ29uZmlybSA9ICgpID0+IGdldENvbmZpcm1CdXR0b24oKSAmJiBnZXRDb25maXJtQnV0dG9uKCkuY2xpY2soKTtcbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdEZW55JyBidXR0b25cbiAgICovXG5cbiAgY29uc3QgY2xpY2tEZW55ID0gKCkgPT4gZ2V0RGVueUJ1dHRvbigpICYmIGdldERlbnlCdXR0b24oKS5jbGljaygpO1xuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NhbmNlbCcgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrQ2FuY2VsID0gKCkgPT4gZ2V0Q2FuY2VsQnV0dG9uKCkgJiYgZ2V0Q2FuY2VsQnV0dG9uKCkuY2xpY2soKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICovXG5cbiAgY29uc3QgcmVtb3ZlS2V5ZG93bkhhbmRsZXIgPSBnbG9iYWxTdGF0ZSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQgJiYgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCkge1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXIsIHtcbiAgICAgICAgY2FwdHVyZTogZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZVxuICAgICAgfSk7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkID0gZmFsc2U7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHsqfSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBhZGRLZXlkb3duSGFuZGxlciA9IChpbnN0YW5jZSwgZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIHJlbW92ZUtleWRvd25IYW5kbGVyKGdsb2JhbFN0YXRlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyID0gZSA9PiBrZXlkb3duSGFuZGxlcihpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpO1xuXG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0ID0gaW5uZXJQYXJhbXMua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA/IHdpbmRvdyA6IGdldFBvcHVwKCk7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlID0gaW5uZXJQYXJhbXMua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmNyZW1lbnRcbiAgICovXG5cbiAgY29uc3Qgc2V0Rm9jdXMgPSAoaW5uZXJQYXJhbXMsIGluZGV4LCBpbmNyZW1lbnQpID0+IHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKCk7IC8vIHNlYXJjaCBmb3IgdmlzaWJsZSBlbGVtZW50cyBhbmQgc2VsZWN0IHRoZSBuZXh0IHBvc3NpYmxlIG1hdGNoXG5cbiAgICBpZiAoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IGluZGV4ICsgaW5jcmVtZW50OyAvLyByb2xsb3ZlciB0byBmaXJzdCBpdGVtXG5cbiAgICAgIGlmIChpbmRleCA9PT0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gMDsgLy8gZ28gdG8gbGFzdCBpdGVtXG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBpbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb2N1c2FibGVFbGVtZW50c1tpbmRleF0uZm9jdXMoKTtcbiAgICB9IC8vIG5vIHZpc2libGUgZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyB0aGUgcG9wdXBcblxuXG4gICAgZ2V0UG9wdXAoKS5mb2N1cygpO1xuICB9O1xuICBjb25zdCBhcnJvd0tleXNOZXh0QnV0dG9uID0gWydBcnJvd1JpZ2h0JywgJ0Fycm93RG93biddO1xuICBjb25zdCBhcnJvd0tleXNQcmV2aW91c0J1dHRvbiA9IFsnQXJyb3dMZWZ0JywgJ0Fycm93VXAnXTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBrZXlkb3duSGFuZGxlciA9IChpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfSAvLyBJZ25vcmUga2V5ZG93biBkdXJpbmcgSU1FIGNvbXBvc2l0aW9uXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RvY3VtZW50L2tleWRvd25fZXZlbnQjaWdub3Jpbmdfa2V5ZG93bl9kdXJpbmdfaW1lX2NvbXBvc2l0aW9uXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy83MjBcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzI0MDZcblxuXG4gICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuc3RvcEtleWRvd25Qcm9wYWdhdGlvbikge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9IC8vIEVOVEVSXG5cblxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgaGFuZGxlRW50ZXIoaW5zdGFuY2UsIGUsIGlubmVyUGFyYW1zKTtcbiAgICB9IC8vIFRBQlxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgaGFuZGxlVGFiKGUsIGlubmVyUGFyYW1zKTtcbiAgICB9IC8vIEFSUk9XUyAtIHN3aXRjaCBmb2N1cyBiZXR3ZWVuIGJ1dHRvbnNcbiAgICBlbHNlIGlmIChbLi4uYXJyb3dLZXlzTmV4dEJ1dHRvbiwgLi4uYXJyb3dLZXlzUHJldmlvdXNCdXR0b25dLmluY2x1ZGVzKGUua2V5KSkge1xuICAgICAgaGFuZGxlQXJyb3dzKGUua2V5KTtcbiAgICB9IC8vIEVTQ1xuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgaGFuZGxlRXNjKGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlRW50ZXIgPSAoaW5zdGFuY2UsIGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMzg2XG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlLnRhcmdldCAmJiBpbnN0YW5jZS5nZXRJbnB1dCgpICYmIGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgZS50YXJnZXQub3V0ZXJIVE1MID09PSBpbnN0YW5jZS5nZXRJbnB1dCgpLm91dGVySFRNTCkge1xuICAgICAgaWYgKFsndGV4dGFyZWEnLCAnZmlsZSddLmluY2x1ZGVzKGlubmVyUGFyYW1zLmlucHV0KSkge1xuICAgICAgICByZXR1cm47IC8vIGRvIG5vdCBzdWJtaXRcbiAgICAgIH1cblxuICAgICAgY2xpY2tDb25maXJtKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlVGFiID0gKGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gZ2V0Rm9jdXNhYmxlRWxlbWVudHMoKTtcbiAgICBsZXQgYnRuSW5kZXggPSAtMTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0YXJnZXRFbGVtZW50ID09PSBmb2N1c2FibGVFbGVtZW50c1tpXSkge1xuICAgICAgICBidG5JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gLy8gQ3ljbGUgdG8gdGhlIG5leHQgYnV0dG9uXG5cblxuICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIGJ0bkluZGV4LCAxKTtcbiAgICB9IC8vIEN5Y2xlIHRvIHRoZSBwcmV2IGJ1dHRvblxuICAgIGVsc2Uge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIGJ0bkluZGV4LCAtMSk7XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlQXJyb3dzID0ga2V5ID0+IHtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICFbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXS5pbmNsdWRlcyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNpYmxpbmcgPSBhcnJvd0tleXNOZXh0QnV0dG9uLmluY2x1ZGVzKGtleSkgPyAnbmV4dEVsZW1lbnRTaWJsaW5nJyA6ICdwcmV2aW91c0VsZW1lbnRTaWJsaW5nJztcbiAgICBsZXQgYnV0dG9uVG9Gb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdldEFjdGlvbnMoKS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgYnV0dG9uVG9Gb2N1cyA9IGJ1dHRvblRvRm9jdXNbc2libGluZ107XG5cbiAgICAgIGlmICghYnV0dG9uVG9Gb2N1cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQgJiYgaXNWaXNpYmxlKGJ1dHRvblRvRm9jdXMpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVFc2MgPSAoZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaWYgKGNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93RXNjYXBlS2V5KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5lc2MpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBJbnN0YW5jZSBtZXRob2QgdG8gY2xvc2Ugc3dlZXRBbGVydFxuICAgKi9cblxuICBmdW5jdGlvbiByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUoaW5zdGFuY2UsIGNvbnRhaW5lciwgcmV0dXJuRm9jdXMsIGRpZENsb3NlKSB7XG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0b3JlQWN0aXZlRWxlbWVudChyZXR1cm5Gb2N1cykudGhlbigoKSA9PiB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlKGluc3RhbmNlLCBkaWRDbG9zZSkpO1xuICAgICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzU2FmYXJpID0gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gd29ya2Fyb3VuZCBmb3IgIzIwODhcbiAgICAvLyBmb3Igc29tZSByZWFzb24gcmVtb3ZpbmcgdGhlIGNvbnRhaW5lciBpbiBTYWZhcmkgd2lsbCBzY3JvbGwgdGhlIGRvY3VtZW50IHRvIGJvdHRvbVxuXG4gICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmUgIWltcG9ydGFudCcpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIHVuZG9TY3JvbGxiYXIoKTtcbiAgICAgIHVuZG9JT1NmaXgoKTtcbiAgICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cblxuICAgIHJlbW92ZUJvZHlDbGFzc2VzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVCb2R5Q2xhc3NlcygpIHtcbiAgICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzLnNob3duLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZShyZXNvbHZlVmFsdWUpIHtcbiAgICByZXNvbHZlVmFsdWUgPSBwcmVwYXJlUmVzb2x2ZVZhbHVlKHJlc29sdmVWYWx1ZSk7XG4gICAgY29uc3Qgc3dhbFByb21pc2VSZXNvbHZlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLmdldCh0aGlzKTtcbiAgICBjb25zdCBkaWRDbG9zZSA9IHRyaWdnZXJDbG9zZVBvcHVwKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgLy8gQSBzd2FsIGF3YWl0aW5nIGZvciBhIHByb21pc2UgKGFmdGVyIGEgY2xpY2sgb24gQ29uZmlybSBvciBEZW55KSBjYW5ub3QgYmUgZGlzbWlzc2VkIGFueW1vcmUgIzIzMzVcbiAgICAgIGlmICghcmVzb2x2ZVZhbHVlLmlzRGlzbWlzc2VkKSB7XG4gICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZSh0aGlzKTtcbiAgICAgICAgc3dhbFByb21pc2VSZXNvbHZlKHJlc29sdmVWYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaWRDbG9zZSkge1xuICAgICAgLy8gUmVzb2x2ZSBTd2FsIHByb21pc2VcbiAgICAgIHN3YWxQcm9taXNlUmVzb2x2ZShyZXNvbHZlVmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpc0F3YWl0aW5nUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gISFwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLmdldCh0aGlzKTtcbiAgfVxuXG4gIGNvbnN0IHRyaWdnZXJDbG9zZVBvcHVwID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcyB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MucG9wdXApO1xuICAgIGFkZENsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApO1xuICAgIGNvbnN0IGJhY2tkcm9wID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcmVtb3ZlQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7XG4gICAgYWRkQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9wdXBBbmltYXRpb24oaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShlcnJvcikge1xuICAgIGNvbnN0IHJlamVjdFByb21pc2UgPSBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlamVjdC5nZXQodGhpcyk7XG4gICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKHRoaXMpO1xuXG4gICAgaWYgKHJlamVjdFByb21pc2UpIHtcbiAgICAgIC8vIFJlamVjdCBTd2FsIHByb21pc2VcbiAgICAgIHJlamVjdFByb21pc2UoZXJyb3IpO1xuICAgIH1cbiAgfVxuICBjb25zdCBoYW5kbGVBd2FpdGluZ1Byb21pc2UgPSBpbnN0YW5jZSA9PiB7XG4gICAgaWYgKGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2UuZGVsZXRlKGluc3RhbmNlKTsgLy8gVGhlIGluc3RhbmNlIG1pZ2h0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVzdW1lIHRoZSBkZXN0cm95IHByb2Nlc3MgaW4gdGhpcyBjYXNlICMyMzM1XG5cbiAgICAgIGlmICghcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSkpIHtcbiAgICAgICAgaW5zdGFuY2UuX2Rlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcHJlcGFyZVJlc29sdmVWYWx1ZSA9IHJlc29sdmVWYWx1ZSA9PiB7XG4gICAgLy8gV2hlbiB1c2VyIGNhbGxzIFN3YWwuY2xvc2UoKVxuICAgIGlmICh0eXBlb2YgcmVzb2x2ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNDb25maXJtZWQ6IGZhbHNlLFxuICAgICAgICBpc0RlbmllZDogZmFsc2UsXG4gICAgICAgIGlzRGlzbWlzc2VkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgIGlzRGVuaWVkOiBmYWxzZSxcbiAgICAgIGlzRGlzbWlzc2VkOiBmYWxzZVxuICAgIH0sIHJlc29sdmVWYWx1ZSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUG9wdXBBbmltYXRpb24gPSAoaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpOyAvLyBJZiBhbmltYXRpb24gaXMgc3VwcG9ydGVkLCBhbmltYXRlXG5cbiAgICBjb25zdCBhbmltYXRpb25Jc1N1cHBvcnRlZCA9IGFuaW1hdGlvbkVuZEV2ZW50ICYmIGhhc0Nzc0FuaW1hdGlvbihwb3B1cCk7XG5cbiAgICBpZiAodHlwZW9mIGlubmVyUGFyYW1zLndpbGxDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMud2lsbENsb3NlKHBvcHVwKTtcbiAgICB9XG5cbiAgICBpZiAoYW5pbWF0aW9uSXNTdXBwb3J0ZWQpIHtcbiAgICAgIGFuaW1hdGVQb3B1cChpbnN0YW5jZSwgcG9wdXAsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCByZW1vdmUgaW1tZWRpYXRlbHlcbiAgICAgIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShpbnN0YW5jZSwgY29udGFpbmVyLCBpbm5lclBhcmFtcy5yZXR1cm5Gb2N1cywgaW5uZXJQYXJhbXMuZGlkQ2xvc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhbmltYXRlUG9wdXAgPSAoaW5zdGFuY2UsIHBvcHVwLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkgPT4ge1xuICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjayA9IHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZS5iaW5kKG51bGwsIGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSk7XG4gICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gcG9wdXApIHtcbiAgICAgICAgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKCk7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZSA9IChpbnN0YW5jZSwgZGlkQ2xvc2UpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZGlkQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGlkQ2xvc2UuYmluZChpbnN0YW5jZS5wYXJhbXMpKCk7XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0QnV0dG9uc0Rpc2FibGVkKGluc3RhbmNlLCBidXR0b25zLCBkaXNhYmxlZCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSk7XG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBkb21DYWNoZVtidXR0b25dLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRJbnB1dERpc2FibGVkKGlucHV0LCBkaXNhYmxlZCkge1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgY29uc3QgcmFkaW9zQ29udGFpbmVyID0gaW5wdXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgY29uc3QgcmFkaW9zID0gcmFkaW9zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvc1tpXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVJbnB1dCgpIHtcbiAgICByZXR1cm4gc2V0SW5wdXREaXNhYmxlZCh0aGlzLmdldElucHV0KCksIGZhbHNlKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlSW5wdXQoKSB7XG4gICAgcmV0dXJuIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dWYWxpZGF0aW9uTWVzc2FnZShlcnJvcikge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBwYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuICAgIHNldElubmVySHRtbChkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgZXJyb3IpO1xuICAgIGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXTtcblxuICAgIGlmIChwYXJhbXMuY3VzdG9tQ2xhc3MgJiYgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRDbGFzcyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG5cbiAgICBzaG93KGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCB0cnVlKTtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gICAgICBmb2N1c0lucHV0KGlucHV0KTtcbiAgICAgIGFkZENsYXNzKGlucHV0LCBzd2FsQ2xhc3Nlcy5pbnB1dGVycm9yKTtcbiAgICB9XG4gIH0gLy8gSGlkZSBibG9jayB3aXRoIHZhbGlkYXRpb24gbWVzc2FnZVxuXG4gIGZ1bmN0aW9uIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG5cbiAgICBpZiAoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgIGhpZGUoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRJbnB1dCgpO1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpO1xuICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICByZW1vdmVDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UHJvZ3Jlc3NTdGVwcyQxKCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICByZXR1cm4gZG9tQ2FjaGUucHJvZ3Jlc3NTdGVwcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHBvcHVwIHBhcmFtZXRlcnMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwYXJhbXMpIHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFwb3B1cCB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIHdhcm4oXCJZb3UncmUgdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgY2xvc2VkIG9yIGNsb3NpbmcgcG9wdXAsIHRoYXQgd29uJ3Qgd29yay4gVXNlIHRoZSB1cGRhdGUoKSBtZXRob2QgaW4gcHJlQ29uZmlybSBwYXJhbWV0ZXIgb3Igc2hvdyBhIG5ldyBwb3B1cC5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWRVcGRhdGFibGVQYXJhbXMgPSBmaWx0ZXJWYWxpZFBhcmFtcyhwYXJhbXMpO1xuICAgIGNvbnN0IHVwZGF0ZWRQYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBpbm5lclBhcmFtcywgdmFsaWRVcGRhdGFibGVQYXJhbXMpO1xuICAgIHJlbmRlcih0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KHRoaXMsIHVwZGF0ZWRQYXJhbXMpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB2YWx1ZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyksXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgZmlsdGVyVmFsaWRQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0ge307XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIGlmIChpc1VwZGF0YWJsZVBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgICAgdmFsaWRVcGRhdGFibGVQYXJhbXNbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhcm4oXCJJbnZhbGlkIHBhcmFtZXRlciB0byB1cGRhdGU6IFwiLmNvbmNhdChwYXJhbSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2YWxpZFVwZGF0YWJsZVBhcmFtcztcbiAgfTtcblxuICBmdW5jdGlvbiBfZGVzdHJveSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgZGlzcG9zZVdlYWtNYXBzKHRoaXMpOyAvLyBUaGUgV2Vha01hcHMgbWlnaHQgaGF2ZSBiZWVuIHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVjYWxsIGl0IHRvIGRpc3Bvc2UgYW55IHJlbWFpbmluZyBXZWFrTWFwcyAjMjMzNVxuXG4gICAgICByZXR1cm47IC8vIFRoaXMgaW5zdGFuY2UgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWRcbiAgICB9IC8vIENoZWNrIGlmIHRoZXJlIGlzIGFub3RoZXIgU3dhbCBjbG9zaW5nXG5cblxuICAgIGlmIChkb21DYWNoZS5wb3B1cCAmJiBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2spIHtcbiAgICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaygpO1xuICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGlubmVyUGFyYW1zLmRpZERlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlubmVyUGFyYW1zLmRpZERlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBkaXNwb3NlU3dhbCh0aGlzKTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgZGlzcG9zZVN3YWwgPSBpbnN0YW5jZSA9PiB7XG4gICAgZGlzcG9zZVdlYWtNYXBzKGluc3RhbmNlKTsgLy8gVW5zZXQgdGhpcy5wYXJhbXMgc28gR0Mgd2lsbCBkaXNwb3NlIGl0ICgjMTU2OSlcbiAgICAvLyBAdHMtaWdub3JlXG5cbiAgICBkZWxldGUgaW5zdGFuY2UucGFyYW1zOyAvLyBVbnNldCBnbG9iYWxTdGF0ZSBwcm9wcyBzbyBHQyB3aWxsIGRpc3Bvc2UgZ2xvYmFsU3RhdGUgKCMxNTY5KVxuXG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyO1xuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0OyAvLyBVbnNldCBjdXJyZW50SW5zdGFuY2VcblxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2U7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuXG4gIGNvbnN0IGRpc3Bvc2VXZWFrTWFwcyA9IGluc3RhbmNlID0+IHtcbiAgICAvLyBJZiB0aGUgY3VycmVudCBpbnN0YW5jZSBpcyBhd2FpdGluZyBhIHByb21pc2UgcmVzdWx0LCB3ZSBrZWVwIHRoZSBwcml2YXRlTWV0aG9kcyB0byBjYWxsIHRoZW0gb25jZSB0aGUgcHJvbWlzZSByZXN1bHQgaXMgcmV0cmlldmVkICMyMzM1XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmIChpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSgpKSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVNZXRob2RzLCBpbnN0YW5jZSk7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cblxuICBjb25zdCB1bnNldFdlYWtNYXBzID0gKG9iaiwgaW5zdGFuY2UpID0+IHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICBvYmpbaV0uZGVsZXRlKGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG5cblxuXG4gIHZhciBpbnN0YW5jZU1ldGhvZHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgaGlkZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuICAgIGRpc2FibGVMb2FkaW5nOiBoaWRlTG9hZGluZyxcbiAgICBnZXRJbnB1dDogZ2V0SW5wdXQkMSxcbiAgICBjbG9zZTogY2xvc2UsXG4gICAgaXNBd2FpdGluZ1Byb21pc2U6IGlzQXdhaXRpbmdQcm9taXNlLFxuICAgIHJlamVjdFByb21pc2U6IHJlamVjdFByb21pc2UsXG4gICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlOiBoYW5kbGVBd2FpdGluZ1Byb21pc2UsXG4gICAgY2xvc2VQb3B1cDogY2xvc2UsXG4gICAgY2xvc2VNb2RhbDogY2xvc2UsXG4gICAgY2xvc2VUb2FzdDogY2xvc2UsXG4gICAgZW5hYmxlQnV0dG9uczogZW5hYmxlQnV0dG9ucyxcbiAgICBkaXNhYmxlQnV0dG9uczogZGlzYWJsZUJ1dHRvbnMsXG4gICAgZW5hYmxlSW5wdXQ6IGVuYWJsZUlucHV0LFxuICAgIGRpc2FibGVJbnB1dDogZGlzYWJsZUlucHV0LFxuICAgIHNob3dWYWxpZGF0aW9uTWVzc2FnZTogc2hvd1ZhbGlkYXRpb25NZXNzYWdlLFxuICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U6IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSxcbiAgICBnZXRQcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzJDEsXG4gICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgX2Rlc3Ryb3k6IF9kZXN0cm95XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDb25maXJtQnV0dG9uQ2xpY2sgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnY29uZmlybScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCB0cnVlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVEZW55QnV0dG9uQ2xpY2sgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnJldHVybklucHV0VmFsdWVPbkRlbnkpIHtcbiAgICAgIGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQoaW5zdGFuY2UsICdkZW55Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGZhbHNlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDYW5jZWxCdXR0b25DbGljayA9IChpbnN0YW5jZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uY2FuY2VsKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknfSB0eXBlXG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQgPSAoaW5zdGFuY2UsIHR5cGUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgZXJyb3IoXCJUaGUgXFxcImlucHV0XFxcIiBwYXJhbWV0ZXIgaXMgbmVlZGVkIHRvIGJlIHNldCB3aGVuIHVzaW5nIHJldHVybklucHV0VmFsdWVPblwiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIodHlwZSkpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dFZhbHVlID0gZ2V0SW5wdXRWYWx1ZShpbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKSB7XG4gICAgICBoYW5kbGVJbnB1dFZhbGlkYXRvcihpbnN0YW5jZSwgaW5wdXRWYWx1ZSwgdHlwZSk7XG4gICAgfSBlbHNlIGlmICghaW5zdGFuY2UuZ2V0SW5wdXQoKS5jaGVja1ZhbGlkaXR5KCkpIHtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnMoKTtcbiAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZShpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRWYWx1ZVxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55J30gdHlwZVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsaWRhdG9yID0gKGluc3RhbmNlLCBpbnB1dFZhbHVlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlSW5wdXQoKTtcbiAgICBjb25zdCB2YWxpZGF0aW9uUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKGlucHV0VmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgIHZhbGlkYXRpb25Qcm9taXNlLnRoZW4odmFsaWRhdGlvbk1lc3NhZ2UgPT4ge1xuICAgICAgaW5zdGFuY2UuZW5hYmxlQnV0dG9ucygpO1xuICAgICAgaW5zdGFuY2UuZW5hYmxlSW5wdXQoKTtcblxuICAgICAgaWYgKHZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZSh2YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZW55Jykge1xuICAgICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm0oaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3QgZGVueSA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25EZW55KSB7XG4gICAgICBzaG93TG9hZGluZyhnZXREZW55QnV0dG9uKCkpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVEZW55KSB7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIHRydWUpOyAvLyBGbGFnZ2luZyB0aGUgaW5zdGFuY2UgYXMgYXdhaXRpbmcgYSBwcm9taXNlIHNvIGl0J3Mgb3duIHByb21pc2UncyByZWplY3QvcmVzb2x2ZSBtZXRob2RzIGRvZXNuJ3QgZ2V0IGRlc3Ryb3llZCB1bnRpbCB0aGUgcmVzdWx0IGZyb20gdGhpcyBwcmVEZW55J3MgcHJvbWlzZSBpcyByZWNlaXZlZFxuXG4gICAgICBjb25zdCBwcmVEZW55UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLnByZURlbnkodmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgICAgcHJlRGVueVByb21pc2UudGhlbihwcmVEZW55VmFsdWUgPT4ge1xuICAgICAgICBpZiAocHJlRGVueVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgICAgICBpc0RlbmllZDogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB0eXBlb2YgcHJlRGVueVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlRGVueVZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yJCQxID0+IHJlamVjdFdpdGgoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCBlcnJvciQkMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgIGlzRGVuaWVkOiB0cnVlLFxuICAgICAgICB2YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3Qgc3VjY2VlZFdpdGggPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgaXNDb25maXJtZWQ6IHRydWUsXG4gICAgICB2YWx1ZVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yXG4gICAqL1xuXG5cbiAgY29uc3QgcmVqZWN0V2l0aCA9IChpbnN0YW5jZSwgZXJyb3IkJDEpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaW5zdGFuY2UucmVqZWN0UHJvbWlzZShlcnJvciQkMSk7XG4gIH07XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG5cblxuICBjb25zdCBjb25maXJtID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB1bmRlZmluZWQpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnNob3dMb2FkZXJPbkNvbmZpcm0pIHtcbiAgICAgIHNob3dMb2FkaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgIGluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgdHJ1ZSk7IC8vIEZsYWdnaW5nIHRoZSBpbnN0YW5jZSBhcyBhd2FpdGluZyBhIHByb21pc2Ugc28gaXQncyBvd24gcHJvbWlzZSdzIHJlamVjdC9yZXNvbHZlIG1ldGhvZHMgZG9lc24ndCBnZXQgZGVzdHJveWVkIHVudGlsIHRoZSByZXN1bHQgZnJvbSB0aGlzIHByZUNvbmZpcm0ncyBwcm9taXNlIGlzIHJlY2VpdmVkXG5cbiAgICAgIGNvbnN0IHByZUNvbmZpcm1Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMucHJlQ29uZmlybSh2YWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgICBwcmVDb25maXJtUHJvbWlzZS50aGVuKHByZUNvbmZpcm1WYWx1ZSA9PiB7XG4gICAgICAgIGlmIChpc1Zpc2libGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSkgfHwgcHJlQ29uZmlybVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkV2l0aChpbnN0YW5jZSwgdHlwZW9mIHByZUNvbmZpcm1WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZSA6IHByZUNvbmZpcm1WYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yJCQxID0+IHJlamVjdFdpdGgoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCBlcnJvciQkMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkV2l0aChpbnN0YW5jZSwgdmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVQb3B1cENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBoYW5kbGVUb2FzdENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZ25vcmUgY2xpY2sgZXZlbnRzIHRoYXQgaGFkIG1vdXNlZG93biBvbiB0aGUgcG9wdXAgYnV0IG1vdXNldXAgb24gdGhlIGNvbnRhaW5lclxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdGhlIHVzZXIgZHJhZ3MgYSBzbGlkZXJcbiAgICAgIGhhbmRsZU1vZGFsTW91c2Vkb3duKGRvbUNhY2hlKTsgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIGNvbnRhaW5lciBidXQgbW91c2V1cCBvbiB0aGUgcG9wdXBcblxuICAgICAgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duKGRvbUNhY2hlKTtcbiAgICAgIGhhbmRsZU1vZGFsQ2xpY2soaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVRvYXN0Q2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIC8vIENsb3NpbmcgdG9hc3QgYnkgaW50ZXJuYWwgY2xpY2tcbiAgICBkb21DYWNoZS5wb3B1cC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgICAgaWYgKGlubmVyUGFyYW1zICYmIChpc0FueUJ1dHRvblNob3duKGlubmVyUGFyYW1zKSB8fCBpbm5lclBhcmFtcy50aW1lciB8fCBpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICB9O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHsqfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc0FueUJ1dHRvblNob3duID0gaW5uZXJQYXJhbXMgPT4ge1xuICAgIHJldHVybiBpbm5lclBhcmFtcy5zaG93Q29uZmlybUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93RGVueUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dDbG9zZUJ1dHRvbjtcbiAgfTtcblxuICBsZXQgaWdub3JlT3V0c2lkZUNsaWNrID0gZmFsc2U7XG5cbiAgY29uc3QgaGFuZGxlTW9kYWxNb3VzZWRvd24gPSBkb21DYWNoZSA9PiB7XG4gICAgZG9tQ2FjaGUucG9wdXAub25tb3VzZWRvd24gPSAoKSA9PiB7XG4gICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IHVuZGVmaW5lZDsgLy8gV2Ugb25seSBjaGVjayBpZiB0aGUgbW91c2V1cCB0YXJnZXQgaXMgdGhlIGNvbnRhaW5lciBiZWNhdXNlIHVzdWFsbHkgaXQgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIGFueSBvdGhlciBkaXJlY3QgY2hpbGRyZW4gYXNpZGUgb2YgdGhlIHBvcHVwXG5cbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb21DYWNoZS5jb250YWluZXIpIHtcbiAgICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNlZG93biA9ICgpID0+IHtcbiAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IHVuZGVmaW5lZDsgLy8gV2UgYWxzbyBuZWVkIHRvIGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBwb3B1cFxuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUucG9wdXAgfHwgZG9tQ2FjaGUucG9wdXAuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZU1vZGFsQ2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbmNsaWNrID0gZSA9PiB7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgICBpZiAoaWdub3JlT3V0c2lkZUNsaWNrKSB7XG4gICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyICYmIGNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93T3V0c2lkZUNsaWNrKSkge1xuICAgICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmJhY2tkcm9wKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGlzSnF1ZXJ5RWxlbWVudCA9IGVsZW0gPT4gdHlwZW9mIGVsZW0gPT09ICdvYmplY3QnICYmIGVsZW0uanF1ZXJ5O1xuXG4gIGNvbnN0IGlzRWxlbWVudCA9IGVsZW0gPT4gZWxlbSBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgaXNKcXVlcnlFbGVtZW50KGVsZW0pO1xuXG4gIGNvbnN0IGFyZ3NUb1BhcmFtcyA9IGFyZ3MgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiAhaXNFbGVtZW50KGFyZ3NbMF0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHBhcmFtcywgYXJnc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFsndGl0bGUnLCAnaHRtbCcsICdpY29uJ10uZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgYXJnID0gYXJnc1tpbmRleF07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8IGlzRWxlbWVudChhcmcpKSB7XG4gICAgICAgICAgcGFyYW1zW25hbWVdID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgXCIuY29uY2F0KG5hbWUsIFwiISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiBvciBcXFwiRWxlbWVudFxcXCIsIGdvdCBcIikuY29uY2F0KHR5cGVvZiBhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcblxuICBmdW5jdGlvbiBmaXJlKCkge1xuICAgIGNvbnN0IFN3YWwgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTd2FsKC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZXh0ZW5kZWQgdmVyc2lvbiBvZiBgU3dhbGAgY29udGFpbmluZyBgcGFyYW1zYCBhcyBkZWZhdWx0cy5cbiAgICogVXNlZnVsIGZvciByZXVzaW5nIFN3YWwgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIEJlZm9yZTpcbiAgICogY29uc3QgdGV4dFByb21wdE9wdGlvbnMgPSB7IGlucHV0OiAndGV4dCcsIHNob3dDYW5jZWxCdXR0b246IHRydWUgfVxuICAgKiBjb25zdCB7dmFsdWU6IGZpcnN0TmFtZX0gPSBhd2FpdCBTd2FsLmZpcmUoeyAuLi50ZXh0UHJvbXB0T3B0aW9ucywgdGl0bGU6ICdXaGF0IGlzIHlvdXIgZmlyc3QgbmFtZT8nIH0pXG4gICAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nIH0pXG4gICAqXG4gICAqIEFmdGVyOlxuICAgKiBjb25zdCBUZXh0UHJvbXB0ID0gU3dhbC5taXhpbih7IGlucHV0OiAndGV4dCcsIHNob3dDYW5jZWxCdXR0b246IHRydWUgfSlcbiAgICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JylcbiAgICogY29uc3Qge3ZhbHVlOiBsYXN0TmFtZX0gPSBhd2FpdCBUZXh0UHJvbXB0KCdXaGF0IGlzIHlvdXIgbGFzdCBuYW1lPycpXG4gICAqXG4gICAqIEBwYXJhbSBtaXhpblBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gbWl4aW4obWl4aW5QYXJhbXMpIHtcbiAgICBjbGFzcyBNaXhpblN3YWwgZXh0ZW5kcyB0aGlzIHtcbiAgICAgIF9tYWluKHBhcmFtcywgcHJpb3JpdHlNaXhpblBhcmFtcykge1xuICAgICAgICByZXR1cm4gc3VwZXIuX21haW4ocGFyYW1zLCBPYmplY3QuYXNzaWduKHt9LCBtaXhpblBhcmFtcywgcHJpb3JpdHlNaXhpblBhcmFtcykpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIE1peGluU3dhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpcyBzZXQsIHJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogT3RoZXJ3aXNlLCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgZ2V0VGltZXJMZWZ0ID0gKCkgPT4ge1xuICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlLnRpbWVvdXQuZ2V0VGltZXJMZWZ0KCk7XG4gIH07XG4gIC8qKlxuICAgKiBTdG9wIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IHN0b3BUaW1lciA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgc3RvcFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgcmVzdW1lVGltZXIgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RhcnQoKTtcbiAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKHJlbWFpbmluZyk7XG4gICAgICByZXR1cm4gcmVtYWluaW5nO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFJlc3VtZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCB0b2dnbGVUaW1lciA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lciA9IGdsb2JhbFN0YXRlLnRpbWVvdXQ7XG4gICAgcmV0dXJuIHRpbWVyICYmICh0aW1lci5ydW5uaW5nID8gc3RvcFRpbWVyKCkgOiByZXN1bWVUaW1lcigpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEluY3JlYXNlIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgYW4gdXBkYXRlZCB0aW1lci5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgaW5jcmVhc2VUaW1lciA9IG4gPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBjb25zdCByZW1haW5pbmcgPSBnbG9iYWxTdGF0ZS50aW1lb3V0LmluY3JlYXNlKG4pO1xuICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIocmVtYWluaW5nLCB0cnVlKTtcbiAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ2hlY2sgaWYgdGltZXIgaXMgcnVubmluZy4gUmV0dXJucyB0cnVlIGlmIHRpbWVyIGlzIHJ1bm5pbmdcbiAgICogb3IgZmFsc2UgaWYgdGltZXIgaXMgcGF1c2VkIG9yIHN0b3BwZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWRcbiAgICovXG5cbiAgY29uc3QgaXNUaW1lclJ1bm5pbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pc1J1bm5pbmcoKTtcbiAgfTtcblxuICBsZXQgYm9keUNsaWNrTGlzdGVuZXJBZGRlZCA9IGZhbHNlO1xuICBjb25zdCBjbGlja0hhbmRsZXJzID0ge307XG4gIGZ1bmN0aW9uIGJpbmRDbGlja0hhbmRsZXIoKSB7XG4gICAgbGV0IGF0dHIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdkYXRhLXN3YWwtdGVtcGxhdGUnO1xuICAgIGNsaWNrSGFuZGxlcnNbYXR0cl0gPSB0aGlzO1xuXG4gICAgaWYgKCFib2R5Q2xpY2tMaXN0ZW5lckFkZGVkKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYm9keUNsaWNrTGlzdGVuZXIpO1xuICAgICAgYm9keUNsaWNrTGlzdGVuZXJBZGRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYm9keUNsaWNrTGlzdGVuZXIgPSBldmVudCA9PiB7XG4gICAgZm9yIChsZXQgZWwgPSBldmVudC50YXJnZXQ7IGVsICYmIGVsICE9PSBkb2N1bWVudDsgZWwgPSBlbC5wYXJlbnROb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IGF0dHIgaW4gY2xpY2tIYW5kbGVycykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBjbGlja0hhbmRsZXJzW2F0dHJdLmZpcmUoe1xuICAgICAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuXG4gIHZhciBzdGF0aWNNZXRob2RzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGlzVmFsaWRQYXJhbWV0ZXI6IGlzVmFsaWRQYXJhbWV0ZXIsXG4gICAgaXNVcGRhdGFibGVQYXJhbWV0ZXI6IGlzVXBkYXRhYmxlUGFyYW1ldGVyLFxuICAgIGlzRGVwcmVjYXRlZFBhcmFtZXRlcjogaXNEZXByZWNhdGVkUGFyYW1ldGVyLFxuICAgIGFyZ3NUb1BhcmFtczogYXJnc1RvUGFyYW1zLFxuICAgIGlzVmlzaWJsZTogaXNWaXNpYmxlJDEsXG4gICAgY2xpY2tDb25maXJtOiBjbGlja0NvbmZpcm0sXG4gICAgY2xpY2tEZW55OiBjbGlja0RlbnksXG4gICAgY2xpY2tDYW5jZWw6IGNsaWNrQ2FuY2VsLFxuICAgIGdldENvbnRhaW5lcjogZ2V0Q29udGFpbmVyLFxuICAgIGdldFBvcHVwOiBnZXRQb3B1cCxcbiAgICBnZXRUaXRsZTogZ2V0VGl0bGUsXG4gICAgZ2V0SHRtbENvbnRhaW5lcjogZ2V0SHRtbENvbnRhaW5lcixcbiAgICBnZXRJbWFnZTogZ2V0SW1hZ2UsXG4gICAgZ2V0SWNvbjogZ2V0SWNvbixcbiAgICBnZXRJbnB1dExhYmVsOiBnZXRJbnB1dExhYmVsLFxuICAgIGdldENsb3NlQnV0dG9uOiBnZXRDbG9zZUJ1dHRvbixcbiAgICBnZXRBY3Rpb25zOiBnZXRBY3Rpb25zLFxuICAgIGdldENvbmZpcm1CdXR0b246IGdldENvbmZpcm1CdXR0b24sXG4gICAgZ2V0RGVueUJ1dHRvbjogZ2V0RGVueUJ1dHRvbixcbiAgICBnZXRDYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbixcbiAgICBnZXRMb2FkZXI6IGdldExvYWRlcixcbiAgICBnZXRGb290ZXI6IGdldEZvb3RlcixcbiAgICBnZXRUaW1lclByb2dyZXNzQmFyOiBnZXRUaW1lclByb2dyZXNzQmFyLFxuICAgIGdldEZvY3VzYWJsZUVsZW1lbnRzOiBnZXRGb2N1c2FibGVFbGVtZW50cyxcbiAgICBnZXRWYWxpZGF0aW9uTWVzc2FnZTogZ2V0VmFsaWRhdGlvbk1lc3NhZ2UsXG4gICAgaXNMb2FkaW5nOiBpc0xvYWRpbmcsXG4gICAgZmlyZTogZmlyZSxcbiAgICBtaXhpbjogbWl4aW4sXG4gICAgc2hvd0xvYWRpbmc6IHNob3dMb2FkaW5nLFxuICAgIGVuYWJsZUxvYWRpbmc6IHNob3dMb2FkaW5nLFxuICAgIGdldFRpbWVyTGVmdDogZ2V0VGltZXJMZWZ0LFxuICAgIHN0b3BUaW1lcjogc3RvcFRpbWVyLFxuICAgIHJlc3VtZVRpbWVyOiByZXN1bWVUaW1lcixcbiAgICB0b2dnbGVUaW1lcjogdG9nZ2xlVGltZXIsXG4gICAgaW5jcmVhc2VUaW1lcjogaW5jcmVhc2VUaW1lcixcbiAgICBpc1RpbWVyUnVubmluZzogaXNUaW1lclJ1bm5pbmcsXG4gICAgYmluZENsaWNrSGFuZGxlcjogYmluZENsaWNrSGFuZGxlclxuICB9KTtcblxuICBsZXQgY3VycmVudEluc3RhbmNlO1xuXG4gIGNsYXNzIFN3ZWV0QWxlcnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLy8gUHJldmVudCBydW4gaW4gTm9kZSBlbnZcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHRoaXM7IC8vIEB0cy1pZ25vcmVcblxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dGVyUGFyYW1zID0gT2JqZWN0LmZyZWV6ZSh0aGlzLmNvbnN0cnVjdG9yLmFyZ3NUb1BhcmFtcyhhcmdzKSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHZhbHVlOiBvdXRlclBhcmFtcyxcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7IC8vIEB0cy1pZ25vcmVcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IGN1cnJlbnRJbnN0YW5jZS5fbWFpbihjdXJyZW50SW5zdGFuY2UucGFyYW1zKTtcblxuICAgICAgcHJpdmF0ZVByb3BzLnByb21pc2Uuc2V0KHRoaXMsIHByb21pc2UpO1xuICAgIH1cblxuICAgIF9tYWluKHVzZXJQYXJhbXMpIHtcbiAgICAgIGxldCBtaXhpblBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgICBzaG93V2FybmluZ3NGb3JQYXJhbXMoT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHVzZXJQYXJhbXMpKTtcblxuICAgICAgaWYgKGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZS5fZGVzdHJveSgpO1xuXG4gICAgICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgICAgICB1bnNldEFyaWFIaWRkZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2U7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByZXBhcmVQYXJhbXModXNlclBhcmFtcywgbWl4aW5QYXJhbXMpO1xuICAgICAgc2V0UGFyYW1ldGVycyhpbm5lclBhcmFtcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGlubmVyUGFyYW1zKTsgLy8gY2xlYXIgdGhlIHByZXZpb3VzIHRpbWVyXG5cbiAgICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH0gLy8gY2xlYXIgdGhlIHJlc3RvcmUgZm9jdXMgdGltZW91dFxuXG5cbiAgICAgIGNsZWFyVGltZW91dChnbG9iYWxTdGF0ZS5yZXN0b3JlRm9jdXNUaW1lb3V0KTtcbiAgICAgIGNvbnN0IGRvbUNhY2hlID0gcG9wdWxhdGVEb21DYWNoZShjdXJyZW50SW5zdGFuY2UpO1xuICAgICAgcmVuZGVyKGN1cnJlbnRJbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldChjdXJyZW50SW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIHJldHVybiBzd2FsUHJvbWlzZShjdXJyZW50SW5zdGFuY2UsIGRvbUNhY2hlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBgY2F0Y2hgIGNhbm5vdCBiZSB0aGUgbmFtZSBvZiBhIG1vZHVsZSBleHBvcnQsIHNvIHdlIGRlZmluZSBvdXIgdGhlbmFibGUgbWV0aG9kcyBoZXJlIGluc3RlYWRcblxuXG4gICAgdGhlbihvbkZ1bGZpbGxlZCkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHByaXZhdGVQcm9wcy5wcm9taXNlLmdldCh0aGlzKTtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ob25GdWxmaWxsZWQpO1xuICAgIH1cblxuICAgIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICAgICAgcmV0dXJuIHByb21pc2UuZmluYWxseShvbkZpbmFsbHkpO1xuICAgIH1cblxuICB9XG5cbiAgY29uc3Qgc3dhbFByb21pc2UgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBmdW5jdGlvbnMgdG8gaGFuZGxlIGFsbCBjbG9zaW5ncy9kaXNtaXNzYWxzXG4gICAgICBjb25zdCBkaXNtaXNzV2l0aCA9IGRpc21pc3MgPT4ge1xuICAgICAgICBpbnN0YW5jZS5jbG9zZVBvcHVwKHtcbiAgICAgICAgICBpc0Rpc21pc3NlZDogdHJ1ZSxcbiAgICAgICAgICBkaXNtaXNzXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLnNldChpbnN0YW5jZSwgcmVzb2x2ZSk7XG4gICAgICBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlamVjdC5zZXQoaW5zdGFuY2UsIHJlamVjdCk7XG5cbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZUNvbmZpcm1CdXR0b25DbGljayhpbnN0YW5jZSk7XG5cbiAgICAgIGRvbUNhY2hlLmRlbnlCdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZURlbnlCdXR0b25DbGljayhpbnN0YW5jZSk7XG5cbiAgICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2soaW5zdGFuY2UsIGRpc21pc3NXaXRoKTtcblxuICAgICAgZG9tQ2FjaGUuY2xvc2VCdXR0b24ub25jbGljayA9ICgpID0+IGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uY2xvc2UpO1xuXG4gICAgICBoYW5kbGVQb3B1cENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgYWRkS2V5ZG93bkhhbmRsZXIoaW5zdGFuY2UsIGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zQW5kVmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIG9wZW5Qb3B1cChpbm5lclBhcmFtcyk7XG4gICAgICBzZXR1cFRpbWVyKGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaW5pdEZvY3VzKGRvbUNhY2hlLCBpbm5lclBhcmFtcyk7IC8vIFNjcm9sbCBjb250YWluZXIgdG8gdG9wIG9uIG9wZW4gKCMxMjQ3LCAjMTk0NilcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5zY3JvbGxUb3AgPSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcHJlcGFyZVBhcmFtcyA9ICh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRlbXBsYXRlUGFyYW1zID0gZ2V0VGVtcGxhdGVQYXJhbXModXNlclBhcmFtcyk7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcywgbWl4aW5QYXJhbXMsIHRlbXBsYXRlUGFyYW1zLCB1c2VyUGFyYW1zKTsgLy8gcHJlY2VkZW5jZSBpcyBkZXNjcmliZWQgaW4gIzIxMzFcblxuICAgIHBhcmFtcy5zaG93Q2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLnNob3dDbGFzcywgcGFyYW1zLnNob3dDbGFzcyk7XG4gICAgcGFyYW1zLmhpZGVDbGFzcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMuaGlkZUNsYXNzLCBwYXJhbXMuaGlkZUNsYXNzKTtcbiAgICByZXR1cm4gcGFyYW1zO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHJldHVybnMge0RvbUNhY2hlfVxuICAgKi9cblxuXG4gIGNvbnN0IHBvcHVsYXRlRG9tQ2FjaGUgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSB7XG4gICAgICBwb3B1cDogZ2V0UG9wdXAoKSxcbiAgICAgIGNvbnRhaW5lcjogZ2V0Q29udGFpbmVyKCksXG4gICAgICBhY3Rpb25zOiBnZXRBY3Rpb25zKCksXG4gICAgICBjb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uKCksXG4gICAgICBkZW55QnV0dG9uOiBnZXREZW55QnV0dG9uKCksXG4gICAgICBjYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbigpLFxuICAgICAgbG9hZGVyOiBnZXRMb2FkZXIoKSxcbiAgICAgIGNsb3NlQnV0dG9uOiBnZXRDbG9zZUJ1dHRvbigpLFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlKCksXG4gICAgICBwcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzKClcbiAgICB9O1xuICAgIHByaXZhdGVQcm9wcy5kb21DYWNoZS5zZXQoaW5zdGFuY2UsIGRvbUNhY2hlKTtcbiAgICByZXR1cm4gZG9tQ2FjaGU7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0dsb2JhbFN0YXRlfSBnbG9iYWxTdGF0ZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwVGltZXIgPSAoZ2xvYmFsU3RhdGUkJDEsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgaGlkZSh0aW1lclByb2dyZXNzQmFyKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy50aW1lcikge1xuICAgICAgZ2xvYmFsU3RhdGUkJDEudGltZW91dCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgIGRpc21pc3NXaXRoKCd0aW1lcicpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUkJDEudGltZW91dDtcbiAgICAgIH0sIGlubmVyUGFyYW1zLnRpbWVyKTtcblxuICAgICAgaWYgKGlubmVyUGFyYW1zLnRpbWVyUHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgc2hvdyh0aW1lclByb2dyZXNzQmFyKTtcbiAgICAgICAgYXBwbHlDdXN0b21DbGFzcyh0aW1lclByb2dyZXNzQmFyLCBpbm5lclBhcmFtcywgJ3RpbWVyUHJvZ3Jlc3NCYXInKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUkJDEudGltZW91dC5ydW5uaW5nKSB7XG4gICAgICAgICAgICAvLyB0aW1lciBjYW4gYmUgYWxyZWFkeSBzdG9wcGVkIG9yIHVuc2V0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKGlubmVyUGFyYW1zLnRpbWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9tQ2FjaGV9IGRvbUNhY2hlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaW5pdEZvY3VzID0gKGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFbnRlcktleSkpIHtcbiAgICAgIHJldHVybiBibHVyQWN0aXZlRWxlbWVudCgpO1xuICAgIH1cblxuICAgIGlmICghZm9jdXNCdXR0b24oZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSkge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIC0xLCAxKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBmb2N1c0J1dHRvbiA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNEZW55ICYmIGlzVmlzaWJsZShkb21DYWNoZS5kZW55QnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ2FuY2VsICYmIGlzVmlzaWJsZShkb21DYWNoZS5jYW5jZWxCdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NvbmZpcm0gJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNvbmZpcm1CdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgYmx1ckFjdGl2ZUVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH07IC8vIFRoaXMgYW50aS13YXIgbWVzc2FnZSB3aWxsIG9ubHkgYmUgc2hvd24gdG8gUnVzc2lhbiB1c2VycyB2aXNpdGluZyBSdXNzaWFuIHNpdGVzXG5cblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgL15ydVxcYi8udGVzdChuYXZpZ2F0b3IubGFuZ3VhZ2UpICYmIGxvY2F0aW9uLmhvc3QubWF0Y2goL1xcLihydXxzdXx4bi0tcDFhaSkkLykpIHtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMSkge1xuICAgICAgY29uc3Qgbm9XYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG5vV2FyLmNsYXNzTmFtZSA9ICdsZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQnO1xuICAgICAgY29uc3QgdmlkZW8gPSBnZXRSYW5kb21FbGVtZW50KFt7XG4gICAgICAgIHRleHQ6IFwiXFx1MDQxMiBcXHUwNDNEXFx1MDQzOFxcdTA0MzZcXHUwNDM1XFx1MDQzRlxcdTA0NDBcXHUwNDM4XFx1MDQzMlxcdTA0MzVcXHUwNDM0XFx1MDQ1MVxcdTA0M0RcXHUwNDNEXFx1MDQzRVxcdTA0M0MgXFx1MDQzMlxcdTA0MzhcXHUwNDM0XFx1MDQzNVxcdTA0M0UgXFx1MDQzRVxcdTA0MzFcXHUwNDRBXFx1MDQ0RlxcdTA0NDFcXHUwNDNEXFx1MDQ0RlxcdTA0MzVcXHUwNDQyXFx1MDQ0MVxcdTA0NEYgXFx1MDQzQVxcdTA0MzBcXHUwNDNBIFxcdTA0M0FcXHUwNDMwXFx1MDQzNlxcdTA0MzRcXHUwNDRCXFx1MDQzOSBcXHUwNDM4XFx1MDQzNyBcXHUwNDNEXFx1MDQzMFxcdTA0NDEgXFx1MDQzQ1xcdTA0M0VcXHUwNDM2XFx1MDQzNVxcdTA0NDIgXFx1MDQzRlxcdTA0M0VcXHUwNDNDXFx1MDQzRVxcdTA0NDdcXHUwNDRDIFxcdTA0MzIgXFx1MDQ0MlxcdTA0M0VcXHUwNDNDLFxcbiAgICAgICAgPHN0cm9uZz5cXHUwNDQ3XFx1MDQ0MlxcdTA0M0VcXHUwNDMxXFx1MDQ0QiBcXHUwNDREXFx1MDQ0MlxcdTA0MzAgXFx1MDQzMVxcdTA0MzVcXHUwNDQxXFx1MDQ0MVxcdTA0M0NcXHUwNDRCXFx1MDQ0MVxcdTA0M0JcXHUwNDM1XFx1MDQzRFxcdTA0M0RcXHUwNDMwXFx1MDQ0RiBcXHUwNDM4IFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDdcXHUwNDM1XFx1MDQzQlxcdTA0M0VcXHUwNDMyXFx1MDQzNVxcdTA0NDdcXHUwNDNEXFx1MDQzMFxcdTA0NEYgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0MzAgXFx1MDQzRVxcdTA0NDFcXHUwNDQyXFx1MDQzMFxcdTA0M0RcXHUwNDNFXFx1MDQzMlxcdTA0MzhcXHUwNDNCXFx1MDQzMFxcdTA0NDFcXHUwNDRDPC9zdHJvbmc+OlwiLFxuICAgICAgICBpZDogJzRDZkRoYVJrdzdJJ1xuICAgICAgfSwge1xuICAgICAgICB0ZXh0OiAnXHUwNDJEXHUwNDNDXHUwNDNGXHUwNDMwXHUwNDQyXHUwNDM4XHUwNDRGIC0gXHUwNDMzXHUwNDNCXHUwNDMwXHUwNDMyXHUwNDNEXHUwNDNFXHUwNDM1IDxzdHJvbmc+XHUwNDQ3XHUwNDM1XHUwNDNCXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQ3XHUwNDM1XHUwNDQxXHUwNDNBXHUwNDNFXHUwNDM1PC9zdHJvbmc+IFx1MDQ0N1x1MDQ0M1x1MDQzMlx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzRS4gXHUwNDIxXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNFXHUwNDMxXHUwNDNEXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQ0MVx1MDQzRVx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNlx1MDQzOFx1MDQzMlx1MDQzMFx1MDQ0Mlx1MDQ0Qy4gPHN0cm9uZz5cdTA0MjFcdTA0M0ZcdTA0M0VcdTA0NDFcdTA0M0VcdTA0MzFcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEMgXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDMyXHUwNDM4XHUwNDQyXHUwNDRDIFx1MDQ0MVx1MDQzNVx1MDQzMVx1MDQ0RiBcdTA0M0RcdTA0MzAgXHUwNDNDXHUwNDM1XHUwNDQxXHUwNDQyXHUwNDNFIFx1MDQzNFx1MDQ0MFx1MDQ0M1x1MDQzM1x1MDQzRVx1MDQzM1x1MDQzRS48L3N0cm9uZz4nLFxuICAgICAgICBpZDogJ3MtR0xBSVk0RFhBJ1xuICAgICAgfV0pO1xuICAgICAgc2V0SW5uZXJIdG1sKG5vV2FyLCBcIlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDE1XFx1MDQ0MVxcdTA0M0JcXHUwNDM4IFxcdTA0M0NcXHUwNDRCIFxcdTA0M0RcXHUwNDM1IFxcdTA0M0VcXHUwNDQxXFx1MDQ0MlxcdTA0MzBcXHUwNDNEXFx1MDQzRVxcdTA0MzJcXHUwNDM4XFx1MDQzQyBcXHUwNDMyXFx1MDQzRVxcdTA0MzlcXHUwNDNEXFx1MDQ0MywgXFx1MDQzRVxcdTA0M0RcXHUwNDMwIFxcdTA0M0ZcXHUwNDQwXFx1MDQzOFxcdTA0MzRcXHUwNDM1XFx1MDQ0MiBcXHUwNDMyIFxcdTA0MzRcXHUwNDNFXFx1MDQzQyA8c3Ryb25nPlxcdTA0M0FcXHUwNDMwXFx1MDQzNlxcdTA0MzRcXHUwNDNFXFx1MDQzM1xcdTA0M0UgXFx1MDQzOFxcdTA0MzcgXFx1MDQzRFxcdTA0MzBcXHUwNDQxPC9zdHJvbmc+IFxcdTA0MzggXFx1MDQzNVxcdTA0NTEgXFx1MDQzRlxcdTA0M0VcXHUwNDQxXFx1MDQzQlxcdTA0MzVcXHUwNDM0XFx1MDQ0MVxcdTA0NDJcXHUwNDMyXFx1MDQzOFxcdTA0NEYgXFx1MDQzMVxcdTA0NDNcXHUwNDM0XFx1MDQ0M1xcdTA0NDIgPHN0cm9uZz5cXHUwNDQzXFx1MDQzNlxcdTA0MzBcXHUwNDQxXFx1MDQzMFxcdTA0NEVcXHUwNDQ5XFx1MDQzOFxcdTA0M0NcXHUwNDM4PC9zdHJvbmc+LlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDFGXFx1MDQ0M1xcdTA0NDJcXHUwNDM4XFx1MDQzRFxcdTA0NDFcXHUwNDNBXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MFxcdTA0MzVcXHUwNDM2XFx1MDQzOFxcdTA0M0MgXFx1MDQzN1xcdTA0MzAgMjAgXFx1MDQ0MSBcXHUwNDNCXFx1MDQzOFxcdTA0NDhcXHUwNDNEXFx1MDQzOFxcdTA0M0MgXFx1MDQzQlxcdTA0MzVcXHUwNDQyIFxcdTA0NDFcXHUwNDMyXFx1MDQzRVxcdTA0MzVcXHUwNDMzXFx1MDQzRSBcXHUwNDQxXFx1MDQ0M1xcdTA0NDlcXHUwNDM1XFx1MDQ0MVxcdTA0NDJcXHUwNDMyXFx1MDQzRVxcdTA0MzJcXHUwNDMwXFx1MDQzRFxcdTA0MzhcXHUwNDRGIFxcdTA0MzJcXHUwNDM0XFx1MDQzRVxcdTA0M0JcXHUwNDMxXFx1MDQzOFxcdTA0M0IgXFx1MDQzRFxcdTA0MzBcXHUwNDNDLCBcXHUwNDQ3XFx1MDQ0MlxcdTA0M0UgXFx1MDQzQ1xcdTA0NEIgXFx1MDQzMVxcdTA0MzVcXHUwNDQxXFx1MDQ0MVxcdTA0MzhcXHUwNDNCXFx1MDQ0Q1xcdTA0M0RcXHUwNDRCIFxcdTA0MzggXFx1MDQzRVxcdTA0MzRcXHUwNDM4XFx1MDQzRCBcXHUwNDQ3XFx1MDQzNVxcdTA0M0JcXHUwNDNFXFx1MDQzMlxcdTA0MzVcXHUwNDNBIFxcdTA0M0RcXHUwNDM1IFxcdTA0M0NcXHUwNDNFXFx1MDQzNlxcdTA0MzVcXHUwNDQyIFxcdTA0M0RcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDMzXFx1MDQzRSBcXHUwNDQxXFx1MDQzNFxcdTA0MzVcXHUwNDNCXFx1MDQzMFxcdTA0NDJcXHUwNDRDLiA8c3Ryb25nPlxcdTA0MkRcXHUwNDQyXFx1MDQzRSBcXHUwNDNEXFx1MDQzNSBcXHUwNDQyXFx1MDQzMFxcdTA0M0EhPC9zdHJvbmc+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdj5cXG4gICAgICAgIFwiLmNvbmNhdCh2aWRlby50ZXh0LCBcIlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxpZnJhbWUgd2lkdGg9XFxcIjU2MFxcXCIgaGVpZ2h0PVxcXCIzMTVcXFwiIHNyYz1cXFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvXCIpLmNvbmNhdCh2aWRlby5pZCwgXCJcXFwiIGZyYW1lYm9yZGVyPVxcXCIwXFxcIiBhbGxvdz1cXFwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZVxcXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDFEXFx1MDQzNVxcdTA0NDIgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0MzUhXFxuICAgICAgPC9kaXY+XFxuICAgICAgXCIpKTtcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBjbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnJnRpbWVzOyc7XG5cbiAgICAgIGNsb3NlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBub1dhci5yZW1vdmUoKTtcblxuICAgICAgbm9XYXIuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9XYXIpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSAvLyBBc3NpZ24gaW5zdGFuY2UgbWV0aG9kcyBmcm9tIHNyYy9pbnN0YW5jZU1ldGhvZHMvKi5qcyB0byBwcm90b3R5cGVcblxuXG4gIE9iamVjdC5hc3NpZ24oU3dlZXRBbGVydC5wcm90b3R5cGUsIGluc3RhbmNlTWV0aG9kcyk7IC8vIEFzc2lnbiBzdGF0aWMgbWV0aG9kcyBmcm9tIHNyYy9zdGF0aWNNZXRob2RzLyouanMgdG8gY29uc3RydWN0b3JcblxuICBPYmplY3QuYXNzaWduKFN3ZWV0QWxlcnQsIHN0YXRpY01ldGhvZHMpOyAvLyBQcm94eSB0byBpbnN0YW5jZSBtZXRob2RzIHRvIGNvbnN0cnVjdG9yLCBmb3Igbm93LCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblxuICBPYmplY3Qua2V5cyhpbnN0YW5jZU1ldGhvZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBTd2VldEFsZXJ0W2tleV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudEluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50SW5zdGFuY2Vba2V5XSguLi5hcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuICBTd2VldEFsZXJ0LkRpc21pc3NSZWFzb24gPSBEaXNtaXNzUmVhc29uO1xuICBTd2VldEFsZXJ0LnZlcnNpb24gPSAnMTEuNC4yNic7XG5cbiAgY29uc3QgU3dhbCA9IFN3ZWV0QWxlcnQ7IC8vIEB0cy1pZ25vcmVcblxuICBTd2FsLmRlZmF1bHQgPSBTd2FsO1xuXG4gIHJldHVybiBTd2FsO1xuXG59KSk7XG5pZiAodHlwZW9mIHRoaXMgIT09ICd1bmRlZmluZWQnICYmIHRoaXMuU3dlZXRhbGVydDIpeyAgdGhpcy5zd2FsID0gdGhpcy5zd2VldEFsZXJ0ID0gdGhpcy5Td2FsID0gdGhpcy5Td2VldEFsZXJ0ID0gdGhpcy5Td2VldGFsZXJ0Mn1cblxuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZmdW5jdGlvbihlLHQpe3ZhciBuPWUuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO2lmKGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKG4pLG4uc3R5bGVTaGVldCluLnN0eWxlU2hlZXQuZGlzYWJsZWR8fChuLnN0eWxlU2hlZXQuY3NzVGV4dD10KTtlbHNlIHRyeXtuLmlubmVySFRNTD10fWNhdGNoKGUpe24uaW5uZXJUZXh0PXR9fShkb2N1bWVudCxcIi5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdHtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC1jb2x1bW46MS80IWltcG9ydGFudDtncmlkLXJvdzoxLzQhaW1wb3J0YW50O2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgOTlmciAxZnI7cGFkZGluZzoxZW07b3ZlcmZsb3cteTpoaWRkZW47YmFja2dyb3VuZDojZmZmO2JveC1zaGFkb3c6MCAwIDFweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMCAxcHggMnB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwxcHggMnB4IDRweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMXB4IDNweCA4cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDJweCA0cHggMTZweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSk7cG9pbnRlci1ldmVudHM6YWxsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdD4qe2dyaWQtY29sdW1uOjJ9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi10aXRsZXttYXJnaW46LjVlbSAxZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxZW07dGV4dC1hbGlnbjppbml0aWFsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItbG9hZGluZ3tqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaW5wdXR7aGVpZ2h0OjJlbTttYXJnaW46LjVlbTtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1mb290ZXJ7bWFyZ2luOi41ZW0gMCAwO3BhZGRpbmc6LjVlbSAwIDA7Zm9udC1zaXplOi44ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1jbG9zZXtncmlkLWNvbHVtbjozLzM7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDouOGVtO2hlaWdodDouOGVtO21hcmdpbjowO2ZvbnQtc2l6ZToyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1odG1sLWNvbnRhaW5lcnttYXJnaW46LjVlbSAxZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxZW07dGV4dC1hbGlnbjppbml0aWFsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaHRtbC1jb250YWluZXI6ZW1wdHl7cGFkZGluZzowfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItbG9hZGVye2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46LjI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29ue2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07bWluLXdpZHRoOjJlbTtoZWlnaHQ6MmVtO21hcmdpbjowIC41ZW0gMCAwfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbiAuc3dhbDItaWNvbi1jb250ZW50e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjEuOGVtO2ZvbnQtd2VpZ2h0OjcwMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3dpZHRoOjJlbTtoZWlnaHQ6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXXt0b3A6Ljg3NWVtO3dpZHRoOjEuMzc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1sZWZ0XXtsZWZ0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWFjdGlvbnN7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnQ7aGVpZ2h0OmF1dG87bWFyZ2luOjA7bWFyZ2luLXRvcDouNWVtO3BhZGRpbmc6MCAuNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3R5bGVke21hcmdpbjouMjVlbSAuNWVtO3BhZGRpbmc6LjRlbSAuNmVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNze2JvcmRlci1jb2xvcjojYTVkYzg2fS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MS42ZW07aGVpZ2h0OjNlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKTtib3JkZXItcmFkaXVzOjUwJX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS44ZW07bGVmdDotLjVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtLW9yaWdpbjoyZW0gMmVtO2JvcmRlci1yYWRpdXM6NGVtIDAgMCA0ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjI1ZW07bGVmdDouOTM3NWVtO3RyYW5zZm9ybS1vcmlnaW46MCAxLjVlbTtib3JkZXItcmFkaXVzOjAgNGVtIDRlbSAwfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3dpZHRoOjJlbTtoZWlnaHQ6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1maXh7dG9wOjA7bGVmdDouNDM3NWVtO3dpZHRoOi40Mzc1ZW07aGVpZ2h0OjIuNjg3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV17aGVpZ2h0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9dGlwXXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9bG9uZ117dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXB7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25ney13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1czthbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdC5zd2FsMi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LXNob3cgLjVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1zaG93IC41c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Quc3dhbDItaGlkZXstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1oaWRlIC4xcyBmb3J3YXJkczthbmltYXRpb246c3dhbDItdG9hc3QtaGlkZSAuMXMgZm9yd2FyZHN9LnN3YWwyLWNvbnRhaW5lcntkaXNwbGF5OmdyaWQ7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxMDYwO3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLXRlbXBsYXRlLWFyZWFzOlxcXCJ0b3Atc3RhcnQgICAgIHRvcCAgICAgICAgICAgIHRvcC1lbmRcXFwiIFxcXCJjZW50ZXItc3RhcnQgIGNlbnRlciAgICAgICAgIGNlbnRlci1lbmRcXFwiIFxcXCJib3R0b20tc3RhcnQgIGJvdHRvbS1jZW50ZXIgIGJvdHRvbS1lbmRcXFwiO2dyaWQtdGVtcGxhdGUtcm93czptaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKSBtaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKSBtaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKTtncmlkLXRlbXBsYXRlLXJvd3M6bWlubWF4KG1pbi1jb250ZW50LGF1dG8pIG1pbm1heChtaW4tY29udGVudCxhdXRvKSBtaW5tYXgobWluLWNvbnRlbnQsYXV0byk7aGVpZ2h0OjEwMCU7cGFkZGluZzouNjI1ZW07b3ZlcmZsb3cteDpoaWRkZW47dHJhbnNpdGlvbjpiYWNrZ3JvdW5kLWNvbG9yIC4xczstd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzp0b3VjaH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJhY2tkcm9wLXNob3csLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ub2FuaW1hdGlvbntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjQpfS5zd2FsMi1jb250YWluZXIuc3dhbDItYmFja2Ryb3AtaGlkZXtiYWNrZ3JvdW5kOjAgMCFpbXBvcnRhbnR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItc3RhcnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOm1pbm1heCgwLDFmcikgYXV0byBhdXRvfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9we2dyaWQtdGVtcGxhdGUtY29sdW1uczphdXRvIG1pbm1heCgwLDFmcikgYXV0b30uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6YXV0byBhdXRvIG1pbm1heCgwLDFmcil9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnQ+LnN3YWwyLXBvcHVwe2FsaWduLXNlbGY6c3RhcnR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3A+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7YWxpZ24tc2VsZjpzdGFydDtqdXN0aWZ5LXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7YWxpZ24tc2VsZjpzdGFydDtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWxlZnQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0Pi5zd2FsMi1wb3B1cHtncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXI7anVzdGlmeS1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXI7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0Pi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MTtncmlkLXJvdzozO2FsaWduLXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2dyaWQtcm93OjM7anVzdGlmeS1zZWxmOmNlbnRlcjthbGlnbi1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2dyaWQtcm93OjM7YWxpZ24tc2VsZjplbmQ7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctZnVsbHNjcmVlbj4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LXJvdz4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MS80O3dpZHRoOjEwMCV9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbj4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWZ1bGxzY3JlZW4+LnN3YWwyLXBvcHVwe2dyaWQtcm93OjEvNDthbGlnbi1zZWxmOnN0cmV0Y2h9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1uby10cmFuc2l0aW9ue3RyYW5zaXRpb246bm9uZSFpbXBvcnRhbnR9LnN3YWwyLXBvcHVwe2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOm1pbm1heCgwLDEwMCUpO3dpZHRoOjMyZW07bWF4LXdpZHRoOjEwMCU7cGFkZGluZzowIDAgMS4yNWVtO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojNTQ1NDU0O2ZvbnQtZmFtaWx5OmluaGVyaXQ7Zm9udC1zaXplOjFyZW19LnN3YWwyLXBvcHVwOmZvY3Vze291dGxpbmU6MH0uc3dhbDItcG9wdXAuc3dhbDItbG9hZGluZ3tvdmVyZmxvdy15OmhpZGRlbn0uc3dhbDItdGl0bGV7cG9zaXRpb246cmVsYXRpdmU7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjA7cGFkZGluZzouOGVtIDFlbSAwO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuODc1ZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtYWxpZ246Y2VudGVyO3RleHQtdHJhbnNmb3JtOm5vbmU7d29yZC13cmFwOmJyZWFrLXdvcmR9LnN3YWwyLWFjdGlvbnN7ZGlzcGxheTpmbGV4O3otaW5kZXg6MTtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6YXV0bzttYXJnaW46MS4yNWVtIGF1dG8gMDtwYWRkaW5nOjB9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkW2Rpc2FibGVkXXtvcGFjaXR5Oi40fS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZDpob3ZlcntiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDAsMCwwLC4xKSxyZ2JhKDAsMCwwLC4xKSl9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDAsMCwwLC4yKSxyZ2JhKDAsMCwwLC4yKSl9LnN3YWwyLWxvYWRlcntkaXNwbGF5Om5vbmU7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6Mi4yZW07aGVpZ2h0OjIuMmVtO21hcmdpbjowIDEuODc1ZW07LXdlYmtpdC1hbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtbG9hZGluZyAxLjVzIGxpbmVhciAwcyBpbmZpbml0ZSBub3JtYWw7Ym9yZGVyLXdpZHRoOi4yNWVtO2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItcmFkaXVzOjEwMCU7Ym9yZGVyLWNvbG9yOiMyNzc4YzQgdHJhbnNwYXJlbnQgIzI3NzhjNCB0cmFuc3BhcmVudH0uc3dhbDItc3R5bGVke21hcmdpbjouMzEyNWVtO3BhZGRpbmc6LjYyNWVtIDEuMWVtO3RyYW5zaXRpb246Ym94LXNoYWRvdyAuMXM7Ym94LXNoYWRvdzowIDAgMCAzcHggdHJhbnNwYXJlbnQ7Zm9udC13ZWlnaHQ6NTAwfS5zd2FsMi1zdHlsZWQ6bm90KFtkaXNhYmxlZF0pe2N1cnNvcjpwb2ludGVyfS5zd2FsMi1zdHlsZWQuc3dhbDItY29uZmlybXtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiM3MDY2ZTA7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItY29uZmlybTpmb2N1c3tib3gtc2hhZG93OjAgMCAwIDNweCByZ2JhKDExMiwxMDIsMjI0LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWRlbnl7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojZGMzNzQxO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWRlbnk6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgyMjAsNTUsNjUsLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItY2FuY2Vse2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6IzZlNzg4MTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1jYW5jZWw6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMTAsMTIwLDEyOSwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1kZWZhdWx0LW91dGxpbmU6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLXN0eWxlZDpmb2N1c3tvdXRsaW5lOjB9LnN3YWwyLXN0eWxlZDo6LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MH0uc3dhbDItZm9vdGVye2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAwIDA7cGFkZGluZzoxZW0gMWVtIDA7Ym9yZGVyLXRvcDoxcHggc29saWQgI2VlZTtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxZW19LnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXJ7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7Z3JpZC1jb2x1bW46YXV0byFpbXBvcnRhbnQ7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOjVweDtib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOjVweH0uc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFye3dpZHRoOjEwMCU7aGVpZ2h0Oi4yNWVtO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuMil9LnN3YWwyLWltYWdle21heC13aWR0aDoxMDAlO21hcmdpbjoyZW0gYXV0byAxZW19LnN3YWwyLWNsb3Nle3otaW5kZXg6MjthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDoxLjJlbTtoZWlnaHQ6MS4yZW07bWFyZ2luLXRvcDowO21hcmdpbi1yaWdodDowO21hcmdpbi1ib3R0b206LTEuMmVtO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW47dHJhbnNpdGlvbjpjb2xvciAuMXMsYm94LXNoYWRvdyAuMXM7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDowIDA7Y29sb3I6I2NjYztmb250LWZhbWlseTpzZXJpZjtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjIuNWVtO2N1cnNvcjpwb2ludGVyO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNsb3NlOmhvdmVye3RyYW5zZm9ybTpub25lO2JhY2tncm91bmQ6MCAwO2NvbG9yOiNmMjc0NzR9LnN3YWwyLWNsb3NlOmZvY3Vze291dGxpbmU6MDtib3gtc2hhZG93Omluc2V0IDAgMCAwIDNweCByZ2JhKDEwMCwxNTAsMjAwLC41KX0uc3dhbDItY2xvc2U6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9LnN3YWwyLWh0bWwtY29udGFpbmVye3otaW5kZXg6MTtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMS42ZW0gLjNlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6YXV0bztjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtO2ZvbnQtd2VpZ2h0OjQwMDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC1hbGlnbjpjZW50ZXI7d29yZC13cmFwOmJyZWFrLXdvcmQ7d29yZC1icmVhazpicmVhay13b3JkfS5zd2FsMi1jaGVja2JveCwuc3dhbDItZmlsZSwuc3dhbDItaW5wdXQsLnN3YWwyLXJhZGlvLC5zd2FsMi1zZWxlY3QsLnN3YWwyLXRleHRhcmVhe21hcmdpbjoxZW0gMmVtIDNweH0uc3dhbDItZmlsZSwuc3dhbDItaW5wdXQsLnN3YWwyLXRleHRhcmVhe2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDphdXRvO3RyYW5zaXRpb246Ym9yZGVyLWNvbG9yIC4xcyxib3gtc2hhZG93IC4xcztib3JkZXI6MXB4IHNvbGlkICNkOWQ5ZDk7Ym9yZGVyLXJhZGl1czouMTg3NWVtO2JhY2tncm91bmQ6MCAwO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA2KSwwIDAgMCAzcHggdHJhbnNwYXJlbnQ7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItZmlsZS5zd2FsMi1pbnB1dGVycm9yLC5zd2FsMi1pbnB1dC5zd2FsMi1pbnB1dGVycm9yLC5zd2FsMi10ZXh0YXJlYS5zd2FsMi1pbnB1dGVycm9ye2JvcmRlci1jb2xvcjojZjI3NDc0IWltcG9ydGFudDtib3gtc2hhZG93OjAgMCAycHggI2YyNzQ3NCFpbXBvcnRhbnR9LnN3YWwyLWZpbGU6Zm9jdXMsLnN3YWwyLWlucHV0OmZvY3VzLC5zd2FsMi10ZXh0YXJlYTpmb2N1c3tib3JkZXI6MXB4IHNvbGlkICNiNGRiZWQ7b3V0bGluZTowO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA2KSwwIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLWZpbGU6Oi1tb3otcGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6LW1vei1wbGFjZWhvbGRlcntjb2xvcjojY2NjfS5zd2FsMi1maWxlOjpwbGFjZWhvbGRlciwuc3dhbDItaW5wdXQ6OnBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6cGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItcmFuZ2V7bWFyZ2luOjFlbSAyZW0gM3B4O2JhY2tncm91bmQ6I2ZmZn0uc3dhbDItcmFuZ2UgaW5wdXR7d2lkdGg6ODAlfS5zd2FsMi1yYW5nZSBvdXRwdXR7d2lkdGg6MjAlO2NvbG9yOmluaGVyaXQ7Zm9udC13ZWlnaHQ6NjAwO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1yYW5nZSBpbnB1dCwuc3dhbDItcmFuZ2Ugb3V0cHV0e2hlaWdodDoyLjYyNWVtO3BhZGRpbmc6MDtmb250LXNpemU6MS4xMjVlbTtsaW5lLWhlaWdodDoyLjYyNWVtfS5zd2FsMi1pbnB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjAgLjc1ZW19LnN3YWwyLWZpbGV7d2lkdGg6NzUlO21hcmdpbi1yaWdodDphdXRvO21hcmdpbi1sZWZ0OmF1dG87YmFja2dyb3VuZDowIDA7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLXRleHRhcmVhe2hlaWdodDo2Ljc1ZW07cGFkZGluZzouNzVlbX0uc3dhbDItc2VsZWN0e21pbi13aWR0aDo1MCU7bWF4LXdpZHRoOjEwMCU7cGFkZGluZzouMzc1ZW0gLjYyNWVtO2JhY2tncm91bmQ6MCAwO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94LC5zd2FsMi1yYWRpb3thbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtiYWNrZ3JvdW5kOiNmZmY7Y29sb3I6aW5oZXJpdH0uc3dhbDItY2hlY2tib3ggbGFiZWwsLnN3YWwyLXJhZGlvIGxhYmVse21hcmdpbjowIC42ZW07Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94IGlucHV0LC5zd2FsMi1yYWRpbyBpbnB1dHtmbGV4LXNocmluazowO21hcmdpbjowIC40ZW19LnN3YWwyLWlucHV0LWxhYmVse2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gYXV0byAwfS5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAwIDA7cGFkZGluZzouNjI1ZW07b3ZlcmZsb3c6aGlkZGVuO2JhY2tncm91bmQ6I2YwZjBmMDtjb2xvcjojNjY2O2ZvbnQtc2l6ZToxZW07Zm9udC13ZWlnaHQ6MzAwfS5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2U6OmJlZm9yZXtjb250ZW50OlxcXCIhXFxcIjtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoxLjVlbTttaW4td2lkdGg6MS41ZW07aGVpZ2h0OjEuNWVtO21hcmdpbjowIC42MjVlbTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo2MDA7bGluZS1oZWlnaHQ6MS41ZW07dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLWljb257cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpjb250ZW50LWJveDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjVlbTtoZWlnaHQ6NWVtO21hcmdpbjoyLjVlbSBhdXRvIC42ZW07Ym9yZGVyOi4yNWVtIHNvbGlkIHRyYW5zcGFyZW50O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlci1jb2xvcjojMDAwO2ZvbnQtZmFtaWx5OmluaGVyaXQ7bGluZS1oZWlnaHQ6NWVtO2N1cnNvcjpkZWZhdWx0Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uc3dhbDItaWNvbiAuc3dhbDItaWNvbi1jb250ZW50e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjMuNzVlbX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NDtjb2xvcjojZjI3NDc0fS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIC5zd2FsMi14LW1hcmt7cG9zaXRpb246cmVsYXRpdmU7ZmxleC1ncm93OjF9LnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6Mi4zMTI1ZW07d2lkdGg6Mi45Mzc1ZW07aGVpZ2h0Oi4zMTI1ZW07Ym9yZGVyLXJhZGl1czouMTI1ZW07YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0fS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1sZWZ0XXtsZWZ0OjEuMDYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6MWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvci5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1lcnJvci5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXgtbWFya3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrIC41c30uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5ne2JvcmRlci1jb2xvcjojZmFjZWE4O2NvbG9yOiNmOGJiODZ9LnN3YWwyLWljb24uc3dhbDItd2FybmluZy5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5nLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjVzfS5zd2FsMi1pY29uLnN3YWwyLWluZm97Ym9yZGVyLWNvbG9yOiM5ZGUwZjY7Y29sb3I6IzNmYzNlZX0uc3dhbDItaWNvbi5zd2FsMi1pbmZvLnN3YWwyLWljb24tc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLWluZm8uc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjhzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuOHN9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb257Ym9yZGVyLWNvbG9yOiNjOWRhZTE7Y29sb3I6Izg3YWRiZH0uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbi5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbi5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmsgLjhzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODY7Y29sb3I6I2E1ZGM4Nn0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDozLjc1ZW07aGVpZ2h0OjcuNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS40Mzc1ZW07bGVmdDotMi4wNjM1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46My43NWVtIDMuNzVlbTtib3JkZXItcmFkaXVzOjcuNWVtIDAgMCA3LjVlbX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjY4NzVlbTtsZWZ0OjEuODc1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MCAzLjc1ZW07Ym9yZGVyLXJhZGl1czowIDcuNWVtIDcuNWVtIDB9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6Mjt0b3A6LS4yNWVtO2xlZnQ6LS4yNWVtO2JveC1zaXppbmc6Y29udGVudC1ib3g7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6LjI1ZW0gc29saWQgcmdiYSgxNjUsMjIwLDEzNCwuMyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1maXh7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoxO3RvcDouNWVtO2xlZnQ6MS42MjVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDo1LjYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MjtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjIuODc1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLXRpcHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25ney13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWluO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lIDQuMjVzIGVhc2UtaW59LnN3YWwyLXByb2dyZXNzLXN0ZXBze2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjttYXgtd2lkdGg6MTAwJTttYXJnaW46MS4yNWVtIGF1dG87cGFkZGluZzowO2JhY2tncm91bmQ6MCAwO2ZvbnQtd2VpZ2h0OjYwMH0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgbGl7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246cmVsYXRpdmV9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwe3otaW5kZXg6MjA7ZmxleC1zaHJpbms6MDt3aWR0aDoyZW07aGVpZ2h0OjJlbTtib3JkZXItcmFkaXVzOjJlbTtiYWNrZ3JvdW5kOiMyNzc4YzQ7Y29sb3I6I2ZmZjtsaW5lLWhlaWdodDoyZW07dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwe2JhY2tncm91bmQ6IzI3NzhjNH0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB+LnN3YWwyLXByb2dyZXNzLXN0ZXB7YmFja2dyb3VuZDojYWRkOGU2O2NvbG9yOiNmZmZ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwLWxpbmV7YmFja2dyb3VuZDojYWRkOGU2fS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC1saW5le3otaW5kZXg6MTA7ZmxleC1zaHJpbms6MDt3aWR0aDoyLjVlbTtoZWlnaHQ6LjRlbTttYXJnaW46MCAtMXB4O2JhY2tncm91bmQ6IzI3NzhjNH1bY2xhc3NePXN3YWwyXXstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6dHJhbnNwYXJlbnR9LnN3YWwyLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItc2hvdyAuM3M7YW5pbWF0aW9uOnN3YWwyLXNob3cgLjNzfS5zd2FsMi1oaWRley13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWhpZGUgLjE1cyBmb3J3YXJkczthbmltYXRpb246c3dhbDItaGlkZSAuMTVzIGZvcndhcmRzfS5zd2FsMi1ub2FuaW1hdGlvbnt0cmFuc2l0aW9uOm5vbmV9LnN3YWwyLXNjcm9sbGJhci1tZWFzdXJle3Bvc2l0aW9uOmFic29sdXRlO3RvcDotOTk5OXB4O3dpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6c2Nyb2xsfS5zd2FsMi1ydGwgLnN3YWwyLWNsb3Nle21hcmdpbi1yaWdodDppbml0aWFsO21hcmdpbi1sZWZ0OjB9LnN3YWwyLXJ0bCAuc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFye3JpZ2h0OjA7bGVmdDphdXRvfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGR7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTkzOTt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7cGFkZGluZzoyNXB4IDAgMjBweDtiYWNrZ3JvdW5kOiMyMDIzMmE7Y29sb3I6I2ZmZjt0ZXh0LWFsaWduOmNlbnRlcn0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGRpdnttYXgtd2lkdGg6NTYwcHg7bWFyZ2luOjEwcHg7bGluZS1oZWlnaHQ6MTQ2JX0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGlmcmFtZXttYXgtd2lkdGg6MTAwJTttYXgtaGVpZ2h0OjU1LjU1NTU1NTU1NTZ2bWluO21hcmdpbjoxNnB4IGF1dG99LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBzdHJvbmd7Ym9yZGVyLWJvdHRvbToycHggZGFzaGVkICNmZmZ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBidXR0b257ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTk0MDt0b3A6MDtyaWdodDowO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjQ4cHg7aGVpZ2h0OjQ4cHg7bWFyZ2luLXJpZ2h0OjEwcHg7bWFyZ2luLWJvdHRvbTotMTBweDtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojYWFhO2ZvbnQtc2l6ZTo0OHB4O2ZvbnQtd2VpZ2h0OjcwMDtjdXJzb3I6cG9pbnRlcn0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGJ1dHRvbjpob3Zlcntjb2xvcjojZmZmfUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1zaG93ezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0uNjI1ZW0pIHJvdGF0ZVooMmRlZyl9MzMle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXt0cmFuc2Zvcm06dHJhbnNsYXRlWSguMzEyNWVtKSByb3RhdGVaKDJkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1zaG93ezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0uNjI1ZW0pIHJvdGF0ZVooMmRlZyl9MzMle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXt0cmFuc2Zvcm06dHJhbnNsYXRlWSguMzEyNWVtKSByb3RhdGVaKDJkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWhpZGV7MTAwJXt0cmFuc2Zvcm06cm90YXRlWigxZGVnKTtvcGFjaXR5OjB9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAle3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6LjU2MjVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOi4xMjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6LjYyNWVtO2xlZnQ6LS4yNWVtO3dpZHRoOjEuNjI1ZW19ODQle3RvcDoxLjA2MjVlbTtsZWZ0Oi43NWVtO3dpZHRoOi41ZW19MTAwJXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDouNTYyNWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6LjEyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDouNjI1ZW07bGVmdDotLjI1ZW07d2lkdGg6MS42MjVlbX04NCV7dG9wOjEuMDYyNWVtO2xlZnQ6Ljc1ZW07d2lkdGg6LjVlbX0xMDAle3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItc2hvd3swJXt0cmFuc2Zvcm06c2NhbGUoLjcpfTQ1JXt0cmFuc2Zvcm06c2NhbGUoMS4wNSl9ODAle3RyYW5zZm9ybTpzY2FsZSguOTUpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1Aa2V5ZnJhbWVzIHN3YWwyLXNob3d7MCV7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXt0cmFuc2Zvcm06c2NhbGUoLjk1KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpzY2FsZSguNSk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpzY2FsZSguNSk7b3BhY2l0eTowfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDoxLjE4NzVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOjEuMDYyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDoyLjE4NzVlbTtsZWZ0Oi0uMzc1ZW07d2lkdGg6My4xMjVlbX04NCV7dG9wOjNlbTtsZWZ0OjEuMzEyNWVtO3dpZHRoOjEuMDYyNWVtfTEwMCV7dG9wOjIuODEyNWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOjEuMTg3NWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6MS4wNjI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOjIuMTg3NWVtO2xlZnQ6LS4zNzVlbTt3aWR0aDozLjEyNWVtfTg0JXt0b3A6M2VtO2xlZnQ6MS4zMTI1ZW07d2lkdGg6MS4wNjI1ZW19MTAwJXt0b3A6Mi44MTI1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9NjUle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH04NCV7dG9wOjIuMTg3NWVtO3JpZ2h0OjA7d2lkdGg6My40Mzc1ZW19MTAwJXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTY1JXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9ODQle3RvcDoyLjE4NzVlbTtyaWdodDowO3dpZHRoOjMuNDM3NWVtfTEwMCV7dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9fUBrZXlmcmFtZXMgc3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZXswJXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9NSV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTEyJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmt7MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTUwJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9ODAle21hcmdpbi10b3A6LS4zNzVlbTt0cmFuc2Zvcm06c2NhbGUoMS4xNSl9MTAwJXttYXJnaW4tdG9wOjA7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbnswJXt0cmFuc2Zvcm06cm90YXRlWCgxMDBkZWcpO29wYWNpdHk6MH0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1yb3RhdGUtbG9hZGluZ3swJXt0cmFuc2Zvcm06cm90YXRlKDApfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1sb2FkaW5nezAle3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoLTM2MGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgwKX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoLTM2MGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgwKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtaS1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVaKDQ1ZGVnKTtvcGFjaXR5OjB9MjUle3RyYW5zZm9ybTpyb3RhdGVaKC0yNWRlZyk7b3BhY2l0eTouNH01MCV7dHJhbnNmb3JtOnJvdGF0ZVooMTVkZWcpO29wYWNpdHk6Ljh9NzUle3RyYW5zZm9ybTpyb3RhdGVaKC01ZGVnKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1pLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVooNDVkZWcpO29wYWNpdHk6MH0yNSV7dHJhbnNmb3JtOnJvdGF0ZVooLTI1ZGVnKTtvcGFjaXR5Oi40fTUwJXt0cmFuc2Zvcm06cm90YXRlWigxNWRlZyk7b3BhY2l0eTouOH03NSV7dHJhbnNmb3JtOnJvdGF0ZVooLTVkZWcpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKXtvdmVyZmxvdzpoaWRkZW59Ym9keS5zd2FsMi1oZWlnaHQtYXV0b3toZWlnaHQ6YXV0byFpbXBvcnRhbnR9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O3BvaW50ZXItZXZlbnRzOm5vbmV9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1wb3B1cHtwb2ludGVyLWV2ZW50czphbGx9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1tb2RhbHtib3gtc2hhZG93OjAgMCAxMHB4IHJnYmEoMCwwLDAsLjQpfUBtZWRpYSBwcmludHtib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93LXk6c2Nyb2xsIWltcG9ydGFudH1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pPlthcmlhLWhpZGRlbj10cnVlXXtkaXNwbGF5Om5vbmV9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKSAuc3dhbDItY29udGFpbmVye3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnR9fWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lcntib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MzYwcHg7bWF4LXdpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtwb2ludGVyLWV2ZW50czpub25lfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7dG9wOjA7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0e3RvcDowO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0e3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlcnt0b3A6NTAlO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHR7dG9wOjUwJTtyaWdodDowO2JvdHRvbTphdXRvO2xlZnQ6YXV0bzt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydHt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6MH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9te3RvcDphdXRvO3JpZ2h0OmF1dG87Ym90dG9tOjA7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodHt0b3A6YXV0bztyaWdodDowO2JvdHRvbTowO2xlZnQ6YXV0b31cIik7IiwgImNvbnN0IFN3YWwgPSByZXF1aXJlKFwic3dlZXRhbGVydDJcIik7XG5cbmV4cG9ydCBmdW5jdGlvbiBwZCguLi5tZXM6IGFueSk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKG1lcyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbChtZXM6IHN0cmluZykge1xuICAgIFN3YWwuZmlyZSh7XG4gICAgICAgIHRleHQ6IG1lcyxcbiAgICAgICAgdG9hc3Q6IHRydWUsXG4gICAgICAgIHBvc2l0aW9uOiBcInRvcC1lbmRcIixcbiAgICAgICAgdGltZXI6IDMgKiAxMDAwLFxuICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2VcbiAgICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNvbmZpcm0obWVzOiBzdHJpbmcsIG9rOiBzdHJpbmcsIGNhbmNlbDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgU3dhbC5maXJlKHtcbiAgICAgICAgdGV4dDogbWVzLFxuICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2UsXG4gICAgICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogb2ssXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IGNhbmNlbFxuICAgIH0pO1xuICAgIGNvbnN0IHJldDpib29sZWFuID0gcmVzLnZhbHVlO1xuICAgIHJldHVybiByZXQ7XG59XG5leHBvcnQgdmFyIHRvYXN0ID0ge1xuICAgIG5vcm1hbDogbm9ybWFsLFxuICAgIGNvbmZpcm06IGNvbmZpcm1cbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1JnYkhleChjb2w6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiI1wiICsgY29sLm1hdGNoKC9cXGQrL2cpLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gKFwiMFwiICsgcGFyc2VJbnQoYSkudG9TdHJpbmcoMTYpKS5zbGljZSgtMil9KS5qb2luKFwiXCIpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvSW50ZWdlcihkaXJ0eU51bWJlcikge1xuICBpZiAoZGlydHlOdW1iZXIgPT09IG51bGwgfHwgZGlydHlOdW1iZXIgPT09IHRydWUgfHwgZGlydHlOdW1iZXIgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuXG4gIHZhciBudW1iZXIgPSBOdW1iZXIoZGlydHlOdW1iZXIpO1xuXG4gIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPCAwID8gTWF0aC5jZWlsKG51bWJlcikgOiBNYXRoLmZsb29yKG51bWJlcik7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlcXVpcmVkQXJncyhyZXF1aXJlZCwgYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPCByZXF1aXJlZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocmVxdWlyZWQgKyAnIGFyZ3VtZW50JyArIChyZXF1aXJlZCA+IDEgPyAncycgOiAnJykgKyAnIHJlcXVpcmVkLCBidXQgb25seSAnICsgYXJncy5sZW5ndGggKyAnIHByZXNlbnQnKTtcbiAgfVxufSIsICJpbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9fbGliL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSB0b0RhdGVcbiAqIEBjYXRlZ29yeSBDb21tb24gSGVscGVyc1xuICogQHN1bW1hcnkgQ29udmVydCB0aGUgZ2l2ZW4gYXJndW1lbnQgdG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENvbnZlcnQgdGhlIGdpdmVuIGFyZ3VtZW50IHRvIGFuIGluc3RhbmNlIG9mIERhdGUuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIGFuIGluc3RhbmNlIG9mIERhdGUsIHRoZSBmdW5jdGlvbiByZXR1cm5zIGl0cyBjbG9uZS5cbiAqXG4gKiBJZiB0aGUgYXJndW1lbnQgaXMgYSBudW1iZXIsIGl0IGlzIHRyZWF0ZWQgYXMgYSB0aW1lc3RhbXAuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIG5vbmUgb2YgdGhlIGFib3ZlLCB0aGUgZnVuY3Rpb24gcmV0dXJucyBJbnZhbGlkIERhdGUuXG4gKlxuICogKipOb3RlKio6ICphbGwqIERhdGUgYXJndW1lbnRzIHBhc3NlZCB0byBhbnkgKmRhdGUtZm5zKiBmdW5jdGlvbiBpcyBwcm9jZXNzZWQgYnkgYHRvRGF0ZWAuXG4gKlxuICogQHBhcmFtIHtEYXRlfE51bWJlcn0gYXJndW1lbnQgLSB0aGUgdmFsdWUgdG8gY29udmVydFxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZSBpbiB0aGUgbG9jYWwgdGltZSB6b25lXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDEgYXJndW1lbnQgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2xvbmUgdGhlIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSB0b0RhdGUobmV3IERhdGUoMjAxNCwgMSwgMTEsIDExLCAzMCwgMzApKVxuICogLy89PiBUdWUgRmViIDExIDIwMTQgMTE6MzA6MzBcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ29udmVydCB0aGUgdGltZXN0YW1wIHRvIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSB0b0RhdGUoMTM5MjA5ODQzMDAwMClcbiAqIC8vPT4gVHVlIEZlYiAxMSAyMDE0IDExOjMwOjMwXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9EYXRlKGFyZ3VtZW50KSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgYXJnU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3VtZW50KTsgLy8gQ2xvbmUgdGhlIGRhdGVcblxuICBpZiAoYXJndW1lbnQgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZiBhcmd1bWVudCA9PT0gJ29iamVjdCcgJiYgYXJnU3RyID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAvLyBQcmV2ZW50IHRoZSBkYXRlIHRvIGxvc2UgdGhlIG1pbGxpc2Vjb25kcyB3aGVuIHBhc3NlZCB0byBuZXcgRGF0ZSgpIGluIElFMTBcbiAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnQuZ2V0VGltZSgpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnQgPT09ICdudW1iZXInIHx8IGFyZ1N0ciA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIGlmICgodHlwZW9mIGFyZ3VtZW50ID09PSAnc3RyaW5nJyB8fCBhcmdTdHIgPT09ICdbb2JqZWN0IFN0cmluZ10nKSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXCJTdGFydGluZyB3aXRoIHYyLjAuMC1iZXRhLjEgZGF0ZS1mbnMgZG9lc24ndCBhY2NlcHQgc3RyaW5ncyBhcyBkYXRlIGFyZ3VtZW50cy4gUGxlYXNlIHVzZSBgcGFyc2VJU09gIHRvIHBhcnNlIHN0cmluZ3MuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdXBncmFkZUd1aWRlLm1kI3N0cmluZy1hcmd1bWVudHNcIik7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG5cbiAgICAgIGNvbnNvbGUud2FybihuZXcgRXJyb3IoKS5zdGFjayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlKE5hTik7XG4gIH1cbn0iLCAiaW1wb3J0IHRvSW50ZWdlciBmcm9tIFwiLi4vX2xpYi90b0ludGVnZXIvaW5kZXguanNcIjtcbmltcG9ydCB0b0RhdGUgZnJvbSBcIi4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgYWRkTWlsbGlzZWNvbmRzXG4gKiBAY2F0ZWdvcnkgTWlsbGlzZWNvbmQgSGVscGVyc1xuICogQHN1bW1hcnkgQWRkIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFkZCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhlIGdpdmVuIGRhdGUuXG4gKlxuICogQHBhcmFtIHtEYXRlfE51bWJlcn0gZGF0ZSAtIHRoZSBkYXRlIHRvIGJlIGNoYW5nZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBhbW91bnQgLSB0aGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBiZSBhZGRlZC4gUG9zaXRpdmUgZGVjaW1hbHMgd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmZsb29yYCwgZGVjaW1hbHMgbGVzcyB0aGFuIHplcm8gd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmNlaWxgLlxuICogQHJldHVybnMge0RhdGV9IHRoZSBuZXcgZGF0ZSB3aXRoIHRoZSBtaWxsaXNlY29uZHMgYWRkZWRcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gMiBhcmd1bWVudHMgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQWRkIDc1MCBtaWxsaXNlY29uZHMgdG8gMTAgSnVseSAyMDE0IDEyOjQ1OjMwLjAwMDpcbiAqIGNvbnN0IHJlc3VsdCA9IGFkZE1pbGxpc2Vjb25kcyhuZXcgRGF0ZSgyMDE0LCA2LCAxMCwgMTIsIDQ1LCAzMCwgMCksIDc1MClcbiAqIC8vPT4gVGh1IEp1bCAxMCAyMDE0IDEyOjQ1OjMwLjc1MFxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZE1pbGxpc2Vjb25kcyhkaXJ0eURhdGUsIGRpcnR5QW1vdW50KSB7XG4gIHJlcXVpcmVkQXJncygyLCBhcmd1bWVudHMpO1xuICB2YXIgdGltZXN0YW1wID0gdG9EYXRlKGRpcnR5RGF0ZSkuZ2V0VGltZSgpO1xuICB2YXIgYW1vdW50ID0gdG9JbnRlZ2VyKGRpcnR5QW1vdW50KTtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVzdGFtcCArIGFtb3VudCk7XG59IiwgInZhciBkZWZhdWx0T3B0aW9ucyA9IHt9O1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4gZGVmYXVsdE9wdGlvbnM7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0RGVmYXVsdE9wdGlvbnMobmV3T3B0aW9ucykge1xuICBkZWZhdWx0T3B0aW9ucyA9IG5ld09wdGlvbnM7XG59IiwgIi8qKlxuICogR29vZ2xlIENocm9tZSBhcyBvZiA2Ny4wLjMzOTYuODcgaW50cm9kdWNlZCB0aW1lem9uZXMgd2l0aCBvZmZzZXQgdGhhdCBpbmNsdWRlcyBzZWNvbmRzLlxuICogVGhleSB1c3VhbGx5IGFwcGVhciBmb3IgZGF0ZXMgdGhhdCBkZW5vdGUgdGltZSBiZWZvcmUgdGhlIHRpbWV6b25lcyB3ZXJlIGludHJvZHVjZWRcbiAqIChlLmcuIGZvciAnRXVyb3BlL1ByYWd1ZScgdGltZXpvbmUgdGhlIG9mZnNldCBpcyBHTVQrMDA6NTc6NDQgYmVmb3JlIDEgT2N0b2JlciAxODkxXG4gKiBhbmQgR01UKzAxOjAwOjAwIGFmdGVyIHRoYXQgZGF0ZSlcbiAqXG4gKiBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgdGhlIG9mZnNldCBpbiBtaW51dGVzIGFuZCB3b3VsZCByZXR1cm4gNTcgZm9yIHRoZSBleGFtcGxlIGFib3ZlLFxuICogd2hpY2ggd291bGQgbGVhZCB0byBpbmNvcnJlY3QgY2FsY3VsYXRpb25zLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgdGltZXpvbmUgb2Zmc2V0IGluIG1pbGxpc2Vjb25kcyB0aGF0IHRha2VzIHNlY29uZHMgaW4gYWNjb3VudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VGltZXpvbmVPZmZzZXRJbk1pbGxpc2Vjb25kcyhkYXRlKSB7XG4gIHZhciB1dGNEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpLCBkYXRlLmdldEhvdXJzKCksIGRhdGUuZ2V0TWludXRlcygpLCBkYXRlLmdldFNlY29uZHMoKSwgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSkpO1xuICB1dGNEYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSk7XG4gIHJldHVybiBkYXRlLmdldFRpbWUoKSAtIHV0Y0RhdGUuZ2V0VGltZSgpO1xufSIsICIvKipcbiAqIERheXMgaW4gMSB3ZWVrLlxuICpcbiAqIEBuYW1lIGRheXNJbldlZWtcbiAqIEBjb25zdGFudFxuICogQHR5cGUge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cbmV4cG9ydCB2YXIgZGF5c0luV2VlayA9IDc7XG4vKipcbiAqIERheXMgaW4gMSB5ZWFyXG4gKiBPbmUgeWVhcnMgZXF1YWxzIDM2NS4yNDI1IGRheXMgYWNjb3JkaW5nIHRvIHRoZSBmb3JtdWxhOlxuICpcbiAqID4gTGVhcCB5ZWFyIG9jY3VyZXMgZXZlcnkgNCB5ZWFycywgZXhjZXB0IGZvciB5ZWFycyB0aGF0IGFyZSBkaXZpc2FibGUgYnkgMTAwIGFuZCBub3QgZGl2aXNhYmxlIGJ5IDQwMC5cbiAqID4gMSBtZWFuIHllYXIgPSAoMzY1KzEvNC0xLzEwMCsxLzQwMCkgZGF5cyA9IDM2NS4yNDI1IGRheXNcbiAqXG4gKiBAbmFtZSBkYXlzSW5ZZWFyXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgZGF5c0luWWVhciA9IDM2NS4yNDI1O1xuLyoqXG4gKiBNYXhpbXVtIGFsbG93ZWQgdGltZS5cbiAqXG4gKiBAbmFtZSBtYXhUaW1lXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgbWF4VGltZSA9IE1hdGgucG93KDEwLCA4KSAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4vKipcbiAqIE1pbGxpc2Vjb25kcyBpbiAxIG1pbnV0ZVxuICpcbiAqIEBuYW1lIG1pbGxpc2Vjb25kc0luTWludXRlXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgbWlsbGlzZWNvbmRzSW5NaW51dGUgPSA2MDAwMDtcbi8qKlxuICogTWlsbGlzZWNvbmRzIGluIDEgaG91clxuICpcbiAqIEBuYW1lIG1pbGxpc2Vjb25kc0luSG91clxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQGRlZmF1bHRcbiAqL1xuXG5leHBvcnQgdmFyIG1pbGxpc2Vjb25kc0luSG91ciA9IDM2MDAwMDA7XG4vKipcbiAqIE1pbGxpc2Vjb25kcyBpbiAxIHNlY29uZFxuICpcbiAqIEBuYW1lIG1pbGxpc2Vjb25kc0luU2Vjb25kXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgbWlsbGlzZWNvbmRzSW5TZWNvbmQgPSAxMDAwO1xuLyoqXG4gKiBNaW5pbXVtIGFsbG93ZWQgdGltZS5cbiAqXG4gKiBAbmFtZSBtaW5UaW1lXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgbWluVGltZSA9IC1tYXhUaW1lO1xuLyoqXG4gKiBNaW51dGVzIGluIDEgaG91clxuICpcbiAqIEBuYW1lIG1pbnV0ZXNJbkhvdXJcbiAqIEBjb25zdGFudFxuICogQHR5cGUge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cblxuZXhwb3J0IHZhciBtaW51dGVzSW5Ib3VyID0gNjA7XG4vKipcbiAqIE1vbnRocyBpbiAxIHF1YXJ0ZXJcbiAqXG4gKiBAbmFtZSBtb250aHNJblF1YXJ0ZXJcbiAqIEBjb25zdGFudFxuICogQHR5cGUge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cblxuZXhwb3J0IHZhciBtb250aHNJblF1YXJ0ZXIgPSAzO1xuLyoqXG4gKiBNb250aHMgaW4gMSB5ZWFyXG4gKlxuICogQG5hbWUgbW9udGhzSW5ZZWFyXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgbW9udGhzSW5ZZWFyID0gMTI7XG4vKipcbiAqIFF1YXJ0ZXJzIGluIDEgeWVhclxuICpcbiAqIEBuYW1lIHF1YXJ0ZXJzSW5ZZWFyXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgcXVhcnRlcnNJblllYXIgPSA0O1xuLyoqXG4gKiBTZWNvbmRzIGluIDEgaG91clxuICpcbiAqIEBuYW1lIHNlY29uZHNJbkhvdXJcbiAqIEBjb25zdGFudFxuICogQHR5cGUge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cblxuZXhwb3J0IHZhciBzZWNvbmRzSW5Ib3VyID0gMzYwMDtcbi8qKlxuICogU2Vjb25kcyBpbiAxIG1pbnV0ZVxuICpcbiAqIEBuYW1lIHNlY29uZHNJbk1pbnV0ZVxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQGRlZmF1bHRcbiAqL1xuXG5leHBvcnQgdmFyIHNlY29uZHNJbk1pbnV0ZSA9IDYwO1xuLyoqXG4gKiBTZWNvbmRzIGluIDEgZGF5XG4gKlxuICogQG5hbWUgc2Vjb25kc0luRGF5XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgc2Vjb25kc0luRGF5ID0gc2Vjb25kc0luSG91ciAqIDI0O1xuLyoqXG4gKiBTZWNvbmRzIGluIDEgd2Vla1xuICpcbiAqIEBuYW1lIHNlY29uZHNJbldlZWtcbiAqIEBjb25zdGFudFxuICogQHR5cGUge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cblxuZXhwb3J0IHZhciBzZWNvbmRzSW5XZWVrID0gc2Vjb25kc0luRGF5ICogNztcbi8qKlxuICogU2Vjb25kcyBpbiAxIHllYXJcbiAqXG4gKiBAbmFtZSBzZWNvbmRzSW5ZZWFyXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgc2Vjb25kc0luWWVhciA9IHNlY29uZHNJbkRheSAqIGRheXNJblllYXI7XG4vKipcbiAqIFNlY29uZHMgaW4gMSBtb250aFxuICpcbiAqIEBuYW1lIHNlY29uZHNJbk1vbnRoXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG5cbmV4cG9ydCB2YXIgc2Vjb25kc0luTW9udGggPSBzZWNvbmRzSW5ZZWFyIC8gMTI7XG4vKipcbiAqIFNlY29uZHMgaW4gMSBxdWFydGVyXG4gKlxuICogQG5hbWUgc2Vjb25kc0luUXVhcnRlclxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQGRlZmF1bHRcbiAqL1xuXG5leHBvcnQgdmFyIHNlY29uZHNJblF1YXJ0ZXIgPSBzZWNvbmRzSW5Nb250aCAqIDM7IiwgImltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG4vKipcbiAqIEBuYW1lIGlzRGF0ZVxuICogQGNhdGVnb3J5IENvbW1vbiBIZWxwZXJzXG4gKiBAc3VtbWFyeSBJcyB0aGUgZ2l2ZW4gdmFsdWUgYSBkYXRlP1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBEYXRlLiBUaGUgZnVuY3Rpb24gd29ya3MgZm9yIGRhdGVzIHRyYW5zZmVycmVkIGFjcm9zcyBpZnJhbWVzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIGRhdGVcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gMSBhcmd1bWVudHMgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIGEgdmFsaWQgZGF0ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZShuZXcgRGF0ZSgpKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciBhbiBpbnZhbGlkIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSBpc0RhdGUobmV3IERhdGUoTmFOKSlcbiAqIC8vPT4gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBGb3Igc29tZSB2YWx1ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZSgnMjAxNC0wMi0zMScpXG4gKiAvLz0+IGZhbHNlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciBhbiBvYmplY3Q6XG4gKiBjb25zdCByZXN1bHQgPSBpc0RhdGUoe30pXG4gKiAvLz0+IGZhbHNlXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufSIsICJpbXBvcnQgaXNEYXRlIGZyb20gXCIuLi9pc0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCB0b0RhdGUgZnJvbSBcIi4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgaXNWYWxpZFxuICogQGNhdGVnb3J5IENvbW1vbiBIZWxwZXJzXG4gKiBAc3VtbWFyeSBJcyB0aGUgZ2l2ZW4gZGF0ZSB2YWxpZD9cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFJldHVybnMgZmFsc2UgaWYgYXJndW1lbnQgaXMgSW52YWxpZCBEYXRlIGFuZCB0cnVlIG90aGVyd2lzZS5cbiAqIEFyZ3VtZW50IGlzIGNvbnZlcnRlZCB0byBEYXRlIHVzaW5nIGB0b0RhdGVgLiBTZWUgW3RvRGF0ZV17QGxpbmsgaHR0cHM6Ly9kYXRlLWZucy5vcmcvZG9jcy90b0RhdGV9XG4gKiBJbnZhbGlkIERhdGUgaXMgYSBEYXRlLCB3aG9zZSB0aW1lIHZhbHVlIGlzIE5hTi5cbiAqXG4gKiBUaW1lIHZhbHVlIG9mIERhdGU6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuOS4xLjFcbiAqXG4gKiBAcGFyYW0geyp9IGRhdGUgLSB0aGUgZGF0ZSB0byBjaGVja1xuICogQHJldHVybnMge0Jvb2xlYW59IHRoZSBkYXRlIGlzIHZhbGlkXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDEgYXJndW1lbnQgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIHRoZSB2YWxpZCBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNWYWxpZChuZXcgRGF0ZSgyMDE0LCAxLCAzMSkpXG4gKiAvLz0+IHRydWVcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIHRoZSB2YWx1ZSwgY29udmVydGFibGUgaW50byBhIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSBpc1ZhbGlkKDEzOTM4MDQ4MDAwMDApXG4gKiAvLz0+IHRydWVcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIHRoZSBpbnZhbGlkIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSBpc1ZhbGlkKG5ldyBEYXRlKCcnKSlcbiAqIC8vPT4gZmFsc2VcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1ZhbGlkKGRpcnR5RGF0ZSkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcblxuICBpZiAoIWlzRGF0ZShkaXJ0eURhdGUpICYmIHR5cGVvZiBkaXJ0eURhdGUgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgcmV0dXJuICFpc05hTihOdW1iZXIoZGF0ZSkpO1xufSIsICJpbXBvcnQgYWRkTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9hZGRNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi9fbGliL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSBzdWJNaWxsaXNlY29uZHNcbiAqIEBjYXRlZ29yeSBNaWxsaXNlY29uZCBIZWxwZXJzXG4gKiBAc3VtbWFyeSBTdWJ0cmFjdCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZnJvbSB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN1YnRyYWN0IHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBmcm9tIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgZGF0ZSB0byBiZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IC0gdGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gYmUgc3VidHJhY3RlZC4gUG9zaXRpdmUgZGVjaW1hbHMgd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmZsb29yYCwgZGVjaW1hbHMgbGVzcyB0aGFuIHplcm8gd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmNlaWxgLlxuICogQHJldHVybnMge0RhdGV9IHRoZSBuZXcgZGF0ZSB3aXRoIHRoZSBtaWxsaXNlY29uZHMgc3VidHJhY3RlZFxuICogQHRocm93cyB7VHlwZUVycm9yfSAyIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTdWJ0cmFjdCA3NTAgbWlsbGlzZWNvbmRzIGZyb20gMTAgSnVseSAyMDE0IDEyOjQ1OjMwLjAwMDpcbiAqIGNvbnN0IHJlc3VsdCA9IHN1Yk1pbGxpc2Vjb25kcyhuZXcgRGF0ZSgyMDE0LCA2LCAxMCwgMTIsIDQ1LCAzMCwgMCksIDc1MClcbiAqIC8vPT4gVGh1IEp1bCAxMCAyMDE0IDEyOjQ1OjI5LjI1MFxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN1Yk1pbGxpc2Vjb25kcyhkaXJ0eURhdGUsIGRpcnR5QW1vdW50KSB7XG4gIHJlcXVpcmVkQXJncygyLCBhcmd1bWVudHMpO1xuICB2YXIgYW1vdW50ID0gdG9JbnRlZ2VyKGRpcnR5QW1vdW50KTtcbiAgcmV0dXJuIGFkZE1pbGxpc2Vjb25kcyhkaXJ0eURhdGUsIC1hbW91bnQpO1xufSIsICJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xudmFyIE1JTExJU0VDT05EU19JTl9EQVkgPSA4NjQwMDAwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ0RheU9mWWVhcihkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciB0aW1lc3RhbXAgPSBkYXRlLmdldFRpbWUoKTtcbiAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZZZWFyVGltZXN0YW1wID0gZGF0ZS5nZXRUaW1lKCk7XG4gIHZhciBkaWZmZXJlbmNlID0gdGltZXN0YW1wIC0gc3RhcnRPZlllYXJUaW1lc3RhbXA7XG4gIHJldHVybiBNYXRoLmZsb29yKGRpZmZlcmVuY2UgLyBNSUxMSVNFQ09ORFNfSU5fREFZKSArIDE7XG59IiwgImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGFydE9mVVRDSVNPV2VlayhkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciB3ZWVrU3RhcnRzT24gPSAxO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgZGF5ID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgdmFyIGRpZmYgPSAoZGF5IDwgd2Vla1N0YXJ0c09uID8gNyA6IDApICsgZGF5IC0gd2Vla1N0YXJ0c09uO1xuICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgLSBkaWZmKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgcmV0dXJuIGRhdGU7XG59IiwgImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENJU09XZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVVENJU09XZWVrWWVhcihkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuICB2YXIgZm91cnRoT2ZKYW51YXJ5T2ZOZXh0WWVhciA9IG5ldyBEYXRlKDApO1xuICBmb3VydGhPZkphbnVhcnlPZk5leHRZZWFyLnNldFVUQ0Z1bGxZZWFyKHllYXIgKyAxLCAwLCA0KTtcbiAgZm91cnRoT2ZKYW51YXJ5T2ZOZXh0WWVhci5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZOZXh0WWVhciA9IHN0YXJ0T2ZVVENJU09XZWVrKGZvdXJ0aE9mSmFudWFyeU9mTmV4dFllYXIpO1xuICB2YXIgZm91cnRoT2ZKYW51YXJ5T2ZUaGlzWWVhciA9IG5ldyBEYXRlKDApO1xuICBmb3VydGhPZkphbnVhcnlPZlRoaXNZZWFyLnNldFVUQ0Z1bGxZZWFyKHllYXIsIDAsIDQpO1xuICBmb3VydGhPZkphbnVhcnlPZlRoaXNZZWFyLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB2YXIgc3RhcnRPZlRoaXNZZWFyID0gc3RhcnRPZlVUQ0lTT1dlZWsoZm91cnRoT2ZKYW51YXJ5T2ZUaGlzWWVhcik7XG5cbiAgaWYgKGRhdGUuZ2V0VGltZSgpID49IHN0YXJ0T2ZOZXh0WWVhci5nZXRUaW1lKCkpIHtcbiAgICByZXR1cm4geWVhciArIDE7XG4gIH0gZWxzZSBpZiAoZGF0ZS5nZXRUaW1lKCkgPj0gc3RhcnRPZlRoaXNZZWFyLmdldFRpbWUoKSkge1xuICAgIHJldHVybiB5ZWFyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB5ZWFyIC0gMTtcbiAgfVxufSIsICJpbXBvcnQgZ2V0VVRDSVNPV2Vla1llYXIgZnJvbSBcIi4uL2dldFVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENJU09XZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0T2ZVVENJU09XZWVrWWVhcihkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciB5ZWFyID0gZ2V0VVRDSVNPV2Vla1llYXIoZGlydHlEYXRlKTtcbiAgdmFyIGZvdXJ0aE9mSmFudWFyeSA9IG5ldyBEYXRlKDApO1xuICBmb3VydGhPZkphbnVhcnkuc2V0VVRDRnVsbFllYXIoeWVhciwgMCwgNCk7XG4gIGZvdXJ0aE9mSmFudWFyeS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIGRhdGUgPSBzdGFydE9mVVRDSVNPV2Vlayhmb3VydGhPZkphbnVhcnkpO1xuICByZXR1cm4gZGF0ZTtcbn0iLCAiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWsgZnJvbSBcIi4uL3N0YXJ0T2ZVVENJU09XZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgc3RhcnRPZlVUQ0lTT1dlZWtZZWFyIGZyb20gXCIuLi9zdGFydE9mVVRDSVNPV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xudmFyIE1JTExJU0VDT05EU19JTl9XRUVLID0gNjA0ODAwMDAwO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VVRDSVNPV2VlayhkaXJ0eURhdGUpIHtcbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHZhciBkaWZmID0gc3RhcnRPZlVUQ0lTT1dlZWsoZGF0ZSkuZ2V0VGltZSgpIC0gc3RhcnRPZlVUQ0lTT1dlZWtZZWFyKGRhdGUpLmdldFRpbWUoKTsgLy8gUm91bmQgdGhlIG51bWJlciBvZiBkYXlzIHRvIHRoZSBuZWFyZXN0IGludGVnZXJcbiAgLy8gYmVjYXVzZSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiBhIHdlZWsgaXMgbm90IGNvbnN0YW50XG4gIC8vIChlLmcuIGl0J3MgZGlmZmVyZW50IGluIHRoZSB3ZWVrIG9mIHRoZSBkYXlsaWdodCBzYXZpbmcgdGltZSBjbG9jayBzaGlmdClcblxuICByZXR1cm4gTWF0aC5yb3VuZChkaWZmIC8gTUlMTElTRUNPTkRTX0lOX1dFRUspICsgMTtcbn0iLCAiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiLi4vZGVmYXVsdE9wdGlvbnMvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0T2ZVVENXZWVrKGRpcnR5RGF0ZSwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX3JlZjIsIF9yZWYzLCBfb3B0aW9ucyR3ZWVrU3RhcnRzT24sIF9vcHRpb25zJGxvY2FsZSwgX29wdGlvbnMkbG9jYWxlJG9wdGlvLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwsIF9kZWZhdWx0T3B0aW9ucyRsb2NhbDI7XG5cbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciB3ZWVrU3RhcnRzT24gPSB0b0ludGVnZXIoKF9yZWYgPSAoX3JlZjIgPSAoX3JlZjMgPSAoX29wdGlvbnMkd2Vla1N0YXJ0c09uID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX29wdGlvbnMkd2Vla1N0YXJ0c09uICE9PSB2b2lkIDAgPyBfb3B0aW9ucyR3ZWVrU3RhcnRzT24gOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlJG9wdGlvID0gX29wdGlvbnMkbG9jYWxlLm9wdGlvbnMpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZSRvcHRpbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX29wdGlvbnMkbG9jYWxlJG9wdGlvLndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogZGVmYXVsdE9wdGlvbnMud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmMiAhPT0gdm9pZCAwID8gX3JlZjIgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsID0gZGVmYXVsdE9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID0gX2RlZmF1bHRPcHRpb25zJGxvY2FsLm9wdGlvbnMpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmICE9PSB2b2lkIDAgPyBfcmVmIDogMCk7IC8vIFRlc3QgaWYgd2Vla1N0YXJ0c09uIGlzIGJldHdlZW4gMCBhbmQgNiBfYW5kXyBpcyBub3QgTmFOXG5cbiAgaWYgKCEod2Vla1N0YXJ0c09uID49IDAgJiYgd2Vla1N0YXJ0c09uIDw9IDYpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3dlZWtTdGFydHNPbiBtdXN0IGJlIGJldHdlZW4gMCBhbmQgNiBpbmNsdXNpdmVseScpO1xuICB9XG5cbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIGRheSA9IGRhdGUuZ2V0VVRDRGF5KCk7XG4gIHZhciBkaWZmID0gKGRheSA8IHdlZWtTdGFydHNPbiA/IDcgOiAwKSArIGRheSAtIHdlZWtTdGFydHNPbjtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gZGlmZik7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkYXRlO1xufSIsICJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENXZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHRvSW50ZWdlciBmcm9tIFwiLi4vdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gXCIuLi9kZWZhdWx0T3B0aW9ucy9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VVRDV2Vla1llYXIoZGlydHlEYXRlLCBvcHRpb25zKSB7XG4gIHZhciBfcmVmLCBfcmVmMiwgX3JlZjMsIF9vcHRpb25zJGZpcnN0V2Vla0NvbiwgX29wdGlvbnMkbG9jYWxlLCBfb3B0aW9ucyRsb2NhbGUkb3B0aW8sIF9kZWZhdWx0T3B0aW9ucyRsb2NhbCwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMjtcblxuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciBmaXJzdFdlZWtDb250YWluc0RhdGUgPSB0b0ludGVnZXIoKF9yZWYgPSAoX3JlZjIgPSAoX3JlZjMgPSAoX29wdGlvbnMkZmlyc3RXZWVrQ29uID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX29wdGlvbnMkZmlyc3RXZWVrQ29uICE9PSB2b2lkIDAgPyBfb3B0aW9ucyRmaXJzdFdlZWtDb24gOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlJG9wdGlvID0gX29wdGlvbnMkbG9jYWxlLm9wdGlvbnMpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZSRvcHRpbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX29wdGlvbnMkbG9jYWxlJG9wdGlvLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogZGVmYXVsdE9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmMiAhPT0gdm9pZCAwID8gX3JlZjIgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsID0gZGVmYXVsdE9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID0gX2RlZmF1bHRPcHRpb25zJGxvY2FsLm9wdGlvbnMpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmICE9PSB2b2lkIDAgPyBfcmVmIDogMSk7IC8vIFRlc3QgaWYgd2Vla1N0YXJ0c09uIGlzIGJldHdlZW4gMSBhbmQgNyBfYW5kXyBpcyBub3QgTmFOXG5cbiAgaWYgKCEoZmlyc3RXZWVrQ29udGFpbnNEYXRlID49IDEgJiYgZmlyc3RXZWVrQ29udGFpbnNEYXRlIDw9IDcpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2ZpcnN0V2Vla0NvbnRhaW5zRGF0ZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNyBpbmNsdXNpdmVseScpO1xuICB9XG5cbiAgdmFyIGZpcnN0V2Vla09mTmV4dFllYXIgPSBuZXcgRGF0ZSgwKTtcbiAgZmlyc3RXZWVrT2ZOZXh0WWVhci5zZXRVVENGdWxsWWVhcih5ZWFyICsgMSwgMCwgZmlyc3RXZWVrQ29udGFpbnNEYXRlKTtcbiAgZmlyc3RXZWVrT2ZOZXh0WWVhci5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZOZXh0WWVhciA9IHN0YXJ0T2ZVVENXZWVrKGZpcnN0V2Vla09mTmV4dFllYXIsIG9wdGlvbnMpO1xuICB2YXIgZmlyc3RXZWVrT2ZUaGlzWWVhciA9IG5ldyBEYXRlKDApO1xuICBmaXJzdFdlZWtPZlRoaXNZZWFyLnNldFVUQ0Z1bGxZZWFyKHllYXIsIDAsIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSk7XG4gIGZpcnN0V2Vla09mVGhpc1llYXIuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mVGhpc1llYXIgPSBzdGFydE9mVVRDV2VlayhmaXJzdFdlZWtPZlRoaXNZZWFyLCBvcHRpb25zKTtcblxuICBpZiAoZGF0ZS5nZXRUaW1lKCkgPj0gc3RhcnRPZk5leHRZZWFyLmdldFRpbWUoKSkge1xuICAgIHJldHVybiB5ZWFyICsgMTtcbiAgfSBlbHNlIGlmIChkYXRlLmdldFRpbWUoKSA+PSBzdGFydE9mVGhpc1llYXIuZ2V0VGltZSgpKSB7XG4gICAgcmV0dXJuIHllYXI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHllYXIgLSAxO1xuICB9XG59IiwgImltcG9ydCBnZXRVVENXZWVrWWVhciBmcm9tIFwiLi4vZ2V0VVRDV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENXZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHRvSW50ZWdlciBmcm9tIFwiLi4vdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gXCIuLi9kZWZhdWx0T3B0aW9ucy9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRPZlVUQ1dlZWtZZWFyKGRpcnR5RGF0ZSwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX3JlZjIsIF9yZWYzLCBfb3B0aW9ucyRmaXJzdFdlZWtDb24sIF9vcHRpb25zJGxvY2FsZSwgX29wdGlvbnMkbG9jYWxlJG9wdGlvLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwsIF9kZWZhdWx0T3B0aW9ucyRsb2NhbDI7XG5cbiAgcmVxdWlyZWRBcmdzKDEsIGFyZ3VtZW50cyk7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciBmaXJzdFdlZWtDb250YWluc0RhdGUgPSB0b0ludGVnZXIoKF9yZWYgPSAoX3JlZjIgPSAoX3JlZjMgPSAoX29wdGlvbnMkZmlyc3RXZWVrQ29uID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX29wdGlvbnMkZmlyc3RXZWVrQ29uICE9PSB2b2lkIDAgPyBfb3B0aW9ucyRmaXJzdFdlZWtDb24gOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlJG9wdGlvID0gX29wdGlvbnMkbG9jYWxlLm9wdGlvbnMpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZSRvcHRpbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX29wdGlvbnMkbG9jYWxlJG9wdGlvLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogZGVmYXVsdE9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmMiAhPT0gdm9pZCAwID8gX3JlZjIgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsID0gZGVmYXVsdE9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID0gX2RlZmF1bHRPcHRpb25zJGxvY2FsLm9wdGlvbnMpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmICE9PSB2b2lkIDAgPyBfcmVmIDogMSk7XG4gIHZhciB5ZWFyID0gZ2V0VVRDV2Vla1llYXIoZGlydHlEYXRlLCBvcHRpb25zKTtcbiAgdmFyIGZpcnN0V2VlayA9IG5ldyBEYXRlKDApO1xuICBmaXJzdFdlZWsuc2V0VVRDRnVsbFllYXIoeWVhciwgMCwgZmlyc3RXZWVrQ29udGFpbnNEYXRlKTtcbiAgZmlyc3RXZWVrLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB2YXIgZGF0ZSA9IHN0YXJ0T2ZVVENXZWVrKGZpcnN0V2Vlaywgb3B0aW9ucyk7XG4gIHJldHVybiBkYXRlO1xufSIsICJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDV2VlayBmcm9tIFwiLi4vc3RhcnRPZlVUQ1dlZWsvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDV2Vla1llYXIgZnJvbSBcIi4uL3N0YXJ0T2ZVVENXZWVrWWVhci9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG52YXIgTUlMTElTRUNPTkRTX0lOX1dFRUsgPSA2MDQ4MDAwMDA7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVVENXZWVrKGRpcnR5RGF0ZSwgb3B0aW9ucykge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIGRpZmYgPSBzdGFydE9mVVRDV2VlayhkYXRlLCBvcHRpb25zKS5nZXRUaW1lKCkgLSBzdGFydE9mVVRDV2Vla1llYXIoZGF0ZSwgb3B0aW9ucykuZ2V0VGltZSgpOyAvLyBSb3VuZCB0aGUgbnVtYmVyIG9mIGRheXMgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuICAvLyBiZWNhdXNlIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGluIGEgd2VlayBpcyBub3QgY29uc3RhbnRcbiAgLy8gKGUuZy4gaXQncyBkaWZmZXJlbnQgaW4gdGhlIHdlZWsgb2YgdGhlIGRheWxpZ2h0IHNhdmluZyB0aW1lIGNsb2NrIHNoaWZ0KVxuXG4gIHJldHVybiBNYXRoLnJvdW5kKGRpZmYgLyBNSUxMSVNFQ09ORFNfSU5fV0VFSykgKyAxO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRMZWFkaW5nWmVyb3MobnVtYmVyLCB0YXJnZXRMZW5ndGgpIHtcbiAgdmFyIHNpZ24gPSBudW1iZXIgPCAwID8gJy0nIDogJyc7XG4gIHZhciBvdXRwdXQgPSBNYXRoLmFicyhudW1iZXIpLnRvU3RyaW5nKCk7XG5cbiAgd2hpbGUgKG91dHB1dC5sZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcbiAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gIH1cblxuICByZXR1cm4gc2lnbiArIG91dHB1dDtcbn0iLCAiaW1wb3J0IGFkZExlYWRpbmdaZXJvcyBmcm9tIFwiLi4vLi4vYWRkTGVhZGluZ1plcm9zL2luZGV4LmpzXCI7XG4vKlxuICogfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCAgYSAgfCBBTSwgUE0gICAgICAgICAgICAgICAgICAgICAgICAgfCAgQSogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgZCAgfCBEYXkgb2YgbW9udGggICAgICAgICAgICAgICAgICAgfCAgRCAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgaCAgfCBIb3VyIFsxLTEyXSAgICAgICAgICAgICAgICAgICAgfCAgSCAgfCBIb3VyIFswLTIzXSAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbSAgfCBNaW51dGUgICAgICAgICAgICAgICAgICAgICAgICAgfCAgTSAgfCBNb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgcyAgfCBTZWNvbmQgICAgICAgICAgICAgICAgICAgICAgICAgfCAgUyAgfCBGcmFjdGlvbiBvZiBzZWNvbmQgICAgICAgICAgICAgfFxuICogfCAgeSAgfCBZZWFyIChhYnMpICAgICAgICAgICAgICAgICAgICAgfCAgWSAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICpcbiAqIExldHRlcnMgbWFya2VkIGJ5ICogYXJlIG5vdCBpbXBsZW1lbnRlZCBidXQgcmVzZXJ2ZWQgYnkgVW5pY29kZSBzdGFuZGFyZC5cbiAqL1xuXG52YXIgZm9ybWF0dGVycyA9IHtcbiAgLy8gWWVhclxuICB5OiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4pIHtcbiAgICAvLyBGcm9tIGh0dHA6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtMzEvdHIzNS1kYXRlcy5odG1sI0RhdGVfRm9ybWF0X3Rva2Vuc1xuICAgIC8vIHwgWWVhciAgICAgfCAgICAgeSB8IHl5IHwgICB5eXkgfCAgeXl5eSB8IHl5eXl5IHxcbiAgICAvLyB8LS0tLS0tLS0tLXwtLS0tLS0tfC0tLS18LS0tLS0tLXwtLS0tLS0tfC0tLS0tLS18XG4gICAgLy8gfCBBRCAxICAgICB8ICAgICAxIHwgMDEgfCAgIDAwMSB8ICAwMDAxIHwgMDAwMDEgfFxuICAgIC8vIHwgQUQgMTIgICAgfCAgICAxMiB8IDEyIHwgICAwMTIgfCAgMDAxMiB8IDAwMDEyIHxcbiAgICAvLyB8IEFEIDEyMyAgIHwgICAxMjMgfCAyMyB8ICAgMTIzIHwgIDAxMjMgfCAwMDEyMyB8XG4gICAgLy8gfCBBRCAxMjM0ICB8ICAxMjM0IHwgMzQgfCAgMTIzNCB8ICAxMjM0IHwgMDEyMzQgfFxuICAgIC8vIHwgQUQgMTIzNDUgfCAxMjM0NSB8IDQ1IHwgMTIzNDUgfCAxMjM0NSB8IDEyMzQ1IHxcbiAgICB2YXIgc2lnbmVkWWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTsgLy8gUmV0dXJucyAxIGZvciAxIEJDICh3aGljaCBpcyB5ZWFyIDAgaW4gSmF2YVNjcmlwdClcblxuICAgIHZhciB5ZWFyID0gc2lnbmVkWWVhciA+IDAgPyBzaWduZWRZZWFyIDogMSAtIHNpZ25lZFllYXI7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh0b2tlbiA9PT0gJ3l5JyA/IHllYXIgJSAxMDAgOiB5ZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNb250aFxuICBNOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgbW9udGggPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgcmV0dXJuIHRva2VuID09PSAnTScgPyBTdHJpbmcobW9udGggKyAxKSA6IGFkZExlYWRpbmdaZXJvcyhtb250aCArIDEsIDIpO1xuICB9LFxuICAvLyBEYXkgb2YgdGhlIG1vbnRoXG4gIGQ6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENEYXRlKCksIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIEFNIG9yIFBNXG4gIGE6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHZhciBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXRlLmdldFVUQ0hvdXJzKCkgLyAxMiA+PSAxID8gJ3BtJyA6ICdhbSc7XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdhJzpcbiAgICAgIGNhc2UgJ2FhJzpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICBjYXNlICdhYWEnOlxuICAgICAgICByZXR1cm4gZGF5UGVyaW9kRW51bVZhbHVlO1xuXG4gICAgICBjYXNlICdhYWFhYSc6XG4gICAgICAgIHJldHVybiBkYXlQZXJpb2RFbnVtVmFsdWVbMF07XG5cbiAgICAgIGNhc2UgJ2FhYWEnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRheVBlcmlvZEVudW1WYWx1ZSA9PT0gJ2FtJyA/ICdhLm0uJyA6ICdwLm0uJztcbiAgICB9XG4gIH0sXG4gIC8vIEhvdXIgWzEtMTJdXG4gIGg6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENIb3VycygpICUgMTIgfHwgMTIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIEhvdXIgWzAtMjNdXG4gIEg6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENIb3VycygpLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNaW51dGVcbiAgbTogZnVuY3Rpb24gKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ01pbnV0ZXMoKSwgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gU2Vjb25kXG4gIHM6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENTZWNvbmRzKCksIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIEZyYWN0aW9uIG9mIHNlY29uZFxuICBTOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgbnVtYmVyT2ZEaWdpdHMgPSB0b2tlbi5sZW5ndGg7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gICAgdmFyIGZyYWN0aW9uYWxTZWNvbmRzID0gTWF0aC5mbG9vcihtaWxsaXNlY29uZHMgKiBNYXRoLnBvdygxMCwgbnVtYmVyT2ZEaWdpdHMgLSAzKSk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhmcmFjdGlvbmFsU2Vjb25kcywgdG9rZW4ubGVuZ3RoKTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGZvcm1hdHRlcnM7IiwgImltcG9ydCBnZXRVVENEYXlPZlllYXIgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDRGF5T2ZZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDSVNPV2VlayBmcm9tIFwiLi4vLi4vLi4vX2xpYi9nZXRVVENJU09XZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDSVNPV2Vla1llYXIgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDSVNPV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCBnZXRVVENXZWVrIGZyb20gXCIuLi8uLi8uLi9fbGliL2dldFVUQ1dlZWsvaW5kZXguanNcIjtcbmltcG9ydCBnZXRVVENXZWVrWWVhciBmcm9tIFwiLi4vLi4vLi4vX2xpYi9nZXRVVENXZWVrWWVhci9pbmRleC5qc1wiO1xuaW1wb3J0IGFkZExlYWRpbmdaZXJvcyBmcm9tIFwiLi4vLi4vYWRkTGVhZGluZ1plcm9zL2luZGV4LmpzXCI7XG5pbXBvcnQgbGlnaHRGb3JtYXR0ZXJzIGZyb20gXCIuLi9saWdodEZvcm1hdHRlcnMvaW5kZXguanNcIjtcbnZhciBkYXlQZXJpb2RFbnVtID0ge1xuICBhbTogJ2FtJyxcbiAgcG06ICdwbScsXG4gIG1pZG5pZ2h0OiAnbWlkbmlnaHQnLFxuICBub29uOiAnbm9vbicsXG4gIG1vcm5pbmc6ICdtb3JuaW5nJyxcbiAgYWZ0ZXJub29uOiAnYWZ0ZXJub29uJyxcbiAgZXZlbmluZzogJ2V2ZW5pbmcnLFxuICBuaWdodDogJ25pZ2h0J1xufTtcblxuLypcbiAqIHwgICAgIHwgVW5pdCAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgIHwgVW5pdCAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwtLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAqIHwgIGEgIHwgQU0sIFBNICAgICAgICAgICAgICAgICAgICAgICAgIHwgIEEqIHwgTWlsbGlzZWNvbmRzIGluIGRheSAgICAgICAgICAgIHxcbiAqIHwgIGIgIHwgQU0sIFBNLCBub29uLCBtaWRuaWdodCAgICAgICAgIHwgIEIgIHwgRmxleGlibGUgZGF5IHBlcmlvZCAgICAgICAgICAgIHxcbiAqIHwgIGMgIHwgU3RhbmQtYWxvbmUgbG9jYWwgZGF5IG9mIHdlZWsgIHwgIEMqIHwgTG9jYWxpemVkIGhvdXIgdy8gZGF5IHBlcmlvZCAgIHxcbiAqIHwgIGQgIHwgRGF5IG9mIG1vbnRoICAgICAgICAgICAgICAgICAgIHwgIEQgIHwgRGF5IG9mIHllYXIgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGUgIHwgTG9jYWwgZGF5IG9mIHdlZWsgICAgICAgICAgICAgIHwgIEUgIHwgRGF5IG9mIHdlZWsgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGYgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgIEYqIHwgRGF5IG9mIHdlZWsgaW4gbW9udGggICAgICAgICAgIHxcbiAqIHwgIGcqIHwgTW9kaWZpZWQgSnVsaWFuIGRheSAgICAgICAgICAgIHwgIEcgIHwgRXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGggIHwgSG91ciBbMS0xMl0gICAgICAgICAgICAgICAgICAgIHwgIEggIHwgSG91ciBbMC0yM10gICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGkhIHwgSVNPIGRheSBvZiB3ZWVrICAgICAgICAgICAgICAgIHwgIEkhIHwgSVNPIHdlZWsgb2YgeWVhciAgICAgICAgICAgICAgIHxcbiAqIHwgIGoqIHwgTG9jYWxpemVkIGhvdXIgdy8gZGF5IHBlcmlvZCAgIHwgIEoqIHwgTG9jYWxpemVkIGhvdXIgdy9vIGRheSBwZXJpb2QgIHxcbiAqIHwgIGsgIHwgSG91ciBbMS0yNF0gICAgICAgICAgICAgICAgICAgIHwgIEsgIHwgSG91ciBbMC0xMV0gICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIGwqIHwgKGRlcHJlY2F0ZWQpICAgICAgICAgICAgICAgICAgIHwgIEwgIHwgU3RhbmQtYWxvbmUgbW9udGggICAgICAgICAgICAgIHxcbiAqIHwgIG0gIHwgTWludXRlICAgICAgICAgICAgICAgICAgICAgICAgIHwgIE0gIHwgTW9udGggICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgIE4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIG8hIHwgT3JkaW5hbCBudW1iZXIgbW9kaWZpZXIgICAgICAgIHwgIE8gIHwgVGltZXpvbmUgKEdNVCkgICAgICAgICAgICAgICAgIHxcbiAqIHwgIHAhIHwgTG9uZyBsb2NhbGl6ZWQgdGltZSAgICAgICAgICAgIHwgIFAhIHwgTG9uZyBsb2NhbGl6ZWQgZGF0ZSAgICAgICAgICAgIHxcbiAqIHwgIHEgIHwgU3RhbmQtYWxvbmUgcXVhcnRlciAgICAgICAgICAgIHwgIFEgIHwgUXVhcnRlciAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIHIqIHwgUmVsYXRlZCBHcmVnb3JpYW4geWVhciAgICAgICAgIHwgIFIhIHwgSVNPIHdlZWstbnVtYmVyaW5nIHllYXIgICAgICAgIHxcbiAqIHwgIHMgIHwgU2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgIHwgIFMgIHwgRnJhY3Rpb24gb2Ygc2Vjb25kICAgICAgICAgICAgIHxcbiAqIHwgIHQhIHwgU2Vjb25kcyB0aW1lc3RhbXAgICAgICAgICAgICAgIHwgIFQhIHwgTWlsbGlzZWNvbmRzIHRpbWVzdGFtcCAgICAgICAgIHxcbiAqIHwgIHUgIHwgRXh0ZW5kZWQgeWVhciAgICAgICAgICAgICAgICAgIHwgIFUqIHwgQ3ljbGljIHllYXIgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIHYqIHwgVGltZXpvbmUgKGdlbmVyaWMgbm9uLWxvY2F0LikgIHwgIFYqIHwgVGltZXpvbmUgKGxvY2F0aW9uKSAgICAgICAgICAgIHxcbiAqIHwgIHcgIHwgTG9jYWwgd2VlayBvZiB5ZWFyICAgICAgICAgICAgIHwgIFcqIHwgV2VlayBvZiBtb250aCAgICAgICAgICAgICAgICAgIHxcbiAqIHwgIHggIHwgVGltZXpvbmUgKElTTy04NjAxIHcvbyBaKSAgICAgIHwgIFggIHwgVGltZXpvbmUgKElTTy04NjAxKSAgICAgICAgICAgIHxcbiAqIHwgIHkgIHwgWWVhciAoYWJzKSAgICAgICAgICAgICAgICAgICAgIHwgIFkgIHwgTG9jYWwgd2Vlay1udW1iZXJpbmcgeWVhciAgICAgIHxcbiAqIHwgIHogIHwgVGltZXpvbmUgKHNwZWNpZmljIG5vbi1sb2NhdC4pIHwgIFoqIHwgVGltZXpvbmUgKGFsaWFzZXMpICAgICAgICAgICAgIHxcbiAqXG4gKiBMZXR0ZXJzIG1hcmtlZCBieSAqIGFyZSBub3QgaW1wbGVtZW50ZWQgYnV0IHJlc2VydmVkIGJ5IFVuaWNvZGUgc3RhbmRhcmQuXG4gKlxuICogTGV0dGVycyBtYXJrZWQgYnkgISBhcmUgbm9uLXN0YW5kYXJkLCBidXQgaW1wbGVtZW50ZWQgYnkgZGF0ZS1mbnM6XG4gKiAtIGBvYCBtb2RpZmllcyB0aGUgcHJldmlvdXMgdG9rZW4gdG8gdHVybiBpdCBpbnRvIGFuIG9yZGluYWwgKHNlZSBgZm9ybWF0YCBkb2NzKVxuICogLSBgaWAgaXMgSVNPIGRheSBvZiB3ZWVrLiBGb3IgYGlgIGFuZCBgaWlgIGlzIHJldHVybnMgbnVtZXJpYyBJU08gd2VlayBkYXlzLFxuICogICBpLmUuIDcgZm9yIFN1bmRheSwgMSBmb3IgTW9uZGF5LCBldGMuXG4gKiAtIGBJYCBpcyBJU08gd2VlayBvZiB5ZWFyLCBhcyBvcHBvc2VkIHRvIGB3YCB3aGljaCBpcyBsb2NhbCB3ZWVrIG9mIHllYXIuXG4gKiAtIGBSYCBpcyBJU08gd2Vlay1udW1iZXJpbmcgeWVhciwgYXMgb3Bwb3NlZCB0byBgWWAgd2hpY2ggaXMgbG9jYWwgd2Vlay1udW1iZXJpbmcgeWVhci5cbiAqICAgYFJgIGlzIHN1cHBvc2VkIHRvIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBgSWAgYW5kIGBpYFxuICogICBmb3IgdW5pdmVyc2FsIElTTyB3ZWVrLW51bWJlcmluZyBkYXRlLCB3aGVyZWFzXG4gKiAgIGBZYCBpcyBzdXBwb3NlZCB0byBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYHdgIGFuZCBgZWBcbiAqICAgZm9yIHdlZWstbnVtYmVyaW5nIGRhdGUgc3BlY2lmaWMgdG8gdGhlIGxvY2FsZS5cbiAqIC0gYFBgIGlzIGxvbmcgbG9jYWxpemVkIGRhdGUgZm9ybWF0XG4gKiAtIGBwYCBpcyBsb25nIGxvY2FsaXplZCB0aW1lIGZvcm1hdFxuICovXG52YXIgZm9ybWF0dGVycyA9IHtcbiAgLy8gRXJhXG4gIEc6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgZXJhID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpID4gMCA/IDEgOiAwO1xuXG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gQUQsIEJDXG4gICAgICBjYXNlICdHJzpcbiAgICAgIGNhc2UgJ0dHJzpcbiAgICAgIGNhc2UgJ0dHRyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBBLCBCXG5cbiAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmVyYShlcmEsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdydcbiAgICAgICAgfSk7XG4gICAgICAvLyBBbm5vIERvbWluaSwgQmVmb3JlIENocmlzdFxuXG4gICAgICBjYXNlICdHR0dHJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIFllYXJcbiAgeTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIC8vIE9yZGluYWwgbnVtYmVyXG4gICAgaWYgKHRva2VuID09PSAneW8nKSB7XG4gICAgICB2YXIgc2lnbmVkWWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTsgLy8gUmV0dXJucyAxIGZvciAxIEJDICh3aGljaCBpcyB5ZWFyIDAgaW4gSmF2YVNjcmlwdClcblxuICAgICAgdmFyIHllYXIgPSBzaWduZWRZZWFyID4gMCA/IHNpZ25lZFllYXIgOiAxIC0gc2lnbmVkWWVhcjtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHllYXIsIHtcbiAgICAgICAgdW5pdDogJ3llYXInXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLnkoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFk6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2lnbmVkV2Vla1llYXIgPSBnZXRVVENXZWVrWWVhcihkYXRlLCBvcHRpb25zKTsgLy8gUmV0dXJucyAxIGZvciAxIEJDICh3aGljaCBpcyB5ZWFyIDAgaW4gSmF2YVNjcmlwdClcblxuICAgIHZhciB3ZWVrWWVhciA9IHNpZ25lZFdlZWtZZWFyID4gMCA/IHNpZ25lZFdlZWtZZWFyIDogMSAtIHNpZ25lZFdlZWtZZWFyOyAvLyBUd28gZGlnaXQgeWVhclxuXG4gICAgaWYgKHRva2VuID09PSAnWVknKSB7XG4gICAgICB2YXIgdHdvRGlnaXRZZWFyID0gd2Vla1llYXIgJSAxMDA7XG4gICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHR3b0RpZ2l0WWVhciwgMik7XG4gICAgfSAvLyBPcmRpbmFsIG51bWJlclxuXG5cbiAgICBpZiAodG9rZW4gPT09ICdZbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWtZZWFyLCB7XG4gICAgICAgIHVuaXQ6ICd5ZWFyJ1xuICAgICAgfSk7XG4gICAgfSAvLyBQYWRkaW5nXG5cblxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3Mod2Vla1llYXIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFI6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbikge1xuICAgIHZhciBpc29XZWVrWWVhciA9IGdldFVUQ0lTT1dlZWtZZWFyKGRhdGUpOyAvLyBQYWRkaW5nXG5cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGlzb1dlZWtZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBFeHRlbmRlZCB5ZWFyLiBUaGlzIGlzIGEgc2luZ2xlIG51bWJlciBkZXNpZ25hdGluZyB0aGUgeWVhciBvZiB0aGlzIGNhbGVuZGFyIHN5c3RlbS5cbiAgLy8gVGhlIG1haW4gZGlmZmVyZW5jZSBiZXR3ZWVuIGB5YCBhbmQgYHVgIGxvY2FsaXplcnMgYXJlIEIuQy4geWVhcnM6XG4gIC8vIHwgWWVhciB8IGB5YCB8IGB1YCB8XG4gIC8vIHwtLS0tLS18LS0tLS18LS0tLS18XG4gIC8vIHwgQUMgMSB8ICAgMSB8ICAgMSB8XG4gIC8vIHwgQkMgMSB8ICAgMSB8ICAgMCB8XG4gIC8vIHwgQkMgMiB8ICAgMiB8ICAtMSB8XG4gIC8vIEFsc28gYHl5YCBhbHdheXMgcmV0dXJucyB0aGUgbGFzdCB0d28gZGlnaXRzIG9mIGEgeWVhcixcbiAgLy8gd2hpbGUgYHV1YCBwYWRzIHNpbmdsZSBkaWdpdCB5ZWFycyB0byAyIGNoYXJhY3RlcnMgYW5kIHJldHVybnMgb3RoZXIgeWVhcnMgdW5jaGFuZ2VkLlxuICB1OiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHllYXIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIFF1YXJ0ZXJcbiAgUTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBxdWFydGVyID0gTWF0aC5jZWlsKChkYXRlLmdldFVUQ01vbnRoKCkgKyAxKSAvIDMpO1xuXG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gMSwgMiwgMywgNFxuICAgICAgY2FzZSAnUSc6XG4gICAgICAgIHJldHVybiBTdHJpbmcocXVhcnRlcik7XG4gICAgICAvLyAwMSwgMDIsIDAzLCAwNFxuXG4gICAgICBjYXNlICdRUSc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MocXVhcnRlciwgMik7XG4gICAgICAvLyAxc3QsIDJuZCwgM3JkLCA0dGhcblxuICAgICAgY2FzZSAnUW8nOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihxdWFydGVyLCB7XG4gICAgICAgICAgdW5pdDogJ3F1YXJ0ZXInXG4gICAgICAgIH0pO1xuICAgICAgLy8gUTEsIFEyLCBRMywgUTRcblxuICAgICAgY2FzZSAnUVFRJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDEsIDIsIDMsIDQgKG5hcnJvdyBxdWFydGVyOyBjb3VsZCBiZSBub3QgbnVtZXJpY2FsKVxuXG4gICAgICBjYXNlICdRUVFRUSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gMXN0IHF1YXJ0ZXIsIDJuZCBxdWFydGVyLCAuLi5cblxuICAgICAgY2FzZSAnUVFRUSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBxdWFydGVyXG4gIHE6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgcXVhcnRlciA9IE1hdGguY2VpbCgoZGF0ZS5nZXRVVENNb250aCgpICsgMSkgLyAzKTtcblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIDEsIDIsIDMsIDRcbiAgICAgIGNhc2UgJ3EnOlxuICAgICAgICByZXR1cm4gU3RyaW5nKHF1YXJ0ZXIpO1xuICAgICAgLy8gMDEsIDAyLCAwMywgMDRcblxuICAgICAgY2FzZSAncXEnOlxuICAgICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHF1YXJ0ZXIsIDIpO1xuICAgICAgLy8gMXN0LCAybmQsIDNyZCwgNHRoXG5cbiAgICAgIGNhc2UgJ3FvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIocXVhcnRlciwge1xuICAgICAgICAgIHVuaXQ6ICdxdWFydGVyJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFExLCBRMiwgUTMsIFE0XG5cbiAgICAgIGNhc2UgJ3FxcSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyAxLCAyLCAzLCA0IChuYXJyb3cgcXVhcnRlcjsgY291bGQgYmUgbm90IG51bWVyaWNhbClcblxuICAgICAgY2FzZSAncXFxcXEnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnLFxuICAgICAgICAgIGNvbnRleHQ6ICdzdGFuZGFsb25lJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uXG5cbiAgICAgIGNhc2UgJ3FxcXEnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTW9udGhcbiAgTTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIGNhc2UgJ00nOlxuICAgICAgY2FzZSAnTU0nOlxuICAgICAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLk0oZGF0ZSwgdG9rZW4pO1xuICAgICAgLy8gMXN0LCAybmQsIC4uLiwgMTJ0aFxuXG4gICAgICBjYXNlICdNbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKG1vbnRoICsgMSwge1xuICAgICAgICAgIHVuaXQ6ICdtb250aCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW4sIEZlYiwgLi4uLCBEZWNcblxuICAgICAgY2FzZSAnTU1NJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSiwgRiwgLi4uLCBEXG5cbiAgICAgIGNhc2UgJ01NTU1NJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEphbnVhcnksIEZlYnJ1YXJ5LCAuLi4sIERlY2VtYmVyXG5cbiAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBtb250aFxuICBMOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRVVENNb250aCgpO1xuXG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gMSwgMiwgLi4uLCAxMlxuICAgICAgY2FzZSAnTCc6XG4gICAgICAgIHJldHVybiBTdHJpbmcobW9udGggKyAxKTtcbiAgICAgIC8vIDAxLCAwMiwgLi4uLCAxMlxuXG4gICAgICBjYXNlICdMTCc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobW9udGggKyAxLCAyKTtcbiAgICAgIC8vIDFzdCwgMm5kLCAuLi4sIDEydGhcblxuICAgICAgY2FzZSAnTG8nOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihtb250aCArIDEsIHtcbiAgICAgICAgICB1bml0OiAnbW9udGgnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSmFuLCBGZWIsIC4uLiwgRGVjXG5cbiAgICAgIGNhc2UgJ0xMTCc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdzdGFuZGFsb25lJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEosIEYsIC4uLiwgRFxuXG4gICAgICBjYXNlICdMTExMTCc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW51YXJ5LCBGZWJydWFyeSwgLi4uLCBEZWNlbWJlclxuXG4gICAgICBjYXNlICdMTExMJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTG9jYWwgd2VlayBvZiB5ZWFyXG4gIHc6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgd2VlayA9IGdldFVUQ1dlZWsoZGF0ZSwgb3B0aW9ucyk7XG5cbiAgICBpZiAodG9rZW4gPT09ICd3bycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWssIHtcbiAgICAgICAgdW5pdDogJ3dlZWsnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHdlZWssIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIElTTyB3ZWVrIG9mIHllYXJcbiAgSTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBpc29XZWVrID0gZ2V0VVRDSVNPV2VlayhkYXRlKTtcblxuICAgIGlmICh0b2tlbiA9PT0gJ0lvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoaXNvV2Vlaywge1xuICAgICAgICB1bml0OiAnd2VlaydcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoaXNvV2VlaywgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gRGF5IG9mIHRoZSBtb250aFxuICBkOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgaWYgKHRva2VuID09PSAnZG8nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihkYXRlLmdldFVUQ0RhdGUoKSwge1xuICAgICAgICB1bml0OiAnZGF0ZSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuZChkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIERheSBvZiB5ZWFyXG4gIEQ6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgZGF5T2ZZZWFyID0gZ2V0VVRDRGF5T2ZZZWFyKGRhdGUpO1xuXG4gICAgaWYgKHRva2VuID09PSAnRG8nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihkYXlPZlllYXIsIHtcbiAgICAgICAgdW5pdDogJ2RheU9mWWVhcidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF5T2ZZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBEYXkgb2Ygd2Vla1xuICBFOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGRheU9mV2VlayA9IGRhdGUuZ2V0VVRDRGF5KCk7XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBUdWVcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgY2FzZSAnRUUnOlxuICAgICAgY2FzZSAnRUVFJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUXG5cbiAgICAgIGNhc2UgJ0VFRUVFJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVcblxuICAgICAgY2FzZSAnRUVFRUVFJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG5cbiAgICAgIGNhc2UgJ0VFRUUnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIExvY2FsIGRheSBvZiB3ZWVrXG4gIGU6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgbG9jYWxEYXlPZldlZWsgPSAoZGF5T2ZXZWVrIC0gb3B0aW9ucy53ZWVrU3RhcnRzT24gKyA4KSAlIDcgfHwgNztcblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIE51bWVyaWNhbCB2YWx1ZSAoTnRoIGRheSBvZiB3ZWVrIHdpdGggY3VycmVudCBsb2NhbGUgb3Igd2Vla1N0YXJ0c09uKVxuICAgICAgY2FzZSAnZSc6XG4gICAgICAgIHJldHVybiBTdHJpbmcobG9jYWxEYXlPZldlZWspO1xuICAgICAgLy8gUGFkZGVkIG51bWVyaWNhbCB2YWx1ZVxuXG4gICAgICBjYXNlICdlZSc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobG9jYWxEYXlPZldlZWssIDIpO1xuICAgICAgLy8gMXN0LCAybmQsIC4uLiwgN3RoXG5cbiAgICAgIGNhc2UgJ2VvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobG9jYWxEYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcblxuICAgICAgY2FzZSAnZWVlJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUXG5cbiAgICAgIGNhc2UgJ2VlZWVlJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVcblxuICAgICAgY2FzZSAnZWVlZWVlJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG5cbiAgICAgIGNhc2UgJ2VlZWUnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIFN0YW5kLWFsb25lIGxvY2FsIGRheSBvZiB3ZWVrXG4gIGM6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgbG9jYWxEYXlPZldlZWsgPSAoZGF5T2ZXZWVrIC0gb3B0aW9ucy53ZWVrU3RhcnRzT24gKyA4KSAlIDcgfHwgNztcblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIE51bWVyaWNhbCB2YWx1ZSAoc2FtZSBhcyBpbiBgZWApXG4gICAgICBjYXNlICdjJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhsb2NhbERheU9mV2Vlayk7XG4gICAgICAvLyBQYWRkZWQgbnVtZXJpY2FsIHZhbHVlXG5cbiAgICAgIGNhc2UgJ2NjJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhsb2NhbERheU9mV2VlaywgdG9rZW4ubGVuZ3RoKTtcbiAgICAgIC8vIDFzdCwgMm5kLCAuLi4sIDd0aFxuXG4gICAgICBjYXNlICdjbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGxvY2FsRGF5T2ZXZWVrLCB7XG4gICAgICAgICAgdW5pdDogJ2RheSdcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ2NjYyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuXG4gICAgICBjYXNlICdjY2NjYyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnLFxuICAgICAgICAgIGNvbnRleHQ6ICdzdGFuZGFsb25lJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFR1XG5cbiAgICAgIGNhc2UgJ2NjY2NjYyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdzaG9ydCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVlc2RheVxuXG4gICAgICBjYXNlICdjY2NjJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBJU08gZGF5IG9mIHdlZWtcbiAgaTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBkYXlPZldlZWsgPSBkYXRlLmdldFVUQ0RheSgpO1xuICAgIHZhciBpc29EYXlPZldlZWsgPSBkYXlPZldlZWsgPT09IDAgPyA3IDogZGF5T2ZXZWVrO1xuXG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gMlxuICAgICAgY2FzZSAnaSc6XG4gICAgICAgIHJldHVybiBTdHJpbmcoaXNvRGF5T2ZXZWVrKTtcbiAgICAgIC8vIDAyXG5cbiAgICAgIGNhc2UgJ2lpJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhpc29EYXlPZldlZWssIHRva2VuLmxlbmd0aCk7XG4gICAgICAvLyAybmRcblxuICAgICAgY2FzZSAnaW8nOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihpc29EYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcbiAgICAgIC8vIFR1ZVxuXG4gICAgICBjYXNlICdpaWknOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFRcblxuICAgICAgY2FzZSAnaWlpaWknOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuXG4gICAgICBjYXNlICdpaWlpaWknOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnc2hvcnQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFR1ZXNkYXlcblxuICAgICAgY2FzZSAnaWlpaSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gQU0gb3IgUE1cbiAgYTogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlID0gaG91cnMgLyAxMiA+PSAxID8gJ3BtJyA6ICdhbSc7XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdhJzpcbiAgICAgIGNhc2UgJ2FhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ2FhYSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGNhc2UgJ2FhYWFhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdhYWFhJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBBTSwgUE0sIG1pZG5pZ2h0LCBub29uXG4gIGI6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIGRheVBlcmlvZEVudW1WYWx1ZTtcblxuICAgIGlmIChob3VycyA9PT0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0ubm9vbjtcbiAgICB9IGVsc2UgaWYgKGhvdXJzID09PSAwKSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm1pZG5pZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBob3VycyAvIDEyID49IDEgPyAncG0nIDogJ2FtJztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdiJzpcbiAgICAgIGNhc2UgJ2JiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ2JiYic6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGNhc2UgJ2JiYmJiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdiYmJiJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBpbiB0aGUgbW9ybmluZywgaW4gdGhlIGFmdGVybm9vbiwgaW4gdGhlIGV2ZW5pbmcsIGF0IG5pZ2h0XG4gIEI6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIGRheVBlcmlvZEVudW1WYWx1ZTtcblxuICAgIGlmIChob3VycyA+PSAxNykge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5ldmVuaW5nO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0uYWZ0ZXJub29uO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gNCkge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5tb3JuaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm5pZ2h0O1xuICAgIH1cblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIGNhc2UgJ0InOlxuICAgICAgY2FzZSAnQkInOlxuICAgICAgY2FzZSAnQkJCJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ0JCQkJCJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdCQkJCJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBIb3VyIFsxLTEyXVxuICBoOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgaWYgKHRva2VuID09PSAnaG8nKSB7XG4gICAgICB2YXIgaG91cnMgPSBkYXRlLmdldFVUQ0hvdXJzKCkgJSAxMjtcbiAgICAgIGlmIChob3VycyA9PT0gMCkgaG91cnMgPSAxMjtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGhvdXJzLCB7XG4gICAgICAgIHVuaXQ6ICdob3VyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5oKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gSG91ciBbMC0yM11cbiAgSDogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIGlmICh0b2tlbiA9PT0gJ0hvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoZGF0ZS5nZXRVVENIb3VycygpLCB7XG4gICAgICAgIHVuaXQ6ICdob3VyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5IKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gSG91ciBbMC0xMV1cbiAgSzogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKSAlIDEyO1xuXG4gICAgaWYgKHRva2VuID09PSAnS28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoaG91cnMsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIEhvdXIgWzEtMjRdXG4gIGs6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgaG91cnMgPSBkYXRlLmdldFVUQ0hvdXJzKCk7XG4gICAgaWYgKGhvdXJzID09PSAwKSBob3VycyA9IDI0O1xuXG4gICAgaWYgKHRva2VuID09PSAna28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoaG91cnMsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIE1pbnV0ZVxuICBtOiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgaWYgKHRva2VuID09PSAnbW8nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihkYXRlLmdldFVUQ01pbnV0ZXMoKSwge1xuICAgICAgICB1bml0OiAnbWludXRlJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5tKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gU2Vjb25kXG4gIHM6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICBpZiAodG9rZW4gPT09ICdzbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRhdGUuZ2V0VVRDU2Vjb25kcygpLCB7XG4gICAgICAgIHVuaXQ6ICdzZWNvbmQnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLnMoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBGcmFjdGlvbiBvZiBzZWNvbmRcbiAgUzogZnVuY3Rpb24gKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5TKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gVGltZXpvbmUgKElTTy04NjAxLiBJZiBvZmZzZXQgaXMgMCwgb3V0cHV0IGlzIGFsd2F5cyBgJ1onYClcbiAgWDogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBfbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3JpZ2luYWxEYXRlID0gb3B0aW9ucy5fb3JpZ2luYWxEYXRlIHx8IGRhdGU7XG4gICAgdmFyIHRpbWV6b25lT2Zmc2V0ID0gb3JpZ2luYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5cbiAgICBpZiAodGltZXpvbmVPZmZzZXQgPT09IDApIHtcbiAgICAgIHJldHVybiAnWic7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gSG91cnMgYW5kIG9wdGlvbmFsIG1pbnV0ZXNcbiAgICAgIGNhc2UgJ1gnOlxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmVXaXRoT3B0aW9uYWxNaW51dGVzKHRpbWV6b25lT2Zmc2V0KTtcbiAgICAgIC8vIEhvdXJzLCBtaW51dGVzIGFuZCBvcHRpb25hbCBzZWNvbmRzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgLy8gTm90ZTogbmVpdGhlciBJU08tODYwMSBub3IgSmF2YVNjcmlwdCBzdXBwb3J0cyBzZWNvbmRzIGluIHRpbWV6b25lIG9mZnNldHNcbiAgICAgIC8vIHNvIHRoaXMgdG9rZW4gYWx3YXlzIGhhcyB0aGUgc2FtZSBvdXRwdXQgYXMgYFhYYFxuXG4gICAgICBjYXNlICdYWFhYJzpcbiAgICAgIGNhc2UgJ1hYJzpcbiAgICAgICAgLy8gSG91cnMgYW5kIG1pbnV0ZXMgd2l0aG91dCBgOmAgZGVsaW1pdGVyXG4gICAgICAgIHJldHVybiBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCk7XG4gICAgICAvLyBIb3VycywgbWludXRlcyBhbmQgb3B0aW9uYWwgc2Vjb25kcyB3aXRoIGA6YCBkZWxpbWl0ZXJcbiAgICAgIC8vIE5vdGU6IG5laXRoZXIgSVNPLTg2MDEgbm9yIEphdmFTY3JpcHQgc3VwcG9ydHMgc2Vjb25kcyBpbiB0aW1lem9uZSBvZmZzZXRzXG4gICAgICAvLyBzbyB0aGlzIHRva2VuIGFsd2F5cyBoYXMgdGhlIHNhbWUgb3V0cHV0IGFzIGBYWFhgXG5cbiAgICAgIGNhc2UgJ1hYWFhYJzpcbiAgICAgIGNhc2UgJ1hYWCc6IC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGggYDpgIGRlbGltaXRlclxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmUodGltZXpvbmVPZmZzZXQsICc6Jyk7XG4gICAgfVxuICB9LFxuICAvLyBUaW1lem9uZSAoSVNPLTg2MDEuIElmIG9mZnNldCBpcyAwLCBvdXRwdXQgaXMgYCcrMDA6MDAnYCBvciBlcXVpdmFsZW50KVxuICB4OiBmdW5jdGlvbiAoZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSBvcmlnaW5hbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcblxuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIEhvdXJzIGFuZCBvcHRpb25hbCBtaW51dGVzXG4gICAgICBjYXNlICd4JzpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lV2l0aE9wdGlvbmFsTWludXRlcyh0aW1lem9uZU9mZnNldCk7XG4gICAgICAvLyBIb3VycywgbWludXRlcyBhbmQgb3B0aW9uYWwgc2Vjb25kcyB3aXRob3V0IGA6YCBkZWxpbWl0ZXJcbiAgICAgIC8vIE5vdGU6IG5laXRoZXIgSVNPLTg2MDEgbm9yIEphdmFTY3JpcHQgc3VwcG9ydHMgc2Vjb25kcyBpbiB0aW1lem9uZSBvZmZzZXRzXG4gICAgICAvLyBzbyB0aGlzIHRva2VuIGFsd2F5cyBoYXMgdGhlIHNhbWUgb3V0cHV0IGFzIGB4eGBcblxuICAgICAgY2FzZSAneHh4eCc6XG4gICAgICBjYXNlICd4eCc6XG4gICAgICAgIC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmUodGltZXpvbmVPZmZzZXQpO1xuICAgICAgLy8gSG91cnMsIG1pbnV0ZXMgYW5kIG9wdGlvbmFsIHNlY29uZHMgd2l0aCBgOmAgZGVsaW1pdGVyXG4gICAgICAvLyBOb3RlOiBuZWl0aGVyIElTTy04NjAxIG5vciBKYXZhU2NyaXB0IHN1cHBvcnRzIHNlY29uZHMgaW4gdGltZXpvbmUgb2Zmc2V0c1xuICAgICAgLy8gc28gdGhpcyB0b2tlbiBhbHdheXMgaGFzIHRoZSBzYW1lIG91dHB1dCBhcyBgeHh4YFxuXG4gICAgICBjYXNlICd4eHh4eCc6XG4gICAgICBjYXNlICd4eHgnOiAvLyBIb3VycyBhbmQgbWludXRlcyB3aXRoIGA6YCBkZWxpbWl0ZXJcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lKHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgIH1cbiAgfSxcbiAgLy8gVGltZXpvbmUgKEdNVClcbiAgTzogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBfbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3JpZ2luYWxEYXRlID0gb3B0aW9ucy5fb3JpZ2luYWxEYXRlIHx8IGRhdGU7XG4gICAgdmFyIHRpbWV6b25lT2Zmc2V0ID0gb3JpZ2luYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAnTyc6XG4gICAgICBjYXNlICdPTyc6XG4gICAgICBjYXNlICdPT08nOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuXG4gICAgICBjYXNlICdPT09PJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnR01UJyArIGZvcm1hdFRpbWV6b25lKHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgIH1cbiAgfSxcbiAgLy8gVGltZXpvbmUgKHNwZWNpZmljIG5vbi1sb2NhdGlvbilcbiAgejogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBfbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3JpZ2luYWxEYXRlID0gb3B0aW9ucy5fb3JpZ2luYWxEYXRlIHx8IGRhdGU7XG4gICAgdmFyIHRpbWV6b25lT2Zmc2V0ID0gb3JpZ2luYWxEYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAneic6XG4gICAgICBjYXNlICd6eic6XG4gICAgICBjYXNlICd6enonOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuXG4gICAgICBjYXNlICd6enp6JzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnR01UJyArIGZvcm1hdFRpbWV6b25lKHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgIH1cbiAgfSxcbiAgLy8gU2Vjb25kcyB0aW1lc3RhbXBcbiAgdDogZnVuY3Rpb24gKGRhdGUsIHRva2VuLCBfbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3JpZ2luYWxEYXRlID0gb3B0aW9ucy5fb3JpZ2luYWxEYXRlIHx8IGRhdGU7XG4gICAgdmFyIHRpbWVzdGFtcCA9IE1hdGguZmxvb3Iob3JpZ2luYWxEYXRlLmdldFRpbWUoKSAvIDEwMDApO1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3ModGltZXN0YW1wLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNaWxsaXNlY29uZHMgdGltZXN0YW1wXG4gIFQ6IGZ1bmN0aW9uIChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lc3RhbXAgPSBvcmlnaW5hbERhdGUuZ2V0VGltZSgpO1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3ModGltZXN0YW1wLCB0b2tlbi5sZW5ndGgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBmb3JtYXRUaW1lem9uZVNob3J0KG9mZnNldCwgZGlydHlEZWxpbWl0ZXIpIHtcbiAgdmFyIHNpZ24gPSBvZmZzZXQgPiAwID8gJy0nIDogJysnO1xuICB2YXIgYWJzT2Zmc2V0ID0gTWF0aC5hYnMob2Zmc2V0KTtcbiAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihhYnNPZmZzZXQgLyA2MCk7XG4gIHZhciBtaW51dGVzID0gYWJzT2Zmc2V0ICUgNjA7XG5cbiAgaWYgKG1pbnV0ZXMgPT09IDApIHtcbiAgICByZXR1cm4gc2lnbiArIFN0cmluZyhob3Vycyk7XG4gIH1cblxuICB2YXIgZGVsaW1pdGVyID0gZGlydHlEZWxpbWl0ZXIgfHwgJyc7XG4gIHJldHVybiBzaWduICsgU3RyaW5nKGhvdXJzKSArIGRlbGltaXRlciArIGFkZExlYWRpbmdaZXJvcyhtaW51dGVzLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VGltZXpvbmVXaXRoT3B0aW9uYWxNaW51dGVzKG9mZnNldCwgZGlydHlEZWxpbWl0ZXIpIHtcbiAgaWYgKG9mZnNldCAlIDYwID09PSAwKSB7XG4gICAgdmFyIHNpZ24gPSBvZmZzZXQgPiAwID8gJy0nIDogJysnO1xuICAgIHJldHVybiBzaWduICsgYWRkTGVhZGluZ1plcm9zKE1hdGguYWJzKG9mZnNldCkgLyA2MCwgMik7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0VGltZXpvbmUob2Zmc2V0LCBkaXJ0eURlbGltaXRlcik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFRpbWV6b25lKG9mZnNldCwgZGlydHlEZWxpbWl0ZXIpIHtcbiAgdmFyIGRlbGltaXRlciA9IGRpcnR5RGVsaW1pdGVyIHx8ICcnO1xuICB2YXIgc2lnbiA9IG9mZnNldCA+IDAgPyAnLScgOiAnKyc7XG4gIHZhciBhYnNPZmZzZXQgPSBNYXRoLmFicyhvZmZzZXQpO1xuICB2YXIgaG91cnMgPSBhZGRMZWFkaW5nWmVyb3MoTWF0aC5mbG9vcihhYnNPZmZzZXQgLyA2MCksIDIpO1xuICB2YXIgbWludXRlcyA9IGFkZExlYWRpbmdaZXJvcyhhYnNPZmZzZXQgJSA2MCwgMik7XG4gIHJldHVybiBzaWduICsgaG91cnMgKyBkZWxpbWl0ZXIgKyBtaW51dGVzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtYXR0ZXJzOyIsICJ2YXIgZGF0ZUxvbmdGb3JtYXR0ZXIgPSBmdW5jdGlvbiAocGF0dGVybiwgZm9ybWF0TG9uZykge1xuICBzd2l0Y2ggKHBhdHRlcm4pIHtcbiAgICBjYXNlICdQJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLmRhdGUoe1xuICAgICAgICB3aWR0aDogJ3Nob3J0J1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdQUCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy5kYXRlKHtcbiAgICAgICAgd2lkdGg6ICdtZWRpdW0nXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ1BQUCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy5kYXRlKHtcbiAgICAgICAgd2lkdGg6ICdsb25nJ1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdQUFBQJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcuZGF0ZSh7XG4gICAgICAgIHdpZHRoOiAnZnVsbCdcbiAgICAgIH0pO1xuICB9XG59O1xuXG52YXIgdGltZUxvbmdGb3JtYXR0ZXIgPSBmdW5jdGlvbiAocGF0dGVybiwgZm9ybWF0TG9uZykge1xuICBzd2l0Y2ggKHBhdHRlcm4pIHtcbiAgICBjYXNlICdwJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLnRpbWUoe1xuICAgICAgICB3aWR0aDogJ3Nob3J0J1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdwcCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy50aW1lKHtcbiAgICAgICAgd2lkdGg6ICdtZWRpdW0nXG4gICAgICB9KTtcblxuICAgIGNhc2UgJ3BwcCc6XG4gICAgICByZXR1cm4gZm9ybWF0TG9uZy50aW1lKHtcbiAgICAgICAgd2lkdGg6ICdsb25nJ1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdwcHBwJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcudGltZSh7XG4gICAgICAgIHdpZHRoOiAnZnVsbCdcbiAgICAgIH0pO1xuICB9XG59O1xuXG52YXIgZGF0ZVRpbWVMb25nRm9ybWF0dGVyID0gZnVuY3Rpb24gKHBhdHRlcm4sIGZvcm1hdExvbmcpIHtcbiAgdmFyIG1hdGNoUmVzdWx0ID0gcGF0dGVybi5tYXRjaCgvKFArKShwKyk/LykgfHwgW107XG4gIHZhciBkYXRlUGF0dGVybiA9IG1hdGNoUmVzdWx0WzFdO1xuICB2YXIgdGltZVBhdHRlcm4gPSBtYXRjaFJlc3VsdFsyXTtcblxuICBpZiAoIXRpbWVQYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGRhdGVMb25nRm9ybWF0dGVyKHBhdHRlcm4sIGZvcm1hdExvbmcpO1xuICB9XG5cbiAgdmFyIGRhdGVUaW1lRm9ybWF0O1xuXG4gIHN3aXRjaCAoZGF0ZVBhdHRlcm4pIHtcbiAgICBjYXNlICdQJzpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnc2hvcnQnXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUFAnOlxuICAgICAgZGF0ZVRpbWVGb3JtYXQgPSBmb3JtYXRMb25nLmRhdGVUaW1lKHtcbiAgICAgICAgd2lkdGg6ICdtZWRpdW0nXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUFBQJzpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnbG9uZydcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdQUFBQJzpcbiAgICBkZWZhdWx0OlxuICAgICAgZGF0ZVRpbWVGb3JtYXQgPSBmb3JtYXRMb25nLmRhdGVUaW1lKHtcbiAgICAgICAgd2lkdGg6ICdmdWxsJ1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBkYXRlVGltZUZvcm1hdC5yZXBsYWNlKCd7e2RhdGV9fScsIGRhdGVMb25nRm9ybWF0dGVyKGRhdGVQYXR0ZXJuLCBmb3JtYXRMb25nKSkucmVwbGFjZSgne3t0aW1lfX0nLCB0aW1lTG9uZ0Zvcm1hdHRlcih0aW1lUGF0dGVybiwgZm9ybWF0TG9uZykpO1xufTtcblxudmFyIGxvbmdGb3JtYXR0ZXJzID0ge1xuICBwOiB0aW1lTG9uZ0Zvcm1hdHRlcixcbiAgUDogZGF0ZVRpbWVMb25nRm9ybWF0dGVyXG59O1xuZXhwb3J0IGRlZmF1bHQgbG9uZ0Zvcm1hdHRlcnM7IiwgInZhciBwcm90ZWN0ZWREYXlPZlllYXJUb2tlbnMgPSBbJ0QnLCAnREQnXTtcbnZhciBwcm90ZWN0ZWRXZWVrWWVhclRva2VucyA9IFsnWVknLCAnWVlZWSddO1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvdGVjdGVkRGF5T2ZZZWFyVG9rZW4odG9rZW4pIHtcbiAgcmV0dXJuIHByb3RlY3RlZERheU9mWWVhclRva2Vucy5pbmRleE9mKHRva2VuKSAhPT0gLTE7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNQcm90ZWN0ZWRXZWVrWWVhclRva2VuKHRva2VuKSB7XG4gIHJldHVybiBwcm90ZWN0ZWRXZWVrWWVhclRva2Vucy5pbmRleE9mKHRva2VuKSAhPT0gLTE7XG59XG5leHBvcnQgZnVuY3Rpb24gdGhyb3dQcm90ZWN0ZWRFcnJvcih0b2tlbiwgZm9ybWF0LCBpbnB1dCkge1xuICBpZiAodG9rZW4gPT09ICdZWVlZJykge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiVXNlIGB5eXl5YCBpbnN0ZWFkIG9mIGBZWVlZYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdZWScpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgeXlgIGluc3RlYWQgb2YgYFlZYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdEJykge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiVXNlIGBkYCBpbnN0ZWFkIG9mIGBEYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdERCcpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgZGRgIGluc3RlYWQgb2YgYEREYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH1cbn0iLCAidmFyIGZvcm1hdERpc3RhbmNlTG9jYWxlID0ge1xuICBsZXNzVGhhblhTZWNvbmRzOiB7XG4gICAgb25lOiAnbGVzcyB0aGFuIGEgc2Vjb25kJyxcbiAgICBvdGhlcjogJ2xlc3MgdGhhbiB7e2NvdW50fX0gc2Vjb25kcydcbiAgfSxcbiAgeFNlY29uZHM6IHtcbiAgICBvbmU6ICcxIHNlY29uZCcsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gc2Vjb25kcydcbiAgfSxcbiAgaGFsZkFNaW51dGU6ICdoYWxmIGEgbWludXRlJyxcbiAgbGVzc1RoYW5YTWludXRlczoge1xuICAgIG9uZTogJ2xlc3MgdGhhbiBhIG1pbnV0ZScsXG4gICAgb3RoZXI6ICdsZXNzIHRoYW4ge3tjb3VudH19IG1pbnV0ZXMnXG4gIH0sXG4gIHhNaW51dGVzOiB7XG4gICAgb25lOiAnMSBtaW51dGUnLFxuICAgIG90aGVyOiAne3tjb3VudH19IG1pbnV0ZXMnXG4gIH0sXG4gIGFib3V0WEhvdXJzOiB7XG4gICAgb25lOiAnYWJvdXQgMSBob3VyJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSBob3VycydcbiAgfSxcbiAgeEhvdXJzOiB7XG4gICAgb25lOiAnMSBob3VyJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSBob3VycydcbiAgfSxcbiAgeERheXM6IHtcbiAgICBvbmU6ICcxIGRheScsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gZGF5cydcbiAgfSxcbiAgYWJvdXRYV2Vla3M6IHtcbiAgICBvbmU6ICdhYm91dCAxIHdlZWsnLFxuICAgIG90aGVyOiAnYWJvdXQge3tjb3VudH19IHdlZWtzJ1xuICB9LFxuICB4V2Vla3M6IHtcbiAgICBvbmU6ICcxIHdlZWsnLFxuICAgIG90aGVyOiAne3tjb3VudH19IHdlZWtzJ1xuICB9LFxuICBhYm91dFhNb250aHM6IHtcbiAgICBvbmU6ICdhYm91dCAxIG1vbnRoJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSBtb250aHMnXG4gIH0sXG4gIHhNb250aHM6IHtcbiAgICBvbmU6ICcxIG1vbnRoJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSBtb250aHMnXG4gIH0sXG4gIGFib3V0WFllYXJzOiB7XG4gICAgb25lOiAnYWJvdXQgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSB5ZWFycydcbiAgfSxcbiAgeFllYXJzOiB7XG4gICAgb25lOiAnMSB5ZWFyJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSB5ZWFycydcbiAgfSxcbiAgb3ZlclhZZWFyczoge1xuICAgIG9uZTogJ292ZXIgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ292ZXIge3tjb3VudH19IHllYXJzJ1xuICB9LFxuICBhbG1vc3RYWWVhcnM6IHtcbiAgICBvbmU6ICdhbG1vc3QgMSB5ZWFyJyxcbiAgICBvdGhlcjogJ2FsbW9zdCB7e2NvdW50fX0geWVhcnMnXG4gIH1cbn07XG5cbnZhciBmb3JtYXREaXN0YW5jZSA9IGZ1bmN0aW9uICh0b2tlbiwgY291bnQsIG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgdmFyIHRva2VuVmFsdWUgPSBmb3JtYXREaXN0YW5jZUxvY2FsZVt0b2tlbl07XG5cbiAgaWYgKHR5cGVvZiB0b2tlblZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJlc3VsdCA9IHRva2VuVmFsdWU7XG4gIH0gZWxzZSBpZiAoY291bnQgPT09IDEpIHtcbiAgICByZXN1bHQgPSB0b2tlblZhbHVlLm9uZTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSB0b2tlblZhbHVlLm90aGVyLnJlcGxhY2UoJ3t7Y291bnR9fScsIGNvdW50LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMuYWRkU3VmZml4KSB7XG4gICAgaWYgKG9wdGlvbnMuY29tcGFyaXNvbiAmJiBvcHRpb25zLmNvbXBhcmlzb24gPiAwKSB7XG4gICAgICByZXR1cm4gJ2luICcgKyByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQgKyAnIGFnbyc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1hdERpc3RhbmNlOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEZvcm1hdExvbmdGbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIC8vIFRPRE86IFJlbW92ZSBTdHJpbmcoKVxuICAgIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcbiAgICB2YXIgZm9ybWF0ID0gYXJncy5mb3JtYXRzW3dpZHRoXSB8fCBhcmdzLmZvcm1hdHNbYXJncy5kZWZhdWx0V2lkdGhdO1xuICAgIHJldHVybiBmb3JtYXQ7XG4gIH07XG59IiwgImltcG9ydCBidWlsZEZvcm1hdExvbmdGbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZEZvcm1hdExvbmdGbi9pbmRleC5qc1wiO1xudmFyIGRhdGVGb3JtYXRzID0ge1xuICBmdWxsOiAnRUVFRSwgTU1NTSBkbywgeScsXG4gIGxvbmc6ICdNTU1NIGRvLCB5JyxcbiAgbWVkaXVtOiAnTU1NIGQsIHknLFxuICBzaG9ydDogJ01NL2RkL3l5eXknXG59O1xudmFyIHRpbWVGb3JtYXRzID0ge1xuICBmdWxsOiAnaDptbTpzcyBhIHp6enonLFxuICBsb25nOiAnaDptbTpzcyBhIHonLFxuICBtZWRpdW06ICdoOm1tOnNzIGEnLFxuICBzaG9ydDogJ2g6bW0gYSdcbn07XG52YXIgZGF0ZVRpbWVGb3JtYXRzID0ge1xuICBmdWxsOiBcInt7ZGF0ZX19ICdhdCcge3t0aW1lfX1cIixcbiAgbG9uZzogXCJ7e2RhdGV9fSAnYXQnIHt7dGltZX19XCIsXG4gIG1lZGl1bTogJ3t7ZGF0ZX19LCB7e3RpbWV9fScsXG4gIHNob3J0OiAne3tkYXRlfX0sIHt7dGltZX19J1xufTtcbnZhciBmb3JtYXRMb25nID0ge1xuICBkYXRlOiBidWlsZEZvcm1hdExvbmdGbih7XG4gICAgZm9ybWF0czogZGF0ZUZvcm1hdHMsXG4gICAgZGVmYXVsdFdpZHRoOiAnZnVsbCdcbiAgfSksXG4gIHRpbWU6IGJ1aWxkRm9ybWF0TG9uZ0ZuKHtcbiAgICBmb3JtYXRzOiB0aW1lRm9ybWF0cyxcbiAgICBkZWZhdWx0V2lkdGg6ICdmdWxsJ1xuICB9KSxcbiAgZGF0ZVRpbWU6IGJ1aWxkRm9ybWF0TG9uZ0ZuKHtcbiAgICBmb3JtYXRzOiBkYXRlVGltZUZvcm1hdHMsXG4gICAgZGVmYXVsdFdpZHRoOiAnZnVsbCdcbiAgfSlcbn07XG5leHBvcnQgZGVmYXVsdCBmb3JtYXRMb25nOyIsICJ2YXIgZm9ybWF0UmVsYXRpdmVMb2NhbGUgPSB7XG4gIGxhc3RXZWVrOiBcIidsYXN0JyBlZWVlICdhdCcgcFwiLFxuICB5ZXN0ZXJkYXk6IFwiJ3llc3RlcmRheSBhdCcgcFwiLFxuICB0b2RheTogXCIndG9kYXkgYXQnIHBcIixcbiAgdG9tb3Jyb3c6IFwiJ3RvbW9ycm93IGF0JyBwXCIsXG4gIG5leHRXZWVrOiBcImVlZWUgJ2F0JyBwXCIsXG4gIG90aGVyOiAnUCdcbn07XG5cbnZhciBmb3JtYXRSZWxhdGl2ZSA9IGZ1bmN0aW9uICh0b2tlbiwgX2RhdGUsIF9iYXNlRGF0ZSwgX29wdGlvbnMpIHtcbiAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlTG9jYWxlW3Rva2VuXTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1hdFJlbGF0aXZlOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZExvY2FsaXplRm4oYXJncykge1xuICByZXR1cm4gZnVuY3Rpb24gKGRpcnR5SW5kZXgsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCA9IG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMuY29udGV4dCA/IFN0cmluZyhvcHRpb25zLmNvbnRleHQpIDogJ3N0YW5kYWxvbmUnO1xuICAgIHZhciB2YWx1ZXNBcnJheTtcblxuICAgIGlmIChjb250ZXh0ID09PSAnZm9ybWF0dGluZycgJiYgYXJncy5mb3JtYXR0aW5nVmFsdWVzKSB7XG4gICAgICB2YXIgZGVmYXVsdFdpZHRoID0gYXJncy5kZWZhdWx0Rm9ybWF0dGluZ1dpZHRoIHx8IGFyZ3MuZGVmYXVsdFdpZHRoO1xuICAgICAgdmFyIHdpZHRoID0gb3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgJiYgb3B0aW9ucy53aWR0aCA/IFN0cmluZyhvcHRpb25zLndpZHRoKSA6IGRlZmF1bHRXaWR0aDtcbiAgICAgIHZhbHVlc0FycmF5ID0gYXJncy5mb3JtYXR0aW5nVmFsdWVzW3dpZHRoXSB8fCBhcmdzLmZvcm1hdHRpbmdWYWx1ZXNbZGVmYXVsdFdpZHRoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9kZWZhdWx0V2lkdGggPSBhcmdzLmRlZmF1bHRXaWR0aDtcblxuICAgICAgdmFyIF93aWR0aCA9IG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcblxuICAgICAgdmFsdWVzQXJyYXkgPSBhcmdzLnZhbHVlc1tfd2lkdGhdIHx8IGFyZ3MudmFsdWVzW19kZWZhdWx0V2lkdGhdO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IGFyZ3MuYXJndW1lbnRDYWxsYmFjayA/IGFyZ3MuYXJndW1lbnRDYWxsYmFjayhkaXJ0eUluZGV4KSA6IGRpcnR5SW5kZXg7IC8vIEB0cy1pZ25vcmU6IEZvciBzb21lIHJlYXNvbiBUeXBlU2NyaXB0IGp1c3QgZG9uJ3Qgd2FudCB0byBtYXRjaCBpdCwgbm8gbWF0dGVyIGhvdyBoYXJkIHdlIHRyeS4gSSBjaGFsbGVuZ2UgeW91IHRvIHRyeSB0byByZW1vdmUgaXQhXG5cbiAgICByZXR1cm4gdmFsdWVzQXJyYXlbaW5kZXhdO1xuICB9O1xufSIsICJpbXBvcnQgYnVpbGRMb2NhbGl6ZUZuIGZyb20gXCIuLi8uLi8uLi9fbGliL2J1aWxkTG9jYWxpemVGbi9pbmRleC5qc1wiO1xudmFyIGVyYVZhbHVlcyA9IHtcbiAgbmFycm93OiBbJ0InLCAnQSddLFxuICBhYmJyZXZpYXRlZDogWydCQycsICdBRCddLFxuICB3aWRlOiBbJ0JlZm9yZSBDaHJpc3QnLCAnQW5ubyBEb21pbmknXVxufTtcbnZhciBxdWFydGVyVmFsdWVzID0ge1xuICBuYXJyb3c6IFsnMScsICcyJywgJzMnLCAnNCddLFxuICBhYmJyZXZpYXRlZDogWydRMScsICdRMicsICdRMycsICdRNCddLFxuICB3aWRlOiBbJzFzdCBxdWFydGVyJywgJzJuZCBxdWFydGVyJywgJzNyZCBxdWFydGVyJywgJzR0aCBxdWFydGVyJ11cbn07IC8vIE5vdGU6IGluIEVuZ2xpc2gsIHRoZSBuYW1lcyBvZiBkYXlzIG9mIHRoZSB3ZWVrIGFuZCBtb250aHMgYXJlIGNhcGl0YWxpemVkLlxuLy8gSWYgeW91IGFyZSBtYWtpbmcgYSBuZXcgbG9jYWxlIGJhc2VkIG9uIHRoaXMgb25lLCBjaGVjayBpZiB0aGUgc2FtZSBpcyB0cnVlIGZvciB0aGUgbGFuZ3VhZ2UgeW91J3JlIHdvcmtpbmcgb24uXG4vLyBHZW5lcmFsbHksIGZvcm1hdHRlZCBkYXRlcyBzaG91bGQgbG9vayBsaWtlIHRoZXkgYXJlIGluIHRoZSBtaWRkbGUgb2YgYSBzZW50ZW5jZSxcbi8vIGUuZy4gaW4gU3BhbmlzaCBsYW5ndWFnZSB0aGUgd2Vla2RheXMgYW5kIG1vbnRocyBzaG91bGQgYmUgaW4gdGhlIGxvd2VyY2FzZS5cblxudmFyIG1vbnRoVmFsdWVzID0ge1xuICBuYXJyb3c6IFsnSicsICdGJywgJ00nLCAnQScsICdNJywgJ0onLCAnSicsICdBJywgJ1MnLCAnTycsICdOJywgJ0QnXSxcbiAgYWJicmV2aWF0ZWQ6IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXSxcbiAgd2lkZTogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cbn07XG52YXIgZGF5VmFsdWVzID0ge1xuICBuYXJyb3c6IFsnUycsICdNJywgJ1QnLCAnVycsICdUJywgJ0YnLCAnUyddLFxuICBzaG9ydDogWydTdScsICdNbycsICdUdScsICdXZScsICdUaCcsICdGcicsICdTYSddLFxuICBhYmJyZXZpYXRlZDogWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXSxcbiAgd2lkZTogWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddXG59O1xudmFyIGRheVBlcmlvZFZhbHVlcyA9IHtcbiAgbmFycm93OiB7XG4gICAgYW06ICdhJyxcbiAgICBwbTogJ3AnLFxuICAgIG1pZG5pZ2h0OiAnbWknLFxuICAgIG5vb246ICduJyxcbiAgICBtb3JuaW5nOiAnbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnZXZlbmluZycsXG4gICAgbmlnaHQ6ICduaWdodCdcbiAgfSxcbiAgYWJicmV2aWF0ZWQ6IHtcbiAgICBhbTogJ0FNJyxcbiAgICBwbTogJ1BNJyxcbiAgICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgICBub29uOiAnbm9vbicsXG4gICAgbW9ybmluZzogJ21vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2FmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2V2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnbmlnaHQnXG4gIH0sXG4gIHdpZGU6IHtcbiAgICBhbTogJ2EubS4nLFxuICAgIHBtOiAncC5tLicsXG4gICAgbWlkbmlnaHQ6ICdtaWRuaWdodCcsXG4gICAgbm9vbjogJ25vb24nLFxuICAgIG1vcm5pbmc6ICdtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdldmVuaW5nJyxcbiAgICBuaWdodDogJ25pZ2h0J1xuICB9XG59O1xudmFyIGZvcm1hdHRpbmdEYXlQZXJpb2RWYWx1ZXMgPSB7XG4gIG5hcnJvdzoge1xuICAgIGFtOiAnYScsXG4gICAgcG06ICdwJyxcbiAgICBtaWRuaWdodDogJ21pJyxcbiAgICBub29uOiAnbicsXG4gICAgbW9ybmluZzogJ2luIHRoZSBtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdpbiB0aGUgYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnaW4gdGhlIGV2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnYXQgbmlnaHQnXG4gIH0sXG4gIGFiYnJldmlhdGVkOiB7XG4gICAgYW06ICdBTScsXG4gICAgcG06ICdQTScsXG4gICAgbWlkbmlnaHQ6ICdtaWRuaWdodCcsXG4gICAgbm9vbjogJ25vb24nLFxuICAgIG1vcm5pbmc6ICdpbiB0aGUgbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnaW4gdGhlIGFmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2luIHRoZSBldmVuaW5nJyxcbiAgICBuaWdodDogJ2F0IG5pZ2h0J1xuICB9LFxuICB3aWRlOiB7XG4gICAgYW06ICdhLm0uJyxcbiAgICBwbTogJ3AubS4nLFxuICAgIG1pZG5pZ2h0OiAnbWlkbmlnaHQnLFxuICAgIG5vb246ICdub29uJyxcbiAgICBtb3JuaW5nOiAnaW4gdGhlIG1vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2luIHRoZSBhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdpbiB0aGUgZXZlbmluZycsXG4gICAgbmlnaHQ6ICdhdCBuaWdodCdcbiAgfVxufTtcblxudmFyIG9yZGluYWxOdW1iZXIgPSBmdW5jdGlvbiAoZGlydHlOdW1iZXIsIF9vcHRpb25zKSB7XG4gIHZhciBudW1iZXIgPSBOdW1iZXIoZGlydHlOdW1iZXIpOyAvLyBJZiBvcmRpbmFsIG51bWJlcnMgZGVwZW5kIG9uIGNvbnRleHQsIGZvciBleGFtcGxlLFxuICAvLyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQgZm9yIGRpZmZlcmVudCBncmFtbWF0aWNhbCBnZW5kZXJzLFxuICAvLyB1c2UgYG9wdGlvbnMudW5pdGAuXG4gIC8vXG4gIC8vIGB1bml0YCBjYW4gYmUgJ3llYXInLCAncXVhcnRlcicsICdtb250aCcsICd3ZWVrJywgJ2RhdGUnLCAnZGF5T2ZZZWFyJyxcbiAgLy8gJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLlxuXG4gIHZhciByZW0xMDAgPSBudW1iZXIgJSAxMDA7XG5cbiAgaWYgKHJlbTEwMCA+IDIwIHx8IHJlbTEwMCA8IDEwKSB7XG4gICAgc3dpdGNoIChyZW0xMDAgJSAxMCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gbnVtYmVyICsgJ3N0JztcblxuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gbnVtYmVyICsgJ25kJztcblxuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gbnVtYmVyICsgJ3JkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVtYmVyICsgJ3RoJztcbn07XG5cbnZhciBsb2NhbGl6ZSA9IHtcbiAgb3JkaW5hbE51bWJlcjogb3JkaW5hbE51bWJlcixcbiAgZXJhOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogZXJhVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnXG4gIH0pLFxuICBxdWFydGVyOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogcXVhcnRlclZhbHVlcyxcbiAgICBkZWZhdWx0V2lkdGg6ICd3aWRlJyxcbiAgICBhcmd1bWVudENhbGxiYWNrOiBmdW5jdGlvbiAocXVhcnRlcikge1xuICAgICAgcmV0dXJuIHF1YXJ0ZXIgLSAxO1xuICAgIH1cbiAgfSksXG4gIG1vbnRoOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogbW9udGhWYWx1ZXMsXG4gICAgZGVmYXVsdFdpZHRoOiAnd2lkZSdcbiAgfSksXG4gIGRheTogYnVpbGRMb2NhbGl6ZUZuKHtcbiAgICB2YWx1ZXM6IGRheVZhbHVlcyxcbiAgICBkZWZhdWx0V2lkdGg6ICd3aWRlJ1xuICB9KSxcbiAgZGF5UGVyaW9kOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogZGF5UGVyaW9kVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnLFxuICAgIGZvcm1hdHRpbmdWYWx1ZXM6IGZvcm1hdHRpbmdEYXlQZXJpb2RWYWx1ZXMsXG4gICAgZGVmYXVsdEZvcm1hdHRpbmdXaWR0aDogJ3dpZGUnXG4gIH0pXG59O1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxpemU7IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkTWF0Y2hGbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgdmFyIG1hdGNoUGF0dGVybiA9IHdpZHRoICYmIGFyZ3MubWF0Y2hQYXR0ZXJuc1t3aWR0aF0gfHwgYXJncy5tYXRjaFBhdHRlcm5zW2FyZ3MuZGVmYXVsdE1hdGNoV2lkdGhdO1xuICAgIHZhciBtYXRjaFJlc3VsdCA9IHN0cmluZy5tYXRjaChtYXRjaFBhdHRlcm4pO1xuXG4gICAgaWYgKCFtYXRjaFJlc3VsdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoZWRTdHJpbmcgPSBtYXRjaFJlc3VsdFswXTtcbiAgICB2YXIgcGFyc2VQYXR0ZXJucyA9IHdpZHRoICYmIGFyZ3MucGFyc2VQYXR0ZXJuc1t3aWR0aF0gfHwgYXJncy5wYXJzZVBhdHRlcm5zW2FyZ3MuZGVmYXVsdFBhcnNlV2lkdGhdO1xuICAgIHZhciBrZXkgPSBBcnJheS5pc0FycmF5KHBhcnNlUGF0dGVybnMpID8gZmluZEluZGV4KHBhcnNlUGF0dGVybnMsIGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICByZXR1cm4gcGF0dGVybi50ZXN0KG1hdGNoZWRTdHJpbmcpO1xuICAgIH0pIDogZmluZEtleShwYXJzZVBhdHRlcm5zLCBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgcmV0dXJuIHBhdHRlcm4udGVzdChtYXRjaGVkU3RyaW5nKTtcbiAgICB9KTtcbiAgICB2YXIgdmFsdWU7XG4gICAgdmFsdWUgPSBhcmdzLnZhbHVlQ2FsbGJhY2sgPyBhcmdzLnZhbHVlQ2FsbGJhY2soa2V5KSA6IGtleTtcbiAgICB2YWx1ZSA9IG9wdGlvbnMudmFsdWVDYWxsYmFjayA/IG9wdGlvbnMudmFsdWVDYWxsYmFjayh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB2YXIgcmVzdCA9IHN0cmluZy5zbGljZShtYXRjaGVkU3RyaW5nLmxlbmd0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHJlc3Q6IHJlc3RcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kS2V5KG9iamVjdCwgcHJlZGljYXRlKSB7XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgJiYgcHJlZGljYXRlKG9iamVjdFtrZXldKSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSkge1xuICBmb3IgKHZhciBrZXkgPSAwOyBrZXkgPCBhcnJheS5sZW5ndGg7IGtleSsrKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtrZXldKSkge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZE1hdGNoUGF0dGVybkZuKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgdmFyIG1hdGNoUmVzdWx0ID0gc3RyaW5nLm1hdGNoKGFyZ3MubWF0Y2hQYXR0ZXJuKTtcbiAgICBpZiAoIW1hdGNoUmVzdWx0KSByZXR1cm4gbnVsbDtcbiAgICB2YXIgbWF0Y2hlZFN0cmluZyA9IG1hdGNoUmVzdWx0WzBdO1xuICAgIHZhciBwYXJzZVJlc3VsdCA9IHN0cmluZy5tYXRjaChhcmdzLnBhcnNlUGF0dGVybik7XG4gICAgaWYgKCFwYXJzZVJlc3VsdCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIHZhbHVlID0gYXJncy52YWx1ZUNhbGxiYWNrID8gYXJncy52YWx1ZUNhbGxiYWNrKHBhcnNlUmVzdWx0WzBdKSA6IHBhcnNlUmVzdWx0WzBdO1xuICAgIHZhbHVlID0gb3B0aW9ucy52YWx1ZUNhbGxiYWNrID8gb3B0aW9ucy52YWx1ZUNhbGxiYWNrKHZhbHVlKSA6IHZhbHVlO1xuICAgIHZhciByZXN0ID0gc3RyaW5nLnNsaWNlKG1hdGNoZWRTdHJpbmcubGVuZ3RoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgcmVzdDogcmVzdFxuICAgIH07XG4gIH07XG59IiwgImltcG9ydCBidWlsZE1hdGNoRm4gZnJvbSBcIi4uLy4uLy4uL19saWIvYnVpbGRNYXRjaEZuL2luZGV4LmpzXCI7XG5pbXBvcnQgYnVpbGRNYXRjaFBhdHRlcm5GbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZE1hdGNoUGF0dGVybkZuL2luZGV4LmpzXCI7XG52YXIgbWF0Y2hPcmRpbmFsTnVtYmVyUGF0dGVybiA9IC9eKFxcZCspKHRofHN0fG5kfHJkKT8vaTtcbnZhciBwYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuID0gL1xcZCsvaTtcbnZhciBtYXRjaEVyYVBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eKGJ8YSkvaSxcbiAgYWJicmV2aWF0ZWQ6IC9eKGJcXC4/XFxzP2NcXC4/fGJcXC4/XFxzP2NcXC4/XFxzP2VcXC4/fGFcXC4/XFxzP2RcXC4/fGNcXC4/XFxzP2VcXC4/KS9pLFxuICB3aWRlOiAvXihiZWZvcmUgY2hyaXN0fGJlZm9yZSBjb21tb24gZXJhfGFubm8gZG9taW5pfGNvbW1vbiBlcmEpL2lcbn07XG52YXIgcGFyc2VFcmFQYXR0ZXJucyA9IHtcbiAgYW55OiBbL15iL2ksIC9eKGF8YykvaV1cbn07XG52YXIgbWF0Y2hRdWFydGVyUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL15bMTIzNF0vaSxcbiAgYWJicmV2aWF0ZWQ6IC9ecVsxMjM0XS9pLFxuICB3aWRlOiAvXlsxMjM0XSh0aHxzdHxuZHxyZCk/IHF1YXJ0ZXIvaVxufTtcbnZhciBwYXJzZVF1YXJ0ZXJQYXR0ZXJucyA9IHtcbiAgYW55OiBbLzEvaSwgLzIvaSwgLzMvaSwgLzQvaV1cbn07XG52YXIgbWF0Y2hNb250aFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eW2pmbWFzb25kXS9pLFxuICBhYmJyZXZpYXRlZDogL14oamFufGZlYnxtYXJ8YXByfG1heXxqdW58anVsfGF1Z3xzZXB8b2N0fG5vdnxkZWMpL2ksXG4gIHdpZGU6IC9eKGphbnVhcnl8ZmVicnVhcnl8bWFyY2h8YXByaWx8bWF5fGp1bmV8anVseXxhdWd1c3R8c2VwdGVtYmVyfG9jdG9iZXJ8bm92ZW1iZXJ8ZGVjZW1iZXIpL2lcbn07XG52YXIgcGFyc2VNb250aFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IFsvXmovaSwgL15mL2ksIC9ebS9pLCAvXmEvaSwgL15tL2ksIC9eai9pLCAvXmovaSwgL15hL2ksIC9ecy9pLCAvXm8vaSwgL15uL2ksIC9eZC9pXSxcbiAgYW55OiBbL15qYS9pLCAvXmYvaSwgL15tYXIvaSwgL15hcC9pLCAvXm1heS9pLCAvXmp1bi9pLCAvXmp1bC9pLCAvXmF1L2ksIC9ecy9pLCAvXm8vaSwgL15uL2ksIC9eZC9pXVxufTtcbnZhciBtYXRjaERheVBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eW3NtdHdmXS9pLFxuICBzaG9ydDogL14oc3V8bW98dHV8d2V8dGh8ZnJ8c2EpL2ksXG4gIGFiYnJldmlhdGVkOiAvXihzdW58bW9ufHR1ZXx3ZWR8dGh1fGZyaXxzYXQpL2ksXG4gIHdpZGU6IC9eKHN1bmRheXxtb25kYXl8dHVlc2RheXx3ZWRuZXNkYXl8dGh1cnNkYXl8ZnJpZGF5fHNhdHVyZGF5KS9pXG59O1xudmFyIHBhcnNlRGF5UGF0dGVybnMgPSB7XG4gIG5hcnJvdzogWy9ecy9pLCAvXm0vaSwgL150L2ksIC9edy9pLCAvXnQvaSwgL15mL2ksIC9ecy9pXSxcbiAgYW55OiBbL15zdS9pLCAvXm0vaSwgL150dS9pLCAvXncvaSwgL150aC9pLCAvXmYvaSwgL15zYS9pXVxufTtcbnZhciBtYXRjaERheVBlcmlvZFBhdHRlcm5zID0ge1xuICBuYXJyb3c6IC9eKGF8cHxtaXxufChpbiB0aGV8YXQpIChtb3JuaW5nfGFmdGVybm9vbnxldmVuaW5nfG5pZ2h0KSkvaSxcbiAgYW55OiAvXihbYXBdXFwuP1xccz9tXFwuP3xtaWRuaWdodHxub29ufChpbiB0aGV8YXQpIChtb3JuaW5nfGFmdGVybm9vbnxldmVuaW5nfG5pZ2h0KSkvaVxufTtcbnZhciBwYXJzZURheVBlcmlvZFBhdHRlcm5zID0ge1xuICBhbnk6IHtcbiAgICBhbTogL15hL2ksXG4gICAgcG06IC9ecC9pLFxuICAgIG1pZG5pZ2h0OiAvXm1pL2ksXG4gICAgbm9vbjogL15uby9pLFxuICAgIG1vcm5pbmc6IC9tb3JuaW5nL2ksXG4gICAgYWZ0ZXJub29uOiAvYWZ0ZXJub29uL2ksXG4gICAgZXZlbmluZzogL2V2ZW5pbmcvaSxcbiAgICBuaWdodDogL25pZ2h0L2lcbiAgfVxufTtcbnZhciBtYXRjaCA9IHtcbiAgb3JkaW5hbE51bWJlcjogYnVpbGRNYXRjaFBhdHRlcm5Gbih7XG4gICAgbWF0Y2hQYXR0ZXJuOiBtYXRjaE9yZGluYWxOdW1iZXJQYXR0ZXJuLFxuICAgIHBhcnNlUGF0dGVybjogcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybixcbiAgICB2YWx1ZUNhbGxiYWNrOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgIH1cbiAgfSksXG4gIGVyYTogYnVpbGRNYXRjaEZuKHtcbiAgICBtYXRjaFBhdHRlcm5zOiBtYXRjaEVyYVBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnd2lkZScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VFcmFQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueSdcbiAgfSksXG4gIHF1YXJ0ZXI6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hRdWFydGVyUGF0dGVybnMsXG4gICAgZGVmYXVsdE1hdGNoV2lkdGg6ICd3aWRlJyxcbiAgICBwYXJzZVBhdHRlcm5zOiBwYXJzZVF1YXJ0ZXJQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueScsXG4gICAgdmFsdWVDYWxsYmFjazogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gaW5kZXggKyAxO1xuICAgIH1cbiAgfSksXG4gIG1vbnRoOiBidWlsZE1hdGNoRm4oe1xuICAgIG1hdGNoUGF0dGVybnM6IG1hdGNoTW9udGhQYXR0ZXJucyxcbiAgICBkZWZhdWx0TWF0Y2hXaWR0aDogJ3dpZGUnLFxuICAgIHBhcnNlUGF0dGVybnM6IHBhcnNlTW9udGhQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueSdcbiAgfSksXG4gIGRheTogYnVpbGRNYXRjaEZuKHtcbiAgICBtYXRjaFBhdHRlcm5zOiBtYXRjaERheVBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnd2lkZScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VEYXlQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueSdcbiAgfSksXG4gIGRheVBlcmlvZDogYnVpbGRNYXRjaEZuKHtcbiAgICBtYXRjaFBhdHRlcm5zOiBtYXRjaERheVBlcmlvZFBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnYW55JyxcbiAgICBwYXJzZVBhdHRlcm5zOiBwYXJzZURheVBlcmlvZFBhdHRlcm5zLFxuICAgIGRlZmF1bHRQYXJzZVdpZHRoOiAnYW55J1xuICB9KVxufTtcbmV4cG9ydCBkZWZhdWx0IG1hdGNoOyIsICJpbXBvcnQgZm9ybWF0RGlzdGFuY2UgZnJvbSBcIi4vX2xpYi9mb3JtYXREaXN0YW5jZS9pbmRleC5qc1wiO1xuaW1wb3J0IGZvcm1hdExvbmcgZnJvbSBcIi4vX2xpYi9mb3JtYXRMb25nL2luZGV4LmpzXCI7XG5pbXBvcnQgZm9ybWF0UmVsYXRpdmUgZnJvbSBcIi4vX2xpYi9mb3JtYXRSZWxhdGl2ZS9pbmRleC5qc1wiO1xuaW1wb3J0IGxvY2FsaXplIGZyb20gXCIuL19saWIvbG9jYWxpemUvaW5kZXguanNcIjtcbmltcG9ydCBtYXRjaCBmcm9tIFwiLi9fbGliL21hdGNoL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQHR5cGUge0xvY2FsZX1cbiAqIEBjYXRlZ29yeSBMb2NhbGVzXG4gKiBAc3VtbWFyeSBFbmdsaXNoIGxvY2FsZSAoVW5pdGVkIFN0YXRlcykuXG4gKiBAbGFuZ3VhZ2UgRW5nbGlzaFxuICogQGlzby02MzktMiBlbmdcbiAqIEBhdXRob3IgU2FzaGEgS29zcyBbQGtvc3Nub2NvcnBde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9rb3Nzbm9jb3JwfVxuICogQGF1dGhvciBMZXNoYSBLb3NzIFtAbGVzaGFrb3NzXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vbGVzaGFrb3NzfVxuICovXG52YXIgbG9jYWxlID0ge1xuICBjb2RlOiAnZW4tVVMnLFxuICBmb3JtYXREaXN0YW5jZTogZm9ybWF0RGlzdGFuY2UsXG4gIGZvcm1hdExvbmc6IGZvcm1hdExvbmcsXG4gIGZvcm1hdFJlbGF0aXZlOiBmb3JtYXRSZWxhdGl2ZSxcbiAgbG9jYWxpemU6IGxvY2FsaXplLFxuICBtYXRjaDogbWF0Y2gsXG4gIG9wdGlvbnM6IHtcbiAgICB3ZWVrU3RhcnRzT246IDBcbiAgICAvKiBTdW5kYXkgKi9cbiAgICAsXG4gICAgZmlyc3RXZWVrQ29udGFpbnNEYXRlOiAxXG4gIH1cbn07XG5leHBvcnQgZGVmYXVsdCBsb2NhbGU7IiwgImltcG9ydCBkZWZhdWx0TG9jYWxlIGZyb20gXCIuLi8uLi9sb2NhbGUvZW4tVVMvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRMb2NhbGU7IiwgImltcG9ydCBpc1ZhbGlkIGZyb20gXCIuLi9pc1ZhbGlkL2luZGV4LmpzXCI7XG5pbXBvcnQgc3ViTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9zdWJNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCB0b0RhdGUgZnJvbSBcIi4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IGZvcm1hdHRlcnMgZnJvbSBcIi4uL19saWIvZm9ybWF0L2Zvcm1hdHRlcnMvaW5kZXguanNcIjtcbmltcG9ydCBsb25nRm9ybWF0dGVycyBmcm9tIFwiLi4vX2xpYi9mb3JtYXQvbG9uZ0Zvcm1hdHRlcnMvaW5kZXguanNcIjtcbmltcG9ydCBnZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9fbGliL2dldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCB7IGlzUHJvdGVjdGVkRGF5T2ZZZWFyVG9rZW4sIGlzUHJvdGVjdGVkV2Vla1llYXJUb2tlbiwgdGhyb3dQcm90ZWN0ZWRFcnJvciB9IGZyb20gXCIuLi9fbGliL3Byb3RlY3RlZFRva2Vucy9pbmRleC5qc1wiO1xuaW1wb3J0IHRvSW50ZWdlciBmcm9tIFwiLi4vX2xpYi90b0ludGVnZXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gXCIuLi9fbGliL2RlZmF1bHRPcHRpb25zL2luZGV4LmpzXCI7XG5pbXBvcnQgZGVmYXVsdExvY2FsZSBmcm9tIFwiLi4vX2xpYi9kZWZhdWx0TG9jYWxlL2luZGV4LmpzXCI7IC8vIFRoaXMgUmVnRXhwIGNvbnNpc3RzIG9mIHRocmVlIHBhcnRzIHNlcGFyYXRlZCBieSBgfGA6XG4vLyAtIFt5WVFxTUx3SWREZWNpaEhLa21zXW8gbWF0Y2hlcyBhbnkgYXZhaWxhYmxlIG9yZGluYWwgbnVtYmVyIHRva2VuXG4vLyAgIChvbmUgb2YgdGhlIGNlcnRhaW4gbGV0dGVycyBmb2xsb3dlZCBieSBgb2ApXG4vLyAtIChcXHcpXFwxKiBtYXRjaGVzIGFueSBzZXF1ZW5jZXMgb2YgdGhlIHNhbWUgbGV0dGVyXG4vLyAtICcnIG1hdGNoZXMgdHdvIHF1b3RlIGNoYXJhY3RlcnMgaW4gYSByb3dcbi8vIC0gJygnJ3xbXiddKSsoJ3wkKSBtYXRjaGVzIGFueXRoaW5nIHN1cnJvdW5kZWQgYnkgdHdvIHF1b3RlIGNoYXJhY3RlcnMgKCcpLFxuLy8gICBleGNlcHQgYSBzaW5nbGUgcXVvdGUgc3ltYm9sLCB3aGljaCBlbmRzIHRoZSBzZXF1ZW5jZS5cbi8vICAgVHdvIHF1b3RlIGNoYXJhY3RlcnMgZG8gbm90IGVuZCB0aGUgc2VxdWVuY2UuXG4vLyAgIElmIHRoZXJlIGlzIG5vIG1hdGNoaW5nIHNpbmdsZSBxdW90ZVxuLy8gICB0aGVuIHRoZSBzZXF1ZW5jZSB3aWxsIGNvbnRpbnVlIHVudGlsIHRoZSBlbmQgb2YgdGhlIHN0cmluZy5cbi8vIC0gLiBtYXRjaGVzIGFueSBzaW5nbGUgY2hhcmFjdGVyIHVubWF0Y2hlZCBieSBwcmV2aW91cyBwYXJ0cyBvZiB0aGUgUmVnRXhwc1xuXG52YXIgZm9ybWF0dGluZ1Rva2Vuc1JlZ0V4cCA9IC9beVlRcU1Md0lkRGVjaWhIS2ttc11vfChcXHcpXFwxKnwnJ3wnKCcnfFteJ10pKygnfCQpfC4vZzsgLy8gVGhpcyBSZWdFeHAgY2F0Y2hlcyBzeW1ib2xzIGVzY2FwZWQgYnkgcXVvdGVzLCBhbmQgYWxzb1xuLy8gc2VxdWVuY2VzIG9mIHN5bWJvbHMgUCwgcCwgYW5kIHRoZSBjb21iaW5hdGlvbnMgbGlrZSBgUFBQUFBQUHBwcHBwYFxuXG52YXIgbG9uZ0Zvcm1hdHRpbmdUb2tlbnNSZWdFeHAgPSAvUCtwK3xQK3xwK3wnJ3wnKCcnfFteJ10pKygnfCQpfC4vZztcbnZhciBlc2NhcGVkU3RyaW5nUmVnRXhwID0gL14nKFteXSo/KSc/JC87XG52YXIgZG91YmxlUXVvdGVSZWdFeHAgPSAvJycvZztcbnZhciB1bmVzY2FwZWRMYXRpbkNoYXJhY3RlclJlZ0V4cCA9IC9bYS16QS1aXS87XG4vKipcbiAqIEBuYW1lIGZvcm1hdFxuICogQGNhdGVnb3J5IENvbW1vbiBIZWxwZXJzXG4gKiBAc3VtbWFyeSBGb3JtYXQgdGhlIGRhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm4gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZyBpbiB0aGUgZ2l2ZW4gZm9ybWF0LiBUaGUgcmVzdWx0IG1heSB2YXJ5IGJ5IGxvY2FsZS5cbiAqXG4gKiA+IFx1MjZBMFx1RkUwRiBQbGVhc2Ugbm90ZSB0aGF0IHRoZSBgZm9ybWF0YCB0b2tlbnMgZGlmZmVyIGZyb20gTW9tZW50LmpzIGFuZCBvdGhlciBsaWJyYXJpZXMuXG4gKiA+IFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICpcbiAqIFRoZSBjaGFyYWN0ZXJzIHdyYXBwZWQgYmV0d2VlbiB0d28gc2luZ2xlIHF1b3RlcyBjaGFyYWN0ZXJzICgnKSBhcmUgZXNjYXBlZC5cbiAqIFR3byBzaW5nbGUgcXVvdGVzIGluIGEgcm93LCB3aGV0aGVyIGluc2lkZSBvciBvdXRzaWRlIGEgcXVvdGVkIHNlcXVlbmNlLCByZXByZXNlbnQgYSAncmVhbCcgc2luZ2xlIHF1b3RlLlxuICogKHNlZSB0aGUgbGFzdCBleGFtcGxlKVxuICpcbiAqIEZvcm1hdCBvZiB0aGUgc3RyaW5nIGlzIGJhc2VkIG9uIFVuaWNvZGUgVGVjaG5pY2FsIFN0YW5kYXJkICMzNTpcbiAqIGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS90cjM1LWRhdGVzLmh0bWwjRGF0ZV9GaWVsZF9TeW1ib2xfVGFibGVcbiAqIHdpdGggYSBmZXcgYWRkaXRpb25zIChzZWUgbm90ZSA3IGJlbG93IHRoZSB0YWJsZSkuXG4gKlxuICogQWNjZXB0ZWQgcGF0dGVybnM6XG4gKiB8IFVuaXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQYXR0ZXJuIHwgUmVzdWx0IGV4YW1wbGVzICAgICAgICAgICAgICAgICAgIHwgTm90ZXMgfFxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLXxcbiAqIHwgRXJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEcuLkdHRyAgfCBBRCwgQkMgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBHR0dHICAgIHwgQW5ubyBEb21pbmksIEJlZm9yZSBDaHJpc3QgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgR0dHR0cgICB8IEEsIEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgQ2FsZW5kYXIgeWVhciAgICAgICAgICAgICAgICAgICB8IHkgICAgICAgfCA0NCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5byAgICAgIHwgNDR0aCwgMXN0LCAwdGgsIDE3dGggICAgICAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeXkgICAgICB8IDQ0LCAwMSwgMDAsIDE3ICAgICAgICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHl5eSAgICAgfCAwNDQsIDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5eXl5ICAgIHwgMDA0NCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeXl5eXkgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNSAgIHxcbiAqIHwgTG9jYWwgd2Vlay1udW1iZXJpbmcgeWVhciAgICAgICB8IFkgICAgICAgfCA0NCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZbyAgICAgIHwgNDR0aCwgMXN0LCAxOTAwdGgsIDIwMTd0aCAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWVkgICAgICB8IDQ0LCAwMSwgMDAsIDE3ICAgICAgICAgICAgICAgICAgICB8IDUsOCAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFlZWSAgICAgfCAwNDQsIDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZWVlZICAgIHwgMDA0NCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgIHwgNSw4ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWVlZWVkgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNSAgIHxcbiAqIHwgSVNPIHdlZWstbnVtYmVyaW5nIHllYXIgICAgICAgICB8IFIgICAgICAgfCAtNDMsIDAsIDEsIDE5MDAsIDIwMTcgICAgICAgICAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBSUiAgICAgIHwgLTQzLCAwMCwgMDEsIDE5MDAsIDIwMTcgICAgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUlJSICAgICB8IC0wNDMsIDAwMCwgMDAxLCAxOTAwLCAyMDE3ICAgICAgICB8IDUsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFJSUlIgICAgfCAtMDA0MywgMDAwMCwgMDAwMSwgMTkwMCwgMjAxNyAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBSUlJSUiAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw1LDcgfFxuICogfCBFeHRlbmRlZCB5ZWFyICAgICAgICAgICAgICAgICAgIHwgdSAgICAgICB8IC00MywgMCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHV1ICAgICAgfCAtNDMsIDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB1dXUgICAgIHwgLTA0MywgMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgdXV1dSAgICB8IC0wMDQzLCAwMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHV1dXV1ICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDUgICB8XG4gKiB8IFF1YXJ0ZXIgKGZvcm1hdHRpbmcpICAgICAgICAgICAgfCBRICAgICAgIHwgMSwgMiwgMywgNCAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUW8gICAgICB8IDFzdCwgMm5kLCAzcmQsIDR0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFFRICAgICAgfCAwMSwgMDIsIDAzLCAwNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBRUVEgICAgIHwgUTEsIFEyLCBRMywgUTQgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUVFRUSAgICB8IDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFFRUVFRICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCA0ICAgICB8XG4gKiB8IFF1YXJ0ZXIgKHN0YW5kLWFsb25lKSAgICAgICAgICAgfCBxICAgICAgIHwgMSwgMiwgMywgNCAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcW8gICAgICB8IDFzdCwgMm5kLCAzcmQsIDR0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHFxICAgICAgfCAwMSwgMDIsIDAzLCAwNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBxcXEgICAgIHwgUTEsIFEyLCBRMywgUTQgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcXFxcSAgICB8IDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHFxcXFxICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCA0ICAgICB8XG4gKiB8IE1vbnRoIChmb3JtYXR0aW5nKSAgICAgICAgICAgICAgfCBNICAgICAgIHwgMSwgMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDEydGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE1NICAgICAgfCAwMSwgMDIsIC4uLiwgMTIgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBNTU0gICAgIHwgSmFuLCBGZWIsIC4uLiwgRGVjICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTU1NTSAgICB8IEphbnVhcnksIEZlYnJ1YXJ5LCAuLi4sIERlY2VtYmVyICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE1NTU1NICAgfCBKLCBGLCAuLi4sIEQgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IE1vbnRoIChzdGFuZC1hbG9uZSkgICAgICAgICAgICAgfCBMICAgICAgIHwgMSwgMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDEydGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IExMICAgICAgfCAwMSwgMDIsIC4uLiwgMTIgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBMTEwgICAgIHwgSmFuLCBGZWIsIC4uLiwgRGVjICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTExMTCAgICB8IEphbnVhcnksIEZlYnJ1YXJ5LCAuLi4sIERlY2VtYmVyICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IExMTExMICAgfCBKLCBGLCAuLi4sIEQgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IExvY2FsIHdlZWsgb2YgeWVhciAgICAgICAgICAgICAgfCB3ICAgICAgIHwgMSwgMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgd28gICAgICB8IDFzdCwgMm5kLCAuLi4sIDUzdGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHd3ICAgICAgfCAwMSwgMDIsIC4uLiwgNTMgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IElTTyB3ZWVrIG9mIHllYXIgICAgICAgICAgICAgICAgfCBJICAgICAgIHwgMSwgMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgSW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDUzdGggICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IElJICAgICAgfCAwMSwgMDIsIC4uLiwgNTMgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8IERheSBvZiBtb250aCAgICAgICAgICAgICAgICAgICAgfCBkICAgICAgIHwgMSwgMiwgLi4uLCAzMSAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDMxc3QgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGRkICAgICAgfCAwMSwgMDIsIC4uLiwgMzEgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IERheSBvZiB5ZWFyICAgICAgICAgICAgICAgICAgICAgfCBEICAgICAgIHwgMSwgMiwgLi4uLCAzNjUsIDM2NiAgICAgICAgICAgICAgIHwgOSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRG8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDM2NXRoLCAzNjZ0aCAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEREICAgICAgfCAwMSwgMDIsIC4uLiwgMzY1LCAzNjYgICAgICAgICAgICAgfCA5ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBEREQgICAgIHwgMDAxLCAwMDIsIC4uLiwgMzY1LCAzNjYgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRERERCAgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMgICAgIHxcbiAqIHwgRGF5IG9mIHdlZWsgKGZvcm1hdHRpbmcpICAgICAgICB8IEUuLkVFRSAgfCBNb24sIFR1ZSwgV2VkLCAuLi4sIFN1biAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBFRUVFICAgIHwgTW9uZGF5LCBUdWVzZGF5LCAuLi4sIFN1bmRheSAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRUVFRUUgICB8IE0sIFQsIFcsIFQsIEYsIFMsIFMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEVFRUVFRSAgfCBNbywgVHUsIFdlLCBUaCwgRnIsIFNhLCBTdSAgICAgICAgfCAgICAgICB8XG4gKiB8IElTTyBkYXkgb2Ygd2VlayAoZm9ybWF0dGluZykgICAgfCBpICAgICAgIHwgMSwgMiwgMywgLi4uLCA3ICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaW8gICAgICB8IDFzdCwgMm5kLCAuLi4sIDd0aCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpICAgICAgfCAwMSwgMDIsIC4uLiwgMDcgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpaWkgICAgIHwgTW9uLCBUdWUsIFdlZCwgLi4uLCBTdW4gICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaWlpaSAgICB8IE1vbmRheSwgVHVlc2RheSwgLi4uLCBTdW5kYXkgICAgICB8IDIsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpaWlpICAgfCBNLCBULCBXLCBULCBGLCBTLCBTICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpaWlpaWkgIHwgTW8sIFR1LCBXZSwgVGgsIEZyLCBTYSwgU3UgICAgICAgIHwgNyAgICAgfFxuICogfCBMb2NhbCBkYXkgb2Ygd2VlayAoZm9ybWF0dGluZykgIHwgZSAgICAgICB8IDIsIDMsIDQsIC4uLiwgMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVvICAgICAgfCAybmQsIDNyZCwgLi4uLCAxc3QgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZSAgICAgIHwgMDIsIDAzLCAuLi4sIDAxICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZWVlICAgICB8IE1vbiwgVHVlLCBXZWQsIC4uLiwgU3VuICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVlZWUgICAgfCBNb25kYXksIFR1ZXNkYXksIC4uLiwgU3VuZGF5ICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZWVlZSAgIHwgTSwgVCwgVywgVCwgRiwgUywgUyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZWVlZWVlICB8IE1vLCBUdSwgV2UsIFRoLCBGciwgU2EsIFN1ICAgICAgICB8ICAgICAgIHxcbiAqIHwgTG9jYWwgZGF5IG9mIHdlZWsgKHN0YW5kLWFsb25lKSB8IGMgICAgICAgfCAyLCAzLCA0LCAuLi4sIDEgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjbyAgICAgIHwgMm5kLCAzcmQsIC4uLiwgMXN0ICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2MgICAgICB8IDAyLCAwMywgLi4uLCAwMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNjYyAgICAgfCBNb24sIFR1ZSwgV2VkLCAuLi4sIFN1biAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjY2NjICAgIHwgTW9uZGF5LCBUdWVzZGF5LCAuLi4sIFN1bmRheSAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2NjY2MgICB8IE0sIFQsIFcsIFQsIEYsIFMsIFMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNjY2NjYyAgfCBNbywgVHUsIFdlLCBUaCwgRnIsIFNhLCBTdSAgICAgICAgfCAgICAgICB8XG4gKiB8IEFNLCBQTSAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhLi5hYSAgIHwgQU0sIFBNICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYWFhICAgICB8IGFtLCBwbSAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGFhYWEgICAgfCBhLm0uLCBwLm0uICAgICAgICAgICAgICAgICAgICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhYWFhYSAgIHwgYSwgcCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBBTSwgUE0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgIHwgYi4uYmIgICB8IEFNLCBQTSwgbm9vbiwgbWlkbmlnaHQgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGJiYiAgICAgfCBhbSwgcG0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBiYmJiICAgIHwgYS5tLiwgcC5tLiwgbm9vbiwgbWlkbmlnaHQgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYmJiYmIgICB8IGEsIHAsIG4sIG1pICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgRmxleGlibGUgZGF5IHBlcmlvZCAgICAgICAgICAgICB8IEIuLkJCQiAgfCBhdCBuaWdodCwgaW4gdGhlIG1vcm5pbmcsIC4uLiAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBCQkJCICAgIHwgYXQgbmlnaHQsIGluIHRoZSBtb3JuaW5nLCAuLi4gICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgQkJCQkIgICB8IGF0IG5pZ2h0LCBpbiB0aGUgbW9ybmluZywgLi4uICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMS0xMl0gICAgICAgICAgICAgICAgICAgICB8IGggICAgICAgfCAxLCAyLCAuLi4sIDExLCAxMiAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBobyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTF0aCwgMTJ0aCAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaGggICAgICB8IDAxLCAwMiwgLi4uLCAxMSwgMTIgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMC0yM10gICAgICAgICAgICAgICAgICAgICB8IEggICAgICAgfCAwLCAxLCAyLCAuLi4sIDIzICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBIbyAgICAgIHwgMHRoLCAxc3QsIDJuZCwgLi4uLCAyM3JkICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgSEggICAgICB8IDAwLCAwMSwgMDIsIC4uLiwgMjMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMC0xMV0gICAgICAgICAgICAgICAgICAgICB8IEsgICAgICAgfCAxLCAyLCAuLi4sIDExLCAwICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBLbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTF0aCwgMHRoICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgS0sgICAgICB8IDAxLCAwMiwgLi4uLCAxMSwgMDAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSG91ciBbMS0yNF0gICAgICAgICAgICAgICAgICAgICB8IGsgICAgICAgfCAyNCwgMSwgMiwgLi4uLCAyMyAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBrbyAgICAgIHwgMjR0aCwgMXN0LCAybmQsIC4uLiwgMjNyZCAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwga2sgICAgICB8IDI0LCAwMSwgMDIsIC4uLiwgMjMgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgTWludXRlICAgICAgICAgICAgICAgICAgICAgICAgICB8IG0gICAgICAgfCAwLCAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBtbyAgICAgIHwgMHRoLCAxc3QsIC4uLiwgNTl0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgbW0gICAgICB8IDAwLCAwMSwgLi4uLCA1OSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgU2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgICB8IHMgICAgICAgfCAwLCAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBzbyAgICAgIHwgMHRoLCAxc3QsIC4uLiwgNTl0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgc3MgICAgICB8IDAwLCAwMSwgLi4uLCA1OSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgRnJhY3Rpb24gb2Ygc2Vjb25kICAgICAgICAgICAgICB8IFMgICAgICAgfCAwLCAxLCAuLi4sIDkgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBTUyAgICAgIHwgMDAsIDAxLCAuLi4sIDk5ICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgU1NTICAgICB8IDAwMCwgMDAxLCAuLi4sIDk5OSAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFNTU1MgICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzICAgICB8XG4gKiB8IFRpbWV6b25lIChJU08tODYwMSB3LyBaKSAgICAgICAgfCBYICAgICAgIHwgLTA4LCArMDUzMCwgWiAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWFggICAgICB8IC0wODAwLCArMDUzMCwgWiAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFhYWCAgICAgfCAtMDg6MDAsICswNTozMCwgWiAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBYWFhYICAgIHwgLTA4MDAsICswNTMwLCBaLCArMTIzNDU2ICAgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWFhYWFggICB8IC0wODowMCwgKzA1OjMwLCBaLCArMTI6MzQ6NTYgICAgICB8ICAgICAgIHxcbiAqIHwgVGltZXpvbmUgKElTTy04NjAxIHcvbyBaKSAgICAgICB8IHggICAgICAgfCAtMDgsICswNTMwLCArMDAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB4eCAgICAgIHwgLTA4MDAsICswNTMwLCArMDAwMCAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeHh4ICAgICB8IC0wODowMCwgKzA1OjMwLCArMDA6MDAgICAgICAgICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHh4eHggICAgfCAtMDgwMCwgKzA1MzAsICswMDAwLCArMTIzNDU2ICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB4eHh4eCAgIHwgLTA4OjAwLCArMDU6MzAsICswMDowMCwgKzEyOjM0OjU2IHwgICAgICAgfFxuICogfCBUaW1lem9uZSAoR01UKSAgICAgICAgICAgICAgICAgIHwgTy4uLk9PTyB8IEdNVC04LCBHTVQrNTozMCwgR01UKzAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE9PT08gICAgfCBHTVQtMDg6MDAsIEdNVCswNTozMCwgR01UKzAwOjAwICAgfCAyICAgICB8XG4gKiB8IFRpbWV6b25lIChzcGVjaWZpYyBub24tbG9jYXQuKSAgfCB6Li4uenp6IHwgR01ULTgsIEdNVCs1OjMwLCBHTVQrMCAgICAgICAgICAgIHwgNiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgenp6eiAgICB8IEdNVC0wODowMCwgR01UKzA1OjMwLCBHTVQrMDA6MDAgICB8IDIsNiAgIHxcbiAqIHwgU2Vjb25kcyB0aW1lc3RhbXAgICAgICAgICAgICAgICB8IHQgICAgICAgfCA1MTI5Njk1MjAgICAgICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB0dCAgICAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw3ICAgfFxuICogfCBNaWxsaXNlY29uZHMgdGltZXN0YW1wICAgICAgICAgIHwgVCAgICAgICB8IDUxMjk2OTUyMDkwMCAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFRUICAgICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDcgICB8XG4gKiB8IExvbmcgbG9jYWxpemVkIGRhdGUgICAgICAgICAgICAgfCBQICAgICAgIHwgMDQvMjkvMTQ1MyAgICAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFAgICAgICB8IEFwciAyOSwgMTQ1MyAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQUCAgICAgfCBBcHJpbCAyOXRoLCAxNDUzICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUFBQICAgIHwgRnJpZGF5LCBBcHJpbCAyOXRoLCAxNDUzICAgICAgICAgIHwgMiw3ICAgfFxuICogfCBMb25nIGxvY2FsaXplZCB0aW1lICAgICAgICAgICAgIHwgcCAgICAgICB8IDEyOjAwIEFNICAgICAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHBwICAgICAgfCAxMjowMDowMCBBTSAgICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBwcHAgICAgIHwgMTI6MDA6MDAgQU0gR01UKzIgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcHBwcCAgICB8IDEyOjAwOjAwIEFNIEdNVCswMjowMCAgICAgICAgICAgICB8IDIsNyAgIHxcbiAqIHwgQ29tYmluYXRpb24gb2YgZGF0ZSBhbmQgdGltZSAgICB8IFBwICAgICAgfCAwNC8yOS8xNDUzLCAxMjowMCBBTSAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUHBwICAgIHwgQXByIDI5LCAxNDUzLCAxMjowMDowMCBBTSAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFBQcHBwICB8IEFwcmlsIDI5dGgsIDE0NTMgYXQgLi4uICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQUFBwcHBwfCBGcmlkYXksIEFwcmlsIDI5dGgsIDE0NTMgYXQgLi4uICAgfCAyLDcgICB8XG4gKiBOb3RlczpcbiAqIDEuIFwiRm9ybWF0dGluZ1wiIHVuaXRzIChlLmcuIGZvcm1hdHRpbmcgcXVhcnRlcikgaW4gdGhlIGRlZmF1bHQgZW4tVVMgbG9jYWxlXG4gKiAgICBhcmUgdGhlIHNhbWUgYXMgXCJzdGFuZC1hbG9uZVwiIHVuaXRzLCBidXQgYXJlIGRpZmZlcmVudCBpbiBzb21lIGxhbmd1YWdlcy5cbiAqICAgIFwiRm9ybWF0dGluZ1wiIHVuaXRzIGFyZSBkZWNsaW5lZCBhY2NvcmRpbmcgdG8gdGhlIHJ1bGVzIG9mIHRoZSBsYW5ndWFnZVxuICogICAgaW4gdGhlIGNvbnRleHQgb2YgYSBkYXRlLiBcIlN0YW5kLWFsb25lXCIgdW5pdHMgYXJlIGFsd2F5cyBub21pbmF0aXZlIHNpbmd1bGFyOlxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnZG8gTExMTCcsIHtsb2NhbGU6IGNzfSkgLy89PiAnNi4gbGlzdG9wYWQnYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnZG8gTU1NTScsIHtsb2NhbGU6IGNzfSkgLy89PiAnNi4gbGlzdG9wYWR1J2BcbiAqXG4gKiAyLiBBbnkgc2VxdWVuY2Ugb2YgdGhlIGlkZW50aWNhbCBsZXR0ZXJzIGlzIGEgcGF0dGVybiwgdW5sZXNzIGl0IGlzIGVzY2FwZWQgYnlcbiAqICAgIHRoZSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVycyAoc2VlIGJlbG93KS5cbiAqICAgIElmIHRoZSBzZXF1ZW5jZSBpcyBsb25nZXIgdGhhbiBsaXN0ZWQgaW4gdGFibGUgKGUuZy4gYEVFRUVFRUVFRUVFYClcbiAqICAgIHRoZSBvdXRwdXQgd2lsbCBiZSB0aGUgc2FtZSBhcyBkZWZhdWx0IHBhdHRlcm4gZm9yIHRoaXMgdW5pdCwgdXN1YWxseVxuICogICAgdGhlIGxvbmdlc3Qgb25lIChpbiBjYXNlIG9mIElTTyB3ZWVrZGF5cywgYEVFRUVgKS4gRGVmYXVsdCBwYXR0ZXJucyBmb3IgdW5pdHNcbiAqICAgIGFyZSBtYXJrZWQgd2l0aCBcIjJcIiBpbiB0aGUgbGFzdCBjb2x1bW4gb2YgdGhlIHRhYmxlLlxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NJykgLy89PiAnTm92J2BcbiAqXG4gKiAgICBgZm9ybWF0KG5ldyBEYXRlKDIwMTcsIDEwLCA2KSwgJ01NTU0nKSAvLz0+ICdOb3ZlbWJlcidgXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdNTU1NTScpIC8vPT4gJ04nYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NTU1NJykgLy89PiAnTm92ZW1iZXInYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NTU1NTScpIC8vPT4gJ05vdmVtYmVyJ2BcbiAqXG4gKiAzLiBTb21lIHBhdHRlcm5zIGNvdWxkIGJlIHVubGltaXRlZCBsZW5ndGggKHN1Y2ggYXMgYHl5eXl5eXl5YCkuXG4gKiAgICBUaGUgb3V0cHV0IHdpbGwgYmUgcGFkZGVkIHdpdGggemVyb3MgdG8gbWF0Y2ggdGhlIGxlbmd0aCBvZiB0aGUgcGF0dGVybi5cbiAqXG4gKiAgICBgZm9ybWF0KG5ldyBEYXRlKDIwMTcsIDEwLCA2KSwgJ3l5eXl5eXl5JykgLy89PiAnMDAwMDIwMTcnYFxuICpcbiAqIDQuIGBRUVFRUWAgYW5kIGBxcXFxcWAgY291bGQgYmUgbm90IHN0cmljdGx5IG51bWVyaWNhbCBpbiBzb21lIGxvY2FsZXMuXG4gKiAgICBUaGVzZSB0b2tlbnMgcmVwcmVzZW50IHRoZSBzaG9ydGVzdCBmb3JtIG9mIHRoZSBxdWFydGVyLlxuICpcbiAqIDUuIFRoZSBtYWluIGRpZmZlcmVuY2UgYmV0d2VlbiBgeWAgYW5kIGB1YCBwYXR0ZXJucyBhcmUgQi5DLiB5ZWFyczpcbiAqXG4gKiAgICB8IFllYXIgfCBgeWAgfCBgdWAgfFxuICogICAgfC0tLS0tLXwtLS0tLXwtLS0tLXxcbiAqICAgIHwgQUMgMSB8ICAgMSB8ICAgMSB8XG4gKiAgICB8IEJDIDEgfCAgIDEgfCAgIDAgfFxuICogICAgfCBCQyAyIHwgICAyIHwgIC0xIHxcbiAqXG4gKiAgICBBbHNvIGB5eWAgYWx3YXlzIHJldHVybnMgdGhlIGxhc3QgdHdvIGRpZ2l0cyBvZiBhIHllYXIsXG4gKiAgICB3aGlsZSBgdXVgIHBhZHMgc2luZ2xlIGRpZ2l0IHllYXJzIHRvIDIgY2hhcmFjdGVycyBhbmQgcmV0dXJucyBvdGhlciB5ZWFycyB1bmNoYW5nZWQ6XG4gKlxuICogICAgfCBZZWFyIHwgYHl5YCB8IGB1dWAgfFxuICogICAgfC0tLS0tLXwtLS0tLS18LS0tLS0tfFxuICogICAgfCAxICAgIHwgICAwMSB8ICAgMDEgfFxuICogICAgfCAxNCAgIHwgICAxNCB8ICAgMTQgfFxuICogICAgfCAzNzYgIHwgICA3NiB8ICAzNzYgfFxuICogICAgfCAxNDUzIHwgICA1MyB8IDE0NTMgfFxuICpcbiAqICAgIFRoZSBzYW1lIGRpZmZlcmVuY2UgaXMgdHJ1ZSBmb3IgbG9jYWwgYW5kIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFycyAoYFlgIGFuZCBgUmApLFxuICogICAgZXhjZXB0IGxvY2FsIHdlZWstbnVtYmVyaW5nIHllYXJzIGFyZSBkZXBlbmRlbnQgb24gYG9wdGlvbnMud2Vla1N0YXJ0c09uYFxuICogICAgYW5kIGBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZWAgKGNvbXBhcmUgW2dldElTT1dlZWtZZWFyXXtAbGluayBodHRwczovL2RhdGUtZm5zLm9yZy9kb2NzL2dldElTT1dlZWtZZWFyfVxuICogICAgYW5kIFtnZXRXZWVrWWVhcl17QGxpbmsgaHR0cHM6Ly9kYXRlLWZucy5vcmcvZG9jcy9nZXRXZWVrWWVhcn0pLlxuICpcbiAqIDYuIFNwZWNpZmljIG5vbi1sb2NhdGlvbiB0aW1lem9uZXMgYXJlIGN1cnJlbnRseSB1bmF2YWlsYWJsZSBpbiBgZGF0ZS1mbnNgLFxuICogICAgc28gcmlnaHQgbm93IHRoZXNlIHRva2VucyBmYWxsIGJhY2sgdG8gR01UIHRpbWV6b25lcy5cbiAqXG4gKiA3LiBUaGVzZSBwYXR0ZXJucyBhcmUgbm90IGluIHRoZSBVbmljb2RlIFRlY2huaWNhbCBTdGFuZGFyZCAjMzU6XG4gKiAgICAtIGBpYDogSVNPIGRheSBvZiB3ZWVrXG4gKiAgICAtIGBJYDogSVNPIHdlZWsgb2YgeWVhclxuICogICAgLSBgUmA6IElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gKiAgICAtIGB0YDogc2Vjb25kcyB0aW1lc3RhbXBcbiAqICAgIC0gYFRgOiBtaWxsaXNlY29uZHMgdGltZXN0YW1wXG4gKiAgICAtIGBvYDogb3JkaW5hbCBudW1iZXIgbW9kaWZpZXJcbiAqICAgIC0gYFBgOiBsb25nIGxvY2FsaXplZCBkYXRlXG4gKiAgICAtIGBwYDogbG9uZyBsb2NhbGl6ZWQgdGltZVxuICpcbiAqIDguIGBZWWAgYW5kIGBZWVlZYCB0b2tlbnMgcmVwcmVzZW50IHdlZWstbnVtYmVyaW5nIHllYXJzIGJ1dCB0aGV5IGFyZSBvZnRlbiBjb25mdXNlZCB3aXRoIHllYXJzLlxuICogICAgWW91IHNob3VsZCBlbmFibGUgYG9wdGlvbnMudXNlQWRkaXRpb25hbFdlZWtZZWFyVG9rZW5zYCB0byB1c2UgdGhlbS4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKlxuICogOS4gYERgIGFuZCBgRERgIHRva2VucyByZXByZXNlbnQgZGF5cyBvZiB0aGUgeWVhciBidXQgdGhleSBhcmUgb2Z0ZW4gY29uZnVzZWQgd2l0aCBkYXlzIG9mIHRoZSBtb250aC5cbiAqICAgIFlvdSBzaG91bGQgZW5hYmxlIGBvcHRpb25zLnVzZUFkZGl0aW9uYWxEYXlPZlllYXJUb2tlbnNgIHRvIHVzZSB0aGVtLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqXG4gKiBAcGFyYW0ge0RhdGV8TnVtYmVyfSBkYXRlIC0gdGhlIG9yaWdpbmFsIGRhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmb3JtYXQgLSB0aGUgc3RyaW5nIG9mIHRva2Vuc1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIGFuIG9iamVjdCB3aXRoIG9wdGlvbnMuXG4gKiBAcGFyYW0ge0xvY2FsZX0gW29wdGlvbnMubG9jYWxlPWRlZmF1bHRMb2NhbGVdIC0gdGhlIGxvY2FsZSBvYmplY3QuIFNlZSBbTG9jYWxlXXtAbGluayBodHRwczovL2RhdGUtZm5zLm9yZy9kb2NzL0xvY2FsZX1cbiAqIEBwYXJhbSB7MHwxfDJ8M3w0fDV8Nn0gW29wdGlvbnMud2Vla1N0YXJ0c09uPTBdIC0gdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgKDAgLSBTdW5kYXkpXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlPTFdIC0gdGhlIGRheSBvZiBKYW51YXJ5LCB3aGljaCBpc1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51c2VBZGRpdGlvbmFsV2Vla1llYXJUb2tlbnM9ZmFsc2VdIC0gaWYgdHJ1ZSwgYWxsb3dzIHVzYWdlIG9mIHRoZSB3ZWVrLW51bWJlcmluZyB5ZWFyIHRva2VucyBgWVlgIGFuZCBgWVlZWWA7XG4gKiAgIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51c2VBZGRpdGlvbmFsRGF5T2ZZZWFyVG9rZW5zPWZhbHNlXSAtIGlmIHRydWUsIGFsbG93cyB1c2FnZSBvZiB0aGUgZGF5IG9mIHllYXIgdG9rZW5zIGBEYCBhbmQgYEREYDtcbiAqICAgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKiBAcmV0dXJucyB7U3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDIgYXJndW1lbnRzIHJlcXVpcmVkXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgZGF0ZWAgbXVzdCBub3QgYmUgSW52YWxpZCBEYXRlXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgb3B0aW9ucy5sb2NhbGVgIG11c3QgY29udGFpbiBgbG9jYWxpemVgIHByb3BlcnR5XG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBgb3B0aW9ucy5sb2NhbGVgIG11c3QgY29udGFpbiBgZm9ybWF0TG9uZ2AgcHJvcGVydHlcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLndlZWtTdGFydHNPbmAgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDZcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZWAgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDdcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IHVzZSBgeXl5eWAgaW5zdGVhZCBvZiBgWVlZWWAgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGB5eWAgaW5zdGVhZCBvZiBgWVlgIGZvciBmb3JtYXR0aW5nIHllYXJzIHVzaW5nIFtmb3JtYXQgcHJvdmlkZWRdIHRvIHRoZSBpbnB1dCBbaW5wdXQgcHJvdmlkZWRdOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IHVzZSBgZGAgaW5zdGVhZCBvZiBgRGAgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGBkZGAgaW5zdGVhZCBvZiBgRERgIGZvciBmb3JtYXR0aW5nIGRheXMgb2YgdGhlIG1vbnRoIHVzaW5nIFtmb3JtYXQgcHJvdmlkZWRdIHRvIHRoZSBpbnB1dCBbaW5wdXQgcHJvdmlkZWRdOyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGZvcm1hdCBzdHJpbmcgY29udGFpbnMgYW4gdW5lc2NhcGVkIGxhdGluIGFscGhhYmV0IGNoYXJhY3RlclxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSZXByZXNlbnQgMTEgRmVicnVhcnkgMjAxNCBpbiBtaWRkbGUtZW5kaWFuIGZvcm1hdDpcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCAxLCAxMSksICdNTS9kZC95eXl5JylcbiAqIC8vPT4gJzAyLzExLzIwMTQnXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcHJlc2VudCAyIEp1bHkgMjAxNCBpbiBFc3BlcmFudG86XG4gKiBpbXBvcnQgeyBlb0xvY2FsZSB9IGZyb20gJ2RhdGUtZm5zL2xvY2FsZS9lbydcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCA2LCAyKSwgXCJkbyAnZGUnIE1NTU0geXl5eVwiLCB7XG4gKiAgIGxvY2FsZTogZW9Mb2NhbGVcbiAqIH0pXG4gKiAvLz0+ICcyLWEgZGUganVsaW8gMjAxNCdcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRXNjYXBlIHN0cmluZyBieSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVyczpcbiAqIGNvbnN0IHJlc3VsdCA9IGZvcm1hdChuZXcgRGF0ZSgyMDE0LCA2LCAyLCAxNSksIFwiaCAnbycnY2xvY2snXCIpXG4gKiAvLz0+IFwiMyBvJ2Nsb2NrXCJcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXQoZGlydHlEYXRlLCBkaXJ0eUZvcm1hdFN0ciwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX29wdGlvbnMkbG9jYWxlLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfb3B0aW9ucyRmaXJzdFdlZWtDb24sIF9vcHRpb25zJGxvY2FsZTIsIF9vcHRpb25zJGxvY2FsZTIkb3B0aSwgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyLCBfcmVmNSwgX3JlZjYsIF9yZWY3LCBfb3B0aW9ucyR3ZWVrU3RhcnRzT24sIF9vcHRpb25zJGxvY2FsZTMsIF9vcHRpb25zJGxvY2FsZTMkb3B0aSwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMywgX2RlZmF1bHRPcHRpb25zJGxvY2FsNDtcblxuICByZXF1aXJlZEFyZ3MoMiwgYXJndW1lbnRzKTtcbiAgdmFyIGZvcm1hdFN0ciA9IFN0cmluZyhkaXJ0eUZvcm1hdFN0cik7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciBsb2NhbGUgPSAoX3JlZiA9IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMubG9jYWxlKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyRsb2NhbGUgIT09IHZvaWQgMCA/IF9vcHRpb25zJGxvY2FsZSA6IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgIT09IG51bGwgJiYgX3JlZiAhPT0gdm9pZCAwID8gX3JlZiA6IGRlZmF1bHRMb2NhbGU7XG4gIHZhciBmaXJzdFdlZWtDb250YWluc0RhdGUgPSB0b0ludGVnZXIoKF9yZWYyID0gKF9yZWYzID0gKF9yZWY0ID0gKF9vcHRpb25zJGZpcnN0V2Vla0NvbiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9vcHRpb25zJGZpcnN0V2Vla0NvbiAhPT0gdm9pZCAwID8gX29wdGlvbnMkZmlyc3RXZWVrQ29uIDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMiA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUyID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMiRvcHRpID0gX29wdGlvbnMkbG9jYWxlMi5vcHRpb25zKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUyJG9wdGkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9vcHRpb25zJGxvY2FsZTIkb3B0aS5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWY0ICE9PSB2b2lkIDAgPyBfcmVmNCA6IGRlZmF1bHRPcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9IF9kZWZhdWx0T3B0aW9ucyRsb2NhbC5vcHRpb25zKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjIgIT09IHZvaWQgMCA/IF9yZWYyIDogMSk7IC8vIFRlc3QgaWYgd2Vla1N0YXJ0c09uIGlzIGJldHdlZW4gMSBhbmQgNyBfYW5kXyBpcyBub3QgTmFOXG5cbiAgaWYgKCEoZmlyc3RXZWVrQ29udGFpbnNEYXRlID49IDEgJiYgZmlyc3RXZWVrQ29udGFpbnNEYXRlIDw9IDcpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2ZpcnN0V2Vla0NvbnRhaW5zRGF0ZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNyBpbmNsdXNpdmVseScpO1xuICB9XG5cbiAgdmFyIHdlZWtTdGFydHNPbiA9IHRvSW50ZWdlcigoX3JlZjUgPSAoX3JlZjYgPSAoX3JlZjcgPSAoX29wdGlvbnMkd2Vla1N0YXJ0c09uID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX29wdGlvbnMkd2Vla1N0YXJ0c09uICE9PSB2b2lkIDAgPyBfb3B0aW9ucyR3ZWVrU3RhcnRzT24gOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUzID0gb3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZTMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUzJG9wdGkgPSBfb3B0aW9ucyRsb2NhbGUzLm9wdGlvbnMpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZTMkb3B0aSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX29wdGlvbnMkbG9jYWxlMyRvcHRpLndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX3JlZjcgIT09IHZvaWQgMCA/IF9yZWY3IDogZGVmYXVsdE9wdGlvbnMud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmNiAhPT0gdm9pZCAwID8gX3JlZjYgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsMyA9IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDQgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwzLm9wdGlvbnMpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDQud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmNSAhPT0gdm9pZCAwID8gX3JlZjUgOiAwKTsgLy8gVGVzdCBpZiB3ZWVrU3RhcnRzT24gaXMgYmV0d2VlbiAwIGFuZCA2IF9hbmRfIGlzIG5vdCBOYU5cblxuICBpZiAoISh3ZWVrU3RhcnRzT24gPj0gMCAmJiB3ZWVrU3RhcnRzT24gPD0gNikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignd2Vla1N0YXJ0c09uIG11c3QgYmUgYmV0d2VlbiAwIGFuZCA2IGluY2x1c2l2ZWx5Jyk7XG4gIH1cblxuICBpZiAoIWxvY2FsZS5sb2NhbGl6ZSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsb2NhbGUgbXVzdCBjb250YWluIGxvY2FsaXplIHByb3BlcnR5Jyk7XG4gIH1cblxuICBpZiAoIWxvY2FsZS5mb3JtYXRMb25nKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xvY2FsZSBtdXN0IGNvbnRhaW4gZm9ybWF0TG9uZyBwcm9wZXJ0eScpO1xuICB9XG5cbiAgdmFyIG9yaWdpbmFsRGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuXG4gIGlmICghaXNWYWxpZChvcmlnaW5hbERhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdGltZSB2YWx1ZScpO1xuICB9IC8vIENvbnZlcnQgdGhlIGRhdGUgaW4gc3lzdGVtIHRpbWV6b25lIHRvIHRoZSBzYW1lIGRhdGUgaW4gVVRDKzAwOjAwIHRpbWV6b25lLlxuICAvLyBUaGlzIGVuc3VyZXMgdGhhdCB3aGVuIFVUQyBmdW5jdGlvbnMgd2lsbCBiZSBpbXBsZW1lbnRlZCwgbG9jYWxlcyB3aWxsIGJlIGNvbXBhdGlibGUgd2l0aCB0aGVtLlxuICAvLyBTZWUgYW4gaXNzdWUgYWJvdXQgVVRDIGZ1bmN0aW9uczogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2lzc3Vlcy8zNzZcblxuXG4gIHZhciB0aW1lem9uZU9mZnNldCA9IGdldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMob3JpZ2luYWxEYXRlKTtcbiAgdmFyIHV0Y0RhdGUgPSBzdWJNaWxsaXNlY29uZHMob3JpZ2luYWxEYXRlLCB0aW1lem9uZU9mZnNldCk7XG4gIHZhciBmb3JtYXR0ZXJPcHRpb25zID0ge1xuICAgIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZTogZmlyc3RXZWVrQ29udGFpbnNEYXRlLFxuICAgIHdlZWtTdGFydHNPbjogd2Vla1N0YXJ0c09uLFxuICAgIGxvY2FsZTogbG9jYWxlLFxuICAgIF9vcmlnaW5hbERhdGU6IG9yaWdpbmFsRGF0ZVxuICB9O1xuICB2YXIgcmVzdWx0ID0gZm9ybWF0U3RyLm1hdGNoKGxvbmdGb3JtYXR0aW5nVG9rZW5zUmVnRXhwKS5tYXAoZnVuY3Rpb24gKHN1YnN0cmluZykge1xuICAgIHZhciBmaXJzdENoYXJhY3RlciA9IHN1YnN0cmluZ1swXTtcblxuICAgIGlmIChmaXJzdENoYXJhY3RlciA9PT0gJ3AnIHx8IGZpcnN0Q2hhcmFjdGVyID09PSAnUCcpIHtcbiAgICAgIHZhciBsb25nRm9ybWF0dGVyID0gbG9uZ0Zvcm1hdHRlcnNbZmlyc3RDaGFyYWN0ZXJdO1xuICAgICAgcmV0dXJuIGxvbmdGb3JtYXR0ZXIoc3Vic3RyaW5nLCBsb2NhbGUuZm9ybWF0TG9uZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnN0cmluZztcbiAgfSkuam9pbignJykubWF0Y2goZm9ybWF0dGluZ1Rva2Vuc1JlZ0V4cCkubWFwKGZ1bmN0aW9uIChzdWJzdHJpbmcpIHtcbiAgICAvLyBSZXBsYWNlIHR3byBzaW5nbGUgcXVvdGUgY2hhcmFjdGVycyB3aXRoIG9uZSBzaW5nbGUgcXVvdGUgY2hhcmFjdGVyXG4gICAgaWYgKHN1YnN0cmluZyA9PT0gXCInJ1wiKSB7XG4gICAgICByZXR1cm4gXCInXCI7XG4gICAgfVxuXG4gICAgdmFyIGZpcnN0Q2hhcmFjdGVyID0gc3Vic3RyaW5nWzBdO1xuXG4gICAgaWYgKGZpcnN0Q2hhcmFjdGVyID09PSBcIidcIikge1xuICAgICAgcmV0dXJuIGNsZWFuRXNjYXBlZFN0cmluZyhzdWJzdHJpbmcpO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0ZXIgPSBmb3JtYXR0ZXJzW2ZpcnN0Q2hhcmFjdGVyXTtcblxuICAgIGlmIChmb3JtYXR0ZXIpIHtcbiAgICAgIGlmICghKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMudXNlQWRkaXRpb25hbFdlZWtZZWFyVG9rZW5zKSAmJiBpc1Byb3RlY3RlZFdlZWtZZWFyVG9rZW4oc3Vic3RyaW5nKSkge1xuICAgICAgICB0aHJvd1Byb3RlY3RlZEVycm9yKHN1YnN0cmluZywgZGlydHlGb3JtYXRTdHIsIFN0cmluZyhkaXJ0eURhdGUpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgJiYgb3B0aW9ucy51c2VBZGRpdGlvbmFsRGF5T2ZZZWFyVG9rZW5zKSAmJiBpc1Byb3RlY3RlZERheU9mWWVhclRva2VuKHN1YnN0cmluZykpIHtcbiAgICAgICAgdGhyb3dQcm90ZWN0ZWRFcnJvcihzdWJzdHJpbmcsIGRpcnR5Rm9ybWF0U3RyLCBTdHJpbmcoZGlydHlEYXRlKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3JtYXR0ZXIodXRjRGF0ZSwgc3Vic3RyaW5nLCBsb2NhbGUubG9jYWxpemUsIGZvcm1hdHRlck9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChmaXJzdENoYXJhY3Rlci5tYXRjaCh1bmVzY2FwZWRMYXRpbkNoYXJhY3RlclJlZ0V4cCkpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdGb3JtYXQgc3RyaW5nIGNvbnRhaW5zIGFuIHVuZXNjYXBlZCBsYXRpbiBhbHBoYWJldCBjaGFyYWN0ZXIgYCcgKyBmaXJzdENoYXJhY3RlciArICdgJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnN0cmluZztcbiAgfSkuam9pbignJyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNsZWFuRXNjYXBlZFN0cmluZyhpbnB1dCkge1xuICB2YXIgbWF0Y2hlZCA9IGlucHV0Lm1hdGNoKGVzY2FwZWRTdHJpbmdSZWdFeHApO1xuXG4gIGlmICghbWF0Y2hlZCkge1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVkWzFdLnJlcGxhY2UoZG91YmxlUXVvdGVSZWdFeHAsIFwiJ1wiKTtcbn0iLCAiLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5IGJ5IGBzY3JpcHRzL2J1aWxkL2luZGljZXMudHNgLiBQbGVhc2UsIGRvbid0IGNoYW5nZSBpdC5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWRkIH0gZnJvbSBcIi4vYWRkL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFkZEJ1c2luZXNzRGF5cyB9IGZyb20gXCIuL2FkZEJ1c2luZXNzRGF5cy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhZGREYXlzIH0gZnJvbSBcIi4vYWRkRGF5cy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhZGRIb3VycyB9IGZyb20gXCIuL2FkZEhvdXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFkZElTT1dlZWtZZWFycyB9IGZyb20gXCIuL2FkZElTT1dlZWtZZWFycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhZGRNaWxsaXNlY29uZHMgfSBmcm9tIFwiLi9hZGRNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWRkTWludXRlcyB9IGZyb20gXCIuL2FkZE1pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWRkTW9udGhzIH0gZnJvbSBcIi4vYWRkTW9udGhzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFkZFF1YXJ0ZXJzIH0gZnJvbSBcIi4vYWRkUXVhcnRlcnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWRkU2Vjb25kcyB9IGZyb20gXCIuL2FkZFNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYWRkV2Vla3MgfSBmcm9tIFwiLi9hZGRXZWVrcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhZGRZZWFycyB9IGZyb20gXCIuL2FkZFllYXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFyZUludGVydmFsc092ZXJsYXBwaW5nIH0gZnJvbSBcIi4vYXJlSW50ZXJ2YWxzT3ZlcmxhcHBpbmcvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY2xhbXAgfSBmcm9tIFwiLi9jbGFtcC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbG9zZXN0SW5kZXhUbyB9IGZyb20gXCIuL2Nsb3Nlc3RJbmRleFRvL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNsb3Nlc3RUbyB9IGZyb20gXCIuL2Nsb3Nlc3RUby9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb21wYXJlQXNjIH0gZnJvbSBcIi4vY29tcGFyZUFzYy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb21wYXJlRGVzYyB9IGZyb20gXCIuL2NvbXBhcmVEZXNjL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRheXNUb1dlZWtzIH0gZnJvbSBcIi4vZGF5c1RvV2Vla3MvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluQnVzaW5lc3NEYXlzIH0gZnJvbSBcIi4vZGlmZmVyZW5jZUluQnVzaW5lc3NEYXlzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbkNhbGVuZGFyRGF5cyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkNhbGVuZGFyRGF5cy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkaWZmZXJlbmNlSW5DYWxlbmRhcklTT1dlZWtZZWFycyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkNhbGVuZGFySVNPV2Vla1llYXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbkNhbGVuZGFySVNPV2Vla3MgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5DYWxlbmRhcklTT1dlZWtzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbkNhbGVuZGFyTW9udGhzIH0gZnJvbSBcIi4vZGlmZmVyZW5jZUluQ2FsZW5kYXJNb250aHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluQ2FsZW5kYXJRdWFydGVycyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkNhbGVuZGFyUXVhcnRlcnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluQ2FsZW5kYXJXZWVrcyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkNhbGVuZGFyV2Vla3MvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluQ2FsZW5kYXJZZWFycyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkNhbGVuZGFyWWVhcnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluRGF5cyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbkRheXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluSG91cnMgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5Ib3Vycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkaWZmZXJlbmNlSW5JU09XZWVrWWVhcnMgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5JU09XZWVrWWVhcnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluTWlsbGlzZWNvbmRzIH0gZnJvbSBcIi4vZGlmZmVyZW5jZUluTWlsbGlzZWNvbmRzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbk1pbnV0ZXMgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5NaW51dGVzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbk1vbnRocyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJbk1vbnRocy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkaWZmZXJlbmNlSW5RdWFydGVycyB9IGZyb20gXCIuL2RpZmZlcmVuY2VJblF1YXJ0ZXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJblNlY29uZHMgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5TZWNvbmRzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGRpZmZlcmVuY2VJbldlZWtzIH0gZnJvbSBcIi4vZGlmZmVyZW5jZUluV2Vla3MvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGlmZmVyZW5jZUluWWVhcnMgfSBmcm9tIFwiLi9kaWZmZXJlbmNlSW5ZZWFycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlYWNoRGF5T2ZJbnRlcnZhbCB9IGZyb20gXCIuL2VhY2hEYXlPZkludGVydmFsL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVhY2hIb3VyT2ZJbnRlcnZhbCB9IGZyb20gXCIuL2VhY2hIb3VyT2ZJbnRlcnZhbC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlYWNoTWludXRlT2ZJbnRlcnZhbCB9IGZyb20gXCIuL2VhY2hNaW51dGVPZkludGVydmFsL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVhY2hNb250aE9mSW50ZXJ2YWwgfSBmcm9tIFwiLi9lYWNoTW9udGhPZkludGVydmFsL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVhY2hRdWFydGVyT2ZJbnRlcnZhbCB9IGZyb20gXCIuL2VhY2hRdWFydGVyT2ZJbnRlcnZhbC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlYWNoV2Vla09mSW50ZXJ2YWwgfSBmcm9tIFwiLi9lYWNoV2Vla09mSW50ZXJ2YWwvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZWFjaFdlZWtlbmRPZkludGVydmFsIH0gZnJvbSBcIi4vZWFjaFdlZWtlbmRPZkludGVydmFsL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVhY2hXZWVrZW5kT2ZNb250aCB9IGZyb20gXCIuL2VhY2hXZWVrZW5kT2ZNb250aC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlYWNoV2Vla2VuZE9mWWVhciB9IGZyb20gXCIuL2VhY2hXZWVrZW5kT2ZZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVhY2hZZWFyT2ZJbnRlcnZhbCB9IGZyb20gXCIuL2VhY2hZZWFyT2ZJbnRlcnZhbC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbmRPZkRheSB9IGZyb20gXCIuL2VuZE9mRGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mRGVjYWRlIH0gZnJvbSBcIi4vZW5kT2ZEZWNhZGUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZW5kT2ZIb3VyIH0gZnJvbSBcIi4vZW5kT2ZIb3VyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mSVNPV2VlayB9IGZyb20gXCIuL2VuZE9mSVNPV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbmRPZklTT1dlZWtZZWFyIH0gZnJvbSBcIi4vZW5kT2ZJU09XZWVrWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbmRPZk1pbnV0ZSB9IGZyb20gXCIuL2VuZE9mTWludXRlL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mTW9udGggfSBmcm9tIFwiLi9lbmRPZk1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mUXVhcnRlciB9IGZyb20gXCIuL2VuZE9mUXVhcnRlci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbmRPZlNlY29uZCB9IGZyb20gXCIuL2VuZE9mU2Vjb25kL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mVG9kYXkgfSBmcm9tIFwiLi9lbmRPZlRvZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mVG9tb3Jyb3cgfSBmcm9tIFwiLi9lbmRPZlRvbW9ycm93L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGVuZE9mV2VlayB9IGZyb20gXCIuL2VuZE9mV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbmRPZlllYXIgfSBmcm9tIFwiLi9lbmRPZlllYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZW5kT2ZZZXN0ZXJkYXkgfSBmcm9tIFwiLi9lbmRPZlllc3RlcmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBmb3JtYXQgfSBmcm9tIFwiLi9mb3JtYXQvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZm9ybWF0RGlzdGFuY2UgfSBmcm9tIFwiLi9mb3JtYXREaXN0YW5jZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBmb3JtYXREaXN0YW5jZVN0cmljdCB9IGZyb20gXCIuL2Zvcm1hdERpc3RhbmNlU3RyaWN0L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZvcm1hdERpc3RhbmNlVG9Ob3cgfSBmcm9tIFwiLi9mb3JtYXREaXN0YW5jZVRvTm93L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZvcm1hdERpc3RhbmNlVG9Ob3dTdHJpY3QgfSBmcm9tIFwiLi9mb3JtYXREaXN0YW5jZVRvTm93U3RyaWN0L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZvcm1hdER1cmF0aW9uIH0gZnJvbSBcIi4vZm9ybWF0RHVyYXRpb24vaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZm9ybWF0SVNPIH0gZnJvbSBcIi4vZm9ybWF0SVNPL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZvcm1hdElTTzkwNzUgfSBmcm9tIFwiLi9mb3JtYXRJU085MDc1L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGZvcm1hdElTT0R1cmF0aW9uIH0gZnJvbSBcIi4vZm9ybWF0SVNPRHVyYXRpb24vaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZm9ybWF0UkZDMzMzOSB9IGZyb20gXCIuL2Zvcm1hdFJGQzMzMzkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZm9ybWF0UkZDNzIzMSB9IGZyb20gXCIuL2Zvcm1hdFJGQzcyMzEvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZm9ybWF0UmVsYXRpdmUgfSBmcm9tIFwiLi9mb3JtYXRSZWxhdGl2ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBmcm9tVW5peFRpbWUgfSBmcm9tIFwiLi9mcm9tVW5peFRpbWUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0RGF0ZSB9IGZyb20gXCIuL2dldERhdGUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0RGF5IH0gZnJvbSBcIi4vZ2V0RGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldERheU9mWWVhciB9IGZyb20gXCIuL2dldERheU9mWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXREYXlzSW5Nb250aCB9IGZyb20gXCIuL2dldERheXNJbk1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldERheXNJblllYXIgfSBmcm9tIFwiLi9nZXREYXlzSW5ZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldERlY2FkZSB9IGZyb20gXCIuL2dldERlY2FkZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gXCIuL2dldERlZmF1bHRPcHRpb25zL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldEhvdXJzIH0gZnJvbSBcIi4vZ2V0SG91cnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0SVNPRGF5IH0gZnJvbSBcIi4vZ2V0SVNPRGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldElTT1dlZWsgfSBmcm9tIFwiLi9nZXRJU09XZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldElTT1dlZWtZZWFyIH0gZnJvbSBcIi4vZ2V0SVNPV2Vla1llYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0SVNPV2Vla3NJblllYXIgfSBmcm9tIFwiLi9nZXRJU09XZWVrc0luWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXRNaWxsaXNlY29uZHMgfSBmcm9tIFwiLi9nZXRNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0TWludXRlcyB9IGZyb20gXCIuL2dldE1pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0TW9udGggfSBmcm9tIFwiLi9nZXRNb250aC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXRPdmVybGFwcGluZ0RheXNJbkludGVydmFscyB9IGZyb20gXCIuL2dldE92ZXJsYXBwaW5nRGF5c0luSW50ZXJ2YWxzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldFF1YXJ0ZXIgfSBmcm9tIFwiLi9nZXRRdWFydGVyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldFNlY29uZHMgfSBmcm9tIFwiLi9nZXRTZWNvbmRzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldFRpbWUgfSBmcm9tIFwiLi9nZXRUaW1lL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldFVuaXhUaW1lIH0gZnJvbSBcIi4vZ2V0VW5peFRpbWUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0V2VlayB9IGZyb20gXCIuL2dldFdlZWsvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0V2Vla09mTW9udGggfSBmcm9tIFwiLi9nZXRXZWVrT2ZNb250aC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXRXZWVrWWVhciB9IGZyb20gXCIuL2dldFdlZWtZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGdldFdlZWtzSW5Nb250aCB9IGZyb20gXCIuL2dldFdlZWtzSW5Nb250aC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBnZXRZZWFyIH0gZnJvbSBcIi4vZ2V0WWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBob3Vyc1RvTWlsbGlzZWNvbmRzIH0gZnJvbSBcIi4vaG91cnNUb01pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBob3Vyc1RvTWludXRlcyB9IGZyb20gXCIuL2hvdXJzVG9NaW51dGVzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGhvdXJzVG9TZWNvbmRzIH0gZnJvbSBcIi4vaG91cnNUb1NlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaW50ZXJ2YWxUb0R1cmF0aW9uIH0gZnJvbSBcIi4vaW50ZXJ2YWxUb0R1cmF0aW9uL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGludGxGb3JtYXQgfSBmcm9tIFwiLi9pbnRsRm9ybWF0L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGludGxGb3JtYXREaXN0YW5jZSB9IGZyb20gXCIuL2ludGxGb3JtYXREaXN0YW5jZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0FmdGVyIH0gZnJvbSBcIi4vaXNBZnRlci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0JlZm9yZSB9IGZyb20gXCIuL2lzQmVmb3JlL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzRGF0ZSB9IGZyb20gXCIuL2lzRGF0ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0VxdWFsIH0gZnJvbSBcIi4vaXNFcXVhbC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0V4aXN0cyB9IGZyb20gXCIuL2lzRXhpc3RzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzRmlyc3REYXlPZk1vbnRoIH0gZnJvbSBcIi4vaXNGaXJzdERheU9mTW9udGgvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNGcmlkYXkgfSBmcm9tIFwiLi9pc0ZyaWRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc0Z1dHVyZSB9IGZyb20gXCIuL2lzRnV0dXJlL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzTGFzdERheU9mTW9udGggfSBmcm9tIFwiLi9pc0xhc3REYXlPZk1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzTGVhcFllYXIgfSBmcm9tIFwiLi9pc0xlYXBZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzTWF0Y2ggfSBmcm9tIFwiLi9pc01hdGNoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzTW9uZGF5IH0gZnJvbSBcIi4vaXNNb25kYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNQYXN0IH0gZnJvbSBcIi4vaXNQYXN0L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzU2FtZURheSB9IGZyb20gXCIuL2lzU2FtZURheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVIb3VyIH0gZnJvbSBcIi4vaXNTYW1lSG91ci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVJU09XZWVrIH0gZnJvbSBcIi4vaXNTYW1lSVNPV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVJU09XZWVrWWVhciB9IGZyb20gXCIuL2lzU2FtZUlTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzU2FtZU1pbnV0ZSB9IGZyb20gXCIuL2lzU2FtZU1pbnV0ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVNb250aCB9IGZyb20gXCIuL2lzU2FtZU1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzU2FtZVF1YXJ0ZXIgfSBmcm9tIFwiLi9pc1NhbWVRdWFydGVyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzU2FtZVNlY29uZCB9IGZyb20gXCIuL2lzU2FtZVNlY29uZC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVXZWVrIH0gZnJvbSBcIi4vaXNTYW1lV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhbWVZZWFyIH0gZnJvbSBcIi4vaXNTYW1lWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1NhdHVyZGF5IH0gZnJvbSBcIi4vaXNTYXR1cmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1N1bmRheSB9IGZyb20gXCIuL2lzU3VuZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVGhpc0hvdXIgfSBmcm9tIFwiLi9pc1RoaXNIb3VyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVGhpc0lTT1dlZWsgfSBmcm9tIFwiLi9pc1RoaXNJU09XZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVGhpc01pbnV0ZSB9IGZyb20gXCIuL2lzVGhpc01pbnV0ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RoaXNNb250aCB9IGZyb20gXCIuL2lzVGhpc01vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVGhpc1F1YXJ0ZXIgfSBmcm9tIFwiLi9pc1RoaXNRdWFydGVyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGlzVGhpc1NlY29uZCB9IGZyb20gXCIuL2lzVGhpc1NlY29uZC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RoaXNXZWVrIH0gZnJvbSBcIi4vaXNUaGlzV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RoaXNZZWFyIH0gZnJvbSBcIi4vaXNUaGlzWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RodXJzZGF5IH0gZnJvbSBcIi4vaXNUaHVyc2RheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RvZGF5IH0gZnJvbSBcIi4vaXNUb2RheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1RvbW9ycm93IH0gZnJvbSBcIi4vaXNUb21vcnJvdy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1R1ZXNkYXkgfSBmcm9tIFwiLi9pc1R1ZXNkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNWYWxpZCB9IGZyb20gXCIuL2lzVmFsaWQvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNXZWRuZXNkYXkgfSBmcm9tIFwiLi9pc1dlZG5lc2RheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpc1dlZWtlbmQgfSBmcm9tIFwiLi9pc1dlZWtlbmQvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNXaXRoaW5JbnRlcnZhbCB9IGZyb20gXCIuL2lzV2l0aGluSW50ZXJ2YWwvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgaXNZZXN0ZXJkYXkgfSBmcm9tIFwiLi9pc1llc3RlcmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBsYXN0RGF5T2ZEZWNhZGUgfSBmcm9tIFwiLi9sYXN0RGF5T2ZEZWNhZGUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbGFzdERheU9mSVNPV2VlayB9IGZyb20gXCIuL2xhc3REYXlPZklTT1dlZWsvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbGFzdERheU9mSVNPV2Vla1llYXIgfSBmcm9tIFwiLi9sYXN0RGF5T2ZJU09XZWVrWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBsYXN0RGF5T2ZNb250aCB9IGZyb20gXCIuL2xhc3REYXlPZk1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxhc3REYXlPZlF1YXJ0ZXIgfSBmcm9tIFwiLi9sYXN0RGF5T2ZRdWFydGVyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxhc3REYXlPZldlZWsgfSBmcm9tIFwiLi9sYXN0RGF5T2ZXZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxhc3REYXlPZlllYXIgfSBmcm9tIFwiLi9sYXN0RGF5T2ZZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxpZ2h0Rm9ybWF0IH0gZnJvbSBcIi4vbGlnaHRGb3JtYXQvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWF4IH0gZnJvbSBcIi4vbWF4L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1pbGxpc2Vjb25kcyB9IGZyb20gXCIuL21pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtaWxsaXNlY29uZHNUb0hvdXJzIH0gZnJvbSBcIi4vbWlsbGlzZWNvbmRzVG9Ib3Vycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtaWxsaXNlY29uZHNUb01pbnV0ZXMgfSBmcm9tIFwiLi9taWxsaXNlY29uZHNUb01pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWlsbGlzZWNvbmRzVG9TZWNvbmRzIH0gZnJvbSBcIi4vbWlsbGlzZWNvbmRzVG9TZWNvbmRzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1pbiB9IGZyb20gXCIuL21pbi9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtaW51dGVzVG9Ib3VycyB9IGZyb20gXCIuL21pbnV0ZXNUb0hvdXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG1pbnV0ZXNUb01pbGxpc2Vjb25kcyB9IGZyb20gXCIuL21pbnV0ZXNUb01pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtaW51dGVzVG9TZWNvbmRzIH0gZnJvbSBcIi4vbWludXRlc1RvU2Vjb25kcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtb250aHNUb1F1YXJ0ZXJzIH0gZnJvbSBcIi4vbW9udGhzVG9RdWFydGVycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtb250aHNUb1llYXJzIH0gZnJvbSBcIi4vbW9udGhzVG9ZZWFycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBuZXh0RGF5IH0gZnJvbSBcIi4vbmV4dERheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBuZXh0RnJpZGF5IH0gZnJvbSBcIi4vbmV4dEZyaWRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBuZXh0TW9uZGF5IH0gZnJvbSBcIi4vbmV4dE1vbmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBuZXh0U2F0dXJkYXkgfSBmcm9tIFwiLi9uZXh0U2F0dXJkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbmV4dFN1bmRheSB9IGZyb20gXCIuL25leHRTdW5kYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbmV4dFRodXJzZGF5IH0gZnJvbSBcIi4vbmV4dFRodXJzZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG5leHRUdWVzZGF5IH0gZnJvbSBcIi4vbmV4dFR1ZXNkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbmV4dFdlZG5lc2RheSB9IGZyb20gXCIuL25leHRXZWRuZXNkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcGFyc2UgfSBmcm9tIFwiLi9wYXJzZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwYXJzZUlTTyB9IGZyb20gXCIuL3BhcnNlSVNPL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnNlSlNPTiB9IGZyb20gXCIuL3BhcnNlSlNPTi9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwcmV2aW91c0RheSB9IGZyb20gXCIuL3ByZXZpb3VzRGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHByZXZpb3VzRnJpZGF5IH0gZnJvbSBcIi4vcHJldmlvdXNGcmlkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcHJldmlvdXNNb25kYXkgfSBmcm9tIFwiLi9wcmV2aW91c01vbmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwcmV2aW91c1NhdHVyZGF5IH0gZnJvbSBcIi4vcHJldmlvdXNTYXR1cmRheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwcmV2aW91c1N1bmRheSB9IGZyb20gXCIuL3ByZXZpb3VzU3VuZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHByZXZpb3VzVGh1cnNkYXkgfSBmcm9tIFwiLi9wcmV2aW91c1RodXJzZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHByZXZpb3VzVHVlc2RheSB9IGZyb20gXCIuL3ByZXZpb3VzVHVlc2RheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwcmV2aW91c1dlZG5lc2RheSB9IGZyb20gXCIuL3ByZXZpb3VzV2VkbmVzZGF5L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHF1YXJ0ZXJzVG9Nb250aHMgfSBmcm9tIFwiLi9xdWFydGVyc1RvTW9udGhzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHF1YXJ0ZXJzVG9ZZWFycyB9IGZyb20gXCIuL3F1YXJ0ZXJzVG9ZZWFycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyByb3VuZFRvTmVhcmVzdE1pbnV0ZXMgfSBmcm9tIFwiLi9yb3VuZFRvTmVhcmVzdE1pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2Vjb25kc1RvSG91cnMgfSBmcm9tIFwiLi9zZWNvbmRzVG9Ib3Vycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZWNvbmRzVG9NaWxsaXNlY29uZHMgfSBmcm9tIFwiLi9zZWNvbmRzVG9NaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2Vjb25kc1RvTWludXRlcyB9IGZyb20gXCIuL3NlY29uZHNUb01pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2V0IH0gZnJvbSBcIi4vc2V0L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldERhdGUgfSBmcm9tIFwiLi9zZXREYXRlL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldERheSB9IGZyb20gXCIuL3NldERheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXREYXlPZlllYXIgfSBmcm9tIFwiLi9zZXREYXlPZlllYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiLi9zZXREZWZhdWx0T3B0aW9ucy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXRIb3VycyB9IGZyb20gXCIuL3NldEhvdXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldElTT0RheSB9IGZyb20gXCIuL3NldElTT0RheS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXRJU09XZWVrIH0gZnJvbSBcIi4vc2V0SVNPV2Vlay9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXRJU09XZWVrWWVhciB9IGZyb20gXCIuL3NldElTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldE1pbGxpc2Vjb25kcyB9IGZyb20gXCIuL3NldE1pbGxpc2Vjb25kcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXRNaW51dGVzIH0gZnJvbSBcIi4vc2V0TWludXRlcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXRNb250aCB9IGZyb20gXCIuL3NldE1vbnRoL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldFF1YXJ0ZXIgfSBmcm9tIFwiLi9zZXRRdWFydGVyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldFNlY29uZHMgfSBmcm9tIFwiLi9zZXRTZWNvbmRzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldFdlZWsgfSBmcm9tIFwiLi9zZXRXZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNldFdlZWtZZWFyIH0gZnJvbSBcIi4vc2V0V2Vla1llYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2V0WWVhciB9IGZyb20gXCIuL3NldFllYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZkRheSB9IGZyb20gXCIuL3N0YXJ0T2ZEYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZkRlY2FkZSB9IGZyb20gXCIuL3N0YXJ0T2ZEZWNhZGUvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZkhvdXIgfSBmcm9tIFwiLi9zdGFydE9mSG91ci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFydE9mSVNPV2VlayB9IGZyb20gXCIuL3N0YXJ0T2ZJU09XZWVrL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0YXJ0T2ZJU09XZWVrWWVhciB9IGZyb20gXCIuL3N0YXJ0T2ZJU09XZWVrWWVhci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFydE9mTWludXRlIH0gZnJvbSBcIi4vc3RhcnRPZk1pbnV0ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFydE9mTW9udGggfSBmcm9tIFwiLi9zdGFydE9mTW9udGgvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZlF1YXJ0ZXIgfSBmcm9tIFwiLi9zdGFydE9mUXVhcnRlci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFydE9mU2Vjb25kIH0gZnJvbSBcIi4vc3RhcnRPZlNlY29uZC9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFydE9mVG9kYXkgfSBmcm9tIFwiLi9zdGFydE9mVG9kYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZlRvbW9ycm93IH0gZnJvbSBcIi4vc3RhcnRPZlRvbW9ycm93L2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0YXJ0T2ZXZWVrIH0gZnJvbSBcIi4vc3RhcnRPZldlZWsvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZldlZWtZZWFyIH0gZnJvbSBcIi4vc3RhcnRPZldlZWtZZWFyL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0YXJ0T2ZZZWFyIH0gZnJvbSBcIi4vc3RhcnRPZlllYXIvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRPZlllc3RlcmRheSB9IGZyb20gXCIuL3N0YXJ0T2ZZZXN0ZXJkYXkvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3ViIH0gZnJvbSBcIi4vc3ViL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN1YkJ1c2luZXNzRGF5cyB9IGZyb20gXCIuL3N1YkJ1c2luZXNzRGF5cy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdWJEYXlzIH0gZnJvbSBcIi4vc3ViRGF5cy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdWJIb3VycyB9IGZyb20gXCIuL3N1YkhvdXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN1YklTT1dlZWtZZWFycyB9IGZyb20gXCIuL3N1YklTT1dlZWtZZWFycy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdWJNaWxsaXNlY29uZHMgfSBmcm9tIFwiLi9zdWJNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3ViTWludXRlcyB9IGZyb20gXCIuL3N1Yk1pbnV0ZXMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3ViTW9udGhzIH0gZnJvbSBcIi4vc3ViTW9udGhzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN1YlF1YXJ0ZXJzIH0gZnJvbSBcIi4vc3ViUXVhcnRlcnMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3ViU2Vjb25kcyB9IGZyb20gXCIuL3N1YlNlY29uZHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3ViV2Vla3MgfSBmcm9tIFwiLi9zdWJXZWVrcy9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdWJZZWFycyB9IGZyb20gXCIuL3N1YlllYXJzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHRvRGF0ZSB9IGZyb20gXCIuL3RvRGF0ZS9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3ZWVrc1RvRGF5cyB9IGZyb20gXCIuL3dlZWtzVG9EYXlzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHllYXJzVG9Nb250aHMgfSBmcm9tIFwiLi95ZWFyc1RvTW9udGhzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHllYXJzVG9RdWFydGVycyB9IGZyb20gXCIuL3llYXJzVG9RdWFydGVycy9pbmRleC5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY29uc3RhbnRzL2luZGV4LmpzXCI7IiwgImltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4uL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSBcImRhdGUtZm5zXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi9QYXBlckVsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIFNhdmVFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkYXRhc3RvcmU6IERyYXdNaW5lO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcblxuICAgIHB1YmxpYyBpbml0KGRhdGFzdG9yZTogRHJhd01pbmUsIHBhcGVyOiBQYXBlckVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5kYXRhc3RvcmUgPSBkYXRhc3RvcmU7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5lbGUgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3Qtc2F2ZVwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5kYXRhc3RvcmUuZ2V0RHJhdygpLmxlbmd0aCgpID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhc3RvcmUuc2F2ZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRhc3RvcmUuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuY2xlYXIoKTtcbiAgICAgICAgICAgIFUudG9hc3Qubm9ybWFsKFwic2F2ZWRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChcIm5vdCBzYXZlZCAobm8gZHJhdylcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZUxhYmVsKCkge1xuICAgICAgICBjb25zdCBlbGU6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGFiZWwtc2F2ZVwiKTtcbiAgICAgICAgZWxlLmlubmVyVGV4dCA9IGZvcm1hdChuZXcgRGF0ZSgpLCAna2s6bW06c3MnKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd090aGVyIH0gZnJvbSBcIi4uL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4vUGVuQWN0aW9uXCI7XG5pbXBvcnQgeyBTdHJva2UsIFBvaW50LCBEcmF3IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0IHsgRHJhd1N0YXR1cyB9IGZyb20gXCIuLi9kYXRhL0RyYXdTdGF0dXNcIjtcbmltcG9ydCB7IFNhdmVFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvU2F2ZUVsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIExvYWRBY3Rpb24ge1xuICAgIHByaXZhdGUgcGFwZXJzOiB7XG4gICAgICAgIG1pbmU6IFBhcGVyRWxlbWVudCxcbiAgICAgICAgb3RoZXI6IFBhcGVyRWxlbWVudFxuICAgIH07XG4gICAgcHJpdmF0ZSBkYXRhc3RvcmVzOiB7XG4gICAgICAgIG1pbmU6IERyYXdNaW5lLFxuICAgICAgICBvdGhlcjogRHJhd090aGVyXG4gICAgfTtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuICAgIHByaXZhdGUgZHJhd3N0YXR1czogRHJhd1N0YXR1cztcbiAgICBwdWJsaWMgaW5pdChwYXBlcm1pbmU6IFBhcGVyRWxlbWVudCwgcGFwZXJvdGhlcjogUGFwZXJFbGVtZW50LCBkcmF3bWluZTogRHJhd01pbmUsIGRyYXdvdGhlcjogRHJhd090aGVyLCBwZW46IFBlbkFjdGlvbiwgZHJhd3N0YXR1czogRHJhd1N0YXR1cykge1xuICAgICAgICB0aGlzLnBhcGVycyA9IHtcbiAgICAgICAgICAgIG1pbmU6IHBhcGVybWluZSxcbiAgICAgICAgICAgIG90aGVyOiBwYXBlcm90aGVyLFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YXN0b3JlcyA9IHtcbiAgICAgICAgICAgIG1pbmU6IGRyYXdtaW5lLFxuICAgICAgICAgICAgb3RoZXI6IGRyYXdvdGhlclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgdGhpcy5kcmF3c3RhdHVzID0gZHJhd3N0YXR1cztcbiAgICAgICAgLy8gVS50b2FzdC5ub3JtYWwoXCJub3cgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgdGhpcy5wcm9jKHRydWUpO1xuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgcHJvYyhwZXJpb2RpYzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kcmF3c3RhdHVzLmlzRHJhd2luZygpKSB7XG4gICAgICAgICAgICAvLyBcdTgxRUFcdTUyMDZcdTMwNkVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwOTJcdTRGRERcdTVCNThcdTMwNTdcdTMwNjZcdTMwQUZcdTMwRUFcdTMwQTJcbiAgICAgICAgICAgIGlmKHRoaXMuZGF0YXN0b3Jlcy5taW5lLmdldERyYXcoKS5sZW5ndGgoKSA+IDApIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFzdG9yZXMubWluZS5zYXZlKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhc3RvcmVzLm1pbmUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBTYXZlRWxlbWVudC51cGRhdGVMYWJlbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBcdTRFMDBcdTVFQTZcdThBQURcdTMwN0ZcdThGQkNcdTMwN0ZcdTc2RjRcdTMwNTdcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YXN0b3Jlcy5vdGhlci5sb2FkKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlZHJhdyh0aGlzLnBhcGVycy5vdGhlciwgdGhpcy5kYXRhc3RvcmVzLm90aGVyLmdldERyYXdzKCksIHRoaXMucGVuKTtcbiAgICAgICAgICAgIC8vIFUudG9hc3Qubm9ybWFsKGBsb2FkICR7c2VjfSBzZWMuYCk7XG4gICAgICAgICAgICAvLyBVLnBkKFwibG9hZGVkISFcIik7XG5cbiAgICAgICAgICAgIC8vIHJlZHJhd1x1MzA0Q1x1N0Q0Mlx1MzA4Rlx1MzA2M1x1MzA1Rlx1NUY4Q1x1RkYwOFx1RkYxRG90aGVyIGNhbnZhc1x1MzA2Qlx1ODFFQVx1NTIwNlx1MzA2RVx1OEExOFx1OEZGMFx1MzA0Q1x1NTNDRFx1NjYyMFx1MzA1NVx1MzA4Q1x1MzA1Rlx1NUY4Q1x1MzA2N1x1NkQ4OFx1MzA1OVx1MzA1M1x1MzA2OFx1MzA2N1x1MzAwMVx1NzUzQlx1OTc2Mlx1MzA2RVx1MzA3MVx1MzA1Rlx1MzA3MVx1MzA1Rlx1MzA5Mlx1MzA2QVx1MzA0Rlx1MzA1OVx1RkYwOVxuICAgICAgICAgICAgLy8gXHU1MTQzXHUzMDZFXHU4QTE4XHU4RkYwXHUzMDRDXHUzMDQyXHUzMDhCXHUzMDZCXHUzMDU3XHUzMDhEXHUzMDZBXHUzMDQ0XHUzMDZCXHUzMDU3XHUzMDhEXHUzMEM3XHUzMEZDXHUzMEJGXHUzMDZGXHUzMEFGXHUzMEVBXHUzMEEyXHUzMDU1XHUzMDhDXHUzMDY2XHUzMDQ0XHUzMDhCXHUzMDZGXHUzMDVBXHUzMDZFXHUzMDZBXHUzMDZFXHUzMDY3XHU1RTM4XHUzMDZCcGFwZXJcdTMwQUZcdTMwRUFcdTMwQTJcbiAgICAgICAgICAgIC8vIFx1MzA3RVx1MzA1Rlx1NjZGOFx1MzA0RFx1NTlDQlx1MzA4MVx1MzA2Nlx1MzA0NFx1MzA4Qlx1MzA0Qlx1MzA4Mlx1MzA1N1x1MzA4Q1x1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1MzBBRlx1MzBFQVx1MzBBMlx1NTI0RFx1MzA2Qlx1MzBDMVx1MzBBN1x1MzBDM1x1MzBBRlxuICAgICAgICAgICAgaWYoIXRoaXMuZHJhd3N0YXR1cy5pc0RyYXdpbmcoKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGFwZXJzLm1pbmUuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGVyaW9kaWMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYyA9IDM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucHJvYyh0cnVlKSwgc2VjICogMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpcnN0OiBib29sZWFuID0gdHJ1ZTsgLy8gXHU1MjFEXHU1NkRFXHUzMEQ1XHUzMEU5XHUzMEIwXHUzMDAyXHUzMEVEXHUzMEZDXHUzMEM5XHU2NjQyXHUzMDZCXHUzMEQwXHUzMEJGXHUzMDY0XHUzMDRGXHUzMDVGXHUzMDgxXHUzMDAyXG4gICAgcHJpdmF0ZSBhc3luYyByZWRyYXcocGFwZXI6IFBhcGVyRWxlbWVudCwgZHJhd3M6IERyYXdbXSwgcGVuOiBQZW5BY3Rpb24pOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICAvLyBwZW5cdTcyQjZcdTYxNEJcdTMwNkVcdTRGRERcdTVCNThcbiAgICAgICAgcGVuLnNhdmVPcHQoKTtcblxuICAgICAgICAvLyBjYW52YXNcdTMwNkVcdTMwQUZcdTMwRUFcdTMwQTJcbiAgICAgICAgLy8gcGFwZXIuY2xlYXIoKTtcblxuICAgICAgICBsZXQgcHJlcG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICBwYXBlci5nZXRDbnYoKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRyYXcgb2YgZHJhd3MpIHtcbiAgICAgICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RWNhbnZhc1x1MzA2RVx1NzJCNlx1NjE0Qlx1MzA5Mlx1MzBBRlx1MzBFRFx1MzBGQ1x1MzBGM1xuICAgICAgICAgICAgLy8gY29uc3QgYmtpbWc6IEhUTUxJbWFnZUVsZW1lbnQgPSBhd2FpdCB0aGlzLnRvSW1hZ2UocGFwZXIuZ2V0Q252KCkpO1xuXG4gICAgICAgICAgICAvLyBcdTRFQ0FcdTU2REVcdTMwNkVcdThBMThcdThGRjBcdTMwOTJcdTc1MUZcdTYyMTBcbiAgICAgICAgICAgIGNvbnN0IHN0cm9rZXMgPSBkcmF3LmdldFN0cm9rZXMoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG5cbiAgICAgICAgICAgICAgICBwZW4ub3B0LnVwZGF0ZShzLm9wdCk7XG4gICAgICAgICAgICAgICAgcGVuLmVyYXNlciA9IHMuaXNFcmFzZXIoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygcy5nZXRQb2ludHMoKSkge1xuICAgICAgICAgICAgICAgICAgICBwZW4ucHJvYyhwLngsIHAueSwgcHJlcG9pbnQsIHBhcGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmVwb2ludCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFx1NTNENlx1MzA2M1x1MzA2Nlx1MzA0QVx1MzA0NFx1MzA1RmNhbnZhc1x1MzA2OFx1OTFDRFx1MzA2RFx1NTQwOFx1MzA4Rlx1MzA1QlxuICAgICAgICAgICAgLy8gcGFwZXIuZ2V0Q3R4KCkuZHJhd0ltYWdlKGJraW1nLCAwLCAwLCBia2ltZy53aWR0aCwgYmtpbWcuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgICAgICAgcGFwZXIuZ2V0Q252KCkuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGVuXHU3MkI2XHU2MTRCXHUzMDZFXHU1RkE5XHU2NUU3XG4gICAgICAgIHBlbi5yZXN0b3JlT3B0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB0b0ltYWdlKGNudjogSFRNTENhbnZhc0VsZW1lbnQpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50ID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBjb25zdCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y252LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoaW1hZ2UpO1xuICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IChlKSA9PiByZWplY3QoZSk7XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSBjdHguY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgTG9hZEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vTG9hZEFjdGlvblwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBMb2FkRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgbG9hZDogTG9hZEFjdGlvbjtcblxuICAgIHB1YmxpYyBpbml0KGxvYWQ6IExvYWRBY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2FkID0gbG9hZDtcbiAgICAgICAgdGhpcy5lbGUgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtbG9hZC1vdGhlci1mb3JjZVwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBVLnRvYXN0Lm5vcm1hbChcIm5vdyBsb2FkaW5nXCIpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWQucHJvYyhmYWxzZSk7XG4gICAgICAgIFUudG9hc3Qubm9ybWFsKFwibG9hZGVkXCIpO1xuICAgIH1cbn1cbiIsICJleHBvcnQgY2xhc3MgRHJhd2NhbnZhc2VzRWxlbWVudCB7XG4gICAgcHJpdmF0ZSB3cmFwZGl2OiBIVE1MRGl2RWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLndyYXBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RyYXdjYW52YXNlc1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZWxlbWVudCgpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXBkaXY7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE5vcm1hbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkZGRjAwXCI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFNjcm9sbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwRkYwMDc3XCI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldEV4cGFuZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGMDAwMDc3XCI7XG4gICAgfVxufSIsICJpbXBvcnQgeyBUb29sLCBEcmF3RXZlbnQgfSBmcm9tIFwiLi4vdS90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgRHJhd1N0YXR1cyB7XG4gICAgcHJpdmF0ZSBldmVudDogRHJhd0V2ZW50O1xuICAgIHByaXZhdGUgdG9vbDogVG9vbCB8IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbmRTdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kU3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmV2ZW50ID0gXCJ1cFwiO1xuICAgICAgICB0aGlzLnRvb2wgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydFN0cm9rZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gXHU2NENEXHU0RjVDXHU5NThCXHU1OUNCXG4gICAgICAgIHRoaXMuZXZlbnQgPSBcImRvd25cIjtcbiAgICAgICAgdGhpcy50b29sID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VG9vbCh0b29sKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG9vbCA9IHRvb2w7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRUb29sKCk6IFRvb2wgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9vbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFbmRTdHJva2Uobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJ1cFwiICYmIHRoaXMuZXZlbnQgIT09IFwidXBcIjtcbiAgICB9XG4gICAgcHVibGljIGlzU3RhcnRTdHJva2Uobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJkb3duXCI7XG4gICAgfVxuICAgIHB1YmxpYyBpc0RyYXdpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBbXCJkb3duXCIsIFwibW92ZVwiXS5pbmNsdWRlcyh0aGlzLmV2ZW50KTtcbiAgICB9XG59IiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSByZmRjXG5cbmZ1bmN0aW9uIGNvcHlCdWZmZXIgKGN1cikge1xuICBpZiAoY3VyIGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGN1cilcbiAgfVxuXG4gIHJldHVybiBuZXcgY3VyLmNvbnN0cnVjdG9yKGN1ci5idWZmZXIuc2xpY2UoKSwgY3VyLmJ5dGVPZmZzZXQsIGN1ci5sZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHJmZGMgKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cblxuICBpZiAob3B0cy5jaXJjbGVzKSByZXR1cm4gcmZkY0NpcmNsZXMob3B0cylcbiAgcmV0dXJuIG9wdHMucHJvdG8gPyBjbG9uZVByb3RvIDogY2xvbmVcblxuICBmdW5jdGlvbiBjbG9uZUFycmF5IChhLCBmbikge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYSlcbiAgICB2YXIgYTIgPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgayA9IGtleXNbaV1cbiAgICAgIHZhciBjdXIgPSBhW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIGEyW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgYTJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIGEyW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhMltrXSA9IGZuKGN1cilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGEyXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZSAobykge1xuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbCkgcmV0dXJuIG9cbiAgICBpZiAobyBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBuZXcgRGF0ZShvKVxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pKSByZXR1cm4gY2xvbmVBcnJheShvLCBjbG9uZSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmUpKVxuICAgIHZhciBvMiA9IHt9XG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobywgaykgPT09IGZhbHNlKSBjb250aW51ZVxuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvMltrXSA9IGNsb25lKGN1cilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG8yXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZVByb3RvIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lUHJvdG8pXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgdmFyIG8yID0ge31cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIHZhciBjdXIgPSBvW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIG8yW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgbzJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBvMltrXSA9IG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lUHJvdG8pKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgbzJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8yW2tdID0gY2xvbmVQcm90byhjdXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvMlxuICB9XG59XG5cbmZ1bmN0aW9uIHJmZGNDaXJjbGVzIChvcHRzKSB7XG4gIHZhciByZWZzID0gW11cbiAgdmFyIHJlZnNOZXcgPSBbXVxuXG4gIHJldHVybiBvcHRzLnByb3RvID8gY2xvbmVQcm90byA6IGNsb25lXG5cbiAgZnVuY3Rpb24gY2xvbmVBcnJheSAoYSwgZm4pIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGEpXG4gICAgdmFyIGEyID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGsgPSBrZXlzW2ldXG4gICAgICB2YXIgY3VyID0gYVtrXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBhMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGEyW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBhMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGluZGV4ID0gcmVmcy5pbmRleE9mKGN1cilcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIGEyW2tdID0gcmVmc05ld1tpbmRleF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhMltrXSA9IGZuKGN1cilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTJcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lKVxuICAgIGlmIChvIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lKSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgdmFyIG8yID0ge31cbiAgICByZWZzLnB1c2gobylcbiAgICByZWZzTmV3LnB1c2gobzIpXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobywgaykgPT09IGZhbHNlKSBjb250aW51ZVxuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaSA9IHJlZnMuaW5kZXhPZihjdXIpXG4gICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgIG8yW2tdID0gcmVmc05ld1tpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8yW2tdID0gY2xvbmUoY3VyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZnMucG9wKClcbiAgICByZWZzTmV3LnBvcCgpXG4gICAgcmV0dXJuIG8yXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZVByb3RvIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lUHJvdG8pXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgdmFyIG8yID0ge31cbiAgICByZWZzLnB1c2gobylcbiAgICByZWZzTmV3LnB1c2gobzIpXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICB2YXIgY3VyID0gb1trXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBvMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgbzJba10gPSBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIG8yW2tdID0gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmVQcm90bykpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaSA9IHJlZnMuaW5kZXhPZihjdXIpXG4gICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgIG8yW2tdID0gcmVmc05ld1tpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8yW2tdID0gY2xvbmVQcm90byhjdXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVmcy5wb3AoKVxuICAgIHJlZnNOZXcucG9wKClcbiAgICByZXR1cm4gbzJcbiAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2VPcHRpb24gfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHJmZGMgZnJvbSBcInJmZGNcIjtcblxuZXhwb3J0IGNsYXNzIFBlbkFjdGlvbiB7XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkgb3B0OlN0cm9rZU9wdGlvbiA9IG5ldyBTdHJva2VPcHRpb24oXCJcIiwgMCk7XG4gICAgcHVibGljIGVyYXNlcjogYm9vbGVhbjtcblxuICAgIHByaXZhdGUgb3B0Yms6IGFueTtcbiAgICBwcml2YXRlIGNsb25lID0gcmZkYygpO1xuXG4gICAgcHVibGljIGluaXQob3B0OiBTdHJva2VPcHRpb24pIHtcbiAgICAgICAgdGhpcy5lcmFzZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcHQudXBkYXRlKG9wdCk7XG4gICAgICAgIHRoaXMub3B0YmsgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmVwOiBQb2ludCB8IG51bGwsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHByZSA9IHByZXA7XG4gICAgICAgIGlmIChwcmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gXHU1MjREXHU1NkRFXHUzMDZFXHU3MEI5XHUzMDRDXHUzMDZBXHUzMDUxXHUzMDhDXHUzMDcwXHU0RUNBXHU1NkRFXHUzMDZFXHU3MEI5XG4gICAgICAgICAgICBwcmUgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3R4ID0gcGFwZXIuZ2V0Q3R4KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZXJhc2VyKSB7XG4gICAgICAgICAgICB0aGlzLmVyYXNlKHgsIHksIHByZSwgY3R4KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZW4oeCwgeSwgcHJlLCBjdHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcGVuKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmU6IFBvaW50LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLm9wdC50aGljaztcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5vcHQuY29sb3I7XG4gICAgICAgIGN0eC5tb3ZlVG8ocHJlLngsIHByZS55KTtcbiAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgICBwcml2YXRlIGVyYXNlKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmU6IFBvaW50LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAvLyBcdTc5RkJcdTUyRDVcdThERERcdTk2RTJcdTMwNjdcdTZEODhcdTMwNTlcdTdCQzRcdTU2RjJcdTMwOTJcdThBQkZcdTY1NzRcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHggLSBwcmUueCkgKyBNYXRoLmFicyh5IC0gcHJlLnkpO1xuICAgICAgICBjdHguY2xlYXJSZWN0KHggLSBkLCB5IC0gZCwgZCAqIDIsIGQgKiAyKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZU9wdCgpIHtcbiAgICAgICAgdGhpcy5vcHRiayA9IHRoaXMuY2xvbmUodGhpcy5vcHQpO1xuICAgICAgICAvLyBVLnBkKHRoaXMub3B0YmspO1xuICAgIH1cbiAgICBwdWJsaWMgcmVzdG9yZU9wdCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaWR4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMub3B0YmspKSB7XG4gICAgICAgICAgICB0aGlzLm9wdFtpZHhdID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2UgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmRvRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZHJhdzogRHJhd01pbmU7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHVibGljIGluaXQocGFwZXI6IFBhcGVyRWxlbWVudCwgZHJhdzogRHJhd01pbmUsIHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtdW5kb1wiKTtcblxuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cbiAgICBwcml2YXRlIHByb2MoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NjcwMFx1NjVCMFx1MzA2RXN0cm9rZVx1MzA5Mlx1NzgzNFx1NjhDNFx1MzA1N1x1MzA2Nlx1MzAwMVx1MzA1RFx1MzA2RVx1NTE4NVx1NUJCOVx1MzA5Mlx1NTNENlx1NUY5N1xuICAgICAgICBjb25zdCBzdHJva2VzOiBTdHJva2VbXSA9IHRoaXMuZHJhdy51bmRvKCk7XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlx1MzAwMVx1OEEyRFx1NUI5QVx1MzA5Mlx1NEZERFx1NUI1OFxuICAgICAgICB0aGlzLnBhcGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucGVuLnNhdmVPcHQoKTtcblxuICAgICAgICAvLyBcdTY1MzlcdTMwODFcdTMwNjZcdTYzQ0ZcdTc1M0JcbiAgICAgICAgbGV0IHByZXBvaW50OiBQb2ludCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBpZiAocy5pc0VyYXNlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gcy5jb2xvcjsgLy8gXHU4MjcyXHU2MEM1XHU1ODMxXHUzMDZGXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDRDXHU1RkY1XHUzMDZFXHU3MEJBXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHMuZ2V0UG9pbnRzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgdGhpcy5wYXBlcik7XG4gICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcG9pbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHU4QTJEXHU1QjlBXHUzMDkyXHU1RkE5XHU1RTMwXG4gICAgICAgIHRoaXMucGVuLnJlc3RvcmVPcHQoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvRHJhd2NhbnZhc2VzRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9ab29tRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tU2Nyb2xsQWN0aW9uIHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tRWxlbWVudDtcbiAgICBwcml2YXRlIHByZXA6IFBvaW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBub3d6b29tOiBudW1iZXIgPSAxO1xuICAgIHByaXZhdGUgb3JndzogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIG9yZ2g6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IFpPT01fTUFYOiBudW1iZXIgPSAyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgWk9PTV9NSU46IG51bWJlciA9IDAuNTtcblxuICAgIHB1YmxpYyBpbml0KHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQsIHpvb21zY3JvbGw6IFpvb21FbGVtZW50KSB7XG4gICAgICAgIHRoaXMud3JhcGRpdiA9IHdyYXBkaXY7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMubm93em9vbSA9IDE7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbC5zaG93KHRoaXMubm93em9vbSk7XG4gICAgICAgIGNvbnN0IGVsZTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gICAgICAgIHRoaXMub3JndyA9IHBhcnNlSW50KGVsZS5zdHlsZS53aWR0aC5yZXBsYWNlKFwicHhcIiwgXCJcIikpO1xuICAgICAgICB0aGlzLm9yZ2ggPSBwYXJzZUludChlbGUuc3R5bGUuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXRQb2ludCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnByZXAgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxuICAgIHB1YmxpYyBzY3JvbGwoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlKCkgfHwgIXRoaXMucHJlcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFx1NURFRVx1NTIwNlx1MzA2RVx1OEEwOFx1N0I5N1xuICAgICAgICBjb25zdCBkeCA9ICh0aGlzLnByZXAueCAtIHgpICogdGhpcy5ub3d6b29tICogNztcbiAgICAgICAgY29uc3QgZHkgPSAodGhpcy5wcmVwLnkgLSB5KSAqIHRoaXMubm93em9vbSAqIDc7XG5cbiAgICAgICAgLy8gXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXHU1QjlGXHU4ODRDXG4gICAgICAgIGNvbnN0IG54ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICBjb25zdCBueSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgd2luZG93LnNjcm9sbCh7XG4gICAgICAgICAgICBsZWZ0OiBueCArIGR4LFxuICAgICAgICAgICAgdG9wOiBueSArIGR5LFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVS5wZChgc2Nyb2xsIDogJHt0aGlzLnByZXAueH0tJHt4fT0ke2R4fSwgJHt0aGlzLnByZXAueX0tJHt5fT0ke2R5fWApO1xuXG4gICAgICAgIC8vIFx1MzBERFx1MzBBNFx1MzBGM1x1MzBDOFx1MzA2RVx1NjZGNFx1NjVCMFxuICAgICAgICB0aGlzLnByZXAueCA9IHg7XG4gICAgICAgIHRoaXMucHJlcC55ID0geTtcbiAgICB9XG4gICAgcHVibGljIHpvb21kcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5wcmVwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZHkgPSB0aGlzLnByZXAueSAtIHk7XG4gICAgICAgIC8vIFx1NzlGQlx1NTJENVx1NURFRVx1NTIwNlx1MzA5Mnpvb21cdTZCRDRcdTczODdcdTMwNkJcdTU5MDlcdTYzREJcdTMwMDJcdTczRkVcdTU3MjhcdTMwNkVcdTZCRDRcdTczODdcdTMwNkJcdTMwODhcdTMwNjNcdTMwNjZcdTVERUVcdTUyMDZcdTkxQ0ZcdTMwOTJcdThBQkZcdTY1NzRcdUZGMDhcdTU5MjdcdTMwNERcdTMwNDRcdTMwNjhcdTU5MjdcdTMwNERcdTMwNDRcdUZGMDlcbiAgICAgICAgY29uc3QgZGlmZiA9IGR5ICogMC4wMDA1ICogdGhpcy5ub3d6b29tO1xuICAgICAgICB0aGlzLnpvb21wcm9jKGRpZmYpO1xuICAgICAgICAvLyBcdTMwRERcdTMwQTRcdTMwRjNcdTMwQzhcdTMwNkVcdTY2RjRcdTY1QjBcbiAgICAgICAgdGhpcy5wcmVwLnggPSB4O1xuICAgICAgICB0aGlzLnByZXAueSA9IHk7XG4gICAgfVxuICAgIHB1YmxpYyB6b29tcHJvYyhkaWZmOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ub3d6b29tICs9IGRpZmY7XG4gICAgICAgIC8vIFx1N0JDNFx1NTZGMlx1ODhEQ1x1NkI2M1xuICAgICAgICB0aGlzLm5vd3pvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLm5vd3pvb20sIHRoaXMuWk9PTV9NSU4pLCB0aGlzLlpPT01fTUFYKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgICAgICAgZWxlLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3RoaXMubm93em9vbX0pYDtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsLnNob3codGhpcy5ub3d6b29tKTtcbiAgICAgICAgZWxlLnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcmd3ICogdGhpcy5ub3d6b29tfXB4YDtcbiAgICAgICAgZWxlLnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3JnaCAqIHRoaXMubm93em9vbX1weGA7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRab29tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3pvb207XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmV0aW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgaWdub3JlKCkge1xuICAgICAgICBjb25zdCBuOiBudW1iZXIgPSBEYXRlLm5vdygpO1xuICAgICAgICBsZXQgcmV0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKG4gLSB0aGlzLnByZXRpbWUgPiAwLjAxICogMTAwMCkge1xuICAgICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByZXRpbWUgPSBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFRvdWNoU2Vuc29yIH0gZnJvbSBcIi4uL3NlbnNvci9Ub3VjaFNlbnNvclwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgWm9vbUVsZW1lbnQge1xuICAgIHByaXZhdGUgbGJsOiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBidHA6IEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHByaXZhdGUgYnRtOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG5cbiAgICBwdWJsaWMgaW5pdCh6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMubGJsID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5idHAgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN6b29tLXBsdXNcIik7XG4gICAgICAgIHRoaXMuYnRtID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1taW51c1wiKTtcblxuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKDAuMSkpO1xuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoMC4xKSk7XG4gICAgICAgIHRoaXMuYnRtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgICAgICB0aGlzLmJ0bS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgIH1cbiAgICBwdWJsaWMgbGFiZWwoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGJsO1xuICAgIH1cbiAgICBwdWJsaWMgc2hvdyhub3d6b29tOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYmwuaW5uZXJIVE1MID0gYCR7TWF0aC5yb3VuZChub3d6b29tICogMTAwKS50b1N0cmluZygpfSVgO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIEVyYXNlckVsZW1lbnQge1xuICAgIHByaXZhdGUgZWxlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtZXJhc2VyXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgfVxuXG4gICAgcHVibGljIHByb2MoKSB7XG4gICAgICAgIHRoaXMucGVuLmVyYXNlciA9ICF0aGlzLnBlbi5lcmFzZXI7XG4gICAgICAgIGNvbnN0IGVuYWJsZSA9IFwiaGFzLWJhY2tncm91bmQtcHJpbWFyeVwiO1xuICAgICAgICBjb25zdCBkaXNhYmxlID0gXCJoYXMtYmFja2dyb3VuZC1saWdodFwiO1xuICAgICAgICAvLyBcdTg4NjhcdTc5M0FcdTMwOTJcdTY2RjRcdTY1QjBcbiAgICAgICAgaWYgKHRoaXMucGVuLmVyYXNlcikge1xuICAgICAgICAgICAgdGhpcy5lbGUuY2xhc3NMaXN0LnJlcGxhY2UoZGlzYWJsZSwgZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLmNsYXNzTGlzdC5yZXBsYWNlKGVuYWJsZSwgZGlzYWJsZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5leHBvcnQgY2xhc3MgQ29sb3JFbGVtZW50IHtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uXG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChldjogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSA8SFRNTEVsZW1lbnQ+ZXYudGFyZ2V0O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgVS50b2FzdC5ub3JtYWwoYGNoYW5nZSB0byAke2NvbG9yfWApO1xuXG4gICAgICAgICAgICAvLyBcdTg5OEJcdTMwNUZcdTc2RUVcdTMwNkVcdTgyNzJcdTMwOTJcdTU5MDlcdTY2RjRcbiAgICAgICAgICAgIGNvbnN0IHBlbiA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbG9yLWxhYmVsXCIpO1xuICAgICAgICAgICAgcGVuLnN0eWxlLmNvbG9yID0gY29sb3I7XG5cbiAgICAgICAgICAgIC8vIFx1MzBFMVx1MzBDQlx1MzBFNVx1MzBGQ1x1MzA5Mlx1OTU4OVx1MzA1OFx1MzA4QlxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb2xvci1kcm9wZG93bi5pcy1hY3RpdmVcIik/LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1hY3RpdmVcIik7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGVuLWNvbG9yXCIpLmZvckVhY2goKGVsZTogRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5leHBvcnQgY2xhc3MgVGhpY2tFbGVtZW50IHtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uXG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChldjogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW06IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmV2LnRhcmdldDtcbiAgICAgICAgICAgIGNvbnN0IHB4OiBzdHJpbmcgPSBpdGVtLmdldEF0dHJpYnV0ZShcImRhdGEtd2lkdGhcIik7XG4gICAgICAgICAgICBjb25zdCB0aGljazogbnVtYmVyID0gcGFyc2VJbnQocHgpO1xuICAgICAgICAgICAgdGhpcy5wZW4ub3B0LnRoaWNrID0gdGhpY2s7XG4gICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChgY2hhbmdlIHRvICR7dGhpY2t9YCk7XG5cbiAgICAgICAgICAgIC8vIFx1ODk4Qlx1MzA1Rlx1NzZFRVx1MzA5Mlx1NTkwOVx1NjZGNFxuICAgICAgICAgICAgY29uc3QgcGVuID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGhpY2stbGFiZWxcIik7XG4gICAgICAgICAgICBwZW4uc3R5bGUud2lkdGggPSBgJHt0aGlja31weGA7XG4gICAgICAgICAgICBwZW4uc3R5bGUuaGVpZ2h0ID0gYCR7dGhpY2t9cHhgO1xuICAgICAgICAgICAgcGVuLnN0eWxlLmJvcmRlclJhZGl1cyA9IGAke3RoaWNrIC8gMn1weGA7XG5cbiAgICAgICAgICAgIC8vIFx1MzBFMVx1MzBDQlx1MzBFNVx1MzBGQ1x1MzA5Mlx1OTU4OVx1MzA1OFx1MzA4QlxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aGljay1kcm9wZG93bi5pcy1hY3RpdmVcIik/LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1hY3RpdmVcIik7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGVuLXRoaWNrXCIpLmZvckVhY2goZWxlID0+IHtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcik7XG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwgImltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4uL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBCYWNrRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZHJhdzogRHJhd01pbmU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZWxlID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWN0LWJhY2tcIik7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuICAgIHB1YmxpYyBpbml0KGRyYXc6IERyYXdNaW5lKSB7XG4gICAgICAgIHRoaXMuZHJhdyA9IGRyYXc7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgcHJvYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYXcuaXNTYXZlZCgpKSB7XG4gICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChcIlx1NEZERFx1NUI1OFx1MzA1N1x1MzA2Nlx1NjIzQlx1MzA4QVx1MzA3RVx1MzA1OVwiKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kcmF3LnNhdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvXCI7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2VPcHRpb24gfSBmcm9tIFwiLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERldmljZSwgVG9vbCB9IGZyb20gXCIuL3UvdHlwZXNcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuL3UvdVwiO1xuaW1wb3J0IHsgTW91c2VTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvTW91c2VTZW5zb3JcIjtcbmltcG9ydCB7IFBvaW50ZXJTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvUG9pbnRlclNlbnNvclwiO1xuaW1wb3J0IHsgVG91Y2hTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFNhdmVFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9TYXZlRWxlbWVudFwiO1xuaW1wb3J0IHsgTG9hZEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9Mb2FkQWN0aW9uXCI7XG5pbXBvcnQgeyBMb2FkRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvTG9hZEVsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdjYW52YXNlc0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdTdGF0dXMgfSBmcm9tIFwiLi9kYXRhL0RyYXdTdGF0dXNcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCB7IFVuZG9FbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9VbmRvRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uXCI7XG5pbXBvcnQgeyBab29tRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvWm9vbUVsZW1lbnRcIjtcbmltcG9ydCB7IEVyYXNlckVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0VyYXNlckVsZW1lbnRcIjtcbmltcG9ydCB7IENvbG9yRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvQ29sb3JFbGVtZW50XCI7XG5pbXBvcnQgeyBUaGlja0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L1RoaWNrRWxlbWVudFwiO1xuaW1wb3J0IHsgQmFja0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0JhY2tFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RXZlbnRIYW5kbGVyIHtcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBub3dzZW5zb3I6IERldmljZSB8IG51bGw7IC8vIFx1MzBCRlx1MzBDM1x1MzBDMVx1MzAwMVx1MzBERFx1MzBBNFx1MzBGM1x1MzBCRlx1N0I0OVx1MzAwMVx1MzA3RVx1MzA2OFx1MzA4MVx1MzA2Nlx1ODkwN1x1NjU3MFx1MzA2RVx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1MzA5Mlx1NjkxQ1x1NzdFNVx1MzA1N1x1MzA1Rlx1NTgzNFx1NTQwOFx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2Nlx1MzAwMlxuICAgIHByaXZhdGUgc3RhdHVzID0ge1xuICAgICAgICBkcmF3OiBuZXcgRHJhd1N0YXR1cygpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBlbGVtZW50ID0ge1xuICAgICAgICB3cmFwZGl2OiBuZXcgRHJhd2NhbnZhc2VzRWxlbWVudCgpLFxuICAgICAgICB6b29tc2Nyb2xsOiBuZXcgWm9vbUVsZW1lbnQoKSxcbiAgICAgICAgc2F2ZTogbmV3IFNhdmVFbGVtZW50KCksXG4gICAgICAgIGVyYXNlcjogbmV3IEVyYXNlckVsZW1lbnQoKSxcbiAgICAgICAgY29sb3I6IG5ldyBDb2xvckVsZW1lbnQoKSxcbiAgICAgICAgdW5kbzogbmV3IFVuZG9FbGVtZW50KCksXG4gICAgICAgIGJhY2s6IG5ldyBCYWNrRWxlbWVudCgpLFxuICAgICAgICBsb2FkOiBuZXcgTG9hZEVsZW1lbnQoKSxcbiAgICAgICAgdGhpY2s6IG5ldyBUaGlja0VsZW1lbnQoKSxcbiAgICB9O1xuICAgIHByaXZhdGUgYWN0aW9uID0ge1xuICAgICAgICBsb2FkOiBuZXcgTG9hZEFjdGlvbigpLFxuICAgICAgICB6b29tc2Nyb2xsOiBuZXcgWm9vbVNjcm9sbEFjdGlvbigpLFxuICAgIH07XG5cbiAgICBwcml2YXRlIG1pbmUgPSB7XG4gICAgICAgIHBhcGVyOiBQYXBlckVsZW1lbnQubWFrZU1pbmUoKSxcbiAgICAgICAgZHJhdzogbmV3IERyYXdNaW5lKCksXG4gICAgICAgIHBlbjogbmV3IFBlbkFjdGlvbigpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBvdGhlciA9IHtcbiAgICAgICAgcGFwZXI6IFBhcGVyRWxlbWVudC5tYWtlT3RoZXIoKSxcbiAgICAgICAgZHJhdzogbmV3IERyYXdPdGhlcigpLFxuICAgICAgICBwZW46IG5ldyBQZW5BY3Rpb24oKSxcbiAgICB9O1xuICAgIHByaXZhdGUgZGV2aWNlID0ge1xuICAgICAgICBtb3VzZTogbmV3IE1vdXNlU2Vuc29yKCksXG4gICAgICAgIHBvaW50ZXI6IG5ldyBQb2ludGVyU2Vuc29yKCksXG4gICAgICAgIHRvdWNoOiBuZXcgVG91Y2hTZW5zb3IoKSxcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLm5vd3NlbnNvciA9IG51bGw7XG5cbiAgICAgICAgY29uc3Qgc2QgPSB0aGlzLmxvYWRTZXJ2ZXJEYXRhKCk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gc2RbXCIjc2QtY29sb3JcIl07XG4gICAgICAgIGNvbnN0IHRoaWNrID0gc2RbXCIjc2QtdGhpY2tcIl07XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Lnpvb21zY3JvbGwuaW5pdCh0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNhdmUuaW5pdCh0aGlzLm1pbmUuZHJhdywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNvbG9yLmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC50aGljay5pbml0KHRoaXMubWluZS5wZW4pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZXJhc2VyLmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC51bmRvLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5iYWNrLmluaXQodGhpcy5taW5lLmRyYXcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQubG9hZC5pbml0KHRoaXMuYWN0aW9uLmxvYWQpO1xuXG4gICAgICAgIHRoaXMuZGV2aWNlLm1vdXNlLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5kZXZpY2UucG9pbnRlci5pbml0KHRoaXMsIHRoaXMubWluZS5wYXBlcik7XG4gICAgICAgIHRoaXMuZGV2aWNlLnRvdWNoLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyLCB0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTtcblxuICAgICAgICB0aGlzLmFjdGlvbi5sb2FkLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm90aGVyLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5vdGhlci5kcmF3LCB0aGlzLm90aGVyLnBlbiwgdGhpcy5zdGF0dXMuZHJhdyk7XG4gICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuaW5pdCh0aGlzLmVsZW1lbnQud3JhcGRpdiwgdGhpcy5lbGVtZW50Lnpvb21zY3JvbGwpO1xuXG4gICAgICAgIGNvbnN0IHN0cm9rZW9wdCA9IG5ldyBTdHJva2VPcHRpb24oY29sb3IsIHRoaWNrKTtcbiAgICAgICAgdGhpcy5taW5lLnBlbi5pbml0KHN0cm9rZW9wdCk7XG4gICAgICAgIHRoaXMubWluZS5kcmF3LmluaXQodGhpcy5taW5lLnBlbik7XG5cbiAgICAgICAgdGhpcy5vdGhlci5wZW4uaW5pdChzdHJva2VvcHQpO1xuICAgIH1cbiAgICBwcml2YXRlIGxvYWRTZXJ2ZXJEYXRhKCk6IGFueVtdIHtcbiAgICAgICAgY29uc3QgaWRzOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgICAgIFwiI3NkLWNvbG9yXCIsXG4gICAgICAgICAgICBcIiNzZC10aGlja1wiLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgICAgIHJldFtpZF0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKT8uaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRvd24oZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gcC55O1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tZG93bigke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBkZXY7XG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc3RhcnRTdHJva2UoKTtcbiAgICAgICAgdGhpcy5taW5lLmRyYXcuc3RhcnRTdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZShkZXY6IERldmljZSwgZTogRXZlbnQsIHA6IFBvaW50KTogdm9pZCB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gcC54O1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBwLnk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS1tb3ZlKCR7eH0sJHt5fSk9JHt0aGlzLm5vd3NlbnNvcn1gKTtcblxuICAgICAgICAvLyBcdTcxMjFcdTg5OTZcdTMwNTlcdTMwOEJcdTY3NjFcdTRFRjZcbiAgICAgICAgaWYgKHRoaXMubm93c2Vuc29yID09PSBudWxsIC8vIFx1MzBDN1x1MzBEMFx1MzBBNFx1MzBCOVx1NjcyQVx1NkM3QVx1NUI5QVx1MzA2QVx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICAgICAgfHwgdGhpcy5ub3dzZW5zb3IgIT09IGRldiAvLyBcdTkwNTVcdTMwNDZcdTMwQzdcdTMwRDBcdTMwQTRcdTMwQjlcdTMwNkVcdTMwQTRcdTMwRDlcdTMwRjNcdTMwQzhcdTMwNkFcdTMwNkVcdTMwNjdcdTcxMjFcdTg5OTZcbiAgICAgICAgICAgIC8vIFx1NTJENVx1MzA0NFx1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc2V0VG9vbChcInBlblwiKTtcblxuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkVcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNkJcdTVGRENcdTMwNThcdTMwNjZcdTUxRTZcdTc0MDZcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXR1cy5kcmF3LmdldFRvb2woKSkge1xuICAgICAgICAgICAgY2FzZSBcInBlblwiOlxuICAgICAgICAgICAgICAgIC8vIFx1NTM1OFx1NjJCQ1x1MzA1N1x1NzlGQlx1NTJENVx1RkYxRFx1OEExOFx1OEZGMFxuICAgICAgICAgICAgICAgIGNvbnN0IHA6IFBvaW50IHwgbnVsbCA9IHRoaXMubWluZS5kcmF3Lmxhc3RQb2ludCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWluZS5wZW4ucHJvYyh4LCB5LCBwLCB0aGlzLm1pbmUucGFwZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMubWluZS5kcmF3LnB1c2hQb2ludCh4LCB5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cChkZXY6IERldmljZSwgZTogRXZlbnQsIHA6IFBvaW50KSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tdXAoJHt4fSwke3l9KT0ke3RoaXMubm93c2Vuc29yfWApO1xuXG4gICAgICAgIC8vIDFcdTMwQjlcdTMwQzhcdTMwRURcdTMwRkNcdTMwQUZcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdcdTdENDJcdTRFODZcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzLmRyYXcuaXNEcmF3aW5nKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuZW5kU3Ryb2tlKCk7XG4gICAgICAgICAgICB0aGlzLm1pbmUuZHJhdy5lbmRTdHJva2UoKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC53cmFwZGl2LnNldE5vcm1hbCgpO1xuICAgICAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5cbmNvbnN0IGJ1bG1hTmF2RHJvcCA9IChlOiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgY29uc3QgbWVudWl0ZW06IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRhcmdldC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50O1xuXG4gICAgLy8gXHUzMDVEXHUzMDZFXHU0RUQ2XHUzMDZFXHUzMEUxXHUzMENCXHUzMEU1XHUzMEZDXHUzMDZGXHU5NTg5XHUzMDU4XHUzMDhCXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pcy1hY3RpdmVcIikuZm9yRWFjaChlbGUgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSBtZW51aXRlbSkge1xuICAgICAgICAgICAgZWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1hY3RpdmVcIik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG1lbnVpdGVtLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIik7XG59XG5jb25zdCBpbml0QnVsbWFOYXZEcm9wID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcGRvd24gLmRyb3Bkb3duLXRyaWdnZXIgYVwiKS5mb3JFYWNoKG5hdiA9PiB7XG4gICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnVsbWFOYXZEcm9wKTtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBidWxtYU5hdkRyb3ApO1xuICAgIH0pO1xufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkcmF3Y2FudmFzZXNcIikpIHtcbiAgICAgICAgY29uc3Qgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIgPSBuZXcgRHJhd0V2ZW50SGFuZGxlcigpO1xuICAgICAgICBzZW5zZS5pbml0KCk7XG4gICAgfVxuICAgIGNvbnN0IGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IDxIVE1MQm9keUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbiAgICAvLyBpb3NcdTMwNkVcdTMwNjhcdTMwNERcdTMwNkVcdTMwRDRcdTMwRjNcdTMwQzFcdTMwODRcdTMwQzBcdTMwRDZcdTMwRUJcdTMwQUZcdTMwRUFcdTMwQzNcdTMwQUZcdTMwNkJcdTMwODhcdTMwOEJcdTYyRTFcdTU5MjdcdTMwOTJcdTcxMjFcdTUyQjlcdTUzMTZcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gICAgaW5pdEJ1bG1hTmF2RHJvcCgpO1xufSk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFhLE1BK0VBLGNBY0EsaUJB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bkM7QUFHSSxjQUFNLFNBQW1DLEVBQUU7QUFDM0MsY0FBTSxZQUFxQyxZQUFPLGtCQUFQLG1CQUFzQjtBQUdqRSxpQkFBUyxpQkFBaUIsWUFBWSxFQUFFLFFBQVEsU0FBTztBQUNuRCxjQUFJLFFBQVEsVUFBVTtBQUNsQixnQkFBSSxVQUFVLE9BQU8sV0FBVztBQUFBLFVBQ3BDO0FBQUEsUUFDSixDQUFDO0FBRUQsaUJBQVMsVUFBVSxPQUFPLFdBQVc7QUFBQSxNQUN6QztBQUNBLFVBQU0sbUJBQW1CLE1BQU07QUFDM0IsaUJBQVMsaUJBQWlCLCtCQUErQixFQUFFLFFBQVEsU0FBTztBQUN0RSxjQUFJLGlCQUFpQixTQUFTLFlBQVk7QUFDMUMsY0FBSSxpQkFBaUIsWUFBWSxZQUFZO0FBQUEsUUFDakQsQ0FBQztBQUFBLE1BQ0w7QUFFQSxhQUFPLGlCQUFpQixRQUFRLE1BQVk7QUFDeEMsWUFBSSxTQUFTLGNBQWMsZUFBZSxHQUFHO0FBQ3pDLGdCQUFNLFFBQTBCLElBQUksaUJBQWlCO0FBQ3JELGdCQUFNLEtBQUs7QUFBQSxRQUNmO0FBQ0EsY0FBTSxPQUF5QyxTQUFTLGNBQWMsTUFBTTtBQUc1RSxhQUFLLGlCQUFpQixjQUFjLENBQUMsTUFBa0I7QUFDbkQsWUFBRSxlQUFlO0FBQUEsUUFDckIsR0FBRyxFQUFFLFNBQVMsTUFBTSxDQUFDO0FBRXJCLHlCQUFpQjtBQUFBLE1BQ3JCLEVBQUM7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogWyJTd2FsIiwgImdsb2JhbFN0YXRlIiwgImVycm9yIiwgInJlamVjdFByb21pc2UiLCAiY29uZmlybSIsICJlIiwgImRlZmF1bHRPcHRpb25zIiwgImRlZmF1bHRPcHRpb25zIiwgImRlZmF1bHRPcHRpb25zIiwgIk1JTExJU0VDT05EU19JTl9XRUVLIiwgImZvcm1hdHRlcnMiLCAibG9jYWxpemUiLCAiZm9ybWF0TG9uZyIsICJmb3JtYXQiLCAiZm9ybWF0IiwgImRlZmF1bHRPcHRpb25zIiwgImxvY2FsZSIsICJyZmRjIiwgInJmZGMiLCAicGVuIiwgInBlbiIsICJwIl0KfQo=
