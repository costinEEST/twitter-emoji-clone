import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";

import { Spinner } from "~/components/loading";

import { api } from "~/utils/api";

import type { NextPage } from "next";
import type { RouterOutputs } from "~/utils/api";
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  return user ? (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  ) : null;
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <Spinner size={60} />;

  if (!data) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col overflow-y-scroll">
      {[...data]?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username} `}</span>
          <span className="font-thin">{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  // Start fetching ASAP to cache the posts with React Query
  api.posts.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn ? (
              <CreatePostWizard />
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>

          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
