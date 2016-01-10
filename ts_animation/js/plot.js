var TIME_WIDTH = 180*1000;
var IMAGE_PATH = "image/Ghostscript_Tiger.svg";

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
    var circle_r = 3;
    
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
    console.log("theta, deg", theta, deg);
    
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

    var rect_width = 10;
    var rect_height = height;   

    var rectdata = data.filter(function(d){ if("rect" in d) { return d.rect } return false; });
    svg.selectAll(".bgrect")
	.data(rectdata)
	.enter()
	.append("svg:rect")
    	.attr("class", "bgrect")
	.attr("x", function(d) { return x(d.timestamp); })
	.attr("y", 0)
	.attr("width", rect_width)
	.attr("height", rect_height)
	.style("fill", "pink");
    
    svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);
    
    // svg.selectAll("circle")
    // 	.data(data)
    // 	.enter()
    //     .append("svg:circle")
    // 	.attr("cx", function(d) {return x(d.timestamp);})
    // 	.attr("cy", function(d) {return y(d.value);})
    // 	.attr("r", circle_r)
    // 	.attr("fill", "#000")
    // 	.append("svg:title")
    // 	.text(function(d) { return d.ts_delta +" "+d.value + " " + d.mark; });

    var imagedata = data.filter(function(d){ if("image" in d) { return d.image } return false; });
    var image_width = 30;
    var image_height = 30;
   
    svg.selectAll("image")
	.data(imagedata)
	.enter()
	.append("svg:image")
	.attr("xlink:href", IMAGE_PATH)
	.attr("x", function(d) { return x(d.timestamp)-image_width/2; })
	.attr("y", function(d) { return y(d.value)-image_height/2; })
	.attr("width", "30")
	.attr("height", "30");

    svg.append("ellipse")
    	.attr("transform", "translate("+center_x+","+center_y+") rotate("+deg+")")
    	.attr("rx", long_r+2*circle_r)
    	.attr("ry", short_r)
    	.style("fill", "none")
    	.style("stroke", "red")
    	.style("stroke-width", "2px");
}
