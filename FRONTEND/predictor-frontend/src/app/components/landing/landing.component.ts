import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({ 
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
}) 
export class LandingComponent {

  constructor(private router: Router) {

      }

  navLinks = [
    { label: 'Technology', href: '#tech' },
    { label: 'Ophthalmology', href: '#ophtha' },
    { label: 'Insights', href: '#insights' }
  ];

  features = [
    {
      title: 'Automated Grading',
      desc: 'Instant stage categorization using state-of-the-art neural networks trained on clinical datasets.'
    },
    {
      title: 'Clinical Integration',
      desc: 'Seamlessly connects with existing patient records and hospital management systems.'
    },
    {
      title: 'Precision Analytics',
      desc: 'High-confidence scoring with heatmaps identifying specific retinal micro-lesions.'
    }
  ];

  signIn(){
    this.router.navigate(['/signin'])
  }
}
