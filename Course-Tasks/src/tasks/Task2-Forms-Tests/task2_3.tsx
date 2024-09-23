import React, { useState } from "react";
const MouseEventTracker = () => {
  const [clickMessage, setClickMessage] = useState("");
  const [hoverMessage, setHoverMessage] = useState("");
  const handleClick = () => setClickMessage("Button Clicked!");
  const handleDoubleClick = () => setClickMessage("Button Double Clicked!");
  const handleMouseOver = () => setHoverMessage("Mouse Over Button");
  const handleMouseOut = () => setHoverMessage("Mouse Left Button");
  return (
    <div>
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Mouse Event Button
      </button>
      <p>{clickMessage}</p>
      <p>{hoverMessage}</p>
    </div>
  );
};
export default MouseEventTracker;
