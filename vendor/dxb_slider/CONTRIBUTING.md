# Contributing to DXB Slider

## Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd slider
```

2. Install dependencies (requires Node.js 22+):
```bash
npm install
```
This will automatically:
- Install all dependencies
- Set up Git hooks for testing and commit message validation

## Available Commands

- `npm test`: Runs the test suite
- `npm start`: Runs the default gulp task which:
  - Minifies JS and CSS files
  - Watches for changes and automatically rebuilds
  - Keeps running until you stop it (Ctrl+C)

- `npm run build`: One-time build that:
  - Minifies JavaScript (dxb-slider.js → dxb-slider.min.js)
  - Minifies CSS (dxb-slider.css → dxb-slider.min.css)

## Git Workflow

The repository is set up with automated checks:
- Pre-commit: Tests run automatically before each commit
- Commit messages: Must follow the [Conventional Commits](https://www.conventionalcommits.org/) format
  - Example: `feat: add RTL support`
  - Example: `fix: resolve slider initialization issue`
  - Example: `docs: update installation instructions`

To skip checks in emergency situations:
```bash
git commit -m "feat: urgent update" --no-verify
```

## File Structure

- `dxb-slider.js` - Main source JavaScript file
- `dxb-slider.css` - Main source CSS file
- `dxb-slider.min.js` - Minified JavaScript (auto-generated)
- `dxb-slider.min.css` - Minified CSS (auto-generated)
- `index.html` - Example implementation and test page

## Development Workflow

1. Make changes to source files (`dxb-slider.js` or `dxb-slider.css`)
2. Run `npm start` to automatically rebuild minified files on changes
3. Open `index.html` in your browser to test changes
4. Submit a pull request with your changes

## Build Process

The build process uses Gulp with the following plugins:
- gulp-uglify: JavaScript minification
- gulp-cssnano: CSS minification
- gulp-rename: File renaming

See `gulpfile.js` for the complete build configuration.

## File Size

DXB Slider aims to maintain its small footprint (currently <1KB minified). When making changes, please ensure they don't significantly increase the file size.

## Testing

Before submitting a pull request:
1. Test all slider functionality in both LTR and RTL modes
2. Verify mobile device compatibility
3. Check accessibility features
4. Test with different step values (whole numbers and decimals)

## Questions?

If you have questions about contributing, please open an issue in the repository.