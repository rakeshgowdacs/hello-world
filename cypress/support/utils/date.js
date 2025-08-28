function formatRunTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const hour12 = pad(hours);
  return `sms-${year}-${month}-${day}-${hour12}-${minutes}${isPM ? "pm" : "am"}`;
}

module.exports = {
  formatRunTimestamp
};