import imageYellow from "../assets/app-banner/yellow.svg";
import imageRed from "../assets/app-banner/red.svg";
import imagePink from "../assets/app-banner/pink.svg";
import imageTurquoise from "../assets/app-banner/turquoise.svg";
import imageGreen from "../assets/app-banner/green.svg";
import imageBlue from "../assets/app-banner/blue.svg";

const YELLOW = "#F5B82E";
const RED = "#FF6E6E";
const PINK = "#F685A1";
const TURQUOISE = "#41CADD";
const GREEN = "#8DD9B9";
const BLUE = "#20A4F3";

export const COLORS = [
  {
    value: YELLOW,
    label: "Yellow",
  },
  {
    value: RED,
    label: "Red",
  },
  {
    value: PINK,
    label: "Pink",
  },
  {
    value: TURQUOISE,
    label: "Turquoise",
  },
  {
    value: GREEN,
    label: "Green",
  },
  {
    value: BLUE,
    label: "Blue",
  },
];

export const COLOR_TO_IMAGE: {
  [key: string]: string;
} = {
  [YELLOW]: imageYellow,
  [RED]: imageRed,
  [PINK]: imagePink,
  [TURQUOISE]: imageTurquoise,
  [GREEN]: imageGreen,
  [BLUE]: imageBlue,
};
