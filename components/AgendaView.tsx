import React, { useMemo, useState } from "react";
import { View } from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";

import { AgendaItem, AgendaListHeader } from "@/components/AgendaItem";
import { type AgendaItem as AgendaItemType } from "db/queries";
import { getTheme } from "./ui/calendar";
import { useColorScheme } from "@/lib/useColorScheme";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import * as queries from "@/db/queries";
import { type JournalEntry } from "@/db/schema/schema";

type ComponentProps = {
  agendaItems: AgendaItemType[];
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<queries.AgendaItem[], Error>>;
};

export const CalendarWithAgenda = (props: ComponentProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const { agendaItems, refetch } = props;

  const initialDate = useMemo(() => {
    if (agendaItems && agendaItems.length > 0) {
      return agendaItems[agendaItems.length - 1].title;
    }
    return new Date().toISOString().split("T")[0]; // Default to today
  }, [agendaItems]); // Recalculate only if agendaItems changes

  type MarkedDates = {
    [date: string]: {
      customStyles: {
        container: {
          borderWidth: number;
          borderColor: string;
          borderRadius: number;
        };
        text: {
          color: string;
        };
      };
    };
  };

  const markedDates = agendaItems.reduce<MarkedDates>(
    (acc, item: AgendaItemType) => {
      // const hasNewState = item.data.some((entry) => entry.state === "New");
      const hasRelearningState = item.data.some(
        (entry) => entry.state === "Relearning"
      );

      const customStyle = {
        container: {
          backgroundColor: "#b81129",
          borderRadius: 4,
          borderWidth: 2,
          borderColor: "b81129",
        },
        text: {
          color: "#ffffff",
        },
      };

      if (hasRelearningState) {
        acc[item.title] = {
          customStyles: { ...customStyle },
        };
      }
      return acc;
    },
    {}
  );

  const renderItem = ({ item }: { item: JournalEntry }) => {
    return <AgendaItem item={item} />;
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  return (
    <CalendarProvider
      date={initialDate}
      
      todayButtonStyle={getTheme(isDarkColorScheme)}
    >
      <ExpandableCalendar
        testID="expandableCalendar"
        key={isDarkColorScheme ? "dark" : "light"}
        keyExtractor={(item, index) =>
          `${JSON.stringify(item).substring(0, 10)}+${index}`
        }
        markingType={"custom"}
        // markedDates={markedDates}
        theme={getTheme(isDarkColorScheme)}
        firstDay={1}
      />
      <View>
        <AgendaList
          infiniteListProps={{}}
          // keyExtractor={(item, index) => `${item?.id.toString()}+${index}`}
          sections={agendaItems}
          renderItem={renderItem}
          renderSectionHeader={(day) => <AgendaListHeader day={day} />}
          contentContainerStyle={{
            paddingBottom: 600,
          }}
        />
      </View>
    </CalendarProvider>
  );
};
