import React, { useState } from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { Linter } from "eslint";
import { AssignNode } from "three/webgpu";

const CodeFormatter: React.FC = () => {
  const [code, setCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const linter = new Linter();

  const handleProcess = async () => {
    // Format with Prettier
    try {
      const pretty = prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel],
      });
      setFormattedCode(await pretty);
    } catch (err) {
      setFormattedCode(`Formatting error: ${(err as Error).message}`);
    }

    // Lint with ESLint
    try {
      const messages = linter.verify(code, {
        rules: {
          semi: "error",
          "no-unused-vars": "warn",
        },
      });
      setErrors(messages.map((m) => `${m.message} (line ${m.line})`));
    } catch (err) {
      setErrors([`Linting error: ${(err as Error).message}`]);
    }
  };

  const handleBuild = () => {
    if (!formattedCode) return;

    const blob = new Blob([formattedCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.js"; // filename for download
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>JavaScript Debug & Format Tool</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your JavaScript code here..."
        rows={10}
        cols={60}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleProcess} style={{ marginRight: "1rem" }}>
        Format & Debug
      </button>
      <button onClick={handleBuild}>Build (Download JS)</button>

      <h3>Formatted Code:</h3>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {formattedCode}
      </pre>

      <h3>Debug Messages:</h3>
      <ul>
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default CodeFormatter;