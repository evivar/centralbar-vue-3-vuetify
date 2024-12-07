function toRad(x) {
  return (x * Math.PI) / 180;
}

function toDeg(x) {
  return x * (180 / Math.PI);
}

function calculateMiddlePoint() {
  //-- Initialize variables
  var lat1 = this.getMarker1.a.lat;
  var lng1 = this.getMarker1.a.lng;
  var lat2 = this.getMarker2.a.lat;
  var lng2 = this.getMarker2.a.lng;
  //-- Longitude difference
  var dLng = this.toRad(lng2 - lng1);

  //-- Convert to radians
  lat1 = this.toRad(lat1);
  lat2 = this.toRad(lat2);
  lng1 = this.toRad(lng1);

  var bX = Math.cos(lat2) * Math.cos(dLng);
  var bY = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
  );
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  return {
    lat: this.toDeg(lat3),
    lng: this.toDeg(lng3),
  };
}

export default {
  calculateMiddlePoint,
};
