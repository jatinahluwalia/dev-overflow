'use client';

import { IUser } from '@/database/user.model';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { UserSchema, userSchema } from '@/lib/validations';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { updateUser } from '@/lib/actions/user.action';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  clerkId: string;
  user: string;
}
const ProfileForm = ({ clerkId, user }: Props) => {
  const parsedUser: Omit<IUser, 'id'> = JSON.parse(user);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: parsedUser.name || '',
      username: parsedUser.username || '',
      bio: parsedUser.bio || '',
      portfolioWebsite: parsedUser.portfolioWebsite || '',
      location: parsedUser.location || '',
    },
    mode: 'all',
  });
  const onSubmit = (values: UserSchema) => {
    return new Promise<void>((resolve) => {
      toast.promise(
        updateUser({ clerkId, path: pathname, updateData: values }),
        {
          success: () => {
            router.back();
            return 'Profile edited successfully.';
          },
          loading: 'Editing profile...',
          error: (error) => {
            return error.message || 'Some error occurred.';
          },
          finally: () => {
            resolve();
          },
        },
      );
    });
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
              <FormLabel
                htmlFor="name"
                className="paragraph-semibold text-dark400_light800"
              >
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Your name..."
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
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
              <FormLabel
                htmlFor="username"
                className="paragraph-semibold text-dark400_light800"
              >
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl {...field}>
                <Input
                  id="username"
                  placeholder="Your username..."
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
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
              <FormLabel
                htmlFor="portfolio"
                className="paragraph-semibold text-dark400_light800"
              >
                Portfolio Link
              </FormLabel>
              <FormControl {...field}>
                <Input
                  type="url"
                  id="portfolio"
                  placeholder="Your portfolio link..."
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
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
              <FormLabel
                htmlFor="location"
                className="paragraph-semibold text-dark400_light800"
              >
                Location
              </FormLabel>
              <FormControl {...field}>
                <Input
                  id="location"
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
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
              <FormLabel
                htmlFor="bio"
                className="paragraph-semibold text-dark400_light800"
              >
                Bio
              </FormLabel>
              <FormControl {...field}>
                <Textarea
                  id="bio"
                  placeholder="What's special about you?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit text-light-900 transition-all active:scale-90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
