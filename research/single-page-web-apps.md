## Research on single page web apps
> Parv Sharma. 2015. Single Page Application: advantages and disadvantages.

> https://stackoverflow.com/questions/21862054/single-page-application-advantages-and-disadvantages

### Advantages
- A major architectural advantage of a SPA (that rarely gets mentioned) in many cases is the huge reduction in the "chattiness" of your app. If you design it properly to handle most processing on the client (the whole point, after all), then the number of requests to the server (read "possibilities for 503 errors that wreck your user experience") is dramatically reduced. In fact, a SPA makes it possible to do entirely offline processing, which is huge in some situations.

- Performance is certainly better with client-side rendering if you do it right, but this is not the most compelling reason to build a SPA. (Network speeds are improving, after all.) Don't make the case for SPA on this basis alone.

- Flexibility in your UI design is perhaps the other major advantage. Once defined the API (with an SDK in JavaScript), You are able to completely rewrite the front-end with zero impact on the server aside from some static resource files. Try doing that with a traditional MVC app (This becomes valuable when you have live deployments and version consistency of your API to worry about).

### Disadvantages
-  Client must enable javascript.

-  Only one entry point to the site.

-  Security. When the user is making the requests rather than your JavaScript, and that the results are in HTML rather than JSON or some data format. In a non-SPA app you have to secure the individual pages on the server, whereas in a SPA app you have to secure the data endpoints. (And, if you don't want your client to have access to all the code, then you have to split apart the downloadable JavaScript into separate areas as well.
