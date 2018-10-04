import React from "react";

export const ContextTag = ({ context, onClick }) => {
  if (!context) {
    return null;
  }
  return (
    <span onClick={onClick} className="tag is-dark is-pulled-right">
      {context}
    </span>
  );
};
