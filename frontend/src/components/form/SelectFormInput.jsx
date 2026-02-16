import Choices from "choices.js";
import { useEffect, useRef } from "react";

const SelectFormInput = ({
  children,
  multiple,
  className,
  onChange,
  value,
  name,
  onBlur,
  ...choiceOptions
}) => {
  const selectRef = useRef(null);
  const choicesInstance = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        allowHTML: true,
        shouldSort: false,
        ...choiceOptions,
      });

      const handleChange = (e) => {
        if (!(e.target instanceof HTMLSelectElement)) return;
        if (onChange) {
          if (multiple) {
            const selectedValues = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            onChange(selectedValues);
          } else {
            onChange(e.target.value);
          }
        }
      };

      selectRef.current.addEventListener("change", handleChange);

      return () => {
        if (choicesInstance.current) {
          choicesInstance.current.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (choicesInstance.current && value !== undefined) {
      choicesInstance.current.setChoiceByValue(value);
    }
  }, [value]);

  return (
    <select
      ref={selectRef}
      multiple={multiple}
      className={className}
      name={name}
      onBlur={onBlur}
      defaultValue={value}
    >
      {children}
    </select>
  );
};

export default SelectFormInput;
