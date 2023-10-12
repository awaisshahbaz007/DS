import { Component, OnInit, ViewChild, ElementRef, forwardRef, Input, Output, EventEmitter } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { HelperService } from "src/app/core/service/helper.service";
import { SharedService } from 'src/app/core/service/shared.service';

@Component({
	selector: "app-file-upload",
	templateUrl: "./file-upload.component.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FileUploadComponent),
			multi: true,
		},
	],
	styleUrls: [
		"./file-upload.component.scss"
	],
})

export class FileUploadComponent implements ControlValueAccessor {
	@ViewChild('fileUploadInput') fileUploadInput: ElementRef;

	@Input() progress;
	@Input() dropFileDesign: boolean = false;
	@Input() headerFileDesign: boolean = true;
	@Output() upload_file_status = new EventEmitter<boolean>();

	private CMS_API_URL = environment.CMS_API_URL;
	allowedFormatsHTML = 'image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/svg, image/webp, video/mp4, video/avi, video/mov, video/wmv'
	allowedFormatsTS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/wmv'];

	CHUNK_SIZE = 1024 * 1024; // 1MB
	selectedFiles: File[];
	files_with_status: any = [];
	upload_started: boolean = false;
	progressValue = 0;
	isUploading: boolean;
	upload_text: string;
	uploaded_num_of_files: number = 0;
	uploading_num_of_files: number;

	onChange: any = () => { };
	onTouched: any = () => { };

	constructor(
		private http: HttpClient,
		private helperService: HelperService,
		private sharedService: SharedService,
	) {
	}

	writeValue(value: any): void {
		console.log("writeValue: ", value)
		// Set initial selected files value
		if (value && Array.isArray(value)) {
			this.selectedFiles = value;
		}
	}

	registerOnChange(fn: any): void {
		console.log("registerOnChange: ", fn)
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		console.log("registerOnTouched: ", fn)
		this.onTouched = fn;
	}

	calculatingFileUploadedStatus(current_chunk: number, total_chunks: number): number {
		let uploaded_chunks = (current_chunk / total_chunks) * 100;
		return Math.round(uploaded_chunks);
	}

	updateProgressStatus(name: string, status_percentage: number, upload_status: string, status_message: string = "", file_uploaded: boolean = false) {
		const itemToUpdate = this.files_with_status.find(item => item.name === name);
		console.log("itemToUpdate: ", itemToUpdate)
		if (itemToUpdate) {
			itemToUpdate.status_percentage = status_percentage;
			itemToUpdate.upload_status = upload_status;
			itemToUpdate.status_message = status_message;
			itemToUpdate.file_uploaded_status = file_uploaded;
		}
	}

	checkAllFilesUploaded(): boolean {
		let all_uploaded = true;
		for (var file of this.files_with_status) {
			if (file.upload_status == "Failed") {
				continue;
			}

			if (file.status_percentage !== 100) {
				all_uploaded = false;
			}
		}
		console.log("All Files uploaded? ", all_uploaded);
		return all_uploaded;
	}

	uploadingFile(file: File) {
		const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);
		const uniqueString = Math.random().toString(36).substr(2) + Date.now().toString(36);

		let folder_id = this.sharedService.getFolderIDValue() ? this.sharedService.getFolderIDValue().toString() : '';

		let currentChunk = 0;
		const uploadChunk = () => {
			const start = currentChunk * this.CHUNK_SIZE;
			const end = Math.min(start + this.CHUNK_SIZE, file.size);
			const chunk = file.slice(start, end);

			const formData = new FormData();
			formData.append('uuid', uniqueString);
			formData.append('file', chunk);
			formData.append('folderId', folder_id);
			formData.append('fileName', file.name);
			formData.append('fileType', file.type);
			formData.append('filesize', file.size.toString());
			formData.append('chunkindex', currentChunk.toString());
			formData.append('totalChunks', totalChunks.toString());
			formData.append('cancelUpload', 'false');

			this.http.post(`${this.CMS_API_URL}/cc/content/chunk`, formData, { reportProgress: true, observe: 'events' })
				.subscribe((event: HttpEvent<any>) => {
					let file_upload_status = false;
					let file_upload_message = "";
					
					if (event.type === HttpEventType.UploadProgress) {
						this.progressValue = Math.round((event.loaded / event.total!) * 100);
						// console.log(file.name + " chunk uploaded: " + this.progressValue + "%")
					}
					else if (event.type === HttpEventType.Response) {
						currentChunk++;

						if (currentChunk < totalChunks) {
							file_upload_message = "In Progress";
							uploadChunk();
						} else {
							file_upload_message = "Uploaded";
							file_upload_status = true;
							console.log(event.body.name + ' Uploading complete!');
						}

						let file_percentage_uploaded = this.calculatingFileUploadedStatus(currentChunk, totalChunks);
						console.log(file.name + " uploaded: " + file_percentage_uploaded + "%")

						this.updateProgressStatus(file.name, file_percentage_uploaded, file_upload_message, '', file_upload_status)

						if (file_percentage_uploaded == 100) {
							this.upload_file_status.emit(true); // To refresh DataTable
							this.uploaded_num_of_files += 1; 
							
							if (this.checkAllFilesUploaded()) {
								this.uploading_num_of_files = this.uploaded_num_of_files;
		
								let text = this.uploaded_num_of_files > 1 ? " items" : " item";
								this.upload_text = "Uploaded " + this.uploaded_num_of_files + text;
								this.isUploading = false;

								setTimeout(() => {
									this.closeUploadPopup();
								}, 3000);

								if(this.uploaded_num_of_files > 1) {
									this.helperService.showToasterNotifications("Success", "All Files Uploaded Successfully.");
								} else {
									this.helperService.showToasterNotifications("Success", "File Uploaded Successfully.");
								}
							}
						}
					}
				},
				(error: HttpErrorResponse) => {
					let error_message = JSON.stringify(error);
					console.error(file.name + ', error_message:' + error_message);					

					this.updateProgressStatus(file.name, 0, "Failed", error_message, false)
					this.helperService.showToasterNotifications("Error", this.helperService.textTransform(error_message, 50));

					if (this.checkAllFilesUploaded()) {
						this.uploading_num_of_files = this.uploaded_num_of_files;

						let text = this.uploaded_num_of_files > 1 ? " items" : " item";
						this.upload_text = "Uploaded " + this.uploaded_num_of_files + text;
						this.isUploading = false;

						setTimeout(() => {
							if(this.uploaded_num_of_files > 1) {
								this.helperService.showToasterNotifications("Success", "All Files Uploaded Successfully.");
							} else {
								this.helperService.showToasterNotifications("Success", "File Uploaded Successfully.");
							}

							setTimeout(() => {
								this.closeUploadPopup();
							}, 1000);
						}, 3000);
					}
				}
			);
		};

		uploadChunk();
	}

	onFileChange(event: any) {
		this.selectedFiles = event.target.files;

		this.uploaded_num_of_files = 0;
		let selected_files = [];
		for (var file of this.selectedFiles) {
			selected_files.push(
				{ 'name': file.name, 'status_percentage': 0, 'upload_status': 'Starting', 'status_message': '', 'file_uploaded_status': false }
			);
		}

		this.upload_started = true;
		this.isUploading = true;
		this.uploading_num_of_files = selected_files.length;
		this.files_with_status = selected_files;

		let text = this.uploading_num_of_files > 1 ? " items" : " item";
		this.upload_text = "Uploading " + this.uploading_num_of_files + text;


		for (var file of this.selectedFiles) {
			if (this.allowedFormatsTS.indexOf(file.type) === -1) {
				console.log(file.name + ' File not uploading due to invalid file format: ' + file.type);
				this.helperService.showToasterNotifications("Error", "Unsupported File Format: " + file.name);
				this.updateProgressStatus(file.name, 0, 'Failed', "Unsupported File Format", false)
				continue;
			}

			this.uploadingFile(file)
		}
	}

	onminmize() {
		console.log("onminmize: ")
		const element = document.querySelector('.uploaded_popup');
		if (!element.classList.contains('close_div')) {
			element.classList.add('close_div');
		} else {
			element.classList.remove('close_div');
		}
	}

	closeUploadPopup() {
		console.log("closeUploadPopup")
		this.resetFileUploadParams();
		const element = document.querySelector('.uploaded_popup');
		element.remove();
		this.fileUploadInput.nativeElement.value = null;
	}

	onCancelUpload() {
		console.log("onCancelUpload")
		// this.resetFileUploadParams();
	}

	resetFileUploadParams() {
		this.upload_text = "";
		this.uploaded_num_of_files = 0;
		this.upload_started = false;
		this.files_with_status = [];
		this.selectedFiles = [];
	}
}
