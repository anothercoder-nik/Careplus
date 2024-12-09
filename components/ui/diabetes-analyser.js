"use client";

import axios from "axios";
import {
  Baby,
  Droplet,
  Heart,
  Ruler,
  Syringe,
  Scale,
  TreeDeciduous,
  Cake,
} from "lucide-react";
import React, { useState } from "react";
import "./index.css";

export default function DiabetesAnalyzer() {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setResult(response.data.diabetes ? "Positive" : "Negative");
    } catch (err) {
      console.error(err);
      setResult("Error occurred.");
    }
    setIsLoading(false);
  };

  const getIcon = (key) => {
    const icons = {
      Pregnancies: Baby,
      Glucose: Droplet,
      BloodPressure: Heart,
      SkinThickness: Ruler,
      Insulin: Syringe,
      BMI: Scale,
      DiabetesPedigreeFunction: TreeDeciduous,
      Age: Cake,
    };
    const IconComponent = icons[key];
    return <IconComponent className="input-icon" size={20} />;
  };

  return (
    <div className="diabetes-analyzer">
      <div className="container">
        <h2 className="title">Diabetes Analyzer</h2>
        <p className="description">
          Enter your health metrics to analyze your diabetes risk.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-grid">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="input-group">
                <label htmlFor={key} className="input-label">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="input-wrapper">
                  <input
                    id={key}
                    type="number"
                    step={
                      key === "BMI" || key === "DiabetesPedigreeFunction"
                        ? "0.1"
                        : "1"
                    }
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={`Enter ${key}`}
                  />
                  {getIcon(key)}
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>

          {result && (
            <div
              className={`result ${
                result === "Positive"
                  ? "result-positive"
                  : result === "Negative"
                    ? "result-negative"
                    : "result-error"
              }`}
            >
              Result: {result}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
