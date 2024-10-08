import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";

function App() {
  const [apiUrl, setApiUrl] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [output, setOutput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl); 
      setJsonData(JSON.stringify(response.data, null, 2)); 
      setStatusMessage("Data retrieved successfully");
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const renderHTML = () => {
    try {
      const parsedJson = JSON.parse(jsonData);

      const generateHTML = (obj) => {
        if (typeof obj === "object" && !Array.isArray(obj)) {
          return (
            <div>
              {Object.keys(obj).map((key) => (
                <div key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof obj[key] === "object"
                    ? generateHTML(obj[key])
                    : obj[key].toString()}
                </div>
              ))}
            </div>
          );
        } else if (Array.isArray(obj)) {
          return (
            <ol>
              {obj.map((item, index) => (
                <li key={index}>
                  {typeof item === "object"
                    ? generateHTML(item)
                    : item.toString()}
                </li>
              ))}
            </ol>
          );
        } else {
          return obj.toString();
        }
      };

      const htmlContent = generateHTML(parsedJson);
      setOutput(htmlContent);
    } catch (error) {
      setStatusMessage("Invalid JSON format");
    }
  };

  const renderMarkdown = () => {
    try {
      const parsedJson = JSON.parse(jsonData);

      const generateMarkdown = (obj) => {
        if (typeof obj === "object" && !Array.isArray(obj)) {
          return Object.keys(obj)
            .map(
              (key) =>
                `**${key}:** ${
                  typeof obj[key] === "object"
                    ? generateMarkdown(obj[key])
                    : obj[key].toString()
                }\n\n`
            )
            .join("");
        } else if (Array.isArray(obj)) {
          return obj
            .map(
              (item, index) =>
                `- ${
                  typeof item === "object"
                    ? generateMarkdown(item)
                    : item.toString()
                }`
            )
            .join("\n");
        } else {
          return obj.toString();
        }
      };

      const markdownContent = generateMarkdown(parsedJson);
      setOutput(
        <div dangerouslySetInnerHTML={{ __html: marked(markdownContent) }} />
      );
    } catch (error) {
      setStatusMessage("Invalid JSON format");
    }
  };

  return (
    <div className="app">
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <br />
        <button onClick={fetchData}>
          GET
        </button>
        <br />
        <textarea
          placeholder="Enter or edit JSON here"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />

        <div className="buttons">
          <button onClick={renderHTML}>Render as HTML</button>
          <button onClick={renderMarkdown}>Render as Markdown</button>
        </div>
        <div className="status-section">
          <p>{statusMessage}</p>
        </div>
      </div>
      <div className="render-section">
        <div className="left-section">
          <h3>JSON Output:</h3>
          <pre>{jsonData}</pre>
        </div>

        <div className="right-section">
          <h3>Rendered Output:</h3>
          <div className="right-section-output">{output}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
