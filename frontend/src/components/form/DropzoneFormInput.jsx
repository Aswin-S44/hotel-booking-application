import { useFileUploader } from "@/hooks";
import { useEffect, useRef } from "react";
import { Col, FormLabel, FormText } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { BsUpload } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const DropzoneFormInput = ({ label, onFileUpload, value, showPreview }) => {
  const { selectedFiles, handleAcceptedFiles, removeFile, setSelectedFiles } =
    useFileUploader(showPreview);

  const isInitialized = useRef(false);

  // Persistence: When navigating back, hydrate state from form Base64 strings
  useEffect(() => {
    if (
      value &&
      Array.isArray(value) &&
      value.length > 0 &&
      !isInitialized.current
    ) {
      setSelectedFiles(value);
      isInitialized.current = true;
    }
  }, [value, setSelectedFiles]);

  // Sync state to Wizard
  useEffect(() => {
    if (isInitialized.current || selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  }, [selectedFiles, onFileUpload]);

  return (
    <>
      {label && <FormLabel>{label}</FormLabel>}
      <Dropzone
        onDrop={(files) => {
          isInitialized.current = true;
          handleAcceptedFiles(files);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone dropzone-custom">
            <div className="dz-message" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="mb-3">
                <BsUpload size={30} />
              </div>
              <p>Drop files here or click to upload.</p>
            </div>
            {showPreview && selectedFiles.length > 0 && (
              <div className="dz-preview row g-4 mt-2">
                {selectedFiles.map((file, idx) => (
                  <Col xl={2} md={4} sm={6} key={idx}>
                    <div className="card p-2 shadow-none border position-relative h-100">
                      {/* Use the base64 preview directly */}
                      <img
                        src={file.preview}
                        alt="preview"
                        className="rounded img-fluid"
                      />
                      <div className="mt-2 small text-truncate fw-bold">
                        {file.name}
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0"
                        style={{ width: "20px", height: "20px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file);
                        }}
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  </Col>
                ))}
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default DropzoneFormInput;
