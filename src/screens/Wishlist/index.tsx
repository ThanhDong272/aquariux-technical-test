import { FlatList, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccountDetails } from "@services/hooks/account/useAccountDetails";
import { API_AVATAR_URL } from "@services/client";
import dayjs from "dayjs";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist, wishlistSelector } from "@store/wishlist/reducer";
import MovieItem from "@components/PartialItem/MovieItem";
import { MovieDetailType } from "@services/apis/movie";
import Dropdown from "@components/Dropdown";

interface Props {}

const WishlistScreen: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { listWishlist } = useSelector(wishlistSelector);
  const { data: accountDetails } = useAccountDetails({ accountId: 20321280 }); // can change to accountId from this link once you login https://developer.themoviedb.org/reference/account-details

  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  const [value, setValue] = useState<string | null>("rating");
  const [items, setItems] = useState<Array<{ label: string; value: string }>>([
    { label: "Rating", value: "rating" },
    { label: "Alphabetical order", value: "alphabetical" },
    { label: "Release Date", value: "release_date" },
  ]);

  const handleChangeOrder = () => {
    setOrderBy((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedWishlist = useMemo(() => {
    if (!listWishlist?.length || !value) return listWishlist || [];

    const data = [...listWishlist];

    data.sort((a: MovieDetailType, b: MovieDetailType) => {
      switch (value) {
        case "alphabetical": {
          const aTitle = a.title || "";
          const bTitle = b.title || "";
          const res = aTitle.localeCompare(bTitle);
          return orderBy === "asc" ? res : -res;
        }
        case "rating": {
          const aRating =
            typeof a.voteAverage === "number"
              ? a.voteAverage
              : Number(a.voteAverage) || 0;
          const bRating =
            typeof b.voteAverage === "number"
              ? b.voteAverage
              : Number(b.voteAverage) || 0;
          return orderBy === "asc" ? aRating - bRating : bRating - aRating;
        }
        case "release_date": {
          const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return orderBy === "asc" ? aTime - bTime : bTime - aTime;
        }
        default:
          return 0;
      }
    });

    return data;
  }, [listWishlist, value, orderBy]);

  const renderItem = ({ item }: { item: MovieDetailType }) => {
    return (
      <MovieItem
        item={item}
        showDeleteIcon={true}
        onDelete={(movieId: number) => {
          dispatch(removeFromWishlist(movieId));
        }}
      />
    );
  };

  console.log("listWishlist", listWishlist);

  return (
    <Container>
      <LogoImage source={require("../../assets/images/Logo.png")} />
      <AccountDetailContainer>
        <ImageAccount
          source={{
            uri: `${API_AVATAR_URL}/${accountDetails?.avatar?.gravatar?.hash}`,
          }}
        />
        <RightAccountContainer>
          <TextBold color="#fff" fontSize={20}>
            {accountDetails?.username || "Guest User"}
          </TextBold>
          <TextRegular color="#FFFFFFB2" fontSize={16}>
            {`Member since ${dayjs().format("MMM YYYY")}`}
          </TextRegular>
        </RightAccountContainer>
      </AccountDetailContainer>
      <WatchlistContainer>
        <TextBold color="#000" fontSize={18}>
          My Watchlist
        </TextBold>
        <FilterOrderContainer>
          <FilterContainer>
            <TextRegular color="#828282" fontSize={16}>
              Filter:
            </TextRegular>
            <Dropdown
              value={value}
              setValue={setValue}
              items={items}
              setItems={setItems}
            />
          </FilterContainer>
          <OrderContainer onPress={handleChangeOrder}>
            <TextRegular color="#828282" fontSize={16}>
              Order:
            </TextRegular>
            {orderBy === "asc" ? (
              <FontAwesome name="arrow-up" size={20} color="#000" />
            ) : (
              <FontAwesome name="arrow-down" size={20} color="#000" />
            )}
          </OrderContainer>
        </FilterOrderContainer>
      </WatchlistContainer>
      <FlatList<MovieDetailType>
        data={sortedWishlist || []}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerStyle}
      />
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

const AccountDetailContainer = styled.View`
  margin-top: 18px;
  padding: 20px 30px;
  background-color: #042541;
  flex-direction: row;
  align-items: center;
  gap: 26px;
`;

const ImageAccount = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 64px;
`;

const RightAccountContainer = styled.View`
  gap: 4px;
`;

const TextBold = styled.Text<{ color: string; fontSize: number }>`
  color: ${(props) => props.color || "#000"};
  font-size: ${(props) => props.fontSize || 14}px;
  font-weight: 700;
`;

const TextRegular = styled.Text<{ color: string; fontSize: number }>`
  color: ${(props) => props.color || "#000"};
  font-size: ${(props) => props.fontSize || 14}px;
  font-weight: 400;
`;

const WatchlistContainer = styled.View`
  padding: 28px;
  gap: 20px;
`;

const FilterOrderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FilterContainer = styled.View`
  flex: 1;
  align-items: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding-right: 20px;
`;

const OrderContainer = styled.Pressable`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 28,
  },
});

export default WishlistScreen;
