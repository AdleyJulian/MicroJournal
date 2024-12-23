import * as React from "react";
import { View } from "react-native";

import { ChevronsUpDown, ChevronsDownUp } from "~/lib/icons";
import { Button, Text } from "~/components/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ReactNode } from "react";

type CollapsibleSimpleProps = {
  description: string;
  children: ReactNode;
};

const CollapsibleSimple = (props: CollapsibleSimpleProps) => {
  const { description, children } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <View>
      <Collapsible asChild open={open} onOpenChange={setOpen}>
        <View>
          <View>
            <Text className="text-foreground text-sm native:text-lg font-semibold">
              RSS Feed Info is here
            </Text>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <ChevronsDownUp size={16} className="text-foreground" />
                ) : (
                  <ChevronsUpDown size={16} className="text-foreground" />
                )}
                <Text className="sr-only">Toggle</Text>
              </Button>
            </CollapsibleTrigger>
          </View>
          <CollapsibleContent className="gap-2">
            <View>{children}</View>
          </CollapsibleContent>
        </View>
      </Collapsible>
    </View>
  );
};
CollapsibleSimple.displayName = "CollapsibleSimple";
export { CollapsibleSimple };
