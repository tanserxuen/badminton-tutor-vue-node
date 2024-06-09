function getDateDetails(milliseconds) {
  d = new Date(milliseconds ?? Date.now());
  // get year of the date
  const year = d.getUTCFullYear();
  // get month of the date
  const month = d.getUTCMonth() + 1;
  // get nth day of the year
  const start = new Date(d.getUTCFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const nthDay = Math.floor(diff / oneDay);
  // get week number of the year
  const weekNo = Math.ceil((nthDay + start.getDay() + 1) / 7);

  return { year, month, weekNo, nthDay };
}

module.exports = { getDateDetails };
