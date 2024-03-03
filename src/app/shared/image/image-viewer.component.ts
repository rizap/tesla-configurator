import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  @Input()
  selectedImage: string | undefined;

  @Input()
  alt: string | undefined;
}
