function getKP(lat, lng) {
  const x = lng;
  const y = lat;

  if (x < 0 || y < 0) { return 'XX-X-X'; }
  const kp = 300 / (3 ** 0);
  const s1 = 300 / (3 ** 1);
  const s2 = 300 / (3 ** 2);

  // basic grid, e.g. B5
  const kpCharCode = 65 + Math.floor(x / kp);
  const kpLetter = String.fromCharCode(kpCharCode);
  const kpNumber = Math.floor(y / kp) + 1;

  // sub keypad 1, e.g. B5 - 5
  const subY = Math.floor(y / s1) % 3;

  let subNumber = 10 - ((subY + 1) * 3);

  const subX = Math.floor(x / s1) % 3;

  subNumber += subX;

  // sub keypad 2, e.g. B5 - 5 - 3;
  const sub2Y = Math.floor(y / s2) % 3;

  let sub2Number = 10 - ((sub2Y + 1) * 3);

  const sub2X = Math.floor(x / s2) % 3;
  sub2Number += sub2X;

  return `${kpLetter}${kpNumber}-${subNumber}-${sub2Number}`;
}

function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Copying text command was ${msg}`);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function createLocation(name, latlng) {
  const marker = new L.circleMarker(latlng, {
    draggable: false,
    radius: 8,
    color: '#000000',
    stroke: true,
    weight: 2,
    fillColor: '#ffc400',
    fillOpacity: 0.5,
  });
  marker.bindTooltip(name, { permanent: true, direction: 'top', offset: [0, -8] });
  return marker;
}


function isMultiple(x, y) {
    const t = y / x;
    const r = Math.round(t);
    const d = t >= r ? t - r : r - t;
    return d < 0.0001;
}