# linkmap
Little web-app for collecting links

This is a LinkMap: A 2D layout of links, controlled by a wiki.

Click the 'help icon' (question mark) for a brief description of the functionality and read the following examples.
` 
[electron](https://en.wikipedia.org/wiki/Electron)<!--146|150|cadetblue-->
[☀️ sun](https://en.wikipedia.org/wiki/Sun)<!--225|149|darkblue-->
` 
Entries without label or link, but with extra width|height| numbers just before the color keyword can be used to make rectangles, for indicating groups. Note that drawing order follows the order of entries here in this wiki: 
` 
[]()<!--208|11|350|100|beige-->
` 
Entries without a link can be used as simple labels or headers on the map:
` 
[Variational Autoencoders]()<!--47|12|cadetblue-->
` 
Anything in the line just below a link box will be used for display on a panel when the user hovers over the box:
` 
[Review: Intro Variational Autoencoders 19](https://arxiv.org/abs/1906.02691)<!--50|83|gray-->
This is a nice review.
` 
` 
[Original paper 13](https://arxiv.org/abs/1312.6114)<!--49|54|darkorange-->
This is the original work on variational autoencoders.
` 
Hints: You can even insert emojis and symbols (like for the 'sun' above). You can also use 'transparent' for the color! All html colors are allowed. Try something like rgba(200,0,0,0.5)!
