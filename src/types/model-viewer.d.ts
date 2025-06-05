declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        ar?: boolean;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        'camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        style?: React.CSSProperties;
        alt?: string;
      },
      HTMLElement
    >;
  }
}
