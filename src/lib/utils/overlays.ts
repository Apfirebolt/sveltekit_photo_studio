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
