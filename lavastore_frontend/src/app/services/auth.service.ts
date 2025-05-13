import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// 4. @Injectable decorator makes this class an Angular service
// 'providedIn: 'root'' means Angular creates a single, shared instance
// of this service for the entire application.
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // BehaviorSubject to hold the current user's state.
    // - It needs an initial value (null here, meaning no user logged in).
    // - It emits the current value to new subscribers immediately.
    // - We make it private so only this service can change the user's state.
    private currentUserSubject = new BehaviorSubject<User | null>(null);


    //Public Observable for components to subscribe to user changes.
    // - Components can listen to `currentUser$` to react when the user logs in or out.
    // - `.asObservable()` prevents external components from pushing new values into the subject.
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        //When the service is created, check if a user was already logged in
        this.loadUserFromStorage();
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const loginUrl = `${environment.apiUrl}/login`;
        const credentials = { email, password };

        return this.http.post<AuthResponse>(loginUrl, credentials)
            .pipe(
                tap(response => {
                    this.handleAuthentication(response);
                })
            );
    }

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        const registerUrl = `${environment.apiUrl}/register`;
        const userData = { name, email, password };

        return this.http.post<AuthResponse>(registerUrl, userData);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    public isAdmin(): boolean {
        return this.currentUserSubject.value?.is_admin || false;
    }

    public get token(): string | null {
        return localStorage.getItem('token');
    }


    private handleAuthentication(response: AuthResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    private loadUserFromStorage(): void {
        const storedUserJson = localStorage.getItem('currentUser');
        if (storedUserJson && storedUserJson !== 'undefined') {
            try {
                const storedUser: User = JSON.parse(storedUserJson);
                this.currentUserSubject.next(storedUser);
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
            }
        }
    }
}