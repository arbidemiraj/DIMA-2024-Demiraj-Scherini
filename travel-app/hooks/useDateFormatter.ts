const useDateFormatter = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const parts = formattedDate.split(', ');
  const monthParts = parts[0].split(' ');
  return `${monthParts[1]}-${monthParts[0]} ${parts[1]}`.toLowerCase();
};

export default useDateFormatter;
