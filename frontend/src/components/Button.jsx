import React from "react";

const Button = ({ buttonText, onClick, disabled , color="light-blue" }) => {
    const buttonStyle = {
        width: 200 ,
        height: 50 ,
        backgroundColor: color,
        color: "white",
        padding: "5px  15px",
        borderRadius: 25,
        
      };
  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default Button;