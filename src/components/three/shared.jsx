import { Component } from "react";

// If WebGL is unavailable the canvas throws; render nothing rather than break the page.
export class WebGLBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Pointer position normalized to -1..1 across the whole window (not just the canvas).
export const windowPointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (event) => {
      windowPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      windowPointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}
