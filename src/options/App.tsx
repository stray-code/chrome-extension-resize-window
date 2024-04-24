import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  TextInput,
  Container,
  Title,
  Paper,
  Table,
  Text,
} from "@mantine/core";

import { WindowSize } from "../types";
import { useForm } from "@mantine/form";
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
        width: Math.floor(+values.width),
        height: Math.floor(+values.height),
      };
    },
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
      <Title order={3}>ウィンドウサイズ設定</Title>
      <Paper mt="xl" p="md" shadow="sm" withBorder>
        <Text mb="md" size="sm" c="gray">
          モニタを超えるサイズは動作しないためご注意ください。
        </Text>
        <form
          onSubmit={form.onSubmit(async (values) => {
            if (!(values.width > 0 && values.height > 0)) {
              alert("１以上の整数を入力してください。");
              return;
            }

            const newWindowSizeList = [...windowSizeList, values];

            setWindowSizeList(newWindowSizeList);

            await setLocalStorage("windowSizeList", newWindowSizeList);

            form.reset();
          })}
        >
          <Flex gap="xs" align="flex-end">
            <TextInput
              {...form.getInputProps("width")}
              label="横幅"
              placeholder="1200"
              styles={{
                root: {
                  flexGrow: 1,
                },
              }}
            />
            <TextInput
              {...form.getInputProps("height")}
              label="縦幅"
              placeholder="800"
              styles={{
                root: {
                  flexGrow: 1,
                },
              }}
            />
            <Button type="submit">登録</Button>
          </Flex>
        </form>
      </Paper>
      <Table mt="xl">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>横幅</Table.Th>
            <Table.Th>縦幅</Table.Th>
            <Table.Th w={0}></Table.Th>
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

                    await setLocalStorage("windowSizeList", newWindowSizeList);
                  }}
                >
                  削除
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}

export default App;
