import { createApi } from "unsplash-js";

const unsplushApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLUSH_ACCESS_KEY,
});

// const url = `https://api.foursquare.com/v3/places/search?query=coffee%20stores&near=toronto&limit=6`;

const unsplushPhoto = async () => {
  const photos = await unsplushApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });

  const unsplushResult = photos.response.results;

  return unsplushResult.map((photo) => {
    return photo.urls["small"];
  });
};

const fetchCoffeStoresData = async (
  latLong = "23.855023172628048,90.39728605110193",
  limit = 6
) => {
  const photos = await unsplushPhoto();
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=coffee%20stores&ll=${latLong}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `${process.env.NEXT_PUBLIC_FOUR_SQUARE_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  //   console.log(data);
  return data.results.map((result, index) => {
    return {
      ...result,
      imgUrl: photos[index],
    };
  });
};

export default fetchCoffeStoresData;
