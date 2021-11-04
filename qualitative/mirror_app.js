const fabrics = Array.from(Array(41).keys()).map(x => './data/suzie_zuzek/'+x+'.jpg')
const fashions = Array.from(Array(8).keys()).map(x => './data/fashion/'+x+'.png')
const names = ['Beach Bottles',
'Lillys Penguins',
'Suzies Sons',
'Sea Jewels',
'Lillys Llamas',
'Ponchitas Petunias',
'Wallowing Walruses',
'Hep Cat',
'Nocturne',
'KWHPF 302',
'Trinket',
'Wildness',
'Lilly Gators',
'El Morocco',
'Graces Garden',
'Sea Fantasy',
'Wonderworld',
'Wildness',
'Sweet Corn',
'Pescador',
'Squash',
'Cole Slaw',
'Mouse Trap',
'Tennessees Hibiscus',
'My Sun, My Sun',
'Tropical Harvest',
'Nairobi',
'Garden Paisley',
'Hippo',
'Ostrich',
'Suzies Garden',
'Suzies Garden',
'Suzies Garden',
'Butland',
'Rhino',
'KWHPF 823',
'Angel',
'The Reef',
'Pelicans',
'Currie',
'Puffins',
]

const years = ['January 6, 1964',
'January 6, 1964',
'May 1, 1965',
'December 1, 1966',
'July 18, 1967',
'October 16, 1967',
'August 27, 1968',
'July 8, 1969',
'October 12, 1969',
'ca. 1970',
'May 20, 1971',
'ca. 1972',
'January 3, 1972',
'February 2, 1972',
'March 10, 1972',
'June 6, 1972',
'June 9, 1972',
'September 11, 1972',
'November 12, 1972',
'November 14, 1972',
'December 1, 1972',
'December 11, 1972',
'January 23, 1973',
'June 4, 1973',
'August 14, 1973',
'November 5, 1973',
'November 11, 1974',
'January 6, 1975',
'July 5, 1975',
'May 22, 1976',
'October 11, 1976',
'October 11, 1976',
'October 11, 1976',
'October 25, 1976',
'January 21, 1977',
'August 14, 1978',
'September 26, 1978',
'June 12, 1979',
'September 10, 1979',
'September 17, 1980',
'January 22, 1981',
]


function get_random_index(arr) {
	return Math.floor(Math.random() * arr.length);
}

$(document).ready(function () {
	$("#mirror-content").on("click", function () {
    	var fabric_index = get_random_index(fabrics)
		var fabric = fabrics[fabric_index]
		var year = years[fabric_index]
		var name = names[fabric_index]
	    var fashion = fashions[get_random_index(fashions)]
		$(this).css({
			"background-image": `url(${fashion})`
		});
		$("#scene").css({
			"background-image": `url(${fabric})`
		});
		$("#mirror").css({
			"background-image": `url(${fabric})`
		});
		var add = '<style>#metainfo:before{content:"'+name + ' \\A '+ year+'"!important;white-space: pre!important;}</style>';
		$('body').append(add);
	});
});
