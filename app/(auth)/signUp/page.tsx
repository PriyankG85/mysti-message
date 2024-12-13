"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        fetch(`/api/check-username-unique?username=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setUsernameMessage(data.message))
          .catch((err) => {
            console.log(err.message);
          })
          .finally(() => {
            setIsCheckingUsername(false);
          });
      }
    };

    checkUsername();
  }, [username]);

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast(result.message);
        router.replace(`/verify/${username}`);
      } else {
        console.log(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-100">
      <div className="w-full max-w-md p-8 space-y-8 rounded bg-bg-300 shadow-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Sign Up</h1>
          <p className="text-sm text-primary-300/80">
            Sign up to start your anonymous adventure.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 text-white"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        debouncedUsername(e.target.value);
                        field.onChange(e);
                      }}
                      className="text-black"
                    />
                  </FormControl>

                  <div>
                    {isCheckingUsername && (
                      <span className="text-sm mt-2 text-primary-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </span>
                    )}
                    {usernameMessage && (
                      <span
                        className={`text-sm mt-2 ${
                          usernameMessage === "Username is unique"
                            ? "text-green-400"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {usernameMessage}
                      </span>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-muted">Already have an account?</span>
          <Link href="/signIn" className="text-sm font-medium underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
