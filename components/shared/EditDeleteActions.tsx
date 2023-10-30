"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteActions = ({ itemId, type }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };

  const handleDelete = () => {
    if (type === "question") {
      toast.promise(deleteQuestion({ questionId: itemId, path: pathname }), {
        loading: "Deleting question...",
        success: "Question deleted successfully.",
        error: (error) => error.message || "Some error occurred.",
      });
    } else if (type === "answer") {
      toast.promise(deleteAnswer({ answerId: itemId, path: pathname }), {
        loading: "Deleting answer...",
        success: "Answer deleted successfully.",
        error: (error) => error.message || "Some error occurred.",
      });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Link href={`/question/edit/${itemId}`}>
          <Image
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain transition-all active:scale-90"
            onClick={handleEdit}
          />
        </Link>
      )}
      <Image
        src={"/assets/icons/trash.svg"}
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain transition-all active:scale-90"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteActions;
