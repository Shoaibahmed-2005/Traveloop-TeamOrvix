import { format, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (dateStr, fmt = 'MMM d, yyyy') => {
  if (!dateStr) return '';
  try { return format(parseISO(dateStr), fmt); }
  catch { return dateStr; }
};

export const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  return `${formatDate(start, 'MMM d')} – ${formatDate(end, 'MMM d, yyyy')}`;
};

export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(0, differenceInDays(parseISO(end), parseISO(start)));
};

export const daysRemaining = (startDate) => {
  if (!startDate) return 0;
  return Math.max(0, differenceInDays(parseISO(startDate), new Date()));
};
