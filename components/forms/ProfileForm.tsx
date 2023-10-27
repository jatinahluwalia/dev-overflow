"use client";

import { IUser } from "@/database/user.model";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { UserSchema, userSchema } from "@/lib/validations";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  clerkId: string;
  user: string;
}
const ProfileForm = ({ clerkId, user }: Props) => {
  const parsedUser: Omit<IUser, "id"> = JSON.parse(user);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      bio: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
    },
    mode: "all",
  });
  const onSubmit = async (values: UserSchema) => {
    try {
      await updateUser({ clerkId, path: pathname, updateData: values });
      router.back();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
        noValidate
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel htmlFor="name">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Your name..."
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel htmlFor="username">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl {...field}>
                <Input
                  id="username"
                  placeholder="Your username..."
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="portfolioWebsite"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel htmlFor="portfolio">Portfolio Link</FormLabel>
              <FormControl {...field}>
                <Input
                  type="url"
                  id="portfolio"
                  placeholder="Your portfolio link..."
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel htmlFor="location">Location</FormLabel>
              <FormControl {...field}>
                <Input
                  id="location"
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <FormControl {...field}>
                <Textarea
                  id="bio"
                  placeholder="What's special about you?"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit text-light-900"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
