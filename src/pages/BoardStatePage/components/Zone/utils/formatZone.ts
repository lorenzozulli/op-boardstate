import type { ZoneField } from '../../../types';

export const formatSigned = (n: number): string =>
  n === 0 ? '±0' : (n > 0 ? '+' : '') + n;

export const formatZone = (field: ZoneField, value: number): string =>
  field === 'life' ? `♥ ${value}` : formatSigned(value);

export const zoneClass = (field: ZoneField, value: number): string => {
  if (field === 'life') return 'life';
  if (field === 'bonus') return value > 0 ? 'favorable' : value < 0 ? 'unfavorable' : '';
  return value < 0 ? 'favorable' : value > 0 ? 'unfavorable' : '';
};
