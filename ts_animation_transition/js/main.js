var animate = false;

function sample_ts(now){
    var tsdata = [];
    for(var i = 0; i < TIME_WIDTH/1000; i++){
	var timestamp = (now-TIME_WIDTH) + i*1000;
	var value = Math.sin(i*Math.PI/20);
	tsdata.push({ timestamp: timestamp, value: value, ts_delta: now-timestamp });
    }
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
    data[i].rect = false;
    
    if(data[i].value > 0.8){
        data[i].mark = true;
    }
    else if(Math.abs(data[i].value) < 0.01){
	data[i].image = true;
    }
    if(Math.abs(Math.abs(data[i].value)-1) < 0.01){
	data[i].rect = true;
    }
}
console.log("data", data);

var update_ts = plot_ts(data, "chart");
$(function(){
    setInterval(function() {
	var now = new Date().getTime();
	
	var peek_count = 0;
	//var value = Math.cos((now-start)*Math.PI/30);
	var value = Math.sin(i*Math.PI/20);
	i++;
	var row = {timestamp: now,
		   value: value,
		       mark: false,
		   image: false,
		   rect: false };
	if(row.value > 0.8){
	    row.mark = true;
	}
	else if(Math.abs(row.value) < 0.01){
	    row.image = true;
	}
	if(Math.abs(Math.abs(row.value)-1) < 0.01){
	    row.rect = true;
	}
	data.push(row);
	//plot_ts(data, "chart");
	update_ts();
    }, 2000);
});
