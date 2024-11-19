const animEndEventNames = {
  WebkitAnimation: "webkitAnimationEnd",
  OAnimation: "oAnimationEnd",
  msAnimation: "MSAnimationEnd",
  animation: "animationend",
};

const support = { animations: true };

const animEndEventName = animEndEventNames["animation"];

/**
 * Adds an event listener for the end of an animation on a given element.
 * @param {HTMLElement} el - The element to which the listener is added.
 * @param {Function} callback - The function to call when the animation ends.
 */
function onEndAnimation(el, callback) {
  const onEndCallbackFn = function (ev) {
    if (support.animations) {
      if (ev.target !== this) return;
      this.removeEventListener(animEndEventName, onEndCallbackFn);
    }
    if (callback && typeof callback === "function") {
      callback.call();
    }
  };
  if (support.animations) {
    el.addEventListener(animEndEventName, onEndCallbackFn);
  } else {
    onEndCallbackFn();
  }
}

module.exports = { onEndAnimation, support, animEndEventName };
