const net = require("net");
const parser = require("./html-parser.js");

class Response {

}

class TruckedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
          console.log('CONTENT:\n', this.content);
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    }

    else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    }

    else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    }

    else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    }

    else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    }
  }

  receive(str) {
    // console.log('STR: ', str);
    for(let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i));
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    }

    else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    }

    // if (this.current === this.WAITING_STATUS_LINE) {
    //   if (char === ':') {
    //     this.current = this.WAITING_HEADER_NAME;
    //   }
    // }

    else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += char;
      }
    }

    else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    }

    else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    }

    else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    }

    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new TruckedBodyParser();
      }
    }

    else if (this.current = this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }

  }
}

class Request {
  // method, url=host+port+path
  // body: k/v
  // headers
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.body = options.body || {};
    this.path = options.path || "/";
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((k) => `${k}=${encodeURIComponent(this.body[k])}`)
        .join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    const headers = Object.keys(this.headers).map((l) => `${l}: ${this.headers[l]}`).join("\r\n");
    return `${this.method} ${this.path} HTTP/1.1\r\n${headers}\r\n\r\n${this.bodyText}`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (!connection) {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      } else {
        connection.write(this.toString());
      }

      connection.on('data', (data) => {
        // console.log('DATA: \n', data.toString() + '\n');
        parser.receive(data.toString());
        // resolve(data.toString());
        // console.log(parser.headers);
        if (parser.isFinished) {
          resolve(parser.response);
        }
        connection.end();
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

void async function() {
  const request = new Request({
    host: "127.0.0.1",
    method: "POST",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: { name: "artyhacker" },
  });
  const response = await request.send();
  console.log('RESPONSE:\n', response);
  let dom = parser.parseHTML(response.body);
}();


// const client = net.createConnection({
//   port: 8088,
//   host: '127.0.0.1',
// }, () => {
//   console.log('CONNECTED!');
//   const request = new Request({
//     host: '127.0.0.1',
//     method: 'POST',
//     port: '8088',
//     path: '/',
//     headers: {
//       'X-Foo2': 'customed',
//     },
//     body: { name: 'artyhacker' },
//   });
//   // console.log(request.toString());
//   client.write(request.toString());

// //   client.write(
// //     `POST / HTTP/1.1\r
// // Content-Type: application/x-www-form-urlencoded\r
// // Content-Length: 15\r
// // \r
// // name=artyhacker`
// //   );
// });

// client.on('data', (data) => {
//   console.log('DATA: ', data.toString());
//   client.end();
// });

// client.on('end', () => {
//   console.log('DISCONNECT.');
// });
