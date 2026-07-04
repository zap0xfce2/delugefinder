import { Box, Text, useInput, useStdin } from "ink";
import { Logo } from "../components/Logo";
import { SearchBar } from "../components/SearchBar";
import { LOGO_WIDTH } from "../logo";
import { useStore } from "../store";
import { GROUP_ORDER } from "../../sources/registry";
import { COLOR, ICON } from "../theme";

const CATEGORIES = GROUP_ORDER.map((g) => g.toLowerCase()).join(`  ${ICON.dot}  `);

export function Splash() {
  const { submitQuery, quitAll, cols, rows } = useStore();
  const { isRawModeSupported } = useStdin();

  useInput(
    (input, key) => {
      if (key.escape || (key.ctrl && input === "c")) quitAll();
    },
    { isActive: isRawModeSupported },
  );

  const showLogo = cols >= LOGO_WIDTH + 2;
  const barWidth = Math.max(24, Math.min(cols - 6, 62));

  return (
    <Box
      height={rows}
      backgroundColor={COLOR.bg}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {showLogo ? (
        <Logo />
      ) : (
        <Text bold color={COLOR.accent}>
          delugefinder
        </Text>
      )}
      <Box marginTop={2}>
        <Text color={COLOR.text}>Find torrents. Send to Deluge.</Text>
      </Box>
      <Box>
        <Text dimColor color={COLOR.text}>{CATEGORIES}</Text>
      </Box>

      <Box marginTop={1} width={barWidth}>
        <SearchBar
          width={barWidth}
          value=""
          editing
          placeholder="Search or paste a magnet link…"
          onSubmit={submitQuery}
        />
      </Box>
      <Box marginTop={1}>
        <Text>
          <Text color={COLOR.alt}>↵</Text>
          <Text dimColor color={COLOR.text}> search</Text>
          <Text dimColor color={COLOR.text}>{`  ${ICON.dot}  `}</Text>
          <Text dimColor color={COLOR.text}>empty </Text>
          <Text color={COLOR.alt}>↵</Text>
          <Text dimColor color={COLOR.text}> browse</Text>
          <Text dimColor color={COLOR.text}>{`  ${ICON.dot}  `}</Text>
          <Text color={COLOR.alt}>^c</Text>
          <Text dimColor color={COLOR.text}> quit</Text>
        </Text>
      </Box>
    </Box>
  );
}
