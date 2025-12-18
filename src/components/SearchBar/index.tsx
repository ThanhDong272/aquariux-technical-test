import React, { useState } from "react";
import styled from "styled-components/native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText, onSubmit }) => {
  return (
    <Container>
      <ContentContainer>
        <Input
          value={value}
          onChangeText={(text) => onChangeText(text)}
          placeholder={"Search..."}
        />
      </ContentContainer>
      <ButtonSearch
        disabled={value.length === 0}
        searchable={value.length > 0}
        onPress={onSubmit}
      >
        <ButtonText searchable={value.length > 0}>Search</ButtonText>
      </ButtonSearch>
    </Container>
  );
};

const Container = styled.View`
  gap: 20px;
`;

const ContentContainer = styled.View`
  background-color: white;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
`;

const Input = styled.TextInput`
  padding-left: 15px;
  padding-right: 15px;
  height: 50px;
  font-size: 16px;
`;

const ButtonSearch = styled.TouchableOpacity<{ searchable: boolean }>`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.searchable ? "#00B4E4" : "#E4E4E4")};
  border-radius: 100px;
`;

const ButtonText = styled.Text<{ searchable: boolean }>`
  color: ${(props) => (props.searchable ? "white" : "#00000080")};
  font-size: 16px;
  font-weight: 600;
`;

export default SearchBar;
