import React from 'react';
import Markdown from 'react-markdown';

export default function MarkdownRenderer({ content, className = '' }: { content: string; className?: string }) {
  if (!content) return null;
  
  return (
    <div className={`markdown-wrapper leading-relaxed text-xs ${className}`}>
      <style>{`
        .markdown-wrapper h1, .markdown-wrapper h2, .markdown-wrapper h3, .markdown-wrapper h4, .markdown-wrapper h5, .markdown-wrapper h6 {
          font-weight: 800;
          color: inherit;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .markdown-wrapper p {
          margin-bottom: 0.75em;
          white-space: pre-wrap;
        }
        .markdown-wrapper ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .markdown-wrapper ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .markdown-wrapper li {
          margin-bottom: 0.25em;
        }
        .markdown-wrapper strong, .markdown-wrapper b {
          font-weight: 800;
          color: inherit;
        }
        .markdown-wrapper em, .markdown-wrapper i {
          font-style: italic;
        }
        .markdown-wrapper a {
          color: #2563eb;
          text-decoration: underline;
        }
        .markdown-wrapper a:hover {
          color: #1d4ed8;
        }
      `}</style>
      <Markdown>{content}</Markdown>
    </div>
  );
}
