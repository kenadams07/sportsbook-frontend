"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { setNotifier } from "../../utils/notificationService";
import "./notification.css"; // We'll provide improved CSS

const NotificationContext = createContext(null);
export const useNotification = () => useContext(NotificationContext);

const DEFAULT_DURATION = 4000; // ms
let idCounter = 0;

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const animMs = 300; // exit animation length

  const notificationsRef = useRef(notifications);
  useEffect(() => { notificationsRef.current = notifications; }, [notifications]);

  const _add = ({ type = "info", title = "", message = "", duration = DEFAULT_DURATION, dismissible = true }) => {
    const id = ++idCounter;
    const n = { id, type, title, message, dismissible, exiting: false };
    setNotifications((prev) => [n, ...prev]);

    if (duration && duration > 0) {
      setTimeout(() => _remove(id), duration);
    }
    return id;
  };

  const _remove = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, exiting: true } : n)));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, animMs);
  };

  const api = {
    show: (opts) => _add(opts),
    success: (message, title = "Success", duration = DEFAULT_DURATION) => _add({ type: "success", title, message, duration }),
    error: (message, title = "Error", duration = 6000) => _add({ type: "error", title, message, duration }),
    info: (message, title = "Info", duration = DEFAULT_DURATION) => _add({ type: "info", title, message, duration }),
    loading: (message = "Loading...", title = "", ) => _add({ type: "loading", title, message, duration: null, dismissible: false }),
    notifyPromise: async (promise, options = {}) => {
      const loadingText = options.loadingText || "Please wait...";
      const getSuccessMessage = options.getSuccessMessage || ((res) => (res?.data?.meta?.message || res?.data?.message || "Success"));
      const getErrorMessage = options.getErrorMessage || ((err) => (err?.response?.data?.meta?.message || err?.response?.data?.message || err?.message || "Something went wrong"));

      const loadingId = _add({ type: "loading", title: "", message: loadingText, duration: null, dismissible: false });

      try {
        const res = await (typeof promise === "function" ? promise() : promise);
        _remove(loadingId);

        const successMsg = getSuccessMessage(res);
        _add({ type: "success", title: options.successTitle || "Success", message: successMsg, duration: options.successDuration ?? DEFAULT_DURATION });

        if (typeof options.onSuccess === "function") options.onSuccess(res);
        return res;
      } catch (err) {
        _remove(loadingId);
        const errorMsg = getErrorMessage(err);
        _add({ type: "error", title: options.errorTitle || "Error", message: errorMsg, duration: options.errorDuration ?? 6000 });
        if (typeof options.onError === "function") options.onError(err);
        // Re-throw the error so it can be caught by calling code
        throw err;
      }
    }
  };

  useEffect(() => {
    setNotifier(api);
    return () => setNotifier(null);
  }, []);

  return (
    <NotificationContext.Provider value={api}>
      {children}

      <div className="notif-root" aria-live="polite" aria-atomic="true">
        <div className="notif-inner">
          {notifications.map((n) => (
            <div key={n.id} className={`notif-item ${n.type} ${n.exiting ? "exiting" : "entering"}`} role="status">
              <div className="notif-icon">
                {n.type === "success" && <span>✔</span>}
                {n.type === "error" && <span>✖</span>}
                {n.type === "info" && <span>ℹ</span>}
                {n.type === "loading" && <span className="spinner"></span>}
              </div>
              <div className="notif-body">
                {n.title && <div className="notif-title">{n.title}</div>}
                <div className="notif-message">{n.message}</div>
              </div>
              {n.dismissible !== false && <button className="notif-close" onClick={() => _remove(n.id)}>✖</button>}
            </div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}