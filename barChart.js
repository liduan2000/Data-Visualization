var data = [{
    "date": "2023",
    "total": 0,
    "Diseases of heart": 673594,
    "Malignant neoplasms": 611963,
    "Cerebrovascular diseases": 162070,
    "Chronic lower respiratory diseases": 144567,
    "Accidents": 136771,
    "Alzheimer disease": 113904,
    "Diabetes mellitus": 94356,
    "Nephritis, nephrotic syndrome and nephrosis": 55065,
    "Chronic liver disease and cirrhosis": 51784,
    "COVID-19": 49608,
    "Influenza and pneumonia": 44613,
    "Essential hypertension and hypertensive renal disease": 42180,
    "Septicemia": 41474,
    "Parkinson disease": 40132,
    "Intentional self-harm": 30402
},
{
    "date": "2022",
    "total": 0,
    "Diseases of heart": 703041,
    "Malignant neoplasms": 608341,
    "Cerebrovascular diseases": 165391,
    "Chronic lower respiratory diseases": 147367,
    "Accidents": 227664,
    "Alzheimer disease": 120109,
    "Diabetes mellitus": 101199,
    "Nephritis, nephrotic syndrome and nephrosis": 57931,
    "Chronic liver disease and cirrhosis": 54817,
    "COVID-19": 186555,
    "Influenza and pneumonia": 47044,
    "Essential hypertension and hypertensive renal disease": 43286,
    "Septicemia": 42253,
    "Parkinson disease": 39915,
    "Intentional self-harm": 49513
},
{
    "date": "2021",
    "total": 0,
    "Diseases of heart": 695547,
    "Malignant neoplasms": 605213,
    "Cerebrovascular diseases": 162890,
    "Chronic lower respiratory diseases": 142342,
    "Accidents": 224935,
    "Alzheimer disease": 119399,
    "Diabetes mellitus": 103294,
    "Nephritis, nephrotic syndrome and nephrosis": 54358,
    "Chronic liver disease and cirrhosis": 56585,
    "COVID-19": 416893,
    "Influenza and pneumonia": 41917,
    "Essential hypertension and hypertensive renal disease": 42816,
    "Septicemia": 41281,
    "Parkinson disease": 38536,
    "Intentional self-harm": 48183
},
{
    "date": "2020",
    "total": 0,
    "Diseases of heart": 696962,
    "Malignant neoplasms": 602350,
    "Cerebrovascular diseases": 160264,
    "Chronic lower respiratory diseases": 152657,
    "Accidents": 200955,
    "Alzheimer disease": 134242,
    "Diabetes mellitus": 102188,
    "Nephritis, nephrotic syndrome and nephrosis": 52547,
    "Chronic liver disease and cirrhosis": 51642,
    "COVID-19": 350831,
    "Influenza and pneumonia": 53544,
    "Essential hypertension and hypertensive renal disease": 41907,
    "Septicemia": 40050,
    "Parkinson disease": 40284,
    "Intentional self-harm": 45979
}];
var key = ["Diseases of heart", "Malignant neoplasms", "Cerebrovascular diseases", "Chronic lower respiratory diseases", "Accidents", "Alzheimer disease", "Diabetes mellitus", "Nephritis, nephrotic syndrome and nephrosis", "Chronic liver disease and cirrhosis", "COVID-19", "Influenza and pneumonia", "Essential hypertension and hypertensive renal disease", "Septicemia", "Parkinson disease", "Intentional self-harm"];
var initStackedBarChart = {
    draw: function (config) {
        me = this,
            domEle = config.element,
            stackKey = config.key,
            data = config.data,
            margin = {
                top: 20,
                right: 40,
                bottom: 30,
                left: 40
            },
            parseDate = d3.timeParse("%Y");

        var legendRectSize = 17;
        var legendSpacing = 4;

        //making graph responsive
        default_width = 800;
        default_height = 500;
        default_ratio = default_width / default_height;

        // Determine current size, which determines vars
        function set_size() {
            current_width = window.innerWidth;
            current_height = window.innerHeight;
            current_ratio = current_width / current_height;
            // Check if height is limiting factor
            if (current_ratio > default_ratio) {
                h = default_height;
                w = default_width;
                // Else width is limiting
            } else {
                w = current_width;
                h = w / default_ratio;
                legendSpacing = 2;
                legendRectSize = 7;
            }
            // Set new width and height based on graph dimensions
            width = w - margin.left - margin.right;
            height = h - margin.top - margin.bottom;
        };
        set_size();
        //end responsive graph code

        xScale = d3.scaleLinear().rangeRound([0, width]),
            yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1),
            color = d3.scaleOrdinal(d3.schemeCategory20c),
            xAxis = d3.axisBottom(xScale).ticks(5),
            yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%Y")),
            svg = d3.select("#" + domEle).append("svg")
                .attr("width", 1200 + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var stack = d3.stack()
            .keys(stackKey)
            .order(d3.stackOrder)
            .offset(d3.stackOffsetNone);

        var layers = stack(data);

        //sorts data by date- lowest to highest
        data.sort(function (a, b) {
            return a.date - b.date;
        });
        yScale.domain(data.map(function (d) {
            return parseDate(d.date);
        }));

        //x max
        xScale.domain([0, d3.max(layers[layers.length - 1], function (d) {
            return 3000000;
        })]).nice();

        var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function (d, i) {
                return color(i);
            });

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        layer.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("y", function (d) {
                return yScale(parseDate(d.data.date));
            })
            .attr("x", function (d) {
                return xScale(d[0]);
            })
            .attr("height", yScale.bandwidth())
            .attr("width", function (d) {
                return xScale(d[1]) - xScale(d[0])
            })
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('200')
                    .attr('opacity', '.7');
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                let num = (d[1] - d[0]).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                div.html(num)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");

            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('200')
                    .attr('opacity', '1');
                div.transition()
                    .duration('200')
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height + 5) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

        var legend = svg.selectAll('.legend-bar')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend-bar')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = width;
                var vert = i * height + 7;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return key[d]
            });


    }

}
initStackedBarChart.draw({
    data: data,
    key: key,
    element: 'stacked-bar'
});