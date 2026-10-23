import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      // Required for declaration merging to add React Three Fiber's JSX elements.
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
