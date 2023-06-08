import { supabase } from "../utils/supabase";
import Link from "next/link";
import { useUser } from "../context/user";

export default function Home({ lessons }) {
  const { user } = useUser();
  console.log({ user });

  // Use the pre-rendered props from getStaticProps() to display all lessons
  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  );
}

// Get all props from the lesson table at build time
export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");

  return {
    props: {
      lessons,
    },
  };
};
