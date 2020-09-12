function init(){

  var myurl = "/data/bushfire_data/2019-12-29.csv"
  var dates = {
    1 : "/data/bushfire_data/2019-12-29.csv",
    2 : "/data/bushfire_data/2019-12-30.csv",
    3 : "/data/bushfire_data/2019-12-31.csv",
    4 : "/data/bushfire_data/2020-01-01.csv",
    5 : "/data/bushfire_data/2020-01-02.csv",
    6 : "/data/bushfire_data/2020-01-03.csv",
    7 : "/data/bushfire_data/2020-01-04.csv",
    8 : "/data/bushfire_data/2020-01-05.csv"
  }
  var color = d3.scaleQuantize() 
  .domain([0,1200])                
  .range(['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']);
  
  var map = L.map('map').setView([-25.9505, 135.8605], 4);
  
 
 var currentSlider = 1
  var data;

  
  function updateData() {
    $.ajax({
      type: "GET",  
      url: myurl,
      dataType: "text",       
      success: function(response)  
      {
        console.log("New Data updated with URL: " + myurl)
        data = $.csv.toObjects(response);
        var data_20191229 = {"max" : 8,"data": ""};
      data_20191229.data = data;
      heatmapLayer.setData(data_20191229);
        drawMaps(data);
      }   
    });
  }


  function updateData2() {
    $.ajax({
      type: "GET",  
      url: myurl,
      dataType: "text",       
      success: function(response)  
      {
        console.log("New Data updated with URL: " + myurl)
        data = $.csv.toObjects(response);
        var data_20191229 = {"max" : 8,"data": ""};
      data_20191229.data = data;
      heatmapLayer.setData(data_20191229);

  
      var svg = d3.select("svg");
      svg.selectAll("*").remove();
      L.svg().addTo(map);
      d3.select("#map")
        .select("svg")
        .selectAll("myCircles")
        .data(data_20191229.data)
        .enter()
        .append("circle")
          .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).x })
          .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).y })
          .attr("r", 0.2)
          .style("fill", "red")
          .attr("stroke", "red")
          .attr("stroke-width", 1)
          .attr("fill-opacity", .4)
      }   
    });
  }
  
  var cfg = {
    "radius": 0.3,
    "maxOpacity": .8,
    "scaleRadius": true,
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  };
var layer_1 = new L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {maxZoom: 17,minZoom: 4}).addTo(map); 
var layer_2 = new L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',{maxZoom: 17,minZoom: 4}).addTo(map); 
var layer_3 = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',{maxZoom: 17,minZoom: 4});

  heatmapLayer = new HeatmapOverlay(cfg); 


  updateData();

  var layersControl = L.control.layers.buttons({

    'Light': L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',{maxZoom: 17,minZoom: 4}),
    'Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom: 17,minZoom: 4}),
    'Heatmap' : heatmapLayer
    
  }).addTo(map); 

  
  
  function drawMaps(data){
  var data_20191229 = {"max" : 8,"data": ""};
  data_20191229.data = data;
  map.on("moveend", update);  

  
  var svg = d3.select("svg");
  svg.selectAll("*").remove();
  L.svg().addTo(map);
  d3.select("#map")
    .select("svg")
    .selectAll("myCircles")
    .data(data_20191229.data)
    .enter()
    .append("circle")
      .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).x })
      .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).y })
      .attr("r", 0.2)
      .style("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("fill-opacity", .4)

      var sliderSimple = d3
      .sliderBottom()
      .min(1)
      .max(8)
      .step(1)
      .width(1000)
      .tickFormat(d3.format('.2'))
      .ticks(9)
      .default(currentSlider)
      .on('onchange', val => {
  
        
        layersControl.remove(map);
        layersControl.addTo(map);
        d3.select('p#value-simple').text(d3.format('.2')(val));
        
        currentSlider = val;
        myurl = dates[val];
        console.log("New URL " + myurl);
        console.log(val);
        updateData2();
      });
      
      
      
      
      var gSimple = d3
      .select('div#slider-time')
      .append('svg')
      .attr('width', "100%")
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');
  
     
      gSimple.call(sliderSimple);



      var moving = false;
  var playButton = d3.select("#play-button");

  var resetButton = d3.select("#reset-button");
  resetButton
  .on("click", function() {
    sliderSimple.value(1);
    myurl = dates[1];
    updateData2();
  console.log("Reset done");
})
  
  playButton
  .on("click", function() {
  var button = d3.select(this);
  if (button.text() == "Pause") {
    moving = false;
    clearInterval(timer);
    button.text("Play");
  } else {
    moving = true;
    timer = setInterval(step, 1500);
    button.text("Pause");
  }
  console.log("Slider moving: " + moving);
})

function step() {
  sliderSimple.value(currentSlider);
  myurl = dates[currentSlider];
  updateData2();
  currentSlider = currentSlider + 1;
  

  if (currentSlider > 8) {
    moving = false;
    currentSlider = 1 ;
    clearInterval(timer);
    // timer = 2;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  
  }
  
}
  
  function update() {
    d3.selectAll("circle")
      .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).x })
      .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lng]).y })
    }
    }  

    var sliderSimple = d3
    .sliderBottom()
    .min(1)
    .max(8)
    .step(1)
    .width(1000)
    .tickFormat(d3.format('.2'))
    .ticks(9)
    .default(currentSlider)
    .on('onchange', val => {

      
      layersControl.remove(map);
      layersControl.addTo(map);
      d3.select('p#value-simple').text(d3.format('.2')(val));
      
      currentSlider = val;
      myurl = dates[val];
      console.log("New URL " + myurl);
     
      updateData();
    });
    
    
    var gSimple = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', "100%")
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

   
    gSimple.call(sliderSimple);
    d3.select('p#value-simple').text(d3.format('.2%')(sliderSimple.value()));


  };




  
    window.onload = init;
