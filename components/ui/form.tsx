// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui

import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  Noop,
  useFormContext,
  ControllerRenderProps,
  Path,
} from "react-hook-form";
import { TouchableOpacity, View, Image } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetOpenTrigger,
  BottomSheetView,
} from "../../components/ui/bottom-sheet";
import { Calendar } from "../../components/ui/calendar";
import { Combobox, ComboboxOption } from "~/components/ui/combobox";
import { Button, buttonTextVariants } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ImagePlus } from "lucide-react-native";
//todo: Fix import

// import { RadioGroup } from '../../components/ui/radio-group';
import { Select, type Option } from "../../components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Calendar as CalendarIcon, X, Trash2 } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Text } from "./text";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { nativeID } = itemContext;

  return {
    nativeID,
    name: fieldContext.name,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};

type FormItemContextValue = {
  nativeID: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
  const nativeID = React.useId();

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  Omit<React.ComponentPropsWithoutRef<typeof Label>, "children"> & {
    children: string;
  }
>(({ className, nativeID: _nativeID, ...props }, ref) => {
  const { error, formItemNativeID } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        "pb-1 native:pb-2 px-px",
        error && "text-destructive",
        className
      )}
      nativeID={formItemNativeID}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
  const { formDescriptionNativeID } = useFormField();

  return (
    <Text
      ref={ref}
      nativeID={formDescriptionNativeID}
      className={cn("text-sm text-muted-foreground pt-1", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  React.ElementRef<typeof Animated.Text>,
  React.ComponentPropsWithoutRef<typeof Animated.Text>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageNativeID } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <Animated.Text
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      ref={ref}
      nativeID={formMessageNativeID}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </Animated.Text>
  );
});
FormMessage.displayName = "FormMessage";

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
  name: string;
  onBlur: Noop;
  onChange: (val: T) => void;
  value: T;
  disabled?: boolean;
}

type FormItemProps<T extends React.ElementType<any>, U> = Override<
  React.ComponentPropsWithoutRef<T>,
  FormFieldFieldProps<U>
> & {
  label?: string;
  description?: string;
};

const FormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  FormItemProps<typeof Input, string>
>(({ label, description, onChange, ...props }, ref) => {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, () => {
    if (!inputRef.current) {
      return {} as React.ComponentRef<typeof Input>;
    }
    return inputRef.current;
  }, [inputRef.current]);

  function handleOnLabelPress() {
    if (!inputRef.current) {
      return;
    }
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
          {label}
        </FormLabel>
      )}

      <Input
        ref={inputRef}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormInput.displayName = "FormInput";

const FormTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  FormItemProps<typeof Textarea, string>
>(({ label, description, onChange, ...props }, ref) => {
  const textareaRef = React.useRef<React.ComponentRef<typeof Textarea>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, () => {
    if (!textareaRef.current) {
      return {} as React.ComponentRef<typeof Textarea>;
    }
    return textareaRef.current;
  }, [textareaRef.current]);

  function handleOnLabelPress() {
    if (!textareaRef.current) {
      return;
    }
    if (textareaRef.current.isFocused()) {
      textareaRef.current?.blur();
    } else {
      textareaRef.current?.focus();
    }
  }

  return (
    <FormItem>
      {!!label && (
        <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
          {label}
        </FormLabel>
      )}

      <Textarea
        ref={textareaRef}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormTextarea.displayName = "FormTextarea";

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  Omit<FormItemProps<typeof Checkbox, boolean>, "checked" | "onCheckedChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  function handleOnLabelPress() {
    onChange?.(!value);
  }

  return (
    <FormItem className="px-1">
      <View className="flex-row gap-3 items-center">
        <Checkbox
          ref={ref}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel
            className="pb-0"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormCheckbox.displayName = "FormCheckbox";

const FormDatePicker = React.forwardRef<
  React.ElementRef<typeof Button>,
  FormItemProps<typeof Calendar, string>
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <BottomSheet>
        <BottomSheetOpenTrigger asChild>
          <Button
            variant="outline"
            className="flex-row gap-3 justify-start px-3 relative"
            ref={ref}
            aria-labelledby={formItemNativeID}
            aria-describedby={
              !error
                ? `${formDescriptionNativeID}`
                : `${formDescriptionNativeID} ${formMessageNativeID}`
            }
            aria-invalid={!!error}
          >
            {({ pressed }) => (
              <>
                <CalendarIcon
                  className={buttonTextVariants({
                    variant: "outline",
                    className: cn(
                      !value && "opacity-80",
                      pressed && "opacity-60"
                    ),
                  })}
                  size={18}
                />
                <Text
                  className={buttonTextVariants({
                    variant: "outline",
                    className: cn(
                      "font-normal",
                      !value && "opacity-70",
                      pressed && "opacity-50"
                    ),
                  })}
                >
                  {value ? value : "Pick a date"}
                </Text>
                {!!value && (
                  <Button
                    className="absolute right-0 active:opacity-70 native:pr-3"
                    variant="ghost"
                    onPress={() => {
                      onChange?.("");
                    }}
                  >
                    <X size={18} className="text-muted-foreground text-xs" />
                  </Button>
                )}
              </>
            )}
          </Button>
        </BottomSheetOpenTrigger>
        <BottomSheetContent>
          <BottomSheetView hadHeader={false} className="pt-2">
            <Calendar
              style={{ height: 358 }}
              onDayPress={(day) => {
                onChange?.(day.dateString === value ? "" : day.dateString);
              }}
              markedDates={{
                [value ?? ""]: {
                  selected: true,
                },
              }}
              current={value} // opens calendar on selected date
              {...props}
            />
            <View className={"pb-2 pt-4"}>
              <BottomSheetCloseTrigger asChild>
                <Button>
                  <Text>Close</Text>
                </Button>
              </BottomSheetCloseTrigger>
            </View>
          </BottomSheetView>
        </BottomSheetContent>
      </BottomSheet>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormDatePicker.displayName = "FormDatePicker";

// const FormRadioGroup = React.forwardRef<
//   React.ElementRef<typeof RadioGroup>,
//   Omit<FormItemProps<typeof RadioGroup, string>, 'onValueChange'>
// >(({ label, description, value, onChange, ...props }, ref) => {
//   const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

//   return (
//     <FormItem className='gap-3'>
//       <View>
//         {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
//         {!!description && <FormDescription className='pt-0'>{description}</FormDescription>}
//       </View>
//       <RadioGroup
//         ref={ref}
//         aria-labelledby={formItemNativeID}
//         aria-describedby={
//           !error
//             ? `${formDescriptionNativeID}`
//             : `${formDescriptionNativeID} ${formMessageNativeID}`
//         }
//         aria-invalid={!!error}
//         onValueChange={onChange}
//         value={value}
//         {...props}
//       />

//       <FormMessage />
//     </FormItem>
//   );
// });

// FormRadioGroup.displayName = 'FormRadioGroup';

const FormCombobox = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  FormItemProps<typeof Combobox, ComboboxOption | null>
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Combobox
        ref={ref}
        placeholder="Select framework"
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        selectedItem={value}
        onSelectedItemChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormCombobox.displayName = "FormCombobox";

/**
 * @prop {children} 
 * @example
 *  <SelectTrigger className='w-[250px]'>
      <SelectValue
        className='text-foreground text-sm native:text-lg'
        placeholder='Select a fruit'
      />
    </SelectTrigger>
    <SelectContent insets={contentInsets} className='w-[250px]'>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem label='Apple' value='apple'>
          Apple
        </SelectItem>
      </SelectGroup>
    </SelectContent>
 */
const FormSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  Omit<
    FormItemProps<typeof Select, Partial<Option>>,
    "open" | "onOpenChange" | "onValueChange"
  >
>(({ label, description, onChange, value, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select
        ref={ref}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        value={
          value
            ? { label: value?.label ?? "", value: value?.label ?? "" }
            : undefined
        }
        onValueChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormSelect.displayName = "FormSelect";

const FormSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  Omit<FormItemProps<typeof Switch, boolean>, "checked" | "onCheckedChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const switchRef = React.useRef<React.ComponentRef<typeof Switch>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useImperativeHandle(ref, () => {
    if (!switchRef.current) {
      return {} as React.ComponentRef<typeof Switch>;
    }
    return switchRef.current;
  }, [switchRef.current]);

  function handleOnLabelPress() {
    onChange?.(!value);
  }

  return (
    <FormItem className="px-1">
      <View className="flex-row gap-3 items-center">
        <Switch
          ref={switchRef}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
        />
        {!!label && (
          <FormLabel
            className="pb-0"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormSwitch.displayName = "FormSwitch";

// Form Image Selector

interface FormImageSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<ControllerRenderProps<TFieldValues, TName>, "ref"> {
  label?: string;
  description?: string;
  disabled?: boolean;
}

const FormImageSelector = React.forwardRef<
  typeof TouchableOpacity,
  FormImageSelectorProps
>(
  (
    {
      label,
      description,
      value = "",
      onChange,
      disabled,
      name,
      onBlur,
      ...props
    },
    ref
  ) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    const [urlInput, setUrlInput] = useState("");
    const [urlError, setUrlError] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);

    const isValidUrl = (urlString: string) => {
      try {
        new URL(urlString);
        return true;
      } catch (e) {
        return false;
      }
    };

    const handleUrlSubmit = () => {
      if (!urlInput) {
        setUrlError("Please enter a URL");
        return;
      }
      if (!isValidUrl(urlInput)) {
        setUrlError("Please enter a valid URL");
        return;
      }

      // onChange(urlInput);
      // onChange({ path: urlInput, source: "url" });
      onChange({ mediaPath: urlInput, mediaSourceType: "file" });
      onBlur();
      setUrlInput("");
      setShowUrlInput(false);
      setUrlError("");
    };

    const pickImage = async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access gallery is required!");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
        });

        if (!result.canceled) {
          const selectedImageUri = result.assets[0].uri;
          const fileName = selectedImageUri.split("/").pop();
          const newUri = (FileSystem?.documentDirectory ?? "") + fileName;

          await FileSystem.copyAsync({
            from: selectedImageUri,
            to: newUri,
          });

          // onChange(newUri);
          onChange({ mediaPath: newUri, mediaSourceType: "file" });
          console.log("Image URI:", newUri);
          console.log("Value: ", value);
          onBlur();
        }
      } catch (error) {
        console.error("Error picking image:", error);
        alert("Failed to select image. Please try again.");
      }
    };

    const removeImage = () => {
      onChange({});
      onBlur();
    };

    return (
      <FormItem>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}

        <View className="space-y-2">
          <View className="flex-row ">
            <TouchableOpacity
              onPress={pickImage}
              disabled={disabled}
              className={`
                relative overflow-hidden rounded-lg border-2 border-dashed
                border-gray-200 w-32
                ${disabled ? "opacity-50" : "active:opacity-70"}
              `}
              style={{ aspectRatio: 1 }}
              aria-labelledby={formItemNativeID}
              aria-describedby={
                !error
                  ? formDescriptionNativeID
                  : `${formDescriptionNativeID} ${formMessageNativeID}`
              }
              aria-invalid={!!error}
            >
              {value ? (
                <>
                  <Image
                    source={{ uri: value.mediaPath }}
                    className="h-full w-full object-cover"
                  />
                  <View className="absolute right-1 top-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={removeImage}
                      disabled={disabled}
                      className="h-6 w-6"
                    >
                      <Trash2
                        className={buttonTextVariants({
                          variant: "outline",
                        })}
                        size={16}
                      />
                    </Button>
                  </View>
                </>
              ) : (
                <View className="flex-1 items-center justify-center p-2">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <Text className="mt-1 text-xs text-center text-muted-foreground">
                    Select image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {!value && (
              <TouchableOpacity
                onPress={() => setShowUrlInput(!showUrlInput)}
                className="justify-center px-3"
              >
                <Text className="text-sm text-primary">or add URL</Text>
              </TouchableOpacity>
            )}
          </View>

          {showUrlInput && (
            <View className="space-y-2 m-2">
              <Input
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="Enter image URL"
                placeholderTextColor={"#9CA3AF"} // Bug in NativeWind, using inline style for now
                className="border border-gray-200 rounded-md px-3 py-2"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {urlError ? (
                <Text className="text-xs text-destructive">{urlError}</Text>
              ) : null}
              <View className="flex-row space-x-2">
                <Button
                  className="m-2"
                  variant="outline"
                  onPress={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                    setUrlError("");
                  }}
                >
                  <Text>Cancel </Text>
                </Button>
                <Button onPress={handleUrlSubmit} className="m-2">
                  <Text>Add URL </Text>
                </Button>
              </View>
            </View>
          )}

          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </View>
      </FormItem>
    );
  }
);

FormImageSelector.displayName = "FormImageSelector";

export {
  Form,
  FormCheckbox,
  FormCombobox,
  FormDatePicker,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  //   FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
  useFormField,
  FormImageSelector,
};
