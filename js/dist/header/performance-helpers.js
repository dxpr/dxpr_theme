/**
 * Throttle function to limit the rate at which a function is called.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} wait - The time in milliseconds to wait.
 * @param {Object} options - Options for leading and trailing.
 * @returns {Function} - Throttled version of the function.
 */
export function throttle(func, wait, options = {}) {
  let context, args, result;
  let timeout = null;
  let previous = 0;

  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  return function (...args) {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}

/**
 * Debounce function to delay execution of a function with cancel option.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The time in milliseconds to wait before executing.
 * @returns {Function} - Debounced version of the function.
 */
export function debounce(func, wait) {
  let timeout;

  const debounced = function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * Delay function to execute a function after a specified time.
 * @param {Function} func - The function to delay.
 * @param {number} wait - The time in milliseconds to delay.
 * @param {...*} args - Additional arguments to pass to the function.
 * @returns {number} - Timeout ID which can be used to cancel the delay.
 */
export function delay(func, wait, ...args) {
  return setTimeout(() => func(...args), wait);
}
