"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <section className="container flex flex-col items-start justify-center gap-12 section-padding">
        <h1 className="text-4xl font-bold">
          Welcome{user?.name ? ` ${user.name}` : ""}
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          This is the home page. Lorem ipsum dolor sit amet consectetur
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Title here here</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Some content</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Title here</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Some content</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Title here</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Some content</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}