import { MovieType } from "@services/apis/movie";
import { API_IMAGE_URL } from "@services/client";
import React from "react";
import styled from "styled-components/native";
import dayjs from "dayjs";
import Navigation from "@navigations/index";
import ScreenNames from "@navigations/ScreenNames";

interface Props {
  item: MovieType;
}

const MovieItem: React.FC<Props> = ({ item }) => {
  return (
    <Container
      onPress={() => {
        Navigation.navigateTo(ScreenNames.MovieDetail, { movieId: item.id });
      }}
    >
      <ImageMovie source={{ uri: `${API_IMAGE_URL}${item?.posterPath}` }} />
      <RightContainer>
        <TextTitle>{item?.title}</TextTitle>
        <TextDate>{dayjs(item?.releaseDate).format("DD MMM YYYY")}</TextDate>
        <TextDescription numberOfLines={2}>{item?.overview}</TextDescription>
      </RightContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  background-color: white;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  shadow-color: "#000000";
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ImageMovie = styled.Image`
  width: 96px;
  height: 141px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const RightContainer = styled.View`
  padding-left: 14px;
  padding-right: 14px;
  flex-shrink: 1;
`;

const TextTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const TextDate = styled.Text`
  font-size: 14px;
  color: #999999;
  margin-top: 8px;
`;

const TextDescription = styled.Text`
  font-size: 14px;
  color: #000000;
  margin-top: 16px;
`;

export default MovieItem;
