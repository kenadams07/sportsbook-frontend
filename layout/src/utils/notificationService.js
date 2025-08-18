// utils/notificationService.js
let notifier = null;

/**
 * Register the notifier instance from NotificationProvider
 */
export const setNotifier = (api) => {
  notifier = api;
};

/**
 * Call this function in sagas or non-react code
 */
export const notifyPromise = (promise, options) => {
  if (!notifier) throw new Error("NotificationProvider is not initialized");
  return notifier.notifyPromise(promise, options);
};

/**
 * Convenience functions for non-react code
 */
export const notifySuccess = (message, title, duration) => notifier?.success(message, title, duration);
export const notifyError = (message, title, duration) => notifier?.error(message, title, duration);
export const notifyInfo = (message, title, duration) => notifier?.info(message, title, duration);
