/**
 * @file
 * Wraps diff header and controls in a card.
 */

(function (Drupal, once) {
  Drupal.behaviors.dxprThemeDiff = {
    attach(context) {
      once("dxpr-diff-card", ".diff-header", context).forEach((header) => {
        const controls = header.nextElementSibling;
        if (controls && controls.classList.contains("diff-controls")) {
          const navigation = header.querySelector(".diff-navigation");
          const container = document.createElement("div");
          container.className = "container";
          const card = document.createElement("div");
          card.className = "card my-3";
          const cardBody = document.createElement("div");
          cardBody.className = "card-body";
          header.parentNode.insertBefore(container, header);
          container.appendChild(card);
          card.appendChild(cardBody);
          cardBody.appendChild(header);
          if (navigation) {
            cardBody.appendChild(navigation);
          }
          cardBody.appendChild(controls);
        }
      });
    },
  };
})(Drupal, once);
