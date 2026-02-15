import Choices from 'choices.js';
import { useEffect, useRef } from 'react';

const SelectFormInput = ({
  children,
  multiple,
  className,
  value,
  onChange,
  ...choiceOptions
}) => {
  const selectE = useRef(null);
  const choicesInstance = useRef(null);

  useEffect(() => {
    if (selectE.current) {
      choicesInstance.current = new Choices(selectE.current, {
        ...choiceOptions,
        allowHTML: true,
        shouldSort: false
      });

      selectE.current.addEventListener('change', (e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      });
    }

    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (choicesInstance.current && value) {
      choicesInstance.current.setChoiceByValue(value);
    }
  }, [value]);

  return (
    <select
      ref={selectE}
      multiple={multiple}
      className={className}
      value={value}
      onChange={() => {}}
    >
      {children}
    </select>
  );
};

export default SelectFormInput;
