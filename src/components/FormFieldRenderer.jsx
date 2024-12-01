import React from "react";

const FormFieldRenderer = ({ field, value, onChange }) => {
  const renderInputField = () => {
    switch (field.type) {
      case "dropdown":
        return (
          <select
            name={field.name}
            value={value || ""}
            onChange={onChange}
            required={field.required}
          >
            <option value="">--Select--</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "text":
      case "number":
      case "password":
      case "date":
        return (
          <input
            type={field.type}
            name={field.name}
            value={value || ""}
            onChange={onChange}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-field">
      <label>{field.label}</label>
      {renderInputField()}
      {field.required && !value && (
        <p className="error-message">This field is required.</p>
      )}
    </div>
  );
};

export default FormFieldRenderer;
