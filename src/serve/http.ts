
import * as http from "http";
import { HTTP_CONFIGS } from './configs';
import { MdC } from '../index';
import { logger } from './logger';


class Server {
  public configs: any = HTTP_CONFIGS
  constructor (conf?: any) {
    // merge configs
    this.configs = Object.assign({}, this.configs, conf)
  }

  router (url: string) {
    const route = {
      '/getContent': this.md2html
    }
    let fn = route[url as keyof typeof route]
    if (fn) {
      return fn;
    }
    return () => 'this is md serve'
  }
  // start server
  start () {
    // 创建http实例
    const server = http.createServer((req, res) => {
      const fn = this.router(String(req.url)||'')

      logger.log(req.url||'')

      // method get
      if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(fn('ccc'));
      }
      // method post
      req.on('data', function(data) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(fn(data.toString()));
      });
    });
    // listen post
    try {
      server.listen(this.configs.port, this.configs.hostname, () => {
        const url = `http://${this.configs.hostname}:${this.configs.port}/`;
        console.log(`Server running at ${url}`);
      });
    } catch (error) {
      console.log('server run fail. ')
      console.error(error);
    }
  }

  md2html (doc: string) {
    let markdown = new MdC();
    // set rule
    markdown.rule.setRules({
      docType: 'html',
      mdType: 'normal'
    })

    let res = markdown.toHtml(doc);
    return res;
  }
}

let server = new Server();
try {
  server.start()
} catch (error) {
  console.error(error)
}
