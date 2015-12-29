var TIME_WIDTH = 180*1000;

function sample_ts(now){
    var tsdata = [];
    for(var i = 0; i < TIME_WIDTH/1000; i++){
	var timestamp = (now-TIME_WIDTH) + i*1000;
	var value = Math.sin(i*Math.PI/20);
	tsdata.push({ timestamp: timestamp, value: value, ts_delta: now-timestamp });
    }
    //return { name: "tsdata", values: tsdata };
    return tsdata;
}

function plot_ts(data, targetId){
    var margin = { top: 10, bottom: 50, right: 10, left: 50 };
 
    var elm = document.getElementById(targetId);
    var width = elm.offsetWidth - margin.left - margin.right;
    var height = elm.offsetHeight - margin.top - margin.bottom;
    var now = new Date().getTime();

    var x = d3.time.scale()
	.range([0, width]);
    var y = d3.scale.linear()
	.range([height, 0]);

    var xaxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");
    var yaxis = d3.svg.axis()
	.scale(y)
	.orient("left");

    x.domain([now-TIME_WIDTH, now]);
    y.domain([-2, 2]);

    var line = d3.svg.line()
	.x(function(d) { return x(d.timestamp) })
	.y(function(d) { return y(d.value) });

    var markdata = data.filter(function(d){ if("mark" in d) { return d.mark }  return false; });
    console.log("markdata", markdata);
    console.log("data", data);
    
    var first = markdata[0];
    var last = markdata[2];
    var first_x = x(first.timestamp);
    var first_y = y(first.value);
    var last_x = x(last.timestamp);
    var last_y = y(last.value);
    var center_x = (first_x+last_x)/2;
    var center_y = (first_y+last_y)/2;
    var long_r = Math.sqrt((first_x-last_x)*(first_x-last_x)+(first_y-last_y)*(first_y-last_y))/2;
    var short_r = 5;

  
    var theta = Math.asin((last_y-center_y)/long_r);
    var deg = 90*theta/(Math.PI/2);
    
    d3.select(elm).selectAll("*").remove();
    var svg = d3.select(elm)
	.append("svg")
    	.attr("class", "plot")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate("+margin.left+","+margin.top+")");

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xaxis);

    svg.append("g")
	.attr("class", "y axis")
	.call(yaxis);

    svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);
    svg.selectAll("circle")
	.data(data)
	.enter()
        .append("svg:circle")
	.attr("cx", function(d) {return x(d.timestamp);})
	.attr("cy", function(d) {return y(d.value);})
	.attr("r", 3)
	.attr("fill", "#000")
	.append("svg:title")
	.text(function(d) { return d.ts_delta +" "+d.value; });

    svg.append("ellipse")
    	.attr("cx", center_x)
    	.attr("cy", center_y)
    	.attr("rx", long_r)
    	.attr("ry", short_r)
    	.style("fill", "none")
    	.style("stroke", "red")
    	.style("stroke-width", "2px");
}
