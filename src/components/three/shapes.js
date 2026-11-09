// Point-cloud generators for the morphing background. Each returns `count` xyz points centred on the origin.

const rand = (min, max) => min + Math.random() * (max - min);

// Standard normal sample (Box–Muller).
function gauss() {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Pixel positions of `text` drawn on a canvas, normalised so the text is 1 unit wide and centred.
function sampleText(text) {
  const width = 1024;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#fff";
  ctx.font = "italic 800 150px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  const data = ctx.getImageData(0, 0, width, height).data;

  const points = [];
  let minX = width;
  let maxX = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        points.push([x, y]);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }
  const span = Math.max(maxX - minX, 1);
  return points.map(([x, y]) => [(x - width / 2) / span, -(y - height / 2) / span]);
}

// A glass-like cube: bright edges, a dusting over the faces, and a name floating inside.
export function cubeShape(count, text, size = 3.2) {
  const out = new Float32Array(count * 3);
  const h = size / 2;
  const glyphs = sampleText(text);
  const edgeCount = Math.floor(count * (text ? 0.2 : 0.38));
  const textCount = glyphs.length ? Math.floor(count * 0.28) : 0;
  const textScale = size * 0.82;

  for (let i = 0; i < count; i++) {
    let x;
    let y;
    let z;
    if (i < edgeCount) {
      const axis = i % 3;
      const a = (Math.random() < 0.5 ? -1 : 1) * h;
      const b = (Math.random() < 0.5 ? -1 : 1) * h;
      const t = rand(-h, h);
      const j = () => gauss() * 0.015;
      [x, y, z] = axis === 0 ? [t, a + j(), b + j()] : axis === 1 ? [a + j(), t, b + j()] : [a + j(), b + j(), t];
    } else if (i < edgeCount + textCount) {
      const [tx, ty] = glyphs[Math.floor(Math.random() * glyphs.length)];
      x = tx * textScale + gauss() * 0.008;
      y = ty * textScale - 0.1 + gauss() * 0.008;
      z = h * 0.3 + gauss() * 0.02;
    } else {
      const axis = Math.floor(Math.random() * 3);
      const side = (Math.random() < 0.5 ? -1 : 1) * h + gauss() * 0.03;
      const u = rand(-h, h);
      const v = rand(-h, h);
      [x, y, z] = axis === 0 ? [side, u, v] : axis === 1 ? [u, side, v] : [u, v, side];
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

// A soft, wide cloud of data with a few stray points around it.
export function cloudShape(count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const stray = Math.random() < 0.12;
    out[i * 3] = stray ? rand(-7, 7) : gauss() * 2.3;
    out[i * 3 + 1] = stray ? rand(-3.5, 3.5) : gauss() * 1.1;
    out[i * 3 + 2] = stray ? rand(-4, 2) : gauss() * 1.4;
  }
  return out;
}

// A rippled orb with a dense core, like a neural cluster.
export function orbShape(count) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const shell = Math.floor(count * 0.72);
  for (let i = 0; i < count; i++) {
    if (i < shell) {
      const y = 1 - (i / (shell - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const phi = Math.acos(y);
      const r = 2.1 + 0.22 * Math.sin(theta * 3) * Math.sin(phi * 4) + gauss() * 0.04;
      out[i * 3] = Math.cos(theta) * ring * r;
      out[i * 3 + 1] = y * r;
      out[i * 3 + 2] = Math.sin(theta) * ring * r;
    } else {
      const r = Math.abs(gauss()) * 0.6;
      const theta = rand(0, Math.PI * 2);
      const phi = Math.acos(rand(-1, 1));
      out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = r * Math.cos(phi);
      out[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
  }
  return out;
}

// A branching tree with a broad canopy, rising from the floor.
export function treeShape(count) {
  const branches = [];
  const tips = [];
  const grow = (start, dir, length, depth) => {
    const end = start.map((v, k) => v + dir[k] * length);
    branches.push({ start, end, depth, weight: length * (depth + 1) });
    if (depth === 0) {
      tips.push(end);
      return;
    }
    const children = depth === 4 ? 4 : 3;
    for (let c = 0; c < children; c++) {
      const angle = (c / children) * Math.PI * 2 + rand(-0.4, 0.4);
      const spread = depth >= 3 ? 0.55 : 1.1;
      const next = [dir[0] + Math.cos(angle) * spread, dir[1] + rand(0.15, 0.6), dir[2] + Math.sin(angle) * spread];
      const n = Math.hypot(...next);
      grow(end, next.map((v) => v / n), length * rand(0.62, 0.78), depth - 1);
    }
  };
  grow([0, -3, 0], [0, 1, 0], 1.7, 4);

  const totalWeight = branches.reduce((sum, b) => sum + b.weight, 0);
  const pickBranch = () => {
    let r = Math.random() * totalWeight;
    for (const b of branches) {
      r -= b.weight;
      if (r <= 0) return b;
    }
    return branches[0];
  };

  const out = new Float32Array(count * 3);
  const woodCount = Math.floor(count * 0.32);
  for (let i = 0; i < count; i++) {
    let p;
    if (i < woodCount) {
      const b = pickBranch();
      const t = Math.random();
      const thickness = 0.035 * (b.depth + 1);
      p = b.start.map((v, k) => v + (b.end[k] - v) * t + gauss() * thickness);
    } else {
      const tip = tips[Math.floor(Math.random() * tips.length)];
      p = [tip[0] + gauss() * 0.55, tip[1] + gauss() * 0.32, tip[2] + gauss() * 0.55];
    }
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }

  // Fit the tree so the trunk starts at the floor and the canopy stays on screen.
  let minY = Infinity;
  let maxY = -Infinity;
  let maxR = 0;
  for (let i = 0; i < count; i++) {
    minY = Math.min(minY, out[i * 3 + 1]);
    maxY = Math.max(maxY, out[i * 3 + 1]);
    maxR = Math.max(maxR, Math.abs(out[i * 3]), Math.abs(out[i * 3 + 2]));
  }
  const scale = Math.min(5.4 / (maxY - minY), 4.6 / maxR);
  for (let i = 0; i < count; i++) {
    out[i * 3] *= scale;
    out[i * 3 + 1] = (out[i * 3 + 1] - minY) * scale - 3.1;
    out[i * 3 + 2] *= scale;
  }
  return out;
}

// A three-armed spiral galaxy, tilted toward the camera.
export function galaxyShape(count) {
  const out = new Float32Array(count * 3);
  const tilt = 0.55;
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * 4;
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const angle = r * 1.35 + arm + (gauss() * 0.3) / (r + 0.4);
    const x = Math.cos(angle) * r + gauss() * 0.08;
    const y = gauss() * 0.12 * (1.2 - r / 4);
    const z = Math.sin(angle) * r + gauss() * 0.08;
    out[i * 3] = x;
    out[i * 3 + 1] = y * cos - z * sin;
    out[i * 3 + 2] = y * sin + z * cos;
  }
  return out;
}
