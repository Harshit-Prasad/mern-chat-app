import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ToolTip({ children, tooltip, placement }) {
  return (
    <OverlayTrigger
      key={tooltip}
      placement={placement}
      overlay={<Tooltip id={tooltip}>{tooltip}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
}
