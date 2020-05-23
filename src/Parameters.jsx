import React from 'react';

import {
  Card,
  Col,
  Form,
  Row,
} from 'react-bootstrap';


export default function ({curve, onChange}) {
  return (
    <Card className="shadow-sm">
      <Card.Header>Parameters</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column="sm" className="text-right">Degree:</Form.Label>
            <Col>
              <Form.Control
                size="sm"
                type="number"
                readOnly
                value={curve.degree}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column="sm" className="text-right">Resolution:</Form.Label>
            <Col>
              <Form.Control
                size="sm"
                type="number"
                min="0"
                value={curve.resolution}
                onChange={({target}) => {
                  const parsed = parseInt(target.value, 10);
                  curve.resolution = isNaN(parsed) ? 0 : parsed;
                  onChange();
                }}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column="sm" className="text-right">Periodic:</Form.Label>
            <Col>
              <Form.Check
                custom
                type="switch"
                label=""
                checked={curve.isPeriodic}
                onChange={() => {}}/>
            </Col>
          </Form.Group>
          {curve.isPeriodic ? null : (
            <Form.Group as={Row}>
              <Form.Label column="sm" className="text-right">Strict:</Form.Label>
              <Col>
                <Form.Check
                  custom
                  type="switch"
                  label=""
                  checked={curve.isStrict}
                  onChange={() => {}}/>
              </Col>
            </Form.Group>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};
