# Libr
Libr is a lightweight DOM manipulation Library for ease of development of frontend web applications;
Using this Library is very similar to using jquery with just slight differences and yet super fast.
it also ships with an optimize and scalable hash router as an addon for developers whom uses hash routing

# Usage
Download and Add libr at the bottom of your wepage before the closing body tag or in the head section and you are good to go;
to use Libr with other frontend libraries/frameworks like react, we recommended you grab the Libr-v0.0.1.js instead of Libr-v1.0.0.js

# Code Samples
```
Libr.ready(function() {
  Libr('document').on('click', function(){
    alert('Hello from Libr')
  })
})

Libr('.form').on('submit', function(e) {
				e.preventDefault();
				var data = new FormData(this);
				Libr.ajax({
					method: 'POST',
					url: '/register',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: data,
					done: function(data){ console.log(data) },
					fail: function(err){ console.log(err) }
				})
			})
```
take some time to explore the source code for available methods while we are still compiling the official documentation
