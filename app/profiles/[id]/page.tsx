"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import MovieCard from "@/app/components/movie_series/movieCard";
import { FaPlus } from "react-icons/fa6";
import CreateMovie from "@/app/components/movie_series/createMovie";
import type { Movie } from "../../types/movie";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

type Profile = {
  id: number;
  image: string;
};

function reorderMovies(movies: Movie[]) {
  const inProgress = movies.filter((m) => m.status === "In progress").sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  const notStarted = movies.filter((m) => m.status === "Not started").sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  const done = movies.filter((m) => m.status === "Done").sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  return [...inProgress, ...notStarted, ...done];
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<"list" | "create">("list");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();

      if (error) {
        console.log(error.message);
        return;
      }

      setProfile(data);
    }

    if (id) fetchProfile();
  }, [id]);

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase.from("movies").select("*").eq("profile_id", id).order("created_at", { ascending: true });

      if (error) {
        console.log(error.message);
        return;
      }

      const formatted = data.map((m) => ({
        id: m.id,
        type: m.type,
        title: m.title,
        status: m.status,
        rating: m.rating,
        moreEpisodes: m.more_episodes,
        seasons: m.seasons,
        relatedItems: m.related_items || [],
        createdAt: m.created_at,
      }));

      setMovies(reorderMovies(formatted));
    }

    if (id) fetchMovies();
  }, [id]);

  if (!profile) {
    return <p className="text-center">Loading...</p>;
  }

  async function removeMovie(movieId: string) {
    if (!confirmed) return;

    const { error } = await supabase.from("movies").delete().eq("id", movieId);

    console.log(error);

    if (error) {
      console.error(error.message);
      return;
    }

    setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full h-50 bg-contain bg-center" style={{ backgroundImage: `url(${profile.image})` }}></div>
      <Link href="/profiles" className="p-5 self-start cursor-pointer bg-secondary rounded-full max-mobile:p-2">
        <IoArrowBack size={30} className="max-mobile:w-5 max-mobile:h-5" />
      </Link>

      {editingMovie ? (
        <CreateMovie
          editMovie={editingMovie}
          onCancel={() => setEditingMovie(null)}
          onAddMovie={(updatedMovie) => {
            setMovies((prev) => reorderMovies(prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))));
          }}
        />
      ) : mode === "create" ? (
        <CreateMovie
          onCancel={() => setMode("list")}
          onAddMovie={(movie) => {
            setMovies((prev) => {
              const newMovie = {
                ...movie,
                createdAt: movie.status === "Not started" ? new Date().toISOString() : movie.createdAt,
              };

              return reorderMovies([...prev, newMovie]);
            });
            setMode("list");
          }}
        />
      ) : (
        <>
          <button onClick={() => setMode("create")} className="sticky top-4 p-5 self-end cursor-pointer bg-secondary rounded-full max-mobile:p-2">
            <FaPlus size={40} fill="#619b8a" className="max-mobile:w-5 max-mobile:h-5" />
          </button>

          <div className="p-10 flex flex-col gap-5 max-mobile:p-2">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={() => setEditingMovie(movie)}
                onRemove={() => removeMovie(movie.id)}
                confirmed={confirmed}
                setConfirmed={setConfirmed}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
