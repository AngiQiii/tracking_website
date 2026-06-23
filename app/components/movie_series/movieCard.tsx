"use client";

import { PiPopcorn } from "react-icons/pi";
import { GiFilmProjector } from "react-icons/gi";
import { FcFilmReel } from "react-icons/fc";
import { FaMinus, FaPlus, FaStar } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { Dispatch, SetStateAction, useState } from "react";
import type { Movie } from "../../types/movie";

function getTypeIcon(type: string) {
  switch (type) {
    case "movie":
      return <PiPopcorn size={22} />;
    case "series":
      return <GiFilmProjector size={22} />;
    case "one-shot":
      return <FcFilmReel size={22} />;
    default:
      return null;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Done":
      return "bg-green-500 text-white";
    case "Not started":
      return "bg-red-500 text-white";
    case "In progress":
      return "bg-yellow-400 text-black";
    default:
      return "bg-gray-300 text-black";
  }
}

export default function MovieCard({
  movie,
  onEdit,
  onRemove,
  confirmed,
  setConfirmed,
}: {
  movie: Movie;
  onEdit: () => void;
  onRemove: () => void;
  confirmed: boolean;
  setConfirmed: Dispatch<SetStateAction<boolean>>;
}) {
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);

  function showMoreDetailsHandler() {
    setToggleMoreDetails(!toggleMoreDetails);
  }

  function openConfirmationHandler() {
    setConfirmed(true);
  }
  return (
    <div
      className={`w-full p-5 text-black/80 rounded-4xl flex flex-col gap-5 justify-self-center  ${movie.type === "series" && movie.moreEpisodes === true ? "bg-[#22c55e]" : "bg-primary"}`}
    >
      <div className="flex  items-center justify-between max-mobile:flex-col max-mobile:items-start max-mobile:gap-2">
        <div className="flex items-start gap-3 max-mobile:gap-2">
          <div className="self-center">{getTypeIcon(movie.type)}</div>
          <div className="text-2xl max-mobile:text-[16px]">{movie.title}</div>
        </div>

        <div className="w-full flex items-end gap-5 max-mobile:justify-between">
          <div
            className={`px-3 py-1 rounded-full text-sm w-fit border-2 border-background ${getStatusStyle(movie.status)} max-mobile:px-2 max-mobile:text-[12px]`}
          >
            {movie.status}
          </div>

          <button type="button" onClick={showMoreDetailsHandler}>
            <FaAngleDown size={30} fill="#fcca46" className={`${toggleMoreDetails ? "rotate-180" : "rotate-0"} duration-700 max-mobile:w-5 max-mobile:h-5`} />
          </button>
        </div>
      </div>

      {toggleMoreDetails && (
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} size={18} fill={i < movie.rating ? "#fcca46" : "#233d4d"} />
              ))}
            </div>

            {movie.type === "series" && (
              <>
                <div className="max-mobile:text-[14px]">Seasons: {movie.seasons}</div>
                <div className="flex items-center gap-2">
                  <span className="max-mobile:text-[14px]">More seasons:</span>

                  <FaCircle size={14} fill={movie.moreEpisodes ? "#22c55e" : "#ef4444"} className="border-2 border-background rounded-full" />
                </div>
              </>
            )}
            <div className="mt-3 flex flex-col items-start">
              <div className="font-semibold max-mobile:text-[14px]">Related Movies / Series:</div>

              {movie.relatedItems.length === 0 ? (
                <div className="ml-2 text-black/80 max-mobile:text-[14px]">None</div>
              ) : (
                movie.relatedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 ml-2">
                    {getTypeIcon(item.type)}
                    <span>{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 self-end">
            <button onClick={onEdit} className="cursor-pointer px-5 py-2 bg-primary rounded-full">
              <FaPlus size={24} fill="#233d4d" className="max-mobile:w-5 max-mobile:h-5" />
            </button>
            <button onClick={openConfirmationHandler} className="cursor-pointer px-5 py-2 bg-buttons rounded-full">
              <FaMinus size={24} fill="#233d4d" className="max-mobile:w-5 max-mobile:h-5" />
            </button>
          </div>
          {confirmed && (
            <div className="w-70 absolute top-0 left-1/2 -translate-x-1/2 bg-secondary p-5 rounded-4xl">
              <h2 className="text-center mb-5">Are you sure you want to delete this item</h2>
              <div className="flex items-center justify-center gap-6">
                <button className="cursor-pointer px-5 py-2 bg-primary rounded-full" onClick={onRemove}>
                  Yes
                </button>
                <button className="cursor-pointer px-5 py-2 bg-buttons rounded-full" onClick={() => setConfirmed(false)}>
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
