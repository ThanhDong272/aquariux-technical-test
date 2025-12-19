import { MovieCast } from "@services/apis/movie";
import { API_IMAGE_URL } from "@services/client";
import React from "react";
import styled from "styled-components/native";

interface Props {
  item: MovieCast;
}

const CastItem: React.FC<Props> = ({ item }) => {
  return (
    <Container>
      <ImageCast source={{ uri: `${API_IMAGE_URL}${item.profilePath}` }} />
      <TextContainer>
        <TextBold>{item.name}</TextBold>
        <TextRegular>{item.character}</TextRegular>
      </TextContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 140px;
  margin-right: 16px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  shadow-color: "#000000";
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const ImageCast = styled.Image`
  width: 140px;
  height: 154px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const TextContainer = styled.View`
  padding: 10px;
`;

const TextBold = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
`;

const TextRegular = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #000000;
`;

export default CastItem;
