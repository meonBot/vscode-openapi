import styled from "styled-components";
import { useSelect } from "downshift";
import { ThemeColorVariables } from "@xliic/common/theme";
import { AngleDown, Check } from "../icons";
import { SelectOption } from "./DownshiftSelect";

export default function DownshiftMultiSelect<T>({
  options,
  placeholder,
  selected,
  onSelectedItemsChange,
  bottomMenu,
}: {
  options: SelectOption<T>[];
  placeholder?: string;
  label?: string;
  selected?: SelectOption<T>["value"][];
  onSelectedItemsChange: (items: SelectOption<T>["value"][]) => void;
  bottomMenu?: JSX.Element;
}) {
  const selectedValues = selected || [];
  const selectedItems = options.filter((item) => selectedValues.includes(item.value));

  function itemToString(item: SelectOption<T> | null) {
    return item ? item.label : "";
  }

  function isItemDisabled(item: SelectOption<T>): boolean {
    return item?.disabled === true;
  }

  function toggle(value: SelectOption<T>["value"]) {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];
    // keep the order of the options, so that the result does not depend on
    // the order in which the items were picked
    onSelectedItemsChange(
      options.filter((item) => updated.includes(item.value)).map((item) => item.value)
    );
  }

  const { isOpen, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
    items: options,
    isItemDisabled,
    itemToString,
    // selection is kept in the 'selected' property, downshift itself holds no selected item
    selectedItem: null,
    stateReducer: (state, { changes, type }) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          // keep the menu open to allow picking more than one item
          return { ...changes, isOpen: true, highlightedIndex: state.highlightedIndex };
        default:
          return changes;
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem !== null && selectedItem !== undefined) {
        toggle(selectedItem.value);
      }
    },
  });

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <SelectContainer>
        <Input {...getToggleButtonProps()}>
          {selectedItems.length === 0 && placeholder !== undefined && (
            <Placeholder>{placeholder}</Placeholder>
          )}
          {selectedItems.length > 0 && (
            <SelectedItem title={selectedItems.map(itemToString).join(", ")}>
              {selectedItems.map(itemToString).join(", ")}
            </SelectedItem>
          )}
          <AngleDown />
        </Input>
      </SelectContainer>
      <Dropdown {...getMenuProps()} $isOpen={isOpen}>
        {isOpen &&
          options.map((item, index) => (
            <li
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
              aria-selected={selectedValues.includes(item.value)}
            >
              <CheckMark $checked={selectedValues.includes(item.value)}>
                <Check />
              </CheckMark>
              <span>{item.label}</span>
            </li>
          ))}
        {isOpen && bottomMenu}
      </Dropdown>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:focus-within {
    border: 1px solid var(${ThemeColorVariables.focusBorder});
  }
  border: 1px solid transparent;
`;

const Input = styled.div`
  display: flex;
  color: var(${ThemeColorVariables.foreground});
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  > span {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > svg {
    margin-left: 3px;
    fill: var(${ThemeColorVariables.foreground});
  }
`;

const Placeholder = styled.span`
  color: var(${ThemeColorVariables.inputPlaceholderForeground});
`;

const SelectedItem = styled.span``;

const CheckMark = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  width: 12px;
  > svg {
    fill: var(${ThemeColorVariables.foreground});
    visibility: ${({ $checked }) => ($checked ? "visible" : "hidden")};
  }
`;

const Dropdown = styled.ul<{ $isOpen: boolean }>`
  max-height: 250px;
  overflow-y: auto;
  z-index: 1;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  list-style: none;
  background-color: var(${ThemeColorVariables.dropdownBackground});
  color: var(${ThemeColorVariables.dropdownForeground});
  ${({ $isOpen }) =>
    $isOpen &&
    `
    border: 1px solid var(${ThemeColorVariables.dropdownBorder});
    padding: 4px;
  `}

  & > li {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    cursor: pointer;
  }

  & > li:hover {
    background-color: var(${ThemeColorVariables.listHoverBackground});
  }

  & > li[aria-disabled="true"] {
    color: var(${ThemeColorVariables.disabledForeground});
  }

  & > li[aria-disabled="true"]:hover {
    background-color: transparent;
  }
`;
