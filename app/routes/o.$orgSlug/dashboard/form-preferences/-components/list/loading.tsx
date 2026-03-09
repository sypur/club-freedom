import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingFormPreferenceList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading Preferences...</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
