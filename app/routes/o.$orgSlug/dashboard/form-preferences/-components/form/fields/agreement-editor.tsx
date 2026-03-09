import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  LINK,
} from "@lexical/markdown";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { type EditorState, ParagraphNode, TextNode } from "lexical";
import { Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { LinkPlugin } from "@/components/editor/plugins/link-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
  onDelete?: () => void;
  hasError?: boolean;
};

export default function AgreementEditor({
  markdown,
  onMarkdownChange,
  onDelete,
  hasError = false,
}: Props) {
  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdownString = $convertToMarkdownString([LINK]);
        onMarkdownChange(markdownString);
      });
    },
    [onMarkdownChange],
  );

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-lg border",
        hasError && "border-destructive",
      )}
    >
      <LexicalComposer
        initialConfig={{
          namespace: "MarkdownEditorWithLinks",
          theme: editorTheme,
          nodes: [ParagraphNode, TextNode, AutoLinkNode, LinkNode],
          onError: console.log,
          editorState: () => $convertFromMarkdownString(markdown, [LINK]),
        }}
      >
        <TooltipProvider>
          <div className="relative">
            <ToolbarPlugin>
              {() => (
                <div className="sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
                  <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                  <HistoryToolbarPlugin />
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="size-8 ml-auto"
                      onClick={onDelete}
                    >
                      <Trash />
                    </Button>
                  )}
                </div>
              )}
            </ToolbarPlugin>
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <div ref={onRef}>
                    <ContentEditable
                      placeholder="Start typing..."
                      className="ContentEditable__root relative block h-36 min-h-36 overflow-auto px-8 py-4 focus:outline-none"
                    />
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <ClickableLinkPlugin />
              <AutoLinkPlugin />
              <LinkPlugin />
              <HistoryPlugin />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <MarkdownShortcutPlugin transformers={[LINK]} />
            </div>
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={handleEditorChange}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
