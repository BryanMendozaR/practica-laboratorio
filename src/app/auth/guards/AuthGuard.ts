import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {Observable, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.auth.isAuthenticated$.pipe(
            tap((isAuth: any) => {
                if (!isAuth) {
                    this.router.navigate(['/autenticacion/iniciarSesion']);
                }
            })
        );
    }
}