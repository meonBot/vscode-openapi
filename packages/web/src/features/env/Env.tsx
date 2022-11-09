import { useState } from "react";

import styled from "styled-components";
import * as Tabs from "@radix-ui/react-tabs";

import { TabList, TabButton } from "../../components/Tabs";

import { useFeatureSelector } from "./slice";
import Environment from "./Environment";
import { EnvData } from "@xliic/common/messages/env";

export default function Env() {
  const data = useFeatureSelector((state) => state.env.data);

  const [activeTab, setActiveTab] = useState("secrets");
  const tabs = [
    /* TODO re-enable default environment when it's supported in scan configs
    {
      id: "default",
      title: "Default",
      secret: false,
    },
    */
    {
      id: "secrets",
      title: "Secrets",
      secret: true,
    },
  ];

  return (
    <>
      <Container>
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <TabList>
            {tabs.map((tab) => (
              <TabButton key={tab.id} value={tab.id}>
                {tab.title}
              </TabButton>
            ))}
          </TabList>
          {tabs.map((tab) => (
            <Tabs.Content key={tab.id} value={tab.id}>
              <Environment name={tab.id as keyof EnvData} data={data[tab.id as keyof EnvData]} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Container>
    </>
  );
}

const Container = styled.div``;
