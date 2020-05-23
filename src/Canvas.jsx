import React from 'react';

import RenderContext from './RenderContext';


class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef(null);
    this.state = {
      renderContext: null,
    };
    this._resize = this._resize.bind(this);
    this._repaint = this._repaint.bind(this);
  }

  _doResize(renderContext) {
    const canvas = this._canvas.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    void renderContext?.setSize(width, height);
    this.setState({renderContext});
  }

  _resize() {
    const canvas = this._canvas.current;
    const {renderContext} = this.state;
    if (canvas) {
      this._doResize(renderContext);
      this.setState({renderContext});
    }
  }

  componentDidMount() {
    const context = this._canvas.current.getContext('2d');
    const renderContext = context ? new RenderContext(context) : null;
    window.addEventListener('resize', this._resize);
    this._doResize(renderContext);
    this.setState({renderContext});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    this.setState({
      renderContext: null,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.renderContext && this.state.renderContext) {
      this._repaint();
    }
  }

  _repaint() {
    const {renderContext} = this.state;
    if (renderContext) {
      this.props.document.render(renderContext);
      window.requestAnimationFrame(this._repaint);
    }
  }

  _wrapMouseHandler(name) {
    const {tool} = this.props;
    return ({clientX, clientY}) => {
      const {x, y} = this._canvas.current.getBoundingClientRect();
      void tool?.[name]?.(clientX - x, clientY - y);
    };
  }

  render() {
    return (
      <canvas
          ref={this._canvas}
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={this._wrapMouseHandler('onClick')}
          onMouseDown={this._wrapMouseHandler('onMouseDown')}
          onMouseMove={this._wrapMouseHandler('onMouseMove')}
          onMouseUp={this._wrapMouseHandler('onMouseUp')}/>
    );
  }
}


export default Canvas;
