import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../../app/auth/components/services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    const loginUrl = 'http://127.0.0.1:8002/teko/gateway/login';
    const registerUrl = 'http://127.0.0.1:8002/teko/gateway/authservice'
    
    // Do not intercept login and register requests
    if (req.url === loginUrl || req.url === registerUrl ) {
      return next.handle(req);
    }

    // Excludes request containing files  (multipart/form-data)
    if (req.headers.has('Content-Type') && req.headers.get('Content-Type')!.includes('multipart/form-data')) {
      return next.handle(req);  
    }

    if (token) {
      const cloned = req.clone({
        withCredentials: true,
        setHeaders: {
          'Authorization': `Authentication=${token}`
        },
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
