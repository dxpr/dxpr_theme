For documentation on using this subtheme please see:
https://dxpr.com/documentation/creating-dxpr-theme-drupal-9-subtheme

## Custom colour palette presets

Sub-themes can ship their own named colour palette presets by placing a
`color-settings.json` file in the sub-theme root directory. These presets
appear alongside the built-in ones in the theme settings colour scheme dropdown.

The file uses the same format as the base theme's colour settings. A minimal
example that adds one preset:

```json
{
  "schemes": {
    "mybrand": {
      "title": "My Brand",
      "colors": {
        "base": "#2b6cb0",
        "basetext": "#ffffff",
        "link": "#2c5282",
        "accent1": "#38a169",
        "accent1text": "#ffffff",
        "accent2": "#d69e2e",
        "accent2text": "#ffffff",
        "text": "#2d3748",
        "headings": "#1a202c",
        "card": "#ffffff",
        "cardtext": "#2d3748",
        "footer": "#1a202c",
        "footertext": "#e2e8f0",
        "secheader": "#2b6cb0",
        "secheadertext": "#ffffff",
        "header": "#ffffff",
        "headertext": "#2d3748",
        "headerside": "#1a202c",
        "headersidetext": "#e2e8f0",
        "pagetitle": "#2b6cb0",
        "pagetitletext": "#ffffff",
        "graylight": "#e2e8f0",
        "graylighter": "#edf2f7",
        "silver": "#f7fafc",
        "body": "#ffffff"
      }
    }
  }
}
```

You can define multiple presets in the same file. To override a built-in preset,
use its machine name as the key (e.g. `"default"`). Sub-theme presets take
precedence over base theme presets with the same key.
