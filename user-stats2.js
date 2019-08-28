function tribulate() {
    //for(var i=0; i<POPULATION_SIZE; i++) {
    for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
      population[i] = randomIndivial(points.length);
    }	
  }
  function selection() {
    var parents = new Array();
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());
  
    setRoulette();
    for(var i=initnum; i<POPULATION_SIZE; i++) {
      parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
  }
  function crossover() {
    var queue = new Array();
    for(var i=0; i<POPULATION_SIZE; i++) {
      if( Math.random() < CROSSOVER_PROBABILITY ) {
        queue.push(i);
      }
    } 
    queue.shuffle();
    for(var i=0, j=queue.length-1; i<j; i+=2) {
      doCrossover(queue[i], queue[i+1]);
      //oxCrossover(queue[i], queue[i+1]);
    }
  }
  //function oxCrossover(x, y) {	
  //  //var px = population[x].roll();
  //  //var py = population[y].roll();
  //  var px = population[x].slice(0);
  //  var py = population[y].slice(0);
  
  //  var rand = randomNumber(points.length-1) + 1;
  //  var pre_x = px.slice(0, rand);
  //  var pre_y = py.slice(0, rand);
  
  //  var tail_x = px.slice(rand, px.length);
  //  var tail_y = py.slice(rand, py.length);
  
  //  px = tail_x.concat(pre_x);
  //  py = tail_y.concat(pre_y);
  
  //  population[x] = pre_y.concat(px.reject(pre_y));
  //  population[y] = pre_x.concat(py.reject(pre_x));
  //}
  function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
  }
  function getChild(fun, x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
      dx = px[fun](px.indexOf(c));
      dy = py[fun](py.indexOf(c));
      px.deleteByValue(c);
      py.deleteByValue(c);
      c = dis[c][dx] < dis[c][dy] ? dx : dy;
      solution.push(c);
    }
    return solution;
  }
  function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
      if(Math.random() < MUTATION_PROBABILITY) {
        if(Math.random() > 0.5) {
          population[i] = pushMutate(population[i]);
        } else {
          population[i] = doMutate(population[i]);
        }
        i--;
      }
    }
  }
  function preciseMutate(orseq) {  
    var seq = orseq.clone();
    if(Math.random() > 0.5){
      seq.reverse();
    }
    var bestv = evaluate(seq);
    for(var i=0; i<(seq.length>>1); i++) {
      for(var j=i+2; j<seq.length-1; j++) {
        var new_seq = swap_seq(seq, i,i+1,j,j+1);
        var v = evaluate(new_seq);
        if(v < bestv) {bestv = v, seq = new_seq; };
      }
    }
    //alert(bestv);
    return seq;
  }
  function preciseMutate1(orseq) {  
    var seq = orseq.clone();
    var bestv = evaluate(seq);
  
    for(var i=0; i<seq.length-1; i++) {
      var new_seq = seq.clone();
      new_seq.swap(i, i+1);
      var v = evaluate(new_seq);
      if(v < bestv) {bestv = v, seq = new_seq; };
    }
    //alert(bestv);
    return seq;
  }
  function swap_seq(seq, p0, p1, q0, q1) {
    var seq1 = seq.slice(0, p0);
    var seq2 = seq.slice(p1+1, q1);
    seq2.push(seq[p0]);
    seq2.push(seq[p1]);
    var seq3 = seq.slice(q1, seq.length);
    return seq1.concat(seq2).concat(seq3);
  }
  function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    do {
      m = randomNumber(seq.length - 2);
      n = randomNumber(seq.length);
    } while (m>=n)
  
      for(var i=0, j=(n-m+1)>>1; i<j; i++) {
        seq.swap(m+i, n-i);
      }
      return seq;
  }
  function pushMutate(seq) {
    mutationTimes++;
    var m,n;
    do {
      m = randomNumber(seq.length>>1);
      n = randomNumber(seq.length);
    } while (m>=n)
  
    var s1 = seq.slice(0,m);
    var s2 = seq.slice(m,n);
    var s3 = seq.slice(n,seq.length);
    return s2.concat(s1).concat(s3).clone();
  }
  function setBestValue() {
    for(var i=0; i<population.length; i++) {
      values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if(bestValue === undefined || bestValue > currentBest.bestValue) {
      best = population[currentBest.bestPosition].clone();
      bestValue = currentBest.bestValue;
      UNCHANGED_GENS = 0;
    } else {
      UNCHANGED_GENS += 1;
    }
  }
  function getCurrentBest() {
    var bestP = 0,
    currentBestValue = values[0];
  
    for(var i=1; i<population.length; i++) {
      if(values[i] < currentBestValue) {
        currentBestValue = values[i];
        bestP = i;
      }
    }
    return {
      bestPosition : bestP
      , bestValue    : currentBestValue
    }
  }
  function setRoulette() {
    //calculate all the fitness
    for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
    //set the roulette
    var sum = 0;
    for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
    for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
    for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
  }
  function wheelOut(rand) {
    var i;
    for(i=0; i<roulette.length; i++) {
      if( rand <= roulette[i] ) {
        return i;
      }
    }
  }
  function randomIndivial(n) {
    var a = [];
    for(var i=0; i<n; i++) {
      a.push(i);
    }
    return a.shuffle();
  }
  function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for(var i=1; i<indivial.length; i++) {
      sum += dis[indivial[i]][indivial[i-1]];
    }
    return sum;
  }
  function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for(var i=0; i<length; i++) {
      dis[i] = new Array(length);
      for(var j=0; j<length; j++) {
        dis[i][j] = ~~distance(points[i], points[j]); 
      }
    }
  }
  function tribulate() {
    //for(var i=0; i<POPULATION_SIZE; i++) {
    for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
      population[i] = randomIndivial(points.length);
    }	
  }
  function selection() {
    var parents = new Array();
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());
  
    setRoulette();
    for(var i=initnum; i<POPULATION_SIZE; i++) {
      parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
  }
  function crossover() {
    var queue = new Array();
    for(var i=0; i<POPULATION_SIZE; i++) {
      if( Math.random() < CROSSOVER_PROBABILITY ) {
        queue.push(i);
      }
    } 
    queue.shuffle();
    for(var i=0, j=queue.length-1; i<j; i+=2) {
      doCrossover(queue[i], queue[i+1]);
      //oxCrossover(queue[i], queue[i+1]);
    }
  }
  //function oxCrossover(x, y) {	
  //  //var px = population[x].roll();
  //  //var py = population[y].roll();
  //  var px = population[x].slice(0);
  //  var py = population[y].slice(0);
  
  //  var rand = randomNumber(points.length-1) + 1;
  //  var pre_x = px.slice(0, rand);
  //  var pre_y = py.slice(0, rand);
  
  //  var tail_x = px.slice(rand, px.length);
  //  var tail_y = py.slice(rand, py.length);
  
  //  px = tail_x.concat(pre_x);
  //  py = tail_y.concat(pre_y);
  
  //  population[x] = pre_y.concat(px.reject(pre_y));
  //  population[y] = pre_x.concat(py.reject(pre_x));
  //}
  function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
  }
  function getChild(fun, x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
      dx = px[fun](px.indexOf(c));
      dy = py[fun](py.indexOf(c));
      px.deleteByValue(c);
      py.deleteByValue(c);
      c = dis[c][dx] < dis[c][dy] ? dx : dy;
      solution.push(c);
    }
    return solution;
  }
  function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
      if(Math.random() < MUTATION_PROBABILITY) {
        if(Math.random() > 0.5) {
          population[i] = pushMutate(population[i]);
        } else {
          population[i] = doMutate(population[i]);
        }
        i--;
      }
    }
  }
  function preciseMutate(orseq) {  
    var seq = orseq.clone();
    if(Math.random() > 0.5){
      seq.reverse();
    }
    var bestv = evaluate(seq);
    for(var i=0; i<(seq.length>>1); i++) {
      for(var j=i+2; j<seq.length-1; j++) {
        var new_seq = swap_seq(seq, i,i+1,j,j+1);
        var v = evaluate(new_seq);
        if(v < bestv) {bestv = v, seq = new_seq; };
      }
    }
    //alert(bestv);
    return seq;
  }
  function preciseMutate1(orseq) {  
    var seq = orseq.clone();
    var bestv = evaluate(seq);
  
    for(var i=0; i<seq.length-1; i++) {
      var new_seq = seq.clone();
      new_seq.swap(i, i+1);
      var v = evaluate(new_seq);
      if(v < bestv) {bestv = v, seq = new_seq; };
    }
    //alert(bestv);
    return seq;
  }
  function swap_seq(seq, p0, p1, q0, q1) {
    var seq1 = seq.slice(0, p0);
    var seq2 = seq.slice(p1+1, q1);
    seq2.push(seq[p0]);
    seq2.push(seq[p1]);
    var seq3 = seq.slice(q1, seq.length);
    return seq1.concat(seq2).concat(seq3);
  }
  function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    do {
      m = randomNumber(seq.length - 2);
      n = randomNumber(seq.length);
    } while (m>=n)
  
      for(var i=0, j=(n-m+1)>>1; i<j; i++) {
        seq.swap(m+i, n-i);
      }
      return seq;
  }
  function pushMutate(seq) {
    mutationTimes++;
    var m,n;
    do {
      m = randomNumber(seq.length>>1);
      n = randomNumber(seq.length);
    } while (m>=n)
  
    var s1 = seq.slice(0,m);
    var s2 = seq.slice(m,n);
    var s3 = seq.slice(n,seq.length);
    return s2.concat(s1).concat(s3).clone();
  }
  function setBestValue() {
    for(var i=0; i<population.length; i++) {
      values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if(bestValue === undefined || bestValue > currentBest.bestValue) {
      best = population[currentBest.bestPosition].clone();
      bestValue = currentBest.bestValue;
      UNCHANGED_GENS = 0;
    } else {
      UNCHANGED_GENS += 1;
    }
  }
  function getCurrentBest() {
    var bestP = 0,
    currentBestValue = values[0];
  
    for(var i=1; i<population.length; i++) {
      if(values[i] < currentBestValue) {
        currentBestValue = values[i];
        bestP = i;
      }
    }
    return {
      bestPosition : bestP
      , bestValue    : currentBestValue
    }
  }
  function setRoulette() {
    //calculate all the fitness
    for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
    //set the roulette
    var sum = 0;
    for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
    for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
    for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
  }
  function wheelOut(rand) {
    var i;
    for(i=0; i<roulette.length; i++) {
      if( rand <= roulette[i] ) {
        return i;
      }
    }
  }
  function randomIndivial(n) {
    var a = [];
    for(var i=0; i<n; i++) {
      a.push(i);
    }
    return a.shuffle();
  }
  function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for(var i=1; i<indivial.length; i++) {
      sum += dis[indivial[i]][indivial[i-1]];
    }
    return sum;
  }
  function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for(var i=0; i<length; i++) {
      dis[i] = new Array(length);
      for(var j=0; j<length; j++) {
        dis[i][j] = ~~distance(points[i], points[j]); 
      }
    }
  }
  var esrimap;
  var  esriftn=require([
          "esri/map", "esri/layers/FeatureLayer", 
          "esri/tasks/query", "esri/geometry/Polygon", "esri/geometry/Circle","esri/geometry/webMercatorUtils", 
          "esri/graphic", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
          "esri/config", "esri/Color", "dojo/dom", "dojo/domReady!"
        ], function(
          Map, FeatureLayer,
          Query,Polygon, Circle,webMercatorUtils,
          Graphic, InfoTemplate, SimpleMarkerSymbol,
          SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer,
          esriConfig, Color, dom
        ) {
          // use a proxy page if a URL generated by this page is greater than 2000 characters
          //
          // this should not be needed as nearly all query & select functions are performed on the client
          esriConfig.defaults.io.proxyUrl = "/proxy";
  
  
              
          var circleSymb = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
              new Color([105, 105, 105]),
              2
            ), new Color([255, 255, 0, 0.25])
          );
          var circle;
  
            
              var myFunctions = dojo.getObject('myFunctions', true);
              myFunctions.ftn_findpop1 = function(lat,lng,radiusm) {
                      
              
              circle = new Circle({
              center: [lng,lat],
              geodesic: true,
              radius: radiusm/1000,
              radiusUnit: "esriKilometers"
                    }); 
                    
                    var newring = new Array();
  
                  
                  for(var i = 0; i < circle.rings[0].length; i += 2)
                  {  // take every second element
                  
      
                      var newpoint = [];
                      newpoint.push(circle.rings[0][i][0].toFixed(4));
                      newpoint.push(circle.rings[0][i][1].toFixed(4));
                      
                      newring.push(newpoint); 
                  }
  
                  ftn_findpopradiusring(newring);
          
            };
            
  function errorHandling(err)
  {
      document.getElementById("div_output").innerHTML="<font color='red'>Error estimating population. Most often, this is because your radius is too small to process.</font>";
      //console.log("EE" + err);
  }     
   
  function ftn_findpopradiusring(ring) 
  {
             var gp = new esri.tasks.Geoprocessor("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer/PopulationSummary");
          gp.setOutputSpatialReference({wkid:102100}); 
          dojo.connect(gp, "onExecuteComplete", displayResults);
          dojo.connect(gp, "onError", errorHandling);
          
          var polygon = new esri.geometry.Polygon(new esri.SpatialReference({wkid:4326}));		
          polygon.addRing(ring);
          
          
          var symbol = new esri.symbol.SimpleFillSymbol("none", new esri.symbol.SimpleLineSymbol("dashdot", new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25]));
          var graphic = new esri.Graphic(polygon,symbol);
  
          var features= [];
          features.push(graphic);
  
          var featureSet = new esri.tasks.FeatureSet();
          featureSet.features = features;
          
          var params = { "inputPoly":featureSet };
          gp.execute(params);
        }
  
       });  
  function tribulate() {
    //for(var i=0; i<POPULATION_SIZE; i++) {
    for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
      population[i] = randomIndivial(points.length);
    }	
  }
  function selection() {
    var parents = new Array();
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());
  
    setRoulette();
    for(var i=initnum; i<POPULATION_SIZE; i++) {
      parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
  }
  function crossover() {
    var queue = new Array();
    for(var i=0; i<POPULATION_SIZE; i++) {
      if( Math.random() < CROSSOVER_PROBABILITY ) {
        queue.push(i);
      }
    } 
    queue.shuffle();
    for(var i=0, j=queue.length-1; i<j; i+=2) {
      doCrossover(queue[i], queue[i+1]);
      //oxCrossover(queue[i], queue[i+1]);
    }
  }
  //function oxCrossover(x, y) {	
  //  //var px = population[x].roll();
  //  //var py = population[y].roll();
  //  var px = population[x].slice(0);
  //  var py = population[y].slice(0);
  
  //  var rand = randomNumber(points.length-1) + 1;
  //  var pre_x = px.slice(0, rand);
  //  var pre_y = py.slice(0, rand);
  
  //  var tail_x = px.slice(rand, px.length);
  //  var tail_y = py.slice(rand, py.length);
  
  //  px = tail_x.concat(pre_x);
  //  py = tail_y.concat(pre_y);
  
  //  population[x] = pre_y.concat(px.reject(pre_y));
  //  population[y] = pre_x.concat(py.reject(pre_x));
  //}
  function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
  }
  function getChild(fun, x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
      dx = px[fun](px.indexOf(c));
      dy = py[fun](py.indexOf(c));
      px.deleteByValue(c);
      py.deleteByValue(c);
      c = dis[c][dx] < dis[c][dy] ? dx : dy;
      solution.push(c);
    }
    return solution;
  }
  function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
      if(Math.random() < MUTATION_PROBABILITY) {
        if(Math.random() > 0.5) {
          population[i] = pushMutate(population[i]);
        } else {
          population[i] = doMutate(population[i]);
        }
        i--;
      }
    }
  }
  function preciseMutate(orseq) {  
    var seq = orseq.clone();
    if(Math.random() > 0.5){
      seq.reverse();
    }
    var bestv = evaluate(seq);
    for(var i=0; i<(seq.length>>1); i++) {
      for(var j=i+2; j<seq.length-1; j++) {
        var new_seq = swap_seq(seq, i,i+1,j,j+1);
        var v = evaluate(new_seq);
        if(v < bestv) {bestv = v, seq = new_seq; };
      }
    }
    //alert(bestv);
    return seq;
  }
  function preciseMutate1(orseq) {  
    var seq = orseq.clone();
    var bestv = evaluate(seq);
  
    for(var i=0; i<seq.length-1; i++) {
      var new_seq = seq.clone();
      new_seq.swap(i, i+1);
      var v = evaluate(new_seq);
      if(v < bestv) {bestv = v, seq = new_seq; };
    }
    //alert(bestv);
    return seq;
  }
  function swap_seq(seq, p0, p1, q0, q1) {
    var seq1 = seq.slice(0, p0);
    var seq2 = seq.slice(p1+1, q1);
    seq2.push(seq[p0]);
    seq2.push(seq[p1]);
    var seq3 = seq.slice(q1, seq.length);
    return seq1.concat(seq2).concat(seq3);
  }
  function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    do {
      m = randomNumber(seq.length - 2);
      n = randomNumber(seq.length);
    } while (m>=n)
  
      for(var i=0, j=(n-m+1)>>1; i<j; i++) {
        seq.swap(m+i, n-i);
      }
      return seq;
  }
  function pushMutate(seq) {
    mutationTimes++;
    var m,n;
    do {
      m = randomNumber(seq.length>>1);
      n = randomNumber(seq.length);
    } while (m>=n)
  
    var s1 = seq.slice(0,m);
    var s2 = seq.slice(m,n);
    var s3 = seq.slice(n,seq.length);
    return s2.concat(s1).concat(s3).clone();
  }
  function setBestValue() {
    for(var i=0; i<population.length; i++) {
      values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if(bestValue === undefined || bestValue > currentBest.bestValue) {
      best = population[currentBest.bestPosition].clone();
      bestValue = currentBest.bestValue;
      UNCHANGED_GENS = 0;
    } else {
      UNCHANGED_GENS += 1;
    }
  }
  function getCurrentBest() {
    var bestP = 0,
    currentBestValue = values[0];
  
    for(var i=1; i<population.length; i++) {
      if(values[i] < currentBestValue) {
        currentBestValue = values[i];
        bestP = i;
      }
    }
    return {
      bestPosition : bestP
      , bestValue    : currentBestValue
    }
  }
  function setRoulette() {
    //calculate all the fitness
    for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
    //set the roulette
    var sum = 0;
    for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
    for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
    for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
  }
  function wheelOut(rand) {
    var i;
    for(i=0; i<roulette.length; i++) {
      if( rand <= roulette[i] ) {
        return i;
      }
    }
  }
  function randomIndivial(n) {
    var a = [];
    for(var i=0; i<n; i++) {
      a.push(i);
    }
    return a.shuffle();
  }
  function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for(var i=1; i<indivial.length; i++) {
      sum += dis[indivial[i]][indivial[i-1]];
    }
    return sum;
  }
  function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for(var i=0; i<length; i++) {
      dis[i] = new Array(length);
      for(var j=0; j<length; j++) {
        dis[i][j] = ~~distance(points[i], points[j]); 
      }
    }
  }
  function tribulate() {
    //for(var i=0; i<POPULATION_SIZE; i++) {
    for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
      population[i] = randomIndivial(points.length);
    }	
  }
  function selection() {
    var parents = new Array();
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());
  
    setRoulette();
    for(var i=initnum; i<POPULATION_SIZE; i++) {
      parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
  }
  function crossover() {
    var queue = new Array();
    for(var i=0; i<POPULATION_SIZE; i++) {
      if( Math.random() < CROSSOVER_PROBABILITY ) {
        queue.push(i);
      }
    } 
    queue.shuffle();
    for(var i=0, j=queue.length-1; i<j; i+=2) {
      doCrossover(queue[i], queue[i+1]);
      //oxCrossover(queue[i], queue[i+1]);
    }
  }
  //function oxCrossover(x, y) {	
  //  //var px = population[x].roll();
  //  //var py = population[y].roll();
  //  var px = population[x].slice(0);
  //  var py = population[y].slice(0);
  
  //  var rand = randomNumber(points.length-1) + 1;
  //  var pre_x = px.slice(0, rand);
  //  var pre_y = py.slice(0, rand);
  
  //  var tail_x = px.slice(rand, px.length);
  //  var tail_y = py.slice(rand, py.length);
  
  //  px = tail_x.concat(pre_x);
  //  py = tail_y.concat(pre_y);
  
  //  population[x] = pre_y.concat(px.reject(pre_y));
  //  population[y] = pre_x.concat(py.reject(pre_x));
  //}
  function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
  }
  function getChild(fun, x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
      dx = px[fun](px.indexOf(c));
      dy = py[fun](py.indexOf(c));
      px.deleteByValue(c);
      py.deleteByValue(c);
      c = dis[c][dx] < dis[c][dy] ? dx : dy;
      solution.push(c);
    }
    return solution;
  }
  function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
      if(Math.random() < MUTATION_PROBABILITY) {
        if(Math.random() > 0.5) {
          population[i] = pushMutate(population[i]);
        } else {
          population[i] = doMutate(population[i]);
        }
        i--;
      }
    }
  }
  function preciseMutate(orseq) {  
    var seq = orseq.clone();
    if(Math.random() > 0.5){
      seq.reverse();
    }
    var bestv = evaluate(seq);
    for(var i=0; i<(seq.length>>1); i++) {
      for(var j=i+2; j<seq.length-1; j++) {
        var new_seq = swap_seq(seq, i,i+1,j,j+1);
        var v = evaluate(new_seq);
        if(v < bestv) {bestv = v, seq = new_seq; };
      }
    }
    //alert(bestv);
    return seq;
  }
  function preciseMutate1(orseq) {  
    var seq = orseq.clone();
    var bestv = evaluate(seq);
  
    for(var i=0; i<seq.length-1; i++) {
      var new_seq = seq.clone();
      new_seq.swap(i, i+1);
      var v = evaluate(new_seq);
      if(v < bestv) {bestv = v, seq = new_seq; };
    }
    //alert(bestv);
    return seq;
  }
  function swap_seq(seq, p0, p1, q0, q1) {
    var seq1 = seq.slice(0, p0);
    var seq2 = seq.slice(p1+1, q1);
    seq2.push(seq[p0]);
    seq2.push(seq[p1]);
    var seq3 = seq.slice(q1, seq.length);
    return seq1.concat(seq2).concat(seq3);
  }
  function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    do {
      m = randomNumber(seq.length - 2);
      n = randomNumber(seq.length);
    } while (m>=n)
  
      for(var i=0, j=(n-m+1)>>1; i<j; i++) {
        seq.swap(m+i, n-i);
      }
      return seq;
  }
  function pushMutate(seq) {
    mutationTimes++;
    var m,n;
    do {
      m = randomNumber(seq.length>>1);
      n = randomNumber(seq.length);
    } while (m>=n)
  
    var s1 = seq.slice(0,m);
    var s2 = seq.slice(m,n);
    var s3 = seq.slice(n,seq.length);
    return s2.concat(s1).concat(s3).clone();
  }
  function setBestValue() {
    for(var i=0; i<population.length; i++) {
      values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if(bestValue === undefined || bestValue > currentBest.bestValue) {
      best = population[currentBest.bestPosition].clone();
      bestValue = currentBest.bestValue;
      UNCHANGED_GENS = 0;
    } else {
      UNCHANGED_GENS += 1;
    }
  }
  function getCurrentBest() {
    var bestP = 0,
    currentBestValue = values[0];
  
    for(var i=1; i<population.length; i++) {
      if(values[i] < currentBestValue) {
        currentBestValue = values[i];
        bestP = i;
      }
    }
    return {
      bestPosition : bestP
      , bestValue    : currentBestValue
    }
  }
  function setRoulette() {
    //calculate all the fitness
    for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
    //set the roulette
    var sum = 0;
    for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
    for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
    for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
  }
  function wheelOut(rand) {
    var i;
    for(i=0; i<roulette.length; i++) {
      if( rand <= roulette[i] ) {
        return i;
      }
    }
  }
  function randomIndivial(n) {
    var a = [];
    for(var i=0; i<n; i++) {
      a.push(i);
    }
    return a.shuffle();
  }
  function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for(var i=1; i<indivial.length; i++) {
      sum += dis[indivial[i]][indivial[i-1]];
    }
    return sum;
  }
  function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for(var i=0; i<length; i++) {
      dis[i] = new Array(length);
      for(var j=0; j<length; j++) {
        dis[i][j] = ~~distance(points[i], points[j]); 
      }
    }
  }