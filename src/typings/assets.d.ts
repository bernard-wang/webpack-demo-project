declare module '*?inline' {
  const src: string;
  export default src;
}

declare module '*?resource' {
  const src: string;
  export default src;
}

declare module '*?source' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.htm' {
  const src: string;
  export default src;
}

declare module '*.html' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.txt' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.global.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.pure.css' {
  const classes: never;
  export default classes;
}
