import {
  formatMiOrKm,
  formatNumber,
  formatPhone,
  getValueFromPath,
} from "./utils";
import {
  parseTimeZoneUtcOffset,
  formatOpenNowString,
} from "./time";
import { i18n } from "../i18n";
import {
  base_url,
  limit,
  locationInput,
  locationNoun,
  locationNounPlural,
  locationOption,
  locationOptions,
  radius,
} from "./constants";
import { getRequest, startLoading, stopLoading } from "./loader";
import RtfConverter from "@yext/rtf-converter";
import { highlightLocation } from "./map";
// import $ from "jquery";


export let currentLatitude = 0;
export let currentLongitude = 0;

export function locationJSONtoHTML(entityProfile, index, locationOptions) {
  const getValue = (opt: locationOption) => {
    let val = opt.value;

    if (opt.contentSource === "FIELD") {
      val = getValueFromPath(entityProfile, opt.value);
      
    }
    return opt.isRtf && !!val ? RtfConverter.toHTML(val) : val;
  };

  const cardTitleValue = getValue(locationOptions.cardTitle);
  const getDirectionsLabelValue = getValue(locationOptions.getDirectionsLabel);
  const viewDetailsLinkTextValue = getValue(
    locationOptions.viewDetailsLinkText
  );
  let cardTitleLinkUrlValue = getValue(locationOptions.cardTitleLinkUrl);
  const hoursValue = getValue(locationOptions.hours);
  const addressValue = getValue(locationOptions.address);
  const phoneNumberValue = getValue(locationOptions.phoneNumber);
  let viewDetailsLinkUrlValue = getValue(locationOptions.viewDetailsLinkUrl);

  let html =
    '<div class="lp-param-results lp-subparam-cardTitle lp-subparam-cardTitleLinkUrl">';
  if (cardTitleLinkUrlValue && cardTitleValue) {

    if (cardTitleLinkUrlValue["url"]) {
      cardTitleLinkUrlValue = cardTitleLinkUrlValue["url"];
          
    }
    // html += `<div class="name hover:underline hover:font-semibold text-ll-red ">
    //   <a href="${cardTitleLinkUrlValue}">
    //     ${cardTitleValue} 
    //   </a>
    // </div>`;
  } 
  else if (cardTitleValue) {
    // html += `<div class="name hover:underline hover:font-semibold text-ll-red ">
    //   ${cardTitleValue}
    // </div>`;
  }
  html += "</div>";
  let count_index = index+1;  
   html += '<div class="lp-param-results lp-subparam-getDirectionsLabel"> '+ count_index + '</div>';
  html += '<h4 class="storelocation-name text-sm font-Futura uppercase font-black text-textblack mb-1 pr-5 pl-10 md:pl-6 lg:pl-16">'  +  cardTitleValue + '</h4>';
  html+='<a class="details text-textblack mb-1 pr-5 pl-10 md:pl-6 lg:pl-16" href='+cardTitleLinkUrlValue +'>see details</a>';  
     if (hoursValue) {
       const offset = getValueFromPath(entityProfile, "timeZoneUtcOffset");
       const parsedOffset = parseTimeZoneUtcOffset(offset);
       html += '<div class="lp-param-results lp-subparam-hours">';
       // html +=   
       //   '<div class="open-now-string">' +
       //   formatOpenNowString(hoursValue, parsedOffset) +
       //   "</div>";
      html += '<div class="storelocation-openCloseTime pr-5 pl-10 md:pl-6 lg:pl-16 pb-4 text-[#928f8c] text-[11px] leading-tight capitalize">';                       html += '<ul>';
    $.each(hoursValue, function (indexh, hour) {
      
      
      html += '<li><strong>';
      html +=  indexh.toString();
      html += '</strong>';
        
        if(hour.openIntervals){
          $.each(hour.openIntervals, function (op, openInterval) {
            html += openInterval.start+' to '+openInterval.end;
          });
        }else{
          html += 'Closed';
        }
        
      html += '</li>'; 
    });
    html += '</ul>';                        
    html += '</div>';

    html += "</div>";
     }

  html += '<div class="address text-[12px] font-normal text-[#928f8c] leading-tight uppercase mb-1 pr-5 pl-10 md:pl-6 lg:pl-16">';
  html += addressValue.line1 + ', ' + addressValue.city + ', ' + addressValue.region + ', ' + addressValue.postalCode + ', ' + addressValue.countryCode+'<br/>';

  if (phoneNumberValue) {
    const formattedPhoneNumber = formatPhone(
      phoneNumberValue,
      addressValue.countryCode
    );
    if (formattedPhoneNumber) {
      html += '<div class="phone">' + formattedPhoneNumber + "</div>";
    }
  }
  html += "</div>";
  html += '<div class="lp-param-results lp-subparam-phoneNumber">';
  
  html += "</div>";

  const singleLineAddress =
    entityProfile.name +
    " " +
    addressValue.line1 +
    " " +
    (addressValue.line2 ? addressValue.line2 + " " : "") +
    addressValue.city +
    " " +
    addressValue.region +
    " " +
    addressValue.postalCode;

  html += `<div class="lp-param-results lp-subparam-getDirectionsLabel">
    <div class="link">
      <a target="_blank"
        href="https://www.google.com/maps/dir/?api=1&destination=${singleLineAddress}"
      >
        ${getDirectionsLabelValue}
      </a>
    </div>
  </div>`;
  html += '<div class="lp-param-results lp-subparam-availability mt-3">';
  html += "</div>";

  // if (viewDetailsLinkUrlValue && viewDetailsLinkTextValue) {
  //   // Url value is URL object and not url.
  //   if (viewDetailsLinkUrlValue["url"]) {
  //     viewDetailsLinkUrlValue = viewDetailsLinkUrlValue["url"];
  //   }
  //   html += `<div class="lp-param-results lp-subparam-viewDetailsLinkText lp-subparam-viewDetailsLinkUrl">
  //     <div class="lp-param lp-param-viewDetailsLabel link"><strong>
  //       <a href="${viewDetailsLinkUrlValue}">
  //         ${viewDetailsLinkTextValue}
  //       </a>
  //     </strong></div>
  //   </div>`;
  // }

  // Add center column
  html = `<div class="center-column">${html}</div>`;

  // Add left and right column
  /*if (entityProfile.__distance) {
    html = `<div class="left-column">
      ${index + 1}.
    </div>
    ${html}
    <div class="right-column"><div class="distance">
      ${formatMiOrKm(
        entityProfile.__distance.distanceMiles,
        entityProfile.__distance.distanceKilometers
      )}
    </div></div>`;
  }else{*/
    html = `<div class="left-column absolute top-4 left-2 lg:left-4 w-5 h-8 marker-no bg-no-repeat bg-center text-center leading-[24px] text-white">
      ${index + 1}.
    </div>${html}`;
  /*}*/

  return `<div id="result-${index}" class="result border list-group-item w-full border border-[#efeeeb] mb-5 relative ">${html}</div>`;
}


// Renders each location the the result-list-inner html
export function renderLocations(locations, append, viewMore) {
  if (!append) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML = "";
      });
  }

  // Done separately because the el.innerHTML call overwrites the original html.
  // Need to wait until all innerHTML is set before attaching listeners.
  locations.forEach((location, index) => {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML += locationJSONtoHTML(location, index, locationOptions);
      });
  });

  locations.forEach((_, index) => {
    document
      .getElementById("result-" + index)
      .addEventListener("mouseover", () => {
        highlightLocation(index, false, false);
      });
    document.getElementById("result-" + index).addEventListener("click", () => {
      highlightLocation(index, false, true);
    });
  });

  if (viewMore) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML +=
          '<div><div class="btn btn-link btn-block">View More</div></div>';
      });
  }
}

function searchDetailMessageForCityAndRegion(total) {
  if (total === 0) {
    return '0 [locationType] found near <strong>"[city], [region]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[city], [region]"</strong>';
  }
}

function searchDetailMessageForArea(total) {
  if (total == 0) {
    return '0 [locationType] found near <strong>"[location]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[location]"</strong>';
  }
}

function searchDetailMessageNoGeo(total) {
  if (total === 0) {
    return "0 [locationType]";
  } else {
    return "[formattedVisible] of [formattedTotal] [locationType]";
  }
}

// Renders details of the search
export function renderSearchDetail(geo, visible, total, queryString) {
  // x of y locations near "New York, NY"
  // x  locations near "New York, NY"
  // x  locations near "New York, NY"

  let locationType = locationNoun;
  if (total === 0 || total > 1) {
    locationType = locationNounPlural;
  }

  let formattedVisible = formatNumber(visible);
  let formattedTotal = formatNumber(total);

  let searchDetailMessage;
  if (geo) {
    if (geo.address.city !== "") {
      searchDetailMessage = searchDetailMessageForCityAndRegion(total);
      searchDetailMessage = searchDetailMessage.replace(
        "[city]",
        geo.address.city
      );
      searchDetailMessage = searchDetailMessage.replace(
        "[region]",
        geo.address.region
      );
    } else {
      let location = "";
      if (geo.address.region) {
        location = geo.address.region;
      } else if (geo.address.country && queryString) {
        location = queryString;
      } else if (geo.address.country) {
        location = geo.address.country;
      }
      if (location !== "") {
        searchDetailMessage = searchDetailMessageForArea(total);
        searchDetailMessage = searchDetailMessage.replace(
          "[location]",
          location
        );
      }
    }
  } else {
    searchDetailMessage = searchDetailMessageNoGeo(total);
  }
  searchDetailMessage = searchDetailMessage.replace(
    "[locationType]",
    locationType
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedVisible]",
    formattedVisible
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedTotal]",
    formattedTotal
  );

  [].slice
  .call(document.querySelectorAll(".search-center") || [])
  .forEach(function (el) {
    el.innerHTML = "";
   });
  [].slice
    .call(document.querySelectorAll(".search-center") || [])
    .forEach(function (el) {
      el.innerHTML = searchDetailMessage;
    });
}

export function getNearestLocationsByString() {
  const queryString = locationInput.value;
  if (queryString.trim() !== "") {
    var request_url = base_url + "entities/geosearch";

    request_url += "?radius=" + radius;
    request_url += "&location=" + queryString;
    
    // Uncommon below to limit the number of results to display from the API request
    // request_url += "&limit=" + limit;
    getRequest(request_url, queryString);
  }
  var url = window.location.href;
  var myStorage = window.sessionStorage;
  sessionStorage.setItem('query', url);
}

// Get locations by lat lng (automatically fired if the user grants acceess)
function getNearestLatLng(position) {
  [].slice
    .call(document.querySelectorAll(".error-text") || [])
    .forEach(function (el) {
      el.textContent = "";
    });
  currentLatitude = position.coords.latitude;
  currentLongitude = position.coords.longitude;
  let request_url = base_url + "entities/geosearch";
  request_url += "?radius=" + radius;
  request_url +=
    "&location=" + position.coords.latitude + ", " + position.coords.longitude;
  // request_url += "&limit=" + limit;
  getRequest(request_url, null);
}

// Gets a list of locations. Only renders if it's a complete list. This avoids a dumb looking map for accounts with a ton of locations.
export function getLocations() {
  let request_url =
    base_url +
    "entities" +
    "?limit=" +
    limit +
    '&sortBy=[{"name":"ASCENDING"}]';
  
    let filterParameters = {};
    let filterAnd = {};
    let filterOr = {};
    
    const queryString = locationInput.value;
     
    if (queryString) {
      
      filterOr = {"$or": [
          {"address.line1": {"$contains": queryString}},
          {"address.city": {"$contains": queryString}},
          {"address.region": {"$contains": queryString}},
          {"address.countryCode": {"$contains": queryString}},
          {"address.postalCode": {"$contains": queryString}}, 
          {"name": {"$contains": queryString}}
        ]
      }; 
      
    }
    
    var ce_departments = [];
    $('.checkbox_departments').each(function () {              
        if ($(this).is(":checked")) {
        ce_departments.push($(this).val());
        }
    });
    
    if(ce_departments.length > 0){      
      filterAnd = {"$and":[{"c_departments":{"$in": ce_departments}}]};
        
    }
    
    filterParameters = {...filterOr,...filterAnd};
    var filterpar = JSON.stringify(filterParameters);
    var filter = encodeURI(filterpar);
    
    if(filter){
      request_url += "&filter=" + filter;
    }
    
  getRequest(request_url, null);
}

export function getDepartments() {
    var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
    var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
    var vparam = "20181017";   
    var entityTypes = "ce_departments";    
     console.log(entityTypes);
    var fullURL =
      baseURL +
      "api_key=" +
      api_key +
      "&v=" +
      vparam + 
      "&entityTypes=" +
      entityTypes ;
      fetch(fullURL).then(response => response.json()).then(result => {
      
        if (!result.errors) {
              if (result.response.count > 0) {
                var html = '';
                $.each(result.response.entities, function (index, entity) {

                  html += '<li class="department-list-item w-1/2 sm:w-1/3 md:w-1/4 mb-4" data-name="' + entity.name + '" data-id="' + entity.meta.id + '" >';
                  html += '<div class="form-check relative"><input class="checkbox_departments absolute top-0 left-0   " type="checkbox" name="c_departments[]" value="' + entity.meta.id + '" id="' + entity.name + '">';
                  html += '<label class="relative pl-7 text-sm font-Futura font-light cursor-pointer" for="' + entity.name + '"> ' + entity.name + '</label>';
                  html += '</li>';
                      
                });

                $(".department-list").html(html);
                
                $(".checkbox_departments").change(function() {                  
                getLocations();
                });
                
              } else {

              }

            } else {

        }

      });
}
getDepartments();

export function getUsersLocation() {
  if (navigator.geolocation) {
    startLoading();
    const error = (error) => {
      [].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          el.textContent =
            "Unable to determine your location. Please try entering a location in the search bar.";
        });
      stopLoading();
    };
    navigator.geolocation.getCurrentPosition(getNearestLatLng, error, {
      timeout: 10000,
    });
  }
}