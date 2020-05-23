class LineRenderer {
  constructor(context) {
    this._context = context;
  }

  first(x, y, z) {
    this._context.beginPath();
    this._context.moveTo(x, y);
  }

  next(x, y, z) {
    this._context.lineTo(x, y);
  }

  end() {
    this._context.stroke();
  }
}


export default class RenderContext {
  _width = 0;
  _height = 0;

  constructor(context) {
    this._context = context;
    this._lineRenderer = new LineRenderer(context);
  }

  get nativeContext() {
    return this._context;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;
  }

  clear() {
    this._context.clearRect(0, 0, this._width, this._height);
  }

  renderCurve(curve) {
    curve.renderCurve(this._lineRenderer);
  }

  renderPolyLine(curve) {
    curve.renderPolyLine(this._lineRenderer);
  }

  renderDot(x, y) {
    this._context.beginPath();
    this._context.arc(x, y, 5, 0, Math.PI * 2);
    this._context.fill();
  }
}
