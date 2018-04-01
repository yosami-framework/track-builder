# track-builder
Build environment for track app.

[![Build Status](https://travis-ci.org/yosami-framework/track-builder.svg?branch=master)](https://travis-ci.org/yosami-framework/track-builder)

## Installation

### npm

```shell
npm install track-builder
```

### write webpack.config.js

```javascript
module.exports = require('track-builder/lib/webpack')(__dirname, ['last 2 versions', 'ie >= 10']);
```
