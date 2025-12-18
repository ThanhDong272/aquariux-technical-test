import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useMoviesPopular } from "@services/hooks/movies/useMoviesPopular";

interface Props {}

const HomeScreen: React.FC<Props> = () => {
  const { data } = useMoviesPopular({ page: 1 });

  console.log("data", data);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
