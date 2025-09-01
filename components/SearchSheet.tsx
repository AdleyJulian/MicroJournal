import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheet,
  BottomSheetOpenTrigger,
} from "@/components/ui/bottom-sheet";
import { Label } from "@/components/ui";
import { MultiSelect } from "@/components/ui/multiSelect";
import * as queries from "@/db/queries";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export type SearchFormValues = {
  keyword?: string;
  tagIds?: string[]; // use string for MultiSelect
  // hasMedia?: boolean; // reserved for future
  // sort?: "newest" | "oldest"; // reserved for future
};

type Props = {
  defaultValues?: Partial<SearchFormValues>;
  onApply: (values: SearchFormValues) => void;
  trigger?: React.ReactNode;
};

export function SearchSheet({ defaultValues, onApply, trigger }: Props) {
  const { ref, close } = useBottomSheet();
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: queries.getAllTags,
  });

  const tagOptions = useMemo(() => {
    return (tags ?? []).map((t: any) => ({ value: String(t.id), label: t.name }));
  }, [tags]);

  const { control } = useForm<SearchFormValues>({
    defaultValues: {
      keyword: defaultValues?.keyword ?? "",
      tagIds: defaultValues?.tagIds ?? [],
    },
  });

  const watchedValues = useWatch({ control });
  const isFirstRunRef = useRef(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Skip initial mount to avoid firing with defaults
      if (isFirstRunRef.current) {
        isFirstRunRef.current = false;
        return;
      }
      onApply({
        keyword: watchedValues?.keyword?.trim() ?? "",
        tagIds: watchedValues?.tagIds ?? [],
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [watchedValues?.keyword, JSON.stringify(watchedValues?.tagIds)]);

  return (
    <BottomSheet>
      {trigger ? (
        <BottomSheetOpenTrigger asChild>{trigger}</BottomSheetOpenTrigger>
      ) : null}
      <BottomSheetContent ref={ref}>
        <BottomSheetHeader className="h-[60px] items-center flex-row">
          <View className="flex-1" />
          <View className="flex-1 items-center">
            <Label>Search & filter</Label>
          </View>
          <View className="flex-1" />
        </BottomSheetHeader>
        <BottomSheetView className="gap-4">
          <Controller
            control={control}
            name="keyword"
            render={({ field: { value, onChange } }) => (
              <BottomSheetTextInput
                placeholder="Keyword"
                placeholderTextColor="#9CA3AF" 
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="tagIds"
            render={({ field: { value, onChange } }) => (
              <MultiSelect
                data={tagOptions}
                value={value}
                onChange={onChange}
                placeholder="Tags"
                clearable
              />
            )}
          />
        </BottomSheetView>
      </BottomSheetContent>
    </BottomSheet>
  );
}


