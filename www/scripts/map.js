var layers=new Object();
var sources= new Object();
var selectedFeature;
var tmp_source;
var tmp;
var tmp_souk, tmp_art_merchant, tmp_historic_site;
var tmp_souk_source, tmp_art_merchant_source, tmp_historic_site_source;
var selectedTour;
var wgs84Sphere = new ol.Sphere(6378137);
var roads={
	1:{48:7,2:49,47:10},
	2:{3:24,1:49},
	3:{4:17,2:24},
	4:{5:20,45:6,3:17},
	5:{43:11,6:12,4:20},
	6:{7:56,5:12},
	7:{8:47,6:56},
	8:{64:26,61:87,7:47},
	9:{10:24,11:22,12:29,53:23},
	10:{13:35,35:24,33:40,9:24},
	11:{9:22},
	12:{9:29},
	13:{31:41,30:32,10:35},
	14:{15:38,66:10},
	15:{16:19,17:34,14:38},
	16:{15:19},
	17:{54:19,15:34},
	18:{56:16,19:242,55:68},
	19:{20:13,18:242},
	20:{21:43,24:77,19:13},
	21:{22:39,44:84,20:43},
	22:{23:27,21:39},
	23:{47:10,22:27},
	24:{25:16,26:14,52:17,20:77},
	25:{24:16},
	26:{27:34,28:24,24:14},
	27:{26:34},
	28:{29:15,30:24,26:24,52:22},
	29:{28:15},
	30:{13:32,28:24,53:12},
	31:{32:43,13:41,35:32},
	32:{49:21,36:28,31:43},
	33:{34:9,37:20,10:40},
	34:{35:22,36:35,33:9},
	35:{31:32,10:24,34:22},
	36:{50:19,32:28,34:35},
	37:{38:51,40:42,41:26,33:20},
	38:{39:6,37:51,40:100},
	39:{60:32,50:7,38:6},
	40:{38:100,37:42,43:51},
	41:{42:39,43:43,37:26},
	42:{41:39,40:51},
	43:{41:43,5:11},
	44:{51:55,45:47,21:84},
	45:{46:41,4:6,44:47},
	46:{45:41},
	47:{1:10,23:10},
	48:{1:7},
	49:{32:21},
	50:{39:7,59:65,36:19},
	51:{53:18,44:55,52:20},
	52:{51:20,28:22,24:17},
	53:{30:12,9:23,51:18},
	54:{55:152,17:19},
	55:{18:68,54:152},
	56:{57:42,58:10,18:16},
	57:{56:42},
	58:{59:8,56:10},
	59:{50:65,58:8},
	60:{61:30,62:7,39:32},
	61:{64:88,8:87,60:30},
	62:{63:40,60:7},
	63:{62:40},
	64:{65:11,61:88,8:26},
	65:{66:25,64:11},
	66:{67:21,14:10,65:25},
	67:{66:21},
};
var graph=new Graph(roads);

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            			source: new ol.source.OSM()
          		})
       	],
		target: 'map',
		controls: ol.control.defaults({
        		attributionOptions:  ({
            			collapsible: false
          		})
        	}),
        	view: new ol.View({
	  		projection: 'EPSG:4326',
          		center: [-5.811029 , 35.786934],
          		zoom: 16
        	})
      	});
var me;
// getting the location of the device and giving it the view projection
	// Geolocation begins here
	var geolocation = new ol.Geolocation({
	        projection: 'EPSG:4326'
      	});
	geolocation.setTracking(true);
	var accuracyFeature = new ol.Feature();
      		geolocation.on('change:accuracyGeometry', function() {
        	accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      	});
	var positionFeature = new ol.Feature();
	positionFeature.setStyle(new ol.style.Style({
        	image: new ol.style.Circle({
          		radius: 6,
          		fill: new ol.style.Fill({
            			color: '#3399CC'
          		}),
          		stroke: new ol.style.Stroke({
            			color: '#fff',
            			width: 2
          		})
        	})
      	}));
	geolocation.on('change:position', function() {
        	var coordinates = geolocation.getPosition();
        	positionFeature.setGeometry(coordinates ?
            	new ol.geom.Point(coordinates) : null);
      	});
	geolocation.on('error', function(error) {
        	alert(error)
        	
      	});
	var myPosition=new ol.layer.Vector({
        			map: map,
        			source: new ol.source.Vector({
          				features: [accuracyFeature, positionFeature]
        			})
      			});
	// ends here

	
	 
	//here are the features with their sources and vector layers
	//var layers = new Object();
	//var sources =new Object();

	//the banks layer
	sources['bank']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/banks.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['bank']=new ol.layer.Vector({
     				title: 'banks',
      				source: sources['bank'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-bank.png'
        				}))
				})
  		});


	
	
	// the restaurants layer
	
	sources['restaurant']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/restaurants.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['restaurant']=new ol.layer.Vector({
     				title: 'restaurants',
      				source: sources['restaurant'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-restaurant.png'
        				}))
				})
  		});

	//the shops layer
	
	sources['shop']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/shops.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['shop']=new ol.layer.Vector({
     				title: 'shops',
      				source: sources['shop'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-shop.png'
        				}))
				})
  		});

	//historic sites layer
	
	sources['historic-site']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/historic-sites.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['historic-site']=new ol.layer.Vector({
     				title: 'historic sites',
      				source: sources['historic-site'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-historic-site.png'
        				}))
				})
  		});

	// hotel layers
	
	sources['hotel']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/hotels.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['hotel']=new ol.layer.Vector({
     				title: 'hotels',
      				source: sources['hotel'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-hotel.png'
        				}))
				})
  		});

	// art merchants layer

	sources['art-merchant']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/art-merchants.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['art-merchant']=new ol.layer.Vector({
     				title: 'art merchants',
      				source: sources['art-merchant'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-art-merchant.png'
        				}))
				})
  		});

	//bazars layer

	sources['souk']=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/souks.geojson',
					format: new ol.format.GeoJSON()
      					});
	layers['souk']=new ol.layer.Vector({
     				title: 'souks',
      				source: sources['souk'],
				style:new ol.style.Style({
        				image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          					anchor: [0.5, 0],
                            anchorOrigin: 'bottom-left',
          					anchorXUnits: 'fraction',
          					anchorYUnits: 'pixels',
          					src: 'images/marker-souk.png'
        				}))
				})
  		});
    vertices_source=new ol.source.Vector({
         				projection : 'EPSG:4326',
         				url: 'Maps/vertices.geojson',
					format: new ol.format.GeoJSON()
      					});
	vertices_layer=new ol.layer.Vector({
     				title: 'roads vertices',
      				source: vertices_source,
  		});
    
	//a point created just for tests it will serve as the user's position
	var iconFeature = new ol.Feature({
        	geometry: new ol.geom.Point([ -5.812625, 35.784429]),
	});

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0],
            anchorOrigin: 'bottom-left',
          	anchorXUnits: 'fraction',
          	anchorYUnits: 'pixels',
          	src: 'images/marker-my-position.png'
        }))
    });

    iconFeature.setStyle(iconStyle);

    var vectorSource = new ol.source.Vector({
        	features: [iconFeature]
    });

    me = new ol.layer.Vector({
        	source: vectorSource
    });

    var shortestPath=new ol.layer.Vector({
				title:'shortest path', 
				source: new ol.source.Vector(),
                style: new ol.style.Style({
    					fill: new ol.style.Fill({
      						color: 'rgba(255, 255, 255, 0.2)'
    						}),
    					stroke: new ol.style.Stroke({
      						color: '#737373',
      						width: 5
    						}),
    					image: new ol.style.Circle({
      						radius: 7,
      						fill: new ol.style.Fill({
        						color: '#ffcc33'
      							})
    						})
  					})
				});
    tours_source=new ol.source.Vector({
        projection : 'EPSG:4326',
        url: 'Maps/Tours.geojson',
		format: new ol.format.GeoJSON()
    });
    var tours_layer=new ol.layer.Vector({
				title:'guided tours', 
				source: tours_source,
                style: new ol.style.Style({
    					fill: new ol.style.Fill({
      						color: 'rgba(255, 255, 255, 0.2)'
    						}),
    					stroke: new ol.style.Stroke({
      						color: '#737373',
      						width: 2
    						}),
    					image: new ol.style.Circle({
      						radius: 7,
      						fill: new ol.style.Fill({
        						color: '#ffcc33'
      							})
    						})
  					})
				});
    tmp_source=new ol.source.Vector();
    tmp=new ol.layer.Vector({
				title:'temporary layer', 
				source: tmp_source
				});
    tmp_art_merchant_source=new ol.source.Vector();
    tmp_art_merchant=new ol.layer.Vector({
				title:'temporary art merchant layer', 
				source: tmp_art_merchant_source
				});
    tmp_souk_source=new ol.source.Vector();
    tmp_souk=new ol.layer.Vector({
				title:'temporary souk layer', 
				source: tmp_souk_source
				});
    tmp_historic_site_source=new ol.source.Vector();
    tmp_historic_site=new ol.layer.Vector({
				title:'temporary historic site layer', 
				source: tmp_historic_site_source
				});
    map.addLayer(tours_layer);
	map.addLayer(tmp);
    map.addLayer(tmp_historic_site);
    map.addLayer(tmp_souk);
    map.addLayer(tmp_art_merchant);
	map.addLayer(layers['bank']);
	map.addLayer(layers['restaurant']);
	map.addLayer(layers['shop']);
	map.addLayer(layers['historic-site']);
	map.addLayer(layers['hotel']);
	map.addLayer(layers['art-merchant']);
	map.addLayer(layers['souk']);
	map.addLayer(me);
	me.setVisible(true);
    map.addLayer(vertices_layer);
    map.addLayer(shortestPath);
    
    //tours_layer.setVisible(true);
    vertices_layer.setVisible(false);
    tours_layer.setVisible(false);
	//alert(sources['bank']);

/* global document */
jQuery(document).ready(function(){

	/* Hiding all the markers on the map. */
	for (var layer in layers) {
		layers[layer].setVisible(false);
	}
    
});

 function showlayer(sel) {
     shortestPath.setVisible(false);
     tours_layer.setVisible(false);
     tmp.setVisible(false);
     tmp_souk.setVisible(false);
     tmp_art_merchant.setVisible(false);
     tmp_historic_site.setVisible(false);
     for (var layer in layers) {
			layers[layer].setVisible(false);
		}
		/* Revealing markers from the corresponding group. */
		if(sel.value){
            layers[sel.value].setVisible(true);
        }
    }

 function showTour(sel) {
     shortestPath.setVisible(false);
     var nearestArtMerchants=[];
     var nearestSouks=[];
     var nearestHistoricSites=[];
     selectedTour=[];
     //var formatwkt = new ol.format.WKT();
     for (var layer in layers) {
			layers[layer].setVisible(false);
     }
     
     if(sel.value){
         tours_layer.setVisible(true);
         tours_layer.getSource().changed();
         
         tours_source.on('change', function(evt){
             var source=evt.target;
             if(source.getState() === 'ready'){
                source.forEachFeature(function(feature){
                    if(feature.get('ID')==sel.value){
                        selectedTour.push(feature);     
                    }
                });
                tmp_source=new ol.source.Vector({
                    features: selectedTour
                });
                tmp.setSource(tmp_source);
                tmp.setStyle(new ol.style.Style({
                    fill: new ol.style.Fill({
      			       color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#737373',
      		            width: 5
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
        				    color: '#ffcc33'})
                    })
  		        }));
                 tmp.setVisible(true);
                 map.getView().fit(tmp.getSource().getExtent(), map.getSize());
                 tours_layer.setVisible(false);
             }
         });

        var distance;
         layers['souk'].setVisible(true);
         layers['historic-site'].setVisible(true);
         layers['art-merchant'].setVisible(true);
         layers['souk'].getSource().changed();
         layers['historic-site'].getSource().changed();
         layers['art-merchant'].getSource().changed();
         sources['art-merchant'].on('change', function(evt){
             var source=evt.target;
             if(source.getState() === 'ready'){
                 source.forEachFeature(function(feature){
                     distance=wgs84Sphere.haversineDistance(selectedTour[0].getGeometry().getClosestPoint(feature.getGeometry().getFirstCoordinate()),feature.getGeometry().getFirstCoordinate());
                     if(distance<=40){
                         nearestArtMerchants.push(feature);
                     }
                 });
                 tmp_art_merchant_source=new ol.source.Vector({
                     features: nearestArtMerchants
                 });
                 tmp_art_merchant.setSource(tmp_art_merchant_source);
                 tmp_art_merchant.setStyle(layers['art-merchant'].getStyle());
                 tmp_art_merchant.setVisible(true);
                 layers['art-merchant'].setVisible(false);
             }
         });
         sources['souk'].on('change', function(evt){
             var source=evt.target;
             if(source.getState() === 'ready'){
                 source.forEachFeature(function(feature){
                     distance=wgs84Sphere.haversineDistance(selectedTour[0].getGeometry().getClosestPoint(feature.getGeometry().getFirstCoordinate()),feature.getGeometry().getFirstCoordinate());
                     if(distance<=40){
                         nearestSouks.push(feature);
                     }
                 });
                 tmp_souk_source=new ol.source.Vector({
                     features: nearestSouks
                 });
                 tmp_souk.setSource(tmp_souk_source);
                 tmp_souk.setStyle(layers['souk'].getStyle());
                 tmp_souk.setVisible(true);
                 layers['souk'].setVisible(false);
             }
         });
         sources['historic-site'].on('change', function(evt){
             var source=evt.target;
             if(source.getState() === 'ready'){
                 source.forEachFeature(function(feature){
                     distance=wgs84Sphere.haversineDistance(selectedTour[0].getGeometry().getClosestPoint(feature.getGeometry().getFirstCoordinate()),feature.getGeometry().getFirstCoordinate());
                     if(distance<=40){
                         nearestHistoricSites.push(feature);
                     }
                 });
                 tmp_historic_site_source=new ol.source.Vector({
                     features: nearestHistoricSites
                 });
                 tmp_historic_site.setSource(tmp_historic_site_source);
                 tmp_historic_site.setStyle(layers['historic-site'].getStyle());
                 tmp_historic_site.setVisible(true);
                 layers['historic-site'].setVisible(false);
             }
         });
         
        
        
    }
 }

	//display the result of the search by name
jQuery('#advanced-search').submit(function(event) {
	event.preventDefault();
	var Results=[];
    var coord;
    var distance;
    var category=jQuery('#category-selector-default').val();
    if (category){
		layers[category].setVisible(true);
		var src=layers[category].getSource();
		src.forEachFeature(function(feature) {
            coord=feature.getGeometry().getFirstCoordinate();
            distance = wgs84Sphere.haversineDistance([coord[0], coord[1]],iconFeature.getGeometry().getFirstCoordinate());
            if(Math.round(distance)<jQuery('#slider-distance').slider("option", "value")){
                console.log(feature.get('Name'));
               if(feature.get('Name').search($('#search-what').val())!=-1){
                    console.log("found it");
                    Results.push(feature);
			     }
            }
		});
        tmp_source=new ol.source.Vector({
        			features: Results
      				});
        tmp.setSource(tmp_source);
		tmp.setStyle(layers[category].getStyle());
        tmp.setVisible(true);
		layers[category].setVisible(false);
    }
    else
        alert('please select a category first !');
});
// popup code starts here
var popup = new ol.Overlay.Popup();
map.addOverlay(popup);

map.on('singleclick', function(evt) {
	popup.hide();
    popup.setOffset([0, 0]);
    
	 // Attempt to find a feature in one of the visible vector layers
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        //console.log(feature.get('Name'));
        if(layer!=me){
            return feature;
        }
    });
    selectedFeature=feature;
    if (feature) {
        $("#description").text(feature.get('Name'));
        $("#img1").attr('src', feature.get('image1'));
        $("#img2").attr('src', feature.get('image2'));
        $("#img3").attr('src', feature.get('image3'));
        $("#likes").text(feature.get('likes'));
        $("#dislikes").text(feature.get('dislikes'));
        $('#slideshow').toggle('slow', function() {
        // Animation complete.
        });
        /*var coord = feature.getGeometry().getCoordinates();
        var props = feature.getProperties();
       //console.log(feature.get('Name'));
        var info =  props.Name+" <input type='button' id='popupButton' value='"+feature.get('id')+"' />" ;
        // Offset the popup so it points at the middle of the marker not the tip
        popup.setOffset([0, -22]);
        popup.show(coord, info);*/
		
   
    }
});

$("#like").click(function(){
    var likes=$("#likes").text();
    console.log(likes);
    $("#likes").text(likes);
});
$("#dislike").click(function(){
    var dislikes=$("#dislikes").text();
    console.log(dislikes);
    $("#dislikes").text(dislikes);
});
$("#getHere").click(function(){
    var feature=selectedFeature;
       $('#slideshow').toggle('slow', function() {
        // Animation complete.
        });
       vertices_layer.setVisible(true);
       shortestPath.setVisible(false);
       //console.log(feature.get('Name'));
       vertices_layer.getSource().changed();
       vertices_source.on('change', function(evt){
            var source=evt.target;
            if(source.getState() === 'ready'){
                //console.log(feature.get('Name'));
               var shortestPathVertices=[];
                var i=0;
               shortestPathVertices[0]=iconFeature.getGeometry().getFirstCoordinate();
                var ids=graph.findShortestPath(nearest_feature(iconFeature),nearest_feature(feature));
                ids.forEach(function(id){
                    i++;
                   source.forEachFeature(function(feature){
                      if(feature.get('id')==id){
                          shortestPathVertices[i]=feature.getGeometry().getFirstCoordinate();
                      } 
                   }); 
                });
                shortestPathVertices[i+1]=feature.getGeometry().getFirstCoordinate();
                shortestPath.setSource(new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.LineString(shortestPathVertices, 'XY')
                    })]
                }));
                shortestPath.setVisible(true);
                map.getView().fit(shortestPath.getSource().getExtent(), map.getSize());
                vertices_layer.setVisible(false);
                }
        });
       
   });
// end of popup code
//routing code starts here
//first we need to get the closest vertices to our position
function nearest_feature(pos) {
            return vertices_source.getClosestFeatureToCoordinate(pos.getGeometry().getFirstCoordinate()).get('id');
 }
var select = new ol.interaction.Select({
    layers: [me]
    });
map.addInteraction(select);
// setting location code starts here
var modify = new ol.interaction.Modify({
  features: select.getFeatures()
});
map.addInteraction(modify);

jQuery("#closeSlideshow").click(function(){
    $('#slideshow').toggle('slow', function() {
        // Animation complete.
        });
});