/* eslint-disable no-unreachable */
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module 'rn-range-slider';

declare module 'easy-beauty-components---react';

declare module 'text-formatter-js';

declare module 'react-native-animated-hide-view';

// npm install --save-dev @types/react-native-paper

declare module 'react-native-paper';
