import { CircleAlert, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { contrastScore } from "@/lib/color";

type Props = {
  backgroundColor?: string;
  foregroundColor?: string;
};

export default function ContrastChecker({
  backgroundColor,
  foregroundColor,
}: Props) {
  if (!backgroundColor || !foregroundColor) return null;

  const score = contrastScore(backgroundColor, foregroundColor);
  if (!score) return null;

  const isGood = score > 4.5;

  return (
    <Tooltip>
      <TooltipTrigger type="button">
        <Badge variant="outline">
          {isGood ? (
            <CircleCheck data-icon="inline-start" />
          ) : (
            <CircleAlert data-icon="inline-start" />
          )}
          {isGood ? "Good" : "Poor"}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>Contrast score: {score.toFixed(2)}</TooltipContent>
    </Tooltip>
  );
}
