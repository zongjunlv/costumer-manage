const { createServer } = require('http');
const next = require('next');

const port = 3000;
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

async function start() {
  let open;
  try {
    const mod = await import('open');
    open = mod.default;
  } catch (e) {
    console.warn('无法加载 open 模块，启动后请手动打开浏览器：', e.message);
    open = () => {};
  }

  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`客户管理系统已启动 http://localhost:${port}`);
    open(`http://localhost:${port}`);
  });
}

app.prepare().then(start); 