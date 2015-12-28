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

function plot_ts(targetId){
    var margin = { top: 10, bottom: 50, right: 10, left: 50 };

    var now = new Date().getTime();
    var data = sample_ts(now);
    
    var elm = document.getElementById(targetId);
    var width = elm.offsetWidth - margin.left - margin.right;
    var height = elm.offsetHeight - margin.top - margin.bottom;

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

    var svg = d3.select(elm)
	.append("svg")
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

    console.log("data", data);
    
    svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);
}
