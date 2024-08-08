import { EnumTextColor } from "@amplication/ui/design-system";
import { UsageInsightsDataBoxProps } from "./UsageInsightsDataBox";

export const USAGE_INSIGHTS_DATA_BOX_DATA: UsageInsightsDataBoxProps[] = [
  {
    icon: "code",
    color: EnumTextColor.ThemeTurquoise,
    label: "Lines of code",
    info: "Total Lines of Code (LOC) generated or updated.",
    endnotes: "Data collection started on March 27, 2024",
  },
  {
    icon: "clock",
    color: EnumTextColor.Secondary,
    label: "Time saved",
    units: "hours",
    info: `Wondering about the time saved by Amplication generated code for your backend development? 
    Based on our research and considering the efficiency of backend developers,
    we estimate that a developer creates around 8,335 lines of code per month. This breaks down to 
    approximately 52.05 lines of code per developer hour.
    Have a different perspective? {{contactUsLink}} and let's chat about it!`,
    endnotes: "Data collection started on March 27, 2024",
  },
  {
    icon: "dollar-sign",
    color: EnumTextColor.ThemeGreen,
    label: "Cost saved",
    info: `Wondering about the cost estimate for 1k lines of code in your backend development? 
    We've calculated it to be around $2.4K, factoring in complexity, sensitivity, developer expenses,
    and potential bug resolution expenses. 
    Have a different perspective? {{contactUsLink}} and let's chat about it!`,
    endnotes: "Data collection started on March 27, 2024",
  },
  {
    icon: "check",
    color: EnumTextColor.ThemeOrange,
    label: "Code quality - bugs prevented",
    info: `Wondering about the calculation for bugs prevented in your backend development code? 
    We've estimated it to be around 2.8 bugs per 1,000 lines of code (LOC), based on research data, such as findings from Carnegie Mellon University.
    Have a different perspective? {{contactUsLink}} and let's chat about it!`,
    endnotes: "Data collection started on March 27, 2024",
  },
];
