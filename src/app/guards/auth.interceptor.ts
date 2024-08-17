import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../app/auth/components/services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    const loginUrl = 'http://127.0.0.1:8002/teko/gateway/login';
    const registerUrl = 'http://127.0.0.1:8002/teko/gateway/authservice'
    
    // Ne pas intercepter les requêtes de login et register
    if (req.url === loginUrl || req.url === registerUrl ) {
      return next.handle(req);
    }

    if (token) {
      const cloned = req.clone({
        withCredentials: true, // pour envoyer les cookies avec la requête
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Authentication=${token}`
        },
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
