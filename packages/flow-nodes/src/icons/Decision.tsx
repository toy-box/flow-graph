import React, { SVGProps } from 'react';

export function Decision(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        d="M11 5H8l4-4l4 4h-3v4.43c-.75.46-1.42 1.03-2 1.69V5m11 6l-4-4v3a6.747 6.747 0 0 0-7 6.17A3.006 3.006 0 0 0 9.17 20A3.006 3.006 0 0 0 13 21.83A3.01 3.01 0 0 0 14.83 18c-.3-.86-.98-1.53-1.83-1.83c.47-4 4.47-4.2 4.95-4.2v3L22 11m-11.37.59A7.632 7.632 0 0 0 6 10V7l-4 4l4 4v-3c1.34.03 2.63.5 3.64 1.4c.25-.64.58-1.25.99-1.81z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
