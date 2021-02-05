import { generateId } from "../utils/idUtils";

const NOTIFICATION_TYPE = {
  info: "info",
  error: "error",
  success: "success",
};

class NotificationInfo {
  _instanceId;
  _message = "";
  _showPopup;
  _clickHandler = null;
  _dismissHandler = null;

  constructor({
    type = NOTIFICATION_TYPE.info,
    message,
    showPopup = true,
    popupOnly = false,
    showBuiltInNotification = true,
    onClick,
    onDismiss,
  }) {
    this._type = type;
    this._instanceId = generateId();
    this._message = message;
    this._showPopup = showPopup;
    this._popupOnly = popupOnly;
    this._showBuiltInNotification = showBuiltInNotification;
    this._clickHandler = onClick || (() => {});
    this._dismissHandler = onDismiss || (() => {});
  }

  get type() {
    return this._type;
  }

  get instanceId() {
    return this._instanceId;
  }

  get message() {
    return this._message;
  }

  get showPopup() {
    return this._showPopup;
  }

  get popupOnly() {
    return this._popupOnly;
  }

  get ShowBuiltInNotification() {
    return this._showBuiltInNotification;
  }

  get clickHandler() {
    return this._clickHandler;
  }

  get dismissHandler() {
    return this._dismissHandler;
  }
}

export { NotificationInfo, NOTIFICATION_TYPE };
