import { Component } from '@angular/core';

import { ProjectService } from '../services/project.service';
@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class Project {
  projects: any; //variable to store the projects data for the UI
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe((data) => {
      console.log('Data received:', data);
      this.projects = data;
    });
  }
}
