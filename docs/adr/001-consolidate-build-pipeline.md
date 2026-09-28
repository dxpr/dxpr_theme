# ADR 001: Consolidate Build Pipeline

## Status

Proposed

## Context

The theme currently uses two separate build systems:

1. **Grunt** (`Gruntfile.js`) — orchestrates SCSS compilation (`grunt-sass`), CSS post-processing (`autoprefixer`, `postcss-pxtorem`), and JS minification (`terser`)
2. **Webpack** (`webpack.config.js`) — handles JS bundling and Babel transpilation

This creates maintenance overhead (two configs, two sets of plugins) and increases contributor onboarding friction.

## Decision

Consolidate into a single Webpack-based pipeline that handles:

- SCSS compilation via `sass-loader`
- CSS post-processing via `postcss-loader` (autoprefixer, pxtorem)
- JS bundling and transpilation via `babel-loader` (already in use)
- JS minification via `terser-webpack-plugin`

## Consequences

### Positive

- Single build config (`webpack.config.js`)
- Remove `Gruntfile.js` and Grunt-specific dependencies
- Enable tree-shaking for JS bundles
- Consistent source maps across CSS and JS
- Fewer dev dependencies to maintain

### Negative

- Migration effort required
- Docker build commands (`docker-compose.yml`) need updating
- Must verify output compatibility with Drupal library definitions

### Risks

- CSS output must remain identical to avoid visual regressions
- The `postcss-pxtorem` plugin behavior must be preserved
- Drupal.org packaging requirements must still be met (artifacts committed to repo)

## Alternatives Considered

- **Vite**: Faster dev builds but less Drupal ecosystem precedent
- **Keep Grunt, remove Webpack**: Grunt is effectively unmaintained
