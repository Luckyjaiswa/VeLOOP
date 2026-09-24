/**
 * Format date string to friendly readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format relative time
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return formatDate(dateString);
};

/**
 * Format currency display
 */
export const formatCurrency = (amount, currency = 'VE') => {
  if (currency === 'INR') {
    return `₹${amount}`;
  }
  return `${amount} VEs`;
};

/**
 * Pad number with leading zero
 */
export const padZero = (num) => {
  return String(num).padStart(2, '0');
};
