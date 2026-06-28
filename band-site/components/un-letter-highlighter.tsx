"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGET_SEQUENCE = /un/gi;
const SKIP_SELECTOR = "script, style, noscript, svg, canvas, input, textarea, select, option, code, pre, .un-letter, .no-un-highlight";

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) {
    return true;
  }

  TARGET_SEQUENCE.lastIndex = 0;
  return !TARGET_SEQUENCE.test(node.nodeValue || "") || Boolean(parent.closest(SKIP_SELECTOR));
}

function highlightTextNode(node: Text) {
  if (shouldSkipTextNode(node)) {
    TARGET_SEQUENCE.lastIndex = 0;
    return;
  }

  const text = node.nodeValue || "";
  TARGET_SEQUENCE.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TARGET_SEQUENCE.exec(text))) {
    if (match.index > lastIndex) {
      fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    const span = document.createElement("span");
    span.className = "un-letter";
    span.textContent = match[0];
    fragment.append(span);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    fragment.append(document.createTextNode(text.slice(lastIndex)));
  }

  node.replaceWith(fragment);
}

function highlightRoot(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkipTextNode(node as Text) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  nodes.forEach(highlightTextNode);
}

export function UnLetterHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/iron-county-ghosts") || pathname.startsWith("/label/ai-artists/iron-county-ghosts")) {
      return;
    }

    highlightRoot(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            highlightTextNode(node as Text);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (!element.matches(SKIP_SELECTOR)) {
              highlightRoot(element);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
