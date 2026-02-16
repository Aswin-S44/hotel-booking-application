import { useState } from "react";

export default function useFileUploader(showPreview = true) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAcceptedFiles = async (files, callback) => {
    if (!files || !Array.isArray(files)) return;

    // Convert all new files to Base64
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        // If it's already a base64 string (from persistence), skip
        if (typeof file === "string" || file.base64) return file;

        const base64 = await convertToBase64(file);
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          formattedSize: formatBytes(file.size),
          base64: base64, // The data for the API
          preview: base64, // Base64 is a valid src for <img>
        };
      })
    );

    const allFiles = [...selectedFiles, ...processedFiles];
    setSelectedFiles(allFiles);

    if (callback) callback(allFiles);
  };

  const removeFile = (file) => {
    const newFiles = selectedFiles.filter((f) => f !== file);
    setSelectedFiles(newFiles);
  };

  return {
    selectedFiles,
    setSelectedFiles,
    handleAcceptedFiles,
    removeFile,
  };
}
