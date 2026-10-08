import React from 'react';
import { createRoot } from 'react-dom/client';
import './preview-test.css';

// Temporary entry point. The original homepage remains in main.jsx.
createRoot(document.getElementById('root')).render(
  <main className="preview-test" dir="rtl">
    <h1>مرحبًا بك في من هنا</h1>
  </main>,
);
