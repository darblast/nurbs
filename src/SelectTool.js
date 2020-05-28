import Regressor from './Regressor';


export default class SelectTool {
  constructor(document, onChange) {
    this._document = document;
    this._onChange = onChange;
    this._point = null;
  }

  onMouseDown(x, y) {
    const {curves, selection} = this._document;
    if (selection) {
      const curve = curves[selection.index];
      const controlPoints = curve.getControlPoints();
      for (let i = 0; i < controlPoints.length; i++) {
        const point = controlPoints[i];
        if (Math.abs(x - point.x) <= 5 &&
            Math.abs(y - point.y) <= 5)
        {
          this._point = {
            curve: curve,
            index: i,
          };
          break;
        }
      }
    }
  }

  onMouseUp() {
    this._point = null;
  }

  _track(x, y) {
    const {curves, selection} = this._document;
    if (selection) {
      const curve = curves[selection.index];
      const regressor = new Regressor(curve, x, y, 0);
      selection.u = regressor.run(10);
    } else {
      selection.u = null;
    }
  }

  _movePoint(x, y) {
    const {curve, index} = this._point;
    curve.setControlPoint(index, {x, y, z: 0, w: 1});
    void this._onChange?.();
  }

  onMouseMove(x, y) {
    if (this._point) {
      this._movePoint(x, y);
    } else {
      this._track(x, y);
    }
  }
}
