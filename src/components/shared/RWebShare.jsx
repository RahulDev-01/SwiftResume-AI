import React from 'react';

// Drop-in replacement for 'react-web-share' RWebShare using the native Web Share API
// Props:
// - data: { title?: string, text?: string, url?: string, files?: File[] }
// - onClick?: () => void
// - children: ReactNode (rendered as-is; we attach onClick handler)
export function RWebShare({ data = {}, onClick, children }) {
  const handleShare = async (e) => {
    e?.preventDefault?.();
    try {
      onClick?.();
    } catch { /* ignore */ }

    const { title, text, url, files } = data || {};

    // Prefer navigator.share if available
    try {
      if (navigator.share) {
        // Some browsers support files with navigator.canShare
        if (files && files.length && navigator.canShare && navigator.canShare({ files })) {
          await navigator.share({ title, text, url, files });
          return;
        }
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      // User cancelled or share failed, fallback below
    }

    // Fallback: copy URL to clipboard if provided
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
        return;
      } catch {
        alert(url);
        return;
      }
    }

    // If no URL, just notify
    alert('Sharing is not supported on this device/browser.');
  };

  // If child is a valid element, clone to attach onClick; else wrap in span
  if (React.isValidElement(children)) {
    const existingOnClick = children.props?.onClick;
    return React.cloneElement(children, {
      onClick: (e) => {
        existingOnClick?.(e);
        handleShare(e);
      },
    });
  }

  return (
    <span role="button" tabIndex={0} onClick={handleShare} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleShare(e); } }}>
      {children}
    </span>
  );
}
