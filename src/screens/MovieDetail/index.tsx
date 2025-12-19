import CircleProgressBar from "@components/CircleProgressBar";
import CastItem from "@components/PartialItem/CastItem";
import RecommendItem from "@components/PartialItem/RecommendItem";
import Navigation from "@navigations/index";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { MovieType } from "@services/apis/movie";
import { API_IMAGE_URL } from "@services/client";
import { useMovieCredits } from "@services/hooks/movies/useMovieCredits";
import { useMovieDetails } from "@services/hooks/movies/useMovieDetails";
import { useMoviesRecommendations } from "@services/hooks/movies/useMoviesRecommendation";
import {
  addToWishlist,
  removeFromWishlist,
  wishlistSelector,
} from "@store/wishlist/reducer";
import {
  getDirectorName,
  getWriterName,
  toGenreNames,
  toHourMinute,
  toLanguageName,
  toUSCertification,
} from "@utils/common";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

interface Props {
  route: { params: { movieId: number } };
}

const MovieDetail: React.FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(wishlistSelector);
  const { movieId } = route.params;

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [recommendations, setRecommendations] = useState<MovieType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data: movieDetail, refetch: refetchMovieDetail } = useMovieDetails({
    movieId,
  });
  const { data: movieCredits, refetch: refetchMovieCredits } = useMovieCredits({
    movieId,
  });
  const { data: moviesRecommendations, refetch: refetchMoviesRecommendations } =
    useMoviesRecommendations({ movieId, page: page });

  useEffect(() => {
    refetchMovieDetail();
    refetchMovieCredits();
    refetchMoviesRecommendations();
  }, []);

  useEffect(() => {
    if (page > 1) {
      refetchMoviesRecommendations();
    }
  }, [page]);

  useEffect(() => {
    const results = moviesRecommendations?.results || [];
    const totalPages = moviesRecommendations?.totalPages || 1;

    if (page === 1) {
      setRecommendations(results);
    } else if (results.length) {
      setRecommendations((prev) => [...prev, ...results]);
    }

    setHasMore(page < totalPages && results.length > 0);

    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [moviesRecommendations]);

  const renderItemCast = ({ item }: { item: any }) => {
    return <CastItem item={item} />;
  };

  const renderItemRecommend = ({ item }: { item: any }) => {
    return <RecommendItem item={item} />;
  };

  const isInWishlist = wishlist.listWishlist.some(
    (item) => item.id === movieId
  );

  const handleToggleWishlist = () => {
    if (!movieDetail) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(movieId));
    } else {
      dispatch(addToWishlist(movieDetail));
    }
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setPage((prev) => prev + 1);
  };

  return (
    <Container>
      <LogoImage source={require("../../assets/images/Logo.png")} />
      <MovieInfoContainer>
        <ArrowBack
          onPress={() => {
            Navigation.goBack();
          }}
          name={"chevron-left"}
          color={"white"}
          size={28}
        />
        <TextMovieTitle numberOfLines={2}>
          {movieDetail?.title}
          <TextMovieYear>
            {dayjs(movieDetail?.releaseDate).format(" (YYYY)")}
          </TextMovieYear>
        </TextMovieTitle>
        <InfoContainer>
          <ImageMoviePoster
            source={{ uri: `${API_IMAGE_URL}${movieDetail?.posterPath}` }}
          />
          <RightInfoContainer>
            <PGContainer>
              <TextPG>{toUSCertification(movieDetail?.releaseDates)}</TextPG>
            </PGContainer>
            <ReleaseDateContainer>
              <TextRegular>
                {dayjs(movieDetail?.releaseDate).format("DD/MM/YYYY")}
              </TextRegular>
              <Dot />
              <TextRegular>
                {toHourMinute(movieDetail?.runtime || 0)}
              </TextRegular>
            </ReleaseDateContainer>
            <TextRegular>{toGenreNames(movieDetail?.genres)}</TextRegular>
            <TextSemibold>
              Status: <TextRegular>{movieDetail?.status}</TextRegular>
            </TextSemibold>
            <TextSemibold>
              Original Language:{" "}
              <TextRegular>
                {toLanguageName(movieDetail?.originalLanguage)}
              </TextRegular>
            </TextSemibold>
          </RightInfoContainer>
        </InfoContainer>
      </MovieInfoContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <OverviewContainer>
          <TopOverviewContainer>
            <UserScoreContainer>
              <CircleContainer>
                <CircleProgressBar
                  progress={(movieDetail?.voteAverage || 0) * 10}
                  strokeWidth={4}
                  size={50}
                  trackColor="#D0D2D366"
                  indicatorColor="#45FF8F"
                  children={
                    <TextBold fontSize={12}>
                      {((movieDetail?.voteAverage || 0) * 10).toFixed(0)}%
                    </TextBold>
                  }
                />
              </CircleContainer>
              <TextBold fontSize={18}>User Score</TextBold>
            </UserScoreContainer>
            <DirectorContainer>
              <TextSemibold>
                {getDirectorName(movieCredits?.crew) || "N/A"}
                {"\n"}
                <TextRegular>Director</TextRegular>
              </TextSemibold>
              <TextSemibold>
                {getWriterName(movieCredits?.crew) || "N/A"}
                {"\n"}
                <TextRegular>Writer</TextRegular>
              </TextSemibold>
            </DirectorContainer>
          </TopOverviewContainer>
          <TextTagline>
            {movieDetail?.tagline || "No tagline available."}
          </TextTagline>
          <TextBold style={{ marginTop: 15, marginBottom: 10 }} fontSize={24}>
            Overview
          </TextBold>
          <TextRegular>
            {movieDetail?.overview || "No overview available."}
          </TextRegular>
          <ButtonAddToWatchlist onPress={handleToggleWishlist}>
            <FontAwesome name={"bookmark"} color={"white"} size={20} />
            <TextSemibold>
              {isInWishlist ? "Remove Watchlist" : "Add to Watchlist"}
            </TextSemibold>
          </ButtonAddToWatchlist>
        </OverviewContainer>
        <BilledCastContainer>
          <TextSections>Top Billed Cast</TextSections>
          <FlatList
            style={{ marginTop: 20, paddingBottom: 35 }}
            contentContainerStyle={{ paddingLeft: 30 }}
            data={movieCredits?.cast || []}
            renderItem={renderItemCast}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
          />
        </BilledCastContainer>
        <Line />
        <RecommendContainer>
          <TextSections>Recommendations</TextSections>
          <FlatList
            style={{ marginTop: 20, paddingBottom: 35 }}
            contentContainerStyle={{ paddingLeft: 30 }}
            data={recommendations}
            renderItem={renderItemRecommend}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
            onEndReachedThreshold={0.1}
            onEndReached={handleLoadMore}
            ListFooterComponent={
              isLoadingMore && hasMore ? (
                <FooterLoading>
                  <ActivityIndicator color="#000" />
                </FooterLoading>
              ) : null
            }
          />
        </RecommendContainer>
      </ScrollView>
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

const ArrowBack = styled(FontAwesome)`
  position: absolute;
  top: 20px;
  left: 12px;
`;

const MovieInfoContainer = styled.View`
  margin-top: 18px;
  padding: 20px 30px;
  background-color: #0099c2;
`;

const TextMovieTitle = styled.Text`
  width: 60%;
  font-size: 20px;
  font-weight: 600;
  color: white;
  align-self: center;
  text-align: center;
`;

const TextMovieYear = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: white;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  margin-top: 38px;
`;

const ImageMoviePoster = styled.Image`
  width: 112px;
  height: 150px;
  border-radius: 5px;
`;

const RightInfoContainer = styled.View`
  flex: 1;
  gap: 8px;
`;

const PGContainer = styled.View`
  align-self: flex-start;
  border-color: #ffffffb3;
  border-width: 1px;
  padding: 4px 8px;
  border-radius: 3px;
`;

const TextPG = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #fffff3b3;
`;

const ReleaseDateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const TextRegular = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
`;

const TextSemibold = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

const TextBold = styled.Text<{ fontSize?: number }>`
  font-size: ${(props) => props.fontSize || 16}px;
  font-weight: 700;
  color: #ffffff;
`;

const Dot = styled.View`
  width: 4px;
  height: 4px;
  background-color: #ffffff;
  border-radius: 2px;
`;

const OverviewContainer = styled.View`
  padding: 20px 30px;
  background-color: #00b4e4;
`;

const TopOverviewContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 34px;
`;

const UserScoreContainer = styled.View`
  flex: 1;
  gap: 8px;
`;

const DirectorContainer = styled.View`
  flex: 1;
  gap: 15px;
`;

const TextTagline = styled.Text`
  font-size: 20px;
  font-style: italic;
  color: #ffffff;
`;

const ButtonAddToWatchlist = styled.TouchableOpacity`
  margin-top: 34px;
  padding: 8px 18px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: 15px;
  border-radius: 5px;
  border-width: 1px;
  border-color: white;
`;

const BilledCastContainer = styled.View`
  margin-top: 50px;
`;

const TextSections = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  padding-left: 30px;
`;

const Line = styled.View`
  height: 2px;
  background-color: #e4e4e4;
`;

const RecommendContainer = styled.View`
  margin-top: 25px;
  padding-bottom: 35px;
`;

const FooterLoading = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
`;

const CircleContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: #042541;
  align-items: center;
  justify-content: center;
`;

export default MovieDetail;
