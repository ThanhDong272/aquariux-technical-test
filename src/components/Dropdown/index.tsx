import FontAwesome from "@react-native-vector-icons/fontawesome";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

interface Props {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  items: Array<{ label: string; value: string }>;
  setItems: React.Dispatch<
    React.SetStateAction<Array<{ label: string; value: string }>>
  >;
  placeholder?: string;
}

const Dropdown: React.FC<Props> = ({
  value,
  setValue,
  items,
  setItems,
  placeholder = "Rating",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      style={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderBottomWidth: 2,
        borderBottomColor: "#00B4E4",
        borderRadius: 0,
        paddingHorizontal: 0,
        minHeight: 40,
        maxWidth: 120,
      }}
      placeholderStyle={{
        color: "#00B4E4",
        fontWeight: "600",
      }}
      labelStyle={{
        color: "#00B4E4",
        fontWeight: "600",
      }}
      dropDownContainerStyle={{
        maxWidth: 120,
        borderColor: "#E6E6E6",
      }}
      ArrowUpIconComponent={({ style }) => (
        <FontAwesome
          name="chevron-up"
          size={16}
          color="#00B4E4"
          style={style}
        />
      )}
      ArrowDownIconComponent={({ style }) => (
        <FontAwesome
          name="chevron-down"
          size={16}
          color="#00B4E4"
          style={style}
        />
      )}
      zIndex={1000}
    />
  );
};

export default Dropdown;
