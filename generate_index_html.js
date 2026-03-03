const fs = require('fs');

const jsxContent = fs.readFileSync('src/components/CoNguyenMap.jsx', 'utf8');

// Replace `export default function CoNguyenMap` with `function CoNguyenMap`
// Strip out any `import React` statements as we are using the global React object from CDN
const modifiedJsx = jsxContent
  .replace(/export default function CoNguyenMap/, 'function CoNguyenMap')
  .replace(/import\s+.*?from\s+['"]react['"];?/g, '');

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cố Nguyên Giới (固元界) - Interactive Map</title>

  <!-- React and ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

  <!-- Babel for compiling JSX in the browser -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0e14;
      font-family: 'Noto Serif', 'Songti SC', Georgia, serif;
      color: #d4c5a9;
      overflow: hidden; /* Map handles its own scrolling/zooming */
    }
    #root {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel" data-type="module">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    // --- Component Code Below ---
${modifiedJsx.split('\n').map(line => '    ' + line).join('\n')}
    // --- Component Code Above ---

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<CoNguyenMap />);
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('index.html updated successfully.');
