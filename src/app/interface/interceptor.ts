import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MyserviceService } from 'src/app/registrouser/myservice.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(private myserviceService: MyserviceService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth header from your auth service.
        const authToken = this.myserviceService.getToken();
        const authReq = req.clone({            
            setHeaders: {Authorization: 'Bearer ' + authToken }});
        return next.handle(authReq);
    }
    
 }

 