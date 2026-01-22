interface FestivalDescriptionProps {
  program: string;
}

export const FestivalDescription = ({ program }: FestivalDescriptionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        축제 소개
      </h3>
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: "var(--text-secondary)" }}
      >
        {program}
      </p>
    </div>
  );
};
