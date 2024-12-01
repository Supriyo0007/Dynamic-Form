import React, { useState, useEffect } from "react";
import { getFormStructure } from "../utils/apiMock";
import ProgressBar from "./ProgressBar";
import FormFieldRenderer from "./FormFieldRenderer";

// State Management
const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    calculateProgress();
  };

  const calculateProgress = () => {
    const requiredFields = fields.filter((field) => field.required);
    const completedFields = requiredFields.filter((field) => formData[field.name]);
    setProgress((completedFields.length / requiredFields.length) * 100);
  };

    // Event Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Update existing row
      const updatedData = [...submittedData];
      updatedData[editingIndex] = formData;
      setSubmittedData(updatedData);
      setEditingIndex(null);
    } else {
      // Add new row
      setSubmittedData([...submittedData, formData]);
    }
    setFormData({});
    setProgress(0);
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setEditingIndex(index);
    calculateProgress();
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  };

  useEffect(() => {
    if (formType) {
      getFormStructure(formType).then((response) => {
        setFields(response.fields);
        setFormData({});
        setProgress(0);
      });
    }
  }, [formType]);

  return (
    <div className="form-container">
      <h1>Dynamic Form</h1>
      <div className="form-header">
        <label>Select Form Type:</label>
        <select onChange={(e) => setFormType(e.target.value)} value={formType}>
          <option value="">--Select--</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <FormFieldRenderer
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleFieldChange}
          />
        ))}
        <button type="submit" className="submit-btn">
          {editingIndex !== null ? "Update" : "Submit"}
        </button>
      </form>

      <ProgressBar progress={progress} />

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Data</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
