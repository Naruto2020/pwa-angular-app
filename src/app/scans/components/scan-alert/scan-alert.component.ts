import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scan-alert',
  templateUrl: './scan-alert.component.html',
  styleUrls: ['./scan-alert.component.scss']
})
export class ScanAlertComponent implements OnInit {
  showScanAlert = true;

  @Input() scannedUrl: string | null = null;

  constructor() { }

  ngOnInit(): void {
    console.log('Scanned URL:', this.scannedUrl);
  }

  hideModal() {
    this.showScanAlert = false;
  }

}
