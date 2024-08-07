import Image from 'next/image';
import Link from 'next/link';

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  alt,
  imgUrl,
  textStyles,
  title,
  value,
  href,
  isAuthor,
}: Props) => {
  const MetricContent = () => {
    return (
      <>
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`object-contain ${isAuthor ? 'rounded-full' : ''}`}
        />
        <p className={`${textStyles} flex items-center gap-1 leading-none`}>
          <span className={`${isAuthor ? 'hover:underline' : ''}`}>
            {value}
          </span>
          <span
            className={`small-regular line-clamp-1 leading-none ${
              isAuthor ? 'max-sm:hidden' : ''
            }`}
          >
            {title}
          </span>
        </p>
      </>
    );
  };
  if (href)
    return (
      <Link href={href} className="flex-center gap-1">
        <MetricContent />
      </Link>
    );
  return (
    <div className="flex-center flex-wrap gap-1">
      <MetricContent />
    </div>
  );
};

export default Metric;
