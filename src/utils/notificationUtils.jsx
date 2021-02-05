const React = require("react");
const Notification = require("../../components/Notification/Notification.jsx");

const generateNotification = (info, onClick, onDismiss) => (
  <Notification
    key={info.instanceId}
    info={info}
    onClick={onClick}
    onDismiss={onDismiss}
  />
);

module.exports = { generateNotification };
