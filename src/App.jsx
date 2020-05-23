import React from 'react';

import {
  Col,
  Container,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';


import Canvas from './Canvas';
import DockArea from './DockArea';
import Document from './Document';
import Parameters from './Parameters';
import SelectTool from './SelectTool';


class App extends React.Component {
  constructor(props) {
    super(props);
    const document = new Document();
    this.state = {
      document: document,
      tool: new SelectTool(document, () => {
        this.setState({document});
      }),
    };
  }

  render() {
    const {document, tool} = this.state;
    const {curves, selection} = document;
    return (
      <Container fluid className="m-0 p-0 h-100">
        <Row noGutters className="h-100">
          <DockArea border="right">
            <ToggleButtonGroup vertical className="shadow-sm" type="radio" name="tool" defaultValue="select">
              <ToggleButton size="lg" value="select"><i className="fas fa-mouse-pointer"></i></ToggleButton>
              <ToggleButton size="lg" value="edit"><i className="fas fa-draw-polygon"></i></ToggleButton>
            </ToggleButtonGroup>
          </DockArea>
          <Col>
            <Canvas document={document} tool={tool}/>
          </Col>
          <DockArea border="left">
            {selection !== null ? (
              <Parameters
                  curve={curves[selection.index]}
                  onChange={() => {
                    this.setState({document});
                  }}/>
            ) : null}
          </DockArea>
        </Row>
      </Container>
    );
  }
}


export default App;
