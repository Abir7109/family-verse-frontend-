export function getAgeToday(dateOfBirthISO: string, now = new Date()) {
  const dob = new Date(dateOfBirthISO);

  let age = now.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function isBirthdayToday(dateOfBirthISO: string, now = new Date()) {
  const dob = new Date(dateOfBirthISO);
  return now.getMonth() === dob.getMonth() && now.getDate() === dob.getDate();
}

export function formatMonthShort(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleString("en-US", { month: "short" }).toUpperCase();
}

export function formatDay(dateISO: string) {
  return new Date(dateISO).getDate();
}

export function daysUntilBirthday(dateOfBirthISO: string, now = new Date()) {
  const dob = new Date(dateOfBirthISO);
  const next = new Date(now);
  next.setHours(0, 0, 0, 0);

  next.setMonth(dob.getMonth());
  next.setDate(dob.getDate());

  if (next < now) next.setFullYear(next.getFullYear() + 1);

  const ms = next.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
