import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import{NgToastService} from 'ng-angular-popup' 
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../Models/user.models';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent {
  public packages = ["Monthly", "Quaterly", "Yearly"];
  public gender = ["Male", "Female"];
  public importantList: string[] = [
    "Obese",
    "Feel Good",
    "Look Good",
    "Fat Burn",
    "Running"
  ];

  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActive: boolean =false;


  constructor(private fb: FormBuilder, private api:ApiService, 
    private toastService :NgToastService, private activatedRoute: ActivatedRoute,
    private router: Router) {

  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiresult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']

    });
    this.registerForm.controls['height'].valueChanges.subscribe(res =>{
      this.calculateBmi(res);
    });


    this.activatedRoute.params.subscribe(value =>{
      this.userIdToUpdate = value['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate)
      .subscribe(res =>{
        this.isUpdateActive = true;
        this.fillFormToUpdate(res)
      })
    })
  }
  submit(){
    console.log(this.registerForm.value);
this.api.postRegistration(this.registerForm.value)
.subscribe(res =>{
this.toastService.success({detail:'Sucess', summary:"Enquiry Added", duration: 3000});
this.registerForm.reset();
})
  }
update (){
  this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
.subscribe(res =>{
this.toastService.success({detail:'Sucess', summary:"Enquiry Updated", duration: 3000});
this.registerForm.reset();
this.router.navigate(['list'])
})
}

  calculateBmi(heightValue:number) {
    const weight = this.registerForm.value.height;
    const height = heightValue;
    const bmi= weight/(height*height) ;

  this.registerForm.controls['bmi'].patchValue(bmi);
  switch (true) {
    case bmi < 18.5:
      this.registerForm.controls['bmiresult'].patchValue("Underweight")
      break;
      case bmi >= 18.5 && bmi < 25:
        this.registerForm.controls['bmiresult'].patchValue("Normal")
        break;
        case bmi >=25 && bmi <30:
      this.registerForm.controls['bmiresult'].patchValue("Overweight")
      break;
    default:
      this.registerForm.controls['bmiresult'].patchValue("Obese")

      break;
  }

  }
fillFormToUpdate (user:User){
  this.registerForm.setValue({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    mobile: user.mobile,
    weight : user.weight,
    height : user.height,
    bmi : user.bmi,
    bmiresult : user.bmiresult,
    gender : user.gender,
    requireTrainer : user.requireTrainer,
    package: user.package,
    important : user.important,
    haveGymBefore: user.haveGymBefore,
    enquiryDate: user.enquiryDate 
    })

}


}
