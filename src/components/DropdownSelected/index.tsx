import FontAwesome from "@react-native-vector-icons/fontawesome";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

export type SelectType = {
  label: string;
  value: string;
  selected?: boolean;
};

interface Props {
  title: string;
  listOptions: SelectType[];
  setListOptions: (options: SelectType[]) => void;
}

const DropdownSelected: React.FC<Props> = ({
  title,
  listOptions,
  setListOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectItem = (item: SelectType) => {
    setListOptions(
      listOptions.map((opt) => ({
        ...opt,
        selected: opt.value === item.value,
      })) || []
    );
    setIsOpen(false);
  };

  return (
    <Container>
      <TitleContainer onPress={() => setIsOpen(!isOpen)}>
        <TextTitle>{title}</TextTitle>
        <FontAwesome
          name={isOpen ? "chevron-down" : "chevron-right"}
          size={20}
          color={"#000000"}
        />
      </TitleContainer>
      {isOpen ? (
        <DropdownContainer>
          {listOptions?.map((item, index) => (
            <ItemContainer
              onPress={() => handleSelectItem(item)}
              key={index}
              selected={item.selected || false}
            >
              <TextItem selected={item.selected || false}>
                {item.label}
              </TextItem>
            </ItemContainer>
          ))}
        </DropdownContainer>
      ) : null}
    </Container>
  );
};

const Container = styled.View`
  background-color: white;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  shadow-color: "#000000";
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const TitleContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
`;

const TextTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const DropdownContainer = styled.View`
  border-top-width: 1px;
  border-color: #e3e3e3;
  padding: 18px 20px;
  background-color: white;
  gap: 8px;
`;

const ItemContainer = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#00B4E4" : "#F8F8F8")};
  padding: 10px 15px;
`;

const TextItem = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.selected ? "white" : "black")};
`;

export default DropdownSelected;
