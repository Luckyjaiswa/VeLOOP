import { useState, useEffect, useRef } from 'react';

/**
 * Live countdown hook based on server time and target date
 * @param {string|Date} targetDate - The next claim timestamp returned by backend
 * @param {Function} onExpire - Callback triggered when countdown hits 0 (to verify with backend)
 */
export const useCountdown = (targetDate, onExpire) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalSeconds: 0,
    isExpired: true,
  });

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({
        hours: '00',
        minutes: '00',
        seconds: '00',
        totalSeconds: 0,
        isExpired: true,
      });
      return;
    }

    hasTriggeredRef.current = false;

    const calculateTime = () => {
      const targetTime = new Date(targetDate).getTime();
      const currentTime = Date.now();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        setTimeLeft({
          hours: '00',
          minutes: '00',
          seconds: '00',
          totalSeconds: 0,
          isExpired: true,
        });

        if (!hasTriggeredRef.current && typeof onExpireRef.current === 'function') {
          hasTriggeredRef.current = true;
          // Notify parent to re-fetch backend status
          onExpireRef.current();
        }
        return false;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        totalSeconds,
        isExpired: false,
      });

      return true;
    };

    // Run immediately
    const shouldContinue = calculateTime();
    if (!shouldContinue) return;

    // Set interval to tick every second
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};
