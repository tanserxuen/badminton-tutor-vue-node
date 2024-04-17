export default function getDateFromTimestamp(timestamp) {
  if (!timestamp) return;
  const fireBaseTime = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();

  return `${date} ${atTime}`;
}
