import { LitElement, html } from "../../assets/js/vendor/lit.js";

// Generates the stop array for band i given a blur-start percentage and step size.
// Each band is a 3-step window (fade-in, peak, fade-out), advancing by one step per layer.
function generateBands(blurStart) {
  const step = (100 - blurStart) / 8;
  return Array.from({ length: 8 }, (_, i) => {
    const inner = blurStart + i * step;
    const peakStart = inner + step;
    const peakEnd = peakStart + step;
    const outer = peakEnd + step;
    const stops = [[0, 0], [inner, 0], [peakStart, 1]];
    if (peakEnd <= 100) stops.push([peakEnd, 1]);
    if (outer <= 100) stops.push([outer, 0]);
    return stops;
  });
}

// Encodes one layer's mask as an SVG data URI.
// gradientTransform: translate to center → rotate → scale to ellipse axes.
// Alpha channel (stop-opacity) drives the CSS mask — opaque = blur visible, transparent = blur hidden.
function makeMaskUri(w, h, rx, ry, rotation, stops) {
  const cx = w / 2;
  const cy = h / 2;
  const gt = `translate(${cx},${cy}) rotate(${rotation}) scale(${w * rx},${h * ry})`;
  const stopMarkup = stops
    .map(([o, a]) => `<stop offset="${o}%" stop-color="black" stop-opacity="${a}"/>`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<defs><radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="${gt}">` +
    stopMarkup +
    `</radialGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const BLUR_PX = [0.5, 1, 2, 4, 8, 16, 32, 64];

export class GradientBlurElliptical extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    rx: { type: Number },
    ry: { type: Number },
    rotation: { type: Number },
    blurStart: { type: Number, attribute: "blur-start" },
    _w: { state: true },
    _h: { state: true },
  };

  constructor() {
    super();
    this.rx = 0.95;
    this.ry = 0.65;
    this.rotation = 0;
    this.blurStart = 80;
    this._w = 0;
    this._h = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    Object.assign(this.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      zIndex: "5",
      display: "block",
    });
    this._ro = new ResizeObserver(([entry]) => {
      this._w = entry.contentRect.width;
      this._h = entry.contentRect.height;
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  render() {
    const { _w: w, _h: h, rx, ry, rotation, blurStart } = this;
    if (!w || !h) return html``;

    const bands = generateBands(blurStart);

    return html`${BLUR_PX.map((blur, i) => {
      const mask = makeMaskUri(w, h, rx, ry, rotation, bands[i]);
      const style = [
        "position:absolute",
        "inset:0",
        `z-index:${i + 1}`,
        `backdrop-filter:blur(${blur}px)`,
        `-webkit-backdrop-filter:blur(${blur}px)`,
        `mask-image:${mask}`,
        "mask-size:100% 100%",
        "mask-repeat:no-repeat",
        `-webkit-mask-image:${mask}`,
        "-webkit-mask-size:100% 100%",
        "-webkit-mask-repeat:no-repeat",
      ].join(";");
      return html`<div style="${style}"></div>`;
    })}`;
  }
}

customElements.define("gradient-blur-elliptical", GradientBlurElliptical);
