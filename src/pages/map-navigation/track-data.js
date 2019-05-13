export default {
  id: 'Track example',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: '4801222-2017-09-05T04:50:00.000000Z',
          type: 'track',
          coordinateProperties: {
            times: [1510792500000, 1510796100000, 1510799700000, 1510803300000, 1510806900000],
          },
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [104.8892, 1.6431],
            [104.9594, 1.6919],
            [105.0181, 1.6211],
            [104.8811, 1.5453],
            [104.8206, 1.5914],
          ],
        },
      },
    ],
  },
  color: '#FE81EB',
  type: 'geojson',
  fitBoundsOnLoad: true,
}

// Style layer to render icon using mapbox
// var origin = track.data.features[0].geometry.coordinates[0]
// const iconLayer = {
//   title: 'Navigation icon layer',
//   type: 'mapboxgl',
//   id: 'navigation_icon',
//   visible: true,
//   opacity: 1,
//   gl: {
//     source: {
//       type: 'geojson',
//       data: {
//         type: 'FeatureCollection',
//         features: [
//           {
//             type: 'Feature',
//             properties: {
//               bearing: 0,
//             },
//             geometry: {
//               type: 'Point',
//               coordinates: origin,
//             },
//           },
//         ],
//       },
//     },
//     layers: [
//       {
//         id: 'navigation-icon-layer',
//         // source: 'navigation_icon',
//         type: 'symbol',
//         // paint: {
//         //   'circle-radius': 10,
//         //   'circle-color': '#007cbf',
//         // },
//         layout: {
//           'icon-image': 'port',
//           'icon-rotate': ['get', 'bearing'],
//           'icon-rotation-alignment': 'map',
//           'icon-allow-overlap': true,
//           'icon-ignore-placement': true,
//         },
//       },
//     ],
//   },
// }
