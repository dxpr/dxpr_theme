# Glazed Theme

Framework Theme that is central to SooperThemes products. All designs for sale on the site are using Glazed theme, with customized content and theme settings. For a quick live demo of the product visit http://www.trysooperthemes.com/

For testing and development it is preferred that your installation is based on the Main Demo installation profile. You can download it here: https://www.sooperthemes.com/download

## Workflow

* Develop and Test locally on your own machine
* Push  code to a development, feature or issue branch. Create pull request.
* I will test and give feedback
* If code is OK I will merge with the 7.x branch.
* Branches should be named 7.x-yourname-branchname

Branch naming examples:
```
7.x-jur-dev
```
```
7.x-jur-issue_777789
```
```
7.x-jur-typography_settings_googlefonts
```


### Prerequisites

* [Drupal 7](https://www.drupal.org/project/drupal)
* [Bootstrap basetheme](https://www.drupal.org/project/bootstrap)
* [jQuery Update](https://www.drupal.org/project/jquery_update) - Set to load 2.1 on frontend pages and 1.8 on seven theme)

### Installing

Installs like any other theme. Recommended: install glazed_helper (Glazed Theme Tools) module.

```
drush en glazed_builder -y
```

To enable the module on a field, set Glazed Builder formatter on any entity textfield. For example on Basic Page body field (example.com/admin/structure/types/manage/page/display). The builder should show when viewing a node of this type (not on de node/add or node/edit form).

### Developing

[Grunt](http://gruntjs.com/) is used to parse sass to CSS and combine JS files. Don't run npm install, development modules are included.

```
grunt
```

## Built With

* [Drupal 7](https://www.drupal.org/project/drupal) - The web framework used
* [jQuery](https://jquery.com/) - JS Framework
* [underscore](http://underscorejs.org/) - JS Tools
* [jQuery UI](https://jqueryui.com/) - Drag and Drop
* [Grunt](http://gruntjs.com/) - Combining JS and CSS files, adding CSS prefixes

## Versioning

This project follows [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jjroelofs/glazed/tags).

### Code Standards and Best Practices

* https://trello.com/b/LdWR68Cm/sooperthemes-drupal-wiki
* https://www.drupal.org/coding-standards

## Summary
Glazed Theme is a framework theme that we use to produce all designs listed on sooperthemes.com.
Glazed is designed as a tool to make Drupal theming both more productive and more accessible. Thanks to the approximatly 200 Theme Settings a ton of customization can be achieved without coding.

## Features

* Color Module Integration
* Bootstrap CSS and templates (via bootstrap basetheme)
* ~200 Theme Settings
* Custom Designed Theme Settings Form
* Componentized Code Architecture
* Dynamic File Based CSS for Theme Settings
* Integration with Glazed Builder (Helper Classes, Elements Styling)
* Integration with Glazed Drupal CMS installation profile

## Theme Settings By Component

### Block Design

* Block Design Preset (overrides below settings)
* Block Well Style
* Block Background Color (select)
* Block Background Custom Color
* Block Padding
* Block Border Radius
* Block Border Width
* Block Border Color
* Block Border Custom Color
* Block Title Font Size
* Block Title Align
* Block Title Well Style
* Block Title Background Color (select)
* Block Title Background Custom Color
* Block Title Border Width
* Block Title Border Radius
* Block Title Border Color
* Block Title Border Custom Color
* Block Title Align
* Block Title Sticker Style (flexible width and solid background)
* Block Divider
* Block Divider Custom
* Block Divider Color (select)
* Block Divider Custom Color
* Block Divider Width
* Block Divider Length
* Block Divider Spacing
* Block Regions To Apply  Custom Style To

[live preview HTML]

### Custom CSS/JS

* Sitewide CSS
* Sitewide Javascript
* SooperThemes Backlink On/Off

### Demo Import

* Export Theme Settings (read only)
* Import Theme Settings
* Import Demo Content
* Import Complete Side Demo

### Fonts

* Body Font
* Body Font CSS Selector
* Headings Font
* Headings Font CSS Selector
* Navigation Font
* Navigation Font CSS Selector
* Sitename Font
* Sitename Font CSS Selector
* Blockquote Font
* Blockquote Font CSS Selector

[Font list including local and Google fonts]

[live preview HTML]

### Header Design

* Header Position (Side/Top)
* Header (contents) Top Layout
* Top Header Style (overlay, pull down)
* Top Header Background Opacity
* Top Header Height
* Top Header Fixed Position
* Top Header Sticky
* Sticky Top Header Show Always/Offset
* Sticky Top Header Offset Distance
* Sticky Top Header Height After Offset Scroll
* Sticky Top Header Background Opacity After Offset Scroll

* Top Header Background Color (select)
* Top Header Background Custom Color
* Top Header Block Background Color (select)
* Top Header Block Background Custom Color
* Top Header Block Text Color (select)
* Top Header Block Text Custom Color
* Top Header Menu Background Color (select)
* Top Header Menu Background Custom Color
* Top Header Menu Text Color (select)
* Top Header Menu Text Custom Color
* Top Header Menu Hover Background Color (select)
* Top Header Menu Hover Background Custom Color
* Top Header Menu Hover Text Color (select)
* Top Header Menu Hover Text Custom Color
* Top Header Dropdown Background Color (select)
* Top Header Dropdown Background Custom Color
* Top Header Dropdown Text Color (select)
* Top Header Dropdown Text Custom Color
* Top Header Dropdown Hover Background Color (select)
* Top Header Dropdown Hover Background Custom Color
* Top Header Dropdown Hover Text Color (select)
* Top Header Dropdown Hover Text Custom Color

* Side Header Algin (left/center/right)
* Side Header Width

* Menu Font Style (uppercase/bold/lead)
* Menu Hover Style (opacity/background/text/border)
* Menu Border Position (top/bottom)
* Menu Border Animation
* Menu Border Position Offset
* Menu Border Position Offset In Sticky Header Mode
* Menu Border Width
* Menu Border Color
* Menu Border Color Custom

* Mobile Header Breakpoint
* Mobile Header Height

* Secondary Header Hide (never/x-small/small/medium)

### Layout

* Boxed Layout
* Sticky Footer
* Boxed Layout Background Color
* Boxed Container Max Width
* Content Max Width
* Space Between Columns (Vertical Gutter)
* Space Between Rows (horizontal Gutter)
* Container Spacing (between viewport and container)

* Background Image (media field)
* Background Image Style (cover/contain/no-repeat/repeat)
* Background Image Position

* Mobile Columns Spacing (vertical gutter)
* Mobile Rows Spacing (horizontal gutter)
* Mobile Container Spacing (between viewport and container)

* Full Width Regions
* Full Width Content Types

* Previous/Next Pager Content Types

### Page Title

* Show Breadcrumbs
* Hide on homepage
* Align Title
* Page Title Height
* Page Title Animation

* Page Title Background Image (media field)
* Background Image Opacity
* Background Image Style (cover/container/no-repeat/repeat)
* Background Image Mode (Normal/Parallax)
* Background Image Position

### Glazed Portfolio Settings

* Portfolio Details Position
* Portfolio Sidebar Width
* Portfolio Images Display Mode

### Typography

* Body Line Height
* Body Font Size
* Main Menu Font Size
* Headings Line Height
* Typography Scale Factor (overrides below settings)

* H1 Font size
* H2 Font size
* H3 Font size
* H4 Font size
* Blockquote Font size
* Blockquote Line Height
* Headings Letter Spacing
* Headings Uppercase

* Mobile Font Size
* H1 Mobile Font Size
* H2 Mobile Font Size
* H3 Mobile Font Size
* Blockquote Mobile Font Size

* Divider Thickness
* Divider Length
* Divider Position
* Divider Color

