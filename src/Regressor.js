export default class Regressor {
  constructor(curve, x, y, z) {
    this._c0 = curve.clone();
    this._c0.translate(-x, -y, -z);
    this._c1 = this._c0.derive();
    this._c2 = this._c1.derive();
  }

  _squareHypot(u) {
    const {x, y, z} = this._c0.sample(u);
    return x * x + y * y + z * z;
  }

  run(iterations) {
    const [min, max] = this._c0.domain;
    const p = this._c0.degree;
    const u = Array.from(
        {length: p},
        (_, index) => min + index * (max - min) / (p - 1));
    for (let i = 0; i < iterations; i++) {
      for (let k = 0; k < p; k++) {
        if (u[k] >= min && u[k] <= max) {
          const {x: x0, y: y0, z: z0} = this._c0.sample(u[k]);
          const {x: x1, y: y1, z: z1} = this._c1.sample(u[k]);
          const {x: x2, y: y2, z: z2} = this._c2.sample(u[k]);
          const d0 = 2 * (x0 * x1 + y0 * y1 + z0 * z1);
          const d1 = 2 * (x0 * x2 + x1 * x1 + y0 * y2 + y1 * y1 + z0 * z2 + z1 * z1);
          const d = d0 / d1;
          let s = 0;
          for (let j = 0; j < p; j++) {
            if (j !== k) {
              s += 1 / (u[k] - u[j]);
            }
          }
          u[k] -= d / (1 - d * s);
        }
      }
    }
    let v = u.filter(u => u >= min && u <= max);
    if (!v.length) {
      v = [min, max];
    }
    let result = v[0];
    let minH = this._squareHypot(result);
    for (let i = 1; i < v.length; i++) {
      const h = this._squareHypot(v[i]);
      if (h < minH) {
        result = v[i];
        minH = h;
      }
    }
    return result;
  }
}
