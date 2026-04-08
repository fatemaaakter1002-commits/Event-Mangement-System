import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss']
})
export class UserManagementComponent implements OnInit {

  users:any[]=[];
  filteredUsers:any[]=[];
  employees:any[]=[];

  newUser:any={
    employeeId:'',
    username:'',
    password:'',
    role:'',
    status:'Active'
  };

  editId:number|null=null;
  searchText:string='';

  constructor(
    private userService:UserService,
    private employeeService:EmployeeService
  ){}

  ngOnInit(){
    this.loadEmployees();
    this.loadUsers();
  }

  // ================= LOAD USERS =================

  loadUsers(){

    this.userService.getAll().subscribe((data:any)=>{
      this.users=data;
      this.filteredUsers=data;
    });

  }

  // ================= LOAD EMPLOYEES =================

  loadEmployees(){

    this.employeeService.getAll().subscribe((data:any)=>{
      this.employees=data;
    });

  }

  // ================= SAVE USER =================

  saveUser(){

    if(this.editId){

      this.userService.update(this.editId,this.newUser)
      .subscribe(()=>{
        this.resetForm();
        this.loadUsers();
      });

    }else{

      this.userService.save(this.newUser)
      .subscribe(()=>{
        this.resetForm();
        this.loadUsers();
      });

    }

  }

  // ================= EDIT =================

  editUser(user:any){

    this.newUser={...user};
    this.editId=user.id;

  }

  // ================= DELETE =================

  deleteUser(id:number){

    if(confirm("Delete this user?")){

      this.userService.delete(id)
      .subscribe(()=>{
        this.loadUsers();
      });

    }

  }

  // ================= SEARCH =================

  search(){

    this.filteredUsers=this.users.filter(u=>
      u.username.toLowerCase()
      .includes(this.searchText.toLowerCase())
    );

  }

  // ================= RESET FORM =================

  resetForm(){

    this.newUser={
      employeeId:'',
      username:'',
      password:'',
      role:'',
      status:'Active'
    };

    this.editId=null;

  }

  // ================= GET EMPLOYEE NAME =================

  getEmployeeName(employeeId:number){

    const emp=this.employees.find(e=>e.id==employeeId);
    return emp?emp.name:'Unknown';

  }

}