import React from "react";

const Button = ({ buttonText, onClick, disabled , color="light-blue" }) => {
    const buttonStyle = {
        width: 200 ,
        height: 70 ,
        fontsize: 30 ,
        backgroundColor: color,
        color: "white",
        padding: "5px , 15px",
        
      };
  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default Button;