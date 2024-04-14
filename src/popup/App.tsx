import { useState, useEffect } from "react";
import { Box, Button, Divider, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { WindowSize } from "../types";
import { defaultWindowSizeList } from "./defaultWindowSizeList";

function App() {
  const [windowSizeList, setWindowSizeList] = useState<WindowSize[]>([]);

  const form = useForm({
    initialValues: {
      width: "",
      height: "",
    },
    transformValues: (values) => {
      return {
        width: Math.floor(+values.width),
        height: Math.floor(+values.height),
      };
    },
  });

  useEffect(() => {
    chrome.storage.local.get(["WINDOW_SIZE"], (value) => {
      if (!value?.WINDOW_SIZE) {
        return;
      }

      setWindowSizeList(value.WINDOW_SIZE);
    });
  }, []);

  const resizeWindow = (updateInfo: chrome.windows.UpdateInfo) => {
    chrome.windows.getCurrent((window) => {
      if (!window.id) {
        return;
      }

      chrome.windows.update(window.id, updateInfo);
    });

    window.close();
  };

  return (
    <Box py="xs" px={5} w={220}>
      {windowSizeList.map((windowSize, index) => (
        <Button
          key={index}
          variant="subtle"
          px="xs"
          fullWidth
          color="gray"
          c="dark"
          fw="normal"
          onClick={() => resizeWindow(windowSize)}
          styles={{
            inner: { display: "block" },
          }}
        >
          {windowSize.width}
          {" × "}
          {windowSize.height}
        </Button>
      ))}
      {windowSizeList.length > 0 && <Divider my={5} />}
      {defaultWindowSizeList.map((windowSize, index) => (
        <Button
          key={index}
          variant="subtle"
          px="xs"
          fullWidth
          color="gray"
          c="dark"
          fw="normal"
          onClick={() => resizeWindow(windowSize)}
          styles={{
            inner: { display: "block" },
          }}
        >
          {windowSize.width}
          {" × "}
          {windowSize.height}
        </Button>
      ))}
      <Divider my={5} />
      <form onSubmit={form.onSubmit(resizeWindow)}>
        <Flex gap="xs" align="center">
          <TextInput {...form.getInputProps("width")} placeholder="横幅" />
          <TextInput {...form.getInputProps("height")} placeholder="縦幅" />
          <Button
            type="submit"
            variant="light"
            color="gray"
            c="dark"
            fw="normal"
            styles={{
              root: {
                flexShrink: 0,
              },
            }}
          >
            変更
          </Button>
        </Flex>
      </form>
      <Divider my={5} />
      <Button
        variant="light"
        px="xs"
        fullWidth
        color="gray"
        c="dark"
        fw="normal"
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        設定ページ
      </Button>
    </Box>
  );
}

export default App;
