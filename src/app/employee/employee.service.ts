import { Injectable } from '@angular/core';
import { IEmployee } from './create-employee/IEmployee';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable()
export class EmployeeService {

    constructor(private httpClient: HttpClient) {}

    baseUrl = 'http://localhost:3000/employees';
    getEmployees(): Observable<IEmployee[]> {
        return this.httpClient.get<IEmployee[]>(this.baseUrl)
         .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.log('Client Side Error:' , errorResponse.error.message);
        } else {
            console.log('Server Side Error:', errorResponse);
        }
        return throwError('There is a problem with the service, we are notified & working on it, Please try later');
    }

    getEmployee(id: number): Observable<IEmployee> {
        return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
    }

    addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.httpClient.post<IEmployee>(this.baseUrl, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateEmployee(employee: IEmployee): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    deleteEmployee(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
    }
}
