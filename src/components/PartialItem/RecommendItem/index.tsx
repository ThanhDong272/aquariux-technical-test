import { MovieType } from "@services/apis/movie";
import { API_IMAGE_URL } from "@services/client";
import React from "react";
import { styled } from "styled-components/native";

interface Props {
  item: MovieType;
}

const RecommendItem: React.FC<Props> = ({ item }) => {
  return (
    <Container>
      <ImageMovie source={{ uri: `${API_IMAGE_URL}${item?.posterPath}` }} />
      <BottomContainer>
        <TextRegular>{item.title}</TextRegular>
        <TextRegular>{(item?.voteAverage * 10).toFixed(0)}%</TextRegular>
      </BottomContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-right: 16px;
`;

const ImageMovie = styled.Image`
  width: 286px;
  height: 162px;
  border-radius: 5px;
`;

const BottomContainer = styled.View`
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TextRegular = styled.Text`
  font-size: 18px;
  font-weight: 400;
  color: #000000;
`;

export default RecommendItem;
