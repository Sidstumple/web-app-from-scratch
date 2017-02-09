## Research on jQuery, applicable on libraries as well.
> Michael S. Mikowski. 2016. Why jQuery?

> https://mmikowski.github.io/why-jquery/

### When should we AVOID jQuery?

We should avoid jQuery when it is very important that the code be as light-weight and performant as possible.If a single file smaller than the compressed jQuery library provides the entire application, data, images, and CSS, you shouldn't use it.

### When should we USE jQuery?

We should use jQuery when we value development time, a stable and well-known DSL, an extensible architecture, and a vast, stable ecosystem (plugins). jQuery routines will often be more correct and almost certainly much better tested than any methods  “hand-rolled”. Have you ever written the equivalent to jQuery.ready()? It’s a lot easier just typing $(), especially if you want to support anything before IE 10.

JQuery routines are highly generic and flexible, but they can be much slower than Vanilla JS.

Overall, jQuery is a wonderfully useful library for certain projects, and completely unnecessary in others.
