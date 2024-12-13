"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/sample_messages.json";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center gap-5 pt-10">
      <h1 className="text-4xl font-bold">
        Dive into the world of Anonymous Messaging
      </h1>
      <p>Explore MystiMessage - where your identity remains a secret.</p>

      <Link href={"/signUp"}>
        <Button variant={"secondary"} className="bg-accent-200">
          Get Started
        </Button>
      </Link>

      <Carousel
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        className="max-w-xl mt-10"
      >
        <CarouselContent>
          {messages.messages.map((message, index) => (
            <CarouselItem key={index}>
              <Card className="bg-accent-200 min-h-[10rem]">
                <CardHeader>
                  <CardTitle>{message.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{message.content}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"secondary"} />
        <CarouselNext variant={"secondary"} />
      </Carousel>
    </div>
  );
}
