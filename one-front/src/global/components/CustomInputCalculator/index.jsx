import React from "react";
import PropTypes from "prop-types";
import "../../../pages/Home/ui/Calculator/Calculator.scss";
const CustomInputCalculator = ({ value, onChange, placeholder }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <input
        className="calculator__input"
        type="number"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

CustomInputCalculator.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default CustomInputCalculator;
