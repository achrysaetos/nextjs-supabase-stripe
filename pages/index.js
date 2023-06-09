import { supabase } from "../utils/supabase";
import { useUser } from "../context/user";
import Dashboard from "./dashboard";
import Landing from "./landing";

export default function Home({ lessons }) {
  const { user } = useUser();

  return user ? <Dashboard lessons={lessons} /> : <Landing />;
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
