// src/app/features/document/document.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document.component';
import { CommentSectionComponent } from '../../shared/components/comment-section/comment-section.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DocumentComponent, CommentSectionComponent],
  imports: [CommonModule, FormsModule],
  exports: [DocumentComponent],
})
export class DocumentModule {}
