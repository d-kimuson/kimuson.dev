import { useEffect, useMemo, useRef } from "preact/hooks";
import type { Ref, JSX } from "preact";

type TypeToDefault<T extends FormConfig["type"]> = T extends "string"
  ? string
  : T extends "number"
    ? number | null
    : never;

type FormConfig =
  | {
      type: "string";
      default: string;
      onInput?: (value: string) => void;
    }
  | {
      type: "number";
      default: number | null;
      onInput?: (value: number | null) => void;
    };

type FormConfigs = Record<string, FormConfig>;

type InputProps = Pick<
  JSX.HTMLAttributes<HTMLInputElement>,
  "defaultValue" | "type" | "ref" | "onInput"
>;

const dataTypeToInputType = (formType: FormConfig["type"]) => {
  switch (formType) {
    case "string":
      return "text";
    case "number":
      return "number";
    default: {
      formType satisfies never;
      throw new Error("UnExpected.");
    }
  }
};

const configToDefaultValue = ({
  type: formType,
  default: defaultValue,
}: FormConfig) => {
  switch (formType) {
    case "string":
      return defaultValue;
    case "number":
      return defaultValue === null ? "" : String(defaultValue);
    default: {
      formType satisfies never;
      throw new Error("UnExpected.");
    }
  }
};

const transformValue = <Type extends FormConfig["type"]>(
  formType: Type,
  value: string
) => {
  switch (formType) {
    case "string":
      return value;
    case "number":
      return value === "" ? null : Number(value);
    default: {
      formType satisfies never;
      throw new Error("UnExpected.");
    }
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useForm = <
  const T extends FormConfigs,
  // @ts-expect-error -- keyof T(Record<string, unknown>) は string を満たす
  const Keywords extends string = keyof T,
>(
  config: T
) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TODO: あとでちゃんと対応
  const keywords = useMemo(() => Object.keys(config) as Keywords[], [config]);
  const refMap = useRef<Record<Keywords, Ref<HTMLInputElement>>>(
    // @ts-expect-error -- ..
    keywords.reduce((s, key) => {
      return {
        ...s,
        [key]: useRef<HTMLInputElement>(null),
      };
    }, {})
  );

  useEffect(() => {
    for (const key of keywords) {
      // @ts-expect-error -- ..
      refMap.current[key].current.value = config[key].default;
    }
  }, []);

  const register = (keyword: Keywords): InputProps => {
    const ref = refMap.current[keyword];
    const targetConfig = config[keyword];
    if (targetConfig === undefined) throw new Error("UnExpected.");

    return {
      ref: ref,
      type: dataTypeToInputType(targetConfig.type),
      defaultValue: configToDefaultValue(targetConfig),
      onInput: () => {
        if (targetConfig.onInput !== undefined) {
          targetConfig.onInput(
            // @ts-expect-error ..
            transformValue(targetConfig.type, ref.current.value)
          );
        }
      },
    };
  };

  const handleSubmit = (
    onSubmit: (
      updated: Record<Keywords, TypeToDefault<T[Keywords]["type"]>>
    ) => void
  ) => {
    return (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
      event.preventDefault();

      onSubmit(
        // @ts-expect-error -- ..
        keywords.reduce(
          (s, key) => ({
            ...s,
            [key]: transformValue(
              // @ts-expect-error -- ..
              config[key].type,
              // @ts-expect-error -- ..
              refMap.current[key].current.value
            ),
          }),
          {}
        )
      );
    };
  };

  return {
    register,
    handleSubmit,
  };
};
