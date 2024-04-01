import { useEffect, useState } from "react";
import pb from "@utils/pocketbase";
import { FaArrowLeft, FaPlus, FaSearch, FaUser } from "react-icons/fa";

function OptionsModal({ setShowOptionsModal }) {
  return (
    <div
      onClick={() => setShowOptionsModal(false)}
      onKeyDown={(e) => e.key === "Escape" && setShowOptionsModal(false)}
      className="absolute inset-0 z-20 w-full h-full bg-neutral-950/40"
    >
      <div
        onClick={() => setShowOptionsModal(false)}
        onKeyDown={(e) => e.key === "Escape" && setShowOptionsModal(false)}
        className="relative inset-0 z-30 w-full h-full max-w-5xl mx-auto bg-transparent flex items-center justify-center p-4"
      >
        <div className="absolute max-w-[calc(100%-2rem)] top-[calc(4rem+5px)] right-3 z-50 bg-transparent text-md flex flex-col rounded-md drop-shadow-lg">
          <div className="group/profile w-full flex flex-col">
            <div className="relative w-full h-4 bg-transparent">
              <div className="absolute top-0 right-7 w-0 h-0 border-solid border-transparent border-8 border-r-neutral-800 border-b-neutral-800 transition-all group-hover/profile:border-r-neutral-900 group-hover/profile:border-b-neutral-900"></div>
              <div className="absolute top-0 right-3 w-0 h-0 border-solid border-transparent border-8 border-l-neutral-800 border-b-neutral-800 transition-all group-hover/profile:border-l-neutral-900 group-hover/profile:border-b-neutral-900"></div>
            </div>
            <a
              href={`/users/${pb.authStore.model.username}`}
              className="rounded-t-md bg-neutral-800 p-4 transition-all hover:bg-neutral-900"
            >
              <span>View Profile</span>
            </a>
          </div>

          <a
            href="/settings"
            className="bg-neutral-800 p-4 transition-all hover:bg-neutral-900"
          >
            Settings
          </a>
          <a
            href="/logout"
            className="truncate rounded-b-md bg-neutral-800 p-4 transition-all hover:bg-neutral-900"
          >
            Logout @<span>{pb.authStore.model.username}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function NavBar({ searchTerm }) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    if (showOptionsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showOptionsModal]);

  if (!pb.authStore.isValid) {
    return (
      <nav className="w-full h-20 bg-neutral-950">
        <div className="w-full max-w-5xl mx-auto h-full flex items-center justify-between gap-2 p-4">
          {searchTerm && (
            <a
              href="/"
              className="h-full aspect-square text-2xl rounded-full bg-transparent grid place-items-center transition-all hover:drop-shadow-lg"
            >
              <FaArrowLeft />
            </a>
          )}
          <div className="w-full flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-2">
            <form action="/search" className="w-full flex items-center gap-2">
              <input
                type="text"
                name="q"
                placeholder="Search"
                className="w-full text-md bg-transparent p-1 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log(e.target.value);
                  }
                }}
              />
              <button
                type="submit"
                tabIndex={-1}
                className="outline-none text-xl text-purple-500"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          <a
            href="/login"
            className="aspect-square text-xl rounded-full grid place-items-center p-2 transition-all hover:text-purple-500"
          >
            <FaPlus />
          </a>
          <a
            href="/login"
            className="h-full aspect-square text-2xl rounded-full bg-neutral-800 grid place-items-center transition-all hover:drop-shadow-lg"
          >
            <FaUser />
          </a>
        </div>
      </nav>
    );
  }
  const pfp = pb.authStore.model.avatar
    ? `${pb.baseUrl}/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}?thumb=50x50`
    : `https://ui-avatars.com/api/?name=${pb.authStore.model.username}&background=random`;

  return (
    <nav className="w-full h-20 bg-neutral-950">
      <div className="w-full max-w-5xl mx-auto h-full flex items-center justify-between gap-2 p-4">
        {searchTerm && (
          <a
            href="/"
            className="h-full aspect-square text-2xl rounded-full bg-transparent grid place-items-center transition-all hover:drop-shadow-lg"
          >
            <FaArrowLeft />
          </a>
        )}
        <div className="w-full flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-2">
          <form action="/search" className="w-full flex items-center gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search"
              className="w-full text-md bg-transparent p-1 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log(e.target.value);
                }
              }}
            />
            <button
              type="submit"
              tabIndex={-1}
              className="outline-none text-xl text-purple-500"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        <a
          href="/add"
          className="aspect-square text-xl rounded-full grid place-items-center p-2 transition-all hover:text-purple-500"
        >
          <FaPlus />
        </a>
        <button
          onClick={() => setShowOptionsModal(true)}
          onKeyDown={(e) => e.key === "Escape" && setShowOptionsModal(false)}
          className="h-full aspect-square rounded-full bg-neutral-800 transition-all hover:drop-shadow-lg"
        >
          <img
            src={pfp}
            alt={`Profile picture of ${pb.authStore.model.username}`}
            decoding="async"
            className="w-full h-full object-cover rounded-full"
          />
        </button>
        {showOptionsModal && (
          <OptionsModal setShowOptionsModal={setShowOptionsModal} />
        )}
      </div>
    </nav>
  );
}
