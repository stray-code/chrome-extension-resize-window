import {
  Box,
  Button,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import type { WindowSize } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";

function App() {
  const [windowSizeList, setWindowSizeList] = useState<WindowSize[]>([]);

  const form = useForm({
    initialValues: {
      width: "",
      height: "",
    },
    transformValues: (values) => {
      return {
        width: +values.width,
        height: +values.height,
      };
    },
    validateInputOnBlur: true,
    validate: zodResolver(
      z.object({
        width: z.coerce
          .number({ message: "整数を入力してください" })
          .int()
          .positive({ message: "1以上の整数を入力してください" }),
        height: z.coerce
          .number({ message: "整数を入力してください" })
          .int()
          .positive({ message: "1以上の整数を入力してください" }),
      }),
    ),
  });

  useEffect(() => {
    (async () => {
      const windowSizeList = await getLocalStorage("windowSizeList");

      if (!windowSizeList) {
        return;
      }

      setWindowSizeList(windowSizeList);
    })();
  }, []);

  return (
    <Container py="xl" size="xs">
      <Stack gap="xl">
        <Title order={3}>ウィンドウサイズ設定</Title>
        <Paper p="md" shadow="md" withBorder>
          <form
            onSubmit={form.onSubmit(async (values) => {
              const newWindowSizeList = [...windowSizeList, values];

              setWindowSizeList(newWindowSizeList);

              await setLocalStorage("windowSizeList", newWindowSizeList);

              form.reset();
            })}
          >
            <Stack>
              <Text size="sm" c="gray">
                モニタを超えるサイズは動作しないためご注意ください。
              </Text>
              <SimpleGrid cols={2}>
                <TextInput
                  {...form.getInputProps("width")}
                  label="横幅"
                  placeholder="1200"
                />
                <TextInput
                  {...form.getInputProps("height")}
                  label="縦幅"
                  placeholder="800"
                />
              </SimpleGrid>
              <Box>
                <Button type="submit">登録</Button>
              </Box>
            </Stack>
          </form>
        </Paper>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>横幅</Table.Th>
              <Table.Th>縦幅</Table.Th>
              <Table.Th w={0} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {windowSizeList.map((windowSize, index) => (
              <Table.Tr key={index}>
                <Table.Td>{windowSize.width}</Table.Td>
                <Table.Td>{windowSize.height}</Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={async () => {
                      const result = confirm("削除してもよろしいですか？");

                      if (!result) {
                        return;
                      }

                      const newWindowSizeList = windowSizeList.filter(
                        (_, i) => i !== index,
                      );

                      setWindowSizeList(newWindowSizeList);

                      await setLocalStorage(
                        "windowSizeList",
                        newWindowSizeList,
                      );
                    }}
                  >
                    削除
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}

export default App;
