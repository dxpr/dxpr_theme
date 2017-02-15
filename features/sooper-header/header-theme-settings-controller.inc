<?php
function glazedNavFastInit() {
  if ($breakpoint = theme_get_setting('header_mobile_breakpoint')) {
    if ($breakpoint > 4099) {
      $breakpoint = 99999;
    }
  }
  else {
    $breakpoint = 1200;
  }
  $nav_init = <<<EOT
  <script>
  var glazedNavBreakpoint = {$breakpoint};
  var glazedWindowWidth = window.innerWidth;
  if (glazedWindowWidth > glazedNavBreakpoint) {
    document.body.className += ' body--glazed-nav-desktop';
  }
  else {
    document.body.className += ' body--glazed-nav-mobile';
  }
  </script>
EOT;
  return $nav_init;
}
