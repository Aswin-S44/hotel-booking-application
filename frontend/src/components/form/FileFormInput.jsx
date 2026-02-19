import { Controller } from "react-hook-form";
import { FormLabel, FormControl, FormText } from "react-bootstrap";

const FileFormInput = ({ name, control, label, containerClass }) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className={containerClass}>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <FormControl
              type="file"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const base64 = await toBase64(file);
                  onChange({ base64, name: file.name });
                }
              }}
              isInvalid={!!error}
            />
            {value && (
              <div className="mt-2">
                <img
                  src={typeof value === "string" ? value : value.base64}
                  alt="Preview"
                  style={{ height: "80px", width: "80px", objectFit: "cover" }}
                  className="rounded border"
                />
              </div>
            )}
            {error && (
              <FormText className="text-danger">{error.message}</FormText>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FileFormInput;
