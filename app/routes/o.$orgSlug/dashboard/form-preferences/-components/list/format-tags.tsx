import { Badge } from "@/components/ui/badge";
import { useFormPreferenceContext } from "@/contexts/form-preference-context";

export default function FormPreferenceFormatTags() {
  const { formPreference } = useFormPreferenceContext();

  return (
    <>
      {formPreference.videoEnabled && <Badge variant="outline">video</Badge>}
      {formPreference.audioEnabled && <Badge variant="outline">audio</Badge>}
      {formPreference.textEnabled && <Badge variant="outline">text</Badge>}
    </>
  );
}
