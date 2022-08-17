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
          switch (this.status.draw.getTool()) {
            case "scroll":
              this.action.zoomscroll.scroll(x, y);
              break;
          }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvUGFwZXJFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9kYXRhL0RyYXcudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd01pbmUudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd090aGVyLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvTW91c2VTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL3NlbnNvci9Qb2ludGVyU2Vuc29yLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvVG91Y2hTZW5zb3IudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy91L3UudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvU2F2ZUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9Mb2FkQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd1N0YXR1cy50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmZkYy9pbmRleC5qcyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYWN0aW9uL1BlbkFjdGlvbi50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9VbmRvRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYWN0aW9uL1pvb21TY3JvbGxBY3Rpb24udHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvWm9vbUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvRXJhc2VyRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9Db2xvckVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvQmFja0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL0RyYXdFdmVudEhhbmRsZXIudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FwcC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXG5leHBvcnQgY2xhc3MgUGFwZXJFbGVtZW50IHtcbiAgICBwcml2YXRlIGNudjogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU1pbmUoKTogUGFwZXJFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXBlckVsZW1lbnQoXCIjbXljYW52YXNcIik7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgbWFrZU90aGVyKCk6IFBhcGVyRWxlbWVudCB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXJFbGVtZW50KFwiI290aGVyY2FudmFzXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNudi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEN0eCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRDbnYoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jbnY7XG4gICAgfVxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdzogbnVtYmVyID0gdGhpcy5jbnYud2lkdGg7XG4gICAgICAgIGNvbnN0IGg6IG51bWJlciA9IHRoaXMuY252LmhlaWdodDtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHcsIGgpO1xuICAgIH1cbn1cbiIsICJleHBvcnQgY2xhc3MgRHJhdyB7XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzOiBTdHJva2VbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zID0gW107XG4gICAgfVxuICAgIHB1YmxpYyBwdXNoKHA6IFN0cm9rZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnMucHVzaChwKTtcbiAgICB9XG4gICAgcHVibGljIHBvcCgpOiBTdHJva2UgfCBudWxsIHtcbiAgICAgICAgY29uc3QgcmV0OiBTdHJva2UgPSB0aGlzLnMucG9wKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBwZWVrKCk6IFN0cm9rZSB8IG51bGwge1xuICAgICAgICBjb25zdCByZXQ6IFN0cm9rZSA9IHRoaXMucy5sZW5ndGggPiAwID8gdGhpcy5zW3RoaXMucy5sZW5ndGggLSAxXSA6IG51bGw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRTdHJva2VzKCk6IFN0cm9rZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucztcbiAgICB9XG4gICAgcHVibGljIGxhc3RTdHJva2VzKCk6IFN0cm9rZSB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNbdGhpcy5zLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBqc29uKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwIG9mIHRoaXMucykge1xuICAgICAgICAgICAgcmV0LnB1c2gocC5qc29uKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgWyR7cmV0LmpvaW4oXCIsXCIpfV1gO1xuICAgIH1cbiAgICBwdWJsaWMgcGFyc2Uoc3Ryb2tlczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBjb25zdCB0bXAgPSBuZXcgU3Ryb2tlKCk7XG4gICAgICAgICAgICB0bXAucGFyc2Uoc1swXSwgc1sxXSk7XG4gICAgICAgICAgICB0aGlzLnMucHVzaCh0bXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucy5sZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN0cm9rZSB7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUS19FUkFTRVIgPSBcImVcIjtcblxuICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nOyAvLyBcdTZEODhcdTMwNTdcdTMwQjRcdTMwRTBcdTMwNkVcdTU4MzRcdTU0MDhcdTMwNkZlXHUzMDZFXHUzMDdGXG4gICAgcHJpdmF0ZSBwOiBQb2ludFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIHB1c2gocDogUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wLnB1c2gocCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRQb2ludHMoKTogUG9pbnRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnA7XG4gICAgfVxuICAgIHB1YmxpYyBsYXN0UG9pbnQoKTogUG9pbnQgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMucC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucFt0aGlzLnAubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wLmxlbmd0aDtcbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5wKSB7XG4gICAgICAgICAgICByZXQucHVzaChwLmpzb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBbXCIke3RoaXMuY29sb3J9XCIsWyR7cmV0LmpvaW4oXCIsXCIpfV1dYDtcbiAgICB9XG4gICAgcHVibGljIHBhcnNlKGNvbG9yOiBzdHJpbmcsIGFycjogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnAgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGFycikge1xuXG4gICAgICAgICAgICBjb25zdCB0bXAgPSBuZXcgUG9pbnQocGFyc2VJbnQoYVswXSksIHBhcnNlSW50KGFbMV0pKTtcbiAgICAgICAgICAgIHRoaXMucC5wdXNoKHRtcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGlzRXJhc2VyKCkge1xuICAgICAgICBjb25zdCByZXQgPSB0aGlzLmNvbG9yID09PSBTdHJva2UuVEtfRVJBU0VSO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwdWJsaWMgaXNQZW4oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0VyYXNlcigpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50IHtcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0ID0gYFske3RoaXMueH0sJHt0aGlzLnl9XWA7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBpc1NhbWUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgY29uZDE6IGJvb2xlYW4gPSB4ID09PSB0aGlzLng7XG4gICAgICAgIGNvbnN0IGNvbmQyOiBib29sZWFuID0geSA9PT0gdGhpcy55O1xuICAgICAgICByZXR1cm4gY29uZDEgJiYgY29uZDI7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXcsIFN0cm9rZSwgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1BlbkFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd01pbmUge1xuICAgIHByaXZhdGUgZHJhdzogRHJhdztcbiAgICBwcml2YXRlIG5vd3N0cm9rZTogU3Ryb2tlO1xuICAgIHByaXZhdGUgdXNlcl9pZDogc3RyaW5nO1xuICAgIHByaXZhdGUgcGFwZXJfaWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuICAgIHByaXZhdGUgc2F2ZWRTdHJva2U6IFN0cm9rZTsgLy8gXHU0RkREXHU1QjU4XHUzMDU3XHUzMDVGXHUzMDY4XHUzMDREXHUzMDZFc3Ryb2tlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcbiAgICAgICAgdGhpcy5ub3dzdHJva2UgPSBuZXcgU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMudXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGNvbnN0IHVybHM6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgY29uc3QgcGFwZXJfaWQ6IG51bWJlciA9IHBhcnNlSW50KHVybHNbdXJscy5sZW5ndGggLSAxXSk7XG4gICAgICAgIHRoaXMucGFwZXJfaWQgPSBwYXBlcl9pZDtcbiAgICAgICAgdGhpcy5zYXZlZFN0cm9rZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgfVxuXG4gICAgcHVibGljIHB1c2hQb2ludCh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAodGhpcy5ub3dzdHJva2UubGVuZ3RoKCkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFx1NjcwMFx1NTIxRFx1MzA2RVx1NzBCOVx1MzA2QVx1MzA4OWNvbG9yXHUzMDZFXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICB0aGlzLm5vd3N0cm9rZS5jb2xvciA9IHRoaXMucGVuLm9wdC5lcmFzZXIgPyBTdHJva2UuVEtfRVJBU0VSIDogdGhpcy5wZW4ub3B0LmNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSBuZXcgUG9pbnQoeCwgeSk7XG4gICAgICAgIHRoaXMubm93c3Ryb2tlLnB1c2gocCk7XG4gICAgfVxuXG4gICAgcHVibGljIGxhc3RQb2ludCgpOiBQb2ludCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3dzdHJva2UubGFzdFBvaW50KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGVuZFN0cm9rZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gU3Ryb2tlXHUzMDRDXHU3RDQyXHUzMDhGXHUzMDYzXHUzMDVGXHUzMDZFXHUzMDY3ZHJhd1x1MzA2Qlx1MzBEN1x1MzBDM1x1MzBCN1x1MzBFNVxuICAgICAgICBpZiAodGhpcy5ub3dzdHJva2UubGVuZ3RoKCkgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXcucHVzaCh0aGlzLm5vd3N0cm9rZSk7XG4gICAgICAgICAgICAvLyBcdTZCMjFcdTMwNkJcdTUwOTlcdTMwNDhcdTMwNjZzdHJva2VcdTMwOTJcdTMwQUZcdTMwRUFcdTMwQTJcbiAgICAgICAgICAgIHRoaXMubm93c3Ryb2tlID0gbmV3IFN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBzYXZlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGNvbnN0IHBhcGVyX2lkOiBudW1iZXIgPSBwYXJzZUludCh1cmxzW3VybHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICBjb25zdCB1cmwgPSBgL2FwaS9kcmF3LyR7cGFwZXJfaWR9YDtcbiAgICAgICAgY29uc3QgcG9zdGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgcG9zdGRhdGEuYXBwZW5kKFwianNvbl9kcmF3XCIsIHRoaXMuZHJhdy5qc29uKCkpO1xuICAgICAgICBwb3N0ZGF0YS5hcHBlbmQoXCJ1c2VyX2lkXCIsIHRoaXMudXNlcl9pZCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbjogUmVxdWVzdEluaXQgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogcG9zdGRhdGEsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdGlvbik7XG4gICAgICAgIGNvbnN0IHJlc19zYXZlID0gSlNPTi5wYXJzZShhd2FpdCByZXNwb25zZS50ZXh0KCkpO1xuICAgICAgICBpZiAodGhpcy51c2VyX2lkID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJfaWQgPSByZXNfc2F2ZS51c2VyX2lkLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zYXZlZFN0cm9rZSA9IHRoaXMuZHJhdy5wZWVrKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgL2FwaS9kcmF3LyR7dGhpcy5wYXBlcl9pZH0vbWluZS8ke3RoaXMudXNlcl9pZCA9PT0gbnVsbCA/IDAgOiB0aGlzLnVzZXJfaWR9YDtcbiAgICAgICAgICAgIGNvbnN0IHBvc3RkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBwb3N0ZGF0YS5hcHBlbmQoXCJqc29uX2RyYXdcIiwgdGhpcy5kcmF3Lmpzb24oKSk7XG4gICAgICAgICAgICBwb3N0ZGF0YS5hcHBlbmQoXCJ1c2VyX2lkXCIsIHRoaXMudXNlcl9pZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRpb246IFJlcXVlc3RJbml0ID0ge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogcG9zdGRhdGEsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgb3B0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc19sb2FkID0gSlNPTi5wYXJzZShhd2FpdCByZXNwb25zZS50ZXh0KCkpO1xuXG4gICAgICAgICAgICBsZXQgc3Ryb2tlczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZCBvZiAoPGFueVtdPnJlc19sb2FkLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkLmpzb25fZHJhdyk7XG4gICAgICAgICAgICAgICAgc3Ryb2tlcyA9IHN0cm9rZXMuY29uY2F0KG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRyYXcucGFyc2Uoc3Ryb2tlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHB1YmxpYyBhc3luYyBsb2FkQXhpb3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gICAgIGNvbnN0IGFwaV9sb2FkOiBNeUF4aW9zQXBpID0gd2luZG93LmF4aW9zLmdldChgL2FwaS9kcmF3LyR7dGhpcy5wYXBlcl9pZH0vbWluZS8ke3RoaXMudXNlcl9pZCA9PT0gbnVsbCA/IDAgOiB0aGlzLnVzZXJfaWR9YCk7XG5cbiAgICAvLyAgICAgdHJ5IHtcbiAgICAvLyAgICAgICAgIGNvbnN0IFtyZXNfbG9hZF0gPSBhd2FpdCB3aW5kb3cuYXhpb3MuYWxsKFthcGlfbG9hZF0pO1xuICAgIC8vICAgICAgICAgbGV0IHN0cm9rZXM6IGFueVtdID0gW107XG4gICAgLy8gICAgICAgICBmb3IgKGNvbnN0IGQgb2YgKDxhbnlbXT5yZXNfbG9hZC5kYXRhKSkge1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZC5qc29uX2RyYXcpO1xuICAgIC8vICAgICAgICAgICAgIHN0cm9rZXMgPSBzdHJva2VzLmNvbmNhdChvYmopO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgdGhpcy5kcmF3LnBhcnNlKHN0cm9rZXMpO1xuICAgIC8vICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICBwdWJsaWMgdW5kbygpOiBTdHJva2VbXSB7XG4gICAgICAgIHRoaXMuZHJhdy5nZXRTdHJva2VzKCkucG9wKCk7XG4gICAgICAgIGNvbnN0IHJldCA9IHRoaXMuZHJhdy5nZXRTdHJva2VzKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE5vd1N0cm9rZSgpOiBTdHJva2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3dzdHJva2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXHU0RkREXHU1QjU4XHUzMDU3XHUzMDVGXHUzMEI5XHUzMEM4XHUzMEVEXHUzMEZDXHUzMEFGXHU2NTcwXHUzMDRDXHU2QjYzXHUzMDU3XHUzMDUxXHUzMDhDXHUzMDcwXHU0RkREXHU1QjU4XHU2RTA4XHUzMDdGXHUzMDAyXHU1ODk3XHUzMDQ4XHUzMDhCXHUzMDcwXHUzMDRCXHUzMDhBXHUzMDY3XHUzMDZGXHUzMDZBXHUzMDRGXHUzMDAxdW5kb1x1MzA2N1x1NkUxQlx1MzA4Qlx1NTgzNFx1NTQwOFx1MzA4Mlx1MzA0Mlx1MzA4QVx1MzAwMlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1NhdmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByZXQ6IGJvb2xlYW4gPSB0aGlzLnNhdmVkU3Ryb2tlID09PSB0aGlzLmRyYXcucGVlaygpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3LCBTdHJva2UsIFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIERyYXdPdGhlciB7XG4gICAgcHJpdmF0ZSBkcmF3czogRHJhd1tdOyAvLyBcdTgxRUFcdTUyMDZcdTRFRTVcdTU5MTZcdUZGMURcdTg5MDdcdTY1NzBcdTRFQkFcdTMwNkVcdTMwQzdcdTMwRkNcdTMwQkZcdTMwNENcdTMwNDJcdTMwOEJcdTMwNUZcdTMwODFcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwcml2YXRlIHVzZXJfaWQ6IG51bWJlciB8IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kcmF3cyA9IFtdO1xuICAgICAgICB0aGlzLnVzZXJfaWQgPSBudWxsO1xuICAgICAgICBjb25zdCB1cmxzOiBzdHJpbmdbXSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGNvbnN0IHBhcGVyX2lkOiBudW1iZXIgPSBwYXJzZUludCh1cmxzW3VybHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB0aGlzLnBhcGVyX2lkID0gcGFwZXJfaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBsb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCB1cmwgPSBgL2FwaS9kcmF3LyR7dGhpcy5wYXBlcl9pZH0vb3RoZXIvJHt0aGlzLnVzZXJfaWQgPT09IG51bGwgPyAwIDogdGhpcy51c2VyX2lkfWA7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcblxuICAgICAgICBmb3IoY29uc3QgZCBvZiBKU09OLnBhcnNlKHRleHQpKSB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKGQuanNvbl9kcmF3KTtcbiAgICAgICAgICAgIGNvbnN0IGRyYXcgPSBuZXcgRHJhdygpO1xuICAgICAgICAgICAgZHJhdy5wYXJzZShvYmopO1xuICAgICAgICAgICAgdGhpcy5kcmF3cy5wdXNoKGRyYXcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldERyYXdzKCk6IERyYXdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdzO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4uL0RyYXdFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5cbmV4cG9ydCBjbGFzcyBNb3VzZVNlbnNvciB7XG4gICAgcHJpdmF0ZSBzZW5zZTogRHJhd0V2ZW50SGFuZGxlcjtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNldXBcIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZWRvd25cIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS5kb3duKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNlbW92ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLm1vdmUoXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2VsZWF2ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVEZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHAoZTogTW91c2VFdmVudCk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFBvaW50ZXJTZW5zb3Ige1xuICAgIHByaXZhdGUgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXI7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzaGFuZGxlcnM6ICgoZTogVG91Y2hFdmVudCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gICAgcHVibGljIGluaXQoc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5zZSA9IHNlbnNlO1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVydXBcIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcmRvd25cIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVybW92ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJsZWF2ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuYWRkRGVmYXVsdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHAoZSk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuZXhwb3J0IGNsYXNzIFRvdWNoU2Vuc29yIHtcbiAgICBwcml2YXRlIHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCwgem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsID0gem9vbXNjcm9sbDtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNoZW5kXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2hzdGFydFwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2htb3ZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaGxlYXZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGREZWZhdWx0TGlzdGVuZXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZURlZmF1bHRMaXN0ZW5lcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwKGU6IFRvdWNoRXZlbnQpOiBQb2ludCB7XG4gICAgICAgIGNvbnN0IGN0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXVxuICAgICAgICBjb25zdCBiYyA9ICg8SFRNTENhbnZhc0VsZW1lbnQ+ZS50YXJnZXQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB4ID0gY3QuY2xpZW50WCAtIGJjLmxlZnQ7XG4gICAgICAgIGNvbnN0IHkgPSBjdC5jbGllbnRZIC0gYmMudG9wO1xuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkV6b29tXHU0RjREXHU3RjZFXHUzMDZFXHU4OERDXHU2QjYzXHUzMDRDXHUzMDRCXHUzMDRCXHUzMDg5XHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU4QUJGXHU2NTc0XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCAvIHRoaXMuem9vbXNjcm9sbC5nZXRab29tKCksIHkgLyB0aGlzLnpvb21zY3JvbGwuZ2V0Wm9vbSgpKTtcbiAgICB9XG59XG4iLCAiLyohXG4qIHN3ZWV0YWxlcnQyIHYxMS40LjI2XG4qIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLlN3ZWV0YWxlcnQyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgY29uc3QgY29uc29sZVByZWZpeCA9ICdTd2VldEFsZXJ0MjonO1xuICAvKipcbiAgICogRmlsdGVyIHRoZSB1bmlxdWUgdmFsdWVzIGludG8gYSBuZXcgYXJyYXlcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG5cbiAgY29uc3QgdW5pcXVlQXJyYXkgPSBhcnIgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihhcnJbaV0pID09PSAtMSkge1xuICAgICAgICByZXN1bHQucHVzaChhcnJbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgYSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuICBjb25zdCBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBzdHIgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAvKipcbiAgICogU3RhbmRhcmRpemUgY29uc29sZSB3YXJuaW5nc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEFycmF5fSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IHdhcm4gPSBtZXNzYWdlID0+IHtcbiAgICBjb25zb2xlLndhcm4oXCJcIi5jb25jYXQoY29uc29sZVByZWZpeCwgXCIgXCIpLmNvbmNhdCh0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCcgPyBtZXNzYWdlLmpvaW4oJyAnKSA6IG1lc3NhZ2UpKTtcbiAgfTtcbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgZXJyb3JzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IGVycm9yID0gbWVzc2FnZSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihcIlwiLmNvbmNhdChjb25zb2xlUHJlZml4LCBcIiBcIikuY29uY2F0KG1lc3NhZ2UpKTtcbiAgfTtcbiAgLyoqXG4gICAqIFByaXZhdGUgZ2xvYmFsIHN0YXRlIGZvciBgd2Fybk9uY2VgXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgY29uc3QgcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzID0gW107XG4gIC8qKlxuICAgKiBTaG93IGEgY29uc29sZSB3YXJuaW5nLCBidXQgb25seSBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNob3duXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuXG4gIGNvbnN0IHdhcm5PbmNlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKCFwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMuaW5jbHVkZXMobWVzc2FnZSkpIHtcbiAgICAgIHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgd2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBTaG93IGEgb25lLXRpbWUgY29uc29sZSB3YXJuaW5nIGFib3V0IGRlcHJlY2F0ZWQgcGFyYW1zL21ldGhvZHNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlcHJlY2F0ZWRQYXJhbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlSW5zdGVhZFxuICAgKi9cblxuICBjb25zdCB3YXJuQWJvdXREZXByZWNhdGlvbiA9IChkZXByZWNhdGVkUGFyYW0sIHVzZUluc3RlYWQpID0+IHtcbiAgICB3YXJuT25jZShcIlxcXCJcIi5jb25jYXQoZGVwcmVjYXRlZFBhcmFtLCBcIlxcXCIgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuIFBsZWFzZSB1c2UgXFxcIlwiKS5jb25jYXQodXNlSW5zdGVhZCwgXCJcXFwiIGluc3RlYWQuXCIpKTtcbiAgfTtcbiAgLyoqXG4gICAqIElmIGBhcmdgIGlzIGEgZnVuY3Rpb24sIGNhbGwgaXQgKHdpdGggbm8gYXJndW1lbnRzIG9yIGNvbnRleHQpIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAgICogT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbiB8IGFueX0gYXJnXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuXG4gIGNvbnN0IGNhbGxJZkZ1bmN0aW9uID0gYXJnID0+IHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbicgPyBhcmcoKSA6IGFyZztcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc1RvUHJvbWlzZUZuID0gYXJnID0+IGFyZyAmJiB0eXBlb2YgYXJnLnRvUHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJztcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBhcmdcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuXG4gIGNvbnN0IGFzUHJvbWlzZSA9IGFyZyA9PiBoYXNUb1Byb21pc2VGbihhcmcpID8gYXJnLnRvUHJvbWlzZSgpIDogUHJvbWlzZS5yZXNvbHZlKGFyZyk7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1Byb21pc2UgPSBhcmcgPT4gYXJnICYmIFByb21pc2UucmVzb2x2ZShhcmcpID09PSBhcmc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG5cbiAgY29uc3QgZ2V0UmFuZG9tRWxlbWVudCA9IGFyciA9PiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuXG4gIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgdGl0bGU6ICcnLFxuICAgIHRpdGxlVGV4dDogJycsXG4gICAgdGV4dDogJycsXG4gICAgaHRtbDogJycsXG4gICAgZm9vdGVyOiAnJyxcbiAgICBpY29uOiB1bmRlZmluZWQsXG4gICAgaWNvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgaWNvbkh0bWw6IHVuZGVmaW5lZCxcbiAgICB0ZW1wbGF0ZTogdW5kZWZpbmVkLFxuICAgIHRvYXN0OiBmYWxzZSxcbiAgICBzaG93Q2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItc2hvdycsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLXNob3cnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24tc2hvdydcbiAgICB9LFxuICAgIGhpZGVDbGFzczoge1xuICAgICAgcG9wdXA6ICdzd2FsMi1oaWRlJyxcbiAgICAgIGJhY2tkcm9wOiAnc3dhbDItYmFja2Ryb3AtaGlkZScsXG4gICAgICBpY29uOiAnc3dhbDItaWNvbi1oaWRlJ1xuICAgIH0sXG4gICAgY3VzdG9tQ2xhc3M6IHt9LFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGNvbG9yOiB1bmRlZmluZWQsXG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAgaGVpZ2h0QXV0bzogdHJ1ZSxcbiAgICBhbGxvd091dHNpZGVDbGljazogdHJ1ZSxcbiAgICBhbGxvd0VzY2FwZUtleTogdHJ1ZSxcbiAgICBhbGxvd0VudGVyS2V5OiB0cnVlLFxuICAgIHN0b3BLZXlkb3duUHJvcGFnYXRpb246IHRydWUsXG4gICAga2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTogZmFsc2UsXG4gICAgc2hvd0NvbmZpcm1CdXR0b246IHRydWUsXG4gICAgc2hvd0RlbnlCdXR0b246IGZhbHNlLFxuICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgIHByZUNvbmZpcm06IHVuZGVmaW5lZCxcbiAgICBwcmVEZW55OiB1bmRlZmluZWQsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgY29uZmlybUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY29uZmlybUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgZGVueUJ1dHRvblRleHQ6ICdObycsXG4gICAgZGVueUJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgZGVueUJ1dHRvbkNvbG9yOiB1bmRlZmluZWQsXG4gICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCcsXG4gICAgY2FuY2VsQnV0dG9uQXJpYUxhYmVsOiAnJyxcbiAgICBjYW5jZWxCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGJ1dHRvbnNTdHlsaW5nOiB0cnVlLFxuICAgIHJldmVyc2VCdXR0b25zOiBmYWxzZSxcbiAgICBmb2N1c0NvbmZpcm06IHRydWUsXG4gICAgZm9jdXNEZW55OiBmYWxzZSxcbiAgICBmb2N1c0NhbmNlbDogZmFsc2UsXG4gICAgcmV0dXJuRm9jdXM6IHRydWUsXG4gICAgc2hvd0Nsb3NlQnV0dG9uOiBmYWxzZSxcbiAgICBjbG9zZUJ1dHRvbkh0bWw6ICcmdGltZXM7JyxcbiAgICBjbG9zZUJ1dHRvbkFyaWFMYWJlbDogJ0Nsb3NlIHRoaXMgZGlhbG9nJyxcbiAgICBsb2FkZXJIdG1sOiAnJyxcbiAgICBzaG93TG9hZGVyT25Db25maXJtOiBmYWxzZSxcbiAgICBzaG93TG9hZGVyT25EZW55OiBmYWxzZSxcbiAgICBpbWFnZVVybDogdW5kZWZpbmVkLFxuICAgIGltYWdlV2lkdGg6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUhlaWdodDogdW5kZWZpbmVkLFxuICAgIGltYWdlQWx0OiAnJyxcbiAgICB0aW1lcjogdW5kZWZpbmVkLFxuICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IGZhbHNlLFxuICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgcGFkZGluZzogdW5kZWZpbmVkLFxuICAgIGJhY2tncm91bmQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgIGlucHV0UGxhY2Vob2xkZXI6ICcnLFxuICAgIGlucHV0TGFiZWw6ICcnLFxuICAgIGlucHV0VmFsdWU6ICcnLFxuICAgIGlucHV0T3B0aW9uczoge30sXG4gICAgaW5wdXRBdXRvVHJpbTogdHJ1ZSxcbiAgICBpbnB1dEF0dHJpYnV0ZXM6IHt9LFxuICAgIGlucHV0VmFsaWRhdG9yOiB1bmRlZmluZWQsXG4gICAgcmV0dXJuSW5wdXRWYWx1ZU9uRGVueTogZmFsc2UsXG4gICAgdmFsaWRhdGlvbk1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBncm93OiBmYWxzZSxcbiAgICBwb3NpdGlvbjogJ2NlbnRlcicsXG4gICAgcHJvZ3Jlc3NTdGVwczogW10sXG4gICAgY3VycmVudFByb2dyZXNzU3RlcDogdW5kZWZpbmVkLFxuICAgIHByb2dyZXNzU3RlcHNEaXN0YW5jZTogdW5kZWZpbmVkLFxuICAgIHdpbGxPcGVuOiB1bmRlZmluZWQsXG4gICAgZGlkT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZFJlbmRlcjogdW5kZWZpbmVkLFxuICAgIHdpbGxDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZENsb3NlOiB1bmRlZmluZWQsXG4gICAgZGlkRGVzdHJveTogdW5kZWZpbmVkLFxuICAgIHNjcm9sbGJhclBhZGRpbmc6IHRydWVcbiAgfTtcbiAgY29uc3QgdXBkYXRhYmxlUGFyYW1zID0gWydhbGxvd0VzY2FwZUtleScsICdhbGxvd091dHNpZGVDbGljaycsICdiYWNrZ3JvdW5kJywgJ2J1dHRvbnNTdHlsaW5nJywgJ2NhbmNlbEJ1dHRvbkFyaWFMYWJlbCcsICdjYW5jZWxCdXR0b25Db2xvcicsICdjYW5jZWxCdXR0b25UZXh0JywgJ2Nsb3NlQnV0dG9uQXJpYUxhYmVsJywgJ2Nsb3NlQnV0dG9uSHRtbCcsICdjb2xvcicsICdjb25maXJtQnV0dG9uQXJpYUxhYmVsJywgJ2NvbmZpcm1CdXR0b25Db2xvcicsICdjb25maXJtQnV0dG9uVGV4dCcsICdjdXJyZW50UHJvZ3Jlc3NTdGVwJywgJ2N1c3RvbUNsYXNzJywgJ2RlbnlCdXR0b25BcmlhTGFiZWwnLCAnZGVueUJ1dHRvbkNvbG9yJywgJ2RlbnlCdXR0b25UZXh0JywgJ2RpZENsb3NlJywgJ2RpZERlc3Ryb3knLCAnZm9vdGVyJywgJ2hpZGVDbGFzcycsICdodG1sJywgJ2ljb24nLCAnaWNvbkNvbG9yJywgJ2ljb25IdG1sJywgJ2ltYWdlQWx0JywgJ2ltYWdlSGVpZ2h0JywgJ2ltYWdlVXJsJywgJ2ltYWdlV2lkdGgnLCAncHJlQ29uZmlybScsICdwcmVEZW55JywgJ3Byb2dyZXNzU3RlcHMnLCAncmV0dXJuRm9jdXMnLCAncmV2ZXJzZUJ1dHRvbnMnLCAnc2hvd0NhbmNlbEJ1dHRvbicsICdzaG93Q2xvc2VCdXR0b24nLCAnc2hvd0NvbmZpcm1CdXR0b24nLCAnc2hvd0RlbnlCdXR0b24nLCAndGV4dCcsICd0aXRsZScsICd0aXRsZVRleHQnLCAnd2lsbENsb3NlJ107XG4gIGNvbnN0IGRlcHJlY2F0ZWRQYXJhbXMgPSB7fTtcbiAgY29uc3QgdG9hc3RJbmNvbXBhdGlibGVQYXJhbXMgPSBbJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2FsbG93RW50ZXJLZXknLCAnYmFja2Ryb3AnLCAnZm9jdXNDb25maXJtJywgJ2ZvY3VzRGVueScsICdmb2N1c0NhbmNlbCcsICdyZXR1cm5Gb2N1cycsICdoZWlnaHRBdXRvJywgJ2tleWRvd25MaXN0ZW5lckNhcHR1cmUnXTtcbiAgLyoqXG4gICAqIElzIHZhbGlkIHBhcmFtZXRlclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1ZhbGlkUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlZmF1bHRQYXJhbXMsIHBhcmFtTmFtZSk7XG4gIH07XG4gIC8qKlxuICAgKiBJcyB2YWxpZCBwYXJhbWV0ZXIgZm9yIFN3YWwudXBkYXRlKCkgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVXBkYXRhYmxlUGFyYW1ldGVyID0gcGFyYW1OYW1lID0+IHtcbiAgICByZXR1cm4gdXBkYXRhYmxlUGFyYW1zLmluZGV4T2YocGFyYW1OYW1lKSAhPT0gLTE7XG4gIH07XG4gIC8qKlxuICAgKiBJcyBkZXByZWNhdGVkIHBhcmFtZXRlclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9XG4gICAqL1xuXG4gIGNvbnN0IGlzRGVwcmVjYXRlZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIGRlcHJlY2F0ZWRQYXJhbXNbcGFyYW1OYW1lXTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbVxuICAgKi9cblxuICBjb25zdCBjaGVja0lmUGFyYW1Jc1ZhbGlkID0gcGFyYW0gPT4ge1xuICAgIGlmICghaXNWYWxpZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm4oXCJVbmtub3duIHBhcmFtZXRlciBcXFwiXCIuY29uY2F0KHBhcmFtLCBcIlxcXCJcIikpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbVxuICAgKi9cblxuXG4gIGNvbnN0IGNoZWNrSWZUb2FzdFBhcmFtSXNWYWxpZCA9IHBhcmFtID0+IHtcbiAgICBpZiAodG9hc3RJbmNvbXBhdGlibGVQYXJhbXMuaW5jbHVkZXMocGFyYW0pKSB7XG4gICAgICB3YXJuKFwiVGhlIHBhcmFtZXRlciBcXFwiXCIuY29uY2F0KHBhcmFtLCBcIlxcXCIgaXMgaW5jb21wYXRpYmxlIHdpdGggdG9hc3RzXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cblxuICBjb25zdCBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKGlzRGVwcmVjYXRlZFBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgIHdhcm5BYm91dERlcHJlY2F0aW9uKHBhcmFtLCBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBTaG93IHJlbGV2YW50IHdhcm5pbmdzIGZvciBnaXZlbiBwYXJhbXNcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBpZiAoIXBhcmFtcy5iYWNrZHJvcCAmJiBwYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spIHtcbiAgICAgIHdhcm4oJ1wiYWxsb3dPdXRzaWRlQ2xpY2tcIiBwYXJhbWV0ZXIgcmVxdWlyZXMgYGJhY2tkcm9wYCBwYXJhbWV0ZXIgdG8gYmUgc2V0IHRvIGB0cnVlYCcpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICBjaGVja0lmUGFyYW1Jc1ZhbGlkKHBhcmFtKTtcblxuICAgICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgICBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQocGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzd2FsUHJlZml4ID0gJ3N3YWwyLSc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBpdGVtc1xuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cblxuICBjb25zdCBwcmVmaXggPSBpdGVtcyA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gaXRlbXMpIHtcbiAgICAgIHJlc3VsdFtpdGVtc1tpXV0gPSBzd2FsUHJlZml4ICsgaXRlbXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgY29uc3Qgc3dhbENsYXNzZXMgPSBwcmVmaXgoWydjb250YWluZXInLCAnc2hvd24nLCAnaGVpZ2h0LWF1dG8nLCAnaW9zZml4JywgJ3BvcHVwJywgJ21vZGFsJywgJ25vLWJhY2tkcm9wJywgJ25vLXRyYW5zaXRpb24nLCAndG9hc3QnLCAndG9hc3Qtc2hvd24nLCAnc2hvdycsICdoaWRlJywgJ2Nsb3NlJywgJ3RpdGxlJywgJ2h0bWwtY29udGFpbmVyJywgJ2FjdGlvbnMnLCAnY29uZmlybScsICdkZW55JywgJ2NhbmNlbCcsICdkZWZhdWx0LW91dGxpbmUnLCAnZm9vdGVyJywgJ2ljb24nLCAnaWNvbi1jb250ZW50JywgJ2ltYWdlJywgJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ2xhYmVsJywgJ3RleHRhcmVhJywgJ2lucHV0ZXJyb3InLCAnaW5wdXQtbGFiZWwnLCAndmFsaWRhdGlvbi1tZXNzYWdlJywgJ3Byb2dyZXNzLXN0ZXBzJywgJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAnLCAncHJvZ3Jlc3Mtc3RlcC1saW5lJywgJ2xvYWRlcicsICdsb2FkaW5nJywgJ3N0eWxlZCcsICd0b3AnLCAndG9wLXN0YXJ0JywgJ3RvcC1lbmQnLCAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2NlbnRlcicsICdjZW50ZXItc3RhcnQnLCAnY2VudGVyLWVuZCcsICdjZW50ZXItbGVmdCcsICdjZW50ZXItcmlnaHQnLCAnYm90dG9tJywgJ2JvdHRvbS1zdGFydCcsICdib3R0b20tZW5kJywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICdncm93LXJvdycsICdncm93LWNvbHVtbicsICdncm93LWZ1bGxzY3JlZW4nLCAncnRsJywgJ3RpbWVyLXByb2dyZXNzLWJhcicsICd0aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVyJywgJ3Njcm9sbGJhci1tZWFzdXJlJywgJ2ljb24tc3VjY2VzcycsICdpY29uLXdhcm5pbmcnLCAnaWNvbi1pbmZvJywgJ2ljb24tcXVlc3Rpb24nLCAnaWNvbi1lcnJvcicsICduby13YXInXSk7XG4gIGNvbnN0IGljb25UeXBlcyA9IHByZWZpeChbJ3N1Y2Nlc3MnLCAnd2FybmluZycsICdpbmZvJywgJ3F1ZXN0aW9uJywgJ2Vycm9yJ10pO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwb3B1cCBjb250YWluZXIgd2hpY2ggY29udGFpbnMgdGhlIGJhY2tkcm9wIGFuZCB0aGUgcG9wdXAgaXRzZWxmLlxuICAgKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDb250YWluZXIgPSAoKSA9PiBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmNvbnRhaW5lcikpO1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yU3RyaW5nXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGVsZW1lbnRCeVNlbGVjdG9yID0gc2VsZWN0b3JTdHJpbmcgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIHJldHVybiBjb250YWluZXIgPyBjb250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvclN0cmluZykgOiBudWxsO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBlbGVtZW50QnlDbGFzcyA9IGNsYXNzTmFtZSA9PiB7XG4gICAgcmV0dXJuIGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChjbGFzc05hbWUpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0UG9wdXAgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5wb3B1cCk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJY29uID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuaWNvbik7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRUaXRsZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLnRpdGxlKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEh0bWxDb250YWluZXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJbWFnZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmltYWdlKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldFByb2dyZXNzU3RlcHMgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcHMnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRWYWxpZGF0aW9uTWVzc2FnZSA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDb25maXJtQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbmZpcm0pKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldERlbnlCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZGVueSkpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW5wdXRMYWJlbCA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydpbnB1dC1sYWJlbCddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldExvYWRlciA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5sb2FkZXIpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENhbmNlbEJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jYW5jZWwpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEFjdGlvbnMgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5hY3Rpb25zKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldEZvb3RlciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmZvb3Rlcik7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRUaW1lclByb2dyZXNzQmFyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhciddKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldENsb3NlQnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuY2xvc2UpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vamt1cC9mb2N1c2FibGUvYmxvYi9tYXN0ZXIvaW5kZXguanNcblxuICBjb25zdCBmb2N1c2FibGUgPSBcIlxcbiAgYVtocmVmXSxcXG4gIGFyZWFbaHJlZl0sXFxuICBpbnB1dDpub3QoW2Rpc2FibGVkXSksXFxuICBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLFxcbiAgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLFxcbiAgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSxcXG4gIGlmcmFtZSxcXG4gIG9iamVjdCxcXG4gIGVtYmVkLFxcbiAgW3RhYmluZGV4PVxcXCIwXFxcIl0sXFxuICBbY29udGVudGVkaXRhYmxlXSxcXG4gIGF1ZGlvW2NvbnRyb2xzXSxcXG4gIHZpZGVvW2NvbnRyb2xzXSxcXG4gIHN1bW1hcnlcXG5cIjtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgKi9cblxuICBjb25zdCBnZXRGb2N1c2FibGVFbGVtZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleCA9IEFycmF5LmZyb20oZ2V0UG9wdXAoKS5xdWVyeVNlbGVjdG9yQWxsKCdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFt0YWJpbmRleD1cIjBcIl0pJykpIC8vIHNvcnQgYWNjb3JkaW5nIHRvIHRhYmluZGV4XG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IHRhYmluZGV4QSA9IHBhcnNlSW50KGEuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgIGNvbnN0IHRhYmluZGV4QiA9IHBhcnNlSW50KGIuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKTtcblxuICAgICAgaWYgKHRhYmluZGV4QSA+IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSBpZiAodGFiaW5kZXhBIDwgdGFiaW5kZXhCKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgY29uc3Qgb3RoZXJGb2N1c2FibGVFbGVtZW50cyA9IEFycmF5LmZyb20oZ2V0UG9wdXAoKS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZSkpLmZpbHRlcihlbCA9PiBlbC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgIT09ICctMScpO1xuICAgIHJldHVybiB1bmlxdWVBcnJheShmb2N1c2FibGVFbGVtZW50c1dpdGhUYWJpbmRleC5jb25jYXQob3RoZXJGb2N1c2FibGVFbGVtZW50cykpLmZpbHRlcihlbCA9PiBpc1Zpc2libGUoZWwpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc01vZGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5zaG93bikgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKSAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10pO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVG9hc3QgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdldFBvcHVwKCkgJiYgaGFzQ2xhc3MoZ2V0UG9wdXAoKSwgc3dhbENsYXNzZXMudG9hc3QpO1xuICB9O1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzTG9hZGluZyA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2V0UG9wdXAoKS5oYXNBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycpO1xuICB9O1xuXG4gIGNvbnN0IHN0YXRlcyA9IHtcbiAgICBwcmV2aW91c0JvZHlQYWRkaW5nOiBudWxsXG4gIH07XG4gIC8qKlxuICAgKiBTZWN1cmVseSBzZXQgaW5uZXJIVE1MIG9mIGFuIGVsZW1lbnRcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xOTI2XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICovXG5cbiAgY29uc3Qgc2V0SW5uZXJIdG1sID0gKGVsZW0sIGh0bWwpID0+IHtcbiAgICBlbGVtLnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAoaHRtbCkge1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKTtcbiAgICAgIEFycmF5LmZyb20ocGFyc2VkLnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9KTtcbiAgICAgIEFycmF5LmZyb20ocGFyc2VkLnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc0NsYXNzID0gKGVsZW0sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NMaXN0ID0gY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc0xpc3RbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUN1c3RvbUNsYXNzZXMgPSAoZWxlbSwgcGFyYW1zKSA9PiB7XG4gICAgQXJyYXkuZnJvbShlbGVtLmNsYXNzTGlzdCkuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKCFPYmplY3QudmFsdWVzKHN3YWxDbGFzc2VzKS5pbmNsdWRlcyhjbGFzc05hbWUpICYmICFPYmplY3QudmFsdWVzKGljb25UeXBlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhwYXJhbXMuc2hvd0NsYXNzKS5pbmNsdWRlcyhjbGFzc05hbWUpKSB7XG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKi9cblxuXG4gIGNvbnN0IGFwcGx5Q3VzdG9tQ2xhc3MgPSAoZWxlbSwgcGFyYW1zLCBjbGFzc05hbWUpID0+IHtcbiAgICByZW1vdmVDdXN0b21DbGFzc2VzKGVsZW0sIHBhcmFtcyk7XG5cbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdKSB7XG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdICE9PSAnc3RyaW5nJyAmJiAhcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0uZm9yRWFjaCkge1xuICAgICAgICByZXR1cm4gd2FybihcIkludmFsaWQgdHlwZSBvZiBjdXN0b21DbGFzcy5cIi5jb25jYXQoY2xhc3NOYW1lLCBcIiEgRXhwZWN0ZWQgc3RyaW5nIG9yIGl0ZXJhYmxlIG9iamVjdCwgZ290IFxcXCJcIikuY29uY2F0KHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSwgXCJcXFwiXCIpKTtcbiAgICAgIH1cblxuICAgICAgYWRkQ2xhc3MoZWxlbSwgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHVwXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL3JlbmRlcmVycy9yZW5kZXJJbnB1dCcpLklucHV0Q2xhc3N9IGlucHV0Q2xhc3NcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRJbnB1dCA9IChwb3B1cCwgaW5wdXRDbGFzcykgPT4ge1xuICAgIGlmICghaW5wdXRDbGFzcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3dpdGNoIChpbnB1dENsYXNzKSB7XG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1tpbnB1dENsYXNzXSkpO1xuXG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCIgaW5wdXRcIikpO1xuXG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYWRpbywgXCIgaW5wdXQ6Y2hlY2tlZFwiKSkgfHwgcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiIGlucHV0OmZpcnN0LWNoaWxkXCIpKTtcblxuICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmlucHV0KSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50fSBpbnB1dFxuICAgKi9cblxuICBjb25zdCBmb2N1c0lucHV0ID0gaW5wdXQgPT4ge1xuICAgIGlucHV0LmZvY3VzKCk7IC8vIHBsYWNlIGN1cnNvciBhdCBlbmQgb2YgdGV4dCBpbiB0ZXh0IGlucHV0XG5cbiAgICBpZiAoaW5wdXQudHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMzQ1OTE1XG4gICAgICBjb25zdCB2YWwgPSBpbnB1dC52YWx1ZTtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICBpbnB1dC52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvblxuICAgKi9cblxuICBjb25zdCB0b2dnbGVDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCwgY29uZGl0aW9uKSA9PiB7XG4gICAgaWYgKCF0YXJnZXQgfHwgIWNsYXNzTGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2xhc3NMaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgY2xhc3NMaXN0ID0gY2xhc3NMaXN0LnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cblxuICAgIGNsYXNzTGlzdC5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldC5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgIGNvbmRpdGlvbiA/IGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZGl0aW9uID8gdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKi9cblxuICBjb25zdCBhZGRDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCkgPT4ge1xuICAgIHRvZ2dsZUNsYXNzKHRhcmdldCwgY2xhc3NMaXN0LCB0cnVlKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgbnVsbH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW10gfCByZWFkb25seSBzdHJpbmdbXX0gY2xhc3NMaXN0XG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUNsYXNzID0gKHRhcmdldCwgY2xhc3NMaXN0KSA9PiB7XG4gICAgdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIGZhbHNlKTtcbiAgfTtcbiAgLyoqXG4gICAqIEdldCBkaXJlY3QgY2hpbGQgb2YgYW4gZWxlbWVudCBieSBjbGFzcyBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MgPSAoZWxlbSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsZW0uY2hpbGRyZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgaGFzQ2xhc3MoY2hpbGQsIGNsYXNzTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG5cbiAgY29uc3QgYXBwbHlOdW1lcmljYWxTdHlsZSA9IChlbGVtLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IFwiXCIuY29uY2F0KHBhcnNlSW50KHZhbHVlKSkpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSB8fCBwYXJzZUludCh2YWx1ZSkgPT09IDApIHtcbiAgICAgIGVsZW0uc3R5bGVbcHJvcGVydHldID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KHZhbHVlLCBcInB4XCIpIDogdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcGVydHkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpc3BsYXlcbiAgICovXG5cbiAgY29uc3Qgc2hvdyA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdmbGV4JztcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKi9cblxuICBjb25zdCBoaWRlID0gZWxlbSA9PiB7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAqL1xuXG4gIGNvbnN0IHNldFN0eWxlID0gKHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZSkgPT4ge1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgY29uc3QgZWwgPSBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHthbnl9IGNvbmRpdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGlzcGxheVxuICAgKi9cblxuICBjb25zdCB0b2dnbGUgPSBmdW5jdGlvbiAoZWxlbSwgY29uZGl0aW9uKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6ICdmbGV4JztcbiAgICBjb25kaXRpb24gPyBzaG93KGVsZW0sIGRpc3BsYXkpIDogaGlkZShlbGVtKTtcbiAgfTtcbiAgLyoqXG4gICAqIGJvcnJvd2VkIGZyb20ganF1ZXJ5ICQoZWxlbSkuaXMoJzp2aXNpYmxlJykgaW1wbGVtZW50YXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNWaXNpYmxlID0gZWxlbSA9PiAhIShlbGVtICYmIChlbGVtLm9mZnNldFdpZHRoIHx8IGVsZW0ub2Zmc2V0SGVpZ2h0IHx8IGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBhbGxCdXR0b25zQXJlSGlkZGVuID0gKCkgPT4gIWlzVmlzaWJsZShnZXRDb25maXJtQnV0dG9uKCkpICYmICFpc1Zpc2libGUoZ2V0RGVueUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlKGdldENhbmNlbEJ1dHRvbigpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1Njcm9sbGFibGUgPSBlbGVtID0+ICEhKGVsZW0uc2Nyb2xsSGVpZ2h0ID4gZWxlbS5jbGllbnRIZWlnaHQpO1xuICAvKipcbiAgICogYm9ycm93ZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDYzNTIxMTlcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaGFzQ3NzQW5pbWF0aW9uID0gZWxlbSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICBjb25zdCBhbmltRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2FuaW1hdGlvbi1kdXJhdGlvbicpIHx8ICcwJyk7XG4gICAgY29uc3QgdHJhbnNEdXJhdGlvbiA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNpdGlvbi1kdXJhdGlvbicpIHx8ICcwJyk7XG4gICAgcmV0dXJuIGFuaW1EdXJhdGlvbiA+IDAgfHwgdHJhbnNEdXJhdGlvbiA+IDA7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXNldFxuICAgKi9cblxuICBjb25zdCBhbmltYXRlVGltZXJQcm9ncmVzc0JhciA9IGZ1bmN0aW9uICh0aW1lcikge1xuICAgIGxldCByZXNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcblxuICAgIGlmIChpc1Zpc2libGUodGltZXJQcm9ncmVzc0JhcikpIHtcbiAgICAgIGlmIChyZXNldCkge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLnRyYW5zaXRpb24gPSBcIndpZHRoIFwiLmNvbmNhdCh0aW1lciAvIDEwMDAsIFwicyBsaW5lYXJcIik7XG4gICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMCUnO1xuICAgICAgfSwgMTApO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgc3RvcFRpbWVyUHJvZ3Jlc3NCYXIgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhciA9IGdldFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbicpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhckZ1bGxXaWR0aCA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRpbWVyUHJvZ3Jlc3NCYXIpLndpZHRoKTtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyUGVyY2VudCA9IHRpbWVyUHJvZ3Jlc3NCYXJXaWR0aCAvIHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggKiAxMDA7XG4gICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbicpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIlwiLmNvbmNhdCh0aW1lclByb2dyZXNzQmFyUGVyY2VudCwgXCIlXCIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgTm9kZSBlbnZcbiAgICpcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBjb25zdCBpc05vZGVFbnYgPSAoKSA9PiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnO1xuXG4gIGNvbnN0IFJFU1RPUkVfRk9DVVNfVElNRU9VVCA9IDEwMDtcblxuICAvKiogQHR5cGUge0dsb2JhbFN0YXRlfSAqL1xuXG4gIGNvbnN0IGdsb2JhbFN0YXRlID0ge307XG5cbiAgY29uc3QgZm9jdXNQcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5ib2R5KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmZvY3VzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUmVzdG9yZSBwcmV2aW91cyBhY3RpdmUgKGZvY3VzZWQpIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSByZXR1cm5Gb2N1c1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG5cblxuICBjb25zdCByZXN0b3JlQWN0aXZlRWxlbWVudCA9IHJldHVybkZvY3VzID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoIXJldHVybkZvY3VzKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHggPSB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgIGNvbnN0IHkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm9jdXNQcmV2aW91c0FjdGl2ZUVsZW1lbnQoKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwgUkVTVE9SRV9GT0NVU19USU1FT1VUKTsgLy8gaXNzdWVzLzkwMFxuXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeCwgeSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc3dlZXRIVE1MID0gXCJcXG4gPGRpdiBhcmlhLWxhYmVsbGVkYnk9XFxcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiIGFyaWEtZGVzY3JpYmVkYnk9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCJcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+XFxuICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNsb3NlLCBcIlxcXCI+PC9idXR0b24+XFxuICAgPHVsIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwcyddLCBcIlxcXCI+PC91bD5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiXFxcIj48L2Rpdj5cXG4gICA8aW1nIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmltYWdlLCBcIlxcXCIgLz5cXG4gICA8aDIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiPjwvaDI+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCI+PC9kaXY+XFxuICAgPGlucHV0IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmlucHV0LCBcIlxcXCIgLz5cXG4gICA8aW5wdXQgdHlwZT1cXFwiZmlsZVxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZmlsZSwgXCJcXFwiIC8+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCJcXFwiPlxcbiAgICAgPGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiAvPlxcbiAgICAgPG91dHB1dD48L291dHB1dD5cXG4gICA8L2Rpdj5cXG4gICA8c2VsZWN0IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnNlbGVjdCwgXCJcXFwiPjwvc2VsZWN0PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiXFxcIj48L2Rpdj5cXG4gICA8bGFiZWwgZm9yPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIlxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiXFxcIj5cXG4gICAgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgLz5cXG4gICAgIDxzcGFuIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmxhYmVsLCBcIlxcXCI+PC9zcGFuPlxcbiAgIDwvbGFiZWw+XFxuICAgPHRleHRhcmVhIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRleHRhcmVhLCBcIlxcXCI+PC90ZXh0YXJlYT5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCJcXFwiPlxcbiAgICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5sb2FkZXIsIFwiXFxcIj48L2Rpdj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb25maXJtLCBcIlxcXCI+PC9idXR0b24+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZGVueSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNhbmNlbCwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgIDwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZm9vdGVyLCBcIlxcXCI+PC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciddLCBcIlxcXCI+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXInXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDwvZGl2PlxcbiA8L2Rpdj5cXG5cIikucmVwbGFjZSgvKF58XFxuKVxccyovZywgJycpO1xuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IHJlc2V0T2xkQ29udGFpbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG9sZENvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuXG4gICAgaWYgKCFvbGRDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbGRDb250YWluZXIucmVtb3ZlKCk7XG4gICAgcmVtb3ZlQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIFtzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSwgc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10sIHN3YWxDbGFzc2VzWydoYXMtY29sdW1uJ11dKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZXNldFZhbGlkYXRpb25NZXNzYWdlID0gKCkgPT4ge1xuICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gIH07XG5cbiAgY29uc3QgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gICAgY29uc3QgZmlsZSA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuZmlsZSk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgcmFuZ2UgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgaW5wdXRcIikpO1xuICAgIC8qKiBAdHlwZSB7SFRNTE91dHB1dEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCByYW5nZU91dHB1dCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBvdXRwdXRcIikpO1xuICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgICAvKiogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBjaGVja2JveCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIiBpbnB1dFwiKSk7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRleHRhcmVhKTtcbiAgICBpbnB1dC5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBmaWxlLm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBzZWxlY3Qub25jaGFuZ2UgPSByZXNldFZhbGlkYXRpb25NZXNzYWdlO1xuICAgIGNoZWNrYm94Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICB0ZXh0YXJlYS5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcblxuICAgIHJhbmdlLm9uaW5wdXQgPSAoKSA9PiB7XG4gICAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICAgIH07XG5cbiAgICByYW5nZS5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIHJhbmdlT3V0cHV0LnZhbHVlID0gcmFuZ2UudmFsdWU7XG4gICAgfTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgSFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0VGFyZ2V0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpIDogdGFyZ2V0O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0dXBBY2Nlc3NpYmlsaXR5ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdyb2xlJywgcGFyYW1zLnRvYXN0ID8gJ2FsZXJ0JyA6ICdkaWFsb2cnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsIHBhcmFtcy50b2FzdCA/ICdwb2xpdGUnIDogJ2Fzc2VydGl2ZScpO1xuXG4gICAgaWYgKCFwYXJhbXMudG9hc3QpIHtcbiAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwUlRMID0gdGFyZ2V0RWxlbWVudCA9PiB7XG4gICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsZW1lbnQpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgIGFkZENsYXNzKGdldENvbnRhaW5lcigpLCBzd2FsQ2xhc3Nlcy5ydGwpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEFkZCBtb2RhbCArIGJhY2tkcm9wICsgbm8td2FyIG1lc3NhZ2UgZm9yIFJ1c3NpYW5zIHRvIERPTVxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBjb25zdCBpbml0ID0gcGFyYW1zID0+IHtcbiAgICAvLyBDbGVhbiB1cCB0aGUgb2xkIHBvcHVwIGNvbnRhaW5lciBpZiBpdCBleGlzdHNcbiAgICBjb25zdCBvbGRDb250YWluZXJFeGlzdGVkID0gcmVzZXRPbGRDb250YWluZXIoKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cblxuICAgIGlmIChpc05vZGVFbnYoKSkge1xuICAgICAgZXJyb3IoJ1N3ZWV0QWxlcnQyIHJlcXVpcmVzIGRvY3VtZW50IHRvIGluaXRpYWxpemUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuY29udGFpbmVyO1xuXG4gICAgaWYgKG9sZENvbnRhaW5lckV4aXN0ZWQpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gICAgfVxuXG4gICAgc2V0SW5uZXJIdG1sKGNvbnRhaW5lciwgc3dlZXRIVE1MKTtcbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZ2V0VGFyZ2V0KHBhcmFtcy50YXJnZXQpO1xuICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBzZXR1cEFjY2Vzc2liaWxpdHkocGFyYW1zKTtcbiAgICBzZXR1cFJUTCh0YXJnZXRFbGVtZW50KTtcbiAgICBhZGRJbnB1dENoYW5nZUxpc3RlbmVycygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgb2JqZWN0IHwgc3RyaW5nfSBwYXJhbVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICovXG5cbiAgY29uc3QgcGFyc2VIdG1sVG9Db250YWluZXIgPSAocGFyYW0sIHRhcmdldCkgPT4ge1xuICAgIC8vIERPTSBlbGVtZW50XG4gICAgaWYgKHBhcmFtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChwYXJhbSk7XG4gICAgfSAvLyBPYmplY3RcbiAgICBlbHNlIGlmICh0eXBlb2YgcGFyYW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBoYW5kbGVPYmplY3QocGFyYW0sIHRhcmdldCk7XG4gICAgfSAvLyBQbGFpbiBzdHJpbmdcbiAgICBlbHNlIGlmIChwYXJhbSkge1xuICAgICAgc2V0SW5uZXJIdG1sKHRhcmdldCwgcGFyYW0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlT2JqZWN0ID0gKHBhcmFtLCB0YXJnZXQpID0+IHtcbiAgICAvLyBKUXVlcnkgZWxlbWVudChzKVxuICAgIGlmIChwYXJhbS5qcXVlcnkpIHtcbiAgICAgIGhhbmRsZUpxdWVyeUVsZW0odGFyZ2V0LCBwYXJhbSk7XG4gICAgfSAvLyBGb3Igb3RoZXIgb2JqZWN0cyB1c2UgdGhlaXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uXG4gICAgZWxzZSB7XG4gICAgICBzZXRJbm5lckh0bWwodGFyZ2V0LCBwYXJhbS50b1N0cmluZygpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUpxdWVyeUVsZW0gPSAodGFyZ2V0LCBlbGVtKSA9PiB7XG4gICAgdGFyZ2V0LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAoMCBpbiBlbGVtKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgKGkgaW4gZWxlbSk7IGkrKykge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbVtpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQHJldHVybnMgeyd3ZWJraXRBbmltYXRpb25FbmQnIHwgJ2FuaW1hdGlvbmVuZCcgfCBmYWxzZX1cbiAgICovXG5cbiAgY29uc3QgYW5pbWF0aW9uRW5kRXZlbnQgPSAoKCkgPT4ge1xuICAgIC8vIFByZXZlbnQgcnVuIGluIE5vZGUgZW52XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRBbmltYXRpb246ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICAgLy8gQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhXG4gICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnIC8vIFN0YW5kYXJkIHN5bnRheFxuXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgaSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodHJhbnNFbmRFdmVudE5hbWVzLCBpKSAmJiB0eXBlb2YgdGVzdEVsLnN0eWxlW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gdHJhbnNFbmRFdmVudE5hbWVzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSkoKTtcblxuICAvKipcbiAgICogTWVhc3VyZSBzY3JvbGxiYXIgd2lkdGggZm9yIHBhZGRpbmcgYm9keSBkdXJpbmcgbW9kYWwgc2hvdy9oaWRlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9qcy9zcmMvbW9kYWwuanNcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG5cbiAgY29uc3QgbWVhc3VyZVNjcm9sbGJhciA9ICgpID0+IHtcbiAgICBjb25zdCBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbJ3Njcm9sbGJhci1tZWFzdXJlJ107XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJBY3Rpb25zID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpOyAvLyBBY3Rpb25zIChidXR0b25zKSB3cmFwcGVyXG5cbiAgICBpZiAoIXBhcmFtcy5zaG93Q29uZmlybUJ1dHRvbiAmJiAhcGFyYW1zLnNob3dEZW55QnV0dG9uICYmICFwYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbikge1xuICAgICAgaGlkZShhY3Rpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvdyhhY3Rpb25zKTtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGFjdGlvbnMsIHBhcmFtcywgJ2FjdGlvbnMnKTsgLy8gUmVuZGVyIGFsbCB0aGUgYnV0dG9uc1xuXG4gICAgcmVuZGVyQnV0dG9ucyhhY3Rpb25zLCBsb2FkZXIsIHBhcmFtcyk7IC8vIExvYWRlclxuXG4gICAgc2V0SW5uZXJIdG1sKGxvYWRlciwgcGFyYW1zLmxvYWRlckh0bWwpO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MobG9hZGVyLCBwYXJhbXMsICdsb2FkZXInKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjdGlvbnNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbG9hZGVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBmdW5jdGlvbiByZW5kZXJCdXR0b25zKGFjdGlvbnMsIGxvYWRlciwgcGFyYW1zKSB7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICBjb25zdCBkZW55QnV0dG9uID0gZ2V0RGVueUJ1dHRvbigpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpOyAvLyBSZW5kZXIgYnV0dG9uc1xuXG4gICAgcmVuZGVyQnV0dG9uKGNvbmZpcm1CdXR0b24sICdjb25maXJtJywgcGFyYW1zKTtcbiAgICByZW5kZXJCdXR0b24oZGVueUJ1dHRvbiwgJ2RlbnknLCBwYXJhbXMpO1xuICAgIHJlbmRlckJ1dHRvbihjYW5jZWxCdXR0b24sICdjYW5jZWwnLCBwYXJhbXMpO1xuICAgIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKTtcblxuICAgIGlmIChwYXJhbXMucmV2ZXJzZUJ1dHRvbnMpIHtcbiAgICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY2FuY2VsQnV0dG9uLCBjb25maXJtQnV0dG9uKTtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoZGVueUJ1dHRvbiwgY29uZmlybUJ1dHRvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjYW5jZWxCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGRlbnlCdXR0b24sIGxvYWRlcik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNvbmZpcm1CdXR0b24sIGxvYWRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb25maXJtQnV0dG9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRlbnlCdXR0b25cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FuY2VsQnV0dG9uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMuYnV0dG9uc1N0eWxpbmcpIHtcbiAgICAgIHJldHVybiByZW1vdmVDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTtcbiAgICB9XG5cbiAgICBhZGRDbGFzcyhbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTsgLy8gQnV0dG9ucyBiYWNrZ3JvdW5kIGNvbG9yc1xuXG4gICAgaWYgKHBhcmFtcy5jb25maXJtQnV0dG9uQ29sb3IpIHtcbiAgICAgIGNvbmZpcm1CdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmNvbmZpcm1CdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGNvbmZpcm1CdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5kZW55QnV0dG9uQ29sb3IpIHtcbiAgICAgIGRlbnlCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLmRlbnlCdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGRlbnlCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcikge1xuICAgICAgY2FuY2VsQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcjtcbiAgICAgIGFkZENsYXNzKGNhbmNlbEJ1dHRvbiwgc3dhbENsYXNzZXNbJ2RlZmF1bHQtb3V0bGluZSddKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55JyB8ICdjYW5jZWwnfSBidXR0b25UeXBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbihidXR0b24sIGJ1dHRvblR5cGUsIHBhcmFtcykge1xuICAgIHRvZ2dsZShidXR0b24sIHBhcmFtc1tcInNob3dcIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGJ1dHRvblR5cGUpLCBcIkJ1dHRvblwiKV0sICdpbmxpbmUtYmxvY2snKTtcbiAgICBzZXRJbm5lckh0bWwoYnV0dG9uLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25UZXh0XCIpXSk7IC8vIFNldCBjYXB0aW9uIHRleHRcblxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXNbXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25BcmlhTGFiZWxcIildKTsgLy8gQVJJQSBsYWJlbFxuICAgIC8vIEFkZCBidXR0b25zIGN1c3RvbSBjbGFzc2VzXG5cbiAgICBidXR0b24uY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbYnV0dG9uVHlwZV07XG4gICAgYXBwbHlDdXN0b21DbGFzcyhidXR0b24sIHBhcmFtcywgXCJcIi5jb25jYXQoYnV0dG9uVHlwZSwgXCJCdXR0b25cIikpO1xuICAgIGFkZENsYXNzKGJ1dHRvbiwgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uQ2xhc3NcIildKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ29udGFpbmVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcblxuICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIHBhcmFtcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBhcmFtcy5wb3NpdGlvbik7XG4gICAgaGFuZGxlR3Jvd1BhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmdyb3cpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY29udGFpbmVyLCBwYXJhbXMsICdjb250YWluZXInKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydiYWNrZHJvcCddfSBiYWNrZHJvcFxuICAgKi9cblxuICBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgYmFja2Ryb3ApIHtcbiAgICBpZiAodHlwZW9mIGJhY2tkcm9wID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSBiYWNrZHJvcDtcbiAgICB9IGVsc2UgaWYgKCFiYWNrZHJvcCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydwb3NpdGlvbiddfSBwb3NpdGlvblxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwb3NpdGlvbikge1xuICAgIGlmIChwb3NpdGlvbiBpbiBzd2FsQ2xhc3Nlcykge1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1twb3NpdGlvbl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB3YXJuKCdUaGUgXCJwb3NpdGlvblwiIHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJjZW50ZXJcIicpO1xuICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlcy5jZW50ZXIpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2dyb3cnXX0gZ3Jvd1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUdyb3dQYXJhbShjb250YWluZXIsIGdyb3cpIHtcbiAgICBpZiAoZ3JvdyAmJiB0eXBlb2YgZ3JvdyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGdyb3dDbGFzcyA9IFwiZ3Jvdy1cIi5jb25jYXQoZ3Jvdyk7XG5cbiAgICAgIGlmIChncm93Q2xhc3MgaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1tncm93Q2xhc3NdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtb2R1bGUgY29udGFpbnMgYFdlYWtNYXBgcyBmb3IgZWFjaCBlZmZlY3RpdmVseS1cInByaXZhdGUgIHByb3BlcnR5XCIgdGhhdCBhIGBTd2FsYCBoYXMuXG4gICAqIEZvciBleGFtcGxlLCB0byBzZXQgdGhlIHByaXZhdGUgcHJvcGVydHkgXCJmb29cIiBvZiBgdGhpc2AgdG8gXCJiYXJcIiwgeW91IGNhbiBgcHJpdmF0ZVByb3BzLmZvby5zZXQodGhpcywgJ2JhcicpYFxuICAgKiBUaGlzIGlzIHRoZSBhcHByb2FjaCB0aGF0IEJhYmVsIHdpbGwgcHJvYmFibHkgdGFrZSB0byBpbXBsZW1lbnQgcHJpdmF0ZSBtZXRob2RzL2ZpZWxkc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByaXZhdGUtbWV0aG9kc1xuICAgKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9wdWxsLzc1NTVcbiAgICogT25jZSB3ZSBoYXZlIHRoZSBjaGFuZ2VzIGZyb20gdGhhdCBQUiBpbiBCYWJlbCwgYW5kIG91ciBjb3JlIGNsYXNzIGZpdHMgcmVhc29uYWJsZSBpbiAqb25lIG1vZHVsZSpcbiAgICogICB0aGVuIHdlIGNhbiB1c2UgdGhhdCBsYW5ndWFnZSBmZWF0dXJlLlxuICAgKi9cbiAgdmFyIHByaXZhdGVQcm9wcyA9IHtcbiAgICBhd2FpdGluZ1Byb21pc2U6IG5ldyBXZWFrTWFwKCksXG4gICAgcHJvbWlzZTogbmV3IFdlYWtNYXAoKSxcbiAgICBpbm5lclBhcmFtczogbmV3IFdlYWtNYXAoKSxcbiAgICBkb21DYWNoZTogbmV3IFdlYWtNYXAoKVxuICB9O1xuXG4gIC8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9zd2VldGFsZXJ0Mi5kLnRzXCIvPlxuICAvKiogQHR5cGUge0lucHV0Q2xhc3NbXX0gKi9cblxuICBjb25zdCBpbnB1dENsYXNzZXMgPSBbJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ3RleHRhcmVhJ107XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySW5wdXQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICAgIGNvbnN0IHJlcmVuZGVyID0gIWlubmVyUGFyYW1zIHx8IHBhcmFtcy5pbnB1dCAhPT0gaW5uZXJQYXJhbXMuaW5wdXQ7XG4gICAgaW5wdXRDbGFzc2VzLmZvckVhY2goaW5wdXRDbGFzcyA9PiB7XG4gICAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXNbaW5wdXRDbGFzc10pOyAvLyBzZXQgYXR0cmlidXRlc1xuXG4gICAgICBzZXRBdHRyaWJ1dGVzKGlucHV0Q2xhc3MsIHBhcmFtcy5pbnB1dEF0dHJpYnV0ZXMpOyAvLyBzZXQgY2xhc3NcblxuICAgICAgaW5wdXRDb250YWluZXIuY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbaW5wdXRDbGFzc107XG5cbiAgICAgIGlmIChyZXJlbmRlcikge1xuICAgICAgICBoaWRlKGlucHV0Q29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwYXJhbXMuaW5wdXQpIHtcbiAgICAgIGlmIChyZXJlbmRlcikge1xuICAgICAgICBzaG93SW5wdXQocGFyYW1zKTtcbiAgICAgIH0gLy8gc2V0IGN1c3RvbSBjbGFzc1xuXG5cbiAgICAgIHNldEN1c3RvbUNsYXNzKHBhcmFtcyk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHNob3dJbnB1dCA9IHBhcmFtcyA9PiB7XG4gICAgaWYgKCFyZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XSkge1xuICAgICAgcmV0dXJuIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0ISBFeHBlY3RlZCBcXFwidGV4dFxcXCIsIFxcXCJlbWFpbFxcXCIsIFxcXCJwYXNzd29yZFxcXCIsIFxcXCJudW1iZXJcXFwiLCBcXFwidGVsXFxcIiwgXFxcInNlbGVjdFxcXCIsIFxcXCJyYWRpb1xcXCIsIFxcXCJjaGVja2JveFxcXCIsIFxcXCJ0ZXh0YXJlYVxcXCIsIFxcXCJmaWxlXFxcIiBvciBcXFwidXJsXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLmlucHV0LCBcIlxcXCJcIikpO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0SW5wdXRDb250YWluZXIocGFyYW1zLmlucHV0KTtcbiAgICBjb25zdCBpbnB1dCA9IHJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKGlucHV0Q29udGFpbmVyLCBwYXJhbXMpO1xuICAgIHNob3coaW5wdXRDb250YWluZXIpOyAvLyBpbnB1dCBhdXRvZm9jdXNcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqL1xuXG5cbiAgY29uc3QgcmVtb3ZlQXR0cmlidXRlcyA9IGlucHV0ID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gaW5wdXQuYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICBpZiAoIVsndHlwZScsICd2YWx1ZScsICdzdHlsZSddLmluY2x1ZGVzKGF0dHJOYW1lKSkge1xuICAgICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SW5wdXRDbGFzc30gaW5wdXRDbGFzc1xuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dEF0dHJpYnV0ZXMnXX0gaW5wdXRBdHRyaWJ1dGVzXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0QXR0cmlidXRlcyA9IChpbnB1dENsYXNzLCBpbnB1dEF0dHJpYnV0ZXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGdldElucHV0KGdldFBvcHVwKCksIGlucHV0Q2xhc3MpO1xuXG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlbW92ZUF0dHJpYnV0ZXMoaW5wdXQpO1xuXG4gICAgZm9yIChjb25zdCBhdHRyIGluIGlucHV0QXR0cmlidXRlcykge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKGF0dHIsIGlucHV0QXR0cmlidXRlc1thdHRyXSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0Q3VzdG9tQ2xhc3MgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZ2V0SW5wdXRDb250YWluZXIocGFyYW1zLmlucHV0KTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnb2JqZWN0Jykge1xuICAgICAgYWRkQ2xhc3MoaW5wdXRDb250YWluZXIsIHBhcmFtcy5jdXN0b21DbGFzcy5pbnB1dCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0SW5wdXRQbGFjZWhvbGRlciA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFpbnB1dC5wbGFjZWhvbGRlciB8fCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcjtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0lucHV0fSBpbnB1dFxuICAgKiBAcGFyYW0ge0lucHV0fSBwcmVwZW5kVG9cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0SW5wdXRMYWJlbCA9IChpbnB1dCwgcHJlcGVuZFRvLCBwYXJhbXMpID0+IHtcbiAgICBpZiAocGFyYW1zLmlucHV0TGFiZWwpIHtcbiAgICAgIGlucHV0LmlkID0gc3dhbENsYXNzZXMuaW5wdXQ7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBsYWJlbENsYXNzID0gc3dhbENsYXNzZXNbJ2lucHV0LWxhYmVsJ107XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGlucHV0LmlkKTtcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGxhYmVsQ2xhc3M7XG5cbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBhZGRDbGFzcyhsYWJlbCwgcGFyYW1zLmN1c3RvbUNsYXNzLmlucHV0TGFiZWwpO1xuICAgICAgfVxuXG4gICAgICBsYWJlbC5pbm5lclRleHQgPSBwYXJhbXMuaW5wdXRMYWJlbDtcbiAgICAgIHByZXBlbmRUby5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgbGFiZWwpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0J119IGlucHV0VHlwZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0SW5wdXRDb250YWluZXIgPSBpbnB1dFR5cGUgPT4ge1xuICAgIHJldHVybiBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MoZ2V0UG9wdXAoKSwgc3dhbENsYXNzZXNbaW5wdXRUeXBlXSB8fCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnQgfCBIVE1MT3V0cHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnNbJ2lucHV0VmFsdWUnXX0gaW5wdXRWYWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IGNoZWNrQW5kU2V0SW5wdXRWYWx1ZSA9IChpbnB1dCwgaW5wdXRWYWx1ZSkgPT4ge1xuICAgIGlmIChbJ3N0cmluZycsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2YgaW5wdXRWYWx1ZSkpIHtcbiAgICAgIGlucHV0LnZhbHVlID0gXCJcIi5jb25jYXQoaW5wdXRWYWx1ZSk7XG4gICAgfSBlbHNlIGlmICghaXNQcm9taXNlKGlucHV0VmFsdWUpKSB7XG4gICAgICB3YXJuKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0VmFsdWUhIEV4cGVjdGVkIFxcXCJzdHJpbmdcXFwiLCBcXFwibnVtYmVyXFxcIiBvciBcXFwiUHJvbWlzZVxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHR5cGVvZiBpbnB1dFZhbHVlLCBcIlxcXCJcIikpO1xuICAgIH1cbiAgfTtcbiAgLyoqIEB0eXBlIFJlY29yZDxzdHJpbmcsIChpbnB1dDogSW5wdXQgfCBIVE1MRWxlbWVudCwgcGFyYW1zOiBTd2VldEFsZXJ0T3B0aW9ucykgPT4gSW5wdXQ+ICovXG5cblxuICBjb25zdCByZW5kZXJJbnB1dFR5cGUgPSB7fTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuICByZW5kZXJJbnB1dFR5cGUudGV4dCA9IHJlbmRlcklucHV0VHlwZS5lbWFpbCA9IHJlbmRlcklucHV0VHlwZS5wYXNzd29yZCA9IHJlbmRlcklucHV0VHlwZS5udW1iZXIgPSByZW5kZXJJbnB1dFR5cGUudGVsID0gcmVuZGVySW5wdXRUeXBlLnVybCA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKGlucHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICBpbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5maWxlID0gKGlucHV0LCBwYXJhbXMpID0+IHtcbiAgICBzZXRJbnB1dExhYmVsKGlucHV0LCBpbnB1dCwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKGlucHV0LCBwYXJhbXMpO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFuZ2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5yYW5nZSA9IChyYW5nZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcmFuZ2VJbnB1dCA9IHJhbmdlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgY29uc3QgcmFuZ2VPdXRwdXQgPSByYW5nZS5xdWVyeVNlbGVjdG9yKCdvdXRwdXQnKTtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUocmFuZ2VJbnB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHJhbmdlSW5wdXQudHlwZSA9IHBhcmFtcy5pbnB1dDtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUocmFuZ2VPdXRwdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dExhYmVsKHJhbmdlSW5wdXQsIHJhbmdlLCBwYXJhbXMpO1xuICAgIHJldHVybiByYW5nZTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFNlbGVjdEVsZW1lbnR9IHNlbGVjdFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxTZWxlY3RFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS5zZWxlY3QgPSAoc2VsZWN0LCBwYXJhbXMpID0+IHtcbiAgICBzZWxlY3QudGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmIChwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHNldElubmVySHRtbChwbGFjZWhvbGRlciwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpO1xuICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgIHBsYWNlaG9sZGVyLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBsYWNlaG9sZGVyLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgc2V0SW5wdXRMYWJlbChzZWxlY3QsIHNlbGVjdCwgcGFyYW1zKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUucmFkaW8gPSByYWRpbyA9PiB7XG4gICAgcmFkaW8udGV4dENvbnRlbnQgPSAnJztcbiAgICByZXR1cm4gcmFkaW87XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxMYWJlbEVsZW1lbnR9IGNoZWNrYm94Q29udGFpbmVyXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuY2hlY2tib3ggPSAoY2hlY2tib3hDb250YWluZXIsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0SW5wdXQoZ2V0UG9wdXAoKSwgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3gudmFsdWUgPSAnMSc7XG4gICAgY2hlY2tib3guaWQgPSBzd2FsQ2xhc3Nlcy5jaGVja2JveDtcbiAgICBjaGVja2JveC5jaGVja2VkID0gQm9vbGVhbihwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgY29uc3QgbGFiZWwgPSBjaGVja2JveENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XG4gICAgc2V0SW5uZXJIdG1sKGxhYmVsLCBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcik7XG4gICAgcmV0dXJuIGNoZWNrYm94O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MVGV4dEFyZWFFbGVtZW50fSB0ZXh0YXJlYVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxUZXh0QXJlYUVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnRleHRhcmVhID0gKHRleHRhcmVhLCBwYXJhbXMpID0+IHtcbiAgICBjaGVja0FuZFNldElucHV0VmFsdWUodGV4dGFyZWEsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICBzZXRJbnB1dFBsYWNlaG9sZGVyKHRleHRhcmVhLCBwYXJhbXMpO1xuICAgIHNldElucHV0TGFiZWwodGV4dGFyZWEsIHRleHRhcmVhLCBwYXJhbXMpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cblxuICAgIGNvbnN0IGdldE1hcmdpbiA9IGVsID0+IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5tYXJnaW5MZWZ0KSArIHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5tYXJnaW5SaWdodCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjI5MVxuXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTY5OVxuICAgICAgaWYgKCdNdXRhdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbFBvcHVwV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnZXRQb3B1cCgpKS53aWR0aCk7XG5cbiAgICAgICAgY29uc3QgdGV4dGFyZWFSZXNpemVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHRhcmVhV2lkdGggPSB0ZXh0YXJlYS5vZmZzZXRXaWR0aCArIGdldE1hcmdpbih0ZXh0YXJlYSk7XG5cbiAgICAgICAgICBpZiAodGV4dGFyZWFXaWR0aCA+IGluaXRpYWxQb3B1cFdpZHRoKSB7XG4gICAgICAgICAgICBnZXRQb3B1cCgpLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGV4dGFyZWFXaWR0aCwgXCJweFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UG9wdXAoKS5zdHlsZS53aWR0aCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKHRleHRhcmVhUmVzaXplSGFuZGxlcikub2JzZXJ2ZSh0ZXh0YXJlYSwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ11cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRleHRhcmVhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ29udGVudCA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaHRtbENvbnRhaW5lciA9IGdldEh0bWxDb250YWluZXIoKTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGh0bWxDb250YWluZXIsIHBhcmFtcywgJ2h0bWxDb250YWluZXInKTsgLy8gQ29udGVudCBhcyBIVE1MXG5cbiAgICBpZiAocGFyYW1zLmh0bWwpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5odG1sLCBodG1sQ29udGFpbmVyKTtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfSAvLyBDb250ZW50IGFzIHBsYWluIHRleHRcbiAgICBlbHNlIGlmIChwYXJhbXMudGV4dCkge1xuICAgICAgaHRtbENvbnRhaW5lci50ZXh0Q29udGVudCA9IHBhcmFtcy50ZXh0O1xuICAgICAgc2hvdyhodG1sQ29udGFpbmVyLCAnYmxvY2snKTtcbiAgICB9IC8vIE5vIGNvbnRlbnRcbiAgICBlbHNlIHtcbiAgICAgIGhpZGUoaHRtbENvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgcmVuZGVySW5wdXQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJGb290ZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGZvb3RlciA9IGdldEZvb3RlcigpO1xuICAgIHRvZ2dsZShmb290ZXIsIHBhcmFtcy5mb290ZXIpO1xuXG4gICAgaWYgKHBhcmFtcy5mb290ZXIpIHtcbiAgICAgIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtcy5mb290ZXIsIGZvb3Rlcik7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhmb290ZXIsIHBhcmFtcywgJ2Zvb3RlcicpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQ2xvc2VCdXR0b24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZ2V0Q2xvc2VCdXR0b24oKTtcbiAgICBzZXRJbm5lckh0bWwoY2xvc2VCdXR0b24sIHBhcmFtcy5jbG9zZUJ1dHRvbkh0bWwpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoY2xvc2VCdXR0b24sIHBhcmFtcywgJ2Nsb3NlQnV0dG9uJyk7XG4gICAgdG9nZ2xlKGNsb3NlQnV0dG9uLCBwYXJhbXMuc2hvd0Nsb3NlQnV0dG9uKTtcbiAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXMuY2xvc2VCdXR0b25BcmlhTGFiZWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySWNvbiA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBjb25zdCBpY29uID0gZ2V0SWNvbigpOyAvLyBpZiB0aGUgZ2l2ZW4gaWNvbiBhbHJlYWR5IHJlbmRlcmVkLCBhcHBseSB0aGUgc3R5bGluZyB3aXRob3V0IHJlLXJlbmRlcmluZyB0aGUgaWNvblxuXG4gICAgaWYgKGlubmVyUGFyYW1zICYmIHBhcmFtcy5pY29uID09PSBpbm5lclBhcmFtcy5pY29uKSB7XG4gICAgICAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG4gICAgICBzZXRDb250ZW50KGljb24sIHBhcmFtcyk7XG4gICAgICBhcHBseVN0eWxlcyhpY29uLCBwYXJhbXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcGFyYW1zLmljb24gJiYgIXBhcmFtcy5pY29uSHRtbCkge1xuICAgICAgaGlkZShpY29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLmljb24gJiYgT2JqZWN0LmtleXMoaWNvblR5cGVzKS5pbmRleE9mKHBhcmFtcy5pY29uKSA9PT0gLTEpIHtcbiAgICAgIGVycm9yKFwiVW5rbm93biBpY29uISBFeHBlY3RlZCBcXFwic3VjY2Vzc1xcXCIsIFxcXCJlcnJvclxcXCIsIFxcXCJ3YXJuaW5nXFxcIiwgXFxcImluZm9cXFwiIG9yIFxcXCJxdWVzdGlvblxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHBhcmFtcy5pY29uLCBcIlxcXCJcIikpO1xuICAgICAgaGlkZShpY29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzaG93KGljb24pOyAvLyBDdXN0b20gb3IgZGVmYXVsdCBjb250ZW50XG5cbiAgICBzZXRDb250ZW50KGljb24sIHBhcmFtcyk7XG4gICAgYXBwbHlTdHlsZXMoaWNvbiwgcGFyYW1zKTsgLy8gQW5pbWF0ZSBpY29uXG5cbiAgICBhZGRDbGFzcyhpY29uLCBwYXJhbXMuc2hvd0NsYXNzLmljb24pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaWNvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgYXBwbHlTdHlsZXMgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgZm9yIChjb25zdCBpY29uVHlwZSBpbiBpY29uVHlwZXMpIHtcbiAgICAgIGlmIChwYXJhbXMuaWNvbiAhPT0gaWNvblR5cGUpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaWNvbiwgaWNvblR5cGVzW2ljb25UeXBlXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoaWNvbiwgaWNvblR5cGVzW3BhcmFtcy5pY29uXSk7IC8vIEljb24gY29sb3JcblxuICAgIHNldENvbG9yKGljb24sIHBhcmFtcyk7IC8vIFN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yXG5cbiAgICBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpOyAvLyBDdXN0b20gY2xhc3NcblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoaWNvbiwgcGFyYW1zLCAnaWNvbicpO1xuICB9OyAvLyBBZGp1c3Qgc3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3IgdG8gbWF0Y2ggdGhlIHBvcHVwIGJhY2tncm91bmQgY29sb3JcblxuXG4gIGNvbnN0IGFkanVzdFN1Y2Nlc3NJY29uQmFja2dyb3VuZENvbG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBwb3B1cEJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBvcHVwKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgLyoqIEB0eXBlIHtOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pn0gKi9cblxuICAgIGNvbnN0IHN1Y2Nlc3NJY29uUGFydHMgPSBwb3B1cC5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV0sIC5zd2FsMi1zdWNjZXNzLWZpeCcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWNjZXNzSWNvblBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWNjZXNzSWNvblBhcnRzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBvcHVwQmFja2dyb3VuZENvbG9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzdWNjZXNzSWNvbkh0bWwgPSBcIlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLWxlZnRcXFwiPjwvZGl2PlxcbiAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS10aXBcXFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nXFxcIj48L3NwYW4+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLXJpbmdcXFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWZpeFxcXCI+PC9kaXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHRcXFwiPjwvZGl2PlxcblwiO1xuICBjb25zdCBlcnJvckljb25IdG1sID0gXCJcXG4gIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmtcXFwiPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtbGVmdFxcXCI+PC9zcGFuPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrLWxpbmUtcmlnaHRcXFwiPjwvc3Bhbj5cXG4gIDwvc3Bhbj5cXG5cIjtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHNldENvbnRlbnQgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgbGV0IG9sZENvbnRlbnQgPSBpY29uLmlubmVySFRNTDtcbiAgICBsZXQgbmV3Q29udGVudDtcblxuICAgIGlmIChwYXJhbXMuaWNvbkh0bWwpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBpY29uQ29udGVudChwYXJhbXMuaWNvbkh0bWwpO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zLmljb24gPT09ICdzdWNjZXNzJykge1xuICAgICAgbmV3Q29udGVudCA9IHN1Y2Nlc3NJY29uSHRtbDtcbiAgICAgIG9sZENvbnRlbnQgPSBvbGRDb250ZW50LnJlcGxhY2UoLyBzdHlsZT1cIi4qP1wiL2csICcnKTsgLy8gdW5kbyBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvcigpXG4gICAgfSBlbHNlIGlmIChwYXJhbXMuaWNvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgbmV3Q29udGVudCA9IGVycm9ySWNvbkh0bWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRJY29uSHRtbCA9IHtcbiAgICAgICAgcXVlc3Rpb246ICc/JyxcbiAgICAgICAgd2FybmluZzogJyEnLFxuICAgICAgICBpbmZvOiAnaSdcbiAgICAgIH07XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQoZGVmYXVsdEljb25IdG1sW3BhcmFtcy5pY29uXSk7XG4gICAgfVxuXG4gICAgaWYgKG9sZENvbnRlbnQudHJpbSgpICE9PSBuZXdDb250ZW50LnRyaW0oKSkge1xuICAgICAgc2V0SW5uZXJIdG1sKGljb24sIG5ld0NvbnRlbnQpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3Qgc2V0Q29sb3IgPSAoaWNvbiwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMuaWNvbkNvbG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWNvbi5zdHlsZS5jb2xvciA9IHBhcmFtcy5pY29uQ29sb3I7XG4gICAgaWNvbi5zdHlsZS5ib3JkZXJDb2xvciA9IHBhcmFtcy5pY29uQ29sb3I7XG5cbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBbJy5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwJywgJy5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZycsICcuc3dhbDIteC1tYXJrLWxpbmUtbGVmdCcsICcuc3dhbDIteC1tYXJrLWxpbmUtcmlnaHQnXSkge1xuICAgICAgc2V0U3R5bGUoaWNvbiwgc2VsLCAnYmFja2dyb3VuZENvbG9yJywgcGFyYW1zLmljb25Db2xvcik7XG4gICAgfVxuXG4gICAgc2V0U3R5bGUoaWNvbiwgJy5zd2FsMi1zdWNjZXNzLXJpbmcnLCAnYm9yZGVyQ29sb3InLCBwYXJhbXMuaWNvbkNvbG9yKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuXG5cbiAgY29uc3QgaWNvbkNvbnRlbnQgPSBjb250ZW50ID0+IFwiPGRpdiBjbGFzcz1cXFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzWydpY29uLWNvbnRlbnQnXSwgXCJcXFwiPlwiKS5jb25jYXQoY29udGVudCwgXCI8L2Rpdj5cIik7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJJbWFnZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBnZXRJbWFnZSgpO1xuXG4gICAgaWYgKCFwYXJhbXMuaW1hZ2VVcmwpIHtcbiAgICAgIHJldHVybiBoaWRlKGltYWdlKTtcbiAgICB9XG5cbiAgICBzaG93KGltYWdlLCAnJyk7IC8vIFNyYywgYWx0XG5cbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhcmFtcy5pbWFnZVVybCk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdhbHQnLCBwYXJhbXMuaW1hZ2VBbHQpOyAvLyBXaWR0aCwgaGVpZ2h0XG5cbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKGltYWdlLCAnd2lkdGgnLCBwYXJhbXMuaW1hZ2VXaWR0aCk7XG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ2hlaWdodCcsIHBhcmFtcy5pbWFnZUhlaWdodCk7IC8vIENsYXNzXG5cbiAgICBpbWFnZS5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5pbWFnZTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGltYWdlLCBwYXJhbXMsICdpbWFnZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyUHJvZ3Jlc3NTdGVwcyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lciA9IGdldFByb2dyZXNzU3RlcHMoKTtcblxuICAgIGlmICghcGFyYW1zLnByb2dyZXNzU3RlcHMgfHwgcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaGlkZShwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBzaG93KHByb2dyZXNzU3RlcHNDb250YWluZXIpO1xuICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIudGV4dENvbnRlbnQgPSAnJztcblxuICAgIGlmIChwYXJhbXMuY3VycmVudFByb2dyZXNzU3RlcCA+PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGgpIHtcbiAgICAgIHdhcm4oJ0ludmFsaWQgY3VycmVudFByb2dyZXNzU3RlcCBwYXJhbWV0ZXIsIGl0IHNob3VsZCBiZSBsZXNzIHRoYW4gcHJvZ3Jlc3NTdGVwcy5sZW5ndGggJyArICcoY3VycmVudFByb2dyZXNzU3RlcCBsaWtlIEpTIGFycmF5cyBzdGFydHMgZnJvbSAwKScpO1xuICAgIH1cblxuICAgIHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmZvckVhY2goKHN0ZXAsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzdGVwRWwgPSBjcmVhdGVTdGVwRWxlbWVudChzdGVwKTtcbiAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RlcEVsKTtcblxuICAgICAgaWYgKGluZGV4ID09PSBwYXJhbXMuY3VycmVudFByb2dyZXNzU3RlcCkge1xuICAgICAgICBhZGRDbGFzcyhzdGVwRWwsIHN3YWxDbGFzc2VzWydhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4ICE9PSBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IGxpbmVFbCA9IGNyZWF0ZUxpbmVFbGVtZW50KHBhcmFtcyk7XG4gICAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQobGluZUVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGVwXG4gICAqIEByZXR1cm5zIHtIVE1MTElFbGVtZW50fVxuICAgKi9cblxuICBjb25zdCBjcmVhdGVTdGVwRWxlbWVudCA9IHN0ZXAgPT4ge1xuICAgIGNvbnN0IHN0ZXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICBzZXRJbm5lckh0bWwoc3RlcEVsLCBzdGVwKTtcbiAgICByZXR1cm4gc3RlcEVsO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MTElFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGNyZWF0ZUxpbmVFbGVtZW50ID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBsaW5lRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGFkZENsYXNzKGxpbmVFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAtbGluZSddKTtcblxuICAgIGlmIChwYXJhbXMucHJvZ3Jlc3NTdGVwc0Rpc3RhbmNlKSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKGxpbmVFbCwgJ3dpZHRoJywgcGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmVFbDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclRpdGxlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCB0aXRsZSA9IGdldFRpdGxlKCk7XG4gICAgdG9nZ2xlKHRpdGxlLCBwYXJhbXMudGl0bGUgfHwgcGFyYW1zLnRpdGxlVGV4dCwgJ2Jsb2NrJyk7XG5cbiAgICBpZiAocGFyYW1zLnRpdGxlKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMudGl0bGUsIHRpdGxlKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLnRpdGxlVGV4dCkge1xuICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gcGFyYW1zLnRpdGxlVGV4dDtcbiAgICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKHRpdGxlLCBwYXJhbXMsICd0aXRsZScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyUG9wdXAgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTsgLy8gV2lkdGhcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIxNzBcblxuICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgICAgcG9wdXAuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICBwb3B1cC5pbnNlcnRCZWZvcmUoZ2V0TG9hZGVyKCksIGdldEljb24oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICd3aWR0aCcsIHBhcmFtcy53aWR0aCk7XG4gICAgfSAvLyBQYWRkaW5nXG5cblxuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUocG9wdXAsICdwYWRkaW5nJywgcGFyYW1zLnBhZGRpbmcpOyAvLyBDb2xvclxuXG4gICAgaWYgKHBhcmFtcy5jb2xvcikge1xuICAgICAgcG9wdXAuc3R5bGUuY29sb3IgPSBwYXJhbXMuY29sb3I7XG4gICAgfSAvLyBCYWNrZ3JvdW5kXG5cblxuICAgIGlmIChwYXJhbXMuYmFja2dyb3VuZCkge1xuICAgICAgcG9wdXAuc3R5bGUuYmFja2dyb3VuZCA9IHBhcmFtcy5iYWNrZ3JvdW5kO1xuICAgIH1cblxuICAgIGhpZGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSk7IC8vIENsYXNzZXNcblxuICAgIGFkZENsYXNzZXMocG9wdXAsIHBhcmFtcyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgYWRkQ2xhc3NlcyA9IChwb3B1cCwgcGFyYW1zKSA9PiB7XG4gICAgLy8gRGVmYXVsdCBDbGFzcyArIHNob3dDbGFzcyB3aGVuIHVwZGF0aW5nIFN3YWwudXBkYXRlKHt9KVxuICAgIHBvcHVwLmNsYXNzTmFtZSA9IFwiXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiBcIikuY29uY2F0KGlzVmlzaWJsZShwb3B1cCkgPyBwYXJhbXMuc2hvd0NsYXNzLnBvcHVwIDogJycpO1xuXG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddKTtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50b2FzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5tb2RhbCk7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhwb3B1cCwgcGFyYW1zLCAncG9wdXAnKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzID09PSAnc3RyaW5nJykge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHBhcmFtcy5jdXN0b21DbGFzcyk7XG4gICAgfSAvLyBJY29uIGNsYXNzICgjMTg0MilcblxuXG4gICAgaWYgKHBhcmFtcy5pY29uKSB7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXNbXCJpY29uLVwiLmNvbmNhdChwYXJhbXMuaWNvbildKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXIgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIHJlbmRlclBvcHVwKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNvbnRhaW5lcihpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJQcm9ncmVzc1N0ZXBzKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckljb24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVySW1hZ2UoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyVGl0bGUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ2xvc2VCdXR0b24oaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQ29udGVudChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJBY3Rpb25zKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckZvb3RlcihpbnN0YW5jZSwgcGFyYW1zKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLmRpZFJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGFyYW1zLmRpZFJlbmRlcihnZXRQb3B1cCgpKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgRGlzbWlzc1JlYXNvbiA9IE9iamVjdC5mcmVlemUoe1xuICAgIGNhbmNlbDogJ2NhbmNlbCcsXG4gICAgYmFja2Ryb3A6ICdiYWNrZHJvcCcsXG4gICAgY2xvc2U6ICdjbG9zZScsXG4gICAgZXNjOiAnZXNjJyxcbiAgICB0aW1lcjogJ3RpbWVyJ1xuICB9KTtcblxuICAvLyBBZGRpbmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdG8gZWxlbWVudHMgb3V0c2lkZSBvZiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyBlbnN1cmVzIHRoYXRcbiAgLy8gZWxlbWVudHMgbm90IHdpdGhpbiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyB3aWxsIG5vdCBiZSBzdXJmYWNlZCBpZiBhIHVzZXIgb3BlbnMgYSBzY3JlZW5cbiAgLy8gcmVhZGVyXHUyMDE5cyBsaXN0IG9mIGVsZW1lbnRzIChoZWFkaW5ncywgZm9ybSBjb250cm9scywgbGFuZG1hcmtzLCBldGMuKSBpbiB0aGUgZG9jdW1lbnQuXG5cbiAgY29uc3Qgc2V0QXJpYUhpZGRlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5Q2hpbGRyZW4gPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgIGJvZHlDaGlsZHJlbi5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbCA9PT0gZ2V0Q29udGFpbmVyKCkgfHwgZWwuY29udGFpbnMoZ2V0Q29udGFpbmVyKCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgfVxuXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgdW5zZXRBcmlhSGlkZGVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGJvZHlDaGlsZHJlbiA9IEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gICAgYm9keUNoaWxkcmVuLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKSk7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN3YWxTdHJpbmdQYXJhbXMgPSBbJ3N3YWwtdGl0bGUnLCAnc3dhbC1odG1sJywgJ3N3YWwtZm9vdGVyJ107XG4gIGNvbnN0IGdldFRlbXBsYXRlUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHR5cGVvZiBwYXJhbXMudGVtcGxhdGUgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGVtcGxhdGUpIDogcGFyYW1zLnRlbXBsYXRlO1xuXG4gICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICAvKiogQHR5cGUge0RvY3VtZW50RnJhZ21lbnR9ICovXG5cblxuICAgIGNvbnN0IHRlbXBsYXRlQ29udGVudCA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gICAgc2hvd1dhcm5pbmdzRm9yRWxlbWVudHModGVtcGxhdGVDb250ZW50KTtcbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3QuYXNzaWduKGdldFN3YWxQYXJhbXModGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEJ1dHRvbnModGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbEltYWdlKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJY29uKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJbnB1dCh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsU3RyaW5nUGFyYW1zKHRlbXBsYXRlQ29udGVudCwgc3dhbFN0cmluZ1BhcmFtcykpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuICBjb25zdCBnZXRTd2FsUGFyYW1zID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG5cbiAgICBjb25zdCBzd2FsUGFyYW1zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1wYXJhbScpKTtcbiAgICBzd2FsUGFyYW1zLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhwYXJhbSwgWyduYW1lJywgJ3ZhbHVlJ10pO1xuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblxuICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdib29sZWFuJyAmJiB2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGRlZmF1bHRQYXJhbXNbcGFyYW1OYW1lXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsQnV0dG9ucyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG4gICAgY29uc3Qgc3dhbEJ1dHRvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWJ1dHRvbicpKTtcbiAgICBzd2FsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGJ1dHRvbiwgWyd0eXBlJywgJ2NvbG9yJywgJ2FyaWEtbGFiZWwnXSk7XG4gICAgICBjb25zdCB0eXBlID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uVGV4dFwiKV0gPSBidXR0b24uaW5uZXJIVE1MO1xuICAgICAgcmVzdWx0W1wic2hvd1wiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIodHlwZSksIFwiQnV0dG9uXCIpXSA9IHRydWU7XG5cbiAgICAgIGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdjb2xvcicpKSB7XG4gICAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvbkNvbG9yXCIpXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdhcmlhLWxhYmVsJykpIHtcbiAgICAgICAgcmVzdWx0W1wiXCIuY29uY2F0KHR5cGUsIFwiQnV0dG9uQXJpYUxhYmVsXCIpXSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsSW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpbWFnZSA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWltYWdlJyk7XG5cbiAgICBpZiAoaW1hZ2UpIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaW1hZ2UsIFsnc3JjJywgJ3dpZHRoJywgJ2hlaWdodCcsICdhbHQnXSk7XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVVybCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ3dpZHRoJykpIHtcbiAgICAgICAgcmVzdWx0LmltYWdlV2lkdGggPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2hlaWdodCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUhlaWdodCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWFnZS5oYXNBdHRyaWJ1dGUoJ2FsdCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZUFsdCA9IGltYWdlLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEljb24gPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpY29uID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaWNvbicpO1xuXG4gICAgaWYgKGljb24pIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaWNvbiwgWyd0eXBlJywgJ2NvbG9yJ10pO1xuXG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSkge1xuICAgICAgICByZXN1bHQuaWNvbiA9IGljb24uZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpY29uLmhhc0F0dHJpYnV0ZSgnY29sb3InKSkge1xuICAgICAgICByZXN1bHQuaWNvbkNvbG9yID0gaWNvbi5nZXRBdHRyaWJ1dGUoJ2NvbG9yJyk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5pY29uSHRtbCA9IGljb24uaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxJbnB1dCA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cblxuICAgIGNvbnN0IGlucHV0ID0gdGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3N3YWwtaW5wdXQnKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhpbnB1dCwgWyd0eXBlJywgJ2xhYmVsJywgJ3BsYWNlaG9sZGVyJywgJ3ZhbHVlJ10pO1xuICAgICAgcmVzdWx0LmlucHV0ID0gaW5wdXQuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3RleHQnO1xuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdsYWJlbCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dExhYmVsID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdsYWJlbCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFBsYWNlaG9sZGVyID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dFZhbHVlID0gaW5wdXQuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG5cblxuICAgIGNvbnN0IGlucHV0T3B0aW9ucyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtaW5wdXQtb3B0aW9uJykpO1xuXG4gICAgaWYgKGlucHV0T3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5pbnB1dE9wdGlvbnMgPSB7fTtcbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMob3B0aW9uLCBbJ3ZhbHVlJ10pO1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBvcHRpb24uaW5uZXJIVE1MO1xuICAgICAgICByZXN1bHQuaW5wdXRPcHRpb25zW29wdGlvblZhbHVlXSA9IG9wdGlvbk5hbWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1OYW1lc1xuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxTdHJpbmdQYXJhbXMgPSAodGVtcGxhdGVDb250ZW50LCBwYXJhbU5hbWVzKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gcGFyYW1OYW1lcykge1xuICAgICAgY29uc3QgcGFyYW1OYW1lID0gcGFyYW1OYW1lc1tpXTtcbiAgICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICAgIGNvbnN0IHRhZyA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKHBhcmFtTmFtZSk7XG5cbiAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyh0YWcsIFtdKTtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZS5yZXBsYWNlKC9ec3dhbC0vLCAnJyldID0gdGFnLmlubmVySFRNTC50cmltKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yRWxlbWVudHMgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IGFsbG93ZWRFbGVtZW50cyA9IHN3YWxTdHJpbmdQYXJhbXMuY29uY2F0KFsnc3dhbC1wYXJhbScsICdzd2FsLWJ1dHRvbicsICdzd2FsLWltYWdlJywgJ3N3YWwtaWNvbicsICdzd2FsLWlucHV0JywgJ3N3YWwtaW5wdXQtb3B0aW9uJ10pO1xuICAgIEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LmNoaWxkcmVuKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChhbGxvd2VkRWxlbWVudHMuaW5kZXhPZih0YWdOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgd2FybihcIlVucmVjb2duaXplZCBlbGVtZW50IDxcIi5jb25jYXQodGFnTmFtZSwgXCI+XCIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbG93ZWRBdHRyaWJ1dGVzXG4gICAqL1xuXG5cbiAgY29uc3Qgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyA9IChlbCwgYWxsb3dlZEF0dHJpYnV0ZXMpID0+IHtcbiAgICBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcbiAgICAgIGlmIChhbGxvd2VkQXR0cmlidXRlcy5pbmRleE9mKGF0dHJpYnV0ZS5uYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgd2FybihbXCJVbnJlY29nbml6ZWQgYXR0cmlidXRlIFxcXCJcIi5jb25jYXQoYXR0cmlidXRlLm5hbWUsIFwiXFxcIiBvbiA8XCIpLmNvbmNhdChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIFwiPi5cIiksIFwiXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmxlbmd0aCA/IFwiQWxsb3dlZCBhdHRyaWJ1dGVzIGFyZTogXCIuY29uY2F0KGFsbG93ZWRBdHRyaWJ1dGVzLmpvaW4oJywgJykpIDogJ1RvIHNldCB0aGUgdmFsdWUsIHVzZSBIVE1MIHdpdGhpbiB0aGUgZWxlbWVudC4nKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHZhciBkZWZhdWx0SW5wdXRWYWxpZGF0b3JzID0ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkIHwgc3RyaW5nPn1cbiAgICAgKi9cbiAgICBlbWFpbDogKHN0cmluZywgdmFsaWRhdGlvbk1lc3NhZ2UpID0+IHtcbiAgICAgIHJldHVybiAvXlthLXpBLVowLTkuK18tXStAW2EtekEtWjAtOS4tXStcXC5bYS16QS1aMC05LV17MiwyNH0kLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBlbWFpbCBhZGRyZXNzJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkIHwgc3RyaW5nPn1cbiAgICAgKi9cbiAgICB1cmw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODA5NDM1IHdpdGggYSBzbWFsbCBjaGFuZ2UgZnJvbSAjMTMwNiBhbmQgIzIwMTNcbiAgICAgIHJldHVybiAvXmh0dHBzPzpcXC9cXC8od3d3XFwuKT9bLWEtekEtWjAtOUA6JS5fK34jPV17MSwyNTZ9XFwuW2Etel17Miw2M31cXGIoWy1hLXpBLVowLTlAOiVfKy5+Iz8mLz1dKikkLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSB8fCAnSW52YWxpZCBVUkwnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBmdW5jdGlvbiBzZXREZWZhdWx0SW5wdXRWYWxpZGF0b3JzKHBhcmFtcykge1xuICAgIC8vIFVzZSBkZWZhdWx0IGBpbnB1dFZhbGlkYXRvcmAgZm9yIHN1cHBvcnRlZCBpbnB1dCB0eXBlcyBpZiBub3QgcHJvdmlkZWRcbiAgICBpZiAoIXBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdElucHV0VmFsaWRhdG9ycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAocGFyYW1zLmlucHV0ID09PSBrZXkpIHtcbiAgICAgICAgICBwYXJhbXMuaW5wdXRWYWxpZGF0b3IgPSBkZWZhdWx0SW5wdXRWYWxpZGF0b3JzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcykge1xuICAgIC8vIERldGVybWluZSBpZiB0aGUgY3VzdG9tIHRhcmdldCBlbGVtZW50IGlzIHZhbGlkXG4gICAgaWYgKCFwYXJhbXMudGFyZ2V0IHx8IHR5cGVvZiBwYXJhbXMudGFyZ2V0ID09PSAnc3RyaW5nJyAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMudGFyZ2V0KSB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCAhPT0gJ3N0cmluZycgJiYgIXBhcmFtcy50YXJnZXQuYXBwZW5kQ2hpbGQpIHtcbiAgICAgIHdhcm4oJ1RhcmdldCBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiYm9keVwiJyk7XG4gICAgICBwYXJhbXMudGFyZ2V0ID0gJ2JvZHknO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2V0IHR5cGUsIHRleHQgYW5kIGFjdGlvbnMgb24gcG9wdXBcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gc2V0UGFyYW1ldGVycyhwYXJhbXMpIHtcbiAgICBzZXREZWZhdWx0SW5wdXRWYWxpZGF0b3JzKHBhcmFtcyk7IC8vIHNob3dMb2FkZXJPbkNvbmZpcm0gJiYgcHJlQ29uZmlybVxuXG4gICAgaWYgKHBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtICYmICFwYXJhbXMucHJlQ29uZmlybSkge1xuICAgICAgd2Fybignc2hvd0xvYWRlck9uQ29uZmlybSBpcyBzZXQgdG8gdHJ1ZSwgYnV0IHByZUNvbmZpcm0gaXMgbm90IGRlZmluZWQuXFxuJyArICdzaG93TG9hZGVyT25Db25maXJtIHNob3VsZCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggcHJlQ29uZmlybSwgc2VlIHVzYWdlIGV4YW1wbGU6XFxuJyArICdodHRwczovL3N3ZWV0YWxlcnQyLmdpdGh1Yi5pby8jYWpheC1yZXF1ZXN0Jyk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVDdXN0b21UYXJnZXRFbGVtZW50KHBhcmFtcyk7IC8vIFJlcGxhY2UgbmV3bGluZXMgd2l0aCA8YnI+IGluIHRpdGxlXG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy50aXRsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhcmFtcy50aXRsZSA9IHBhcmFtcy50aXRsZS5zcGxpdCgnXFxuJykuam9pbignPGJyIC8+Jyk7XG4gICAgfVxuXG4gICAgaW5pdChwYXJhbXMpO1xuICB9XG5cbiAgY2xhc3MgVGltZXIge1xuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBkZWxheSkge1xuICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgdGhpcy5yZW1haW5pbmcgPSBkZWxheTtcbiAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5pZCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5yZW1haW5pbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgLT0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0ZWQuZ2V0VGltZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuXG4gICAgaW5jcmVhc2Uobikge1xuICAgICAgY29uc3QgcnVubmluZyA9IHRoaXMucnVubmluZztcblxuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtYWluaW5nICs9IG47XG5cbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGdldFRpbWVyTGVmdCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGlzUnVubmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bm5pbmc7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBmaXhTY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgLy8gZm9yIHF1ZXVlcywgZG8gbm90IGRvIHRoaXMgbW9yZSB0aGFuIG9uY2VcbiAgICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIGlmIHRoZSBib2R5IGhhcyBvdmVyZmxvd1xuXG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIHNvIHRoZSBjb250ZW50IGRvZXNuJ3Qgc2hpZnQgYWZ0ZXIgcmVtb3ZhbCBvZiBzY3JvbGxiYXJcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgKyBtZWFzdXJlU2Nyb2xsYmFyKCksIFwicHhcIik7XG4gICAgfVxuICB9O1xuICBjb25zdCB1bmRvU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIGlmIChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyAhPT0gbnVsbCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIlwiLmNvbmNhdChzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZywgXCJweFwiKTtcbiAgICAgIHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cblxuICBjb25zdCBpT1NmaXggPSAoKSA9PiB7XG4gICAgY29uc3QgaU9TID0gLy8gQHRzLWlnbm9yZVxuICAgIC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICF3aW5kb3cuTVNTdHJlYW0gfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09PSAnTWFjSW50ZWwnICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDE7XG5cbiAgICBpZiAoaU9TICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gXCJcIi5jb25jYXQob2Zmc2V0ICogLTEsIFwicHhcIik7XG4gICAgICBhZGRDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpO1xuICAgICAgbG9ja0JvZHlTY3JvbGwoKTtcbiAgICAgIGFkZEJvdHRvbVBhZGRpbmdGb3JUYWxsUG9wdXBzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8xOTQ4XG4gICAqL1xuXG4gIGNvbnN0IGFkZEJvdHRvbVBhZGRpbmdGb3JUYWxsUG9wdXBzID0gKCkgPT4ge1xuICAgIGNvbnN0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICBjb25zdCBpT1MgPSAhIXVhLm1hdGNoKC9pUGFkL2kpIHx8ICEhdWEubWF0Y2goL2lQaG9uZS9pKTtcbiAgICBjb25zdCB3ZWJraXQgPSAhIXVhLm1hdGNoKC9XZWJLaXQvaSk7XG4gICAgY29uc3QgaU9TU2FmYXJpID0gaU9TICYmIHdlYmtpdCAmJiAhdWEubWF0Y2goL0NyaU9TL2kpO1xuXG4gICAgaWYgKGlPU1NhZmFyaSkge1xuICAgICAgY29uc3QgYm90dG9tUGFuZWxIZWlnaHQgPSA0NDtcblxuICAgICAgaWYgKGdldFBvcHVwKCkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0IC0gYm90dG9tUGFuZWxIZWlnaHQpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKCkuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiXCIuY29uY2F0KGJvdHRvbVBhbmVsSGVpZ2h0LCBcInB4XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0NlxuICAgKi9cblxuXG4gIGNvbnN0IGxvY2tCb2R5U2Nyb2xsID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGxldCBwcmV2ZW50VG91Y2hNb3ZlO1xuXG4gICAgY29udGFpbmVyLm9udG91Y2hzdGFydCA9IGUgPT4ge1xuICAgICAgcHJldmVudFRvdWNoTW92ZSA9IHNob3VsZFByZXZlbnRUb3VjaE1vdmUoZSk7XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbnRvdWNobW92ZSA9IGUgPT4ge1xuICAgICAgaWYgKHByZXZlbnRUb3VjaE1vdmUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgY29uc3Qgc2hvdWxkUHJldmVudFRvdWNoTW92ZSA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgICBpZiAoaXNTdHlsdXMoZXZlbnQpIHx8IGlzWm9vbShldmVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0ID09PSBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICghaXNTY3JvbGxhYmxlKGNvbnRhaW5lcikgJiYgdGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcgJiYgLy8gIzE2MDNcbiAgICB0YXJnZXQudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJyAmJiAvLyAjMjI2NlxuICAgICEoaXNTY3JvbGxhYmxlKGdldEh0bWxDb250YWluZXIoKSkgJiYgLy8gIzE5NDRcbiAgICBnZXRIdG1sQ29udGFpbmVyKCkuY29udGFpbnModGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTc4NlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGlzU3R5bHVzID0gZXZlbnQgPT4ge1xuICAgIHJldHVybiBldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoICYmIGV2ZW50LnRvdWNoZXNbMF0udG91Y2hUeXBlID09PSAnc3R5bHVzJztcbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTg5MVxuICAgKlxuICAgKiBAcGFyYW0ge1RvdWNoRXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIGNvbnN0IGlzWm9vbSA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA+IDE7XG4gIH07XG5cbiAgY29uc3QgdW5kb0lPU2ZpeCA9ICgpID0+IHtcbiAgICBpZiAoaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gcGFyc2VJbnQoZG9jdW1lbnQuYm9keS5zdHlsZS50b3AsIDEwKTtcbiAgICAgIHJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBvZmZzZXQgKiAtMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgU0hPV19DTEFTU19USU1FT1VUID0gMTA7XG4gIC8qKlxuICAgKiBPcGVuIHBvcHVwLCBhZGQgbmVjZXNzYXJ5IGNsYXNzZXMgYW5kIHN0eWxlcywgZml4IHNjcm9sbGJhclxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IG9wZW5Qb3B1cCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMud2lsbE9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBhcmFtcy53aWxsT3Blbihwb3B1cCk7XG4gICAgfVxuXG4gICAgY29uc3QgYm9keVN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICAgIGNvbnN0IGluaXRpYWxCb2R5T3ZlcmZsb3cgPSBib2R5U3R5bGVzLm92ZXJmbG93WTtcbiAgICBhZGRDbGFzc2VzJDEoY29udGFpbmVyLCBwb3B1cCwgcGFyYW1zKTsgLy8gc2Nyb2xsaW5nIGlzICdoaWRkZW4nIHVudGlsIGFuaW1hdGlvbiBpcyBkb25lLCBhZnRlciB0aGF0ICdhdXRvJ1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5KGNvbnRhaW5lciwgcG9wdXApO1xuICAgIH0sIFNIT1dfQ0xBU1NfVElNRU9VVCk7XG5cbiAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICBmaXhTY3JvbGxDb250YWluZXIoY29udGFpbmVyLCBwYXJhbXMuc2Nyb2xsYmFyUGFkZGluZywgaW5pdGlhbEJvZHlPdmVyZmxvdyk7XG4gICAgICBzZXRBcmlhSGlkZGVuKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1RvYXN0KCkgJiYgIWdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCkge1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5kaWRPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHBhcmFtcy5kaWRPcGVuKHBvcHVwKSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlc1snbm8tdHJhbnNpdGlvbiddKTtcbiAgfTtcblxuICBjb25zdCBzd2FsT3BlbkFuaW1hdGlvbkZpbmlzaGVkID0gZXZlbnQgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmIChldmVudC50YXJnZXQgIT09IHBvcHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcG9wdXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdhdXRvJztcbiAgfTtcblxuICBjb25zdCBzZXRTY3JvbGxpbmdWaXNpYmlsaXR5ID0gKGNvbnRhaW5lciwgcG9wdXApID0+IHtcbiAgICBpZiAoYW5pbWF0aW9uRW5kRXZlbnQgJiYgaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKSkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdoaWRkZW4nO1xuICAgICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpeFNjcm9sbENvbnRhaW5lciA9IChjb250YWluZXIsIHNjcm9sbGJhclBhZGRpbmcsIGluaXRpYWxCb2R5T3ZlcmZsb3cpID0+IHtcbiAgICBpT1NmaXgoKTtcblxuICAgIGlmIChzY3JvbGxiYXJQYWRkaW5nICYmIGluaXRpYWxCb2R5T3ZlcmZsb3cgIT09ICdoaWRkZW4nKSB7XG4gICAgICBmaXhTY3JvbGxiYXIoKTtcbiAgICB9IC8vIHN3ZWV0YWxlcnQyL2lzc3Vlcy8xMjQ3XG5cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IDA7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xhc3NlcyQxID0gKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIGFkZENsYXNzKGNvbnRhaW5lciwgcGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7IC8vIHRoaXMgd29ya2Fyb3VuZCB3aXRoIG9wYWNpdHkgaXMgbmVlZGVkIGZvciBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIwNTlcblxuICAgIHBvcHVwLnN0eWxlLnNldFByb3BlcnR5KCdvcGFjaXR5JywgJzAnLCAnaW1wb3J0YW50Jyk7XG4gICAgc2hvdyhwb3B1cCwgJ2dyaWQnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEFuaW1hdGUgcG9wdXAgcmlnaHQgYWZ0ZXIgc2hvd2luZyBpdFxuICAgICAgYWRkQ2xhc3MocG9wdXAsIHBhcmFtcy5zaG93Q2xhc3MucG9wdXApOyAvLyBhbmQgcmVtb3ZlIHRoZSBvcGFjaXR5IHdvcmthcm91bmRcblxuICAgICAgcG9wdXAuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ29wYWNpdHknKTtcbiAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpOyAvLyAxMG1zIGluIG9yZGVyIHRvIGZpeCAjMjA2MlxuXG4gICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzLnNob3duKTtcblxuICAgIGlmIChwYXJhbXMuaGVpZ2h0QXV0byAmJiBwYXJhbXMuYmFja2Ryb3AgJiYgIXBhcmFtcy50b2FzdCkge1xuICAgICAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIHN3YWxDbGFzc2VzWydoZWlnaHQtYXV0byddKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3dzIGxvYWRlciAoc3Bpbm5lciksIHRoaXMgaXMgdXNlZnVsIHdpdGggQUpBWCByZXF1ZXN0cy5cbiAgICogQnkgZGVmYXVsdCB0aGUgbG9hZGVyIGJlIHNob3duIGluc3RlYWQgb2YgdGhlIFwiQ29uZmlybVwiIGJ1dHRvbi5cbiAgICovXG5cbiAgY29uc3Qgc2hvd0xvYWRpbmcgPSBidXR0b25Ub1JlcGxhY2UgPT4ge1xuICAgIGxldCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICBuZXcgU3dhbCgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH1cblxuICAgIHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTtcblxuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIGhpZGUoZ2V0SWNvbigpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZUJ1dHRvbihwb3B1cCwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICB9XG5cbiAgICBzaG93KGxvYWRlcik7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnLCAndHJ1ZScpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgJ3RydWUnKTtcbiAgICBwb3B1cC5mb2N1cygpO1xuICB9O1xuXG4gIGNvbnN0IHJlcGxhY2VCdXR0b24gPSAocG9wdXAsIGJ1dHRvblRvUmVwbGFjZSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBnZXRBY3Rpb25zKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG5cbiAgICBpZiAoIWJ1dHRvblRvUmVwbGFjZSAmJiBpc1Zpc2libGUoZ2V0Q29uZmlybUJ1dHRvbigpKSkge1xuICAgICAgYnV0dG9uVG9SZXBsYWNlID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIH1cblxuICAgIHNob3coYWN0aW9ucyk7XG5cbiAgICBpZiAoYnV0dG9uVG9SZXBsYWNlKSB7XG4gICAgICBoaWRlKGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgICBsb2FkZXIuc2V0QXR0cmlidXRlKCdkYXRhLWJ1dHRvbi10by1yZXBsYWNlJywgYnV0dG9uVG9SZXBsYWNlLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgbG9hZGVyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGxvYWRlciwgYnV0dG9uVG9SZXBsYWNlKTtcbiAgICBhZGRDbGFzcyhbcG9wdXAsIGFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnNBbmRWYWx1ZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0gJ3NlbGVjdCcgfHwgcGFyYW1zLmlucHV0ID09PSAncmFkaW8nKSB7XG4gICAgICBoYW5kbGVJbnB1dE9wdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfSBlbHNlIGlmIChbJ3RleHQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ3RlbCcsICd0ZXh0YXJlYSddLmluY2x1ZGVzKHBhcmFtcy5pbnB1dCkgJiYgKGhhc1RvUHJvbWlzZUZuKHBhcmFtcy5pbnB1dFZhbHVlKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpKSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0Q29uZmlybUJ1dHRvbigpKTtcbiAgICAgIGhhbmRsZUlucHV0VmFsdWUoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgfVxuICB9O1xuICBjb25zdCBnZXRJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgcmV0dXJuIGdldENoZWNrYm94VmFsdWUoaW5wdXQpO1xuXG4gICAgICBjYXNlICdyYWRpbyc6XG4gICAgICAgIHJldHVybiBnZXRSYWRpb1ZhbHVlKGlucHV0KTtcblxuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHJldHVybiBnZXRGaWxlVmFsdWUoaW5wdXQpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaW5uZXJQYXJhbXMuaW5wdXRBdXRvVHJpbSA/IGlucHV0LnZhbHVlLnRyaW0oKSA6IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBnZXRDaGVja2JveFZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IDEgOiAwO1xuXG4gIGNvbnN0IGdldFJhZGlvVmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5jaGVja2VkID8gaW5wdXQudmFsdWUgOiBudWxsO1xuXG4gIGNvbnN0IGdldEZpbGVWYWx1ZSA9IGlucHV0ID0+IGlucHV0LmZpbGVzLmxlbmd0aCA/IGlucHV0LmdldEF0dHJpYnV0ZSgnbXVsdGlwbGUnKSAhPT0gbnVsbCA/IGlucHV0LmZpbGVzIDogaW5wdXQuZmlsZXNbMF0gOiBudWxsO1xuXG4gIGNvbnN0IGhhbmRsZUlucHV0T3B0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgY29uc3QgcHJvY2Vzc0lucHV0T3B0aW9ucyA9IGlucHV0T3B0aW9ucyA9PiBwb3B1bGF0ZUlucHV0T3B0aW9uc1twYXJhbXMuaW5wdXRdKHBvcHVwLCBmb3JtYXRJbnB1dE9wdGlvbnMoaW5wdXRPcHRpb25zKSwgcGFyYW1zKTtcblxuICAgIGlmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRPcHRpb25zKSB8fCBpc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykudGhlbihpbnB1dE9wdGlvbnMgPT4ge1xuICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICBwcm9jZXNzSW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhwYXJhbXMuaW5wdXRPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgaW5wdXRPcHRpb25zISBFeHBlY3RlZCBvYmplY3QsIE1hcCBvciBQcm9taXNlLCBnb3QgXCIuY29uY2F0KHR5cGVvZiBwYXJhbXMuaW5wdXRPcHRpb25zKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsdWUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcbiAgICBoaWRlKGlucHV0KTtcbiAgICBhc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpLnRoZW4oaW5wdXRWYWx1ZSA9PiB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dCA9PT0gJ251bWJlcicgPyBwYXJzZUZsb2F0KGlucHV0VmFsdWUpIHx8IDAgOiBcIlwiLmNvbmNhdChpbnB1dFZhbHVlKTtcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGVycm9yKFwiRXJyb3IgaW4gaW5wdXRWYWx1ZSBwcm9taXNlOiBcIi5jb25jYXQoZXJyKSk7XG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgc2hvdyhpbnB1dCk7XG4gICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBwb3B1bGF0ZUlucHV0T3B0aW9ucyA9IHtcbiAgICBzZWxlY3Q6IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcblxuICAgICAgY29uc3QgcmVuZGVyT3B0aW9uID0gKHBhcmVudCwgb3B0aW9uTGFiZWwsIG9wdGlvblZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRpb24udmFsdWUgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgc2V0SW5uZXJIdG1sKG9wdGlvbiwgb3B0aW9uTGFiZWwpO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBpc1NlbGVjdGVkKG9wdGlvblZhbHVlLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgfTtcblxuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goaW5wdXRPcHRpb24gPT4ge1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IGlucHV0T3B0aW9uWzBdO1xuICAgICAgICBjb25zdCBvcHRpb25MYWJlbCA9IGlucHV0T3B0aW9uWzFdOyAvLyA8b3B0Z3JvdXA+IHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNDAxL2ludGVyYWN0L2Zvcm1zLmh0bWwjaC0xNy42XG4gICAgICAgIC8vIFwiLi4uYWxsIE9QVEdST1VQIGVsZW1lbnRzIG11c3QgYmUgc3BlY2lmaWVkIGRpcmVjdGx5IHdpdGhpbiBhIFNFTEVDVCBlbGVtZW50IChpLmUuLCBncm91cHMgbWF5IG5vdCBiZSBuZXN0ZWQpLi4uXCJcbiAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIGlzIGEgPG9wdGdyb3VwPlxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbkxhYmVsKSkge1xuICAgICAgICAgIC8vIGlmIGl0IGlzIGFuIGFycmF5LCB0aGVuIGl0IGlzIGFuIDxvcHRncm91cD5cbiAgICAgICAgICBjb25zdCBvcHRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJyk7XG4gICAgICAgICAgb3B0Z3JvdXAubGFiZWwgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgICBvcHRncm91cC5kaXNhYmxlZCA9IGZhbHNlOyAvLyBub3QgY29uZmlndXJhYmxlIGZvciBub3dcblxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRncm91cCk7XG4gICAgICAgICAgb3B0aW9uTGFiZWwuZm9yRWFjaChvID0+IHJlbmRlck9wdGlvbihvcHRncm91cCwgb1sxXSwgb1swXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhc2Ugb2YgPG9wdGlvbj5cbiAgICAgICAgICByZW5kZXJPcHRpb24oc2VsZWN0LCBvcHRpb25MYWJlbCwgb3B0aW9uVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdC5mb2N1cygpO1xuICAgIH0sXG4gICAgcmFkaW86IChwb3B1cCwgaW5wdXRPcHRpb25zLCBwYXJhbXMpID0+IHtcbiAgICAgIGNvbnN0IHJhZGlvID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5yYWRpbyk7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChpbnB1dE9wdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IHJhZGlvVmFsdWUgPSBpbnB1dE9wdGlvblswXTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgY29uc3QgcmFkaW9MYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICByYWRpb0lucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgICByYWRpb0lucHV0Lm5hbWUgPSBzd2FsQ2xhc3Nlcy5yYWRpbztcbiAgICAgICAgcmFkaW9JbnB1dC52YWx1ZSA9IHJhZGlvVmFsdWU7XG5cbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQocmFkaW9WYWx1ZSwgcGFyYW1zLmlucHV0VmFsdWUpKSB7XG4gICAgICAgICAgcmFkaW9JbnB1dC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzZXRJbm5lckh0bWwobGFiZWwsIHJhZGlvTGFiZWwpO1xuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5sYWJlbDtcbiAgICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQocmFkaW9JbnB1dCk7XG4gICAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgICAgcmFkaW8uYXBwZW5kQ2hpbGQocmFkaW9MYWJlbEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCByYWRpb3MgPSByYWRpby5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgICBpZiAocmFkaW9zLmxlbmd0aCkge1xuICAgICAgICByYWRpb3NbMF0uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgaW5wdXRPcHRpb25zYCBpbnRvIGFuIGFycmF5IG9mIGBbdmFsdWUsIGxhYmVsXWBzXG4gICAqIEBwYXJhbSBpbnB1dE9wdGlvbnNcbiAgICovXG5cbiAgY29uc3QgZm9ybWF0SW5wdXRPcHRpb25zID0gaW5wdXRPcHRpb25zID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGlmICh0eXBlb2YgTWFwICE9PSAndW5kZWZpbmVkJyAmJiBpbnB1dE9wdGlvbnMgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZUZvcm1hdHRlZCA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhpbnB1dE9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHZhbHVlRm9ybWF0dGVkID0gaW5wdXRPcHRpb25zW2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUZvcm1hdHRlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRncm91cD5cbiAgICAgICAgICB2YWx1ZUZvcm1hdHRlZCA9IGZvcm1hdElucHV0T3B0aW9ucyh2YWx1ZUZvcm1hdHRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaChba2V5LCB2YWx1ZUZvcm1hdHRlZF0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCBpc1NlbGVjdGVkID0gKG9wdGlvblZhbHVlLCBpbnB1dFZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIGlucHV0VmFsdWUgJiYgaW5wdXRWYWx1ZS50b1N0cmluZygpID09PSBvcHRpb25WYWx1ZS50b1N0cmluZygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyBsb2FkZXIgYW5kIHNob3dzIGJhY2sgdGhlIGJ1dHRvbiB3aGljaCB3YXMgaGlkZGVuIGJ5IC5zaG93TG9hZGluZygpXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGhpZGVMb2FkaW5nKCkge1xuICAgIC8vIGRvIG5vdGhpbmcgaWYgcG9wdXAgaXMgY2xvc2VkXG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBoaWRlKGRvbUNhY2hlLmxvYWRlcik7XG5cbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICBpZiAoaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgICBzaG93KGdldEljb24oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dSZWxhdGVkQnV0dG9uKGRvbUNhY2hlKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzcyhbZG9tQ2FjaGUucG9wdXAsIGRvbUNhY2hlLmFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgICBkb21DYWNoZS5wb3B1cC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYnVzeScpO1xuICAgIGRvbUNhY2hlLnBvcHVwLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJyk7XG4gICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGRvbUNhY2hlLmRlbnlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHNob3dSZWxhdGVkQnV0dG9uID0gZG9tQ2FjaGUgPT4ge1xuICAgIGNvbnN0IGJ1dHRvblRvUmVwbGFjZSA9IGRvbUNhY2hlLnBvcHVwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZG9tQ2FjaGUubG9hZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1idXR0b24tdG8tcmVwbGFjZScpKTtcblxuICAgIGlmIChidXR0b25Ub1JlcGxhY2UubGVuZ3RoKSB7XG4gICAgICBzaG93KGJ1dHRvblRvUmVwbGFjZVswXSwgJ2lubGluZS1ibG9jaycpO1xuICAgIH0gZWxzZSBpZiAoYWxsQnV0dG9uc0FyZUhpZGRlbigpKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLmFjdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5wdXQgRE9NIG5vZGUsIHRoaXMgbWV0aG9kIHdvcmtzIHdpdGggaW5wdXQgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRJbnB1dCQxKGluc3RhbmNlKSB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHRoaXMpO1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSB8fCB0aGlzKTtcblxuICAgIGlmICghZG9tQ2FjaGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRJbnB1dChkb21DYWNoZS5wb3B1cCwgaW5uZXJQYXJhbXMuaW5wdXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG4gIHZhciBwcml2YXRlTWV0aG9kcyA9IHtcbiAgICBzd2FsUHJvbWlzZVJlc29sdmU6IG5ldyBXZWFrTWFwKCksXG4gICAgc3dhbFByb21pc2VSZWplY3Q6IG5ldyBXZWFrTWFwKClcbiAgfTtcblxuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIFN3ZWV0QWxlcnQyIHBvcHVwIGlzIHNob3duXG4gICAqL1xuXG4gIGNvbnN0IGlzVmlzaWJsZSQxID0gKCkgPT4ge1xuICAgIHJldHVybiBpc1Zpc2libGUoZ2V0UG9wdXAoKSk7XG4gIH07XG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnQ29uZmlybScgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrQ29uZmlybSA9ICgpID0+IGdldENvbmZpcm1CdXR0b24oKSAmJiBnZXRDb25maXJtQnV0dG9uKCkuY2xpY2soKTtcbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdEZW55JyBidXR0b25cbiAgICovXG5cbiAgY29uc3QgY2xpY2tEZW55ID0gKCkgPT4gZ2V0RGVueUJ1dHRvbigpICYmIGdldERlbnlCdXR0b24oKS5jbGljaygpO1xuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NhbmNlbCcgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrQ2FuY2VsID0gKCkgPT4gZ2V0Q2FuY2VsQnV0dG9uKCkgJiYgZ2V0Q2FuY2VsQnV0dG9uKCkuY2xpY2soKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICovXG5cbiAgY29uc3QgcmVtb3ZlS2V5ZG93bkhhbmRsZXIgPSBnbG9iYWxTdGF0ZSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQgJiYgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCkge1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXIsIHtcbiAgICAgICAgY2FwdHVyZTogZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZVxuICAgICAgfSk7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlckFkZGVkID0gZmFsc2U7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHsqfSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBhZGRLZXlkb3duSGFuZGxlciA9IChpbnN0YW5jZSwgZ2xvYmFsU3RhdGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIHJlbW92ZUtleWRvd25IYW5kbGVyKGdsb2JhbFN0YXRlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyID0gZSA9PiBrZXlkb3duSGFuZGxlcihpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpO1xuXG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0ID0gaW5uZXJQYXJhbXMua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA/IHdpbmRvdyA6IGdldFBvcHVwKCk7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlID0gaW5uZXJQYXJhbXMua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmNyZW1lbnRcbiAgICovXG5cbiAgY29uc3Qgc2V0Rm9jdXMgPSAoaW5uZXJQYXJhbXMsIGluZGV4LCBpbmNyZW1lbnQpID0+IHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKCk7IC8vIHNlYXJjaCBmb3IgdmlzaWJsZSBlbGVtZW50cyBhbmQgc2VsZWN0IHRoZSBuZXh0IHBvc3NpYmxlIG1hdGNoXG5cbiAgICBpZiAoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IGluZGV4ICsgaW5jcmVtZW50OyAvLyByb2xsb3ZlciB0byBmaXJzdCBpdGVtXG5cbiAgICAgIGlmIChpbmRleCA9PT0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gMDsgLy8gZ28gdG8gbGFzdCBpdGVtXG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBpbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb2N1c2FibGVFbGVtZW50c1tpbmRleF0uZm9jdXMoKTtcbiAgICB9IC8vIG5vIHZpc2libGUgZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyB0aGUgcG9wdXBcblxuXG4gICAgZ2V0UG9wdXAoKS5mb2N1cygpO1xuICB9O1xuICBjb25zdCBhcnJvd0tleXNOZXh0QnV0dG9uID0gWydBcnJvd1JpZ2h0JywgJ0Fycm93RG93biddO1xuICBjb25zdCBhcnJvd0tleXNQcmV2aW91c0J1dHRvbiA9IFsnQXJyb3dMZWZ0JywgJ0Fycm93VXAnXTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBrZXlkb3duSGFuZGxlciA9IChpbnN0YW5jZSwgZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfSAvLyBJZ25vcmUga2V5ZG93biBkdXJpbmcgSU1FIGNvbXBvc2l0aW9uXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RvY3VtZW50L2tleWRvd25fZXZlbnQjaWdub3Jpbmdfa2V5ZG93bl9kdXJpbmdfaW1lX2NvbXBvc2l0aW9uXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy83MjBcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzI0MDZcblxuXG4gICAgaWYgKGUuaXNDb21wb3NpbmcgfHwgZS5rZXlDb2RlID09PSAyMjkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuc3RvcEtleWRvd25Qcm9wYWdhdGlvbikge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9IC8vIEVOVEVSXG5cblxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgaGFuZGxlRW50ZXIoaW5zdGFuY2UsIGUsIGlubmVyUGFyYW1zKTtcbiAgICB9IC8vIFRBQlxuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgaGFuZGxlVGFiKGUsIGlubmVyUGFyYW1zKTtcbiAgICB9IC8vIEFSUk9XUyAtIHN3aXRjaCBmb2N1cyBiZXR3ZWVuIGJ1dHRvbnNcbiAgICBlbHNlIGlmIChbLi4uYXJyb3dLZXlzTmV4dEJ1dHRvbiwgLi4uYXJyb3dLZXlzUHJldmlvdXNCdXR0b25dLmluY2x1ZGVzKGUua2V5KSkge1xuICAgICAgaGFuZGxlQXJyb3dzKGUua2V5KTtcbiAgICB9IC8vIEVTQ1xuICAgIGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgaGFuZGxlRXNjKGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlRW50ZXIgPSAoaW5zdGFuY2UsIGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMzg2XG4gICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlLnRhcmdldCAmJiBpbnN0YW5jZS5nZXRJbnB1dCgpICYmIGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgZS50YXJnZXQub3V0ZXJIVE1MID09PSBpbnN0YW5jZS5nZXRJbnB1dCgpLm91dGVySFRNTCkge1xuICAgICAgaWYgKFsndGV4dGFyZWEnLCAnZmlsZSddLmluY2x1ZGVzKGlubmVyUGFyYW1zLmlucHV0KSkge1xuICAgICAgICByZXR1cm47IC8vIGRvIG5vdCBzdWJtaXRcbiAgICAgIH1cblxuICAgICAgY2xpY2tDb25maXJtKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlVGFiID0gKGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gZ2V0Rm9jdXNhYmxlRWxlbWVudHMoKTtcbiAgICBsZXQgYnRuSW5kZXggPSAtMTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0YXJnZXRFbGVtZW50ID09PSBmb2N1c2FibGVFbGVtZW50c1tpXSkge1xuICAgICAgICBidG5JbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gLy8gQ3ljbGUgdG8gdGhlIG5leHQgYnV0dG9uXG5cblxuICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIGJ0bkluZGV4LCAxKTtcbiAgICB9IC8vIEN5Y2xlIHRvIHRoZSBwcmV2IGJ1dHRvblxuICAgIGVsc2Uge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIGJ0bkluZGV4LCAtMSk7XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlQXJyb3dzID0ga2V5ID0+IHtcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gZ2V0Q29uZmlybUJ1dHRvbigpO1xuICAgIGNvbnN0IGRlbnlCdXR0b24gPSBnZXREZW55QnV0dG9uKCk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gZ2V0Q2FuY2VsQnV0dG9uKCk7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICFbY29uZmlybUJ1dHRvbiwgZGVueUJ1dHRvbiwgY2FuY2VsQnV0dG9uXS5pbmNsdWRlcyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNpYmxpbmcgPSBhcnJvd0tleXNOZXh0QnV0dG9uLmluY2x1ZGVzKGtleSkgPyAnbmV4dEVsZW1lbnRTaWJsaW5nJyA6ICdwcmV2aW91c0VsZW1lbnRTaWJsaW5nJztcbiAgICBsZXQgYnV0dG9uVG9Gb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdldEFjdGlvbnMoKS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgYnV0dG9uVG9Gb2N1cyA9IGJ1dHRvblRvRm9jdXNbc2libGluZ107XG5cbiAgICAgIGlmICghYnV0dG9uVG9Gb2N1cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQgJiYgaXNWaXNpYmxlKGJ1dHRvblRvRm9jdXMpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChidXR0b25Ub0ZvY3VzIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVFc2MgPSAoZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaWYgKGNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93RXNjYXBlS2V5KSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5lc2MpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBJbnN0YW5jZSBtZXRob2QgdG8gY2xvc2Ugc3dlZXRBbGVydFxuICAgKi9cblxuICBmdW5jdGlvbiByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUoaW5zdGFuY2UsIGNvbnRhaW5lciwgcmV0dXJuRm9jdXMsIGRpZENsb3NlKSB7XG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0b3JlQWN0aXZlRWxlbWVudChyZXR1cm5Gb2N1cykudGhlbigoKSA9PiB0cmlnZ2VyRGlkQ2xvc2VBbmREaXNwb3NlKGluc3RhbmNlLCBkaWRDbG9zZSkpO1xuICAgICAgcmVtb3ZlS2V5ZG93bkhhbmRsZXIoZ2xvYmFsU3RhdGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzU2FmYXJpID0gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gd29ya2Fyb3VuZCBmb3IgIzIwODhcbiAgICAvLyBmb3Igc29tZSByZWFzb24gcmVtb3ZpbmcgdGhlIGNvbnRhaW5lciBpbiBTYWZhcmkgd2lsbCBzY3JvbGwgdGhlIGRvY3VtZW50IHRvIGJvdHRvbVxuXG4gICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmUgIWltcG9ydGFudCcpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgIHVuZG9TY3JvbGxiYXIoKTtcbiAgICAgIHVuZG9JT1NmaXgoKTtcbiAgICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cblxuICAgIHJlbW92ZUJvZHlDbGFzc2VzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVCb2R5Q2xhc3NlcygpIHtcbiAgICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzLnNob3duLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZShyZXNvbHZlVmFsdWUpIHtcbiAgICByZXNvbHZlVmFsdWUgPSBwcmVwYXJlUmVzb2x2ZVZhbHVlKHJlc29sdmVWYWx1ZSk7XG4gICAgY29uc3Qgc3dhbFByb21pc2VSZXNvbHZlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLmdldCh0aGlzKTtcbiAgICBjb25zdCBkaWRDbG9zZSA9IHRyaWdnZXJDbG9zZVBvcHVwKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgLy8gQSBzd2FsIGF3YWl0aW5nIGZvciBhIHByb21pc2UgKGFmdGVyIGEgY2xpY2sgb24gQ29uZmlybSBvciBEZW55KSBjYW5ub3QgYmUgZGlzbWlzc2VkIGFueW1vcmUgIzIzMzVcbiAgICAgIGlmICghcmVzb2x2ZVZhbHVlLmlzRGlzbWlzc2VkKSB7XG4gICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZSh0aGlzKTtcbiAgICAgICAgc3dhbFByb21pc2VSZXNvbHZlKHJlc29sdmVWYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaWRDbG9zZSkge1xuICAgICAgLy8gUmVzb2x2ZSBTd2FsIHByb21pc2VcbiAgICAgIHN3YWxQcm9taXNlUmVzb2x2ZShyZXNvbHZlVmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpc0F3YWl0aW5nUHJvbWlzZSgpIHtcbiAgICByZXR1cm4gISFwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLmdldCh0aGlzKTtcbiAgfVxuXG4gIGNvbnN0IHRyaWdnZXJDbG9zZVBvcHVwID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmICghcG9wdXApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcyB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MucG9wdXApO1xuICAgIGFkZENsYXNzKHBvcHVwLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MucG9wdXApO1xuICAgIGNvbnN0IGJhY2tkcm9wID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgcmVtb3ZlQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLnNob3dDbGFzcy5iYWNrZHJvcCk7XG4gICAgYWRkQ2xhc3MoYmFja2Ryb3AsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5iYWNrZHJvcCk7XG4gICAgaGFuZGxlUG9wdXBBbmltYXRpb24oaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShlcnJvcikge1xuICAgIGNvbnN0IHJlamVjdFByb21pc2UgPSBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlamVjdC5nZXQodGhpcyk7XG4gICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKHRoaXMpO1xuXG4gICAgaWYgKHJlamVjdFByb21pc2UpIHtcbiAgICAgIC8vIFJlamVjdCBTd2FsIHByb21pc2VcbiAgICAgIHJlamVjdFByb21pc2UoZXJyb3IpO1xuICAgIH1cbiAgfVxuICBjb25zdCBoYW5kbGVBd2FpdGluZ1Byb21pc2UgPSBpbnN0YW5jZSA9PiB7XG4gICAgaWYgKGluc3RhbmNlLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2UuZGVsZXRlKGluc3RhbmNlKTsgLy8gVGhlIGluc3RhbmNlIG1pZ2h0IGhhdmUgYmVlbiBwcmV2aW91c2x5IHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVzdW1lIHRoZSBkZXN0cm95IHByb2Nlc3MgaW4gdGhpcyBjYXNlICMyMzM1XG5cbiAgICAgIGlmICghcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSkpIHtcbiAgICAgICAgaW5zdGFuY2UuX2Rlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcHJlcGFyZVJlc29sdmVWYWx1ZSA9IHJlc29sdmVWYWx1ZSA9PiB7XG4gICAgLy8gV2hlbiB1c2VyIGNhbGxzIFN3YWwuY2xvc2UoKVxuICAgIGlmICh0eXBlb2YgcmVzb2x2ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNDb25maXJtZWQ6IGZhbHNlLFxuICAgICAgICBpc0RlbmllZDogZmFsc2UsXG4gICAgICAgIGlzRGlzbWlzc2VkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgIGlzRGVuaWVkOiBmYWxzZSxcbiAgICAgIGlzRGlzbWlzc2VkOiBmYWxzZVxuICAgIH0sIHJlc29sdmVWYWx1ZSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUG9wdXBBbmltYXRpb24gPSAoaW5zdGFuY2UsIHBvcHVwLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpOyAvLyBJZiBhbmltYXRpb24gaXMgc3VwcG9ydGVkLCBhbmltYXRlXG5cbiAgICBjb25zdCBhbmltYXRpb25Jc1N1cHBvcnRlZCA9IGFuaW1hdGlvbkVuZEV2ZW50ICYmIGhhc0Nzc0FuaW1hdGlvbihwb3B1cCk7XG5cbiAgICBpZiAodHlwZW9mIGlubmVyUGFyYW1zLndpbGxDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5uZXJQYXJhbXMud2lsbENsb3NlKHBvcHVwKTtcbiAgICB9XG5cbiAgICBpZiAoYW5pbWF0aW9uSXNTdXBwb3J0ZWQpIHtcbiAgICAgIGFuaW1hdGVQb3B1cChpbnN0YW5jZSwgcG9wdXAsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCByZW1vdmUgaW1tZWRpYXRlbHlcbiAgICAgIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShpbnN0YW5jZSwgY29udGFpbmVyLCBpbm5lclBhcmFtcy5yZXR1cm5Gb2N1cywgaW5uZXJQYXJhbXMuZGlkQ2xvc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhbmltYXRlUG9wdXAgPSAoaW5zdGFuY2UsIHBvcHVwLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkgPT4ge1xuICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjayA9IHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZS5iaW5kKG51bGwsIGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSk7XG4gICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gcG9wdXApIHtcbiAgICAgICAgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKCk7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZSA9IChpbnN0YW5jZSwgZGlkQ2xvc2UpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZGlkQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGlkQ2xvc2UuYmluZChpbnN0YW5jZS5wYXJhbXMpKCk7XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0QnV0dG9uc0Rpc2FibGVkKGluc3RhbmNlLCBidXR0b25zLCBkaXNhYmxlZCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldChpbnN0YW5jZSk7XG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBkb21DYWNoZVtidXR0b25dLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRJbnB1dERpc2FibGVkKGlucHV0LCBkaXNhYmxlZCkge1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgY29uc3QgcmFkaW9zQ29udGFpbmVyID0gaW5wdXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgY29uc3QgcmFkaW9zID0gcmFkaW9zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvc1tpXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbnMoKSB7XG4gICAgc2V0QnV0dG9uc0Rpc2FibGVkKHRoaXMsIFsnY29uZmlybUJ1dHRvbicsICdkZW55QnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBlbmFibGVJbnB1dCgpIHtcbiAgICByZXR1cm4gc2V0SW5wdXREaXNhYmxlZCh0aGlzLmdldElucHV0KCksIGZhbHNlKTtcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlSW5wdXQoKSB7XG4gICAgcmV0dXJuIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dWYWxpZGF0aW9uTWVzc2FnZShlcnJvcikge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICBjb25zdCBwYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuICAgIHNldElubmVySHRtbChkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgZXJyb3IpO1xuICAgIGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXTtcblxuICAgIGlmIChwYXJhbXMuY3VzdG9tQ2xhc3MgJiYgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBhZGRDbGFzcyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSwgcGFyYW1zLmN1c3RvbUNsYXNzLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG5cbiAgICBzaG93KGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCB0cnVlKTtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gICAgICBmb2N1c0lucHV0KGlucHV0KTtcbiAgICAgIGFkZENsYXNzKGlucHV0LCBzd2FsQ2xhc3Nlcy5pbnB1dGVycm9yKTtcbiAgICB9XG4gIH0gLy8gSGlkZSBibG9jayB3aXRoIHZhbGlkYXRpb24gbWVzc2FnZVxuXG4gIGZ1bmN0aW9uIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG5cbiAgICBpZiAoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgIGhpZGUoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRJbnB1dCgpO1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpO1xuICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICByZW1vdmVDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UHJvZ3Jlc3NTdGVwcyQxKCkge1xuICAgIGNvbnN0IGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcbiAgICByZXR1cm4gZG9tQ2FjaGUucHJvZ3Jlc3NTdGVwcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHBvcHVwIHBhcmFtZXRlcnMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwYXJhbXMpIHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFwb3B1cCB8fCBoYXNDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKSkge1xuICAgICAgcmV0dXJuIHdhcm4oXCJZb3UncmUgdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgY2xvc2VkIG9yIGNsb3NpbmcgcG9wdXAsIHRoYXQgd29uJ3Qgd29yay4gVXNlIHRoZSB1cGRhdGUoKSBtZXRob2QgaW4gcHJlQ29uZmlybSBwYXJhbWV0ZXIgb3Igc2hvdyBhIG5ldyBwb3B1cC5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWRVcGRhdGFibGVQYXJhbXMgPSBmaWx0ZXJWYWxpZFBhcmFtcyhwYXJhbXMpO1xuICAgIGNvbnN0IHVwZGF0ZWRQYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBpbm5lclBhcmFtcywgdmFsaWRVcGRhdGFibGVQYXJhbXMpO1xuICAgIHJlbmRlcih0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KHRoaXMsIHVwZGF0ZWRQYXJhbXMpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB2YWx1ZTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyksXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgZmlsdGVyVmFsaWRQYXJhbXMgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0ge307XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIGlmIChpc1VwZGF0YWJsZVBhcmFtZXRlcihwYXJhbSkpIHtcbiAgICAgICAgdmFsaWRVcGRhdGFibGVQYXJhbXNbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhcm4oXCJJbnZhbGlkIHBhcmFtZXRlciB0byB1cGRhdGU6IFwiLmNvbmNhdChwYXJhbSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2YWxpZFVwZGF0YWJsZVBhcmFtcztcbiAgfTtcblxuICBmdW5jdGlvbiBfZGVzdHJveSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcykge1xuICAgICAgZGlzcG9zZVdlYWtNYXBzKHRoaXMpOyAvLyBUaGUgV2Vha01hcHMgbWlnaHQgaGF2ZSBiZWVuIHBhcnRseSBkZXN0cm95ZWQsIHdlIG11c3QgcmVjYWxsIGl0IHRvIGRpc3Bvc2UgYW55IHJlbWFpbmluZyBXZWFrTWFwcyAjMjMzNVxuXG4gICAgICByZXR1cm47IC8vIFRoaXMgaW5zdGFuY2UgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWRcbiAgICB9IC8vIENoZWNrIGlmIHRoZXJlIGlzIGFub3RoZXIgU3dhbCBjbG9zaW5nXG5cblxuICAgIGlmIChkb21DYWNoZS5wb3B1cCAmJiBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2spIHtcbiAgICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaygpO1xuICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGlubmVyUGFyYW1zLmRpZERlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlubmVyUGFyYW1zLmRpZERlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBkaXNwb3NlU3dhbCh0aGlzKTtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgZGlzcG9zZVN3YWwgPSBpbnN0YW5jZSA9PiB7XG4gICAgZGlzcG9zZVdlYWtNYXBzKGluc3RhbmNlKTsgLy8gVW5zZXQgdGhpcy5wYXJhbXMgc28gR0Mgd2lsbCBkaXNwb3NlIGl0ICgjMTU2OSlcbiAgICAvLyBAdHMtaWdub3JlXG5cbiAgICBkZWxldGUgaW5zdGFuY2UucGFyYW1zOyAvLyBVbnNldCBnbG9iYWxTdGF0ZSBwcm9wcyBzbyBHQyB3aWxsIGRpc3Bvc2UgZ2xvYmFsU3RhdGUgKCMxNTY5KVxuXG4gICAgZGVsZXRlIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyO1xuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0OyAvLyBVbnNldCBjdXJyZW50SW5zdGFuY2VcblxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2U7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuXG4gIGNvbnN0IGRpc3Bvc2VXZWFrTWFwcyA9IGluc3RhbmNlID0+IHtcbiAgICAvLyBJZiB0aGUgY3VycmVudCBpbnN0YW5jZSBpcyBhd2FpdGluZyBhIHByb21pc2UgcmVzdWx0LCB3ZSBrZWVwIHRoZSBwcml2YXRlTWV0aG9kcyB0byBjYWxsIHRoZW0gb25jZSB0aGUgcHJvbWlzZSByZXN1bHQgaXMgcmV0cmlldmVkICMyMzM1XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmIChpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSgpKSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVNZXRob2RzLCBpbnN0YW5jZSk7XG4gICAgICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcywgaW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cblxuICBjb25zdCB1bnNldFdlYWtNYXBzID0gKG9iaiwgaW5zdGFuY2UpID0+IHtcbiAgICBmb3IgKGNvbnN0IGkgaW4gb2JqKSB7XG4gICAgICBvYmpbaV0uZGVsZXRlKGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG5cblxuXG4gIHZhciBpbnN0YW5jZU1ldGhvZHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgaGlkZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuICAgIGRpc2FibGVMb2FkaW5nOiBoaWRlTG9hZGluZyxcbiAgICBnZXRJbnB1dDogZ2V0SW5wdXQkMSxcbiAgICBjbG9zZTogY2xvc2UsXG4gICAgaXNBd2FpdGluZ1Byb21pc2U6IGlzQXdhaXRpbmdQcm9taXNlLFxuICAgIHJlamVjdFByb21pc2U6IHJlamVjdFByb21pc2UsXG4gICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlOiBoYW5kbGVBd2FpdGluZ1Byb21pc2UsXG4gICAgY2xvc2VQb3B1cDogY2xvc2UsXG4gICAgY2xvc2VNb2RhbDogY2xvc2UsXG4gICAgY2xvc2VUb2FzdDogY2xvc2UsXG4gICAgZW5hYmxlQnV0dG9uczogZW5hYmxlQnV0dG9ucyxcbiAgICBkaXNhYmxlQnV0dG9uczogZGlzYWJsZUJ1dHRvbnMsXG4gICAgZW5hYmxlSW5wdXQ6IGVuYWJsZUlucHV0LFxuICAgIGRpc2FibGVJbnB1dDogZGlzYWJsZUlucHV0LFxuICAgIHNob3dWYWxpZGF0aW9uTWVzc2FnZTogc2hvd1ZhbGlkYXRpb25NZXNzYWdlLFxuICAgIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U6IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UkMSxcbiAgICBnZXRQcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzJDEsXG4gICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgX2Rlc3Ryb3k6IF9kZXN0cm95XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDb25maXJtQnV0dG9uQ2xpY2sgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnY29uZmlybScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCB0cnVlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVEZW55QnV0dG9uQ2xpY2sgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnJldHVybklucHV0VmFsdWVPbkRlbnkpIHtcbiAgICAgIGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQoaW5zdGFuY2UsICdkZW55Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGZhbHNlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDYW5jZWxCdXR0b25DbGljayA9IChpbnN0YW5jZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBpbnN0YW5jZS5kaXNhYmxlQnV0dG9ucygpO1xuICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uY2FuY2VsKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7J2NvbmZpcm0nIHwgJ2RlbnknfSB0eXBlXG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1PckRlbnlXaXRoSW5wdXQgPSAoaW5zdGFuY2UsIHR5cGUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgZXJyb3IoXCJUaGUgXFxcImlucHV0XFxcIiBwYXJhbWV0ZXIgaXMgbmVlZGVkIHRvIGJlIHNldCB3aGVuIHVzaW5nIHJldHVybklucHV0VmFsdWVPblwiLmNvbmNhdChjYXBpdGFsaXplRmlyc3RMZXR0ZXIodHlwZSkpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dFZhbHVlID0gZ2V0SW5wdXRWYWx1ZShpbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKSB7XG4gICAgICBoYW5kbGVJbnB1dFZhbGlkYXRvcihpbnN0YW5jZSwgaW5wdXRWYWx1ZSwgdHlwZSk7XG4gICAgfSBlbHNlIGlmICghaW5zdGFuY2UuZ2V0SW5wdXQoKS5jaGVja1ZhbGlkaXR5KCkpIHtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnMoKTtcbiAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZShpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgIGRlbnkoaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRWYWx1ZVxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55J30gdHlwZVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFsaWRhdG9yID0gKGluc3RhbmNlLCBpbnB1dFZhbHVlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBpbnN0YW5jZS5kaXNhYmxlSW5wdXQoKTtcbiAgICBjb25zdCB2YWxpZGF0aW9uUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKGlucHV0VmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgIHZhbGlkYXRpb25Qcm9taXNlLnRoZW4odmFsaWRhdGlvbk1lc3NhZ2UgPT4ge1xuICAgICAgaW5zdGFuY2UuZW5hYmxlQnV0dG9ucygpO1xuICAgICAgaW5zdGFuY2UuZW5hYmxlSW5wdXQoKTtcblxuICAgICAgaWYgKHZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICAgIGluc3RhbmNlLnNob3dWYWxpZGF0aW9uTWVzc2FnZSh2YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZW55Jykge1xuICAgICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm0oaW5zdGFuY2UsIGlucHV0VmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3QgZGVueSA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25EZW55KSB7XG4gICAgICBzaG93TG9hZGluZyhnZXREZW55QnV0dG9uKCkpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVEZW55KSB7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIHRydWUpOyAvLyBGbGFnZ2luZyB0aGUgaW5zdGFuY2UgYXMgYXdhaXRpbmcgYSBwcm9taXNlIHNvIGl0J3Mgb3duIHByb21pc2UncyByZWplY3QvcmVzb2x2ZSBtZXRob2RzIGRvZXNuJ3QgZ2V0IGRlc3Ryb3llZCB1bnRpbCB0aGUgcmVzdWx0IGZyb20gdGhpcyBwcmVEZW55J3MgcHJvbWlzZSBpcyByZWNlaXZlZFxuXG4gICAgICBjb25zdCBwcmVEZW55UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLnByZURlbnkodmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgICAgcHJlRGVueVByb21pc2UudGhlbihwcmVEZW55VmFsdWUgPT4ge1xuICAgICAgICBpZiAocHJlRGVueVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgICAgICBpc0RlbmllZDogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB0eXBlb2YgcHJlRGVueVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlRGVueVZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yJCQxID0+IHJlamVjdFdpdGgoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCBlcnJvciQkMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnN0YW5jZS5jbG9zZSh7XG4gICAgICAgIGlzRGVuaWVkOiB0cnVlLFxuICAgICAgICB2YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3Qgc3VjY2VlZFdpdGggPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgaXNDb25maXJtZWQ6IHRydWUsXG4gICAgICB2YWx1ZVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yXG4gICAqL1xuXG5cbiAgY29uc3QgcmVqZWN0V2l0aCA9IChpbnN0YW5jZSwgZXJyb3IkJDEpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaW5zdGFuY2UucmVqZWN0UHJvbWlzZShlcnJvciQkMSk7XG4gIH07XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG5cblxuICBjb25zdCBjb25maXJtID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB1bmRlZmluZWQpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnNob3dMb2FkZXJPbkNvbmZpcm0pIHtcbiAgICAgIHNob3dMb2FkaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgIGluc3RhbmNlLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgdHJ1ZSk7IC8vIEZsYWdnaW5nIHRoZSBpbnN0YW5jZSBhcyBhd2FpdGluZyBhIHByb21pc2Ugc28gaXQncyBvd24gcHJvbWlzZSdzIHJlamVjdC9yZXNvbHZlIG1ldGhvZHMgZG9lc24ndCBnZXQgZGVzdHJveWVkIHVudGlsIHRoZSByZXN1bHQgZnJvbSB0aGlzIHByZUNvbmZpcm0ncyBwcm9taXNlIGlzIHJlY2VpdmVkXG5cbiAgICAgIGNvbnN0IHByZUNvbmZpcm1Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBhc1Byb21pc2UoaW5uZXJQYXJhbXMucHJlQ29uZmlybSh2YWx1ZSwgaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpKSk7XG4gICAgICBwcmVDb25maXJtUHJvbWlzZS50aGVuKHByZUNvbmZpcm1WYWx1ZSA9PiB7XG4gICAgICAgIGlmIChpc1Zpc2libGUoZ2V0VmFsaWRhdGlvbk1lc3NhZ2UoKSkgfHwgcHJlQ29uZmlybVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgaGFuZGxlQXdhaXRpbmdQcm9taXNlKGluc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkV2l0aChpbnN0YW5jZSwgdHlwZW9mIHByZUNvbmZpcm1WYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZSA6IHByZUNvbmZpcm1WYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yJCQxID0+IHJlamVjdFdpdGgoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCBlcnJvciQkMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkV2l0aChpbnN0YW5jZSwgdmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVQb3B1cENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBoYW5kbGVUb2FzdENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZ25vcmUgY2xpY2sgZXZlbnRzIHRoYXQgaGFkIG1vdXNlZG93biBvbiB0aGUgcG9wdXAgYnV0IG1vdXNldXAgb24gdGhlIGNvbnRhaW5lclxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gdGhlIHVzZXIgZHJhZ3MgYSBzbGlkZXJcbiAgICAgIGhhbmRsZU1vZGFsTW91c2Vkb3duKGRvbUNhY2hlKTsgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIGNvbnRhaW5lciBidXQgbW91c2V1cCBvbiB0aGUgcG9wdXBcblxuICAgICAgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duKGRvbUNhY2hlKTtcbiAgICAgIGhhbmRsZU1vZGFsQ2xpY2soaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVRvYXN0Q2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIC8vIENsb3NpbmcgdG9hc3QgYnkgaW50ZXJuYWwgY2xpY2tcbiAgICBkb21DYWNoZS5wb3B1cC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgICAgaWYgKGlubmVyUGFyYW1zICYmIChpc0FueUJ1dHRvblNob3duKGlubmVyUGFyYW1zKSB8fCBpbm5lclBhcmFtcy50aW1lciB8fCBpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICB9O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHsqfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc0FueUJ1dHRvblNob3duID0gaW5uZXJQYXJhbXMgPT4ge1xuICAgIHJldHVybiBpbm5lclBhcmFtcy5zaG93Q29uZmlybUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93RGVueUJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uIHx8IGlubmVyUGFyYW1zLnNob3dDbG9zZUJ1dHRvbjtcbiAgfTtcblxuICBsZXQgaWdub3JlT3V0c2lkZUNsaWNrID0gZmFsc2U7XG5cbiAgY29uc3QgaGFuZGxlTW9kYWxNb3VzZWRvd24gPSBkb21DYWNoZSA9PiB7XG4gICAgZG9tQ2FjaGUucG9wdXAub25tb3VzZWRvd24gPSAoKSA9PiB7XG4gICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IHVuZGVmaW5lZDsgLy8gV2Ugb25seSBjaGVjayBpZiB0aGUgbW91c2V1cCB0YXJnZXQgaXMgdGhlIGNvbnRhaW5lciBiZWNhdXNlIHVzdWFsbHkgaXQgZG9lc24ndFxuICAgICAgICAvLyBoYXZlIGFueSBvdGhlciBkaXJlY3QgY2hpbGRyZW4gYXNpZGUgb2YgdGhlIHBvcHVwXG5cbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb21DYWNoZS5jb250YWluZXIpIHtcbiAgICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ29udGFpbmVyTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNlZG93biA9ICgpID0+IHtcbiAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IHVuZGVmaW5lZDsgLy8gV2UgYWxzbyBuZWVkIHRvIGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBwb3B1cFxuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUucG9wdXAgfHwgZG9tQ2FjaGUucG9wdXAuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZU1vZGFsQ2xpY2sgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbmNsaWNrID0gZSA9PiB7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuXG4gICAgICBpZiAoaWdub3JlT3V0c2lkZUNsaWNrKSB7XG4gICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyICYmIGNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93T3V0c2lkZUNsaWNrKSkge1xuICAgICAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmJhY2tkcm9wKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGlzSnF1ZXJ5RWxlbWVudCA9IGVsZW0gPT4gdHlwZW9mIGVsZW0gPT09ICdvYmplY3QnICYmIGVsZW0uanF1ZXJ5O1xuXG4gIGNvbnN0IGlzRWxlbWVudCA9IGVsZW0gPT4gZWxlbSBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgaXNKcXVlcnlFbGVtZW50KGVsZW0pO1xuXG4gIGNvbnN0IGFyZ3NUb1BhcmFtcyA9IGFyZ3MgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiAhaXNFbGVtZW50KGFyZ3NbMF0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHBhcmFtcywgYXJnc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFsndGl0bGUnLCAnaHRtbCcsICdpY29uJ10uZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgYXJnID0gYXJnc1tpbmRleF07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8IGlzRWxlbWVudChhcmcpKSB7XG4gICAgICAgICAgcGFyYW1zW25hbWVdID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgXCIuY29uY2F0KG5hbWUsIFwiISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiBvciBcXFwiRWxlbWVudFxcXCIsIGdvdCBcIikuY29uY2F0KHR5cGVvZiBhcmcpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcblxuICBmdW5jdGlvbiBmaXJlKCkge1xuICAgIGNvbnN0IFN3YWwgPSB0aGlzOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTd2FsKC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZXh0ZW5kZWQgdmVyc2lvbiBvZiBgU3dhbGAgY29udGFpbmluZyBgcGFyYW1zYCBhcyBkZWZhdWx0cy5cbiAgICogVXNlZnVsIGZvciByZXVzaW5nIFN3YWwgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIEJlZm9yZTpcbiAgICogY29uc3QgdGV4dFByb21wdE9wdGlvbnMgPSB7IGlucHV0OiAndGV4dCcsIHNob3dDYW5jZWxCdXR0b246IHRydWUgfVxuICAgKiBjb25zdCB7dmFsdWU6IGZpcnN0TmFtZX0gPSBhd2FpdCBTd2FsLmZpcmUoeyAuLi50ZXh0UHJvbXB0T3B0aW9ucywgdGl0bGU6ICdXaGF0IGlzIHlvdXIgZmlyc3QgbmFtZT8nIH0pXG4gICAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nIH0pXG4gICAqXG4gICAqIEFmdGVyOlxuICAgKiBjb25zdCBUZXh0UHJvbXB0ID0gU3dhbC5taXhpbih7IGlucHV0OiAndGV4dCcsIHNob3dDYW5jZWxCdXR0b246IHRydWUgfSlcbiAgICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JylcbiAgICogY29uc3Qge3ZhbHVlOiBsYXN0TmFtZX0gPSBhd2FpdCBUZXh0UHJvbXB0KCdXaGF0IGlzIHlvdXIgbGFzdCBuYW1lPycpXG4gICAqXG4gICAqIEBwYXJhbSBtaXhpblBhcmFtc1xuICAgKi9cbiAgZnVuY3Rpb24gbWl4aW4obWl4aW5QYXJhbXMpIHtcbiAgICBjbGFzcyBNaXhpblN3YWwgZXh0ZW5kcyB0aGlzIHtcbiAgICAgIF9tYWluKHBhcmFtcywgcHJpb3JpdHlNaXhpblBhcmFtcykge1xuICAgICAgICByZXR1cm4gc3VwZXIuX21haW4ocGFyYW1zLCBPYmplY3QuYXNzaWduKHt9LCBtaXhpblBhcmFtcywgcHJpb3JpdHlNaXhpblBhcmFtcykpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIE1peGluU3dhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpcyBzZXQsIHJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogT3RoZXJ3aXNlLCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgZ2V0VGltZXJMZWZ0ID0gKCkgPT4ge1xuICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlLnRpbWVvdXQuZ2V0VGltZXJMZWZ0KCk7XG4gIH07XG4gIC8qKlxuICAgKiBTdG9wIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IHN0b3BUaW1lciA9ICgpID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgc3RvcFRpbWVyUHJvZ3Jlc3NCYXIoKTtcbiAgICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgcmVzdW1lVGltZXIgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RhcnQoKTtcbiAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKHJlbWFpbmluZyk7XG4gICAgICByZXR1cm4gcmVtYWluaW5nO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFJlc3VtZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCB0b2dnbGVUaW1lciA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lciA9IGdsb2JhbFN0YXRlLnRpbWVvdXQ7XG4gICAgcmV0dXJuIHRpbWVyICYmICh0aW1lci5ydW5uaW5nID8gc3RvcFRpbWVyKCkgOiByZXN1bWVUaW1lcigpKTtcbiAgfTtcbiAgLyoqXG4gICAqIEluY3JlYXNlIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgYW4gdXBkYXRlZCB0aW1lci5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgaW5jcmVhc2VUaW1lciA9IG4gPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBjb25zdCByZW1haW5pbmcgPSBnbG9iYWxTdGF0ZS50aW1lb3V0LmluY3JlYXNlKG4pO1xuICAgICAgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIocmVtYWluaW5nLCB0cnVlKTtcbiAgICAgIHJldHVybiByZW1haW5pbmc7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ2hlY2sgaWYgdGltZXIgaXMgcnVubmluZy4gUmV0dXJucyB0cnVlIGlmIHRpbWVyIGlzIHJ1bm5pbmdcbiAgICogb3IgZmFsc2UgaWYgdGltZXIgaXMgcGF1c2VkIG9yIHN0b3BwZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWRcbiAgICovXG5cbiAgY29uc3QgaXNUaW1lclJ1bm5pbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pc1J1bm5pbmcoKTtcbiAgfTtcblxuICBsZXQgYm9keUNsaWNrTGlzdGVuZXJBZGRlZCA9IGZhbHNlO1xuICBjb25zdCBjbGlja0hhbmRsZXJzID0ge307XG4gIGZ1bmN0aW9uIGJpbmRDbGlja0hhbmRsZXIoKSB7XG4gICAgbGV0IGF0dHIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICdkYXRhLXN3YWwtdGVtcGxhdGUnO1xuICAgIGNsaWNrSGFuZGxlcnNbYXR0cl0gPSB0aGlzO1xuXG4gICAgaWYgKCFib2R5Q2xpY2tMaXN0ZW5lckFkZGVkKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYm9keUNsaWNrTGlzdGVuZXIpO1xuICAgICAgYm9keUNsaWNrTGlzdGVuZXJBZGRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYm9keUNsaWNrTGlzdGVuZXIgPSBldmVudCA9PiB7XG4gICAgZm9yIChsZXQgZWwgPSBldmVudC50YXJnZXQ7IGVsICYmIGVsICE9PSBkb2N1bWVudDsgZWwgPSBlbC5wYXJlbnROb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IGF0dHIgaW4gY2xpY2tIYW5kbGVycykge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBjbGlja0hhbmRsZXJzW2F0dHJdLmZpcmUoe1xuICAgICAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuXG4gIHZhciBzdGF0aWNNZXRob2RzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGlzVmFsaWRQYXJhbWV0ZXI6IGlzVmFsaWRQYXJhbWV0ZXIsXG4gICAgaXNVcGRhdGFibGVQYXJhbWV0ZXI6IGlzVXBkYXRhYmxlUGFyYW1ldGVyLFxuICAgIGlzRGVwcmVjYXRlZFBhcmFtZXRlcjogaXNEZXByZWNhdGVkUGFyYW1ldGVyLFxuICAgIGFyZ3NUb1BhcmFtczogYXJnc1RvUGFyYW1zLFxuICAgIGlzVmlzaWJsZTogaXNWaXNpYmxlJDEsXG4gICAgY2xpY2tDb25maXJtOiBjbGlja0NvbmZpcm0sXG4gICAgY2xpY2tEZW55OiBjbGlja0RlbnksXG4gICAgY2xpY2tDYW5jZWw6IGNsaWNrQ2FuY2VsLFxuICAgIGdldENvbnRhaW5lcjogZ2V0Q29udGFpbmVyLFxuICAgIGdldFBvcHVwOiBnZXRQb3B1cCxcbiAgICBnZXRUaXRsZTogZ2V0VGl0bGUsXG4gICAgZ2V0SHRtbENvbnRhaW5lcjogZ2V0SHRtbENvbnRhaW5lcixcbiAgICBnZXRJbWFnZTogZ2V0SW1hZ2UsXG4gICAgZ2V0SWNvbjogZ2V0SWNvbixcbiAgICBnZXRJbnB1dExhYmVsOiBnZXRJbnB1dExhYmVsLFxuICAgIGdldENsb3NlQnV0dG9uOiBnZXRDbG9zZUJ1dHRvbixcbiAgICBnZXRBY3Rpb25zOiBnZXRBY3Rpb25zLFxuICAgIGdldENvbmZpcm1CdXR0b246IGdldENvbmZpcm1CdXR0b24sXG4gICAgZ2V0RGVueUJ1dHRvbjogZ2V0RGVueUJ1dHRvbixcbiAgICBnZXRDYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbixcbiAgICBnZXRMb2FkZXI6IGdldExvYWRlcixcbiAgICBnZXRGb290ZXI6IGdldEZvb3RlcixcbiAgICBnZXRUaW1lclByb2dyZXNzQmFyOiBnZXRUaW1lclByb2dyZXNzQmFyLFxuICAgIGdldEZvY3VzYWJsZUVsZW1lbnRzOiBnZXRGb2N1c2FibGVFbGVtZW50cyxcbiAgICBnZXRWYWxpZGF0aW9uTWVzc2FnZTogZ2V0VmFsaWRhdGlvbk1lc3NhZ2UsXG4gICAgaXNMb2FkaW5nOiBpc0xvYWRpbmcsXG4gICAgZmlyZTogZmlyZSxcbiAgICBtaXhpbjogbWl4aW4sXG4gICAgc2hvd0xvYWRpbmc6IHNob3dMb2FkaW5nLFxuICAgIGVuYWJsZUxvYWRpbmc6IHNob3dMb2FkaW5nLFxuICAgIGdldFRpbWVyTGVmdDogZ2V0VGltZXJMZWZ0LFxuICAgIHN0b3BUaW1lcjogc3RvcFRpbWVyLFxuICAgIHJlc3VtZVRpbWVyOiByZXN1bWVUaW1lcixcbiAgICB0b2dnbGVUaW1lcjogdG9nZ2xlVGltZXIsXG4gICAgaW5jcmVhc2VUaW1lcjogaW5jcmVhc2VUaW1lcixcbiAgICBpc1RpbWVyUnVubmluZzogaXNUaW1lclJ1bm5pbmcsXG4gICAgYmluZENsaWNrSGFuZGxlcjogYmluZENsaWNrSGFuZGxlclxuICB9KTtcblxuICBsZXQgY3VycmVudEluc3RhbmNlO1xuXG4gIGNsYXNzIFN3ZWV0QWxlcnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLy8gUHJldmVudCBydW4gaW4gTm9kZSBlbnZcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHRoaXM7IC8vIEB0cy1pZ25vcmVcblxuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dGVyUGFyYW1zID0gT2JqZWN0LmZyZWV6ZSh0aGlzLmNvbnN0cnVjdG9yLmFyZ3NUb1BhcmFtcyhhcmdzKSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHZhbHVlOiBvdXRlclBhcmFtcyxcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7IC8vIEB0cy1pZ25vcmVcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IGN1cnJlbnRJbnN0YW5jZS5fbWFpbihjdXJyZW50SW5zdGFuY2UucGFyYW1zKTtcblxuICAgICAgcHJpdmF0ZVByb3BzLnByb21pc2Uuc2V0KHRoaXMsIHByb21pc2UpO1xuICAgIH1cblxuICAgIF9tYWluKHVzZXJQYXJhbXMpIHtcbiAgICAgIGxldCBtaXhpblBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgICBzaG93V2FybmluZ3NGb3JQYXJhbXMoT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHVzZXJQYXJhbXMpKTtcblxuICAgICAgaWYgKGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdsb2JhbFN0YXRlLmN1cnJlbnRJbnN0YW5jZS5fZGVzdHJveSgpO1xuXG4gICAgICAgIGlmIChpc01vZGFsKCkpIHtcbiAgICAgICAgICB1bnNldEFyaWFIaWRkZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2U7XG4gICAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByZXBhcmVQYXJhbXModXNlclBhcmFtcywgbWl4aW5QYXJhbXMpO1xuICAgICAgc2V0UGFyYW1ldGVycyhpbm5lclBhcmFtcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGlubmVyUGFyYW1zKTsgLy8gY2xlYXIgdGhlIHByZXZpb3VzIHRpbWVyXG5cbiAgICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnRpbWVvdXQuc3RvcCgpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH0gLy8gY2xlYXIgdGhlIHJlc3RvcmUgZm9jdXMgdGltZW91dFxuXG5cbiAgICAgIGNsZWFyVGltZW91dChnbG9iYWxTdGF0ZS5yZXN0b3JlRm9jdXNUaW1lb3V0KTtcbiAgICAgIGNvbnN0IGRvbUNhY2hlID0gcG9wdWxhdGVEb21DYWNoZShjdXJyZW50SW5zdGFuY2UpO1xuICAgICAgcmVuZGVyKGN1cnJlbnRJbnN0YW5jZSwgaW5uZXJQYXJhbXMpO1xuICAgICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldChjdXJyZW50SW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIHJldHVybiBzd2FsUHJvbWlzZShjdXJyZW50SW5zdGFuY2UsIGRvbUNhY2hlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBgY2F0Y2hgIGNhbm5vdCBiZSB0aGUgbmFtZSBvZiBhIG1vZHVsZSBleHBvcnQsIHNvIHdlIGRlZmluZSBvdXIgdGhlbmFibGUgbWV0aG9kcyBoZXJlIGluc3RlYWRcblxuXG4gICAgdGhlbihvbkZ1bGZpbGxlZCkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHByaXZhdGVQcm9wcy5wcm9taXNlLmdldCh0aGlzKTtcbiAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ob25GdWxmaWxsZWQpO1xuICAgIH1cblxuICAgIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgICBjb25zdCBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICAgICAgcmV0dXJuIHByb21pc2UuZmluYWxseShvbkZpbmFsbHkpO1xuICAgIH1cblxuICB9XG5cbiAgY29uc3Qgc3dhbFByb21pc2UgPSAoaW5zdGFuY2UsIGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBmdW5jdGlvbnMgdG8gaGFuZGxlIGFsbCBjbG9zaW5ncy9kaXNtaXNzYWxzXG4gICAgICBjb25zdCBkaXNtaXNzV2l0aCA9IGRpc21pc3MgPT4ge1xuICAgICAgICBpbnN0YW5jZS5jbG9zZVBvcHVwKHtcbiAgICAgICAgICBpc0Rpc21pc3NlZDogdHJ1ZSxcbiAgICAgICAgICBkaXNtaXNzXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZXNvbHZlLnNldChpbnN0YW5jZSwgcmVzb2x2ZSk7XG4gICAgICBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlamVjdC5zZXQoaW5zdGFuY2UsIHJlamVjdCk7XG5cbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZUNvbmZpcm1CdXR0b25DbGljayhpbnN0YW5jZSk7XG5cbiAgICAgIGRvbUNhY2hlLmRlbnlCdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZURlbnlCdXR0b25DbGljayhpbnN0YW5jZSk7XG5cbiAgICAgIGRvbUNhY2hlLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2soaW5zdGFuY2UsIGRpc21pc3NXaXRoKTtcblxuICAgICAgZG9tQ2FjaGUuY2xvc2VCdXR0b24ub25jbGljayA9ICgpID0+IGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uY2xvc2UpO1xuXG4gICAgICBoYW5kbGVQb3B1cENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgICAgYWRkS2V5ZG93bkhhbmRsZXIoaW5zdGFuY2UsIGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zQW5kVmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIG9wZW5Qb3B1cChpbm5lclBhcmFtcyk7XG4gICAgICBzZXR1cFRpbWVyKGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgICAgaW5pdEZvY3VzKGRvbUNhY2hlLCBpbm5lclBhcmFtcyk7IC8vIFNjcm9sbCBjb250YWluZXIgdG8gdG9wIG9uIG9wZW4gKCMxMjQ3LCAjMTk0NilcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5zY3JvbGxUb3AgPSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcHJlcGFyZVBhcmFtcyA9ICh1c2VyUGFyYW1zLCBtaXhpblBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRlbXBsYXRlUGFyYW1zID0gZ2V0VGVtcGxhdGVQYXJhbXModXNlclBhcmFtcyk7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcywgbWl4aW5QYXJhbXMsIHRlbXBsYXRlUGFyYW1zLCB1c2VyUGFyYW1zKTsgLy8gcHJlY2VkZW5jZSBpcyBkZXNjcmliZWQgaW4gIzIxMzFcblxuICAgIHBhcmFtcy5zaG93Q2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLnNob3dDbGFzcywgcGFyYW1zLnNob3dDbGFzcyk7XG4gICAgcGFyYW1zLmhpZGVDbGFzcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMuaGlkZUNsYXNzLCBwYXJhbXMuaGlkZUNsYXNzKTtcbiAgICByZXR1cm4gcGFyYW1zO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHJldHVybnMge0RvbUNhY2hlfVxuICAgKi9cblxuXG4gIGNvbnN0IHBvcHVsYXRlRG9tQ2FjaGUgPSBpbnN0YW5jZSA9PiB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSB7XG4gICAgICBwb3B1cDogZ2V0UG9wdXAoKSxcbiAgICAgIGNvbnRhaW5lcjogZ2V0Q29udGFpbmVyKCksXG4gICAgICBhY3Rpb25zOiBnZXRBY3Rpb25zKCksXG4gICAgICBjb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uKCksXG4gICAgICBkZW55QnV0dG9uOiBnZXREZW55QnV0dG9uKCksXG4gICAgICBjYW5jZWxCdXR0b246IGdldENhbmNlbEJ1dHRvbigpLFxuICAgICAgbG9hZGVyOiBnZXRMb2FkZXIoKSxcbiAgICAgIGNsb3NlQnV0dG9uOiBnZXRDbG9zZUJ1dHRvbigpLFxuICAgICAgdmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlKCksXG4gICAgICBwcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzKClcbiAgICB9O1xuICAgIHByaXZhdGVQcm9wcy5kb21DYWNoZS5zZXQoaW5zdGFuY2UsIGRvbUNhY2hlKTtcbiAgICByZXR1cm4gZG9tQ2FjaGU7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0dsb2JhbFN0YXRlfSBnbG9iYWxTdGF0ZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaXNtaXNzV2l0aFxuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwVGltZXIgPSAoZ2xvYmFsU3RhdGUkJDEsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgaGlkZSh0aW1lclByb2dyZXNzQmFyKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy50aW1lcikge1xuICAgICAgZ2xvYmFsU3RhdGUkJDEudGltZW91dCA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICAgIGRpc21pc3NXaXRoKCd0aW1lcicpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUkJDEudGltZW91dDtcbiAgICAgIH0sIGlubmVyUGFyYW1zLnRpbWVyKTtcblxuICAgICAgaWYgKGlubmVyUGFyYW1zLnRpbWVyUHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgc2hvdyh0aW1lclByb2dyZXNzQmFyKTtcbiAgICAgICAgYXBwbHlDdXN0b21DbGFzcyh0aW1lclByb2dyZXNzQmFyLCBpbm5lclBhcmFtcywgJ3RpbWVyUHJvZ3Jlc3NCYXInKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUkJDEudGltZW91dC5ydW5uaW5nKSB7XG4gICAgICAgICAgICAvLyB0aW1lciBjYW4gYmUgYWxyZWFkeSBzdG9wcGVkIG9yIHVuc2V0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKGlubmVyUGFyYW1zLnRpbWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9tQ2FjaGV9IGRvbUNhY2hlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaW5pdEZvY3VzID0gKGRvbUNhY2hlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFbnRlcktleSkpIHtcbiAgICAgIHJldHVybiBibHVyQWN0aXZlRWxlbWVudCgpO1xuICAgIH1cblxuICAgIGlmICghZm9jdXNCdXR0b24oZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSkge1xuICAgICAgc2V0Rm9jdXMoaW5uZXJQYXJhbXMsIC0xLCAxKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBmb2N1c0J1dHRvbiA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNEZW55ICYmIGlzVmlzaWJsZShkb21DYWNoZS5kZW55QnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuZGVueUJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ2FuY2VsICYmIGlzVmlzaWJsZShkb21DYWNoZS5jYW5jZWxCdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NvbmZpcm0gJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNvbmZpcm1CdXR0b24pKSB7XG4gICAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgYmx1ckFjdGl2ZUVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH07IC8vIFRoaXMgYW50aS13YXIgbWVzc2FnZSB3aWxsIG9ubHkgYmUgc2hvd24gdG8gUnVzc2lhbiB1c2VycyB2aXNpdGluZyBSdXNzaWFuIHNpdGVzXG5cblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgL15ydVxcYi8udGVzdChuYXZpZ2F0b3IubGFuZ3VhZ2UpICYmIGxvY2F0aW9uLmhvc3QubWF0Y2goL1xcLihydXxzdXx4bi0tcDFhaSkkLykpIHtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMSkge1xuICAgICAgY29uc3Qgbm9XYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG5vV2FyLmNsYXNzTmFtZSA9ICdsZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQnO1xuICAgICAgY29uc3QgdmlkZW8gPSBnZXRSYW5kb21FbGVtZW50KFt7XG4gICAgICAgIHRleHQ6IFwiXFx1MDQxMiBcXHUwNDNEXFx1MDQzOFxcdTA0MzZcXHUwNDM1XFx1MDQzRlxcdTA0NDBcXHUwNDM4XFx1MDQzMlxcdTA0MzVcXHUwNDM0XFx1MDQ1MVxcdTA0M0RcXHUwNDNEXFx1MDQzRVxcdTA0M0MgXFx1MDQzMlxcdTA0MzhcXHUwNDM0XFx1MDQzNVxcdTA0M0UgXFx1MDQzRVxcdTA0MzFcXHUwNDRBXFx1MDQ0RlxcdTA0NDFcXHUwNDNEXFx1MDQ0RlxcdTA0MzVcXHUwNDQyXFx1MDQ0MVxcdTA0NEYgXFx1MDQzQVxcdTA0MzBcXHUwNDNBIFxcdTA0M0FcXHUwNDMwXFx1MDQzNlxcdTA0MzRcXHUwNDRCXFx1MDQzOSBcXHUwNDM4XFx1MDQzNyBcXHUwNDNEXFx1MDQzMFxcdTA0NDEgXFx1MDQzQ1xcdTA0M0VcXHUwNDM2XFx1MDQzNVxcdTA0NDIgXFx1MDQzRlxcdTA0M0VcXHUwNDNDXFx1MDQzRVxcdTA0NDdcXHUwNDRDIFxcdTA0MzIgXFx1MDQ0MlxcdTA0M0VcXHUwNDNDLFxcbiAgICAgICAgPHN0cm9uZz5cXHUwNDQ3XFx1MDQ0MlxcdTA0M0VcXHUwNDMxXFx1MDQ0QiBcXHUwNDREXFx1MDQ0MlxcdTA0MzAgXFx1MDQzMVxcdTA0MzVcXHUwNDQxXFx1MDQ0MVxcdTA0M0NcXHUwNDRCXFx1MDQ0MVxcdTA0M0JcXHUwNDM1XFx1MDQzRFxcdTA0M0RcXHUwNDMwXFx1MDQ0RiBcXHUwNDM4IFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDdcXHUwNDM1XFx1MDQzQlxcdTA0M0VcXHUwNDMyXFx1MDQzNVxcdTA0NDdcXHUwNDNEXFx1MDQzMFxcdTA0NEYgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0MzAgXFx1MDQzRVxcdTA0NDFcXHUwNDQyXFx1MDQzMFxcdTA0M0RcXHUwNDNFXFx1MDQzMlxcdTA0MzhcXHUwNDNCXFx1MDQzMFxcdTA0NDFcXHUwNDRDPC9zdHJvbmc+OlwiLFxuICAgICAgICBpZDogJzRDZkRoYVJrdzdJJ1xuICAgICAgfSwge1xuICAgICAgICB0ZXh0OiAnXHUwNDJEXHUwNDNDXHUwNDNGXHUwNDMwXHUwNDQyXHUwNDM4XHUwNDRGIC0gXHUwNDMzXHUwNDNCXHUwNDMwXHUwNDMyXHUwNDNEXHUwNDNFXHUwNDM1IDxzdHJvbmc+XHUwNDQ3XHUwNDM1XHUwNDNCXHUwNDNFXHUwNDMyXHUwNDM1XHUwNDQ3XHUwNDM1XHUwNDQxXHUwNDNBXHUwNDNFXHUwNDM1PC9zdHJvbmc+IFx1MDQ0N1x1MDQ0M1x1MDQzMlx1MDQ0MVx1MDQ0Mlx1MDQzMlx1MDQzRS4gXHUwNDIxXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNFXHUwNDMxXHUwNDNEXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQ0MVx1MDQzRVx1MDQzRlx1MDQzNVx1MDQ0MFx1MDQzNVx1MDQzNlx1MDQzOFx1MDQzMlx1MDQzMFx1MDQ0Mlx1MDQ0Qy4gPHN0cm9uZz5cdTA0MjFcdTA0M0ZcdTA0M0VcdTA0NDFcdTA0M0VcdTA0MzFcdTA0M0RcdTA0M0VcdTA0NDFcdTA0NDJcdTA0NEMgXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDMyXHUwNDM4XHUwNDQyXHUwNDRDIFx1MDQ0MVx1MDQzNVx1MDQzMVx1MDQ0RiBcdTA0M0RcdTA0MzAgXHUwNDNDXHUwNDM1XHUwNDQxXHUwNDQyXHUwNDNFIFx1MDQzNFx1MDQ0MFx1MDQ0M1x1MDQzM1x1MDQzRVx1MDQzM1x1MDQzRS48L3N0cm9uZz4nLFxuICAgICAgICBpZDogJ3MtR0xBSVk0RFhBJ1xuICAgICAgfV0pO1xuICAgICAgc2V0SW5uZXJIdG1sKG5vV2FyLCBcIlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDE1XFx1MDQ0MVxcdTA0M0JcXHUwNDM4IFxcdTA0M0NcXHUwNDRCIFxcdTA0M0RcXHUwNDM1IFxcdTA0M0VcXHUwNDQxXFx1MDQ0MlxcdTA0MzBcXHUwNDNEXFx1MDQzRVxcdTA0MzJcXHUwNDM4XFx1MDQzQyBcXHUwNDMyXFx1MDQzRVxcdTA0MzlcXHUwNDNEXFx1MDQ0MywgXFx1MDQzRVxcdTA0M0RcXHUwNDMwIFxcdTA0M0ZcXHUwNDQwXFx1MDQzOFxcdTA0MzRcXHUwNDM1XFx1MDQ0MiBcXHUwNDMyIFxcdTA0MzRcXHUwNDNFXFx1MDQzQyA8c3Ryb25nPlxcdTA0M0FcXHUwNDMwXFx1MDQzNlxcdTA0MzRcXHUwNDNFXFx1MDQzM1xcdTA0M0UgXFx1MDQzOFxcdTA0MzcgXFx1MDQzRFxcdTA0MzBcXHUwNDQxPC9zdHJvbmc+IFxcdTA0MzggXFx1MDQzNVxcdTA0NTEgXFx1MDQzRlxcdTA0M0VcXHUwNDQxXFx1MDQzQlxcdTA0MzVcXHUwNDM0XFx1MDQ0MVxcdTA0NDJcXHUwNDMyXFx1MDQzOFxcdTA0NEYgXFx1MDQzMVxcdTA0NDNcXHUwNDM0XFx1MDQ0M1xcdTA0NDIgPHN0cm9uZz5cXHUwNDQzXFx1MDQzNlxcdTA0MzBcXHUwNDQxXFx1MDQzMFxcdTA0NEVcXHUwNDQ5XFx1MDQzOFxcdTA0M0NcXHUwNDM4PC9zdHJvbmc+LlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDFGXFx1MDQ0M1xcdTA0NDJcXHUwNDM4XFx1MDQzRFxcdTA0NDFcXHUwNDNBXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MFxcdTA0MzVcXHUwNDM2XFx1MDQzOFxcdTA0M0MgXFx1MDQzN1xcdTA0MzAgMjAgXFx1MDQ0MSBcXHUwNDNCXFx1MDQzOFxcdTA0NDhcXHUwNDNEXFx1MDQzOFxcdTA0M0MgXFx1MDQzQlxcdTA0MzVcXHUwNDQyIFxcdTA0NDFcXHUwNDMyXFx1MDQzRVxcdTA0MzVcXHUwNDMzXFx1MDQzRSBcXHUwNDQxXFx1MDQ0M1xcdTA0NDlcXHUwNDM1XFx1MDQ0MVxcdTA0NDJcXHUwNDMyXFx1MDQzRVxcdTA0MzJcXHUwNDMwXFx1MDQzRFxcdTA0MzhcXHUwNDRGIFxcdTA0MzJcXHUwNDM0XFx1MDQzRVxcdTA0M0JcXHUwNDMxXFx1MDQzOFxcdTA0M0IgXFx1MDQzRFxcdTA0MzBcXHUwNDNDLCBcXHUwNDQ3XFx1MDQ0MlxcdTA0M0UgXFx1MDQzQ1xcdTA0NEIgXFx1MDQzMVxcdTA0MzVcXHUwNDQxXFx1MDQ0MVxcdTA0MzhcXHUwNDNCXFx1MDQ0Q1xcdTA0M0RcXHUwNDRCIFxcdTA0MzggXFx1MDQzRVxcdTA0MzRcXHUwNDM4XFx1MDQzRCBcXHUwNDQ3XFx1MDQzNVxcdTA0M0JcXHUwNDNFXFx1MDQzMlxcdTA0MzVcXHUwNDNBIFxcdTA0M0RcXHUwNDM1IFxcdTA0M0NcXHUwNDNFXFx1MDQzNlxcdTA0MzVcXHUwNDQyIFxcdTA0M0RcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDMzXFx1MDQzRSBcXHUwNDQxXFx1MDQzNFxcdTA0MzVcXHUwNDNCXFx1MDQzMFxcdTA0NDJcXHUwNDRDLiA8c3Ryb25nPlxcdTA0MkRcXHUwNDQyXFx1MDQzRSBcXHUwNDNEXFx1MDQzNSBcXHUwNDQyXFx1MDQzMFxcdTA0M0EhPC9zdHJvbmc+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdj5cXG4gICAgICAgIFwiLmNvbmNhdCh2aWRlby50ZXh0LCBcIlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxpZnJhbWUgd2lkdGg9XFxcIjU2MFxcXCIgaGVpZ2h0PVxcXCIzMTVcXFwiIHNyYz1cXFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvXCIpLmNvbmNhdCh2aWRlby5pZCwgXCJcXFwiIGZyYW1lYm9yZGVyPVxcXCIwXFxcIiBhbGxvdz1cXFwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZVxcXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcXHUwNDFEXFx1MDQzNVxcdTA0NDIgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0MzUhXFxuICAgICAgPC9kaXY+XFxuICAgICAgXCIpKTtcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBjbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnJnRpbWVzOyc7XG5cbiAgICAgIGNsb3NlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBub1dhci5yZW1vdmUoKTtcblxuICAgICAgbm9XYXIuYXBwZW5kQ2hpbGQoY2xvc2VCdXR0b24pO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9XYXIpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSAvLyBBc3NpZ24gaW5zdGFuY2UgbWV0aG9kcyBmcm9tIHNyYy9pbnN0YW5jZU1ldGhvZHMvKi5qcyB0byBwcm90b3R5cGVcblxuXG4gIE9iamVjdC5hc3NpZ24oU3dlZXRBbGVydC5wcm90b3R5cGUsIGluc3RhbmNlTWV0aG9kcyk7IC8vIEFzc2lnbiBzdGF0aWMgbWV0aG9kcyBmcm9tIHNyYy9zdGF0aWNNZXRob2RzLyouanMgdG8gY29uc3RydWN0b3JcblxuICBPYmplY3QuYXNzaWduKFN3ZWV0QWxlcnQsIHN0YXRpY01ldGhvZHMpOyAvLyBQcm94eSB0byBpbnN0YW5jZSBtZXRob2RzIHRvIGNvbnN0cnVjdG9yLCBmb3Igbm93LCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblxuICBPYmplY3Qua2V5cyhpbnN0YW5jZU1ldGhvZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBTd2VldEFsZXJ0W2tleV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY3VycmVudEluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50SW5zdGFuY2Vba2V5XSguLi5hcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuICBTd2VldEFsZXJ0LkRpc21pc3NSZWFzb24gPSBEaXNtaXNzUmVhc29uO1xuICBTd2VldEFsZXJ0LnZlcnNpb24gPSAnMTEuNC4yNic7XG5cbiAgY29uc3QgU3dhbCA9IFN3ZWV0QWxlcnQ7IC8vIEB0cy1pZ25vcmVcblxuICBTd2FsLmRlZmF1bHQgPSBTd2FsO1xuXG4gIHJldHVybiBTd2FsO1xuXG59KSk7XG5pZiAodHlwZW9mIHRoaXMgIT09ICd1bmRlZmluZWQnICYmIHRoaXMuU3dlZXRhbGVydDIpeyAgdGhpcy5zd2FsID0gdGhpcy5zd2VldEFsZXJ0ID0gdGhpcy5Td2FsID0gdGhpcy5Td2VldEFsZXJ0ID0gdGhpcy5Td2VldGFsZXJ0Mn1cblxuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50JiZmdW5jdGlvbihlLHQpe3ZhciBuPWUuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO2lmKGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKG4pLG4uc3R5bGVTaGVldCluLnN0eWxlU2hlZXQuZGlzYWJsZWR8fChuLnN0eWxlU2hlZXQuY3NzVGV4dD10KTtlbHNlIHRyeXtuLmlubmVySFRNTD10fWNhdGNoKGUpe24uaW5uZXJUZXh0PXR9fShkb2N1bWVudCxcIi5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdHtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC1jb2x1bW46MS80IWltcG9ydGFudDtncmlkLXJvdzoxLzQhaW1wb3J0YW50O2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgOTlmciAxZnI7cGFkZGluZzoxZW07b3ZlcmZsb3cteTpoaWRkZW47YmFja2dyb3VuZDojZmZmO2JveC1zaGFkb3c6MCAwIDFweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMCAxcHggMnB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwxcHggMnB4IDRweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMXB4IDNweCA4cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDJweCA0cHggMTZweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSk7cG9pbnRlci1ldmVudHM6YWxsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdD4qe2dyaWQtY29sdW1uOjJ9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi10aXRsZXttYXJnaW46LjVlbSAxZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxZW07dGV4dC1hbGlnbjppbml0aWFsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItbG9hZGluZ3tqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaW5wdXR7aGVpZ2h0OjJlbTttYXJnaW46LjVlbTtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1mb290ZXJ7bWFyZ2luOi41ZW0gMCAwO3BhZGRpbmc6LjVlbSAwIDA7Zm9udC1zaXplOi44ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1jbG9zZXtncmlkLWNvbHVtbjozLzM7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDouOGVtO2hlaWdodDouOGVtO21hcmdpbjowO2ZvbnQtc2l6ZToyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1odG1sLWNvbnRhaW5lcnttYXJnaW46LjVlbSAxZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxZW07dGV4dC1hbGlnbjppbml0aWFsfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaHRtbC1jb250YWluZXI6ZW1wdHl7cGFkZGluZzowfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItbG9hZGVye2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46LjI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29ue2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MS85OTthbGlnbi1zZWxmOmNlbnRlcjt3aWR0aDoyZW07bWluLXdpZHRoOjJlbTtoZWlnaHQ6MmVtO21hcmdpbjowIC41ZW0gMCAwfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbiAuc3dhbDItaWNvbi1jb250ZW50e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjEuOGVtO2ZvbnQtd2VpZ2h0OjcwMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3dpZHRoOjJlbTtoZWlnaHQ6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXXt0b3A6Ljg3NWVtO3dpZHRoOjEuMzc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1sZWZ0XXtsZWZ0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWFjdGlvbnN7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnQ7aGVpZ2h0OmF1dG87bWFyZ2luOjA7bWFyZ2luLXRvcDouNWVtO3BhZGRpbmc6MCAuNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3R5bGVke21hcmdpbjouMjVlbSAuNWVtO3BhZGRpbmc6LjRlbSAuNmVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNze2JvcmRlci1jb2xvcjojYTVkYzg2fS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MS42ZW07aGVpZ2h0OjNlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKTtib3JkZXItcmFkaXVzOjUwJX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS44ZW07bGVmdDotLjVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtLW9yaWdpbjoyZW0gMmVtO2JvcmRlci1yYWRpdXM6NGVtIDAgMCA0ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjI1ZW07bGVmdDouOTM3NWVtO3RyYW5zZm9ybS1vcmlnaW46MCAxLjVlbTtib3JkZXItcmFkaXVzOjAgNGVtIDRlbSAwfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3dpZHRoOjJlbTtoZWlnaHQ6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1maXh7dG9wOjA7bGVmdDouNDM3NWVtO3dpZHRoOi40Mzc1ZW07aGVpZ2h0OjIuNjg3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV17aGVpZ2h0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9dGlwXXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9bG9uZ117dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXB7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25ney13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1czthbmltYXRpb246c3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdC5zd2FsMi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LXNob3cgLjVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1zaG93IC41c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Quc3dhbDItaGlkZXstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1oaWRlIC4xcyBmb3J3YXJkczthbmltYXRpb246c3dhbDItdG9hc3QtaGlkZSAuMXMgZm9yd2FyZHN9LnN3YWwyLWNvbnRhaW5lcntkaXNwbGF5OmdyaWQ7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxMDYwO3RvcDowO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2JveC1zaXppbmc6Ym9yZGVyLWJveDtncmlkLXRlbXBsYXRlLWFyZWFzOlxcXCJ0b3Atc3RhcnQgICAgIHRvcCAgICAgICAgICAgIHRvcC1lbmRcXFwiIFxcXCJjZW50ZXItc3RhcnQgIGNlbnRlciAgICAgICAgIGNlbnRlci1lbmRcXFwiIFxcXCJib3R0b20tc3RhcnQgIGJvdHRvbS1jZW50ZXIgIGJvdHRvbS1lbmRcXFwiO2dyaWQtdGVtcGxhdGUtcm93czptaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKSBtaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKSBtaW5tYXgoLXdlYmtpdC1taW4tY29udGVudCxhdXRvKTtncmlkLXRlbXBsYXRlLXJvd3M6bWlubWF4KG1pbi1jb250ZW50LGF1dG8pIG1pbm1heChtaW4tY29udGVudCxhdXRvKSBtaW5tYXgobWluLWNvbnRlbnQsYXV0byk7aGVpZ2h0OjEwMCU7cGFkZGluZzouNjI1ZW07b3ZlcmZsb3cteDpoaWRkZW47dHJhbnNpdGlvbjpiYWNrZ3JvdW5kLWNvbG9yIC4xczstd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzp0b3VjaH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJhY2tkcm9wLXNob3csLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ub2FuaW1hdGlvbntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjQpfS5zd2FsMi1jb250YWluZXIuc3dhbDItYmFja2Ryb3AtaGlkZXtiYWNrZ3JvdW5kOjAgMCFpbXBvcnRhbnR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItc3RhcnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOm1pbm1heCgwLDFmcikgYXV0byBhdXRvfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9we2dyaWQtdGVtcGxhdGUtY29sdW1uczphdXRvIG1pbm1heCgwLDFmcikgYXV0b30uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6YXV0byBhdXRvIG1pbm1heCgwLDFmcil9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3Atc3RhcnQ+LnN3YWwyLXBvcHVwe2FsaWduLXNlbGY6c3RhcnR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3A+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjI7YWxpZ24tc2VsZjpzdGFydDtqdXN0aWZ5LXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtcmlnaHQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjM7YWxpZ24tc2VsZjpzdGFydDtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWxlZnQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0Pi5zd2FsMi1wb3B1cHtncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXI7anVzdGlmeS1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2dyaWQtcm93OjI7YWxpZ24tc2VsZjpjZW50ZXI7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0Pi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MTtncmlkLXJvdzozO2FsaWduLXNlbGY6ZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2dyaWQtcm93OjM7anVzdGlmeS1zZWxmOmNlbnRlcjthbGlnbi1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2dyaWQtcm93OjM7YWxpZ24tc2VsZjplbmQ7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctZnVsbHNjcmVlbj4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LXJvdz4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MS80O3dpZHRoOjEwMCV9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbj4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWZ1bGxzY3JlZW4+LnN3YWwyLXBvcHVwe2dyaWQtcm93OjEvNDthbGlnbi1zZWxmOnN0cmV0Y2h9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1uby10cmFuc2l0aW9ue3RyYW5zaXRpb246bm9uZSFpbXBvcnRhbnR9LnN3YWwyLXBvcHVwe2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOm1pbm1heCgwLDEwMCUpO3dpZHRoOjMyZW07bWF4LXdpZHRoOjEwMCU7cGFkZGluZzowIDAgMS4yNWVtO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojNTQ1NDU0O2ZvbnQtZmFtaWx5OmluaGVyaXQ7Zm9udC1zaXplOjFyZW19LnN3YWwyLXBvcHVwOmZvY3Vze291dGxpbmU6MH0uc3dhbDItcG9wdXAuc3dhbDItbG9hZGluZ3tvdmVyZmxvdy15OmhpZGRlbn0uc3dhbDItdGl0bGV7cG9zaXRpb246cmVsYXRpdmU7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjA7cGFkZGluZzouOGVtIDFlbSAwO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuODc1ZW07Zm9udC13ZWlnaHQ6NjAwO3RleHQtYWxpZ246Y2VudGVyO3RleHQtdHJhbnNmb3JtOm5vbmU7d29yZC13cmFwOmJyZWFrLXdvcmR9LnN3YWwyLWFjdGlvbnN7ZGlzcGxheTpmbGV4O3otaW5kZXg6MTtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6YXV0bzttYXJnaW46MS4yNWVtIGF1dG8gMDtwYWRkaW5nOjB9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkW2Rpc2FibGVkXXtvcGFjaXR5Oi40fS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZDpob3ZlcntiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDAsMCwwLC4xKSxyZ2JhKDAsMCwwLC4xKSl9LnN3YWwyLWFjdGlvbnM6bm90KC5zd2FsMi1sb2FkaW5nKSAuc3dhbDItc3R5bGVkOmFjdGl2ZXtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudChyZ2JhKDAsMCwwLC4yKSxyZ2JhKDAsMCwwLC4yKSl9LnN3YWwyLWxvYWRlcntkaXNwbGF5Om5vbmU7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6Mi4yZW07aGVpZ2h0OjIuMmVtO21hcmdpbjowIDEuODc1ZW07LXdlYmtpdC1hbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtbG9hZGluZyAxLjVzIGxpbmVhciAwcyBpbmZpbml0ZSBub3JtYWw7Ym9yZGVyLXdpZHRoOi4yNWVtO2JvcmRlci1zdHlsZTpzb2xpZDtib3JkZXItcmFkaXVzOjEwMCU7Ym9yZGVyLWNvbG9yOiMyNzc4YzQgdHJhbnNwYXJlbnQgIzI3NzhjNCB0cmFuc3BhcmVudH0uc3dhbDItc3R5bGVke21hcmdpbjouMzEyNWVtO3BhZGRpbmc6LjYyNWVtIDEuMWVtO3RyYW5zaXRpb246Ym94LXNoYWRvdyAuMXM7Ym94LXNoYWRvdzowIDAgMCAzcHggdHJhbnNwYXJlbnQ7Zm9udC13ZWlnaHQ6NTAwfS5zd2FsMi1zdHlsZWQ6bm90KFtkaXNhYmxlZF0pe2N1cnNvcjpwb2ludGVyfS5zd2FsMi1zdHlsZWQuc3dhbDItY29uZmlybXtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiM3MDY2ZTA7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItY29uZmlybTpmb2N1c3tib3gtc2hhZG93OjAgMCAwIDNweCByZ2JhKDExMiwxMDIsMjI0LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWRlbnl7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojZGMzNzQxO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWRlbnk6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgyMjAsNTUsNjUsLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItY2FuY2Vse2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6IzZlNzg4MTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1jYW5jZWw6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMTAsMTIwLDEyOSwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1kZWZhdWx0LW91dGxpbmU6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLXN0eWxlZDpmb2N1c3tvdXRsaW5lOjB9LnN3YWwyLXN0eWxlZDo6LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MH0uc3dhbDItZm9vdGVye2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAwIDA7cGFkZGluZzoxZW0gMWVtIDA7Ym9yZGVyLXRvcDoxcHggc29saWQgI2VlZTtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxZW19LnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXJ7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7Z3JpZC1jb2x1bW46YXV0byFpbXBvcnRhbnQ7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOjVweDtib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOjVweH0uc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFye3dpZHRoOjEwMCU7aGVpZ2h0Oi4yNWVtO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuMil9LnN3YWwyLWltYWdle21heC13aWR0aDoxMDAlO21hcmdpbjoyZW0gYXV0byAxZW19LnN3YWwyLWNsb3Nle3otaW5kZXg6MjthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDoxLjJlbTtoZWlnaHQ6MS4yZW07bWFyZ2luLXRvcDowO21hcmdpbi1yaWdodDowO21hcmdpbi1ib3R0b206LTEuMmVtO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW47dHJhbnNpdGlvbjpjb2xvciAuMXMsYm94LXNoYWRvdyAuMXM7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDowIDA7Y29sb3I6I2NjYztmb250LWZhbWlseTpzZXJpZjtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjIuNWVtO2N1cnNvcjpwb2ludGVyO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNsb3NlOmhvdmVye3RyYW5zZm9ybTpub25lO2JhY2tncm91bmQ6MCAwO2NvbG9yOiNmMjc0NzR9LnN3YWwyLWNsb3NlOmZvY3Vze291dGxpbmU6MDtib3gtc2hhZG93Omluc2V0IDAgMCAwIDNweCByZ2JhKDEwMCwxNTAsMjAwLC41KX0uc3dhbDItY2xvc2U6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9LnN3YWwyLWh0bWwtY29udGFpbmVye3otaW5kZXg6MTtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMS42ZW0gLjNlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6YXV0bztjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtO2ZvbnQtd2VpZ2h0OjQwMDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC1hbGlnbjpjZW50ZXI7d29yZC13cmFwOmJyZWFrLXdvcmQ7d29yZC1icmVhazpicmVhay13b3JkfS5zd2FsMi1jaGVja2JveCwuc3dhbDItZmlsZSwuc3dhbDItaW5wdXQsLnN3YWwyLXJhZGlvLC5zd2FsMi1zZWxlY3QsLnN3YWwyLXRleHRhcmVhe21hcmdpbjoxZW0gMmVtIDNweH0uc3dhbDItZmlsZSwuc3dhbDItaW5wdXQsLnN3YWwyLXRleHRhcmVhe2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDphdXRvO3RyYW5zaXRpb246Ym9yZGVyLWNvbG9yIC4xcyxib3gtc2hhZG93IC4xcztib3JkZXI6MXB4IHNvbGlkICNkOWQ5ZDk7Ym9yZGVyLXJhZGl1czouMTg3NWVtO2JhY2tncm91bmQ6MCAwO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA2KSwwIDAgMCAzcHggdHJhbnNwYXJlbnQ7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItZmlsZS5zd2FsMi1pbnB1dGVycm9yLC5zd2FsMi1pbnB1dC5zd2FsMi1pbnB1dGVycm9yLC5zd2FsMi10ZXh0YXJlYS5zd2FsMi1pbnB1dGVycm9ye2JvcmRlci1jb2xvcjojZjI3NDc0IWltcG9ydGFudDtib3gtc2hhZG93OjAgMCAycHggI2YyNzQ3NCFpbXBvcnRhbnR9LnN3YWwyLWZpbGU6Zm9jdXMsLnN3YWwyLWlucHV0OmZvY3VzLC5zd2FsMi10ZXh0YXJlYTpmb2N1c3tib3JkZXI6MXB4IHNvbGlkICNiNGRiZWQ7b3V0bGluZTowO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA2KSwwIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLWZpbGU6Oi1tb3otcGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6LW1vei1wbGFjZWhvbGRlcntjb2xvcjojY2NjfS5zd2FsMi1maWxlOjpwbGFjZWhvbGRlciwuc3dhbDItaW5wdXQ6OnBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6cGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItcmFuZ2V7bWFyZ2luOjFlbSAyZW0gM3B4O2JhY2tncm91bmQ6I2ZmZn0uc3dhbDItcmFuZ2UgaW5wdXR7d2lkdGg6ODAlfS5zd2FsMi1yYW5nZSBvdXRwdXR7d2lkdGg6MjAlO2NvbG9yOmluaGVyaXQ7Zm9udC13ZWlnaHQ6NjAwO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1yYW5nZSBpbnB1dCwuc3dhbDItcmFuZ2Ugb3V0cHV0e2hlaWdodDoyLjYyNWVtO3BhZGRpbmc6MDtmb250LXNpemU6MS4xMjVlbTtsaW5lLWhlaWdodDoyLjYyNWVtfS5zd2FsMi1pbnB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjAgLjc1ZW19LnN3YWwyLWZpbGV7d2lkdGg6NzUlO21hcmdpbi1yaWdodDphdXRvO21hcmdpbi1sZWZ0OmF1dG87YmFja2dyb3VuZDowIDA7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLXRleHRhcmVhe2hlaWdodDo2Ljc1ZW07cGFkZGluZzouNzVlbX0uc3dhbDItc2VsZWN0e21pbi13aWR0aDo1MCU7bWF4LXdpZHRoOjEwMCU7cGFkZGluZzouMzc1ZW0gLjYyNWVtO2JhY2tncm91bmQ6MCAwO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94LC5zd2FsMi1yYWRpb3thbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtiYWNrZ3JvdW5kOiNmZmY7Y29sb3I6aW5oZXJpdH0uc3dhbDItY2hlY2tib3ggbGFiZWwsLnN3YWwyLXJhZGlvIGxhYmVse21hcmdpbjowIC42ZW07Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94IGlucHV0LC5zd2FsMi1yYWRpbyBpbnB1dHtmbGV4LXNocmluazowO21hcmdpbjowIC40ZW19LnN3YWwyLWlucHV0LWxhYmVse2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gYXV0byAwfS5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjFlbSAwIDA7cGFkZGluZzouNjI1ZW07b3ZlcmZsb3c6aGlkZGVuO2JhY2tncm91bmQ6I2YwZjBmMDtjb2xvcjojNjY2O2ZvbnQtc2l6ZToxZW07Zm9udC13ZWlnaHQ6MzAwfS5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2U6OmJlZm9yZXtjb250ZW50OlxcXCIhXFxcIjtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoxLjVlbTttaW4td2lkdGg6MS41ZW07aGVpZ2h0OjEuNWVtO21hcmdpbjowIC42MjVlbTtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2ZmZjtmb250LXdlaWdodDo2MDA7bGluZS1oZWlnaHQ6MS41ZW07dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLWljb257cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpjb250ZW50LWJveDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjVlbTtoZWlnaHQ6NWVtO21hcmdpbjoyLjVlbSBhdXRvIC42ZW07Ym9yZGVyOi4yNWVtIHNvbGlkIHRyYW5zcGFyZW50O2JvcmRlci1yYWRpdXM6NTAlO2JvcmRlci1jb2xvcjojMDAwO2ZvbnQtZmFtaWx5OmluaGVyaXQ7bGluZS1oZWlnaHQ6NWVtO2N1cnNvcjpkZWZhdWx0Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uc3dhbDItaWNvbiAuc3dhbDItaWNvbi1jb250ZW50e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC1zaXplOjMuNzVlbX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NDtjb2xvcjojZjI3NDc0fS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIC5zd2FsMi14LW1hcmt7cG9zaXRpb246cmVsYXRpdmU7ZmxleC1ncm93OjF9LnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6Mi4zMTI1ZW07d2lkdGg6Mi45Mzc1ZW07aGVpZ2h0Oi4zMTI1ZW07Ym9yZGVyLXJhZGl1czouMTI1ZW07YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0fS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1sZWZ0XXtsZWZ0OjEuMDYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6MWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvci5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1lcnJvci5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXgtbWFya3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrIC41c30uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5ne2JvcmRlci1jb2xvcjojZmFjZWE4O2NvbG9yOiNmOGJiODZ9LnN3YWwyLWljb24uc3dhbDItd2FybmluZy5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5nLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjVzfS5zd2FsMi1pY29uLnN3YWwyLWluZm97Ym9yZGVyLWNvbG9yOiM5ZGUwZjY7Y29sb3I6IzNmYzNlZX0uc3dhbDItaWNvbi5zd2FsMi1pbmZvLnN3YWwyLWljb24tc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1pY29uLnN3YWwyLWluZm8uc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjhzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuOHN9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb257Ym9yZGVyLWNvbG9yOiNjOWRhZTE7Y29sb3I6Izg3YWRiZH0uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbi5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbi5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmsgLjhzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODY7Y29sb3I6I2E1ZGM4Nn0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXXtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDozLjc1ZW07aGVpZ2h0OjcuNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS40Mzc1ZW07bGVmdDotMi4wNjM1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46My43NWVtIDMuNzVlbTtib3JkZXItcmFkaXVzOjcuNWVtIDAgMCA3LjVlbX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjY4NzVlbTtsZWZ0OjEuODc1ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MCAzLjc1ZW07Ym9yZGVyLXJhZGl1czowIDcuNWVtIDcuNWVtIDB9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1yaW5ne3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6Mjt0b3A6LS4yNWVtO2xlZnQ6LS4yNWVtO2JveC1zaXppbmc6Y29udGVudC1ib3g7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6LjI1ZW0gc29saWQgcmdiYSgxNjUsMjIwLDEzNCwuMyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyAuc3dhbDItc3VjY2Vzcy1maXh7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoxO3RvcDouNWVtO2xlZnQ6MS42MjVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDo1LjYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MjtoZWlnaHQ6LjMxMjVlbTtib3JkZXItcmFkaXVzOi4xMjVlbTtiYWNrZ3JvdW5kLWNvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjIuODc1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1saW5lLXRpcHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXN9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS1sb25ney13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWluO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lIDQuMjVzIGVhc2UtaW59LnN3YWwyLXByb2dyZXNzLXN0ZXBze2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjttYXgtd2lkdGg6MTAwJTttYXJnaW46MS4yNWVtIGF1dG87cGFkZGluZzowO2JhY2tncm91bmQ6MCAwO2ZvbnQtd2VpZ2h0OjYwMH0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgbGl7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246cmVsYXRpdmV9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwe3otaW5kZXg6MjA7ZmxleC1zaHJpbms6MDt3aWR0aDoyZW07aGVpZ2h0OjJlbTtib3JkZXItcmFkaXVzOjJlbTtiYWNrZ3JvdW5kOiMyNzc4YzQ7Y29sb3I6I2ZmZjtsaW5lLWhlaWdodDoyZW07dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwe2JhY2tncm91bmQ6IzI3NzhjNH0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB+LnN3YWwyLXByb2dyZXNzLXN0ZXB7YmFja2dyb3VuZDojYWRkOGU2O2NvbG9yOiNmZmZ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwLWxpbmV7YmFja2dyb3VuZDojYWRkOGU2fS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC1saW5le3otaW5kZXg6MTA7ZmxleC1zaHJpbms6MDt3aWR0aDoyLjVlbTtoZWlnaHQ6LjRlbTttYXJnaW46MCAtMXB4O2JhY2tncm91bmQ6IzI3NzhjNH1bY2xhc3NePXN3YWwyXXstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6dHJhbnNwYXJlbnR9LnN3YWwyLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItc2hvdyAuM3M7YW5pbWF0aW9uOnN3YWwyLXNob3cgLjNzfS5zd2FsMi1oaWRley13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWhpZGUgLjE1cyBmb3J3YXJkczthbmltYXRpb246c3dhbDItaGlkZSAuMTVzIGZvcndhcmRzfS5zd2FsMi1ub2FuaW1hdGlvbnt0cmFuc2l0aW9uOm5vbmV9LnN3YWwyLXNjcm9sbGJhci1tZWFzdXJle3Bvc2l0aW9uOmFic29sdXRlO3RvcDotOTk5OXB4O3dpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6c2Nyb2xsfS5zd2FsMi1ydGwgLnN3YWwyLWNsb3Nle21hcmdpbi1yaWdodDppbml0aWFsO21hcmdpbi1sZWZ0OjB9LnN3YWwyLXJ0bCAuc3dhbDItdGltZXItcHJvZ3Jlc3MtYmFye3JpZ2h0OjA7bGVmdDphdXRvfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGR7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTkzOTt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7cGFkZGluZzoyNXB4IDAgMjBweDtiYWNrZ3JvdW5kOiMyMDIzMmE7Y29sb3I6I2ZmZjt0ZXh0LWFsaWduOmNlbnRlcn0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGRpdnttYXgtd2lkdGg6NTYwcHg7bWFyZ2luOjEwcHg7bGluZS1oZWlnaHQ6MTQ2JX0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGlmcmFtZXttYXgtd2lkdGg6MTAwJTttYXgtaGVpZ2h0OjU1LjU1NTU1NTU1NTZ2bWluO21hcmdpbjoxNnB4IGF1dG99LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBzdHJvbmd7Ym9yZGVyLWJvdHRvbToycHggZGFzaGVkICNmZmZ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBidXR0b257ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTk0MDt0b3A6MDtyaWdodDowO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjQ4cHg7aGVpZ2h0OjQ4cHg7bWFyZ2luLXJpZ2h0OjEwcHg7bWFyZ2luLWJvdHRvbTotMTBweDtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojYWFhO2ZvbnQtc2l6ZTo0OHB4O2ZvbnQtd2VpZ2h0OjcwMDtjdXJzb3I6cG9pbnRlcn0ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkIGJ1dHRvbjpob3Zlcntjb2xvcjojZmZmfUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1zaG93ezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0uNjI1ZW0pIHJvdGF0ZVooMmRlZyl9MzMle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXt0cmFuc2Zvcm06dHJhbnNsYXRlWSguMzEyNWVtKSByb3RhdGVaKDJkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1zaG93ezAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0uNjI1ZW0pIHJvdGF0ZVooMmRlZyl9MzMle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXt0cmFuc2Zvcm06dHJhbnNsYXRlWSguMzEyNWVtKSByb3RhdGVaKDJkZWcpfTEwMCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWhpZGV7MTAwJXt0cmFuc2Zvcm06cm90YXRlWigxZGVnKTtvcGFjaXR5OjB9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAle3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6LjU2MjVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOi4xMjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6LjYyNWVtO2xlZnQ6LS4yNWVtO3dpZHRoOjEuNjI1ZW19ODQle3RvcDoxLjA2MjVlbTtsZWZ0Oi43NWVtO3dpZHRoOi41ZW19MTAwJXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDouNTYyNWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6LjEyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDouNjI1ZW07bGVmdDotLjI1ZW07d2lkdGg6MS42MjVlbX04NCV7dG9wOjEuMDYyNWVtO2xlZnQ6Ljc1ZW07d2lkdGg6LjVlbX0xMDAle3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItc2hvd3swJXt0cmFuc2Zvcm06c2NhbGUoLjcpfTQ1JXt0cmFuc2Zvcm06c2NhbGUoMS4wNSl9ODAle3RyYW5zZm9ybTpzY2FsZSguOTUpfTEwMCV7dHJhbnNmb3JtOnNjYWxlKDEpfX1Aa2V5ZnJhbWVzIHN3YWwyLXNob3d7MCV7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXt0cmFuc2Zvcm06c2NhbGUoLjk1KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpzY2FsZSguNSk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpzY2FsZSguNSk7b3BhY2l0eTowfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDoxLjE4NzVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOjEuMDYyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDoyLjE4NzVlbTtsZWZ0Oi0uMzc1ZW07d2lkdGg6My4xMjVlbX04NCV7dG9wOjNlbTtsZWZ0OjEuMzEyNWVtO3dpZHRoOjEuMDYyNWVtfTEwMCV7dG9wOjIuODEyNWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOjEuMTg3NWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6MS4wNjI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOjIuMTg3NWVtO2xlZnQ6LS4zNzVlbTt3aWR0aDozLjEyNWVtfTg0JXt0b3A6M2VtO2xlZnQ6MS4zMTI1ZW07d2lkdGg6MS4wNjI1ZW19MTAwJXt0b3A6Mi44MTI1ZW07bGVmdDouODEyNWVtO3dpZHRoOjEuNTYyNWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9NjUle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH04NCV7dG9wOjIuMTg3NWVtO3JpZ2h0OjA7d2lkdGg6My40Mzc1ZW19MTAwJXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTY1JXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9ODQle3RvcDoyLjE4NzVlbTtyaWdodDowO3dpZHRoOjMuNDM3NWVtfTEwMCV7dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9fUBrZXlmcmFtZXMgc3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZXswJXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9NSV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTEyJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmt7MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTUwJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9ODAle21hcmdpbi10b3A6LS4zNzVlbTt0cmFuc2Zvcm06c2NhbGUoMS4xNSl9MTAwJXttYXJnaW4tdG9wOjA7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbnswJXt0cmFuc2Zvcm06cm90YXRlWCgxMDBkZWcpO29wYWNpdHk6MH0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1yb3RhdGUtbG9hZGluZ3swJXt0cmFuc2Zvcm06cm90YXRlKDApfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1sb2FkaW5nezAle3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoLTM2MGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgwKX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXF1ZXN0aW9uLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVkoLTM2MGRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlWSgwKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtaS1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVaKDQ1ZGVnKTtvcGFjaXR5OjB9MjUle3RyYW5zZm9ybTpyb3RhdGVaKC0yNWRlZyk7b3BhY2l0eTouNH01MCV7dHJhbnNmb3JtOnJvdGF0ZVooMTVkZWcpO29wYWNpdHk6Ljh9NzUle3RyYW5zZm9ybTpyb3RhdGVaKC01ZGVnKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1pLW1hcmt7MCV7dHJhbnNmb3JtOnJvdGF0ZVooNDVkZWcpO29wYWNpdHk6MH0yNSV7dHJhbnNmb3JtOnJvdGF0ZVooLTI1ZGVnKTtvcGFjaXR5Oi40fTUwJXt0cmFuc2Zvcm06cm90YXRlWigxNWRlZyk7b3BhY2l0eTouOH03NSV7dHJhbnNmb3JtOnJvdGF0ZVooLTVkZWcpO29wYWNpdHk6MX0xMDAle3RyYW5zZm9ybTpyb3RhdGVYKDApO29wYWNpdHk6MX19Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKXtvdmVyZmxvdzpoaWRkZW59Ym9keS5zd2FsMi1oZWlnaHQtYXV0b3toZWlnaHQ6YXV0byFpbXBvcnRhbnR9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVye2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQhaW1wb3J0YW50O3BvaW50ZXItZXZlbnRzOm5vbmV9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1wb3B1cHtwb2ludGVyLWV2ZW50czphbGx9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItY29udGFpbmVyIC5zd2FsMi1tb2RhbHtib3gtc2hhZG93OjAgMCAxMHB4IHJnYmEoMCwwLDAsLjQpfUBtZWRpYSBwcmludHtib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93LXk6c2Nyb2xsIWltcG9ydGFudH1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pPlthcmlhLWhpZGRlbj10cnVlXXtkaXNwbGF5Om5vbmV9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKSAuc3dhbDItY29udGFpbmVye3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnR9fWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lcntib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MzYwcHg7bWF4LXdpZHRoOjEwMCU7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudDtwb2ludGVyLWV2ZW50czpub25lfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7dG9wOjA7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0e3RvcDowO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0e3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlcnt0b3A6NTAlO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHR7dG9wOjUwJTtyaWdodDowO2JvdHRvbTphdXRvO2xlZnQ6YXV0bzt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1zdGFydHt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6MH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9te3RvcDphdXRvO3JpZ2h0OmF1dG87Ym90dG9tOjA7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodHt0b3A6YXV0bztyaWdodDowO2JvdHRvbTowO2xlZnQ6YXV0b31cIik7IiwgImNvbnN0IFN3YWwgPSByZXF1aXJlKFwic3dlZXRhbGVydDJcIik7XG5cbmV4cG9ydCBmdW5jdGlvbiBwZCguLi5tZXM6IGFueSk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKG1lcyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbChtZXM6IHN0cmluZykge1xuICAgIFN3YWwuZmlyZSh7XG4gICAgICAgIHRleHQ6IG1lcyxcbiAgICAgICAgdG9hc3Q6IHRydWUsXG4gICAgICAgIHBvc2l0aW9uOiBcInRvcC1lbmRcIixcbiAgICAgICAgdGltZXI6IDMgKiAxMDAwLFxuICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2VcbiAgICB9KTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNvbmZpcm0obWVzOiBzdHJpbmcsIG9rOiBzdHJpbmcsIGNhbmNlbDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgU3dhbC5maXJlKHtcbiAgICAgICAgdGV4dDogbWVzLFxuICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2UsXG4gICAgICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogb2ssXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IGNhbmNlbFxuICAgIH0pO1xuICAgIGNvbnN0IHJldDpib29sZWFuID0gcmVzLnZhbHVlO1xuICAgIHJldHVybiByZXQ7XG59XG5leHBvcnQgdmFyIHRvYXN0ID0ge1xuICAgIG5vcm1hbDogbm9ybWFsLFxuICAgIGNvbmZpcm06IGNvbmZpcm1cbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1JnYkhleChjb2w6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiI1wiICsgY29sLm1hdGNoKC9cXGQrL2cpLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gKFwiMFwiICsgcGFyc2VJbnQoYSkudG9TdHJpbmcoMTYpKS5zbGljZSgtMil9KS5qb2luKFwiXCIpO1xufVxuIiwgImltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4uL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5leHBvcnQgY2xhc3MgU2F2ZUVsZW1lbnQge1xuICAgIHByaXZhdGUgZWxlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIGRhdGFzdG9yZTogRHJhd01pbmU7XG5cbiAgICBwdWJsaWMgaW5pdChkYXRhc3RvcmU6IERyYXdNaW5lKSB7XG4gICAgICAgIHRoaXMuZGF0YXN0b3JlID0gZGF0YXN0b3JlO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWN0LXNhdmVcIik7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5kYXRhc3RvcmUuc2F2ZSgpO1xuICAgICAgICBVLnRvYXN0Lm5vcm1hbChcInNhdmVkXCIpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3T3RoZXIgfSBmcm9tIFwiLi4vZGF0YS9EcmF3T3RoZXJcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi9QZW5BY3Rpb25cIjtcbmltcG9ydCB7IFN0cm9rZSwgUG9pbnQsIERyYXcgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5cbmV4cG9ydCBjbGFzcyBMb2FkQWN0aW9uIHtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkYXRhc3RvcmU6IERyYXdPdGhlcjtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuICAgIHB1YmxpYyBpbml0KHBhcGVyOiBQYXBlckVsZW1lbnQsIGRhdGFzdG9yZTogRHJhd090aGVyLCBwZW46IFBlbkFjdGlvbikge1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuZGF0YXN0b3JlID0gZGF0YXN0b3JlO1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgLy8gVS50b2FzdC5ub3JtYWwoXCJub3cgbG9hZGluZy4uLlwiKTtcbiAgICAgICAgdGhpcy5wcm9jKCk7XG4gICAgfVxuICAgIHB1YmxpYyBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBzZWMgPSAzO1xuICAgICAgICBhd2FpdCB0aGlzLmRhdGFzdG9yZS5sb2FkKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucmVkcmF3KHRoaXMucGFwZXIsIHRoaXMuZGF0YXN0b3JlLCB0aGlzLnBlbik7XG4gICAgICAgIC8vIFUudG9hc3Qubm9ybWFsKGBsb2FkICR7c2VjfSBzZWMuYCk7XG4gICAgICAgIC8vIFUucGQoXCJsb2FkZWQhIVwiKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnByb2MoKSwgc2VjICogMTAwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaXJzdDogYm9vbGVhbiA9IHRydWU7IC8vIFx1NTIxRFx1NTZERVx1MzBENVx1MzBFOVx1MzBCMFx1MzAwMlx1MzBFRFx1MzBGQ1x1MzBDOVx1NjY0Mlx1MzA2Qlx1MzBEMFx1MzBCRlx1MzA2NFx1MzA0Rlx1MzA1Rlx1MzA4MVx1MzAwMlxuICAgIHByaXZhdGUgYXN5bmMgcmVkcmF3KHBhcGVyOiBQYXBlckVsZW1lbnQsIGRhdGFzdG9yZTogRHJhd090aGVyLCBwZW46IFBlbkFjdGlvbik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBkcmF3czogRHJhd1tdID0gZGF0YXN0b3JlLmdldERyYXdzKCk7XG5cbiAgICAgICAgbGV0IHByZXBvaW50OiBQb2ludCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICBwYXBlci5nZXRDbnYoKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRyYXcgb2YgZHJhd3MpIHtcbiAgICAgICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RWNhbnZhc1x1MzA2RVx1NzJCNlx1NjE0Qlx1MzA5Mlx1MzBBRlx1MzBFRFx1MzBGQ1x1MzBGM1xuICAgICAgICAgICAgY29uc3QgYmtpbWc6IEhUTUxJbWFnZUVsZW1lbnQgPSBhd2FpdCB0aGlzLnRvSW1hZ2UocGFwZXIuZ2V0Q252KCkpO1xuXG4gICAgICAgICAgICAvLyBcdTMwQUZcdTMwRUFcdTMwQTJcdTMwNTdcdTMwNjZcdTRFQ0FcdTU2REVcdTMwNkVcdThBMThcdThGRjBcdTMwOTJcdTY2RjhcdTMwNERcdThGQkNcdTMwN0ZcbiAgICAgICAgICAgIHBhcGVyLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIC8vIFx1NEVDQVx1NTZERVx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1NzUxRlx1NjIxMFxuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlcyA9IGRyYXcuZ2V0U3Ryb2tlcygpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcblxuICAgICAgICAgICAgICAgIGlmIChzLmlzRXJhc2VyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5jb2xvciA9IHMuY29sb3I7IC8vIFx1ODI3Mlx1NjBDNVx1NTgzMVx1MzA2Rlx1NEY3Rlx1MzA4Rlx1MzA2QVx1MzA0NFx1MzA0Q1x1NUZGNVx1MzA2RVx1NzBCQVx1OEEyRFx1NUI5QVxuICAgICAgICAgICAgICAgICAgICBwZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5vcHQuZXJhc2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBzLmdldFBvaW50cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgcGFwZXIpO1xuICAgICAgICAgICAgICAgICAgICBwcmVwb2ludCA9IHA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gXHU1M0Q2XHUzMDYzXHUzMDY2XHUzMDRBXHUzMDQ0XHUzMDVGY2FudmFzXHUzMDY4XHU5MUNEXHUzMDZEXHU1NDA4XHUzMDhGXHUzMDVCXG4gICAgICAgICAgICBwYXBlci5nZXRDdHgoKS5kcmF3SW1hZ2UoYmtpbWcsIDAsIDAsIGJraW1nLndpZHRoLCBia2ltZy5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICBwYXBlci5nZXRDbnYoKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICB0aGlzLmZpcnN0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHRvSW1hZ2UoY252OiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGNvbnN0IGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gY252LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoaW1hZ2UpO1xuICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IChlKSA9PiByZWplY3QoZSk7XG4gICAgICAgICAgICBpbWFnZS5zcmMgPSBjdHguY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCAiZXhwb3J0IGNsYXNzIERyYXdjYW52YXNlc0VsZW1lbnQge1xuICAgIHByaXZhdGUgd3JhcGRpdjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy53cmFwZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkcmF3Y2FudmFzZXNcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGVsZW1lbnQoKTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy53cmFwZGl2O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXROb3JtYWwoKTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JhcGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRkZGRkYwMFwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRTY3JvbGwoKTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JhcGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMEZGMDA3N1wiO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRFeHBhbmQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JhcGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNGRjAwMDA3N1wiO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgVG9vbCwgRHJhd0V2ZW50IH0gZnJvbSBcIi4uL3UvdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIERyYXdTdGF0dXMge1xuICAgIHByaXZhdGUgZXZlbnQ6IERyYXdFdmVudDtcbiAgICBwcml2YXRlIHRvb2w6IFRvb2w7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbmRTdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kU3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmV2ZW50ID0gXCJ1cFwiO1xuICAgICAgICB0aGlzLnRvb2wgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydFN0cm9rZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gXHU2NENEXHU0RjVDXHU5NThCXHU1OUNCXG4gICAgICAgIHRoaXMuZXZlbnQgPSBcImRvd25cIjtcbiAgICAgICAgdGhpcy50b29sID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VG9vbCh0b29sKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG9vbCA9IHRvb2w7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRUb29sKCk6IFRvb2wge1xuICAgICAgICByZXR1cm4gdGhpcy50b29sO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VuZFN0cm9rZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbm93ID09PSBcInVwXCIgJiYgdGhpcy5ldmVudCAhPT0gXCJ1cFwiO1xuICAgIH1cbiAgICBwdWJsaWMgaXNTdGFydFN0cm9rZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbm93ID09PSBcImRvd25cIjtcbiAgICB9XG4gICAgcHVibGljIGlzU3RhcnRNb3ZlKG5vdzogRHJhd0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFx1MzBDNFx1MzBGQ1x1MzBFQlx1MzA0Q1x1NjcyQVx1NkM3QVx1NUI5QVxuICAgICAgICByZXR1cm4gdGhpcy5pc01vdmUobm93KSAmJiB0aGlzLnRvb2wgPT09IG51bGw7XG4gICAgfVxuICAgIHB1YmxpYyBpc01vdmUobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5vdyA9PT0gXCJtb3ZlXCIgJiYgdGhpcy5ldmVudCA9PT0gXCJkb3duXCI7XG4gICAgfVxufSIsICIndXNlIHN0cmljdCdcbm1vZHVsZS5leHBvcnRzID0gcmZkY1xuXG5mdW5jdGlvbiBjb3B5QnVmZmVyIChjdXIpIHtcbiAgaWYgKGN1ciBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShjdXIpXG4gIH1cblxuICByZXR1cm4gbmV3IGN1ci5jb25zdHJ1Y3RvcihjdXIuYnVmZmVyLnNsaWNlKCksIGN1ci5ieXRlT2Zmc2V0LCBjdXIubGVuZ3RoKVxufVxuXG5mdW5jdGlvbiByZmRjIChvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgaWYgKG9wdHMuY2lyY2xlcykgcmV0dXJuIHJmZGNDaXJjbGVzKG9wdHMpXG4gIHJldHVybiBvcHRzLnByb3RvID8gY2xvbmVQcm90byA6IGNsb25lXG5cbiAgZnVuY3Rpb24gY2xvbmVBcnJheSAoYSwgZm4pIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGEpXG4gICAgdmFyIGEyID0gbmV3IEFycmF5KGtleXMubGVuZ3RoKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGsgPSBrZXlzW2ldXG4gICAgICB2YXIgY3VyID0gYVtrXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBhMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGEyW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBhMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYTJba10gPSBmbihjdXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhMlxuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmUgKG8pIHtcbiAgICBpZiAodHlwZW9mIG8gIT09ICdvYmplY3QnIHx8IG8gPT09IG51bGwpIHJldHVybiBvXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gbmV3IERhdGUobylcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSkgcmV0dXJuIGNsb25lQXJyYXkobywgY2xvbmUpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBNYXApIHJldHVybiBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmUpKVxuICAgIGlmIChvIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lKSlcbiAgICB2YXIgbzIgPSB7fVxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspID09PSBmYWxzZSkgY29udGludWVcbiAgICAgIHZhciBjdXIgPSBvW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIG8yW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgbzJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBvMltrXSA9IG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lKSlcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIG8yW2tdID0gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBvMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbzJba10gPSBjbG9uZShjdXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvMlxuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVQcm90byAobykge1xuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbCkgcmV0dXJuIG9cbiAgICBpZiAobyBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBuZXcgRGF0ZShvKVxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pKSByZXR1cm4gY2xvbmVBcnJheShvLCBjbG9uZVByb3RvKVxuICAgIGlmIChvIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lUHJvdG8pKVxuICAgIGlmIChvIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lUHJvdG8pKVxuICAgIHZhciBvMiA9IHt9XG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICB2YXIgY3VyID0gb1trXVxuICAgICAgaWYgKHR5cGVvZiBjdXIgIT09ICdvYmplY3QnIHx8IGN1ciA9PT0gbnVsbCkge1xuICAgICAgICBvMltrXSA9IGN1clxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IERhdGUoY3VyKVxuICAgICAgfSBlbHNlIGlmIChjdXIgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgbzJba10gPSBuZXcgTWFwKGNsb25lQXJyYXkoQXJyYXkuZnJvbShjdXIpLCBjbG9uZVByb3RvKSlcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIG8yW2tdID0gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmVQcm90bykpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhjdXIpKSB7XG4gICAgICAgIG8yW2tdID0gY29weUJ1ZmZlcihjdXIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvMltrXSA9IGNsb25lUHJvdG8oY3VyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbzJcbiAgfVxufVxuXG5mdW5jdGlvbiByZmRjQ2lyY2xlcyAob3B0cykge1xuICB2YXIgcmVmcyA9IFtdXG4gIHZhciByZWZzTmV3ID0gW11cblxuICByZXR1cm4gb3B0cy5wcm90byA/IGNsb25lUHJvdG8gOiBjbG9uZVxuXG4gIGZ1bmN0aW9uIGNsb25lQXJyYXkgKGEsIGZuKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKVxuICAgIHZhciBhMiA9IG5ldyBBcnJheShrZXlzLmxlbmd0aClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrID0ga2V5c1tpXVxuICAgICAgdmFyIGN1ciA9IGFba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgYTJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBhMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGN1cikpIHtcbiAgICAgICAgYTJba10gPSBjb3B5QnVmZmVyKGN1cilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpbmRleCA9IHJlZnMuaW5kZXhPZihjdXIpXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBhMltrXSA9IHJlZnNOZXdbaW5kZXhdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYTJba10gPSBmbihjdXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGEyXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZSAobykge1xuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbCkgcmV0dXJuIG9cbiAgICBpZiAobyBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBuZXcgRGF0ZShvKVxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pKSByZXR1cm4gY2xvbmVBcnJheShvLCBjbG9uZSlcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKG8pLCBjbG9uZSkpXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpIHJldHVybiBuZXcgU2V0KGNsb25lQXJyYXkoQXJyYXkuZnJvbShvKSwgY2xvbmUpKVxuICAgIHZhciBvMiA9IHt9XG4gICAgcmVmcy5wdXNoKG8pXG4gICAgcmVmc05ldy5wdXNoKG8yKVxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspID09PSBmYWxzZSkgY29udGludWVcbiAgICAgIHZhciBjdXIgPSBvW2tdXG4gICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ29iamVjdCcgfHwgY3VyID09PSBudWxsKSB7XG4gICAgICAgIG8yW2tdID0gY3VyXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgbzJba10gPSBuZXcgRGF0ZShjdXIpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBvMltrXSA9IG5ldyBNYXAoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lKSlcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgIG8yW2tdID0gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmUpKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBvMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSByZWZzLmluZGV4T2YoY3VyKVxuICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICBvMltrXSA9IHJlZnNOZXdbaV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvMltrXSA9IGNsb25lKGN1cilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZWZzLnBvcCgpXG4gICAgcmVmc05ldy5wb3AoKVxuICAgIHJldHVybiBvMlxuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVQcm90byAobykge1xuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHwgbyA9PT0gbnVsbCkgcmV0dXJuIG9cbiAgICBpZiAobyBpbnN0YW5jZW9mIERhdGUpIHJldHVybiBuZXcgRGF0ZShvKVxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pKSByZXR1cm4gY2xvbmVBcnJheShvLCBjbG9uZVByb3RvKVxuICAgIGlmIChvIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lUHJvdG8pKVxuICAgIGlmIChvIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gbmV3IFNldChjbG9uZUFycmF5KEFycmF5LmZyb20obyksIGNsb25lUHJvdG8pKVxuICAgIHZhciBvMiA9IHt9XG4gICAgcmVmcy5wdXNoKG8pXG4gICAgcmVmc05ldy5wdXNoKG8yKVxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgdmFyIGN1ciA9IG9ba11cbiAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAnb2JqZWN0JyB8fCBjdXIgPT09IG51bGwpIHtcbiAgICAgICAgbzJba10gPSBjdXJcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBvMltrXSA9IG5ldyBEYXRlKGN1cilcbiAgICAgIH0gZWxzZSBpZiAoY3VyIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgIG8yW2tdID0gbmV3IE1hcChjbG9uZUFycmF5KEFycmF5LmZyb20oY3VyKSwgY2xvbmVQcm90bykpXG4gICAgICB9IGVsc2UgaWYgKGN1ciBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICBvMltrXSA9IG5ldyBTZXQoY2xvbmVBcnJheShBcnJheS5mcm9tKGN1ciksIGNsb25lUHJvdG8pKVxuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY3VyKSkge1xuICAgICAgICBvMltrXSA9IGNvcHlCdWZmZXIoY3VyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSByZWZzLmluZGV4T2YoY3VyKVxuICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICBvMltrXSA9IHJlZnNOZXdbaV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvMltrXSA9IGNsb25lUHJvdG8oY3VyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlZnMucG9wKClcbiAgICByZWZzTmV3LnBvcCgpXG4gICAgcmV0dXJuIG8yXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5pbXBvcnQgcmZkYyBmcm9tIFwicmZkY1wiO1xuXG5leHBvcnQgY2xhc3MgUGVuQWN0aW9uIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3B0ID0ge1xuICAgICAgICBjb2xvcjogPHN0cmluZz5cIlwiLFxuICAgICAgICBlcmFzZXI6IDxib29sZWFuPmZhbHNlLFxuICAgIH1cblxuICAgIHByaXZhdGUgb3B0Yms6IGFueTtcbiAgICBwcml2YXRlIGNsb25lID0gcmZkYygpO1xuXG4gICAgcHVibGljIGluaXQoY29sb3I6IHN0cmluZykge1xuICAgICAgICB0aGlzLm9wdC5lcmFzZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcHQuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5vcHRiayA9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHByZXA6IFBvaW50IHwgbnVsbCwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBsZXQgcHJlID0gcHJlcDtcbiAgICAgICAgaWYgKHByZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBcdTUyNERcdTU2REVcdTMwNkVcdTcwQjlcdTMwNENcdTMwNkFcdTMwNTFcdTMwOENcdTMwNzBcdTRFQ0FcdTU2REVcdTMwNkVcdTcwQjlcbiAgICAgICAgICAgIHByZSA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdHggPSBwYXBlci5nZXRDdHgoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHQuZXJhc2VyKSB7XG4gICAgICAgICAgICB0aGlzLmVyYXNlKHgsIHksIHByZSwgY3R4KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZW4oeCwgeSwgcHJlLCBjdHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcGVuKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmU6IFBvaW50LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLm9wdC5jb2xvcjtcbiAgICAgICAgY3R4Lm1vdmVUbyhwcmUueCwgcHJlLnkpO1xuICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICAgIHByaXZhdGUgZXJhc2UoeDogbnVtYmVyLCB5OiBudW1iZXIsIHByZTogUG9pbnQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIC8vIFx1NzlGQlx1NTJENVx1OERERFx1OTZFMlx1MzA2N1x1NkQ4OFx1MzA1OVx1N0JDNFx1NTZGMlx1MzA5Mlx1OEFCRlx1NjU3NFxuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoeCAtIHByZS54KSArIE1hdGguYWJzKHkgLSBwcmUueSk7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoeCAtIGQsIHkgLSBkLCBkICogMiwgZCAqIDIpO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlT3B0KCkge1xuICAgICAgICB0aGlzLm9wdGJrID0gdGhpcy5jbG9uZSh0aGlzLm9wdCk7XG4gICAgICAgIC8vIFUucGQodGhpcy5vcHRiayk7XG4gICAgfVxuICAgIHB1YmxpYyByZXN0b3JlT3B0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtpZHgsIHZhbF0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5vcHRiaykpIHtcbiAgICAgICAgICAgIHRoaXMub3B0W2lkeF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQsIFN0cm9rZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERyYXdNaW5lIH0gZnJvbSBcIi4uL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFVuZG9FbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkcmF3OiBEcmF3TWluZTtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcbiAgICBwdWJsaWMgaW5pdChwYXBlcjogUGFwZXJFbGVtZW50LCBkcmF3OiBEcmF3TWluZSwgcGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wYXBlciA9IHBhcGVyO1xuICAgICAgICB0aGlzLmRyYXcgPSBkcmF3O1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FjdC11bmRvXCIpO1xuXG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoKSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuICAgIHByaXZhdGUgcHJvYygpOiB2b2lkIHtcbiAgICAgICAgLy8gXHU2NzAwXHU2NUIwXHUzMDZFc3Ryb2tlXHUzMDkyXHU3ODM0XHU2OEM0XHUzMDU3XHUzMDY2XHUzMDAxXHUzMDVEXHUzMDZFXHU1MTg1XHU1QkI5XHUzMDkyXHU1M0Q2XHU1Rjk3XG4gICAgICAgIGNvbnN0IHN0cm9rZXM6IFN0cm9rZVtdID0gdGhpcy5kcmF3LnVuZG8oKTtcbiAgICAgICAgLy8gXHU3M0ZFXHU1NzI4XHUzMDZFXHU4QTE4XHU4RkYwXHUzMDkyXHUzMEFGXHUzMEVBXHUzMEEyXHUzMDAxXHU4QTJEXHU1QjlBXHUzMDkyXHU0RkREXHU1QjU4XG4gICAgICAgIHRoaXMucGFwZXIuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5wZW4uc2F2ZU9wdCgpO1xuXG4gICAgICAgIC8vIFx1NjUzOVx1MzA4MVx1MzA2Nlx1NjNDRlx1NzUzQlxuICAgICAgICBsZXQgcHJlcG9pbnQ6IFBvaW50ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcbiAgICAgICAgICAgIGlmIChzLmlzRXJhc2VyKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5vcHQuY29sb3IgPSBzLmNvbG9yOyAvLyBcdTgyNzJcdTYwQzVcdTU4MzFcdTMwNkZcdTRGN0ZcdTMwOEZcdTMwNkFcdTMwNDRcdTMwNENcdTVGRjVcdTMwNkVcdTcwQkFcdThBMkRcdTVCOUFcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5vcHQuZXJhc2VyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gcy5jb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5vcHQuZXJhc2VyID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygcy5nZXRQb2ludHMoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuLnByb2MocC54LCBwLnksIHByZXBvaW50LCB0aGlzLnBhcGVyKTtcbiAgICAgICAgICAgICAgICBwcmVwb2ludCA9IHA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmVwb2ludCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBcdThBMkRcdTVCOUFcdTMwOTJcdTVGQTlcdTVFMzBcbiAgICAgICAgdGhpcy5wZW4ucmVzdG9yZU9wdCgpO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERyYXdjYW52YXNlc0VsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9EcmF3Y2FudmFzZXNFbGVtZW50XCI7XG5pbXBvcnQgeyBab29tRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1pvb21FbGVtZW50XCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIFpvb21TY3JvbGxBY3Rpb24ge1xuICAgIHByaXZhdGUgd3JhcGRpdjogRHJhd2NhbnZhc2VzRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21FbGVtZW50O1xuICAgIHByaXZhdGUgcHJlcDogUG9pbnQgPSBudWxsO1xuICAgIHByaXZhdGUgbm93em9vbTogbnVtYmVyID0gMTtcbiAgICBwcml2YXRlIG9yZ3c6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBvcmdoOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBaT09NX01BWDogbnVtYmVyID0gMTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IFpPT01fTUlOOiBudW1iZXIgPSAwLjU7XG5cbiAgICBwdWJsaWMgaW5pdCh3cmFwZGl2OiBEcmF3Y2FudmFzZXNFbGVtZW50LCB6b29tc2Nyb2xsOiBab29tRWxlbWVudCkge1xuICAgICAgICB0aGlzLndyYXBkaXYgPSB3cmFwZGl2O1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwgPSB6b29tc2Nyb2xsO1xuICAgICAgICB0aGlzLm5vd3pvb20gPSAxO1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwuc2hvdyh0aGlzLm5vd3pvb20pO1xuICAgICAgICBjb25zdCBlbGU6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gICAgICAgIHRoaXMub3JndyA9IHBhcnNlSW50KGVsZS5zdHlsZS53aWR0aC5yZXBsYWNlKFwicHhcIixcIlwiKSk7XG4gICAgICAgIHRoaXMub3JnaCA9IHBhcnNlSW50KGVsZS5zdHlsZS5oZWlnaHQucmVwbGFjZShcInB4XCIsXCJcIikpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0UG9pbnQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wcmVwID0gbmV3IFBvaW50KHgsIHkpO1xuICAgIH1cbiAgICBwdWJsaWMgc2Nyb2xsKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMuaWdub3JlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBcdTVERUVcdTUyMDZcdTMwNkVcdThBMDhcdTdCOTdcbiAgICAgICAgY29uc3QgZHggPSAgKHRoaXMucHJlcC54IC0geCkgKiB0aGlzLm5vd3pvb20gKiA3O1xuICAgICAgICBjb25zdCBkeSA9ICh0aGlzLnByZXAueSAtIHkpICogdGhpcy5ub3d6b29tICogNztcblxuICAgICAgICAvLyBcdTMwQjlcdTMwQUZcdTMwRURcdTMwRkNcdTMwRUJcdTVCOUZcdTg4NENcbiAgICAgICAgY29uc3QgbnggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIGNvbnN0IG55ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICB3aW5kb3cuc2Nyb2xsKHtcbiAgICAgICAgICAgIGxlZnQ6IG54ICsgZHgsXG4gICAgICAgICAgICB0b3A6IG55ICsgZHksXG4gICAgICAgICAgICBiZWhhdmlvcjogXCJzbW9vdGhcIlxuICAgICAgICB9KTtcblxuICAgICAgICBVLnBkKGBzY3JvbGwgOiAke3RoaXMucHJlcC54fS0ke3h9PSR7ZHh9LCAke3RoaXMucHJlcC55fS0ke3l9PSR7ZHl9YCk7XG5cbiAgICAgICAgLy8gXHUzMEREXHUzMEE0XHUzMEYzXHUzMEM4XHUzMDZFXHU2NkY0XHU2NUIwXG4gICAgICAgIHRoaXMucHJlcC54ID0geDtcbiAgICAgICAgdGhpcy5wcmVwLnkgPSB5O1xuICAgIH1cbiAgICBwdWJsaWMgem9vbWRyYWcoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZHkgPSB0aGlzLnByZXAueSAtIHk7XG4gICAgICAgIC8vIFx1NzlGQlx1NTJENVx1NURFRVx1NTIwNlx1MzA5Mnpvb21cdTZCRDRcdTczODdcdTMwNkJcdTU5MDlcdTYzREJcdTMwMDJcdTczRkVcdTU3MjhcdTMwNkVcdTZCRDRcdTczODdcdTMwNkJcdTMwODhcdTMwNjNcdTMwNjZcdTVERUVcdTUyMDZcdTkxQ0ZcdTMwOTJcdThBQkZcdTY1NzRcdUZGMDhcdTU5MjdcdTMwNERcdTMwNDRcdTMwNjhcdTU5MjdcdTMwNERcdTMwNDRcdUZGMDlcbiAgICAgICAgY29uc3QgZGlmZiA9IGR5ICogMC4wMDA1ICogdGhpcy5ub3d6b29tO1xuICAgICAgICB0aGlzLnpvb21wcm9jKGRpZmYpO1xuICAgICAgICAvLyBcdTMwRERcdTMwQTRcdTMwRjNcdTMwQzhcdTMwNkVcdTY2RjRcdTY1QjBcbiAgICAgICAgdGhpcy5wcmVwLnggPSB4O1xuICAgICAgICB0aGlzLnByZXAueSA9IHk7XG4gICAgfVxuICAgIHB1YmxpYyB6b29tcHJvYyhkaWZmOiBudW1iZXIpOnZvaWQge1xuICAgICAgICB0aGlzLm5vd3pvb20gKz0gZGlmZjtcbiAgICAgICAgLy8gXHU3QkM0XHU1NkYyXHU4OERDXHU2QjYzXG4gICAgICAgIHRoaXMubm93em9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMubm93em9vbSwgdGhpcy5aT09NX01JTiksIHRoaXMuWk9PTV9NQVgpO1xuICAgICAgICBjb25zdCBlbGU6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gICAgICAgIGVsZS5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHt0aGlzLm5vd3pvb219KWA7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbC5zaG93KHRoaXMubm93em9vbSk7XG4gICAgICAgIGVsZS5zdHlsZS53aWR0aCA9YCR7dGhpcy5vcmd3ICogdGhpcy5ub3d6b29tfXB4YDtcbiAgICAgICAgZWxlLnN0eWxlLmhlaWdodCA9YCR7dGhpcy5vcmdoICogdGhpcy5ub3d6b29tfXB4YDtcbiAgICB9XG4gICAgcHVibGljIGdldFpvb20oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm93em9vbTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXRpbWU6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBpZ25vcmUoKSB7XG4gICAgICAgIGNvbnN0IG46bnVtYmVyID0gRGF0ZS5ub3coKTtcbiAgICAgICAgbGV0IHJldCA9IHRydWU7XG4gICAgICAgIGlmKG4gLSB0aGlzLnByZXRpbWUgPiAwLjAxICogMTAwMCkge1xuICAgICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByZXRpbWUgPSBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFRvdWNoU2Vuc29yIH0gZnJvbSBcIi4uL3NlbnNvci9Ub3VjaFNlbnNvclwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgWm9vbUVsZW1lbnQge1xuICAgIHByaXZhdGUgbGJsOiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBidHA6IEhUTUxCdXR0b25FbGVtZW50O1xuICAgIHByaXZhdGUgYnRtOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG5cbiAgICBwdWJsaWMgaW5pdCh6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9vbXNjcm9sbCA9IHpvb21zY3JvbGw7XG4gICAgICAgIHRoaXMubGJsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN6b29tLWxhYmVsXCIpO1xuICAgICAgICB0aGlzLmJ0cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1wbHVzXCIpO1xuICAgICAgICB0aGlzLmJ0bSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1taW51c1wiKTtcblxuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKDAuMSkpO1xuICAgICAgICB0aGlzLmJ0cC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoMC4xKSk7XG4gICAgICAgIHRoaXMuYnRtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgICAgICB0aGlzLmJ0bS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoKSA9PiB0aGlzLnpvb21zY3JvbGwuem9vbXByb2MoLTAuMSkpO1xuICAgIH1cbiAgICBwdWJsaWMgbGFiZWwoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGJsO1xuICAgIH1cbiAgICBwdWJsaWMgc2hvdyhub3d6b29tOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sYmwuaW5uZXJIVE1MID0gYCR7TWF0aC5yb3VuZChub3d6b29tICogMTAwKS50b1N0cmluZygpfSVgO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIEVyYXNlckVsZW1lbnQge1xuICAgIHByaXZhdGUgZWxlOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtZXJhc2VyXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgfVxuXG4gICAgcHVibGljIHByb2MoKSB7XG4gICAgICAgIHRoaXMucGVuLm9wdC5lcmFzZXIgPSAhdGhpcy5wZW4ub3B0LmVyYXNlcjtcbiAgICAgICAgY29uc3QgZW5hYmxlID0gXCJoYXMtYmFja2dyb3VuZC1wcmltYXJ5XCI7XG4gICAgICAgIGNvbnN0IGRpc2FibGUgPSBcImhhcy1iYWNrZ3JvdW5kLWxpZ2h0XCI7XG4gICAgICAgIC8vIFx1ODg2OFx1NzkzQVx1MzA5Mlx1NjZGNFx1NjVCMFxuICAgICAgICBpZiAodGhpcy5wZW4ub3B0LmVyYXNlcikge1xuICAgICAgICAgICAgdGhpcy5lbGUuY2xhc3NMaXN0LnJlcGxhY2UoZGlzYWJsZSwgZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLmNsYXNzTGlzdC5yZXBsYWNlKGVuYWJsZSwgZGlzYWJsZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9QZW5BY3Rpb25cIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuXG5leHBvcnQgY2xhc3MgQ29sb3JFbGVtZW50IHtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uXG5cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uLCBjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGV2OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IDxIVE1MRWxlbWVudD5ldi50YXJnZXQ7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGl0ZW0uc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICBVLnRvYXN0Lm5vcm1hbChgY2hhbmdlIHRvICR7Y29sb3J9YCk7XG4gICAgICAgICAgICAvLyB0aGlzLnBlbi5vcHQuY29sb3IgPSBVLnRvUmdiSGV4KGNvbG9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wZW4tY29sb3JcIikuZm9yRWFjaCgoZWxlOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhY2tFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkcmF3OiBEcmF3TWluZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbGUgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtYmFja1wiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMucHJvYygpKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+IHRoaXMucHJvYygpKTtcbiAgICB9XG4gICAgcHVibGljIGluaXQoZHJhdzogRHJhd01pbmUpIHtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIXRoaXMuZHJhdy5pc1NhdmVkKCkpIHtcbiAgICAgICAgICAgIFUudG9hc3Qubm9ybWFsKFwiXHU0RkREXHU1QjU4XHUzMDU3XHUzMDY2XHU2MjNCXHUzMDhBXHUzMDdFXHUzMDU5XCIpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRyYXcuc2F2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9cIjtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERldmljZSwgVG9vbCB9IGZyb20gXCIuL3UvdHlwZXNcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuL3UvdVwiO1xuaW1wb3J0IHsgTW91c2VTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvTW91c2VTZW5zb3JcIjtcbmltcG9ydCB7IFBvaW50ZXJTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvUG9pbnRlclNlbnNvclwiO1xuaW1wb3J0IHsgVG91Y2hTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFNhdmVFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9TYXZlRWxlbWVudFwiO1xuaW1wb3J0IHsgTG9hZEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9Mb2FkQWN0aW9uXCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9EcmF3Y2FudmFzZXNFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3U3RhdHVzIH0gZnJvbSBcIi4vZGF0YS9EcmF3U3RhdHVzXCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5pbXBvcnQgeyBVbmRvRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvVW5kb0VsZW1lbnRcIjtcbmltcG9ydCB7IFpvb21TY3JvbGxBY3Rpb24gfSBmcm9tIFwiLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L1pvb21FbGVtZW50XCI7XG5pbXBvcnQgeyBFcmFzZXJFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9FcmFzZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBDb2xvckVsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0NvbG9yRWxlbWVudFwiO1xuaW1wb3J0IHsgQmFja0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L0JhY2tFbGVtZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3RXZlbnRIYW5kbGVyIHtcbiAgICBwcml2YXRlIHBhcGVyX2lkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBub3dzZW5zb3I6IERldmljZSB8IG51bGw7IC8vIFx1MzBCRlx1MzBDM1x1MzBDMVx1MzAwMVx1MzBERFx1MzBBNFx1MzBGM1x1MzBCRlx1N0I0OVx1MzAwMVx1MzA3RVx1MzA2OFx1MzA4MVx1MzA2Nlx1ODkwN1x1NjU3MFx1MzA2RVx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1MzA5Mlx1NjkxQ1x1NzdFNVx1MzA1N1x1MzA1Rlx1NTgzNFx1NTQwOFx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2Nlx1MzAwMlxuICAgIHByaXZhdGUgc3RhdHVzID0ge1xuICAgICAgICBkcmF3OiBuZXcgRHJhd1N0YXR1cygpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBlbGVtZW50ID0ge1xuICAgICAgICB3cmFwZGl2OiBuZXcgRHJhd2NhbnZhc2VzRWxlbWVudCgpLFxuICAgICAgICB6b29tc2Nyb2xsOiBuZXcgWm9vbUVsZW1lbnQoKSxcbiAgICAgICAgc2F2ZTogbmV3IFNhdmVFbGVtZW50KCksXG4gICAgICAgIGVyYXNlcjogbmV3IEVyYXNlckVsZW1lbnQoKSxcbiAgICAgICAgY29sb3I6IG5ldyBDb2xvckVsZW1lbnQoKSxcbiAgICAgICAgdW5kbzogbmV3IFVuZG9FbGVtZW50KCksXG4gICAgICAgIGJhY2s6IG5ldyBCYWNrRWxlbWVudCgpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBhY3Rpb24gPSB7XG4gICAgICAgIGxvYWQ6IG5ldyBMb2FkQWN0aW9uKCksXG4gICAgICAgIHpvb21zY3JvbGw6IG5ldyBab29tU2Nyb2xsQWN0aW9uKCksXG4gICAgfTtcblxuICAgIHByaXZhdGUgbWluZSA9IHtcbiAgICAgICAgcGFwZXI6IFBhcGVyRWxlbWVudC5tYWtlTWluZSgpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd01pbmUoKSxcbiAgICAgICAgcGVuOiBuZXcgUGVuQWN0aW9uKCksXG4gICAgfTtcbiAgICBwcml2YXRlIG90aGVyID0ge1xuICAgICAgICBwYXBlcjogUGFwZXJFbGVtZW50Lm1ha2VPdGhlcigpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd090aGVyKCksXG4gICAgICAgIHBlbjogbmV3IFBlbkFjdGlvbigpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBkZXZpY2UgPSB7XG4gICAgICAgIG1vdXNlOiBuZXcgTW91c2VTZW5zb3IoKSxcbiAgICAgICAgcG9pbnRlcjogbmV3IFBvaW50ZXJTZW5zb3IoKSxcbiAgICAgICAgdG91Y2g6IG5ldyBUb3VjaFNlbnNvcigpLFxuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMubm93c2Vuc29yID0gbnVsbDtcblxuICAgICAgICBjb25zdCBzZCA9IHRoaXMubG9hZFNlcnZlckRhdGEoKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBzZFtcIiNzZC1jb2xvclwiXTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuem9vbXNjcm9sbC5pbml0KHRoaXMuYWN0aW9uLnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2F2ZS5pbml0KHRoaXMubWluZS5kcmF3KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNvbG9yLmluaXQodGhpcy5taW5lLnBlbiwgY29sb3IpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZXJhc2VyLmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC51bmRvLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5iYWNrLmluaXQodGhpcy5taW5lLmRyYXcpO1xuXG4gICAgICAgIHRoaXMuZGV2aWNlLm1vdXNlLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5kZXZpY2UucG9pbnRlci5pbml0KHRoaXMsIHRoaXMubWluZS5wYXBlcik7XG4gICAgICAgIHRoaXMuZGV2aWNlLnRvdWNoLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyLCB0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTtcblxuICAgICAgICB0aGlzLmFjdGlvbi5sb2FkLmluaXQodGhpcy5vdGhlci5wYXBlciwgdGhpcy5vdGhlci5kcmF3LCB0aGlzLm90aGVyLnBlbik7XG4gICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuaW5pdCh0aGlzLmVsZW1lbnQud3JhcGRpdiwgdGhpcy5lbGVtZW50Lnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLm1pbmUucGVuLmluaXQoY29sb3IpO1xuXG4gICAgICAgIHRoaXMubWluZS5kcmF3LmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgfVxuICAgIHByaXZhdGUgbG9hZFNlcnZlckRhdGEoKTogYW55W10ge1xuICAgICAgICBjb25zdCBpZHM6IHN0cmluZ1tdID0gW1xuICAgICAgICAgICAgXCIjc2QtY29sb3JcIlxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgICAgIHJldFtpZF0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKT8uaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRvd24oZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IHAueDtcbiAgICAgICAgY29uc3QgeTogbnVtYmVyID0gcC55O1xuICAgICAgICAvLyBVLnBkKGAke2Rldn0tZG93bigke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBkZXY7XG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc3RhcnRTdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZShkZXY6IERldmljZSwgZTogRXZlbnQsIHA6IFBvaW50KTogdm9pZCB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gcC54O1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBwLnk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS1tb3ZlKCR7eH0sJHt5fSk9JHt0aGlzLm5vd3NlbnNvcn1gKTtcblxuICAgICAgICAvLyBcdTcxMjFcdTg5OTZcdTMwNTlcdTMwOEJcdTY3NjFcdTRFRjZcbiAgICAgICAgaWYgKHRoaXMubm93c2Vuc29yID09PSBudWxsIC8vIFx1MzBDN1x1MzBEMFx1MzBBNFx1MzBCOVx1NjcyQVx1NkM3QVx1NUI5QVx1MzA2QVx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICAgICAgfHwgdGhpcy5ub3dzZW5zb3IgIT09IGRldiAvLyBcdTkwNTVcdTMwNDZcdTMwQzdcdTMwRDBcdTMwQTRcdTMwQjlcdTMwNkVcdTMwQTRcdTMwRDlcdTMwRjNcdTMwQzhcdTMwNkFcdTMwNkVcdTMwNjdcdTcxMjFcdTg5OTZcbiAgICAgICAgICAgIC8vIFx1NTJENVx1MzA0NFx1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc2V0VG9vbChcInBlblwiKTtcblxuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkVcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNkJcdTVGRENcdTMwNThcdTMwNjZcdTUxRTZcdTc0MDZcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXR1cy5kcmF3LmdldFRvb2woKSkge1xuICAgICAgICAgICAgY2FzZSBcInBlblwiOlxuICAgICAgICAgICAgICAgIC8vIFx1NTM1OFx1NjJCQ1x1MzA1N1x1NzlGQlx1NTJENVx1RkYxRFx1OEExOFx1OEZGMFxuICAgICAgICAgICAgICAgIGNvbnN0IHA6IFBvaW50IHwgbnVsbCA9IHRoaXMubWluZS5kcmF3Lmxhc3RQb2ludCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWluZS5wZW4ucHJvYyh4LCB5LCBwLCB0aGlzLm1pbmUucGFwZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLm1pbmUucGVuLm9wdC5jb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmUuZHJhdy5wdXNoUG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiem9vbVwiOlxuICAgICAgICAgICAgICAgIC8vIFx1MzA1NVx1MzA4OVx1MzA2Qlx1OTU3N1x1NjJCQ1x1MzA1N1x1RkYxRFx1NjJFMVx1NTkyN1x1N0UyRVx1NUMwRlxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuem9vbWRyYWcoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXAoZGV2OiBEZXZpY2UsIGU6IEV2ZW50LCBwOiBQb2ludCkge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBwLng7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIFUucGQoYCR7ZGV2fS11cCgke3h9LCR7eX0pPSR7dGhpcy5ub3dzZW5zb3J9YCk7XG5cbiAgICAgICAgLy8gXHU3M0ZFXHU1NzI4XHUzMDZFXHUzMEM0XHUzMEZDXHUzMEVCXHUzMDZCXHU1RkRDXHUzMDU4XHUzMDY2XHU1MUU2XHU3NDA2XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0dXMuZHJhdy5nZXRUb29sKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcbiAgICAgICAgICAgICAgICAvLyBcdTk1NzdcdTYyQkNcdTMwNTdcdTc5RkJcdTUyRDVcdUZGMURcdTc1M0JcdTk3NjJcdTMwQjlcdTMwQUZcdTMwRURcdTMwRkNcdTMwRUJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbi56b29tc2Nyb2xsLnNjcm9sbCh4LCB5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDFcdTMwQjlcdTMwQzhcdTMwRURcdTMwRkNcdTMwQUZcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdcdTdENDJcdTRFODZcbiAgICAgICAgdGhpcy5zdGF0dXMuZHJhdy5lbmRTdHJva2UoKTtcbiAgICAgICAgdGhpcy5taW5lLmRyYXcuZW5kU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC53cmFwZGl2LnNldE5vcm1hbCgpO1xuICAgICAgICB0aGlzLm5vd3NlbnNvciA9IG51bGw7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi9EcmF3RXZlbnRIYW5kbGVyXCI7XG5cbmNvbnN0IGJ1bG1hTmF2RHJvcCA9IChlOiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIik7XG59XG5jb25zdCBpbml0QnVsbWFOYXZEcm9wID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcGRvd24gLmRyb3Bkb3duLXRyaWdnZXIgYVwiKS5mb3JFYWNoKG5hdiA9PiB7XG4gICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnVsbWFOYXZEcm9wKTtcbiAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBidWxtYU5hdkRyb3ApO1xuICAgIH0pO1xufTtcbi8vIGNvbnN0IGJ1bG1hTmF2RHJvcCA9IChlOiBFdmVudCkgPT4ge1xuLy8gICAgIGNvbnN0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4vLyAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIik7XG4vLyB9XG4vLyBjb25zdCBpbml0QnVsbWFOYXZEcm9wID0gKCkgPT4ge1xuLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaGFzLWRyb3Bkb3duIC5uYXZiYXItbGlua1wiKS5mb3JFYWNoKG5hdiA9PiB7XG4vLyAgICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnVsbWFOYXZEcm9wKTtcbi8vICAgICAgICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBidWxtYU5hdkRyb3ApO1xuLy8gICAgIH0pO1xuLy8gfTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZHJhd2NhbnZhc2VzXCIpKSB7XG4gICAgICAgIGNvbnN0IHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyID0gbmV3IERyYXdFdmVudEhhbmRsZXIoKTtcbiAgICAgICAgc2Vuc2UuaW5pdCgpO1xuICAgIH1cbiAgICBjb25zdCBib2R5OiBIVE1MQm9keUVsZW1lbnQgPSA8SFRNTEJvZHlFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgLy8gaW9zXHUzMDZFXHUzMDY4XHUzMDREXHUzMDZFXHUzMEQ0XHUzMEYzXHUzMEMxXHUzMDg0XHUzMEMwXHUzMEQ2XHUzMEVCXHUzMEFGXHUzMEVBXHUzMEMzXHUzMEFGXHUzMDZCXHUzMDg4XHUzMDhCXHU2MkUxXHU1OTI3XHUzMDkyXHU3MTIxXHU1MkI5XHU1MzE2XG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuICAgIGluaXRCdWxtYU5hdkRyb3AoKTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFDYTtBQURiO0FBQUE7QUFDTyxNQUFNLGVBQU4sTUFBbUI7QUFBQSxRQUl0QixPQUFjLFdBQXlCO0FBQ25DLGlCQUFPLElBQUksYUFBYSxXQUFXO0FBQUEsUUFDdkM7QUFBQSxRQUNBLE9BQWMsWUFBMEI7QUFDcEMsaUJBQU8sSUFBSSxhQUFhLGNBQWM7QUFBQSxRQUMxQztBQUFBLFFBQ1EsWUFBWSxVQUFrQjtBQUNsQyxlQUFLLE1BQU0sU0FBUyxjQUFjLFFBQVE7QUFDMUMsZUFBSyxNQUFNLEtBQUssSUFBSSxXQUFXLElBQUk7QUFBQSxRQUN2QztBQUFBLFFBRU8sU0FBbUM7QUFDdEMsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsUUFDTyxTQUE0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T0FBTyxHQUFHLENBQUM7QUFDbEM7QUFBQTtBQUlSLGVBQUssT0FBTyxLQUFLLFVBQVU7QUFDM0IsZUFBSyxLQUFLLEtBQUssVUFBVTtBQUN6QixlQUFLLFFBQVEsUUFBUSxVQUFVO0FBQy9CLGVBQUssWUFBWTtBQUFBLFFBQ3JCO0FBQUEsTUFDSjtBQUFBO0FBQUE7OztBQzdKQTtBQUFBO0FBQUE7QUFFQSxVQUFNLGVBQWUsQ0FBQyxNQUFhO0FBRm5DO0FBR0ksY0FBTSxTQUFtQyxFQUFFO0FBQzNDLDJCQUFPLGtCQUFQLG1CQUFzQixrQkFBdEIsbUJBQXFDLFVBQVUsT0FBTztBQUFBLE1BQzFEO0FBQ0EsVUFBTSxtQkFBbUIsTUFBTTtBQUMzQixpQkFBUyxpQkFBaUIsK0JBQStCLEVBQUUsUUFBUSxTQUFPO0FBQ3RFLGNBQUksaUJBQWlCLFNBQVMsWUFBWTtBQUMxQyxjQUFJLGlCQUFpQixZQUFZLFlBQVk7QUFBQSxRQUNqRCxDQUFDO0FBQUEsTUFDTDtBQVdBLGFBQU8saUJBQWlCLFFBQVEsTUFBWTtBQUN4QyxZQUFJLFNBQVMsY0FBYyxlQUFlLEdBQUc7QUFDekMsZ0JBQU0sUUFBMEIsSUFBSSxpQkFBaUI7QUFDckQsZ0JBQU0sS0FBSztBQUFBLFFBQ2Y7QUFDQSxjQUFNLE9BQXlDLFNBQVMsY0FBYyxNQUFNO0FBRzVFLGFBQUssaUJBQWlCLGNBQWMsQ0FBQyxNQUFrQjtBQUNuRCxZQUFFLGVBQWU7QUFBQSxRQUNyQixHQUFHLEVBQUUsU0FBUyxNQUFNLENBQUM7QUFFckIseUJBQWlCO0FBQUEsTUFDckIsRUFBQztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbIlN3YWwiLCAiZ2xvYmFsU3RhdGUiLCAiZXJyb3IiLCAicmVqZWN0UHJvbWlzZSIsICJjb25maXJtIiwgImUiLCAicmZkYyIsICJyZmRjIiwgImNvbG9yIiwgInAiXQp9Cg==
