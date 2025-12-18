import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import type { ListRenderItem } from "react-native";
import React, { useState } from "react";
import { useMoviesPopular } from "@services/hooks/movies/useMoviesPopular";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import DropdownSelected, { SelectType } from "@components/DropdownSelected";
import SearchBar from "@components/SearchBar";
import { MovieResponse, MovieType } from "@services/apis/movie";
import { useMoviesNowPlaying } from "@services/hooks/movies/useMoviesNowPlaying";
import { useMoviesUpcoming } from "@services/hooks/movies/useMoviesUpcoming";
import MovieItem from "@components/PartialItem/MovieItem";
import { useEffect, useMemo } from "react";
import { useMoviesSearch } from "@services/hooks/movies/useSearchMovies";

interface Props {}

const categories: SelectType[] = [
  {
    label: "Now Playing",
    value: "now_playing",
    selected: true,
  },
  {
    label: "Upcoming",
    value: "upcoming",
    selected: false,
  },
  {
    label: "Popular",
    value: "popular",
    selected: false,
  },
];

const sorts: SelectType[] = [
  {
    label: "By alphabetical order",
    value: "original_title.asc",
    selected: true,
  },
  {
    label: "By rating",
    value: "vote_average.desc",
    selected: false,
  },
  {
    label: "By release date",
    value: "release_date.desc",
    selected: false,
  },
];

const HomeScreen: React.FC<Props> = () => {
  const [moviesData, setMoviesData] = useState<MovieResponse | null>(null);
  const [page, setPage] = useState<number>(1);
  const [listCategories, setListCategories] =
    useState<SelectType[]>(categories);
  const [listSorts, setListSorts] = useState<SelectType[]>(sorts);
  const [search, setSearch] = useState<string>(""); // committed search value
  const [searchInput, setSearchInput] = useState<string>(""); // typing value
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const { data: moviesNowPlaying, refetch: refetchMoviesNowPlaying } =
    useMoviesNowPlaying({
      page: page,
      sortBy: listSorts.find((s) => s.selected)?.value || "original_title.asc",
    });
  const { data: moviesUpcoming, refetch: refetchMoviesUpcoming } =
    useMoviesUpcoming({
      page: page,
      sortBy: listSorts.find((s) => s.selected)?.value || "original_title.asc",
    });
  const { data: moviesPopular, refetch: refetchMoviesPopular } =
    useMoviesPopular({
      page: page,
      sortBy: listSorts.find((s) => s.selected)?.value || "original_title.asc",
    });
  const { data: moviesSearch, refetch: refetchMoviesSearch } = useMoviesSearch({
    page: page,
    search: search,
  });

  // Determine the selected category value
  const selectedCategory = useMemo(
    () => listCategories.find((c) => c.selected)?.value,
    [listCategories]
  );

  const selectedSort = useMemo(
    () => listSorts.find((s) => s.selected)?.value || "original_title.asc",
    [listSorts]
  );

  // If user clears the search box, revert to category/sort automatically
  useEffect(() => {
    if (searchInput.trim().length === 0 && search !== "") {
      setSearch("");
    }
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    setMoviesData(null);
    setIsLoadingMore(false);
  }, [selectedCategory, selectedSort, search]);

  useEffect(() => {
    let currentData: MovieResponse | undefined;
    const hasSearch = (search || "").trim().length > 0;
    if (hasSearch) {
      currentData = moviesSearch?.data as MovieResponse | undefined;
    } else if (selectedCategory === "now_playing") {
      currentData = moviesNowPlaying?.data as MovieResponse | undefined;
    } else if (selectedCategory === "upcoming") {
      currentData = moviesUpcoming?.data as MovieResponse | undefined;
    } else if (selectedCategory === "popular") {
      currentData = moviesPopular?.data as MovieResponse | undefined;
    }
    if (!currentData) return;

    setMoviesData((prev) => {
      // Replace on first page
      if (page === 1 || !prev) {
        return currentData!;
      }

      // Append unique results for subsequent pages
      const prevResults = prev?.results || [];
      const nextResults = currentData.results || [];
      const existingIds = new Set(prevResults.map((r) => r.id));
      const appended = nextResults.filter((r) => !existingIds.has(r.id));

      return {
        ...currentData,
        results: [...prevResults, ...appended],
        totalPages: currentData.totalPages,
        totalResults: currentData.totalResults,
      } as MovieResponse;
    });
    if (page > 1) {
      setIsLoadingMore(false);
    }
  }, [
    selectedCategory,
    moviesNowPlaying,
    moviesUpcoming,
    moviesPopular,
    moviesSearch,
    page,
    search,
  ]);

  // Refetch when category or page changes to ensure API runs with correct page
  useEffect(() => {
    const hasSearch = (search || "").trim().length > 0;
    if (hasSearch) {
      refetchMoviesSearch();
      return;
    }
    if (!selectedCategory) return;
    if (selectedCategory === "now_playing") {
      refetchMoviesNowPlaying();
    } else if (selectedCategory === "upcoming") {
      refetchMoviesUpcoming();
    } else if (selectedCategory === "popular") {
      refetchMoviesPopular();
    }
  }, [selectedCategory, selectedSort, page, search]);

  const renderItem = ({ item, index }: { item: MovieType; index: number }) => {
    return <MovieItem item={item} />;
  };

  const handleLoadMore = () => {
    if (!moviesData) return;
    if (isLoadingMore) return;
    if (page >= (moviesData.totalPages || 1)) return;
    setIsLoadingMore(true);
    setPage((p) => p + 1);
  };

  return (
    <Container>
      <LogoImage source={require("../../assets/images/Logo.png")} />
      <ListMoviesContainer>
        <FlatList<MovieType>
          style={{ marginTop: 16 }}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <ContentContainer>
              <DropdownSelected
                title={
                  listCategories.find((c) => c.selected)?.label ||
                  "Select Category"
                }
                listOptions={listCategories}
                setListOptions={setListCategories}
              />
              <DropdownSelected
                title={
                  listSorts.find((c) => c.selected)?.label || "Select Sort"
                }
                listOptions={listSorts}
                setListOptions={setListSorts}
              />
              <SearchBar
                value={searchInput}
                onChangeText={setSearchInput}
                onSubmit={() => setSearch(searchInput.trim())}
              />
            </ContentContainer>
          }
          data={moviesData?.results || []}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoadingMore ? (
              <FooterLoading>
                <ActivityIndicator color="#000" />
              </FooterLoading>
            ) : (
              <ButtonLoadMore onPress={handleLoadMore}>
                <TextLoadMore>Load More</TextLoadMore>
              </ButtonLoadMore>
            )
          }
        />
      </ListMoviesContainer>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: white;
`;

const ContentContainer = styled.View`
  gap: 15px;
  margin-bottom: 45px;
`;

const LogoImage = styled.Image`
  width: 80px;
  height: 58px;
  align-self: center;
`;

const ListMoviesContainer = styled.View``;

const ButtonLoadMore = styled.TouchableOpacity`
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #00b4e4;
  margin-top: 16px;
  border-radius: 5px;
  margin-bottom: 40px;
`;

const FooterLoading = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 40px;
`;

const TextLoadMore = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 700;
`;

const styles = StyleSheet.create({});

export default HomeScreen;
