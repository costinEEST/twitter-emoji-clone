import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

import type { Post } from "@prisma/client";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data } = api.posts.getAll.useQuery();

  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}
      <main className="flex min-h-screen flex-col items-center justify-center">
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
      </main>
      <div>
        {(data as Post[])?.map(({ id, content }) => (
          <p key={id}>{content}</p>
        ))}
      </div>
    </>
  );
}
