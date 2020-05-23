const {NURBS} = window.Darblast;


export default class Document {
  _curves = [];

  selection = {
    index: 0,
    u: null,
  };

  static _createCurve() {
    const knots = Array.from({length: 11}, (_, index) => index / 10);
    const controlPoints = [
      {x: 200, y: 200, z: 0, w: 1},
      {x: 400, y: 200, z: 0, w: 1},
      {x: 400, y: 400, z: 0, w: 1},
      {x: 200, y: 400, z: 0, w: 1},
      {x: 200, y: 200, z: 0, w: 1},
      {x: 400, y: 200, z: 0, w: 1},
      {x: 400, y: 400, z: 0, w: 1},
    ];
    return new NURBS.Curve(knots, controlPoints);
  }

  constructor() {
    this._curves.push(Document._createCurve());
  }

  get curves() {
    return this._curves.slice();
  }

  render(context) {
    const {nativeContext} = context;
    context.clear();
    const curves = this._curves;
    for (let i = 0; i < curves.length; i++) {
      const curve = curves[i];
      const selection = this.selection;
      if (i === selection?.index) {
        nativeContext.strokeStyle = '#7f7f7f';
        nativeContext.lineWidth = 0.5;
        context.renderPolyLine(curve);
        nativeContext.fillStyle = '#7f7fff';
        const controlPoints = curve.getControlPoints();
        for (let i = 0; i < controlPoints.length; i++) {
          const {x, y} = controlPoints[i];
          context.renderDot(x, y, 5);
        }
      }
      nativeContext.strokeStyle = '#000';
      nativeContext.lineWidth = 1;
      context.renderCurve(curve);
      if (selection &&
          i === selection.index &&
          selection.u !== null)
      {
        context.fillStyle = '#000';
        const {x, y} = curve.sample(selection.u);
        context.renderDot(x, y);
      }
    }
  }
}
