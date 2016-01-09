var animate = false;

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

var h = location.hash;
if(h != null && h != ""){
    animate = (h == "#animate");
}
var start = new Date().getTime();
var data = sample_ts(start);
var peek_count = 0;
var i = 0;
for(; i < data.length; i++){
    data[i].mark = false;
    data[i].image = false;
    
    if(data[i].value > 0.8){
        data[i].mark = true;
    }
    else if(Math.abs(data[i].value) < 0.01){
	data[i].image = true;
    }
}

if(animate){

    $(function(){
	setInterval(function() {
	    var now = new Date().getTime();
	    
	    var peek_count = 0;
	    //var value = Math.cos((now-start)*Math.PI/30);
	    var value = Math.sin(i*Math.PI/20);
	    i++;
	    var mark = false;
	    if(value > 0.8){
		mark = true;
	    }
	    var row = {timestamp: now, value: value, mark: mark };
	    data.push(row);
	    plot_ts(data, "chart");
	}, 2000);
    })
}
else {
    plot_ts(data, "chart");
}
