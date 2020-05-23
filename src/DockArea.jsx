import React from 'react';

import {
  Card,
  Col,
} from 'react-bootstrap';


export default function ({border, children}) {
  return (
    <Col sm="auto" className="d-flex align-items-stretch">
      <Card className={`rounded-0 ${['top', 'left', 'right', 'bottom']
          .filter(borderClass => borderClass !== border)
          .map(borderClass => `border-${borderClass}-0`)
          .join(' ')} shadow-sm`}>
        <Card.Body className="p-2">{children}</Card.Body>
      </Card>
    </Col>
  );
};
