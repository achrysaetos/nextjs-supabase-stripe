import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Video from "react-player";

const LessonDetails = ({ lesson }) => {
  const [videoUrl, setVideoUrl] = useState();

  // Display premium content
  const getPremiumContent = async () => {
    const { data } = await supabase
      .from("premium_content")
      .select("video_url")
      .eq("id", lesson.id)
      .single();

    setVideoUrl(data?.video_url); // Optional chaining (ie. if user is not subscribed)
  };

  // Show on mount
  useEffect(() => {
    getPremiumContent();
  }, []);

  // Display the lesson title and description for each respective path
  return (
    <div className="w-full max-w-3xl mx-auto my-24 px-8">
      {!!videoUrl && <Video url={videoUrl} width="100%" />}
    </div>
  );
};

// Pre-render all id pages at build time
export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lesson").select("id");

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false, // 404 if path doesn't exist
  };
};

// Pre-render all props from the lesson table at build time
export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson } = await supabase
    .from("lesson")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
