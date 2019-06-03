
var url = new URL(window.location)
var num = parseInt(url.searchParams.get("num") || "10")

fetch(`./clusters-${num}k.json`)
  .then(res => res.json())
  .then(geojson => {
    loadMap(geojson)
  })


mapboxgl.accessToken = 'pk.eyJ1IjoiZW5yaXF1ZXR1eWEiLCJhIjoiY2loNmFwYjJuMDlzZnR4bHh3NnRyNmQxcCJ9.vf_v5i6RWNz5Q7rglf35pQ';

const loadMap = (geojson) => {
  var style = {
    "glyphs": "https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-glyphs/master/_output/{fontstack}/{range}.pbf?raw=true",
    "version": 8,
    "name": "Blank",
    "center": [0, 0],
    "zoom": 3,
    "bearing": 0,
    "pitch": 0,
    "sources": {
        "countries": {
          "type": "geojson",
          "data": window.countries
        },
        "points": {
          "type": "geojson",
          "data": geojson,
          cluster: true,
          clusterMaxZoom: 5, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50),
          clusterProperties: {
            "max_risk": ["max", ["get", "type"]],
          }
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {"background-color": "rgba(0,0,0,0)"}
        },
        {
            "id": "countries",
            "type": "line",
            "source": "countries",
            "layout": {},
            "paint": {}
        },
        {
          "id": "clusters",
          "type": "circle",
          "source": "points",
          "layout": {},
          "filter": ["has", "point_count"],
          "paint": {
            "circle-color": [
              "step",
              ["get", "max_risk"],
              "#FFAA7C",
              4,
              "#FF6765"
              ],
            "circle-radius": [
              // "step",
              // ["get", "point_count"],
              // 10,
              // 50, 25,
              // 1000, 50

              // "*",
              // ["get", "point_count"],
              // .5

              "interpolate",
              ["exponential", .9],
              ["get", "point_count"],
              2, 10,
              500, 35,
              1000, 50
            ]
          }
        },
        {
          id: "cluster-count",
          type: "symbol",
          source: "points",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Roboto Mono Light"],
            "text-size": 12
          },
           paint: {
            "text-color": "#ffffff",
            "text-opacity": 1,
          }
        },
        {
          id: "unclustered-point",
          type: "circle",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          "paint": {
            "circle-stroke-width": 1,
            "circle-stroke-color": "#000",
            "circle-color": [
              "step",
              ["get", "type"],
              "#FFAA7C",
              4,
              "#FF6765"
              ],
            "circle-radius": 5
          }
        }
    ]
  }
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true
  })

  document.getElementById('filter').addEventListener('click', () => {
    const DATE_START = new Date(2012,0,1).getTime()
    const DATE_END = new Date(2016,11,31).getTime()
    const DELTA = DATE_END - DATE_START
    const length = Math.random() * DELTA
    const relStart = Math.random() * (DELTA - length)
    const start = Math.floor(DATE_START + relStart)
    const end = Math.floor(start + length)
    document.getElementById('filter').innerText = new Date(start) + '-' + new Date(end)
   
    // this just can't work as original datetime point properties are not accessible on clusters...
    // const filter =  ['all', ['>', 'datetime', start], ['<', 'datetime', end]]
    // map.setFilter('clusters', filter)
    // map.setFilter('unclustered-point', filter)
    // map.setFilter('cluster-count', filter)

    //... so just update source
    const filteredPoints = geojson.features.filter(f => f.properties.datetime > start && f.properties.datetime < end)
    const t = performance.now()
    map.getSource('points').setData({
      "type": "FeatureCollection",
      "features": filteredPoints
    });
    console.log(performance.now() - t)
  })
  
  map.on('click', 'points', function (e) {
    const feature = e.features[0]
  
    document.querySelector('#info').innerText = `
      ${Object.keys(feature.properties).map(k => {
        return `${k}:${feature.properties[k]}`
      }).join(', ')}
    `
  });
}


