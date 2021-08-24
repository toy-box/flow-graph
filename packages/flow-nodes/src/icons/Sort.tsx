import React, { SVGProps } from 'react';

export function Sort(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      fill="currentColor"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 6v36"></path>
        <path d="M7 17.9l12-12"></path>
        <path d="M29 42.1v-36"></path>
        <path d="M29 42.1l12-12"></path>
      </g>
    </svg>
  );
}
