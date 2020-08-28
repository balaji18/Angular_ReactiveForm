import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../create-employee/IEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees: IEmployee[];
  constructor(private employeeService: EmployeeService,
              private router: Router) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (error) => console.log(error)
    );
  }

  editEmployee(employeeId: number) {
    this.router.navigate(['/employees/edit', employeeId]);
  }
}
