"use client";

import { KeyboardEvent, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { questionsSchema, QuestionsSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { IQuestion } from "@/database/question.model";
import { ITag } from "@/database/tag.model";
import { IUser } from "@/database/user.model";

type QuestionDetails = Omit<IQuestion, "tags" | "author"> & {
  tags: ITag[];
  author: IUser;
};

interface Props {
  mongoUserId: string;
  questionDetails?: string;
  type?: "edit" | "create";
}

const QuestionForm = ({ mongoUserId, questionDetails, type }: Props) => {
  const { mode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const editorRef = useRef(null);

  const parsedQuestionDetails: QuestionDetails = questionDetails
    ? JSON.parse(questionDetails)
    : {};

  const tagsValue: string[] = parsedQuestionDetails.tags?.map(
    (tag) => tag.name,
  );

  const form = useForm<QuestionsSchema>({
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      explaination: parsedQuestionDetails.content || "",
      tags: tagsValue || [],
    },
    mode: "all",
    resolver: zodResolver(questionsSchema),
  });

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<QuestionsSchema, "tags">,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag length should not be greater than 15 characters.",
          });
        }
        if (!field.value.includes(tagValue)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (
    tag: string,
    field: ControllerRenderProps<QuestionsSchema, "tags">,
  ) => {
    const newTags = field.value.filter((t: string) => tag !== t);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (values: QuestionsSchema) => {
    try {
      if (type === "edit") {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explaination,
          path: pathname,
        });
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explaination,
          path: pathname,
          tags: values.tags,
          author: mongoUserId,
        });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5" {...field}>
                <Input
                  placeholder="Question Title"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you &apos re asking a question to anothe
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explaination"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explaination of your problem
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  value={field.value}
                  onEditorChange={field.onChange}
                  initialValue={parsedQuestionDetails.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "preview",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter | " +
                      "alignright alignjustify | bullist numlist",
                    // content_style:
                    //   "body { font-family: Inter; font-size: 16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode,
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === "edit"}
                    placeholder="Add Tags..."
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type === "edit" && handleTagRemove(tag, field)
                          }
                        >
                          {tag}
                          {type === "edit" && (
                            <Image
                              src={"/assets/icons/close.svg"}
                              alt="close"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe what your question is about. You
                need to press enter after each tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting"}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
