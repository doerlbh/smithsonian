// using constants makes it easy to update when values change
// many editors also autocomplete variable names
// by convention, constants in JS have UPPERCASE names

const CLASS = "class";
const PETAL_LENGTH = "petallength";
const PETAL_WIDTH = "petalwidth";
const SEPAL_LENGTH ="sepallength";
const SEPAL_WIDTH = "sepalwidth";
const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 20;


// we can set up our state schema before we have any data
let state = {
  data: [],
  filters: {
    menu: [],
    checked: [],
  },
  sizeBy: {
    menu: [PETAL_LENGTH, PETAL_WIDTH, SEPAL_LENGTH, SEPAL_WIDTH],
    selected: PETAL_LENGTH,
  },
  tooltip: {
    value: "",
    visible: false,
    coordinates: [0, 0],
  },
  dimensions: [window.innerWidth, window.innerHeight],
};

// initializing these globally will be useful later
let xScale, yScale, colorScale;

async function dataLoad() {
  // we can set up our layout before we have data
  initializeLayout();
  const data = await d3.json("./iris_json.json");

  // once data is on state, we can access it from any other function because state is a global variable
  
  // we also populate our checkboxes with values from the data
  const checkboxValues = Array.from(new Set(data.map(d => d[CLASS])));

  // copy the data into the state variable, add a unique ID for each object and add the filters
  setState({
    data: data.map((d, i) => ({
      ...d,
      id: d[CLASS] + "_" + i, // each object should have a unique ID
    })),
    filters: {
      menu: checkboxValues,
      checked: checkboxValues,
    },
  });
}

// whenever state changes, update the state variable, then redraw the viz
function setState(nextState) {
  // console.log("state updated");
  // using Object.assign keeps the state *immutable*
  state = Object.assign({}, state, nextState);
  draw();
}

function onCheckboxChange(d) {
  // console.log("event", d, state.filters.checked);
  // first, was the clicked box already checked or not?
  const index = state.filters.checked.indexOf(d);
  const isBoxChecked = index > -1;
  let nextCheckedValues;
  // if box is checked, uncheck it
  if (isBoxChecked) {
    nextCheckedValues = [
      ...state.filters.checked.slice(0, index),
      ...state.filters.checked.slice(index + 1),
    ];
    // otherwise, add it to the checked values
  } else {
    nextCheckedValues = [...state.filters.checked, d];
  }
  setState({
    filters: {
      ...state.filters,
      checked: nextCheckedValues,
    },
  });
}

function onRadioChange() {
  const nextSelected = d3.event.target.value;
  setState({
    sizeBy: {
      ...state.sizeBy,
      selected: nextSelected,
    },
  });
}

function onSearchChange() {
  const nextSearchValues = d3.event.target.value;
  console.log("event", d3.event.target.value);
  setState({
    filters: {
      ...state.filters,
      checked: [nextSearchValues],
    },
  });
}

function onMouseEvent(d) {
  console.log("mouse", d3.event.target);
  if (d3.event.type === "mouseenter") {
    setState({
      tooltip: {
        value: d,
        visible: true,
        coordinates: [
          +d3.select(d3.event.target).attr("width") + TOOLTIP_WIDTH / 2 + 10,
          +d3.select(d3.event.target).attr("y") - TOOLTIP_HEIGHT / 2,
        ],
      },
    });
  } else if (d3.event.type === "mouseleave") {
    setState({
      tooltip: {
        ...state.tooltip,
        value: "",
        visible: false,
      },
    });
  }
}

// this function sets up everything we can before data loads
function initializeLayout() {
  const svgWidth = 0.6 * state.dimensions[0];
  const svgHeight = state.dimensions[1];
  const margin = 20;

  const parent = d3.select("#interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // remember, we initialized these variables at the top
  xScale = d3.scaleLinear().range([margin, svgWidth - margin]);
  yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    .range([margin, svgHeight - margin]);
  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // add x axis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${svgHeight - margin})`);

  svg.append("g").attr("class", "bars");

  const tooltip = svg.append("g").attr("id", "tooltip");
  tooltip
    .append("rect")
    .attr("height", TOOLTIP_HEIGHT)
    .attr("width", TOOLTIP_WIDTH)
    .attr("fill", "#aeaeae");
  tooltip
    .append("text")
    .attr("x", 5)
    .attr("y", 14)
    .attr("font-size", 12);

  // add left menu
  const leftMenu = d3.select("#left-menu");
  leftMenu.append("div").attr("class", "filters");

  // add right menu
  const rightMenu = d3.select("#right-menu");
  rightMenu
    .append("form")
    .html(
      state.sizeBy.menu
        .map(
          d =>
            `<input type="radio" name="sizeby" value="${d}" ${
              state.sizeBy.selected === d ? "checked" : ""
            }> ${d}<br>`
        )
        .join("")
    )
    .on("change", onRadioChange);
}

// everything in this function depends on data, so the function is called after data loads and whenever state changes
function draw() {
  // filter data based on state.filters
  const filteredData = state.data
    .filter(d => state.filters.checked.indexOf(d[CLASS]) > -1)
    .sort((a, b) =>
      d3.descending(a[state.sizeBy.selected], b[state.sizeBy.selected])
    );

  // update our scales based on filteredData
  xScale.domain([0, d3.max(filteredData, d => d[state.sizeBy.selected])]);
  yScale.domain(filteredData.map(d => d.id));
  colorScale.domain(state.filters.menu);
  const barHeight = yScale.bandwidth();

  // update our axes based on the updated scales
  d3.select(".x-axis").call(d3.axisBottom(xScale));
  d3.select(".y-axis").call(d3.axisLeft(yScale).tickValues([]));

  // update checkbox values based on state.filters
  const checkRow = d3
    .select(".filters")
    .selectAll(".check-row")
    .data(state.filters.menu)
    .join("div")
    .attr("class", "check-row")
    .html(
      (d, i) => `
      <input type="checkbox" class="btn-check" id="btncheck${i}" autocomplete="off" ${
        state.filters.checked.indexOf(d) > -1 ? "checked" : ""
      }>
      <label class="btn btn-outline-primary" for="btncheck${i}">${d}</label>
    `
    );
  checkRow.select("input").on("change", onCheckboxChange);

  // update bars based on filteredData
  const barX = xScale.range()[0];
  d3.select(".bars")
    .selectAll("rect")
    .data(filteredData)
    .join("rect")
    .attr("x", barX)
    .attr("width", d => xScale(d[state.sizeBy.selected]) - barX)
    .attr("height", barHeight)
    .attr("y", d => yScale(d.id))
    .attr("fill", (d, i) => colorScale(d[CLASS]))
    .on("mouseenter", onMouseEvent)
    .on("mouseleave", onMouseEvent)
    .classed("highlight", d => d.id === state.tooltip.value.id);

  // update tooltip based on state.tooltip
  const tooltip = d3.select("#tooltip");
  tooltip
    .attr(
      "transform",
      `translate(${state.tooltip.coordinates[0]}, ${
        state.tooltip.coordinates[1]
      })`
    )
    .classed("visible", state.tooltip.visible);
  tooltip.select("text").text(() => {
    const d = state.tooltip.value;
    return `${d.id}: ${d[state.sizeBy.selected]}`;
  });

  // update legend based on filteredData
  const legend = d3.select("#legend");
  legend
    .selectAll(".legend-row")
    .data(state.filters.checked)
    .join("div")
    .attr("class", "legend-row")
    .html(
      d => `
      <label for="selectColorInput" class="form-label">${d}</label>
      <input type="color" class="form-control form-control-color" id="selectColorInput" value="${colorScale(d)}" title="Choose your color">
    `
    );

  // update data list
  const datalist = d3.select("#datalist");
  datalist
    .selectAll("option")
    .data(state.filters.menu)
    .join("option")
    .attr("class", "datalist-row")
    .html(
      d => `${d}`
    );
  d3.select("#searchDataList").on("change", onSearchChange);
}

// this function is only called once
dataLoad();
