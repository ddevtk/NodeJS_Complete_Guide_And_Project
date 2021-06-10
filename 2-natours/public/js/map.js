export const displayMap = (locArr) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGRldmsiLCJhIjoiY2twbnJ4MzYyMjMxbDJ2bzhqdDNxeGpuOSJ9.H5CYIoW16i7A4NI4ht76ng';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ddevk/ckpnt9d5s0o0817usdxs0wp37',
    zoom: 4,
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  //MAKER tich hop san
  locArr.forEach((loc) => {
    new mapboxgl.Marker()
      .setLngLat(loc.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 30 }).setHTML(
          `<h3>Day ${loc.day}: ${loc.description}</h3>`
        )
      )
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 200, left: 100, right: 100 },
  });

  // Custom marker
  // locArr.forEach((loc) => {
  //   const markerEl = document.createElement('div');
  //   markerEl.className = 'marker';

  //   new mapboxgl.Marker({
  //     element: markerEl,
  //     anchor: 'bottom',
  //   })
  //     .setLngLat(loc.coordinates)
  //     .addTo(map);
  // });
};
