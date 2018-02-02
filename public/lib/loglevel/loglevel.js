/*! loglevel - v1.6.1 - https://github.com/pimterry/loglevel - (c) 2018 Tim Perry - licensed MIT */
(function (root, definition) {
  if (typeof define === "function" && define.amd) {
    define(definition);
  } else if (typeof module === "object" && module.exports) {
    module.exports = definition();
  } else {
    root.log = definition();
  }
}(this, () => {
  // Slightly dubious tricks to cut down minimized file size
  const noop = function () {};
  const undefinedType = "undefined";

  const logMethods = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
  ];

    // Cross-browser bind equivalent that works at least back to IE6
  function bindMethod(obj, methodName) {
    const method = obj[methodName];
    if (typeof method.bind === "function") {
      return method.bind(obj);
    }
    try {
      return Function.prototype.bind.call(method, obj);
    } catch (e) {
      // Missing bind shim or IE8 + Modernizr, fallback to wrapping
      return function () {
        return Function.prototype.apply.apply(method, [obj, arguments]);
      };
    }
  }

  // Build the best logging method possible for this env
  // Wherever possible we want to bind, not wrap, to preserve stack traces
  function realMethod(methodName) {
    if (methodName === "debug") {
      methodName = "log";
    }

    if (typeof console === undefinedType) {
      return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
    } else if (console[methodName] !== undefined) {
      return bindMethod(console, methodName);
    } else if (console.log !== undefined) {
      return bindMethod(console, "log");
    }
    return noop;
  }

  // These private functions always need `this` to be set properly

  function replaceLoggingMethods(level, loggerName) {
    /* jshint validthis:true */
    for (let i = 0; i < logMethods.length; i++) {
      const methodName = logMethods[i];
      this[methodName] = (i < level) ?
        noop :
        this.methodFactory(methodName, level, loggerName);
    }

    // Define log.log as an alias for log.debug
    this.log = this.debug;
  }

  // In old IE versions, the console isn't present until you first open it.
  // We build realMethod() replacements here that regenerate logging methods
  function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
    return function () {
      if (typeof console !== undefinedType) {
        replaceLoggingMethods.call(this, level, loggerName);
        this[methodName].apply(this, arguments);
      }
    };
  }

  // By default, we use closely bound real methods wherever possible, and
  // otherwise we wait for a console to appear, and then try again.
  function defaultMethodFactory(methodName, level, loggerName) {
    /* jshint validthis:true */
    return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
  }

  function Logger(name, defaultLevel, factory) {
    const self = this;
    let currentLevel;
    let storageKey = "loglevel";
    if (name) {
      storageKey += `:${name}`;
    }

    function persistLevelIfPossible(levelNum) {
      const levelName = (logMethods[levelNum] || "silent").toUpperCase();

      if (typeof window === undefinedType) return;

      // Use localStorage if available
      try {
        window.localStorage[storageKey] = levelName;
        return;
      } catch (ignore) {}

      // Use session cookie as fallback
      try {
        window.document.cookie =
                `${encodeURIComponent(storageKey)}=${levelName};`;
      } catch (ignore) {}
    }

    function getPersistedLevel() {
      let storedLevel;

      if (typeof window === undefinedType) return;

      try {
        storedLevel = window.localStorage[storageKey];
      } catch (ignore) {}

      // Fallback to cookies if local storage gives us nothing
      if (typeof storedLevel === undefinedType) {
        try {
          const cookie = window.document.cookie;
          const location = cookie.indexOf(`${encodeURIComponent(storageKey)}=`);
          if (location !== -1) {
            storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
          }
        } catch (ignore) {}
      }

      // If the stored level is not valid, treat it as if nothing was stored.
      if (self.levels[storedLevel] === undefined) {
        storedLevel = undefined;
      }

      return storedLevel;
    }

    /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

    self.name = name;

    self.levels = {
      "TRACE": 0,
      "DEBUG": 1,
      "INFO": 2,
      "WARN": 3,
      "ERROR": 4,
      "SILENT": 5,
    };

    self.methodFactory = factory || defaultMethodFactory;

    self.getLevel = function () {
      return currentLevel;
    };

    self.setLevel = function (level, persist) {
      if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
        level = self.levels[level.toUpperCase()];
      }
      if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
        currentLevel = level;
        if (persist !== false) { // defaults to true
          persistLevelIfPossible(level);
        }
        replaceLoggingMethods.call(self, level, name);
        if (typeof console === undefinedType && level < self.levels.SILENT) {
          return "No console available for logging";
        }
      } else {
        throw `log.setLevel() called with invalid level: ${level}`;
      }
    };

    self.setDefaultLevel = function (level) {
      if (!getPersistedLevel()) {
        self.setLevel(level, false);
      }
    };

    self.enableAll = function (persist) {
      self.setLevel(self.levels.TRACE, persist);
    };

    self.disableAll = function (persist) {
      self.setLevel(self.levels.SILENT, persist);
    };

    // Initialize with the right level
    let initialLevel = getPersistedLevel();
    if (initialLevel == null) {
      initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
    }
    self.setLevel(initialLevel, false);
  }

  /*
     *
     * Top-level API
     *
     */

  const defaultLogger = new Logger();

  const _loggersByName = {};
  defaultLogger.getLogger = function getLogger(name) {
    if (typeof name !== "string" || name === "") {
      throw new TypeError("You must supply a name when creating a logger.");
    }

    let logger = _loggersByName[name];
    if (!logger) {
      logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
    }
    return logger;
  };

  // Grab the current global log variable in case of overwrite
  const _log = (typeof window !== undefinedType) ? window.log : undefined;
  defaultLogger.noConflict = function () {
    if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
      window.log = _log;
    }

    return defaultLogger;
  };

  defaultLogger.getLoggers = function getLoggers() {
    return _loggersByName;
  };

  return defaultLogger;
}));
