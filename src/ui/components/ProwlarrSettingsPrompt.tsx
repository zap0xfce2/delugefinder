import { useState } from "react";
import { Box, Text, useInput } from "ink";
import { TextField } from "./TextField";
import { Panel } from "./Panel";
import type { ProwlarrConfig } from "../../config/config";
import { COLOR, ICON } from "../theme";

interface ProwlarrSettingsPromptProps {
  width: number;
  value: ProwlarrConfig | null;
  onSubmit: (config: ProwlarrConfig) => void;
  onCancel: () => void;
}

function sanitizeUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

export function ProwlarrSettingsPrompt({
  width,
  value,
  onSubmit,
  onCancel,
}: ProwlarrSettingsPromptProps) {
  const [url, setUrl] = useState(value?.url ?? "");
  const [apiKey, setApiKey] = useState(value?.apiKey ?? "");
  const [focus, setFocus] = useState<"url" | "apiKey">("url");

  useInput((_input, key) => {
    if (key.escape) onCancel();
    else if (key.tab) setFocus(focus === "url" ? "apiKey" : "url");
  });

  const submit = (): void => onSubmit({ url: sanitizeUrl(url), apiKey });

  return (
    <Box flexDirection="column" width={width}>
      <Panel title="prowlarr connection" width={width} focused height={4}>
        <Box>
          <Text color={COLOR.accent}>{`${ICON.pointer} `}</Text>
          <Box flexGrow={1} minWidth={0}>
            <TextField
              isDisabled={focus !== "url"}
              defaultValue={url}
              placeholder="http://localhost:9696"
              onChange={setUrl}
              onSubmit={() => setFocus("apiKey")}
              onExitDown={() => setFocus("apiKey")}
            />
          </Box>
        </Box>
        <Box>
          <Text color={COLOR.accent}>{`${ICON.pointer} `}</Text>
          <Box flexGrow={1} minWidth={0}>
            <TextField
              isDisabled={focus !== "apiKey"}
              defaultValue={apiKey}
              placeholder="API key"
              mask
              onChange={setApiKey}
              onSubmit={submit}
            />
          </Box>
        </Box>
      </Panel>
      <Box marginTop={1} flexDirection="column">
        <Box>
          <Text color={COLOR.alt}>tab</Text>
          <Text dimColor color={COLOR.text}> switch field</Text>
          <Text dimColor color={COLOR.text}>{`     ${ICON.dot}     `}</Text>
          <Text color={COLOR.alt}>↵</Text>
          <Text dimColor color={COLOR.text}> save</Text>
          <Text dimColor color={COLOR.text}>{`     ${ICON.dot}     `}</Text>
          <Text color={COLOR.alt}>esc</Text>
          <Text dimColor color={COLOR.text}> cancel</Text>
        </Box>
        <Text dimColor color={COLOR.text}>Prowlarr&apos;s address and API key. Stored locally in your config.</Text>
      </Box>
    </Box>
  );
}
