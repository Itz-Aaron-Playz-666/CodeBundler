import React, { useState } from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { Linter } from "eslint";

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
      <button onClick={handleProcess}>Format & Debug</button>

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
