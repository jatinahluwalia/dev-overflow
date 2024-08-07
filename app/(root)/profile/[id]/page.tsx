import AnswersTab from '@/components/shared/AnswersTab';
import ProfileLink from '@/components/shared/ProfileLink';
import QuestionsTab from '@/components/shared/QuestionsTab';
import Stats from '@/components/shared/Stats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserInfo } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

const Page = async ({ params: { id }, searchParams }: URLProps) => {
  const { userId } = auth();
  const result = await getUserInfo({ userId: id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={result.user.picture}
            alt="Profile"
            height={140}
            width={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {result.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{result.user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {result.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  href={result.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {result.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={result.user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={
                  'Joined ' +
                  result.user.createdAt.toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })
                }
              />
            </div>

            {result.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {result.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {userId === result.user.clerkId && (
              <Link href={`/profile/edit`}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3 transition-all active:scale-90">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={result.totalQuestions}
        totalAnswers={result.totalAnswers}
        badges={result.badgeCounts}
        reputation={result.reputation}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="flex w-full flex-col gap-6 data-[state=inactive]:hidden"
          >
            <QuestionsTab
              userId={result.user.id}
              clerkId={id}
              searchParams={searchParams}
            />
          </TabsContent>
          <TabsContent
            value="answers"
            className="flex w-full flex-col gap-6 data-[state=inactive]:hidden"
          >
            <AnswersTab
              userId={result.user.id}
              clerkId={id}
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
