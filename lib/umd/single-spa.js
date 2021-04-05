(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SingleSpa = {}));
}(this, (function (exports) { 'use strict';

  const NOT_LOADED = 'NOT_LOADED'; // 初始状态
  const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 加载资源
  const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 还没调用bootstrap方法
  const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 加载中
  const NOT_MOUNTED = 'NOT_BOOTSTRAPPED'; // 还未挂载
  const MOUNTING = 'MOUNTING'; // 挂载中
  const MOUNTED = 'MOUNTED'; // 挂载完成
  const UNMOUNTING = 'UNMOUNTING'; // 解除挂载中

  // 应用是否要被激活
  const shouldBeActive = app => app.activeWhen(window.location);

  const toBootstrapPromise = async app => {
    if (app.status !== NOT_BOOTSTRAPPED) return app

    app.status = BOOTSTRAPPING;
    await app.bootstrap(app.customProps);
    app.status = NOT_MOUNTED;

    return app
  };

  const toLoadPromise = async app => {
    if (app.loadPromise) return app.loadPromise

    return (app.loadPromise = Promise.resolve().then(async () => {
      app.status = LOADING_SOURCE_CODE;

      const { mount, bootstrap, unmount } = await app.loadApp(app.customProps);

      app.status = NOT_BOOTSTRAPPED;
      app.mount = pipeAsyncFunctions(mount);
      app.unmount = pipeAsyncFunctions(unmount);
      app.bootstrap = pipeAsyncFunctions(bootstrap);
      delete app.loadPromise;

      return app
    }))
  };

  function pipeAsyncFunctions(fns) {
    fns = Array.isArray(fns) ? fns : [fns];

    return props => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
  }

  const toMountPromise = async app => {
    if (app.status !== NOT_MOUNTED) return app

    app.status = MOUNTING;
    await app.mount(app.customProps);
    app.status = MOUNTED;

    return app
  };

  const toUnmountPromise = async app => {
    // 当前应用没有挂载
    if (app.status !== MOUNTED) return app

    app.status = UNMOUNTING;
    await app.unmount(app.customProps);
    app.status = NOT_MOUNTED;

    return app
  };

  let started = false;

  const start = () => {
    started = true;
    reroute(); // 加载应用
  };

  // 核心应用处理方法
  const reroute = () => {
    const { appToLoad, appToMount, appToUnmount } = getAppChanges();

    console.log(appToLoad, appToMount, appToUnmount);

    if (started) {
      console.log('嗲用start');
      return performAppChanges()
    } else {
      console.log('嗲用register');
      return loadApps()
      // reroute() // 加载应用
    }

    // 预加载应用
    async function loadApps() {
      const loadApps = await Promise.all(appToLoad.map(toLoadPromise));

      console.log(loadApps);
    }

    // 挂载应用
    async function performAppChanges() {
      // 卸载不需要的应用
      Promise.all(appToUnmount.map(toUnmountPromise));
      // 加载需要的应用
      appToLoad.map(async app => {
        app = await toLoadPromise(app);
        app = await toBootstrapPromise(app);

        return toMountPromise(app)
      });

      appToMount.map(async app => {
        app = await toBootstrapPromise(app);

        return toMountPromise(app)
      });
    }
  };

  const apps = [];

  const registerApplication = (appName, loadApp, activeWhen, customProps) => {
    apps.push({
      status: NOT_LOADED,
      name: appName,
      loadApp,
      activeWhen,
      customProps
    });

    console.log(apps);

    reroute();
  };

  const getAppChanges = () => {
    const appToUnmount = []; // 要卸载的app
    const appToLoad = []; // 要加载的app
    const appToMount = []; // 要挂载的app

    apps.forEach(app => {
      const status = app.status;
      const appShouldBeActive = shouldBeActive(app);

      switch (status) {
        case NOT_LOADED:
        case LOADING_SOURCE_CODE: {
          if (appShouldBeActive) {
            appToLoad.push(app);
          }
          break
        }

        case NOT_BOOTSTRAPPED:
        case BOOTSTRAPPING:
        case NOT_MOUNTED: {
          if (appShouldBeActive) {
            appToMount.push(app);
          }
          break
        }

        case MOUNTED: {
          if (!appShouldBeActive) {
            appToUnmount.push(app);
          }
          break
        }
      }
    });

    return {
      appToLoad,
      appToMount,
      appToUnmount,
    }
  };

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
