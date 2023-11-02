"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { AnswerSchema, answerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const AnswerForm = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const form = useForm<AnswerSchema>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
    mode: "onChange",
  });

  const handleCreateAnswer = (values: AnswerSchema) => {
    return new Promise<void>((resolve) => {
      toast.promise(
        createAnswer({
          content: values.answer,
          author: authorId,
          question: questionId,
          path: pathname,
        }),
        {
          loading: "Submitting answer...",
          success: () => {
            form.reset();
            return "Answer submitted successfully.";
          },
          error: (error) => error.message || "Some error occurred.",
          finally: () => {
            resolve();
          },
        },
      );
    });
  };

  const generateAIAnswer = useCallback(() => {
    if (!authorId) return setIsSubmittingAI(false);

    setIsSubmittingAI(true);

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        method: "POST",
        body: JSON.stringify({ question }),
      }),
      {
        loading: "Generating AI answer...",
        success: async (res) => {
          if (res.ok) {
            const data = await res.json();
            const replyString: string = data?.reply;

            const language = replyString
              ?.match(/```[A-Za-z]+/gi)?.[0]
              ?.replace("```", "");

            const reply = replyString
              ?.replace(/\n/g, "<br />")
              ?.replace(/```[A-Za-z]+/g, `<pre class="language-${language}">`)
              ?.replace(/```/g, "</pre>");

            form.setValue("answer", reply);
            return "Answer generated.";
          } else {
            throw res;
          }
        },
        error: (error) => error.message || "Some error occurred.",
        finally: () => {
          setIsSubmittingAI(false);
        },
        important: false,
      },
    );
  }, [authorId, form, question]);

  return (
    <div>
      <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src={"/assets/icons/stars.svg"}
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={field.onChange}
                    value={field.value}
                    initialValue=""
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
                        "undo redo | codesample | bold italic forecolor | alignleft aligncenter | alignright alignjustify | bullist numlist",
                      // content_style:
                      //   "body { font-family:  ; font-size: 16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode,
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={form.formState.isSubmitting || isSubmittingAI}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
