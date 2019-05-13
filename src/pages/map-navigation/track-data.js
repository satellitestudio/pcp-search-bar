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
