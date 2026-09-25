import { useController } from "react-hook-form";
import PlainDownshiftMultiSelect from "../DownshiftMultiSelect";
import { SelectOption } from "../DownshiftSelect";

export default function DownshiftMultiSelect<T>({
  name,
  options,
  placeholder,
}: {
  name: string;
  placeholder?: string;
  options: SelectOption<T>[];
}) {
  const { field } = useController({
    name,
  });

  return (
    <PlainDownshiftMultiSelect
      placeholder={placeholder}
      options={options}
      selected={field.value}
      onSelectedItemsChange={(items) => field.onChange(items)}
    />
  );
}
