const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

const init = async option => {

    let { names, metadata, samples } = await d3.json(url);

    if (option == undefined) {
        names.forEach(name => {
            d3.select('select').append('option').text(name);
        });

        option = names[0];
    };

    let meta = metadata.find(obj => obj.id == option);

    d3.select("#sample-metadata").html("");

    Object.entries(meta).forEach(([key, val]) => {
        d3.select("#sample-metadata").append("h6").text(`${key.toUpperCase()}: ${val}`)
    });

    // barchart
    let { otu_ids, sample_values, otu_labels } = samples.find(Obj => Obj.id == option);
    console.log(otu_ids)

    var barData = [
        {
            y: otu_ids.slice(0, 10).reverse().map(x => `OTU ${x}`),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: "h"
        }
    ];

    Plotly.newPlot('bar', barData);

    // bubblechart

    var filtered = {
        otu_ids: otu_ids,
        sample_values: sample_values,
        otu_labels: otu_labels,
    };

    var trace1 = {
        x: filtered.otu_ids,
        y: filtered.sample_values,
        mode: 'markers',
        marker: {
            size: filtered.sample_values,
            color: filtered.otu_ids,     
        },
        text: filtered.otu_labels, 
    };
    
    var bubbleData = [trace1];

    var layout = {
        title: 'Bubble Chart of Samples',
        xaxis: {
            title: 'OTU IDs'
        },
        yaxis: {
            title: 'Sample Values'
        },
    };

    Plotly.newPlot('bubble', bubbleData, layout);

};

init();

const optionChanged = option => init(option);