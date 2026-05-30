import React, { useEffect, useRef } from 'react';

interface CodePreviewProps {
  code: string;
}

/**
 * CodePreview — renders generated React + Tailwind code in a sandboxed iframe.
 * Uses Babel standalone (CDN) + Tailwind CDN inside the iframe for zero-bundle rendering.
 *
 * SECURITY: The iframe has a strict sandbox attribute. `allow-same-origin` is intentionally
 * omitted to prevent the sandboxed content from accessing parent window APIs.
 */
export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = buildPreviewHtml(code);
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      title="Component Preview"
      aria-label="Live component preview"
      sandbox="allow-scripts"
      className="h-full w-full rounded-lg border border-gray-200 bg-white"
    />
  );
};

/**
 * Builds a self-contained HTML document that:
 * 1. Loads Tailwind CSS from CDN
 * 2. Loads React + ReactDOM from CDN (puts React in global scope for Babel)
 * 3. Loads Babel standalone from CDN
 * 4. Inlines the generated component code and renders it to #root
 */
function buildPreviewHtml(componentCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { margin: 1rem; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
${componentCode}
const root = ReactDOM.createRoot(document.getElementById('root'));
// The component export default is the last export — render it
const ComponentToRender = typeof exports !== 'undefined' ? exports.default : undefined;
if (ComponentToRender) {
  root.render(React.createElement(ComponentToRender));
} else {
  document.getElementById('root').textContent = 'Could not render component.';
}
  </script>
</body>
</html>`;
}
