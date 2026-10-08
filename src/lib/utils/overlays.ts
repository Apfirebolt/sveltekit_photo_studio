export type TextOverlay = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold?: boolean;
  isItalic?: boolean;
  hasBackground?: boolean;
  bgColor?: string;
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  glowEnabled?: boolean;
  glowColor?: string;
  glowBlur?: number;
  innerShadowEnabled?: boolean;
  innerShadowColor?: string;
  innerShadowBlur?: number;
  innerShadowOffsetX?: number;
  innerShadowOffsetY?: number;
  strokeEnabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  blendMode?: string;
  maskEnabled?: boolean;
  maskColor?: string;
  // optional attached shape
  shape?: Shape | null;
  wrapText?: boolean; // wrap text around shape when true
};

export type Shape = {
  type: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'pentagon' | 'hexagon' | 'star' | 'heart';
  x: number; // center x
  y: number; // center y
  w: number;
  h: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  blendMode?: string;
};

export const FONT_OPTIONS = [
  'Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact',
  'Georgia', 'Times New Roman', 'Palatino', 'Garamond',
  'Courier New', 'Brush Script MT', 'Comic Sans MS', 'Papyrus',
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'
];

export const defaultTextOverlay = (canvasWidth = 800, canvasHeight = 600): TextOverlay => ({
  id: Math.random().toString(36).substring(2, 9),
  text: 'Sample Text',
  x: Math.round(canvasWidth / 2 - 100),
  y: Math.round(canvasHeight / 2 - 20),
  fontSize: 32,
  fontFamily: 'Arial',
  color: '#ffffff',
  isBold: false,
  isItalic: false,
  hasBackground: false,
  bgColor: 'rgba(0,0,0,0.5)',
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 4,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  glowEnabled: false,
  glowColor: '#00e5ff',
  glowBlur: 20,
  innerShadowEnabled: false,
  innerShadowColor: '#000000',
  innerShadowBlur: 6,
  innerShadowOffsetX: 3,
  innerShadowOffsetY: 3,
  strokeEnabled: false,
  strokeColor: '#000000',
  strokeWidth: 2,
  blendMode: 'source-over',
  maskEnabled: false,
  maskColor: '#000000'
  ,
  shape: null,
  wrapText: false
});

export const buildFont = (o: TextOverlay) => {
  const style = o.isItalic ? 'italic ' : '';
  const weight = o.isBold ? 'bold ' : '';
  return `${style}${weight}${o.fontSize}px ${o.fontFamily}`;
};

export const getOverlayBox = (ctx: CanvasRenderingContext2D, o: TextOverlay) => {
  ctx.save();
  ctx.font = buildFont(o);
  const metrics = ctx.measureText(o.text || '');
  const width = metrics.width;
  // fallback heights
  const ascent = (metrics.actualBoundingBoxAscent ?? o.fontSize * 0.8) as number;
  const descent = (metrics.actualBoundingBoxDescent ?? o.fontSize * 0.2) as number;
  const padding = Math.max(6, Math.round(o.fontSize * 0.15));
  const x = o.x - padding;
  const y = o.y - padding;
  const w = width + padding * 2;
  const h = ascent + descent + padding * 2;
  ctx.restore();
  return { x, y, w, h };
};

export const getShapeBox = (s: Shape) => {
  return { x: s.x - s.w / 2, y: s.y - s.h / 2, w: s.w, h: s.h };
};

export const drawShape = (ctx: CanvasRenderingContext2D, s: Shape) => {
  ctx.save();
  if (s.blendMode) ctx.globalCompositeOperation = s.blendMode as GlobalCompositeOperation;
  ctx.beginPath();
  const left = s.x - s.w / 2;
  const top = s.y - s.h / 2;
  switch (s.type) {
    case 'rectangle':
      ctx.rect(left, top, s.w, s.h);
      break;
    case 'circle': {
      const r = Math.min(s.w, s.h) / 2;
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      break;
    }
    case 'ellipse':
      ctx.ellipse(s.x, s.y, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
      break;
    case 'triangle': {
      ctx.moveTo(s.x, top);
      ctx.lineTo(left + s.w, top + s.h);
      ctx.lineTo(left, top + s.h);
      ctx.closePath();
      break;
    }
    case 'pentagon':
    case 'hexagon':
    case 'star':
    case 'heart': {
      // simple polygon approximations
      const cx = s.x;
      const cy = s.y;
      const rx = s.w / 2;
      const ry = s.h / 2;
      const sides = s.type === 'pentagon' ? 5 : s.type === 'hexagon' ? 6 : 5;
      for (let i = 0; i < sides; i++) {
        const theta = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const px = cx + Math.cos(theta) * rx;
        const py = cy + Math.sin(theta) * ry;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    default:
      break;
  }
  if (s.fill) {
    ctx.fillStyle = s.fill;
    ctx.fill();
  }
  if (s.stroke) {
    ctx.lineWidth = s.strokeWidth || 1;
    ctx.strokeStyle = s.stroke;
    ctx.stroke();
  }
  ctx.restore();
};

// compute horizontal blocked segment for a given y (canvas coords) from a shape
export const shapeHorizontalGapAtY = (s: Shape, y: number) => {
  const box = getShapeBox(s);
  if (y < box.y || y > box.y + box.h) return null;
  if (s.type === 'circle') {
    const r = Math.min(s.w, s.h) / 2;
    const dy = y - s.y;
    const dx = Math.sqrt(Math.max(0, r * r - dy * dy));
    return { left: s.x - dx, right: s.x + dx };
  }
  // rectangle/ellipse/others: approximate by box
  return { left: box.x, right: box.x + box.w };
};

export const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

export const drawInnerShadow = (ctx: CanvasRenderingContext2D, o: TextOverlay) => {
  // Simple inner shadow: draw text mask and composite a blurred dark fill clipped to text
  const box = getOverlayBox(ctx, o);
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.ceil(box.w));
  off.height = Math.max(1, Math.ceil(box.h));
  const offCtx = off.getContext('2d');
  if (!offCtx) return;
  offCtx.clearRect(0, 0, off.width, off.height);
  offCtx.fillStyle = 'black';
  offCtx.font = buildFont(o);
  offCtx.textBaseline = 'top';
  offCtx.fillText(o.text, o.x - box.x, o.y - box.y);

  // apply blur via shadow and draw inwards
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.clip();
  ctx.shadowColor = o.innerShadowColor || '#000';
  ctx.shadowBlur = o.innerShadowBlur || 8;
  ctx.shadowOffsetX = o.innerShadowOffsetX || 0;
  ctx.shadowOffsetY = o.innerShadowOffsetY || 0;
  ctx.drawImage(off, box.x, box.y);
  ctx.restore();
};
