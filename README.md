Main Page {#mainpage}
=========
# DvigloEngine 
##Install
To install:

	git clone https://github.com/mrtrizer/DvigloEngine.git dviglo
	cd dviglo
	npm install

##Start server
To start example project:

	node server/server.js start examples/es6_logo_show

##Create own project (not implemented)
To init new project:

	node server/server.js init <project dir>

##Edit project (not implemented)
To start editor:

	node server/server.js edit <project dir>

# Documentation
It is Doxyfile in a root of the project. You need doxygen and graphviz installed to generate full documentation. Run doxygen in a project root and generated docs will be placed in doc/doxydoc/html.

# Project structure
##File tree
Every project has project.json file in a root. It defines how to build and serve project and it's folder structure. See an example:

	{
		"client":"./src/client/test.js", //Source, containing main function
		"server":"./src/server/handlers.js", //Request handlers
		"common":"./src/common/", //Location of common for client and server sources
		"res":"./src/res/*", //App resources (become avaliable in http://your.site/res/*)
		"favicon":"./favicon.ico" //Favicon location
	}

##Entry point
As you can't change index.html, your script runs right after body initialization via main() function call. You can start write your code here. Short example:

	export function main() {
		console.log("Hello, world!"); 
	}

Now you can init an object tree here. I have an idea to move this code to the core in future and give only control for object tree and it's leafs. But now I follow a simplest way.
*/
