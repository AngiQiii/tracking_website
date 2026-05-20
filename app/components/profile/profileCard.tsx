import Image from "next/image";
import Link from "next/link";

type Props = {
  id: number;
  image: string;
};

export default function ProfileCard({ id, image }: Props) {
  return (
    <Link href={`/profiles/${id}`}>
      <button className="w-50 h-50 bg-primary p-5 rounded-full cursor-pointer">
        <div className="w-40 h-40 p-2 bg-secondary rounded-full flex items-center justify-center">
          {image && (
            <Image
              src={image}
              alt="Profile image"
              width={150}
              height={150}
              className="rounded-full object-cover w-35 h-35"
              unoptimized
            />
          )}
        </div>
      </button>
    </Link>
  );
}
