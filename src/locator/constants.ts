export const limit = 5;
export const radius = 300;
export const defaultQuery = "";
export const locationInput = <HTMLInputElement>(
  document.getElementById("location-input")
);
export const searchButton = document.getElementById("search-location-button");
export const useMyLocation = document.getElementById("useLocation");
export const locationNoun = "Locations";
export const locationNounPlural = "Locations";

// Live Api query variables
var script_tag = document.getElementById('js-locator');
export const liveAPIKey = script_tag.getAttribute('data');
export const savedFilterId = "885139055";
export const entityTypes = "location";
export const loadLocationsOnLoad = false;
export const enableAutocomplete = true;
export const base_url = "https://liveapi-sandbox.yext.com/v2/accounts/me/";
export const useMiles = true;

export type locationOption = {
  // The value of the content, either a field name or a constant value
  value: string;
  // Determines where this value comes from. Generally either FIELD or text.
  contentSource: string;
  // Determines whether the content defined in value should be parsed as RTF.
  isRtf: boolean | undefined;
};

export const locationOptions = {
  cardTitle: {
    value: "name",
    contentSource: "FIELD",
    isRtf: true,
  },
  cardTitleLinkUrl: {
    value: "slug",
    contentSource: "FIELD",
  },
  hours: {
    value: "hours",
    contentSource: "FIELD",
  },
  address: {
    value: "address",
    contentSource: "FIELD",
  },
  phoneNumber: {
    value: "mainPhone",
    contentSource: "FIELD",
  },
  getDirectionsLabel: {
    value: "Get Directions",
    contentSource: "text",
    isRtf: true,
  },
  coordinates: {
    value: "geocodedCoordinate",
    contentSource: "FIELD",
  },
  viewDetailsLinkText: {
    value: "View Details",
    contentSource: "text",
  },
  viewDetailsLinkUrl: {
    value: "/",
    contentSource: "text",
  },
};
