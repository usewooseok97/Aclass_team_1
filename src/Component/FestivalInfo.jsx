import InfoItem from "./InfoItem";

export default function FestivalInfo ({ infoItems }) {
  return (
    <div className="flex flex-col gap-2">
      {infoItems.map((item, idx) => (
        <InfoItem key={idx} {...item} />
      ))}
    </div>
  );
};