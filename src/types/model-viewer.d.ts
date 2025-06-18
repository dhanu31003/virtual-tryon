declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        ar?: boolean;
        'ar-modes'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        'camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'camera-target'?: string;
        'field-of-view'?: string;
        style?: React.CSSProperties;
        alt?: string;
        loading?: string;
        'interaction-prompt'?: string;
        onLoad?: (event: any) => void;
      },
      HTMLElement
    >;
  }
}
