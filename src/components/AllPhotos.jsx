import { useEffect, useState } from "react";
import pb from "@utils/pocketbase";
import { MdDownload } from "react-icons/md";

function PhotoItem({ photo }) {
  let pfp;

  if (photo.expand.author.avatar) {
    pfp = `${pb.baseUrl}/api/files/users/${photo.author}/${photo.expand.author.avatar}?thumb=50x50`;
  } else {
    pfp = `https://ui-avatars.com/api/?name=${photo.expand.author.name}&background=random`;
  }

  return (
    <div className="w-full md:w-[45%] lg:w-[30%] aspect-video flex flex-col bg-neutral-800 rounded-lg transition-all duration-500 ease-in-out hover:scale-105 hover:drop-shadow-lg">
      <a
        href={`/photos/${photo.id}`}
        className="w-full h-auto object-cover rounded-t-lg"
      >
        <img
          src={`${pb.baseUrl}/api/files/photos/${photo.id}/${photo.file}?thumb=720x480`}
          alt={photo.title}
          className="w-full object-cover rounded-t-lg"
        />
      </a>
      <div className="w-full flex flex-col justify-between gap-6 p-4">
        <div className="w-full flex flex-col gap-2">
          <a
            href={`/photos/${photo.id}`}
            className="line-clamp-1 text-xl md:text-2xl lg:text-3xl font-bold"
          >
            {photo.title}
          </a>
        </div>
        <div className="w-full flex items-center justify-between gap-4">
          <a
            href={`/users/${photo.expand.author.username}`}
            className="group w-2/3 flex items-center gap-2"
          >
            <div className="w-8 aspect-square rounded-full bg-neutral-700">
              <img
                src={pfp}
                alt={photo.expand.author.name}
                className="w-full aspect-square object-cover rounded-full"
              />
            </div>
            <p className="flex-1 truncate group-hover:underline">
              {photo.expand.author.name}
            </p>
          </a>
          <a
            href={`${pb.baseUrl}/api/files/photos/${photo.id}/${photo.file}?download=true`}
            className="text-xl font-bold bg-neutral-950 p-2 rounded-md tranisiton-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-md"
          >
            <MdDownload />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AllPhotos({ searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const perPage = 12;

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      if (searchTerm && searchTerm.trim().length > 0) {
        searchTerm = searchTerm.trim().toLowerCase();

        const res = await pb
          .collection("photos")
          .getList(currentPage, perPage, {
            filter: `title~'${searchTerm}' || categories~'${searchTerm}' || author.name~'${searchTerm}'`,
            sort: "-created",
            expand: "author",
          });
        setTotalPages(res.totalPages);
        setPhotos(photos.concat(res.items));
        setLoading(false);
        return;
      }
      const res = await pb.collection("photos").getList(currentPage, perPage, {
        sort: "-created",
        expand: "author",
      });
      setTotalPages(res.totalPages);
      setPhotos(photos.concat(res.items));
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPhotos();
  }, [currentPage]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight &&
      !loading &&
      currentPage < totalPages
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  if (photos.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-8 lg:gap-12 p-8 md:p-12 lg:p-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {searchTerm && (
              <>
                Search results for <span className="italic">{searchTerm}</span>
              </>
            )}
            {!searchTerm && "All Photos"}
          </h1>
          <p>No photos found :/</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-8 lg:gap-12 p-8 md:p-12 lg:p-16">
        <h1 className="line-clamp-2 ellipsis text-3xl md:text-4xl lg:text-5xl font-bold">
          {searchTerm && (
            <>
              Search results for <span className="italic">{searchTerm}</span>
            </>
          )}
          {!searchTerm && "All Photos"}
        </h1>
        <div className="w-full flex flex-wrap items-stretch justify-center gap-4 p-4">
          {photos.map((photo) => {
            return <PhotoItem key={photo.id} photo={photo} />;
          })}
        </div>
        {loading && <p className="text-xl mx-auto">Loading more photos...</p>}
      </div>
    </div>
  );
}
