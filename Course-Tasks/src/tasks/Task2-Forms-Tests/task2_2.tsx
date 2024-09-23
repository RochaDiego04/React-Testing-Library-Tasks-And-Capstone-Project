import React, { useState } from "react";

const MessageForm = () => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={handleChange}
      />
      <p>Message: {message}</p>
    </div>
  );
};

export default MessageForm;
