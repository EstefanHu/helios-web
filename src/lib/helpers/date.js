import { MONTHS } from '@/lib/constants/date';

export const slugifyDateToNumber = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('-');
};

const ordinateDate = (d) => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const slugifyDate = (date) => {
  let d = new Date(date),
    month = MONTHS[d.getMonth()].toLowerCase(),
    day = d.getDate() + ordinateDate(d.getDate()),
    year = '' + d.getFullYear();

  return [month, day, year].join('-');
};

export const dateToTitle = (date) => {
  const d = new Date(date);
  const day = d.getDate();

  return `${MONTHS[d.getMonth()]} ${day}${ordinateDate(day)}, ${d.getFullYear()}`;
};
