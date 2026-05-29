import emotionStyled from "@emotion/styled";
import type { CSSObject, Interpolation, StyledOptions } from "@emotion/styled";
import type { Theme } from "@mui/material/styles";
import _isPlainObject from "lodash/isPlainObject";

/** Filters transient style-only props (prefix `$`) from reaching the DOM. */
function shouldForwardProp(prop: PropertyKey): boolean {
  return typeof prop !== "string" || !prop.startsWith("$");
}

type StyleProps = Readonly<{ theme?: Theme }>;
type StyleInterpolation = Interpolation<StyleProps>;
type StyledCallable = (...styles: StyleInterpolation[]) => object;
type EmotionStyled = typeof emotionStyled;

/** Expand MUI `typography` shorthand; explicit font props declared after win. */
function expandTypography(styles: CSSObject, theme: Theme): CSSObject {
  const { typography, ...rest } = styles;
  const base =
    typeof typography === "string"
      ? (theme.typography[typography as keyof Theme["typography"]] as CSSObject)
      : undefined;

  const result: CSSObject = {
    ...(base ?? {}),
    ...rest,
  };

  for (const key of Object.keys(result)) {
    const value = result[key];
    if (_isPlainObject(value)) {
      result[key] = expandTypography(value as CSSObject, theme);
    }
  }

  return result;
}

function expandTypographyResult(
  result: Interpolation<StyleProps>,
  theme: Theme,
): Interpolation<StyleProps> {
  if (Array.isArray(result)) {
    return result.map((item) => expandTypographyResult(item, theme));
  }
  if (_isPlainObject(result)) {
    return expandTypography(result as CSSObject, theme);
  }
  return result;
}

function withTypographyExpansion(styles: StyleInterpolation): StyleInterpolation {
  if (typeof styles === "function") {
    return (props) => {
      const result = styles(props);
      if (!props.theme) {
        return result;
      }
      return expandTypographyResult(result, props.theme);
    };
  }
  if (_isPlainObject(styles)) {
    return (props) => {
      if (!props.theme) {
        return styles as CSSObject;
      }
      return expandTypography(styles as CSSObject, props.theme);
    };
  }
  return styles;
}

function mergeOptions(options?: StyledOptions): StyledOptions {
  const custom = options?.shouldForwardProp;
  return {
    ...options,
    shouldForwardProp: (prop: string) => shouldForwardProp(prop) && (custom?.(prop) ?? true),
  };
}

function wrapStyledFactory<T extends StyledCallable>(factory: T): T {
  return ((style?: StyleInterpolation, ...rest: StyleInterpolation[]) => {
    const wrappedStyle = style != null ? withTypographyExpansion(style) : style;
    return factory(wrappedStyle ?? style, ...rest);
  }) as T;
}

const styled = new Proxy(emotionStyled, {
  apply(_target, _thisArg, args: Parameters<EmotionStyled>) {
    const [component, options] = args;
    const factory = emotionStyled(component, mergeOptions(options));
    return wrapStyledFactory(factory as StyledCallable);
  },
  get(target, prop, receiver) {
    if (typeof prop === "string" && prop in target) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        const factory = emotionStyled(prop as Parameters<EmotionStyled>[0], mergeOptions());
        return wrapStyledFactory(factory as StyledCallable);
      }
    }
    return Reflect.get(target, prop, receiver);
  },
}) as EmotionStyled;

export default styled;
