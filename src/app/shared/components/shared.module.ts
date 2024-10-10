import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentSectionComponent } from './comment-section/comment-section.component';

@NgModule({
  declarations: [
    CommentSectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommentSectionComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
