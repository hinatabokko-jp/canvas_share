// drawing.js: ブラシ形状、カラー、透明度、消しゴム、バケツ、アンドゥ・リドゥの制御
export class DrawingManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'brush'; // brush, eraser, bucket
    this.brushShape = 'pencil'; // カリグラフィ, エアブラシ, クレヨン, マーーカー, 鉛筆, 水彩, 毛筆
    this.color = '#ffffff';
    this.opacity = 1.0;
    this.lineWidth = 5;
    
    this.history = [];
    this.redoStack = [];
    
    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDraw());
    this.canvas.addEventListener('mouseout', () => this.stopDraw());
  }

  setTool(tool) { this.currentTool = tool; }
  setBrushShape(shape) { this.brushShape = shape; }
  setColor(color) { this.color = color; }
  setOpacity(opacity) { this.opacity = opacity; }
  setLineWidth(width) { this.lineWidth = width; }

  startDraw(e) {
    this.isDrawing = true;
    this.ctx.beginPath();
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
    this.saveState();
  }

  draw(e) {
    if (!this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ctx.save();
    this.globalAlpha = this.opacity;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;

    // ブラシ形状ごとの描画特性
    if (this.currentTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.lineWidth * 2;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.applyBrushStyle();
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.restore();

    this.lastX = x;
    this.lastY = y;
  }

  applyBrushStyle() {
    switch(this.brushShape) {
      case 'pencil':
        this.ctx.lineCap = 'butt';
        this.ctx.lineJoin = 'miter';
        break;
      case 'marker':
        this.ctx.lineCap = 'square';
        this.ctx.globalAlpha = this.opacity * 0.5;
        break;
      case 'crayon':
        this.ctx.lineCap = 'round';
        // ざらつき感を出す簡易表現
        break;
      case 'calligraphy':
        this.ctx.lineCap = 'square';
        this.ctx.transform(1, 0.2, -0.2, 1, 0, 0);
        break;
      case 'watercolor':
        this.ctx.globalAlpha = 0.2;
        this.ctx.lineWidth = this.lineWidth * 3;
        break;
      case 'brushpen':
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        break;
      case 'airbrush':
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.color;
        break;
      default:
        this.ctx.lineCap = 'round';
    }
  }

  stopDraw() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
  }

  saveState() {
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    if (this.history.length > 20) this.history.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      this.redoStack.push(this.history.pop());
      const previousState = this.history[this.history.length - 1];
      this.ctx.putImageData(previousState, 0, 0);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.history.push(state);
      this.ctx.putImageData(state, 0, 0);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveState();
  }
}
