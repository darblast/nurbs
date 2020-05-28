;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Darblast = factory();
  }
}(this, function() {
var Darblast;
(function (Darblast) {
    class Node {
        constructor(key, value) {
            this.height = 1;
            this.left = null;
            this.right = null;
            this.key = key;
            this.value = value;
        }
    }
    class AVL {
        constructor(compare = AVL.defaultCompare) {
            this._root = null;
            this._size = 0;
            this._compare = compare;
        }
        static defaultCompare(first, second) {
            if (first < second) {
                return -1;
            }
            else if (first > second) {
                return 1;
            }
            else {
                return 0;
            }
        }
        static from(elements, compare = AVL.defaultCompare) {
            const avl = new AVL(compare);
            for (const [key, value] of elements) {
                avl.insert(key, value);
            }
            return avl;
        }
        static setFrom(elements, compare = AVL.defaultCompare) {
            const avl = new AVL(compare);
            for (const element of elements) {
                avl.insert(element, true);
            }
            return avl;
        }
        get size() {
            return this._size;
        }
        get isEmpty() {
            return !this._root;
        }
        _getHeight(node) {
            if (node) {
                return node.height;
            }
            else {
                return 0;
            }
        }
        get height() {
            return this._getHeight(this._root);
        }
        getMinimum() {
            let node = this._root;
            while (node && node.left) {
                node = node.left;
            }
            if (node) {
                return [node.key, node.value];
            }
            else {
                return null;
            }
        }
        getMaximum() {
            let node = this._root;
            while (node && node.right) {
                node = node.right;
            }
            if (node) {
                return [node.key, node.value];
            }
            else {
                return null;
            }
        }
        *_enumerateKeys(node) {
            if (node) {
                yield* this._enumerateKeys(node.left);
                yield node.key;
                yield* this._enumerateKeys(node.right);
            }
        }
        get keys() {
            return this._enumerateKeys(this._root);
        }
        *_enumerateValues(node) {
            if (node) {
                yield* this._enumerateValues(node.left);
                yield node.value;
                yield* this._enumerateValues(node.right);
            }
        }
        get values() {
            return this._enumerateValues(this._root);
        }
        lookup(key) {
            let node = this._root;
            while (node) {
                const cmp = this._compare(key, node.key);
                if (cmp < 0) {
                    node = node.left;
                }
                else if (cmp > 0) {
                    node = node.right;
                }
                else {
                    return node.value;
                }
            }
            return null;
        }
        contains(key) {
            let node = this._root;
            while (node) {
                const cmp = this._compare(key, node.key);
                if (cmp < 0) {
                    node = node.left;
                }
                else if (cmp > 0) {
                    node = node.right;
                }
                else {
                    return true;
                }
            }
            return false;
        }
        *_scan(node, lowerBound, upperBound) {
            if (node) {
                const cmpLower = lowerBound ? this._compare(node.key, lowerBound) : 1;
                const cmpUpper = upperBound ? this._compare(node.key, upperBound) : -1;
                if (cmpLower < 0) {
                    yield* this._scan(node.right, lowerBound, upperBound);
                }
                else if (cmpUpper >= 0) {
                    yield* this._scan(node.left, lowerBound, upperBound);
                }
                else {
                    yield* this._scan(node.left, lowerBound, null);
                    yield [node.key, node.value];
                    yield* this._scan(node.right, null, upperBound);
                }
            }
        }
        scan(lowerBound = null, upperBound = null) {
            return this._scan(this._root, lowerBound, upperBound);
        }
        [Symbol.iterator]() {
            return this.scan(null, null);
        }
        _updateHeight(node) {
            node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
        }
        _rebalanceHeavyLeft(root) {
            if (this._getHeight(root.left) > this._getHeight(root.right) + 1) {
                const left = root.left;
                root.left = left.right;
                left.right = root;
                this._updateHeight(root);
                this._updateHeight(left);
                return left;
            }
            else {
                this._updateHeight(root);
                return root;
            }
        }
        _rebalanceHeavyRight(root) {
            if (this._getHeight(root.right) > this._getHeight(root.left) + 1) {
                const right = root.right;
                root.right = right.left;
                right.left = root;
                this._updateHeight(root);
                this._updateHeight(right);
                return right;
            }
            else {
                this._updateHeight(root);
                return root;
            }
        }
        _insert(node, key, value) {
            if (node) {
                const cmp = this._compare(key, node.key);
                if (cmp < 0) {
                    node.left = this._insert(node.left, key, value);
                    return this._rebalanceHeavyLeft(node);
                }
                else if (cmp > 0) {
                    node.right = this._insert(node.right, key, value);
                    return this._rebalanceHeavyRight(node);
                }
                else {
                    node.value = value;
                    return node;
                }
            }
            else {
                this._size++;
                return new Node(key, value);
            }
        }
        insert(key, value) {
            this._root = this._insert(this._root, key, value);
        }
        insertAll(elements) {
            for (const [key, value] of elements) {
                this.insert(key, value);
            }
        }
        _remove(node, key) {
            if (node) {
                const cmp = this._compare(key, node.key);
                if (cmp < 0) {
                    node.left = this._remove(node.left, key);
                    return this._rebalanceHeavyRight(node);
                }
                else if (cmp > 0) {
                    node.right = this._remove(node.right, key);
                    return this._rebalanceHeavyLeft(node);
                }
                else {
                    this._size--;
                    return null;
                }
            }
            else {
                return null;
            }
        }
        remove(key) {
            this._root = this._remove(this._root, key);
        }
        clear() {
            this._root = null;
            this._size = 0;
        }
        _clone(node) {
            if (node) {
                const result = new Node(node.key, node.value);
                result.left = this._clone(node.left);
                result.right = this._clone(node.right);
                result.height = node.height;
                return result;
            }
            else {
                return null;
            }
        }
        clone() {
            const result = new AVL(this._compare);
            result._root = this._clone(this._root);
            result._size = this._size;
            return result;
        }
        map(predicate, scope = null) {
            const result = new AVL(this._compare);
            for (const [key, value] of this) {
                result.insert(key, predicate.call(scope, key, value));
            }
            return result;
        }
        filter(predicate, scope = null) {
            const result = new AVL(this._compare);
            for (const [key, value] of this) {
                if (predicate.call(scope, key, value)) {
                    result.insert(key, value);
                }
            }
            return result;
        }
        union(other) {
            const result = this.clone();
            result.insertAll(other);
            return result;
        }
        intersection(other) {
            const result = new AVL(this._compare);
            if (other.isEmpty) {
                return result;
            }
            const [min] = other.getMinimum();
            const it1 = this.scan(min);
            const it2 = other[Symbol.iterator]();
            let element1 = it1.next();
            let element2 = it2.next();
            while (!element1.done && !element2.done) {
                const [key1, value1] = element1.value;
                const [key2, value2] = element2.value;
                const cmp = this._compare(key1, key2);
                if (!cmp) {
                    result.insert(key1, value1);
                }
                if (cmp <= 0) {
                    element1 = it1.next();
                }
                if (cmp >= 0) {
                    element2 = it2.next();
                }
            }
            return result;
        }
        difference(other) {
            const result = new AVL(this._compare);
            const it1 = this[Symbol.iterator]();
            const it2 = other[Symbol.iterator]();
            let element1 = it1.next();
            let element2 = it2.next();
            while (!element1.done) {
                const [key1, value] = element1.value;
                if (element2.done) {
                    result.insert(key1, value);
                    element1 = it1.next();
                }
                else {
                    const [key2] = element2.value;
                    const cmp = this._compare(key1, key2);
                    if (cmp < 0) {
                        result.insert(key1, value);
                        element1 = it1.next();
                    }
                    else if (cmp > 0) {
                        element2 = it2.next();
                    }
                    else {
                        element1 = it1.next();
                        element2 = it2.next();
                    }
                }
            }
            return result;
        }
        symmetricDifference(other) {
            const result = new AVL(this._compare);
            const it1 = this[Symbol.iterator]();
            const it2 = other[Symbol.iterator]();
            let element1 = it1.next();
            let element2 = it2.next();
            while (!element1.done) {
                const [key1, value1] = element1.value;
                if (element2.done) {
                    result.insert(key1, value1);
                    element1 = it1.next();
                }
                else {
                    const [key2, value2] = element2.value;
                    const cmp = this._compare(key1, key2);
                    if (cmp < 0) {
                        result.insert(key1, value1);
                        element1 = it1.next();
                    }
                    else if (cmp > 0) {
                        result.insert(key2, value2);
                        element2 = it2.next();
                    }
                    else {
                        element1 = it1.next();
                        element2 = it2.next();
                    }
                }
            }
            while (!element2.done) {
                const [key2, value2] = element2.value;
                result.insert(key2, value2);
                element2 = it2.next();
            }
            return result;
        }
    }
    Darblast.AVL = AVL;
})(Darblast || (Darblast = {})); // namespace Darblast
const AVL = Darblast.AVL;
var Darblast;
(function (Darblast) {
    class Frame {
        constructor(source, width, height) {
            this.source = source;
            this.width = width;
            this.height = height;
        }
        static fromImage(image) {
            return new Frame(image, image.width, image.height);
        }
        static fromVideo(video) {
            return new Frame(video, video.videoWidth, video.videoHeight);
        }
        draw(context) {
            context.drawImage(this.source, 0, 0, this.width, this.height);
        }
    }
    Darblast.Frame = Frame;
    class Canvas {
        constructor(canvasElement) {
            this.element = canvasElement;
            const context = canvasElement.getContext('2d');
            if (context) {
                this.context = context;
            }
            else {
                throw new Error('failed to initialize the HTML5 canvas');
            }
        }
        get width() {
            return this.element.width;
        }
        get height() {
            return this.element.height;
        }
    }
    Darblast.Canvas = Canvas;
})(Darblast || (Darblast = {})); // namespace Darblast
const Frame = Darblast.Frame;
const Canvas = Darblast.Canvas;
function copyArray(target, source) {
    target.length = source.length;
    for (let i = 0; i < target.length; i++) {
        target[i] = source[i];
    }
}
/// <reference path="Base.ts" />
var Darblast;
(function (Darblast) {
    class Animation {
        constructor(frames, frameDuration, x0, y0) {
            if (frames.length < 1) {
                throw new Error('there must be at least one frame');
            }
            if (frameDuration < 1) {
                throw new Error(`invalid frame duration: ${frameDuration} -- must be a whole positive number`);
            }
            this.frames = frames;
            this.frameDuration = frameDuration;
            this.x0 = x0;
            this.y0 = y0;
            this.width = this.frames[0].width;
            this.height = this.frames[0].height;
            if (this.frames.some(frame => frame.width !== this.width || frame.height !== this.height, this)) {
                throw new Error('inconsistent frame sizes');
            }
        }
        getFrame(t0, t) {
            const i = Math.floor((t - t0) / this.frameDuration);
            return this.frames[i % this.frames.length];
        }
    }
    Darblast.Animation = Animation;
    class Character {
        constructor(name, animations, defaultState = 'default') {
            this.animations = Object.create(null);
            if (!(defaultState in animations)) {
                throw new Error(`invalid state: ${JSON.stringify(defaultState)}`);
            }
            this.name = name;
            this.defaultState = defaultState;
            for (const state in animations) {
                if (animations.hasOwnProperty(state)) {
                    this.animations[state] = animations[state];
                }
            }
        }
        static createStatic(name, source, x0 = 0, y0 = 0) {
            return new Character(name, {
                'default': new Darblast.Animation([source], 1, 0, 0),
            }, 'default');
        }
        get states() {
            return Object.keys(this.animations);
        }
        isValidState(state) {
            return state in this.animations;
        }
    }
    Darblast.Character = Character;
})(Darblast || (Darblast = {})); // namespace Darblast
const Character = Darblast.Character;
/// <reference path="Base.ts" />
/// <reference path="AVL.ts" />
class Database {
    constructor() {
        this._data = Object.create(null);
    }
    static _compare(first, second) {
        return first - second;
    }
    insert(properties, element) {
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (!(key in this._data)) {
                    this._data[key] = Object.create(null);
                }
                const value = properties[key];
                if (!(value in this._data[key])) {
                    this._data[key][value] = new AVL(Database._compare);
                }
                this._data[key][value].insert(element.id, element);
            }
        }
    }
    remove(properties) {
        // TODO
        throw new Error('not implemented');
    }
    *query(properties) {
        const iterators = [];
        for (const key in properties) {
            if (properties.hasOwnProperty(key) && (key in this._data)) {
                const value = properties[key];
                if (value in this._data[key]) {
                    iterators.push(this._data[key][value][Symbol.iterator]());
                }
            }
        }
        const result = [];
        const items = iterators.map(it => it.next());
        while (items.every(item => !item.done)) {
            let minimum = null;
            let everywhere = false;
            for (let i = 0; i < items.length; i++) {
                const [id, element] = items[i].value;
                if (!minimum) {
                    minimum = element;
                    everywhere = true;
                }
                else if (id < minimum.id) {
                    minimum = element;
                    everywhere = false;
                }
            }
            if (everywhere) {
                yield minimum;
            }
            for (let i = 0; i < items.length; i++) {
                const [id] = items[i].value;
                if (id <= minimum.id) {
                    items[i] = iterators[i].next();
                }
            }
        }
    }
}
var Darblast;
(function (Darblast) {
    class View {
        constructor(matrix, width, height) {
            this.x = 0;
            this.y = 0;
            if (matrix.length !== 3 || matrix.some(row => row.length !== 3)) {
                throw Error('invalid matrix size, must be 3x3');
            }
            this.matrix = matrix;
            this.width = width;
            this.height = height;
        }
        project(projectable) {
            const m = this.matrix;
            projectable.x = projectable.i * m[0][0] + projectable.j * m[0][1] + projectable.k * m[0][2];
            projectable.y = projectable.i * m[1][0] + projectable.j * m[1][1] + projectable.k * m[1][2];
            projectable.z = projectable.i * m[2][0] + projectable.j * m[2][1] + projectable.k * m[2][2];
        }
    }
    Darblast.View = View;
})(Darblast || (Darblast = {})); // namespace Darblast
const View = Darblast.View;
class IdGenerator {
    constructor() {
        this._nextId = 0;
        this._stash = [];
    }
    claim() {
        if (this._stash.length > 0) {
            return this._stash.pop();
        }
        else {
            return this._nextId++;
        }
    }
    release(id) {
        this._stash.push(id);
    }
}
var Darblast;
(function (Darblast) {
    class Heap {
        constructor(compare = Heap.defaultCompare) {
            this._data = [];
            this._compare = compare;
        }
        static defaultCompare(first, second) {
            return first < second;
        }
        static from(elements, compare = Heap.defaultCompare) {
            const heap = new Heap(compare);
            heap.pushAll(elements);
            return heap;
        }
        get size() {
            return this._data.length;
        }
        get isEmpty() {
            return !this._data.length;
        }
        get height() {
            return Math.ceil(Math.log2(this._data.length + 1));
        }
        get top() {
            if (this._data.length) {
                return this._data[0];
            }
            else {
                throw new Error('empty heap');
            }
        }
        _compareElements(i, j) {
            return this._compare(this._data[i], this._data[j]);
        }
        _swap(i, j) {
            const temp = this._data[i];
            this._data[i] = this._data[j];
            this._data[j] = temp;
        }
        push(element) {
            let i = this._data.length;
            this._data.push(element);
            let j = Math.floor((i - 1) / 2);
            while (i > 0 && this._compareElements(i, j)) {
                this._swap(i, j);
                i = j;
                j = Math.floor((i - 1) / 2);
            }
        }
        pushAll(elements) {
            for (const element of elements) {
                this.push(element);
            }
        }
        _siftDown(i) {
            const j = i * 2 + 1;
            const k = i * 2 + 2;
            if (j < this._data.length) {
                if (k >= this._data.length || this._compareElements(j, k)) {
                    if (this._compareElements(j, i)) {
                        this._swap(i, j);
                        return j;
                    }
                }
                else if (k < this._data.length && this._compareElements(k, i)) {
                    this._swap(i, k);
                    return k;
                }
            }
            return -1;
        }
        pop() {
            if (this._data.length) {
                const element = this._data[0];
                this._data[0] = this._data[this._data.length - 1];
                this._data.length--;
                for (let i = 0; i >= 0; i = this._siftDown(i)) { }
                return element;
            }
            else {
                throw new Error('empty heap');
            }
        }
        clear() {
            this._data.length = 0;
        }
        clone() {
            const result = new Heap(this._compare);
            result._data.push.apply(result._data, this._data);
            return result;
        }
    }
    Darblast.Heap = Heap;
})(Darblast || (Darblast = {})); // namespace Darblast
const Heap = Darblast.Heap;
/// <reference path="IdGenerator.ts" />
/// <reference path="View.ts" />
/// <reference path="Character.ts" />
/// <reference path="Heap.ts" />
let ElementImpl = /** @class */ (() => {
    class ElementImpl {
        constructor(tree, character, state, i, j, k) {
            this._timestamp = Date.now();
            this.visible = true;
            this.opacity = 1;
            // transformation matrix
            this._m00 = 1;
            this._m01 = 0;
            this._m02 = 0;
            this._m10 = 0;
            this._m11 = 1;
            this._m12 = 0;
            this.treeHeight = 1;
            this.leftChild = null;
            this.rightChild = null;
            this._tree = tree;
            this.id = ElementImpl._idGenerator.claim();
            this.character = character;
            this._state = state;
            this._i = i;
            this._j = j;
            this._k = k;
            this._project();
        }
        get state() {
            return this._state;
        }
        set state(value) {
            if (value in this.character.animations) {
                const currentState = this._state;
                this._state = value;
                if (value !== currentState) {
                    this._project();
                }
            }
            else {
                throw new Error(`invalid state: ${JSON.stringify(value)}`);
            }
        }
        get animation() {
            return this.character.animations[this._state];
        }
        _reindex() {
            const animation = this.animation;
            this._tree.remove(this);
            const width = animation.width;
            const height = animation.height;
            const x0 = this._x;
            const x1 = this._x + width;
            const y0 = this._y;
            const y1 = this._y + height;
            const x00 = Math.round(this._m00 * x0 + this._m01 * y0 + this._m02);
            const y00 = Math.round(this._m00 * x0 + this._m01 * y0 + this._m02);
            const x01 = Math.round(this._m00 * x1 + this._m01 * y0 + this._m02);
            const y01 = Math.round(this._m00 * x1 + this._m01 * y0 + this._m02);
            const x10 = Math.round(this._m00 * x0 + this._m01 * y1 + this._m02);
            const y10 = Math.round(this._m00 * x0 + this._m01 * y1 + this._m02);
            const x11 = Math.round(this._m00 * x1 + this._m01 * y1 + this._m02);
            const y11 = Math.round(this._m00 * x1 + this._m01 * y1 + this._m02);
            this._x0 = Math.min(x00, x01, x10, x11);
            this._y0 = Math.min(y00, y01, y10, y11);
            this._x1 = Math.max(x00, x01, x10, x11);
            this._y1 = Math.max(y00, y01, y10, y11);
            this._tree.insert(this);
        }
        _project() {
            const animation = this.animation;
            let m = this._tree.view.matrix;
            this._x = animation.x0 + this._i * m[0][0] + this._j * m[0][1] + this._k * m[0][2];
            this._y = animation.y0 + this._i * m[1][0] + this._j * m[1][1] + this._k * m[1][2];
            this._z = this._i * m[2][0] + this._j * m[2][1] + this._k * m[2][2];
            this._reindex();
        }
        get i() {
            return this._i;
        }
        set i(value) {
            this._i = value;
            this._project();
        }
        get j() {
            return this._j;
        }
        set j(value) {
            this._j = value;
            this._project();
        }
        get k() {
            return this._k;
        }
        set k(value) {
            this._k = value;
            this._project();
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get width() {
            return this.animation.width;
        }
        get height() {
            return this.animation.height;
        }
        moveTo(i, j, k) {
            this._i = i;
            this._j = j;
            this._k = k;
            this._project();
        }
        moveBy(di, dj, dk) {
            this._i += di;
            this._j += dj;
            this._k += dk;
            this._project();
        }
        get x0() {
            return this._x0;
        }
        get y0() {
            return this._y0;
        }
        get x1() {
            return this._x1;
        }
        get y1() {
            return this._y1;
        }
        get z() {
            return this._z;
        }
        setTransform(m00, m01, m02, m10, m11, m12) {
            this._m00 = m00;
            this._m01 = m01;
            this._m02 = m02;
            this._m10 = m10;
            this._m11 = m11;
            this._m12 = m12;
            this._reindex();
        }
        transform(m00, m01, m02, m10, m11, m12) {
            this._m00 = this._m00 * m00 + this._m01 * m10;
            this._m01 = this._m00 * m01 + this._m01 * m11;
            this._m02 = this._m00 * m02 + this._m01 * m12 + this._m02;
            this._m10 = this._m10 * m00 + this._m11 * m10;
            this._m11 = this._m10 * m01 + this._m11 * m11;
            this._m12 = this._m10 * m02 + this._m11 * m12 + this._m12;
            this._reindex();
        }
        resetTransform() {
            this._m00 = 1;
            this._m01 = 0;
            this._m02 = 0;
            this._m10 = 0;
            this._m11 = 1;
            this._m12 = 0;
            this._reindex();
        }
        rotate(angle, x, y) {
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            this._m00 = cos;
            this._m01 = -sin;
            this._m02 = x - x * cos + y * sin;
            this._m10 = sin;
            this._m11 = cos;
            this._m12 = y - x * sin - y * cos;
            this._reindex();
        }
        getFrame(t) {
            return this.animation.getFrame(this._timestamp, t);
        }
        draw(context, t) {
            if (this.visible) {
                context.globalAlpha = this.opacity;
                context.setTransform(this._m00, this._m10, this._m01, this._m11, this._m02, this._m12);
                this.getFrame(t).draw(context);
            }
        }
        remove() {
            this._tree.remove(this);
        }
    }
    ElementImpl._idGenerator = new IdGenerator();
    return ElementImpl;
})();
class RenderContext {
    constructor() {
        this._heap = new Heap(function (first, second) {
            if (first.z < second.z) {
                return true;
            }
            else if (first.z > second.z) {
                return false;
            }
            else {
                return first.id < second.id;
            }
        });
    }
    _queueLeft(parent) {
        const element = parent.leftChild;
        if (element) {
            if (element.x1 < this._x0) {
                if (parent.x1 >= this._x0) {
                    this._queueRight(element);
                }
            }
            else if (element.x1 >= this._x1) {
                this._queueLeft(element);
            }
            else if (element.y1 < this._y0) {
                this._queueLeft(element);
                if (parent.x1 > element.x1 || parent.y1 >= this._y0) {
                    this._queueRight(element);
                }
            }
            else if (element.y1 >= this._y1) {
                this._queueLeft(element);
                if (parent.x1 > element.x1) {
                    this._queueRight(element);
                }
            }
            else {
                this._queueLeft(element);
                this._heap.push(element);
                this._queueRight(element);
            }
        }
    }
    _queueRight(parent) {
        const element = parent.rightChild;
        if (element) {
            if (element.x1 < this._x0) {
                this._queueRight(element);
            }
            else if (element.x1 >= this._x1) {
                if (parent.x1 < this._x1) {
                    this._queueLeft(element);
                }
            }
            else if (element.y1 < this._y0) {
                if (parent.x1 < element.x1) {
                    this._queueLeft(element);
                }
                this._queueRight(element);
            }
            else if (element.y1 >= this._y1) {
                if (parent.x1 < element.x1 || parent.y1 < this._y1) {
                    this._queueLeft(element);
                }
                this._queueRight(element);
            }
            else {
                this._queueLeft(element);
                this._heap.push(element);
                this._queueRight(element);
            }
        }
    }
    _queue(element) {
        if (element) {
            if (element.x1 < this._x0) {
                this._queueRight(element);
            }
            else if (element.x1 >= this._x1) {
                this._queueLeft(element);
            }
            else {
                this._queueLeft(element);
                if (element.y1 >= this._y0 && element.y1 < this._y1) {
                    this._heap.push(element);
                }
                this._queueRight(element);
            }
        }
    }
    _render() {
        while (!this._heap.isEmpty) {
            this._heap.pop().draw(this._context, this._timestamp);
        }
    }
    render(context, x0, y0, x1, y1, root, timestamp) {
        this._context = context;
        this._x0 = x0;
        this._y0 = y0;
        this._x1 = x1;
        this._y1 = y1;
        this._timestamp = timestamp;
        this._heap.clear();
        this._queue(root);
        this._render();
    }
}
class ElementTree {
    constructor(view) {
        this._root = null;
        this._renderContext = new RenderContext();
        this.view = view;
    }
    static _compare(first, second) {
        if (first.x0 < second.x0) {
            return -1;
        }
        else if (first.x0 > second.x0) {
            return 1;
        }
        else if (first.y0 < second.y0) {
            return -1;
        }
        else if (first.y0 > second.y0) {
            return 1;
        }
        else if (first.id < second.id) {
            return -1;
        }
        else if (first.id > second.id) {
            return 1;
        }
        else {
            return 0;
        }
    }
    _getHeight(element) {
        if (element) {
            return element.treeHeight;
        }
        else {
            return 0;
        }
    }
    _updateHeight(element) {
        element.treeHeight = 1 + Math.max(this._getHeight(element.leftChild), this._getHeight(element.rightChild));
    }
    _rebalanceHeavyLeft(root) {
        if (this._getHeight(root.leftChild) > this._getHeight(root.rightChild) + 1) {
            const left = root.leftChild;
            root.leftChild = left.rightChild;
            left.rightChild = root;
            this._updateHeight(root);
            this._updateHeight(left);
            return left;
        }
        else {
            this._updateHeight(root);
            return root;
        }
    }
    _rebalanceHeavyRight(root) {
        if (this._getHeight(root.rightChild) > this._getHeight(root.leftChild) + 1) {
            const right = root.rightChild;
            root.rightChild = right.leftChild;
            right.leftChild = root;
            this._updateHeight(root);
            this._updateHeight(right);
            return right;
        }
        else {
            this._updateHeight(root);
            return root;
        }
    }
    _insert(root, element) {
        if (root) {
            const cmp = ElementTree._compare(root, element);
            if (cmp < 0) {
                root.leftChild = this._insert(root.leftChild, element);
                return this._rebalanceHeavyLeft(root);
            }
            else if (cmp > 0) {
                root.rightChild = this._insert(root.rightChild, element);
                return this._rebalanceHeavyRight(root);
            }
            else {
                return element;
            }
        }
        else {
            element.treeHeight = 1;
            element.leftChild = null;
            element.rightChild = null;
            return element;
        }
    }
    insert(element) {
        this._root = this._insert(this._root, element);
    }
    _remove(root, element) {
        if (root) {
            const cmp = ElementTree._compare(root, element);
            if (cmp < 0) {
                root.leftChild = this._remove(root.leftChild, element);
                return this._rebalanceHeavyRight(root);
            }
            else if (cmp > 0) {
                root.rightChild = this._remove(root.rightChild, element);
                return this._rebalanceHeavyLeft(root);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    remove(element) {
        this._root = this._remove(this._root, element);
        element.treeHeight = 1;
        element.leftChild = null;
        element.rightChild = null;
    }
    render(context, x0, y0, x1, y1, timestamp) {
        this._renderContext.render(context, x0, y0, x1, y1, this._root, timestamp);
    }
}
/// <reference path="Character.ts" />
/// <reference path="View.ts" />
/// <reference path="Elements.ts" />
var Darblast;
(function (Darblast) {
    class ElementManager {
        constructor(view) {
            this._database = new Database();
            this._view = view;
            this._elements = new ElementTree(view);
        }
        spawn(character, state, i, j, k, properties = null) {
            const element = new ElementImpl(this._elements, character, state, i, j, k);
            if (properties) {
                this._database.insert(properties, element);
            }
            return element;
        }
        spawnDefault(character, i, j, k, properties = null) {
            return this.spawn(character, 'default', i, j, k);
        }
        *query(properties) {
            return this._database.query(properties);
        }
        queryFirst(properties) {
            for (const element of this.query(properties)) {
                return element;
            }
            throw new Error(`element not found for ${JSON.stringify(properties)}`);
        }
        render(canvas, t, parallax) {
            this._elements.render(canvas.context, this._view.x * parallax.x, this._view.y * parallax.y, this._view.width, this._view.height, t);
        }
    }
    Darblast.ElementManager = ElementManager;
})(Darblast || (Darblast = {})); // namespace Darblast
const ElementManager = Darblast.ElementManager;
var Darblast;
(function (Darblast) {
    class Keyboard {
        constructor(element = window) {
            this._state = Object.create(null);
            this._handlers = Object.create(null);
            this._element = element;
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this._element.addEventListener('keydown', this._onKeyDown, false);
            this._element.addEventListener('keyup', this._onKeyUp, false);
        }
        _onKeyDown(event) {
            var _a, _b;
            const key = event.code;
            if (!this._state[key]) {
                this._state[key] = true;
                (_b = (_a = this._handlers)[key]) === null || _b === void 0 ? void 0 : _b.call(_a, key);
            }
        }
        _onKeyUp(event) {
            this._state[event.code] = false;
        }
        isPressed(key) {
            return !!this._state[key];
        }
        on(key, handler) {
            this._handlers[key] = handler;
            return this;
        }
        off(key) {
            delete this._handlers[key];
            return this;
        }
        destroy() {
            this._element.removeEventListener('keydown', this._onKeyDown, false);
            this._element.removeEventListener('keyup', this._onKeyUp, false);
            for (const key in this._handlers) {
                delete this._handlers[key];
            }
        }
    }
    Darblast.Keyboard = Keyboard;
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="View.ts" />
/// <reference path="ElementManager.ts" />
/// <reference path="Base.ts" />
var Darblast;
(function (Darblast) {
    class DefaultLayer {
        constructor(view) {
            this.enabled = true;
            this.parallax = {
                x: 1,
                y: 1,
            };
            this._view = view;
            this._elements = new Darblast.ElementManager(view);
        }
        render(canvas, t) {
            if (this.enabled) {
                this._elements.render(canvas, t, this.parallax);
            }
        }
    }
    Darblast.DefaultLayer = DefaultLayer;
})(Darblast || (Darblast = {})); // namespace Darblast
const DefaultLayer = Darblast.DefaultLayer;
/// <reference path="Base.ts" />
/// <reference path="View.ts" />
/// <reference path="Layer.ts" />
var Darblast;
(function (Darblast) {
    class LayerManager {
        constructor() {
            this._layers = [];
        }
        get count() {
            return this._layers.length;
        }
        _checkIndex(index) {
            if (index < 0) {
                throw new Error(`layer index cannot be negative`);
            }
            else if (index >= this._layers.length) {
                throw new Error(`layer index out of bounds: ${index} > ${this._layers.length - 1}`);
            }
            else {
                return index;
            }
        }
        getAt(index) {
            return this._layers[this._checkIndex(index)];
        }
        insert(layer, index) {
            this._layers.splice(index, 0, layer);
        }
        insertDefault(view, index) {
            this.insert(new Darblast.DefaultLayer(view), index);
        }
        insertAbove(layer) {
            this.insert(layer, 0);
        }
        insertDefaultAbove(view) {
            this.insert(new Darblast.DefaultLayer(view), 0);
        }
        insertBelow(layer) {
            this.insert(layer, this._layers.length);
        }
        insertDefaultBelow(view) {
            this.insert(new Darblast.DefaultLayer(view), this._layers.length);
        }
        removeAt(index) {
            this._layers.splice(this._checkIndex(index), 1);
        }
        render(canvas, t) {
            for (let i = 0; i < this._layers.length; i++) {
                this._layers[i].render(canvas, t);
            }
        }
    }
    Darblast.LayerManager = LayerManager;
})(Darblast || (Darblast = {})); // namespace Darblast
const LayerManager = Darblast.LayerManager;
var Darblast;
(function (Darblast) {
    class Loader {
        static loadImage(url) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    image.onload = null;
                    image.onerror = null;
                    resolve(image);
                };
                image.onerror = () => {
                    image.onload = null;
                    image.onerror = null;
                    reject(`error loading ${url}`);
                };
                image.src = url;
            });
        }
        static loadImages(urls) {
            return Promise.all(urls.map(url => Loader.loadImage(url)));
        }
        static loadSound(url) {
            return new Promise((resolve, reject) => {
                const audio = new Audio(url);
                audio.oncanplaythrough = () => {
                    audio.oncanplaythrough = null;
                    audio.onerror = null;
                    resolve(audio);
                };
                audio.onerror = () => {
                    audio.oncanplaythrough = null;
                    audio.onerror = null;
                    reject(`error loading ${url}`);
                };
                audio.load();
            });
        }
        static loadSounds(urls) {
            return Promise.all(urls.map(url => Loader.loadSound(url)));
        }
    }
    Darblast.Loader = Loader;
})(Darblast || (Darblast = {})); // namespace Darblast
var Darblast;
(function (Darblast) {
    let Mouse = /** @class */ (() => {
        class Mouse {
            constructor(element) {
                this._state = Object.create(null);
                this._downHandlers = Object.create(null);
                this._upHandlers = Object.create(null);
                this._moveHandler = null;
                this._x = 0;
                this._y = 0;
                this._element = element;
                this._onDown = this._onDown.bind(this);
                this._onUp = this._onUp.bind(this);
                this._onMove = this._onMove.bind(this);
                element.addEventListener('mousedown', this._onDown, false);
                element.addEventListener('mouseup', this._onUp, false);
                element.addEventListener('mousemove', this._onMove, false);
            }
            _onDown(event) {
                var _a, _b;
                const button = Mouse._BUTTONS[event.button];
                if (!this._state[button]) {
                    this._state[button] = true;
                    (_b = (_a = this._downHandlers)[button]) === null || _b === void 0 ? void 0 : _b.call(_a, event.clientX, event.clientY, button);
                }
            }
            _onUp(event) {
                var _a, _b;
                const button = Mouse._BUTTONS[event.button];
                if (this._state[button]) {
                    this._state[button] = false;
                    (_b = (_a = this._upHandlers)[button]) === null || _b === void 0 ? void 0 : _b.call(_a, event.clientX, event.clientY, button);
                }
            }
            _onMove(event) {
                var _a;
                this._x = event.clientX;
                this._y = event.clientY;
                (_a = this._moveHandler) === null || _a === void 0 ? void 0 : _a.call(this, this._x, this._y);
            }
            get position() {
                return {
                    x: this._x,
                    y: this._y,
                };
            }
            isDown(button) {
                return !!this._state[button];
            }
            onDown(button, handler) {
                this._downHandlers[button] = handler;
                return this;
            }
            onUp(button, handler) {
                this._upHandlers[button] = handler;
                return this;
            }
            onMove(handler) {
                this._moveHandler = handler;
                return this;
            }
            destroy() {
                this._element.removeEventListener('mousedown', this._onDown, false);
                this._element.removeEventListener('mouseup', this._onUp, false);
                this._element.removeEventListener('mousemove', this._onMove, false);
                Mouse._BUTTONS.forEach(button => {
                    delete this._downHandlers[button];
                    delete this._upHandlers[button];
                }, this);
                this._moveHandler = null;
            }
        }
        Mouse._BUTTONS = [
            'Left',
            'Middle',
            'Right',
            'Back',
            'Forward',
        ];
        return Mouse;
    })();
    Darblast.Mouse = Mouse;
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="Base.ts" />
var Darblast;
(function (Darblast) {
    let NURBS;
    (function (NURBS) {
        class DeBoorContext {
            constructor(knots, multiplicity, controlPoints) {
                this._x = [];
                this._y = [];
                this._z = [];
                this._w = [];
                this._index = 0;
                this._knots = knots;
                this._multiplicity = multiplicity;
                this._controlPoints = controlPoints;
                this.reset();
            }
            reset() {
                this._x.length = this._controlPoints.length;
                this._y.length = this._controlPoints.length;
                this._z.length = this._controlPoints.length;
                this._w.length = this._controlPoints.length;
                this._index = 0;
            }
            run(k, u) {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                const s = u > this._knots[k] ? 0 : this._multiplicity[k];
                const h = p - s;
                for (let i = k - s; i >= k - p; i--) {
                    const { x, y, z, w } = this._controlPoints[i];
                    this._x[i] = x;
                    this._y[i] = y;
                    this._z[i] = z;
                    this._w[i] = w;
                }
                for (let r = 1; r <= h; r++) {
                    for (let i = k - s; i >= k - p + r; i--) {
                        const a = (u - this._knots[i]) / (this._knots[i + p - r + 1] - this._knots[i]);
                        this._x[i] = (1 - a) * this._x[i - 1] + a * this._x[i];
                        this._y[i] = (1 - a) * this._y[i - 1] + a * this._y[i];
                        this._z[i] = (1 - a) * this._z[i - 1] + a * this._z[i];
                        this._w[i] = (1 - a) * this._w[i - 1] + a * this._w[i];
                    }
                }
                this._index = k - s;
            }
            get x() {
                return this._x[this._index] / this._w[this._index];
            }
            get y() {
                return this._y[this._index] / this._w[this._index];
            }
            get z() {
                return this._z[this._index] / this._w[this._index];
            }
        }
        NURBS.DeBoorContext = DeBoorContext;
        class CurveIterator {
            constructor(knots, multiplicity, controlPoints, resolution) {
                this._knots = knots;
                this._multiplicity = multiplicity;
                this._controlPoints = controlPoints;
                this._resolution = resolution;
                this._deBoor = new DeBoorContext(knots, multiplicity, controlPoints);
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                this._min = this._knots[p];
                this._max = this._knots[m - p];
                this._k = p;
                this._i = 0;
            }
            _step() {
                const min = this._min;
                const max = this._max;
                const u = min + this._i++ * (max - min) / this._resolution;
                while (u >= this._knots[this._k + 1]) {
                    this._k++;
                }
                return u;
            }
            next() {
                if (this._i <= this._resolution) {
                    const u = this._step();
                    this._deBoor.run(this._k, u);
                    const { x, y, z } = this._deBoor;
                    return {
                        done: false,
                        value: { x, y, z },
                    };
                }
                else {
                    return {
                        done: true,
                        value: void 0,
                    };
                }
            }
        }
        class Curve {
            constructor(knots, controlPoints) {
                this._knots = [];
                this._multiplicity = [];
                this._controlPoints = [];
                this.isPeriodic = false;
                this.resolution = 100;
                this._deBoor = new DeBoorContext(this._knots, this._multiplicity, this._controlPoints);
                this.reset(knots, controlPoints);
            }
            get knotCount() {
                return this._knots.length;
            }
            get controlPointCount() {
                return this._controlPoints.length;
            }
            get degree() {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                return m - n - 1;
            }
            isStrict() {
                const p = this.degree + 1;
                if (this._multiplicity.length < p * 2) {
                    return false;
                }
                else {
                    const m = this._multiplicity.length - 1;
                    for (let i = 0; i < p; i++) {
                        if (this._multiplicity[i] !== p ||
                            this._multiplicity[m - p] !== p) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            _checkKnotIndex(index) {
                if (index >= 0 && index < this._knots.length) {
                    return index;
                }
                else {
                    throw new Error(`index ${index} out of bounds [0, ${this._knots.length})`);
                }
            }
            _checkControlPointIndex(index) {
                if (index >= 0 && index < this._controlPoints.length) {
                    return index;
                }
                else {
                    throw new Error(`index ${index} out of bounds [0, ${this._controlPoints.length})`);
                }
            }
            getKnot(index) {
                return this._knots[this._checkKnotIndex(index)];
            }
            getKnots() {
                return this._knots.slice();
            }
            getControlPoint(index) {
                const { x, y, z, w } = this._controlPoints[this._checkControlPointIndex(index)];
                return { x, y, z, w };
            }
            getControlPoints() {
                return this._controlPoints.map(({ x, y, z, w }) => ({ x, y, z, w }));
            }
            setKnot(index, u) {
                this._knots[this._checkKnotIndex(index)] = u;
            }
            _setKnots(knots) {
                const min = Math.min.apply(Math, knots);
                const max = Math.max.apply(Math, knots);
                copyArray(this._knots, knots.map(u => (u - min) / (max - min)).sort((u, v) => u - v));
                copyArray(this._multiplicity, this._knots.map(() => 1));
                for (let i = 1, j = 0; i < this._knots.length; i++) {
                    if (this._knots[i] > this._knots[i - 1]) {
                        for (let k = j; k < i; k++) {
                            this._multiplicity[k] = i - j;
                        }
                        j = i;
                    }
                }
            }
            setKnots(knots) {
                if (knots.length <= this._controlPoints.length) {
                    throw new Error(`a curve with ${this._controlPoints.length} controlPoints must have ` +
                        `at least ${this._controlPoints.length + 1} knots (${knots.length} ` +
                        `were provided)`);
                }
                this._setKnots(knots);
            }
            setControlPoint(index, point) {
                const { x, y, z, w } = point;
                const dest = this._controlPoints[this._checkControlPointIndex(index)];
                dest.x = x;
                dest.y = y;
                dest.z = z;
                dest.w = w;
            }
            _setControlPoints(controlPoints) {
                copyArray(this._controlPoints, controlPoints.map(({ x, y, z, w }) => ({ x, y, z, w })));
            }
            setControlPoints(controlPoints) {
                if (controlPoints.length >= this._knots.length) {
                    throw new Error(`a curve with ${this._knots.length} knots can have at most ` +
                        `${this._knots.length - 1} control points (${controlPoints.length} ` +
                        `were provided)`);
                }
                this._setControlPoints(controlPoints);
            }
            reset(knots, controlPoints) {
                if (controlPoints.length >= knots.length) {
                    throw new Error(`the number of knots must be greater than the number of control ` +
                        `points`);
                }
                this._setKnots(knots);
                this._setControlPoints(controlPoints);
            }
            createDeBoorContext() {
                return new DeBoorContext(this._knots, this._multiplicity, this._controlPoints);
            }
            _getK(u) {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                let k0 = p;
                let k1 = m - p + 1;
                while (k1 > k0) {
                    const k = (k0 + k1) >>> 1;
                    if (u < this._knots[k]) {
                        k1 = k;
                    }
                    else if (u > this._knots[k]) {
                        if (u < this._knots[k + 1]) {
                            return k;
                        }
                        else {
                            k0 = k + 1;
                        }
                    }
                    else {
                        return k;
                    }
                }
                if (u >= this._knots[k0] && u < this._knots[k0 + 1]) {
                    return k0;
                }
                else {
                    return -1;
                }
            }
            get domain() {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                return [this._knots[p], this._knots[m - p]];
            }
            sample(u) {
                this._deBoor.reset();
                const k = this._getK(u);
                if (k < 0) {
                    return null;
                }
                this._deBoor.run(k, u);
                const { x, y, z } = this._deBoor;
                return { x, y, z };
            }
            [Symbol.iterator]() {
                return new CurveIterator(this._knots, this._multiplicity, this._controlPoints, this.resolution);
            }
            renderCurve(context) {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                const min = this._knots[p];
                const max = this._knots[m - p];
                this._deBoor.reset();
                let k = p;
                while (min >= this._knots[k + 1]) {
                    k++;
                }
                this._deBoor.run(k, min);
                {
                    const { x, y, z } = this._deBoor;
                    context.first(x, y, z);
                }
                for (let i = 1; i <= this.resolution; i++) {
                    const u = min + i * (max - min) / this.resolution;
                    while (u >= this._knots[k + 1]) {
                        k++;
                    }
                    this._deBoor.run(k, u);
                    {
                        const { x, y, z } = this._deBoor;
                        context.next(x, y, z);
                    }
                }
                context.end();
            }
            renderPolyLine(context) {
                {
                    const { x, y, z, w } = this._controlPoints[0];
                    context.first(x, y, z, w);
                }
                for (let i = 1; i < this._controlPoints.length; i++) {
                    const { x, y, z, w } = this._controlPoints[i];
                    context.next(x, y, z, w);
                }
                context.end();
            }
            clone() {
                return new Curve(this._knots, this._controlPoints);
            }
            transform(matrix) {
                const m = matrix;
                for (let i = 0; i < this._controlPoints.length; i++) {
                    const point = this._controlPoints[i];
                    const { x, y, z } = point;
                    point.x = m[0] * x + m[1] * y + m[2] * z;
                    point.y = m[3] * x + m[4] * y + m[5] * z;
                    point.z = m[6] * x + m[7] * y + m[8] * z;
                }
            }
            translate(dx, dy, dz) {
                for (let i = 0; i < this._controlPoints.length; i++) {
                    const point = this._controlPoints[i];
                    point.x += dx;
                    point.y += dy;
                    point.z += dz;
                }
            }
            derive() {
                const m = this._knots.length - 1;
                const n = this._controlPoints.length - 1;
                const p = m - n - 1;
                const controlPoints = Array(n);
                for (let i = 1; i < this._controlPoints.length; i++) {
                    const a = p / (this._knots[i + p] - this._knots[i]);
                    const { x: x0, y: y0, z: z0, w: w0 } = this._controlPoints[i - 1];
                    const { x: x1, y: y1, z: z1, w: w1 } = this._controlPoints[i];
                    controlPoints[i - 1] = {
                        x: a * (x1 - x0),
                        y: a * (y1 - y0),
                        z: a * (z1 - z0),
                        w: a * (w1 - w0),
                    };
                }
                return new Curve(this._knots.slice(1, this._knots.length - 1), controlPoints);
            }
        }
        NURBS.Curve = Curve;
    })(NURBS = Darblast.NURBS || (Darblast.NURBS = {})); // namespace NURBS
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="Base.ts" />
/// <reference path="LayerManager.ts" />
var Darblast;
(function (Darblast) {
    class RenderLoop {
        constructor(canvasElement) {
            this.layers = new Darblast.LayerManager();
            this._running = false;
            this._canvas = new Darblast.Canvas(canvasElement);
            this.render = this.render.bind(this);
        }
        start() {
            if (!this._running) {
                this._running = true;
                window.requestAnimationFrame(this.render);
            }
        }
        stop() {
            this._running = false;
        }
        render(t) {
            this.layers.render(this._canvas, t);
            if (this._running) {
                window.requestAnimationFrame(this.render);
            }
        }
    }
    Darblast.RenderLoop = RenderLoop;
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="Loader.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Darblast;
(function (Darblast) {
    class Pool {
        constructor(audio) {
            audio.addEventListener('ended', Pool._resetElement);
            this._elements = [audio];
        }
        static _resetElement(event) {
            if (event.target) {
                (event.target).currentTime = 0;
            }
        }
        play() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this._elements.length; i++) {
                    if (!this._elements[i].currentTime) {
                        yield this._elements[i].play();
                        return;
                    }
                }
                const newElement = (this._elements[0].cloneNode(false));
                newElement.addEventListener('ended', Pool._resetElement);
                this._elements.push(newElement);
                yield newElement.play();
            });
        }
    }
    class Sound {
        constructor(basePath, names) {
            this._pools = Object.create(null);
            this._initialize(basePath, names);
        }
        _initialize(basePath, names) {
            return __awaiter(this, void 0, void 0, function* () {
                basePath = basePath.replace(/\/$/, '');
                const elements = yield Darblast.Loader.loadSounds(names.map(name => `${basePath}/${name}`));
                names.forEach((name, index) => {
                    const strippedName = name.replace(/\.[^.\/]+$/, '');
                    if (strippedName in this._pools) {
                        throw new Error(`duplicate sound entry: ${strippedName}`);
                    }
                    else {
                        this._pools[strippedName] = new Pool(elements[index]);
                    }
                }, this);
            });
        }
        play(name) {
            return __awaiter(this, void 0, void 0, function* () {
                if (name in this._pools) {
                    yield this._pools[name].play();
                    return true;
                }
                else {
                    return false;
                }
            });
        }
    }
    Darblast.Sound = Sound;
})(Darblast || (Darblast = {})); // namespace Darblast

return Darblast;
}));
