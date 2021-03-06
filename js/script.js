function getData() {
	$.ajax({
	  type: "GET",
	  url: "budget_app_2014.json",
	  dataType: "jsonp",
	  success: function(data) {
	  	budget_data = data;
	  	getDepartments();
  }
});
}

// function init() {
//   Tabletop.init( { 
//   	key: '0ArcRX35HpjojdHNKLXRmWDM1a1JsaVJpc0ZGN252Ync',
//     callback: function(input, tabletop) { 
//     	budget_data = input;
//     	getDepartments();
//     },
//     simpleSheet: true } )	
// }

function commaSeparateNumber(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
 }

// process data from spreadsheet into simpler arrays
var budget_total = 8482636000;
var budget_data;
var all_departments = [];
var departments = [];
var deptdetails = [];
function getDepartments() {
	for (var i = 0; i < budget_data.length; i++) {
		all_departments.push(budget_data[i].dept);
	};
	var uniques = _.uniq(all_departments);
	for (var i = 0; i < uniques.length; i++) {
		departments.push({'name': uniques[i]});
		deptdetails.push([uniques[i]]);
	}
	for (var i = 0; i < departments.length; i++) {
		departments[i].value = 0;
		departments[i].change = 0;
	}
	getDeptInfo();
}

function sortByDept() {
	for (var i=0; i < budget_data.length; i++) {
		for (var j = 0; j < deptdetails.length; j++) {
			if (budget_data[i].dept == deptdetails[j][0]) {
				deptdetails[j].push([[budget_data[i].deptname], [budget_data[i].category], [budget_data[i].total], [budget_data[i].recommendation]]);
			}
		}
	}
}

function rewrite() {
	$('.chart').hide();
	$('.list').empty();
	$('.list').append('<table id="budget"></table>');
	writeTable();
	$('.list').show();
}

function writeDeptTable(n) {
	$('.list').empty();
	$('.list').append('<h2><a href="#" id="return" onclick="rewrite()"><i class="fa fa-reply"></i></a>' + deptdetails[n][0].toLowerCase() + '</h2><p class="dept-total">Total: $' + commaSeparateNumber(departments[n].value) + '</p>')
	$('.list').append('<table id="budget"></table>');
	$('#budget').append('<thead><tr><th>Department / Subdivision<i class="fa fa-sort"></i></th><th>Description<i class="fa fa-sort"></i></th><th>Appropriation<i class="fa fa-sort"></i></th><th>Change from 2013<i class="fa fa-sort"></i></th></tr></thead>');
	$('#budget').append('<tbody></tbody>');
	for (var i = 0; i < deptdetails[n].length ; i++ ) {
		if (i != 0 ) {
			var change = ((deptdetails[n][i][3] - deptdetails[n][i][2]) / deptdetails[n][i][2]).toFixed(2);
			$('tbody').append('<tr id="' + i +'"><td><p>' + (deptdetails[n][i][0][0]).toLowerCase() + '</p></td><td>' + (deptdetails[n][i][1][0]).toLowerCase() + '</td><td>$' + commaSeparateNumber(deptdetails[n][i][3]) + '</td><td>' + change +'%</td></tr>')
			if (change.indexOf('-') >= 0) {
				$('#' + i + ' td:last-child').css('color', '#ce2727');
			} else if (change == "Infinity" || change == "NaN") {
				$('#' + i + ' td:last-child').html('N/A');
			} else {
				$('#' + i + ' td:last-child').prepend('+');
				$('#' + i + ' td:last-child').css('color', '#019038');
			}
		}
	}
	$('#budget').dataTable({
		"sScrollY": "400px",
		"bPaginate": false,
		"aoColumns":[
			null,
			null,
			{"sType": "currency"},
			{"sType": "percent"}
		],
		"aaSorting": [[ 2, "desc" ]]
	});
}

function getDeptInfo() {
	for (var i=0; i < budget_data.length; i++){
		for (var j=0; j < departments.length; j++) {
			if (budget_data[i].dept == departments[j].name) {
				departments[j].value += parseInt(budget_data[i].recommendation);
				departments[j].change += parseInt(budget_data[i].total);
			}
		}
	}
	writeTable()
}

//Create table
function writeTable(){
	$('#budget').append('<thead><tr><th>Department<i class="fa fa-sort"></i></th><th>Appropration<i class="fa fa-sort"></i></th><th>Percentage in Budget<i class="fa fa-sort"></i></th><th>% Change from 2013<i class="fa fa-sort"></i></th></tr></thead>');
	$('#budget').append('<tbody></tbody>');
	for (var i=0; i< departments.length; i++ ) {
		$('tbody').append('<tr id="' + i + '"><td><p><a href="#" onclick="writeDeptTable(' + i + ')">' + (departments[i].name).toLowerCase() + '</a></p></td></tr>');
		// department total appropration
		$('#' + i).append('<td>$' + commaSeparateNumber(departments[i].value) + '</td>')
		// department percentage appropriation
		departments[i].percentage = ((departments[i].value / budget_total) * 100).toFixed(2);
		$('#' + i).append('<td>' + departments[i].percentage + '%</td>')
		// percentage change from 2013
		var change = (((departments[i].value - departments[i].change) / departments[i].change) * 100).toFixed(2);
		$('#' + i).append('<td>' + change + '%</td>')
		if (change.indexOf('-') >= 0) {
			$('#' + i + ' td:last-child').css('color', '#ce2727');
		} else {
			$('#' + i + ' td:last-child').prepend('+');
			$('#' + i + ' td:last-child').css('color', '#019038');
		}
	}
	$('#budget').dataTable({
		"sScrollY": "500px",
		"bPaginate": false,
		"aoColumns":[
			null,
			{"sType": "currency"},
			{"sType": "percent"},
			{"sType": "percent"}
		],
		"aaSorting": [[ 1, "desc" ]]
	});
	$('.list').hide();
}

function chartToTable(input){
	for (var i = 0; i < deptdetails.length; i++) {
		if ( input == deptdetails[i][0]) {
			var number = i;
		}
	}
	$('#chart').removeClass('active');
	$('#table').addClass('active');
	$('.chart').fadeOut();
	$('.list').fadeIn();
	writeDeptTable(number);
}

// bubblechart
function chart(){
	var margin = {top: 40, right: 10, bottom: 10, left: 0},
    width = 948 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var color = d3.scale.ordinal().range([ "#6A92D4","#228653", "#36D986", "#99a8c1", "#82bdff", "#1acbab", "#5FBDCE", "#0999b4", "#04859D"])

	var treemap = d3.layout.treemap()
	  .size([width, height])
	  .sticky(true)
	  .value(function(d) { return d.size; });

	var div = d3.select(".chart").append("div")
	  .style("position", "relative")
	  .style("width", (width + margin.left + margin.right) + "px")
	  .style("height", (height + margin.top + margin.bottom) + "px")
	  .style("left", margin.left + "px")
	  .style("top", margin.top + "px");

	d3.json("data.json", function(error, root) {
	  var node = div.datum(root).selectAll(".node")
	      .data(treemap.nodes)
	    .enter().append("div")
	      .attr("class", "node")
	      .attr("onclick", function(d) { return "chartToTable('" + d.name + "')" })
	      .attr("title", function(d) { return (d.name).toLowerCase() + ': $' + commaSeparateNumber(parseInt(d.size)) + " (" + ((parseInt(d.size) / budget_total) * 100).toFixed(2) + "%)" })
	      .call(position)
	      .style("background", function(d) { return d.children ? color(d.name) : null; })
	      .append("div")
	      	.attr("class", "dept")
	      	.text(function(d) { return d.children ? null : (d.name).toLowerCase(); });

  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };
  	});
	});

	function position() {
	  this.style("left", function(d) { return d.x + "px"; })
	      .style("top", function(d) { return d.y + "px"; })
	      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}
	$('.chart').hide();
}

function tooSmall() {
	var divs = $('.node');
	for (var i=0; i < divs.length; i++) {
		var width = (divs[i].style.width).substring(0, (divs[i].style.width).length - 2);
		var height = (divs[i].style.height).substring(0, (divs[i].style.height).length - 2);
		if (width < 75 || height < 39) {
			$(divs[i]).empty();
		}
	}
}

function legend() {
	$('.chart').append('<div class="legend"><ul><li id="leg">Categories:</li><li><span class ="cat" id="bus"></span>Buisness and Technology</li><li style="padding-right: 20px"><span class ="cat" id="gen"></span>Administration</li><li><span class ="cat" id="rec"></span>Recreation</li><li><span class ="cat" id="soc"></span>Social Services</li><li style="padding-left: 135px;"><span class ="cat" id="infra"></span>Infrastructure</li><li style="padding-left: 84px;"><span class ="cat" id="trans"></span>Transportation</li><li style="padding-left: 18px;"><span class ="cat" id="fin"></span>Finance</li><li style="padding-left: 20px;"><span class ="cat" id="safety"></span>Safety and Protection</li></ul></div>')
}

// toggle views
function toggleViews(input) {
	if (input === 'chart') {
		$('#chart').addClass('active')
		$('#table').removeClass('active')
		$('.list').fadeOut();
		$('.chart').fadeIn();
	} else if (input === 'table') {
		$('#table').addClass('active')
		$('#chart').removeClass('active')
		$('.chart').fadeOut();
		rewrite();
		rewrite();
	}
}

function setWidth() {
	browser_width = $(window).width();
	if (browser_width > 1100) {
    $('#table').removeClass('active');
		$('#chart').addClass('active');
		$('.chart').show();
		$('.list').hide();
  } else if (browser_width < 800){
    $('#chart').removeClass('active');
		$('#table').addClass('active');
		$('.list').show();
		$('.chart').hide();
  }
}

$(document).ready(function(){
	chart();
	// getData();
	getDepartments();
	// init();
});

$(window).load(function(){
	$('.node').tipsy({
		gravity:'w',
		html:true,
		offset:0
	});
	tooSmall();
	legend();
	$('.chart').fadeIn('slow');
	sortByDept();
	setWidth();
})

$(window).resize(function() {
	setWidth();
})