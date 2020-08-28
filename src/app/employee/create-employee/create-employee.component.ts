import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ControlContainer, FormArray } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/custom.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { EmployeeService } from '../employee.service';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.',
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email Domain Should be pragimtech com'
    },
    'confirmEmail': {
      'required': 'Confirm email is required.',
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match',
    },
    'phone': {
      'required': 'Phone is required.',
    },
    // 'skillName': {
    //   'required': 'Skill Name is required.',
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required.',
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required'
    // },
  };

  formErros = {
    // 'fullName': '',
    // 'email': '',
    // 'confirmEmail': '',
    // 'emailGroup': '',
    // 'phone': '',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,) { }

  ngOnInit() {
    // Reactive Forms
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   contactPreference: new FormControl(),
    //   email: new FormControl(),
    //   phone: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    // FormBuilder

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidator.emailDomain('pragimtech.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: this.matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChanges(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe((param) => {
      const empId = +param.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }

  getEmployee(Id: number) {
    this.employeeService.getEmployee(Id).subscribe(
      (employee: IEmployee) => {
                this.editEmployee(employee);
                this.employee = employee;
              },
      (error) => console.log(error));
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }



 


  setExistingSkills(skillSets: ISkill[]): FormArray {
  const formArray = new FormArray([]);
  skillSets.forEach(element => {
    formArray.push(this.fb.group({
      skillName: element.skillName,
      experienceInYears: element.experienceInYears,
      proficiency: element.proficiency
    }));
  });
  return formArray;
}

addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

removeSkillButtonClick(skillGroupIndex: number): void {
    const removeSkill = (<FormArray>this.employeeForm.get('skills'))
    removeSkill.removeAt(skillGroupIndex);
    removeSkill.markAsDirty();
    removeSkill.markAsTouched();
  }

addSkillFormGroup(): FormGroup {
  return this.fb.group({
    skillName: ['', Validators.required],
    experienceInYears: ['', Validators.required],
    proficiency: ['', Validators.required]
  });
}

logValidationErrors(group: FormGroup = this.employeeForm): void {
  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl = group.get(key);
    this.formErros[key] = '';
    if (abstractControl && !abstractControl.valid &&
      (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
      const messages = this.validationMessages[key];

      for (const errorKey in abstractControl.errors) {
        if (errorKey) {
          this.formErros[key] += messages[errorKey] + ' ';
        }
      }
    }
    if (abstractControl instanceof FormGroup) {
      this.logValidationErrors(abstractControl);
    }

    // if (abstractControl instanceof FormArray) {
    //   for (const control of abstractControl.controls) {
    //     if (control instanceof FormGroup) {
    //       this.logValidationErrors(control);
    //     }
    //   }
    // }
  });
}

onContactPreferenceChanges(selectedValue: string) {
  const phoneFormControl = this.employeeForm.get('phone');
  if (selectedValue === 'phone') {
    phoneFormControl.setValidators(Validators.required);
  } else {
    phoneFormControl.clearValidators();
  }
  phoneFormControl.updateValueAndValidity();
}

onLoadDataClick(): void {
  // this.employeeForm.patchValue({
  //   fullName: 'Balaji',
  //   email: 'balajivm95@gmail.com',
  //   skills: {
  //     skillName: 'Angular',
  //     experienceInYears: 5,
  //     proficiency: 'beginner'
  //   }
  // });
  this.logValidationErrors(this.employeeForm);
}

mapFormValuesToEmployeeModel() {
  this.employee.fullName = this.employeeForm.value.fullName;
  this.employee.email = this.employeeForm.value.emailGroup.email;
  this.employee.contactPreference = this.employeeForm.value.contactPreference;
  this.employee.phone = this.employeeForm.value.phone;
  this.employee.skills = this.employeeForm.value.skills;
}


onSubmit(): void {
  this.mapFormValuesToEmployeeModel();
  if (this.employee.id) {
    this.employeeService.updateEmployee(this.employee).subscribe(
      () => this.router.navigate(['employees']),
      (error: any) => console.log(error)
      );
  } else {
    this.employeeService.addEmployee(this.employee).subscribe(
      () => this.router.navigate(['employees']),
      (error: any) => console.log(error)
      );
    }
  }

matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confrimEmailControl = group.get('confirmEmail');
  if (emailControl.value === confrimEmailControl.value || (confrimEmailControl.pristine && confrimEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
}
