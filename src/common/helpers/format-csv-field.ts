export const formatCsvField = (value: any): string => {
  if (value === null || value === undefined || value === '')
    return '-';

  const str = String(value);

  if (/[",\n\r]/.test(str))
    return `"${str.replaceAll('"', '""')}"`;

  return str;
};