import React, { SVGProps } from 'react';

export function Loop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      fill="currentColor"
      {...props}
    >
      <path
        d="M23.625 22.587a6.129 6.129 0 0 1-4.5-1.9l-3.1-3.2l-3.1 3.2a6.458 6.458 0 0 1-9.1 0a7.028 7.028 0 0 1-1.8-4.7a6.655 6.655 0 0 1 1.9-4.7a6.338 6.338 0 0 1 9 0l3.1 3.2l3.1-3.2a6.338 6.338 0 0 1 9 0a6.828 6.828 0 0 1 0 9.4a6.542 6.542 0 0 1-4.5 1.9zm-6.2-6.6l3.1 3.3a4.406 4.406 0 0 0 6.2 0a4.908 4.908 0 0 0 0-6.6a4.406 4.406 0 0 0-6.2 0zm-9-4.6a4.158 4.158 0 0 0-3.1 1.3a4.838 4.838 0 0 0 0 6.6a4.406 4.406 0 0 0 6.2 0l3.1-3.3l-3.1-3.3a4.77 4.77 0 0 0-3.1-1.3z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
