import * as React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Sliders } from "@/lib/icons";
import { Link } from "expo-router";

type props = {
  entryId: string;
};

export function Menu(props: props) {
  const { entryId } = props;
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Sliders className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={contentInsets} className="w-64 native:w-72">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Edit Card</Text>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Text>Invite users</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <Animated.View entering={FadeIn.duration(200)}>
                <DropdownMenuItem>
                  <Text>Email</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Message</Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>More...</Text>
                </DropdownMenuItem>
              </Animated.View>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Text>New Team</Text>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <Link
          asChild
          href={{
            pathname: "/entries",
            params: {
              id: entryId,
            },
          }}
        >
          <DropdownMenuItem closeOnPress={true}>
            <Text>View Details</Text>
          </DropdownMenuItem>
        </Link>
        <Link
          asChild
          href={{
            pathname: "/edit",
            params: {
              id: entryId,
            },
          }}
        >
          <DropdownMenuItem>
            <Text>Edit</Text>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
