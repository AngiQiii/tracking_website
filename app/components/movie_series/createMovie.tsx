"use client";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import type { Movie, RelatedItem, MovieType } from "../../types/movie";

import { PiPopcorn } from "react-icons/pi";
import { GiFilmProjector } from "react-icons/gi";
import { FcFilmReel } from "react-icons/fc";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

type Props = {
  onCancel: () => void;
  onAddMovie: (movie: Movie) => void;
  editMovie?: Movie;
};

export default function CreateMovie({
  onCancel,
  onAddMovie,
  editMovie,
}: Props) {
  const [type, setType] = useState<"movie" | "series" | "one-shot">("movie");
  const [status, setStatus] = useState<"Done" | "Not started" | "In progress">(
    "Not started",
  );
  const [moreEpisodes, setMoreEpisodes] = useState(true);
  const [rating, setRating] = useState(0);
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [title, setTitle] = useState("");
  const [seasons, setSeasons] = useState<number | null>(null);
  const { id: profileId } = useParams();

  useEffect(() => {
    if (editMovie) {
      setType(editMovie.type);
      setStatus(editMovie.status as any);
      setRating(editMovie.rating);
      setTitle(editMovie.title);
      setMoreEpisodes(editMovie.moreEpisodes);
      setSeasons(editMovie.seasons);
      setRelatedItems(editMovie.relatedItems);
    }
  }, [editMovie]);

  function addRelatedHandler() {
    setRelatedItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        type: "movie",
      },
    ]);
  }

  function removeRelatedHandler(id: string) {
    setRelatedItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function createMovieSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    const newMovie = {
      id: crypto.randomUUID(),
      profile_id: profileId,
      type,
      title,
      status,
      rating,
      more_episodes: moreEpisodes,
      seasons: type === "series" ? seasons : null,
      related_items: relatedItems,
      created_at: new Date().toISOString(),
    };

    const isEdit = !!editMovie;

    if (isEdit) {
      // If marked as Done, update timestamp
      const updatedCreatedAt =
        status === "Done" || status === "In progress"
          ? new Date().toISOString()
          : editMovie.createdAt;

      const { data, error } = await supabase
        .from("movies")
        .update({
          type,
          title,
          status,
          rating,
          more_episodes: moreEpisodes,
          seasons: type === "series" ? seasons : null,
          related_items: relatedItems,
          created_at: updatedCreatedAt,
        })
        .eq("id", editMovie.id)
        .select()
        .single();

      if (error) {
        console.log("UPDATE FAILED:", error.message);
        return;
      }

      onAddMovie({
        id: data.id,
        type: data.type,
        title: data.title,
        status: data.status,
        rating: data.rating,
        moreEpisodes: data.more_episodes,
        seasons: data.seasons,
        relatedItems: data.related_items || [],
        createdAt: data.created_at,
      });

      onCancel();
      return;
    }

    const { data: insertedMovie, error } = await supabase
      .from("movies")
      .insert(newMovie)
      .select()
      .single();

    if (error) {
      console.log("Insert error:", error.message);
      return;
    }

    onAddMovie({
      id: insertedMovie.id,
      type: insertedMovie.type,
      title: insertedMovie.title,
      status: insertedMovie.status,
      rating: insertedMovie.rating,
      moreEpisodes: insertedMovie.more_episodes,
      seasons: insertedMovie.seasons,
      relatedItems: insertedMovie.related_items || [],
      createdAt: insertedMovie.created_at,
    });

    onCancel();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <form
        onSubmit={createMovieSubmitHandler}
        className="w-130 p-5 bg-primary text-black/80 rounded-4xl flex flex-col gap-5 max-mobile:w-70"
      >
        {/* <div>Icon - Movie of series of short</div> */}
        <div>
          <label>Choose an Icon:</label>
          <div className="flex gap-3">
            {/* Movie */}
            <button
              type="button"
              onClick={() => setType("movie")}
              className="p-2.5 rounded-lg bg-transparent cursor-pointer"
              style={{
                border:
                  type === "movie" ? "2px solid #fcca46" : "2px solid #ccc",
              }}
            >
              <PiPopcorn size={24} fill="#233d4d" />
            </button>

            {/* Series */}
            <button
              type="button"
              onClick={() => setType("series")}
              className="p-2.5 rounded-lg bg-transparent cursor-pointer"
              style={{
                border:
                  type === "series" ? "2px solid #fcca46" : "2px solid #ccc",
              }}
            >
              <GiFilmProjector size={24} fill="#233d4d" />
            </button>

            {/* One-shot */}
            <button
              type="button"
              onClick={() => setType("one-shot")}
              className="p-2.5 rounded-lg bg-transparent cursor-pointer"
              style={{
                border:
                  type === "one-shot" ? "2px solid #fcca46" : "2px solid #ccc",
              }}
            >
              <FcFilmReel size={24} fill="#233d4d" />
            </button>
          </div>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name of series / Movie"
          className="text-black/80 border-2 border-secondary rounded-lg p-2"
        />
        <div>
          <label>Status:</label>
          <div className="flex gap-3">
            {/* Done */}
            <button
              type="button"
              onClick={() => setStatus("Done")}
              className="p-2 rounded-full bg-transparent cursor-pointer border-2 border-[#4CAF50] max-mobile:text-[12px]"
              style={{
                backgroundColor: status === "Done" ? "#4CAF50" : "transparent",
              }}
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => setStatus("Not started")}
              className="p-2 rounded-full bg-transparent cursor-pointer border-2 border-[#F44336] max-mobile:text-[12px]"
              style={{
                backgroundColor:
                  status === "Not started" ? "#F44336" : "transparent",
              }}
            >
              Not Started
            </button>
            <button
              type="button"
              onClick={() => setStatus("In progress")}
              className="p-2 rounded-full bg-transparent cursor-pointer border-2 border-[#FFEB3B] max-mobile:text-[12px]"
              style={{
                backgroundColor:
                  status === "In progress" ? "#FFEB3B" : "transparent",
              }}
            >
              In Progress
            </button>
          </div>
        </div>

        <div>
          <label>Star rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="cursor-pointer"
              >
                <FaStar
                  size={24}
                  fill={star <= rating ? "#fcca46" : "#233d4d"}
                />
              </button>
            ))}
          </div>
        </div>
        {type === "series" && (
          <input
            value={seasons ?? ""}
            onChange={(e) =>
              setSeasons(e.target.value ? Number(e.target.value) : null)
            }
            placeholder="Number of Seasons"
            type="number"
            className="text-black/80 border-2 border-secondary rounded-lg p-2"
          />
        )}
        {type === "series" && (
          <div className="flex items-center gap-3">
            <label>More seasons comming:</label>
            {/* Red = false */}
            <button
              type="button"
              onClick={() => setMoreEpisodes(false)}
              className={`p-2 rounded-full border-2 cursor-pointer ${
                moreEpisodes === false ? "border-red-500" : "border-transparent"
              }`}
            >
              <FaCircle size={20} fill="#ef4444" />
            </button>

            {/* Green = true */}
            <button
              type="button"
              onClick={() => setMoreEpisodes(true)}
              className={`p-2 rounded-full border-2 cursor-pointer ${
                moreEpisodes === true
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <FaCircle size={20} fill="#22c55e" />
            </button>
          </div>
        )}

        <div className="flex flex-col items-start justify-center gap-5">
          <div className="flex items-center justify-between">
            <label className="max-mobile:text-[16px]">
              Related series or Movies:
            </label>
            <button
              type="button"
              onClick={addRelatedHandler}
              className="px-10 self-end cursor-pointer max-mobile:px-3.75"
            >
              <FaPlus size={24} fill="#619b8a" />
            </button>
          </div>
          {relatedItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 items-center max-mobile:gap-2"
            >
              <input
                value={item.name}
                onChange={(e) =>
                  setRelatedItems((prev) =>
                    prev.map((r) =>
                      r.id === item.id ? { ...r, name: e.target.value } : r,
                    ),
                  )
                }
                placeholder="Related Series or Movies"
                className="text-black/80 border-2 border-secondary rounded-lg p-2 max-mobile:w-27.5"
              />

              <div className="flex gap-3 max-mobile:gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setRelatedItems((prev) =>
                      prev.map((r) =>
                        r.id === item.id ? { ...r, type: "movie" } : r,
                      ),
                    )
                  }
                  className="p-2.5 rounded-lg cursor-pointer max-mobile:p-2"
                  style={{
                    border:
                      item.type === "movie"
                        ? "2px solid #fcca46"
                        : "2px solid #ccc",
                  }}
                >
                  <PiPopcorn
                    size={24}
                    className="max-mobile:w-5 max-mobile:h-5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRelatedItems((prev) =>
                      prev.map((r) =>
                        r.id === item.id ? { ...r, type: "series" } : r,
                      ),
                    )
                  }
                  className="p-2.5 rounded-lg cursor-pointer max-mobile:p-2"
                  style={{
                    border:
                      item.type === "series"
                        ? "2px solid #fcca46"
                        : "2px solid #ccc",
                  }}
                >
                  <GiFilmProjector
                    size={24}
                    className="max-mobile:w-5 max-mobile:h-5"
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeRelatedHandler(item.id)}
                className="p-2.5 rounded-lg cursor-pointer"
              >
                <FaMinus size={24} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-100 bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer self-center max-mobile:w-62.5"
        >
          Submit
        </button>
      </form>
      <button
        type="button"
        onClick={onCancel}
        className="w-100 bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer self-center max-mobile:w-62.5"
      >
        Cancel
      </button>
    </div>
  );
}
