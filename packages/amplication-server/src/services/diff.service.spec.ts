import { DiffService } from "./diff.service";

// #region test data
const OBJECT = {
  name: "South America",
  summary:
    "South America (Spanish: América del Sur, Sudamérica or  \nSuramérica; Portuguese: América do Sul; Quechua and Aymara:  \nUrin Awya Yala; Guarani: Ñembyamérika; Dutch: Zuid-Amerika;  \nFrench: Amérique du Sud) is a continent situated in the  \nWestern Hemisphere, mostly in the Southern Hemisphere, with  \na relatively small portion in the Northern Hemisphere.  \nThe continent is also considered a subcontinent of the  \nAmericas.[2][3] It is bordered on the west by the Pacific  \nOcean and on the north and east by the Atlantic Ocean;  \nNorth America and the Caribbean Sea lie to the northwest.  \nIt includes twelve countries: Argentina, Bolivia, Brazil,  \nChile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname,  \nUruguay, and Venezuela. The South American nations that  \nborder the Caribbean Sea—including Colombia, Venezuela,  \nGuyana, Suriname, as well as French Guiana, which is an  \noverseas region of France—are also known as Caribbean South  \nAmerica. South America has an area of 17,840,000 square  \nkilometers (6,890,000 sq mi). Its population as of 2005  \nhas been estimated at more than 371,090,000. South America  \nranks fourth in area (after Asia, Africa, and North America)  \nand fifth in population (after Asia, Africa, Europe, and  \nNorth America). The word America was coined in 1507 by  \ncartographers Martin Waldseemüller and Matthias Ringmann,  \nafter Amerigo Vespucci, who was the first European to  \nsuggest that the lands newly discovered by Europeans were  \nnot India, but a New World unknown to Europeans.",
  surface: 17840000,
  timezone: [-4, -2],
  demographics: {
    population: 385742554,
  },
  languages: ["spanish", "portuguese", "english"],
  countries: [
    {
      name: "Argentina",
      capital: "Buenos Aires",
      independence: "1816-07-08T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Brazil",
      capital: "Brasilia",
      independence: "1822-09-06T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Chile",
      capital: "Santiago",
      independence: "1818-02-11T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Colombia",
      capital: "Bogotá",
      independence: "1810-07-19T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Ecuador",
      capital: "Quito",
      independence: "1809-08-09T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Guyana",
      capital: "Georgetown",
      independence: "1966-05-25T23:00:00.000Z",
      unasur: true,
    },
    {
      name: "Uruguay",
      capital: "Montevideo",
      independence: "1825-08-24T23:50:39.000Z",
      unasur: true,
    },
  ],
};
const OBJECT_WITH_CHANGES = {
  name: "South America",
  summary:
    "South America (Spanish: América del Sur, Sudamérica or  \nSuramérica; Portuguese: América do Sul; Quechua and Aymara:  \nUrin Awya Yala; Guarani: Ñembyamérika; Dutch: Zuid-Amerika;  \nFrench: Amérique du Sud) is a continent situated in the  \nWestern Hemisphere, mostly in the Southern Hemisphere, with  \na relatively small portion in the Northern Hemisphere.  \nThe continent is also considered a subcontinent of the  \nAmericas.[2][3] It is bordered on the west by the Pacific  \nOcean and on the north and east by the Atlantic Ocean;  \nNorth America and the Caribbean Sea lie to the northwest.  \nIt includes twelve countries: Argentina, Bolivia, Brasil,  \nChile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname,  \nUruguay, and Venezuela. The South American nations that  \nborder the Caribbean Sea—including Colombia, Venezuela,  \nGuyana, Suriname, as well as French Guiana, which is an  \noverseas region of France—are a.k.a. Caribbean South  \nAmerica. South America has an area of 17,840,000 square  \nkilometers (6,890,000 sq mi). Its population as of 2005  \nhas been estimated at more than 371,090,000. South America  \nranks fourth in area (after Asia, Africa, and North America)  \nand fifth in population (after Asia, Africa, Europe, and  \nNorth America). The word America was coined in 1507 by  \ncartographers Martin Waldseemüller and Matthias Ringmann,  \nafter Amerigo Vespucci, who was the first European to  \nsuggest that the lands newly discovered by Europeans were  \nnot India, but a New World unknown to Europeans.",
  timezone: [-4, -2],
  demographics: {
    population: 385744896,
  },
  languages: ["spanish", "portuguese", "inglés"],
  countries: [
    {
      name: "Argentina",
      capital: "Rawson",
      independence: "1816-07-08T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Brazil",
      capital: "Brasilia",
      independence: "1822-09-06T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Chile",
      capital: "Santiago",
      independence: "1818-02-11T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Ecuador",
      capital: "Quito",
      independence: "1809-08-09T23:50:39.000Z",
      unasur: true,
    },
    {
      name: "Guyana",
      capital: "Georgetown",
      independence: "1966-05-25T23:00:00.000Z",
      unasur: true,
    },
    {
      name: "Antártida",
      unasur: false,
    },
    {
      name: "Colombia",
      capital: "Bogotá",
      independence: "1810-07-19T23:50:39.000Z",
      unasur: true,
      population: 42888594,
    },
  ],
  spanishName: "Sudamérica",
};
// #endregion

describe("DiffService", () => {
  let service: DiffService;

  beforeEach(() => {
    service = new DiffService();
  });

  it("should return true when inputs are different", () => {
    expect(service.areDifferent(OBJECT_WITH_CHANGES, OBJECT)).toBe(true);
    expect(service.areDifferent(undefined, OBJECT)).toBe(true);
  });

  it("should return false when inputs are the same", () => {
    expect(service.areDifferent(OBJECT, OBJECT)).toBe(false);
    expect(service.areDifferent(undefined, undefined)).toBe(false);
  });

  it("should return false when only ignored properties change", () => {
    expect(
      service.areDifferent(
        { a: "a", generatedId: "dc785T" },
        { a: "a", generatedId: "dc786S" },
        ["generatedId"]
      )
    ).toBe(false);
    expect(
      service.areDifferent(
        { a: [{ b: "b", generatedId: "dc785T" }] },
        { a: [{ b: "b", generatedId: "dc786S" }] },
        ["generatedId"]
      )
    ).toBe(false);
  });
});
