import { Share2, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface FestivalActionButtonsProps {
  homepageUrl?: string;
}

export const FestivalActionButtons = ({
  homepageUrl,
}: FestivalActionButtonsProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      {homepageUrl && (
        <motion.a
          href={homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium"
          style={{ backgroundColor: "var(--btn-primary)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ExternalLink className="w-4 h-4" />
          예약하기
        </motion.a>
      )}
      <motion.button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium border"
        style={{
          borderColor: "var(--card-border)",
          color: "var(--text-primary)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Share2 className="w-4 h-4" />
        공유하기
      </motion.button>
    </div>
  );
};
