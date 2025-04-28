/**
 * LOOK
 */
const LOOK = ["solid", "light", "surface", "none"] as const;
type LOOK = (typeof LOOK)[number];
const LOOK_ENUM = Object.fromEntries(LOOK.map(look => [look, look])) as { [k in LOOK]: k };
type LOOK_ENUM = typeof LOOK_ENUM;

/**
 * FEEL
 */
const FEEL = ["pointable", "checkable", "focusable", "disablable"] as const;
type FEEL = (typeof FEEL)[number];
const FEEL_ENUM = Object.fromEntries(FEEL.map(feel => [feel, feel])) as { [k in FEEL]: k };
type FEEL_ENUM = typeof FEEL_ENUM;

/**
 * FEEL_STATUS
 */
const FEEL_STATUS = ["hover", "active", "checked", "focus", "disabled"] as const;
type FEEL_STATUS = (typeof FEEL_STATUS)[number];
const FEEL_STATUS_ENUM = Object.fromEntries(FEEL_STATUS.map(feelStatus => [feelStatus, feelStatus])) as {
  [k in FEEL_STATUS]: k;
};
type FEEL_STATUS_ENUM = typeof FEEL_STATUS_ENUM;

/**
 * THEME
 */
const THEME = ["mauve", "tomato", "ruby", "crimson", "pink", "plum", "purple", "violet"] as const;
type THEME = (typeof THEME)[number];
const THEME_ENUM = Object.fromEntries(THEME.map(theme => [theme, theme])) as { [k in THEME]: k };
type THEME_ENUM = typeof THEME_ENUM;

type DesignProps = {
  look?: LOOK;
  theme?: THEME;
  themes?: (THEME | undefined)[];
};

const themeClassNames = (...theme: (THEME | undefined)[]) =>
  theme.filter(theme => !!theme).map((theme, level) => `${theme}-${(level + 1).toString()}`);

export { FEEL, FEEL_ENUM, FEEL_STATUS, FEEL_STATUS_ENUM, LOOK, LOOK_ENUM, THEME, THEME_ENUM, themeClassNames };
export type { DesignProps };
