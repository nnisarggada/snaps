import Pocketbase from "pocketbase";
// const pb = new Pocketbase("http://127.0.0.1:8090");
const pb = new Pocketbase("https://snaps-app.nnisarg.in");

export default pb;

let cachedPhoto: any = null;
let cachedDate: string = "";

export const getPhotoOfTheDay = async () => {
  const currentDate = new Date();
  const currentUTCDate = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ),
  );

  const dateString = currentUTCDate.toISOString().split("T")[0];

  if (cachedDate === dateString && cachedPhoto !== null) {
    const photos = await pb.collection("photos").getFullList({
      expand: "author",
    });
    const photoExists = photos?.some((photo) => photo?.id === cachedPhoto.id);

    if (photoExists) {
      return cachedPhoto;
    }
  }

  function customRandom(seed: string) {
    let num = seed.charCodeAt(0);
    for (let i = 1; i < seed.length; i++) {
      num = (num * 31 + seed.charCodeAt(i)) % 1000000007;
    }
    return num / 1000000007;
  }

  const photos = await pb.collection("photos").getFullList({
    expand: "author",
  });
  const index = Math.floor(customRandom(dateString) * photos.length);
  const randomPhoto = photos[index];

  cachedPhoto = randomPhoto;
  cachedDate = dateString;

  return randomPhoto;
};
