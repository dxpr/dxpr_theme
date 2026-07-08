/**
 * @file
 * Client-side active trail detection for menu links.
 *
 * Supplements core's built-in active trail with client-side detection so that
 * the server-rendered menu does not need a url.path cache context. This covers
 * edge cases such as Views-generated menu links that core does not mark as
 * active (see https://www.drupal.org/project/drupal/issues/3359511).
 */

(function (Drupal) {
  Drupal.behaviors.dxprThemeActiveTrail = {
    attach(context) {
      if (context !== document) {
        return;
      }
      const currentPath = window.location.pathname;
      const menuLinks = document.querySelectorAll(".menu--main a[href]");
      menuLinks.forEach((link) => {
        const linkPath = link.pathname;
        if (linkPath === currentPath) {
          link.classList.add("is-active");
          let li = link.closest("li");
          while (li) {
            li.classList.add("menu-item--active-trail");
            li.classList.add("active");
            const parentUl = li.parentElement;
            if (parentUl) {
              li = parentUl.closest("li");
            } else {
              break;
            }
          }
        }
      });
    },
  };
})(Drupal);
