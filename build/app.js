"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./internal/config"));
const express_1 = __importDefault(require("express"));
// const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.set('view engine', 'ejs');
const logger_1 = __importDefault(require("./internal/logger"));
const log = logger_1.default(module);
const morgan_1 = __importDefault(require("morgan"));
config_1.default.get('env') === 'production' || app.use(morgan_1.default('dev'));
const response_interceptor_1 = __importDefault(require("./internal/response.interceptor"));
app.use(response_interceptor_1.default());
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const passport_1 = __importDefault(require("./internal/passport"));
app.use(passport_1.default.initialize());
app.use(routes_1.default);
const port = config_1.default.get(`network:${process.env.appname}:port`);
const host = config_1.default.get(`network:${process.env.appname}:hostname`);
log.info(`appname: ${process.env.appname}`);
log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
log.info(`host: ${host} / port: ${port}`);
const server = app.listen(port, host, () => {

    const { address, port, family } = server.address() as AddressInfo;
    log.info(`HBUD server listening at http://${ address }:${ port } ${ family }`)

});
// const ioServer = new http_1.default.Server(app);
const io = socket_io_1.default(server);
// const ioPort = config_1.default.get(`network:${process.env.appname}:ioPort`);
// ioServer.listen(ioPort, host, () => {
//     log.info(`socket.io listening on port ${ioPort}`);
// });
io.on('connection', socket => {
    log.info(`socket connected`);
    socket.emit('test', { test: 'data' });
    socket.on('test', data => {
        log.debug(`test data: ${data}`);
    });
});
