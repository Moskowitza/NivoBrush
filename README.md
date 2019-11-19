[Original Article](https://medium.com/@gmonne/create-a-brush-component-using-nivo-dataviz-library-68074f3721ba)
[repo](git@github.com:guzmonne/nivo-with-brush.git)

## Learning from this article

credit to Guzmonne

## Article Text

Nivo is a wonderfully written React based data visualization library, written by Raphaël Benitte, which provides 14 different types of components to showcase your data. Each element can be heavily modified to suit your needs. Nonetheless, there are always some features that must be removed from the end product, either because they are to difficult to implement, or they don’t align with the vision of the project.
Here lies one of the beauties of Open Source software. We can take pieces of this library, and produce the components that we need. In my case, I needed to showcase a LineChart with more than 9000 points. Drawing all these points at the same time didn’t seem like a good idea. Instead, I wanted to provide a tool that would allow the portion of the chart to draw. This tool is quite common when working with charts, its called a Brush. On this article, I’ll show how I built this component.
Tools
I wanted to build this component using the same tools used by Nivo, to be able to add it to the library through a pull request, if the author likes the implementation. Three central libraries -besides React- are used to build Nivo’s Line component.
d3 — “JavaScript library for manipulating documents based on data.”
recompose — “React utility belt for function components and higher-order components.”
react-measure — “Compute measurements of React components”.
The first one is probably the most renowned data visualizations library of the JavaScript ecosystem. Developed by Mike Bostock, it is an incredibly powerful tool, with a lot of different functionalities to transform your data into whatever you want. To make it easier to import into your project, it now comes bundled in multiple smaller packages. We’ll use the `d3-scale` package, to build our component.
The recompose library provides a significant amount of HoC that can be applied to your components to add new functionalities to it. I had never worked with it before because I didn’t see the value it brought. Now, after forcing myself to use it, I found it fantastic. It gives a lot of power to how we create React components and removes some of the most common problems associated with them. For example, handling unnecessary rendering performance issues.
Lastly, we have the react-measure component library. Dealing with the width and height of web elements is always a pain. However, this library helps to mitigate this issues. It provides a component called Measure that implements the “Function as Child” pattern, in which you give a function as the child of the component, that gets called with a bunch of arguments, all related to the size and position of the parent component.
Challenges
Before I started working with this components I knew I would have to solve two main challenges:
Converting Mouse coordinates into SVG coordinates.
Scaling SVG coordinates to `data` points.
After a little bit of Googling, I found this Stack Overflow answer which mentions a way to do just that. The only problem is that it needs a reference to the SVG component, and Nivo doesn’t provide a way to get to it by default.
The second challenge proved to be harder to solve. Nivo’s Line component expects the data as a list of points with x and y values, plus some metadata. From this information, Nivo constructs a point scale, to convert the data into SVG coordinates. Unfortunately, this types of d3 scales don’t provide an invert method, to go from SVG coordinates to data points. Mike Bostock explains why on this GitHub issue. Basically, on this type of scales, there isn’t a requirement for the range values to be unique.
I found multiple solutions for this challenge, and ended up deciding on the following one: use a d3 quantize scale. A quantizer scale is similar to a linear scale; only the range is discrete instead of continuous. Using the width of the chart as the domain, we can convert from SVG coordinates to data points. It works because Nivo requires that the x axis of the Line component contain only unique values.
Implementation
Brush component
The brush should allow the user to:
Select the portion of the chart to be displayed.
Allow growing the selection to each side.
Move the current selection, without losing its width.
Create a new selection.
The component should also allow the developer to configure an initial state of the selection window and should be able to provide a function to call whenever the selection window updates.
As for the design, I didn’t want anything fancy. Just a semi-transparent black square for the selection window plus some invisible handlers on the side that allowed expanding the square left and right. They are all just rect elements inside a g element.

Brush component.
I tried to mimic as much as possible the tyle used on Nivo components, and to include as little props as possible.
LineWithBrush
Nivo`s Line component doesn’t accept child components. So I had no way to add it on top of the chart. I had to create a new component that included the Brush component inside, and configure ir with the appropriate props .
<Brush
 margin={margin}
 width={width}
 height={height}
 onBrush={onBrush}
 initialMinEdge={initialMinEdge}
 initialMaxEdge={initialMaxEdge}
/>
Only 3 more props can now be configured on the LineWithProps component, consumed by the Brush. The onBrush prop is required.
SvgWrapper
As I mentioned before, one of the challenges of building this component was finding out how to convert from mouse coordinates to SVG coordinates, and the only way that I found out how to do that, was through a reference to the svg element. Nivo’s Line component uses another component to define the svg element called SvgWrapper. As with the Line component, I created my SvgWrapper component based on it. I then modified the new component so it could pass a reference of the svg element down to all its children through a special handler function.
I didn’t want to use React’s context API; instead, I created a new handler called getSvgRef, that returns the svg element reference. Then, instead of just rendering the child components, I used the React.children.map and React.cloneElement functions to create clones of every child, adding a new prop to it connected to the getSvgRef function, called by the same name.
I am not 100% convinced of this solution, but it works.

LineChart
Now we must put it all together. I created another component called LineChart that includes the original chart, and the brush under it. I also added some props using recompose, to improve the rendering of the BrushChart. I reduced the number of points to just two per visible pixel, based on the svg width. Having more points than that is not useful given they would overlap.
Since the BrushChart should have fewer details than the main chart, I expose a prop on the LineChart component that accepts the same properties as the Line chart. It then uses them to override the props on the main chart. This way you don’t have to repeat every prop of the actual chart on to the BrushChart.
Another thing I added was a way to handle the tickLabels on the x axis. I didn’t want these labels to overlap, so instead of just rendering them all, I show the maximum number of labels allowed by the space.

Conclusion
You can see a sample application working on the following link:
https://guzmonne.github.io/nivo-with-brush/

The chart has to render more than 9000 points, which represents the close value of a fictitious stock. Using the brush at the bottom, we can select the number of points to show on the top chart. Even when it has to render many points, the render performance is quite good. One thing to take into account is that the animate prop should probably befalse. When you update to many points at the same time, the framerate drops like a rock.
For my particular need, this solution works excellent. It has a ton of things that can be improved and it might work better with some minor modifications on the next version of Nivo.
If you want to suggest modifications or would like to leave a comment you can do it in the following repo:
guzmonne/nivo-with-brush
nivo-with-brush - Line chart with working brush using @nivo/line and @nivo/core
github.com
Alternatively, you can leave a comment on this Nivo issue:
Feature (or example) request: Brush · Issue #32 · plouc/nivo
This is a common, but often challenging, interaction. It'd be great to see how it should work in nivo.
github.com
As always, thank you very much for reading my article. If you have any suggestion or question, please feel free to leave a comment in the section below, and give it some “claps” or a “like” if you liked the content.


Guzman Monne
WRITTEN BY

Guzman Monne
