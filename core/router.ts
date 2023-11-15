import { Server } from "bun";
import { BaseResponse, defaultHeaders, takePath } from "../utils/Http";

export type EndPoint = {
    args?: any[];
    path?: string;
    router?: Router;
    handler?: EndPointHandler;
}

export type EndPointHandler = (url: URL, req: Request, server: Server) => Response | Promise<Response>

export class Router {

    private isRoot: boolean;
    private routeName: string;
    private childrenRoutes: Map<string, EndPoint>;

    constructor(isRoot: boolean = false, routeName?: string) {
        this.isRoot = isRoot;
        this.routeName = isRoot ? "/" : routeName;
        this.childrenRoutes = new Map();
    }

    public appendRoute(path: string, method: EndPointHandler, ...args: any[]) {
        this.childrenRoutes.set(path, {path: path, handler: method, args: args})
    }

    public appendRouter(path: string, router: Router) {
        this.childrenRoutes.set(path, {path: path, router: router})
    }

    public async handleRequest(pathname: string, url: URL, req: any, server: Server) {
        try {
            let paths = takePath(pathname, this.routeName);        
            let namespace = paths[0] ?? pathname;        
            let mappedUrl = this.childrenRoutes.get(this.cleanPath(namespace));
    
            if (mappedUrl && mappedUrl != undefined) {
                if (mappedUrl.router instanceof Router) {
                    return mappedUrl.router.handleRequest(paths[1], url, req, server)
                } else {
                    return await mappedUrl.handler(url, req, server)
                }
            } 
        } catch (error) {
            console.log(error);
            return new BaseResponse(500, "Unknown error")
        }

        return new BaseResponse(404, "Not Found")
    }

    private cleanPath(path: string) {
        let queryIndex = path.indexOf("?");
        return path.substring(0, queryIndex > 0 ? queryIndex : undefined)
    }

}