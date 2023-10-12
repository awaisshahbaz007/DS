import { Component, Inject,AfterViewInit,ViewChild,ElementRef   } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SlickCarouselComponent } from 'ngx-slick-carousel';
@Component({
  selector: 'app-preview-playlist',
  templateUrl: './preview-playlist.component.html',
  styleUrls: ['./preview-playlist.component.scss']
})
export class PreviewPlaylistComponent {
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;
    @ViewChild('videoPlayer') videoPlayer: ElementRef;
  constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		console.log("preview data: ", data)
	}
  ngAfterViewInit() {
    // Initialize the carousel
    this.slickModal.initSlick();
  }
    slickConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    speed: 1000,
    pauseOnFocus: false,
    pauseOnHover: false,
  };

}
