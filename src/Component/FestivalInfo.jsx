import InfoItem from "./InfoItem";

export default function FestivalInfo ({ infoItems }) {
  return (
    <div className="flex flex-wrap gap-4">
      {infoItems.map((item, idx) => (
        <InfoItem key={idx} {...item} />
      ))}
    </div>
  );
};