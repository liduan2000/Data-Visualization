dataset = {
    "children": [{
        "state": "Alabama",
        "population": 5108468
    },
    {
        "state": "Arizona",
        "population": 7431344
    },
    {
        "state": "California",
        "population": 38965193
    },
    {
        "state": "Colorado",
        "population": 5877610
    },
    {
        "state": "Connecticut",
        "population": 3617176
    },
    {
        "state": "Florida",
        "population": 22610726
    },
    {
        "state": "Georgia",
        "population": 11029227
    },
    {
        "state": "Illinois",
        "population": 12549689
    },
    {
        "state": "Indiana",
        "population": 6862199
    },
    {
        "state": "Kentucky",
        "population": 4526154
    },
    {
        "state": "Louisiana",
        "population": 4573749
    },
    {
        "state": "Maryland",
        "population": 6180253
    },
    {
        "state": "Massachusetts",
        "population": 7001399
    },
    {
        "state": "Michigan",
        "population": 10037261
    },
    {
        "state": "Minnesota",
        "population": 5737915
    },
    {
        "state": "Missouri",
        "population": 6196156
    },
    {
        "state": "Montana",
        "population": 1132812
    },
    {
        "state": "New Jersey",
        "population": 9290841
    },
    {
        "state": "New York",
        "population": 19571216
    },
    {
        "state": "North Carolina",
        "population": 10835491
    },
    {
        "state": "Ohio",
        "population": 11785935
    },
    {
        "state": "Oklahoma",
        "population": 4053824
    },
    {
        "state": "Oregon",
        "population": 4233358
    },
    {
        "state": "Pennsylvania",
        "population": 12961683
    },
    {
        "state": "South Carolina",
        "population": 5373555
    },
    {
        "state": "Tennessee",
        "population": 7126489
    },
    {
        "state": "Texas",
        "population": 30503301
    },
    {
        "state": "Utah",
        "population": 3417734
    },
    {
        "state": "Virginia",
        "population": 8715698
    },
    {
        "state": "Washington",
        "population": 7812880
    },
    {
        "state": "Wisconsin",
        "population": 5910955
    }
    ]
};

var diameter = 900;
var color = d3.scaleOrdinal(d3.schemeCategory20b);

//edited the responsive bar code to apply to bubble chart
default_height = 500;
default_ratio = diameter / default_height;

// Determine current size, which determines vars
function set_size() {
    current_width = window.innerWidth;
    current_height = window.innerHeight;
    current_ratio = current_width / current_height;
    // Check if height is limiting factor
    if (current_ratio > default_ratio) {
        diameter = 900;
        // Else width is limiting
    } else {
        diameter = 400;
    }
};
set_size();

var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(.5);

var svg = d3.select("#bubble")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var nodes = d3.hierarchy(dataset)
    .sum(function (d) {
        return d.population;
    });


var node = svg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
        return !d.children
    })
    .append("g")
    .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('100')
            .attr('opacity', '.8');
    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('100')
            .attr('opacity', '1');
    })
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

node.append("title")
    .text(function (d) {
        return d.state;
    });

node.append("circle")
    .attr("r", function (d) {
        return d.r;
    })
    .style("fill", function (d, i) {
        return color(i);
    });

node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d.data.state;
    })
    .attr("font-size", function (d) {
        return d.r / 5;
    })
    .attr("fill", "white");

node.append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d.data.population.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    })
    .attr("font-size", function (d) {
        return d.r / 5;
    })
    .attr("fill", "white");

d3.select(self.frameElement)
    .style("height", diameter + "px");
