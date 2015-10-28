# Description
logger-ssh2 is a node.js application for streaming server logs to the browser using socket.io and ssh2.

## Node Packages
> - express
> - jade
> - socket.io
> - ssh2

## Usage
1. In the application directory (e.g. ~/logger-ssh2), run `node server.js` to start the node server.
2. Go to http://localhost:8100 in the browser, enter the following data and submit the form:
  - Server name, such as xxxxx.stanford.edu
  - Date string in the format of 1999-01-01
  - Webapp name, such "foobar" or "foobar-beta"
3. By default, this application will stream the Tomcat log given the criteria. The Catalina log checkbox can be used to stream Catalina logs.


## Screenshot
![](http://www.hypeway.com/labs/logger-ssh2.png "logger-ssh2")
