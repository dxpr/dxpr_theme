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
          if (!response.ok) {
            throw new Error('HTTP ' + response.status + ': ' + response.statusText);
          }
          return response.text(); 
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var cheatsheet = doc.querySelector('.bd-cheatsheet');
          
          if (cheatsheet) {
            styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2>' + cheatsheet.outerHTML;
          } else {
            // User-facing fallback when .bd-cheatsheet element is not found
            styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2><div class="alert alert-warning"><p><strong>Notice:</strong> Styleguide content structure has changed. The expected content section (.bd-cheatsheet) was not found in the loaded HTML.</p><p>This may indicate a change in the styleguide format or a configuration issue.</p></div>';
          }
        })
        .catch(function(error) {
          console.warn('Failed to load styleguide:', error);
          
          // User-facing fallback with specific error information
          var errorMessage = error.message || 'Unknown error occurred';
          styleguideDiv.innerHTML = '<h2>Bootstrap Styleguide</h2><div class="alert alert-danger"><p><strong>Error:</strong> Failed to load styleguide content.</p><p><strong>Details:</strong> ' + errorMessage + '</p><p>Please check your network connection and ensure the styleguide file is accessible.</p></div>';
        });
    }
  });
}

module.exports = { loadStyleguide };
