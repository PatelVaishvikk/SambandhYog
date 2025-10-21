import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(value?: string | number | Date): string {
  if (!value) return '';
  return dayjs(value).fromNow();
}

export function formatDisplayDate(value?: string | number | Date): string {
  if (!value) return '';
  return dayjs(value).format('MMM D, YYYY');
}