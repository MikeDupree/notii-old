import React, { useState } from "react";
interface Props {
 setItems: (items) => void;
 onComplete?: (status: boolean) => void;
}
const FileUpload = ({ setItems, onComplete }: Props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileContent, setFileContent] = useState([]);

  console.log("fileContent", fileContent);

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContents = event.target.result;
      if (typeof fileContents !== "string") return;
      const contentArr = [];
      const lines = fileContents.split("\n");
      lines.forEach((line) => {
        // Process each line here
        const rowItems = line.split(",");
        contentArr.push({
          date: rowItems[0],
          label: rowItems[1],
          payment: rowItems[2],
          deposit: rowItems[3],
        });

        for (const [i, item] of contentArr.entries()) {
          for (const [i2, item2] of contentArr.entries()) {
            if (
              i !== i2 &&
              item.label === item2.label &&
              item.date !== item2.date
            ) {
              // console.log("Duplicate entry", { item, item2 });
            }
          }
        }
        setItems(contentArr);
        setFileContent(contentArr);
      });
    };
    reader.readAsText(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setSelectedFile(null);
      setErrorMessage("Please select a valid CSV file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    console.log("file", file);
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      readFileContent(file);
      setErrorMessage("");
      onComplete?.(true);
    } else {
      setErrorMessage("Please drop a valid CSV file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      // Handle file upload logic here
      console.log("File uploaded:", selectedFile);
      // Reset selected file
      setSelectedFile(null);
    } else {
      setErrorMessage("Please select a CSV file before submitting.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-md">
      <h1 className="text-xl font-bold mb-4">CSV File Upload</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fileInput" className="block mb-2">
            Select a file:
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            onChange={handleFileChange}
            className="py-2 px-4 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div
          className="border border-dashed border-gray-300 p-4 mb-4 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-gray-500">
            Drag and drop a CSV file here, or click to browse.
          </p>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
