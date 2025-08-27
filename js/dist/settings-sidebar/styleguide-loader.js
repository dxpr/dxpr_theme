/**
 * @file
 * Styleguide loading functionality for theme settings sidebar.
 */

function loadStyleguide() {
  requestAnimationFrame(function() {
    var contentRegion = document.querySelector('.region-content');
    if (contentRegion) {
      var styleguideDiv = document.createElement('div');
      styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2><p>Loading...</p>';
      contentRegion.insertBefore(styleguideDiv, contentRegion.firstChild);
      
      // Get styleguide URL from Drupal settings or construct it
      var styleguideUrl = drupalSettings.dxpr_theme && drupalSettings.dxpr_theme.styleguide_url 
        ? drupalSettings.dxpr_theme.styleguide_url 
        : window.location.origin + window.location.pathname.replace('/admin/appearance/settings', '') + '/themes/custom/dxpr_theme/resources/styleguide.html';
      
      fetch(styleguideUrl)
        .then(function(response) { 
          return response.text(); 
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var cheatsheet = doc.querySelector('.bd-cheatsheet');
          if (cheatsheet) {
            styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2>' + cheatsheet.outerHTML;
          }
        })
        .catch(function(error) {
          console.warn('Failed to load styleguide:', error);
          styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2><p>Failed to load styleguide content.</p>';
        });
    }
  });
}

module.exports = { loadStyleguide };
