import Link from 'next/link';
import { Badge } from '../ui/badge';

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, showCount, totalQuestions }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="background-light800_dark300 text-light400_light500 subtle-medium rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="text-dark500_light700 small-medium">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
