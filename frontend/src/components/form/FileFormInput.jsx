import { FormControl, FormGroup, FormLabel, FormText } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import { Controller } from "react-hook-form";

const FileFormInput = ({
  name,
  control,
  label,
  helpText,
  id,
  containerClass,
}) => {
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ref, onBlur }, fieldState }) => (
        <FormGroup className={containerClass ?? ""}>
          {label && <FormLabel>{label}</FormLabel>}
          <div className="position-relative">
            <FormControl
              type="file"
              ref={ref}
              onBlur={onBlur}
              onChange={async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const base64 = await convertToBase64(file);
                  // Store an object containing the base64 and metadata
                  onChange({
                    name: file.name,
                    base64: base64,
                  });
                }
              }}
              isInvalid={Boolean(fieldState.error?.message)}
            />
            {/* Value will now be the base64 object we stored */}
            {value?.name && (
              <div className="mt-1 small text-success fw-bold">
                Selected: {value.name}
              </div>
            )}
          </div>
          {fieldState.error?.message && (
            <Feedback type="invalid">{fieldState.error?.message}</Feedback>
          )}
        </FormGroup>
      )}
    />
  );
};

export default FileFormInput;
