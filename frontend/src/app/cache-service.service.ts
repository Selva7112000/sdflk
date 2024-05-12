import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { WebSocketSubject } from 'rxjs/webSocket'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private apiUrl = 'http://localhost:8080'; 
  // private wsUrl = 'ws://localhost:8080/ws';
  // private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {
    // this.socket$ = new WebSocketSubject(this.wsUrl);
  }

  setKeyValue(key: string, value: any, expiration: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/set/${key}`, { value, expiration });
  }

  getValue(key: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${key}`);
  }

  deleteValue(key: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${key}`);
  }

  // connectWebSocket(): Observable<any> {
  //   return this.socket$.asObservable();
  // }
}
