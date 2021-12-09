      const infos = ['Zuzek served in the Women\'s Army Auxiliary Corps during World War II and attended the Pratt Institute under the G.I. Bill. She worked in design in New York. Then she married a Key Wester and moved to the island in 1955. She went to work designing textiles for Key West Hand Print Fabrics in 1961. The animals, especially, were what made Zuzek\'s designs different. She grew up on a farm in upstate New York, and surrounded herself with animals all her life. ',
      'Lilly Pulitzer was a Palm Beach socialite in the early 60s. She started making simple dresses to wear while selling orange juice from a stand in Palm Beach. After she saw the Key West fabrics, she ordered some for her dresses. Her business and Key West Handprint Fabrics — took off. Lilly Pulitzer\'s shift dresses freed women from girdles and garters. And provided the perfect platform for Zuzek\'s wild imagination.',
      'Upon discovering Key West Hand Print in 1962, Pulitzer bought their fabrics exclusively for the next fifteen years. The creative collaborations between the fabric company and Pulitzer were all about an enticing fantasy, the way Florida, to outsiders, often feels like a dream world made real. Suzie Zuzek, a fan of unicorns and mermaids, found in Key West the inspiration to make highly saturated, dreamlike designs based less on the reality of Florida than what that reality felt like to its newcomers.',
      'The Official Preppy Handbook feature Lilly Pulitzer clothing as must-have items for "preppy" women. In 1966, The Washington Post reported that the dresses were "so popular that at the Southampton Lilly shop on Job\'s Lane they are proudly put in clear plastic bags tied gaily with ribbons so that all the world may see the Lilly of your choice. It’s like carrying your own racing colors or flying a yacht flag for identification." Lilly Pulitzer changed the summer uniform of countless thousands of American women who once wore flower printed cotton shirts, wrap around skirts and big, klonky, thick-soled loafers.']

      // using d3 for convenience
      var main = d3.select("main");
      var scrolly = main.select("#scrolly");
      var figure = scrolly.select("figure");
      var article = scrolly.select("article");
      var step = article.selectAll(".step");

      // initialize the scrollama
      var scroller = scrollama();

      // generic window resize listener event
      function handleResize() {
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style("height", stepH + "px");

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure
          .style("height", figureHeight + "px")
          .style("top", figureMarginTop + "px");

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
      }

      // scrollama event handlers
      function handleStepEnter(response) {
        console.log(response);
        // response = { element, direction, index }

        // add color to current step only
        step.classed("is-active", function(d, i) {
          return i === response.index;
        });

        // update graphic based on step
        figure.select("p").text(infos[response.index]);
        if (response.index % 2 === 0) {
          console.log('even left')
          figure.select("p").style("left", 5+"\%");
          figure.select("p").style("right", 65+"\%");
        } else {
          console.log('odd right')
          figure.select("p").style("right", 5+"\%");
          figure.select("p").style("left", 65+"\%");
        }

        if (response.index == 0) {
          figure.style('background-image', 'url(./data/sketch/2.png)')
          figure.style('background-size', '40\%, 100\%')
          figure.style('background-position', '95\%, 20\%')
        } else if (response.index == 1) {
          figure.style('background-image', 'url(./data/sketch/3.png)')
          figure.style('background-size', '40\%, 100\%')
          figure.style('background-position', '5\%, 95\%')
        } else if (response.index == 2) {
          figure.style('background-image', 'url(./data/sketch/4.png)')
          figure.style('background-size', '40\%, 100\%')
          figure.style('background-position', '100\%, 20\%')
        } else if (response.index == 3) {
          figure.style('background-image', 'url(./data/sketch/4.png)')
          figure.style('background-size', '40\%, 100\%')
          figure.style('background-position', '5\%, 95\%')
        }

      }

      function setupStickyfill() {
        d3.selectAll(".sticky").each(function() {
          Stickyfill.add(this);
        });
      }

      function init() {
        setupStickyfill();

        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
          .setup({
            step: "#scrolly article .step",
            offset: 0.33,
            debug: false
          })
          .onStepEnter(handleStepEnter);

        // setup resize event
        window.addEventListener("resize", handleResize);
      }

      // kick things off
      init();