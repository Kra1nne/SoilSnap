import Label from "../Label";
import Select from "../Select";

interface SelectInputsProps {
  title: string;
  name: string;
}

export default function SelectInputs({ title, name}: SelectInputsProps) {
  const options = [
    { value: "User", label: "User" },
    { value: "Admin", label: "Admin" },
    { value: "Soil Expert", label: "Soil Expert" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div>
      <Label>{title}</Label>
      <Select
        options={options}
        placeholder="Select Option"
        onChange={handleSelectChange}
        className="dark:bg-dark-900"
        name={name}
      />
    </div>
  );
}
