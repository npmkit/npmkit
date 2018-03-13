export function notify(message, title = 'npmkit') {
  return new Notification(title, {
    body: message,
  });
}
