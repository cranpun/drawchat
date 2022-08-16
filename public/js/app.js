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
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
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
  function toRgbHex(col) {
    return "#" + col.match(/\d+/g).map(function(a) {
      return ("0" + parseInt(a).toString(16)).slice(-2);
    }).join("");
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

  // resources/ts/action/PenAction.ts
  var PenAction;
  var init_PenAction = __esm({
    "resources/ts/action/PenAction.ts"() {
      init_Draw();
      init_u();
      PenAction = class {
        constructor() {
          this.opt = {
            color: "",
            eraser: false
          };
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
          this.optbk = window._.cloneDeep(this.opt);
          pd(this.optbk);
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

  // node_modules/a-color-picker/dist/acolorpicker.js
  var require_acolorpicker = __commonJS({
    "node_modules/a-color-picker/dist/acolorpicker.js"(exports, module) {
      !function(e, t) {
        "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("AColorPicker", [], t) : "object" == typeof exports ? exports.AColorPicker = t() : e.AColorPicker = t();
      }("undefined" != typeof self ? self : exports, function() {
        return function(e) {
          var t = {};
          function r(i) {
            if (t[i])
              return t[i].exports;
            var o = t[i] = { i, l: false, exports: {} };
            return e[i].call(o.exports, o, o.exports, r), o.l = true, o.exports;
          }
          return r.m = e, r.c = t, r.d = function(e2, t2, i) {
            r.o(e2, t2) || Object.defineProperty(e2, t2, { enumerable: true, get: i });
          }, r.r = function(e2) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
          }, r.t = function(e2, t2) {
            if (1 & t2 && (e2 = r(e2)), 8 & t2)
              return e2;
            if (4 & t2 && "object" == typeof e2 && e2 && e2.__esModule)
              return e2;
            var i = /* @__PURE__ */ Object.create(null);
            if (r.r(i), Object.defineProperty(i, "default", { enumerable: true, value: e2 }), 2 & t2 && "string" != typeof e2)
              for (var o in e2)
                r.d(i, o, function(t3) {
                  return e2[t3];
                }.bind(null, o));
            return i;
          }, r.n = function(e2) {
            var t2 = e2 && e2.__esModule ? function() {
              return e2.default;
            } : function() {
              return e2;
            };
            return r.d(t2, "a", t2), t2;
          }, r.o = function(e2, t2) {
            return Object.prototype.hasOwnProperty.call(e2, t2);
          }, r.p = "", r(r.s = 1);
        }([function(e, t, r) {
          "use strict";
          var i = r(3);
          function o(e2) {
            return true === i(e2) && "[object Object]" === Object.prototype.toString.call(e2);
          }
          e.exports = function(e2) {
            var t2, r2;
            return false !== o(e2) && "function" == typeof (t2 = e2.constructor) && false !== o(r2 = t2.prototype) && false !== r2.hasOwnProperty("isPrototypeOf");
          };
        }, function(e, t, r) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: true }), t.VERSION = t.PALETTE_MATERIAL_CHROME = t.PALETTE_MATERIAL_500 = t.COLOR_NAMES = t.getLuminance = t.intToRgb = t.rgbToInt = t.rgbToHsv = t.rgbToHsl = t.hslToRgb = t.rgbToHex = t.parseColor = t.parseColorToHsla = t.parseColorToHsl = t.parseColorToRgba = t.parseColorToRgb = t.from = t.createPicker = void 0;
          var i = function() {
            function e2(e3, t2) {
              for (var r2 = 0; r2 < t2.length; r2++) {
                var i2 = t2[r2];
                i2.enumerable = i2.enumerable || false, i2.configurable = true, "value" in i2 && (i2.writable = true), Object.defineProperty(e3, i2.key, i2);
              }
            }
            return function(t2, r2, i2) {
              return r2 && e2(t2.prototype, r2), i2 && e2(t2, i2), t2;
            };
          }(), o = function(e2, t2) {
            if (Array.isArray(e2))
              return e2;
            if (Symbol.iterator in Object(e2))
              return function(e3, t3) {
                var r2 = [], i2 = true, o2 = false, n2 = void 0;
                try {
                  for (var s2, a2 = e3[Symbol.iterator](); !(i2 = (s2 = a2.next()).done) && (r2.push(s2.value), !t3 || r2.length !== t3); i2 = true)
                    ;
                } catch (e4) {
                  o2 = true, n2 = e4;
                } finally {
                  try {
                    !i2 && a2.return && a2.return();
                  } finally {
                    if (o2)
                      throw n2;
                  }
                }
                return r2;
              }(e2, t2);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }, n = r(2), s = l(r(0)), a = l(r(4));
          function l(e2) {
            return e2 && e2.__esModule ? e2 : { default: e2 };
          }
          function c(e2, t2) {
            if (!(e2 instanceof t2))
              throw new TypeError("Cannot call a class as a function");
          }
          function u(e2) {
            if (Array.isArray(e2)) {
              for (var t2 = 0, r2 = Array(e2.length); t2 < e2.length; t2++)
                r2[t2] = e2[t2];
              return r2;
            }
            return Array.from(e2);
          }
          var h = "undefined" != typeof window && window.navigator.userAgent.indexOf("Edge") > -1, p = "undefined" != typeof window && window.navigator.userAgent.indexOf("rv:") > -1, d = { id: null, attachTo: "body", showHSL: true, showRGB: true, showHEX: true, showAlpha: false, color: "#ff0000", palette: null, paletteEditable: false, useAlphaInPalette: "auto", slBarSize: [232, 150], hueBarSize: [150, 11], alphaBarSize: [150, 11] }, f = "COLOR", g = "RGBA_USER", b = "HSLA_USER";
          function v(e2, t2, r2) {
            return e2 ? e2 instanceof HTMLElement ? e2 : e2 instanceof NodeList ? e2[0] : "string" == typeof e2 ? document.querySelector(e2) : e2.jquery ? e2.get(0) : r2 ? t2 : null : t2;
          }
          function m(e2) {
            var t2 = e2.getContext("2d"), r2 = +e2.width, i2 = +e2.height, s2 = t2.createLinearGradient(1, 1, 1, i2 - 1);
            return s2.addColorStop(0, "white"), s2.addColorStop(1, "black"), { setHue: function(e3) {
              var o2 = t2.createLinearGradient(1, 0, r2 - 1, 0);
              o2.addColorStop(0, "hsla(" + e3 + ", 100%, 50%, 0)"), o2.addColorStop(1, "hsla(" + e3 + ", 100%, 50%, 1)"), t2.fillStyle = s2, t2.fillRect(0, 0, r2, i2), t2.fillStyle = o2, t2.globalCompositeOperation = "multiply", t2.fillRect(0, 0, r2, i2), t2.globalCompositeOperation = "source-over";
            }, grabColor: function(e3, r3) {
              return t2.getImageData(e3, r3, 1, 1).data;
            }, findColor: function(e3, t3, s3) {
              var a2 = (0, n.rgbToHsv)(e3, t3, s3), l2 = o(a2, 3), c2 = l2[1], u2 = l2[2];
              return [c2 * r2, i2 - u2 * i2];
            } };
          }
          function A(e2, t2, r2) {
            return null === e2 ? t2 : /^\s*$/.test(e2) ? r2 : !!/true|yes|1/i.test(e2) || !/false|no|0/i.test(e2) && t2;
          }
          function y(e2, t2, r2) {
            if (null === e2)
              return t2;
            if (/^\s*$/.test(e2))
              return r2;
            var i2 = e2.split(",").map(Number);
            return 2 === i2.length && i2[0] && i2[1] ? i2 : t2;
          }
          var k = function() {
            function e2(t2, r2) {
              if (c(this, e2), r2 ? (t2 = v(t2), this.options = Object.assign({}, d, r2)) : t2 && (0, s.default)(t2) ? (this.options = Object.assign({}, d, t2), t2 = v(this.options.attachTo)) : (this.options = Object.assign({}, d), t2 = v((0, n.nvl)(t2, this.options.attachTo))), !t2)
                throw new Error("Container not found: " + this.options.attachTo);
              !function(e3, t3) {
                var r3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "acp-";
                if (t3.hasAttribute(r3 + "show-hsl") && (e3.showHSL = A(t3.getAttribute(r3 + "show-hsl"), d.showHSL, true)), t3.hasAttribute(r3 + "show-rgb") && (e3.showRGB = A(t3.getAttribute(r3 + "show-rgb"), d.showRGB, true)), t3.hasAttribute(r3 + "show-hex") && (e3.showHEX = A(t3.getAttribute(r3 + "show-hex"), d.showHEX, true)), t3.hasAttribute(r3 + "show-alpha") && (e3.showAlpha = A(t3.getAttribute(r3 + "show-alpha"), d.showAlpha, true)), t3.hasAttribute(r3 + "palette-editable") && (e3.paletteEditable = A(t3.getAttribute(r3 + "palette-editable"), d.paletteEditable, true)), t3.hasAttribute(r3 + "sl-bar-size") && (e3.slBarSize = y(t3.getAttribute(r3 + "sl-bar-size"), d.slBarSize, [232, 150])), t3.hasAttribute(r3 + "hue-bar-size") && (e3.hueBarSize = y(t3.getAttribute(r3 + "hue-bar-size"), d.hueBarSize, [150, 11]), e3.alphaBarSize = e3.hueBarSize), t3.hasAttribute(r3 + "palette")) {
                  var i3 = t3.getAttribute(r3 + "palette");
                  switch (i3) {
                    case "PALETTE_MATERIAL_500":
                      e3.palette = n.PALETTE_MATERIAL_500;
                      break;
                    case "PALETTE_MATERIAL_CHROME":
                    case "":
                      e3.palette = n.PALETTE_MATERIAL_CHROME;
                      break;
                    default:
                      e3.palette = i3.split(/[;|]/);
                  }
                }
                t3.hasAttribute(r3 + "color") && (e3.color = t3.getAttribute(r3 + "color"));
              }(this.options, t2), this.H = 0, this.S = 0, this.L = 0, this.R = 0, this.G = 0, this.B = 0, this.A = 1, this.palette = {}, this.element = document.createElement("div"), this.options.id && (this.element.id = this.options.id), this.element.className = "a-color-picker", this.element.innerHTML = a.default, t2.appendChild(this.element);
              var i2 = this.element.querySelector(".a-color-picker-h");
              this.setupHueCanvas(i2), this.hueBarHelper = m(i2), this.huePointer = this.element.querySelector(".a-color-picker-h+.a-color-picker-dot");
              var o2 = this.element.querySelector(".a-color-picker-sl");
              this.setupSlCanvas(o2), this.slBarHelper = m(o2), this.slPointer = this.element.querySelector(".a-color-picker-sl+.a-color-picker-dot"), this.preview = this.element.querySelector(".a-color-picker-preview"), this.setupClipboard(this.preview.querySelector(".a-color-picker-clipbaord")), this.options.showHSL ? (this.setupInput(this.inputH = this.element.querySelector(".a-color-picker-hsl>input[nameref=H]")), this.setupInput(this.inputS = this.element.querySelector(".a-color-picker-hsl>input[nameref=S]")), this.setupInput(this.inputL = this.element.querySelector(".a-color-picker-hsl>input[nameref=L]"))) : this.element.querySelector(".a-color-picker-hsl").remove(), this.options.showRGB ? (this.setupInput(this.inputR = this.element.querySelector(".a-color-picker-rgb>input[nameref=R]")), this.setupInput(this.inputG = this.element.querySelector(".a-color-picker-rgb>input[nameref=G]")), this.setupInput(this.inputB = this.element.querySelector(".a-color-picker-rgb>input[nameref=B]"))) : this.element.querySelector(".a-color-picker-rgb").remove(), this.options.showHEX ? this.setupInput(this.inputRGBHEX = this.element.querySelector("input[nameref=RGBHEX]")) : this.element.querySelector(".a-color-picker-rgbhex").remove(), this.options.paletteEditable || this.options.palette && this.options.palette.length > 0 ? this.setPalette(this.paletteRow = this.element.querySelector(".a-color-picker-palette")) : (this.paletteRow = this.element.querySelector(".a-color-picker-palette"), this.paletteRow.remove()), this.options.showAlpha ? (this.setupAlphaCanvas(this.element.querySelector(".a-color-picker-a")), this.alphaPointer = this.element.querySelector(".a-color-picker-a+.a-color-picker-dot")) : this.element.querySelector(".a-color-picker-alpha").remove(), this.element.style.width = this.options.slBarSize[0] + "px", this.onValueChanged(f, this.options.color);
            }
            return i(e2, [{ key: "setupHueCanvas", value: function(e3) {
              var t2 = this;
              e3.width = this.options.hueBarSize[0], e3.height = this.options.hueBarSize[1];
              for (var r2 = e3.getContext("2d"), i2 = r2.createLinearGradient(0, 0, this.options.hueBarSize[0], 0), o2 = 0; o2 <= 1; o2 += 1 / 360)
                i2.addColorStop(o2, "hsl(" + 360 * o2 + ", 100%, 50%)");
              r2.fillStyle = i2, r2.fillRect(0, 0, this.options.hueBarSize[0], this.options.hueBarSize[1]);
              var s2 = function(r3) {
                var i3 = (0, n.limit)(r3.clientX - e3.getBoundingClientRect().left, 0, t2.options.hueBarSize[0]), o3 = Math.round(360 * i3 / t2.options.hueBarSize[0]);
                t2.huePointer.style.left = i3 - 7 + "px", t2.onValueChanged("H", o3);
              }, a2 = function e4() {
                document.removeEventListener("mousemove", s2), document.removeEventListener("mouseup", e4);
              };
              e3.addEventListener("mousedown", function(e4) {
                s2(e4), document.addEventListener("mousemove", s2), document.addEventListener("mouseup", a2);
              });
            } }, { key: "setupSlCanvas", value: function(e3) {
              var t2 = this;
              e3.width = this.options.slBarSize[0], e3.height = this.options.slBarSize[1];
              var r2 = function(r3) {
                var i3 = (0, n.limit)(r3.clientX - e3.getBoundingClientRect().left, 0, t2.options.slBarSize[0] - 1), o2 = (0, n.limit)(r3.clientY - e3.getBoundingClientRect().top, 0, t2.options.slBarSize[1] - 1), s2 = t2.slBarHelper.grabColor(i3, o2);
                t2.slPointer.style.left = i3 - 7 + "px", t2.slPointer.style.top = o2 - 7 + "px", t2.onValueChanged("RGB", s2);
              }, i2 = function e4() {
                document.removeEventListener("mousemove", r2), document.removeEventListener("mouseup", e4);
              };
              e3.addEventListener("mousedown", function(e4) {
                r2(e4), document.addEventListener("mousemove", r2), document.addEventListener("mouseup", i2);
              });
            } }, { key: "setupAlphaCanvas", value: function(e3) {
              var t2 = this;
              e3.width = this.options.alphaBarSize[0], e3.height = this.options.alphaBarSize[1];
              var r2 = e3.getContext("2d"), i2 = r2.createLinearGradient(0, 0, e3.width - 1, 0);
              i2.addColorStop(0, "hsla(0, 0%, 50%, 0)"), i2.addColorStop(1, "hsla(0, 0%, 50%, 1)"), r2.fillStyle = i2, r2.fillRect(0, 0, this.options.alphaBarSize[0], this.options.alphaBarSize[1]);
              var o2 = function(r3) {
                var i3 = (0, n.limit)(r3.clientX - e3.getBoundingClientRect().left, 0, t2.options.alphaBarSize[0]), o3 = +(i3 / t2.options.alphaBarSize[0]).toFixed(2);
                t2.alphaPointer.style.left = i3 - 7 + "px", t2.onValueChanged("ALPHA", o3);
              }, s2 = function e4() {
                document.removeEventListener("mousemove", o2), document.removeEventListener("mouseup", e4);
              };
              e3.addEventListener("mousedown", function(e4) {
                o2(e4), document.addEventListener("mousemove", o2), document.addEventListener("mouseup", s2);
              });
            } }, { key: "setupInput", value: function(e3) {
              var t2 = this, r2 = +e3.min, i2 = +e3.max, o2 = e3.getAttribute("nameref");
              e3.hasAttribute("select-on-focus") && e3.addEventListener("focus", function() {
                e3.select();
              }), "text" === e3.type ? e3.addEventListener("change", function() {
                t2.onValueChanged(o2, e3.value);
              }) : ((h || p) && e3.addEventListener("keydown", function(s2) {
                "Up" === s2.key ? (e3.value = (0, n.limit)(+e3.value + 1, r2, i2), t2.onValueChanged(o2, e3.value), s2.returnValue = false) : "Down" === s2.key && (e3.value = (0, n.limit)(+e3.value - 1, r2, i2), t2.onValueChanged(o2, e3.value), s2.returnValue = false);
              }), e3.addEventListener("change", function() {
                var s2 = +e3.value;
                t2.onValueChanged(o2, (0, n.limit)(s2, r2, i2));
              }));
            } }, { key: "setupClipboard", value: function(e3) {
              var t2 = this;
              e3.title = "click to copy", e3.addEventListener("click", function() {
                e3.value = (0, n.parseColor)([t2.R, t2.G, t2.B, t2.A], "hexcss4"), e3.select(), document.execCommand("copy");
              });
            } }, { key: "setPalette", value: function(e3) {
              var t2 = this, r2 = "auto" === this.options.useAlphaInPalette ? this.options.showAlpha : this.options.useAlphaInPalette, i2 = null;
              switch (this.options.palette) {
                case "PALETTE_MATERIAL_500":
                  i2 = n.PALETTE_MATERIAL_500;
                  break;
                case "PALETTE_MATERIAL_CHROME":
                  i2 = n.PALETTE_MATERIAL_CHROME;
                  break;
                default:
                  i2 = (0, n.ensureArray)(this.options.palette);
              }
              if (this.options.paletteEditable || i2.length > 0) {
                var o2 = function(r3, i3, o3) {
                  var n2 = e3.querySelector('.a-color-picker-palette-color[data-color="' + r3 + '"]') || document.createElement("div");
                  n2.className = "a-color-picker-palette-color", n2.style.backgroundColor = r3, n2.setAttribute("data-color", r3), n2.title = r3, e3.insertBefore(n2, i3), t2.palette[r3] = true, o3 && t2.onPaletteColorAdd(r3);
                }, s2 = function(r3, i3) {
                  r3 ? (e3.removeChild(r3), t2.palette[r3.getAttribute("data-color")] = false, i3 && t2.onPaletteColorRemove(r3.getAttribute("data-color"))) : (e3.querySelectorAll(".a-color-picker-palette-color[data-color]").forEach(function(t3) {
                    e3.removeChild(t3);
                  }), Object.keys(t2.palette).forEach(function(e4) {
                    t2.palette[e4] = false;
                  }), i3 && t2.onPaletteColorRemove());
                };
                if (i2.map(function(e4) {
                  return (0, n.parseColor)(e4, r2 ? "rgbcss4" : "hex");
                }).filter(function(e4) {
                  return !!e4;
                }).forEach(function(e4) {
                  return o2(e4);
                }), this.options.paletteEditable) {
                  var a2 = document.createElement("div");
                  a2.className = "a-color-picker-palette-color a-color-picker-palette-add", a2.innerHTML = "+", e3.appendChild(a2), e3.addEventListener("click", function(e4) {
                    /a-color-picker-palette-add/.test(e4.target.className) ? e4.shiftKey ? s2(null, true) : o2(r2 ? (0, n.parseColor)([t2.R, t2.G, t2.B, t2.A], "rgbcss4") : (0, n.rgbToHex)(t2.R, t2.G, t2.B), e4.target, true) : /a-color-picker-palette-color/.test(e4.target.className) && (e4.shiftKey ? s2(e4.target, true) : t2.onValueChanged(f, e4.target.getAttribute("data-color")));
                  });
                } else
                  e3.addEventListener("click", function(e4) {
                    /a-color-picker-palette-color/.test(e4.target.className) && t2.onValueChanged(f, e4.target.getAttribute("data-color"));
                  });
              } else
                e3.style.display = "none";
            } }, { key: "updatePalette", value: function(e3) {
              this.paletteRow.innerHTML = "", this.palette = {}, this.paletteRow.parentElement || this.element.appendChild(this.paletteRow), this.options.palette = e3, this.setPalette(this.paletteRow);
            } }, { key: "onValueChanged", value: function(e3, t2) {
              var r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : { silent: false };
              switch (e3) {
                case "H":
                  this.H = t2;
                  var i2 = (0, n.hslToRgb)(this.H, this.S, this.L), s2 = o(i2, 3);
                  this.R = s2[0], this.G = s2[1], this.B = s2[2], this.slBarHelper.setHue(t2), this.updatePointerH(this.H), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "S":
                  this.S = t2;
                  var a2 = (0, n.hslToRgb)(this.H, this.S, this.L), l2 = o(a2, 3);
                  this.R = l2[0], this.G = l2[1], this.B = l2[2], this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "L":
                  this.L = t2;
                  var c2 = (0, n.hslToRgb)(this.H, this.S, this.L), u2 = o(c2, 3);
                  this.R = u2[0], this.G = u2[1], this.B = u2[2], this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "R":
                  this.R = t2;
                  var h2 = (0, n.rgbToHsl)(this.R, this.G, this.B), p2 = o(h2, 3);
                  this.H = p2[0], this.S = p2[1], this.L = p2[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "G":
                  this.G = t2;
                  var d2 = (0, n.rgbToHsl)(this.R, this.G, this.B), v2 = o(d2, 3);
                  this.H = v2[0], this.S = v2[1], this.L = v2[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "B":
                  this.B = t2;
                  var m2 = (0, n.rgbToHsl)(this.R, this.G, this.B), A2 = o(m2, 3);
                  this.H = A2[0], this.S = A2[1], this.L = A2[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case "RGB":
                  var y2 = o(t2, 3);
                  this.R = y2[0], this.G = y2[1], this.B = y2[2];
                  var k2 = (0, n.rgbToHsl)(this.R, this.G, this.B), F2 = o(k2, 3);
                  this.H = F2[0], this.S = F2[1], this.L = F2[2], this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B);
                  break;
                case g:
                  var E2 = o(t2, 4);
                  this.R = E2[0], this.G = E2[1], this.B = E2[2], this.A = E2[3];
                  var H2 = (0, n.rgbToHsl)(this.R, this.G, this.B), B2 = o(H2, 3);
                  this.H = B2[0], this.S = B2[1], this.L = B2[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B), this.updatePointerA(this.A);
                  break;
                case b:
                  var R = o(t2, 4);
                  this.H = R[0], this.S = R[1], this.L = R[2], this.A = R[3];
                  var C = (0, n.hslToRgb)(this.H, this.S, this.L), S = o(C, 3);
                  this.R = S[0], this.G = S[1], this.B = S[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B), this.updatePointerA(this.A);
                  break;
                case "RGBHEX":
                  var L = (0, n.cssColorToRgb)(t2) || [this.R, this.G, this.B], w = o(L, 3);
                  this.R = w[0], this.G = w[1], this.B = w[2];
                  var T = (0, n.rgbToHsl)(this.R, this.G, this.B), x = o(T, 3);
                  this.H = x[0], this.S = x[1], this.L = x[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B);
                  break;
                case f:
                  var G = (0, n.parseColor)(t2, "rgba") || [0, 0, 0, 1], I = o(G, 4);
                  this.R = I[0], this.G = I[1], this.B = I[2], this.A = I[3];
                  var P = (0, n.rgbToHsl)(this.R, this.G, this.B), D = o(P, 3);
                  this.H = D[0], this.S = D[1], this.L = D[2], this.slBarHelper.setHue(this.H), this.updatePointerH(this.H), this.updatePointerSL(this.H, this.S, this.L), this.updateInputHSL(this.H, this.S, this.L), this.updateInputRGB(this.R, this.G, this.B), this.updateInputRGBHEX(this.R, this.G, this.B), this.updatePointerA(this.A);
                  break;
                case "ALPHA":
                  this.A = t2;
              }
              1 === this.A ? this.preview.style.backgroundColor = "rgb(" + this.R + "," + this.G + "," + this.B + ")" : this.preview.style.backgroundColor = "rgba(" + this.R + "," + this.G + "," + this.B + "," + this.A + ")", r2 && r2.silent || this.onchange && this.onchange(this.preview.style.backgroundColor);
            } }, { key: "onPaletteColorAdd", value: function(e3) {
              this.oncoloradd && this.oncoloradd(e3);
            } }, { key: "onPaletteColorRemove", value: function(e3) {
              this.oncolorremove && this.oncolorremove(e3);
            } }, { key: "updateInputHSL", value: function(e3, t2, r2) {
              this.options.showHSL && (this.inputH.value = e3, this.inputS.value = t2, this.inputL.value = r2);
            } }, { key: "updateInputRGB", value: function(e3, t2, r2) {
              this.options.showRGB && (this.inputR.value = e3, this.inputG.value = t2, this.inputB.value = r2);
            } }, { key: "updateInputRGBHEX", value: function(e3, t2, r2) {
              this.options.showHEX && (this.inputRGBHEX.value = (0, n.rgbToHex)(e3, t2, r2));
            } }, { key: "updatePointerH", value: function(e3) {
              var t2 = this.options.hueBarSize[0] * e3 / 360;
              this.huePointer.style.left = t2 - 7 + "px";
            } }, { key: "updatePointerSL", value: function(e3, t2, r2) {
              var i2 = (0, n.hslToRgb)(e3, t2, r2), s2 = o(i2, 3), a2 = s2[0], l2 = s2[1], c2 = s2[2], u2 = this.slBarHelper.findColor(a2, l2, c2), h2 = o(u2, 2), p2 = h2[0], d2 = h2[1];
              p2 >= 0 && (this.slPointer.style.left = p2 - 7 + "px", this.slPointer.style.top = d2 - 7 + "px");
            } }, { key: "updatePointerA", value: function(e3) {
              if (this.options.showAlpha) {
                var t2 = this.options.alphaBarSize[0] * e3;
                this.alphaPointer.style.left = t2 - 7 + "px";
              }
            } }]), e2;
          }(), F = function() {
            function e2(t2) {
              c(this, e2), this.name = t2, this.listeners = [];
            }
            return i(e2, [{ key: "on", value: function(e3) {
              e3 && this.listeners.push(e3);
            } }, { key: "off", value: function(e3) {
              this.listeners = e3 ? this.listeners.filter(function(t2) {
                return t2 !== e3;
              }) : [];
            } }, { key: "emit", value: function(e3, t2) {
              for (var r2 = this.listeners.slice(0), i2 = 0; i2 < r2.length; i2++)
                r2[i2].apply(t2, e3);
            } }]), e2;
          }();
          function E(e2, t2) {
            var r2 = new k(e2, t2), i2 = { change: new F("change"), coloradd: new F("coloradd"), colorremove: new F("colorremove") }, s2 = true, a2 = {}, l2 = { get element() {
              return r2.element;
            }, get rgb() {
              return [r2.R, r2.G, r2.B];
            }, set rgb(e3) {
              var t3 = o(e3, 3), i3 = t3[0], s3 = t3[1], a3 = t3[2], l3 = [(0, n.limit)(i3, 0, 255), (0, n.limit)(s3, 0, 255), (0, n.limit)(a3, 0, 255)];
              i3 = l3[0], s3 = l3[1], a3 = l3[2], r2.onValueChanged(g, [i3, s3, a3, 1]);
            }, get hsl() {
              return [r2.H, r2.S, r2.L];
            }, set hsl(e3) {
              var t3 = o(e3, 3), i3 = t3[0], s3 = t3[1], a3 = t3[2], l3 = [(0, n.limit)(i3, 0, 360), (0, n.limit)(s3, 0, 100), (0, n.limit)(a3, 0, 100)];
              i3 = l3[0], s3 = l3[1], a3 = l3[2], r2.onValueChanged(b, [i3, s3, a3, 1]);
            }, get rgbhex() {
              return this.all.hex;
            }, get rgba() {
              return [r2.R, r2.G, r2.B, r2.A];
            }, set rgba(e3) {
              var t3 = o(e3, 4), i3 = t3[0], s3 = t3[1], a3 = t3[2], l3 = t3[3], c2 = [(0, n.limit)(i3, 0, 255), (0, n.limit)(s3, 0, 255), (0, n.limit)(a3, 0, 255), (0, n.limit)(l3, 0, 1)];
              i3 = c2[0], s3 = c2[1], a3 = c2[2], l3 = c2[3], r2.onValueChanged(g, [i3, s3, a3, l3]);
            }, get hsla() {
              return [r2.H, r2.S, r2.L, r2.A];
            }, set hsla(e3) {
              var t3 = o(e3, 4), i3 = t3[0], s3 = t3[1], a3 = t3[2], l3 = t3[3], c2 = [(0, n.limit)(i3, 0, 360), (0, n.limit)(s3, 0, 100), (0, n.limit)(a3, 0, 100), (0, n.limit)(l3, 0, 1)];
              i3 = c2[0], s3 = c2[1], a3 = c2[2], l3 = c2[3], r2.onValueChanged(b, [i3, s3, a3, l3]);
            }, get color() {
              return this.all.toString();
            }, set color(e3) {
              r2.onValueChanged(f, e3);
            }, setColor: function(e3) {
              var t3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
              r2.onValueChanged(f, e3, { silent: t3 });
            }, get all() {
              if (s2) {
                var e3 = [r2.R, r2.G, r2.B, r2.A], t3 = r2.A < 1 ? "rgba(" + r2.R + "," + r2.G + "," + r2.B + "," + r2.A + ")" : n.rgbToHex.apply(void 0, e3);
                (a2 = (0, n.parseColor)(e3, a2)).toString = function() {
                  return t3;
                }, s2 = false;
              }
              return Object.assign({}, a2);
            }, get onchange() {
              return i2.change && i2.change.listeners[0];
            }, set onchange(e3) {
              this.off("change").on("change", e3);
            }, get oncoloradd() {
              return i2.coloradd && i2.coloradd.listeners[0];
            }, set oncoloradd(e3) {
              this.off("coloradd").on("coloradd", e3);
            }, get oncolorremove() {
              return i2.colorremove && i2.colorremove.listeners[0];
            }, set oncolorremove(e3) {
              this.off("colorremove").on("colorremove", e3);
            }, get palette() {
              return Object.keys(r2.palette).filter(function(e3) {
                return r2.palette[e3];
              });
            }, set palette(e3) {
              r2.updatePalette(e3);
            }, show: function() {
              r2.element.classList.remove("hidden");
            }, hide: function() {
              r2.element.classList.add("hidden");
            }, toggle: function() {
              r2.element.classList.toggle("hidden");
            }, on: function(e3, t3) {
              return e3 && i2[e3] && i2[e3].on(t3), this;
            }, off: function(e3, t3) {
              return e3 && i2[e3] && i2[e3].off(t3), this;
            }, destroy: function() {
              i2.change.off(), i2.coloradd.off(), i2.colorremove.off(), r2.element.remove(), i2 = null, r2 = null;
            } };
            return r2.onchange = function() {
              for (var e3 = arguments.length, t3 = Array(e3), r3 = 0; r3 < e3; r3++)
                t3[r3] = arguments[r3];
              s2 = true, i2.change.emit([l2].concat(t3), l2);
            }, r2.oncoloradd = function() {
              for (var e3 = arguments.length, t3 = Array(e3), r3 = 0; r3 < e3; r3++)
                t3[r3] = arguments[r3];
              i2.coloradd.emit([l2].concat(t3), l2);
            }, r2.oncolorremove = function() {
              for (var e3 = arguments.length, t3 = Array(e3), r3 = 0; r3 < e3; r3++)
                t3[r3] = arguments[r3];
              i2.colorremove.emit([l2].concat(t3), l2);
            }, r2.element.ctrl = l2, l2;
          }
          if ("undefined" != typeof window && !document.querySelector('head>style[data-source="a-color-picker"]')) {
            var H = r(5).toString(), B = document.createElement("style");
            B.setAttribute("type", "text/css"), B.setAttribute("data-source", "a-color-picker"), B.innerHTML = H, document.querySelector("head").appendChild(B);
          }
          t.createPicker = E, t.from = function(e2, t2) {
            var r2 = function(e3) {
              return e3 ? Array.isArray(e3) ? e3 : e3 instanceof HTMLElement ? [e3] : e3 instanceof NodeList ? [].concat(u(e3)) : "string" == typeof e3 ? [].concat(u(document.querySelectorAll(e3))) : e3.jquery ? e3.get() : [] : [];
            }(e2).map(function(e3, r3) {
              var i2 = E(e3, t2);
              return i2.index = r3, i2;
            });
            return r2.on = function(e3, t3) {
              return r2.forEach(function(r3) {
                return r3.on(e3, t3);
              }), this;
            }, r2.off = function(e3) {
              return r2.forEach(function(t3) {
                return t3.off(e3);
              }), this;
            }, r2;
          }, t.parseColorToRgb = n.parseColorToRgb, t.parseColorToRgba = n.parseColorToRgba, t.parseColorToHsl = n.parseColorToHsl, t.parseColorToHsla = n.parseColorToHsla, t.parseColor = n.parseColor, t.rgbToHex = n.rgbToHex, t.hslToRgb = n.hslToRgb, t.rgbToHsl = n.rgbToHsl, t.rgbToHsv = n.rgbToHsv, t.rgbToInt = n.rgbToInt, t.intToRgb = n.intToRgb, t.getLuminance = n.getLuminance, t.COLOR_NAMES = n.COLOR_NAMES, t.PALETTE_MATERIAL_500 = n.PALETTE_MATERIAL_500, t.PALETTE_MATERIAL_CHROME = n.PALETTE_MATERIAL_CHROME, t.VERSION = "1.2.1";
        }, function(e, t, r) {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: true }), t.nvl = t.ensureArray = t.limit = t.getLuminance = t.parseColor = t.parseColorToHsla = t.parseColorToHsl = t.cssHslaToHsla = t.cssHslToHsl = t.parseColorToRgba = t.parseColorToRgb = t.cssRgbaToRgba = t.cssRgbToRgb = t.cssColorToRgba = t.cssColorToRgb = t.intToRgb = t.rgbToInt = t.rgbToHsv = t.rgbToHsl = t.hslToRgb = t.rgbToHex = t.PALETTE_MATERIAL_CHROME = t.PALETTE_MATERIAL_500 = t.COLOR_NAMES = void 0;
          var i = function(e2, t2) {
            if (Array.isArray(e2))
              return e2;
            if (Symbol.iterator in Object(e2))
              return function(e3, t3) {
                var r2 = [], i2 = true, o2 = false, n2 = void 0;
                try {
                  for (var s2, a2 = e3[Symbol.iterator](); !(i2 = (s2 = a2.next()).done) && (r2.push(s2.value), !t3 || r2.length !== t3); i2 = true)
                    ;
                } catch (e4) {
                  o2 = true, n2 = e4;
                } finally {
                  try {
                    !i2 && a2.return && a2.return();
                  } finally {
                    if (o2)
                      throw n2;
                  }
                }
                return r2;
              }(e2, t2);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }, o = function(e2) {
            return e2 && e2.__esModule ? e2 : { default: e2 };
          }(r(0));
          function n(e2) {
            if (Array.isArray(e2)) {
              for (var t2 = 0, r2 = Array(e2.length); t2 < e2.length; t2++)
                r2[t2] = e2[t2];
              return r2;
            }
            return Array.from(e2);
          }
          var s = { aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aqua: "#00FFFF", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blue: "#0000FF", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgrey: "#A9A9A9", darkgreen: "#006400", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", fuchsia: "#FF00FF", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", gray: "#808080", grey: "#808080", green: "#008000", greenyellow: "#ADFF2F", honeydew: "#F0FFF0", hotpink: "#FF69B4", "indianred ": "#CD5C5C", "indigo ": "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3", lightgrey: "#D3D3D3", lightgreen: "#90EE90", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", lime: "#00FF00", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#FF00FF", maroon: "#800000", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", navy: "#000080", oldlace: "#FDF5E6", olive: "#808000", olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", rebeccapurple: "#663399", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32" };
          function a(e2, t2, r2) {
            return e2 = +e2, isNaN(e2) ? t2 : e2 < t2 ? t2 : e2 > r2 ? r2 : e2;
          }
          function l(e2, t2) {
            return null == e2 ? t2 : e2;
          }
          function c(e2, t2, r2) {
            var i2 = [a(e2, 0, 255), a(t2, 0, 255), a(r2, 0, 255)];
            return "#" + ("000000" + ((e2 = i2[0]) << 16 | (t2 = i2[1]) << 8 | (r2 = i2[2])).toString(16)).slice(-6);
          }
          function u(e2, t2, r2) {
            var i2 = void 0, o2 = void 0, n2 = void 0, s2 = [a(e2, 0, 360) / 360, a(t2, 0, 100) / 100, a(r2, 0, 100) / 100];
            if (e2 = s2[0], r2 = s2[2], 0 == (t2 = s2[1]))
              i2 = o2 = n2 = r2;
            else {
              var l2 = function(e3, t3, r3) {
                return r3 < 0 && (r3 += 1), r3 > 1 && (r3 -= 1), r3 < 1 / 6 ? e3 + 6 * (t3 - e3) * r3 : r3 < 0.5 ? t3 : r3 < 2 / 3 ? e3 + (t3 - e3) * (2 / 3 - r3) * 6 : e3;
              }, c2 = r2 < 0.5 ? r2 * (1 + t2) : r2 + t2 - r2 * t2, u2 = 2 * r2 - c2;
              i2 = l2(u2, c2, e2 + 1 / 3), o2 = l2(u2, c2, e2), n2 = l2(u2, c2, e2 - 1 / 3);
            }
            return [255 * i2, 255 * o2, 255 * n2].map(Math.round);
          }
          function h(e2, t2, r2) {
            var i2 = [a(e2, 0, 255) / 255, a(t2, 0, 255) / 255, a(r2, 0, 255) / 255];
            e2 = i2[0], t2 = i2[1], r2 = i2[2];
            var o2 = Math.max(e2, t2, r2), n2 = Math.min(e2, t2, r2), s2 = void 0, l2 = void 0, c2 = (o2 + n2) / 2;
            if (o2 == n2)
              s2 = l2 = 0;
            else {
              var u2 = o2 - n2;
              switch (l2 = c2 > 0.5 ? u2 / (2 - o2 - n2) : u2 / (o2 + n2), o2) {
                case e2:
                  s2 = (t2 - r2) / u2 + (t2 < r2 ? 6 : 0);
                  break;
                case t2:
                  s2 = (r2 - e2) / u2 + 2;
                  break;
                case r2:
                  s2 = (e2 - t2) / u2 + 4;
              }
              s2 /= 6;
            }
            return [360 * s2, 100 * l2, 100 * c2].map(Math.round);
          }
          function p(e2, t2, r2) {
            return e2 << 16 | t2 << 8 | r2;
          }
          function d(e2) {
            if (e2) {
              var t2 = s[e2.toString().toLowerCase()], r2 = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F]))|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})))\s*$/i.exec(t2 || e2) || [], o2 = i(r2, 10), n2 = o2[3], a2 = o2[4], l2 = o2[5], c2 = o2[7], u2 = o2[8], h2 = o2[9];
              if (void 0 !== n2)
                return [parseInt(n2 + n2, 16), parseInt(a2 + a2, 16), parseInt(l2 + l2, 16)];
              if (void 0 !== c2)
                return [parseInt(c2, 16), parseInt(u2, 16), parseInt(h2, 16)];
            }
          }
          function f(e2) {
            if (e2) {
              var t2 = s[e2.toString().toLowerCase()], r2 = /^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F])([0-9A-F])?)|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?))\s*$/i.exec(t2 || e2) || [], o2 = i(r2, 12), n2 = o2[3], a2 = o2[4], l2 = o2[5], c2 = o2[6], u2 = o2[8], h2 = o2[9], p2 = o2[10], d2 = o2[11];
              if (void 0 !== n2)
                return [parseInt(n2 + n2, 16), parseInt(a2 + a2, 16), parseInt(l2 + l2, 16), c2 ? +(parseInt(c2 + c2, 16) / 255).toFixed(2) : 1];
              if (void 0 !== u2)
                return [parseInt(u2, 16), parseInt(h2, 16), parseInt(p2, 16), d2 ? +(parseInt(d2, 16) / 255).toFixed(2) : 1];
            }
          }
          function g(e2) {
            if (e2) {
              var t2 = /^rgb\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(e2) || [], r2 = i(t2, 4), o2 = r2[0], n2 = r2[1], s2 = r2[2], l2 = r2[3];
              return o2 ? [a(n2, 0, 255), a(s2, 0, 255), a(l2, 0, 255)] : void 0;
            }
          }
          function b(e2) {
            if (e2) {
              var t2 = /^rgba?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(e2) || [], r2 = i(t2, 6), o2 = r2[0], n2 = r2[1], s2 = r2[2], c2 = r2[3], u2 = r2[5];
              return o2 ? [a(n2, 0, 255), a(s2, 0, 255), a(c2, 0, 255), a(l(u2, 1), 0, 1)] : void 0;
            }
          }
          function v(e2) {
            if (Array.isArray(e2))
              return [a(e2[0], 0, 255), a(e2[1], 0, 255), a(e2[2], 0, 255), a(l(e2[3], 1), 0, 1)];
            var t2 = f(e2) || b(e2);
            return t2 && 3 === t2.length && t2.push(1), t2;
          }
          function m(e2) {
            if (e2) {
              var t2 = /^hsl\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(e2) || [], r2 = i(t2, 4), o2 = r2[0], n2 = r2[1], s2 = r2[2], l2 = r2[3];
              return o2 ? [a(n2, 0, 360), a(s2, 0, 100), a(l2, 0, 100)] : void 0;
            }
          }
          function A(e2) {
            if (e2) {
              var t2 = /^hsla?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(e2) || [], r2 = i(t2, 6), o2 = r2[0], n2 = r2[1], s2 = r2[2], c2 = r2[3], u2 = r2[5];
              return o2 ? [a(n2, 0, 255), a(s2, 0, 255), a(c2, 0, 255), a(l(u2, 1), 0, 1)] : void 0;
            }
          }
          function y(e2) {
            if (Array.isArray(e2))
              return [a(e2[0], 0, 360), a(e2[1], 0, 100), a(e2[2], 0, 100), a(l(e2[3], 1), 0, 1)];
            var t2 = A(e2);
            return t2 && 3 === t2.length && t2.push(1), t2;
          }
          function k(e2, t2) {
            switch (t2) {
              case "rgb":
              default:
                return e2.slice(0, 3);
              case "rgbcss":
                return "rgb(" + e2[0] + ", " + e2[1] + ", " + e2[2] + ")";
              case "rgbcss4":
                return "rgb(" + e2[0] + ", " + e2[1] + ", " + e2[2] + ", " + e2[3] + ")";
              case "rgba":
                return e2;
              case "rgbacss":
                return "rgba(" + e2[0] + ", " + e2[1] + ", " + e2[2] + ", " + e2[3] + ")";
              case "hsl":
                return h.apply(void 0, n(e2));
              case "hslcss":
                return "hsl(" + (e2 = h.apply(void 0, n(e2)))[0] + ", " + e2[1] + ", " + e2[2] + ")";
              case "hslcss4":
                var r2 = h.apply(void 0, n(e2));
                return "hsl(" + r2[0] + ", " + r2[1] + ", " + r2[2] + ", " + e2[3] + ")";
              case "hsla":
                return [].concat(n(h.apply(void 0, n(e2))), [e2[3]]);
              case "hslacss":
                var i2 = h.apply(void 0, n(e2));
                return "hsla(" + i2[0] + ", " + i2[1] + ", " + i2[2] + ", " + e2[3] + ")";
              case "hex":
                return c.apply(void 0, n(e2));
              case "hexcss4":
                return c.apply(void 0, n(e2)) + ("00" + parseInt(255 * e2[3]).toString(16)).slice(-2);
              case "int":
                return p.apply(void 0, n(e2));
            }
          }
          t.COLOR_NAMES = s, t.PALETTE_MATERIAL_500 = ["#F44336", "#E91E63", "#E91E63", "#9C27B0", "#9C27B0", "#673AB7", "#673AB7", "#3F51B5", "#3F51B5", "#2196F3", "#2196F3", "#03A9F4", "#03A9F4", "#00BCD4", "#00BCD4", "#009688", "#009688", "#4CAF50", "#4CAF50", "#8BC34A", "#8BC34A", "#CDDC39", "#CDDC39", "#FFEB3B", "#FFEB3B", "#FFC107", "#FFC107", "#FF9800", "#FF9800", "#FF5722", "#FF5722", "#795548", "#795548", "#9E9E9E", "#9E9E9E", "#607D8B", "#607D8B"], t.PALETTE_MATERIAL_CHROME = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"], t.rgbToHex = c, t.hslToRgb = u, t.rgbToHsl = h, t.rgbToHsv = function(e2, t2, r2) {
            var i2 = [a(e2, 0, 255) / 255, a(t2, 0, 255) / 255, a(r2, 0, 255) / 255];
            e2 = i2[0], t2 = i2[1], r2 = i2[2];
            var o2, n2 = Math.max(e2, t2, r2), s2 = Math.min(e2, t2, r2), l2 = void 0, c2 = n2, u2 = n2 - s2;
            if (o2 = 0 === n2 ? 0 : u2 / n2, n2 == s2)
              l2 = 0;
            else {
              switch (n2) {
                case e2:
                  l2 = (t2 - r2) / u2 + (t2 < r2 ? 6 : 0);
                  break;
                case t2:
                  l2 = (r2 - e2) / u2 + 2;
                  break;
                case r2:
                  l2 = (e2 - t2) / u2 + 4;
              }
              l2 /= 6;
            }
            return [l2, o2, c2];
          }, t.rgbToInt = p, t.intToRgb = function(e2) {
            return [e2 >> 16 & 255, e2 >> 8 & 255, 255 & e2];
          }, t.cssColorToRgb = d, t.cssColorToRgba = f, t.cssRgbToRgb = g, t.cssRgbaToRgba = b, t.parseColorToRgb = function(e2) {
            return Array.isArray(e2) ? e2 = [a(e2[0], 0, 255), a(e2[1], 0, 255), a(e2[2], 0, 255)] : d(e2) || g(e2);
          }, t.parseColorToRgba = v, t.cssHslToHsl = m, t.cssHslaToHsla = A, t.parseColorToHsl = function(e2) {
            return Array.isArray(e2) ? e2 = [a(e2[0], 0, 360), a(e2[1], 0, 100), a(e2[2], 0, 100)] : m(e2);
          }, t.parseColorToHsla = y, t.parseColor = function(e2, t2) {
            if (t2 = t2 || "rgb", null != e2) {
              var r2 = void 0;
              if ((r2 = v(e2)) || (r2 = y(e2)) && (r2 = [].concat(n(u.apply(void 0, n(r2))), [r2[3]])))
                return (0, o.default)(t2) ? ["rgb", "rgbcss", "rgbcss4", "rgba", "rgbacss", "hsl", "hslcss", "hslcss4", "hsla", "hslacss", "hex", "hexcss4", "int"].reduce(function(e3, t3) {
                  return e3[t3] = k(r2, t3), e3;
                }, t2 || {}) : k(r2, t2.toString().toLowerCase());
            }
          }, t.getLuminance = function(e2, t2, r2) {
            return 0.2126 * (e2 = (e2 /= 255) < 0.03928 ? e2 / 12.92 : Math.pow((e2 + 0.055) / 1.055, 2.4)) + 0.7152 * (t2 = (t2 /= 255) < 0.03928 ? t2 / 12.92 : Math.pow((t2 + 0.055) / 1.055, 2.4)) + 0.0722 * ((r2 /= 255) < 0.03928 ? r2 / 12.92 : Math.pow((r2 + 0.055) / 1.055, 2.4));
          }, t.limit = a, t.ensureArray = function(e2) {
            return e2 ? Array.from(e2) : [];
          }, t.nvl = l;
        }, function(e, t, r) {
          "use strict";
          e.exports = function(e2) {
            return null != e2 && "object" == typeof e2 && false === Array.isArray(e2);
          };
        }, function(e, t) {
          e.exports = '<div class="a-color-picker-row a-color-picker-stack a-color-picker-row-top"> <canvas class="a-color-picker-sl a-color-picker-transparent"></canvas> <div class=a-color-picker-dot></div> </div> <div class=a-color-picker-row> <div class="a-color-picker-stack a-color-picker-transparent a-color-picker-circle"> <div class=a-color-picker-preview> <input class=a-color-picker-clipbaord type=text> </div> </div> <div class=a-color-picker-column> <div class="a-color-picker-cell a-color-picker-stack"> <canvas class=a-color-picker-h></canvas> <div class=a-color-picker-dot></div> </div> <div class="a-color-picker-cell a-color-picker-alpha a-color-picker-stack" show-on-alpha> <canvas class="a-color-picker-a a-color-picker-transparent"></canvas> <div class=a-color-picker-dot></div> </div> </div> </div> <div class="a-color-picker-row a-color-picker-hsl" show-on-hsl> <label>H</label> <input nameref=H type=number maxlength=3 min=0 max=360 value=0> <label>S</label> <input nameref=S type=number maxlength=3 min=0 max=100 value=0> <label>L</label> <input nameref=L type=number maxlength=3 min=0 max=100 value=0> </div> <div class="a-color-picker-row a-color-picker-rgb" show-on-rgb> <label>R</label> <input nameref=R type=number maxlength=3 min=0 max=255 value=0> <label>G</label> <input nameref=G type=number maxlength=3 min=0 max=255 value=0> <label>B</label> <input nameref=B type=number maxlength=3 min=0 max=255 value=0> </div> <div class="a-color-picker-row a-color-picker-rgbhex a-color-picker-single-input" show-on-single-input> <label>HEX</label> <input nameref=RGBHEX type=text select-on-focus> </div> <div class="a-color-picker-row a-color-picker-palette"></div>';
        }, function(e, t, r) {
          var i = r(6);
          e.exports = "string" == typeof i ? i : i.toString();
        }, function(e, t, r) {
          (e.exports = r(7)(false)).push([e.i, "/*!\n * a-color-picker\n * https://github.com/narsenico/a-color-picker\n *\n * Copyright (c) 2017-2018, Gianfranco Caldi.\n * Released under the MIT License.\n */.a-color-picker{background-color:#fff;padding:0;display:inline-flex;flex-direction:column;user-select:none;width:232px;font:400 10px Helvetica,Arial,sans-serif;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.25)}.a-color-picker,.a-color-picker-row,.a-color-picker input{box-sizing:border-box}.a-color-picker-row{padding:15px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;user-select:none}.a-color-picker-row-top{padding:0}.a-color-picker-row:not(:first-child){border-top:1px solid #f5f5f5}.a-color-picker-column{display:flex;flex-direction:column}.a-color-picker-cell{flex:1 1 auto;margin-bottom:4px}.a-color-picker-cell:last-child{margin-bottom:0}.a-color-picker-stack{position:relative}.a-color-picker-dot{position:absolute;width:14px;height:14px;top:0;left:0;background:#fff;pointer-events:none;border-radius:50px;z-index:1000;box-shadow:0 1px 2px rgba(0,0,0,.75)}.a-color-picker-a,.a-color-picker-h,.a-color-picker-sl{cursor:cell}.a-color-picker-a+.a-color-picker-dot,.a-color-picker-h+.a-color-picker-dot{top:-2px}.a-color-picker-a,.a-color-picker-h{border-radius:2px}.a-color-picker-preview{box-sizing:border-box;width:30px;height:30px;user-select:none;border-radius:15px}.a-color-picker-circle{border-radius:50px;border:1px solid #eee}.a-color-picker-hsl,.a-color-picker-rgb,.a-color-picker-single-input{justify-content:space-evenly}.a-color-picker-hsl>label,.a-color-picker-rgb>label,.a-color-picker-single-input>label{padding:0 8px;flex:0 0 auto;color:#969696}.a-color-picker-hsl>input,.a-color-picker-rgb>input,.a-color-picker-single-input>input{text-align:center;padding:2px 0;width:0;flex:1 1 auto;border:1px solid #e0e0e0;line-height:20px}.a-color-picker-hsl>input::-webkit-inner-spin-button,.a-color-picker-rgb>input::-webkit-inner-spin-button,.a-color-picker-single-input>input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.a-color-picker-hsl>input:focus,.a-color-picker-rgb>input:focus,.a-color-picker-single-input>input:focus{border-color:#04a9f4;outline:none}.a-color-picker-transparent{background-image:linear-gradient(-45deg,#cdcdcd 25%,transparent 0),linear-gradient(45deg,#cdcdcd 25%,transparent 0),linear-gradient(-45deg,transparent 75%,#cdcdcd 0),linear-gradient(45deg,transparent 75%,#cdcdcd 0);background-size:11px 11px;background-position:0 0,0 -5.5px,-5.5px 5.5px,5.5px 0}.a-color-picker-sl{border-radius:3px 3px 0 0}.a-color-picker.hide-alpha [show-on-alpha],.a-color-picker.hide-hsl [show-on-hsl],.a-color-picker.hide-rgb [show-on-rgb],.a-color-picker.hide-single-input [show-on-single-input]{display:none}.a-color-picker-clipbaord{width:100%;height:100%;opacity:0;cursor:pointer}.a-color-picker-palette{flex-flow:wrap;flex-direction:row;justify-content:flex-start;padding:10px}.a-color-picker-palette-color{width:15px;height:15px;flex:0 1 15px;margin:3px;box-sizing:border-box;cursor:pointer;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.a-color-picker-palette-add{text-align:center;line-height:13px;color:#607d8b}.a-color-picker.hidden{display:none}", ""]);
        }, function(e, t) {
          e.exports = function(e2) {
            var t2 = [];
            return t2.toString = function() {
              return this.map(function(t3) {
                var r = function(e3, t4) {
                  var r2 = e3[1] || "", i = e3[3];
                  if (!i)
                    return r2;
                  if (t4 && "function" == typeof btoa) {
                    var o = function(e4) {
                      return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(e4)))) + " */";
                    }(i), n = i.sources.map(function(e4) {
                      return "/*# sourceURL=" + i.sourceRoot + e4 + " */";
                    });
                    return [r2].concat(n).concat([o]).join("\n");
                  }
                  return [r2].join("\n");
                }(t3, e2);
                return t3[2] ? "@media " + t3[2] + "{" + r + "}" : r;
              }).join("");
            }, t2.i = function(e3, r) {
              "string" == typeof e3 && (e3 = [[null, e3, ""]]);
              for (var i = {}, o = 0; o < this.length; o++) {
                var n = this[o][0];
                "number" == typeof n && (i[n] = true);
              }
              for (o = 0; o < e3.length; o++) {
                var s = e3[o];
                "number" == typeof s[0] && i[s[0]] || (r && !s[2] ? s[2] = r : r && (s[2] = "(" + s[2] + ") and (" + r + ")"), t2.push(s));
              }
            }, t2;
          };
        }]);
      });
    }
  });

  // resources/ts/element/ColorElement.ts
  var AColorPicker, ColorElement;
  var init_ColorElement = __esm({
    "resources/ts/element/ColorElement.ts"() {
      AColorPicker = __toESM(require_acolorpicker());
      init_u();
      ColorElement = class {
        init(pen, color) {
          this.pen = pen;
          this.ele = document.querySelector("#pen-color");
          AColorPicker.from("div#pen-color", {
            "color": color
          })[0].on("change", (picker, color2) => this.changed(picker, color2));
        }
        changed(picker, color) {
          this.pen.opt.color = toRgbHex(color);
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
      init_u();
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
          pd(`${dev}-down(${x},${y})=${this.nowsensor}`);
          this.nowsensor = dev;
          this.status.draw.startStroke();
          this.status.longpress.start(this.element.wrapdiv, x, y, this.action.zoomscroll);
        }
        move(dev, e, p) {
          e.preventDefault();
          const x = p.x;
          const y = p.y;
          pd(`${dev}-move(${x},${y})=${this.nowsensor}`);
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
          pd(`${dev}-up(${x},${y})=${this.nowsensor}`);
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
 * a-color-picker
 * https://github.com/narsenico/a-color-picker
 *
 * Copyright (c) 2017-2019, Gianfranco Caldi.
 * Released under the MIT License.
 */
/*!
 * a-color-picker (https://github.com/narsenico/a-color-picker)
 * 
 * Copyright (c) 2017-2018, Gianfranco Caldi.
 * Released under the MIT License.
 */
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*!
* sweetalert2 v11.4.26
* Released under the MIT License.
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvUGFwZXJFbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9kYXRhL0RyYXcudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd01pbmUudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd090aGVyLnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9zd2VldGFsZXJ0Mi9kaXN0L3N3ZWV0YWxlcnQyLmFsbC5qcyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvdS91LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvTW91c2VTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL3NlbnNvci9Qb2ludGVyU2Vuc29yLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9zZW5zb3IvVG91Y2hTZW5zb3IudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvU2F2ZUVsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9Mb2FkQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0RyYXdjYW52YXNlc0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2RhdGEvRHJhd1N0YXR1cy50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZGF0YS9Mb25ncHJlc3NTdGF0dXMudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9QZW5BY3Rpb24udHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2VsZW1lbnQvVW5kb0VsZW1lbnQudHMiLCAiLi4vLi4vcmVzb3VyY2VzL3RzL2FjdGlvbi9ab29tU2Nyb2xsQWN0aW9uLnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L1pvb21FbGVtZW50LnRzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0VyYXNlckVsZW1lbnQudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2EtY29sb3ItcGlja2VyL2Rpc3QvYWNvbG9ycGlja2VyLmpzIiwgIi4uLy4uL3Jlc291cmNlcy90cy9lbGVtZW50L0NvbG9yRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvZWxlbWVudC9CYWNrRWxlbWVudC50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvRHJhd0V2ZW50SGFuZGxlci50cyIsICIuLi8uLi9yZXNvdXJjZXMvdHMvYXBwLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJcbmV4cG9ydCBjbGFzcyBQYXBlckVsZW1lbnQge1xuICAgIHByaXZhdGUgY252OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgcHVibGljIHN0YXRpYyBtYWtlTWluZSgpOiBQYXBlckVsZW1lbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBhcGVyRWxlbWVudChcIiNteWNhbnZhc1wiKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBtYWtlT3RoZXIoKTogUGFwZXJFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXBlckVsZW1lbnQoXCIjb3RoZXJjYW52YXNcIik7XG4gICAgfVxuICAgIHByaXZhdGUgY29uc3RydWN0b3Ioc2VsZWN0b3I6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNudiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY252LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q3R4KCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eDtcbiAgICB9XG4gICAgcHVibGljIGdldENudigpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNudjtcbiAgICB9XG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB3OiBudW1iZXIgPSB0aGlzLmNudi53aWR0aDtcbiAgICAgICAgY29uc3QgaDogbnVtYmVyID0gdGhpcy5jbnYuaGVpZ2h0O1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XG4gICAgfVxufVxuIiwgImV4cG9ydCBjbGFzcyBEcmF3IHtcbiAgICBwcml2YXRlIHVzZXJfaWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHM6IFN0cm9rZVtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnMgPSBbXTtcbiAgICB9XG4gICAgcHVibGljIHB1c2gocDogU3Ryb2tlKTogdm9pZCB7XG4gICAgICAgIHRoaXMucy5wdXNoKHApO1xuICAgIH1cbiAgICBwdWJsaWMgcG9wKCk6IFN0cm9rZSB8IG51bGwge1xuICAgICAgICBjb25zdCByZXQ6IFN0cm9rZSA9IHRoaXMucy5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIHBlZWsoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJldDogU3Ryb2tlID0gdGhpcy5zLmxlbmd0aCA+IDAgPyB0aGlzLnNbdGhpcy5zLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIGdldFN0cm9rZXMoKTogU3Ryb2tlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zO1xuICAgIH1cbiAgICBwdWJsaWMgbGFzdFN0cm9rZXMoKTogU3Ryb2tlIHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc1t0aGlzLnMubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGpzb24oKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5zKSB7XG4gICAgICAgICAgICByZXQucHVzaChwLmpzb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBbJHtyZXQuam9pbihcIixcIil9XWA7XG4gICAgfVxuICAgIHB1YmxpYyBwYXJzZShzdHJva2VzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IG5ldyBTdHJva2UoKTtcbiAgICAgICAgICAgIHRtcC5wYXJzZShzWzBdLCBzWzFdKTtcbiAgICAgICAgICAgIHRoaXMucy5wdXNoKHRtcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5zLmxlbmd0aDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3Ryb2tlIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRLX0VSQVNFUiA9IFwiZVwiO1xuXG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmc7IC8vIFx1NkQ4OFx1MzA1N1x1MzBCNFx1MzBFMFx1MzA2RVx1NTgzNFx1NTQwOFx1MzA2RmVcdTMwNkVcdTMwN0ZcbiAgICBwcml2YXRlIHA6IFBvaW50W107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucCA9IFtdO1xuICAgIH1cbiAgICBwdWJsaWMgcHVzaChwOiBQb2ludCk6IHZvaWQge1xuICAgICAgICB0aGlzLnAucHVzaChwKTtcbiAgICB9XG4gICAgcHVibGljIGdldFBvaW50cygpOiBQb2ludFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucDtcbiAgICB9XG4gICAgcHVibGljIGxhc3RQb2ludCgpOiBQb2ludCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5wLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wW3RoaXMucC5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucCA9IFtdO1xuICAgIH1cbiAgICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnAubGVuZ3RoO1xuICAgIH1cbiAgICBwdWJsaWMganNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnApIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHAuanNvbigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYFtcIiR7dGhpcy5jb2xvcn1cIixbJHtyZXQuam9pbihcIixcIil9XV1gO1xuICAgIH1cbiAgICBwdWJsaWMgcGFyc2UoY29sb3I6IHN0cmluZywgYXJyOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXJyKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IG5ldyBQb2ludChwYXJzZUludChhWzBdKSwgcGFyc2VJbnQoYVsxXSkpO1xuICAgICAgICAgICAgdGhpcy5wLnB1c2godG1wKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgaXNFcmFzZXIoKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHRoaXMuY29sb3IgPT09IFN0cm9rZS5US19FUkFTRVI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHB1YmxpYyBpc1BlbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRXJhc2VyKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHB1YmxpYyB4OiBudW1iZXI7XG4gICAgcHVibGljIHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBwdWJsaWMganNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXQgPSBgWyR7dGhpcy54fSwke3RoaXMueX1dYDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHVibGljIGlzU2FtZSh4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBjb25kMTogYm9vbGVhbiA9IHggPT09IHRoaXMueDtcbiAgICAgICAgY29uc3QgY29uZDI6IGJvb2xlYW4gPSB5ID09PSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBjb25kMSAmJiBjb25kMjtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhdywgU3Ryb2tlLCBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEcmF3TWluZSB7XG4gICAgcHJpdmF0ZSBkcmF3OiBEcmF3O1xuICAgIHByaXZhdGUgbm93c3Ryb2tlOiBTdHJva2U7XG4gICAgcHJpdmF0ZSB1c2VyX2lkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwYXBlcl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHJpdmF0ZSBzYXZlZFN0cm9rZTogU3Ryb2tlOyAvLyBcdTRGRERcdTVCNThcdTMwNTdcdTMwNUZcdTMwNjhcdTMwNERcdTMwNkVzdHJva2VcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xuICAgICAgICB0aGlzLm5vd3N0cm9rZSA9IG5ldyBTdHJva2UoKTtcbiAgICAgICAgdGhpcy51c2VyX2lkID0gbnVsbDtcbiAgICAgICAgY29uc3QgdXJsczogc3RyaW5nW10gPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBwYXBlcl9pZDogbnVtYmVyID0gcGFyc2VJbnQodXJsc1t1cmxzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdGhpcy5wYXBlcl9pZCA9IHBhcGVyX2lkO1xuICAgICAgICB0aGlzLnNhdmVkU3Ryb2tlID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbikge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaFBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmICh0aGlzLm5vd3N0cm9rZS5sZW5ndGgoKSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gXHU2NzAwXHU1MjFEXHUzMDZFXHU3MEI5XHUzMDZBXHUzMDg5Y29sb3JcdTMwNkVcdThBMkRcdTVCOUFcbiAgICAgICAgICAgIHRoaXMubm93c3Ryb2tlLmNvbG9yID0gdGhpcy5wZW4ub3B0LmVyYXNlciA/IFN0cm9rZS5US19FUkFTRVIgOiB0aGlzLnBlbi5vcHQuY29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcCA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgdGhpcy5ub3dzdHJva2UucHVzaChwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGFzdFBvaW50KCk6IFBvaW50IHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3N0cm9rZS5sYXN0UG9pbnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kU3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICAvLyBTdHJva2VcdTMwNENcdTdENDJcdTMwOEZcdTMwNjNcdTMwNUZcdTMwNkVcdTMwNjdkcmF3XHUzMDZCXHUzMEQ3XHUzMEMzXHUzMEI3XHUzMEU1XG4gICAgICAgIGlmICh0aGlzLm5vd3N0cm9rZS5sZW5ndGgoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZHJhdy5wdXNoKHRoaXMubm93c3Ryb2tlKTtcbiAgICAgICAgICAgIC8vIFx1NkIyMVx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2NnN0cm9rZVx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlxuICAgICAgICAgICAgdGhpcy5ub3dzdHJva2UgPSBuZXcgU3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFzeW5jIHNhdmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHVybHM6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgY29uc3QgcGFwZXJfaWQ6IG51bWJlciA9IHBhcnNlSW50KHVybHNbdXJscy5sZW5ndGggLSAxXSk7XG4gICAgICAgIGNvbnN0IHVybCA9IGAvYXBpL2RyYXcvJHtwYXBlcl9pZH1gO1xuICAgICAgICBjb25zdCBwb3N0ZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBwb3N0ZGF0YS5hcHBlbmQoXCJqc29uX2RyYXdcIiwgdGhpcy5kcmF3Lmpzb24oKSk7XG4gICAgICAgIHBvc3RkYXRhLmFwcGVuZChcInVzZXJfaWRcIiwgdGhpcy51c2VyX2lkKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uOiBSZXF1ZXN0SW5pdCA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBwb3N0ZGF0YSxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgb3B0aW9uKTtcbiAgICAgICAgY29uc3QgcmVzX3NhdmUgPSBKU09OLnBhcnNlKGF3YWl0IHJlc3BvbnNlLnRleHQoKSk7XG4gICAgICAgIGlmICh0aGlzLnVzZXJfaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXNlcl9pZCA9IHJlc19zYXZlLnVzZXJfaWQudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNhdmVkU3Ryb2tlID0gdGhpcy5kcmF3LnBlZWsoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgbG9hZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAvYXBpL2RyYXcvJHt0aGlzLnBhcGVyX2lkfS9taW5lLyR7dGhpcy51c2VyX2lkID09PSBudWxsID8gMCA6IHRoaXMudXNlcl9pZH1gO1xuICAgICAgICAgICAgY29uc3QgcG9zdGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIHBvc3RkYXRhLmFwcGVuZChcImpzb25fZHJhd1wiLCB0aGlzLmRyYXcuanNvbigpKTtcbiAgICAgICAgICAgIHBvc3RkYXRhLmFwcGVuZChcInVzZXJfaWRcIiwgdGhpcy51c2VyX2lkKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbjogUmVxdWVzdEluaXQgPSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBwb3N0ZGF0YSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb24pO1xuICAgICAgICAgICAgY29uc3QgcmVzX2xvYWQgPSBKU09OLnBhcnNlKGF3YWl0IHJlc3BvbnNlLnRleHQoKSk7XG5cbiAgICAgICAgICAgIGxldCBzdHJva2VzOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBkIG9mICg8YW55W10+cmVzX2xvYWQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKGQuanNvbl9kcmF3KTtcbiAgICAgICAgICAgICAgICBzdHJva2VzID0gc3Ryb2tlcy5jb25jYXQob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZHJhdy5wYXJzZShzdHJva2VzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcHVibGljIGFzeW5jIGxvYWRBeGlvcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyAgICAgY29uc3QgYXBpX2xvYWQ6IE15QXhpb3NBcGkgPSB3aW5kb3cuYXhpb3MuZ2V0KGAvYXBpL2RyYXcvJHt0aGlzLnBhcGVyX2lkfS9taW5lLyR7dGhpcy51c2VyX2lkID09PSBudWxsID8gMCA6IHRoaXMudXNlcl9pZH1gKTtcblxuICAgIC8vICAgICB0cnkge1xuICAgIC8vICAgICAgICAgY29uc3QgW3Jlc19sb2FkXSA9IGF3YWl0IHdpbmRvdy5heGlvcy5hbGwoW2FwaV9sb2FkXSk7XG4gICAgLy8gICAgICAgICBsZXQgc3Ryb2tlczogYW55W10gPSBbXTtcbiAgICAvLyAgICAgICAgIGZvciAoY29uc3QgZCBvZiAoPGFueVtdPnJlc19sb2FkLmRhdGEpKSB7XG4gICAgLy8gICAgICAgICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShkLmpzb25fZHJhdyk7XG4gICAgLy8gICAgICAgICAgICAgc3Ryb2tlcyA9IHN0cm9rZXMuY29uY2F0KG9iaik7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICB0aGlzLmRyYXcucGFyc2Uoc3Ryb2tlcyk7XG4gICAgLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1YmxpYyB1bmRvKCk6IFN0cm9rZVtdIHtcbiAgICAgICAgdGhpcy5kcmF3LmdldFN0cm9rZXMoKS5wb3AoKTtcbiAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5kcmF3LmdldFN0cm9rZXMoKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Tm93U3Ryb2tlKCk6IFN0cm9rZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3N0cm9rZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcdTRGRERcdTVCNThcdTMwNTdcdTMwNUZcdTMwQjlcdTMwQzhcdTMwRURcdTMwRkNcdTMwQUZcdTY1NzBcdTMwNENcdTZCNjNcdTMwNTdcdTMwNTFcdTMwOENcdTMwNzBcdTRGRERcdTVCNThcdTZFMDhcdTMwN0ZcdTMwMDJcdTU4OTdcdTMwNDhcdTMwOEJcdTMwNzBcdTMwNEJcdTMwOEFcdTMwNjdcdTMwNkZcdTMwNkFcdTMwNEZcdTMwMDF1bmRvXHUzMDY3XHU2RTFCXHUzMDhCXHU1ODM0XHU1NDA4XHUzMDgyXHUzMDQyXHUzMDhBXHUzMDAyXG4gICAgICovXG4gICAgcHVibGljIGlzU2F2ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJldDogYm9vbGVhbiA9IHRoaXMuc2F2ZWRTdHJva2UgPT09IHRoaXMuZHJhdy5wZWVrKCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXcsIFN0cm9rZSwgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBQZW5BY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1BlbkFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd090aGVyIHtcbiAgICBwcml2YXRlIGRyYXdzOiBEcmF3W107IC8vIFx1ODFFQVx1NTIwNlx1NEVFNVx1NTkxNlx1RkYxRFx1ODkwN1x1NjU3MFx1NEVCQVx1MzA2RVx1MzBDN1x1MzBGQ1x1MzBCRlx1MzA0Q1x1MzA0Mlx1MzA4Qlx1MzA1Rlx1MzA4MVxuICAgIHByaXZhdGUgcGFwZXJfaWQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHBlbjogUGVuQWN0aW9uO1xuICAgIHByaXZhdGUgdXNlcl9pZDogbnVtYmVyIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRyYXdzID0gW107XG4gICAgICAgIHRoaXMudXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGNvbnN0IHVybHM6IHN0cmluZ1tdID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgY29uc3QgcGFwZXJfaWQ6IG51bWJlciA9IHBhcnNlSW50KHVybHNbdXJscy5sZW5ndGggLSAxXSk7XG4gICAgICAgIHRoaXMucGFwZXJfaWQgPSBwYXBlcl9pZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChwZW46IFBlbkFjdGlvbikge1xuICAgICAgICB0aGlzLnBlbiA9IHBlbjtcbiAgICB9XG4gICAgcHVibGljIGFzeW5jIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAvYXBpL2RyYXcvJHt0aGlzLnBhcGVyX2lkfS9vdGhlci8ke3RoaXMudXNlcl9pZCA9PT0gbnVsbCA/IDAgOiB0aGlzLnVzZXJfaWR9YDtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgICAgIGZvcihjb25zdCBkIG9mIEpTT04ucGFyc2UodGV4dCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoZC5qc29uX2RyYXcpO1xuICAgICAgICAgICAgY29uc3QgZHJhdyA9IG5ldyBEcmF3KCk7XG4gICAgICAgICAgICBkcmF3LnBhcnNlKG9iaik7XG4gICAgICAgICAgICB0aGlzLmRyYXdzLnB1c2goZHJhdyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RHJhd3MoKTogRHJhd1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd3M7XG4gICAgfVxufVxuIiwgIi8qIVxuKiBzd2VldGFsZXJ0MiB2MTEuNC4yNlxuKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5Td2VldGFsZXJ0MiA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGNvbnN0IGNvbnNvbGVQcmVmaXggPSAnU3dlZXRBbGVydDI6JztcbiAgLyoqXG4gICAqIEZpbHRlciB0aGUgdW5pcXVlIHZhbHVlcyBpbnRvIGEgbmV3IGFycmF5XG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqL1xuXG4gIGNvbnN0IHVuaXF1ZUFycmF5ID0gYXJyID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVzdWx0LmluZGV4T2YoYXJyW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXJyW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQ2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIGEgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgY29uc3QgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyID0gc3RyID0+IHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgLyoqXG4gICAqIFN0YW5kYXJkaXplIGNvbnNvbGUgd2FybmluZ3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBBcnJheX0gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCB3YXJuID0gbWVzc2FnZSA9PiB7XG4gICAgY29uc29sZS53YXJuKFwiXCIuY29uY2F0KGNvbnNvbGVQcmVmaXgsIFwiIFwiKS5jb25jYXQodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnID8gbWVzc2FnZS5qb2luKCcgJykgOiBtZXNzYWdlKSk7XG4gIH07XG4gIC8qKlxuICAgKiBTdGFuZGFyZGl6ZSBjb25zb2xlIGVycm9yc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCBlcnJvciA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJcIi5jb25jYXQoY29uc29sZVByZWZpeCwgXCIgXCIpLmNvbmNhdChtZXNzYWdlKSk7XG4gIH07XG4gIC8qKlxuICAgKiBQcml2YXRlIGdsb2JhbCBzdGF0ZSBmb3IgYHdhcm5PbmNlYFxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGNvbnN0IHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcyA9IFtdO1xuICAvKipcbiAgICogU2hvdyBhIGNvbnNvbGUgd2FybmluZywgYnV0IG9ubHkgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzaG93blxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cblxuICBjb25zdCB3YXJuT25jZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmICghcHJldmlvdXNXYXJuT25jZU1lc3NhZ2VzLmluY2x1ZGVzKG1lc3NhZ2UpKSB7XG4gICAgICBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgIHdhcm4obWVzc2FnZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogU2hvdyBhIG9uZS10aW1lIGNvbnNvbGUgd2FybmluZyBhYm91dCBkZXByZWNhdGVkIHBhcmFtcy9tZXRob2RzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXByZWNhdGVkUGFyYW1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZUluc3RlYWRcbiAgICovXG5cbiAgY29uc3Qgd2FybkFib3V0RGVwcmVjYXRpb24gPSAoZGVwcmVjYXRlZFBhcmFtLCB1c2VJbnN0ZWFkKSA9PiB7XG4gICAgd2Fybk9uY2UoXCJcXFwiXCIuY29uY2F0KGRlcHJlY2F0ZWRQYXJhbSwgXCJcXFwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciByZWxlYXNlLiBQbGVhc2UgdXNlIFxcXCJcIikuY29uY2F0KHVzZUluc3RlYWQsIFwiXFxcIiBpbnN0ZWFkLlwiKSk7XG4gIH07XG4gIC8qKlxuICAgKiBJZiBgYXJnYCBpcyBhIGZ1bmN0aW9uLCBjYWxsIGl0ICh3aXRoIG5vIGFyZ3VtZW50cyBvciBjb250ZXh0KSBhbmQgcmV0dXJuIHRoZSByZXN1bHQuXG4gICAqIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb24gfCBhbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cblxuICBjb25zdCBjYWxsSWZGdW5jdGlvbiA9IGFyZyA9PiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nID8gYXJnKCkgOiBhcmc7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBoYXNUb1Byb21pc2VGbiA9IGFyZyA9PiBhcmcgJiYgdHlwZW9mIGFyZy50b1Byb21pc2UgPT09ICdmdW5jdGlvbic7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gYXJnXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cblxuICBjb25zdCBhc1Byb21pc2UgPSBhcmcgPT4gaGFzVG9Qcm9taXNlRm4oYXJnKSA/IGFyZy50b1Byb21pc2UoKSA6IFByb21pc2UucmVzb2x2ZShhcmcpO1xuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGFyZ1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNQcm9taXNlID0gYXJnID0+IGFyZyAmJiBQcm9taXNlLnJlc29sdmUoYXJnKSA9PT0gYXJnO1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuXG4gIGNvbnN0IGdldFJhbmRvbUVsZW1lbnQgPSBhcnIgPT4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgIHRpdGxlOiAnJyxcbiAgICB0aXRsZVRleHQ6ICcnLFxuICAgIHRleHQ6ICcnLFxuICAgIGh0bWw6ICcnLFxuICAgIGZvb3RlcjogJycsXG4gICAgaWNvbjogdW5kZWZpbmVkLFxuICAgIGljb25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGljb25IdG1sOiB1bmRlZmluZWQsXG4gICAgdGVtcGxhdGU6IHVuZGVmaW5lZCxcbiAgICB0b2FzdDogZmFsc2UsXG4gICAgc2hvd0NsYXNzOiB7XG4gICAgICBwb3B1cDogJ3N3YWwyLXNob3cnLFxuICAgICAgYmFja2Ryb3A6ICdzd2FsMi1iYWNrZHJvcC1zaG93JyxcbiAgICAgIGljb246ICdzd2FsMi1pY29uLXNob3cnXG4gICAgfSxcbiAgICBoaWRlQ2xhc3M6IHtcbiAgICAgIHBvcHVwOiAnc3dhbDItaGlkZScsXG4gICAgICBiYWNrZHJvcDogJ3N3YWwyLWJhY2tkcm9wLWhpZGUnLFxuICAgICAgaWNvbjogJ3N3YWwyLWljb24taGlkZSdcbiAgICB9LFxuICAgIGN1c3RvbUNsYXNzOiB7fSxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBjb2xvcjogdW5kZWZpbmVkLFxuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGhlaWdodEF1dG86IHRydWUsXG4gICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgYWxsb3dFc2NhcGVLZXk6IHRydWUsXG4gICAgYWxsb3dFbnRlcktleTogdHJ1ZSxcbiAgICBzdG9wS2V5ZG93blByb3BhZ2F0aW9uOiB0cnVlLFxuICAgIGtleWRvd25MaXN0ZW5lckNhcHR1cmU6IGZhbHNlLFxuICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgIHNob3dEZW55QnV0dG9uOiBmYWxzZSxcbiAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICBwcmVDb25maXJtOiB1bmRlZmluZWQsXG4gICAgcHJlRGVueTogdW5kZWZpbmVkLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgIGNvbmZpcm1CdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGNvbmZpcm1CdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGRlbnlCdXR0b25UZXh0OiAnTm8nLFxuICAgIGRlbnlCdXR0b25BcmlhTGFiZWw6ICcnLFxuICAgIGRlbnlCdXR0b25Db2xvcjogdW5kZWZpbmVkLFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgIGNhbmNlbEJ1dHRvbkFyaWFMYWJlbDogJycsXG4gICAgY2FuY2VsQnV0dG9uQ29sb3I6IHVuZGVmaW5lZCxcbiAgICBidXR0b25zU3R5bGluZzogdHJ1ZSxcbiAgICByZXZlcnNlQnV0dG9uczogZmFsc2UsXG4gICAgZm9jdXNDb25maXJtOiB0cnVlLFxuICAgIGZvY3VzRGVueTogZmFsc2UsXG4gICAgZm9jdXNDYW5jZWw6IGZhbHNlLFxuICAgIHJldHVybkZvY3VzOiB0cnVlLFxuICAgIHNob3dDbG9zZUJ1dHRvbjogZmFsc2UsXG4gICAgY2xvc2VCdXR0b25IdG1sOiAnJnRpbWVzOycsXG4gICAgY2xvc2VCdXR0b25BcmlhTGFiZWw6ICdDbG9zZSB0aGlzIGRpYWxvZycsXG4gICAgbG9hZGVySHRtbDogJycsXG4gICAgc2hvd0xvYWRlck9uQ29uZmlybTogZmFsc2UsXG4gICAgc2hvd0xvYWRlck9uRGVueTogZmFsc2UsXG4gICAgaW1hZ2VVcmw6IHVuZGVmaW5lZCxcbiAgICBpbWFnZVdpZHRoOiB1bmRlZmluZWQsXG4gICAgaW1hZ2VIZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBpbWFnZUFsdDogJycsXG4gICAgdGltZXI6IHVuZGVmaW5lZCxcbiAgICB0aW1lclByb2dyZXNzQmFyOiBmYWxzZSxcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIHBhZGRpbmc6IHVuZGVmaW5lZCxcbiAgICBiYWNrZ3JvdW5kOiB1bmRlZmluZWQsXG4gICAgaW5wdXQ6IHVuZGVmaW5lZCxcbiAgICBpbnB1dFBsYWNlaG9sZGVyOiAnJyxcbiAgICBpbnB1dExhYmVsOiAnJyxcbiAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICBpbnB1dE9wdGlvbnM6IHt9LFxuICAgIGlucHV0QXV0b1RyaW06IHRydWUsXG4gICAgaW5wdXRBdHRyaWJ1dGVzOiB7fSxcbiAgICBpbnB1dFZhbGlkYXRvcjogdW5kZWZpbmVkLFxuICAgIHJldHVybklucHV0VmFsdWVPbkRlbnk6IGZhbHNlLFxuICAgIHZhbGlkYXRpb25NZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgZ3JvdzogZmFsc2UsXG4gICAgcG9zaXRpb246ICdjZW50ZXInLFxuICAgIHByb2dyZXNzU3RlcHM6IFtdLFxuICAgIGN1cnJlbnRQcm9ncmVzc1N0ZXA6IHVuZGVmaW5lZCxcbiAgICBwcm9ncmVzc1N0ZXBzRGlzdGFuY2U6IHVuZGVmaW5lZCxcbiAgICB3aWxsT3BlbjogdW5kZWZpbmVkLFxuICAgIGRpZE9wZW46IHVuZGVmaW5lZCxcbiAgICBkaWRSZW5kZXI6IHVuZGVmaW5lZCxcbiAgICB3aWxsQ2xvc2U6IHVuZGVmaW5lZCxcbiAgICBkaWRDbG9zZTogdW5kZWZpbmVkLFxuICAgIGRpZERlc3Ryb3k6IHVuZGVmaW5lZCxcbiAgICBzY3JvbGxiYXJQYWRkaW5nOiB0cnVlXG4gIH07XG4gIGNvbnN0IHVwZGF0YWJsZVBhcmFtcyA9IFsnYWxsb3dFc2NhcGVLZXknLCAnYWxsb3dPdXRzaWRlQ2xpY2snLCAnYmFja2dyb3VuZCcsICdidXR0b25zU3R5bGluZycsICdjYW5jZWxCdXR0b25BcmlhTGFiZWwnLCAnY2FuY2VsQnV0dG9uQ29sb3InLCAnY2FuY2VsQnV0dG9uVGV4dCcsICdjbG9zZUJ1dHRvbkFyaWFMYWJlbCcsICdjbG9zZUJ1dHRvbkh0bWwnLCAnY29sb3InLCAnY29uZmlybUJ1dHRvbkFyaWFMYWJlbCcsICdjb25maXJtQnV0dG9uQ29sb3InLCAnY29uZmlybUJ1dHRvblRleHQnLCAnY3VycmVudFByb2dyZXNzU3RlcCcsICdjdXN0b21DbGFzcycsICdkZW55QnV0dG9uQXJpYUxhYmVsJywgJ2RlbnlCdXR0b25Db2xvcicsICdkZW55QnV0dG9uVGV4dCcsICdkaWRDbG9zZScsICdkaWREZXN0cm95JywgJ2Zvb3RlcicsICdoaWRlQ2xhc3MnLCAnaHRtbCcsICdpY29uJywgJ2ljb25Db2xvcicsICdpY29uSHRtbCcsICdpbWFnZUFsdCcsICdpbWFnZUhlaWdodCcsICdpbWFnZVVybCcsICdpbWFnZVdpZHRoJywgJ3ByZUNvbmZpcm0nLCAncHJlRGVueScsICdwcm9ncmVzc1N0ZXBzJywgJ3JldHVybkZvY3VzJywgJ3JldmVyc2VCdXR0b25zJywgJ3Nob3dDYW5jZWxCdXR0b24nLCAnc2hvd0Nsb3NlQnV0dG9uJywgJ3Nob3dDb25maXJtQnV0dG9uJywgJ3Nob3dEZW55QnV0dG9uJywgJ3RleHQnLCAndGl0bGUnLCAndGl0bGVUZXh0JywgJ3dpbGxDbG9zZSddO1xuICBjb25zdCBkZXByZWNhdGVkUGFyYW1zID0ge307XG4gIGNvbnN0IHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zID0gWydhbGxvd091dHNpZGVDbGljaycsICdhbGxvd0VudGVyS2V5JywgJ2JhY2tkcm9wJywgJ2ZvY3VzQ29uZmlybScsICdmb2N1c0RlbnknLCAnZm9jdXNDYW5jZWwnLCAncmV0dXJuRm9jdXMnLCAnaGVpZ2h0QXV0bycsICdrZXlkb3duTGlzdGVuZXJDYXB0dXJlJ107XG4gIC8qKlxuICAgKiBJcyB2YWxpZCBwYXJhbWV0ZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNWYWxpZFBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZWZhdWx0UGFyYW1zLCBwYXJhbU5hbWUpO1xuICB9O1xuICAvKipcbiAgICogSXMgdmFsaWQgcGFyYW1ldGVyIGZvciBTd2FsLnVwZGF0ZSgpIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1OYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1VwZGF0YWJsZVBhcmFtZXRlciA9IHBhcmFtTmFtZSA9PiB7XG4gICAgcmV0dXJuIHVwZGF0YWJsZVBhcmFtcy5pbmRleE9mKHBhcmFtTmFtZSkgIT09IC0xO1xuICB9O1xuICAvKipcbiAgICogSXMgZGVwcmVjYXRlZCBwYXJhbWV0ZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfVxuICAgKi9cblxuICBjb25zdCBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIgPSBwYXJhbU5hbWUgPT4ge1xuICAgIHJldHVybiBkZXByZWNhdGVkUGFyYW1zW3BhcmFtTmFtZV07XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cbiAgY29uc3QgY2hlY2tJZlBhcmFtSXNWYWxpZCA9IHBhcmFtID0+IHtcbiAgICBpZiAoIWlzVmFsaWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICB3YXJuKFwiVW5rbm93biBwYXJhbWV0ZXIgXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cbiAgICovXG5cblxuICBjb25zdCBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQgPSBwYXJhbSA9PiB7XG4gICAgaWYgKHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgd2FybihcIlRoZSBwYXJhbWV0ZXIgXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiIGlzIGluY29tcGF0aWJsZSB3aXRoIHRvYXN0c1wiKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXG4gICAqL1xuXG5cbiAgY29uc3QgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkID0gcGFyYW0gPT4ge1xuICAgIGlmIChpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICB3YXJuQWJvdXREZXByZWNhdGlvbihwYXJhbSwgaXNEZXByZWNhdGVkUGFyYW1ldGVyKHBhcmFtKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogU2hvdyByZWxldmFudCB3YXJuaW5ncyBmb3IgZ2l2ZW4gcGFyYW1zXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvclBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgaWYgKCFwYXJhbXMuYmFja2Ryb3AgJiYgcGFyYW1zLmFsbG93T3V0c2lkZUNsaWNrKSB7XG4gICAgICB3YXJuKCdcImFsbG93T3V0c2lkZUNsaWNrXCIgcGFyYW1ldGVyIHJlcXVpcmVzIGBiYWNrZHJvcGAgcGFyYW1ldGVyIHRvIGJlIHNldCB0byBgdHJ1ZWAnKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBhcmFtIGluIHBhcmFtcykge1xuICAgICAgY2hlY2tJZlBhcmFtSXNWYWxpZChwYXJhbSk7XG5cbiAgICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgICAgY2hlY2tJZlRvYXN0UGFyYW1Jc1ZhbGlkKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkKHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3dhbFByZWZpeCA9ICdzd2FsMi0nO1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaXRlbXNcbiAgICogQHJldHVybnMge29iamVjdH1cbiAgICovXG5cbiAgY29uc3QgcHJlZml4ID0gaXRlbXMgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIGl0ZW1zKSB7XG4gICAgICByZXN1bHRbaXRlbXNbaV1dID0gc3dhbFByZWZpeCArIGl0ZW1zW2ldO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIGNvbnN0IHN3YWxDbGFzc2VzID0gcHJlZml4KFsnY29udGFpbmVyJywgJ3Nob3duJywgJ2hlaWdodC1hdXRvJywgJ2lvc2ZpeCcsICdwb3B1cCcsICdtb2RhbCcsICduby1iYWNrZHJvcCcsICduby10cmFuc2l0aW9uJywgJ3RvYXN0JywgJ3RvYXN0LXNob3duJywgJ3Nob3cnLCAnaGlkZScsICdjbG9zZScsICd0aXRsZScsICdodG1sLWNvbnRhaW5lcicsICdhY3Rpb25zJywgJ2NvbmZpcm0nLCAnZGVueScsICdjYW5jZWwnLCAnZGVmYXVsdC1vdXRsaW5lJywgJ2Zvb3RlcicsICdpY29uJywgJ2ljb24tY29udGVudCcsICdpbWFnZScsICdpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICdsYWJlbCcsICd0ZXh0YXJlYScsICdpbnB1dGVycm9yJywgJ2lucHV0LWxhYmVsJywgJ3ZhbGlkYXRpb24tbWVzc2FnZScsICdwcm9ncmVzcy1zdGVwcycsICdhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCcsICdwcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAtbGluZScsICdsb2FkZXInLCAnbG9hZGluZycsICdzdHlsZWQnLCAndG9wJywgJ3RvcC1zdGFydCcsICd0b3AtZW5kJywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdjZW50ZXInLCAnY2VudGVyLXN0YXJ0JywgJ2NlbnRlci1lbmQnLCAnY2VudGVyLWxlZnQnLCAnY2VudGVyLXJpZ2h0JywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnYm90dG9tLWVuZCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLCAnZ3Jvdy1yb3cnLCAnZ3Jvdy1jb2x1bW4nLCAnZ3Jvdy1mdWxsc2NyZWVuJywgJ3J0bCcsICd0aW1lci1wcm9ncmVzcy1iYXInLCAndGltZXItcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lcicsICdzY3JvbGxiYXItbWVhc3VyZScsICdpY29uLXN1Y2Nlc3MnLCAnaWNvbi13YXJuaW5nJywgJ2ljb24taW5mbycsICdpY29uLXF1ZXN0aW9uJywgJ2ljb24tZXJyb3InLCAnbm8td2FyJ10pO1xuICBjb25zdCBpY29uVHlwZXMgPSBwcmVmaXgoWydzdWNjZXNzJywgJ3dhcm5pbmcnLCAnaW5mbycsICdxdWVzdGlvbicsICdlcnJvciddKTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgcG9wdXAgY29udGFpbmVyIHdoaWNoIGNvbnRhaW5zIHRoZSBiYWNrZHJvcCBhbmQgdGhlIHBvcHVwIGl0c2VsZi5cbiAgICpcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q29udGFpbmVyID0gKCkgPT4gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb250YWluZXIpKTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclN0cmluZ1xuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBlbGVtZW50QnlTZWxlY3RvciA9IHNlbGVjdG9yU3RyaW5nID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICByZXR1cm4gY29udGFpbmVyID8gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JTdHJpbmcpIDogbnVsbDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZWxlbWVudEJ5Q2xhc3MgPSBjbGFzc05hbWUgPT4ge1xuICAgIHJldHVybiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoY2xhc3NOYW1lKSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuXG4gIGNvbnN0IGdldFBvcHVwID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMucG9wdXApO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SWNvbiA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmljb24pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy50aXRsZSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRIdG1sQ29udGFpbmVyID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW1hZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5pbWFnZSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRQcm9ncmVzc1N0ZXBzID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXBzJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0Q29uZmlybUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5hY3Rpb25zLCBcIiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb25maXJtKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXREZW55QnV0dG9uID0gKCkgPT4gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiIC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLmRlbnkpKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAqL1xuXG4gIGNvbnN0IGdldElucHV0TGFiZWwgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlc1snaW5wdXQtbGFiZWwnXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRMb2FkZXIgPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMubG9hZGVyKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDYW5jZWxCdXR0b24gPSAoKSA9PiBlbGVtZW50QnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCIgLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2FuY2VsKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRBY3Rpb25zID0gKCkgPT4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuYWN0aW9ucyk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRGb290ZXIgPSAoKSA9PiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5mb290ZXIpO1xuICAvKipcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0VGltZXJQcm9ncmVzc0JhciA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWyd0aW1lci1wcm9ncmVzcy1iYXInXSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICAgKi9cblxuICBjb25zdCBnZXRDbG9zZUJ1dHRvbiA9ICgpID0+IGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmNsb3NlKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2prdXAvZm9jdXNhYmxlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5cbiAgY29uc3QgZm9jdXNhYmxlID0gXCJcXG4gIGFbaHJlZl0sXFxuICBhcmVhW2hyZWZdLFxcbiAgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLFxcbiAgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSxcXG4gIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSxcXG4gIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksXFxuICBpZnJhbWUsXFxuICBvYmplY3QsXFxuICBlbWJlZCxcXG4gIFt0YWJpbmRleD1cXFwiMFxcXCJdLFxcbiAgW2NvbnRlbnRlZGl0YWJsZV0sXFxuICBhdWRpb1tjb250cm9sc10sXFxuICB2aWRlb1tjb250cm9sc10sXFxuICBzdW1tYXJ5XFxuXCI7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICovXG5cbiAgY29uc3QgZ2V0Rm9jdXNhYmxlRWxlbWVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXggPSBBcnJheS5mcm9tKGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbdGFiaW5kZXg9XCIwXCJdKScpKSAvLyBzb3J0IGFjY29yZGluZyB0byB0YWJpbmRleFxuICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCB0YWJpbmRleEEgPSBwYXJzZUludChhLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgICBjb25zdCB0YWJpbmRleEIgPSBwYXJzZUludChiLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG5cbiAgICAgIGlmICh0YWJpbmRleEEgPiB0YWJpbmRleEIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKHRhYmluZGV4QSA8IHRhYmluZGV4Qikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIGNvbnN0IG90aGVyRm9jdXNhYmxlRWxlbWVudHMgPSBBcnJheS5mcm9tKGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGUpKS5maWx0ZXIoZWwgPT4gZWwuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICE9PSAnLTEnKTtcbiAgICByZXR1cm4gdW5pcXVlQXJyYXkoZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXguY29uY2F0KG90aGVyRm9jdXNhYmxlRWxlbWVudHMpKS5maWx0ZXIoZWwgPT4gaXNWaXNpYmxlKGVsKSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNNb2RhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuc2hvd24pICYmICFoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSkgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddKTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc1RvYXN0ID0gKCkgPT4ge1xuICAgIHJldHVybiBnZXRQb3B1cCgpICYmIGhhc0NsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgfTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBpc0xvYWRpbmcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGdldFBvcHVwKCkuaGFzQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgfTtcblxuICBjb25zdCBzdGF0ZXMgPSB7XG4gICAgcHJldmlvdXNCb2R5UGFkZGluZzogbnVsbFxuICB9O1xuICAvKipcbiAgICogU2VjdXJlbHkgc2V0IGlubmVySFRNTCBvZiBhbiBlbGVtZW50XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTkyNlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gICAqL1xuXG4gIGNvbnN0IHNldElubmVySHRtbCA9IChlbGVtLCBodG1sKSA9PiB7XG4gICAgZWxlbS50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKGh0bWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIik7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgICBBcnJheS5mcm9tKHBhcnNlZC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCBoYXNDbGFzcyA9IChlbGVtLCBjbGFzc05hbWUpID0+IHtcbiAgICBpZiAoIWNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NMaXN0W2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW1vdmVDdXN0b21DbGFzc2VzID0gKGVsZW0sIHBhcmFtcykgPT4ge1xuICAgIEFycmF5LmZyb20oZWxlbS5jbGFzc0xpc3QpLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgIGlmICghT2JqZWN0LnZhbHVlcyhzd2FsQ2xhc3NlcykuaW5jbHVkZXMoY2xhc3NOYW1lKSAmJiAhT2JqZWN0LnZhbHVlcyhpY29uVHlwZXMpLmluY2x1ZGVzKGNsYXNzTmFtZSkgJiYgIU9iamVjdC52YWx1ZXMocGFyYW1zLnNob3dDbGFzcykuaW5jbHVkZXMoY2xhc3NOYW1lKSkge1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICovXG5cblxuICBjb25zdCBhcHBseUN1c3RvbUNsYXNzID0gKGVsZW0sIHBhcmFtcywgY2xhc3NOYW1lKSA9PiB7XG4gICAgcmVtb3ZlQ3VzdG9tQ2xhc3NlcyhlbGVtLCBwYXJhbXMpO1xuXG4gICAgaWYgKHBhcmFtcy5jdXN0b21DbGFzcyAmJiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSkge1xuICAgICAgaWYgKHR5cGVvZiBwYXJhbXMuY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSAhPT0gJ3N0cmluZycgJiYgIXBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdLmZvckVhY2gpIHtcbiAgICAgICAgcmV0dXJuIHdhcm4oXCJJbnZhbGlkIHR5cGUgb2YgY3VzdG9tQ2xhc3MuXCIuY29uY2F0KGNsYXNzTmFtZSwgXCIhIEV4cGVjdGVkIHN0cmluZyBvciBpdGVyYWJsZSBvYmplY3QsIGdvdCBcXFwiXCIpLmNvbmNhdCh0eXBlb2YgcGFyYW1zLmN1c3RvbUNsYXNzW2NsYXNzTmFtZV0sIFwiXFxcIlwiKSk7XG4gICAgICB9XG5cbiAgICAgIGFkZENsYXNzKGVsZW0sIHBhcmFtcy5jdXN0b21DbGFzc1tjbGFzc05hbWVdKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3B1cFxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi9yZW5kZXJlcnMvcmVuZGVySW5wdXQnKS5JbnB1dENsYXNzfSBpbnB1dENsYXNzXG4gICAqIEByZXR1cm5zIHtIVE1MSW5wdXRFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0SW5wdXQgPSAocG9wdXAsIGlucHV0Q2xhc3MpID0+IHtcbiAgICBpZiAoIWlucHV0Q2xhc3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaW5wdXRDbGFzcykge1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXNbaW5wdXRDbGFzc10pKTtcblxuICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiIGlucHV0XCIpKTtcblxuICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICByZXR1cm4gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiID4gLlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiIGlucHV0OmNoZWNrZWRcIikpIHx8IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpmaXJzdC1jaGlsZFwiKSk7XG5cbiAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgcmV0dXJuIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnBvcHVwLCBcIiA+IC5cIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBpbnB1dFwiKSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgPiAuXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCkpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudH0gaW5wdXRcbiAgICovXG5cbiAgY29uc3QgZm9jdXNJbnB1dCA9IGlucHV0ID0+IHtcbiAgICBpbnB1dC5mb2N1cygpOyAvLyBwbGFjZSBjdXJzb3IgYXQgZW5kIG9mIHRleHQgaW4gdGV4dCBpbnB1dFxuXG4gICAgaWYgKGlucHV0LnR5cGUgIT09ICdmaWxlJykge1xuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjM0NTkxNVxuICAgICAgY29uc3QgdmFsID0gaW5wdXQudmFsdWU7XG4gICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgaW5wdXQudmFsdWUgPSB2YWw7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QsIGNvbmRpdGlvbikgPT4ge1xuICAgIGlmICghdGFyZ2V0IHx8ICFjbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNsYXNzTGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNsYXNzTGlzdCA9IGNsYXNzTGlzdC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG5cbiAgICBjbGFzc0xpc3QuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICBjb25kaXRpb24gPyBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSA6IGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmRpdGlvbiA/IHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBudWxsfSB0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXSB8IHJlYWRvbmx5IHN0cmluZ1tdfSBjbGFzc0xpc3RcbiAgICovXG5cbiAgY29uc3QgYWRkQ2xhc3MgPSAodGFyZ2V0LCBjbGFzc0xpc3QpID0+IHtcbiAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgdHJ1ZSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IG51bGx9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgcmVhZG9ubHkgc3RyaW5nW119IGNsYXNzTGlzdFxuICAgKi9cblxuICBjb25zdCByZW1vdmVDbGFzcyA9ICh0YXJnZXQsIGNsYXNzTGlzdCkgPT4ge1xuICAgIHRvZ2dsZUNsYXNzKHRhcmdldCwgY2xhc3NMaXN0LCBmYWxzZSk7XG4gIH07XG4gIC8qKlxuICAgKiBHZXQgZGlyZWN0IGNoaWxkIG9mIGFuIGVsZW1lbnQgYnkgY2xhc3MgbmFtZVxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgY29uc3QgZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzID0gKGVsZW0sIGNsYXNzTmFtZSkgPT4ge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbGVtLmNoaWxkcmVuKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cbiAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGhhc0NsYXNzKGNoaWxkLCBjbGFzc05hbWUpKSB7XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuXG4gIGNvbnN0IGFwcGx5TnVtZXJpY2FsU3R5bGUgPSAoZWxlbSwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiLmNvbmNhdChwYXJzZUludCh2YWx1ZSkpKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgfHwgcGFyc2VJbnQodmFsdWUpID09PSAwKSB7XG4gICAgICBlbGVtLnN0eWxlW3Byb3BlcnR5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdCh2YWx1ZSwgXCJweFwiKSA6IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwbGF5XG4gICAqL1xuXG4gIGNvbnN0IHNob3cgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgIGxldCBkaXNwbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnZmxleCc7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG5cbiAgY29uc3QgaGlkZSA9IGVsZW0gPT4ge1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgKi9cblxuICBjb25zdCBzZXRTdHlsZSA9IChwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWUpID0+IHtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuICAgIGNvbnN0IGVsID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKGVsKSB7XG4gICAgICBlbC5zdHlsZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtXG4gICAqIEBwYXJhbSB7YW55fSBjb25kaXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRpc3BsYXlcbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlID0gZnVuY3Rpb24gKGVsZW0sIGNvbmRpdGlvbikge1xuICAgIGxldCBkaXNwbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnZmxleCc7XG4gICAgY29uZGl0aW9uID8gc2hvdyhlbGVtLCBkaXNwbGF5KSA6IGhpZGUoZWxlbSk7XG4gIH07XG4gIC8qKlxuICAgKiBib3Jyb3dlZCBmcm9tIGpxdWVyeSAkKGVsZW0pLmlzKCc6dmlzaWJsZScpIGltcGxlbWVudGF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGlzVmlzaWJsZSA9IGVsZW0gPT4gISEoZWxlbSAmJiAoZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLm9mZnNldEhlaWdodCB8fCBlbGVtLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgYWxsQnV0dG9uc0FyZUhpZGRlbiA9ICgpID0+ICFpc1Zpc2libGUoZ2V0Q29uZmlybUJ1dHRvbigpKSAmJiAhaXNWaXNpYmxlKGdldERlbnlCdXR0b24oKSkgJiYgIWlzVmlzaWJsZShnZXRDYW5jZWxCdXR0b24oKSk7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgY29uc3QgaXNTY3JvbGxhYmxlID0gZWxlbSA9PiAhIShlbGVtLnNjcm9sbEhlaWdodCA+IGVsZW0uY2xpZW50SGVpZ2h0KTtcbiAgLyoqXG4gICAqIGJvcnJvd2VkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ2MzUyMTE5XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGNvbnN0IGhhc0Nzc0FuaW1hdGlvbiA9IGVsZW0gPT4ge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgY29uc3QgYW5pbUR1cmF0aW9uID0gcGFyc2VGbG9hdChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdhbmltYXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIGNvbnN0IHRyYW5zRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zaXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICAgIHJldHVybiBhbmltRHVyYXRpb24gPiAwIHx8IHRyYW5zRHVyYXRpb24gPiAwO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzZXRcbiAgICovXG5cbiAgY29uc3QgYW5pbWF0ZVRpbWVyUHJvZ3Jlc3NCYXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICBsZXQgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG5cbiAgICBpZiAoaXNWaXNpYmxlKHRpbWVyUHJvZ3Jlc3NCYXIpKSB7XG4gICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGltZXJQcm9ncmVzc0Jhci5zdHlsZS50cmFuc2l0aW9uID0gXCJ3aWR0aCBcIi5jb25jYXQodGltZXIgLyAxMDAwLCBcInMgbGluZWFyXCIpO1xuICAgICAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHN0b3BUaW1lclByb2dyZXNzQmFyID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXIgPSBnZXRUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhcldpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUodGltZXJQcm9ncmVzc0Jhcikud2lkdGgpO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNvbnN0IHRpbWVyUHJvZ3Jlc3NCYXJGdWxsV2lkdGggPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aW1lclByb2dyZXNzQmFyKS53aWR0aCk7XG4gICAgY29uc3QgdGltZXJQcm9ncmVzc0JhclBlcmNlbnQgPSB0aW1lclByb2dyZXNzQmFyV2lkdGggLyB0aW1lclByb2dyZXNzQmFyRnVsbFdpZHRoICogMTAwO1xuICAgIHRpbWVyUHJvZ3Jlc3NCYXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24nKTtcbiAgICB0aW1lclByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQodGltZXJQcm9ncmVzc0JhclBlcmNlbnQsIFwiJVwiKTtcbiAgfTtcblxuICAvKipcbiAgICogRGV0ZWN0IE5vZGUgZW52XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgY29uc3QgaXNOb2RlRW52ID0gKCkgPT4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJztcblxuICBjb25zdCBSRVNUT1JFX0ZPQ1VTX1RJTUVPVVQgPSAxMDA7XG5cbiAgLyoqIEB0eXBlIHtHbG9iYWxTdGF0ZX0gKi9cblxuICBjb25zdCBnbG9iYWxTdGF0ZSA9IHt9O1xuXG4gIGNvbnN0IGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICBnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFJlc3RvcmUgcHJldmlvdXMgYWN0aXZlIChmb2N1c2VkKSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmV0dXJuRm9jdXNcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuXG5cbiAgY29uc3QgcmVzdG9yZUFjdGl2ZUVsZW1lbnQgPSByZXR1cm5Gb2N1cyA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCFyZXR1cm5Gb2N1cykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB4ID0gd2luZG93LnNjcm9sbFg7XG4gICAgICBjb25zdCB5ID0gd2luZG93LnNjcm9sbFk7XG4gICAgICBnbG9iYWxTdGF0ZS5yZXN0b3JlRm9jdXNUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50KCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0sIFJFU1RPUkVfRk9DVVNfVElNRU9VVCk7IC8vIGlzc3Vlcy85MDBcblxuICAgICAgd2luZG93LnNjcm9sbFRvKHgsIHkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN3ZWV0SFRNTCA9IFwiXFxuIDxkaXYgYXJpYS1sYWJlbGxlZGJ5PVxcXCJcIi5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBhcmlhLWRlc2NyaWJlZGJ5PVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWydodG1sLWNvbnRhaW5lciddLCBcIlxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucG9wdXAsIFwiXFxcIiB0YWJpbmRleD1cXFwiLTFcXFwiPlxcbiAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jbG9zZSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgIDx1bCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcHMnXSwgXCJcXFwiPjwvdWw+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pY29uLCBcIlxcXCI+PC9kaXY+XFxuICAgPGltZyBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbWFnZSwgXCJcXFwiIC8+XFxuICAgPGgyIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnRpdGxlLCBcIlxcXCIgaWQ9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIj48L2gyPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ2h0bWwtY29udGFpbmVyJ10sIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1snaHRtbC1jb250YWluZXInXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDxpbnB1dCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCwgXCJcXFwiIC8+XFxuICAgPGlucHV0IHR5cGU9XFxcImZpbGVcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmZpbGUsIFwiXFxcIiAvPlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiXFxcIj5cXG4gICAgIDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgLz5cXG4gICAgIDxvdXRwdXQ+PC9vdXRwdXQ+XFxuICAgPC9kaXY+XFxuICAgPHNlbGVjdCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5zZWxlY3QsIFwiXFxcIj48L3NlbGVjdD5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIlxcXCI+PC9kaXY+XFxuICAgPGxhYmVsIGZvcj1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCJcXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNoZWNrYm94LCBcIlxcXCI+XFxuICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIC8+XFxuICAgICA8c3BhbiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5sYWJlbCwgXCJcXFwiPjwvc3Bhbj5cXG4gICA8L2xhYmVsPlxcbiAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50ZXh0YXJlYSwgXCJcXFwiPjwvdGV4dGFyZWE+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10sIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmFjdGlvbnMsIFwiXFxcIj5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMubG9hZGVyLCBcIlxcXCI+PC9kaXY+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY29uZmlybSwgXCJcXFwiPjwvYnV0dG9uPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmRlbnksIFwiXFxcIj48L2J1dHRvbj5cXG4gICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jYW5jZWwsIFwiXFxcIj48L2J1dHRvbj5cXG4gICA8L2Rpdj5cXG4gICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmZvb3RlciwgXCJcXFwiPjwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXNbJ3RpbWVyLXByb2dyZXNzLWJhci1jb250YWluZXInXSwgXCJcXFwiPlxcbiAgICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sndGltZXItcHJvZ3Jlc3MtYmFyJ10sIFwiXFxcIj48L2Rpdj5cXG4gICA8L2Rpdj5cXG4gPC9kaXY+XFxuXCIpLnJlcGxhY2UoLyhefFxcbilcXHMqL2csICcnKTtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBjb25zdCByZXNldE9sZENvbnRhaW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBvbGRDb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcblxuICAgIGlmICghb2xkQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb2xkQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgIHJlbW92ZUNsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBbc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddLCBzd2FsQ2xhc3Nlc1snaGFzLWNvbHVtbiddXSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSA9ICgpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UucmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICB9O1xuXG4gIGNvbnN0IGFkZElucHV0Q2hhbmdlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgICBjb25zdCBpbnB1dCA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICAgIGNvbnN0IGZpbGUgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLmZpbGUpO1xuICAgIC8qKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH0gKi9cblxuICAgIGNvbnN0IHJhbmdlID0gcG9wdXAucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIGlucHV0XCIpKTtcbiAgICAvKiogQHR5cGUge0hUTUxPdXRwdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgcmFuZ2VPdXRwdXQgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgb3V0cHV0XCIpKTtcbiAgICBjb25zdCBzZWxlY3QgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNlbGVjdCk7XG4gICAgLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgY2hlY2tib3ggPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCIgaW5wdXRcIikpO1xuICAgIGNvbnN0IHRleHRhcmVhID0gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy50ZXh0YXJlYSk7XG4gICAgaW5wdXQub25pbnB1dCA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgZmlsZS5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgc2VsZWN0Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgICBjaGVja2JveC5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgdGV4dGFyZWEub25pbnB1dCA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG5cbiAgICByYW5nZS5vbmlucHV0ID0gKCkgPT4ge1xuICAgICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuICAgICAgcmFuZ2VPdXRwdXQudmFsdWUgPSByYW5nZS52YWx1ZTtcbiAgICB9O1xuXG4gICAgcmFuZ2Uub25jaGFuZ2UgPSAoKSA9PiB7XG4gICAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICAgIH07XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZyB8IEhUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGdldFRhcmdldCA9IHRhcmdldCA9PiB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KSA6IHRhcmdldDtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldHVwQWNjZXNzaWJpbGl0eSA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgncm9sZScsIHBhcmFtcy50b2FzdCA/ICdhbGVydCcgOiAnZGlhbG9nJyk7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCBwYXJhbXMudG9hc3QgPyAncG9saXRlJyA6ICdhc3NlcnRpdmUnKTtcblxuICAgIGlmICghcGFyYW1zLnRvYXN0KSB7XG4gICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnRcbiAgICovXG5cblxuICBjb25zdCBzZXR1cFJUTCA9IHRhcmdldEVsZW1lbnQgPT4ge1xuICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXRFbGVtZW50KS5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgICBhZGRDbGFzcyhnZXRDb250YWluZXIoKSwgc3dhbENsYXNzZXMucnRsKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBBZGQgbW9kYWwgKyBiYWNrZHJvcCArIG5vLXdhciBtZXNzYWdlIGZvciBSdXNzaWFucyB0byBET01cbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG5cbiAgY29uc3QgaW5pdCA9IHBhcmFtcyA9PiB7XG4gICAgLy8gQ2xlYW4gdXAgdGhlIG9sZCBwb3B1cCBjb250YWluZXIgaWYgaXQgZXhpc3RzXG4gICAgY29uc3Qgb2xkQ29udGFpbmVyRXhpc3RlZCA9IHJlc2V0T2xkQ29udGFpbmVyKCk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cbiAgICBpZiAoaXNOb2RlRW52KCkpIHtcbiAgICAgIGVycm9yKCdTd2VldEFsZXJ0MiByZXF1aXJlcyBkb2N1bWVudCB0byBpbml0aWFsaXplJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzLmNvbnRhaW5lcjtcblxuICAgIGlmIChvbGRDb250YWluZXJFeGlzdGVkKSB7XG4gICAgICBhZGRDbGFzcyhjb250YWluZXIsIHN3YWxDbGFzc2VzWyduby10cmFuc2l0aW9uJ10pO1xuICAgIH1cblxuICAgIHNldElubmVySHRtbChjb250YWluZXIsIHN3ZWV0SFRNTCk7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGdldFRhcmdldChwYXJhbXMudGFyZ2V0KTtcbiAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgc2V0dXBBY2Nlc3NpYmlsaXR5KHBhcmFtcyk7XG4gICAgc2V0dXBSVEwodGFyZ2V0RWxlbWVudCk7XG4gICAgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMoKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IG9iamVjdCB8IHN0cmluZ30gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuXG4gIGNvbnN0IHBhcnNlSHRtbFRvQ29udGFpbmVyID0gKHBhcmFtLCB0YXJnZXQpID0+IHtcbiAgICAvLyBET00gZWxlbWVudFxuICAgIGlmIChwYXJhbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocGFyYW0pO1xuICAgIH0gLy8gT2JqZWN0XG4gICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtID09PSAnb2JqZWN0Jykge1xuICAgICAgaGFuZGxlT2JqZWN0KHBhcmFtLCB0YXJnZXQpO1xuICAgIH0gLy8gUGxhaW4gc3RyaW5nXG4gICAgZWxzZSBpZiAocGFyYW0pIHtcbiAgICAgIHNldElubmVySHRtbCh0YXJnZXQsIHBhcmFtKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqL1xuXG4gIGNvbnN0IGhhbmRsZU9iamVjdCA9IChwYXJhbSwgdGFyZ2V0KSA9PiB7XG4gICAgLy8gSlF1ZXJ5IGVsZW1lbnQocylcbiAgICBpZiAocGFyYW0uanF1ZXJ5KSB7XG4gICAgICBoYW5kbGVKcXVlcnlFbGVtKHRhcmdldCwgcGFyYW0pO1xuICAgIH0gLy8gRm9yIG90aGVyIG9iamVjdHMgdXNlIHRoZWlyIHN0cmluZyByZXByZXNlbnRhdGlvblxuICAgIGVsc2Uge1xuICAgICAgc2V0SW5uZXJIdG1sKHRhcmdldCwgcGFyYW0udG9TdHJpbmcoKSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1cbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVKcXVlcnlFbGVtID0gKHRhcmdldCwgZWxlbSkgPT4ge1xuICAgIHRhcmdldC50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgaWYgKDAgaW4gZWxlbSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IChpIGluIGVsZW0pOyBpKyspIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW1baV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsZW0uY2xvbmVOb2RlKHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHsnd2Via2l0QW5pbWF0aW9uRW5kJyB8ICdhbmltYXRpb25lbmQnIHwgZmFsc2V9XG4gICAqL1xuXG4gIGNvbnN0IGFuaW1hdGlvbkVuZEV2ZW50ID0gKCgpID0+IHtcbiAgICAvLyBQcmV2ZW50IHJ1biBpbiBOb2RlIGVudlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGlzTm9kZUVudigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0QW5pbWF0aW9uOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgIC8vIENocm9tZSwgU2FmYXJpIGFuZCBPcGVyYVxuICAgICAgYW5pbWF0aW9uOiAnYW5pbWF0aW9uZW5kJyAvLyBTdGFuZGFyZCBzeW50YXhcblxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRyYW5zRW5kRXZlbnROYW1lcywgaSkgJiYgdHlwZW9mIHRlc3RFbC5zdHlsZVtpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zRW5kRXZlbnROYW1lc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKCk7XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgc2Nyb2xsYmFyIHdpZHRoIGZvciBwYWRkaW5nIGJvZHkgZHVyaW5nIG1vZGFsIHNob3cvaGlkZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvanMvc3JjL21vZGFsLmpzXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuXG4gIGNvbnN0IG1lYXN1cmVTY3JvbGxiYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzWydzY3JvbGxiYXItbWVhc3VyZSddO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyQWN0aW9ucyA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICBjb25zdCBsb2FkZXIgPSBnZXRMb2FkZXIoKTsgLy8gQWN0aW9ucyAoYnV0dG9ucykgd3JhcHBlclxuXG4gICAgaWYgKCFwYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gJiYgIXBhcmFtcy5zaG93RGVueUJ1dHRvbiAmJiAhcGFyYW1zLnNob3dDYW5jZWxCdXR0b24pIHtcbiAgICAgIGhpZGUoYWN0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3coYWN0aW9ucyk7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhhY3Rpb25zLCBwYXJhbXMsICdhY3Rpb25zJyk7IC8vIFJlbmRlciBhbGwgdGhlIGJ1dHRvbnNcblxuICAgIHJlbmRlckJ1dHRvbnMoYWN0aW9ucywgbG9hZGVyLCBwYXJhbXMpOyAvLyBMb2FkZXJcblxuICAgIHNldElubmVySHRtbChsb2FkZXIsIHBhcmFtcy5sb2FkZXJIdG1sKTtcbiAgICBhcHBseUN1c3RvbUNsYXNzKGxvYWRlciwgcGFyYW1zLCAnbG9hZGVyJyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBhY3Rpb25zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxvYWRlclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVuZGVyQnV0dG9ucyhhY3Rpb25zLCBsb2FkZXIsIHBhcmFtcykge1xuICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBnZXRDb25maXJtQnV0dG9uKCk7XG4gICAgY29uc3QgZGVueUJ1dHRvbiA9IGdldERlbnlCdXR0b24oKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBnZXRDYW5jZWxCdXR0b24oKTsgLy8gUmVuZGVyIGJ1dHRvbnNcblxuICAgIHJlbmRlckJ1dHRvbihjb25maXJtQnV0dG9uLCAnY29uZmlybScsIHBhcmFtcyk7XG4gICAgcmVuZGVyQnV0dG9uKGRlbnlCdXR0b24sICdkZW55JywgcGFyYW1zKTtcbiAgICByZW5kZXJCdXR0b24oY2FuY2VsQnV0dG9uLCAnY2FuY2VsJywgcGFyYW1zKTtcbiAgICBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcyk7XG5cbiAgICBpZiAocGFyYW1zLnJldmVyc2VCdXR0b25zKSB7XG4gICAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGNhbmNlbEJ1dHRvbiwgY29uZmlybUJ1dHRvbik7XG4gICAgICAgIGFjdGlvbnMuaW5zZXJ0QmVmb3JlKGRlbnlCdXR0b24sIGNvbmZpcm1CdXR0b24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9ucy5pbnNlcnRCZWZvcmUoY2FuY2VsQnV0dG9uLCBsb2FkZXIpO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShkZW55QnV0dG9uLCBsb2FkZXIpO1xuICAgICAgICBhY3Rpb25zLmluc2VydEJlZm9yZShjb25maXJtQnV0dG9uLCBsb2FkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29uZmlybUJ1dHRvblxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkZW55QnV0dG9uXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbmNlbEJ1dHRvblxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBkZW55QnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcykge1xuICAgIGlmICghcGFyYW1zLmJ1dHRvbnNTdHlsaW5nKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlQ2xhc3MoW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0sIHN3YWxDbGFzc2VzLnN0eWxlZCk7XG4gICAgfVxuXG4gICAgYWRkQ2xhc3MoW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0sIHN3YWxDbGFzc2VzLnN0eWxlZCk7IC8vIEJ1dHRvbnMgYmFja2dyb3VuZCBjb2xvcnNcblxuICAgIGlmIChwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yKSB7XG4gICAgICBjb25maXJtQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5jb25maXJtQnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhjb25maXJtQnV0dG9uLCBzd2FsQ2xhc3Nlc1snZGVmYXVsdC1vdXRsaW5lJ10pO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuZGVueUJ1dHRvbkNvbG9yKSB7XG4gICAgICBkZW55QnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5kZW55QnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhkZW55QnV0dG9uLCBzd2FsQ2xhc3Nlc1snZGVmYXVsdC1vdXRsaW5lJ10pO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3IpIHtcbiAgICAgIGNhbmNlbEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3I7XG4gICAgICBhZGRDbGFzcyhjYW5jZWxCdXR0b24sIHN3YWxDbGFzc2VzWydkZWZhdWx0LW91dGxpbmUnXSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBidXR0b25cbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueScgfCAnY2FuY2VsJ30gYnV0dG9uVHlwZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cblxuICBmdW5jdGlvbiByZW5kZXJCdXR0b24oYnV0dG9uLCBidXR0b25UeXBlLCBwYXJhbXMpIHtcbiAgICB0b2dnbGUoYnV0dG9uLCBwYXJhbXNbXCJzaG93XCIuY29uY2F0KGNhcGl0YWxpemVGaXJzdExldHRlcihidXR0b25UeXBlKSwgXCJCdXR0b25cIildLCAnaW5saW5lLWJsb2NrJyk7XG4gICAgc2V0SW5uZXJIdG1sKGJ1dHRvbiwgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uVGV4dFwiKV0pOyAvLyBTZXQgY2FwdGlvbiB0ZXh0XG5cbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zW1wiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uQXJpYUxhYmVsXCIpXSk7IC8vIEFSSUEgbGFiZWxcbiAgICAvLyBBZGQgYnV0dG9ucyBjdXN0b20gY2xhc3Nlc1xuXG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzW2J1dHRvblR5cGVdO1xuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoYnV0dG9uLCBwYXJhbXMsIFwiXCIuY29uY2F0KGJ1dHRvblR5cGUsIFwiQnV0dG9uXCIpKTtcbiAgICBhZGRDbGFzcyhidXR0b24sIHBhcmFtc1tcIlwiLmNvbmNhdChidXR0b25UeXBlLCBcIkJ1dHRvbkNsYXNzXCIpXSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNvbnRhaW5lciA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhhbmRsZUJhY2tkcm9wUGFyYW0oY29udGFpbmVyLCBwYXJhbXMuYmFja2Ryb3ApO1xuICAgIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwYXJhbXMucG9zaXRpb24pO1xuICAgIGhhbmRsZUdyb3dQYXJhbShjb250YWluZXIsIHBhcmFtcy5ncm93KTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGNvbnRhaW5lciwgcGFyYW1zLCAnY29udGFpbmVyJyk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snYmFja2Ryb3AnXX0gYmFja2Ryb3BcbiAgICovXG5cbiAgZnVuY3Rpb24gaGFuZGxlQmFja2Ryb3BQYXJhbShjb250YWluZXIsIGJhY2tkcm9wKSB7XG4gICAgaWYgKHR5cGVvZiBiYWNrZHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gYmFja2Ryb3A7XG4gICAgfSBlbHNlIGlmICghYmFja2Ryb3ApIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1sncG9zaXRpb24nXX0gcG9zaXRpb25cbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVQb3NpdGlvblBhcmFtKGNvbnRhaW5lciwgcG9zaXRpb24pIHtcbiAgICBpZiAocG9zaXRpb24gaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbcG9zaXRpb25dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2FybignVGhlIFwicG9zaXRpb25cIiBwYXJhbWV0ZXIgaXMgbm90IHZhbGlkLCBkZWZhdWx0aW5nIHRvIFwiY2VudGVyXCInKTtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXMuY2VudGVyKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydncm93J119IGdyb3dcbiAgICovXG5cblxuICBmdW5jdGlvbiBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBncm93KSB7XG4gICAgaWYgKGdyb3cgJiYgdHlwZW9mIGdyb3cgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBncm93Q2xhc3MgPSBcImdyb3ctXCIuY29uY2F0KGdyb3cpO1xuXG4gICAgICBpZiAoZ3Jvd0NsYXNzIGluIHN3YWxDbGFzc2VzKSB7XG4gICAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbZ3Jvd0NsYXNzXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAgICogVGhpcyBpcyB0aGUgYXBwcm9hY2ggdGhhdCBCYWJlbCB3aWxsIHByb2JhYmx5IHRha2UgdG8gaW1wbGVtZW50IHByaXZhdGUgbWV0aG9kcy9maWVsZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAgICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gICAqIE9uY2Ugd2UgaGF2ZSB0aGUgY2hhbmdlcyBmcm9tIHRoYXQgUFIgaW4gQmFiZWwsIGFuZCBvdXIgY29yZSBjbGFzcyBmaXRzIHJlYXNvbmFibGUgaW4gKm9uZSBtb2R1bGUqXG4gICAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAgICovXG4gIHZhciBwcml2YXRlUHJvcHMgPSB7XG4gICAgYXdhaXRpbmdQcm9taXNlOiBuZXcgV2Vha01hcCgpLFxuICAgIHByb21pc2U6IG5ldyBXZWFrTWFwKCksXG4gICAgaW5uZXJQYXJhbXM6IG5ldyBXZWFrTWFwKCksXG4gICAgZG9tQ2FjaGU6IG5ldyBXZWFrTWFwKClcbiAgfTtcblxuICAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vc3dlZXRhbGVydDIuZC50c1wiLz5cbiAgLyoqIEB0eXBlIHtJbnB1dENsYXNzW119ICovXG5cbiAgY29uc3QgaW5wdXRDbGFzc2VzID0gWydpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICd0ZXh0YXJlYSddO1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlcklucHV0ID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcbiAgICBjb25zdCByZXJlbmRlciA9ICFpbm5lclBhcmFtcyB8fCBwYXJhbXMuaW5wdXQgIT09IGlubmVyUGFyYW1zLmlucHV0O1xuICAgIGlucHV0Q2xhc3Nlcy5mb3JFYWNoKGlucHV0Q2xhc3MgPT4ge1xuICAgICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW2lucHV0Q2xhc3NdKTsgLy8gc2V0IGF0dHJpYnV0ZXNcblxuICAgICAgc2V0QXR0cmlidXRlcyhpbnB1dENsYXNzLCBwYXJhbXMuaW5wdXRBdHRyaWJ1dGVzKTsgLy8gc2V0IGNsYXNzXG5cbiAgICAgIGlucHV0Q29udGFpbmVyLmNsYXNzTmFtZSA9IHN3YWxDbGFzc2VzW2lucHV0Q2xhc3NdO1xuXG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgaGlkZShpbnB1dENvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocGFyYW1zLmlucHV0KSB7XG4gICAgICBpZiAocmVyZW5kZXIpIHtcbiAgICAgICAgc2hvd0lucHV0KHBhcmFtcyk7XG4gICAgICB9IC8vIHNldCBjdXN0b20gY2xhc3NcblxuXG4gICAgICBzZXRDdXN0b21DbGFzcyhwYXJhbXMpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBzaG93SW5wdXQgPSBwYXJhbXMgPT4ge1xuICAgIGlmICghcmVuZGVySW5wdXRUeXBlW3BhcmFtcy5pbnB1dF0pIHtcbiAgICAgIHJldHVybiBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dCEgRXhwZWN0ZWQgXFxcInRleHRcXFwiLCBcXFwiZW1haWxcXFwiLCBcXFwicGFzc3dvcmRcXFwiLCBcXFwibnVtYmVyXFxcIiwgXFxcInRlbFxcXCIsIFxcXCJzZWxlY3RcXFwiLCBcXFwicmFkaW9cXFwiLCBcXFwiY2hlY2tib3hcXFwiLCBcXFwidGV4dGFyZWFcXFwiLCBcXFwiZmlsZVxcXCIgb3IgXFxcInVybFxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHBhcmFtcy5pbnB1dCwgXCJcXFwiXCIpKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG4gICAgY29uc3QgaW5wdXQgPSByZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XShpbnB1dENvbnRhaW5lciwgcGFyYW1zKTtcbiAgICBzaG93KGlucHV0Q29udGFpbmVyKTsgLy8gaW5wdXQgYXV0b2ZvY3VzXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZvY3VzSW5wdXQoaW5wdXQpO1xuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBpbnB1dFxuICAgKi9cblxuXG4gIGNvbnN0IHJlbW92ZUF0dHJpYnV0ZXMgPSBpbnB1dCA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IGlucHV0LmF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgaWYgKCFbJ3R5cGUnLCAndmFsdWUnLCAnc3R5bGUnXS5pbmNsdWRlcyhhdHRyTmFtZSkpIHtcbiAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0lucHV0Q2xhc3N9IGlucHV0Q2xhc3NcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc1snaW5wdXRBdHRyaWJ1dGVzJ119IGlucHV0QXR0cmlidXRlc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldEF0dHJpYnV0ZXMgPSAoaW5wdXRDbGFzcywgaW5wdXRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBnZXRJbnB1dChnZXRQb3B1cCgpLCBpbnB1dENsYXNzKTtcblxuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZW1vdmVBdHRyaWJ1dGVzKGlucHV0KTtcblxuICAgIGZvciAoY29uc3QgYXR0ciBpbiBpbnB1dEF0dHJpYnV0ZXMpIHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShhdHRyLCBpbnB1dEF0dHJpYnV0ZXNbYXR0cl0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldEN1c3RvbUNsYXNzID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGdldElucHV0Q29udGFpbmVyKHBhcmFtcy5pbnB1dCk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFkZENsYXNzKGlucHV0Q29udGFpbmVyLCBwYXJhbXMuY3VzdG9tQ2xhc3MuaW5wdXQpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldElucHV0UGxhY2Vob2xkZXIgPSAoaW5wdXQsIHBhcmFtcykgPT4ge1xuICAgIGlmICghaW5wdXQucGxhY2Vob2xkZXIgfHwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpIHtcbiAgICAgIGlucHV0LnBsYWNlaG9sZGVyID0gcGFyYW1zLmlucHV0UGxhY2Vob2xkZXI7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtJbnB1dH0gaW5wdXRcbiAgICogQHBhcmFtIHtJbnB1dH0gcHJlcGVuZFRvXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldElucHV0TGFiZWwgPSAoaW5wdXQsIHByZXBlbmRUbywgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHBhcmFtcy5pbnB1dExhYmVsKSB7XG4gICAgICBpbnB1dC5pZCA9IHN3YWxDbGFzc2VzLmlucHV0O1xuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgY29uc3QgbGFiZWxDbGFzcyA9IHN3YWxDbGFzc2VzWydpbnB1dC1sYWJlbCddO1xuICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBpbnB1dC5pZCk7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBsYWJlbENsYXNzO1xuXG4gICAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYWRkQ2xhc3MobGFiZWwsIHBhcmFtcy5jdXN0b21DbGFzcy5pbnB1dExhYmVsKTtcbiAgICAgIH1cblxuICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gcGFyYW1zLmlucHV0TGFiZWw7XG4gICAgICBwcmVwZW5kVG8uaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIGxhYmVsKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dCddfSBpbnB1dFR5cGVcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cblxuXG4gIGNvbnN0IGdldElucHV0Q29udGFpbmVyID0gaW5wdXRUeXBlID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0Q2hpbGRCeUNsYXNzKGdldFBvcHVwKCksIHN3YWxDbGFzc2VzW2lucHV0VHlwZV0gfHwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50IHwgSFRNTE91dHB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50fSBpbnB1dFxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zWydpbnB1dFZhbHVlJ119IGlucHV0VmFsdWVcbiAgICovXG5cblxuICBjb25zdCBjaGVja0FuZFNldElucHV0VmFsdWUgPSAoaW5wdXQsIGlucHV0VmFsdWUpID0+IHtcbiAgICBpZiAoWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIGlucHV0VmFsdWUpKSB7XG4gICAgICBpbnB1dC52YWx1ZSA9IFwiXCIuY29uY2F0KGlucHV0VmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoIWlzUHJvbWlzZShpbnB1dFZhbHVlKSkge1xuICAgICAgd2FybihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dFZhbHVlISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiwgXFxcIm51bWJlclxcXCIgb3IgXFxcIlByb21pc2VcXFwiLCBnb3QgXFxcIlwiLmNvbmNhdCh0eXBlb2YgaW5wdXRWYWx1ZSwgXCJcXFwiXCIpKTtcbiAgICB9XG4gIH07XG4gIC8qKiBAdHlwZSBSZWNvcmQ8c3RyaW5nLCAoaW5wdXQ6IElucHV0IHwgSFRNTEVsZW1lbnQsIHBhcmFtczogU3dlZXRBbGVydE9wdGlvbnMpID0+IElucHV0PiAqL1xuXG5cbiAgY29uc3QgcmVuZGVySW5wdXRUeXBlID0ge307XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cbiAgcmVuZGVySW5wdXRUeXBlLnRleHQgPSByZW5kZXJJbnB1dFR5cGUuZW1haWwgPSByZW5kZXJJbnB1dFR5cGUucGFzc3dvcmQgPSByZW5kZXJJbnB1dFR5cGUubnVtYmVyID0gcmVuZGVySW5wdXRUeXBlLnRlbCA9IHJlbmRlcklucHV0VHlwZS51cmwgPSAoaW5wdXQsIHBhcmFtcykgPT4ge1xuICAgIGNoZWNrQW5kU2V0SW5wdXRWYWx1ZShpbnB1dCwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIHNldElucHV0TGFiZWwoaW5wdXQsIGlucHV0LCBwYXJhbXMpO1xuICAgIHNldElucHV0UGxhY2Vob2xkZXIoaW5wdXQsIHBhcmFtcyk7XG4gICAgaW5wdXQudHlwZSA9IHBhcmFtcy5pbnB1dDtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0XG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuZmlsZSA9IChpbnB1dCwgcGFyYW1zKSA9PiB7XG4gICAgc2V0SW5wdXRMYWJlbChpbnB1dCwgaW5wdXQsIHBhcmFtcyk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhbmdlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTElucHV0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUucmFuZ2UgPSAocmFuZ2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHJhbmdlSW5wdXQgPSByYW5nZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHJhbmdlT3V0cHV0ID0gcmFuZ2UucXVlcnlTZWxlY3Rvcignb3V0cHV0Jyk7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlSW5wdXQsIHBhcmFtcy5pbnB1dFZhbHVlKTtcbiAgICByYW5nZUlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHJhbmdlT3V0cHV0LCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRMYWJlbChyYW5nZUlucHV0LCByYW5nZSwgcGFyYW1zKTtcbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxTZWxlY3RFbGVtZW50fSBzZWxlY3RcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MU2VsZWN0RWxlbWVudH1cbiAgICovXG5cblxuICByZW5kZXJJbnB1dFR5cGUuc2VsZWN0ID0gKHNlbGVjdCwgcGFyYW1zKSA9PiB7XG4gICAgc2VsZWN0LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAocGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBzZXRJbm5lckh0bWwocGxhY2Vob2xkZXIsIHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKTtcbiAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XG4gICAgICBwbGFjZWhvbGRlci5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwbGFjZWhvbGRlci5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgIH1cblxuICAgIHNldElucHV0TGFiZWwoc2VsZWN0LCBzZWxlY3QsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFkaW9cbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLnJhZGlvID0gcmFkaW8gPT4ge1xuICAgIHJhZGlvLnRleHRDb250ZW50ID0gJyc7XG4gICAgcmV0dXJuIHJhZGlvO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MTGFiZWxFbGVtZW50fSBjaGVja2JveENvbnRhaW5lclxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICogQHJldHVybnMge0hUTUxJbnB1dEVsZW1lbnR9XG4gICAqL1xuXG5cbiAgcmVuZGVySW5wdXRUeXBlLmNoZWNrYm94ID0gKGNoZWNrYm94Q29udGFpbmVyLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGdldElucHV0KGdldFBvcHVwKCksICdjaGVja2JveCcpO1xuICAgIGNoZWNrYm94LnZhbHVlID0gJzEnO1xuICAgIGNoZWNrYm94LmlkID0gc3dhbENsYXNzZXMuY2hlY2tib3g7XG4gICAgY2hlY2tib3guY2hlY2tlZCA9IEJvb2xlYW4ocGFyYW1zLmlucHV0VmFsdWUpO1xuICAgIGNvbnN0IGxhYmVsID0gY2hlY2tib3hDb250YWluZXIucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICAgIHNldElubmVySHRtbChsYWJlbCwgcGFyYW1zLmlucHV0UGxhY2Vob2xkZXIpO1xuICAgIHJldHVybiBjaGVja2JveDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFRleHRBcmVhRWxlbWVudH0gdGV4dGFyZWFcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqIEByZXR1cm5zIHtIVE1MVGV4dEFyZWFFbGVtZW50fVxuICAgKi9cblxuXG4gIHJlbmRlcklucHV0VHlwZS50ZXh0YXJlYSA9ICh0ZXh0YXJlYSwgcGFyYW1zKSA9PiB7XG4gICAgY2hlY2tBbmRTZXRJbnB1dFZhbHVlKHRleHRhcmVhLCBwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gICAgc2V0SW5wdXRQbGFjZWhvbGRlcih0ZXh0YXJlYSwgcGFyYW1zKTtcbiAgICBzZXRJbnB1dExhYmVsKHRleHRhcmVhLCB0ZXh0YXJlYSwgcGFyYW1zKTtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG5cbiAgICBjb25zdCBnZXRNYXJnaW4gPSBlbCA9PiBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luTGVmdCkgKyBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkubWFyZ2luUmlnaHQpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzIyOTFcblxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE2OTlcbiAgICAgIGlmICgnTXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxQb3B1cFdpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2V0UG9wdXAoKSkud2lkdGgpO1xuXG4gICAgICAgIGNvbnN0IHRleHRhcmVhUmVzaXplSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0ZXh0YXJlYVdpZHRoID0gdGV4dGFyZWEub2Zmc2V0V2lkdGggKyBnZXRNYXJnaW4odGV4dGFyZWEpO1xuXG4gICAgICAgICAgaWYgKHRleHRhcmVhV2lkdGggPiBpbml0aWFsUG9wdXBXaWR0aCkge1xuICAgICAgICAgICAgZ2V0UG9wdXAoKS5zdHlsZS53aWR0aCA9IFwiXCIuY29uY2F0KHRleHRhcmVhV2lkdGgsIFwicHhcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBvcHVwKCkuc3R5bGUud2lkdGggPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBuZXcgTXV0YXRpb25PYnNlcnZlcih0ZXh0YXJlYVJlc2l6ZUhhbmRsZXIpLm9ic2VydmUodGV4dGFyZWEsIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZSddXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0YXJlYTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNvbnRlbnQgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGh0bWxDb250YWluZXIgPSBnZXRIdG1sQ29udGFpbmVyKCk7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhodG1sQ29udGFpbmVyLCBwYXJhbXMsICdodG1sQ29udGFpbmVyJyk7IC8vIENvbnRlbnQgYXMgSFRNTFxuXG4gICAgaWYgKHBhcmFtcy5odG1sKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuaHRtbCwgaHRtbENvbnRhaW5lcik7XG4gICAgICBzaG93KGh0bWxDb250YWluZXIsICdibG9jaycpO1xuICAgIH0gLy8gQ29udGVudCBhcyBwbGFpbiB0ZXh0XG4gICAgZWxzZSBpZiAocGFyYW1zLnRleHQpIHtcbiAgICAgIGh0bWxDb250YWluZXIudGV4dENvbnRlbnQgPSBwYXJhbXMudGV4dDtcbiAgICAgIHNob3coaHRtbENvbnRhaW5lciwgJ2Jsb2NrJyk7XG4gICAgfSAvLyBObyBjb250ZW50XG4gICAgZWxzZSB7XG4gICAgICBoaWRlKGh0bWxDb250YWluZXIpO1xuICAgIH1cblxuICAgIHJlbmRlcklucHV0KGluc3RhbmNlLCBwYXJhbXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyRm9vdGVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBmb290ZXIgPSBnZXRGb290ZXIoKTtcbiAgICB0b2dnbGUoZm9vdGVyLCBwYXJhbXMuZm9vdGVyKTtcblxuICAgIGlmIChwYXJhbXMuZm9vdGVyKSB7XG4gICAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuZm9vdGVyLCBmb290ZXIpO1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MoZm9vdGVyLCBwYXJhbXMsICdmb290ZXInKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckNsb3NlQnV0dG9uID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGdldENsb3NlQnV0dG9uKCk7XG4gICAgc2V0SW5uZXJIdG1sKGNsb3NlQnV0dG9uLCBwYXJhbXMuY2xvc2VCdXR0b25IdG1sKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGNsb3NlQnV0dG9uLCBwYXJhbXMsICdjbG9zZUJ1dHRvbicpO1xuICAgIHRvZ2dsZShjbG9zZUJ1dHRvbiwgcGFyYW1zLnNob3dDbG9zZUJ1dHRvbik7XG4gICAgY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zLmNsb3NlQnV0dG9uQXJpYUxhYmVsKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlckljb24gPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgY29uc3QgaWNvbiA9IGdldEljb24oKTsgLy8gaWYgdGhlIGdpdmVuIGljb24gYWxyZWFkeSByZW5kZXJlZCwgYXBwbHkgdGhlIHN0eWxpbmcgd2l0aG91dCByZS1yZW5kZXJpbmcgdGhlIGljb25cblxuICAgIGlmIChpbm5lclBhcmFtcyAmJiBwYXJhbXMuaWNvbiA9PT0gaW5uZXJQYXJhbXMuaWNvbikge1xuICAgICAgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuICAgICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgICAgYXBwbHlTdHlsZXMoaWNvbiwgcGFyYW1zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXBhcmFtcy5pY29uICYmICFwYXJhbXMuaWNvbkh0bWwpIHtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5pY29uICYmIE9iamVjdC5rZXlzKGljb25UeXBlcykuaW5kZXhPZihwYXJhbXMuaWNvbikgPT09IC0xKSB7XG4gICAgICBlcnJvcihcIlVua25vd24gaWNvbiEgRXhwZWN0ZWQgXFxcInN1Y2Nlc3NcXFwiLCBcXFwiZXJyb3JcXFwiLCBcXFwid2FybmluZ1xcXCIsIFxcXCJpbmZvXFxcIiBvciBcXFwicXVlc3Rpb25cXFwiLCBnb3QgXFxcIlwiLmNvbmNhdChwYXJhbXMuaWNvbiwgXCJcXFwiXCIpKTtcbiAgICAgIGhpZGUoaWNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2hvdyhpY29uKTsgLy8gQ3VzdG9tIG9yIGRlZmF1bHQgY29udGVudFxuXG4gICAgc2V0Q29udGVudChpY29uLCBwYXJhbXMpO1xuICAgIGFwcGx5U3R5bGVzKGljb24sIHBhcmFtcyk7IC8vIEFuaW1hdGUgaWNvblxuXG4gICAgYWRkQ2xhc3MoaWNvbiwgcGFyYW1zLnNob3dDbGFzcy5pY29uKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGljb25cbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IGFwcGx5U3R5bGVzID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGZvciAoY29uc3QgaWNvblR5cGUgaW4gaWNvblR5cGVzKSB7XG4gICAgICBpZiAocGFyYW1zLmljb24gIT09IGljb25UeXBlKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGljb24sIGljb25UeXBlc1tpY29uVHlwZV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFkZENsYXNzKGljb24sIGljb25UeXBlc1twYXJhbXMuaWNvbl0pOyAvLyBJY29uIGNvbG9yXG5cbiAgICBzZXRDb2xvcihpY29uLCBwYXJhbXMpOyAvLyBTdWNjZXNzIGljb24gYmFja2dyb3VuZCBjb2xvclxuXG4gICAgYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IoKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgICBhcHBseUN1c3RvbUNsYXNzKGljb24sIHBhcmFtcywgJ2ljb24nKTtcbiAgfTsgLy8gQWRqdXN0IHN1Y2Nlc3MgaWNvbiBiYWNrZ3JvdW5kIGNvbG9yIHRvIG1hdGNoIHRoZSBwb3B1cCBiYWNrZ3JvdW5kIGNvbG9yXG5cblxuICBjb25zdCBhZGp1c3RTdWNjZXNzSWNvbkJhY2tncm91bmRDb2xvciA9ICgpID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgcG9wdXBCYWNrZ3JvdW5kQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwb3B1cCkuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgIC8qKiBAdHlwZSB7Tm9kZUxpc3RPZjxIVE1MRWxlbWVudD59ICovXG5cbiAgICBjb25zdCBzdWNjZXNzSWNvblBhcnRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdLCAuc3dhbDItc3VjY2Vzcy1maXgnKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3VjY2Vzc0ljb25QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VjY2Vzc0ljb25QYXJ0c1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwb3B1cEJhY2tncm91bmRDb2xvcjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3VjY2Vzc0ljb25IdG1sID0gXCJcXG4gIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1sZWZ0XFxcIj48L2Rpdj5cXG4gIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWxpbmUtdGlwXFxcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVxcXCJzd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ1xcXCI+PC9zcGFuPlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1yaW5nXFxcIj48L2Rpdj4gPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1maXhcXFwiPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0XFxcIj48L2Rpdj5cXG5cIjtcbiAgY29uc3QgZXJyb3JJY29uSHRtbCA9IFwiXFxuICA8c3BhbiBjbGFzcz1cXFwic3dhbDIteC1tYXJrXFxcIj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFyay1saW5lLWxlZnRcXFwiPjwvc3Bhbj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFyay1saW5lLXJpZ2h0XFxcIj48L3NwYW4+XFxuICA8L3NwYW4+XFxuXCI7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBzZXRDb250ZW50ID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGxldCBvbGRDb250ZW50ID0gaWNvbi5pbm5lckhUTUw7XG4gICAgbGV0IG5ld0NvbnRlbnQ7XG5cbiAgICBpZiAocGFyYW1zLmljb25IdG1sKSB7XG4gICAgICBuZXdDb250ZW50ID0gaWNvbkNvbnRlbnQocGFyYW1zLmljb25IdG1sKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtcy5pY29uID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBzdWNjZXNzSWNvbkh0bWw7XG4gICAgICBvbGRDb250ZW50ID0gb2xkQ29udGVudC5yZXBsYWNlKC8gc3R5bGU9XCIuKj9cIi9nLCAnJyk7IC8vIHVuZG8gYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ3JvdW5kQ29sb3IoKVxuICAgIH0gZWxzZSBpZiAocGFyYW1zLmljb24gPT09ICdlcnJvcicpIHtcbiAgICAgIG5ld0NvbnRlbnQgPSBlcnJvckljb25IdG1sO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkZWZhdWx0SWNvbkh0bWwgPSB7XG4gICAgICAgIHF1ZXN0aW9uOiAnPycsXG4gICAgICAgIHdhcm5pbmc6ICchJyxcbiAgICAgICAgaW5mbzogJ2knXG4gICAgICB9O1xuICAgICAgbmV3Q29udGVudCA9IGljb25Db250ZW50KGRlZmF1bHRJY29uSHRtbFtwYXJhbXMuaWNvbl0pO1xuICAgIH1cblxuICAgIGlmIChvbGRDb250ZW50LnRyaW0oKSAhPT0gbmV3Q29udGVudC50cmltKCkpIHtcbiAgICAgIHNldElubmVySHRtbChpY29uLCBuZXdDb250ZW50KTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpY29uXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IHNldENvbG9yID0gKGljb24sIHBhcmFtcykgPT4ge1xuICAgIGlmICghcGFyYW1zLmljb25Db2xvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGljb24uc3R5bGUuY29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuICAgIGljb24uc3R5bGUuYm9yZGVyQ29sb3IgPSBwYXJhbXMuaWNvbkNvbG9yO1xuXG4gICAgZm9yIChjb25zdCBzZWwgb2YgWycuc3dhbDItc3VjY2Vzcy1saW5lLXRpcCcsICcuc3dhbDItc3VjY2Vzcy1saW5lLWxvbmcnLCAnLnN3YWwyLXgtbWFyay1saW5lLWxlZnQnLCAnLnN3YWwyLXgtbWFyay1saW5lLXJpZ2h0J10pIHtcbiAgICAgIHNldFN0eWxlKGljb24sIHNlbCwgJ2JhY2tncm91bmRDb2xvcicsIHBhcmFtcy5pY29uQ29sb3IpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKGljb24sICcuc3dhbDItc3VjY2Vzcy1yaW5nJywgJ2JvcmRlckNvbG9yJywgcGFyYW1zLmljb25Db2xvcik7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuXG4gIGNvbnN0IGljb25Db250ZW50ID0gY29udGVudCA9PiBcIjxkaXYgY2xhc3M9XFxcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlc1snaWNvbi1jb250ZW50J10sIFwiXFxcIj5cIikuY29uY2F0KGNvbnRlbnQsIFwiPC9kaXY+XCIpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVySW1hZ2UgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gZ2V0SW1hZ2UoKTtcblxuICAgIGlmICghcGFyYW1zLmltYWdlVXJsKSB7XG4gICAgICByZXR1cm4gaGlkZShpbWFnZSk7XG4gICAgfVxuXG4gICAgc2hvdyhpbWFnZSwgJycpOyAvLyBTcmMsIGFsdFxuXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBwYXJhbXMuaW1hZ2VVcmwpO1xuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnYWx0JywgcGFyYW1zLmltYWdlQWx0KTsgLy8gV2lkdGgsIGhlaWdodFxuXG4gICAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ3dpZHRoJywgcGFyYW1zLmltYWdlV2lkdGgpO1xuICAgIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICdoZWlnaHQnLCBwYXJhbXMuaW1hZ2VIZWlnaHQpOyAvLyBDbGFzc1xuXG4gICAgaW1hZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuaW1hZ2U7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhpbWFnZSwgcGFyYW1zLCAnaW1hZ2UnKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclByb2dyZXNzU3RlcHMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHByb2dyZXNzU3RlcHNDb250YWluZXIgPSBnZXRQcm9ncmVzc1N0ZXBzKCk7XG5cbiAgICBpZiAoIXBhcmFtcy5wcm9ncmVzc1N0ZXBzIHx8IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGhpZGUocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgc2hvdyhwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKTtcbiAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLnRleHRDb250ZW50ID0gJyc7XG5cbiAgICBpZiAocGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXAgPj0gcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoKSB7XG4gICAgICB3YXJuKCdJbnZhbGlkIGN1cnJlbnRQcm9ncmVzc1N0ZXAgcGFyYW1ldGVyLCBpdCBzaG91bGQgYmUgbGVzcyB0aGFuIHByb2dyZXNzU3RlcHMubGVuZ3RoICcgKyAnKGN1cnJlbnRQcm9ncmVzc1N0ZXAgbGlrZSBKUyBhcnJheXMgc3RhcnRzIGZyb20gMCknKTtcbiAgICB9XG5cbiAgICBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5mb3JFYWNoKChzdGVwLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc3RlcEVsID0gY3JlYXRlU3RlcEVsZW1lbnQoc3RlcCk7XG4gICAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0ZXBFbCk7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gcGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXApIHtcbiAgICAgICAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1snYWN0aXZlLXByb2dyZXNzLXN0ZXAnXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmRleCAhPT0gcGFyYW1zLnByb2dyZXNzU3RlcHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBsaW5lRWwgPSBjcmVhdGVMaW5lRWxlbWVudChwYXJhbXMpO1xuICAgICAgICBwcm9ncmVzc1N0ZXBzQ29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmVFbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RlcFxuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG5cbiAgY29uc3QgY3JlYXRlU3RlcEVsZW1lbnQgPSBzdGVwID0+IHtcbiAgICBjb25zdCBzdGVwRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGFkZENsYXNzKHN0ZXBFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAnXSk7XG4gICAgc2V0SW5uZXJIdG1sKHN0ZXBFbCwgc3RlcCk7XG4gICAgcmV0dXJuIHN0ZXBFbDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7SFRNTExJRWxlbWVudH1cbiAgICovXG5cblxuICBjb25zdCBjcmVhdGVMaW5lRWxlbWVudCA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgbGluZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBhZGRDbGFzcyhsaW5lRWwsIHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwLWxpbmUnXSk7XG5cbiAgICBpZiAocGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSkge1xuICAgICAgYXBwbHlOdW1lcmljYWxTdHlsZShsaW5lRWwsICd3aWR0aCcsIHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBsaW5lRWw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuICBjb25zdCByZW5kZXJUaXRsZSA9IChpbnN0YW5jZSwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBnZXRUaXRsZSgpO1xuICAgIHRvZ2dsZSh0aXRsZSwgcGFyYW1zLnRpdGxlIHx8IHBhcmFtcy50aXRsZVRleHQsICdibG9jaycpO1xuXG4gICAgaWYgKHBhcmFtcy50aXRsZSkge1xuICAgICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLnRpdGxlLCB0aXRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy50aXRsZVRleHQpIHtcbiAgICAgIHRpdGxlLmlubmVyVGV4dCA9IHBhcmFtcy50aXRsZVRleHQ7XG4gICAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gICAgYXBwbHlDdXN0b21DbGFzcyh0aXRsZSwgcGFyYW1zLCAndGl0bGUnKTtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IHJlbmRlclBvcHVwID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7IC8vIFdpZHRoXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMTcwXG5cbiAgICBpZiAocGFyYW1zLnRvYXN0KSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKGNvbnRhaW5lciwgJ3dpZHRoJywgcGFyYW1zLndpZHRoKTtcbiAgICAgIHBvcHVwLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgcG9wdXAuaW5zZXJ0QmVmb3JlKGdldExvYWRlcigpLCBnZXRJY29uKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBseU51bWVyaWNhbFN0eWxlKHBvcHVwLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpO1xuICAgIH0gLy8gUGFkZGluZ1xuXG5cbiAgICBhcHBseU51bWVyaWNhbFN0eWxlKHBvcHVwLCAncGFkZGluZycsIHBhcmFtcy5wYWRkaW5nKTsgLy8gQ29sb3JcblxuICAgIGlmIChwYXJhbXMuY29sb3IpIHtcbiAgICAgIHBvcHVwLnN0eWxlLmNvbG9yID0gcGFyYW1zLmNvbG9yO1xuICAgIH0gLy8gQmFja2dyb3VuZFxuXG5cbiAgICBpZiAocGFyYW1zLmJhY2tncm91bmQpIHtcbiAgICAgIHBvcHVwLnN0eWxlLmJhY2tncm91bmQgPSBwYXJhbXMuYmFja2dyb3VuZDtcbiAgICB9XG5cbiAgICBoaWRlKGdldFZhbGlkYXRpb25NZXNzYWdlKCkpOyAvLyBDbGFzc2VzXG5cbiAgICBhZGRDbGFzc2VzKHBvcHVwLCBwYXJhbXMpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wdXBcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gcGFyYW1zXG4gICAqL1xuXG4gIGNvbnN0IGFkZENsYXNzZXMgPSAocG9wdXAsIHBhcmFtcykgPT4ge1xuICAgIC8vIERlZmF1bHQgQ2xhc3MgKyBzaG93Q2xhc3Mgd2hlbiB1cGRhdGluZyBTd2FsLnVwZGF0ZSh7fSlcbiAgICBwb3B1cC5jbGFzc05hbWUgPSBcIlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCIgXCIpLmNvbmNhdChpc1Zpc2libGUocG9wdXApID8gcGFyYW1zLnNob3dDbGFzcy5wb3B1cCA6ICcnKTtcblxuICAgIGlmIChwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSk7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMudG9hc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMubW9kYWwpO1xuICAgIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICAgIGFwcGx5Q3VzdG9tQ2xhc3MocG9wdXAsIHBhcmFtcywgJ3BvcHVwJyk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuY3VzdG9tQ2xhc3MpO1xuICAgIH0gLy8gSWNvbiBjbGFzcyAoIzE4NDIpXG5cblxuICAgIGlmIChwYXJhbXMuaWNvbikge1xuICAgICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzW1wiaWNvbi1cIi5jb25jYXQocGFyYW1zLmljb24pXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgY29uc3QgcmVuZGVyID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICByZW5kZXJQb3B1cChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJDb250YWluZXIoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyUHJvZ3Jlc3NTdGVwcyhpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJJY29uKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckltYWdlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlclRpdGxlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNsb3NlQnV0dG9uKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIHJlbmRlckNvbnRlbnQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gICAgcmVuZGVyQWN0aW9ucyhpbnN0YW5jZSwgcGFyYW1zKTtcbiAgICByZW5kZXJGb290ZXIoaW5zdGFuY2UsIHBhcmFtcyk7XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtcy5kaWRSZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHBhcmFtcy5kaWRSZW5kZXIoZ2V0UG9wdXAoKSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IERpc21pc3NSZWFzb24gPSBPYmplY3QuZnJlZXplKHtcbiAgICBjYW5jZWw6ICdjYW5jZWwnLFxuICAgIGJhY2tkcm9wOiAnYmFja2Ryb3AnLFxuICAgIGNsb3NlOiAnY2xvc2UnLFxuICAgIGVzYzogJ2VzYycsXG4gICAgdGltZXI6ICd0aW1lcidcbiAgfSk7XG5cbiAgLy8gQWRkaW5nIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRvIGVsZW1lbnRzIG91dHNpZGUgb2YgdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgZW5zdXJlcyB0aGF0XG4gIC8vIGVsZW1lbnRzIG5vdCB3aXRoaW4gdGhlIGFjdGl2ZSBtb2RhbCBkaWFsb2cgd2lsbCBub3QgYmUgc3VyZmFjZWQgaWYgYSB1c2VyIG9wZW5zIGEgc2NyZWVuXG4gIC8vIHJlYWRlclx1MjAxOXMgbGlzdCBvZiBlbGVtZW50cyAoaGVhZGluZ3MsIGZvcm0gY29udHJvbHMsIGxhbmRtYXJrcywgZXRjLikgaW4gdGhlIGRvY3VtZW50LlxuXG4gIGNvbnN0IHNldEFyaWFIaWRkZW4gPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keUNoaWxkcmVuID0gQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICBib2R5Q2hpbGRyZW4uZm9yRWFjaChlbCA9PiB7XG4gICAgICBpZiAoZWwgPT09IGdldENvbnRhaW5lcigpIHx8IGVsLmNvbnRhaW5zKGdldENvbnRhaW5lcigpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcbiAgICAgIH1cblxuICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHVuc2V0QXJpYUhpZGRlbiA9ICgpID0+IHtcbiAgICBjb25zdCBib2R5Q2hpbGRyZW4gPSBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgIGJvZHlDaGlsZHJlbi5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJykpO1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzd2FsU3RyaW5nUGFyYW1zID0gWydzd2FsLXRpdGxlJywgJ3N3YWwtaHRtbCcsICdzd2FsLWZvb3RlciddO1xuICBjb25zdCBnZXRUZW1wbGF0ZVBhcmFtcyA9IHBhcmFtcyA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0eXBlb2YgcGFyYW1zLnRlbXBsYXRlID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnRlbXBsYXRlKSA6IHBhcmFtcy50ZW1wbGF0ZTtcblxuICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgLyoqIEB0eXBlIHtEb2N1bWVudEZyYWdtZW50fSAqL1xuXG5cbiAgICBjb25zdCB0ZW1wbGF0ZUNvbnRlbnQgPSB0ZW1wbGF0ZS5jb250ZW50O1xuICAgIHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzKHRlbXBsYXRlQ29udGVudCk7XG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmFzc2lnbihnZXRTd2FsUGFyYW1zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxCdXR0b25zKHRlbXBsYXRlQ29udGVudCksIGdldFN3YWxJbWFnZSh0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSWNvbih0ZW1wbGF0ZUNvbnRlbnQpLCBnZXRTd2FsSW5wdXQodGVtcGxhdGVDb250ZW50KSwgZ2V0U3dhbFN0cmluZ1BhcmFtcyh0ZW1wbGF0ZUNvbnRlbnQsIHN3YWxTdHJpbmdQYXJhbXMpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cbiAgY29uc3QgZ2V0U3dhbFBhcmFtcyA9IHRlbXBsYXRlQ29udGVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG4gICAgY29uc3Qgc3dhbFBhcmFtcyA9IEFycmF5LmZyb20odGVtcGxhdGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N3YWwtcGFyYW0nKSk7XG4gICAgc3dhbFBhcmFtcy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMocGFyYW0sIFsnbmFtZScsICd2YWx1ZSddKTtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXJhbS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFBhcmFtc1twYXJhbU5hbWVdID09PSAnYm9vbGVhbicgJiYgdmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmVzdWx0W3BhcmFtTmFtZV0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0UGFyYW1zW3BhcmFtTmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWVdID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEJ1dHRvbnMgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnRbXX0gKi9cblxuICAgIGNvbnN0IHN3YWxCdXR0b25zID0gQXJyYXkuZnJvbSh0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnc3dhbC1idXR0b24nKSk7XG4gICAgc3dhbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgc2hvd1dhcm5pbmdzRm9yQXR0cmlidXRlcyhidXR0b24sIFsndHlwZScsICdjb2xvcicsICdhcmlhLWxhYmVsJ10pO1xuICAgICAgY29uc3QgdHlwZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvblRleHRcIildID0gYnV0dG9uLmlubmVySFRNTDtcbiAgICAgIHJlc3VsdFtcInNob3dcIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpLCBcIkJ1dHRvblwiKV0gPSB0cnVlO1xuXG4gICAgICBpZiAoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnY29sb3InKSkge1xuICAgICAgICByZXN1bHRbXCJcIi5jb25jYXQodHlwZSwgXCJCdXR0b25Db2xvclwiKV0gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnV0dG9uLmhhc0F0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpKSB7XG4gICAgICAgIHJlc3VsdFtcIlwiLmNvbmNhdCh0eXBlLCBcIkJ1dHRvbkFyaWFMYWJlbFwiKV0gPSBidXR0b24uZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqL1xuXG5cbiAgY29uc3QgZ2V0U3dhbEltYWdlID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgaW1hZ2UgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3Rvcignc3dhbC1pbWFnZScpO1xuXG4gICAgaWYgKGltYWdlKSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGltYWdlLCBbJ3NyYycsICd3aWR0aCcsICdoZWlnaHQnLCAnYWx0J10pO1xuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdzcmMnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VVcmwgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCd3aWR0aCcpKSB7XG4gICAgICAgIHJlc3VsdC5pbWFnZVdpZHRoID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdoZWlnaHQnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VIZWlnaHQgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1hZ2UuaGFzQXR0cmlidXRlKCdhbHQnKSkge1xuICAgICAgICByZXN1bHQuaW1hZ2VBbHQgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2FsdCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IGdldFN3YWxJY29uID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgY29uc3QgaWNvbiA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWljb24nKTtcblxuICAgIGlmIChpY29uKSB7XG4gICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKGljb24sIFsndHlwZScsICdjb2xvciddKTtcblxuICAgICAgaWYgKGljb24uaGFzQXR0cmlidXRlKCd0eXBlJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb24gPSBpY29uLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWNvbi5oYXNBdHRyaWJ1dGUoJ2NvbG9yJykpIHtcbiAgICAgICAgcmVzdWx0Lmljb25Db2xvciA9IGljb24uZ2V0QXR0cmlidXRlKCdjb2xvcicpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHQuaWNvbkh0bWwgPSBpY29uLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsSW5wdXQgPSB0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBpbnB1dCA9IHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yKCdzd2FsLWlucHV0Jyk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMoaW5wdXQsIFsndHlwZScsICdsYWJlbCcsICdwbGFjZWhvbGRlcicsICd2YWx1ZSddKTtcbiAgICAgIHJlc3VsdC5pbnB1dCA9IGlucHV0LmdldEF0dHJpYnV0ZSgndHlwZScpIHx8ICd0ZXh0JztcblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgnbGFiZWwnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRMYWJlbCA9IGlucHV0LmdldEF0dHJpYnV0ZSgnbGFiZWwnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgncGxhY2Vob2xkZXInKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRQbGFjZWhvbGRlciA9IGlucHV0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXRWYWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuXG5cbiAgICBjb25zdCBpbnB1dE9wdGlvbnMgPSBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdzd2FsLWlucHV0LW9wdGlvbicpKTtcblxuICAgIGlmIChpbnB1dE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXN1bHQuaW5wdXRPcHRpb25zID0ge307XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBzaG93V2FybmluZ3NGb3JBdHRyaWJ1dGVzKG9wdGlvbiwgWyd2YWx1ZSddKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICBjb25zdCBvcHRpb25OYW1lID0gb3B0aW9uLmlubmVySFRNTDtcbiAgICAgICAgcmVzdWx0LmlucHV0T3B0aW9uc1tvcHRpb25WYWx1ZV0gPSBvcHRpb25OYW1lO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gdGVtcGxhdGVDb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtTmFtZXNcbiAgICovXG5cblxuICBjb25zdCBnZXRTd2FsU3RyaW5nUGFyYW1zID0gKHRlbXBsYXRlQ29udGVudCwgcGFyYW1OYW1lcykgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBpIGluIHBhcmFtTmFtZXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHBhcmFtTmFtZXNbaV07XG4gICAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL1xuXG4gICAgICBjb25zdCB0YWcgPSB0ZW1wbGF0ZUNvbnRlbnQucXVlcnlTZWxlY3RvcihwYXJhbU5hbWUpO1xuXG4gICAgICBpZiAodGFnKSB7XG4gICAgICAgIHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXModGFnLCBbXSk7XG4gICAgICAgIHJlc3VsdFtwYXJhbU5hbWUucmVwbGFjZSgvXnN3YWwtLywgJycpXSA9IHRhZy5pbm5lckhUTUwudHJpbSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IHRlbXBsYXRlQ29udGVudFxuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckVsZW1lbnRzID0gdGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICBjb25zdCBhbGxvd2VkRWxlbWVudHMgPSBzd2FsU3RyaW5nUGFyYW1zLmNvbmNhdChbJ3N3YWwtcGFyYW0nLCAnc3dhbC1idXR0b24nLCAnc3dhbC1pbWFnZScsICdzd2FsLWljb24nLCAnc3dhbC1pbnB1dCcsICdzd2FsLWlucHV0LW9wdGlvbiddKTtcbiAgICBBcnJheS5mcm9tKHRlbXBsYXRlQ29udGVudC5jaGlsZHJlbikuZm9yRWFjaChlbCA9PiB7XG4gICAgICBjb25zdCB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoYWxsb3dlZEVsZW1lbnRzLmluZGV4T2YodGFnTmFtZSkgPT09IC0xKSB7XG4gICAgICAgIHdhcm4oXCJVbnJlY29nbml6ZWQgZWxlbWVudCA8XCIuY29uY2F0KHRhZ05hbWUsIFwiPlwiKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxvd2VkQXR0cmlidXRlc1xuICAgKi9cblxuXG4gIGNvbnN0IHNob3dXYXJuaW5nc0ZvckF0dHJpYnV0ZXMgPSAoZWwsIGFsbG93ZWRBdHRyaWJ1dGVzKSA9PiB7XG4gICAgQXJyYXkuZnJvbShlbC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XG4gICAgICBpZiAoYWxsb3dlZEF0dHJpYnV0ZXMuaW5kZXhPZihhdHRyaWJ1dGUubmFtZSkgPT09IC0xKSB7XG4gICAgICAgIHdhcm4oW1wiVW5yZWNvZ25pemVkIGF0dHJpYnV0ZSBcXFwiXCIuY29uY2F0KGF0dHJpYnV0ZS5uYW1lLCBcIlxcXCIgb24gPFwiKS5jb25jYXQoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBcIj4uXCIpLCBcIlwiLmNvbmNhdChhbGxvd2VkQXR0cmlidXRlcy5sZW5ndGggPyBcIkFsbG93ZWQgYXR0cmlidXRlcyBhcmU6IFwiLmNvbmNhdChhbGxvd2VkQXR0cmlidXRlcy5qb2luKCcsICcpKSA6ICdUbyBzZXQgdGhlIHZhbHVlLCB1c2UgSFRNTCB3aXRoaW4gdGhlIGVsZW1lbnQuJyldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICB2YXIgZGVmYXVsdElucHV0VmFsaWRhdG9ycyA9IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGlkYXRpb25NZXNzYWdlXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCB8IHN0cmluZz59XG4gICAgICovXG4gICAgZW1haWw6IChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSA9PiB7XG4gICAgICByZXR1cm4gL15bYS16QS1aMC05LitfLV0rQFthLXpBLVowLTkuLV0rXFwuW2EtekEtWjAtOS1dezIsMjR9JC8udGVzdChzdHJpbmcpID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBQcm9taXNlLnJlc29sdmUodmFsaWRhdGlvbk1lc3NhZ2UgfHwgJ0ludmFsaWQgZW1haWwgYWRkcmVzcycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbGlkYXRpb25NZXNzYWdlXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZCB8IHN0cmluZz59XG4gICAgICovXG4gICAgdXJsOiAoc3RyaW5nLCB2YWxpZGF0aW9uTWVzc2FnZSkgPT4ge1xuICAgICAgLy8gdGFrZW4gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzgwOTQzNSB3aXRoIGEgc21hbGwgY2hhbmdlIGZyb20gIzEzMDYgYW5kICMyMDEzXG4gICAgICByZXR1cm4gL15odHRwcz86XFwvXFwvKHd3d1xcLik/Wy1hLXpBLVowLTlAOiUuXyt+Iz1dezEsMjU2fVxcLlthLXpdezIsNjN9XFxiKFstYS16QS1aMC05QDolXysufiM/Ji89XSopJC8udGVzdChzdHJpbmcpID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBQcm9taXNlLnJlc29sdmUodmFsaWRhdGlvbk1lc3NhZ2UgfHwgJ0ludmFsaWQgVVJMJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBwYXJhbXNcbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpIHtcbiAgICAvLyBVc2UgZGVmYXVsdCBgaW5wdXRWYWxpZGF0b3JgIGZvciBzdXBwb3J0ZWQgaW5wdXQgdHlwZXMgaWYgbm90IHByb3ZpZGVkXG4gICAgaWYgKCFwYXJhbXMuaW5wdXRWYWxpZGF0b3IpIHtcbiAgICAgIE9iamVjdC5rZXlzKGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKHBhcmFtcy5pbnB1dCA9PT0ga2V5KSB7XG4gICAgICAgICAgcGFyYW1zLmlucHV0VmFsaWRhdG9yID0gZGVmYXVsdElucHV0VmFsaWRhdG9yc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlQ3VzdG9tVGFyZ2V0RWxlbWVudChwYXJhbXMpIHtcbiAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBpcyB2YWxpZFxuICAgIGlmICghcGFyYW1zLnRhcmdldCB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCA9PT0gJ3N0cmluZycgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnRhcmdldCkgfHwgdHlwZW9mIHBhcmFtcy50YXJnZXQgIT09ICdzdHJpbmcnICYmICFwYXJhbXMudGFyZ2V0LmFwcGVuZENoaWxkKSB7XG4gICAgICB3YXJuKCdUYXJnZXQgcGFyYW1ldGVyIGlzIG5vdCB2YWxpZCwgZGVmYXVsdGluZyB0byBcImJvZHlcIicpO1xuICAgICAgcGFyYW1zLnRhcmdldCA9ICdib2R5JztcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNldCB0eXBlLCB0ZXh0IGFuZCBhY3Rpb25zIG9uIHBvcHVwXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IHBhcmFtc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHNldFBhcmFtZXRlcnMocGFyYW1zKSB7XG4gICAgc2V0RGVmYXVsdElucHV0VmFsaWRhdG9ycyhwYXJhbXMpOyAvLyBzaG93TG9hZGVyT25Db25maXJtICYmIHByZUNvbmZpcm1cblxuICAgIGlmIChwYXJhbXMuc2hvd0xvYWRlck9uQ29uZmlybSAmJiAhcGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgIHdhcm4oJ3Nob3dMb2FkZXJPbkNvbmZpcm0gaXMgc2V0IHRvIHRydWUsIGJ1dCBwcmVDb25maXJtIGlzIG5vdCBkZWZpbmVkLlxcbicgKyAnc2hvd0xvYWRlck9uQ29uZmlybSBzaG91bGQgYmUgdXNlZCB0b2dldGhlciB3aXRoIHByZUNvbmZpcm0sIHNlZSB1c2FnZSBleGFtcGxlOlxcbicgKyAnaHR0cHM6Ly9zd2VldGFsZXJ0Mi5naXRodWIuaW8vI2FqYXgtcmVxdWVzdCcpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlQ3VzdG9tVGFyZ2V0RWxlbWVudChwYXJhbXMpOyAvLyBSZXBsYWNlIG5ld2xpbmVzIHdpdGggPGJyPiBpbiB0aXRsZVxuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMudGl0bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJhbXMudGl0bGUgPSBwYXJhbXMudGl0bGUuc3BsaXQoJ1xcbicpLmpvaW4oJzxiciAvPicpO1xuICAgIH1cblxuICAgIGluaXQocGFyYW1zKTtcbiAgfVxuXG4gIGNsYXNzIFRpbWVyIHtcbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgZGVsYXkpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgIHRoaXMucmVtYWluaW5nID0gZGVsYXk7XG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuaWQgPSBzZXRUaW1lb3V0KHRoaXMuY2FsbGJhY2ssIHRoaXMucmVtYWluaW5nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMucmVtYWluaW5nIC09IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydGVkLmdldFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cblxuICAgIGluY3JlYXNlKG4pIHtcbiAgICAgIGNvbnN0IHJ1bm5pbmcgPSB0aGlzLnJ1bm5pbmc7XG5cbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbWFpbmluZyArPSBuO1xuXG4gICAgICBpZiAocnVubmluZykge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBnZXRUaW1lckxlZnQoKSB7XG4gICAgICBpZiAodGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJlbWFpbmluZztcbiAgICB9XG5cbiAgICBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uaW5nO1xuICAgIH1cblxuICB9XG5cbiAgY29uc3QgZml4U2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgIC8vIGZvciBxdWV1ZXMsIGRvIG5vdCBkbyB0aGlzIG1vcmUgdGhhbiBvbmNlXG4gICAgaWYgKHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICE9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBpZiB0aGUgYm9keSBoYXMgb3ZlcmZsb3dcblxuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAvLyBhZGQgcGFkZGluZyBzbyB0aGUgY29udGVudCBkb2Vzbid0IHNoaWZ0IGFmdGVyIHJlbW92YWwgb2Ygc2Nyb2xsYmFyXG4gICAgICBzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyA9IHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiXCIuY29uY2F0KHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICsgbWVhc3VyZVNjcm9sbGJhcigpLCBcInB4XCIpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdW5kb1Njcm9sbGJhciA9ICgpID0+IHtcbiAgICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcsIFwicHhcIik7XG4gICAgICBzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBmaWxlICovXG5cbiAgY29uc3QgaU9TZml4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGlPUyA9IC8vIEB0cy1pZ25vcmVcbiAgICAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtIHx8IG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJyAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxO1xuXG4gICAgaWYgKGlPUyAmJiAhaGFzQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IFwiXCIuY29uY2F0KG9mZnNldCAqIC0xLCBcInB4XCIpO1xuICAgICAgYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICAgIGxvY2tCb2R5U2Nyb2xsKCk7XG4gICAgICBhZGRCb3R0b21QYWRkaW5nRm9yVGFsbFBvcHVwcygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMTk0OFxuICAgKi9cblxuICBjb25zdCBhZGRCb3R0b21QYWRkaW5nRm9yVGFsbFBvcHVwcyA9ICgpID0+IHtcbiAgICBjb25zdCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgY29uc3QgaU9TID0gISF1YS5tYXRjaCgvaVBhZC9pKSB8fCAhIXVhLm1hdGNoKC9pUGhvbmUvaSk7XG4gICAgY29uc3Qgd2Via2l0ID0gISF1YS5tYXRjaCgvV2ViS2l0L2kpO1xuICAgIGNvbnN0IGlPU1NhZmFyaSA9IGlPUyAmJiB3ZWJraXQgJiYgIXVhLm1hdGNoKC9DcmlPUy9pKTtcblxuICAgIGlmIChpT1NTYWZhcmkpIHtcbiAgICAgIGNvbnN0IGJvdHRvbVBhbmVsSGVpZ2h0ID0gNDQ7XG5cbiAgICAgIGlmIChnZXRQb3B1cCgpLnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvdHRvbVBhbmVsSGVpZ2h0KSB7XG4gICAgICAgIGdldENvbnRhaW5lcigpLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIlwiLmNvbmNhdChib3R0b21QYW5lbEhlaWdodCwgXCJweFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzEyNDZcbiAgICovXG5cblxuICBjb25zdCBsb2NrQm9keVNjcm9sbCA9ICgpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgICBsZXQgcHJldmVudFRvdWNoTW92ZTtcblxuICAgIGNvbnRhaW5lci5vbnRvdWNoc3RhcnQgPSBlID0+IHtcbiAgICAgIHByZXZlbnRUb3VjaE1vdmUgPSBzaG91bGRQcmV2ZW50VG91Y2hNb3ZlKGUpO1xuICAgIH07XG5cbiAgICBjb250YWluZXIub250b3VjaG1vdmUgPSBlID0+IHtcbiAgICAgIGlmIChwcmV2ZW50VG91Y2hNb3ZlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IHNob3VsZFByZXZlbnRUb3VjaE1vdmUgPSBldmVudCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuXG4gICAgaWYgKGlzU3R5bHVzKGV2ZW50KSB8fCBpc1pvb20oZXZlbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzU2Nyb2xsYWJsZShjb250YWluZXIpICYmIHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIC8vICMxNjAzXG4gICAgdGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScgJiYgLy8gIzIyNjZcbiAgICAhKGlzU2Nyb2xsYWJsZShnZXRIdG1sQ29udGFpbmVyKCkpICYmIC8vICMxOTQ0XG4gICAgZ2V0SHRtbENvbnRhaW5lcigpLmNvbnRhaW5zKHRhcmdldCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE3ODZcbiAgICpcbiAgICogQHBhcmFtIHsqfSBldmVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc1N0eWx1cyA9IGV2ZW50ID0+IHtcbiAgICByZXR1cm4gZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCAmJiBldmVudC50b3VjaGVzWzBdLnRvdWNoVHlwZSA9PT0gJ3N0eWx1cyc7XG4gIH07XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3dlZXRhbGVydDIvc3dlZXRhbGVydDIvaXNzdWVzLzE4OTFcbiAgICpcbiAgICogQHBhcmFtIHtUb3VjaEV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBjb25zdCBpc1pvb20gPSBldmVudCA9PiB7XG4gICAgcmV0dXJuIGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAxO1xuICB9O1xuXG4gIGNvbnN0IHVuZG9JT1NmaXggPSAoKSA9PiB7XG4gICAgaWYgKGhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wLCAxMCk7XG4gICAgICByZW1vdmVDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gb2Zmc2V0ICogLTE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IFNIT1dfQ0xBU1NfVElNRU9VVCA9IDEwO1xuICAvKipcbiAgICogT3BlbiBwb3B1cCwgYWRkIG5lY2Vzc2FyeSBjbGFzc2VzIGFuZCBzdHlsZXMsIGZpeCBzY3JvbGxiYXJcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKi9cblxuICBjb25zdCBvcGVuUG9wdXAgPSBwYXJhbXMgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGlmICh0eXBlb2YgcGFyYW1zLndpbGxPcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwYXJhbXMud2lsbE9wZW4ocG9wdXApO1xuICAgIH1cblxuICAgIGNvbnN0IGJvZHlTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcbiAgICBjb25zdCBpbml0aWFsQm9keU92ZXJmbG93ID0gYm9keVN0eWxlcy5vdmVyZmxvd1k7XG4gICAgYWRkQ2xhc3NlcyQxKGNvbnRhaW5lciwgcG9wdXAsIHBhcmFtcyk7IC8vIHNjcm9sbGluZyBpcyAnaGlkZGVuJyB1bnRpbCBhbmltYXRpb24gaXMgZG9uZSwgYWZ0ZXIgdGhhdCAnYXV0bydcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsaW5nVmlzaWJpbGl0eShjb250YWluZXIsIHBvcHVwKTtcbiAgICB9LCBTSE9XX0NMQVNTX1RJTUVPVVQpO1xuXG4gICAgaWYgKGlzTW9kYWwoKSkge1xuICAgICAgZml4U2Nyb2xsQ29udGFpbmVyKGNvbnRhaW5lciwgcGFyYW1zLnNjcm9sbGJhclBhZGRpbmcsIGluaXRpYWxCb2R5T3ZlcmZsb3cpO1xuICAgICAgc2V0QXJpYUhpZGRlbigpO1xuICAgIH1cblxuICAgIGlmICghaXNUb2FzdCgpICYmICFnbG9iYWxTdGF0ZS5wcmV2aW91c0FjdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuZGlkT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBwYXJhbXMuZGlkT3Blbihwb3B1cCkpO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbJ25vLXRyYW5zaXRpb24nXSk7XG4gIH07XG5cbiAgY29uc3Qgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZCA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBwb3B1cCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICAgIHBvcHVwLnJlbW92ZUV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQpO1xuICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gIH07XG5cbiAgY29uc3Qgc2V0U2Nyb2xsaW5nVmlzaWJpbGl0eSA9IChjb250YWluZXIsIHBvcHVwKSA9PiB7XG4gICAgaWYgKGFuaW1hdGlvbkVuZEV2ZW50ICYmIGhhc0Nzc0FuaW1hdGlvbihwb3B1cCkpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvd1kgPSAnaGlkZGVuJztcbiAgICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBmaXhTY3JvbGxDb250YWluZXIgPSAoY29udGFpbmVyLCBzY3JvbGxiYXJQYWRkaW5nLCBpbml0aWFsQm9keU92ZXJmbG93KSA9PiB7XG4gICAgaU9TZml4KCk7XG5cbiAgICBpZiAoc2Nyb2xsYmFyUGFkZGluZyAmJiBpbml0aWFsQm9keU92ZXJmbG93ICE9PSAnaGlkZGVuJykge1xuICAgICAgZml4U2Nyb2xsYmFyKCk7XG4gICAgfSAvLyBzd2VldGFsZXJ0Mi9pc3N1ZXMvMTI0N1xuXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSAwO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZENsYXNzZXMkMSA9IChjb250YWluZXIsIHBvcHVwLCBwYXJhbXMpID0+IHtcbiAgICBhZGRDbGFzcyhjb250YWluZXIsIHBhcmFtcy5zaG93Q2xhc3MuYmFja2Ryb3ApOyAvLyB0aGlzIHdvcmthcm91bmQgd2l0aCBvcGFjaXR5IGlzIG5lZWRlZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yMDU5XG5cbiAgICBwb3B1cC5zdHlsZS5zZXRQcm9wZXJ0eSgnb3BhY2l0eScsICcwJywgJ2ltcG9ydGFudCcpO1xuICAgIHNob3cocG9wdXAsICdncmlkJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBBbmltYXRlIHBvcHVwIHJpZ2h0IGFmdGVyIHNob3dpbmcgaXRcbiAgICAgIGFkZENsYXNzKHBvcHVwLCBwYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTsgLy8gYW5kIHJlbW92ZSB0aGUgb3BhY2l0eSB3b3JrYXJvdW5kXG5cbiAgICAgIHBvcHVwLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdvcGFjaXR5Jyk7XG4gICAgfSwgU0hPV19DTEFTU19USU1FT1VUKTsgLy8gMTBtcyBpbiBvcmRlciB0byBmaXggIzIwNjJcblxuICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlcy5zaG93bik7XG5cbiAgICBpZiAocGFyYW1zLmhlaWdodEF1dG8gJiYgcGFyYW1zLmJhY2tkcm9wICYmICFwYXJhbXMudG9hc3QpIHtcbiAgICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93cyBsb2FkZXIgKHNwaW5uZXIpLCB0aGlzIGlzIHVzZWZ1bCB3aXRoIEFKQVggcmVxdWVzdHMuXG4gICAqIEJ5IGRlZmF1bHQgdGhlIGxvYWRlciBiZSBzaG93biBpbnN0ZWFkIG9mIHRoZSBcIkNvbmZpcm1cIiBidXR0b24uXG4gICAqL1xuXG4gIGNvbnN0IHNob3dMb2FkaW5nID0gYnV0dG9uVG9SZXBsYWNlID0+IHtcbiAgICBsZXQgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gICAgaWYgKCFwb3B1cCkge1xuICAgICAgbmV3IFN3YWwoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICB9XG5cbiAgICBwb3B1cCA9IGdldFBvcHVwKCk7XG4gICAgY29uc3QgbG9hZGVyID0gZ2V0TG9hZGVyKCk7XG5cbiAgICBpZiAoaXNUb2FzdCgpKSB7XG4gICAgICBoaWRlKGdldEljb24oKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VCdXR0b24ocG9wdXAsIGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgfVxuXG4gICAgc2hvdyhsb2FkZXIpO1xuICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJywgJ3RydWUnKTtcbiAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJyk7XG4gICAgcG9wdXAuZm9jdXMoKTtcbiAgfTtcblxuICBjb25zdCByZXBsYWNlQnV0dG9uID0gKHBvcHVwLCBidXR0b25Ub1JlcGxhY2UpID0+IHtcbiAgICBjb25zdCBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICAgIGNvbnN0IGxvYWRlciA9IGdldExvYWRlcigpO1xuXG4gICAgaWYgKCFidXR0b25Ub1JlcGxhY2UgJiYgaXNWaXNpYmxlKGdldENvbmZpcm1CdXR0b24oKSkpIHtcbiAgICAgIGJ1dHRvblRvUmVwbGFjZSA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICB9XG5cbiAgICBzaG93KGFjdGlvbnMpO1xuXG4gICAgaWYgKGJ1dHRvblRvUmVwbGFjZSkge1xuICAgICAgaGlkZShidXR0b25Ub1JlcGxhY2UpO1xuICAgICAgbG9hZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1idXR0b24tdG8tcmVwbGFjZScsIGJ1dHRvblRvUmVwbGFjZS5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGxvYWRlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShsb2FkZXIsIGJ1dHRvblRvUmVwbGFjZSk7XG4gICAgYWRkQ2xhc3MoW3BvcHVwLCBhY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSW5wdXRPcHRpb25zQW5kVmFsdWUgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGlmIChwYXJhbXMuaW5wdXQgPT09ICdzZWxlY3QnIHx8IHBhcmFtcy5pbnB1dCA9PT0gJ3JhZGlvJykge1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIH0gZWxzZSBpZiAoWyd0ZXh0JywgJ2VtYWlsJywgJ251bWJlcicsICd0ZWwnLCAndGV4dGFyZWEnXS5pbmNsdWRlcyhwYXJhbXMuaW5wdXQpICYmIChoYXNUb1Byb21pc2VGbihwYXJhbXMuaW5wdXRWYWx1ZSkgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dFZhbHVlKSkpIHtcbiAgICAgIHNob3dMb2FkaW5nKGdldENvbmZpcm1CdXR0b24oKSk7XG4gICAgICBoYW5kbGVJbnB1dFZhbHVlKGluc3RhbmNlLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZ2V0SW5wdXRWYWx1ZSA9IChpbnN0YW5jZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG5cbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGlubmVyUGFyYW1zLmlucHV0KSB7XG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHJldHVybiBnZXRDaGVja2JveFZhbHVlKGlucHV0KTtcblxuICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICByZXR1cm4gZ2V0UmFkaW9WYWx1ZShpbnB1dCk7XG5cbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0RmlsZVZhbHVlKGlucHV0KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGlubmVyUGFyYW1zLmlucHV0QXV0b1RyaW0gPyBpbnB1dC52YWx1ZS50cmltKCkgOiBpbnB1dC52YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZ2V0Q2hlY2tib3hWYWx1ZSA9IGlucHV0ID0+IGlucHV0LmNoZWNrZWQgPyAxIDogMDtcblxuICBjb25zdCBnZXRSYWRpb1ZhbHVlID0gaW5wdXQgPT4gaW5wdXQuY2hlY2tlZCA/IGlucHV0LnZhbHVlIDogbnVsbDtcblxuICBjb25zdCBnZXRGaWxlVmFsdWUgPSBpbnB1dCA9PiBpbnB1dC5maWxlcy5sZW5ndGggPyBpbnB1dC5nZXRBdHRyaWJ1dGUoJ211bHRpcGxlJykgIT09IG51bGwgPyBpbnB1dC5maWxlcyA6IGlucHV0LmZpbGVzWzBdIDogbnVsbDtcblxuICBjb25zdCBoYW5kbGVJbnB1dE9wdGlvbnMgPSAoaW5zdGFuY2UsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICAgIGNvbnN0IHByb2Nlc3NJbnB1dE9wdGlvbnMgPSBpbnB1dE9wdGlvbnMgPT4gcG9wdWxhdGVJbnB1dE9wdGlvbnNbcGFyYW1zLmlucHV0XShwb3B1cCwgZm9ybWF0SW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucyksIHBhcmFtcyk7XG5cbiAgICBpZiAoaGFzVG9Qcm9taXNlRm4ocGFyYW1zLmlucHV0T3B0aW9ucykgfHwgaXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpKSB7XG4gICAgICBzaG93TG9hZGluZyhnZXRDb25maXJtQnV0dG9uKCkpO1xuICAgICAgYXNQcm9taXNlKHBhcmFtcy5pbnB1dE9wdGlvbnMpLnRoZW4oaW5wdXRPcHRpb25zID0+IHtcbiAgICAgICAgaW5zdGFuY2UuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHByb2Nlc3NJbnB1dE9wdGlvbnMocGFyYW1zLmlucHV0T3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIGlucHV0T3B0aW9ucyEgRXhwZWN0ZWQgb2JqZWN0LCBNYXAgb3IgUHJvbWlzZSwgZ290IFwiLmNvbmNhdCh0eXBlb2YgcGFyYW1zLmlucHV0T3B0aW9ucykpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbnB1dFZhbHVlID0gKGluc3RhbmNlLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IGluc3RhbmNlLmdldElucHV0KCk7XG4gICAgaGlkZShpbnB1dCk7XG4gICAgYXNQcm9taXNlKHBhcmFtcy5pbnB1dFZhbHVlKS50aGVuKGlucHV0VmFsdWUgPT4ge1xuICAgICAgaW5wdXQudmFsdWUgPSBwYXJhbXMuaW5wdXQgPT09ICdudW1iZXInID8gcGFyc2VGbG9hdChpbnB1dFZhbHVlKSB8fCAwIDogXCJcIi5jb25jYXQoaW5wdXRWYWx1ZSk7XG4gICAgICBzaG93KGlucHV0KTtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBlcnJvcihcIkVycm9yIGluIGlucHV0VmFsdWUgcHJvbWlzZTogXCIuY29uY2F0KGVycikpO1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIHNob3coaW5wdXQpO1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICAgIGluc3RhbmNlLmhpZGVMb2FkaW5nKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcG9wdWxhdGVJbnB1dE9wdGlvbnMgPSB7XG4gICAgc2VsZWN0OiAocG9wdXAsIGlucHV0T3B0aW9ucywgcGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3QgPSBnZXREaXJlY3RDaGlsZEJ5Q2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNlbGVjdCk7XG5cbiAgICAgIGNvbnN0IHJlbmRlck9wdGlvbiA9IChwYXJlbnQsIG9wdGlvbkxhYmVsLCBvcHRpb25WYWx1ZSkgPT4ge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gb3B0aW9uVmFsdWU7XG4gICAgICAgIHNldElubmVySHRtbChvcHRpb24sIG9wdGlvbkxhYmVsKTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gaXNTZWxlY3RlZChvcHRpb25WYWx1ZSwgcGFyYW1zLmlucHV0VmFsdWUpO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICAgIH07XG5cbiAgICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGlucHV0T3B0aW9uID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBpbnB1dE9wdGlvblswXTtcbiAgICAgICAgY29uc3Qgb3B0aW9uTGFiZWwgPSBpbnB1dE9wdGlvblsxXTsgLy8gPG9wdGdyb3VwPiBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDQwMS9pbnRlcmFjdC9mb3Jtcy5odG1sI2gtMTcuNlxuICAgICAgICAvLyBcIi4uLmFsbCBPUFRHUk9VUCBlbGVtZW50cyBtdXN0IGJlIHNwZWNpZmllZCBkaXJlY3RseSB3aXRoaW4gYSBTRUxFQ1QgZWxlbWVudCAoaS5lLiwgZ3JvdXBzIG1heSBub3QgYmUgbmVzdGVkKS4uLlwiXG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyBpcyBhIDxvcHRncm91cD5cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25MYWJlbCkpIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBhbiBhcnJheSwgdGhlbiBpdCBpcyBhbiA8b3B0Z3JvdXA+XG4gICAgICAgICAgY29uc3Qgb3B0Z3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpO1xuICAgICAgICAgIG9wdGdyb3VwLmxhYmVsID0gb3B0aW9uVmFsdWU7XG4gICAgICAgICAgb3B0Z3JvdXAuZGlzYWJsZWQgPSBmYWxzZTsgLy8gbm90IGNvbmZpZ3VyYWJsZSBmb3Igbm93XG5cbiAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0Z3JvdXApO1xuICAgICAgICAgIG9wdGlvbkxhYmVsLmZvckVhY2gobyA9PiByZW5kZXJPcHRpb24ob3B0Z3JvdXAsIG9bMV0sIG9bMF0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYXNlIG9mIDxvcHRpb24+XG4gICAgICAgICAgcmVuZGVyT3B0aW9uKHNlbGVjdCwgb3B0aW9uTGFiZWwsIG9wdGlvblZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzZWxlY3QuZm9jdXMoKTtcbiAgICB9LFxuICAgIHJhZGlvOiAocG9wdXAsIGlucHV0T3B0aW9ucywgcGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCByYWRpbyA9IGdldERpcmVjdENoaWxkQnlDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMucmFkaW8pO1xuICAgICAgaW5wdXRPcHRpb25zLmZvckVhY2goaW5wdXRPcHRpb24gPT4ge1xuICAgICAgICBjb25zdCByYWRpb1ZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBpbnB1dE9wdGlvblsxXTtcbiAgICAgICAgY29uc3QgcmFkaW9JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGNvbnN0IHJhZGlvTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgcmFkaW9JbnB1dC50eXBlID0gJ3JhZGlvJztcbiAgICAgICAgcmFkaW9JbnB1dC5uYW1lID0gc3dhbENsYXNzZXMucmFkaW87XG4gICAgICAgIHJhZGlvSW5wdXQudmFsdWUgPSByYWRpb1ZhbHVlO1xuXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKHJhZGlvVmFsdWUsIHBhcmFtcy5pbnB1dFZhbHVlKSkge1xuICAgICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgc2V0SW5uZXJIdG1sKGxhYmVsLCByYWRpb0xhYmVsKTtcbiAgICAgICAgbGFiZWwuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMubGFiZWw7XG4gICAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHJhZGlvSW5wdXQpO1xuICAgICAgICByYWRpb0xhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgIHJhZGlvLmFwcGVuZENoaWxkKHJhZGlvTGFiZWxFbGVtZW50KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmFkaW9zID0gcmFkaW8ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcblxuICAgICAgaWYgKHJhZGlvcy5sZW5ndGgpIHtcbiAgICAgICAgcmFkaW9zWzBdLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ29udmVydHMgYGlucHV0T3B0aW9uc2AgaW50byBhbiBhcnJheSBvZiBgW3ZhbHVlLCBsYWJlbF1gc1xuICAgKiBAcGFyYW0gaW5wdXRPcHRpb25zXG4gICAqL1xuXG4gIGNvbnN0IGZvcm1hdElucHV0T3B0aW9ucyA9IGlucHV0T3B0aW9ucyA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBpZiAodHlwZW9mIE1hcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW5wdXRPcHRpb25zIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBsZXQgdmFsdWVGb3JtYXR0ZWQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlRm9ybWF0dGVkID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vIGNhc2Ugb2YgPG9wdGdyb3VwPlxuICAgICAgICAgIHZhbHVlRm9ybWF0dGVkID0gZm9ybWF0SW5wdXRPcHRpb25zKHZhbHVlRm9ybWF0dGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlRm9ybWF0dGVkXSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMoaW5wdXRPcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZUZvcm1hdHRlZCA9IGlucHV0T3B0aW9uc1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVGb3JtYXR0ZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gY2FzZSBvZiA8b3B0Z3JvdXA+XG4gICAgICAgICAgdmFsdWVGb3JtYXR0ZWQgPSBmb3JtYXRJbnB1dE9wdGlvbnModmFsdWVGb3JtYXR0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goW2tleSwgdmFsdWVGb3JtYXR0ZWRdKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgaXNTZWxlY3RlZCA9IChvcHRpb25WYWx1ZSwgaW5wdXRWYWx1ZSkgPT4ge1xuICAgIHJldHVybiBpbnB1dFZhbHVlICYmIGlucHV0VmFsdWUudG9TdHJpbmcoKSA9PT0gb3B0aW9uVmFsdWUudG9TdHJpbmcoKTtcbiAgfTtcblxuICAvKipcbiAgICogSGlkZXMgbG9hZGVyIGFuZCBzaG93cyBiYWNrIHRoZSBidXR0b24gd2hpY2ggd2FzIGhpZGRlbiBieSAuc2hvd0xvYWRpbmcoKVxuICAgKi9cblxuICBmdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgICAvLyBkbyBub3RoaW5nIGlmIHBvcHVwIGlzIGNsb3NlZFxuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgaGlkZShkb21DYWNoZS5sb2FkZXIpO1xuXG4gICAgaWYgKGlzVG9hc3QoKSkge1xuICAgICAgaWYgKGlubmVyUGFyYW1zLmljb24pIHtcbiAgICAgICAgc2hvdyhnZXRJY29uKCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzaG93UmVsYXRlZEJ1dHRvbihkb21DYWNoZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2xhc3MoW2RvbUNhY2hlLnBvcHVwLCBkb21DYWNoZS5hY3Rpb25zXSwgc3dhbENsYXNzZXMubG9hZGluZyk7XG4gICAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWJ1c3knKTtcbiAgICBkb21DYWNoZS5wb3B1cC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycpO1xuICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBkb21DYWNoZS5kZW55QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzaG93UmVsYXRlZEJ1dHRvbiA9IGRvbUNhY2hlID0+IHtcbiAgICBjb25zdCBidXR0b25Ub1JlcGxhY2UgPSBkb21DYWNoZS5wb3B1cC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGRvbUNhY2hlLmxvYWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtYnV0dG9uLXRvLXJlcGxhY2UnKSk7XG5cbiAgICBpZiAoYnV0dG9uVG9SZXBsYWNlLmxlbmd0aCkge1xuICAgICAgc2hvdyhidXR0b25Ub1JlcGxhY2VbMF0sICdpbmxpbmUtYmxvY2snKTtcbiAgICB9IGVsc2UgaWYgKGFsbEJ1dHRvbnNBcmVIaWRkZW4oKSkge1xuICAgICAgaGlkZShkb21DYWNoZS5hY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlucHV0IERPTSBub2RlLCB0aGlzIG1ldGhvZCB3b3JrcyB3aXRoIGlucHV0IHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAgICovXG5cbiAgZnVuY3Rpb24gZ2V0SW5wdXQkMShpbnN0YW5jZSkge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSB8fCB0aGlzKTtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UgfHwgdGhpcyk7XG5cbiAgICBpZiAoIWRvbUNhY2hlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0SW5wdXQoZG9tQ2FjaGUucG9wdXAsIGlubmVyUGFyYW1zLmlucHV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1vZHVsZSBjb250YWlucyBgV2Vha01hcGBzIGZvciBlYWNoIGVmZmVjdGl2ZWx5LVwicHJpdmF0ZSAgcHJvcGVydHlcIiB0aGF0IGEgYFN3YWxgIGhhcy5cbiAgICogRm9yIGV4YW1wbGUsIHRvIHNldCB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBcImZvb1wiIG9mIGB0aGlzYCB0byBcImJhclwiLCB5b3UgY2FuIGBwcml2YXRlUHJvcHMuZm9vLnNldCh0aGlzLCAnYmFyJylgXG4gICAqIFRoaXMgaXMgdGhlIGFwcHJvYWNoIHRoYXQgQmFiZWwgd2lsbCBwcm9iYWJseSB0YWtlIHRvIGltcGxlbWVudCBwcml2YXRlIG1ldGhvZHMvZmllbGRzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJpdmF0ZS1tZXRob2RzXG4gICAqICAgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvNzU1NVxuICAgKiBPbmNlIHdlIGhhdmUgdGhlIGNoYW5nZXMgZnJvbSB0aGF0IFBSIGluIEJhYmVsLCBhbmQgb3VyIGNvcmUgY2xhc3MgZml0cyByZWFzb25hYmxlIGluICpvbmUgbW9kdWxlKlxuICAgKiAgIHRoZW4gd2UgY2FuIHVzZSB0aGF0IGxhbmd1YWdlIGZlYXR1cmUuXG4gICAqL1xuICB2YXIgcHJpdmF0ZU1ldGhvZHMgPSB7XG4gICAgc3dhbFByb21pc2VSZXNvbHZlOiBuZXcgV2Vha01hcCgpLFxuICAgIHN3YWxQcm9taXNlUmVqZWN0OiBuZXcgV2Vha01hcCgpXG4gIH07XG5cbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBTd2VldEFsZXJ0MiBwb3B1cCBpcyBzaG93blxuICAgKi9cblxuICBjb25zdCBpc1Zpc2libGUkMSA9ICgpID0+IHtcbiAgICByZXR1cm4gaXNWaXNpYmxlKGdldFBvcHVwKCkpO1xuICB9O1xuICAvKlxuICAgKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NvbmZpcm0nIGJ1dHRvblxuICAgKi9cblxuICBjb25zdCBjbGlja0NvbmZpcm0gPSAoKSA9PiBnZXRDb25maXJtQnV0dG9uKCkgJiYgZ2V0Q29uZmlybUJ1dHRvbigpLmNsaWNrKCk7XG4gIC8qXG4gICAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnRGVueScgYnV0dG9uXG4gICAqL1xuXG4gIGNvbnN0IGNsaWNrRGVueSA9ICgpID0+IGdldERlbnlCdXR0b24oKSAmJiBnZXREZW55QnV0dG9uKCkuY2xpY2soKTtcbiAgLypcbiAgICogR2xvYmFsIGZ1bmN0aW9uIHRvIGNsaWNrICdDYW5jZWwnIGJ1dHRvblxuICAgKi9cblxuICBjb25zdCBjbGlja0NhbmNlbCA9ICgpID0+IGdldENhbmNlbEJ1dHRvbigpICYmIGdldENhbmNlbEJ1dHRvbigpLmNsaWNrKCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqL1xuXG4gIGNvbnN0IHJlbW92ZUtleWRvd25IYW5kbGVyID0gZ2xvYmFsU3RhdGUgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0ICYmIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7R2xvYmFsU3RhdGV9IGdsb2JhbFN0YXRlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7Kn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3QgYWRkS2V5ZG93bkhhbmRsZXIgPSAoaW5zdGFuY2UsIGdsb2JhbFN0YXRlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICByZW1vdmVLZXlkb3duSGFuZGxlcihnbG9iYWxTdGF0ZSk7XG5cbiAgICBpZiAoIWlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciA9IGUgPT4ga2V5ZG93bkhhbmRsZXIoaW5zdGFuY2UsIGUsIGRpc21pc3NXaXRoKTtcblxuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldCA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmUgPyB3aW5kb3cgOiBnZXRQb3B1cCgpO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSA9IGlubmVyUGFyYW1zLmtleWRvd25MaXN0ZW5lckNhcHR1cmU7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlciwge1xuICAgICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgICB9KTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5jcmVtZW50XG4gICAqL1xuXG4gIGNvbnN0IHNldEZvY3VzID0gKGlubmVyUGFyYW1zLCBpbmRleCwgaW5jcmVtZW50KSA9PiB7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cygpOyAvLyBzZWFyY2ggZm9yIHZpc2libGUgZWxlbWVudHMgYW5kIHNlbGVjdCB0aGUgbmV4dCBwb3NzaWJsZSBtYXRjaFxuXG4gICAgaWYgKGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgaW5kZXggPSBpbmRleCArIGluY3JlbWVudDsgLy8gcm9sbG92ZXIgdG8gZmlyc3QgaXRlbVxuXG4gICAgICBpZiAoaW5kZXggPT09IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBpbmRleCA9IDA7IC8vIGdvIHRvIGxhc3QgaXRlbVxuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgaW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm9jdXNhYmxlRWxlbWVudHNbaW5kZXhdLmZvY3VzKCk7XG4gICAgfSAvLyBubyB2aXNpYmxlIGZvY3VzYWJsZSBlbGVtZW50cywgZm9jdXMgdGhlIHBvcHVwXG5cblxuICAgIGdldFBvcHVwKCkuZm9jdXMoKTtcbiAgfTtcbiAgY29uc3QgYXJyb3dLZXlzTmV4dEJ1dHRvbiA9IFsnQXJyb3dSaWdodCcsICdBcnJvd0Rvd24nXTtcbiAgY29uc3QgYXJyb3dLZXlzUHJldmlvdXNCdXR0b24gPSBbJ0Fycm93TGVmdCcsICdBcnJvd1VwJ107XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3Qga2V5ZG93bkhhbmRsZXIgPSAoaW5zdGFuY2UsIGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIHJldHVybjsgLy8gVGhpcyBpbnN0YW5jZSBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZFxuICAgIH0gLy8gSWdub3JlIGtleWRvd24gZHVyaW5nIElNRSBjb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Eb2N1bWVudC9rZXlkb3duX2V2ZW50I2lnbm9yaW5nX2tleWRvd25fZHVyaW5nX2ltZV9jb21wb3NpdGlvblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvNzIwXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2lzc3Vlcy8yNDA2XG5cblxuICAgIGlmIChlLmlzQ29tcG9zaW5nIHx8IGUua2V5Q29kZSA9PT0gMjI5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnN0b3BLZXlkb3duUHJvcGFnYXRpb24pIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSAvLyBFTlRFUlxuXG5cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgIGhhbmRsZUVudGVyKGluc3RhbmNlLCBlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBUQUJcbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ1RhYicpIHtcbiAgICAgIGhhbmRsZVRhYihlLCBpbm5lclBhcmFtcyk7XG4gICAgfSAvLyBBUlJPV1MgLSBzd2l0Y2ggZm9jdXMgYmV0d2VlbiBidXR0b25zXG4gICAgZWxzZSBpZiAoWy4uLmFycm93S2V5c05leHRCdXR0b24sIC4uLmFycm93S2V5c1ByZXZpb3VzQnV0dG9uXS5pbmNsdWRlcyhlLmtleSkpIHtcbiAgICAgIGhhbmRsZUFycm93cyhlLmtleSk7XG4gICAgfSAvLyBFU0NcbiAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGhhbmRsZUVzYyhlLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUVudGVyID0gKGluc3RhbmNlLCBlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi9pc3N1ZXMvMjM4NlxuICAgIGlmICghY2FsbElmRnVuY3Rpb24oaW5uZXJQYXJhbXMuYWxsb3dFbnRlcktleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZS50YXJnZXQgJiYgaW5zdGFuY2UuZ2V0SW5wdXQoKSAmJiBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGUudGFyZ2V0Lm91dGVySFRNTCA9PT0gaW5zdGFuY2UuZ2V0SW5wdXQoKS5vdXRlckhUTUwpIHtcbiAgICAgIGlmIChbJ3RleHRhcmVhJywgJ2ZpbGUnXS5pbmNsdWRlcyhpbm5lclBhcmFtcy5pbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuOyAvLyBkbyBub3Qgc3VibWl0XG4gICAgICB9XG5cbiAgICAgIGNsaWNrQ29uZmlybSgpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZVRhYiA9IChlLCBpbm5lclBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldDtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKCk7XG4gICAgbGV0IGJ0bkluZGV4ID0gLTE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGFyZ2V0RWxlbWVudCA9PT0gZm9jdXNhYmxlRWxlbWVudHNbaV0pIHtcbiAgICAgICAgYnRuSW5kZXggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IC8vIEN5Y2xlIHRvIHRoZSBuZXh0IGJ1dHRvblxuXG5cbiAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCBidG5JbmRleCwgMSk7XG4gICAgfSAvLyBDeWNsZSB0byB0aGUgcHJldiBidXR0b25cbiAgICBlbHNlIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCBidG5JbmRleCwgLTEpO1xuICAgIH1cblxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKi9cblxuXG4gIGNvbnN0IGhhbmRsZUFycm93cyA9IGtleSA9PiB7XG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgICBjb25zdCBkZW55QnV0dG9uID0gZ2V0RGVueUJ1dHRvbigpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpO1xuXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhW2NvbmZpcm1CdXR0b24sIGRlbnlCdXR0b24sIGNhbmNlbEJ1dHRvbl0uaW5jbHVkZXMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzaWJsaW5nID0gYXJyb3dLZXlzTmV4dEJ1dHRvbi5pbmNsdWRlcyhrZXkpID8gJ25leHRFbGVtZW50U2libGluZycgOiAncHJldmlvdXNFbGVtZW50U2libGluZyc7XG4gICAgbGV0IGJ1dHRvblRvRm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnZXRBY3Rpb25zKCkuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1dHRvblRvRm9jdXMgPSBidXR0b25Ub0ZvY3VzW3NpYmxpbmddO1xuXG4gICAgICBpZiAoIWJ1dHRvblRvRm9jdXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnV0dG9uVG9Gb2N1cyBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50ICYmIGlzVmlzaWJsZShidXR0b25Ub0ZvY3VzKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYnV0dG9uVG9Gb2N1cyBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICBidXR0b25Ub0ZvY3VzLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBlXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydE9wdGlvbnN9IGlubmVyUGFyYW1zXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpc21pc3NXaXRoXG4gICAqL1xuXG5cbiAgY29uc3QgaGFuZGxlRXNjID0gKGUsIGlubmVyUGFyYW1zLCBkaXNtaXNzV2l0aCkgPT4ge1xuICAgIGlmIChjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VzY2FwZUtleSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRpc21pc3NXaXRoKERpc21pc3NSZWFzb24uZXNjKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogSW5zdGFuY2UgbWV0aG9kIHRvIGNsb3NlIHN3ZWV0QWxlcnRcbiAgICovXG5cbiAgZnVuY3Rpb24gcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGluc3RhbmNlLCBjb250YWluZXIsIHJldHVybkZvY3VzLCBkaWRDbG9zZSkge1xuICAgIGlmIChpc1RvYXN0KCkpIHtcbiAgICAgIHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UoaW5zdGFuY2UsIGRpZENsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdG9yZUFjdGl2ZUVsZW1lbnQocmV0dXJuRm9jdXMpLnRoZW4oKCkgPT4gdHJpZ2dlckRpZENsb3NlQW5kRGlzcG9zZShpbnN0YW5jZSwgZGlkQ2xvc2UpKTtcbiAgICAgIHJlbW92ZUtleWRvd25IYW5kbGVyKGdsb2JhbFN0YXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1NhZmFyaSA9IC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIHdvcmthcm91bmQgZm9yICMyMDg4XG4gICAgLy8gZm9yIHNvbWUgcmVhc29uIHJlbW92aW5nIHRoZSBjb250YWluZXIgaW4gU2FmYXJpIHdpbGwgc2Nyb2xsIHRoZSBkb2N1bWVudCB0byBib3R0b21cblxuICAgIGlmIChpc1NhZmFyaSkge1xuICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lICFpbXBvcnRhbnQnKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICB1bmRvU2Nyb2xsYmFyKCk7XG4gICAgICB1bmRvSU9TZml4KCk7XG4gICAgICB1bnNldEFyaWFIaWRkZW4oKTtcbiAgICB9XG5cbiAgICByZW1vdmVCb2R5Q2xhc3NlcygpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQm9keUNsYXNzZXMoKSB7XG4gICAgcmVtb3ZlQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keV0sIFtzd2FsQ2xhc3Nlcy5zaG93biwgc3dhbENsYXNzZXNbJ2hlaWdodC1hdXRvJ10sIHN3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UocmVzb2x2ZVZhbHVlKSB7XG4gICAgcmVzb2x2ZVZhbHVlID0gcHJlcGFyZVJlc29sdmVWYWx1ZShyZXNvbHZlVmFsdWUpO1xuICAgIGNvbnN0IHN3YWxQcm9taXNlUmVzb2x2ZSA9IHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5nZXQodGhpcyk7XG4gICAgY29uc3QgZGlkQ2xvc2UgPSB0cmlnZ2VyQ2xvc2VQb3B1cCh0aGlzKTtcblxuICAgIGlmICh0aGlzLmlzQXdhaXRpbmdQcm9taXNlKCkpIHtcbiAgICAgIC8vIEEgc3dhbCBhd2FpdGluZyBmb3IgYSBwcm9taXNlIChhZnRlciBhIGNsaWNrIG9uIENvbmZpcm0gb3IgRGVueSkgY2Fubm90IGJlIGRpc21pc3NlZCBhbnltb3JlICMyMzM1XG4gICAgICBpZiAoIXJlc29sdmVWYWx1ZS5pc0Rpc21pc3NlZCkge1xuICAgICAgICBoYW5kbGVBd2FpdGluZ1Byb21pc2UodGhpcyk7XG4gICAgICAgIHN3YWxQcm9taXNlUmVzb2x2ZShyZXNvbHZlVmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlkQ2xvc2UpIHtcbiAgICAgIC8vIFJlc29sdmUgU3dhbCBwcm9taXNlXG4gICAgICBzd2FsUHJvbWlzZVJlc29sdmUocmVzb2x2ZVZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaXNBd2FpdGluZ1Byb21pc2UoKSB7XG4gICAgcmV0dXJuICEhcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5nZXQodGhpcyk7XG4gIH1cblxuICBjb25zdCB0cmlnZ2VyQ2xvc2VQb3B1cCA9IGluc3RhbmNlID0+IHtcbiAgICBjb25zdCBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgICBpZiAoIXBvcHVwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMgfHwgaGFzQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5wb3B1cCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuc2hvd0NsYXNzLnBvcHVwKTtcbiAgICBhZGRDbGFzcyhwb3B1cCwgaW5uZXJQYXJhbXMuaGlkZUNsYXNzLnBvcHVwKTtcbiAgICBjb25zdCBiYWNrZHJvcCA9IGdldENvbnRhaW5lcigpO1xuICAgIHJlbW92ZUNsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5zaG93Q2xhc3MuYmFja2Ryb3ApO1xuICAgIGFkZENsYXNzKGJhY2tkcm9wLCBpbm5lclBhcmFtcy5oaWRlQ2xhc3MuYmFja2Ryb3ApO1xuICAgIGhhbmRsZVBvcHVwQW5pbWF0aW9uKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlamVjdFByb21pc2UoZXJyb3IpIHtcbiAgICBjb25zdCByZWplY3RQcm9taXNlID0gcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3QuZ2V0KHRoaXMpO1xuICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZSh0aGlzKTtcblxuICAgIGlmIChyZWplY3RQcm9taXNlKSB7XG4gICAgICAvLyBSZWplY3QgU3dhbCBwcm9taXNlXG4gICAgICByZWplY3RQcm9taXNlKGVycm9yKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgaGFuZGxlQXdhaXRpbmdQcm9taXNlID0gaW5zdGFuY2UgPT4ge1xuICAgIGlmIChpbnN0YW5jZS5pc0F3YWl0aW5nUHJvbWlzZSgpKSB7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLmRlbGV0ZShpbnN0YW5jZSk7IC8vIFRoZSBpbnN0YW5jZSBtaWdodCBoYXZlIGJlZW4gcHJldmlvdXNseSBwYXJ0bHkgZGVzdHJveWVkLCB3ZSBtdXN0IHJlc3VtZSB0aGUgZGVzdHJveSBwcm9jZXNzIGluIHRoaXMgY2FzZSAjMjMzNVxuXG4gICAgICBpZiAoIXByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpKSB7XG4gICAgICAgIGluc3RhbmNlLl9kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHByZXBhcmVSZXNvbHZlVmFsdWUgPSByZXNvbHZlVmFsdWUgPT4ge1xuICAgIC8vIFdoZW4gdXNlciBjYWxscyBTd2FsLmNsb3NlKClcbiAgICBpZiAodHlwZW9mIHJlc29sdmVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzQ29uZmlybWVkOiBmYWxzZSxcbiAgICAgICAgaXNEZW5pZWQ6IGZhbHNlLFxuICAgICAgICBpc0Rpc21pc3NlZDogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpc0NvbmZpcm1lZDogZmFsc2UsXG4gICAgICBpc0RlbmllZDogZmFsc2UsXG4gICAgICBpc0Rpc21pc3NlZDogZmFsc2VcbiAgICB9LCByZXNvbHZlVmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvcHVwQW5pbWF0aW9uID0gKGluc3RhbmNlLCBwb3B1cCwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTsgLy8gSWYgYW5pbWF0aW9uIGlzIHN1cHBvcnRlZCwgYW5pbWF0ZVxuXG4gICAgY29uc3QgYW5pbWF0aW9uSXNTdXBwb3J0ZWQgPSBhbmltYXRpb25FbmRFdmVudCAmJiBoYXNDc3NBbmltYXRpb24ocG9wdXApO1xuXG4gICAgaWYgKHR5cGVvZiBpbm5lclBhcmFtcy53aWxsQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlubmVyUGFyYW1zLndpbGxDbG9zZShwb3B1cCk7XG4gICAgfVxuXG4gICAgaWYgKGFuaW1hdGlvbklzU3VwcG9ydGVkKSB7XG4gICAgICBhbmltYXRlUG9wdXAoaW5zdGFuY2UsIHBvcHVwLCBjb250YWluZXIsIGlubmVyUGFyYW1zLnJldHVybkZvY3VzLCBpbm5lclBhcmFtcy5kaWRDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgcmVtb3ZlIGltbWVkaWF0ZWx5XG4gICAgICByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUoaW5zdGFuY2UsIGNvbnRhaW5lciwgaW5uZXJQYXJhbXMucmV0dXJuRm9jdXMsIGlubmVyUGFyYW1zLmRpZENsb3NlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYW5pbWF0ZVBvcHVwID0gKGluc3RhbmNlLCBwb3B1cCwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpID0+IHtcbiAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2sgPSByZW1vdmVQb3B1cEFuZFJlc2V0U3RhdGUuYmluZChudWxsLCBpbnN0YW5jZSwgY29udGFpbmVyLCByZXR1cm5Gb2N1cywgZGlkQ2xvc2UpO1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IHBvcHVwKSB7XG4gICAgICAgIGdsb2JhbFN0YXRlLnN3YWxDbG9zZUV2ZW50RmluaXNoZWRDYWxsYmFjaygpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHRyaWdnZXJEaWRDbG9zZUFuZERpc3Bvc2UgPSAoaW5zdGFuY2UsIGRpZENsb3NlKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGRpZENsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRpZENsb3NlLmJpbmQoaW5zdGFuY2UucGFyYW1zKSgpO1xuICAgICAgfVxuXG4gICAgICBpbnN0YW5jZS5fZGVzdHJveSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNldEJ1dHRvbnNEaXNhYmxlZChpbnN0YW5jZSwgYnV0dG9ucywgZGlzYWJsZWQpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UpO1xuICAgIGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgZG9tQ2FjaGVbYnV0dG9uXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0SW5wdXREaXNhYmxlZChpbnB1dCwgZGlzYWJsZWQpIHtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIGNvbnN0IHJhZGlvc0NvbnRhaW5lciA9IGlucHV0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgIGNvbnN0IHJhZGlvcyA9IHJhZGlvc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByYWRpb3NbaV0uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGVCdXR0b25zKCkge1xuICAgIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnZGVueUJ1dHRvbicsICdjYW5jZWxCdXR0b24nXSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKCkge1xuICAgIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnZGVueUJ1dHRvbicsICdjYW5jZWxCdXR0b24nXSwgdHJ1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gZW5hYmxlSW5wdXQoKSB7XG4gICAgcmV0dXJuIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGlzYWJsZUlucHV0KCkge1xuICAgIHJldHVybiBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93VmFsaWRhdGlvbk1lc3NhZ2UoZXJyb3IpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgY29uc3QgcGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgICBzZXRJbm5lckh0bWwoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UsIGVycm9yKTtcbiAgICBkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZS5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ107XG5cbiAgICBpZiAocGFyYW1zLmN1c3RvbUNsYXNzICYmIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgYWRkQ2xhc3MoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UsIHBhcmFtcy5jdXN0b21DbGFzcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfVxuXG4gICAgc2hvdyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0KCk7XG5cbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgdHJ1ZSk7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBzd2FsQ2xhc3Nlc1sndmFsaWRhdGlvbi1tZXNzYWdlJ10pO1xuICAgICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgICBhZGRDbGFzcyhpbnB1dCwgc3dhbENsYXNzZXMuaW5wdXRlcnJvcik7XG4gICAgfVxuICB9IC8vIEhpZGUgYmxvY2sgd2l0aCB2YWxpZGF0aW9uIG1lc3NhZ2VcblxuICBmdW5jdGlvbiByZXNldFZhbGlkYXRpb25NZXNzYWdlJDEoKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuXG4gICAgaWYgKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICBoaWRlKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTtcbiAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgcmVtb3ZlQ2xhc3MoaW5wdXQsIHN3YWxDbGFzc2VzLmlucHV0ZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb2dyZXNzU3RlcHMkMSgpIHtcbiAgICBjb25zdCBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gICAgcmV0dXJuIGRvbUNhY2hlLnByb2dyZXNzU3RlcHM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBwb3B1cCBwYXJhbWV0ZXJzLlxuICAgKi9cblxuICBmdW5jdGlvbiB1cGRhdGUocGFyYW1zKSB7XG4gICAgY29uc3QgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghcG9wdXAgfHwgaGFzQ2xhc3MocG9wdXAsIGlubmVyUGFyYW1zLmhpZGVDbGFzcy5wb3B1cCkpIHtcbiAgICAgIHJldHVybiB3YXJuKFwiWW91J3JlIHRyeWluZyB0byB1cGRhdGUgdGhlIGNsb3NlZCBvciBjbG9zaW5nIHBvcHVwLCB0aGF0IHdvbid0IHdvcmsuIFVzZSB0aGUgdXBkYXRlKCkgbWV0aG9kIGluIHByZUNvbmZpcm0gcGFyYW1ldGVyIG9yIHNob3cgYSBuZXcgcG9wdXAuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkVXBkYXRhYmxlUGFyYW1zID0gZmlsdGVyVmFsaWRQYXJhbXMocGFyYW1zKTtcbiAgICBjb25zdCB1cGRhdGVkUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgaW5uZXJQYXJhbXMsIHZhbGlkVXBkYXRhYmxlUGFyYW1zKTtcbiAgICByZW5kZXIodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gICAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldCh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyYW1zLCBwYXJhbXMpLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGZpbHRlclZhbGlkUGFyYW1zID0gcGFyYW1zID0+IHtcbiAgICBjb25zdCB2YWxpZFVwZGF0YWJsZVBhcmFtcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICBpZiAoaXNVcGRhdGFibGVQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgICAgIHZhbGlkVXBkYXRhYmxlUGFyYW1zW3BhcmFtXSA9IHBhcmFtc1twYXJhbV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YXJuKFwiSW52YWxpZCBwYXJhbWV0ZXIgdG8gdXBkYXRlOiBcIi5jb25jYXQocGFyYW0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsaWRVcGRhdGFibGVQYXJhbXM7XG4gIH07XG5cbiAgZnVuY3Rpb24gX2Rlc3Ryb3koKSB7XG4gICAgY29uc3QgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMpIHtcbiAgICAgIGRpc3Bvc2VXZWFrTWFwcyh0aGlzKTsgLy8gVGhlIFdlYWtNYXBzIG1pZ2h0IGhhdmUgYmVlbiBwYXJ0bHkgZGVzdHJveWVkLCB3ZSBtdXN0IHJlY2FsbCBpdCB0byBkaXNwb3NlIGFueSByZW1haW5pbmcgV2Vha01hcHMgIzIzMzVcblxuICAgICAgcmV0dXJuOyAvLyBUaGlzIGluc3RhbmNlIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkXG4gICAgfSAvLyBDaGVjayBpZiB0aGVyZSBpcyBhbm90aGVyIFN3YWwgY2xvc2luZ1xuXG5cbiAgICBpZiAoZG9tQ2FjaGUucG9wdXAgJiYgZ2xvYmFsU3RhdGUuc3dhbENsb3NlRXZlbnRGaW5pc2hlZENhbGxiYWNrKSB7XG4gICAgICBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2soKTtcbiAgICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5zd2FsQ2xvc2VFdmVudEZpbmlzaGVkQ2FsbGJhY2s7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbm5lclBhcmFtcy5kaWREZXN0cm95ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpbm5lclBhcmFtcy5kaWREZXN0cm95KCk7XG4gICAgfVxuXG4gICAgZGlzcG9zZVN3YWwodGhpcyk7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG4gIGNvbnN0IGRpc3Bvc2VTd2FsID0gaW5zdGFuY2UgPT4ge1xuICAgIGRpc3Bvc2VXZWFrTWFwcyhpbnN0YW5jZSk7IC8vIFVuc2V0IHRoaXMucGFyYW1zIHNvIEdDIHdpbGwgZGlzcG9zZSBpdCAoIzE1NjkpXG4gICAgLy8gQHRzLWlnbm9yZVxuXG4gICAgZGVsZXRlIGluc3RhbmNlLnBhcmFtczsgLy8gVW5zZXQgZ2xvYmFsU3RhdGUgcHJvcHMgc28gR0Mgd2lsbCBkaXNwb3NlIGdsb2JhbFN0YXRlICgjMTU2OSlcblxuICAgIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duSGFuZGxlcjtcbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUua2V5ZG93blRhcmdldDsgLy8gVW5zZXQgY3VycmVudEluc3RhbmNlXG5cbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cblxuICBjb25zdCBkaXNwb3NlV2Vha01hcHMgPSBpbnN0YW5jZSA9PiB7XG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgaW5zdGFuY2UgaXMgYXdhaXRpbmcgYSBwcm9taXNlIHJlc3VsdCwgd2Uga2VlcCB0aGUgcHJpdmF0ZU1ldGhvZHMgdG8gY2FsbCB0aGVtIG9uY2UgdGhlIHByb21pc2UgcmVzdWx0IGlzIHJldHJpZXZlZCAjMjMzNVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaW5zdGFuY2UuaXNBd2FpdGluZ1Byb21pc2UoKSkge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICAgIHByaXZhdGVQcm9wcy5hd2FpdGluZ1Byb21pc2Uuc2V0KGluc3RhbmNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlTWV0aG9kcywgaW5zdGFuY2UpO1xuICAgICAgdW5zZXRXZWFrTWFwcyhwcml2YXRlUHJvcHMsIGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqL1xuXG5cbiAgY29uc3QgdW5zZXRXZWFrTWFwcyA9IChvYmosIGluc3RhbmNlKSA9PiB7XG4gICAgZm9yIChjb25zdCBpIGluIG9iaikge1xuICAgICAgb2JqW2ldLmRlbGV0ZShpbnN0YW5jZSk7XG4gICAgfVxuICB9O1xuXG5cblxuICB2YXIgaW5zdGFuY2VNZXRob2RzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIGhpZGVMb2FkaW5nOiBoaWRlTG9hZGluZyxcbiAgICBkaXNhYmxlTG9hZGluZzogaGlkZUxvYWRpbmcsXG4gICAgZ2V0SW5wdXQ6IGdldElucHV0JDEsXG4gICAgY2xvc2U6IGNsb3NlLFxuICAgIGlzQXdhaXRpbmdQcm9taXNlOiBpc0F3YWl0aW5nUHJvbWlzZSxcbiAgICByZWplY3RQcm9taXNlOiByZWplY3RQcm9taXNlLFxuICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZTogaGFuZGxlQXdhaXRpbmdQcm9taXNlLFxuICAgIGNsb3NlUG9wdXA6IGNsb3NlLFxuICAgIGNsb3NlTW9kYWw6IGNsb3NlLFxuICAgIGNsb3NlVG9hc3Q6IGNsb3NlLFxuICAgIGVuYWJsZUJ1dHRvbnM6IGVuYWJsZUJ1dHRvbnMsXG4gICAgZGlzYWJsZUJ1dHRvbnM6IGRpc2FibGVCdXR0b25zLFxuICAgIGVuYWJsZUlucHV0OiBlbmFibGVJbnB1dCxcbiAgICBkaXNhYmxlSW5wdXQ6IGRpc2FibGVJbnB1dCxcbiAgICBzaG93VmFsaWRhdGlvbk1lc3NhZ2U6IHNob3dWYWxpZGF0aW9uTWVzc2FnZSxcbiAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlOiByZXNldFZhbGlkYXRpb25NZXNzYWdlJDEsXG4gICAgZ2V0UHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcyQxLFxuICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgIF9kZXN0cm95OiBfZGVzdHJveVxuICB9KTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybUJ1dHRvbkNsaWNrID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5pbnB1dCkge1xuICAgICAgaGFuZGxlQ29uZmlybU9yRGVueVdpdGhJbnB1dChpbnN0YW5jZSwgJ2NvbmZpcm0nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybShpbnN0YW5jZSwgdHJ1ZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlRGVueUJ1dHRvbkNsaWNrID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5yZXR1cm5JbnB1dFZhbHVlT25EZW55KSB7XG4gICAgICBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0KGluc3RhbmNlLCAnZGVueScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsQnV0dG9uQ2xpY2sgPSAoaW5zdGFuY2UsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUJ1dHRvbnMoKTtcbiAgICBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNhbmNlbCk7XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnQyfSBpbnN0YW5jZVxuICAgKiBAcGFyYW0geydjb25maXJtJyB8ICdkZW55J30gdHlwZVxuICAgKi9cblxuICBjb25zdCBoYW5kbGVDb25maXJtT3JEZW55V2l0aElucHV0ID0gKGluc3RhbmNlLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIGVycm9yKFwiVGhlIFxcXCJpbnB1dFxcXCIgcGFyYW1ldGVyIGlzIG5lZWRlZCB0byBiZSBzZXQgd2hlbiB1c2luZyByZXR1cm5JbnB1dFZhbHVlT25cIi5jb25jYXQoY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHR5cGUpKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IGdldElucHV0VmFsdWUoaW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcikge1xuICAgICAgaGFuZGxlSW5wdXRWYWxpZGF0b3IoaW5zdGFuY2UsIGlucHV0VmFsdWUsIHR5cGUpO1xuICAgIH0gZWxzZSBpZiAoIWluc3RhbmNlLmdldElucHV0KCkuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICBpbnN0YW5jZS5lbmFibGVCdXR0b25zKCk7XG4gICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoaW5uZXJQYXJhbXMudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlbnknKSB7XG4gICAgICBkZW55KGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0VmFsdWVcbiAgICogQHBhcmFtIHsnY29uZmlybScgfCAnZGVueSd9IHR5cGVcbiAgICovXG5cblxuICBjb25zdCBoYW5kbGVJbnB1dFZhbGlkYXRvciA9IChpbnN0YW5jZSwgaW5wdXRWYWx1ZSwgdHlwZSkgPT4ge1xuICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG4gICAgaW5zdGFuY2UuZGlzYWJsZUlucHV0KCk7XG4gICAgY29uc3QgdmFsaWRhdGlvblByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcihpbnB1dFZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICB2YWxpZGF0aW9uUHJvbWlzZS50aGVuKHZhbGlkYXRpb25NZXNzYWdlID0+IHtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUJ1dHRvbnMoKTtcbiAgICAgIGluc3RhbmNlLmVuYWJsZUlucHV0KCk7XG5cbiAgICAgIGlmICh2YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgICAgICBpbnN0YW5jZS5zaG93VmFsaWRhdGlvbk1lc3NhZ2UodmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVueScpIHtcbiAgICAgICAgZGVueShpbnN0YW5jZSwgaW5wdXRWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtKGluc3RhbmNlLCBpbnB1dFZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IGRlbnkgPSAoaW5zdGFuY2UsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuc2hvd0xvYWRlck9uRGVueSkge1xuICAgICAgc2hvd0xvYWRpbmcoZ2V0RGVueUJ1dHRvbigpKTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMucHJlRGVueSkge1xuICAgICAgcHJpdmF0ZVByb3BzLmF3YWl0aW5nUHJvbWlzZS5zZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkLCB0cnVlKTsgLy8gRmxhZ2dpbmcgdGhlIGluc3RhbmNlIGFzIGF3YWl0aW5nIGEgcHJvbWlzZSBzbyBpdCdzIG93biBwcm9taXNlJ3MgcmVqZWN0L3Jlc29sdmUgbWV0aG9kcyBkb2Vzbid0IGdldCBkZXN0cm95ZWQgdW50aWwgdGhlIHJlc3VsdCBmcm9tIHRoaXMgcHJlRGVueSdzIHByb21pc2UgaXMgcmVjZWl2ZWRcblxuICAgICAgY29uc3QgcHJlRGVueVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGFzUHJvbWlzZShpbm5lclBhcmFtcy5wcmVEZW55KHZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSkpKTtcbiAgICAgIHByZURlbnlQcm9taXNlLnRoZW4ocHJlRGVueVZhbHVlID0+IHtcbiAgICAgICAgaWYgKHByZURlbnlWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZShpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgICAgICAgaXNEZW5pZWQ6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdHlwZW9mIHByZURlbnlWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZSA6IHByZURlbnlWYWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciQkMSA9PiByZWplY3RXaXRoKGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgZXJyb3IkJDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UuY2xvc2Uoe1xuICAgICAgICBpc0RlbmllZDogdHJ1ZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cblxuXG4gIGNvbnN0IHN1Y2NlZWRXaXRoID0gKGluc3RhbmNlLCB2YWx1ZSkgPT4ge1xuICAgIGluc3RhbmNlLmNsb3NlKHtcbiAgICAgIGlzQ29uZmlybWVkOiB0cnVlLFxuICAgICAgdmFsdWVcbiAgICB9KTtcbiAgfTtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvclxuICAgKi9cblxuXG4gIGNvbnN0IHJlamVjdFdpdGggPSAoaW5zdGFuY2UsIGVycm9yJCQxKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGluc3RhbmNlLnJlamVjdFByb21pc2UoZXJyb3IkJDEpO1xuICB9O1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0Mn0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuXG5cbiAgY29uc3QgY29uZmlybSA9IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UgfHwgdW5kZWZpbmVkKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtKSB7XG4gICAgICBzaG93TG9hZGluZygpO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5wcmVDb25maXJtKSB7XG4gICAgICBpbnN0YW5jZS5yZXNldFZhbGlkYXRpb25NZXNzYWdlKCk7XG4gICAgICBwcml2YXRlUHJvcHMuYXdhaXRpbmdQcm9taXNlLnNldChpbnN0YW5jZSB8fCB1bmRlZmluZWQsIHRydWUpOyAvLyBGbGFnZ2luZyB0aGUgaW5zdGFuY2UgYXMgYXdhaXRpbmcgYSBwcm9taXNlIHNvIGl0J3Mgb3duIHByb21pc2UncyByZWplY3QvcmVzb2x2ZSBtZXRob2RzIGRvZXNuJ3QgZ2V0IGRlc3Ryb3llZCB1bnRpbCB0aGUgcmVzdWx0IGZyb20gdGhpcyBwcmVDb25maXJtJ3MgcHJvbWlzZSBpcyByZWNlaXZlZFxuXG4gICAgICBjb25zdCBwcmVDb25maXJtUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gYXNQcm9taXNlKGlubmVyUGFyYW1zLnByZUNvbmZpcm0odmFsdWUsIGlubmVyUGFyYW1zLnZhbGlkYXRpb25NZXNzYWdlKSkpO1xuICAgICAgcHJlQ29uZmlybVByb21pc2UudGhlbihwcmVDb25maXJtVmFsdWUgPT4ge1xuICAgICAgICBpZiAoaXNWaXNpYmxlKGdldFZhbGlkYXRpb25NZXNzYWdlKCkpIHx8IHByZUNvbmZpcm1WYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIGhhbmRsZUF3YWl0aW5nUHJvbWlzZShpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3VjY2VlZFdpdGgoaW5zdGFuY2UsIHR5cGVvZiBwcmVDb25maXJtVmFsdWUgPT09ICd1bmRlZmluZWQnID8gdmFsdWUgOiBwcmVDb25maXJtVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciQkMSA9PiByZWplY3RXaXRoKGluc3RhbmNlIHx8IHVuZGVmaW5lZCwgZXJyb3IkJDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZFdpdGgoaW5zdGFuY2UsIHZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUG9wdXBDbGljayA9IChpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKSA9PiB7XG4gICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgaGFuZGxlVG9hc3RDbGljayhpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIHBvcHVwIGJ1dCBtb3VzZXVwIG9uIHRoZSBjb250YWluZXJcbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHRoZSB1c2VyIGRyYWdzIGEgc2xpZGVyXG4gICAgICBoYW5kbGVNb2RhbE1vdXNlZG93bihkb21DYWNoZSk7IC8vIElnbm9yZSBjbGljayBldmVudHMgdGhhdCBoYWQgbW91c2Vkb3duIG9uIHRoZSBjb250YWluZXIgYnV0IG1vdXNldXAgb24gdGhlIHBvcHVwXG5cbiAgICAgIGhhbmRsZUNvbnRhaW5lck1vdXNlZG93bihkb21DYWNoZSk7XG4gICAgICBoYW5kbGVNb2RhbENsaWNrKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVUb2FzdENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICAvLyBDbG9zaW5nIHRvYXN0IGJ5IGludGVybmFsIGNsaWNrXG4gICAgZG9tQ2FjaGUucG9wdXAub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldChpbnN0YW5jZSk7XG5cbiAgICAgIGlmIChpbm5lclBhcmFtcyAmJiAoaXNBbnlCdXR0b25TaG93bihpbm5lclBhcmFtcykgfHwgaW5uZXJQYXJhbXMudGltZXIgfHwgaW5uZXJQYXJhbXMuaW5wdXQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5jbG9zZSk7XG4gICAgfTtcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Kn0gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgaXNBbnlCdXR0b25TaG93biA9IGlubmVyUGFyYW1zID0+IHtcbiAgICByZXR1cm4gaW5uZXJQYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0RlbnlCdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2xvc2VCdXR0b247XG4gIH07XG5cbiAgbGV0IGlnbm9yZU91dHNpZGVDbGljayA9IGZhbHNlO1xuXG4gIGNvbnN0IGhhbmRsZU1vZGFsTW91c2Vkb3duID0gZG9tQ2FjaGUgPT4ge1xuICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2Vkb3duID0gKCkgPT4ge1xuICAgICAgZG9tQ2FjaGUuY29udGFpbmVyLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRvbUNhY2hlLmNvbnRhaW5lci5vbm1vdXNldXAgPSB1bmRlZmluZWQ7IC8vIFdlIG9ubHkgY2hlY2sgaWYgdGhlIG1vdXNldXAgdGFyZ2V0IGlzIHRoZSBjb250YWluZXIgYmVjYXVzZSB1c3VhbGx5IGl0IGRvZXNuJ3RcbiAgICAgICAgLy8gaGF2ZSBhbnkgb3RoZXIgZGlyZWN0IGNoaWxkcmVuIGFzaWRlIG9mIHRoZSBwb3B1cFxuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9tQ2FjaGUuY29udGFpbmVyKSB7XG4gICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUNvbnRhaW5lck1vdXNlZG93biA9IGRvbUNhY2hlID0+IHtcbiAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZWRvd24gPSAoKSA9PiB7XG4gICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkb21DYWNoZS5wb3B1cC5vbm1vdXNldXAgPSB1bmRlZmluZWQ7IC8vIFdlIGFsc28gbmVlZCB0byBjaGVjayBpZiB0aGUgbW91c2V1cCB0YXJnZXQgaXMgYSBjaGlsZCBvZiB0aGUgcG9wdXBcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLnBvcHVwIHx8IGRvbUNhY2hlLnBvcHVwLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVNb2RhbENsaWNrID0gKGluc3RhbmNlLCBkb21DYWNoZSwgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBkb21DYWNoZS5jb250YWluZXIub25jbGljayA9IGUgPT4ge1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlKTtcblxuICAgICAgaWYgKGlnbm9yZU91dHNpZGVDbGljaykge1xuICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLmNvbnRhaW5lciAmJiBjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd091dHNpZGVDbGljaykpIHtcbiAgICAgICAgZGlzbWlzc1dpdGgoRGlzbWlzc1JlYXNvbi5iYWNrZHJvcCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBpc0pxdWVyeUVsZW1lbnQgPSBlbGVtID0+IHR5cGVvZiBlbGVtID09PSAnb2JqZWN0JyAmJiBlbGVtLmpxdWVyeTtcblxuICBjb25zdCBpc0VsZW1lbnQgPSBlbGVtID0+IGVsZW0gaW5zdGFuY2VvZiBFbGVtZW50IHx8IGlzSnF1ZXJ5RWxlbWVudChlbGVtKTtcblxuICBjb25zdCBhcmdzVG9QYXJhbXMgPSBhcmdzID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB7fTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ29iamVjdCcgJiYgIWlzRWxlbWVudChhcmdzWzBdKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbXMsIGFyZ3NbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBbJ3RpdGxlJywgJ2h0bWwnLCAnaWNvbiddLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbaW5kZXhdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCBpc0VsZW1lbnQoYXJnKSkge1xuICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmIChhcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVycm9yKFwiVW5leHBlY3RlZCB0eXBlIG9mIFwiLmNvbmNhdChuYW1lLCBcIiEgRXhwZWN0ZWQgXFxcInN0cmluZ1xcXCIgb3IgXFxcIkVsZW1lbnRcXFwiLCBnb3QgXCIpLmNvbmNhdCh0eXBlb2YgYXJnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmlyZSgpIHtcbiAgICBjb25zdCBTd2FsID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3dhbCguLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGV4dGVuZGVkIHZlcnNpb24gb2YgYFN3YWxgIGNvbnRhaW5pbmcgYHBhcmFtc2AgYXMgZGVmYXVsdHMuXG4gICAqIFVzZWZ1bCBmb3IgcmV1c2luZyBTd2FsIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBCZWZvcmU6XG4gICAqIGNvbnN0IHRleHRQcm9tcHRPcHRpb25zID0geyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH1cbiAgICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JyB9KVxuICAgKiBjb25zdCB7dmFsdWU6IGxhc3ROYW1lfSA9IGF3YWl0IFN3YWwuZmlyZSh7IC4uLnRleHRQcm9tcHRPcHRpb25zLCB0aXRsZTogJ1doYXQgaXMgeW91ciBsYXN0IG5hbWU/JyB9KVxuICAgKlxuICAgKiBBZnRlcjpcbiAgICogY29uc3QgVGV4dFByb21wdCA9IFN3YWwubWl4aW4oeyBpbnB1dDogJ3RleHQnLCBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlIH0pXG4gICAqIGNvbnN0IHt2YWx1ZTogZmlyc3ROYW1lfSA9IGF3YWl0IFRleHRQcm9tcHQoJ1doYXQgaXMgeW91ciBmaXJzdCBuYW1lPycpXG4gICAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nKVxuICAgKlxuICAgKiBAcGFyYW0gbWl4aW5QYXJhbXNcbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKG1peGluUGFyYW1zKSB7XG4gICAgY2xhc3MgTWl4aW5Td2FsIGV4dGVuZHMgdGhpcyB7XG4gICAgICBfbWFpbihwYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl9tYWluKHBhcmFtcywgT2JqZWN0LmFzc2lnbih7fSwgbWl4aW5QYXJhbXMsIHByaW9yaXR5TWl4aW5QYXJhbXMpKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBNaXhpblN3YWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXMgc2V0LCByZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIE90aGVyd2lzZSwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IGdldFRpbWVyTGVmdCA9ICgpID0+IHtcbiAgICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dCAmJiBnbG9iYWxTdGF0ZS50aW1lb3V0LmdldFRpbWVyTGVmdCgpO1xuICB9O1xuICAvKipcbiAgICogU3RvcCB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICAgKi9cblxuICBjb25zdCBzdG9wVGltZXIgPSAoKSA9PiB7XG4gICAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICAgIHN0b3BUaW1lclByb2dyZXNzQmFyKCk7XG4gICAgICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dC5zdG9wKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IHJlc3VtZVRpbWVyID0gKCkgPT4ge1xuICAgIGlmIChnbG9iYWxTdGF0ZS50aW1lb3V0KSB7XG4gICAgICBjb25zdCByZW1haW5pbmcgPSBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0YXJ0KCk7XG4gICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0JhcihyZW1haW5pbmcpO1xuICAgICAgcmV0dXJuIHJlbWFpbmluZztcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBSZXN1bWUgdGltZXIuIFJldHVybnMgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvZiB0aW1lciByZW1haW5lZC5cbiAgICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICovXG5cbiAgY29uc3QgdG9nZ2xlVGltZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZXIgPSBnbG9iYWxTdGF0ZS50aW1lb3V0O1xuICAgIHJldHVybiB0aW1lciAmJiAodGltZXIucnVubmluZyA/IHN0b3BUaW1lcigpIDogcmVzdW1lVGltZXIoKSk7XG4gIH07XG4gIC8qKlxuICAgKiBJbmNyZWFzZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIGFuIHVwZGF0ZWQgdGltZXIuXG4gICAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gICAqL1xuXG4gIGNvbnN0IGluY3JlYXNlVGltZXIgPSBuID0+IHtcbiAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgY29uc3QgcmVtYWluaW5nID0gZ2xvYmFsU3RhdGUudGltZW91dC5pbmNyZWFzZShuKTtcbiAgICAgIGFuaW1hdGVUaW1lclByb2dyZXNzQmFyKHJlbWFpbmluZywgdHJ1ZSk7XG4gICAgICByZXR1cm4gcmVtYWluaW5nO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRpbWVyIGlzIHJ1bm5pbmcuIFJldHVybnMgdHJ1ZSBpZiB0aW1lciBpcyBydW5uaW5nXG4gICAqIG9yIGZhbHNlIGlmIHRpbWVyIGlzIHBhdXNlZCBvciBzdG9wcGVkLlxuICAgKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkXG4gICAqL1xuXG4gIGNvbnN0IGlzVGltZXJSdW5uaW5nID0gKCkgPT4ge1xuICAgIHJldHVybiBnbG9iYWxTdGF0ZS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlLnRpbWVvdXQuaXNSdW5uaW5nKCk7XG4gIH07XG5cbiAgbGV0IGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSBmYWxzZTtcbiAgY29uc3QgY2xpY2tIYW5kbGVycyA9IHt9O1xuICBmdW5jdGlvbiBiaW5kQ2xpY2tIYW5kbGVyKCkge1xuICAgIGxldCBhdHRyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnZGF0YS1zd2FsLXRlbXBsYXRlJztcbiAgICBjbGlja0hhbmRsZXJzW2F0dHJdID0gdGhpcztcblxuICAgIGlmICghYm9keUNsaWNrTGlzdGVuZXJBZGRlZCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJvZHlDbGlja0xpc3RlbmVyKTtcbiAgICAgIGJvZHlDbGlja0xpc3RlbmVyQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJvZHlDbGlja0xpc3RlbmVyID0gZXZlbnQgPT4ge1xuICAgIGZvciAobGV0IGVsID0gZXZlbnQudGFyZ2V0OyBlbCAmJiBlbCAhPT0gZG9jdW1lbnQ7IGVsID0gZWwucGFyZW50Tm9kZSkge1xuICAgICAgZm9yIChjb25zdCBhdHRyIGluIGNsaWNrSGFuZGxlcnMpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgY2xpY2tIYW5kbGVyc1thdHRyXS5maXJlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5cblxuICB2YXIgc3RhdGljTWV0aG9kcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBpc1ZhbGlkUGFyYW1ldGVyOiBpc1ZhbGlkUGFyYW1ldGVyLFxuICAgIGlzVXBkYXRhYmxlUGFyYW1ldGVyOiBpc1VwZGF0YWJsZVBhcmFtZXRlcixcbiAgICBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXI6IGlzRGVwcmVjYXRlZFBhcmFtZXRlcixcbiAgICBhcmdzVG9QYXJhbXM6IGFyZ3NUb1BhcmFtcyxcbiAgICBpc1Zpc2libGU6IGlzVmlzaWJsZSQxLFxuICAgIGNsaWNrQ29uZmlybTogY2xpY2tDb25maXJtLFxuICAgIGNsaWNrRGVueTogY2xpY2tEZW55LFxuICAgIGNsaWNrQ2FuY2VsOiBjbGlja0NhbmNlbCxcbiAgICBnZXRDb250YWluZXI6IGdldENvbnRhaW5lcixcbiAgICBnZXRQb3B1cDogZ2V0UG9wdXAsXG4gICAgZ2V0VGl0bGU6IGdldFRpdGxlLFxuICAgIGdldEh0bWxDb250YWluZXI6IGdldEh0bWxDb250YWluZXIsXG4gICAgZ2V0SW1hZ2U6IGdldEltYWdlLFxuICAgIGdldEljb246IGdldEljb24sXG4gICAgZ2V0SW5wdXRMYWJlbDogZ2V0SW5wdXRMYWJlbCxcbiAgICBnZXRDbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24sXG4gICAgZ2V0QWN0aW9uczogZ2V0QWN0aW9ucyxcbiAgICBnZXRDb25maXJtQnV0dG9uOiBnZXRDb25maXJtQnV0dG9uLFxuICAgIGdldERlbnlCdXR0b246IGdldERlbnlCdXR0b24sXG4gICAgZ2V0Q2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24sXG4gICAgZ2V0TG9hZGVyOiBnZXRMb2FkZXIsXG4gICAgZ2V0Rm9vdGVyOiBnZXRGb290ZXIsXG4gICAgZ2V0VGltZXJQcm9ncmVzc0JhcjogZ2V0VGltZXJQcm9ncmVzc0JhcixcbiAgICBnZXRGb2N1c2FibGVFbGVtZW50czogZ2V0Rm9jdXNhYmxlRWxlbWVudHMsXG4gICAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlLFxuICAgIGlzTG9hZGluZzogaXNMb2FkaW5nLFxuICAgIGZpcmU6IGZpcmUsXG4gICAgbWl4aW46IG1peGluLFxuICAgIHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBlbmFibGVMb2FkaW5nOiBzaG93TG9hZGluZyxcbiAgICBnZXRUaW1lckxlZnQ6IGdldFRpbWVyTGVmdCxcbiAgICBzdG9wVGltZXI6IHN0b3BUaW1lcixcbiAgICByZXN1bWVUaW1lcjogcmVzdW1lVGltZXIsXG4gICAgdG9nZ2xlVGltZXI6IHRvZ2dsZVRpbWVyLFxuICAgIGluY3JlYXNlVGltZXI6IGluY3JlYXNlVGltZXIsXG4gICAgaXNUaW1lclJ1bm5pbmc6IGlzVGltZXJSdW5uaW5nLFxuICAgIGJpbmRDbGlja0hhbmRsZXI6IGJpbmRDbGlja0hhbmRsZXJcbiAgfSk7XG5cbiAgbGV0IGN1cnJlbnRJbnN0YW5jZTtcblxuICBjbGFzcyBTd2VldEFsZXJ0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vIFByZXZlbnQgcnVuIGluIE5vZGUgZW52XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50SW5zdGFuY2UgPSB0aGlzOyAvLyBAdHMtaWdub3JlXG5cbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXRlclBhcmFtcyA9IE9iamVjdC5mcmVlemUodGhpcy5jb25zdHJ1Y3Rvci5hcmdzVG9QYXJhbXMoYXJncykpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICB2YWx1ZTogb3V0ZXJQYXJhbXMsXG4gICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pOyAvLyBAdHMtaWdub3JlXG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBjdXJyZW50SW5zdGFuY2UuX21haW4oY3VycmVudEluc3RhbmNlLnBhcmFtcyk7XG5cbiAgICAgIHByaXZhdGVQcm9wcy5wcm9taXNlLnNldCh0aGlzLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBfbWFpbih1c2VyUGFyYW1zKSB7XG4gICAgICBsZXQgbWl4aW5QYXJhbXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgc2hvd1dhcm5pbmdzRm9yUGFyYW1zKE9iamVjdC5hc3NpZ24oe30sIG1peGluUGFyYW1zLCB1c2VyUGFyYW1zKSk7XG5cbiAgICAgIGlmIChnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBnbG9iYWxTdGF0ZS5jdXJyZW50SW5zdGFuY2UuX2Rlc3Ryb3koKTtcblxuICAgICAgICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgICAgICAgdW5zZXRBcmlhSGlkZGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2xvYmFsU3RhdGUuY3VycmVudEluc3RhbmNlID0gY3VycmVudEluc3RhbmNlO1xuICAgICAgY29uc3QgaW5uZXJQYXJhbXMgPSBwcmVwYXJlUGFyYW1zKHVzZXJQYXJhbXMsIG1peGluUGFyYW1zKTtcbiAgICAgIHNldFBhcmFtZXRlcnMoaW5uZXJQYXJhbXMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShpbm5lclBhcmFtcyk7IC8vIGNsZWFyIHRoZSBwcmV2aW91cyB0aW1lclxuXG4gICAgICBpZiAoZ2xvYmFsU3RhdGUudGltZW91dCkge1xuICAgICAgICBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlLnRpbWVvdXQ7XG4gICAgICB9IC8vIGNsZWFyIHRoZSByZXN0b3JlIGZvY3VzIHRpbWVvdXRcblxuXG4gICAgICBjbGVhclRpbWVvdXQoZ2xvYmFsU3RhdGUucmVzdG9yZUZvY3VzVGltZW91dCk7XG4gICAgICBjb25zdCBkb21DYWNoZSA9IHBvcHVsYXRlRG9tQ2FjaGUoY3VycmVudEluc3RhbmNlKTtcbiAgICAgIHJlbmRlcihjdXJyZW50SW5zdGFuY2UsIGlubmVyUGFyYW1zKTtcbiAgICAgIHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5zZXQoY3VycmVudEluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICByZXR1cm4gc3dhbFByb21pc2UoY3VycmVudEluc3RhbmNlLCBkb21DYWNoZSwgaW5uZXJQYXJhbXMpO1xuICAgIH0gLy8gYGNhdGNoYCBjYW5ub3QgYmUgdGhlIG5hbWUgb2YgYSBtb2R1bGUgZXhwb3J0LCBzbyB3ZSBkZWZpbmUgb3VyIHRoZW5hYmxlIG1ldGhvZHMgaGVyZSBpbnN0ZWFkXG5cblxuICAgIHRoZW4ob25GdWxmaWxsZWQpIHtcbiAgICAgIGNvbnN0IHByb21pc2UgPSBwcml2YXRlUHJvcHMucHJvbWlzZS5nZXQodGhpcyk7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKG9uRnVsZmlsbGVkKTtcbiAgICB9XG5cbiAgICBmaW5hbGx5KG9uRmluYWxseSkge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IHByaXZhdGVQcm9wcy5wcm9taXNlLmdldCh0aGlzKTtcbiAgICAgIHJldHVybiBwcm9taXNlLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICB9XG5cbiAgfVxuXG4gIGNvbnN0IHN3YWxQcm9taXNlID0gKGluc3RhbmNlLCBkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gZnVuY3Rpb25zIHRvIGhhbmRsZSBhbGwgY2xvc2luZ3MvZGlzbWlzc2Fsc1xuICAgICAgY29uc3QgZGlzbWlzc1dpdGggPSBkaXNtaXNzID0+IHtcbiAgICAgICAgaW5zdGFuY2UuY2xvc2VQb3B1cCh7XG4gICAgICAgICAgaXNEaXNtaXNzZWQ6IHRydWUsXG4gICAgICAgICAgZGlzbWlzc1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5zZXQoaW5zdGFuY2UsIHJlc29sdmUpO1xuICAgICAgcHJpdmF0ZU1ldGhvZHMuc3dhbFByb21pc2VSZWplY3Quc2V0KGluc3RhbmNlLCByZWplY3QpO1xuXG4gICAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBoYW5kbGVDb25maXJtQnV0dG9uQ2xpY2soaW5zdGFuY2UpO1xuXG4gICAgICBkb21DYWNoZS5kZW55QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBoYW5kbGVEZW55QnV0dG9uQ2xpY2soaW5zdGFuY2UpO1xuXG4gICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24ub25jbGljayA9ICgpID0+IGhhbmRsZUNhbmNlbEJ1dHRvbkNsaWNrKGluc3RhbmNlLCBkaXNtaXNzV2l0aCk7XG5cbiAgICAgIGRvbUNhY2hlLmNsb3NlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiBkaXNtaXNzV2l0aChEaXNtaXNzUmVhc29uLmNsb3NlKTtcblxuICAgICAgaGFuZGxlUG9wdXBDbGljayhpbnN0YW5jZSwgZG9tQ2FjaGUsIGRpc21pc3NXaXRoKTtcbiAgICAgIGFkZEtleWRvd25IYW5kbGVyKGluc3RhbmNlLCBnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICAgIGhhbmRsZUlucHV0T3B0aW9uc0FuZFZhbHVlKGluc3RhbmNlLCBpbm5lclBhcmFtcyk7XG4gICAgICBvcGVuUG9wdXAoaW5uZXJQYXJhbXMpO1xuICAgICAgc2V0dXBUaW1lcihnbG9iYWxTdGF0ZSwgaW5uZXJQYXJhbXMsIGRpc21pc3NXaXRoKTtcbiAgICAgIGluaXRGb2N1cyhkb21DYWNoZSwgaW5uZXJQYXJhbXMpOyAvLyBTY3JvbGwgY29udGFpbmVyIHRvIHRvcCBvbiBvcGVuICgjMTI0NywgIzE5NDYpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkb21DYWNoZS5jb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHByZXBhcmVQYXJhbXMgPSAodXNlclBhcmFtcywgbWl4aW5QYXJhbXMpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZVBhcmFtcyA9IGdldFRlbXBsYXRlUGFyYW1zKHVzZXJQYXJhbXMpO1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJhbXMsIG1peGluUGFyYW1zLCB0ZW1wbGF0ZVBhcmFtcywgdXNlclBhcmFtcyk7IC8vIHByZWNlZGVuY2UgaXMgZGVzY3JpYmVkIGluICMyMTMxXG5cbiAgICBwYXJhbXMuc2hvd0NsYXNzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcmFtcy5zaG93Q2xhc3MsIHBhcmFtcy5zaG93Q2xhc3MpO1xuICAgIHBhcmFtcy5oaWRlQ2xhc3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyYW1zLmhpZGVDbGFzcywgcGFyYW1zLmhpZGVDbGFzcyk7XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfTtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3dlZXRBbGVydDJ9IGluc3RhbmNlXG4gICAqIEByZXR1cm5zIHtEb21DYWNoZX1cbiAgICovXG5cblxuICBjb25zdCBwb3B1bGF0ZURvbUNhY2hlID0gaW5zdGFuY2UgPT4ge1xuICAgIGNvbnN0IGRvbUNhY2hlID0ge1xuICAgICAgcG9wdXA6IGdldFBvcHVwKCksXG4gICAgICBjb250YWluZXI6IGdldENvbnRhaW5lcigpLFxuICAgICAgYWN0aW9uczogZ2V0QWN0aW9ucygpLFxuICAgICAgY29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbigpLFxuICAgICAgZGVueUJ1dHRvbjogZ2V0RGVueUJ1dHRvbigpLFxuICAgICAgY2FuY2VsQnV0dG9uOiBnZXRDYW5jZWxCdXR0b24oKSxcbiAgICAgIGxvYWRlcjogZ2V0TG9hZGVyKCksXG4gICAgICBjbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24oKSxcbiAgICAgIHZhbGlkYXRpb25NZXNzYWdlOiBnZXRWYWxpZGF0aW9uTWVzc2FnZSgpLFxuICAgICAgcHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcygpXG4gICAgfTtcbiAgICBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuc2V0KGluc3RhbmNlLCBkb21DYWNoZSk7XG4gICAgcmV0dXJuIGRvbUNhY2hlO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtHbG9iYWxTdGF0ZX0gZ2xvYmFsU3RhdGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZGlzbWlzc1dpdGhcbiAgICovXG5cblxuICBjb25zdCBzZXR1cFRpbWVyID0gKGdsb2JhbFN0YXRlJCQxLCBpbm5lclBhcmFtcywgZGlzbWlzc1dpdGgpID0+IHtcbiAgICBjb25zdCB0aW1lclByb2dyZXNzQmFyID0gZ2V0VGltZXJQcm9ncmVzc0JhcigpO1xuICAgIGhpZGUodGltZXJQcm9ncmVzc0Jhcik7XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMudGltZXIpIHtcbiAgICAgIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQgPSBuZXcgVGltZXIoKCkgPT4ge1xuICAgICAgICBkaXNtaXNzV2l0aCgndGltZXInKTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQ7XG4gICAgICB9LCBpbm5lclBhcmFtcy50aW1lcik7XG5cbiAgICAgIGlmIChpbm5lclBhcmFtcy50aW1lclByb2dyZXNzQmFyKSB7XG4gICAgICAgIHNob3codGltZXJQcm9ncmVzc0Jhcik7XG4gICAgICAgIGFwcGx5Q3VzdG9tQ2xhc3ModGltZXJQcm9ncmVzc0JhciwgaW5uZXJQYXJhbXMsICd0aW1lclByb2dyZXNzQmFyJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChnbG9iYWxTdGF0ZSQkMS50aW1lb3V0ICYmIGdsb2JhbFN0YXRlJCQxLnRpbWVvdXQucnVubmluZykge1xuICAgICAgICAgICAgLy8gdGltZXIgY2FuIGJlIGFscmVhZHkgc3RvcHBlZCBvciB1bnNldCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBhbmltYXRlVGltZXJQcm9ncmVzc0Jhcihpbm5lclBhcmFtcy50aW1lcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvbUNhY2hlfSBkb21DYWNoZVxuICAgKiBAcGFyYW0ge1N3ZWV0QWxlcnRPcHRpb25zfSBpbm5lclBhcmFtc1xuICAgKi9cblxuXG4gIGNvbnN0IGluaXRGb2N1cyA9IChkb21DYWNoZSwgaW5uZXJQYXJhbXMpID0+IHtcbiAgICBpZiAoaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWNhbGxJZkZ1bmN0aW9uKGlubmVyUGFyYW1zLmFsbG93RW50ZXJLZXkpKSB7XG4gICAgICByZXR1cm4gYmx1ckFjdGl2ZUVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICBpZiAoIWZvY3VzQnV0dG9uKGRvbUNhY2hlLCBpbm5lclBhcmFtcykpIHtcbiAgICAgIHNldEZvY3VzKGlubmVyUGFyYW1zLCAtMSwgMSk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtEb21DYWNoZX0gZG9tQ2FjaGVcbiAgICogQHBhcmFtIHtTd2VldEFsZXJ0T3B0aW9uc30gaW5uZXJQYXJhbXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgY29uc3QgZm9jdXNCdXR0b24gPSAoZG9tQ2FjaGUsIGlubmVyUGFyYW1zKSA9PiB7XG4gICAgaWYgKGlubmVyUGFyYW1zLmZvY3VzRGVueSAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuZGVueUJ1dHRvbikpIHtcbiAgICAgIGRvbUNhY2hlLmRlbnlCdXR0b24uZm9jdXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpbm5lclBhcmFtcy5mb2N1c0NhbmNlbCAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY2FuY2VsQnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmZvY3VzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuZm9jdXNDb25maXJtICYmIGlzVmlzaWJsZShkb21DYWNoZS5jb25maXJtQnV0dG9uKSkge1xuICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5mb2N1cygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGJsdXJBY3RpdmVFbGVtZW50ID0gKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9OyAvLyBUaGlzIGFudGktd2FyIG1lc3NhZ2Ugd2lsbCBvbmx5IGJlIHNob3duIHRvIFJ1c3NpYW4gdXNlcnMgdmlzaXRpbmcgUnVzc2lhbiBzaXRlc1xuXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIC9ecnVcXGIvLnRlc3QobmF2aWdhdG9yLmxhbmd1YWdlKSAmJiBsb2NhdGlvbi5ob3N0Lm1hdGNoKC9cXC4ocnV8c3V8eG4tLXAxYWkpJC8pKSB7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcbiAgICAgIGNvbnN0IG5vV2FyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBub1dhci5jbGFzc05hbWUgPSAnbGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxkJztcbiAgICAgIGNvbnN0IHZpZGVvID0gZ2V0UmFuZG9tRWxlbWVudChbe1xuICAgICAgICB0ZXh0OiBcIlxcdTA0MTIgXFx1MDQzRFxcdTA0MzhcXHUwNDM2XFx1MDQzNVxcdTA0M0ZcXHUwNDQwXFx1MDQzOFxcdTA0MzJcXHUwNDM1XFx1MDQzNFxcdTA0NTFcXHUwNDNEXFx1MDQzRFxcdTA0M0VcXHUwNDNDIFxcdTA0MzJcXHUwNDM4XFx1MDQzNFxcdTA0MzVcXHUwNDNFIFxcdTA0M0VcXHUwNDMxXFx1MDQ0QVxcdTA0NEZcXHUwNDQxXFx1MDQzRFxcdTA0NEZcXHUwNDM1XFx1MDQ0MlxcdTA0NDFcXHUwNDRGIFxcdTA0M0FcXHUwNDMwXFx1MDQzQSBcXHUwNDNBXFx1MDQzMFxcdTA0MzZcXHUwNDM0XFx1MDQ0QlxcdTA0MzkgXFx1MDQzOFxcdTA0MzcgXFx1MDQzRFxcdTA0MzBcXHUwNDQxIFxcdTA0M0NcXHUwNDNFXFx1MDQzNlxcdTA0MzVcXHUwNDQyIFxcdTA0M0ZcXHUwNDNFXFx1MDQzQ1xcdTA0M0VcXHUwNDQ3XFx1MDQ0QyBcXHUwNDMyIFxcdTA0NDJcXHUwNDNFXFx1MDQzQyxcXG4gICAgICAgIDxzdHJvbmc+XFx1MDQ0N1xcdTA0NDJcXHUwNDNFXFx1MDQzMVxcdTA0NEIgXFx1MDQ0RFxcdTA0NDJcXHUwNDMwIFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDFcXHUwNDNDXFx1MDQ0QlxcdTA0NDFcXHUwNDNCXFx1MDQzNVxcdTA0M0RcXHUwNDNEXFx1MDQzMFxcdTA0NEYgXFx1MDQzOCBcXHUwNDMxXFx1MDQzNVxcdTA0NDFcXHUwNDQ3XFx1MDQzNVxcdTA0M0JcXHUwNDNFXFx1MDQzMlxcdTA0MzVcXHUwNDQ3XFx1MDQzRFxcdTA0MzBcXHUwNDRGIFxcdTA0MzJcXHUwNDNFXFx1MDQzOVxcdTA0M0RcXHUwNDMwIFxcdTA0M0VcXHUwNDQxXFx1MDQ0MlxcdTA0MzBcXHUwNDNEXFx1MDQzRVxcdTA0MzJcXHUwNDM4XFx1MDQzQlxcdTA0MzBcXHUwNDQxXFx1MDQ0Qzwvc3Ryb25nPjpcIixcbiAgICAgICAgaWQ6ICc0Q2ZEaGFSa3c3SSdcbiAgICAgIH0sIHtcbiAgICAgICAgdGV4dDogJ1x1MDQyRFx1MDQzQ1x1MDQzRlx1MDQzMFx1MDQ0Mlx1MDQzOFx1MDQ0RiAtIFx1MDQzM1x1MDQzQlx1MDQzMFx1MDQzMlx1MDQzRFx1MDQzRVx1MDQzNSA8c3Ryb25nPlx1MDQ0N1x1MDQzNVx1MDQzQlx1MDQzRVx1MDQzMlx1MDQzNVx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzQVx1MDQzRVx1MDQzNTwvc3Ryb25nPiBcdTA0NDdcdTA0NDNcdTA0MzJcdTA0NDFcdTA0NDJcdTA0MzJcdTA0M0UuIFx1MDQyMVx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQzRVx1MDQzMVx1MDQzRFx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQ0QyBcdTA0NDFcdTA0M0VcdTA0M0ZcdTA0MzVcdTA0NDBcdTA0MzVcdTA0MzZcdTA0MzhcdTA0MzJcdTA0MzBcdTA0NDJcdTA0NEMuIDxzdHJvbmc+XHUwNDIxXHUwNDNGXHUwNDNFXHUwNDQxXHUwNDNFXHUwNDMxXHUwNDNEXHUwNDNFXHUwNDQxXHUwNDQyXHUwNDRDIFx1MDQzRlx1MDQzRVx1MDQ0MVx1MDQ0Mlx1MDQzMFx1MDQzMlx1MDQzOFx1MDQ0Mlx1MDQ0QyBcdTA0NDFcdTA0MzVcdTA0MzFcdTA0NEYgXHUwNDNEXHUwNDMwIFx1MDQzQ1x1MDQzNVx1MDQ0MVx1MDQ0Mlx1MDQzRSBcdTA0MzRcdTA0NDBcdTA0NDNcdTA0MzNcdTA0M0VcdTA0MzNcdTA0M0UuPC9zdHJvbmc+JyxcbiAgICAgICAgaWQ6ICdzLUdMQUlZNERYQSdcbiAgICAgIH1dKTtcbiAgICAgIHNldElubmVySHRtbChub1dhciwgXCJcXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxNVxcdTA0NDFcXHUwNDNCXFx1MDQzOCBcXHUwNDNDXFx1MDQ0QiBcXHUwNDNEXFx1MDQzNSBcXHUwNDNFXFx1MDQ0MVxcdTA0NDJcXHUwNDMwXFx1MDQzRFxcdTA0M0VcXHUwNDMyXFx1MDQzOFxcdTA0M0MgXFx1MDQzMlxcdTA0M0VcXHUwNDM5XFx1MDQzRFxcdTA0NDMsIFxcdTA0M0VcXHUwNDNEXFx1MDQzMCBcXHUwNDNGXFx1MDQ0MFxcdTA0MzhcXHUwNDM0XFx1MDQzNVxcdTA0NDIgXFx1MDQzMiBcXHUwNDM0XFx1MDQzRVxcdTA0M0MgPHN0cm9uZz5cXHUwNDNBXFx1MDQzMFxcdTA0MzZcXHUwNDM0XFx1MDQzRVxcdTA0MzNcXHUwNDNFIFxcdTA0MzhcXHUwNDM3IFxcdTA0M0RcXHUwNDMwXFx1MDQ0MTwvc3Ryb25nPiBcXHUwNDM4IFxcdTA0MzVcXHUwNDUxIFxcdTA0M0ZcXHUwNDNFXFx1MDQ0MVxcdTA0M0JcXHUwNDM1XFx1MDQzNFxcdTA0NDFcXHUwNDQyXFx1MDQzMlxcdTA0MzhcXHUwNDRGIFxcdTA0MzFcXHUwNDQzXFx1MDQzNFxcdTA0NDNcXHUwNDQyIDxzdHJvbmc+XFx1MDQ0M1xcdTA0MzZcXHUwNDMwXFx1MDQ0MVxcdTA0MzBcXHUwNDRFXFx1MDQ0OVxcdTA0MzhcXHUwNDNDXFx1MDQzODwvc3Ryb25nPi5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxRlxcdTA0NDNcXHUwNDQyXFx1MDQzOFxcdTA0M0RcXHUwNDQxXFx1MDQzQVxcdTA0MzhcXHUwNDM5IFxcdTA0NDBcXHUwNDM1XFx1MDQzNlxcdTA0MzhcXHUwNDNDIFxcdTA0MzdcXHUwNDMwIDIwIFxcdTA0NDEgXFx1MDQzQlxcdTA0MzhcXHUwNDQ4XFx1MDQzRFxcdTA0MzhcXHUwNDNDIFxcdTA0M0JcXHUwNDM1XFx1MDQ0MiBcXHUwNDQxXFx1MDQzMlxcdTA0M0VcXHUwNDM1XFx1MDQzM1xcdTA0M0UgXFx1MDQ0MVxcdTA0NDNcXHUwNDQ5XFx1MDQzNVxcdTA0NDFcXHUwNDQyXFx1MDQzMlxcdTA0M0VcXHUwNDMyXFx1MDQzMFxcdTA0M0RcXHUwNDM4XFx1MDQ0RiBcXHUwNDMyXFx1MDQzNFxcdTA0M0VcXHUwNDNCXFx1MDQzMVxcdTA0MzhcXHUwNDNCIFxcdTA0M0RcXHUwNDMwXFx1MDQzQywgXFx1MDQ0N1xcdTA0NDJcXHUwNDNFIFxcdTA0M0NcXHUwNDRCIFxcdTA0MzFcXHUwNDM1XFx1MDQ0MVxcdTA0NDFcXHUwNDM4XFx1MDQzQlxcdTA0NENcXHUwNDNEXFx1MDQ0QiBcXHUwNDM4IFxcdTA0M0VcXHUwNDM0XFx1MDQzOFxcdTA0M0QgXFx1MDQ0N1xcdTA0MzVcXHUwNDNCXFx1MDQzRVxcdTA0MzJcXHUwNDM1XFx1MDQzQSBcXHUwNDNEXFx1MDQzNSBcXHUwNDNDXFx1MDQzRVxcdTA0MzZcXHUwNDM1XFx1MDQ0MiBcXHUwNDNEXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQzM1xcdTA0M0UgXFx1MDQ0MVxcdTA0MzRcXHUwNDM1XFx1MDQzQlxcdTA0MzBcXHUwNDQyXFx1MDQ0Qy4gPHN0cm9uZz5cXHUwNDJEXFx1MDQ0MlxcdTA0M0UgXFx1MDQzRFxcdTA0MzUgXFx1MDQ0MlxcdTA0MzBcXHUwNDNBITwvc3Ryb25nPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXY+XFxuICAgICAgICBcIi5jb25jYXQodmlkZW8udGV4dCwgXCJcXG4gICAgICA8L2Rpdj5cXG4gICAgICA8aWZyYW1lIHdpZHRoPVxcXCI1NjBcXFwiIGhlaWdodD1cXFwiMzE1XFxcIiBzcmM9XFxcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL1wiKS5jb25jYXQodmlkZW8uaWQsIFwiXFxcIiBmcmFtZWJvcmRlcj1cXFwiMFxcXCIgYWxsb3c9XFxcImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmVcXFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cXG4gICAgICA8ZGl2PlxcbiAgICAgICAgXFx1MDQxRFxcdTA0MzVcXHUwNDQyIFxcdTA0MzJcXHUwNDNFXFx1MDQzOVxcdTA0M0RcXHUwNDM1IVxcbiAgICAgIDwvZGl2PlxcbiAgICAgIFwiKSk7XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJyZ0aW1lczsnO1xuXG4gICAgICBjbG9zZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbm9XYXIucmVtb3ZlKCk7XG5cbiAgICAgIG5vV2FyLmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5vV2FyKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0gLy8gQXNzaWduIGluc3RhbmNlIG1ldGhvZHMgZnJvbSBzcmMvaW5zdGFuY2VNZXRob2RzLyouanMgdG8gcHJvdG90eXBlXG5cblxuICBPYmplY3QuYXNzaWduKFN3ZWV0QWxlcnQucHJvdG90eXBlLCBpbnN0YW5jZU1ldGhvZHMpOyAvLyBBc3NpZ24gc3RhdGljIG1ldGhvZHMgZnJvbSBzcmMvc3RhdGljTWV0aG9kcy8qLmpzIHRvIGNvbnN0cnVjdG9yXG5cbiAgT2JqZWN0LmFzc2lnbihTd2VldEFsZXJ0LCBzdGF0aWNNZXRob2RzKTsgLy8gUHJveHkgdG8gaW5zdGFuY2UgbWV0aG9kcyB0byBjb25zdHJ1Y3RvciwgZm9yIG5vdywgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cbiAgT2JqZWN0LmtleXMoaW5zdGFuY2VNZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgU3dlZXRBbGVydFtrZXldID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gY3VycmVudEluc3RhbmNlW2tleV0oLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiAgU3dlZXRBbGVydC5EaXNtaXNzUmVhc29uID0gRGlzbWlzc1JlYXNvbjtcbiAgU3dlZXRBbGVydC52ZXJzaW9uID0gJzExLjQuMjYnO1xuXG4gIGNvbnN0IFN3YWwgPSBTd2VldEFsZXJ0OyAvLyBAdHMtaWdub3JlXG5cbiAgU3dhbC5kZWZhdWx0ID0gU3dhbDtcblxuICByZXR1cm4gU3dhbDtcblxufSkpO1xuaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLlN3ZWV0YWxlcnQyKXsgIHRoaXMuc3dhbCA9IHRoaXMuc3dlZXRBbGVydCA9IHRoaXMuU3dhbCA9IHRoaXMuU3dlZXRBbGVydCA9IHRoaXMuU3dlZXRhbGVydDJ9XG5cblwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZnVuY3Rpb24oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtpZihlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChuKSxuLnN0eWxlU2hlZXQpbi5zdHlsZVNoZWV0LmRpc2FibGVkfHwobi5zdHlsZVNoZWV0LmNzc1RleHQ9dCk7ZWxzZSB0cnl7bi5pbm5lckhUTUw9dH1jYXRjaChlKXtuLmlubmVyVGV4dD10fX0oZG9jdW1lbnQsXCIuc3dhbDItcG9wdXAuc3dhbDItdG9hc3R7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtY29sdW1uOjEvNCFpbXBvcnRhbnQ7Z3JpZC1yb3c6MS80IWltcG9ydGFudDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDk5ZnIgMWZyO3BhZGRpbmc6MWVtO292ZXJmbG93LXk6aGlkZGVuO2JhY2tncm91bmQ6I2ZmZjtib3gtc2hhZG93OjAgMCAxcHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDAgMXB4IDJweCBoc2xhKDBkZWcsMCUsMCUsLjA3NSksMXB4IDJweCA0cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpLDFweCAzcHggOHB4IGhzbGEoMGRlZywwJSwwJSwuMDc1KSwycHggNHB4IDE2cHggaHNsYSgwZGVnLDAlLDAlLC4wNzUpO3BvaW50ZXItZXZlbnRzOmFsbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Q+KntncmlkLWNvbHVtbjoyfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItdGl0bGV7bWFyZ2luOi41ZW0gMWVtO3BhZGRpbmc6MDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRpbmd7anVzdGlmeS1jb250ZW50OmNlbnRlcn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWlucHV0e2hlaWdodDoyZW07bWFyZ2luOi41ZW07Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXZhbGlkYXRpb24tbWVzc2FnZXtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItZm9vdGVye21hcmdpbjouNWVtIDAgMDtwYWRkaW5nOi41ZW0gMCAwO2ZvbnQtc2l6ZTouOGVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItY2xvc2V7Z3JpZC1jb2x1bW46My8zO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6LjhlbTtoZWlnaHQ6LjhlbTttYXJnaW46MDtmb250LXNpemU6MmVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaHRtbC1jb250YWluZXJ7bWFyZ2luOi41ZW0gMWVtO3BhZGRpbmc6MDtmb250LXNpemU6MWVtO3RleHQtYWxpZ246aW5pdGlhbH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWh0bWwtY29udGFpbmVyOmVtcHR5e3BhZGRpbmc6MH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRlcntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO2hlaWdodDoyZW07bWFyZ2luOi4yNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbntncmlkLWNvbHVtbjoxO2dyaWQtcm93OjEvOTk7YWxpZ24tc2VsZjpjZW50ZXI7d2lkdGg6MmVtO21pbi13aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46MCAuNWVtIDAgMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxLjhlbTtmb250LXdlaWdodDo3MDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV17dG9wOi44NzVlbTt3aWR0aDoxLjM3NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0Oi4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1hY3Rpb25ze2p1c3RpZnktY29udGVudDpmbGV4LXN0YXJ0O2hlaWdodDphdXRvO21hcmdpbjowO21hcmdpbi10b3A6LjVlbTtwYWRkaW5nOjAgLjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN0eWxlZHttYXJnaW46LjI1ZW0gLjVlbTtwYWRkaW5nOi40ZW0gLjZlbTtmb250LXNpemU6MWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2Vzc3tib3JkZXItY29sb3I6I2E1ZGM4Nn0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVde3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjEuNmVtO2hlaWdodDozZW07dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7Ym9yZGVyLXJhZGl1czo1MCV9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9bGVmdF17dG9wOi0uOGVtO2xlZnQ6LS41ZW07dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybS1vcmlnaW46MmVtIDJlbTtib3JkZXItcmFkaXVzOjRlbSAwIDAgNGVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LS4yNWVtO2xlZnQ6LjkzNzVlbTt0cmFuc2Zvcm0tb3JpZ2luOjAgMS41ZW07Ym9yZGVyLXJhZGl1czowIDRlbSA0ZW0gMH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3t3aWR0aDoyZW07aGVpZ2h0OjJlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3RvcDowO2xlZnQ6LjQzNzVlbTt3aWR0aDouNDM3NWVtO2hlaWdodDoyLjY4NzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVde2hlaWdodDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPXRpcF17dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPWxvbmdde3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3Quc3dhbDItc2hvd3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1zaG93IC41czthbmltYXRpb246c3dhbDItdG9hc3Qtc2hvdyAuNXN9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0LnN3YWwyLWhpZGV7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3QtaGlkZSAuMXMgZm9yd2FyZHM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWhpZGUgLjFzIGZvcndhcmRzfS5zd2FsMi1jb250YWluZXJ7ZGlzcGxheTpncmlkO3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTA2MDt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MDtib3gtc2l6aW5nOmJvcmRlci1ib3g7Z3JpZC10ZW1wbGF0ZS1hcmVhczpcXFwidG9wLXN0YXJ0ICAgICB0b3AgICAgICAgICAgICB0b3AtZW5kXFxcIiBcXFwiY2VudGVyLXN0YXJ0ICBjZW50ZXIgICAgICAgICBjZW50ZXItZW5kXFxcIiBcXFwiYm90dG9tLXN0YXJ0ICBib3R0b20tY2VudGVyICBib3R0b20tZW5kXFxcIjtncmlkLXRlbXBsYXRlLXJvd3M6bWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0bykgbWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0bykgbWlubWF4KC13ZWJraXQtbWluLWNvbnRlbnQsYXV0byk7Z3JpZC10ZW1wbGF0ZS1yb3dzOm1pbm1heChtaW4tY29udGVudCxhdXRvKSBtaW5tYXgobWluLWNvbnRlbnQsYXV0bykgbWlubWF4KG1pbi1jb250ZW50LGF1dG8pO2hlaWdodDoxMDAlO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93LXg6aGlkZGVuO3RyYW5zaXRpb246YmFja2dyb3VuZC1jb2xvciAuMXM7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6dG91Y2h9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1iYWNrZHJvcC1zaG93LC5zd2FsMi1jb250YWluZXIuc3dhbDItbm9hbmltYXRpb257YmFja2dyb3VuZDpyZ2JhKDAsMCwwLC40KX0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJhY2tkcm9wLWhpZGV7YmFja2dyb3VuZDowIDAhaW1wb3J0YW50fS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwxZnIpIGF1dG8gYXV0b30uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbSwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlciwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6YXV0byBtaW5tYXgoMCwxZnIpIGF1dG99LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOmF1dG8gYXV0byBtaW5tYXgoMCwxZnIpfS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0Pi5zd2FsMi1wb3B1cHthbGlnbi1zZWxmOnN0YXJ0fS5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wPi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjoyO2FsaWduLXNlbGY6c3RhcnQ7anVzdGlmeS1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmQ+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0Pi5zd2FsMi1wb3B1cHtncmlkLWNvbHVtbjozO2FsaWduLXNlbGY6c3RhcnQ7anVzdGlmeS1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1sZWZ0Pi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydD4uc3dhbDItcG9wdXB7Z3JpZC1yb3c6MjthbGlnbi1zZWxmOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlcj4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyO2p1c3RpZnktc2VsZjpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztncmlkLXJvdzoyO2FsaWduLXNlbGY6Y2VudGVyO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tbGVmdD4uc3dhbDItcG9wdXAsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnQ+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjE7Z3JpZC1yb3c6MzthbGlnbi1zZWxmOmVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbT4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MjtncmlkLXJvdzozO2p1c3RpZnktc2VsZjpjZW50ZXI7YWxpZ24tc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kPi5zd2FsMi1wb3B1cCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodD4uc3dhbDItcG9wdXB7Z3JpZC1jb2x1bW46MztncmlkLXJvdzozO2FsaWduLXNlbGY6ZW5kO2p1c3RpZnktc2VsZjplbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWZ1bGxzY3JlZW4+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1yb3c+LnN3YWwyLXBvcHVwe2dyaWQtY29sdW1uOjEvNDt3aWR0aDoxMDAlfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4+LnN3YWwyLXBvcHVwLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1mdWxsc2NyZWVuPi5zd2FsMi1wb3B1cHtncmlkLXJvdzoxLzQ7YWxpZ24tc2VsZjpzdHJldGNofS5zd2FsMi1jb250YWluZXIuc3dhbDItbm8tdHJhbnNpdGlvbnt0cmFuc2l0aW9uOm5vbmUhaW1wb3J0YW50fS5zd2FsMi1wb3B1cHtkaXNwbGF5Om5vbmU7cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpib3JkZXItYm94O2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMCwxMDAlKTt3aWR0aDozMmVtO21heC13aWR0aDoxMDAlO3BhZGRpbmc6MCAwIDEuMjVlbTtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOiNmZmY7Y29sb3I6IzU0NTQ1NDtmb250LWZhbWlseTppbmhlcml0O2ZvbnQtc2l6ZToxcmVtfS5zd2FsMi1wb3B1cDpmb2N1c3tvdXRsaW5lOjB9LnN3YWwyLXBvcHVwLnN3YWwyLWxvYWRpbmd7b3ZlcmZsb3cteTpoaWRkZW59LnN3YWwyLXRpdGxle3Bvc2l0aW9uOnJlbGF0aXZlO21heC13aWR0aDoxMDAlO21hcmdpbjowO3BhZGRpbmc6LjhlbSAxZW0gMDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjg3NWVtO2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtd3JhcDpicmVhay13b3JkfS5zd2FsMi1hY3Rpb25ze2Rpc3BsYXk6ZmxleDt6LWluZGV4OjE7Ym94LXNpemluZzpib3JkZXItYm94O2ZsZXgtd3JhcDp3cmFwO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOmF1dG87bWFyZ2luOjEuMjVlbSBhdXRvIDA7cGFkZGluZzowfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZFtkaXNhYmxlZF17b3BhY2l0eTouNH0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWQ6aG92ZXJ7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMSkscmdiYSgwLDAsMCwuMSkpfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMikscmdiYSgwLDAsMCwuMikpfS5zd2FsMi1sb2FkZXJ7ZGlzcGxheTpub25lO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjIuMmVtO2hlaWdodDoyLjJlbTttYXJnaW46MCAxLjg3NWVtOy13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1sb2FkaW5nIDEuNXMgbGluZWFyIDBzIGluZmluaXRlIG5vcm1hbDthbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2JvcmRlci13aWR0aDouMjVlbTtib3JkZXItc3R5bGU6c29saWQ7Ym9yZGVyLXJhZGl1czoxMDAlO2JvcmRlci1jb2xvcjojMjc3OGM0IHRyYW5zcGFyZW50ICMyNzc4YzQgdHJhbnNwYXJlbnR9LnN3YWwyLXN0eWxlZHttYXJnaW46LjMxMjVlbTtwYWRkaW5nOi42MjVlbSAxLjFlbTt0cmFuc2l0aW9uOmJveC1zaGFkb3cgLjFzO2JveC1zaGFkb3c6MCAwIDAgM3B4IHRyYW5zcGFyZW50O2ZvbnQtd2VpZ2h0OjUwMH0uc3dhbDItc3R5bGVkOm5vdChbZGlzYWJsZWRdKXtjdXJzb3I6cG9pbnRlcn0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm17Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czouMjVlbTtiYWNrZ3JvdW5kOmluaXRpYWw7YmFja2dyb3VuZC1jb2xvcjojNzA2NmUwO2NvbG9yOiNmZmY7Zm9udC1zaXplOjFlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWNvbmZpcm06Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAzcHggcmdiYSgxMTIsMTAyLDIyNCwuNSl9LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55e2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6I2RjMzc0MTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXN0eWxlZC5zd2FsMi1kZW55OmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMjIwLDU1LDY1LC41KX0uc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbHtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiM2ZTc4ODE7Y29sb3I6I2ZmZjtmb250LXNpemU6MWVtfS5zd2FsMi1zdHlsZWQuc3dhbDItY2FuY2VsOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTEwLDEyMCwxMjksLjUpfS5zd2FsMi1zdHlsZWQuc3dhbDItZGVmYXVsdC1vdXRsaW5lOmZvY3Vze2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1zdHlsZWQ6Zm9jdXN7b3V0bGluZTowfS5zd2FsMi1zdHlsZWQ6Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyOjB9LnN3YWwyLWZvb3RlcntqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6MWVtIDFlbSAwO2JvcmRlci10b3A6MXB4IHNvbGlkICNlZWU7Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MWVtfS5zd2FsMi10aW1lci1wcm9ncmVzcy1iYXItY29udGFpbmVye3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0OjA7Ym90dG9tOjA7bGVmdDowO2dyaWQtY29sdW1uOmF1dG8haW1wb3J0YW50O292ZXJmbG93OmhpZGRlbjtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czo1cHg7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czo1cHh9LnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhcnt3aWR0aDoxMDAlO2hlaWdodDouMjVlbTtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjIpfS5zd2FsMi1pbWFnZXttYXgtd2lkdGg6MTAwJTttYXJnaW46MmVtIGF1dG8gMWVtfS5zd2FsMi1jbG9zZXt6LWluZGV4OjI7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6MS4yZW07aGVpZ2h0OjEuMmVtO21hcmdpbi10b3A6MDttYXJnaW4tcmlnaHQ6MDttYXJnaW4tYm90dG9tOi0xLjJlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aGlkZGVuO3RyYW5zaXRpb246Y29sb3IgLjFzLGJveC1zaGFkb3cgLjFzO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQ6MCAwO2NvbG9yOiNjY2M7Zm9udC1mYW1pbHk6c2VyaWY7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZToyLjVlbTtjdXJzb3I6cG9pbnRlcjtqdXN0aWZ5LXNlbGY6ZW5kfS5zd2FsMi1jbG9zZTpob3Zlcnt0cmFuc2Zvcm06bm9uZTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjojZjI3NDc0fS5zd2FsMi1jbG9zZTpmb2N1c3tvdXRsaW5lOjA7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAzcHggcmdiYSgxMDAsMTUwLDIwMCwuNSl9LnN3YWwyLWNsb3NlOjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowfS5zd2FsMi1odG1sLWNvbnRhaW5lcnt6LWluZGV4OjE7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIDEuNmVtIC4zZW07cGFkZGluZzowO292ZXJmbG93OmF1dG87Y29sb3I6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbTtmb250LXdlaWdodDo0MDA7bGluZS1oZWlnaHQ6bm9ybWFsO3RleHQtYWxpZ246Y2VudGVyO3dvcmQtd3JhcDpicmVhay13b3JkO3dvcmQtYnJlYWs6YnJlYWstd29yZH0uc3dhbDItY2hlY2tib3gsLnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi1yYWRpbywuc3dhbDItc2VsZWN0LC5zd2FsMi10ZXh0YXJlYXttYXJnaW46MWVtIDJlbSAzcHh9LnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi10ZXh0YXJlYXtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6YXV0bzt0cmFuc2l0aW9uOmJvcmRlci1jb2xvciAuMXMsYm94LXNoYWRvdyAuMXM7Ym9yZGVyOjFweCBzb2xpZCAjZDlkOWQ5O2JvcmRlci1yYWRpdXM6LjE4NzVlbTtiYWNrZ3JvdW5kOjAgMDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHRyYW5zcGFyZW50O2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWZpbGUuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItaW5wdXQuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItdGV4dGFyZWEuc3dhbDItaW5wdXRlcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDAgMnB4ICNmMjc0NzQhaW1wb3J0YW50fS5zd2FsMi1maWxlOmZvY3VzLC5zd2FsMi1pbnB1dDpmb2N1cywuc3dhbDItdGV4dGFyZWE6Zm9jdXN7Ym9yZGVyOjFweCBzb2xpZCAjYjRkYmVkO291dGxpbmU6MDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNiksMCAwIDAgM3B4IHJnYmEoMTAwLDE1MCwyMDAsLjUpfS5zd2FsMi1maWxlOjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6LW1vei1wbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6Oi1tb3otcGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItZmlsZTo6cGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjpwbGFjZWhvbGRlciwuc3dhbDItdGV4dGFyZWE6OnBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLXJhbmdle21hcmdpbjoxZW0gMmVtIDNweDtiYWNrZ3JvdW5kOiNmZmZ9LnN3YWwyLXJhbmdlIGlucHV0e3dpZHRoOjgwJX0uc3dhbDItcmFuZ2Ugb3V0cHV0e3dpZHRoOjIwJTtjb2xvcjppbmhlcml0O2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItcmFuZ2UgaW5wdXQsLnN3YWwyLXJhbmdlIG91dHB1dHtoZWlnaHQ6Mi42MjVlbTtwYWRkaW5nOjA7Zm9udC1zaXplOjEuMTI1ZW07bGluZS1oZWlnaHQ6Mi42MjVlbX0uc3dhbDItaW5wdXR7aGVpZ2h0OjIuNjI1ZW07cGFkZGluZzowIC43NWVtfS5zd2FsMi1maWxle3dpZHRoOjc1JTttYXJnaW4tcmlnaHQ6YXV0bzttYXJnaW4tbGVmdDphdXRvO2JhY2tncm91bmQ6MCAwO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi10ZXh0YXJlYXtoZWlnaHQ6Ni43NWVtO3BhZGRpbmc6Ljc1ZW19LnN3YWwyLXNlbGVjdHttaW4td2lkdGg6NTAlO21heC13aWR0aDoxMDAlO3BhZGRpbmc6LjM3NWVtIC42MjVlbTtiYWNrZ3JvdW5kOjAgMDtjb2xvcjppbmhlcml0O2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCwuc3dhbDItcmFkaW97YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7YmFja2dyb3VuZDojZmZmO2NvbG9yOmluaGVyaXR9LnN3YWwyLWNoZWNrYm94IGxhYmVsLC5zd2FsMi1yYWRpbyBsYWJlbHttYXJnaW46MCAuNmVtO2ZvbnQtc2l6ZToxLjEyNWVtfS5zd2FsMi1jaGVja2JveCBpbnB1dCwuc3dhbDItcmFkaW8gaW5wdXR7ZmxleC1zaHJpbms6MDttYXJnaW46MCAuNGVtfS5zd2FsMi1pbnB1dC1sYWJlbHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MWVtIGF1dG8gMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjoxZW0gMCAwO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOiNmMGYwZjA7Y29sb3I6IzY2Njtmb250LXNpemU6MWVtO2ZvbnQtd2VpZ2h0OjMwMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlOjpiZWZvcmV7Y29udGVudDpcXFwiIVxcXCI7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MS41ZW07bWluLXdpZHRoOjEuNWVtO2hlaWdodDoxLjVlbTttYXJnaW46MCAuNjI1ZW07Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0O2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwO2xpbmUtaGVpZ2h0OjEuNWVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1pY29ue3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaXppbmc6Y29udGVudC1ib3g7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDo1ZW07aGVpZ2h0OjVlbTttYXJnaW46Mi41ZW0gYXV0byAuNmVtO2JvcmRlcjouMjVlbSBzb2xpZCB0cmFuc3BhcmVudDtib3JkZXItcmFkaXVzOjUwJTtib3JkZXItY29sb3I6IzAwMDtmb250LWZhbWlseTppbmhlcml0O2xpbmUtaGVpZ2h0OjVlbTtjdXJzb3I6ZGVmYXVsdDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnN3YWwyLWljb24gLnN3YWwyLWljb24tY29udGVudHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZTozLjc1ZW19LnN3YWwyLWljb24uc3dhbDItZXJyb3J7Ym9yZGVyLWNvbG9yOiNmMjc0NzQ7Y29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciAuc3dhbDIteC1tYXJre3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtZ3JvdzoxfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjIuMzEyNWVtO3dpZHRoOjIuOTM3NWVtO2hlaWdodDouMzEyNWVtO2JvcmRlci1yYWRpdXM6LjEyNWVtO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDoxLjA2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9cmlnaHRde3JpZ2h0OjFlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItZXJyb3Iuc3dhbDItaWNvbi1zaG93IC5zd2FsMi14LW1hcmt7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci14LW1hcmsgLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXN9LnN3YWwyLWljb24uc3dhbDItd2FybmluZ3tib3JkZXItY29sb3I6I2ZhY2VhODtjb2xvcjojZjhiYjg2fS5zd2FsMi1pY29uLnN3YWwyLXdhcm5pbmcuc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItd2FybmluZy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLWljb24tY29udGVudHstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWktbWFyayAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC41c30uc3dhbDItaWNvbi5zd2FsMi1pbmZve2JvcmRlci1jb2xvcjojOWRlMGY2O2NvbG9yOiMzZmMzZWV9LnN3YWwyLWljb24uc3dhbDItaW5mby5zd2FsMi1pY29uLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1lcnJvci1pY29uIC41c30uc3dhbDItaWNvbi5zd2FsMi1pbmZvLnN3YWwyLWljb24tc2hvdyAuc3dhbDItaWNvbi1jb250ZW50ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtaS1tYXJrIC44czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1pLW1hcmsgLjhzfS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9ue2JvcmRlci1jb2xvcjojYzlkYWUxO2NvbG9yOiM4N2FkYmR9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbiAuNXN9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb24uc3dhbDItaWNvbi1zaG93IC5zd2FsMi1pY29uLWNvbnRlbnR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrIC44czthbmltYXRpb246c3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrIC44c30uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNze2JvcmRlci1jb2xvcjojYTVkYzg2O2NvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6My43NWVtO2hlaWdodDo3LjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKTtib3JkZXItcmFkaXVzOjUwJX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9bGVmdF17dG9wOi0uNDM3NWVtO2xlZnQ6LTIuMDYzNWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjMuNzVlbSAzLjc1ZW07Ym9yZGVyLXJhZGl1czo3LjVlbSAwIDAgNy41ZW19LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPXJpZ2h0XXt0b3A6LS42ODc1ZW07bGVmdDoxLjg3NWVtO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm0tb3JpZ2luOjAgMy43NWVtO2JvcmRlci1yYWRpdXM6MCA3LjVlbSA3LjVlbSAwfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3twb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7dG9wOi0uMjVlbTtsZWZ0Oi0uMjVlbTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7Ym9yZGVyOi4yNWVtIHNvbGlkIHJnYmEoMTY1LDIyMCwxMzQsLjMpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTt0b3A6LjVlbTtsZWZ0OjEuNjI1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6NS42MjVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV17ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7aGVpZ2h0Oi4zMTI1ZW07Ym9yZGVyLXJhZGl1czouMTI1ZW07YmFja2dyb3VuZC1jb2xvcjojYTVkYzg2fS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoyLjg3NWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXVtjbGFzcyQ9bG9uZ117dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2Vzcy5zd2FsMi1pY29uLXNob3cgLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXB7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3Muc3dhbDItaWNvbi1zaG93IC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1c30uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzLnN3YWwyLWljb24tc2hvdyAuc3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmUgNC4yNXMgZWFzZS1pbjthbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWlufS5zd2FsMi1wcm9ncmVzcy1zdGVwc3tmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjEuMjVlbSBhdXRvO3BhZGRpbmc6MDtiYWNrZ3JvdW5kOjAgMDtmb250LXdlaWdodDo2MDB9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIGxpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcHt6LWluZGV4OjIwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6MmVtO2hlaWdodDoyZW07Ym9yZGVyLXJhZGl1czoyZW07YmFja2dyb3VuZDojMjc3OGM0O2NvbG9yOiNmZmY7bGluZS1oZWlnaHQ6MmVtO3RleHQtYWxpZ246Y2VudGVyfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiMyNzc4YzR9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLnN3YWwyLWFjdGl2ZS1wcm9ncmVzcy1zdGVwfi5zd2FsMi1wcm9ncmVzcy1zdGVwe2JhY2tncm91bmQ6I2FkZDhlNjtjb2xvcjojZmZmfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcC1saW5le2JhY2tncm91bmQ6I2FkZDhlNn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXt6LWluZGV4OjEwO2ZsZXgtc2hyaW5rOjA7d2lkdGg6Mi41ZW07aGVpZ2h0Oi40ZW07bWFyZ2luOjAgLTFweDtiYWNrZ3JvdW5kOiMyNzc4YzR9W2NsYXNzXj1zd2FsMl17LXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOnRyYW5zcGFyZW50fS5zd2FsMi1zaG93ey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXNob3cgLjNzO2FuaW1hdGlvbjpzd2FsMi1zaG93IC4zc30uc3dhbDItaGlkZXstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1oaWRlIC4xNXMgZm9yd2FyZHM7YW5pbWF0aW9uOnN3YWwyLWhpZGUgLjE1cyBmb3J3YXJkc30uc3dhbDItbm9hbmltYXRpb257dHJhbnNpdGlvbjpub25lfS5zd2FsMi1zY3JvbGxiYXItbWVhc3VyZXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTk5OTlweDt3aWR0aDo1MHB4O2hlaWdodDo1MHB4O292ZXJmbG93OnNjcm9sbH0uc3dhbDItcnRsIC5zd2FsMi1jbG9zZXttYXJnaW4tcmlnaHQ6aW5pdGlhbDttYXJnaW4tbGVmdDowfS5zd2FsMi1ydGwgLnN3YWwyLXRpbWVyLXByb2dyZXNzLWJhcntyaWdodDowO2xlZnQ6YXV0b30ubGVhdmUtcnVzc2lhLW5vdy1hbmQtYXBwbHkteW91ci1za2lsbHMtdG8tdGhlLXdvcmxke2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjE5Mzk7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6MjVweCAwIDIwcHg7YmFja2dyb3VuZDojMjAyMzJhO2NvbG9yOiNmZmY7dGV4dC1hbGlnbjpjZW50ZXJ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBkaXZ7bWF4LXdpZHRoOjU2MHB4O21hcmdpbjoxMHB4O2xpbmUtaGVpZ2h0OjE0NiV9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBpZnJhbWV7bWF4LXdpZHRoOjEwMCU7bWF4LWhlaWdodDo1NS41NTU1NTU1NTU2dm1pbjttYXJnaW46MTZweCBhdXRvfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgc3Ryb25ne2JvcmRlci1ib3R0b206MnB4IGRhc2hlZCAjZmZmfS5sZWF2ZS1ydXNzaWEtbm93LWFuZC1hcHBseS15b3VyLXNraWxscy10by10aGUtd29ybGQgYnV0dG9ue2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjE5NDA7dG9wOjA7cmlnaHQ6MDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDo0OHB4O2hlaWdodDo0OHB4O21hcmdpbi1yaWdodDoxMHB4O21hcmdpbi1ib3R0b206LTEwcHg7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDowIDA7Y29sb3I6I2FhYTtmb250LXNpemU6NDhweDtmb250LXdlaWdodDo3MDA7Y3Vyc29yOnBvaW50ZXJ9LmxlYXZlLXJ1c3NpYS1ub3ctYW5kLWFwcGx5LXlvdXItc2tpbGxzLXRvLXRoZS13b3JsZCBidXR0b246aG92ZXJ7Y29sb3I6I2ZmZn1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCl9fUBrZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1oaWRlezEwMCV7dHJhbnNmb3JtOnJvdGF0ZVooMWRlZyk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWhpZGV7MTAwJXt0cmFuc2Zvcm06cm90YXRlWigxZGVnKTtvcGFjaXR5OjB9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOi41NjI1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDouMTI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOi42MjVlbTtsZWZ0Oi0uMjVlbTt3aWR0aDoxLjYyNWVtfTg0JXt0b3A6MS4wNjI1ZW07bGVmdDouNzVlbTt3aWR0aDouNWVtfTEwMCV7dG9wOjEuMTI1ZW07bGVmdDouMTg3NWVtO3dpZHRoOi43NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6LjU2MjVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOi4xMjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6LjYyNWVtO2xlZnQ6LS4yNWVtO3dpZHRoOjEuNjI1ZW19ODQle3RvcDoxLjA2MjVlbTtsZWZ0Oi43NWVtO3dpZHRoOi41ZW19MTAwJXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDoxLjYyNWVtO3JpZ2h0OjEuMzc1ZW07d2lkdGg6MH02NSV7dG9wOjEuMjVlbTtyaWdodDouOTM3NWVtO3dpZHRoOjB9ODQle3RvcDouOTM3NWVtO3JpZ2h0OjA7d2lkdGg6MS4xMjVlbX0xMDAle3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDoxLjYyNWVtO3JpZ2h0OjEuMzc1ZW07d2lkdGg6MH02NSV7dG9wOjEuMjVlbTtyaWdodDouOTM3NWVtO3dpZHRoOjB9ODQle3RvcDouOTM3NWVtO3JpZ2h0OjA7d2lkdGg6MS4xMjVlbX0xMDAle3RvcDouOTM3NWVtO3JpZ2h0Oi4xODc1ZW07d2lkdGg6MS4zNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXNob3d7MCV7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXt0cmFuc2Zvcm06c2NhbGUoLjk1KX0xMDAle3RyYW5zZm9ybTpzY2FsZSgxKX19QGtleWZyYW1lcyBzd2FsMi1zaG93ezAle3RyYW5zZm9ybTpzY2FsZSguNyl9NDUle3RyYW5zZm9ybTpzY2FsZSgxLjA1KX04MCV7dHJhbnNmb3JtOnNjYWxlKC45NSl9MTAwJXt0cmFuc2Zvcm06c2NhbGUoMSl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1oaWRlezAle3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QGtleWZyYW1lcyBzd2FsMi1oaWRlezAle3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6MS4xODc1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDoxLjA2MjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6Mi4xODc1ZW07bGVmdDotLjM3NWVtO3dpZHRoOjMuMTI1ZW19ODQle3RvcDozZW07bGVmdDoxLjMxMjVlbTt3aWR0aDoxLjA2MjVlbX0xMDAle3RvcDoyLjgxMjVlbTtsZWZ0Oi44MTI1ZW07d2lkdGg6MS41NjI1ZW19fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDoxLjE4NzVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOjEuMDYyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDoyLjE4NzVlbTtsZWZ0Oi0uMzc1ZW07d2lkdGg6My4xMjVlbX04NCV7dG9wOjNlbTtsZWZ0OjEuMzEyNWVtO3dpZHRoOjEuMDYyNWVtfTEwMCV7dG9wOjIuODEyNWVtO2xlZnQ6LjgxMjVlbTt3aWR0aDoxLjU2MjVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTY1JXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9ODQle3RvcDoyLjE4NzVlbTtyaWdodDowO3dpZHRoOjMuNDM3NWVtfTEwMCV7dG9wOjIuMzc1ZW07cmlnaHQ6LjVlbTt3aWR0aDoyLjkzNzVlbX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH02NSV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTg0JXt0b3A6Mi4xODc1ZW07cmlnaHQ6MDt3aWR0aDozLjQzNzVlbX0xMDAle3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lezAle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX01JXt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9MTIle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9MTAwJXt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUle3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFya3swJXttYXJnaW4tdG9wOjEuNjI1ZW07dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9NTAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH04MCV7bWFyZ2luLXRvcDotLjM3NWVtO3RyYW5zZm9ybTpzY2FsZSgxLjE1KX0xMDAle21hcmdpbi10b3A6MDt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTt0cmFuc2Zvcm06c2NhbGUoLjQpO29wYWNpdHk6MH01MCV7bWFyZ2luLXRvcDoxLjYyNWVtO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7dHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTtvcGFjaXR5OjB9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci1pY29uezAle3RyYW5zZm9ybTpyb3RhdGVYKDEwMGRlZyk7b3BhY2l0eTowfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwKX0xMDAle3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19QGtleWZyYW1lcyBzd2FsMi1yb3RhdGUtbG9hZGluZ3swJXt0cmFuc2Zvcm06cm90YXRlKDApfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVZKC0zNjBkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVkoMCl9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1xdWVzdGlvbi1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVZKC0zNjBkZWcpfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVkoMCl9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWktbWFya3swJXt0cmFuc2Zvcm06cm90YXRlWig0NWRlZyk7b3BhY2l0eTowfTI1JXt0cmFuc2Zvcm06cm90YXRlWigtMjVkZWcpO29wYWNpdHk6LjR9NTAle3RyYW5zZm9ybTpyb3RhdGVaKDE1ZGVnKTtvcGFjaXR5Oi44fTc1JXt0cmFuc2Zvcm06cm90YXRlWigtNWRlZyk7b3BhY2l0eToxfTEwMCV7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtaS1tYXJrezAle3RyYW5zZm9ybTpyb3RhdGVaKDQ1ZGVnKTtvcGFjaXR5OjB9MjUle3RyYW5zZm9ybTpyb3RhdGVaKC0yNWRlZyk7b3BhY2l0eTouNH01MCV7dHJhbnNmb3JtOnJvdGF0ZVooMTVkZWcpO29wYWNpdHk6Ljh9NzUle3RyYW5zZm9ybTpyb3RhdGVaKC01ZGVnKTtvcGFjaXR5OjF9MTAwJXt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bil7b3ZlcmZsb3c6aGlkZGVufWJvZHkuc3dhbDItaGVpZ2h0LWF1dG97aGVpZ2h0OmF1dG8haW1wb3J0YW50fWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lcntiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50IWltcG9ydGFudDtwb2ludGVyLWV2ZW50czpub25lfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lciAuc3dhbDItcG9wdXB7cG9pbnRlci1ldmVudHM6YWxsfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLWNvbnRhaW5lciAuc3dhbDItbW9kYWx7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDAsMCwwLC40KX1AbWVkaWEgcHJpbnR7Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKXtvdmVyZmxvdy15OnNjcm9sbCFpbXBvcnRhbnR9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKT5bYXJpYS1oaWRkZW49dHJ1ZV17ZGlzcGxheTpub25lfWJvZHkuc3dhbDItc2hvd246bm90KC5zd2FsMi1uby1iYWNrZHJvcCk6bm90KC5zd2FsMi10b2FzdC1zaG93bikgLnN3YWwyLWNvbnRhaW5lcntwb3NpdGlvbjpzdGF0aWMhaW1wb3J0YW50fX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXJ7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjM2MHB4O21heC13aWR0aDoxMDAlO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7cG9pbnRlci1ldmVudHM6bm9uZX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9we3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1yaWdodHt0b3A6MDtyaWdodDowO2JvdHRvbTphdXRvO2xlZnQ6YXV0b31ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1zdGFydHt0b3A6MDtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6MH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWxlZnQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1zdGFydHt0b3A6NTAlO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXJ7dG9wOjUwJTtyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXJpZ2h0e3RvcDo1MCU7cmlnaHQ6MDtib3R0b206YXV0bztsZWZ0OmF1dG87dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnR7dG9wOmF1dG87cmlnaHQ6YXV0bztib3R0b206MDtsZWZ0OjB9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbXt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kLGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tcmlnaHR7dG9wOmF1dG87cmlnaHQ6MDtib3R0b206MDtsZWZ0OmF1dG99XCIpOyIsICJjb25zdCBTd2FsID0gcmVxdWlyZShcInN3ZWV0YWxlcnQyXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gcGQoLi4ubWVzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhtZXMpO1xufVxuXG5mdW5jdGlvbiBub3JtYWwobWVzOiBzdHJpbmcpIHtcbiAgICBTd2FsLmZpcmUoe1xuICAgICAgICB0ZXh0OiBtZXMsXG4gICAgICAgIHRvYXN0OiB0cnVlLFxuICAgICAgICBwb3NpdGlvbjogXCJ0b3AtZW5kXCIsXG4gICAgICAgIHRpbWVyOiAzICogMTAwMCxcbiAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlXG4gICAgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBjb25maXJtKG1lczogc3RyaW5nLCBvazogc3RyaW5nLCBjYW5jZWw6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IFN3YWwuZmlyZSh7XG4gICAgICAgIHRleHQ6IG1lcyxcbiAgICAgICAgdG9hc3Q6IGZhbHNlLFxuICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2UsXG4gICAgICAgIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogb2ssXG4gICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IGNhbmNlbCxcbiAgICB9KTtcbiAgICBjb25zdCByZXQ6Ym9vbGVhbiA9IHJlcy52YWx1ZTtcbiAgICByZXR1cm4gcmV0O1xufVxuZXhwb3J0IHZhciB0b2FzdCA9IHtcbiAgICBub3JtYWw6IG5vcm1hbCxcbiAgICBjb25maXJtOiBjb25maXJtXG59XG5leHBvcnQgZnVuY3Rpb24gdG9SZ2JIZXgoY29sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIiNcIiArIGNvbC5tYXRjaCgvXFxkKy9nKS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIChcIjBcIiArIHBhcnNlSW50KGEpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpfSkuam9pbihcIlwiKTtcbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4uL0RyYXdFdmVudEhhbmRsZXJcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5cbmV4cG9ydCBjbGFzcyBNb3VzZVNlbnNvciB7XG4gICAgcHJpdmF0ZSBzZW5zZTogRHJhd0V2ZW50SGFuZGxlcjtcbiAgICBwcml2YXRlIHBhcGVyOiBQYXBlckVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNldXBcIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS51cChcIm1vdXNlXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJtb3VzZWRvd25cIl0gPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zZW5zZS5kb3duKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcIm1vdXNlbW92ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLm1vdmUoXCJtb3VzZVwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wibW91c2VsZWF2ZVwiXSA9IChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwibW91c2VcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5hZGREZWZhdWx0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVEZWZhdWx0TGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHAoZTogTW91c2VFdmVudCk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFBvaW50ZXJTZW5zb3Ige1xuICAgIHByaXZhdGUgc2Vuc2U6IERyYXdFdmVudEhhbmRsZXI7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgY2FudmFzaGFuZGxlcnM6ICgoZTogVG91Y2hFdmVudCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gICAgcHVibGljIGluaXQoc2Vuc2U6IERyYXdFdmVudEhhbmRsZXIsIHBhcGVyOiBQYXBlckVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5zZSA9IHNlbnNlO1xuICAgICAgICB0aGlzLnBhcGVyID0gcGFwZXI7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVydXBcIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLnVwKFwicG9pbnRlclwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1wicG9pbnRlcmRvd25cIl0gPSAoZTogUG9pbnRlckV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJwb2ludGVybW92ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInBvaW50ZXJcIiwgZSwgdGhpcy5wKGUpKTtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInBvaW50ZXJsZWF2ZVwiXSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJwb2ludGVyXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuYWRkRGVmYXVsdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERlZmF1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGVmYXVsdExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IFtldmVudCwgaGFuZGxlcl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5jYW52YXNoYW5kbGVycykpIHtcbiAgICAgICAgICAgIHRoaXMucGFwZXIuZ2V0Q252KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHAoZSk6IFBvaW50IHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gZS5vZmZzZXRYO1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBlLm9mZnNldFk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdFdmVudEhhbmRsZXIgfSBmcm9tIFwiLi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHsgUGFwZXJFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCAqIGFzIFUgZnJvbSBcIi4uL3UvdVwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuZXhwb3J0IGNsYXNzIFRvdWNoU2Vuc29yIHtcbiAgICBwcml2YXRlIHNlbnNlOiBEcmF3RXZlbnRIYW5kbGVyO1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIHpvb21zY3JvbGw6IFpvb21TY3JvbGxBY3Rpb247XG4gICAgcHJpdmF0ZSBjYW52YXNoYW5kbGVyczogKChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkKVtdID0gW107XG5cbiAgICBwdWJsaWMgaW5pdChzZW5zZTogRHJhd0V2ZW50SGFuZGxlciwgcGFwZXI6IFBhcGVyRWxlbWVudCwgem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbnNlID0gc2Vuc2U7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsID0gem9vbXNjcm9sbDtcbiAgICAgICAgdGhpcy5jYW52YXNoYW5kbGVyc1tcInRvdWNoZW5kXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2hzdGFydFwiXSA9IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLnNlbnNlLmRvd24oXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmNhbnZhc2hhbmRsZXJzW1widG91Y2htb3ZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UubW92ZShcInRvdWNoXCIsIGUsIHRoaXMucChlKSk7XG4gICAgICAgIHRoaXMuY2FudmFzaGFuZGxlcnNbXCJ0b3VjaGxlYXZlXCJdID0gKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMuc2Vuc2UudXAoXCJ0b3VjaFwiLCBlLCB0aGlzLnAoZSkpO1xuICAgICAgICB0aGlzLmFkZERlZmF1bHRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGREZWZhdWx0TGlzdGVuZXIoKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2V2ZW50LCBoYW5kbGVyXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNhbnZhc2hhbmRsZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5wYXBlci5nZXRDbnYoKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZURlZmF1bHRMaXN0ZW5lcigpIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXZlbnQsIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuY2FudmFzaGFuZGxlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcGVyLmdldENudigpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwKGU6IFRvdWNoRXZlbnQpOiBQb2ludCB7XG4gICAgICAgIGNvbnN0IGN0ID0gZS5jaGFuZ2VkVG91Y2hlc1swXVxuICAgICAgICBjb25zdCBiYyA9ICg8SFRNTENhbnZhc0VsZW1lbnQ+ZS50YXJnZXQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB4ID0gY3QuY2xpZW50WCAtIGJjLmxlZnQ7XG4gICAgICAgIGNvbnN0IHkgPSBjdC5jbGllbnRZIC0gYmMudG9wO1xuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkV6b29tXHU0RjREXHU3RjZFXHUzMDZFXHU4OERDXHU2QjYzXHUzMDRDXHUzMDRCXHUzMDRCXHUzMDg5XHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU4QUJGXHU2NTc0XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCAvIHRoaXMuem9vbXNjcm9sbC5nZXRab29tKCksIHkgLyB0aGlzLnpvb21zY3JvbGwuZ2V0Wm9vbSgpKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBTYXZlRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZGF0YXN0b3JlOiBEcmF3TWluZTtcblxuICAgIHB1YmxpYyBpbml0KGRhdGFzdG9yZTogRHJhd01pbmUpIHtcbiAgICAgICAgdGhpcy5kYXRhc3RvcmUgPSBkYXRhc3RvcmU7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3Qtc2F2ZVwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmRhdGFzdG9yZS5zYXZlKCk7XG4gICAgICAgIFUudG9hc3Qubm9ybWFsKFwic2F2ZWRcIik7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuLi9kYXRhL0RyYXdPdGhlclwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuL1BlbkFjdGlvblwiO1xuaW1wb3J0IHsgU3Ryb2tlLCBQb2ludCwgRHJhdyB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIExvYWRBY3Rpb24ge1xuICAgIHByaXZhdGUgcGFwZXI6IFBhcGVyRWxlbWVudDtcbiAgICBwcml2YXRlIGRhdGFzdG9yZTogRHJhd090aGVyO1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHVibGljIGluaXQocGFwZXI6IFBhcGVyRWxlbWVudCwgZGF0YXN0b3JlOiBEcmF3T3RoZXIsIHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5kYXRhc3RvcmUgPSBkYXRhc3RvcmU7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgICAgICAvLyBVLnRvYXN0Lm5vcm1hbChcIm5vdyBsb2FkaW5nLi4uXCIpO1xuICAgICAgICB0aGlzLnByb2MoKTtcbiAgICB9XG4gICAgcHVibGljIGFzeW5jIHByb2MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHNlYyA9IDM7XG4gICAgICAgIGF3YWl0IHRoaXMuZGF0YXN0b3JlLmxvYWQoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWRyYXcodGhpcy5wYXBlciwgdGhpcy5kYXRhc3RvcmUsIHRoaXMucGVuKTtcbiAgICAgICAgLy8gVS50b2FzdC5ub3JtYWwoYGxvYWQgJHtzZWN9IHNlYy5gKTtcbiAgICAgICAgLy8gVS5wZChcImxvYWRlZCEhXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucHJvYygpLCBzZWMgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpcnN0OiBib29sZWFuID0gdHJ1ZTsgLy8gXHU1MjFEXHU1NkRFXHUzMEQ1XHUzMEU5XHUzMEIwXHUzMDAyXHUzMEVEXHUzMEZDXHUzMEM5XHU2NjQyXHUzMDZCXHUzMEQwXHUzMEJGXHUzMDY0XHUzMDRGXHUzMDVGXHUzMDgxXHUzMDAyXG4gICAgcHJpdmF0ZSBhc3luYyByZWRyYXcocGFwZXI6IFBhcGVyRWxlbWVudCwgZGF0YXN0b3JlOiBEcmF3T3RoZXIsIHBlbjogUGVuQWN0aW9uKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGRyYXdzOiBEcmF3W10gPSBkYXRhc3RvcmUuZ2V0RHJhd3MoKTtcblxuICAgICAgICBsZXQgcHJlcG9pbnQ6IFBvaW50ID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuZmlyc3QpIHtcbiAgICAgICAgICAgIHBhcGVyLmdldENudigpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZHJhdyBvZiBkcmF3cykge1xuICAgICAgICAgICAgLy8gXHU3M0ZFXHU1NzI4XHUzMDZFY2FudmFzXHUzMDZFXHU3MkI2XHU2MTRCXHUzMDkyXHUzMEFGXHUzMEVEXHUzMEZDXHUzMEYzXG4gICAgICAgICAgICBjb25zdCBia2ltZzogSFRNTEltYWdlRWxlbWVudCA9IGF3YWl0IHRoaXMudG9JbWFnZShwYXBlci5nZXRDbnYoKSk7XG5cbiAgICAgICAgICAgIC8vIFx1MzBBRlx1MzBFQVx1MzBBMlx1MzA1N1x1MzA2Nlx1NEVDQVx1NTZERVx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1NjZGOFx1MzA0RFx1OEZCQ1x1MzA3RlxuICAgICAgICAgICAgcGFwZXIuY2xlYXIoKTtcblxuICAgICAgICAgICAgLy8gXHU0RUNBXHU1NkRFXHUzMDZFXHU4QTE4XHU4RkYwXHUzMDkyXHU3NTFGXHU2MjEwXG4gICAgICAgICAgICBjb25zdCBzdHJva2VzID0gZHJhdy5nZXRTdHJva2VzKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygc3Ryb2tlcykge1xuXG4gICAgICAgICAgICAgICAgaWYgKHMuaXNFcmFzZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICBwZW4ub3B0LmNvbG9yID0gcy5jb2xvcjsgLy8gXHU4MjcyXHU2MEM1XHU1ODMxXHUzMDZGXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDRDXHU1RkY1XHUzMDZFXHU3MEJBXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICAgICAgICAgIHBlbi5vcHQuZXJhc2VyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZW4ub3B0LmNvbG9yID0gcy5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgcGVuLm9wdC5lcmFzZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHMuZ2V0UG9pbnRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuLnByb2MocC54LCBwLnksIHByZXBvaW50LCBwYXBlcik7XG4gICAgICAgICAgICAgICAgICAgIHByZXBvaW50ID0gcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBcdTUzRDZcdTMwNjNcdTMwNjZcdTMwNEFcdTMwNDRcdTMwNUZjYW52YXNcdTMwNjhcdTkxQ0RcdTMwNkRcdTU0MDhcdTMwOEZcdTMwNUJcbiAgICAgICAgICAgIHBhcGVyLmdldEN0eCgpLmRyYXdJbWFnZShia2ltZywgMCwgMCwgYmtpbWcud2lkdGgsIGJraW1nLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmlyc3QpIHtcbiAgICAgICAgICAgIHBhcGVyLmdldENudigpLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgIHRoaXMuZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgdG9JbWFnZShjbnY6IEhUTUxDYW52YXNFbGVtZW50KTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbWFnZTogSFRNTEltYWdlRWxlbWVudCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgY29uc3QgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjbnYuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZShpbWFnZSk7XG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gKGUpID0+IHJlamVjdChlKTtcbiAgICAgICAgICAgIGltYWdlLnNyYyA9IGN0eC5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsICJleHBvcnQgY2xhc3MgRHJhd2NhbnZhc2VzRWxlbWVudCB7XG4gICAgcHJpdmF0ZSB3cmFwZGl2OiBIVE1MRGl2RWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLndyYXBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RyYXdjYW52YXNlc1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZWxlbWVudCgpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXBkaXY7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE5vcm1hbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGRkZGRjAwXCI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFNjcm9sbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwRkYwMDc3XCI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldEV4cGFuZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwZGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI0ZGMDAwMDc3XCI7XG4gICAgfVxufSIsICJpbXBvcnQgeyBUb29sLCBEcmF3RXZlbnQgfSBmcm9tIFwiLi4vdS90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgRHJhd1N0YXR1cyB7XG4gICAgcHJpdmF0ZSBldmVudDogRHJhd0V2ZW50O1xuICAgIHByaXZhdGUgdG9vbDogVG9vbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVuZFN0cm9rZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbmRTdHJva2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBcInVwXCI7XG4gICAgICAgIHRoaXMudG9vbCA9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0U3Ryb2tlKCk6IHZvaWQge1xuICAgICAgICAvLyBcdTY0Q0RcdTRGNUNcdTk1OEJcdTU5Q0JcbiAgICAgICAgdGhpcy5ldmVudCA9IFwiZG93blwiO1xuICAgICAgICB0aGlzLnRvb2wgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUb29sKHRvb2wpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b29sID0gdG9vbDtcbiAgICB9XG4gICAgcHVibGljIGdldFRvb2woKTogVG9vbCB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvb2w7XG4gICAgfVxuXG4gICAgcHVibGljIGlzRW5kU3Ryb2tlKG5vdzogRHJhd0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBub3cgPT09IFwidXBcIiAmJiB0aGlzLmV2ZW50ICE9PSBcInVwXCI7XG4gICAgfVxuICAgIHB1YmxpYyBpc1N0YXJ0U3Ryb2tlKG5vdzogRHJhd0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBub3cgPT09IFwiZG93blwiO1xuICAgIH1cbiAgICBwdWJsaWMgaXNTdGFydE1vdmUobm93OiBEcmF3RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgLy8gXHUzMEM0XHUzMEZDXHUzMEVCXHUzMDRDXHU2NzJBXHU2QzdBXHU1QjlBXG4gICAgICAgIHJldHVybiB0aGlzLmlzTW92ZShub3cpICYmIHRoaXMudG9vbCA9PT0gbnVsbDtcbiAgICB9XG4gICAgcHVibGljIGlzTW92ZShub3c6IERyYXdFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbm93ID09PSBcIm1vdmVcIiAmJiB0aGlzLmV2ZW50ID09PSBcImRvd25cIjtcbiAgICB9XG59IiwgImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL2RhdGEvRHJhd1wiO1xuaW1wb3J0IHsgVG9vbCB9IGZyb20gXCIuLi91L3R5cGVzXCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvRHJhd2NhbnZhc2VzRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbVNjcm9sbEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vWm9vbVNjcm9sbEFjdGlvblwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBMb25ncHJlc3NTdGF0dXMge1xuICAgIHByaXZhdGUgdGltZTogbnVtYmVyO1xuICAgIHByaXZhdGUgdGltZW91dGlkczogbnVtYmVyW10gPSBbXTsgLy8gXHU5MTREXHU1MjE3XHUzMDYwXHUzMDUxXHUzMDZGXHU1MjFEXHU2NzFGXHU1MzE2XG4gICAgcHJpdmF0ZSBwb3M6IFBvaW50O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgU0VDX1NDUk9MTDogbnVtYmVyID0gMC4yICogMTAwMDtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTRUNfRVhQQU5EOiBudW1iZXIgPSAxLjAgKiAxMDAwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyKCkge1xuICAgICAgICAvLyBcdTZCMjFcdTU2REVcdTMwNkJcdTU0MTFcdTMwNTFcdTMwNjZcdTUyMURcdTY3MUZcdTUzMTZcbiAgICAgICAgdGhpcy50aW1lID0gMDtcbiAgICAgICAgdGhpcy5wb3MgPSBudWxsO1xuICAgICAgICAvLyBcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNENcdTZDN0FcdTVCOUFcdTMwNTdcdTMwNUZcdTMwNkVcdTMwNjd0aW1lb3V0XHU1NDY4XHUzMDhBXHUzMDkyXHUzMEFGXHUzMEVBXHUzMEEyXG4gICAgICAgIGxldCB0aWQgPSBudWxsO1xuICAgICAgICB3aGlsZSAodGlkID0gdGhpcy50aW1lb3V0aWRzLnBvcCgpKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZW5kKCk6IFRvb2wge1xuICAgICAgICBpZih0aGlzLmlzU3RhcnQoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIFx1MzBCOVx1MzBCRlx1MzBGQ1x1MzBDOFx1MzA1N1x1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVS5wZChcImVuZCBwcmVzcyEhIVwiKTtcblxuICAgICAgICAvLyBcdTMwRTJcdTMwRkNcdTMwQzlcdTMwNkVcdTUyMjRcdTVCOUFcbiAgICAgICAgY29uc3Qgbm93OiBudW1iZXIgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBkaWZmOiBudW1iZXIgPSBub3cgLSB0aGlzLnRpbWU7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgaWYgKGRpZmYgPCBMb25ncHJlc3NTdGF0dXMuU0VDX1NDUk9MTCkge1xuICAgICAgICAgICAgLy8gXHU1MzU4XHU2MkJDXHUzMDU3XHU3OUZCXHU1MkQ1XHVGRjFEXHU4QTE4XHU4RkYwXG4gICAgICAgICAgICByZXR1cm4gXCJwZW5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChkaWZmIDwgTG9uZ3ByZXNzU3RhdHVzLlNFQ19FWFBBTkQpIHtcbiAgICAgICAgICAgIC8vIFx1OTU3N1x1NjJCQ1x1MzA1N1x1NzlGQlx1NTJENVx1RkYxRFx1NzUzQlx1OTc2Mlx1MzBCOVx1MzBBRlx1MzBFRFx1MzBGQ1x1MzBFQlxuICAgICAgICAgICAgcmV0dXJuIFwic2Nyb2xsXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlmZiA+PSBMb25ncHJlc3NTdGF0dXMuU0VDX0VYUEFORCkge1xuICAgICAgICAgICAgLy8gXHUzMDU1XHUzMDg5XHUzMDZCXHU5NTc3XHU2MkJDXHUzMDU3XHVGRjFEXHU2MkUxXHU1OTI3XHU3RTJFXHU1QzBGXG4gICAgICAgICAgICByZXR1cm4gXCJ6b29tXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBcdTMwQzdcdTMwRDVcdTMwQTlcdTMwRUJcdTMwQzhcdTMwNkZudWxsXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydCh3cmFwZGl2OiBEcmF3Y2FudmFzZXNFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmlzU3RhcnQoKSkge1xuICAgICAgICAgICAgLy8gXHU2NUUyXHUzMDZCXHU5NThCXHU1OUNCXHUzMDU3XHUzMDY2XHUzMDQ0XHUzMDhCXHUzMDZFXHUzMDY3XHU0RjU1XHUzMDgyXHUzMDU3XHUzMDZBXHUzMDQ0XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVS5wZChcInN0YXJ0IHByZXNzLi4uXCIpO1xuICAgICAgICAvLyBcdTk1NzdcdTYyQkNcdTMwNTdcdTMwNkVcdTRGNERcdTdGNkVcdTc4QkFcdThBOERcbiAgICAgICAgdGhpcy50aW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICB0aGlzLnBvcyA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgem9vbXNjcm9sbC5zZXRQb2ludCh4LCB5KTtcblxuICAgICAgICAvLyBcdTgyNzJcdTMwOTJcdTU5MDlcdTY2RjRcbiAgICAgICAgdGhpcy50aW1lb3V0aWRzLnB1c2god2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gXHUzMEFEXHUzMEUzXHUzMEYzXHUzMEQwXHUzMEI5XHUzMDZFXHU4MjcyXHUzMDkyXHU1OTA5XHU2NkY0XG4gICAgICAgICAgICB3cmFwZGl2LnNldFNjcm9sbCgpO1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0aWRzLnB1c2god2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFx1MzBBRFx1MzBFM1x1MzBGM1x1MzBEMFx1MzBCOVx1MzA2RVx1ODI3Mlx1MzA5Mlx1NTkwOVx1NjZGNFxuICAgICAgICAgICAgICAgIHdyYXBkaXYuc2V0RXhwYW5kKCk7XG4gICAgICAgICAgICB9LCBMb25ncHJlc3NTdGF0dXMuU0VDX0VYUEFORCkpO1xuICAgICAgICB9LCBMb25ncHJlc3NTdGF0dXMuU0VDX1NDUk9MTCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1NhbWVQb2ludCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICBpZih0aGlzLnBvcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gXHU1MjREXHUzMDZFXHU3MEI5XHUzMDRDXHUzMDZBXHUzMDQ0XHUzMDZFXHUzMDY3XHU1NDBDXHUzMDU4XHUzMDY3XHUzMDZGXHUzMDZBXHUzMDQ0XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5wb3MuaXNTYW1lKHgsIHkpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1N0YXJ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aW1lb3V0aWRzLmxlbmd0aCA+IDA7XG4gICAgfVxufSIsICJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuLi9lbGVtZW50L1BhcGVyRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBQZW5BY3Rpb24ge1xuICAgIHB1YmxpYyByZWFkb25seSBvcHQgPSB7XG4gICAgICAgIGNvbG9yOiA8c3RyaW5nPlwiXCIsXG4gICAgICAgIGVyYXNlcjogPGJvb2xlYW4+ZmFsc2UsXG4gICAgfVxuICAgIHByaXZhdGUgb3B0Yms6IGFueTtcblxuICAgIHB1YmxpYyBpbml0KGNvbG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vcHQuZXJhc2VyID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3B0LmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMub3B0YmsgPSBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmVwOiBQb2ludCwgcGFwZXI6IFBhcGVyRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBsZXQgcHJlID0gcHJlcDtcbiAgICAgICAgaWYgKHByZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBcdTUyNERcdTU2REVcdTMwNkVcdTcwQjlcdTMwNENcdTMwNkFcdTMwNTFcdTMwOENcdTMwNzBcdTRFQ0FcdTU2REVcdTMwNkVcdTcwQjlcbiAgICAgICAgICAgIHByZSA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdHggPSBwYXBlci5nZXRDdHgoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHQuZXJhc2VyKSB7XG4gICAgICAgICAgICB0aGlzLmVyYXNlKHgsIHksIHByZSwgY3R4KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZW4oeCwgeSwgcHJlLCBjdHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcGVuKHg6IG51bWJlciwgeTogbnVtYmVyLCBwcmU6IFBvaW50LCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLm9wdC5jb2xvcjtcbiAgICAgICAgY3R4Lm1vdmVUbyhwcmUueCwgcHJlLnkpO1xuICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICAgIHByaXZhdGUgZXJhc2UoeDogbnVtYmVyLCB5OiBudW1iZXIsIHByZTogUG9pbnQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIC8vIFx1NzlGQlx1NTJENVx1OERERFx1OTZFMlx1MzA2N1x1NkQ4OFx1MzA1OVx1N0JDNFx1NTZGMlx1MzA5Mlx1OEFCRlx1NjU3NFxuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoeCAtIHByZS54KSArIE1hdGguYWJzKHkgLSBwcmUueSk7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoeCAtIGQsIHkgLSBkLCBkICogMiwgZCAqIDIpO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlT3B0KCkge1xuICAgICAgICB0aGlzLm9wdGJrID0gd2luZG93Ll8uY2xvbmVEZWVwKHRoaXMub3B0KTtcbiAgICAgICAgVS5wZCh0aGlzLm9wdGJrKTtcbiAgICB9XG4gICAgcHVibGljIHJlc3RvcmVPcHQoKSB7XG4gICAgICAgIGZvcihjb25zdCBbaWR4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMub3B0YmspKSB7XG4gICAgICAgICAgICB0aGlzLm9wdFtpZHhdID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50LCBTdHJva2UgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuLi9kYXRhL0RyYXdNaW5lXCI7XG5pbXBvcnQgeyBQYXBlckVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9QYXBlckVsZW1lbnRcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmRvRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgZHJhdzogRHJhd01pbmU7XG4gICAgcHJpdmF0ZSBwYXBlcjogUGFwZXJFbGVtZW50O1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb247XG4gICAgcHVibGljIGluaXQocGFwZXI6IFBhcGVyRWxlbWVudCwgZHJhdzogRHJhd01pbmUsIHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBwYXBlcjtcbiAgICAgICAgdGhpcy5kcmF3ID0gZHJhdztcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhY3QtdW5kb1wiKTtcblxuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cbiAgICBwcml2YXRlIHByb2MoKTogdm9pZCB7XG4gICAgICAgIC8vIFx1NjcwMFx1NjVCMFx1MzA2RXN0cm9rZVx1MzA5Mlx1NzgzNFx1NjhDNFx1MzA1N1x1MzA2Nlx1MzAwMVx1MzA1RFx1MzA2RVx1NTE4NVx1NUJCOVx1MzA5Mlx1NTNENlx1NUY5N1xuICAgICAgICBjb25zdCBzdHJva2VzOiBTdHJva2VbXSA9IHRoaXMuZHJhdy51bmRvKCk7XG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1OEExOFx1OEZGMFx1MzA5Mlx1MzBBRlx1MzBFQVx1MzBBMlx1MzAwMVx1OEEyRFx1NUI5QVx1MzA5Mlx1NEZERFx1NUI1OFxuICAgICAgICB0aGlzLnBhcGVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucGVuLnNhdmVPcHQoKTtcblxuICAgICAgICAvLyBcdTY1MzlcdTMwODFcdTMwNjZcdTYzQ0ZcdTc1M0JcbiAgICAgICAgbGV0IHByZXBvaW50OiBQb2ludCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdHJva2VzKSB7XG4gICAgICAgICAgICBpZiAocy5pc0VyYXNlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmNvbG9yID0gcy5jb2xvcjsgLy8gXHU4MjcyXHU2MEM1XHU1ODMxXHUzMDZGXHU0RjdGXHUzMDhGXHUzMDZBXHUzMDQ0XHUzMDRDXHU1RkY1XHUzMDZFXHU3MEJBXHU4QTJEXHU1QjlBXG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IHMuY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW4ub3B0LmVyYXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHMuZ2V0UG9pbnRzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbi5wcm9jKHAueCwgcC55LCBwcmVwb2ludCwgdGhpcy5wYXBlcik7XG4gICAgICAgICAgICAgICAgcHJlcG9pbnQgPSBwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJlcG9pbnQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHU4QTJEXHU1QjlBXHUzMDkyXHU1RkE5XHU1RTMwXG4gICAgICAgIHRoaXMucGVuLnJlc3RvcmVPcHQoKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vZGF0YS9EcmF3XCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4uL2VsZW1lbnQvRHJhd2NhbnZhc2VzRWxlbWVudFwiO1xuaW1wb3J0IHsgWm9vbUVsZW1lbnQgfSBmcm9tIFwiLi4vZWxlbWVudC9ab29tRWxlbWVudFwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cbmV4cG9ydCBjbGFzcyBab29tU2Nyb2xsQWN0aW9uIHtcbiAgICBwcml2YXRlIHdyYXBkaXY6IERyYXdjYW52YXNlc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tRWxlbWVudDtcbiAgICBwcml2YXRlIHByZXA6IFBvaW50ID0gbnVsbDtcbiAgICBwcml2YXRlIG5vd3pvb206IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSBvcmd3OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgb3JnaDogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgWk9PTV9NQVg6IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSByZWFkb25seSBaT09NX01JTjogbnVtYmVyID0gMC41O1xuXG4gICAgcHVibGljIGluaXQod3JhcGRpdjogRHJhd2NhbnZhc2VzRWxlbWVudCwgem9vbXNjcm9sbDogWm9vbUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy53cmFwZGl2ID0gd3JhcGRpdjtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsID0gem9vbXNjcm9sbDtcbiAgICAgICAgdGhpcy5ub3d6b29tID0gMTtcbiAgICAgICAgdGhpcy56b29tc2Nyb2xsLnNob3codGhpcy5ub3d6b29tKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICAgICAgICB0aGlzLm9yZ3cgPSBwYXJzZUludChlbGUuc3R5bGUud2lkdGgucmVwbGFjZShcInB4XCIsXCJcIikpO1xuICAgICAgICB0aGlzLm9yZ2ggPSBwYXJzZUludChlbGUuc3R5bGUuaGVpZ2h0LnJlcGxhY2UoXCJweFwiLFwiXCIpKTtcbiAgICB9XG4gICAgcHVibGljIHNldFBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucHJlcCA9IG5ldyBQb2ludCh4LCB5KTtcbiAgICB9XG4gICAgcHVibGljIHNjcm9sbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZih0aGlzLmlnbm9yZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gXHU1REVFXHU1MjA2XHUzMDZFXHU4QTA4XHU3Qjk3XG4gICAgICAgIGNvbnN0IGR4ID0gICh0aGlzLnByZXAueCAtIHgpICogdGhpcy5ub3d6b29tICogNztcbiAgICAgICAgY29uc3QgZHkgPSAodGhpcy5wcmVwLnkgLSB5KSAqIHRoaXMubm93em9vbSAqIDc7XG5cbiAgICAgICAgLy8gXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXHU1QjlGXHU4ODRDXG4gICAgICAgIGNvbnN0IG54ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICBjb25zdCBueSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgd2luZG93LnNjcm9sbCh7XG4gICAgICAgICAgICBsZWZ0OiBueCArIGR4LFxuICAgICAgICAgICAgdG9wOiBueSArIGR5LFxuICAgICAgICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVS5wZChgc2Nyb2xsIDogJHt0aGlzLnByZXAueH0tJHt4fT0ke2R4fSwgJHt0aGlzLnByZXAueX0tJHt5fT0ke2R5fWApO1xuXG4gICAgICAgIC8vIFx1MzBERFx1MzBBNFx1MzBGM1x1MzBDOFx1MzA2RVx1NjZGNFx1NjVCMFxuICAgICAgICB0aGlzLnByZXAueCA9IHg7XG4gICAgICAgIHRoaXMucHJlcC55ID0geTtcbiAgICB9XG4gICAgcHVibGljIHpvb21kcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGR5ID0gdGhpcy5wcmVwLnkgLSB5O1xuICAgICAgICAvLyBcdTc5RkJcdTUyRDVcdTVERUVcdTUyMDZcdTMwOTJ6b29tXHU2QkQ0XHU3Mzg3XHUzMDZCXHU1OTA5XHU2M0RCXHUzMDAyXHU3M0ZFXHU1NzI4XHUzMDZFXHU2QkQ0XHU3Mzg3XHUzMDZCXHUzMDg4XHUzMDYzXHUzMDY2XHU1REVFXHU1MjA2XHU5MUNGXHUzMDkyXHU4QUJGXHU2NTc0XHVGRjA4XHU1OTI3XHUzMDREXHUzMDQ0XHUzMDY4XHU1OTI3XHUzMDREXHUzMDQ0XHVGRjA5XG4gICAgICAgIGNvbnN0IGRpZmYgPSBkeSAqIDAuMDAwNSAqIHRoaXMubm93em9vbTtcbiAgICAgICAgdGhpcy56b29tcHJvYyhkaWZmKTtcbiAgICAgICAgLy8gXHUzMEREXHUzMEE0XHUzMEYzXHUzMEM4XHUzMDZFXHU2NkY0XHU2NUIwXG4gICAgICAgIHRoaXMucHJlcC54ID0geDtcbiAgICAgICAgdGhpcy5wcmVwLnkgPSB5O1xuICAgIH1cbiAgICBwdWJsaWMgem9vbXByb2MoZGlmZjogbnVtYmVyKTp2b2lkIHtcbiAgICAgICAgdGhpcy5ub3d6b29tICs9IGRpZmY7XG4gICAgICAgIC8vIFx1N0JDNFx1NTZGMlx1ODhEQ1x1NkI2M1xuICAgICAgICB0aGlzLm5vd3pvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0aGlzLm5vd3pvb20sIHRoaXMuWk9PTV9NSU4pLCB0aGlzLlpPT01fTUFYKTtcbiAgICAgICAgY29uc3QgZWxlOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICAgICAgICBlbGUuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7dGhpcy5ub3d6b29tfSlgO1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwuc2hvdyh0aGlzLm5vd3pvb20pO1xuICAgICAgICBlbGUuc3R5bGUud2lkdGggPWAke3RoaXMub3JndyAqIHRoaXMubm93em9vbX1weGA7XG4gICAgICAgIGVsZS5zdHlsZS5oZWlnaHQgPWAke3RoaXMub3JnaCAqIHRoaXMubm93em9vbX1weGA7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRab29tKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vd3pvb207XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmV0aW1lOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgaWdub3JlKCkge1xuICAgICAgICBjb25zdCBuOm51bWJlciA9IERhdGUubm93KCk7XG4gICAgICAgIGxldCByZXQgPSB0cnVlO1xuICAgICAgICBpZihuIC0gdGhpcy5wcmV0aW1lID4gMC4wMSAqIDEwMDApIHtcbiAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcmV0aW1lID0gbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBUb3VjaFNlbnNvciB9IGZyb20gXCIuLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFpvb21TY3JvbGxBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL1pvb21TY3JvbGxBY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIFpvb21FbGVtZW50IHtcbiAgICBwcml2YXRlIGxibDogSFRNTFNwYW5FbGVtZW50O1xuICAgIHByaXZhdGUgYnRwOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICBwcml2YXRlIGJ0bTogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB6b29tc2Nyb2xsOiBab29tU2Nyb2xsQWN0aW9uO1xuXG4gICAgcHVibGljIGluaXQoem9vbXNjcm9sbDogWm9vbVNjcm9sbEFjdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLnpvb21zY3JvbGwgPSB6b29tc2Nyb2xsO1xuICAgICAgICB0aGlzLmxibCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjem9vbS1sYWJlbFwiKTtcbiAgICAgICAgdGhpcy5idHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3pvb20tcGx1c1wiKTtcbiAgICAgICAgdGhpcy5idG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3pvb20tbWludXNcIik7XG5cbiAgICAgICAgdGhpcy5idHAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuem9vbXNjcm9sbC56b29tcHJvYygwLjEpKTtcbiAgICAgICAgdGhpcy5idHAuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKDAuMSkpO1xuICAgICAgICB0aGlzLmJ0bS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKC0wLjEpKTtcbiAgICAgICAgdGhpcy5idG0uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKCkgPT4gdGhpcy56b29tc2Nyb2xsLnpvb21wcm9jKC0wLjEpKTtcbiAgICB9XG4gICAgcHVibGljIGxhYmVsKCk6IEhUTUxTcGFuRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmxibDtcbiAgICB9XG4gICAgcHVibGljIHNob3cobm93em9vbTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGJsLmlubmVySFRNTCA9IGAke01hdGgucm91bmQobm93em9vbSAqIDEwMCkudG9TdHJpbmcoKX0lYDtcbiAgICB9XG59IiwgImltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBFcmFzZXJFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwZW46IFBlbkFjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWN0LWVyYXNlclwiKTtcbiAgICAgICAgdGhpcy5lbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnByb2MoKSk7XG4gICAgICAgIHRoaXMuZWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KHBlbjogUGVuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGVuID0gcGVuO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jKCkge1xuICAgICAgICB0aGlzLnBlbi5vcHQuZXJhc2VyID0gIXRoaXMucGVuLm9wdC5lcmFzZXI7XG4gICAgICAgIGNvbnN0IGVuYWJsZSA9IFwiaGFzLWJhY2tncm91bmQtcHJpbWFyeVwiO1xuICAgICAgICBjb25zdCBkaXNhYmxlID0gXCJoYXMtYmFja2dyb3VuZC1saWdodFwiO1xuICAgICAgICAvLyBcdTg4NjhcdTc5M0FcdTMwOTJcdTY2RjRcdTY1QjBcbiAgICAgICAgaWYgKHRoaXMucGVuLm9wdC5lcmFzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlLmNsYXNzTGlzdC5yZXBsYWNlKGRpc2FibGUsIGVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZS5jbGFzc0xpc3QucmVwbGFjZShlbmFibGUsIGRpc2FibGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgIi8qIVxuICogYS1jb2xvci1waWNrZXIgKGh0dHBzOi8vZ2l0aHViLmNvbS9uYXJzZW5pY28vYS1jb2xvci1waWNrZXIpXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAxNy0yMDE4LCBHaWFuZnJhbmNvIENhbGRpLlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG4hZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShcIkFDb2xvclBpY2tlclwiLFtdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuQUNvbG9yUGlja2VyPXQoKTplLkFDb2xvclBpY2tlcj10KCl9KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgdD17fTtmdW5jdGlvbiByKGkpe2lmKHRbaV0pcmV0dXJuIHRbaV0uZXhwb3J0czt2YXIgbz10W2ldPXtpOmksbDohMSxleHBvcnRzOnt9fTtyZXR1cm4gZVtpXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxyKSxvLmw9ITAsby5leHBvcnRzfXJldHVybiByLm09ZSxyLmM9dCxyLmQ9ZnVuY3Rpb24oZSx0LGkpe3IubyhlLHQpfHxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDppfSl9LHIucj1mdW5jdGlvbihlKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSxyLnQ9ZnVuY3Rpb24oZSx0KXtpZigxJnQmJihlPXIoZSkpLDgmdClyZXR1cm4gZTtpZig0JnQmJlwib2JqZWN0XCI9PXR5cGVvZiBlJiZlJiZlLl9fZXNNb2R1bGUpcmV0dXJuIGU7dmFyIGk9T2JqZWN0LmNyZWF0ZShudWxsKTtpZihyLnIoaSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGksXCJkZWZhdWx0XCIse2VudW1lcmFibGU6ITAsdmFsdWU6ZX0pLDImdCYmXCJzdHJpbmdcIiE9dHlwZW9mIGUpZm9yKHZhciBvIGluIGUpci5kKGksbyxmdW5jdGlvbih0KXtyZXR1cm4gZVt0XX0uYmluZChudWxsLG8pKTtyZXR1cm4gaX0sci5uPWZ1bmN0aW9uKGUpe3ZhciB0PWUmJmUuX19lc01vZHVsZT9mdW5jdGlvbigpe3JldHVybiBlLmRlZmF1bHR9OmZ1bmN0aW9uKCl7cmV0dXJuIGV9O3JldHVybiByLmQodCxcImFcIix0KSx0fSxyLm89ZnVuY3Rpb24oZSx0KXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsdCl9LHIucD1cIlwiLHIoci5zPTEpfShbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO1xuLyohXG4gKiBpcy1wbGFpbi1vYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLXBsYWluLW9iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi92YXIgaT1yKDMpO2Z1bmN0aW9uIG8oZSl7cmV0dXJuITA9PT1pKGUpJiZcIltvYmplY3QgT2JqZWN0XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpfWUuZXhwb3J0cz1mdW5jdGlvbihlKXt2YXIgdCxyO3JldHVybiExIT09byhlKSYmXCJmdW5jdGlvblwiPT10eXBlb2YodD1lLmNvbnN0cnVjdG9yKSYmITEhPT1vKHI9dC5wcm90b3R5cGUpJiYhMSE9PXIuaGFzT3duUHJvcGVydHkoXCJpc1Byb3RvdHlwZU9mXCIpfX0sZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHQuVkVSU0lPTj10LlBBTEVUVEVfTUFURVJJQUxfQ0hST01FPXQuUEFMRVRURV9NQVRFUklBTF81MDA9dC5DT0xPUl9OQU1FUz10LmdldEx1bWluYW5jZT10LmludFRvUmdiPXQucmdiVG9JbnQ9dC5yZ2JUb0hzdj10LnJnYlRvSHNsPXQuaHNsVG9SZ2I9dC5yZ2JUb0hleD10LnBhcnNlQ29sb3I9dC5wYXJzZUNvbG9yVG9Ic2xhPXQucGFyc2VDb2xvclRvSHNsPXQucGFyc2VDb2xvclRvUmdiYT10LnBhcnNlQ29sb3JUb1JnYj10LmZyb209dC5jcmVhdGVQaWNrZXI9dm9pZCAwO3ZhciBpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe2Zvcih2YXIgcj0wO3I8dC5sZW5ndGg7cisrKXt2YXIgaT10W3JdO2kuZW51bWVyYWJsZT1pLmVudW1lcmFibGV8fCExLGkuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIGkmJihpLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxpLmtleSxpKX19cmV0dXJuIGZ1bmN0aW9uKHQscixpKXtyZXR1cm4gciYmZSh0LnByb3RvdHlwZSxyKSxpJiZlKHQsaSksdH19KCksbz1mdW5jdGlvbihlLHQpe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuIGU7aWYoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChlKSlyZXR1cm4gZnVuY3Rpb24oZSx0KXt2YXIgcj1bXSxpPSEwLG89ITEsbj12b2lkIDA7dHJ5e2Zvcih2YXIgcyxhPWVbU3ltYm9sLml0ZXJhdG9yXSgpOyEoaT0ocz1hLm5leHQoKSkuZG9uZSkmJihyLnB1c2gocy52YWx1ZSksIXR8fHIubGVuZ3RoIT09dCk7aT0hMCk7fWNhdGNoKGUpe289ITAsbj1lfWZpbmFsbHl7dHJ5eyFpJiZhLnJldHVybiYmYS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgbn19cmV0dXJuIHJ9KGUsdCk7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9LG49cigyKSxzPWwocigwKSksYT1sKHIoNCkpO2Z1bmN0aW9uIGwoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fWZ1bmN0aW9uIGMoZSx0KXtpZighKGUgaW5zdGFuY2VvZiB0KSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIHUoZSl7aWYoQXJyYXkuaXNBcnJheShlKSl7Zm9yKHZhciB0PTAscj1BcnJheShlLmxlbmd0aCk7dDxlLmxlbmd0aDt0Kyspclt0XT1lW3RdO3JldHVybiByfXJldHVybiBBcnJheS5mcm9tKGUpfVxuLyohXG4gKiBhLWNvbG9yLXBpY2tlclxuICogaHR0cHM6Ly9naXRodWIuY29tL25hcnNlbmljby9hLWNvbG9yLXBpY2tlclxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNy0yMDE5LCBHaWFuZnJhbmNvIENhbGRpLlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovdmFyIGg9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkVkZ2VcIik+LTEscD1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpPi0xLGQ9e2lkOm51bGwsYXR0YWNoVG86XCJib2R5XCIsc2hvd0hTTDohMCxzaG93UkdCOiEwLHNob3dIRVg6ITAsc2hvd0FscGhhOiExLGNvbG9yOlwiI2ZmMDAwMFwiLHBhbGV0dGU6bnVsbCxwYWxldHRlRWRpdGFibGU6ITEsdXNlQWxwaGFJblBhbGV0dGU6XCJhdXRvXCIsc2xCYXJTaXplOlsyMzIsMTUwXSxodWVCYXJTaXplOlsxNTAsMTFdLGFscGhhQmFyU2l6ZTpbMTUwLDExXX0sZj1cIkNPTE9SXCIsZz1cIlJHQkFfVVNFUlwiLGI9XCJIU0xBX1VTRVJcIjtmdW5jdGlvbiB2KGUsdCxyKXtyZXR1cm4gZT9lIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ/ZTplIGluc3RhbmNlb2YgTm9kZUxpc3Q/ZVswXTpcInN0cmluZ1wiPT10eXBlb2YgZT9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGUpOmUuanF1ZXJ5P2UuZ2V0KDApOnI/dDpudWxsOnR9ZnVuY3Rpb24gbShlKXt2YXIgdD1lLmdldENvbnRleHQoXCIyZFwiKSxyPStlLndpZHRoLGk9K2UuaGVpZ2h0LHM9dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgxLDEsMSxpLTEpO3JldHVybiBzLmFkZENvbG9yU3RvcCgwLFwid2hpdGVcIikscy5hZGRDb2xvclN0b3AoMSxcImJsYWNrXCIpLHtzZXRIdWU6ZnVuY3Rpb24oZSl7dmFyIG89dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgxLDAsci0xLDApO28uYWRkQ29sb3JTdG9wKDAsXCJoc2xhKFwiK2UrXCIsIDEwMCUsIDUwJSwgMClcIiksby5hZGRDb2xvclN0b3AoMSxcImhzbGEoXCIrZStcIiwgMTAwJSwgNTAlLCAxKVwiKSx0LmZpbGxTdHlsZT1zLHQuZmlsbFJlY3QoMCwwLHIsaSksdC5maWxsU3R5bGU9byx0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cIm11bHRpcGx5XCIsdC5maWxsUmVjdCgwLDAscixpKSx0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbj1cInNvdXJjZS1vdmVyXCJ9LGdyYWJDb2xvcjpmdW5jdGlvbihlLHIpe3JldHVybiB0LmdldEltYWdlRGF0YShlLHIsMSwxKS5kYXRhfSxmaW5kQ29sb3I6ZnVuY3Rpb24oZSx0LHMpe3ZhciBhPSgwLG4ucmdiVG9Ic3YpKGUsdCxzKSxsPW8oYSwzKSxjPWxbMV0sdT1sWzJdO3JldHVybltjKnIsaS11KmldfX19ZnVuY3Rpb24gQShlLHQscil7cmV0dXJuIG51bGw9PT1lP3Q6L15cXHMqJC8udGVzdChlKT9yOiEhL3RydWV8eWVzfDEvaS50ZXN0KGUpfHwhL2ZhbHNlfG5vfDAvaS50ZXN0KGUpJiZ0fWZ1bmN0aW9uIHkoZSx0LHIpe2lmKG51bGw9PT1lKXJldHVybiB0O2lmKC9eXFxzKiQvLnRlc3QoZSkpcmV0dXJuIHI7dmFyIGk9ZS5zcGxpdChcIixcIikubWFwKE51bWJlcik7cmV0dXJuIDI9PT1pLmxlbmd0aCYmaVswXSYmaVsxXT9pOnR9dmFyIGs9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQscil7aWYoYyh0aGlzLGUpLHI/KHQ9dih0KSx0aGlzLm9wdGlvbnM9T2JqZWN0LmFzc2lnbih7fSxkLHIpKTp0JiYoMCxzLmRlZmF1bHQpKHQpPyh0aGlzLm9wdGlvbnM9T2JqZWN0LmFzc2lnbih7fSxkLHQpLHQ9dih0aGlzLm9wdGlvbnMuYXR0YWNoVG8pKToodGhpcy5vcHRpb25zPU9iamVjdC5hc3NpZ24oe30sZCksdD12KCgwLG4ubnZsKSh0LHRoaXMub3B0aW9ucy5hdHRhY2hUbykpKSwhdCl0aHJvdyBuZXcgRXJyb3IoXCJDb250YWluZXIgbm90IGZvdW5kOiBcIit0aGlzLm9wdGlvbnMuYXR0YWNoVG8pOyFmdW5jdGlvbihlLHQpe3ZhciByPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdP2FyZ3VtZW50c1syXTpcImFjcC1cIjtpZih0Lmhhc0F0dHJpYnV0ZShyK1wic2hvdy1oc2xcIikmJihlLnNob3dIU0w9QSh0LmdldEF0dHJpYnV0ZShyK1wic2hvdy1oc2xcIiksZC5zaG93SFNMLCEwKSksdC5oYXNBdHRyaWJ1dGUocitcInNob3ctcmdiXCIpJiYoZS5zaG93UkdCPUEodC5nZXRBdHRyaWJ1dGUocitcInNob3ctcmdiXCIpLGQuc2hvd1JHQiwhMCkpLHQuaGFzQXR0cmlidXRlKHIrXCJzaG93LWhleFwiKSYmKGUuc2hvd0hFWD1BKHQuZ2V0QXR0cmlidXRlKHIrXCJzaG93LWhleFwiKSxkLnNob3dIRVgsITApKSx0Lmhhc0F0dHJpYnV0ZShyK1wic2hvdy1hbHBoYVwiKSYmKGUuc2hvd0FscGhhPUEodC5nZXRBdHRyaWJ1dGUocitcInNob3ctYWxwaGFcIiksZC5zaG93QWxwaGEsITApKSx0Lmhhc0F0dHJpYnV0ZShyK1wicGFsZXR0ZS1lZGl0YWJsZVwiKSYmKGUucGFsZXR0ZUVkaXRhYmxlPUEodC5nZXRBdHRyaWJ1dGUocitcInBhbGV0dGUtZWRpdGFibGVcIiksZC5wYWxldHRlRWRpdGFibGUsITApKSx0Lmhhc0F0dHJpYnV0ZShyK1wic2wtYmFyLXNpemVcIikmJihlLnNsQmFyU2l6ZT15KHQuZ2V0QXR0cmlidXRlKHIrXCJzbC1iYXItc2l6ZVwiKSxkLnNsQmFyU2l6ZSxbMjMyLDE1MF0pKSx0Lmhhc0F0dHJpYnV0ZShyK1wiaHVlLWJhci1zaXplXCIpJiYoZS5odWVCYXJTaXplPXkodC5nZXRBdHRyaWJ1dGUocitcImh1ZS1iYXItc2l6ZVwiKSxkLmh1ZUJhclNpemUsWzE1MCwxMV0pLGUuYWxwaGFCYXJTaXplPWUuaHVlQmFyU2l6ZSksdC5oYXNBdHRyaWJ1dGUocitcInBhbGV0dGVcIikpe3ZhciBpPXQuZ2V0QXR0cmlidXRlKHIrXCJwYWxldHRlXCIpO3N3aXRjaChpKXtjYXNlXCJQQUxFVFRFX01BVEVSSUFMXzUwMFwiOmUucGFsZXR0ZT1uLlBBTEVUVEVfTUFURVJJQUxfNTAwO2JyZWFrO2Nhc2VcIlBBTEVUVEVfTUFURVJJQUxfQ0hST01FXCI6Y2FzZVwiXCI6ZS5wYWxldHRlPW4uUEFMRVRURV9NQVRFUklBTF9DSFJPTUU7YnJlYWs7ZGVmYXVsdDplLnBhbGV0dGU9aS5zcGxpdCgvWzt8XS8pfX10Lmhhc0F0dHJpYnV0ZShyK1wiY29sb3JcIikmJihlLmNvbG9yPXQuZ2V0QXR0cmlidXRlKHIrXCJjb2xvclwiKSl9KHRoaXMub3B0aW9ucyx0KSx0aGlzLkg9MCx0aGlzLlM9MCx0aGlzLkw9MCx0aGlzLlI9MCx0aGlzLkc9MCx0aGlzLkI9MCx0aGlzLkE9MSx0aGlzLnBhbGV0dGU9e30sdGhpcy5lbGVtZW50PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5vcHRpb25zLmlkJiYodGhpcy5lbGVtZW50LmlkPXRoaXMub3B0aW9ucy5pZCksdGhpcy5lbGVtZW50LmNsYXNzTmFtZT1cImEtY29sb3ItcGlja2VyXCIsdGhpcy5lbGVtZW50LmlubmVySFRNTD1hLmRlZmF1bHQsdC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO3ZhciBpPXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLWhcIik7dGhpcy5zZXR1cEh1ZUNhbnZhcyhpKSx0aGlzLmh1ZUJhckhlbHBlcj1tKGkpLHRoaXMuaHVlUG9pbnRlcj10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1oKy5hLWNvbG9yLXBpY2tlci1kb3RcIik7dmFyIG89dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItc2xcIik7dGhpcy5zZXR1cFNsQ2FudmFzKG8pLHRoaXMuc2xCYXJIZWxwZXI9bShvKSx0aGlzLnNsUG9pbnRlcj10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1zbCsuYS1jb2xvci1waWNrZXItZG90XCIpLHRoaXMucHJldmlldz10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1wcmV2aWV3XCIpLHRoaXMuc2V0dXBDbGlwYm9hcmQodGhpcy5wcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItY2xpcGJhb3JkXCIpKSx0aGlzLm9wdGlvbnMuc2hvd0hTTD8odGhpcy5zZXR1cElucHV0KHRoaXMuaW5wdXRIPXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLWhzbD5pbnB1dFtuYW1lcmVmPUhdXCIpKSx0aGlzLnNldHVwSW5wdXQodGhpcy5pbnB1dFM9dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItaHNsPmlucHV0W25hbWVyZWY9U11cIikpLHRoaXMuc2V0dXBJbnB1dCh0aGlzLmlucHV0TD10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1oc2w+aW5wdXRbbmFtZXJlZj1MXVwiKSkpOnRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLWhzbFwiKS5yZW1vdmUoKSx0aGlzLm9wdGlvbnMuc2hvd1JHQj8odGhpcy5zZXR1cElucHV0KHRoaXMuaW5wdXRSPXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLXJnYj5pbnB1dFtuYW1lcmVmPVJdXCIpKSx0aGlzLnNldHVwSW5wdXQodGhpcy5pbnB1dEc9dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItcmdiPmlucHV0W25hbWVyZWY9R11cIikpLHRoaXMuc2V0dXBJbnB1dCh0aGlzLmlucHV0Qj10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1yZ2I+aW5wdXRbbmFtZXJlZj1CXVwiKSkpOnRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLXJnYlwiKS5yZW1vdmUoKSx0aGlzLm9wdGlvbnMuc2hvd0hFWD90aGlzLnNldHVwSW5wdXQodGhpcy5pbnB1dFJHQkhFWD10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWVyZWY9UkdCSEVYXVwiKSk6dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItcmdiaGV4XCIpLnJlbW92ZSgpLHRoaXMub3B0aW9ucy5wYWxldHRlRWRpdGFibGV8fHRoaXMub3B0aW9ucy5wYWxldHRlJiZ0aGlzLm9wdGlvbnMucGFsZXR0ZS5sZW5ndGg+MD90aGlzLnNldFBhbGV0dGUodGhpcy5wYWxldHRlUm93PXRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLXBhbGV0dGVcIikpOih0aGlzLnBhbGV0dGVSb3c9dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYS1jb2xvci1waWNrZXItcGFsZXR0ZVwiKSx0aGlzLnBhbGV0dGVSb3cucmVtb3ZlKCkpLHRoaXMub3B0aW9ucy5zaG93QWxwaGE/KHRoaXMuc2V0dXBBbHBoYUNhbnZhcyh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1hXCIpKSx0aGlzLmFscGhhUG9pbnRlcj10aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5hLWNvbG9yLXBpY2tlci1hKy5hLWNvbG9yLXBpY2tlci1kb3RcIikpOnRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmEtY29sb3ItcGlja2VyLWFscGhhXCIpLnJlbW92ZSgpLHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aD10aGlzLm9wdGlvbnMuc2xCYXJTaXplWzBdK1wicHhcIix0aGlzLm9uVmFsdWVDaGFuZ2VkKGYsdGhpcy5vcHRpb25zLmNvbG9yKX1yZXR1cm4gaShlLFt7a2V5Olwic2V0dXBIdWVDYW52YXNcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2Uud2lkdGg9dGhpcy5vcHRpb25zLmh1ZUJhclNpemVbMF0sZS5oZWlnaHQ9dGhpcy5vcHRpb25zLmh1ZUJhclNpemVbMV07Zm9yKHZhciByPWUuZ2V0Q29udGV4dChcIjJkXCIpLGk9ci5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsdGhpcy5vcHRpb25zLmh1ZUJhclNpemVbMF0sMCksbz0wO288PTE7bys9MS8zNjApaS5hZGRDb2xvclN0b3AobyxcImhzbChcIiszNjAqbytcIiwgMTAwJSwgNTAlKVwiKTtyLmZpbGxTdHlsZT1pLHIuZmlsbFJlY3QoMCwwLHRoaXMub3B0aW9ucy5odWVCYXJTaXplWzBdLHRoaXMub3B0aW9ucy5odWVCYXJTaXplWzFdKTt2YXIgcz1mdW5jdGlvbihyKXt2YXIgaT0oMCxuLmxpbWl0KShyLmNsaWVudFgtZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0LDAsdC5vcHRpb25zLmh1ZUJhclNpemVbMF0pLG89TWF0aC5yb3VuZCgzNjAqaS90Lm9wdGlvbnMuaHVlQmFyU2l6ZVswXSk7dC5odWVQb2ludGVyLnN0eWxlLmxlZnQ9aS03K1wicHhcIix0Lm9uVmFsdWVDaGFuZ2VkKFwiSFwiLG8pfSxhPWZ1bmN0aW9uIGUoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIscyksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixlKX07ZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oZSl7cyhlKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIscyksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixhKX0pfX0se2tleTpcInNldHVwU2xDYW52YXNcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2Uud2lkdGg9dGhpcy5vcHRpb25zLnNsQmFyU2l6ZVswXSxlLmhlaWdodD10aGlzLm9wdGlvbnMuc2xCYXJTaXplWzFdO3ZhciByPWZ1bmN0aW9uKHIpe3ZhciBpPSgwLG4ubGltaXQpKHIuY2xpZW50WC1lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQsMCx0Lm9wdGlvbnMuc2xCYXJTaXplWzBdLTEpLG89KDAsbi5saW1pdCkoci5jbGllbnRZLWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLDAsdC5vcHRpb25zLnNsQmFyU2l6ZVsxXS0xKSxzPXQuc2xCYXJIZWxwZXIuZ3JhYkNvbG9yKGksbyk7dC5zbFBvaW50ZXIuc3R5bGUubGVmdD1pLTcrXCJweFwiLHQuc2xQb2ludGVyLnN0eWxlLnRvcD1vLTcrXCJweFwiLHQub25WYWx1ZUNoYW5nZWQoXCJSR0JcIixzKX0saT1mdW5jdGlvbiBlKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHIpLGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZSl9O2UuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKGUpe3IoZSksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHIpLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsaSl9KX19LHtrZXk6XCJzZXR1cEFscGhhQ2FudmFzXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztlLndpZHRoPXRoaXMub3B0aW9ucy5hbHBoYUJhclNpemVbMF0sZS5oZWlnaHQ9dGhpcy5vcHRpb25zLmFscGhhQmFyU2l6ZVsxXTt2YXIgcj1lLmdldENvbnRleHQoXCIyZFwiKSxpPXIuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwwLGUud2lkdGgtMSwwKTtpLmFkZENvbG9yU3RvcCgwLFwiaHNsYSgwLCAwJSwgNTAlLCAwKVwiKSxpLmFkZENvbG9yU3RvcCgxLFwiaHNsYSgwLCAwJSwgNTAlLCAxKVwiKSxyLmZpbGxTdHlsZT1pLHIuZmlsbFJlY3QoMCwwLHRoaXMub3B0aW9ucy5hbHBoYUJhclNpemVbMF0sdGhpcy5vcHRpb25zLmFscGhhQmFyU2l6ZVsxXSk7dmFyIG89ZnVuY3Rpb24ocil7dmFyIGk9KDAsbi5saW1pdCkoci5jbGllbnRYLWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCwwLHQub3B0aW9ucy5hbHBoYUJhclNpemVbMF0pLG89KyhpL3Qub3B0aW9ucy5hbHBoYUJhclNpemVbMF0pLnRvRml4ZWQoMik7dC5hbHBoYVBvaW50ZXIuc3R5bGUubGVmdD1pLTcrXCJweFwiLHQub25WYWx1ZUNoYW5nZWQoXCJBTFBIQVwiLG8pfSxzPWZ1bmN0aW9uIGUoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsbyksZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixlKX07ZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oZSl7byhlKSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsbyksZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixzKX0pfX0se2tleTpcInNldHVwSW5wdXRcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLHI9K2UubWluLGk9K2UubWF4LG89ZS5nZXRBdHRyaWJ1dGUoXCJuYW1lcmVmXCIpO2UuaGFzQXR0cmlidXRlKFwic2VsZWN0LW9uLWZvY3VzXCIpJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLGZ1bmN0aW9uKCl7ZS5zZWxlY3QoKX0pLFwidGV4dFwiPT09ZS50eXBlP2UuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLGZ1bmN0aW9uKCl7dC5vblZhbHVlQ2hhbmdlZChvLGUudmFsdWUpfSk6KChofHxwKSYmZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLGZ1bmN0aW9uKHMpe1wiVXBcIj09PXMua2V5PyhlLnZhbHVlPSgwLG4ubGltaXQpKCtlLnZhbHVlKzEscixpKSx0Lm9uVmFsdWVDaGFuZ2VkKG8sZS52YWx1ZSkscy5yZXR1cm5WYWx1ZT0hMSk6XCJEb3duXCI9PT1zLmtleSYmKGUudmFsdWU9KDAsbi5saW1pdCkoK2UudmFsdWUtMSxyLGkpLHQub25WYWx1ZUNoYW5nZWQobyxlLnZhbHVlKSxzLnJldHVyblZhbHVlPSExKX0pLGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLGZ1bmN0aW9uKCl7dmFyIHM9K2UudmFsdWU7dC5vblZhbHVlQ2hhbmdlZChvLCgwLG4ubGltaXQpKHMscixpKSl9KSl9fSx7a2V5Olwic2V0dXBDbGlwYm9hcmRcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzO2UudGl0bGU9XCJjbGljayB0byBjb3B5XCIsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe2UudmFsdWU9KDAsbi5wYXJzZUNvbG9yKShbdC5SLHQuRyx0LkIsdC5BXSxcImhleGNzczRcIiksZS5zZWxlY3QoKSxkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIil9KX19LHtrZXk6XCJzZXRQYWxldHRlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxyPVwiYXV0b1wiPT09dGhpcy5vcHRpb25zLnVzZUFscGhhSW5QYWxldHRlP3RoaXMub3B0aW9ucy5zaG93QWxwaGE6dGhpcy5vcHRpb25zLnVzZUFscGhhSW5QYWxldHRlLGk9bnVsbDtzd2l0Y2godGhpcy5vcHRpb25zLnBhbGV0dGUpe2Nhc2VcIlBBTEVUVEVfTUFURVJJQUxfNTAwXCI6aT1uLlBBTEVUVEVfTUFURVJJQUxfNTAwO2JyZWFrO2Nhc2VcIlBBTEVUVEVfTUFURVJJQUxfQ0hST01FXCI6aT1uLlBBTEVUVEVfTUFURVJJQUxfQ0hST01FO2JyZWFrO2RlZmF1bHQ6aT0oMCxuLmVuc3VyZUFycmF5KSh0aGlzLm9wdGlvbnMucGFsZXR0ZSl9aWYodGhpcy5vcHRpb25zLnBhbGV0dGVFZGl0YWJsZXx8aS5sZW5ndGg+MCl7dmFyIG89ZnVuY3Rpb24ocixpLG8pe3ZhciBuPWUucXVlcnlTZWxlY3RvcignLmEtY29sb3ItcGlja2VyLXBhbGV0dGUtY29sb3JbZGF0YS1jb2xvcj1cIicrcisnXCJdJyl8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7bi5jbGFzc05hbWU9XCJhLWNvbG9yLXBpY2tlci1wYWxldHRlLWNvbG9yXCIsbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9cixuLnNldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIixyKSxuLnRpdGxlPXIsZS5pbnNlcnRCZWZvcmUobixpKSx0LnBhbGV0dGVbcl09ITAsbyYmdC5vblBhbGV0dGVDb2xvckFkZChyKX0scz1mdW5jdGlvbihyLGkpe3I/KGUucmVtb3ZlQ2hpbGQociksdC5wYWxldHRlW3IuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvclwiKV09ITEsaSYmdC5vblBhbGV0dGVDb2xvclJlbW92ZShyLmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIikpKTooZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmEtY29sb3ItcGlja2VyLXBhbGV0dGUtY29sb3JbZGF0YS1jb2xvcl1cIikuZm9yRWFjaChmdW5jdGlvbih0KXtlLnJlbW92ZUNoaWxkKHQpfSksT2JqZWN0LmtleXModC5wYWxldHRlKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3QucGFsZXR0ZVtlXT0hMX0pLGkmJnQub25QYWxldHRlQ29sb3JSZW1vdmUoKSl9O2lmKGkubWFwKGZ1bmN0aW9uKGUpe3JldHVybigwLG4ucGFyc2VDb2xvcikoZSxyP1wicmdiY3NzNFwiOlwiaGV4XCIpfSkuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiEhZX0pLmZvckVhY2goZnVuY3Rpb24oZSl7cmV0dXJuIG8oZSl9KSx0aGlzLm9wdGlvbnMucGFsZXR0ZUVkaXRhYmxlKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2EuY2xhc3NOYW1lPVwiYS1jb2xvci1waWNrZXItcGFsZXR0ZS1jb2xvciBhLWNvbG9yLXBpY2tlci1wYWxldHRlLWFkZFwiLGEuaW5uZXJIVE1MPVwiK1wiLGUuYXBwZW5kQ2hpbGQoYSksZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihlKXsvYS1jb2xvci1waWNrZXItcGFsZXR0ZS1hZGQvLnRlc3QoZS50YXJnZXQuY2xhc3NOYW1lKT9lLnNoaWZ0S2V5P3MobnVsbCwhMCk6byhyPygwLG4ucGFyc2VDb2xvcikoW3QuUix0LkcsdC5CLHQuQV0sXCJyZ2Jjc3M0XCIpOigwLG4ucmdiVG9IZXgpKHQuUix0LkcsdC5CKSxlLnRhcmdldCwhMCk6L2EtY29sb3ItcGlja2VyLXBhbGV0dGUtY29sb3IvLnRlc3QoZS50YXJnZXQuY2xhc3NOYW1lKSYmKGUuc2hpZnRLZXk/cyhlLnRhcmdldCwhMCk6dC5vblZhbHVlQ2hhbmdlZChmLGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIikpKX0pfWVsc2UgZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbihlKXsvYS1jb2xvci1waWNrZXItcGFsZXR0ZS1jb2xvci8udGVzdChlLnRhcmdldC5jbGFzc05hbWUpJiZ0Lm9uVmFsdWVDaGFuZ2VkKGYsZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb2xvclwiKSl9KX1lbHNlIGUuc3R5bGUuZGlzcGxheT1cIm5vbmVcIn19LHtrZXk6XCJ1cGRhdGVQYWxldHRlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5wYWxldHRlUm93LmlubmVySFRNTD1cIlwiLHRoaXMucGFsZXR0ZT17fSx0aGlzLnBhbGV0dGVSb3cucGFyZW50RWxlbWVudHx8dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucGFsZXR0ZVJvdyksdGhpcy5vcHRpb25zLnBhbGV0dGU9ZSx0aGlzLnNldFBhbGV0dGUodGhpcy5wYWxldHRlUm93KX19LHtrZXk6XCJvblZhbHVlQ2hhbmdlZFwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIHI9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOntzaWxlbnQ6ITF9O3N3aXRjaChlKXtjYXNlXCJIXCI6dGhpcy5IPXQ7dmFyIGk9KDAsbi5oc2xUb1JnYikodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHM9byhpLDMpO3RoaXMuUj1zWzBdLHRoaXMuRz1zWzFdLHRoaXMuQj1zWzJdLHRoaXMuc2xCYXJIZWxwZXIuc2V0SHVlKHQpLHRoaXMudXBkYXRlUG9pbnRlckgodGhpcy5IKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJTXCI6dGhpcy5TPXQ7dmFyIGE9KDAsbi5oc2xUb1JnYikodGhpcy5ILHRoaXMuUyx0aGlzLkwpLGw9byhhLDMpO3RoaXMuUj1sWzBdLHRoaXMuRz1sWzFdLHRoaXMuQj1sWzJdLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJMXCI6dGhpcy5MPXQ7dmFyIGM9KDAsbi5oc2xUb1JnYikodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHU9byhjLDMpO3RoaXMuUj11WzBdLHRoaXMuRz11WzFdLHRoaXMuQj11WzJdLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJSXCI6dGhpcy5SPXQ7dmFyIGg9KDAsbi5yZ2JUb0hzbCkodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHA9byhoLDMpO3RoaXMuSD1wWzBdLHRoaXMuUz1wWzFdLHRoaXMuTD1wWzJdLHRoaXMuc2xCYXJIZWxwZXIuc2V0SHVlKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVySCh0aGlzLkgpLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJHXCI6dGhpcy5HPXQ7dmFyIGQ9KDAsbi5yZ2JUb0hzbCkodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHY9byhkLDMpO3RoaXMuSD12WzBdLHRoaXMuUz12WzFdLHRoaXMuTD12WzJdLHRoaXMuc2xCYXJIZWxwZXIuc2V0SHVlKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVySCh0aGlzLkgpLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJCXCI6dGhpcy5CPXQ7dmFyIG09KDAsbi5yZ2JUb0hzbCkodGhpcy5SLHRoaXMuRyx0aGlzLkIpLEE9byhtLDMpO3RoaXMuSD1BWzBdLHRoaXMuUz1BWzFdLHRoaXMuTD1BWzJdLHRoaXMuc2xCYXJIZWxwZXIuc2V0SHVlKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVySCh0aGlzLkgpLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKTticmVhaztjYXNlXCJSR0JcIjp2YXIgeT1vKHQsMyk7dGhpcy5SPXlbMF0sdGhpcy5HPXlbMV0sdGhpcy5CPXlbMl07dmFyIGs9KDAsbi5yZ2JUb0hzbCkodGhpcy5SLHRoaXMuRyx0aGlzLkIpLEY9byhrLDMpO3RoaXMuSD1GWzBdLHRoaXMuUz1GWzFdLHRoaXMuTD1GWzJdLHRoaXMudXBkYXRlSW5wdXRIU0wodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHRoaXMudXBkYXRlSW5wdXRSR0IodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHRoaXMudXBkYXRlSW5wdXRSR0JIRVgodGhpcy5SLHRoaXMuRyx0aGlzLkIpO2JyZWFrO2Nhc2UgZzp2YXIgRT1vKHQsNCk7dGhpcy5SPUVbMF0sdGhpcy5HPUVbMV0sdGhpcy5CPUVbMl0sdGhpcy5BPUVbM107dmFyIEg9KDAsbi5yZ2JUb0hzbCkodGhpcy5SLHRoaXMuRyx0aGlzLkIpLEI9byhILDMpO3RoaXMuSD1CWzBdLHRoaXMuUz1CWzFdLHRoaXMuTD1CWzJdLHRoaXMuc2xCYXJIZWxwZXIuc2V0SHVlKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVySCh0aGlzLkgpLHRoaXMudXBkYXRlUG9pbnRlclNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0SFNMKHRoaXMuSCx0aGlzLlMsdGhpcy5MKSx0aGlzLnVwZGF0ZUlucHV0UkdCKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx0aGlzLnVwZGF0ZUlucHV0UkdCSEVYKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx0aGlzLnVwZGF0ZVBvaW50ZXJBKHRoaXMuQSk7YnJlYWs7Y2FzZSBiOnZhciBSPW8odCw0KTt0aGlzLkg9UlswXSx0aGlzLlM9UlsxXSx0aGlzLkw9UlsyXSx0aGlzLkE9UlszXTt2YXIgQz0oMCxuLmhzbFRvUmdiKSh0aGlzLkgsdGhpcy5TLHRoaXMuTCksUz1vKEMsMyk7dGhpcy5SPVNbMF0sdGhpcy5HPVNbMV0sdGhpcy5CPVNbMl0sdGhpcy5zbEJhckhlbHBlci5zZXRIdWUodGhpcy5IKSx0aGlzLnVwZGF0ZVBvaW50ZXJIKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVyU0wodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHRoaXMudXBkYXRlSW5wdXRIU0wodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHRoaXMudXBkYXRlSW5wdXRSR0IodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHRoaXMudXBkYXRlSW5wdXRSR0JIRVgodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHRoaXMudXBkYXRlUG9pbnRlckEodGhpcy5BKTticmVhaztjYXNlXCJSR0JIRVhcIjp2YXIgTD0oMCxuLmNzc0NvbG9yVG9SZ2IpKHQpfHxbdGhpcy5SLHRoaXMuRyx0aGlzLkJdLHc9byhMLDMpO3RoaXMuUj13WzBdLHRoaXMuRz13WzFdLHRoaXMuQj13WzJdO3ZhciBUPSgwLG4ucmdiVG9Ic2wpKHRoaXMuUix0aGlzLkcsdGhpcy5CKSx4PW8oVCwzKTt0aGlzLkg9eFswXSx0aGlzLlM9eFsxXSx0aGlzLkw9eFsyXSx0aGlzLnNsQmFySGVscGVyLnNldEh1ZSh0aGlzLkgpLHRoaXMudXBkYXRlUG9pbnRlckgodGhpcy5IKSx0aGlzLnVwZGF0ZVBvaW50ZXJTTCh0aGlzLkgsdGhpcy5TLHRoaXMuTCksdGhpcy51cGRhdGVJbnB1dEhTTCh0aGlzLkgsdGhpcy5TLHRoaXMuTCksdGhpcy51cGRhdGVJbnB1dFJHQih0aGlzLlIsdGhpcy5HLHRoaXMuQik7YnJlYWs7Y2FzZSBmOnZhciBHPSgwLG4ucGFyc2VDb2xvcikodCxcInJnYmFcIil8fFswLDAsMCwxXSxJPW8oRyw0KTt0aGlzLlI9SVswXSx0aGlzLkc9SVsxXSx0aGlzLkI9SVsyXSx0aGlzLkE9SVszXTt2YXIgUD0oMCxuLnJnYlRvSHNsKSh0aGlzLlIsdGhpcy5HLHRoaXMuQiksRD1vKFAsMyk7dGhpcy5IPURbMF0sdGhpcy5TPURbMV0sdGhpcy5MPURbMl0sdGhpcy5zbEJhckhlbHBlci5zZXRIdWUodGhpcy5IKSx0aGlzLnVwZGF0ZVBvaW50ZXJIKHRoaXMuSCksdGhpcy51cGRhdGVQb2ludGVyU0wodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHRoaXMudXBkYXRlSW5wdXRIU0wodGhpcy5ILHRoaXMuUyx0aGlzLkwpLHRoaXMudXBkYXRlSW5wdXRSR0IodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHRoaXMudXBkYXRlSW5wdXRSR0JIRVgodGhpcy5SLHRoaXMuRyx0aGlzLkIpLHRoaXMudXBkYXRlUG9pbnRlckEodGhpcy5BKTticmVhaztjYXNlXCJBTFBIQVwiOnRoaXMuQT10fTE9PT10aGlzLkE/dGhpcy5wcmV2aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvcj1cInJnYihcIit0aGlzLlIrXCIsXCIrdGhpcy5HK1wiLFwiK3RoaXMuQitcIilcIjp0aGlzLnByZXZpZXcuc3R5bGUuYmFja2dyb3VuZENvbG9yPVwicmdiYShcIit0aGlzLlIrXCIsXCIrdGhpcy5HK1wiLFwiK3RoaXMuQitcIixcIit0aGlzLkErXCIpXCIsciYmci5zaWxlbnR8fHRoaXMub25jaGFuZ2UmJnRoaXMub25jaGFuZ2UodGhpcy5wcmV2aWV3LnN0eWxlLmJhY2tncm91bmRDb2xvcil9fSx7a2V5Olwib25QYWxldHRlQ29sb3JBZGRcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLm9uY29sb3JhZGQmJnRoaXMub25jb2xvcmFkZChlKX19LHtrZXk6XCJvblBhbGV0dGVDb2xvclJlbW92ZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMub25jb2xvcnJlbW92ZSYmdGhpcy5vbmNvbG9ycmVtb3ZlKGUpfX0se2tleTpcInVwZGF0ZUlucHV0SFNMXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LHIpe3RoaXMub3B0aW9ucy5zaG93SFNMJiYodGhpcy5pbnB1dEgudmFsdWU9ZSx0aGlzLmlucHV0Uy52YWx1ZT10LHRoaXMuaW5wdXRMLnZhbHVlPXIpfX0se2tleTpcInVwZGF0ZUlucHV0UkdCXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LHIpe3RoaXMub3B0aW9ucy5zaG93UkdCJiYodGhpcy5pbnB1dFIudmFsdWU9ZSx0aGlzLmlucHV0Ry52YWx1ZT10LHRoaXMuaW5wdXRCLnZhbHVlPXIpfX0se2tleTpcInVwZGF0ZUlucHV0UkdCSEVYXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LHIpe3RoaXMub3B0aW9ucy5zaG93SEVYJiYodGhpcy5pbnB1dFJHQkhFWC52YWx1ZT0oMCxuLnJnYlRvSGV4KShlLHQscikpfX0se2tleTpcInVwZGF0ZVBvaW50ZXJIXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zLmh1ZUJhclNpemVbMF0qZS8zNjA7dGhpcy5odWVQb2ludGVyLnN0eWxlLmxlZnQ9dC03K1wicHhcIn19LHtrZXk6XCJ1cGRhdGVQb2ludGVyU0xcIix2YWx1ZTpmdW5jdGlvbihlLHQscil7dmFyIGk9KDAsbi5oc2xUb1JnYikoZSx0LHIpLHM9byhpLDMpLGE9c1swXSxsPXNbMV0sYz1zWzJdLHU9dGhpcy5zbEJhckhlbHBlci5maW5kQ29sb3IoYSxsLGMpLGg9byh1LDIpLHA9aFswXSxkPWhbMV07cD49MCYmKHRoaXMuc2xQb2ludGVyLnN0eWxlLmxlZnQ9cC03K1wicHhcIix0aGlzLnNsUG9pbnRlci5zdHlsZS50b3A9ZC03K1wicHhcIil9fSx7a2V5OlwidXBkYXRlUG9pbnRlckFcIix2YWx1ZTpmdW5jdGlvbihlKXtpZih0aGlzLm9wdGlvbnMuc2hvd0FscGhhKXt2YXIgdD10aGlzLm9wdGlvbnMuYWxwaGFCYXJTaXplWzBdKmU7dGhpcy5hbHBoYVBvaW50ZXIuc3R5bGUubGVmdD10LTcrXCJweFwifX19XSksZX0oKSxGPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXtjKHRoaXMsZSksdGhpcy5uYW1lPXQsdGhpcy5saXN0ZW5lcnM9W119cmV0dXJuIGkoZSxbe2tleTpcIm9uXCIsdmFsdWU6ZnVuY3Rpb24oZSl7ZSYmdGhpcy5saXN0ZW5lcnMucHVzaChlKX19LHtrZXk6XCJvZmZcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLmxpc3RlbmVycz1lP3RoaXMubGlzdGVuZXJzLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdCE9PWV9KTpbXX19LHtrZXk6XCJlbWl0XCIsdmFsdWU6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI9dGhpcy5saXN0ZW5lcnMuc2xpY2UoMCksaT0wO2k8ci5sZW5ndGg7aSsrKXJbaV0uYXBwbHkodCxlKX19XSksZX0oKTtmdW5jdGlvbiBFKGUsdCl7dmFyIHI9bmV3IGsoZSx0KSxpPXtjaGFuZ2U6bmV3IEYoXCJjaGFuZ2VcIiksY29sb3JhZGQ6bmV3IEYoXCJjb2xvcmFkZFwiKSxjb2xvcnJlbW92ZTpuZXcgRihcImNvbG9ycmVtb3ZlXCIpfSxzPSEwLGE9e30sbD17Z2V0IGVsZW1lbnQoKXtyZXR1cm4gci5lbGVtZW50fSxnZXQgcmdiKCl7cmV0dXJuW3IuUixyLkcsci5CXX0sc2V0IHJnYihlKXt2YXIgdD1vKGUsMyksaT10WzBdLHM9dFsxXSxhPXRbMl0sbD1bKDAsbi5saW1pdCkoaSwwLDI1NSksKDAsbi5saW1pdCkocywwLDI1NSksKDAsbi5saW1pdCkoYSwwLDI1NSldO2k9bFswXSxzPWxbMV0sYT1sWzJdLHIub25WYWx1ZUNoYW5nZWQoZyxbaSxzLGEsMV0pfSxnZXQgaHNsKCl7cmV0dXJuW3IuSCxyLlMsci5MXX0sc2V0IGhzbChlKXt2YXIgdD1vKGUsMyksaT10WzBdLHM9dFsxXSxhPXRbMl0sbD1bKDAsbi5saW1pdCkoaSwwLDM2MCksKDAsbi5saW1pdCkocywwLDEwMCksKDAsbi5saW1pdCkoYSwwLDEwMCldO2k9bFswXSxzPWxbMV0sYT1sWzJdLHIub25WYWx1ZUNoYW5nZWQoYixbaSxzLGEsMV0pfSxnZXQgcmdiaGV4KCl7cmV0dXJuIHRoaXMuYWxsLmhleH0sZ2V0IHJnYmEoKXtyZXR1cm5bci5SLHIuRyxyLkIsci5BXX0sc2V0IHJnYmEoZSl7dmFyIHQ9byhlLDQpLGk9dFswXSxzPXRbMV0sYT10WzJdLGw9dFszXSxjPVsoMCxuLmxpbWl0KShpLDAsMjU1KSwoMCxuLmxpbWl0KShzLDAsMjU1KSwoMCxuLmxpbWl0KShhLDAsMjU1KSwoMCxuLmxpbWl0KShsLDAsMSldO2k9Y1swXSxzPWNbMV0sYT1jWzJdLGw9Y1szXSxyLm9uVmFsdWVDaGFuZ2VkKGcsW2kscyxhLGxdKX0sZ2V0IGhzbGEoKXtyZXR1cm5bci5ILHIuUyxyLkwsci5BXX0sc2V0IGhzbGEoZSl7dmFyIHQ9byhlLDQpLGk9dFswXSxzPXRbMV0sYT10WzJdLGw9dFszXSxjPVsoMCxuLmxpbWl0KShpLDAsMzYwKSwoMCxuLmxpbWl0KShzLDAsMTAwKSwoMCxuLmxpbWl0KShhLDAsMTAwKSwoMCxuLmxpbWl0KShsLDAsMSldO2k9Y1swXSxzPWNbMV0sYT1jWzJdLGw9Y1szXSxyLm9uVmFsdWVDaGFuZ2VkKGIsW2kscyxhLGxdKX0sZ2V0IGNvbG9yKCl7cmV0dXJuIHRoaXMuYWxsLnRvU3RyaW5nKCl9LHNldCBjb2xvcihlKXtyLm9uVmFsdWVDaGFuZ2VkKGYsZSl9LHNldENvbG9yOmZ1bmN0aW9uKGUpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdJiZhcmd1bWVudHNbMV07ci5vblZhbHVlQ2hhbmdlZChmLGUse3NpbGVudDp0fSl9LGdldCBhbGwoKXtpZihzKXt2YXIgZT1bci5SLHIuRyxyLkIsci5BXSx0PXIuQTwxP1wicmdiYShcIityLlIrXCIsXCIrci5HK1wiLFwiK3IuQitcIixcIityLkErXCIpXCI6bi5yZ2JUb0hleC5hcHBseSh2b2lkIDAsZSk7KGE9KDAsbi5wYXJzZUNvbG9yKShlLGEpKS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0fSxzPSExfXJldHVybiBPYmplY3QuYXNzaWduKHt9LGEpfSxnZXQgb25jaGFuZ2UoKXtyZXR1cm4gaS5jaGFuZ2UmJmkuY2hhbmdlLmxpc3RlbmVyc1swXX0sc2V0IG9uY2hhbmdlKGUpe3RoaXMub2ZmKFwiY2hhbmdlXCIpLm9uKFwiY2hhbmdlXCIsZSl9LGdldCBvbmNvbG9yYWRkKCl7cmV0dXJuIGkuY29sb3JhZGQmJmkuY29sb3JhZGQubGlzdGVuZXJzWzBdfSxzZXQgb25jb2xvcmFkZChlKXt0aGlzLm9mZihcImNvbG9yYWRkXCIpLm9uKFwiY29sb3JhZGRcIixlKX0sZ2V0IG9uY29sb3JyZW1vdmUoKXtyZXR1cm4gaS5jb2xvcnJlbW92ZSYmaS5jb2xvcnJlbW92ZS5saXN0ZW5lcnNbMF19LHNldCBvbmNvbG9ycmVtb3ZlKGUpe3RoaXMub2ZmKFwiY29sb3JyZW1vdmVcIikub24oXCJjb2xvcnJlbW92ZVwiLGUpfSxnZXQgcGFsZXR0ZSgpe3JldHVybiBPYmplY3Qua2V5cyhyLnBhbGV0dGUpLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gci5wYWxldHRlW2VdfSl9LHNldCBwYWxldHRlKGUpe3IudXBkYXRlUGFsZXR0ZShlKX0sc2hvdzpmdW5jdGlvbigpe3IuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpfSxoaWRlOmZ1bmN0aW9uKCl7ci5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIil9LHRvZ2dsZTpmdW5jdGlvbigpe3IuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpfSxvbjpmdW5jdGlvbihlLHQpe3JldHVybiBlJiZpW2VdJiZpW2VdLm9uKHQpLHRoaXN9LG9mZjpmdW5jdGlvbihlLHQpe3JldHVybiBlJiZpW2VdJiZpW2VdLm9mZih0KSx0aGlzfSxkZXN0cm95OmZ1bmN0aW9uKCl7aS5jaGFuZ2Uub2ZmKCksaS5jb2xvcmFkZC5vZmYoKSxpLmNvbG9ycmVtb3ZlLm9mZigpLHIuZWxlbWVudC5yZW1vdmUoKSxpPW51bGwscj1udWxsfX07cmV0dXJuIHIub25jaGFuZ2U9ZnVuY3Rpb24oKXtmb3IodmFyIGU9YXJndW1lbnRzLmxlbmd0aCx0PUFycmF5KGUpLHI9MDtyPGU7cisrKXRbcl09YXJndW1lbnRzW3JdO3M9ITAsaS5jaGFuZ2UuZW1pdChbbF0uY29uY2F0KHQpLGwpfSxyLm9uY29sb3JhZGQ9ZnVuY3Rpb24oKXtmb3IodmFyIGU9YXJndW1lbnRzLmxlbmd0aCx0PUFycmF5KGUpLHI9MDtyPGU7cisrKXRbcl09YXJndW1lbnRzW3JdO2kuY29sb3JhZGQuZW1pdChbbF0uY29uY2F0KHQpLGwpfSxyLm9uY29sb3JyZW1vdmU9ZnVuY3Rpb24oKXtmb3IodmFyIGU9YXJndW1lbnRzLmxlbmd0aCx0PUFycmF5KGUpLHI9MDtyPGU7cisrKXRbcl09YXJndW1lbnRzW3JdO2kuY29sb3JyZW1vdmUuZW1pdChbbF0uY29uY2F0KHQpLGwpfSxyLmVsZW1lbnQuY3RybD1sLGx9aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQ+c3R5bGVbZGF0YS1zb3VyY2U9XCJhLWNvbG9yLXBpY2tlclwiXScpKXt2YXIgSD1yKDUpLnRvU3RyaW5nKCksQj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7Qi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJ0ZXh0L2Nzc1wiKSxCLnNldEF0dHJpYnV0ZShcImRhdGEtc291cmNlXCIsXCJhLWNvbG9yLXBpY2tlclwiKSxCLmlubmVySFRNTD1ILGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoZWFkXCIpLmFwcGVuZENoaWxkKEIpfXQuY3JlYXRlUGlja2VyPUUsdC5mcm9tPWZ1bmN0aW9uKGUsdCl7dmFyIHI9ZnVuY3Rpb24oZSl7cmV0dXJuIGU/QXJyYXkuaXNBcnJheShlKT9lOmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudD9bZV06ZSBpbnN0YW5jZW9mIE5vZGVMaXN0P1tdLmNvbmNhdCh1KGUpKTpcInN0cmluZ1wiPT10eXBlb2YgZT9bXS5jb25jYXQodShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpKSk6ZS5qcXVlcnk/ZS5nZXQoKTpbXTpbXX0oZSkubWFwKGZ1bmN0aW9uKGUscil7dmFyIGk9RShlLHQpO3JldHVybiBpLmluZGV4PXIsaX0pO3JldHVybiByLm9uPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHIuZm9yRWFjaChmdW5jdGlvbihyKXtyZXR1cm4gci5vbihlLHQpfSksdGhpc30sci5vZmY9ZnVuY3Rpb24oZSl7cmV0dXJuIHIuZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gdC5vZmYoZSl9KSx0aGlzfSxyfSx0LnBhcnNlQ29sb3JUb1JnYj1uLnBhcnNlQ29sb3JUb1JnYix0LnBhcnNlQ29sb3JUb1JnYmE9bi5wYXJzZUNvbG9yVG9SZ2JhLHQucGFyc2VDb2xvclRvSHNsPW4ucGFyc2VDb2xvclRvSHNsLHQucGFyc2VDb2xvclRvSHNsYT1uLnBhcnNlQ29sb3JUb0hzbGEsdC5wYXJzZUNvbG9yPW4ucGFyc2VDb2xvcix0LnJnYlRvSGV4PW4ucmdiVG9IZXgsdC5oc2xUb1JnYj1uLmhzbFRvUmdiLHQucmdiVG9Ic2w9bi5yZ2JUb0hzbCx0LnJnYlRvSHN2PW4ucmdiVG9Ic3YsdC5yZ2JUb0ludD1uLnJnYlRvSW50LHQuaW50VG9SZ2I9bi5pbnRUb1JnYix0LmdldEx1bWluYW5jZT1uLmdldEx1bWluYW5jZSx0LkNPTE9SX05BTUVTPW4uQ09MT1JfTkFNRVMsdC5QQUxFVFRFX01BVEVSSUFMXzUwMD1uLlBBTEVUVEVfTUFURVJJQUxfNTAwLHQuUEFMRVRURV9NQVRFUklBTF9DSFJPTUU9bi5QQUxFVFRFX01BVEVSSUFMX0NIUk9NRSx0LlZFUlNJT049XCIxLjIuMVwifSxmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdC5udmw9dC5lbnN1cmVBcnJheT10LmxpbWl0PXQuZ2V0THVtaW5hbmNlPXQucGFyc2VDb2xvcj10LnBhcnNlQ29sb3JUb0hzbGE9dC5wYXJzZUNvbG9yVG9Ic2w9dC5jc3NIc2xhVG9Ic2xhPXQuY3NzSHNsVG9Ic2w9dC5wYXJzZUNvbG9yVG9SZ2JhPXQucGFyc2VDb2xvclRvUmdiPXQuY3NzUmdiYVRvUmdiYT10LmNzc1JnYlRvUmdiPXQuY3NzQ29sb3JUb1JnYmE9dC5jc3NDb2xvclRvUmdiPXQuaW50VG9SZ2I9dC5yZ2JUb0ludD10LnJnYlRvSHN2PXQucmdiVG9Ic2w9dC5oc2xUb1JnYj10LnJnYlRvSGV4PXQuUEFMRVRURV9NQVRFUklBTF9DSFJPTUU9dC5QQUxFVFRFX01BVEVSSUFMXzUwMD10LkNPTE9SX05BTUVTPXZvaWQgMDt2YXIgaT1mdW5jdGlvbihlLHQpe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuIGU7aWYoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChlKSlyZXR1cm4gZnVuY3Rpb24oZSx0KXt2YXIgcj1bXSxpPSEwLG89ITEsbj12b2lkIDA7dHJ5e2Zvcih2YXIgcyxhPWVbU3ltYm9sLml0ZXJhdG9yXSgpOyEoaT0ocz1hLm5leHQoKSkuZG9uZSkmJihyLnB1c2gocy52YWx1ZSksIXR8fHIubGVuZ3RoIT09dCk7aT0hMCk7fWNhdGNoKGUpe289ITAsbj1lfWZpbmFsbHl7dHJ5eyFpJiZhLnJldHVybiYmYS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgbn19cmV0dXJuIHJ9KGUsdCk7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9LG89ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntkZWZhdWx0OmV9fShyKDApKTtmdW5jdGlvbiBuKGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpe2Zvcih2YXIgdD0wLHI9QXJyYXkoZS5sZW5ndGgpO3Q8ZS5sZW5ndGg7dCsrKXJbdF09ZVt0XTtyZXR1cm4gcn1yZXR1cm4gQXJyYXkuZnJvbShlKX12YXIgcz17YWxpY2VibHVlOlwiI0YwRjhGRlwiLGFudGlxdWV3aGl0ZTpcIiNGQUVCRDdcIixhcXVhOlwiIzAwRkZGRlwiLGFxdWFtYXJpbmU6XCIjN0ZGRkQ0XCIsYXp1cmU6XCIjRjBGRkZGXCIsYmVpZ2U6XCIjRjVGNURDXCIsYmlzcXVlOlwiI0ZGRTRDNFwiLGJsYWNrOlwiIzAwMDAwMFwiLGJsYW5jaGVkYWxtb25kOlwiI0ZGRUJDRFwiLGJsdWU6XCIjMDAwMEZGXCIsYmx1ZXZpb2xldDpcIiM4QTJCRTJcIixicm93bjpcIiNBNTJBMkFcIixidXJseXdvb2Q6XCIjREVCODg3XCIsY2FkZXRibHVlOlwiIzVGOUVBMFwiLGNoYXJ0cmV1c2U6XCIjN0ZGRjAwXCIsY2hvY29sYXRlOlwiI0QyNjkxRVwiLGNvcmFsOlwiI0ZGN0Y1MFwiLGNvcm5mbG93ZXJibHVlOlwiIzY0OTVFRFwiLGNvcm5zaWxrOlwiI0ZGRjhEQ1wiLGNyaW1zb246XCIjREMxNDNDXCIsY3lhbjpcIiMwMEZGRkZcIixkYXJrYmx1ZTpcIiMwMDAwOEJcIixkYXJrY3lhbjpcIiMwMDhCOEJcIixkYXJrZ29sZGVucm9kOlwiI0I4ODYwQlwiLGRhcmtncmF5OlwiI0E5QTlBOVwiLGRhcmtncmV5OlwiI0E5QTlBOVwiLGRhcmtncmVlbjpcIiMwMDY0MDBcIixkYXJra2hha2k6XCIjQkRCNzZCXCIsZGFya21hZ2VudGE6XCIjOEIwMDhCXCIsZGFya29saXZlZ3JlZW46XCIjNTU2QjJGXCIsZGFya29yYW5nZTpcIiNGRjhDMDBcIixkYXJrb3JjaGlkOlwiIzk5MzJDQ1wiLGRhcmtyZWQ6XCIjOEIwMDAwXCIsZGFya3NhbG1vbjpcIiNFOTk2N0FcIixkYXJrc2VhZ3JlZW46XCIjOEZCQzhGXCIsZGFya3NsYXRlYmx1ZTpcIiM0ODNEOEJcIixkYXJrc2xhdGVncmF5OlwiIzJGNEY0RlwiLGRhcmtzbGF0ZWdyZXk6XCIjMkY0RjRGXCIsZGFya3R1cnF1b2lzZTpcIiMwMENFRDFcIixkYXJrdmlvbGV0OlwiIzk0MDBEM1wiLGRlZXBwaW5rOlwiI0ZGMTQ5M1wiLGRlZXBza3libHVlOlwiIzAwQkZGRlwiLGRpbWdyYXk6XCIjNjk2OTY5XCIsZGltZ3JleTpcIiM2OTY5NjlcIixkb2RnZXJibHVlOlwiIzFFOTBGRlwiLGZpcmVicmljazpcIiNCMjIyMjJcIixmbG9yYWx3aGl0ZTpcIiNGRkZBRjBcIixmb3Jlc3RncmVlbjpcIiMyMjhCMjJcIixmdWNoc2lhOlwiI0ZGMDBGRlwiLGdhaW5zYm9ybzpcIiNEQ0RDRENcIixnaG9zdHdoaXRlOlwiI0Y4RjhGRlwiLGdvbGQ6XCIjRkZENzAwXCIsZ29sZGVucm9kOlwiI0RBQTUyMFwiLGdyYXk6XCIjODA4MDgwXCIsZ3JleTpcIiM4MDgwODBcIixncmVlbjpcIiMwMDgwMDBcIixncmVlbnllbGxvdzpcIiNBREZGMkZcIixob25leWRldzpcIiNGMEZGRjBcIixob3RwaW5rOlwiI0ZGNjlCNFwiLFwiaW5kaWFucmVkIFwiOlwiI0NENUM1Q1wiLFwiaW5kaWdvIFwiOlwiIzRCMDA4MlwiLGl2b3J5OlwiI0ZGRkZGMFwiLGtoYWtpOlwiI0YwRTY4Q1wiLGxhdmVuZGVyOlwiI0U2RTZGQVwiLGxhdmVuZGVyYmx1c2g6XCIjRkZGMEY1XCIsbGF3bmdyZWVuOlwiIzdDRkMwMFwiLGxlbW9uY2hpZmZvbjpcIiNGRkZBQ0RcIixsaWdodGJsdWU6XCIjQUREOEU2XCIsbGlnaHRjb3JhbDpcIiNGMDgwODBcIixsaWdodGN5YW46XCIjRTBGRkZGXCIsbGlnaHRnb2xkZW5yb2R5ZWxsb3c6XCIjRkFGQUQyXCIsbGlnaHRncmF5OlwiI0QzRDNEM1wiLGxpZ2h0Z3JleTpcIiNEM0QzRDNcIixsaWdodGdyZWVuOlwiIzkwRUU5MFwiLGxpZ2h0cGluazpcIiNGRkI2QzFcIixsaWdodHNhbG1vbjpcIiNGRkEwN0FcIixsaWdodHNlYWdyZWVuOlwiIzIwQjJBQVwiLGxpZ2h0c2t5Ymx1ZTpcIiM4N0NFRkFcIixsaWdodHNsYXRlZ3JheTpcIiM3Nzg4OTlcIixsaWdodHNsYXRlZ3JleTpcIiM3Nzg4OTlcIixsaWdodHN0ZWVsYmx1ZTpcIiNCMEM0REVcIixsaWdodHllbGxvdzpcIiNGRkZGRTBcIixsaW1lOlwiIzAwRkYwMFwiLGxpbWVncmVlbjpcIiMzMkNEMzJcIixsaW5lbjpcIiNGQUYwRTZcIixtYWdlbnRhOlwiI0ZGMDBGRlwiLG1hcm9vbjpcIiM4MDAwMDBcIixtZWRpdW1hcXVhbWFyaW5lOlwiIzY2Q0RBQVwiLG1lZGl1bWJsdWU6XCIjMDAwMENEXCIsbWVkaXVtb3JjaGlkOlwiI0JBNTVEM1wiLG1lZGl1bXB1cnBsZTpcIiM5MzcwREJcIixtZWRpdW1zZWFncmVlbjpcIiMzQ0IzNzFcIixtZWRpdW1zbGF0ZWJsdWU6XCIjN0I2OEVFXCIsbWVkaXVtc3ByaW5nZ3JlZW46XCIjMDBGQTlBXCIsbWVkaXVtdHVycXVvaXNlOlwiIzQ4RDFDQ1wiLG1lZGl1bXZpb2xldHJlZDpcIiNDNzE1ODVcIixtaWRuaWdodGJsdWU6XCIjMTkxOTcwXCIsbWludGNyZWFtOlwiI0Y1RkZGQVwiLG1pc3R5cm9zZTpcIiNGRkU0RTFcIixtb2NjYXNpbjpcIiNGRkU0QjVcIixuYXZham93aGl0ZTpcIiNGRkRFQURcIixuYXZ5OlwiIzAwMDA4MFwiLG9sZGxhY2U6XCIjRkRGNUU2XCIsb2xpdmU6XCIjODA4MDAwXCIsb2xpdmVkcmFiOlwiIzZCOEUyM1wiLG9yYW5nZTpcIiNGRkE1MDBcIixvcmFuZ2VyZWQ6XCIjRkY0NTAwXCIsb3JjaGlkOlwiI0RBNzBENlwiLHBhbGVnb2xkZW5yb2Q6XCIjRUVFOEFBXCIscGFsZWdyZWVuOlwiIzk4RkI5OFwiLHBhbGV0dXJxdW9pc2U6XCIjQUZFRUVFXCIscGFsZXZpb2xldHJlZDpcIiNEQjcwOTNcIixwYXBheWF3aGlwOlwiI0ZGRUZENVwiLHBlYWNocHVmZjpcIiNGRkRBQjlcIixwZXJ1OlwiI0NEODUzRlwiLHBpbms6XCIjRkZDMENCXCIscGx1bTpcIiNEREEwRERcIixwb3dkZXJibHVlOlwiI0IwRTBFNlwiLHB1cnBsZTpcIiM4MDAwODBcIixyZWJlY2NhcHVycGxlOlwiIzY2MzM5OVwiLHJlZDpcIiNGRjAwMDBcIixyb3N5YnJvd246XCIjQkM4RjhGXCIscm95YWxibHVlOlwiIzQxNjlFMVwiLHNhZGRsZWJyb3duOlwiIzhCNDUxM1wiLHNhbG1vbjpcIiNGQTgwNzJcIixzYW5keWJyb3duOlwiI0Y0QTQ2MFwiLHNlYWdyZWVuOlwiIzJFOEI1N1wiLHNlYXNoZWxsOlwiI0ZGRjVFRVwiLHNpZW5uYTpcIiNBMDUyMkRcIixzaWx2ZXI6XCIjQzBDMEMwXCIsc2t5Ymx1ZTpcIiM4N0NFRUJcIixzbGF0ZWJsdWU6XCIjNkE1QUNEXCIsc2xhdGVncmF5OlwiIzcwODA5MFwiLHNsYXRlZ3JleTpcIiM3MDgwOTBcIixzbm93OlwiI0ZGRkFGQVwiLHNwcmluZ2dyZWVuOlwiIzAwRkY3RlwiLHN0ZWVsYmx1ZTpcIiM0NjgyQjRcIix0YW46XCIjRDJCNDhDXCIsdGVhbDpcIiMwMDgwODBcIix0aGlzdGxlOlwiI0Q4QkZEOFwiLHRvbWF0bzpcIiNGRjYzNDdcIix0dXJxdW9pc2U6XCIjNDBFMEQwXCIsdmlvbGV0OlwiI0VFODJFRVwiLHdoZWF0OlwiI0Y1REVCM1wiLHdoaXRlOlwiI0ZGRkZGRlwiLHdoaXRlc21va2U6XCIjRjVGNUY1XCIseWVsbG93OlwiI0ZGRkYwMFwiLHllbGxvd2dyZWVuOlwiIzlBQ0QzMlwifTtmdW5jdGlvbiBhKGUsdCxyKXtyZXR1cm4gZT0rZSxpc05hTihlKT90OmU8dD90OmU+cj9yOmV9ZnVuY3Rpb24gbChlLHQpe3JldHVybiBudWxsPT1lP3Q6ZX1mdW5jdGlvbiBjKGUsdCxyKXt2YXIgaT1bYShlLDAsMjU1KSxhKHQsMCwyNTUpLGEociwwLDI1NSldO3JldHVyblwiI1wiKyhcIjAwMDAwMFwiKygoZT1pWzBdKTw8MTZ8KHQ9aVsxXSk8PDh8KHI9aVsyXSkpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTYpfWZ1bmN0aW9uIHUoZSx0LHIpe3ZhciBpPXZvaWQgMCxvPXZvaWQgMCxuPXZvaWQgMCxzPVthKGUsMCwzNjApLzM2MCxhKHQsMCwxMDApLzEwMCxhKHIsMCwxMDApLzEwMF07aWYoZT1zWzBdLHI9c1syXSwwPT0odD1zWzFdKSlpPW89bj1yO2Vsc2V7dmFyIGw9ZnVuY3Rpb24oZSx0LHIpe3JldHVybiByPDAmJihyKz0xKSxyPjEmJihyLT0xKSxyPDEvNj9lKzYqKHQtZSkqcjpyPC41P3Q6cjwyLzM/ZSsodC1lKSooMi8zLXIpKjY6ZX0sYz1yPC41P3IqKDErdCk6cit0LXIqdCx1PTIqci1jO2k9bCh1LGMsZSsxLzMpLG89bCh1LGMsZSksbj1sKHUsYyxlLTEvMyl9cmV0dXJuWzI1NSppLDI1NSpvLDI1NSpuXS5tYXAoTWF0aC5yb3VuZCl9ZnVuY3Rpb24gaChlLHQscil7dmFyIGk9W2EoZSwwLDI1NSkvMjU1LGEodCwwLDI1NSkvMjU1LGEociwwLDI1NSkvMjU1XTtlPWlbMF0sdD1pWzFdLHI9aVsyXTt2YXIgbz1NYXRoLm1heChlLHQsciksbj1NYXRoLm1pbihlLHQscikscz12b2lkIDAsbD12b2lkIDAsYz0obytuKS8yO2lmKG89PW4pcz1sPTA7ZWxzZXt2YXIgdT1vLW47c3dpdGNoKGw9Yz4uNT91LygyLW8tbik6dS8obytuKSxvKXtjYXNlIGU6cz0odC1yKS91Kyh0PHI/NjowKTticmVhaztjYXNlIHQ6cz0oci1lKS91KzI7YnJlYWs7Y2FzZSByOnM9KGUtdCkvdSs0fXMvPTZ9cmV0dXJuWzM2MCpzLDEwMCpsLDEwMCpjXS5tYXAoTWF0aC5yb3VuZCl9ZnVuY3Rpb24gcChlLHQscil7cmV0dXJuIGU8PDE2fHQ8PDh8cn1mdW5jdGlvbiBkKGUpe2lmKGUpe3ZhciB0PXNbZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCldLHI9L15cXHMqIz8oKChbMC05QS1GXSkoWzAtOUEtRl0pKFswLTlBLUZdKSl8KChbMC05QS1GXXsyfSkoWzAtOUEtRl17Mn0pKFswLTlBLUZdezJ9KSkpXFxzKiQvaS5leGVjKHR8fGUpfHxbXSxvPWkociwxMCksbj1vWzNdLGE9b1s0XSxsPW9bNV0sYz1vWzddLHU9b1s4XSxoPW9bOV07aWYodm9pZCAwIT09bilyZXR1cm5bcGFyc2VJbnQobituLDE2KSxwYXJzZUludChhK2EsMTYpLHBhcnNlSW50KGwrbCwxNildO2lmKHZvaWQgMCE9PWMpcmV0dXJuW3BhcnNlSW50KGMsMTYpLHBhcnNlSW50KHUsMTYpLHBhcnNlSW50KGgsMTYpXX19ZnVuY3Rpb24gZihlKXtpZihlKXt2YXIgdD1zW2UudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXSxyPS9eXFxzKiM/KCgoWzAtOUEtRl0pKFswLTlBLUZdKShbMC05QS1GXSkoWzAtOUEtRl0pPyl8KChbMC05QS1GXXsyfSkoWzAtOUEtRl17Mn0pKFswLTlBLUZdezJ9KShbMC05QS1GXXsyfSk/KSlcXHMqJC9pLmV4ZWModHx8ZSl8fFtdLG89aShyLDEyKSxuPW9bM10sYT1vWzRdLGw9b1s1XSxjPW9bNl0sdT1vWzhdLGg9b1s5XSxwPW9bMTBdLGQ9b1sxMV07aWYodm9pZCAwIT09bilyZXR1cm5bcGFyc2VJbnQobituLDE2KSxwYXJzZUludChhK2EsMTYpLHBhcnNlSW50KGwrbCwxNiksYz8rKHBhcnNlSW50KGMrYywxNikvMjU1KS50b0ZpeGVkKDIpOjFdO2lmKHZvaWQgMCE9PXUpcmV0dXJuW3BhcnNlSW50KHUsMTYpLHBhcnNlSW50KGgsMTYpLHBhcnNlSW50KHAsMTYpLGQ/KyhwYXJzZUludChkLDE2KS8yNTUpLnRvRml4ZWQoMik6MV19fWZ1bmN0aW9uIGcoZSl7aWYoZSl7dmFyIHQ9L15yZ2JcXCgoXFxkKylbXFxzLF0oXFxkKylbXFxzLF0oXFxkKylcXCkvaS5leGVjKGUpfHxbXSxyPWkodCw0KSxvPXJbMF0sbj1yWzFdLHM9clsyXSxsPXJbM107cmV0dXJuIG8/W2EobiwwLDI1NSksYShzLDAsMjU1KSxhKGwsMCwyNTUpXTp2b2lkIDB9fWZ1bmN0aW9uIGIoZSl7aWYoZSl7dmFyIHQ9L15yZ2JhP1xcKChcXGQrKVxccypbXFxzLF1cXHMqKFxcZCspXFxzKltcXHMsXVxccyooXFxkKykoXFxzKltcXHMsXVxccyooXFxkKiguXFxkKyk/KSk/XFwpL2kuZXhlYyhlKXx8W10scj1pKHQsNiksbz1yWzBdLG49clsxXSxzPXJbMl0sYz1yWzNdLHU9cls1XTtyZXR1cm4gbz9bYShuLDAsMjU1KSxhKHMsMCwyNTUpLGEoYywwLDI1NSksYShsKHUsMSksMCwxKV06dm9pZCAwfX1mdW5jdGlvbiB2KGUpe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuW2EoZVswXSwwLDI1NSksYShlWzFdLDAsMjU1KSxhKGVbMl0sMCwyNTUpLGEobChlWzNdLDEpLDAsMSldO3ZhciB0PWYoZSl8fGIoZSk7cmV0dXJuIHQmJjM9PT10Lmxlbmd0aCYmdC5wdXNoKDEpLHR9ZnVuY3Rpb24gbShlKXtpZihlKXt2YXIgdD0vXmhzbFxcKChcXGQrKVtcXHMsXShcXGQrKVtcXHMsXShcXGQrKVxcKS9pLmV4ZWMoZSl8fFtdLHI9aSh0LDQpLG89clswXSxuPXJbMV0scz1yWzJdLGw9clszXTtyZXR1cm4gbz9bYShuLDAsMzYwKSxhKHMsMCwxMDApLGEobCwwLDEwMCldOnZvaWQgMH19ZnVuY3Rpb24gQShlKXtpZihlKXt2YXIgdD0vXmhzbGE/XFwoKFxcZCspXFxzKltcXHMsXVxccyooXFxkKylcXHMqW1xccyxdXFxzKihcXGQrKShcXHMqW1xccyxdXFxzKihcXGQqKC5cXGQrKT8pKT9cXCkvaS5leGVjKGUpfHxbXSxyPWkodCw2KSxvPXJbMF0sbj1yWzFdLHM9clsyXSxjPXJbM10sdT1yWzVdO3JldHVybiBvP1thKG4sMCwyNTUpLGEocywwLDI1NSksYShjLDAsMjU1KSxhKGwodSwxKSwwLDEpXTp2b2lkIDB9fWZ1bmN0aW9uIHkoZSl7aWYoQXJyYXkuaXNBcnJheShlKSlyZXR1cm5bYShlWzBdLDAsMzYwKSxhKGVbMV0sMCwxMDApLGEoZVsyXSwwLDEwMCksYShsKGVbM10sMSksMCwxKV07dmFyIHQ9QShlKTtyZXR1cm4gdCYmMz09PXQubGVuZ3RoJiZ0LnB1c2goMSksdH1mdW5jdGlvbiBrKGUsdCl7c3dpdGNoKHQpe2Nhc2VcInJnYlwiOmRlZmF1bHQ6cmV0dXJuIGUuc2xpY2UoMCwzKTtjYXNlXCJyZ2Jjc3NcIjpyZXR1cm5cInJnYihcIitlWzBdK1wiLCBcIitlWzFdK1wiLCBcIitlWzJdK1wiKVwiO2Nhc2VcInJnYmNzczRcIjpyZXR1cm5cInJnYihcIitlWzBdK1wiLCBcIitlWzFdK1wiLCBcIitlWzJdK1wiLCBcIitlWzNdK1wiKVwiO2Nhc2VcInJnYmFcIjpyZXR1cm4gZTtjYXNlXCJyZ2JhY3NzXCI6cmV0dXJuXCJyZ2JhKFwiK2VbMF0rXCIsIFwiK2VbMV0rXCIsIFwiK2VbMl0rXCIsIFwiK2VbM10rXCIpXCI7Y2FzZVwiaHNsXCI6cmV0dXJuIGguYXBwbHkodm9pZCAwLG4oZSkpO2Nhc2VcImhzbGNzc1wiOnJldHVyblwiaHNsKFwiKyhlPWguYXBwbHkodm9pZCAwLG4oZSkpKVswXStcIiwgXCIrZVsxXStcIiwgXCIrZVsyXStcIilcIjtjYXNlXCJoc2xjc3M0XCI6dmFyIHI9aC5hcHBseSh2b2lkIDAsbihlKSk7cmV0dXJuXCJoc2woXCIrclswXStcIiwgXCIrclsxXStcIiwgXCIrclsyXStcIiwgXCIrZVszXStcIilcIjtjYXNlXCJoc2xhXCI6cmV0dXJuW10uY29uY2F0KG4oaC5hcHBseSh2b2lkIDAsbihlKSkpLFtlWzNdXSk7Y2FzZVwiaHNsYWNzc1wiOnZhciBpPWguYXBwbHkodm9pZCAwLG4oZSkpO3JldHVyblwiaHNsYShcIitpWzBdK1wiLCBcIitpWzFdK1wiLCBcIitpWzJdK1wiLCBcIitlWzNdK1wiKVwiO2Nhc2VcImhleFwiOnJldHVybiBjLmFwcGx5KHZvaWQgMCxuKGUpKTtjYXNlXCJoZXhjc3M0XCI6cmV0dXJuIGMuYXBwbHkodm9pZCAwLG4oZSkpKyhcIjAwXCIrcGFyc2VJbnQoMjU1KmVbM10pLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO2Nhc2VcImludFwiOnJldHVybiBwLmFwcGx5KHZvaWQgMCxuKGUpKX19dC5DT0xPUl9OQU1FUz1zLHQuUEFMRVRURV9NQVRFUklBTF81MDA9W1wiI0Y0NDMzNlwiLFwiI0U5MUU2M1wiLFwiI0U5MUU2M1wiLFwiIzlDMjdCMFwiLFwiIzlDMjdCMFwiLFwiIzY3M0FCN1wiLFwiIzY3M0FCN1wiLFwiIzNGNTFCNVwiLFwiIzNGNTFCNVwiLFwiIzIxOTZGM1wiLFwiIzIxOTZGM1wiLFwiIzAzQTlGNFwiLFwiIzAzQTlGNFwiLFwiIzAwQkNENFwiLFwiIzAwQkNENFwiLFwiIzAwOTY4OFwiLFwiIzAwOTY4OFwiLFwiIzRDQUY1MFwiLFwiIzRDQUY1MFwiLFwiIzhCQzM0QVwiLFwiIzhCQzM0QVwiLFwiI0NEREMzOVwiLFwiI0NEREMzOVwiLFwiI0ZGRUIzQlwiLFwiI0ZGRUIzQlwiLFwiI0ZGQzEwN1wiLFwiI0ZGQzEwN1wiLFwiI0ZGOTgwMFwiLFwiI0ZGOTgwMFwiLFwiI0ZGNTcyMlwiLFwiI0ZGNTcyMlwiLFwiIzc5NTU0OFwiLFwiIzc5NTU0OFwiLFwiIzlFOUU5RVwiLFwiIzlFOUU5RVwiLFwiIzYwN0Q4QlwiLFwiIzYwN0Q4QlwiXSx0LlBBTEVUVEVfTUFURVJJQUxfQ0hST01FPVtcIiNmNDQzMzZcIixcIiNlOTFlNjNcIixcIiM5YzI3YjBcIixcIiM2NzNhYjdcIixcIiMzZjUxYjVcIixcIiMyMTk2ZjNcIixcIiMwM2E5ZjRcIixcIiMwMGJjZDRcIixcIiMwMDk2ODhcIixcIiM0Y2FmNTBcIixcIiM4YmMzNGFcIixcIiNjZGRjMzlcIixcIiNmZmViM2JcIixcIiNmZmMxMDdcIixcIiNmZjk4MDBcIixcIiNmZjU3MjJcIixcIiM3OTU1NDhcIixcIiM5ZTllOWVcIixcIiM2MDdkOGJcIl0sdC5yZ2JUb0hleD1jLHQuaHNsVG9SZ2I9dSx0LnJnYlRvSHNsPWgsdC5yZ2JUb0hzdj1mdW5jdGlvbihlLHQscil7dmFyIGk9W2EoZSwwLDI1NSkvMjU1LGEodCwwLDI1NSkvMjU1LGEociwwLDI1NSkvMjU1XTtlPWlbMF0sdD1pWzFdLHI9aVsyXTt2YXIgbyxuPU1hdGgubWF4KGUsdCxyKSxzPU1hdGgubWluKGUsdCxyKSxsPXZvaWQgMCxjPW4sdT1uLXM7aWYobz0wPT09bj8wOnUvbixuPT1zKWw9MDtlbHNle3N3aXRjaChuKXtjYXNlIGU6bD0odC1yKS91Kyh0PHI/NjowKTticmVhaztjYXNlIHQ6bD0oci1lKS91KzI7YnJlYWs7Y2FzZSByOmw9KGUtdCkvdSs0fWwvPTZ9cmV0dXJuW2wsbyxjXX0sdC5yZ2JUb0ludD1wLHQuaW50VG9SZ2I9ZnVuY3Rpb24oZSl7cmV0dXJuW2U+PjE2JjI1NSxlPj44JjI1NSwyNTUmZV19LHQuY3NzQ29sb3JUb1JnYj1kLHQuY3NzQ29sb3JUb1JnYmE9Zix0LmNzc1JnYlRvUmdiPWcsdC5jc3NSZ2JhVG9SZ2JhPWIsdC5wYXJzZUNvbG9yVG9SZ2I9ZnVuY3Rpb24oZSl7cmV0dXJuIEFycmF5LmlzQXJyYXkoZSk/ZT1bYShlWzBdLDAsMjU1KSxhKGVbMV0sMCwyNTUpLGEoZVsyXSwwLDI1NSldOmQoZSl8fGcoZSl9LHQucGFyc2VDb2xvclRvUmdiYT12LHQuY3NzSHNsVG9Ic2w9bSx0LmNzc0hzbGFUb0hzbGE9QSx0LnBhcnNlQ29sb3JUb0hzbD1mdW5jdGlvbihlKXtyZXR1cm4gQXJyYXkuaXNBcnJheShlKT9lPVthKGVbMF0sMCwzNjApLGEoZVsxXSwwLDEwMCksYShlWzJdLDAsMTAwKV06bShlKX0sdC5wYXJzZUNvbG9yVG9Ic2xhPXksdC5wYXJzZUNvbG9yPWZ1bmN0aW9uKGUsdCl7aWYodD10fHxcInJnYlwiLG51bGwhPWUpe3ZhciByPXZvaWQgMDtpZigocj12KGUpKXx8KHI9eShlKSkmJihyPVtdLmNvbmNhdChuKHUuYXBwbHkodm9pZCAwLG4ocikpKSxbclszXV0pKSlyZXR1cm4oMCxvLmRlZmF1bHQpKHQpP1tcInJnYlwiLFwicmdiY3NzXCIsXCJyZ2Jjc3M0XCIsXCJyZ2JhXCIsXCJyZ2JhY3NzXCIsXCJoc2xcIixcImhzbGNzc1wiLFwiaHNsY3NzNFwiLFwiaHNsYVwiLFwiaHNsYWNzc1wiLFwiaGV4XCIsXCJoZXhjc3M0XCIsXCJpbnRcIl0ucmVkdWNlKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGVbdF09ayhyLHQpLGV9LHR8fHt9KTprKHIsdC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpfX0sdC5nZXRMdW1pbmFuY2U9ZnVuY3Rpb24oZSx0LHIpe3JldHVybi4yMTI2KihlPShlLz0yNTUpPC4wMzkyOD9lLzEyLjkyOk1hdGgucG93KChlKy4wNTUpLzEuMDU1LDIuNCkpKy43MTUyKih0PSh0Lz0yNTUpPC4wMzkyOD90LzEyLjkyOk1hdGgucG93KCh0Ky4wNTUpLzEuMDU1LDIuNCkpKy4wNzIyKigoci89MjU1KTwuMDM5Mjg/ci8xMi45MjpNYXRoLnBvdygocisuMDU1KS8xLjA1NSwyLjQpKX0sdC5saW1pdD1hLHQuZW5zdXJlQXJyYXk9ZnVuY3Rpb24oZSl7cmV0dXJuIGU/QXJyYXkuZnJvbShlKTpbXX0sdC5udmw9bH0sZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO1xuLyohXG4gKiBpc29iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXNvYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovZS5leHBvcnRzPWZ1bmN0aW9uKGUpe3JldHVybiBudWxsIT1lJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmITE9PT1BcnJheS5pc0FycmF5KGUpfX0sZnVuY3Rpb24oZSx0KXtlLmV4cG9ydHM9JzxkaXYgY2xhc3M9XCJhLWNvbG9yLXBpY2tlci1yb3cgYS1jb2xvci1waWNrZXItc3RhY2sgYS1jb2xvci1waWNrZXItcm93LXRvcFwiPiA8Y2FudmFzIGNsYXNzPVwiYS1jb2xvci1waWNrZXItc2wgYS1jb2xvci1waWNrZXItdHJhbnNwYXJlbnRcIj48L2NhbnZhcz4gPGRpdiBjbGFzcz1hLWNvbG9yLXBpY2tlci1kb3Q+PC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPWEtY29sb3ItcGlja2VyLXJvdz4gPGRpdiBjbGFzcz1cImEtY29sb3ItcGlja2VyLXN0YWNrIGEtY29sb3ItcGlja2VyLXRyYW5zcGFyZW50IGEtY29sb3ItcGlja2VyLWNpcmNsZVwiPiA8ZGl2IGNsYXNzPWEtY29sb3ItcGlja2VyLXByZXZpZXc+IDxpbnB1dCBjbGFzcz1hLWNvbG9yLXBpY2tlci1jbGlwYmFvcmQgdHlwZT10ZXh0PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9YS1jb2xvci1waWNrZXItY29sdW1uPiA8ZGl2IGNsYXNzPVwiYS1jb2xvci1waWNrZXItY2VsbCBhLWNvbG9yLXBpY2tlci1zdGFja1wiPiA8Y2FudmFzIGNsYXNzPWEtY29sb3ItcGlja2VyLWg+PC9jYW52YXM+IDxkaXYgY2xhc3M9YS1jb2xvci1waWNrZXItZG90PjwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImEtY29sb3ItcGlja2VyLWNlbGwgYS1jb2xvci1waWNrZXItYWxwaGEgYS1jb2xvci1waWNrZXItc3RhY2tcIiBzaG93LW9uLWFscGhhPiA8Y2FudmFzIGNsYXNzPVwiYS1jb2xvci1waWNrZXItYSBhLWNvbG9yLXBpY2tlci10cmFuc3BhcmVudFwiPjwvY2FudmFzPiA8ZGl2IGNsYXNzPWEtY29sb3ItcGlja2VyLWRvdD48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImEtY29sb3ItcGlja2VyLXJvdyBhLWNvbG9yLXBpY2tlci1oc2xcIiBzaG93LW9uLWhzbD4gPGxhYmVsPkg8L2xhYmVsPiA8aW5wdXQgbmFtZXJlZj1IIHR5cGU9bnVtYmVyIG1heGxlbmd0aD0zIG1pbj0wIG1heD0zNjAgdmFsdWU9MD4gPGxhYmVsPlM8L2xhYmVsPiA8aW5wdXQgbmFtZXJlZj1TIHR5cGU9bnVtYmVyIG1heGxlbmd0aD0zIG1pbj0wIG1heD0xMDAgdmFsdWU9MD4gPGxhYmVsPkw8L2xhYmVsPiA8aW5wdXQgbmFtZXJlZj1MIHR5cGU9bnVtYmVyIG1heGxlbmd0aD0zIG1pbj0wIG1heD0xMDAgdmFsdWU9MD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJhLWNvbG9yLXBpY2tlci1yb3cgYS1jb2xvci1waWNrZXItcmdiXCIgc2hvdy1vbi1yZ2I+IDxsYWJlbD5SPC9sYWJlbD4gPGlucHV0IG5hbWVyZWY9UiB0eXBlPW51bWJlciBtYXhsZW5ndGg9MyBtaW49MCBtYXg9MjU1IHZhbHVlPTA+IDxsYWJlbD5HPC9sYWJlbD4gPGlucHV0IG5hbWVyZWY9RyB0eXBlPW51bWJlciBtYXhsZW5ndGg9MyBtaW49MCBtYXg9MjU1IHZhbHVlPTA+IDxsYWJlbD5CPC9sYWJlbD4gPGlucHV0IG5hbWVyZWY9QiB0eXBlPW51bWJlciBtYXhsZW5ndGg9MyBtaW49MCBtYXg9MjU1IHZhbHVlPTA+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiYS1jb2xvci1waWNrZXItcm93IGEtY29sb3ItcGlja2VyLXJnYmhleCBhLWNvbG9yLXBpY2tlci1zaW5nbGUtaW5wdXRcIiBzaG93LW9uLXNpbmdsZS1pbnB1dD4gPGxhYmVsPkhFWDwvbGFiZWw+IDxpbnB1dCBuYW1lcmVmPVJHQkhFWCB0eXBlPXRleHQgc2VsZWN0LW9uLWZvY3VzPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImEtY29sb3ItcGlja2VyLXJvdyBhLWNvbG9yLXBpY2tlci1wYWxldHRlXCI+PC9kaXY+J30sZnVuY3Rpb24oZSx0LHIpe3ZhciBpPXIoNik7ZS5leHBvcnRzPVwic3RyaW5nXCI9PXR5cGVvZiBpP2k6aS50b1N0cmluZygpfSxmdW5jdGlvbihlLHQscil7KGUuZXhwb3J0cz1yKDcpKCExKSkucHVzaChbZS5pLFwiLyohXFxuICogYS1jb2xvci1waWNrZXJcXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbmFyc2VuaWNvL2EtY29sb3ItcGlja2VyXFxuICpcXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCwgR2lhbmZyYW5jbyBDYWxkaS5cXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXFxuICovLmEtY29sb3ItcGlja2Vye2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nOjA7ZGlzcGxheTppbmxpbmUtZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47dXNlci1zZWxlY3Q6bm9uZTt3aWR0aDoyMzJweDtmb250OjQwMCAxMHB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2JvcmRlci1yYWRpdXM6M3B4O2JveC1zaGFkb3c6MCAwIDAgMXB4IHJnYmEoMCwwLDAsLjA1KSwwIDJweCA0cHggcmdiYSgwLDAsMCwuMjUpfS5hLWNvbG9yLXBpY2tlciwuYS1jb2xvci1waWNrZXItcm93LC5hLWNvbG9yLXBpY2tlciBpbnB1dHtib3gtc2l6aW5nOmJvcmRlci1ib3h9LmEtY29sb3ItcGlja2VyLXJvd3twYWRkaW5nOjE1cHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOnJvdzthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47dXNlci1zZWxlY3Q6bm9uZX0uYS1jb2xvci1waWNrZXItcm93LXRvcHtwYWRkaW5nOjB9LmEtY29sb3ItcGlja2VyLXJvdzpub3QoOmZpcnN0LWNoaWxkKXtib3JkZXItdG9wOjFweCBzb2xpZCAjZjVmNWY1fS5hLWNvbG9yLXBpY2tlci1jb2x1bW57ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbn0uYS1jb2xvci1waWNrZXItY2VsbHtmbGV4OjEgMSBhdXRvO21hcmdpbi1ib3R0b206NHB4fS5hLWNvbG9yLXBpY2tlci1jZWxsOmxhc3QtY2hpbGR7bWFyZ2luLWJvdHRvbTowfS5hLWNvbG9yLXBpY2tlci1zdGFja3twb3NpdGlvbjpyZWxhdGl2ZX0uYS1jb2xvci1waWNrZXItZG90e3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjE0cHg7aGVpZ2h0OjE0cHg7dG9wOjA7bGVmdDowO2JhY2tncm91bmQ6I2ZmZjtwb2ludGVyLWV2ZW50czpub25lO2JvcmRlci1yYWRpdXM6NTBweDt6LWluZGV4OjEwMDA7Ym94LXNoYWRvdzowIDFweCAycHggcmdiYSgwLDAsMCwuNzUpfS5hLWNvbG9yLXBpY2tlci1hLC5hLWNvbG9yLXBpY2tlci1oLC5hLWNvbG9yLXBpY2tlci1zbHtjdXJzb3I6Y2VsbH0uYS1jb2xvci1waWNrZXItYSsuYS1jb2xvci1waWNrZXItZG90LC5hLWNvbG9yLXBpY2tlci1oKy5hLWNvbG9yLXBpY2tlci1kb3R7dG9wOi0ycHh9LmEtY29sb3ItcGlja2VyLWEsLmEtY29sb3ItcGlja2VyLWh7Ym9yZGVyLXJhZGl1czoycHh9LmEtY29sb3ItcGlja2VyLXByZXZpZXd7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHg7dXNlci1zZWxlY3Q6bm9uZTtib3JkZXItcmFkaXVzOjE1cHh9LmEtY29sb3ItcGlja2VyLWNpcmNsZXtib3JkZXItcmFkaXVzOjUwcHg7Ym9yZGVyOjFweCBzb2xpZCAjZWVlfS5hLWNvbG9yLXBpY2tlci1oc2wsLmEtY29sb3ItcGlja2VyLXJnYiwuYS1jb2xvci1waWNrZXItc2luZ2xlLWlucHV0e2p1c3RpZnktY29udGVudDpzcGFjZS1ldmVubHl9LmEtY29sb3ItcGlja2VyLWhzbD5sYWJlbCwuYS1jb2xvci1waWNrZXItcmdiPmxhYmVsLC5hLWNvbG9yLXBpY2tlci1zaW5nbGUtaW5wdXQ+bGFiZWx7cGFkZGluZzowIDhweDtmbGV4OjAgMCBhdXRvO2NvbG9yOiM5Njk2OTZ9LmEtY29sb3ItcGlja2VyLWhzbD5pbnB1dCwuYS1jb2xvci1waWNrZXItcmdiPmlucHV0LC5hLWNvbG9yLXBpY2tlci1zaW5nbGUtaW5wdXQ+aW5wdXR7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoycHggMDt3aWR0aDowO2ZsZXg6MSAxIGF1dG87Ym9yZGVyOjFweCBzb2xpZCAjZTBlMGUwO2xpbmUtaGVpZ2h0OjIwcHh9LmEtY29sb3ItcGlja2VyLWhzbD5pbnB1dDo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbiwuYS1jb2xvci1waWNrZXItcmdiPmlucHV0Ojotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLC5hLWNvbG9yLXBpY2tlci1zaW5nbGUtaW5wdXQ+aW5wdXQ6Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b257LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7bWFyZ2luOjB9LmEtY29sb3ItcGlja2VyLWhzbD5pbnB1dDpmb2N1cywuYS1jb2xvci1waWNrZXItcmdiPmlucHV0OmZvY3VzLC5hLWNvbG9yLXBpY2tlci1zaW5nbGUtaW5wdXQ+aW5wdXQ6Zm9jdXN7Ym9yZGVyLWNvbG9yOiMwNGE5ZjQ7b3V0bGluZTpub25lfS5hLWNvbG9yLXBpY2tlci10cmFuc3BhcmVudHtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCgtNDVkZWcsI2NkY2RjZCAyNSUsdHJhbnNwYXJlbnQgMCksbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCNjZGNkY2QgMjUlLHRyYW5zcGFyZW50IDApLGxpbmVhci1ncmFkaWVudCgtNDVkZWcsdHJhbnNwYXJlbnQgNzUlLCNjZGNkY2QgMCksbGluZWFyLWdyYWRpZW50KDQ1ZGVnLHRyYW5zcGFyZW50IDc1JSwjY2RjZGNkIDApO2JhY2tncm91bmQtc2l6ZToxMXB4IDExcHg7YmFja2dyb3VuZC1wb3NpdGlvbjowIDAsMCAtNS41cHgsLTUuNXB4IDUuNXB4LDUuNXB4IDB9LmEtY29sb3ItcGlja2VyLXNse2JvcmRlci1yYWRpdXM6M3B4IDNweCAwIDB9LmEtY29sb3ItcGlja2VyLmhpZGUtYWxwaGEgW3Nob3ctb24tYWxwaGFdLC5hLWNvbG9yLXBpY2tlci5oaWRlLWhzbCBbc2hvdy1vbi1oc2xdLC5hLWNvbG9yLXBpY2tlci5oaWRlLXJnYiBbc2hvdy1vbi1yZ2JdLC5hLWNvbG9yLXBpY2tlci5oaWRlLXNpbmdsZS1pbnB1dCBbc2hvdy1vbi1zaW5nbGUtaW5wdXRde2Rpc3BsYXk6bm9uZX0uYS1jb2xvci1waWNrZXItY2xpcGJhb3Jke3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7b3BhY2l0eTowO2N1cnNvcjpwb2ludGVyfS5hLWNvbG9yLXBpY2tlci1wYWxldHRle2ZsZXgtZmxvdzp3cmFwO2ZsZXgtZGlyZWN0aW9uOnJvdztqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDtwYWRkaW5nOjEwcHh9LmEtY29sb3ItcGlja2VyLXBhbGV0dGUtY29sb3J7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDtmbGV4OjAgMSAxNXB4O21hcmdpbjozcHg7Ym94LXNpemluZzpib3JkZXItYm94O2N1cnNvcjpwb2ludGVyO2JvcmRlci1yYWRpdXM6M3B4O2JveC1zaGFkb3c6aW5zZXQgMCAwIDAgMXB4IHJnYmEoMCwwLDAsLjEpfS5hLWNvbG9yLXBpY2tlci1wYWxldHRlLWFkZHt0ZXh0LWFsaWduOmNlbnRlcjtsaW5lLWhlaWdodDoxM3B4O2NvbG9yOiM2MDdkOGJ9LmEtY29sb3ItcGlja2VyLmhpZGRlbntkaXNwbGF5Om5vbmV9XCIsXCJcIl0pfSxmdW5jdGlvbihlLHQpe2UuZXhwb3J0cz1mdW5jdGlvbihlKXt2YXIgdD1bXTtyZXR1cm4gdC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcChmdW5jdGlvbih0KXt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciByPWVbMV18fFwiXCIsaT1lWzNdO2lmKCFpKXJldHVybiByO2lmKHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGJ0b2Epe3ZhciBvPWZ1bmN0aW9uKGUpe3JldHVyblwiLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiK2J0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGUpKSkpK1wiICovXCJ9KGkpLG49aS5zb3VyY2VzLm1hcChmdW5jdGlvbihlKXtyZXR1cm5cIi8qIyBzb3VyY2VVUkw9XCIraS5zb3VyY2VSb290K2UrXCIgKi9cIn0pO3JldHVybltyXS5jb25jYXQobikuY29uY2F0KFtvXSkuam9pbihcIlxcblwiKX1yZXR1cm5bcl0uam9pbihcIlxcblwiKX0odCxlKTtyZXR1cm4gdFsyXT9cIkBtZWRpYSBcIit0WzJdK1wie1wiK3IrXCJ9XCI6cn0pLmpvaW4oXCJcIil9LHQuaT1mdW5jdGlvbihlLHIpe1wic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1bW251bGwsZSxcIlwiXV0pO2Zvcih2YXIgaT17fSxvPTA7bzx0aGlzLmxlbmd0aDtvKyspe3ZhciBuPXRoaXNbb11bMF07XCJudW1iZXJcIj09dHlwZW9mIG4mJihpW25dPSEwKX1mb3Iobz0wO288ZS5sZW5ndGg7bysrKXt2YXIgcz1lW29dO1wibnVtYmVyXCI9PXR5cGVvZiBzWzBdJiZpW3NbMF1dfHwociYmIXNbMl0/c1syXT1yOnImJihzWzJdPVwiKFwiK3NbMl0rXCIpIGFuZCAoXCIrcitcIilcIiksdC5wdXNoKHMpKX19LHR9fV0pfSk7IiwgImltcG9ydCAqIGFzIEFDb2xvclBpY2tlciBmcm9tIFwiYS1jb2xvci1waWNrZXJcIjtcbmltcG9ydCB7IFBlbkFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb24vUGVuQWN0aW9uXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuLi91L3VcIjtcblxuZXhwb3J0IGNsYXNzIENvbG9yRWxlbWVudCB7XG4gICAgcHJpdmF0ZSBlbGU6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgcGVuOiBQZW5BY3Rpb25cblxuXG4gICAgcHVibGljIGluaXQocGVuOiBQZW5BY3Rpb24sIGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wZW4gPSBwZW47XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZW4tY29sb3JcIik7XG4gICAgICAgIEFDb2xvclBpY2tlci5mcm9tKFwiZGl2I3Blbi1jb2xvclwiLCB7XG4gICAgICAgICAgICBcImNvbG9yXCI6IGNvbG9yXG4gICAgICAgIH0pWzBdXG4gICAgICAgIC5vbihcImNoYW5nZVwiLCAocGlja2VyOiBhbnksIGNvbG9yOiBzdHJpbmcpID0+IHRoaXMuY2hhbmdlZChwaWNrZXIsIGNvbG9yKSk7XG4gICAgfVxuICAgIHB1YmxpYyBjaGFuZ2VkKHBpY2tlcjogYW55LCBjb2xvcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucGVuLm9wdC5jb2xvciA9IFUudG9SZ2JIZXgoY29sb3IpO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgRHJhd01pbmUgfSBmcm9tIFwiLi4vZGF0YS9EcmF3TWluZVwiO1xuaW1wb3J0ICogYXMgVSBmcm9tIFwiLi4vdS91XCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhY2tFbGVtZW50IHtcbiAgICBwcml2YXRlIGVsZTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBkcmF3OiBEcmF3TWluZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FjdC1iYWNrXCIpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgICAgICB0aGlzLmVsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gdGhpcy5wcm9jKCkpO1xuICAgIH1cbiAgICBwdWJsaWMgaW5pdChkcmF3OiBEcmF3TWluZSkge1xuICAgICAgICB0aGlzLmRyYXcgPSBkcmF3O1xuICAgIH1cbiAgICBwcml2YXRlIGFzeW5jIHByb2MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghdGhpcy5kcmF3LmlzU2F2ZWQoKSkge1xuICAgICAgICAgICAgaWYgKGF3YWl0IFUudG9hc3QuY29uZmlybShcIlx1NEZERFx1NUI1OFx1MzA1N1x1MzA3RVx1MzA1OVx1MzA0Qlx1RkYxRlwiLCBcIlx1NEZERFx1NUI1OFx1MzA1N1x1MzA2Nlx1NjIzQlx1MzA4QlwiLCBcIlx1NzgzNFx1NjhDNFx1MzA1N1x1MzA2Nlx1NjIzQlx1MzA4QlwiKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZHJhdy5zYXZlKCk7XG4gICAgICAgICAgICAgICAgVS5wZChcIm9rXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBVLnBkKFwiY2FuY2VsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVS5wZChcIm5vIGNvbnRlbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNWVRPRE8gXHU5MEU4XHU1QzRCXHU3QjQ5XHUzMDZFXHU5NThCXHU3NjdBXHU1RjhDXHUzMDZCXHU4OThCXHU3NkY0XHUzMDU3XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvXCI7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IFBvaW50fSBmcm9tIFwiLi9kYXRhL0RyYXdcIjtcbmltcG9ydCB7IERldmljZSB9IGZyb20gXCIuL3UvdHlwZXNcIjtcbmltcG9ydCB7IFBhcGVyRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvUGFwZXJFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3TWluZSB9IGZyb20gXCIuL2RhdGEvRHJhd01pbmVcIjtcbmltcG9ydCB7IERyYXdPdGhlciB9IGZyb20gXCIuL2RhdGEvRHJhd090aGVyXCI7XG5pbXBvcnQgKiBhcyBVIGZyb20gXCIuL3UvdVwiO1xuaW1wb3J0IHsgTW91c2VTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvTW91c2VTZW5zb3JcIjtcbmltcG9ydCB7IFBvaW50ZXJTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvUG9pbnRlclNlbnNvclwiO1xuaW1wb3J0IHsgVG91Y2hTZW5zb3IgfSBmcm9tIFwiLi9zZW5zb3IvVG91Y2hTZW5zb3JcIjtcbmltcG9ydCB7IFNhdmVFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9TYXZlRWxlbWVudFwiO1xuaW1wb3J0IHsgTG9hZEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvbi9Mb2FkQWN0aW9uXCI7XG5pbXBvcnQgeyBEcmF3Y2FudmFzZXNFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9EcmF3Y2FudmFzZXNFbGVtZW50XCI7XG5pbXBvcnQgeyBEcmF3U3RhdHVzIH0gZnJvbSBcIi4vZGF0YS9EcmF3U3RhdHVzXCI7XG5pbXBvcnQgeyBMb25ncHJlc3NTdGF0dXMgfSBmcm9tIFwiLi9kYXRhL0xvbmdwcmVzc1N0YXR1c1wiO1xuaW1wb3J0IHsgUGVuQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uL1BlbkFjdGlvblwiO1xuaW1wb3J0IHsgVW5kb0VsZW1lbnQgfSBmcm9tIFwiLi9lbGVtZW50L1VuZG9FbGVtZW50XCI7XG5pbXBvcnQgeyBab29tU2Nyb2xsQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uL1pvb21TY3JvbGxBY3Rpb25cIjtcbmltcG9ydCB7IFpvb21FbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9ab29tRWxlbWVudFwiO1xuaW1wb3J0IHsgRXJhc2VyRWxlbWVudCB9IGZyb20gXCIuL2VsZW1lbnQvRXJhc2VyRWxlbWVudFwiO1xuaW1wb3J0IHsgQ29sb3JFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9Db2xvckVsZW1lbnRcIjtcbmltcG9ydCB7IEJhY2tFbGVtZW50IH0gZnJvbSBcIi4vZWxlbWVudC9CYWNrRWxlbWVudFwiO1xuXG5leHBvcnQgY2xhc3MgRHJhd0V2ZW50SGFuZGxlciB7XG4gICAgcHJpdmF0ZSBwYXBlcl9pZDogbnVtYmVyO1xuICAgIHByaXZhdGUgbm93c2Vuc29yOiBEZXZpY2U7IC8vIFx1MzBCRlx1MzBDM1x1MzBDMVx1MzAwMVx1MzBERFx1MzBBNFx1MzBGM1x1MzBCRlx1N0I0OVx1MzAwMVx1MzA3RVx1MzA2OFx1MzA4MVx1MzA2Nlx1ODkwN1x1NjU3MFx1MzA2RVx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1MzA5Mlx1NjkxQ1x1NzdFNVx1MzA1N1x1MzA1Rlx1NTgzNFx1NTQwOFx1MzA2Qlx1NTA5OVx1MzA0OFx1MzA2Nlx1MzAwMlxuICAgIHByaXZhdGUgc3RhdHVzID0ge1xuICAgICAgICBkcmF3OiBuZXcgRHJhd1N0YXR1cygpLFxuICAgICAgICBsb25ncHJlc3M6IG5ldyBMb25ncHJlc3NTdGF0dXMoKVxuICAgIH07XG4gICAgcHJpdmF0ZSBlbGVtZW50ID0ge1xuICAgICAgICB3cmFwZGl2OiBuZXcgRHJhd2NhbnZhc2VzRWxlbWVudCgpLFxuICAgICAgICB6b29tc2Nyb2xsOiBuZXcgWm9vbUVsZW1lbnQoKSxcbiAgICAgICAgc2F2ZTogbmV3IFNhdmVFbGVtZW50KCksXG4gICAgICAgIGVyYXNlcjogbmV3IEVyYXNlckVsZW1lbnQoKSxcbiAgICAgICAgY29sb3I6IG5ldyBDb2xvckVsZW1lbnQoKSxcbiAgICAgICAgdW5kbzogbmV3IFVuZG9FbGVtZW50KCksXG4gICAgICAgIGJhY2s6IG5ldyBCYWNrRWxlbWVudCgpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBhY3Rpb24gPSB7XG4gICAgICAgIGxvYWQ6IG5ldyBMb2FkQWN0aW9uKCksXG4gICAgICAgIHpvb21zY3JvbGw6IG5ldyBab29tU2Nyb2xsQWN0aW9uKCksXG4gICAgfTtcblxuICAgIHByaXZhdGUgbWluZSA9IHtcbiAgICAgICAgcGFwZXI6IFBhcGVyRWxlbWVudC5tYWtlTWluZSgpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd01pbmUoKSxcbiAgICAgICAgcGVuOiBuZXcgUGVuQWN0aW9uKCksXG4gICAgfTtcbiAgICBwcml2YXRlIG90aGVyID0ge1xuICAgICAgICBwYXBlcjogUGFwZXJFbGVtZW50Lm1ha2VPdGhlcigpLFxuICAgICAgICBkcmF3OiBuZXcgRHJhd090aGVyKCksXG4gICAgICAgIHBlbjogbmV3IFBlbkFjdGlvbigpLFxuICAgIH07XG4gICAgcHJpdmF0ZSBkZXZpY2UgPSB7XG4gICAgICAgIG1vdXNlOiBuZXcgTW91c2VTZW5zb3IoKSxcbiAgICAgICAgcG9pbnRlcjogbmV3IFBvaW50ZXJTZW5zb3IoKSxcbiAgICAgICAgdG91Y2g6IG5ldyBUb3VjaFNlbnNvcigpLFxuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMubm93c2Vuc29yID0gbnVsbDtcblxuICAgICAgICBjb25zdCBzZCA9IHRoaXMubG9hZFNlcnZlckRhdGEoKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBzZFtcIiNzZC1jb2xvclwiXTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuem9vbXNjcm9sbC5pbml0KHRoaXMuYWN0aW9uLnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc2F2ZS5pbml0KHRoaXMubWluZS5kcmF3KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNvbG9yLmluaXQodGhpcy5taW5lLnBlbiwgY29sb3IpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZXJhc2VyLmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC51bmRvLmluaXQodGhpcy5taW5lLnBhcGVyLCB0aGlzLm1pbmUuZHJhdywgdGhpcy5taW5lLnBlbik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5iYWNrLmluaXQodGhpcy5taW5lLmRyYXcpO1xuXG4gICAgICAgIHRoaXMuZGV2aWNlLm1vdXNlLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgdGhpcy5kZXZpY2UucG9pbnRlci5pbml0KHRoaXMsIHRoaXMubWluZS5wYXBlcik7XG4gICAgICAgIHRoaXMuZGV2aWNlLnRvdWNoLmluaXQodGhpcywgdGhpcy5taW5lLnBhcGVyLCB0aGlzLmFjdGlvbi56b29tc2Nyb2xsKTtcblxuICAgICAgICB0aGlzLmFjdGlvbi5sb2FkLmluaXQodGhpcy5vdGhlci5wYXBlciwgdGhpcy5vdGhlci5kcmF3LCB0aGlzLm90aGVyLnBlbik7XG4gICAgICAgIHRoaXMuYWN0aW9uLnpvb21zY3JvbGwuaW5pdCh0aGlzLmVsZW1lbnQud3JhcGRpdiwgdGhpcy5lbGVtZW50Lnpvb21zY3JvbGwpO1xuICAgICAgICB0aGlzLm1pbmUucGVuLmluaXQoY29sb3IpO1xuXG4gICAgICAgIHRoaXMubWluZS5kcmF3LmluaXQodGhpcy5taW5lLnBlbik7XG4gICAgfVxuICAgIHByaXZhdGUgbG9hZFNlcnZlckRhdGEoKTogYW55W10ge1xuICAgICAgICBjb25zdCBpZHM6IHN0cmluZ1tdID0gW1xuICAgICAgICAgICAgXCIjc2QtY29sb3JcIlxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXQgPSBbXTtcbiAgICAgICAgZm9yKGNvbnN0IGlkIG9mIGlkcykge1xuICAgICAgICAgICAgcmV0W2lkXSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpLmlubmVySFRNTDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBkb3duKGRldjogRGV2aWNlLCBlOiBFdmVudCwgcDogUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBwLng7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcbiAgICAgICAgVS5wZChgJHtkZXZ9LWRvd24oJHt4fSwke3l9KT0ke3RoaXMubm93c2Vuc29yfWApO1xuXG4gICAgICAgIHRoaXMubm93c2Vuc29yID0gZGV2O1xuICAgICAgICB0aGlzLnN0YXR1cy5kcmF3LnN0YXJ0U3Ryb2tlKCk7XG4gICAgICAgIHRoaXMuc3RhdHVzLmxvbmdwcmVzcy5zdGFydCh0aGlzLmVsZW1lbnQud3JhcGRpdiwgeCwgeSwgdGhpcy5hY3Rpb24uem9vbXNjcm9sbCk7IC8vIFx1OTU3N1x1NjJCQ1x1MzA1N1x1OTU4Qlx1NTlDQlx1NTczMFx1NzBCOVxuICAgIH1cblxuICAgIHB1YmxpYyBtb3ZlKGRldjogRGV2aWNlLCBlOiBFdmVudCwgcDogUG9pbnQpOiB2b2lkIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSBwLng7XG4gICAgICAgIGNvbnN0IHk6IG51bWJlciA9IHAueTtcbiAgICAgICAgVS5wZChgJHtkZXZ9LW1vdmUoJHt4fSwke3l9KT0ke3RoaXMubm93c2Vuc29yfWApO1xuXG4gICAgICAgIC8vIFx1NzEyMVx1ODk5Nlx1MzA1OVx1MzA4Qlx1Njc2MVx1NEVGNlxuICAgICAgICBpZiAodGhpcy5ub3dzZW5zb3IgPT09IG51bGwgLy8gXHUzMEM3XHUzMEQwXHUzMEE0XHUzMEI5XHU2NzJBXHU2QzdBXHU1QjlBXHUzMDZBXHUzMDZFXHUzMDY3XHU0RjU1XHUzMDgyXHUzMDU3XHUzMDZBXHUzMDQ0XG4gICAgICAgICAgICB8fCB0aGlzLm5vd3NlbnNvciAhPT0gZGV2IC8vIFx1OTA1NVx1MzA0Nlx1MzBDN1x1MzBEMFx1MzBBNFx1MzBCOVx1MzA2RVx1MzBBNFx1MzBEOVx1MzBGM1x1MzBDOFx1MzA2QVx1MzA2RVx1MzA2N1x1NzEyMVx1ODk5NlxuICAgICAgICAgICAgfHwgdGhpcy5zdGF0dXMubG9uZ3ByZXNzLmlzU2FtZVBvaW50KHgsIHkpIC8vIFx1NTJENVx1MzA0NFx1MzA2Nlx1MzA0NFx1MzA2QVx1MzA0NFx1MzA2RVx1MzA2N1x1NEY1NVx1MzA4Mlx1MzA1N1x1MzA2QVx1MzA0NFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzLmxvbmdwcmVzcy5pc1N0YXJ0KCkpIHtcbiAgICAgICAgICAgIC8vIFx1OTU3N1x1NjJCQ1x1MzA1N1x1NjY0Mlx1OTU5M1x1MzA2RVx1NTIyNFx1NUI5QVxuICAgICAgICAgICAgY29uc3QgdG9vbCA9IHRoaXMuc3RhdHVzLmxvbmdwcmVzcy5lbmQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuc2V0VG9vbCh0b29sKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBcdTczRkVcdTU3MjhcdTMwNkVcdTMwQzRcdTMwRkNcdTMwRUJcdTMwNkJcdTVGRENcdTMwNThcdTMwNjZcdTUxRTZcdTc0MDZcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXR1cy5kcmF3LmdldFRvb2woKSkge1xuICAgICAgICAgICAgY2FzZSBcInBlblwiOlxuICAgICAgICAgICAgICAgIC8vIFx1NTM1OFx1NjJCQ1x1MzA1N1x1NzlGQlx1NTJENVx1RkYxRFx1OEExOFx1OEZGMFxuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSB0aGlzLm1pbmUuZHJhdy5sYXN0UG9pbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmUucGVuLnByb2MoeCwgeSwgcCwgdGhpcy5taW5lLnBhcGVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gdGhpcy5taW5lLnBlbi5vcHQuY29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5lLmRyYXcucHVzaFBvaW50KHgsIHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInpvb21cIjpcbiAgICAgICAgICAgICAgICAvLyBcdTMwNTVcdTMwODlcdTMwNkJcdTk1NzdcdTYyQkNcdTMwNTdcdUZGMURcdTYyRTFcdTU5MjdcdTdFMkVcdTVDMEZcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbi56b29tc2Nyb2xsLnpvb21kcmFnKHgsIHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHVwKGRldjogRGV2aWNlLCBlOiBFdmVudCwgcDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgeDogbnVtYmVyID0gcC54O1xuICAgICAgICBjb25zdCB5OiBudW1iZXIgPSBwLnk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBVLnBkKGAke2Rldn0tdXAoJHt4fSwke3l9KT0ke3RoaXMubm93c2Vuc29yfWApO1xuXG4gICAgICAgIC8vIFx1NzNGRVx1NTcyOFx1MzA2RVx1MzBDNFx1MzBGQ1x1MzBFQlx1MzA2Qlx1NUZEQ1x1MzA1OFx1MzA2Nlx1NTFFNlx1NzQwNlxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdHVzLmRyYXcuZ2V0VG9vbCgpKSB7XG4gICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XG4gICAgICAgICAgICAgICAgLy8gXHU5NTc3XHU2MkJDXHUzMDU3XHU3OUZCXHU1MkQ1XHVGRjFEXHU3NTNCXHU5NzYyXHUzMEI5XHUzMEFGXHUzMEVEXHUzMEZDXHUzMEVCXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24uem9vbXNjcm9sbC5zY3JvbGwoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxXHUzMEI5XHUzMEM4XHUzMEVEXHUzMEZDXHUzMEFGXHU3RDQyXHUzMDhGXHUzMDYzXHUzMDVGXHUzMDZFXHUzMDY3XHU3RDQyXHU0RTg2XG4gICAgICAgIHRoaXMuc3RhdHVzLmRyYXcuZW5kU3Ryb2tlKCk7XG4gICAgICAgIHRoaXMubWluZS5kcmF3LmVuZFN0cm9rZSgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQud3JhcGRpdi5zZXROb3JtYWwoKTtcbiAgICAgICAgdGhpcy5zdGF0dXMubG9uZ3ByZXNzLmVuZCgpOyAvLyBcdTk1NzdcdTYyQkNcdTMwNTdcdTMwNkVcdTMwN0VcdTMwN0VcdTk2RTJcdTMwNTlcdTU4MzRcdTU0MDhcdTMwODJcdTMwNDJcdTMwOEFcdTMwMDJcbiAgICAgICAgdGhpcy5ub3dzZW5zb3IgPSBudWxsO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBEcmF3RXZlbnRIYW5kbGVyIH0gZnJvbSBcIi4vRHJhd0V2ZW50SGFuZGxlclwiO1xuXG5jb25zdCBidWxtYU5hdkRyb3AgPSAoZTogRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmUudGFyZ2V0O1xuICAgIHRhcmdldC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIpO1xufVxuY29uc3QgaW5pdEJ1bG1hTmF2RHJvcCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyb3Bkb3duIC5kcm9wZG93bi10cmlnZ2VyIGFcIikuZm9yRWFjaChuYXYgPT4ge1xuICAgICAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1bG1hTmF2RHJvcCk7XG4gICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgYnVsbWFOYXZEcm9wKTtcbiAgICB9KTtcbn07XG4vLyBjb25zdCBidWxtYU5hdkRyb3AgPSAoZTogRXZlbnQpID0+IHtcbi8vICAgICBjb25zdCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmUudGFyZ2V0O1xuLy8gICAgIHRhcmdldC5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIpO1xuLy8gfVxuLy8gY29uc3QgaW5pdEJ1bG1hTmF2RHJvcCA9ICgpID0+IHtcbi8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhhcy1kcm9wZG93biAubmF2YmFyLWxpbmtcIikuZm9yRWFjaChuYXYgPT4ge1xuLy8gICAgICAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJ1bG1hTmF2RHJvcCk7XG4vLyAgICAgICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgYnVsbWFOYXZEcm9wKTtcbi8vICAgICB9KTtcbi8vIH07XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RyYXdjYW52YXNlc1wiKSkge1xuICAgICAgICBjb25zdCBzZW5zZTogRHJhd0V2ZW50SGFuZGxlciA9IG5ldyBEcmF3RXZlbnRIYW5kbGVyKCk7XG4gICAgICAgIHNlbnNlLmluaXQoKTtcbiAgICB9XG4gICAgY29uc3QgYm9keTogSFRNTEJvZHlFbGVtZW50ID0gPEhUTUxCb2R5RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcblxuICAgIC8vIGlvc1x1MzA2RVx1MzA2OFx1MzA0RFx1MzA2RVx1MzBENFx1MzBGM1x1MzBDMVx1MzA4NFx1MzBDMFx1MzBENlx1MzBFQlx1MzBBRlx1MzBFQVx1MzBDM1x1MzBBRlx1MzA2Qlx1MzA4OFx1MzA4Qlx1NjJFMVx1NTkyN1x1MzA5Mlx1NzEyMVx1NTJCOVx1NTMxNlxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG5cbiAgICBpbml0QnVsbWFOYXZEcm9wKCk7XG59KTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQ2E7QUFEYjtBQUFBO0FBQ08sTUFBTSxlQUFOLE1BQW1CO0FBQUEsUUFJdEIsT0FBYyxXQUF5QjtBQUNuQyxpQkFBTyxJQUFJLGFBQWEsV0FBVztBQUFBLFFBQ3ZDO0FBQUEsUUFDQSxPQUFjLFlBQTBCO0FBQ3BDLGlCQUFPLElBQUksYUFBYSxjQUFjO0FBQUEsUUFDMUM7QUFBQSxRQUNRLFlBQVksVUFBa0I7QUFDbEMsZUFBSyxNQUFNLFNBQVMsY0FBYyxRQUFRO0FBQzFDLGVBQUssTUFBTSxLQUFLLElBQUksV0FBVyxJQUFJO0FBQUEsUUFDdkM7QUFBQSxRQUVPLFNBQW1DO0FBQ3RDLGlCQUFPLEtBQUs7QUFBQSxRQUNoQjtBQUFBLFFBQ08sU0FBNEI7QUFDL0IsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBQUEsUUFDTyxRQUFjO0FBQ2pCLGdCQUFNLElBQVksS0FBSyxJQUFJO0FBQzNCLGdCQUFNLElBQVksS0FBSyxJQUFJO0FBQzNCLGVBQUssSUFBSSxVQUFVLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFBQSxRQUNqQztBQUFBLE1BQ0o7QUFBQTtBQUFBOzs7QUMzQkEsTUFBYSxNQThDQSxpQkFvREE7QUFsR2I7QUFBQTtBQUFPLE1BQU0sT0FBTixNQUFXO0FBQUEsUUFHZCxjQUFjO0FBQ1YsZUFBSyxJQUFJLENBQUM7QUFBQSxRQUNkO0FBQUEsUUFDTyxL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R0FBRTtBQUFDLG9CQUFVLE9BQU8sV0FBUyxZQUFVLE9BQU8sU0FBTyxPQUFPLFVBQVEsRUFBRSxJQUFFLGNBQVksT0FBTyxVQUFRLE9BQU8sTUFBSSxPQUFPLGdCQUFlLENBQUMsR0FBRSxDQUFDLElBQUUsWUFBVSxPQUFPLFVBQVEsUUFBUSxlQUFhLEVBQUUsSUFBRSxFQUFFLGVBQWEsRUFBRTtBQUFBLE1BQUMsRUFBRSxlQUFhLE9BQU8sT0FBSyxPQUFLLFNBQUssV0FBVTtBQUFDLGVBQU8sU0FBUyxHQUFFO0FBQUMsY0FBSSxJQUFFLENBQUM7QUFBRSxtQkFBUyxFQUFFLEdBQUU7QUFBQyxnQkFBRyxFQUFFO0FBQUcscUJBQU8sRUFBRSxHQUFHO0FBQVEsZ0JBQUksSUFBRSxFQUFFLEtBQUcsRUFBQyxHQUFJLEdBQUUsT0FBRyxTQUFRLENBQUMsRUFBQztBQUFFLG1CQUFPLEVBQUUsR0FBRyxLQUFLLEVBQUUsU0FBUSxHQUFFLEVBQUUsU0FBUSxDQUFDLEdBQUUsRUFBRSxJQUFFLE1BQUcsRUFBRTtBQUFBLFVBQU87QUFBQyxpQkFBTyxFQUFFLElBQUUsR0FBRSxFQUFFLElBQUUsR0FBRSxFQUFFLElBQUUsU0FBU0MsSUFBRUMsSUFBRSxHQUFFO0FBQUMsY0FBRSxFQUFFRCxJQUFFQyxFQUFDLEtBQUcsT0FBTyxlQUFlRCxJQUFFQyxJQUFFLEVBQUMsWUFBVyxNQUFHLEtBQUksRUFBQyxDQUFDO0FBQUEsVUFBQyxHQUFFLEVBQUUsSUFBRSxTQUFTRCxJQUFFO0FBQUMsMkJBQWEsT0FBTyxVQUFRLE9BQU8sZUFBYSxPQUFPLGVBQWVBLElBQUUsT0FBTyxhQUFZLEVBQUMsT0FBTSxTQUFRLENBQUMsR0FBRSxPQUFPLGVBQWVBLElBQUUsY0FBYSxFQUFDLE9BQU0sS0FBRSxDQUFDO0FBQUEsVUFBQyxHQUFFLEVBQUUsSUFBRSxTQUFTQSxJQUFFQyxJQUFFO0FBQUMsZ0JBQUcsSUFBRUEsT0FBSUQsS0FBRSxFQUFFQSxFQUFDLElBQUcsSUFBRUM7QUFBRSxxQkFBT0Q7QUFBRSxnQkFBRyxJQUFFQyxN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RSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxrQkFBa0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUM7QUFBRTtBQUFBLHFCQUFVO0FBQUksdUJBQUssSUFBRUE7QUFBRSxzQkFBSU0sTUFBRyxHQUFFLEVBQUUsVUFBVSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFQyxLQUFFLEVBQUVELElBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUVDLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLGdCQUFnQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssa0JBQWtCLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDO0FBQUU7QUFBQSxxQkFBVTtBQUFJLHVCQUFLLElBQUVQO0FBQUUsc0JBQUlRLE1BQUcsR0FBRSxFQUFFLFVBQVUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRUMsS0FBRSxFQUFFRCxJQUFFLENBQUM7QUFBRSx1QkFBSyxJQUFFQyxHQUFFLElBQUcsS0FBSyxJQUFFQSxHQUFFLElBQUcsS0FBSyxJQUFFQSxHQUFFLElBQUcsS0FBSyxnQkFBZ0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGtCQUFrQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQztBQUFFO0FBQUEscUJBQVU7QUFBSSx1QkFBSyxJQUFFVDtBQUFFLHNCQUFJVSxNQUFHLEdBQUUsRUFBRSxVQUFVLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUVDLEtBQUUsRUFBRUQsSUFBRSxDQUFDO0FBQUUsdUJBQUssSUFBRUMsR0FBRSxJQUFHLEtBQUssSUFBRUEsR0FBRSxJQUFHLEtBQUssSUFBRUEsR0FBRSxJQUFHLEtBQUssWUFBWSxPQUFPLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLENBQUMsR0FBRSxLQUFLLGdCQUFnQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssa0JBQWtCLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDO0FBQUU7QUFBQSxxQkFBVTtBQUFJLHVCQUFLLElBQUVYO0FBQUUsc0JBQUlZLE1BQUcsR0FBRSxFQUFFLFVBQVUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRUMsS0FBRSxFQUFFRCxJQUFFLENBQUM7QUFBRSx1QkFBSyxJQUFFQyxHQUFFLElBQUcsS0FBSyxJQUFFQSxHQUFFLElBQUcsS0FBSyxJQUFFQSxHQUFFLElBQUcsS0FBSyxZQUFZLE9BQU8sS0FBSyxDQUFDLEdBQUUsS0FBSyxlQUFlLEtBQUssQ0FBQyxHQUFFLEtBQUssZ0JBQWdCLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxlQUFlLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxrQkFBa0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUM7QUFBRTtBQUFBLHFCQUFVO0FBQUksdUJBQUssSUFBRWI7QUFBRSxzQkFBSWMsTUFBRyxHQUFFLEVBQUUsVUFBVSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFQyxLQUFFLEVBQUVELElBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUVDLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLFlBQVksT0FBTyxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxDQUFDLEdBQUUsS0FBSyxnQkFBZ0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGtCQUFrQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQztBQUFFO0FBQUEscUJBQVU7QUFBTSxzQkFBSUMsS0FBRSxFQUFFaEIsSUFBRSxDQUFDO0FBQUUsdUJBQUssSUFBRWdCLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUU7QUFBRyxzQkFBSUMsTUFBRyxHQUFFLEVBQUUsVUFBVSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFQyxLQUFFLEVBQUVELElBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUVDLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGtCQUFrQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQztBQUFFO0FBQUEscUJBQVc7QUFBRSxzQkFBSUMsS0FBRSxFQUFFbkIsSUFBRSxDQUFDO0FBQUUsdUJBQUssSUFBRW1CLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUU7QUFBRyxzQkFBSUMsTUFBRyxHQUFFLEVBQUUsVUFBVSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFQyxLQUFFLEVBQUVELElBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUVDLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLElBQUVBLEdBQUUsSUFBRyxLQUFLLFlBQVksT0FBTyxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxDQUFDLEdBQUUsS0FBSyxnQkFBZ0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGtCQUFrQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLENBQUM7QUFBRTtBQUFBLHFCQUFXO0FBQUUsc0JBQUksSUFBRSxFQUFFckIsSUFBRSxDQUFDO0FBQUUsdUJBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxJQUFFLEVBQUUsSUFBRyxLQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssSUFBRSxFQUFFO0FBQUcsc0JBQUksS0FBRyxHQUFFLEVBQUUsVUFBVSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLElBQUUsRUFBRSxHQUFFLENBQUM7QUFBRSx1QkFBSyxJQUFFLEVBQUUsSUFBRyxLQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxZQUFZLE9BQU8sS0FBSyxDQUFDLEdBQUUsS0FBSyxlQUFlLEtBQUssQ0FBQyxHQUFFLEtBQUssZ0JBQWdCLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxlQUFlLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxlQUFlLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsS0FBSyxrQkFBa0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxDQUFDO0FBQUU7QUFBQSxxQkFBVTtBQUFTLHNCQUFJLEtBQUcsR0FBRSxFQUFFLGVBQWVBLEVBQUMsS0FBRyxDQUFDLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsSUFBRSxFQUFFLEdBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxJQUFFLEVBQUU7QUFBRyxzQkFBSSxLQUFHLEdBQUUsRUFBRSxVQUFVLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxDQUFDLEdBQUUsSUFBRSxFQUFFLEdBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxJQUFFLEVBQUUsSUFBRyxLQUFLLFlBQVksT0FBTyxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxDQUFDLEdBQUUsS0FBSyxnQkFBZ0IsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxLQUFLLGVBQWUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUM7QUFBRTtBQUFBLHFCQUFXO0FBQUUsc0JBQUksS0FBRyxHQUFFLEVBQUUsWUFBWUEsSUFBRSxNQUFNLEtBQUcsQ0FBQyxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLEdBQUUsQ0FBQztBQUFFLHVCQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxJQUFFLEVBQUUsSUFBRyxLQUFLLElBQUUsRUFBRTtBQUFHLHNCQUFJLEtBQUcsR0FBRSxFQUFFLFVBQVUsS0FBSyxHQUFFLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRSxJQUFFLEVBQUUsR0FBRSxDQUFDO0FBQUUsdUJBQUssSUFBRSxFQUFFLElBQUcsS0FBSyxJQUFFLEVBQUUsSUFBRyxLQUFLLElBQUUsRUFBRSxJQUFHLEtBQUssWUFBWSxPQUFPLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLENBQUMsR0FBRSxLQUFLLGdCQUFnQixLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxHQUFFLEtBQUssZUFBZSxLQUFLLEdBQUUsS0FBSyxHQUFFLEtBQUssQ0FBQyxH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LEVBQUMsS0FBSSxNQUFLLE9BQU0sU0FBU0EsSUFBRTtBQUFDLGNBQUFBLE1BQUcsS0FBSyxVQUFVLEtBQUtBLEVBQUM7QUFBQSxZQUFDLEVBQUMsR0FBRSxFQUFDLEtBQUksT0FBTSxPQUFNLFNBQVNBLElBQUU7QUFBQyxtQkFBSyxZQUFVQSxLQUFFLEtBQUssVUFBVSxPQUFPLFNBQVNDLElBQUU7QUFBQyx1QkFBT0EsT0FBSUQ7QUFBQSxjQUFDLENBQUMsSUFBRSxDQUFDO0FBQUEsWUFBQyxFQUFDLEdBQUUsRUFBQyxLQUFJLFFBQU8sT0FBTSxTQUFTQSxJQUFFQyxJQUFFO0FBQUMsdUJBQVFDLEtBQUUsS0FBSyxVQUFVLE1BQU0sQ0FBQyxHQUFFQyxLQUFFLEdBQUVBLEtBQUVELEdBQUUsUUFBT0M7QUFBSSxnQkFBQUQsR0FBRUMsSUFBRyxNQUFNRixJQUFFRCxFQUFDO0FBQUEsWUFBQyxFQUFDLENBQUMsQ0FBQyxHQUFFQTtBQUFBLFVBQUMsRUFBRTtBQUFFLG1CQUFTLEVBQUVBLElBQUVDLElBQUU7QUFBQyxnQkFBSUMsS0FBRSxJQUFJLEVBQUVGLElBQUVDLEVBQUMsR0FBRUUsS0FBRSxFQUFDLFFBQU8sSUFBSSxFQUFFLFFBQVEsR0FBRSxVQUFTLElBQUksRUFBRSxVQUFVLEdBQUUsYUFBWSxJQUFJLEVBQUUsYUFBYSxFQUFDLEdBQUVHLEtBQUUsTUFBR0MsS0FBRSxDQUFDLEdBQUVDLEtBQUUsRUFBQyxJQUFJLFVBQVM7QUFBQyxxQkFBT04sR0FBRTtBQUFBLFlBQU8sR0FBRSxJQUFJLE1BQUs7QUFBQyxxQkFBTSxDQUFDQSxHQUFFLEdBQUVBLEdBQUUsR0FBRUEsR0FBRSxDQUFDO0FBQUEsWUFBQyxHQUFFLElBQUksSUFBSUYsSUFBRTtBQUFDLGtCQUFJQyxLQUFFLEVBQUVELElBQUUsQ0FBQyxHQUFFRyxLQUFFRixHQUFFLElBQUdLLEtBQUVMLEdBQUUsSUFBR00sS0FBRU4sR0FBRSxJQUFHTyxLQUFFLEVBQUUsR0FBRSxFQUFFLE9BQU9MLElBQUUsR0FBRSxHQUFHLElBQUcsR0FBRSxFQUFFLE9BQU9HLElBQUUsR0FBRSxHQUFHLElBQUcsR0FBRSxFQUFFLE9BQU9DLElBQUUsR0FBRSxHQUFHLENBQUM7QUFBRSxjQUFBSixLQUFFSyxHQUFFLElBQUdGLEtBQUVFLEdBQUUsSUFBR0QsS0FBRUMsR0FBRSxJQUFHTixHQUFFLGVBQWUsR0FBRSxDQUFDQyxJQUFFRyxJQUFFQyxJQUFFLENBQUMsQ0FBQztBQUFBLFlBQUMsR0FBRSxJQUFJLE1BQUs7QUFBQyxxQkFBTSxDQUFDTCxHQUFFLEdBQUVBLEdBQUUsR0FBRUEsR0FBRSxDQUFDO0FBQUEsWUFBQyxHQUFFLElBQUksSUFBSUYsSUFBRTtBQUFDLGtCQUFJQyxLQUFFLEVBQUVELElBQUUsQ0FBQyxHQUFFRyxLQUFFRixHQUFFLElBQUdLLEtBQUVMLEdBQUUsSUFBR00sS0FBRU4sR0FBRSxJQUFHTyxLQUFFLEVBQUUsR0FBRSxFQUFFLE9BQU9MLElBQUUsR0FBRSxHQUFHLElBQUcsR0FBRSxFQUFFLE9BQU9HLElBQUUsR0FBRSxHQUFHLElBQUcsR0FBRSxFQUFFLE9BQU9DLElBQUUsR0FBRSxHQUFHLENBQUM7QUFBRSxjQUFBSixLQUFFSyxHQUFFLElBQUdGLEtBQUVFLEdBQUUsSUFBR0QsS0FBRUMsR0FBRSxJQUFHTixHQUFFLGVBQWUsR0FBRSxDQUFDQyxJQUFFRyxJQUFFQyxJQUFFLENBQUMsQ0FBQztBQUFBLFlBQUMsR0FBRSxJQUFJLFNBQVE7QUFBQyxxQkFBTyxLQUFLLElBQUk7QUFBQSxZQUFHLEdBQUUsSUFBSSxPQUFNO0FBQUMscUJBQU0sQ0FBQ0wsR0FBRSxHQUFFQSxHQUFFLEdBQUVBLEdBQUUsR0FBRUEsR0FBRSxDQUFDO0FBQUEsWUFBQyxHQUFFLElBQUksS0FBS0YsSUFBRTtBQUFDLGtCQUFJQyxLQUFFLEVBQUVELElBQUUsQ0FBQyxHQUFFRyxLQUFFRixHQUFFLElBQUdLLEtBQUVMLEdBQUUsSUFBR00sS0FBRU4sR0FBRSxJQUFHTyxLQUFFUCxHQUFFLElBQUdRLEtBQUUsRUFBRSxHQUFFLEVBQUUsT0FBT04sSUFBRSxH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LFVBQU0sZUFBZSxDQUFDLE1BQWE7QUFGbkM7QUFHSSxjQUFNLFNBQW1DLEVBQUU7QUFDM0MsMkJBQU8sa0JBQVAsbUJBQXNCLGtCQUF0QixtQkFBcUMsVUFBVSxPQUFPO0FBQUEsTUFDMUQ7QUFDQSxVQUFNLG1CQUFtQixNQUFNO0FBQzNCLGlCQUFTLGlCQUFpQiwrQkFBK0IsRUFBRSxRQUFRLFNBQU87QUFDdEUsY0FBSSxpQkFBaUIsU0FBUyxZQUFZO0FBQzFDLGNBQUksaUJBQWlCLFlBQVksWUFBWTtBQUFBLFFBQ2pELENBQUM7QUFBQSxNQUNMO0FBV0EsYUFBTyxpQkFBaUIsUUFBUSxNQUFZO0FBQ3hDLFlBQUksU0FBUyxjQUFjLGVBQWUsR0FBRztBQUN6QyxnQkFBTSxRQUEwQixJQUFJLGlCQUFpQjtBQUNyRCxnQkFBTSxLQUFLO0FBQUEsUUFDZjtBQUNBLGNBQU0sT0FBeUMsU0FBUyxjQUFjLE1BQU07QUFHNUUsYUFBSyxpQkFBaUIsY0FBYyxDQUFDLE1BQWtCO0FBQ25ELFlBQUUsZUFBZTtBQUFBLFFBQ3JCLEdBQUcsRUFBRSxTQUFTLE1BQU0sQ0FBQztBQUVyQix5QkFBaUI7QUFBQSxNQUNyQixFQUFDO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFsiU3dhbCIsICJnbG9iYWxTdGF0ZSIsICJlcnJvciIsICJyZWplY3RQcm9taXNlIiwgImNvbmZpcm0iLCAiZSIsICJlIiwgInQiLCAiciIsICJpIiwgIm8iLCAibiIsICJzIiwgImEiLCAibCIsICJjIiwgInUiLCAiaCIsICJwIiwgImQiLCAidiIsICJtIiwgIkEiLCAieSIsICJrIiwgIkYiLCAiRSIsICJIIiwgIkIiLCAiY29sb3IiLCAicCJdCn0K
