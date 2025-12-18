import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

interface Props {
  route: { params: { movieId: number } };
}

const MovieDetail: React.FC<Props> = ({ route }) => {
  const { movieId } = route.params;

  console.log("movieId", movieId);

  return (
    <Container>
      <LogoImage source={require("../../assets/images/Logo.png")} />
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: white;
`;

const LogoImage = styled.Image`
  width: 80px;
  height: 58px;
  align-self: center;
`;

export default MovieDetail;
