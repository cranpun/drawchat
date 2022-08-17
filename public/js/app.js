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

  // resources/ts/data/Draw.ts
  var Draw, _Stroke, Stroke, Point;
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
            const tmp = new Stroke();
            tmp.parse(s[0], s[1]);
            this.s.push(tmp);
          }
        }
        length() {
          return this.s.length;
        }
      };
      _Stroke = class {
        constructor() {
          this.p = [];
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
          return `["${this.color}",[${ret.join(",")}]]`;
        }
        parse(color, arr) {
          this.color = color;
          this.p = [];
          for (const a of arr) {
            const tmp = new Point(parseInt(a[0]), parseInt(a[1]));
            this.p.push(tmp);
          }
        }
        isEraser() {
          const ret = this.color === _Stroke.TK_ERASER;
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

  // resources/ts/data/DrawMine.ts
  var DrawMine;
  var init_DrawMine = __esm({
    "resources/ts/data/DrawMine.ts"() {
      init_Draw();
      DrawMine = class {
        constructor() {
          this.draw = new Draw();
          this.nowstroke = new Stroke();
          this.user_id = null;
          const urls = window.location.pathname.split("/");
          const paper_id = parseInt(urls[urls.length - 1]);
          this.paper_id = paper_id;
          this.savedStroke = null;
        }
        init(pen) {
          this.pen = pen;
        }
        pushPoint(x, y) {
          const now = Date.now();
          if (this.nowstroke.length() === 0) {
            this.nowstroke.color = this.pen.opt.eraser ? Stroke.TK_ERASER : this.pen.opt.color;
          }
          const p = new Point(x, y);
          this.nowstroke.push(p);
        }
        lastPoint() {
          return this.nowstroke.lastPoint();
        }
        endStroke() {
          if (this.nowstroke.length() > 0) {
            this.draw.push(this.nowstroke);
            this.nowstroke = new Stroke();
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
          const urls = window.location.pathname.split("/");
          const paper_id = parseInt(urls[urls.length - 1]);
          this.paper_id = paper_id;
        }
        init(pen) {
          this.pen = pen;
        }
        load() {
          return __async(this, null, function* () {
            const url = `/api/draw/${this.paper_id}`;
            const response = yield fetch(url);
            const text = yield response.text();
            this.draws.splice(0, this.draws.length);
            for (const d of JSON.parse(text)) {
              const obj = JSON.parse(d.json_draw);
              const draw = new Draw();
              draw.parse(obj);
              this.draws.push(draw);
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

  // resources/ts/element/SaveElement.ts
  var SaveElement;
  var init_SaveElement = __esm({
    "resources/ts/element/SaveElement.ts"() {
      init_u();
      SaveElement = class {
        init(datastore) {
          this.datastore = datastore;
          this.ele = document.querySelector("#act-save");
          this.ele.addEventListener("click", (e) => this.proc());
          this.ele.addEventListener("touchend", (e) => this.proc());
        }
        proc() {
          return __async(this, null, function* () {
            yield this.datastore.save();
            toast.normal("saved");
          });
        }
      };
    }
  });

  // resources/ts/action/LoadAction.ts
  var LoadAction;
  var init_LoadAction = __esm({
    "resources/ts/action/LoadAction.ts"() {
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
              yield this.datastores.mine.save();
              yield this.datastores.other.load();
              yield this.papers.mine.clear();
              yield this.datastores.mine.clear();
              yield this.redraw(this.papers.other, this.datastores.other, this.pen);
            }
            if (periodic) {
              const sec = 3;
              setTimeout(() => this.proc(true), sec * 1e3);
            }
          });
        }
        redraw(paper, datastore, pen) {
          return __async(this, null, function* () {
            const draws = datastore.getDraws();
            let prepoint = null;
            if (this.first) {
              paper.getCnv().style.visibility = "hidden";
            }
            for (const draw of draws) {
              const bkimg = yield this.toImage(paper.getCnv());
              paper.clear();
              const strokes = draw.getStrokes();
              for (const s of strokes) {
                if (s.isEraser()) {
                  pen.opt.color = s.color;
                  pen.opt.eraser = true;
                } else {
                  pen.opt.color = s.color;
                  pen.opt.eraser = false;
                }
                for (const p of s.getPoints()) {
                  pen.proc(p.x, p.y, prepoint, paper);
                  prepoint = p;
                }
                prepoint = null;
              }
              paper.getCtx().drawImage(bkimg, 0, 0, bkimg.width, bkimg.height);
            }
            if (this.first) {
              paper.getCnv().style.visibility = "visible";
              this.first = false;
            }
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
        isStartMove(now) {
          return this.isMove(now) && this.tool === null;
        }
        isMove(now) {
          return now === "move" && this.event === "down";
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
          this.opt = {
            color: "",
            eraser: false
          };
          this.clone = (0, import_rfdc.default)();
        }
        init(color) {
          this.opt.eraser = false;
          this.opt.color = color;
          this.optbk = null;
        }
        proc(x, y, prep, paper) {
          let pre = prep;
          if (pre == null) {
            pre = new Point(x, y);
          }
          const ctx = paper.getCtx();
          if (this.opt.eraser) {
            this.erase(x, y, pre, ctx);
          } else {
            this.pen(x, y, pre, ctx);
          }
        }
        pen(x, y, pre, ctx) {
          ctx.save();
          ctx.beginPath();
          ctx.lineCap = "round";
          ctx.lineWidth = 2;
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
          this.pen.opt.eraser = !this.pen.opt.eraser;
          const enable = "has-background-primary";
          const disable = "has-background-light";
          if (this.pen.opt.eraser) {
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
        init(pen, color) {
          this.pen = pen;
          const handler = (ev) => {
            const item = ev.target;
            const color2 = item.style.backgroundColor;
            this.pen.opt.color = color2;
            toast.normal(`change to ${color2}`);
          };
          document.querySelectorAll(".pen-color").forEach((ele) => {
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
            load: new LoadElement()
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
          this.element.zoomscroll.init(this.action.zoomscroll);
          this.element.save.init(this.mine.draw);
          this.element.color.init(this.mine.pen, color);
          this.element.eraser.init(this.mine.pen);
          this.element.undo.init(this.mine.paper, this.mine.draw, this.mine.pen);
          this.element.back.init(this.mine.draw);
          this.element.load.init(this.action.load);
          this.device.mouse.init(this, this.mine.paper);
          this.device.pointer.init(this, this.mine.paper);
          this.device.touch.init(this, this.mine.paper, this.action.zoomscroll);
          this.action.load.init(this.mine.paper, this.other.paper, this.mine.draw, this.other.draw, this.other.pen, this.status.draw);
          this.action.zoomscroll.init(this.element.wrapdiv, this.element.zoomscroll);
          this.mine.pen.init(color);
          this.mine.draw.init(this.mine.pen);
        }
        loadServerData() {
          var _a;
          const ids = [
            "#sd-color"
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
              const c = this.mine.pen.opt.color;
              this.mine.draw.pushPoint(x, y);
              break;
            case "zoom":
              this.action.zoomscroll.zoomdrag(x, y);
              break;
          }
        }
        up(dev, e, p) {
          const x = p.x;
          const y = p.y;
          e.preventDefault();
          this.status.draw.endStroke();
          this.mine.draw.endStroke();
          this.element.wrapdiv.setNormal();
          this.nowsensor = null;
        }
      };
    }
  });

  // resources/ts/app.ts
  var require_app = __commonJS({
    "resources/ts/app.ts"(exports) {
      init_DrawEventHandler();
      var bulmaNavDrop = (e) => {
        var _a, _b;
        const target = e.target;
        (_b = (_a = target.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.classList.toggle("is-active");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvUGFwZXJFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9kYXRhL0RyYXcudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd01pbmUudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd090aGVyLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvTW91c2VTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL3NlbnNvci9Qb2ludGVyU2Vuc29yLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvVG91Y2hTZW5zb3IudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy91L3UudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvU2F2ZUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9Mb2FkQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0xvYWRFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd1N0YXR1cy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmZkYy9pbmRleC5qcyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYWN0aW9uL1BlbkFjdGlvbi50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9VbmRvRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYWN0aW9uL1pvb21TY3JvbGxBY3Rpb24udHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvWm9vbUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvRXJhc2VyRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9Db2xvckVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvQmFja0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL0RyYXdFdmVudEhhbmRsZXIudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FwcC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXG5leHBvcnQgY2xhc3MgUGFwZXJFbGVtZW50IHtcbiAgICBwcml2YXRlIGNudjogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU1pbmUoKTogUGFwZXJFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXBlckVsZW1lbnQoXCIjbXljYW52YXNcIik7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU90aGVyKCk6IFBhcGVyRWxlbWVudCB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXJFbGVtZW50KFwiI290aGVyY2FudmFzXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNudi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEN0eCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRDbnYoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jbnY7XG4gICAgfVxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdzogbnVtYmVyID0gdGhpcy5jbnYud2lkdGg7XG4gICAgICAgIGNvbnN0IGg6IG51bWJlciA9IHRoaXMuY252LmhlaWdodDtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xuICAgIH1cbn1cbiIsICJleHBvcnQgY2xhc3MgRHJhdyB7XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzOiBTdHJva2VbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cbiAgICBwdWJsaWMgcHVzaChwOiBTdHJva2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zLnB1c2gocCk7XG4gICAgfVxuICAgIHB1YmxpYyBwb3AoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJldDogU3Ryb2tlIHwgbnVsbCA9IHRoaXMucy5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIHBlZWsoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJldDogU3Ryb2tlIHwgbnVsbCA9IHRoaXMucy5sZW5ndGggPiAwID8gdGhpcy5zW3RoaXMucy5sZW5ndGggLSAxXSA6IG51bGw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zID0gW107XG4gICAgfVxuICAgIHB1YmxpYyBnZXRTdHJva2VzKCk6IFN0cm9rZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucztcbiAgICB9XG4gICAgcHVibGljIGxhc3RTdHJva2VzKCk6IFN0cm9rZSB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNbdGhpcy5zLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBqc29uKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucykge1xuICAgICAgICAgICAgcmV0LnB1c2gocC5qc29uKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgWyR7cmV0LmpvaW4oXCIsXCIpfV1gO1xuICAgIH1cbiAgICBwdWJsaWMgcGFyc2Uoc3Ryb2tlczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBjb25zdCB0bXAgPSBuZXcgU3Ryb2tlKCk7XG4gICAgICAgICAgICB0bXAucGFyc2Uoc1swXSwgc1sxXSk7XG4gICAgICAgICAgICB0aGlzLnMucHVzaCh0bXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucy5sZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN0cm9rZSB7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUS19FUkFTRVIgPSBcImVcIjtcblxuICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nOyAvLyBcdTZEODhcdTMwNTdcdTMwQjRcdTMwRTBcdTMwNkVcdTU4MzRcdTU0MDhcdTMwNkZlXHUzMDZFXHUzMDdGXG4gICAgcHJpdmF0ZSBwOiBQb2ludFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIHB1c2gocDogUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wLnB1c2gocCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRQb2ludHMoKTogUG9pbnRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnA7XG4gICAgfVxuICAgIHB1YmxpYyBsYXN0UG9pbnQoKTogUG9pbnQgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMucC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucFt0aGlzLnAubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wLmxlbmd0aDtcbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wKSB7XG4gICAgICAgICAgICByZXQucHVzaChwLmpzb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBbXCIke3RoaXMuY29sb3J9XCIsWyR7cmV0LmpvaW4oXCIsXCIpfV1dYDtcbiAgICB9XG4gICAgcHVibGljIHBhcnNlKGNvbG9yOiBzdHJpbmcsIGFycjogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFycikge1xuXG4gICAgICAgICAgICBjb25zdCB0bXAgPSBuZXcgUG9pbnQocGFyc2VJbnQoYVswXSksIHBhcnNlSW50KGFbMV0pKTtcbiAgICAgICAgICAgIHRoaXMucC5wdXNoKHRtcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGlzRXJhc2VyKCkge1xuICAgICAgICBjb25zdCByZXQgPSB0aGlzLmNvbG9yID09PSBTdHJva2UuVEtfRVJBU0VSO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgaXNQZW4oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0VyYXNlcigpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50IHtcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYFske3RoaXMueH0sJHt0aGlzLnl9XWA7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBpc1NhbWUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgY29uZDE6IGJvb2xlYW4gPSB4ID09PSB0aGlzLng7XG4gICAgICAgIGNvbnN0IGNvbmQyOiBib29sZWFuID0geSA9PT0gdGhpcy55O1xuICAgICAgICByZXR1cm4gY29uZDEgJiYgY29uZDI7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXcsIFN0cm9rZSwgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1BlbkFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd01pbmUge1xuICAgIHByaXZhdGUgZHJhdzogRHJhdztcbiAgICBwcml2YXRlIG5vd3N0cm9rZTogU3Ryb2tlO1xuICAgIHByaXZhdGUgdXNlcl9pZDogc3RyaW5nIHwgbnVsbDtcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwcml2YXRlIHNhdmVkU3Ryb2tlOiBTdHJva2UgfCBudWxsOyAvLyBcdTRGRERcdTVCNThcdTMwNTdcdTMwNUZcdTMwNjhcdTMwNERcdTMwNkVzdHJva2VcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xuICAgICAgICB0aGlzLm5vd3N0cm9rZSA9IG5ldyBTdHJva2UoKTtcbiAgICAgICAgdGhpcy51c2VyX2lkID0gbnVsbDtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdGhpcy5wYXBlcl9pZCA9IHBhcGVyX2lkO1xuICAgICAgICB0aGlzLnNhdmVkU3Ryb2tlID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbikge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaFBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmICh0aGlzLm5vd3N0cm9rZS5sZW5ndGgoKSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gXHU2NzAwXHU1MjFEXHUzMDZFXHU3MEI5XHUzMDZBXHUzMDg5Y29sb3JcdTMwNkVcdThBMkRcdTVCOUFcbiAgICAgICAgICAgIHRoaXMubm93c3Ryb2tlLmNvbG9yID0gdGhpcy5wZW4ub3B0LmVyYXNlciA/IFN0cm9rZS5US19FUkFTRVIgOiB0aGlzLnBlbi5vcHQuY29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcCA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgdGhpcy5ub3dzdHJva2UucHVzaChwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdFBvaW50KCk6IFBvaW50IHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3N0cm9rZS5sYXN0UG9pbnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kU3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICAvLyBTdHJva2VcdTMwNENcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdkcmF3XHUzMDZCXHUzMEQ3XHUzMEMzXHUzMEI3XHUzMEU1XG4gICAgICAgIGlmICh0aGlzLm5vd3N0cm9rZS5sZW5ndGgoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhdy5wdXNoKHRoaXMubm93c3Ryb2tlKTtcbiAgICAgICAgICAgIC8vIFx1NkIyMVx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2NnN0cm9rZVx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlxuICAgICAgICAgICAgdGhpcy5ub3dzdHJva2UgPSBuZXcgU3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIHNhdmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHVybHM6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgY29uc3QgcGFwZXJfaWQ6IG51bWJlciA9IHBhcnNlSW50KHVybHNbdXJscy5sZW5ndGggLSAxXSk7XG4gICAgICAgIGNvbnN0IHVybCA9IGAvYXBpL2RyYXcvJHtwYXBlcl9pZH1gO1xuICAgICAgICBjb25zdCBwb3N0ZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBwb3N0ZGF0YS5hcHBlbmQoXCJqc29uX2RyYXdcIiwgdGhpcy5kcmF3Lmpzb24oKSk7XG4gICAgICAgIHBvc3RkYXRhLmFwcGVuZChcInVzZXJfaWRcIiwgPHN0cmluZz50aGlzLnVzZXJfaWQpO1xuICAgICAgICBjb25zdCBvcHRpb246IFJlcXVlc3RJbml0ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IHBvc3RkYXRhLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb24pO1xuICAgICAgICBjb25zdCByZXNfc2F2ZSA9IEpTT04ucGFyc2UoYXdhaXQgcmVzcG9uc2UudGV4dCgpKTtcbiAgICAgICAgaWYgKHRoaXMudXNlcl9pZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51c2VyX2lkID0gcmVzX3NhdmUudXNlcl9pZC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZWRTdHJva2UgPSB0aGlzLmRyYXcucGVlaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5kcmF3LmNsZWFyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVuZG8oKTogU3Ryb2tlW10ge1xuICAgICAgICB0aGlzLmRyYXcuZ2V0U3Ryb2tlcygpLnBvcCgpO1xuICAgICAgICBjb25zdCByZXQgPSB0aGlzLmRyYXcuZ2V0U3Ryb2tlcygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXROb3dTdHJva2UoKTogU3Ryb2tlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm93c3Ryb2tlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFx1NEZERFx1NUI1OFx1MzA1N1x1MzA1Rlx1MzBCOVx1MzBDOFx1MzBFRFx1MzBGQ1x1MzBBRlx1NjU3MFx1MzA0Q1x1NkI2M1x1MzA1N1x1MzA1MVx1MzA4Q1x1MzA3MFx1NEZERFx1NUI1OFx1NkUwOFx1MzA3Rlx1MzAwMlx1NTg5N1x1MzA0OFx1MzA4Qlx1MzA3MFx1MzA0Qlx1MzA4QVx1MzA2N1x1MzA2Rlx1MzA2QVx1MzA0Rlx1MzAwMXVuZG9cdTMwNjdcdTZFMUJcdTMwOEJcdTU4MzRcdTU0MDhcdTMwODJcdTMwNDJcdTMwOEFcdTMwMDJcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTYXZlZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgcmV0OiBib29sZWFuID0gdGhpcy5zYXZlZFN0cm9rZSA9PT0gdGhpcy5kcmF3LnBlZWsoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhdywgU3Ryb2tlLCBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3T3RoZXIge1xuICAgIHByaXZhdGUgZHJhd3M6IERyYXdbXTsgLy8gXHU4MUVBXHU1MjA2XHU0RUU1XHU1OTE2XHVGRjFEXHU4OTA3XHU2NTcwXHU0RUJBXHUzMDZFXHUzMEM3XHUzMEZDXHUzMEJGXHUzMDRDXHUzMDQyXHUzMDhCXHUzMDVGXHUzMDgxXG4gICAgcHJpdmF0ZSBwYXBlcl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXIgfCBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZHJhd3MgPSBbXTtcbiAgICAgICAgdGhpcy51c2VyX2lkID0gbnVsbDtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdGhpcy5wYXBlcl9pZCA9IHBhcGVyX2lkO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgbG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYC9hcGkvZHJhdy8ke3RoaXMucGFwZXJfaWR9YDtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgICAgIC8vIFx1NEUwMFx1NjVFNlx1N0E3QVx1MzA2Qlx1MzA1N1x1MzA2Nlx1NjgzQ1x1N0QwRFx1MzA1N1x1NzZGNFx1MzA1N1xuICAgICAgICB0aGlzLmRyYXdzLnNwbGljZSgwLCB0aGlzLmRyYXdzLmxlbmd0aCk7XG4gICAgICAgIGZvcihjb25zdCBkIG9mIEpTT04ucGFyc2UodGV4dCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZC5qc29uX2RyYXcpO1xuICAgICAgICAgICAgY29uc3QgZHJhdyA9IG5ldyBEcmF3KCk7XG4gICAgICAgICAgICBkcmF3LnBhcnNlKG9iaik7XG4gICAgICAgICAgICB0aGlzLmRyYXdzLnB1c2goZHJhdyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RHJhd3MoKTogRHJhd1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd3M7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIE1vdXNlU2Vuc29yIHtcbiAgICBwcml2YXRlIHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIGNhbnZhc2hhbmRsZXJzOiAoKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpW10gPSBbXTtcblxuICAgIHB1YmxpYyBpbml0KHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyLCBwYXBlcjogUGFwZXJFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2Vuc2UgPSBzZW5zZTtcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2V1cFwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNlZG93blwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2Vtb3ZlXCJdID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZWxlYXZlXCJdID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGREZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZURlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcChlOiBNb3VzZUV2ZW50KTogUG9pbnQge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBlLm9mZnNldFg7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IGUub2Zmc2V0WTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd0V2ZW50SGFuZGxlciB9IGZyb20gXCIuLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuXG5leHBvcnQgY2xhc3MgUG9pbnRlclNlbnNvciB7XG4gICAgcHJpdmF0ZSBzZW5zZTogRHJhd0V2ZW50SGFuZGxlcjtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJ1cFwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVyZG93blwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UuZG93bihcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJtb3ZlXCJdID0gKGU6IFBvaW50ZXJFdmVudCkgPT4gdGhpcy5zZW5zZS5tb3ZlKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcmxlYXZlXCJdID0gKGU6IFBvaW50ZXJFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVEZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcChlKTogUG9pbnQge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBlLm9mZnNldFg7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IGUub2Zmc2V0WTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd0V2ZW50SGFuZGxlciB9IGZyb20gXCIuLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5pbXBvcnQgeyBab29tU2Nyb2xsQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uXCI7XG5leHBvcnQgY2xhc3MgVG91Y2hTZW5zb3Ige1xuICAgIHByaXZhdGUgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXI7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbjtcbiAgICBwcml2YXRlIGNhbnZhc2hhbmRsZXJzOiAoKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpW10gPSBbXTtcblxuICAgIHB1YmxpYyBpbml0KHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyLCBwYXBlcjogUGFwZXJFbGVtZW50LCB6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2Vuc2UgPSBzZW5zZTtcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwgPSB6b29tc2Nyb2xsO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2hlbmRcIl0gPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaHN0YXJ0XCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UuZG93bihcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaG1vdmVcIl0gPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5zZW5zZS5tb3ZlKFwidG91Y2hcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNobGVhdmVcIl0gPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuYWRkRGVmYXVsdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERlZmF1bHRMaXN0ZW5lcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGVmYXVsdExpc3RlbmVyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHAoZTogVG91Y2hFdmVudCk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgY3QgPSBlLmNoYW5nZWRUb3VjaGVzWzBdXG4gICAgICAgIGNvbnN0IGJjID0gKDxIVE1MQ2FudmFzRWxlbWVudD5lLnRhcmdldCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHggPSBjdC5jbGllbnRYIC0gYmMubGVmdDtcbiAgICAgICAgY29uc3QgeSA9IGN0LmNsaWVudFkgLSBiYy50b3A7XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RXpvb21cdTRGNERcdTdGNkVcdTMwNkVcdTg4RENcdTZCNjNcdTMwNENcdTMwNEJcdTMwNEJcdTMwODlcdTMwNkFcdTMwNDRcdTMwNkVcdTMwNjdcdThBQkZcdTY1NzRcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4IC8gdGhpcy56b29tc2Nyb2xsLmdldFpvb20oKSwgeSAvIHRoaXMuem9vbXNjcm9sbC5nZXRab29tKCkpO1xuICAgIH1cbn1cbiIsICIvKiFcbiogc3dlZXRhbGVydDIgdjExLjQuMjZcbiogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuU3dlZXRhbGVydDIgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICBjb25zdCBjb25zb2xlUHJlZml4ID0gJ1N3ZWV0QWxlcnQyOic7XG4gIC8qKlxuICAgKiBGaWx0ZXIgdGhlIHVuaXF1ZSB2YWx1ZXMgaW50byBhIG5ldyBhcnJheVxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cblxuICBjb25zdCB1bmlxdWVBcnJheSA9IGFyciA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGFycltpXSkgPT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFycltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIENhcGl0YWxpemUgdGhlIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuXG4gIGNvbnN0IGNhcGl0YWxpemVGaXJzdExldHRlciA9IHN0ciA9PiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gIC8qKlxuICAgKiBTdGFuZGFyZGl6ZSBjb25zb2xlIHdhcm5pbmdzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgQXJyYXl9IG1lc3NhZ2VcbiAgICovXG5cbiAgY29uc3Qgd2FybiA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUud2FybihcIlwiLmNvbmNhdChjb25zb2xlUHJlZml4LCBcIiBcIikuY29uY2F0KHR5cGVvZiBtZXNzYWdlID09PSAnb2JqZWN0JyA/IG1lc3NhZ2Uuam9pbignICcpIDogbWVzc2FnZSkpO1xuICB9O1xuICAvKipcbiAgICogU3RhbmRhcmRpemUgY29uc29sZSBlcnJvcnNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICovXG5cbiAgY29uc3QgZXJyb3IgPSBtZXNzYWdlID0+IHtcbiAgICBjb25zb2xlLmVycm9yKFwiXCIuY29uY2F0KGNvbnNvbGVQcmVmaXgsIFwiIFwiKS5jb25jYXQobWVzc2FnZSkpO1xuICB9O1xuICAvKipcbiAgICogUHJpdmF0ZSBnbG9iYWwgc3RhdGUgZm9yIGB3YXJuT25jZWBcbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBjb25zdCBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMgPSBbXTtcbiAgLyoqXG4gICAqIFNob3cgYSBjb25zb2xlIHdhcm5pbmcsIGJ1dCBvbmx5IGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gc2hvd25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICovXG5cbiAgY29uc3Qgd2Fybk9uY2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAoIXByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcy5pbmNsdWRlcyhtZXNzYWdlKSkge1xuICAgICAgcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICB3YXJuKG1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFNob3cgYSBvbmUtdGltZSBjb25zb2xlIHdhcm5pbmcgYWJvdXQgZGVwcmVjYXRlZCBwYXJhbXMvbWV0aG9kc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVwcmVjYXRlZFBhcmFtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VJbnN0ZWFkXG4gICAqL1xuXG4gIGNvbnN0IHdhcm5BYm91dERlcHJlY2F0aW9uID0gKGRlcHJlY2F0ZWRQYXJhbSwgdXNlSW5zdGVhZCkgPT4ge1xuICAgIHdhcm5PbmNlKFwiXFxcIlwiLmNvbmNhdChkZXByZWNhdGVkUGFyYW0sIFwiXFxcIiBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS4gUGxlYXNlIHVzZSBcXFwiXCIpLmNvbmNhdCh1c2VJbnN0ZWFkLCBcIlxcXCIgaW5zdGVhZC5cIikpO1xuICB9O1xuICAvKipcbiAgICogSWYgYGFyZ2AgaXMgYSBmdW5jdGlvbiwgY2FsbCBpdCAod2l0aCBubyBhcmd1bWVudHMgb3IgY29udGV4dCkgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICAgKiBPdGhlcndpc2UsIGp1c3QgcGFzcyB0aGUgdmFsdWUgdGhyb3VnaFxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgYW55fSBhcmdcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG5cbiAgY29uc3QgY2FsbElmRnVuY3Rpb24gPSBhcmcgPT4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJyA/IGFyZygpIDogYXJnO1xuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaGFzVG9Qcm9taXNlRm4gPSBhcmcgPT4gYXJnICYmIHR5cGVvZiBhcmcudG9Qcm9taXNlID09PSAnZnVuY3Rpb24nO1xuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG5cbiAgY29uc3QgYXNQcm9taXNlID0gYXJnID0+IGhhc1RvUHJvbWlzZUZuKGFyZykgPyBhcmcudG9Qcm9taXNlKCkgOiBQcm9taXNlLnJlc29sdmUoYXJnKTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzUHJvbWlzZSA9IGFyZyA9PiBhcmcgJiYgUHJvbWlzZS5yZXNvbHZlKGFyZykgPT09IGFyZztcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cblxuICBjb25zdCBnZXRSYW5kb21FbGVtZW50ID0gYXJyID0+IGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG5cbiAgY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcbiAgICB0aXRsZTogJycsXG4gICAgdGl0bGVUZXh0OiAnJyxcbiAgICB0ZXh0OiAnJyxcbiAgICBodG1sOiAnJyxcbiAgICBmb290ZXI6ICcnLFxuICAgIGljb246IHVuZGVmaW5lZCxcbiAgICBpY29uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBpY29uSHRtbDogdW5kZWZpbmVkLFxuICAgIHRlbXBsYXRlOiB1bmRlZmluZWQsXG4gICAgdG9hc3Q6IGZhbHNlLFxuICAgIHNob3dDbGFzczoge1xuICAgICAgcG9wdXA6ICdzd2FsMi1zaG93JyxcbiAgICAgIGJhY2tkcm9wOiAnc3dhbDItYmFja2Ryb3Atc2hvdycsXG4gICAgICBpY29uOiAnc3dhbDItaWNvbi1zaG93J1xuICAgIH0sXG4gICAgaGlkZUNsYXNzOiB7XG4gICAgICBwb3B1cDogJ3N3YWwyLWhpZGUnLFxuICAgICAgYmFja2Ryb3A6ICdzd2FsMi1iYWNrZHJvcC1oaWRlJyxcbiAgICAgIGljb246ICdzd2FsMi1pY29uLWhpZGUnXG4gICAgfSxcbiAgICBjdXN0b21DbGFzczoge30sXG4gICAgdGFyZ2V0OiAnYm9keScsXG4gICAgY29sb3I6IHVuZGVmaW5lZCxcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBoZWlnaHRBdXRvOiB0cnVlLFxuICAgIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgIGFsbG93RXNjYXBlS2V5OiB0cnVlLFxuICAgIGFsbG93RW50ZXJLZXk6IHRydWUsXG4gICAgc3RvcEtleWRvd25Qcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICBrZXlkb3duTGlzdGVuZXJDYXB0dXJlOiBmYWxzZSxcbiAgICBzaG93Q29uZmlybUJ1dHRvbjogdHJ1ZSxcbiAgICBzaG93RGVueUJ1dHRvbjogZmFsc2UsXG4gICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgcHJlQ29uZmlybTogdW5kZWZpbmVkLFxuICAgIHByZURlbnk6IHVuZGVmaW5lZCxcbiAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICBjb25maXJtQnV0dG9uQXJpYUxhYmVsOiAnJyxcbiAgICBjb25maXJtQnV0dG9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBkZW55QnV0dG9uVGV4dDogJ05vJyxcbiAgICBkZW55QnV0dG9uQXJpYUxhYmVsOiAnJyxcbiAgICBkZW55QnV0dG9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsJyxcbiAgICBjYW5jZWxCdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGNhbmNlbEJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgYnV0dG9uc1N0eWxpbmc6IHRydWUsXG4gICAgcmV2ZXJzZUJ1dHRvbnM6IGZhbHNlLFxuICAgIGZvY3VzQ29uZmlybTogdHJ1ZSxcbiAgICBmb2N1c0Rlbnk6IGZhbHNlLFxuICAgIGZvY3VzQ2FuY2VsOiBmYWxzZSxcbiAgICByZXR1cm5Gb2N1czogdHJ1ZSxcbiAgICBzaG93Q2xvc2VCdXR0b246IGZhbHNlLFxuICAgIGNsb3NlQnV0dG9uSHRtbDogJyZ0aW1lczsnLFxuICAgIGNsb3NlQnV0dG9uQXJpYUxhYmVsOiAnQ2xvc2UgdGhpcyBkaWFsb2cnLFxuICAgIGxvYWRlckh0bWw6ICcnLFxuICAgIHNob3dMb2FkZXJPbkNvbmZpcm06IGZhbHNlLFxuICAgIHNob3dMb2FkZXJPbkRlbnk6IGZhbHNlLFxuICAgIGltYWdlVXJsOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VXaWR0aDogdW5kZWZpbmVkLFxuICAgIGltYWdlSGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgaW1hZ2VBbHQ6ICcnLFxuICAgIHRpbWVyOiB1bmRlZmluZWQsXG4gICAgdGltZXJQcm9ncmVzc0JhcjogZmFsc2UsXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICBwYWRkaW5nOiB1bmRlZmluZWQsXG4gICAgYmFja2dyb3VuZDogdW5kZWZpbmVkLFxuICAgIGlucHV0OiB1bmRlZmluZWQsXG4gICAgaW5wdXRQbGFjZWhvbGRlcjogJycsXG4gICAgaW5wdXRMYWJlbDogJycsXG4gICAgaW5wdXRWYWx1ZTogJycsXG4gICAgaW5wdXRPcHRpb25zOiB7fSxcbiAgICBpbnB1dEF1dG9UcmltOiB0cnVlLFxuICAgIGlucHV0QXR0cmlidXRlczoge30sXG4gICAgaW5wdXRWYWxpZGF0b3I6IHVuZGVmaW5lZCxcbiAgICByZXR1cm5JbnB1dFZhbHVlT25EZW55OiBmYWxzZSxcbiAgICB2YWxpZGF0aW9uTWVzc2FnZTogdW5kZWZpbmVkLFxuICAgIGdyb3c6IGZhbHNlLFxuICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcbiAgICBwcm9ncmVzc1N0ZXBzOiBbXSxcbiAgICBjdXJyZW50UHJvZ3Jlc3NTdGVwOiB1bmRlZmluZWQsXG4gICAgcHJvZ3Jlc3NTdGVwc0Rpc3RhbmNlOiB1bmRlZmluZWQsXG4gICAgd2lsbE9wZW46IHVuZGVmaW5lZCxcbiAgICBkaWRPcGVuOiB1bmRlZmluZWQsXG4gICAgZGlkUmVuZGVyOiB1bmRlZmluZWQsXG4gICAgd2lsbENsb3NlOiB1bmRlZmluZWQsXG4gICAgZGlkQ2xvc2U6IHVuZGVmaW5lZCxcbiAgICBkaWREZXN0cm95OiB1bmRlZmluZWQsXG4gICAgc2Nyb2xsYmFyUGFkZGluZzogdHJ1ZVxuICB9O1xuICBjb25zdCB1cGRhdGFibGVQYXJhbXMgPSBbJ2FsbG93RXNjYXBlS2V5JywgJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2JhY2tncm91bmQnLCAnYnV0dG9uc1N0eWxpbmcnLCAnY2FuY2VsQnV0dG9uQXJpYUxhYmVsJywgJ2NhbmNlbEJ1dHRvbkNvbG9yJywgJ2NhbmNlbEJ1dHRvblRleHQnLCAnY2xvc2VCdXR0b25BcmlhTGFiZWwnLCAnY2xvc2VCdXR0b25IdG1sJywgJ2NvbG9yJywgJ2NvbmZpcm1CdXR0b25BcmlhTGFiZWwnLCAnY29uZmlybUJ1dHRvbkNvbG9yJywgJ2NvbmZpcm1CdXR0b25UZXh0JywgJ2N1cnJlbnRQcm9ncmVzc1N0ZXAnLCAnY3VzdG9tQ2xhc3MnLCAnZGVueUJ1dHRvbkFyaWFMYWJlbCcsICdkZW55QnV0dG9uQ29sb3InLCAnZGVueUJ1dHRvblRleHQnLCAnZGlkQ2xvc2UnLCAnZGlkRGVzdHJveScsICdmb290ZXInLCAnaGlkZUNsYXNzJywgJ2h0bWwnLCAnaWNvbicsICdpY29uQ29sb3InLCAnaWNvbkh0bWwnLCAnaW1hZ2VBbHQnLCAnaW1hZ2VIZWlnaHQnLCAnaW1hZ2VVcmwnLCAnaW1hZ2VXaWR0aCcsICdwcmVDb25maXJtJywgJ3ByZURlbnknLCAncHJvZ3Jlc3NTdGVwcycsICdyZXR1cm5Gb2N1cycsICdyZXZlcnNlQnV0dG9ucycsICdzaG93Q2FuY2VsQnV0dG9uJywgJ3Nob3dDbG9zZUJ1dHRvbicsICdzaG93Q29uZmlybUJ1dHRvbicsICdzaG93RGVueUJ1dHRvbicsICd0ZXh0JywgJ3RpdGxlJywgJ3RpdGxlVGV4dCcsICd3aWxsQ2xvc2UnXTtcbiAgY29uc3QgZGVwcmVjYXRlZFBhcmFtcyA9IHt9O1xuICBjb25zdCB0b2FzdEluY29tcGF0aWJsZVBhcmFtcyA9IFsnYWxsb3dPdXRzaWRlQ2xpY2snLCAnYWxsb3dFbnRlcktleScsICdiYWNrZHJvcCcsICdmb2N1c0NvbmZpcm0nLCAnZm9jdXNEZW55JywgJ2ZvY3VzQ2FuY2VsJywgJ3JldHVybkZvY3VzJywgJ2hlaWdodEF1dG8nLCAna2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSddO1xuICAvKipcbiAgICogSXMgdmFsaWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVmFsaWRQYXJhbWV0ZXIgPSBwYXJhbU5hbWUgPT4ge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVmYXVsdFBhcmFtcywgcGFyYW1OYW1lKTtcbiAgfTtcbiAgLyoqXG4gICAqIElzIHZhbGlkIHBhcmFtZXRlciBmb3IgU3dhbC51cGRhdGUoKSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNVcGRhdGFibGVQYXJhbWV0ZXIgPSBwYXJhbU5hbWUgPT4ge1xuICAgIHJldHVybiB1cGRhdGFibGVQYXJhbXMuaW5kZXhPZihwYXJhbU5hbWUpICE9PSAtMTtcbiAgfTtcbiAgLyoqXG4gICAqIElzIGRlcHJlY2F0ZWQgcGFyYW1ldGVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH1cbiAgICovXG5cbiAgY29uc3QgaXNEZXByZWNhdGVkUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gZGVwcmVjYXRlZFBhcmFtc1twYXJhbU5hbWVdO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuXG4gIGNvbnN0IGNoZWNrSWZQYXJhbUlzVmFsaWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgd2FybihcIlVua25vd24gcGFyYW1ldGVyIFxcXCJcIi5jb25jYXQocGFyYW0sIFwiXFxcIlwiKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuXG5cbiAgY29uc3QgY2hlY2tJZlRvYXN0UGFyYW1Jc1ZhbGlkID0gcGFyYW0gPT4ge1xuICAgIGlmICh0b2FzdEluY29tcGF0aWJsZVBhcmFtcy5pbmNsdWRlcyhwYXJhbSkpIHtcbiAgICAgIHdhcm4oXCJUaGUgcGFyYW1ldGVyIFxcXCJcIi5jb25jYXQocGFyYW0sIFwiXFxcIiBpcyBpbmNvbXBhdGlibGUgd2l0aCB0b2FzdHNcIikpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbVxuICAgKi9cblxuXG4gIGNvbnN0IGNoZWNrSWZQYXJhbUlzRGVwcmVjYXRlZCA9IHBhcmFtID0+IHtcbiAgICBpZiAoaXNEZXByZWNhdGVkUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgd2FybkFib3V0RGVwcmVjYXRpb24ocGFyYW0sIGlzRGVwcmVjYXRlZFBhcmFtZXRlcihwYXJhbSkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFNob3cgcmVsZXZhbnQgd2FybmluZ3MgZm9yIGdpdmVuIHBhcmFtc1xuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzaG93V2FybmluZ3NGb3JQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIGlmICghcGFyYW1zLmJhY2tkcm9wICYmIHBhcmFtcy5hbGxvd091dHNpZGVDbGljaykge1xuICAgICAgd2FybignXCJhbGxvd091dHNpZGVDbGlja1wiIHBhcmFtZXRlciByZXF1aXJlcyBgYmFja2Ryb3BgIHBhcmFtZXRlciB0byBiZSBzZXQgdG8gYHRydWVgJyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICAgIGNoZWNrSWZQYXJhbUlzVmFsaWQocGFyYW0pO1xuXG4gICAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICAgIGNoZWNrSWZUb2FzdFBhcmFtSXNWYWxpZChwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIGNoZWNrSWZQYXJhbUlzRGVwcmVjYXRlZChwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN3YWxQcmVmaXggPSAnc3dhbDItJztcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGl0ZW1zXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAqL1xuXG4gIGNvbnN0IHByZWZpeCA9IGl0ZW1zID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGZvciAoY29uc3QgaSBpbiBpdGVtcykge1xuICAgICAgcmVzdWx0W2l0ZW1zW2ldXSA9IHN3YWxQcmVmaXggKyBpdGVtc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBjb25zdCBzd2FsQ2xhc3NlcyA9IHByZWZpeChbJ2NvbnRhaW5lcicsICdzaG93bicsICdoZWlnaHQtYXV0bycsICdpb3NmaXgnLCAncG9wdXAnLCAnbW9kYWwnLCAnbm8tYmFja2Ryb3AnLCAnbm8tdHJhbnNpdGlvbicsICd0b2FzdCcsICd0b2FzdC1zaG93bicsICdzaG93JywgJ2hpZGUnLCAnY2xvc2UnLCAndGl0bGUnLCAnaHRtbC1jb250YWluZXInLCAnYWN0aW9ucycsICdjb25maXJtJywgJ2RlbnknLCAnY2FuY2VsJywgJ2RlZmF1bHQtb3V0bGluZScsICdmb290ZXInLCAnaWNvbicsICdpY29uLWNvbnRlbnQnLCAnaW1hZ2UnLCAnaW5wdXQnLCAnZmlsZScsICdyYW5nZScsICdzZWxlY3QnLCAncmFkaW8nLCAnY2hlY2tib3gnLCAnbGFiZWwnLCAndGV4dGFyZWEnLCAnaW5wdXRlcnJvcicsICdpbnB1dC1sYWJlbCcsICd2YWxpZGF0aW9uLW1lc3NhZ2UnLCAncHJvZ3Jlc3Mtc3RlcHMnLCAnYWN0aXZlLXByb2dyZXNzLXN0ZXAnLCAncHJvZ3Jlc3Mtc3RlcCcsICdwcm9ncmVzcy1zdGVwLWxpbmUnLCAnbG9hZGVyJywgJ2xvYWRpbmcnLCAnc3R5bGVkJywgJ3RvcCcsICd0b3Atc3RhcnQnLCAndG9wLWVuZCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnY2VudGVyJywgJ2NlbnRlci1zdGFydCcsICdjZW50ZXItZW5kJywgJ2NlbnRlci1sZWZ0JywgJ2NlbnRlci1yaWdodCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ2dyb3ctcm93JywgJ2dyb3ctY29sdW1uJywgJ2dyb3ctZnVsbHNjcmVlbicsICdydGwnLCAndGltZXItcHJvZ3Jlc3MtYmFyJywgJ3RpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXInLCAnc2Nyb2xsYmFyLW1lYXN1cmUnLCAnaWNvbi1zdWNjZXNzJywgJ2ljb24td2FybmluZycsICdpY29uLWluZm8nLCAnaWNvbi1xdWVzdGlvbicsICdpY29uLWVycm9yJywgJ25vLXdhciddKTtcbiAgY29uc3QgaWNvblR5cGVzID0gcHJlZml4KFsnc3VjY2VzcycsICd3YXJuaW5nJywgJ2luZm8nLCAncXVlc3Rpb24nLCAnZXJyb3InXSk7XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHBvcHVwIGNvbnRhaW5lciB3aGljaCBjb250YWlucyB0aGUgYmFja2Ryb3AgYW5kIHRoZSBwb3B1cCBpdHNlbGYuXG4gICAqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENvbnRhaW5lciA9ICgpID0+IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuY29udGFpbmVyKSk7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JTdHJpbmdcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZWxlbWVudEJ5U2VsZWN0b3IgPSBzZWxlY3RvclN0cmluZyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcmV0dXJuIGNvbnRhaW5lciA/IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yU3RyaW5nKSA6IG51bGw7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGVsZW1lbnRCeUNsYXNzID0gY2xhc3NOYW1lID0+IHtcbiAgICByZXR1cm4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KGNsYXNzTmFtZSkpO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cblxuICBjb25zdCBnZXRQb3B1cCA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLnBvcHVwKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEljb24gPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5pY29uKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldFRpdGxlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMudGl0bGUpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SHRtbENvbnRhaW5lciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEltYWdlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuaW1hZ2UpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0UHJvZ3Jlc3NTdGVwcyA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwcyddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldFZhbGlkYXRpb25NZXNzYWdlID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENvbmZpcm1CdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY29uZmlybSkpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0RGVueUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5kZW55KSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJbnB1dExhYmVsID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2lucHV0LWxhYmVsJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0TG9hZGVyID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmxvYWRlcikpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q2FuY2VsQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmNhbmNlbCkpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0QWN0aW9ucyA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmFjdGlvbnMpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Rm9vdGVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuZm9vdGVyKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldFRpbWVyUHJvZ3Jlc3NCYXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q2xvc2VCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5jbG9zZSk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qa3VwL2ZvY3VzYWJsZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuXG4gIGNvbnN0IGZvY3VzYWJsZSA9IFwiXFxuICBhW2hyZWZdLFxcbiAgYXJlYVtocmVmXSxcXG4gIGlucHV0Om5vdChbZGlzYWJsZWRdKSxcXG4gIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksXFxuICB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksXFxuICBidXR0b246bm90KFtkaXNhYmxlZF0pLFxcbiAgaWZyYW1lLFxcbiAgb2JqZWN0LFxcbiAgZW1iZWQsXFxuICBbdGFiaW5kZXg9XFxcIjBcXFwiXSxcXG4gIFtjb250ZW50ZWRpdGFibGVdLFxcbiAgYXVkaW9bY29udHJvbHNdLFxcbiAgdmlkZW9bY29udHJvbHNdLFxcbiAgc3VtbWFyeVxcblwiO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAqL1xuXG4gIGNvbnN0IGdldEZvY3VzYWJsZUVsZW1lbnRzID0gKCkgPT4ge1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzV2l0aFRhYmluZGV4ID0gQXJyYXkuZnJvbShnZXRQb3B1cCgpLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKTpub3QoW3RhYmluZGV4PVwiMFwiXSknKSkgLy8gc29ydCBhY2NvcmRpbmcgdG8gdGFiaW5kZXhcbiAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgdGFiaW5kZXhBID0gcGFyc2VJbnQoYS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgY29uc3QgdGFiaW5kZXhCID0gcGFyc2VJbnQoYi5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuXG4gICAgICBpZiAodGFiaW5kZXhBID4gdGFiaW5kZXhCKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmICh0YWJpbmRleEEgPCB0YWJpbmRleEIpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgICBjb25zdCBvdGhlckZvY3VzYWJsZUVsZW1lbnRzID0gQXJyYXkuZnJvbShnZXRQb3B1cCgpLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlKSkuZmlsdGVyKGVsID0+IGVsLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSAhPT0gJy0xJyk7XG4gICAgcmV0dXJuIHVuaXF1ZUFycmF5KGZvY3VzYWJsZUVsZW1lbnRzV2l0aFRhYmluZGV4LmNvbmNhdChvdGhlckZvY3VzYWJsZUVsZW1lbnRzKSkuZmlsdGVyKGVsID0+IGlzVmlzaWJsZShlbCkpO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzTW9kYWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLnNob3duKSAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10pICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNUb2FzdCA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2V0UG9wdXAoKSAmJiBoYXNDbGFzcyhnZXRQb3B1cCgpLCBzd2FsQ2xhc3Nlcy50b2FzdCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNMb2FkaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBnZXRQb3B1cCgpLmhhc0F0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJyk7XG4gIH07XG5cbiAgY29uc3Qgc3RhdGVzID0ge1xuICAgIHByZXZpb3VzQm9keVBhZGRpbmc6IG51bGxcbiAgfTtcbiAgLyoqXG4gICAqIFNlY3VyZWx5IHNldCBpbm5lckhUTUwgb2YgYW4gZWxlbWVudFxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE5MjZcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgKi9cblxuICBjb25zdCBzZXRJbm5lckh0bWwgPSAoZWxlbSwgaHRtbCkgPT4ge1xuICAgIGVsZW0udGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmIChodG1sKSB7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwsIFwidGV4dC9odG1sXCIpO1xuICAgICAgQXJyYXkuZnJvbShwYXJzZWQucXVlcnlTZWxlY3RvcignaGVhZCcpLmNoaWxkTm9kZXMpLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgIH0pO1xuICAgICAgQXJyYXkuZnJvbShwYXJzZWQucXVlcnlTZWxlY3RvcignYm9keScpLmNoaWxkTm9kZXMpLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaGFzQ2xhc3MgPSAoZWxlbSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc0xpc3QgPSBjbGFzc05hbWUuc3BsaXQoL1xccysvKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTGlzdFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVtb3ZlQ3VzdG9tQ2xhc3NlcyA9IChlbGVtLCBwYXJhbXMpID0+IHtcbiAgICBBcnJheS5mcm9tKGVsZW0uY2xhc3NMaXN0KS5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBpZiAoIU9iamVjdC52YWx1ZXMoc3dhbENsYXNzZXMpLmluY2x1ZGVzKGNsYXNzTmFtZSkgJiYgIU9iamVjdC52YWx1ZXMoaWNvblR5cGVzKS5pbmNsdWRlcyhjbGFzc05hbWUpICYmICFPYmplY3QudmFsdWVzKHBhcmFtcy5zaG93Q2xhc3MpLmluY2x1ZGVzKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAqL1xuXG5cbiAgY29uc3QgYXBwbHlDdXN0b21DbGFzcyA9IChlbGVtLCBwYXJhbXMsIGNsYXNzTmFtZSkgPT4ge1xuICAgIHJlbW92ZUN1c3RvbUNsYXNzZXMoZWxlbSwgcGFyYW1zKTtcblxuICAgIGlmIChwYXJhbXMuY3VzdG9tQ2xhc3MgJiYgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0pIHtcbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0gIT09ICdzdHJpbmcnICYmICFwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXS5mb3JFYWNoKSB7XG4gICAgICAgIHJldHVybiB3YXJuKFwiSW52YWxpZCB0eXBlIG9mIGN1c3RvbUNsYXNzLlwiLmNvbmNhdChjbGFzc05hbWUsIFwiISBFeHBlY3RlZCBzdHJpbmcgb3IgaXRlcmFibGUgb2JqZWN0LCBnb3QgXFxcIlwiKS5jb25jYXQodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdLCBcIlxcXCJcIikpO1xuICAgICAgfVxuXG4gICAgICBhZGRDbGFzcyhlbGVtLCBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wdXBcbiAgICogQHBhcmFtIHtpbXBvcnQoJy4vcmVuZGVyZXJzL3JlbmRlcklucHV0JykuSW5wdXRDbGFzc30gaW5wdXRDbGFzc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldElucHV0ID0gKHBvcHVwLCBpbnB1dENsYXNzKSA9PiB7XG4gICAgaWYgKCFpbnB1dENsYXNzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGlucHV0Q2xhc3MpIHtcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzW2lucHV0Q2xhc3NdKSk7XG5cbiAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIiBpbnB1dFwiKSk7XG5cbiAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpjaGVja2VkXCIpKSB8fCBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCIgaW5wdXQ6Zmlyc3QtY2hpbGRcIikpO1xuXG4gICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgaW5wdXRcIikpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaW5wdXQpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnR9IGlucHV0XG4gICAqL1xuXG4gIGNvbnN0IGZvY3VzSW5wdXQgPSBpbnB1dCA9PiB7XG4gICAgaW5wdXQuZm9jdXMoKTsgLy8gcGxhY2UgY3Vyc29yIGF0IGVuZCBvZiB0ZXh0IGluIHRleHQgaW5wdXRcblxuICAgIGlmIChpbnB1dC50eXBlICE9PSAnZmlsZScpIHtcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIzNDU5MTVcbiAgICAgIGNvbnN0IHZhbCA9IGlucHV0LnZhbHVlO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIGlucHV0LnZhbHVlID0gdmFsO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgbnVsbH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCByZWFkb25seSBzdHJpbmdbXX0gY2xhc3NMaXN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uXG4gICAqL1xuXG4gIGNvbnN0IHRvZ2dsZUNsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0LCBjb25kaXRpb24pID0+IHtcbiAgICBpZiAoIXRhcmdldCB8fCAhY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjbGFzc0xpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjbGFzc0xpc3QgPSBjbGFzc0xpc3Quc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuXG4gICAgY2xhc3NMaXN0LmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0LmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgY29uZGl0aW9uID8gZWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25kaXRpb24gPyB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgbnVsbH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCByZWFkb25seSBzdHJpbmdbXX0gY2xhc3NMaXN0XG4gICAqL1xuXG4gIGNvbnN0IGFkZENsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0KSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIHRydWUpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICovXG5cbiAgY29uc3QgcmVtb3ZlQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QpID0+IHtcbiAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgZmFsc2UpO1xuICB9O1xuICAvKipcbiAgICogR2V0IGRpcmVjdCBjaGlsZCBvZiBhbiBlbGVtZW50IGJ5IGNsYXNzIG5hbWVcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldERpcmVjdENoaWxkQnlDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbS5jaGlsZHJlbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBoYXNDbGFzcyhjaGlsZCwgY2xhc3NOYW1lKSkge1xuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cblxuICBjb25zdCBhcHBseU51bWVyaWNhbFN0eWxlID0gKGVsZW0sIHByb3BlcnR5LCB2YWx1ZSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJcIi5jb25jYXQocGFyc2VJbnQodmFsdWUpKSkge1xuICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlIHx8IHBhcnNlSW50KHZhbHVlKSA9PT0gMCkge1xuICAgICAgZWxlbS5zdHlsZVtwcm9wZXJ0eV0gPSB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQodmFsdWUsIFwicHhcIikgOiB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlzcGxheVxuICAgKi9cblxuICBjb25zdCBzaG93ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICBsZXQgZGlzcGxheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ2ZsZXgnO1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqL1xuXG4gIGNvbnN0IGhpZGUgPSBlbGVtID0+IHtcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICovXG5cbiAgY29uc3Qgc2V0U3R5bGUgPSAocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICBjb25zdCBlbCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgIGlmIChlbCkge1xuICAgICAgZWwuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge2FueX0gY29uZGl0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuXG4gIGNvbnN0IHRvZ2dsZSA9IGZ1bmN0aW9uIChlbGVtLCBjb25kaXRpb24pIHtcbiAgICBsZXQgZGlzcGxheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ2ZsZXgnO1xuICAgIGNvbmRpdGlvbiA/IHNob3coZWxlbSwgZGlzcGxheSkgOiBoaWRlKGVsZW0pO1xuICB9O1xuICAvKipcbiAgICogYm9ycm93ZWQgZnJvbSBqcXVlcnkgJChlbGVtKS5pcygnOnZpc2libGUnKSBpbXBsZW1lbnRhdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1Zpc2libGUgPSBlbGVtID0+ICEhKGVsZW0gJiYgKGVsZW0ub2Zmc2V0V2lkdGggfHwgZWxlbS5vZmZzZXRIZWlnaHQgfHwgZWxlbS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCkpO1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGFsbEJ1dHRvbnNBcmVIaWRkZW4gPSAoKSA9PiAhaXNWaXNpYmxlKGdldENvbmZpcm1CdXR0b24oKSkgJiYgIWlzVmlzaWJsZShnZXREZW55QnV0dG9uKCkpICYmICFpc1Zpc2libGUoZ2V0Q2FuY2VsQnV0dG9uKCkpO1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzU2Nyb2xsYWJsZSA9IGVsZW0gPT4gISEoZWxlbS5zY3JvbGxIZWlnaHQgPiBlbGVtLmNsaWVudEhlaWdodCk7XG4gIC8qKlxuICAgKiBib3Jyb3dlZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NjM1MjExOVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBoYXNDc3NBbmltYXRpb24gPSBlbGVtID0+IHtcbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuICAgIGNvbnN0IGFuaW1EdXJhdGlvbiA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLWR1cmF0aW9uJykgfHwgJzAnKTtcbiAgICBjb25zdCB0cmFuc0R1cmF0aW9uID0gcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2l0aW9uLWR1cmF0aW9uJykgfHwgJzAnKTtcbiAgICByZXR1cm4gYW5pbUR1cmF0aW9uID4gMCB8fCB0cmFuc0R1cmF0aW9uID4gMDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc2V0XG4gICAqL1xuXG4gIGNvbnN0IGFuaW1hdGVUaW1lclByb2dyZXNzQmFyID0gZnVuY3Rpb24gKHRpbWVyKSB7XG4gICAgbGV0IHJlc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuXG4gICAgaWYgKGlzVmlzaWJsZSh0aW1lclByb2dyZXNzQmFyKSkge1xuICAgICAgaWYgKHJlc2V0KSB7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJztcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwid2lkdGggXCIuY29uY2F0KHRpbWVyIC8gMTAwMCwgXCJzIGxpbmVhclwiKTtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcwJSc7XG4gICAgICB9LCAxMCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBzdG9wVGltZXJQcm9ncmVzc0JhciA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXJXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRpbWVyUHJvZ3Jlc3NCYXIpLndpZHRoKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0cmFuc2l0aW9uJyk7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyRnVsbFdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUodGltZXJQcm9ncmVzc0Jhcikud2lkdGgpO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXJQZXJjZW50ID0gdGltZXJQcm9ncmVzc0JhcldpZHRoIC8gdGltZXJQcm9ncmVzc0JhckZ1bGxXaWR0aCAqIDEwMDtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0cmFuc2l0aW9uJyk7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiXCIuY29uY2F0KHRpbWVyUHJvZ3Jlc3NCYXJQZXJjZW50LCBcIiVcIik7XG4gIH07XG5cbiAgLyoqXG4gICAqIERldGVjdCBOb2RlIGVudlxuICAgKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbnN0IGlzTm9kZUVudiA9ICgpID0+IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCc7XG5cbiAgY29uc3QgUkVTVE9SRV9GT0NVU19USU1FT1VUID0gMTAwO1xuXG4gIC8qKiBAdHlwZSB7R2xvYmFsU3RhdGV9ICovXG5cbiAgY29uc3QgZ2xvYmFsU3RhdGUgPSB7fTtcblxuICBjb25zdCBmb2N1c1ByZXZpb3VzQWN0aXZlRWxlbWVudCA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBSZXN0b3JlIHByZXZpb3VzIGFjdGl2ZSAoZm9jdXNlZCkgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJldHVybkZvY3VzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cblxuXG4gIGNvbnN0IHJlc3RvcmVBY3RpdmVFbGVtZW50ID0gcmV0dXJuRm9jdXMgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmICghcmV0dXJuRm9jdXMpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeCA9IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgY29uc3QgeSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgICAgZ2xvYmFsU3RhdGUucmVzdG9yZUZvY3VzVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmb2N1c1ByZXZpb3VzQWN0aXZlRWxlbWVudCgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCBSRVNUT1JFX0ZPQ1VTX1RJTUVPVVQpOyAvLyBpc3N1ZXMvOTAwXG5cbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh4LCB5KTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzd2VldEhUTUwgPSBcIlxcbiA8ZGl2IGFyaWEtbGFiZWxsZWRieT1cXFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCIgYXJpYS1kZXNjcmliZWRieT1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIlxcXCIgdGFiaW5kZXg9XFxcIi0xXFxcIj5cXG4gICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2xvc2UsIFwiXFxcIj48L2J1dHRvbj5cXG4gICA8dWwgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ10sIFwiXFxcIj48L3VsPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaWNvbiwgXCJcXFwiPjwvZGl2PlxcbiAgIDxpbWcgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaW1hZ2UsIFwiXFxcIiAvPlxcbiAgIDxoMiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCI+PC9oMj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8aW5wdXQgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaW5wdXQsIFwiXFxcIiAvPlxcbiAgIDxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5maWxlLCBcIlxcXCIgLz5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIlxcXCI+XFxuICAgICA8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIC8+XFxuICAgICA8b3V0cHV0Pjwvb3V0cHV0PlxcbiAgIDwvZGl2PlxcbiAgIDxzZWxlY3QgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuc2VsZWN0LCBcIlxcXCI+PC9zZWxlY3Q+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCJcXFwiPjwvZGl2PlxcbiAgIDxsYWJlbCBmb3I9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCJcXFwiPlxcbiAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiAvPlxcbiAgICAgPHNwYW4gY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMubGFiZWwsIFwiXFxcIj48L3NwYW4+XFxuICAgPC9sYWJlbD5cXG4gICA8dGV4dGFyZWEgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGV4dGFyZWEsIFwiXFxcIj48L3RleHRhcmVhPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddLCBcIlxcXCI+PC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIlxcXCI+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmxvYWRlciwgXCJcXFwiPjwvZGl2PlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbmZpcm0sIFwiXFxcIj48L2J1dHRvbj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5kZW55LCBcIlxcXCI+PC9idXR0b24+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2FuY2VsLCBcIlxcXCI+PC9idXR0b24+XFxuICAgPC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5mb290ZXIsIFwiXFxcIj48L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVyJ10sIFwiXFxcIj5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhciddLCBcIlxcXCI+PC9kaXY+XFxuICAgPC9kaXY+XFxuIDwvZGl2PlxcblwiKS5yZXBsYWNlKC8oXnxcXG4pXFxzKi9nLCAnJyk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgcmVzZXRPbGRDb250YWluZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgb2xkQ29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgICBpZiAoIW9sZENvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9sZENvbnRhaW5lci5yZW1vdmUoKTtcbiAgICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSwgc3dhbENsYXNzZXNbJ2hhcy1jb2x1bW4nXV0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgfTtcblxuICBjb25zdCBhZGRJbnB1dENoYW5nZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgaW5wdXQgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLmlucHV0KTtcbiAgICBjb25zdCBmaWxlID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5maWxlKTtcbiAgICAvKiogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCByYW5nZSA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBpbnB1dFwiKSk7XG4gICAgLyoqIEB0eXBlIHtIVE1MT3V0cHV0RWxlbWVudH0gKi9cblxuICAgIGNvbnN0IHJhbmdlT3V0cHV0ID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIG91dHB1dFwiKSk7XG4gICAgY29uc3Qgc2VsZWN0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5zZWxlY3QpO1xuICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cblxuICAgIGNvbnN0IGNoZWNrYm94ID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiIGlucHV0XCIpKTtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMudGV4dGFyZWEpO1xuICAgIGlucHV0Lm9uaW5wdXQgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIGZpbGUub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIHNlbGVjdC5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgY2hlY2tib3gub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIHRleHRhcmVhLm9uaW5wdXQgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuXG4gICAgcmFuZ2Uub25pbnB1dCA9ICgpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIHJhbmdlT3V0cHV0LnZhbHVlID0gcmFuZ2UudmFsdWU7XG4gICAgfTtcblxuICAgIHJhbmdlLm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICovXG5cblxuICBjb25zdCBnZXRUYXJnZXQgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkgOiB0YXJnZXQ7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzZXR1cEFjY2Vzc2liaWxpdHkgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCBwYXJhbXMudG9hc3QgPyAnYWxlcnQnIDogJ2RpYWxvZycpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgcGFyYW1zLnRvYXN0ID8gJ3BvbGl0ZScgOiAnYXNzZXJ0aXZlJyk7XG5cbiAgICBpZiAoIXBhcmFtcy50b2FzdCkge1xuICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0dXBSVEwgPSB0YXJnZXRFbGVtZW50ID0+IHtcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWxlbWVudCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgYWRkQ2xhc3MoZ2V0Q29udGFpbmVyKCksIHN3YWxDbGFzc2VzLnJ0bCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQWRkIG1vZGFsICsgYmFja2Ryb3AgKyBuby13YXIgbWVzc2FnZSBmb3IgUnVzc2lhbnMgdG8gRE9NXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGluaXQgPSBwYXJhbXMgPT4ge1xuICAgIC8vIENsZWFuIHVwIHRoZSBvbGQgcG9wdXAgY29udGFpbmVyIGlmIGl0IGV4aXN0c1xuICAgIGNvbnN0IG9sZENvbnRhaW5lckV4aXN0ZWQgPSByZXNldE9sZENvbnRhaW5lcigpO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXG4gICAgaWYgKGlzTm9kZUVudigpKSB7XG4gICAgICBlcnJvcignU3dlZXRBbGVydDIgcmVxdWlyZXMgZG9jdW1lbnQgdG8gaW5pdGlhbGl6ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5jb250YWluZXI7XG5cbiAgICBpZiAob2xkQ29udGFpbmVyRXhpc3RlZCkge1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1snbm8tdHJhbnNpdGlvbiddKTtcbiAgICB9XG5cbiAgICBzZXRJbm5lckh0bWwoY29udGFpbmVyLCBzd2VldEhUTUwpO1xuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBnZXRUYXJnZXQocGFyYW1zLnRhcmdldCk7XG4gICAgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIHNldHVwQWNjZXNzaWJpbGl0eShwYXJhbXMpO1xuICAgIHNldHVwUlRMKHRhcmdldEVsZW1lbnQpO1xuICAgIGFkZElucHV0Q2hhbmdlTGlzdGVuZXJzKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBvYmplY3QgfCBzdHJpbmd9IHBhcmFtXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKi9cblxuICBjb25zdCBwYXJzZUh0bWxUb0NvbnRhaW5lciA9IChwYXJhbSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gRE9NIGVsZW1lbnRcbiAgICBpZiAocGFyYW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHBhcmFtKTtcbiAgICB9IC8vIE9iamVjdFxuICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGhhbmRsZU9iamVjdChwYXJhbSwgdGFyZ2V0KTtcbiAgICB9IC8vIFBsYWluIHN0cmluZ1xuICAgIGVsc2UgaWYgKHBhcmFtKSB7XG4gICAgICBzZXRJbm5lckh0bWwodGFyZ2V0LCBwYXJhbSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKi9cblxuICBjb25zdCBoYW5kbGVPYmplY3QgPSAocGFyYW0sIHRhcmdldCkgPT4ge1xuICAgIC8vIEpRdWVyeSBlbGVtZW50KHMpXG4gICAgaWYgKHBhcmFtLmpxdWVyeSkge1xuICAgICAgaGFuZGxlSnF1ZXJ5RWxlbSh0YXJnZXQsIHBhcmFtKTtcbiAgICB9IC8vIEZvciBvdGhlciBvYmplY3RzIHVzZSB0aGVpciBzdHJpbmcgcmVwcmVzZW50YXRpb25cbiAgICBlbHNlIHtcbiAgICAgIHNldElubmVySHRtbCh0YXJnZXQsIHBhcmFtLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlSnF1ZXJ5RWxlbSA9ICh0YXJnZXQsIGVsZW0pID0+IHtcbiAgICB0YXJnZXQudGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmICgwIGluIGVsZW0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyAoaSBpbiBlbGVtKTsgaSsrKSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbGVtW2ldLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbGVtLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7J3dlYmtpdEFuaW1hdGlvbkVuZCcgfCAnYW5pbWF0aW9uZW5kJyB8IGZhbHNlfVxuICAgKi9cblxuICBjb25zdCBhbmltYXRpb25FbmRFdmVudCA9ICgoKSA9PiB7XG4gICAgLy8gUHJldmVudCBydW4gaW4gTm9kZSBlbnZcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpc05vZGVFbnYoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAvLyBDaHJvbWUsIFNhZmFyaSBhbmQgT3BlcmFcbiAgICAgIGFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcgLy8gU3RhbmRhcmQgc3ludGF4XG5cbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0cmFuc0VuZEV2ZW50TmFtZXMsIGkpICYmIHR5cGVvZiB0ZXN0RWwuc3R5bGVbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KSgpO1xuXG4gIC8qKlxuICAgKiBNZWFzdXJlIHNjcm9sbGJhciB3aWR0aCBmb3IgcGFkZGluZyBib2R5IGR1cmluZyBtb2RhbCBzaG93L2hpZGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL2pzL3NyYy9tb2RhbC5qc1xuICAgKlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cblxuICBjb25zdCBtZWFzdXJlU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1snc2Nyb2xsYmFyLW1lYXN1cmUnXTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG4gICAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckFjdGlvbnMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBnZXRBY3Rpb25zKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7IC8vIEFjdGlvbnMgKGJ1dHRvbnMpIHdyYXBwZXJcblxuICAgIGlmICghcGFyYW1zLnNob3dDb25maXJtQnV0dG9uICYmICFwYXJhbXMuc2hvd0RlbnlCdXR0b24gJiYgIXBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uKSB7XG4gICAgICBoaWRlKGFjdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93KGFjdGlvbnMpO1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoYWN0aW9ucywgcGFyYW1zLCAnYWN0aW9ucycpOyAvLyBSZW5kZXIgYWxsIHRoZSBidXR0b25zXG5cbiAgICByZW5kZXJCdXR0b25zKGFjdGlvbnMsIGxvYWRlciwgcGFyYW1zKTsgLy8gTG9hZGVyXG5cbiAgICBzZXRJbm5lckh0bWwobG9hZGVyLCBwYXJhbXMubG9hZGVySHRtbCk7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhsb2FkZXIsIHBhcmFtcywgJ2xvYWRlcicpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYWN0aW9uc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBsb2FkZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbnMoYWN0aW9ucywgbG9hZGVyLCBwYXJhbXMpIHtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7IC8vIFJlbmRlciBidXR0b25zXG5cbiAgICByZW5kZXJCdXR0b24oY29uZmlybUJ1dHRvbiwgJ2NvbmZpcm0nLCBwYXJhbXMpO1xuICAgIHJlbmRlckJ1dHRvbihkZW55QnV0dG9uLCAnZGVueScsIHBhcmFtcyk7XG4gICAgcmVuZGVyQnV0dG9uKGNhbmNlbEJ1dHRvbiwgJ2NhbmNlbCcsIHBhcmFtcyk7XG4gICAgaGFuZGxlQnV0dG9uc1N0eWxpbmcoY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uLCBwYXJhbXMpO1xuXG4gICAgaWYgKHBhcmFtcy5yZXZlcnNlQnV0dG9ucykge1xuICAgICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjYW5jZWxCdXR0b24sIGNvbmZpcm1CdXR0b24pO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShkZW55QnV0dG9uLCBjb25maXJtQnV0dG9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNhbmNlbEJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoZGVueUJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY29uZmlybUJ1dHRvbiwgbG9hZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbmZpcm1CdXR0b25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGVueUJ1dHRvblxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYW5jZWxCdXR0b25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gaGFuZGxlQnV0dG9uc1N0eWxpbmcoY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uLCBwYXJhbXMpIHtcbiAgICBpZiAoIXBhcmFtcy5idXR0b25zU3R5bGluZykge1xuICAgICAgcmV0dXJuIHJlbW92ZUNsYXNzKFtjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b25dLCBzd2FsQ2xhc3Nlcy5zdHlsZWQpO1xuICAgIH1cblxuICAgIGFkZENsYXNzKFtjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b25dLCBzd2FsQ2xhc3Nlcy5zdHlsZWQpOyAvLyBCdXR0b25zIGJhY2tncm91bmQgY29sb3JzXG5cbiAgICBpZiAocGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcikge1xuICAgICAgY29uZmlybUJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yO1xuICAgICAgYWRkQ2xhc3MoY29uZmlybUJ1dHRvbiwgc3dhbENsYXNzZXNbJ2RlZmF1bHQtb3V0bGluZSddKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLmRlbnlCdXR0b25Db2xvcikge1xuICAgICAgZGVueUJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuZGVueUJ1dHRvbkNvbG9yO1xuICAgICAgYWRkQ2xhc3MoZGVueUJ1dHRvbiwgc3dhbENsYXNzZXNbJ2RlZmF1bHQtb3V0bGluZSddKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLmNhbmNlbEJ1dHRvbkNvbG9yKSB7XG4gICAgICBjYW5jZWxCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmNhbmNlbEJ1dHRvbkNvbG9yO1xuICAgICAgYWRkQ2xhc3MoY2FuY2VsQnV0dG9uLCBzd2FsQ2xhc3Nlc1snZGVmYXVsdC1vdXRsaW5lJ10pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYnV0dG9uXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknIHwgJ2NhbmNlbCd9IGJ1dHRvblR5cGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gcmVuZGVyQnV0dG9uKGJ1dHRvbiwgYnV0dG9uVHlwZSwgcGFyYW1zKSB7XG4gICAgdG9nZ2xlKGJ1dHRvbiwgcGFyYW1zW1wic2hvd1wiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIoYnV0dG9uVHlwZSksIFwiQnV0dG9uXCIpXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIHNldElubmVySHRtbChidXR0b24sIHBhcmFtc1tcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvblRleHRcIildKTsgLy8gU2V0IGNhcHRpb24gdGV4dFxuXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHBhcmFtc1tcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvbkFyaWFMYWJlbFwiKV0pOyAvLyBBUklBIGxhYmVsXG4gICAgLy8gQWRkIGJ1dHRvbnMgY3VzdG9tIGNsYXNzZXNcblxuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1tidXR0b25UeXBlXTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGJ1dHRvbiwgcGFyYW1zLCBcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvblwiKSk7XG4gICAgYWRkQ2xhc3MoYnV0dG9uLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25DbGFzc1wiKV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJDb250YWluZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuXG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmJhY2tkcm9wKTtcbiAgICBoYW5kbGVQb3NpdGlvblBhcmFtKGNvbnRhaW5lciwgcGFyYW1zLnBvc2l0aW9uKTtcbiAgICBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBwYXJhbXMuZ3Jvdyk7IC8vIEN1c3RvbSBjbGFzc1xuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhjb250YWluZXIsIHBhcmFtcywgJ2NvbnRhaW5lcicpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2JhY2tkcm9wJ119IGJhY2tkcm9wXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUJhY2tkcm9wUGFyYW0oY29udGFpbmVyLCBiYWNrZHJvcCkge1xuICAgIGlmICh0eXBlb2YgYmFja2Ryb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9IGJhY2tkcm9wO1xuICAgIH0gZWxzZSBpZiAoIWJhY2tkcm9wKSB7XG4gICAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ3Bvc2l0aW9uJ119IHBvc2l0aW9uXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBvc2l0aW9uKSB7XG4gICAgaWYgKHBvc2l0aW9uIGluIHN3YWxDbGFzc2VzKSB7XG4gICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzW3Bvc2l0aW9uXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdhcm4oJ1RoZSBcInBvc2l0aW9uXCIgcGFyYW1ldGVyIGlzIG5vdCB2YWxpZCwgZGVmYXVsdGluZyB0byBcImNlbnRlclwiJyk7XG4gICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzLmNlbnRlcik7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snZ3JvdyddfSBncm93XG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gaGFuZGxlR3Jvd1BhcmFtKGNvbnRhaW5lciwgZ3Jvdykge1xuICAgIGlmIChncm93ICYmIHR5cGVvZiBncm93ID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgZ3Jvd0NsYXNzID0gXCJncm93LVwiLmNvbmNhdChncm93KTtcblxuICAgICAgaWYgKGdyb3dDbGFzcyBpbiBzd2FsQ2xhc3Nlcykge1xuICAgICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzW2dyb3dDbGFzc10pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBjb250YWlucyBgV2Vha01hcGBzIGZvciBlYWNoIGVmZmVjdGl2ZWx5LVwicHJpdmF0ZSAgcHJvcGVydHlcIiB0aGF0IGEgYFN3YWxgIGhhcy5cbiAgICogRm9yIGV4YW1wbGUsIHRvIHNldCB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBcImZvb1wiIG9mIGB0aGlzYCB0byBcImJhclwiLCB5b3UgY2FuIGBwcml2YXRlUHJvcHMuZm9vLnNldCh0aGlzLCAnYmFyJylgXG4gICAqIFRoaXMgaXMgdGhlIGFwcHJvYWNoIHRoYXQgQmFiZWwgd2lsbCBwcm9iYWJseSB0YWtlIHRvIGltcGxlbWVudCBwcml2YXRlIG1ldGhvZHMvZmllbGRzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJpdmF0ZS1tZXRob2RzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvNzU1NVxuICAgKiBPbmNlIHdlIGhhdmUgdGhlIGNoYW5nZXMgZnJvbSB0aGF0IFBSIGluIEJhYmVsLCBhbmQgb3VyIGNvcmUgY2xhc3MgZml0cyByZWFzb25hYmxlIGluICpvbmUgbW9kdWxlKlxuICAgKiAgIHRoZW4gd2UgY2FuIHVzZSB0aGF0IGxhbmd1YWdlIGZlYXR1cmUuXG4gICAqL1xuICB2YXIgcHJpdmF0ZVByb3BzID0ge1xuICAgIGF3YWl0aW5nUHJvbWlzZTogbmV3IFdlYWtNYXAoKSxcbiAgICBwcm9taXNlOiBuZXcgV2Vha01hcCgpLFxuICAgIGlubmVyUGFyYW1zOiBuZXcgV2Vha01hcCgpLFxuICAgIGRvbUNhY2hlOiBuZXcgV2Vha01hcCgpXG4gIH07XG5cbiAgLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL3N3ZWV0YWxlcnQyLmQudHNcIi8+XG4gIC8qKiBAdHlwZSB7SW5wdXRDbGFzc1tdfSAqL1xuXG4gIGNvbnN0IGlucHV0Q2xhc3NlcyA9IFsnaW5wdXQnLCAnZmlsZScsICdyYW5nZScsICdzZWxlY3QnLCAncmFkaW8nLCAnY2hlY2tib3gnLCAndGV4dGFyZWEnXTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJJbnB1dCA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgcmVyZW5kZXIgPSAhaW5uZXJQYXJhbXMgfHwgcGFyYW1zLmlucHV0ICE9PSBpbm5lclBhcmFtcy5pbnB1dDtcbiAgICBpbnB1dENsYXNzZXMuZm9yRWFjaChpbnB1dENsYXNzID0+IHtcbiAgICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXSk7IC8vIHNldCBhdHRyaWJ1dGVzXG5cbiAgICAgIHNldEF0dHJpYnV0ZXMoaW5wdXRDbGFzcywgcGFyYW1zLmlucHV0QXR0cmlidXRlcyk7IC8vIHNldCBjbGFzc1xuXG4gICAgICBpbnB1dENvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXTtcblxuICAgICAgaWYgKHJlcmVuZGVyKSB7XG4gICAgICAgIGhpZGUoaW5wdXRDb250YWluZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHBhcmFtcy5pbnB1dCkge1xuICAgICAgaWYgKHJlcmVuZGVyKSB7XG4gICAgICAgIHNob3dJbnB1dChwYXJhbXMpO1xuICAgICAgfSAvLyBzZXQgY3VzdG9tIGNsYXNzXG5cblxuICAgICAgc2V0Q3VzdG9tQ2xhc3MocGFyYW1zKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3Qgc2hvd0lucHV0ID0gcGFyYW1zID0+IHtcbiAgICBpZiAoIXJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKSB7XG4gICAgICByZXR1cm4gZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXQhIEV4cGVjdGVkIFxcXCJ0ZXh0XFxcIiwgXFxcImVtYWlsXFxcIiwgXFxcInBhc3N3b3JkXFxcIiwgXFxcIm51bWJlclxcXCIsIFxcXCJ0ZWxcXFwiLCBcXFwic2VsZWN0XFxcIiwgXFxcInJhZGlvXFxcIiwgXFxcImNoZWNrYm94XFxcIiwgXFxcInRleHRhcmVhXFxcIiwgXFxcImZpbGVcXFwiIG9yIFxcXCJ1cmxcXFwiLCBnb3QgXFxcIlwiLmNvbmNhdChwYXJhbXMuaW5wdXQsIFwiXFxcIlwiKSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBnZXRJbnB1dENvbnRhaW5lcihwYXJhbXMuaW5wdXQpO1xuICAgIGNvbnN0IGlucHV0ID0gcmVuZGVySW5wdXRUeXBlW3BhcmFtcy5pbnB1dF0oaW5wdXRDb250YWluZXIsIHBhcmFtcyk7XG4gICAgc2hvdyhpbnB1dENvbnRhaW5lcik7IC8vIGlucHV0IGF1dG9mb2N1c1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBmb2N1c0lucHV0KGlucHV0KTtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICovXG5cblxuICBjb25zdCByZW1vdmVBdHRyaWJ1dGVzID0gaW5wdXQgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSBpbnB1dC5hdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgIGlmICghWyd0eXBlJywgJ3ZhbHVlJywgJ3N0eWxlJ10uaW5jbHVkZXMoYXR0ck5hbWUpKSB7XG4gICAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtJbnB1dENsYXNzfSBpbnB1dENsYXNzXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0QXR0cmlidXRlcyddfSBpbnB1dEF0dHJpYnV0ZXNcbiAgICovXG5cblxuICBjb25zdCBzZXRBdHRyaWJ1dGVzID0gKGlucHV0Q2xhc3MsIGlucHV0QXR0cmlidXRlcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0SW5wdXQoZ2V0UG9wdXAoKSwgaW5wdXRDbGFzcyk7XG5cbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVtb3ZlQXR0cmlidXRlcyhpbnB1dCk7XG5cbiAgICBmb3IgKGNvbnN0IGF0dHIgaW4gaW5wdXRBdHRyaWJ1dGVzKSB7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoYXR0ciwgaW5wdXRBdHRyaWJ1dGVzW2F0dHJdKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzZXRDdXN0b21DbGFzcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBnZXRJbnB1dENvbnRhaW5lcihwYXJhbXMuaW5wdXQpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBhZGRDbGFzcyhpbnB1dENvbnRhaW5lciwgcGFyYW1zLmN1c3RvbUNsYXNzLmlucHV0KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzZXRJbnB1dFBsYWNlaG9sZGVyID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBpZiAoIWlucHV0LnBsYWNlaG9sZGVyIHx8IHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKSB7XG4gICAgICBpbnB1dC5wbGFjZWhvbGRlciA9IHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SW5wdXR9IGlucHV0XG4gICAqIEBwYXJhbSB7SW5wdXR9IHByZXBlbmRUb1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzZXRJbnB1dExhYmVsID0gKGlucHV0LCBwcmVwZW5kVG8sIHBhcmFtcykgPT4ge1xuICAgIGlmIChwYXJhbXMuaW5wdXRMYWJlbCkge1xuICAgICAgaW5wdXQuaWQgPSBzd2FsQ2xhc3Nlcy5pbnB1dDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgIGNvbnN0IGxhYmVsQ2xhc3MgPSBzd2FsQ2xhc3Nlc1snaW5wdXQtbGFiZWwnXTtcbiAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgaW5wdXQuaWQpO1xuICAgICAgbGFiZWwuY2xhc3NOYW1lID0gbGFiZWxDbGFzcztcblxuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGFkZENsYXNzKGxhYmVsLCBwYXJhbXMuY3VzdG9tQ2xhc3MuaW5wdXRMYWJlbCk7XG4gICAgICB9XG5cbiAgICAgIGxhYmVsLmlubmVyVGV4dCA9IHBhcmFtcy5pbnB1dExhYmVsO1xuICAgICAgcHJlcGVuZFRvLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCBsYWJlbCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXQnXX0gaW5wdXRUeXBlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICovXG5cblxuICBjb25zdCBnZXRJbnB1dENvbnRhaW5lciA9IGlucHV0VHlwZSA9PiB7XG4gICAgcmV0dXJuIGdldERpcmVjdENoaWxkQnlDbGFzcyhnZXRQb3B1cCgpLCBzd2FsQ2xhc3Nlc1tpbnB1dFR5cGVdIHx8IHN3YWxDbGFzc2VzLmlucHV0KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxPdXRwdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXRWYWx1ZSddfSBpbnB1dFZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3QgY2hlY2tBbmRTZXRJbnB1dFZhbHVlID0gKGlucHV0LCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgaWYgKFsnc3RyaW5nJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBpbnB1dFZhbHVlKSkge1xuICAgICAgaW5wdXQudmFsdWUgPSBcIlwiLmNvbmNhdChpbnB1dFZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKCFpc1Byb21pc2UoaW5wdXRWYWx1ZSkpIHtcbiAgICAgIHdhcm4oXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRWYWx1ZSEgRXhwZWN0ZWQgXFxcInN0cmluZ1xcXCIsIFxcXCJudW1iZXJcXFwiIG9yIFxcXCJQcm9taXNlXFxcIiwgZ290IFxcXCJcIi5jb25jYXQodHlwZW9mIGlucHV0VmFsdWUsIFwiXFxcIlwiKSk7XG4gICAgfVxuICB9O1xuICAvKiogQHR5cGUgUmVjb3JkPHN0cmluZywgKGlucHV0OiBJbnB1dCB8IEhUTUxFbGVtZW50LCBwYXJhbXM6IFN3ZWV0QWxlcnRPcHRpb25zKSA9PiBJbnB1dD4gKi9cblxuXG4gIGNvbnN0IHJlbmRlcklucHV0VHlwZSA9IHt9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG4gIHJlbmRlcklucHV0VHlwZS50ZXh0ID0gcmVuZGVySW5wdXRUeXBlLmVtYWlsID0gcmVuZGVySW5wdXRUeXBlLnBhc3N3b3JkID0gcmVuZGVySW5wdXRUeXBlLm51bWJlciA9IHJlbmRlcklucHV0VHlwZS50ZWwgPSByZW5kZXJJbnB1dFR5cGUudXJsID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUoaW5wdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dExhYmVsKGlucHV0LCBpbnB1dCwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKGlucHV0LCBwYXJhbXMpO1xuICAgIGlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLmZpbGUgPSAoaW5wdXQsIHBhcmFtcykgPT4ge1xuICAgIHNldElucHV0TGFiZWwoaW5wdXQsIGlucHV0LCBwYXJhbXMpO1xuICAgIHNldElucHV0UGxhY2Vob2xkZXIoaW5wdXQsIHBhcmFtcyk7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYW5nZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnJhbmdlID0gKHJhbmdlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCByYW5nZUlucHV0ID0gcmFuZ2UucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCByYW5nZU91dHB1dCA9IHJhbmdlLnF1ZXJ5U2VsZWN0b3IoJ291dHB1dCcpO1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShyYW5nZUlucHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgcmFuZ2VJbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShyYW5nZU91dHB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0TGFiZWwocmFuZ2VJbnB1dCwgcmFuZ2UsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MU2VsZWN0RWxlbWVudH0gc2VsZWN0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTFNlbGVjdEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnNlbGVjdCA9IChzZWxlY3QsIHBhcmFtcykgPT4ge1xuICAgIHNlbGVjdC50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKSB7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgc2V0SW5uZXJIdG1sKHBsYWNlaG9sZGVyLCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcik7XG4gICAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcnO1xuICAgICAgcGxhY2Vob2xkZXIuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcGxhY2Vob2xkZXIuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcbiAgICB9XG5cbiAgICBzZXRJbnB1dExhYmVsKHNlbGVjdCwgc2VsZWN0LCBwYXJhbXMpO1xuICAgIHJldHVybiBzZWxlY3Q7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhZGlvXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5yYWRpbyA9IHJhZGlvID0+IHtcbiAgICByYWRpby50ZXh0Q29udGVudCA9ICcnO1xuICAgIHJldHVybiByYWRpbztcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTExhYmVsRWxlbWVudH0gY2hlY2tib3hDb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5jaGVja2JveCA9IChjaGVja2JveENvbnRhaW5lciwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY2hlY2tib3ggPSBnZXRJbnB1dChnZXRQb3B1cCgpLCAnY2hlY2tib3gnKTtcbiAgICBjaGVja2JveC52YWx1ZSA9ICcxJztcbiAgICBjaGVja2JveC5pZCA9IHN3YWxDbGFzc2VzLmNoZWNrYm94O1xuICAgIGNoZWNrYm94LmNoZWNrZWQgPSBCb29sZWFuKHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBjb25zdCBsYWJlbCA9IGNoZWNrYm94Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcbiAgICBzZXRJbm5lckh0bWwobGFiZWwsIHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKTtcbiAgICByZXR1cm4gY2hlY2tib3g7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxUZXh0QXJlYUVsZW1lbnR9IHRleHRhcmVhXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTFRleHRBcmVhRWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUudGV4dGFyZWEgPSAodGV4dGFyZWEsIHBhcmFtcykgPT4ge1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZSh0ZXh0YXJlYSwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0UGxhY2Vob2xkZXIodGV4dGFyZWEsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRMYWJlbCh0ZXh0YXJlYSwgdGV4dGFyZWEsIHBhcmFtcyk7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuXG4gICAgY29uc3QgZ2V0TWFyZ2luID0gZWwgPT4gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLm1hcmdpbkxlZnQpICsgcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLm1hcmdpblJpZ2h0KTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMjkxXG5cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xNjk5XG4gICAgICBpZiAoJ011dGF0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykge1xuICAgICAgICBjb25zdCBpbml0aWFsUG9wdXBXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdldFBvcHVwKCkpLndpZHRoKTtcblxuICAgICAgICBjb25zdCB0ZXh0YXJlYVJlc2l6ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dGFyZWFXaWR0aCA9IHRleHRhcmVhLm9mZnNldFdpZHRoICsgZ2V0TWFyZ2luKHRleHRhcmVhKTtcblxuICAgICAgICAgIGlmICh0ZXh0YXJlYVdpZHRoID4gaW5pdGlhbFBvcHVwV2lkdGgpIHtcbiAgICAgICAgICAgIGdldFBvcHVwKCkuc3R5bGUud2lkdGggPSBcIlwiLmNvbmNhdCh0ZXh0YXJlYVdpZHRoLCBcInB4XCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQb3B1cCgpLnN0eWxlLndpZHRoID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGV4dGFyZWFSZXNpemVIYW5kbGVyKS5vYnNlcnZlKHRleHRhcmVhLCB7XG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnc3R5bGUnXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGV4dGFyZWE7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJDb250ZW50ID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBodG1sQ29udGFpbmVyID0gZ2V0SHRtbENvbnRhaW5lcigpO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoaHRtbENvbnRhaW5lciwgcGFyYW1zLCAnaHRtbENvbnRhaW5lcicpOyAvLyBDb250ZW50IGFzIEhUTUxcblxuICAgIGlmIChwYXJhbXMuaHRtbCkge1xuICAgICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLmh0bWwsIGh0bWxDb250YWluZXIpO1xuICAgICAgc2hvdyhodG1sQ29udGFpbmVyLCAnYmxvY2snKTtcbiAgICB9IC8vIENvbnRlbnQgYXMgcGxhaW4gdGV4dFxuICAgIGVsc2UgaWYgKHBhcmFtcy50ZXh0KSB7XG4gICAgICBodG1sQ29udGFpbmVyLnRleHRDb250ZW50ID0gcGFyYW1zLnRleHQ7XG4gICAgICBzaG93KGh0bWxDb250YWluZXIsICdibG9jaycpO1xuICAgIH0gLy8gTm8gY29udGVudFxuICAgIGVsc2Uge1xuICAgICAgaGlkZShodG1sQ29udGFpbmVyKTtcbiAgICB9XG5cbiAgICByZW5kZXJJbnB1dChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckZvb3RlciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZm9vdGVyID0gZ2V0Rm9vdGVyKCk7XG4gICAgdG9nZ2xlKGZvb3RlciwgcGFyYW1zLmZvb3Rlcik7XG5cbiAgICBpZiAocGFyYW1zLmZvb3Rlcikge1xuICAgICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLmZvb3RlciwgZm9vdGVyKTtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGZvb3RlciwgcGFyYW1zLCAnZm9vdGVyJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJDbG9zZUJ1dHRvbiA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBnZXRDbG9zZUJ1dHRvbigpO1xuICAgIHNldElubmVySHRtbChjbG9zZUJ1dHRvbiwgcGFyYW1zLmNsb3NlQnV0dG9uSHRtbCk7IC8vIEN1c3RvbSBjbGFzc1xuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhjbG9zZUJ1dHRvbiwgcGFyYW1zLCAnY2xvc2VCdXR0b24nKTtcbiAgICB0b2dnbGUoY2xvc2VCdXR0b24sIHBhcmFtcy5zaG93Q2xvc2VCdXR0b24pO1xuICAgIGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHBhcmFtcy5jbG9zZUJ1dHRvbkFyaWFMYWJlbCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJJY29uID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGNvbnN0IGljb24gPSBnZXRJY29uKCk7IC8vIGlmIHRoZSBnaXZlbiBpY29uIGFscmVhZHkgcmVuZGVyZWQsIGFwcGx5IHRoZSBzdHlsaW5nIHdpdGhvdXQgcmUtcmVuZGVyaW5nIHRoZSBpY29uXG5cbiAgICBpZiAoaW5uZXJQYXJhbXMgJiYgcGFyYW1zLmljb24gPT09IGlubmVyUGFyYW1zLmljb24pIHtcbiAgICAgIC8vIEN1c3RvbSBvciBkZWZhdWx0IGNvbnRlbnRcbiAgICAgIHNldENvbnRlbnQoaWNvbiwgcGFyYW1zKTtcbiAgICAgIGFwcGx5U3R5bGVzKGljb24sIHBhcmFtcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFwYXJhbXMuaWNvbiAmJiAhcGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBoaWRlKGljb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuaWNvbiAmJiBPYmplY3Qua2V5cyhpY29uVHlwZXMpLmluZGV4T2YocGFyYW1zLmljb24pID09PSAtMSkge1xuICAgICAgZXJyb3IoXCJVbmtub3duIGljb24hIEV4cGVjdGVkIFxcXCJzdWNjZXNzXFxcIiwgXFxcImVycm9yXFxcIiwgXFxcIndhcm5pbmdcXFwiLCBcXFwiaW5mb1xcXCIgb3IgXFxcInF1ZXN0aW9uXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLmljb24sIFwiXFxcIlwiKSk7XG4gICAgICBoaWRlKGljb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNob3coaWNvbik7IC8vIEN1c3RvbSBvciBkZWZhdWx0IGNvbnRlbnRcblxuICAgIHNldENvbnRlbnQoaWNvbiwgcGFyYW1zKTtcbiAgICBhcHBseVN0eWxlcyhpY29uLCBwYXJhbXMpOyAvLyBBbmltYXRlIGljb25cblxuICAgIGFkZENsYXNzKGljb24sIHBhcmFtcy5zaG93Q2xhc3MuaWNvbik7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBhcHBseVN0eWxlcyA9IChpY29uLCBwYXJhbXMpID0+IHtcbiAgICBmb3IgKGNvbnN0IGljb25UeXBlIGluIGljb25UeXBlcykge1xuICAgICAgaWYgKHBhcmFtcy5pY29uICE9PSBpY29uVHlwZSkge1xuICAgICAgICByZW1vdmVDbGFzcyhpY29uLCBpY29uVHlwZXNbaWNvblR5cGVdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDbGFzcyhpY29uLCBpY29uVHlwZXNbcGFyYW1zLmljb25dKTsgLy8gSWNvbiBjb2xvclxuXG4gICAgc2V0Q29sb3IoaWNvbiwgcGFyYW1zKTsgLy8gU3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3JcblxuICAgIGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yKCk7IC8vIEN1c3RvbSBjbGFzc1xuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhpY29uLCBwYXJhbXMsICdpY29uJyk7XG4gIH07IC8vIEFkanVzdCBzdWNjZXNzIGljb24gYmFja2dyb3VuZCBjb2xvciB0byBtYXRjaCB0aGUgcG9wdXAgYmFja2dyb3VuZCBjb2xvclxuXG5cbiAgY29uc3QgYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IHBvcHVwQmFja2dyb3VuZENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocG9wdXApLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAvKiogQHR5cGUge05vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+fSAqL1xuXG4gICAgY29uc3Qgc3VjY2Vzc0ljb25QYXJ0cyA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXSwgLnN3YWwyLXN1Y2Nlc3MtZml4Jyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Y2Nlc3NJY29uUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1Y2Nlc3NJY29uUGFydHNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcG9wdXBCYWNrZ3JvdW5kQ29sb3I7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN1Y2Nlc3NJY29uSHRtbCA9IFwiXFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtbGVmdFxcXCI+PC9kaXY+XFxuICA8c3BhbiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1saW5lLXRpcFxcXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1saW5lLWxvbmdcXFwiPjwvc3Bhbj5cXG4gIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtcmluZ1xcXCI+PC9kaXY+IDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtZml4XFxcIj48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1yaWdodFxcXCI+PC9kaXY+XFxuXCI7XG4gIGNvbnN0IGVycm9ySWNvbkh0bWwgPSBcIlxcbiAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFya1xcXCI+XFxuICAgIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmstbGluZS1sZWZ0XFxcIj48L3NwYW4+XFxuICAgIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmstbGluZS1yaWdodFxcXCI+PC9zcGFuPlxcbiAgPC9zcGFuPlxcblwiO1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3Qgc2V0Q29udGVudCA9IChpY29uLCBwYXJhbXMpID0+IHtcbiAgICBsZXQgb2xkQ29udGVudCA9IGljb24uaW5uZXJIVE1MO1xuICAgIGxldCBuZXdDb250ZW50O1xuXG4gICAgaWYgKHBhcmFtcy5pY29uSHRtbCkge1xuICAgICAgbmV3Q29udGVudCA9IGljb25Db250ZW50KHBhcmFtcy5pY29uSHRtbCk7XG4gICAgfSBlbHNlIGlmIChwYXJhbXMuaWNvbiA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBuZXdDb250ZW50ID0gc3VjY2Vzc0ljb25IdG1sO1xuICAgICAgb2xkQ29udGVudCA9IG9sZENvbnRlbnQucmVwbGFjZSgvIHN0eWxlPVwiLio/XCIvZywgJycpOyAvLyB1bmRvIGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yKClcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5pY29uID09PSAnZXJyb3InKSB7XG4gICAgICBuZXdDb250ZW50ID0gZXJyb3JJY29uSHRtbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGVmYXVsdEljb25IdG1sID0ge1xuICAgICAgICBxdWVzdGlvbjogJz8nLFxuICAgICAgICB3YXJuaW5nOiAnIScsXG4gICAgICAgIGluZm86ICdpJ1xuICAgICAgfTtcbiAgICAgIG5ld0NvbnRlbnQgPSBpY29uQ29udGVudChkZWZhdWx0SWNvbkh0bWxbcGFyYW1zLmljb25dKTtcbiAgICB9XG5cbiAgICBpZiAob2xkQ29udGVudC50cmltKCkgIT09IG5ld0NvbnRlbnQudHJpbSgpKSB7XG4gICAgICBzZXRJbm5lckh0bWwoaWNvbiwgbmV3Q29udGVudCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBzZXRDb2xvciA9IChpY29uLCBwYXJhbXMpID0+IHtcbiAgICBpZiAoIXBhcmFtcy5pY29uQ29sb3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpY29uLnN0eWxlLmNvbG9yID0gcGFyYW1zLmljb25Db2xvcjtcbiAgICBpY29uLnN0eWxlLmJvcmRlckNvbG9yID0gcGFyYW1zLmljb25Db2xvcjtcblxuICAgIGZvciAoY29uc3Qgc2VsIG9mIFsnLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXAnLCAnLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nJywgJy5zd2FsMi14LW1hcmstbGluZS1sZWZ0JywgJy5zd2FsMi14LW1hcmstbGluZS1yaWdodCddKSB7XG4gICAgICBzZXRTdHlsZShpY29uLCBzZWwsICdiYWNrZ3JvdW5kQ29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgICB9XG5cbiAgICBzZXRTdHlsZShpY29uLCAnLnN3YWwyLXN1Y2Nlc3MtcmluZycsICdib3JkZXJDb2xvcicsIHBhcmFtcy5pY29uQ29sb3IpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cblxuICBjb25zdCBpY29uQ29udGVudCA9IGNvbnRlbnQgPT4gXCI8ZGl2IGNsYXNzPVxcXCJcIi5jb25jYXQoc3dhbENsYXNzZXNbJ2ljb24tY29udGVudCddLCBcIlxcXCI+XCIpLmNvbmNhdChjb250ZW50LCBcIjwvZGl2PlwiKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckltYWdlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbWFnZSA9IGdldEltYWdlKCk7XG5cbiAgICBpZiAoIXBhcmFtcy5pbWFnZVVybCkge1xuICAgICAgcmV0dXJuIGhpZGUoaW1hZ2UpO1xuICAgIH1cblxuICAgIHNob3coaW1hZ2UsICcnKTsgLy8gU3JjLCBhbHRcblxuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgcGFyYW1zLmltYWdlVXJsKTtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2FsdCcsIHBhcmFtcy5pbWFnZUFsdCk7IC8vIFdpZHRoLCBoZWlnaHRcblxuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICd3aWR0aCcsIHBhcmFtcy5pbWFnZVdpZHRoKTtcbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKGltYWdlLCAnaGVpZ2h0JywgcGFyYW1zLmltYWdlSGVpZ2h0KTsgLy8gQ2xhc3NcblxuICAgIGltYWdlLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzLmltYWdlO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoaW1hZ2UsIHBhcmFtcywgJ2ltYWdlJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJQcm9ncmVzc1N0ZXBzID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyID0gZ2V0UHJvZ3Jlc3NTdGVwcygpO1xuXG4gICAgaWYgKCFwYXJhbXMucHJvZ3Jlc3NTdGVwcyB8fCBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBoaWRlKHByb2dyZXNzU3RlcHNDb250YWluZXIpO1xuICAgIH1cblxuICAgIHNob3cocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKHBhcmFtcy5jdXJyZW50UHJvZ3Jlc3NTdGVwID49IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCkge1xuICAgICAgd2FybignSW52YWxpZCBjdXJyZW50UHJvZ3Jlc3NTdGVwIHBhcmFtZXRlciwgaXQgc2hvdWxkIGJlIGxlc3MgdGhhbiBwcm9ncmVzc1N0ZXBzLmxlbmd0aCAnICsgJyhjdXJyZW50UHJvZ3Jlc3NTdGVwIGxpa2UgSlMgYXJyYXlzIHN0YXJ0cyBmcm9tIDApJyk7XG4gICAgfVxuXG4gICAgcGFyYW1zLnByb2dyZXNzU3RlcHMuZm9yRWFjaCgoc3RlcCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXBFbCA9IGNyZWF0ZVN0ZXBFbGVtZW50KHN0ZXApO1xuICAgICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGVwRWwpO1xuXG4gICAgICBpZiAoaW5kZXggPT09IHBhcmFtcy5jdXJyZW50UHJvZ3Jlc3NTdGVwKSB7XG4gICAgICAgIGFkZENsYXNzKHN0ZXBFbCwgc3dhbENsYXNzZXNbJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJ10pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXggIT09IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY29uc3QgbGluZUVsID0gY3JlYXRlTGluZUVsZW1lbnQocGFyYW1zKTtcbiAgICAgICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5lRWwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ZXBcbiAgICogQHJldHVybnMge0hUTUxMSUVsZW1lbnR9XG4gICAqL1xuXG4gIGNvbnN0IGNyZWF0ZVN0ZXBFbGVtZW50ID0gc3RlcCA9PiB7XG4gICAgY29uc3Qgc3RlcEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBhZGRDbGFzcyhzdGVwRWwsIHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwJ10pO1xuICAgIHNldElubmVySHRtbChzdGVwRWwsIHN0ZXApO1xuICAgIHJldHVybiBzdGVwRWw7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxMSUVsZW1lbnR9XG4gICAqL1xuXG5cbiAgY29uc3QgY3JlYXRlTGluZUVsZW1lbnQgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IGxpbmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgYWRkQ2xhc3MobGluZUVsLCBzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcC1saW5lJ10pO1xuXG4gICAgaWYgKHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2UpIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUobGluZUVsLCAnd2lkdGgnLCBwYXJhbXMucHJvZ3Jlc3NTdGVwc0Rpc3RhbmNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGluZUVsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyVGl0bGUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZ2V0VGl0bGUoKTtcbiAgICB0b2dnbGUodGl0bGUsIHBhcmFtcy50aXRsZSB8fCBwYXJhbXMudGl0bGVUZXh0LCAnYmxvY2snKTtcblxuICAgIGlmIChwYXJhbXMudGl0bGUpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy50aXRsZSwgdGl0bGUpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMudGl0bGVUZXh0KSB7XG4gICAgICB0aXRsZS5pbm5lclRleHQgPSBwYXJhbXMudGl0bGVUZXh0O1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3ModGl0bGUsIHBhcmFtcywgJ3RpdGxlJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJQb3B1cCA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpOyAvLyBXaWR0aFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjE3MFxuXG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShjb250YWluZXIsICd3aWR0aCcsIHBhcmFtcy53aWR0aCk7XG4gICAgICBwb3B1cC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHBvcHVwLmluc2VydEJlZm9yZShnZXRMb2FkZXIoKSwgZ2V0SWNvbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShwb3B1cCwgJ3dpZHRoJywgcGFyYW1zLndpZHRoKTtcbiAgICB9IC8vIFBhZGRpbmdcblxuXG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShwb3B1cCwgJ3BhZGRpbmcnLCBwYXJhbXMucGFkZGluZyk7IC8vIENvbG9yXG5cbiAgICBpZiAocGFyYW1zLmNvbG9yKSB7XG4gICAgICBwb3B1cC5zdHlsZS5jb2xvciA9IHBhcmFtcy5jb2xvcjtcbiAgICB9IC8vIEJhY2tncm91bmRcblxuXG4gICAgaWYgKHBhcmFtcy5iYWNrZ3JvdW5kKSB7XG4gICAgICBwb3B1cC5zdHlsZS5iYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQ7XG4gICAgfVxuXG4gICAgaGlkZShnZXRWYWxpZGF0aW9uTWVzc2FnZSgpKTsgLy8gQ2xhc3Nlc1xuXG4gICAgYWRkQ2xhc3Nlcyhwb3B1cCwgcGFyYW1zKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBhZGRDbGFzc2VzID0gKHBvcHVwLCBwYXJhbXMpID0+IHtcbiAgICAvLyBEZWZhdWx0IENsYXNzICsgc2hvd0NsYXNzIHdoZW4gdXBkYXRpbmcgU3dhbC51cGRhdGUoe30pXG4gICAgcG9wdXAuY2xhc3NOYW1lID0gXCJcIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiIFwiKS5jb25jYXQoaXNWaXNpYmxlKHBvcHVwKSA/IHBhcmFtcy5zaG93Q2xhc3MucG9wdXAgOiAnJyk7XG5cbiAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10pO1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLm1vZGFsKTtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKHBvcHVwLCBwYXJhbXMsICdwb3B1cCcpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgcGFyYW1zLmN1c3RvbUNsYXNzKTtcbiAgICB9IC8vIEljb24gY2xhc3MgKCMxODQyKVxuXG5cbiAgICBpZiAocGFyYW1zLmljb24pIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlc1tcImljb24tXCIuY29uY2F0KHBhcmFtcy5pY29uKV0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgcmVuZGVyUG9wdXAoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ29udGFpbmVyKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlclByb2dyZXNzU3RlcHMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVySWNvbihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJJbWFnZShpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJUaXRsZShpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDbG9zZUJ1dHRvbihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDb250ZW50KGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckFjdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyRm9vdGVyKGluc3RhbmNlLCBwYXJhbXMpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZGlkUmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMuZGlkUmVuZGVyKGdldFBvcHVwKCkpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBEaXNtaXNzUmVhc29uID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgY2FuY2VsOiAnY2FuY2VsJyxcbiAgICBiYWNrZHJvcDogJ2JhY2tkcm9wJyxcbiAgICBjbG9zZTogJ2Nsb3NlJyxcbiAgICBlc2M6ICdlc2MnLFxuICAgIHRpbWVyOiAndGltZXInXG4gIH0pO1xuXG4gIC8vIEFkZGluZyBhcmlhLWhpZGRlbj1cInRydWVcIiB0byBlbGVtZW50cyBvdXRzaWRlIG9mIHRoZSBhY3RpdmUgbW9kYWwgZGlhbG9nIGVuc3VyZXMgdGhhdFxuICAvLyBlbGVtZW50cyBub3Qgd2l0aGluIHRoZSBhY3RpdmUgbW9kYWwgZGlhbG9nIHdpbGwgbm90IGJlIHN1cmZhY2VkIGlmIGEgdXNlciBvcGVucyBhIHNjcmVlblxuICAvLyByZWFkZXJcdTIwMTlzIGxpc3Qgb2YgZWxlbWVudHMgKGhlYWRpbmdzLCBmb3JtIGNvbnRyb2xzLCBsYW5kbWFya3MsIGV0Yy4pIGluIHRoZSBkb2N1bWVudC5cblxuICBjb25zdCBzZXRBcmlhSGlkZGVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHlDaGlsZHJlbiA9IEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gICAgYm9keUNoaWxkcmVuLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYgKGVsID09PSBnZXRDb250YWluZXIoKSB8fCBlbC5jb250YWlucyhnZXRDb250YWluZXIoKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicsIGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSk7XG4gICAgICB9XG5cbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCB1bnNldEFyaWFIaWRkZW4gPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keUNoaWxkcmVuID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICBib2R5Q2hpbGRyZW4uZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKTtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc3dhbFN0cmluZ1BhcmFtcyA9IFsnc3dhbC10aXRsZScsICdzd2FsLWh0bWwnLCAnc3dhbC1mb290ZXInXTtcbiAgY29uc3QgZ2V0VGVtcGxhdGVQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdHlwZW9mIHBhcmFtcy50ZW1wbGF0ZSA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy50ZW1wbGF0ZSkgOiBwYXJhbXMudGVtcGxhdGU7XG5cbiAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIC8qKiBAdHlwZSB7RG9jdW1lbnRGcmFnbWVudH0gKi9cblxuXG4gICAgY29uc3QgdGVtcGxhdGVDb250ZW50ID0gdGVtcGxhdGUuY29udGVudDtcbiAgICBzaG93V2FybmluZ3NGb3JFbGVtZW50cyh0ZW1wbGF0ZUNvbnRlbnQpO1xuICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oZ2V0U3dhbFBhcmFtcyh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsQnV0dG9ucyh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSW1hZ2UodGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEljb24odGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbElucHV0KHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxTdHJpbmdQYXJhbXModGVtcGxhdGVDb250ZW50LCBzd2FsU3RyaW5nUGFyYW1zKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG4gIGNvbnN0IGdldFN3YWxQYXJhbXMgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX0gKi9cblxuICAgIGNvbnN0IHN3YWxQYXJhbXMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLXBhcmFtJykpO1xuICAgIHN3YWxQYXJhbXMuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKHBhcmFtLCBbJ25hbWUnLCAndmFsdWUnXSk7XG4gICAgICBjb25zdCBwYXJhbU5hbWUgPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW0uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXG4gICAgICBpZiAodHlwZW9mIGRlZmF1bHRQYXJhbXNbcGFyYW1OYW1lXSA9PT0gJ2Jvb2xlYW4nICYmIHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFBhcmFtc1twYXJhbU5hbWVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxCdXR0b25zID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG5cbiAgICBjb25zdCBzd2FsQnV0dG9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtYnV0dG9uJykpO1xuICAgIHN3YWxCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoYnV0dG9uLCBbJ3R5cGUnLCAnY29sb3InLCAnYXJpYS1sYWJlbCddKTtcbiAgICAgIGNvbnN0IHR5cGUgPSBidXR0b24uZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICByZXN1bHRbXCJcIi5jb25jYXQodHlwZSwgXCJCdXR0b25UZXh0XCIpXSA9IGJ1dHRvbi5pbm5lckhUTUw7XG4gICAgICByZXN1bHRbXCJzaG93XCIuY29uY2F0KGNhcGl0YWxpemVGaXJzdExldHRlcih0eXBlKSwgXCJCdXR0b25cIildID0gdHJ1ZTtcblxuICAgICAgaWYgKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uQ29sb3JcIildID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnY29sb3InKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSkge1xuICAgICAgICByZXN1bHRbXCJcIi5jb25jYXQodHlwZSwgXCJCdXR0b25BcmlhTGFiZWxcIildID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxJbWFnZSA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cblxuICAgIGNvbnN0IGltYWdlID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaW1hZ2UnKTtcblxuICAgIGlmIChpbWFnZSkge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpbWFnZSwgWydzcmMnLCAnd2lkdGgnLCAnaGVpZ2h0JywgJ2FsdCddKTtcblxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnc3JjJykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlVXJsID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnd2lkdGgnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VXaWR0aCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnd2lkdGgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnaGVpZ2h0JykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlSGVpZ2h0ID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGltYWdlLmhhc0F0dHJpYnV0ZSgnYWx0JykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlQWx0ID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdhbHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsSWNvbiA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cblxuICAgIGNvbnN0IGljb24gPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pY29uJyk7XG5cbiAgICBpZiAoaWNvbikge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpY29uLCBbJ3R5cGUnLCAnY29sb3InXSk7XG5cbiAgICAgIGlmIChpY29uLmhhc0F0dHJpYnV0ZSgndHlwZScpKSB7XG4gICAgICAgIHJlc3VsdC5pY29uID0gaWNvbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGljb24uaGFzQXR0cmlidXRlKCdjb2xvcicpKSB7XG4gICAgICAgIHJlc3VsdC5pY29uQ29sb3IgPSBpY29uLmdldEF0dHJpYnV0ZSgnY29sb3InKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0Lmljb25IdG1sID0gaWNvbi5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbElucHV0ID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgaW5wdXQgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pbnB1dCcpO1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGlucHV0LCBbJ3R5cGUnLCAnbGFiZWwnLCAncGxhY2Vob2xkZXInLCAndmFsdWUnXSk7XG4gICAgICByZXN1bHQuaW5wdXQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSB8fCAndGV4dCc7XG5cbiAgICAgIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ2xhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0LmlucHV0TGFiZWwgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2xhYmVsJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgcmVzdWx0LmlucHV0UGxhY2Vob2xkZXIgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykpIHtcbiAgICAgICAgcmVzdWx0LmlucHV0VmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX0gKi9cblxuXG4gICAgY29uc3QgaW5wdXRPcHRpb25zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1pbnB1dC1vcHRpb24nKSk7XG5cbiAgICBpZiAoaW5wdXRPcHRpb25zLmxlbmd0aCkge1xuICAgICAgcmVzdWx0LmlucHV0T3B0aW9ucyA9IHt9O1xuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhvcHRpb24sIFsndmFsdWUnXSk7XG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uTmFtZSA9IG9wdGlvbi5pbm5lckhUTUw7XG4gICAgICAgIHJlc3VsdC5pbnB1dE9wdGlvbnNbb3B0aW9uVmFsdWVdID0gb3B0aW9uTmFtZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXJhbU5hbWVzXG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbFN0cmluZ1BhcmFtcyA9ICh0ZW1wbGF0ZUNvbnRlbnQsIHBhcmFtTmFtZXMpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGZvciAoY29uc3QgaSBpbiBwYXJhbU5hbWVzKSB7XG4gICAgICBjb25zdCBwYXJhbU5hbWUgPSBwYXJhbU5hbWVzW2ldO1xuICAgICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cblxuICAgICAgY29uc3QgdGFnID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1OYW1lKTtcblxuICAgICAgaWYgKHRhZykge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKHRhZywgW10pO1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lLnJlcGxhY2UoL15zd2FsLS8sICcnKV0gPSB0YWcuaW5uZXJIVE1MLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBzaG93V2FybmluZ3NGb3JFbGVtZW50cyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgYWxsb3dlZEVsZW1lbnRzID0gc3dhbFN0cmluZ1BhcmFtcy5jb25jYXQoWydzd2FsLXBhcmFtJywgJ3N3YWwtYnV0dG9uJywgJ3N3YWwtaW1hZ2UnLCAnc3dhbC1pY29uJywgJ3N3YWwtaW5wdXQnLCAnc3dhbC1pbnB1dC1vcHRpb24nXSk7XG4gICAgQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQuY2hpbGRyZW4pLmZvckVhY2goZWwgPT4ge1xuICAgICAgY29uc3QgdGFnTmFtZSA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgaWYgKGFsbG93ZWRFbGVtZW50cy5pbmRleE9mKHRhZ05hbWUpID09PSAtMSkge1xuICAgICAgICB3YXJuKFwiVW5yZWNvZ25pemVkIGVsZW1lbnQgPFwiLmNvbmNhdCh0YWdOYW1lLCBcIj5cIikpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gYWxsb3dlZEF0dHJpYnV0ZXNcbiAgICovXG5cblxuICBjb25zdCBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzID0gKGVsLCBhbGxvd2VkQXR0cmlidXRlcykgPT4ge1xuICAgIEFycmF5LmZyb20oZWwuYXR0cmlidXRlcykuZm9yRWFjaChhdHRyaWJ1dGUgPT4ge1xuICAgICAgaWYgKGFsbG93ZWRBdHRyaWJ1dGVzLmluZGV4T2YoYXR0cmlidXRlLm5hbWUpID09PSAtMSkge1xuICAgICAgICB3YXJuKFtcIlVucmVjb2duaXplZCBhdHRyaWJ1dGUgXFxcIlwiLmNvbmNhdChhdHRyaWJ1dGUubmFtZSwgXCJcXFwiIG9uIDxcIikuY29uY2F0KGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSwgXCI+LlwiKSwgXCJcIi5jb25jYXQoYWxsb3dlZEF0dHJpYnV0ZXMubGVuZ3RoID8gXCJBbGxvd2VkIGF0dHJpYnV0ZXMgYXJlOiBcIi5jb25jYXQoYWxsb3dlZEF0dHJpYnV0ZXMuam9pbignLCAnKSkgOiAnVG8gc2V0IHRoZSB2YWx1ZSwgdXNlIEhUTUwgd2l0aGluIHRoZSBlbGVtZW50LicpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMgPSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxpZGF0aW9uTWVzc2FnZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQgfCBzdHJpbmc+fVxuICAgICAqL1xuICAgIGVtYWlsOiAoc3RyaW5nLCB2YWxpZGF0aW9uTWVzc2FnZSkgPT4ge1xuICAgICAgcmV0dXJuIC9eW2EtekEtWjAtOS4rXy1dK0BbYS16QS1aMC05Li1dK1xcLlthLXpBLVowLTktXXsyLDI0fSQvLnRlc3Qoc3RyaW5nKSA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZXNvbHZlKHZhbGlkYXRpb25NZXNzYWdlIHx8ICdJbnZhbGlkIGVtYWlsIGFkZHJlc3MnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxpZGF0aW9uTWVzc2FnZVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQgfCBzdHJpbmc+fVxuICAgICAqL1xuICAgIHVybDogKHN0cmluZywgdmFsaWRhdGlvbk1lc3NhZ2UpID0+IHtcbiAgICAgIC8vIHRha2VuIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM4MDk0MzUgd2l0aCBhIHNtYWxsIGNoYW5nZSBmcm9tICMxMzA2IGFuZCAjMjAxM1xuICAgICAgcmV0dXJuIC9eaHR0cHM/OlxcL1xcLyh3d3dcXC4pP1stYS16QS1aMC05QDolLl8rfiM9XXsxLDI1Nn1cXC5bYS16XXsyLDYzfVxcYihbLWEtekEtWjAtOUA6JV8rLn4jPyYvPV0qKSQvLnRlc3Qoc3RyaW5nKSA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZXNvbHZlKHZhbGlkYXRpb25NZXNzYWdlIHx8ICdJbnZhbGlkIFVSTCcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldERlZmF1bHRJbnB1dFZhbGlkYXRvcnMocGFyYW1zKSB7XG4gICAgLy8gVXNlIGRlZmF1bHQgYGlucHV0VmFsaWRhdG9yYCBmb3Igc3VwcG9ydGVkIGlucHV0IHR5cGVzIGlmIG5vdCBwcm92aWRlZFxuICAgIGlmICghcGFyYW1zLmlucHV0VmFsaWRhdG9yKSB7XG4gICAgICBPYmplY3Qua2V5cyhkZWZhdWx0SW5wdXRWYWxpZGF0b3JzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChwYXJhbXMuaW5wdXQgPT09IGtleSkge1xuICAgICAgICAgIHBhcmFtcy5pbnB1dFZhbGlkYXRvciA9IGRlZmF1bHRJbnB1dFZhbGlkYXRvcnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUN1c3RvbVRhcmdldEVsZW1lbnQocGFyYW1zKSB7XG4gICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBjdXN0b20gdGFyZ2V0IGVsZW1lbnQgaXMgdmFsaWRcbiAgICBpZiAoIXBhcmFtcy50YXJnZXQgfHwgdHlwZW9mIHBhcmFtcy50YXJnZXQgPT09ICdzdHJpbmcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy50YXJnZXQpIHx8IHR5cGVvZiBwYXJhbXMudGFyZ2V0ICE9PSAnc3RyaW5nJyAmJiAhcGFyYW1zLnRhcmdldC5hcHBlbmRDaGlsZCkge1xuICAgICAgd2FybignVGFyZ2V0IHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJib2R5XCInKTtcbiAgICAgIHBhcmFtcy50YXJnZXQgPSAnYm9keSc7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZXQgdHlwZSwgdGV4dCBhbmQgYWN0aW9ucyBvbiBwb3B1cFxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiBzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuICAgIHNldERlZmF1bHRJbnB1dFZhbGlkYXRvcnMocGFyYW1zKTsgLy8gc2hvd0xvYWRlck9uQ29uZmlybSAmJiBwcmVDb25maXJtXG5cbiAgICBpZiAocGFyYW1zLnNob3dMb2FkZXJPbkNvbmZpcm0gJiYgIXBhcmFtcy5wcmVDb25maXJtKSB7XG4gICAgICB3YXJuKCdzaG93TG9hZGVyT25Db25maXJtIGlzIHNldCB0byB0cnVlLCBidXQgcHJlQ29uZmlybSBpcyBub3QgZGVmaW5lZC5cXG4nICsgJ3Nob3dMb2FkZXJPbkNvbmZpcm0gc2hvdWxkIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCBwcmVDb25maXJtLCBzZWUgdXNhZ2UgZXhhbXBsZTpcXG4nICsgJ2h0dHBzOi8vc3dlZXRhbGVydDIuZ2l0aHViLmlvLyNhamF4LXJlcXVlc3QnKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZUN1c3RvbVRhcmdldEVsZW1lbnQocGFyYW1zKTsgLy8gUmVwbGFjZSBuZXdsaW5lcyB3aXRoIDxicj4gaW4gdGl0bGVcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLnRpdGxlID09PSAnc3RyaW5nJykge1xuICAgICAgcGFyYW1zLnRpdGxlID0gcGFyYW1zLnRpdGxlLnNwbGl0KCdcXG4nKS5qb2luKCc8YnIgLz4nKTtcbiAgICB9XG5cbiAgICBpbml0KHBhcmFtcyk7XG4gIH1cblxuICBjbGFzcyBUaW1lciB7XG4gICAgY29uc3RydWN0b3IoY2FsbGJhY2ssIGRlbGF5KSB7XG4gICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICB0aGlzLnJlbWFpbmluZyA9IGRlbGF5O1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICBpZiAoIXRoaXMucnVubmluZykge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLmlkID0gc2V0VGltZW91dCh0aGlzLmNhbGxiYWNrLCB0aGlzLnJlbWFpbmluZyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaWQpO1xuICAgICAgICB0aGlzLnJlbWFpbmluZyAtPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRlZC5nZXRUaW1lKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBpbmNyZWFzZShuKSB7XG4gICAgICBjb25zdCBydW5uaW5nID0gdGhpcy5ydW5uaW5nO1xuXG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW1haW5pbmcgKz0gbjtcblxuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgZ2V0VGltZXJMZWZ0KCkge1xuICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgaXNSdW5uaW5nKCkge1xuICAgICAgcmV0dXJuIHRoaXMucnVubmluZztcbiAgICB9XG5cbiAgfVxuXG4gIGNvbnN0IGZpeFNjcm9sbGJhciA9ICgpID0+IHtcbiAgICAvLyBmb3IgcXVldWVzLCBkbyBub3QgZG8gdGhpcyBtb3JlIHRoYW4gb25jZVxuICAgIGlmIChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gaWYgdGhlIGJvZHkgaGFzIG92ZXJmbG93XG5cblxuICAgIGlmIChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgLy8gYWRkIHBhZGRpbmcgc28gdGhlIGNvbnRlbnQgZG9lc24ndCBzaGlmdCBhZnRlciByZW1vdmFsIG9mIHNjcm9sbGJhclxuICAgICAgc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIlwiLmNvbmNhdChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyArIG1lYXN1cmVTY3JvbGxiYXIoKSwgXCJweFwiKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHVuZG9TY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgaWYgKHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICE9PSBudWxsKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiXCIuY29uY2F0KHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nLCBcInB4XCIpO1xuICAgICAgc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuXG4gIGNvbnN0IGlPU2ZpeCA9ICgpID0+IHtcbiAgICBjb25zdCBpT1MgPSAvLyBAdHMtaWdub3JlXG4gICAgL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIXdpbmRvdy5NU1N0cmVhbSB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT09ICdNYWNJbnRlbCcgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMTtcblxuICAgIGlmIChpT1MgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBcIlwiLmNvbmNhdChvZmZzZXQgKiAtMSwgXCJweFwiKTtcbiAgICAgIGFkZENsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCk7XG4gICAgICBsb2NrQm9keVNjcm9sbCgpO1xuICAgICAgYWRkQm90dG9tUGFkZGluZ0ZvclRhbGxQb3B1cHMoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE5NDhcbiAgICovXG5cbiAgY29uc3QgYWRkQm90dG9tUGFkZGluZ0ZvclRhbGxQb3B1cHMgPSAoKSA9PiB7XG4gICAgY29uc3QgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGNvbnN0IGlPUyA9ICEhdWEubWF0Y2goL2lQYWQvaSkgfHwgISF1YS5tYXRjaCgvaVBob25lL2kpO1xuICAgIGNvbnN0IHdlYmtpdCA9ICEhdWEubWF0Y2goL1dlYktpdC9pKTtcbiAgICBjb25zdCBpT1NTYWZhcmkgPSBpT1MgJiYgd2Via2l0ICYmICF1YS5tYXRjaCgvQ3JpT1MvaSk7XG5cbiAgICBpZiAoaU9TU2FmYXJpKSB7XG4gICAgICBjb25zdCBib3R0b21QYW5lbEhlaWdodCA9IDQ0O1xuXG4gICAgICBpZiAoZ2V0UG9wdXAoKS5zY3JvbGxIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBib3R0b21QYW5lbEhlaWdodCkge1xuICAgICAgICBnZXRDb250YWluZXIoKS5zdHlsZS5wYWRkaW5nQm90dG9tID0gXCJcIi5jb25jYXQoYm90dG9tUGFuZWxIZWlnaHQsIFwicHhcIik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xMjQ2XG4gICAqL1xuXG5cbiAgY29uc3QgbG9ja0JvZHlTY3JvbGwgPSAoKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgbGV0IHByZXZlbnRUb3VjaE1vdmU7XG5cbiAgICBjb250YWluZXIub250b3VjaHN0YXJ0ID0gZSA9PiB7XG4gICAgICBwcmV2ZW50VG91Y2hNb3ZlID0gc2hvdWxkUHJldmVudFRvdWNoTW92ZShlKTtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyLm9udG91Y2htb3ZlID0gZSA9PiB7XG4gICAgICBpZiAocHJldmVudFRvdWNoTW92ZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBzaG91bGRQcmV2ZW50VG91Y2hNb3ZlID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcblxuICAgIGlmIChpc1N0eWx1cyhldmVudCkgfHwgaXNab29tKGV2ZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFpc1Njcm9sbGFibGUoY29udGFpbmVyKSAmJiB0YXJnZXQudGFnTmFtZSAhPT0gJ0lOUFVUJyAmJiAvLyAjMTYwM1xuICAgIHRhcmdldC50YWdOYW1lICE9PSAnVEVYVEFSRUEnICYmIC8vICMyMjY2XG4gICAgIShpc1Njcm9sbGFibGUoZ2V0SHRtbENvbnRhaW5lcigpKSAmJiAvLyAjMTk0NFxuICAgIGdldEh0bWxDb250YWluZXIoKS5jb250YWlucyh0YXJnZXQpKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xNzg2XG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZXZlbnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgaXNTdHlsdXMgPSBldmVudCA9PiB7XG4gICAgcmV0dXJuIGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggJiYgZXZlbnQudG91Y2hlc1swXS50b3VjaFR5cGUgPT09ICdzdHlsdXMnO1xuICB9O1xuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xODkxXG4gICAqXG4gICAqIEBwYXJhbSB7VG91Y2hFdmVudH0gZXZlbnRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgaXNab29tID0gZXZlbnQgPT4ge1xuICAgIHJldHVybiBldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMTtcbiAgfTtcblxuICBjb25zdCB1bmRvSU9TZml4ID0gKCkgPT4ge1xuICAgIGlmIChoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCwgMTApO1xuICAgICAgcmVtb3ZlQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XG4gICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IG9mZnNldCAqIC0xO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBTSE9XX0NMQVNTX1RJTUVPVVQgPSAxMDtcbiAgLyoqXG4gICAqIE9wZW4gcG9wdXAsIGFkZCBuZWNlc3NhcnkgY2xhc3NlcyBhbmQgc3R5bGVzLCBmaXggc2Nyb2xsYmFyXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3Qgb3BlblBvcHVwID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy53aWxsT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGFyYW1zLndpbGxPcGVuKHBvcHVwKTtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5U3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gICAgY29uc3QgaW5pdGlhbEJvZHlPdmVyZmxvdyA9IGJvZHlTdHlsZXMub3ZlcmZsb3dZO1xuICAgIGFkZENsYXNzZXMkMShjb250YWluZXIsIHBvcHVwLCBwYXJhbXMpOyAvLyBzY3JvbGxpbmcgaXMgJ2hpZGRlbicgdW50aWwgYW5pbWF0aW9uIGlzIGRvbmUsIGFmdGVyIHRoYXQgJ2F1dG8nXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldFNjcm9sbGluZ1Zpc2liaWxpdHkoY29udGFpbmVyLCBwb3B1cCk7XG4gICAgfSwgU0hPV19DTEFTU19USU1FT1VUKTtcblxuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIGZpeFNjcm9sbENvbnRhaW5lcihjb250YWluZXIsIHBhcmFtcy5zY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KTtcbiAgICAgIHNldEFyaWFIaWRkZW4oKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVG9hc3QoKSAmJiAhZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmRpZE9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcGFyYW1zLmRpZE9wZW4ocG9wdXApKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzWyduby10cmFuc2l0aW9uJ10pO1xuICB9O1xuXG4gIGNvbnN0IHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQgPSBldmVudCA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gcG9wdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBwb3B1cC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50LCBzd2FsT3BlbkFuaW1hdGlvbkZpbmlzaGVkKTtcbiAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICB9O1xuXG4gIGNvbnN0IHNldFNjcm9sbGluZ1Zpc2liaWxpdHkgPSAoY29udGFpbmVyLCBwb3B1cCkgPT4ge1xuICAgIGlmIChhbmltYXRpb25FbmRFdmVudCAmJiBoYXNDc3NBbmltYXRpb24ocG9wdXApKSB7XG4gICAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XG4gICAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50LCBzd2FsT3BlbkFuaW1hdGlvbkZpbmlzaGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdhdXRvJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZml4U2Nyb2xsQ29udGFpbmVyID0gKGNvbnRhaW5lciwgc2Nyb2xsYmFyUGFkZGluZywgaW5pdGlhbEJvZHlPdmVyZmxvdykgPT4ge1xuICAgIGlPU2ZpeCgpO1xuXG4gICAgaWYgKHNjcm9sbGJhclBhZGRpbmcgJiYgaW5pdGlhbEJvZHlPdmVyZmxvdyAhPT0gJ2hpZGRlbicpIHtcbiAgICAgIGZpeFNjcm9sbGJhcigpO1xuICAgIH0gLy8gc3dlZXRhbGVydDIvaXNzdWVzLzEyNDdcblxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGRDbGFzc2VzJDEgPSAoY29udGFpbmVyLCBwb3B1cCwgcGFyYW1zKSA9PiB7XG4gICAgYWRkQ2xhc3MoY29udGFpbmVyLCBwYXJhbXMuc2hvd0NsYXNzLmJhY2tkcm9wKTsgLy8gdGhpcyB3b3JrYXJvdW5kIHdpdGggb3BhY2l0eSBpcyBuZWVkZWQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjA1OVxuXG4gICAgcG9wdXAuc3R5bGUuc2V0UHJvcGVydHkoJ29wYWNpdHknLCAnMCcsICdpbXBvcnRhbnQnKTtcbiAgICBzaG93KHBvcHVwLCAnZ3JpZCcpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gQW5pbWF0ZSBwb3B1cCByaWdodCBhZnRlciBzaG93aW5nIGl0XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgcGFyYW1zLnNob3dDbGFzcy5wb3B1cCk7IC8vIGFuZCByZW1vdmUgdGhlIG9wYWNpdHkgd29ya2Fyb3VuZFxuXG4gICAgICBwb3B1cC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnb3BhY2l0eScpO1xuICAgIH0sIFNIT1dfQ0xBU1NfVElNRU9VVCk7IC8vIDEwbXMgaW4gb3JkZXIgdG8gZml4ICMyMDYyXG5cbiAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXMuc2hvd24pO1xuXG4gICAgaWYgKHBhcmFtcy5oZWlnaHRBdXRvICYmIHBhcmFtcy5iYWNrZHJvcCAmJiAhcGFyYW1zLnRvYXN0KSB7XG4gICAgICBhZGRDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgc3dhbENsYXNzZXNbJ2hlaWdodC1hdXRvJ10pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2hvd3MgbG9hZGVyIChzcGlubmVyKSwgdGhpcyBpcyB1c2VmdWwgd2l0aCBBSkFYIHJlcXVlc3RzLlxuICAgKiBCeSBkZWZhdWx0IHRoZSBsb2FkZXIgYmUgc2hvd24gaW5zdGVhZCBvZiB0aGUgXCJDb25maXJtXCIgYnV0dG9uLlxuICAgKi9cblxuICBjb25zdCBzaG93TG9hZGluZyA9IGJ1dHRvblRvUmVwbGFjZSA9PiB7XG4gICAgbGV0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmICghcG9wdXApIHtcbiAgICAgIG5ldyBTd2FsKCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgfVxuXG4gICAgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpO1xuXG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgaGlkZShnZXRJY29uKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBsYWNlQnV0dG9uKHBvcHVwLCBidXR0b25Ub1JlcGxhY2UpO1xuICAgIH1cblxuICAgIHNob3cobG9hZGVyKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycsICd0cnVlJyk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLWJ1c3knLCAndHJ1ZScpO1xuICAgIHBvcHVwLmZvY3VzKCk7XG4gIH07XG5cbiAgY29uc3QgcmVwbGFjZUJ1dHRvbiA9IChwb3B1cCwgYnV0dG9uVG9SZXBsYWNlKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTtcblxuICAgIGlmICghYnV0dG9uVG9SZXBsYWNlICYmIGlzVmlzaWJsZShnZXRDb25maXJtQnV0dG9uKCkpKSB7XG4gICAgICBidXR0b25Ub1JlcGxhY2UgPSBnZXRDb25maXJtQnV0dG9uKCk7XG4gICAgfVxuXG4gICAgc2hvdyhhY3Rpb25zKTtcblxuICAgIGlmIChidXR0b25Ub1JlcGxhY2UpIHtcbiAgICAgIGhpZGUoYnV0dG9uVG9SZXBsYWNlKTtcbiAgICAgIGxvYWRlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnV0dG9uLXRvLXJlcGxhY2UnLCBidXR0b25Ub1JlcGxhY2UuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBsb2FkZXIucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobG9hZGVyLCBidXR0b25Ub1JlcGxhY2UpO1xuICAgIGFkZENsYXNzKFtwb3B1cCwgYWN0aW9uc10sIHN3YWxDbGFzc2VzLmxvYWRpbmcpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUlucHV0T3B0aW9uc0FuZFZhbHVlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBpZiAocGFyYW1zLmlucHV0ID09PSAnc2VsZWN0JyB8fCBwYXJhbXMuaW5wdXQgPT09ICdyYWRpbycpIHtcbiAgICAgIGhhbmRsZUlucHV0T3B0aW9ucyhpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKFsndGV4dCcsICdlbWFpbCcsICdudW1iZXInLCAndGVsJywgJ3RleHRhcmVhJ10uaW5jbHVkZXMocGFyYW1zLmlucHV0KSAmJiAoaGFzVG9Qcm9taXNlRm4ocGFyYW1zLmlucHV0VmFsdWUpIHx8IGlzUHJvbWlzZShwYXJhbXMuaW5wdXRWYWx1ZSkpKSB7XG4gICAgICBzaG93TG9hZGluZyhnZXRDb25maXJtQnV0dG9uKCkpO1xuICAgICAgaGFuZGxlSW5wdXRWYWx1ZShpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGdldElucHV0VmFsdWUgPSAoaW5zdGFuY2UsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBpbnN0YW5jZS5nZXRJbnB1dCgpO1xuXG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3dpdGNoIChpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gZ2V0Q2hlY2tib3hWYWx1ZShpbnB1dCk7XG5cbiAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgcmV0dXJuIGdldFJhZGlvVmFsdWUoaW5wdXQpO1xuXG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIGdldEZpbGVWYWx1ZShpbnB1dCk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBpbm5lclBhcmFtcy5pbnB1dEF1dG9UcmltID8gaW5wdXQudmFsdWUudHJpbSgpIDogaW5wdXQudmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGdldENoZWNrYm94VmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5jaGVja2VkID8gMSA6IDA7XG5cbiAgY29uc3QgZ2V0UmFkaW9WYWx1ZSA9IGlucHV0ID0+IGlucHV0LmNoZWNrZWQgPyBpbnB1dC52YWx1ZSA6IG51bGw7XG5cbiAgY29uc3QgZ2V0RmlsZVZhbHVlID0gaW5wdXQgPT4gaW5wdXQuZmlsZXMubGVuZ3RoID8gaW5wdXQuZ2V0QXR0cmlidXRlKCdtdWx0aXBsZScpICE9PSBudWxsID8gaW5wdXQuZmlsZXMgOiBpbnB1dC5maWxlc1swXSA6IG51bGw7XG5cbiAgY29uc3QgaGFuZGxlSW5wdXRPcHRpb25zID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBjb25zdCBwcm9jZXNzSW5wdXRPcHRpb25zID0gaW5wdXRPcHRpb25zID0+IHBvcHVsYXRlSW5wdXRPcHRpb25zW3BhcmFtcy5pbnB1dF0ocG9wdXAsIGZvcm1hdElucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpLCBwYXJhbXMpO1xuXG4gICAgaWYgKGhhc1RvUHJvbWlzZUZuKHBhcmFtcy5pbnB1dE9wdGlvbnMpIHx8IGlzUHJvbWlzZShwYXJhbXMuaW5wdXRPcHRpb25zKSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0Q29uZmlybUJ1dHRvbigpKTtcbiAgICAgIGFzUHJvbWlzZShwYXJhbXMuaW5wdXRPcHRpb25zKS50aGVuKGlucHV0T3B0aW9ucyA9PiB7XG4gICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgIHByb2Nlc3NJbnB1dE9wdGlvbnMoaW5wdXRPcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtcy5pbnB1dE9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICBwcm9jZXNzSW5wdXRPcHRpb25zKHBhcmFtcy5pbnB1dE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dE9wdGlvbnMhIEV4cGVjdGVkIG9iamVjdCwgTWFwIG9yIFByb21pc2UsIGdvdCBcIi5jb25jYXQodHlwZW9mIHBhcmFtcy5pbnB1dE9wdGlvbnMpKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSW5wdXRWYWx1ZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBpbnN0YW5jZS5nZXRJbnB1dCgpO1xuICAgIGhpZGUoaW5wdXQpO1xuICAgIGFzUHJvbWlzZShwYXJhbXMuaW5wdXRWYWx1ZSkudGhlbihpbnB1dFZhbHVlID0+IHtcbiAgICAgIGlucHV0LnZhbHVlID0gcGFyYW1zLmlucHV0ID09PSAnbnVtYmVyJyA/IHBhcnNlRmxvYXQoaW5wdXRWYWx1ZSkgfHwgMCA6IFwiXCIuY29uY2F0KGlucHV0VmFsdWUpO1xuICAgICAgc2hvdyhpbnB1dCk7XG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgZXJyb3IoXCJFcnJvciBpbiBpbnB1dFZhbHVlIHByb21pc2U6IFwiLmNvbmNhdChlcnIpKTtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICBzaG93KGlucHV0KTtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHBvcHVsYXRlSW5wdXRPcHRpb25zID0ge1xuICAgIHNlbGVjdDogKHBvcHVwLCBpbnB1dE9wdGlvbnMsIHBhcmFtcykgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5zZWxlY3QpO1xuXG4gICAgICBjb25zdCByZW5kZXJPcHRpb24gPSAocGFyZW50LCBvcHRpb25MYWJlbCwgb3B0aW9uVmFsdWUpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvblZhbHVlO1xuICAgICAgICBzZXRJbm5lckh0bWwob3B0aW9uLCBvcHRpb25MYWJlbCk7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGlzU2VsZWN0ZWQob3B0aW9uVmFsdWUsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICB9O1xuXG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChpbnB1dE9wdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gaW5wdXRPcHRpb25bMV07IC8vIDxvcHRncm91cD4gc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw0MDEvaW50ZXJhY3QvZm9ybXMuaHRtbCNoLTE3LjZcbiAgICAgICAgLy8gXCIuLi5hbGwgT1BUR1JPVVAgZWxlbWVudHMgbXVzdCBiZSBzcGVjaWZpZWQgZGlyZWN0bHkgd2l0aGluIGEgU0VMRUNUIGVsZW1lbnQgKGkuZS4sIGdyb3VwcyBtYXkgbm90IGJlIG5lc3RlZCkuLi5cIlxuICAgICAgICAvLyBjaGVjayB3aGV0aGVyIHRoaXMgaXMgYSA8b3B0Z3JvdXA+XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9uTGFiZWwpKSB7XG4gICAgICAgICAgLy8gaWYgaXQgaXMgYW4gYXJyYXksIHRoZW4gaXQgaXMgYW4gPG9wdGdyb3VwPlxuICAgICAgICAgIGNvbnN0IG9wdGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKTtcbiAgICAgICAgICBvcHRncm91cC5sYWJlbCA9IG9wdGlvblZhbHVlO1xuICAgICAgICAgIG9wdGdyb3VwLmRpc2FibGVkID0gZmFsc2U7IC8vIG5vdCBjb25maWd1cmFibGUgZm9yIG5vd1xuXG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGdyb3VwKTtcbiAgICAgICAgICBvcHRpb25MYWJlbC5mb3JFYWNoKG8gPT4gcmVuZGVyT3B0aW9uKG9wdGdyb3VwLCBvWzFdLCBvWzBdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0aW9uPlxuICAgICAgICAgIHJlbmRlck9wdGlvbihzZWxlY3QsIG9wdGlvbkxhYmVsLCBvcHRpb25WYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2VsZWN0LmZvY3VzKCk7XG4gICAgfSxcbiAgICByYWRpbzogKHBvcHVwLCBpbnB1dE9wdGlvbnMsIHBhcmFtcykgPT4ge1xuICAgICAgY29uc3QgcmFkaW8gPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnJhZGlvKTtcbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGlucHV0T3B0aW9uID0+IHtcbiAgICAgICAgY29uc3QgcmFkaW9WYWx1ZSA9IGlucHV0T3B0aW9uWzBdO1xuICAgICAgICBjb25zdCByYWRpb0xhYmVsID0gaW5wdXRPcHRpb25bMV07XG4gICAgICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBjb25zdCByYWRpb0xhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIHJhZGlvSW5wdXQudHlwZSA9ICdyYWRpbyc7XG4gICAgICAgIHJhZGlvSW5wdXQubmFtZSA9IHN3YWxDbGFzc2VzLnJhZGlvO1xuICAgICAgICByYWRpb0lucHV0LnZhbHVlID0gcmFkaW9WYWx1ZTtcblxuICAgICAgICBpZiAoaXNTZWxlY3RlZChyYWRpb1ZhbHVlLCBwYXJhbXMuaW5wdXRWYWx1ZSkpIHtcbiAgICAgICAgICByYWRpb0lucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNldElubmVySHRtbChsYWJlbCwgcmFkaW9MYWJlbCk7XG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzLmxhYmVsO1xuICAgICAgICByYWRpb0xhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChyYWRpb0lucHV0KTtcbiAgICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICByYWRpby5hcHBlbmRDaGlsZChyYWRpb0xhYmVsRWxlbWVudCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cbiAgICAgIGlmIChyYWRpb3MubGVuZ3RoKSB7XG4gICAgICAgIHJhZGlvc1swXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGBpbnB1dE9wdGlvbnNgIGludG8gYW4gYXJyYXkgb2YgYFt2YWx1ZSwgbGFiZWxdYHNcbiAgICogQHBhcmFtIGlucHV0T3B0aW9uc1xuICAgKi9cblxuICBjb25zdCBmb3JtYXRJbnB1dE9wdGlvbnMgPSBpbnB1dE9wdGlvbnMgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnICYmIGlucHV0T3B0aW9ucyBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgbGV0IHZhbHVlRm9ybWF0dGVkID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUZvcm1hdHRlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRncm91cD5cbiAgICAgICAgICB2YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdElucHV0T3B0aW9ucyh2YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaChba2V5LCB2YWx1ZUZvcm1hdHRlZF0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKGlucHV0T3B0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBsZXQgdmFsdWVGb3JtYXR0ZWQgPSBpbnB1dE9wdGlvbnNba2V5XTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlRm9ybWF0dGVkID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vIGNhc2Ugb2YgPG9wdGdyb3VwPlxuICAgICAgICAgIHZhbHVlRm9ybWF0dGVkID0gZm9ybWF0SW5wdXRPcHRpb25zKHZhbHVlRm9ybWF0dGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlRm9ybWF0dGVkXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IGlzU2VsZWN0ZWQgPSAob3B0aW9uVmFsdWUsIGlucHV0VmFsdWUpID0+IHtcbiAgICByZXR1cm4gaW5wdXRWYWx1ZSAmJiBpbnB1dFZhbHVlLnRvU3RyaW5nKCkgPT09IG9wdGlvblZhbHVlLnRvU3RyaW5nKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhpZGVzIGxvYWRlciBhbmQgc2hvd3MgYmFjayB0aGUgYnV0dG9uIHdoaWNoIHdhcyBoaWRkZW4gYnkgLnNob3dMb2FkaW5nKClcbiAgICovXG5cbiAgZnVuY3Rpb24gaGlkZUxvYWRpbmcoKSB7XG4gICAgLy8gZG8gbm90aGluZyBpZiBwb3B1cCBpcyBjbG9zZWRcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGhpZGUoZG9tQ2FjaGUubG9hZGVyKTtcblxuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIGlmIChpbm5lclBhcmFtcy5pY29uKSB7XG4gICAgICAgIHNob3coZ2V0SWNvbigpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd1JlbGF0ZWRCdXR0b24oZG9tQ2FjaGUpO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzKFtkb21DYWNoZS5wb3B1cCwgZG9tQ2FjaGUuYWN0aW9uc10sIHN3YWxDbGFzc2VzLmxvYWRpbmcpO1xuICAgIGRvbUNhY2hlLnBvcHVwLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1idXN5Jyk7XG4gICAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc2hvd1JlbGF0ZWRCdXR0b24gPSBkb21DYWNoZSA9PiB7XG4gICAgY29uc3QgYnV0dG9uVG9SZXBsYWNlID0gZG9tQ2FjaGUucG9wdXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShkb21DYWNoZS5sb2FkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWJ1dHRvbi10by1yZXBsYWNlJykpO1xuXG4gICAgaWYgKGJ1dHRvblRvUmVwbGFjZS5sZW5ndGgpIHtcbiAgICAgIHNob3coYnV0dG9uVG9SZXBsYWNlWzBdLCAnaW5saW5lLWJsb2NrJyk7XG4gICAgfSBlbHNlIGlmIChhbGxCdXR0b25zQXJlSGlkZGVuKCkpIHtcbiAgICAgIGhpZGUoZG9tQ2FjaGUuYWN0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbnB1dCBET00gbm9kZSwgdGhpcyBtZXRob2Qgd29ya3Mgd2l0aCBpbnB1dCBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldElucHV0JDEoaW5zdGFuY2UpIHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdGhpcyk7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KGluc3RhbmNlIHx8IHRoaXMpO1xuXG4gICAgaWYgKCFkb21DYWNoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldElucHV0KGRvbUNhY2hlLnBvcHVwLCBpbm5lclBhcmFtcy5pbnB1dCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgY29udGFpbnMgYFdlYWtNYXBgcyBmb3IgZWFjaCBlZmZlY3RpdmVseS1cInByaXZhdGUgIHByb3BlcnR5XCIgdGhhdCBhIGBTd2FsYCBoYXMuXG4gICAqIEZvciBleGFtcGxlLCB0byBzZXQgdGhlIHByaXZhdGUgcHJvcGVydHkgXCJmb29cIiBvZiBgdGhpc2AgdG8gXCJiYXJcIiwgeW91IGNhbiBgcHJpdmF0ZVByb3BzLmZvby5zZXQodGhpcywgJ2JhcicpYFxuICAgKiBUaGlzIGlzIHRoZSBhcHByb2FjaCB0aGF0IEJhYmVsIHdpbGwgcHJvYmFibHkgdGFrZSB0byBpbXBsZW1lbnQgcHJpdmF0ZSBtZXRob2RzL2ZpZWxkc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByaXZhdGUtbWV0aG9kc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9wdWxsLzc1NTVcbiAgICogT25jZSB3ZSBoYXZlIHRoZSBjaGFuZ2VzIGZyb20gdGhhdCBQUiBpbiBCYWJlbCwgYW5kIG91ciBjb3JlIGNsYXNzIGZpdHMgcmVhc29uYWJsZSBpbiAqb25lIG1vZHVsZSpcbiAgICogICB0aGVuIHdlIGNhbiB1c2UgdGhhdCBsYW5ndWFnZSBmZWF0dXJlLlxuICAgKi9cbiAgdmFyIHByaXZhdGVNZXRob2RzID0ge1xuICAgIHN3YWxQcm9taXNlUmVzb2x2ZTogbmV3IFdlYWtNYXAoKSxcbiAgICBzd2FsUHJvbWlzZVJlamVjdDogbmV3IFdlYWtNYXAoKVxuICB9O1xuXG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgU3dlZXRBbGVydDIgcG9wdXAgaXMgc2hvd25cbiAgICovXG5cbiAgY29uc3QgaXNWaXNpYmxlJDEgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGlzVmlzaWJsZShnZXRQb3B1cCgpKTtcbiAgfTtcbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdDb25maXJtJyBidXR0b25cbiAgICovXG5cbiAgY29uc3QgY2xpY2tDb25maXJtID0gKCkgPT4gZ2V0Q29uZmlybUJ1dHRvbigpICYmIGdldENvbmZpcm1CdXR0b24oKS5jbGljaygpO1xuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0RlbnknIGJ1dHRvblxuICAgKi9cblxuICBjb25zdCBjbGlja0RlbnkgPSAoKSA9PiBnZXREZW55QnV0dG9uKCkgJiYgZ2V0RGVueUJ1dHRvbigpLmNsaWNrKCk7XG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnQ2FuY2VsJyBidXR0b25cbiAgICovXG5cbiAgY29uc3QgY2xpY2tDYW5jZWwgPSAoKSA9PiBnZXRDYW5jZWxCdXR0b24oKSAmJiBnZXRDYW5jZWxCdXR0b24oKS5jbGljaygpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0dsb2JhbFN0YXRlfSBnbG9iYWxTdGF0ZVxuICAgKi9cblxuICBjb25zdCByZW1vdmVLZXlkb3duSGFuZGxlciA9IGdsb2JhbFN0YXRlID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCAmJiBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0dsb2JhbFN0YXRlfSBnbG9iYWxTdGF0ZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0geyp9IGRpc21pc3NXaXRoXG4gICAqL1xuXG4gIGNvbnN0IGFkZEtleWRvd25IYW5kbGVyID0gKGluc3RhbmNlLCBnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXIgPSBlID0+IGtleWRvd25IYW5kbGVyKGluc3RhbmNlLCBlLCBkaXNtaXNzV2l0aCk7XG5cbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQgPSBpbm5lclBhcmFtcy5rZXlkb3duTGlzdGVuZXJDYXB0dXJlID8gd2luZG93IDogZ2V0UG9wdXAoKTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmUgPSBpbm5lclBhcmFtcy5rZXlkb3duTGlzdGVuZXJDYXB0dXJlO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXIsIHtcbiAgICAgICAgY2FwdHVyZTogZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZVxuICAgICAgfSk7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluY3JlbWVudFxuICAgKi9cblxuICBjb25zdCBzZXRGb2N1cyA9IChpbm5lclBhcmFtcywgaW5kZXgsIGluY3JlbWVudCkgPT4ge1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gZ2V0Rm9jdXNhYmxlRWxlbWVudHMoKTsgLy8gc2VhcmNoIGZvciB2aXNpYmxlIGVsZW1lbnRzIGFuZCBzZWxlY3QgdGhlIG5leHQgcG9zc2libGUgbWF0Y2hcblxuICAgIGlmIChmb2N1c2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gaW5kZXggKyBpbmNyZW1lbnQ7IC8vIHJvbGxvdmVyIHRvIGZpcnN0IGl0ZW1cblxuICAgICAgaWYgKGluZGV4ID09PSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgaW5kZXggPSAwOyAvLyBnbyB0byBsYXN0IGl0ZW1cbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvY3VzYWJsZUVsZW1lbnRzW2luZGV4XS5mb2N1cygpO1xuICAgIH0gLy8gbm8gdmlzaWJsZSBmb2N1c2FibGUgZWxlbWVudHMsIGZvY3VzIHRoZSBwb3B1cFxuXG5cbiAgICBnZXRQb3B1cCgpLmZvY3VzKCk7XG4gIH07XG4gIGNvbnN0IGFycm93S2V5c05leHRCdXR0b24gPSBbJ0Fycm93UmlnaHQnLCAnQXJyb3dEb3duJ107XG4gIGNvbnN0IGFycm93S2V5c1ByZXZpb3VzQnV0dG9uID0gWydBcnJvd0xlZnQnLCAnQXJyb3dVcCddO1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuXG4gIGNvbnN0IGtleWRvd25IYW5kbGVyID0gKGluc3RhbmNlLCBlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zKSB7XG4gICAgICByZXR1cm47IC8vIFRoaXMgaW5zdGFuY2UgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWRcbiAgICB9IC8vIElnbm9yZSBrZXlkb3duIGR1cmluZyBJTUUgY29tcG9zaXRpb25cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRG9jdW1lbnQva2V5ZG93bl9ldmVudCNpZ25vcmluZ19rZXlkb3duX2R1cmluZ19pbWVfY29tcG9zaXRpb25cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzcyMFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjQwNlxuXG5cbiAgICBpZiAoZS5pc0NvbXBvc2luZyB8fCBlLmtleUNvZGUgPT09IDIyOSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5zdG9wS2V5ZG93blByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0gLy8gRU5URVJcblxuXG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICBoYW5kbGVFbnRlcihpbnN0YW5jZSwgZSwgaW5uZXJQYXJhbXMpO1xuICAgIH0gLy8gVEFCXG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdUYWInKSB7XG4gICAgICBoYW5kbGVUYWIoZSwgaW5uZXJQYXJhbXMpO1xuICAgIH0gLy8gQVJST1dTIC0gc3dpdGNoIGZvY3VzIGJldHdlZW4gYnV0dG9uc1xuICAgIGVsc2UgaWYgKFsuLi5hcnJvd0tleXNOZXh0QnV0dG9uLCAuLi5hcnJvd0tleXNQcmV2aW91c0J1dHRvbl0uaW5jbHVkZXMoZS5rZXkpKSB7XG4gICAgICBoYW5kbGVBcnJvd3MoZS5rZXkpO1xuICAgIH0gLy8gRVNDXG4gICAgZWxzZSBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBoYW5kbGVFc2MoZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVFbnRlciA9IChpbnN0YW5jZSwgZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIzODZcbiAgICBpZiAoIWNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93RW50ZXJLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGUudGFyZ2V0ICYmIGluc3RhbmNlLmdldElucHV0KCkgJiYgZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBlLnRhcmdldC5vdXRlckhUTUwgPT09IGluc3RhbmNlLmdldElucHV0KCkub3V0ZXJIVE1MKSB7XG4gICAgICBpZiAoWyd0ZXh0YXJlYScsICdmaWxlJ10uaW5jbHVkZXMoaW5uZXJQYXJhbXMuaW5wdXQpKSB7XG4gICAgICAgIHJldHVybjsgLy8gZG8gbm90IHN1Ym1pdFxuICAgICAgfVxuXG4gICAgICBjbGlja0NvbmZpcm0oKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVUYWIgPSAoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpO1xuICAgIGxldCBidG5JbmRleCA9IC0xO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRhcmdldEVsZW1lbnQgPT09IGZvY3VzYWJsZUVsZW1lbnRzW2ldKSB7XG4gICAgICAgIGJ0bkluZGV4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSAvLyBDeWNsZSB0byB0aGUgbmV4dCBidXR0b25cblxuXG4gICAgaWYgKCFlLnNoaWZ0S2V5KSB7XG4gICAgICBzZXRGb2N1cyhpbm5lclBhcmFtcywgYnRuSW5kZXgsIDEpO1xuICAgIH0gLy8gQ3ljbGUgdG8gdGhlIHByZXYgYnV0dG9uXG4gICAgZWxzZSB7XG4gICAgICBzZXRGb2N1cyhpbm5lclBhcmFtcywgYnRuSW5kZXgsIC0xKTtcbiAgICB9XG5cbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVBcnJvd3MgPSBrZXkgPT4ge1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBnZXRDb25maXJtQnV0dG9uKCk7XG4gICAgY29uc3QgZGVueUJ1dHRvbiA9IGdldERlbnlCdXR0b24oKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBnZXRDYW5jZWxCdXR0b24oKTtcblxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIVtjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b25dLmluY2x1ZGVzKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZyA9IGFycm93S2V5c05leHRCdXR0b24uaW5jbHVkZXMoa2V5KSA/ICduZXh0RWxlbWVudFNpYmxpbmcnIDogJ3ByZXZpb3VzRWxlbWVudFNpYmxpbmcnO1xuICAgIGxldCBidXR0b25Ub0ZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2V0QWN0aW9ucygpLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBidXR0b25Ub0ZvY3VzID0gYnV0dG9uVG9Gb2N1c1tzaWJsaW5nXTtcblxuICAgICAgaWYgKCFidXR0b25Ub0ZvY3VzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGJ1dHRvblRvRm9jdXMgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCAmJiBpc1Zpc2libGUoYnV0dG9uVG9Gb2N1cykpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJ1dHRvblRvRm9jdXMgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgYnV0dG9uVG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUVzYyA9IChlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBpZiAoY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFc2NhcGVLZXkpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmVzYyk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEluc3RhbmNlIG1ldGhvZCB0byBjbG9zZSBzd2VldEFsZXJ0XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShpbnN0YW5jZSwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpIHtcbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlKGluc3RhbmNlLCBkaWRDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3RvcmVBY3RpdmVFbGVtZW50KHJldHVybkZvY3VzKS50aGVuKCgpID0+IHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UoaW5zdGFuY2UsIGRpZENsb3NlKSk7XG4gICAgICByZW1vdmVLZXlkb3duSGFuZGxlcihnbG9iYWxTdGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgaXNTYWZhcmkgPSAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpOyAvLyB3b3JrYXJvdW5kIGZvciAjMjA4OFxuICAgIC8vIGZvciBzb21lIHJlYXNvbiByZW1vdmluZyB0aGUgY29udGFpbmVyIGluIFNhZmFyaSB3aWxsIHNjcm9sbCB0aGUgZG9jdW1lbnQgdG8gYm90dG9tXG5cbiAgICBpZiAoaXNTYWZhcmkpIHtcbiAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50Jyk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTW9kYWwoKSkge1xuICAgICAgdW5kb1Njcm9sbGJhcigpO1xuICAgICAgdW5kb0lPU2ZpeCgpO1xuICAgICAgdW5zZXRBcmlhSGlkZGVuKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQm9keUNsYXNzZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUJvZHlDbGFzc2VzKCkge1xuICAgIHJlbW92ZUNsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBbc3dhbENsYXNzZXMuc2hvd24sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ11dKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKHJlc29sdmVWYWx1ZSkge1xuICAgIHJlc29sdmVWYWx1ZSA9IHByZXBhcmVSZXNvbHZlVmFsdWUocmVzb2x2ZVZhbHVlKTtcbiAgICBjb25zdCBzd2FsUHJvbWlzZVJlc29sdmUgPSBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlc29sdmUuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGRpZENsb3NlID0gdHJpZ2dlckNsb3NlUG9wdXAodGhpcyk7XG5cbiAgICBpZiAodGhpcy5pc0F3YWl0aW5nUHJvbWlzZSgpKSB7XG4gICAgICAvLyBBIHN3YWwgYXdhaXRpbmcgZm9yIGEgcHJvbWlzZSAoYWZ0ZXIgYSBjbGljayBvbiBDb25maXJtIG9yIERlbnkpIGNhbm5vdCBiZSBkaXNtaXNzZWQgYW55bW9yZSAjMjMzNVxuICAgICAgaWYgKCFyZXNvbHZlVmFsdWUuaXNEaXNtaXNzZWQpIHtcbiAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKHRoaXMpO1xuICAgICAgICBzd2FsUHJvbWlzZVJlc29sdmUocmVzb2x2ZVZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpZENsb3NlKSB7XG4gICAgICAvLyBSZXNvbHZlIFN3YWwgcHJvbWlzZVxuICAgICAgc3dhbFByb21pc2VSZXNvbHZlKHJlc29sdmVWYWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGlzQXdhaXRpbmdQcm9taXNlKCkge1xuICAgIHJldHVybiAhIXByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2UuZ2V0KHRoaXMpO1xuICB9XG5cbiAgY29uc3QgdHJpZ2dlckNsb3NlUG9wdXAgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zIHx8IGhhc0NsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLnNob3dDbGFzcy5wb3B1cCk7XG4gICAgYWRkQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5wb3B1cCk7XG4gICAgY29uc3QgYmFja2Ryb3AgPSBnZXRDb250YWluZXIoKTtcbiAgICByZW1vdmVDbGFzcyhiYWNrZHJvcCwgaW5uZXJQYXJhbXMuc2hvd0NsYXNzLmJhY2tkcm9wKTtcbiAgICBhZGRDbGFzcyhiYWNrZHJvcCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLmJhY2tkcm9wKTtcbiAgICBoYW5kbGVQb3B1cEFuaW1hdGlvbihpbnN0YW5jZSwgcG9wdXAsIGlubmVyUGFyYW1zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBmdW5jdGlvbiByZWplY3RQcm9taXNlKGVycm9yKSB7XG4gICAgY29uc3QgcmVqZWN0UHJvbWlzZSA9IHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVqZWN0LmdldCh0aGlzKTtcbiAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UodGhpcyk7XG5cbiAgICBpZiAocmVqZWN0UHJvbWlzZSkge1xuICAgICAgLy8gUmVqZWN0IFN3YWwgcHJvbWlzZVxuICAgICAgcmVqZWN0UHJvbWlzZShlcnJvcik7XG4gICAgfVxuICB9XG4gIGNvbnN0IGhhbmRsZUF3YWl0aW5nUHJvbWlzZSA9IGluc3RhbmNlID0+IHtcbiAgICBpZiAoaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5kZWxldGUoaW5zdGFuY2UpOyAvLyBUaGUgaW5zdGFuY2UgbWlnaHQgaGF2ZSBiZWVuIHByZXZpb3VzbHkgcGFydGx5IGRlc3Ryb3llZCwgd2UgbXVzdCByZXN1bWUgdGhlIGRlc3Ryb3kgcHJvY2VzcyBpbiB0aGlzIGNhc2UgIzIzMzVcblxuICAgICAgaWYgKCFwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKSkge1xuICAgICAgICBpbnN0YW5jZS5fZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwcmVwYXJlUmVzb2x2ZVZhbHVlID0gcmVzb2x2ZVZhbHVlID0+IHtcbiAgICAvLyBXaGVuIHVzZXIgY2FsbHMgU3dhbC5jbG9zZSgpXG4gICAgaWYgKHR5cGVvZiByZXNvbHZlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0NvbmZpcm1lZDogZmFsc2UsXG4gICAgICAgIGlzRGVuaWVkOiBmYWxzZSxcbiAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgaXNDb25maXJtZWQ6IGZhbHNlLFxuICAgICAgaXNEZW5pZWQ6IGZhbHNlLFxuICAgICAgaXNEaXNtaXNzZWQ6IGZhbHNlXG4gICAgfSwgcmVzb2x2ZVZhbHVlKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVQb3B1cEFuaW1hdGlvbiA9IChpbnN0YW5jZSwgcG9wdXAsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7IC8vIElmIGFuaW1hdGlvbiBpcyBzdXBwb3J0ZWQsIGFuaW1hdGVcblxuICAgIGNvbnN0IGFuaW1hdGlvbklzU3VwcG9ydGVkID0gYW5pbWF0aW9uRW5kRXZlbnQgJiYgaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKTtcblxuICAgIGlmICh0eXBlb2YgaW5uZXJQYXJhbXMud2lsbENsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpbm5lclBhcmFtcy53aWxsQ2xvc2UocG9wdXApO1xuICAgIH1cblxuICAgIGlmIChhbmltYXRpb25Jc1N1cHBvcnRlZCkge1xuICAgICAgYW5pbWF0ZVBvcHVwKGluc3RhbmNlLCBwb3B1cCwgY29udGFpbmVyLCBpbm5lclBhcmFtcy5yZXR1cm5Gb2N1cywgaW5uZXJQYXJhbXMuZGlkQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHJlbW92ZSBpbW1lZGlhdGVseVxuICAgICAgcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGluc3RhbmNlLCBjb250YWluZXIsIGlubmVyUGFyYW1zLnJldHVybkZvY3VzLCBpbm5lclBhcmFtcy5kaWRDbG9zZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFuaW1hdGVQb3B1cCA9IChpbnN0YW5jZSwgcG9wdXAsIGNvbnRhaW5lciwgcmV0dXJuRm9jdXMsIGRpZENsb3NlKSA9PiB7XG4gICAgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrID0gcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlLmJpbmQobnVsbCwgaW5zdGFuY2UsIGNvbnRhaW5lciwgcmV0dXJuRm9jdXMsIGRpZENsb3NlKTtcbiAgICBwb3B1cC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSBwb3B1cCkge1xuICAgICAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2soKTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlID0gKGluc3RhbmNlLCBkaWRDbG9zZSkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBkaWRDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkaWRDbG9zZS5iaW5kKGluc3RhbmNlLnBhcmFtcykoKTtcbiAgICAgIH1cblxuICAgICAgaW5zdGFuY2UuX2Rlc3Ryb3koKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBzZXRCdXR0b25zRGlzYWJsZWQoaW5zdGFuY2UsIGJ1dHRvbnMsIGRpc2FibGVkKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KGluc3RhbmNlKTtcbiAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgIGRvbUNhY2hlW2J1dHRvbl0uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldElucHV0RGlzYWJsZWQoaW5wdXQsIGRpc2FibGVkKSB7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbnB1dC50eXBlID09PSAncmFkaW8nKSB7XG4gICAgICBjb25zdCByYWRpb3NDb250YWluZXIgPSBpbnB1dC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICBjb25zdCByYWRpb3MgPSByYWRpb3NDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYWRpb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmFkaW9zW2ldLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlQnV0dG9ucygpIHtcbiAgICBzZXRCdXR0b25zRGlzYWJsZWQodGhpcywgWydjb25maXJtQnV0dG9uJywgJ2RlbnlCdXR0b24nLCAnY2FuY2VsQnV0dG9uJ10sIGZhbHNlKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlQnV0dG9ucygpIHtcbiAgICBzZXRCdXR0b25zRGlzYWJsZWQodGhpcywgWydjb25maXJtQnV0dG9uJywgJ2RlbnlCdXR0b24nLCAnY2FuY2VsQnV0dG9uJ10sIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGVuYWJsZUlucHV0KCkge1xuICAgIHJldHVybiBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVJbnB1dCgpIHtcbiAgICByZXR1cm4gc2V0SW5wdXREaXNhYmxlZCh0aGlzLmdldElucHV0KCksIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1ZhbGlkYXRpb25NZXNzYWdlKGVycm9yKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gICAgc2V0SW5uZXJIdG1sKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLCBlcnJvcik7XG4gICAgZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddO1xuXG4gICAgaWYgKHBhcmFtcy5jdXN0b21DbGFzcyAmJiBwYXJhbXMuY3VzdG9tQ2xhc3MudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgIGFkZENsYXNzKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLCBwYXJhbXMuY3VzdG9tQ2xhc3MudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHNob3coZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRJbnB1dCgpO1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsIHRydWUpO1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jywgc3dhbENsYXNzZXNbJ3ZhbGlkYXRpb24tbWVzc2FnZSddKTtcbiAgICAgIGZvY3VzSW5wdXQoaW5wdXQpO1xuICAgICAgYWRkQ2xhc3MoaW5wdXQsIHN3YWxDbGFzc2VzLmlucHV0ZXJyb3IpO1xuICAgIH1cbiAgfSAvLyBIaWRlIGJsb2NrIHdpdGggdmFsaWRhdGlvbiBtZXNzYWdlXG5cbiAgZnVuY3Rpb24gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxKCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcblxuICAgIGlmIChkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgaGlkZShkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0KCk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIHJlbW92ZUNsYXNzKGlucHV0LCBzd2FsQ2xhc3Nlcy5pbnB1dGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQcm9ncmVzc1N0ZXBzJDEoKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIHJldHVybiBkb21DYWNoZS5wcm9ncmVzc1N0ZXBzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgcG9wdXAgcGFyYW1ldGVycy5cbiAgICovXG5cbiAgZnVuY3Rpb24gdXBkYXRlKHBhcmFtcykge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG5cbiAgICBpZiAoIXBvcHVwIHx8IGhhc0NsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApKSB7XG4gICAgICByZXR1cm4gd2FybihcIllvdSdyZSB0cnlpbmcgdG8gdXBkYXRlIHRoZSBjbG9zZWQgb3IgY2xvc2luZyBwb3B1cCwgdGhhdCB3b24ndCB3b3JrLiBVc2UgdGhlIHVwZGF0ZSgpIG1ldGhvZCBpbiBwcmVDb25maXJtIHBhcmFtZXRlciBvciBzaG93IGEgbmV3IHBvcHVwLlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWxpZFVwZGF0YWJsZVBhcmFtcyA9IGZpbHRlclZhbGlkUGFyYW1zKHBhcmFtcyk7XG4gICAgY29uc3QgdXBkYXRlZFBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGlubmVyUGFyYW1zLCB2YWxpZFVwZGF0YWJsZVBhcmFtcyk7XG4gICAgcmVuZGVyKHRoaXMsIHVwZGF0ZWRQYXJhbXMpO1xuICAgIHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5zZXQodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHZhbHVlOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBmaWx0ZXJWYWxpZFBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgdmFsaWRVcGRhdGFibGVQYXJhbXMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgaWYgKGlzVXBkYXRhYmxlUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgICB2YWxpZFVwZGF0YWJsZVBhcmFtc1twYXJhbV0gPSBwYXJhbXNbcGFyYW1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FybihcIkludmFsaWQgcGFyYW1ldGVyIHRvIHVwZGF0ZTogXCIuY29uY2F0KHBhcmFtKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbGlkVXBkYXRhYmxlUGFyYW1zO1xuICB9O1xuXG4gIGZ1bmN0aW9uIF9kZXN0cm95KCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zKSB7XG4gICAgICBkaXNwb3NlV2Vha01hcHModGhpcyk7IC8vIFRoZSBXZWFrTWFwcyBtaWdodCBoYXZlIGJlZW4gcGFydGx5IGRlc3Ryb3llZCwgd2UgbXVzdCByZWNhbGwgaXQgdG8gZGlzcG9zZSBhbnkgcmVtYWluaW5nIFdlYWtNYXBzICMyMzM1XG5cbiAgICAgIHJldHVybjsgLy8gVGhpcyBpbnN0YW5jZSBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZFxuICAgIH0gLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYW5vdGhlciBTd2FsIGNsb3NpbmdcblxuXG4gICAgaWYgKGRvbUNhY2hlLnBvcHVwICYmIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaykge1xuICAgICAgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKCk7XG4gICAgICBkZWxldGUgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMuZGlkRGVzdHJveSgpO1xuICAgIH1cblxuICAgIGRpc3Bvc2VTd2FsKHRoaXMpO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuICBjb25zdCBkaXNwb3NlU3dhbCA9IGluc3RhbmNlID0+IHtcbiAgICBkaXNwb3NlV2Vha01hcHMoaW5zdGFuY2UpOyAvLyBVbnNldCB0aGlzLnBhcmFtcyBzbyBHQyB3aWxsIGRpc3Bvc2UgaXQgKCMxNTY5KVxuICAgIC8vIEB0cy1pZ25vcmVcblxuICAgIGRlbGV0ZSBpbnN0YW5jZS5wYXJhbXM7IC8vIFVuc2V0IGdsb2JhbFN0YXRlIHByb3BzIHNvIEdDIHdpbGwgZGlzcG9zZSBnbG9iYWxTdGF0ZSAoIzE1NjkpXG5cbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXI7XG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQ7IC8vIFVuc2V0IGN1cnJlbnRJbnN0YW5jZVxuXG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG5cbiAgY29uc3QgZGlzcG9zZVdlYWtNYXBzID0gaW5zdGFuY2UgPT4ge1xuICAgIC8vIElmIHRoZSBjdXJyZW50IGluc3RhbmNlIGlzIGF3YWl0aW5nIGEgcHJvbWlzZSByZXN1bHQsIHdlIGtlZXAgdGhlIHByaXZhdGVNZXRob2RzIHRvIGNhbGwgdGhlbSBvbmNlIHRoZSBwcm9taXNlIHJlc3VsdCBpcyByZXRyaWV2ZWQgIzIzMzVcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIHVuc2V0V2Vha01hcHMocHJpdmF0ZVByb3BzLCBpbnN0YW5jZSk7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVuc2V0V2Vha01hcHMocHJpdmF0ZU1ldGhvZHMsIGluc3RhbmNlKTtcbiAgICAgIHVuc2V0V2Vha01hcHMocHJpdmF0ZVByb3BzLCBpbnN0YW5jZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IG9ialxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuXG4gIGNvbnN0IHVuc2V0V2Vha01hcHMgPSAob2JqLCBpbnN0YW5jZSkgPT4ge1xuICAgIGZvciAoY29uc3QgaSBpbiBvYmopIHtcbiAgICAgIG9ialtpXS5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcblxuXG5cbiAgdmFyIGluc3RhbmNlTWV0aG9kcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBoaWRlTG9hZGluZzogaGlkZUxvYWRpbmcsXG4gICAgZGlzYWJsZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuICAgIGdldElucHV0OiBnZXRJbnB1dCQxLFxuICAgIGNsb3NlOiBjbG9zZSxcbiAgICBpc0F3YWl0aW5nUHJvbWlzZTogaXNBd2FpdGluZ1Byb21pc2UsXG4gICAgcmVqZWN0UHJvbWlzZTogcmVqZWN0UHJvbWlzZSxcbiAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2U6IGhhbmRsZUF3YWl0aW5nUHJvbWlzZSxcbiAgICBjbG9zZVBvcHVwOiBjbG9zZSxcbiAgICBjbG9zZU1vZGFsOiBjbG9zZSxcbiAgICBjbG9zZVRvYXN0OiBjbG9zZSxcbiAgICBlbmFibGVCdXR0b25zOiBlbmFibGVCdXR0b25zLFxuICAgIGRpc2FibGVCdXR0b25zOiBkaXNhYmxlQnV0dG9ucyxcbiAgICBlbmFibGVJbnB1dDogZW5hYmxlSW5wdXQsXG4gICAgZGlzYWJsZUlucHV0OiBkaXNhYmxlSW5wdXQsXG4gICAgc2hvd1ZhbGlkYXRpb25NZXNzYWdlOiBzaG93VmFsaWRhdGlvbk1lc3NhZ2UsXG4gICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTogcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxLFxuICAgIGdldFByb2dyZXNzU3RlcHM6IGdldFByb2dyZXNzU3RlcHMkMSxcbiAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICBfZGVzdHJveTogX2Rlc3Ryb3lcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1CdXR0b25DbGljayA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQoaW5zdGFuY2UsICdjb25maXJtJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpcm0oaW5zdGFuY2UsIHRydWUpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZURlbnlCdXR0b25DbGljayA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMucmV0dXJuSW5wdXRWYWx1ZU9uRGVueSkge1xuICAgICAgaGFuZGxlQ29uZmlybU9yRGVueVdpdGhJbnB1dChpbnN0YW5jZSwgJ2RlbnknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVueShpbnN0YW5jZSwgZmFsc2UpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZUNhbmNlbEJ1dHRvbkNsaWNrID0gKGluc3RhbmNlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGluc3RhbmNlLmRpc2FibGVCdXR0b25zKCk7XG4gICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jYW5jZWwpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueSd9IHR5cGVcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybU9yRGVueVdpdGhJbnB1dCA9IChpbnN0YW5jZSwgdHlwZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBlcnJvcihcIlRoZSBcXFwiaW5wdXRcXFwiIHBhcmFtZXRlciBpcyBuZWVkZWQgdG8gYmUgc2V0IHdoZW4gdXNpbmcgcmV0dXJuSW5wdXRWYWx1ZU9uXCIuY29uY2F0KGNhcGl0YWxpemVGaXJzdExldHRlcih0eXBlKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0VmFsdWUgPSBnZXRJbnB1dFZhbHVlKGluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuaW5wdXRWYWxpZGF0b3IpIHtcbiAgICAgIGhhbmRsZUlucHV0VmFsaWRhdG9yKGluc3RhbmNlLCBpbnB1dFZhbHVlLCB0eXBlKTtcbiAgICB9IGVsc2UgaWYgKCFpbnN0YW5jZS5nZXRJbnB1dCgpLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgaW5zdGFuY2UuZW5hYmxlQnV0dG9ucygpO1xuICAgICAgaW5zdGFuY2Uuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZW55Jykge1xuICAgICAgZGVueShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpcm0oaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFZhbHVlXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknfSB0eXBlXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlSW5wdXRWYWxpZGF0b3IgPSAoaW5zdGFuY2UsIGlucHV0VmFsdWUsIHR5cGUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGluc3RhbmNlLmRpc2FibGVJbnB1dCgpO1xuICAgIGNvbnN0IHZhbGlkYXRpb25Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMuaW5wdXRWYWxpZGF0b3IoaW5wdXRWYWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgdmFsaWRhdGlvblByb21pc2UudGhlbih2YWxpZGF0aW9uTWVzc2FnZSA9PiB7XG4gICAgICBpbnN0YW5jZS5lbmFibGVCdXR0b25zKCk7XG4gICAgICBpbnN0YW5jZS5lbmFibGVJbnB1dCgpO1xuXG4gICAgICBpZiAodmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgICAgaW5zdGFuY2Uuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKHZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlbnknKSB7XG4gICAgICAgIGRlbnkoaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlybShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG5cblxuICBjb25zdCBkZW55ID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB1bmRlZmluZWQpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnNob3dMb2FkZXJPbkRlbnkpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldERlbnlCdXR0b24oKSk7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnByZURlbnkpIHtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgdHJ1ZSk7IC8vIEZsYWdnaW5nIHRoZSBpbnN0YW5jZSBhcyBhd2FpdGluZyBhIHByb21pc2Ugc28gaXQncyBvd24gcHJvbWlzZSdzIHJlamVjdC9yZXNvbHZlIG1ldGhvZHMgZG9lc24ndCBnZXQgZGVzdHJveWVkIHVudGlsIHRoZSByZXN1bHQgZnJvbSB0aGlzIHByZURlbnkncyBwcm9taXNlIGlzIHJlY2VpdmVkXG5cbiAgICAgIGNvbnN0IHByZURlbnlQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMucHJlRGVueSh2YWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgICBwcmVEZW55UHJvbWlzZS50aGVuKHByZURlbnlWYWx1ZSA9PiB7XG4gICAgICAgIGlmIChwcmVEZW55VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UoaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgICAgICAgIGlzRGVuaWVkOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHR5cGVvZiBwcmVEZW55VmFsdWUgPT09ICd1bmRlZmluZWQnID8gdmFsdWUgOiBwcmVEZW55VmFsdWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IkJDEgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yJCQxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgICAgaXNEZW5pZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG5cblxuICBjb25zdCBzdWNjZWVkV2l0aCA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICBpc0NvbmZpcm1lZDogdHJ1ZSxcbiAgICAgIHZhbHVlXG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JcbiAgICovXG5cblxuICBjb25zdCByZWplY3RXaXRoID0gKGluc3RhbmNlLCBlcnJvciQkMSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpbnN0YW5jZS5yZWplY3RQcm9taXNlKGVycm9yJCQxKTtcbiAgfTtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IGNvbmZpcm0gPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuc2hvd0xvYWRlck9uQ29uZmlybSkge1xuICAgICAgc2hvd0xvYWRpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMucHJlQ29uZmlybSkge1xuICAgICAgaW5zdGFuY2UucmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCB0cnVlKTsgLy8gRmxhZ2dpbmcgdGhlIGluc3RhbmNlIGFzIGF3YWl0aW5nIGEgcHJvbWlzZSBzbyBpdCdzIG93biBwcm9taXNlJ3MgcmVqZWN0L3Jlc29sdmUgbWV0aG9kcyBkb2Vzbid0IGdldCBkZXN0cm95ZWQgdW50aWwgdGhlIHJlc3VsdCBmcm9tIHRoaXMgcHJlQ29uZmlybSdzIHByb21pc2UgaXMgcmVjZWl2ZWRcblxuICAgICAgY29uc3QgcHJlQ29uZmlybVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5wcmVDb25maXJtKHZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICAgIHByZUNvbmZpcm1Qcm9taXNlLnRoZW4ocHJlQ29uZmlybVZhbHVlID0+IHtcbiAgICAgICAgaWYgKGlzVmlzaWJsZShnZXRWYWxpZGF0aW9uTWVzc2FnZSgpKSB8fCBwcmVDb25maXJtVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UoaW5zdGFuY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB0eXBlb2YgcHJlQ29uZmlybVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlQ29uZmlybVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IkJDEgPT4gcmVqZWN0V2l0aChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIGVycm9yJCQxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRXaXRoKGluc3RhbmNlLCB2YWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvcHVwQ2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGhhbmRsZVRvYXN0Q2xpY2soaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElnbm9yZSBjbGljayBldmVudHMgdGhhdCBoYWQgbW91c2Vkb3duIG9uIHRoZSBwb3B1cCBidXQgbW91c2V1cCBvbiB0aGUgY29udGFpbmVyXG4gICAgICAvLyBUaGlzIGNhbiBoYXBwZW4gd2hlbiB0aGUgdXNlciBkcmFncyBhIHNsaWRlclxuICAgICAgaGFuZGxlTW9kYWxNb3VzZWRvd24oZG9tQ2FjaGUpOyAvLyBJZ25vcmUgY2xpY2sgZXZlbnRzIHRoYXQgaGFkIG1vdXNlZG93biBvbiB0aGUgY29udGFpbmVyIGJ1dCBtb3VzZXVwIG9uIHRoZSBwb3B1cFxuXG4gICAgICBoYW5kbGVDb250YWluZXJNb3VzZWRvd24oZG9tQ2FjaGUpO1xuICAgICAgaGFuZGxlTW9kYWxDbGljayhpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlVG9hc3RDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgLy8gQ2xvc2luZyB0b2FzdCBieSBpbnRlcm5hbCBjbGlja1xuICAgIGRvbUNhY2hlLnBvcHVwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgICBpZiAoaW5uZXJQYXJhbXMgJiYgKGlzQW55QnV0dG9uU2hvd24oaW5uZXJQYXJhbXMpIHx8IGlubmVyUGFyYW1zLnRpbWVyIHx8IGlubmVyUGFyYW1zLmlucHV0KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uY2xvc2UpO1xuICAgIH07XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IGlubmVyUGFyYW1zXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGlzQW55QnV0dG9uU2hvd24gPSBpbm5lclBhcmFtcyA9PiB7XG4gICAgcmV0dXJuIGlubmVyUGFyYW1zLnNob3dDb25maXJtQnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dEZW55QnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dDYW5jZWxCdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0Nsb3NlQnV0dG9uO1xuICB9O1xuXG4gIGxldCBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTtcblxuICBjb25zdCBoYW5kbGVNb2RhbE1vdXNlZG93biA9IGRvbUNhY2hlID0+IHtcbiAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNlZG93biA9ICgpID0+IHtcbiAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZXVwID0gdW5kZWZpbmVkOyAvLyBXZSBvbmx5IGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyB0aGUgY29udGFpbmVyIGJlY2F1c2UgdXN1YWxseSBpdCBkb2Vzbid0XG4gICAgICAgIC8vIGhhdmUgYW55IG90aGVyIGRpcmVjdCBjaGlsZHJlbiBhc2lkZSBvZiB0aGUgcG9wdXBcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lcikge1xuICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDb250YWluZXJNb3VzZWRvd24gPSBkb21DYWNoZSA9PiB7XG4gICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgZG9tQ2FjaGUucG9wdXAub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZG9tQ2FjaGUucG9wdXAub25tb3VzZXVwID0gdW5kZWZpbmVkOyAvLyBXZSBhbHNvIG5lZWQgdG8gY2hlY2sgaWYgdGhlIG1vdXNldXAgdGFyZ2V0IGlzIGEgY2hpbGQgb2YgdGhlIHBvcHVwXG5cbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb21DYWNoZS5wb3B1cCB8fCBkb21DYWNoZS5wb3B1cC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlTW9kYWxDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgZG9tQ2FjaGUuY29udGFpbmVyLm9uY2xpY2sgPSBlID0+IHtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICAgIGlmIChpZ25vcmVPdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb21DYWNoZS5jb250YWluZXIgJiYgY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spKSB7XG4gICAgICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uYmFja2Ryb3ApO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgY29uc3QgaXNKcXVlcnlFbGVtZW50ID0gZWxlbSA9PiB0eXBlb2YgZWxlbSA9PT0gJ29iamVjdCcgJiYgZWxlbS5qcXVlcnk7XG5cbiAgY29uc3QgaXNFbGVtZW50ID0gZWxlbSA9PiBlbGVtIGluc3RhbmNlb2YgRWxlbWVudCB8fCBpc0pxdWVyeUVsZW1lbnQoZWxlbSk7XG5cbiAgY29uc3QgYXJnc1RvUGFyYW1zID0gYXJncyA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0ge307XG5cbiAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdvYmplY3QnICYmICFpc0VsZW1lbnQoYXJnc1swXSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocGFyYW1zLCBhcmdzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgWyd0aXRsZScsICdodG1sJywgJ2ljb24nXS5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBhcmdzW2luZGV4XTtcblxuICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgaXNFbGVtZW50KGFyZykpIHtcbiAgICAgICAgICBwYXJhbXNbbmFtZV0gPSBhcmc7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBcIi5jb25jYXQobmFtZSwgXCIhIEV4cGVjdGVkIFxcXCJzdHJpbmdcXFwiIG9yIFxcXCJFbGVtZW50XFxcIiwgZ290IFwiKS5jb25jYXQodHlwZW9mIGFyZykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpcmUoKSB7XG4gICAgY29uc3QgU3dhbCA9IHRoaXM7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFN3YWwoLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBleHRlbmRlZCB2ZXJzaW9uIG9mIGBTd2FsYCBjb250YWluaW5nIGBwYXJhbXNgIGFzIGRlZmF1bHRzLlxuICAgKiBVc2VmdWwgZm9yIHJldXNpbmcgU3dhbCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogQmVmb3JlOlxuICAgKiBjb25zdCB0ZXh0UHJvbXB0T3B0aW9ucyA9IHsgaW5wdXQ6ICd0ZXh0Jywgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSB9XG4gICAqIGNvbnN0IHt2YWx1ZTogZmlyc3ROYW1lfSA9IGF3YWl0IFN3YWwuZmlyZSh7IC4uLnRleHRQcm9tcHRPcHRpb25zLCB0aXRsZTogJ1doYXQgaXMgeW91ciBmaXJzdCBuYW1lPycgfSlcbiAgICogY29uc3Qge3ZhbHVlOiBsYXN0TmFtZX0gPSBhd2FpdCBTd2FsLmZpcmUoeyAuLi50ZXh0UHJvbXB0T3B0aW9ucywgdGl0bGU6ICdXaGF0IGlzIHlvdXIgbGFzdCBuYW1lPycgfSlcbiAgICpcbiAgICogQWZ0ZXI6XG4gICAqIGNvbnN0IFRleHRQcm9tcHQgPSBTd2FsLm1peGluKHsgaW5wdXQ6ICd0ZXh0Jywgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSB9KVxuICAgKiBjb25zdCB7dmFsdWU6IGZpcnN0TmFtZX0gPSBhd2FpdCBUZXh0UHJvbXB0KCdXaGF0IGlzIHlvdXIgZmlyc3QgbmFtZT8nKVxuICAgKiBjb25zdCB7dmFsdWU6IGxhc3ROYW1lfSA9IGF3YWl0IFRleHRQcm9tcHQoJ1doYXQgaXMgeW91ciBsYXN0IG5hbWU/JylcbiAgICpcbiAgICogQHBhcmFtIG1peGluUGFyYW1zXG4gICAqL1xuICBmdW5jdGlvbiBtaXhpbihtaXhpblBhcmFtcykge1xuICAgIGNsYXNzIE1peGluU3dhbCBleHRlbmRzIHRoaXMge1xuICAgICAgX21haW4ocGFyYW1zLCBwcmlvcml0eU1peGluUGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5fbWFpbihwYXJhbXMsIE9iamVjdC5hc3NpZ24oe30sIG1peGluUGFyYW1zLCBwcmlvcml0eU1peGluUGFyYW1zKSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gTWl4aW5Td2FsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzIHNldCwgcmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBPdGhlcndpc2UsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCBnZXRUaW1lckxlZnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5nZXRUaW1lckxlZnQoKTtcbiAgfTtcbiAgLyoqXG4gICAqIFN0b3AgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3Qgc3RvcFRpbWVyID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBzdG9wVGltZXJQcm9ncmVzc0JhcigpO1xuICAgICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFJlc3VtZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCByZXN1bWVUaW1lciA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5zdGFydCgpO1xuICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIocmVtYWluaW5nKTtcbiAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IHRvZ2dsZVRpbWVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyID0gZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICByZXR1cm4gdGltZXIgJiYgKHRpbWVyLnJ1bm5pbmcgPyBzdG9wVGltZXIoKSA6IHJlc3VtZVRpbWVyKCkpO1xuICB9O1xuICAvKipcbiAgICogSW5jcmVhc2UgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiBhbiB1cGRhdGVkIHRpbWVyLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCBpbmNyZWFzZVRpbWVyID0gbiA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGdsb2JhbFN0YXRlLnRpbWVvdXQuaW5jcmVhc2Uobik7XG4gICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0JhcihyZW1haW5pbmcsIHRydWUpO1xuICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aW1lciBpcyBydW5uaW5nLiBSZXR1cm5zIHRydWUgaWYgdGltZXIgaXMgcnVubmluZ1xuICAgKiBvciBmYWxzZSBpZiB0aW1lciBpcyBwYXVzZWQgb3Igc3RvcHBlZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZFxuICAgKi9cblxuICBjb25zdCBpc1RpbWVyUnVubmluZyA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dCAmJiBnbG9iYWxTdGF0ZS50aW1lb3V0LmlzUnVubmluZygpO1xuICB9O1xuXG4gIGxldCBib2R5Q2xpY2tMaXN0ZW5lckFkZGVkID0gZmFsc2U7XG4gIGNvbnN0IGNsaWNrSGFuZGxlcnMgPSB7fTtcbiAgZnVuY3Rpb24gYmluZENsaWNrSGFuZGxlcigpIHtcbiAgICBsZXQgYXR0ciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ2RhdGEtc3dhbC10ZW1wbGF0ZSc7XG4gICAgY2xpY2tIYW5kbGVyc1thdHRyXSA9IHRoaXM7XG5cbiAgICBpZiAoIWJvZHlDbGlja0xpc3RlbmVyQWRkZWQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib2R5Q2xpY2tMaXN0ZW5lcik7XG4gICAgICBib2R5Q2xpY2tMaXN0ZW5lckFkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBib2R5Q2xpY2tMaXN0ZW5lciA9IGV2ZW50ID0+IHtcbiAgICBmb3IgKGxldCBlbCA9IGV2ZW50LnRhcmdldDsgZWwgJiYgZWwgIT09IGRvY3VtZW50OyBlbCA9IGVsLnBhcmVudE5vZGUpIHtcbiAgICAgIGZvciAoY29uc3QgYXR0ciBpbiBjbGlja0hhbmRsZXJzKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGNsaWNrSGFuZGxlcnNbYXR0cl0uZmlyZSh7XG4gICAgICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG5cbiAgdmFyIHN0YXRpY01ldGhvZHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgaXNWYWxpZFBhcmFtZXRlcjogaXNWYWxpZFBhcmFtZXRlcixcbiAgICBpc1VwZGF0YWJsZVBhcmFtZXRlcjogaXNVcGRhdGFibGVQYXJhbWV0ZXIsXG4gICAgaXNEZXByZWNhdGVkUGFyYW1ldGVyOiBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIsXG4gICAgYXJnc1RvUGFyYW1zOiBhcmdzVG9QYXJhbXMsXG4gICAgaXNWaXNpYmxlOiBpc1Zpc2libGUkMSxcbiAgICBjbGlja0NvbmZpcm06IGNsaWNrQ29uZmlybSxcbiAgICBjbGlja0Rlbnk6IGNsaWNrRGVueSxcbiAgICBjbGlja0NhbmNlbDogY2xpY2tDYW5jZWwsXG4gICAgZ2V0Q29udGFpbmVyOiBnZXRDb250YWluZXIsXG4gICAgZ2V0UG9wdXA6IGdldFBvcHVwLFxuICAgIGdldFRpdGxlOiBnZXRUaXRsZSxcbiAgICBnZXRIdG1sQ29udGFpbmVyOiBnZXRIdG1sQ29udGFpbmVyLFxuICAgIGdldEltYWdlOiBnZXRJbWFnZSxcbiAgICBnZXRJY29uOiBnZXRJY29uLFxuICAgIGdldElucHV0TGFiZWw6IGdldElucHV0TGFiZWwsXG4gICAgZ2V0Q2xvc2VCdXR0b246IGdldENsb3NlQnV0dG9uLFxuICAgIGdldEFjdGlvbnM6IGdldEFjdGlvbnMsXG4gICAgZ2V0Q29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbixcbiAgICBnZXREZW55QnV0dG9uOiBnZXREZW55QnV0dG9uLFxuICAgIGdldENhbmNlbEJ1dHRvbjogZ2V0Q2FuY2VsQnV0dG9uLFxuICAgIGdldExvYWRlcjogZ2V0TG9hZGVyLFxuICAgIGdldEZvb3RlcjogZ2V0Rm9vdGVyLFxuICAgIGdldFRpbWVyUHJvZ3Jlc3NCYXI6IGdldFRpbWVyUHJvZ3Jlc3NCYXIsXG4gICAgZ2V0Rm9jdXNhYmxlRWxlbWVudHM6IGdldEZvY3VzYWJsZUVsZW1lbnRzLFxuICAgIGdldFZhbGlkYXRpb25NZXNzYWdlOiBnZXRWYWxpZGF0aW9uTWVzc2FnZSxcbiAgICBpc0xvYWRpbmc6IGlzTG9hZGluZyxcbiAgICBmaXJlOiBmaXJlLFxuICAgIG1peGluOiBtaXhpbixcbiAgICBzaG93TG9hZGluZzogc2hvd0xvYWRpbmcsXG4gICAgZW5hYmxlTG9hZGluZzogc2hvd0xvYWRpbmcsXG4gICAgZ2V0VGltZXJMZWZ0OiBnZXRUaW1lckxlZnQsXG4gICAgc3RvcFRpbWVyOiBzdG9wVGltZXIsXG4gICAgcmVzdW1lVGltZXI6IHJlc3VtZVRpbWVyLFxuICAgIHRvZ2dsZVRpbWVyOiB0b2dnbGVUaW1lcixcbiAgICBpbmNyZWFzZVRpbWVyOiBpbmNyZWFzZVRpbWVyLFxuICAgIGlzVGltZXJSdW5uaW5nOiBpc1RpbWVyUnVubmluZyxcbiAgICBiaW5kQ2xpY2tIYW5kbGVyOiBiaW5kQ2xpY2tIYW5kbGVyXG4gIH0pO1xuXG4gIGxldCBjdXJyZW50SW5zdGFuY2U7XG5cbiAgY2xhc3MgU3dlZXRBbGVydCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAvLyBQcmV2ZW50IHJ1biBpbiBOb2RlIGVudlxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY3VycmVudEluc3RhbmNlID0gdGhpczsgLy8gQHRzLWlnbm9yZVxuXG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3V0ZXJQYXJhbXMgPSBPYmplY3QuZnJlZXplKHRoaXMuY29uc3RydWN0b3IuYXJnc1RvUGFyYW1zKGFyZ3MpKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgdmFsdWU6IG91dGVyUGFyYW1zLFxuICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KTsgLy8gQHRzLWlnbm9yZVxuXG4gICAgICBjb25zdCBwcm9taXNlID0gY3VycmVudEluc3RhbmNlLl9tYWluKGN1cnJlbnRJbnN0YW5jZS5wYXJhbXMpO1xuXG4gICAgICBwcml2YXRlUHJvcHMucHJvbWlzZS5zZXQodGhpcywgcHJvbWlzZSk7XG4gICAgfVxuXG4gICAgX21haW4odXNlclBhcmFtcykge1xuICAgICAgbGV0IG1peGluUGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgIHNob3dXYXJuaW5nc0ZvclBhcmFtcyhPYmplY3QuYXNzaWduKHt9LCBtaXhpblBhcmFtcywgdXNlclBhcmFtcykpO1xuXG4gICAgICBpZiAoZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlLl9kZXN0cm95KCk7XG5cbiAgICAgICAgaWYgKGlzTW9kYWwoKSkge1xuICAgICAgICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZTtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJlcGFyZVBhcmFtcyh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcyk7XG4gICAgICBzZXRQYXJhbWV0ZXJzKGlubmVyUGFyYW1zKTtcbiAgICAgIE9iamVjdC5mcmVlemUoaW5uZXJQYXJhbXMpOyAvLyBjbGVhciB0aGUgcHJldmlvdXMgdGltZXJcblxuICAgICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgICAgZ2xvYmFsU3RhdGUudGltZW91dC5zdG9wKCk7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS50aW1lb3V0O1xuICAgICAgfSAvLyBjbGVhciB0aGUgcmVzdG9yZSBmb2N1cyB0aW1lb3V0XG5cblxuICAgICAgY2xlYXJUaW1lb3V0KGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQpO1xuICAgICAgY29uc3QgZG9tQ2FjaGUgPSBwb3B1bGF0ZURvbUNhY2hlKGN1cnJlbnRJbnN0YW5jZSk7XG4gICAgICByZW5kZXIoY3VycmVudEluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KGN1cnJlbnRJbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgcmV0dXJuIHN3YWxQcm9taXNlKGN1cnJlbnRJbnN0YW5jZSwgZG9tQ2FjaGUsIGlubmVyUGFyYW1zKTtcbiAgICB9IC8vIGBjYXRjaGAgY2Fubm90IGJlIHRoZSBuYW1lIG9mIGEgbW9kdWxlIGV4cG9ydCwgc28gd2UgZGVmaW5lIG91ciB0aGVuYWJsZSBtZXRob2RzIGhlcmUgaW5zdGVhZFxuXG5cbiAgICB0aGVuKG9uRnVsZmlsbGVkKSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihvbkZ1bGZpbGxlZCk7XG4gICAgfVxuXG4gICAgZmluYWxseShvbkZpbmFsbHkpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBwcml2YXRlUHJvcHMucHJvbWlzZS5nZXQodGhpcyk7XG4gICAgICByZXR1cm4gcHJvbWlzZS5maW5hbGx5KG9uRmluYWxseSk7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBzd2FsUHJvbWlzZSA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIGZ1bmN0aW9ucyB0byBoYW5kbGUgYWxsIGNsb3NpbmdzL2Rpc21pc3NhbHNcbiAgICAgIGNvbnN0IGRpc21pc3NXaXRoID0gZGlzbWlzcyA9PiB7XG4gICAgICAgIGluc3RhbmNlLmNsb3NlUG9wdXAoe1xuICAgICAgICAgIGlzRGlzbWlzc2VkOiB0cnVlLFxuICAgICAgICAgIGRpc21pc3NcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlc29sdmUuc2V0KGluc3RhbmNlLCByZXNvbHZlKTtcbiAgICAgIHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVqZWN0LnNldChpbnN0YW5jZSwgcmVqZWN0KTtcblxuICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gaGFuZGxlQ29uZmlybUJ1dHRvbkNsaWNrKGluc3RhbmNlKTtcblxuICAgICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gaGFuZGxlRGVueUJ1dHRvbkNsaWNrKGluc3RhbmNlKTtcblxuICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBoYW5kbGVDYW5jZWxCdXR0b25DbGljayhpbnN0YW5jZSwgZGlzbWlzc1dpdGgpO1xuXG4gICAgICBkb21DYWNoZS5jbG9zZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jbG9zZSk7XG5cbiAgICAgIGhhbmRsZVBvcHVwQ2xpY2soaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCk7XG4gICAgICBhZGRLZXlkb3duSGFuZGxlcihpbnN0YW5jZSwgZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZShpbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgb3BlblBvcHVwKGlubmVyUGFyYW1zKTtcbiAgICAgIHNldHVwVGltZXIoZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgICBpbml0Rm9jdXMoZG9tQ2FjaGUsIGlubmVyUGFyYW1zKTsgLy8gU2Nyb2xsIGNvbnRhaW5lciB0byB0b3Agb24gb3BlbiAoIzEyNDcsICMxOTQ2KVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLnNjcm9sbFRvcCA9IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBwcmVwYXJlUGFyYW1zID0gKHVzZXJQYXJhbXMsIG1peGluUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGVQYXJhbXMgPSBnZXRUZW1wbGF0ZVBhcmFtcyh1c2VyUGFyYW1zKTtcbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLCBtaXhpblBhcmFtcywgdGVtcGxhdGVQYXJhbXMsIHVzZXJQYXJhbXMpOyAvLyBwcmVjZWRlbmNlIGlzIGRlc2NyaWJlZCBpbiAjMjEzMVxuXG4gICAgcGFyYW1zLnNob3dDbGFzcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMuc2hvd0NsYXNzLCBwYXJhbXMuc2hvd0NsYXNzKTtcbiAgICBwYXJhbXMuaGlkZUNsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcy5oaWRlQ2xhc3MsIHBhcmFtcy5oaWRlQ2xhc3MpO1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcmV0dXJucyB7RG9tQ2FjaGV9XG4gICAqL1xuXG5cbiAgY29uc3QgcG9wdWxhdGVEb21DYWNoZSA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHtcbiAgICAgIHBvcHVwOiBnZXRQb3B1cCgpLFxuICAgICAgY29udGFpbmVyOiBnZXRDb250YWluZXIoKSxcbiAgICAgIGFjdGlvbnM6IGdldEFjdGlvbnMoKSxcbiAgICAgIGNvbmZpcm1CdXR0b246IGdldENvbmZpcm1CdXR0b24oKSxcbiAgICAgIGRlbnlCdXR0b246IGdldERlbnlCdXR0b24oKSxcbiAgICAgIGNhbmNlbEJ1dHRvbjogZ2V0Q2FuY2VsQnV0dG9uKCksXG4gICAgICBsb2FkZXI6IGdldExvYWRlcigpLFxuICAgICAgY2xvc2VCdXR0b246IGdldENsb3NlQnV0dG9uKCksXG4gICAgICB2YWxpZGF0aW9uTWVzc2FnZTogZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSxcbiAgICAgIHByb2dyZXNzU3RlcHM6IGdldFByb2dyZXNzU3RlcHMoKVxuICAgIH07XG4gICAgcHJpdmF0ZVByb3BzLmRvbUNhY2hlLnNldChpbnN0YW5jZSwgZG9tQ2FjaGUpO1xuICAgIHJldHVybiBkb21DYWNoZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0dXBUaW1lciA9IChnbG9iYWxTdGF0ZSQkMSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICBoaWRlKHRpbWVyUHJvZ3Jlc3NCYXIpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnRpbWVyKSB7XG4gICAgICBnbG9iYWxTdGF0ZSQkMS50aW1lb3V0ID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgICAgZGlzbWlzc1dpdGgoJ3RpbWVyJyk7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZSQkMS50aW1lb3V0O1xuICAgICAgfSwgaW5uZXJQYXJhbXMudGltZXIpO1xuXG4gICAgICBpZiAoaW5uZXJQYXJhbXMudGltZXJQcm9ncmVzc0Jhcikge1xuICAgICAgICBzaG93KHRpbWVyUHJvZ3Jlc3NCYXIpO1xuICAgICAgICBhcHBseUN1c3RvbUNsYXNzKHRpbWVyUHJvZ3Jlc3NCYXIsIGlubmVyUGFyYW1zLCAndGltZXJQcm9ncmVzc0JhcicpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoZ2xvYmFsU3RhdGUkJDEudGltZW91dCAmJiBnbG9iYWxTdGF0ZSQkMS50aW1lb3V0LnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIC8vIHRpbWVyIGNhbiBiZSBhbHJlYWR5IHN0b3BwZWQgb3IgdW5zZXQgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIoaW5uZXJQYXJhbXMudGltZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBpbml0Rm9jdXMgPSAoZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgcmV0dXJuIGJsdXJBY3RpdmVFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKCFmb2N1c0J1dHRvbihkb21DYWNoZSwgaW5uZXJQYXJhbXMpKSB7XG4gICAgICBzZXRGb2N1cyhpbm5lclBhcmFtcywgLTEsIDEpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9tQ2FjaGV9IGRvbUNhY2hlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGZvY3VzQnV0dG9uID0gKGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0RlbnkgJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmRlbnlCdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5kZW55QnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNDYW5jZWwgJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNhbmNlbEJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ29uZmlybSAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY29uZmlybUJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBibHVyQWN0aXZlRWxlbWVudCA9ICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH1cbiAgfTsgLy8gVGhpcyBhbnRpLXdhciBtZXNzYWdlIHdpbGwgb25seSBiZSBzaG93biB0byBSdXNzaWFuIHVzZXJzIHZpc2l0aW5nIFJ1c3NpYW4gc2l0ZXNcblxuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAvXnJ1XFxiLy50ZXN0KG5hdmlnYXRvci5sYW5ndWFnZSkgJiYgbG9jYXRpb24uaG9zdC5tYXRjaCgvXFwuKHJ1fHN1fHhuLS1wMWFpKSQvKSkge1xuICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4xKSB7XG4gICAgICBjb25zdCBub1dhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbm9XYXIuY2xhc3NOYW1lID0gJ2xlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCc7XG4gICAgICBjb25zdCB2aWRlbyA9IGdldFJhbmRvbUVsZW1lbnQoW3tcbiAgICAgICAgdGV4dDogXCJcXHUwNDEyIFxcdTA0M0RcXHUwNDM4XFx1MDQzNlxcdTA0MzVcXHUwNDNGXFx1MDQ0MFxcdTA0MzhcXHUwNDMyXFx1MDQzNVxcdTA0MzRcXHUwNDUxXFx1MDQzRFxcdTA0M0RcXHUwNDNFXFx1MDQzQyBcXHUwNDMyXFx1MDQzOFxcdTA0MzRcXHUwNDM1XFx1MDQzRSBcXHUwNDNFXFx1MDQzMVxcdTA0NEFcXHUwNDRGXFx1MDQ0MVxcdTA0M0RcXHUwNDRGXFx1MDQzNVxcdTA0NDJcXHUwNDQxXFx1MDQ0RiBcXHUwNDNBXFx1MDQzMFxcdTA0M0EgXFx1MDQzQVxcdTA0MzBcXHUwNDM2XFx1MDQzNFxcdTA0NEJcXHUwNDM5IFxcdTA0MzhcXHUwNDM3IFxcdTA0M0RcXHUwNDMwXFx1MDQ0MSBcXHUwNDNDXFx1MDQzRVxcdTA0MzZcXHUwNDM1XFx1MDQ0MiBcXHUwNDNGXFx1MDQzRVxcdTA0M0NcXHUwNDNFXFx1MDQ0N1xcdTA0NEMgXFx1MDQzMiBcXHUwNDQyXFx1MDQzRVxcdTA0M0MsXFxuICAgICAgICA8c3Ryb25nPlxcdTA0NDdcXHUwNDQyXFx1MDQzRVxcdTA0MzFcXHUwNDRCIFxcdTA0NERcXHUwNDQyXFx1MDQzMCBcXHUwNDMxXFx1MDQzNVxcdTA0NDFcXHUwNDQxXFx1MDQzQ1xcdTA0NEJcXHUwNDQxXFx1MDQzQlxcdTA0MzVcXHUwNDNEXFx1MDQzRFxcdTA0MzBcXHUwNDRGIFxcdTA0MzggXFx1MDQzMVxcdTA0MzVcXHUwNDQxXFx1MDQ0N1xcdTA0MzVcXHUwNDNCXFx1MDQzRVxcdTA0MzJcXHUwNDM1XFx1MDQ0N1xcdTA0M0RcXHUwNDMwXFx1MDQ0RiBcXHUwNDMyXFx1MDQzRVxcdTA0MzlcXHUwNDNEXFx1MDQzMCBcXHUwNDNFXFx1MDQ0MVxcdTA0NDJcXHUwNDMwXFx1MDQzRFxcdTA0M0VcXHUwNDMyXFx1MDQzOFxcdTA0M0JcXHUwNDMwXFx1MDQ0MVxcdTA0NEM8L3N0cm9uZz46XCIsXG4gICAgICAgIGlkOiAnNENmRGhhUmt3N0knXG4gICAgICB9LCB7XG4gICAgICAgIHRleHQ6ICdcdTA0MkRcdTA0M0NcdTA0M0ZcdTA0MzBcdTA0NDJcdTA0MzhcdTA0NEYgLSBcdTA0MzNcdTA0M0JcdTA0MzBcdTA0MzJcdTA0M0RcdTA0M0VcdTA0MzUgPHN0cm9uZz5cdTA0NDdcdTA0MzVcdTA0M0JcdTA0M0VcdTA0MzJcdTA0MzVcdTA0NDdcdTA0MzVcdTA0NDFcdTA0M0FcdTA0M0VcdTA0MzU8L3N0cm9uZz4gXHUwNDQ3XHUwNDQzXHUwNDMyXHUwNDQxXHUwNDQyXHUwNDMyXHUwNDNFLiBcdTA0MjFcdTA0M0ZcdTA0M0VcdTA0NDFcdTA0M0VcdTA0MzFcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEMgXHUwNDQxXHUwNDNFXHUwNDNGXHUwNDM1XHUwNDQwXHUwNDM1XHUwNDM2XHUwNDM4XHUwNDMyXHUwNDMwXHUwNDQyXHUwNDRDLiA8c3Ryb25nPlx1MDQyMVx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQzRVx1MDQzMVx1MDQzRFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0QyBcdTA0M0ZcdTA0M0VcdTA0NDFcdTA0NDJcdTA0MzBcdTA0MzJcdTA0MzhcdTA0NDJcdTA0NEMgXHUwNDQxXHUwNDM1XHUwNDMxXHUwNDRGIFx1MDQzRFx1MDQzMCBcdTA0M0NcdTA0MzVcdTA0NDFcdTA0NDJcdTA0M0UgXHUwNDM0XHUwNDQwXHUwNDQzXHUwNDMzXHUwNDNFXHUwNDMzXHUwNDNFLjwvc3Ryb25nPicsXG4gICAgICAgIGlkOiAncy1HTEFJWTREWEEnXG4gICAgICB9XSk7XG4gICAgICBzZXRJbm5lckh0bWwobm9XYXIsIFwiXFxuICAgICAgPGRpdj5cXG4gICAgICAgIFxcdTA0MTVcXHUwNDQxXFx1MDQzQlxcdTA0MzggXFx1MDQzQ1xcdTA0NEIgXFx1MDQzRFxcdTA0MzUgXFx1MDQzRVxcdTA0NDFcXHUwNDQyXFx1MDQzMFxcdTA0M0RcXHUwNDNFXFx1MDQzMlxcdTA0MzhcXHUwNDNDIFxcdTA0MzJcXHUwNDNFXFx1MDQzOVxcdTA0M0RcXHUwNDQzLCBcXHUwNDNFXFx1MDQzRFxcdTA0MzAgXFx1MDQzRlxcdTA0NDBcXHUwNDM4XFx1MDQzNFxcdTA0MzVcXHUwNDQyIFxcdTA0MzIgXFx1MDQzNFxcdTA0M0VcXHUwNDNDIDxzdHJvbmc+XFx1MDQzQVxcdTA0MzBcXHUwNDM2XFx1MDQzNFxcdTA0M0VcXHUwNDMzXFx1MDQzRSBcXHUwNDM4XFx1MDQzNyBcXHUwNDNEXFx1MDQzMFxcdTA0NDE8L3N0cm9uZz4gXFx1MDQzOCBcXHUwNDM1XFx1MDQ1MSBcXHUwNDNGXFx1MDQzRVxcdTA0NDFcXHUwNDNCXFx1MDQzNVxcdTA0MzRcXHUwNDQxXFx1MDQ0MlxcdTA0MzJcXHUwNDM4XFx1MDQ0RiBcXHUwNDMxXFx1MDQ0M1xcdTA0MzRcXHUwNDQzXFx1MDQ0MiA8c3Ryb25nPlxcdTA0NDNcXHUwNDM2XFx1MDQzMFxcdTA0NDFcXHUwNDMwXFx1MDQ0RVxcdTA0NDlcXHUwNDM4XFx1MDQzQ1xcdTA0Mzg8L3N0cm9uZz4uXFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdj5cXG4gICAgICAgIFxcdTA0MUZcXHUwNDQzXFx1MDQ0MlxcdTA0MzhcXHUwNDNEXFx1MDQ0MVxcdTA0M0FcXHUwNDM4XFx1MDQzOSBcXHUwNDQwXFx1MDQzNVxcdTA0MzZcXHUwNDM4XFx1MDQzQyBcXHUwNDM3XFx1MDQzMCAyMCBcXHUwNDQxIFxcdTA0M0JcXHUwNDM4XFx1MDQ0OFxcdTA0M0RcXHUwNDM4XFx1MDQzQyBcXHUwNDNCXFx1MDQzNVxcdTA0NDIgXFx1MDQ0MVxcdTA0MzJcXHUwNDNFXFx1MDQzNVxcdTA0MzNcXHUwNDNFIFxcdTA0NDFcXHUwNDQzXFx1MDQ0OVxcdTA0MzVcXHUwNDQxXFx1MDQ0MlxcdTA0MzJcXHUwNDNFXFx1MDQzMlxcdTA0MzBcXHUwNDNEXFx1MDQzOFxcdTA0NEYgXFx1MDQzMlxcdTA0MzRcXHUwNDNFXFx1MDQzQlxcdTA0MzFcXHUwNDM4XFx1MDQzQiBcXHUwNDNEXFx1MDQzMFxcdTA0M0MsIFxcdTA0NDdcXHUwNDQyXFx1MDQzRSBcXHUwNDNDXFx1MDQ0QiBcXHUwNDMxXFx1MDQzNVxcdTA0NDFcXHUwNDQxXFx1MDQzOFxcdTA0M0JcXHUwNDRDXFx1MDQzRFxcdTA0NEIgXFx1MDQzOCBcXHUwNDNFXFx1MDQzNFxcdTA0MzhcXHUwNDNEIFxcdTA0NDdcXHUwNDM1XFx1MDQzQlxcdTA0M0VcXHUwNDMyXFx1MDQzNVxcdTA0M0EgXFx1MDQzRFxcdTA0MzUgXFx1MDQzQ1xcdTA0M0VcXHUwNDM2XFx1MDQzNVxcdTA0NDIgXFx1MDQzRFxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0MzNcXHUwNDNFIFxcdTA0NDFcXHUwNDM0XFx1MDQzNVxcdTA0M0JcXHUwNDMwXFx1MDQ0MlxcdTA0NEMuIDxzdHJvbmc+XFx1MDQyRFxcdTA0NDJcXHUwNDNFIFxcdTA0M0RcXHUwNDM1IFxcdTA0NDJcXHUwNDMwXFx1MDQzQSE8L3N0cm9uZz5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXCIuY29uY2F0KHZpZGVvLnRleHQsIFwiXFxuICAgICAgPC9kaXY+XFxuICAgICAgPGlmcmFtZSB3aWR0aD1cXFwiNTYwXFxcIiBoZWlnaHQ9XFxcIjMxNVxcXCIgc3JjPVxcXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9cIikuY29uY2F0KHZpZGVvLmlkLCBcIlxcXCIgZnJhbWVib3JkZXI9XFxcIjBcXFwiIGFsbG93PVxcXCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgY2xpcGJvYXJkLXdyaXRlOyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXFxcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+XFxuICAgICAgPGRpdj5cXG4gICAgICAgIFxcdTA0MURcXHUwNDM1XFx1MDQ0MiBcXHUwNDMyXFx1MDQzRVxcdTA0MzlcXHUwNDNEXFx1MDQzNSFcXG4gICAgICA8L2Rpdj5cXG4gICAgICBcIikpO1xuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGNsb3NlQnV0dG9uLmlubmVySFRNTCA9ICcmdGltZXM7JztcblxuICAgICAgY2xvc2VCdXR0b24ub25jbGljayA9ICgpID0+IG5vV2FyLnJlbW92ZSgpO1xuXG4gICAgICBub1dhci5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbik7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChub1dhcik7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9IC8vIEFzc2lnbiBpbnN0YW5jZSBtZXRob2RzIGZyb20gc3JjL2luc3RhbmNlTWV0aG9kcy8qLmpzIHRvIHByb3RvdHlwZVxuXG5cbiAgT2JqZWN0LmFzc2lnbihTd2VldEFsZXJ0LnByb3RvdHlwZSwgaW5zdGFuY2VNZXRob2RzKTsgLy8gQXNzaWduIHN0YXRpYyBtZXRob2RzIGZyb20gc3JjL3N0YXRpY01ldGhvZHMvKi5qcyB0byBjb25zdHJ1Y3RvclxuXG4gIE9iamVjdC5hc3NpZ24oU3dlZXRBbGVydCwgc3RhdGljTWV0aG9kcyk7IC8vIFByb3h5IHRvIGluc3RhbmNlIG1ldGhvZHMgdG8gY29uc3RydWN0b3IsIGZvciBub3csIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXG4gIE9iamVjdC5rZXlzKGluc3RhbmNlTWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgIFN3ZWV0QWxlcnRba2V5XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbnN0YW5jZVtrZXldKC4uLmFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIFN3ZWV0QWxlcnQuRGlzbWlzc1JlYXNvbiA9IERpc21pc3NSZWFzb247XG4gIFN3ZWV0QWxlcnQudmVyc2lvbiA9ICcxMS40LjI2JztcblxuICBjb25zdCBTd2FsID0gU3dlZXRBbGVydDsgLy8gQHRzLWlnbm9yZVxuXG4gIFN3YWwuZGVmYXVsdCA9IFN3YWw7XG5cbiAgcmV0dXJuIFN3YWw7XG5cbn0pKTtcbmlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5Td2VldGFsZXJ0Mil7ICB0aGlzLnN3YWwgPSB0aGlzLnN3ZWV0QWxlcnQgPSB0aGlzLlN3YWwgPSB0aGlzLlN3ZWV0QWxlcnQgPSB0aGlzLlN3ZWV0YWxlcnQyfVxuXG5cInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQmJmZ1bmN0aW9uKGUsdCl7dmFyIG49ZS5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7aWYoZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQobiksbi5zdHlsZVNoZWV0KW4uc3R5bGVTaGVldC5kaXNhYmxlZHx8KG4uc3R5bGVTaGVldC5jc3NUZXh0PXQpO2Vsc2UgdHJ5e24uaW5uZXJIVE1MPXR9Y2F0Y2goZSl7bi5pbm5lclRleHQ9dH19KGRvY3VtZW50LFwiLnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0e2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLWNvbHVtbjoxLzQhaW1wb3J0YW50O2dyaWQtcm93OjEvNCFpbXBvcnRhbnQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciA5OWZyIDFmcjtwYWRkaW5nOjFlbTtvdmVyZmxvdy15OmhpZGRlbjtiYWNrZ3JvdW5kOiNmZmY7Ym94LXNoYWRvdzowIDAgMXB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwwIDFweCAycHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDFweCAycHggNHB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwxcHggM3B4IDhweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMnB4IDRweCAxNnB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KTtwb2ludGVyLWV2ZW50czphbGx9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0Pip7Z3JpZC1jb2x1bW46Mn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXRpdGxle21hcmdpbjouNWVtIDFlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjFlbTt0ZXh0LWFsaWduOmluaXRpYWx9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1sb2FkaW5ne2p1c3RpZnktY29udGVudDpjZW50ZXJ9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pbnB1dHtoZWlnaHQ6MmVtO21hcmdpbjouNWVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWZvb3RlcnttYXJnaW46LjVlbSAwIDA7cGFkZGluZzouNWVtIDAgMDtmb250LXNpemU6LjhlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWNsb3Nle2dyaWQtY29sdW1uOjMvMztncmlkLXJvdzoxLzk5O2FsaWduLXNlbGY6Y2VudGVyO3dpZHRoOi44ZW07aGVpZ2h0Oi44ZW07bWFyZ2luOjA7Zm9udC1zaXplOjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWh0bWwtY29udGFpbmVye21hcmdpbjouNWVtIDFlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjFlbTt0ZXh0LWFsaWduOmluaXRpYWx9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1odG1sLWNvbnRhaW5lcjplbXB0eXtwYWRkaW5nOjB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1sb2FkZXJ7Z3JpZC1jb2x1bW46MTtncmlkLXJvdzoxLzk5O2FsaWduLXNlbGY6Y2VudGVyO3dpZHRoOjJlbTtoZWlnaHQ6MmVtO21hcmdpbjouMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb257Z3JpZC1jb2x1bW46MTtncmlkLXJvdzoxLzk5O2FsaWduLXNlbGY6Y2VudGVyO3dpZHRoOjJlbTttaW4td2lkdGg6MmVtO2hlaWdodDoyZW07bWFyZ2luOjAgLjVlbSAwIDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uIC5zd2FsMi1pY29uLWNvbnRlbnR7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtmb250LXNpemU6MS44ZW07Zm9udC13ZWlnaHQ6NzAwfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7d2lkdGg6MmVtO2hlaWdodDoyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde3RvcDouODc1ZW07d2lkdGg6MS4zNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPWxlZnRde2xlZnQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPXJpZ2h0XXtyaWdodDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItYWN0aW9uc3tqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDtoZWlnaHQ6YXV0bzttYXJnaW46MDttYXJnaW4tdG9wOi41ZW07cGFkZGluZzowIC41ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdHlsZWR7bWFyZ2luOi4yNWVtIC41ZW07cGFkZGluZzouNGVtIC42ZW07Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODZ9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDoxLjZlbTtoZWlnaHQ6M2VtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPWxlZnRde3RvcDotLjhlbTtsZWZ0Oi0uNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjJlbSAyZW07Ym9yZGVyLXJhZGl1czo0ZW0gMCAwIDRlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1yaWdodF17dG9wOi0uMjVlbTtsZWZ0Oi45Mzc1ZW07dHJhbnNmb3JtLW9yaWdpbjowIDEuNWVtO2JvcmRlci1yYWRpdXM6MCA0ZW0gNGVtIDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7d2lkdGg6MmVtO2hlaWdodDoyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLWZpeHt0b3A6MDtsZWZ0Oi40Mzc1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6Mi42ODc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtoZWlnaHQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6LjkzNzVlbTtyaWdodDouMTg3NWVtO3dpZHRoOjEuMzc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLXRpcHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1czthbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXN9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLWxvbmd7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXN9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0LnN3YWwyLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3Qtc2hvdyAuNXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LXNob3cgLjVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdC5zd2FsMi1oaWRley13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWhpZGUgLjFzIGZvcndhcmRzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1oaWRlIC4xcyBmb3J3YXJkc30uc3dhbDItY29udGFpbmVye2Rpc3BsYXk6Z3JpZDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjEwNjA7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtdGVtcGxhdGUtYXJlYXM6XFxcInRvcC1zdGFydCAgICAgdG9wICAgICAgICAgICAgdG9wLWVuZFxcXCIgXFxcImNlbnRlci1zdGFydCAgY2VudGVyICAgICAgICAgY2VudGVyLWVuZFxcXCIgXFxcImJvdHRvbS1zdGFydCAgYm90dG9tLWNlbnRlciAgYm90dG9tLWVuZFxcXCI7Z3JpZC10ZW1wbGF0ZS1yb3dzOm1pbm1heCgtd2Via2l0LW1pbi1jb250ZW50LGF1dG8pIG1pbm1heCgtd2Via2l0LW1pbi1jb250ZW50LGF1dG8pIG1pbm1heCgtd2Via2l0LW1pbi1jb250ZW50LGF1dG8pO2dyaWQtdGVtcGxhdGUtcm93czptaW5tYXgobWluLWNvbnRlbnQsYXV0bykgbWlubWF4KG1pbi1jb250ZW50LGF1dG8pIG1pbm1heChtaW4tY29udGVudCxhdXRvKTtoZWlnaHQ6MTAwJTtwYWRkaW5nOi42MjVlbTtvdmVyZmxvdy14OmhpZGRlbjt0cmFuc2l0aW9uOmJhY2tncm91bmQtY29sb3IgLjFzOy13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOnRvdWNofS5zd2FsMi1jb250YWluZXIuc3dhbDItYmFja2Ryb3Atc2hvdywuc3dhbDItY29udGFpbmVyLnN3YWwyLW5vYW5pbWF0aW9ue2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNCl9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1iYWNrZHJvcC1oaWRle2JhY2tncm91bmQ6MCAwIWltcG9ydGFudH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6bWlubWF4KDAsMWZyKSBhdXRvIGF1dG99LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20sLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXIsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gbWlubWF4KDAsMWZyKSBhdXRvfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5ke2dyaWQtdGVtcGxhdGUtY29sdW1uczphdXRvIGF1dG8gbWlubWF4KDAsMWZyKX0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydD4uc3dhbDItcG9wdXB7YWxpZ24tc2VsZjpzdGFydH0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjthbGlnbi1zZWxmOnN0YXJ0O2p1c3RpZnktc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MzthbGlnbi1zZWxmOnN0YXJ0O2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItc3RhcnQ+LnN3YWwyLXBvcHVwe2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXI+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcjtqdXN0aWZ5LXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcjtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWxlZnQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoxO2dyaWQtcm93OjM7YWxpZ24tc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7Z3JpZC1yb3c6MztqdXN0aWZ5LXNlbGY6Y2VudGVyO2FsaWduLXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7Z3JpZC1yb3c6MzthbGlnbi1zZWxmOmVuZDtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1mdWxsc2NyZWVuPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctcm93Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoxLzQ7d2lkdGg6MTAwJX0uc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctZnVsbHNjcmVlbj4uc3dhbDItcG9wdXB7Z3JpZC1yb3c6MS80O2FsaWduLXNlbGY6c3RyZXRjaH0uc3dhbDItY29udGFpbmVyLnN3YWwyLW5vLXRyYW5zaXRpb257dHJhbnNpdGlvbjpub25lIWltcG9ydGFudH0uc3dhbDItcG9wdXB7ZGlzcGxheTpub25lO3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6bWlubWF4KDAsMTAwJSk7d2lkdGg6MzJlbTttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOjAgMCAxLjI1ZW07Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDojZmZmO2NvbG9yOiM1NDU0NTQ7Zm9udC1mYW1pbHk6aW5oZXJpdDtmb250LXNpemU6MXJlbX0uc3dhbDItcG9wdXA6Zm9jdXN7b3V0bGluZTowfS5zd2FsMi1wb3B1cC5zd2FsMi1sb2FkaW5ne292ZXJmbG93LXk6aGlkZGVufS5zd2FsMi10aXRsZXtwb3NpdGlvbjpyZWxhdGl2ZTttYXgtd2lkdGg6MTAwJTttYXJnaW46MDtwYWRkaW5nOi44ZW0gMWVtIDA7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS44NzVlbTtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC10cmFuc2Zvcm06bm9uZTt3b3JkLXdyYXA6YnJlYWstd29yZH0uc3dhbDItYWN0aW9uc3tkaXNwbGF5OmZsZXg7ei1pbmRleDoxO2JveC1zaXppbmc6Ym9yZGVyLWJveDtmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDphdXRvO21hcmdpbjoxLjI1ZW0gYXV0byAwO3BhZGRpbmc6MH0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWRbZGlzYWJsZWRde29wYWNpdHk6LjR9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkOmhvdmVye2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMCwwLDAsLjEpLHJnYmEoMCwwLDAsLjEpKX0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWQ6YWN0aXZle2JhY2tncm91bmQtaW1hZ2U6bGluZWFyLWdyYWRpZW50KHJnYmEoMCwwLDAsLjIpLHJnYmEoMCwwLDAsLjIpKX0uc3dhbDItbG9hZGVye2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDoyLjJlbTtoZWlnaHQ6Mi4yZW07bWFyZ2luOjAgMS44NzVlbTstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1yb3RhdGUtbG9hZGluZyAxLjVzIGxpbmVhciAwcyBpbmZpbml0ZSBub3JtYWw7YW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1sb2FkaW5nIDEuNXMgbGluZWFyIDBzIGluZmluaXRlIG5vcm1hbDtib3JkZXItd2lkdGg6LjI1ZW07Ym9yZGVyLXN0eWxlOnNvbGlkO2JvcmRlci1yYWRpdXM6MTAwJTtib3JkZXItY29sb3I6IzI3NzhjNCB0cmFuc3BhcmVudCAjMjc3OGM0IHRyYW5zcGFyZW50fS5zd2FsMi1zdHlsZWR7bWFyZ2luOi4zMTI1ZW07cGFkZGluZzouNjI1ZW0gMS4xZW07dHJhbnNpdGlvbjpib3gtc2hhZG93IC4xcztib3gtc2hhZG93OjAgMCAwIDNweCB0cmFuc3BhcmVudDtmb250LXdlaWdodDo1MDB9LnN3YWwyLXN0eWxlZDpub3QoW2Rpc2FibGVkXSl7Y3Vyc29yOnBvaW50ZXJ9LnN3YWwyLXN0eWxlZC5zd2FsMi1jb25maXJte2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6IzcwNjZlMDtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1jb25maXJtOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTEyLDEwMiwyMjQsLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItZGVueXtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiNkYzM3NDE7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItZGVueTpmb2N1c3tib3gtc2hhZG93OjAgMCAwIDNweCByZ2JhKDIyMCw1NSw2NSwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1jYW5jZWx7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojNmU3ODgxO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbDpmb2N1c3tib3gtc2hhZG93OjAgMCAwIDNweCByZ2JhKDExMCwxMjAsMTI5LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWRlZmF1bHQtb3V0bGluZTpmb2N1c3tib3gtc2hhZG93OjAgMCAwIDNweCByZ2JhKDEwMCwxNTAsMjAwLC41KX0uc3dhbDItc3R5bGVkOmZvY3Vze291dGxpbmU6MH0uc3dhbDItc3R5bGVkOjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowfS5zd2FsMi1mb290ZXJ7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIDAgMDtwYWRkaW5nOjFlbSAxZW0gMDtib3JkZXItdG9wOjFweCBzb2xpZCAjZWVlO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjFlbX0uc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lcntwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDtncmlkLWNvbHVtbjphdXRvIWltcG9ydGFudDtvdmVyZmxvdzpoaWRkZW47Ym9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6NXB4O2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6NXB4fS5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXJ7d2lkdGg6MTAwJTtoZWlnaHQ6LjI1ZW07YmFja2dyb3VuZDpyZ2JhKDAsMCwwLC4yKX0uc3dhbDItaW1hZ2V7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjJlbSBhdXRvIDFlbX0uc3dhbDItY2xvc2V7ei1pbmRleDoyO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjEuMmVtO2hlaWdodDoxLjJlbTttYXJnaW4tdG9wOjA7bWFyZ2luLXJpZ2h0OjA7bWFyZ2luLWJvdHRvbTotMS4yZW07cGFkZGluZzowO292ZXJmbG93OmhpZGRlbjt0cmFuc2l0aW9uOmNvbG9yIC4xcyxib3gtc2hhZG93IC4xcztib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojY2NjO2ZvbnQtZmFtaWx5OnNlcmlmO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6Mi41ZW07Y3Vyc29yOnBvaW50ZXI7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY2xvc2U6aG92ZXJ7dHJhbnNmb3JtOm5vbmU7YmFja2dyb3VuZDowIDA7Y29sb3I6I2YyNzQ3NH0uc3dhbDItY2xvc2U6Zm9jdXN7b3V0bGluZTowO2JveC1zaGFkb3c6aW5zZXQgMCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1jbG9zZTo6LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MH0uc3dhbDItaHRtbC1jb250YWluZXJ7ei1pbmRleDoxO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAxLjZlbSAuM2VtO3BhZGRpbmc6MDtvdmVyZmxvdzphdXRvO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW07Zm9udC13ZWlnaHQ6NDAwO2xpbmUtaGVpZ2h0Om5vcm1hbDt0ZXh0LWFsaWduOmNlbnRlcjt3b3JkLXdyYXA6YnJlYWstd29yZDt3b3JkLWJyZWFrOmJyZWFrLXdvcmR9LnN3YWwyLWNoZWNrYm94LC5zd2FsMi1maWxlLC5zd2FsMi1pbnB1dCwuc3dhbDItcmFkaW8sLnN3YWwyLXNlbGVjdCwuc3dhbDItdGV4dGFyZWF7bWFyZ2luOjFlbSAyZW0gM3B4fS5zd2FsMi1maWxlLC5zd2FsMi1pbnB1dCwuc3dhbDItdGV4dGFyZWF7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOmF1dG87dHJhbnNpdGlvbjpib3JkZXItY29sb3IgLjFzLGJveC1zaGFkb3cgLjFzO2JvcmRlcjoxcHggc29saWQgI2Q5ZDlkOTtib3JkZXItcmFkaXVzOi4xODc1ZW07YmFja2dyb3VuZDowIDA7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDYpLDAgMCAwIDNweCB0cmFuc3BhcmVudDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1maWxlLnN3YWwyLWlucHV0ZXJyb3IsLnN3YWwyLWlucHV0LnN3YWwyLWlucHV0ZXJyb3IsLnN3YWwyLXRleHRhcmVhLnN3YWwyLWlucHV0ZXJyb3J7Ym9yZGVyLWNvbG9yOiNmMjc0NzQhaW1wb3J0YW50O2JveC1zaGFkb3c6MCAwIDJweCAjZjI3NDc0IWltcG9ydGFudH0uc3dhbDItZmlsZTpmb2N1cywuc3dhbDItaW5wdXQ6Zm9jdXMsLnN3YWwyLXRleHRhcmVhOmZvY3Vze2JvcmRlcjoxcHggc29saWQgI2I0ZGJlZDtvdXRsaW5lOjA7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDYpLDAgMCAwIDNweCByZ2JhKDEwMCwxNTAsMjAwLC41KX0uc3dhbDItZmlsZTo6LW1vei1wbGFjZWhvbGRlciwuc3dhbDItaW5wdXQ6Oi1tb3otcGxhY2Vob2xkZXIsLnN3YWwyLXRleHRhcmVhOjotbW96LXBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLWZpbGU6OnBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6cGxhY2Vob2xkZXIsLnN3YWwyLXRleHRhcmVhOjpwbGFjZWhvbGRlcntjb2xvcjojY2NjfS5zd2FsMi1yYW5nZXttYXJnaW46MWVtIDJlbSAzcHg7YmFja2dyb3VuZDojZmZmfS5zd2FsMi1yYW5nZSBpbnB1dHt3aWR0aDo4MCV9LnN3YWwyLXJhbmdlIG91dHB1dHt3aWR0aDoyMCU7Y29sb3I6aW5oZXJpdDtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLXJhbmdlIGlucHV0LC5zd2FsMi1yYW5nZSBvdXRwdXR7aGVpZ2h0OjIuNjI1ZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxLjEyNWVtO2xpbmUtaGVpZ2h0OjIuNjI1ZW19LnN3YWwyLWlucHV0e2hlaWdodDoyLjYyNWVtO3BhZGRpbmc6MCAuNzVlbX0uc3dhbDItZmlsZXt3aWR0aDo3NSU7bWFyZ2luLXJpZ2h0OmF1dG87bWFyZ2luLWxlZnQ6YXV0bztiYWNrZ3JvdW5kOjAgMDtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItdGV4dGFyZWF7aGVpZ2h0OjYuNzVlbTtwYWRkaW5nOi43NWVtfS5zd2FsMi1zZWxlY3R7bWluLXdpZHRoOjUwJTttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOi4zNzVlbSAuNjI1ZW07YmFja2dyb3VuZDowIDA7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItY2hlY2tib3gsLnN3YWwyLXJhZGlve2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6I2ZmZjtjb2xvcjppbmhlcml0fS5zd2FsMi1jaGVja2JveCBsYWJlbCwuc3dhbDItcmFkaW8gbGFiZWx7bWFyZ2luOjAgLjZlbTtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItY2hlY2tib3ggaW5wdXQsLnN3YWwyLXJhZGlvIGlucHV0e2ZsZXgtc2hyaW5rOjA7bWFyZ2luOjAgLjRlbX0uc3dhbDItaW5wdXQtbGFiZWx7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSBhdXRvIDB9LnN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZXthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIDAgMDtwYWRkaW5nOi42MjVlbTtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDojZjBmMGYwO2NvbG9yOiM2NjY7Zm9udC1zaXplOjFlbTtmb250LXdlaWdodDozMDB9LnN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZTo6YmVmb3Jle2NvbnRlbnQ6XFxcIiFcXFwiO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjEuNWVtO21pbi13aWR0aDoxLjVlbTtoZWlnaHQ6MS41ZW07bWFyZ2luOjAgLjYyNWVtO2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NDtjb2xvcjojZmZmO2ZvbnQtd2VpZ2h0OjYwMDtsaW5lLWhlaWdodDoxLjVlbTt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItaWNvbntwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6NWVtO2hlaWdodDo1ZW07bWFyZ2luOjIuNWVtIGF1dG8gLjZlbTtib3JkZXI6LjI1ZW0gc29saWQgdHJhbnNwYXJlbnQ7Ym9yZGVyLXJhZGl1czo1MCU7Ym9yZGVyLWNvbG9yOiMwMDA7Zm9udC1mYW1pbHk6aW5oZXJpdDtsaW5lLWhlaWdodDo1ZW07Y3Vyc29yOmRlZmF1bHQ7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5zd2FsMi1pY29uIC5zd2FsMi1pY29uLWNvbnRlbnR7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtmb250LXNpemU6My43NWVtfS5zd2FsMi1pY29uLnN3YWwyLWVycm9ye2JvcmRlci1jb2xvcjojZjI3NDc0O2NvbG9yOiNmMjc0NzR9LnN3YWwyLWljb24uc3dhbDItZXJyb3IgLnN3YWwyLXgtbWFya3twb3NpdGlvbjpyZWxhdGl2ZTtmbGV4LWdyb3c6MX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoyLjMxMjVlbTt3aWR0aDoyLjkzNzVlbTtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNmMjc0NzR9LnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPWxlZnRde2xlZnQ6MS4wNjI1ZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9LnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPXJpZ2h0XXtyaWdodDoxZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yLnN3YWwyLWljb24tc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yLnN3YWwyLWljb24tc2hvdyAuc3dhbDIteC1tYXJrey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmsgLjVzfS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmd7Ym9yZGVyLWNvbG9yOiNmYWNlYTg7Y29sb3I6I2Y4YmI4Nn0uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5nLnN3YWwyLWljb24tc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuNXN9LnN3YWwyLWljb24uc3dhbDItaW5mb3tib3JkZXItY29sb3I6IzlkZTBmNjtjb2xvcjojM2ZjM2VlfS5zd2FsMi1pY29uLnN3YWwyLWluZm8uc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuOHM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC44c30uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbntib3JkZXItY29sb3I6I2M5ZGFlMTtjb2xvcjojODdhZGJkfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9uLnN3YWwyLWljb24tc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9uLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtcXVlc3Rpb24tbWFyayAuOHM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtcXVlc3Rpb24tbWFyayAuOHN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzc3tib3JkZXItY29sb3I6I2E1ZGM4Njtjb2xvcjojYTVkYzg2fS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVde3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjMuNzVlbTtoZWlnaHQ6Ny41ZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPWxlZnRde3RvcDotLjQzNzVlbTtsZWZ0Oi0yLjA2MzVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtLW9yaWdpbjozLjc1ZW0gMy43NWVtO2JvcmRlci1yYWRpdXM6Ny41ZW0gMCAwIDcuNWVtfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1yaWdodF17dG9wOi0uNjg3NWVtO2xlZnQ6MS44NzVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtLW9yaWdpbjowIDMuNzVlbTtib3JkZXItcmFkaXVzOjAgNy41ZW0gNy41ZW0gMH0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoyO3RvcDotLjI1ZW07bGVmdDotLjI1ZW07Ym94LXNpemluZzpjb250ZW50LWJveDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JvcmRlcjouMjVlbSBzb2xpZCByZ2JhKDE2NSwyMjAsMTM0LC4zKTtib3JkZXItcmFkaXVzOjUwJX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLWZpeHtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjE7dG9wOi41ZW07bGVmdDoxLjYyNWVtO3dpZHRoOi40Mzc1ZW07aGVpZ2h0OjUuNjI1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVde2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoyO2hlaWdodDouMzEyNWVtO2JvcmRlci1yYWRpdXM6LjEyNWVtO2JhY2tncm91bmQtY29sb3I6I2E1ZGM4Nn0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9dGlwXXt0b3A6Mi44NzVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPWxvbmdde3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLWxvbmd7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1yaWdodHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lIDQuMjVzIGVhc2UtaW47YW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmUgNC4yNXMgZWFzZS1pbn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHN7ZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6Y2VudGVyO21heC13aWR0aDoxMDAlO21hcmdpbjoxLjI1ZW0gYXV0bztwYWRkaW5nOjA7YmFja2dyb3VuZDowIDA7Zm9udC13ZWlnaHQ6NjAwfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyBsaXtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjpyZWxhdGl2ZX0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXB7ei1pbmRleDoyMDtmbGV4LXNocmluazowO3dpZHRoOjJlbTtoZWlnaHQ6MmVtO2JvcmRlci1yYWRpdXM6MmVtO2JhY2tncm91bmQ6IzI3NzhjNDtjb2xvcjojZmZmO2xpbmUtaGVpZ2h0OjJlbTt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB7YmFja2dyb3VuZDojMjc3OGM0fS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiNhZGQ4ZTY7Y29sb3I6I2ZmZn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB+LnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXtiYWNrZ3JvdW5kOiNhZGQ4ZTZ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLWxpbmV7ei1pbmRleDoxMDtmbGV4LXNocmluazowO3dpZHRoOjIuNWVtO2hlaWdodDouNGVtO21hcmdpbjowIC0xcHg7YmFja2dyb3VuZDojMjc3OGM0fVtjbGFzc149c3dhbDJdey13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjp0cmFuc3BhcmVudH0uc3dhbDItc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1zaG93IC4zczthbmltYXRpb246c3dhbDItc2hvdyAuM3N9LnN3YWwyLWhpZGV7LXdlYmtpdC1hbmltYXRpb246c3dhbDItaGlkZSAuMTVzIGZvcndhcmRzO2FuaW1hdGlvbjpzd2FsMi1oaWRlIC4xNXMgZm9yd2FyZHN9LnN3YWwyLW5vYW5pbWF0aW9ue3RyYW5zaXRpb246bm9uZX0uc3dhbDItc2Nyb2xsYmFyLW1lYXN1cmV7cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5cHg7d2lkdGg6NTBweDtoZWlnaHQ6NTBweDtvdmVyZmxvdzpzY3JvbGx9LnN3YWwyLXJ0bCAuc3dhbDItY2xvc2V7bWFyZ2luLXJpZ2h0OmluaXRpYWw7bWFyZ2luLWxlZnQ6MH0uc3dhbDItcnRsIC5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXJ7cmlnaHQ6MDtsZWZ0OmF1dG99LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZHtkaXNwbGF5OmZsZXg7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxOTM5O3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjI1cHggMCAyMHB4O2JhY2tncm91bmQ6IzIwMjMyYTtjb2xvcjojZmZmO3RleHQtYWxpZ246Y2VudGVyfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgZGl2e21heC13aWR0aDo1NjBweDttYXJnaW46MTBweDtsaW5lLWhlaWdodDoxNDYlfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgaWZyYW1le21heC13aWR0aDoxMDAlO21heC1oZWlnaHQ6NTUuNTU1NTU1NTU1NnZtaW47bWFyZ2luOjE2cHggYXV0b30ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIHN0cm9uZ3tib3JkZXItYm90dG9tOjJweCBkYXNoZWQgI2ZmZn0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGJ1dHRvbntkaXNwbGF5OmZsZXg7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxOTQwO3RvcDowO3JpZ2h0OjA7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6NDhweDtoZWlnaHQ6NDhweDttYXJnaW4tcmlnaHQ6MTBweDttYXJnaW4tYm90dG9tOi0xMHB4O2JvcmRlcjpub25lO2JhY2tncm91bmQ6MCAwO2NvbG9yOiNhYWE7Zm9udC1zaXplOjQ4cHg7Zm9udC13ZWlnaHQ6NzAwO2N1cnNvcjpwb2ludGVyfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgYnV0dG9uOmhvdmVye2NvbG9yOiNmZmZ9QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LXNob3d7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLS42MjVlbSkgcm90YXRlWigyZGVnKX0zMyV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigtMmRlZyl9NjYle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC4zMTI1ZW0pIHJvdGF0ZVooMmRlZyl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKDApfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LXNob3d7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLS42MjVlbSkgcm90YXRlWigyZGVnKX0zMyV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigtMmRlZyl9NjYle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC4zMTI1ZW0pIHJvdGF0ZVooMmRlZyl9MTAwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAle3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1oaWRlezEwMCV7dHJhbnNmb3JtOnJvdGF0ZVooMWRlZyk7b3BhY2l0eTowfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDouNTYyNWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6LjEyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDouNjI1ZW07bGVmdDotLjI1ZW07d2lkdGg6MS42MjVlbX04NCV7dG9wOjEuMDYyNWVtO2xlZnQ6Ljc1ZW07d2lkdGg6LjVlbX0xMDAle3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOi41NjI1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDouMTI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOi42MjVlbTtsZWZ0Oi0uMjVlbTt3aWR0aDoxLjYyNWVtfTg0JXt0b3A6MS4wNjI1ZW07bGVmdDouNzVlbTt3aWR0aDouNWVtfTEwMCV7dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6MS42MjVlbTtyaWdodDoxLjM3NWVtO3dpZHRoOjB9NjUle3RvcDoxLjI1ZW07cmlnaHQ6LjkzNzVlbTt3aWR0aDowfTg0JXt0b3A6LjkzNzVlbTtyaWdodDowO3dpZHRoOjEuMTI1ZW19MTAwJXt0b3A6LjkzNzVlbTtyaWdodDouMTg3NWVtO3dpZHRoOjEuMzc1ZW19fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6MS42MjVlbTtyaWdodDoxLjM3NWVtO3dpZHRoOjB9NjUle3RvcDoxLjI1ZW07cmlnaHQ6LjkzNzVlbTt3aWR0aDowfTg0JXt0b3A6LjkzNzVlbTtyaWdodDowO3dpZHRoOjEuMTI1ZW19MTAwJXt0b3A6LjkzNzVlbTtyaWdodDouMTg3NWVtO3dpZHRoOjEuMzc1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1zaG93ezAle3RyYW5zZm9ybTpzY2FsZSguNyl9NDUle3RyYW5zZm9ybTpzY2FsZSgxLjA1KX04MCV7dHJhbnNmb3JtOnNjYWxlKC45NSl9MTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9fUBrZXlmcmFtZXMgc3dhbDItc2hvd3swJXt0cmFuc2Zvcm06c2NhbGUoLjcpfTQ1JXt0cmFuc2Zvcm06c2NhbGUoMS4wNSl9ODAle3RyYW5zZm9ybTpzY2FsZSguOTUpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItaGlkZXswJXt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnNjYWxlKC41KTtvcGFjaXR5OjB9fUBrZXlmcmFtZXMgc3dhbDItaGlkZXswJXt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnNjYWxlKC41KTtvcGFjaXR5OjB9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOjEuMTg3NWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6MS4wNjI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOjIuMTg3NWVtO2xlZnQ6LS4zNzVlbTt3aWR0aDozLjEyNWVtfTg0JXt0b3A6M2VtO2xlZnQ6MS4zMTI1ZW07d2lkdGg6MS4wNjI1ZW19MTAwJXt0b3A6Mi44MTI1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6MS4xODc1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDoxLjA2MjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6Mi4xODc1ZW07bGVmdDotLjM3NWVtO3dpZHRoOjMuMTI1ZW19ODQle3RvcDozZW07bGVmdDoxLjMxMjVlbTt3aWR0aDoxLjA2MjVlbX0xMDAle3RvcDoyLjgxMjVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH02NSV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTg0JXt0b3A6Mi4xODc1ZW07cmlnaHQ6MDt3aWR0aDozLjQzNzVlbX0xMDAle3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW19fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9NjUle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH04NCV7dG9wOjIuMTg3NWVtO3JpZ2h0OjA7d2lkdGg6My40Mzc1ZW19MTAwJXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZXswJXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9NSV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTEyJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX19QGtleWZyYW1lcyBzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lezAle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX01JXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9MTIle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmt7MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTUwJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9ODAle21hcmdpbi10b3A6LS4zNzVlbTt0cmFuc2Zvcm06c2NhbGUoMS4xNSl9MTAwJXttYXJnaW4tdG9wOjA7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFya3swJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9NTAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH04MCV7bWFyZ2luLXRvcDotLjM3NWVtO3RyYW5zZm9ybTpzY2FsZSgxLjE1KX0xMDAle21hcmdpbi10b3A6MDt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci1pY29uezAle3RyYW5zZm9ybTpyb3RhdGVYKDEwMGRlZyk7b3BhY2l0eTowfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbnswJXt0cmFuc2Zvcm06cm90YXRlWCgxMDBkZWcpO29wYWNpdHk6MH0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1sb2FkaW5nezAle3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUBrZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtcXVlc3Rpb24tbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWSgtMzYwZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGVZKDApfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtcXVlc3Rpb24tbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWSgtMzYwZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGVZKDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1pLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVooNDVkZWcpO29wYWNpdHk6MH0yNSV7dHJhbnNmb3JtOnJvdGF0ZVooLTI1ZGVnKTtvcGFjaXR5Oi40fTUwJXt0cmFuc2Zvcm06cm90YXRlWigxNWRlZyk7b3BhY2l0eTouOH03NSV7dHJhbnNmb3JtOnJvdGF0ZVooLTVkZWcpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWktbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWig0NWRlZyk7b3BhY2l0eTowfTI1JXt0cmFuc2Zvcm06cm90YXRlWigtMjVkZWcpO29wYWNpdHk6LjR9NTAle3RyYW5zZm9ybTpyb3RhdGVaKDE1ZGVnKTtvcGFjaXR5Oi44fTc1JXt0cmFuc2Zvcm06cm90YXRlWigtNWRlZyk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93OmhpZGRlbn1ib2R5LnN3YWwyLWhlaWdodC1hdXRve2hlaWdodDphdXRvIWltcG9ydGFudH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudCFpbXBvcnRhbnQ7cG9pbnRlci1ldmVudHM6bm9uZX1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXIgLnN3YWwyLXBvcHVwe3BvaW50ZXItZXZlbnRzOmFsbH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1jb250YWluZXIgLnN3YWwyLW1vZGFse2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSgwLDAsMCwuNCl9QG1lZGlhIHByaW50e2JvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bil7b3ZlcmZsb3cteTpzY3JvbGwhaW1wb3J0YW50fWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bik+W2FyaWEtaGlkZGVuPXRydWVde2Rpc3BsYXk6bm9uZX1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pIC5zd2FsMi1jb250YWluZXJ7cG9zaXRpb246c3RhdGljIWltcG9ydGFudH19Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVye2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDozNjBweDttYXgtd2lkdGg6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50O3BvaW50ZXItZXZlbnRzOm5vbmV9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcHt0b3A6MDtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtcmlnaHR7dG9wOjA7cmlnaHQ6MDtib3R0b206YXV0bztsZWZ0OmF1dG99Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1sZWZ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnR7dG9wOjA7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjB9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1sZWZ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItc3RhcnR7dG9wOjUwJTtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVye3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1yaWdodHt0b3A6NTAlO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0e3RvcDphdXRvO3JpZ2h0OmF1dG87Ym90dG9tOjA7bGVmdDowfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b217dG9wOmF1dG87cmlnaHQ6YXV0bztib3R0b206MDtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXJpZ2h0e3RvcDphdXRvO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDphdXRvfVwiKTsiLCAiY29uc3QgU3dhbCA9IHJlcXVpcmUoXCJzd2VldGFsZXJ0MlwiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBkKC4uLm1lczogYW55KTogdm9pZCB7XG4gICAgY29uc29sZS5sb2cobWVzKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsKG1lczogc3RyaW5nKSB7XG4gICAgU3dhbC5maXJlKHtcbiAgICAgICAgdGV4dDogbWVzLFxuICAgICAgICB0b2FzdDogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb246IFwidG9wLWVuZFwiLFxuICAgICAgICB0aW1lcjogMyAqIDEwMDAsXG4gICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZVxuICAgIH0pO1xufVxuYXN5bmMgZnVuY3Rpb24gY29uZmlybShtZXM6IHN0cmluZywgb2s6IHN0cmluZywgY2FuY2VsOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBTd2FsLmZpcmUoe1xuICAgICAgICB0ZXh0OiBtZXMsXG4gICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZSxcbiAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IHRydWUsXG4gICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBvayxcbiAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogY2FuY2VsXG4gICAgfSk7XG4gICAgY29uc3QgcmV0OmJvb2xlYW4gPSByZXMudmFsdWU7XG4gICAgcmV0dXJuIHJldDtcbn1cbmV4cG9ydCB2YXIgdG9hc3QgPSB7XG4gICAgbm9ybWFsOiBub3JtYWwsXG4gICAgY29uZmlybTogY29uZmlybVxufVxuZXhwb3J0IGZ1bmN0aW9uIHRvUmdiSGV4KGNvbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCIjXCIgKyBjb2wubWF0Y2goL1xcZCsvZykubWFwKGZ1bmN0aW9uKGEpe3JldHVybiAoXCIwXCIgKyBwYXJzZUludChhKS50b1N0cmluZygxNikpLnNsaWNlKC0yKX0pLmpvaW4oXCJcIik7XG59XG4iLCAiaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBTYXZlRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZGF0YXN0b3JlOiBEcmF3TWluZTtcblxuICAgIHB1YmxpYyBpbml0KGRhdGFzdG9yZTogRHJhd01pbmUpIHtcbiAgICAgICAgdGhpcy5kYXRhc3RvcmUgPSBkYXRhc3RvcmU7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3Qtc2F2ZVwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmRhdGFzdG9yZS5zYXZlKCk7XG4gICAgICAgIFUudG9hc3Qubm9ybWFsKFwic2F2ZWRcIik7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuLi9kYXRhL0RyYXdPdGhlclwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuL1BlbkFjdGlvblwiO1xuaW1wb3J0IHsgU3Ryb2tlLCBQb2ludCwgRHJhdyB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4uL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IERyYXdTdGF0dXMgfSBmcm9tIFwiLi4vZGF0YS9EcmF3U3RhdHVzXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2FkQWN0aW9uIHtcbiAgICBwcml2YXRlIHBhcGVyczoge1xuICAgICAgICBtaW5lOiBQYXBlckVsZW1lbnQsXG4gICAgICAgIG90aGVyOiBQYXBlckVsZW1lbnRcbiAgICB9O1xuICAgIHByaXZhdGUgZGF0YXN0b3Jlczoge1xuICAgICAgICBtaW5lOiBEcmF3TWluZSxcbiAgICAgICAgb3RoZXI6IERyYXdPdGhlclxuICAgIH07XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwcml2YXRlIGRyYXdzdGF0dXM6IERyYXdTdGF0dXM7XG4gICAgcHVibGljIGluaXQocGFwZXJtaW5lOiBQYXBlckVsZW1lbnQsIHBhcGVyb3RoZXI6IFBhcGVyRWxlbWVudCwgZHJhd21pbmU6IERyYXdNaW5lLCBkcmF3b3RoZXI6IERyYXdPdGhlciwgcGVuOiBQZW5BY3Rpb24sIGRyYXdzdGF0dXM6IERyYXdTdGF0dXMpIHtcbiAgICAgICAgdGhpcy5wYXBlcnMgPSB7XG4gICAgICAgICAgICBtaW5lOiBwYXBlcm1pbmUsXG4gICAgICAgICAgICBvdGhlcjogcGFwZXJvdGhlcixcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFzdG9yZXMgPSB7XG4gICAgICAgICAgICBtaW5lOiBkcmF3bWluZSxcbiAgICAgICAgICAgIG90aGVyOiBkcmF3b3RoZXJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZHJhd3N0YXR1cyA9IGRyYXdzdGF0dXM7XG4gICAgICAgIC8vIFUudG9hc3Qubm9ybWFsKFwibm93IGxvYWRpbmcuLi5cIik7XG4gICAgICAgIHRoaXMucHJvYyh0cnVlKTtcbiAgICB9XG4gICAgcHVibGljIGFzeW5jIHByb2MocGVyaW9kaWM6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZHJhd3N0YXR1cy5pc0RyYXdpbmcoKSkge1xuICAgICAgICAgICAgLy8gXHU4QTE4XHU4RkYwXHU0RTJEXHUzMDZBXHUzMDg5XHUzMEM3XHUzMEZDXHUzMEJGXHU2NTc0XHU3NDA2XHUzMDU3XHUzMDZBXHUzMDQ0XG5cbiAgICAgICAgICAgIC8vIFx1MzA3RVx1MzA1QVx1NEVDQVx1MzA2RVx1ODFFQVx1NTIwNlx1MzA2RVx1MzBDN1x1MzBGQ1x1MzBCRlx1MzA5Mlx1NEZERFx1NUI1OFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhc3RvcmVzLm1pbmUuc2F2ZSgpO1xuXG4gICAgICAgICAgICAvLyBcdTRFMDBcdTVFQTZcdThBQURcdTMwN0ZcdThGQkNcdTMwN0ZcdTc2RjRcdTMwNTdcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YXN0b3Jlcy5vdGhlci5sb2FkKCk7XG5cbiAgICAgICAgICAgIC8vIFx1ODFFQVx1NTIwNlx1MzA2RVx1MzBDN1x1MzBGQ1x1MzBCRlx1MzA2Rm90aGVyXHUzMDZCXHU3OUZCXHU1MkQ1XHUzMDU1XHUzMDVCXHUzMDhCXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBhcGVycy5taW5lLmNsZWFyKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFzdG9yZXMubWluZS5jbGVhcigpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWRyYXcodGhpcy5wYXBlcnMub3RoZXIsIHRoaXMuZGF0YXN0b3Jlcy5vdGhlciwgdGhpcy5wZW4pO1xuICAgICAgICAgICAgLy8gVS50b2FzdC5ub3JtYWwoYGxvYWQgJHtzZWN9IHNlYy5gKTtcbiAgICAgICAgICAgIC8vIFUucGQoXCJsb2FkZWQhIVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVyaW9kaWMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYyA9IDM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucHJvYyh0cnVlKSwgc2VjICogMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpcnN0OiBib29sZWFuID0gdHJ1ZTsgLy8gXHU1MjFEXHU1NkRFXHUzMEQ1XHUzMEU5XHUzMEIwXHUzMDAyXHUzMEVEXHUzMEZDXHUzMEM5XHU2NjQyXHUzMDZCXHUzMEQwXHUzMEJGXHUzMDY0XHUzMDRGXHUzMDVGXHUzMDgxXHUzMDAyXG4gICAgcHJpdmF0ZSBhc3luYyByZWRyYXcocGFwZXI6IFBhcGVyRWxlbWVudCwgZGF0YXN0b3JlOiBEcmF3T3RoZXIsIHBlbjogUGVuQWN0aW9uKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGRyYXdzOiBEcmF3W10gPSBkYXRhc3RvcmUuZ2V0RHJhd3MoKTtcblxuICAgICAgICBsZXQgcHJlcG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICBwYXBlci5nZXRDbnYoKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRyYXcgb2YgZHJhd3MpIHtcbiAgICAgICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RWNhbnZhc1x1MzA2RVx1NzJCNlx1NjE0Qlx1MzA5Mlx1MzBBRlx1MzBFRFx1MzBGQ1x1MzBGM1xuICAgICAgICAgICAgY29uc3QgYmtpbWc6IEhUTUxJbWFnZUVsZW1lbnQgPSBhd2FpdCB0aGlzLnRvSW1hZ2UocGFwZXIuZ2V0Q252KCkpO1xuXG4gICAgICAgICAgICAvLyBcdTMwQUZcdTMwRUFcdTMwQTJcdTMwNTdcdTMwNjZcdTRFQ0FcdTU2REVcdTMwNkVcdThBMThcdThGRjBcdTMwOTJcdTY2RjhcdTMwNERcdThGQkNcdTMwN0ZcbiAgICAgICAgICAgIHBhcGVyLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIC8vIFx1NEVDQVx1NTZERVx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1NzUxRlx1NjIxMFxuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlcyA9IGRyYXcuZ2V0U3Ryb2tlcygpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcblxuICAgICAgICAgICAgICAgIGlmIChzLmlzRXJhc2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5jb2xvciA9IHMuY29sb3I7IC8vIFx1ODI3Mlx1NjBDNVx1NTgzMVx1MzA2Rlx1NEY3Rlx1MzA4Rlx1MzA2QVx1MzA0NFx1MzA0Q1x1NUZGNVx1MzA2RVx1NzBCQVx1OEEyRFx1NUI5QVxuICAgICAgICAgICAgICAgICAgICBwZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5vcHQuZXJhc2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBzLmdldFBvaW50cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgcGFwZXIpO1xuICAgICAgICAgICAgICAgICAgICBwcmVwb2ludCA9IHA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gXHU1M0Q2XHUzMDYzXHUzMDY2XHUzMDRBXHUzMDQ0XHUzMDVGY2FudmFzXHUzMDY4XHU5MUNEXHUzMDZEXHU1NDA4XHUzMDhGXHUzMDVCXG4gICAgICAgICAgICBwYXBlci5nZXRDdHgoKS5kcmF3SW1hZ2UoYmtpbWcsIDAsIDAsIGJraW1nLndpZHRoLCBia2ltZy5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICBwYXBlci5nZXRDbnYoKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICB0aGlzLmZpcnN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHRvSW1hZ2UoY252OiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD5jbnYuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZShpbWFnZSk7XG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gKGUpID0+IHJlamVjdChlKTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IGN0eC5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBMb2FkQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9Mb2FkQWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIExvYWRFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBsb2FkOiBMb2FkQWN0aW9uO1xuXG4gICAgcHVibGljIGluaXQobG9hZDogTG9hZEFjdGlvbikge1xuICAgICAgICB0aGlzLmxvYWQgPSBsb2FkO1xuICAgICAgICB0aGlzLmVsZSA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FjdC1sb2FkLW90aGVyLWZvcmNlXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIFUudG9hc3Qubm9ybWFsKFwibm93IGxvYWRpbmdcIik7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZC5wcm9jKGZhbHNlKTtcbiAgICAgICAgVS50b2FzdC5ub3JtYWwoXCJsb2FkZWRcIik7XG4gICAgfVxufVxuIiwgImV4cG9ydCBjbGFzcyBEcmF3Y2FudmFzZXNFbGVtZW50IHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMud3JhcGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZHJhd2NhbnZhc2VzXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbGVtZW50KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcGRpdjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Tm9ybWFsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRkZGMDBcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U2Nyb2xsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDBGRjAwNzdcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RXhwYW5kKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkYwMDAwNzdcIjtcbiAgICB9XG59IiwgImltcG9ydCB7IFRvb2wsIERyYXdFdmVudCB9IGZyb20gXCIuLi91L3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3U3RhdHVzIHtcbiAgICBwcml2YXRlIGV2ZW50OiBEcmF3RXZlbnQ7XG4gICAgcHJpdmF0ZSB0b29sOiBUb29sIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVuZFN0cm9rZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRTdHJva2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBcInVwXCI7XG4gICAgICAgIHRoaXMudG9vbCA9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0U3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICAvLyBcdTY0Q0RcdTRGNUNcdTk1OEJcdTU5Q0JcbiAgICAgICAgdGhpcy5ldmVudCA9IFwiZG93blwiO1xuICAgICAgICB0aGlzLnRvb2wgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUb29sKHRvb2wpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b29sID0gdG9vbDtcbiAgICB9XG4gICAgcHVibGljIGdldFRvb2woKTogVG9vbCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy50b29sO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VuZFN0cm9rZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbm93ID09PSBcInVwXCIgJiYgdGhpcy5ldmVudCAhPT0gXCJ1cFwiO1xuICAgIH1cbiAgICBwdWJsaWMgaXNTdGFydFN0cm9rZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbm93ID09PSBcImRvd25cIjtcbiAgICB9XG4gICAgcHVibGljIGlzU3RhcnRNb3ZlKG5vdzogRHJhd0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFx1MzBDNFx1MzBGQ1x1MzBFQlx1MzA0Q1x1NjcyQVx1NkM3QVx1NUI5QVxuICAgICAgICByZXR1cm4gdGhpcy5pc01vdmUobm93KSAmJiB0aGlzLnRvb2wgPT09IG51bGw7XG4gICAgfVxuICAgIHB1YmxpYyBpc01vdmUobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJtb3ZlXCIgJiYgdGhpcy5ldmVudCA9PT0gXCJkb3duXCI7XG4gICAgfVxuXG4gICAgcHVibGljIGlzRHJhd2luZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFtcImRvd25cIiwgXCJtb3ZlXCJdLmluY2x1ZGVzKHRoaXMuZXZlbnQpO1xuICAgIH1cbn0iLCAiJ3VzZSBzdHJpY3QnXG5tb2R1bGUuZXhwb3J0cyA9IHJmZGNcblxuZnVuY3Rpb24gY29weUJ1ZmZlciAoY3VyKSB7XG4gIGlmIChjdXIgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oY3VyKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBjdXIuY29uc3RydWN0b3IoY3VyLmJ1ZmZlci5zbGljZSgpLCBjdXIuYnl0ZU9mZnNldCwgY3VyLmxlbmd0aClcbn1cblxuZnVuY3Rpb24gcmZkYyAob3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIGlmIChvcHRzLmNpcmNsZXMpIHJldHVybiByZmRjQ2lyY2xlcyhvcHRzKVxuICByZXR1cm4gb3B0cy5wcm90byA/IGNsb25lUHJvdG8gOiBjbG9uZVxuXG4gIGZ1bmN0aW9uIGNsb25lQXJyYXkgKGEsIGZuKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKVxuICAgIHZhciBhMiA9IG5ldyBBcnJheShrZXlzLmxlbmd0aClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrID0ga2V5c1tpXVxuICAgICAgdmFyIGN1ciA9IGFba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgYTJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBhMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgYTJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEyW2tdID0gZm4oY3VyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTJcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lKVxuICAgIGlmIChvIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lKSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgdmFyIG8yID0ge31cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSA9PT0gZmFsc2UpIGNvbnRpbnVlXG4gICAgICB2YXIgY3VyID0gb1trXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBvMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgbzJba10gPSBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICBvMltrXSA9IG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgbzJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8yW2tdID0gY2xvbmUoY3VyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbzJcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lUHJvdG8gKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHJldHVybiBvXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gbmV3IERhdGUobylcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSkgcmV0dXJuIGNsb25lQXJyYXkobywgY2xvbmVQcm90bylcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZVByb3RvKSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZVByb3RvKSlcbiAgICB2YXIgbzIgPSB7fVxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmVQcm90bykpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICBvMltrXSA9IG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lUHJvdG8pKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBvMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbzJba10gPSBjbG9uZVByb3RvKGN1cilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG8yXG4gIH1cbn1cblxuZnVuY3Rpb24gcmZkY0NpcmNsZXMgKG9wdHMpIHtcbiAgdmFyIHJlZnMgPSBbXVxuICB2YXIgcmVmc05ldyA9IFtdXG5cbiAgcmV0dXJuIG9wdHMucHJvdG8gPyBjbG9uZVByb3RvIDogY2xvbmVcblxuICBmdW5jdGlvbiBjbG9uZUFycmF5IChhLCBmbikge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYSlcbiAgICB2YXIgYTIgPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgayA9IGtleXNbaV1cbiAgICAgIHZhciBjdXIgPSBhW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIGEyW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgYTJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIGEyW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaW5kZXggPSByZWZzLmluZGV4T2YoY3VyKVxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgYTJba10gPSByZWZzTmV3W2luZGV4XVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGEyW2tdID0gZm4oY3VyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhMlxuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmUgKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHJldHVybiBvXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gbmV3IERhdGUobylcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSkgcmV0dXJuIGNsb25lQXJyYXkobywgY2xvbmUpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmUpKVxuICAgIGlmIChvIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lKSlcbiAgICB2YXIgbzIgPSB7fVxuICAgIHJlZnMucHVzaChvKVxuICAgIHJlZnNOZXcucHVzaChvMilcbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSA9PT0gZmFsc2UpIGNvbnRpbnVlXG4gICAgICB2YXIgY3VyID0gb1trXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBvMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgbzJba10gPSBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICBvMltrXSA9IG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgbzJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gcmVmcy5pbmRleE9mKGN1cilcbiAgICAgICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICAgICAgbzJba10gPSByZWZzTmV3W2ldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbzJba10gPSBjbG9uZShjdXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVmcy5wb3AoKVxuICAgIHJlZnNOZXcucG9wKClcbiAgICByZXR1cm4gbzJcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lUHJvdG8gKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHJldHVybiBvXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gbmV3IERhdGUobylcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSkgcmV0dXJuIGNsb25lQXJyYXkobywgY2xvbmVQcm90bylcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZVByb3RvKSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZVByb3RvKSlcbiAgICB2YXIgbzIgPSB7fVxuICAgIHJlZnMucHVzaChvKVxuICAgIHJlZnNOZXcucHVzaChvMilcbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIHZhciBjdXIgPSBvW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIG8yW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgbzJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBvMltrXSA9IG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lUHJvdG8pKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgbzJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gcmVmcy5pbmRleE9mKGN1cilcbiAgICAgICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICAgICAgbzJba10gPSByZWZzTmV3W2ldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbzJba10gPSBjbG9uZVByb3RvKGN1cilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWZzLnBvcCgpXG4gICAgcmVmc05ldy5wb3AoKVxuICAgIHJldHVybiBvMlxuICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHJmZGMgZnJvbSBcInJmZGNcIjtcblxuZXhwb3J0IGNsYXNzIFBlbkFjdGlvbiB7XG4gICAgcHVibGljIHJlYWRvbmx5IG9wdCA9IHtcbiAgICAgICAgY29sb3I6IDxzdHJpbmc+XCJcIixcbiAgICAgICAgZXJhc2VyOiA8Ym9vbGVhbj5mYWxzZSxcbiAgICB9XG5cbiAgICBwcml2YXRlIG9wdGJrOiBhbnk7XG4gICAgcHJpdmF0ZSBjbG9uZSA9IHJmZGMoKTtcblxuICAgIHB1YmxpYyBpbml0KGNvbG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vcHQuZXJhc2VyID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3B0LmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMub3B0YmsgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmVwOiBQb2ludCB8IG51bGwsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHByZSA9IHByZXA7XG4gICAgICAgIGlmIChwcmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gXHU1MjREXHU1NkRFXHUzMDZFXHU3MEI5XHUzMDRDXHUzMDZBXHUzMDUxXHUzMDhDXHUzMDcwXHU0RUNBXHU1NkRFXHUzMDZFXHU3MEI5XG4gICAgICAgICAgICBwcmUgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3R4ID0gcGFwZXIuZ2V0Q3R4KCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0LmVyYXNlcikge1xuICAgICAgICAgICAgdGhpcy5lcmFzZSh4LCB5LCBwcmUsIGN0eClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGVuKHgsIHksIHByZSwgY3R4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHBlbih4OiBudW1iZXIsIHk6IG51bWJlciwgcHJlOiBQb2ludCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICAgICAgY3R4LnNhdmUoKVxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5vcHQuY29sb3I7XG4gICAgICAgIGN0eC5tb3ZlVG8ocHJlLngsIHByZS55KTtcbiAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgICBwcml2YXRlIGVyYXNlKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmU6IFBvaW50LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAvLyBcdTc5RkJcdTUyRDVcdThERERcdTk2RTJcdTMwNjdcdTZEODhcdTMwNTlcdTdCQzRcdTU2RjJcdTMwOTJcdThBQkZcdTY1NzRcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHggLSBwcmUueCkgKyBNYXRoLmFicyh5IC0gcHJlLnkpO1xuICAgICAgICBjdHguY2xlYXJSZWN0KHggLSBkLCB5IC0gZCwgZCAqIDIsIGQgKiAyKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZU9wdCgpIHtcbiAgICAgICAgdGhpcy5vcHRiayA9IHRoaXMuY2xvbmUodGhpcy5vcHQpO1xuICAgICAgICAvLyBVLnBkKHRoaXMub3B0YmspO1xuICAgIH1cbiAgICBwdWJsaWMgcmVzdG9yZU9wdCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaWR4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMub3B0YmspKSB7XG4gICAgICAgICAgICB0aGlzLm9wdFtpZHhdID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2UgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmRvRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZHJhdzogRHJhd01pbmU7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHVibGljIGluaXQocGFwZXI6IFBhcGVyRWxlbWVudCwgZHJhdzogRHJhd01pbmUsIHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtdW5kb1wiKTtcblxuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cbiAgICBwcml2YXRlIHByb2MoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NjcwMFx1NjVCMFx1MzA2RXN0cm9rZVx1MzA5Mlx1NzgzNFx1NjhDNFx1MzA1N1x1MzA2Nlx1MzAwMVx1MzA1RFx1MzA2RVx1NTE4NVx1NUJCOVx1MzA5Mlx1NTNENlx1NUY5N1xuICAgICAgICBjb25zdCBzdHJva2VzOiBTdHJva2VbXSA9IHRoaXMuZHJhdy51bmRvKCk7XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlx1MzAwMVx1OEEyRFx1NUI5QVx1MzA5Mlx1NEZERFx1NUI1OFxuICAgICAgICB0aGlzLnBhcGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucGVuLnNhdmVPcHQoKTtcblxuICAgICAgICAvLyBcdTY1MzlcdTMwODFcdTMwNjZcdTYzQ0ZcdTc1M0JcbiAgICAgICAgbGV0IHByZXBvaW50OiBQb2ludCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBpZiAocy5pc0VyYXNlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gcy5jb2xvcjsgLy8gXHU4MjcyXHU2MEM1XHU1ODMxXHUzMDZGXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDRDXHU1RkY1XHUzMDZFXHU3MEJBXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHMuZ2V0UG9pbnRzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgdGhpcy5wYXBlcik7XG4gICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcG9pbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHU4QTJEXHU1QjlBXHUzMDkyXHU1RkE5XHU1RTMwXG4gICAgICAgIHRoaXMucGVuLnJlc3RvcmVPcHQoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvRHJhd2NhbnZhc2VzRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9ab29tRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tU2Nyb2xsQWN0aW9uIHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tRWxlbWVudDtcbiAgICBwcml2YXRlIHByZXA6IFBvaW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBub3d6b29tOiBudW1iZXIgPSAxO1xuICAgIHByaXZhdGUgb3JndzogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIG9yZ2g6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IFpPT01fTUFYOiBudW1iZXIgPSAyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgWk9PTV9NSU46IG51bWJlciA9IDAuNTtcblxuICAgIHB1YmxpYyBpbml0KHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQsIHpvb21zY3JvbGw6IFpvb21FbGVtZW50KSB7XG4gICAgICAgIHRoaXMud3JhcGRpdiA9IHdyYXBkaXY7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMubm93em9vbSA9IDE7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbC5zaG93KHRoaXMubm93em9vbSk7XG4gICAgICAgIGNvbnN0IGVsZTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gICAgICAgIHRoaXMub3JndyA9IHBhcnNlSW50KGVsZS5zdHlsZS53aWR0aC5yZXBsYWNlKFwicHhcIiwgXCJcIikpO1xuICAgICAgICB0aGlzLm9yZ2ggPSBwYXJzZUludChlbGUuc3R5bGUuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXRQb2ludCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnByZXAgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxuICAgIHB1YmxpYyBzY3JvbGwoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlKCkgfHwgIXRoaXMucHJlcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFx1NURFRVx1NTIwNlx1MzA2RVx1OEEwOFx1N0I5N1xuICAgICAgICBjb25zdCBkeCA9ICh0aGlzLnByZXAueCAtIHgpICogdGhpcy5ub3d6b29tICogNztcbiAgICAgICAgY29uc3QgZHkgPSAodGhpcy5wcmVwLnkgLSB5KSAqIHRoaXMubm93em9vbSAqIDc7XG5cbiAgICAgICAgLy8gXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXHU1QjlGXHU4ODRDXG4gICAgICAgIGNvbnN0IG54ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICBjb25zdCBueSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgd2luZG93LnNjcm9sbCh7XG4gICAgICAgICAgICBsZWZ0OiBueCArIGR4LFxuICAgICAgICAgICAgdG9wOiBueSArIGR5LFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVS5wZChgc2Nyb2xsIDogJHt0aGlzLnByZXAueH0tJHt4fT0ke2R4fSwgJHt0aGlzLnByZXAueX0tJHt5fT0ke2R5fWApO1xuXG4gICAgICAgIC8vIFx1MzBERFx1MzBBNFx1MzBGM1x1MzBDOFx1MzA2RVx1NjZGNFx1NjVCMFxuICAgICAgICB0aGlzLnByZXAueCA9IHg7XG4gICAgICAgIHRoaXMucHJlcC55ID0geTtcbiAgICB9XG4gICAgcHVibGljIHpvb21kcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5wcmVwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZHkgPSB0aGlzLnByZXAueSAtIHk7XG4gICAgICAgIC8vIFx1NzlGQlx1NTJENVx1NURFRVx1NTIwNlx1MzA5Mnpvb21cdTZCRDRcdTczODdcdTMwNkJcdTU5MDlcdTYzREJcdTMwMDJcdTczRkVcdTU3MjhcdTMwNkVcdTZCRDRcdTczODdcdTMwNkJcdTMwODhcdTMwNjNcdTMwNjZcdTVERUVcdTUyMDZcdTkxQ0ZcdTMwOTJcdThBQkZcdTY1NzRcdUZGMDhcdTU5MjdcdTMwNERcdTMwNDRcdTMwNjhcdTU5MjdcdTMwNERcdTMwNDRcdUZGMDlcbiAgICAgICAgY29uc3QgZGlmZiA9IGR5ICogMC4wMDA1ICogdGhpcy5ub3d6b29tO1xuICAgICAgICB0aGlzLnpvb21wcm9jKGRpZmYpO1xuICAgICAgICAvLyBcdTMwRERcdTMwQTRcdTMwRjNcdTMwQzhcdTMwNkVcdTY2RjRcdTY1QjBcbiAgICAgICAgdGhpcy5wcmVwLnggPSB4O1xuICAgICAgICB0aGlzLnByZXAueSA9IHk7XG4gICAgfVxuICAgIHB1YmxpYyB6b29tcHJvYyhkaWZmOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ub3d6b29tICs9IGRpZmY7XG4gICAgICAgIC8vIFx1N0JDNFx1NTZGMlx1ODhEQ1x1NkI2M1xuICAgICAgICB0aGlzLm5vd3pvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLm5vd3pvb20sIHRoaXMuWk9PTV9NSU4pLCB0aGlzLlpPT01fTUFYKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgICAgICAgZWxlLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3RoaXMubm93em9vbX0pYDtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsLnNob3codGhpcy5ub3d6b29tKTtcbiAgICAgICAgZWxlLnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcmd3ICogdGhpcy5ub3d6b29tfXB4YDtcbiAgICAgICAgZWxlLnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3JnaCAqIHRoaXMubm93em9vbX1weGA7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRab29tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3pvb207XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmV0aW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgaWdub3JlKCkge1xuICAgICAgICBjb25zdCBuOiBudW1iZXIgPSBEYXRlLm5vdygpO1xuICAgICAgICBsZXQgcmV0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKG4gLSB0aGlzLnByZXRpbWUgPiAwLjAxICogMTAwMCkge1xuICAgICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByZXRpbWUgPSBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFRvdWNoU2Vuc29yIH0gZnJvbSBcIi4uL3NlbnNvci9Ub3VjaFNlbnNvclwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgWm9vbUVsZW1lbnQge1xuICAgIHByaXZhdGUgbGJsOiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBidHA6IEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHByaXZhdGUgYnRtOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG5cbiAgICBwdWJsaWMgaW5pdCh6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMubGJsID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5idHAgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN6b29tLXBsdXNcIik7XG4gICAgICAgIHRoaXMuYnRtID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1taW51c1wiKTtcblxuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKDAuMSkpO1xuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoMC4xKSk7XG4gICAgICAgIHRoaXMuYnRtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgICAgICB0aGlzLmJ0bS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgIH1cbiAgICBwdWJsaWMgbGFiZWwoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGJsO1xuICAgIH1cbiAgICBwdWJsaWMgc2hvdyhub3d6b29tOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYmwuaW5uZXJIVE1MID0gYCR7TWF0aC5yb3VuZChub3d6b29tICogMTAwKS50b1N0cmluZygpfSVgO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIEVyYXNlckVsZW1lbnQge1xuICAgIHByaXZhdGUgZWxlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtZXJhc2VyXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgfVxuXG4gICAgcHVibGljIHByb2MoKSB7XG4gICAgICAgIHRoaXMucGVuLm9wdC5lcmFzZXIgPSAhdGhpcy5wZW4ub3B0LmVyYXNlcjtcbiAgICAgICAgY29uc3QgZW5hYmxlID0gXCJoYXMtYmFja2dyb3VuZC1wcmltYXJ5XCI7XG4gICAgICAgIGNvbnN0IGRpc2FibGUgPSBcImhhcy1iYWNrZ3JvdW5kLWxpZ2h0XCI7XG4gICAgICAgIC8vIFx1ODg2OFx1NzkzQVx1MzA5Mlx1NjZGNFx1NjVCMFxuICAgICAgICBpZiAodGhpcy5wZW4ub3B0LmVyYXNlcikge1xuICAgICAgICAgICAgdGhpcy5lbGUuY2xhc3NMaXN0LnJlcGxhY2UoZGlzYWJsZSwgZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLmNsYXNzTGlzdC5yZXBsYWNlKGVuYWJsZSwgZGlzYWJsZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5leHBvcnQgY2xhc3MgQ29sb3JFbGVtZW50IHtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uXG5cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uLCBjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGV2OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IDxIVE1MRWxlbWVudD5ldi50YXJnZXQ7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChgY2hhbmdlIHRvICR7Y29sb3J9YCk7XG4gICAgICAgICAgICAvLyB0aGlzLnBlbi5vcHQuY29sb3IgPSBVLnRvUmdiSGV4KGNvbG9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wZW4tY29sb3JcIikuZm9yRWFjaCgoZWxlOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhY2tFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkcmF3OiBEcmF3TWluZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbGUgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtYmFja1wiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+IHRoaXMucHJvYygpKTtcbiAgICB9XG4gICAgcHVibGljIGluaXQoZHJhdzogRHJhd01pbmUpIHtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIXRoaXMuZHJhdy5pc1NhdmVkKCkpIHtcbiAgICAgICAgICAgIFUudG9hc3Qubm9ybWFsKFwiXHU0RkREXHU1QjU4XHUzMDU3XHUzMDY2XHU2MjNCXHUzMDhBXHUzMDdFXHUzMDU5XCIpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRyYXcuc2F2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9cIjtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERldmljZSwgVG9vbCB9IGZyb20gXCIuL3UvdHlwZXNcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuL3UvdVwiO1xuaW1wb3J0IHsgTW91c2VTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvTW91c2VTZW5zb3JcIjtcbmltcG9ydCB7IFBvaW50ZXJTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvUG9pbnRlclNlbnNvclwiO1xuaW1wb3J0IHsgVG91Y2hTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFNhdmVFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9TYXZlRWxlbWVudFwiO1xuaW1wb3J0IHsgTG9hZEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9Mb2FkQWN0aW9uXCI7XG5pbXBvcnQgeyBMb2FkRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvTG9hZEVsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdjYW52YXNlc0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdTdGF0dXMgfSBmcm9tIFwiLi9kYXRhL0RyYXdTdGF0dXNcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCB7IFVuZG9FbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9VbmRvRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uXCI7XG5pbXBvcnQgeyBab29tRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvWm9vbUVsZW1lbnRcIjtcbmltcG9ydCB7IEVyYXNlckVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0VyYXNlckVsZW1lbnRcIjtcbmltcG9ydCB7IENvbG9yRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvQ29sb3JFbGVtZW50XCI7XG5pbXBvcnQgeyBCYWNrRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvQmFja0VsZW1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIERyYXdFdmVudEhhbmRsZXIge1xuICAgIHByaXZhdGUgcGFwZXJfaWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIG5vd3NlbnNvcjogRGV2aWNlIHwgbnVsbDsgLy8gXHUzMEJGXHUzMEMzXHUzMEMxXHUzMDAxXHUzMEREXHUzMEE0XHUzMEYzXHUzMEJGXHU3QjQ5XHUzMDAxXHUzMDdFXHUzMDY4XHUzMDgxXHUzMDY2XHU4OTA3XHU2NTcwXHUzMDZFXHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHUzMDkyXHU2OTFDXHU3N0U1XHUzMDU3XHUzMDVGXHU1ODM0XHU1NDA4XHUzMDZCXHU1MDk5XHUzMDQ4XHUzMDY2XHUzMDAyXG4gICAgcHJpdmF0ZSBzdGF0dXMgPSB7XG4gICAgICAgIGRyYXc6IG5ldyBEcmF3U3RhdHVzKCksXG4gICAgfTtcbiAgICBwcml2YXRlIGVsZW1lbnQgPSB7XG4gICAgICAgIHdyYXBkaXY6IG5ldyBEcmF3Y2FudmFzZXNFbGVtZW50KCksXG4gICAgICAgIHpvb21zY3JvbGw6IG5ldyBab29tRWxlbWVudCgpLFxuICAgICAgICBzYXZlOiBuZXcgU2F2ZUVsZW1lbnQoKSxcbiAgICAgICAgZXJhc2VyOiBuZXcgRXJhc2VyRWxlbWVudCgpLFxuICAgICAgICBjb2xvcjogbmV3IENvbG9yRWxlbWVudCgpLFxuICAgICAgICB1bmRvOiBuZXcgVW5kb0VsZW1lbnQoKSxcbiAgICAgICAgYmFjazogbmV3IEJhY2tFbGVtZW50KCksXG4gICAgICAgIGxvYWQ6IG5ldyBMb2FkRWxlbWVudCgpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBhY3Rpb24gPSB7XG4gICAgICAgIGxvYWQ6IG5ldyBMb2FkQWN0aW9uKCksXG4gICAgICAgIHpvb21zY3JvbGw6IG5ldyBab29tU2Nyb2xsQWN0aW9uKCksXG4gICAgfTtcblxuICAgIHByaXZhdGUgbWluZSA9IHtcbiAgICAgICAgcGFwZXI6IFBhcGVyRWxlbWVudC5tYWtlTWluZSgpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd01pbmUoKSxcbiAgICAgICAgcGVuOiBuZXcgUGVuQWN0aW9uKCksXG4gICAgfTtcbiAgICBwcml2YXRlIG90aGVyID0ge1xuICAgICAgICBwYXBlcjogUGFwZXJFbGVtZW50Lm1ha2VPdGhlcigpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd090aGVyKCksXG4gICAgICAgIHBlbjogbmV3IFBlbkFjdGlvbigpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBkZXZpY2UgPSB7XG4gICAgICAgIG1vdXNlOiBuZXcgTW91c2VTZW5zb3IoKSxcbiAgICAgICAgcG9pbnRlcjogbmV3IFBvaW50ZXJTZW5zb3IoKSxcbiAgICAgICAgdG91Y2g6IG5ldyBUb3VjaFNlbnNvcigpLFxuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMubm93c2Vuc29yID0gbnVsbDtcblxuICAgICAgICBjb25zdCBzZCA9IHRoaXMubG9hZFNlcnZlckRhdGEoKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBzZFtcIiNzZC1jb2xvclwiXTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuem9vbXNjcm9sbC5pbml0KHRoaXMuYWN0aW9uLnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2F2ZS5pbml0KHRoaXMubWluZS5kcmF3KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNvbG9yLmluaXQodGhpcy5taW5lLnBlbiwgY29sb3IpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZXJhc2VyLmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC51bmRvLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5iYWNrLmluaXQodGhpcy5taW5lLmRyYXcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQubG9hZC5pbml0KHRoaXMuYWN0aW9uLmxvYWQpO1xuXG4gICAgICAgIHRoaXMuZGV2aWNlLm1vdXNlLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5kZXZpY2UucG9pbnRlci5pbml0KHRoaXMsIHRoaXMubWluZS5wYXBlcik7XG4gICAgICAgIHRoaXMuZGV2aWNlLnRvdWNoLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyLCB0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTtcblxuICAgICAgICB0aGlzLmFjdGlvbi5sb2FkLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm90aGVyLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5vdGhlci5kcmF3LCB0aGlzLm90aGVyLnBlbiwgdGhpcy5zdGF0dXMuZHJhdyk7XG4gICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuaW5pdCh0aGlzLmVsZW1lbnQud3JhcGRpdiwgdGhpcy5lbGVtZW50Lnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLm1pbmUucGVuLmluaXQoY29sb3IpO1xuXG4gICAgICAgIHRoaXMubWluZS5kcmF3LmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgfVxuICAgIHByaXZhdGUgbG9hZFNlcnZlckRhdGEoKTogYW55W10ge1xuICAgICAgICBjb25zdCBpZHM6IHN0cmluZ1tdID0gW1xuICAgICAgICAgICAgXCIjc2QtY29sb3JcIlxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgICAgIHJldFtpZF0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKT8uaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRvd24oZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gcC55O1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tZG93bigke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBkZXY7XG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc3RhcnRTdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZShkZXY6IERldmljZSwgZTogRXZlbnQsIHA6IFBvaW50KTogdm9pZCB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gcC54O1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBwLnk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS1tb3ZlKCR7eH0sJHt5fSk9JHt0aGlzLm5vd3NlbnNvcn1gKTtcblxuICAgICAgICAvLyBcdTcxMjFcdTg5OTZcdTMwNTlcdTMwOEJcdTY3NjFcdTRFRjZcbiAgICAgICAgaWYgKHRoaXMubm93c2Vuc29yID09PSBudWxsIC8vIFx1MzBDN1x1MzBEMFx1MzBBNFx1MzBCOVx1NjcyQVx1NkM3QVx1NUI5QVx1MzA2QVx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICAgICAgfHwgdGhpcy5ub3dzZW5zb3IgIT09IGRldiAvLyBcdTkwNTVcdTMwNDZcdTMwQzdcdTMwRDBcdTMwQTRcdTMwQjlcdTMwNkVcdTMwQTRcdTMwRDlcdTMwRjNcdTMwQzhcdTMwNkFcdTMwNkVcdTMwNjdcdTcxMjFcdTg5OTZcbiAgICAgICAgICAgIC8vIFx1NTJENVx1MzA0NFx1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc2V0VG9vbChcInBlblwiKTtcblxuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkVcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNkJcdTVGRENcdTMwNThcdTMwNjZcdTUxRTZcdTc0MDZcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXR1cy5kcmF3LmdldFRvb2woKSkge1xuICAgICAgICAgICAgY2FzZSBcInBlblwiOlxuICAgICAgICAgICAgICAgIC8vIFx1NTM1OFx1NjJCQ1x1MzA1N1x1NzlGQlx1NTJENVx1RkYxRFx1OEExOFx1OEZGMFxuICAgICAgICAgICAgICAgIGNvbnN0IHA6IFBvaW50IHwgbnVsbCA9IHRoaXMubWluZS5kcmF3Lmxhc3RQb2ludCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWluZS5wZW4ucHJvYyh4LCB5LCBwLCB0aGlzLm1pbmUucGFwZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1pbmUucGVuLm9wdC5jb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmUuZHJhdy5wdXNoUG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiem9vbVwiOlxuICAgICAgICAgICAgICAgIC8vIFx1MzA1NVx1MzA4OVx1MzA2Qlx1OTU3N1x1NjJCQ1x1MzA1N1x1RkYxRFx1NjJFMVx1NTkyN1x1N0UyRVx1NUMwRlxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuem9vbWRyYWcoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXAoZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCkge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBwLng7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS11cCgke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgLy8gMVx1MzBCOVx1MzBDOFx1MzBFRFx1MzBGQ1x1MzBBRlx1N0Q0Mlx1MzA4Rlx1MzA2M1x1MzA1Rlx1MzA2RVx1MzA2N1x1N0Q0Mlx1NEU4NlxuICAgICAgICB0aGlzLnN0YXR1cy5kcmF3LmVuZFN0cm9rZSgpO1xuICAgICAgICB0aGlzLm1pbmUuZHJhdy5lbmRTdHJva2UoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LndyYXBkaXYuc2V0Tm9ybWFsKCk7XG4gICAgICAgIHRoaXMubm93c2Vuc29yID0gbnVsbDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd0V2ZW50SGFuZGxlciB9IGZyb20gXCIuL0RyYXdFdmVudEhhbmRsZXJcIjtcblxuY29uc3QgYnVsbWFOYXZEcm9wID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5lLnRhcmdldDtcbiAgICB0YXJnZXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiKTtcbn1cbmNvbnN0IGluaXRCdWxtYU5hdkRyb3AgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wZG93biAuZHJvcGRvd24tdHJpZ2dlciBhXCIpLmZvckVhY2gobmF2ID0+IHtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidWxtYU5hdkRyb3ApO1xuICAgICAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGJ1bG1hTmF2RHJvcCk7XG4gICAgfSk7XG59O1xuLy8gY29uc3QgYnVsbWFOYXZEcm9wID0gKGU6IEV2ZW50KSA9PiB7XG4vLyAgICAgY29uc3QgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5lLnRhcmdldDtcbi8vICAgICB0YXJnZXQucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiKTtcbi8vIH1cbi8vIGNvbnN0IGluaXRCdWxtYU5hdkRyb3AgPSAoKSA9PiB7XG4vLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oYXMtZHJvcGRvd24gLm5hdmJhci1saW5rXCIpLmZvckVhY2gobmF2ID0+IHtcbi8vICAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBidWxtYU5hdkRyb3ApO1xuLy8gICAgICAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGJ1bG1hTmF2RHJvcCk7XG4vLyAgICAgfSk7XG4vLyB9O1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkcmF3Y2FudmFzZXNcIikpIHtcbiAgICAgICAgY29uc3Qgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIgPSBuZXcgRHJhd0V2ZW50SGFuZGxlcigpO1xuICAgICAgICBzZW5zZS5pbml0KCk7XG4gICAgfVxuICAgIGNvbnN0IGJvZHk6IEhUTUxCb2R5RWxlbWVudCA9IDxIVE1MQm9keUVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbiAgICAvLyBpb3NcdTMwNkVcdTMwNjhcdTMwNERcdTMwNkVcdTMwRDRcdTMwRjNcdTMwQzFcdTMwODRcdTMwQzBcdTMwRDZcdTMwRUJcdTMwQUZcdTMwRUFcdTMwQzNcdTMwQUZcdTMwNkJcdTMwODhcdTMwOEJcdTYyRTFcdTU5MjdcdTMwOTJcdTcxMjFcdTUyQjlcdTUzMTZcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9LCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gICAgaW5pdEJ1bG1hTmF2RHJvcCgpO1xufSk7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUNhO0FBRGI7QUFBQTtBQUNPLE1BQU0sZUFBTixNQUFtQjtBQUFBLFFBSXRCLE9BQWMsV0FBeUI7QUFDbkMsaUJBQU8sSUFBSSxhQUFhLFdBQVc7QUFBQSxRQUN2QztBQUFBLFFBQ0EsT0FBYyxZQUEwQjtBQUNwQyxpQkFBTyxJQUFJLGFBQWEsY0FBYztBQUFBLFFBQzFDO0FBQUEsUUFDUSxZQUFZLFVBQWtCO0FBQ2xDLGVBQUssTUFBTSxTQUFTLGNBQWMsUUFBUTtBQUMxQyxlQUFLLE1BQU0sS0FBSyxJQUFJLFdBQVcsSUFBSTtBQUFBLFFBQ3ZDO0FBQUEsUUFFTyxTQUFtQztBQUN0QyxpQkFBTyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUNPLFNBQTRCO0FBQy9CLGlCQUFPLEtBQUs7QUFBQSxRQUNoQjtBQUFBLFFBQ08sUUFBYztBQUNqQixnQkFBTSxJQUFZLEtBQUssSUFBSTtBQUMzQixnQkFBTSxJQUFZLEtBQUssSUFBSTtBQUMzQixlQUFLLElBQUksVUFBVSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQUEsUUFDakM7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDM0JBLE1BQWEsTUFpREEs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
