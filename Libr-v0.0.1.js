/**
* Libr.js is a public Library. 
* @author: Emmanuel Godswill - (Ryan Lincoln);
* @version: 0.0.1;
* Last Updated: 29/09/2020;
* Last Updated By: Emmanuel Godswill;
* Desc: Libr is a lightweight DOM traversing library for quick development of frontend applications;
* Usage: Using Libr.js is very similar to using jQuery with just slight change, include script anywhere in your webpage;
*/

/*
*********************************************************************
=====================================================================
*/
 
function createFactory( Factory, arg ) {
	return !arg ? new Factory() : new Factory( arg );
}

/* xhttp object for fallback ajax processes */
var exports = {}, xhttp = createFactory( XMLHttpRequest )

/* Main Libr Object constructor */
var Libr;

( function() {

	"use strict";

	/* Libr */
	Libr = function( selector ) {
		
		/* wrapper object */
		var libr = Object.create( null );
		
		/* properties and methods below */
		libr.selector = selector;
		libr.element =  selector === 'window' ? window : selector === 'document' ? document : document.querySelector( libr.selector );
		
		/* for methods like forEach */
		libr.elements =  document.querySelectorAll( libr.selector );
		
		/* html method e.g Libr('selector').html(); */
		libr.html = function( value ) {
			if( !value ) return libr.element;
			libr.element.innerHTML = value;
			return libr;
		}

		/* append item to the end of an element */
		libr.append = function( item ) {
			if( !item ) throw new Error('append method must have one argument');
			libr.element.insertAdjacentHTML( 'beforeend', item );
			return libr;
		}

		/* insert item to the beginning of element */
		libr.insertBefore = function( item ) {
			libr.element.insertAdjacentHTML( 'beforebegin', item );
			return libr;
		}

		/* hide method to hide an element */
		libr.hide = function() {
			libr.element.style.display = 'none';
			return libr;
		}

		/* show method to show element */
		libr.show = function() {
			libr.element.style.display = 'block';
			return libr;
		}

		/* toggle method to toggle element */
		libr.toggle = function( prop ) {
			if( !prop ) libr.element.style.display !== 'none' ? libr.element.style.display = 'none' : libr.element.style.display = 'block';
			libr.element.classList.contains( prop ) ? libr.element.classList.remove( prop ) : libr.element.classList.add( prop );
			return libr;
		}

		/* attribute method to get and set html attributes */
		libr.attr = function( name, value ) {
			if( !value ) return libr.element.getAttribute( name );
			libr.element.setAttribute( name, value );
			return libr;
		}

		/* forEach method */
		libr.each = function( callback ) {
			if( typeof libr.element === 'object' ) {
				libr.elements.forEach( callback );
			} else {
				throw new Error('Libr each method requires an object to be passed as the selector, non object given')
			}
			return libr;
		}

		/* find method */
		libr.find = function( target ) {

			if( !target || libr.element.nodeName.toLowerCase() !== "form" ) throw new Error('No element supplied or not quering a form in the find method');
			var children = Array.from( libr.element.getElementsByTagName('input') );
			var queryType = target[0] === '#' ? 'id' : 'className';

			if( ( target[0] !== '#' ) && ( target[0] !== '.' ) ) throw new Error('find method expects an id or class');
			children.forEach( function( child ){
				if( child[queryType] === target.slice(1) ) {
					libr.element = child;
				}
			} )

			return libr;
		}

		/* html method e.g Libr('selector').html(); */
		libr.val = function( value ) {
			if( libr.element.nodeName.toLowerCase() === "input" || libr.element.nodeName.toLowerCase() === "textarea" ) {
				if( !value ) return libr.element.value;
				libr.element.value = value;
			}
			return libr;
		}

		/* scroll effect */
		libr.scrollTo = function( start, finish ) {
			if( !start || !finish ) throw new Error('provide a start and finish index')
			libr.element.scrollTo( start, finish )
			return libr;
		}

		/* reset [forms] */
		libr.reset = function() {
			if( arguments[0] ) throw new Error('reset method does not require any arguments');
			libr.element.reset();
			return libr;
		}

		/* parent node */
		libr.parent = function(){
			if( !arguments[0] ){
				var newElement = libr.element.parentNode;
			} 
			libr.element = newElement;
			return libr;
		}
		
		/* event listeners */
		libr.on = function( event, callback ) {
			if( !event ) throw new TypeError('Unknown event passed in');
			/* adding 'on' here to bind the event to the type e.g onclick */
			libr.element['on' + event] = callback;
			return libr; 
		};

		/* css property method */
		libr.css = function() {

			if( !arguments[0] || arguments.length > 1 ) throw new Error('CSS method requires some css properties to be passed and just a single arguments of either object or string pair');

			var styleProp = arguments[0];

			if( typeof styleProp === 'object' ) {
				var prop;
				for( prop in styleProp ) {
					if( styleProp.hasOwnProperty( prop ) ) {
						libr.element.style[prop] = styleProp[prop];
					}
				}
			} 
			else if( typeof styleProp === 'string' ) {
				if( styleProp.indexOf(',') !== -1 ){
					throw new Error('multiple css properties should be defined inside an object');
				}

				var ObjPop = styleProp.split(':')[0],
				    ObjVal = styleProp.split(':')[1];

				libr.element.style[ObjPop] = ObjVal;
			} 
			else throw new Error('Error on your css construction');
			return libr;
		};

		/* return the libr object which has all other properties */
		return libr;
	}

	/***************************************************************************************
	* For some reasons we just need to put this method outside the scope of the libr object
	* Notice methods below are defined under the Libr constructor itself not the libr object
	*/

	/* dom ready method */
	Libr.ready = function( callback ){
		return document.addEventListener ? document.addEventListener( 'DOMContentLoaded', callback ) : document.attachEvent( 'DOMContentLoaded', callback );
	}

	/* make ajax request */
	Libr.ajax = function() {

		/* get the arguments passed */
		var argument = arguments[0];

		/* argument is expected to be an object */
		if( argument && typeof argument === 'object' ) {

			/* check for neccessary properties exist */
			if( argument.hasOwnProperty('method') && argument.hasOwnProperty('url') && argument.hasOwnProperty('done') && argument.hasOwnProperty('fail') ) {
				
				/* accepted http methods */
				var acceptedMethods = [ 'GET', 'POST' ];
				
				/* check if the done and fail methods are indeed functions so we can use this as callbacks */
				if( typeof argument.done === 'function' && typeof argument.fail === 'function' ) {
					
					/* assign the argument properties to variables */
					var 
					method = argument['method'],
					url = argument['url'],
					body = argument['body'],
					done = argument.done,
					fail = argument.fail;
					
					/* check if arguments are empty */
					if( method === '' || url === '' ) throw new Error('method and url cannot be empty');

					/* check if the method passed is indeed an expected method */
					if( !acceptedMethods.includes(method) ) throw new Error('method can either be GET or POST');
					
					/* check request method
					* Notice the done and fail callback functions triggered below which is part of the object arguments
					*/
					if( method === 'GET' ) {
					/* check if fetch is in window object and use fetch API otherwise use old-school Ajax; */
						if( window.fetch !== 'undefined' ) {

							/*get with fetch API */
							fetch( url )
								.then( function( response ) { response.json() } )
								.then( function( data ) { done(data) } )
								.catch( function( e ) { fail(e) } )

						} else {
							/* get with XMLHttp */
							xhttp.open( 'GET', url, true );

							xhttp.onreadystatechange = function(){

								try{
									if( xhttp.readyState === 4 && xhttp.status === 200 ) {
										done( JSON.parse( xhttp.responseText ) );
									}
								} catch( e ) {
									fail( e );
								}

							}
							xhttp.send();
						}

					} else if( method === 'POST' ) {
						/* check if fetch is in window object and use fetch API otherwise use old-school Ajax; */
						if( !argument.hasOwnProperty('body') ) throw new Error('POST method requires a form body, provide a body to send');
						if( window.fetch ) {
							/* post with fetch API */
							fetch(url, argument)
							.then( function( response ) { response.json() } )
							.then( function( data ) { done(data) } )
							.catch( function( error ) { fail(error) } )

						} else {
							/* post with XMLHttp */
							xhttp.open( 'POST', url, true );
							
							xhttp.onreadystatechange = function(){

								try {
									if( xhttp.readyState === 4 && xhttp.status === 200 ) {
										done( JSON.parse( xhttp.responseText ) );
									} 
								} catch( e ) {
									fail( e );
								}

							}
							xhttp.send( body );
						}

					}

				} else {
					throw new TypeError('done and fail properties expects a function');
				}

			} else {
				throw new Error('Libr ajax requires object with the following core properties. method, url, done, fail. please review the doc');
			}
		}

	}

	/* should hash routing be used in the webpage? default to false */
	Libr.allowRouting = false;

	/* get and set hash routing state */
	Object.defineProperty( Libr, 'useHashRouter', {
		get: function() {
			return this.allowRouting;
		},
		set: function( boolean ) {
			if( "boolean" !== typeof boolean ) throw new TypeError('useHashRouter requires a boolean to be passed, ' + typeof(boolean) + ' given');
			this.allowRouting = boolean;
		}
	} );
	
	/*
	* check if user has turned on hash routing
	* the Libr ready method here is not optional, its mandatory otherwise the value of allowRouting will still be false 
	*/
	Libr.ready( function() { 
		if( window.Libr && window.Libr.useHashRouter === true ) { Libr.hashRouter(); };
	} );

	/* Libr hash router */
	/* This part of Libr is an addon, should never be used in pages that have forms only for rendering static pages */
	/* It is adviced you stay away from it if you don't really need it */
	Libr.hashRouter = function() {

		/* get the container to render view */
		var renderPage = document.querySelector( '#libr-view' );
	
		window.addEventListener( 'hashchange', function( e ) {
	
			/* remove # prefix */
			var hashPath = window.location.hash.substring(1);
	
			/* fetch the page with the where path === hashPath */
			fetchPage( window.fetch, hashPath, renderPage )
	
		});
	
		var fetchPage = function( fetch, url, page ) {
			/* fetch here is an injected fake dependency, page is the elem where the result will be displayed */
	
			/* check if fetch is in window object and use fetch API otherwise use old-school Ajax; */
			if( fetch !== 'undefined' ) {
				//get with fetch API
				fetch( url )
					.then( function( response ) { response.text() } )
					.then( function( data ) { page.innerHTML = data; } )
					.catch( function( e ) { console.log(e) } );
			} else {
				//get with xhttp
				xhttp.open( 'GET', url, true );
				xhttp.onreadystatechange = function() {
					try{
						if( xhttp.readyState === 4 && xhttp.status === 200 ) {
							page.innerHTML = xhttp.responseText;
						}
					} catch( e ) {
						console.log( e );
					}
				}
				xhttp.send();
			}
	
		}
	
	}

	/* register Libr as global object in the window space */
	if( window && typeof window.Libr === 'undefined' ) {
		window.Libr = Libr;
	}

})();

exports.default = Libr;