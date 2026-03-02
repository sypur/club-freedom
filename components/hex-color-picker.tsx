import { Button } from "./ui/button";
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHueSlider,
  ColorPickerInput,
  type ColorPickerProps,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "./ui/color-picker";

export default function HexColorPicker({ value, ...props }: ColorPickerProps) {
  return (
    <div>
      <ColorPicker defaultFormat="hex" format="hex" value={value} {...props}>
        <ColorPickerTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 font-mono"
          >
            <ColorPickerSwatch className="size-4" />
            {value}
          </Button>
        </ColorPickerTrigger>
        <ColorPickerContent>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex flex-1 flex-col gap-2">
              <ColorPickerHueSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerInput withoutAlpha />
          </div>
        </ColorPickerContent>
      </ColorPicker>
    </div>
  );
}
