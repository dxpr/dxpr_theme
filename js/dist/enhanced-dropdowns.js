/* global BootstrapEnhancedDropdowns */
(function (Drupal, once) {
  Drupal.behaviors.bsEnhancedDropdownInit = {
    attach(context, settings) {
      if (once("bs-enhanced-dropdowns-init", "html", context).length) {
        new BootstrapEnhancedDropdowns({
          selector: "ul.menu.enhanced-dropdowns",
          autoInit: true,
        });
      }
    },
  };
})(Drupal, once);
