import { Graph, Markup } from '@antv/x6';

export const makeBaseNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string,
  iconMarkup: any,
  iconAttrs?: any
) => {
  return {
    shape: 'rect',
    x,
    y,
    width: 56,
    height: 56,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      ...iconMarkup,
      {
        tagName: 'text',
        selector: 'title',
      },
    ],
    attrs: {
      title: {
        text: title,
        refX: 80,
        refY: 10,
      },
      icon: {
        refX: 15,
        refY: 15,
        fill: 'white',
      },
      body: {
        fill: '#ED8A19',
        stroke: 'white',
        strokeWidth: 4,
        refPoints: '0,10 10,0 20,10 10,20',
      },
      ...iconAttrs,
    },
  };
};

export const makeAssignNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  return makeBaseNode(x, y, fill, stroke, title, [
    {
      tagName: 'path',
      selector: 'icon',
      attrs: {
        d: 'M17 16v-2H7v2h10m2-13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14m-2 7V8H7v2h10z',
      },
    },
  ]);
};

export const makeLoopNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  return makeBaseNode(x, y, fill, stroke, title, [
    {
      tagName: 'path',
      selector: 'icon',
      attrs: {
        d: 'M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L7.8 14.39c-.64.64-1.49.99-2.4.99C3.53 15.38 2 13.87 2 12c0-1.87 1.53-3.38 3.4-3.38c.91 0 1.76.35 2.44 1.03l1.13 1l1.53-1.34L9.22 8.2A5.37 5.37 0 0 0 5.4 6.62C2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l7.03-6.24c.64-.64 1.49-.99 2.4-.99c1.87 0 3.4 1.51 3.4 3.38c0 1.87-1.53 3.38-3.4 3.38c-.9 0-1.76-.35-2.44-1.03L15 13.34l-1.5 1.34l1.28 1.12a5.386 5.386 0 0 0 3.82 1.57c2.98 0 5.4-2.41 5.4-5.37c0-3-2.42-5.38-5.4-5.38z',
      },
    },
  ]);
};

export const makeSortNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  return makeBaseNode(x, y, fill, stroke, title, [
    {
      tagName: 'path',
      selector: 'icon',
      attrs: {
        d: 'M10.73 13.79c.29.28.75.28 1.04 0l2.75-2.65a.75.75 0 1 0-1.04-1.08L12 11.486V2.75a.75.75 0 0 0-1.5 0v8.736L9.02 10.06a.75.75 0 1 0-1.04 1.08l2.75 2.65zM5.28 2.22a.75.75 0 0 0-1.06 0L1.47 4.97a.75.75 0 0 0 1.06 1.06L4 4.56v8.69a.75.75 0 0 0 1.5 0V4.56l1.47 1.47a.75.75 0 0 0 1.06-1.06L5.28 2.22z',
      },
    },
  ]);
};

export const makeReocrdCreateNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  const { markup, attrs } = Markup.xml2json(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 24 24" width = "24" height = "24" >
      <path fill="none" d = "M0 0h24v24H0z" />
      <path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zM11 11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
    </svg>
  `);
  return makeBaseNode(x, y, fill, stroke, title, markup, attrs);
};

export const makeReocrdUpdateNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  const { markup, attrs } = Markup.xml2json(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0L24 0 24 24 0 24z"/>
      <path d="M20 2c.552 0 1 .448 1 1v3.757l-2 2V4H5v16h14v-2.758l2-2V21c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V3c0-.552.448-1 1-1h16zm1.778 6.808l1.414 1.414L15.414 18l-1.416-.002.002-1.412 7.778-7.778zM13 12v2H8v-2h5zm3-4v2H8V8h8z"/>
    </svg>
  `);
  return makeBaseNode(x, y, fill, stroke, title, markup, attrs);
};

export const makeReocrdFindNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  const { markup, attrs } = Markup.xml2json(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z"/><path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zm10.529 11.454a4.002 4.002 0 0 1-4.86-6.274 4 4 0 0 1 6.274 4.86l2.21 2.21-1.414 1.415-2.21-2.21zm-.618-2.032a2 2 0 1 0-2.828-2.828 2 2 0 0 0 2.828 2.828z"/>
    </svg>
  `);
  return makeBaseNode(x, y, fill, stroke, title, markup, attrs);
};

export const makeReocrdDeleteNode = (
  x: number,
  y: number,
  fill: string,
  stroke: string,
  title: string
) => {
  const { markup, attrs } = Markup.xml2json(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M19 9h-5V4H5v7.857l1.5 1.393L10 9.5l3 5 2-2.5 3 3-3-.5-2 2.5-3-4-3 3.5-2-1.25V20h14V9zm2-1v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8z"/>
    </svg>
  `);
  return makeBaseNode(x, y, fill, stroke, title, markup, attrs);
};
