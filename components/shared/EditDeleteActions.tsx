"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteActions = ({ itemId, type }: Props) => {
  const pathname = usePathname();
  const handleEdit = () => {};

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId, path: pathname });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId, path: pathname });
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
            className="cursor-pointer object-contain"
            onClick={() => handleEdit()}
          />
        </Link>
      )}
      <Image
        src={"/assets/icons/trash.svg"}
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={() => handleDelete()}
      />
    </div>
  );
};

export default EditDeleteActions;
