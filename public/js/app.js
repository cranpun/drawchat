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
          this.s = [];
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
        load() {
          return __async(this, null, function* () {
            try {
              const url = `/api/draw/${this.paper_id}/mine/${this.user_id === null ? 0 : this.user_id}`;
              const postdata = new FormData();
              postdata.append("json_draw", this.draw.json());
              postdata.append("user_id", this.user_id);
              const option = {
                method: "POST",
                body: postdata
              };
              const response = yield fetch(url, option);
              const res_load = JSON.parse(yield response.text());
              let strokes = [];
              for (const d of res_load.data) {
                const obj = JSON.parse(d.json_draw);
                strokes = strokes.concat(obj);
              }
              this.draw.parse(strokes);
            } catch (error) {
              console.error(error);
            }
          });
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
            const url = `/api/draw/${this.paper_id}/other/${this.user_id === null ? 0 : this.user_id}`;
            const response = yield fetch(url);
            const text = yield response.text();
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
        toast: false,
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
        init(paper, datastore, pen) {
          this.paper = paper;
          this.datastore = datastore;
          this.pen = pen;
          this.proc();
        }
        proc() {
          return __async(this, null, function* () {
            const sec = 3;
            yield this.datastore.load();
            yield this.redraw(this.paper, this.datastore, this.pen);
            setTimeout(() => this.proc(), sec * 1e3);
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
      };
    }
  });

  // resources/ts/data/LongpressStatus.ts
  var _LongpressStatus, LongpressStatus;
  var init_LongpressStatus = __esm({
    "resources/ts/data/LongpressStatus.ts"() {
      init_Draw();
      _LongpressStatus = class {
        constructor() {
          this.timeoutids = [];
          this.clear();
        }
        clear() {
          this.time = 0;
          this.pos = null;
          let tid = null;
          while (tid = this.timeoutids.pop()) {
            window.clearTimeout(tid);
          }
        }
        end() {
          if (this.isStart() === false) {
            return null;
          }
          const now = Date.now();
          const diff = now - this.time;
          this.clear();
          if (diff < _LongpressStatus.SEC_SCROLL) {
            return "pen";
          } else if (diff < _LongpressStatus.SEC_EXPAND) {
            return "scroll";
          } else if (diff >= _LongpressStatus.SEC_EXPAND) {
            return "zoom";
          } else {
            return null;
          }
        }
        start(wrapdiv, x, y, zoomscroll) {
          if (this.isStart()) {
            return;
          }
          this.time = Date.now();
          this.pos = new Point(x, y);
          zoomscroll.setPoint(x, y);
          this.timeoutids.push(window.setTimeout(() => {
            wrapdiv.setScroll();
            this.timeoutids.push(window.setTimeout(() => {
              wrapdiv.setExpand();
            }, _LongpressStatus.SEC_EXPAND));
          }, _LongpressStatus.SEC_SCROLL));
        }
        isSamePoint(x, y) {
          if (this.pos === null) {
            return false;
          }
          const ret = this.pos.isSame(x, y);
          return ret;
        }
        isStart() {
          return this.timeoutids.length > 0;
        }
      };
      LongpressStatus = _LongpressStatus;
      LongpressStatus.SEC_SCROLL = 0.2 * 1e3;
      LongpressStatus.SEC_EXPAND = 1 * 1e3;
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
          this.ZOOM_MAX = 1;
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
          if (this.ignore()) {
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
          document.querySelectorAll(".pen-color").forEach((ele) => {
            ele.addEventListener("click", (ev) => {
              const item = ev.target;
              const color2 = item.style.backgroundColor;
              this.pen.opt.color = color2;
              toast.normal(`change to ${color2}`);
            });
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
              if (yield toast.confirm("\u4FDD\u5B58\u3057\u307E\u3059\u304B\uFF1F", "\u4FDD\u5B58\u3057\u3066\u623B\u308B", "\u7834\u68C4\u3057\u3066\u623B\u308B")) {
                yield this.draw.save();
                pd("ok");
              } else {
                pd("cancel");
              }
            } else {
              pd("no content");
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
      init_DrawcanvasesElement();
      init_DrawStatus();
      init_LongpressStatus();
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
            draw: new DrawStatus(),
            longpress: new LongpressStatus()
          };
          this.element = {
            wrapdiv: new DrawcanvasesElement(),
            zoomscroll: new ZoomElement(),
            save: new SaveElement(),
            eraser: new EraserElement(),
            color: new ColorElement(),
            undo: new UndoElement(),
            back: new BackElement()
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
          this.device.mouse.init(this, this.mine.paper);
          this.device.pointer.init(this, this.mine.paper);
          this.device.touch.init(this, this.mine.paper, this.action.zoomscroll);
          this.action.load.init(this.other.paper, this.other.draw, this.other.pen);
          this.action.zoomscroll.init(this.element.wrapdiv, this.element.zoomscroll);
          this.mine.pen.init(color);
          this.mine.draw.init(this.mine.pen);
        }
        loadServerData() {
          const ids = [
            "#sd-color"
          ];
          const ret = [];
          for (const id of ids) {
            ret[id] = document.querySelector(id).innerHTML;
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
          this.status.longpress.start(this.element.wrapdiv, x, y, this.action.zoomscroll);
        }
        move(dev, e, p) {
          e.preventDefault();
          const x = p.x;
          const y = p.y;
          if (this.nowsensor === null || this.nowsensor !== dev || this.status.longpress.isSamePoint(x, y)) {
            return;
          }
          if (this.status.longpress.isStart()) {
            const tool = this.status.longpress.end();
            this.status.draw.setTool(tool);
          }
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
          switch (this.status.draw.getTool()) {
            case "scroll":
              this.action.zoomscroll.scroll(x, y);
              break;
          }
          this.status.draw.endStroke();
          this.mine.draw.endStroke();
          this.element.wrapdiv.setNormal();
          this.status.longpress.end();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvUGFwZXJFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9kYXRhL0RyYXcudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd01pbmUudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd090aGVyLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvTW91c2VTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL3NlbnNvci9Qb2ludGVyU2Vuc29yLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvVG91Y2hTZW5zb3IudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy91L3UudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvU2F2ZUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9Mb2FkQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd1N0YXR1cy50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZGF0YS9Mb25ncHJlc3NTdGF0dXMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JmZGMvaW5kZXguanMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9QZW5BY3Rpb24udHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvVW5kb0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L1pvb21FbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0VyYXNlckVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvQ29sb3JFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0JhY2tFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9EcmF3RXZlbnRIYW5kbGVyLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9hcHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlxuZXhwb3J0IGNsYXNzIFBhcGVyRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBjbnY6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBwdWJsaWMgc3RhdGljIG1ha2VNaW5lKCk6IFBhcGVyRWxlbWVudCB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXJFbGVtZW50KFwiI215Y2FudmFzXCIpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIG1ha2VPdGhlcigpOiBQYXBlckVsZW1lbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBhcGVyRWxlbWVudChcIiNvdGhlcmNhbnZhc1wiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihzZWxlY3Rvcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY252ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jbnYuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDdHgoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0Q252KCk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY252O1xuICAgIH1cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHc6IG51bWJlciA9IHRoaXMuY252LndpZHRoO1xuICAgICAgICBjb25zdCBoOiBudW1iZXIgPSB0aGlzLmNudi5oZWlnaHQ7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB3LCBoKTtcbiAgICB9XG59XG4iLCAiZXhwb3J0IGNsYXNzIERyYXcge1xuICAgIHByaXZhdGUgdXNlcl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgczogU3Ryb2tlW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucyA9IFtdO1xuICAgIH1cbiAgICBwdWJsaWMgcHVzaChwOiBTdHJva2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zLnB1c2gocCk7XG4gICAgfVxuICAgIHB1YmxpYyBwb3AoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJldDogU3Ryb2tlID0gdGhpcy5zLnBvcCgpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgcGVlaygpOiBTdHJva2UgfCBudWxsIHtcbiAgICAgICAgY29uc3QgcmV0OiBTdHJva2UgPSB0aGlzLnMubGVuZ3RoID4gMCA/IHRoaXMuc1t0aGlzLnMubGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0U3Ryb2tlcygpOiBTdHJva2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnM7XG4gICAgfVxuICAgIHB1YmxpYyBsYXN0U3Ryb2tlcygpOiBTdHJva2UgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zW3RoaXMucy5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMganNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnMpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHAuanNvbigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYFske3JldC5qb2luKFwiLFwiKX1dYDtcbiAgICB9XG4gICAgcHVibGljIHBhcnNlKHN0cm9rZXM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMucyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygc3Ryb2tlcykge1xuICAgICAgICAgICAgY29uc3QgdG1wID0gbmV3IFN0cm9rZSgpO1xuICAgICAgICAgICAgdG1wLnBhcnNlKHNbMF0sIHNbMV0pO1xuICAgICAgICAgICAgdGhpcy5zLnB1c2godG1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnMubGVuZ3RoO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdHJva2Uge1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVEtfRVJBU0VSID0gXCJlXCI7XG5cbiAgICBwdWJsaWMgY29sb3I6IHN0cmluZzsgLy8gXHU2RDg4XHUzMDU3XHUzMEI0XHUzMEUwXHUzMDZFXHU1ODM0XHU1NDA4XHUzMDZGZVx1MzA2RVx1MzA3RlxuICAgIHByaXZhdGUgcDogUG9pbnRbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wID0gW107XG4gICAgfVxuICAgIHB1YmxpYyBwdXNoKHA6IFBvaW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMucC5wdXNoKHApO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0UG9pbnRzKCk6IFBvaW50W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wO1xuICAgIH1cbiAgICBwdWJsaWMgbGFzdFBvaW50KCk6IFBvaW50IHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLnAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBbdGhpcy5wLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wID0gW107XG4gICAgfVxuICAgIHB1YmxpYyBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucC5sZW5ndGg7XG4gICAgfVxuICAgIHB1YmxpYyBqc29uKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucCkge1xuICAgICAgICAgICAgcmV0LnB1c2gocC5qc29uKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgW1wiJHt0aGlzLmNvbG9yfVwiLFske3JldC5qb2luKFwiLFwiKX1dXWA7XG4gICAgfVxuICAgIHB1YmxpYyBwYXJzZShjb2xvcjogc3RyaW5nLCBhcnI6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5wID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhcnIpIHtcblxuICAgICAgICAgICAgY29uc3QgdG1wID0gbmV3IFBvaW50KHBhcnNlSW50KGFbMF0pLCBwYXJzZUludChhWzFdKSk7XG4gICAgICAgICAgICB0aGlzLnAucHVzaCh0bXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBpc0VyYXNlcigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5jb2xvciA9PT0gU3Ryb2tlLlRLX0VSQVNFUjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIGlzUGVuKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNFcmFzZXIoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgcHVibGljIHg6IG51bWJlcjtcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIHB1YmxpYyBqc29uKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJldCA9IGBbJHt0aGlzLnh9LCR7dGhpcy55fV1gO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgaXNTYW1lKHg6IG51bWJlciwgeTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGNvbmQxOiBib29sZWFuID0geCA9PT0gdGhpcy54O1xuICAgICAgICBjb25zdCBjb25kMjogYm9vbGVhbiA9IHkgPT09IHRoaXMueTtcbiAgICAgICAgcmV0dXJuIGNvbmQxICYmIGNvbmQyO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3LCBTdHJva2UsIFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIERyYXdNaW5lIHtcbiAgICBwcml2YXRlIGRyYXc6IERyYXc7XG4gICAgcHJpdmF0ZSBub3dzdHJva2U6IFN0cm9rZTtcbiAgICBwcml2YXRlIHVzZXJfaWQ6IHN0cmluZztcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwcml2YXRlIHNhdmVkU3Ryb2tlOiBTdHJva2U7IC8vIFx1NEZERFx1NUI1OFx1MzA1N1x1MzA1Rlx1MzA2OFx1MzA0RFx1MzA2RXN0cm9rZVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XG4gICAgICAgIHRoaXMubm93c3Ryb2tlID0gbmV3IFN0cm9rZSgpO1xuICAgICAgICB0aGlzLnVzZXJfaWQgPSBudWxsO1xuICAgICAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGNvbnN0IHBhcGVyX2lkOiBudW1iZXIgPSBwYXJzZUludCh1cmxzW3VybHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnBhcGVyX2lkID0gcGFwZXJfaWQ7XG4gICAgICAgIHRoaXMuc2F2ZWRTdHJva2UgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXNoUG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKHRoaXMubm93c3Ryb2tlLmxlbmd0aCgpID09PSAwKSB7XG4gICAgICAgICAgICAvLyBcdTY3MDBcdTUyMURcdTMwNkVcdTcwQjlcdTMwNkFcdTMwODljb2xvclx1MzA2RVx1OEEyRFx1NUI5QVxuICAgICAgICAgICAgdGhpcy5ub3dzdHJva2UuY29sb3IgPSB0aGlzLnBlbi5vcHQuZXJhc2VyID8gU3Ryb2tlLlRLX0VSQVNFUiA6IHRoaXMucGVuLm9wdC5jb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwID0gbmV3IFBvaW50KHgsIHkpO1xuICAgICAgICB0aGlzLm5vd3N0cm9rZS5wdXNoKHApO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0UG9pbnQoKTogUG9pbnQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm93c3Ryb2tlLmxhc3RQb2ludCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRTdHJva2UoKTogdm9pZCB7XG4gICAgICAgIC8vIFN0cm9rZVx1MzA0Q1x1N0Q0Mlx1MzA4Rlx1MzA2M1x1MzA1Rlx1MzA2RVx1MzA2N2RyYXdcdTMwNkJcdTMwRDdcdTMwQzNcdTMwQjdcdTMwRTVcbiAgICAgICAgaWYgKHRoaXMubm93c3Ryb2tlLmxlbmd0aCgpID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kcmF3LnB1c2godGhpcy5ub3dzdHJva2UpO1xuICAgICAgICAgICAgLy8gXHU2QjIxXHUzMDZCXHU1MDk5XHUzMDQ4XHUzMDY2c3Ryb2tlXHUzMDkyXHUzMEFGXHUzMEVBXHUzMEEyXG4gICAgICAgICAgICB0aGlzLm5vd3N0cm9rZSA9IG5ldyBTdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgc2F2ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgY29uc3QgdXJsID0gYC9hcGkvZHJhdy8ke3BhcGVyX2lkfWA7XG4gICAgICAgIGNvbnN0IHBvc3RkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIHBvc3RkYXRhLmFwcGVuZChcImpzb25fZHJhd1wiLCB0aGlzLmRyYXcuanNvbigpKTtcbiAgICAgICAgcG9zdGRhdGEuYXBwZW5kKFwidXNlcl9pZFwiLCB0aGlzLnVzZXJfaWQpO1xuICAgICAgICBjb25zdCBvcHRpb246IFJlcXVlc3RJbml0ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IHBvc3RkYXRhLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb24pO1xuICAgICAgICBjb25zdCByZXNfc2F2ZSA9IEpTT04ucGFyc2UoYXdhaXQgcmVzcG9uc2UudGV4dCgpKTtcbiAgICAgICAgaWYgKHRoaXMudXNlcl9pZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51c2VyX2lkID0gcmVzX3NhdmUudXNlcl9pZC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2F2ZWRTdHJva2UgPSB0aGlzLmRyYXcucGVlaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBsb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYC9hcGkvZHJhdy8ke3RoaXMucGFwZXJfaWR9L21pbmUvJHt0aGlzLnVzZXJfaWQgPT09IG51bGwgPyAwIDogdGhpcy51c2VyX2lkfWA7XG4gICAgICAgICAgICBjb25zdCBwb3N0ZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAgICAgcG9zdGRhdGEuYXBwZW5kKFwianNvbl9kcmF3XCIsIHRoaXMuZHJhdy5qc29uKCkpO1xuICAgICAgICAgICAgcG9zdGRhdGEuYXBwZW5kKFwidXNlcl9pZFwiLCB0aGlzLnVzZXJfaWQpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uOiBSZXF1ZXN0SW5pdCA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IHBvc3RkYXRhLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdGlvbik7XG4gICAgICAgICAgICBjb25zdCByZXNfbG9hZCA9IEpTT04ucGFyc2UoYXdhaXQgcmVzcG9uc2UudGV4dCgpKTtcblxuICAgICAgICAgICAgbGV0IHN0cm9rZXM6IGFueVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGQgb2YgKDxhbnlbXT5yZXNfbG9hZC5kYXRhKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZC5qc29uX2RyYXcpO1xuICAgICAgICAgICAgICAgIHN0cm9rZXMgPSBzdHJva2VzLmNvbmNhdChvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kcmF3LnBhcnNlKHN0cm9rZXMpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgYXN5bmMgbG9hZEF4aW9zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vICAgICBjb25zdCBhcGlfbG9hZDogTXlBeGlvc0FwaSA9IHdpbmRvdy5heGlvcy5nZXQoYC9hcGkvZHJhdy8ke3RoaXMucGFwZXJfaWR9L21pbmUvJHt0aGlzLnVzZXJfaWQgPT09IG51bGwgPyAwIDogdGhpcy51c2VyX2lkfWApO1xuXG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICBjb25zdCBbcmVzX2xvYWRdID0gYXdhaXQgd2luZG93LmF4aW9zLmFsbChbYXBpX2xvYWRdKTtcbiAgICAvLyAgICAgICAgIGxldCBzdHJva2VzOiBhbnlbXSA9IFtdO1xuICAgIC8vICAgICAgICAgZm9yIChjb25zdCBkIG9mICg8YW55W10+cmVzX2xvYWQuZGF0YSkpIHtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKGQuanNvbl9kcmF3KTtcbiAgICAvLyAgICAgICAgICAgICBzdHJva2VzID0gc3Ryb2tlcy5jb25jYXQob2JqKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIHRoaXMuZHJhdy5wYXJzZShzdHJva2VzKTtcbiAgICAvLyAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGljIHVuZG8oKTogU3Ryb2tlW10ge1xuICAgICAgICB0aGlzLmRyYXcuZ2V0U3Ryb2tlcygpLnBvcCgpO1xuICAgICAgICBjb25zdCByZXQgPSB0aGlzLmRyYXcuZ2V0U3Ryb2tlcygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXROb3dTdHJva2UoKTogU3Ryb2tlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm93c3Ryb2tlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFx1NEZERFx1NUI1OFx1MzA1N1x1MzA1Rlx1MzBCOVx1MzBDOFx1MzBFRFx1MzBGQ1x1MzBBRlx1NjU3MFx1MzA0Q1x1NkI2M1x1MzA1N1x1MzA1MVx1MzA4Q1x1MzA3MFx1NEZERFx1NUI1OFx1NkUwOFx1MzA3Rlx1MzAwMlx1NTg5N1x1MzA0OFx1MzA4Qlx1MzA3MFx1MzA0Qlx1MzA4QVx1MzA2N1x1MzA2Rlx1MzA2QVx1MzA0Rlx1MzAwMXVuZG9cdTMwNjdcdTZFMUJcdTMwOEJcdTU4MzRcdTU0MDhcdTMwODJcdTMwNDJcdTMwOEFcdTMwMDJcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTYXZlZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgcmV0OiBib29sZWFuID0gdGhpcy5zYXZlZFN0cm9rZSA9PT0gdGhpcy5kcmF3LnBlZWsoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhdywgU3Ryb2tlLCBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3T3RoZXIge1xuICAgIHByaXZhdGUgZHJhd3M6IERyYXdbXTsgLy8gXHU4MUVBXHU1MjA2XHU0RUU1XHU1OTE2XHVGRjFEXHU4OTA3XHU2NTcwXHU0RUJBXHUzMDZFXHUzMEM3XHUzMEZDXHUzMEJGXHUzMDRDXHUzMDQyXHUzMDhCXHUzMDVGXHUzMDgxXG4gICAgcHJpdmF0ZSBwYXBlcl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXIgfCBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZHJhd3MgPSBbXTtcbiAgICAgICAgdGhpcy51c2VyX2lkID0gbnVsbDtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdGhpcy5wYXBlcl9pZCA9IHBhcGVyX2lkO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgbG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYC9hcGkvZHJhdy8ke3RoaXMucGFwZXJfaWR9L290aGVyLyR7dGhpcy51c2VyX2lkID09PSBudWxsID8gMCA6IHRoaXMudXNlcl9pZH1gO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgICAgICAgZm9yKGNvbnN0IGQgb2YgSlNPTi5wYXJzZSh0ZXh0KSkge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkLmpzb25fZHJhdyk7XG4gICAgICAgICAgICBjb25zdCBkcmF3ID0gbmV3IERyYXcoKTtcbiAgICAgICAgICAgIGRyYXcucGFyc2Uob2JqKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd3MucHVzaChkcmF3KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXREcmF3cygpOiBEcmF3W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5kcmF3cztcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd0V2ZW50SGFuZGxlciB9IGZyb20gXCIuLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuXG5leHBvcnQgY2xhc3MgTW91c2VTZW5zb3Ige1xuICAgIHByaXZhdGUgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXI7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzaGFuZGxlcnM6ICgoZTogVG91Y2hFdmVudCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gICAgcHVibGljIGluaXQoc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5zZSA9IHNlbnNlO1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZXVwXCJdID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2Vkb3duXCJdID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMuc2Vuc2UuZG93bihcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZW1vdmVcIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS5tb3ZlKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNlbGVhdmVcIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuYWRkRGVmYXVsdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBwKGU6IE1vdXNlRXZlbnQpOiBQb2ludCB7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IGUub2Zmc2V0WDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gZS5vZmZzZXRZO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4uL0RyYXdFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5cbmV4cG9ydCBjbGFzcyBQb2ludGVyU2Vuc29yIHtcbiAgICBwcml2YXRlIHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIGNhbnZhc2hhbmRsZXJzOiAoKGU6IFRvdWNoRXZlbnQpID0+IHZvaWQpW10gPSBbXTtcblxuICAgIHB1YmxpYyBpbml0KHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyLCBwYXBlcjogUGFwZXJFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2Vuc2UgPSBzZW5zZTtcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcnVwXCJdID0gKGU6IFBvaW50ZXJFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJkb3duXCJdID0gKGU6IFBvaW50ZXJFdmVudCkgPT4gdGhpcy5zZW5zZS5kb3duKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcm1vdmVcIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLm1vdmUoXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVybGVhdmVcIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGREZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZURlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwKGUpOiBQb2ludCB7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IGUub2Zmc2V0WDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gZS5vZmZzZXRZO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4uL0RyYXdFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcbmltcG9ydCB7IFpvb21TY3JvbGxBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1pvb21TY3JvbGxBY3Rpb25cIjtcbmV4cG9ydCBjbGFzcyBUb3VjaFNlbnNvciB7XG4gICAgcHJpdmF0ZSBzZW5zZTogRHJhd0V2ZW50SGFuZGxlcjtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uO1xuICAgIHByaXZhdGUgY2FudmFzaGFuZGxlcnM6ICgoZTogVG91Y2hFdmVudCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gICAgcHVibGljIGluaXQoc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIsIHBhcGVyOiBQYXBlckVsZW1lbnQsIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5zZSA9IHNlbnNlO1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaGVuZFwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwidG91Y2hcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNoc3RhcnRcIl0gPSAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5zZW5zZS5kb3duKFwidG91Y2hcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNobW92ZVwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLm1vdmUoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2hsZWF2ZVwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwidG91Y2hcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRGVmYXVsdExpc3RlbmVyKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVEZWZhdWx0TGlzdGVuZXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcChlOiBUb3VjaEV2ZW50KTogUG9pbnQge1xuICAgICAgICBjb25zdCBjdCA9IGUuY2hhbmdlZFRvdWNoZXNbMF1cbiAgICAgICAgY29uc3QgYmMgPSAoPEhUTUxDYW52YXNFbGVtZW50PmUudGFyZ2V0KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeCA9IGN0LmNsaWVudFggLSBiYy5sZWZ0O1xuICAgICAgICBjb25zdCB5ID0gY3QuY2xpZW50WSAtIGJjLnRvcDtcbiAgICAgICAgLy8gXHU3M0ZFXHU1NzI4XHUzMDZFem9vbVx1NEY0RFx1N0Y2RVx1MzA2RVx1ODhEQ1x1NkI2M1x1MzA0Q1x1MzA0Qlx1MzA0Qlx1MzA4OVx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1OEFCRlx1NjU3NFxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHggLyB0aGlzLnpvb21zY3JvbGwuZ2V0Wm9vbSgpLCB5IC8gdGhpcy56b29tc2Nyb2xsLmdldFpvb20oKSk7XG4gICAgfVxufVxuIiwgIi8qIVxuKiBzd2VldGFsZXJ0MiB2MTEuNC4yNlxuKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5Td2VldGFsZXJ0MiA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGNvbnN0IGNvbnNvbGVQcmVmaXggPSAnU3dlZXRBbGVydDI6JztcbiAgLyoqXG4gICAqIEZpbHRlciB0aGUgdW5pcXVlIHZhbHVlcyBpbnRvIGEgbmV3IGFycmF5XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuXG4gIGNvbnN0IHVuaXF1ZUFycmF5ID0gYXJyID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVzdWx0LmluZGV4T2YoYXJyW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXJyW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQ2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgY29uc3QgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gc3RyID0+IHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgd2FybmluZ3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBBcnJheX0gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCB3YXJuID0gbWVzc2FnZSA9PiB7XG4gICAgY29uc29sZS53YXJuKFwiXCIuY29uY2F0KGNvbnNvbGVQcmVmaXgsIFwiIFwiKS5jb25jYXQodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnID8gbWVzc2FnZS5qb2luKCcgJykgOiBtZXNzYWdlKSk7XG4gIH07XG4gIC8qKlxuICAgKiBTdGFuZGFyZGl6ZSBjb25zb2xlIGVycm9yc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCBlcnJvciA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJcIi5jb25jYXQoY29uc29sZVByZWZpeCwgXCIgXCIpLmNvbmNhdChtZXNzYWdlKSk7XG4gIH07XG4gIC8qKlxuICAgKiBQcml2YXRlIGdsb2JhbCBzdGF0ZSBmb3IgYHdhcm5PbmNlYFxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGNvbnN0IHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcyA9IFtdO1xuICAvKipcbiAgICogU2hvdyBhIGNvbnNvbGUgd2FybmluZywgYnV0IG9ubHkgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzaG93blxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCB3YXJuT25jZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmICghcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzLmluY2x1ZGVzKG1lc3NhZ2UpKSB7XG4gICAgICBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgIHdhcm4obWVzc2FnZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogU2hvdyBhIG9uZS10aW1lIGNvbnNvbGUgd2FybmluZyBhYm91dCBkZXByZWNhdGVkIHBhcmFtcy9tZXRob2RzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXByZWNhdGVkUGFyYW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZUluc3RlYWRcbiAgICovXG5cbiAgY29uc3Qgd2FybkFib3V0RGVwcmVjYXRpb24gPSAoZGVwcmVjYXRlZFBhcmFtLCB1c2VJbnN0ZWFkKSA9PiB7XG4gICAgd2Fybk9uY2UoXCJcXFwiXCIuY29uY2F0KGRlcHJlY2F0ZWRQYXJhbSwgXCJcXFwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciByZWxlYXNlLiBQbGVhc2UgdXNlIFxcXCJcIikuY29uY2F0KHVzZUluc3RlYWQsIFwiXFxcIiBpbnN0ZWFkLlwiKSk7XG4gIH07XG4gIC8qKlxuICAgKiBJZiBgYXJnYCBpcyBhIGZ1bmN0aW9uLCBjYWxsIGl0ICh3aXRoIG5vIGFyZ3VtZW50cyBvciBjb250ZXh0KSBhbmQgcmV0dXJuIHRoZSByZXN1bHQuXG4gICAqIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24gfCBhbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cblxuICBjb25zdCBjYWxsSWZGdW5jdGlvbiA9IGFyZyA9PiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nID8gYXJnKCkgOiBhcmc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBoYXNUb1Byb21pc2VGbiA9IGFyZyA9PiBhcmcgJiYgdHlwZW9mIGFyZy50b1Byb21pc2UgPT09ICdmdW5jdGlvbic7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cblxuICBjb25zdCBhc1Byb21pc2UgPSBhcmcgPT4gaGFzVG9Qcm9taXNlRm4oYXJnKSA/IGFyZy50b1Byb21pc2UoKSA6IFByb21pc2UucmVzb2x2ZShhcmcpO1xuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNQcm9taXNlID0gYXJnID0+IGFyZyAmJiBQcm9taXNlLnJlc29sdmUoYXJnKSA9PT0gYXJnO1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuXG4gIGNvbnN0IGdldFJhbmRvbUVsZW1lbnQgPSBhcnIgPT4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgIHRpdGxlOiAnJyxcbiAgICB0aXRsZVRleHQ6ICcnLFxuICAgIHRleHQ6ICcnLFxuICAgIGh0bWw6ICcnLFxuICAgIGZvb3RlcjogJycsXG4gICAgaWNvbjogdW5kZWZpbmVkLFxuICAgIGljb25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGljb25IdG1sOiB1bmRlZmluZWQsXG4gICAgdGVtcGxhdGU6IHVuZGVmaW5lZCxcbiAgICB0b2FzdDogZmFsc2UsXG4gICAgc2hvd0NsYXNzOiB7XG4gICAgICBwb3B1cDogJ3N3YWwyLXNob3cnLFxuICAgICAgYmFja2Ryb3A6ICdzd2FsMi1iYWNrZHJvcC1zaG93JyxcbiAgICAgIGljb246ICdzd2FsMi1pY29uLXNob3cnXG4gICAgfSxcbiAgICBoaWRlQ2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItaGlkZScsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLWhpZGUnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24taGlkZSdcbiAgICB9LFxuICAgIGN1c3RvbUNsYXNzOiB7fSxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBjb2xvcjogdW5kZWZpbmVkLFxuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGhlaWdodEF1dG86IHRydWUsXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgYWxsb3dFc2NhcGVLZXk6IHRydWUsXG4gICAgYWxsb3dFbnRlcktleTogdHJ1ZSxcbiAgICBzdG9wS2V5ZG93blByb3BhZ2F0aW9uOiB0cnVlLFxuICAgIGtleWRvd25MaXN0ZW5lckNhcHR1cmU6IGZhbHNlLFxuICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgIHNob3dEZW55QnV0dG9uOiBmYWxzZSxcbiAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICBwcmVDb25maXJtOiB1bmRlZmluZWQsXG4gICAgcHJlRGVueTogdW5kZWZpbmVkLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgIGNvbmZpcm1CdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGNvbmZpcm1CdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGRlbnlCdXR0b25UZXh0OiAnTm8nLFxuICAgIGRlbnlCdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGRlbnlCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgIGNhbmNlbEJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY2FuY2VsQnV0dG9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBidXR0b25zU3R5bGluZzogdHJ1ZSxcbiAgICByZXZlcnNlQnV0dG9uczogZmFsc2UsXG4gICAgZm9jdXNDb25maXJtOiB0cnVlLFxuICAgIGZvY3VzRGVueTogZmFsc2UsXG4gICAgZm9jdXNDYW5jZWw6IGZhbHNlLFxuICAgIHJldHVybkZvY3VzOiB0cnVlLFxuICAgIHNob3dDbG9zZUJ1dHRvbjogZmFsc2UsXG4gICAgY2xvc2VCdXR0b25IdG1sOiAnJnRpbWVzOycsXG4gICAgY2xvc2VCdXR0b25BcmlhTGFiZWw6ICdDbG9zZSB0aGlzIGRpYWxvZycsXG4gICAgbG9hZGVySHRtbDogJycsXG4gICAgc2hvd0xvYWRlck9uQ29uZmlybTogZmFsc2UsXG4gICAgc2hvd0xvYWRlck9uRGVueTogZmFsc2UsXG4gICAgaW1hZ2VVcmw6IHVuZGVmaW5lZCxcbiAgICBpbWFnZVdpZHRoOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VIZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUFsdDogJycsXG4gICAgdGltZXI6IHVuZGVmaW5lZCxcbiAgICB0aW1lclByb2dyZXNzQmFyOiBmYWxzZSxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIHBhZGRpbmc6IHVuZGVmaW5lZCxcbiAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgaW5wdXQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dFBsYWNlaG9sZGVyOiAnJyxcbiAgICBpbnB1dExhYmVsOiAnJyxcbiAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICBpbnB1dE9wdGlvbnM6IHt9LFxuICAgIGlucHV0QXV0b1RyaW06IHRydWUsXG4gICAgaW5wdXRBdHRyaWJ1dGVzOiB7fSxcbiAgICBpbnB1dFZhbGlkYXRvcjogdW5kZWZpbmVkLFxuICAgIHJldHVybklucHV0VmFsdWVPbkRlbnk6IGZhbHNlLFxuICAgIHZhbGlkYXRpb25NZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgZ3JvdzogZmFsc2UsXG4gICAgcG9zaXRpb246ICdjZW50ZXInLFxuICAgIHByb2dyZXNzU3RlcHM6IFtdLFxuICAgIGN1cnJlbnRQcm9ncmVzc1N0ZXA6IHVuZGVmaW5lZCxcbiAgICBwcm9ncmVzc1N0ZXBzRGlzdGFuY2U6IHVuZGVmaW5lZCxcbiAgICB3aWxsT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZE9wZW46IHVuZGVmaW5lZCxcbiAgICBkaWRSZW5kZXI6IHVuZGVmaW5lZCxcbiAgICB3aWxsQ2xvc2U6IHVuZGVmaW5lZCxcbiAgICBkaWRDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZERlc3Ryb3k6IHVuZGVmaW5lZCxcbiAgICBzY3JvbGxiYXJQYWRkaW5nOiB0cnVlXG4gIH07XG4gIGNvbnN0IHVwZGF0YWJsZVBhcmFtcyA9IFsnYWxsb3dFc2NhcGVLZXknLCAnYWxsb3dPdXRzaWRlQ2xpY2snLCAnYmFja2dyb3VuZCcsICdidXR0b25zU3R5bGluZycsICdjYW5jZWxCdXR0b25BcmlhTGFiZWwnLCAnY2FuY2VsQnV0dG9uQ29sb3InLCAnY2FuY2VsQnV0dG9uVGV4dCcsICdjbG9zZUJ1dHRvbkFyaWFMYWJlbCcsICdjbG9zZUJ1dHRvbkh0bWwnLCAnY29sb3InLCAnY29uZmlybUJ1dHRvbkFyaWFMYWJlbCcsICdjb25maXJtQnV0dG9uQ29sb3InLCAnY29uZmlybUJ1dHRvblRleHQnLCAnY3VycmVudFByb2dyZXNzU3RlcCcsICdjdXN0b21DbGFzcycsICdkZW55QnV0dG9uQXJpYUxhYmVsJywgJ2RlbnlCdXR0b25Db2xvcicsICdkZW55QnV0dG9uVGV4dCcsICdkaWRDbG9zZScsICdkaWREZXN0cm95JywgJ2Zvb3RlcicsICdoaWRlQ2xhc3MnLCAnaHRtbCcsICdpY29uJywgJ2ljb25Db2xvcicsICdpY29uSHRtbCcsICdpbWFnZUFsdCcsICdpbWFnZUhlaWdodCcsICdpbWFnZVVybCcsICdpbWFnZVdpZHRoJywgJ3ByZUNvbmZpcm0nLCAncHJlRGVueScsICdwcm9ncmVzc1N0ZXBzJywgJ3JldHVybkZvY3VzJywgJ3JldmVyc2VCdXR0b25zJywgJ3Nob3dDYW5jZWxCdXR0b24nLCAnc2hvd0Nsb3NlQnV0dG9uJywgJ3Nob3dDb25maXJtQnV0dG9uJywgJ3Nob3dEZW55QnV0dG9uJywgJ3RleHQnLCAndGl0bGUnLCAndGl0bGVUZXh0JywgJ3dpbGxDbG9zZSddO1xuICBjb25zdCBkZXByZWNhdGVkUGFyYW1zID0ge307XG4gIGNvbnN0IHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zID0gWydhbGxvd091dHNpZGVDbGljaycsICdhbGxvd0VudGVyS2V5JywgJ2JhY2tkcm9wJywgJ2ZvY3VzQ29uZmlybScsICdmb2N1c0RlbnknLCAnZm9jdXNDYW5jZWwnLCAncmV0dXJuRm9jdXMnLCAnaGVpZ2h0QXV0bycsICdrZXlkb3duTGlzdGVuZXJDYXB0dXJlJ107XG4gIC8qKlxuICAgKiBJcyB2YWxpZCBwYXJhbWV0ZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNWYWxpZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZWZhdWx0UGFyYW1zLCBwYXJhbU5hbWUpO1xuICB9O1xuICAvKipcbiAgICogSXMgdmFsaWQgcGFyYW1ldGVyIGZvciBTd2FsLnVwZGF0ZSgpIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1VwZGF0YWJsZVBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIHVwZGF0YWJsZVBhcmFtcy5pbmRleE9mKHBhcmFtTmFtZSkgIT09IC0xO1xuICB9O1xuICAvKipcbiAgICogSXMgZGVwcmVjYXRlZCBwYXJhbWV0ZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfVxuICAgKi9cblxuICBjb25zdCBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIgPSBwYXJhbU5hbWUgPT4ge1xuICAgIHJldHVybiBkZXByZWNhdGVkUGFyYW1zW3BhcmFtTmFtZV07XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cbiAgY29uc3QgY2hlY2tJZlBhcmFtSXNWYWxpZCA9IHBhcmFtID0+IHtcbiAgICBpZiAoIWlzVmFsaWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICB3YXJuKFwiVW5rbm93biBwYXJhbWV0ZXIgXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cblxuICBjb25zdCBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgd2FybihcIlRoZSBwYXJhbWV0ZXIgXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiIGlzIGluY29tcGF0aWJsZSB3aXRoIHRvYXN0c1wiKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuXG5cbiAgY29uc3QgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkID0gcGFyYW0gPT4ge1xuICAgIGlmIChpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICB3YXJuQWJvdXREZXByZWNhdGlvbihwYXJhbSwgaXNEZXByZWNhdGVkUGFyYW1ldGVyKHBhcmFtKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogU2hvdyByZWxldmFudCB3YXJuaW5ncyBmb3IgZ2l2ZW4gcGFyYW1zXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvclBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgaWYgKCFwYXJhbXMuYmFja2Ryb3AgJiYgcGFyYW1zLmFsbG93T3V0c2lkZUNsaWNrKSB7XG4gICAgICB3YXJuKCdcImFsbG93T3V0c2lkZUNsaWNrXCIgcGFyYW1ldGVyIHJlcXVpcmVzIGBiYWNrZHJvcGAgcGFyYW1ldGVyIHRvIGJlIHNldCB0byBgdHJ1ZWAnKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBhcmFtIGluIHBhcmFtcykge1xuICAgICAgY2hlY2tJZlBhcmFtSXNWYWxpZChwYXJhbSk7XG5cbiAgICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgICAgY2hlY2tJZlRvYXN0UGFyYW1Jc1ZhbGlkKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkKHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3dhbFByZWZpeCA9ICdzd2FsMi0nO1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaXRlbXNcbiAgICogQHJldHVybnMge29iamVjdH1cbiAgICovXG5cbiAgY29uc3QgcHJlZml4ID0gaXRlbXMgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIGl0ZW1zKSB7XG4gICAgICByZXN1bHRbaXRlbXNbaV1dID0gc3dhbFByZWZpeCArIGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGNvbnN0IHN3YWxDbGFzc2VzID0gcHJlZml4KFsnY29udGFpbmVyJywgJ3Nob3duJywgJ2hlaWdodC1hdXRvJywgJ2lvc2ZpeCcsICdwb3B1cCcsICdtb2RhbCcsICduby1iYWNrZHJvcCcsICduby10cmFuc2l0aW9uJywgJ3RvYXN0JywgJ3RvYXN0LXNob3duJywgJ3Nob3cnLCAnaGlkZScsICdjbG9zZScsICd0aXRsZScsICdodG1sLWNvbnRhaW5lcicsICdhY3Rpb25zJywgJ2NvbmZpcm0nLCAnZGVueScsICdjYW5jZWwnLCAnZGVmYXVsdC1vdXRsaW5lJywgJ2Zvb3RlcicsICdpY29uJywgJ2ljb24tY29udGVudCcsICdpbWFnZScsICdpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICdsYWJlbCcsICd0ZXh0YXJlYScsICdpbnB1dGVycm9yJywgJ2lucHV0LWxhYmVsJywgJ3ZhbGlkYXRpb24tbWVzc2FnZScsICdwcm9ncmVzcy1zdGVwcycsICdhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCcsICdwcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAtbGluZScsICdsb2FkZXInLCAnbG9hZGluZycsICdzdHlsZWQnLCAndG9wJywgJ3RvcC1zdGFydCcsICd0b3AtZW5kJywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdjZW50ZXInLCAnY2VudGVyLXN0YXJ0JywgJ2NlbnRlci1lbmQnLCAnY2VudGVyLWxlZnQnLCAnY2VudGVyLXJpZ2h0JywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnYm90dG9tLWVuZCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLCAnZ3Jvdy1yb3cnLCAnZ3Jvdy1jb2x1bW4nLCAnZ3Jvdy1mdWxsc2NyZWVuJywgJ3J0bCcsICd0aW1lci1wcm9ncmVzcy1iYXInLCAndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lcicsICdzY3JvbGxiYXItbWVhc3VyZScsICdpY29uLXN1Y2Nlc3MnLCAnaWNvbi13YXJuaW5nJywgJ2ljb24taW5mbycsICdpY29uLXF1ZXN0aW9uJywgJ2ljb24tZXJyb3InLCAnbm8td2FyJ10pO1xuICBjb25zdCBpY29uVHlwZXMgPSBwcmVmaXgoWydzdWNjZXNzJywgJ3dhcm5pbmcnLCAnaW5mbycsICdxdWVzdGlvbicsICdlcnJvciddKTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgcG9wdXAgY29udGFpbmVyIHdoaWNoIGNvbnRhaW5zIHRoZSBiYWNrZHJvcCBhbmQgdGhlIHBvcHVwIGl0c2VsZi5cbiAgICpcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q29udGFpbmVyID0gKCkgPT4gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb250YWluZXIpKTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclN0cmluZ1xuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBlbGVtZW50QnlTZWxlY3RvciA9IHNlbGVjdG9yU3RyaW5nID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICByZXR1cm4gY29udGFpbmVyID8gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JTdHJpbmcpIDogbnVsbDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZWxlbWVudEJ5Q2xhc3MgPSBjbGFzc05hbWUgPT4ge1xuICAgIHJldHVybiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoY2xhc3NOYW1lKSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuXG4gIGNvbnN0IGdldFBvcHVwID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMucG9wdXApO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SWNvbiA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmljb24pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy50aXRsZSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRIdG1sQ29udGFpbmVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW1hZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5pbWFnZSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRQcm9ncmVzc1N0ZXBzID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q29uZmlybUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb25maXJtKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXREZW55QnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmRlbnkpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldElucHV0TGFiZWwgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaW5wdXQtbGFiZWwnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRMb2FkZXIgPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMubG9hZGVyKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDYW5jZWxCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2FuY2VsKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuYWN0aW9ucyk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRGb290ZXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5mb290ZXIpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VGltZXJQcm9ncmVzc0JhciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXInXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDbG9zZUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmNsb3NlKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2prdXAvZm9jdXNhYmxlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5cbiAgY29uc3QgZm9jdXNhYmxlID0gXCJcXG4gIGFbaHJlZl0sXFxuICBhcmVhW2hyZWZdLFxcbiAgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLFxcbiAgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSxcXG4gIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSxcXG4gIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksXFxuICBpZnJhbWUsXFxuICBvYmplY3QsXFxuICBlbWJlZCxcXG4gIFt0YWJpbmRleD1cXFwiMFxcXCJdLFxcbiAgW2NvbnRlbnRlZGl0YWJsZV0sXFxuICBhdWRpb1tjb250cm9sc10sXFxuICB2aWRlb1tjb250cm9sc10sXFxuICBzdW1tYXJ5XFxuXCI7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICovXG5cbiAgY29uc3QgZ2V0Rm9jdXNhYmxlRWxlbWVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXggPSBBcnJheS5mcm9tKGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbdGFiaW5kZXg9XCIwXCJdKScpKSAvLyBzb3J0IGFjY29yZGluZyB0byB0YWJpbmRleFxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCB0YWJpbmRleEEgPSBwYXJzZUludChhLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgICBjb25zdCB0YWJpbmRleEIgPSBwYXJzZUludChiLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG5cbiAgICAgIGlmICh0YWJpbmRleEEgPiB0YWJpbmRleEIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKHRhYmluZGV4QSA8IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIGNvbnN0IG90aGVyRm9jdXNhYmxlRWxlbWVudHMgPSBBcnJheS5mcm9tKGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGUpKS5maWx0ZXIoZWwgPT4gZWwuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICE9PSAnLTEnKTtcbiAgICByZXR1cm4gdW5pcXVlQXJyYXkoZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXguY29uY2F0KG90aGVyRm9jdXNhYmxlRWxlbWVudHMpKS5maWx0ZXIoZWwgPT4gaXNWaXNpYmxlKGVsKSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNNb2RhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuc2hvd24pICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSkgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1RvYXN0ID0gKCkgPT4ge1xuICAgIHJldHVybiBnZXRQb3B1cCgpICYmIGhhc0NsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc0xvYWRpbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdldFBvcHVwKCkuaGFzQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgfTtcblxuICBjb25zdCBzdGF0ZXMgPSB7XG4gICAgcHJldmlvdXNCb2R5UGFkZGluZzogbnVsbFxuICB9O1xuICAvKipcbiAgICogU2VjdXJlbHkgc2V0IGlubmVySFRNTCBvZiBhbiBlbGVtZW50XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTkyNlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gICAqL1xuXG4gIGNvbnN0IHNldElubmVySHRtbCA9IChlbGVtLCBodG1sKSA9PiB7XG4gICAgZWxlbS50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKGh0bWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIik7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBoYXNDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NMaXN0W2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW1vdmVDdXN0b21DbGFzc2VzID0gKGVsZW0sIHBhcmFtcykgPT4ge1xuICAgIEFycmF5LmZyb20oZWxlbS5jbGFzc0xpc3QpLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmICghT2JqZWN0LnZhbHVlcyhzd2FsQ2xhc3NlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhpY29uVHlwZXMpLmluY2x1ZGVzKGNsYXNzTmFtZSkgJiYgIU9iamVjdC52YWx1ZXMocGFyYW1zLnNob3dDbGFzcykuaW5jbHVkZXMoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICovXG5cblxuICBjb25zdCBhcHBseUN1c3RvbUNsYXNzID0gKGVsZW0sIHBhcmFtcywgY2xhc3NOYW1lKSA9PiB7XG4gICAgcmVtb3ZlQ3VzdG9tQ2xhc3NlcyhlbGVtLCBwYXJhbXMpO1xuXG4gICAgaWYgKHBhcmFtcy5jdXN0b21DbGFzcyAmJiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSkge1xuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSAhPT0gJ3N0cmluZycgJiYgIXBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdLmZvckVhY2gpIHtcbiAgICAgICAgcmV0dXJuIHdhcm4oXCJJbnZhbGlkIHR5cGUgb2YgY3VzdG9tQ2xhc3MuXCIuY29uY2F0KGNsYXNzTmFtZSwgXCIhIEV4cGVjdGVkIHN0cmluZyBvciBpdGVyYWJsZSBvYmplY3QsIGdvdCBcXFwiXCIpLmNvbmNhdCh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0sIFwiXFxcIlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGFkZENsYXNzKGVsZW0sIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi9yZW5kZXJlcnMvcmVuZGVySW5wdXQnKS5JbnB1dENsYXNzfSBpbnB1dENsYXNzXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW5wdXQgPSAocG9wdXAsIGlucHV0Q2xhc3MpID0+IHtcbiAgICBpZiAoIWlucHV0Q2xhc3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaW5wdXRDbGFzcykge1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXNbaW5wdXRDbGFzc10pKTtcblxuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiIGlucHV0XCIpKTtcblxuICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiIGlucHV0OmNoZWNrZWRcIikpIHx8IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpmaXJzdC1jaGlsZFwiKSk7XG5cbiAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBpbnB1dFwiKSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudH0gaW5wdXRcbiAgICovXG5cbiAgY29uc3QgZm9jdXNJbnB1dCA9IGlucHV0ID0+IHtcbiAgICBpbnB1dC5mb2N1cygpOyAvLyBwbGFjZSBjdXJzb3IgYXQgZW5kIG9mIHRleHQgaW4gdGV4dCBpbnB1dFxuXG4gICAgaWYgKGlucHV0LnR5cGUgIT09ICdmaWxlJykge1xuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjM0NTkxNVxuICAgICAgY29uc3QgdmFsID0gaW5wdXQudmFsdWU7XG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgaW5wdXQudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QsIGNvbmRpdGlvbikgPT4ge1xuICAgIGlmICghdGFyZ2V0IHx8ICFjbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNsYXNzTGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNsYXNzTGlzdCA9IGNsYXNzTGlzdC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG5cbiAgICBjbGFzc0xpc3QuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICBjb25kaXRpb24gPyBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmRpdGlvbiA/IHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICovXG5cbiAgY29uc3QgYWRkQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QpID0+IHtcbiAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgdHJ1ZSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKi9cblxuICBjb25zdCByZW1vdmVDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCkgPT4ge1xuICAgIHRvZ2dsZUNsYXNzKHRhcmdldCwgY2xhc3NMaXN0LCBmYWxzZSk7XG4gIH07XG4gIC8qKlxuICAgKiBHZXQgZGlyZWN0IGNoaWxkIG9mIGFuIGVsZW1lbnQgYnkgY2xhc3MgbmFtZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzID0gKGVsZW0sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbGVtLmNoaWxkcmVuKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGhhc0NsYXNzKGNoaWxkLCBjbGFzc05hbWUpKSB7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuXG4gIGNvbnN0IGFwcGx5TnVtZXJpY2FsU3R5bGUgPSAoZWxlbSwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiLmNvbmNhdChwYXJzZUludCh2YWx1ZSkpKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgfHwgcGFyc2VJbnQodmFsdWUpID09PSAwKSB7XG4gICAgICBlbGVtLnN0eWxlW3Byb3BlcnR5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdCh2YWx1ZSwgXCJweFwiKSA6IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuXG4gIGNvbnN0IHNob3cgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgIGxldCBkaXNwbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnZmxleCc7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG5cbiAgY29uc3QgaGlkZSA9IGVsZW0gPT4ge1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKi9cblxuICBjb25zdCBzZXRTdHlsZSA9IChwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuICAgIGNvbnN0IGVsID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKGVsKSB7XG4gICAgICBlbC5zdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7YW55fSBjb25kaXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpc3BsYXlcbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlID0gZnVuY3Rpb24gKGVsZW0sIGNvbmRpdGlvbikge1xuICAgIGxldCBkaXNwbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnZmxleCc7XG4gICAgY29uZGl0aW9uID8gc2hvdyhlbGVtLCBkaXNwbGF5KSA6IGhpZGUoZWxlbSk7XG4gIH07XG4gIC8qKlxuICAgKiBib3Jyb3dlZCBmcm9tIGpxdWVyeSAkKGVsZW0pLmlzKCc6dmlzaWJsZScpIGltcGxlbWVudGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVmlzaWJsZSA9IGVsZW0gPT4gISEoZWxlbSAmJiAoZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLm9mZnNldEhlaWdodCB8fCBlbGVtLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgYWxsQnV0dG9uc0FyZUhpZGRlbiA9ICgpID0+ICFpc1Zpc2libGUoZ2V0Q29uZmlybUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlKGdldERlbnlCdXR0b24oKSkgJiYgIWlzVmlzaWJsZShnZXRDYW5jZWxCdXR0b24oKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNTY3JvbGxhYmxlID0gZWxlbSA9PiAhIShlbGVtLnNjcm9sbEhlaWdodCA+IGVsZW0uY2xpZW50SGVpZ2h0KTtcbiAgLyoqXG4gICAqIGJvcnJvd2VkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ2MzUyMTE5XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc0Nzc0FuaW1hdGlvbiA9IGVsZW0gPT4ge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgY29uc3QgYW5pbUR1cmF0aW9uID0gcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdhbmltYXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIGNvbnN0IHRyYW5zRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zaXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIHJldHVybiBhbmltRHVyYXRpb24gPiAwIHx8IHRyYW5zRHVyYXRpb24gPiAwO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzZXRcbiAgICovXG5cbiAgY29uc3QgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICBsZXQgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG5cbiAgICBpZiAoaXNWaXNpYmxlKHRpbWVyUHJvZ3Jlc3NCYXIpKSB7XG4gICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gXCJ3aWR0aCBcIi5jb25jYXQodGltZXIgLyAxMDAwLCBcInMgbGluZWFyXCIpO1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHN0b3BUaW1lclByb2dyZXNzQmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhcldpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUodGltZXJQcm9ncmVzc0Jhcikud2lkdGgpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhclBlcmNlbnQgPSB0aW1lclByb2dyZXNzQmFyV2lkdGggLyB0aW1lclByb2dyZXNzQmFyRnVsbFdpZHRoICogMTAwO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGltZXJQcm9ncmVzc0JhclBlcmNlbnQsIFwiJVwiKTtcbiAgfTtcblxuICAvKipcbiAgICogRGV0ZWN0IE5vZGUgZW52XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNOb2RlRW52ID0gKCkgPT4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJztcblxuICBjb25zdCBSRVNUT1JFX0ZPQ1VTX1RJTUVPVVQgPSAxMDA7XG5cbiAgLyoqIEB0eXBlIHtHbG9iYWxTdGF0ZX0gKi9cblxuICBjb25zdCBnbG9iYWxTdGF0ZSA9IHt9O1xuXG4gIGNvbnN0IGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFJlc3RvcmUgcHJldmlvdXMgYWN0aXZlIChmb2N1c2VkKSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmV0dXJuRm9jdXNcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuXG5cbiAgY29uc3QgcmVzdG9yZUFjdGl2ZUVsZW1lbnQgPSByZXR1cm5Gb2N1cyA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCFyZXR1cm5Gb2N1cykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB4ID0gd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCB5ID0gd2luZG93LnNjcm9sbFk7XG4gICAgICBnbG9iYWxTdGF0ZS5yZXN0b3JlRm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50KCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0sIFJFU1RPUkVfRk9DVVNfVElNRU9VVCk7IC8vIGlzc3Vlcy85MDBcblxuICAgICAgd2luZG93LnNjcm9sbFRvKHgsIHkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN3ZWV0SFRNTCA9IFwiXFxuIDxkaXYgYXJpYS1sYWJlbGxlZGJ5PVxcXCJcIi5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBhcmlhLWRlc2NyaWJlZGJ5PVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiPlxcbiAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jbG9zZSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgIDx1bCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcHMnXSwgXCJcXFwiPjwvdWw+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pY29uLCBcIlxcXCI+PC9kaXY+XFxuICAgPGltZyBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbWFnZSwgXCJcXFwiIC8+XFxuICAgPGgyIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIj48L2gyPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDxpbnB1dCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCwgXCJcXFwiIC8+XFxuICAgPGlucHV0IHR5cGU9XFxcImZpbGVcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmZpbGUsIFwiXFxcIiAvPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiXFxcIj5cXG4gICAgIDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgLz5cXG4gICAgIDxvdXRwdXQ+PC9vdXRwdXQ+XFxuICAgPC9kaXY+XFxuICAgPHNlbGVjdCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5zZWxlY3QsIFwiXFxcIj48L3NlbGVjdD5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIlxcXCI+PC9kaXY+XFxuICAgPGxhYmVsIGZvcj1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCJcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIlxcXCI+XFxuICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIC8+XFxuICAgICA8c3BhbiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5sYWJlbCwgXCJcXFwiPjwvc3Bhbj5cXG4gICA8L2xhYmVsPlxcbiAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50ZXh0YXJlYSwgXCJcXFwiPjwvdGV4dGFyZWE+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10sIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiXFxcIj5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMubG9hZGVyLCBcIlxcXCI+PC9kaXY+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY29uZmlybSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmRlbnksIFwiXFxcIj48L2J1dHRvbj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jYW5jZWwsIFwiXFxcIj48L2J1dHRvbj5cXG4gICA8L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmZvb3RlciwgXCJcXFwiPjwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXInXSwgXCJcXFwiPlxcbiAgICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8L2Rpdj5cXG4gPC9kaXY+XFxuXCIpLnJlcGxhY2UoLyhefFxcbilcXHMqL2csICcnKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCByZXNldE9sZENvbnRhaW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBvbGRDb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcblxuICAgIGlmICghb2xkQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb2xkQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgIHJlbW92ZUNsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBbc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddLCBzd2FsQ2xhc3Nlc1snaGFzLWNvbHVtbiddXSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSA9ICgpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UucmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICB9O1xuXG4gIGNvbnN0IGFkZElucHV0Q2hhbmdlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbnB1dCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICAgIGNvbnN0IGZpbGUgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLmZpbGUpO1xuICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cblxuICAgIGNvbnN0IHJhbmdlID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcbiAgICAvKiogQHR5cGUge0hUTUxPdXRwdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgcmFuZ2VPdXRwdXQgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgb3V0cHV0XCIpKTtcbiAgICBjb25zdCBzZWxlY3QgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNlbGVjdCk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgY2hlY2tib3ggPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCIgaW5wdXRcIikpO1xuICAgIGNvbnN0IHRleHRhcmVhID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50ZXh0YXJlYSk7XG4gICAgaW5wdXQub25pbnB1dCA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgZmlsZS5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgc2VsZWN0Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBjaGVja2JveC5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgdGV4dGFyZWEub25pbnB1dCA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG5cbiAgICByYW5nZS5vbmlucHV0ID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuXG4gICAgcmFuZ2Uub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICAgIH07XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGdldFRhcmdldCA9IHRhcmdldCA9PiB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KSA6IHRhcmdldDtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwQWNjZXNzaWJpbGl0eSA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgncm9sZScsIHBhcmFtcy50b2FzdCA/ICdhbGVydCcgOiAnZGlhbG9nJyk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCBwYXJhbXMudG9hc3QgPyAncG9saXRlJyA6ICdhc3NlcnRpdmUnKTtcblxuICAgIGlmICghcGFyYW1zLnRvYXN0KSB7XG4gICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAgICovXG5cblxuICBjb25zdCBzZXR1cFJUTCA9IHRhcmdldEVsZW1lbnQgPT4ge1xuICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXRFbGVtZW50KS5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgICBhZGRDbGFzcyhnZXRDb250YWluZXIoKSwgc3dhbENsYXNzZXMucnRsKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBBZGQgbW9kYWwgKyBiYWNrZHJvcCArIG5vLXdhciBtZXNzYWdlIGZvciBSdXNzaWFucyB0byBET01cbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaW5pdCA9IHBhcmFtcyA9PiB7XG4gICAgLy8gQ2xlYW4gdXAgdGhlIG9sZCBwb3B1cCBjb250YWluZXIgaWYgaXQgZXhpc3RzXG4gICAgY29uc3Qgb2xkQ29udGFpbmVyRXhpc3RlZCA9IHJlc2V0T2xkQ29udGFpbmVyKCk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIGVycm9yKCdTd2VldEFsZXJ0MiByZXF1aXJlcyBkb2N1bWVudCB0byBpbml0aWFsaXplJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzLmNvbnRhaW5lcjtcblxuICAgIGlmIChvbGRDb250YWluZXJFeGlzdGVkKSB7XG4gICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzWyduby10cmFuc2l0aW9uJ10pO1xuICAgIH1cblxuICAgIHNldElubmVySHRtbChjb250YWluZXIsIHN3ZWV0SFRNTCk7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGdldFRhcmdldChwYXJhbXMudGFyZ2V0KTtcbiAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgc2V0dXBBY2Nlc3NpYmlsaXR5KHBhcmFtcyk7XG4gICAgc2V0dXBSVEwodGFyZ2V0RWxlbWVudCk7XG4gICAgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IG9iamVjdCB8IHN0cmluZ30gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuXG4gIGNvbnN0IHBhcnNlSHRtbFRvQ29udGFpbmVyID0gKHBhcmFtLCB0YXJnZXQpID0+IHtcbiAgICAvLyBET00gZWxlbWVudFxuICAgIGlmIChwYXJhbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocGFyYW0pO1xuICAgIH0gLy8gT2JqZWN0XG4gICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtID09PSAnb2JqZWN0Jykge1xuICAgICAgaGFuZGxlT2JqZWN0KHBhcmFtLCB0YXJnZXQpO1xuICAgIH0gLy8gUGxhaW4gc3RyaW5nXG4gICAgZWxzZSBpZiAocGFyYW0pIHtcbiAgICAgIHNldElubmVySHRtbCh0YXJnZXQsIHBhcmFtKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZU9iamVjdCA9IChwYXJhbSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gSlF1ZXJ5IGVsZW1lbnQocylcbiAgICBpZiAocGFyYW0uanF1ZXJ5KSB7XG4gICAgICBoYW5kbGVKcXVlcnlFbGVtKHRhcmdldCwgcGFyYW0pO1xuICAgIH0gLy8gRm9yIG90aGVyIG9iamVjdHMgdXNlIHRoZWlyIHN0cmluZyByZXByZXNlbnRhdGlvblxuICAgIGVsc2Uge1xuICAgICAgc2V0SW5uZXJIdG1sKHRhcmdldCwgcGFyYW0udG9TdHJpbmcoKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVKcXVlcnlFbGVtID0gKHRhcmdldCwgZWxlbSkgPT4ge1xuICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKDAgaW4gZWxlbSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IChpIGluIGVsZW0pOyBpKyspIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW1baV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHsnd2Via2l0QW5pbWF0aW9uRW5kJyB8ICdhbmltYXRpb25lbmQnIHwgZmFsc2V9XG4gICAqL1xuXG4gIGNvbnN0IGFuaW1hdGlvbkVuZEV2ZW50ID0gKCgpID0+IHtcbiAgICAvLyBQcmV2ZW50IHJ1biBpbiBOb2RlIGVudlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGlzTm9kZUVudigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgIC8vIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYVxuICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyAvLyBTdGFuZGFyZCBzeW50YXhcblxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRyYW5zRW5kRXZlbnROYW1lcywgaSkgJiYgdHlwZW9mIHRlc3RFbC5zdHlsZVtpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zRW5kRXZlbnROYW1lc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKCk7XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgc2Nyb2xsYmFyIHdpZHRoIGZvciBwYWRkaW5nIGJvZHkgZHVyaW5nIG1vZGFsIHNob3cvaGlkZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvanMvc3JjL21vZGFsLmpzXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuXG4gIGNvbnN0IG1lYXN1cmVTY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWydzY3JvbGxiYXItbWVhc3VyZSddO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQWN0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTsgLy8gQWN0aW9ucyAoYnV0dG9ucykgd3JhcHBlclxuXG4gICAgaWYgKCFwYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gJiYgIXBhcmFtcy5zaG93RGVueUJ1dHRvbiAmJiAhcGFyYW1zLnNob3dDYW5jZWxCdXR0b24pIHtcbiAgICAgIGhpZGUoYWN0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3coYWN0aW9ucyk7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhhY3Rpb25zLCBwYXJhbXMsICdhY3Rpb25zJyk7IC8vIFJlbmRlciBhbGwgdGhlIGJ1dHRvbnNcblxuICAgIHJlbmRlckJ1dHRvbnMoYWN0aW9ucywgbG9hZGVyLCBwYXJhbXMpOyAvLyBMb2FkZXJcblxuICAgIHNldElubmVySHRtbChsb2FkZXIsIHBhcmFtcy5sb2FkZXJIdG1sKTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGxvYWRlciwgcGFyYW1zLCAnbG9hZGVyJyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBhY3Rpb25zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxvYWRlclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVuZGVyQnV0dG9ucyhhY3Rpb25zLCBsb2FkZXIsIHBhcmFtcykge1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBnZXRDb25maXJtQnV0dG9uKCk7XG4gICAgY29uc3QgZGVueUJ1dHRvbiA9IGdldERlbnlCdXR0b24oKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBnZXRDYW5jZWxCdXR0b24oKTsgLy8gUmVuZGVyIGJ1dHRvbnNcblxuICAgIHJlbmRlckJ1dHRvbihjb25maXJtQnV0dG9uLCAnY29uZmlybScsIHBhcmFtcyk7XG4gICAgcmVuZGVyQnV0dG9uKGRlbnlCdXR0b24sICdkZW55JywgcGFyYW1zKTtcbiAgICByZW5kZXJCdXR0b24oY2FuY2VsQnV0dG9uLCAnY2FuY2VsJywgcGFyYW1zKTtcbiAgICBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcyk7XG5cbiAgICBpZiAocGFyYW1zLnJldmVyc2VCdXR0b25zKSB7XG4gICAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNhbmNlbEJ1dHRvbiwgY29uZmlybUJ1dHRvbik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGRlbnlCdXR0b24sIGNvbmZpcm1CdXR0b24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY2FuY2VsQnV0dG9uLCBsb2FkZXIpO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShkZW55QnV0dG9uLCBsb2FkZXIpO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjb25maXJtQnV0dG9uLCBsb2FkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29uZmlybUJ1dHRvblxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkZW55QnV0dG9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbmNlbEJ1dHRvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcykge1xuICAgIGlmICghcGFyYW1zLmJ1dHRvbnNTdHlsaW5nKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlQ2xhc3MoW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0sIHN3YWxDbGFzc2VzLnN0eWxlZCk7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0sIHN3YWxDbGFzc2VzLnN0eWxlZCk7IC8vIEJ1dHRvbnMgYmFja2dyb3VuZCBjb2xvcnNcblxuICAgIGlmIChwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yKSB7XG4gICAgICBjb25maXJtQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5jb25maXJtQnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhjb25maXJtQnV0dG9uLCBzd2FsQ2xhc3Nlc1snZGVmYXVsdC1vdXRsaW5lJ10pO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuZGVueUJ1dHRvbkNvbG9yKSB7XG4gICAgICBkZW55QnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5kZW55QnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhkZW55QnV0dG9uLCBzd2FsQ2xhc3Nlc1snZGVmYXVsdC1vdXRsaW5lJ10pO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3IpIHtcbiAgICAgIGNhbmNlbEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhjYW5jZWxCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBidXR0b25cbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueScgfCAnY2FuY2VsJ30gYnV0dG9uVHlwZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiByZW5kZXJCdXR0b24oYnV0dG9uLCBidXR0b25UeXBlLCBwYXJhbXMpIHtcbiAgICB0b2dnbGUoYnV0dG9uLCBwYXJhbXNbXCJzaG93XCIuY29uY2F0KGNhcGl0YWxpemVGaXJzdExldHRlcihidXR0b25UeXBlKSwgXCJCdXR0b25cIildLCAnaW5saW5lLWJsb2NrJyk7XG4gICAgc2V0SW5uZXJIdG1sKGJ1dHRvbiwgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uVGV4dFwiKV0pOyAvLyBTZXQgY2FwdGlvbiB0ZXh0XG5cbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uQXJpYUxhYmVsXCIpXSk7IC8vIEFSSUEgbGFiZWxcbiAgICAvLyBBZGQgYnV0dG9ucyBjdXN0b20gY2xhc3Nlc1xuXG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzW2J1dHRvblR5cGVdO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoYnV0dG9uLCBwYXJhbXMsIFwiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uXCIpKTtcbiAgICBhZGRDbGFzcyhidXR0b24sIHBhcmFtc1tcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvbkNsYXNzXCIpXSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNvbnRhaW5lciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tkcm9wUGFyYW0oY29udGFpbmVyLCBwYXJhbXMuYmFja2Ryb3ApO1xuICAgIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwYXJhbXMucG9zaXRpb24pO1xuICAgIGhhbmRsZUdyb3dQYXJhbShjb250YWluZXIsIHBhcmFtcy5ncm93KTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGNvbnRhaW5lciwgcGFyYW1zLCAnY29udGFpbmVyJyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snYmFja2Ryb3AnXX0gYmFja2Ryb3BcbiAgICovXG5cbiAgZnVuY3Rpb24gaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIGJhY2tkcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBiYWNrZHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gYmFja2Ryb3A7XG4gICAgfSBlbHNlIGlmICghYmFja2Ryb3ApIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1sncG9zaXRpb24nXX0gcG9zaXRpb25cbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVQb3NpdGlvblBhcmFtKGNvbnRhaW5lciwgcG9zaXRpb24pIHtcbiAgICBpZiAocG9zaXRpb24gaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbcG9zaXRpb25dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2FybignVGhlIFwicG9zaXRpb25cIiBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiY2VudGVyXCInKTtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXMuY2VudGVyKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydncm93J119IGdyb3dcbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBncm93KSB7XG4gICAgaWYgKGdyb3cgJiYgdHlwZW9mIGdyb3cgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBncm93Q2xhc3MgPSBcImdyb3ctXCIuY29uY2F0KGdyb3cpO1xuXG4gICAgICBpZiAoZ3Jvd0NsYXNzIGluIHN3YWxDbGFzc2VzKSB7XG4gICAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbZ3Jvd0NsYXNzXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG4gIHZhciBwcml2YXRlUHJvcHMgPSB7XG4gICAgYXdhaXRpbmdQcm9taXNlOiBuZXcgV2Vha01hcCgpLFxuICAgIHByb21pc2U6IG5ldyBXZWFrTWFwKCksXG4gICAgaW5uZXJQYXJhbXM6IG5ldyBXZWFrTWFwKCksXG4gICAgZG9tQ2FjaGU6IG5ldyBXZWFrTWFwKClcbiAgfTtcblxuICAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vc3dlZXRhbGVydDIuZC50c1wiLz5cbiAgLyoqIEB0eXBlIHtJbnB1dENsYXNzW119ICovXG5cbiAgY29uc3QgaW5wdXRDbGFzc2VzID0gWydpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICd0ZXh0YXJlYSddO1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlcklucHV0ID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBjb25zdCByZXJlbmRlciA9ICFpbm5lclBhcmFtcyB8fCBwYXJhbXMuaW5wdXQgIT09IGlubmVyUGFyYW1zLmlucHV0O1xuICAgIGlucHV0Q2xhc3Nlcy5mb3JFYWNoKGlucHV0Q2xhc3MgPT4ge1xuICAgICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW2lucHV0Q2xhc3NdKTsgLy8gc2V0IGF0dHJpYnV0ZXNcblxuICAgICAgc2V0QXR0cmlidXRlcyhpbnB1dENsYXNzLCBwYXJhbXMuaW5wdXRBdHRyaWJ1dGVzKTsgLy8gc2V0IGNsYXNzXG5cbiAgICAgIGlucHV0Q29udGFpbmVyLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzW2lucHV0Q2xhc3NdO1xuXG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgaGlkZShpbnB1dENvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyYW1zLmlucHV0KSB7XG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgc2hvd0lucHV0KHBhcmFtcyk7XG4gICAgICB9IC8vIHNldCBjdXN0b20gY2xhc3NcblxuXG4gICAgICBzZXRDdXN0b21DbGFzcyhwYXJhbXMpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBzaG93SW5wdXQgPSBwYXJhbXMgPT4ge1xuICAgIGlmICghcmVuZGVySW5wdXRUeXBlW3BhcmFtcy5pbnB1dF0pIHtcbiAgICAgIHJldHVybiBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dCEgRXhwZWN0ZWQgXFxcInRleHRcXFwiLCBcXFwiZW1haWxcXFwiLCBcXFwicGFzc3dvcmRcXFwiLCBcXFwibnVtYmVyXFxcIiwgXFxcInRlbFxcXCIsIFxcXCJzZWxlY3RcXFwiLCBcXFwicmFkaW9cXFwiLCBcXFwiY2hlY2tib3hcXFwiLCBcXFwidGV4dGFyZWFcXFwiLCBcXFwiZmlsZVxcXCIgb3IgXFxcInVybFxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHBhcmFtcy5pbnB1dCwgXCJcXFwiXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG4gICAgY29uc3QgaW5wdXQgPSByZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XShpbnB1dENvbnRhaW5lciwgcGFyYW1zKTtcbiAgICBzaG93KGlucHV0Q29udGFpbmVyKTsgLy8gaW5wdXQgYXV0b2ZvY3VzXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZvY3VzSW5wdXQoaW5wdXQpO1xuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKi9cblxuXG4gIGNvbnN0IHJlbW92ZUF0dHJpYnV0ZXMgPSBpbnB1dCA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IGlucHV0LmF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgaWYgKCFbJ3R5cGUnLCAndmFsdWUnLCAnc3R5bGUnXS5pbmNsdWRlcyhhdHRyTmFtZSkpIHtcbiAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0lucHV0Q2xhc3N9IGlucHV0Q2xhc3NcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXRBdHRyaWJ1dGVzJ119IGlucHV0QXR0cmlidXRlc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldEF0dHJpYnV0ZXMgPSAoaW5wdXRDbGFzcywgaW5wdXRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBnZXRJbnB1dChnZXRQb3B1cCgpLCBpbnB1dENsYXNzKTtcblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZW1vdmVBdHRyaWJ1dGVzKGlucHV0KTtcblxuICAgIGZvciAoY29uc3QgYXR0ciBpbiBpbnB1dEF0dHJpYnV0ZXMpIHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShhdHRyLCBpbnB1dEF0dHJpYnV0ZXNbYXR0cl0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldEN1c3RvbUNsYXNzID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFkZENsYXNzKGlucHV0Q29udGFpbmVyLCBwYXJhbXMuY3VzdG9tQ2xhc3MuaW5wdXQpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldElucHV0UGxhY2Vob2xkZXIgPSAoaW5wdXQsIHBhcmFtcykgPT4ge1xuICAgIGlmICghaW5wdXQucGxhY2Vob2xkZXIgfHwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpIHtcbiAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gcGFyYW1zLmlucHV0UGxhY2Vob2xkZXI7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtJbnB1dH0gaW5wdXRcbiAgICogQHBhcmFtIHtJbnB1dH0gcHJlcGVuZFRvXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldElucHV0TGFiZWwgPSAoaW5wdXQsIHByZXBlbmRUbywgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dExhYmVsKSB7XG4gICAgICBpbnB1dC5pZCA9IHN3YWxDbGFzc2VzLmlucHV0O1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgY29uc3QgbGFiZWxDbGFzcyA9IHN3YWxDbGFzc2VzWydpbnB1dC1sYWJlbCddO1xuICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBpbnB1dC5pZCk7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBsYWJlbENsYXNzO1xuXG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYWRkQ2xhc3MobGFiZWwsIHBhcmFtcy5jdXN0b21DbGFzcy5pbnB1dExhYmVsKTtcbiAgICAgIH1cblxuICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gcGFyYW1zLmlucHV0TGFiZWw7XG4gICAgICBwcmVwZW5kVG8uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIGxhYmVsKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dCddfSBpbnB1dFR5cGVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGdldElucHV0Q29udGFpbmVyID0gaW5wdXRUeXBlID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzW2lucHV0VHlwZV0gfHwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTE91dHB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dFZhbHVlJ119IGlucHV0VmFsdWVcbiAgICovXG5cblxuICBjb25zdCBjaGVja0FuZFNldElucHV0VmFsdWUgPSAoaW5wdXQsIGlucHV0VmFsdWUpID0+IHtcbiAgICBpZiAoWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIGlucHV0VmFsdWUpKSB7XG4gICAgICBpbnB1dC52YWx1ZSA9IFwiXCIuY29uY2F0KGlucHV0VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoIWlzUHJvbWlzZShpbnB1dFZhbHVlKSkge1xuICAgICAgd2FybihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dFZhbHVlISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiwgXFxcIm51bWJlclxcXCIgb3IgXFxcIlByb21pc2VcXFwiLCBnb3QgXFxcIlwiLmNvbmNhdCh0eXBlb2YgaW5wdXRWYWx1ZSwgXCJcXFwiXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKiBAdHlwZSBSZWNvcmQ8c3RyaW5nLCAoaW5wdXQ6IElucHV0IHwgSFRNTEVsZW1lbnQsIHBhcmFtczogU3dlZXRBbGVydE9wdGlvbnMpID0+IElucHV0PiAqL1xuXG5cbiAgY29uc3QgcmVuZGVySW5wdXRUeXBlID0ge307XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cbiAgcmVuZGVySW5wdXRUeXBlLnRleHQgPSByZW5kZXJJbnB1dFR5cGUuZW1haWwgPSByZW5kZXJJbnB1dFR5cGUucGFzc3dvcmQgPSByZW5kZXJJbnB1dFR5cGUubnVtYmVyID0gcmVuZGVySW5wdXRUeXBlLnRlbCA9IHJlbmRlcklucHV0VHlwZS51cmwgPSAoaW5wdXQsIHBhcmFtcykgPT4ge1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShpbnB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0TGFiZWwoaW5wdXQsIGlucHV0LCBwYXJhbXMpO1xuICAgIHNldElucHV0UGxhY2Vob2xkZXIoaW5wdXQsIHBhcmFtcyk7XG4gICAgaW5wdXQudHlwZSA9IHBhcmFtcy5pbnB1dDtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuZmlsZSA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhbmdlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUucmFuZ2UgPSAocmFuZ2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHJhbmdlSW5wdXQgPSByYW5nZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHJhbmdlT3V0cHV0ID0gcmFuZ2UucXVlcnlTZWxlY3Rvcignb3V0cHV0Jyk7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlSW5wdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICByYW5nZUlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlT3V0cHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChyYW5nZUlucHV0LCByYW5nZSwgcGFyYW1zKTtcbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxTZWxlY3RFbGVtZW50fSBzZWxlY3RcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MU2VsZWN0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuc2VsZWN0ID0gKHNlbGVjdCwgcGFyYW1zKSA9PiB7XG4gICAgc2VsZWN0LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAocGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBzZXRJbm5lckh0bWwocGxhY2Vob2xkZXIsIHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKTtcbiAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XG4gICAgICBwbGFjZWhvbGRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZWhvbGRlci5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgIH1cblxuICAgIHNldElucHV0TGFiZWwoc2VsZWN0LCBzZWxlY3QsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFkaW9cbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnJhZGlvID0gcmFkaW8gPT4ge1xuICAgIHJhZGlvLnRleHRDb250ZW50ID0gJyc7XG4gICAgcmV0dXJuIHJhZGlvO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MTGFiZWxFbGVtZW50fSBjaGVja2JveENvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLmNoZWNrYm94ID0gKGNoZWNrYm94Q29udGFpbmVyLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGdldElucHV0KGdldFBvcHVwKCksICdjaGVja2JveCcpO1xuICAgIGNoZWNrYm94LnZhbHVlID0gJzEnO1xuICAgIGNoZWNrYm94LmlkID0gc3dhbENsYXNzZXMuY2hlY2tib3g7XG4gICAgY2hlY2tib3guY2hlY2tlZCA9IEJvb2xlYW4ocGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIGNvbnN0IGxhYmVsID0gY2hlY2tib3hDb250YWluZXIucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICAgIHNldElubmVySHRtbChsYWJlbCwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpO1xuICAgIHJldHVybiBjaGVja2JveDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFRleHRBcmVhRWxlbWVudH0gdGV4dGFyZWFcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MVGV4dEFyZWFFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS50ZXh0YXJlYSA9ICh0ZXh0YXJlYSwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHRleHRhcmVhLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcih0ZXh0YXJlYSwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dExhYmVsKHRleHRhcmVhLCB0ZXh0YXJlYSwgcGFyYW1zKTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG5cbiAgICBjb25zdCBnZXRNYXJnaW4gPSBlbCA9PiBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luTGVmdCkgKyBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luUmlnaHQpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIyOTFcblxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE2OTlcbiAgICAgIGlmICgnTXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxQb3B1cFdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2V0UG9wdXAoKSkud2lkdGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHRhcmVhUmVzaXplSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0YXJlYVdpZHRoID0gdGV4dGFyZWEub2Zmc2V0V2lkdGggKyBnZXRNYXJnaW4odGV4dGFyZWEpO1xuXG4gICAgICAgICAgaWYgKHRleHRhcmVhV2lkdGggPiBpbml0aWFsUG9wdXBXaWR0aCkge1xuICAgICAgICAgICAgZ2V0UG9wdXAoKS5zdHlsZS53aWR0aCA9IFwiXCIuY29uY2F0KHRleHRhcmVhV2lkdGgsIFwicHhcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBvcHVwKCkuc3R5bGUud2lkdGggPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBuZXcgTXV0YXRpb25PYnNlcnZlcih0ZXh0YXJlYVJlc2l6ZUhhbmRsZXIpLm9ic2VydmUodGV4dGFyZWEsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZSddXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0YXJlYTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNvbnRlbnQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGh0bWxDb250YWluZXIgPSBnZXRIdG1sQ29udGFpbmVyKCk7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhodG1sQ29udGFpbmVyLCBwYXJhbXMsICdodG1sQ29udGFpbmVyJyk7IC8vIENvbnRlbnQgYXMgSFRNTFxuXG4gICAgaWYgKHBhcmFtcy5odG1sKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuaHRtbCwgaHRtbENvbnRhaW5lcik7XG4gICAgICBzaG93KGh0bWxDb250YWluZXIsICdibG9jaycpO1xuICAgIH0gLy8gQ29udGVudCBhcyBwbGFpbiB0ZXh0XG4gICAgZWxzZSBpZiAocGFyYW1zLnRleHQpIHtcbiAgICAgIGh0bWxDb250YWluZXIudGV4dENvbnRlbnQgPSBwYXJhbXMudGV4dDtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfSAvLyBObyBjb250ZW50XG4gICAgZWxzZSB7XG4gICAgICBoaWRlKGh0bWxDb250YWluZXIpO1xuICAgIH1cblxuICAgIHJlbmRlcklucHV0KGluc3RhbmNlLCBwYXJhbXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyRm9vdGVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBmb290ZXIgPSBnZXRGb290ZXIoKTtcbiAgICB0b2dnbGUoZm9vdGVyLCBwYXJhbXMuZm9vdGVyKTtcblxuICAgIGlmIChwYXJhbXMuZm9vdGVyKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuZm9vdGVyLCBmb290ZXIpO1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoZm9vdGVyLCBwYXJhbXMsICdmb290ZXInKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNsb3NlQnV0dG9uID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGdldENsb3NlQnV0dG9uKCk7XG4gICAgc2V0SW5uZXJIdG1sKGNsb3NlQnV0dG9uLCBwYXJhbXMuY2xvc2VCdXR0b25IdG1sKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGNsb3NlQnV0dG9uLCBwYXJhbXMsICdjbG9zZUJ1dHRvbicpO1xuICAgIHRvZ2dsZShjbG9zZUJ1dHRvbiwgcGFyYW1zLnNob3dDbG9zZUJ1dHRvbik7XG4gICAgY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zLmNsb3NlQnV0dG9uQXJpYUxhYmVsKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckljb24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgaWNvbiA9IGdldEljb24oKTsgLy8gaWYgdGhlIGdpdmVuIGljb24gYWxyZWFkeSByZW5kZXJlZCwgYXBwbHkgdGhlIHN0eWxpbmcgd2l0aG91dCByZS1yZW5kZXJpbmcgdGhlIGljb25cblxuICAgIGlmIChpbm5lclBhcmFtcyAmJiBwYXJhbXMuaWNvbiA9PT0gaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuICAgICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgICAgYXBwbHlTdHlsZXMoaWNvbiwgcGFyYW1zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXBhcmFtcy5pY29uICYmICFwYXJhbXMuaWNvbkh0bWwpIHtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5pY29uICYmIE9iamVjdC5rZXlzKGljb25UeXBlcykuaW5kZXhPZihwYXJhbXMuaWNvbikgPT09IC0xKSB7XG4gICAgICBlcnJvcihcIlVua25vd24gaWNvbiEgRXhwZWN0ZWQgXFxcInN1Y2Nlc3NcXFwiLCBcXFwiZXJyb3JcXFwiLCBcXFwid2FybmluZ1xcXCIsIFxcXCJpbmZvXFxcIiBvciBcXFwicXVlc3Rpb25cXFwiLCBnb3QgXFxcIlwiLmNvbmNhdChwYXJhbXMuaWNvbiwgXCJcXFwiXCIpKTtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2hvdyhpY29uKTsgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuXG4gICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgIGFwcGx5U3R5bGVzKGljb24sIHBhcmFtcyk7IC8vIEFuaW1hdGUgaWNvblxuXG4gICAgYWRkQ2xhc3MoaWNvbiwgcGFyYW1zLnNob3dDbGFzcy5pY29uKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IGFwcGx5U3R5bGVzID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGZvciAoY29uc3QgaWNvblR5cGUgaW4gaWNvblR5cGVzKSB7XG4gICAgICBpZiAocGFyYW1zLmljb24gIT09IGljb25UeXBlKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGljb24sIGljb25UeXBlc1tpY29uVHlwZV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZENsYXNzKGljb24sIGljb25UeXBlc1twYXJhbXMuaWNvbl0pOyAvLyBJY29uIGNvbG9yXG5cbiAgICBzZXRDb2xvcihpY29uLCBwYXJhbXMpOyAvLyBTdWNjZXNzIGljb24gYmFja2dyb3VuZCBjb2xvclxuXG4gICAgYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IoKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGljb24sIHBhcmFtcywgJ2ljb24nKTtcbiAgfTsgLy8gQWRqdXN0IHN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yIHRvIG1hdGNoIHRoZSBwb3B1cCBiYWNrZ3JvdW5kIGNvbG9yXG5cblxuICBjb25zdCBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvciA9ICgpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgcG9wdXBCYWNrZ3JvdW5kQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwb3B1cCkuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgIC8qKiBAdHlwZSB7Tm9kZUxpc3RPZjxIVE1MRWxlbWVudD59ICovXG5cbiAgICBjb25zdCBzdWNjZXNzSWNvblBhcnRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdLCAuc3dhbDItc3VjY2Vzcy1maXgnKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3VjY2Vzc0ljb25QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VjY2Vzc0ljb25QYXJ0c1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwb3B1cEJhY2tncm91bmRDb2xvcjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3VjY2Vzc0ljb25IdG1sID0gXCJcXG4gIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1sZWZ0XFxcIj48L2Rpdj5cXG4gIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWxpbmUtdGlwXFxcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ1xcXCI+PC9zcGFuPlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1yaW5nXFxcIj48L2Rpdj4gPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1maXhcXFwiPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0XFxcIj48L2Rpdj5cXG5cIjtcbiAgY29uc3QgZXJyb3JJY29uSHRtbCA9IFwiXFxuICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrXFxcIj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFyay1saW5lLWxlZnRcXFwiPjwvc3Bhbj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFyay1saW5lLXJpZ2h0XFxcIj48L3NwYW4+XFxuICA8L3NwYW4+XFxuXCI7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBzZXRDb250ZW50ID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGxldCBvbGRDb250ZW50ID0gaWNvbi5pbm5lckhUTUw7XG4gICAgbGV0IG5ld0NvbnRlbnQ7XG5cbiAgICBpZiAocGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQocGFyYW1zLmljb25IdG1sKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5pY29uID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBzdWNjZXNzSWNvbkh0bWw7XG4gICAgICBvbGRDb250ZW50ID0gb2xkQ29udGVudC5yZXBsYWNlKC8gc3R5bGU9XCIuKj9cIi9nLCAnJyk7IC8vIHVuZG8gYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IoKVxuICAgIH0gZWxzZSBpZiAocGFyYW1zLmljb24gPT09ICdlcnJvcicpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBlcnJvckljb25IdG1sO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWZhdWx0SWNvbkh0bWwgPSB7XG4gICAgICAgIHF1ZXN0aW9uOiAnPycsXG4gICAgICAgIHdhcm5pbmc6ICchJyxcbiAgICAgICAgaW5mbzogJ2knXG4gICAgICB9O1xuICAgICAgbmV3Q29udGVudCA9IGljb25Db250ZW50KGRlZmF1bHRJY29uSHRtbFtwYXJhbXMuaWNvbl0pO1xuICAgIH1cblxuICAgIGlmIChvbGRDb250ZW50LnRyaW0oKSAhPT0gbmV3Q29udGVudC50cmltKCkpIHtcbiAgICAgIHNldElubmVySHRtbChpY29uLCBuZXdDb250ZW50KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldENvbG9yID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGlmICghcGFyYW1zLmljb25Db2xvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGljb24uc3R5bGUuY29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuICAgIGljb24uc3R5bGUuYm9yZGVyQ29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuXG4gICAgZm9yIChjb25zdCBzZWwgb2YgWycuc3dhbDItc3VjY2Vzcy1saW5lLXRpcCcsICcuc3dhbDItc3VjY2Vzcy1saW5lLWxvbmcnLCAnLnN3YWwyLXgtbWFyay1saW5lLWxlZnQnLCAnLnN3YWwyLXgtbWFyay1saW5lLXJpZ2h0J10pIHtcbiAgICAgIHNldFN0eWxlKGljb24sIHNlbCwgJ2JhY2tncm91bmRDb2xvcicsIHBhcmFtcy5pY29uQ29sb3IpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKGljb24sICcuc3dhbDItc3VjY2Vzcy1yaW5nJywgJ2JvcmRlckNvbG9yJywgcGFyYW1zLmljb25Db2xvcik7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuXG4gIGNvbnN0IGljb25Db250ZW50ID0gY29udGVudCA9PiBcIjxkaXYgY2xhc3M9XFxcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlc1snaWNvbi1jb250ZW50J10sIFwiXFxcIj5cIikuY29uY2F0KGNvbnRlbnQsIFwiPC9kaXY+XCIpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySW1hZ2UgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gZ2V0SW1hZ2UoKTtcblxuICAgIGlmICghcGFyYW1zLmltYWdlVXJsKSB7XG4gICAgICByZXR1cm4gaGlkZShpbWFnZSk7XG4gICAgfVxuXG4gICAgc2hvdyhpbWFnZSwgJycpOyAvLyBTcmMsIGFsdFxuXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBwYXJhbXMuaW1hZ2VVcmwpO1xuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnYWx0JywgcGFyYW1zLmltYWdlQWx0KTsgLy8gV2lkdGgsIGhlaWdodFxuXG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ3dpZHRoJywgcGFyYW1zLmltYWdlV2lkdGgpO1xuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICdoZWlnaHQnLCBwYXJhbXMuaW1hZ2VIZWlnaHQpOyAvLyBDbGFzc1xuXG4gICAgaW1hZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuaW1hZ2U7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhpbWFnZSwgcGFyYW1zLCAnaW1hZ2UnKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclByb2dyZXNzU3RlcHMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHByb2dyZXNzU3RlcHNDb250YWluZXIgPSBnZXRQcm9ncmVzc1N0ZXBzKCk7XG5cbiAgICBpZiAoIXBhcmFtcy5wcm9ncmVzc1N0ZXBzIHx8IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGhpZGUocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgc2hvdyhwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKTtcbiAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAocGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXAgPj0gcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoKSB7XG4gICAgICB3YXJuKCdJbnZhbGlkIGN1cnJlbnRQcm9ncmVzc1N0ZXAgcGFyYW1ldGVyLCBpdCBzaG91bGQgYmUgbGVzcyB0aGFuIHByb2dyZXNzU3RlcHMubGVuZ3RoICcgKyAnKGN1cnJlbnRQcm9ncmVzc1N0ZXAgbGlrZSBKUyBhcnJheXMgc3RhcnRzIGZyb20gMCknKTtcbiAgICB9XG5cbiAgICBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5mb3JFYWNoKChzdGVwLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc3RlcEVsID0gY3JlYXRlU3RlcEVsZW1lbnQoc3RlcCk7XG4gICAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0ZXBFbCk7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gcGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXApIHtcbiAgICAgICAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1snYWN0aXZlLXByb2dyZXNzLXN0ZXAnXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCAhPT0gcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBsaW5lRWwgPSBjcmVhdGVMaW5lRWxlbWVudChwYXJhbXMpO1xuICAgICAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmVFbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RlcFxuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG5cbiAgY29uc3QgY3JlYXRlU3RlcEVsZW1lbnQgPSBzdGVwID0+IHtcbiAgICBjb25zdCBzdGVwRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGFkZENsYXNzKHN0ZXBFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAnXSk7XG4gICAgc2V0SW5uZXJIdG1sKHN0ZXBFbCwgc3RlcCk7XG4gICAgcmV0dXJuIHN0ZXBFbDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG5cblxuICBjb25zdCBjcmVhdGVMaW5lRWxlbWVudCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgbGluZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBhZGRDbGFzcyhsaW5lRWwsIHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwLWxpbmUnXSk7XG5cbiAgICBpZiAocGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSkge1xuICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShsaW5lRWwsICd3aWR0aCcsIHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBsaW5lRWw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJUaXRsZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBnZXRUaXRsZSgpO1xuICAgIHRvZ2dsZSh0aXRsZSwgcGFyYW1zLnRpdGxlIHx8IHBhcmFtcy50aXRsZVRleHQsICdibG9jaycpO1xuXG4gICAgaWYgKHBhcmFtcy50aXRsZSkge1xuICAgICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLnRpdGxlLCB0aXRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy50aXRsZVRleHQpIHtcbiAgICAgIHRpdGxlLmlubmVyVGV4dCA9IHBhcmFtcy50aXRsZVRleHQ7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyh0aXRsZSwgcGFyYW1zLCAndGl0bGUnKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclBvcHVwID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7IC8vIFdpZHRoXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMTcwXG5cbiAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKGNvbnRhaW5lciwgJ3dpZHRoJywgcGFyYW1zLndpZHRoKTtcbiAgICAgIHBvcHVwLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgcG9wdXAuaW5zZXJ0QmVmb3JlKGdldExvYWRlcigpLCBnZXRJY29uKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKHBvcHVwLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgIH0gLy8gUGFkZGluZ1xuXG5cbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKHBvcHVwLCAncGFkZGluZycsIHBhcmFtcy5wYWRkaW5nKTsgLy8gQ29sb3JcblxuICAgIGlmIChwYXJhbXMuY29sb3IpIHtcbiAgICAgIHBvcHVwLnN0eWxlLmNvbG9yID0gcGFyYW1zLmNvbG9yO1xuICAgIH0gLy8gQmFja2dyb3VuZFxuXG5cbiAgICBpZiAocGFyYW1zLmJhY2tncm91bmQpIHtcbiAgICAgIHBvcHVwLnN0eWxlLmJhY2tncm91bmQgPSBwYXJhbXMuYmFja2dyb3VuZDtcbiAgICB9XG5cbiAgICBoaWRlKGdldFZhbGlkYXRpb25NZXNzYWdlKCkpOyAvLyBDbGFzc2VzXG5cbiAgICBhZGRDbGFzc2VzKHBvcHVwLCBwYXJhbXMpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wdXBcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IGFkZENsYXNzZXMgPSAocG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIC8vIERlZmF1bHQgQ2xhc3MgKyBzaG93Q2xhc3Mgd2hlbiB1cGRhdGluZyBTd2FsLnVwZGF0ZSh7fSlcbiAgICBwb3B1cC5jbGFzc05hbWUgPSBcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgXCIpLmNvbmNhdChpc1Zpc2libGUocG9wdXApID8gcGFyYW1zLnNob3dDbGFzcy5wb3B1cCA6ICcnKTtcblxuICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSk7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMudG9hc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMubW9kYWwpO1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MocG9wdXAsIHBhcmFtcywgJ3BvcHVwJyk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuY3VzdG9tQ2xhc3MpO1xuICAgIH0gLy8gSWNvbiBjbGFzcyAoIzE4NDIpXG5cblxuICAgIGlmIChwYXJhbXMuaWNvbikge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW1wiaWNvbi1cIi5jb25jYXQocGFyYW1zLmljb24pXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICByZW5kZXJQb3B1cChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDb250YWluZXIoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyUHJvZ3Jlc3NTdGVwcyhpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJJY29uKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckltYWdlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlclRpdGxlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNsb3NlQnV0dG9uKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNvbnRlbnQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQWN0aW9ucyhpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJGb290ZXIoaW5zdGFuY2UsIHBhcmFtcyk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5kaWRSZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBhcmFtcy5kaWRSZW5kZXIoZ2V0UG9wdXAoKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IERpc21pc3NSZWFzb24gPSBPYmplY3QuZnJlZXplKHtcbiAgICBjYW5jZWw6ICdjYW5jZWwnLFxuICAgIGJhY2tkcm9wOiAnYmFja2Ryb3AnLFxuICAgIGNsb3NlOiAnY2xvc2UnLFxuICAgIGVzYzogJ2VzYycsXG4gICAgdGltZXI6ICd0aW1lcidcbiAgfSk7XG5cbiAgLy8gQWRkaW5nIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRvIGVsZW1lbnRzIG91dHNpZGUgb2YgdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgZW5zdXJlcyB0aGF0XG4gIC8vIGVsZW1lbnRzIG5vdCB3aXRoaW4gdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgd2lsbCBub3QgYmUgc3VyZmFjZWQgaWYgYSB1c2VyIG9wZW5zIGEgc2NyZWVuXG4gIC8vIHJlYWRlclx1MjAxOXMgbGlzdCBvZiBlbGVtZW50cyAoaGVhZGluZ3MsIGZvcm0gY29udHJvbHMsIGxhbmRtYXJrcywgZXRjLikgaW4gdGhlIGRvY3VtZW50LlxuXG4gIGNvbnN0IHNldEFyaWFIaWRkZW4gPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keUNoaWxkcmVuID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICBib2R5Q2hpbGRyZW4uZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwgPT09IGdldENvbnRhaW5lcigpIHx8IGVsLmNvbnRhaW5zKGdldENvbnRhaW5lcigpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcbiAgICAgIH1cblxuICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHVuc2V0QXJpYUhpZGRlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5Q2hpbGRyZW4gPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgIGJvZHlDaGlsZHJlbi5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJykpO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzd2FsU3RyaW5nUGFyYW1zID0gWydzd2FsLXRpdGxlJywgJ3N3YWwtaHRtbCcsICdzd2FsLWZvb3RlciddO1xuICBjb25zdCBnZXRUZW1wbGF0ZVBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0eXBlb2YgcGFyYW1zLnRlbXBsYXRlID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnRlbXBsYXRlKSA6IHBhcmFtcy50ZW1wbGF0ZTtcblxuICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgLyoqIEB0eXBlIHtEb2N1bWVudEZyYWdtZW50fSAqL1xuXG5cbiAgICBjb25zdCB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZS5jb250ZW50O1xuICAgIHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzKHRlbXBsYXRlQ29udGVudCk7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbihnZXRTd2FsUGFyYW1zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxCdXR0b25zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJbWFnZSh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSWNvbih0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSW5wdXQodGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbFN0cmluZ1BhcmFtcyh0ZW1wbGF0ZUNvbnRlbnQsIHN3YWxTdHJpbmdQYXJhbXMpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cbiAgY29uc3QgZ2V0U3dhbFBhcmFtcyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG4gICAgY29uc3Qgc3dhbFBhcmFtcyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtcGFyYW0nKSk7XG4gICAgc3dhbFBhcmFtcy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMocGFyYW0sIFsnbmFtZScsICd2YWx1ZSddKTtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFBhcmFtc1twYXJhbU5hbWVdID09PSAnYm9vbGVhbicgJiYgdmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEJ1dHRvbnMgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX0gKi9cblxuICAgIGNvbnN0IHN3YWxCdXR0b25zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1idXR0b24nKSk7XG4gICAgc3dhbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhidXR0b24sIFsndHlwZScsICdjb2xvcicsICdhcmlhLWxhYmVsJ10pO1xuICAgICAgY29uc3QgdHlwZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvblRleHRcIildID0gYnV0dG9uLmlubmVySFRNTDtcbiAgICAgIHJlc3VsdFtcInNob3dcIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpLCBcIkJ1dHRvblwiKV0gPSB0cnVlO1xuXG4gICAgICBpZiAoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnY29sb3InKSkge1xuICAgICAgICByZXN1bHRbXCJcIi5jb25jYXQodHlwZSwgXCJCdXR0b25Db2xvclwiKV0gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpKSB7XG4gICAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvbkFyaWFMYWJlbFwiKV0gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEltYWdlID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgaW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pbWFnZScpO1xuXG4gICAgaWYgKGltYWdlKSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGltYWdlLCBbJ3NyYycsICd3aWR0aCcsICdoZWlnaHQnLCAnYWx0J10pO1xuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdzcmMnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VVcmwgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCd3aWR0aCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVdpZHRoID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdoZWlnaHQnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VIZWlnaHQgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdhbHQnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VBbHQgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2FsdCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxJY29uID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgaWNvbiA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWljb24nKTtcblxuICAgIGlmIChpY29uKSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGljb24sIFsndHlwZScsICdjb2xvciddKTtcblxuICAgICAgaWYgKGljb24uaGFzQXR0cmlidXRlKCd0eXBlJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb24gPSBpY29uLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb25Db2xvciA9IGljb24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHQuaWNvbkh0bWwgPSBpY29uLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsSW5wdXQgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpbnB1dCA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWlucHV0Jyk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaW5wdXQsIFsndHlwZScsICdsYWJlbCcsICdwbGFjZWhvbGRlcicsICd2YWx1ZSddKTtcbiAgICAgIHJlc3VsdC5pbnB1dCA9IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JztcblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgnbGFiZWwnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRMYWJlbCA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbGFiZWwnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgncGxhY2Vob2xkZXInKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRQbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRWYWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG5cbiAgICBjb25zdCBpbnB1dE9wdGlvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWlucHV0LW9wdGlvbicpKTtcblxuICAgIGlmIChpbnB1dE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQuaW5wdXRPcHRpb25zID0ge307XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKG9wdGlvbiwgWyd2YWx1ZSddKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICBjb25zdCBvcHRpb25OYW1lID0gb3B0aW9uLmlubmVySFRNTDtcbiAgICAgICAgcmVzdWx0LmlucHV0T3B0aW9uc1tvcHRpb25WYWx1ZV0gPSBvcHRpb25OYW1lO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtTmFtZXNcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsU3RyaW5nUGFyYW1zID0gKHRlbXBsYXRlQ29udGVudCwgcGFyYW1OYW1lcykgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIHBhcmFtTmFtZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtTmFtZXNbaV07XG4gICAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgICBjb25zdCB0YWcgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvcihwYXJhbU5hbWUpO1xuXG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXModGFnLCBbXSk7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWUucmVwbGFjZSgvXnN3YWwtLywgJycpXSA9IHRhZy5pbm5lckhUTUwudHJpbSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCBhbGxvd2VkRWxlbWVudHMgPSBzd2FsU3RyaW5nUGFyYW1zLmNvbmNhdChbJ3N3YWwtcGFyYW0nLCAnc3dhbC1idXR0b24nLCAnc3dhbC1pbWFnZScsICdzd2FsLWljb24nLCAnc3dhbC1pbnB1dCcsICdzd2FsLWlucHV0LW9wdGlvbiddKTtcbiAgICBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5jaGlsZHJlbikuZm9yRWFjaChlbCA9PiB7XG4gICAgICBjb25zdCB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoYWxsb3dlZEVsZW1lbnRzLmluZGV4T2YodGFnTmFtZSkgPT09IC0xKSB7XG4gICAgICAgIHdhcm4oXCJVbnJlY29nbml6ZWQgZWxlbWVudCA8XCIuY29uY2F0KHRhZ05hbWUsIFwiPlwiKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxvd2VkQXR0cmlidXRlc1xuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMgPSAoZWwsIGFsbG93ZWRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICBpZiAoYWxsb3dlZEF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUubmFtZSkgPT09IC0xKSB7XG4gICAgICAgIHdhcm4oW1wiVW5yZWNvZ25pemVkIGF0dHJpYnV0ZSBcXFwiXCIuY29uY2F0KGF0dHJpYnV0ZS5uYW1lLCBcIlxcXCIgb24gPFwiKS5jb25jYXQoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBcIj4uXCIpLCBcIlwiLmNvbmNhdChhbGxvd2VkQXR0cmlidXRlcy5sZW5ndGggPyBcIkFsbG93ZWQgYXR0cmlidXRlcyBhcmU6IFwiLmNvbmNhdChhbGxvd2VkQXR0cmlidXRlcy5qb2luKCcsICcpKSA6ICdUbyBzZXQgdGhlIHZhbHVlLCB1c2UgSFRNTCB3aXRoaW4gdGhlIGVsZW1lbnQuJyldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICB2YXIgZGVmYXVsdElucHV0VmFsaWRhdG9ycyA9IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGlkYXRpb25NZXNzYWdlXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCB8IHN0cmluZz59XG4gICAgICovXG4gICAgZW1haWw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICByZXR1cm4gL15bYS16QS1aMC05LitfLV0rQFthLXpBLVowLTkuLV0rXFwuW2EtekEtWjAtOS1dezIsMjR9JC8udGVzdChzdHJpbmcpID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBQcm9taXNlLnJlc29sdmUodmFsaWRhdGlvbk1lc3NhZ2UgfHwgJ0ludmFsaWQgZW1haWwgYWRkcmVzcycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGlkYXRpb25NZXNzYWdlXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCB8IHN0cmluZz59XG4gICAgICovXG4gICAgdXJsOiAoc3RyaW5nLCB2YWxpZGF0aW9uTWVzc2FnZSkgPT4ge1xuICAgICAgLy8gdGFrZW4gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzgwOTQzNSB3aXRoIGEgc21hbGwgY2hhbmdlIGZyb20gIzEzMDYgYW5kICMyMDEzXG4gICAgICByZXR1cm4gL15odHRwcz86XFwvXFwvKHd3d1xcLik/Wy1hLXpBLVowLTlAOiUuXyt+Iz1dezEsMjU2fVxcLlthLXpdezIsNjN9XFxiKFstYS16QS1aMC05QDolXysufiM/Ji89XSopJC8udGVzdChzdHJpbmcpID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBQcm9taXNlLnJlc29sdmUodmFsaWRhdGlvbk1lc3NhZ2UgfHwgJ0ludmFsaWQgVVJMJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpIHtcbiAgICAvLyBVc2UgZGVmYXVsdCBgaW5wdXRWYWxpZGF0b3JgIGZvciBzdXBwb3J0ZWQgaW5wdXQgdHlwZXMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFwYXJhbXMuaW5wdXRWYWxpZGF0b3IpIHtcbiAgICAgIE9iamVjdC5rZXlzKGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0ga2V5KSB7XG4gICAgICAgICAgcGFyYW1zLmlucHV0VmFsaWRhdG9yID0gZGVmYXVsdElucHV0VmFsaWRhdG9yc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQ3VzdG9tVGFyZ2V0RWxlbWVudChwYXJhbXMpIHtcbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBpcyB2YWxpZFxuICAgIGlmICghcGFyYW1zLnRhcmdldCB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCA9PT0gJ3N0cmluZycgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnRhcmdldCkgfHwgdHlwZW9mIHBhcmFtcy50YXJnZXQgIT09ICdzdHJpbmcnICYmICFwYXJhbXMudGFyZ2V0LmFwcGVuZENoaWxkKSB7XG4gICAgICB3YXJuKCdUYXJnZXQgcGFyYW1ldGVyIGlzIG5vdCB2YWxpZCwgZGVmYXVsdGluZyB0byBcImJvZHlcIicpO1xuICAgICAgcGFyYW1zLnRhcmdldCA9ICdib2R5JztcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNldCB0eXBlLCB0ZXh0IGFuZCBhY3Rpb25zIG9uIHBvcHVwXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHNldFBhcmFtZXRlcnMocGFyYW1zKSB7XG4gICAgc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpOyAvLyBzaG93TG9hZGVyT25Db25maXJtICYmIHByZUNvbmZpcm1cblxuICAgIGlmIChwYXJhbXMuc2hvd0xvYWRlck9uQ29uZmlybSAmJiAhcGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgIHdhcm4oJ3Nob3dMb2FkZXJPbkNvbmZpcm0gaXMgc2V0IHRvIHRydWUsIGJ1dCBwcmVDb25maXJtIGlzIG5vdCBkZWZpbmVkLlxcbicgKyAnc2hvd0xvYWRlck9uQ29uZmlybSBzaG91bGQgYmUgdXNlZCB0b2dldGhlciB3aXRoIHByZUNvbmZpcm0sIHNlZSB1c2FnZSBleGFtcGxlOlxcbicgKyAnaHR0cHM6Ly9zd2VldGFsZXJ0Mi5naXRodWIuaW8vI2FqYXgtcmVxdWVzdCcpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlQ3VzdG9tVGFyZ2V0RWxlbWVudChwYXJhbXMpOyAvLyBSZXBsYWNlIG5ld2xpbmVzIHdpdGggPGJyPiBpbiB0aXRsZVxuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMudGl0bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJhbXMudGl0bGUgPSBwYXJhbXMudGl0bGUuc3BsaXQoJ1xcbicpLmpvaW4oJzxiciAvPicpO1xuICAgIH1cblxuICAgIGluaXQocGFyYW1zKTtcbiAgfVxuXG4gIGNsYXNzIFRpbWVyIHtcbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgZGVsYXkpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgIHRoaXMucmVtYWluaW5nID0gZGVsYXk7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuaWQgPSBzZXRUaW1lb3V0KHRoaXMuY2FsbGJhY2ssIHRoaXMucmVtYWluaW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMucmVtYWluaW5nIC09IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydGVkLmdldFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGluY3JlYXNlKG4pIHtcbiAgICAgIGNvbnN0IHJ1bm5pbmcgPSB0aGlzLnJ1bm5pbmc7XG5cbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbWFpbmluZyArPSBuO1xuXG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBnZXRUaW1lckxlZnQoKSB7XG4gICAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uaW5nO1xuICAgIH1cblxuICB9XG5cbiAgY29uc3QgZml4U2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIC8vIGZvciBxdWV1ZXMsIGRvIG5vdCBkbyB0aGlzIG1vcmUgdGhhbiBvbmNlXG4gICAgaWYgKHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBpZiB0aGUgYm9keSBoYXMgb3ZlcmZsb3dcblxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAvLyBhZGQgcGFkZGluZyBzbyB0aGUgY29udGVudCBkb2Vzbid0IHNoaWZ0IGFmdGVyIHJlbW92YWwgb2Ygc2Nyb2xsYmFyXG4gICAgICBzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiXCIuY29uY2F0KHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICsgbWVhc3VyZVNjcm9sbGJhcigpLCBcInB4XCIpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdW5kb1Njcm9sbGJhciA9ICgpID0+IHtcbiAgICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcsIFwicHhcIik7XG4gICAgICBzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbiAgY29uc3QgaU9TZml4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGlPUyA9IC8vIEB0cy1pZ25vcmVcbiAgICAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtIHx8IG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJyAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxO1xuXG4gICAgaWYgKGlPUyAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IFwiXCIuY29uY2F0KG9mZnNldCAqIC0xLCBcInB4XCIpO1xuICAgICAgYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICAgIGxvY2tCb2R5U2Nyb2xsKCk7XG4gICAgICBhZGRCb3R0b21QYWRkaW5nRm9yVGFsbFBvcHVwcygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTk0OFxuICAgKi9cblxuICBjb25zdCBhZGRCb3R0b21QYWRkaW5nRm9yVGFsbFBvcHVwcyA9ICgpID0+IHtcbiAgICBjb25zdCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgY29uc3QgaU9TID0gISF1YS5tYXRjaCgvaVBhZC9pKSB8fCAhIXVhLm1hdGNoKC9pUGhvbmUvaSk7XG4gICAgY29uc3Qgd2Via2l0ID0gISF1YS5tYXRjaCgvV2ViS2l0L2kpO1xuICAgIGNvbnN0IGlPU1NhZmFyaSA9IGlPUyAmJiB3ZWJraXQgJiYgIXVhLm1hdGNoKC9DcmlPUy9pKTtcblxuICAgIGlmIChpT1NTYWZhcmkpIHtcbiAgICAgIGNvbnN0IGJvdHRvbVBhbmVsSGVpZ2h0ID0gNDQ7XG5cbiAgICAgIGlmIChnZXRQb3B1cCgpLnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvdHRvbVBhbmVsSGVpZ2h0KSB7XG4gICAgICAgIGdldENvbnRhaW5lcigpLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIlwiLmNvbmNhdChib3R0b21QYW5lbEhlaWdodCwgXCJweFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzEyNDZcbiAgICovXG5cblxuICBjb25zdCBsb2NrQm9keVNjcm9sbCA9ICgpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBsZXQgcHJldmVudFRvdWNoTW92ZTtcblxuICAgIGNvbnRhaW5lci5vbnRvdWNoc3RhcnQgPSBlID0+IHtcbiAgICAgIHByZXZlbnRUb3VjaE1vdmUgPSBzaG91bGRQcmV2ZW50VG91Y2hNb3ZlKGUpO1xuICAgIH07XG5cbiAgICBjb250YWluZXIub250b3VjaG1vdmUgPSBlID0+IHtcbiAgICAgIGlmIChwcmV2ZW50VG91Y2hNb3ZlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZFByZXZlbnRUb3VjaE1vdmUgPSBldmVudCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuXG4gICAgaWYgKGlzU3R5bHVzKGV2ZW50KSB8fCBpc1pvb20oZXZlbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzU2Nyb2xsYWJsZShjb250YWluZXIpICYmIHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIC8vICMxNjAzXG4gICAgdGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScgJiYgLy8gIzIyNjZcbiAgICAhKGlzU2Nyb2xsYWJsZShnZXRIdG1sQ29udGFpbmVyKCkpICYmIC8vICMxOTQ0XG4gICAgZ2V0SHRtbENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE3ODZcbiAgICpcbiAgICogQHBhcmFtIHsqfSBldmVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc1N0eWx1cyA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCAmJiBldmVudC50b3VjaGVzWzBdLnRvdWNoVHlwZSA9PT0gJ3N0eWx1cyc7XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE4OTFcbiAgICpcbiAgICogQHBhcmFtIHtUb3VjaEV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc1pvb20gPSBldmVudCA9PiB7XG4gICAgcmV0dXJuIGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAxO1xuICB9O1xuXG4gIGNvbnN0IHVuZG9JT1NmaXggPSAoKSA9PiB7XG4gICAgaWYgKGhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wLCAxMCk7XG4gICAgICByZW1vdmVDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gb2Zmc2V0ICogLTE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IFNIT1dfQ0xBU1NfVElNRU9VVCA9IDEwO1xuICAvKipcbiAgICogT3BlbiBwb3B1cCwgYWRkIG5lY2Vzc2FyeSBjbGFzc2VzIGFuZCBzdHlsZXMsIGZpeCBzY3JvbGxiYXJcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBvcGVuUG9wdXAgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLndpbGxPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMud2lsbE9wZW4ocG9wdXApO1xuICAgIH1cblxuICAgIGNvbnN0IGJvZHlTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcbiAgICBjb25zdCBpbml0aWFsQm9keU92ZXJmbG93ID0gYm9keVN0eWxlcy5vdmVyZmxvd1k7XG4gICAgYWRkQ2xhc3NlcyQxKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcyk7IC8vIHNjcm9sbGluZyBpcyAnaGlkZGVuJyB1bnRpbCBhbmltYXRpb24gaXMgZG9uZSwgYWZ0ZXIgdGhhdCAnYXV0bydcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsaW5nVmlzaWJpbGl0eShjb250YWluZXIsIHBvcHVwKTtcbiAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpO1xuXG4gICAgaWYgKGlzTW9kYWwoKSkge1xuICAgICAgZml4U2Nyb2xsQ29udGFpbmVyKGNvbnRhaW5lciwgcGFyYW1zLnNjcm9sbGJhclBhZGRpbmcsIGluaXRpYWxCb2R5T3ZlcmZsb3cpO1xuICAgICAgc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cblxuICAgIGlmICghaXNUb2FzdCgpICYmICFnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZGlkT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBwYXJhbXMuZGlkT3Blbihwb3B1cCkpO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gIH07XG5cbiAgY29uc3Qgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBwb3B1cCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIHBvcHVwLnJlbW92ZUV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQpO1xuICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gIH07XG5cbiAgY29uc3Qgc2V0U2Nyb2xsaW5nVmlzaWJpbGl0eSA9IChjb250YWluZXIsIHBvcHVwKSA9PiB7XG4gICAgaWYgKGFuaW1hdGlvbkVuZEV2ZW50ICYmIGhhc0Nzc0FuaW1hdGlvbihwb3B1cCkpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnaGlkZGVuJztcbiAgICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBmaXhTY3JvbGxDb250YWluZXIgPSAoY29udGFpbmVyLCBzY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KSA9PiB7XG4gICAgaU9TZml4KCk7XG5cbiAgICBpZiAoc2Nyb2xsYmFyUGFkZGluZyAmJiBpbml0aWFsQm9keU92ZXJmbG93ICE9PSAnaGlkZGVuJykge1xuICAgICAgZml4U2Nyb2xsYmFyKCk7XG4gICAgfSAvLyBzd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0N1xuXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSAwO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZENsYXNzZXMkMSA9IChjb250YWluZXIsIHBvcHVwLCBwYXJhbXMpID0+IHtcbiAgICBhZGRDbGFzcyhjb250YWluZXIsIHBhcmFtcy5zaG93Q2xhc3MuYmFja2Ryb3ApOyAvLyB0aGlzIHdvcmthcm91bmQgd2l0aCBvcGFjaXR5IGlzIG5lZWRlZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMDU5XG5cbiAgICBwb3B1cC5zdHlsZS5zZXRQcm9wZXJ0eSgnb3BhY2l0eScsICcwJywgJ2ltcG9ydGFudCcpO1xuICAgIHNob3cocG9wdXAsICdncmlkJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBBbmltYXRlIHBvcHVwIHJpZ2h0IGFmdGVyIHNob3dpbmcgaXRcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTsgLy8gYW5kIHJlbW92ZSB0aGUgb3BhY2l0eSB3b3JrYXJvdW5kXG5cbiAgICAgIHBvcHVwLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdvcGFjaXR5Jyk7XG4gICAgfSwgU0hPV19DTEFTU19USU1FT1VUKTsgLy8gMTBtcyBpbiBvcmRlciB0byBmaXggIzIwNjJcblxuICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlcy5zaG93bik7XG5cbiAgICBpZiAocGFyYW1zLmhlaWdodEF1dG8gJiYgcGFyYW1zLmJhY2tkcm9wICYmICFwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93cyBsb2FkZXIgKHNwaW5uZXIpLCB0aGlzIGlzIHVzZWZ1bCB3aXRoIEFKQVggcmVxdWVzdHMuXG4gICAqIEJ5IGRlZmF1bHQgdGhlIGxvYWRlciBiZSBzaG93biBpbnN0ZWFkIG9mIHRoZSBcIkNvbmZpcm1cIiBidXR0b24uXG4gICAqL1xuXG4gIGNvbnN0IHNob3dMb2FkaW5nID0gYnV0dG9uVG9SZXBsYWNlID0+IHtcbiAgICBsZXQgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgbmV3IFN3YWwoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICB9XG5cbiAgICBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG5cbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICBoaWRlKGdldEljb24oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VCdXR0b24ocG9wdXAsIGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgfVxuXG4gICAgc2hvdyhsb2FkZXIpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJywgJ3RydWUnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJyk7XG4gICAgcG9wdXAuZm9jdXMoKTtcbiAgfTtcblxuICBjb25zdCByZXBsYWNlQnV0dG9uID0gKHBvcHVwLCBidXR0b25Ub1JlcGxhY2UpID0+IHtcbiAgICBjb25zdCBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpO1xuXG4gICAgaWYgKCFidXR0b25Ub1JlcGxhY2UgJiYgaXNWaXNpYmxlKGdldENvbmZpcm1CdXR0b24oKSkpIHtcbiAgICAgIGJ1dHRvblRvUmVwbGFjZSA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICB9XG5cbiAgICBzaG93KGFjdGlvbnMpO1xuXG4gICAgaWYgKGJ1dHRvblRvUmVwbGFjZSkge1xuICAgICAgaGlkZShidXR0b25Ub1JlcGxhY2UpO1xuICAgICAgbG9hZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1idXR0b24tdG8tcmVwbGFjZScsIGJ1dHRvblRvUmVwbGFjZS5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGxvYWRlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShsb2FkZXIsIGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgYWRkQ2xhc3MoW3BvcHVwLCBhY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSW5wdXRPcHRpb25zQW5kVmFsdWUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGlmIChwYXJhbXMuaW5wdXQgPT09ICdzZWxlY3QnIHx8IHBhcmFtcy5pbnB1dCA9PT0gJ3JhZGlvJykge1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIH0gZWxzZSBpZiAoWyd0ZXh0JywgJ2VtYWlsJywgJ251bWJlcicsICd0ZWwnLCAndGV4dGFyZWEnXS5pbmNsdWRlcyhwYXJhbXMuaW5wdXQpICYmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRWYWx1ZSkgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dFZhbHVlKSkpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBoYW5kbGVJbnB1dFZhbHVlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZ2V0SW5wdXRWYWx1ZSA9IChpbnN0YW5jZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG5cbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHJldHVybiBnZXRDaGVja2JveFZhbHVlKGlucHV0KTtcblxuICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICByZXR1cm4gZ2V0UmFkaW9WYWx1ZShpbnB1dCk7XG5cbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0RmlsZVZhbHVlKGlucHV0KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGlubmVyUGFyYW1zLmlucHV0QXV0b1RyaW0gPyBpbnB1dC52YWx1ZS50cmltKCkgOiBpbnB1dC52YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZ2V0Q2hlY2tib3hWYWx1ZSA9IGlucHV0ID0+IGlucHV0LmNoZWNrZWQgPyAxIDogMDtcblxuICBjb25zdCBnZXRSYWRpb1ZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IGlucHV0LnZhbHVlIDogbnVsbDtcblxuICBjb25zdCBnZXRGaWxlVmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5maWxlcy5sZW5ndGggPyBpbnB1dC5nZXRBdHRyaWJ1dGUoJ211bHRpcGxlJykgIT09IG51bGwgPyBpbnB1dC5maWxlcyA6IGlucHV0LmZpbGVzWzBdIDogbnVsbDtcblxuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGNvbnN0IHByb2Nlc3NJbnB1dE9wdGlvbnMgPSBpbnB1dE9wdGlvbnMgPT4gcG9wdWxhdGVJbnB1dE9wdGlvbnNbcGFyYW1zLmlucHV0XShwb3B1cCwgZm9ybWF0SW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyksIHBhcmFtcyk7XG5cbiAgICBpZiAoaGFzVG9Qcm9taXNlRm4ocGFyYW1zLmlucHV0T3B0aW9ucykgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpKSB7XG4gICAgICBzaG93TG9hZGluZyhnZXRDb25maXJtQnV0dG9uKCkpO1xuICAgICAgYXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpLnRoZW4oaW5wdXRPcHRpb25zID0+IHtcbiAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHByb2Nlc3NJbnB1dE9wdGlvbnMocGFyYW1zLmlucHV0T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0T3B0aW9ucyEgRXhwZWN0ZWQgb2JqZWN0LCBNYXAgb3IgUHJvbWlzZSwgZ290IFwiLmNvbmNhdCh0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9ucykpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG4gICAgaGlkZShpbnB1dCk7XG4gICAgYXNQcm9taXNlKHBhcmFtcy5pbnB1dFZhbHVlKS50aGVuKGlucHV0VmFsdWUgPT4ge1xuICAgICAgaW5wdXQudmFsdWUgPSBwYXJhbXMuaW5wdXQgPT09ICdudW1iZXInID8gcGFyc2VGbG9hdChpbnB1dFZhbHVlKSB8fCAwIDogXCJcIi5jb25jYXQoaW5wdXRWYWx1ZSk7XG4gICAgICBzaG93KGlucHV0KTtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBlcnJvcihcIkVycm9yIGluIGlucHV0VmFsdWUgcHJvbWlzZTogXCIuY29uY2F0KGVycikpO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcG9wdWxhdGVJbnB1dE9wdGlvbnMgPSB7XG4gICAgc2VsZWN0OiAocG9wdXAsIGlucHV0T3B0aW9ucywgcGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3QgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNlbGVjdCk7XG5cbiAgICAgIGNvbnN0IHJlbmRlck9wdGlvbiA9IChwYXJlbnQsIG9wdGlvbkxhYmVsLCBvcHRpb25WYWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gb3B0aW9uVmFsdWU7XG4gICAgICAgIHNldElubmVySHRtbChvcHRpb24sIG9wdGlvbkxhYmVsKTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gaXNTZWxlY3RlZChvcHRpb25WYWx1ZSwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH07XG5cbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGlucHV0T3B0aW9uID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBpbnB1dE9wdGlvblswXTtcbiAgICAgICAgY29uc3Qgb3B0aW9uTGFiZWwgPSBpbnB1dE9wdGlvblsxXTsgLy8gPG9wdGdyb3VwPiBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDQwMS9pbnRlcmFjdC9mb3Jtcy5odG1sI2gtMTcuNlxuICAgICAgICAvLyBcIi4uLmFsbCBPUFRHUk9VUCBlbGVtZW50cyBtdXN0IGJlIHNwZWNpZmllZCBkaXJlY3RseSB3aXRoaW4gYSBTRUxFQ1QgZWxlbWVudCAoaS5lLiwgZ3JvdXBzIG1heSBub3QgYmUgbmVzdGVkKS4uLlwiXG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyBpcyBhIDxvcHRncm91cD5cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25MYWJlbCkpIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBhbiBhcnJheSwgdGhlbiBpdCBpcyBhbiA8b3B0Z3JvdXA+XG4gICAgICAgICAgY29uc3Qgb3B0Z3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpO1xuICAgICAgICAgIG9wdGdyb3VwLmxhYmVsID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgb3B0Z3JvdXAuZGlzYWJsZWQgPSBmYWxzZTsgLy8gbm90IGNvbmZpZ3VyYWJsZSBmb3Igbm93XG5cbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0Z3JvdXApO1xuICAgICAgICAgIG9wdGlvbkxhYmVsLmZvckVhY2gobyA9PiByZW5kZXJPcHRpb24ob3B0Z3JvdXAsIG9bMV0sIG9bMF0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRpb24+XG4gICAgICAgICAgcmVuZGVyT3B0aW9uKHNlbGVjdCwgb3B0aW9uTGFiZWwsIG9wdGlvblZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzZWxlY3QuZm9jdXMoKTtcbiAgICB9LFxuICAgIHJhZGlvOiAocG9wdXAsIGlucHV0T3B0aW9ucywgcGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCByYWRpbyA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMucmFkaW8pO1xuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goaW5wdXRPcHRpb24gPT4ge1xuICAgICAgICBjb25zdCByYWRpb1ZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBpbnB1dE9wdGlvblsxXTtcbiAgICAgICAgY29uc3QgcmFkaW9JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGNvbnN0IHJhZGlvTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgcmFkaW9JbnB1dC50eXBlID0gJ3JhZGlvJztcbiAgICAgICAgcmFkaW9JbnB1dC5uYW1lID0gc3dhbENsYXNzZXMucmFkaW87XG4gICAgICAgIHJhZGlvSW5wdXQudmFsdWUgPSByYWRpb1ZhbHVlO1xuXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKHJhZGlvVmFsdWUsIHBhcmFtcy5pbnB1dFZhbHVlKSkge1xuICAgICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgc2V0SW5uZXJIdG1sKGxhYmVsLCByYWRpb0xhYmVsKTtcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMubGFiZWw7XG4gICAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHJhZGlvSW5wdXQpO1xuICAgICAgICByYWRpb0xhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgIHJhZGlvLmFwcGVuZENoaWxkKHJhZGlvTGFiZWxFbGVtZW50KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmFkaW9zID0gcmFkaW8ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcblxuICAgICAgaWYgKHJhZGlvcy5sZW5ndGgpIHtcbiAgICAgICAgcmFkaW9zWzBdLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ29udmVydHMgYGlucHV0T3B0aW9uc2AgaW50byBhbiBhcnJheSBvZiBgW3ZhbHVlLCBsYWJlbF1gc1xuICAgKiBAcGFyYW0gaW5wdXRPcHRpb25zXG4gICAqL1xuXG4gIGNvbnN0IGZvcm1hdElucHV0T3B0aW9ucyA9IGlucHV0T3B0aW9ucyA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBpZiAodHlwZW9mIE1hcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW5wdXRPcHRpb25zIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBsZXQgdmFsdWVGb3JtYXR0ZWQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlRm9ybWF0dGVkID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vIGNhc2Ugb2YgPG9wdGdyb3VwPlxuICAgICAgICAgIHZhbHVlRm9ybWF0dGVkID0gZm9ybWF0SW5wdXRPcHRpb25zKHZhbHVlRm9ybWF0dGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlRm9ybWF0dGVkXSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMoaW5wdXRPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZUZvcm1hdHRlZCA9IGlucHV0T3B0aW9uc1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgaXNTZWxlY3RlZCA9IChvcHRpb25WYWx1ZSwgaW5wdXRWYWx1ZSkgPT4ge1xuICAgIHJldHVybiBpbnB1dFZhbHVlICYmIGlucHV0VmFsdWUudG9TdHJpbmcoKSA9PT0gb3B0aW9uVmFsdWUudG9TdHJpbmcoKTtcbiAgfTtcblxuICAvKipcbiAgICogSGlkZXMgbG9hZGVyIGFuZCBzaG93cyBiYWNrIHRoZSBidXR0b24gd2hpY2ggd2FzIGhpZGRlbiBieSAuc2hvd0xvYWRpbmcoKVxuICAgKi9cblxuICBmdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgICAvLyBkbyBub3RoaW5nIGlmIHBvcHVwIGlzIGNsb3NlZFxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgaGlkZShkb21DYWNoZS5sb2FkZXIpO1xuXG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgaWYgKGlubmVyUGFyYW1zLmljb24pIHtcbiAgICAgICAgc2hvdyhnZXRJY29uKCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzaG93UmVsYXRlZEJ1dHRvbihkb21DYWNoZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3MoW2RvbUNhY2hlLnBvcHVwLCBkb21DYWNoZS5hY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gICAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWJ1c3knKTtcbiAgICBkb21DYWNoZS5wb3B1cC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycpO1xuICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBkb21DYWNoZS5kZW55QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzaG93UmVsYXRlZEJ1dHRvbiA9IGRvbUNhY2hlID0+IHtcbiAgICBjb25zdCBidXR0b25Ub1JlcGxhY2UgPSBkb21DYWNoZS5wb3B1cC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGRvbUNhY2hlLmxvYWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYnV0dG9uLXRvLXJlcGxhY2UnKSk7XG5cbiAgICBpZiAoYnV0dG9uVG9SZXBsYWNlLmxlbmd0aCkge1xuICAgICAgc2hvdyhidXR0b25Ub1JlcGxhY2VbMF0sICdpbmxpbmUtYmxvY2snKTtcbiAgICB9IGVsc2UgaWYgKGFsbEJ1dHRvbnNBcmVIaWRkZW4oKSkge1xuICAgICAgaGlkZShkb21DYWNoZS5hY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlucHV0IERPTSBub2RlLCB0aGlzIG1ldGhvZCB3b3JrcyB3aXRoIGlucHV0IHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0SW5wdXQkMShpbnN0YW5jZSkge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB0aGlzKTtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UgfHwgdGhpcyk7XG5cbiAgICBpZiAoIWRvbUNhY2hlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0SW5wdXQoZG9tQ2FjaGUucG9wdXAsIGlubmVyUGFyYW1zLmlucHV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBjb250YWlucyBgV2Vha01hcGBzIGZvciBlYWNoIGVmZmVjdGl2ZWx5LVwicHJpdmF0ZSAgcHJvcGVydHlcIiB0aGF0IGEgYFN3YWxgIGhhcy5cbiAgICogRm9yIGV4YW1wbGUsIHRvIHNldCB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBcImZvb1wiIG9mIGB0aGlzYCB0byBcImJhclwiLCB5b3UgY2FuIGBwcml2YXRlUHJvcHMuZm9vLnNldCh0aGlzLCAnYmFyJylgXG4gICAqIFRoaXMgaXMgdGhlIGFwcHJvYWNoIHRoYXQgQmFiZWwgd2lsbCBwcm9iYWJseSB0YWtlIHRvIGltcGxlbWVudCBwcml2YXRlIG1ldGhvZHMvZmllbGRzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJpdmF0ZS1tZXRob2RzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvNzU1NVxuICAgKiBPbmNlIHdlIGhhdmUgdGhlIGNoYW5nZXMgZnJvbSB0aGF0IFBSIGluIEJhYmVsLCBhbmQgb3VyIGNvcmUgY2xhc3MgZml0cyByZWFzb25hYmxlIGluICpvbmUgbW9kdWxlKlxuICAgKiAgIHRoZW4gd2UgY2FuIHVzZSB0aGF0IGxhbmd1YWdlIGZlYXR1cmUuXG4gICAqL1xuICB2YXIgcHJpdmF0ZU1ldGhvZHMgPSB7XG4gICAgc3dhbFByb21pc2VSZXNvbHZlOiBuZXcgV2Vha01hcCgpLFxuICAgIHN3YWxQcm9taXNlUmVqZWN0OiBuZXcgV2Vha01hcCgpXG4gIH07XG5cbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBTd2VldEFsZXJ0MiBwb3B1cCBpcyBzaG93blxuICAgKi9cblxuICBjb25zdCBpc1Zpc2libGUkMSA9ICgpID0+IHtcbiAgICByZXR1cm4gaXNWaXNpYmxlKGdldFBvcHVwKCkpO1xuICB9O1xuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NvbmZpcm0nIGJ1dHRvblxuICAgKi9cblxuICBjb25zdCBjbGlja0NvbmZpcm0gPSAoKSA9PiBnZXRDb25maXJtQnV0dG9uKCkgJiYgZ2V0Q29uZmlybUJ1dHRvbigpLmNsaWNrKCk7XG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnRGVueScgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrRGVueSA9ICgpID0+IGdldERlbnlCdXR0b24oKSAmJiBnZXREZW55QnV0dG9uKCkuY2xpY2soKTtcbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdDYW5jZWwnIGJ1dHRvblxuICAgKi9cblxuICBjb25zdCBjbGlja0NhbmNlbCA9ICgpID0+IGdldENhbmNlbEJ1dHRvbigpICYmIGdldENhbmNlbEJ1dHRvbigpLmNsaWNrKCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUtleWRvd25IYW5kbGVyID0gZ2xvYmFsU3RhdGUgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0ICYmIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7Kn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3QgYWRkS2V5ZG93bkhhbmRsZXIgPSAoaW5zdGFuY2UsIGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICByZW1vdmVLZXlkb3duSGFuZGxlcihnbG9iYWxTdGF0ZSk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciA9IGUgPT4ga2V5ZG93bkhhbmRsZXIoaW5zdGFuY2UsIGUsIGRpc21pc3NXaXRoKTtcblxuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmUgPyB3aW5kb3cgOiBnZXRQb3B1cCgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmU7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5jcmVtZW50XG4gICAqL1xuXG4gIGNvbnN0IHNldEZvY3VzID0gKGlubmVyUGFyYW1zLCBpbmRleCwgaW5jcmVtZW50KSA9PiB7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpOyAvLyBzZWFyY2ggZm9yIHZpc2libGUgZWxlbWVudHMgYW5kIHNlbGVjdCB0aGUgbmV4dCBwb3NzaWJsZSBtYXRjaFxuXG4gICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSBpbmRleCArIGluY3JlbWVudDsgLy8gcm9sbG92ZXIgdG8gZmlyc3QgaXRlbVxuXG4gICAgICBpZiAoaW5kZXggPT09IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBpbmRleCA9IDA7IC8vIGdvIHRvIGxhc3QgaXRlbVxuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgaW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm9jdXNhYmxlRWxlbWVudHNbaW5kZXhdLmZvY3VzKCk7XG4gICAgfSAvLyBubyB2aXNpYmxlIGZvY3VzYWJsZSBlbGVtZW50cywgZm9jdXMgdGhlIHBvcHVwXG5cblxuICAgIGdldFBvcHVwKCkuZm9jdXMoKTtcbiAgfTtcbiAgY29uc3QgYXJyb3dLZXlzTmV4dEJ1dHRvbiA9IFsnQXJyb3dSaWdodCcsICdBcnJvd0Rvd24nXTtcbiAgY29uc3QgYXJyb3dLZXlzUHJldmlvdXNCdXR0b24gPSBbJ0Fycm93TGVmdCcsICdBcnJvd1VwJ107XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3Qga2V5ZG93bkhhbmRsZXIgPSAoaW5zdGFuY2UsIGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjsgLy8gVGhpcyBpbnN0YW5jZSBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZFxuICAgIH0gLy8gSWdub3JlIGtleWRvd24gZHVyaW5nIElNRSBjb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Eb2N1bWVudC9rZXlkb3duX2V2ZW50I2lnbm9yaW5nX2tleWRvd25fZHVyaW5nX2ltZV9jb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvNzIwXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yNDA2XG5cblxuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnN0b3BLZXlkb3duUHJvcGFnYXRpb24pIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSAvLyBFTlRFUlxuXG5cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgIGhhbmRsZUVudGVyKGluc3RhbmNlLCBlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBUQUJcbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ1RhYicpIHtcbiAgICAgIGhhbmRsZVRhYihlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBBUlJPV1MgLSBzd2l0Y2ggZm9jdXMgYmV0d2VlbiBidXR0b25zXG4gICAgZWxzZSBpZiAoWy4uLmFycm93S2V5c05leHRCdXR0b24sIC4uLmFycm93S2V5c1ByZXZpb3VzQnV0dG9uXS5pbmNsdWRlcyhlLmtleSkpIHtcbiAgICAgIGhhbmRsZUFycm93cyhlLmtleSk7XG4gICAgfSAvLyBFU0NcbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGhhbmRsZUVzYyhlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUVudGVyID0gKGluc3RhbmNlLCBlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjM4NlxuICAgIGlmICghY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFbnRlcktleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZS50YXJnZXQgJiYgaW5zdGFuY2UuZ2V0SW5wdXQoKSAmJiBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGUudGFyZ2V0Lm91dGVySFRNTCA9PT0gaW5zdGFuY2UuZ2V0SW5wdXQoKS5vdXRlckhUTUwpIHtcbiAgICAgIGlmIChbJ3RleHRhcmVhJywgJ2ZpbGUnXS5pbmNsdWRlcyhpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBkbyBub3Qgc3VibWl0XG4gICAgICB9XG5cbiAgICAgIGNsaWNrQ29uZmlybSgpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZVRhYiA9IChlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKCk7XG4gICAgbGV0IGJ0bkluZGV4ID0gLTE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGFyZ2V0RWxlbWVudCA9PT0gZm9jdXNhYmxlRWxlbWVudHNbaV0pIHtcbiAgICAgICAgYnRuSW5kZXggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IC8vIEN5Y2xlIHRvIHRoZSBuZXh0IGJ1dHRvblxuXG5cbiAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCBidG5JbmRleCwgMSk7XG4gICAgfSAvLyBDeWNsZSB0byB0aGUgcHJldiBidXR0b25cbiAgICBlbHNlIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCBidG5JbmRleCwgLTEpO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUFycm93cyA9IGtleSA9PiB7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICBjb25zdCBkZW55QnV0dG9uID0gZ2V0RGVueUJ1dHRvbigpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpO1xuXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0uaW5jbHVkZXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWJsaW5nID0gYXJyb3dLZXlzTmV4dEJ1dHRvbi5pbmNsdWRlcyhrZXkpID8gJ25leHRFbGVtZW50U2libGluZycgOiAncHJldmlvdXNFbGVtZW50U2libGluZyc7XG4gICAgbGV0IGJ1dHRvblRvRm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnZXRBY3Rpb25zKCkuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMgPSBidXR0b25Ub0ZvY3VzW3NpYmxpbmddO1xuXG4gICAgICBpZiAoIWJ1dHRvblRvRm9jdXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnV0dG9uVG9Gb2N1cyBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50ICYmIGlzVmlzaWJsZShidXR0b25Ub0ZvY3VzKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYnV0dG9uVG9Gb2N1cyBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICBidXR0b25Ub0ZvY3VzLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlRXNjID0gKGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGlmIChjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VzY2FwZUtleSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uZXNjKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogSW5zdGFuY2UgbWV0aG9kIHRvIGNsb3NlIHN3ZWV0QWxlcnRcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkge1xuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UoaW5zdGFuY2UsIGRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdG9yZUFjdGl2ZUVsZW1lbnQocmV0dXJuRm9jdXMpLnRoZW4oKCkgPT4gdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpKTtcbiAgICAgIHJlbW92ZUtleWRvd25IYW5kbGVyKGdsb2JhbFN0YXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1NhZmFyaSA9IC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIHdvcmthcm91bmQgZm9yICMyMDg4XG4gICAgLy8gZm9yIHNvbWUgcmVhc29uIHJlbW92aW5nIHRoZSBjb250YWluZXIgaW4gU2FmYXJpIHdpbGwgc2Nyb2xsIHRoZSBkb2N1bWVudCB0byBib3R0b21cblxuICAgIGlmIChpc1NhZmFyaSkge1xuICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lICFpbXBvcnRhbnQnKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICB1bmRvU2Nyb2xsYmFyKCk7XG4gICAgICB1bmRvSU9TZml4KCk7XG4gICAgICB1bnNldEFyaWFIaWRkZW4oKTtcbiAgICB9XG5cbiAgICByZW1vdmVCb2R5Q2xhc3NlcygpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQm9keUNsYXNzZXMoKSB7XG4gICAgcmVtb3ZlQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIFtzd2FsQ2xhc3Nlcy5zaG93biwgc3dhbENsYXNzZXNbJ2hlaWdodC1hdXRvJ10sIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UocmVzb2x2ZVZhbHVlKSB7XG4gICAgcmVzb2x2ZVZhbHVlID0gcHJlcGFyZVJlc29sdmVWYWx1ZShyZXNvbHZlVmFsdWUpO1xuICAgIGNvbnN0IHN3YWxQcm9taXNlUmVzb2x2ZSA9IHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5nZXQodGhpcyk7XG4gICAgY29uc3QgZGlkQ2xvc2UgPSB0cmlnZ2VyQ2xvc2VQb3B1cCh0aGlzKTtcblxuICAgIGlmICh0aGlzLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIC8vIEEgc3dhbCBhd2FpdGluZyBmb3IgYSBwcm9taXNlIChhZnRlciBhIGNsaWNrIG9uIENvbmZpcm0gb3IgRGVueSkgY2Fubm90IGJlIGRpc21pc3NlZCBhbnltb3JlICMyMzM1XG4gICAgICBpZiAoIXJlc29sdmVWYWx1ZS5pc0Rpc21pc3NlZCkge1xuICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UodGhpcyk7XG4gICAgICAgIHN3YWxQcm9taXNlUmVzb2x2ZShyZXNvbHZlVmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlkQ2xvc2UpIHtcbiAgICAgIC8vIFJlc29sdmUgU3dhbCBwcm9taXNlXG4gICAgICBzd2FsUHJvbWlzZVJlc29sdmUocmVzb2x2ZVZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaXNBd2FpdGluZ1Byb21pc2UoKSB7XG4gICAgcmV0dXJuICEhcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5nZXQodGhpcyk7XG4gIH1cblxuICBjb25zdCB0cmlnZ2VyQ2xvc2VQb3B1cCA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMgfHwgaGFzQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5wb3B1cCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTtcbiAgICBhZGRDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKTtcbiAgICBjb25zdCBiYWNrZHJvcCA9IGdldENvbnRhaW5lcigpO1xuICAgIHJlbW92ZUNsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MuYmFja2Ryb3ApO1xuICAgIGFkZENsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MuYmFja2Ryb3ApO1xuICAgIGhhbmRsZVBvcHVwQW5pbWF0aW9uKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlamVjdFByb21pc2UoZXJyb3IpIHtcbiAgICBjb25zdCByZWplY3RQcm9taXNlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3QuZ2V0KHRoaXMpO1xuICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZSh0aGlzKTtcblxuICAgIGlmIChyZWplY3RQcm9taXNlKSB7XG4gICAgICAvLyBSZWplY3QgU3dhbCBwcm9taXNlXG4gICAgICByZWplY3RQcm9taXNlKGVycm9yKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaGFuZGxlQXdhaXRpbmdQcm9taXNlID0gaW5zdGFuY2UgPT4ge1xuICAgIGlmIChpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSgpKSB7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLmRlbGV0ZShpbnN0YW5jZSk7IC8vIFRoZSBpbnN0YW5jZSBtaWdodCBoYXZlIGJlZW4gcHJldmlvdXNseSBwYXJ0bHkgZGVzdHJveWVkLCB3ZSBtdXN0IHJlc3VtZSB0aGUgZGVzdHJveSBwcm9jZXNzIGluIHRoaXMgY2FzZSAjMjMzNVxuXG4gICAgICBpZiAoIXByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpKSB7XG4gICAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHByZXBhcmVSZXNvbHZlVmFsdWUgPSByZXNvbHZlVmFsdWUgPT4ge1xuICAgIC8vIFdoZW4gdXNlciBjYWxscyBTd2FsLmNsb3NlKClcbiAgICBpZiAodHlwZW9mIHJlc29sdmVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgICAgaXNEZW5pZWQ6IGZhbHNlLFxuICAgICAgICBpc0Rpc21pc3NlZDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpc0NvbmZpcm1lZDogZmFsc2UsXG4gICAgICBpc0RlbmllZDogZmFsc2UsXG4gICAgICBpc0Rpc21pc3NlZDogZmFsc2VcbiAgICB9LCByZXNvbHZlVmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvcHVwQW5pbWF0aW9uID0gKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTsgLy8gSWYgYW5pbWF0aW9uIGlzIHN1cHBvcnRlZCwgYW5pbWF0ZVxuXG4gICAgY29uc3QgYW5pbWF0aW9uSXNTdXBwb3J0ZWQgPSBhbmltYXRpb25FbmRFdmVudCAmJiBoYXNDc3NBbmltYXRpb24ocG9wdXApO1xuXG4gICAgaWYgKHR5cGVvZiBpbm5lclBhcmFtcy53aWxsQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlubmVyUGFyYW1zLndpbGxDbG9zZShwb3B1cCk7XG4gICAgfVxuXG4gICAgaWYgKGFuaW1hdGlvbklzU3VwcG9ydGVkKSB7XG4gICAgICBhbmltYXRlUG9wdXAoaW5zdGFuY2UsIHBvcHVwLCBjb250YWluZXIsIGlubmVyUGFyYW1zLnJldHVybkZvY3VzLCBpbm5lclBhcmFtcy5kaWRDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgcmVtb3ZlIGltbWVkaWF0ZWx5XG4gICAgICByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUoaW5zdGFuY2UsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYW5pbWF0ZVBvcHVwID0gKGluc3RhbmNlLCBwb3B1cCwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2sgPSByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUuYmluZChudWxsLCBpbnN0YW5jZSwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpO1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IHBvcHVwKSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaygpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UgPSAoaW5zdGFuY2UsIGRpZENsb3NlKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGRpZENsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRpZENsb3NlLmJpbmQoaW5zdGFuY2UucGFyYW1zKSgpO1xuICAgICAgfVxuXG4gICAgICBpbnN0YW5jZS5fZGVzdHJveSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNldEJ1dHRvbnNEaXNhYmxlZChpbnN0YW5jZSwgYnV0dG9ucywgZGlzYWJsZWQpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UpO1xuICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgZG9tQ2FjaGVbYnV0dG9uXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5wdXREaXNhYmxlZChpbnB1dCwgZGlzYWJsZWQpIHtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IHJhZGlvc0NvbnRhaW5lciA9IGlucHV0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByYWRpb3NbaV0uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVCdXR0b25zKCkge1xuICAgIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnZGVueUJ1dHRvbicsICdjYW5jZWxCdXR0b24nXSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKCkge1xuICAgIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnZGVueUJ1dHRvbicsICdjYW5jZWxCdXR0b24nXSwgdHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gZW5hYmxlSW5wdXQoKSB7XG4gICAgcmV0dXJuIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUlucHV0KCkge1xuICAgIHJldHVybiBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93VmFsaWRhdGlvbk1lc3NhZ2UoZXJyb3IpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgY29uc3QgcGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgICBzZXRJbm5lckh0bWwoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UsIGVycm9yKTtcbiAgICBkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZS5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ107XG5cbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgYWRkQ2xhc3MoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UsIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgc2hvdyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0KCk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgdHJ1ZSk7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgICBhZGRDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9IC8vIEhpZGUgYmxvY2sgd2l0aCB2YWxpZGF0aW9uIG1lc3NhZ2VcblxuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25NZXNzYWdlJDEoKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTtcbiAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgcmVtb3ZlQ2xhc3MoaW5wdXQsIHN3YWxDbGFzc2VzLmlucHV0ZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb2dyZXNzU3RlcHMkMSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgcmV0dXJuIGRvbUNhY2hlLnByb2dyZXNzU3RlcHM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBwb3B1cCBwYXJhbWV0ZXJzLlxuICAgKi9cblxuICBmdW5jdGlvbiB1cGRhdGUocGFyYW1zKSB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghcG9wdXAgfHwgaGFzQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5wb3B1cCkpIHtcbiAgICAgIHJldHVybiB3YXJuKFwiWW91J3JlIHRyeWluZyB0byB1cGRhdGUgdGhlIGNsb3NlZCBvciBjbG9zaW5nIHBvcHVwLCB0aGF0IHdvbid0IHdvcmsuIFVzZSB0aGUgdXBkYXRlKCkgbWV0aG9kIGluIHByZUNvbmZpcm0gcGFyYW1ldGVyIG9yIHNob3cgYSBuZXcgcG9wdXAuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0gZmlsdGVyVmFsaWRQYXJhbXMocGFyYW1zKTtcbiAgICBjb25zdCB1cGRhdGVkUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgaW5uZXJQYXJhbXMsIHZhbGlkVXBkYXRhYmxlUGFyYW1zKTtcbiAgICByZW5kZXIodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldCh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyYW1zLCBwYXJhbXMpLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGZpbHRlclZhbGlkUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCB2YWxpZFVwZGF0YWJsZVBhcmFtcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBpZiAoaXNVcGRhdGFibGVQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICAgIHZhbGlkVXBkYXRhYmxlUGFyYW1zW3BhcmFtXSA9IHBhcmFtc1twYXJhbV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YXJuKFwiSW52YWxpZCBwYXJhbWV0ZXIgdG8gdXBkYXRlOiBcIi5jb25jYXQocGFyYW0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsaWRVcGRhdGFibGVQYXJhbXM7XG4gIH07XG5cbiAgZnVuY3Rpb24gX2Rlc3Ryb3koKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIGRpc3Bvc2VXZWFrTWFwcyh0aGlzKTsgLy8gVGhlIFdlYWtNYXBzIG1pZ2h0IGhhdmUgYmVlbiBwYXJ0bHkgZGVzdHJveWVkLCB3ZSBtdXN0IHJlY2FsbCBpdCB0byBkaXNwb3NlIGFueSByZW1haW5pbmcgV2Vha01hcHMgIzIzMzVcblxuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfSAvLyBDaGVjayBpZiB0aGVyZSBpcyBhbm90aGVyIFN3YWwgY2xvc2luZ1xuXG5cbiAgICBpZiAoZG9tQ2FjaGUucG9wdXAgJiYgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2soKTtcbiAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbm5lclBhcmFtcy5kaWREZXN0cm95ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpbm5lclBhcmFtcy5kaWREZXN0cm95KCk7XG4gICAgfVxuXG4gICAgZGlzcG9zZVN3YWwodGhpcyk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG4gIGNvbnN0IGRpc3Bvc2VTd2FsID0gaW5zdGFuY2UgPT4ge1xuICAgIGRpc3Bvc2VXZWFrTWFwcyhpbnN0YW5jZSk7IC8vIFVuc2V0IHRoaXMucGFyYW1zIHNvIEdDIHdpbGwgZGlzcG9zZSBpdCAoIzE1NjkpXG4gICAgLy8gQHRzLWlnbm9yZVxuXG4gICAgZGVsZXRlIGluc3RhbmNlLnBhcmFtczsgLy8gVW5zZXQgZ2xvYmFsU3RhdGUgcHJvcHMgc28gR0Mgd2lsbCBkaXNwb3NlIGdsb2JhbFN0YXRlICgjMTU2OSlcblxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlcjtcbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldDsgLy8gVW5zZXQgY3VycmVudEluc3RhbmNlXG5cbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cblxuICBjb25zdCBkaXNwb3NlV2Vha01hcHMgPSBpbnN0YW5jZSA9PiB7XG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgaW5zdGFuY2UgaXMgYXdhaXRpbmcgYSBwcm9taXNlIHJlc3VsdCwgd2Uga2VlcCB0aGUgcHJpdmF0ZU1ldGhvZHMgdG8gY2FsbCB0aGVtIG9uY2UgdGhlIHByb21pc2UgcmVzdWx0IGlzIHJldHJpZXZlZCAjMjMzNVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlTWV0aG9kcywgaW5zdGFuY2UpO1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG5cbiAgY29uc3QgdW5zZXRXZWFrTWFwcyA9IChvYmosIGluc3RhbmNlKSA9PiB7XG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgb2JqW2ldLmRlbGV0ZShpbnN0YW5jZSk7XG4gICAgfVxuICB9O1xuXG5cblxuICB2YXIgaW5zdGFuY2VNZXRob2RzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGhpZGVMb2FkaW5nOiBoaWRlTG9hZGluZyxcbiAgICBkaXNhYmxlTG9hZGluZzogaGlkZUxvYWRpbmcsXG4gICAgZ2V0SW5wdXQ6IGdldElucHV0JDEsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGlzQXdhaXRpbmdQcm9taXNlOiBpc0F3YWl0aW5nUHJvbWlzZSxcbiAgICByZWplY3RQcm9taXNlOiByZWplY3RQcm9taXNlLFxuICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZTogaGFuZGxlQXdhaXRpbmdQcm9taXNlLFxuICAgIGNsb3NlUG9wdXA6IGNsb3NlLFxuICAgIGNsb3NlTW9kYWw6IGNsb3NlLFxuICAgIGNsb3NlVG9hc3Q6IGNsb3NlLFxuICAgIGVuYWJsZUJ1dHRvbnM6IGVuYWJsZUJ1dHRvbnMsXG4gICAgZGlzYWJsZUJ1dHRvbnM6IGRpc2FibGVCdXR0b25zLFxuICAgIGVuYWJsZUlucHV0OiBlbmFibGVJbnB1dCxcbiAgICBkaXNhYmxlSW5wdXQ6IGRpc2FibGVJbnB1dCxcbiAgICBzaG93VmFsaWRhdGlvbk1lc3NhZ2U6IHNob3dWYWxpZGF0aW9uTWVzc2FnZSxcbiAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlOiByZXNldFZhbGlkYXRpb25NZXNzYWdlJDEsXG4gICAgZ2V0UHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcyQxLFxuICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgIF9kZXN0cm95OiBfZGVzdHJveVxuICB9KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybUJ1dHRvbkNsaWNrID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgaGFuZGxlQ29uZmlybU9yRGVueVdpdGhJbnB1dChpbnN0YW5jZSwgJ2NvbmZpcm0nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybShpbnN0YW5jZSwgdHJ1ZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlRGVueUJ1dHRvbkNsaWNrID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5yZXR1cm5JbnB1dFZhbHVlT25EZW55KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnZGVueScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2sgPSAoaW5zdGFuY2UsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcbiAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNhbmNlbCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55J30gdHlwZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0ID0gKGluc3RhbmNlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIGVycm9yKFwiVGhlIFxcXCJpbnB1dFxcXCIgcGFyYW1ldGVyIGlzIG5lZWRlZCB0byBiZSBzZXQgd2hlbiB1c2luZyByZXR1cm5JbnB1dFZhbHVlT25cIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IGdldElucHV0VmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgaGFuZGxlSW5wdXRWYWxpZGF0b3IoaW5zdGFuY2UsIGlucHV0VmFsdWUsIHR5cGUpO1xuICAgIH0gZWxzZSBpZiAoIWluc3RhbmNlLmdldElucHV0KCkuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICBpbnN0YW5jZS5lbmFibGVCdXR0b25zKCk7XG4gICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlbnknKSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0VmFsdWVcbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueSd9IHR5cGVcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVJbnB1dFZhbGlkYXRvciA9IChpbnN0YW5jZSwgaW5wdXRWYWx1ZSwgdHlwZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUlucHV0KCk7XG4gICAgY29uc3QgdmFsaWRhdGlvblByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcihpbnB1dFZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICB2YWxpZGF0aW9uUHJvbWlzZS50aGVuKHZhbGlkYXRpb25NZXNzYWdlID0+IHtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnMoKTtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUlucHV0KCk7XG5cbiAgICAgIGlmICh2YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UodmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgICAgZGVueShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IGRlbnkgPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuc2hvd0xvYWRlck9uRGVueSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0RGVueUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMucHJlRGVueSkge1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCB0cnVlKTsgLy8gRmxhZ2dpbmcgdGhlIGluc3RhbmNlIGFzIGF3YWl0aW5nIGEgcHJvbWlzZSBzbyBpdCdzIG93biBwcm9taXNlJ3MgcmVqZWN0L3Jlc29sdmUgbWV0aG9kcyBkb2Vzbid0IGdldCBkZXN0cm95ZWQgdW50aWwgdGhlIHJlc3VsdCBmcm9tIHRoaXMgcHJlRGVueSdzIHByb21pc2UgaXMgcmVjZWl2ZWRcblxuICAgICAgY29uc3QgcHJlRGVueVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5wcmVEZW55KHZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICAgIHByZURlbnlQcm9taXNlLnRoZW4ocHJlRGVueVZhbHVlID0+IHtcbiAgICAgICAgaWYgKHByZURlbnlWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZShpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgICAgICAgaXNEZW5pZWQ6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdHlwZW9mIHByZURlbnlWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZSA6IHByZURlbnlWYWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciQkMSA9PiByZWplY3RXaXRoKGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgZXJyb3IkJDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgICBpc0RlbmllZDogdHJ1ZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IHN1Y2NlZWRXaXRoID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgIGlzQ29uZmlybWVkOiB0cnVlLFxuICAgICAgdmFsdWVcbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvclxuICAgKi9cblxuXG4gIGNvbnN0IHJlamVjdFdpdGggPSAoaW5zdGFuY2UsIGVycm9yJCQxKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGluc3RhbmNlLnJlamVjdFByb21pc2UoZXJyb3IkJDEpO1xuICB9O1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3QgY29uZmlybSA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtKSB7XG4gICAgICBzaG93TG9hZGluZygpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVDb25maXJtKSB7XG4gICAgICBpbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIHRydWUpOyAvLyBGbGFnZ2luZyB0aGUgaW5zdGFuY2UgYXMgYXdhaXRpbmcgYSBwcm9taXNlIHNvIGl0J3Mgb3duIHByb21pc2UncyByZWplY3QvcmVzb2x2ZSBtZXRob2RzIGRvZXNuJ3QgZ2V0IGRlc3Ryb3llZCB1bnRpbCB0aGUgcmVzdWx0IGZyb20gdGhpcyBwcmVDb25maXJtJ3MgcHJvbWlzZSBpcyByZWNlaXZlZFxuXG4gICAgICBjb25zdCBwcmVDb25maXJtUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLnByZUNvbmZpcm0odmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgICAgcHJlQ29uZmlybVByb21pc2UudGhlbihwcmVDb25maXJtVmFsdWUgPT4ge1xuICAgICAgICBpZiAoaXNWaXNpYmxlKGdldFZhbGlkYXRpb25NZXNzYWdlKCkpIHx8IHByZUNvbmZpcm1WYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZShpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3VjY2VlZFdpdGgoaW5zdGFuY2UsIHR5cGVvZiBwcmVDb25maXJtVmFsdWUgPT09ICd1bmRlZmluZWQnID8gdmFsdWUgOiBwcmVDb25maXJtVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciQkMSA9PiByZWplY3RXaXRoKGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgZXJyb3IkJDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZFdpdGgoaW5zdGFuY2UsIHZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUG9wdXBDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgaGFuZGxlVG9hc3RDbGljayhpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIHBvcHVwIGJ1dCBtb3VzZXVwIG9uIHRoZSBjb250YWluZXJcbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHRoZSB1c2VyIGRyYWdzIGEgc2xpZGVyXG4gICAgICBoYW5kbGVNb2RhbE1vdXNlZG93bihkb21DYWNoZSk7IC8vIElnbm9yZSBjbGljayBldmVudHMgdGhhdCBoYWQgbW91c2Vkb3duIG9uIHRoZSBjb250YWluZXIgYnV0IG1vdXNldXAgb24gdGhlIHBvcHVwXG5cbiAgICAgIGhhbmRsZUNvbnRhaW5lck1vdXNlZG93bihkb21DYWNoZSk7XG4gICAgICBoYW5kbGVNb2RhbENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVUb2FzdENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICAvLyBDbG9zaW5nIHRvYXN0IGJ5IGludGVybmFsIGNsaWNrXG4gICAgZG9tQ2FjaGUucG9wdXAub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICAgIGlmIChpbm5lclBhcmFtcyAmJiAoaXNBbnlCdXR0b25TaG93bihpbm5lclBhcmFtcykgfHwgaW5uZXJQYXJhbXMudGltZXIgfHwgaW5uZXJQYXJhbXMuaW5wdXQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jbG9zZSk7XG4gICAgfTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgaXNBbnlCdXR0b25TaG93biA9IGlubmVyUGFyYW1zID0+IHtcbiAgICByZXR1cm4gaW5uZXJQYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0RlbnlCdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2xvc2VCdXR0b247XG4gIH07XG5cbiAgbGV0IGlnbm9yZU91dHNpZGVDbGljayA9IGZhbHNlO1xuXG4gIGNvbnN0IGhhbmRsZU1vZGFsTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNldXAgPSB1bmRlZmluZWQ7IC8vIFdlIG9ubHkgY2hlY2sgaWYgdGhlIG1vdXNldXAgdGFyZ2V0IGlzIHRoZSBjb250YWluZXIgYmVjYXVzZSB1c3VhbGx5IGl0IGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSBhbnkgb3RoZXIgZGlyZWN0IGNoaWxkcmVuIGFzaWRlIG9mIHRoZSBwb3B1cFxuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUNvbnRhaW5lck1vdXNlZG93biA9IGRvbUNhY2hlID0+IHtcbiAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZWRvd24gPSAoKSA9PiB7XG4gICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSB1bmRlZmluZWQ7IC8vIFdlIGFsc28gbmVlZCB0byBjaGVjayBpZiB0aGUgbW91c2V1cCB0YXJnZXQgaXMgYSBjaGlsZCBvZiB0aGUgcG9wdXBcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLnBvcHVwIHx8IGRvbUNhY2hlLnBvcHVwLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVNb2RhbENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBkb21DYWNoZS5jb250YWluZXIub25jbGljayA9IGUgPT4ge1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgICAgaWYgKGlnbm9yZU91dHNpZGVDbGljaykge1xuICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lciAmJiBjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd091dHNpZGVDbGljaykpIHtcbiAgICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5iYWNrZHJvcCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBpc0pxdWVyeUVsZW1lbnQgPSBlbGVtID0+IHR5cGVvZiBlbGVtID09PSAnb2JqZWN0JyAmJiBlbGVtLmpxdWVyeTtcblxuICBjb25zdCBpc0VsZW1lbnQgPSBlbGVtID0+IGVsZW0gaW5zdGFuY2VvZiBFbGVtZW50IHx8IGlzSnF1ZXJ5RWxlbWVudChlbGVtKTtcblxuICBjb25zdCBhcmdzVG9QYXJhbXMgPSBhcmdzID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCcgJiYgIWlzRWxlbWVudChhcmdzWzBdKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbXMsIGFyZ3NbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBbJ3RpdGxlJywgJ2h0bWwnLCAnaWNvbiddLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaW5kZXhdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCBpc0VsZW1lbnQoYXJnKSkge1xuICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIFwiLmNvbmNhdChuYW1lLCBcIiEgRXhwZWN0ZWQgXFxcInN0cmluZ1xcXCIgb3IgXFxcIkVsZW1lbnRcXFwiLCBnb3QgXCIpLmNvbmNhdCh0eXBlb2YgYXJnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmlyZSgpIHtcbiAgICBjb25zdCBTd2FsID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3dhbCguLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGV4dGVuZGVkIHZlcnNpb24gb2YgYFN3YWxgIGNvbnRhaW5pbmcgYHBhcmFtc2AgYXMgZGVmYXVsdHMuXG4gICAqIFVzZWZ1bCBmb3IgcmV1c2luZyBTd2FsIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBCZWZvcmU6XG4gICAqIGNvbnN0IHRleHRQcm9tcHRPcHRpb25zID0geyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH1cbiAgICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JyB9KVxuICAgKiBjb25zdCB7dmFsdWU6IGxhc3ROYW1lfSA9IGF3YWl0IFN3YWwuZmlyZSh7IC4uLnRleHRQcm9tcHRPcHRpb25zLCB0aXRsZTogJ1doYXQgaXMgeW91ciBsYXN0IG5hbWU/JyB9KVxuICAgKlxuICAgKiBBZnRlcjpcbiAgICogY29uc3QgVGV4dFByb21wdCA9IFN3YWwubWl4aW4oeyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH0pXG4gICAqIGNvbnN0IHt2YWx1ZTogZmlyc3ROYW1lfSA9IGF3YWl0IFRleHRQcm9tcHQoJ1doYXQgaXMgeW91ciBmaXJzdCBuYW1lPycpXG4gICAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nKVxuICAgKlxuICAgKiBAcGFyYW0gbWl4aW5QYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKG1peGluUGFyYW1zKSB7XG4gICAgY2xhc3MgTWl4aW5Td2FsIGV4dGVuZHMgdGhpcyB7XG4gICAgICBfbWFpbihwYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9tYWluKHBhcmFtcywgT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBNaXhpblN3YWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXMgc2V0LCByZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIE90aGVyd2lzZSwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IGdldFRpbWVyTGVmdCA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dCAmJiBnbG9iYWxTdGF0ZS50aW1lb3V0LmdldFRpbWVyTGVmdCgpO1xuICB9O1xuICAvKipcbiAgICogU3RvcCB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCBzdG9wVGltZXIgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIHN0b3BUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dC5zdG9wKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IHJlc3VtZVRpbWVyID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBjb25zdCByZW1haW5pbmcgPSBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0YXJ0KCk7XG4gICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0JhcihyZW1haW5pbmcpO1xuICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlVGltZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZXIgPSBnbG9iYWxTdGF0ZS50aW1lb3V0O1xuICAgIHJldHVybiB0aW1lciAmJiAodGltZXIucnVubmluZyA/IHN0b3BUaW1lcigpIDogcmVzdW1lVGltZXIoKSk7XG4gIH07XG4gIC8qKlxuICAgKiBJbmNyZWFzZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIGFuIHVwZGF0ZWQgdGltZXIuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IGluY3JlYXNlVGltZXIgPSBuID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5pbmNyZWFzZShuKTtcbiAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKHJlbWFpbmluZywgdHJ1ZSk7XG4gICAgICByZXR1cm4gcmVtYWluaW5nO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRpbWVyIGlzIHJ1bm5pbmcuIFJldHVybnMgdHJ1ZSBpZiB0aW1lciBpcyBydW5uaW5nXG4gICAqIG9yIGZhbHNlIGlmIHRpbWVyIGlzIHBhdXNlZCBvciBzdG9wcGVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkXG4gICAqL1xuXG4gIGNvbnN0IGlzVGltZXJSdW5uaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlLnRpbWVvdXQuaXNSdW5uaW5nKCk7XG4gIH07XG5cbiAgbGV0IGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSBmYWxzZTtcbiAgY29uc3QgY2xpY2tIYW5kbGVycyA9IHt9O1xuICBmdW5jdGlvbiBiaW5kQ2xpY2tIYW5kbGVyKCkge1xuICAgIGxldCBhdHRyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnZGF0YS1zd2FsLXRlbXBsYXRlJztcbiAgICBjbGlja0hhbmRsZXJzW2F0dHJdID0gdGhpcztcblxuICAgIGlmICghYm9keUNsaWNrTGlzdGVuZXJBZGRlZCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJvZHlDbGlja0xpc3RlbmVyKTtcbiAgICAgIGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJvZHlDbGlja0xpc3RlbmVyID0gZXZlbnQgPT4ge1xuICAgIGZvciAobGV0IGVsID0gZXZlbnQudGFyZ2V0OyBlbCAmJiBlbCAhPT0gZG9jdW1lbnQ7IGVsID0gZWwucGFyZW50Tm9kZSkge1xuICAgICAgZm9yIChjb25zdCBhdHRyIGluIGNsaWNrSGFuZGxlcnMpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgY2xpY2tIYW5kbGVyc1thdHRyXS5maXJlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cblxuICB2YXIgc3RhdGljTWV0aG9kcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBpc1ZhbGlkUGFyYW1ldGVyOiBpc1ZhbGlkUGFyYW1ldGVyLFxuICAgIGlzVXBkYXRhYmxlUGFyYW1ldGVyOiBpc1VwZGF0YWJsZVBhcmFtZXRlcixcbiAgICBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXI6IGlzRGVwcmVjYXRlZFBhcmFtZXRlcixcbiAgICBhcmdzVG9QYXJhbXM6IGFyZ3NUb1BhcmFtcyxcbiAgICBpc1Zpc2libGU6IGlzVmlzaWJsZSQxLFxuICAgIGNsaWNrQ29uZmlybTogY2xpY2tDb25maXJtLFxuICAgIGNsaWNrRGVueTogY2xpY2tEZW55LFxuICAgIGNsaWNrQ2FuY2VsOiBjbGlja0NhbmNlbCxcbiAgICBnZXRDb250YWluZXI6IGdldENvbnRhaW5lcixcbiAgICBnZXRQb3B1cDogZ2V0UG9wdXAsXG4gICAgZ2V0VGl0bGU6IGdldFRpdGxlLFxuICAgIGdldEh0bWxDb250YWluZXI6IGdldEh0bWxDb250YWluZXIsXG4gICAgZ2V0SW1hZ2U6IGdldEltYWdlLFxuICAgIGdldEljb246IGdldEljb24sXG4gICAgZ2V0SW5wdXRMYWJlbDogZ2V0SW5wdXRMYWJlbCxcbiAgICBnZXRDbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24sXG4gICAgZ2V0QWN0aW9uczogZ2V0QWN0aW9ucyxcbiAgICBnZXRDb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uLFxuICAgIGdldERlbnlCdXR0b246IGdldERlbnlCdXR0b24sXG4gICAgZ2V0Q2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24sXG4gICAgZ2V0TG9hZGVyOiBnZXRMb2FkZXIsXG4gICAgZ2V0Rm9vdGVyOiBnZXRGb290ZXIsXG4gICAgZ2V0VGltZXJQcm9ncmVzc0JhcjogZ2V0VGltZXJQcm9ncmVzc0JhcixcbiAgICBnZXRGb2N1c2FibGVFbGVtZW50czogZ2V0Rm9jdXNhYmxlRWxlbWVudHMsXG4gICAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlLFxuICAgIGlzTG9hZGluZzogaXNMb2FkaW5nLFxuICAgIGZpcmU6IGZpcmUsXG4gICAgbWl4aW46IG1peGluLFxuICAgIHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBlbmFibGVMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBnZXRUaW1lckxlZnQ6IGdldFRpbWVyTGVmdCxcbiAgICBzdG9wVGltZXI6IHN0b3BUaW1lcixcbiAgICByZXN1bWVUaW1lcjogcmVzdW1lVGltZXIsXG4gICAgdG9nZ2xlVGltZXI6IHRvZ2dsZVRpbWVyLFxuICAgIGluY3JlYXNlVGltZXI6IGluY3JlYXNlVGltZXIsXG4gICAgaXNUaW1lclJ1bm5pbmc6IGlzVGltZXJSdW5uaW5nLFxuICAgIGJpbmRDbGlja0hhbmRsZXI6IGJpbmRDbGlja0hhbmRsZXJcbiAgfSk7XG5cbiAgbGV0IGN1cnJlbnRJbnN0YW5jZTtcblxuICBjbGFzcyBTd2VldEFsZXJ0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vIFByZXZlbnQgcnVuIGluIE5vZGUgZW52XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50SW5zdGFuY2UgPSB0aGlzOyAvLyBAdHMtaWdub3JlXG5cbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXRlclBhcmFtcyA9IE9iamVjdC5mcmVlemUodGhpcy5jb25zdHJ1Y3Rvci5hcmdzVG9QYXJhbXMoYXJncykpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICB2YWx1ZTogb3V0ZXJQYXJhbXMsXG4gICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pOyAvLyBAdHMtaWdub3JlXG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBjdXJyZW50SW5zdGFuY2UuX21haW4oY3VycmVudEluc3RhbmNlLnBhcmFtcyk7XG5cbiAgICAgIHByaXZhdGVQcm9wcy5wcm9taXNlLnNldCh0aGlzLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBfbWFpbih1c2VyUGFyYW1zKSB7XG4gICAgICBsZXQgbWl4aW5QYXJhbXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgc2hvd1dhcm5pbmdzRm9yUGFyYW1zKE9iamVjdC5hc3NpZ24oe30sIG1peGluUGFyYW1zLCB1c2VyUGFyYW1zKSk7XG5cbiAgICAgIGlmIChnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UuX2Rlc3Ryb3koKTtcblxuICAgICAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICAgICAgdW5zZXRBcmlhSGlkZGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlID0gY3VycmVudEluc3RhbmNlO1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcmVwYXJlUGFyYW1zKHVzZXJQYXJhbXMsIG1peGluUGFyYW1zKTtcbiAgICAgIHNldFBhcmFtZXRlcnMoaW5uZXJQYXJhbXMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShpbm5lclBhcmFtcyk7IC8vIGNsZWFyIHRoZSBwcmV2aW91cyB0aW1lclxuXG4gICAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgICBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlLnRpbWVvdXQ7XG4gICAgICB9IC8vIGNsZWFyIHRoZSByZXN0b3JlIGZvY3VzIHRpbWVvdXRcblxuXG4gICAgICBjbGVhclRpbWVvdXQoZ2xvYmFsU3RhdGUucmVzdG9yZUZvY3VzVGltZW91dCk7XG4gICAgICBjb25zdCBkb21DYWNoZSA9IHBvcHVsYXRlRG9tQ2FjaGUoY3VycmVudEluc3RhbmNlKTtcbiAgICAgIHJlbmRlcihjdXJyZW50SW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5zZXQoY3VycmVudEluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICByZXR1cm4gc3dhbFByb21pc2UoY3VycmVudEluc3RhbmNlLCBkb21DYWNoZSwgaW5uZXJQYXJhbXMpO1xuICAgIH0gLy8gYGNhdGNoYCBjYW5ub3QgYmUgdGhlIG5hbWUgb2YgYSBtb2R1bGUgZXhwb3J0LCBzbyB3ZSBkZWZpbmUgb3VyIHRoZW5hYmxlIG1ldGhvZHMgaGVyZSBpbnN0ZWFkXG5cblxuICAgIHRoZW4ob25GdWxmaWxsZWQpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBwcml2YXRlUHJvcHMucHJvbWlzZS5nZXQodGhpcyk7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG9uRnVsZmlsbGVkKTtcbiAgICB9XG5cbiAgICBmaW5hbGx5KG9uRmluYWxseSkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHByaXZhdGVQcm9wcy5wcm9taXNlLmdldCh0aGlzKTtcbiAgICAgIHJldHVybiBwcm9taXNlLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICB9XG5cbiAgfVxuXG4gIGNvbnN0IHN3YWxQcm9taXNlID0gKGluc3RhbmNlLCBkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gZnVuY3Rpb25zIHRvIGhhbmRsZSBhbGwgY2xvc2luZ3MvZGlzbWlzc2Fsc1xuICAgICAgY29uc3QgZGlzbWlzc1dpdGggPSBkaXNtaXNzID0+IHtcbiAgICAgICAgaW5zdGFuY2UuY2xvc2VQb3B1cCh7XG4gICAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWUsXG4gICAgICAgICAgZGlzbWlzc1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5zZXQoaW5zdGFuY2UsIHJlc29sdmUpO1xuICAgICAgcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3Quc2V0KGluc3RhbmNlLCByZWplY3QpO1xuXG4gICAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBoYW5kbGVDb25maXJtQnV0dG9uQ2xpY2soaW5zdGFuY2UpO1xuXG4gICAgICBkb21DYWNoZS5kZW55QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBoYW5kbGVEZW55QnV0dG9uQ2xpY2soaW5zdGFuY2UpO1xuXG4gICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZUNhbmNlbEJ1dHRvbkNsaWNrKGluc3RhbmNlLCBkaXNtaXNzV2l0aCk7XG5cbiAgICAgIGRvbUNhY2hlLmNsb3NlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcblxuICAgICAgaGFuZGxlUG9wdXBDbGljayhpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKTtcbiAgICAgIGFkZEtleWRvd25IYW5kbGVyKGluc3RhbmNlLCBnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICAgIGhhbmRsZUlucHV0T3B0aW9uc0FuZFZhbHVlKGluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICBvcGVuUG9wdXAoaW5uZXJQYXJhbXMpO1xuICAgICAgc2V0dXBUaW1lcihnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICAgIGluaXRGb2N1cyhkb21DYWNoZSwgaW5uZXJQYXJhbXMpOyAvLyBTY3JvbGwgY29udGFpbmVyIHRvIHRvcCBvbiBvcGVuICgjMTI0NywgIzE5NDYpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkb21DYWNoZS5jb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHByZXBhcmVQYXJhbXMgPSAodXNlclBhcmFtcywgbWl4aW5QYXJhbXMpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZVBhcmFtcyA9IGdldFRlbXBsYXRlUGFyYW1zKHVzZXJQYXJhbXMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMsIG1peGluUGFyYW1zLCB0ZW1wbGF0ZVBhcmFtcywgdXNlclBhcmFtcyk7IC8vIHByZWNlZGVuY2UgaXMgZGVzY3JpYmVkIGluICMyMTMxXG5cbiAgICBwYXJhbXMuc2hvd0NsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcy5zaG93Q2xhc3MsIHBhcmFtcy5zaG93Q2xhc3MpO1xuICAgIHBhcmFtcy5oaWRlQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLmhpZGVDbGFzcywgcGFyYW1zLmhpZGVDbGFzcyk7XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEByZXR1cm5zIHtEb21DYWNoZX1cbiAgICovXG5cblxuICBjb25zdCBwb3B1bGF0ZURvbUNhY2hlID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGRvbUNhY2hlID0ge1xuICAgICAgcG9wdXA6IGdldFBvcHVwKCksXG4gICAgICBjb250YWluZXI6IGdldENvbnRhaW5lcigpLFxuICAgICAgYWN0aW9uczogZ2V0QWN0aW9ucygpLFxuICAgICAgY29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbigpLFxuICAgICAgZGVueUJ1dHRvbjogZ2V0RGVueUJ1dHRvbigpLFxuICAgICAgY2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24oKSxcbiAgICAgIGxvYWRlcjogZ2V0TG9hZGVyKCksXG4gICAgICBjbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24oKSxcbiAgICAgIHZhbGlkYXRpb25NZXNzYWdlOiBnZXRWYWxpZGF0aW9uTWVzc2FnZSgpLFxuICAgICAgcHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcygpXG4gICAgfTtcbiAgICBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuc2V0KGluc3RhbmNlLCBkb21DYWNoZSk7XG4gICAgcmV0dXJuIGRvbUNhY2hlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cblxuICBjb25zdCBzZXR1cFRpbWVyID0gKGdsb2JhbFN0YXRlJCQxLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGhpZGUodGltZXJQcm9ncmVzc0Jhcik7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMudGltZXIpIHtcbiAgICAgIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgICBkaXNtaXNzV2l0aCgndGltZXInKTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQ7XG4gICAgICB9LCBpbm5lclBhcmFtcy50aW1lcik7XG5cbiAgICAgIGlmIChpbm5lclBhcmFtcy50aW1lclByb2dyZXNzQmFyKSB7XG4gICAgICAgIHNob3codGltZXJQcm9ncmVzc0Jhcik7XG4gICAgICAgIGFwcGx5Q3VzdG9tQ2xhc3ModGltZXJQcm9ncmVzc0JhciwgaW5uZXJQYXJhbXMsICd0aW1lclByb2dyZXNzQmFyJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChnbG9iYWxTdGF0ZSQkMS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQucnVubmluZykge1xuICAgICAgICAgICAgLy8gdGltZXIgY2FuIGJlIGFscmVhZHkgc3RvcHBlZCBvciB1bnNldCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0Jhcihpbm5lclBhcmFtcy50aW1lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGluaXRGb2N1cyA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93RW50ZXJLZXkpKSB7XG4gICAgICByZXR1cm4gYmx1ckFjdGl2ZUVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICBpZiAoIWZvY3VzQnV0dG9uKGRvbUNhY2hlLCBpbm5lclBhcmFtcykpIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCAtMSwgMSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgZm9jdXNCdXR0b24gPSAoZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzRGVueSAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuZGVueUJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmRlbnlCdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NhbmNlbCAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY2FuY2VsQnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNDb25maXJtICYmIGlzVmlzaWJsZShkb21DYWNoZS5jb25maXJtQnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGJsdXJBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9OyAvLyBUaGlzIGFudGktd2FyIG1lc3NhZ2Ugd2lsbCBvbmx5IGJlIHNob3duIHRvIFJ1c3NpYW4gdXNlcnMgdmlzaXRpbmcgUnVzc2lhbiBzaXRlc1xuXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIC9ecnVcXGIvLnRlc3QobmF2aWdhdG9yLmxhbmd1YWdlKSAmJiBsb2NhdGlvbi5ob3N0Lm1hdGNoKC9cXC4ocnV8c3V8eG4tLXAxYWkpJC8pKSB7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcbiAgICAgIGNvbnN0IG5vV2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBub1dhci5jbGFzc05hbWUgPSAnbGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkJztcbiAgICAgIGNvbnN0IHZpZGVvID0gZ2V0UmFuZG9tRWxlbWVudChbe1xuICAgICAgICB0ZXh0OiBcIlxcdTA0MTIgXFx1MDQzRFxcdTA0MzhcXHUwNDM2XFx1MDQzNVxcdTA0M0ZcXHUwNDQwXFx1MDQzOFxcdTA0MzJcXHUwNDM1XFx1MDQzNFxcdTA0NTFcXHUwNDNEXFx1MDQzRFxcdTA0M0VcXHUwNDNDIFxcdTA0MzJcXHUwNDM4XFx1MDQzNFxcdTA0MzVcXHUwNDNFIFxcdTA0M0VcXHUwNDMxXFx1MDQ0QVxcdTA0NEZcXHUwNDQxXFx1MDQzRFxcdTA0NEZcXHUwNDM1XFx1MDQ0MlxcdTA0NDFcXHUwNDRGIFxcdTA0M0FcXHUwNDMwXFx1MDQzQSBcXHUwNDNBXFx1MDQzMFxcdTA0MzZcXHUwNDM0XFx1MDQ0QlxcdTA0MzkgXFx1MDQzOFxcdTA0MzcgXFx1MDQzRFxcdTA0MzBcXHUwNDQxIFxcdTA0M0NcXHUwNDNFXFx1MDQzNlxcdTA0MzVcXHUwNDQyIFxcdTA0M0ZcXHUwNDNFXFx1MDQzQ1xcdTA0M0VcXHUwNDQ3XFx1MDQ0QyBcXHUwNDMyIFxcdTA0NDJcXHUwNDNFXFx1MDQzQyxcXG4gICAgICAgIDxzdHJvbmc+XFx1MDQ0N1xcdTA0NDJcXHUwNDNFXFx1MDQzMVxcdTA0NEIgXFx1MDQ0RFxcdTA0NDJcXHUwNDMwIFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDFcXHUwNDNDXFx1MDQ0QlxcdTA0NDFcXHUwNDNCXFx1MDQzNVxcdTA0M0RcXHUwNDNEXFx1MDQzMFxcdTA0NEYgXFx1MDQzOCBcXHUwNDMxXFx1MDQzNVxcdTA0NDFcXHUwNDQ3XFx1MDQzNVxcdTA0M0JcXHUwNDNFXFx1MDQzMlxcdTA0MzVcXHUwNDQ3XFx1MDQzRFxcdTA0MzBcXHUwNDRGIFxcdTA0MzJcXHUwNDNFXFx1MDQzOVxcdTA0M0RcXHUwNDMwIFxcdTA0M0VcXHUwNDQxXFx1MDQ0MlxcdTA0MzBcXHUwNDNEXFx1MDQzRVxcdTA0MzJcXHUwNDM4XFx1MDQzQlxcdTA0MzBcXHUwNDQxXFx1MDQ0Qzwvc3Ryb25nPjpcIixcbiAgICAgICAgaWQ6ICc0Q2ZEaGFSa3c3SSdcbiAgICAgIH0sIHtcbiAgICAgICAgdGV4dDogJ1x1MDQyRFx1MDQzQ1x1MDQzRlx1MDQzMFx1MDQ0Mlx1MDQzOFx1MDQ0RiAtIFx1MDQzM1x1MDQzQlx1MDQzMFx1MDQzMlx1MDQzRFx1MDQzRVx1MDQzNSA8c3Ryb25nPlx1MDQ0N1x1MDQzNVx1MDQzQlx1MDQzRVx1MDQzMlx1MDQzNVx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzQVx1MDQzRVx1MDQzNTwvc3Ryb25nPiBcdTA0NDdcdTA0NDNcdTA0MzJcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0UuIFx1MDQyMVx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQzRVx1MDQzMVx1MDQzRFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0QyBcdTA0NDFcdTA0M0VcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzZcdTA0MzhcdTA0MzJcdTA0MzBcdTA0NDJcdTA0NEMuIDxzdHJvbmc+XHUwNDIxXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNFXHUwNDMxXHUwNDNEXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzMlx1MDQzOFx1MDQ0Mlx1MDQ0QyBcdTA0NDFcdTA0MzVcdTA0MzFcdTA0NEYgXHUwNDNEXHUwNDMwIFx1MDQzQ1x1MDQzNVx1MDQ0MVx1MDQ0Mlx1MDQzRSBcdTA0MzRcdTA0NDBcdTA0NDNcdTA0MzNcdTA0M0VcdTA0MzNcdTA0M0UuPC9zdHJvbmc+JyxcbiAgICAgICAgaWQ6ICdzLUdMQUlZNERYQSdcbiAgICAgIH1dKTtcbiAgICAgIHNldElubmVySHRtbChub1dhciwgXCJcXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxNVxcdTA0NDFcXHUwNDNCXFx1MDQzOCBcXHUwNDNDXFx1MDQ0QiBcXHUwNDNEXFx1MDQzNSBcXHUwNDNFXFx1MDQ0MVxcdTA0NDJcXHUwNDMwXFx1MDQzRFxcdTA0M0VcXHUwNDMyXFx1MDQzOFxcdTA0M0MgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0NDMsIFxcdTA0M0VcXHUwNDNEXFx1MDQzMCBcXHUwNDNGXFx1MDQ0MFxcdTA0MzhcXHUwNDM0XFx1MDQzNVxcdTA0NDIgXFx1MDQzMiBcXHUwNDM0XFx1MDQzRVxcdTA0M0MgPHN0cm9uZz5cXHUwNDNBXFx1MDQzMFxcdTA0MzZcXHUwNDM0XFx1MDQzRVxcdTA0MzNcXHUwNDNFIFxcdTA0MzhcXHUwNDM3IFxcdTA0M0RcXHUwNDMwXFx1MDQ0MTwvc3Ryb25nPiBcXHUwNDM4IFxcdTA0MzVcXHUwNDUxIFxcdTA0M0ZcXHUwNDNFXFx1MDQ0MVxcdTA0M0JcXHUwNDM1XFx1MDQzNFxcdTA0NDFcXHUwNDQyXFx1MDQzMlxcdTA0MzhcXHUwNDRGIFxcdTA0MzFcXHUwNDQzXFx1MDQzNFxcdTA0NDNcXHUwNDQyIDxzdHJvbmc+XFx1MDQ0M1xcdTA0MzZcXHUwNDMwXFx1MDQ0MVxcdTA0MzBcXHUwNDRFXFx1MDQ0OVxcdTA0MzhcXHUwNDNDXFx1MDQzODwvc3Ryb25nPi5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxRlxcdTA0NDNcXHUwNDQyXFx1MDQzOFxcdTA0M0RcXHUwNDQxXFx1MDQzQVxcdTA0MzhcXHUwNDM5IFxcdTA0NDBcXHUwNDM1XFx1MDQzNlxcdTA0MzhcXHUwNDNDIFxcdTA0MzdcXHUwNDMwIDIwIFxcdTA0NDEgXFx1MDQzQlxcdTA0MzhcXHUwNDQ4XFx1MDQzRFxcdTA0MzhcXHUwNDNDIFxcdTA0M0JcXHUwNDM1XFx1MDQ0MiBcXHUwNDQxXFx1MDQzMlxcdTA0M0VcXHUwNDM1XFx1MDQzM1xcdTA0M0UgXFx1MDQ0MVxcdTA0NDNcXHUwNDQ5XFx1MDQzNVxcdTA0NDFcXHUwNDQyXFx1MDQzMlxcdTA0M0VcXHUwNDMyXFx1MDQzMFxcdTA0M0RcXHUwNDM4XFx1MDQ0RiBcXHUwNDMyXFx1MDQzNFxcdTA0M0VcXHUwNDNCXFx1MDQzMVxcdTA0MzhcXHUwNDNCIFxcdTA0M0RcXHUwNDMwXFx1MDQzQywgXFx1MDQ0N1xcdTA0NDJcXHUwNDNFIFxcdTA0M0NcXHUwNDRCIFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDFcXHUwNDM4XFx1MDQzQlxcdTA0NENcXHUwNDNEXFx1MDQ0QiBcXHUwNDM4IFxcdTA0M0VcXHUwNDM0XFx1MDQzOFxcdTA0M0QgXFx1MDQ0N1xcdTA0MzVcXHUwNDNCXFx1MDQzRVxcdTA0MzJcXHUwNDM1XFx1MDQzQSBcXHUwNDNEXFx1MDQzNSBcXHUwNDNDXFx1MDQzRVxcdTA0MzZcXHUwNDM1XFx1MDQ0MiBcXHUwNDNEXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQzM1xcdTA0M0UgXFx1MDQ0MVxcdTA0MzRcXHUwNDM1XFx1MDQzQlxcdTA0MzBcXHUwNDQyXFx1MDQ0Qy4gPHN0cm9uZz5cXHUwNDJEXFx1MDQ0MlxcdTA0M0UgXFx1MDQzRFxcdTA0MzUgXFx1MDQ0MlxcdTA0MzBcXHUwNDNBITwvc3Ryb25nPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcIi5jb25jYXQodmlkZW8udGV4dCwgXCJcXG4gICAgICA8L2Rpdj5cXG4gICAgICA8aWZyYW1lIHdpZHRoPVxcXCI1NjBcXFwiIGhlaWdodD1cXFwiMzE1XFxcIiBzcmM9XFxcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL1wiKS5jb25jYXQodmlkZW8uaWQsIFwiXFxcIiBmcmFtZWJvcmRlcj1cXFwiMFxcXCIgYWxsb3c9XFxcImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmVcXFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxRFxcdTA0MzVcXHUwNDQyIFxcdTA0MzJcXHUwNDNFXFx1MDQzOVxcdTA0M0RcXHUwNDM1IVxcbiAgICAgIDwvZGl2PlxcbiAgICAgIFwiKSk7XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJyZ0aW1lczsnO1xuXG4gICAgICBjbG9zZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbm9XYXIucmVtb3ZlKCk7XG5cbiAgICAgIG5vV2FyLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vV2FyKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0gLy8gQXNzaWduIGluc3RhbmNlIG1ldGhvZHMgZnJvbSBzcmMvaW5zdGFuY2VNZXRob2RzLyouanMgdG8gcHJvdG90eXBlXG5cblxuICBPYmplY3QuYXNzaWduKFN3ZWV0QWxlcnQucHJvdG90eXBlLCBpbnN0YW5jZU1ldGhvZHMpOyAvLyBBc3NpZ24gc3RhdGljIG1ldGhvZHMgZnJvbSBzcmMvc3RhdGljTWV0aG9kcy8qLmpzIHRvIGNvbnN0cnVjdG9yXG5cbiAgT2JqZWN0LmFzc2lnbihTd2VldEFsZXJ0LCBzdGF0aWNNZXRob2RzKTsgLy8gUHJveHkgdG8gaW5zdGFuY2UgbWV0aG9kcyB0byBjb25zdHJ1Y3RvciwgZm9yIG5vdywgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cbiAgT2JqZWN0LmtleXMoaW5zdGFuY2VNZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgU3dlZXRBbGVydFtrZXldID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gY3VycmVudEluc3RhbmNlW2tleV0oLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiAgU3dlZXRBbGVydC5EaXNtaXNzUmVhc29uID0gRGlzbWlzc1JlYXNvbjtcbiAgU3dlZXRBbGVydC52ZXJzaW9uID0gJzExLjQuMjYnO1xuXG4gIGNvbnN0IFN3YWwgPSBTd2VldEFsZXJ0OyAvLyBAdHMtaWdub3JlXG5cbiAgU3dhbC5kZWZhdWx0ID0gU3dhbDtcblxuICByZXR1cm4gU3dhbDtcblxufSkpO1xuaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLlN3ZWV0YWxlcnQyKXsgIHRoaXMuc3dhbCA9IHRoaXMuc3dlZXRBbGVydCA9IHRoaXMuU3dhbCA9IHRoaXMuU3dlZXRBbGVydCA9IHRoaXMuU3dlZXRhbGVydDJ9XG5cblwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZnVuY3Rpb24oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtpZihlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChuKSxuLnN0eWxlU2hlZXQpbi5zdHlsZVNoZWV0LmRpc2FibGVkfHwobi5zdHlsZVNoZWV0LmNzc1RleHQ9dCk7ZWxzZSB0cnl7bi5pbm5lckhUTUw9dH1jYXRjaChlKXtuLmlubmVyVGV4dD10fX0oZG9jdW1lbnQsXCIuc3dhbDItcG9wdXAuc3dhbDItdG9hc3R7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtY29sdW1uOjEvNCFpbXBvcnRhbnQ7Z3JpZC1yb3c6MS80IWltcG9ydGFudDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDk5ZnIgMWZyO3BhZGRpbmc6MWVtO292ZXJmbG93LXk6aGlkZGVuO2JhY2tncm91bmQ6I2ZmZjtib3gtc2hhZG93OjAgMCAxcHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDAgMXB4IDJweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMXB4IDJweCA0cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDFweCAzcHggOHB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwycHggNHB4IDE2cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpO3BvaW50ZXItZXZlbnRzOmFsbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Q+KntncmlkLWNvbHVtbjoyfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItdGl0bGV7bWFyZ2luOi41ZW0gMWVtO3BhZGRpbmc6MDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRpbmd7anVzdGlmeS1jb250ZW50OmNlbnRlcn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWlucHV0e2hlaWdodDoyZW07bWFyZ2luOi41ZW07Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZXtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItZm9vdGVye21hcmdpbjouNWVtIDAgMDtwYWRkaW5nOi41ZW0gMCAwO2ZvbnQtc2l6ZTouOGVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItY2xvc2V7Z3JpZC1jb2x1bW46My8zO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6LjhlbTtoZWlnaHQ6LjhlbTttYXJnaW46MDtmb250LXNpemU6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaHRtbC1jb250YWluZXJ7bWFyZ2luOi41ZW0gMWVtO3BhZGRpbmc6MDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWh0bWwtY29udGFpbmVyOmVtcHR5e3BhZGRpbmc6MH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRlcntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO2hlaWdodDoyZW07bWFyZ2luOi4yNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO21pbi13aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46MCAuNWVtIDAgMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxLjhlbTtmb250LXdlaWdodDo3MDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17dG9wOi44NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1hY3Rpb25ze2p1c3RpZnktY29udGVudDpmbGV4LXN0YXJ0O2hlaWdodDphdXRvO21hcmdpbjowO21hcmdpbi10b3A6LjVlbTtwYWRkaW5nOjAgLjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN0eWxlZHttYXJnaW46LjI1ZW0gLjVlbTtwYWRkaW5nOi40ZW0gLjZlbTtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzc3tib3JkZXItY29sb3I6I2E1ZGM4Nn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVde3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEuNmVtO2hlaWdodDozZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9bGVmdF17dG9wOi0uOGVtO2xlZnQ6LS41ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MmVtIDJlbTtib3JkZXItcmFkaXVzOjRlbSAwIDAgNGVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LS4yNWVtO2xlZnQ6LjkzNzVlbTt0cmFuc2Zvcm0tb3JpZ2luOjAgMS41ZW07Ym9yZGVyLXJhZGl1czowIDRlbSA0ZW0gMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3RvcDowO2xlZnQ6LjQzNzVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDoyLjY4NzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVde2hlaWdodDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPWxvbmdde3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Quc3dhbDItc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1zaG93IC41czthbmltYXRpb246c3dhbDItdG9hc3Qtc2hvdyAuNXN9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0LnN3YWwyLWhpZGV7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3QtaGlkZSAuMXMgZm9yd2FyZHM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWhpZGUgLjFzIGZvcndhcmRzfS5zd2FsMi1jb250YWluZXJ7ZGlzcGxheTpncmlkO3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTA2MDt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC10ZW1wbGF0ZS1hcmVhczpcXFwidG9wLXN0YXJ0ICAgICB0b3AgICAgICAgICAgICB0b3AtZW5kXFxcIiBcXFwiY2VudGVyLXN0YXJ0ICBjZW50ZXIgICAgICAgICBjZW50ZXItZW5kXFxcIiBcXFwiYm90dG9tLXN0YXJ0ICBib3R0b20tY2VudGVyICBib3R0b20tZW5kXFxcIjtncmlkLXRlbXBsYXRlLXJvd3M6bWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0bykgbWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0bykgbWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0byk7Z3JpZC10ZW1wbGF0ZS1yb3dzOm1pbm1heChtaW4tY29udGVudCxhdXRvKSBtaW5tYXgobWluLWNvbnRlbnQsYXV0bykgbWlubWF4KG1pbi1jb250ZW50LGF1dG8pO2hlaWdodDoxMDAlO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93LXg6aGlkZGVuO3RyYW5zaXRpb246YmFja2dyb3VuZC1jb2xvciAuMXM7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6dG91Y2h9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1iYWNrZHJvcC1zaG93LC5zd2FsMi1jb250YWluZXIuc3dhbDItbm9hbmltYXRpb257YmFja2dyb3VuZDpyZ2JhKDAsMCwwLC40KX0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJhY2tkcm9wLWhpZGV7YmFja2dyb3VuZDowIDAhaW1wb3J0YW50fS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwxZnIpIGF1dG8gYXV0b30uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbSwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlciwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6YXV0byBtaW5tYXgoMCwxZnIpIGF1dG99LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gYXV0byBtaW5tYXgoMCwxZnIpfS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0Pi5zd2FsMi1wb3B1cHthbGlnbi1zZWxmOnN0YXJ0fS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2FsaWduLXNlbGY6c3RhcnQ7anVzdGlmeS1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2FsaWduLXNlbGY6c3RhcnQ7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1sZWZ0Pi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydD4uc3dhbDItcG9wdXB7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlcj4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyO2p1c3RpZnktc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tbGVmdD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MzthbGlnbi1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbT4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtncmlkLXJvdzozO2p1c3RpZnktc2VsZjpjZW50ZXI7YWxpZ24tc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztncmlkLXJvdzozO2FsaWduLXNlbGY6ZW5kO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWZ1bGxzY3JlZW4+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1yb3c+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjEvNDt3aWR0aDoxMDAlfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1mdWxsc2NyZWVuPi5zd2FsMi1wb3B1cHtncmlkLXJvdzoxLzQ7YWxpZ24tc2VsZjpzdHJldGNofS5zd2FsMi1jb250YWluZXIuc3dhbDItbm8tdHJhbnNpdGlvbnt0cmFuc2l0aW9uOm5vbmUhaW1wb3J0YW50fS5zd2FsMi1wb3B1cHtkaXNwbGF5Om5vbmU7cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwxMDAlKTt3aWR0aDozMmVtO21heC13aWR0aDoxMDAlO3BhZGRpbmc6MCAwIDEuMjVlbTtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOiNmZmY7Y29sb3I6IzU0NTQ1NDtmb250LWZhbWlseTppbmhlcml0O2ZvbnQtc2l6ZToxcmVtfS5zd2FsMi1wb3B1cDpmb2N1c3tvdXRsaW5lOjB9LnN3YWwyLXBvcHVwLnN3YWwyLWxvYWRpbmd7b3ZlcmZsb3cteTpoaWRkZW59LnN3YWwyLXRpdGxle3Bvc2l0aW9uOnJlbGF0aXZlO21heC13aWR0aDoxMDAlO21hcmdpbjowO3BhZGRpbmc6LjhlbSAxZW0gMDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjg3NWVtO2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtd3JhcDpicmVhay13b3JkfS5zd2FsMi1hY3Rpb25ze2Rpc3BsYXk6ZmxleDt6LWluZGV4OjE7Ym94LXNpemluZzpib3JkZXItYm94O2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOmF1dG87bWFyZ2luOjEuMjVlbSBhdXRvIDA7cGFkZGluZzowfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZFtkaXNhYmxlZF17b3BhY2l0eTouNH0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWQ6aG92ZXJ7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMSkscmdiYSgwLDAsMCwuMSkpfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMikscmdiYSgwLDAsMCwuMikpfS5zd2FsMi1sb2FkZXJ7ZGlzcGxheTpub25lO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjIuMmVtO2hlaWdodDoyLjJlbTttYXJnaW46MCAxLjg3NWVtOy13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1sb2FkaW5nIDEuNXMgbGluZWFyIDBzIGluZmluaXRlIG5vcm1hbDthbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2JvcmRlci13aWR0aDouMjVlbTtib3JkZXItc3R5bGU6c29saWQ7Ym9yZGVyLXJhZGl1czoxMDAlO2JvcmRlci1jb2xvcjojMjc3OGM0IHRyYW5zcGFyZW50ICMyNzc4YzQgdHJhbnNwYXJlbnR9LnN3YWwyLXN0eWxlZHttYXJnaW46LjMxMjVlbTtwYWRkaW5nOi42MjVlbSAxLjFlbTt0cmFuc2l0aW9uOmJveC1zaGFkb3cgLjFzO2JveC1zaGFkb3c6MCAwIDAgM3B4IHRyYW5zcGFyZW50O2ZvbnQtd2VpZ2h0OjUwMH0uc3dhbDItc3R5bGVkOm5vdChbZGlzYWJsZWRdKXtjdXJzb3I6cG9pbnRlcn0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm17Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojNzA2NmUwO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm06Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMTIsMTAyLDIyNCwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55e2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6I2RjMzc0MTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55OmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMjIwLDU1LDY1LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbHtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiM2ZTc4ODE7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItY2FuY2VsOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTEwLDEyMCwxMjksLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItZGVmYXVsdC1vdXRsaW5lOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1zdHlsZWQ6Zm9jdXN7b3V0bGluZTowfS5zd2FsMi1zdHlsZWQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9LnN3YWwyLWZvb3RlcntqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6MWVtIDFlbSAwO2JvcmRlci10b3A6MXB4IHNvbGlkICNlZWU7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MWVtfS5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVye3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2dyaWQtY29sdW1uOmF1dG8haW1wb3J0YW50O292ZXJmbG93OmhpZGRlbjtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czo1cHg7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czo1cHh9LnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhcnt3aWR0aDoxMDAlO2hlaWdodDouMjVlbTtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjIpfS5zd2FsMi1pbWFnZXttYXgtd2lkdGg6MTAwJTttYXJnaW46MmVtIGF1dG8gMWVtfS5zd2FsMi1jbG9zZXt6LWluZGV4OjI7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6MS4yZW07aGVpZ2h0OjEuMmVtO21hcmdpbi10b3A6MDttYXJnaW4tcmlnaHQ6MDttYXJnaW4tYm90dG9tOi0xLjJlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aGlkZGVuO3RyYW5zaXRpb246Y29sb3IgLjFzLGJveC1zaGFkb3cgLjFzO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6MCAwO2NvbG9yOiNjY2M7Zm9udC1mYW1pbHk6c2VyaWY7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToyLjVlbTtjdXJzb3I6cG9pbnRlcjtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jbG9zZTpob3Zlcnt0cmFuc2Zvcm06bm9uZTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojZjI3NDc0fS5zd2FsMi1jbG9zZTpmb2N1c3tvdXRsaW5lOjA7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLWNsb3NlOjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowfS5zd2FsMi1odG1sLWNvbnRhaW5lcnt6LWluZGV4OjE7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIDEuNmVtIC4zZW07cGFkZGluZzowO292ZXJmbG93OmF1dG87Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbTtmb250LXdlaWdodDo0MDA7bGluZS1oZWlnaHQ6bm9ybWFsO3RleHQtYWxpZ246Y2VudGVyO3dvcmQtd3JhcDpicmVhay13b3JkO3dvcmQtYnJlYWs6YnJlYWstd29yZH0uc3dhbDItY2hlY2tib3gsLnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi1yYWRpbywuc3dhbDItc2VsZWN0LC5zd2FsMi10ZXh0YXJlYXttYXJnaW46MWVtIDJlbSAzcHh9LnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi10ZXh0YXJlYXtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6YXV0bzt0cmFuc2l0aW9uOmJvcmRlci1jb2xvciAuMXMsYm94LXNoYWRvdyAuMXM7Ym9yZGVyOjFweCBzb2xpZCAjZDlkOWQ5O2JvcmRlci1yYWRpdXM6LjE4NzVlbTtiYWNrZ3JvdW5kOjAgMDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHRyYW5zcGFyZW50O2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWZpbGUuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItaW5wdXQuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItdGV4dGFyZWEuc3dhbDItaW5wdXRlcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDAgMnB4ICNmMjc0NzQhaW1wb3J0YW50fS5zd2FsMi1maWxlOmZvY3VzLC5zd2FsMi1pbnB1dDpmb2N1cywuc3dhbDItdGV4dGFyZWE6Zm9jdXN7Ym9yZGVyOjFweCBzb2xpZCAjYjRkYmVkO291dGxpbmU6MDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1maWxlOjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6LW1vei1wbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6Oi1tb3otcGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItZmlsZTo6cGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjpwbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6OnBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLXJhbmdle21hcmdpbjoxZW0gMmVtIDNweDtiYWNrZ3JvdW5kOiNmZmZ9LnN3YWwyLXJhbmdlIGlucHV0e3dpZHRoOjgwJX0uc3dhbDItcmFuZ2Ugb3V0cHV0e3dpZHRoOjIwJTtjb2xvcjppbmhlcml0O2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItcmFuZ2UgaW5wdXQsLnN3YWwyLXJhbmdlIG91dHB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjEuMTI1ZW07bGluZS1oZWlnaHQ6Mi42MjVlbX0uc3dhbDItaW5wdXR7aGVpZ2h0OjIuNjI1ZW07cGFkZGluZzowIC43NWVtfS5zd2FsMi1maWxle3dpZHRoOjc1JTttYXJnaW4tcmlnaHQ6YXV0bzttYXJnaW4tbGVmdDphdXRvO2JhY2tncm91bmQ6MCAwO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi10ZXh0YXJlYXtoZWlnaHQ6Ni43NWVtO3BhZGRpbmc6Ljc1ZW19LnN3YWwyLXNlbGVjdHttaW4td2lkdGg6NTAlO21heC13aWR0aDoxMDAlO3BhZGRpbmc6LjM3NWVtIC42MjVlbTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCwuc3dhbDItcmFkaW97YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDojZmZmO2NvbG9yOmluaGVyaXR9LnN3YWwyLWNoZWNrYm94IGxhYmVsLC5zd2FsMi1yYWRpbyBsYWJlbHttYXJnaW46MCAuNmVtO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCBpbnB1dCwuc3dhbDItcmFkaW8gaW5wdXR7ZmxleC1zaHJpbms6MDttYXJnaW46MCAuNGVtfS5zd2FsMi1pbnB1dC1sYWJlbHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIGF1dG8gMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOiNmMGYwZjA7Y29sb3I6IzY2Njtmb250LXNpemU6MWVtO2ZvbnQtd2VpZ2h0OjMwMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlOjpiZWZvcmV7Y29udGVudDpcXFwiIVxcXCI7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MS41ZW07bWluLXdpZHRoOjEuNWVtO2hlaWdodDoxLjVlbTttYXJnaW46MCAuNjI1ZW07Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0O2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwO2xpbmUtaGVpZ2h0OjEuNWVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1pY29ue3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaXppbmc6Y29udGVudC1ib3g7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDo1ZW07aGVpZ2h0OjVlbTttYXJnaW46Mi41ZW0gYXV0byAuNmVtO2JvcmRlcjouMjVlbSBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItcmFkaXVzOjUwJTtib3JkZXItY29sb3I6IzAwMDtmb250LWZhbWlseTppbmhlcml0O2xpbmUtaGVpZ2h0OjVlbTtjdXJzb3I6ZGVmYXVsdDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZTozLjc1ZW19LnN3YWwyLWljb24uc3dhbDItZXJyb3J7Ym9yZGVyLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciAuc3dhbDIteC1tYXJre3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtZ3JvdzoxfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjIuMzEyNWVtO3dpZHRoOjIuOTM3NWVtO2hlaWdodDouMzEyNWVtO2JvcmRlci1yYWRpdXM6LjEyNWVtO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDoxLjA2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0OjFlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93IC5zd2FsMi14LW1hcmt7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmsgLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXN9LnN3YWwyLWljb24uc3dhbDItd2FybmluZ3tib3JkZXItY29sb3I6I2ZhY2VhODtjb2xvcjojZjhiYjg2fS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItd2FybmluZy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC41c30uc3dhbDItaWNvbi5zd2FsMi1pbmZve2JvcmRlci1jb2xvcjojOWRlMGY2O2NvbG9yOiMzZmMzZWV9LnN3YWwyLWljb24uc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1pbmZvLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC44czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9ue2JvcmRlci1jb2xvcjojYzlkYWUxO2NvbG9yOiM4N2FkYmR9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrIC44czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrIC44c30uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNze2JvcmRlci1jb2xvcjojYTVkYzg2O2NvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6My43NWVtO2hlaWdodDo3LjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKTtib3JkZXItcmFkaXVzOjUwJX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9bGVmdF17dG9wOi0uNDM3NWVtO2xlZnQ6LTIuMDYzNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjMuNzVlbSAzLjc1ZW07Ym9yZGVyLXJhZGl1czo3LjVlbSAwIDAgNy41ZW19LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LS42ODc1ZW07bGVmdDoxLjg3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjAgMy43NWVtO2JvcmRlci1yYWRpdXM6MCA3LjVlbSA3LjVlbSAwfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3twb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7dG9wOi0uMjVlbTtsZWZ0Oi0uMjVlbTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7Ym9yZGVyOi4yNWVtIHNvbGlkIHJnYmEoMTY1LDIyMCwxMzQsLjMpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTt0b3A6LjVlbTtsZWZ0OjEuNjI1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6NS42MjVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV17ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7aGVpZ2h0Oi4zMTI1ZW07Ym9yZGVyLXJhZGl1czouMTI1ZW07YmFja2dyb3VuZC1jb2xvcjojYTVkYzg2fS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoyLjg3NWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9bG9uZ117dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXB7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1c30uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmUgNC4yNXMgZWFzZS1pbjthbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWlufS5zd2FsMi1wcm9ncmVzcy1zdGVwc3tmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjEuMjVlbSBhdXRvO3BhZGRpbmc6MDtiYWNrZ3JvdW5kOjAgMDtmb250LXdlaWdodDo2MDB9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIGxpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcHt6LWluZGV4OjIwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym9yZGVyLXJhZGl1czoyZW07YmFja2dyb3VuZDojMjc3OGM0O2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MmVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiMyNzc4YzR9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwe2JhY2tncm91bmQ6I2FkZDhlNjtjb2xvcjojZmZmfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcC1saW5le2JhY2tncm91bmQ6I2FkZDhlNn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXt6LWluZGV4OjEwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6Mi41ZW07aGVpZ2h0Oi40ZW07bWFyZ2luOjAgLTFweDtiYWNrZ3JvdW5kOiMyNzc4YzR9W2NsYXNzXj1zd2FsMl17LXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOnRyYW5zcGFyZW50fS5zd2FsMi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXNob3cgLjNzO2FuaW1hdGlvbjpzd2FsMi1zaG93IC4zc30uc3dhbDItaGlkZXstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1oaWRlIC4xNXMgZm9yd2FyZHM7YW5pbWF0aW9uOnN3YWwyLWhpZGUgLjE1cyBmb3J3YXJkc30uc3dhbDItbm9hbmltYXRpb257dHJhbnNpdGlvbjpub25lfS5zd2FsMi1zY3JvbGxiYXItbWVhc3VyZXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTk5OTlweDt3aWR0aDo1MHB4O2hlaWdodDo1MHB4O292ZXJmbG93OnNjcm9sbH0uc3dhbDItcnRsIC5zd2FsMi1jbG9zZXttYXJnaW4tcmlnaHQ6aW5pdGlhbDttYXJnaW4tbGVmdDowfS5zd2FsMi1ydGwgLnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhcntyaWdodDowO2xlZnQ6YXV0b30ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxke2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjE5Mzk7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6MjVweCAwIDIwcHg7YmFja2dyb3VuZDojMjAyMzJhO2NvbG9yOiNmZmY7dGV4dC1hbGlnbjpjZW50ZXJ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBkaXZ7bWF4LXdpZHRoOjU2MHB4O21hcmdpbjoxMHB4O2xpbmUtaGVpZ2h0OjE0NiV9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBpZnJhbWV7bWF4LXdpZHRoOjEwMCU7bWF4LWhlaWdodDo1NS41NTU1NTU1NTU2dm1pbjttYXJnaW46MTZweCBhdXRvfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgc3Ryb25ne2JvcmRlci1ib3R0b206MnB4IGRhc2hlZCAjZmZmfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgYnV0dG9ue2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjE5NDA7dG9wOjA7cmlnaHQ6MDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDo0OHB4O2hlaWdodDo0OHB4O21hcmdpbi1yaWdodDoxMHB4O21hcmdpbi1ib3R0b206LTEwcHg7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDowIDA7Y29sb3I6I2FhYTtmb250LXNpemU6NDhweDtmb250LXdlaWdodDo3MDA7Y3Vyc29yOnBvaW50ZXJ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBidXR0b246aG92ZXJ7Y29sb3I6I2ZmZn1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCl9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1oaWRlezEwMCV7dHJhbnNmb3JtOnJvdGF0ZVooMWRlZyk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWhpZGV7MTAwJXt0cmFuc2Zvcm06cm90YXRlWigxZGVnKTtvcGFjaXR5OjB9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOi41NjI1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDouMTI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOi42MjVlbTtsZWZ0Oi0uMjVlbTt3aWR0aDoxLjYyNWVtfTg0JXt0b3A6MS4wNjI1ZW07bGVmdDouNzVlbTt3aWR0aDouNWVtfTEwMCV7dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6LjU2MjVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOi4xMjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6LjYyNWVtO2xlZnQ6LS4yNWVtO3dpZHRoOjEuNjI1ZW19ODQle3RvcDoxLjA2MjVlbTtsZWZ0Oi43NWVtO3dpZHRoOi41ZW19MTAwJXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDoxLjYyNWVtO3JpZ2h0OjEuMzc1ZW07d2lkdGg6MH02NSV7dG9wOjEuMjVlbTtyaWdodDouOTM3NWVtO3dpZHRoOjB9ODQle3RvcDouOTM3NWVtO3JpZ2h0OjA7d2lkdGg6MS4xMjVlbX0xMDAle3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDoxLjYyNWVtO3JpZ2h0OjEuMzc1ZW07d2lkdGg6MH02NSV7dG9wOjEuMjVlbTtyaWdodDouOTM3NWVtO3dpZHRoOjB9ODQle3RvcDouOTM3NWVtO3JpZ2h0OjA7d2lkdGg6MS4xMjVlbX0xMDAle3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXNob3d7MCV7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXt0cmFuc2Zvcm06c2NhbGUoLjk1KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19QGtleWZyYW1lcyBzd2FsMi1zaG93ezAle3RyYW5zZm9ybTpzY2FsZSguNyl9NDUle3RyYW5zZm9ybTpzY2FsZSgxLjA1KX04MCV7dHJhbnNmb3JtOnNjYWxlKC45NSl9MTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1oaWRlezAle3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi1oaWRlezAle3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6MS4xODc1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDoxLjA2MjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6Mi4xODc1ZW07bGVmdDotLjM3NWVtO3dpZHRoOjMuMTI1ZW19ODQle3RvcDozZW07bGVmdDoxLjMxMjVlbTt3aWR0aDoxLjA2MjVlbX0xMDAle3RvcDoyLjgxMjVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW19fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDoxLjE4NzVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOjEuMDYyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDoyLjE4NzVlbTtsZWZ0Oi0uMzc1ZW07d2lkdGg6My4xMjVlbX04NCV7dG9wOjNlbTtsZWZ0OjEuMzEyNWVtO3dpZHRoOjEuMDYyNWVtfTEwMCV7dG9wOjIuODEyNWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTY1JXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9ODQle3RvcDoyLjE4NzVlbTtyaWdodDowO3dpZHRoOjMuNDM3NWVtfTEwMCV7dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH02NSV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTg0JXt0b3A6Mi4xODc1ZW07cmlnaHQ6MDt3aWR0aDozLjQzNzVlbX0xMDAle3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lezAle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX01JXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9MTIle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFya3swJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9NTAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH04MCV7bWFyZ2luLXRvcDotLjM3NWVtO3RyYW5zZm9ybTpzY2FsZSgxLjE1KX0xMDAle21hcmdpbi10b3A6MDt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci1pY29uezAle3RyYW5zZm9ybTpyb3RhdGVYKDEwMGRlZyk7b3BhY2l0eTowfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19QGtleWZyYW1lcyBzd2FsMi1yb3RhdGUtbG9hZGluZ3swJXt0cmFuc2Zvcm06cm90YXRlKDApfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVZKC0zNjBkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVkoMCl9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVZKC0zNjBkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVkoMCl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWktbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWig0NWRlZyk7b3BhY2l0eTowfTI1JXt0cmFuc2Zvcm06cm90YXRlWigtMjVkZWcpO29wYWNpdHk6LjR9NTAle3RyYW5zZm9ybTpyb3RhdGVaKDE1ZGVnKTtvcGFjaXR5Oi44fTc1JXt0cmFuc2Zvcm06cm90YXRlWigtNWRlZyk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtaS1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVaKDQ1ZGVnKTtvcGFjaXR5OjB9MjUle3RyYW5zZm9ybTpyb3RhdGVaKC0yNWRlZyk7b3BhY2l0eTouNH01MCV7dHJhbnNmb3JtOnJvdGF0ZVooMTVkZWcpO29wYWNpdHk6Ljh9NzUle3RyYW5zZm9ybTpyb3RhdGVaKC01ZGVnKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bil7b3ZlcmZsb3c6aGlkZGVufWJvZHkuc3dhbDItaGVpZ2h0LWF1dG97aGVpZ2h0OmF1dG8haW1wb3J0YW50fWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lcntiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50IWltcG9ydGFudDtwb2ludGVyLWV2ZW50czpub25lfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lciAuc3dhbDItcG9wdXB7cG9pbnRlci1ldmVudHM6YWxsfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lciAuc3dhbDItbW9kYWx7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDAsMCwwLC40KX1AbWVkaWEgcHJpbnR7Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKXtvdmVyZmxvdy15OnNjcm9sbCFpbXBvcnRhbnR9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKT5bYXJpYS1oaWRkZW49dHJ1ZV17ZGlzcGxheTpub25lfWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bikgLnN3YWwyLWNvbnRhaW5lcntwb3NpdGlvbjpzdGF0aWMhaW1wb3J0YW50fX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXJ7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjM2MHB4O21heC13aWR0aDoxMDAlO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7cG9pbnRlci1ldmVudHM6bm9uZX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9we3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1yaWdodHt0b3A6MDtyaWdodDowO2JvdHRvbTphdXRvO2xlZnQ6YXV0b31ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydHt0b3A6MDtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6MH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydHt0b3A6NTAlO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXJ7dG9wOjUwJTtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXJpZ2h0e3RvcDo1MCU7cmlnaHQ6MDtib3R0b206YXV0bztsZWZ0OmF1dG87dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnR7dG9wOmF1dG87cmlnaHQ6YXV0bztib3R0b206MDtsZWZ0OjB9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbXt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tcmlnaHR7dG9wOmF1dG87cmlnaHQ6MDtib3R0b206MDtsZWZ0OmF1dG99XCIpOyIsICJjb25zdCBTd2FsID0gcmVxdWlyZShcInN3ZWV0YWxlcnQyXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gcGQoLi4ubWVzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhtZXMpO1xufVxuXG5mdW5jdGlvbiBub3JtYWwobWVzOiBzdHJpbmcpIHtcbiAgICBTd2FsLmZpcmUoe1xuICAgICAgICB0ZXh0OiBtZXMsXG4gICAgICAgIHRvYXN0OiB0cnVlLFxuICAgICAgICBwb3NpdGlvbjogXCJ0b3AtZW5kXCIsXG4gICAgICAgIHRpbWVyOiAzICogMTAwMCxcbiAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlXG4gICAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBjb25maXJtKG1lczogc3RyaW5nLCBvazogc3RyaW5nLCBjYW5jZWw6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IFN3YWwuZmlyZSh7XG4gICAgICAgIHRleHQ6IG1lcyxcbiAgICAgICAgdG9hc3Q6IGZhbHNlLFxuICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2UsXG4gICAgICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogb2ssXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IGNhbmNlbCxcbiAgICB9KTtcbiAgICBjb25zdCByZXQ6Ym9vbGVhbiA9IHJlcy52YWx1ZTtcbiAgICByZXR1cm4gcmV0O1xufVxuZXhwb3J0IHZhciB0b2FzdCA9IHtcbiAgICBub3JtYWw6IG5vcm1hbCxcbiAgICBjb25maXJtOiBjb25maXJtXG59XG5leHBvcnQgZnVuY3Rpb24gdG9SZ2JIZXgoY29sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIiNcIiArIGNvbC5tYXRjaCgvXFxkKy9nKS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIChcIjBcIiArIHBhcnNlSW50KGEpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpfSkuam9pbihcIlwiKTtcbn1cbiIsICJpbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIFNhdmVFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkYXRhc3RvcmU6IERyYXdNaW5lO1xuXG4gICAgcHVibGljIGluaXQoZGF0YXN0b3JlOiBEcmF3TWluZSkge1xuICAgICAgICB0aGlzLmRhdGFzdG9yZSA9IGRhdGFzdG9yZTtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FjdC1zYXZlXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGF0YXN0b3JlLnNhdmUoKTtcbiAgICAgICAgVS50b2FzdC5ub3JtYWwoXCJzYXZlZFwiKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd090aGVyIH0gZnJvbSBcIi4uL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4vUGVuQWN0aW9uXCI7XG5pbXBvcnQgeyBTdHJva2UsIFBvaW50LCBEcmF3IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuXG5leHBvcnQgY2xhc3MgTG9hZEFjdGlvbiB7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgZGF0YXN0b3JlOiBEcmF3T3RoZXI7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwdWJsaWMgaW5pdChwYXBlcjogUGFwZXJFbGVtZW50LCBkYXRhc3RvcmU6IERyYXdPdGhlciwgcGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xuICAgICAgICB0aGlzLmRhdGFzdG9yZSA9IGRhdGFzdG9yZTtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIC8vIFUudG9hc3Qubm9ybWFsKFwibm93IGxvYWRpbmcuLi5cIik7XG4gICAgICAgIHRoaXMucHJvYygpO1xuICAgIH1cbiAgICBwdWJsaWMgYXN5bmMgcHJvYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3Qgc2VjID0gMztcbiAgICAgICAgYXdhaXQgdGhpcy5kYXRhc3RvcmUubG9hZCgpO1xuICAgICAgICBhd2FpdCB0aGlzLnJlZHJhdyh0aGlzLnBhcGVyLCB0aGlzLmRhdGFzdG9yZSwgdGhpcy5wZW4pO1xuICAgICAgICAvLyBVLnRvYXN0Lm5vcm1hbChgbG9hZCAke3NlY30gc2VjLmApO1xuICAgICAgICAvLyBVLnBkKFwibG9hZGVkISFcIik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wcm9jKCksIHNlYyAqIDEwMDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmlyc3Q6IGJvb2xlYW4gPSB0cnVlOyAvLyBcdTUyMURcdTU2REVcdTMwRDVcdTMwRTlcdTMwQjBcdTMwMDJcdTMwRURcdTMwRkNcdTMwQzlcdTY2NDJcdTMwNkJcdTMwRDBcdTMwQkZcdTMwNjRcdTMwNEZcdTMwNUZcdTMwODFcdTMwMDJcbiAgICBwcml2YXRlIGFzeW5jIHJlZHJhdyhwYXBlcjogUGFwZXJFbGVtZW50LCBkYXRhc3RvcmU6IERyYXdPdGhlciwgcGVuOiBQZW5BY3Rpb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgZHJhd3M6IERyYXdbXSA9IGRhdGFzdG9yZS5nZXREcmF3cygpO1xuXG4gICAgICAgIGxldCBwcmVwb2ludDogUG9pbnQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgICAgICAgcGFwZXIuZ2V0Q252KCkuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBkcmF3IG9mIGRyYXdzKSB7XG4gICAgICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkVjYW52YXNcdTMwNkVcdTcyQjZcdTYxNEJcdTMwOTJcdTMwQUZcdTMwRURcdTMwRkNcdTMwRjNcbiAgICAgICAgICAgIGNvbnN0IGJraW1nOiBIVE1MSW1hZ2VFbGVtZW50ID0gYXdhaXQgdGhpcy50b0ltYWdlKHBhcGVyLmdldENudigpKTtcblxuICAgICAgICAgICAgLy8gXHUzMEFGXHUzMEVBXHUzMEEyXHUzMDU3XHUzMDY2XHU0RUNBXHU1NkRFXHUzMDZFXHU4QTE4XHU4RkYwXHUzMDkyXHU2NkY4XHUzMDREXHU4RkJDXHUzMDdGXG4gICAgICAgICAgICBwYXBlci5jbGVhcigpO1xuXG4gICAgICAgICAgICAvLyBcdTRFQ0FcdTU2REVcdTMwNkVcdThBMThcdThGRjBcdTMwOTJcdTc1MUZcdTYyMTBcbiAgICAgICAgICAgIGNvbnN0IHN0cm9rZXMgPSBkcmF3LmdldFN0cm9rZXMoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocy5pc0VyYXNlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5vcHQuY29sb3IgPSBzLmNvbG9yOyAvLyBcdTgyNzJcdTYwQzVcdTU4MzFcdTMwNkZcdTRGN0ZcdTMwOEZcdTMwNkFcdTMwNDRcdTMwNENcdTVGRjVcdTMwNkVcdTcwQkFcdThBMkRcdTVCOUFcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5lcmFzZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5vcHQuY29sb3IgPSBzLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBwZW4ub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygcy5nZXRQb2ludHMoKSkge1xuICAgICAgICAgICAgICAgICAgICBwZW4ucHJvYyhwLngsIHAueSwgcHJlcG9pbnQsIHBhcGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmVwb2ludCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFx1NTNENlx1MzA2M1x1MzA2Nlx1MzA0QVx1MzA0NFx1MzA1RmNhbnZhc1x1MzA2OFx1OTFDRFx1MzA2RFx1NTQwOFx1MzA4Rlx1MzA1QlxuICAgICAgICAgICAgcGFwZXIuZ2V0Q3R4KCkuZHJhd0ltYWdlKGJraW1nLCAwLCAwLCBia2ltZy53aWR0aCwgYmtpbWcuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maXJzdCkge1xuICAgICAgICAgICAgcGFwZXIuZ2V0Q252KCkuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgdGhpcy5maXJzdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB0b0ltYWdlKGNudjogSFRNTENhbnZhc0VsZW1lbnQpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50ID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBjb25zdCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNudi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKGltYWdlKTtcbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSAoZSkgPT4gcmVqZWN0KGUpO1xuICAgICAgICAgICAgaW1hZ2Uuc3JjID0gY3R4LmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwgImV4cG9ydCBjbGFzcyBEcmF3Y2FudmFzZXNFbGVtZW50IHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMud3JhcGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZHJhd2NhbnZhc2VzXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbGVtZW50KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcGRpdjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Tm9ybWFsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkZGRkZGMDBcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U2Nyb2xsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDBGRjAwNzdcIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RXhwYW5kKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndyYXBkaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkYwMDAwNzdcIjtcbiAgICB9XG59IiwgImltcG9ydCB7IFRvb2wsIERyYXdFdmVudCB9IGZyb20gXCIuLi91L3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3U3RhdHVzIHtcbiAgICBwcml2YXRlIGV2ZW50OiBEcmF3RXZlbnQ7XG4gICAgcHJpdmF0ZSB0b29sOiBUb29sO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZW5kU3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZFN0cm9rZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ldmVudCA9IFwidXBcIjtcbiAgICAgICAgdGhpcy50b29sID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRTdHJva2UoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NjRDRFx1NEY1Q1x1OTU4Qlx1NTlDQlxuICAgICAgICB0aGlzLmV2ZW50ID0gXCJkb3duXCI7XG4gICAgICAgIHRoaXMudG9vbCA9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFRvb2wodG9vbCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvb2wgPSB0b29sO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0VG9vbCgpOiBUb29sIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9vbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFbmRTdHJva2Uobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJ1cFwiICYmIHRoaXMuZXZlbnQgIT09IFwidXBcIjtcbiAgICB9XG4gICAgcHVibGljIGlzU3RhcnRTdHJva2Uobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJkb3duXCI7XG4gICAgfVxuICAgIHB1YmxpYyBpc1N0YXJ0TW92ZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNENcdTY3MkFcdTZDN0FcdTVCOUFcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNb3ZlKG5vdykgJiYgdGhpcy50b29sID09PSBudWxsO1xuICAgIH1cbiAgICBwdWJsaWMgaXNNb3ZlKG5vdzogRHJhd0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBub3cgPT09IFwibW92ZVwiICYmIHRoaXMuZXZlbnQgPT09IFwiZG93blwiO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBUb29sIH0gZnJvbSBcIi4uL3UvdHlwZXNcIjtcbmltcG9ydCB7IERyYXdjYW52YXNlc0VsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9EcmF3Y2FudmFzZXNFbGVtZW50XCI7XG5pbXBvcnQgeyBab29tU2Nyb2xsQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIExvbmdwcmVzc1N0YXR1cyB7XG4gICAgcHJpdmF0ZSB0aW1lOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0aW1lb3V0aWRzOiBudW1iZXJbXSA9IFtdOyAvLyBcdTkxNERcdTUyMTdcdTMwNjBcdTMwNTFcdTMwNkZcdTUyMURcdTY3MUZcdTUzMTZcbiAgICBwcml2YXRlIHBvczogUG9pbnQ7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTRUNfU0NST0xMOiBudW1iZXIgPSAwLjIgKiAxMDAwO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNFQ19FWFBBTkQ6IG51bWJlciA9IDEuMCAqIDEwMDA7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXIoKSB7XG4gICAgICAgIC8vIFx1NkIyMVx1NTZERVx1MzA2Qlx1NTQxMVx1MzA1MVx1MzA2Nlx1NTIxRFx1NjcxRlx1NTMxNlxuICAgICAgICB0aGlzLnRpbWUgPSAwO1xuICAgICAgICB0aGlzLnBvcyA9IG51bGw7XG4gICAgICAgIC8vIFx1MzBDNFx1MzBGQ1x1MzBFQlx1MzA0Q1x1NkM3QVx1NUI5QVx1MzA1N1x1MzA1Rlx1MzA2RVx1MzA2N3RpbWVvdXRcdTU0NjhcdTMwOEFcdTMwOTJcdTMwQUZcdTMwRUFcdTMwQTJcbiAgICAgICAgbGV0IHRpZCA9IG51bGw7XG4gICAgICAgIHdoaWxlICh0aWQgPSB0aGlzLnRpbWVvdXRpZHMucG9wKCkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBlbmQoKTogVG9vbCB7XG4gICAgICAgIGlmKHRoaXMuaXNTdGFydCgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gXHUzMEI5XHUzMEJGXHUzMEZDXHUzMEM4XHUzMDU3XHUzMDY2XHUzMDQ0XHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU0RjU1XHUzMDgyXHUzMDU3XHUzMDZBXHUzMDQ0XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBVLnBkKFwiZW5kIHByZXNzISEhXCIpO1xuXG4gICAgICAgIC8vIFx1MzBFMlx1MzBGQ1x1MzBDOVx1MzA2RVx1NTIyNFx1NUI5QVxuICAgICAgICBjb25zdCBub3c6IG51bWJlciA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGRpZmY6IG51bWJlciA9IG5vdyAtIHRoaXMudGltZTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBpZiAoZGlmZiA8IExvbmdwcmVzc1N0YXR1cy5TRUNfU0NST0xMKSB7XG4gICAgICAgICAgICAvLyBcdTUzNThcdTYyQkNcdTMwNTdcdTc5RkJcdTUyRDVcdUZGMURcdThBMThcdThGRjBcbiAgICAgICAgICAgIHJldHVybiBcInBlblwiO1xuICAgICAgICB9IGVsc2UgaWYgKGRpZmYgPCBMb25ncHJlc3NTdGF0dXMuU0VDX0VYUEFORCkge1xuICAgICAgICAgICAgLy8gXHU5NTc3XHU2MkJDXHUzMDU3XHU3OUZCXHU1MkQ1XHVGRjFEXHU3NTNCXHU5NzYyXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXG4gICAgICAgICAgICByZXR1cm4gXCJzY3JvbGxcIjtcbiAgICAgICAgfSBlbHNlIGlmIChkaWZmID49IExvbmdwcmVzc1N0YXR1cy5TRUNfRVhQQU5EKSB7XG4gICAgICAgICAgICAvLyBcdTMwNTVcdTMwODlcdTMwNkJcdTk1NzdcdTYyQkNcdTMwNTdcdUZGMURcdTYyRTFcdTU5MjdcdTdFMkVcdTVDMEZcbiAgICAgICAgICAgIHJldHVybiBcInpvb21cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFx1MzBDN1x1MzBENVx1MzBBOVx1MzBFQlx1MzBDOFx1MzA2Rm51bGxcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0KHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuaXNTdGFydCgpKSB7XG4gICAgICAgICAgICAvLyBcdTY1RTJcdTMwNkJcdTk1OEJcdTU5Q0JcdTMwNTdcdTMwNjZcdTMwNDRcdTMwOEJcdTMwNkVcdTMwNjdcdTRGNTVcdTMwODJcdTMwNTdcdTMwNkFcdTMwNDRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBVLnBkKFwic3RhcnQgcHJlc3MuLi5cIik7XG4gICAgICAgIC8vIFx1OTU3N1x1NjJCQ1x1MzA1N1x1MzA2RVx1NEY0RFx1N0Y2RVx1NzhCQVx1OEE4RFxuICAgICAgICB0aGlzLnRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIHRoaXMucG9zID0gbmV3IFBvaW50KHgsIHkpO1xuICAgICAgICB6b29tc2Nyb2xsLnNldFBvaW50KHgsIHkpO1xuXG4gICAgICAgIC8vIFx1ODI3Mlx1MzA5Mlx1NTkwOVx1NjZGNFxuICAgICAgICB0aGlzLnRpbWVvdXRpZHMucHVzaCh3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBcdTMwQURcdTMwRTNcdTMwRjNcdTMwRDBcdTMwQjlcdTMwNkVcdTgyNzJcdTMwOTJcdTU5MDlcdTY2RjRcbiAgICAgICAgICAgIHdyYXBkaXYuc2V0U2Nyb2xsKCk7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRpZHMucHVzaCh3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gXHUzMEFEXHUzMEUzXHUzMEYzXHUzMEQwXHUzMEI5XHUzMDZFXHU4MjcyXHUzMDkyXHU1OTA5XHU2NkY0XG4gICAgICAgICAgICAgICAgd3JhcGRpdi5zZXRFeHBhbmQoKTtcbiAgICAgICAgICAgIH0sIExvbmdwcmVzc1N0YXR1cy5TRUNfRVhQQU5EKSk7XG4gICAgICAgIH0sIExvbmdwcmVzc1N0YXR1cy5TRUNfU0NST0xMKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzU2FtZVBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMucG9zID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBcdTUyNERcdTMwNkVcdTcwQjlcdTMwNENcdTMwNkFcdTMwNDRcdTMwNkVcdTMwNjdcdTU0MENcdTMwNThcdTMwNjdcdTMwNkZcdTMwNkFcdTMwNDRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXQgPSB0aGlzLnBvcy5pc1NhbWUoeCwgeSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGlzU3RhcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpbWVvdXRpZHMubGVuZ3RoID4gMDtcbiAgICB9XG59IiwgIid1c2Ugc3RyaWN0J1xubW9kdWxlLmV4cG9ydHMgPSByZmRjXG5cbmZ1bmN0aW9uIGNvcHlCdWZmZXIgKGN1cikge1xuICBpZiAoY3VyIGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGN1cilcbiAgfVxuXG4gIHJldHVybiBuZXcgY3VyLmNvbnN0cnVjdG9yKGN1ci5idWZmZXIuc2xpY2UoKSwgY3VyLmJ5dGVPZmZzZXQsIGN1ci5sZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHJmZGMgKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cblxuICBpZiAob3B0cy5jaXJjbGVzKSByZXR1cm4gcmZkY0NpcmNsZXMob3B0cylcbiAgcmV0dXJuIG9wdHMucHJvdG8gPyBjbG9uZVByb3RvIDogY2xvbmVcblxuICBmdW5jdGlvbiBjbG9uZUFycmF5IChhLCBmbikge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYSlcbiAgICB2YXIgYTIgPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgayA9IGtleXNbaV1cbiAgICAgIHZhciBjdXIgPSBhW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIGEyW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgYTJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIGEyW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhMltrXSA9IGZuKGN1cilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGEyXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZSAobykge1xuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbCkgcmV0dXJuIG9cbiAgICBpZiAobyBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBuZXcgRGF0ZShvKVxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pKSByZXR1cm4gY2xvbmVBcnJheShvLCBjbG9uZSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmUpKVxuICAgIHZhciBvMiA9IHt9XG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobywgaykgPT09IGZhbHNlKSBjb250aW51ZVxuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvMltrXSA9IGNsb25lKGN1cilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG8yXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZVByb3RvIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lUHJvdG8pXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgdmFyIG8yID0ge31cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIHZhciBjdXIgPSBvW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIG8yW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgbzJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBvMltrXSA9IG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lUHJvdG8pKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgbzJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8yW2tdID0gY2xvbmVQcm90byhjdXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvMlxuICB9XG59XG5cbmZ1bmN0aW9uIHJmZGNDaXJjbGVzIChvcHRzKSB7XG4gIHZhciByZWZzID0gW11cbiAgdmFyIHJlZnNOZXcgPSBbXVxuXG4gIHJldHVybiBvcHRzLnByb3RvID8gY2xvbmVQcm90byA6IGNsb25lXG5cbiAgZnVuY3Rpb24gY2xvbmVBcnJheSAoYSwgZm4pIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGEpXG4gICAgdmFyIGEyID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGsgPSBrZXlzW2ldXG4gICAgICB2YXIgY3VyID0gYVtrXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBhMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGEyW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBhMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGluZGV4ID0gcmVmcy5pbmRleE9mKGN1cilcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIGEyW2tdID0gcmVmc05ld1tpbmRleF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhMltrXSA9IGZuKGN1cilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTJcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lKVxuICAgIGlmIChvIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lKSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIFNldCkgcmV0dXJuIG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgdmFyIG8yID0ge31cbiAgICByZWZzLnB1c2gobylcbiAgICByZWZzTmV3LnB1c2gobzIpXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobywgaykgPT09IGZhbHNlKSBjb250aW51ZVxuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgbzJba10gPSBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZSkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaSA9IHJlZnMuaW5kZXhPZihjdXIpXG4gICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgIG8yW2tdID0gcmVmc05ld1tpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8yW2tdID0gY2xvbmUoY3VyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZnMucG9wKClcbiAgICByZWZzTmV3LnBvcCgpXG4gICAgcmV0dXJuIG8yXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZVByb3RvIChvKSB7XG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0JyB8fCBvID09PSBudWxsKSByZXR1cm4gb1xuICAgIGlmIChvIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG8pXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykpIHJldHVybiBjbG9uZUFycmF5KG8sIGNsb25lUHJvdG8pXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmVQcm90bykpXG4gICAgdmFyIG8yID0ge31cbiAgICByZWZzLnB1c2gobylcbiAgICByZWZzTmV3LnB1c2gobzIpXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICB2YXIgY3VyID0gb1trXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBvMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgbzJba10gPSBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIG8yW2tdID0gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmVQcm90bykpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaSA9IHJlZnMuaW5kZXhPZihjdXIpXG4gICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgIG8yW2tdID0gcmVmc05ld1tpXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8yW2tdID0gY2xvbmVQcm90byhjdXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmVmcy5wb3AoKVxuICAgIHJlZnNOZXcucG9wKClcbiAgICByZXR1cm4gbzJcbiAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcbmltcG9ydCByZmRjIGZyb20gXCJyZmRjXCI7XG5cbmV4cG9ydCBjbGFzcyBQZW5BY3Rpb24ge1xuICAgIHB1YmxpYyByZWFkb25seSBvcHQgPSB7XG4gICAgICAgIGNvbG9yOiA8c3RyaW5nPlwiXCIsXG4gICAgICAgIGVyYXNlcjogPGJvb2xlYW4+ZmFsc2UsXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcHRiazogYW55O1xuICAgIHByaXZhdGUgY2xvbmUgPSByZmRjKCk7XG5cbiAgICBwdWJsaWMgaW5pdChjb2xvcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9wdC5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLm9wdGJrID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJvYyh4OiBudW1iZXIsIHk6IG51bWJlciwgcHJlcDogUG9pbnQsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHByZSA9IHByZXA7XG4gICAgICAgIGlmIChwcmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gXHU1MjREXHU1NkRFXHUzMDZFXHU3MEI5XHUzMDRDXHUzMDZBXHUzMDUxXHUzMDhDXHUzMDcwXHU0RUNBXHU1NkRFXHUzMDZFXHU3MEI5XG4gICAgICAgICAgICBwcmUgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3R4ID0gcGFwZXIuZ2V0Q3R4KCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0LmVyYXNlcikge1xuICAgICAgICAgICAgdGhpcy5lcmFzZSh4LCB5LCBwcmUsIGN0eClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGVuKHgsIHksIHByZSwgY3R4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHBlbih4OiBudW1iZXIsIHk6IG51bWJlciwgcHJlOiBQb2ludCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICAgICAgLy8gTVlUT0RPIDogXHU3MEI5XHUzMDZCXHU1OTA5XHU2NkY0XHUzMDU3XHUzMDY2XHUzMDdGXHUzMDY2XHUzMDZGXHVGRjFGXG4gICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubGluZUNhcCA9IFwicm91bmRcIjtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMub3B0LmNvbG9yO1xuICAgICAgICBjdHgubW92ZVRvKHByZS54LCBwcmUueSk7XG4gICAgICAgIGN0eC5saW5lVG8oeCwgeSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBlcmFzZSh4OiBudW1iZXIsIHk6IG51bWJlciwgcHJlOiBQb2ludCwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgLy8gXHU3OUZCXHU1MkQ1XHU4REREXHU5NkUyXHUzMDY3XHU2RDg4XHUzMDU5XHU3QkM0XHU1NkYyXHUzMDkyXHU4QUJGXHU2NTc0XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLmFicyh4IC0gcHJlLngpICsgTWF0aC5hYnMoeSAtIHByZS55KTtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCh4IC0gZCwgeSAtIGQsIGQgKiAyLCBkICogMik7XG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNhdmVPcHQoKSB7XG4gICAgICAgIHRoaXMub3B0YmsgPSB0aGlzLmNsb25lKHRoaXMub3B0KTtcbiAgICAgICAgLy8gVS5wZCh0aGlzLm9wdGJrKTtcbiAgICB9XG4gICAgcHVibGljIHJlc3RvcmVPcHQoKSB7XG4gICAgICAgIGZvcihjb25zdCBbaWR4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMub3B0YmspKSB7XG4gICAgICAgICAgICB0aGlzLm9wdFtpZHhdID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2UgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmRvRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZHJhdzogRHJhd01pbmU7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHVibGljIGluaXQocGFwZXI6IFBhcGVyRWxlbWVudCwgZHJhdzogRHJhd01pbmUsIHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtdW5kb1wiKTtcblxuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cbiAgICBwcml2YXRlIHByb2MoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NjcwMFx1NjVCMFx1MzA2RXN0cm9rZVx1MzA5Mlx1NzgzNFx1NjhDNFx1MzA1N1x1MzA2Nlx1MzAwMVx1MzA1RFx1MzA2RVx1NTE4NVx1NUJCOVx1MzA5Mlx1NTNENlx1NUY5N1xuICAgICAgICBjb25zdCBzdHJva2VzOiBTdHJva2VbXSA9IHRoaXMuZHJhdy51bmRvKCk7XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlx1MzAwMVx1OEEyRFx1NUI5QVx1MzA5Mlx1NEZERFx1NUI1OFxuICAgICAgICB0aGlzLnBhcGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucGVuLnNhdmVPcHQoKTtcblxuICAgICAgICAvLyBcdTY1MzlcdTMwODFcdTMwNjZcdTYzQ0ZcdTc1M0JcbiAgICAgICAgbGV0IHByZXBvaW50OiBQb2ludCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBpZiAocy5pc0VyYXNlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gcy5jb2xvcjsgLy8gXHU4MjcyXHU2MEM1XHU1ODMxXHUzMDZGXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDRDXHU1RkY1XHUzMDZFXHU3MEJBXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHMuZ2V0UG9pbnRzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgdGhpcy5wYXBlcik7XG4gICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcG9pbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHU4QTJEXHU1QjlBXHUzMDkyXHU1RkE5XHU1RTMwXG4gICAgICAgIHRoaXMucGVuLnJlc3RvcmVPcHQoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvRHJhd2NhbnZhc2VzRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9ab29tRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tU2Nyb2xsQWN0aW9uIHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tRWxlbWVudDtcbiAgICBwcml2YXRlIHByZXA6IFBvaW50ID0gbnVsbDtcbiAgICBwcml2YXRlIG5vd3pvb206IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSBvcmd3OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgb3JnaDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgWk9PTV9NQVg6IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSByZWFkb25seSBaT09NX01JTjogbnVtYmVyID0gMC41O1xuXG4gICAgcHVibGljIGluaXQod3JhcGRpdjogRHJhd2NhbnZhc2VzRWxlbWVudCwgem9vbXNjcm9sbDogWm9vbUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy53cmFwZGl2ID0gd3JhcGRpdjtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsID0gem9vbXNjcm9sbDtcbiAgICAgICAgdGhpcy5ub3d6b29tID0gMTtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsLnNob3codGhpcy5ub3d6b29tKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICAgICAgICB0aGlzLm9yZ3cgPSBwYXJzZUludChlbGUuc3R5bGUud2lkdGgucmVwbGFjZShcInB4XCIsXCJcIikpO1xuICAgICAgICB0aGlzLm9yZ2ggPSBwYXJzZUludChlbGUuc3R5bGUuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLFwiXCIpKTtcbiAgICB9XG4gICAgcHVibGljIHNldFBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucHJlcCA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICB9XG4gICAgcHVibGljIHNjcm9sbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmlnbm9yZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gXHU1REVFXHU1MjA2XHUzMDZFXHU4QTA4XHU3Qjk3XG4gICAgICAgIGNvbnN0IGR4ID0gICh0aGlzLnByZXAueCAtIHgpICogdGhpcy5ub3d6b29tICogNztcbiAgICAgICAgY29uc3QgZHkgPSAodGhpcy5wcmVwLnkgLSB5KSAqIHRoaXMubm93em9vbSAqIDc7XG5cbiAgICAgICAgLy8gXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXHU1QjlGXHU4ODRDXG4gICAgICAgIGNvbnN0IG54ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICBjb25zdCBueSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgd2luZG93LnNjcm9sbCh7XG4gICAgICAgICAgICBsZWZ0OiBueCArIGR4LFxuICAgICAgICAgICAgdG9wOiBueSArIGR5LFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVS5wZChgc2Nyb2xsIDogJHt0aGlzLnByZXAueH0tJHt4fT0ke2R4fSwgJHt0aGlzLnByZXAueX0tJHt5fT0ke2R5fWApO1xuXG4gICAgICAgIC8vIFx1MzBERFx1MzBBNFx1MzBGM1x1MzBDOFx1MzA2RVx1NjZGNFx1NjVCMFxuICAgICAgICB0aGlzLnByZXAueCA9IHg7XG4gICAgICAgIHRoaXMucHJlcC55ID0geTtcbiAgICB9XG4gICAgcHVibGljIHpvb21kcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGR5ID0gdGhpcy5wcmVwLnkgLSB5O1xuICAgICAgICAvLyBcdTc5RkJcdTUyRDVcdTVERUVcdTUyMDZcdTMwOTJ6b29tXHU2QkQ0XHU3Mzg3XHUzMDZCXHU1OTA5XHU2M0RCXHUzMDAyXHU3M0ZFXHU1NzI4XHUzMDZFXHU2QkQ0XHU3Mzg3XHUzMDZCXHUzMDg4XHUzMDYzXHUzMDY2XHU1REVFXHU1MjA2XHU5MUNGXHUzMDkyXHU4QUJGXHU2NTc0XHVGRjA4XHU1OTI3XHUzMDREXHUzMDQ0XHUzMDY4XHU1OTI3XHUzMDREXHUzMDQ0XHVGRjA5XG4gICAgICAgIGNvbnN0IGRpZmYgPSBkeSAqIDAuMDAwNSAqIHRoaXMubm93em9vbTtcbiAgICAgICAgdGhpcy56b29tcHJvYyhkaWZmKTtcbiAgICAgICAgLy8gXHUzMEREXHUzMEE0XHUzMEYzXHUzMEM4XHUzMDZFXHU2NkY0XHU2NUIwXG4gICAgICAgIHRoaXMucHJlcC54ID0geDtcbiAgICAgICAgdGhpcy5wcmVwLnkgPSB5O1xuICAgIH1cbiAgICBwdWJsaWMgem9vbXByb2MoZGlmZjogbnVtYmVyKTp2b2lkIHtcbiAgICAgICAgdGhpcy5ub3d6b29tICs9IGRpZmY7XG4gICAgICAgIC8vIFx1N0JDNFx1NTZGMlx1ODhEQ1x1NkI2M1xuICAgICAgICB0aGlzLm5vd3pvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLm5vd3pvb20sIHRoaXMuWk9PTV9NSU4pLCB0aGlzLlpPT01fTUFYKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICAgICAgICBlbGUuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7dGhpcy5ub3d6b29tfSlgO1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwuc2hvdyh0aGlzLm5vd3pvb20pO1xuICAgICAgICBlbGUuc3R5bGUud2lkdGggPWAke3RoaXMub3JndyAqIHRoaXMubm93em9vbX1weGA7XG4gICAgICAgIGVsZS5zdHlsZS5oZWlnaHQgPWAke3RoaXMub3JnaCAqIHRoaXMubm93em9vbX1weGA7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRab29tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3pvb207XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmV0aW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgaWdub3JlKCkge1xuICAgICAgICBjb25zdCBuOm51bWJlciA9IERhdGUubm93KCk7XG4gICAgICAgIGxldCByZXQgPSB0cnVlO1xuICAgICAgICBpZihuIC0gdGhpcy5wcmV0aW1lID4gMC4wMSAqIDEwMDApIHtcbiAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcmV0aW1lID0gbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBUb3VjaFNlbnNvciB9IGZyb20gXCIuLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFpvb21TY3JvbGxBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1pvb21TY3JvbGxBY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFpvb21FbGVtZW50IHtcbiAgICBwcml2YXRlIGxibDogSFRNTFNwYW5FbGVtZW50O1xuICAgIHByaXZhdGUgYnRwOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBwcml2YXRlIGJ0bTogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uO1xuXG4gICAgcHVibGljIGluaXQoem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwgPSB6b29tc2Nyb2xsO1xuICAgICAgICB0aGlzLmxibCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5idHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3pvb20tcGx1c1wiKTtcbiAgICAgICAgdGhpcy5idG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3pvb20tbWludXNcIik7XG5cbiAgICAgICAgdGhpcy5idHAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuem9vbXNjcm9sbC56b29tcHJvYygwLjEpKTtcbiAgICAgICAgdGhpcy5idHAuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKDAuMSkpO1xuICAgICAgICB0aGlzLmJ0bS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKC0wLjEpKTtcbiAgICAgICAgdGhpcy5idG0uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKC0wLjEpKTtcbiAgICB9XG4gICAgcHVibGljIGxhYmVsKCk6IEhUTUxTcGFuRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmxibDtcbiAgICB9XG4gICAgcHVibGljIHNob3cobm93em9vbTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGJsLmlubmVySFRNTCA9IGAke01hdGgucm91bmQobm93em9vbSAqIDEwMCkudG9TdHJpbmcoKX0lYDtcbiAgICB9XG59IiwgImltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBFcmFzZXJFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWN0LWVyYXNlclwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jKCkge1xuICAgICAgICB0aGlzLnBlbi5vcHQuZXJhc2VyID0gIXRoaXMucGVuLm9wdC5lcmFzZXI7XG4gICAgICAgIGNvbnN0IGVuYWJsZSA9IFwiaGFzLWJhY2tncm91bmQtcHJpbWFyeVwiO1xuICAgICAgICBjb25zdCBkaXNhYmxlID0gXCJoYXMtYmFja2dyb3VuZC1saWdodFwiO1xuICAgICAgICAvLyBcdTg4NjhcdTc5M0FcdTMwOTJcdTY2RjRcdTY1QjBcbiAgICAgICAgaWYgKHRoaXMucGVuLm9wdC5lcmFzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLmNsYXNzTGlzdC5yZXBsYWNlKGRpc2FibGUsIGVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZS5jbGFzc0xpc3QucmVwbGFjZShlbmFibGUsIGRpc2FibGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIENvbG9yRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvblxuXG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbiwgY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wZW4tY29sb3JcIikuZm9yRWFjaCgoZWxlOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IDxIVE1MRWxlbWVudD5ldi50YXJnZXQ7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5vcHQuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChgY2hhbmdlIHRvICR7Y29sb3J9YCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5wZW4ub3B0LmNvbG9yID0gVS50b1JnYkhleChjb2xvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuXG5leHBvcnQgY2xhc3MgQmFja0VsZW1lbnQge1xuICAgIHByaXZhdGUgZWxlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGRyYXc6IERyYXdNaW5lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWN0LWJhY2tcIik7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuICAgIHB1YmxpYyBpbml0KGRyYXc6IERyYXdNaW5lKSB7XG4gICAgICAgIHRoaXMuZHJhdyA9IGRyYXc7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgcHJvYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYXcuaXNTYXZlZCgpKSB7XG4gICAgICAgICAgICBpZiAoYXdhaXQgVS50b2FzdC5jb25maXJtKFwiXHU0RkREXHU1QjU4XHUzMDU3XHUzMDdFXHUzMDU5XHUzMDRCXHVGRjFGXCIsIFwiXHU0RkREXHU1QjU4XHUzMDU3XHUzMDY2XHU2MjNCXHUzMDhCXCIsIFwiXHU3ODM0XHU2OEM0XHUzMDU3XHUzMDY2XHU2MjNCXHUzMDhCXCIpKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kcmF3LnNhdmUoKTtcbiAgICAgICAgICAgICAgICBVLnBkKFwib2tcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFUucGQoXCJjYW5jZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBVLnBkKFwibm8gY29udGVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ZVE9ETyBcdTkwRThcdTVDNEJcdTdCNDlcdTMwNkVcdTk1OEJcdTc2N0FcdTVGOENcdTMwNkJcdTg5OEJcdTc2RjRcdTMwNTdcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9cIjtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnR9IGZyb20gXCIuL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgRGV2aWNlIH0gZnJvbSBcIi4vdS90eXBlc1wiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0IHsgRHJhd090aGVyIH0gZnJvbSBcIi4vZGF0YS9EcmF3T3RoZXJcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4vdS91XCI7XG5pbXBvcnQgeyBNb3VzZVNlbnNvciB9IGZyb20gXCIuL3NlbnNvci9Nb3VzZVNlbnNvclwiO1xuaW1wb3J0IHsgUG9pbnRlclNlbnNvciB9IGZyb20gXCIuL3NlbnNvci9Qb2ludGVyU2Vuc29yXCI7XG5pbXBvcnQgeyBUb3VjaFNlbnNvciB9IGZyb20gXCIuL3NlbnNvci9Ub3VjaFNlbnNvclwiO1xuaW1wb3J0IHsgU2F2ZUVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L1NhdmVFbGVtZW50XCI7XG5pbXBvcnQgeyBMb2FkQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uL0xvYWRBY3Rpb25cIjtcbmltcG9ydCB7IERyYXdjYW52YXNlc0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnRcIjtcbmltcG9ydCB7IERyYXdTdGF0dXMgfSBmcm9tIFwiLi9kYXRhL0RyYXdTdGF0dXNcIjtcbmltcG9ydCB7IExvbmdwcmVzc1N0YXR1cyB9IGZyb20gXCIuL2RhdGEvTG9uZ3ByZXNzU3RhdHVzXCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5pbXBvcnQgeyBVbmRvRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvVW5kb0VsZW1lbnRcIjtcbmltcG9ydCB7IFpvb21TY3JvbGxBY3Rpb24gfSBmcm9tIFwiLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L1pvb21FbGVtZW50XCI7XG5pbXBvcnQgeyBFcmFzZXJFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9FcmFzZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBDb2xvckVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0NvbG9yRWxlbWVudFwiO1xuaW1wb3J0IHsgQmFja0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0JhY2tFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RXZlbnRIYW5kbGVyIHtcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBub3dzZW5zb3I6IERldmljZTsgLy8gXHUzMEJGXHUzMEMzXHUzMEMxXHUzMDAxXHUzMEREXHUzMEE0XHUzMEYzXHUzMEJGXHU3QjQ5XHUzMDAxXHUzMDdFXHUzMDY4XHUzMDgxXHUzMDY2XHU4OTA3XHU2NTcwXHUzMDZFXHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHUzMDkyXHU2OTFDXHU3N0U1XHUzMDU3XHUzMDVGXHU1ODM0XHU1NDA4XHUzMDZCXHU1MDk5XHUzMDQ4XHUzMDY2XHUzMDAyXG4gICAgcHJpdmF0ZSBzdGF0dXMgPSB7XG4gICAgICAgIGRyYXc6IG5ldyBEcmF3U3RhdHVzKCksXG4gICAgICAgIGxvbmdwcmVzczogbmV3IExvbmdwcmVzc1N0YXR1cygpXG4gICAgfTtcbiAgICBwcml2YXRlIGVsZW1lbnQgPSB7XG4gICAgICAgIHdyYXBkaXY6IG5ldyBEcmF3Y2FudmFzZXNFbGVtZW50KCksXG4gICAgICAgIHpvb21zY3JvbGw6IG5ldyBab29tRWxlbWVudCgpLFxuICAgICAgICBzYXZlOiBuZXcgU2F2ZUVsZW1lbnQoKSxcbiAgICAgICAgZXJhc2VyOiBuZXcgRXJhc2VyRWxlbWVudCgpLFxuICAgICAgICBjb2xvcjogbmV3IENvbG9yRWxlbWVudCgpLFxuICAgICAgICB1bmRvOiBuZXcgVW5kb0VsZW1lbnQoKSxcbiAgICAgICAgYmFjazogbmV3IEJhY2tFbGVtZW50KCksXG4gICAgfTtcbiAgICBwcml2YXRlIGFjdGlvbiA9IHtcbiAgICAgICAgbG9hZDogbmV3IExvYWRBY3Rpb24oKSxcbiAgICAgICAgem9vbXNjcm9sbDogbmV3IFpvb21TY3JvbGxBY3Rpb24oKSxcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBtaW5lID0ge1xuICAgICAgICBwYXBlcjogUGFwZXJFbGVtZW50Lm1ha2VNaW5lKCksXG4gICAgICAgIGRyYXc6IG5ldyBEcmF3TWluZSgpLFxuICAgICAgICBwZW46IG5ldyBQZW5BY3Rpb24oKSxcbiAgICB9O1xuICAgIHByaXZhdGUgb3RoZXIgPSB7XG4gICAgICAgIHBhcGVyOiBQYXBlckVsZW1lbnQubWFrZU90aGVyKCksXG4gICAgICAgIGRyYXc6IG5ldyBEcmF3T3RoZXIoKSxcbiAgICAgICAgcGVuOiBuZXcgUGVuQWN0aW9uKCksXG4gICAgfTtcbiAgICBwcml2YXRlIGRldmljZSA9IHtcbiAgICAgICAgbW91c2U6IG5ldyBNb3VzZVNlbnNvcigpLFxuICAgICAgICBwb2ludGVyOiBuZXcgUG9pbnRlclNlbnNvcigpLFxuICAgICAgICB0b3VjaDogbmV3IFRvdWNoU2Vuc29yKCksXG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHNkID0gdGhpcy5sb2FkU2VydmVyRGF0YSgpO1xuICAgICAgICBjb25zdCBjb2xvciA9IHNkW1wiI3NkLWNvbG9yXCJdO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC56b29tc2Nyb2xsLmluaXQodGhpcy5hY3Rpb24uem9vbXNjcm9sbCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zYXZlLmluaXQodGhpcy5taW5lLmRyYXcpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY29sb3IuaW5pdCh0aGlzLm1pbmUucGVuLCBjb2xvcik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5lcmFzZXIuaW5pdCh0aGlzLm1pbmUucGVuKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnVuZG8uaW5pdCh0aGlzLm1pbmUucGFwZXIsIHRoaXMubWluZS5kcmF3LCB0aGlzLm1pbmUucGVuKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmJhY2suaW5pdCh0aGlzLm1pbmUuZHJhdyk7XG5cbiAgICAgICAgdGhpcy5kZXZpY2UubW91c2UuaW5pdCh0aGlzLCB0aGlzLm1pbmUucGFwZXIpO1xuICAgICAgICB0aGlzLmRldmljZS5wb2ludGVyLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5kZXZpY2UudG91Y2guaW5pdCh0aGlzLCB0aGlzLm1pbmUucGFwZXIsIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwpO1xuXG4gICAgICAgIHRoaXMuYWN0aW9uLmxvYWQuaW5pdCh0aGlzLm90aGVyLnBhcGVyLCB0aGlzLm90aGVyLmRyYXcsIHRoaXMub3RoZXIucGVuKTtcbiAgICAgICAgdGhpcy5hY3Rpb24uem9vbXNjcm9sbC5pbml0KHRoaXMuZWxlbWVudC53cmFwZGl2LCB0aGlzLmVsZW1lbnQuem9vbXNjcm9sbCk7XG4gICAgICAgIHRoaXMubWluZS5wZW4uaW5pdChjb2xvcik7XG5cbiAgICAgICAgdGhpcy5taW5lLmRyYXcuaW5pdCh0aGlzLm1pbmUucGVuKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBsb2FkU2VydmVyRGF0YSgpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IGlkczogc3RyaW5nW10gPSBbXG4gICAgICAgICAgICBcIiNzZC1jb2xvclwiXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHJldCA9IFtdO1xuICAgICAgICBmb3IoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAgICAgICByZXRbaWRdID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCkuaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRvd24oZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gcC55O1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tZG93bigke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBkZXY7XG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc3RhcnRTdHJva2UoKTtcbiAgICAgICAgdGhpcy5zdGF0dXMubG9uZ3ByZXNzLnN0YXJ0KHRoaXMuZWxlbWVudC53cmFwZGl2LCB4LCB5LCB0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTsgLy8gXHU5NTc3XHU2MkJDXHUzMDU3XHU5NThCXHU1OUNCXHU1NzMwXHU3MEI5XG4gICAgfVxuXG4gICAgcHVibGljIG1vdmUoZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gcC55O1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tbW92ZSgke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgLy8gXHU3MTIxXHU4OTk2XHUzMDU5XHUzMDhCXHU2NzYxXHU0RUY2XG4gICAgICAgIGlmICh0aGlzLm5vd3NlbnNvciA9PT0gbnVsbCAvLyBcdTMwQzdcdTMwRDBcdTMwQTRcdTMwQjlcdTY3MkFcdTZDN0FcdTVCOUFcdTMwNkFcdTMwNkVcdTMwNjdcdTRGNTVcdTMwODJcdTMwNTdcdTMwNkFcdTMwNDRcbiAgICAgICAgICAgIHx8IHRoaXMubm93c2Vuc29yICE9PSBkZXYgLy8gXHU5MDU1XHUzMDQ2XHUzMEM3XHUzMEQwXHUzMEE0XHUzMEI5XHUzMDZFXHUzMEE0XHUzMEQ5XHUzMEYzXHUzMEM4XHUzMDZBXHUzMDZFXHUzMDY3XHU3MTIxXHU4OTk2XG4gICAgICAgICAgICB8fCB0aGlzLnN0YXR1cy5sb25ncHJlc3MuaXNTYW1lUG9pbnQoeCwgeSkgLy8gXHU1MkQ1XHUzMDQ0XHUzMDY2XHUzMDQ0XHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU0RjU1XHUzMDgyXHUzMDU3XHUzMDZBXHUzMDQ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5zdGF0dXMubG9uZ3ByZXNzLmlzU3RhcnQoKSkge1xuICAgICAgICAgICAgLy8gXHU5NTc3XHU2MkJDXHUzMDU3XHU2NjQyXHU5NTkzXHUzMDZFXHU1MjI0XHU1QjlBXG4gICAgICAgICAgICBjb25zdCB0b29sID0gdGhpcy5zdGF0dXMubG9uZ3ByZXNzLmVuZCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMuZHJhdy5zZXRUb29sKHRvb2wpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1MzBDNFx1MzBGQ1x1MzBFQlx1MzA2Qlx1NUZEQ1x1MzA1OFx1MzA2Nlx1NTFFNlx1NzQwNlxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdHVzLmRyYXcuZ2V0VG9vbCgpKSB7XG4gICAgICAgICAgICBjYXNlIFwicGVuXCI6XG4gICAgICAgICAgICAgICAgLy8gXHU1MzU4XHU2MkJDXHUzMDU3XHU3OUZCXHU1MkQ1XHVGRjFEXHU4QTE4XHU4RkYwXG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IHRoaXMubWluZS5kcmF3Lmxhc3RQb2ludCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWluZS5wZW4ucHJvYyh4LCB5LCBwLCB0aGlzLm1pbmUucGFwZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1pbmUucGVuLm9wdC5jb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmUuZHJhdy5wdXNoUG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiem9vbVwiOlxuICAgICAgICAgICAgICAgIC8vIFx1MzA1NVx1MzA4OVx1MzA2Qlx1OTU3N1x1NjJCQ1x1MzA1N1x1RkYxRFx1NjJFMVx1NTkyN1x1N0UyRVx1NUMwRlxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuem9vbWRyYWcoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXAoZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCkge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBwLng7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS11cCgke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgLy8gXHU3M0ZFXHU1NzI4XHUzMDZFXHUzMEM0XHUzMEZDXHUzMEVCXHUzMDZCXHU1RkRDXHUzMDU4XHUzMDY2XHU1MUU2XHU3NDA2XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0dXMuZHJhdy5nZXRUb29sKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcbiAgICAgICAgICAgICAgICAvLyBcdTk1NzdcdTYyQkNcdTMwNTdcdTc5RkJcdTUyRDVcdUZGMURcdTc1M0JcdTk3NjJcdTMwQjlcdTMwQUZcdTMwRURcdTMwRkNcdTMwRUJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbi56b29tc2Nyb2xsLnNjcm9sbCh4LCB5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDFcdTMwQjlcdTMwQzhcdTMwRURcdTMwRkNcdTMwQUZcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdcdTdENDJcdTRFODZcbiAgICAgICAgdGhpcy5zdGF0dXMuZHJhdy5lbmRTdHJva2UoKTtcbiAgICAgICAgdGhpcy5taW5lLmRyYXcuZW5kU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC53cmFwZGl2LnNldE5vcm1hbCgpO1xuICAgICAgICB0aGlzLnN0YXR1cy5sb25ncHJlc3MuZW5kKCk7IC8vIFx1OTU3N1x1NjJCQ1x1MzA1N1x1MzA2RVx1MzA3RVx1MzA3RVx1OTZFMlx1MzA1OVx1NTgzNFx1NTQwOFx1MzA4Mlx1MzA0Mlx1MzA4QVx1MzAwMlxuICAgICAgICB0aGlzLm5vd3NlbnNvciA9IG51bGw7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5cbmNvbnN0IGJ1bG1hTmF2RHJvcCA9IChlOiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIik7XG59XG5jb25zdCBpbml0QnVsbWFOYXZEcm9wID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcGRvd24gLmRyb3Bkb3duLXRyaWdnZXIgYVwiKS5mb3JFYWNoKG5hdiA9PiB7XG4gICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnVsbWFOYXZEcm9wKTtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBidWxtYU5hdkRyb3ApO1xuICAgIH0pO1xufTtcbi8vIGNvbnN0IGJ1bG1hTmF2RHJvcCA9IChlOiBFdmVudCkgPT4ge1xuLy8gICAgIGNvbnN0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4vLyAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIik7XG4vLyB9XG4vLyBjb25zdCBpbml0QnVsbWFOYXZEcm9wID0gKCkgPT4ge1xuLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaGFzLWRyb3Bkb3duIC5uYXZiYXItbGlua1wiKS5mb3JFYWNoKG5hdiA9PiB7XG4vLyAgICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnVsbWFOYXZEcm9wKTtcbi8vICAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBidWxtYU5hdkRyb3ApO1xuLy8gICAgIH0pO1xuLy8gfTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZHJhd2NhbnZhc2VzXCIpKSB7XG4gICAgICAgIGNvbnN0IHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyID0gbmV3IERyYXdFdmVudEhhbmRsZXIoKTtcbiAgICAgICAgc2Vuc2UuaW5pdCgpO1xuICAgIH1cbiAgICBjb25zdCBib2R5OiBIVE1MQm9keUVsZW1lbnQgPSA8SFRNTEJvZHlFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgLy8gaW9zXHUzMDZFXHUzMDY4XHUzMDREXHUzMDZFXHUzMEQ0XHUzMEYzXHUzMEMxXHUzMDg0XHUzMEMwXHUzMEQ2XHUzMEVCXHUzMEFGXHUzMEVBXHUzMEMzXHUzMEFGXHUzMDZCXHUzMDg4XHUzMDhCXHU2MkUxXHU1OTI3XHUzMDkyXHU3MTIxXHU1MkI5XHU1MzE2XG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuICAgIGluaXRCdWxtYU5hdkRyb3AoKTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFDYTtBQURiO0FBQUE7QUFDTyxNQUFNLGVBQU4sTUFBbUI7QUFBQSxRQUl0QixPQUFjLFdBQXlCO0FBQ25DLGlCQUFPLElBQUksYUFBYSxXQUFXO0FBQUEsUUFDdkM7QUFBQSxRQUNBLE9BQWMsWUFBMEI7QUFDcEMsaUJBQU8sSUFBSSxhQUFhLGNBQWM7QUFBQSxRQUMxQztBQUFBLFFBQ1EsWUFBWSxVQUFrQjtBQUNsQyxlQUFLLE1BQU0sU0FBUyxjQUFjLFFBQVE7QUFDMUMsZUFBSyxNQUFNLEtBQUssSUFBSSxXQUFXLElBQUk7QUFBQSxRQUN2QztBQUFBLFFBRU8sU0FBbUM7QUFDdEMsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsUUFDTyxTQUE0QjtBQUMvQixpQkFBTyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUNPLFFBQWM7QUFDakIsZ0JBQU0sSUFBWSxLQUFLLElBQUk7QUFDM0IsZ0JBQU0sSUFBWSxLQUFLLElBQUk7QUFDM0IsZUFBSyxJQUFJLFVBQVUsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUFBLFFBQ2pDO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzNCQSxNQUFhLE1BOENBLGlCQW9EQTtBQWxHYjtBQUFBO0FBQU8sTUFBTSxPQUFOLE1BQVc7QUFBQSxRQUdkLGNBQWM7QUFDVixlQUFLLElBQUksQ0FBQztBQUFBLFFBQ2Q7QUFBQSxRQUNPLEtBQUssR0FBaUI7QUFDekIsZUFBSyxFQUFFLEtBQUssQ0FBQztBQUFBLFFBQ2pCO0FBQUEsUUFDTyxNQUFxQjtBQUN4QixnQkFBTSxNQUFjLEtBQUssRUFBRSxJQUFJO0FBQy9CLGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBQ08sT0FBc0I7QUFDekIsZ0JBQU0sTUFBYyxLQUFLLEVBQUUsU0FBUyxJQUFJLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxLQUFLO0FBQ3BFLGlCQUFPO0FBQUEsUUFDWDtBQUFBLFFBQ08sYUFBdUI7QUFDMUIsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsUUFDTyxjQUE2QjtBQUNoQyxjQUFJLEtBQUssRUFBRSxXQUFXLEdBQUc7QUFDckIsbUJBQU87QUFBQSxVQUNYLE9BQU87QUFDSCxtQkFBTyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVM7QUFBQSxVQUNsQztBQUFBLFFBQ0o7QUFBQSxRQUNPLE9BQWU7QUFDbEIsZ0JBQU0sTUFBZ0IsQ0FBQztBQUN2QixxQkFBVyxLQUFLLEtBQUssR0FBRztBQUNwQixnQkFBSSxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQUEsVUFDckI7QUFDQSxpQkFBTyxJQUFJLElBQUksS0FBSyxHQUFHO0FBQUEsUUFDM0I7QUFBQSxRQUNPLE1BQU0sU0FBc0I7QUFDL0IsZUFBSyxJQUFJLENBQUM7QUFDVixxQkFBVyxLQUFLLFNBQVM7QUFDckIsa0JBQU0sTUFBTSxJQUFJLE9BQU87QUFDdkIsZ0JBQUksTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFO0FBQ3BCLGlCQUFLLEVBQUUsS0FBSyxHQUFHO0FBQUEsVUFDbkI7QUFBQSxRQUNKO0FBQUEsUUFDTyxTQUFpQjtBQUNwQixpQkFBTyxLQUFLLEVBQUU7QUFBQSxRQUNsQjtBQUFBLE1BQ0o7QUFDTyxNQUFNLFVBQU4sTUFBYTtBQUFBLFFBS2hCLGNBQWM7QUFDVixlQUFLLElBQUksQ0FBQztBQUFBLFFBQ2Q7QUFBQSxRQUNPLEtBQUssR0FBZ0I7QUFDeEIsZUFBSyxFQUFFLEtBQUssQ0FBQztBQUFBLFFBQ2pCO0FBQUEsUUFDTyxZQUFxQjtBQUN4QixpQkFBTyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUNPLFlBQTBCO0FBQzdCLGNBQUksS0FBSyxFQUFFLFdBQVcsR0FBRztBQUNyQixtQkFBTztBQUFBLFVBQ1gsT0FBTztBQUNILG1CQUFPLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUztBQUFBLFVBQ2xDO0FBQUEsUUFDSjtBQUFBLFFBQ08sUUFBYztBQUNqQixlQUFLLElBQUksQ0FBQztBQUFBLFFBQ2Q7QUFBQSxRQUNPLFNBQWlCO0FBQ3BCLGlCQUFPLEtBQUssRUFBRTtBQUFBLFFBQ2xCO0FBQUEsUUFDTyxPQUFlO0FBQ2xCLGdCQUFNLE1BQWdCLENBQUM7QUFDdkIscUJBQVcsS0FBSyxLQUFLLEdBQUc7QUFDcEIsZ0JBQUksS0FBSyxFQUFFLEtBQUssQ0FBQztBQUFBLFVBQ3JCO0FBQ0EsaUJBQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEdBQUc7QUFBQSxRQUM1QztBQUFBLFFBQ08sTUFBTSxPQUFlLEtBQWtCO0FBQzFDLGVBQUssUUFBUTtBQUNiLGVBQUssSUFBSSxDQUFDO0FBQ1YscUJBQVcsS0FBSyxLQUFLO0FBRWpCLGtCQUFNLE1BQU0sSUFBSSxNQUFNLFNBQVMsRUFBRSxFQUFFLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQztBQUNwRCxpQkFBSyxFQUFFLEtBQUssR0FBRztBQUFBLFVBQ25CO0FBQUEsUUFDSjtBQUFBLFFBQ08sV0FBVztBQUNkLGdCQUFNLE1BQU0sS0FBSyxVQUFVLFFBQU87QUFDbEMsaUJBQU87QUFBQSxRQUNYO0FBQUEsUUFDTyxRQUFRO0FBQ1gsaUJBQU8sQ0FBQyxLQUFLLFNBQVM7QUFBQSxRQUMxQjtBQUFBLE1BQ0o7QUFsRE8sTUFBTSxTQUFOO0FBQ0gsTUFEUyxPQUNjLFlBQVk7QUFtRGhDLE1BQU0sUUFBTixNQUFZO0FBQUEsUUFHZixZQUFZLEdBQVcsR0FBVztBQUM5QixlQUFLLElBQUk7QUFDVCxlQUFLLElBQUk7QUFBQSxRQUNiO0FBQUEsUUFDTyxPQUFlO0FBQ2xCLGdCQUFNLE1BQU0sSUFBSSxLQUFLLEtBQUssS0FBSztBQUMvQixpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNPLE9BQU8sR0FBVyxHQUFvQjtBQUN6QyxnQkFBTSxRQUFpQixNQUFNLEtBQUs7QUFDbEMsZ0JBQU0sUUFBaUIsTUFBTSxLQUFLO0FBQ2xDLGlCQUFPLFNBQVM7QUFBQSxRQUNwQjtBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUNsSEEsTUFHYTtBQUhiO0FBQUE7QUFBQTtBQUdPLE1BQU0sV0FBTixNQUFlO0FBQUEsUUFRbEIsY0FBYztBQUNWLGVBQUssT0FBTyxJQUFJLEtBQUs7QUFDckIsZUFBSyxZQUFZLElBQUksT0FBTztBQUM1QixlQUFLLFVBQVU7QUFDZixnQkFBTSxPQUFpQixPQUFPLFNBQVMsU0FBUyxNQUFNLEdBQUc7QUFDekQsZ0JBQU0sV0FBbUIsU0FBUyxLQUFLLEtBQUssU0FBUyxFQUFFO0FBQ3ZELGVBQUssV0FBVztBQUNoQixlQUFLLGNBQWM7QUFBQSxRQUN2QjtBQUFBLFFBRU8sS0FBSyxLQUFnQjtBQUN4QixlQUFLLE1BQU07QUFBQSxRQUNmO0FBQUEsUUFFTyxVQUFVLEdBQVcsR0FBaUI7QUFDekMsZ0JBQU0sTUFBTSxLQUFLLElBQUk7QUFDckIsY0FBSSxLQUFLLFVBQVUsT0FBTyxNQUFNLEdBQUc7QUFFL0IsaUJBQUssVUFBVSxRQUFRLEtBQUssSUFBSSxJQUFJLFNBQVMsT0FBTyxZQUFZLEtBQUssSUFBSSxJQUFJO0FBQUEsVUFDakY7QUFDQSxnQkFBTSxJQUFJLElBQUksTUFBTSxHQUFHLENBQUM7QUFDeEIsZUFBSyxVQUFVLEtBQUssQ0FBQztBQUFBLFFBQ3pCO0FBQUEsUUFFTyxZQUEwQjtBQUM3QixpQkFBTyxLQUFLLFVBQVUsVUFBVTtBQUFBLFFBQ3BDO0FBQUEsUUFFTyxZQUFrQjtBQUVyQixjQUFJLEtBQUssVUFBVSxPQUFPLElBQUksR0FBRztBQUM3QixpQkFBSyxLQUFLLEtBQUssS0FBSyxTQUFTO0FBRTdCLGlCQUFLLFlBQVksSUFBSSxPQUFPO0FBQUEsVUFDaEM7QUFBQSxRQUNKO0FBQUEsUUFDYSxPQUFzQjtBQUFBO0FBQy9CLGtCQUFNLE9BQWlCLE9BQU8sU0FBUyxTQUFTLE1BQU0sR0FBRztBQUN6RCxrQkFBTSxXQUFtQixTQUFTLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDdkQsa0JBQU0sTUFBTSxhQUFhO0FBQ3pCLGtCQUFNLFdBQVcsSUFBSSxTQUFTO0FBQzlCLHFCQUFTLE9BQU8sYUFBYSxLQUFLLEtBQUssS0FBSyxDQUFDO0FBQzdDLHFCQUFTLE9BQU8sV0FBVyxLQUFLLE9BQU87QUFDdkMsa0JBQU0sU0FBc0I7QUFBQSxjQUN4QixRQUFRO0FBQUEsY0FDUixNQUFNO0FBQUEsWUFDVjtBQUNBLGtCQUFNLFdBQVcsTUFBTSxNQUFNLEtBQUssTUFBTTtBQUN4QyxrQkFBTSxXQUFXLEtBQUssTUFBTSxNQUFNLFNBQVMsS0FBSyxDQUFDO0FBQ2pELGdCQUFJLEtBQUssWUFBWSxNQUFNO0FBQ3ZCLG1CQUFLLFVBQVUsU0FBUyxRQUFRLFNBQVM7QUFBQSxZQUM3QztBQUNBLGlCQUFLLGNBQWMsS0FBSyxLQUFLLEtBQUs7QUFBQSxVQUN0QztBQUFBO0FBQUEsUUFFYSxPQUFzQjtBQUFBO0FBQy9CLGdCQUFJO0FBQ0Esb0JBQU0sTUFBTSxhQUFhLEtBQUssaUJBQWlCLEtBQUssWUFBWSxPQUFPLElBQUksS0FBSztBQUNoRixvQkFBTSxXQUFXLElBQUksU0FBUztBQUM5Qix1QkFBUyxPQUFPLGFBQWEsS0FBSyxLQUFLLEtBQUssQ0FBQztBQUM3Qyx1QkFBUyxPQUFPLFdBQVcsS0FBSyxPQUFPO0FBQ3ZDLG9CQUFNLFNBQXNCO0FBQUEsZ0JBQ3hCLFFBQVE7QUFBQSxnQkFDUixNQUFNO0FBQUEsY0FDVjtBQUNBLG9CQUFNLFdBQVcsTUFBTSxNQUFNLEtBQUssTUFBTTtBQUN4QyxvQkFBTSxXQUFXLEtBQUssTUFBTSxNQUFNLFNBQVMsS0FBSyxDQUFDO0FBRWpELGtCQUFJLFVBQWlCLENBQUM7QUFDdEIseUJBQVcsS0FBYSxTQUFTLE1BQU87QUFDcEMsc0JBQU0sTUFBTSxLQUFLLE1BQU0sRUFBRSxTQUFTO0FBQ2xDLDBCQUFVLFFBQVEsT0FBTyxHQUFHO0FBQUEsY0FDaEM7QUFDQSxtQkFBSyxLQUFLLE1BQU0sT0FBTztBQUFBLFlBQzNCLFNBQVMsT0FBUDtBQUNFLHNCQUFRLE1BQU0sS0FBSztBQUFBLFlBQ3ZCO0FBQUEsVUFDSjtBQUFBO0FBQUEsUUFrQk8sT0FBaUI7QUFDcEIsZUFBSyxLQUFLLFdBQVcsRUFBRSxJQUFJO0FBQzNCLGdCQUFNLE1BQU0sS0FBSyxLQUFLLFdBQVc7QUFDakMsaUJBQU87QUFBQSxRQUNYO0FBQUEsUUFFTyxlQUF1QjtBQUMxQixpQkFBTyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUtPLFVBQW1CO0FBQ3RCLGdCQUFNLE1BQWUsS0FBSyxnQkFBZ0IsS0FBSyxLQUFLLEtBQUs7QUFDekQsaUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzNIQSxNQUdhO0FBSGI7QUFBQTtBQUFBO0FBR08sTUFBTSxZQUFOLE1BQWdCO0FBQUEsUUFNbkIsY0FBYztBQUNWLGVBQUssUUFBUSxDQUFDO0FBQ2QsZUFBSyxVQUFVO0FBQ2YsZ0JBQU0sT0FBaUIsT0FBTyxTQUFTLFNBQVMsTUFBTSxHQUFHO0FBQ3pELGdCQUFNLFdBQW1CLFNBQVMsS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN2RCxlQUFLLFdBQVc7QUFBQSxRQUNwQjtBQUFBLFFBRU8sS0FBSyxLQUFnQjtBQUN4QixlQUFLLE1BQU07QUFBQSxRQUNmO0FBQUEsUUFDYSxPQUFzQjtBQUFBO0FBQy9CLGtCQUFNLE1BQU0sYUFBYSxLQUFLLGtCQUFrQixLQUFLLFlBQVksT0FBTyxJQUFJLEtBQUs7QUFDakYsa0JBQU0sV0FBVyxNQUFNLE1BQU0sR0FBRztBQUNoQyxrQkFBTSxPQUFPLE1BQU0sU0FBUyxLQUFLO0FBRWpDLHVCQUFVLEtBQUssS0FBSyxNQUFNLElBQUksR0FBRztBQUM3QixvQkFBTSxNQUFNLEtBQUssTUFBTSxFQUFFLFNBQVM7QUFDbEMsb0JBQU0sT0FBTyxJQUFJLEtBQUs7QUFDdEIsbUJBQUssTUFBTSxHQUFHO0FBQ2QsbUJBQUssTUFBTSxLQUFLLElBQUk7QUFBQSxZQUN4QjtBQUFBLFVBQ0o7QUFBQTtBQUFBLFFBRU8sV0FBbUI7QUFDdEIsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQ3BDQSxNQUlhO0FBSmI7QUFBQTtBQUVBO0FBRU8sTUFBTSxjQUFOLE1BQWtCO0FBQUEsUUFBbEI7QUFHSCxlQUFRLGlCQUE4QyxDQUFDO0FBQUE7QUFBQSxRQUVoRCxLQUFLLE9BQXlCLE9BQTJCO0FBQzVELGVBQUssUUFBUTtBQUNiLGVBQUssUUFBUTtBQUNiLGVBQUssZUFBZSxhQUFhLENBQUMsTUFBa0IsS0FBSyxNQUFNLEdBQUcsU0FBUyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDdkYsZUFBSyxlQUFlLGVBQWUsQ0FBQyxNQUFrQixLQUFLLE1BQU0sS0FBSyxTQUFTLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMzRixlQUFLLGVBQWUsZUFBZSxDQUFDLE1BQWtCLEtBQUssTUFBTSxLQUFLLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzNGLGVBQUssZUFBZSxnQkFBZ0IsQ0FBQyxNQUFrQixLQUFLLE1BQU0sR0FBRyxTQUFTLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMxRixlQUFLLG1CQUFtQjtBQUFBLFFBQzVCO0FBQUEsUUFFTyxxQkFBMkI7QUFDOUIscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsaUJBQWlCLE9BQU8sU0FBUyxFQUFFLFNBQVMsTUFBTSxDQUFDO0FBQUEsVUFDM0U7QUFBQSxRQUNKO0FBQUEsUUFFTyx3QkFBOEI7QUFDakMscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsb0JBQW9CLE9BQU8sT0FBTztBQUFBLFVBQzFEO0FBQUEsUUFDSjtBQUFBLFFBQ1EsRUFBRSxHQUFzQjtBQUM1QixnQkFBTSxJQUFZLEVBQUU7QUFDcEIsZ0JBQU0sSUFBWSxFQUFFO0FBQ3BCLGlCQUFPLElBQUksTUFBTSxHQUFHLENBQUM7QUFBQSxRQUN6QjtBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUNuQ0EsTUFJYTtBQUpiO0FBQUE7QUFFQTtBQUVPLE1BQU0sZ0JBQU4sTUFBb0I7QUFBQSxRQUFwQjtBQUdILGVBQVEsaUJBQThDLENBQUM7QUFBQTtBQUFBLFFBRWhELEtBQUssT0FBeUIsT0FBMkI7QUFDNUQsZUFBSyxRQUFRO0FBQ2IsZUFBSyxRQUFRO0FBQ2IsZUFBSyxlQUFlLGVBQWUsQ0FBQyxNQUFvQixLQUFLLE1BQU0sR0FBRyxXQUFXLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3RixlQUFLLGVBQWUsaUJBQWlCLENBQUMsTUFBb0IsS0FBSyxNQUFNLEtBQUssV0FBVyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDakcsZUFBSyxlQUFlLGlCQUFpQixDQUFDLE1BQW9CLEtBQUssTUFBTSxLQUFLLFdBQVcsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2pHLGVBQUssZUFBZSxrQkFBa0IsQ0FBQyxNQUFvQixLQUFLLE1BQU0sR0FBRyxXQUFXLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNoRyxlQUFLLG1CQUFtQjtBQUFBLFFBQzVCO0FBQUEsUUFFTyxxQkFBMkI7QUFDOUIscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsaUJBQWlCLE9BQU8sU0FBUyxFQUFFLFNBQVMsTUFBTSxDQUFDO0FBQUEsVUFDM0U7QUFBQSxRQUNKO0FBQUEsUUFFTyx3QkFBOEI7QUFDakMscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsb0JBQW9CLE9BQU8sT0FBTztBQUFBLFVBQzFEO0FBQUEsUUFDSjtBQUFBLFFBRVEsRUFBRSxHQUFVO0FBQ2hCLGdCQUFNLElBQVksRUFBRTtBQUNwQixnQkFBTSxJQUFZLEVBQUU7QUFDcEIsaUJBQU8sSUFBSSxNQUFNLEdBQUcsQ0FBQztBQUFBLFFBQ3pCO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQ3BDQSxNQUthO0FBTGI7QUFBQTtBQUVBO0FBR08sTUFBTSxjQUFOLE1BQWtCO0FBQUEsUUFBbEI7QUFJSCxlQUFRLGlCQUE4QyxDQUFDO0FBQUE7QUFBQSxRQUVoRCxLQUFLLE9BQXlCLE9BQXFCLFlBQW9DO0FBQzFGLGVBQUssUUFBUTtBQUNiLGVBQUssUUFBUTtBQUNiLGVBQUssYUFBYTtBQUNsQixlQUFLLGVBQWUsY0FBYyxDQUFDLE1BQWtCLEtBQUssTUFBTSxHQUFHLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3hGLGVBQUssZUFBZSxnQkFBZ0IsQ0FBQyxNQUFrQixLQUFLLE1BQU0sS0FBSyxTQUFTLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM1RixlQUFLLGVBQWUsZUFBZSxDQUFDLE1BQWtCLEtBQUssTUFBTSxLQUFLLFNBQVMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzNGLGVBQUssZUFBZSxnQkFBZ0IsQ0FBQyxNQUFrQixLQUFLLE1BQU0sR0FBRyxTQUFTLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMxRixlQUFLLG1CQUFtQjtBQUFBLFFBQzVCO0FBQUEsUUFFTyxxQkFBcUI7QUFDeEIscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsaUJBQWlCLE9BQU8sU0FBUyxFQUFFLFNBQVMsTUFBTSxDQUFDO0FBQUEsVUFDM0U7QUFBQSxRQUNKO0FBQUEsUUFFTyx3QkFBd0I7QUFDM0IscUJBQVcsQ0FBQyxPQUFPLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxjQUFjLEdBQUc7QUFDaEUsaUJBQUssTUFBTSxPQUFPLEVBQUUsb0JBQW9CLE9BQU8sT0FBTztBQUFBLFVBQzFEO0FBQUEsUUFDSjtBQUFBLFFBRVEsRUFBRSxHQUFzQjtBQUM1QixnQkFBTSxLQUFLLEVBQUUsZUFBZTtBQUM1QixnQkFBTSxLQUF5QixFQUFFLE9BQVEsc0JBQXNCO0FBQy9ELGdCQUFNLElBQUksR0FBRyxVQUFVLEdBQUc7QUFDMUIsZ0JBQU0sSUFBSSxHQUFHLFVBQVUsR0FBRztBQUUxQixpQkFBTyxJQUFJLE1BQU0sSUFBSSxLQUFLLFdBQVcsUUFBUSxHQUFHLElBQUksS0FBSyxXQUFXLFFBQVEsQ0FBQztBQUFBLFFBQ2pGO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzFDQTtBQUFBO0FBSUEsT0FBQyxTQUFVLFFBQVEsU0FBUztBQUMxQixlQUFPLFlBQVksWUFBWSxPQUFPLFdBQVcsY0FBYyxPQUFPLFVBQVUsUUFBUSxJQUN4RixPQUFPLFdBQVcsY0FBYyxPQUFPLE1BQU0sT0FBTyxPQUFPLEtBQzFELFNBQVMsVUFBVSxNQUFNLE9BQU8sY0FBYyxRQUFRO0FBQUEsTUFDekQsR0FBRSxTQUFNLFdBQVk7QUFBRTtBQUVwQixjQUFNLGdCQUFnQjtBQVF0QixjQUFNLGNBQWMsU0FBTztBQUN6QixnQkFBTSxTQUFTLENBQUM7QUFFaEIsbUJBQVMsSUFBSSxHQUFHLElBQUksSUFBSSxRQUFRLEtBQUs7QUFDbkMsZ0JBQUksT0FBTyxRQUFRLElBQUksRUFBRSxNQUFNLElBQUk7QUFDakMscUJBQU8sS0FBSyxJQUFJLEVBQUU7QUFBQSxZQUNwQjtBQUFBLFVBQ0Y7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFRQSxjQUFNLHdCQUF3QixTQUFPLElBQUksT0FBTyxDQUFDLEVBQUUsWUFBWSxJQUFJLElBQUksTUFBTSxDQUFDO0FBTzlFLGNBQU0sT0FBTyxhQUFXO0FBQ3RCLGtCQUFRLEtBQUssR0FBRyxPQUFPLGVBQWUsR0FBRyxFQUFFLE9BQU8sT0FBTyxZQUFZLFdBQVcsUUFBUSxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUM7QUFBQSxRQUM5RztBQU9BLGNBQU0sUUFBUSxhQUFXO0FBQ3ZCLGtCQUFRLE1BQU0sR0FBRyxPQUFPLGVBQWUsR0FBRyxFQUFFLE9BQU8sT0FBTyxDQUFDO0FBQUEsUUFDN0Q7QUFRQSxjQUFNLDJCQUEyQixDQUFDO0FBT2xDLGNBQU0sV0FBVyxhQUFXO0FBQzFCLGNBQUksQ0FBQyx5QkFBeUIsU0FBUyxPQUFPLEdBQUc7QUFDL0MscUNBQXlCLEtBQUssT0FBTztBQUNyQyxpQkFBSyxPQUFPO0FBQUEsVUFDZDtBQUFBLFFBQ0Y7QUFRQSxjQUFNLHVCQUF1QixDQUFDLGlCQUFpQixlQUFlO0FBQzVELG1CQUFTLElBQUssT0FBTyxpQkFBaUIsNkVBQStFLEVBQUUsT0FBTyxZQUFZLFlBQWEsQ0FBQztBQUFBLFFBQzFKO0FBU0EsY0FBTSxpQkFBaUIsU0FBTyxPQUFPLFFBQVEsYUFBYSxJQUFJLElBQUk7QUFNbEUsY0FBTSxpQkFBaUIsU0FBTyxPQUFPLE9BQU8sSUFBSSxjQUFjO0FBTTlELGNBQU0sWUFBWSxTQUFPLGVBQWUsR0FBRyxJQUFJLElBQUksVUFBVSxJQUFJLFFBQVEsUUFBUSxHQUFHO0FBTXBGLGNBQU0sWUFBWSxTQUFPLE9BQU8sUUFBUSxRQUFRLEdBQUcsTUFBTTtBQU16RCxjQUFNLG1CQUFtQixTQUFPLElBQUksS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLElBQUksTUFBTTtBQUV6RSxjQUFNLGdCQUFnQjtBQUFBLFVBQ3BCLE9BQU87QUFBQSxVQUNQLFdBQVc7QUFBQSxVQUNYLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLE1BQU07QUFBQSxVQUNOLFdBQVc7QUFBQSxVQUNYLFVBQVU7QUFBQSxVQUNWLFVBQVU7QUFBQSxVQUNWLE9BQU87QUFBQSxVQUNQLFdBQVc7QUFBQSxZQUNULE9BQU87QUFBQSxZQUNQLFVBQVU7QUFBQSxZQUNWLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQSxXQUFXO0FBQUEsWUFDVCxPQUFPO0FBQUEsWUFDUCxVQUFVO0FBQUEsWUFDVixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0EsYUFBYSxDQUFDO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixZQUFZO0FBQUEsVUFDWixtQkFBbUI7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixlQUFlO0FBQUEsVUFDZix3QkFBd0I7QUFBQSxVQUN4Qix3QkFBd0I7QUFBQSxVQUN4QixtQkFBbUI7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixrQkFBa0I7QUFBQSxVQUNsQixZQUFZO0FBQUEsVUFDWixTQUFTO0FBQUEsVUFDVCxtQkFBbUI7QUFBQSxVQUNuQix3QkFBd0I7QUFBQSxVQUN4QixvQkFBb0I7QUFBQSxVQUNwQixnQkFBZ0I7QUFBQSxVQUNoQixxQkFBcUI7QUFBQSxVQUNyQixpQkFBaUI7QUFBQSxVQUNqQixrQkFBa0I7QUFBQSxVQUNsQix1QkFBdUI7QUFBQSxVQUN2QixtQkFBbUI7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixjQUFjO0FBQUEsVUFDZCxXQUFXO0FBQUEsVUFDWCxhQUFhO0FBQUEsVUFDYixhQUFhO0FBQUEsVUFDYixpQkFBaUI7QUFBQSxVQUNqQixpQkFBaUI7QUFBQSxVQUNqQixzQkFBc0I7QUFBQSxVQUN0QixZQUFZO0FBQUEsVUFDWixxQkFBcUI7QUFBQSxVQUNyQixrQkFBa0I7QUFBQSxVQUNsQixVQUFVO0FBQUEsVUFDVixZQUFZO0FBQUEsVUFDWixhQUFhO0FBQUEsVUFDYixVQUFVO0FBQUEsVUFDVixPQUFPO0FBQUEsVUFDUCxrQkFBa0I7QUFBQSxVQUNsQixPQUFPO0FBQUEsVUFDUCxTQUFTO0FBQUEsVUFDVCxZQUFZO0FBQUEsVUFDWixPQUFPO0FBQUEsVUFDUCxrQkFBa0I7QUFBQSxVQUNsQixZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsVUFDWixjQUFjLENBQUM7QUFBQSxVQUNmLGVBQWU7QUFBQSxVQUNmLGlCQUFpQixDQUFDO0FBQUEsVUFDbEIsZ0JBQWdCO0FBQUEsVUFDaEIsd0JBQXdCO0FBQUEsVUFDeEIsbUJBQW1CO0FBQUEsVUFDbkIsTUFBTTtBQUFBLFVBQ04sVUFBVTtBQUFBLFVBQ1YsZUFBZSxDQUFDO0FBQUEsVUFDaEIscUJBQXFCO0FBQUEsVUFDckIsdUJBQXVCO0FBQUEsVUFDdkIsVUFBVTtBQUFBLFVBQ1YsU0FBUztBQUFBLFVBQ1QsV0FBVztBQUFBLFVBQ1gsV0FBVztBQUFBLFVBQ1gsVUFBVTtBQUFBLFVBQ1YsWUFBWTtBQUFBLFVBQ1osa0JBQWtCO0FBQUEsUUFDcEI7QUFDQSxjQUFNLGtCQUFrQixDQUFDLGtCQUFrQixxQkFBcUIsY0FBYyxrQkFBa0IseUJBQXlCLHFCQUFxQixvQkFBb0Isd0JBQXdCLG1CQUFtQixTQUFTLDBCQUEwQixzQkFBc0IscUJBQXFCLHVCQUF1QixlQUFlLHVCQUF1QixtQkFBbUIsa0JBQWtCLFlBQVksY0FBYyxVQUFVLGFBQWEsUUFBUSxRQUFRLGFBQWEsWUFBWSxZQUFZLGVBQWUsWUFBWSxjQUFjLGNBQWMsV0FBVyxpQkFBaUIsZUFBZSxrQkFBa0Isb0JBQW9CLG1CQUFtQixxQkFBcUIsa0JBQWtCLFFBQVEsU0FBUyxhQUFhLFdBQVc7QUFDOXNCLGNBQU0sbUJBQW1CLENBQUM7QUFDMUIsY0FBTSwwQkFBMEIsQ0FBQyxxQkFBcUIsaUJBQWlCLFlBQVksZ0JBQWdCLGFBQWEsZUFBZSxlQUFlLGNBQWMsd0JBQXdCO0FBUXBMLGNBQU0sbUJBQW1CLGVBQWE7QUFDcEMsaUJBQU8sT0FBTyxVQUFVLGVBQWUsS0FBSyxlQUFlLFNBQVM7QUFBQSxRQUN0RTtBQVFBLGNBQU0sdUJBQXVCLGVBQWE7QUFDeEMsaUJBQU8sZ0JBQWdCLFFBQVEsU0FBUyxNQUFNO0FBQUEsUUFDaEQ7QUFRQSxjQUFNLHdCQUF3QixlQUFhO0FBQ3pDLGlCQUFPLGlCQUFpQjtBQUFBLFFBQzFCO0FBS0EsY0FBTSxzQkFBc0IsV0FBUztBQUNuQyxjQUFJLENBQUMsaUJBQWlCLEtBQUssR0FBRztBQUM1QixpQkFBSyxzQkFBdUIsT0FBTyxPQUFPLEdBQUksQ0FBQztBQUFBLFVBQ2pEO0FBQUEsUUFDRjtBQU1BLGNBQU0sMkJBQTJCLFdBQVM7QUFDeEMsY0FBSSx3QkFBd0IsU0FBUyxLQUFLLEdBQUc7QUFDM0MsaUJBQUssa0JBQW1CLE9BQU8sT0FBTywrQkFBZ0MsQ0FBQztBQUFBLFVBQ3pFO0FBQUEsUUFDRjtBQU1BLGNBQU0sMkJBQTJCLFdBQVM7QUFDeEMsY0FBSSxzQkFBc0IsS0FBSyxHQUFHO0FBQ2hDLGlDQUFxQixPQUFPLHNCQUFzQixLQUFLLENBQUM7QUFBQSxVQUMxRDtBQUFBLFFBQ0Y7QUFRQSxjQUFNLHdCQUF3QixZQUFVO0FBQ3RDLGNBQUksQ0FBQyxPQUFPLFlBQVksT0FBTyxtQkFBbUI7QUFDaEQsaUJBQUssaUZBQWlGO0FBQUEsVUFDeEY7QUFFQSxxQkFBVyxTQUFTLFFBQVE7QUFDMUIsZ0NBQW9CLEtBQUs7QUFFekIsZ0JBQUksT0FBTyxPQUFPO0FBQ2hCLHVDQUF5QixLQUFLO0FBQUEsWUFDaEM7QUFFQSxxQ0FBeUIsS0FBSztBQUFBLFVBQ2hDO0FBQUEsUUFDRjtBQUVBLGNBQU0sYUFBYTtBQU1uQixjQUFNLFNBQVMsV0FBUztBQUN0QixnQkFBTSxTQUFTLENBQUM7QUFFaEIscUJBQVcsS0FBSyxPQUFPO0FBQ3JCLG1CQUFPLE1BQU0sTUFBTSxhQUFhLE1BQU07QUFBQSxVQUN4QztBQUVBLGlCQUFPO0FBQUEsUUFDVDtBQUNBLGNBQU0sY0FBYyxPQUFPLENBQUMsYUFBYSxTQUFTLGVBQWUsVUFBVSxTQUFTLFNBQVMsZUFBZSxpQkFBaUIsU0FBUyxlQUFlLFFBQVEsUUFBUSxTQUFTLFNBQVMsa0JBQWtCLFdBQVcsV0FBVyxRQUFRLFVBQVUsbUJBQW1CLFVBQVUsUUFBUSxnQkFBZ0IsU0FBUyxTQUFTLFFBQVEsU0FBUyxVQUFVLFNBQVMsWUFBWSxTQUFTLFlBQVksY0FBYyxlQUFlLHNCQUFzQixrQkFBa0Isd0JBQXdCLGlCQUFpQixzQkFBc0IsVUFBVSxXQUFXLFVBQVUsT0FBTyxhQUFhLFdBQVcsWUFBWSxhQUFhLFVBQVUsZ0JBQWdCLGNBQWMsZUFBZSxnQkFBZ0IsVUFBVSxnQkFBZ0IsY0FBYyxlQUFlLGdCQUFnQixZQUFZLGVBQWUsbUJBQW1CLE9BQU8sc0JBQXNCLGdDQUFnQyxxQkFBcUIsZ0JBQWdCLGdCQUFnQixhQUFhLGlCQUFpQixjQUFjLFFBQVEsQ0FBQztBQUMzN0IsY0FBTSxZQUFZLE9BQU8sQ0FBQyxXQUFXLFdBQVcsUUFBUSxZQUFZLE9BQU8sQ0FBQztBQVE1RSxjQUFNLGVBQWUsTUFBTSxTQUFTLEtBQUssY0FBYyxJQUFJLE9BQU8sWUFBWSxTQUFTLENBQUM7QUFNeEYsY0FBTSxvQkFBb0Isb0JBQWtCO0FBQzFDLGdCQUFNLFlBQVksYUFBYTtBQUMvQixpQkFBTyxZQUFZLFVBQVUsY0FBYyxjQUFjLElBQUk7QUFBQSxRQUMvRDtBQU1BLGNBQU0saUJBQWlCLGVBQWE7QUFDbEMsaUJBQU8sa0JBQWtCLElBQUksT0FBTyxTQUFTLENBQUM7QUFBQSxRQUNoRDtBQU1BLGNBQU0sV0FBVyxNQUFNLGVBQWUsWUFBWSxLQUFLO0FBS3ZELGNBQU0sVUFBVSxNQUFNLGVBQWUsWUFBWSxJQUFJO0FBS3JELGNBQU0sV0FBVyxNQUFNLGVBQWUsWUFBWSxLQUFLO0FBS3ZELGNBQU0sbUJBQW1CLE1BQU0sZUFBZSxZQUFZLGlCQUFpQjtBQUszRSxjQUFNLFdBQVcsTUFBTSxlQUFlLFlBQVksS0FBSztBQUt2RCxjQUFNLG1CQUFtQixNQUFNLGVBQWUsWUFBWSxpQkFBaUI7QUFLM0UsY0FBTSx1QkFBdUIsTUFBTSxlQUFlLFlBQVkscUJBQXFCO0FBS25GLGNBQU0sbUJBQW1CLE1BQU0sa0JBQWtCLElBQUksT0FBTyxZQUFZLFNBQVMsSUFBSSxFQUFFLE9BQU8sWUFBWSxPQUFPLENBQUM7QUFLbEgsY0FBTSxnQkFBZ0IsTUFBTSxrQkFBa0IsSUFBSSxPQUFPLFlBQVksU0FBUyxJQUFJLEVBQUUsT0FBTyxZQUFZLElBQUksQ0FBQztBQUs1RyxjQUFNLGdCQUFnQixNQUFNLGVBQWUsWUFBWSxjQUFjO0FBS3JFLGNBQU0sWUFBWSxNQUFNLGtCQUFrQixJQUFJLE9BQU8sWUFBWSxNQUFNLENBQUM7QUFLeEUsY0FBTSxrQkFBa0IsTUFBTSxrQkFBa0IsSUFBSSxPQUFPLFlBQVksU0FBUyxJQUFJLEVBQUUsT0FBTyxZQUFZLE1BQU0sQ0FBQztBQUtoSCxjQUFNLGFBQWEsTUFBTSxlQUFlLFlBQVksT0FBTztBQUszRCxjQUFNLFlBQVksTUFBTSxlQUFlLFlBQVksTUFBTTtBQUt6RCxjQUFNLHNCQUFzQixNQUFNLGVBQWUsWUFBWSxxQkFBcUI7QUFLbEYsY0FBTSxpQkFBaUIsTUFBTSxlQUFlLFlBQVksS0FBSztBQUU3RCxjQUFNLFlBQVk7QUFLbEIsY0FBTSx1QkFBdUIsTUFBTTtBQUNqQyxnQkFBTSxnQ0FBZ0MsTUFBTSxLQUFLLFNBQVMsRUFBRSxpQkFBaUIscURBQXFELENBQUMsRUFDbEksS0FBSyxDQUFDLEdBQUcsTUFBTTtBQUNkLGtCQUFNLFlBQVksU0FBUyxFQUFFLGFBQWEsVUFBVSxDQUFDO0FBQ3JELGtCQUFNLFlBQVksU0FBUyxFQUFFLGFBQWEsVUFBVSxDQUFDO0FBRXJELGdCQUFJLFlBQVksV0FBVztBQUN6QixxQkFBTztBQUFBLFlBQ1QsV0FBVyxZQUFZLFdBQVc7QUFDaEMscUJBQU87QUFBQSxZQUNUO0FBRUEsbUJBQU87QUFBQSxVQUNULENBQUM7QUFDRCxnQkFBTSx5QkFBeUIsTUFBTSxLQUFLLFNBQVMsRUFBRSxpQkFBaUIsU0FBUyxDQUFDLEVBQUUsT0FBTyxRQUFNLEdBQUcsYUFBYSxVQUFVLE1BQU0sSUFBSTtBQUNuSSxpQkFBTyxZQUFZLDhCQUE4QixPQUFPLHNCQUFzQixDQUFDLEVBQUUsT0FBTyxRQUFNLFVBQVUsRUFBRSxDQUFDO0FBQUEsUUFDN0c7QUFLQSxjQUFNLFVBQVUsTUFBTTtBQUNwQixpQkFBTyxTQUFTLFNBQVMsTUFBTSxZQUFZLEtBQUssS0FBSyxDQUFDLFNBQVMsU0FBUyxNQUFNLFlBQVksY0FBYyxLQUFLLENBQUMsU0FBUyxTQUFTLE1BQU0sWUFBWSxjQUFjO0FBQUEsUUFDbEs7QUFLQSxjQUFNLFVBQVUsTUFBTTtBQUNwQixpQkFBTyxTQUFTLEtBQUssU0FBUyxTQUFTLEdBQUcsWUFBWSxLQUFLO0FBQUEsUUFDN0Q7QUFLQSxjQUFNLFlBQVksTUFBTTtBQUN0QixpQkFBTyxTQUFTLEVBQUUsYUFBYSxjQUFjO0FBQUEsUUFDL0M7QUFFQSxjQUFNLFNBQVM7QUFBQSxVQUNiLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBU0EsY0FBTSxlQUFlLENBQUMsTUFBTSxTQUFTO0FBQ25DLGVBQUssY0FBYztBQUVuQixjQUFJLE1BQU07QUFDUixrQkFBTSxTQUFTLElBQUksVUFBVTtBQUM3QixrQkFBTSxTQUFTLE9BQU8sZ0JBQWdCLE1BQU0sV0FBVztBQUN2RCxrQkFBTSxLQUFLLE9BQU8sY0FBYyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsV0FBUztBQUNuRSxtQkFBSyxZQUFZLEtBQUs7QUFBQSxZQUN4QixDQUFDO0FBQ0Qsa0JBQU0sS0FBSyxPQUFPLGNBQWMsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLFdBQVM7QUFDbkUsbUJBQUssWUFBWSxLQUFLO0FBQUEsWUFDeEIsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBT0EsY0FBTSxXQUFXLENBQUMsTUFBTSxjQUFjO0FBQ3BDLGNBQUksQ0FBQyxXQUFXO0FBQ2QsbUJBQU87QUFBQSxVQUNUO0FBRUEsZ0JBQU0sWUFBWSxVQUFVLE1BQU0sS0FBSztBQUV2QyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxVQUFVLFFBQVEsS0FBSztBQUN6QyxnQkFBSSxDQUFDLEtBQUssVUFBVSxTQUFTLFVBQVUsRUFBRSxHQUFHO0FBQzFDLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFNQSxjQUFNLHNCQUFzQixDQUFDLE1BQU0sV0FBVztBQUM1QyxnQkFBTSxLQUFLLEtBQUssU0FBUyxFQUFFLFFBQVEsZUFBYTtBQUM5QyxnQkFBSSxDQUFDLE9BQU8sT0FBTyxXQUFXLEVBQUUsU0FBUyxTQUFTLEtBQUssQ0FBQyxPQUFPLE9BQU8sU0FBUyxFQUFFLFNBQVMsU0FBUyxLQUFLLENBQUMsT0FBTyxPQUFPLE9BQU8sU0FBUyxFQUFFLFNBQVMsU0FBUyxHQUFHO0FBQzVKLG1CQUFLLFVBQVUsT0FBTyxTQUFTO0FBQUEsWUFDakM7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBUUEsY0FBTSxtQkFBbUIsQ0FBQyxNQUFNLFFBQVEsY0FBYztBQUNwRCw4QkFBb0IsTUFBTSxNQUFNO0FBRWhDLGNBQUksT0FBTyxlQUFlLE9BQU8sWUFBWSxZQUFZO0FBQ3ZELGdCQUFJLE9BQU8sT0FBTyxZQUFZLGVBQWUsWUFBWSxDQUFDLE9BQU8sWUFBWSxXQUFXLFNBQVM7QUFDL0YscUJBQU8sS0FBSywrQkFBK0IsT0FBTyxXQUFXLDZDQUE4QyxFQUFFLE9BQU8sT0FBTyxPQUFPLFlBQVksWUFBWSxHQUFJLENBQUM7QUFBQSxZQUNqSztBQUVBLHFCQUFTLE1BQU0sT0FBTyxZQUFZLFVBQVU7QUFBQSxVQUM5QztBQUFBLFFBQ0Y7QUFPQSxjQUFNLFdBQVcsQ0FBQyxPQUFPLGVBQWU7QUFDdEMsY0FBSSxDQUFDLFlBQVk7QUFDZixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxrQkFBUTtBQUFBLGlCQUNEO0FBQUEsaUJBQ0E7QUFBQSxpQkFDQTtBQUNILHFCQUFPLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLE1BQU0sRUFBRSxPQUFPLFlBQVksV0FBVyxDQUFDO0FBQUEsaUJBRTdGO0FBQ0gscUJBQU8sTUFBTSxjQUFjLElBQUksT0FBTyxZQUFZLE9BQU8sTUFBTSxFQUFFLE9BQU8sWUFBWSxVQUFVLFFBQVEsQ0FBQztBQUFBLGlCQUVwRztBQUNILHFCQUFPLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLE1BQU0sRUFBRSxPQUFPLFlBQVksT0FBTyxnQkFBZ0IsQ0FBQyxLQUFLLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLE1BQU0sRUFBRSxPQUFPLFlBQVksT0FBTyxvQkFBb0IsQ0FBQztBQUFBLGlCQUV2TjtBQUNILHFCQUFPLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLE1BQU0sRUFBRSxPQUFPLFlBQVksT0FBTyxRQUFRLENBQUM7QUFBQTtBQUdwRyxxQkFBTyxNQUFNLGNBQWMsSUFBSSxPQUFPLFlBQVksT0FBTyxNQUFNLEVBQUUsT0FBTyxZQUFZLEtBQUssQ0FBQztBQUFBO0FBQUEsUUFFaEc7QUFLQSxjQUFNLGFBQWEsV0FBUztBQUMxQixnQkFBTSxNQUFNO0FBRVosY0FBSSxNQUFNLFNBQVMsUUFBUTtBQUV6QixrQkFBTSxNQUFNLE1BQU07QUFDbEIsa0JBQU0sUUFBUTtBQUNkLGtCQUFNLFFBQVE7QUFBQSxVQUNoQjtBQUFBLFFBQ0Y7QUFPQSxjQUFNLGNBQWMsQ0FBQyxRQUFRLFdBQVcsY0FBYztBQUNwRCxjQUFJLENBQUMsVUFBVSxDQUFDLFdBQVc7QUFDekI7QUFBQSxVQUNGO0FBRUEsY0FBSSxPQUFPLGNBQWMsVUFBVTtBQUNqQyx3QkFBWSxVQUFVLE1BQU0sS0FBSyxFQUFFLE9BQU8sT0FBTztBQUFBLFVBQ25EO0FBRUEsb0JBQVUsUUFBUSxlQUFhO0FBQzdCLGdCQUFJLE1BQU0sUUFBUSxNQUFNLEdBQUc7QUFDekIscUJBQU8sUUFBUSxVQUFRO0FBQ3JCLDRCQUFZLEtBQUssVUFBVSxJQUFJLFNBQVMsSUFBSSxLQUFLLFVBQVUsT0FBTyxTQUFTO0FBQUEsY0FDN0UsQ0FBQztBQUFBLFlBQ0gsT0FBTztBQUNMLDBCQUFZLE9BQU8sVUFBVSxJQUFJLFNBQVMsSUFBSSxPQUFPLFVBQVUsT0FBTyxTQUFTO0FBQUEsWUFDakY7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBTUEsY0FBTSxXQUFXLENBQUMsUUFBUSxjQUFjO0FBQ3RDLHNCQUFZLFFBQVEsV0FBVyxJQUFJO0FBQUEsUUFDckM7QUFNQSxjQUFNLGNBQWMsQ0FBQyxRQUFRLGNBQWM7QUFDekMsc0JBQVksUUFBUSxXQUFXLEtBQUs7QUFBQSxRQUN0QztBQVNBLGNBQU0sd0JBQXdCLENBQUMsTUFBTSxjQUFjO0FBQ2pELGdCQUFNLFdBQVcsTUFBTSxLQUFLLEtBQUssUUFBUTtBQUV6QyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxTQUFTLFFBQVEsS0FBSztBQUN4QyxrQkFBTSxRQUFRLFNBQVM7QUFFdkIsZ0JBQUksaUJBQWlCLGVBQWUsU0FBUyxPQUFPLFNBQVMsR0FBRztBQUM5RCxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQU9BLGNBQU0sc0JBQXNCLENBQUMsTUFBTSxVQUFVLFVBQVU7QUFDckQsY0FBSSxVQUFVLEdBQUcsT0FBTyxTQUFTLEtBQUssQ0FBQyxHQUFHO0FBQ3hDLG9CQUFRLFNBQVMsS0FBSztBQUFBLFVBQ3hCO0FBRUEsY0FBSSxTQUFTLFNBQVMsS0FBSyxNQUFNLEdBQUc7QUFDbEMsaUJBQUssTUFBTSxZQUFZLE9BQU8sVUFBVSxXQUFXLEdBQUcsT0FBTyxPQUFPLElBQUksSUFBSTtBQUFBLFVBQzlFLE9BQU87QUFDTCxpQkFBSyxNQUFNLGVBQWUsUUFBUTtBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQU1BLGNBQU0sT0FBTyxTQUFVLE1BQU07QUFDM0IsY0FBSSxVQUFVLFVBQVUsU0FBUyxLQUFLLFVBQVUsT0FBTyxTQUFZLFVBQVUsS0FBSztBQUNsRixlQUFLLE1BQU0sVUFBVTtBQUFBLFFBQ3ZCO0FBS0EsY0FBTSxPQUFPLFVBQVE7QUFDbkIsZUFBSyxNQUFNLFVBQVU7QUFBQSxRQUN2QjtBQVFBLGNBQU0sV0FBVyxDQUFDLFFBQVEsVUFBVSxVQUFVLFVBQVU7QUFFdEQsZ0JBQU0sS0FBSyxPQUFPLGNBQWMsUUFBUTtBQUV4QyxjQUFJLElBQUk7QUFDTixlQUFHLE1BQU0sWUFBWTtBQUFBLFVBQ3ZCO0FBQUEsUUFDRjtBQU9BLGNBQU0sU0FBUyxTQUFVLE1BQU0sV0FBVztBQUN4QyxjQUFJLFVBQVUsVUFBVSxTQUFTLEtBQUssVUFBVSxPQUFPLFNBQVksVUFBVSxLQUFLO0FBQ2xGLHNCQUFZLEtBQUssTUFBTSxPQUFPLElBQUksS0FBSyxJQUFJO0FBQUEsUUFDN0M7QUFRQSxjQUFNLFlBQVksVUFBUSxDQUFDLEVBQUUsU0FBUyxLQUFLLGVBQWUsS0FBSyxnQkFBZ0IsS0FBSyxlQUFlLEVBQUU7QUFLckcsY0FBTSxzQkFBc0IsTUFBTSxDQUFDLFVBQVUsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFVBQVUsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLGdCQUFnQixDQUFDO0FBSy9ILGNBQU0sZUFBZSxVQUFRLENBQUMsRUFBRSxLQUFLLGVBQWUsS0FBSztBQVF6RCxjQUFNLGtCQUFrQixVQUFRO0FBQzlCLGdCQUFNLFFBQVEsT0FBTyxpQkFBaUIsSUFBSTtBQUMxQyxnQkFBTSxlQUFlLFdBQVcsTUFBTSxpQkFBaUIsb0JBQW9CLEtBQUssR0FBRztBQUNuRixnQkFBTSxnQkFBZ0IsV0FBVyxNQUFNLGlCQUFpQixxQkFBcUIsS0FBSyxHQUFHO0FBQ3JGLGlCQUFPLGVBQWUsS0FBSyxnQkFBZ0I7QUFBQSxRQUM3QztBQU1BLGNBQU0sMEJBQTBCLFNBQVUsT0FBTztBQUMvQyxjQUFJLFFBQVEsVUFBVSxTQUFTLEtBQUssVUFBVSxPQUFPLFNBQVksVUFBVSxLQUFLO0FBQ2hGLGdCQUFNLG1CQUFtQixvQkFBb0I7QUFFN0MsY0FBSSxVQUFVLGdCQUFnQixHQUFHO0FBQy9CLGdCQUFJLE9BQU87QUFDVCwrQkFBaUIsTUFBTSxhQUFhO0FBQ3BDLCtCQUFpQixNQUFNLFFBQVE7QUFBQSxZQUNqQztBQUVBLHVCQUFXLE1BQU07QUFDZiwrQkFBaUIsTUFBTSxhQUFhLFNBQVMsT0FBTyxRQUFRLEtBQU0sVUFBVTtBQUM1RSwrQkFBaUIsTUFBTSxRQUFRO0FBQUEsWUFDakMsR0FBRyxFQUFFO0FBQUEsVUFDUDtBQUFBLFFBQ0Y7QUFDQSxjQUFNLHVCQUF1QixNQUFNO0FBQ2pDLGdCQUFNLG1CQUFtQixvQkFBb0I7QUFDN0MsZ0JBQU0sd0JBQXdCLFNBQVMsT0FBTyxpQkFBaUIsZ0JBQWdCLEVBQUUsS0FBSztBQUN0RiwyQkFBaUIsTUFBTSxlQUFlLFlBQVk7QUFDbEQsMkJBQWlCLE1BQU0sUUFBUTtBQUMvQixnQkFBTSw0QkFBNEIsU0FBUyxPQUFPLGlCQUFpQixnQkFBZ0IsRUFBRSxLQUFLO0FBQzFGLGdCQUFNLDBCQUEwQix3QkFBd0IsNEJBQTRCO0FBQ3BGLDJCQUFpQixNQUFNLGVBQWUsWUFBWTtBQUNsRCwyQkFBaUIsTUFBTSxRQUFRLEdBQUcsT0FBTyx5QkFBeUIsR0FBRztBQUFBLFFBQ3ZFO0FBT0EsY0FBTSxZQUFZLE1BQU0sT0FBTyxXQUFXLGVBQWUsT0FBTyxhQUFhO0FBRTdFLGNBQU0sd0JBQXdCO0FBSTlCLGNBQU0sY0FBYyxDQUFDO0FBRXJCLGNBQU0sNkJBQTZCLE1BQU07QUFDdkMsY0FBSSxZQUFZLGlDQUFpQyxhQUFhO0FBQzVELHdCQUFZLHNCQUFzQixNQUFNO0FBQ3hDLHdCQUFZLHdCQUF3QjtBQUFBLFVBQ3RDLFdBQVcsU0FBUyxNQUFNO0FBQ3hCLHFCQUFTLEtBQUssTUFBTTtBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQVNBLGNBQU0sdUJBQXVCLGlCQUFlO0FBQzFDLGlCQUFPLElBQUksUUFBUSxhQUFXO0FBQzVCLGdCQUFJLENBQUMsYUFBYTtBQUNoQixxQkFBTyxRQUFRO0FBQUEsWUFDakI7QUFFQSxrQkFBTSxJQUFJLE9BQU87QUFDakIsa0JBQU0sSUFBSSxPQUFPO0FBQ2pCLHdCQUFZLHNCQUFzQixXQUFXLE1BQU07QUFDakQseUNBQTJCO0FBQzNCLHNCQUFRO0FBQUEsWUFDVixHQUFHLHFCQUFxQjtBQUV4QixtQkFBTyxTQUFTLEdBQUcsQ0FBQztBQUFBLFVBQ3RCLENBQUM7QUFBQSxRQUNIO0FBRUEsY0FBTSxZQUFZLDRCQUE2QixPQUFPLFlBQVksT0FBTyxzQkFBd0IsRUFBRSxPQUFPLFlBQVksbUJBQW1CLFdBQWEsRUFBRSxPQUFPLFlBQVksT0FBTyxvREFBMEQsRUFBRSxPQUFPLFlBQVksT0FBTyw2QkFBK0IsRUFBRSxPQUFPLFlBQVksbUJBQW1CLDBCQUE0QixFQUFFLE9BQU8sWUFBWSxNQUFNLDJCQUE2QixFQUFFLE9BQU8sWUFBWSxPQUFPLHNCQUF3QixFQUFFLE9BQU8sWUFBWSxPQUFPLFFBQVUsRUFBRSxPQUFPLFlBQVksT0FBTywwQkFBNEIsRUFBRSxPQUFPLFlBQVksbUJBQW1CLFFBQVUsRUFBRSxPQUFPLFlBQVksbUJBQW1CLDZCQUErQixFQUFFLE9BQU8sWUFBWSxPQUFPLHFDQUF5QyxFQUFFLE9BQU8sWUFBWSxNQUFNLHVCQUF5QixFQUFFLE9BQU8sWUFBWSxPQUFPLHdGQUE0RixFQUFFLE9BQU8sWUFBWSxRQUFRLDhCQUFnQyxFQUFFLE9BQU8sWUFBWSxPQUFPLDJCQUE2QixFQUFFLE9BQU8sWUFBWSxVQUFVLFdBQWEsRUFBRSxPQUFPLFlBQVksVUFBVSx3REFBNEQsRUFBRSxPQUFPLFlBQVksT0FBTyw4Q0FBZ0QsRUFBRSxPQUFPLFlBQVksVUFBVSxnQ0FBa0MsRUFBRSxPQUFPLFlBQVksdUJBQXVCLFFBQVUsRUFBRSxPQUFPLFlBQVksdUJBQXVCLDJCQUE2QixFQUFFLE9BQU8sWUFBWSxTQUFTLHVCQUF5QixFQUFFLE9BQU8sWUFBWSxRQUFRLDhDQUFrRCxFQUFFLE9BQU8sWUFBWSxTQUFTLGlEQUFxRCxFQUFFLE9BQU8sWUFBWSxNQUFNLGlEQUFxRCxFQUFFLE9BQU8sWUFBWSxRQUFRLHlDQUEyQyxFQUFFLE9BQU8sWUFBWSxRQUFRLDJCQUE2QixFQUFFLE9BQU8sWUFBWSxpQ0FBaUMsdUJBQXlCLEVBQUUsT0FBTyxZQUFZLHVCQUF1QixnQ0FBaUMsRUFBRSxRQUFRLGNBQWMsRUFBRTtBQUt6Z0UsY0FBTSxvQkFBb0IsTUFBTTtBQUM5QixnQkFBTSxlQUFlLGFBQWE7QUFFbEMsY0FBSSxDQUFDLGNBQWM7QUFDakIsbUJBQU87QUFBQSxVQUNUO0FBRUEsdUJBQWEsT0FBTztBQUNwQixzQkFBWSxDQUFDLFNBQVMsaUJBQWlCLFNBQVMsSUFBSSxHQUFHLENBQUMsWUFBWSxnQkFBZ0IsWUFBWSxnQkFBZ0IsWUFBWSxhQUFhLENBQUM7QUFDMUksaUJBQU87QUFBQSxRQUNUO0FBRUEsY0FBTSx5QkFBeUIsTUFBTTtBQUNuQyxzQkFBWSxnQkFBZ0IsdUJBQXVCO0FBQUEsUUFDckQ7QUFFQSxjQUFNLDBCQUEwQixNQUFNO0FBQ3BDLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSxRQUFRLHNCQUFzQixPQUFPLFlBQVksS0FBSztBQUM1RCxnQkFBTSxPQUFPLHNCQUFzQixPQUFPLFlBQVksSUFBSTtBQUcxRCxnQkFBTSxRQUFRLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLFFBQVEsQ0FBQztBQUd6RSxnQkFBTSxjQUFjLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxPQUFPLFNBQVMsQ0FBQztBQUNoRixnQkFBTSxTQUFTLHNCQUFzQixPQUFPLFlBQVksTUFBTTtBQUc5RCxnQkFBTSxXQUFXLE1BQU0sY0FBYyxJQUFJLE9BQU8sWUFBWSxVQUFVLFFBQVEsQ0FBQztBQUMvRSxnQkFBTSxXQUFXLHNCQUFzQixPQUFPLFlBQVksUUFBUTtBQUNsRSxnQkFBTSxVQUFVO0FBQ2hCLGVBQUssV0FBVztBQUNoQixpQkFBTyxXQUFXO0FBQ2xCLG1CQUFTLFdBQVc7QUFDcEIsbUJBQVMsVUFBVTtBQUVuQixnQkFBTSxVQUFVLE1BQU07QUFDcEIsbUNBQXVCO0FBQ3ZCLHdCQUFZLFFBQVEsTUFBTTtBQUFBLFVBQzVCO0FBRUEsZ0JBQU0sV0FBVyxNQUFNO0FBQ3JCLG1DQUF1QjtBQUN2Qix3QkFBWSxRQUFRLE1BQU07QUFBQSxVQUM1QjtBQUFBLFFBQ0Y7QUFPQSxjQUFNLFlBQVksWUFBVSxPQUFPLFdBQVcsV0FBVyxTQUFTLGNBQWMsTUFBTSxJQUFJO0FBTTFGLGNBQU0scUJBQXFCLFlBQVU7QUFDbkMsZ0JBQU0sUUFBUSxTQUFTO0FBQ3ZCLGdCQUFNLGFBQWEsUUFBUSxPQUFPLFFBQVEsVUFBVSxRQUFRO0FBQzVELGdCQUFNLGFBQWEsYUFBYSxPQUFPLFFBQVEsV0FBVyxXQUFXO0FBRXJFLGNBQUksQ0FBQyxPQUFPLE9BQU87QUFDakIsa0JBQU0sYUFBYSxjQUFjLE1BQU07QUFBQSxVQUN6QztBQUFBLFFBQ0Y7QUFNQSxjQUFNLFdBQVcsbUJBQWlCO0FBQ2hDLGNBQUksT0FBTyxpQkFBaUIsYUFBYSxFQUFFLGNBQWMsT0FBTztBQUM5RCxxQkFBUyxhQUFhLEdBQUcsWUFBWSxHQUFHO0FBQUEsVUFDMUM7QUFBQSxRQUNGO0FBUUEsY0FBTSxPQUFPLFlBQVU7QUFFckIsZ0JBQU0sc0JBQXNCLGtCQUFrQjtBQUc5QyxjQUFJLFVBQVUsR0FBRztBQUNmLGtCQUFNLDZDQUE2QztBQUNuRDtBQUFBLFVBQ0Y7QUFFQSxnQkFBTSxZQUFZLFNBQVMsY0FBYyxLQUFLO0FBQzlDLG9CQUFVLFlBQVksWUFBWTtBQUVsQyxjQUFJLHFCQUFxQjtBQUN2QixxQkFBUyxXQUFXLFlBQVksZ0JBQWdCO0FBQUEsVUFDbEQ7QUFFQSx1QkFBYSxXQUFXLFNBQVM7QUFDakMsZ0JBQU0sZ0JBQWdCLFVBQVUsT0FBTyxNQUFNO0FBQzdDLHdCQUFjLFlBQVksU0FBUztBQUNuQyw2QkFBbUIsTUFBTTtBQUN6QixtQkFBUyxhQUFhO0FBQ3RCLGtDQUF3QjtBQUFBLFFBQzFCO0FBT0EsY0FBTSx1QkFBdUIsQ0FBQyxPQUFPLFdBQVc7QUFFOUMsY0FBSSxpQkFBaUIsYUFBYTtBQUNoQyxtQkFBTyxZQUFZLEtBQUs7QUFBQSxVQUMxQixXQUNTLE9BQU8sVUFBVSxVQUFVO0FBQ2xDLHlCQUFhLE9BQU8sTUFBTTtBQUFBLFVBQzVCLFdBQ1MsT0FBTztBQUNkLHlCQUFhLFFBQVEsS0FBSztBQUFBLFVBQzVCO0FBQUEsUUFDRjtBQU1BLGNBQU0sZUFBZSxDQUFDLE9BQU8sV0FBVztBQUV0QyxjQUFJLE1BQU0sUUFBUTtBQUNoQiw2QkFBaUIsUUFBUSxLQUFLO0FBQUEsVUFDaEMsT0FDSztBQUNILHlCQUFhLFFBQVEsTUFBTSxTQUFTLENBQUM7QUFBQSxVQUN2QztBQUFBLFFBQ0Y7QUFPQSxjQUFNLG1CQUFtQixDQUFDLFFBQVEsU0FBUztBQUN6QyxpQkFBTyxjQUFjO0FBRXJCLGNBQUksS0FBSyxNQUFNO0FBQ2IscUJBQVMsSUFBSSxHQUFJLEtBQUssTUFBTyxLQUFLO0FBQ2hDLHFCQUFPLFlBQVksS0FBSyxHQUFHLFVBQVUsSUFBSSxDQUFDO0FBQUEsWUFDNUM7QUFBQSxVQUNGLE9BQU87QUFDTCxtQkFBTyxZQUFZLEtBQUssVUFBVSxJQUFJLENBQUM7QUFBQSxVQUN6QztBQUFBLFFBQ0Y7QUFNQSxjQUFNLHFCQUFxQixNQUFNO0FBSS9CLGNBQUksVUFBVSxHQUFHO0FBQ2YsbUJBQU87QUFBQSxVQUNUO0FBRUEsZ0JBQU0sU0FBUyxTQUFTLGNBQWMsS0FBSztBQUMzQyxnQkFBTSxxQkFBcUI7QUFBQSxZQUN6QixpQkFBaUI7QUFBQSxZQUVqQixXQUFXO0FBQUEsVUFFYjtBQUVBLHFCQUFXLEtBQUssb0JBQW9CO0FBQ2xDLGdCQUFJLE9BQU8sVUFBVSxlQUFlLEtBQUssb0JBQW9CLENBQUMsS0FBSyxPQUFPLE9BQU8sTUFBTSxPQUFPLGFBQWE7QUFDekcscUJBQU8sbUJBQW1CO0FBQUEsWUFDNUI7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNULEdBQUc7QUFTSCxjQUFNLG1CQUFtQixNQUFNO0FBQzdCLGdCQUFNLFlBQVksU0FBUyxjQUFjLEtBQUs7QUFDOUMsb0JBQVUsWUFBWSxZQUFZO0FBQ2xDLG1CQUFTLEtBQUssWUFBWSxTQUFTO0FBQ25DLGdCQUFNLGlCQUFpQixVQUFVLHNCQUFzQixFQUFFLFFBQVEsVUFBVTtBQUMzRSxtQkFBUyxLQUFLLFlBQVksU0FBUztBQUNuQyxpQkFBTztBQUFBLFFBQ1Q7QUFPQSxjQUFNLGdCQUFnQixDQUFDLFVBQVUsV0FBVztBQUMxQyxnQkFBTSxVQUFVLFdBQVc7QUFDM0IsZ0JBQU0sU0FBUyxVQUFVO0FBRXpCLGNBQUksQ0FBQyxPQUFPLHFCQUFxQixDQUFDLE9BQU8sa0JBQWtCLENBQUMsT0FBTyxrQkFBa0I7QUFDbkYsaUJBQUssT0FBTztBQUFBLFVBQ2QsT0FBTztBQUNMLGlCQUFLLE9BQU87QUFBQSxVQUNkO0FBR0EsMkJBQWlCLFNBQVMsUUFBUSxTQUFTO0FBRTNDLHdCQUFjLFNBQVMsUUFBUSxNQUFNO0FBRXJDLHVCQUFhLFFBQVEsT0FBTyxVQUFVO0FBQ3RDLDJCQUFpQixRQUFRLFFBQVEsUUFBUTtBQUFBLFFBQzNDO0FBT0EsaUJBQVMsY0FBYyxTQUFTLFFBQVEsUUFBUTtBQUM5QyxnQkFBTSxnQkFBZ0IsaUJBQWlCO0FBQ3ZDLGdCQUFNLGFBQWEsY0FBYztBQUNqQyxnQkFBTSxlQUFlLGdCQUFnQjtBQUVyQyx1QkFBYSxlQUFlLFdBQVcsTUFBTTtBQUM3Qyx1QkFBYSxZQUFZLFFBQVEsTUFBTTtBQUN2Qyx1QkFBYSxjQUFjLFVBQVUsTUFBTTtBQUMzQywrQkFBcUIsZUFBZSxZQUFZLGNBQWMsTUFBTTtBQUVwRSxjQUFJLE9BQU8sZ0JBQWdCO0FBQ3pCLGdCQUFJLE9BQU8sT0FBTztBQUNoQixzQkFBUSxhQUFhLGNBQWMsYUFBYTtBQUNoRCxzQkFBUSxhQUFhLFlBQVksYUFBYTtBQUFBLFlBQ2hELE9BQU87QUFDTCxzQkFBUSxhQUFhLGNBQWMsTUFBTTtBQUN6QyxzQkFBUSxhQUFhLFlBQVksTUFBTTtBQUN2QyxzQkFBUSxhQUFhLGVBQWUsTUFBTTtBQUFBLFlBQzVDO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFTQSxpQkFBUyxxQkFBcUIsZUFBZSxZQUFZLGNBQWMsUUFBUTtBQUM3RSxjQUFJLENBQUMsT0FBTyxnQkFBZ0I7QUFDMUIsbUJBQU8sWUFBWSxDQUFDLGVBQWUsWUFBWSxZQUFZLEdBQUcsWUFBWSxNQUFNO0FBQUEsVUFDbEY7QUFFQSxtQkFBUyxDQUFDLGVBQWUsWUFBWSxZQUFZLEdBQUcsWUFBWSxNQUFNO0FBRXRFLGNBQUksT0FBTyxvQkFBb0I7QUFDN0IsMEJBQWMsTUFBTSxrQkFBa0IsT0FBTztBQUM3QyxxQkFBUyxlQUFlLFlBQVksa0JBQWtCO0FBQUEsVUFDeEQ7QUFFQSxjQUFJLE9BQU8saUJBQWlCO0FBQzFCLHVCQUFXLE1BQU0sa0JBQWtCLE9BQU87QUFDMUMscUJBQVMsWUFBWSxZQUFZLGtCQUFrQjtBQUFBLFVBQ3JEO0FBRUEsY0FBSSxPQUFPLG1CQUFtQjtBQUM1Qix5QkFBYSxNQUFNLGtCQUFrQixPQUFPO0FBQzVDLHFCQUFTLGNBQWMsWUFBWSxrQkFBa0I7QUFBQSxVQUN2RDtBQUFBLFFBQ0Y7QUFRQSxpQkFBUyxhQUFhLFFBQVEsWUFBWSxRQUFRO0FBQ2hELGlCQUFPLFFBQVEsT0FBTyxPQUFPLE9BQU8sc0JBQXNCLFVBQVUsR0FBRyxRQUFRLElBQUksY0FBYztBQUNqRyx1QkFBYSxRQUFRLE9BQU8sR0FBRyxPQUFPLFlBQVksWUFBWSxFQUFFO0FBRWhFLGlCQUFPLGFBQWEsY0FBYyxPQUFPLEdBQUcsT0FBTyxZQUFZLGlCQUFpQixFQUFFO0FBR2xGLGlCQUFPLFlBQVksWUFBWTtBQUMvQiwyQkFBaUIsUUFBUSxRQUFRLEdBQUcsT0FBTyxZQUFZLFFBQVEsQ0FBQztBQUNoRSxtQkFBUyxRQUFRLE9BQU8sR0FBRyxPQUFPLFlBQVksYUFBYSxFQUFFO0FBQUEsUUFDL0Q7QUFPQSxjQUFNLGtCQUFrQixDQUFDLFVBQVUsV0FBVztBQUM1QyxnQkFBTSxZQUFZLGFBQWE7QUFFL0IsY0FBSSxDQUFDLFdBQVc7QUFDZDtBQUFBLFVBQ0Y7QUFFQSw4QkFBb0IsV0FBVyxPQUFPLFFBQVE7QUFDOUMsOEJBQW9CLFdBQVcsT0FBTyxRQUFRO0FBQzlDLDBCQUFnQixXQUFXLE9BQU8sSUFBSTtBQUV0QywyQkFBaUIsV0FBVyxRQUFRLFdBQVc7QUFBQSxRQUNqRDtBQU1BLGlCQUFTLG9CQUFvQixXQUFXLFVBQVU7QUFDaEQsY0FBSSxPQUFPLGFBQWEsVUFBVTtBQUNoQyxzQkFBVSxNQUFNLGFBQWE7QUFBQSxVQUMvQixXQUFXLENBQUMsVUFBVTtBQUNwQixxQkFBUyxDQUFDLFNBQVMsaUJBQWlCLFNBQVMsSUFBSSxHQUFHLFlBQVksY0FBYztBQUFBLFVBQ2hGO0FBQUEsUUFDRjtBQU9BLGlCQUFTLG9CQUFvQixXQUFXLFVBQVU7QUFDaEQsY0FBSSxZQUFZLGFBQWE7QUFDM0IscUJBQVMsV0FBVyxZQUFZLFNBQVM7QUFBQSxVQUMzQyxPQUFPO0FBQ0wsaUJBQUssK0RBQStEO0FBQ3BFLHFCQUFTLFdBQVcsWUFBWSxNQUFNO0FBQUEsVUFDeEM7QUFBQSxRQUNGO0FBT0EsaUJBQVMsZ0JBQWdCLFdBQVcsTUFBTTtBQUN4QyxjQUFJLFFBQVEsT0FBTyxTQUFTLFVBQVU7QUFDcEMsa0JBQU0sWUFBWSxRQUFRLE9BQU8sSUFBSTtBQUVyQyxnQkFBSSxhQUFhLGFBQWE7QUFDNUIsdUJBQVMsV0FBVyxZQUFZLFVBQVU7QUFBQSxZQUM1QztBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBV0EsWUFBSSxlQUFlO0FBQUEsVUFDakIsaUJBQWlCLG9CQUFJLFFBQVE7QUFBQSxVQUM3QixTQUFTLG9CQUFJLFFBQVE7QUFBQSxVQUNyQixhQUFhLG9CQUFJLFFBQVE7QUFBQSxVQUN6QixVQUFVLG9CQUFJLFFBQVE7QUFBQSxRQUN4QjtBQUtBLGNBQU0sZUFBZSxDQUFDLFNBQVMsUUFBUSxTQUFTLFVBQVUsU0FBUyxZQUFZLFVBQVU7QUFNekYsY0FBTSxjQUFjLENBQUMsVUFBVSxXQUFXO0FBQ3hDLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFDekQsZ0JBQU0sV0FBVyxDQUFDLGVBQWUsT0FBTyxVQUFVLFlBQVk7QUFDOUQsdUJBQWEsUUFBUSxnQkFBYztBQUNqQyxrQkFBTSxpQkFBaUIsc0JBQXNCLE9BQU8sWUFBWSxXQUFXO0FBRTNFLDBCQUFjLFlBQVksT0FBTyxlQUFlO0FBRWhELDJCQUFlLFlBQVksWUFBWTtBQUV2QyxnQkFBSSxVQUFVO0FBQ1osbUJBQUssY0FBYztBQUFBLFlBQ3JCO0FBQUEsVUFDRixDQUFDO0FBRUQsY0FBSSxPQUFPLE9BQU87QUFDaEIsZ0JBQUksVUFBVTtBQUNaLHdCQUFVLE1BQU07QUFBQSxZQUNsQjtBQUdBLDJCQUFlLE1BQU07QUFBQSxVQUN2QjtBQUFBLFFBQ0Y7QUFLQSxjQUFNLFlBQVksWUFBVTtBQUMxQixjQUFJLENBQUMsZ0JBQWdCLE9BQU8sUUFBUTtBQUNsQyxtQkFBTyxNQUFNLHFKQUE0SyxPQUFPLE9BQU8sT0FBTyxHQUFJLENBQUM7QUFBQSxVQUNyTjtBQUVBLGdCQUFNLGlCQUFpQixrQkFBa0IsT0FBTyxLQUFLO0FBQ3JELGdCQUFNLFFBQVEsZ0JBQWdCLE9BQU8sT0FBTyxnQkFBZ0IsTUFBTTtBQUNsRSxlQUFLLGNBQWM7QUFFbkIscUJBQVcsTUFBTTtBQUNmLHVCQUFXLEtBQUs7QUFBQSxVQUNsQixDQUFDO0FBQUEsUUFDSDtBQU1BLGNBQU0sbUJBQW1CLFdBQVM7QUFDaEMsbUJBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxXQUFXLFFBQVEsS0FBSztBQUNoRCxrQkFBTSxXQUFXLE1BQU0sV0FBVyxHQUFHO0FBRXJDLGdCQUFJLENBQUMsQ0FBQyxRQUFRLFNBQVMsT0FBTyxFQUFFLFNBQVMsUUFBUSxHQUFHO0FBQ2xELG9CQUFNLGdCQUFnQixRQUFRO0FBQUEsWUFDaEM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQU9BLGNBQU0sZ0JBQWdCLENBQUMsWUFBWSxvQkFBb0I7QUFDckQsZ0JBQU0sUUFBUSxTQUFTLFNBQVMsR0FBRyxVQUFVO0FBRTdDLGNBQUksQ0FBQyxPQUFPO0FBQ1Y7QUFBQSxVQUNGO0FBRUEsMkJBQWlCLEtBQUs7QUFFdEIscUJBQVcsUUFBUSxpQkFBaUI7QUFDbEMsa0JBQU0sYUFBYSxNQUFNLGdCQUFnQixLQUFLO0FBQUEsVUFDaEQ7QUFBQSxRQUNGO0FBTUEsY0FBTSxpQkFBaUIsWUFBVTtBQUMvQixnQkFBTSxpQkFBaUIsa0JBQWtCLE9BQU8sS0FBSztBQUVyRCxjQUFJLE9BQU8sT0FBTyxnQkFBZ0IsVUFBVTtBQUMxQyxxQkFBUyxnQkFBZ0IsT0FBTyxZQUFZLEtBQUs7QUFBQSxVQUNuRDtBQUFBLFFBQ0Y7QUFPQSxjQUFNLHNCQUFzQixDQUFDLE9BQU8sV0FBVztBQUM3QyxjQUFJLENBQUMsTUFBTSxlQUFlLE9BQU8sa0JBQWtCO0FBQ2pELGtCQUFNLGNBQWMsT0FBTztBQUFBLFVBQzdCO0FBQUEsUUFDRjtBQVFBLGNBQU0sZ0JBQWdCLENBQUMsT0FBTyxXQUFXLFdBQVc7QUFDbEQsY0FBSSxPQUFPLFlBQVk7QUFDckIsa0JBQU0sS0FBSyxZQUFZO0FBQ3ZCLGtCQUFNLFFBQVEsU0FBUyxjQUFjLE9BQU87QUFDNUMsa0JBQU0sYUFBYSxZQUFZO0FBQy9CLGtCQUFNLGFBQWEsT0FBTyxNQUFNLEVBQUU7QUFDbEMsa0JBQU0sWUFBWTtBQUVsQixnQkFBSSxPQUFPLE9BQU8sZ0JBQWdCLFVBQVU7QUFDMUMsdUJBQVMsT0FBTyxPQUFPLFlBQVksVUFBVTtBQUFBLFlBQy9DO0FBRUEsa0JBQU0sWUFBWSxPQUFPO0FBQ3pCLHNCQUFVLHNCQUFzQixlQUFlLEtBQUs7QUFBQSxVQUN0RDtBQUFBLFFBQ0Y7QUFPQSxjQUFNLG9CQUFvQixlQUFhO0FBQ3JDLGlCQUFPLHNCQUFzQixTQUFTLEdBQUcsWUFBWSxjQUFjLFlBQVksS0FBSztBQUFBLFFBQ3RGO0FBT0EsY0FBTSx3QkFBd0IsQ0FBQyxPQUFPLGVBQWU7QUFDbkQsY0FBSSxDQUFDLFVBQVUsUUFBUSxFQUFFLFNBQVMsT0FBTyxVQUFVLEdBQUc7QUFDcEQsa0JBQU0sUUFBUSxHQUFHLE9BQU8sVUFBVTtBQUFBLFVBQ3BDLFdBQVcsQ0FBQyxVQUFVLFVBQVUsR0FBRztBQUNqQyxpQkFBSyxpRkFBd0YsT0FBTyxPQUFPLFlBQVksR0FBSSxDQUFDO0FBQUEsVUFDOUg7QUFBQSxRQUNGO0FBSUEsY0FBTSxrQkFBa0IsQ0FBQztBQU96Qix3QkFBZ0IsT0FBTyxnQkFBZ0IsUUFBUSxnQkFBZ0IsV0FBVyxnQkFBZ0IsU0FBUyxnQkFBZ0IsTUFBTSxnQkFBZ0IsTUFBTSxDQUFDLE9BQU8sV0FBVztBQUNoSyxnQ0FBc0IsT0FBTyxPQUFPLFVBQVU7QUFDOUMsd0JBQWMsT0FBTyxPQUFPLE1BQU07QUFDbEMsOEJBQW9CLE9BQU8sTUFBTTtBQUNqQyxnQkFBTSxPQUFPLE9BQU87QUFDcEIsaUJBQU87QUFBQSxRQUNUO0FBUUEsd0JBQWdCLE9BQU8sQ0FBQyxPQUFPLFdBQVc7QUFDeEMsd0JBQWMsT0FBTyxPQUFPLE1BQU07QUFDbEMsOEJBQW9CLE9BQU8sTUFBTTtBQUNqQyxpQkFBTztBQUFBLFFBQ1Q7QUFRQSx3QkFBZ0IsUUFBUSxDQUFDLE9BQU8sV0FBVztBQUN6QyxnQkFBTSxhQUFhLE1BQU0sY0FBYyxPQUFPO0FBQzlDLGdCQUFNLGNBQWMsTUFBTSxjQUFjLFFBQVE7QUFDaEQsZ0NBQXNCLFlBQVksT0FBTyxVQUFVO0FBQ25ELHFCQUFXLE9BQU8sT0FBTztBQUN6QixnQ0FBc0IsYUFBYSxPQUFPLFVBQVU7QUFDcEQsd0JBQWMsWUFBWSxPQUFPLE1BQU07QUFDdkMsaUJBQU87QUFBQSxRQUNUO0FBUUEsd0JBQWdCLFNBQVMsQ0FBQyxRQUFRLFdBQVc7QUFDM0MsaUJBQU8sY0FBYztBQUVyQixjQUFJLE9BQU8sa0JBQWtCO0FBQzNCLGtCQUFNLGNBQWMsU0FBUyxjQUFjLFFBQVE7QUFDbkQseUJBQWEsYUFBYSxPQUFPLGdCQUFnQjtBQUNqRCx3QkFBWSxRQUFRO0FBQ3BCLHdCQUFZLFdBQVc7QUFDdkIsd0JBQVksV0FBVztBQUN2QixtQkFBTyxZQUFZLFdBQVc7QUFBQSxVQUNoQztBQUVBLHdCQUFjLFFBQVEsUUFBUSxNQUFNO0FBQ3BDLGlCQUFPO0FBQUEsUUFDVDtBQU9BLHdCQUFnQixRQUFRLFdBQVM7QUFDL0IsZ0JBQU0sY0FBYztBQUNwQixpQkFBTztBQUFBLFFBQ1Q7QUFRQSx3QkFBZ0IsV0FBVyxDQUFDLG1CQUFtQixXQUFXO0FBQ3hELGdCQUFNLFdBQVcsU0FBUyxTQUFTLEdBQUcsVUFBVTtBQUNoRCxtQkFBUyxRQUFRO0FBQ2pCLG1CQUFTLEtBQUssWUFBWTtBQUMxQixtQkFBUyxVQUFVLFFBQVEsT0FBTyxVQUFVO0FBQzVDLGdCQUFNLFFBQVEsa0JBQWtCLGNBQWMsTUFBTTtBQUNwRCx1QkFBYSxPQUFPLE9BQU8sZ0JBQWdCO0FBQzNDLGlCQUFPO0FBQUEsUUFDVDtBQVFBLHdCQUFnQixXQUFXLENBQUMsVUFBVSxXQUFXO0FBQy9DLGdDQUFzQixVQUFVLE9BQU8sVUFBVTtBQUNqRCw4QkFBb0IsVUFBVSxNQUFNO0FBQ3BDLHdCQUFjLFVBQVUsVUFBVSxNQUFNO0FBTXhDLGdCQUFNLFlBQVksUUFBTSxTQUFTLE9BQU8saUJBQWlCLEVBQUUsRUFBRSxVQUFVLElBQUksU0FBUyxPQUFPLGlCQUFpQixFQUFFLEVBQUUsV0FBVztBQUczSCxxQkFBVyxNQUFNO0FBRWYsZ0JBQUksc0JBQXNCLFFBQVE7QUFDaEMsb0JBQU0sb0JBQW9CLFNBQVMsT0FBTyxpQkFBaUIsU0FBUyxDQUFDLEVBQUUsS0FBSztBQUU1RSxvQkFBTSx3QkFBd0IsTUFBTTtBQUNsQyxzQkFBTSxnQkFBZ0IsU0FBUyxjQUFjLFVBQVUsUUFBUTtBQUUvRCxvQkFBSSxnQkFBZ0IsbUJBQW1CO0FBQ3JDLDJCQUFTLEVBQUUsTUFBTSxRQUFRLEdBQUcsT0FBTyxlQUFlLElBQUk7QUFBQSxnQkFDeEQsT0FBTztBQUNMLDJCQUFTLEVBQUUsTUFBTSxRQUFRO0FBQUEsZ0JBQzNCO0FBQUEsY0FDRjtBQUVBLGtCQUFJLGlCQUFpQixxQkFBcUIsRUFBRSxRQUFRLFVBQVU7QUFBQSxnQkFDNUQsWUFBWTtBQUFBLGdCQUNaLGlCQUFpQixDQUFDLE9BQU87QUFBQSxjQUMzQixDQUFDO0FBQUEsWUFDSDtBQUFBLFVBQ0YsQ0FBQztBQUNELGlCQUFPO0FBQUEsUUFDVDtBQU9BLGNBQU0sZ0JBQWdCLENBQUMsVUFBVSxXQUFXO0FBQzFDLGdCQUFNLGdCQUFnQixpQkFBaUI7QUFDdkMsMkJBQWlCLGVBQWUsUUFBUSxlQUFlO0FBRXZELGNBQUksT0FBTyxNQUFNO0FBQ2YsaUNBQXFCLE9BQU8sTUFBTSxhQUFhO0FBQy9DLGlCQUFLLGVBQWUsT0FBTztBQUFBLFVBQzdCLFdBQ1MsT0FBTyxNQUFNO0FBQ3BCLDBCQUFjLGNBQWMsT0FBTztBQUNuQyxpQkFBSyxlQUFlLE9BQU87QUFBQSxVQUM3QixPQUNLO0FBQ0gsaUJBQUssYUFBYTtBQUFBLFVBQ3BCO0FBRUEsc0JBQVksVUFBVSxNQUFNO0FBQUEsUUFDOUI7QUFPQSxjQUFNLGVBQWUsQ0FBQyxVQUFVLFdBQVc7QUFDekMsZ0JBQU0sU0FBUyxVQUFVO0FBQ3pCLGlCQUFPLFFBQVEsT0FBTyxNQUFNO0FBRTVCLGNBQUksT0FBTyxRQUFRO0FBQ2pCLGlDQUFxQixPQUFPLFFBQVEsTUFBTTtBQUFBLFVBQzVDO0FBR0EsMkJBQWlCLFFBQVEsUUFBUSxRQUFRO0FBQUEsUUFDM0M7QUFPQSxjQUFNLG9CQUFvQixDQUFDLFVBQVUsV0FBVztBQUM5QyxnQkFBTSxjQUFjLGVBQWU7QUFDbkMsdUJBQWEsYUFBYSxPQUFPLGVBQWU7QUFFaEQsMkJBQWlCLGFBQWEsUUFBUSxhQUFhO0FBQ25ELGlCQUFPLGFBQWEsT0FBTyxlQUFlO0FBQzFDLHNCQUFZLGFBQWEsY0FBYyxPQUFPLG9CQUFvQjtBQUFBLFFBQ3BFO0FBT0EsY0FBTSxhQUFhLENBQUMsVUFBVSxXQUFXO0FBQ3ZDLGdCQUFNLGNBQWMsYUFBYSxZQUFZLElBQUksUUFBUTtBQUN6RCxnQkFBTSxPQUFPLFFBQVE7QUFFckIsY0FBSSxlQUFlLE9BQU8sU0FBUyxZQUFZLE1BQU07QUFFbkQsdUJBQVcsTUFBTSxNQUFNO0FBQ3ZCLHdCQUFZLE1BQU0sTUFBTTtBQUN4QjtBQUFBLFVBQ0Y7QUFFQSxjQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsT0FBTyxVQUFVO0FBQ3BDLGlCQUFLLElBQUk7QUFDVDtBQUFBLFVBQ0Y7QUFFQSxjQUFJLE9BQU8sUUFBUSxPQUFPLEtBQUssU0FBUyxFQUFFLFFBQVEsT0FBTyxJQUFJLE1BQU0sSUFBSTtBQUNyRSxrQkFBTSxvRkFBK0YsT0FBTyxPQUFPLE1BQU0sR0FBSSxDQUFDO0FBQzlILGlCQUFLLElBQUk7QUFDVDtBQUFBLFVBQ0Y7QUFFQSxlQUFLLElBQUk7QUFFVCxxQkFBVyxNQUFNLE1BQU07QUFDdkIsc0JBQVksTUFBTSxNQUFNO0FBRXhCLG1CQUFTLE1BQU0sT0FBTyxVQUFVLElBQUk7QUFBQSxRQUN0QztBQU1BLGNBQU0sY0FBYyxDQUFDLE1BQU0sV0FBVztBQUNwQyxxQkFBVyxZQUFZLFdBQVc7QUFDaEMsZ0JBQUksT0FBTyxTQUFTLFVBQVU7QUFDNUIsMEJBQVksTUFBTSxVQUFVLFNBQVM7QUFBQSxZQUN2QztBQUFBLFVBQ0Y7QUFFQSxtQkFBUyxNQUFNLFVBQVUsT0FBTyxLQUFLO0FBRXJDLG1CQUFTLE1BQU0sTUFBTTtBQUVyQiwyQ0FBaUM7QUFFakMsMkJBQWlCLE1BQU0sUUFBUSxNQUFNO0FBQUEsUUFDdkM7QUFHQSxjQUFNLG1DQUFtQyxNQUFNO0FBQzdDLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSx1QkFBdUIsT0FBTyxpQkFBaUIsS0FBSyxFQUFFLGlCQUFpQixrQkFBa0I7QUFHL0YsZ0JBQU0sbUJBQW1CLE1BQU0saUJBQWlCLDBEQUEwRDtBQUUxRyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsUUFBUSxLQUFLO0FBQ2hELDZCQUFpQixHQUFHLE1BQU0sa0JBQWtCO0FBQUEsVUFDOUM7QUFBQSxRQUNGO0FBRUEsY0FBTSxrQkFBa0I7QUFDeEIsY0FBTSxnQkFBZ0I7QUFNdEIsY0FBTSxhQUFhLENBQUMsTUFBTSxXQUFXO0FBQ25DLGNBQUksYUFBYSxLQUFLO0FBQ3RCLGNBQUk7QUFFSixjQUFJLE9BQU8sVUFBVTtBQUNuQix5QkFBYSxZQUFZLE9BQU8sUUFBUTtBQUFBLFVBQzFDLFdBQVcsT0FBTyxTQUFTLFdBQVc7QUFDcEMseUJBQWE7QUFDYix5QkFBYSxXQUFXLFFBQVEsaUJBQWlCLEVBQUU7QUFBQSxVQUNyRCxXQUFXLE9BQU8sU0FBUyxTQUFTO0FBQ2xDLHlCQUFhO0FBQUEsVUFDZixPQUFPO0FBQ0wsa0JBQU0sa0JBQWtCO0FBQUEsY0FDdEIsVUFBVTtBQUFBLGNBQ1YsU0FBUztBQUFBLGNBQ1QsTUFBTTtBQUFBLFlBQ1I7QUFDQSx5QkFBYSxZQUFZLGdCQUFnQixPQUFPLEtBQUs7QUFBQSxVQUN2RDtBQUVBLGNBQUksV0FBVyxLQUFLLE1BQU0sV0FBVyxLQUFLLEdBQUc7QUFDM0MseUJBQWEsTUFBTSxVQUFVO0FBQUEsVUFDL0I7QUFBQSxRQUNGO0FBT0EsY0FBTSxXQUFXLENBQUMsTUFBTSxXQUFXO0FBQ2pDLGNBQUksQ0FBQyxPQUFPLFdBQVc7QUFDckI7QUFBQSxVQUNGO0FBRUEsZUFBSyxNQUFNLFFBQVEsT0FBTztBQUMxQixlQUFLLE1BQU0sY0FBYyxPQUFPO0FBRWhDLHFCQUFXLE9BQU8sQ0FBQywyQkFBMkIsNEJBQTRCLDJCQUEyQiwwQkFBMEIsR0FBRztBQUNoSSxxQkFBUyxNQUFNLEtBQUssbUJBQW1CLE9BQU8sU0FBUztBQUFBLFVBQ3pEO0FBRUEsbUJBQVMsTUFBTSx1QkFBdUIsZUFBZSxPQUFPLFNBQVM7QUFBQSxRQUN2RTtBQU9BLGNBQU0sY0FBYyxhQUFXLGVBQWdCLE9BQU8sWUFBWSxpQkFBaUIsSUFBSyxFQUFFLE9BQU8sU0FBUyxRQUFRO0FBT2xILGNBQU0sY0FBYyxDQUFDLFVBQVUsV0FBVztBQUN4QyxnQkFBTSxRQUFRLFNBQVM7QUFFdkIsY0FBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixtQkFBTyxLQUFLLEtBQUs7QUFBQSxVQUNuQjtBQUVBLGVBQUssT0FBTyxFQUFFO0FBRWQsZ0JBQU0sYUFBYSxPQUFPLE9BQU8sUUFBUTtBQUN6QyxnQkFBTSxhQUFhLE9BQU8sT0FBTyxRQUFRO0FBRXpDLDhCQUFvQixPQUFPLFNBQVMsT0FBTyxVQUFVO0FBQ3JELDhCQUFvQixPQUFPLFVBQVUsT0FBTyxXQUFXO0FBRXZELGdCQUFNLFlBQVksWUFBWTtBQUM5QiwyQkFBaUIsT0FBTyxRQUFRLE9BQU87QUFBQSxRQUN6QztBQU9BLGNBQU0sc0JBQXNCLENBQUMsVUFBVSxXQUFXO0FBQ2hELGdCQUFNLHlCQUF5QixpQkFBaUI7QUFFaEQsY0FBSSxDQUFDLE9BQU8saUJBQWlCLE9BQU8sY0FBYyxXQUFXLEdBQUc7QUFDOUQsbUJBQU8sS0FBSyxzQkFBc0I7QUFBQSxVQUNwQztBQUVBLGVBQUssc0JBQXNCO0FBQzNCLGlDQUF1QixjQUFjO0FBRXJDLGNBQUksT0FBTyx1QkFBdUIsT0FBTyxjQUFjLFFBQVE7QUFDN0QsaUJBQUssdUlBQTRJO0FBQUEsVUFDbko7QUFFQSxpQkFBTyxjQUFjLFFBQVEsQ0FBQyxNQUFNLFVBQVU7QUFDNUMsa0JBQU0sU0FBUyxrQkFBa0IsSUFBSTtBQUNyQyxtQ0FBdUIsWUFBWSxNQUFNO0FBRXpDLGdCQUFJLFVBQVUsT0FBTyxxQkFBcUI7QUFDeEMsdUJBQVMsUUFBUSxZQUFZLHVCQUF1QjtBQUFBLFlBQ3REO0FBRUEsZ0JBQUksVUFBVSxPQUFPLGNBQWMsU0FBUyxHQUFHO0FBQzdDLG9CQUFNLFNBQVMsa0JBQWtCLE1BQU07QUFDdkMscUNBQXVCLFlBQVksTUFBTTtBQUFBLFlBQzNDO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQU1BLGNBQU0sb0JBQW9CLFVBQVE7QUFDaEMsZ0JBQU0sU0FBUyxTQUFTLGNBQWMsSUFBSTtBQUMxQyxtQkFBUyxRQUFRLFlBQVksZ0JBQWdCO0FBQzdDLHVCQUFhLFFBQVEsSUFBSTtBQUN6QixpQkFBTztBQUFBLFFBQ1Q7QUFPQSxjQUFNLG9CQUFvQixZQUFVO0FBQ2xDLGdCQUFNLFNBQVMsU0FBUyxjQUFjLElBQUk7QUFDMUMsbUJBQVMsUUFBUSxZQUFZLHFCQUFxQjtBQUVsRCxjQUFJLE9BQU8sdUJBQXVCO0FBQ2hDLGdDQUFvQixRQUFRLFNBQVMsT0FBTyxxQkFBcUI7QUFBQSxVQUNuRTtBQUVBLGlCQUFPO0FBQUEsUUFDVDtBQU9BLGNBQU0sY0FBYyxDQUFDLFVBQVUsV0FBVztBQUN4QyxnQkFBTSxRQUFRLFNBQVM7QUFDdkIsaUJBQU8sT0FBTyxPQUFPLFNBQVMsT0FBTyxXQUFXLE9BQU87QUFFdkQsY0FBSSxPQUFPLE9BQU87QUFDaEIsaUNBQXFCLE9BQU8sT0FBTyxLQUFLO0FBQUEsVUFDMUM7QUFFQSxjQUFJLE9BQU8sV0FBVztBQUNwQixrQkFBTSxZQUFZLE9BQU87QUFBQSxVQUMzQjtBQUdBLDJCQUFpQixPQUFPLFFBQVEsT0FBTztBQUFBLFFBQ3pDO0FBT0EsY0FBTSxjQUFjLENBQUMsVUFBVSxXQUFXO0FBQ3hDLGdCQUFNLFlBQVksYUFBYTtBQUMvQixnQkFBTSxRQUFRLFNBQVM7QUFHdkIsY0FBSSxPQUFPLE9BQU87QUFDaEIsZ0NBQW9CLFdBQVcsU0FBUyxPQUFPLEtBQUs7QUFDcEQsa0JBQU0sTUFBTSxRQUFRO0FBQ3BCLGtCQUFNLGFBQWEsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUFBLFVBQzNDLE9BQU87QUFDTCxnQ0FBb0IsT0FBTyxTQUFTLE9BQU8sS0FBSztBQUFBLFVBQ2xEO0FBR0EsOEJBQW9CLE9BQU8sV0FBVyxPQUFPLE9BQU87QUFFcEQsY0FBSSxPQUFPLE9BQU87QUFDaEIsa0JBQU0sTUFBTSxRQUFRLE9BQU87QUFBQSxVQUM3QjtBQUdBLGNBQUksT0FBTyxZQUFZO0FBQ3JCLGtCQUFNLE1BQU0sYUFBYSxPQUFPO0FBQUEsVUFDbEM7QUFFQSxlQUFLLHFCQUFxQixDQUFDO0FBRTNCLHFCQUFXLE9BQU8sTUFBTTtBQUFBLFFBQzFCO0FBTUEsY0FBTSxhQUFhLENBQUMsT0FBTyxXQUFXO0FBRXBDLGdCQUFNLFlBQVksR0FBRyxPQUFPLFlBQVksT0FBTyxHQUFHLEVBQUUsT0FBTyxVQUFVLEtBQUssSUFBSSxPQUFPLFVBQVUsUUFBUSxFQUFFO0FBRXpHLGNBQUksT0FBTyxPQUFPO0FBQ2hCLHFCQUFTLENBQUMsU0FBUyxpQkFBaUIsU0FBUyxJQUFJLEdBQUcsWUFBWSxjQUFjO0FBQzlFLHFCQUFTLE9BQU8sWUFBWSxLQUFLO0FBQUEsVUFDbkMsT0FBTztBQUNMLHFCQUFTLE9BQU8sWUFBWSxLQUFLO0FBQUEsVUFDbkM7QUFHQSwyQkFBaUIsT0FBTyxRQUFRLE9BQU87QUFFdkMsY0FBSSxPQUFPLE9BQU8sZ0JBQWdCLFVBQVU7QUFDMUMscUJBQVMsT0FBTyxPQUFPLFdBQVc7QUFBQSxVQUNwQztBQUdBLGNBQUksT0FBTyxNQUFNO0FBQ2YscUJBQVMsT0FBTyxZQUFZLFFBQVEsT0FBTyxPQUFPLElBQUksRUFBRTtBQUFBLFVBQzFEO0FBQUEsUUFDRjtBQU9BLGNBQU0sU0FBUyxDQUFDLFVBQVUsV0FBVztBQUNuQyxzQkFBWSxVQUFVLE1BQU07QUFDNUIsMEJBQWdCLFVBQVUsTUFBTTtBQUNoQyw4QkFBb0IsVUFBVSxNQUFNO0FBQ3BDLHFCQUFXLFVBQVUsTUFBTTtBQUMzQixzQkFBWSxVQUFVLE1BQU07QUFDNUIsc0JBQVksVUFBVSxNQUFNO0FBQzVCLDRCQUFrQixVQUFVLE1BQU07QUFDbEMsd0JBQWMsVUFBVSxNQUFNO0FBQzlCLHdCQUFjLFVBQVUsTUFBTTtBQUM5Qix1QkFBYSxVQUFVLE1BQU07QUFFN0IsY0FBSSxPQUFPLE9BQU8sY0FBYyxZQUFZO0FBQzFDLG1CQUFPLFVBQVUsU0FBUyxDQUFDO0FBQUEsVUFDN0I7QUFBQSxRQUNGO0FBRUEsY0FBTSxnQkFBZ0IsT0FBTyxPQUFPO0FBQUEsVUFDbEMsUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFVBQ1YsT0FBTztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsT0FBTztBQUFBLFFBQ1QsQ0FBQztBQU1ELGNBQU0sZ0JBQWdCLE1BQU07QUFDMUIsZ0JBQU0sZUFBZSxNQUFNLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFDdEQsdUJBQWEsUUFBUSxRQUFNO0FBQ3pCLGdCQUFJLE9BQU8sYUFBYSxLQUFLLEdBQUcsU0FBUyxhQUFhLENBQUMsR0FBRztBQUN4RDtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSxHQUFHLGFBQWEsYUFBYSxHQUFHO0FBQ2xDLGlCQUFHLGFBQWEsNkJBQTZCLEdBQUcsYUFBYSxhQUFhLENBQUM7QUFBQSxZQUM3RTtBQUVBLGVBQUcsYUFBYSxlQUFlLE1BQU07QUFBQSxVQUN2QyxDQUFDO0FBQUEsUUFDSDtBQUNBLGNBQU0sa0JBQWtCLE1BQU07QUFDNUIsZ0JBQU0sZUFBZSxNQUFNLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFDdEQsdUJBQWEsUUFBUSxRQUFNO0FBQ3pCLGdCQUFJLEdBQUcsYUFBYSwyQkFBMkIsR0FBRztBQUNoRCxpQkFBRyxhQUFhLGVBQWUsR0FBRyxhQUFhLDJCQUEyQixDQUFDO0FBQzNFLGlCQUFHLGdCQUFnQiwyQkFBMkI7QUFBQSxZQUNoRCxPQUFPO0FBQ0wsaUJBQUcsZ0JBQWdCLGFBQWE7QUFBQSxZQUNsQztBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFFQSxjQUFNLG1CQUFtQixDQUFDLGNBQWMsYUFBYSxhQUFhO0FBQ2xFLGNBQU0sb0JBQW9CLFlBQVU7QUFDbEMsZ0JBQU0sV0FBVyxPQUFPLE9BQU8sYUFBYSxXQUFXLFNBQVMsY0FBYyxPQUFPLFFBQVEsSUFBSSxPQUFPO0FBRXhHLGNBQUksQ0FBQyxVQUFVO0FBQ2IsbUJBQU8sQ0FBQztBQUFBLFVBQ1Y7QUFJQSxnQkFBTSxrQkFBa0IsU0FBUztBQUNqQyxrQ0FBd0IsZUFBZTtBQUN2QyxnQkFBTSxTQUFTLE9BQU8sT0FBTyxjQUFjLGVBQWUsR0FBRyxlQUFlLGVBQWUsR0FBRyxhQUFhLGVBQWUsR0FBRyxZQUFZLGVBQWUsR0FBRyxhQUFhLGVBQWUsR0FBRyxvQkFBb0IsaUJBQWlCLGdCQUFnQixDQUFDO0FBQ2hQLGlCQUFPO0FBQUEsUUFDVDtBQUtBLGNBQU0sZ0JBQWdCLHFCQUFtQjtBQUN2QyxnQkFBTSxTQUFTLENBQUM7QUFHaEIsZ0JBQU0sYUFBYSxNQUFNLEtBQUssZ0JBQWdCLGlCQUFpQixZQUFZLENBQUM7QUFDNUUscUJBQVcsUUFBUSxXQUFTO0FBQzFCLHNDQUEwQixPQUFPLENBQUMsUUFBUSxPQUFPLENBQUM7QUFDbEQsa0JBQU0sWUFBWSxNQUFNLGFBQWEsTUFBTTtBQUMzQyxrQkFBTSxRQUFRLE1BQU0sYUFBYSxPQUFPO0FBRXhDLGdCQUFJLE9BQU8sY0FBYyxlQUFlLGFBQWEsVUFBVSxTQUFTO0FBQ3RFLHFCQUFPLGFBQWE7QUFBQSxZQUN0QjtBQUVBLGdCQUFJLE9BQU8sY0FBYyxlQUFlLFVBQVU7QUFDaEQscUJBQU8sYUFBYSxLQUFLLE1BQU0sS0FBSztBQUFBLFlBQ3RDO0FBQUEsVUFDRixDQUFDO0FBQ0QsaUJBQU87QUFBQSxRQUNUO0FBTUEsY0FBTSxpQkFBaUIscUJBQW1CO0FBQ3hDLGdCQUFNLFNBQVMsQ0FBQztBQUdoQixnQkFBTSxjQUFjLE1BQU0sS0FBSyxnQkFBZ0IsaUJBQWlCLGFBQWEsQ0FBQztBQUM5RSxzQkFBWSxRQUFRLFlBQVU7QUFDNUIsc0NBQTBCLFFBQVEsQ0FBQyxRQUFRLFNBQVMsWUFBWSxDQUFDO0FBQ2pFLGtCQUFNLE9BQU8sT0FBTyxhQUFhLE1BQU07QUFDdkMsbUJBQU8sR0FBRyxPQUFPLE1BQU0sWUFBWSxLQUFLLE9BQU87QUFDL0MsbUJBQU8sT0FBTyxPQUFPLHNCQUFzQixJQUFJLEdBQUcsUUFBUSxLQUFLO0FBRS9ELGdCQUFJLE9BQU8sYUFBYSxPQUFPLEdBQUc7QUFDaEMscUJBQU8sR0FBRyxPQUFPLE1BQU0sYUFBYSxLQUFLLE9BQU8sYUFBYSxPQUFPO0FBQUEsWUFDdEU7QUFFQSxnQkFBSSxPQUFPLGFBQWEsWUFBWSxHQUFHO0FBQ3JDLHFCQUFPLEdBQUcsT0FBTyxNQUFNLGlCQUFpQixLQUFLLE9BQU8sYUFBYSxZQUFZO0FBQUEsWUFDL0U7QUFBQSxVQUNGLENBQUM7QUFDRCxpQkFBTztBQUFBLFFBQ1Q7QUFNQSxjQUFNLGVBQWUscUJBQW1CO0FBQ3RDLGdCQUFNLFNBQVMsQ0FBQztBQUdoQixnQkFBTSxRQUFRLGdCQUFnQixjQUFjLFlBQVk7QUFFeEQsY0FBSSxPQUFPO0FBQ1Qsc0NBQTBCLE9BQU8sQ0FBQyxPQUFPLFNBQVMsVUFBVSxLQUFLLENBQUM7QUFFbEUsZ0JBQUksTUFBTSxhQUFhLEtBQUssR0FBRztBQUM3QixxQkFBTyxXQUFXLE1BQU0sYUFBYSxLQUFLO0FBQUEsWUFDNUM7QUFFQSxnQkFBSSxNQUFNLGFBQWEsT0FBTyxHQUFHO0FBQy9CLHFCQUFPLGFBQWEsTUFBTSxhQUFhLE9BQU87QUFBQSxZQUNoRDtBQUVBLGdCQUFJLE1BQU0sYUFBYSxRQUFRLEdBQUc7QUFDaEMscUJBQU8sY0FBYyxNQUFNLGFBQWEsUUFBUTtBQUFBLFlBQ2xEO0FBRUEsZ0JBQUksTUFBTSxhQUFhLEtBQUssR0FBRztBQUM3QixxQkFBTyxXQUFXLE1BQU0sYUFBYSxLQUFLO0FBQUEsWUFDNUM7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBTUEsY0FBTSxjQUFjLHFCQUFtQjtBQUNyQyxnQkFBTSxTQUFTLENBQUM7QUFHaEIsZ0JBQU0sT0FBTyxnQkFBZ0IsY0FBYyxXQUFXO0FBRXRELGNBQUksTUFBTTtBQUNSLHNDQUEwQixNQUFNLENBQUMsUUFBUSxPQUFPLENBQUM7QUFFakQsZ0JBQUksS0FBSyxhQUFhLE1BQU0sR0FBRztBQUM3QixxQkFBTyxPQUFPLEtBQUssYUFBYSxNQUFNO0FBQUEsWUFDeEM7QUFFQSxnQkFBSSxLQUFLLGFBQWEsT0FBTyxHQUFHO0FBQzlCLHFCQUFPLFlBQVksS0FBSyxhQUFhLE9BQU87QUFBQSxZQUM5QztBQUVBLG1CQUFPLFdBQVcsS0FBSztBQUFBLFVBQ3pCO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBTUEsY0FBTSxlQUFlLHFCQUFtQjtBQUN0QyxnQkFBTSxTQUFTLENBQUM7QUFHaEIsZ0JBQU0sUUFBUSxnQkFBZ0IsY0FBYyxZQUFZO0FBRXhELGNBQUksT0FBTztBQUNULHNDQUEwQixPQUFPLENBQUMsUUFBUSxTQUFTLGVBQWUsT0FBTyxDQUFDO0FBQzFFLG1CQUFPLFFBQVEsTUFBTSxhQUFhLE1BQU0sS0FBSztBQUU3QyxnQkFBSSxNQUFNLGFBQWEsT0FBTyxHQUFHO0FBQy9CLHFCQUFPLGFBQWEsTUFBTSxhQUFhLE9BQU87QUFBQSxZQUNoRDtBQUVBLGdCQUFJLE1BQU0sYUFBYSxhQUFhLEdBQUc7QUFDckMscUJBQU8sbUJBQW1CLE1BQU0sYUFBYSxhQUFhO0FBQUEsWUFDNUQ7QUFFQSxnQkFBSSxNQUFNLGFBQWEsT0FBTyxHQUFHO0FBQy9CLHFCQUFPLGFBQWEsTUFBTSxhQUFhLE9BQU87QUFBQSxZQUNoRDtBQUFBLFVBQ0Y7QUFJQSxnQkFBTSxlQUFlLE1BQU0sS0FBSyxnQkFBZ0IsaUJBQWlCLG1CQUFtQixDQUFDO0FBRXJGLGNBQUksYUFBYSxRQUFRO0FBQ3ZCLG1CQUFPLGVBQWUsQ0FBQztBQUN2Qix5QkFBYSxRQUFRLFlBQVU7QUFDN0Isd0NBQTBCLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDM0Msb0JBQU0sY0FBYyxPQUFPLGFBQWEsT0FBTztBQUMvQyxvQkFBTSxhQUFhLE9BQU87QUFDMUIscUJBQU8sYUFBYSxlQUFlO0FBQUEsWUFDckMsQ0FBQztBQUFBLFVBQ0g7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFPQSxjQUFNLHNCQUFzQixDQUFDLGlCQUFpQixlQUFlO0FBQzNELGdCQUFNLFNBQVMsQ0FBQztBQUVoQixxQkFBVyxLQUFLLFlBQVk7QUFDMUIsa0JBQU0sWUFBWSxXQUFXO0FBRzdCLGtCQUFNLE1BQU0sZ0JBQWdCLGNBQWMsU0FBUztBQUVuRCxnQkFBSSxLQUFLO0FBQ1Asd0NBQTBCLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLHFCQUFPLFVBQVUsUUFBUSxVQUFVLEVBQUUsS0FBSyxJQUFJLFVBQVUsS0FBSztBQUFBLFlBQy9EO0FBQUEsVUFDRjtBQUVBLGlCQUFPO0FBQUEsUUFDVDtBQU1BLGNBQU0sMEJBQTBCLHFCQUFtQjtBQUNqRCxnQkFBTSxrQkFBa0IsaUJBQWlCLE9BQU8sQ0FBQyxjQUFjLGVBQWUsY0FBYyxhQUFhLGNBQWMsbUJBQW1CLENBQUM7QUFDM0ksZ0JBQU0sS0FBSyxnQkFBZ0IsUUFBUSxFQUFFLFFBQVEsUUFBTTtBQUNqRCxrQkFBTSxVQUFVLEdBQUcsUUFBUSxZQUFZO0FBRXZDLGdCQUFJLGdCQUFnQixRQUFRLE9BQU8sTUFBTSxJQUFJO0FBQzNDLG1CQUFLLHlCQUF5QixPQUFPLFNBQVMsR0FBRyxDQUFDO0FBQUEsWUFDcEQ7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBT0EsY0FBTSw0QkFBNEIsQ0FBQyxJQUFJLHNCQUFzQjtBQUMzRCxnQkFBTSxLQUFLLEdBQUcsVUFBVSxFQUFFLFFBQVEsZUFBYTtBQUM3QyxnQkFBSSxrQkFBa0IsUUFBUSxVQUFVLElBQUksTUFBTSxJQUFJO0FBQ3BELG1CQUFLLENBQUMsMkJBQTRCLE9BQU8sVUFBVSxNQUFNLFFBQVMsRUFBRSxPQUFPLEdBQUcsUUFBUSxZQUFZLEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxrQkFBa0IsU0FBUywyQkFBMkIsT0FBTyxrQkFBa0IsS0FBSyxJQUFJLENBQUMsSUFBSSxnREFBZ0QsQ0FBQyxDQUFDO0FBQUEsWUFDdlE7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBRUEsWUFBSSx5QkFBeUI7QUFBQSxVQU0zQixPQUFPLENBQUMsUUFBUSxzQkFBc0I7QUFDcEMsbUJBQU8sd0RBQXdELEtBQUssTUFBTSxJQUFJLFFBQVEsUUFBUSxJQUFJLFFBQVEsUUFBUSxxQkFBcUIsdUJBQXVCO0FBQUEsVUFDaEs7QUFBQSxVQU9BLEtBQUssQ0FBQyxRQUFRLHNCQUFzQjtBQUVsQyxtQkFBTyw4RkFBOEYsS0FBSyxNQUFNLElBQUksUUFBUSxRQUFRLElBQUksUUFBUSxRQUFRLHFCQUFxQixhQUFhO0FBQUEsVUFDNUw7QUFBQSxRQUNGO0FBTUEsaUJBQVMsMEJBQTBCLFFBQVE7QUFFekMsY0FBSSxDQUFDLE9BQU8sZ0JBQWdCO0FBQzFCLG1CQUFPLEtBQUssc0JBQXNCLEVBQUUsUUFBUSxTQUFPO0FBQ2pELGtCQUFJLE9BQU8sVUFBVSxLQUFLO0FBQ3hCLHVCQUFPLGlCQUFpQix1QkFBdUI7QUFBQSxjQUNqRDtBQUFBLFlBQ0YsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBTUEsaUJBQVMsNEJBQTRCLFFBQVE7QUFFM0MsY0FBSSxDQUFDLE9BQU8sVUFBVSxPQUFPLE9BQU8sV0FBVyxZQUFZLENBQUMsU0FBUyxjQUFjLE9BQU8sTUFBTSxLQUFLLE9BQU8sT0FBTyxXQUFXLFlBQVksQ0FBQyxPQUFPLE9BQU8sYUFBYTtBQUNwSyxpQkFBSyxxREFBcUQ7QUFDMUQsbUJBQU8sU0FBUztBQUFBLFVBQ2xCO0FBQUEsUUFDRjtBQVFBLGlCQUFTLGNBQWMsUUFBUTtBQUM3QixvQ0FBMEIsTUFBTTtBQUVoQyxjQUFJLE9BQU8sdUJBQXVCLENBQUMsT0FBTyxZQUFZO0FBQ3BELGlCQUFLLGtNQUE0TTtBQUFBLFVBQ25OO0FBRUEsc0NBQTRCLE1BQU07QUFFbEMsY0FBSSxPQUFPLE9BQU8sVUFBVSxVQUFVO0FBQ3BDLG1CQUFPLFFBQVEsT0FBTyxNQUFNLE1BQU0sSUFBSSxFQUFFLEtBQUssUUFBUTtBQUFBLFVBQ3ZEO0FBRUEsZUFBSyxNQUFNO0FBQUEsUUFDYjtBQUVBLGNBQU0sTUFBTTtBQUFBLFVBQ1YsWUFBWSxVQUFVLE9BQU87QUFDM0IsaUJBQUssV0FBVztBQUNoQixpQkFBSyxZQUFZO0FBQ2pCLGlCQUFLLFVBQVU7QUFDZixpQkFBSyxNQUFNO0FBQUEsVUFDYjtBQUFBLFVBRUEsUUFBUTtBQUNOLGdCQUFJLENBQUMsS0FBSyxTQUFTO0FBQ2pCLG1CQUFLLFVBQVU7QUFDZixtQkFBSyxVQUFVLElBQUksS0FBSztBQUN4QixtQkFBSyxLQUFLLFdBQVcsS0FBSyxVQUFVLEtBQUssU0FBUztBQUFBLFlBQ3BEO0FBRUEsbUJBQU8sS0FBSztBQUFBLFVBQ2Q7QUFBQSxVQUVBLE9BQU87QUFDTCxnQkFBSSxLQUFLLFNBQVM7QUFDaEIsbUJBQUssVUFBVTtBQUNmLDJCQUFhLEtBQUssRUFBRTtBQUNwQixtQkFBSyxhQUFhLElBQUksS0FBSyxFQUFFLFFBQVEsSUFBSSxLQUFLLFFBQVEsUUFBUTtBQUFBLFlBQ2hFO0FBRUEsbUJBQU8sS0FBSztBQUFBLFVBQ2Q7QUFBQSxVQUVBLFNBQVMsR0FBRztBQUNWLGtCQUFNLFVBQVUsS0FBSztBQUVyQixnQkFBSSxTQUFTO0FBQ1gsbUJBQUssS0FBSztBQUFBLFlBQ1o7QUFFQSxpQkFBSyxhQUFhO0FBRWxCLGdCQUFJLFNBQVM7QUFDWCxtQkFBSyxNQUFNO0FBQUEsWUFDYjtBQUVBLG1CQUFPLEtBQUs7QUFBQSxVQUNkO0FBQUEsVUFFQSxlQUFlO0FBQ2IsZ0JBQUksS0FBSyxTQUFTO0FBQ2hCLG1CQUFLLEtBQUs7QUFDVixtQkFBSyxNQUFNO0FBQUEsWUFDYjtBQUVBLG1CQUFPLEtBQUs7QUFBQSxVQUNkO0FBQUEsVUFFQSxZQUFZO0FBQ1YsbUJBQU8sS0FBSztBQUFBLFVBQ2Q7QUFBQSxRQUVGO0FBRUEsY0FBTSxlQUFlLE1BQU07QUFFekIsY0FBSSxPQUFPLHdCQUF3QixNQUFNO0FBQ3ZDO0FBQUEsVUFDRjtBQUdBLGNBQUksU0FBUyxLQUFLLGVBQWUsT0FBTyxhQUFhO0FBRW5ELG1CQUFPLHNCQUFzQixTQUFTLE9BQU8saUJBQWlCLFNBQVMsSUFBSSxFQUFFLGlCQUFpQixlQUFlLENBQUM7QUFDOUcscUJBQVMsS0FBSyxNQUFNLGVBQWUsR0FBRyxPQUFPLE9BQU8sc0JBQXNCLGlCQUFpQixHQUFHLElBQUk7QUFBQSxVQUNwRztBQUFBLFFBQ0Y7QUFDQSxjQUFNLGdCQUFnQixNQUFNO0FBQzFCLGNBQUksT0FBTyx3QkFBd0IsTUFBTTtBQUN2QyxxQkFBUyxLQUFLLE1BQU0sZUFBZSxHQUFHLE9BQU8sT0FBTyxxQkFBcUIsSUFBSTtBQUM3RSxtQkFBTyxzQkFBc0I7QUFBQSxVQUMvQjtBQUFBLFFBQ0Y7QUFJQSxjQUFNLFNBQVMsTUFBTTtBQUNuQixnQkFBTSxNQUNOLG1CQUFtQixLQUFLLFVBQVUsU0FBUyxLQUFLLENBQUMsT0FBTyxZQUFZLFVBQVUsYUFBYSxjQUFjLFVBQVUsaUJBQWlCO0FBRXBJLGNBQUksT0FBTyxDQUFDLFNBQVMsU0FBUyxNQUFNLFlBQVksTUFBTSxHQUFHO0FBQ3ZELGtCQUFNLFNBQVMsU0FBUyxLQUFLO0FBQzdCLHFCQUFTLEtBQUssTUFBTSxNQUFNLEdBQUcsT0FBTyxTQUFTLElBQUksSUFBSTtBQUNyRCxxQkFBUyxTQUFTLE1BQU0sWUFBWSxNQUFNO0FBQzFDLDJCQUFlO0FBQ2YsMENBQThCO0FBQUEsVUFDaEM7QUFBQSxRQUNGO0FBS0EsY0FBTSxnQ0FBZ0MsTUFBTTtBQUMxQyxnQkFBTSxLQUFLLFVBQVU7QUFDckIsZ0JBQU0sTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLE9BQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLFNBQVM7QUFDdkQsZ0JBQU0sU0FBUyxDQUFDLENBQUMsR0FBRyxNQUFNLFNBQVM7QUFDbkMsZ0JBQU0sWUFBWSxPQUFPLFVBQVUsQ0FBQyxHQUFHLE1BQU0sUUFBUTtBQUVyRCxjQUFJLFdBQVc7QUFDYixrQkFBTSxvQkFBb0I7QUFFMUIsZ0JBQUksU0FBUyxFQUFFLGVBQWUsT0FBTyxjQUFjLG1CQUFtQjtBQUNwRSwyQkFBYSxFQUFFLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxtQkFBbUIsSUFBSTtBQUFBLFlBQ3hFO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFNQSxjQUFNLGlCQUFpQixNQUFNO0FBQzNCLGdCQUFNLFlBQVksYUFBYTtBQUMvQixjQUFJO0FBRUosb0JBQVUsZUFBZSxPQUFLO0FBQzVCLCtCQUFtQix1QkFBdUIsQ0FBQztBQUFBLFVBQzdDO0FBRUEsb0JBQVUsY0FBYyxPQUFLO0FBQzNCLGdCQUFJLGtCQUFrQjtBQUNwQixnQkFBRSxlQUFlO0FBQ2pCLGdCQUFFLGdCQUFnQjtBQUFBLFlBQ3BCO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLHlCQUF5QixXQUFTO0FBQ3RDLGdCQUFNLFNBQVMsTUFBTTtBQUNyQixnQkFBTSxZQUFZLGFBQWE7QUFFL0IsY0FBSSxTQUFTLEtBQUssS0FBSyxPQUFPLEtBQUssR0FBRztBQUNwQyxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLFdBQVcsV0FBVztBQUN4QixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLENBQUMsYUFBYSxTQUFTLEtBQUssT0FBTyxZQUFZLFdBQ25ELE9BQU8sWUFBWSxjQUNuQixFQUFFLGFBQWEsaUJBQWlCLENBQUMsS0FDakMsaUJBQWlCLEVBQUUsU0FBUyxNQUFNLElBQUk7QUFDcEMsbUJBQU87QUFBQSxVQUNUO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBU0EsY0FBTSxXQUFXLFdBQVM7QUFDeEIsaUJBQU8sTUFBTSxXQUFXLE1BQU0sUUFBUSxVQUFVLE1BQU0sUUFBUSxHQUFHLGNBQWM7QUFBQSxRQUNqRjtBQVNBLGNBQU0sU0FBUyxXQUFTO0FBQ3RCLGlCQUFPLE1BQU0sV0FBVyxNQUFNLFFBQVEsU0FBUztBQUFBLFFBQ2pEO0FBRUEsY0FBTSxhQUFhLE1BQU07QUFDdkIsY0FBSSxTQUFTLFNBQVMsTUFBTSxZQUFZLE1BQU0sR0FBRztBQUMvQyxrQkFBTSxTQUFTLFNBQVMsU0FBUyxLQUFLLE1BQU0sS0FBSyxFQUFFO0FBQ25ELHdCQUFZLFNBQVMsTUFBTSxZQUFZLE1BQU07QUFDN0MscUJBQVMsS0FBSyxNQUFNLE1BQU07QUFDMUIscUJBQVMsS0FBSyxZQUFZLFNBQVM7QUFBQSxVQUNyQztBQUFBLFFBQ0Y7QUFFQSxjQUFNLHFCQUFxQjtBQU8zQixjQUFNLFlBQVksWUFBVTtBQUMxQixnQkFBTSxZQUFZLGFBQWE7QUFDL0IsZ0JBQU0sUUFBUSxTQUFTO0FBRXZCLGNBQUksT0FBTyxPQUFPLGFBQWEsWUFBWTtBQUN6QyxtQkFBTyxTQUFTLEtBQUs7QUFBQSxVQUN2QjtBQUVBLGdCQUFNLGFBQWEsT0FBTyxpQkFBaUIsU0FBUyxJQUFJO0FBQ3hELGdCQUFNLHNCQUFzQixXQUFXO0FBQ3ZDLHVCQUFhLFdBQVcsT0FBTyxNQUFNO0FBRXJDLHFCQUFXLE1BQU07QUFDZixtQ0FBdUIsV0FBVyxLQUFLO0FBQUEsVUFDekMsR0FBRyxrQkFBa0I7QUFFckIsY0FBSSxRQUFRLEdBQUc7QUFDYiwrQkFBbUIsV0FBVyxPQUFPLGtCQUFrQixtQkFBbUI7QUFDMUUsMEJBQWM7QUFBQSxVQUNoQjtBQUVBLGNBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxZQUFZLHVCQUF1QjtBQUNwRCx3QkFBWSx3QkFBd0IsU0FBUztBQUFBLFVBQy9DO0FBRUEsY0FBSSxPQUFPLE9BQU8sWUFBWSxZQUFZO0FBQ3hDLHVCQUFXLE1BQU0sT0FBTyxRQUFRLEtBQUssQ0FBQztBQUFBLFVBQ3hDO0FBRUEsc0JBQVksV0FBVyxZQUFZLGdCQUFnQjtBQUFBLFFBQ3JEO0FBRUEsY0FBTSw0QkFBNEIsV0FBUztBQUN6QyxnQkFBTSxRQUFRLFNBQVM7QUFFdkIsY0FBSSxNQUFNLFdBQVcsT0FBTztBQUMxQjtBQUFBLFVBQ0Y7QUFFQSxnQkFBTSxZQUFZLGFBQWE7QUFDL0IsZ0JBQU0sb0JBQW9CLG1CQUFtQix5QkFBeUI7QUFDdEUsb0JBQVUsTUFBTSxZQUFZO0FBQUEsUUFDOUI7QUFFQSxjQUFNLHlCQUF5QixDQUFDLFdBQVcsVUFBVTtBQUNuRCxjQUFJLHFCQUFxQixnQkFBZ0IsS0FBSyxHQUFHO0FBQy9DLHNCQUFVLE1BQU0sWUFBWTtBQUM1QixrQkFBTSxpQkFBaUIsbUJBQW1CLHlCQUF5QjtBQUFBLFVBQ3JFLE9BQU87QUFDTCxzQkFBVSxNQUFNLFlBQVk7QUFBQSxVQUM5QjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLHFCQUFxQixDQUFDLFdBQVcsa0JBQWtCLHdCQUF3QjtBQUMvRSxpQkFBTztBQUVQLGNBQUksb0JBQW9CLHdCQUF3QixVQUFVO0FBQ3hELHlCQUFhO0FBQUEsVUFDZjtBQUdBLHFCQUFXLE1BQU07QUFDZixzQkFBVSxZQUFZO0FBQUEsVUFDeEIsQ0FBQztBQUFBLFFBQ0g7QUFFQSxjQUFNLGVBQWUsQ0FBQyxXQUFXLE9BQU8sV0FBVztBQUNqRCxtQkFBUyxXQUFXLE9BQU8sVUFBVSxRQUFRO0FBRTdDLGdCQUFNLE1BQU0sWUFBWSxXQUFXLEtBQUssV0FBVztBQUNuRCxlQUFLLE9BQU8sTUFBTTtBQUNsQixxQkFBVyxNQUFNO0FBRWYscUJBQVMsT0FBTyxPQUFPLFVBQVUsS0FBSztBQUV0QyxrQkFBTSxNQUFNLGVBQWUsU0FBUztBQUFBLFVBQ3RDLEdBQUcsa0JBQWtCO0FBRXJCLG1CQUFTLENBQUMsU0FBUyxpQkFBaUIsU0FBUyxJQUFJLEdBQUcsWUFBWSxLQUFLO0FBRXJFLGNBQUksT0FBTyxjQUFjLE9BQU8sWUFBWSxDQUFDLE9BQU8sT0FBTztBQUN6RCxxQkFBUyxDQUFDLFNBQVMsaUJBQWlCLFNBQVMsSUFBSSxHQUFHLFlBQVksY0FBYztBQUFBLFVBQ2hGO0FBQUEsUUFDRjtBQU9BLGNBQU0sY0FBYyxxQkFBbUI7QUFDckMsY0FBSSxRQUFRLFNBQVM7QUFFckIsY0FBSSxDQUFDLE9BQU87QUFDVixnQkFBSUEsTUFBSztBQUFBLFVBQ1g7QUFFQSxrQkFBUSxTQUFTO0FBQ2pCLGdCQUFNLFNBQVMsVUFBVTtBQUV6QixjQUFJLFFBQVEsR0FBRztBQUNiLGlCQUFLLFFBQVEsQ0FBQztBQUFBLFVBQ2hCLE9BQU87QUFDTCwwQkFBYyxPQUFPLGVBQWU7QUFBQSxVQUN0QztBQUVBLGVBQUssTUFBTTtBQUNYLGdCQUFNLGFBQWEsZ0JBQWdCLE1BQU07QUFDekMsZ0JBQU0sYUFBYSxhQUFhLE1BQU07QUFDdEMsZ0JBQU0sTUFBTTtBQUFBLFFBQ2Q7QUFFQSxjQUFNLGdCQUFnQixDQUFDLE9BQU8sb0JBQW9CO0FBQ2hELGdCQUFNLFVBQVUsV0FBVztBQUMzQixnQkFBTSxTQUFTLFVBQVU7QUFFekIsY0FBSSxDQUFDLG1CQUFtQixVQUFVLGlCQUFpQixDQUFDLEdBQUc7QUFDckQsOEJBQWtCLGlCQUFpQjtBQUFBLFVBQ3JDO0FBRUEsZUFBSyxPQUFPO0FBRVosY0FBSSxpQkFBaUI7QUFDbkIsaUJBQUssZUFBZTtBQUNwQixtQkFBTyxhQUFhLDBCQUEwQixnQkFBZ0IsU0FBUztBQUFBLFVBQ3pFO0FBRUEsaUJBQU8sV0FBVyxhQUFhLFFBQVEsZUFBZTtBQUN0RCxtQkFBUyxDQUFDLE9BQU8sT0FBTyxHQUFHLFlBQVksT0FBTztBQUFBLFFBQ2hEO0FBRUEsY0FBTSw2QkFBNkIsQ0FBQyxVQUFVLFdBQVc7QUFDdkQsY0FBSSxPQUFPLFVBQVUsWUFBWSxPQUFPLFVBQVUsU0FBUztBQUN6RCwrQkFBbUIsVUFBVSxNQUFNO0FBQUEsVUFDckMsV0FBVyxDQUFDLFFBQVEsU0FBUyxVQUFVLE9BQU8sVUFBVSxFQUFFLFNBQVMsT0FBTyxLQUFLLE1BQU0sZUFBZSxPQUFPLFVBQVUsS0FBSyxVQUFVLE9BQU8sVUFBVSxJQUFJO0FBQ3ZKLHdCQUFZLGlCQUFpQixDQUFDO0FBQzlCLDZCQUFpQixVQUFVLE1BQU07QUFBQSxVQUNuQztBQUFBLFFBQ0Y7QUFDQSxjQUFNLGdCQUFnQixDQUFDLFVBQVUsZ0JBQWdCO0FBQy9DLGdCQUFNLFFBQVEsU0FBUyxTQUFTO0FBRWhDLGNBQUksQ0FBQyxPQUFPO0FBQ1YsbUJBQU87QUFBQSxVQUNUO0FBRUEsa0JBQVEsWUFBWTtBQUFBLGlCQUNiO0FBQ0gscUJBQU8saUJBQWlCLEtBQUs7QUFBQSxpQkFFMUI7QUFDSCxxQkFBTyxjQUFjLEtBQUs7QUFBQSxpQkFFdkI7QUFDSCxxQkFBTyxhQUFhLEtBQUs7QUFBQTtBQUd6QixxQkFBTyxZQUFZLGdCQUFnQixNQUFNLE1BQU0sS0FBSyxJQUFJLE1BQU07QUFBQTtBQUFBLFFBRXBFO0FBRUEsY0FBTSxtQkFBbUIsV0FBUyxNQUFNLFVBQVUsSUFBSTtBQUV0RCxjQUFNLGdCQUFnQixXQUFTLE1BQU0sVUFBVSxNQUFNLFFBQVE7QUFFN0QsY0FBTSxlQUFlLFdBQVMsTUFBTSxNQUFNLFNBQVMsTUFBTSxhQUFhLFVBQVUsTUFBTSxPQUFPLE1BQU0sUUFBUSxNQUFNLE1BQU0sS0FBSztBQUU1SCxjQUFNLHFCQUFxQixDQUFDLFVBQVUsV0FBVztBQUMvQyxnQkFBTSxRQUFRLFNBQVM7QUFFdkIsZ0JBQU0sc0JBQXNCLGtCQUFnQixxQkFBcUIsT0FBTyxPQUFPLE9BQU8sbUJBQW1CLFlBQVksR0FBRyxNQUFNO0FBRTlILGNBQUksZUFBZSxPQUFPLFlBQVksS0FBSyxVQUFVLE9BQU8sWUFBWSxHQUFHO0FBQ3pFLHdCQUFZLGlCQUFpQixDQUFDO0FBQzlCLHNCQUFVLE9BQU8sWUFBWSxFQUFFLEtBQUssa0JBQWdCO0FBQ2xELHVCQUFTLFlBQVk7QUFDckIsa0NBQW9CLFlBQVk7QUFBQSxZQUNsQyxDQUFDO0FBQUEsVUFDSCxXQUFXLE9BQU8sT0FBTyxpQkFBaUIsVUFBVTtBQUNsRCxnQ0FBb0IsT0FBTyxZQUFZO0FBQUEsVUFDekMsT0FBTztBQUNMLGtCQUFNLHlFQUF5RSxPQUFPLE9BQU8sT0FBTyxZQUFZLENBQUM7QUFBQSxVQUNuSDtBQUFBLFFBQ0Y7QUFFQSxjQUFNLG1CQUFtQixDQUFDLFVBQVUsV0FBVztBQUM3QyxnQkFBTSxRQUFRLFNBQVMsU0FBUztBQUNoQyxlQUFLLEtBQUs7QUFDVixvQkFBVSxPQUFPLFVBQVUsRUFBRSxLQUFLLGdCQUFjO0FBQzlDLGtCQUFNLFFBQVEsT0FBTyxVQUFVLFdBQVcsV0FBVyxVQUFVLEtBQUssSUFBSSxHQUFHLE9BQU8sVUFBVTtBQUM1RixpQkFBSyxLQUFLO0FBQ1Ysa0JBQU0sTUFBTTtBQUNaLHFCQUFTLFlBQVk7QUFBQSxVQUN2QixDQUFDLEVBQUUsTUFBTSxTQUFPO0FBQ2Qsa0JBQU0sZ0NBQWdDLE9BQU8sR0FBRyxDQUFDO0FBQ2pELGtCQUFNLFFBQVE7QUFDZCxpQkFBSyxLQUFLO0FBQ1Ysa0JBQU0sTUFBTTtBQUNaLHFCQUFTLFlBQVk7QUFBQSxVQUN2QixDQUFDO0FBQUEsUUFDSDtBQUVBLGNBQU0sdUJBQXVCO0FBQUEsVUFDM0IsUUFBUSxDQUFDLE9BQU8sY0FBYyxXQUFXO0FBQ3ZDLGtCQUFNLFNBQVMsc0JBQXNCLE9BQU8sWUFBWSxNQUFNO0FBRTlELGtCQUFNLGVBQWUsQ0FBQyxRQUFRLGFBQWEsZ0JBQWdCO0FBQ3pELG9CQUFNLFNBQVMsU0FBUyxjQUFjLFFBQVE7QUFDOUMscUJBQU8sUUFBUTtBQUNmLDJCQUFhLFFBQVEsV0FBVztBQUNoQyxxQkFBTyxXQUFXLFdBQVcsYUFBYSxPQUFPLFVBQVU7QUFDM0QscUJBQU8sWUFBWSxNQUFNO0FBQUEsWUFDM0I7QUFFQSx5QkFBYSxRQUFRLGlCQUFlO0FBQ2xDLG9CQUFNLGNBQWMsWUFBWTtBQUNoQyxvQkFBTSxjQUFjLFlBQVk7QUFLaEMsa0JBQUksTUFBTSxRQUFRLFdBQVcsR0FBRztBQUU5QixzQkFBTSxXQUFXLFNBQVMsY0FBYyxVQUFVO0FBQ2xELHlCQUFTLFFBQVE7QUFDakIseUJBQVMsV0FBVztBQUVwQix1QkFBTyxZQUFZLFFBQVE7QUFDM0IsNEJBQVksUUFBUSxPQUFLLGFBQWEsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7QUFBQSxjQUM3RCxPQUFPO0FBRUwsNkJBQWEsUUFBUSxhQUFhLFdBQVc7QUFBQSxjQUMvQztBQUFBLFlBQ0YsQ0FBQztBQUNELG1CQUFPLE1BQU07QUFBQSxVQUNmO0FBQUEsVUFDQSxPQUFPLENBQUMsT0FBTyxjQUFjLFdBQVc7QUFDdEMsa0JBQU0sUUFBUSxzQkFBc0IsT0FBTyxZQUFZLEtBQUs7QUFDNUQseUJBQWEsUUFBUSxpQkFBZTtBQUNsQyxvQkFBTSxhQUFhLFlBQVk7QUFDL0Isb0JBQU0sYUFBYSxZQUFZO0FBQy9CLG9CQUFNLGFBQWEsU0FBUyxjQUFjLE9BQU87QUFDakQsb0JBQU0sb0JBQW9CLFNBQVMsY0FBYyxPQUFPO0FBQ3hELHlCQUFXLE9BQU87QUFDbEIseUJBQVcsT0FBTyxZQUFZO0FBQzlCLHlCQUFXLFFBQVE7QUFFbkIsa0JBQUksV0FBVyxZQUFZLE9BQU8sVUFBVSxHQUFHO0FBQzdDLDJCQUFXLFVBQVU7QUFBQSxjQUN2QjtBQUVBLG9CQUFNLFFBQVEsU0FBUyxjQUFjLE1BQU07QUFDM0MsMkJBQWEsT0FBTyxVQUFVO0FBQzlCLG9CQUFNLFlBQVksWUFBWTtBQUM5QixnQ0FBa0IsWUFBWSxVQUFVO0FBQ3hDLGdDQUFrQixZQUFZLEtBQUs7QUFDbkMsb0JBQU0sWUFBWSxpQkFBaUI7QUFBQSxZQUNyQyxDQUFDO0FBQ0Qsa0JBQU0sU0FBUyxNQUFNLGlCQUFpQixPQUFPO0FBRTdDLGdCQUFJLE9BQU8sUUFBUTtBQUNqQixxQkFBTyxHQUFHLE1BQU07QUFBQSxZQUNsQjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBTUEsY0FBTSxxQkFBcUIsa0JBQWdCO0FBQ3pDLGdCQUFNLFNBQVMsQ0FBQztBQUVoQixjQUFJLE9BQU8sUUFBUSxlQUFlLHdCQUF3QixLQUFLO0FBQzdELHlCQUFhLFFBQVEsQ0FBQyxPQUFPLFFBQVE7QUFDbkMsa0JBQUksaUJBQWlCO0FBRXJCLGtCQUFJLE9BQU8sbUJBQW1CLFVBQVU7QUFFdEMsaUNBQWlCLG1CQUFtQixjQUFjO0FBQUEsY0FDcEQ7QUFFQSxxQkFBTyxLQUFLLENBQUMsS0FBSyxjQUFjLENBQUM7QUFBQSxZQUNuQyxDQUFDO0FBQUEsVUFDSCxPQUFPO0FBQ0wsbUJBQU8sS0FBSyxZQUFZLEVBQUUsUUFBUSxTQUFPO0FBQ3ZDLGtCQUFJLGlCQUFpQixhQUFhO0FBRWxDLGtCQUFJLE9BQU8sbUJBQW1CLFVBQVU7QUFFdEMsaUNBQWlCLG1CQUFtQixjQUFjO0FBQUEsY0FDcEQ7QUFFQSxxQkFBTyxLQUFLLENBQUMsS0FBSyxjQUFjLENBQUM7QUFBQSxZQUNuQyxDQUFDO0FBQUEsVUFDSDtBQUVBLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGNBQU0sYUFBYSxDQUFDLGFBQWEsZUFBZTtBQUM5QyxpQkFBTyxjQUFjLFdBQVcsU0FBUyxNQUFNLFlBQVksU0FBUztBQUFBLFFBQ3RFO0FBTUEsaUJBQVMsY0FBYztBQUVyQixnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLElBQUk7QUFFckQsY0FBSSxDQUFDLGFBQWE7QUFDaEI7QUFBQSxVQUNGO0FBRUEsZ0JBQU0sV0FBVyxhQUFhLFNBQVMsSUFBSSxJQUFJO0FBQy9DLGVBQUssU0FBUyxNQUFNO0FBRXBCLGNBQUksUUFBUSxHQUFHO0FBQ2IsZ0JBQUksWUFBWSxNQUFNO0FBQ3BCLG1CQUFLLFFBQVEsQ0FBQztBQUFBLFlBQ2hCO0FBQUEsVUFDRixPQUFPO0FBQ0wsOEJBQWtCLFFBQVE7QUFBQSxVQUM1QjtBQUVBLHNCQUFZLENBQUMsU0FBUyxPQUFPLFNBQVMsT0FBTyxHQUFHLFlBQVksT0FBTztBQUNuRSxtQkFBUyxNQUFNLGdCQUFnQixXQUFXO0FBQzFDLG1CQUFTLE1BQU0sZ0JBQWdCLGNBQWM7QUFDN0MsbUJBQVMsY0FBYyxXQUFXO0FBQ2xDLG1CQUFTLFdBQVcsV0FBVztBQUMvQixtQkFBUyxhQUFhLFdBQVc7QUFBQSxRQUNuQztBQUVBLGNBQU0sb0JBQW9CLGNBQVk7QUFDcEMsZ0JBQU0sa0JBQWtCLFNBQVMsTUFBTSx1QkFBdUIsU0FBUyxPQUFPLGFBQWEsd0JBQXdCLENBQUM7QUFFcEgsY0FBSSxnQkFBZ0IsUUFBUTtBQUMxQixpQkFBSyxnQkFBZ0IsSUFBSSxjQUFjO0FBQUEsVUFDekMsV0FBVyxvQkFBb0IsR0FBRztBQUNoQyxpQkFBSyxTQUFTLE9BQU87QUFBQSxVQUN2QjtBQUFBLFFBQ0Y7QUFPQSxpQkFBUyxXQUFXLFVBQVU7QUFDNUIsZ0JBQU0sY0FBYyxhQUFhLFlBQVksSUFBSSxZQUFZLElBQUk7QUFDakUsZ0JBQU0sV0FBVyxhQUFhLFNBQVMsSUFBSSxZQUFZLElBQUk7QUFFM0QsY0FBSSxDQUFDLFVBQVU7QUFDYixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxpQkFBTyxTQUFTLFNBQVMsT0FBTyxZQUFZLEtBQUs7QUFBQSxRQUNuRDtBQVdBLFlBQUksaUJBQWlCO0FBQUEsVUFDbkIsb0JBQW9CLG9CQUFJLFFBQVE7QUFBQSxVQUNoQyxtQkFBbUIsb0JBQUksUUFBUTtBQUFBLFFBQ2pDO0FBTUEsY0FBTSxjQUFjLE1BQU07QUFDeEIsaUJBQU8sVUFBVSxTQUFTLENBQUM7QUFBQSxRQUM3QjtBQUtBLGNBQU0sZUFBZSxNQUFNLGlCQUFpQixLQUFLLGlCQUFpQixFQUFFLE1BQU07QUFLMUUsY0FBTSxZQUFZLE1BQU0sY0FBYyxLQUFLLGNBQWMsRUFBRSxNQUFNO0FBS2pFLGNBQU0sY0FBYyxNQUFNLGdCQUFnQixLQUFLLGdCQUFnQixFQUFFLE1BQU07QUFNdkUsY0FBTSx1QkFBdUIsQ0FBQUMsaUJBQWU7QUFDMUMsY0FBSUEsYUFBWSxpQkFBaUJBLGFBQVkscUJBQXFCO0FBQ2hFLFlBQUFBLGFBQVksY0FBYyxvQkFBb0IsV0FBV0EsYUFBWSxnQkFBZ0I7QUFBQSxjQUNuRixTQUFTQSxhQUFZO0FBQUEsWUFDdkIsQ0FBQztBQUNELFlBQUFBLGFBQVksc0JBQXNCO0FBQUEsVUFDcEM7QUFBQSxRQUNGO0FBUUEsY0FBTSxvQkFBb0IsQ0FBQyxVQUFVQSxjQUFhLGFBQWEsZ0JBQWdCO0FBQzdFLCtCQUFxQkEsWUFBVztBQUVoQyxjQUFJLENBQUMsWUFBWSxPQUFPO0FBQ3RCLFlBQUFBLGFBQVksaUJBQWlCLE9BQUssZUFBZSxVQUFVLEdBQUcsV0FBVztBQUV6RSxZQUFBQSxhQUFZLGdCQUFnQixZQUFZLHlCQUF5QixTQUFTLFNBQVM7QUFDbkYsWUFBQUEsYUFBWSx5QkFBeUIsWUFBWTtBQUNqRCxZQUFBQSxhQUFZLGNBQWMsaUJBQWlCLFdBQVdBLGFBQVksZ0JBQWdCO0FBQUEsY0FDaEYsU0FBU0EsYUFBWTtBQUFBLFlBQ3ZCLENBQUM7QUFDRCxZQUFBQSxhQUFZLHNCQUFzQjtBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQU9BLGNBQU0sV0FBVyxDQUFDLGFBQWEsT0FBTyxjQUFjO0FBQ2xELGdCQUFNLG9CQUFvQixxQkFBcUI7QUFFL0MsY0FBSSxrQkFBa0IsUUFBUTtBQUM1QixvQkFBUSxRQUFRO0FBRWhCLGdCQUFJLFVBQVUsa0JBQWtCLFFBQVE7QUFDdEMsc0JBQVE7QUFBQSxZQUNWLFdBQVcsVUFBVSxJQUFJO0FBQ3ZCLHNCQUFRLGtCQUFrQixTQUFTO0FBQUEsWUFDckM7QUFFQSxtQkFBTyxrQkFBa0IsT0FBTyxNQUFNO0FBQUEsVUFDeEM7QUFHQSxtQkFBUyxFQUFFLE1BQU07QUFBQSxRQUNuQjtBQUNBLGNBQU0sc0JBQXNCLENBQUMsY0FBYyxXQUFXO0FBQ3RELGNBQU0sMEJBQTBCLENBQUMsYUFBYSxTQUFTO0FBT3ZELGNBQU0saUJBQWlCLENBQUMsVUFBVSxHQUFHLGdCQUFnQjtBQUNuRCxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFFekQsY0FBSSxDQUFDLGFBQWE7QUFDaEI7QUFBQSxVQUNGO0FBTUEsY0FBSSxFQUFFLGVBQWUsRUFBRSxZQUFZLEtBQUs7QUFDdEM7QUFBQSxVQUNGO0FBRUEsY0FBSSxZQUFZLHdCQUF3QjtBQUN0QyxjQUFFLGdCQUFnQjtBQUFBLFVBQ3BCO0FBR0EsY0FBSSxFQUFFLFFBQVEsU0FBUztBQUNyQix3QkFBWSxVQUFVLEdBQUcsV0FBVztBQUFBLFVBQ3RDLFdBQ1MsRUFBRSxRQUFRLE9BQU87QUFDeEIsc0JBQVUsR0FBRyxXQUFXO0FBQUEsVUFDMUIsV0FDUyxDQUFDLEdBQUcscUJBQXFCLEdBQUcsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRztBQUM3RSx5QkFBYSxFQUFFLEdBQUc7QUFBQSxVQUNwQixXQUNTLEVBQUUsUUFBUSxVQUFVO0FBQzNCLHNCQUFVLEdBQUcsYUFBYSxXQUFXO0FBQUEsVUFDdkM7QUFBQSxRQUNGO0FBUUEsY0FBTSxjQUFjLENBQUMsVUFBVSxHQUFHLGdCQUFnQjtBQUVoRCxjQUFJLENBQUMsZUFBZSxZQUFZLGFBQWEsR0FBRztBQUM5QztBQUFBLFVBQ0Y7QUFFQSxjQUFJLEVBQUUsVUFBVSxTQUFTLFNBQVMsS0FBSyxFQUFFLGtCQUFrQixlQUFlLEVBQUUsT0FBTyxjQUFjLFNBQVMsU0FBUyxFQUFFLFdBQVc7QUFDOUgsZ0JBQUksQ0FBQyxZQUFZLE1BQU0sRUFBRSxTQUFTLFlBQVksS0FBSyxHQUFHO0FBQ3BEO0FBQUEsWUFDRjtBQUVBLHlCQUFhO0FBQ2IsY0FBRSxlQUFlO0FBQUEsVUFDbkI7QUFBQSxRQUNGO0FBT0EsY0FBTSxZQUFZLENBQUMsR0FBRyxnQkFBZ0I7QUFDcEMsZ0JBQU0sZ0JBQWdCLEVBQUU7QUFDeEIsZ0JBQU0sb0JBQW9CLHFCQUFxQjtBQUMvQyxjQUFJLFdBQVc7QUFFZixtQkFBUyxJQUFJLEdBQUcsSUFBSSxrQkFBa0IsUUFBUSxLQUFLO0FBQ2pELGdCQUFJLGtCQUFrQixrQkFBa0IsSUFBSTtBQUMxQyx5QkFBVztBQUNYO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFHQSxjQUFJLENBQUMsRUFBRSxVQUFVO0FBQ2YscUJBQVMsYUFBYSxVQUFVLENBQUM7QUFBQSxVQUNuQyxPQUNLO0FBQ0gscUJBQVMsYUFBYSxVQUFVLEVBQUU7QUFBQSxVQUNwQztBQUVBLFlBQUUsZ0JBQWdCO0FBQ2xCLFlBQUUsZUFBZTtBQUFBLFFBQ25CO0FBTUEsY0FBTSxlQUFlLFNBQU87QUFDMUIsZ0JBQU0sZ0JBQWdCLGlCQUFpQjtBQUN2QyxnQkFBTSxhQUFhLGNBQWM7QUFDakMsZ0JBQU0sZUFBZSxnQkFBZ0I7QUFFckMsY0FBSSxTQUFTLHlCQUF5QixlQUFlLENBQUMsQ0FBQyxlQUFlLFlBQVksWUFBWSxFQUFFLFNBQVMsU0FBUyxhQUFhLEdBQUc7QUFDaEk7QUFBQSxVQUNGO0FBRUEsZ0JBQU0sVUFBVSxvQkFBb0IsU0FBUyxHQUFHLElBQUksdUJBQXVCO0FBQzNFLGNBQUksZ0JBQWdCLFNBQVM7QUFFN0IsbUJBQVMsSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFLFNBQVMsUUFBUSxLQUFLO0FBQ3JELDRCQUFnQixjQUFjO0FBRTlCLGdCQUFJLENBQUMsZUFBZTtBQUNsQjtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSx5QkFBeUIscUJBQXFCLFVBQVUsYUFBYSxHQUFHO0FBQzFFO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFFQSxjQUFJLHlCQUF5QixtQkFBbUI7QUFDOUMsMEJBQWMsTUFBTTtBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQVFBLGNBQU0sWUFBWSxDQUFDLEdBQUcsYUFBYSxnQkFBZ0I7QUFDakQsY0FBSSxlQUFlLFlBQVksY0FBYyxHQUFHO0FBQzlDLGNBQUUsZUFBZTtBQUNqQix3QkFBWSxjQUFjLEdBQUc7QUFBQSxVQUMvQjtBQUFBLFFBQ0Y7QUFNQSxpQkFBUyx5QkFBeUIsVUFBVSxXQUFXLGFBQWEsVUFBVTtBQUM1RSxjQUFJLFFBQVEsR0FBRztBQUNiLHNDQUEwQixVQUFVLFFBQVE7QUFBQSxVQUM5QyxPQUFPO0FBQ0wsaUNBQXFCLFdBQVcsRUFBRSxLQUFLLE1BQU0sMEJBQTBCLFVBQVUsUUFBUSxDQUFDO0FBQzFGLGlDQUFxQixXQUFXO0FBQUEsVUFDbEM7QUFFQSxnQkFBTSxXQUFXLGlDQUFpQyxLQUFLLFVBQVUsU0FBUztBQUcxRSxjQUFJLFVBQVU7QUFDWixzQkFBVSxhQUFhLFNBQVMseUJBQXlCO0FBQ3pELHNCQUFVLGdCQUFnQixPQUFPO0FBQ2pDLHNCQUFVLFlBQVk7QUFBQSxVQUN4QixPQUFPO0FBQ0wsc0JBQVUsT0FBTztBQUFBLFVBQ25CO0FBRUEsY0FBSSxRQUFRLEdBQUc7QUFDYiwwQkFBYztBQUNkLHVCQUFXO0FBQ1gsNEJBQWdCO0FBQUEsVUFDbEI7QUFFQSw0QkFBa0I7QUFBQSxRQUNwQjtBQUVBLGlCQUFTLG9CQUFvQjtBQUMzQixzQkFBWSxDQUFDLFNBQVMsaUJBQWlCLFNBQVMsSUFBSSxHQUFHLENBQUMsWUFBWSxPQUFPLFlBQVksZ0JBQWdCLFlBQVksZ0JBQWdCLFlBQVksY0FBYyxDQUFDO0FBQUEsUUFDaEs7QUFFQSxpQkFBUyxNQUFNLGNBQWM7QUFDM0IseUJBQWUsb0JBQW9CLFlBQVk7QUFDL0MsZ0JBQU0scUJBQXFCLGVBQWUsbUJBQW1CLElBQUksSUFBSTtBQUNyRSxnQkFBTSxXQUFXLGtCQUFrQixJQUFJO0FBRXZDLGNBQUksS0FBSyxrQkFBa0IsR0FBRztBQUU1QixnQkFBSSxDQUFDLGFBQWEsYUFBYTtBQUM3QixvQ0FBc0IsSUFBSTtBQUMxQixpQ0FBbUIsWUFBWTtBQUFBLFlBQ2pDO0FBQUEsVUFDRixXQUFXLFVBQVU7QUFFbkIsK0JBQW1CLFlBQVk7QUFBQSxVQUNqQztBQUFBLFFBQ0Y7QUFDQSxpQkFBUyxvQkFBb0I7QUFDM0IsaUJBQU8sQ0FBQyxDQUFDLGFBQWEsZ0JBQWdCLElBQUksSUFBSTtBQUFBLFFBQ2hEO0FBRUEsY0FBTSxvQkFBb0IsY0FBWTtBQUNwQyxnQkFBTSxRQUFRLFNBQVM7QUFFdkIsY0FBSSxDQUFDLE9BQU87QUFDVixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFFekQsY0FBSSxDQUFDLGVBQWUsU0FBUyxPQUFPLFlBQVksVUFBVSxLQUFLLEdBQUc7QUFDaEUsbUJBQU87QUFBQSxVQUNUO0FBRUEsc0JBQVksT0FBTyxZQUFZLFVBQVUsS0FBSztBQUM5QyxtQkFBUyxPQUFPLFlBQVksVUFBVSxLQUFLO0FBQzNDLGdCQUFNLFdBQVcsYUFBYTtBQUM5QixzQkFBWSxVQUFVLFlBQVksVUFBVSxRQUFRO0FBQ3BELG1CQUFTLFVBQVUsWUFBWSxVQUFVLFFBQVE7QUFDakQsK0JBQXFCLFVBQVUsT0FBTyxXQUFXO0FBQ2pELGlCQUFPO0FBQUEsUUFDVDtBQUVBLGlCQUFTLGNBQWNDLFFBQU87QUFDNUIsZ0JBQU1DLGlCQUFnQixlQUFlLGtCQUFrQixJQUFJLElBQUk7QUFDL0QsZ0NBQXNCLElBQUk7QUFFMUIsY0FBSUEsZ0JBQWU7QUFFakIsWUFBQUEsZUFBY0QsTUFBSztBQUFBLFVBQ3JCO0FBQUEsUUFDRjtBQUNBLGNBQU0sd0JBQXdCLGNBQVk7QUFDeEMsY0FBSSxTQUFTLGtCQUFrQixHQUFHO0FBQ2hDLHlCQUFhLGdCQUFnQixPQUFPLFFBQVE7QUFFNUMsZ0JBQUksQ0FBQyxhQUFhLFlBQVksSUFBSSxRQUFRLEdBQUc7QUFDM0MsdUJBQVMsU0FBUztBQUFBLFlBQ3BCO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLHNCQUFzQixrQkFBZ0I7QUFFMUMsY0FBSSxPQUFPLGlCQUFpQixhQUFhO0FBQ3ZDLG1CQUFPO0FBQUEsY0FDTCxhQUFhO0FBQUEsY0FDYixVQUFVO0FBQUEsY0FDVixhQUFhO0FBQUEsWUFDZjtBQUFBLFVBQ0Y7QUFFQSxpQkFBTyxPQUFPLE9BQU87QUFBQSxZQUNuQixhQUFhO0FBQUEsWUFDYixVQUFVO0FBQUEsWUFDVixhQUFhO0FBQUEsVUFDZixHQUFHLFlBQVk7QUFBQSxRQUNqQjtBQUVBLGNBQU0sdUJBQXVCLENBQUMsVUFBVSxPQUFPLGdCQUFnQjtBQUM3RCxnQkFBTSxZQUFZLGFBQWE7QUFFL0IsZ0JBQU0sdUJBQXVCLHFCQUFxQixnQkFBZ0IsS0FBSztBQUV2RSxjQUFJLE9BQU8sWUFBWSxjQUFjLFlBQVk7QUFDL0Msd0JBQVksVUFBVSxLQUFLO0FBQUEsVUFDN0I7QUFFQSxjQUFJLHNCQUFzQjtBQUN4Qix5QkFBYSxVQUFVLE9BQU8sV0FBVyxZQUFZLGFBQWEsWUFBWSxRQUFRO0FBQUEsVUFDeEYsT0FBTztBQUVMLHFDQUF5QixVQUFVLFdBQVcsWUFBWSxhQUFhLFlBQVksUUFBUTtBQUFBLFVBQzdGO0FBQUEsUUFDRjtBQUVBLGNBQU0sZUFBZSxDQUFDLFVBQVUsT0FBTyxXQUFXLGFBQWEsYUFBYTtBQUMxRSxzQkFBWSxpQ0FBaUMseUJBQXlCLEtBQUssTUFBTSxVQUFVLFdBQVcsYUFBYSxRQUFRO0FBQzNILGdCQUFNLGlCQUFpQixtQkFBbUIsU0FBVSxHQUFHO0FBQ3JELGdCQUFJLEVBQUUsV0FBVyxPQUFPO0FBQ3RCLDBCQUFZLCtCQUErQjtBQUMzQyxxQkFBTyxZQUFZO0FBQUEsWUFDckI7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBRUEsY0FBTSw0QkFBNEIsQ0FBQyxVQUFVLGFBQWE7QUFDeEQscUJBQVcsTUFBTTtBQUNmLGdCQUFJLE9BQU8sYUFBYSxZQUFZO0FBQ2xDLHVCQUFTLEtBQUssU0FBUyxNQUFNLEVBQUU7QUFBQSxZQUNqQztBQUVBLHFCQUFTLFNBQVM7QUFBQSxVQUNwQixDQUFDO0FBQUEsUUFDSDtBQUVBLGlCQUFTLG1CQUFtQixVQUFVLFNBQVMsVUFBVTtBQUN2RCxnQkFBTSxXQUFXLGFBQWEsU0FBUyxJQUFJLFFBQVE7QUFDbkQsa0JBQVEsUUFBUSxZQUFVO0FBQ3hCLHFCQUFTLFFBQVEsV0FBVztBQUFBLFVBQzlCLENBQUM7QUFBQSxRQUNIO0FBRUEsaUJBQVMsaUJBQWlCLE9BQU8sVUFBVTtBQUN6QyxjQUFJLENBQUMsT0FBTztBQUNWLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksTUFBTSxTQUFTLFNBQVM7QUFDMUIsa0JBQU0sa0JBQWtCLE1BQU0sV0FBVztBQUN6QyxrQkFBTSxTQUFTLGdCQUFnQixpQkFBaUIsT0FBTztBQUV2RCxxQkFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSztBQUN0QyxxQkFBTyxHQUFHLFdBQVc7QUFBQSxZQUN2QjtBQUFBLFVBQ0YsT0FBTztBQUNMLGtCQUFNLFdBQVc7QUFBQSxVQUNuQjtBQUFBLFFBQ0Y7QUFFQSxpQkFBUyxnQkFBZ0I7QUFDdkIsNkJBQW1CLE1BQU0sQ0FBQyxpQkFBaUIsY0FBYyxjQUFjLEdBQUcsS0FBSztBQUFBLFFBQ2pGO0FBQ0EsaUJBQVMsaUJBQWlCO0FBQ3hCLDZCQUFtQixNQUFNLENBQUMsaUJBQWlCLGNBQWMsY0FBYyxHQUFHLElBQUk7QUFBQSxRQUNoRjtBQUNBLGlCQUFTLGNBQWM7QUFDckIsaUJBQU8saUJBQWlCLEtBQUssU0FBUyxHQUFHLEtBQUs7QUFBQSxRQUNoRDtBQUNBLGlCQUFTLGVBQWU7QUFDdEIsaUJBQU8saUJBQWlCLEtBQUssU0FBUyxHQUFHLElBQUk7QUFBQSxRQUMvQztBQUVBLGlCQUFTLHNCQUFzQkEsUUFBTztBQUNwQyxnQkFBTSxXQUFXLGFBQWEsU0FBUyxJQUFJLElBQUk7QUFDL0MsZ0JBQU0sU0FBUyxhQUFhLFlBQVksSUFBSSxJQUFJO0FBQ2hELHVCQUFhLFNBQVMsbUJBQW1CQSxNQUFLO0FBQzlDLG1CQUFTLGtCQUFrQixZQUFZLFlBQVk7QUFFbkQsY0FBSSxPQUFPLGVBQWUsT0FBTyxZQUFZLG1CQUFtQjtBQUM5RCxxQkFBUyxTQUFTLG1CQUFtQixPQUFPLFlBQVksaUJBQWlCO0FBQUEsVUFDM0U7QUFFQSxlQUFLLFNBQVMsaUJBQWlCO0FBQy9CLGdCQUFNLFFBQVEsS0FBSyxTQUFTO0FBRTVCLGNBQUksT0FBTztBQUNULGtCQUFNLGFBQWEsZ0JBQWdCLElBQUk7QUFDdkMsa0JBQU0sYUFBYSxvQkFBb0IsWUFBWSxxQkFBcUI7QUFDeEUsdUJBQVcsS0FBSztBQUNoQixxQkFBUyxPQUFPLFlBQVksVUFBVTtBQUFBLFVBQ3hDO0FBQUEsUUFDRjtBQUVBLGlCQUFTLDJCQUEyQjtBQUNsQyxnQkFBTSxXQUFXLGFBQWEsU0FBUyxJQUFJLElBQUk7QUFFL0MsY0FBSSxTQUFTLG1CQUFtQjtBQUM5QixpQkFBSyxTQUFTLGlCQUFpQjtBQUFBLFVBQ2pDO0FBRUEsZ0JBQU0sUUFBUSxLQUFLLFNBQVM7QUFFNUIsY0FBSSxPQUFPO0FBQ1Qsa0JBQU0sZ0JBQWdCLGNBQWM7QUFDcEMsa0JBQU0sZ0JBQWdCLGtCQUFrQjtBQUN4Qyx3QkFBWSxPQUFPLFlBQVksVUFBVTtBQUFBLFVBQzNDO0FBQUEsUUFDRjtBQUVBLGlCQUFTLHFCQUFxQjtBQUM1QixnQkFBTSxXQUFXLGFBQWEsU0FBUyxJQUFJLElBQUk7QUFDL0MsaUJBQU8sU0FBUztBQUFBLFFBQ2xCO0FBTUEsaUJBQVMsT0FBTyxRQUFRO0FBQ3RCLGdCQUFNLFFBQVEsU0FBUztBQUN2QixnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLElBQUk7QUFFckQsY0FBSSxDQUFDLFNBQVMsU0FBUyxPQUFPLFlBQVksVUFBVSxLQUFLLEdBQUc7QUFDMUQsbUJBQU8sS0FBSyw0SUFBNEk7QUFBQSxVQUMxSjtBQUVBLGdCQUFNLHVCQUF1QixrQkFBa0IsTUFBTTtBQUNyRCxnQkFBTSxnQkFBZ0IsT0FBTyxPQUFPLENBQUMsR0FBRyxhQUFhLG9CQUFvQjtBQUN6RSxpQkFBTyxNQUFNLGFBQWE7QUFDMUIsdUJBQWEsWUFBWSxJQUFJLE1BQU0sYUFBYTtBQUNoRCxpQkFBTyxpQkFBaUIsTUFBTTtBQUFBLFlBQzVCLFFBQVE7QUFBQSxjQUNOLE9BQU8sT0FBTyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsTUFBTTtBQUFBLGNBQzVDLFVBQVU7QUFBQSxjQUNWLFlBQVk7QUFBQSxZQUNkO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUVBLGNBQU0sb0JBQW9CLFlBQVU7QUFDbEMsZ0JBQU0sdUJBQXVCLENBQUM7QUFDOUIsaUJBQU8sS0FBSyxNQUFNLEVBQUUsUUFBUSxXQUFTO0FBQ25DLGdCQUFJLHFCQUFxQixLQUFLLEdBQUc7QUFDL0IsbUNBQXFCLFNBQVMsT0FBTztBQUFBLFlBQ3ZDLE9BQU87QUFDTCxtQkFBSyxnQ0FBZ0MsT0FBTyxLQUFLLENBQUM7QUFBQSxZQUNwRDtBQUFBLFVBQ0YsQ0FBQztBQUNELGlCQUFPO0FBQUEsUUFDVDtBQUVBLGlCQUFTLFdBQVc7QUFDbEIsZ0JBQU0sV0FBVyxhQUFhLFNBQVMsSUFBSSxJQUFJO0FBQy9DLGdCQUFNLGNBQWMsYUFBYSxZQUFZLElBQUksSUFBSTtBQUVyRCxjQUFJLENBQUMsYUFBYTtBQUNoQiw0QkFBZ0IsSUFBSTtBQUVwQjtBQUFBLFVBQ0Y7QUFHQSxjQUFJLFNBQVMsU0FBUyxZQUFZLGdDQUFnQztBQUNoRSx3QkFBWSwrQkFBK0I7QUFDM0MsbUJBQU8sWUFBWTtBQUFBLFVBQ3JCO0FBRUEsY0FBSSxPQUFPLFlBQVksZUFBZSxZQUFZO0FBQ2hELHdCQUFZLFdBQVc7QUFBQSxVQUN6QjtBQUVBLHNCQUFZLElBQUk7QUFBQSxRQUNsQjtBQUtBLGNBQU0sY0FBYyxjQUFZO0FBQzlCLDBCQUFnQixRQUFRO0FBR3hCLGlCQUFPLFNBQVM7QUFFaEIsaUJBQU8sWUFBWTtBQUNuQixpQkFBTyxZQUFZO0FBRW5CLGlCQUFPLFlBQVk7QUFBQSxRQUNyQjtBQU1BLGNBQU0sa0JBQWtCLGNBQVk7QUFHbEMsY0FBSSxTQUFTLGtCQUFrQixHQUFHO0FBQ2hDLDBCQUFjLGNBQWMsUUFBUTtBQUNwQyx5QkFBYSxnQkFBZ0IsSUFBSSxVQUFVLElBQUk7QUFBQSxVQUNqRCxPQUFPO0FBQ0wsMEJBQWMsZ0JBQWdCLFFBQVE7QUFDdEMsMEJBQWMsY0FBYyxRQUFRO0FBQUEsVUFDdEM7QUFBQSxRQUNGO0FBT0EsY0FBTSxnQkFBZ0IsQ0FBQyxLQUFLLGFBQWE7QUFDdkMscUJBQVcsS0FBSyxLQUFLO0FBQ25CLGdCQUFJLEdBQUcsT0FBTyxRQUFRO0FBQUEsVUFDeEI7QUFBQSxRQUNGO0FBSUEsWUFBSSxrQkFBK0IsdUJBQU8sT0FBTztBQUFBLFVBQy9DO0FBQUEsVUFDQSxnQkFBZ0I7QUFBQSxVQUNoQixVQUFVO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0EsWUFBWTtBQUFBLFVBQ1osWUFBWTtBQUFBLFVBQ1osWUFBWTtBQUFBLFVBQ1o7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQSx3QkFBd0I7QUFBQSxVQUN4QixrQkFBa0I7QUFBQSxVQUNsQjtBQUFBLFVBQ0E7QUFBQSxRQUNGLENBQUM7QUFNRCxjQUFNLDJCQUEyQixjQUFZO0FBQzNDLGdCQUFNLGNBQWMsYUFBYSxZQUFZLElBQUksUUFBUTtBQUN6RCxtQkFBUyxlQUFlO0FBRXhCLGNBQUksWUFBWSxPQUFPO0FBQ3JCLHlDQUE2QixVQUFVLFNBQVM7QUFBQSxVQUNsRCxPQUFPO0FBQ0wsWUFBQUUsU0FBUSxVQUFVLElBQUk7QUFBQSxVQUN4QjtBQUFBLFFBQ0Y7QUFLQSxjQUFNLHdCQUF3QixjQUFZO0FBQ3hDLGdCQUFNLGNBQWMsYUFBYSxZQUFZLElBQUksUUFBUTtBQUN6RCxtQkFBUyxlQUFlO0FBRXhCLGNBQUksWUFBWSx3QkFBd0I7QUFDdEMseUNBQTZCLFVBQVUsTUFBTTtBQUFBLFVBQy9DLE9BQU87QUFDTCxpQkFBSyxVQUFVLEtBQUs7QUFBQSxVQUN0QjtBQUFBLFFBQ0Y7QUFNQSxjQUFNLDBCQUEwQixDQUFDLFVBQVUsZ0JBQWdCO0FBQ3pELG1CQUFTLGVBQWU7QUFDeEIsc0JBQVksY0FBYyxNQUFNO0FBQUEsUUFDbEM7QUFNQSxjQUFNLCtCQUErQixDQUFDLFVBQVUsU0FBUztBQUN2RCxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFFekQsY0FBSSxDQUFDLFlBQVksT0FBTztBQUN0QixrQkFBTSwwRUFBNEUsT0FBTyxzQkFBc0IsSUFBSSxDQUFDLENBQUM7QUFDckg7QUFBQSxVQUNGO0FBRUEsZ0JBQU0sYUFBYSxjQUFjLFVBQVUsV0FBVztBQUV0RCxjQUFJLFlBQVksZ0JBQWdCO0FBQzlCLGlDQUFxQixVQUFVLFlBQVksSUFBSTtBQUFBLFVBQ2pELFdBQVcsQ0FBQyxTQUFTLFNBQVMsRUFBRSxjQUFjLEdBQUc7QUFDL0MscUJBQVMsY0FBYztBQUN2QixxQkFBUyxzQkFBc0IsWUFBWSxpQkFBaUI7QUFBQSxVQUM5RCxXQUFXLFNBQVMsUUFBUTtBQUMxQixpQkFBSyxVQUFVLFVBQVU7QUFBQSxVQUMzQixPQUFPO0FBQ0wsWUFBQUEsU0FBUSxVQUFVLFVBQVU7QUFBQSxVQUM5QjtBQUFBLFFBQ0Y7QUFRQSxjQUFNLHVCQUF1QixDQUFDLFVBQVUsWUFBWSxTQUFTO0FBQzNELGdCQUFNLGNBQWMsYUFBYSxZQUFZLElBQUksUUFBUTtBQUN6RCxtQkFBUyxhQUFhO0FBQ3RCLGdCQUFNLG9CQUFvQixRQUFRLFFBQVEsRUFBRSxLQUFLLE1BQU0sVUFBVSxZQUFZLGVBQWUsWUFBWSxZQUFZLGlCQUFpQixDQUFDLENBQUM7QUFDdkksNEJBQWtCLEtBQUssdUJBQXFCO0FBQzFDLHFCQUFTLGNBQWM7QUFDdkIscUJBQVMsWUFBWTtBQUVyQixnQkFBSSxtQkFBbUI7QUFDckIsdUJBQVMsc0JBQXNCLGlCQUFpQjtBQUFBLFlBQ2xELFdBQVcsU0FBUyxRQUFRO0FBQzFCLG1CQUFLLFVBQVUsVUFBVTtBQUFBLFlBQzNCLE9BQU87QUFDTCxjQUFBQSxTQUFRLFVBQVUsVUFBVTtBQUFBLFlBQzlCO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQU9BLGNBQU0sT0FBTyxDQUFDLFVBQVUsVUFBVTtBQUNoQyxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFlBQVksTUFBUztBQUV0RSxjQUFJLFlBQVksa0JBQWtCO0FBQ2hDLHdCQUFZLGNBQWMsQ0FBQztBQUFBLFVBQzdCO0FBRUEsY0FBSSxZQUFZLFNBQVM7QUFDdkIseUJBQWEsZ0JBQWdCLElBQUksWUFBWSxRQUFXLElBQUk7QUFFNUQsa0JBQU0saUJBQWlCLFFBQVEsUUFBUSxFQUFFLEtBQUssTUFBTSxVQUFVLFlBQVksUUFBUSxPQUFPLFlBQVksaUJBQWlCLENBQUMsQ0FBQztBQUN4SCwyQkFBZSxLQUFLLGtCQUFnQjtBQUNsQyxrQkFBSSxpQkFBaUIsT0FBTztBQUMxQix5QkFBUyxZQUFZO0FBQ3JCLHNDQUFzQixRQUFRO0FBQUEsY0FDaEMsT0FBTztBQUNMLHlCQUFTLE1BQU07QUFBQSxrQkFDYixVQUFVO0FBQUEsa0JBQ1YsT0FBTyxPQUFPLGlCQUFpQixjQUFjLFFBQVE7QUFBQSxnQkFDdkQsQ0FBQztBQUFBLGNBQ0g7QUFBQSxZQUNGLENBQUMsRUFBRSxNQUFNLGNBQVksV0FBVyxZQUFZLFFBQVcsUUFBUSxDQUFDO0FBQUEsVUFDbEUsT0FBTztBQUNMLHFCQUFTLE1BQU07QUFBQSxjQUNiLFVBQVU7QUFBQSxjQUNWO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSDtBQUFBLFFBQ0Y7QUFPQSxjQUFNLGNBQWMsQ0FBQyxVQUFVLFVBQVU7QUFDdkMsbUJBQVMsTUFBTTtBQUFBLFlBQ2IsYUFBYTtBQUFBLFlBQ2I7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBUUEsY0FBTSxhQUFhLENBQUMsVUFBVSxhQUFhO0FBRXpDLG1CQUFTLGNBQWMsUUFBUTtBQUFBLFFBQ2pDO0FBUUEsY0FBTUEsV0FBVSxDQUFDLFVBQVUsVUFBVTtBQUNuQyxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFlBQVksTUFBUztBQUV0RSxjQUFJLFlBQVkscUJBQXFCO0FBQ25DLHdCQUFZO0FBQUEsVUFDZDtBQUVBLGNBQUksWUFBWSxZQUFZO0FBQzFCLHFCQUFTLHVCQUF1QjtBQUNoQyx5QkFBYSxnQkFBZ0IsSUFBSSxZQUFZLFFBQVcsSUFBSTtBQUU1RCxrQkFBTSxvQkFBb0IsUUFBUSxRQUFRLEVBQUUsS0FBSyxNQUFNLFVBQVUsWUFBWSxXQUFXLE9BQU8sWUFBWSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlILDhCQUFrQixLQUFLLHFCQUFtQjtBQUN4QyxrQkFBSSxVQUFVLHFCQUFxQixDQUFDLEtBQUssb0JBQW9CLE9BQU87QUFDbEUseUJBQVMsWUFBWTtBQUNyQixzQ0FBc0IsUUFBUTtBQUFBLGNBQ2hDLE9BQU87QUFDTCw0QkFBWSxVQUFVLE9BQU8sb0JBQW9CLGNBQWMsUUFBUSxlQUFlO0FBQUEsY0FDeEY7QUFBQSxZQUNGLENBQUMsRUFBRSxNQUFNLGNBQVksV0FBVyxZQUFZLFFBQVcsUUFBUSxDQUFDO0FBQUEsVUFDbEUsT0FBTztBQUNMLHdCQUFZLFVBQVUsS0FBSztBQUFBLFVBQzdCO0FBQUEsUUFDRjtBQUVBLGNBQU0sbUJBQW1CLENBQUMsVUFBVSxVQUFVLGdCQUFnQjtBQUM1RCxnQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFFekQsY0FBSSxZQUFZLE9BQU87QUFDckIsNkJBQWlCLFVBQVUsVUFBVSxXQUFXO0FBQUEsVUFDbEQsT0FBTztBQUdMLGlDQUFxQixRQUFRO0FBRTdCLHFDQUF5QixRQUFRO0FBQ2pDLDZCQUFpQixVQUFVLFVBQVUsV0FBVztBQUFBLFVBQ2xEO0FBQUEsUUFDRjtBQUVBLGNBQU0sbUJBQW1CLENBQUMsVUFBVSxVQUFVLGdCQUFnQjtBQUU1RCxtQkFBUyxNQUFNLFVBQVUsTUFBTTtBQUM3QixrQkFBTSxjQUFjLGFBQWEsWUFBWSxJQUFJLFFBQVE7QUFFekQsZ0JBQUksZ0JBQWdCLGlCQUFpQixXQUFXLEtBQUssWUFBWSxTQUFTLFlBQVksUUFBUTtBQUM1RjtBQUFBLFlBQ0Y7QUFFQSx3QkFBWSxjQUFjLEtBQUs7QUFBQSxVQUNqQztBQUFBLFFBQ0Y7QUFPQSxjQUFNLG1CQUFtQixpQkFBZTtBQUN0QyxpQkFBTyxZQUFZLHFCQUFxQixZQUFZLGtCQUFrQixZQUFZLG9CQUFvQixZQUFZO0FBQUEsUUFDcEg7QUFFQSxZQUFJLHFCQUFxQjtBQUV6QixjQUFNLHVCQUF1QixjQUFZO0FBQ3ZDLG1CQUFTLE1BQU0sY0FBYyxNQUFNO0FBQ2pDLHFCQUFTLFVBQVUsWUFBWSxTQUFVLEdBQUc7QUFDMUMsdUJBQVMsVUFBVSxZQUFZO0FBRy9CLGtCQUFJLEVBQUUsV0FBVyxTQUFTLFdBQVc7QUFDbkMscUNBQXFCO0FBQUEsY0FDdkI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLDJCQUEyQixjQUFZO0FBQzNDLG1CQUFTLFVBQVUsY0FBYyxNQUFNO0FBQ3JDLHFCQUFTLE1BQU0sWUFBWSxTQUFVLEdBQUc7QUFDdEMsdUJBQVMsTUFBTSxZQUFZO0FBRTNCLGtCQUFJLEVBQUUsV0FBVyxTQUFTLFNBQVMsU0FBUyxNQUFNLFNBQVMsRUFBRSxNQUFNLEdBQUc7QUFDcEUscUNBQXFCO0FBQUEsY0FDdkI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLG1CQUFtQixDQUFDLFVBQVUsVUFBVSxnQkFBZ0I7QUFDNUQsbUJBQVMsVUFBVSxVQUFVLE9BQUs7QUFDaEMsa0JBQU0sY0FBYyxhQUFhLFlBQVksSUFBSSxRQUFRO0FBRXpELGdCQUFJLG9CQUFvQjtBQUN0QixtQ0FBcUI7QUFDckI7QUFBQSxZQUNGO0FBRUEsZ0JBQUksRUFBRSxXQUFXLFNBQVMsYUFBYSxlQUFlLFlBQVksaUJBQWlCLEdBQUc7QUFDcEYsMEJBQVksY0FBYyxRQUFRO0FBQUEsWUFDcEM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUVBLGNBQU0sa0JBQWtCLFVBQVEsT0FBTyxTQUFTLFlBQVksS0FBSztBQUVqRSxjQUFNLFlBQVksVUFBUSxnQkFBZ0IsV0FBVyxnQkFBZ0IsSUFBSTtBQUV6RSxjQUFNLGVBQWUsVUFBUTtBQUMzQixnQkFBTSxTQUFTLENBQUM7QUFFaEIsY0FBSSxPQUFPLEtBQUssT0FBTyxZQUFZLENBQUMsVUFBVSxLQUFLLEVBQUUsR0FBRztBQUN0RCxtQkFBTyxPQUFPLFFBQVEsS0FBSyxFQUFFO0FBQUEsVUFDL0IsT0FBTztBQUNMLGFBQUMsU0FBUyxRQUFRLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxVQUFVO0FBQ2pELG9CQUFNLE1BQU0sS0FBSztBQUVqQixrQkFBSSxPQUFPLFFBQVEsWUFBWSxVQUFVLEdBQUcsR0FBRztBQUM3Qyx1QkFBTyxRQUFRO0FBQUEsY0FDakIsV0FBVyxRQUFRLFFBQVc7QUFDNUIsc0JBQU0sc0JBQXNCLE9BQU8sTUFBTSx3Q0FBNEMsRUFBRSxPQUFPLE9BQU8sR0FBRyxDQUFDO0FBQUEsY0FDM0c7QUFBQSxZQUNGLENBQUM7QUFBQSxVQUNIO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBRUEsaUJBQVMsT0FBTztBQUNkLGdCQUFNSixRQUFPO0FBRWIsbUJBQVMsT0FBTyxVQUFVLFFBQVEsT0FBTyxJQUFJLE1BQU0sSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLE1BQU0sUUFBUTtBQUN2RixpQkFBSyxRQUFRLFVBQVU7QUFBQSxVQUN6QjtBQUVBLGlCQUFPLElBQUlBLE1BQUssR0FBRyxJQUFJO0FBQUEsUUFDekI7QUFvQkEsaUJBQVMsTUFBTSxhQUFhO0FBQzFCLGdCQUFNLGtCQUFrQixLQUFLO0FBQUEsWUFDM0IsTUFBTSxRQUFRLHFCQUFxQjtBQUNqQyxxQkFBTyxNQUFNLE1BQU0sUUFBUSxPQUFPLE9BQU8sQ0FBQyxHQUFHLGFBQWEsbUJBQW1CLENBQUM7QUFBQSxZQUNoRjtBQUFBLFVBRUY7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFPQSxjQUFNLGVBQWUsTUFBTTtBQUN6QixpQkFBTyxZQUFZLFdBQVcsWUFBWSxRQUFRLGFBQWE7QUFBQSxRQUNqRTtBQU1BLGNBQU0sWUFBWSxNQUFNO0FBQ3RCLGNBQUksWUFBWSxTQUFTO0FBQ3ZCLGlDQUFxQjtBQUNyQixtQkFBTyxZQUFZLFFBQVEsS0FBSztBQUFBLFVBQ2xDO0FBQUEsUUFDRjtBQU1BLGNBQU0sY0FBYyxNQUFNO0FBQ3hCLGNBQUksWUFBWSxTQUFTO0FBQ3ZCLGtCQUFNLFlBQVksWUFBWSxRQUFRLE1BQU07QUFDNUMsb0NBQXdCLFNBQVM7QUFDakMsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQU1BLGNBQU0sY0FBYyxNQUFNO0FBQ3hCLGdCQUFNLFFBQVEsWUFBWTtBQUMxQixpQkFBTyxVQUFVLE1BQU0sVUFBVSxVQUFVLElBQUksWUFBWTtBQUFBLFFBQzdEO0FBTUEsY0FBTSxnQkFBZ0IsT0FBSztBQUN6QixjQUFJLFlBQVksU0FBUztBQUN2QixrQkFBTSxZQUFZLFlBQVksUUFBUSxTQUFTLENBQUM7QUFDaEQsb0NBQXdCLFdBQVcsSUFBSTtBQUN2QyxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBT0EsY0FBTSxpQkFBaUIsTUFBTTtBQUMzQixpQkFBTyxZQUFZLFdBQVcsWUFBWSxRQUFRLFVBQVU7QUFBQSxRQUM5RDtBQUVBLFlBQUkseUJBQXlCO0FBQzdCLGNBQU0sZ0JBQWdCLENBQUM7QUFDdkIsaUJBQVMsbUJBQW1CO0FBQzFCLGNBQUksT0FBTyxVQUFVLFNBQVMsS0FBSyxVQUFVLE9BQU8sU0FBWSxVQUFVLEtBQUs7QUFDL0Usd0JBQWMsUUFBUTtBQUV0QixjQUFJLENBQUMsd0JBQXdCO0FBQzNCLHFCQUFTLEtBQUssaUJBQWlCLFNBQVMsaUJBQWlCO0FBQ3pELHFDQUF5QjtBQUFBLFVBQzNCO0FBQUEsUUFDRjtBQUVBLGNBQU0sb0JBQW9CLFdBQVM7QUFDakMsbUJBQVMsS0FBSyxNQUFNLFFBQVEsTUFBTSxPQUFPLFVBQVUsS0FBSyxHQUFHLFlBQVk7QUFDckUsdUJBQVcsUUFBUSxlQUFlO0FBQ2hDLG9CQUFNLFdBQVcsR0FBRyxhQUFhLElBQUk7QUFFckMsa0JBQUksVUFBVTtBQUNaLDhCQUFjLE1BQU0sS0FBSztBQUFBLGtCQUN2QjtBQUFBLGdCQUNGLENBQUM7QUFDRDtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFJQSxZQUFJLGdCQUE2Qix1QkFBTyxPQUFPO0FBQUEsVUFDN0M7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLFdBQVc7QUFBQSxVQUNYO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLGVBQWU7QUFBQSxVQUNmO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRixDQUFDO0FBRUQsWUFBSTtBQUVKLGNBQU0sV0FBVztBQUFBLFVBQ2YsY0FBYztBQUVaLGdCQUFJLE9BQU8sV0FBVyxhQUFhO0FBQ2pDO0FBQUEsWUFDRjtBQUVBLDhCQUFrQjtBQUVsQixxQkFBUyxPQUFPLFVBQVUsUUFBUSxPQUFPLElBQUksTUFBTSxJQUFJLEdBQUcsT0FBTyxHQUFHLE9BQU8sTUFBTSxRQUFRO0FBQ3ZGLG1CQUFLLFFBQVEsVUFBVTtBQUFBLFlBQ3pCO0FBRUEsa0JBQU0sY0FBYyxPQUFPLE9BQU8sS0FBSyxZQUFZLGFBQWEsSUFBSSxDQUFDO0FBQ3JFLG1CQUFPLGlCQUFpQixNQUFNO0FBQUEsY0FDNUIsUUFBUTtBQUFBLGdCQUNOLE9BQU87QUFBQSxnQkFDUCxVQUFVO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGNBQWM7QUFBQSxjQUNoQjtBQUFBLFlBQ0YsQ0FBQztBQUVELGtCQUFNLFVBQVUsZ0JBQWdCLE1BQU0sZ0JBQWdCLE1BQU07QUFFNUQseUJBQWEsUUFBUSxJQUFJLE1BQU0sT0FBTztBQUFBLFVBQ3hDO0FBQUEsVUFFQSxNQUFNLFlBQVk7QUFDaEIsZ0JBQUksY0FBYyxVQUFVLFNBQVMsS0FBSyxVQUFVLE9BQU8sU0FBWSxVQUFVLEtBQUssQ0FBQztBQUN2RixrQ0FBc0IsT0FBTyxPQUFPLENBQUMsR0FBRyxhQUFhLFVBQVUsQ0FBQztBQUVoRSxnQkFBSSxZQUFZLGlCQUFpQjtBQUUvQiwwQkFBWSxnQkFBZ0IsU0FBUztBQUVyQyxrQkFBSSxRQUFRLEdBQUc7QUFDYixnQ0FBZ0I7QUFBQSxjQUNsQjtBQUFBLFlBQ0Y7QUFFQSx3QkFBWSxrQkFBa0I7QUFDOUIsa0JBQU0sY0FBYyxjQUFjLFlBQVksV0FBVztBQUN6RCwwQkFBYyxXQUFXO0FBQ3pCLG1CQUFPLE9BQU8sV0FBVztBQUV6QixnQkFBSSxZQUFZLFNBQVM7QUFDdkIsMEJBQVksUUFBUSxLQUFLO0FBQ3pCLHFCQUFPLFlBQVk7QUFBQSxZQUNyQjtBQUdBLHlCQUFhLFlBQVksbUJBQW1CO0FBQzVDLGtCQUFNLFdBQVcsaUJBQWlCLGVBQWU7QUFDakQsbUJBQU8saUJBQWlCLFdBQVc7QUFDbkMseUJBQWEsWUFBWSxJQUFJLGlCQUFpQixXQUFXO0FBQ3pELG1CQUFPLFlBQVksaUJBQWlCLFVBQVUsV0FBVztBQUFBLFVBQzNEO0FBQUEsVUFHQSxLQUFLLGFBQWE7QUFDaEIsa0JBQU0sVUFBVSxhQUFhLFFBQVEsSUFBSSxJQUFJO0FBQzdDLG1CQUFPLFFBQVEsS0FBSyxXQUFXO0FBQUEsVUFDakM7QUFBQSxVQUVBLFFBQVEsV0FBVztBQUNqQixrQkFBTSxVQUFVLGFBQWEsUUFBUSxJQUFJLElBQUk7QUFDN0MsbUJBQU8sUUFBUSxRQUFRLFNBQVM7QUFBQSxVQUNsQztBQUFBLFFBRUY7QUFFQSxjQUFNLGNBQWMsQ0FBQyxVQUFVLFVBQVUsZ0JBQWdCO0FBQ3ZELGlCQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUV0QyxrQkFBTSxjQUFjLGFBQVc7QUFDN0IsdUJBQVMsV0FBVztBQUFBLGdCQUNsQixhQUFhO0FBQUEsZ0JBQ2I7QUFBQSxjQUNGLENBQUM7QUFBQSxZQUNIO0FBRUEsMkJBQWUsbUJBQW1CLElBQUksVUFBVSxPQUFPO0FBQ3ZELDJCQUFlLGtCQUFrQixJQUFJLFVBQVUsTUFBTTtBQUVyRCxxQkFBUyxjQUFjLFVBQVUsTUFBTSx5QkFBeUIsUUFBUTtBQUV4RSxxQkFBUyxXQUFXLFVBQVUsTUFBTSxzQkFBc0IsUUFBUTtBQUVsRSxxQkFBUyxhQUFhLFVBQVUsTUFBTSx3QkFBd0IsVUFBVSxXQUFXO0FBRW5GLHFCQUFTLFlBQVksVUFBVSxNQUFNLFlBQVksY0FBYyxLQUFLO0FBRXBFLDZCQUFpQixVQUFVLFVBQVUsV0FBVztBQUNoRCw4QkFBa0IsVUFBVSxhQUFhLGFBQWEsV0FBVztBQUNqRSx1Q0FBMkIsVUFBVSxXQUFXO0FBQ2hELHNCQUFVLFdBQVc7QUFDckIsdUJBQVcsYUFBYSxhQUFhLFdBQVc7QUFDaEQsc0JBQVUsVUFBVSxXQUFXO0FBRS9CLHVCQUFXLE1BQU07QUFDZix1QkFBUyxVQUFVLFlBQVk7QUFBQSxZQUNqQyxDQUFDO0FBQUEsVUFDSCxDQUFDO0FBQUEsUUFDSDtBQUVBLGNBQU0sZ0JBQWdCLENBQUMsWUFBWSxnQkFBZ0I7QUFDakQsZ0JBQU0saUJBQWlCLGtCQUFrQixVQUFVO0FBQ25ELGdCQUFNLFNBQVMsT0FBTyxPQUFPLENBQUMsR0FBRyxlQUFlLGFBQWEsZ0JBQWdCLFVBQVU7QUFFdkYsaUJBQU8sWUFBWSxPQUFPLE9BQU8sQ0FBQyxHQUFHLGNBQWMsV0FBVyxPQUFPLFNBQVM7QUFDOUUsaUJBQU8sWUFBWSxPQUFPLE9BQU8sQ0FBQyxHQUFHLGNBQWMsV0FBVyxPQUFPLFNBQVM7QUFDOUUsaUJBQU87QUFBQSxRQUNUO0FBT0EsY0FBTSxtQkFBbUIsY0FBWTtBQUNuQyxnQkFBTSxXQUFXO0FBQUEsWUFDZixPQUFPLFNBQVM7QUFBQSxZQUNoQixXQUFXLGFBQWE7QUFBQSxZQUN4QixTQUFTLFdBQVc7QUFBQSxZQUNwQixlQUFlLGlCQUFpQjtBQUFBLFlBQ2hDLFlBQVksY0FBYztBQUFBLFlBQzFCLGNBQWMsZ0JBQWdCO0FBQUEsWUFDOUIsUUFBUSxVQUFVO0FBQUEsWUFDbEIsYUFBYSxlQUFlO0FBQUEsWUFDNUIsbUJBQW1CLHFCQUFxQjtBQUFBLFlBQ3hDLGVBQWUsaUJBQWlCO0FBQUEsVUFDbEM7QUFDQSx1QkFBYSxTQUFTLElBQUksVUFBVSxRQUFRO0FBQzVDLGlCQUFPO0FBQUEsUUFDVDtBQVFBLGNBQU0sYUFBYSxDQUFDLGdCQUFnQixhQUFhLGdCQUFnQjtBQUMvRCxnQkFBTSxtQkFBbUIsb0JBQW9CO0FBQzdDLGVBQUssZ0JBQWdCO0FBRXJCLGNBQUksWUFBWSxPQUFPO0FBQ3JCLDJCQUFlLFVBQVUsSUFBSSxNQUFNLE1BQU07QUFDdkMsMEJBQVksT0FBTztBQUNuQixxQkFBTyxlQUFlO0FBQUEsWUFDeEIsR0FBRyxZQUFZLEtBQUs7QUFFcEIsZ0JBQUksWUFBWSxrQkFBa0I7QUFDaEMsbUJBQUssZ0JBQWdCO0FBQ3JCLCtCQUFpQixrQkFBa0IsYUFBYSxrQkFBa0I7QUFDbEUseUJBQVcsTUFBTTtBQUNmLG9CQUFJLGVBQWUsV0FBVyxlQUFlLFFBQVEsU0FBUztBQUU1RCwwQ0FBd0IsWUFBWSxLQUFLO0FBQUEsZ0JBQzNDO0FBQUEsY0FDRixDQUFDO0FBQUEsWUFDSDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBT0EsY0FBTSxZQUFZLENBQUMsVUFBVSxnQkFBZ0I7QUFDM0MsY0FBSSxZQUFZLE9BQU87QUFDckI7QUFBQSxVQUNGO0FBRUEsY0FBSSxDQUFDLGVBQWUsWUFBWSxhQUFhLEdBQUc7QUFDOUMsbUJBQU8sa0JBQWtCO0FBQUEsVUFDM0I7QUFFQSxjQUFJLENBQUMsWUFBWSxVQUFVLFdBQVcsR0FBRztBQUN2QyxxQkFBUyxhQUFhLElBQUksQ0FBQztBQUFBLFVBQzdCO0FBQUEsUUFDRjtBQVFBLGNBQU0sY0FBYyxDQUFDLFVBQVUsZ0JBQWdCO0FBQzdDLGNBQUksWUFBWSxhQUFhLFVBQVUsU0FBUyxVQUFVLEdBQUc7QUFDM0QscUJBQVMsV0FBVyxNQUFNO0FBQzFCLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksWUFBWSxlQUFlLFVBQVUsU0FBUyxZQUFZLEdBQUc7QUFDL0QscUJBQVMsYUFBYSxNQUFNO0FBQzVCLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksWUFBWSxnQkFBZ0IsVUFBVSxTQUFTLGFBQWEsR0FBRztBQUNqRSxxQkFBUyxjQUFjLE1BQU07QUFDN0IsbUJBQU87QUFBQSxVQUNUO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBRUEsY0FBTSxvQkFBb0IsTUFBTTtBQUM5QixjQUFJLFNBQVMseUJBQXlCLGVBQWUsT0FBTyxTQUFTLGNBQWMsU0FBUyxZQUFZO0FBQ3RHLHFCQUFTLGNBQWMsS0FBSztBQUFBLFVBQzlCO0FBQUEsUUFDRjtBQUdBLFlBQUksT0FBTyxXQUFXLGVBQWUsUUFBUSxLQUFLLFVBQVUsUUFBUSxLQUFLLFNBQVMsS0FBSyxNQUFNLHFCQUFxQixHQUFHO0FBQ25ILGNBQUksS0FBSyxPQUFPLElBQUksS0FBSztBQUN2QixrQkFBTSxRQUFRLFNBQVMsY0FBYyxLQUFLO0FBQzFDLGtCQUFNLFlBQVk7QUFDbEIsa0JBQU0sUUFBUSxpQkFBaUIsQ0FBQztBQUFBLGNBQzlCLE1BQU07QUFBQSxjQUNOLElBQUk7QUFBQSxZQUNOLEdBQUc7QUFBQSxjQUNELE1BQU07QUFBQSxjQUNOLElBQUk7QUFBQSxZQUNOLENBQUMsQ0FBQztBQUNGLHlCQUFhLE9BQU8sMnhDQUEyeEMsT0FBTyxNQUFNLE1BQU0sNEZBQWlHLEVBQUUsT0FBTyxNQUFNLElBQUksNk9BQWtQLENBQUM7QUFDenFELGtCQUFNLGNBQWMsU0FBUyxjQUFjLFFBQVE7QUFDbkQsd0JBQVksWUFBWTtBQUV4Qix3QkFBWSxVQUFVLE1BQU0sTUFBTSxPQUFPO0FBRXpDLGtCQUFNLFlBQVksV0FBVztBQUM3QixtQkFBTyxpQkFBaUIsUUFBUSxNQUFNO0FBQ3BDLHlCQUFXLE1BQU07QUFDZix5QkFBUyxLQUFLLFlBQVksS0FBSztBQUFBLGNBQ2pDLEdBQUcsR0FBSTtBQUFBLFlBQ1QsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBR0EsZUFBTyxPQUFPLFdBQVcsV0FBVyxlQUFlO0FBRW5ELGVBQU8sT0FBTyxZQUFZLGFBQWE7QUFFdkMsZUFBTyxLQUFLLGVBQWUsRUFBRSxRQUFRLFNBQU87QUFDMUMscUJBQVcsT0FBTyxXQUFZO0FBQzVCLGdCQUFJLGlCQUFpQjtBQUNuQixxQkFBTyxnQkFBZ0IsS0FBSyxHQUFHLFNBQVM7QUFBQSxZQUMxQztBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFDRCxtQkFBVyxnQkFBZ0I7QUFDM0IsbUJBQVcsVUFBVTtBQUVyQixjQUFNQSxRQUFPO0FBRWIsUUFBQUEsTUFBSyxVQUFVQTtBQUVmLGVBQU9BO0FBQUEsTUFFVCxDQUFDO0FBQ0QsVUFBSSxPQUFPLFlBQVMsZUFBZSxRQUFLLGFBQVk7QUFBRyxnQkFBSyxPQUFPLFFBQUssYUFBYSxRQUFLLE9BQU8sUUFBSyxhQUFhLFFBQUs7QUFBQSxNQUFXO0FBRW5JLHFCQUFhLE9BQU8sWUFBVSxTQUFTLEdBQUUsR0FBRTtBQUFDLFlBQUksSUFBRSxFQUFFLGNBQWMsT0FBTztBQUFFLFlBQUcsRUFBRSxxQkFBcUIsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLEdBQUUsRUFBRTtBQUFXLFlBQUUsV0FBVyxhQUFXLEVBQUUsV0FBVyxVQUFRO0FBQUE7QUFBUSxjQUFHO0FBQUMsY0FBRSxZQUFVO0FBQUEsVUFBQyxTQUFPSyxJQUFOO0FBQVMsY0FBRSxZQUFVO0FBQUEsVUFBQztBQUFBLE1BQUMsRUFBRSxVQUFTLHcvd0JBQWdneEI7QUFBQTtBQUFBOzs7QUN6OEg5dXhCLFdBQVMsTUFBTSxLQUFnQjtBQUNsQyxZQUFRLElBQUksR0FBRztBQUFBLEVBQ25CO0FBRUEsV0FBUyxPQUFPLEtBQWE7QUFDekIsU0FBSyxLQUFLO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixPQUFPLElBQUk7QUFBQSxNQUNYLG1CQUFtQjtBQUFBLElBQ3ZCLENBQUM7QUFBQSxFQUNMO0FBQ0EsV0FBZSxRQUFRLEtBQWEsSUFBWSxRQUFrQztBQUFBO0FBQzlFLFlBQU0sTUFBTSxNQUFNLEtBQUssS0FBSztBQUFBLFFBQ3hCLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLG1CQUFtQjtBQUFBLFFBQ25CLG1CQUFtQjtBQUFBLFFBQ25CLG1CQUFtQjtBQUFBLFFBQ25CLGtCQUFrQjtBQUFBLFFBQ2xCLGtCQUFrQjtBQUFBLE1BQ3RCLENBQUM7QUFDRCxZQUFNLE1BQWMsSUFBSTtBQUN4QixhQUFPO0FBQUEsSUFDWDtBQUFBO0FBM0JBLE1BQU0sTUE0Qks7QUE1Qlg7QUFBQTtBQUFBLE1BQU0sT0FBTztBQTRCTixNQUFJLFFBQVE7QUFBQSxRQUNmO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUMvQkEsTUFHYTtBQUhiO0FBQUE7QUFDQTtBQUVPLE1BQU0sY0FBTixNQUFrQjtBQUFBLFFBSWQsS0FBSyxXQUFxQjtBQUM3QixlQUFLLFlBQVk7QUFDakIsZUFBSyxNQUFNLFNBQVMsY0FBYyxXQUFXO0FBQzdDLGVBQUssSUFBSSxpQkFBaUIsU0FBUyxDQUFDLE1BQWtCLEtBQUssS0FBSyxDQUFDO0FBQ2pFLGVBQUssSUFBSSxpQkFBaUIsWUFBWSxDQUFDLE1BQWtCLEtBQUssS0FBSyxDQUFDO0FBQUEsUUFDeEU7QUFBQSxRQUVhLE9BQXNCO0FBQUE7QUFDL0Isa0JBQU0sS0FBSyxVQUFVLEtBQUs7QUFDMUIsWUFBRSxNQUFNLE9BQU8sT0FBTztBQUFBLFVBQzFCO0FBQUE7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDbEJBLE1BTWE7QUFOYjtBQUFBO0FBTU8sTUFBTSxhQUFOLE1BQWlCO0FBQUEsUUFBakI7QUFvQkgsZUFBUSxRQUFpQjtBQUFBO0FBQUEsUUFoQmxCLEtBQUssT0FBcUIsV0FBc0IsS0FBZ0I7QUFDbkUsZUFBSyxRQUFRO0FBQ2IsZUFBSyxZQUFZO0FBQ2pCLGVBQUssTUFBTTtBQUVYLGVBQUssS0FBSztBQUFBLFFBQ2Q7QUFBQSxRQUNhLE9BQXNCO0FBQUE7QUFDL0Isa0JBQU0sTUFBTTtBQUNaLGtCQUFNLEtBQUssVUFBVSxLQUFLO0FBQzFCLGtCQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sS0FBSyxXQUFXLEtBQUssR0FBRztBQUd0RCx1QkFBVyxNQUFNLEtBQUssS0FBSyxHQUFHLE1BQU0sR0FBSTtBQUFBLFVBQzVDO0FBQUE7QUFBQSxRQUdjLE9BQU8sT0FBcUIsV0FBc0IsS0FBK0I7QUFBQTtBQUMzRixrQkFBTSxRQUFnQixVQUFVLFNBQVM7QUFFekMsZ0JBQUksV0FBa0I7QUFDdEIsZ0JBQUksS0FBSyxPQUFPO0FBQ1osb0JBQU0sT0FBTyxFQUFFLE1BQU0sYUFBYTtBQUFBLFlBQ3RDO0FBQ0EsdUJBQVcsUUFBUSxPQUFPO0FBRXRCLG9CQUFNLFFBQTBCLE1BQU0sS0FBSyxRQUFRLE1BQU0sT0FBTyxDQUFDO0FBR2pFLG9CQUFNLE1BQU07QUFHWixvQkFBTSxVQUFVLEtBQUssV0FBVztBQUNoQyx5QkFBVyxLQUFLLFNBQVM7QUFFckIsb0JBQUksRUFBRSxTQUFTLEdBQUc7QUFDZCxzQkFBSSxJQUFJLFFBQVEsRUFBRTtBQUNsQixzQkFBSSxJQUFJLFNBQVM7QUFBQSxnQkFDckIsT0FBTztBQUNILHNCQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xCLHNCQUFJLElBQUksU0FBUztBQUFBLGdCQUNyQjtBQUNBLDJCQUFXLEtBQUssRUFBRSxVQUFVLEdBQUc7QUFDM0Isc0JBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLFVBQVUsS0FBSztBQUNsQyw2QkFBVztBQUFBLGdCQUNmO0FBQ0EsMkJBQVc7QUFBQSxjQUNmO0FBR0Esb0JBQU0sT0FBTyxFQUFFLFVBQVUsT0FBTyxHQUFHLEdBQUcsTUFBTSxPQUFPLE1BQU0sTUFBTTtBQUFBLFlBQ25FO0FBQ0EsZ0JBQUksS0FBSyxPQUFPO0FBQ1osb0JBQU0sT0FBTyxFQUFFLE1BQU0sYUFBYTtBQUNsQyxtQkFBSyxRQUFRO0FBQUEsWUFDakI7QUFBQSxVQUNKO0FBQUE7QUFBQSxRQUVjLFFBQVEsS0FBbUQ7QUFBQTtBQUNyRSxtQkFBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDcEMsb0JBQU0sUUFBMEIsSUFBSSxNQUFNO0FBQzFDLG9CQUFNLE1BQWdDLElBQUksV0FBVyxJQUFJO0FBQ3pELG9CQUFNLFNBQVMsTUFBTSxRQUFRLEtBQUs7QUFDbEMsb0JBQU0sVUFBVSxDQUFDLE1BQU0sT0FBTyxDQUFDO0FBQy9CLG9CQUFNLE1BQU0sSUFBSSxPQUFPLFVBQVU7QUFBQSxZQUNyQyxDQUFDO0FBQUEsVUFDTDtBQUFBO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzdFQSxNQUFhO0FBQWI7QUFBQTtBQUFPLE1BQU0sc0JBQU4sTUFBMEI7QUFBQSxRQUc3QixjQUFjO0FBQ1YsZUFBSyxVQUFVLFNBQVMsY0FBYyxlQUFlO0FBQUEsUUFDekQ7QUFBQSxRQUVPLFVBQTBCO0FBQzdCLGlCQUFPLEtBQUs7QUFBQSxRQUNoQjtBQUFBLFFBRU8sWUFBa0I7QUFDckIsZUFBSyxRQUFRLE1BQU0sa0JBQWtCO0FBQUEsUUFDekM7QUFBQSxRQUVPLFlBQWtCO0FBQ3JCLGVBQUssUUFBUSxNQUFNLGtCQUFrQjtBQUFBLFFBQ3pDO0FBQUEsUUFFTyxZQUFrQjtBQUNyQixlQUFLLFFBQVEsTUFBTSxrQkFBa0I7QUFBQSxRQUN6QztBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUN0QkEsTUFFYTtBQUZiO0FBQUE7QUFFTyxNQUFNLGFBQU4sTUFBaUI7QUFBQSxRQUlwQixjQUFjO0FBQ1YsZUFBSyxVQUFVO0FBQUEsUUFDbkI7QUFBQSxRQUVPLFlBQWtCO0FBQ3JCLGVBQUssUUFBUTtBQUNiLGVBQUssT0FBTztBQUFBLFFBQ2hCO0FBQUEsUUFFTyxjQUFvQjtBQUV2QixlQUFLLFFBQVE7QUFDYixlQUFLLE9BQU87QUFBQSxRQUNoQjtBQUFBLFFBRU8sUUFBUSxNQUFZO0FBQ3ZCLGVBQUssT0FBTztBQUFBLFFBQ2hCO0FBQUEsUUFDTyxVQUFnQjtBQUNuQixpQkFBTyxLQUFLO0FBQUEsUUFDaEI7QUFBQSxRQUVPLFlBQVksS0FBeUI7QUFDeEMsaUJBQU8sUUFBUSxRQUFRLEtBQUssVUFBVTtBQUFBLFFBQzFDO0FBQUEsUUFDTyxjQUFjLEtBQXlCO0FBQzFDLGlCQUFPLFFBQVE7QUFBQSxRQUNuQjtBQUFBLFFBQ08sWUFBWSxLQUF5QjtBQUV4QyxpQkFBTyxLQUFLLE9BQU8sR0FBRyxLQUFLLEtBQUssU0FBUztBQUFBLFFBQzdDO0FBQUEsUUFDTyxPQUFPLEtBQXlCO0FBQ25DLGlCQUFPLFFBQVEsVUFBVSxLQUFLLFVBQVU7QUFBQSxRQUM1QztBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUN6Q0EsTUFNYTtBQU5iO0FBQUE7QUFBQTtBQU1PLE1BQU0sbUJBQU4sTUFBc0I7QUFBQSxRQVF6QixjQUFjO0FBTmQsZUFBUSxhQUF1QixDQUFDO0FBTzVCLGVBQUssTUFBTTtBQUFBLFFBQ2Y7QUFBQSxRQUVRLFFBQVE7QUFFWixlQUFLLE9BQU87QUFDWixlQUFLLE1BQU07QUFFWCxjQUFJLE1BQU07QUFDVixpQkFBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUc7QUFDaEMsbUJBQU8sYUFBYSxHQUFHO0FBQUEsVUFDM0I7QUFBQSxRQUNKO0FBQUEsUUFFTyxNQUFZO0FBQ2YsY0FBRyxLQUFLLFFBQVEsTUFBTSxPQUFPO0FBRXpCLG1CQUFPO0FBQUEsVUFDWDtBQUlBLGdCQUFNLE1BQWMsS0FBSyxJQUFJO0FBQzdCLGdCQUFNLE9BQWUsTUFBTSxLQUFLO0FBQ2hDLGVBQUssTUFBTTtBQUNYLGNBQUksT0FBTyxpQkFBZ0IsWUFBWTtBQUVuQyxtQkFBTztBQUFBLFVBQ1gsV0FBVyxPQUFPLGlCQUFnQixZQUFZO0FBRTFDLG1CQUFPO0FBQUEsVUFDWCxXQUFXLFFBQVEsaUJBQWdCLFlBQVk7QUFFM0MsbUJBQU87QUFBQSxVQUNYLE9BQU87QUFFSCxtQkFBTztBQUFBLFVBQ1g7QUFBQSxRQUNKO0FBQUEsUUFFTyxNQUFNLFNBQThCLEdBQVcsR0FBVyxZQUFvQztBQUNqRyxjQUFHLEtBQUssUUFBUSxHQUFHO0FBRWY7QUFBQSxVQUNKO0FBR0EsZUFBSyxPQUFPLEtBQUssSUFBSTtBQUVyQixlQUFLLE1BQU0sSUFBSSxNQUFNLEdBQUcsQ0FBQztBQUN6QixxQkFBVyxTQUFTLEdBQUcsQ0FBQztBQUd4QixlQUFLLFdBQVcsS0FBSyxPQUFPLFdBQVcsTUFBTTtBQUV6QyxvQkFBUSxVQUFVO0FBQ2xCLGlCQUFLLFdBQVcsS0FBSyxPQUFPLFdBQVcsTUFBTTtBQUV6QyxzQkFBUSxVQUFVO0FBQUEsWUFDdEIsR0FBRyxpQkFBZ0IsVUFBVSxDQUFDO0FBQUEsVUFDbEMsR0FBRyxpQkFBZ0IsVUFBVSxDQUFDO0FBQUEsUUFDbEM7QUFBQSxRQUVPLFlBQVksR0FBVyxHQUFXO0FBQ3JDLGNBQUcsS0FBSyxRQUFRLE1BQU07QUFFbEIsbUJBQU87QUFBQSxVQUNYO0FBQ0EsZ0JBQU0sTUFBTSxLQUFLLElBQUksT0FBTyxHQUFHLENBQUM7QUFDaEMsaUJBQU87QUFBQSxRQUNYO0FBQUEsUUFFTyxVQUFVO0FBQ2IsaUJBQU8sS0FBSyxXQUFXLFNBQVM7QUFBQSxRQUNwQztBQUFBLE1BQ0o7QUFwRk8sTUFBTSxrQkFBTjtBQUtILE1BTFMsZ0JBS2UsYUFBcUIsTUFBTTtBQUNuRCxNQU5TLGdCQU1lLGFBQXFCLElBQU07QUFBQTtBQUFBOzs7QUNadkQ7QUFBQTtBQUFBO0FBQ0EsYUFBTyxVQUFVQztBQUVqQixlQUFTLFdBQVksS0FBSztBQUN4QixZQUFJLGVBQWUsUUFBUTtBQUN6QixpQkFBTyxPQUFPLEtBQUssR0FBRztBQUFBLFFBQ3hCO0FBRUEsZUFBTyxJQUFJLElBQUksWUFBWSxJQUFJLE9BQU8sTUFBTSxHQUFHLElBQUksWUFBWSxJQUFJLE1BQU07QUFBQSxNQUMzRTtBQUVBLGVBQVNBLE1BQU0sTUFBTTtBQUNuQixlQUFPLFFBQVEsQ0FBQztBQUVoQixZQUFJLEtBQUs7QUFBUyxpQkFBTyxZQUFZLElBQUk7QUFDekMsZUFBTyxLQUFLLFFBQVEsYUFBYTtBQUVqQyxpQkFBUyxXQUFZLEdBQUcsSUFBSTtBQUMxQixjQUFJLE9BQU8sT0FBTyxLQUFLLENBQUM7QUFDeEIsY0FBSSxLQUFLLElBQUksTUFBTSxLQUFLLE1BQU07QUFDOUIsbUJBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxRQUFRLEtBQUs7QUFDcEMsZ0JBQUksSUFBSSxLQUFLO0FBQ2IsZ0JBQUksTUFBTSxFQUFFO0FBQ1osZ0JBQUksT0FBTyxRQUFRLFlBQVksUUFBUSxNQUFNO0FBQzNDLGlCQUFHLEtBQUs7QUFBQSxZQUNWLFdBQVcsZUFBZSxNQUFNO0FBQzlCLGlCQUFHLEtBQUssSUFBSSxLQUFLLEdBQUc7QUFBQSxZQUN0QixXQUFXLFlBQVksT0FBTyxHQUFHLEdBQUc7QUFDbEMsaUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxZQUN4QixPQUFPO0FBQ0wsaUJBQUcsS0FBSyxHQUFHLEdBQUc7QUFBQSxZQUNoQjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxpQkFBUyxNQUFPLEdBQUc7QUFDakIsY0FBSSxPQUFPLE1BQU0sWUFBWSxNQUFNO0FBQU0sbUJBQU87QUFDaEQsY0FBSSxhQUFhO0FBQU0sbUJBQU8sSUFBSSxLQUFLLENBQUM7QUFDeEMsY0FBSSxNQUFNLFFBQVEsQ0FBQztBQUFHLG1CQUFPLFdBQVcsR0FBRyxLQUFLO0FBQ2hELGNBQUksYUFBYTtBQUFLLG1CQUFPLElBQUksSUFBSSxXQUFXLE1BQU0sS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3JFLGNBQUksYUFBYTtBQUFLLG1CQUFPLElBQUksSUFBSSxXQUFXLE1BQU0sS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3JFLGNBQUksS0FBSyxDQUFDO0FBQ1YsbUJBQVMsS0FBSyxHQUFHO0FBQ2YsZ0JBQUksT0FBTyxlQUFlLEtBQUssR0FBRyxDQUFDLE1BQU07QUFBTztBQUNoRCxnQkFBSSxNQUFNLEVBQUU7QUFDWixnQkFBSSxPQUFPLFFBQVEsWUFBWSxRQUFRLE1BQU07QUFDM0MsaUJBQUcsS0FBSztBQUFBLFlBQ1YsV0FBVyxlQUFlLE1BQU07QUFDOUIsaUJBQUcsS0FBSyxJQUFJLEtBQUssR0FBRztBQUFBLFlBQ3RCLFdBQVcsZUFBZSxLQUFLO0FBQzdCLGlCQUFHLEtBQUssSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFBQSxZQUNwRCxXQUFXLGVBQWUsS0FBSztBQUM3QixpQkFBRyxLQUFLLElBQUksSUFBSSxXQUFXLE1BQU0sS0FBSyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQUEsWUFDcEQsV0FBVyxZQUFZLE9BQU8sR0FBRyxHQUFHO0FBQ2xDLGlCQUFHLEtBQUssV0FBVyxHQUFHO0FBQUEsWUFDeEIsT0FBTztBQUNMLGlCQUFHLEtBQUssTUFBTSxHQUFHO0FBQUEsWUFDbkI7QUFBQSxVQUNGO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBRUEsaUJBQVMsV0FBWSxHQUFHO0FBQ3RCLGNBQUksT0FBTyxNQUFNLFlBQVksTUFBTTtBQUFNLG1CQUFPO0FBQ2hELGNBQUksYUFBYTtBQUFNLG1CQUFPLElBQUksS0FBSyxDQUFDO0FBQ3hDLGNBQUksTUFBTSxRQUFRLENBQUM7QUFBRyxtQkFBTyxXQUFXLEdBQUcsVUFBVTtBQUNyRCxjQUFJLGFBQWE7QUFBSyxtQkFBTyxJQUFJLElBQUksV0FBVyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUMxRSxjQUFJLGFBQWE7QUFBSyxtQkFBTyxJQUFJLElBQUksV0FBVyxNQUFNLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUMxRSxjQUFJLEtBQUssQ0FBQztBQUNWLG1CQUFTLEtBQUssR0FBRztBQUNmLGdCQUFJLE1BQU0sRUFBRTtBQUNaLGdCQUFJLE9BQU8sUUFBUSxZQUFZLFFBQVEsTUFBTTtBQUMzQyxpQkFBRyxLQUFLO0FBQUEsWUFDVixXQUFXLGVBQWUsTUFBTTtBQUM5QixpQkFBRyxLQUFLLElBQUksS0FBSyxHQUFHO0FBQUEsWUFDdEIsV0FBVyxlQUFlLEtBQUs7QUFDN0IsaUJBQUcsS0FBSyxJQUFJLElBQUksV0FBVyxNQUFNLEtBQUssR0FBRyxHQUFHLFVBQVUsQ0FBQztBQUFBLFlBQ3pELFdBQVcsZUFBZSxLQUFLO0FBQzdCLGlCQUFHLEtBQUssSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFBQSxZQUN6RCxXQUFXLFlBQVksT0FBTyxHQUFHLEdBQUc7QUFDbEMsaUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxZQUN4QixPQUFPO0FBQ0wsaUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxZQUN4QjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBRUEsZUFBUyxZQUFhLE1BQU07QUFDMUIsWUFBSSxPQUFPLENBQUM7QUFDWixZQUFJLFVBQVUsQ0FBQztBQUVmLGVBQU8sS0FBSyxRQUFRLGFBQWE7QUFFakMsaUJBQVMsV0FBWSxHQUFHLElBQUk7QUFDMUIsY0FBSSxPQUFPLE9BQU8sS0FBSyxDQUFDO0FBQ3hCLGNBQUksS0FBSyxJQUFJLE1BQU0sS0FBSyxNQUFNO0FBQzlCLG1CQUFTLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFLO0FBQ3BDLGdCQUFJLElBQUksS0FBSztBQUNiLGdCQUFJLE1BQU0sRUFBRTtBQUNaLGdCQUFJLE9BQU8sUUFBUSxZQUFZLFFBQVEsTUFBTTtBQUMzQyxpQkFBRyxLQUFLO0FBQUEsWUFDVixXQUFXLGVBQWUsTUFBTTtBQUM5QixpQkFBRyxLQUFLLElBQUksS0FBSyxHQUFHO0FBQUEsWUFDdEIsV0FBVyxZQUFZLE9BQU8sR0FBRyxHQUFHO0FBQ2xDLGlCQUFHLEtBQUssV0FBVyxHQUFHO0FBQUEsWUFDeEIsT0FBTztBQUNMLGtCQUFJLFFBQVEsS0FBSyxRQUFRLEdBQUc7QUFDNUIsa0JBQUksVUFBVSxJQUFJO0FBQ2hCLG1CQUFHLEtBQUssUUFBUTtBQUFBLGNBQ2xCLE9BQU87QUFDTCxtQkFBRyxLQUFLLEdBQUcsR0FBRztBQUFBLGNBQ2hCO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFDQSxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxpQkFBUyxNQUFPLEdBQUc7QUFDakIsY0FBSSxPQUFPLE1BQU0sWUFBWSxNQUFNO0FBQU0sbUJBQU87QUFDaEQsY0FBSSxhQUFhO0FBQU0sbUJBQU8sSUFBSSxLQUFLLENBQUM7QUFDeEMsY0FBSSxNQUFNLFFBQVEsQ0FBQztBQUFHLG1CQUFPLFdBQVcsR0FBRyxLQUFLO0FBQ2hELGNBQUksYUFBYTtBQUFLLG1CQUFPLElBQUksSUFBSSxXQUFXLE1BQU0sS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3JFLGNBQUksYUFBYTtBQUFLLG1CQUFPLElBQUksSUFBSSxXQUFXLE1BQU0sS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3JFLGNBQUksS0FBSyxDQUFDO0FBQ1YsZUFBSyxLQUFLLENBQUM7QUFDWCxrQkFBUSxLQUFLLEVBQUU7QUFDZixtQkFBUyxLQUFLLEdBQUc7QUFDZixnQkFBSSxPQUFPLGVBQWUsS0FBSyxHQUFHLENBQUMsTUFBTTtBQUFPO0FBQ2hELGdCQUFJLE1BQU0sRUFBRTtBQUNaLGdCQUFJLE9BQU8sUUFBUSxZQUFZLFFBQVEsTUFBTTtBQUMzQyxpQkFBRyxLQUFLO0FBQUEsWUFDVixXQUFXLGVBQWUsTUFBTTtBQUM5QixpQkFBRyxLQUFLLElBQUksS0FBSyxHQUFHO0FBQUEsWUFDdEIsV0FBVyxlQUFlLEtBQUs7QUFDN0IsaUJBQUcsS0FBSyxJQUFJLElBQUksV0FBVyxNQUFNLEtBQUssR0FBRyxHQUFHLEtBQUssQ0FBQztBQUFBLFlBQ3BELFdBQVcsZUFBZSxLQUFLO0FBQzdCLGlCQUFHLEtBQUssSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFBQSxZQUNwRCxXQUFXLFlBQVksT0FBTyxHQUFHLEdBQUc7QUFDbEMsaUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxZQUN4QixPQUFPO0FBQ0wsa0JBQUksSUFBSSxLQUFLLFFBQVEsR0FBRztBQUN4QixrQkFBSSxNQUFNLElBQUk7QUFDWixtQkFBRyxLQUFLLFFBQVE7QUFBQSxjQUNsQixPQUFPO0FBQ0wsbUJBQUcsS0FBSyxNQUFNLEdBQUc7QUFBQSxjQUNuQjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQ0EsZUFBSyxJQUFJO0FBQ1Qsa0JBQVEsSUFBSTtBQUNaLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGlCQUFTLFdBQVksR0FBRztBQUN0QixjQUFJLE9BQU8sTUFBTSxZQUFZLE1BQU07QUFBTSxtQkFBTztBQUNoRCxjQUFJLGFBQWE7QUFBTSxtQkFBTyxJQUFJLEtBQUssQ0FBQztBQUN4QyxjQUFJLE1BQU0sUUFBUSxDQUFDO0FBQUcsbUJBQU8sV0FBVyxHQUFHLFVBQVU7QUFDckQsY0FBSSxhQUFhO0FBQUssbUJBQU8sSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDMUUsY0FBSSxhQUFhO0FBQUssbUJBQU8sSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDMUUsY0FBSSxLQUFLLENBQUM7QUFDVixlQUFLLEtBQUssQ0FBQztBQUNYLGtCQUFRLEtBQUssRUFBRTtBQUNmLG1CQUFTLEtBQUssR0FBRztBQUNmLGdCQUFJLE1BQU0sRUFBRTtBQUNaLGdCQUFJLE9BQU8sUUFBUSxZQUFZLFFBQVEsTUFBTTtBQUMzQyxpQkFBRyxLQUFLO0FBQUEsWUFDVixXQUFXLGVBQWUsTUFBTTtBQUM5QixpQkFBRyxLQUFLLElBQUksS0FBSyxHQUFHO0FBQUEsWUFDdEIsV0FBVyxlQUFlLEtBQUs7QUFDN0IsaUJBQUcsS0FBSyxJQUFJLElBQUksV0FBVyxNQUFNLEtBQUssR0FBRyxHQUFHLFVBQVUsQ0FBQztBQUFBLFlBQ3pELFdBQVcsZUFBZSxLQUFLO0FBQzdCLGlCQUFHLEtBQUssSUFBSSxJQUFJLFdBQVcsTUFBTSxLQUFLLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFBQSxZQUN6RCxXQUFXLFlBQVksT0FBTyxHQUFHLEdBQUc7QUFDbEMsaUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxZQUN4QixPQUFPO0FBQ0wsa0JBQUksSUFBSSxLQUFLLFFBQVEsR0FBRztBQUN4QixrQkFBSSxNQUFNLElBQUk7QUFDWixtQkFBRyxLQUFLLFFBQVE7QUFBQSxjQUNsQixPQUFPO0FBQ0wsbUJBQUcsS0FBSyxXQUFXLEdBQUc7QUFBQSxjQUN4QjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQ0EsZUFBSyxJQUFJO0FBQ1Qsa0JBQVEsSUFBSTtBQUNaLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQTtBQUFBOzs7QUM5TEEsTUFHQSxhQUVhO0FBTGI7QUFBQTtBQUFBO0FBR0Esb0JBQWlCO0FBRVYsTUFBTSxZQUFOLE1BQWdCO0FBQUEsUUFBaEI7QUFDSCxlQUFnQixNQUFNO0FBQUEsWUFDbEIsT0FBZTtBQUFBLFlBQ2YsUUFBaUI7QUFBQSxVQUNyQjtBQUdBLGVBQVEsWUFBUSxZQUFBQyxTQUFLO0FBQUE7QUFBQSxRQUVkLEtBQUssT0FBZTtBQUN2QixlQUFLLElBQUksU0FBUztBQUNsQixlQUFLLElBQUksUUFBUTtBQUNqQixlQUFLLFFBQVE7QUFBQSxRQUNqQjtBQUFBLFFBRU8sS0FBSyxHQUFXLEdBQVcsTUFBYSxPQUEyQjtBQUN0RSxjQUFJLE1BQU07QUFDVixjQUFJLE9BQU8sTUFBTTtBQUViLGtCQUFNLElBQUksTUFBTSxHQUFHLENBQUM7QUFBQSxVQUN4QjtBQUNBLGdCQUFNLE1BQU0sTUFBTSxPQUFPO0FBRXpCLGNBQUksS0FBSyxJQUFJLFFBQVE7QUFDakIsaUJBQUssTUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHO0FBQUEsVUFDN0IsT0FBTztBQUNILGlCQUFLLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRztBQUFBLFVBQzNCO0FBQUEsUUFDSjtBQUFBLFFBQ1EsSUFBSSxHQUFXLEdBQVcsS0FBWSxLQUFxQztBQUUvRSxjQUFJLEtBQUs7QUFDVCxjQUFJLFVBQVU7QUFDZCxjQUFJLFVBQVU7QUFDZCxjQUFJLFlBQVk7QUFDaEIsY0FBSSxjQUFjLEtBQUssSUFBSTtBQUMzQixjQUFJLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2QixjQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsY0FBSSxPQUFPO0FBQ1gsY0FBSSxRQUFRO0FBQUEsUUFDaEI7QUFBQSxRQUNRLE1BQU0sR0FBVyxHQUFXLEtBQVksS0FBcUM7QUFDakYsY0FBSSxLQUFLO0FBRVQsZ0JBQU0sSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUM7QUFDbEQsY0FBSSxVQUFVLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN4QyxjQUFJLFFBQVE7QUFBQSxRQUNoQjtBQUFBLFFBRU8sVUFBVTtBQUNiLGVBQUssUUFBUSxLQUFLLE1BQU0sS0FBSyxHQUFHO0FBQUEsUUFFcEM7QUFBQSxRQUNPLGFBQWE7QUFDaEIscUJBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxPQUFPLFFBQVEsS0FBSyxLQUFLLEdBQUc7QUFDaEQsaUJBQUssSUFBSSxPQUFPO0FBQUEsVUFDcEI7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQy9EQSxNQUthO0FBTGI7QUFBQTtBQUtPLE1BQU0sY0FBTixNQUFrQjtBQUFBLFFBS2QsS0FBSyxPQUFxQixNQUFnQixLQUFnQjtBQUM3RCxlQUFLLFFBQVE7QUFDYixlQUFLLE9BQU87QUFDWixlQUFLLE1BQU07QUFDWCxlQUFLLE1BQU0sU0FBUyxjQUFjLFdBQVc7QUFFN0MsZUFBSyxJQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLENBQUM7QUFDcEQsZUFBSyxJQUFJLGlCQUFpQixZQUFZLE1BQU0sS0FBSyxLQUFLLENBQUM7QUFBQSxRQUMzRDtBQUFBLFFBQ1EsT0FBYTtBQUVqQixnQkFBTSxVQUFvQixLQUFLLEtBQUssS0FBSztBQUV6QyxlQUFLLE1BQU0sTUFBTTtBQUNqQixlQUFLLElBQUksUUFBUTtBQUdqQixjQUFJLFdBQWtCO0FBQ3RCLHFCQUFXLEtBQUssU0FBUztBQUNyQixnQkFBSSxFQUFFLFNBQVMsR0FBRztBQUNkLG1CQUFLLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDdkIsbUJBQUssSUFBSSxJQUFJLFNBQVM7QUFBQSxZQUMxQixPQUFPO0FBQ0gsbUJBQUssSUFBSSxJQUFJLFFBQVEsRUFBRTtBQUN2QixtQkFBSyxJQUFJLElBQUksU0FBUztBQUFBLFlBQzFCO0FBQ0EsdUJBQVcsS0FBSyxFQUFFLFVBQVUsR0FBRztBQUMzQixtQkFBSyxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxVQUFVLEtBQUssS0FBSztBQUM1Qyx5QkFBVztBQUFBLFlBQ2Y7QUFDQSx1QkFBVztBQUFBLFVBQ2Y7QUFHQSxlQUFLLElBQUksV0FBVztBQUFBLFFBQ3hCO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzlDQSxNQUthO0FBTGI7QUFBQTtBQUFBO0FBR0E7QUFFTyxNQUFNLG1CQUFOLE1BQXVCO0FBQUEsUUFBdkI7QUFHSCxlQUFRLE9BQWM7QUFDdEIsZUFBUSxVQUFrQjtBQUMxQixlQUFRLE9BQWU7QUFDdkIsZUFBUSxPQUFlO0FBRXZCLGVBQWlCLFdBQW1CO0FBQ3BDLGVBQWlCLFdBQW1CO0FBNERwQyxlQUFRLFVBQWtCO0FBQUE7QUFBQSxRQTFEbkIsS0FBSyxTQUE4QixZQUF5QjtBQUMvRCxlQUFLLFVBQVU7QUFDZixlQUFLLGFBQWE7QUFDbEIsZUFBSyxVQUFVO0FBQ2YsZUFBSyxXQUFXLEtBQUssS0FBSyxPQUFPO0FBQ2pDLGdCQUFNLE1BQW1CLFNBQVMsY0FBYyxNQUFNO0FBQ3RELGVBQUssT0FBTyxTQUFTLElBQUksTUFBTSxNQUFNLFFBQVEsTUFBSyxFQUFFLENBQUM7QUFDckQsZUFBSyxPQUFPLFNBQVMsSUFBSSxNQUFNLE9BQU8sUUFBUSxNQUFLLEVBQUUsQ0FBQztBQUFBLFFBQzFEO0FBQUEsUUFDTyxTQUFTLEdBQVcsR0FBVztBQUNsQyxlQUFLLE9BQU8sSUFBSSxNQUFNLEdBQUcsQ0FBQztBQUFBLFFBQzlCO0FBQUEsUUFDTyxPQUFPLEdBQVcsR0FBaUI7QUFDdEMsY0FBRyxLQUFLLE9BQU8sR0FBRztBQUNkO0FBQUEsVUFDSjtBQUVBLGdCQUFNLE1BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLFVBQVU7QUFDL0MsZ0JBQU0sTUFBTSxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssVUFBVTtBQUc5QyxnQkFBTSxLQUFLLE9BQU87QUFDbEIsZ0JBQU0sS0FBSyxPQUFPO0FBQ2xCLGlCQUFPLE9BQU87QUFBQSxZQUNWLE1BQU0sS0FBSztBQUFBLFlBQ1gsS0FBSyxLQUFLO0FBQUEsWUFDVixVQUFVO0FBQUEsVUFDZCxDQUFDO0FBRUQsVUFBRSxHQUFHLFlBQVksS0FBSyxLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUssS0FBSyxLQUFLLEtBQUssSUFBSTtBQUdwRSxlQUFLLEtBQUssSUFBSTtBQUNkLGVBQUssS0FBSyxJQUFJO0FBQUEsUUFDbEI7QUFBQSxRQUNPLFNBQVMsR0FBVyxHQUFpQjtBQUN4QyxnQkFBTSxLQUFLLEtBQUssS0FBSyxJQUFJO0FBRXpCLGdCQUFNLE9BQU8sS0FBSyxPQUFTLEtBQUs7QUFDaEMsZUFBSyxTQUFTLElBQUk7QUFFbEIsZUFBSyxLQUFLLElBQUk7QUFDZCxlQUFLLEtBQUssSUFBSTtBQUFBLFFBQ2xCO0FBQUEsUUFDTyxTQUFTLE1BQW1CO0FBQy9CLGVBQUssV0FBVztBQUVoQixlQUFLLFVBQVUsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLFNBQVMsS0FBSyxRQUFRLEdBQUcsS0FBSyxRQUFRO0FBQzVFLGdCQUFNLE1BQW1CLFNBQVMsY0FBYyxNQUFNO0FBQ3RELGNBQUksTUFBTSxZQUFZLFNBQVMsS0FBSztBQUNwQyxlQUFLLFdBQVcsS0FBSyxLQUFLLE9BQU87QUFDakMsY0FBSSxNQUFNLFFBQU8sR0FBRyxLQUFLLE9BQU8sS0FBSztBQUNyQyxjQUFJLE1BQU0sU0FBUSxHQUFHLEtBQUssT0FBTyxLQUFLO0FBQUEsUUFDMUM7QUFBQSxRQUNPLFVBQWtCO0FBQ3JCLGlCQUFPLEtBQUs7QUFBQSxRQUNoQjtBQUFBLFFBR1EsU0FBUztBQUNiLGdCQUFNLElBQVcsS0FBSyxJQUFJO0FBQzFCLGNBQUksTUFBTTtBQUNWLGNBQUcsSUFBSSxLQUFLLFVBQVUsT0FBTyxLQUFNO0FBQy9CLGtCQUFNO0FBQ04saUJBQUssVUFBVTtBQUFBLFVBQ25CO0FBQ0EsaUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQ3BGQSxNQUdhO0FBSGI7QUFBQTtBQUdPLE1BQU0sY0FBTixNQUFrQjtBQUFBLFFBTWQsS0FBSyxZQUFvQztBQUM1QyxlQUFLLGFBQWE7QUFDbEIsZUFBSyxNQUFNLFNBQVMsY0FBYyxhQUFhO0FBQy9DLGVBQUssTUFBTSxTQUFTLGNBQWMsWUFBWTtBQUM5QyxlQUFLLE1BQU0sU0FBUyxjQUFjLGFBQWE7QUFFL0MsZUFBSyxJQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxXQUFXLFNBQVMsR0FBRyxDQUFDO0FBQ3RFLGVBQUssSUFBSSxpQkFBaUIsY0FBYyxNQUFNLEtBQUssV0FBVyxTQUFTLEdBQUcsQ0FBQztBQUMzRSxlQUFLLElBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLFdBQVcsU0FBUyxJQUFJLENBQUM7QUFDdkUsZUFBSyxJQUFJLGlCQUFpQixjQUFjLE1BQU0sS0FBSyxXQUFXLFNBQVMsSUFBSSxDQUFDO0FBQUEsUUFDaEY7QUFBQSxRQUNPLFFBQXlCO0FBQzVCLGlCQUFPLEtBQUs7QUFBQSxRQUNoQjtBQUFBLFFBQ08sS0FBSyxTQUF1QjtBQUMvQixlQUFLLElBQUksWUFBWSxHQUFHLEtBQUssTUFBTSxVQUFVLEdBQUcsRUFBRSxTQUFTO0FBQUEsUUFDL0Q7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDMUJBLE1BRWE7QUFGYjtBQUFBO0FBRU8sTUFBTSxnQkFBTixNQUFvQjtBQUFBLFFBSXZCLGNBQWM7QUFDVixlQUFLLE1BQU0sU0FBUyxjQUFjLGFBQWE7QUFDL0MsZUFBSyxJQUFJLGlCQUFpQixTQUFTLENBQUMsTUFBa0IsS0FBSyxLQUFLLENBQUM7QUFDakUsZUFBSyxJQUFJLGlCQUFpQixZQUFZLENBQUMsTUFBa0IsS0FBSyxLQUFLLENBQUM7QUFBQSxRQUN4RTtBQUFBLFFBRU8sS0FBSyxLQUFnQjtBQUN4QixlQUFLLE1BQU07QUFBQSxRQUNmO0FBQUEsUUFFTyxPQUFPO0FBQ1YsZUFBSyxJQUFJLElBQUksU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJO0FBQ3BDLGdCQUFNLFNBQVM7QUFDZixnQkFBTSxVQUFVO0FBRWhCLGNBQUksS0FBSyxJQUFJLElBQUksUUFBUTtBQUNyQixpQkFBSyxJQUFJLFVBQVUsUUFBUSxTQUFTLE1BQU07QUFBQSxVQUM5QyxPQUFPO0FBQ0gsaUJBQUssSUFBSSxVQUFVLFFBQVEsUUFBUSxPQUFPO0FBQUEsVUFDOUM7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzNCQSxNQUdhO0FBSGI7QUFBQTtBQUNBO0FBRU8sTUFBTSxlQUFOLE1BQW1CO0FBQUEsUUFJZixLQUFLLEtBQWdCLE9BQXFCO0FBQzdDLGVBQUssTUFBTTtBQUNYLG1CQUFTLGlCQUFpQixZQUFZLEVBQUUsUUFBUSxDQUFDLFFBQXFCO0FBQ2xFLGdCQUFJLGlCQUFpQixTQUFTLENBQUMsT0FBYztBQUN6QyxvQkFBTSxPQUFvQixHQUFHO0FBQzdCLG9CQUFNQyxTQUFRLEtBQUssTUFBTTtBQUN6QixtQkFBSyxJQUFJLElBQUksUUFBUUE7QUFDckIsY0FBRSxNQUFNLE9BQU8sYUFBYUEsUUFBTztBQUFBLFlBRXZDLENBQUM7QUFBQSxVQUNMLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQ25CQSxNQUlhO0FBSmI7QUFBQTtBQUNBO0FBR08sTUFBTSxjQUFOLE1BQWtCO0FBQUEsUUFHckIsY0FBYztBQUNWLGVBQUssTUFBTSxTQUFTLGNBQWMsV0FBVztBQUM3QyxlQUFLLElBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLEtBQUssQ0FBQztBQUNwRCxlQUFLLElBQUksaUJBQWlCLFlBQVksTUFBTSxLQUFLLEtBQUssQ0FBQztBQUFBLFFBQzNEO0FBQUEsUUFDTyxLQUFLLE1BQWdCO0FBQ3hCLGVBQUssT0FBTztBQUFBLFFBQ2hCO0FBQUEsUUFDYyxPQUFzQjtBQUFBO0FBQ2hDLGdCQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsR0FBRztBQUN0QixrQkFBSSxNQUFRLE1BQU0sUUFBUSw4Q0FBVyx3Q0FBVSxzQ0FBUSxHQUFHO0FBQ3RELHNCQUFNLEtBQUssS0FBSyxLQUFLO0FBQ3JCLGdCQUFFLEdBQUcsSUFBSTtBQUFBLGNBQ2IsT0FBTztBQUNILGdCQUFFLEdBQUcsUUFBUTtBQUFBLGNBQ2pCO0FBQUEsWUFDSixPQUFPO0FBQ0gsY0FBRSxHQUFHLFlBQVk7QUFBQSxZQUNyQjtBQUdBLG1CQUFPLFNBQVMsT0FBTztBQUFBLFVBQzNCO0FBQUE7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDOUJBLE1Bc0JhO0FBdEJiO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFTyxNQUFNLG1CQUFOLE1BQXVCO0FBQUEsUUFBdkI7QUFHSCxlQUFRLFNBQVM7QUFBQSxZQUNiLE1BQU0sSUFBSSxXQUFXO0FBQUEsWUFDckIsV0FBVyxJQUFJLGdCQUFnQjtBQUFBLFVBQ25DO0FBQ0EsZUFBUSxVQUFVO0FBQUEsWUFDZCxTQUFTLElBQUksb0JBQW9CO0FBQUEsWUFDakMsWUFBWSxJQUFJLFlBQVk7QUFBQSxZQUM1QixNQUFNLElBQUksWUFBWTtBQUFBLFlBQ3RCLFFBQVEsSUFBSSxjQUFjO0FBQUEsWUFDMUIsT0FBTyxJQUFJLGFBQWE7QUFBQSxZQUN4QixNQUFNLElBQUksWUFBWTtBQUFBLFlBQ3RCLE1BQU0sSUFBSSxZQUFZO0FBQUEsVUFDMUI7QUFDQSxlQUFRLFNBQVM7QUFBQSxZQUNiLE1BQU0sSUFBSSxXQUFXO0FBQUEsWUFDckIsWUFBWSxJQUFJLGlCQUFpQjtBQUFBLFVBQ3JDO0FBRUEsZUFBUSxPQUFPO0FBQUEsWUFDWCxPQUFPLGFBQWEsU0FBUztBQUFBLFlBQzdCLE1BQU0sSUFBSSxTQUFTO0FBQUEsWUFDbkIsS0FBSyxJQUFJLFVBQVU7QUFBQSxVQUN2QjtBQUNBLGVBQVEsUUFBUTtBQUFBLFlBQ1osT0FBTyxhQUFhLFVBQVU7QUFBQSxZQUM5QixNQUFNLElBQUksVUFBVTtBQUFBLFlBQ3BCLEtBQUssSUFBSSxVQUFVO0FBQUEsVUFDdkI7QUFDQSxlQUFRLFNBQVM7QUFBQSxZQUNiLE9BQU8sSUFBSSxZQUFZO0FBQUEsWUFDdkIsU0FBUyxJQUFJLGNBQWM7QUFBQSxZQUMzQixPQUFPLElBQUksWUFBWTtBQUFBLFVBQzNCO0FBQUE7QUFBQSxRQUVPLE9BQWE7QUFFaEIsZUFBSyxZQUFZO0FBRWpCLGdCQUFNLEtBQUssS0FBSyxlQUFlO0FBQy9CLGdCQUFNLFFBQVEsR0FBRztBQUVqQixlQUFLLFFBQVEsV0FBVyxLQUFLLEtBQUssT0FBTyxVQUFVO0FBQ25ELGVBQUssUUFBUSxLQUFLLEtBQUssS0FBSyxLQUFLLElBQUk7QUFDckMsZUFBSyxRQUFRLE1BQU0sS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQzVDLGVBQUssUUFBUSxPQUFPLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFDdEMsZUFBSyxRQUFRLEtBQUssS0FBSyxLQUFLLEtBQUssT0FBTyxLQUFLLEtBQUssTUFBTSxLQUFLLEtBQUssR0FBRztBQUNyRSxlQUFLLFFBQVEsS0FBSyxLQUFLLEtBQUssS0FBSyxJQUFJO0FBRXJDLGVBQUssT0FBTyxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSztBQUM1QyxlQUFLLE9BQU8sUUFBUSxLQUFLLE1BQU0sS0FBSyxLQUFLLEtBQUs7QUFDOUMsZUFBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssS0FBSyxPQUFPLEtBQUssT0FBTyxVQUFVO0FBRXBFLGVBQUssT0FBTyxLQUFLLEtBQUssS0FBSyxNQUFNLE9BQU8sS0FBSyxNQUFNLE1BQU0sS0FBSyxNQUFNLEdBQUc7QUFDdkUsZUFBSyxPQUFPLFdBQVcsS0FBSyxLQUFLLFFBQVEsU0FBUyxLQUFLLFFBQVEsVUFBVTtBQUN6RSxlQUFLLEtBQUssSUFBSSxLQUFLLEtBQUs7QUFFeEIsZUFBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssR0FBRztBQUFBLFFBQ3JDO0FBQUEsUUFDUSxpQkFBd0I7QUFDNUIsZ0JBQU0sTUFBZ0I7QUFBQSxZQUNsQjtBQUFBLFVBQ0o7QUFDQSxnQkFBTSxNQUFNLENBQUM7QUFDYixxQkFBVSxNQUFNLEtBQUs7QUFDakIsZ0JBQUksTUFBTSxTQUFTLGNBQWMsRUFBRSxFQUFFO0FBQUEsVUFDekM7QUFDQSxpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUVPLEtBQUssS0FBYSxHQUFVLEdBQWdCO0FBQy9DLFlBQUUsZUFBZTtBQUNqQixZQUFFLGdCQUFnQjtBQUNsQixnQkFBTSxJQUFZLEVBQUU7QUFDcEIsZ0JBQU0sSUFBWSxFQUFFO0FBR3BCLGVBQUssWUFBWTtBQUNqQixlQUFLLE9BQU8sS0FBSyxZQUFZO0FBQzdCLGVBQUssT0FBTyxVQUFVLE1BQU0sS0FBSyxRQUFRLFNBQVMsR0FBRyxHQUFHLEtBQUssT0FBTyxVQUFVO0FBQUEsUUFDbEY7QUFBQSxRQUVPLEtBQUssS0FBYSxHQUFVLEdBQWdCO0FBQy9DLFlBQUUsZUFBZTtBQUNqQixnQkFBTSxJQUFZLEVBQUU7QUFDcEIsZ0JBQU0sSUFBWSxFQUFFO0FBSXBCLGNBQUksS0FBSyxjQUFjLFFBQ2hCLEtBQUssY0FBYyxPQUNuQixLQUFLLE9BQU8sVUFBVSxZQUFZLEdBQUcsQ0FBQyxHQUMzQztBQUVFO0FBQUEsVUFDSjtBQUdBLGNBQUksS0FBSyxPQUFPLFVBQVUsUUFBUSxHQUFHO0FBRWpDLGtCQUFNLE9BQU8sS0FBSyxPQUFPLFVBQVUsSUFBSTtBQUN2QyxpQkFBSyxPQUFPLEtBQUssUUFBUSxJQUFJO0FBQUEsVUFDakM7QUFFQSxrQkFBUSxLQUFLLE9BQU8sS0FBSyxRQUFRO0FBQUEsaUJBQ3hCO0FBRUQsb0JBQU1DLEtBQUksS0FBSyxLQUFLLEtBQUssVUFBVTtBQUNuQyxtQkFBSyxLQUFLLElBQUksS0FBSyxHQUFHLEdBQUdBLElBQUcsS0FBSyxLQUFLLEtBQUs7QUFDM0Msb0JBQU0sSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJO0FBQzVCLG1CQUFLLEtBQUssS0FBSyxVQUFVLEdBQUcsQ0FBQztBQUM3QjtBQUFBLGlCQUNDO0FBRUQsbUJBQUssT0FBTyxXQUFXLFNBQVMsR0FBRyxDQUFDO0FBQ3BDO0FBQUE7QUFBQSxRQUVaO0FBQUEsUUFFTyxHQUFHLEtBQWEsR0FBVSxHQUFVO0FBQ3ZDLGdCQUFNLElBQVksRUFBRTtBQUNwQixnQkFBTSxJQUFZLEVBQUU7QUFFcEIsWUFBRSxlQUFlO0FBSWpCLGtCQUFRLEtBQUssT0FBTyxLQUFLLFFBQVE7QUFBQSxpQkFDeEI7QUFFRCxtQkFBSyxPQUFPLFdBQVcsT0FBTyxHQUFHLENBQUM7QUFDbEM7QUFBQTtBQUlSLGVBQUssT0FBTyxLQUFLLFVBQVU7QUFDM0IsZUFBSyxLQUFLLEtBQUssVUFBVTtBQUN6QixlQUFLLFFBQVEsUUFBUSxVQUFVO0FBQy9CLGVBQUssT0FBTyxVQUFVLElBQUk7QUFDMUIsZUFBSyxZQUFZO0FBQUEsUUFDckI7QUFBQSxNQUNKO0FBQUE7QUFBQTs7O0FDcktBO0FBQUE7QUFBQTtBQUVBLFVBQU0sZUFBZSxDQUFDLE1BQWE7QUFGbkM7QUFHSSxjQUFNLFNBQW1DLEVBQUU7QUFDM0MsMkJBQU8sa0JBQVAsbUJBQXNCLGtCQUF0QixtQkFBcUMsVUFBVSxPQUFPO0FBQUEsTUFDMUQ7QUFDQSxVQUFNLG1CQUFtQixNQUFNO0FBQzNCLGlCQUFTLGlCQUFpQiwrQkFBK0IsRUFBRSxRQUFRLFNBQU87QUFDdEUsY0FBSSxpQkFBaUIsU0FBUyxZQUFZO0FBQzFDLGNBQUksaUJBQWlCLFlBQVksWUFBWTtBQUFBLFFBQ2pELENBQUM7QUFBQSxNQUNMO0FBV0EsYUFBTyxpQkFBaUIsUUFBUSxNQUFZO0FBQ3hDLFlBQUksU0FBUyxjQUFjLGVBQWUsR0FBRztBQUN6QyxnQkFBTSxRQUEwQixJQUFJLGlCQUFpQjtBQUNyRCxnQkFBTSxLQUFLO0FBQUEsUUFDZjtBQUNBLGNBQU0sT0FBeUMsU0FBUyxjQUFjLE1BQU07QUFHNUUsYUFBSyxpQkFBaUIsY0FBYyxDQUFDLE1BQWtCO0FBQ25ELFlBQUUsZUFBZTtBQUFBLFFBQ3JCLEdBQUcsRUFBRSxTQUFTLE1BQU0sQ0FBQztBQUVyQix5QkFBaUI7QUFBQSxNQUNyQixFQUFDO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFsiU3dhbCIsICJnbG9iYWxTdGF0ZSIsICJlcnJvciIsICJyZWplY3RQcm9taXNlIiwgImNvbmZpcm0iLCAiZSIsICJyZmRjIiwgInJmZGMiLCAiY29sb3IiLCAicCJdCn0K
