var budget_data;
function init() {
  Tabletop.init( { 
  	key: '0ArcRX35HpjojdEtnMXB0Z2l1MmhzZmN0X25fWUlPT0E',
    callback: function(input, tabletop) { 
    	budget_data = input;
    	getDepartments();
    },
    simpleSheet: true } )
}

var all_departments = [];
var departments = [];
function getDepartments() {
	for (var i = 0; i < budget_data.length; i++) {
		all_departments.push(budget_data[i].deptname);
	};
	var uniques = _.uniq(all_departments);
	for (var i = 0; i < uniques.length; i++) {
		departments.push({'name': uniques[i]});
	}
	writeTable();
}

function getDeptInfo() {
	for (var i=0; i < 30; i++){
		for (var j=0; j < departments.length; j++) {
			if (budget_data[i].deptname == departments[j].name) {
				// console.log(i + ', ' + departments[j].name + ', ' + budget_data[i].category + ', ' + budget_data[i].total);
				$('#' + j).append('<td><p>$' + budget_data[i].total + '</p></td>');
			}
		}
	}
}

function writeTable(){
	for (var i=0; i< 10; i++ ) {
		$('tbody').append('<tr id="' + i + '"><td><p>' + departments[i].name + '<p></td></tr>');
	}
	getDeptInfo();
}

$(document).ready(function(){
	init();
	for (var i=0; i < departments.length; i++) {
		console.log(departments[i].name)
	}
});