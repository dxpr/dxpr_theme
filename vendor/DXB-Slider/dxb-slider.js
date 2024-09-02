// dxb-slider.js

(function() {
  function initDXBSliders() {
    document.querySelectorAll('[data-dxb-slider]:not([data-dxb-initialized])').forEach(rangeInput => {
      const container = rangeInput.closest('.dxb-slider-wrapper');

      // Create number input programmatically
      const numberInput = document.createElement('input');
      numberInput.type = 'number';
      numberInput.className = 'dxb-slider-value';
      numberInput.setAttribute('tabindex', '-1');
      numberInput.setAttribute('pattern', '[0-9]*');

      const step = parseFloat(rangeInput.step);
      if (step && step % 1 !== 0) {
        numberInput.setAttribute('inputmode', 'decimal');
      } else {
        numberInput.setAttribute('inputmode', 'numeric');
      }

      container.appendChild(numberInput);

      function updateValue() {
        const val = rangeInput.value;
        const min = rangeInput.min;
        const max = rangeInput.max;
        const percent = (val - min) / (max - min) * 100;
        rangeInput.style.setProperty('--value-percent', `${percent}%`);
        numberInput.value = val;
        numberInput.min = min;
        numberInput.max = max;
        rangeInput.setAttribute('aria-valuenow', val);
      }

      rangeInput.addEventListener('input', updateValue);
      numberInput.addEventListener('input', () => {
        rangeInput.value = numberInput.value;
        updateValue();
        rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
      });

      numberInput.addEventListener('change', () => {
        rangeInput.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // Set initial ARIA attributes
      rangeInput.setAttribute('aria-valuemin', rangeInput.min);
      rangeInput.setAttribute('aria-valuemax', rangeInput.max);

      updateValue();

      // Mark as initialized
      rangeInput.setAttribute('data-dxb-initialized', 'true');
    });
  }

  initDXBSliders();

  const observer = new MutationObserver(mutations => {
    let shouldInit = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('[data-dxb-slider]') || node.querySelector('[data-dxb-slider]'))) {
            shouldInit = true;
            break;
          }
        }
        if (shouldInit) break;
      }
    }
    if (shouldInit) {
      initDXBSliders();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
